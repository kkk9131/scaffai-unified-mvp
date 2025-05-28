/**
 * 🎨 ScaffAI UI Package
 * 認証コンポーネント統一エクスポート
 */

// 🔐 認証コンポーネント
export { 
  AuthInput, 
  PasswordInput, 
  AuthButton, 
  AuthCard, 
  ErrorAlert, 
  SuccessAlert 
} from './components/auth/AuthComponents';

export { LoginForm } from './components/auth/LoginForm';
export { SignupForm } from './components/auth/SignupForm';
export { AuthPage } from './components/auth/AuthPage';

// 🎯 認証関連の型
export interface AuthFormProps {
  onToggleMode?: () => void;
  redirectTo?: string;
}

export interface AuthMessage {
  type: 'error' | 'success';
  text: string;
}
