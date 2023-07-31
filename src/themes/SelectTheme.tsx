import { useTheme } from "./useTheme";
import SelectDemo from "../ui/demo/SelectDemo";
import type { Theme } from "./themeProvider";

type ThemeOptions = {
  group: { value: Theme; label: string }[];
  label: string;
};

const options: ThemeOptions[] = [
  {
    group: [
      { value: "theme-amber", label: "Amber" },
      { value: "theme-amberDark", label: "AmberDark" },
      { value: "theme-mintDark", label: "MintDark" },
      { value: "theme-tomatoDark", label: "TomatoDark" },
      { value: "theme-tomato", label: "Tomato" },
      { value: "theme-redDark", label: "RedDark" },
      { value: "theme-crimsonDark", label: "CrimsonDark" },
      { value: "theme-pinkDark", label: "PinkDark" },
      { value: "theme-plumDark", label: "PlumDark" },
      { value: "theme-purpleDark", label: "PurpleDark" },
      { value: "theme-violetDark", label: "VioletDark" },
      { value: "theme-indigoDark", label: "IndigoDark" },
      { value: "theme-blueDark", label: "BlueDark" },
      { value: "theme-cyanDark", label: "CyanDark" },
      { value: "theme-tealDark", label: "TealDark" },
      { value: "theme-greenDark", label: "GreenDark" },
      { value: "theme-grassDark", label: "GrassDark" },
      { value: "theme-orangeDark", label: "OrangeDark" },
      { value: "theme-brownDark", label: "BrownDark" },
      { value: "theme-skyDark", label: "SkyDark" },
      { value: "theme-limeDark", label: "limeDark" },
      { value: "theme-yellowDark", label: "YellowDark" },
      { value: "theme-red", label: "Red" },
      { value: "theme-teal", label: "Teal" },
      { value: "theme-crimson", label: "Crimson" },
      { value: "theme-pink", label: "Pink" },
      { value: "theme-plum", label: "Plum" },
      { value: "theme-purple", label: "Purple" },
      { value: "theme-violet", label: "Violet" },
      { value: "theme-indigo", label: "Indigo" },
      { value: "theme-blue", label: "Blue" },
      { value: "theme-cyan", label: "Cyan" },
      { value: "theme-green", label: "Green" },
      { value: "theme-grass", label: "grass" },
      { value: "theme-orange", label: "Orange" },
      { value: "theme-brown", label: "Brown" },
      { value: "theme-sky", label: "Sky" },
      { value: "theme-mint", label: "Mint" },
      { value: "theme-lime", label: "Lime" },
      { value: "theme-yellow", label: "Yellow" },
    ],
    label: "Theme",
  },
];

const SelectTheme = () => {
  const { theme, changeTheme } = useTheme();

  const handleChangeTheme = () => {
    localStorage.setItem("theme", theme);
    return changeTheme;
  };

  return (
    <SelectDemo
      label="Theme"
      options={options}
      placeholder="Select a theme…"
      value={theme}
      onValueChange={handleChangeTheme()}
    />
  );
};

export default SelectTheme;
