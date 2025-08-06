import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, LogOut, User, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-red-600" />
                <span className="text-xl font-bold text-gray-900">LifeLink</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/dashboard')
                        ? 'bg-red-100 text-red-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/scanner"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/scanner')
                        ? 'bg-red-100 text-red-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    QR Scanner
                  </Link>
                  {user.email === 'admin@lifelink.com' && (
                    <Link
                      to="/admin"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        isActive('/admin')
                          ? 'bg-red-100 text-red-700'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Shield className="h-4 w-4 inline mr-1" />
                      Admin
                    </Link>
                  )}
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">{user.name}</span>
                    <button
                      onClick={logout}
                      className="p-2 text-gray-600 hover:text-gray-900"
                      title="Logout"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
};

export default Layout;
