import React, { ForwardedRef } from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import classnames from "classnames";
import { CaretDownIcon } from "@radix-ui/react-icons";
import { useTheme } from "../../themes/useTheme";

const NavigationMenuDemo = () => {
  const { theme } = useTheme();

  return (
    <NavigationMenu.Root
      className={classnames(
        theme,
        "relative z-[1] flex w-screen justify-center",
      )}
    >
      <NavigationMenu.List
        className={classnames(
          theme,
          "center shadow-blackA7 m-0 flex list-none rounded-[6px] bg-color3 p-1 shadow-[0_2px_10px]",
        )}
      >
        <NavigationMenu.Item>
          <NavigationMenu.Trigger
            className={classnames(
              theme,
              "text-color11 hover:bg-color4 focus:shadow-color7 group flex select-none items-center justify-between gap-[2px] rounded-[4px] px-3 py-2 text-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]",
            )}
          >
            Learn{" "}
            <CaretDownIcon
              className={classnames(
                theme,
                "text-color10 relative top-[1px] transition-transform duration-[250] ease-in group-data-[state=open]:-rotate-180",
              )}
              aria-hidden
            />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content
            className={classnames(
              theme,
              "data-[motion=from-start]:animate-enterFromLeft data-[motion=from-end]:animate-enterFromRight data-[motion=to-start]:animate-exitToLeft data-[motion=to-end]:animate-exitToRight absolute top-0 left-0 w-full sm:w-auto",
            )}
          >
            <ul
              className={classnames(
                theme,
                "one m-0 grid list-none gap-x-[10px] p-[22px] sm:w-[500px] sm:grid-cols-[0.75fr_1fr]",
              )}
            >
              <li className={classnames(theme, "row-span-3 grid")}>
                <NavigationMenu.Link asChild>
                  <a
                    className={classnames(
                      theme,
                      "focus:shadow-color7 from-purple-900 to-indigo-900 flex h-full w-full select-none flex-col justify-end rounded-[6px] bg-gradient-to-b p-[25px] no-underline outline-none focus:shadow-[0_0_0_2px]",
                    )}
                    href="/"
                  >
                    <svg
                      aria-hidden
                      width="38"
                      height="38"
                      viewBox="0 0 25 25"
                      fill="white"
                    >
                      <path d="M12 25C7.58173 25 4 21.4183 4 17C4 12.5817 7.58173 9 12 9V25Z"></path>
                      <path d="M12 0H4V8H12V0Z"></path>
                      <path d="M17 8C19.2091 8 21 6.20914 21 4C21 1.79086 19.2091 0 17 0C14.7909 0 13 1.79086 13 4C13 6.20914 14.7909 8 17 8Z"></path>
                    </svg>
                    <div
                      className={classnames(
                        theme,
                        "mt-4 mb-[7px] text-[18px] font-medium leading-[1.2] text-color12",
                      )}
                    >
                      Radix Primitives
                    </div>
                    <p
                      className={classnames(
                        theme,
                        "text-color4 text-[14px] leading-[1.3]",
                      )}
                    >
                      Unstyled, accessible components for React.
                    </p>
                  </a>
                </NavigationMenu.Link>
              </li>

              <ListItem
                theme={theme}
                href="https://stitches.dev/"
                title="Stitches"
              >
                CSS-in-JS with best-in-class developer experience.
              </ListItem>
              <ListItem theme={theme} href="/colors" title="Colors">
                Beautiful, thought-out palettes with auto dark mode.
              </ListItem>
              <ListItem
                theme={theme}
                href="https://icons.radix-ui.com/"
                title="Icons"
              >
                A crisp set of 15x15 icons, balanced and consistent.
              </ListItem>
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Trigger
            className={classnames(
              theme,
              "text-color11 hover:bg-color4 focus:shadow-color7 group flex select-none items-center justify-between gap-[2px] rounded-[4px] px-3 py-2 text-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]",
            )}
          >
            Overview{" "}
            <CaretDownIcon
              className={classnames(
                theme,
                "text-color10 relative top-[1px] transition-transform duration-[250] ease-in group-data-[state=open]:-rotate-180",
              )}
              aria-hidden
            />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content
            className={classnames(
              theme,
              "absolute top-0 left-0 w-full sm:w-auto",
            )}
          >
            <ul
              className={classnames(
                theme,
                "m-0 grid list-none gap-x-[10px] p-[22px] sm:w-[600px] sm:grid-flow-col sm:grid-rows-3",
              )}
            >
              <ListItem
                theme={theme}
                title="Introduction"
                href="/docs/primitives/overview/introduction"
              >
                Build high-quality, accessible design systems and web apps.
              </ListItem>
              <ListItem
                theme={theme}
                title="Getting started"
                href="/docs/primitives/overview/getting-started"
              >
                A quick tutorial to get you up and running with Radix
                Primitives.
              </ListItem>
              <ListItem
                theme={theme}
                title="Styling"
                href="/docs/primitives/guides/styling"
              >
                Unstyled and compatible with any styling solution.
              </ListItem>
              <ListItem
                theme={theme}
                title="Animation"
                href="/docs/primitives/guides/animation"
              >
                Use CSS keyframes or any animation library of your choice.
              </ListItem>
              <ListItem
                theme={theme}
                title="Accessibility"
                href="/docs/primitives/overview/accessibility"
              >
                Tested in a range of browsers and assistive technologies.
              </ListItem>
              <ListItem
                theme={theme}
                title="Releases"
                href="/docs/primitives/overview/releases"
              >
                Radix Primitives releases and their changelogs.
              </ListItem>
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link
            className={classnames(
              theme,
              "text-color11 hover:bg-color4 focus:shadow-color7 block select-none rounded-[4px] px-3 py-2 text-[15px] font-medium leading-none no-underline outline-none focus:shadow-[0_0_0_2px]",
            )}
            href="https://github.com/radix-ui"
          >
            Github
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Indicator
          className={classnames(
            theme,
            "data-[state=visible]:animate-fadeIn data-[state=hidden]:animate-fadeOut top-full z-[1] flex h-[10px] items-end justify-center overflow-hidden transition-[width,transform_250ms_ease]",
          )}
        >
          <div
            className={classnames(
              theme,
              "relative top-[70%] h-[10px] w-[10px] rotate-[45deg] rounded-tl-[2px] bg-color3",
            )}
          />
        </NavigationMenu.Indicator>
      </NavigationMenu.List>

      <div
        className={classnames(
          theme,
          "perspective-[2000px] absolute top-full left-0 flex w-full justify-center",
        )}
      >
        <NavigationMenu.Viewport
          className={classnames(
            theme,
            "data-[state=open]:animate-scaleIn data-[state=closed]:animate-scaleOut relative mt-[10px] h-[var(--radix-navigation-menu-viewport-height)] w-full origin-[top_center] overflow-hidden rounded-[6px] bg-color3 transition-[width,_height] duration-300 sm:w-[var(--radix-navigation-menu-viewport-width)]",
          )}
        />
      </div>
    </NavigationMenu.Root>
  );
};

export interface INavigationListItemProps {
  children?: React.ReactNode;
  className?: string;
  title: string;
  asChild?: boolean;
  href?: string;
  theme: string;
}

const ListItem = React.forwardRef(
  (
    { className, children, theme, title, ...props }: INavigationListItemProps,
    forwardedRef: ForwardedRef<HTMLAnchorElement>,
  ) => (
    <li>
      <NavigationMenu.Link asChild>
        <a
          className={classnames(
            theme,
            "focus:shadow-[0_0_0_2px] focus:shadow-color7 hover:bg-color4 block select-none rounded-[6px] p-3 text-[15px] leading-none no-underline outline-none transition-colors",
            className,
          )}
          {...props}
          ref={forwardedRef}
        >
          <div className="text-color12 mb-[5px] font-medium leading-[1.2]">
            {title}
          </div>
          <p className="text-color11 leading-[1.4]">{children}</p>
        </a>
      </NavigationMenu.Link>
    </li>
  ),
);

export default NavigationMenuDemo;
