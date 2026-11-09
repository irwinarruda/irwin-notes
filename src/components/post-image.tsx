export function PostImage({ children, legend, noMargin }: { children: React.ReactNode; legend?: string; noMargin?: boolean }) {
  return (
    <div className={noMargin ? "" : "mb-6"}>
      <div className="rounded-lg overflow-hidden border-2 border-line bg-page">
        {children}
      </div>
      {legend && <span className="text-2xs text-center block mt-2">{legend}</span>}
    </div>
  );
}
