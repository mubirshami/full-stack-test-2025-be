import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  error?: string;
}

export default function Checkbox({ label, error, className = '', ...props }: CheckboxProps) {
  return (
    <div className="w-full">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          className={`mt-1 w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${className}`}
          {...props}
        />
        <span className="text-sm text-gray-300">{label}</span>
      </label>
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
}
