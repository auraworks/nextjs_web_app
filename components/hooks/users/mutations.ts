'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/client';
import { userKeys } from './keys';
import { UpdateProfileParams } from '@/types/mypage';

/**
 * 프로필 정보 수정
 * @param params - 수정할 프로필 데이터 (name, phone, birthdate)
 * @returns 성공 여부
 */
const updateProfile = async (params: UpdateProfileParams): Promise<boolean> => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      name: params.name,
      phone: params.phone,
      birthdate: params.birthdate,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  return !error;
};

/**
 * 프로필 삭제 (회원탈퇴)
 * @returns 성공 여부
 */
const deleteProfile = async (): Promise<boolean> => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', user.id);

  return !error;
};

/**
 * 로그아웃 처리
 * Supabase 세션 종료 및 localStorage 초기화
 */
const signOut = async (): Promise<void> => {
  const supabase = createClient();
  await supabase.auth.signOut();
  localStorage.clear();
};

/**
 * 프로필 정보 수정 뮤테이션 훅
 * 성공 시 프로필 쿼리 캐시를 무효화하여 최신 데이터 반영
 * @example
 * const mutation = useUpdateProfile();
 * mutation.mutate({ name: '홍길동', phone: '010-1234-5678', birthdate: '1990-01-01' });
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateProfileParams) => updateProfile(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
  });
};

/**
 * 프로필 삭제 (회원탈퇴) 뮤테이션 훅
 * 성공 시 모든 user 관련 쿼리 캐시를 무효화
 * @example
 * const mutation = useDeleteProfile();
 * mutation.mutate();
 */
export const useDeleteProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

/**
 * 로그아웃 뮤테이션 훅
 * 성공 시 모든 React Query 캐시를 초기화
 * @example
 * const mutation = useSignOut();
 * mutation.mutate();
 */
export const useSignOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.clear();
    },
  });
};
