import type { Metadata } from "next";
import { Inter, Source_Code_Pro, Source_Sans_3} from "next/font/google";
import "./globals.css";
import { GlobalProvider } from "./providers/GlobalContext";
import { ThemeProvider } from "./providers/ThemeContext";
import { FormatProvider } from "./providers/FormatContext";
import ClientLayout from "./components/ClientLayout";
const inter = Inter({ subsets: ["latin"] });
const sourceCodePro = Source_Code_Pro({ subsets: ["latin"] });
const sourceSans3 = Source_Sans_3({ subsets: ["latin"] });
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
            <body className={sourceSans3.className}>
              <ClientLayout>{children}</ClientLayout>
            </body>
          </FormatProvider>
        </ThemeProvider>
      </GlobalProvider>
    </html>
  );
}
