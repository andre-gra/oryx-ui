import { sage } from "./gray/sage"
import { blackA, whiteA} from '@radix-ui/colors'
import error from "./semantic/error"
import success from "./semantic/success"
import warning from "./semantic/warning"
import info from "./semantic/info"

export const teal = {
  color1: 'hsl(165, 60.0%, 98.8%)',
  color2: 'hsl(169, 64.7%, 96.7%)',
  color3: 'hsl(169, 59.8%, 94.0%)',
  color4: 'hsl(169, 53.1%, 90.2%)',
  color5: 'hsl(170, 47.1%, 85.0%)',
  color6: 'hsl(170, 42.6%, 77.9%)',
  color7: 'hsl(170, 39.9%, 68.1%)',
  color8: 'hsl(172, 42.1%, 52.5%)',
  color9: 'hsl(173, 80.0%, 36.0%)',
  color10: 'hsl(173, 83.4%, 32.5%)',
  color11: 'hsl(174, 90.0%, 25.2%)',
  color12: 'hsl(170, 50.0%, 12.5%)',
  ...sage,
  ...blackA,
  ...whiteA,
  ...error,
  ...success,
  ...warning,
  ...info
}