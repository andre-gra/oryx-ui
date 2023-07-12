import AccordionDemo from "../ui/demo/AccordionDemo"
import AlertDialogDemo from "../ui/demo/AlertDialogDemo"
import SelectDemo from "../ui/demo/SelectDemo"

const CollectionPage = () => {

  return (
    <div className="main-background flex gap-2 items-center justify-center">
      <AccordionDemo />
      <AlertDialogDemo />
      <SelectDemo />
    </div>
  )
}

export default CollectionPage