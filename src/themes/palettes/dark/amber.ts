import { sand } from "./gray/sand"
import error from "./semantic/error"
import { blackA, whiteA } from '@radix-ui/colors'
import info from "./semantic/info"
import success from "./semantic/success"
import warning from "./semantic/warning"

export const amber = {
  color1: 'hsl(36, 100%, 6.1%)',
  color2: 'hsl(35, 100%, 7.6%)',
  color3: 'hsl(32, 100%, 10.2%)',
  color4: 'hsl(32, 100%, 12.4%)',
  color5: 'hsl(33, 100%, 14.6%)',
  color6: 'hsl(35, 100%, 17.1%)',
  color7: 'hsl(35, 91.0%, 21.6%)',
  color8: 'hsl(36, 100%, 25.5%)',
  color9: 'hsl(39, 100%, 57.0%)',
  color10: 'hsl(43, 100%, 64.0%)',
  color11: 'hsl(39, 90.0%, 49.8%)',
  color12: 'hsl(39, 97.0%, 93.2%)',
  ...sand,
  ...blackA,
  ...whiteA,
  ...error,
  ...success,
  ...warning,
  ...info,
}