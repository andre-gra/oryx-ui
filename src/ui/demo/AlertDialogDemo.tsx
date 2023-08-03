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
          "text-color11 hover:bg-color4 shadow-blackA7 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-color3 px-[15px] font-medium leading-none shadow-[0_2px_10px] outline-none focus:shadow-[0_0_0_2px] focus:shadow-color10",
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
            "data-[state=open]:animate-contentShow z-10 fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-color2 p-[25px] shadow-color9 focus:outline-none",
          )}
        >
          <AlertDialog.Title
            className={classnames("text-color12 m-0 text-[17px] font-medium")}
          >
            Are you absolutely sure?
          </AlertDialog.Title>
          <AlertDialog.Description
            className={classnames(
              "text-color11 mt-4 mb-5 text-[15px] leading-normal",
            )}
          >
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialog.Description>
          <div className="flex justify-end gap-[25px]">
            <AlertDialog.Cancel
              asChild
              className={classnames(
                "text-color11 bg-color4 hover:bg-color5 focus:shadow-color7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]",
              )}
            >
              <button>Cancel</button>
            </AlertDialog.Cancel>
            <AlertDialog.Action
              asChild
              className={classnames(
                "text-error11 bg-error4 hover:bg-error5 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]",
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
