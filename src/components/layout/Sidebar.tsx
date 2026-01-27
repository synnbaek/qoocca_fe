'use client';

import { useState, useEffect } from 'react';
import { usePathname, useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import style from './Sidebar.module.css';
import Select from '@/components/common/Select';
import { getMyAcademyList, AcademyListResponse } from '@/api/academyApi';

interface SidebarProps {
  academyId: string;
  approvalStatus: string | null;
  initialAcademies?: AcademyListResponse[];
}

export default function Sidebar({ academyId: propsId, approvalStatus, initialAcademies = [] }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

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
    const isActive = pathname === fullPath || pathname.startsWith(`${fullPath}/`);
    return `${style.subLinkItem} ${isActive ? style.active : ''}`;
  };

  const [academies, setAcademies] = useState<AcademyListResponse[]>(initialAcademies);

  useEffect(() => {
    if (initialAcademies.length > 0) return;

    const fetchAcademies = async () => {
      try {
        const data = await getMyAcademyList();
        setAcademies(data);
      } catch (error) {
        console.error('Failed to fetch academy list:', error);
      }
    };
    fetchAcademies();
  }, [initialAcademies]);

  const currentAcademy = academies.find(a => String(a.academyId) === String(academyId));
  
  const activeStatus = currentAcademy ? currentAcademy.approvalStatus : approvalStatus;
  const isDisabled = activeStatus !== 'APPROVED';

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'APPROVED': return '';
      case 'PENDING': return '(승인 대기)';
      case 'REJECTED': return '(승인 거절)';
      default: return '';
    }
  };

  return (
    <nav className={style.sidebar}>
      <div className={style.academySwitcher}>
        <Select
          options={academies.map((academy) => ({
            value: academy.academyId,
            label: `${academy.name} ${getStatusLabel(academy.approvalStatus)}`
          }))}
          value={Number(academyId) || null}
          onChange={(val) => {
            router.push(`/academy/${val}`);
          }}
          placeholder="학원 선택"
        />
      </div>
      <ul className={`${style.menuList} ${isDisabled ? style.disabled : ''}`}>
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
