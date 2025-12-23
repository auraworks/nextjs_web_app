/**
 * User 관련 Query Key Factory
 * React Query의 캐시 키를 일관성 있게 관리하기 위한 팩토리 패턴
 */
export const userKeys = {
  /** 모든 user 관련 쿼리의 기본 키 */
  all: ['user'] as const,

  /** 프로필 조회 쿼리 키 */
  profile: () => [...userKeys.all, 'profile'] as const,

  /** 현재 로그인한 사용자 조회 쿼리 키 */
  currentUser: () => [...userKeys.all, 'current'] as const,
};
