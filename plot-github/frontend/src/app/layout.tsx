import { ConversionTools } from "@/components/LeadExperience";
import type { Metadata } from "next";
import "./globals.css";
import "./studio.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { siteUrl } from "@/lib/site";

export const metadata:Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "PLOT | Design, Engineering & Construction in Hargeisa", template: "%s | PLOT" },
  description: "Plan, design, engineer and deliver your project with PLOT. Architecture, structural engineering, cost estimation, construction management and development in Hargeisa, Somaliland.",
  openGraph: { type:"website", locale:"en_GB", siteName:"PLOT", title:"PLOT. Your vision. Built with purpose.", description:"Architectural design, engineering and property development in Hargeisa." },
  robots: { index: process.env.NEXT_PUBLIC_SITE_URL ? true : false, follow: process.env.NEXT_PUBLIC_SITE_URL ? true : false }
};
export default function RootLayout({ children }:{children:React.ReactNode}){
 return <html lang="en"><body><a className="skip-link" href="#main-content">Skip to content</a><Header/><main id="main-content" className="site-content">{children}</main><Footer/><ConversionTools/></body></html>;
}
