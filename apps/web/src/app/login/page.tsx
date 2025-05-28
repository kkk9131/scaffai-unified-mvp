/**
 * 🔐 ScaffAI Login Page
 * Next.js App Router対応ログインページ
 */

import { AuthPage } from '../../../../../../../packages/ui/src/components/auth/AuthPage';

export default function LoginPage() {
  return <AuthPage />;
}

export const metadata = {
  title: 'ログイン | ScaffAI',
  description: 'ScaffAI プロフェッショナル足場設計プラットフォームにログイン',
};
