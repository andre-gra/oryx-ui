import React, { ForwardedRef } from 'react'
import classNames from 'classnames'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { IAccordionComponentProps } from '.'

interface IAccordionSingleRootProps extends IAccordionComponentProps {
  type: 'single'
  defaultValue?: string
}

interface IAccordionMultipleRootProps extends IAccordionComponentProps {
  type: 'multiple'
  defaultValue?: string[]
}

type TAccordionUnion = IAccordionSingleRootProps | IAccordionMultipleRootProps

export type TAccordionRootProps = TAccordionUnion & {
  defaultValue?: string
  collapsible?: boolean
  disabled?: boolean
}

const AccordionRoot = React.forwardRef(({ children, className, ...props }: TAccordionRootProps, forwardedRef: ForwardedRef<HTMLDivElement>) => (
  <AccordionPrimitive.Root className={classNames(
    'bg-mauve6 w-[300px] rounded-md shadow-[0_2px_10px] shadow-violet10',
    className
  )}
    {...props}
    ref={forwardedRef}>
    {children}
  </AccordionPrimitive.Root>
))

export { AccordionRoot }