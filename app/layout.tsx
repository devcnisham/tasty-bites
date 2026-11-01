import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import Script from "next/script";
import { extensionHydrationGuard } from "@/lib/extension-hydration-guard.mjs";
import "./globals.css";
const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});
const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
export const metadata: Metadata = {
  title: "Tasty Bite Baking Studio | A little flour. A lot of possibility.",
  description:
    "Discover the joy of baking with Tasty Bite. An interactive course studio demo.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${serif.variable} ${sans.variable}`}>
        <Script
          id="form-extension-hydration-guard"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: extensionHydrationGuard }}
        />
        {children}
      </body>
    </html>
  );
}
