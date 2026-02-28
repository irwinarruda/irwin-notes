import { notFound } from "next/navigation";
import { isLocale } from "@/utils/i18n";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayoutScreen(props: LocaleLayoutProps) {
  const params = await props.params;
  if (!isLocale(params.locale)) {
    notFound();
  }

  return props.children;
}
