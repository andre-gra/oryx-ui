import classNames from "classnames";
import { GitHubLogoIcon, ReaderIcon } from "@radix-ui/react-icons";
import {
  Accordion,
  Select,
  AlertDialog,
  NavigationMenu,
  Popover,
  useTheme,
  useSize,
  ThemeAgentPanel,
  type Theme,
  Size,
} from "../src";
import "../src/oryx.css";

type ThemeSelectorProps = {
  theme: Theme;
  size: Size;
  changeTheme: (theme: Theme) => void;
  changeSize: (size: Size) => void;
};

const ThemeSelector = ({ theme, size, changeTheme, changeSize }: ThemeSelectorProps) => {
  const themeOptions = [
    {
      label: "Colors",
      group: [
        { value: "theme-amber", label: "Amber" },
        { value: "theme-amberDark", label: "Amber Dark" },
        { value: "theme-blue", label: "Blue" },
        { value: "theme-blueDark", label: "Blue Dark" },
        { value: "theme-brown", label: "Brown" },
        { value: "theme-brownDark", label: "Brown Dark" },
        { value: "theme-crimson", label: "Crimson" },
        { value: "theme-crimsonDark", label: "Crimson Dark" },
        { value: "theme-cyan", label: "Cyan" },
        { value: "theme-cyanDark", label: "Cyan Dark" },
        { value: "theme-grass", label: "Grass" },
        { value: "theme-grassDark", label: "Grass Dark" },
        { value: "theme-green", label: "Green" },
        { value: "theme-greenDark", label: "Green Dark" },
        { value: "theme-indigo", label: "Indigo" },
        { value: "theme-indigoDark", label: "Indigo Dark" },
        { value: "theme-lime", label: "Lime" },
        { value: "theme-limeDark", label: "Lime Dark" },
        { value: "theme-mint", label: "Mint" },
        { value: "theme-mintDark", label: "Mint Dark" },
        { value: "theme-orange", label: "Orange" },
        { value: "theme-orangeDark", label: "Orange Dark" },
        { value: "theme-pink", label: "Pink" },
        { value: "theme-pinkDark", label: "Pink Dark" },
        { value: "theme-plum", label: "Plum" },
        { value: "theme-plumDark", label: "Plum Dark" },
        { value: "theme-purple", label: "Purple" },
        { value: "theme-purpleDark", label: "Purple Dark" },
        { value: "theme-red", label: "Red" },
        { value: "theme-redDark", label: "Red Dark" },
        { value: "theme-sky", label: "Sky" },
        { value: "theme-skyDark", label: "Sky Dark" },
        { value: "theme-teal", label: "Teal" },
        { value: "theme-tealDark", label: "Teal Dark" },
        { value: "theme-tomato", label: "Tomato" },
        { value: "theme-tomatoDark", label: "Tomato Dark" },
        { value: "theme-violet", label: "Violet" },
        { value: "theme-violetDark", label: "Violet Dark" },
        { value: "theme-yellow", label: "Yellow" },
        { value: "theme-yellowDark", label: "Yellow Dark" },
        { value: "theme-gray", label: "Gray" },
        { value: "theme-grayDark", label: "Gray Dark" },
      ],
    },
  ];

  const sizeOptions = [
    {
      label: "Scale",
      group: [
        { value: "2", label: "Small" },
        { value: "3", label: "Medium" },
        { value: "4", label: "Large" },
      ],
    },
  ];

  return (
    <div
      className={`${theme} flex gap-4 flex-wrap mb-8 p-4 bg-color2 rounded-lg border border-color6 transition-colors duration-300`}
    >
      <div className="flex items-center gap-2">
        <label htmlFor="theme-select" className="text-color12 font-semibold">
          Theme:
        </label>
        <Select
          id="theme-select"
          label="Theme"
          value={theme}
          options={themeOptions}
          onValueChange={(val) => changeTheme(val as Theme)}
          className="min-w-[140px]"
        />
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="size-select" className="text-color12 font-semibold">
          Size:
        </label>
        <Select
          id="size-select"
          label="Size"
          value={size}
          options={sizeOptions}
          onValueChange={(val) => changeSize(val as any)}
          className="min-w-[100px]"
        />
      </div>
      <div className="flex-1 w-full">
        <ThemeAgentPanel />
      </div>
    </div>
  );
};

