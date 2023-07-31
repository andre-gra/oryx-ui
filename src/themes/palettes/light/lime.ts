import gray from "./gray/sage";
import { blackA, whiteA, lime } from "@radix-ui/colors";
import error from "./semantic/error";
import success from "./semantic/success";
import warning from "./semantic/warning";
import info from "./semantic/info";

const color: { [key: string]: string } = {};

function replaceKeyString(inputString: string) {
  const regex = /(lime)(\d+)/gi;
  return inputString.replace(regex, "color$2");
}

Object.entries(lime).forEach(([key, value]) => {
  key = replaceKeyString(key);
  color[key] = value;
});

export const limeO = {
  ...color,
  ...gray,
  ...blackA,
  ...whiteA,
  ...error,
  ...success,
  ...warning,
  ...info,
};

export type Lime = "lime";
