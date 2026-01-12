import Providers from './providers';
import './globals.css';
import Header from '@/components/layout/Header';
import { Toaster } from 'sonner';
import Footer from '@/components/layout/Footer';

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
