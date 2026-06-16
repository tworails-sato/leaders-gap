import Link from "next/link";
import { RadarComparisonChart } from "@/components/RadarComparisonChart";
import { sampleFeedback, sampleLowGaps, sampleReportCompany, sampleReportThemes, sampleTopGaps } from "@/lib/sample-report";

export default function SampleReportPage() {
  return (
    <main>
      <div className="sample-ribbon">サンプルデータです｜保存・集計は行われません</div>
      <div className="topbar sample-offset">
        <div className="brand">フィードバックサンプル</div>
        <nav className="nav">
          <Link className="button secondary" href="/sample">受検サンプルを見る</Link>
        </nav>
      </div>

      <section className="shell grid sample-offset">
        <div className="panel">
          <span className="badge">Partner Feedback Sample</span>
          <h1>リーダーズGAP診断 フィードバックサンプル</h1>
          <p className="muted">このページは固定のダミーデータを使った閲覧専用サンプルです。編集・保存・メール送信・CSV出力は行いません。</p>
          <div className="grid three">
            <div><strong>会社名</strong><p>{sampleReportCompany.companyName}</p></div>
            <div><strong>経営側</strong><p>{sampleReportCompany.executiveCount}名</p></div>
            <div><strong>現場側</strong><p>{sampleReportCompany.fieldCount}名</p></div>
          </div>
        </div>

        <div className="panel">
          <h2>経営側と現場側の比較レーダーチャート</h2>
          <RadarComparisonChart data={sampleReportThemes} executiveLabel="経営側" fieldLabel="現場側" />
        </div>

        <div className="panel table-wrap">
          <h2>8テーマ別比較表</h2>
          <table>
            <thead><tr><th>テーマ</th><th>経営側</th><th>現場側</th><th>GAP</th><th>判定</th></tr></thead>
            <tbody>
              {sampleReportThemes.map((row) => (
                <tr key={row.key}>
                  <td>{row.theme}</td>
                  <td>{row.executiveScore.toFixed(2)}</td>
                  <td>{row.fieldScore.toFixed(2)}</td>
                  <td>{row.gap?.toFixed(2)}</td>
                  <td>{row.judgment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid two">
          <ThemeList title="最大GAP上位3" rows={sampleTopGaps} />
          <ThemeList title="GAPが小さいテーマ" rows={sampleLowGaps} />
        </div>

        <FeedbackSection title="診断サマリー" text={sampleFeedback.summary} />
        <FeedbackSection title="GAPが少ないテーマ" text={sampleFeedback.lowGap} />
        <FeedbackSection title="GAPが発生している要因" text={sampleFeedback.factors} />

        <div className="grid two">
          <BulletSection title="経営側の認識" items={sampleFeedback.executiveView} />
          <BulletSection title="現場側の認識" items={sampleFeedback.fieldView} />
          <BulletSection title="短期施策" items={sampleFeedback.shortTerm} />
          <BulletSection title="中期施策" items={sampleFeedback.midTerm} />
        </div>

        <FeedbackSection title="備考" text={sampleFeedback.notes} />
      </section>
    </main>
  );
}

function ThemeList({ title, rows }: { title: string; rows: typeof sampleReportThemes }) {
  return (
    <div className="panel table-wrap">
      <h2>{title}</h2>
      <table>
        <thead><tr><th>テーマ</th><th>GAP</th><th>判定</th></tr></thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              <td>{row.theme}</td>
              <td>{row.gap?.toFixed(2)}</td>
              <td>{row.judgment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FeedbackSection({ title, text }: { title: string; text: string }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      {text.split("\n\n").map((paragraph) => <p className="muted" key={paragraph}>{paragraph}</p>)}
    </section>
  );
}

function BulletSection({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      <ul className="muted">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  );
}
