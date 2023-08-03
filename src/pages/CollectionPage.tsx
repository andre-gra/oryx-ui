import SelectSize from "../themes/SelectSize";
import SelectTheme from "../themes/SelectTheme";
import AccordionDemo from "../ui/demo/AccordionDemo";
import AlertDialogDemo from "../ui/demo/AlertDialogDemo";
import NavigationMenuDemo from "../ui/demo/NavigationDemo";
import PopoverDemo from "../ui/demo/PopoverDemo";
import SelectDemo from "../ui/demo/SelectDemo";

const optionsSelect = [
  {
    group: [
      { value: "apple", label: "Apple" },
      { value: "pear", label: "Pear" },
      { value: "banana", label: "Banana" },
      { value: "orange", label: "Orange", disabled: true },
      { value: "grape", label: "Grape" },
      { value: "watermelon", label: "Watermelon" },
    ],
    label: "Fruits",
  },
  {
    group: [
      { value: "aubergine", label: "broccoli" },
      { value: "broccoli", label: "Pear" },
      { value: "carrot", label: "Carrot" },
      { value: "courgette", label: "Courgette" },
      { value: "leek", label: "Leek" },
    ],
    label: "Vegetables",
  },
  {
    group: [
      { value: "beef", label: "Beef" },
      { value: "chicken", label: "Chicken" },
      { value: "lamb", label: "Lamb" },
      { value: "pork", label: "Pork" },
    ],
    label: "Meat",
  },
];

const fieldsPopover = [
  {
    fieldTitle: "Dimensions",
    field: [
      {
        label: "Width",
        htmlFor: "width",
        id: "width",
        defaultValue: "100%",
      },
      {
        label: "Max. width",
        htmlFor: "maxWidth",
        id: "maxWidth",
        defaultValue: "300px",
      },
      {
        label: "Height",
        htmlFor: "height",
        id: "height",
      },
      {
        label: "Max. height",
        htmlFor: "maxHeight",
        id: "maxHeight",
        defaultValue: "none",
      },
    ],
  },
];

const itemsAccordion = [
  {
    mainText: "Is it accessible?",
    collapsibleText: "Yes. It adheres to the WAI-ARIA design pattern",
  },
  {
    mainText: "Is it unstyled?",
    collapsibleText:
      "Yes. It's unstyled by default, giving you freedom over the look and feel.",
  },
];

const textsAlert = {
  buttonTrigger: "Delete account",
  content: "Are you absolutely sure?",
  description:
    "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
  buttonCancel: "Cancel",
  action: "Yes, delete account",
};

const CollectionPage = () => {
  return (
    <>
      <div className="main-background flex flex-wrap gap-2 items-center justify-center content-center">
        <NavigationMenuDemo />
        <SelectTheme />
        <SelectSize />
        <AccordionDemo items={itemsAccordion} />
        <AlertDialogDemo texts={textsAlert} />
        <SelectDemo
          label="Fruits"
          options={optionsSelect}
          placeholder="Choose something..."
        />
        <PopoverDemo fields={fieldsPopover} />
      </div>
    </>
  );
};

export default CollectionPage;
