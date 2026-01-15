'use client';

import { useState } from 'react';
import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import style from './Sidebar.module.css';

interface SidebarProps {
  academyId: string;
}

export default function Sidebar({ academyId: propsId }: SidebarProps) {
  const pathname = usePathname();

  const params = useParams();
  const academyId = (params.academyId as string) || propsId;

  const [isManagementOpen, setIsManagementOpen] = useState(
    pathname.includes('/attendance') || pathname.includes('/payment')
  );

  const getMenuClass = (path: string) => {
    const fullPath = `/academy/${academyId}${path === '/' ? '' : path}`;
    return `${style.menuLink} ${pathname === fullPath ? style.active : ''}`;
  };

  const getSubMenuClass = (path: string) => {
    const fullPath = `/academy/${academyId}${path}`;
    return `${style.subLinkItem} ${pathname === fullPath ? style.active : ''}`;
  };

  return (
    <nav className={style.sidebar}>
      <ul className={style.menuList}>
        <div className={style.menuGroupTitle}>학원</div>
        <li className={style.menuItem}>
          <Link href={`/academy/${academyId}`} className={getMenuClass('/')}>
            홈
          </Link>
        </li>
        <li className={style.menuItem}>
          <Link
            href={`/academy/${academyId}/modify`}
            className={getMenuClass('/modify')}
          >
            학원 정보
          </Link>
        </li>

        <div className={style.menuGroupTitle}>운영</div>
        <li className={style.menuItem}>
          <Link
            href={`/academy/${academyId}/student`}
            className={getMenuClass('/student')}
          >
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
                  href={`/academy/${academyId}/attendance`}
                  className={getSubMenuClass('/attendance')}
                >
                  출결
                </Link>
              </li>
              <li className={style.subItem}>
                <Link
                  href={`/academy/${academyId}/payment`}
                  className={getSubMenuClass('/payment')}
                >
                  수납
                </Link>
              </li>
            </ul>
          )}
        </li>

        <div className={style.menuGroupTitle}>기타</div>
        <li className={style.menuItem}>
          <Link
            href={`/academy/${academyId}/settings`}
            className={getMenuClass('/settings')}
          >
            설정
          </Link>
        </li>
      </ul>
    </nav>
  );
}
