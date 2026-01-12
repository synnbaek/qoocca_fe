import Providers from "./providers";
import "./globals.css";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Toaster } from "sonner";
import Footer from "@/components/layout/Footer";
import { AcademyProvider } from "../context/AcademyContext"; // 추가

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <AcademyProvider>
            {/* ⭐ 이 wrapper가 핵심 */}
            <div className="appLayout">
              <Header />

              <div className="layoutWrapper">
                <Sidebar />
                <main className="mainContent">{children}</main>
              </div>

              <Footer />
            </div>

            <Toaster position="top-center" richColors />
          </AcademyProvider>
        </Providers>
      </body>
    </html>
  );
}
