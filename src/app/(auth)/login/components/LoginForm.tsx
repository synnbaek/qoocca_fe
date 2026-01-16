'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setUserFromToken } from '@/store/userSlice';
import { authService } from '@/services/authService';
import styles from './LoginForm.module.css';
import { toast } from 'sonner';

import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Loading from '@/components/common/Loading';

export default function LoginForm() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await authService.login({
        email,
        password
      });

      const { accessToken, academyId } = data;

      if (accessToken) {
        dispatch(setUserFromToken(accessToken));
      }

      if (academyId) {
        router.push(`/academy/${academyId}`);
      } else {
        router.push('/academy/register');
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || '로그인을 실패했습니다.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className={styles.form}>
      <Input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={isLoading}
      />
      <Input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={isLoading}
      />

      <div className={styles.forgotPasswordWrapper}>
        <span className={styles.passwordLinkText}>
          비밀번호를 잊으셨습니까?
        </span>
      </div>

      <Button variant="secondary" type="submit" disabled={isLoading}>
        {isLoading ? (
          <div className={styles.loadingWrapper}>
            <Loading provider="default" />
            <span>로그인 중...</span>
          </div>
        ) : (
          '로그인'
        )}
      </Button>
    </form>
  );
}
