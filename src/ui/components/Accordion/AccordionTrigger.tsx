import React, { ForwardedRef } from 'react'
import classNames from 'classnames'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { IAccordionComponentProps } from '.'
import { ChevronDownIcon } from '@radix-ui/react-icons'

export interface IAccordionTriggerProps extends IAccordionComponentProps {
  value? : string
}

const AccordionTrigger = React.forwardRef(({ children, className, ...props }: IAccordionTriggerProps, forwardedRef: ForwardedRef<HTMLButtonElement>) => (
  <AccordionPrimitive.Trigger
    className={classNames(
      'text-violet11 shadow-mauve6 hover:bg-mauve2 group flex h-[45px] flex-1 cursor-default items-center justify-between bg-white px-5 text-[15px] leading-none shadow-[0_1px_0] outline-none',
      className
    )}
    {...props}
    ref={forwardedRef}
  >
    {children}
    <ChevronDownIcon
      className="text-violet10 ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-180"
      aria-hidden
    />
  </AccordionPrimitive.Trigger>
))

export { AccordionTrigger }