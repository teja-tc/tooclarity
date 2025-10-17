'use client';

import React from 'react';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  /** Icon type: 'notification', 'wishlist', or 'search' - uses SVG from public folder */
  iconType?: 'notification' | 'wishlist' | 'search';
  /** Custom React element to render as icon (overrides iconType) */
  customIcon?: React.ReactNode;
  title: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

/**
 * EmptyState Component - Displays empty state with icon and message
 * Features: Built-in SVG icons for notifications, wishlist, and search
 * Can accept custom icon element
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  iconType = 'notification',
  customIcon,
  title,
  description,
  buttonText,
  onButtonClick,
}) => {
  // Render custom icon if provided
  if (customIcon) {
    return (
      <div className={styles.container}>
        <div className={styles.iconContainer}>{customIcon}</div>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
        {buttonText && (
          <button className={styles.button} onClick={onButtonClick}>
            {buttonText}
          </button>
        )}
      </div>
    );
  }

  // Default SVG icons
  const renderIcon = () => {
    switch (iconType) {
      case 'notification':
        return (
          <svg
            className={styles.icon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        );
      case 'wishlist':
        return (
          <svg
            className={styles.icon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        );
      case 'search':
      default:
        return (
          <svg
            className={styles.icon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>{renderIcon()}</div>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      {buttonText && (
        <button className={styles.button} onClick={onButtonClick}>
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;