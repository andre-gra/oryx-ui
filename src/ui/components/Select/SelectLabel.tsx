import React, { ForwardedRef } from 'react'
import classNames from 'classnames'
import * as SelectPrimitive from '@radix-ui/react-select'
import { SelectLabelProps } from '@radix-ui/react-select'

export interface ISelectLabelProps extends SelectLabelProps {
  value? : string
  asChild?: boolean
}

const SelectLabel = React.forwardRef(({ children, className, ...props }: ISelectLabelProps, forwardedRef: ForwardedRef<HTMLDivElement>) => (
  <SelectPrimitive.Label
    className={classNames(
      'px-[25px] text-xs leading-[25px] text-mauve11',
      className
    )}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </SelectPrimitive.Label>
))

export { SelectLabel }