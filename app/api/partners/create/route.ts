import { NextResponse } from "next/server";
import { requireApiAdmin } from "@/lib/api-auth";
import { createAdminClient } from "@/lib/supabase";

export async function POST(request: Request) {
  const auth = await requireApiAdmin();
  if (auth.error) return auth.error;

  const form = await request.formData();
  const companyName = String(form.get("company_name") || "").trim();
  const contactName = String(form.get("contact_name") || "").trim();
  if (!companyName || !contactName) {
    return NextResponse.json({ error: "会社名と担当者名は必須です。" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("partners").insert({
    name: companyName,
    company_name: companyName,
    contact_name: contactName,
    website: form.get("website") || null,
    email: form.get("email") || null,
    status: form.get("status") || "active",
    notes: form.get("notes") || null
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.redirect(new URL("/admin/partners", request.url), 303);
}
