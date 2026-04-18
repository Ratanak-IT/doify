
import { Poppins } from "next/font/google";
import localFont from "next/font/local";

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

export const sovaphum = localFont({
  src: "../../public/Suwannaphum-Regular.ttf",
  variable: "--font-khmer",
  preload: false,
});