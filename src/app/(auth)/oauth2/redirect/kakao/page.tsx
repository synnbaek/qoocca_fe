"use client";

import { Suspense } from "react";
import Loading from "@/components/common/Loading";
import SocialHandler from "../SocialHandler";

export default function OAuthRedirectKakaoPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SocialHandler provider="kakao" />
    </Suspense>
  );
}
