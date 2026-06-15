import { NextResponse } from "next/server";
import { createClientServer } from "./supabase";

export async function requireApiAdmin() {
  const supabase = await createClientServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("id, role, partner_id")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { user: data.user, profile };
}
