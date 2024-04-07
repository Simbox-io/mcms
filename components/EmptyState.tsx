// components/EmptyState.tsx
'use client'
import { useRouter } from 'next/navigation';
import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  buttonHref?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className = '',
  buttonHref,
}) => {
  const router = useRouter();
  const redirect = () => {
    if (buttonHref) {
      router.push(buttonHref);
    }
  }
  return (
    <div
    className="flex flex-1 w-full items-center justify-center rounded-lg border border-dashed shadow-sm p-16"
  >
    <div className={`flex flex-col items-center gap-1 text-center ${className}`}>
    {icon && <div className="text-4xl mb-4">{icon}</div>}
      <h3 className="text-2xl font-bold tracking-tight">
      {title}
      </h3>
      <p className="text-sm text-muted-foreground">
      {description}
      </p>
      {action && <div onClick={redirect}>{action}</div>}
    </div>
  </div>
  );
};

export default EmptyState;