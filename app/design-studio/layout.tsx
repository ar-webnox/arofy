import { studioFontClasses } from "@/lib/studio-fonts";
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <div id="studio-root" className={studioFontClasses}>{children}</div>;
}
