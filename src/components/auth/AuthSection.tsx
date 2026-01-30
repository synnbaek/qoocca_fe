"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { logout } from "@/store/userSlice";
import axiosInstance from "@/api/axiosInstance";
import Cookies from "js-cookie";
import styles from "../layout/Header.module.css";
import { createPortal } from "react-dom";

export default function AuthSection() {
  const { role, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout");
    } catch (err) {
      console.error("서버 로그아웃 실패: ", err);
    }
    Cookies.remove("accessToken");
    dispatch(logout());
    router.push("/login");
  };

  if (!isMounted) return null;

  if (!isAuthenticated) {
    return (
      <Link href="/login" className={styles.authLink}>
        회원가입/로그인
      </Link>
    );
  }

  const dropdownContent = (
    <div className={styles.notificationDropdown}>
      <div className={styles.notificationHeader}>
        <span>알림</span>
        <button className={styles.markAllRead}>모두 읽음</button>
      </div>
      <div className={styles.notificationList}>
        {/* Dummy Data */}
        <div className={`${styles.notificationItem} ${styles.unread}`}>
          <div className={styles.notiTitle}>출결 알림</div>
          <div className={styles.notiDesc}>김철수 학생이 등원하였습니다.</div>
          <div className={styles.notiTime}>방금 전</div>
        </div>
        <div className={styles.notificationItem}>
          <div className={styles.notiTitle}>수납 알림</div>
          <div className={styles.notiDesc}>이영희 학생의 2월 수강료가 결제되었습니다.</div>
          <div className={styles.notiTime}>1시간 전</div>
        </div>
        <div className={styles.notificationItem}>
          <div className={styles.notiTitle}>공지사항</div>
          <div className={styles.notiDesc}>시스템 점검 안내 (2/1 00:00 ~ 02:00)</div>
          <div className={styles.notiTime}>어제</div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ... previous JSX ... */}
      
      <div className={styles.notificationWrapper} ref={notificationRef}>
        <button type="button" onClick={() => setIsNotificationOpen(!isNotificationOpen)}>
          알림
        </button>
        
        {isNotificationOpen && (
          <>
            {/* Desktop: Render in-place (Absolute) */}
            <div className={styles.desktopOnly}>
               {dropdownContent}
            </div>

            {/* Mobile: Render via Portal (Fixed, Global) */}
            {createPortal(
              <div className={styles.mobileOnly}>
                <div className={styles.mobileOverlay} onClick={() => setIsNotificationOpen(false)} />
                {dropdownContent}
              </div>,
              document.body
            )}
          </>
        )}
      </div>

      <Link href="/academy/register">학원 등록</Link>
      <button type="button" onClick={handleLogout}>
        로그아웃
      </button>
    </>
  );
}
