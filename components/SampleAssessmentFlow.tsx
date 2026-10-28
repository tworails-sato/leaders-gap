"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle2, ChevronRight, Clock3, ShieldCheck, UserRound, Users, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";
import { RadarComparisonChart } from "@/components/RadarComparisonChart";
import { sampleQuestions, smallThemes } from "@/lib/questions";
import { judgeGap, round, scoreAnswers } from "@/lib/scoring";
import { sampleFeedback } from "@/lib/sample-report";

type Participant = {
  id: number;
  answers: Record<number, number>;
  completed: boolean;
};

type Step = "guide" | "questions" | "handoff" | "report";

const createParticipant = (id: number): Participant => ({
  id,
  answers: {},
  completed: false
});

const scoreLabels: Record<number, string> = { 1: "あてはまらない", 2: "", 3: "", 4: "", 5: "あてはまる" };
const privacyPolicyUrl = process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL || "https://www.t-rails.com/";

export function SampleAssessmentFlow() {
  const [step, setStep] = useState<Step>("guide");
  const [participantCount, setParticipantCount] = useState<1 | 2>(1);
  const [participants, setParticipants] = useState<Participant[]>([createParticipant(1)]);
  const [activeId, setActiveId] = useState(1);
  const [unansweredIds, setUnansweredIds] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [handoffTargetId, setHandoffTargetId] = useState<number | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const activeParticipant = participants.find((participant) => participant.id === activeId) ?? participants[0];
  const completedCount = participants.filter((participant) => participant.completed).length;

  function updateActiveParticipant(update: (participant: Participant) => Participant) {
    setParticipants((current) => current.map((participant) => participant.id === activeId ? update(participant) : participant));
  }

  function selectParticipant(id: number) {
    const participant = participants.find((item) => item.id === id);
    if (!participant) return;
    setActiveId(id);
    setUnansweredIds([]);
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
    const missing = sampleQuestions.filter((question) => !activeParticipant.answers[question.id]).map((question) => question.id);
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
    } else {
      setStep("report");
      void notifySampleCompletion(updated.length);
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
    setParticipantCount(1);
    setParticipants([createParticipant(1)]);
    setActiveId(1);
    setUnansweredIds([]);
    setError("");
    setHandoffTargetId(null);
    setAgreedToTerms(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startSample() {
    if (!agreedToTerms) {
      setError("利用条件への同意が必要です。");
      return;
    }
    setError("");
    const nextParticipants = Array.from({ length: participantCount }, (_, index) => createParticipant(index + 1));
    setParticipants(nextParticipants);
    setActiveId(1);
    setStep("questions");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (step === "guide") {
    return (
      <section className="sample-guide sample-offset">
        <SampleRibbon />
        <div className="sample-guide-copy">
          <span className="sample-kicker">LEADERS GAP DEMO</span>
          <h2>組織の認識差を、<br />5分で見える形に。</h2>
          <p>8テーマ・全24問のデモ診断です。1名なら基準値との比較、2名なら同じ端末を順番に使って回答差を確認できます。</p>
          <div className="sample-guide-metrics" aria-label="デモ診断の概要">
            <div><strong>8</strong><span>テーマ</span></div>
            <div><strong>24</strong><span>設問</span></div>
            <div><strong>5</strong><span>分</span></div>
          </div>
          <div className="sample-guide-features">
            <span><CheckCircle2 size={18} />所要時間は約5分</span>
            <span><BarChart3 size={18} />回答後すぐに可視化</span>
            <span><ShieldCheck size={18} />入力・回答は保存されません</span>
          </div>
        </div>
        <div className="sample-start-card">
          <span className="badge">STEP 01 ・ 受検人数</span>
          <h3>何名で試しますか？</h3>
          <p className="muted">1名でも診断結果を確認できます。</p>
          <p className="sample-count-limit"><UsersRound size={17} aria-hidden="true" />デモは2名まで体験できます</p>
          <div className="sample-count-selector" role="radiogroup" aria-label="受検人数">
            <button className={participantCount === 1 ? "active" : ""} onClick={() => setParticipantCount(1)} role="radio" aria-checked={participantCount === 1} type="button"><UserRound size={24} /><strong>1名で体験</strong><span>基準値と比較</span></button>
            <button className={participantCount === 2 ? "active" : ""} onClick={() => setParticipantCount(2)} role="radio" aria-checked={participantCount === 2} type="button"><UsersRound size={24} /><strong>2名で体験</strong><span>回答差を比較</span></button>
          </div>
          <div className="sample-terms-box">
            <h3>ご利用条件</h3>
            <ul>
              <li>設問や回答内容のコピー、複製、別サービスへの転用を禁止します。</li>
              <li>当社の許可なく、営業活動や広報活動へ利用することを禁止します。</li>
              <li>本診断の著作権は<a href="https://www.t-rails.com/" target="_blank" rel="noreferrer">合同会社Two rails</a>に帰属します。</li>
            </ul>
            <label className="sample-terms-consent">
              <input checked={agreedToTerms} onChange={(event) => { setAgreedToTerms(event.target.checked); if (event.target.checked) setError(""); }} type="checkbox" />
              <span>利用条件と<a href={privacyPolicyUrl} target="_blank" rel="noreferrer">プライバシーポリシー</a>に同意する</span>
            </label>
          </div>
          {error ? <p className="inline-error" role="alert">{error}</p> : null}
          <button className="sample-primary-cta" type="button" onClick={startSample}>デモ診断を開始する<ArrowRight size={18} /></button>
          <Link className="sample-text-link" href="/sample/report">先にフィードバックサンプルを見る</Link>
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
        <h2>回答者{activeParticipant.id}の回答が完了しました</h2>
        <p className="muted">回答内容はこの端末内だけに一時保持されています。次の回答者へ画面をお渡しください。</p>
        <div className="handoff-next">
          <span>次の回答者</span>
          <strong>回答者{nextParticipant?.id || handoffTargetId}</strong>
        </div>
        <button type="button" onClick={continueAfterHandoff}>次の回答を開始する</button>
      </section>
    );
  }

  if (step === "report") {
    return <LiveComparisonReport participants={participants} onReset={resetSample} />;
  }

  const answeredCount = Object.keys(activeParticipant.answers).length;
  const progress = Math.round((answeredCount / sampleQuestions.length) * 100);
  const remainingCount = sampleQuestions.length - answeredCount;
  const submitLabel = activeParticipant.completed
    ? "回答内容を更新する"
    : participants.length === 2 && completedCount === 1
      ? "2名分を集計する"
      : "回答を完了して結果を見る";

  return (
    <form className="form sample-offset sample-assessment-form" onSubmit={submitAnswers} noValidate>
      <SampleRibbon />
      <div className="assessment-intro">
        <div>
          <span className="badge">LEADERS GAP ASSESSMENT</span>
          <h2>回答者{activeParticipant.id}のアセスメント</h2>
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
          <span><Users size={17} aria-hidden="true" />{participants.length > 1 ? "回答者を切り替える" : "回答者1の進捗"}</span>
          <strong>{progress}%</strong>
        </div>
        {participants.length > 1 ? <ParticipantTabs participants={participants} activeId={activeId} onSelect={selectParticipant} compact /> : null}
        <div className="assessment-progress-meta">
          <span><CheckCircle2 size={16} aria-hidden="true" />{sampleQuestions.length}問中 {answeredCount}問回答済み</span>
          <span><Clock3 size={16} aria-hidden="true" />残り {remainingCount}問</span>
        </div>
        <div className="progress-wrap" aria-label={`回答進捗 ${progress}%`}><div className="progress-bar" style={{ width: `${progress}%` }} /></div>
      </div>

      {smallThemes.map((theme, themeIndex) => {
        const themeQuestions = sampleQuestions.filter((question) => question.smallThemeKey === theme.key);
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
              <div className="assessment-question-copy"><span>Q{sampleQuestions.findIndex((item) => item.id === question.id) + 1}</span><p>{question.text}</p></div>
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
          <button type="submit">{submitLabel}<ChevronRight size={18} aria-hidden="true" /></button>
        </div>
      </div>
    </form>
  );
}

function SampleRibbon() {
  return <div className="sample-ribbon">デモ診断｜回答内容は保存されません</div>;
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
          <strong>回答者{participant.id}</strong>
          <small>{participant.completed ? "回答済み" : Object.keys(participant.answers).length > 0 ? "回答中" : "未回答"}</small>
        </button>
      ))}
    </div>
  );
}

function LiveComparisonReport({ participants, onReset }: { participants: Participant[]; onReset: () => void }) {
  const first = participants[0];
  const second = participants[1];
  const isSingle = !second;
  const firstLabel = isSingle ? "あなたの回答" : "回答者1";
  const secondLabel = isSingle ? "比較基準（2.00）" : "回答者2";
  const rows = useMemo(() => {
    const firstScores = scoreAnswers(first.answers).small;
    const secondScores = second ? scoreAnswers(second.answers).small : null;
    return smallThemes.map((theme) => {
      const executiveScore = firstScores[theme.key] ?? 0;
      const fieldScore = secondScores?.[theme.key] ?? 2;
      const gap = round(executiveScore - fieldScore) ?? 0;
      const absoluteGap = round(Math.abs(gap)) ?? 0;
      return { key: theme.key, theme: theme.name, executiveScore, fieldScore, gap, absoluteGap, judgment: judgeGap(absoluteGap) };
    });
  }, [first.answers, second]);
  const topGaps = [...rows].sort((a, b) => b.absoluteGap - a.absoluteGap).slice(0, 3);
  const lowGaps = [...rows].sort((a, b) => a.absoluteGap - b.absoluteGap).slice(0, 3);
  const topNames = topGaps.map((row) => `「${row.theme}」`).join("、");
  const lowNames = lowGaps.map((row) => `「${row.theme}」`).join("、");
  const summary = isSingle
    ? `回答傾向を基準スコア2.00と比較すると、特に${topNames}で差が見られました。これは優劣を示すものではなく、ご自身が組織の現状をどう捉えているかを整理するための参考値です。`
    : `2名の回答を比較した結果、特に${topNames}で認識差が見られました。数値の差を結論とせず、設問ごとの前提を対話で確認するための材料としてご活用ください。`;

  return (
    <section className="sample-live-report sample-report-page sample-offset">
      <SampleRibbon />
      <header className="sample-report-hero">
        <div><span className="sample-kicker">YOUR DEMO REPORT</span><h1>{isSingle ? "回答傾向レポート" : "2名比較レポート"}</h1><p>{isSingle ? "あなたの回答を8テーマで可視化しました。" : "2名の回答差を8テーマで可視化しました。"}</p></div>
        <div className="sample-report-score"><span>回答完了</span><strong>{participants.length}</strong><small>名</small></div>
      </header>

      <section className="sample-report-overview">
        <div className="sample-report-chart"><div className="sample-section-heading"><span>01</span><div><small>OVERVIEW</small><h2>8テーマの全体像</h2></div></div><RadarComparisonChart data={rows} executiveLabel={firstLabel} fieldLabel={secondLabel} />{isSingle ? <p className="sample-chart-note">比較基準は、デモ表示用に全テーマ2.00で設定しています。</p> : null}</div>
        <div className="sample-report-summary"><span className="badge">診断サマリー</span><h2>まず確認したい認識のポイント</h2><p>{summary}</p><div className="sample-top-gap-list">{topGaps.map((row, index) => <div key={row.key}><span>0{index + 1}</span><p>{row.theme}</p><strong>{row.gap > 0 ? "+" : ""}{row.gap.toFixed(2)}</strong></div>)}</div></div>
      </section>

      <section className="sample-report-section"><div className="sample-section-heading"><span>02</span><div><small>DETAIL</small><h2>8テーマ別スコア</h2></div></div><div className="sample-score-grid">{rows.map((row) => <article key={row.key}><h3>{row.theme}</h3><div><span>{firstLabel}</span><strong>{row.executiveScore.toFixed(2)}</strong></div><div><span>{secondLabel}</span><strong>{row.fieldScore.toFixed(2)}</strong></div><footer><span>GAP</span><b>{row.gap > 0 ? "+" : ""}{row.gap.toFixed(2)}</b></footer></article>)}</div></section>

      <div className="sample-report-insights">
        <ReportText title="GAPが小さいテーマ" text={`${lowNames}は回答差が比較的小さいテーマです。共有できている認識として、今後の対話や施策設計の土台になる可能性があります。`} />
        <ReportText title="GAPが発生する背景" text="回答差の背景には、役割、判断基準、共有情報、日常業務での経験の違いがある可能性があります。数値だけで判断せず、差が生まれた具体的な場面を確認することが重要です。" />
      </div>

      <section className="sample-report-section"><div className="sample-section-heading"><span>03</span><div><small>NEXT ACTION</small><h2>次の一歩の例</h2></div></div><div className="grid two"><BulletList title="短期施策" items={sampleFeedback.shortTerm} /><BulletList title="中期施策" items={sampleFeedback.midTerm} /></div></section>

      <section className="sample-report-cta"><small>LEADERS GAP CONSULTATION</small><h2>この結果を、組織の対話につなげませんか？</h2><p>実際の組織での活用方法や、結果の読み解きについてご案内します。</p><Link className="button" href="/sample#contact">結果について相談する<ArrowRight size={18} /></Link></section>
      <div className="nav sample-report-footer"><button className="secondary" type="button" onClick={onReset}>もう一度診断する</button><Link className="button secondary" href="/sample/report">フィードバックサンプルを見る</Link><Link className="button secondary" href="/sample">紹介ページへ戻る</Link></div>
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

function ReportText({ title, text }: { title: string; text: string }) {
  return <section className="sample-insight-card"><span>INSIGHT</span><h2>{title}</h2><p>{text}</p></section>;
}

function BulletList({ title, items }: { title: string; items: string[] }) {
  return <section className="sample-action-card"><h3>{title}</h3><ol>{items.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>)}</ol></section>;
}

async function notifySampleCompletion(participantCount: number) {
  try {
    await fetch("/api/sample/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participantCount })
    });
  } catch {
    // Notification failure must never interrupt the demo result.
  }
}
