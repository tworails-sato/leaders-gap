import Link from "next/link";
import { requireAdmin } from "@/lib/auth";

export default async function PartnersPage() {
  const { supabase } = await requireAdmin();
  const [{ data: partners }, { data: projects }] = await Promise.all([
    supabase.from("partners").select("*").order("created_at", { ascending: false }),
    supabase.from("gap_projects").select("id, partner_id")
  ]);

  return (
    <main>
      <div className="topbar">
        <div className="brand">パートナー管理</div>
        <nav className="nav">
          <Link className="button secondary" href="/admin/projects">案件一覧</Link>
          <Link className="button" href="/admin/partners/new">パートナー登録</Link>
        </nav>
      </div>
      <section className="shell">
        <div className="panel table-wrap">
          <table>
            <thead>
              <tr><th>会社名</th><th>担当者名</th><th>メールアドレス</th><th>Webサイト</th><th>紐づく案件数</th><th>ステータス</th><th>操作</th></tr>
            </thead>
            <tbody>
              {(partners ?? []).map((partner) => {
                const projectCount = (projects ?? []).filter((project) => project.partner_id === partner.id).length;
                return (
                  <tr key={partner.id}>
                    <td>{partner.company_name || partner.name}</td>
                    <td>{partner.contact_name || "-"}</td>
                    <td>{partner.email || "-"}</td>
                    <td>{partner.website ? <a href={partner.website} target="_blank" rel="noreferrer">{partner.website}</a> : "-"}</td>
                    <td>{projectCount}</td>
                    <td>{partner.status === "suspended" ? "停止中" : "有効"}</td>
                    <td><Link className="button secondary" href={`/admin/partners/${partner.id}/edit`}>編集</Link></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
