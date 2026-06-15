export type RespondentType = "ceo" | "executive" | "manager";

export type Question = {
  id: number;
  text: string;
  smallThemeKey: string;
};

export type SmallTheme = {
  key: string;
  name: string;
  description: string;
  parentKey: string;
  viewpoint: string[];
  gaps: string[];
  solutions?: string[];
};

export type BigTheme = {
  key: string;
  name: string;
  smallThemeKeys: string[];
};

export const bigThemes: BigTheme[] = [
  { key: "strategy", name: "戦略", smallThemeKeys: ["strategy_alignment", "priority_alignment"] },
  { key: "evaluation_system", name: "評価と制度", smallThemeKeys: ["evaluation_alignment", "decision_authority_alignment"] },
  { key: "tactics", name: "戦術", smallThemeKeys: ["execution_design_alignment", "improvement_operation_alignment"] },
  { key: "organization", name: "組織体制", smallThemeKeys: ["decision_process_alignment", "delegation_execution"] }
];

export const smallThemes: SmallTheme[] = [
  {
    key: "strategy_alignment",
    name: "戦略の一致",
    description: "何を目指し、なぜ取り組むのか、どのような状態を成功とみなすのかについて、経営側と実行側の認識が揃っているかを確認します。",
    parentKey: "strategy",
    viewpoint: ["何を目指すか", "なぜそれをやるか", "どういう状態を成功とみなすか"],
    gaps: ["方向性の解釈ズレ", "伝達のズレ", "危機感のズレ", "計画のズレ", "優先度のズレ"],
    solutions: ["対話機会の設定", "詳細インタビューの実施", "成長戦略と優先度の明確化", "ミニデブの実施", "計画策定ワークの実施"]
  },
  {
    key: "priority_alignment",
    name: "優先順位の一致",
    description: "何を最優先し、何を後回しにするのか、また状況の変化に応じて優先順位をどう更新するのかについて確認します。",
    parentKey: "strategy",
    viewpoint: ["何を最優先するか", "何を後回しにするか", "状況変化時にどう更新するか"],
    gaps: ["方向性の解釈ズレ", "伝達のズレ", "危機感のズレ", "計画のズレ", "優先度のズレ"],
    solutions: ["1on1の再度設計実践", "ルールなどのバディング", "実行側向けのバディング"]
  },
  {
    key: "evaluation_alignment",
    name: "成果と評価の一致",
    description: "何を成果として捉え、どの基準で評価し、その評価をどのように本人へ伝えるのかについて確認します。",
    parentKey: "evaluation_system",
    viewpoint: ["何を成果として見るか", "何を基準に評価するか", "その評価がどう伝えられるか"],
    gaps: ["業務と評価の整合性", "評価基準のズレ", "成果物の認識のズレ", "自己評価のズレ", "フィードバックのズレ"],
    solutions: ["制度設計と評価プロセスの構築", "役割と評価項目の設定", "評価制度、プロセス見直し"]
  },
  {
    key: "decision_authority_alignment",
    name: "決定権の所在の一致",
    description: "誰が何を決めるのか、どの事項に承認が必要か、判断に迷った際に誰へ相談するのかが明確になっているかを確認します。",
    parentKey: "evaluation_system",
    viewpoint: ["誰が何を決めるか定義されているか", "承認基準が決まっているか", "判断範囲がルールとして明確か", "エスカレーション先が決まっているか"],
    gaps: ["責任範囲の理解のズレ", "制度理解のズレ", "評価基準のズレ"],
    solutions: ["報酬制度設計", "目標設計", "人事配置転換", "職能の見直し"]
  },
  {
    key: "execution_design_alignment",
    name: "実務と設計の一致",
    description: "戦略や方針が、現場で実行できる具体的な行動や、部門・担当者ごとの目標に落とし込まれているかを確認します。",
    parentKey: "tactics",
    viewpoint: ["戦略が実行可能な行動に落ちているか", "部門、担当レベルに翻訳されているか"],
    gaps: ["行動のズレ", "振り返りのズレ", "原因解釈のズレ", "仮説レベルのズレ", "再発防止思考のズレ"]
  },
  {
    key: "improvement_operation_alignment",
    name: "改善と運用の一致",
    description: "課題や原因についての認識が揃い、振り返りから改善、次の行動への反映までが継続的に行われているかを確認します。",
    parentKey: "tactics",
    viewpoint: ["課題特定や原因把握が一致しているか", "振り返りや改善反映が回っているか"],
    gaps: ["行動のズレ", "振り返りのズレ", "原因解釈のズレ", "仮説レベルのズレ", "再発防止思考のズレ"]
  },
  {
    key: "decision_process_alignment",
    name: "意思決定プロセスの一致",
    description: "必要な情報共有、判断までの流れ、意思決定の速さと分散が、組織内で適切に機能しているかを確認します。",
    parentKey: "organization",
    viewpoint: ["情報共有", "判断フロー", "判断スピードと分散がそれぞれ機能しているか"],
    gaps: ["情報の非対称性のズレ", "権限の不足のズレ", "可処分時間のズレ", "期待のズレ", "握りのズレ"]
  },
  {
    key: "delegation_execution",
    name: "権限移譲の実行",
    description: "現場が実際に自ら判断できているか、不要な承認や介入が発生していないか、定めた権限が実務でも機能しているかを確認します。",
    parentKey: "organization",
    viewpoint: ["現場で実際に自分で判断できているか", "不要な承認が発生していないか", "ルール通りに運用されているか", "実務上、認識ズレが起きていないか"],
    gaps: ["情報の非対称性のズレ", "権限の不足のズレ", "可処分時間のズレ", "期待のズレ", "握りのズレ"]
  }
];

