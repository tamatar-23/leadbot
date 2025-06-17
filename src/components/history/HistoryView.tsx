
import React, { useState } from 'react';
import { Search, Filter, Grid, List, Calendar, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ConversationHistory, LeadClassification } from '@/types/lead';

interface HistoryViewProps {
  conversations: ConversationHistory[];
  onSelectConversation: (conversation: ConversationHistory) => void;
  onDeleteConversation: (id: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  conversations,
  onSelectConversation,
  onDeleteConversation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [classificationFilter, setClassificationFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.leadPhone?.includes(searchTerm) ||
                         conv.messages.some(msg => msg.content.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = classificationFilter === 'all' || conv.classification === classificationFilter;
    
    return matchesSearch && matchesFilter;
  });

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full bg-background/50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Conversation History</h2>
          <p className="text-muted-foreground">
            {filteredConversations.length} of {conversations.length} conversations
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background/50 backdrop-blur-sm"
          />
        </div>
        
        <Select value={classificationFilter} onValueChange={setClassificationFilter}>
          <SelectTrigger className="w-48 bg-background/50 backdrop-blur-sm">
            <SelectValue placeholder="Filter by classification" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classifications</SelectItem>
            <SelectItem value="HOT">Hot Leads</SelectItem>
            <SelectItem value="COLD">Cold Leads</SelectItem>
            <SelectItem value="INVALID">Invalid Leads</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Conversations Grid/List */}
      {filteredConversations.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No conversations found</h3>
          <p className="text-muted-foreground">
            {conversations.length === 0 
              ? 'Start chatting to see conversation history here'
              : 'Try adjusting your search or filter criteria'
            }
          </p>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'space-y-4'
        }>
          {filteredConversations.map((conversation) => (
            <Card 
              key={conversation.id}
              className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all duration-200 cursor-pointer group"
              onClick={() => onSelectConversation(conversation)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">{conversation.leadName}</CardTitle>
                    {conversation.leadPhone && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {conversation.leadPhone}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getClassificationColor(conversation.classification)} text-xs`}>
                      {conversation.classification}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conversation.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{conversation.messageCount} messages</span>
                    <span>{formatDuration(conversation.duration)}</span>
                  </div>
                  
                  {conversation.lastMessage && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {conversation.lastMessage}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {new Date(conversation.startedAt).toLocaleDateString()}
                    </span>
                    <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
