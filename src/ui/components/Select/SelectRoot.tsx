import * as Select from '@radix-ui/react-select'
import { SelectProps } from '@radix-ui/react-select'

const SelectRoot = ({ children, ...props }: SelectProps) => (
  <Select.Root
    {...props}>
    {children}
  </Select.Root>
)

export { SelectRoot }