import { sand } from "@radix-ui/colors";

const gray: { [key: string]: string } = {};

function replaceKeyString(inputString: string) {
  const regex = /(sand)(\d+)/gi;
  return inputString.replace(regex, "gray$2");
}

Object.entries(sand).forEach(([key, value]) => {
  key = replaceKeyString(key);
  gray[key] = value;
});

export default gray;
