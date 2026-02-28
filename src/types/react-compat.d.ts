import "react";

declare module "react" {
  function forwardRef(render: any): any;
  function createContext(defaultValue?: any): any;
  function useContext(context: any): any;
  function useRef(initialValue?: any): any;
  function useState(initialValue?: any): any;
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}

declare module "@radix-ui/react-*" {
  const mod: any;
  export = mod;
}

declare module "react-hook-form" {
  const mod: any;
  export = mod;
}

declare module "@hookform/resolvers/*" {
  const mod: any;
  export = mod;
}

declare module "input-otp" {
  const mod: any;
  export = mod;
}

declare module "react-resizable-panels" {
  const mod: any;
  export = mod;
}

declare module "recharts" {
  const mod: any;
  export = mod;
}

declare global {
  interface Element {
    innerText: string;
    dataset: DOMStringMap;
  }

  interface SVGAnimatedString {
    baseVal: string;
  }
}
