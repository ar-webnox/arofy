import { ToolShell, toolMeta } from "@/components/tools/shell";
import { BatchApp } from "@/components/tools/batch-app";

const title = "Batch Text Styler: Style Many Lines at Once | AROFY";
const desc = "Paste a list and style every line independently with multiple Unicode styles, prefixes, suffixes, numbering, sorting and duplicate removal. Copy all or download TXT.";
export const metadata = toolMeta(title, desc, "/batch-styler");
const faq = [
  ["Is there a limit on the number of lines?", "There is no fixed limit. Very large lists depend on your device, but processing happens locally and updates as you type."],
  ["Can I keep the original order?", "Yes. Sorting is off by default, so lines stay in the order you pasted them."],
] as const;

export default function Page() {
  return (
    <ToolShell title="Batch text styler" intro="Paste a list, choose one or more styles and get every line transformed. Download or copy the results." path="/batch-styler" desc={desc} about={{ h: "Style a whole list in one go", p: ["Each line is styled independently, so lists of names, titles or captions stay separate. Select several styles to get one block per style.", "Clean the list first with duplicate removal, sorting and trimming, add numbering, a prefix or a suffix and download the finished text as a TXT file."] }} faq={faq}>
      <BatchApp />
    </ToolShell>
  );
}
