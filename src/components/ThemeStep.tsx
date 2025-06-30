import React, { useState } from 'react';
import { ThemeOption, CustomTheme } from '../types';
import { ArrowRight, Palette, Plus, Check } from 'lucide-react';

interface ThemeStepProps {
  onNext: (theme: ThemeOption) => void;
  onBack: () => void;
}

export const ThemeStep: React.FC<ThemeStepProps> = ({ onNext, onBack }) => {
  const [showCustomTheme, setShowCustomTheme] = useState(false);
  const [customTheme, setCustomTheme] = useState<CustomTheme>({
    name: 'My Custom Theme',
    colors: {
      primary: '#3B82F6',
      secondary: '#1E40AF',
      accent: '#F59E0B',
      text: '#1F2937',
      background: '#FFFFFF',
    }
  });

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

  const handleCustomThemeSubmit = () => {
    const theme: ThemeOption = {
      id: 'custom',
      name: customTheme.name,
      description: 'Your custom theme with personalized colors',
      colors: customTheme.colors,
      preview: `linear-gradient(135deg, ${customTheme.colors.primary} 0%, ${customTheme.colors.secondary} 100%)`,
      isCustom: true,
    };
    onNext(theme);
  };

  const updateCustomColor = (colorKey: keyof CustomTheme['colors'], value: string) => {
    setCustomTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: value
      }
    }));
  };

  if (showCustomTheme) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Create Custom Theme</h2>
          <p className="text-gray-600">Design your own unique color scheme</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Color Picker Section */}
            <div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme Name
                </label>
                <input
                  type="text"
                  value={customTheme.name}
                  onChange={(e) => setCustomTheme(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter theme name"
                />
              </div>

              <div className="space-y-4">
                {Object.entries(customTheme.colors).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-4">
                    <label className="w-24 text-sm font-medium text-gray-700 capitalize">
                      {key}:
                    </label>
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => updateCustomColor(key as keyof CustomTheme['colors'], e.target.value)}
                      className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => updateCustomColor(key as keyof CustomTheme['colors'], e.target.value)}
                      className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Preview Section */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Preview</h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div
                  className="h-32"
                  style={{ 
                    background: `linear-gradient(135deg, ${customTheme.colors.primary} 0%, ${customTheme.colors.secondary} 100%)` 
                  }}
                />
                <div 
                  className="p-6"
                  style={{ backgroundColor: customTheme.colors.background }}
                >
                  <h3 
                    className="text-xl font-semibold mb-2"
                    style={{ color: customTheme.colors.text }}
                  >
                    {customTheme.name}
                  </h3>
                  <p 
                    className="text-sm mb-4"
                    style={{ color: customTheme.colors.text, opacity: 0.8 }}
                  >
                    This is how your custom theme will look with your selected colors.
                  </p>
                  <button 
                    className="px-4 py-2 rounded text-white text-sm font-medium"
                    style={{ backgroundColor: customTheme.colors.accent }}
                  >
                    Sample Button
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setShowCustomTheme(false)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Themes
          </button>
          <button
            onClick={handleCustomThemeSubmit}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Check className="w-4 h-4 mr-2" />
            Use This Theme
          </button>
        </div>
      </div>
    );
  }

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

        {/* Custom Theme Option */}
        <div
          onClick={() => setShowCustomTheme(true)}
          className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border-2 border-dashed border-gray-300 hover:border-blue-400 flex items-center justify-center"
        >
          <div className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Custom</h3>
            <p className="text-gray-600 text-sm">Design your own unique theme with custom colors</p>
          </div>
        </div>
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