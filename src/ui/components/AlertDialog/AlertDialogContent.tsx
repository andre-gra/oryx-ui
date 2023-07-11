import React, { ForwardedRef } from 'react'
import classNames from 'classnames'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { IAlertDialogComponentProps } from '.'

export interface IAlertDialogContentProps extends IAlertDialogComponentProps {
  value? : string
}

const AlertDialogContent = React.forwardRef(({ children, className, ...props }: IAlertDialogContentProps, forwardedRef: ForwardedRef<HTMLDivElement>) => (
  <AlertDialogPrimitive.Content
    className={classNames(
      'data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none',
      className
    )}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </AlertDialogPrimitive.Content>
))

export { AlertDialogContent }