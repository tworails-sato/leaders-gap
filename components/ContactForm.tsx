"use client";

import type React from "react";
import { useState } from "react";

const subjects = [
  "プログラムの詳細や実績を知りたい",
  "費用や導入について知りたい",
  "協業・提携について",
  "その他"
];

type Status = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function submitContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(formData.entries())),
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) throw new Error("Failed to send contact form");

      form.reset();
      setStatus("success");
      setMessage("お問い合わせありがとうございました。担当より折り返しご連絡します。");
    } catch {
      setStatus("error");
      setMessage("送信できませんでした。入力内容をご確認のうえ、時間をおいて再度お試しください。");
    }
  }

  return (
    <form className="lgap-cform" id="contactForm" onSubmit={submitContact}>
      <div className="lgap-honeypot" aria-hidden="true">
        <label>
          会社URL
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="lgap-frow">
        <label htmlFor="company">会社名 <span className="lgap-req">必須</span></label>
        <input id="company" type="text" name="company" required />
      </div>
      <div className="lgap-frow">
        <label htmlFor="name">ご担当者名 <span className="lgap-req">必須</span></label>
        <input id="name" type="text" name="name" required />
      </div>
      <div className="lgap-frow">
        <label htmlFor="email">メールアドレス <span className="lgap-req">必須</span></label>
        <input id="email" type="email" name="email" required />
      </div>
      <div className="lgap-frow">
        <label htmlFor="subject">ご用件 <span className="lgap-req">必須</span></label>
        <select id="subject" name="subject" required defaultValue="">
          <option value="">選択してください</option>
          {subjects.map((subject) => <option value={subject} key={subject}>{subject}</option>)}
        </select>
      </div>
      <div className="lgap-frow">
        <label htmlFor="message">ご相談内容・備考 <span className="lgap-opt">任意</span></label>
        <textarea id="message" name="message" rows={5} placeholder="ご相談内容をご記入ください" />
      </div>
      <div className="lgap-fsubmit">
        <button type="submit" className="lgap-btn-contact" disabled={status === "sending"}>
          {status === "sending" ? "送信中..." : "この内容で送信する"}
        </button>
        <p className="lgap-fnote">※ ご入力いただいた内容は、ご相談への対応のみに使用します。</p>
        {message ? <p className={`lgap-form-message lgap-form-message-${status}`} aria-live="polite">{message}</p> : null}
      </div>
    </form>
  );
}
