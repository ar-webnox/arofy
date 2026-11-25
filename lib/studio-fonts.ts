import { Playfair_Display, DM_Serif_Display, Cinzel, Abril_Fatface, Bebas_Neue, Anton, Oswald, Orbitron, Press_Start_2P, Righteous, Pacifico, Lobster, Permanent_Marker, Space_Grotesk } from "next/font/google";

// Next.js requires every font loader to be called and assigned to its own const at module scope.
const playfair = Playfair_Display({ subsets: ["latin"], style: ["normal", "italic"], display: "swap", variable: "--sf-playfair" });
const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400", display: "swap", variable: "--sf-dmserif" });
const cinzel = Cinzel({ subsets: ["latin"], display: "swap", variable: "--sf-cinzel" });
const abril = Abril_Fatface({ subsets: ["latin"], weight: "400", display: "swap", variable: "--sf-abril" });
const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400", display: "swap", variable: "--sf-bebas" });
const anton = Anton({ subsets: ["latin"], weight: "400", display: "swap", variable: "--sf-anton" });
const oswald = Oswald({ subsets: ["latin"], display: "swap", variable: "--sf-oswald" });
const orbitron = Orbitron({ subsets: ["latin"], display: "swap", variable: "--sf-orbitron" });
const pressStart = Press_Start_2P({ subsets: ["latin"], weight: "400", display: "swap", variable: "--sf-press" });
const righteous = Righteous({ subsets: ["latin"], weight: "400", display: "swap", variable: "--sf-righteous" });
const pacifico = Pacifico({ subsets: ["latin"], weight: "400", display: "swap", variable: "--sf-pacifico" });
const lobster = Lobster({ subsets: ["latin"], weight: "400", display: "swap", variable: "--sf-lobster" });
const marker = Permanent_Marker({ subsets: ["latin"], weight: "400", display: "swap", variable: "--sf-marker" });
const grotesk = Space_Grotesk({ subsets: ["latin"], display: "swap", variable: "--sf-grotesk" });

const fonts = [playfair, dmSerif, cinzel, abril, bebas, anton, oswald, orbitron, pressStart, righteous, pacifico, lobster, marker, grotesk];
export const studioFontClasses = fonts.map((f) => f.variable).join(" ");
