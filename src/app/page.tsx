import { permanentRedirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/utils/i18n";

export default function HomePage() {
  permanentRedirect(`/${DEFAULT_LOCALE}/posts`);
}
