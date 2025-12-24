'use client';

import { useQuery } from '@tanstack/react-query';
import { adminKeys } from './keys';
import { adminApis } from './apis';

/**
 * 현재 관리자 정보를 조회하는 훅
 * @returns { data, isLoading, error } - data에 user와 profile 포함
 */
export const useAdminProfile = () => {
  return useQuery({
    queryKey: adminKeys.profile(),
    queryFn: adminApis.getCurrentAdmin,
    staleTime: 1000 * 60 * 5,
  });
};
