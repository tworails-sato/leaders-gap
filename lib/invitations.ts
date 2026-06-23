import { appUrl } from "./app-url";
import { formatDeadlineInTokyo, isDeadlineExpired } from "./deadlines";

export type InvitationForAction = {
  id: string;
  project_id: string;
  respondent_type: string;
  name: string | null;
  email: string | null;
  token: string;
  expires_at: string | null;
  used_at: string | null;
  revoked_at?: string | null;
  email_sent_at?: string | null;
  email_send_count?: number | null;
  gap_projects?: {
    company_name?: string | null;
    project_name?: string | null;
    response_deadline?: string | null;
    partner_id?: string | null;
  } | null;
};

export function invitationUrl(token: string) {
  return `${appUrl()}/respond/${token}`;
}

export function isExpired(expiresAt?: string | null) {
  return isDeadlineExpired(expiresAt);
}

export function canSendInvitation(invitation: InvitationForAction) {
  if (!invitation.email) return { ok: false, reason: "メールアドレス未登録" };
  if (invitation.used_at) return { ok: false, reason: "回答済み" };
  if (invitation.revoked_at) return { ok: false, reason: "無効化済み" };
  if (isExpired(invitation.expires_at)) return { ok: false, reason: "回答期限切れ" };
  return { ok: true, reason: "" };
}

export function formatDeadline(expiresAt?: string | null) {
  return formatDeadlineInTokyo(expiresAt);
}
