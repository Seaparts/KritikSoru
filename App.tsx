
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import { trackVisit } from './services/api';

const VisitTracker: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const hasVisited = sessionStorage.getItem('visited');
    const hasLoggedInVisited = sessionStorage.getItem('loggedInVisited');

    if (!hasVisited) {
      trackVisit(isAuthenticated);
      sessionStorage.setItem('visited', 'true');
      if (isAuthenticated) {
        sessionStorage.setItem('loggedInVisited', 'true');
      }
    } else if (isAuthenticated && !hasLoggedInVisited) {
      // If they visited as guest, and then logged in during the same session
      trackVisit(true);
      sessionStorage.setItem('loggedInVisited', 'true');
    }
  }, [isAuthenticated, loading]);

  return null;
};

const Layout: React.FC = () => {
  const location = useLocation();
  const isAuthPage = ['/giris', '/kayit', '/admin'].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && <Navbar />}
      <main className="flex-grow flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nasil-calisir" element={<HowItWorks />} />
          <Route path="/fiyatlandirma" element={<Pricing />} />
          <Route path="/giris" element={<Login />} />
          <Route path="/kayit" element={<Register />} />
          <Route path="/panel" element={<Dashboard />} />
          <Route path="/profil" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <VisitTracker />
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
