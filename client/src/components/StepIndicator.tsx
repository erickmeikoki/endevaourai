import { CheckIcon, Upload, FileText, ClipboardCheck, Download } from "lucide-react";

interface Step {
  id: number;
  title: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  // Map step IDs to their respective icons
  const getStepIcon = (stepId: number) => {
    switch(stepId) {
      case 1: return <Upload className="h-5 w-5" />;
      case 2: return <FileText className="h-5 w-5" />;
      case 3: return <ClipboardCheck className="h-5 w-5" />;
      case 4: return <Download className="h-5 w-5" />;
      default: return stepId;
    }
  };
  
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
                step-number w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300
                ${isActive ? 'bg-primary text-white ring-4 ring-primary/20 shadow-md scale-110' : ''}
                ${isCompleted ? 'bg-success text-white' : ''}
                ${!isActive && !isCompleted ? 'bg-muted text-muted-foreground' : ''}
              `}
            >
              {isCompleted ? <CheckIcon className="h-5 w-5" /> : getStepIcon(step.id)}
            </div>
            <div className="step-title text-sm font-medium font-mono">
              {isActive ? <span className="text-primary font-bold">{step.title}</span> : step.title}
            </div>
            
            {/* Connector line */}
            {step.id < steps.length && (
              <div className="absolute top-6 left-12 h-0.5 w-full z-0" style={{ width: 'calc(100% - 3rem)' }}>
                <div 
                  className={`h-full ${isCompleted ? 'bg-success' : 'bg-muted'} transition-all duration-500`}
                  style={{ width: isActive ? '50%' : isCompleted ? '100%' : '0%' }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
