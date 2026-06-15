import Link from "next/link";
import { requireAdmin } from "@/lib/auth";

export default async function EditPartnerPage({ params }: { params: Promise<{ partner_id: string }> }) {
  const { partner_id } = await params;
  const { supabase } = await requireAdmin();
  const { data: partner } = await supabase.from("partners").select("*").eq("id", partner_id).single();

  if (!partner) {
    return <main className="shell"><h1>パートナーが見つかりません</h1></main>;
  }

  return (
    <main>
      <div className="topbar">
        <div className="brand">パートナー編集</div>
        <Link className="button secondary" href="/admin/partners">一覧へ</Link>
      </div>
      <section className="shell narrow">
        <form className="form panel" action={`/api/partners/${partner.id}/update`} method="post">
          <label>会社名<input name="company_name" defaultValue={partner.company_name || partner.name || ""} required /></label>
          <label>担当者名<input name="contact_name" defaultValue={partner.contact_name || ""} required /></label>
          <label>Webサイト<input name="website" type="url" defaultValue={partner.website || ""} /></label>
          <label>メールアドレス<input name="email" type="email" defaultValue={partner.email || ""} /></label>
          <label>ステータス
            <select name="status" defaultValue={partner.status || "active"}>
              <option value="active">有効</option>
              <option value="suspended">停止中</option>
            </select>
          </label>
          <label>備考<textarea name="notes" defaultValue={partner.notes || ""} /></label>
          <button type="submit">保存</button>
        </form>
      </section>
    </main>
  );
}
