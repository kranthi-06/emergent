import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Radio, 
  Droplets, 
  BarChart3, 
  Bell, 
  CloudSun, 
  Settings, 
  Info,
  Leaf
} from 'lucide-react';
import { cn } from '../lib/utils';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/sensors', label: 'Sensor Monitoring', icon: Radio },
  { path: '/irrigation', label: 'Irrigation Control', icon: Droplets },
  { path: '/analytics', label: 'Analytics / History', icon: BarChart3 },
  { path: '/alerts', label: 'Alerts & Logs', icon: Bell },
  { path: '/weather', label: 'Weather Advisory', icon: CloudSun },
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/about', label: 'About Project', icon: Info },
];

export default function Sidebar({ isOpen }) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        'bg-card border-r border-border h-screen transition-all duration-300 flex-shrink-0',
        isOpen ? 'w-64' : 'w-0 md:w-20'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            {isOpen && (
              <div>
                <h1 className="text-lg font-semibold text-foreground">AgroSmart</h1>
                <p className="text-xs text-muted-foreground">IoT Monitoring</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      'sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
                      isActive
                        ? 'active text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {isOpen && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        {isOpen && (
          <div className="p-4 border-t border-border">
            <div className="bg-muted rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">System Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                <span className="text-sm font-medium text-foreground">Online</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
