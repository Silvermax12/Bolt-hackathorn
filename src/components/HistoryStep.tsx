import React, { useState } from 'react';
import { useHistory } from '../contexts/HistoryContext';
import { 
  Clock, 
  ExternalLink, 
  Copy, 
  Trash2, 
  Globe, 
  Palette,
  Plus,
  AlertCircle,
  Check
} from 'lucide-react';

interface HistoryStepProps {
  onCreateNew: () => void;
  onBack: () => void;
}

export const HistoryStep: React.FC<HistoryStepProps> = ({ onCreateNew, onBack }) => {
  const { deployments, removeDeployment, clearHistory } = useHistory();
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return 'Unknown date';
    }
  };

  const handleClearHistory = () => {
    clearHistory();
    setShowClearConfirm(false);
  };

  if (deployments.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">No Deployment History</h2>
          <p className="text-gray-600 mb-8">
            You haven't created any landing pages yet. Start by creating your first one!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={onCreateNew}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create Landing Page</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Deployment History</h2>
        <p className="text-gray-600">
          View and manage your previously created landing pages ({deployments.length} total)
        </p>
      </div>

      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onCreateNew}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New</span>
        </button>
        
        {deployments.length > 0 && (
          <div className="flex space-x-2">
            {!showClearConfirm ? (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
              >
                Clear All History
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Are you sure?</span>
                <button
                  onClick={handleClearHistory}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded transition-colors"
                >
                  Yes, Clear All
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 text-xs px-3 py-1 rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Deployment Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {deployments.map((deployment) => (
          <div
            key={deployment.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
              <h3 className="text-lg font-semibold text-white truncate">
                {deployment.projectName}
              </h3>
              <div className="flex items-center text-blue-100 text-sm mt-1">
                <Clock className="w-4 h-4 mr-1" />
                {formatDate(deployment.deployedAt)}
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
              <div className="space-y-3 mb-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">Description:</span>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {deployment.projectDescription}
                  </p>
                </div>
                
                <div className="flex items-center">
                  <Palette className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">{deployment.themeName}</span>
                </div>

                <div className="flex items-center">
                  <Globe className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600 truncate">
                    {deployment.url.replace('https://', '')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <a
                  href={deployment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Visit</span>
                </a>
                
                <button
                  onClick={() => handleCopyUrl(deployment.url)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1"
                >
                  {copiedUrl === deployment.url ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => removeDeployment(deployment.id)}
                  className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition-colors"
                  title="Remove from history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Admin URL if available */}
              {deployment.adminUrl && (
                <a
                  href={deployment.adminUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-2 text-xs text-blue-600 hover:text-blue-700 transition-colors"
                >
                  View in Netlify Admin →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="flex justify-center">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back to Deploy
        </button>
      </div>
    </div>
  );
}; 