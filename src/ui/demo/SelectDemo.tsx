import React, { ForwardedRef } from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import * as Select from "@radix-ui/react-select";
import classnames from "classnames";
import { useTheme } from "../../themes/useTheme";
import { useSize } from "../../themes/useSize";

type Option = { label: string; value: string; disabled?: boolean };
type Options = { group: Option[]; label: string };
export interface SelectProps {
  label: string;
  placeholder?: string;
  options: Options[];
  value?: string;
  onValueChange?(value: string): void;
}

const SelectDemo = ({ ...props }: SelectProps) => {
  const { theme } = useTheme();
  const { size } = useSize();

  return (
    <Select.Root value={props.value} onValueChange={props.onValueChange}>
      <Select.Trigger
        aria-label={props.label}
        className={classnames(
          theme,
          `select-trigger${size}`,
          "inline-flex items-center justify-center rounded leading-none bg-color3 text-color11 shadow-[0_2px_10px] shadow-blackA7 hover:bg-color4 focus:shadow-[0_0_0_2px] focus:shadow-color10 data-[placeholder]:text-color9 outline-none",
        )}
      >
        <Select.Value placeholder={props.placeholder} />
        <Select.Icon className={classnames(theme, "select-icon text-color11")}>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          className={classnames(
            theme,
            "overflow-hidden bg-color3 rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]",
          )}
        >
          <Select.ScrollUpButton
            className={classnames(
              theme,
              `select-scroll-up-button${size}`,
              "flex items-center justify-center bg-color3 text-color11 cursor-default",
            )}
          >
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport
            className={classnames(theme, `select-viewport${size}`)}
          >
            {props.options.map((option, index) => (
              <div key={option.label.toLowerCase()}>
                <Select.Group>
                  <Select.Label
                    className={classnames(
                      theme,
                      `select-label${size}`,
                      "text-gray11",
                    )}
                  >
                    {option.label}
                  </Select.Label>
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
                </Select.Group>
                {props.options.length > 1 &&
                  index < props.options.length - 1 && (
                    <Select.Separator
                      className={classnames(
                        theme,
                        `select-separator${size}`,
                        "bg-color10",
                      )}
                    />
                  )}
              </div>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton
            className={classnames(
              theme,
              `select-scroll-down-button${size}`,
              "flex items-center justify-center bg-color3 text-color11 cursor-default",
            )}
          >
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

export interface ISelectGroupItemProps {
  children: React.ReactNode;
  className?: string;
  value: string;
  asChild?: boolean;
  disabled?: boolean;
  theme: string;
  size: string;
}

const SelectItem = React.forwardRef(
  (
    { children, theme, size, ...props }: ISelectGroupItemProps,
    forwardedRef: ForwardedRef<HTMLDivElement>,
  ) => {
    return (
      <Select.Item
        className={classnames(
          theme,
          `select-item${size}`,
          "leading-none text-color11 flex items-center relative select-none data-[disabled]:text-gray8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-color9 data-[highlighted]:text-color1",
        )}
        {...props}
        ref={forwardedRef}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator
          className={classnames(
            theme,
            `select-item-indicator${size}`,
            "absolute left-0 inline-flex items-center justify-center",
          )}
        >
          <CheckIcon />
        </Select.ItemIndicator>
      </Select.Item>
    );
  },
);

export default SelectDemo;
