
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, TrendingUp, Settings, HardDrive, User } from 'lucide-react';

const Layout = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <div className="w-16 md:w-64 bg-sidebar-background text-sidebar-foreground flex flex-col">
        <div className="p-4 text-center md:text-left">
          <h1 className="text-xl font-bold hidden md:block">AquaWatch</h1>
        </div>
        
        <nav className="flex-1 p-2">
          <ul className="space-y-2">
            <li>
              <Link 
                to="/" 
                className={`flex items-center p-2 rounded-lg ${
                  isActive('/') 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                    : 'hover:bg-sidebar-accent/50 text-white/90 hover:text-white'
                }`}
              >
                <Home className="h-5 w-5" />
                <span className="ml-3 hidden md:inline-block font-medium text-sm">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/trends" 
                className={`flex items-center p-2 rounded-lg ${
                  isActive('/trends') 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                    : 'hover:bg-sidebar-accent/50 text-white/90 hover:text-white'
                }`}
              >
                <TrendingUp className="h-5 w-5" />
                <span className="ml-3 hidden md:inline-block font-medium text-sm">Trends</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/settings" 
                className={`flex items-center p-2 rounded-lg ${
                  isActive('/settings') 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                    : 'hover:bg-sidebar-accent/50 text-white/90 hover:text-white'
                }`}
              >
                <Settings className="h-5 w-5" />
                <span className="ml-3 hidden md:inline-block font-medium text-sm">Sensor Settings</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/devices" 
                className={`flex items-center p-2 rounded-lg ${
                  isActive('/devices') 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                    : 'hover:bg-sidebar-accent/50 text-white/90 hover:text-white'
                }`}
              >
                <HardDrive className="h-5 w-5" />
                <span className="ml-3 hidden md:inline-block font-medium text-sm">Devices</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/profile" 
                className={`flex items-center p-2 rounded-lg ${
                  isActive('/profile') 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                    : 'hover:bg-sidebar-accent/50 text-white/90 hover:text-white'
                }`}
              >
                <User className="h-5 w-5" />
                <span className="ml-3 hidden md:inline-block font-medium text-sm">Profile</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 hidden md:block">
          <div className="text-xs text-sidebar-foreground/70">
            <p>System v1.0.0</p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 min-h-screen bg-secondary">
        <div className="container mx-auto p-4 max-w-7xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;

