import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <main className="shell narrow">
      <div className="panel">
        <h1>パスワードを忘れた方</h1>
        <p className="muted">ご登録のメールアドレスを入力してください。パスワード再設定用のURLをお送りします。</p>
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
