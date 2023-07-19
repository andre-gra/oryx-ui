import React, { ForwardedRef } from 'react'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import * as Select from '@radix-ui/react-select'
import classnames from 'classnames'
import { useTheme } from '../../themes/useTheme'

type Option = { label: string, value: string }
type Options = { group: Option[], label: string }
export interface SelectProps {
  label: string
  placeholder?: string
  options: Options[],
  value?: string,
  onValueChange?(value: string): void;
}

const SelectDemo = ({ ...props }: SelectProps) => {

  const { theme } = useTheme()

  return (
    <Select.Root value={props.value} onValueChange={props.onValueChange}>
      <Select.Trigger
        aria-label={props.label}
        className={classnames(
          theme,
          'inline-flex items-center justify-center rounded px-[15px] text-[13px] leading-none h-[35px] gap-[5px] bg-color3 text-color11 shadow-[0_2px_10px] shadow-color9 hover:bg-color4 focus:shadow-[0_0_0_2px] focus:shadow-color10 data-[placeholder]:text-color11 outline-none',
        )}
      >
        <Select.Value placeholder={props.placeholder} />
        <Select.Icon
          className={classnames(
            theme,
            'select-icon text-color11',
          )}
        >
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          className={classnames(
            theme,
            'overflow-hidden bg-color2 rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]',
          )}
        >
          <Select.ScrollUpButton
            className={classnames(
              theme,
              'flex items-center justify-center h-[25px] bg-color9 text-color11 cursor-default',
            )}
          >
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport
            className={classnames(
              theme,
              'p-[5px]',
            )}
          >
            {
              props.options.map((option, index) => (
                <div key={option.label.toLowerCase()}>
                  <Select.Group>
                    <Select.Label
                      className={classnames(
                        theme,
                        'px-[25px] text-xs leading-[25px] text-gray11'
                      )}
                    >
                      {option.label}
                    </Select.Label>
                    {option.group.map((item) => (
                      <SelectItem theme={theme} key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    )
                    )}
                  </Select.Group>
                  {props.options.length > 1 && index < props.options.length - 1 && (
                    <Select.Separator
                    className={classnames(
                      theme,
                      'h-[1px] bg-color10 m-[5px]'
                    )}
                    />
                  )}
                </div>
              ))
            }
          </Select.Viewport>
          <Select.ScrollDownButton
            className={classnames(
              theme,
              'flex items-center justify-center h-[25px] bg-color9 text-color11 cursor-default',
            )}
          >
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

export interface ISelectGroupItemProps {
  children: React.ReactNode
  className?: string
  value: string
  asChild?: boolean
  disabled?: boolean
  theme: string
}

const SelectItem = React.forwardRef(({ children, theme, ...props }: ISelectGroupItemProps, forwardedRef: ForwardedRef<HTMLDivElement>) => {
  return (
    <Select.Item
      className={classnames(
        theme,
        'text-[13px] leading-none text-color12 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-gray6 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-color4 data-[highlighted]:text-color11'
      )}
      {...props}
      ref={forwardedRef}
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator
        className={classnames(
          theme,
          'absolute left-0 w-[25px] inline-flex items-center justify-center',
        )}
      >
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  )
})

export default SelectDemo