import React, { ForwardedRef } from 'react'
import classNames from 'classnames'
import * as SelectPrimitive from '@radix-ui/react-select'
import { ISelectComponentProps } from '.'

export interface ISelectContentProps extends ISelectComponentProps {
  value? : string
  asChild?: boolean
}

const SelectContent = React.forwardRef(({ children, className, ...props }: ISelectContentProps, forwardedRef: ForwardedRef<HTMLDivElement>) => (
  <SelectPrimitive.Content
    className={classNames(
      'overflow-hidden bg-white rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]',
      className
    )}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </SelectPrimitive.Content>
))

export { SelectContent }