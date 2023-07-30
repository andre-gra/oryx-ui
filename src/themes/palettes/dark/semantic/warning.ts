import { yellowDark } from "@radix-ui/colors"

const warning: { [key: string]: string } = {}

function replaceKeyString(inputString: string) {
  const regex = /(yellow)(\d+)/gi
  return inputString.replace(regex, 'warning$2')
}

Object.entries(yellowDark).forEach(([key, value]) => {
  key = replaceKeyString(key)
  warning[key] = value
})

export default warning