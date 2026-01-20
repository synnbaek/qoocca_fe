'use client';

import { useState, useEffect } from 'react';
import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import style from './Sidebar.module.css';
import { dashboardService } from '@/services/dashboardService';
import { getMyAcademyList, AcademyListResponse } from '@/api/academyApi';

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
  const [approvalStatus, setApprovalStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!academyId) return;
      try {
        const data = await dashboardService.getAcademyInfo(academyId);
        setApprovalStatus(data.approvalStatus);
      } catch (error) {
        console.error('Failed to fetch academy status:', error);
        setApprovalStatus('PENDING');
      }
    };
    fetchStatus();
  }, [academyId]);

  const getMenuClass = (path: string) => {
    const fullPath = `/academy/${academyId}${path === '/' ? '' : path}`;
    return `${style.menuLink} ${pathname === fullPath ? style.active : ''}`;
  };

  const getSubMenuClass = (path: string) => {
    const fullPath = `/academy/${academyId}${path}`;
    const isActive = pathname === fullPath || pathname.startsWith(`${fullPath}/`);
    return `${style.subLinkItem} ${isActive ? style.active : ''}`;
  };

  const [academies, setAcademies] = useState<AcademyListResponse[]>([]);

  useEffect(() => {
    const fetchAcademies = async () => {
      try {
        const data = await getMyAcademyList();
        setAcademies(data);
      } catch (error) {
        console.error('Failed to fetch academy list:', error);
      }
    };
    fetchAcademies();
  }, []);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'APPROVED': return '';
      case 'PENDING': return '(승인 대기)';
      case 'REJECTED': return '(승인 거절)';
      default: return '';
    }
  };

  const handleAcademyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAcademyId = e.target.value;
    window.location.href = `/academy/${newAcademyId}`;
  };

  return (
    <nav className={style.sidebar}>
      <div className={style.academySwitcher}>
        <select 
          value={academyId} 
          onChange={handleAcademyChange}
          className={style.academySelect}
        >
          {academies.map((academy) => (
            <option key={academy.academyId} value={academy.academyId}>
              {academy.name} {getStatusLabel(academy.approvalStatus)}
            </option>
          ))}
        </select>
      </div>
      <ul className={`${style.menuList} ${approvalStatus === 'PENDING' ? style.disabled : ''}`}>
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
