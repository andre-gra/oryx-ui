import { red } from "@radix-ui/colors"

const error: { [key: string]: string } = {}

function replaceRedWithErrors(inputString: string) {
  const regex = /(red)(\d+)/gi
  return inputString.replace(regex, 'error$2')
}

Object.entries(red).forEach(([key, value]) => {
  key = replaceRedWithErrors(key)
  error[key] = value
})

export default error