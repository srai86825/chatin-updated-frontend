import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalContextProvider } from "@/context/StateContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "InstaChat",
  description: "Get in touch in seconds with InstaChat- instand messanging app",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GlobalContextProvider>
          {children}
          <div id="photo-picker-element"></div>
        </GlobalContextProvider>
      </body>
    </html>
  );
}
