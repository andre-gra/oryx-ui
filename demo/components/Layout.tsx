import { Outlet, useNavigate } from 'react-router-dom'
import { useTheme, useSize, Select, Button, type Theme } from '../../src'
import { ReaderIcon, GitHubLogoIcon } from '@radix-ui/react-icons'

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

export const Layout = () => {
  const { theme, changeTheme } = useTheme()
  const { size, changeSize } = useSize()
  const navigate = useNavigate()

  return (
    <div className={`${theme} min-h-screen bg-gradient-to-br from-color1 via-color2 to-color3 p-8 relative`}>
      <div className="relative md:absolute top-4 md:right-4 flex justify-center md:justify-end mb-8 -mt-4 md:mb-0 md:-mt-0 gap-3 z-10">
        <Button variant="ghost" onClick={() => navigate('/')}>
          Home
        </Button>
        <a
          href="https://oryx-ui-docs.onrender.com/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-color2 border border-color6 rounded-full shadow-sm hover:bg-color3 transition-colors text-color11 font-medium no-underline"
        >
          <ReaderIcon className="w-5 h-5" />
          <span>Docs</span>
        </a>
        <a
          href="https://github.com/andre-gra/oryx-ui"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-color2 border border-color6 rounded-full shadow-sm hover:bg-color3 transition-colors text-color11 font-medium no-underline"
        >
          <GitHubLogoIcon className="w-5 h-5" />
          <span>GitHub</span>
        </a>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6 cursor-pointer" onClick={() => navigate('/')} onKeyDown={() => navigate('/')} tabIndex={0}>
          <h1 className="text-4xl font-bold text-color11">
            <img src="oryx.svg" alt="oryx" className="inline-block mr-2" width="50" />
            <span className="inline-block align-middle">Oryx UI Demo</span>
          </h1>
          <p className="text-color10">Interactive component journey</p>
        </div>

        <div className="flex gap-4 flex-wrap mb-6 p-4 bg-color2 rounded-lg border border-color6 transition-colors duration-300 items-center">
          <div className="flex items-center gap-2">
            <label className="text-color12 font-semibold text-sm" htmlFor="theme">Theme:</label>
            <Select
              value={theme}
              options={themeOptions}
              onValueChange={(val) => changeTheme(val as Theme)}
              className="min-w-[140px]"
              label='Theme'
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-color12 font-semibold text-sm" htmlFor="size">Size:</label>
            <Select
              value={size}
              options={sizeOptions}
              onValueChange={(val) => changeSize(val as any)}
              className="min-w-[100px]"
              label='Size'
            />
          </div>
          <div className="ml-auto flex gap-2">
            <Button variant="ghost" onClick={() => navigate('/sandbox')}>
              Sandbox
            </Button>
            <Button variant="secondary" onClick={() => navigate('/chapter/1')}>
              Start Journey
            </Button>
          </div>
        </div>

        <Outlet />

        <footer className="mt-12 py-6 text-center border-t border-color6">
          <p className="text-color11">
            Created by{' '}
            <a
              href="https://github.com/andre-gra"
              target="_blank"
              rel="noreferrer"
              className="text-color9 hover:text-color10 hover:underline font-medium transition-colors"
            >
              andre-gra
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}
