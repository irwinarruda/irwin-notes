export function PostCallout({ children }: { children: React.ReactNode }) {
  return (
    <aside className="my-6 rounded-lg border border-term-border bg-term-bg/70 px-4 py-3 text-sm text-term-text">
      {children}
    </aside>
  );
}