const q = (id: number, smallThemeKey: string, text: string): Question => ({ id, smallThemeKey, text });

export const questions: Question[] = [
  q(1, "strategy_alignment", "今期、重点を置く戦略について、意思決定者と実行責任者の認識は一致している"),
  q(2, "strategy_alignment", "中長期的な方針や方向性について、両者の認識は一致している"),
  q(3, "strategy_alignment", "戦略や方針を決める際、意思決定者と実行責任者の間で事前のすり合わせが行われている"),
  q(4, "strategy_alignment", "戦略や方針を変更する際、その背景が両者で共有されている"),
  q(5, "strategy_alignment", "実行責任者からの提案や意見が、意思決定の場で適切に扱われている"),
  q(6, "strategy_alignment", "今期の重点戦略について、達成とみなす状態が両者で共有されている"),
  q(7, "priority_alignment", "短期的な成果を上げるために最重要な事項が、行動・打ち手レベルで共有されている"),
  q(8, "priority_alignment", "事業目標は具体的な数値に落とし込まれており、その内容が両者で共有されている"),
  q(9, "priority_alignment", "優先順位および行動の見直しは、両者で都度すり合わせを行い、常に最新の状態になっている"),
  q(10, "priority_alignment", "事業環境や状況変化に応じて、優先順位を見直す判断基準が共有されている"),
  q(11, "priority_alignment", "優先順位を明確にする際、今やらないこと・後回しにすることも共有されている"),
  q(12, "priority_alignment", "実行責任者が日常業務の中で自ら判断して進めるべき事項が明確になっている"),
  q(13, "evaluation_alignment", "評価対象となる成果や役割期待が、事前に明確になっている"),
  q(14, "evaluation_alignment", "「成果」と「行動」をどのような比重で評価するかが明確に決まっている"),
  q(15, "evaluation_alignment", "評価結果の伝え方やフィードバックの方法が、あらかじめ定まっている"),
  q(16, "evaluation_alignment", "評価の根拠が、面談等を通じて本人に説明されている"),
  q(17, "evaluation_alignment", "評価が定性的な印象に偏らず、事前に定めた指標や事実に基づいて行われている"),
  q(18, "evaluation_alignment", "成果や行動に対するフィードバックが、適切な頻度で行われている"),
  q(19, "decision_authority_alignment", "意思決定者と実行責任者の役割分担、誰が何を決めるかが明確になっている"),
  q(20, "decision_authority_alignment", "意思決定者の承認や確認が必要な事項は、明確な基準をもとに設定されている"),
  q(21, "decision_authority_alignment", "判断基準が共有されていて、担当者によって判断が異なることが少ない"),
  q(22, "decision_authority_alignment", "判断に迷う事項が発生した際、速やかに報連相ができる状態になっている"),
  q(23, "decision_authority_alignment", "権限と責任の分担が、事業の実態に合わせて整理されている"),
  q(24, "decision_authority_alignment", "例外的な判断が必要な場合、誰にどのタイミングで相談するかが明確になっている"),
  q(25, "execution_design_alignment", "戦略や方針は、現場・担当者が実行可能な具体的行動レベルまで落とし込まれている"),
  q(26, "execution_design_alignment", "重点施策が、各部門や担当者の目標にまで接続されている"),
  q(27, "execution_design_alignment", "目標達成に向けた行動計画が、両者で共有されている"),
  q(28, "execution_design_alignment", "実行状況を確認するための指標や進捗管理方法が明確になっている"),
  q(29, "execution_design_alignment", "実行する上での課題やボトルネックを把握するための確認機会が設けられている"),
  q(30, "execution_design_alignment", "やるべきことと同じく、優先的にやらないことが整理されている"),
  q(31, "improvement_operation_alignment", "課題と原因を整理するためのフォーマットや視点が両者で共有されている"),
  q(32, "improvement_operation_alignment", "改善すべき個所・論点について、現場での情報共有をもとに両者の認識が常に一致している"),
  q(33, "improvement_operation_alignment", "改善策を検討する際、互いの感覚ではなく共通の仮説を立て、仮説に基づいた議論が行われている"),
  q(34, "improvement_operation_alignment", "改善施策の実施後に、振り返りの機会がきちんと設定されている"),
  q(35, "improvement_operation_alignment", "改善施策の振り返りは、数値や事実、ファクトをもとに検証がなされている"),
  q(36, "improvement_operation_alignment", "振り返りで得た学びが、次の行動や計画の見直しに反映されている"),
  q(37, "decision_process_alignment", "意思決定に必要な情報が、関係者に適切に共有されている"),
  q(38, "decision_process_alignment", "重要な意思決定を行う際のプロセス・期間が共通認識になっている"),
  q(39, "decision_process_alignment", "判断する内容や粒度に応じて、会議体が整理されている"),
  q(40, "decision_process_alignment", "実行責任者が判断に必要な情報を十分に得られる状態になっている"),
  q(41, "decision_process_alignment", "意思決定が特定の個人に過度に集中しすぎない状態になっている"),
  q(42, "decision_process_alignment", "重要な意思決定が、承認待ちのまま滞らず、適切なタイミングで行われている"),
  q(43, "delegation_execution", "実行責任者が、自身の担当範囲において意思決定者の承認を待たずに判断できている"),
  q(44, "delegation_execution", "現場で判断できる事項についても、過剰に意思決定者への確認を求めていない"),
  q(45, "delegation_execution", "実行責任者の判断や意思決定が、後から頻繁に覆されることはない"),
  q(46, "delegation_execution", "意思決定者は、必要以上に実行責任者の判断や業務に介入しない"),
  q(47, "delegation_execution", "現場判断の範囲外が起きた時には、スムーズに相談や承認が行えている"),
  q(48, "delegation_execution", "定められている判断権限の範囲であっても、実務上は上位者の確認や判断が求められることがある")
];

export function smallThemeName(key: string) {
  return smallThemes.find((theme) => theme.key === key)?.name ?? key;
}

export function bigThemeName(key: string) {
  return bigThemes.find((theme) => theme.key === key)?.name ?? key;
}
