"use client";

import { memo } from "react";
import socialStyles from "./SocialLogin.module.css";
import KakaoLogin from "./KakaoLogin";
import NaverLogin from "./NaverLogin";

const SocialSection = memo(function SocialSection() {
  return (
    <div className={socialStyles.socialSection}>
      <KakaoLogin />
      <NaverLogin />
    </div>
  );
});

export default SocialSection;
