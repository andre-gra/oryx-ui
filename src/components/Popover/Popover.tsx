import * as RadixPopover from "@radix-ui/react-popover";
import { MixerHorizontalIcon, Cross2Icon } from "@radix-ui/react-icons";
import classnames from "classnames";
import { useTheme } from "../../theme";
import { useSize } from "../../theme";

/**
 * Field definition for Popover form
 */
export interface PopoverField {
  /** Field label */
  label: string;
  /** htmlFor attribute */
  htmlFor: string;
  /** Input id */
  id: string;
  /** Default value */
  defaultValue?: string;
}

/**
 * Field group with title
 */
export interface PopoverFieldGroup {
  /** Fields in this group */
  field: PopoverField[];
  /** Group title */
  fieldTitle: string;
}

/**
 * Props for the Popover component
 */
export interface PopoverProps {
  /** Aria label for trigger button */
  buttonTriggerLabel?: string;
  /** Aria label for close button */
  buttonCloseLabel?: string;
  /** Field groups to render */
  fields: PopoverFieldGroup[];
  /** Additional className */
  className?: string;
}

/**
 * A popover component with form fields.
 *
 * @example
 * ```tsx
 * <Popover
 *   buttonTriggerLabel="Settings"
 *   fields={[
 *     {
 *       fieldTitle: "Dimensions",
 *       field: [{ label: "Width", htmlFor: "width", id: "width", defaultValue: "100%" }]
 *     }
 *   ]}
 * />
 * ```
 */
export const Popover = ({ buttonTriggerLabel, fields, className }: PopoverProps) => {
  const { theme } = useTheme();
  const { size } = useSize();

  return (
    <RadixPopover.Root>
      <RadixPopover.Trigger asChild>
        <button
          className={classnames(
            theme,
            `popover-trigger${size}`,
            "rounded-full inline-flex items-center justify-center text-color11 bg-color3 shadow-[0_2px_10px] shadow-blackA7 hover:bg-color4 focus:shadow-[0_0_0_2px] focus:shadow-black outline-none",
            className,
          )}
          aria-label={buttonTriggerLabel}
        >
          <MixerHorizontalIcon />
        </button>
      </RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content
          className={classnames(
            theme,
            `popover-content${size}`,
            "bg-color3 shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2),0_0_0_2px_hsla(206,22%,7%,.2)] will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade",
          )}
        >
          {fields.map((fieldsets, index) => (
            <div
              key={`${index}-${fieldsets.fieldTitle}`}
              className={classnames(theme, `popover-content-container${size}`, "flex flex-col")}
            >
              <p
                className={classnames(
                  theme,
                  `popover-content-paragraph${size}`,
                  "text-color12 font-medium",
                )}
              >
                {fieldsets.fieldTitle}
              </p>
              {fieldsets.field.map((fieldset) => (
                <fieldset
                  key={`${index}-${fieldset.label}`}
                  className={classnames(theme, "flex justify-between items-center")}
                >
                  <label className={classnames(theme, "text-color11")} htmlFor={fieldset.htmlFor}>
                    {fieldset.label}
                  </label>
                  <input
                    className={classnames(
                      theme,
                      "w-full inline-flex items-center justify-center flex-1 leading-none text-color11 shadow-[0_0_0_1px] shadow-color7 focus:shadow-[0_0_0_2px] focus:shadow-color8 outline-none",
                    )}
                    id={fieldset.id}
                    defaultValue={fieldset.defaultValue}
                  />
                </fieldset>
              ))}
            </div>
          ))}
          <RadixPopover.Close
            className={classnames(
              theme,
              `popover-close${size}`,
              "rounded-full inline-flex items-center justify-center text-color11 absolute hover:bg-color4 focus:shadow-[0_0_0_2px] focus:shadow-color7 outline-none",
            )}
            aria-label="Close"
          >
            <Cross2Icon />
          </RadixPopover.Close>
          <RadixPopover.Arrow className={classnames(theme, "fill-color3")} />
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
};

export default Popover;
