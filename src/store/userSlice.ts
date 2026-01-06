'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

interface UserState {
  email: string | null;
  role: string | null;
  isAuthenticated: boolean;
}

interface JwtPayload {
  sub: string;
  role: string;
  iat: number;
  exp: number;
}

const getInitialAuthState = (): UserState => {
  if (typeof window !== 'undefined') {
    const token = Cookies.get('accessToken');
    if (token) {
      try {
        const decoded: JwtPayload = jwtDecode(token);
        return {
          email: decoded.sub,
          role: decoded.role,
          isAuthenticated: true,
        };
      } catch (e) {
        return { email: null, role: null, isAuthenticated: false };
      }
    }
  }
  return { email: null, role: null, isAuthenticated: false };
};

const initialState: UserState = getInitialAuthState();

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setUserFromToken(state, action: PayloadAction<string>) {
      const token = action.payload;
      try {
        const decoded: JwtPayload = jwtDecode(token);
        state.email = decoded.sub;
        state.role = decoded.role;
        state.isAuthenticated = true;
      } catch {
        state.email = null;
        state.role = null;
        state.isAuthenticated = false;
      }
    },
    logout(state) {
      Cookies.remove('accessToken');
      state.email = null;
      state.role = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUserFromToken, logout } = userSlice.actions;
export default userSlice.reducer;
