import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { IAlertDialogComponentProps } from '.'

export interface IAlertDialogRootProps extends IAlertDialogComponentProps {
  defaultOpen?: boolean
  open?: boolean
  openOnChange?: (open: boolean) => void
}

const AlertDialogRoot = ({ children, ...props }: IAlertDialogRootProps) => (
  <AlertDialog.Root
    {...props}>
    {children}
  </AlertDialog.Root>
)

export { AlertDialogRoot }