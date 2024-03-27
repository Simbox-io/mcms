import React from 'react';

interface FormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

const Form: React.FC<FormProps> = ({ onSubmit, children, className = '', style, id }) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(event);
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`} style={style} id={id}>
      {children}
    </form>
  );
};

export default Form;