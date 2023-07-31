import { sandDark } from "@radix-ui/colors";

const gray: { [key: string]: string } = {};

function replaceSandWithGray(inputString: string) {
  const regex = /(sand)(\d+)/gi;
  return inputString.replace(regex, "gray$2");
}

Object.entries(sandDark).forEach(([key, value]) => {
  key = replaceSandWithGray(key);
  gray[key] = value;
});

export default gray;
