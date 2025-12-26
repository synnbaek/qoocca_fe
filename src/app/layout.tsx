import Providers from './providers';
import './globals.css';
import Header from '@/components/Header';

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
