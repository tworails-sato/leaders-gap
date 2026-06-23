import { NextResponse } from "next/server";
import { requireApiAdmin } from "@/lib/api-auth";
import { createAdminClient } from "@/lib/supabase";
import { deadlineFromTokyoInput } from "@/lib/deadlines";

export async function POST(request: Request) {
  const auth = await requireApiAdmin();
  if (auth.error) return auth.error;

  const form = await request.formData();
  const supabase = createAdminClient();
  const projectId = String(form.get("project_id"));
  const { data: project } = await supabase.from("gap_projects").select("response_deadline").eq("id", projectId).single();
  const enteredDeadline = String(form.get("response_deadline") || "");
  const deadline = enteredDeadline
    ? deadlineFromTokyoInput(enteredDeadline)
    : project?.response_deadline
      ? new Date(project.response_deadline)
      : deadlineFromTokyoInput("");

  if (!deadline || deadline.getTime() <= Date.now()) {
    return NextResponse.json({ error: "回答期限は現在より後の日時を指定してください。" }, { status: 400 });
  }

  const { error } = await supabase.from("gap_invitations").insert({
    project_id: projectId,
    respondent_type: form.get("respondent_type") || "manager",
    name: form.get("name") || null,
    email: form.get("email") || null,
    token: crypto.randomUUID(),
    expires_at: deadline.toISOString()
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.redirect(new URL(`/admin/projects/${projectId}`, request.url), 303);
}
