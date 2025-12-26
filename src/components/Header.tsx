'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/userSlice';
import axiosInstance from '@/api/axiosInstance';
import Cookies from 'js-cookie';
import './Header.css';

export default function Header() {
  const pathname = usePathname();
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
      <div className="navbar-logo">쿠카티처스</div>
      <div className="navbar-links">
        <Link href="/" className={pathname === '/' ? 'active' : ''}>
          홈
        </Link>
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
            <Link href="/login">로그인</Link>
            <Link href="/signup">회원가입</Link>
          </>
        )}
      </div>
    </nav>
  );
}
