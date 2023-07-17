import SelectTheme from "../themes/SelectTheme"
import AccordionDemo from "../ui/demo/AccordionDemo"
import AlertDialogDemo from "../ui/demo/AlertDialogDemo"
import SelectDemo from "../ui/demo/SelectDemo"

const options = [
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

const CollectionPage = () => {

  return (
    <>
      <div className="main-background flex gap-2 items-center justify-center">
        <SelectTheme />
        <AccordionDemo />
        <AlertDialogDemo />
        <SelectDemo label='Fruits' options={options} placeholder="Choose something..." />
      </div>
    </>
  )
}

export default CollectionPage