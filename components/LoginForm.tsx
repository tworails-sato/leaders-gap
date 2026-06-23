"use client";

import Link from "next/link";
import { useState } from "react";
import { createClientBrowser } from "@/lib/supabase-browser";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClientBrowser();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (signInError) {
      setError("メールアドレスまたはパスワードが正しくありません。");
      return;
    }

    window.location.href = "/admin/projects";
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <label>
        メールアドレス
        <input autoComplete="email" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label>
        パスワード
        <input autoComplete="current-password" required type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </label>
      <Link className="text-link" href="/forgot-password">パスワードを忘れた方</Link>
      {error ? <p className="field-error">{error}</p> : null}
      <button type="submit" disabled={loading}>{loading ? "ログイン中" : "ログイン"}</button>
    </form>
  );
}
