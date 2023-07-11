import React, { ForwardedRef } from 'react'
import classNames from 'classnames'
import * as SelectPrimitive from '@radix-ui/react-select'
import { ISelectComponentProps } from '.'

export interface ISelectGroupProps extends ISelectComponentProps {
  value? : string
  asChild?: boolean
}

const SelectGroup = React.forwardRef(({ children, className, ...props }: ISelectGroupProps, forwardedRef: ForwardedRef<HTMLDivElement>) => (
  <SelectPrimitive.Group
    className={classNames(
      'text-violet11',
      className
    )}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </SelectPrimitive.Group>
))

export { SelectGroup }