import gray from "./gray/sage";
import { blackA, whiteA, orangeDark } from "@radix-ui/colors";
import error from "./semantic/error";
import success from "./semantic/success";
import warning from "./semantic/warning";
import info from "./semantic/info";

const color: { [key: string]: string } = {};

function replaceKeyString(inputString: string) {
  const regex = /(orange)(\d+)/gi;
  return inputString.replace(regex, "color$2");
}

Object.entries(orangeDark).forEach(([key, value]) => {
  key = replaceKeyString(key);
  color[key] = value;
});

export const orangeDarkO = {
  ...color,
  ...gray,
  ...blackA,
  ...whiteA,
  ...error,
  ...success,
  ...warning,
  ...info,
};

export type OrangeDark = "orangeDark";
