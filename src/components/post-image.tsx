export function PostImage({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg overflow-hidden border-2 border-term-border ring-1 ring-term-green/20 bg-term-bg">
      {children}
    </div>
  );
}
