import { redirect } from 'next/navigation';
import Dashboard from './[academyId]/Dashboard';
import { dashboardService } from '@/services/dashboardService';

export default async function AcademyPage() {
  let redirectTarget: string | null = null;
  let academies: any[] = [];

  try {
    academies = await dashboardService.getMyAcademies();

    if (academies.length === 1) {
      redirectTarget = `/academy/${academies[0].academyId}`;
    }
  } catch (error: any) {
    if (error?.response?.status === 401) {
      redirect('/login');
    }
    console.error('Failed to fetch academies:', error);
  }

  if (redirectTarget) {
    redirect(redirectTarget);
  }

  // 학원이 여러 개일 경우 또는 조회 실패 시 대시보드 선택 모달 표시
  return <Dashboard academyId={undefined} initialData={{ academyInfo: undefined, classes: [], stats: undefined, receipts: [] }} />;
}
