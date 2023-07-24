import { useTheme } from './useTheme'
import SelectDemo from '../ui/demo/SelectDemo'
import type { Theme } from './themeProvider'

type ThemeOptions = {
  group: { value: Theme; label: string }[]
  label: string

}

const options: ThemeOptions[] = [
  {
    group: [
      { value: 'theme-amber', label: 'Amber' },
      { value: 'theme-amberDark', label: 'AmberDark' },
      { value: 'theme-mintDark', label: 'MintDark' },
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