import { redirect } from 'next/navigation';
import Dashboard from './Dashboard';
import { dashboardService } from '@/services/dashboardService';
import { cookies } from 'next/headers';

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

  // 병렬 데이터 페칭
  try {
    // academyInfo is needed for approvalStatus check and rejection modal
    const infoPromise = dashboardService.getAcademyInfo(academyId);

    // Other data promises pending approval status check, but we can fetch speculatively 
    // or just fetch all allowed. If rejected, other APIs might fail or return empty?
    // Backend typically protects endpoints. 
    // Let's fetch info first to be safe about status, or just Promise.allSettled?
    // For speed, Promise.all is best, assuming backend handles permissions gracefully.

    // However, user noted 401 handling.

    const [info, classes, stats, receipts] = await Promise.all([
      infoPromise,
      dashboardService.getClassSummary(academyId).catch(() => []),
      dashboardService.getStats(academyId).catch(() => undefined),
      dashboardService.getReceiptSummary(academyId, new Date().getFullYear(), new Date().getMonth() + 1).catch(() => [])
    ]);

    return <Dashboard
      academyId={academyId}
      initialData={{
        academyInfo: info,
        classes: classes,
        stats: stats,
        receipts: receipts
      }}
    />;

  } catch (error: any) {
    if (error?.response?.status === 401) {
      redirect('/login');
    }

    // If other error (e.g. 403 or 500), we might still want to render Dashboard 
    // but maybe with empty data or let Client Dashboard handle error state?
    // Current "Dashboard" expects initialData. 
    // Let's return partial data if info fails (though if info fails, likely critical).

    console.error('Server side dashboard fetch failed:', error);

    // Fallback: let client handle it or show error?
    // If info fails, we probably can't show much.
    // Try to recover what we can or redirect if critical.

    // If getAcademyInfo fails, we really can't show "Approval Status".
    // Let's assume critical failure involves redirect or error page.
    // But for now, we follow the plan: 401 -> login.

    return <Dashboard academyId={academyId} initialData={{}} />;
  }
}