const App = () => {
  const { theme, changeTheme } = useTheme();
  const { size, changeSize } = useSize();
  return (
    <div
      className={`${theme} min-h-screen bg-gradient-to-br from-color1 via-color2 to-color3 p-8 relative`}
    >
      <div className="relative md:absolute top-4 md:right-4 flex justify-center md:justify-end mb-8 -mt-4 md:mb-0 md:-mt-0 gap-3 z-50">
        <a
          href="https://oryx-ui-docs.onrender.com/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-color2 border border-color6 rounded-full shadow-sm hover:bg-color3 transition-colors text-color11 font-medium"
        >
          <ReaderIcon className="w-5 h-5" />
          <span>Docs</span>
        </a>
        <a
          href="https://github.com/andre-gra/oryx-ui"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-color2 border border-color6 rounded-full shadow-sm hover:bg-color3 transition-colors text-color11 font-medium"
        >
          <GitHubLogoIcon className="w-5 h-5" />
          <span>GitHub</span>
        </a>
      </div>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-color11 text-center mb-2">
          <img src="oryx.svg" alt="oryx" className="inline-block mr-2" width="50" />
          <span className="inline-block align-middle">Oryx UI Demo</span>
        </h1>
        <p className="text-color10 text-center mb-8">Testing the component library</p>

        <ThemeSelector
          theme={theme}
          size={size}
          changeTheme={changeTheme}
          changeSize={changeSize}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Navigation Menu - Full width */}
          <div
            className={classNames(
              "bg-color4 z-10 w-fit h-fit backdrop-blur-sm rounded-xl p-6",
              size === "4" && "col-span-2 xl:col-span-1",
            )}
          >
            <h2 className="text-color11 text-xl font-semibold mb-4">Navigation Menu</h2>
            <NavigationMenu
              items={[
                {
                  title: "Products",
                  item: [
                    {
                      type: "card",
                      title: "Featured",
                      href: "#",
                      text: "Our main product offering",
                    },
                    {
                      type: "text",
                      title: "Components",
                      href: "#",
                      text: "UI building blocks",
                    },
                    {
                      type: "text",
                      title: "Themes",
                      href: "#",
                      text: "Color and styling options",
                    },
                  ],
                },
                {
                  title: "Docs",
                  item: [
                    {
                      type: "text",
                      title: "Getting Started",
                      href: "#",
                      text: "Quick start guide",
                    },
                    {
                      type: "text",
                      title: "API Reference",
                      href: "#",
                      text: "Component documentation",
                    },
                  ],
                },
                { title: "GitHub", href: "https://github.com/andre-gra/oryx-ui" },
              ]}
            />
          </div>

          {/* Accordion */}
          <div
            className={classNames(
              "bg-color4 w-fit backdrop-blur-sm rounded-xl p-6",
              size === "4" && "col-span-2 lg:col-span-1",
            )}
          >
            <h2 className="text-color11 text-xl font-semibold mb-4">Accordion</h2>
            <Accordion
              items={[
                {
                  mainText: "Is it accessible?",
                  collapsibleText: "Yes. It adheres to the WAI-ARIA design pattern.",
                },
                {
                  mainText: "Is it styled?",
                  collapsibleText: "Yes. It uses the Oryx UI theming system.",
                },
                {
                  mainText: "Can it animate?",
                  collapsibleText: "Yes. Built-in slide animations are included.",
                },
              ]}
            />
          </div>

          {/* Select */}
          <div
            className={classNames(
              "bg-color4 w-fit backdrop-blur-sm rounded-xl p-6",
              size === "4" && "col-span-2 lg:col-span-1",
            )}
          >
            <h2 className="text-color11 text-xl font-semibold mb-4">Select</h2>
            <Select
              label="Choose a fruit"
              placeholder="Select fruit..."
              options={[
                {
                  label: "Fruits",
                  group: [
                    { value: "apple", label: "Apple" },
                    { value: "banana", label: "Banana" },
                    { value: "orange", label: "Orange" },
                  ],
                },
                {
                  label: "Vegetables",
                  group: [
                    { value: "carrot", label: "Carrot" },
                    { value: "broccoli", label: "Broccoli" },
                  ],
                },
              ]}
              onValueChange={(value) => console.log("Selected:", value)}
            />
          </div>

          {/* AlertDialog */}
          <div
            className={classNames(
              "bg-color4 w-fit backdrop-blur-sm rounded-xl p-6",
              size === "4" && "col-span-2 lg:col-span-1",
            )}
          >
            <h2 className="text-color11 text-xl font-semibold mb-4">Alert Dialog</h2>
            <AlertDialog
              texts={{
                buttonTrigger: "Delete Account",
                content: "Are you sure?",
                description:
                  "This action cannot be undone. Your account will be permanently deleted.",
                buttonCancel: "Cancel",
                action: "Yes, Delete",
              }}
              onAction={() => console.log("Deleted!")}
              onCancel={() => console.log("Cancelled")}
            />
          </div>

          {/* Popover */}
          <div
            className={classNames(
              "bg-color4 w-fit backdrop-blur-sm rounded-xl p-6",
              size === "4" && "col-span-2 lg:col-span-1",
            )}
          >
            <h2 className="text-color11 text-xl font-semibold mb-4">Popover</h2>
            <Popover
              buttonTriggerLabel="Open settings"
              fields={[
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
                      label: "Height",
                      htmlFor: "height",
                      id: "height",
                      defaultValue: "auto",
                    },
                  ],
                },
              ]}
            />
          </div>
        </div>

        <footer className="mt-12 py-6 text-center border-t border-color6">
          <p className="text-color11">
            Created by{" "}
            <a
              href="https://github.com/andre-gra"
              target="_blank"
              rel="noreferrer"
              className="text-color9 hover:text-color10 hover:underline font-medium transition-colors"
            >
              andre-gra
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
