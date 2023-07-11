import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import * as Select from '../components/Select'
import { SelectGroupItem } from '../components/Select/SelectGroupItem'

const SelectDemo = () => (
  <Select.Root>
    <Select.Trigger
      className="inline-flex items-center justify-center rounded px-[15px] text-[13px] leading-none h-[35px] gap-[5px] bg-white text-violet11 shadow-[0_2px_10px] shadow-black/10 hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-violet9 outline-none"
      aria-label="Food"
    >
      <Select.Value placeholder="Select a fruit…" />
      <Select.Icon className="text-violet11">
        <ChevronDownIcon />
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content className="overflow-hidden bg-white rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
        <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
          <ChevronUpIcon />
        </Select.ScrollUpButton>
        <Select.Viewport className="p-[5px]">
          <Select.Group>
            <Select.Label className="px-[25px] text-xs leading-[25px] text-mauve11">
              Fruits
            </Select.Label>
            <SelectGroupItem value="apple">Apple</SelectGroupItem>
            <SelectGroupItem value="banana">Banana</SelectGroupItem>
            <SelectGroupItem value="blueberry">Blueberry</SelectGroupItem>
            <SelectGroupItem value="grapes">Grapes</SelectGroupItem>
            <SelectGroupItem value="pineapple">Pineapple</SelectGroupItem>
          </Select.Group>

          <Select.Separator className="h-[1px] bg-violet6 m-[5px]" />

          <Select.Group>
            <Select.Label className="px-[25px] text-xs leading-[25px] text-mauve11">
              Vegetables
            </Select.Label>
            <SelectGroupItem value="aubergine">Aubergine</SelectGroupItem>
            <SelectGroupItem value="broccoli">Broccoli</SelectGroupItem>
            <SelectGroupItem value="carrot" disabled>
              Carrot
            </SelectGroupItem>
            <SelectGroupItem value="courgette">Courgette</SelectGroupItem>
            <SelectGroupItem value="leek">Leek</SelectGroupItem>
          </Select.Group>

          <Select.Separator className="h-[1px] bg-violet6 m-[5px]" />

          <Select.Group>
            <Select.Label className="px-[25px] text-xs leading-[25px] text-mauve11">
              Meat
            </Select.Label>
            <SelectGroupItem value="beef">Beef</SelectGroupItem>
            <SelectGroupItem value="chicken">Chicken</SelectGroupItem>
            <SelectGroupItem value="lamb">Lamb</SelectGroupItem>
            <SelectGroupItem value="pork">Pork</SelectGroupItem>
          </Select.Group>
        </Select.Viewport>
        <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
          <ChevronDownIcon />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
)

export default SelectDemo