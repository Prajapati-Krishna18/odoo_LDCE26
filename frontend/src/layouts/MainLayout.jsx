import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Search, Bell, Menu, X, LogOut, User } from 'lucide-react';

const MainLayout = () => {
  const { displayName, avatarUrl, initials, logout } = useAuth();
  const { toastSuccess } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toastSuccess('Logged out successfully.');
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'My Trips', path: '/trips' },
    { name: 'Itinerary', path: '/trips/1/itinerary' },
    { name: 'Explore India', path: '/cities' },
    { name: 'Budget', path: '/trips/1/budget' },
    { name: 'Calendar', path: '/calendar' },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    if (path === '/trips') return location.pathname === '/trips' || (location.pathname.startsWith('/trips') && !location.pathname.endsWith('/itinerary') && !location.pathname.endsWith('/budget'));
    if (path.endsWith('/itinerary')) return location.pathname.endsWith('/itinerary');
    if (path.endsWith('/budget')) return location.pathname.endsWith('/budget');
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Navbar header */}
      <nav className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center gap-2 h-8">
                <img src="/logo.png" alt="GlobeTrotter Logo" className="h-full object-contain" />
              </Link>
              
              <div className="hidden md:flex ml-10 space-x-1">
                {navLinks.map((link) => {
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                        active
                          ? 'bg-[#FFF7ED] text-[#F97316]'
                          : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right Controls */}
            <div className="hidden md:flex items-center gap-4">
              <button className="p-2 text-[#64748B] hover:bg-[#F1F5F9] rounded-full transition-all" title="Search">
                <Search className="h-5 w-5" />
              </button>
              <button className="p-2 text-[#64748B] hover:bg-[#F1F5F9] rounded-full transition-all relative" title="Notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F97316] rounded-full"></span>
              </button>
              
              {/* User Dropdown / Avatar */}
              <div className="relative group cursor-pointer flex items-center gap-2 pl-2 border-l border-[#E2E8F0]">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-[#E2E8F0] bg-[#FFF7ED] flex items-center justify-center">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                  ) : null}
                  <span
                    className="text-xs font-black text-[#C2410C]"
                    style={{ display: avatarUrl ? 'none' : 'flex' }}
                  >
                    {initials || <User className="w-4 h-4" />}
                  </span>
                </div>
                <span className="text-xs font-semibold text-[#0F172A]">{displayName}</span>

                {/* Hover Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link
                    to="/profile"
                    className="w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 rounded-t-xl flex items-center gap-2 font-medium"
                  >
                    <User className="h-4 w-4" /> My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 rounded-b-xl flex items-center gap-2 font-semibold"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#E2E8F0] bg-white px-4 pt-2 pb-4 space-y-1">
            {/* Mobile User Info */}
            <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-[#FFF7ED] rounded-xl">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-[#E2E8F0] bg-white flex items-center justify-center">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-black text-[#C2410C]">{initials}</span>
                )}
              </div>
              <p className="text-xs font-bold text-[#0F172A]">{displayName}</p>
            </div>

            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                    active
                      ? 'bg-[#FFF7ED] text-[#F97316]'
                      : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <hr className="my-2 border-[#E2E8F0]" />
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-semibold text-[#EF4444] hover:bg-rose-50 transition-all"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Main page content area */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#FFF8F6] border-t border-[#E2E8F0] pt-12 pb-8 text-sm text-[#64748B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 h-7">
                <img src="/logo.png" alt="GlobeTrotter Logo" className="h-full object-contain" />
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Creating authentic Indian experiences with modern precision. Your ultimate companion for the sub-continent.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-[#0F172A] mb-4 text-xs uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/dashboard" className="hover:text-[#F97316] transition-colors">About Us</Link></li>
                <li><Link to="/dashboard" className="hover:text-[#F97316] transition-colors">Help Center</Link></li>
                <li><Link to="/dashboard" className="hover:text-[#F97316] transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#0F172A] mb-4 text-xs uppercase tracking-wider">Legal</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/dashboard" className="hover:text-[#F97316] transition-colors">Terms of Service</Link></li>
                <li><Link to="/dashboard" className="hover:text-[#F97316] transition-colors">Privacy Policy</Link></li>
                <li><Link to="/dashboard" className="hover:text-[#F97316] transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#0F172A] mb-4 text-xs uppercase tracking-wider">Follow Us</h4>
              <div className="flex gap-4">
                <a href="#" className="p-2 bg-white rounded-full border border-[#E2E8F0] hover:text-[#F97316] hover:border-[#F97316] transition-all text-[#64748B]">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="p-2 bg-white rounded-full border border-[#E2E8F0] hover:text-[#F97316] hover:border-[#F97316] transition-all text-[#64748B]">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              </div>
            </div>
          </div>
          <hr className="my-8 border-[#E2E8F0]" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#94A3B8]">
            <p>&copy; {new Date().getFullYear()} GlobeTrotter India Pvt. Ltd. All rights reserved. Made with ❤️ for India.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
