'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

interface UserState {
  email: string | null;
  role: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  email: null,
  role: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserFromToken(state, action: PayloadAction<string>) {
      const token = action.payload;
      try {
        const decoded: any = jwtDecode(token);
        state.email = decoded.sub;
        state.role = decoded.role;
        state.isAuthenticated = true;
      } catch {
        // 토큰 에러 처리
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
