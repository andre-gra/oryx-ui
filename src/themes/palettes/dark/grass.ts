import gray from "./gray/sage"
import { blackA, whiteA, grassDark} from '@radix-ui/colors'
import error from "./semantic/error"
import success from "./semantic/success"
import warning from "./semantic/warning"
import info from "./semantic/info"

const color: { [key: string]: string } = {}

function replaceKeyString(inputString: string) {
  const regex = /(grass)(\d+)/gi
  return inputString.replace(regex, 'color$2')
}

Object.entries(grassDark).forEach(([key, value]) => {
  key = replaceKeyString(key)
  color[key] = value
})

export const grassDarkO = {
  ...color,
  ...gray,
  ...blackA,
  ...whiteA,
  ...error,
  ...success,
  ...warning,
  ...info
}

export type GrassDark = 'grassDark'