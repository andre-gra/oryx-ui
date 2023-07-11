import React, { ForwardedRef } from 'react'
import classNames from 'classnames'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { IAlertDialogComponentProps } from '.'

export interface IAlertDialogTitleProps extends IAlertDialogComponentProps {
  value? : string
}

const AlertDialogTitle = React.forwardRef(({ children, className, ...props }: IAlertDialogTitleProps, forwardedRef: ForwardedRef<HTMLHeadingElement>) => (
  <AlertDialogPrimitive.Title
    className={classNames(
      'text-mauve12 m-0 text-[17px] font-medium',
      className
    )}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </AlertDialogPrimitive.Title>
))

export { AlertDialogTitle }