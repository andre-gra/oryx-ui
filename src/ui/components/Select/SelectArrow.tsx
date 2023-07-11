import React, { ForwardedRef } from 'react'
import classNames from 'classnames'
import * as SelectPrimitive from '@radix-ui/react-select'
import { ISelectComponentProps } from '.'

export interface ISelectArrowProps extends ISelectComponentProps {
  value : string
  asChild?: boolean
}

const SelectArrow = React.forwardRef(({ children, className, ...props }: ISelectArrowProps, forwardedRef: ForwardedRef<SVGSVGElement>) => (
  <SelectPrimitive.Arrow
    className={classNames(
      'text-violet11',
      className
    )}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </SelectPrimitive.Arrow>
))

export { SelectArrow }