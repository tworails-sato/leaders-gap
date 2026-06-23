"use client";

import { useEffect, useState } from "react";
import { createClientBrowser } from "@/lib/supabase-browser";

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [ready, setReady] = useState(false);
  const [validLink, setValidLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClientBrowser();
    const code = new URLSearchParams(window.location.search).get("code");

    async function establishRecoverySession() {
      try {
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) return;
        }

        const { data } = await supabase.auth.getSession();
        setValidLink(Boolean(data.session));
      } finally {
        setReady(true);
      }
    }

    void establishRecoverySession();
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("パスワードは8文字以上で入力してください。");
      return;
    }
    if (password !== confirmation) {
      setError("確認用パスワードが一致しません。");
      return;
    }

    setLoading(true);
    const supabase = createClientBrowser();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError("この再設定URLは使用できません。再度パスワード再設定をお申し込みください。");
      return;
    }

    await supabase.auth.signOut();
    window.location.replace("/login?reset=success");
  }

  if (!ready) return <p className="muted">再設定URLを確認しています。</p>;

  if (!validLink) {
    return (
      <p className="field-error">
        この再設定URLは使用できません。期限切れまたは使用済みの可能性があります。再度パスワード再設定をお申し込みください。
      </p>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <label>
        新しいパスワード
        <input autoComplete="new-password" minLength={8} required type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </label>
      <label>
        新しいパスワード（確認）
        <input autoComplete="new-password" minLength={8} required type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} />
      </label>
      {error ? <p className="field-error">{error}</p> : null}
      <button disabled={loading} type="submit">{loading ? "変更中" : "パスワードを変更"}</button>
    </form>
  );
}
