'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/client';
import { FormData, FormErrors, FormSuccess } from '@/types/author';

function SignupPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    birthdate: '',
    agreedToTerms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState<FormSuccess>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        router.replace('/home');
      }
    };
    
    checkSession();
  }, [router]);

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      alert(error);
      router.replace('/signup');
    }
  }, [searchParams, router]);

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다";
    }
    
    if (!formData.name) {
      newErrors.name = "이름을 입력해주세요";
    }
    
    if (!formData.phone) {
      newErrors.phone = "전화번호를 입력해주세요";
    } else if (!/^01[0-9]-?\d{3,4}-?\d{4}$/.test(formData.phone.replace(/-/g, ''))) {
      newErrors.phone = "올바른 전화번호 형식이 아닙니다";
    }
    
    if (!formData.birthdate) {
      newErrors.birthdate = "생년월일을 입력해주세요";
    }
    
    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요";
    } else if (formData.password.length < 6) {
      newErrors.password = "비밀번호는 6자 이상이어야 합니다";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호 확인을 입력해주세요";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다";
    }
    
    if (!isEmailChecked) {
      newErrors.email = "이메일 중복 확인을 해주세요";
    }
    
    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = "이용약관과 개인정보 처리방침에 동의해주세요";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const checkEmailDuplicate = async () => {
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({ email: "올바른 이메일 형식으로 입력해주세요" });
      return;
    }
    
    setIsCheckingEmail(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc('check_email_exists', {
        email_to_check: formData.email
      });
      
      if (error) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: 'dummy-password-for-check'
        });
        
        if (!signInError || signInError.message !== 'Invalid login credentials') {
          if (!signInError) {
            setErrors({ email: '이미 사용 중인 이메일입니다' });
            setIsEmailChecked(false);
          } else {
            setErrors({ email: '이메일 확인 중 오류가 발생했습니다' });
            setIsEmailChecked(false);
          }
        } else {
          setErrors({});
          setSuccess({ email: '사용 가능한 이메일입니다' });
          setIsEmailChecked(true);
        }
      } else {
        if (data) {
          setErrors({ email: '이미 사용 중인 이메일입니다' });
          setIsEmailChecked(false);
        } else {
          setErrors({});
          setSuccess({ email: '사용 가능한 이메일입니다' });
          setIsEmailChecked(true);
        }
      }
    } catch {
      setErrors({ email: '이메일 확인 중 오류가 발생했습니다' });
    } finally {
      setIsCheckingEmail(false);
    }
  };
  
  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'email') {
      setIsEmailChecked(false);
      setErrors(prev => ({ ...prev, email: undefined }));
      setSuccess(prev => ({ ...prev, email: undefined }));
    } else if (field === 'agreedToTerms') {
      setErrors(prev => ({ ...prev, agreedToTerms: undefined }));
    } else {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            name: formData.name,
            phone: formData.phone,
            birthdate: formData.birthdate,
          },
        },
      });

      if (error) {
        setErrors({ email: error.message });
      } else {
        router.push('/login');
      }
    } catch {
      setErrors({ email: '회원가입 중 오류가 발생했습니다' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-6">회원가입</h2>
      
      <form onSubmit={handleSign} className="space-y-4">
        <div>
          <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700 mb-1">
            이름
          </label>
          <input
            id="signup-name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="이름을 입력하세요"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
            이메일
          </label>
          <div className="flex gap-2">
            <input
              id="signup-email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="이메일을 입력하세요"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={checkEmailDuplicate}
              disabled={!formData.email || !/\S+@\S+\.\S+/.test(formData.email) || isCheckingEmail || isEmailChecked}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              {isCheckingEmail ? '확인 중...' : isEmailChecked ? '확인 완료' : '중복 확인'}
            </button>
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
          {success.email && (
            <p className="mt-1 text-sm text-blue-600">{success.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
            비밀번호
          </label>
          <input
            id="signup-password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="비밀번호를 입력하세요 (6자 이상)"
            disabled={isLoading}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <div>
          <label htmlFor="signup-confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            비밀번호 확인
          </label>
          <input
            id="signup-confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="비밀번호를 다시 입력하세요"
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>

        <div>
          <label htmlFor="signup-phone" className="block text-sm font-medium text-gray-700 mb-1">
            전화번호
          </label>
          <input
            id="signup-phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="010-1234-5678"
            disabled={isLoading}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        <div>
          <label htmlFor="signup-birthdate" className="block text-sm font-medium text-gray-700 mb-1">
            생년월일
          </label>
          <input
            id="signup-birthdate"
            type="date"
            value={formData.birthdate}
            onChange={(e) => handleInputChange('birthdate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          {errors.birthdate && (
            <p className="mt-1 text-sm text-red-600">{errors.birthdate}</p>
          )}
        </div>
        
        <div className="flex items-start">
          <input
            id="signup-agreedToTerms"
            type="checkbox"
            checked={formData.agreedToTerms}
            onChange={(e) => handleInputChange('agreedToTerms', e.target.checked)}
            className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            disabled={isLoading}
          />
          <label htmlFor="signup-agreedToTerms" className="ml-2 text-sm text-gray-600">
            이용약관과 <a href="#" className="text-blue-600 hover:underline">개인정보 처리방침</a>에 동의합니다
          </label>
        </div>
        {errors.agreedToTerms && (
          <p className="mt-1 text-sm text-red-600">{errors.agreedToTerms}</p>
        )}
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? '가입 중...' : '회원가입'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          이미 계정이 있으신가요?{' '}
          <button
            onClick={handleSwitchToLogin}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            로그인
          </button>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">로딩 중...</div>}>
      <SignupPageInner />
    </Suspense>
  );
}
