import React, { ForwardedRef } from 'react'
import classNames from 'classnames'
import * as SelectPrimitive from '@radix-ui/react-select'
import { SelectItemTextProps } from '@radix-ui/react-select'

export interface ISelectItemTextProps extends SelectItemTextProps {
  value? : string
  asChild?: boolean
}

const SelectItemText = React.forwardRef(({ children, className, ...props }: ISelectItemTextProps, forwardedRef: ForwardedRef<HTMLSpanElement>) => (
  <SelectPrimitive.ItemText
    className={classNames(
      'text-violet11',
      className
    )}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </SelectPrimitive.ItemText>
))

export { SelectItemText }