import gray from "./gray/sage";
import { blackA, whiteA, yellow } from "@radix-ui/colors";
import error from "./semantic/error";
import success from "./semantic/success";
import warning from "./semantic/warning";
import info from "./semantic/info";

const color: { [key: string]: string } = {};

function replaceKeyString(inputString: string) {
  const regex = /(yellow)(\d+)/gi;
  return inputString.replace(regex, "color$2");
}

Object.entries(yellow).forEach(([key, value]) => {
  key = replaceKeyString(key);
  color[key] = value;
});

export const yellowO = {
  ...color,
  ...gray,
  ...blackA,
  ...whiteA,
  ...error,
  ...success,
  ...warning,
  ...info,
};

export type Yellow = "yellow";
