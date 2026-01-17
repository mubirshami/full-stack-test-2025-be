import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'social';
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'w-full px-6 py-3 rounded-lg font-semibold cursor-pointer';
  
  const variants = {
    primary: 'bg-white text-gray-900',
    secondary: 'bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-500',
    social: 'text-white border border-[#525252] bg-[#171717]',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
