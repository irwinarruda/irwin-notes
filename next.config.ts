import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import barroKaolin from "./src/styles/barro/barro-kaolin.json";
import barroSlate from "./src/styles/barro/barro-slate.json";
import favoSmoke from "./src/styles/favo/favo-smoke.json";
import favoVeil from "./src/styles/favo/favo-veil.json";

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [
      "remark-gfm",
      "remark-frontmatter",
      "remark-mdx-frontmatter",
    ],
    rehypePlugins: [
      [
        "rehype-pretty-code",
        {
          theme: {
            "barro-dark": barroSlate,
            "barro-light": barroKaolin,
            "favo-dark": favoSmoke,
            "favo-light": favoVeil,
          },
          keepBackground: false,
          defaultLang: {
            block: "plaintext",
            inline: "plaintext",
          },
        },
      ],
    ],
  },
});

const nextConfig: NextConfig = {
  reactCompiler: true,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

export default withMDX(nextConfig);
