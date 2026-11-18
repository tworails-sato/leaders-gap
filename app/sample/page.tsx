import Link from "next/link";
import { MessageCircle, Network, RefreshCw } from "lucide-react";
import type { Metadata } from "next";
import type React from "react";
import { ContactForm } from "@/components/ContactForm";
import { FloatingSimulationButton } from "@/components/FloatingSimulationButton";
import { ValueSimulation } from "@/components/ValueSimulation";
import { sampleFeedback, sampleReportThemes, sampleTopGaps } from "@/lib/sample-report";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "リーダーズGAP｜経営と現場の“見えないGAP”を可視化する組織アセスメント",
  path: "/sample",
  description: "経営者の任せ方と現場の受け方のGAPを数字にし、組織のルールとして整える6か月のプログラムです。"
});

const demoAssessmentUrl = "https://gap.ceo-sherpa.com/sample/assessment";

const issues = [
  { title: "手戻りが止まらない", body: "指示と上がってくる成果物が合わず、やり直しと確認の往復が続く" },
  { title: "結局、上が巻き取る", body: "「自分がやったほうが早い」と、経営者やリーダーが仕事を抱え込む" },
  { title: "期待して迎えた人が辞める", body: "期待とのGAPが埋まらないまま、力を発揮しきれずに去ってしまう" }
];

const featureBars = [
  { label: "権限移譲の実行", value: 2.1 },
  { label: "決定権の所在の一致", value: 1.8 },
  { label: "戦略の一致", value: 1.3 }
];

const programSteps = [
  { label: "STEP 1", title: "可視化", body: "経営者・リーダー・メンバー全員への診断とインタビューで、組織のどこに認識のGAPがあるかを明らかにします" },
  { label: "STEP 2", title: "ルールづくり", body: "GAPをもとに、任せる範囲・判断の基準・報告のしかたを、組織のルールとして設計します" },
  { label: "STEP 3", title: "定着", body: "ルールが現場で回っているかを定点で確かめ、GAPが出たところを直しながら、風土として根付くまで支えます" }
];

