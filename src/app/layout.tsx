import Providers from './providers';
import './globals.css';
import Header from '@/components/Header';
import { Toaster } from 'sonner';

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
          <div>{children}</div>
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}
