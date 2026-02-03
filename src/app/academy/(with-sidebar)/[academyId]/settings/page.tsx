'use client';

import { useRouter } from 'next/navigation';
import styles from './SettingsPage.module.css';

export default function SettingsPage() {
    const router = useRouter();

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button type="button" onClick={() => router.back()} className={styles.backBtn}>
                    &lt; 이전
                </button>
                <h1>설정</h1>
            </header>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>학원 설정</h2>
                <div className={styles.card}>
                    <div className={styles.item}>
                        <div className={styles.itemInfo}>
                            <span className={styles.label}>알림 설정</span>
                            <p className={styles.description}>학원 운영 관련 중요 알림을 받습니다.</p>
                        </div>
                        <label className={styles.toggleSwitch}>
                            <input type="checkbox" defaultChecked />
                            <span className={styles.slider}></span>
                        </label>
                    </div>
                    <div className={styles.divider} />
                    <div className={styles.item}>
                        <div className={styles.itemInfo}>
                            <span className={styles.label}>다크 모드</span>
                            <p className={styles.description}>화면을 어둡게 설정하여 눈의 피로를 줄입니다.</p>
                        </div>
                        <label className={styles.toggleSwitch}>
                            <input type="checkbox" />
                            <span className={styles.slider}></span>
                        </label>
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>계정 및 정보</h2>
                <div className={styles.card}>
                    <div className={styles.item} onClick={() => { }}>
                        <div className={styles.itemInfo}>
                            <span className={styles.label}>계정 정보</span>
                            <p className={styles.description}>로그인된 계정의 정보를 확인합니다.</p>
                        </div>
                        <span className={styles.arrow}>{'>'}</span>
                    </div>
                    <div className={styles.divider} />
                    <div className={styles.item}>
                        <div className={styles.itemInfo}>
                            <span className={styles.label}>버전 정보</span>
                            <p className={styles.description}>현재 버전 v1.0.0</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className={styles.footer}>
                <p>도움이 필요하신가요? <a href="#" className={styles.link}>고객센터 문의하기</a></p>
            </div>
        </div>
    );
}
