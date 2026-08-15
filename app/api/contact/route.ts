import { NextResponse } from "next/server";

const subjects = new Set([
  "プログラムの詳細や実績を知りたい",
  "費用や導入について知りたい",
  "協業・提携について",
  "その他"
]);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactPayload = {
  company?: unknown;
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  website?: unknown;
};

export async function POST(request: Request) {
  let payload: ContactPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "送信内容を確認してください。" }, { status: 400 });
  }

  const honeypot = normalize(payload.website);
  if (honeypot) {
    return NextResponse.json({ message: "お問い合わせありがとうございました。担当より折り返しご連絡します。" });
  }

  const company = normalize(payload.company);
  const name = normalize(payload.name);
  const email = normalize(payload.email).toLowerCase();
  const subject = normalize(payload.subject);
  const message = normalize(payload.message);

  if (!company || !name || !email || !subject) {
    return NextResponse.json({ error: "必須項目を入力してください。" }, { status: 400 });
  }
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "メールアドレスの形式を確認してください。" }, { status: 400 });
  }
  if (!subjects.has(subject)) {
    return NextResponse.json({ error: "ご用件を選択してください。" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL || "sato.motoki@t-rails.com";
  if (!apiKey || !from) {
    return NextResponse.json({ error: "送信設定が不足しています。" }, { status: 500 });
  }

  const text = `リーダーズGAP LPから無料相談の問い合わせがありました。

【会社名】
${company}

【ご担当者名】
${name}

【メールアドレス】
${email}

【ご用件】
${subject}

【ご相談内容・備考】
${message || "未入力"}`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: email,
      subject: `【リーダーズGAP】無料相談：${company} ${name}様`,
      text
    })
  });

  if (!response.ok) {
    return NextResponse.json({ error: "送信できませんでした。" }, { status: 502 });
  }

  return NextResponse.json({ message: "お問い合わせありがとうございました。担当より折り返しご連絡します。" });
}

function normalize(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
