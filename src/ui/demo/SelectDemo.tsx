import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import * as Select from '../components/Select'
import { SelectGroupItem } from '../components/Select/SelectGroupItem'

const SelectDemo = () => (
  <Select.Root>
    <Select.Trigger
      aria-label="Food"
      background="bg-red6"
      text='text-mauve3'
      animation='rotate-x'
      size='lg'
    >
      <Select.Value placeholder="Select a fruit…" />
      <Select.Icon>
        <ChevronDownIcon />
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content>
        <Select.ScrollUpButton>
          <ChevronUpIcon />
        </Select.ScrollUpButton>
        <Select.Viewport>
          <Select.Group>
            <Select.Label>
              Fruits
            </Select.Label>
            <SelectGroupItem className='text-red-600' value="apple">Apple</SelectGroupItem>
            <SelectGroupItem value="banana">Banana</SelectGroupItem>
            <SelectGroupItem value="blueberry">Blueberry</SelectGroupItem>
            <SelectGroupItem value="grapes">Grapes</SelectGroupItem>
            <SelectGroupItem value="pineapple">Pineapple</SelectGroupItem>
          </Select.Group>

          <Select.Separator />

          <Select.Group>
            <Select.Label>
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

          <Select.Separator />

          <Select.Group>
            <Select.Label>
              Meat
            </Select.Label>
            <SelectGroupItem value="beef">Beef</SelectGroupItem>
            <SelectGroupItem value="chicken">Chicken</SelectGroupItem>
            <SelectGroupItem value="lamb">Lamb</SelectGroupItem>
            <SelectGroupItem value="pork">Pork</SelectGroupItem>
          </Select.Group>
        </Select.Viewport>
        <Select.ScrollDownButton>
          <ChevronDownIcon />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
)

export default SelectDemo