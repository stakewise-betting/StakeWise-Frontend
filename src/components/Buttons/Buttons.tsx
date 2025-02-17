import { Button } from "@/components/ui/button";

// Define the props types for ButtonOutline component
interface ButtonOutlineProps {
  children: React.ReactNode; // This will accept any valid React node (text, JSX, etc.)
  className?: string; // This is optional
  [key: string]: any; // This allows other props to be passed down to the Button component (like onClick, etc.)
}

export function ButtonOutline({
  children,
  className,
  ...props
}: ButtonOutlineProps) {
  return (
    <Button variant="outline" className={className} {...props}>
      {children}
    </Button>
  );
}

export function ButtonSecondary() {
  return <Button variant="secondary">Secondary</Button>;
}
