import { redirect } from 'next/navigation';
import Dashboard from './Dashboard';
import { dashboardService } from '@/services/dashboardService';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '대시보드 | 쿠카티처스',
  description: '학원 운영 현황을 한눈에 파악하세요.',
};

export const revalidate = 0;

interface PageProps {
  params: Promise<{
    academyId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const academyId = resolvedParams?.academyId;

  if (!academyId || academyId === 'undefined') {
    redirect('/academy/register');
  }

  let redirectTarget: string | null = null;
  let dashboardData: any = null;

  try {
    const infoPromise = dashboardService.getAcademyInfo(academyId);

    const [info, classes, stats, receipts] = await Promise.all([
      infoPromise,
      dashboardService.getClassSummary(academyId).catch(() => []),
      dashboardService.getStats(academyId).catch(() => undefined),
      dashboardService.getReceiptSummary(academyId, new Date().getFullYear(), new Date().getMonth() + 1).catch(() => [])
    ]);

    dashboardData = {
      academyInfo: info,
      classes: classes,
      stats: stats,
      receipts: receipts
    };

  } catch (error: any) {
    if (error?.response?.status === 401) {
      redirectTarget = '/login';
    }
    console.error('Server side dashboard fetch failed:', error);
  }

  if (redirectTarget) {
    redirect(redirectTarget);
  }

  return <Dashboard
    academyId={academyId}
    initialData={dashboardData || {}}
  />;
}

