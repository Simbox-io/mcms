// components/AIButton.tsx
import React from 'react';
import Button from '../Button';
import AIIcon from '../icons/AIIcon';
interface AIButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}
const AIButton: React.FC<AIButtonProps> = ({ onClick, disabled = false, className = '' }) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center ${className}`}
      variant="primary"
    >
      <AIIcon className="w-5 h-5 mr-2" />
      <span>AI Assist</span>
    </Button>
  );
};
export default AIButton;