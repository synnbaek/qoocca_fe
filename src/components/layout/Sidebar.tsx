'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import style from './Sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();

  const [isManagementOpen, setIsManagementOpen] = useState(
    pathname.includes('/attendance') || pathname.includes('/payment')
  );

  const excludedPaths = ['/', '/login', '/signup'];
  if (excludedPaths.includes(pathname)) return null;

  const getMenuClass = (path: string) => {
    return `${style.menuLink} ${pathname === path ? style.active : ''}`;
  };

  const getSubMenuClass = (path: string) => {
    return `${style.subLinkItem} ${pathname === path ? style.active : ''}`;
  };

  return (
    <nav className={style.sidebar}>
      <ul className={style.menuList}>
        <div className={style.menuGroupTitle}>학원</div>
        <li className={style.menuItem}>
          <Link href="/home" className={getMenuClass('/home')}>
            홈
          </Link>
        </li>
        <li className={style.menuItem}>
          <Link href="/academy" className={getMenuClass('/academy')}>
            학원 정보
          </Link>
        </li>

        <div className={style.menuGroupTitle}>운영</div>
        <li className={style.menuItem}>
          <Link href="/student" className={getMenuClass('/student')}>
            원생 관리
          </Link>
          <div
            className={style.toggleHeader}
            onClick={() => setIsManagementOpen(!isManagementOpen)}
          >
            <div className={style.leftContent}>
              <span
                className={`${style.arrow} ${
                  isManagementOpen ? style.rotated : ''
                }`}
              >
                &gt;
              </span>
              <span>운영 관리</span>
            </div>
          </div>

          {isManagementOpen && (
            <ul className={style.subList}>
              <li className={style.subItem}>
                <Link
                  href="/attendance"
                  className={getSubMenuClass('/attendance')}
                >
                  출결
                </Link>
              </li>
              <li className={style.subItem}>
                <Link href="/payment" className={getSubMenuClass('/payment')}>
                  수납
                </Link>
              </li>
            </ul>
          )}
        </li>

        <div className={style.menuGroupTitle}>기타</div>
        <li className={style.menuItem}>
          <Link href="/settings" className={getMenuClass('/settings')}>
            설정
          </Link>
        </li>
      </ul>
    </nav>
  );
}
