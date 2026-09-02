import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ForwardedRef,
} from 'react'
import * as RadixRadioGroup from '@radix-ui/react-radio-group'
import classnames from 'classnames'
import { useTheme } from '../../theme'
import { useSize } from '../../theme'

/**
 * A radio option. When it exposes an `items` array it is a non-selectable
 * container that renders a nested radio group inside itself.
 */
export type RadioOption =
  | { value: string; label: string; disabled?: boolean }
  | { label: string; items: RadioOption[]; defaultValue?: string; disabled?: boolean }

/**
 * Props for the Radio component
 */
export interface RadioProps {
  /** Visible group label */
  label?: string
  /** Name used for form submission (the group and each nested group get derived names) */
  name?: string
  /** Radios (or nested radio groups) to render */
  items: RadioOption[]
  /** Controlled value for the top-level group */
  value?: string
  /** Initial value for the top-level group when uncontrolled */
  defaultValue?: string
  /** Callback when the top-level selection changes */
  onValueChange?: (value: string) => void
  /** When this value changes, every group (including nested ones) resets to its default */
  resetKey?: string | number
  /** Whether the whole group is disabled */
  disabled?: boolean
  /** Whether the group is required */
  required?: boolean
  /** Layout direction of the radios */
  orientation?: 'horizontal' | 'vertical'
  /** Additional className for the root element */
  className?: string
}

/**
 * Imperative handle exposed by Radio
 */
export interface RadioHandle {
  /** Reset every group (top and nested) to its default value */
  reset: () => void
  /** Current value of the top-level group */
  getValue: () => string | undefined
  /** Current values of every group, keyed by (derived) name */
  getValues: () => Record<string, string | undefined>
}

interface RadioResetContextValue {
  resetToken: number
  register: (key: string, getValue: () => string | undefined) => () => void
}

const RadioResetContext = createContext<RadioResetContextValue | null>(null)

interface RadioGroupLevelProps {
  items: RadioOption[]
  name: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  required?: boolean
  orientation?: 'horizontal' | 'vertical'
  className?: string
  labelledById?: string
}

const RadioGroupLevel = ({
  items,
  name,
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  required = false,
  orientation = 'vertical',
  className,
  labelledById,
}: RadioGroupLevelProps) => {
  const { theme } = useTheme()
  const { size } = useSize()
  const resetCtx = useContext(RadioResetContext)

  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue)
  const finalValue = isControlled ? value : internalValue
  const finalValueRef = useRef(finalValue)
  finalValueRef.current = finalValue

  useEffect(() => {
    if (!resetCtx) return
    return resetCtx.register(name, () => finalValueRef.current)
  }, [resetCtx, name])

  useEffect(() => {
    if (resetCtx && resetCtx.resetToken > 0) {
      setInternalValue(defaultValue)
    }
  }, [resetCtx, defaultValue])

  const handleValueChange = (next: string) => {
    if (!isControlled) {
      setInternalValue(next)
    }
    onValueChange?.(next)
  }

  return (
    <RadixRadioGroup.Root
      className={classnames(
        theme,
        `radio-root${size}`,
        'flex',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col gap-1',
        className,
      )}
      name={name}
      value={finalValue}
      onValueChange={handleValueChange}
      disabled={disabled}
      required={required}
      orientation={orientation}
      aria-labelledby={labelledById}
    >
      {items.map((option, index) => {
        if ('items' in option) {
          const childName = `${name}-${index}`
          return (
            <div key={childName} className={classnames(theme, `radio-group${size}`, 'flex flex-col')}>
              <span
                className={classnames(
                  theme,
                  `radio-group-label${size}`,
                  'text-color11 select-none',
                )}
              >
                {option.label}
              </span>
              <RadioGroupLevel
                items={option.items}
                name={childName}
                defaultValue={option.defaultValue}
                disabled={disabled || option.disabled}
                required={required}
                orientation={orientation}
              />
            </div>
          )
        }

        const itemId = `${name}-${option.value}-${index}`
        return (
          <div key={itemId} className={classnames(theme, 'flex items-center')}>
            <RadixRadioGroup.Item
              id={itemId}
              value={option.value}
              disabled={disabled || option.disabled}
              className={classnames(
                theme,
                `radio-item${size}`,
                'bg-color1 border-2 border-color7 data-[state=checked]:bg-color9 data-[state=checked]:border-color9 rounded-full appearance-none outline-none transition-colors',
                'hover:border-color8 focus:shadow-[0_0_0_2px] focus:shadow-color8 disabled:cursor-not-allowed disabled:opacity-50',
              )}
            >
              <RadixRadioGroup.Indicator
                className={classnames(
                  theme,
                  `radio-indicator${size}`,
                  'flex items-center justify-center w-full h-full',
                )}
              >
                <div
                  className={classnames(
                    theme,
                    `radio-dot${size}`,
                    'bg-color1 rounded-full',
                  )}
                />
              </RadixRadioGroup.Indicator>
            </RadixRadioGroup.Item>
            <label
              htmlFor={itemId}
              className={classnames(
                theme,
                `radio-item-label${size}`,
                'text-color11 select-none leading-none cursor-pointer',
                disabled || option.disabled ? 'opacity-50 cursor-not-allowed' : undefined,
              )}
            >
              {option.label}
            </label>
          </div>
        )
      })}
    </RadixRadioGroup.Root>
  )
}

