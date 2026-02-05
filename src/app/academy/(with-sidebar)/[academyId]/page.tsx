import { redirect } from 'next/navigation';
import Dashboard from './Dashboard';

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

  return <Dashboard academyId={academyId} />;
}