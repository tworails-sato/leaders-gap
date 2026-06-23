import { ResetPasswordForm } from "@/components/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <main className="shell narrow">
      <div className="panel">
        <h1>パスワードを再設定</h1>
        <p className="muted">新しいパスワードを入力してください。</p>
        <ResetPasswordForm />
      </div>
    </main>
  );
}
