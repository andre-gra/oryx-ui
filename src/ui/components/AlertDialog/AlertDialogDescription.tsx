import React, { ForwardedRef } from 'react'
import classNames from 'classnames'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { IAlertDialogComponentProps } from '.'

export interface IAlertDialogDescriptionProps extends IAlertDialogComponentProps {
  value? : string
}

const AlertDialogDescription = React.forwardRef(({ children, className, ...props }: IAlertDialogDescriptionProps, forwardedRef: ForwardedRef<HTMLParagraphElement>) => (
  <AlertDialogPrimitive.Description
    className={classNames(
      'text-mauve11 mt-4 mb-5 text-[15px] leading-normal',
      className
    )}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </AlertDialogPrimitive.Description>
))

export { AlertDialogDescription }