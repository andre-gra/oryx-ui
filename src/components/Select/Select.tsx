import React, { ForwardedRef } from "react";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import * as RadixSelect from "@radix-ui/react-select";
import classnames from "classnames";
import { useTheme } from "../../theme";
import { useSize } from "../../theme";

/**
 * Individual option item
 */
export interface SelectOption {
  /** Display label */
  label: string;
  /** Value to be submitted */
  value: string;
  /** Whether option is disabled */
  disabled?: boolean;
}

/**
 * Group of options with a label
 */
export interface SelectOptionGroup {
  /** Options in this group */
  group: SelectOption[];
  /** Group label */
  label: string;
}

/**
 * Props for the Select component
 */
export interface SelectProps {
  /** Accessible label for the select */
  label: string;
  /** Placeholder text when no value selected */
  placeholder?: string;
  /** Grouped options */
  options: SelectOptionGroup[];
  /** Controlled value */
  value?: string;
  /** Callback when value changes */
  onValueChange?: (value: string) => void;
  /** Additional className */
  className?: string;
  /** Optional ID for accessibility */
  id?: string;
}

/**
 * A styled select/dropdown component with grouped options.
 *
 * @example
 * ```tsx
 * <Select
 *   label="Fruits"
 *   placeholder="Select a fruit..."
 *   options={[
 *     { label: "Fruits", group: [{ value: "apple", label: "Apple" }] }
 *   ]}
 *   onValueChange={(value) => console.log(value)}
 * />
 * ```
 */
export const Select = ({
  label,
  placeholder,
  options,
  value,
  onValueChange,
  className,
  id,
}: SelectProps) => {
  const { theme } = useTheme();
  const { size } = useSize();

  return (
    <RadixSelect.Root value={value} onValueChange={onValueChange}>
      <RadixSelect.Trigger
        id={id}
        aria-label={label}
        className={classnames(
          theme,
          `select-trigger${size}`,
          "inline-flex items-center justify-center leading-none bg-color3 text-color11 shadow-[0_2px_10px] shadow-blackA7 hover:bg-color4 focus:shadow-[0_0_0_2px] focus:shadow-color10 data-[placeholder]:text-color9 outline-none",
          className,
        )}
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon className={classnames(theme, "select-icon text-color11")}>
          <ChevronDownIcon />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content
          className={classnames(
            theme,
            `select-content${size}`,
            "overflow-hidden bg-color3 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]",
          )}
        >
          <RadixSelect.ScrollUpButton
            className={classnames(
              theme,
              `select-scroll-up-button${size}`,
              "flex items-center justify-center bg-color3 text-color11 cursor-default",
            )}
          >
            <ChevronUpIcon />
          </RadixSelect.ScrollUpButton>
          <RadixSelect.Viewport className={classnames(theme, `select-viewport${size}`)}>
            {options.map((option, index) => (
              <div key={option.label.toLowerCase()}>
                <RadixSelect.Group>
                  <RadixSelect.Label
                    className={classnames(theme, `select-label${size}`, "text-gray11")}
                  >
                    {option.label}
                  </RadixSelect.Label>
                  {option.group.map((item) => (
                    <SelectItem
                      theme={theme}
                      size={size}
                      key={item.value}
                      value={item.value}
                      disabled={item.disabled}
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </RadixSelect.Group>
                {options.length > 1 && index < options.length - 1 && (
                  <RadixSelect.Separator
                    className={classnames(theme, `select-separator${size}`, "bg-color10")}
                  />
                )}
              </div>
            ))}
          </RadixSelect.Viewport>
          <RadixSelect.ScrollDownButton
            className={classnames(
              theme,
              `select-scroll-down-button${size}`,
              "flex items-center justify-center bg-color3 text-color11 cursor-default",
            )}
          >
            <ChevronDownIcon />
          </RadixSelect.ScrollDownButton>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
};

interface SelectItemProps {
  children: React.ReactNode;
  className?: string;
  value: string;
  disabled?: boolean;
  theme: string;
  size: string;
}

const SelectItem = React.forwardRef(
  (
    { children, theme, size, ...props }: SelectItemProps,
    forwardedRef: ForwardedRef<HTMLDivElement>,
  ) => {
    return (
      <RadixSelect.Item
        className={classnames(
          theme,
          `select-item${size}`,
          "leading-none text-color11 flex items-center relative select-none data-[disabled]:text-gray8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-color9 data-[highlighted]:text-color1",
        )}
        {...props}
        ref={forwardedRef}
      >
        <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
        <RadixSelect.ItemIndicator
          className={classnames(
            theme,
            `select-item-indicator${size}`,
            "absolute left-0 inline-flex items-center justify-center",
          )}
        >
          <CheckIcon />
        </RadixSelect.ItemIndicator>
      </RadixSelect.Item>
    );
  },
);

SelectItem.displayName = "SelectItem";

export default Select;
