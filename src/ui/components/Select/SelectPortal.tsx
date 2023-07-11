import classNames from 'classnames'
import * as SelectPrimitive from '@radix-ui/react-select'
import { ISelectComponentProps } from '.'

export interface ISelectPortalProps extends ISelectComponentProps {
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