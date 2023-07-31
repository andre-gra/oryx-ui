import { tealDark } from "@radix-ui/colors";

const success: { [key: string]: string } = {};

function replaceKeyString(inputString: string) {
  const regex = /(teal)(\d+)/gi;
  return inputString.replace(regex, "success$2");
}

Object.entries(tealDark).forEach(([key, value]) => {
  key = replaceKeyString(key);
  success[key] = value;
});

export default success;
