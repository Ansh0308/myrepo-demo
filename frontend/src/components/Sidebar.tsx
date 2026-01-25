import React from 'react';
import { Home, BarChart3, Calendar, Settings, Download, Upload, X } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string);
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, isOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen w-64 glass-card-strong
          transform transition-transform duration-300 ease-in-out z-50
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between lg:hidden mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 dark:hover:bg-black/10"
            >
              <X className="w-6 h-6 text-gray-800 dark:text-white" />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    onClose();
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl
                    transition-all duration-200
                    ${isActive
                      ? 'glass-card-strong text-indigo-600 dark:text-indigo-400 shadow-lg scale-105'
                      : 'text-gray-700 dark:text-gray-300 hover:glass-card hover:scale-105'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
