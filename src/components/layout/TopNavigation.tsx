
import React from 'react';
import { Settings, User, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TopNavigationProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  activeTab: 'chat' | 'history';
  onTabChange: (tab: 'chat' | 'history') => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  isDarkMode,
  onToggleTheme,
  activeTab,
  onTabChange,
}) => {
  return (
    <nav className="h-16 bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            LeadBot AI
          </h1>
        </div>

        {/* Center: Tab Switcher */}
        <div className="flex bg-muted/50 rounded-lg p-1 backdrop-blur-sm">
          <button
            onClick={() => onTabChange('chat')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'chat'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => onTabChange('history')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'history'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            History
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleTheme}
            className="rounded-lg hover:bg-muted/50"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="sm" className="rounded-lg hover:bg-muted/50">
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="rounded-lg hover:bg-muted/50">
            <User className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
};
