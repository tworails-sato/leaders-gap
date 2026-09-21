import type { Metadata } from "next";
import { SampleAssessmentFlow } from "@/components/SampleAssessmentFlow";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "デモ診断を体験｜Leaders GAP",
  path: "/sample/assessment",
  description: "リーダーズGAP診断の全48問を、保存なしで体験できるパートナー向けデモ診断です。"
});

export default function SampleAssessmentPage() {
  return (
    <main className="shell">
      <div className="narrow">
        <span className="badge">Partner Sample</span>
        <h1>リーダーズGAP診断 受検サンプル</h1>
        <p className="muted">パートナーが顧客提案前に受検体験を確認するためのサンプルページです。</p>
      </div>
      <SampleAssessmentFlow />
    </main>
  );
}
