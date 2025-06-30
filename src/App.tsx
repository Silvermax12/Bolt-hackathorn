import React, { useState } from 'react';
import { StepIndicator } from './components/StepIndicator';
import { InputStep } from './components/InputStep';
import { ThemeStep } from './components/ThemeStep';
import { PreviewStep } from './components/PreviewStep';
import { DeployStep } from './components/DeployStep';
import { HistoryStep } from './components/HistoryStep';
import { HistoryProvider } from './contexts/HistoryContext';
import { ProjectInfo, ThemeOption, GeneratedPage, Step } from './types';
import { buildLandingPage } from './utils/pageGenerator';
import { Sparkles, Clock } from 'lucide-react';

function AppContent() {
  const [currentStep, setCurrentStep] = useState<Step>('input');
  const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption | null>(null);
  const [generatedPage, setGeneratedPage] = useState<GeneratedPage | null>(null);

  const steps = ['Project Info', 'Choose Theme', 'Preview', 'Deploy'];
  const stepIndex = steps.findIndex(s => 
    s.toLowerCase().replace(' ', '') === currentStep.replace('input', 'projectinfo')
  );

  const handleProjectInfoSubmit = (info: ProjectInfo) => {
    setProjectInfo(info);
    setCurrentStep('theme');
  };

  const handleThemeSelect = async (theme: ThemeOption) => {
    setSelectedTheme(theme);
    if (projectInfo) {
      try {
        const page = await buildLandingPage({
          ...projectInfo,
          themeChoice: theme
        });
        setGeneratedPage(page);
        setCurrentStep('preview');
      } catch (error) {
        console.error('Error generating page:', error);
        // Still proceed to preview with null page - the PreviewStep should handle this
        setCurrentStep('preview');
      }
    }
  };

  const handleDeploy = () => {
    setCurrentStep('deploy');
  };

  const handleRestart = () => {
    setCurrentStep('input');
    setProjectInfo(null);
    setSelectedTheme(null);
    setGeneratedPage(null);
  };

  const handleViewHistory = () => {
    setCurrentStep('history');
  };

  const handleCreateNew = () => {
    setCurrentStep('input');
    setProjectInfo(null);
    setSelectedTheme(null);
    setGeneratedPage(null);
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'theme':
        setCurrentStep('input');
        break;
      case 'preview':
        setCurrentStep('theme');
        break;
      case 'deploy':
        setCurrentStep('preview');
        break;
      case 'history':
        setCurrentStep('input');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-blue-600 mr-2" />
            <h1 className="text-4xl font-bold text-gray-900">AI Landing Page Generator</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create professional landing pages in minutes with AI-powered design and content generation
          </p>
          
          {/* History Button */}
          {currentStep !== 'history' && (
            <div className="mt-6">
              <button
                onClick={handleViewHistory}
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <Clock className="w-4 h-4" />
                <span>View Deployment History</span>
              </button>
            </div>
          )}
        </div>

        {/* Step Indicator */}
        {currentStep !== 'deploy' && currentStep !== 'history' && (
          <StepIndicator
            currentStep={stepIndex}
            totalSteps={steps.length}
            stepLabels={steps}
          />
        )}

        {/* Step Content */}
        <div className="max-w-7xl mx-auto">
          {currentStep === 'input' && (
            <InputStep onNext={handleProjectInfoSubmit} />
          )}
          
          {currentStep === 'theme' && (
            <ThemeStep 
              onNext={handleThemeSelect}
              onBack={handleBack}
            />
          )}
          
          {currentStep === 'preview' && projectInfo && selectedTheme && (
            <PreviewStep
              projectInfo={projectInfo}
              selectedTheme={selectedTheme}
              generatedPage={generatedPage}
              onNext={handleDeploy}
              onBack={handleBack}
            />
          )}
          
          {currentStep === 'deploy' && projectInfo && selectedTheme && (
            <DeployStep
              projectName={projectInfo.projectName}
              projectDescription={projectInfo.projectDescription}
              selectedTheme={selectedTheme}
              generatedPage={generatedPage}
              onBack={handleBack}
              onRestart={handleRestart}
              onViewHistory={handleViewHistory}
            />
          )}

          {currentStep === 'history' && (
            <HistoryStep
              onCreateNew={handleCreateNew}
              onBack={handleBack}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <HistoryProvider>
      <AppContent />
    </HistoryProvider>
  );
}

export default App;