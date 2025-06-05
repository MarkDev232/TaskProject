import React from 'react';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`border rounded p-2 focus:outline-none focus:ring focus:border-blue-300 ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
