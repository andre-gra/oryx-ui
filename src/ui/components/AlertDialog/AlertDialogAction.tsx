import React, { ForwardedRef } from 'react'
import classNames from 'classnames'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { IAlertDialogComponentProps } from '.'

export interface IAlertDialogActionProps extends IAlertDialogComponentProps {
  value? : string
  asChild? : boolean
}

const AlertDialogAction = React.forwardRef(({ children, className, ...props }: IAlertDialogActionProps, forwardedRef: ForwardedRef<HTMLButtonElement>) => (
  <AlertDialogPrimitive.Action
    className={classNames(
      'text-red11 bg-red4 hover:bg-red5 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]',
      className
    )}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </AlertDialogPrimitive.Action>
))

export { AlertDialogAction }