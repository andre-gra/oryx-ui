import React, { ForwardedRef } from 'react'
import classNames from 'classnames'
import * as SelectPrimitive from '@radix-ui/react-select'
import { SelectItemProps } from '@radix-ui/react-select'

export interface ISelectItemProps extends SelectItemProps {
  value : string
  asChild?: boolean
}

const SelectItem = React.forwardRef(({ children, className, ...props }: ISelectItemProps, forwardedRef: ForwardedRef<HTMLDivElement>) => (
  <SelectPrimitive.Item
    className={classNames(
      'text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1',
      className
    )}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </SelectPrimitive.Item>
))

export { SelectItem }