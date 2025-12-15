import React, { ForwardedRef } from "react";
import * as RadixNavigationMenu from "@radix-ui/react-navigation-menu";
import classnames from "classnames";
import { CaretDownIcon } from "@radix-ui/react-icons";
import { useTheme } from "../../theme";
import { useSize } from "../../theme";

/**
 * Navigation menu item content
 */
export interface NavigationMenuItem {
  /** Item display type: "card" for featured, "text" for simple */
  type: "card" | "text";
  /** Item title */
  title: string;
  /** Link URL */
  href: string;
  /** Description text */
  text: string;
}

/**
 * Navigation menu section
 */
export interface NavigationMenuSection {
  /** Items in this section (omit for simple link) */
  item?: NavigationMenuItem[];
  /** Section title */
  title: string;
  /** Direct link href (for sections without dropdown) */
  href?: string;
}

/**
 * Props for the NavigationMenu component
 */
export interface NavigationMenuProps {
  /** Menu sections */
  items: NavigationMenuSection[];
  /** Additional className */
  className?: string;
}

/**
 * A responsive navigation menu with dropdowns and featured items.
 *
 * @example
 * ```tsx
 * <NavigationMenu items={[
 *   {
 *     title: "Products",
 *     item: [
 *       { type: "card", title: "Featured", href: "/", text: "Our main product" },
 *       { type: "text", title: "Other", href: "/other", text: "Description" }
 *     ]
 *   },
 *   { title: "About", href: "/about" }
 * ]} />
 * ```
 */
export const NavigationMenu = ({ items, className }: NavigationMenuProps) => {
  const { theme } = useTheme();
  const { size } = useSize();

  return (
    <RadixNavigationMenu.Root
      className={classnames(theme, "relative flex w-full justify-center z-50", className)}
    >
      <RadixNavigationMenu.List
        className={classnames(
          theme,
          `navigation-menu-list${size}`,
          "center shadow-blackA7 m-0 flex list-none bg-color3 shadow-[0_2px_10px]",
        )}
      >
        {items.map((menuItem, index) => (
          <RadixNavigationMenu.Item key={`${menuItem.title}-${index}`}>
            {menuItem.item ? (
              <>
                <RadixNavigationMenu.Trigger
                  className={classnames(
                    theme,
                    `navigation-menu-trigger${size}`,
                    "text-color11 hover:bg-color4 focus:shadow-color7 group flex select-none items-center justify-between font-medium leading-none outline-none focus:shadow-[0_0_0_2px]",
                  )}
                >
                  {menuItem.title}
                  <CaretDownIcon
                    className={classnames(
                      theme,
                      "text-color10 relative transition-transform duration-[250] ease-in group-data-[state=open]:-rotate-180",
                    )}
                    aria-hidden
                  />
                </RadixNavigationMenu.Trigger>
                <RadixNavigationMenu.Content
                  className={classnames(
                    theme,
                    `navigation-menu-content${size}`,
                    "data-[motion=from-start]:animate-enterFromLeft data-[motion=from-end]:animate-enterFromRight data-[motion=to-start]:animate-exitToLeft data-[motion=to-end]:animate-exitToRight absolute top-0 left-0 w-full sm:w-auto",
                  )}
                >
                  <ul
                    className={classnames(
                      theme,
                      "one m-0 grid list-none sm:grid-cols-[0.75fr_1fr]",
                    )}
                  >
                    {menuItem.item.map((item, idx) => (
                      <ListItem
                        key={`${item.title}-${idx}`}
                        type={item.type}
                        theme={theme}
                        href={item.href}
                        title={item.title}
                        size={size}
                      >
                        {item.text}
                      </ListItem>
                    ))}
                  </ul>
                </RadixNavigationMenu.Content>
              </>
            ) : (
              <RadixNavigationMenu.Link
                className={classnames(
                  `navigation-menu-simple-link${size}`,
                  "text-color11 hover:bg-color4 focus:shadow-color7 block select-none font-medium leading-none no-underline outline-none focus:shadow-[0_0_0_2px]",
                )}
                href={menuItem.href}
              >
                {menuItem.title}
              </RadixNavigationMenu.Link>
            )}
          </RadixNavigationMenu.Item>
        ))}

        <RadixNavigationMenu.Indicator
          className={classnames(
            theme,
            `navigation-menu-indicator${size}`,
            "data-[state=visible]:animate-fadeIn data-[state=hidden]:animate-fadeOut top-full z-10 flex items-end justify-center overflow-hidden transition-[width,transform_250ms_ease]",
          )}
        >
          <div className={classnames(theme, "relative bg-color3")} />
        </RadixNavigationMenu.Indicator>
      </RadixNavigationMenu.List>

      <div
        className={classnames(
          theme,
          "perspective-[2000px] absolute top-full left-0 flex w-fit justify-center",
        )}
      >
        <RadixNavigationMenu.Viewport
          className={classnames(
            theme,
            `navigation-menu-viewport${size}`,
            "data-[state=open]:animate-scaleIn data-[state=closed]:animate-scaleOut relative h-[var(--radix-navigation-menu-viewport-height)] w-full origin-[top_center] overflow-hidden bg-color3 transition-[width,_height] duration-300 sm:w-[var(--radix-navigation-menu-viewport-width)]",
          )}
        />
      </div>
    </RadixNavigationMenu.Root>
  );
};

interface ListItemProps {
  children?: React.ReactNode;
  className?: string;
  title: string;
  href?: string;
  theme: string;
  type: "card" | "text";
  size: string;
}

const ListItem = React.forwardRef(
  (
    { className, children, theme, title, type, size, ...props }: ListItemProps,
    forwardedRef: ForwardedRef<HTMLAnchorElement>,
  ) => (
    <li className={classnames(theme, type === "card" && "row-span-3 grid")}>
      <RadixNavigationMenu.Link asChild>
        <a
          className={classnames(
            theme,
            `navigation-menu-link${size}`,
            type === "card"
              ? "card-nav focus:shadow-color7 bg-color7 flex h-full w-full select-none flex-col justify-end no-underline outline-none focus:shadow-[0_0_0_2px]"
              : "text-nav focus:shadow-[0_0_0_2px] focus:shadow-color7 hover:bg-color4 block select-none leading-none no-underline outline-none transition-colors",
            className,
          )}
          {...props}
          ref={forwardedRef}
        >
          {type === "card" && (
            <svg
              aria-hidden
              width="38"
              height="38"
              viewBox="0 0 25 25"
              fill="white"
              className="my-4"
            >
              <path d="M12 25C7.58173 25 4 21.4183 4 17C4 12.5817 7.58173 9 12 9V25Z" />
              <path d="M12 0H4V8H12V0Z" />
              <path d="M17 8C19.2091 8 21 6.20914 21 4C21 1.79086 19.2091 0 17 0C14.7909 0 13 1.79086 13 4C13 6.20914 14.7909 8 17 8Z" />
            </svg>
          )}
          <div className="text-color12 font-medium leading-[1.2]">{title}</div>
          <p className="text-color11 leading-[1.4]">{children}</p>
        </a>
      </RadixNavigationMenu.Link>
    </li>
  ),
);

ListItem.displayName = "ListItem";

export default NavigationMenu;
