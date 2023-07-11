import React, { ForwardedRef } from 'react'
import classNames from 'classnames'
import * as SelectPrimitive from '@radix-ui/react-select'
import { ISelectComponentProps } from '.'

export interface ISelectScrollDownButtonProps extends ISelectComponentProps {
  value? : string
  asChild?: boolean
}

const SelectScrollDownButton = React.forwardRef(({ children, className, ...props }: ISelectScrollDownButtonProps, forwardedRef: ForwardedRef<HTMLDivElement>) => (
  <SelectPrimitive.ScrollDownButton
    className={classNames(
      'flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default',
      className
    )}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </SelectPrimitive.ScrollDownButton>
))

export { SelectScrollDownButton }