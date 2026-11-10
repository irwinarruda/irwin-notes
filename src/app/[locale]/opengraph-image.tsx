import { getDictionary, LOCALES, resolveLocale } from "@/utils/i18n";
import {
  createOpenGraphImage,
  OPEN_GRAPH_IMAGE_SIZE,
} from "@/utils/open-graph-image";

type SiteOpenGraphImageProps = {
  params: Promise<{ locale: string }>;
};

export const size = OPEN_GRAPH_IMAGE_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function SiteOpenGraphImage(
  props: SiteOpenGraphImageProps,
) {
  const params = await props.params;
  const dictionary = await getDictionary(resolveLocale(params.locale));

  return createOpenGraphImage({ title: dictionary.meta.siteDescription });
}
