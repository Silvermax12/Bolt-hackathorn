import React, { useState, useEffect } from 'react';
import { CheckCircle, Globe, Copy, ExternalLink, Sparkles, AlertCircle } from 'lucide-react';
import type { GeneratedPage } from '../types';

// Backend API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface DeployStepProps {
  projectName: string;
  generatedPage?: GeneratedPage | null;
  onBack: () => void;
  onRestart: () => void;
}

export const DeployStep: React.FC<DeployStepProps> = ({ 
  projectName, 
  generatedPage, 
  onBack, 
  onRestart 
}) => {
  const [deployStatus, setDeployStatus] = useState<'deploying' | 'success' | 'error'>('deploying');
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [deployUrl, setDeployUrl] = useState('');
  const [claimUrl, setClaimUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const deployToNetlify = async () => {
      const steps = [
        'Preparing deployment files...',
        'Creating HTML content...',
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

        // Extract title and description from project name
        // In a real implementation, you'd pass these from the form
        const title = projectName;
        const description = `Landing page for ${projectName} - created with AI Landing Page Generator`;

        const response = await fetch(`${API_BASE_URL}/api/deploy`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: title,
            description: description
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Deployment failed');
        }

        if (data.success) {
          setProgress(100);
          setCurrentStep('Deployment successful!');
          setDeployUrl(data.url);
          setClaimUrl(data.admin_url);
          
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
  }, [projectName, generatedPage]);

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
        <p className="text-gray-600">Your landing page has been successfully deployed to Netlify</p>
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

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.open(deployUrl, '_blank')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>View Live Site</span>
                <ExternalLink className="w-5 h-5" />
              </button>
              
              {claimUrl && (
                <button
                  onClick={() => window.open(claimUrl, '_blank')}
                  className="border border-blue-600 text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Manage on Netlify
                </button>
              )}
            </div>

            {claimUrl && (
              <div className="bg-blue-50 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-800">
                  <strong>Transfer Ownership:</strong> Use the "Manage on Netlify" button to claim this site and transfer it to your Netlify account.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-4">Waiting for deployment URL...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        )}
      </div>

      <button
        onClick={onRestart}
        className="border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Create Another Page
      </button>

      <div className="bg-blue-50 rounded-lg p-4 mt-6">
        <h3 className="font-semibold text-blue-900 mb-2">What's included:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Fully responsive design</li>
          <li>• SEO optimized meta tags</li>
          <li>• Contact form integration</li>
          <li>• Social media links</li>
          <li>• Analytics tracking ready</li>
          <li>• Deployed on Netlify CDN</li>
        </ul>
      </div>
    </div>
  );
};