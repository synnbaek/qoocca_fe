import { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { setUserFromToken } from '@/store/userSlice';
import {
  validateEmail,
  validatePassword,
  validateName,
} from '../utils/validation';
import { toast } from 'sonner';

export function useSignup() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');

  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreements, setAgreements] = useState({
    service: false,
    privacy: false,
    thirdParty: false,
    marketing: false,
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleFieldChange = (field: string, value: string) => {
    if (field === 'username') {
      setUsername(value);
      setErrors((prev) => ({ ...prev, username: validateName(value) }));
    } else if (field === 'email') {
      setEmail(value);
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    } else if (field === 'password') {
      setPassword(value);
      setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
    }
  };

  const isRequiredAgreed = useMemo(() => {
    return agreements.service && agreements.privacy && agreements.thirdParty;
  }, [agreements]);

  const isSubmitDisabled = useMemo(() => {
    if (isLoading) return true;
    if (!isPhoneVerified) return true;
    if (errors.username || errors.email || errors.password) return true;
    if (isExistingUser) return false;
    return !isRequiredAgreed;
  }, [isLoading, isPhoneVerified, isExistingUser, isRequiredAgreed, errors]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await authService.signup({
        username,
        email,
        password,
        phone,
        code,
        agreements: isExistingUser ? null : agreements,
      });

      dispatch(setUserFromToken(data.accessToken));
      toast.success(isExistingUser ? '계정 연동 성공!' : '회원가입 성공!');
      router.push('/');
    } catch (err: any) {
      toast.error('가입 실패: ' + (err.response?.data?.message || '오류 발생'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fields: { username, email, password, phone, code },
    setFields: { setPhone, setCode },
    auth: {
      isPhoneVerified,
      setIsPhoneVerified,
      isExistingUser,
      setIsExistingUser,
      isLoading,
    },
    agreements: { agreements, setAgreements },
    errors,
    isSubmitDisabled,
    handleFieldChange,
    handleSignup,
  };
}
