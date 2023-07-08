import React, { ForwardedRef } from 'react'
import classNames from 'classnames'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { IAccordionComponentProps } from '.'

export interface IAccordionContentProps extends IAccordionComponentProps {
  value?: string
  onClick?: () => void
}

const AccordionContent = React.forwardRef(({ children, className, ...props }: IAccordionContentProps, forwardedRef: ForwardedRef<HTMLDivElement>) => (
  <AccordionPrimitive.Content
    className={classNames(
      'text-mauve11 bg-mauve2 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden text-[15px]',
      className
    )}
    {...props}
    ref={forwardedRef}
  >
    <div className="py-[15px] px-5 animate-fade-up">{children}</div>
  </AccordionPrimitive.Content>
))

export { AccordionContent }