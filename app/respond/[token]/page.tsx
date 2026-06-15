import { redirect } from "next/navigation";
import { ResponseForm } from "@/components/ResponseForm";
import { createAdminClient } from "@/lib/supabase";

export default async function RespondPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = createAdminClient();
  const { data: invitation } = await supabase
    .from("gap_invitations")
    .select("*, gap_projects(company_name, project_name)")
    .eq("token", token)
    .maybeSingle();

  if (!invitation) {
    redirect("/expired");
  }

  if (invitation.used_at) {
    redirect("/used");
  }

  if (invitation.revoked_at) {
    redirect("/expired");
  }

  if (invitation.expires_at && new Date(invitation.expires_at) < new Date()) {
    redirect("/expired");
  }

  return (
    <main className="shell">
      <div className="narrow">
        <span className="badge">回答者専用URL</span>
        <h1>リーダーズGAP診断</h1>
        <p className="muted">{invitation.gap_projects?.company_name} {invitation.gap_projects?.project_name}</p>
      </div>
      <ResponseForm invitation={invitation} />
    </main>
  );
}
