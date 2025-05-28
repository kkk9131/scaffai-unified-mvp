/**
 * 🔄 ScaffAI Auth Page
 * ログイン・サインアップ切り替え可能なページ
 */

'use client';

import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'signup' : 'login');
  };

  return (
    <>
      {mode === 'login' ? (
        <LoginForm onToggleMode={toggleMode} />
      ) : (
        <SignupForm onToggleMode={toggleMode} />
      )}
    </>
  );
};

export default AuthPage;
