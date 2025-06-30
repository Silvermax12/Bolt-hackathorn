import React from 'react';
import { ThemeOption } from '../types';
import { ArrowRight, Palette } from 'lucide-react';

interface ThemeStepProps {
  onNext: (theme: ThemeOption) => void;
  onBack: () => void;
}

export const ThemeStep: React.FC<ThemeStepProps> = ({ onNext, onBack }) => {
  const themes: ThemeOption[] = [
    {
      id: 'tech-startup',
      name: 'Tech Startup',
      description: 'Modern, clean design with bold gradients and tech-focused imagery',
      colors: {
        primary: '#3B82F6',
        secondary: '#1E40AF',
        accent: '#F59E0B',
        text: '#1F2937',
        background: '#FFFFFF',
      },
      preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      id: 'portfolio',
      name: 'Portfolio',
      description: 'Elegant and artistic with sophisticated typography and creative layouts',
      colors: {
        primary: '#6366F1',
        secondary: '#4F46E5',
        accent: '#EC4899',
        text: '#374151',
        background: '#F9FAFB',
      },
      preview: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    },
    {
      id: 'event',
      name: 'Event',
      description: 'Vibrant and energetic with dynamic colors and engaging visuals',
      colors: {
        primary: '#EF4444',
        secondary: '#DC2626',
        accent: '#F97316',
        text: '#111827',
        background: '#FFFFFF',
      },
      preview: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose your theme</h2>
        <p className="text-gray-600">Select a design that matches your project's personality</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {themes.map((theme) => (
          <div
            key={theme.id}
            onClick={() => onNext(theme)}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border-2 border-transparent hover:border-blue-200"
          >
            <div
              className="h-32 rounded-t-xl"
              style={{ background: theme.preview }}
            />
            <div className="p-6">
              <div className="flex items-center mb-3">
                <Palette className="w-5 h-5 text-gray-600 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900">{theme.name}</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">{theme.description}</p>
              <div className="flex space-x-2">
                {Object.entries(theme.colors).slice(0, 3).map(([key, color]) => (
                  <div
                    key={key}
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <div className="text-sm text-gray-500 flex items-center">
          Click on a theme to continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </div>
      </div>
    </div>
  );
};