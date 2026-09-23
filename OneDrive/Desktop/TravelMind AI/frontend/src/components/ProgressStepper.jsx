import React from 'react';
import { Check } from 'lucide-react';

export const ProgressStepper = ({ currentStep, totalSteps = 12 }) => {
  return (
    <div className="w-full my-4 px-2">
      {/* Scrollable container for mobile */}
      <div className="overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center justify-between min-w-[580px] max-w-4xl mx-auto px-4">
          {Array.from({ length: totalSteps }, (_, i) => {
            const stepNum = i + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <React.Fragment key={stepNum}>
                {/* Step Node */}
                <div className="flex flex-col items-center relative group">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-borderBrown flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      isCurrent
                        ? 'bg-tourOrange text-white scale-110 shadow-[0_4px_0_#5A2B15] ring-4 ring-tourGold/50 animate-bounce-gentle'
                        : isCompleted
                        ? 'bg-tourGreen text-white shadow-[0_3px_0_#5A2B15]'
                        : 'bg-cream-100 text-textBrown/70 shadow-[0_3px_0_rgba(90,43,21,0.2)]'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : stepNum}
                  </div>
                  <span
                    className={`text-[11px] font-bold mt-1 whitespace-nowrap ${
                      isCurrent ? 'text-tourOrange' : isCompleted ? 'text-textBrown' : 'text-textBrown/50'
                    }`}
                  >
                    Q{stepNum}
                  </span>
                </div>

                {/* Connector Line */}
                {stepNum < totalSteps && (
                  <div className="flex-1 h-1.5 mx-1 rounded-full bg-borderBrown/25 relative overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        stepNum < currentStep ? 'bg-tourGreen w-full' : 'w-0'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
