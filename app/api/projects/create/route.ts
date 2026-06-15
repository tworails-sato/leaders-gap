import { NextResponse } from "next/server";
import { requireApiAdmin } from "@/lib/api-auth";
import { createAdminClient } from "@/lib/supabase";

export async function POST(request: Request) {
  const auth = await requireApiAdmin();
  if (auth.error) return auth.error;

  const form = await request.formData();
  const supabase = createAdminClient();
  const token = crypto.randomUUID();
  const deadline = String(form.get("response_deadline") || "");

  const { data: project, error } = await supabase
    .from("gap_projects")
    .insert({
      company_name: form.get("company_name"),
      project_name: form.get("project_name") || null,
      ceo_name: form.get("ceo_name") || null,
      ceo_email: form.get("ceo_email") || null,
      expected_leader_count: Number(form.get("expected_leader_count") || 0),
      response_deadline: deadline ? new Date(deadline).toISOString() : null,
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
