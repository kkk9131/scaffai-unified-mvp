import { createContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  loading: false,
  error: null,
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock localStorage persistence
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Mock login functionality
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (email === 'admin@scaffai.com' && password === 'password') {
        const userData: User = {
          id: '1',
          name: '管理者',
          email: 'admin@scaffai.com',
          isAdmin: true,
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } else if (email === 'user@scaffai.com' && password === 'password') {
        const userData: User = {
          id: '2',
          name: 'テストユーザー',
          email: 'user@scaffai.com',
          isAdmin: false,
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        throw new Error('メールアドレスまたはパスワードが正しくありません');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('ログイン中にエラーが発生しました');
      }
    } finally {
      setLoading(false);
    }
  };

  // Mock register functionality
  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (email === 'admin@scaffai.com' || email === 'user@scaffai.com') {
        throw new Error('このメールアドレスは既に使用されています');
      }
      
      const userData: User = {
        id: '3',
        name,
        email,
        isAdmin: false,
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('登録中にエラーが発生しました');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}