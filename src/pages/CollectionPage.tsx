import SelectTheme from "../themes/SelectTheme"
import AccordionDemo from "../ui/demo/AccordionDemo"
import AlertDialogDemo from "../ui/demo/AlertDialogDemo"
import SelectDemo from "../ui/demo/SelectDemo"

const optionsSelect = [
  {
    group: [
      { value: 'apple', label: 'Apple' },
      { value: 'pear', label: 'Pear' },
      { value: 'banana', label: 'Banana' },
      { value: 'orange', label: 'Orange' },
      { value: 'grape', label: 'Grape' },
      { value: 'watermelon', label: 'Watermelon' }
    ],
    label: 'Fruits'
  },
  {
    group: [
      { value: 'aubergine', label: 'broccoli' },
      { value: 'broccoli', label: 'Pear' },
      { value: 'carrot', label: 'Carrot' },
      { value: 'courgette', label: 'Courgette' },
      { value: 'leek', label: 'Leek' }
    ],
    label: 'Vegetables'
  },
  {
    group: [
      { value: 'beef', label: 'Beef' },
      { value: 'chicken', label: 'Chicken' },
      { value: 'lamb', label: 'Lamb' },
      { value: 'pork', label: 'Pork' }
    ],
    label: 'Meat'
  }
]

const itemsAccordion = [
  {
    mainText: 'Is it accessible?',
    collapsibleText: 'Yes. It adheres to the WAI-ARIA design pattern'

  },
  {
    mainText: 'Is it unstyled?',
    collapsibleText: 'Yes. It\'s unstyled by default, giving you freedom over the look and feel.'

  },
]

const CollectionPage = () => {

  return (
    <>
      <div className="main-background flex gap-2 items-center justify-center">
        <SelectTheme />
        <AccordionDemo items={itemsAccordion} />
        <AlertDialogDemo />
        <SelectDemo label='Fruits' options={optionsSelect} placeholder="Choose something..." />
      </div>
    </>
  )
}

export default CollectionPage