'use client';

import React from 'react';
import styles from './SettingsSection.module.css';

interface SettingItem {
  icon: string;
  label: string;
  onClick?: () => void;
  isDangerous?: boolean;
}

interface SettingsSectionProps {
  title?: string;
  items: SettingItem[];
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  items,
}) => {
  return (
    <div className={styles.section}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.list}>
        {items.map((item, index) => (
          <button
            key={index}
            className={`${styles.item} ${
              item.isDangerous ? styles.dangerous : ''
            }`}
            onClick={item.onClick}
          >
            <div className={styles.left}>
              <div className={styles.icon}>{item.icon}</div>
              <div className={styles.text}>{item.label}</div>
            </div>
            <div className={styles.arrow}>›</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SettingsSection;