"use client";

import { useEffect, useId, useRef, useState } from "react";

export default function ProgrammeDescription({ body, title }: { body: string; title: string }) {
  const [expanded, setExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    const measure = () => {
      const lineHeight = Number.parseFloat(getComputedStyle(content).lineHeight);
      setHasOverflow(content.scrollHeight > lineHeight * 5 + 1);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    return () => observer.disconnect();
  }, [body]);

  return (
    <div className="programme-description">
      <div id={id} className={`programme-description-window${expanded ? " is-expanded" : ""}`}>
        <div ref={contentRef} className="programme-description-content">
          {body.split(/\r?\n\s*\r?\n/).filter(Boolean).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
      <div className="programme-description-actions">
        {hasOverflow && (
          <button
            type="button"
            className="programme-read-more"
            aria-expanded={expanded}
            aria-controls={id}
            aria-label={`${expanded ? "Read less" : "Read more"} about ${title}`}
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? "Read less" : "Read more"} <span aria-hidden="true">{expanded ? "−" : "+"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
