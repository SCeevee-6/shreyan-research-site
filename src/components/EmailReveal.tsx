"use client";

import { useState } from "react";
import { CopyButton } from "./CopyButton";

/**
 * The address is assembled only when a reader asks for it, so it never appears
 * whole in the HTML that crawlers and harvesters read.
 */
export function EmailReveal({ user, domain }: { user: string; domain: string }) {
  const [shown, setShown] = useState(false);
  const address = `${user}@${domain}`;

  if (!shown) {
    return (
      <div>
        <p className="text-[1.75rem] leading-tight text-ink-3 sm:text-[2.25rem]" aria-hidden>
          {user} <span className="text-[0.6em] tracking-wide">[at]</span> {domain.replace(/\./g, " · ")}
        </p>
        <button type="button" className="bracket mt-4" onClick={() => setShown(true)}>
          Show the address
        </button>
      </div>
    );
  }
  return (
    <div>
      <p className="text-[1.75rem] leading-tight sm:text-[2.25rem]">
        <a href={`mailto:${address}`} className="break-all">
          {address}
        </a>
      </p>
      <p className="mt-4 flex gap-4">
        <a href={`mailto:${address}`} className="bracket">
          Write
        </a>
        <CopyButton text={address} label="Copy address" />
      </p>
    </div>
  );
}
