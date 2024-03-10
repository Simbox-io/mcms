// components/Stepper.tsx

import React from 'react';

interface Step {
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep, className = '' }) => {
  const renderSteps = () => {
    return steps.map((step, index) => {
      const isActive = index === currentStep;
      const isPast = index < currentStep;

      return (
        <li
          key={index}
          className={`stepper-item ${isActive ? 'active' : ''} ${isPast ? 'complete' : ''}`}
        >
          <div className="stepper-icon">
            {isPast ? (
              <svg
                className="w-6 h-6 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <span className="stepper-number">{index + 1}</span>
            )}
          </div>
          <div className="stepper-content">
            <h3 className="stepper-title">{step.label}</h3>
            {step.description && <p className="stepper-description">{step.description}</p>}
          </div>
        </li>
      );
    });
  };

  return (
    <div className={`stepper ${className}`}>
      <ul className="stepper-list">{renderSteps()}</ul>
    </div>
  );
};

export default Stepper;