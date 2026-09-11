import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Clock, Calendar, FileText, Users, BarChart3, LogOut, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { useState } from 'react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/clock', icon: Clock, label: 'Clock In/Out' },
    { path: '/timesheets', icon: FileText, label: 'Timesheets' },
    { path: '/schedule', icon: Calendar, label: 'Schedule' },
    { path: '/employees', icon: Users, label: 'Employees' },
  ];

  if (['ADMIN', 'MANAGER', 'SUPERVISOR'].includes(user?.role || '')) {
    navItems.push({ path: '/manage', icon: Users, label: 'Manage' });
  }

  return (
    <nav className="bg-primary-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Clock className="w-6 h-6" />
            Workforce Manager
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary-600'
                      : 'hover:bg-primary-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-sm">{user?.firstName} {user?.lastName}</span>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
                    isActive(item.path)
                      ? 'bg-primary-600'
                      : 'hover:bg-primary-600'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-md hover:bg-primary-600 flex items-center gap-2 text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
