import * as RadixAlertDialog from "@radix-ui/react-alert-dialog";
import classnames from "classnames";
import { useTheme } from "../../theme";
import { useSize } from "../../theme";

/**
 * Text configuration for AlertDialog
 */
export interface AlertDialogTexts {
  /** Text for the trigger button */
  buttonTrigger: string;
  /** Title/heading content */
  content: string;
  /** Description text */
  description: string;
  /** Cancel button text */
  buttonCancel: string;
  /** Confirm action button text */
  action: string;
}

/**
 * Props for the AlertDialog component
 */
export interface AlertDialogProps {
  /** Text configuration */
  texts: AlertDialogTexts;
  /** Callback when action is confirmed */
  onAction?: () => void;
  /** Callback when dialog is cancelled */
  onCancel?: () => void;
  /** Additional className for trigger */
  className?: string;
}

/**
 * A modal dialog for confirming destructive actions.
 *
 * @example
 * ```tsx
 * <AlertDialog
 *   texts={{
 *     buttonTrigger: "Delete",
 *     content: "Are you sure?",
 *     description: "This action cannot be undone.",
 *     buttonCancel: "Cancel",
 *     action: "Delete"
 *   }}
 *   onAction={() => handleDelete()}
 * />
 * ```
 */
export const AlertDialog = ({ texts, onAction, onCancel, className }: AlertDialogProps) => {
  const { theme } = useTheme();
  const { size } = useSize();

  return (
    <RadixAlertDialog.Root>
      <RadixAlertDialog.Trigger
        asChild
        className={classnames(
          theme,
          `alertdialog-trigger${size}`,
          "text-color11 hover:bg-color4 shadow-blackA7 inline-flex items-center justify-center bg-color3 font-medium leading-none shadow-[0_2px_10px] outline-none focus:shadow-[0_0_0_2px] focus:shadow-color10",
          className,
        )}
      >
        <button>{texts.buttonTrigger}</button>
      </RadixAlertDialog.Trigger>
      <RadixAlertDialog.Portal>
        <RadixAlertDialog.Overlay
          className={classnames(
            theme,
            "bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0",
          )}
        />
        <RadixAlertDialog.Content
          className={classnames(
            theme,
            `alertdialog-content${size}`,
            "data-[state=open]:animate-contentShow z-10 fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-color2 shadow-color9 focus:outline-none",
          )}
        >
          <RadixAlertDialog.Title
            className={classnames(`alertdialog-title${size}`, "text-color12 m-0 font-medium")}
          >
            {texts.content}
          </RadixAlertDialog.Title>
          <RadixAlertDialog.Description
            className={classnames(
              `alertdialog-description${size}`,
              "text-color11 mt-4 mb-5 leading-normal",
            )}
          >
            {texts.description}
          </RadixAlertDialog.Description>
          <div className={classnames(`alertdialog-actions${size}`, "flex justify-end")}>
            <RadixAlertDialog.Cancel
              asChild
              className={classnames(
                `alertdialog-cancel${size}`,
                "text-color11 bg-color4 hover:bg-color5 focus:shadow-color7 inline-flex items-center justify-center font-medium leading-none outline-none focus:shadow-[0_0_0_2px]",
              )}
            >
              <button onClick={onCancel}>{texts.buttonCancel}</button>
            </RadixAlertDialog.Cancel>
            <RadixAlertDialog.Action
              asChild
              className={classnames(
                `alertdialog-action${size}`,
                "text-error11 bg-error4 hover:bg-error5 focus:shadow-red7 inline-flex items-center justify-center font-medium leading-none outline-none focus:shadow-[0_0_0_2px]",
              )}
            >
              <button onClick={onAction}>{texts.action}</button>
            </RadixAlertDialog.Action>
          </div>
        </RadixAlertDialog.Content>
      </RadixAlertDialog.Portal>
    </RadixAlertDialog.Root>
  );
};

export default AlertDialog;
