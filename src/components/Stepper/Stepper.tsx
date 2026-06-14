import classnames from 'classnames'
import { useTheme } from '../../theme'
import { useSize } from '../../theme'

export interface StepperStep {
  label: string
  description?: string
}

export interface StepperProps {
  steps: StepperStep[]
  currentStep: number
  onStepClick?: (stepIndex: number) => void
  className?: string
}

export const Stepper = ({ steps, currentStep, onStepClick, className }: StepperProps) => {
  const { theme } = useTheme()
  const { size } = useSize()

  return (
    <nav
      className={classnames(
        theme,
        `stepper${size}`,
        'flex items-center justify-center w-full',
        className,
      )}
      aria-label="Progress"
    >
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isActive = index === currentStep
        const isPending = index > currentStep
        const isClickable = onStepClick && (isCompleted || isPending)

        const stepNumber = index + 1

        return (
          <div key={step.label} className="flex items-center flex-1 last:flex-none">
            <div
              className={classnames(
                theme,
                `stepper-step${size}`,
                'flex flex-col items-center gap-2',
                isClickable && 'cursor-pointer',
              )}
              onClick={() => isClickable && onStepClick(index)}
              role={isClickable ? 'button' : undefined}
              tabIndex={isClickable ? 0 : undefined}
              onKeyDown={(e) => {
                if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                  onStepClick(index)
                }
              }}
              aria-current={isActive ? 'step' : undefined}
            >
              <div
                className={classnames(
                  theme,
                  `stepper-circle${size}`,
                  'flex items-center justify-center rounded-full transition-colors duration-200',
                  isCompleted && 'bg-color9 text-color1',
                  isActive && 'bg-color9 text-color1 ring-2 ring-offset-2 ring-color8',
                  isPending && 'bg-transparent border-2 border-color7 text-color11',
                )}
              >
                {isCompleted ? (
                  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span>{stepNumber}</span>
                )}
              </div>
              <div className="flex flex-col items-center">
                <span
                  className={classnames(
                    theme,
                    `stepper-label${size}`,
                    'font-medium text-center leading-tight transition-colors duration-200',
                    (isCompleted || isActive) ? 'text-color12' : 'text-color10',
                  )}
                >
                  {step.label}
                </span>
                {step.description && (
                  <span
                    className={classnames(
                      theme,
                      `stepper-description${size}`,
                      'text-center leading-tight transition-colors duration-200',
                      (isCompleted || isActive) ? 'text-color11' : 'text-color9',
                    )}
                  >
                    {step.description}
                  </span>
                )}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={classnames(
                  theme,
                  `stepper-connector${size}`,
                  'flex-1 h-0.5 mx-4 rounded-full transition-colors duration-200',
                  isCompleted ? 'bg-color9' : 'bg-color6',
                )}
              />
            )}
          </div>
        )
      })}
    </nav>
  )
}

export default Stepper
