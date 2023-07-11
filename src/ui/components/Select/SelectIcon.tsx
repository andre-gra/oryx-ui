import React, { ForwardedRef } from 'react'
import classNames from 'classnames'
import * as SelectPrimitive from '@radix-ui/react-select'
import { ISelectComponentProps } from '.'

export interface ISelectIconProps extends ISelectComponentProps {
  value? : string
  asChild?: boolean
}

const SelectIcon = React.forwardRef(({ children, className, ...props }: ISelectIconProps, forwardedRef: ForwardedRef<HTMLSpanElement>) => (
  <SelectPrimitive.Icon
    className={classNames(
      'text-violet11',
      className
    )}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </SelectPrimitive.Icon>
))

export { SelectIcon }