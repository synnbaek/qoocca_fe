import { redirect } from 'next/navigation';
import Dashboard from './Dashboard';

interface PageProps {
  params: Promise<{
    academyId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { academyId } = await params;

  if (!academyId || academyId === 'undefined') {
    redirect('/academy');
  }

  return <Dashboard academyId={academyId} />;
}
