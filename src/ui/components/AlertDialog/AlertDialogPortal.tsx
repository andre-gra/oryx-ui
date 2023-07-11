import classNames from 'classnames'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { IAlertDialogComponentProps } from '.'

export interface IAlertDialogPortalProps extends IAlertDialogComponentProps {
  value? : string
}

const AlertDialogPortal = ({ children, className, ...props }: IAlertDialogPortalProps) => (
  <AlertDialogPrimitive.Portal
    className={classNames(
      'text-violet11 shadow-mauve6 hover:bg-mauve2 group flex h-[45px] flex-1 cursor-default items-center justify-between bg-white px-5 text-[15px] leading-none shadow-[0_1px_0] outline-none',
      className
    )}
    {...props}
  >
    {children}
  </AlertDialogPrimitive.Portal>
)

export { AlertDialogPortal }