import { createClient } from '@/lib/client';
import { AdminLoginParams, AdminLoginResult } from '@/types/admin/auth';

/**
 * Admin 관련 Supabase API 함수 모음
 */
export const adminApis = {
  /**
   * 관리자 로그인
   * @param params - 이메일, 비밀번호
   * @returns 로그인 결과
   */
  login: async (params: AdminLoginParams): Promise<AdminLoginResult> => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: params.email,
      password: params.password,
    });

    if (error) {
      return { success: false, error: '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.' };
    }

    if (data.session) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.session.user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        await supabase.auth.signOut();
        return { success: false, error: '관리자 권한이 없습니다.' };
      }

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

      return { success: true };
    }

    return { success: false, error: '로그인에 실패했습니다.' };
  },

  /**
   * 관리자 로그아웃
   */
  logout: async (): Promise<void> => {
    const supabase = createClient();
    const token = localStorage.getItem('push_token');

    if (token) {
      await supabase
        .from('push_tokens')
        .update({ user_id: null })
        .eq('token', token);
    }

    await supabase.auth.signOut();
    localStorage.clear();
  },

  /**
   * 현재 관리자 정보 조회
   */
  getCurrentAdmin: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return null;
    }

    return { user, profile };
  },
};
