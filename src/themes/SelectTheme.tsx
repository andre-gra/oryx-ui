import { useTheme } from './useTheme'
import SelectDemo from '../ui/demo/SelectDemo'

const options = [
  {
    group: [
      { value: 'theme-light', label: 'Light' },
      { value: 'theme-dark', label: 'Dark' },
      { value: 'theme-melomys', label: 'Melomys' },
      { value: 'theme-teal', label: 'Teal' }
    ],
    label: 'Theme'
  }
]

const SelectTheme = () => {

  const { theme, changeTheme } = useTheme()

  const handleChangeTheme = () => {
    localStorage.setItem('theme', theme)
    return changeTheme
  }

  return (
    <SelectDemo label="Theme" options={options} placeholder="Select a theme…" value={theme} onValueChange={handleChangeTheme()} />
  )
}

export default SelectTheme