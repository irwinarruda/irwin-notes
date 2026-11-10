import { LOCALES } from "@/utils/i18n";
import {
  createOpenGraphImage,
  OPEN_GRAPH_IMAGE_SIZE,
} from "@/utils/open-graph-image";

export const size = OPEN_GRAPH_IMAGE_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default function SiteOpenGraphImage() {
  return createOpenGraphImage();
}
