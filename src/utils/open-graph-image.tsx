import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const OPEN_GRAPH_IMAGE_SIZE = { width: 1200, height: 630 };

const FONT_PATH = "src/assets/fonts/chakra-petch/ChakraPetch-SemiBold.ttf";
const WORDMARK_PATH = "public/brand/irwin-arruda-dark.svg";
const WORDMARK_RATIO = 1169.33 / 190;
const LONG_TITLE_LENGTH = 70;

const BARRO_DARK = {
  page: "#0B0E11",
  fg: "#E6EAEF",
  fgMuted: "#979FA8",
  brick: "#B64D3F",
};

type OpenGraphImageProps = {
  title?: string;
  details?: string;
};

export async function createOpenGraphImage(props: OpenGraphImageProps = {}) {
  const [font, wordmark] = await Promise.all([
    readFile(path.join(process.cwd(), FONT_PATH)),
    readFile(path.join(process.cwd(), WORDMARK_PATH), "base64"),
  ]);
  const wordmarkHeight = props.title ? 66 : 132;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: props.title ? "space-between" : "center",
          alignItems: props.title ? "flex-start" : "center",
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
          width={Math.round(wordmarkHeight * WORDMARK_RATIO)}
          height={wordmarkHeight}
        />
        {props.title && (
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <div
              style={{
                fontSize: props.title.length > LONG_TITLE_LENGTH ? 56 : 80,
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
                color: BARRO_DARK.fg,
              }}
            >
              {props.title}
            </div>
            {props.details && (
              <div style={{ fontSize: 40, color: BARRO_DARK.fgMuted }}>
                {props.details}
              </div>
            )}
          </div>
        )}
      </div>
    ),
    {
      ...OPEN_GRAPH_IMAGE_SIZE,
      fonts: [{ name: "Chakra Petch", data: font, weight: 600, style: "normal" }],
    },
  );
}
