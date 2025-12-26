'use client';

import { store } from '@/store';
import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { setUserFromToken } from '@/store/userSlice';

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = Cookies.get('accessToken');
    if (token) {
      dispatch(setUserFromToken(token));
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
