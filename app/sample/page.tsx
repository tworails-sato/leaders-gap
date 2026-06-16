import Link from "next/link";
import { RadarComparisonChart } from "@/components/RadarComparisonChart";
import { sampleFeedback, sampleReportThemes, sampleTopGaps } from "@/lib/sample-report";

const challenges = [
  "社長一人では事業や組織を見切れなくなってきた",
  "部長へ任せたいが、どこまで任せてよいか分からない",
  "社長は伝えているつもりだが、現場には伝わっていない",
  "部長が確認や承認を求め、自走しづらい",
  "幹部育成や権限移譲を、感覚ではなく論点整理して進めたい"
];

const findings = [
  "8テーマごとの経営側と現場側の認識差",
  "最大GAP上位3",
  "認識が揃っている組織の強み",
  "設問単位の具体的なズレ",
  "部長・責任者間の回答のばらつき",
  "権限移譲や幹部育成に向けた優先論点"
];

const themes = [
  "戦略の一致",
  "優先順位の一致",
  "成果と評価の一致",
  "決定権の所在の一致",
  "実務と設計の一致",
  "改善と運用の一致",
  "意思決定プロセスの一致",
  "権限移譲の実行"
];

const flow = [
  "対象企業・部門・人数を決定",
  "回答者ごとに専用URLを発行（高機密性）",
  "経営側・部長側が48問へ回答",
  "認識差を集計・分析",
  "フィードバックと次の施策を整理"
];

const useCases = [
  ["組織コンサルタント", "組織開発や幹部育成を提案する前に、社長と部長の認識差を整理する入口として活用。"],
  ["RPO・採用支援", "採用や定着の問題の背景にある、役割・評価・意思決定の課題を確認。"],
  ["企業研修", "管理職研修など前後で、現状の認識差や重点テーマを把握するために活用。"],
  ["経営伴走・顧問支援", "権限移譲やNo.2育成を進める際の課題整理と、継続支援の入口として活用。"]
];

export default function SampleLandingPage() {
  const summaryExcerpt = sampleFeedback.summary.split("。\n\n")[0] + "。";

  return (
    <main>
      <section className="lp-hero">
        <div className="sample-ribbon">パートナー向け紹介ページ｜サンプルデータを含みます</div>
        <div className="shell sample-offset lp-hero-grid">
          <div>
            <span className="badge">リーダーズGAP診断</span>
            <h1>社長と部長の“認識差”を可視化し、権限移譲の論点を整理する</h1>
            <p className="lead">
              リーダーズGAP診断は、経営側と部長・事業責任者が同設問を各々の目線で回答し、
              方針・優先順位・決定権・権限移譲などの認識差を可視化する診断です。
            </p>
            <p className="muted">組織開発、幹部の育成、管理職研修、伴走支援などの入口として活用いただけます。</p>
            <div className="nav" style={{ marginTop: 24 }}>
              <Link className="button" href="/sample/assessment">受検画面を確認する</Link>
              <Link className="button secondary" href="/sample/report">フィードバックサンプルを見る</Link>
            </div>
          </div>
          <div className="hero-chart">
            <div className="hero-chart-header">
              <span className="badge">Output Sample</span>
              <p className="muted">経営側と現場側の8テーマ比較</p>
            </div>
            <RadarComparisonChart data={sampleReportThemes} executiveLabel="経営側" fieldLabel="現場側" />
          </div>
        </div>
      </section>

      <section className="shell grid">
        <SectionTitle title="こんな課題に" />
        <div className="grid three">
          {challenges.map((item) => <InfoCard key={item} title={item} />)}
        </div>

        <SectionTitle title="診断で分かること" />
        <div className="grid two">
          <div className="panel">
            <h3>可視化される論点</h3>
            <ul className="muted">{findings.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div className="panel">
            <h3>8つの診断テーマ</h3>
            <div className="tag-list">{themes.map((item) => <span className="badge" key={item}>{item}</span>)}</div>
          </div>
        </div>

        <SectionTitle title="アウトプットイメージ" />
        <div className="panel">
          <h3>経営側と現場側の比較レーダーチャート</h3>
          <RadarComparisonChart data={sampleReportThemes} executiveLabel="経営側" fieldLabel="現場側" />
        </div>
        <div className="grid two">
          <div className="panel table-wrap">
            <h3>最大GAP上位3</h3>
            <table>
              <thead><tr><th>テーマ</th><th>GAP</th><th>判定</th></tr></thead>
              <tbody>
                {sampleTopGaps.map((row) => (
                  <tr key={row.key}><td>{row.theme}</td><td>{row.gap?.toFixed(2)}</td><td>{row.judgment}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="panel">
            <h3>診断サマリー抜粋</h3>
            <p className="muted">{summaryExcerpt}</p>
            <Link className="button secondary" href="/sample/report">フィードバック全体を見る</Link>
          </div>
        </div>

        <SectionTitle title="実施フロー" />
        <div className="step-grid">
          {flow.map((item, index) => (
            <div className="panel step-card" key={item}>
              <span className="badge">{index + 1}</span>
              <p><strong>{item}</strong></p>
            </div>
          ))}
        </div>
        <p className="muted">診断結果は個人評価ではなく、経営側と現場側の認識差を確認するために使用します。</p>

        <SectionTitle title="パートナー向けユースケース" />
        <div className="grid two">
          {useCases.map(([title, body]) => <InfoCard key={title} title={title} body={body} />)}
        </div>

        <section className="panel final-cta">
          <h2>まずは実際の受検画面とフィードバックをご確認ください</h2>
          <div className="nav">
            <Link className="button" href="/sample/assessment">48問の受検画面を見る</Link>
            <Link className="button secondary" href="/sample/report">フィードバックサンプルを見る</Link>
          </div>
          <p className="muted">問い合わせや案件相談の導線を追加できる余白を残した構成です。</p>
        </section>
      </section>
    </main>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h2 className="section-title">{title}</h2>;
}

function InfoCard({ title, body }: { title: string; body?: string }) {
  return (
    <div className="panel">
      <h3>{title}</h3>
      {body ? <p className="muted">{body}</p> : null}
    </div>
  );
}
