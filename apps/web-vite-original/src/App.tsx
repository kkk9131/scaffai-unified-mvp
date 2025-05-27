import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import InputPage from './pages/InputPage';
import ResultsPage from './pages/ResultsPage';
import DrawingPage from './pages/DrawingPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProjects from './pages/admin/AdminProjects';
import NotFound from './pages/NotFound';

function App() {
  const { theme } = useTheme();
  const { user } = useAuth();

  return (
    <div className={theme}>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/input" element={user ? <InputPage /> : <Navigate to="/login" />} />
          <Route path="/results" element={user ? <ResultsPage /> : <Navigate to="/login" />} />
          <Route path="/drawing" element={user ? <DrawingPage /> : <Navigate to="/login" />} />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={user?.isAdmin ? <AdminDashboard /> : <Navigate to="/" />} 
          />
          <Route 
            path="/admin/users" 
            element={user?.isAdmin ? <AdminUsers /> : <Navigate to="/" />} 
          />
          <Route 
            path="/admin/projects" 
            element={user?.isAdmin ? <AdminProjects /> : <Navigate to="/" />} 
          />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;