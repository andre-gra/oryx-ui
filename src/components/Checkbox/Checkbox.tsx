import React from "react";
import * as RadixCheckbox from "@radix-ui/react-checkbox";
import classnames from "classnames";
import { useTheme } from "../../theme";
import { useSize } from "../../theme";
import { CheckIcon } from "@radix-ui/react-icons";

/**
 * Props for the Checkbox component
 */
export interface CheckboxProps {
  /** Whether the checkbox is checked */
  checked?: boolean;
  /** Whether the checkbox is indeterminate (partially checked) */
  indeterminate?: boolean;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Whether the checkbox is required */
  required?: boolean;
  /** The label text for the checkbox */
  label?: string;
  /** The name attribute for form submission */
  name?: string;
  /** The value attribute for form submission */
  value?: string;
  /** Callback when checked state changes */
  onCheckedChange?: (checked: boolean | "indeterminate") => void;
  /** Additional className for the root element */
  className?: string;
}

/**
 * An accessible checkbox component built on Radix UI primitives.
 *
 * @example
 * ```tsx
 * <Checkbox
 *   label="Accept terms and conditions"
 *   checked={accepted}
 *   onCheckedChange={setAccepted}
 * />
 * ```
 */
export const Checkbox = ({
  checked,
  indeterminate = false,
  disabled = false,
  required = false,
  label,
  name,
  value,
  onCheckedChange,
  className,
}: CheckboxProps) => {
  const { theme } = useTheme();
  const { size } = useSize();
  const [internalChecked, setInternalChecked] = React.useState(checked || false);
  
  const checkboxId = React.useId();
  const finalChecked = checked !== undefined ? checked : internalChecked;
  
  const handleCheckedChange = (newChecked: boolean | "indeterminate") => {
    if (checked === undefined) {
      setInternalChecked(newChecked === "indeterminate" ? false : newChecked);
    }
    onCheckedChange?.(newChecked);
  };

  return (
    <div className={classnames("flex items-center", className)}>
      <RadixCheckbox.Root
        className={classnames(
          theme,
          `checkbox-root${size}`,
          "bg-color1 border-2 border-color7 data-[state=checked]:bg-color9 data-[state=checked]:border-color9 data-[state=indeterminate]:bg-color9 data-[state=indeterminate]:border-color9 rounded flex h-5 w-5 appearance-none items-center justify-center outline-none transition-colors",
          "hover:border-color8 focus:shadow-[0_0_0_2px] focus:shadow-color8 disabled:cursor-not-allowed disabled:opacity-50",
        )}
        id={label ? checkboxId : undefined}
        checked={indeterminate ? "indeterminate" : finalChecked}
        onCheckedChange={handleCheckedChange}
        disabled={disabled}
        required={required}
        name={name}
        value={value}
      >
        <RadixCheckbox.Indicator
          className={classnames(
            "text-color1 transition-transform data-[state=checked]:animate-scale-in data-[state=indeterminate]:animate-scale-in",
          )}
        >
          {indeterminate ? (
            <div className="h-1 w-3 bg-current" />
          ) : (
            <CheckIcon className="h-4 w-4" />
          )}
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      {label && (
        <label
          htmlFor={checkboxId}
          className={classnames(
            theme,
            `checkbox-label${size}`,
            "text-color11 ml-2 select-none leading-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
    </div>
  );
};

export default Checkbox;