import React from 'react';

interface ButtonProps {
  /** 버튼 내부에 표시할 내용 */
  children: React.ReactNode;
  /** 버튼 클릭 시 실행될 함수 */
  onClick?: () => void;
  /** 버튼 비활성화 여부 */
  disabled?: boolean;
  /** 추가적인 CSS 클래스 */
  className?: string;
  /** 버튼 타입 (form 제출 시 사용) */
  type?: 'button' | 'submit' | 'reset';
  /** 버튼 스타일 변형 */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /** 버튼 크기 */
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({
  children,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  variant = 'primary',
  size = 'md',
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
    ghost: 'text-gray-700 hover:bg-gray-100',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
}