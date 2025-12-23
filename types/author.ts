// Auth related types
export interface LoginProps {
  onLoginComplete?: () => void;
  onSwitchToSignup?: () => void;
}

export interface SignProps {
  onSignComplete?: () => void;
  onSwitchToLogin?: () => void;
}

export interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  birthdate: string;
  agreedToTerms: boolean;
}

export interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  phone?: string;
  birthdate?: string;
  agreedToTerms?: string;
}

export interface FormSuccess {
  email?: string;
}

// Profile related types
export interface Profile {
  id: string;
  name?: string;
  phone?: string;
  birthdate?: string;
  created_at: string;
  updated_at: string;
}

// User related types
export interface User {
  id: string;
  email?: string;
  profile?: Profile;
}
