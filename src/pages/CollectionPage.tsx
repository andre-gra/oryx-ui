import SelectTheme from "../themes/SelectTheme"
import AccordionDemo from "../ui/demo/AccordionDemo"
import AlertDialogDemo from "../ui/demo/AlertDialogDemo"
import SelectDemo from "../ui/demo/SelectDemo"

const options = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
]

const CollectionPage = () => {

  return (
    <>
      <div className="main-background flex gap-2 items-center justify-center">
      <SelectTheme options={options} />
        <AccordionDemo />
        <AlertDialogDemo />
        <SelectDemo />
      </div>
    </>
  )
}

export default CollectionPage