import * as AccordionPrimitive from "@radix-ui/react-accordion"

/* -------------------------------------------------------------------------------------------------
 * Accordion Types
 * ----------------------------------------------------------------------------------------------- */
export interface IAccordionComponentProps {
  children: React.ReactNode;
  className?: string,
}

/* -------------------------------------------------------------------------------------------------
 * Accordion Components
 * ----------------------------------------------------------------------------------------------- */
export { AccordionRoot } from './AccordionRoot'
export { AccordionContent } from './AccordionContent'
export { AccordionHeader } from './AccordionHeader'
export { AccordionItem } from './AccordionItem'
export { AccordionTrigger } from './AccordionTrigger'

