
import React, { useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TopNavigation } from '@/components/layout/TopNavigation';
import { ConfigurationSidebar } from '@/components/sidebar/ConfigurationSidebar';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { HistoryView } from '@/components/history/HistoryView';
import { AppProvider, useApp } from '@/contexts/AppContext';

const AppContent: React.FC = () => {
  const {
    isDarkMode,
    toggleTheme,
    activeTab,
    setActiveTab,
    isSidebarOpen,
    toggleSidebar,
    businessProfile,
    setBusinessProfile,
    classificationRules,
    setClassificationRules,
    currentMessages,
    isLoading,
    leadClassification,
    sendMessage,
    conversations,
    loadConversation,
    deleteConversation,
  } = useApp();

  useEffect(() => {
    // Apply theme to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
      {/* Top Navigation */}
      <TopNavigation
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Mobile Sidebar Toggle */}
        <div className="lg:hidden fixed top-20 left-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSidebar}
            className="bg-background/80 backdrop-blur-sm"
          >
            {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>

        {/* Sidebar */}
        <div className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 lg:z-auto`}>
          <ConfigurationSidebar
            isOpen={isSidebarOpen}
            onToggle={toggleSidebar}
            businessProfile={businessProfile}
            onBusinessProfileChange={setBusinessProfile}
            classificationRules={classificationRules}
            onClassificationRulesChange={setClassificationRules}
          />
        </div>

        {/* Sidebar Overlay for Mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {activeTab === 'chat' ? (
            <ChatInterface
              messages={currentMessages}
              onSendMessage={sendMessage}
              isLoading={isLoading}
              leadClassification={leadClassification}
              leadInfo={{
                name: currentMessages.length > 0 ? 'Lead Conversation' : 'New Lead'
              }}
            />
          ) : (
            <HistoryView
              conversations={conversations}
              onSelectConversation={loadConversation}
              onDeleteConversation={deleteConversation}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default Index;
