import type { Viewport } from "next";
import LandingPage from "@/components/LandingPage";

// Override the root layout's black themeColor with the page's cream background.
export const viewport: Viewport = {
  themeColor: "#f3f1ea",
};

export default function Page() {
  return <LandingPage />;
}
