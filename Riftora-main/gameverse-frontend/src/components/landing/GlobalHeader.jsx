import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Bell, User, Search, ShieldAlert } from 'lucide-react';
import { cn } from '../../lib/utils';
import logo from '../../assets/logo.png';
import { useAuthStore } from '../../store/authStore';

export function GlobalHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Explore', href: '/explore', type: 'link' },
    { label: 'For Organizers', href: '#organizers', type: 'scroll' },
    { label: 'Live', href: '#live', type: 'scroll' },
    { label: 'Docs', href: '/docs', type: 'link' },
  ];

  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    if (window.location.pathname !== '/') {
      window.location.href = '/' + targetId;
      return;
    }
    
    const element = document.querySelector(targetId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header 
      className={cn(
        "fixed w-full z-50 transition-all duration-300",
        isScrolled ? "top-4 px-4" : "top-0 px-0"
      )}
    >
      <div className={cn(
        "mx-auto transition-all duration-500",
        isScrolled 
          ? "max-w-6xl bg-[#071426]/60 backdrop-blur-xl border border-white/10 py-2.5 px-6 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)]" 
          : "max-w-7xl bg-transparent py-5 px-4 lg:px-8 border border-transparent"
      )}>
        <div className="flex items-center justify-between">
          
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logo} alt="Riftora Logo" className="h-10 w-auto object-contain" />
          </Link>

          {/* Center: Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              link.type === 'link' ? (
                <Link 
                  key={link.label} 
                  to={link.href}
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a 
                  key={link.label} 
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  {link.label}
                </a>
              )
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <button className="text-slate-300 hover:text-white p-2">
              <Search className="w-5 h-5" />
            </button>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <button className="text-slate-300 hover:text-white relative p-2">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <Link to="/admin/dashboard" className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                  <ShieldAlert className="w-4 h-4" />
                  Admin
                </Link>
                <button onClick={logout} className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center border border-white/20 hover:border-white/50 transition-colors" title="Sign Out">
                  <User className="w-4 h-4 text-slate-300" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/auth/login" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link to="/auth/register" className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden text-slate-300 hover:text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className={cn(
          "lg:hidden absolute left-0 w-full bg-[#071426]/95 backdrop-blur-md py-4 px-4 shadow-xl z-40 transition-all",
          isScrolled ? "top-[calc(100%+0.5rem)] rounded-2xl border border-white/10" : "top-full border-b border-white/10"
        )}>
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              link.type === 'link' ? (
                <Link 
                  key={link.label} 
                  to={link.href}
                  className="text-base font-medium text-slate-300 hover:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ) : (
                <a 
                  key={link.label} 
                  href={link.href}
                  className="text-base font-medium text-slate-300 hover:text-white cursor-pointer"
                  onClick={(e) => {
                    setIsMobileMenuOpen(false);
                    handleScrollTo(e, link.href);
                  }}
                >
                  {link.label}
                </a>
              )
            ))}
            <div className="h-px bg-white/10 my-2"></div>
            {isAuthenticated ? (
              <div className="flex flex-col gap-3">
                <Link to="/admin/dashboard" className="text-center py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-500 flex items-center justify-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> Admin Dashboard
                </Link>
                <button onClick={logout} className="text-center py-2 border border-white/20 rounded text-slate-300 hover:text-white hover:bg-white/5">
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to="/auth/login" className="text-center py-2 border border-white/20 rounded text-slate-300 hover:text-white hover:bg-white/5">
                  Sign In
                </Link>
                <Link to="/auth/register" className="text-center py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-500">
                  Get Started
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
