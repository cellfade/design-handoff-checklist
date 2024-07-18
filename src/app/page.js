"use client";

import React, { useState, useEffect } from 'react';
import { Check, X, Calendar, MessageSquare, Trash2, Mail, Image as ImageIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { nanoid } from 'nanoid';
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
      <div 
        className={`w-5 h-5 border border-gray-300 rounded flex items-center justify-center cursor-pointer ${checked ? 'bg-blue-500' : 'bg-white'}`}
        onClick={() => onToggle(item.id)}
      >
        {checked && <Check size={14} color="white" />}
      </div>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-grow cursor-pointer" onClick={() => onToggle(item.id)}>
        {item.item}
      </label>
      <input
        type="date"
        value={item.deadline}
        onChange={(e) => onDeadlineChange(item.id, e.target.value)}
        className="border rounded px-2 py-1 text-sm text-gray-800"
      />
      <button onClick={() => {
        const comment = prompt('Enter a comment:');
        if (comment) onCommentAdd(item.id, comment);
      }} className="text-blue-600 hover:text-blue-800">
        <MessageSquare size={16} />
      </button>
      {item.deadline && <Calendar size={16} className="text-gray-600" />}
      {item.comments.length > 0 && <span className="text-sm text-gray-600">({item.comments.length})</span>}
    </div>
    {item.comments.length > 0 && (
      <div className="ml-6 mt-2">
        <h4 className="text-sm font-semibold text-gray-800">Comments:</h4>
        <ul className="list-none">
          {item.comments.map((comment, index) => (
            <li key={index} className="text-sm text-gray-700 flex items-center justify-between mb-1">
              <span>{comment}</span>
              <button 
                onClick={() => onCommentDelete(item.id, index)} 
                className="text-red-500 hover:text-red-700 ml-2"
              >
                <Trash2 size={14} />
              </button>
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

const DesignHandoffChecklist = () => {
  const [checklist, setChecklist] = useState(initialChecklist);
  const [checkedItems, setCheckedItems] = useState({});
  const [figmaLink, setFigmaLink] = useState('');
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRequestChangesModalOpen, setIsRequestChangesModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
      loadState(id);
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
      figmaLink
    };
    const stateString = encode(JSON.stringify(state));
    const id = nanoid(10); // Generate a 10-character ID
    localStorage.setItem(id, stateString);
    return id;
  };

  const loadState = (id) => {
    const stateString = localStorage.getItem(id);
    if (stateString) {
      const state = JSON.parse(decode(stateString));
      setChecklist(state.checklist);
      setCheckedItems(state.checkedItems);
      setFigmaLink(state.figmaLink);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Design Handoff Checklist
        </h1>
        
        <div className="mb-8">
          <input
            type="text"
            value={figmaLink}
            onChange={(e) => setFigmaLink(e.target.value)}
            placeholder="Enter Figma link"
            className="w-full p-2 border rounded text-gray-800"
          />
          <Button onClick={() => {
            const id = saveState();
            const url = `${window.location.origin}?id=${id}`;
            alert(`Shareable URL: ${url}`);
          }} className="mt-2">
            Save & Share
          </Button>
          {figmaLink && (
            <div className="mt-2 p-2 bg-white border rounded">
              <a href={figmaLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {figmaLink}
              </a>
              <SocialImagePreview url={figmaLink} />
            </div>
          )}
        </div>
          
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-gray-900">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{width: `${getProgress()}%`}}
              ></div>
            </div>
            <p className="text-right mt-2 text-sm text-gray-600">
              {Math.round(getProgress())}% Complete
            </p>
          </CardContent>
        </Card>

        {categories.map(category => (
          <Card key={category} className="mb-6">
            <CardHeader>
              <CardTitle className="text-gray-900">{category}</CardTitle>
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
            className={`flex items-center ${getProgress() === 100 ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400'} text-white font-bold py-2 px-4 rounded`}
          >
            <Check className="mr-2" size={16} />
            Approve Design
          </Button>
          <Button
            onClick={() => setIsRequestChangesModalOpen(true)}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <X className="mr-2" size={16} />
            Request Changes
          </Button>
        </div>
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
    </div>
  );
};

export default DesignHandoffChecklist;