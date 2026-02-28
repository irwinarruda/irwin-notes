import type { Metadata } from "next";
import RootLayoutScreen from "@/layout/root-layout";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Irwin Notes",
  description:
    "Terminal-style blog by Irwin Arruda Sales. Software Developer, Vim enthusiast, tool builder.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout(props: Readonly<RootLayoutProps>) {
  return <RootLayoutScreen>{props.children}</RootLayoutScreen>;
}
