'use client';

import { KakaoIcon, NaverIcon } from '../icons/SocialIcons';
import styles from './Loading.module.css';

interface LoadingProps {
  provider?: 'kakao' | 'naver' | 'default';
}

export default function Loading({ provider = 'default' }: LoadingProps) {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        {provider === 'default' ? (
          <div className={styles.loadingWrapper} style={{ flexDirection: 'column' }}>
            <div className={styles.spinner}></div>
            <div className={styles.loadingText}>수업 정보를 불러오고 있어요</div>
          </div>
        ) : (
          <>
            <div className={`${styles.bouncingIcon} ${styles[provider]}`}>
              {provider === 'kakao' ? (
                <KakaoIcon width={40} height={40} />
              ) : (
                <NaverIcon width={32} height={32} />
              )}
            </div>
            <div className={styles.shadow}></div>
          </>
        )}
      </div>
    </div>
  );
}