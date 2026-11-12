import Link from "next/link";
import { Brand } from "./Header";
export function Footer(){
 return <footer><div className="shell footer-inner"><Brand /><p>Design · Engineering · Development | Hargeisa, Somaliland</p><div className="footer-links"><Link href="/services">Services</Link><Link href="/projects">Projects</Link><Link href="/contact">Contact</Link><Link href="/privacy">Privacy</Link></div></div></footer>;
}
