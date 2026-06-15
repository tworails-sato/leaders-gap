import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "リーダーズGAP診断",
  description: "経営層と事業責任者の認識差を可視化し、権限移譲の論点を整理する診断です。"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
