import React, { ForwardedRef } from 'react'
import classNames from 'classnames'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { IAlertDialogComponentProps } from '.'

export interface IAlertDialogTriggerProps extends IAlertDialogComponentProps {
  value? : string
  asChild?: boolean
}

const AlertDialogTrigger = React.forwardRef(({ children, className, ...props }: IAlertDialogTriggerProps, forwardedRef: ForwardedRef<HTMLButtonElement>) => (
  <AlertDialogPrimitive.Trigger
    className={classNames(
      'text-violet11 hover:bg-mauve3 shadow-blackA7 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-white px-[15px] font-medium leading-none shadow-[0_2px_10px] outline-none focus:shadow-[0_0_0_2px] focus:shadow-black',
      className
    )}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </AlertDialogPrimitive.Trigger>
))

export { AlertDialogTrigger }