import { requireApiAdmin } from "@/lib/api-auth";
import { csvResponse } from "@/lib/csv";
import { smallThemeName } from "@/lib/questions";
import { summarizeResponses } from "@/lib/scoring";
import { createAdminClient } from "@/lib/supabase";

export async function GET(_: Request, { params }: { params: Promise<{ project_id: string }> }) {
  const { project_id } = await params;
  const auth = await requireApiAdmin();
  if (auth.error) return auth.error;

  const supabase = createAdminClient();
  const [{ data: project }, { data: responses }] = await Promise.all([
    supabase.from("gap_projects").select("*").eq("id", project_id).single(),
    supabase.from("gap_responses").select("*").eq("project_id", project_id)
  ]);
  const summary = summarizeResponses(responses ?? []);

  const responseRows = [
    ["回答CSV"],
    ["project_id", "company_name", "project_name", "respondent_type", "name", "email", "employment_type", "department", "tenure", "position", "answers", "theme_scores", "total_score", "created_at"],
    ...(responses ?? []).map((row) => [
      row.project_id,
      project?.company_name,
      project?.project_name,
      row.respondent_type,
      row.name,
      row.email,
      row.employment_type,
      row.department,
      row.tenure,
      row.position,
      row.answers,
      row.scores,
      row.total_score,
      row.created_at
    ]),
    [],
    ["集計CSV"],
    ["company_name", "project_name", "theme_key", "theme_name", "ceo_score", "manager_average_score", "gap", "absolute_gap", "standard_deviation", "judgment"],
    ...summary.smallThemeScores.map((row) => [
      project?.company_name,
      project?.project_name,
      row.key,
      smallThemeName(row.key),
      row.ceoScore,
      row.managerAverage,
      row.gap,
      row.absoluteGap,
      row.standardDeviation,
      row.judgment
    ])
  ];

  return csvResponse(responseRows, `leaders-gap-${project_id}.csv`);
}
