import { Chakra_Petch, JetBrains_Mono } from "next/font/google";
import { THEME_COOKIE, type Palette, type Theme } from "@/utils/theme";

const THEME_INIT_SCRIPT = `(() => {
  const match = document.cookie.match(/(?:^|; )${THEME_COOKIE}=([^;]*)/);
  if (!match) {
    return;
  }

  for (const word of match[1].split("-")) {
    if (word === "dark" || word === "light") {
      document.documentElement.setAttribute("data-theme", word);
    }

    if (word === "barro" || word === "favo") {
      document.documentElement.setAttribute("data-palette", word);
    }
  }
})();`;

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
});

const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-chakra-petch",
});

type RootLayoutProps = {
  children: React.ReactNode;
  locale: string;
  theme?: Theme;
  palette: Palette;
};

export default function RootLayoutScreen(props: Readonly<RootLayoutProps>) {
  return (
    <html
      lang={props.locale}
      className={`${jetbrainsMono.variable} ${chakraPetch.variable}`}
      data-theme={props.theme}
      data-palette={props.palette}
      suppressHydrationWarning
    >
      <body className="bg-page text-fg font-mono antialiased min-h-screen">
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        {props.children}
      </body>
    </html>
  );
}
