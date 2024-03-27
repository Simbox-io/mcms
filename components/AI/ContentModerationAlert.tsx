// components/ContentModerationAlert.tsx
'use client'
import React, { useState, useEffect } from 'react';
import Alert from '../Alert';
import WarningIcon from '../icons/WarningIcon';
interface ContentModerationAlertProps {
  content: string;
}
const ContentModerationAlert: React.FC<ContentModerationAlertProps> = ({ content }) => {
  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => {
    const checkContentModeration = async () => {
      // Make API call to check content moderation
      const response = await fetch('/api/checkContentModeration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      const data = await response.json();
      setShowAlert(data.flagged);
    };
    checkContentModeration();
  }, [content]);
  if (!showAlert) {
    return null;
  }
  return (
    <Alert
      variant="warning"
      onClose={() => setShowAlert(false)}
      className="bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-lg p-4 mb-4"
    >
      <div className="flex items-center">
        <WarningIcon className="w-6 h-6 mr-2" />
        <p>
          The content you entered may contain inappropriate or offensive language. Please
          review and modify it before proceeding.
        </p>
      </div>
    </Alert>
  );
};
export default ContentModerationAlert;