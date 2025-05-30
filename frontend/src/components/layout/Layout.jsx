import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Calendar } from 'lucide-react';

export const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-800 shadow-lg border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-blue-400" />
              <span className="ml-2 text-xl font-semibold text-white">Leave Management</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <User className="h-5 w-5 text-slate-400" />
                <span className="ml-2 text-sm text-slate-200">{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center text-sm text-slate-200 hover:text-white transition-colors duration-200"
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-2">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};