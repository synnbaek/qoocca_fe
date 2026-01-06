'use client';

import { Suspense } from 'react';
import Loading from '@/components/Loading';
import SocialHandler from '../SocialHandler';

export default function OAuthRedirectNaverPage() {
  return (
    <Suspense fallback={<Loading provider="naver" />}>
      <SocialHandler provider="naver" />
    </Suspense>
  );
}
