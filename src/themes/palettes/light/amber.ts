import { sand } from "./gray/sand"
import { blackA, whiteA} from '@radix-ui/colors'
import error from "./semantic/error"
import success from "./semantic/success"
import warning from "./semantic/warning"
import info from "./semantic/info"

export const amber = {
  color1: 'hsl(39, 70.0%, 99.0%)',
  color2: 'hsl(40, 100%, 96.5%)',
  color3: 'hsl(44, 100%, 91.7%)',
  color4: 'hsl(43, 100%, 86.8%)',
  color5: 'hsl(42, 100%, 81.8%)',
  color6: 'hsl(38, 99.7%, 76.3%)',
  color7: 'hsl(36, 86.1%, 67.1%)',
  color8: 'hsl(35, 85.2%, 55.1%)',
  color9: 'hsl(39, 100%, 57.0%)',
  color10: 'hsl(35, 100%, 55.5%)',
  color11: 'hsl(30, 100%, 34.0%)',
  color12: 'hsl(20, 80.0%, 17.0%)',
  ...sand,
  ...blackA,
  ...whiteA,
  ...error,
  ...success,
  ...warning,
  ...info
}