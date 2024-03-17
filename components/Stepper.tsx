// components/Stepper.tsx
import React from 'react';

interface Step {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
}

interface StepperProps {
  steps: Step[];
  currentStep: string;
  onStepClick?: (stepId: string) => void;
  className?: string;
  stepClassName?: string;
  activeStepClassName?: string;
  completedStepClassName?: string;
  stepTitleClassName?: string;
  stepDescriptionClassName?: string;
}

const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  className = '',
  stepClassName = '',
  activeStepClassName = '',
  completedStepClassName = '',
  stepTitleClassName = '',
  stepDescriptionClassName = '',
}) => {
  const getStepClass = (step: Step) => {
    if (step.id === currentStep) {
      return activeStepClassName;
    } else if (step.completed) {
      return completedStepClassName;
    }
    return stepClassName;
  };

  const handleStepClick = (stepId: string) => {
    if (onStepClick) {
      onStepClick(stepId);
    }
  };

  return (
    <div className={`stepper ${className}`}>
      <div className="stepper-header">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`stepper-step ${getStepClass(step)}`}
            onClick={() => handleStepClick(step.id)}
          >
            <div className="stepper-icon">
              {step.completed ? (
                <CheckIcon className="text-green-500" />
              ) : (
                <span className="stepper-number">{index + 1}</span>
              )}
            </div>
            <div className="stepper-content">
              <h3 className={`stepper-title ${stepTitleClassName}`}>{step.title}</h3>
              {step.description && (
                <p className={`stepper-description ${stepDescriptionClassName}`}>
                  {step.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-6 w-6 ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

export default Stepper;