import { yellow } from "@radix-ui/colors"

const warning: { [key: string]: string } = {}

function replaceRedWithErrors(inputString: string) {
  const regex = /(yellow)(\d+)/gi
  return inputString.replace(regex, 'warning$2')
}

Object.entries(yellow).forEach(([key, value]) => {
  key = replaceRedWithErrors(key)
  warning[key] = value
})

export default warning