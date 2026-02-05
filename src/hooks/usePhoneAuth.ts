import { useState, useEffect, useCallback } from "react";
import { authService } from "@/services/authService";
import { toast } from "sonner";

interface UsePhoneAuthProps {
  phone: string;
  setPhone: (val: string) => void;
  code: string;
  isPhoneVerified: boolean;
  setIsPhoneVerified: (val: boolean) => void;
  isSocial?: boolean;
  setIsExistingUser?: (val: boolean) => void;
}

export function usePhoneAuth({
  phone,
  setPhone,
  code,
  isPhoneVerified,
  setIsPhoneVerified,
  isSocial,
  setIsExistingUser,
}: UsePhoneAuthProps) {
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timer: number;
    if (isTimerActive && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => window.clearInterval(timer);
  }, [isTimerActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleSendCode = useCallback(async () => {
    if (!phone) return toast.info("전화번호를 먼저 입력해주세요.");
    const phoneRegex = /^010\d{7,8}$/;
    if (!phoneRegex.test(phone))
      return toast.warning("올바른 휴대폰 번호 형식을 입력해주세요.");

    setIsLoading(true);
    try {
      await authService.sendPhoneCode({
        phone,
        isSocial
      });
      toast.info("인증번호가 발송되었습니다.");
      setIsCodeSent(true);
      setTimeLeft(180);
      setIsTimerActive(true);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "인증번호 발송 실패";
      if (errorMsg.includes("이미 가입된")) {
        toast.error("이미 가입된 번호입니다.");
        setPhone("");
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  }, [phone, isSocial, setPhone]);

  const handleVerifyCode = useCallback(async () => {
    if (timeLeft === 0) return toast.error("인증 시간이 만료되었습니다.");
    if (!code) return toast.info("인증번호를 입력해주세요.");

    setIsLoading(true);
    try {
      const data = await authService.verifyPhoneCode({
        phone,
        code
      });
      toast.success("인증에 성공했습니다.");
      if (setIsExistingUser) setIsExistingUser(data.isExistingUser);
      setIsPhoneVerified(true);
      setIsTimerActive(false);
    } catch (err: any) {
      toast.error("인증번호가 일치하지 않습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [phone, code, timeLeft, setIsExistingUser, setIsPhoneVerified]);

  return {
    isCodeSent,
    timeLeft,
    isTimerActive,
    isLoading,
    formatTime,
    handleSendCode,
    handleVerifyCode,
  };
}