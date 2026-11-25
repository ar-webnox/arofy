import { Playfair_Display, DM_Serif_Display, Cinzel, Abril_Fatface, Bebas_Neue, Anton, Oswald, Orbitron, Press_Start_2P, Righteous, Pacifico, Lobster, Permanent_Marker, Space_Grotesk } from "next/font/google";

const fonts = [
  Playfair_Display({ subsets: ["latin"], style: ["normal", "italic"], display: "swap", variable: "--sf-playfair" }),
  DM_Serif_Display({ subsets: ["latin"], weight: "400", display: "swap", variable: "--sf-dmserif" }),
  Cinzel({ subsets: ["latin"], display: "swap", variable: "--sf-cinzel" }),
  Abril_Fatface({ subsets: ["latin"], weight: "400", display: "swap", variable: "--sf-abril" }),
  Bebas_Neue({ subsets: ["latin"], weight: "400", display: "swap", variable: "--sf-bebas" }),
  Anton({ subsets: ["latin"], weight: "400", display: "swap", variable: "--sf-anton" }),
  Oswald({ subsets: ["latin"], display: "swap", variable: "--sf-oswald" }),
  Orbitron({ subsets: ["latin"], display: "swap", variable: "--sf-orbitron" }),
  Press_Start_2P({ subsets: ["latin"], weight: "400", display: "swap", variable: "--sf-press" }),
  Righteous({ subsets: ["latin"], weight: "400", display: "swap", variable: "--sf-righteous" }),
  Pacifico({ subsets: ["latin"], weight: "400", display: "swap", variable: "--sf-pacifico" }),
  Lobster({ subsets: ["latin"], weight: "400", display: "swap", variable: "--sf-lobster" }),
  Permanent_Marker({ subsets: ["latin"], weight: "400", display: "swap", variable: "--sf-marker" }),
  Space_Grotesk({ subsets: ["latin"], display: "swap", variable: "--sf-grotesk" }),
];
export const studioFontClasses = fonts.map((f) => f.variable).join(" ");
