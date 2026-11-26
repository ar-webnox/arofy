import { ToolShell, toolMeta } from "@/components/tools/shell";
import { TextToolsApp } from "@/components/tools/text-tools-app";

const title = "Text Tools: Case Converter, Counter, Slug & More | AROFY";
const desc = "21 free text utilities: case converters, line sorting, duplicate removal, find and replace, slug generator and word, character and reading-time counters.";
export const metadata = toolMeta(title, desc, "/text-tools");
const faq = [
  ["Is my text sent anywhere?", "No. Every tool runs in your browser, so your text never leaves your device."],
  ["How accurate is the reading time?", "It assumes about 238 words per minute for silent reading and 130 for speaking aloud, which are common averages. Real speed varies by reader and topic."],
] as const;

export default function Page() {
  return (
    <ToolShell title="Text tools" intro="Convert case, clean up lines, find and replace and count words, characters and reading time. Results update as you type." path="/text-tools" desc={desc} about={{ h: "Everything you need to clean up text", p: ["Pick a tool on the left (or from the menu on mobile), paste your text and the result updates instantly. Case converters handle accents and non-Latin letters and reversing keeps emoji and combined characters intact.", "Line tools remove duplicates, sort A–Z or Z–A, strip empty lines and collapse extra spaces. Find and replace supports plain text or regular expressions and the slug tool turns headings into clean URLs."] }} faq={faq}>
      <TextToolsApp />
    </ToolShell>
  );
}
