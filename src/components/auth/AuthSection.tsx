'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/userSlice';
import axiosInstance from '@/api/axiosInstance';
import Cookies from 'js-cookie';
import styles from './AuthSection.module.css';

export default function AuthSection() {
  const { role, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/api/auth/logout');
    } catch (err) {
      console.error('서버 로그아웃 실패: ', err);
    }
    Cookies.remove('accessToken');
    dispatch(logout());
    router.push('/login');
  };

  if (!isMounted) {
    return (
      <div className={styles.logoutBtn} style={{ visibility: 'hidden' }}>
        로그아웃
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Link href="/login">회원가입/로그인</Link>;
  }

  return (
    <>
      {role === 'ROLE_ADMIN' && <Link href="/admin">관리자</Link>}
      <button onClick={handleLogout} className={styles.logoutBtn}>
        로그아웃
      </button>
    </>
  );
}
