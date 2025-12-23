'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/client';
import { Profile } from '../../../types/mypage';

export default function Mypage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setEmail(user.email || '');
        
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileData) {
          setProfile(profileData);
        }
      }
      
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    localStorage.clear();
    window.location.href = '/';
  };

  const handleDeleteAccount = async () => {
    if (!confirm('정말로 회원탈퇴 하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      await supabase.from('profiles').delete().eq('id', user.id);
      await supabase.auth.signOut();
      localStorage.clear();
      
      alert('회원탈퇴가 완료되었습니다.');
      window.location.href = '/login';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <span>로딩 중...</span>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">마이페이지</h1>
      
      {/* 회원 정보 */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">회원 정보</h2>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">이메일</span>
            <span className="font-medium">{email || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">이름</span>
            <span className="font-medium">{profile?.name || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">전화번호</span>
            <span className="font-medium">{profile?.phone || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">생년월일</span>
            <span className="font-medium">{profile?.birthdate || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">가입일</span>
            <span className="font-medium">
              {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('ko-KR') : '-'}
            </span>
          </div>
        </div>
      </div>

      {/* 버튼들 */}
      <div className="space-y-3">
        <button
          onClick={() => router.push('/mypage/edit')}
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          회원정보 수정
        </button>
        
        <button
          onClick={handleLogout}
          className="w-full bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
        >
          로그아웃
        </button>
        
        <button
          onClick={handleDeleteAccount}
          className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
        >
          회원탈퇴
        </button>
      </div>
    </div>
  );
}
