import { NextResponse } from "next/server";
import { requireApiAdmin } from "@/lib/api-auth";
import { createAdminClient } from "@/lib/supabase";

export async function POST(request: Request) {
  const auth = await requireApiAdmin();
  if (auth.error) return auth.error;

  const form = await request.formData();
  const projectId = String(form.get("project_id"));
  const supabase = createAdminClient();
  const row = {
    project_id: projectId,
    summary: form.get("summary") || null,
    result_overview: form.get("result_overview") || null,
    max_gap: form.get("max_gap") || null,
    low_gap_strength: form.get("low_gap_strength") || null,
    gap_factors: form.get("gap_factors") || null,
    executive_view: form.get("executive_view") || null,
    field_view: form.get("field_view") || null,
    short_term_action: form.get("short_term_action") || null,
    mid_term_action: form.get("mid_term_action") || null,
    notes: form.get("notes") || null,
    snapshot: JSON.parse(String(form.get("snapshot") || "{}")),
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase
    .from("gap_feedback_reports")
    .upsert(row, { onConflict: "project_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.redirect(new URL(`/admin/projects/${projectId}/report`, request.url), 303);
}
