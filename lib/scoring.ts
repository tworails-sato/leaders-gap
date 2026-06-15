import { bigThemes, questions, smallThemes } from "./questions";

export type Answers = Record<string, number>;

export type ResponseRow = {
  respondent_type: "ceo" | "executive" | "manager";
  answers: Answers;
  scores?: unknown;
};

export type ThemeScore = {
  key: string;
  name: string;
  ceoScore: number | null;
  managerAverage: number | null;
  gap: number | null;
  absoluteGap: number | null;
  standardDeviation: number | null;
  min: number | null;
  max: number | null;
  judgment: string;
};

export function average(values: number[]) {
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function round(value: number | null, digits = 2) {
  if (value === null || Number.isNaN(value)) return null;
  return Number(value.toFixed(digits));
}

export function stddev(values: number[]) {
  if (values.length < 2) return null;
  const avg = average(values)!;
  const variance = values.reduce((sum, value) => sum + (value - avg) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

export function scoreAnswers(answers: Answers) {
  const small: Record<string, number | null> = {};

  for (const theme of smallThemes) {
    const values = questions
      .filter((question) => question.smallThemeKey === theme.key)
      .map((question) => Number(answers[String(question.id)]))
      .filter((value) => Number.isFinite(value));
    small[theme.key] = round(average(values));
  }

  const big: Record<string, number | null> = {};
  for (const theme of bigThemes) {
    big[theme.key] = round(average(theme.smallThemeKeys.map((key) => small[key]).filter((value): value is number => value !== null)));
  }

  const totalScore = round(average(Object.values(small).filter((value): value is number => value !== null)));
  return { small, big, totalScore };
}

export function judgeGap(absGap: number | null) {
  if (absGap === null) return "-";
  if (absGap <= 0.4) return "ほぼ認識一致";
  if (absGap <= 0.9) return "ややズレあり";
  if (absGap <= 1.4) return "重点確認テーマ";
  return "大きな認識差";
}

function scoreFor(row: ResponseRow, themeKey: string) {
  const scored = row.scores && typeof row.scores === "object" ? row.scores as { small?: Record<string, number> } : scoreAnswers(row.answers);
  return scored.small?.[themeKey] ?? null;
}

export function summarizeResponses(rows: ResponseRow[]) {
  const ceo = rows.find((row) => row.respondent_type === "ceo");
  const managers = rows.filter((row) => row.respondent_type === "manager" || row.respondent_type === "executive");

  const smallThemeScores: ThemeScore[] = smallThemes.map((theme) => {
    const ceoScore = ceo ? scoreFor(ceo, theme.key) : null;
    const managerScores = managers
      .map((row) => scoreFor(row, theme.key))
      .filter((score): score is number => score !== null);
    const managerAverage = round(average(managerScores));
    const gap = ceoScore !== null && managerAverage !== null ? round(ceoScore - managerAverage) : null;
    const absoluteGap = gap !== null ? round(Math.abs(gap)) : null;

    return {
      key: theme.key,
      name: theme.name,
      ceoScore: round(ceoScore),
      managerAverage,
      gap,
      absoluteGap,
      standardDeviation: round(stddev(managerScores)),
      min: managerScores.length ? Math.min(...managerScores) : null,
      max: managerScores.length ? Math.max(...managerScores) : null,
      judgment: judgeGap(absoluteGap)
    };
  });

  const bigThemeScores = bigThemes.map((theme) => {
    const children = smallThemeScores.filter((item) => theme.smallThemeKeys.includes(item.key));
    const ceoScore = round(average(children.map((item) => item.ceoScore).filter((value): value is number => value !== null)));
    const managerAverage = round(average(children.map((item) => item.managerAverage).filter((value): value is number => value !== null)));
    const gap = ceoScore !== null && managerAverage !== null ? round(ceoScore - managerAverage) : null;
    const absoluteGap = gap !== null ? round(Math.abs(gap)) : null;

    return {
      key: theme.key,
      name: theme.name,
      ceoScore,
      managerAverage,
      gap,
      absoluteGap,
      standardDeviation: round(average(children.map((item) => item.standardDeviation).filter((value): value is number => value !== null))),
      min: null,
      max: null,
      judgment: judgeGap(absoluteGap)
    };
  });

  const questionScores = questions.map((question) => {
    const ceoScore = ceo ? Number(ceo.answers[String(question.id)]) : null;
    const managerValues = managers
      .map((row) => Number(row.answers[String(question.id)]))
      .filter((value) => Number.isFinite(value));
    const managerAverage = round(average(managerValues));
    const gap = ceoScore !== null && managerAverage !== null ? round(ceoScore - managerAverage) : null;
    const absoluteGap = gap !== null ? round(Math.abs(gap)) : null;
    return {
      id: question.id,
      text: question.text,
      smallThemeKey: question.smallThemeKey,
      ceoScore,
      managerAverage,
      gap,
      absoluteGap,
      standardDeviation: round(stddev(managerValues)),
      judgment: judgeGap(absoluteGap)
    };
  });

  return {
    responseCounts: {
      total: rows.length,
      ceo: rows.filter((row) => row.respondent_type === "ceo").length,
      managers: managers.length
    },
    smallThemeScores,
    bigThemeScores,
    questionScores,
    topGaps: [...smallThemeScores].filter((item) => item.absoluteGap !== null).sort((a, b) => (b.absoluteGap ?? 0) - (a.absoluteGap ?? 0)).slice(0, 3),
    lowGaps: [...smallThemeScores].filter((item) => item.absoluteGap !== null).sort((a, b) => (a.absoluteGap ?? 0) - (b.absoluteGap ?? 0)).slice(0, 3)
  };
}
