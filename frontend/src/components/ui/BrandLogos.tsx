import React from "react";

export const WhatsAppLogo: React.FC<{ width?: number; height?: number }> = ({ width = 100, height = 180 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.52 3.48A11.94 11.94 0 0 0 12.06 0C5.48 0 .14 5.35.14 11.94c0 2.1.55 4.15 1.6 5.97L0 24l6.29-1.7a11.9 11.9 0 0 0 5.77 1.53h.01c6.58 0 11.93-5.35 11.93-11.93c0-3.19-1.24-6.19-3.48-8.42z" fill="#ffffff" fillOpacity=".2"/>
    <path d="M12.06 2.02c-5.48 0-9.93 4.45-9.93 9.93c0 2.1.65 4.07 1.85 5.7l-1.2 3.9l4.02-1.17a9.87 9.87 0 0 0 5.26 1.55c5.48 0 9.93-4.45 9.93-9.93s-4.45-9.98-9.93-9.98z" fill="#ffffff"/>
    <path d="M9.15 7.43c-.18-.4-.35-.41-.51-.42l-.43-.01a.82.82 0 0 0-.59.28c-.2.2-.77.76-.77 1.84s.79 2.14.9 2.29c.11.15 1.56 2.48 3.83 3.38c1.89.75 2.27.6 2.68.56c.41-.04 1.32-.54 1.5-1.07c.18-.53.18-.98.12-1.07c-.06-.09-.2-.15-.41-.27c-.21-.12-1.32-.65-1.53-.72c-.21-.08-.36-.12-.51.12c-.15.24-.58.72-.71.86c-.13.15-.26.17-.47.06c-.21-.12-.89-.33-1.69-1.05c-.62-.55-1.04-1.23-1.17-1.44c-.12-.21-.01-.32.1-.44c.1-.1.21-.26.31-.39c.1-.13.13-.23.19-.38c.06-.15.03-.29-.02-.41c-.05-.12-.46-1.11-.64-1.52z" fill="#25D366"/>
  </svg>
);

export const XLogo: React.FC<{ width?: number; height?: number; fill?: string }> = ({ width = 22, height = 22, fill = "#ffffff" }) => (
  <svg width={width} height={height} viewBox="0 0 1200 1227" xmlns="http://www.w3.org/2000/svg" fill={fill}>
    <path d="M714 0h269L461 529l564 698H756L463 883L136 1227H0l377-396L0 0h280l247 403L714 0zm-94 277l-86 91l357 569h104L620 412l313-332h-99L543 373L303 0H87l533 843l-156 165h98l124-132l203 325h209L620 412l-0-135z"/>
  </svg>
);

export const LinkedInLogo: React.FC<{ width?: number; height?: number }> = ({ width = 30, height = 30 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4" fill="#0A66C2"/>
    <path d="M7.2 9H4.6v10H7.2V9zM5.9 7.7c.8 0 1.4-.6 1.4-1.3c0-.8-.6-1.4-1.4-1.4c-.8 0-1.4.6-1.4 1.4c0 .7.6 1.3 1.4 1.3zM19.4 19H16.8v-5.3c0-1.3-.5-2.1-1.6-2.1c-.9 0-1.3.6-1.6 1.1c-.1.2-.1.5-.1.8V19H11v-10h2.6v1.4c.3-.5 1.1-1.6 2.7-1.6c2 0 3.1 1.3 3.1 3.8V19z" fill="#ffffff"/>
  </svg>
);