"use client";

import { useState } from "react";

export function CopyUrlField({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="nav">
      <input readOnly value={url} />
      <button className="secondary" type="button" onClick={copy}>{copied ? "コピー済み" : "コピー"}</button>
    </div>
  );
}
