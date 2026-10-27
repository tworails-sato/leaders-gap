import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Building2, Target, TrendingUp, Users } from "lucide-react";
import { RadarComparisonChart } from "@/components/RadarComparisonChart";
import { sampleFeedback, sampleLowGaps, sampleReportCompany, sampleReportThemes, sampleTopGaps } from "@/lib/sample-report";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "フィードバックサンプル｜Leaders GAP",
  path: "/sample/report",
  description: "リーダーズGAP診断で確認できる分析結果とフィードバック内容のサンプルです。"
});

export default function SampleReportPage() {
  return (
    <main className="sample-report-shell">
      <div className="sample-ribbon">フィードバックサンプル｜固定のデモデータです</div>
      <div className="sample-report-topbar sample-offset">
        <Link className="brand" href="/sample">Leaders GAP</Link>
        <nav><Link href="/sample/assessment">デモ診断を受ける</Link><Link href="/sample">サービス紹介</Link></nav>
      </div>

      <div className="sample-report-page">
        <header className="sample-report-hero">
          <div>
            <span className="sample-kicker">FEEDBACK REPORT SAMPLE</span>
            <h1>認識のズレを、<br />次の対話へ。</h1>
            <p>経営側と現場側の回答を8テーマで比較し、権限移譲を進めるための論点を整理したフィードバック例です。</p>
          </div>
          <div className="sample-report-company">
            <span>DEMO COMPANY</span><h2>{sampleReportCompany.companyName}</h2>
            <div><p><Building2 size={18} />対象組織</p><strong>全社</strong></div>
            <div><p><Users size={18} />回答者構成</p><strong>経営側 {sampleReportCompany.executiveCount}名 / 現場側 {sampleReportCompany.fieldCount}名</strong></div>
          </div>
        </header>

        <section className="sample-report-overview">
          <div className="sample-report-chart">
            <SectionHeading number="01" label="OVERVIEW" title="8テーマの全体像" />
            <RadarComparisonChart data={sampleReportThemes} executiveLabel="経営側" fieldLabel="現場側" />
          </div>
          <div className="sample-report-summary">
            <span className="badge">診断サマリー</span><h2>任せる範囲と判断基準に、認識差が見られます。</h2>
            {sampleFeedback.summary.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <div className="sample-top-gap-list">{sampleTopGaps.map((row, index) => <div key={row.key}><span>0{index + 1}</span><p>{row.theme}</p><strong>+{row.gap?.toFixed(2)}</strong></div>)}</div>
          </div>
        </section>

        <section className="sample-report-section">
          <SectionHeading number="02" label="THEME SCORES" title="8テーマ別比較" />
          <div className="sample-score-grid">{sampleReportThemes.map((row) => <article key={row.key}><h3>{row.theme}</h3><div><span>経営側</span><strong>{row.executiveScore.toFixed(2)}</strong></div><div><span>現場側</span><strong>{row.fieldScore.toFixed(2)}</strong></div><footer><span>GAP</span><b>+{row.gap?.toFixed(2)}</b></footer></article>)}</div>
        </section>

        <section className="sample-report-section">
          <SectionHeading number="03" label="KEY FINDINGS" title="注目すべきポイント" />
          <div className="sample-report-insights">
            <InsightCard icon={<TrendingUp size={22} />} title="最大GAP上位3"><ol>{sampleTopGaps.map((row, index) => <li key={row.key}><span>{index + 1}</span><p>{row.theme}</p><strong>{row.gap?.toFixed(2)}</strong></li>)}</ol></InsightCard>
            <InsightCard icon={<Target size={22} />} title="認識が近いテーマ"><p>{sampleFeedback.lowGap}</p><div className="sample-low-gap-tags">{sampleLowGaps.map((row) => <span key={row.key}>{row.theme}</span>)}</div></InsightCard>
          </div>
        </section>

        <section className="sample-report-section">
          <SectionHeading number="04" label="INTERPRETATION" title="GAPの読み解き" />
          <div className="sample-narrative">{sampleFeedback.factors.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          <div className="grid two sample-view-grid"><BulletSection title="経営側の認識" items={sampleFeedback.executiveView} tone="navy" /><BulletSection title="現場側の認識" items={sampleFeedback.fieldView} tone="red" /></div>
        </section>

        <section className="sample-report-section">
          <SectionHeading number="05" label="NEXT ACTION" title="推奨アクション" />
          <div className="grid two"><ActionSection title="まず着手する短期施策" items={sampleFeedback.shortTerm} /><ActionSection title="仕組みにする中期施策" items={sampleFeedback.midTerm} /></div>
        </section>

        <section className="sample-report-cta"><small>LEADERS GAP CONSULTATION</small><h2>貴社の場合、どこにGAPがありそうですか？</h2><p>対象人数や実施方法、フィードバックの進め方をご案内します。</p><Link className="button" href="/sample#contact">導入について相談する<ArrowRight size={18} /></Link></section>
        <div className="sample-report-footer"><Link className="button secondary" href="/sample/assessment">デモ診断を受ける</Link><Link className="button secondary" href="/sample">紹介ページへ戻る</Link></div>
      </div>
    </main>
  );
}

function SectionHeading({ number, label, title }: { number: string; label: string; title: string }) {
  return <div className="sample-section-heading"><span>{number}</span><div><small>{label}</small><h2>{title}</h2></div></div>;
}

function InsightCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return <article className="sample-insight-card"><div className="sample-insight-title">{icon}<h3>{title}</h3></div>{children}</article>;
}

function BulletSection({ title, items, tone }: { title: string; items: string[]; tone: "navy" | "red" }) {
  return <section className={`sample-view-card ${tone}`}><h3>{title}</h3><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></section>;
}

function ActionSection({ title, items }: { title: string; items: string[] }) {
  return <section className="sample-action-card"><h3>{title}</h3><ol>{items.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>)}</ol></section>;
}
