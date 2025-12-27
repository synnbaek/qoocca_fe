'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/userSlice';
import axiosInstance from '@/api/axiosInstance';
import Cookies from 'js-cookie';
import './Header.css';

export default function Header() {
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

  return (
    <nav className="navbar">
      <Link
        href="/"
        className="navbar-logo"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        쿠카티처스
      </Link>
      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            {role === 'ROLE_ADMIN' && <Link href="/admin">관리자</Link>}
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                font: 'inherit',
              }}
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link href="/login">회원가입/로그인</Link>
          </>
        )}
      </div>
    </nav>
  );
}
