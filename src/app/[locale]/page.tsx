import { permanentRedirect } from "next/navigation";
import { resolveLocale } from "@/utils/i18n";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocaleHomePage(props: LocalePageProps) {
  const params = await props.params;
  const locale = resolveLocale(params.locale);

  permanentRedirect(`/${locale}/posts`);
}
