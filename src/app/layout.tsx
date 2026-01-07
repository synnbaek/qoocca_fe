import Providers from './providers';
import './globals.css';
import Header from '@/components/Header';
import { Toaster } from 'sonner';
import Footer from '@/components/Footer';

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
          <div className="mainContent">{children}</div>
          <Toaster position="top-center" richColors />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
