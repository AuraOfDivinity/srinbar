"use client";

import { useEffect, useId, useRef } from "react";

type AdvisoryCardProps = {
  name: string;
  role?: string;
  bio?: string;
  expertise?: string[];
  imageUrl?: string;
  imageAlt?: string;
};

export default function AdvisoryCard({ name, role, bio, expertise, imageUrl, imageAlt }: AdvisoryCardProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousOverflow = useRef<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const titleId = useId();
  const dialogId = useId();
  const hasProfile = Boolean(bio || expertise?.length);

  const restoreScroll = () => {
    if (previousOverflow.current !== null) {
      document.body.style.overflow = previousOverflow.current;
      previousOverflow.current = null;
    }
  };

  useEffect(() => () => {
    if (closeTimer.current !== null) clearTimeout(closeTimer.current);
    restoreScroll();
  }, []);

  const closeProfile = () => {
    const dialog = dialogRef.current;
    if (!dialog?.open || closeTimer.current !== null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      dialog.close();
      return;
    }
    dialog.dataset.closing = "true";
    // Keep the dialog in the top layer until its exit fade finishes.
    closeTimer.current = setTimeout(() => {
      closeTimer.current = null;
      dialog.close();
    }, 160);
  };

  const openProfile = () => {
    if (!dialogRef.current || dialogRef.current.open) return;
    delete dialogRef.current.dataset.closing;
    dialogRef.current.showModal();
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  };

  const portrait = (inModal = false) => imageUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={imageUrl} alt={imageAlt || `Portrait of ${name}`} loading={inModal ? "eager" : "lazy"} className="advisory-portrait" />
  ) : (
    <div className="advisory-portrait advisory-placeholder" aria-hidden="true">
      {name.replace(/^(Mr\.|Ms\.|Dr\.|Eng\.)\s*/i, "").split(" ").map((part) => part[0]).join("")}
    </div>
  );

  return (
    <article className="advisory-card">
      <div className="advisory-card-header">
        {portrait()}
        <div className="advisory-identity">
          <h3>{name}</h3>
          {role && <p className="advisory-role">{role}</p>}
          {hasProfile && (
            <button type="button" className="advisory-profile-button" aria-haspopup="dialog" aria-controls={dialogId} onClick={openProfile}>
              View profile<span className="sr-only"> for {name}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d="m9 6 6 6-6 6" />
              </svg>
            </button>
          )}
        </div>
      </div>
      {hasProfile && (
        <dialog
          ref={dialogRef}
          id={dialogId}
          className="advisory-modal"
          aria-labelledby={titleId}
          onClose={() => {
            if (closeTimer.current !== null) clearTimeout(closeTimer.current);
            closeTimer.current = null;
            if (dialogRef.current) delete dialogRef.current.dataset.closing;
            restoreScroll();
          }}
          onCancel={(event) => {
            event.preventDefault();
            closeProfile();
          }}
          onClick={(event) => {
            if (event.target !== event.currentTarget) return;
            const bounds = event.currentTarget.getBoundingClientRect();
            if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
              closeProfile();
            }
          }}
        >
          <div className="advisory-modal-toolbar">
            <button type="button" autoFocus className="advisory-modal-close" onClick={closeProfile} aria-label={`Close profile for ${name}`}>Close <span aria-hidden="true">×</span></button>
          </div>
          <div className="advisory-modal-content">
            <div className="advisory-card-header">
              {portrait(true)}
              <div>
                <h2 id={titleId}>{name}</h2>
                {role && <p className="advisory-role">{role}</p>}
              </div>
            </div>
            <div className="advisory-biography">
              {bio?.split(/\r?\n\s*\r?\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>
            {!!expertise?.length && (
              <div className="advisory-expertise">
                <h3>Expertise</h3>
                <ul>{expertise.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            )}
          </div>
        </dialog>
      )}
    </article>
  );
}
