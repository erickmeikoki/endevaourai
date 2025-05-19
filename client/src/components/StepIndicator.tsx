import { CheckIcon } from "lucide-react";

interface Step {
  id: number;
  title: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex justify-between mb-8 px-4 md:px-20">
      {steps.map((step) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;
        
        return (
          <div 
            key={step.id}
            className={`flex flex-col items-center relative ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
            data-step={step.id}
          >
            <div 
              className={`
                step-number w-10 h-10 rounded-full flex items-center justify-center mb-2
                ${isActive ? 'bg-primary text-white' : ''}
                ${isCompleted ? 'bg-success text-white' : ''}
                ${!isActive && !isCompleted ? 'bg-gray-300 text-gray-600' : ''}
              `}
            >
              {isCompleted ? <CheckIcon className="h-5 w-5" /> : step.id}
            </div>
            <div className="step-title text-sm font-medium">{step.title}</div>
            
            {/* Connector line */}
            {step.id < steps.length && (
              <div 
                className="absolute top-5 left-10 h-0.5 bg-gray-300 w-full"
                style={{ width: 'calc(100% - 2.5rem)' }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
