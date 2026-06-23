"use client";

import Link from "next/link";
import { useState } from "react";
import { createClientBrowser } from "@/lib/supabase-browser";

const completionMessage = "該当するアカウントがある場合、パスワード再設定用のメールを送信しました。";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const supabase = createClientBrowser();
      await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`
      });
    } finally {
      // Do not reveal whether the email address belongs to an account.
      setCompleted(true);
      setLoading(false);
    }
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <label>
        メールアドレス
        <input
          autoComplete="email"
          disabled={completed || loading}
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      {completed ? <p className="success-text">{completionMessage}</p> : null}
      {!completed ? <button disabled={loading} type="submit">{loading ? "送信中" : "再設定URLを送信"}</button> : null}
      <Link className="text-link" href="/login">ログイン画面へ戻る</Link>
    </form>
  );
}
