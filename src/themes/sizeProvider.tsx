import React, { createContext, useState } from "react";

export type Size = "2" | "3" | "4";

export interface SizeContextProps {
  size: Size;
  changeSize: (size: Size) => void;
}

export const SizeContext = createContext<SizeContextProps | null>(null);

type ProviderProps = {
  children: React.ReactNode;
};

const SizeProvider: React.FC<ProviderProps> = ({ children }: ProviderProps) => {
  const [currentSize, setCurrentSize] = useState<Size>(() => {
    const localSize = localStorage.getItem("size");
    return localSize !== null ? (localSize as Size) : "3";
  });

  return (
    <SizeContext.Provider
      value={{
        size: currentSize,
        changeSize: setCurrentSize,
      }}
    >
      {children}
    </SizeContext.Provider>
  );
};

export default SizeProvider;
