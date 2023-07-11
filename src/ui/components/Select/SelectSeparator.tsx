import React, { ForwardedRef } from 'react'
import classNames from 'classnames'
import * as SelectPrimitive from '@radix-ui/react-select'
import { ISelectComponentProps } from '.'

export interface ISelectSeparatorProps extends Omit<ISelectComponentProps, 'children'> {
  value? : string
  asChild?: boolean
}

const SelectSeparator = React.forwardRef(({ className, ...props }: ISelectSeparatorProps, forwardedRef: ForwardedRef<HTMLDivElement>) => (
  <SelectPrimitive.Separator
    className={classNames(
      'h-[1px] bg-violet6 m-[5px]',
      className
    )}
    {...props}
    ref={forwardedRef}
  >
  </SelectPrimitive.Separator>
))

export { SelectSeparator }