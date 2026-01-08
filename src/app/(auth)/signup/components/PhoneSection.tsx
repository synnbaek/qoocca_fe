"use client";

import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/api/axiosInstance";
import styles from "./PhoneSection.module.css";
import { toast } from "sonner";

interface Props {
  phone: string;
  setPhone: (val: string) => void;
  code: string;
  setCode: (val: string) => void;
  isPhoneVerified: boolean;
  setIsPhoneVerified: (val: boolean) => void;
  isSocial?: boolean;
  setIsExistingUser?: (val: boolean) => void;
}

export default function PhoneSection({
  phone,
  setPhone,
  code,
  setCode,
  isPhoneVerified,
  setIsPhoneVerified,
  isSocial = false,
  setIsExistingUser,
}: Props) {
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
            window.clearInterval(timer);
            setIsTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimerActive]);

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
      await axiosInstance.post("/api/auth/send-code", {
        phone,
        ...(isSocial && { isSocial }),
      });
      toast.info("인증번호가 발송되었습니다.");
      setIsCodeSent(true);
      setTimeLeft(180);
      setIsTimerActive(true);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data ||
        "인증번호 발송 실패";
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
      const res = await axiosInstance.post("/api/auth/verify-code", {
        phone,
        code,
      });
      toast.success("인증에 성공했습니다.");
      if (setIsExistingUser) setIsExistingUser(res.data.isExistingUser);
      setIsPhoneVerified(true);
      setIsTimerActive(false);
    } catch (err: any) {
      toast.error("인증번호가 일치하지 않습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [phone, code, timeLeft, setIsExistingUser, setIsPhoneVerified]);

  return (
    <>
      <div className={styles.inputContainer}>
        <input
          type="tel"
          placeholder="휴대폰 번호 (- 제외)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={styles.insideInput}
          disabled={isPhoneVerified || isLoading}
          required
        />

        {!isPhoneVerified && (
          <div className={styles.btnWrapper}>
            {isTimerActive ? (
              <span className={styles.timerText}>{formatTime(timeLeft)}</span>
            ) : (
              <button
                type="button"
                onClick={handleSendCode}
                className={styles.insideBtn}
                disabled={isLoading}
              >
                {isLoading ? "..." : isCodeSent ? "재발송" : "인증"}
              </button>
            )}
          </div>
        )}
      </div>

      {isCodeSent && (
        <div className={styles.inputContainer}>
          <input
            type="tel"
            placeholder="인증번호"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={styles.insideInput}
            disabled={isPhoneVerified || isLoading}
            required
          />
          {!isPhoneVerified && (
            <button
              type="button"
              onClick={handleVerifyCode}
              className={styles.insideBtn}
              disabled={timeLeft === 0 || isLoading}
            >
              {isLoading ? "..." : "확인"}
            </button>
          )}
        </div>
      )}
    </>
  );
}
