import { useContext } from "react";
import { SizeContext, SizeContextProps } from "./sizeProvider";

export const useSize = () => useContext(SizeContext) as SizeContextProps;
