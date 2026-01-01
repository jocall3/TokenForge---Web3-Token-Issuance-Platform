
import React from 'react';

interface CardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, icon, children, className = "" }) => {
  return (
    <div className={`bg-slate-800/40 border border-slate-700 rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-slate-600 ${className}`}>
      <div className="px-6 py-4 border-b border-slate-700 flex items-center space-x-3 bg-slate-800/60">
        {icon && <span className="text-cyan-500 text-xl">{icon}</span>}
        <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
