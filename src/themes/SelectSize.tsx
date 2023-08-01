import { useSize } from "./useSize";
import SelectDemo from "../ui/demo/SelectDemo";
import type { Size } from "./sizeProvider";

type SizeOptions = {
  group: { value: Size; label: string }[];
  label: string;
};

const options: SizeOptions[] = [
  {
    group: [
      { value: "2", label: "Small" },
      { value: "3", label: "Base" },
      { value: "4", label: "Large" },
    ],
    label: "Size",
  },
];

const SelectSize = () => {
  const { size, changeSize } = useSize();

  const handleChangeSize = () => {
    localStorage.setItem("size", size);
    return changeSize;
  };

  return (
    <SelectDemo
      label="Size"
      options={options}
      placeholder="Select the size of compoenents…"
      value={size}
      onValueChange={handleChangeSize()}
    />
  );
};

export default SelectSize;
