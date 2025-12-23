export interface Profile {
  id: string;
  name?: string;
  phone?: string;
  birthdate?: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

/** 사용자 정보와 프로필을 함께 반환하는 타입 */
export interface UserWithProfile {
  user: {
    id: string;
    email: string | undefined;
  } | null;
  profile: Profile | null;
}

/** 프로필 수정 시 필요한 파라미터 타입 */
export interface UpdateProfileParams {
  name: string;
  phone: string;
  birthdate: string | null;
}
