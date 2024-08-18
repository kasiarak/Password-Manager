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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (localStorage.getItem('mode') === 'dark') {
                  document.documentElement.style.setProperty('--main-color', '#292828');
                  document.documentElement.style.setProperty('--secondary-color', '#ffffff');
                  document.documentElement.style.setProperty('--scrollbar-color', '#606060 #2b2b2b');
                  document.documentElement.style.setProperty('--img-filter', 'invert(1) brightness(2)');
                } else {
                  document.documentElement.style.setProperty('--main-color', '#ffffff');
                  document.documentElement.style.setProperty('--secondary-color', '#000000');
                  document.documentElement.style.setProperty('--scrollbar-color', '#c0c0c0 #f0f0f0');
                  document.documentElement.style.setProperty('--img-filter', 'none');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={poppins.className}>{children}</body>
    </html>
  );
}