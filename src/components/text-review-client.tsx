"use client";

import {
  useState,
  useMemo,
  useCallback,
  useRef,
  Fragment,
} from "react";
import { diffWords } from "diff";

// ─── Types ──────────────────────────────────────────────────────────

type ReviewNote = {
  typeOfNote: string;
  note: string;
  explanation: string;
};

type ReviewSuggestion = {
  position: string;
  suggestedText: string;
};

type InternalSuggestion = ReviewSuggestion & {
  id: number;
  applied: boolean;
};

type LineHighlight = {
  suggestionId: number;
  startCol: number;
  endCol: number;
};

type ReviewTexts = {
  reviewBadge: string;
  reviewScoresHeading: string;
  avgLabel: string;
  suggestionsHeading: string;
  pendingLabel: string;
  appliedLabel: string;
  totalLabel: string;
  prevButton: string;
  nextButton: string;
  suggestionLabel: string;
  dismissLabel: string;
  applyButton: string;
  suggestionsApplied: string;
  readOnlyPreview: string;
  copiedButton: string;
  copyRawFileButton: string;
  noteLabels: Record<string, string>;
};

type TextReviewClientProps = {
  initialContent: string;
  notes: ReviewNote[];
  suggestions: ReviewSuggestion[];
  fileName: string;
  texts: ReviewTexts;
};

// ─── Diff-Based Highlight Computation ───────────────────────────────

function computeDiffHighlights(
  originalLine: string,
  suggestedLine: string,
  suggestionId: number,
): LineHighlight[] {
  const changes = diffWords(originalLine, suggestedLine);
  const highlights: LineHighlight[] = [];
  let col = 1; // 1-indexed column position in the original line

  for (const change of changes) {
    if (change.removed) {
      // This part exists in the original but is removed/replaced in the suggestion
      highlights.push({
        suggestionId,
        startCol: col,
        endCol: col + change.value.length,
      });
      col += change.value.length;
    } else if (!change.added) {
      // Unchanged text — advance position in original
      col += change.value.length;
    }
    // Added text doesn't exist in original, so don't advance col
  }

  // If no removed segments were found but there ARE added segments (pure insertion),
  // highlight the entire line. If texts are identical, return no highlights.
  if (highlights.length === 0 && originalLine.length > 0) {
    const hasAdditions = changes.some((c) => c.added);
    if (hasAdditions) {
      highlights.push({
        suggestionId,
        startCol: 1,
        endCol: originalLine.length + 1,
      });
    }
  }

  return highlights;
}

function getHighlightsForLine(
  lineNum: number,
  lineContent: string,
  suggestions: InternalSuggestion[],
): LineHighlight[] {
  for (const s of suggestions) {
    if (s.applied) continue;
    const suggestionLine = parseInt(s.position, 10);
    if (suggestionLine !== lineNum) continue;
    return computeDiffHighlights(lineContent, s.suggestedText, s.id);
  }
  return [];
}

// ─── Note Labels & Colors ───────────────────────────────────────────

