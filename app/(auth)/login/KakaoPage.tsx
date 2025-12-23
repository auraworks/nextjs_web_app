'use client';

import { createClient } from '@/lib/client';

interface KakaoLoginProps {
  onClick?: () => void;
}

export default function KakaoLogin({ onClick }: KakaoLoginProps) {
  const handleKakaoLogin = async () => {
    const supabase = createClient();
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${window.location.origin}/api/auth`,
      },
    });

    if (error) {
      console.error('Kakao 로그인 에러:', error);
    } else {
      onClick?.();
    }
  };

  return (
    <button
      onClick={handleKakaoLogin}
      className="w-full bg-yellow-300 border border-yellow-300 text-gray-800 hover:bg-yellow-400 font-medium rounded-lg transition-colors px-4 py-2 flex items-center justify-center space-x-2"
    >
      <div className="flex items-center space-x-2">
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 01-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z"
            fill="#3C1E1E"
          />
        </svg>
        <span>카카오로 로그인</span>
      </div>
    </button>
  );
}