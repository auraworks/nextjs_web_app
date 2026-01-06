import { createClient } from '@/lib/client';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // 초기 사용자 정보 가져오기
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    // 인증 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);

        // 최초 로그인 시 프로필 생성 (기본 로그인만 처리)
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('Login event triggered:', event);
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (!existingProfile) {
            await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
                created_at: new Date().toISOString(),
              });
          }
          
          // 로컬 스토리지에 사용자 정보 저장
          if (typeof window !== 'undefined') {
            console.log('Saving to localStorage and redirecting');
            localStorage.setItem('user_id', session.user.id);
            localStorage.setItem('user_email', session.user.email || '');
            localStorage.setItem('isLoggedIn', 'true');
            
            // 로그인 성공 후 홈화면으로 이동
            setTimeout(() => {
              console.log('Redirecting to /home');
              window.location.href = '/home';
            }, 100);
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signInWithKakao = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      console.error('Kakao 로그인 에러:', error);
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      console.error('Google 로그인 에러:', error);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('로그아웃 에러:', error);
    } else {
      // 로그아웃 시 로컬 스토리지 정리
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
    }
  };

  return {
    user,
    loading,
    signInWithKakao,
    signInWithGoogle,
    signOut,
  };
}
