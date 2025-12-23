import { createClient } from '@/lib/client';
import { UserWithProfile } from '@/types/mypage';

/**
 * User 관련 Supabase 조회 API 함수 모음
 */
export const userApis = {
  /**
   * 현재 로그인한 사용자 정보 조회
   * @returns Supabase User 객체 또는 null
   */
  getCurrentUser: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  /**
   * 현재 사용자의 프로필 정보 조회
   * @returns 사용자 정보와 프로필 데이터
   */
  getProfile: async (): Promise<UserWithProfile> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { user: null, profile: null };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return {
      user: { id: user.id, email: user.email },
      profile: profile || null,
    };
  },
};
