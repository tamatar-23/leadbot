
import React, { createContext, useContext, useState, useCallback } from 'react';
import { BusinessProfile, LeadClassificationRules, Message, ConversationHistory, LeadClassification } from '@/types/lead';
import { geminiService } from '@/services/geminiService';

interface AppContextType {
  // Theme
  isDarkMode: boolean;
  toggleTheme: () => void;
  
  // Navigation
  activeTab: 'chat' | 'history';
  setActiveTab: (tab: 'chat' | 'history') => void;
  
  // Sidebar
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  
  // Business Configuration
  businessProfile: BusinessProfile;
  setBusinessProfile: (profile: BusinessProfile) => void;
  classificationRules: LeadClassificationRules;
  setClassificationRules: (rules: LeadClassificationRules) => void;
  
  // Chat
  currentMessages: Message[];
  isLoading: boolean;
  leadClassification: LeadClassification;
  sendMessage: (content: string) => Promise<void>;
  clearConversation: () => void;
  
  // History
  conversations: ConversationHistory[];
  loadConversation: (conversation: ConversationHistory) => void;
  deleteConversation: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultBusinessProfile: BusinessProfile = {
  businessName: 'GrowEasy Realtors',
  industry: 'real-estate',
  location: 'Mumbai, India',
  agentName: 'Sarah',
  responseStyle: 'professional',
};

const defaultClassificationRules: LeadClassificationRules = {
  hotCriteria: 'Budget defined, timeline < 6 months, specific requirements, ready to buy',
  coldCriteria: 'Vague requirements, no timeline, just browsing, price shopping',
  invalidCriteria: 'Spam, test entries, gibberish responses, unrelated inquiries',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Navigation state
  const [activeTab, setActiveTab] = useState<'chat' | 'history'>('chat');
  
  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Configuration state
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(defaultBusinessProfile);
  const [classificationRules, setClassificationRules] = useState<LeadClassificationRules>(defaultClassificationRules);
  
  // Chat state
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [leadClassification, setLeadClassification] = useState<LeadClassification>('ANALYZING');
  
  // History state
  const [conversations, setConversations] = useState<ConversationHistory[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const generateMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const generateConversationId = () => `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: generateMessageId(),
      sender: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setCurrentMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const allMessages = [...currentMessages, userMessage];
      
      // Generate AI response
      const aiResponse = await geminiService.generateResponse(allMessages, businessProfile);
      
      const aiMessage: Message = {
        id: generateMessageId(),
        sender: 'ai',
        content: aiResponse,
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...allMessages, aiMessage];
      setCurrentMessages(updatedMessages);

      // Classify lead after a few messages
      if (updatedMessages.length >= 4) {
        const classification = await geminiService.classifyLead(updatedMessages, businessProfile);
        setLeadClassification(classification);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: generateMessageId(),
        sender: 'system',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      };
      
      setCurrentMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [currentMessages, businessProfile]);

  const clearConversation = useCallback(() => {
    if (currentMessages.length > 0) {
      // Save current conversation to history
      const conversationHistory: ConversationHistory = {
        id: currentConversationId || generateConversationId(),
        leadName: 'Anonymous Lead',
        messages: currentMessages,
        classification: leadClassification,
        duration: Math.floor(Date.now() / 1000), // Simplified duration
        messageCount: currentMessages.length,
        startedAt: currentMessages[0]?.timestamp || new Date().toISOString(),
        lastMessage: currentMessages[currentMessages.length - 1]?.content,
      };

      setConversations(prev => [conversationHistory, ...prev]);
    }

    setCurrentMessages([]);
    setLeadClassification('ANALYZING');
    setCurrentConversationId(null);
  }, [currentMessages, leadClassification, currentConversationId]);

  const loadConversation = useCallback((conversation: ConversationHistory) => {
    setCurrentMessages(conversation.messages);
    setLeadClassification(conversation.classification);
    setCurrentConversationId(conversation.id);
    setActiveTab('chat');
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
  }, []);

  const value: AppContextType = {
    // Theme
    isDarkMode,
    toggleTheme,
    
    // Navigation
    activeTab,
    setActiveTab,
    
    // Sidebar
    isSidebarOpen,
    toggleSidebar,
    
    // Configuration
    businessProfile,
    setBusinessProfile,
    classificationRules,
    setClassificationRules,
    
    // Chat
    currentMessages,
    isLoading,
    leadClassification,
    sendMessage,
    clearConversation,
    
    // History
    conversations,
    loadConversation,
    deleteConversation,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
