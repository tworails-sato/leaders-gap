import Link from "next/link";
import type React from "react";
import { ContactForm } from "@/components/ContactForm";
import { RadarComparisonChart } from "@/components/RadarComparisonChart";
import { sampleReportThemes } from "@/lib/sample-report";

const demoAssessmentUrl = "https://gap.ceo-sherpa.com/sample/assessment";

const issues = [
  {
    title: "本音を伝えられない",
    body: "階層と部門が増えるほど、現場で本当に起きていること・感じていることが、そのまま経営には届かなくなる。"
  },
  {
    title: "全体最適の施策・徹底が難しい",
    body: "本社が全体最適で打つ施策が、部門ごと・工程ごとの実態とズレ、現場に浸透しきらない。"
  },
  {
    title: "徹底度が追いきれない",
    body: "組織が大きくなるほど、決めたことがどこまで実行されているかを、経営・人事が把握しきれない。"
  }
];

const valuePairs = [
  {
    issue: "本音を伝えられない",
    value: "第三者だからこそ、拾える本音がある",
    body: "評価に響かない中立の立場だからこそ、現場の本音を引き出し、ズレを可視化できます。"
  },
  {
    issue: "全体最適の施策・徹底が難しい",
    value: "「どこにズレがあるか」を論点化する",
    body: "誰が悪いかではなく、経営と現場・部門間の\"認識の差分\"を特定し、打ち手の的を絞ります。"
  },
  {
    issue: "徹底度が追いきれない",
    value: "旗振り・定点観測まで伴走する",
    body: "可視化して終わりではなく、施策の実行と定着を、外部の視点で継続的に支えます。"
  }
];

const oldAssessmentItems = [
  "経営層・管理職・現場を、それぞれ別々に評価する",
  "打ち手も「管理職研修」などレイヤー単位になりがち",
  "各層は改善しても、層と層の\"間\"のズレは残る",
  "結果として、組織全体では変わらない"
];

const leadersGapItems = [
  "経営と現場の「上下」、部門・工程間の「左右」を両側から捉える",
  "層の間・部門の間に生じる\"認識のズレ\"そのものを論点化",
  "組織全体で取り組める打ち手を提案する",
  "任せきりにせず、実行・定着まで伴走する"
];

const themes = [
  "戦略の一致",
  "優先順位の一致",
  "成果と評価の一致",
  "決定権の所在",
  "実務と設計の一致",
  "改善と運用の一致",
  "意思決定プロセス",
  "権限移譲の実行"
];

const processSteps = [
  "対象・部門・人数を決定",
  "回答者ごとに専用URLを発行",
  "経営側・現場側が回答",
  "認識差を集計・分析",
  "FBと次の施策を整理"
];

const answers = [
  {
    who: "人事部門",
    question: "「施策は全社で管轄している。外部のサービスは入れにくい」",
    answer: "全社施策は前提として、その隙間や現場の本音を汲むためのアシストです。既存の取り組みと競合しません。"
  },
  {
    who: "現場・部門",
    question: "「また余計な施策や取り組みが増えるのでは」",
    answer: "新たな取り組みではなく、既存業務の中で改善できることにフォーカスします。現場の負担は最小限です。"
  },
  {
    who: "社員",
    question: "「どうせ何を言っても変わらないのでは」",
    answer: "中立の第三者だからこそ、言いづらいことをきちんと経営へ提言します。声が施策に反映されます。"
  }
];

const caseActions = [
  ["全員面談実施", "リーダー層と経営陣の全員面談で認識差を把握"],
  ["若手向けスタンス教育", "3年目リーダー層の育成プログラムを設計"],
  ["裁量権の試験的実施", "店舗への権限委譲を段階的に実施"],
  ["効果計測を継続", "定着率・生産性の変化を継続的にモニタリング"]
];

