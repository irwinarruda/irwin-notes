import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const OPEN_GRAPH_IMAGE_SIZE = { width: 1200, height: 630 };

const FONT_PATH = "src/assets/fonts/chakra-petch/ChakraPetch-SemiBold.ttf";
const WORDMARK_PATH = "public/brand/irwin-arruda-dark.svg";
const LONG_TITLE_LENGTH = 70;

const BARRO_DARK = {
  page: "#0B0E11",
  fg: "#E6EAEF",
  fgMuted: "#979FA8",
  brick: "#B64D3F",
  type: "#46D4C9",
};

type OpenGraphImageProps = {
  title: string;
  details?: string;
  tags?: string[];
};

export async function createOpenGraphImage(props: OpenGraphImageProps) {
  const [font, wordmark] = await Promise.all([
    readFile(path.join(process.cwd(), FONT_PATH)),
    readFile(path.join(process.cwd(), WORDMARK_PATH), "base64"),
  ]);
  const tags = props.tags ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 72px 60px",
          borderBottom: `12px solid ${BARRO_DARK.brick}`,
          backgroundColor: BARRO_DARK.page,
          fontFamily: "Chakra Petch",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/svg+xml;base64,${wordmark}`}
          alt=""
          width={271}
          height={44}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: props.title.length > LONG_TITLE_LENGTH ? 48 : 72,
              lineHeight: 1.12,
              letterSpacing: "-0.01em",
              color: BARRO_DARK.fg,
            }}
          >
            {props.title}
          </div>
          {props.details && (
            <div style={{ fontSize: 30, color: BARRO_DARK.fgMuted }}>
              {props.details}
            </div>
          )}
          {tags.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 20,
                fontSize: 28,
                color: BARRO_DARK.type,
              }}
            >
              {tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    ),
    {
      ...OPEN_GRAPH_IMAGE_SIZE,
      fonts: [{ name: "Chakra Petch", data: font, weight: 600, style: "normal" }],
    },
  );
}
