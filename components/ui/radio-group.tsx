import React from "react";

type RadioGroupContextValue = {
  value?: string;
  onValueChange?: (value: string) => void;
};

const RadioGroupContext = React.createContext<RadioGroupContextValue>({});

type RadioGroupProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
};

export function RadioGroup({ value, onValueChange, children, className }: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div className={className}>{children}</div>
    </RadioGroupContext.Provider>
  );
}

type RadioGroupItemProps = React.InputHTMLAttributes<HTMLInputElement> & {
  value: string;
};

export const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ value, ...props }, ref) => {
    const context = React.useContext(RadioGroupContext);

    return (
      <input
        ref={ref}
        type="radio"
        checked={context.value === value}
        onChange={() => context.onValueChange?.(value)}
        value={value}
        {...props}
      />
    );
  },
);

RadioGroupItem.displayName = "RadioGroupItem";
