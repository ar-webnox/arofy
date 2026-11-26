import { ToolShell, toolMeta } from "@/components/tools/shell";
import { UsernameApp } from "@/components/tools/username-app";

const title = "Username Generator: Creative, Styled Names | AROFY";
const desc = "Generate usernames from your keyword with themes, separators, numbers, decorative symbols and Unicode styles. Set a length limit, copy results and save favorites.";
export const metadata = toolMeta(title, desc, "/username-generator");
const faq = [
  ["Are the usernames guaranteed to be available?", "No. The generator only suggests names; it cannot check whether a platform already has them. Try a few and keep your favorites."],
  ["Why do some names have symbols?", "Symbols and Unicode styles are optional. Turn them off and set a maximum length for names that work on strict platforms."],
] as const;

export default function Page() {
  return (
    <ToolShell title="Username generator" intro="Enter a keyword, pick a theme and get dozens of ideas. Regenerate until one feels right, then save it." path="/username-generator" desc={desc} about={{ h: "Names built from your keyword", p: ["Each result combines your keyword with theme-based prefixes, suffixes and words, with optional numbers, symbols and Unicode styling. Leave the keyword empty to get fully random ideas.", "Plain names use only letters, numbers, dots and underscores and are accepted almost everywhere. Styled names with symbols or special letters look distinctive but some sites reject them, so each result is labelled."] }} faq={faq}>
      <UsernameApp />
    </ToolShell>
  );
}
