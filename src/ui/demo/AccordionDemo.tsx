import { useRef } from 'react'
import * as Accordion from '../components/Accordion'

const AccordionDemo = () => {

  const accordionRootRef = useRef<HTMLDivElement>(null)
  const accordionItemRef = useRef<Map<string,HTMLDivElement> | null>(null)
  const accordionHeaderRef = useRef<HTMLHeadingElement>(null)
  const accordionTriggerRef = useRef<HTMLButtonElement>(null)
  const accordionContentRef = useRef<HTMLDivElement>(null)

  function getMap() {
    if (!accordionItemRef.current) {
      // Initialize the Map on first usage.
      accordionItemRef.current = new Map()
    }
    return accordionItemRef.current
  }

  const handleAccordionRootClick = () => {
    accordionRootRef.current?.focus()
  }

  const handleAccordionHeaderClick = () => {
    accordionHeaderRef.current?.focus()
  }

  const handleAccordionTriggerClick = (itemId: string) => {
    const map = getMap()
    const node = map.get(itemId)
    node?.classList.add('bg-blue-500')
  }

  const handleAccordionContentClick = () => {
    accordionContentRef.current?.classList.add('bg-blue-500')
  }

  return (
    <Accordion.AccordionRoot
      ref={accordionRootRef}
      type="multiple"
    >
      <Accordion.AccordionItem id={'1'} ref={(node) => {
        const map = getMap()
        if (node) {
          map.set('1', node)
        } else {
          map.delete('1')
        }
      }} value="item-1">
        <Accordion.AccordionHeader ref={accordionHeaderRef}>
          <Accordion.AccordionTrigger ref={accordionTriggerRef}>Is it accessible?</Accordion.AccordionTrigger>
        </Accordion.AccordionHeader>
        <Accordion.AccordionContent ref={accordionContentRef} onClick={() => handleAccordionTriggerClick('1')}>
          Yes. It adheres to the WAI-ARIA design pattern.
        </Accordion.AccordionContent>
      </Accordion.AccordionItem>

      <Accordion.AccordionItem id={'2'} ref={(node) => {
        const map = getMap()
        if (node) {
          map.set('2', node)
        } else {
          map.delete('2')
        }
      }} value="item-2">
        <Accordion.AccordionHeader ref={accordionHeaderRef}>
          <Accordion.AccordionTrigger ref={accordionTriggerRef}>Is it unstyled?</Accordion.AccordionTrigger>
        </Accordion.AccordionHeader>
        <Accordion.AccordionContent ref={accordionContentRef} onClick={() => handleAccordionTriggerClick('2')}>
          Yes. It's unstyled by default, giving you freedom over the look and feel.
        </Accordion.AccordionContent>
      </Accordion.AccordionItem>

    </Accordion.AccordionRoot>
  )
}

export default AccordionDemo