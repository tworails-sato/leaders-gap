"use client";

import { useMemo, useState } from "react";

const COST_SUBJECT = "費用や導入について知りたい";

function toNonNegativeNumber(value: string) {
  if (value === "") return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function sanitizeInput(value: string) {
  if (value === "") return "";
  return String(Math.max(0, Number(value) || 0));
}

function formatManYen(value: number) {
  return Math.round(value).toLocaleString("ja-JP");
}

export function CostCalculator() {
  const [recruitingCost, setRecruitingCost] = useState("150");
  const [reworkHours, setReworkHours] = useState("3");
  const [hourlyCost, setHourlyCost] = useState("1");

  const result = useMemo(() => {
    const recruiting = toNonNegativeNumber(recruitingCost);
    const hours = toNonNegativeNumber(reworkHours);
    const hourly = toNonNegativeNumber(hourlyCost);

    return {
      recruiting,
      turnoverLoss: recruiting * 2,
      annualTimeLoss: hours * hourly * 52
    };
  }, [hourlyCost, recruitingCost, reworkHours]);

  function moveToContact() {
    window.dispatchEvent(new CustomEvent("lgap:select-contact-subject", { detail: COST_SUBJECT }));
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="lgap-cost-shell">
      <div className="lgap-cost-inputs">
        <label className="lgap-cost-field">
          <span>管理職1人あたりの採用単価</span>
          <span className="lgap-cost-control">
            <input type="number" min="0" step="1" inputMode="decimal" value={recruitingCost} onChange={(event) => setRecruitingCost(sanitizeInput(event.target.value))} />
            <b>万円</b>
          </span>
          <small>参考：人材紹介の場合は、年収の20〜30％程度が目安です</small>
        </label>
        <label className="lgap-cost-field">
          <span>経営者が手戻り・手直し・やり取りに使う時間</span>
          <span className="lgap-cost-control">
            <input type="number" min="0" step="0.5" inputMode="decimal" value={reworkHours} onChange={(event) => setReworkHours(sanitizeInput(event.target.value))} />
            <b>時間／週</b>
          </span>
          <small>管理職の仕事の確認や、やり直し、行き違いの調整にかかる時間</small>
        </label>
        <label className="lgap-cost-field">
          <span>経営者の時間単価</span>
          <span className="lgap-cost-control">
            <input type="number" min="0" step="0.1" inputMode="decimal" value={hourlyCost} onChange={(event) => setHourlyCost(sanitizeInput(event.target.value))} />
            <b>万円／時間</b>
          </span>
          <small>目安：役員報酬 ÷ 年間の労働時間</small>
        </label>
      </div>

      <div className="lgap-cost-results" aria-live="polite">
        <article className="lgap-cost-result">
          <span>管理職1人が1年以内に辞めた場合の損失</span>
          <strong>{formatManYen(result.turnoverLoss)}<small>万円</small></strong>
          <p>無駄になった採用費{formatManYen(result.recruiting)}万円＋もう一度採用する費用{formatManYen(result.recruiting)}万円</p>
        </article>
        <article className="lgap-cost-result lgap-cost-result-time">
          <span>経営者が手戻り・手直し・やり取りに使っている時間の損失</span>
          <strong><small>年間</small>{formatManYen(result.annualTimeLoss)}<small>万円</small></strong>
          <p>毎週の手戻り時間 × 経営者の時間単価 × 52週</p>
        </article>
      </div>

      <div className="lgap-cost-message">
        <p>リーダーズGAPは、この損失を生む「任せたつもり」「任されたつもり」のずれを、診断で数字にして埋めていくプログラムです。</p>
        <button type="button" className="lgap-btn-primary" onClick={moveToContact}>この試算をもとに相談する</button>
      </div>
      <div className="lgap-cost-notes">
        <p>入力された数字にもとづく試算です。効果を保証するものではありません。</p>
        <p>手数料率の相場は目安です。実際の契約条件をご入力ください。</p>
      </div>
    </div>
  );
}
