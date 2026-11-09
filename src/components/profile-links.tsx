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
        className="inline-flex min-h-6 items-center text-sky-11 underline decoration-sky-11/40 underline-offset-4 transition-colors duration-200 hover:decoration-sky-11"
      >
        github/irwinarruda
        <span className="sr-only"> {openInNewTabLabel}</span>
      </a>
      <a
        href="https://linkedin.com/in/irwinarruda"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-6 items-center text-sky-11 underline decoration-sky-11/40 underline-offset-4 transition-colors duration-200 hover:decoration-sky-11"
      >
        linkedin/irwinarruda
        <span className="sr-only"> {openInNewTabLabel}</span>
      </a>
      <a
        href="mailto:arruda.irwin@gmail.com"
        className="inline-flex min-h-6 items-center text-sky-11 underline decoration-sky-11/40 underline-offset-4 transition-colors duration-200 hover:decoration-sky-11"
      >
        arruda.irwin@gmail.com
      </a>
    </div>
  );
}
