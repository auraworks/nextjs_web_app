/** 관리자 로그인 파라미터 */
export interface AdminLoginParams {
  email: string;
  password: string;
}

/** 관리자 로그인 결과 */
export interface AdminLoginResult {
  success: boolean;
  error?: string;
}

/** 로그인 폼 에러 */
export interface LoginErrors {
  email?: string;
  password?: string;
}
