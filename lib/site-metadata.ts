import type { Metadata } from "next";

export const siteUrl = "https://gap.ceo-sherpa.com";

export const defaultTitle =
  "Leaders GAP｜経営と現場の“見えないGAP”を可視化する組織アセスメント";

export const defaultDescription =
  "経営と現場の“見えないGAP”を可視化する、組織向けアセスメント「リーダーズGAP」。上下×左右の認識ズレを、インタビューと診断で構造化します。";

const socialDescription =
  "上下×左右の認識ズレを、インタビューと診断で構造化する組織向けアセスメント。by Two rails";

const socialImage = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Leaders GAP - 経営と現場のGAPを可視化する"
};

export function createPageMetadata({
  title = defaultTitle,
  path = "/",
  description = defaultDescription
}: {
  title?: string;
  path?: string;
  description?: string;
} = {}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path
    },
    openGraph: {
      type: "website",
      siteName: "Leaders GAP",
      title,
      description: socialDescription,
      url: path,
      locale: "ja_JP",
      images: [socialImage]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: socialDescription,
      images: [socialImage.url]
    }
  };
}
