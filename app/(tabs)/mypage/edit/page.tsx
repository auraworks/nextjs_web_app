'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile, useUpdateProfile } from '@/components/hooks/users';

interface FormErrors {
  name?: string;
  phone?: string;
  birthdate?: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const { data, isLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();

  const profile = data?.profile;
  const email = data?.user?.email || '';

  const [errors, setErrors] = useState<FormErrors>({});
  const [isInitialized, setIsInitialized] = useState(false);
  const [editForm, setEditForm] = useState<{ name: string; phone: string; birthdate: string }>({
    name: '',
    phone: '',
    birthdate: '',
  });

  if (profile && !isInitialized) {
    setEditForm({
      name: profile.name || '',
      phone: profile.phone || '',
      birthdate: profile.birthdate || '',
    });
    setIsInitialized(true);
  }

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!editForm.name) {
      newErrors.name = "이름을 입력해주세요";
    }
    
    if (!editForm.phone) {
      newErrors.phone = "전화번호를 입력해주세요";
    } else if (!/^01[0-9]-?\d{3,4}-?\d{4}$/.test(editForm.phone.replace(/-/g, ''))) {
      newErrors.phone = "올바른 전화번호 형식이 아닙니다 (예: 010-1234-5678)";
    }
    
    if (!editForm.birthdate) {
      newErrors.birthdate = "생년월일을 입력해주세요";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = () => {
    if (!validateForm()) {
      return;
    }
    
    updateProfileMutation.mutate(
      {
        name: editForm.name,
        phone: editForm.phone,
        birthdate: editForm.birthdate || null,
      },
      {
        onSuccess: (success) => {
          if (success) {
            alert('회원정보가 수정되었습니다.');
            router.back();
          } else {
            alert('회원정보 수정에 실패했습니다.');
          }
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span>로딩 중...</span>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="mr-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold">회원정보 수정</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
            />
            <p className="text-xs text-gray-500 mt-1">이메일은 변경할 수 없습니다</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => {
                setEditForm(prev => ({ ...prev, name: e.target.value }));
                setErrors(prev => ({ ...prev, name: undefined }));
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="이름을 입력하세요"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
            <input
              type="tel"
              value={editForm.phone}
              onChange={(e) => {
                setEditForm(prev => ({ ...prev, phone: e.target.value }));
                setErrors(prev => ({ ...prev, phone: undefined }));
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="010-0000-0000"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">생년월일</label>
            <input
              type="date"
              value={editForm.birthdate}
              onChange={(e) => {
                setEditForm(prev => ({ ...prev, birthdate: e.target.value }));
                setErrors(prev => ({ ...prev, birthdate: undefined }));
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.birthdate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.birthdate && (
              <p className="mt-1 text-sm text-red-600">{errors.birthdate}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={() => router.back()}
          className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors font-medium"
        >
          취소
        </button>
        <button
          onClick={handleUpdateProfile}
          disabled={updateProfileMutation.isPending}
          className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:bg-blue-300"
        >
          {updateProfileMutation.isPending ? '저장 중...' : '저장'}
        </button>
      </div>
    </div>
  );
}
