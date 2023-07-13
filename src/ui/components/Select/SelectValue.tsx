import React, { ForwardedRef } from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { SelectValueProps } from '@radix-ui/react-select'

export interface ISelectValueProps extends SelectValueProps {
  todo?: string
}

const SelectValue = React.forwardRef(({ children, ...props }: ISelectValueProps, forwardedRef: ForwardedRef<HTMLSpanElement>) => (
  <SelectPrimitive.Value
    // We ignore `classNames` as this part shouldn't be styled.
    {...props}
    ref={forwardedRef}
  >
    {children}
  </SelectPrimitive.Value>
))

export { SelectValue }