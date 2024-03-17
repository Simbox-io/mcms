// components/Feature.tsx
import React from 'react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

const Feature: React.FC<FeatureProps> = ({
  icon,
  title,
  description,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default Feature;