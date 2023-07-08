import React, { ForwardedRef } from 'react'
import classNames from 'classnames'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { IAccordionComponentProps } from '.'

export interface IAccordionHeaderProps extends IAccordionComponentProps {
  value?: string
}

const AccordionHeader = React.forwardRef(({ children, className, ...props }: IAccordionHeaderProps, forwardedRef: ForwardedRef<HTMLHeadingElement>) => (
  <AccordionPrimitive.Header className={classNames(
    'flex',
    className
  )}
    {...props}
    ref={forwardedRef}>
    {children}
  </AccordionPrimitive.Header>
))

export { AccordionHeader }