import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepLabels,
}) => {
  return (
    <div className="flex items-center justify-center mb-8">
      {stepLabels.map((label, index) => (
        <div key={index} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                index < currentStep
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : index === currentStep
                  ? 'bg-blue-100 border-blue-600 text-blue-600'
                  : 'bg-gray-100 border-gray-300 text-gray-400'
              }`}
            >
              {index < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="font-semibold">{index + 1}</span>
              )}
            </div>
            <span
              className={`text-xs mt-2 font-medium ${
                index <= currentStep ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              {label}
            </span>
          </div>
          {index < totalSteps - 1 && (
            <div
              className={`w-12 h-0.5 mx-4 transition-all duration-300 ${
                index < currentStep ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};