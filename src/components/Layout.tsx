
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  Users, 
  FileText, 
  ClipboardCheck, 
  ClipboardList, 
  LogOut, 
  Menu, 
  X,
  User,
  Settings
} from 'lucide-react';
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { currentUser, logout, isAdmin, isStaff } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Home className="mr-3" size={20} />, access: true },
    { path: '/residents', label: 'Residents', icon: <Users className="mr-3" size={20} />, access: isStaff },
    { path: '/checkout-forms', label: 'Checkout Forms', icon: <FileText className="mr-3" size={20} />, access: true },
    { path: '/clearance', label: 'Clearance', icon: <ClipboardCheck className="mr-3" size={20} />, access: isStaff },
    { path: '/reports', label: 'Reports', icon: <ClipboardList className="mr-3" size={20} />, access: isAdmin },
    { path: '/settings', label: 'Settings', icon: <Settings className="mr-3" size={20} />, access: isAdmin }
  ];

  const filteredNavItems = navItems.filter(item => item.access);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex min-h-screen bg-dorm-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-brick-pattern text-white">
        {/* Logo */}
        <div className="py-6 px-4 flex items-center justify-center border-b border-dorm-secondary/50">
          <h1 className="text-2xl font-bold text-shadow">ALGCIT DORM</h1>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {filteredNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-3 rounded-md transition-colors ${
                isActive(item.path) 
                  ? 'bg-white text-dorm-primary font-medium' 
                  : 'hover:bg-dorm-secondary/50'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        
        {/* User info and logout */}
        {currentUser && (
          <div className="p-4 border-t border-dorm-secondary/50">
            <div className="flex items-center mb-3">
              <div className="bg-white text-dorm-primary rounded-full p-2 mr-3">
                <User size={20} />
              </div>
              <div>
                <p className="font-medium">{currentUser.firstName} {currentUser.lastName}</p>
                <p className="text-sm opacity-80 capitalize">{currentUser.role}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full justify-start text-white border-white hover:bg-dorm-secondary/50 hover:text-white"
              onClick={logout}
            >
              <LogOut size={18} className="mr-2" /> Logout
            </Button>
          </div>
        )}
      </aside>

      {/* Mobile Hamburger Menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-brick-pattern text-white z-30 flex items-center justify-between px-4 py-3 shadow-md">
        <h1 className="text-xl font-bold">ALGCIT DORM</h1>
        <button onClick={toggleMobileMenu} className="p-2">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleMobileMenu}></div>
      )}

      {/* Mobile Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-brick-pattern text-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="py-6 px-4 flex items-center justify-center border-b border-dorm-secondary/50">
          <h1 className="text-2xl font-bold text-shadow">ALGCIT DORM</h1>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {filteredNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-3 rounded-md transition-colors ${
                isActive(item.path) 
                  ? 'bg-white text-dorm-primary font-medium' 
                  : 'hover:bg-dorm-secondary/50'
              }`}
              onClick={toggleMobileMenu}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        
        {/* User info and logout */}
        {currentUser && (
          <div className="p-4 border-t border-dorm-secondary/50">
            <div className="flex items-center mb-3">
              <div className="bg-white text-dorm-primary rounded-full p-2 mr-3">
                <User size={20} />
              </div>
              <div>
                <p className="font-medium">{currentUser.firstName} {currentUser.lastName}</p>
                <p className="text-sm opacity-80 capitalize">{currentUser.role}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full justify-start text-white border-white hover:bg-dorm-secondary/50 hover:text-white"
              onClick={() => { logout(); toggleMobileMenu(); }}
            >
              <LogOut size={18} className="mr-2" /> Logout
            </Button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 pt-16 md:pt-0">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;