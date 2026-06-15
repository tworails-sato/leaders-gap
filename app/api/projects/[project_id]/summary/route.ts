import { NextResponse } from "next/server";
import { requireApiAdmin } from "@/lib/api-auth";
import { summarizeResponses } from "@/lib/scoring";
import { createAdminClient } from "@/lib/supabase";

export async function GET(_: Request, { params }: { params: Promise<{ project_id: string }> }) {
  const { project_id } = await params;
  const auth = await requireApiAdmin();
  if (auth.error) return auth.error;

  const supabase = createAdminClient();
  const { data, error } = await supabase.from("gap_responses").select("*").eq("project_id", project_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(summarizeResponses(data ?? []));
}
