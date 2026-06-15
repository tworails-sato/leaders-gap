import { NextResponse } from "next/server";
import { requireApiAdmin } from "@/lib/api-auth";
import { createAdminClient } from "@/lib/supabase";

export async function POST(request: Request) {
  const auth = await requireApiAdmin();
  if (auth.error) return auth.error;

  const form = await request.formData();
  const projectId = String(form.get("project_id"));
  const supabase = createAdminClient();
  const { error } = await supabase.from("gap_projects").delete().eq("id", projectId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.redirect(new URL("/admin/projects", request.url), 303);
}
