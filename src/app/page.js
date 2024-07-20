"use client";

import React, { useState, useEffect } from 'react';
import { Check, X, Calendar, MessageSquare, Trash2, Sun, Moon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Progress } from '@/components/ui/progress';
import { useTheme } from 'next-themes';
import { encode, decode } from 'js-base64';
import axios from 'axios';

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

const ChecklistItem = ({ item, checked, onToggle, onDeadlineChange, onCommentAdd, onCommentDelete }) => (
  <div className="text-gray-800 dark:text-gray-200">
    <div className="flex items-center space-x-2 mb-4">
      <Checkbox
        checked={checked}
        onCheckedChange={() => onToggle(item.id)}
        className="border-gray-300 text-blue-600 focus:ring-blue-500"
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
      {item.deadline && <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
      {item.comments.length > 0 && <span className="text-sm text-gray-600 dark:text-gray-300">({item.comments.length})</span>}
    </div>
    {item.comments.length > 0 && (
      <div className="ml-6 mt-2">
        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Comments:</h4>
        <ul className="list-none">
          {item.comments.map((comment, index) => (
            <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-center justify-between mb-1">
              <span>{comment}</span>
              <Button 
                variant="outline"
                size="icon"
                onClick={() => onCommentDelete(item.id, index)} 
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
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

const Footer = () => (
  <footer
  className="mt-12 py-6 bg-gray-100 dark:bg-gray-900 rounded-lg opacity-80 transition-opacity duration-300 hover:opacity-100">
    <div className="container mx-auto flex justify-between items-center">
      <div className="flex space-x-4">
        <a href="https://github.com/cellfade" target="_blank" rel="noopener noreferrer">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-github"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
        </a>
        <a href="https://x.com/cellfade" target="_blank" rel="noopener noreferrer">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-twitter"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
        </a>
      </div>
      <a href="https://bento.me/cellfade/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 dark:text-gray-400">
        Created by Andrew G Miller
      </a>
    </div>
  </footer>
);

const DesignHandoffChecklist = () => {
  const [checklist, setChecklist] = useState(initialChecklist);
  const [checkedItems, setCheckedItems] = useState({});
  const [designer, setDesigner] = useState('');
  const [designerEmail, setDesignerEmail] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [projectNotes, setProjectNotes] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setUploadedImage(URL.createObjectURL(file));
  };

  const categories = [...new Set(checklist.map(item => item.category))];

  const getProgress = () => {
    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    return (checkedCount / checklist.length) * 100;
  };

  const generateMarkdown = (includeAll = true) => {
    let markdown = `# Design Handoff Checklist\n\n`;
    markdown += `Designer: ${designer}\n`;
    markdown += `Designer Email: ${designerEmail}\n`;
    markdown += `Project Link: ${projectLink}\n\n`;
    
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
      designer,
      designerEmail,
      projectLink,
      projectNotes,
      uploadedImage
    };
    return encode(JSON.stringify(state));
  };

  const loadState = (stateString) => {
    try {
      const state = JSON.parse(decode(stateString));
      setChecklist(state.checklist || initialChecklist);
      setCheckedItems(state.checkedItems || {});
      setDesigner(state.designer || '');
      setDesignerEmail(state.designerEmail || '');
      setProjectLink(state.projectLink || '');
      setProjectNotes(state.projectNotes || '');
      setUploadedImage(state.uploadedImage || null);
    } catch (error) {
      console.error('Error loading state:', error);
    }
  };

  const shortenUrl = async (longUrl) => {
    try {
      const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
      return response.data;
    } catch (error) {
      console.error('Error shortening URL:', error);
      return longUrl; // Return original URL if shortening fails
    }
  };

  const handleSaveAndShare = async () => {
    const stateString = saveState();
    const longUrl = `${window.location.origin}${window.location.pathname}?state=${encodeURIComponent(stateString)}`;
    const shortUrl = await shortenUrl(longUrl);
    setShareableUrl(shortUrl);
    setIsShareModalOpen(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center py-8 px-4"
      style={{ backgroundImage: `url('https://iili.io/dnzrCf1.png')` }}
    >
      <div className="container mx-auto max-w-4xl bg-white dark:bg-gray-800 p-6 rounded-lg shadow-custom">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Design Handoff Checklist</h1>
          <ThemeToggle />
        </div>
        
        <div className="space-y-4 mb-8">
          <Input
            value={designer}
            onChange={(e) => setDesigner(e.target.value)}
            placeholder="Enter Designer name"
          />
          <Input
            type="email"
            value={designerEmail}
            onChange={(e) => setDesignerEmail(e.target.value)}
            placeholder="Enter Designer email"
            required
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          />
          <Input
            value={projectLink}
            onChange={(e) => setProjectLink(e.target.value)}
            placeholder="Enter Project link"
          />
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {uploadedImage && (
            <div className="mt-4 border rounded-lg overflow-hidden">
              <img src={uploadedImage} alt="Uploaded preview" className="w-full h-auto" />
            </div>
          )}
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
        
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 py-4">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={getProgress()} className="w-full text-gray-900 dark:text-white" />
              <p className="text-right mt-2 text-sm text-gray-600 dark:text-gray-300">
                {Math.round(getProgress())}% Complete
              </p>
            </CardContent>
          </Card>
        </div>

        {categories.map(category => (
          <Card key={category} className="mb-6">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">{category}</CardTitle>
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
      <Footer />
    </div>
  );
};

export default DesignHandoffChecklist;