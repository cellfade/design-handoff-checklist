"use client";

import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';

const checklist = [
  { id: 1, category: 'Visual Design', item: 'Color palette defined' },
  { id: 2, category: 'Visual Design', item: 'Typography styles specified' },
  { id: 3, category: 'Visual Design', item: 'Iconography provided' },
  { id: 4, category: 'Layout', item: 'Responsive breakpoints defined' },
  { id: 5, category: 'Layout', item: 'Grid system specified' },
  { id: 6, category: 'Components', item: 'Button states designed' },
  { id: 7, category: 'Components', item: 'Form elements styled' },
  { id: 8, category: 'Components', item: 'Navigation components detailed' },
  { id: 9, category: 'Interaction', item: 'Hover states defined' },
  { id: 10, category: 'Interaction', item: 'Animations specified' },
  { id: 11, category: 'Assets', item: 'Image assets exported' },
  { id: 12, category: 'Assets', item: 'Icon set provided' },
  { id: 13, category: 'Documentation', item: 'Design system documentation' },
  { id: 14, category: 'Documentation', item: 'Interaction specifications' },
  { id: 15, category: 'Handoff', item: 'Zeplin/Figma links shared' },
];

const ChecklistItem = ({ item, checked, onToggle }) => (
  <div className="flex items-center space-x-2 mb-2">
    <Checkbox
      id={`checkbox-${item.id}`}
      checked={checked}
      onCheckedChange={() => onToggle(item.id)}
    />
    <label
      htmlFor={`checkbox-${item.id}`}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {item.item}
    </label>
  </div>
);

const DesignHandoffChecklist = () => {
  const [checkedItems, setCheckedItems] = useState({});

  const handleToggle = (id) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
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
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
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