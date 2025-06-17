import { BusinessProfile, LeadClassification, Message } from '@/types/lead';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export class GeminiService {
  private validateApiKey(): void {
    if (!GEMINI_API_KEY) {
      throw new Error('REACT_APP_GEMINI_API_KEY is not set in environment variables');
    }
  }

  private async callGemini(prompt: string): Promise<string> {
    this.validateApiKey();

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API Error:', errorData);
        throw new Error(`HTTP error! status: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();

      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw new Error('Failed to get response from AI assistant');
    }
  }

  private buildConversationPrompt(
      messages: Message[],
      businessProfile: BusinessProfile,
      isFirstMessage: boolean = false
  ): string {
    const conversationHistory = messages
        .map(msg => `${msg.sender === 'user' ? 'Lead' : 'Agent'}: ${msg.content}`)
        .join('\n');

    const systemPrompt = `You are ${businessProfile.agentName}, a ${businessProfile.responseStyle.toLowerCase()} ${businessProfile.industry} agent from ${businessProfile.businessName} located in ${businessProfile.location}.

Your role is to qualify leads through natural conversation. You should:

1. Be warm, helpful, and professional
2. Ask qualifying questions naturally within the conversation
3. Gather information about:
   - Budget/price range
   - Timeline for purchase/decision
   - Specific requirements/preferences  
   - Contact information (if not provided)
   - Decision-making authority

4. Respond in a conversational, human-like manner
5. Keep responses concise (2-3 sentences max)
6. Show genuine interest in helping the lead
7. Avoid being pushy or overly salesy

${isFirstMessage ? `This is the first interaction. Greet the lead warmly and ask how you can help them today.` : ''}

Current conversation:
${conversationHistory}

Respond as ${businessProfile.agentName}:`;

    return systemPrompt;
  }

  async generateResponse(
      messages: Message[],
      businessProfile: BusinessProfile
  ): Promise<string> {
    const isFirstMessage = messages.length === 0;
    const prompt = this.buildConversationPrompt(messages, businessProfile, isFirstMessage);

    // Add a small delay to simulate more natural conversation
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    return await this.callGemini(prompt);
  }

  async classifyLead(
      messages: Message[],
      businessProfile: BusinessProfile
  ): Promise<LeadClassification> {
    if (messages.length < 4) {
      return 'ANALYZING';
    }

    const conversationText = messages
        .map(msg => `${msg.sender}: ${msg.content}`)
        .join('\n');

    const classificationPrompt = `Analyze this lead qualification conversation and classify the lead as HOT, COLD, or INVALID.

Business Context: ${businessProfile.industry} business (${businessProfile.businessName})

Classification Criteria:
- HOT: Shows clear buying intent, has budget/timeline, specific requirements, engaged responses
- COLD: Vague interest, no timeline/budget mentioned, generic responses, just browsing
- INVALID: Spam, test messages, gibberish, unrelated inquiries, rude behavior

Conversation:
${conversationText}

Respond with only one word: HOT, COLD, or INVALID`;

    try {
      const result = await this.callGemini(classificationPrompt);
      const classification = result.trim().toUpperCase();

      if (['HOT', 'COLD', 'INVALID'].includes(classification)) {
        return classification as LeadClassification;
      }

      return 'ANALYZING';
    } catch (error) {
      console.error('Error classifying lead:', error);
      return 'ANALYZING';
    }
  }
}

export const geminiService = new GeminiService();