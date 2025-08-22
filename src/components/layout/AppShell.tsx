import { type ReactNode } from 'react';
import { BarChart3, Home, Settings, HelpCircle } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

interface AppShellProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Insights', href: '/insights', icon: BarChart3 },
  { name: 'Dashboard', href: '/', icon: Home, disabled: true },
  { name: 'Settings', href: '/settings', icon: Settings, disabled: true },
  { name: 'Help', href: '/help', icon: HelpCircle, disabled: true },
];

export const AppShell = ({ children }: AppShellProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <BarChart3 size={18} className="text-white" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">Snowflake Insights</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side navigation */}
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Demo Environment
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
              <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <nav className="mt-5 flex-1 px-2 space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    return (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        className={
                          `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                            item.disabled
                              ? 'text-gray-400 cursor-not-allowed'
                              : isActive
                              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                              : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                          }`
                        }
                        onClick={(e) => {
                          if (item.disabled) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <Icon
                          className={`mr-3 flex-shrink-0 h-5 w-5 ${
                            item.disabled ? 'text-gray-400' : 'text-gray-500 group-hover:text-blue-500'
                          }`}
                        />
                        {item.name}
                        {item.disabled && (
                          <span className="ml-auto text-xs text-gray-400">Soon</span>
                        )}
                      </NavLink>
                    );
                  })}
                </nav>
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <div className="text-xs text-gray-500">
                  <div className="font-medium">PRD1 - Foundations Demo</div>
                  <div className="mt-1">React Flow + Tailwind CSS</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
