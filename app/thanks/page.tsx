export default function ThanksPage() {
  return (
    <main className="shell narrow">
      <div className="panel">
        <span className="badge">回答済み</span>
        <h1>ご協力ありがとうございました。</h1>
        <p>回答は正常に送信されました。</p>
        <p className="muted">
          本アセスメントは、個人の特定や、回答内容によって
          評価・査定に影響を及ぼすことを目的としたものではありません。
        </p>
        <p className="muted">
          回答結果は、経営層と責任者側の認識差を確認し、
          今後の役割分担や権限移譲について整理するために使用されます。
        </p>
        <p className="muted">
          ご不明点や懸念点、再度の受検をご希望の場合は、
          以下までお問い合わせください。
        </p>
        <p>
          合同会社Two rails<br />
          メール：info@ceo-sherpa.com
        </p>
      </div>
    </main>
  );
}
