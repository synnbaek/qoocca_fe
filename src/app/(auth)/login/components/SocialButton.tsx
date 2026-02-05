"use client";

import { memo } from "react";
import styles from "./SocialButton.module.css";

interface SocialButtonProps {
  provider: "kakao" | "naver";
  authUrl: string;
  icon: React.ReactNode;
  label: string;
}

const SocialButton = memo(function SocialButton({
  provider,
  authUrl,
  icon,
  label,
}: SocialButtonProps) {
  const handleLogin = () => {
    window.location.href = authUrl;
  };

  return (
    <button
      type="button"
      onClick={handleLogin}
      className={`${styles.customSocialBtn} ${styles[provider]}`}
    >
      {icon}
      {label}
    </button>
  );
});

export default SocialButton;