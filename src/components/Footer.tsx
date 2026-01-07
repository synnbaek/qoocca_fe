'use client';

import { usePathname } from 'next/navigation';
import style from './Footer.module.css';
import Link from 'next/link';
import {
  YoutubeIcon,
  BlogIcon,
  InstaIcon,
  AppleIcon,
  GoogleIcon,
} from './icons/SocialIcons';

const SOCIAL_LINKS = [
  {
    id: 'youtube',
    href: 'https://www.youtube.com/@%EC%95%84%EC%9D%B4%EC%BF%A0%EC%B9%B4',
    icon: <YoutubeIcon />,
    label: '유튜브',
  },
  {
    id: 'blog',
    href: 'https://blog.naver.com/iqoocca',
    icon: <BlogIcon />,
    label: '블로그',
  },
  {
    id: 'insta',
    href: 'https://www.instagram.com/iqoocca/',
    icon: <InstaIcon />,
    label: '인스타',
  },
  {
    id: 'apple',
    href: 'https://apps.apple.com/kr/app/%EC%95%84%EC%9D%B4%EC%BF%A0%EC%B9%B4/id1500709264',
    icon: <AppleIcon />,
    label: '앱스토어',
  },
  {
    id: 'google',
    href: 'https://play.google.com/store/apps/details?id=kr.co.happytoseeyou.app',
    icon: <GoogleIcon />,
    label: '구글스토어',
  },
];

export default function Footer() {
  const pathname = usePathname();

  const isMainPage = pathname === '/';

  return (
    <footer className={style.footer}>
      <div className={style.content}>
        {isMainPage && (
          <>
            <div className={style.topRow}>
              <span className={style.title}>쿠카티처스</span>
              <span className={style.extra}>
                <span>기업소개</span>
                <span>고객센터</span>
                <span>이용약관</span>
                <span>블로그</span>
                <span>개인정보 처리방침</span>
              </span>
            </div>
            <div className={style.secondRow}>
              <div className={style.firstContent}>
                <div className={style.rowLine}>
                  <span>아이쿠카</span> | <span>대표이사 방남진</span>
                </div>
                <div className={style.rowLine}>
                  <span>주소</span> | <span>전화번호: -</span>
                </div>
                <div className={style.rowLine}>
                  <span>사업자등록번호: -</span> | <span>통신판매번호: -</span>{' '}
                  | <span>그외</span>
                </div>
              </div>

              <div className={style.secondContent}>
                <span>학원관련 문의</span>
                <span>결제/송금 문의</span>
                <span>카드 문의</span>
                <span>IR 문의</span>
              </div>
            </div>
          </>
        )}

        <div className={style.bottomRow}>
          <p>COPYRIGHT (주)아이쿠카. ALL RIGHTS RESERVED</p>
          <div className={style.link}>
            {SOCIAL_LINKS.map((link) => (
              <Link key={link.id} href={link.href} aria-label={link.label}>
                {link.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
