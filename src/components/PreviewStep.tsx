import React from 'react';
import { ProjectInfo, ThemeOption, GeneratedPage } from '../types';
import { ArrowRight, Eye, Code, Globe, Sparkles } from 'lucide-react';

interface PreviewStepProps {
  projectInfo: ProjectInfo;
  selectedTheme: ThemeOption;
  generatedPage: GeneratedPage;
  onNext: () => void;
  onBack: () => void;
}

export const PreviewStep: React.FC<PreviewStepProps> = ({
  projectInfo,
  selectedTheme,
  generatedPage,
  onNext,
  onBack,
}) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your landing page is ready!</h2>
        <p className="text-gray-600">Preview your generated page and deploy when you're satisfied</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Preview Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Globe className="w-4 h-4" />
                <span>{projectInfo.projectName.toLowerCase().replace(/\s+/g, '')}.bolt.new</span>
              </div>
            </div>
            <div className="aspect-video bg-gray-50 overflow-hidden">
              <iframe
                srcDoc={generatedPage.html}
                className="w-full h-full border-0"
                title="Landing Page Preview"
              />
            </div>
          </div>
        </div>

        {/* Details Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Page Details
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700">Project:</span>
                <p className="text-gray-900">{projectInfo.projectName}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Theme:</span>
                <p className="text-gray-900">{selectedTheme.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Description:</span>
                <p className="text-gray-900 text-sm">{projectInfo.projectDescription}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Code className="w-5 h-5 mr-2" />
              SEO Metadata
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700">Title:</span>
                <p className="text-gray-900 text-sm">{generatedPage.metaTags.title}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Description:</span>
                <p className="text-gray-900 text-sm">{generatedPage.metaTags.description}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Keywords:</span>
                <p className="text-gray-900 text-sm">{generatedPage.metaTags.keywords}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              Features Include
            </h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Responsive design</li>
              <li>• SEO optimized</li>
              <li>• Contact form</li>
              <li>• Social links</li>
              <li>• Analytics ready</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back to Themes
        </button>
        <button
          onClick={onNext}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center space-x-2"
        >
          <span>Deploy Landing Page</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};