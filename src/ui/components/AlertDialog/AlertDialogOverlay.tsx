import React, { ForwardedRef } from 'react'
import classNames from 'classnames'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { IAlertDialogComponentProps } from '.'

export interface IAlertDialogOverlayProps extends Omit<IAlertDialogComponentProps, 'children'> {
  children?: React.ReactNode
}

const AlertDialogOverlay = React.forwardRef(({ children, className, ...props }: IAlertDialogOverlayProps, forwardedRef: ForwardedRef<HTMLDivElement>) => (
  <AlertDialogPrimitive.Overlay
    className={classNames(
      'bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0',
      className
    )}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </AlertDialogPrimitive.Overlay>
))

export { AlertDialogOverlay }