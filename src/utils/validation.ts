/**
 * 이메일 유효성 검사
 * @param email
 * @returns 에러 메시지 (정상일 경우 빈 문자열)
 */
export const validateEmail = (email: string): string => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "이메일을 입력해주세요.";
  if (!emailRegex.test(email)) return "올바른 이메일 형식이 아닙니다.";
  return "";
};

/**
 * 비밀번호 유효성 검사 (최소 8자, 영문/숫자 포함)
 * @param password
 * @returns 에러 메시지 (정상일 경우 빈 문자열)
 */
export const validatePassword = (password: string): string => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!password) return "비밀번호를 입력해주세요.";
  if (!passwordRegex.test(password)) {
    return "비밀번호는 영문, 숫자를 포함하여 최소 8자 이상이어야 합니다.";
  }
  return "";
};

/**
 * 비밀번호 확인 일치 여부 검사
 * @param password
 * @param confirmPassword
 * @returns 에러 메시지 (정상일 경우 빈 문자열)
 */
export const validatePasswordConfirm = (
  password: string,
  confirmPassword: string
): string => {
  if (!confirmPassword) return "비밀번호 확인을 입력해주세요.";
  if (password !== confirmPassword) return "비밀번호가 일치하지 않습니다.";
  return "";
};

/**
 * 이름 유효성 검사
 * @param name
 * @returns 에러 메시지 (정상일 경우 빈 문자열)
 */
export const validateName = (name: string): string => {
  if (!name) return "이름을 입력해주세요.";
  if (name.length < 2) return "이름은 최소 2자 이상이어야 합니다.";
  return "";
};