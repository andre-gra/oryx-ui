import React, { ForwardedRef } from 'react'
import classNames from 'classnames'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { IAlertDialogComponentProps } from '.'

export interface IAlertDialogCancelProps extends IAlertDialogComponentProps {
  value? : string
  asChild? : boolean
}

const AlertDialogCancel = React.forwardRef(({ children, className, ...props }: IAlertDialogCancelProps, forwardedRef: ForwardedRef<HTMLButtonElement>) => (
  <AlertDialogPrimitive.Cancel
    className={classNames(
      'text-mauve11 bg-mauve4 hover:bg-mauve5 focus:shadow-mauve7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]',
      className
    )}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </AlertDialogPrimitive.Cancel>
))

export { AlertDialogCancel }