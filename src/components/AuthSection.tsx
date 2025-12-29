'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/userSlice';
import axiosInstance from '@/api/axiosInstance';
import Cookies from 'js-cookie';
import './AuthSection.css';

export default function AuthSection() {
  const { role, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );
  const router = useRouter();
  const dispatch = useDispatch();

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

  if (!isAuthenticated) {
    return <Link href="/login">회원가입/로그인</Link>;
  }

  return (
    <>
      {role === 'ROLE_ADMIN' && <Link href="/admin">관리자</Link>}
      <button onClick={handleLogout} className="logout-btn">
        로그아웃
      </button>
    </>
  );
}
