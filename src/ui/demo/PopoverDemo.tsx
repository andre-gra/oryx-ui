import * as Popover from "@radix-ui/react-popover";
import { MixerHorizontalIcon, Cross2Icon } from "@radix-ui/react-icons";
import classnames from "classnames";
import { useTheme } from "../../themes/useTheme";

const PopoverDemo = () => {
  const { theme } = useTheme();

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className={classnames(
            theme,
            "rounded-full w-[35px] h-[35px] inline-flex items-center justify-center text-color11 bg-color3 shadow-[0_2px_10px] shadow-blackA7 hover:bg-color4 focus:shadow-[0_0_0_2px] focus:shadow-black cursor-default outline-none",
          )}
          aria-label="Update dimensions"
        >
          <MixerHorizontalIcon />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className={classnames(
            theme,
            "rounded p-5 w-[260px] bg-color3 shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2),0_0_0_2px_hsla(206,22%,7%,.2)] will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade",
          )}
          sideOffset={5}
        >
          <div className={classnames(theme, "flex flex-col gap-2.5")}>
            <p
              className={classnames(
                theme,
                "text-color12 text-[15px] leading-[19px] font-medium mb-2.5",
              )}
            >
              Dimensions
            </p>
            <fieldset className={classnames(theme, "flex gap-5 items-center")}>
              <label
                className={classnames(
                  theme,
                  "text-[13px] text-color11 w-[75px]",
                )}
                htmlFor="width"
              >
                Width
              </label>
              <input
                className={classnames(
                  theme,
                  "w-full inline-flex items-center justify-center flex-1 rounded px-2.5 text-[13px] leading-none text-color11 shadow-[0_0_0_1px] shadow-color7 h-[25px] focus:shadow-[0_0_0_2px] focus:shadow-color8 outline-none",
                )}
                id="width"
                defaultValue="100%"
              />
            </fieldset>
            <fieldset className={classnames(theme, "flex gap-5 items-center")}>
              <label
                className={classnames(
                  theme,
                  "text-[13px] text-color11 w-[75px]",
                )}
                htmlFor="maxWidth"
              >
                Max. width
              </label>
              <input
                className={classnames(
                  theme,
                  "w-full inline-flex items-center justify-center flex-1 rounded px-2.5 text-[13px] leading-none text-color11 shadow-[0_0_0_1px] shadow-color7 h-[25px] focus:shadow-[0_0_0_2px] focus:shadow-color8 outline-none",
                )}
                id="maxWidth"
                defaultValue="300px"
              />
            </fieldset>
            <fieldset className={classnames(theme, "flex gap-5 items-center")}>
              <label
                className={classnames(
                  theme,
                  "text-[13px] text-color11 w-[75px]",
                )}
                htmlFor="height"
              >
                Height
              </label>
              <input
                className={classnames(
                  theme,
                  "w-full inline-flex items-center justify-center flex-1 rounded px-2.5 text-[13px] leading-none text-color11 shadow-[0_0_0_1px] shadow-color7 h-[25px] focus:shadow-[0_0_0_2px] focus:shadow-color8 outline-none",
                )}
                id="height"
                defaultValue="25px"
              />
            </fieldset>
            <fieldset className={classnames(theme, "flex gap-5 items-center")}>
              <label
                className={classnames(
                  theme,
                  "text-[13px] text-color11 w-[75px]",
                )}
                htmlFor="maxHeight"
              >
                Max. height
              </label>
              <input
                className={classnames(
                  theme,
                  "w-full inline-flex items-center justify-center flex-1 rounded px-2.5 text-[13px] leading-none text-color11 shadow-[0_0_0_1px] shadow-color7 h-[25px] focus:shadow-[0_0_0_2px] focus:shadow-color8 outline-none",
                )}
                id="maxHeight"
                defaultValue="none"
              />
            </fieldset>
          </div>
          <Popover.Close
            className={classnames(
              theme,
              "rounded-full h-[25px] w-[25px] inline-flex items-center justify-center text-color11 absolute top-[5px] right-[5px] hover:bg-color4 focus:shadow-[0_0_0_2px] focus:shadow-color7 outline-none cursor-default",
            )}
            aria-label="Close"
          >
            <Cross2Icon />
          </Popover.Close>
          <Popover.Arrow className={classnames(theme, "fill-white")} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default PopoverDemo;
