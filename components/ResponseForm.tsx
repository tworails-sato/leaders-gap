"use client";

import Link from "next/link";
import { useState } from "react";
import { questions, smallThemes } from "@/lib/questions";

type Props = {
  mode?: "production" | "sample";
  invitation?: {
    id: string;
    token: string;
    respondent_type: string;
    name: string | null;
    email: string | null;
    expires_at: string | null;
    gap_projects?: {
      company_name?: string | null;
      project_name?: string | null;
    } | null;
  };
};

const employmentTypes = ["正社員", "アルバイト", "契約社員", "業務委託", "インターン", "その他"];
const tenureOptions = ["1年以内", "1～4年", "5～10年", "10年以上"];
const scoreLabels: Record<number, string> = {
  1: "あてはまらない",
  2: "",
  3: "",
  4: "",
  5: "あてはまる"
};

export function ResponseForm({ invitation, mode = "production" }: Props) {
  const isSample = mode === "sample";
  const [step, setStep] = useState<"guide" | "profile" | "questions" | "sampleDone">("guide");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [unansweredIds, setUnansweredIds] = useState<number[]>([]);
  const [profile, setProfile] = useState({
    name: invitation?.name ?? "",
    email: invitation?.email ?? "",
    employment_type: "",
    department: "",
    tenure: "",
    position: ""
  });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    const missing = questions.filter((question) => !answers[question.id]).map((question) => question.id);
    if (missing.length > 0) {
      setUnansweredIds(missing);
      setError(`未回答の設問が${missing.length}問あります。すべての設問に回答してください。`);
      window.setTimeout(() => document.getElementById(`question-${missing[0]}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
      return;
    }

    if (isSample) {
      setStep("sampleDone");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(form.entries());
    const response = await fetch("/api/respond/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    setLoading(false);
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload.error || "保存に失敗しました。");
      return;
    }

    window.location.replace("/thanks");
  }

  function resetSample() {
    setStep("guide");
    setError("");
    setProfileErrors({});
    setAnswers({});
    setUnansweredIds([]);
    setProfile({
      name: "",
      email: "",
      employment_type: "",
      department: "",
      tenure: "",
      position: ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function onProfileSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nextProfile = {
      name: String(form.get("name") || "").trim(),
      email: String(form.get("email") || "").trim(),
      employment_type: String(form.get("employment_type") || ""),
      department: String(form.get("department") || "").trim(),
      tenure: String(form.get("tenure") || ""),
      position: String(form.get("position") || "").trim()
    };
    const nextErrors: Record<string, string> = {};
    if (!nextProfile.name) nextErrors.name = "氏名を入力してください";
    if (!nextProfile.email) nextErrors.email = "メールアドレスを入力してください";
    if (!nextProfile.employment_type) nextErrors.employment_type = "雇用形態を選択してください";
    if (!nextProfile.tenure) nextErrors.tenure = "入社年数を選択してください";

    setProfileErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setProfile({
      ...nextProfile
    });
    setStep("questions");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateAnswer(questionId: number, value: number) {
    setAnswers((current) => ({ ...current, [questionId]: value }));
    setUnansweredIds((current) => current.filter((id) => id !== questionId));
    setError("");
  }

  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / questions.length) * 100);

  if (step === "guide") {
    return (
      <section className="panel narrow sample-offset">
        {isSample ? <div className="sample-ribbon">サンプル画面｜回答内容は保存されません</div> : null}
        <span className="badge">受検案内</span>
        {isSample ? (
          <>
            <h2>パートナー向け診断サンプル</h2>
            <p className="muted">
              このページでは、リーダーズGAP診断の実際の受検画面と回答体験をご確認いただけます。
            </p>
            <p className="muted">本番と同じ全48問を掲載しています。</p>
            <p className="muted">
              これは説明用のサンプル画面です。入力内容や回答内容は保存されません。
              管理画面への反映、メール送信、結果集計は行われません。
            </p>
            <div className="nav">
              <button type="button" onClick={() => setStep("profile")}>サンプル受検を開始する</button>
              <Link className="button secondary" href="/sample/report">フィードバックサンプルを見る</Link>
              <Link className="button secondary" href="/sample">紹介ページへ戻る</Link>
            </div>
          </>
        ) : (
          <>
            <h2>リーダーズGAP診断を開始する前に</h2>
            <p className="muted">
              この診断は、経営層と事業責任者・部長クラスの間にある認識差を可視化し、
              権限移譲や幹部育成の論点を整理するためのものです。
            </p>
            <div className="grid two">
              <div>
                <strong>所要時間</strong>
                <p className="muted">約10〜15分</p>
              </div>
              <div>
                <strong>回答期限</strong>
                <p className="muted">{invitation?.expires_at ? new Date(invitation.expires_at).toLocaleString("ja-JP") : "指定なし"}</p>
              </div>
            </div>
            <ul className="muted">
              <li>個人評価を目的とした診断ではありません。</li>
              <li>結果は原則として個人別ではなく、回答者グループの平均値として集計します。</li>
              <li>全48問に、1〜5点で回答します。</li>
              <li>回答完了後は、原則として再回答できません。</li>
              <li>診断結果は本人画面には表示されず、管理者側で集計後にフィードバックされます。</li>
            </ul>
            <button type="button" onClick={() => setStep("profile")}>診断を開始する</button>
          </>
        )}
      </section>
    );
  }

  if (step === "profile") {
    return (
      <form className="form panel narrow" onSubmit={onProfileSubmit} noValidate>
        {isSample ? <div className="sample-ribbon">サンプル画面｜回答内容は保存されません</div> : null}
        <span className="badge">回答者情報</span>
        <h2>回答者情報の確認・入力</h2>
        <p className="muted">回答内容の集計区分を確認するために使用します。受検者用のログインやパスワード入力は不要です。</p>
        <div className="grid two">
          <label>氏名<input name="name" defaultValue={profile.name} required />{profileErrors.name ? <span className="field-error">{profileErrors.name}</span> : null}</label>
          <label>メールアドレス<input name="email" type="email" defaultValue={profile.email} required />{profileErrors.email ? <span className="field-error">{profileErrors.email}</span> : null}</label>
          <label>雇用形態
            <select name="employment_type" defaultValue={profile.employment_type} required>
              <option value="">選択してください</option>
              {employmentTypes.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            {profileErrors.employment_type ? <span className="field-error">{profileErrors.employment_type}</span> : null}
          </label>
          <label>所属<input name="department" defaultValue={profile.department} /></label>
          <label>入社年数
            <select name="tenure" defaultValue={profile.tenure} required>
              <option value="">選択してください</option>
              {tenureOptions.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            {profileErrors.tenure ? <span className="field-error">{profileErrors.tenure}</span> : null}
          </label>
          <label>役職<input name="position" defaultValue={profile.position} /></label>
        </div>
        <div className="nav">
          <button className="secondary" type="button" onClick={() => setStep("guide")}>戻る</button>
          <button type="submit">アセスメントへ進む</button>
        </div>
      </form>
    );
  }

  if (step === "sampleDone") {
    return (
      <section className="panel narrow sample-offset">
        <div className="sample-ribbon">サンプル画面｜回答内容は保存されません</div>
        <h2>サンプル受検は以上です。</h2>
        <p className="muted">
          本番では、同じ全48問への回答後、
          経営側と現場側の認識差をテーマ別・設問別に集計します。
        </p>
        <p className="muted">このサンプルで入力・回答した内容は保存されていません。</p>
        <div className="nav">
          <button type="button" onClick={resetSample}>最初から確認する</button>
          <Link className="button secondary" href="/sample/report">フィードバックサンプルを見る</Link>
          <Link className="button secondary" href="/sample">紹介ページへ戻る</Link>
        </div>
      </section>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      {isSample ? <div className="sample-ribbon">サンプル画面｜回答内容は保存されません</div> : null}
      {!isSample ? <input type="hidden" name="token" value={invitation?.token} /> : null}
      <input type="hidden" name="name" value={profile.name} />
      <input type="hidden" name="email" value={profile.email} />
      <input type="hidden" name="employment_type" value={profile.employment_type} />
      <input type="hidden" name="department" value={profile.department} />
      <input type="hidden" name="tenure" value={profile.tenure} />
      <input type="hidden" name="position" value={profile.position} />
      <div className="panel narrow">
        <span className="badge">48問回答</span>
        <h2>設問に回答してください</h2>
        <p><strong>{questions.length}問中 {answeredCount}問回答済み</strong></p>
        <div className="progress-wrap" aria-label="回答進捗">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <p className="muted">
          各設問について、現在の状態に最も近いものを1～5で選択してください。
          回答完了後、本人画面に結果は表示されません。
        </p>
        <div className="grid">
          <span>1：あてはまらない</span>
          <span>2：あまりあてはまらない</span>
          <span>3：どちらともいえない</span>
          <span>4：おおむねあてはまる</span>
          <span>5：あてはまる</span>
        </div>
      </div>

      {smallThemes.map((theme) => (
        <section className="panel" key={theme.key}>
          <h2>{theme.name}</h2>
          <p className="theme-description">{theme.description}</p>
          <p className="muted">未回答: {questions.filter((question) => question.smallThemeKey === theme.key && !answers[question.id]).length}問</p>
          {questions.filter((question) => question.smallThemeKey === theme.key).map((question) => (
            <div className={`question ${unansweredIds.includes(question.id) ? "unanswered" : ""}`} id={`question-${question.id}`} key={question.id}>
              <p><strong>{question.id}. {question.text}</strong></p>
              <div className="scale">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value}>
                    <input
                      checked={answers[question.id] === value}
                      required
                      type="radio"
                      name={`q_${question.id}`}
                      value={value}
                      onChange={() => updateAnswer(question.id, value)}
                    />
                    <strong>{value}</strong>
                    {scoreLabels[value] ? <span className="small-text">{scoreLabels[value]}</span> : null}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </section>
      ))}

      {error ? <p className="muted">{error}</p> : null}
      <div className="nav">
        <button className="secondary" type="button" onClick={() => setStep("profile")}>回答者情報へ戻る</button>
        <button type="submit" disabled={loading}>{loading ? "送信中..." : "回答を送信"}</button>
      </div>
    </form>
  );
}
