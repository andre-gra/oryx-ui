import gray from "./gray/sand";
import { blackA, whiteA, amber } from "@radix-ui/colors";
import error from "./semantic/error";
import success from "./semantic/success";
import info from "./semantic/info";
import warning from "./semantic/warning";

const color: { [key: string]: string } = {};

function replaceKeyString(inputString: string) {
  const regex = /(amber)(\d+)/gi;
  return inputString.replace(regex, "color$2");
}

Object.entries(amber).forEach(([key, value]) => {
  key = replaceKeyString(key);
  color[key] = value;
});

export const amberO = {
  ...color,
  ...gray,
  ...blackA,
  ...whiteA,
  ...error,
  ...success,
  ...warning,
  ...info,
};

export type Amber = "amber";
