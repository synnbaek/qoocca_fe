'use client';

import PhoneSection from './PhoneSection';
import TermsSection from './TermsSection';
import styles from './SignupForm.module.css';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { useSignup } from '../../../../hooks/useSignup';

export default function SignupForm() {
  const {
    fields,
    setFields,
    auth,
    agreements,
    errors,
    isSubmitDisabled,
    handleFieldChange,
    handleSignup,
  } = useSignup();

  return (
    <>
      <form onSubmit={handleSignup} className={styles.form}>
        <Input
          type="text"
          placeholder="이름"
          value={fields.username}
          onChange={(e) => handleFieldChange('username', e.target.value)}
          error={errors.username}
          disabled={auth.isLoading}
          required
          autoComplete="name"
        />
        <Input
          type="email"
          placeholder="이메일"
          value={fields.email}
          onChange={(e) => handleFieldChange('email', e.target.value)}
          error={errors.email}
          disabled={auth.isLoading}
          required
          autoComplete="username"
        />
        <Input
          type="password"
          placeholder="비밀번호"
          value={fields.password}
          onChange={(e) => handleFieldChange('password', e.target.value)}
          error={errors.password}
          disabled={auth.isLoading}
          required
          autoComplete="new-password"
        />

        <PhoneSection
          phone={fields.phone}
          setPhone={setFields.setPhone}
          code={fields.code}
          setCode={setFields.setCode}
          isPhoneVerified={auth.isPhoneVerified}
          setIsPhoneVerified={auth.setIsPhoneVerified}
          setIsExistingUser={auth.setIsExistingUser}
        />

        {auth.isPhoneVerified && !auth.isExistingUser && (
          <TermsSection
            agreements={agreements.agreements}
            setAgreements={agreements.setAgreements}
          />
        )}

        <Button variant="secondary" type="submit" disabled={isSubmitDisabled}>
          {auth.isLoading
            ? '처리 중...'
            : auth.isExistingUser
              ? '계정 연동'
              : '가입하기'}
        </Button>
      </form>
    </>
  );
}