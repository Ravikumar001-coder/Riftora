import React from 'react';
import { Check } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const steps = [
  { id: 1, name: 'Select Team' },
  { id: 2, name: 'Verify' },
  { id: 3, name: 'Review' },
  { id: 4, name: 'Confirm' },
];

export function RegistrationStepper({ currentStep }) {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-800 -z-10 rounded-full" />
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          
          return (
            <div key={step.id} className="flex flex-col items-center relative bg-slate-950 px-2 sm:px-4">
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors",
                  isCompleted ? "bg-blue-600 border-blue-600 text-white" : 
                  isCurrent ? "bg-slate-900 border-blue-500 text-blue-500" : 
                  "bg-slate-900 border-slate-700 text-slate-500"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.id}
              </div>
              <span className={cn(
                "mt-2 text-xs font-medium hidden sm:block",
                (isCompleted || isCurrent) ? "text-slate-200" : "text-slate-500"
              )}>
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
