'use client';

import { store } from '@/store';
import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { setUserFromToken, logout } from '@/store/userSlice';

/*
Redux 상태를 초기화하고 앱 전체에 공유하기 위한 설정 파일
1. 전역 상태 관리
2. 새로고침 시 로그인 유지
*/
function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = Cookies.get('accessToken');
    if (token) {
      dispatch(setUserFromToken(token));
    } else {
      dispatch(logout());
    }
  }, [dispatch]);

  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}