import React, { ForwardedRef } from 'react'
import classnames from 'classnames'
import * as Select from './'
import { ISelectComponentProps } from '.'
import { CheckIcon } from '@radix-ui/react-icons'

export interface ISelectGroupItemProps extends ISelectComponentProps {
  value : string
  asChild?: boolean
  disabled?: boolean
}

const SelectGroupItem = React.forwardRef(({ children, className, ...props }: ISelectGroupItemProps, forwardedRef: ForwardedRef<HTMLDivElement>) => {
  return (
    <Select.Item
      className={classnames(
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator>
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  )
})

export { SelectGroupItem }