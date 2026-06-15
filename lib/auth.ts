import { redirect } from "next/navigation";
import { createClientServer } from "./supabase";

export async function requireAdmin() {
  const supabase = await createClientServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("*")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile) {
    redirect("/login?error=profile");
  }

  return { supabase, user: data.user, profile };
}
