import React, { ForwardedRef } from 'react'
import classNames from 'classnames'
import * as SelectPrimitive from '@radix-ui/react-select'
import { SelectTriggerProps as TriggerProps } from '@radix-ui/react-select'

type Background = 'bg-mauve11' | 'bg-mauve3' | 'bg-mauve4' | 'bg-red6'

export interface ISelectTriggerProps extends TriggerProps {
  backgroundColor?: Background
}

const SelectTrigger = React.forwardRef(({ children, className, ...props }: ISelectTriggerProps, forwardedRef: ForwardedRef<HTMLButtonElement>) => (
  <SelectPrimitive.Trigger
    className={classNames(
      `inline-flex items-center justify-center rounded px-[15px] text-[13px] leading-none h-[35px] gap-[5px] text-violet11 shadow-[0_2px_10px] shadow-black/10 hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-violet9 outline-none`,
      className,
      props.backgroundColor ? props.backgroundColor : 'bg-white'
    )}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </SelectPrimitive.Trigger>
))

export { SelectTrigger }