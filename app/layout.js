import { Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ['400', '700'],
});

export const metadata = {
  title: "The Tech Catalyst",
  description: "Break into Big Tech with The Tech Catalyst",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body className={playfair.className}>
        {children} {/* Ensure children are rendered here */}
      </body>
    </html>
  );
}