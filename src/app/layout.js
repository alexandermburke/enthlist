import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Head from "./head";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  description: "Superfast cool vehicles for sale",
};

export default function RootLayout({ children }) {
  // if home path and user logged in then route to /admin (dashboard) but do it from the authcontext logic


  return (
    <html lang="en">
      <Head />
      <AuthProvider>
        <body className={'relative flex flex-col text-slate-800 text-sm sm:text-base min-h-screen  ' + inter.className}>
          <div id="portal" />
          {children}
        </body>
      </AuthProvider>
    </html>
  )
}
