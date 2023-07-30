import gray from "./gray/sage"
import { blackA, whiteA, brown} from '@radix-ui/colors'
import error from "./semantic/error"
import success from "./semantic/success"
import warning from "./semantic/warning"
import info from "./semantic/info"

const color: { [key: string]: string } = {}

function replaceKeyString(inputString: string) {
  const regex = /(brown)(\d+)/gi
  return inputString.replace(regex, 'color$2')
}

Object.entries(brown).forEach(([key, value]) => {
  key = replaceKeyString(key)
  color[key] = value
})

export const brownO = {
  ...color,
  ...gray,
  ...blackA,
  ...whiteA,
  ...error,
  ...success,
  ...warning,
  ...info
}

export type Brown = 'brown'