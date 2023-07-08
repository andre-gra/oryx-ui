import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

/* Accordion Types */
export interface IAlertDialogProps extends AlertDialogPrimitive.AlertDialogProps {
  children: React.ReactNode;
  className?: string,
  value: string
}

export const AccordionRoot = AlertDialogPrimitive.Root
