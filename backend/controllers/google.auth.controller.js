const axios = require("axios");
const { register, login } = require("./auth.controller");

exports.googleAuthCallback = async (req, res, next) => {
  try {
    const code = req.query.code;
    const rawState = req.query.state;

    if (!code) {
      return res
        .status(400)
        .json({ status: "fail", message: "Missing authorization code" });
    }

    let stateData = {};
    try {
      stateData = JSON.parse(rawState);
    } catch (err) {
      console.warn("Invalid state param:", rawState);
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid state parameter" });
    }

    const state = stateData.state; // student | institution | admin
    const type = stateData.type; // login | register
    const device = stateData.device; // web | mobile

    const CLIENT_ORIGIN =
      device === "web"
        ? process.env.CLIENT_ORIGIN_WEB
        : process.env.CLIENT_ORIGIN_MOBILE

    // 1. Exchange code for tokens from Google
    const { data } = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { id_token } = data;
    if (!id_token) {
      return res
        .status(401)
        .json({ status: "fail", message: "Google authentication failed" });
    }

    // 2. Decode Google id_token
    const payload = JSON.parse(
      Buffer.from(id_token.split(".")[1], "base64").toString()
    );
    const { email, name, picture, sub } = payload;

    // 3. Attach normalized body for auth.controller
    req.body = {
      name,
      email,
      contactNumber: "", // phone not available from Google
      address: "",
      profilePicture: picture || "",
      googleId: sub,
      type: state, // student | institution | admin
    };

    if (type === "login") {
      try {
        await login(req, res, next, { returnTokens: true });
        if (state === "student") {
          return res.redirect(`${CLIENT_ORIGIN}/student/login`);
        } else if (state === "institution") {
          return res.redirect(`${CLIENT_ORIGIN}`);
        }
      } catch (err) {
        console.warn("Login failed:", err.message);
        if(state === "student"){
          return res.redirect(`${CLIENT_ORIGIN}/student/login?error=not_registered`)
        }
        if(state === "institution"){
          return res.redirect(`${CLIENT_ORIGIN}?error=not_registered`)
        }
      }
    }
    else if(type === "register"){
      try{
        await register(req, res, next, { returnTokens: true});
        if(state === "student"){
           return res.redirect(`${CLIENT_ORIGIN}/student/onboarding`);
        }
        else if(state === "institution"){
          return res.redirect(`${CLIENT_ORIGIN}`)
        }
      }
      catch(err){
        console.warn("Registeration failed:", err.message)
        if(state === "student"){
          return res.redirect(`${CLIENT_ORIGIN}/student/register?error=already_registered`)
        }
        else if(state === "institution"){
          return res.redirect(`${CLIENT_ORIGIN}?error=already_registered`)
        }
      }
    }

    return res
      .status(400)
      .json({ status: "fail", message: "Invalid type parameter" });
  } catch (error) {
    console.error("Google OAuth error:", error.message);
    next(error);
  }
};
