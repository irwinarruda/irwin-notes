import { JetBrains_Mono } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
});

type RootLayoutProps = {
  children: React.ReactNode;
  locale: string;
};

export default function RootLayoutScreen(props: Readonly<RootLayoutProps>) {
  return (
    <html lang={props.locale} className={jetbrainsMono.variable} data-theme="dark">
      <body className="bg-term-bg font-mono antialiased min-h-screen">
        {props.children}
      </body>
    </html>
  );
}
