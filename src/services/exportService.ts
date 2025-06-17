
import { Message, LeadClassification } from '@/types/lead';

export interface ChatExportData {
  leadId: string;
  leadInfo: {
    name: string;
    phone?: string;
    email?: string;
  };
  messages: {
    id: string;
    sender: string;
    content: string;
    timestamp: string;
  }[];
  classification: string;
  classificationDetails: string;
  extractedMetadata: {
    location?: string;
    propertyType?: string;
    budget?: string;
    timeline?: string;
    purpose?: string;
    [key: string]: any;
  };
  analytics: {
    duration: number;
    messageCount: number;
    startedAt: string;
    endedAt: string;
  };
}

export class ExportService {
  static generateExportData(
    messages: Message[],
    leadClassification: LeadClassification,
    leadInfo?: { name: string; phone?: string; email?: string },
    metadata?: any
  ): ChatExportData {
    const leadId = `lead_${Date.now()}`;
    const startTime = messages.length > 0 ? new Date(messages[0].timestamp) : new Date();
    const endTime = messages.length > 0 ? new Date(messages[messages.length - 1].timestamp) : new Date();
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

    // Generate classification details
    const classificationDetails = this.getClassificationDetails(leadClassification, messages);

    // Extract metadata from messages or use provided metadata
    const extractedMetadata = this.extractMetadataFromMessages(messages, metadata);

    return {
      leadId,
      leadInfo: {
        name: leadInfo?.name || 'Anonymous Lead',
        phone: leadInfo?.phone,
        email: leadInfo?.email,
      },
      messages: messages.map(msg => ({
        id: msg.id,
        sender: msg.sender,
        content: msg.content,
        timestamp: msg.timestamp,
      })),
      classification: leadClassification,
      classificationDetails,
      extractedMetadata,
      analytics: {
        duration,
        messageCount: messages.length,
        startedAt: startTime.toISOString(),
        endedAt: endTime.toISOString(),
      },
    };
  }

  private static getClassificationDetails(classification: LeadClassification, messages: Message[]): string {
    switch (classification) {
      case 'HOT':
        return 'High intent, clear budget, urgent timeline';
      case 'COLD':
        return 'Low intent, vague requirements, no immediate timeline';
      case 'INVALID':
        return 'Spam, test entries, or unrelated inquiries';
      default:
        return 'Lead classification in progress';
    }
  }

  private static extractMetadataFromMessages(messages: Message[], providedMetadata?: any): any {
    // Start with provided metadata or empty object
    const metadata = { ...providedMetadata } || {};

    // Simple keyword extraction from messages
    const allContent = messages.map(m => m.content.toLowerCase()).join(' ');

    // Extract location keywords
    if (!metadata.location) {
      const locationMatches = allContent.match(/\b(mumbai|pune|bangalore|delhi|hyderabad|chennai|kolkata|ahmedabad|kalyani nagar|baner|kharadi|whitefield|koramangala|gurgaon|noida)\b/);
      if (locationMatches) {
        metadata.location = locationMatches[0].charAt(0).toUpperCase() + locationMatches[0].slice(1);
      }
    }

    // Extract property type
    if (!metadata.propertyType) {
      const propertyMatches = allContent.match(/\b(1bhk|2bhk|3bhk|4bhk|flat|apartment|house|villa|plot|office|shop)\b/);
      if (propertyMatches) {
        metadata.propertyType = propertyMatches[0].toUpperCase();
      }
    }

    // Extract budget
    if (!metadata.budget) {
      const budgetMatches = allContent.match(/₹?\s*(\d+(?:\.\d+)?)\s*(lakh|crore|l|cr)/);
      if (budgetMatches) {
        metadata.budget = `₹${budgetMatches[1]}${budgetMatches[2].toUpperCase()}`;
      }
    }

    // Extract timeline
    if (!metadata.timeline) {
      const timelineMatches = allContent.match(/\b(\d+)\s*(month|months|week|weeks|year|years)\b/);
      if (timelineMatches) {
        metadata.timeline = `${timelineMatches[1]} ${timelineMatches[2]}`;
      }
    }

    // Extract purpose
    if (!metadata.purpose) {
      if (allContent.includes('investment')) {
        metadata.purpose = 'Investment';
      } else if (allContent.includes('personal') || allContent.includes('family')) {
        metadata.purpose = 'Personal use';
      } else if (allContent.includes('rental') || allContent.includes('rent')) {
        metadata.purpose = 'Rental';
      }
    }

    return metadata;
  }

  static downloadAsJSON(data: ChatExportData): void {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `lead_conversation_${data.leadId}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static downloadAsCSV(data: ChatExportData): void {
    const csvRows = [
      // Header
      ['Field', 'Value'],
      ['Lead ID', data.leadId],
      ['Lead Name', data.leadInfo.name],
      ['Phone', data.leadInfo.phone || 'N/A'],
      ['Email', data.leadInfo.email || 'N/A'],
      ['Classification', data.classification],
      ['Classification Details', data.classificationDetails],
      ['Duration (seconds)', data.analytics.duration.toString()],
      ['Message Count', data.analytics.messageCount.toString()],
      ['Started At', data.analytics.startedAt],
      ['Ended At', data.analytics.endedAt],
      ['Location', data.extractedMetadata.location || 'N/A'],
      ['Property Type', data.extractedMetadata.propertyType || 'N/A'],
      ['Budget', data.extractedMetadata.budget || 'N/A'],
      ['Timeline', data.extractedMetadata.timeline || 'N/A'],
      ['Purpose', data.extractedMetadata.purpose || 'N/A'],
      [],
      ['Message ID', 'Sender', 'Content', 'Timestamp'],
      ...data.messages.map(msg => [msg.id, msg.sender, msg.content, msg.timestamp])
    ];

    const csvString = csvRows.map(row => 
      row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `lead_conversation_${data.leadId}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
