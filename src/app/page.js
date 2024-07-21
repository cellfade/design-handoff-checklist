"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Check, X, Calendar, MessageSquare, Trash2, Sun, Moon, ClipboardCopy, ChevronDown } from 'lucide-react';
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
import { jsPDF } from 'jspdf';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  <footer className="mt-12 py-6 bg-white/30 dark:bg-gray-800/30 backdrop-blur-md rounded-lg shadow-custom relative z-10">
    <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center px-6 space-y-4 sm:space-y-0">
      <div className="flex space-x-4">
        <a 
          href="https://github.com/cellfade" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
          onClick={(e) => {
            e.preventDefault();
            window.open('https://github.com/cellfade', '_blank', 'noopener,noreferrer');
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-github"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
        </a>
        <a 
          href="https://x.com/cellfade" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
          onClick={(e) => {
            e.preventDefault();
            window.open('https://x.com/cellfade', '_blank', 'noopener,noreferrer');
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-twitter"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
        </a>
      </div>
      <a 
        href="https://bento.me/cellfade" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-sm underline text-white hover:text-blue-800 dark:text-white dark:hover:text-blue-300 transition-colors duration-200 cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          window.open('https://bento.me/cellfade', '_blank', 'noopener,noreferrer');
        }}
      >
        Created by Andrew Miller
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
  const [shareableUrl, setShareableUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

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
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result);
    };
    reader.readAsDataURL(file);
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
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(generateMarkdown(), 10, 10);
    doc.save("design_handoff_checklist.pdf");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const progress = getProgress();

  return (
    <div 
      className="min-h-screen bg-cover bg-center py-8 px-8 relative"
      style={{ backgroundImage: `url('https://iili.io/dntJSbp.png')` }}
    >
      <div className="absolute inset-0 bg-black transition-opacity duration-300 ease-in-out" 
           style={{ opacity: theme === 'dark' ? 0.5 : 0 }}
      ></div>
      
      <div className="container mx-auto max-w-4xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-6 rounded-lg shadow-custom relative z-10">
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
            <div className="mt-4 border rounded-lg overflow-hidden relative">
              <Image src={uploadedImage} alt="Uploaded preview" width={500} height={300} layout="responsive" />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => setUploadedImage(null)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Button onClick={handleSaveAndShare}>
              Save & Share
            </Button>
            {shareableUrl && (
              <>
                <Input value={shareableUrl} readOnly className="flex-grow" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(shareableUrl);
                    alert('URL copied to clipboard!');
                  }}
                >
                  <ClipboardCopy className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
          <Textarea
            value={projectNotes}
            onChange={(e) => setProjectNotes(e.target.value)}
            placeholder="Enter any additional notes for the project..."
            rows={4}
          />
        </div>

        {/* Progress bar card moved here, with sticky behavior and correct background styling */}
        <div className="sticky top-0 z-10 py-4">
  <Card className="mb-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md">
    <CardHeader>
      <CardTitle className="text-gray-900 dark:text-white">Overall Progress</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-2.5">
        <div 
          className="bg-blue-600/70 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
          style={{width: `${progress}%`}}
        ></div>
      </div>
      <p className="text-right mt-2 text-sm text-gray-600 dark:text-gray-300">
        {Math.round(progress)}% Complete
      </p>
      
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
          <Button
            onClick={() => setIsApproveModalOpen(true)}
            disabled={progress !== 100}
            className={`${progress === 100 ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400'} text-white font-bold py-2 px-4 rounded flex items-center justify-center w-full sm:w-auto`}
          >
            <Check className="mr-2" size={16} />
            Approve Design
          </Button>
          <Button
            onClick={() => setIsRequestChangesModalOpen(true)}
            variant="destructive"
            className="flex items-center justify-center w-full sm:w-auto"
          >
            <X className="mr-2" size={16} />
            Request Changes
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Export <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={exportToPDF}>Export as PDF</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </CardContent>
  </Card>
</div>

        {categories.map(category => (
          <Card key={category} className="mb-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
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
      </div>
      <div className="container mx-auto max-w-4xl">
        <Footer />
      </div>
    </div>
  );
};

export default DesignHandoffChecklist;