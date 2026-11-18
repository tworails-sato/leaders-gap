import Link from "next/link";
import { ArrowLeftRight, MessageCircle, Network, RefreshCw, RotateCcw, UserRoundCog } from "lucide-react";
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
  { icon: ArrowLeftRight, title: "「伝えたこと」と「伝わったこと」が違う", body: "指示と成果物がずれることで、やり直しや巻き直し、ダブルチェックなどの往復が続く。" },
  { icon: UserRoundCog, title: "「自分がやった方が早い」となる管理職", body: "「自分がやったほうが早い」と、リーダー層が仕事を抱え込み、メンバー以上に疲弊する。" },
  { icon: RotateCcw, title: "「決まったはずのこと」が定着しない", body: "目的や背景も伝えて設定や導入をしたはずなのに、いつのまにか元に戻ってしまう。" }
];

const programRows = [
  { title: "診断・インタビュー", detail: "組織のGAPを可視化", start: 1, span: 1, tone: "navy" },
  { title: "分析・フィードバック", detail: "優先論点を特定", start: 2, span: 1, tone: "blue" },
  { title: "仕組み・ルール設計", detail: "任せ方と判断基準を整備", start: 2, span: 2, tone: "red" },
  { title: "実践・伴走支援", detail: "現場で試し、改善する", start: 3, span: 3, tone: "blue" },
  { title: "定点観測・再診断", detail: "変化を測り、定着へ", start: 5, span: 2, tone: "navy" }
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
            <h1>組織のGAPを埋めて、<br />利益を底上げできる組織へ。</h1>
            <p className="lgap-hero-copy">経営側と現場の認識の差を明らかにし、<br className="lgap-pc-break" />組織全体の相互変革を実践することで<br className="lgap-pc-break" />利益体質の組織をつくる6か月のプログラムです。</p>
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
          <SectionHead eyebrow="Issue" title="GAPはどこの組織でも必ず起こっている" />
          <div className="lgap-issue-grid">
            {issues.map((issue, index) => {
              const Icon = issue.icon;
              return <article className="lgap-issue-card" key={issue.title}><div className="lgap-issue-card-head"><div className="lgap-issue-icon"><Icon aria-hidden="true" /></div><div className="lgap-issue-num">{String(index + 1).padStart(2, "0")}</div></div><h3>{issue.title}</h3><p>{issue.body}</p></article>;
            })}
          </div>
          <div className="lgap-issue-note">これらは「特定の誰かのせい」ではなく、組織が大きくなるときに、<br className="lgap-pc-break" />必ず発生してくる<b>「認識の差＝GAP」</b>を放置してしまうことが原因です。</div>
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
          <SectionHead eyebrow="Feature" title="リーダーズGAPは、組織全体のアップデートプログラムです" />
          <div className="lgap-feature-grid">
            <FeatureCard icon={<RefreshCw aria-hidden="true" />} number="01" title="相互変革">研修や1on1は、受けた人しか変わりません。リーダーズGAPは経営者の任せ方・決め方も見直すので、組織が元に戻りにくくなります</FeatureCard>
            <FeatureCard icon={<MessageCircle aria-hidden="true" />} number="02" title="社外の第三者だから、本音が集まる">社内の人が聞いても出てこない声を、利害のない立場で集め、経営に届けます</FeatureCard>
            <FeatureCard icon={<Network aria-hidden="true" />} number="03" title="階層と部門をまたいで見る">経営と現場の上下だけでなく、部門どうしの左右のGAPも、同じ物差しで測ります</FeatureCard>
          </div>
          <div className="lgap-comparison-block">
            <h3>一般的な研修・コーチングとの違い</h3>
            <div className="lgap-table-wrap">
              <table className="lgap-diff-table">
                <thead><tr><th>比較項目</th><th>1on1・コーチング</th><th>研修プログラム</th><th>リーダーズGAP</th></tr></thead>
                <tbody>
                  <tr><td>起点</td><td>個人の悩みや課題</td><td>階層ごとの共通課題</td><td>全体調査で特定した認識差</td></tr>
                  <tr><td>対象</td><td>対話する本人</td><td>受講者</td><td>経営・幹部・現場を含む組織全体</td></tr>
                  <tr><td>提供価値</td><td>内省と行動変容</td><td>知識・技術の習得</td><td>GAPの可視化と仕組みの更新</td></tr>
                  <tr><td>定着支援</td><td>本人の実践に依存</td><td>受講後の運用に依存</td><td>実践・定点観測まで6か月伴走</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="lgap-sec lgap-gray lgap-section-anchor" id="sample-report">
        <div className="lgap-wrap">
          <SectionHead eyebrow="Sample" title="アセスメントとインタビューをもとに「GAPが起きやすいポイント」の差分を可視化します。" />
          <div className="lgap-sample-comparison">
            <div className="lgap-sample-radar-panel"><div className="lgap-sample-label">フィードバックレポート例</div><HeroRadarPreview /></div>
            <div className="lgap-theme-comparison"><div className="lgap-theme-comparison-head"><span>8テーマ別比較</span><b>経営側</b><b>現場側</b><b>GAP</b></div>{sampleReportThemes.map((row) => <div className="lgap-theme-comparison-row" key={row.key}><span>{row.theme}</span><b>{row.executiveScore.toFixed(2)}</b><b>{row.fieldScore.toFixed(2)}</b><strong>+{row.gap?.toFixed(2)}</strong></div>)}</div>
          </div>
          <p className="lgap-sample-summary">経営側は方針や権限を伝えていると認識する一方、現場側は判断できる範囲や優先順位が明確ではないと感じている、といった差をテーマごとに確認できます。</p>
          <Link href="/sample/report" className="lgap-link-button">フィードバックサンプルを見る</Link>
        </div>
      </section>

      <section className="lgap-sec lgap-section-anchor" id="program">
        <div className="lgap-wrap">
          <SectionHead eyebrow="Program" title="6か月間で、生産性の高い組織の仕組みを作ります。" />
          <div className="lgap-program-timeline" aria-label="6か月のプログラム進行表">
            <div className="lgap-program-months"><span>取り組み</span>{[1, 2, 3, 4, 5, 6].map((month) => <b key={month}>{month}か月目</b>)}</div>
            {programRows.map((row) => <div className="lgap-program-row" key={row.title}><div className="lgap-program-row-label"><b>{row.title}</b><span>{row.detail}</span></div><div className={`lgap-program-bar lgap-program-bar-${row.tone}`} style={{ gridColumn: `${row.start + 1} / span ${row.span}` }}>{row.start === 1 || row.span > 1 ? row.detail : row.title}</div></div>)}
          </div>
          <div className="lgap-program-metrics"><h3>変化は、この数字で確かめます</h3><ul><li>認識のGAP（始めと終わりの診断で比較）</li><li>任されたミッション・目標の達成状況</li><li>経営者が現場への指示に使う時間</li></ul></div>
        </div>
      </section>

      <section className="lgap-sec lgap-section-anchor" id="case">
        <div className="lgap-wrap">
          <SectionHead eyebrow="Case" title="離職の原因が「3年目の主任・店長層」にあると特定" />
          <div className="lgap-case-attributes" aria-label="事例の属性"><span>美容サロン</span><span>店舗業</span><span>都市部</span><span>社員数 50名</span><span>調査人数 20名</span></div>
          <div className="lgap-case-detail">
            <div className="lgap-case-story"><h3>背景と診断で分かったこと</h3><p>若手の離職率が下がらず、社内アンケートや労働環境の改善を続けても効果が見えない状態でした。経営陣と全店舗の約20名へ診断・インタビューを実施すると、若手は仕事にやりがいを感じている一方、3年目の主任・店長層で意欲が大きく低下していることが判明。長期を見越した育成と権限設計が、本当の優先課題だと分かりました。</p></div>
            <div className="lgap-case-ba">
              <div className="lgap-case-before"><span>BEFORE</span><h3>離職の原因が見えず、施策が空振り</h3><p>若手の労働環境を中心に改善していたが、離職率は高止まり。経営が想定する課題と現場の実感がずれていました。</p></div>
              <div className="lgap-case-arrow" aria-hidden="true">→</div>
              <div className="lgap-case-after"><span>AFTER</span><h3>優先対象と打ち手が明確に</h3><p>主任・店長層を重点対象に定め、全員面談、育成、店舗への裁量委譲、効果測定を一つの改善計画として実行できる状態へ。</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="lgap-sec lgap-gray lgap-section-anchor" id="contact">
        <div className="lgap-wrap"><SectionHead eyebrow="Contact" title="まずはお気軽にご相談ください" lead="組織のどこにGAPがありそうか分からない段階でも大丈夫です。現状を伺いながら、最初に整理すべき論点を一緒に考えます。" /><ContactForm /></div>
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
