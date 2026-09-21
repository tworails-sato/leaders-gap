"use client";

import Link from "next/link";
import { CheckCircle2, ChevronRight, Clock3, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { RadarComparisonChart } from "@/components/RadarComparisonChart";
import { questions, smallThemes } from "@/lib/questions";
import { judgeGap, round, scoreAnswers } from "@/lib/scoring";
import { sampleFeedback } from "@/lib/sample-report";

type Profile = {
  name: string;
  employment_type: string;
  department: string;
  tenure: string;
  position: string;
};

type Participant = {
  id: number;
  profile: Profile;
  profileComplete: boolean;
  answers: Record<number, number>;
  completed: boolean;
};

type Step = "guide" | "profiles" | "questions" | "handoff" | "sampleDone" | "report";

const emptyProfile = (): Profile => ({
  name: "",
  employment_type: "",
  department: "",
  tenure: "",
  position: ""
});

const createParticipant = (id: number): Participant => ({
  id,
  profile: emptyProfile(),
  profileComplete: false,
  answers: {},
  completed: false
});

const employmentTypes = ["正社員", "アルバイト", "契約社員", "業務委託", "インターン", "その他"];
const tenureOptions = ["1年以内", "1～4年", "5～10年", "10年以上"];
const scoreLabels: Record<number, string> = { 1: "あてはまらない", 2: "", 3: "", 4: "", 5: "あてはまる" };

export function SampleAssessmentFlow() {
  const [step, setStep] = useState<Step>("guide");
  const [participants, setParticipants] = useState<Participant[]>([createParticipant(1)]);
  const [activeId, setActiveId] = useState(1);
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [unansweredIds, setUnansweredIds] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [handoffTargetId, setHandoffTargetId] = useState<number | null>(null);

  const activeParticipant = participants.find((participant) => participant.id === activeId) ?? participants[0];
  const completedCount = participants.filter((participant) => participant.completed).length;
  const registeredCount = participants.filter((participant) => participant.profileComplete).length;

  function updateActiveParticipant(update: (participant: Participant) => Participant) {
    setParticipants((current) => current.map((participant) => participant.id === activeId ? update(participant) : participant));
  }

  function selectParticipant(id: number) {
    const participant = participants.find((item) => item.id === id);
    if (!participant) return;
    setActiveId(id);
    setProfileErrors({});
    setUnansweredIds([]);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function addParticipant() {
    if (participants.length >= 2) {
      setError("デモでは3名以上のご利用はできません。");
      return;
    }
    const nextId = 2;
    setParticipants((current) => [...current, createParticipant(nextId)]);
    setActiveId(nextId);
    setProfileErrors({});
    setError("");
  }

  function updateProfile(field: keyof Profile, value: string) {
    updateActiveParticipant((participant) => ({
      ...participant,
      profile: { ...participant.profile, [field]: value },
      profileComplete: false
    }));
    setProfileErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const profile = activeParticipant.profile;
    const nextErrors: Record<string, string> = {};
    if (!profile.name.trim()) nextErrors.name = "氏名を入力してください";
    setProfileErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    updateActiveParticipant((participant) => ({
      ...participant,
      profile: {
        ...participant.profile,
        name: participant.profile.name.trim(),
        department: participant.profile.department.trim(),
        position: participant.profile.position.trim()
      },
      profileComplete: true
    }));
    setError("");
  }

  function beginQuestions() {
    const registeredParticipants = participants.filter((participant) => participant.profileComplete);
    if (registeredParticipants.length === 0) {
      setError("氏名を入力し、回答者を登録してください。");
      return;
    }
    const firstIncomplete = registeredParticipants.find((participant) => !participant.completed);
    if (!firstIncomplete) return;
    setParticipants(registeredParticipants);
    setActiveId(firstIncomplete.id);
    setStep("questions");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateAnswer(questionId: number, value: number) {
    updateActiveParticipant((participant) => ({
      ...participant,
      answers: { ...participant.answers, [questionId]: value }
    }));
    setUnansweredIds((current) => current.filter((id) => id !== questionId));
    setError("");
  }

  function submitAnswers(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const missing = questions.filter((question) => !activeParticipant.answers[question.id]).map((question) => question.id);
    if (missing.length > 0) {
      setUnansweredIds(missing);
      setError(`未回答の設問が${missing.length}問あります。すべての設問に回答してください。`);
      window.setTimeout(() => document.getElementById(`question-${missing[0]}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
      return;
    }

    const updated = participants.map((participant) => participant.id === activeId ? { ...participant, completed: true } : participant);
    setParticipants(updated);
    setError("");
    setUnansweredIds([]);
    const nextParticipant = updated.find((participant) => !participant.completed);

    if (nextParticipant) {
      setHandoffTargetId(nextParticipant.id);
      setStep("handoff");
    } else if (updated.length === 2) {
      setStep("report");
    } else {
      setStep("sampleDone");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function continueAfterHandoff() {
    if (handoffTargetId === null) return;
    setActiveId(handoffTargetId);
    setHandoffTargetId(null);
    setStep("questions");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetSample() {
    setStep("guide");
    setParticipants([createParticipant(1)]);
    setActiveId(1);
    setProfileErrors({});
    setUnansweredIds([]);
    setError("");
    setHandoffTargetId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (step === "guide") {
    return (
      <section className="panel narrow sample-offset">
        <SampleRibbon />
        <span className="badge">受検案内</span>
        <h2>パートナー向け診断サンプル</h2>
        <p className="muted">本番と同じ全48問を、1名または2名で体験できます。</p>
        <p className="muted">
          2名で受検する場合は、同じ端末を順番に使って回答し、完了後に8テーマごとの回答差を確認できます。
          入力内容や回答内容はブラウザ内の一時状態だけで扱い、保存・メール送信・管理画面への反映は行いません。
        </p>
        <div className="nav">
          <button type="button" onClick={() => setStep("profiles")}>サンプル受検を開始する</button>
          <Link className="button secondary" href="/sample/report">固定のフィードバックサンプルを見る</Link>
          <Link className="button secondary" href="/sample">紹介ページへ戻る</Link>
        </div>
      </section>
    );
  }

  if (step === "profiles") {
    return (
      <section className="sample-offset">
        <SampleRibbon />
        <div className="panel narrow sample-profile-card">
          <div className="sample-profile-heading">
            <div>
              <span className="badge">STEP 1｜回答者情報</span>
              <h2>回答者を登録してください</h2>
              <p className="muted">氏名だけで登録できます。詳しい情報は任意で入力してください。</p>
            </div>
            <div className="sample-profile-count"><strong>{registeredCount}</strong><span>名登録済み</span></div>
          </div>
          <div className="sample-profile-guide">
            <span><strong>1名で体験</strong> 個人の回答傾向を確認</span>
            <span><strong>2名で体験</strong> 2人の認識差を比較</span>
          </div>
          <ParticipantTabs participants={participants} activeId={activeId} onSelect={selectParticipant} />
          <form className="form sample-profile-form" onSubmit={saveProfile} noValidate>
            <div className="grid two">
              <ProfileField label="氏名" error={profileErrors.name} required>
                <input value={activeParticipant.profile.name} onChange={(event) => updateProfile("name", event.target.value)} required />
              </ProfileField>
              <ProfileField label="雇用形態">
                <select value={activeParticipant.profile.employment_type} onChange={(event) => updateProfile("employment_type", event.target.value)}>
                  <option value="">選択してください（任意）</option>
                  {employmentTypes.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </ProfileField>
              <ProfileField label="所属">
                <input value={activeParticipant.profile.department} onChange={(event) => updateProfile("department", event.target.value)} />
              </ProfileField>
              <ProfileField label="入社年数">
                <select value={activeParticipant.profile.tenure} onChange={(event) => updateProfile("tenure", event.target.value)}>
                  <option value="">選択してください（任意）</option>
                  {tenureOptions.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </ProfileField>
              <ProfileField label="役職">
                <input value={activeParticipant.profile.position} onChange={(event) => updateProfile("position", event.target.value)} />
              </ProfileField>
            </div>
            <div className="nav sample-profile-actions">
              <button className="sample-register-button" type="submit">{activeParticipant.profileComplete ? "回答者情報を更新する" : "この回答者を登録する"}</button>
              <button className="secondary" type="button" onClick={addParticipant}>回答者を追加する</button>
            </div>
          </form>
          {error ? <p className="inline-error" role="alert">{error}</p> : null}
          <div className="sample-profile-footer">
            <button className="secondary" type="button" onClick={() => setStep("guide")}>戻る</button>
            {registeredCount > 0 ? (
              <button className="sample-start-assessment" type="button" onClick={beginQuestions}>登録済み{registeredCount}名でアセスメントへ進む</button>
            ) : (
              <p className="sample-registration-hint">氏名を入力して「この回答者を登録する」を押してください。</p>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (step === "handoff") {
    const nextParticipant = participants.find((participant) => participant.id === handoffTargetId);
    return (
      <section className="panel narrow sample-offset handoff-panel">
        <SampleRibbon />
        <span className="badge">回答完了</span>
        <h2>{activeParticipant.profile.name}さんの回答が完了しました</h2>
        <p className="muted">回答内容はこの端末内だけに一時保持されています。次の回答者へ画面をお渡しください。</p>
        <div className="handoff-next">
          <span>次の回答者</span>
          <strong>{nextParticipant?.profile.name || `回答者${handoffTargetId}`}</strong>
        </div>
        <button type="button" onClick={continueAfterHandoff}>次の回答を開始する</button>
      </section>
    );
  }

  if (step === "sampleDone") {
    return (
      <section className="panel narrow sample-offset">
        <SampleRibbon />
        <h2>サンプル受検は以上です。</h2>
        <p className="muted">1名での回答が完了しました。2名の比較を確認する場合は、最初からやり直して回答者を2名登録してください。</p>
        <p className="muted">このサンプルで入力・回答した内容は保存されていません。</p>
        <div className="nav">
          <button type="button" onClick={resetSample}>最初から確認する</button>
          <Link className="button secondary" href="/sample/report">固定のフィードバックサンプルを見る</Link>
          <Link className="button secondary" href="/sample">紹介ページへ戻る</Link>
        </div>
      </section>
    );
  }

  if (step === "report") {
    return <LiveComparisonReport participants={participants} onReset={resetSample} />;
  }

  const answeredCount = Object.keys(activeParticipant.answers).length;
  const progress = Math.round((answeredCount / questions.length) * 100);
  const remainingCount = questions.length - answeredCount;
  const submitLabel = activeParticipant.completed
    ? "回答内容を更新する"
    : participants.length === 2 && completedCount === 1
      ? "2名分を集計する"
      : `${activeParticipant.profile.name}さんの回答を完了する`;

  return (
    <form className="form sample-offset sample-assessment-form" onSubmit={submitAnswers} noValidate>
      <SampleRibbon />
      <div className="assessment-intro">
        <div>
          <span className="badge">LEADERS GAP ASSESSMENT</span>
          <h2>{activeParticipant.profile.name}さんのアセスメント</h2>
          <p>現在の状態に最も近いものを、直感的に1～5で選択してください。</p>
        </div>
        <div className="assessment-scale-guide" aria-label="回答基準">
          <span><strong>1</strong> あてはまらない</span>
          <span><strong>3</strong> どちらともいえない</span>
          <span><strong>5</strong> あてはまる</span>
        </div>
      </div>

      <div className="assessment-sticky-controls">
        <div className="assessment-control-heading">
          <span><Users size={17} aria-hidden="true" />{participants.length > 1 ? "回答者を切り替える" : `${activeParticipant.profile.name}さんの進捗`}</span>
          <strong>{progress}%</strong>
        </div>
        {participants.length > 1 ? <ParticipantTabs participants={participants} activeId={activeId} onSelect={selectParticipant} compact /> : null}
        <div className="assessment-progress-meta">
          <span><CheckCircle2 size={16} aria-hidden="true" />{questions.length}問中 {answeredCount}問回答済み</span>
          <span><Clock3 size={16} aria-hidden="true" />残り {remainingCount}問</span>
        </div>
        <div className="progress-wrap" aria-label={`回答進捗 ${progress}%`}><div className="progress-bar" style={{ width: `${progress}%` }} /></div>
      </div>

      {smallThemes.map((theme, themeIndex) => {
        const themeQuestions = questions.filter((question) => question.smallThemeKey === theme.key);
        const themeRemaining = themeQuestions.filter((question) => !activeParticipant.answers[question.id]).length;
        return (
        <section className="assessment-theme-card" key={theme.key}>
          <div className="assessment-theme-heading">
            <div className="assessment-theme-number">{String(themeIndex + 1).padStart(2, "0")}</div>
            <div>
              <span>テーマ {themeIndex + 1} / {smallThemes.length}</span>
              <h2>{theme.name}</h2>
            </div>
            <strong className={themeRemaining === 0 ? "complete" : ""}>{themeRemaining === 0 ? "回答済み" : `未回答 ${themeRemaining}問`}</strong>
          </div>
          <p className="theme-description">{theme.description}</p>
          <div className="assessment-question-list">
          {themeQuestions.map((question) => (
            <div className={`question assessment-question ${unansweredIds.includes(question.id) ? "unanswered" : ""}`} id={`question-${question.id}`} key={question.id}>
              <div className="assessment-question-copy"><span>Q{question.id}</span><p>{question.text}</p></div>
              <div className="scale">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value}>
                    <input checked={activeParticipant.answers[question.id] === value} required type="radio" name={`q_${question.id}`} value={value} onChange={() => updateAnswer(question.id, value)} />
                    <strong>{value}</strong>
                    {scoreLabels[value] ? <span className="small-text">{scoreLabels[value]}</span> : null}
                  </label>
                ))}
              </div>
            </div>
          ))}
          </div>
        </section>
      );})}

      <div className="assessment-submit-dock">
        <div>
          {error ? <p className="assessment-dock-error" role="alert">{error}</p> : <p><strong>{remainingCount === 0 ? "すべて回答済みです" : `残り${remainingCount}問です`}</strong><span>{remainingCount === 0 ? "回答内容を確認して完了してください。" : "未回答の設問を選択してください。"}</span></p>}
        </div>
        <div className="nav">
          {completedCount === 0 ? <button className="secondary" type="button" onClick={() => setStep("profiles")}>回答者情報へ戻る</button> : null}
          <button type="submit">{submitLabel}<ChevronRight size={18} aria-hidden="true" /></button>
        </div>
      </div>
    </form>
  );
}

function SampleRibbon() {
  return <div className="sample-ribbon">サンプル画面｜回答内容は保存されません</div>;
}

function ProfileField({ label, error, children, required = false }: { label: string; error?: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label>
      <span className="sample-profile-label"><span>{label}</span><em className={required ? "required" : "optional"}>{required ? "必須" : "任意"}</em></span>
      {children}
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}

function ParticipantTabs({ participants, activeId, onSelect, compact = false }: { participants: Participant[]; activeId: number; onSelect: (id: number) => void; compact?: boolean }) {
  return (
    <div className={`participant-tabs ${compact ? "compact" : ""}`} role="tablist" aria-label="回答者切り替え">
      {participants.map((participant, index) => (
        <button
          aria-selected={participant.id === activeId}
          className={participant.id === activeId ? "active" : ""}
          key={participant.id}
          onClick={() => onSelect(participant.id)}
          role="tab"
          type="button"
        >
          <span>回答者{index + 1}</span>
          <strong>{participant.profile.name || "未登録"}</strong>
          <small>{participant.completed ? "回答済み" : participant.profileComplete ? "登録済み" : "入力中"}</small>
        </button>
      ))}
    </div>
  );
}

function LiveComparisonReport({ participants, onReset }: { participants: Participant[]; onReset: () => void }) {
  const first = participants[0];
  const second = participants[1];
  const firstLabel = first.profile.name || "回答者1";
  const secondLabel = second.profile.name || "回答者2";
  const rows = useMemo(() => {
    const firstScores = scoreAnswers(first.answers).small;
    const secondScores = scoreAnswers(second.answers).small;
    return smallThemes.map((theme) => {
      const executiveScore = firstScores[theme.key] ?? 0;
      const fieldScore = secondScores[theme.key] ?? 0;
      const gap = round(executiveScore - fieldScore) ?? 0;
      const absoluteGap = round(Math.abs(gap)) ?? 0;
      return { key: theme.key, theme: theme.name, executiveScore, fieldScore, gap, absoluteGap, judgment: judgeGap(absoluteGap) };
    });
  }, [first.answers, second.answers]);
  const topGaps = [...rows].sort((a, b) => b.absoluteGap - a.absoluteGap).slice(0, 3);
  const lowGaps = [...rows].sort((a, b) => a.absoluteGap - b.absoluteGap).slice(0, 3);
  const topNames = topGaps.map((row) => `「${row.theme}」`).join("、");
  const lowNames = lowGaps.map((row) => `「${row.theme}」`).join("、");

  return (
    <section className="sample-live-report sample-offset">
      <SampleRibbon />
      <div className="panel">
        <span className="badge">2名比較デモ結果</span>
        <h1>リーダーズGAP診断 比較レポート</h1>
        <p className="muted">2名の実際の回答からブラウザ内で集計した結果です。回答・結果は保存されず、ページを離れると消去されます。</p>
        <div className="grid two">
          <div><strong>回答者1</strong><p>{firstLabel}</p></div>
          <div><strong>回答者2</strong><p>{secondLabel}</p></div>
        </div>
      </div>

      <div className="panel">
        <h2>2名の回答比較レーダーチャート</h2>
        <RadarComparisonChart data={rows} executiveLabel={firstLabel} fieldLabel={secondLabel} />
      </div>

      <div className="panel table-wrap">
        <h2>8テーマ別比較表</h2>
        <table>
          <thead><tr><th>テーマ</th><th>{firstLabel}</th><th>{secondLabel}</th><th>GAP</th><th>判定</th></tr></thead>
          <tbody>{rows.map((row) => <tr key={row.key}><td>{row.theme}</td><td>{row.executiveScore.toFixed(2)}</td><td>{row.fieldScore.toFixed(2)}</td><td>{row.gap.toFixed(2)}</td><td>{row.judgment}</td></tr>)}</tbody>
        </table>
      </div>

      <div className="grid two">
        <ComparisonList title="最大GAP上位3" rows={topGaps} />
        <ComparisonList title="GAPが小さいテーマ" rows={lowGaps} />
      </div>

      <ReportText title="診断サマリー" text={`${firstLabel}さんと${secondLabel}さんの回答を比較した結果、特に${topNames}で回答差が見られました。数値の差を結論とせず、設問ごとの認識や前提を対話で確認するための材料としてご活用ください。`} />
      <ReportText title="GAPが少ないテーマ" text={`${lowNames}は、2名の回答差が比較的小さいテーマです。共通認識が形成されている点として、今後の対話や施策設計の土台になる可能性があります。`} />
      <ReportText title="GAPが発生している要因" text="回答差の背景には、役割、判断基準、共有されている情報、日常業務での経験の違いがある可能性があります。数値だけで判断せず、差が生まれた具体的な場面を相互に確認することが重要です。" />

      <div className="grid two">
        <ScoreSummary title={`${firstLabel}さんの認識`} rows={rows} scoreKey="executiveScore" />
        <ScoreSummary title={`${secondLabel}さんの認識`} rows={rows} scoreKey="fieldScore" />
        <BulletList title="短期施策" items={sampleFeedback.shortTerm} />
        <BulletList title="中期施策" items={sampleFeedback.midTerm} />
      </div>
      <div className="nav">
        <button type="button" onClick={onReset}>最初から確認する</button>
        <Link className="button secondary" href="/sample/report">固定のフィードバックサンプルを見る</Link>
        <Link className="button secondary" href="/sample">紹介ページへ戻る</Link>
      </div>
    </section>
  );
}

type ComparisonRow = {
  key: string;
  theme: string;
  executiveScore: number;
  fieldScore: number;
  gap: number;
  absoluteGap: number;
  judgment: string;
};

function ComparisonList({ title, rows }: { title: string; rows: ComparisonRow[] }) {
  return <div className="panel table-wrap"><h2>{title}</h2><table><thead><tr><th>テーマ</th><th>GAP</th><th>判定</th></tr></thead><tbody>{rows.map((row) => <tr key={row.key}><td>{row.theme}</td><td>{row.gap.toFixed(2)}</td><td>{row.judgment}</td></tr>)}</tbody></table></div>;
}

function ReportText({ title, text }: { title: string; text: string }) {
  return <section className="panel"><h2>{title}</h2><p className="muted">{text}</p></section>;
}

function ScoreSummary({ title, rows, scoreKey }: { title: string; rows: ComparisonRow[]; scoreKey: "executiveScore" | "fieldScore" }) {
  const ordered = [...rows].sort((a, b) => b[scoreKey] - a[scoreKey]).slice(0, 4);
  return <section className="panel"><h2>{title}</h2><ul className="muted">{ordered.map((row) => <li key={row.key}>{row.theme}：{row[scoreKey].toFixed(2)}</li>)}</ul></section>;
}

function BulletList({ title, items }: { title: string; items: string[] }) {
  return <section className="panel"><h2>{title}</h2><ul className="muted">{items.map((item) => <li key={item}>{item}</li>)}</ul></section>;
}