export default function SampleLandingPage() {
  return (
    <main className="lgap-lp">
      <header className="lgap-header">
        <div className="lgap-wrap lgap-hd">
          <div className="lgap-logo">Leaders<span>GAP</span></div>
          <a href="#contact" className="lgap-header-cta">無料相談</a>
        </div>
      </header>

      <section className="lgap-hero">
        <div className="lgap-wrap">
          <div className="lgap-tag">組織の成長痛に向き合う経営層・人事の方へ</div>
          <div className="lgap-eyebrow lgap-eyebrow-left">Leaders GAP</div>
          <h1>経営と現場の<span>“見えないGAP”</span>を、<br />可視化する。</h1>
          <p>
            組織が一定の規模を超えたあたりから、経営の方針と現場の実感にズレが生じはじめます。
            1on1や研修では届かない「認識のズレ」を、設問とインタビューで可視化し、打ち手の優先順位を整理する組織サポートプログラムです。
          </p>
          <a href={demoAssessmentUrl} className="lgap-btn-primary">まずはデモ診断を試す</a>
          <div className="lgap-sub">※ ご担当者お一人でも受検いただけます</div>
        </div>
      </section>

      <section className="lgap-sec">
        <div className="lgap-wrap">
          <SectionHead eyebrow="Issue" title={<>組織が大きくなるほど、<br />なぜ「忖度」が生まれるのか</>} lead="制度や施策が足りないのではありません。組織が一定の規模に育つほど、構造的に「本音が届かない・徹底しきれない」状態が生まれます。" />
          <div className="lgap-issue-grid">
            {issues.map((issue, index) => (
              <article className="lgap-issue-card" key={issue.title}>
                <div className="lgap-issue-num">{String(index + 1).padStart(2, "0")}</div>
                <h3>{issue.title}</h3>
                <p>{issue.body}</p>
              </article>
            ))}
          </div>
          <div className="lgap-issue-note">これらは<b>努力不足ではなく</b>、組織が一定の規模に育つときに<b>構造的に生じるもの</b>です。</div>
        </div>
      </section>

      <section className="lgap-sec lgap-gray">
        <div className="lgap-wrap">
          <SectionHead eyebrow="Value" title="なぜ、リーダーズGAPで改善できるのか" lead="3つの構造的な課題に対し、「第三者からの可視化」という仕組みで、それぞれに応えます。" />
          <div className="lgap-pair">
            {valuePairs.map((pair, index) => (
              <div className="lgap-pair-row" key={pair.issue}>
                <div className="lgap-pair-issue">
                  <div className="lgap-k">課題 {String(index + 1).padStart(2, "0")}</div>
                  <h4>{pair.issue}</h4>
                </div>
                <div className="lgap-pair-arrow">→</div>
                <div className="lgap-pair-val">
                  <div className="lgap-k">リーダーズGAP</div>
                  <h4>{pair.value}</h4>
                  <p>{pair.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lgap-sec">
        <div className="lgap-wrap">
          <SectionHead eyebrow="Design" title="通常のアセスメントとの、思想の違い" lead="レイヤー単位で測り、レイヤー単位で手を打つ——それでは組織全体は変わりません。リーダーズGAPは「相互変革」を思想に置いています。" />
          <div className="lgap-vs">
            <AssessmentColumn title="レイヤー単位で測り、レイヤー単位で解決する" badge="通常のアセスメント" items={oldAssessmentItems} tone="old" />
            <AssessmentColumn title="上下・左右の聞き取りで、組織自体の課題を明確にする" badge="リーダーズGAP" items={leadersGapItems} tone="new" />
          </div>
          <div className="lgap-vs-concl">リーダーズGAPの思想は<span>「相互変革」</span>。<br />組織全体で取り組める打ち手の提案と、任せきりにしない伴走こそが価値です。</div>

          <div className="lgap-fig">
            <div className="lgap-fig-box lgap-fig-std">
              <div className="lgap-lbl">標準のリーダーズGAP</div>
              <h4>上下 1軸</h4>
              <div className="lgap-node lgap-node-navy">経営・管理職</div>
              <div className="lgap-arrow-v">↕</div>
              <div className="lgap-node lgap-node-navy">現場・担当</div>
            </div>
            <div className="lgap-arrow-r">→</div>
            <div className="lgap-fig-box lgap-fig-cus">
              <div className="lgap-lbl">カスタム設計</div>
              <h4>上下 ＋ 左右（管理職間・職種間・工程間の受け渡し）</h4>
              <div className="lgap-mrow">
                <div className="lgap-node lgap-node-out">管理職</div>
                <div className="lgap-hbar">↔</div>
                <div className="lgap-node lgap-node-out">管理職</div>
              </div>
              <div className="lgap-arrow-v">↕</div>
              <div className="lgap-node lgap-node-out lgap-node-center">担当</div>
              <div className="lgap-role-row">
                <div className="lgap-node lgap-node-blue">客先対応</div>
                <div className="lgap-node lgap-node-blue">工程・製造準備</div>
                <div className="lgap-node lgap-node-blue">品質</div>
              </div>
            </div>
          </div>

          <div className="lgap-report-wrap">
            <div className="lgap-cap">▼ アウトプットイメージ（フィードバックレポート例）</div>
            <div className="lgap-report-frame">
              <RadarComparisonChart data={sampleReportThemes} executiveLabel="経営側" fieldLabel="現場側" />
              <p>レポートイメージ例です。実際のスコアは、受検いただいた回答結果に基づいて集計されます。</p>
              <Link href="/sample/report" className="lgap-link-button">フィードバックサンプルを見る</Link>
            </div>
          </div>

          <div className="lgap-theme-grid">
            {themes.map((theme, index) => (
              <div className="lgap-theme-chip" key={theme}><span>THEME {String(index + 1).padStart(2, "0")}</span>{theme}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="lgap-sec lgap-gray" id="diff">
        <div className="lgap-wrap">
          <SectionHead eyebrow="Difference" title="1on1・研修との、決定的な違い" lead="1on1や研修は「手段」です。先に決めるべきは、何を変えるかという論点。リーダーズGAPは、その論点を特定するための診断です。" />
          <div className="lgap-table-wrap">
            <table className="lgap-diff-table">
              <thead>
                <tr><th></th><th>1on1・コーチング</th><th>研修プログラム</th><th>Leaders GAP</th></tr>
              </thead>
              <tbody>
                <tr><td>起点</td><td>個人の悩みや課題に依存</td><td>階層ごとに一律カリキュラム</td><td>全体調査で特定した「GAP」=課題の本質</td></tr>
                <tr><td>何を決めるか</td><td>個人との対話で決定</td><td>受講を通じた課題の認識</td><td>組織に根付くGAPを解消する行動計画・施策・指標</td></tr>
                <tr><td>提供価値</td><td>本人の内省・スタンス教育</td><td>知識や技術のインストール</td><td>組織単位での改善と実行</td></tr>
                <tr><td>継続性・成果</td><td>本人の行動に依存</td><td>徹底は個人に依存</td><td>旗振り・定点観測を伴走</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="lgap-sec">
        <div className="lgap-wrap">
          <SectionHead eyebrow="Process" title="進め方" lead="大きな仕組みや新しいツールを導入するのではなく、小さくても「実際に変わった」という実感をつくります。" />
          <div className="lgap-proc">
            {processSteps.map((step, index) => (
              <div className="lgap-proc-step" key={step}>
                <div className="lgap-proc-num">{index + 1}</div>
                <h4>{step}</h4>
              </div>
            ))}
          </div>
          <div className="lgap-proc-note">診断結果は個人評価ではなく、経営側と現場側の認識差を確認するために使用します。</div>
        </div>
      </section>

      <section className="lgap-sec lgap-gray">
        <div className="lgap-wrap">
          <SectionHead eyebrow="Answer" title="部門ごとの、想定されるご懸念" lead="導入を検討される際、各部門から挙がりやすいご懸念に、あらかじめお答えします。" />
          <div className="lgap-ans-list">
            {answers.map((item) => (
              <div className="lgap-ans-item" key={item.who}>
                <div className="lgap-ans-who">{item.who}</div>
                <div className="lgap-ans-body">
                  <div className="lgap-q">{item.question}</div>
                  <div className="lgap-a">{item.answer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lgap-sec">
        <div className="lgap-wrap">
          <SectionHead eyebrow="Case" title="実施事例：美容サロン（店舗業）" lead="離職率の高止まりを課題に、経営陣と現場の認識差を可視化した事例です。" />
          <div className="lgap-case-detail">
            <div className="lgap-case-meta">
              <MetaItem number="50名" label="正社員" />
              <MetaItem number="都市部" label="商圏" />
              <MetaItem number="20名" label="調査対象" />
            </div>
            <div className="lgap-case-cols">
              <CaseBlock title="背景と課題">
                離職率が年々高止まりし、特に女性比率の高い業界のため、新卒が入社後数年で退職・結婚後に復職せず退職するケースが続いていた。社内アンケートを行い労働環境の改善を進めていたが、効果は今ひとつの状態だった。
              </CaseBlock>
              <CaseBlock title="診断で分かったこと">
                経営陣ならびに全店舗で約20名にインタビューと診断を実施。結果、経営陣が感じていた課題とは異なり、若手は業務にやりがいを感じており、むしろ長期的に働きたいという声が多かった。一方、3年目（主任・店長クラス）で大きくエンゲージメントが低下していることが判明。「自分がマネジメントになっても、若手への見せられ方が描けていない」という、長期を見越した若手育成の仕組みづくりが優先課題と分かった。
              </CaseBlock>
            </div>
            <div className="lgap-case-actions">
              <div className="lgap-ca-head">結果とアクション</div>
              <div className="lgap-ca-grid">
                {caseActions.map(([title, body]) => (
                  <div className="lgap-ca-item" key={title}><b>{title}</b>{body}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lgap-final" id="cta">
        <div className="lgap-wrap">
          <h2>まずは、自組織のGAPを<br />確かめてみてください</h2>
          <p>「どこにズレがあるか分からない」段階でも大丈夫です。まずはご担当者お一人でデモ診断をお試しいただくか、現状をうかがいながら一緒に論点を整理します。</p>
          <a href={demoAssessmentUrl} className="lgap-btn-primary">まずはデモ診断を試す</a>
          <div className="lgap-sub">導入のご相談も無料で承っています</div>
        </div>
      </section>

      <section className="lgap-sec lgap-gray" id="contact">
        <div className="lgap-wrap">
          <SectionHead eyebrow="Contact" title="無料相談・お問い合わせ" lead="「どこにズレがあるか分からない」段階でも大丈夫です。まずはお気軽にご相談ください。担当より折り返しご連絡します。" />
          <ContactForm />
        </div>
      </section>

      <footer className="lgap-footer">合同会社Two rails ｜ リーダーズGAP診断</footer>
    </main>
  );
}

function SectionHead({ eyebrow, title, lead }: { eyebrow: string; title: React.ReactNode; lead: string }) {
  return (
    <>
      <div className="lgap-eyebrow">{eyebrow}</div>
      <h2 className="lgap-sec-title">{title}</h2>
      <p className="lgap-sec-lead">{lead}</p>
    </>
  );
}

function AssessmentColumn({ title, badge, items, tone }: { title: string; badge: string; items: string[]; tone: "old" | "new" }) {
  return (
    <div className={`lgap-vs-col lgap-vs-${tone}`}>
      <span className="lgap-vs-badge">{badge}</span>
      <h3>{title}</h3>
      <ul>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}

function MetaItem({ number, label }: { number: string; label: string }) {
  return (
    <div className="lgap-meta-item">
      <div className="lgap-meta-num">{number}</div>
      <div className="lgap-meta-lbl">{label}</div>
    </div>
  );
}

function CaseBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="lgap-case-block">
      <h4>{title}</h4>
      <p>{children}</p>
    </div>
  );
}
