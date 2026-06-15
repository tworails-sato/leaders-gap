import { NextResponse } from "next/server";
import { requireApiAdmin } from "@/lib/api-auth";
import { createAdminClient } from "@/lib/supabase";

export async function POST(_: Request, { params }: { params: Promise<{ invitation_id: string }> }) {
  const auth = await requireApiAdmin();
  if (auth.error) return auth.error;
  const { invitation_id } = await params;
  const supabase = createAdminClient();

  const { data: invitation, error: invitationError } = await supabase
    .from("gap_invitations")
    .select("id, project_id, used_at, revoked_at, gap_projects(partner_id)")
    .eq("id", invitation_id)
    .maybeSingle();

  if (invitationError) return NextResponse.json({ error: invitationError.message }, { status: 500 });
  if (!invitation) return NextResponse.json({ error: "招待が見つかりません。" }, { status: 404 });

  const project = Array.isArray(invitation.gap_projects) ? invitation.gap_projects[0] : invitation.gap_projects;
  if (auth.profile.role === "partner" && auth.profile.partner_id !== project?.partner_id) {
    return NextResponse.json({ error: "権限がありません。" }, { status: 403 });
  }

  if (invitation.used_at) {
    return NextResponse.json({ error: "回答済みの招待は削除できません。" }, { status: 409 });
  }

  const { count, error: responseError } = await supabase
    .from("gap_responses")
    .select("id", { count: "exact", head: true })
    .eq("invitation_id", invitation_id);

  if (responseError) return NextResponse.json({ error: responseError.message }, { status: 500 });
  if ((count ?? 0) > 0) {
    return NextResponse.json({ error: "回答データが存在する招待は削除できません。" }, { status: 409 });
  }

  const { error } = await supabase
    .from("gap_invitations")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", invitation_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
