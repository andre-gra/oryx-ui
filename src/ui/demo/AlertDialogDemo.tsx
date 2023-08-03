import * as AlertDialog from "@radix-ui/react-alert-dialog";
import classnames from "classnames";
import { useTheme } from "../../themes/useTheme";
import { useSize } from "../../themes/useSize";

const AlertDialogDemo = () => {
  const { theme } = useTheme();
  const { size } = useSize();

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger
        asChild
        className={classnames(
          theme,
          `alertdialog-trigger${size}`,
          "text-color11 hover:bg-color4 shadow-blackA7 inline-flex items-center justify-center rounded bg-color3 font-medium leading-none shadow-[0_2px_10px] outline-none focus:shadow-[0_0_0_2px] focus:shadow-color10",
        )}
      >
        <button>Delete account</button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          className={classnames(
            theme,
            "bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0",
          )}
        />
        <AlertDialog.Content
          className={classnames(
            theme,
            `alertdialog-content${size}`,
            "data-[state=open]:animate-contentShow z-10 fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-md bg-color2 shadow-color9 focus:outline-none",
          )}
        >
          <AlertDialog.Title
            className={classnames(
              `alertdialog-title${size}`,
              "text-color12 m-0 font-medium",
            )}
          >
            Are you absolutely sure?
          </AlertDialog.Title>
          <AlertDialog.Description
            className={classnames(
              `alertdialog-description${size}`,
              "text-color11 mt-4 mb-5 leading-normal",
            )}
          >
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialog.Description>
          <div
            className={classnames(
              `alertdialog-actions${size}`,
              "flex justify-end",
            )}
          >
            <AlertDialog.Cancel
              asChild
              className={classnames(
                `alertdialog-cancel${size}`,
                "text-color11 bg-color4 hover:bg-color5 focus:shadow-color7 inline-flex items-center justify-center rounded font-medium leading-none outline-none focus:shadow-[0_0_0_2px]",
              )}
            >
              <button>Cancel</button>
            </AlertDialog.Cancel>
            <AlertDialog.Action
              asChild
              className={classnames(
                `alertdialog-action${size}`,
                "text-error11 bg-error4 hover:bg-error5 focus:shadow-red7 inline-flex items-center justify-center rounded font-medium leading-none outline-none focus:shadow-[0_0_0_2px]",
              )}
            >
              <button>Yes, delete account</button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default AlertDialogDemo;
