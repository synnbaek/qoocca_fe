"use client";

interface IconProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export function KakaoIcon({
  width = 20,
  height = 20,
  className = "",
}: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M12 3C6.477 3 2 6.483 2 10.771C2 13.545 3.825 15.982 6.574 17.382L5.412 21.662C5.352 21.884 5.604 22.062 5.792 21.936L10.848 18.544C11.226 18.575 11.609 18.591 12 18.591C17.523 18.591 22 15.108 22 10.82C22 6.532 17.523 3.05 12 3.05V3Z" />
    </svg>
  );
}

export const NaverIcon = ({
  width = 16,
  height = 16,
  className = "",
}: IconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M13.51 10.215L6.49 0H0V20H6.49V9.785L13.51 20H20V0H13.51V10.215Z" />
  </svg>
);
