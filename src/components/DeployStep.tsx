import React, { useState, useEffect } from 'react';
import { CheckCircle, Globe, Copy, ExternalLink, Sparkles, AlertCircle, Clock } from 'lucide-react';
import type { GeneratedPage, ThemeOption } from '../types';
import { deployLandingPage } from '../services/api';
import { useHistory } from '../contexts/HistoryContext';

// Backend API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://bolt-hackathorn.onrender.com';

interface DeployStepProps {
  projectName: string;
  projectDescription: string;
  selectedTheme: ThemeOption;
  generatedPage?: GeneratedPage | null;
  onBack: () => void;
  onRestart: () => void;
  onViewHistory: () => void;
}

export const DeployStep: React.FC<DeployStepProps> = ({ 
  projectName, 
  projectDescription,
  selectedTheme,
  generatedPage, 
  onBack, 
  onRestart,
  onViewHistory
}) => {
  const [deployStatus, setDeployStatus] = useState<'deploying' | 'success' | 'error'>('deploying');
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [deployUrl, setDeployUrl] = useState('');
  const [claimUrl, setClaimUrl] = useState('');
  const [error, setError] = useState('');
  
  const { addDeployment } = useHistory();

  useEffect(() => {
    const deployToNetlify = async () => {
      const steps = [
        'Preparing deployment files...',
        'Creating HTML content...',
        'Applying your theme...',
        'Generating unique site name...',
        'Creating Netlify site...',
        'Uploading to Netlify...',
        'Finalizing deployment...'
      ];

      try {
        let stepIndex = 0;
        const stepInterval = setInterval(() => {
          if (stepIndex < steps.length) {
            setCurrentStep(steps[stepIndex]);
            setProgress(((stepIndex + 1) / steps.length) * 80);
            stepIndex++;
          } else {
            clearInterval(stepInterval);
            performActualDeploy();
          }
        }, 800);

      } catch (err) {
        console.error('Deployment preparation error:', err);
        setError('Failed to prepare deployment. Please try again.');
        setDeployStatus('error');
      }
    };

    const performActualDeploy = async () => {
      try {
        setCurrentStep('Deploying to Netlify...');
        setProgress(90);

        const data = await deployLandingPage(projectName, projectDescription, selectedTheme);

        if (data.success) {
          setProgress(100);
          setCurrentStep('Deployment successful!');
          setDeployUrl(data.url);
          setClaimUrl(data.admin_url || '');
          
          // Add to deployment history
          addDeployment({
            projectName,
            projectDescription,
            themeName: selectedTheme.name,
            url: data.url,
            adminUrl: data.admin_url,
            deployedAt: data.deployed_at,
            siteId: data.site_id,
            deployId: data.deploy_id
          });
          
          setTimeout(() => {
            setDeployStatus('success');
          }, 1000);
        } else {
          throw new Error('Deployment was not successful');
        }

      } catch (err) {
        console.error('Deployment error:', err);
        setError(err instanceof Error ? err.message : 'Failed to deploy to Netlify. Please try again.');
        setDeployStatus('error');
      }
    };

    deployToNetlify();
  }, [projectName, projectDescription, selectedTheme, generatedPage, addDeployment]);

  const copyToClipboard = () => {
    if (deployUrl) {
      navigator.clipboard.writeText(deployUrl);
    }
  };

  if (deployStatus === 'error') {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Deployment Failed</h2>
          <p className="text-gray-600">{error}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onBack}
            className="border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Preview
          </button>
          <button
            onClick={onRestart}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  if (deployStatus === 'deploying') {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-10 h-10 text-blue-600 animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Deploying to Netlify</h2>
          <p className="text-gray-600">Creating your live landing page...</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-blue-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-gray-700 font-medium">{currentStep}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Deployment Complete!</h2>
        <p className="text-gray-600">Your landing page has been successfully deployed to Netlify and added to your history</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        {deployUrl ? (
          <>
            <div className="flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-blue-600 mr-2" />
              <span className="text-lg font-semibold text-gray-900">Your Live URL</span>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-blue-600 font-medium truncate">{deployUrl}</span>
                <button
                  onClick={copyToClipboard}
                  className="ml-2 p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Copy URL"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex gap-3 mb-4">
              <a
                href={deployUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <ExternalLink className="w-5 h-5" />
                <span>Visit Live Site</span>
              </a>
              
              {claimUrl && (
                <a
                  href={claimUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Globe className="w-5 h-5" />
                  <span>Manage</span>
                </a>
              )}
            </div>
          </>
        ) : (
          <p className="text-gray-600">Deployment completed successfully!</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onViewHistory}
          className="border border-blue-300 text-blue-700 font-semibold py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
        >
          <Clock className="w-5 h-5" />
          <span>View History</span>
        </button>
        <button
          onClick={onRestart}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Create Another
        </button>
      </div>
    </div>
  );
};