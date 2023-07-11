/* -------------------------------------------------------------------------------------------------
 * AlertDialog Types
 * ----------------------------------------------------------------------------------------------- */
export interface IAlertDialogComponentProps {
  children: React.ReactNode
  className?: string
}

/* -------------------------------------------------------------------------------------------------
 * AlertDialog Components
 * ----------------------------------------------------------------------------------------------- */
export { AlertDialogRoot as Root } from './AlertDialogRoot'
export { AlertDialogTrigger as Trigger } from './AlertDialogTrigger'
export { AlertDialogPortal as Portal } from './AlertDialogPortal'
export { AlertDialogOverlay as Overlay } from './AlertDialogOverlay'
export { AlertDialogContent as Content } from './AlertDialogContent'
export { AlertDialogCancel as Cancel } from './AlertDialogCancel'
export { AlertDialogAction as Action } from './AlertDialogAction'
export { AlertDialogTitle as Title } from './AlertDialogTitle'
export { AlertDialogDescription as Description } from './AlertDialogDescription'

