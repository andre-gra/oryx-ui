import * as Select from '@radix-ui/react-select'
import { ISelectComponentProps } from '.'

export interface ISelectRootProps extends ISelectComponentProps {
  defaultOpen?: boolean
  open?: boolean
  openOnChange?: (open: boolean) => void
}

const SelectRoot = ({ children, ...props }: ISelectRootProps) => (
  <Select.Root
    {...props}>
    {children}
  </Select.Root>
)

export { SelectRoot }