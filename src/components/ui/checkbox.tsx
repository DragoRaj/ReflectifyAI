
import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const CheckboxItem = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
CheckboxItem.displayName = CheckboxPrimitive.Root.displayName;

interface CheckboxGroupProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  children: React.ReactNode;
  className?: string;
}

const CheckboxGroup = ({
  value,
  onValueChange,
  children,
  className,
  ...props
}: CheckboxGroupProps & Omit<React.HTMLAttributes<HTMLDivElement>, 'onValueChange'>) => {
  return (
    <div className={cn("", className)} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          const itemValue = child.props.value as string;
          
          // Create valid props for the checkbox item
          const checkboxProps = {
            checked: value.includes(itemValue),
            onCheckedChange: (checked: boolean) => {
              if (checked) {
                onValueChange([...value, itemValue]);
              } else {
                onValueChange(value.filter((v) => v !== itemValue));
              }
            },
          };
          
          return React.cloneElement(child, checkboxProps);
        }
        return child;
      })}
    </div>
  );
};

export { CheckboxItem, CheckboxGroup };
