import { LoginForm } from "@/components/LoginForm";

export default async function LoginPage({ searchParams }: { searchParams?: Promise<{ error?: string; reset?: string }> }) {
  const params = await searchParams;

  return (
    <main className="shell narrow">
      <div className="panel">
        <h1>管理画面ログイン</h1>
        {params?.error === "profile" ? (
          <p className="muted">管理者プロフィールが未設定です。管理者にお問い合わせください。</p>
        ) : null}
        {params?.reset === "success" ? (
          <p className="success-text">パスワードを変更しました。新しいパスワードでログインしてください。</p>
        ) : null}
        <LoginForm />
      </div>
    </main>
  );
}
