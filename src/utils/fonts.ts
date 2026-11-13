import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadPlayfairDisplay } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadPlusJakartaSans } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadSyne } from "@remotion/google-fonts/Syne";

const playfair = loadPlayfairDisplay("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
});

const jakarta = loadPlusJakartaSans("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const spaceGrotesk = loadSpaceGrotesk("normal", {
  weights: ["500", "600", "700"],
  subsets: ["latin"],
});

const syne = loadSyne("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
});

const inter = loadInter("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const jetbrains = loadJetBrainsMono("normal", {
  weights: ["400", "500", "700"],
  subsets: ["latin"],
});

export const FONTS = {
  playfair: playfair.fontFamily,
  jakarta: jakarta.fontFamily,
  spaceGrotesk: spaceGrotesk.fontFamily,
  syne: syne.fontFamily,
  inter: inter.fontFamily,
  mono: jetbrains.fontFamily,
} as const;

