import React, { ForwardedRef } from 'react'
import classNames from 'classnames'
import * as SelectPrimitive from '@radix-ui/react-select'
import { ISelectComponentProps } from '.'

export interface ISelectViewportProps extends ISelectComponentProps {
  value? : string
  asChild?: boolean
}

const SelectViewport = React.forwardRef(({ children, className, ...props }: ISelectViewportProps, forwardedRef: ForwardedRef<HTMLDivElement>) => (
  <SelectPrimitive.Viewport
    className={classNames(
      'p-[5px]',
      className
    )}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </SelectPrimitive.Viewport>
))

export { SelectViewport }