function formatNoteType(type: string, noteLabels: Record<string, string>): string {
  return noteLabels[type] ?? type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function scoreColor(score: number): string {
  if (score >= 7.5) return "text-term-green";
  if (score >= 6.5) return "text-term-amber";
  return "text-term-red";
}

function scoreBgColor(score: number): string {
  if (score >= 7.5) return "bg-term-green";
  if (score >= 6.5) return "bg-term-amber";
  return "bg-term-red";
}

// ─── Score Card Component ───────────────────────────────────────────

function ScoreCard({
  note,
  isExpanded,
  onToggle,
  noteLabels,
}: {
  note: ReviewNote;
  isExpanded: boolean;
  onToggle: () => void;
  noteLabels: Record<string, string>;
}) {
  const score = parseFloat(note.note);
  const filled = Math.round(score);
  const empty = 10 - filled;

  return (
    <button
      onClick={onToggle}
      className="group flex flex-col gap-1.5 rounded-lg border border-term-border bg-term-bg/60 px-3 py-2.5 text-left transition-all duration-200 hover:border-term-muted hover:bg-term-bg/90"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-2xs font-mono uppercase tracking-widest text-term-muted">
          {formatNoteType(note.typeOfNote, noteLabels)}
        </span>
        <span className={`font-mono text-sm font-bold ${scoreColor(score)}`}>
          {note.note}
        </span>
      </div>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < filled ? scoreBgColor(score) : "bg-term-border"
            } ${i < filled ? "opacity-80" : "opacity-40"}`}
          />
        ))}
      </div>
      {isExpanded && (
        <p className="mt-1 text-xs leading-relaxed text-term-text font-serif">
          {note.explanation}
        </p>
      )}
    </button>
  );
}

// ─── Score Dashboard ────────────────────────────────────────────────

function ScoreDashboard({ notes, texts }: { notes: ReviewNote[]; texts: ReviewTexts }) {
  const [expandedNote, setExpandedNote] = useState<string | null>(null);

  const averageScore =
    notes.reduce((sum, n) => sum + parseFloat(n.note), 0) / notes.length;

  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-mono text-sm font-semibold uppercase tracking-widest text-term-green">
          <span className="text-term-muted mr-1">&gt;</span>
          {texts.reviewScoresHeading}
        </h2>
        <div className="flex items-center gap-2">
          <span className="font-mono text-2xs uppercase tracking-wide text-term-muted">
            {texts.avgLabel}
          </span>
          <span
            className={`font-mono text-lg font-bold ${scoreColor(averageScore)}`}
          >
            {averageScore.toFixed(1)}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {notes.map((note) => (
          <ScoreCard
            key={note.typeOfNote}
            note={note}
            isExpanded={expandedNote === note.typeOfNote}
            onToggle={() =>
              setExpandedNote(
                expandedNote === note.typeOfNote ? null : note.typeOfNote,
              )
            }
            noteLabels={texts.noteLabels}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Suggestion Detail Card ─────────────────────────────────────────

function InlineDiffLine({
  originalText,
  suggestedText,
  mode,
}: {
  originalText: string;
  suggestedText: string;
  mode: "removed" | "added";
}) {
  const changes = diffWords(originalText, suggestedText);
  const segments: React.ReactNode[] = [];

  for (let i = 0; i < changes.length; i++) {
    const change = changes[i];
    if (mode === "removed") {
      if (change.removed) {
        segments.push(
          <span
            key={i}
            className="bg-term-red/20 text-term-red rounded-sm px-0.5"
          >
            {change.value}
          </span>,
        );
      } else if (!change.added) {
        segments.push(
          <span key={i} className="text-term-muted">
            {change.value}
          </span>,
        );
      }
    } else {
      if (change.added) {
        segments.push(
          <span
            key={i}
            className="bg-term-green/20 text-term-green rounded-sm px-0.5"
          >
            {change.value}
          </span>,
        );
      } else if (!change.removed) {
        segments.push(
          <span key={i} className="text-term-muted">
            {change.value}
          </span>,
        );
      }
    }
  }

  return <>{segments}</>;
}

function SuggestionDetailCard({
  originalText,
  suggestedText,
  onApply,
  onDismiss,
  texts,
}: {
  originalText: string;
  suggestedText: string;
  onApply: () => void;
  onDismiss: () => void;
  texts: ReviewTexts;
}) {
  return (
    <div className="review-suggestion-card mx-8 my-1 rounded-lg border border-term-amber/30 bg-term-bg/95 shadow-lg shadow-black/20 overflow-hidden">
      <div className="flex items-center justify-between border-b border-term-border px-3 py-1.5">
        <span className="font-mono text-2xs uppercase tracking-widest text-term-amber">
          {texts.suggestionLabel}
        </span>
        <button
          onClick={onDismiss}
          className="flex h-5 w-5 items-center justify-center rounded text-term-muted transition-colors hover:bg-term-border hover:text-term-text"
          aria-label={texts.dismissLabel}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 1l8 8M9 1l-8 8" />
          </svg>
        </button>
      </div>
      <div className="px-3 py-2 space-y-1.5">
        <div className="flex gap-2">
          <span className="shrink-0 font-mono text-xs text-term-red select-none">
            -
          </span>
          <pre className="flex-1 whitespace-pre-wrap break-words font-mono text-xs leading-relaxed">
            <InlineDiffLine
              originalText={originalText}
              suggestedText={suggestedText}
              mode="removed"
            />
          </pre>
        </div>
        <div className="flex gap-2">
          <span className="shrink-0 font-mono text-xs text-term-green select-none">
            +
          </span>
          <pre className="flex-1 whitespace-pre-wrap break-words font-mono text-xs leading-relaxed">
            <InlineDiffLine
              originalText={originalText}
              suggestedText={suggestedText}
              mode="added"
            />
          </pre>
        </div>
      </div>
      <div className="flex justify-end border-t border-term-border px-3 py-1.5">
        <button
          onClick={onApply}
          className="flex items-center gap-1.5 rounded border border-term-green/30 bg-term-green/10 px-3 py-1 font-mono text-xs text-term-green transition-all duration-200 hover:bg-term-green/20 hover:border-term-green/50"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 6l3 3 5-5" />
          </svg>
          {texts.applyButton}
        </button>
      </div>
    </div>
  );
}

// ─── Content Line Renderer ──────────────────────────────────────────

function ContentLine({
  lineContent,
  lineNum,
  highlights,
  activeSuggestionId,
  onHighlightClick,
  isFrontmatter,
}: {
  lineContent: string;
  lineNum: number;
  highlights: LineHighlight[];
  activeSuggestionId: number | null;
  onHighlightClick: (id: number) => void;
  isFrontmatter: boolean;
}) {
  if (highlights.length === 0) {
    return (
      <div className="review-line group flex">
        <span className="review-line-number shrink-0 select-none pr-4 text-right font-mono text-xs leading-6 text-term-muted/50 w-10 sm:w-12">
          {lineNum}
        </span>
        <span className="review-line-sep shrink-0 mr-3 w-px bg-term-border/50 self-stretch" />
        <span
          className={`flex-1 font-mono text-sm leading-6 whitespace-pre-wrap break-words ${
            isFrontmatter
              ? "text-term-muted/60"
              : "text-term-text"
          }`}
        >
          {lineContent || "\u00A0"}
        </span>
      </div>
    );
  }

  const segments: React.ReactNode[] = [];
  let pos = 0;

  for (const h of highlights) {
    const startIdx = h.startCol - 1;
    const endIdx = Math.min(h.endCol - 1, lineContent.length);

    if (pos < startIdx) {
      segments.push(
        <span key={`pre-${pos}`}>{lineContent.slice(pos, startIdx)}</span>,
      );
    }

    const isActive = activeSuggestionId === h.suggestionId;

    segments.push(
      <button
        key={`hl-${h.suggestionId}-${lineNum}-${h.startCol}`}
        onClick={() => onHighlightClick(h.suggestionId)}
        className={`review-highlight inline text-left whitespace-pre-wrap rounded-sm px-0.5 -mx-0.5 transition-all duration-200 cursor-pointer ${
          isActive
            ? "bg-term-amber/25 text-term-bright ring-1 ring-term-amber/50"
            : "bg-term-amber/10 text-term-amber-strong hover:bg-term-amber/20"
        }`}
      >
        {lineContent.slice(startIdx, endIdx)}
      </button>,
    );

    pos = endIdx;
  }

  if (pos < lineContent.length) {
    segments.push(
      <span key={`post-${pos}`}>{lineContent.slice(pos)}</span>,
    );
  }

  return (
    <div className="review-line group flex">
      <span className="review-line-number shrink-0 select-none pr-4 text-right font-mono text-xs leading-6 text-term-muted/50 w-10 sm:w-12">
        {lineNum}
      </span>
      <span className="review-line-sep shrink-0 mr-3 w-px bg-term-border/50 self-stretch" />
      <span
        className={`flex-1 font-mono text-sm leading-6 whitespace-pre-wrap break-words ${
          isFrontmatter ? "text-term-muted/60" : "text-term-text"
        }`}
      >
        {segments}
      </span>
    </div>
  );
}

// ─── Suggestion Navigation ──────────────────────────────────────────

function SuggestionNav({
  pending,
  applied,
  total,
  onPrev,
  onNext,
  texts,
}: {
  pending: number;
  applied: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  texts: ReviewTexts;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-term-border bg-term-bg/60 px-4 py-2.5">
      <div className="flex items-center gap-4">
        <h2 className="font-mono text-sm font-semibold uppercase tracking-widest text-term-green">
          <span className="text-term-muted mr-1">&gt;</span>
          {texts.suggestionsHeading}
        </h2>
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-term-amber">
            {pending} {texts.pendingLabel}
          </span>
          <span className="text-term-muted">/</span>
          <span className="text-term-green">
            {applied} {texts.appliedLabel}
          </span>
          <span className="text-term-muted">/</span>
          <span className="text-term-muted">
            {total} {texts.totalLabel}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onPrev}
          disabled={pending === 0}
          className="flex h-7 items-center gap-1 rounded border border-term-border px-2 font-mono text-xs text-term-muted transition-colors hover:border-term-muted hover:text-term-text disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M7 1L3 5l4 4" />
          </svg>
          {texts.prevButton}
        </button>
        <button
          onClick={onNext}
          disabled={pending === 0}
          className="flex h-7 items-center gap-1 rounded border border-term-border px-2 font-mono text-xs text-term-muted transition-colors hover:border-term-muted hover:text-term-text disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {texts.nextButton}
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 1l4 4-4 4" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────

export function TextReviewClient({
  initialContent,
  notes,
  suggestions: rawSuggestions,
  fileName,
  texts,
}: TextReviewClientProps) {
  const [content, setContent] = useState(initialContent);
  const [suggestions, setSuggestions] = useState<InternalSuggestion[]>(() =>
    rawSuggestions.map((s, i) => ({ ...s, id: i, applied: false })),
  );
  const [activeSuggestionId, setActiveSuggestionId] = useState<number | null>(
    null,
  );
  const [flashLineRange, setFlashLineRange] = useState<{
    from: number;
    to: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const lines = useMemo(() => content.split("\n"), [content]);

  const frontmatterEnd = useMemo(() => {
    if (lines[0]?.trim() !== "---") return -1;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i]?.trim() === "---") return i;
    }
    return -1;
  }, [lines]);

  const activeSuggestion = useMemo(
    () =>
      activeSuggestionId !== null
        ? suggestions.find((s) => s.id === activeSuggestionId) ?? null
        : null,
    [activeSuggestionId, suggestions],
  );

  const pendingCount = useMemo(
    () => suggestions.filter((s) => !s.applied).length,
    [suggestions],
  );
  const appliedCount = useMemo(
    () => suggestions.filter((s) => s.applied).length,
    [suggestions],
  );

  const scrollToLine = useCallback((lineNum: number) => {
    const lineEl = lineRefs.current.get(lineNum);
    if (lineEl) {
      lineEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  const navigateToSuggestion = useCallback(
    (direction: "prev" | "next") => {
      const pending = suggestions.filter((s) => !s.applied);
      if (pending.length === 0) return;

      if (activeSuggestionId === null) {
        const target = pending[0];
        setActiveSuggestionId(target.id);
        scrollToLine(parseInt(target.position, 10));
        return;
      }

      const currentIndex = pending.findIndex(
        (s) => s.id === activeSuggestionId,
      );
      let nextIndex: number;
      if (currentIndex === -1) {
        nextIndex = 0;
      } else if (direction === "next") {
        nextIndex = (currentIndex + 1) % pending.length;
      } else {
        nextIndex = (currentIndex - 1 + pending.length) % pending.length;
      }
      const target = pending[nextIndex];
      setActiveSuggestionId(target.id);
      scrollToLine(parseInt(target.position, 10));
    },
    [suggestions, activeSuggestionId, scrollToLine],
  );

  const applySuggestion = useCallback(
    (id: number) => {
      const suggestion = suggestions.find((s) => s.id === id);
      if (!suggestion || suggestion.applied) return;

      const lineNum = parseInt(suggestion.position, 10);
      const currentLines = content.split("\n");

      // Replace the target line with the suggested text
      currentLines[lineNum - 1] = suggestion.suggestedText;
      const newContent = currentLines.join("\n");

      // Mark this suggestion as applied (no position recalculation needed
      // since each suggestion targets exactly one line and replaces it 1:1)
      const newSuggestions = suggestions.map((s) =>
        s.id === id ? { ...s, applied: true } : s,
      );

      // Flash the affected line
      setFlashLineRange({ from: lineNum, to: lineNum });
      setTimeout(() => setFlashLineRange(null), 600);

      setContent(newContent);
      setSuggestions(newSuggestions);
      setActiveSuggestionId(null);
    },
    [content, suggestions],
  );

  const handleHighlightClick = useCallback(
    (id: number) => {
      setActiveSuggestionId(activeSuggestionId === id ? null : id);
    },
    [activeSuggestionId],
  );

  const activeOriginalText = useMemo(() => {
    if (!activeSuggestion) return "";
    const lineNum = parseInt(activeSuggestion.position, 10);
    return lines[lineNum - 1] ?? "";
  }, [activeSuggestion, lines]);

  // Show the detail card on the same line as the suggestion
  const activeDetailLine = useMemo(() => {
    if (!activeSuggestion) return -1;
    return parseInt(activeSuggestion.position, 10);
  }, [activeSuggestion]);

  return (
    <div className="fade-in fade-in-delay-1">
      {/* File header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="text-term-green"
          >
            <path
              d="M3 1h7l3 3v9a2 2 0 01-2 2H3a2 2 0 01-2-2V3a2 2 0 012-2z"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path d="M10 1v3h3" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          <h1 className="font-mono text-base font-semibold text-term-bright">
            {fileName}
          </h1>
        </div>
        <span className="rounded border border-term-cyan/30 bg-term-cyan/8 px-1.5 py-0.5 font-mono text-2xs text-term-cyan">
          {texts.reviewBadge}
        </span>
      </div>

      <div className="mb-4 border-t border-term-border" />

      {/* Score Dashboard */}
      <ScoreDashboard notes={notes} texts={texts} />

      <div className="mb-4 border-t border-term-border" />

      {/* Suggestion Navigation */}
      <div className="mb-4">
        <SuggestionNav
          pending={pendingCount}
          applied={appliedCount}
          total={suggestions.length}
          onPrev={() => navigateToSuggestion("prev")}
          onNext={() => navigateToSuggestion("next")}
          texts={texts}
        />
      </div>

      <div className="mb-4 border-t border-term-border" />

      {/* Content Viewer */}
      <div
        ref={contentRef}
        className="review-content overflow-x-auto rounded-lg border border-term-border bg-term-bg/40"
      >
        <div className="py-3">
          {lines.map((line, i) => {
            const lineNum = i + 1;
            const isFrontmatter =
              frontmatterEnd >= 0 && lineNum <= frontmatterEnd + 1;
            const highlights = getHighlightsForLine(lineNum, line, suggestions);
            const isFlashing =
              flashLineRange &&
              lineNum >= flashLineRange.from &&
              lineNum <= flashLineRange.to;

            return (
              <Fragment key={`${lineNum}-${line.slice(0, 20)}`}>
                <div
                  ref={(el) => {
                    if (el) lineRefs.current.set(lineNum, el);
                  }}
                  className={`transition-colors duration-300 ${
                    isFlashing
                      ? "bg-term-green/10"
                      : ""
                  }`}
                >
                  <ContentLine
                    lineContent={line}
                    lineNum={lineNum}
                    highlights={highlights}
                    activeSuggestionId={activeSuggestionId}
                    onHighlightClick={handleHighlightClick}
                    isFrontmatter={isFrontmatter}
                  />
                </div>
                {activeDetailLine === lineNum && activeSuggestion && (
                  <SuggestionDetailCard
                    originalText={activeOriginalText}
                    suggestedText={activeSuggestion.suggestedText}
                    onApply={() => applySuggestion(activeSuggestion.id)}
                    onDismiss={() => setActiveSuggestionId(null)}
                    texts={texts}
                  />
                )}
              </Fragment>
            );
          })}
        </div>
      </div>

      {/* Footer actions */}
      <div className="mt-3 flex items-center justify-between">
        <span className="font-mono text-2xs text-term-muted">
          {appliedCount > 0
            ? texts.suggestionsApplied
                .replace("{applied}", String(appliedCount))
                .replace("{total}", String(suggestions.length))
            : texts.readOnlyPreview}
        </span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(content).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            });
          }}
          className="flex items-center gap-1.5 rounded border border-term-green/30 bg-term-green/10 px-3 py-1.5 font-mono text-xs text-term-green transition-all duration-200 hover:bg-term-green/20 hover:border-term-green/50"
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 6l3 3 5-5" />
              </svg>
              {texts.copiedButton}
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="4" y="4" width="7" height="7" rx="1" />
                <path d="M8 4V2a1 1 0 00-1-1H2a1 1 0 00-1 1v5a1 1 0 001 1h2" />
              </svg>
              {texts.copyRawFileButton}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
