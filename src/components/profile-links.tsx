type ProfileLinksProps = {
  openInNewTabLabel: string;
  className?: string;
};

export function ProfileLinks({
  openInNewTabLabel,
  className = "",
}: ProfileLinksProps) {
  return (
    <div
      className={`flex flex-wrap gap-x-4 gap-y-1 text-sm ${className}`}
    >
      <a
        href="https://github.com/irwinarruda"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-6 items-center text-fg underline decoration-line-strong underline-offset-4 transition-colors duration-200 hover:decoration-fg"
      >
        github/irwinarruda
        <span className="sr-only"> {openInNewTabLabel}</span>
      </a>
      <a
        href="https://linkedin.com/in/irwinarruda"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-6 items-center text-fg underline decoration-line-strong underline-offset-4 transition-colors duration-200 hover:decoration-fg"
      >
        linkedin/irwinarruda
        <span className="sr-only"> {openInNewTabLabel}</span>
      </a>
      <a
        href="mailto:arruda.irwin@gmail.com"
        className="inline-flex min-h-6 items-center text-fg underline decoration-line-strong underline-offset-4 transition-colors duration-200 hover:decoration-fg"
      >
        arruda.irwin@gmail.com
      </a>
    </div>
  );
}
