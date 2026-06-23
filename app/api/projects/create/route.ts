import { NextResponse } from "next/server";
import { requireApiAdmin } from "@/lib/api-auth";
import { createAdminClient } from "@/lib/supabase";
import { deadlineFromTokyoInput } from "@/lib/deadlines";

export async function POST(request: Request) {
  const auth = await requireApiAdmin();
  if (auth.error) return auth.error;

  const form = await request.formData();
  const supabase = createAdminClient();
  const token = crypto.randomUUID();
  const deadline = deadlineFromTokyoInput(String(form.get("response_deadline") || ""));
  if (!deadline) {
    return NextResponse.json({ error: "回答期限は現在より後の日時を指定してください。" }, { status: 400 });
  }

  const { data: project, error } = await supabase
    .from("gap_projects")
    .insert({
      company_name: form.get("company_name"),
      project_name: form.get("project_name") || null,
      ceo_name: form.get("ceo_name") || null,
      ceo_email: form.get("ceo_email") || null,
      expected_leader_count: Number(form.get("expected_leader_count") || 0),
      response_deadline: deadline.toISOString(),
      partner_id: form.get("partner_id") || null,
      status: form.get("status") || "open",
      project_token: token
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  await supabase.from("gap_invitations").insert({
    project_id: project.id,
    respondent_type: "ceo",
    name: form.get("ceo_name") || null,
    email: form.get("ceo_email") || null,
    token: crypto.randomUUID(),
    expires_at: project.response_deadline
  });

  return NextResponse.redirect(new URL(`/admin/projects/${project.id}`, request.url), 303);
}
