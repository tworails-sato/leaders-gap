import { NextResponse } from "next/server";
import { questions } from "@/lib/questions";
import { scoreAnswers } from "@/lib/scoring";
import { createAdminClient } from "@/lib/supabase";

export async function POST(request: Request) {
  const payload = await request.json();
  const token = String(payload.token || "");
  const supabase = createAdminClient();

  const { data: invitation } = await supabase
    .from("gap_invitations")
    .select("*")
    .eq("token", token)
    .maybeSingle();

  if (!invitation) return NextResponse.json({ error: "不正なURLです。" }, { status: 404 });
  if (invitation.used_at) return NextResponse.json({ error: "このURLは回答済みです。" }, { status: 409 });
  if (invitation.expires_at && new Date(invitation.expires_at) < new Date()) {
    return NextResponse.json({ error: "回答期限が過ぎています。" }, { status: 410 });
  }

  const answers: Record<string, number> = {};
  for (const question of questions) {
    const value = Number(payload[`q_${question.id}`]);
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      return NextResponse.json({ error: "全問に1〜5点で回答してください。" }, { status: 400 });
    }
    answers[String(question.id)] = value;
  }

  const scores = scoreAnswers(answers);
  const { error: responseError } = await supabase.from("gap_responses").insert({
    project_id: invitation.project_id,
    invitation_id: invitation.id,
    respondent_type: invitation.respondent_type,
    name: payload.name,
    email: payload.email,
    employment_type: payload.employment_type,
    department: payload.department,
    tenure: payload.tenure,
    position: payload.position,
    answers,
    scores,
    total_score: scores.totalScore
  });

  if (responseError) return NextResponse.json({ error: responseError.message }, { status: 500 });

  await supabase
    .from("gap_invitations")
    .update({ used_at: new Date().toISOString(), name: payload.name, email: payload.email })
    .eq("id", invitation.id);

  return NextResponse.json({ ok: true });
}
