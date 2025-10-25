import { forwardRef } from "react";

import { cn } from "@/lib/utils";

export type SVGIconProps = React.ComponentProps<"svg"> & {
  children: React.ReactNode;
  className?: string;
  size?: number;
  viewBox?: string;
};

const SVGIcon = forwardRef<SVGSVGElement, SVGIconProps>((props, ref) => {
  const {
    children,
    className,
    size,
    width,
    height,
    viewBox = "0 0 24 24",
    ...rest
  } = props;

  return (
    <svg
      ref={ref}
      viewBox={viewBox}
      aria-hidden
      width={width || size}
      height={height || size}
      className={cn("select-none inline-block shrink-0", className)}
      {...rest}
    >
      {children}
    </svg>
  );
});

SVGIcon.displayName = "SVGIcon";

export default SVGIcon;
