import { JetBrains_Mono } from "next/font/google";
import { THEME_COOKIE, type Theme } from "@/utils/theme";

const THEME_INIT_SCRIPT = `(() => {
  const match = document.cookie.match(/(?:^|; )${THEME_COOKIE}=(dark|light)(?:;|$)/);
  if (!match) {
    return;
  }

  document.documentElement.setAttribute("data-theme", match[1]);
})();`;

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
});

type RootLayoutProps = {
  children: React.ReactNode;
  locale: string;
  theme: Theme;
};

export default function RootLayoutScreen(props: Readonly<RootLayoutProps>) {
  return (
    <html
      lang={props.locale}
      className={jetbrainsMono.variable}
      data-theme={props.theme}
      suppressHydrationWarning
    >
      <body className="bg-term-bg font-mono antialiased min-h-screen">
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        {props.children}
      </body>
    </html>
  );
}