export default function SampleLandingPage() {
  return (
    <main className="lgap-lp">
      <header className="lgap-header">
        <div className="lgap-wrap lgap-hd">
          <div className="lgap-logo"><img src="/lgap-mark.png" alt="" aria-hidden="true" /><span className="lgap-logo-text">リーダーズ<span>GAP</span></span></div>
          <a href="#contact" className="lgap-header-cta">無料相談</a>
        </div>
      </header>

      <section className="lgap-hero lgap-section-anchor" id="top">
        <div className="lgap-wrap lgap-hero-grid">
          <div className="lgap-hero-content">
            <div className="lgap-tag">経営者・人事ご担当者の方へ</div>
            <h1>経営と現場が、<br />同じ方向を向ける組織へ。</h1>
            <p className="lgap-hero-copy">経営者の「任せ方」と現場の「受け方」。そのずれを診断で数字にし、組織のルールとして整えていく6か月のプログラムです。</p>
            <div className="lgap-hero-actions"><a href={demoAssessmentUrl} className="lgap-btn-primary">デモ診断を試す（無料・約5分）</a></div>
            <div className="lgap-hero-demo-link">導入効果を数字で確認したい方は、<Link href="#simulation">貴社の数字で試算できます</Link></div>
          </div>

          <aside className="lgap-hero-report" aria-label="フィードバックレポート例">
            <div className="lgap-hero-report-head">
              <div><span>フィードバックレポート例</span><h2>経営側と現場側の認識差</h2></div>
              <strong>サンプルデータ</strong>
            </div>
            <HeroRadarPreview />
            <div className="lgap-hero-gap-list">
              <span>最大GAP 上位3</span>
              {sampleTopGaps.map((row, index) => <div key={row.key}><b>0{index + 1}</b><p>{row.theme}</p><strong>+{row.gap?.toFixed(2)}</strong></div>)}
            </div>
            <p className="lgap-hero-report-summary">{sampleFeedback.summary.split("\n\n")[0]}</p>
            <Link href="/sample/report" className="lgap-hero-report-link">フィードバック全体を見る <span>→</span></Link>
          </aside>
        </div>
      </section>

      <section className="lgap-sec lgap-section-anchor" id="issue">
        <div className="lgap-wrap">
          <SectionHead eyebrow="Issue" title="任せたはずが、思った形で上がってこない" />
          <div className="lgap-issue-grid">
            {issues.map((issue, index) => <article className="lgap-issue-card" key={issue.title}><div className="lgap-issue-num">{String(index + 1).padStart(2, "0")}</div><h3>{issue.title}</h3><p>{issue.body}</p></article>)}
          </div>
          <div className="lgap-issue-note">誰かの努力不足ではありません。組織が大きくなるときに、どの会社でも起きる<b>「認識のGAP」</b>です。</div>
        </div>
      </section>

      <section className="lgap-sec lgap-gray lgap-section-anchor" id="simulation">
        <div className="lgap-wrap">
          <SectionHead eyebrow="Simulation" title="GAPが減ると、どれだけ付加価値を生み出せるか" lead="手戻り、認識違いによる確認の往復、離職や欠員。こうしたGAPに取られている時間が減れば、同じ人数のままで生み出せる粗利が増えます。貴社の数字で試算してみてください。" />
          <GapProfitIntro />
          <ValueSimulation />
        </div>
      </section>

      <section className="lgap-sec lgap-section-anchor" id="feature">
        <div className="lgap-wrap">
          <SectionHead eyebrow="Feature" title="現場だけでなく、経営も一緒に変わる" />
          <div className="lgap-feature-grid">
            <FeatureCard icon={<RefreshCw aria-hidden="true" />} number="01" title="相互変革">研修や1on1は、受けた人しか変わりません。リーダーズGAPは経営者の任せ方・決め方も見直すので、組織が元に戻りにくくなります</FeatureCard>
            <FeatureCard icon={<MessageCircle aria-hidden="true" />} number="02" title="社外の第三者だから、本音が集まる">社内の人が聞いても出てこない声を、利害のない立場で集め、経営に届けます</FeatureCard>
            <FeatureCard icon={<Network aria-hidden="true" />} number="03" title="階層と部門をまたいで見る">経営と現場の上下だけでなく、部門どうしの左右のGAPも、同じ物差しで測ります</FeatureCard>
          </div>
          <div className="lgap-feature-report lgap-section-anchor" id="sample-report">
            <div className="lgap-feature-report-head"><div><span>結果の見え方</span><h3>GAPが大きい項目（上位3つ）</h3></div><strong>イメージ例</strong></div>
            <div className="lgap-feature-bars">
              {featureBars.map((item) => <div className="lgap-feature-bar-row" key={item.label}><span>{item.label}</span><div><i style={{ width: `${(item.value / 2.1) * 100}%` }} /></div><b>+{item.value.toFixed(2)}</b></div>)}
            </div>
            <p>経営側は「権限は伝えている」と考える一方、現場側は「判断してよい範囲や優先順位が分からない」と感じている、といったGAPが数字で見えます。</p>
            <Link href="/sample/report" className="lgap-link-button">フィードバックサンプルを見る</Link>
          </div>
        </div>
      </section>

      <section className="lgap-sec lgap-gray lgap-section-anchor" id="program">
        <div className="lgap-wrap">
          <SectionHead eyebrow="Program" title="6か月で、GAPを組織のルールに変える" />
          <div className="lgap-program-grid">{programSteps.map((step) => <article key={step.label}><span>{step.label}</span><h3>{step.title}</h3><p>{step.body}</p></article>)}</div>
          <div className="lgap-program-metrics"><h3>変化は、この数字で確かめます</h3><ul><li>認識のGAP（始めと終わりの診断で比較）</li><li>任されたミッション・目標の達成状況</li><li>経営者が現場への指示に使う時間</li></ul></div>
        </div>
      </section>

      <section className="lgap-sec lgap-section-anchor" id="case">
        <div className="lgap-wrap">
          <SectionHead eyebrow="Case" title="離職の原因が「3年目の主任・店長層」にあると特定" />
          <div className="lgap-case-attributes" aria-label="事例の属性"><span>美容サロン</span><span>店舗業</span><span>都市部</span><span>社員数 50名</span><span>調査人数 20名</span></div>
          <div className="lgap-case-grid"><CaseCard title="課題">若手の離職率が下がらない。人事は現場の本音を知りたかった</CaseCard><CaseCard title="分かったこと">若手はやりがいを感じていた一方、3年目の主任・店長クラスで意欲が大きく下がっていた</CaseCard><CaseCard title="打った手">全員面談、3年目層向けの育成、店舗への裁量の試験的な委譲、効果の計測の継続</CaseCard></div>
        </div>
      </section>

      <section className="lgap-sec lgap-gray lgap-section-anchor" id="contact">
        <div className="lgap-wrap"><SectionHead eyebrow="Contact" title="まずは30分、お話を伺います" lead="試算の結果をお持ちいただければ、貴社のどこから手をつけるかを一緒に考えます。" /><ContactForm /></div>
      </section>

      <FloatingSimulationButton />
      <footer className="lgap-footer"><a href="https://www.t-rails.com/" target="_blank" rel="noreferrer">合同会社Two rails</a><span> ｜ リーダーズGAP診断</span></footer>
    </main>
  );
}

