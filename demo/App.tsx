import {
  OryxProvider,
  Accordion,
  Select,
  AlertDialog,
  NavigationMenu,
  Popover,
  useTheme,
  useSize,
  ThemeAgentPanel,
} from "../src";
import "../src/oryx.css";

const ThemeSelector = () => {
  const { theme, changeTheme } = useTheme();
  const { size, changeSize } = useSize();

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
        { value: "theme-black", label: "Black" },
        { value: "theme-blackDark", label: "Black Dark" },
        { value: "theme-white", label: "White" },
        { value: "theme-whiteDark", label: "White Dark" },
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
    <div className="flex gap-4 flex-wrap mb-8 p-4 bg-color2 rounded-lg border border-color6">
      <div className="flex items-center gap-2">
        <label className="text-color12 font-semibold">Theme:</label>
        <Select
          label="Theme"
          value={theme}
          options={themeOptions}
          onValueChange={(val) => changeTheme(val as any)}
          className="min-w-[140px]"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-color12 font-semibold">Size:</label>
        <Select
          label="Size"
          value={size}
          options={sizeOptions}
          onValueChange={(val) => changeSize(val as any)}
          className="min-w-[100px]"
        />
      </div>
      <div className="flex-1 min-w-[300px]">
        <ThemeAgentPanel />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <OryxProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white text-center mb-2">🦌 Oryx UI Demo</h1>
          <p className="text-gray-300 text-center mb-8">Testing the component library</p>

          <ThemeSelector />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Accordion */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-white text-xl font-semibold mb-4">Accordion</h2>
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
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-white text-xl font-semibold mb-4">Select</h2>
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
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-white text-xl font-semibold mb-4">Alert Dialog</h2>
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
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-white text-xl font-semibold mb-4">Popover</h2>
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

            {/* Navigation Menu - Full width */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:col-span-2">
              <h2 className="text-white text-xl font-semibold mb-4">Navigation Menu</h2>
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
          </div>
        </div>
      </div>
    </OryxProvider>
  );
};

export default App;
