import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import RecipeDetail from './pages/RecipeDetail';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import HallaChat from './components/HallaChat';
import { Search } from 'lucide-react';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "instant"
      });
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }, 50);
  }, [pathname]);

  return null;
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  return user?.role === 'admin' ? <>{children}</> : <Navigate to="/" />;
}

function UserRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (user?.role === 'admin') return <Navigate to="/admin" />;
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<UserRoute><Home /></UserRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/recipe/:id" element={<UserRoute><RecipeDetail /></UserRoute>} />
              <Route path="/search" element={<UserRoute><Home /></UserRoute>} />
              
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <UserRoute>
                    <Dashboard />
                  </UserRoute>
                </PrivateRoute>
              } />
              
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
          <HallaChat />
        </div>
      </Router>
    </AuthProvider>
  );
}

