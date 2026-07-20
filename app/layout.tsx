import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: { default: "Tragovi kroz vrijeme | Digitalna izložba", template: "%s | Tragovi kroz vrijeme" },
  description: "Digitalna muzejska mini-izložba o predmetima i mjestima istočne obale Jadrana.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="hr">
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
