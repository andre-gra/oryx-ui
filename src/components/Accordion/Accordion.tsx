import { useRef } from "react";
import * as RadixAccordion from "@radix-ui/react-accordion";
import classnames from "classnames";
import { useTheme } from "../../theme";
import { useSize } from "../../theme";

/**
 * Item structure for Accordion
 */
export interface AccordionItem {
  /** Header text displayed on the trigger */
  mainText: string;
  /** Content revealed when expanded */
  collapsibleText: string;
}

/**
 * Props for the Accordion component
 */
export interface AccordionProps {
  /** Array of accordion items */
  items: AccordionItem[];
  /** Additional className for the root element */
  className?: string;
}

/**
 * An accessible accordion component for expanding/collapsing content sections.
 *
 * @example
 * ```tsx
 * <Accordion items={[
 *   { mainText: "Section 1", collapsibleText: "Content 1" },
 *   { mainText: "Section 2", collapsibleText: "Content 2" }
 * ]} />
 * ```
 */
export const Accordion = ({ items, className }: AccordionProps) => {
  const { theme } = useTheme();
  const { size } = useSize();

  const accordionRootRef = useRef<HTMLDivElement>(null);
  const accordionItemRef = useRef<Map<string, HTMLDivElement> | null>(null);

  function getMap() {
    if (!accordionItemRef.current) {
      accordionItemRef.current = new Map();
    }
    return accordionItemRef.current;
  }

  return (
    <RadixAccordion.Root
      className={classnames(
        theme,
        `accordion-root${size}`,
        "bg-color2 shadow-[0_2px_10px] shadow-blackA7 max-w-fit max-h-fit",
        className,
      )}
      ref={accordionRootRef}
      type={items.length > 1 ? "multiple" : "single"}
    >
      {items.map((item) => (
        <RadixAccordion.Item
          className={classnames(
            theme,
            "focus-within:shadow-color9 mt-px overflow-hidden first:mt-0 focus-within:relative focus-within:shadow-[0_0_0_2px]",
          )}
          key={item.mainText}
          id={item.mainText}
          ref={(node) => {
            const map = getMap();
            if (node) {
              map.set(item.mainText, node);
            } else {
              map.delete(item.mainText);
            }
          }}
          value={item.mainText}
        >
          <RadixAccordion.Header className={classnames("flex")}>
            <RadixAccordion.Trigger
              className={classnames(
                theme,
                `accordion-trigger${size}`,
                "text-color11 shadow-color9 hover:bg-color4 group flex flex-1 cursor-default items-center justify-between bg-color3 px-5 leading-none shadow-[0_1px_0] outline-none",
              )}
            >
              {item.mainText}
            </RadixAccordion.Trigger>
          </RadixAccordion.Header>
          <RadixAccordion.Content
            className={classnames(
              theme,
              `accordion-content${size}`,
              "text-color12 bg-color2 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden",
            )}
          >
            <div className={classnames(`accordion-collapsibleText${size}`, "px-5 animate-fade-up")}>
              {item.collapsibleText}
            </div>
          </RadixAccordion.Content>
        </RadixAccordion.Item>
      ))}
    </RadixAccordion.Root>
  );
};

export default Accordion;
