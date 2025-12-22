
interface ErrorTextProps {
  children: React.ReactNode;
}

export default function ErrorText({ children }: ErrorTextProps) {
  if (!children) return null; 
  
  return (
    <p className="text-destructive text-sm mt-1 animate-in slide-in-from-top-1">
      {children}
    </p>
  );
}