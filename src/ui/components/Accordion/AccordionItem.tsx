import React, { ForwardedRef } from 'react'
import classNames from 'classnames'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { IAccordionComponentProps } from '.'

export interface IAccordionItemProps extends IAccordionComponentProps {
  value: string
  id: string
}

const AccordionItem = React.forwardRef(({ children, className, ...props }: IAccordionItemProps, forwardedRef: ForwardedRef<HTMLDivElement>) => (
  <AccordionPrimitive.Item
    className={classNames(
      'focus-within:shadow-mauve12 mt-px overflow-hidden first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-10 focus-within:shadow-[0_0_0_2px]',
      className
    )}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </AccordionPrimitive.Item>
))

export { AccordionItem }