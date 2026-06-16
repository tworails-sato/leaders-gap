import { judgeGap, round } from "./scoring";

export const sampleReportCompany = {
  companyName: "株式会社サンプルワークス",
  executiveCount: 1,
  fieldCount: 4
};

export const sampleReportThemes = [
  { key: "strategy_alignment", theme: "戦略の一致", executiveScore: 4.4, fieldScore: 3.1 },
  { key: "priority_alignment", theme: "優先順位の一致", executiveScore: 4.2, fieldScore: 2.9 },
  { key: "evaluation_alignment", theme: "成果と評価の一致", executiveScore: 3.8, fieldScore: 2.7 },
  { key: "decision_authority_alignment", theme: "決定権の所在の一致", executiveScore: 4.3, fieldScore: 2.5 },
  { key: "execution_design_alignment", theme: "実務と設計の一致", executiveScore: 3.9, fieldScore: 3.0 },
  { key: "improvement_operation_alignment", theme: "改善と運用の一致", executiveScore: 3.6, fieldScore: 3.2 },
  { key: "decision_process_alignment", theme: "意思決定プロセスの一致", executiveScore: 4.0, fieldScore: 2.8 },
  { key: "delegation_execution", theme: "権限移譲の実行", executiveScore: 4.5, fieldScore: 2.4 }
].map((row) => {
  const gap = round(row.executiveScore - row.fieldScore);
  const absoluteGap = gap === null ? null : round(Math.abs(gap));
  return {
    ...row,
    gap,
    absoluteGap,
    judgment: judgeGap(absoluteGap)
  };
});

export const sampleTopGaps = [...sampleReportThemes]
  .sort((a, b) => (b.absoluteGap ?? 0) - (a.absoluteGap ?? 0))
  .slice(0, 3);

export const sampleLowGaps = [...sampleReportThemes]
  .sort((a, b) => (a.absoluteGap ?? 0) - (b.absoluteGap ?? 0))
  .slice(0, 3);

export const sampleFeedback = {
  summary:
    "経営側は「方針や権限を一定程度伝えている」と認識している一方、現場側では「判断できる範囲や優先順位が十分に明確ではない」と感じている傾向が見られます。\n\n特に、決定権の所在、権限移譲の実行、意思決定プロセスで大きなGAPが確認されました。",
  lowGap:
    "改善と運用の一致については、経営側・現場側の認識差が比較的小さく、振り返りや改善活動の土台は一定程度共有されている可能性があります。",
  factors:
    "経営側は「任せている」つもりでも、現場側では、どこまで自分で判断してよいか、どの時点で相談すべきかが明確になっていない可能性があります。\n\nまた、判断後に方針が覆る経験がある場合、現場側が慎重になり、結果として確認や承認が増えている可能性があります。",
  executiveView: ["方針は共有している", "一定の裁量は渡している", "必要な時だけ確認している", "現場側にもっと自走してほしい"],
  fieldView: ["優先順位が変わることがある", "判断範囲が曖昧", "後から判断が覆ることがある", "相談しないことへの不安がある"],
  shortTerm: ["決定事項・相談事項・報告事項を整理する", "部長ごとの権限範囲を明文化する", "週次で判断事項を振り返る", "判断が覆った事例を整理し、基準を共有する"],
  midTerm: ["役割と権限の見直し", "意思決定ルールの標準化", "部長向け判断トレーニング", "権限移譲の進捗を定期的に再診断する"],
  notes:
    "このページはパートナー提案用のサンプルです。実案件の回答データ、管理画面、Supabase保存、CSV出力、FB保存処理とは接続していません。"
};
