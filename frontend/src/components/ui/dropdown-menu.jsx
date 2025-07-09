import * as React from "react";
import { cn } from "../../lib/utils";

const DropdownMenu = React.forwardRef(({ children, open, onOpenChange, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(open || false);

  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  const handleOpenChange = (newOpen) => {
    setIsOpen(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  return (
    <div 
      ref={ref}
      className="relative inline-block text-left" 
      {...props}
    >
      {React.Children.map(children, child => 
        React.cloneElement(child, { 
          isOpen, 
          onOpenChange: handleOpenChange 
        })
      )}
    </div>
  );
});
DropdownMenu.displayName = "DropdownMenu";

const DropdownMenuTrigger = React.forwardRef(({ children, asChild = false, isOpen, onOpenChange, ...props }, ref) => {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onOpenChange) {
      onOpenChange(!isOpen);
    }
  };

  return (
    <div ref={ref} onClick={handleClick} {...props}>
      {children}
    </div>
  );
});
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuContent = React.forwardRef(({ 
  className, 
  align = "center", 
  sideOffset = 4, 
  isOpen, 
  onOpenChange,
  forceMount,
  children,
  ...props 
}, ref) => {
  const contentRef = React.useRef(null);

  // Close when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && contentRef.current && !contentRef.current.contains(event.target)) {
        if (onOpenChange) {
          onOpenChange(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onOpenChange]);

  // Close on escape key
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen && onOpenChange) {
        onOpenChange(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onOpenChange]);

  if (!isOpen && !forceMount) {
    return null;
  }

  return (
    <div
      ref={contentRef}
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
        align === "end" && "right-0",
        align === "start" && "left-0",
        align === "center" && "left-1/2 -translate-x-1/2",
        className
      )}
      style={{ 
        top: '100%', 
        marginTop: sideOffset,
        display: isOpen ? 'block' : 'none'
      }}
      {...props}
    >
      {React.Children.map(children, child => 
        React.cloneElement(child, { 
          onOpenChange 
        })
      )}
    </div>
  );
});
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef(({ 
  className, 
  inset, 
  onOpenChange,
  onClick,
  ...props 
}, ref) => {
  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
    // Close the dropdown after clicking an item
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        inset && "pl-8",
        className
      )}
      onClick={handleClick}
      {...props}
    />
  );
});
DropdownMenuItem.displayName = "DropdownMenuItem";

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem };