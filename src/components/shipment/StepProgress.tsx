import React from "react";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Step {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface StepProgressProps {
  steps: Step[];
  currentStep: string;
  completedSteps: string[];
  onStepClick?: (stepId: string) => void;
  className?: string;
}

export function StepProgress({ 
  steps, 
  currentStep, 
  completedSteps, 
  onStepClick,
  className 
}: StepProgressProps) {
  const getCurrentStepIndex = () => steps.findIndex(step => step.id === currentStep);
  const currentIndex = getCurrentStepIndex();

  return (
    <div className={cn("w-full", className)}>
      {/* Desktop Progress Bar */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = step.id === currentStep;
          const isClickable = isCompleted || isCurrent;

          return (
            <React.Fragment key={step.id}>
              <div 
                className={cn(
                  "flex flex-col items-center space-y-2 cursor-pointer transition-all",
                  !isClickable && "cursor-default opacity-50"
                )}
                onClick={() => isClickable && onStepClick?.(step.id)}
              >
                {/* Step Circle */}
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-all",
                  isCompleted && "bg-primary text-primary-foreground",
                  isCurrent && !isCompleted && "bg-primary/10 text-primary border-2 border-primary",
                  !isCurrent && !isCompleted && "bg-muted text-muted-foreground"
                )}>
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                
                {/* Step Info */}
                <div className="text-center max-w-24">
                  <div className={cn(
                    "text-xs font-medium",
                    isCurrent && "text-primary",
                    !isCurrent && "text-muted-foreground"
                  )}>
                    {step.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {step.description}
                  </div>
                </div>
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className={cn(
                  "flex-1 h-px mx-4 transition-all",
                  index < currentIndex ? "bg-primary" : "bg-muted"
                )} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile Progress Bar */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">
            Step {currentIndex + 1} of {steps.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round(((currentIndex + 1) / steps.length) * 100)}%
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2 mb-4">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
        
        {/* Current Step Info */}
        <div className="text-center">
          <h3 className="font-medium text-primary">{steps[currentIndex]?.title}</h3>
          <p className="text-sm text-muted-foreground">{steps[currentIndex]?.description}</p>
        </div>
      </div>
    </div>
  );
}