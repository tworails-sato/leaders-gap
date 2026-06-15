import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="shell">
          <span className="badge">BtoB Organization Diagnostic</span>
          <h1>リーダーズGAP診断</h1>
          <p className="lead">
            経営層と事業責任者の認識差を可視化し、権限移譲の論点を整理する診断です。
          </p>
          <p className="muted">
            受検は管理者が発行した回答者専用URLからのみ行います。社長・取締役・部長などの受検者にログインは不要です。
          </p>
          <div className="nav" style={{ marginTop: 28 }}>
            <Link className="button" href="/login">管理者ログイン</Link>
          </div>
        </div>
      </section>
      <section className="shell grid three">
        {["戦略", "評価と制度", "戦術", "組織体制"].map((item) => (
          <div className="panel" key={item}>
            <h2>{item}</h2>
            <p className="muted">社長側と部長・事業責任者側の認識差を小テーマ単位で確認します。</p>
          </div>
        ))}
      </section>
    </main>
  );
}
