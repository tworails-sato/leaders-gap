import { NextResponse } from "next/server";

let lastNotificationAt = 0;
const RATE_LIMIT_MS = 5 * 60 * 1000;

type CompletionPayload = {
  participantCount?: unknown;
};

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  try {
    if (origin && host && new URL(origin).host !== host) {
      return NextResponse.json({ error: "送信できませんでした。" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "送信できませんでした。" }, { status: 403 });
  }

  let payload: CompletionPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "送信内容を確認してください。" }, { status: 400 });
  }

  if (payload.participantCount !== 1 && payload.participantCount !== 2) {
    return NextResponse.json({ error: "送信内容を確認してください。" }, { status: 400 });
  }

  const now = Date.now();
  if (now - lastNotificationAt < RATE_LIMIT_MS) {
    return NextResponse.json({ ok: true });
  }
  lastNotificationAt = now;

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.SAMPLE_COMPLETION_NOTIFY_EMAIL || process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !from || !to) {
    return NextResponse.json({ ok: true, notification: "skipped" });
  }

  const completedAt = new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "long",
    timeStyle: "medium",
    timeZone: "Asia/Tokyo"
  }).format(new Date());

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to,
      subject: "【リーダーズGAP】デモ診断が完了しました",
      text: `リーダーズGAPのデモ診断が完了しました。\n\n回答人数：${payload.participantCount}名\n完了日時：${completedAt}\n\n氏名・メールアドレス・回答内容は取得していません。`
    })
  });

  if (!response.ok) {
    return NextResponse.json({ ok: true, notification: "failed" });
  }

  return NextResponse.json({ ok: true, notification: "sent" });
}
