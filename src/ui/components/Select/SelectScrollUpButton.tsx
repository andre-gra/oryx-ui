import React, { ForwardedRef } from 'react'
import classNames from 'classnames'
import * as SelectPrimitive from '@radix-ui/react-select'
import { SelectScrollUpButtonProps } from '@radix-ui/react-select'

export interface ISelectScrollUpButtonProps extends SelectScrollUpButtonProps {
  value? : string
  asChild?: boolean
}

const SelectScrollUpButton = React.forwardRef(({ children, className, ...props }: ISelectScrollUpButtonProps, forwardedRef: ForwardedRef<HTMLDivElement>) => (
  <SelectPrimitive.ScrollUpButton
    className={classNames(
      'flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default',
      className
    )}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </SelectPrimitive.ScrollUpButton>
))

export { SelectScrollUpButton }