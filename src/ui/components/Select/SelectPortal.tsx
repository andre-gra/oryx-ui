import classNames from 'classnames'
import * as SelectPrimitive from '@radix-ui/react-select'
import { SelectPortalProps } from '@radix-ui/react-select'

export interface ISelectPortalProps extends SelectPortalProps {
  value? : string
  asChild?: boolean
}

const SelectPortal = ({ children, className, ...props }: ISelectPortalProps) => (
  <SelectPrimitive.Portal
    className={classNames(
      'text-violet11',
      className
    )}
    {...props}
  >
    {children}
  </SelectPrimitive.Portal>
)

export { SelectPortal }