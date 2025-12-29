'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/client';
import GoogleLogin from './GooglePage';
import AppleLogin from './ApplePage';
import KakaoLogin from './KakaoPage';

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        router.replace('/home');
      }
    };
    
    checkSession();
  }, [router]);

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      alert(error);
      router.replace('/login');
    }
  }, [searchParams, router]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = "이메일을 입력해주세요";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다";
    }
    
    if (!password) {
      newErrors.password = "비밀번호를 입력해주세요";
    } else if (password.length < 6) {
      newErrors.password = "비밀번호는 6자 이상이어야 합니다";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      return;
    }

    if (data.session) {
      const userId = data.session.user.id;
      const token = localStorage.getItem('push_token');

      localStorage.setItem('user_id', userId);
      localStorage.setItem('user_email', data.session.user.email || '');
      localStorage.setItem('isLoggedIn', 'true');

      if (token) {
        await supabase
          .from('push_tokens')
          .update({ user_id: userId })
          .eq('token', token);
      }
      
      setTimeout(() => {
        window.location.href = '/home';
      }, 100);
    }
  };

  const handleSwitchToSignup = () => {
    router.push('/signup');
  };

  return (
    <div className="px-4 py-6">
      <div className="max-w-sm mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">로그인</h1>
      
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="example@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                자동 로그인
              </label>
            </div>
            <a href="#" className="text-sm text-blue-500 hover:underline">
              비밀번호 찾기
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            로그인
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            아직 계정이 없으신가요?{' '}
            <button
              onClick={handleSwitchToSignup}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              회원가입
            </button>
          </p>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">또는</span>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <GoogleLogin onClick={() => console.log("Google 로그인")} />
            <AppleLogin onClick={() => console.log("Apple 로그인")} />
            <KakaoLogin onClick={() => console.log("Kakao 로그인")} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">로딩 중...</div>}>
      <LoginPageInner />
    </Suspense>
  );
}
