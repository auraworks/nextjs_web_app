import { createClient } from '@/lib/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';
  
  // 보안: 허용된 경로 목록
  const allowedPaths = ['/', '/mypage', '/mypage/edit'];
  const safeNext = allowedPaths.includes(next) ? next : '/';

  if (code) {
    const supabase = await createClient();
    
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (!error) {
        // 사용자 정보 가져오기
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // 프로필 정보 확인 및 저장
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (!existingProfile) {
            // 새 프로필 생성
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                email: user.email,
                name: user.user_metadata?.full_name || user.user_metadata?.name,
                created_at: new Date().toISOString(),
              });
            
            if (profileError) {
              // 프로필 생성 에러 시 조용히 처리
              return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('프로필 생성에 실패했습니다.')}`);
            }
          }
        }
        
        return NextResponse.redirect(`${origin}${safeNext}`);
      }
    } catch {
      // 에러 조용히 처리
    }
  }

  // 에러 시 로그인 페이지로 리디렉션
  return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('로그인에 실패했습니다.')}`);
}
