import React, { ForwardedRef } from 'react'
import classNames from 'classnames'
import * as SelectPrimitive from '@radix-ui/react-select'
import { SelectItemIndicatorProps } from '@radix-ui/react-select'

export interface ISelectItemIndicatorProps extends SelectItemIndicatorProps {
  value? : string
  asChild?: boolean
}

const SelectItemIndicator = React.forwardRef(({ children, className, ...props }: ISelectItemIndicatorProps, forwardedRef: ForwardedRef<HTMLSpanElement>) => (
  <SelectPrimitive.ItemIndicator
    className={classNames(
      'absolute left-0 w-[25px] inline-flex items-center justify-center',
      className
    )}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </SelectPrimitive.ItemIndicator>
))

export { SelectItemIndicator }