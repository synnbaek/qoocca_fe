// src/app/academy/[academyId]/modify/page.tsx
import AcademyEditPageClient from './AcademyEditPageClient';

interface Params {
  academyId: string;
}

// 서버 컴포넌트는 async 가능
export default async function AcademyEditPage({ params }: { params: Promise<Params> }) {
  const resolvedParams = await params; // Promise 해제
  return <AcademyEditPageClient academyId={resolvedParams.academyId} />;
}
