import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({ subsets: ['latin'], weight: ['500'] });

export const metadata = {
  title: "Password Manager",
  description: "Manage your passwords securely",
  icons: {
    icon: "/lock-svgrepo-com.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
