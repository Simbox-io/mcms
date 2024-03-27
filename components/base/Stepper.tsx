import React from 'react';

interface Step {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  status?: 'complete' | 'current' | 'upcoming';
}

interface StepperProps {
  steps: Step[];
  currentStep?: string;
  onStepClick?: (stepId: string) => void;
  className?: string;
  style?: React.CSSProperties;
  stepClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  iconClassName?: string;
  connectorColor?: string;
  connectorWidth?: number;
  alternateConnector?: boolean;
}

const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  className = '',
  style,
  stepClassName = '',
  titleClassName = '',
  descriptionClassName = '',
  iconClassName = '',
  connectorColor = 'gray-300',
  connectorWidth = 2,
  alternateConnector = false,
}) => {
  const getStepStatus = (stepId: string) => {
    if (stepId === currentStep) {
      return 'current';
    } else if (steps.findIndex((step) => step.id === stepId) < steps.findIndex((step) => step.id === currentStep)) {
      return 'complete';
    } else {
      return 'upcoming';
    }
  };

  return (
    <div className={`stepper ${className}`} style={style}>
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={`stepper-step ${stepClassName} ${
            getStepStatus(step.id) === 'complete' ? 'stepper-step-complete' : ''
          } ${getStepStatus(step.id) === 'current' ? 'stepper-step-current' : ''}`}
          onClick={() => onStepClick && onStepClick(step.id)}
        >
          <div className="stepper-step-icon">
            {step.icon ? (
              <div className={`stepper-step-custom-icon ${iconClassName}`}>{step.icon}</div>
            ) : (
              <div className="stepper-step-number">{index + 1}</div>
            )}
          </div>
          <div className="stepper-step-content">
            <h3 className={`stepper-step-title ${titleClassName}`}>{step.title}</h3>
            {step.description && (
              <p className={`stepper-step-description ${descriptionClassName}`}>{step.description}</p>
            )}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`stepper-step-connector ${
                alternateConnector && index % 2 !== 0 ? 'stepper-step-connector-alternate' : ''
              }`}
              style={{ backgroundColor: connectorColor, height: `${connectorWidth}px` }}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;