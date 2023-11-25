import classNames from "classnames";
import SelectSize from "../themes/SelectSize";
import SelectTheme from "../themes/SelectTheme";
import { useTheme } from "../themes/useTheme";
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

const itemsMenu = [
  {
    title: "Learn",
    item: [
      {
        type: "card",
        title: "Radix Primitives",
        href: "/",
        text: "Unstyled, accessible components for React.",
      },
      {
        type: "text",
        title: "Stitches",
        href: "https://stitches.dev/",
        text: "CSS-in-JS with best-in-class developer experience.",
      },
      {
        type: "text",
        title: "Colors",
        href: "/",
        text: "Beautiful, thought-out palettes with auto dark mode.",
      },
      {
        type: "text",
        title: "Icons",
        href: "https://icons.radix-ui.com/",
        text: "A crisp set of 15x15 icons, balanced and consistent.",
      },
    ],
  },
  {
    title: "Overview",
    item: [
      {
        type: "text",
        title: "Introduction",
        href: "/",
        text: "Build high-quality, accessible design systems and web apps.",
      },
      {
        type: "text",
        title: "Getting started",
        href: "/",
        text: "A quick tutorial to get you up and running with Radix Primitives.",
      },
      {
        type: "text",
        title: "Styling",
        href: "/",
        text: "Unstyled and compatible with any styling solution.",
      },
      {
        type: "text",
        title: "Animation",
        href: "/",
        text: "Use CSS keyframes or any animation library of your choice.",
      },
      {
        type: "text",
        title: "Accessibility",
        href: "/",
        text: "Tested in a range of browsers and assistive technologies.",
      },
      {
        type: "text",
        title: "Releases",
        href: "/",
        text: "Radix Primitives releases and their changelogs.",
      },
    ],
  },
  {
    title: "Github",
    href: "https://github.com/radix-ui",
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
  const { theme } = useTheme();

  return (
    <>
      <div
        className={classNames(
          theme,
          "main-background flex flex-col justify-start bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% min-h-screen",
        )}
      >
        <div className="p-10">
          <h1 className="animate-text text-center bg-gradient-to-r from-color4 via-color7 to-color11 bg-clip-text text-transparent text-5xl font-black">
            <span>
              This is a demo. Try changing the theme and size and see how the
              components fit together.
            </span>{" "}
            <span>Choose your style!</span>
          </h1>
        </div>
        <div className="flex gap-2 my-4 mx-2 justify-center">
          <div className="bg-color2 p-4 rounded border border-color8">
            <span className="text-color12 font-semibold mr-2">
              Select Theme:
            </span>
            <SelectTheme />
          </div>
          <div className="bg-color2 p-4 rounded border border-color8">
            <span className="text-color12 font-semibold mr-2">
              Select Size:
            </span>
            <SelectSize />
          </div>
        </div>
        <div className="mt-10 flex flex-wrap gap-10 content-around justify-evenly items-center">
          <NavigationMenuDemo items={itemsMenu} />
          <AccordionDemo items={itemsAccordion} />
          <AlertDialogDemo texts={textsAlert} />
          <SelectDemo
            label="Fruits"
            options={optionsSelect}
            placeholder="Choose something..."
          />
          <PopoverDemo fields={fieldsPopover} />
        </div>
      </div>
    </>
  );
};

export default CollectionPage;
