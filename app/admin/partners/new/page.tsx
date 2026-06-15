import Link from "next/link";
import { requireAdmin } from "@/lib/auth";

export default async function NewPartnerPage() {
  await requireAdmin();

  return (
    <main>
      <div className="topbar">
        <div className="brand">パートナー登録</div>
        <Link className="button secondary" href="/admin/partners">一覧へ</Link>
      </div>
      <section className="shell narrow">
        <PartnerForm action="/api/partners/create" />
      </section>
    </main>
  );
}

function PartnerForm({ action }: { action: string }) {
  return (
    <form className="form panel" action={action} method="post">
      <label>会社名<input name="company_name" required /></label>
      <label>担当者名<input name="contact_name" required /></label>
      <label>Webサイト<input name="website" type="url" /></label>
      <label>メールアドレス<input name="email" type="email" /></label>
      <label>ステータス
        <select name="status" defaultValue="active">
          <option value="active">有効</option>
          <option value="suspended">停止中</option>
        </select>
      </label>
      <label>備考<textarea name="notes" /></label>
      <button type="submit">登録</button>
    </form>
  );
}
