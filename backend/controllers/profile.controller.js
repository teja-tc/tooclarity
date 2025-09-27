const InstituteAdmin = require("../models/InstituteAdmin");
const CookieUtil = require("../utils/cookie.util");

exports.getProfile = async (req, res, next) => {
  try {
    // Student role branch: return minimal data + Google profile details if available
    if (req.userRole === "STUDENT") {
      const username = CookieUtil.getCookie(req, "username") || "Student";
      const userId = req.userId; // e.g., google:123

      let provider = "unknown";
      let providerUserId = userId;
      if (userId.startsWith("google:")) {
        provider = "google";
        providerUserId = userId.replace("google:", "");
      } else if (userId.startsWith("microsoft:")) {
        provider = "microsoft";
        providerUserId = userId.replace("microsoft:", "");
      } else if (userId.startsWith("apple:")) {
        provider = "apple";
        providerUserId = userId.replace("apple:", "");
      }

      // Try to enrich with profile snapshot from Redis (Google callback stored it)
      let profileExtra = null;
      try {
        if (provider === "google") {
          const redis = require("../config/redisConfig");
          const raw = await redis.get(`sp:${providerUserId}`);
          if (raw) profileExtra = JSON.parse(raw);
        }
      } catch (e) {
        // non-fatal
      }

      // If some fields are missing, try live People API fetch using access token
      try {
        if (provider === "google") {
          console.log('Checking if live fetch needed for providerUserId:', providerUserId);
          console.log('Current profileExtra:', JSON.stringify(profileExtra, null, 2));
          
          const needLive = !profileExtra || [
            profileExtra?.birthday,
            profileExtra?.gender,
            profileExtra?.phone,
            profileExtra?.organization,
            profileExtra?.address,
            profileExtra?.picture,
            profileExtra?.givenName,
            profileExtra?.familyName,
            profileExtra?.email
          ].some(v => v == null);
          
          console.log('Need live fetch:', needLive);
          
          if (needLive) {
            const redis = require("../config/redisConfig");
            let at = await redis.get(`ga:${providerUserId}:at`);
            console.log('Access token from Redis:', at ? 'present' : 'missing');
            
            // If no access token or expired, try to refresh
            if (!at) {
              try {
                console.log('No access token found, attempting refresh...');
                const { refreshGoogleAccessToken } = require('./auth.controller');
                at = await refreshGoogleAccessToken(providerUserId);
                console.log('Access token refreshed successfully');
              } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                // Continue without access token
              }
            }
            
            if (at) {
              console.log('Making live People API call...');
              const peopleRes = await fetch(
                "https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,photos,genders,birthdays,phoneNumbers,organizations,addresses,urls",
                { headers: { Authorization: `Bearer ${at}` } }
              );
              console.log('Live People API response status:', peopleRes.status);
              
              if (peopleRes.ok) {
                const people = await peopleRes.json();
                console.log("Live People API Response:", JSON.stringify(people, null, 2));
                
                const primaryEmail = profileExtra?.email ?? people?.emailAddresses?.[0]?.value ?? null;
                const photoUrl = profileExtra?.picture ?? people?.photos?.[0]?.url ?? null;
                const givenName = profileExtra?.givenName ?? people?.names?.[0]?.givenName ?? null;
                const familyName = profileExtra?.familyName ?? people?.names?.[0]?.familyName ?? null;
                const fullName = (profileExtra?.name ?? people?.names?.[0]?.displayName ?? `${(givenName ?? "")} ${(familyName ?? "")}`.trim()) || null;
                
          
                // Fix birthday extraction - try both text and date
                const birthdayObj = profileExtra?.birthday ?? (people?.birthdays?.[0]?.text ?? people?.birthdays?.[0]?.date ?? null);
                
                // Fix other field extractions
                const gender = profileExtra?.gender ?? (people?.genders?.[0]?.value ?? null);
                const phone = profileExtra?.phone ?? (people?.phoneNumbers?.[0]?.value ?? null);
                const organization = profileExtra?.organization ?? (people?.organizations?.[0]?.name ?? null);
                const address = profileExtra?.address ?? (people?.addresses?.[0]?.formattedValue ?? null);

                console.log("Live extracted fields:", {
                
                  birthdayObj,
                  gender,
                  phone,
                  organization,
                  address
                });

                // normalize
                profileExtra = {
                  ...(profileExtra || {}),
                  email: primaryEmail,
                  picture: photoUrl,
                  givenName,
                  familyName,
                  name: fullName,
                  birthday: birthdayObj,
                  gender,
                  phone,
                  organization,
                  address,
                };

                // Store updated profile snapshot
                try {
                  await require("../config/redisConfig").set(
                    `sp:${providerUserId}`,
                    JSON.stringify(profileExtra),
                    "PX",
                    7 * 24 * 60 * 60 * 1000
                  );
                  console.log('Updated profile snapshot saved to Redis');
                } catch (redisError) {
                  console.error('Failed to save profile snapshot to Redis:', redisError);
                  // Non-critical: profile data will be fetched live on next request
                }
              } else if (peopleRes.status === 401) {
                // Token expired, try to refresh
                try {
                  console.log('Access token expired, attempting refresh...');
                  const { refreshGoogleAccessToken } = require('./auth.controller');
                  const newAccessToken = await refreshGoogleAccessToken(providerUserId);
                  
                  // Retry with new token
                  const retryRes = await fetch(
                    "https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,photos,genders,birthdays,phoneNumbers,organizations,addresses,urls",
                    { headers: { Authorization: `Bearer ${newAccessToken}` } }
                  );
                  
                  if (retryRes.ok) {
                    const people = await retryRes.json();
                    // ... process the response ...
                  }
                } catch (refreshError) {
                  console.error('Token refresh failed on retry:', refreshError);
                }
              } else {
                const errorText = await peopleRes.text();
                console.log('Live People API error:', errorText);
              }
            }
          }
        }
      } catch (e) {
        console.error("Live People API fetch error:", e);
        // ignore live fetch failures
      }

      return res.status(200).json({
        success: true,
        message: "Student profile fetched successfully",
        data: {
          id: userId,
          name: username ?? profileExtra?.name ?? null,
          role: "STUDENT",
          // Removed: provider, providerUserId, loginMethod
          isStudent: true,
          // Google profile fields when available
          email: profileExtra?.email ?? null,
          emailVerified: profileExtra?.emailVerified ?? null,
          picture: profileExtra?.picture ?? null,
          givenName: profileExtra?.givenName ?? null,
          familyName: profileExtra?.familyName ?? null,
          birthday: profileExtra?.birthday ?? null,
          gender: profileExtra?.gender ?? null,
          phone: profileExtra?.phone ?? null,
          organization: profileExtra?.organization ?? null,
          address: profileExtra?.address ?? null,
        },
      });
    }

    // Institute admin branch (existing logic)
    const user = await InstituteAdmin.findById(req.userId).select("name email contactNumber institution role isProfileCompleted isPaymentDone");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed. User no longer exists.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        contactNumber: user.contactNumber,
        institution: user.institution,
        role: user.role,
        isProfileCompleted: user.isProfileCompleted,
        isPaymentDone: user.isPaymentDone,
      },
    });
  } catch (error) {
    next(error);
  }
};
