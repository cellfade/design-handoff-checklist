"use client";

import React, { useState } from 'react';
import { Check, X, Calendar, MessageSquare } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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

const ChecklistItem = ({ item, checked, onToggle, onDeadlineChange, onCommentAdd }) => (
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
        <ul className="list-disc list-inside">
          {item.comments.map((comment, index) => (
            <li key={index} className="text-sm text-gray-700">{comment}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

const DesignHandoffChecklist = () => {
  const [checklist, setChecklist] = useState(initialChecklist);
  const [checkedItems, setCheckedItems] = useState({});
  const [figmaLink, setFigmaLink] = useState('');

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

  const categories = [...new Set(checklist.map(item => item.category))];

  const getProgress = () => {
    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    return (checkedCount / checklist.length) * 100;
  };

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
          {figmaLink && (
            <div className="mt-2 p-2 bg-white border rounded">
              <a href={figmaLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {figmaLink}
              </a>
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
                  />
                ))
              }
            </CardContent>
          </Card>
        ))}

        <div className="mt-8 flex justify-between">
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center">
            <Check className="mr-2" size={16} />
            Approve Design
          </button>
          <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center">
            <X className="mr-2" size={16} />
            Request Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default DesignHandoffChecklist;