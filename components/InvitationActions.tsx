"use client";

import { useMemo, useState } from "react";
import { canSendInvitation, formatDeadline, invitationUrl, type InvitationForAction } from "@/lib/invitations";
import { CopyUrlField } from "./CopyUrlField";

type Props = {
  invitation: InvitationForAction;
  hasResponse: boolean;
};

export function InvitationActions({ invitation, hasResponse }: Props) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [revoked, setRevoked] = useState(Boolean(invitation.revoked_at));
  const [sentAt, setSentAt] = useState(invitation.email_sent_at ?? null);
  const [sendCount, setSendCount] = useState(invitation.email_send_count ?? 0);
  const effectiveInvitation = useMemo(() => ({ ...invitation, revoked_at: revoked ? invitation.revoked_at || new Date().toISOString() : null }), [invitation, revoked]);
  const sendable = canSendInvitation(effectiveInvitation);
  const canRevoke = !invitation.used_at && !hasResponse && !revoked;

  async function sendMail() {
    setSending(true);
    setMessage("");
    const response = await fetch(`/api/invitations/${invitation.id}/send`, { method: "POST" });
    const payload = await response.json().catch(() => ({}));
    setSending(false);

    if (!response.ok) {
      setMessage(payload.error || "招待メールを送信できませんでした。設定またはメールアドレスをご確認ください。");
      return;
    }

    setSentAt(new Date().toISOString());
    setSendCount((current) => current + 1);
    setMessage(payload.message || "招待メールを送信しました");
  }

  async function revoke() {
    if (!window.confirm("この招待URLを削除します。削除後、このURLからは回答できなくなります。よろしいですか？")) {
      return;
    }

    setRevoking(true);
    setMessage("");
    const response = await fetch(`/api/invitations/${invitation.id}/revoke`, { method: "POST" });
    const payload = await response.json().catch(() => ({}));
    setRevoking(false);

    if (!response.ok) {
      setMessage(payload.error || "招待URLを削除できませんでした。");
      return;
    }

    setRevoked(true);
    setMessage("招待URLを無効化しました");
  }

  return (
    <div className="grid">
      <CopyUrlField url={invitationUrl(invitation.token)} />
      <div className="nav">
        <button className="secondary" type="button" onClick={sendMail} disabled={!sendable.ok || sending}>
          {sending ? "送信中..." : sentAt ? "招待メールを再送" : "招待メールを送信"}
        </button>
        {canRevoke ? (
          <button className="danger" type="button" onClick={revoke} disabled={revoking}>
            {revoking ? "削除中..." : "削除"}
          </button>
        ) : (
          <span className="muted">{invitation.used_at || hasResponse ? "回答済みの招待は削除できません" : revoked ? "無効化済み" : ""}</span>
        )}
      </div>
      <div className="muted small-text">
        {sentAt ? `最終送信: ${new Date(sentAt).toLocaleString("ja-JP")} / 送信回数: ${sendCount}` : "未送信"}
        {!sendable.ok ? ` / 送信不可: ${sendable.reason}` : ""}
        {invitation.expires_at ? ` / 期限: ${formatDeadline(invitation.expires_at)}` : ""}
      </div>
      {message ? <div className={message.includes("できません") ? "field-error" : "success-text"}>{message}</div> : null}
    </div>
  );
}
