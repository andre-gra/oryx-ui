import React, { ForwardedRef } from 'react'
import classNames from 'classnames'
import * as SelectPrimitive from '@radix-ui/react-select'
import { SelectTriggerProps as TriggerProps } from '@radix-ui/react-select'

type BackgroundColor = 'bg-mauve11' | 'bg-mauve3' | 'bg-mauve4' | 'bg-red6'
type TextColor = 'text-mauve11' | 'text-mauve3' | 'text-orange9' | 'text-blue10'
type Animation = 'rotate-x' | 'rotate-y'
type Size = 'sm' | 'base' | 'lg'

export interface ISelectTriggerProps extends TriggerProps {
  size?: Size
  background?: BackgroundColor
  text?: TextColor
  animation?: Animation
}

const SelectTrigger = React.forwardRef(({ children, className, ...props }: ISelectTriggerProps, forwardedRef: ForwardedRef<HTMLButtonElement>) => (
  <SelectPrimitive.Trigger
    className={classNames(
      `select-trigger${props.size ? `-${props.size}` : ''}`,
      className,
      props.background ? props.background : 'bg-white',
      props.text ? `data-[placeholder]:${props.text}` : 'data-[placeholder]:text-violet11',
      props.animation && `animate-${props.animation} animate-infinite animate-duration-[3000ms] animate-ease-linear`,
    )}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </SelectPrimitive.Trigger>
))

export { SelectTrigger }