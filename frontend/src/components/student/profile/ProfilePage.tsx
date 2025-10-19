"use client";

import React, { useMemo, useState, useEffect } from "react";
import styles from "./ProfilePage.module.css";
import ProfileHeader from "./ProfileHeader";
import ProfileStats from "./ProfileStats";
import SettingsSection from "./SettingsSection";
import { useAuth } from "@/lib/auth-context";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  // Wishlist count comes from localStorage key 'wishlistedCourses'
  const [wishlistCount, setWishlistCount] = useState<number | string>(() => {
  if (typeof window === 'undefined') return (user as any)?.metrics?.wishlistCount ?? "--";
    try {
      const saved = localStorage.getItem('wishlistedCourses');
      return saved ? JSON.parse(saved).length : 0;
    } catch (e) {
  return (user as any)?.metrics?.wishlistCount ?? "--";
    }
  });

  useEffect(() => {
    const read = () => {
      try {
        const saved = localStorage.getItem('wishlistedCourses');
        setWishlistCount(saved ? JSON.parse(saved).length : 0);
      } catch (e) {
  setWishlistCount((user as any)?.metrics?.wishlistCount ?? "--");
      }
    };

    // Listen for cross-tab storage changes
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'wishlistedCourses') read();
    };

    // Listen for same-tab custom events dispatched by components
    const onCustom = () => read();

    window.addEventListener('storage', onStorage);
    window.addEventListener('wishlistUpdated', onCustom as EventListener);

    // initial read in case something changed
    read();

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('wishlistUpdated', onCustom as EventListener);
    };
  }, [(user as any)?.metrics?.wishlistCount]);

  const stats = useMemo(
    () => [
      {
        icon: "📚",
  value: (user as any)?.metrics?.programsVisited ?? "--",
        label: "Programs Visited",
      },
      {
        icon: "🔖",
  value: wishlistCount ?? (user as any)?.metrics?.wishlistCount ?? "--",
        label: "Wishlist",
      },
      {
        icon: "📝",
  value: (user as any)?.metrics?.requestsRaised ?? "--",
        label: "Requests Raised",
      },
    ],
  [(user as any)?.metrics?.programsVisited, (user as any)?.metrics?.wishlistCount, (user as any)?.metrics?.requestsRaised]
  );

  const settings = useMemo(
    () => [
      {
        icon: "👤",
        label: "Profile",
      },
      {
        icon: "🔔",
        label: "Notifications",
      },
      {
        icon: "❓",
        label: "Help center",
      },
      {
        icon: "🔐",
        label: "Security & Privacy",
      },
      {
        icon: "🚪",
        label: "Logout",
        isDangerous: true,
      },
    ],
    []
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.card}>
        <ProfileHeader
          name={user?.name || "--"}
          email={user?.email || "--"}
        />
        <ProfileStats stats={stats} />
        <SettingsSection items={settings} />
      </div>
    </div>
  );
};

export default ProfilePage;
