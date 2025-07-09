import * as React from "react";
import { cn } from "../../lib/utils";

const DropdownMenu = ({ children, ...props }) => {
  return <div className="relative inline-block text-left" {...props}>{children}</div>;
};

const DropdownMenuTrigger = ({ children, asChild = false, ...props }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <div onClick={() => setIsOpen(!isOpen)} {...props}>
      {children}
    </div>
  );
};

const DropdownMenuContent = React.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      align === "end" && "right-0",
      align === "start" && "left-0",
      align === "center" && "left-1/2 -translate-x-1/2",
      className
    )}
    {...props}
  />
));

const DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem };