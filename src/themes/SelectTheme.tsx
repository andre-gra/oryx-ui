import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import * as Select from '../ui/components/Select'
import { SelectGroupItem } from '../ui/components/Select/SelectGroupItem'
import { useTheme } from './useTheme'

type Option = { label: string, value: string }

interface SelectThemeProps {
  options: Option[]
}

const SelectTheme = ( { options }: SelectThemeProps ) => {

  const { theme, changeTheme } = useTheme()

  const handleChangeTheme = () => {
    localStorage.setItem('theme', theme)
    return changeTheme
  }

  return (
    <Select.Root value={theme} onValueChange={handleChangeTheme()}>
      <Select.Trigger
        aria-label="Theme"
        background="bg-mauve4"
        text='text-mauve3'
        animation='rotate-x'
        size='base'
      >
        <Select.Value placeholder="Select a theme…" />
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content>
          <Select.ScrollUpButton>
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport>
            <Select.Group>
              <Select.Label>
                Themes
              </Select.Label>
              {options.map((option) => (
                <SelectGroupItem key={option.value} className='text-red-600' value={option.value}>
                  {option.label}
                </SelectGroupItem>
                )
              )}
            </Select.Group>
          </Select.Viewport>
          <Select.ScrollDownButton>
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

export default SelectTheme