const RadioGroupLevelMemo = React.memo(RadioGroupLevel)

/**
 * A radio group component supporting nested radio groups and reset logic.
 *
 * - One component, data-driven: pass `items` to render a group.
 * - An option carrying `items` renders a nested, independent radio group.
 * - Controlled (`value`/`onValueChange`) for the top level, uncontrolled
 *   (`defaultValue`) otherwise. Internal state is derived, never synced from
 *   props, so no redundant update loops occur.
 * - Reset via `resetKey` prop or imperatively via `ref.reset()`; both restore
 *   every group to its default value.
 *
 * @example
 * ```tsx
 * <Radio
 *   label="Plan"
 *   name="plan"
 *   defaultValue="basic"
 *   items={[
 *     { value: 'basic', label: 'Basic' },
 *     { value: 'pro', label: 'Pro' },
 *     {
 *       label: 'Enterprise',
 *       defaultValue: 'eu',
 *       items: [
 *         { value: 'eu', label: 'EU' },
 *         { value: 'us', label: 'US' },
 *       ],
 *     },
 *   ]}
 * />
 * ```
 */
export const Radio = React.forwardRef(
  (
    {
      label,
      name = 'default',
      items,
      value,
      defaultValue,
      onValueChange,
      resetKey,
      disabled = false,
      required = false,
      orientation = 'vertical',
      className,
    }: RadioProps,
    forwardedRef: ForwardedRef<RadioHandle>,
  ) => {
    const { theme } = useTheme()
    const { size } = useSize()
    const labelId = useId()

    const [resetToken, setResetToken] = useState(0)
    const prevResetKey = useRef(resetKey)
    const gettersRef = useRef(new Map<string, () => string | undefined>())

    useEffect(() => {
      if (resetKey !== prevResetKey.current) {
        prevResetKey.current = resetKey
        setResetToken((t) => t + 1)
      }
    }, [resetKey])

    const register = useCallback((key: string, getValue: () => string | undefined) => {
      gettersRef.current.set(key, getValue)
      return () => {
        gettersRef.current.delete(key)
      }
    }, [])

    useImperativeHandle(
      forwardedRef,
      () => ({
        reset: () => setResetToken((t) => t + 1),
        getValue: () => gettersRef.current.get(name)?.() ?? gettersRef.current.get('default')?.(),
        getValues: () => {
          const values: Record<string, string | undefined> = {}
          gettersRef.current.forEach((getValue, key) => {
            values[key] = getValue()
          })
          return values
        },
      }),
      [name],
    )

    const resetCtx = React.useMemo<RadioResetContextValue>(
      () => ({ resetToken, register }),
      [resetToken, register],
    )

    return (
      <RadioResetContext.Provider value={resetCtx}>
        <div className={classnames(theme, `radio${size}`, 'flex flex-col gap-2', className)}>
          {label && (
            <span
              id={labelId}
              className={classnames(
                theme,
                `radio-label${size}`,
                'text-color12 select-none font-medium leading-none',
              )}
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </span>
          )}
          <RadioGroupLevelMemo
            items={items}
            name={name}
            value={value}
            defaultValue={defaultValue}
            onValueChange={onValueChange}
            disabled={disabled}
            required={required}
            orientation={orientation}
            labelledById={label ? labelId : undefined}
          />
        </div>
      </RadioResetContext.Provider>
    )
  },
)

Radio.displayName = 'Radio'

export default Radio
