"use client";

import { KakaoIcon, NaverIcon } from "../icons/SocialIcons";
import styles from "./Loading.module.css";

interface LoadingProps {
  provider?: "kakao" | "naver";
}

export default function Loading({ provider = "kakao" }: LoadingProps) {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <div className={`${styles.bouncingIcon} ${styles[provider]}`}>
          {provider === "kakao" ? (
            <KakaoIcon width={40} height={40} />
          ) : (
            <NaverIcon width={32} height={32} />
          )}
        </div>
        <div className={styles.shadow}></div>
      </div>
    </div>
  );
}
