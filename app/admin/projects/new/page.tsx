import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { defaultResponseDeadline, toDateTimeLocalInTokyo } from "@/lib/deadlines";

export default async function NewProjectPage() {
  const { supabase } = await requireAdmin();
  const defaultDeadline = toDateTimeLocalInTokyo(defaultResponseDeadline());
  const minimumDeadline = toDateTimeLocalInTokyo(new Date());
  const { data: partners } = await supabase
    .from("partners")
    .select("id, name, company_name, status")
    .eq("status", "active")
    .order("company_name");

  return (
    <main>
      <div className="topbar">
        <div className="brand">案件作成</div>
        <Link className="button secondary" href="/admin/projects">一覧へ</Link>
      </div>
      <section className="shell narrow">
        <form className="form panel" action="/api/projects/create" method="post">
          <label>会社名<input name="company_name" required /></label>
          <label>案件名<input name="project_name" /></label>
          <div className="grid two">
            <label>社長名<input name="ceo_name" /></label>
            <label>社長メール<input name="ceo_email" type="email" /></label>
            <label>想定部長回答人数<input name="expected_leader_count" type="number" min="0" /></label>
            <label>回答期限（日本時間）<input name="response_deadline" type="datetime-local" defaultValue={defaultDeadline} min={minimumDeadline} required /></label>
            <label>紹介・販売パートナー
              <select name="partner_id">
                <option value="">自社直販・未設定</option>
                {(partners ?? []).map((partner) => <option key={partner.id} value={partner.id}>{partner.company_name || partner.name}</option>)}
              </select>
            </label>
            <label>ステータス
              <select name="status" defaultValue="open">
                <option value="open">open</option>
                <option value="closed">closed</option>
              </select>
            </label>
          </div>
          <button type="submit">作成</button>
        </form>
      </section>
    </main>
  );
}
