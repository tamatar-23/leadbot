
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, User, Copy, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Message, LeadClassification } from '@/types/lead';
import { ExportService } from '@/services/exportService';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  leadClassification: LeadClassification;
  leadInfo?: {
    name: string;
    phone?: string;
    email?: string;
  };
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isLoading,
  leadClassification,
  leadInfo,
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-focus the textarea
  useEffect(() => {
    if (textareaRef.current && !isLoading) {
      textareaRef.current.focus();
    }
  }, [messages, isLoading]);

  const handleSend = () => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getClassificationColor = (classification: LeadClassification) => {
    switch (classification) {
      case 'HOT':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'COLD':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'INVALID':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleDownload = (format: 'json' | 'csv') => {
    if (messages.length === 0) return;

    const exportData = ExportService.generateExportData(
      messages,
      leadClassification,
      leadInfo
    );

    if (format === 'json') {
      ExportService.downloadAsJSON(exportData);
    } else {
      ExportService.downloadAsCSV(exportData);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background/50">
      {/* Chat Header */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 rounded-none border-x-0 border-t-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                {leadInfo?.name || 'New Lead Conversation'}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                {leadInfo?.phone && (
                  <span className="text-sm text-muted-foreground">{leadInfo.phone}</span>
                )}
                {leadInfo?.email && (
                  <span className="text-sm text-muted-foreground">{leadInfo.email}</span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={`${getClassificationColor(leadClassification)} font-medium`}>
                {leadClassification === 'ANALYZING' ? 'Analyzing...' : `${leadClassification} LEAD`}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" disabled={messages.length === 0}>
                    <Download className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleDownload('json')}>
                    <FileText className="w-4 h-4 mr-2" />
                    Download as JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload('csv')}>
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Download as CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
            <p className="text-muted-foreground">Send a message to begin lead qualification</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.sender === 'ai' 
                ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                : 'bg-gradient-to-br from-green-500 to-blue-500'
            }`}>
              {message.sender === 'ai' ? (
                <Sparkles className="w-4 h-4 text-white" />
              ) : (
                <User className="w-4 h-4 text-white" />
              )}
            </div>

            {/* Message Bubble */}
            <div className={`max-w-[70%] group ${
              message.sender === 'user' ? 'text-right' : ''
            }`}>
              <div className={`rounded-2xl px-4 py-3 relative ${
                message.sender === 'ai'
                  ? 'bg-card/50 backdrop-blur-sm border border-border/50'
                  : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                
                {/* Copy Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0 bg-background/80 backdrop-blur-sm"
                  onClick={() => copyMessage(message.content)}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              
              {/* Timestamp */}
              <div className={`text-xs text-muted-foreground mt-1 ${
                message.sender === 'user' ? 'text-right' : ''
              }`}>
                {new Date(message.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-card/30 backdrop-blur-sm border-t border-border/50">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="resize-none bg-background/50 backdrop-blur-sm border-border/50 rounded-2xl pr-12 min-h-[44px] max-h-32"
              rows={1}
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="rounded-full w-11 h-11 p-0 bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Sparkles className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
