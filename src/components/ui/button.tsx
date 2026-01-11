import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Premium variants
        premium: "relative overflow-hidden bg-gradient-to-r from-primary via-primary to-accent text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]",
        success: "bg-success text-success-foreground hover:bg-success/90 shadow-sm shadow-success/20",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 shadow-sm shadow-warning/20",
        "ghost-primary": "text-primary hover:bg-primary/10 hover:text-primary",
        "ghost-destructive": "text-destructive hover:bg-destructive/10 hover:text-destructive",
        glow: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_-5px_hsl(var(--primary)/0.5)] hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.7)]",
        glass: "bg-background/50 backdrop-blur-md border border-border/50 hover:bg-background/80 hover:border-primary/30",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  ripple?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps & { "aria-label"?: string }>(
  ({ className, variant, size, asChild = false, loading = false, ripple = false, children, disabled, ...props }, ref) => {
    const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([]);
    
    const handleClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      if (ripple && !disabled && !loading) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now();
        
        setRipples(prev => [...prev, { x, y, id }]);
        
        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== id));
        }, 600);
      }
      
      props.onClick?.(e);
    }, [ripple, disabled, loading, props]);
    
    if (asChild) {
      return <Slot className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>{children}</Slot>;
    }
    
    return (
      <button 
        className={cn(
          buttonVariants({ variant, size, className }),
          ripple && "relative overflow-hidden",
          loading && "cursor-wait"
        )} 
        ref={ref} 
        disabled={disabled || loading}
        onClick={handleClick}
        {...props}
      >
        {/* Ripple effects */}
        {ripple && ripples.map(({ x, y, id }) => (
          <span
            key={id}
            className="absolute rounded-full bg-white/30 animate-ripple pointer-events-none"
            style={{
              left: x,
              top: y,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
        
        {/* Loading spinner */}
        {loading && (
          <svg
            className="animate-spin h-4 w-4 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {/* Premium shine effect */}
        {variant === "premium" && (
          <span className="absolute inset-0 overflow-hidden">
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shine" />
          </span>
        )}
        
        <span className={cn(loading && "opacity-70")}>
          {children}
        </span>
      </button>
    );
  },
);
Button.displayName = "Button";

// Motion Button variant for advanced animations
interface MotionButtonProps extends Omit<HTMLMotionProps<"button">, "ref">, VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

const MotionButton = React.forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
MotionButton.displayName = "MotionButton";

// Icon Button with tooltip support
interface IconButtonProps extends ButtonProps {
  tooltip?: string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, size = "icon", tooltip, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        size={size}
        className={cn("rounded-full", className)}
        aria-label={tooltip}
        {...props}
      />
    );
  }
);
IconButton.displayName = "IconButton";

export { Button, MotionButton, IconButton, buttonVariants };