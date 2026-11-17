"use client";

import { useMemo, useState } from "react";

const CONSULTATION_SUBJECT = "試算の結果について相談したい";

function nonNegative(value: string) {
  if (value === "") return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function sanitize(value: string) {
  if (value === "") return "";
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "";
  return parsed < 0 ? "0" : value;
}

function money(value: number) {
  return Math.round(value).toLocaleString("ja-JP");
}

function decimal(value: number) {
  return value.toFixed(1);
}

export function ValueSimulation() {
  const [grossProfit, setGrossProfit] = useState("20000");
  const [employees, setEmployees] = useState("50");
  const [rework, setRework] = useState(2);
  const [confirmation, setConfirmation] = useState(2);
  const [vacancy, setVacancy] = useState(1);
  const [reduction, setReduction] = useState(2);

  const result = useMemo(() => {
    const gross = nonNegative(grossProfit);
    const people = nonNegative(employees);
    const gapHours = rework + confirmation + vacancy;
    const gapRate = (gapHours / 40) * 100;
    const improvementPoints = gapRate * (reduction / 10);

    return {
      gross,
      people,
      gapHours,
      gapRate,
      improvementPoints,
      perPersonValue: people > 0 ? gross / people : 0,
      createdValue: gross * (improvementPoints / 100),
      peopleEquivalent: people * (improvementPoints / 100)
    };
  }, [confirmation, employees, grossProfit, reduction, rework, vacancy]);

  function moveToContact() {
    window.dispatchEvent(new CustomEvent("lgap:select-contact-subject", { detail: CONSULTATION_SUBJECT }));
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="lgap-simulation-grid">
      <div className="lgap-simulation-inputs">
        <section className="lgap-simulation-card">
          <div className="lgap-simulation-step"><span>1</span><h3>貴社の現在</h3></div>
          <label className="lgap-simulation-number"><span>年間の粗利（売上総利益）</span><span><input type="number" min="0" step="100" inputMode="decimal" value={grossProfit} onChange={(event) => setGrossProfit(sanitize(event.target.value))} /><b>万円</b></span></label>
          <label className="lgap-simulation-number"><span>社員数</span><span><input type="number" min="0" step="1" inputMode="numeric" value={employees} onChange={(event) => setEmployees(sanitize(event.target.value))} /><b>名</b></span></label>
          <div className="lgap-per-person-value">1人あたり付加価値（粗利 ÷ 社員数）<strong>{money(result.perPersonValue)}万円</strong></div>
        </section>

        <section className="lgap-simulation-card">
          <div className="lgap-simulation-step"><span>2</span><h3>社員1人あたり、週に何時間を「ずれ」に使っているか</h3></div>
          <p className="lgap-simulation-help">感覚で結構です。週40時間として、働く時間に占める割合に換算します。</p>
          <GapSlider label="手戻り・やり直し" help="指示と成果物が合わず、作り直している時間" value={rework} onChange={setRework} />
          <GapSlider label="認識違いによる確認の往復" help="「そういう意味じゃない」の確認や、行き違いの調整にかかる時間" value={confirmation} onChange={setConfirmation} />
          <GapSlider label="離職・欠員による穴埋め" help="辞めた人の仕事の肩代わりや、新しい人が立ち上がるまでの時間" value={vacancy} onChange={setVacancy} />
          <div className="lgap-gap-total">合計：働く時間の <strong>{decimal(result.gapRate)}%</strong>（週{decimal(result.gapHours)}時間）が「ずれ」に使われている</div>
        </section>
      </div>

      <div className="lgap-simulation-output">
        <section className="lgap-simulation-card">
          <div className="lgap-simulation-step"><span>3</span><h3>その「ずれ」を何割減らせたら？</h3></div>
          <div className="lgap-reduction-value"><strong>{reduction}</strong><span>割</span></div>
          <input className="lgap-range" type="range" min="0" max="10" step="1" value={reduction} onChange={(event) => setReduction(Number(event.target.value))} aria-label="ずれを減らす割合" />
          <div className="lgap-range-scale"><span>0割</span><span>5割</span><span>10割</span></div>
          <p className="lgap-improvement-points">→ 働く時間の <strong>{decimal(result.improvementPoints)}ポイント</strong> が、価値を生む仕事に戻る</p>
        </section>

        <article className="lgap-created-value" aria-live="polite"><span>創出できる付加価値（年間の粗利）</span><strong>＋{money(result.createdValue)}<small>万円</small></strong><p>年間粗利 {money(result.gross)}万円 × {decimal(result.improvementPoints)}%</p></article>
        <article className="lgap-people-equivalent"><span>人に置き換えると</span><strong>{decimal(result.peopleEquivalent)}<small>人分の働きが生まれる</small></strong><p>採用せずに、いまのメンバーで生み出せる分です</p></article>

        <div className="lgap-simulation-cta"><p>リーダーズGAPは、この「ずれ」がどこで起きているかを診断で数字にし、組織のルールとして減らしていくプログラムです。</p><button type="button" className="lgap-btn-primary" onClick={moveToContact}>この試算をもとに相談する</button></div>
        <div className="lgap-simulation-notes"><p>※入力された数字と、3で選んだ減らし方の仮定にもとづく単純化した試算です（1人あたり付加価値が変わらず、戻った時間がそのまま粗利を生む仮定）。効果を保証するものではありません。</p><p>※初期値は入力例です。</p></div>
      </div>
    </div>
  );
}

function GapSlider({ label, help, value, onChange }: { label: string; help: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="lgap-gap-slider">
      <span className="lgap-gap-slider-head"><span><b>{label}</b><small>{help}</small></span><strong>週{decimal(value)}時間（{decimal((value / 40) * 100)}%）</strong></span>
      <input className="lgap-range" type="range" min="0" max="8" step="0.5" value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}
