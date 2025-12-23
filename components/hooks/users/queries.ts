'use client';

import { useQuery } from '@tanstack/react-query';
import { userKeys } from './keys';
import { userApis } from './apis';

/**
 * 현재 사용자의 프로필 정보를 조회하는 훅
 * @returns { data, isLoading, error, refetch } - data에 user와 profile 포함
 * @example
 * const { data, isLoading } = useProfile();
 * const profile = data?.profile;
 * const email = data?.user?.email;
 */
export const useProfile = () => {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: userApis.getProfile,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * 현재 로그인한 사용자 정보를 조회하는 훅
 * @returns { data, isLoading, error } - data에 Supabase User 객체
 */
export const useCurrentUser = () => {
  return useQuery({
    queryKey: userKeys.currentUser(),
    queryFn: userApis.getCurrentUser,
    staleTime: 1000 * 60 * 5,
  });
};
