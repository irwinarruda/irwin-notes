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
        className="inline-flex min-h-6 items-center text-term-blue transition-colors duration-200 hover:text-term-cyan"
      >
        github/irwinarruda
        <span className="sr-only"> {openInNewTabLabel}</span>
      </a>
      <a
        href="https://linkedin.com/in/irwinarruda"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-6 items-center text-term-blue transition-colors duration-200 hover:text-term-cyan"
      >
        linkedin/irwinarruda
        <span className="sr-only"> {openInNewTabLabel}</span>
      </a>
      <a
        href="mailto:arruda.irwin@gmail.com"
        className="inline-flex min-h-6 items-center text-term-blue transition-colors duration-200 hover:text-term-cyan"
      >
        arruda.irwin@gmail.com
      </a>
    </div>
  );
}
