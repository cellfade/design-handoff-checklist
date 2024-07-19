"use client";

import React, { useState, useEffect } from 'react';
import { Check, X, Calendar, MessageSquare, Trash2, Sun, Moon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { useTheme } from 'next-themes';
import { encode, decode } from 'js-base64';

const initialChecklist = [
  { id: 1, category: 'Visual Design', item: 'Color palette defined', deadline: '', comments: [] },
  { id: 2, category: 'Visual Design', item: 'Typography styles specified', deadline: '', comments: [] },
  { id: 3, category: 'Visual Design', item: 'Iconography provided', deadline: '', comments: [] },
  { id: 4, category: 'Layout', item: 'Responsive breakpoints defined', deadline: '', comments: [] },
  { id: 5, category: 'Layout', item: 'Grid system specified', deadline: '', comments: [] },
  { id: 6, category: 'Components', item: 'Button states designed', deadline: '', comments: [] },
  { id: 7, category: 'Components', item: 'Form elements styled', deadline: '', comments: [] },
  { id: 8, category: 'Components', item: 'Navigation components detailed', deadline: '', comments: [] },
  { id: 9, category: 'Interaction', item: 'Hover states defined', deadline: '', comments: [] },
  { id: 10, category: 'Interaction', item: 'Animations specified', deadline: '', comments: [] },
  { id: 11, category: 'Assets', item: 'Image assets exported', deadline: '', comments: [] },
  { id: 12, category: 'Assets', item: 'Icon set provided', deadline: '', comments: [] },
  { id: 13, category: 'Documentation', item: 'Design system documentation', deadline: '', comments: [] },
  { id: 14, category: 'Documentation', item: 'Interaction specifications', deadline: '', comments: [] },
  { id: 15, category: 'Handoff', item: 'Zeplin/Figma links shared', deadline: '', comments: [] },
];

const SocialImagePreview = ({ url }) => {
  const placeholderImage = "https://placehold.co/600x400?text=Figma+Preview";

  return (
    <div className="mt-4 border rounded-lg overflow-hidden">
      <img src={placeholderImage} alt="Social preview" className="w-full h-auto" />
      <div className="p-4 bg-white">
        <h3 className="font-semibold text-lg mb-2">Figma Design Preview</h3>
        <p className="text-sm text-gray-600">{url}</p>
      </div>
    </div>
  );
};

const ChecklistItem = ({ item, checked, onToggle, onDeadlineChange, onCommentAdd, onCommentDelete }) => (
  <div className="text-gray-800">
    <div className="flex items-center space-x-2 mb-4">
      <Switch
        checked={checked}
        onCheckedChange={() => onToggle(item.id)}
      />
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-grow cursor-pointer">
        {item.item}
      </label>
      <Input
        type="date"
        value={item.deadline}
        onChange={(e) => onDeadlineChange(item.id, e.target.value)}
        className="w-40"
      />
      <Button variant="outline" size="icon" onClick={() => {
        const comment = prompt('Enter a comment:');
        if (comment) onCommentAdd(item.id, comment);
      }}>
        <MessageSquare className="h-4 w-4" />
      </Button>
      {item.deadline && <Calendar className="h-4 w-4 text-gray-500" />}
      {item.comments.length > 0 && <span className="text-sm text-gray-600">({item.comments.length})</span>}
    </div>
    {item.comments.length > 0 && (
      <div className="ml-6 mt-2">
        <h4 className="text-sm font-semibold text-gray-800">Comments:</h4>
        <ul className="list-none">
          {item.comments.map((comment, index) => (
            <li key={index} className="text-sm text-gray-700 flex items-center justify-between mb-1">
              <span>{comment}</span>
              <Button 
                variant="outline"
                size="icon"
                onClick={() => onCommentDelete(item.id, index)} 
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

const EmailModal = ({ isOpen, onClose, onSend, title }) => {
  const [email, setEmail] = useState('');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Input
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={() => onSend(email)}>Send Email</Button>
      </DialogContent>
    </Dialog>
  );
};

const ShareModal = ({ isOpen, onClose, url }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      alert('URL copied to clipboard!');
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Shareable Link</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Input value={url} readOnly />
          <Button onClick={copyToClipboard} className="mt-2">Copy to Clipboard</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-4 w-4" />
      <Switch
        checked={theme === 'dark'}
        onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />
      <Moon className="h-4 w-4" />
    </div>
  );
};

const DesignHandoffChecklist = () => {
  const [checklist, setChecklist] = useState(initialChecklist);
  const [checkedItems, setCheckedItems] = useState({});
  const [figmaLink, setFigmaLink] = useState('');
  const [projectNotes, setProjectNotes] = useState('');
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRequestChangesModalOpen, setIsRequestChangesModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareableUrl, setShareableUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const stateParam = urlParams.get('state');
    if (stateParam) {
      loadState(stateParam);
    }
    setIsLoading(false);
  }, []);

  const handleToggle = (id) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDeadlineChange = (id, date) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, deadline: date } : item
    ));
  };

  const handleCommentAdd = (id, comment) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, comments: [...item.comments, comment] } : item
    ));
  };

  const handleCommentDelete = (id, commentIndex) => {
    setChecklist(checklist.map(item => 
      item.id === id 
        ? { ...item, comments: item.comments.filter((_, index) => index !== commentIndex) } 
        : item
    ));
  };

  const categories = [...new Set(checklist.map(item => item.category))];

  const getProgress = () => {
    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    return (checkedCount / checklist.length) * 100;
  };

  const generateMarkdown = (includeAll = true) => {
    let markdown = `# Design Handoff Checklist\n\n`;
    markdown += `Figma Link: ${figmaLink}\n\n`;
    
    markdown += `![Figma Preview](https://placehold.co/600x400?text=Figma+Preview)\n\n`;
    
    if (projectNotes) {
      markdown += `## Project Notes\n\n${projectNotes}\n\n`;
    }
    
    categories.forEach(category => {
      markdown += `## ${category}\n\n`;
      checklist
        .filter(item => item.category === category)
        .filter(item => includeAll || !checkedItems[item.id])
        .forEach(item => {
          markdown += `- [${checkedItems[item.id] ? 'x' : ' '}] ${item.item}\n`;
          if (item.deadline) markdown += `  Deadline: ${item.deadline}\n`;
          if (item.comments.length > 0) {
            markdown += `  Comments:\n`;
            item.comments.forEach(comment => {
              markdown += `    - ${comment}\n`;
            });
          }
          markdown += '\n';
        });
    });

    return markdown;
  };

  const sendEmail = (email, isApproval) => {
    const subject = isApproval ? 'Design Approved' : 'Design Changes Requested';
    const body = generateMarkdown(!isApproval);
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
  };

  const saveState = () => {
    const state = {
      checklist,
      checkedItems,
      figmaLink,
      projectNotes
    };
    return encode(JSON.stringify(state));
  };

  const loadState = (stateString) => {
    try {
      const state = JSON.parse(decode(stateString));
      setChecklist(state.checklist || initialChecklist);
      setCheckedItems(state.checkedItems || {});
      setFigmaLink(state.figmaLink || '');
      setProjectNotes(state.projectNotes || '');
    } catch (error) {
      console.error('Error loading state:', error);
    }
  };

  const handleSaveAndShare = () => {
    const stateString = saveState();
    const url = `${window.location.origin}${window.location.pathname}?state=${encodeURIComponent(stateString)}`;
    setShareableUrl(url);
    setIsShareModalOpen(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Design Handoff Checklist</h1>
        <ThemeToggle />
      </div>
      
      <div className="space-y-4 mb-8">
        <Input
          value={figmaLink}
          onChange={(e) => setFigmaLink(e.target.value)}
          placeholder="Enter Figma link"
        />
        <Button onClick={handleSaveAndShare}>
          Save & Share
        </Button>
        <Textarea
          value={projectNotes}
          onChange={(e) => setProjectNotes(e.target.value)}
          placeholder="Enter any additional notes for the project..."
          rows={4}
        />
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={getProgress()} className="w-full" />
          <p className="text-right mt-2 text-sm">
            {Math.round(getProgress())}% Complete
          </p>
        </CardContent>
      </Card>

      {categories.map(category => (
        <Card key={category} className="mb-6">
          <CardHeader>
            <CardTitle>{category}</CardTitle>
          </CardHeader>
          <CardContent>
            {checklist
              .filter(item => item.category === category)
              .map(item => (
                <ChecklistItem
                  key={item.id}
                  item={item}
                  checked={checkedItems[item.id] || false}
                  onToggle={handleToggle}
                  onDeadlineChange={handleDeadlineChange}
                  onCommentAdd={handleCommentAdd}
                  onCommentDelete={handleCommentDelete}
                />
              ))
            }
          </CardContent>
        </Card>
      ))}

      <div className="mt-8 flex justify-between">
        <Button
          onClick={() => setIsApproveModalOpen(true)}
          disabled={getProgress() !== 100}
          variant={getProgress() === 100 ? "default" : "secondary"}
        >
          <Check className="mr-2" size={16} />
          Approve Design
        </Button>
        <Button
          onClick={() => setIsRequestChangesModalOpen(true)}
          variant="destructive"
        >
          <X className="mr-2" size={16} />
          Request Changes
        </Button>
      </div>

      <EmailModal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        onSend={(email) => {
          sendEmail(email, true);
          setIsApproveModalOpen(false);
        }}
        title="Approve Design"
      />

      <EmailModal
        isOpen={isRequestChangesModalOpen}
        onClose={() => setIsRequestChangesModalOpen(false)}
        onSend={(email) => {
          sendEmail(email, false);
          setIsRequestChangesModalOpen(false);
        }}
        title="Request Changes"
      />

      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        url={shareableUrl} 
      />
    </div>
  );
};

export default DesignHandoffChecklist;