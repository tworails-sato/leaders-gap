import { ResponseForm } from "@/components/ResponseForm";

export default function SampleAssessmentPage() {
  return (
    <main className="shell">
      <div className="narrow">
        <span className="badge">Partner Sample</span>
        <h1>リーダーズGAP診断 受検サンプル</h1>
        <p className="muted">パートナーが顧客提案前に受検体験を確認するためのサンプルページです。</p>
      </div>
      <ResponseForm mode="sample" />
    </main>
  );
}
