import type { Metadata } from 'next';
import Providers from './providers';
import './globals.css';
import Header from '@/components/layout/Header';
import { Toaster } from 'sonner';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: '쿠카티처스 | 스마트한 학원 관리의 시작',
  description: '출결, 수납, 수업 관리를 한 번에! 학원 운영을 더 쉽고 편리하게 만들어주는 올인원 플랫폼 쿠카티처스입니다.',
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <Header />
          <div className="layoutWrapper">
            <main className="mainContent">{children}</main>
          </div>
          <Footer />
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}