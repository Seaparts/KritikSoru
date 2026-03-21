
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50 bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full px-6 py-3 border border-slate-100">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <Logo />
          </Link>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/nasil-calisir" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Nasıl Çalışır?</Link>
          <Link to="/fiyatlandirma" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">Çözüm Paketleri</Link>
        </div>

        <div className="hidden md:flex items-center space-x-3">
          {!isAuthenticated ? (
            <>
              <Link to="/giris" className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all shadow-sm">
                Giriş Yap
              </Link>
              <Link to="/kayit" className="px-5 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-full hover:bg-slate-800 transition-all shadow-md">
                Kayıt Ol
              </Link>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/profil" className="flex items-center space-x-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                  {user?.name.charAt(0)}{user?.surname.charAt(0)}
                </div>
                <span>{user?.name} {user?.surname}</span>
              </Link>
              <button 
                onClick={handleLogout} 
                className="text-sm font-medium text-slate-500 hover:text-red-500 transition-colors"
              >
                Çıkış Yap
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus:outline-none"
          >
            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="px-4 py-3 space-y-1">
            <Link to="/nasil-calisir" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50" onClick={() => setIsMobileMenuOpen(false)}>Nasıl Çalışır?</Link>
            <Link to="/fiyatlandirma" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50" onClick={() => setIsMobileMenuOpen(false)}>Çözüm Paketleri</Link>
            
            <div className="border-t border-slate-100 my-2"></div>

            {!isAuthenticated ? (
              <div className="flex flex-col space-y-2 pt-2">
                <Link to="/giris" className="w-full text-center px-4 py-2 rounded-full text-base font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50" onClick={() => setIsMobileMenuOpen(false)}>Giriş Yap</Link>
                <Link to="/kayit" className="w-full text-center px-4 py-2 rounded-full text-base font-medium text-white bg-slate-900 hover:bg-slate-800" onClick={() => setIsMobileMenuOpen(false)}>Kayıt Ol</Link>
              </div>
            ) : (
              <>
                <Link to="/profil" className="block px-3 py-2 rounded-md text-base font-bold text-slate-800 bg-slate-50" onClick={() => setIsMobileMenuOpen(false)}>
                  Profilim ({user?.name})
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-50"
                >
                  Çıkış Yap
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
