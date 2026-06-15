import Link from "next/link";
import { DeleteProjectButton } from "@/components/DeleteProjectButton";
import { requireAdmin } from "@/lib/auth";
import { summarizeResponses } from "@/lib/scoring";

export default async function ProjectsPage() {
  const { supabase } = await requireAdmin();
  const { data: projects } = await supabase
    .from("gap_projects")
    .select("*, partners(id, company_name, name, status), gap_invitations(*), gap_responses(*)")
    .order("created_at", { ascending: false });

  return (
    <main>
      <div className="topbar">
        <div className="brand">リーダーズGAP診断</div>
        <nav className="nav">
          <Link className="button secondary" href="/admin/partners">パートナー管理</Link>
          <Link className="button" href="/admin/projects/new">案件作成</Link>
        </nav>
      </div>
      <section className="shell">
        <h1>案件一覧</h1>
        <div className="table-wrap panel">
          <table>
            <thead>
              <tr>
                <th>作成日時</th><th>会社名</th><th>案件名</th><th>パートナー</th><th>社長名</th><th>社長回答</th><th>部長回答数</th><th>最大GAPテーマ</th><th>ステータス</th><th>操作</th>
              </tr>
            </thead>
            <tbody>
              {(projects ?? []).map((project) => {
                const summary = summarizeResponses(project.gap_responses ?? []);
                const ceoDone = (project.gap_responses ?? []).some((row: { respondent_type: string }) => row.respondent_type === "ceo");
                return (
                  <tr key={project.id}>
                    <td>{new Date(project.created_at).toLocaleDateString("ja-JP")}</td>
                    <td>{project.company_name}</td>
                    <td>{project.project_name}</td>
                    <td>{project.partners?.company_name || project.partners?.name || "自社直販・未設定"}</td>
                    <td>{project.ceo_name}</td>
                    <td>{ceoDone ? "回答済み" : "未回答"}</td>
                    <td>{summary.responseCounts.managers}</td>
                    <td>{summary.topGaps[0]?.name ?? "-"}</td>
                    <td>{project.status}</td>
                    <td className="nav">
                      <Link className="button secondary" href={`/admin/projects/${project.id}`}>詳細</Link>
                      <a className="button secondary" href={`/api/projects/${project.id}/export`}>CSV</a>
                      <DeleteProjectButton projectId={project.id} />
                    </td>
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
