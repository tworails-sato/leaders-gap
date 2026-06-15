import { NextResponse } from "next/server";
import { requireApiAdmin } from "@/lib/api-auth";
import { canSendInvitation, formatDeadline, invitationUrl } from "@/lib/invitations";
import { createAdminClient } from "@/lib/supabase";

export async function POST(_: Request, { params }: { params: Promise<{ invitation_id: string }> }) {
  const auth = await requireApiAdmin();
  if (auth.error) return auth.error;
  const { invitation_id } = await params;
  const supabase = createAdminClient();

  const { data: invitation, error: invitationError } = await supabase
    .from("gap_invitations")
    .select("*, gap_projects(company_name, project_name, response_deadline, partner_id)")
    .eq("id", invitation_id)
    .maybeSingle();

  if (invitationError) return NextResponse.json({ error: invitationError.message }, { status: 500 });
  if (!invitation) return NextResponse.json({ error: "招待が見つかりません。" }, { status: 404 });

  const project = Array.isArray(invitation.gap_projects) ? invitation.gap_projects[0] : invitation.gap_projects;
  if (auth.profile.role === "partner" && auth.profile.partner_id !== project?.partner_id) {
    return NextResponse.json({ error: "権限がありません。" }, { status: 403 });
  }

  const sendable = canSendInvitation(invitation);
  if (!sendable.ok) return NextResponse.json({ error: sendable.reason }, { status: 400 });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    return NextResponse.json({ error: "Resend設定が不足しています。" }, { status: 500 });
  }

  const name = invitation.name || "ご担当者";
  const deadline = formatDeadline(invitation.expires_at || project?.response_deadline);
  const url = invitationUrl(invitation.token);
  const text = `${name}様

リーダーズGAP診断へのご回答をお願いいたします。

本診断は、経営層と事業責任者・責任者層の認識差を確認し、
今後の役割分担や権限移譲について整理することを目的としています。

個人の評価や査定を目的としたものではなく、
回答結果は原則として回答者グループの平均値として集計されます。

以下の専用URLよりご回答ください。

【回答用URL】
${url}

【回答期限】
${deadline}

【所要時間】
約10分

※本URLは回答者ごとの専用URLです。
※回答完了後は、原則として同じURLから再回答できません。

ご不明点がございましたら、以下までお問い合わせください。

合同会社Two rails　リーダーズGAP運営担当
info@ceo-sherpa.com`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: invitation.email,
      subject: "【ご回答のお願い】リーダーズGAP診断",
      text
    })
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "招待メールを送信できませんでした。設定またはメールアドレスをご確認ください。" },
      { status: 502 }
    );
  }

  const { error } = await supabase
    .from("gap_invitations")
    .update({
      email_sent_at: new Date().toISOString(),
      email_send_count: (invitation.email_send_count ?? 0) + 1
    })
    .eq("id", invitation_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: "招待メールを送信しました" });
}
