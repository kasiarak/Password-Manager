import { Poppins } from "next/font/google";
import Head from "next/head";
import "./globals.css";

const poppins = Poppins({ subsets: ['latin'], weight: ['500'],  });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <meta charset="UTF-8"/> 
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Password Manager</title>
        <link rel = "icon" type="image/svg" href = ""/>
      </Head>
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
