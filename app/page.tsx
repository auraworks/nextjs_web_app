'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/client';
import { Suspense } from 'react';

function PageInner() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const code = searchParams.get('code');
      
      if (code) {
        const supabase = createClient();
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        
        if (!exchangeError) {
          // 세션 교환 성공, /home으로 이동
          setTimeout(() => {
            window.location.href = '/home';
          }, 100);
          return;
        }
      }

      // 인증 확인
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setTimeout(() => {
          window.location.href = '/home';
        }, 100);
      } else {
        setTimeout(() => {
          window.location.href = '/slides/start';
        }, 100);
      }
    };

    handleAuthCallback();
  }, [searchParams]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">로딩 중...</p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">로딩 중...</div>}>
      <PageInner />
    </Suspense>
  );
}
