import AcademyDashboard from './Dashboard';

export default async function Page({
  params,
}: {
  params: Promise<{ academyId: string }>;
}) {
  const resolvedParams = await params;
  const academyId = resolvedParams.academyId;

  return <AcademyDashboard academyId={academyId} />;
}
