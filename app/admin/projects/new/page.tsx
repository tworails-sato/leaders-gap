import Link from "next/link";
import { requireAdmin } from "@/lib/auth";

export default async function NewProjectPage() {
  const { supabase } = await requireAdmin();
  const { data: partners } = await supabase.from("partners").select("id, name").order("name");

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
            <label>回答期限<input name="response_deadline" type="datetime-local" /></label>
            <label>パートナー
              <select name="partner_id">
                <option value="">未設定</option>
                {(partners ?? []).map((partner) => <option key={partner.id} value={partner.id}>{partner.name}</option>)}
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
