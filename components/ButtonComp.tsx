"use client";
import { Button } from "@mui/material";
import classNames from "classnames";
import React, { ReactNode } from "react";

interface Component {
  children: ReactNode;
  clickEvent?: Function | undefined;
  invert?: boolean;
  customClass?: string;
}
const ButtonComp: React.FC<Component> = ({
  children,
  clickEvent,
  invert,
  customClass,
}) => {
  return (
    <Button
      type="submit"
      className={classNames(
        "px-6 py-3 text-base rounded-full  shadow-xl  shadow-violet-950  text-orange-200 font-semibold hover:bg-buttonHover flex gap-4",
        invert ? "bg-red-600 hover:bg-red-700" : "bg-button",
        customClass
      )}
      // disabled={!file}
      onClick={clickEvent}
    >
      {children}
    </Button>
  );
};

export default ButtonComp;
