import React, { ForwardedRef } from 'react'
import classNames from 'classnames'
import * as SelectPrimitive from '@radix-ui/react-select'
import { SelectIconProps } from '@radix-ui/react-select'

export interface ISelectIconProps extends SelectIconProps {
  todo?: string
}

const SelectIcon = React.forwardRef(({ children, className, ...props }: ISelectIconProps, forwardedRef: ForwardedRef<HTMLSpanElement>) => (
  <SelectPrimitive.Icon
    className={classNames(
      'select-icon',
      className
    )}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </SelectPrimitive.Icon>
))

export { SelectIcon }