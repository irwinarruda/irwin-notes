export function PostCallout({ children }: { children: React.ReactNode }) {
  return (
    <aside className="my-6 rounded-lg border border-info-line bg-info-soft px-4 py-3 text-base text-info">
      {children}
    </aside>
  );
}
