import { sageDark } from "@radix-ui/colors";

const gray: { [key: string]: string } = {};

function replaceKeyString(inputString: string) {
  const regex = /(sage)(\d+)/gi;
  return inputString.replace(regex, "gray$2");
}

Object.entries(sageDark).forEach(([key, value]) => {
  key = replaceKeyString(key);
  gray[key] = value;
});

export default gray;
