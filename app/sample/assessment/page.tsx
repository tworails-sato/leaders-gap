import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SampleAssessmentFlow } from "@/components/SampleAssessmentFlow";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "デモ診断を体験｜Leaders GAP",
  path: "/sample/assessment",
  description: "リーダーズGAP診断の8テーマ・全24問を、保存なしで約5分で体験できるデモ診断です。"
});

export default function SampleAssessmentPage() {
  return (
    <main className="sample-assessment-shell">
      <header className="sample-assessment-topbar">
        <Link className="sample-assessment-brand" href="/sample">
          <Image alt="" height={34} src="/lgap-mark.png" width={42} />
          <strong>Leaders <span>GAP</span></strong>
        </Link>
        <div><span>DEMO ASSESSMENT</span><Link href="/sample">サービス紹介へ戻る</Link></div>
      </header>
      <div className="sample-assessment-stage"><SampleAssessmentFlow /></div>
    </main>
  );
}