
import React from 'react';
import { FaSpinner, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaBell, FaInfoCircle } from 'react-icons/fa';

export const ExportedProgressBar: React.FC<{ steps: string[]; currentStep: number }> = ({ steps, currentStep }) => {
    return (
        <div className="flex justify-between items-center w-full py-8 relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -translate-y-1/2 -z-10 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-cyan-500 transition-all duration-500" 
                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                />
            </div>
            {steps.map((step, index) => (
                <div key={step} className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 shadow-lg
                        ${index <= currentStep ? 'bg-cyan-600 border-cyan-400 text-white' : 'bg-slate-900 border-slate-700 text-slate-500'}
                    `}>
                        {index < currentStep ? <FaCheckCircle /> : index + 1}
                    </div>
                    <span className={`mt-3 text-xs font-medium text-center hidden md:block ${index <= currentStep ? 'text-cyan-400' : 'text-slate-500'}`}>
                        {step}
                    </span>
                </div>
            ))}
        </div>
    );
};

export const ExportedTooltip: React.FC<{ content: string; children: React.ReactNode }> = ({ content, children }) => {
    return (
        <div className="relative flex items-center group">
            {children}
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-3 w-max max-w-xs p-2 bg-slate-900 border border-slate-700 text-slate-100 text-[10px] md:text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[100] shadow-2xl">
                {content}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
            </div>
        </div>
    );
};

export const ExportedInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; icon?: React.ReactNode; }> = ({ label, error, icon, ...props }) => (
    <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-400 flex items-center space-x-2">
            {icon && <span className="text-cyan-500/80">{icon}</span>}
            <span>{label}</span>
        </label>
        <div className="relative">
            <input
                {...props}
                className={`w-full px-4 py-2.5 bg-slate-900/50 rounded-lg text-slate-100 border transition-all duration-200 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 outline-none placeholder:text-slate-600 ${error ? 'border-red-500/50' : 'border-slate-700'} ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            {error && <p className="mt-1 text-xs text-red-400 flex items-center gap-1"><FaExclamationTriangle size={10} /> {error}</p>}
        </div>
    </div>
);

export const ExportedTextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string; }> = ({ label, error, ...props }) => (
    <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-400">{label}</label>
        <textarea
            {...props}
            className={`w-full px-4 py-2.5 bg-slate-900/50 rounded-lg text-slate-100 border transition-all duration-200 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 outline-none resize-y placeholder:text-slate-600 ${error ? 'border-red-500/50' : 'border-slate-700'} ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        {error && <p className="mt-1 text-xs text-red-400 flex items-center gap-1"><FaExclamationTriangle size={10} /> {error}</p>}
    </div>
);

export const ExportedSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; options: { value: string; label: string; }[]; error?: string; icon?: React.ReactNode; }> = ({ label, options, error, icon, ...props }) => (
    <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-400 flex items-center space-x-2">
            {icon && <span className="text-cyan-500/80">{icon}</span>}
            <span>{label}</span>
        </label>
        <select
            {...props}
            className={`w-full px-4 py-2.5 bg-slate-900/50 rounded-lg text-slate-100 border transition-all duration-200 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 outline-none appearance-none ${error ? 'border-red-500/50' : 'border-slate-700'} ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {options.map(option => (
                <option key={option.value} value={option.value} className="bg-slate-800">{option.label}</option>
            ))}
        </select>
        {error && <p className="mt-1 text-xs text-red-400 flex items-center gap-1"><FaExclamationTriangle size={10} /> {error}</p>}
    </div>
);

export const ExportedCheckbox: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: React.ReactNode; }> = ({ label, ...props }) => (
    <label className="flex items-center space-x-3 text-slate-300 cursor-pointer group select-none">
        <div className="relative flex items-center">
            <input 
                type="checkbox" 
                {...props} 
                className="peer h-5 w-5 bg-slate-900 border-slate-700 rounded transition-all duration-200 checked:bg-cyan-600 checked:border-cyan-500 cursor-pointer focus:ring-0 appearance-none border"
            />
            <FaCheckCircle className="absolute inset-0 m-auto text-white scale-0 peer-checked:scale-75 transition-transform duration-200 pointer-events-none" />
        </div>
        <span className="text-sm font-medium group-hover:text-cyan-400 transition-colors">{label}</span>
    </label>
);

export const ExportedButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger'; loading?: boolean; icon?: React.ReactNode; }> = ({ children, variant = 'primary', loading, icon, ...props }) => {
    const baseClasses = "px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
    let variantClasses = "";
    switch (variant) {
        case 'primary':
            variantClasses = "bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white shadow-lg shadow-cyan-900/20";
            break;
        case 'secondary':
            variantClasses = "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 shadow-md";
            break;
        case 'danger':
            variantClasses = "bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/30";
            break;
    }
    return (
        <button
            {...props}
            className={`${baseClasses} ${variantClasses} ${props.className || ''}`}
        >
            {loading ? <FaSpinner className="animate-spin" /> : icon && <span>{icon}</span>}
            <span>{children}</span>
        </button>
    );
};

// ExportedChart component for visualizing token allocations
export const ExportedChart: React.FC<{ title: string; data: { label: string; value: number; color: string; }[] }> = ({ title, data }) => {
    return (
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-700/50 w-full">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">{title}</h4>
            <div className="space-y-5">
                {data.map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-300 font-medium">{item.label}</span>
                            <span className="text-cyan-400 font-bold">{item.value.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div 
                                className="h-full rounded-full transition-all duration-1000 ease-out"
                                style={{ 
                                    width: `${item.value}%`, 
                                    backgroundColor: item.color,
                                    boxShadow: `0 0 10px ${item.color}40`
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
            {data.length === 0 && (
                <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-800 rounded-xl">
                    <span className="text-slate-600 text-xs italic">No allocation data yet</span>
                </div>
            )}
        </div>
    );
};
