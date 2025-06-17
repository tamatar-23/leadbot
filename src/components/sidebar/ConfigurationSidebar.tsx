
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Building, User, Settings as SettingsIcon, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BusinessProfile, LeadClassificationRules } from '@/types/lead';

interface ConfigurationSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  businessProfile: BusinessProfile;
  onBusinessProfileChange: (profile: BusinessProfile) => void;
  classificationRules: LeadClassificationRules;
  onClassificationRulesChange: (rules: LeadClassificationRules) => void;
}

export const ConfigurationSidebar: React.FC<ConfigurationSidebarProps> = ({
  isOpen,
  onToggle,
  businessProfile,
  onBusinessProfileChange,
  classificationRules,
  onClassificationRulesChange,
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    profile: true,
    classification: false,
    settings: false,
    templates: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="w-80 bg-background/95 backdrop-blur-md border-r border-border/50 h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Business Profile Section */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader 
            className="pb-2 cursor-pointer"
            onClick={() => toggleSection('profile')}
          >
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-blue-500" />
                <span>Business Profile</span>
              </div>
              {expandedSections.profile ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </CardTitle>
          </CardHeader>
          {expandedSections.profile && (
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="businessName" className="text-xs">Business Name</Label>
                <Input
                  id="businessName"
                  value={businessProfile.businessName}
                  onChange={(e) => onBusinessProfileChange({
                    ...businessProfile,
                    businessName: e.target.value
                  })}
                  className="mt-1 bg-background/50"
                  placeholder="e.g., GrowEasy Realtors"
                />
              </div>
              <div>
                <Label htmlFor="industry" className="text-xs">Industry</Label>
                <Select
                  value={businessProfile.industry}
                  onValueChange={(value) => onBusinessProfileChange({
                    ...businessProfile,
                    industry: value
                  })}
                >
                  <SelectTrigger className="mt-1 bg-background/50">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="real-estate">Real Estate</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="saas">SaaS</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location" className="text-xs">Location</Label>
                <Input
                  id="location"
                  value={businessProfile.location}
                  onChange={(e) => onBusinessProfileChange({
                    ...businessProfile,
                    location: e.target.value
                  })}
                  className="mt-1 bg-background/50"
                  placeholder="e.g., India"
                />
              </div>
              <div>
                <Label htmlFor="agentName" className="text-xs">Agent Name</Label>
                <Input
                  id="agentName"
                  value={businessProfile.agentName}
                  onChange={(e) => onBusinessProfileChange({
                    ...businessProfile,
                    agentName: e.target.value
                  })}
                  className="mt-1 bg-background/50"
                  placeholder="e.g., Sarah"
                />
              </div>
              <div>
                <Label htmlFor="responseStyle" className="text-xs">Response Style</Label>
                <Select
                  value={businessProfile.responseStyle}
                  onValueChange={(value) => onBusinessProfileChange({
                    ...businessProfile,
                    responseStyle: value
                  })}
                >
                  <SelectTrigger className="mt-1 bg-background/50">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Classification Rules Section */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader 
            className="pb-2 cursor-pointer"
            onClick={() => toggleSection('classification')}
          >
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <SettingsIcon className="w-4 h-4 text-green-500" />
                <span>Classification Rules</span>
              </div>
              {expandedSections.classification ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </CardTitle>
          </CardHeader>
          {expandedSections.classification && (
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs text-green-500">Hot Lead Criteria</Label>
                <Textarea
                  value={classificationRules.hotCriteria}
                  onChange={(e) => onClassificationRulesChange({
                    ...classificationRules,
                    hotCriteria: e.target.value
                  })}
                  className="mt-1 bg-background/50 text-xs"
                  rows={3}
                  placeholder="Budget defined, timeline < 6 months, specific requirements"
                />
              </div>
              <div>
                <Label className="text-xs text-yellow-500">Cold Lead Criteria</Label>
                <Textarea
                  value={classificationRules.coldCriteria}
                  onChange={(e) => onClassificationRulesChange({
                    ...classificationRules,
                    coldCriteria: e.target.value
                  })}
                  className="mt-1 bg-background/50 text-xs"
                  rows={3}
                  placeholder="Vague requirements, no timeline, browsing only"
                />
              </div>
              <div>
                <Label className="text-xs text-red-500">Invalid Criteria</Label>
                <Textarea
                  value={classificationRules.invalidCriteria}
                  onChange={(e) => onClassificationRulesChange({
                    ...classificationRules,
                    invalidCriteria: e.target.value
                  })}
                  className="mt-1 bg-background/50 text-xs"
                  rows={3}
                  placeholder="Spam, test entries, gibberish responses"
                />
              </div>
            </CardContent>
          )}
        </Card>

        {/* Quick Templates Section */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader 
            className="pb-2 cursor-pointer"
            onClick={() => toggleSection('templates')}
          >
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-purple-500" />
                <span>Quick Templates</span>
              </div>
              {expandedSections.templates ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </CardTitle>
          </CardHeader>
          {expandedSections.templates && (
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                Real Estate Template
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                Insurance Template
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                SaaS Template
              </Button>
              <div className="pt-2 border-t border-border/50">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Import Configuration
                </Button>
                <Button variant="outline" size="sm" className="w-full text-xs mt-1">
                  Export Configuration
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};
