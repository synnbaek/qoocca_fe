import Dashboard from './Dashboard';

interface PageProps {
  params: Promise<{
    academyId?: string[];
  }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const academyId = resolvedParams.academyId
    ? resolvedParams.academyId[0]
    : undefined;

  return <Dashboard academyId={academyId} />;
}
