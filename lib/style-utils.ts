import { STYLES, type Style } from "./transforms";
/** Letter-transforming styles only (Symbols and Text Art ignore the input text). */
export const TEXT_STYLES: Style[] = STYLES.filter((s) => s.cat !== "symbols" && s.cat !== "art");
export const styleById = (id: string) => TEXT_STYLES.find((s) => s.id === id);
/** Apply a style to each line independently so line breaks are never decorated. */
export const applyStyle = (s: Style | undefined, t: string) => (s ? t.split("\n").map((l) => s.fn(l)).join("\n") : t);
