import { blueDark } from "@radix-ui/colors"

const info: { [key: string]: string } = {}

function replaceKeyString(inputString: string) {
  const regex = /(blue)(\d+)/gi
  return inputString.replace(regex, 'info$2')
}

Object.entries(blueDark).forEach(([key, value]) => {
  key = replaceKeyString(key)
  info[key] = value
})

export default info