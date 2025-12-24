'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApis } from './apis';
import { LoginErrors } from '@/types/admin/auth';

/**
 * 관리자 로그인 폼 상태 및 로직을 관리하는 훅
 */
export const useAdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: LoginErrors = {};

    if (!email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }

    if (!password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const result = await adminApis.login({ email, password });

    if (!result.success) {
      setIsLoading(false);
      alert(result.error);
      return;
    }

    setTimeout(() => {
      window.location.href = '/admin/dashboard';
    }, 100);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    isLoading,
    handleLogin,
  };
};

/**
 * 관리자 로그아웃 뮤테이션 훅
 */
export const useAdminLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApis.logout,
    onSuccess: () => {
      queryClient.clear();
      window.location.href = '/admin/login';
    },
  });
};
