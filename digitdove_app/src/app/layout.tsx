import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalProvider } from "./providers/GlobalContext";
import { ThemeProvider } from "./providers/ThemeContext";
import { FormatProvider } from "./providers/FormatContext";
import ClientLayout from "./components/ClientLayout";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Digitdove App",
  description: "The Goddess App for Finance dudes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GlobalProvider>
        <ThemeProvider>
          <FormatProvider>
            <body className={inter.className}>
              <ClientLayout>{children}</ClientLayout>
            </body>
          </FormatProvider>
        </ThemeProvider>
      </GlobalProvider>
    </html>
  );
}
