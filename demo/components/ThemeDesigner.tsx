import { useTheme, useSize, ThemeAgentPanel, type Theme, type Size, Select, Button } from '../../src'

const themeOptions = [
  {
    label: 'Colors',
    group: [
      { value: 'theme-amber', label: 'Amber' },
      { value: 'theme-amberDark', label: 'Amber Dark' },
      { value: 'theme-blue', label: 'Blue' },
      { value: 'theme-blueDark', label: 'Blue Dark' },
      { value: 'theme-brown', label: 'Brown' },
      { value: 'theme-brownDark', label: 'Brown Dark' },
      { value: 'theme-crimson', label: 'Crimson' },
      { value: 'theme-crimsonDark', label: 'Crimson Dark' },
      { value: 'theme-cyan', label: 'Cyan' },
      { value: 'theme-cyanDark', label: 'Cyan Dark' },
      { value: 'theme-grass', label: 'Grass' },
      { value: 'theme-grassDark', label: 'Grass Dark' },
      { value: 'theme-green', label: 'Green' },
      { value: 'theme-greenDark', label: 'Green Dark' },
      { value: 'theme-indigo', label: 'Indigo' },
      { value: 'theme-indigoDark', label: 'Indigo Dark' },
      { value: 'theme-lime', label: 'Lime' },
      { value: 'theme-limeDark', label: 'Lime Dark' },
      { value: 'theme-mint', label: 'Mint' },
      { value: 'theme-mintDark', label: 'Mint Dark' },
      { value: 'theme-orange', label: 'Orange' },
      { value: 'theme-orangeDark', label: 'Orange Dark' },
      { value: 'theme-pink', label: 'Pink' },
      { value: 'theme-pinkDark', label: 'Pink Dark' },
      { value: 'theme-plum', label: 'Plum' },
      { value: 'theme-plumDark', label: 'Plum Dark' },
      { value: 'theme-purple', label: 'Purple' },
      { value: 'theme-purpleDark', label: 'Purple Dark' },
      { value: 'theme-red', label: 'Red' },
      { value: 'theme-redDark', label: 'Red Dark' },
      { value: 'theme-sky', label: 'Sky' },
      { value: 'theme-skyDark', label: 'Sky Dark' },
      { value: 'theme-teal', label: 'Teal' },
      { value: 'theme-tealDark', label: 'Teal Dark' },
      { value: 'theme-tomato', label: 'Tomato' },
      { value: 'theme-tomatoDark', label: 'Tomato Dark' },
      { value: 'theme-violet', label: 'Violet' },
      { value: 'theme-violetDark', label: 'Violet Dark' },
      { value: 'theme-yellow', label: 'Yellow' },
      { value: 'theme-yellowDark', label: 'Yellow Dark' },
      { value: 'theme-gray', label: 'Gray' },
      { value: 'theme-grayDark', label: 'Gray Dark' },
    ],
  },
]

const sizeOptions = [
  {
    label: 'Scale',
    group: [
      { value: '2', label: 'Small' },
      { value: '3', label: 'Medium' },
      { value: '4', label: 'Large' },
    ],
  },
]

type ThemeDesignerProps = {
  chapterId: number
  onSave: (theme: Theme, size: Size) => void
  savedTheme: Theme | null
  savedSize: Size
  prompt?: string
}

export const ThemeDesigner = ({ chapterId, onSave, savedTheme, savedSize, prompt }: ThemeDesignerProps) => {
  const { theme, changeTheme } = useTheme()
  const { size, changeSize } = useSize()

  return (
    <div className="bg-color2 border border-color6 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-color12 font-semibold">Theme Designer</h3>
          {prompt && <p className="text-color10 text-sm mt-1">{prompt}</p>}
        </div>
        {savedTheme && (
          <span className="text-xs text-color9 bg-color4 px-3 py-1 rounded-full">
            Saved
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <label className="text-color11 text-sm" htmlFor="theme">Theme:</label>
          <Select
            value={theme}
            options={themeOptions}
            onValueChange={(val) => changeTheme(val as Theme)}
            className="min-w-[140px]"
            label="Theme"
            id="theme"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-color11 text-sm" htmlFor="size">Size:</label>
          <Select
            value={size}
            options={sizeOptions}
            onValueChange={(val) => changeSize(val as any)}
            className="min-w-[100px]"
            label="Size"
            id="size"
          />
        </div>
      </div>

      <div className="flex-1">
        <ThemeAgentPanel />
      </div>

      <Button
        variant={savedTheme ? 'secondary' : 'primary'}
        onClick={() => onSave(theme, size)}
        className="w-full"
      >
        {savedTheme ? 'Update Chapter Theme' : `Save Theme for Chapter ${chapterId}`}
      </Button>
    </div>
  )
}
