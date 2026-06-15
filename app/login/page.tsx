import { LoginForm } from "@/components/LoginForm";

export default async function LoginPage({ searchParams }: { searchParams?: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <main className="shell narrow">
      <div className="panel">
        <h1>管理画面ログイン</h1>
        {params?.error === "profile" ? (
          <p className="muted">管理者プロフィールが未作成です。Supabase の admin_profiles を確認してください。</p>
        ) : null}
        <LoginForm />
      </div>
    </main>
  );
}
