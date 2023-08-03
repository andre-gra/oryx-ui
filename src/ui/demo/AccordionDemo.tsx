import { useRef } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import classnames from "classnames";
import { useTheme } from "../../themes/useTheme";
import { useSize } from "../../themes/useSize";

type Items = { mainText: string; collapsibleText: string };
export interface AccordionProps {
  items: Items[];
}

const AccordionDemo = ({ ...props }: AccordionProps) => {
  const { theme } = useTheme();
  const { size } = useSize();

  const accordionRootRef = useRef<HTMLDivElement>(null);
  const accordionItemRef = useRef<Map<string, HTMLDivElement> | null>(null);
  const accordionHeaderRef = useRef<HTMLHeadingElement>(null);
  const accordionTriggerRef = useRef<HTMLButtonElement>(null);
  const accordionContentRef = useRef<HTMLDivElement>(null);

  function getMap() {
    if (!accordionItemRef.current) {
      // Initialize the Map on first usage.
      accordionItemRef.current = new Map();
    }
    return accordionItemRef.current;
  }

  const handleAccordionRootClick = () => {
    accordionRootRef.current?.focus();
  };

  const handleAccordionHeaderClick = () => {
    accordionHeaderRef.current?.focus();
  };

  const handleAccordionTriggerClick = (itemId: string) => {
    const map = getMap();
    const node = map.get(itemId);
    node?.classList.add("bg-blue-500");
  };

  const handleAccordionContentClick = () => {
    accordionContentRef.current?.classList.add("bg-blue-500");
  };

  return (
    <Accordion.Root
      className={classnames(
        theme,
        `accordion-root${size}`,
        "bg-color2 rounded-md shadow-[0_2px_10px] shadow-blackA7",
      )}
      ref={accordionRootRef}
      type={props.items.length > 1 ? "multiple" : "single"}
    >
      {props.items.map((item) => {
        return (
          <Accordion.Item
            className={classnames(
              theme,
              "focus-within:shadow-color9 mt-px overflow-hidden first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:shadow-[0_0_0_2px]",
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
            <Accordion.Header
              className={classnames("flex")}
              ref={accordionHeaderRef}
            >
              <Accordion.Trigger
                className={classnames(
                  theme,
                  `accordion-trigger${size}`,
                  "text-color11 shadow-color9 hover:bg-color4 group flex flex-1 cursor-default items-center justify-between bg-color3 px-5 leading-none shadow-[0_1px_0] outline-none",
                )}
                ref={accordionTriggerRef}
              >
                {item.mainText}
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content
              className={classnames(
                theme,
                `accordion-content${size}`,
                "text-color12 bg-color2 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden",
              )}
              ref={accordionContentRef}
              onClick={() => handleAccordionTriggerClick("1")}
            >
              <div className="px-5 animate-fade-up">{item.collapsibleText}</div>
            </Accordion.Content>
          </Accordion.Item>
        );
      })}
    </Accordion.Root>
  );
};

export default AccordionDemo;
