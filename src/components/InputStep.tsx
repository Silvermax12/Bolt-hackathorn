import React, { useState } from 'react';
import { ProjectInfo } from '../types';
import { ArrowRight, Lightbulb } from 'lucide-react';

interface InputStepProps {
  onNext: (projectInfo: ProjectInfo) => void;
}

export const InputStep: React.FC<InputStepProps> = ({ onNext }) => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateInput = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    }
    
    if (!projectDescription.trim()) {
      newErrors.projectDescription = 'Project description is required';
    } else if (projectDescription.trim().split('.').length < 2) {
      newErrors.projectDescription = 'Please provide at least two sentences';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateInput()) {
      onNext({ projectName: projectName.trim(), projectDescription: projectDescription.trim() });
    }
  };

  const suggestions = [
    'TechFlow - A revolutionary project management platform that streamlines team collaboration. Built for modern teams who need efficiency and clarity.',
    'ArtSpace - A creative portfolio platform for artists and designers. Showcase your work and connect with potential clients effortlessly.',
    'EventHub - The ultimate event planning and management solution. Create memorable experiences with our comprehensive planning tools.'
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Tell us about your project</h2>
        <p className="text-gray-600">We'll use this information to create your perfect landing page</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
            Project Name
          </label>
          <input
            type="text"
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              errors.projectName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., TechFlow, ArtSpace, EventHub"
          />
          {errors.projectName && (
            <p className="mt-1 text-sm text-red-600">{errors.projectName}</p>
          )}
        </div>

        <div>
          <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Project Description
          </label>
          <textarea
            id="projectDescription"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
              errors.projectDescription ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Describe your project in 2-3 sentences. What does it do? Who is it for?"
          />
          {errors.projectDescription && (
            <p className="mt-1 text-sm text-red-600">{errors.projectDescription}</p>
          )}
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Lightbulb className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-900">Need inspiration?</span>
          </div>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  const [name, ...descParts] = suggestion.split(' - ');
                  setProjectName(name);
                  setProjectDescription(descParts.join(' - '));
                }}
                className="text-left w-full p-2 text-sm text-blue-700 hover:bg-blue-100 rounded transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <span>Continue to Theme Selection</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};