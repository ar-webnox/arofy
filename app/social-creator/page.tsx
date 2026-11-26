import { ToolShell, toolMeta } from "@/components/tools/shell";
import { SocialApp } from "@/components/tools/social-app";

const title = "Social Media Text Generator: Bios, Captions & Posts | AROFY";
const desc = "Write bios, captions and posts for Instagram, Facebook, WhatsApp, Discord, YouTube, X, TikTok and LinkedIn with live character limits, Unicode styles and symbols.";
export const metadata = toolMeta(title, desc, "/social-creator");
const faq = [
  ["Are the character limits accurate?", "They are the published maximums at the time of writing. Platforms occasionally change them, so check the platform if a limit matters for your account."],
  ["Will styled text count differently?", "Some platforms count Unicode styled letters as two characters. When that applies, the counter shows the larger figure so you can leave room."],
] as const;

export default function Page() {
  return (
    <ToolShell title="Social media text generator" intro="Start from a template, edit it, check the platform's character limit, add symbols and copy a styled version." path="/social-creator" desc={desc} about={{ h: "Templates with the limits that matter", p: ["Choose a platform and a template, add your name and topic, then edit the text freely. A live counter shows how close you are to the published limit for that bio, caption or post.", "Apply a Unicode style, insert symbols at your cursor and compare your text in several styles at once. Save favorites to reuse later; they stay in your browser."] }} faq={faq}>
      <SocialApp />
    </ToolShell>
  );
}
