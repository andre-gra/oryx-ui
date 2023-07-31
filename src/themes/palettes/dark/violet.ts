import gray from "./gray/sage";
import { blackA, whiteA, violetDark } from "@radix-ui/colors";
import error from "./semantic/error";
import success from "./semantic/success";
import warning from "./semantic/warning";
import info from "./semantic/info";

const color: { [key: string]: string } = {};

function replaceKeyString(inputString: string) {
  const regex = /(violet)(\d+)/gi;
  return inputString.replace(regex, "color$2");
}

Object.entries(violetDark).forEach(([key, value]) => {
  key = replaceKeyString(key);
  color[key] = value;
});

export const violetDarkO = {
  ...color,
  ...gray,
  ...blackA,
  ...whiteA,
  ...error,
  ...success,
  ...warning,
  ...info,
};

export type VioletDark = "violetDark";