function HeroRadarPreview() {
  const centerX = 220;
  const centerY = 126;
  const radius = 78;
  const axisCount = sampleReportThemes.length;
  const point = (index: number, distance: number) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / axisCount;
    return [centerX + Math.cos(angle) * distance, centerY + Math.sin(angle) * distance] as const;
  };
  const polygon = (scores: number[], scale = radius) => scores.map((score, index) => point(index, (score / 5) * scale).join(",")).join(" ");

  return (
    <div className="lgap-hero-radar" role="img" aria-label="経営側と現場側の8テーマ比較レーダーチャート例">
      <svg viewBox="0 0 440 270" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((level) => <polygon className="lgap-radar-grid" key={level} points={polygon(Array(axisCount).fill(level), radius)} />)}
        {sampleReportThemes.map((theme, index) => {
          const [x, y] = point(index, radius);
          const [labelX, labelY] = point(index, radius + 28);
          const anchor = labelX < centerX - 8 ? "end" : labelX > centerX + 8 ? "start" : "middle";
          return <g key={theme.key}><line className="lgap-radar-axis" x1={centerX} y1={centerY} x2={x} y2={y} /><text className="lgap-radar-label" x={labelX} y={labelY + 3} textAnchor={anchor}>{theme.theme}</text></g>;
        })}
        <polygon className="lgap-radar-executive" points={polygon(sampleReportThemes.map((row) => row.executiveScore))} />
        <polygon className="lgap-radar-field" points={polygon(sampleReportThemes.map((row) => row.fieldScore))} />
        {sampleReportThemes.map((row, index) => {
          const [executiveX, executiveY] = point(index, (row.executiveScore / 5) * radius);
          const [fieldX, fieldY] = point(index, (row.fieldScore / 5) * radius);
          return <g key={row.key}><circle className="lgap-radar-executive-dot" cx={executiveX} cy={executiveY} r="2.6" /><circle className="lgap-radar-field-dot" cx={fieldX} cy={fieldY} r="2.6" /></g>;
        })}
        <g className="lgap-radar-legend">
          <line x1="151" y1="252" x2="171" y2="252" className="lgap-radar-executive-line" /><text x="177" y="255">経営側</text>
          <line x1="241" y1="252" x2="261" y2="252" className="lgap-radar-field-line" /><text x="267" y="255">現場側</text>
        </g>
      </svg>
    </div>
  );
}

function GapProfitIntro() {
  return (
    <section className="lgap-gap-profit-intro">
      <h3>組織のGAPは、会社の粗利を直接削っています</h3>
      <p className="lgap-gap-profit-example">例：年商5億円・粗利率40%・社員30名の会社の場合</p>

      <div className="lgap-profit-block">
        <h4>① 売上の構成</h4>
        <div className="lgap-profit-bar lgap-profit-sales">
          <div className="lgap-profit-purchase"><span>仕入・外注</span><b>3億円（60%）</b></div>
          <div className="lgap-profit-gross"><span>粗利＝組織が生む価値</span><b>2億円（40%）</b></div>
        </div>
        <p>売上は外部との契約で決まります。社員の働きが生み出しているのは、粗利の部分です。</p>
      </div>

      <div className="lgap-profit-block">
        <h4>② 粗利と営業利益の関係</h4>
        <div className="lgap-profit-bar lgap-profit-destination">
          <div className="lgap-profit-cost-total">
            <div className="lgap-profit-cost"><span>人件費・経費</span><b>1億6,800万円</b></div>
            <div className="lgap-profit-gap"><span>うちGAP</span><b>200万円</b></div>
          </div>
          <div className="lgap-profit-income"><span>営業利益</span><b>3,000万円</b></div>
        </div>
        <p>粗利のうち、どれだけが営業利益として残るかは、日々のオペレーションで決まります。GAPは新たな費用ではなく、人件費・経費の中で価値を生まないまま消えている時間です。</p>
      </div>

      <p className="lgap-profit-highlight">働く時間のたった1%（1人あたり週24分）がGAPに使われているだけで、<strong>年間200万円</strong>。営業利益3,000万円の会社なら、その<strong>約7%</strong>にあたります。</p>
      <a className="lgap-sim-intro-button" href="#sim-input">貴社の数字でシミュレーションしてみる ↓</a>
      <p className="lgap-profit-note">※数値はすべて説明のための例です。生産性は一般に、付加価値（粗利）÷社員数で測ります。1% ＝ 週40時間 × 1% ＝ 24分。</p>
    </section>
  );
}

function SectionHead({ eyebrow, title, lead }: { eyebrow: string; title: React.ReactNode; lead?: string }) {
  return <><div className="lgap-eyebrow">{eyebrow}</div><h2 className="lgap-sec-title">{title}</h2>{lead ? <p className="lgap-sec-lead">{lead}</p> : null}</>;
}

function FeatureCard({ icon, number, title, children }: { icon: React.ReactNode; number: string; title: string; children: React.ReactNode }) {
  return <article className="lgap-feature-card"><div className="lgap-feature-icon">{icon}<span>{number}</span></div><h3>{title}</h3><p>{children}</p></article>;
}

function CaseCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <article className="lgap-case-card"><h3>{title}</h3><p>{children}</p></article>;
}
