import React, { ForwardedRef } from 'react'
import classNames from 'classnames'
import * as SelectPrimitive from '@radix-ui/react-select'
import { ISelectComponentProps } from '.'

export interface ISelectValueProps extends Omit<ISelectComponentProps, 'children'> {
  asChild?: boolean
  children? : string
  placeholder?: string
}

const SelectValue = React.forwardRef(({ children, className, ...props }: ISelectValueProps, forwardedRef: ForwardedRef<HTMLSpanElement>) => (
  <SelectPrimitive.Value
    className={classNames(
      'text-violet11 hover:bg-mauve3 shadow-blackA7 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-white px-[15px] font-medium leading-none shadow-[0_2px_10px] outline-none focus:shadow-[0_0_0_2px] focus:shadow-black',
      className
    )}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </SelectPrimitive.Value>
))

export { SelectValue }