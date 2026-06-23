import Link from "next/link";
import { InvitationActions } from "@/components/InvitationActions";
import { requireAdmin } from "@/lib/auth";
import { summarizeResponses } from "@/lib/scoring";
import { defaultResponseDeadline, formatDeadlineInTokyo, isDeadlineExpired, toDateTimeLocalInTokyo } from "@/lib/deadlines";

export default async function ProjectDetailPage({ params }: { params: Promise<{ project_id: string }> }) {
  const { project_id } = await params;
  const { supabase } = await requireAdmin();
  const [{ data: project }, { data: invitations }, { data: responses }] = await Promise.all([
    supabase.from("gap_projects").select("*, partners(id, company_name, name, status)").eq("id", project_id).single(),
    supabase.from("gap_invitations").select("*").eq("project_id", project_id).order("created_at"),
    supabase.from("gap_responses").select("*").eq("project_id", project_id).order("created_at")
  ]);
  const summary = summarizeResponses(responses ?? []);

  if (!project) {
    return <main className="shell"><h1>案件が見つかりません</h1></main>;
  }
  const invitationDeadline = project.response_deadline && !isDeadlineExpired(project.response_deadline)
    ? new Date(project.response_deadline)
    : defaultResponseDeadline();
  const invitationDeadlineInput = toDateTimeLocalInTokyo(invitationDeadline);
  const minimumDeadline = toDateTimeLocalInTokyo(new Date());

  return (
    <main>
      <div className="topbar">
        <div className="brand">{project.company_name}</div>
        <nav className="nav">
          <Link className="button secondary" href="/admin/projects">一覧へ</Link>
          <Link className="button" href={`/admin/projects/${project.id}/report`}>FBレポート</Link>
          <a className="button secondary" href={`/api/projects/${project.id}/export`}>CSV出力</a>
        </nav>
      </div>
      <section className="shell grid">
        <div className="grid three">
          <div className="panel stat"><h2>{summary.responseCounts.ceo ? "回答済み" : "未回答"}</h2><p className="muted">社長回答状況</p></div>
          <div className="panel stat"><h2>{summary.responseCounts.managers}</h2><p className="muted">部長回答数</p></div>
          <div className="panel stat"><h2>{summary.topGaps[0]?.name ?? "-"}</h2><p className="muted">最大GAPテーマ</p></div>
          <div className="panel stat"><h2>{project.partners?.company_name || project.partners?.name || "自社直販"}</h2><p className="muted">紹介・販売パートナー</p></div>
        </div>

        <div className="panel">
          <h2>招待URL作成</h2>
          <p className="muted small-text">案件の回答期限: {formatDeadlineInTokyo(project.response_deadline)}。招待ごとに変更できます。</p>
          <form className="form" action="/api/invitations/create" method="post">
            <input type="hidden" name="project_id" value={project.id} />
            <div className="grid three">
              <label>回答者区分
                <select name="respondent_type" defaultValue="manager">
                  <option value="ceo">社長</option>
                  <option value="executive">経営層・取締役</option>
                  <option value="manager">部長・事業責任者</option>
                </select>
              </label>
              <label>氏名<input name="name" /></label>
              <label>メール<input name="email" type="email" /></label>
              <label>回答期限（日本時間）<input name="response_deadline" type="datetime-local" defaultValue={invitationDeadlineInput} min={minimumDeadline} required /></label>
            </div>
            <button type="submit">招待URLを作成</button>
          </form>
        </div>

        <div className="panel table-wrap">
          <h2>招待URL管理</h2>
          <table>
            <thead><tr><th>区分</th><th>氏名</th><th>メール</th><th>状態</th><th>期限</th><th>送信</th><th>操作</th></tr></thead>
            <tbody>
              {(invitations ?? []).map((invitation) => {
                const hasResponse = (responses ?? []).some((response) => response.invitation_id === invitation.id);
                return (
                  <tr key={invitation.id}>
                    <td>{invitation.respondent_type}</td>
                    <td>{invitation.name}</td>
                    <td>{invitation.email || <span className="muted">未登録</span>}</td>
                    <td>{invitation.revoked_at ? "無効化済み" : invitation.used_at ? "使用済み" : "未使用"}</td>
                    <td>{formatDeadlineInTokyo(invitation.expires_at)}</td>
                    <td>{invitation.email_sent_at ? `${new Date(invitation.email_sent_at).toLocaleString("ja-JP")} / ${invitation.email_send_count ?? 0}回` : "未送信"}</td>
                    <td><InvitationActions invitation={invitation} hasResponse={hasResponse} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="grid two">
          <ScoreTable title="大テーマ別GAP" rows={summary.bigThemeScores} />
          <ScoreTable title="小テーマ別GAP" rows={summary.smallThemeScores} />
        </div>

        <div className="grid two">
          <ScoreTable title="最大GAP上位3" rows={summary.topGaps} />
          <ScoreTable title="GAPの少ないテーマ" rows={summary.lowGaps} />
        </div>

        <div className="panel table-wrap">
          <h2>設問別GAP</h2>
          <table>
            <thead><tr><th>No</th><th>設問</th><th>社長</th><th>部長平均</th><th>GAP</th><th>判定</th></tr></thead>
            <tbody>
              {summary.questionScores.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td><td>{row.text}</td><td>{row.ceoScore ?? "-"}</td><td>{row.managerAverage ?? "-"}</td><td>{row.gap ?? "-"}</td><td>{row.judgment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel table-wrap">
          <h2>回答者一覧</h2>
          <table>
            <thead><tr><th>区分</th><th>氏名</th><th>メール</th><th>所属</th><th>役職</th><th>回答日時</th></tr></thead>
            <tbody>
              {(responses ?? []).map((row) => (
                <tr key={row.id}>
                  <td>{row.respondent_type}</td><td>{row.name}</td><td>{row.email}</td><td>{row.department}</td><td>{row.position}</td><td>{new Date(row.created_at).toLocaleString("ja-JP")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function ScoreTable({ title, rows }: { title: string; rows: Array<{ key: string; name: string; ceoScore: number | null; managerAverage: number | null; gap: number | null; absoluteGap: number | null; standardDeviation: number | null; judgment: string }> }) {
  return (
    <div className="panel table-wrap">
      <h2>{title}</h2>
      <table>
        <thead><tr><th>テーマ</th><th>社長</th><th>部長平均</th><th>GAP</th><th>abs</th><th>標準偏差</th><th>判定</th></tr></thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              <td>{row.name}</td><td>{row.ceoScore ?? "-"}</td><td>{row.managerAverage ?? "-"}</td><td>{row.gap ?? "-"}</td><td>{row.absoluteGap ?? "-"}</td><td>{row.standardDeviation ?? "-"}</td><td>{row.judgment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
