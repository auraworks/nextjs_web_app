/**
 * Admin 관련 Query Key Factory
 * React Query의 캐시 키를 일관성 있게 관리하기 위한 팩토리 패턴
 */
export const adminKeys = {
  /** 모든 admin 관련 쿼리의 기본 키 */
  all: ['admin'] as const,

  /** 관리자 인증 관련 쿼리 키 */
  auth: () => [...adminKeys.all, 'auth'] as const,

  /** 관리자 프로필 조회 쿼리 키 */
  profile: () => [...adminKeys.all, 'profile'] as const,
};
