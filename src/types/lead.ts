
export type LeadClassification = 'HOT' | 'COLD' | 'INVALID' | 'ANALYZING';

export interface Message {
  id: string;
  sender: 'ai' | 'user' | 'system';
  content: string;
  timestamp: string;
}

export interface BusinessProfile {
  businessName: string;
  industry: string;
  location: string;
  agentName: string;
  responseStyle: string;
}

export interface LeadClassificationRules {
  hotCriteria: string;
  coldCriteria: string;
  invalidCriteria: string;
}

export interface ConversationHistory {
  id: string;
  leadName: string;
  leadPhone?: string;
  leadEmail?: string;
  messages: Message[];
  classification: LeadClassification;
  duration: number;
  messageCount: number;
  startedAt: string;
  lastMessage?: string;
}

export interface LeadAnalysis {
  intent: number;
  budget: number;
  timeline: number;
  engagement: number;
  classification: LeadClassification;
  confidence: number;
}
