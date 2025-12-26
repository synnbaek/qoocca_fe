import type { Metadata } from 'next';
import Providers from './providers';
import './globals.css'; // Step 3에서 옮긴 CSS
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Next.js Auth App',
  description: 'Next.js + TypeScript 전환 프로젝트',
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
          <div style={{ paddingTop: '80px' }}>{children}</div>
        </Providers>
      </body>
    </html>
  );
}
