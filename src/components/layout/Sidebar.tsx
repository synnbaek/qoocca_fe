'use client';

import { useState, useEffect } from 'react';
import { usePathname, useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import style from './Sidebar.module.css';
import Select from '@/components/common/Select';
import { getMyAcademyList, AcademyListResponse } from '@/api/academyApi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/userSlice';
import axiosInstance from '@/api/axiosInstance';
import Cookies from 'js-cookie';

interface SidebarProps {
  academyId: string;
  approvalStatus: string | null;
  initialAcademies?: AcademyListResponse[];
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ 
  academyId: propsId, 
  approvalStatus: propsStatus, 
  initialAcademies = [],
  isOpen = false,
  onClose
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { role } = useSelector((state: RootState) => state.user);

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
  
  // Props로 받은 학원 목록이나 승인 상태가 변경되면 내부 상태 동기화
  useEffect(() => {
    if (initialAcademies && initialAcademies.length > 0) {
      // 상세 페이지에서 성곡적으로 가져온 최신 propsStatus가 있다면 현재 학원의 상태를 강제로 업데이트
      const syncList = initialAcademies.map(a => {
        if (String(a.academyId) === String(academyId) && propsStatus) {
          return { ...a, approvalStatus: propsStatus as any };
        }
        return a;
      });
      setAcademies(syncList);
    }
  }, [initialAcademies, propsStatus, academyId]);

  useEffect(() => {
    const fetchAcademies = async () => {
      try {
        const data = await getMyAcademyList();
        setAcademies(data);
      } catch (error) {
        console.error('Failed to fetch academy list:', error);
      }
    };
    
    // 목록이 비어있거나 초기화가 필요한 경우 직접 fetch
    if (!initialAcademies || initialAcademies.length === 0) {
      fetchAcademies();
    }
  }, [initialAcademies]);

  const currentAcademy = academies.find(a => String(a.academyId) === String(academyId));
  
  // prop으로 넘어온 status가 있으면 그것을 우선시하고, 없으면 목록에서 찾음
  const activeStatus = (String(academyId) === String(propsId) && propsStatus) 
    ? propsStatus 
    : (currentAcademy?.approvalStatus || 'PENDING');
    
  const isDisabled = activeStatus !== 'APPROVED';

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'APPROVED': return '';
      case 'PENDING': return '(승인 대기)';
      case 'REJECTED': return '(승인 거절)';
      default: return '';
    }
  };

  const handleLinkClick = () => {
    if (window.innerWidth <= 1024 && onClose) {
      onClose();
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/api/auth/logout');
    } catch (err) {
      console.error('서버 로그아웃 실패: ', err);
    }
    Cookies.remove('accessToken');
    dispatch(logout());
    router.push('/login');
    handleLinkClick();
  };

  return (
    <nav className={`${style.sidebar} ${isOpen ? style.isOpen : ''}`}>
      <div className={style.academySwitcher}>
        <Select
          key={academies.map(a => `${a.academyId}-${a.approvalStatus}`).join(',')}
          options={academies.map((academy) => ({
            value: academy.academyId,
            label: `${academy.name} ${getStatusLabel(academy.approvalStatus)}`
          }))}
          value={Number(academyId) || null}
          onChange={(val) => {
            router.push(`/academy/${val}`);
            handleLinkClick();
          }}
          placeholder="학원 선택"
        />
      </div>
      <ul className={`${style.menuList} ${isDisabled ? style.disabled : ''}`}>
        <div className={style.menuGroupTitle}>학원</div>
        <li className={style.menuItem}>
          <Link href={`/academy/${academyId}`} className={getMenuClass('/')} onClick={handleLinkClick}>
            홈
          </Link>
        </li>
        <li className={style.menuItem}>
          <Link
            href={`/academy/${academyId}/modify`}
            className={getMenuClass('/modify')}
            onClick={handleLinkClick}
          >
            학원 정보
          </Link>
        </li>

        <div className={style.menuGroupTitle}>운영</div>
        <li className={style.menuItem}>
          <Link
            href={`/academy/${academyId}/student`}
            className={getMenuClass('/student')}
            onClick={handleLinkClick}
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
                  onClick={handleLinkClick}
                >
                  출결
                </Link>
              </li>
              <li className={style.subItem}>
                <Link
                  href={`/academy/${academyId}/payment`}
                  className={getSubMenuClass('/payment')}
                  onClick={handleLinkClick}
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
            onClick={handleLinkClick}
          >
            설정
          </Link>
        </li>
      </ul>

      <div className={style.userSectionMobile}>
        {role === 'ROLE_ADMIN' && (
          <Link href="/admin" className={style.userAction} onClick={handleLinkClick}>
            관리자 페이지
          </Link>
        )}
        <Link href="/academy/register" className={style.userAction} onClick={handleLinkClick}>
          신규 학원 등록
        </Link>
        <button 
          type="button" 
          className={`${style.userAction} ${style.logoutAction}`} 
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </div>
    </nav>
  );
}