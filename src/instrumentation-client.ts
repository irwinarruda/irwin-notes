import posthog from "posthog-js";
import { SITE_URL } from "@/utils/site";

if (window.location.origin === SITE_URL) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    defaults: "2026-01-30",
  });
}
