import Link from "next/link";
import { RadarComparisonChart } from "@/components/RadarComparisonChart";
import { requireAdmin } from "@/lib/auth";
import { summarizeLeadershipComparison, summarizeResponses } from "@/lib/scoring";

export default async function ReportPage({ params }: { params: Promise<{ project_id: string }> }) {
  const { project_id } = await params;
  const { supabase } = await requireAdmin();
  const [{ data: project }, { data: responses }, { data: report }] = await Promise.all([
    supabase.from("gap_projects").select("*").eq("id", project_id).single(),
    supabase.from("gap_responses").select("*").eq("project_id", project_id),
    supabase.from("gap_feedback_reports").select("*").eq("project_id", project_id).maybeSingle()
  ]);
  const summary = summarizeResponses(responses ?? []);
  const comparison = summarizeLeadershipComparison(responses ?? []);

  return (
    <main>
      <div className="topbar">
        <div className="brand">FBレポート</div>
        <Link className="button secondary" href={`/admin/projects/${project_id}`}>案件詳細へ</Link>
      </div>
      <section className="shell grid">
        <div className="panel">
          <h1>{project?.company_name} {project?.project_name}</h1>
          <div className="grid three">
            <div><strong>回答者数</strong><p>{summary.responseCounts.total}</p></div>
            <div><strong>最大GAP</strong><p>{summary.topGaps[0]?.name ?? "-"}</p></div>
            <div><strong>GAPの少ないテーマ</strong><p>{summary.lowGaps[0]?.name ?? "-"}</p></div>
          </div>
        </div>

        <div className="panel">
          <h2>経営層と現場の認識差レーダーチャート</h2>
          {comparison.hasEnoughData ? (
            <RadarComparisonChart data={comparison.themes} executiveLabel={comparison.executiveLabel} fieldLabel={comparison.fieldLabel} />
          ) : (
            <p className="muted">
              比較に必要な回答が揃っていません。<br />
              経営層と現場側の双方の回答完了後に表示されます。
            </p>
          )}
        </div>

        <div className="panel table-wrap">
          <h2>8テーマ別比較表</h2>
          <table>
            <thead><tr><th>テーマ</th><th>{comparison.executiveLabel}</th><th>{comparison.fieldLabel}</th><th>GAP</th><th>判定</th></tr></thead>
            <tbody>
              {comparison.themes.map((row) => (
                <tr key={row.key}>
                  <td>{row.theme}</td>
                  <td>{row.executiveScore ?? "-"}</td>
                  <td>{row.fieldScore ?? "-"}</td>
                  <td>{row.gap ?? "-"}</td>
                  <td>{row.judgment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid two">
          <div className="panel table-wrap">
            <h2>大テーマ別GAP</h2>
            <table><thead><tr><th>テーマ</th><th>GAP</th><th>判定</th></tr></thead><tbody>
              {summary.bigThemeScores.map((row) => <tr key={row.key}><td>{row.name}</td><td>{row.gap ?? "-"}</td><td>{row.judgment}</td></tr>)}
            </tbody></table>
          </div>
          <div className="panel table-wrap">
            <h2>最大GAP上位3</h2>
            <table><thead><tr><th>テーマ</th><th>GAP</th><th>判定</th></tr></thead><tbody>
              {summary.topGaps.map((row) => <tr key={row.key}><td>{row.name}</td><td>{row.gap ?? "-"}</td><td>{row.judgment}</td></tr>)}
            </tbody></table>
          </div>
          <div className="panel table-wrap">
            <h2>GAPが小さいテーマ</h2>
            <table><thead><tr><th>テーマ</th><th>GAP</th><th>判定</th></tr></thead><tbody>
              {summary.lowGaps.map((row) => <tr key={row.key}><td>{row.name}</td><td>{row.gap ?? "-"}</td><td>{row.judgment}</td></tr>)}
            </tbody></table>
          </div>
        </div>

        <form className="form panel" action="/api/reports/save" method="post">
          <input type="hidden" name="project_id" value={project_id} />
          <input type="hidden" name="snapshot" value={JSON.stringify({ summary, comparison })} />
          <label>診断サマリー<textarea name="summary" defaultValue={report?.summary ?? ""} /></label>
          <label>結果一覧<textarea name="result_overview" defaultValue={report?.result_overview ?? ""} /></label>
          <label>最大GAP<textarea name="max_gap" defaultValue={report?.max_gap ?? ""} /></label>
          <label>GAPの少ないところ＝組織としての強み<textarea name="low_gap_strength" defaultValue={report?.low_gap_strength ?? ""} /></label>
          <label>GAPが発生している要因<textarea name="gap_factors" defaultValue={report?.gap_factors ?? ""} /></label>
          <label>ズレについて経営サイド側の認識<textarea name="executive_view" defaultValue={report?.executive_view ?? ""} /></label>
          <label>ズレについて現場サイド側の認識<textarea name="field_view" defaultValue={report?.field_view ?? ""} /></label>
          <label>具体的な施策、権限移譲の進め方：短期1〜6か月<textarea name="short_term_action" defaultValue={report?.short_term_action ?? ""} /></label>
          <label>具体的な施策、権限移譲の進め方：短中期6か月〜1年<textarea name="mid_term_action" defaultValue={report?.mid_term_action ?? ""} /></label>
          <label>備考<textarea name="notes" defaultValue={report?.notes ?? ""} /></label>
          <button type="submit">保存</button>
        </form>
      </section>
    </main>
  );
}
