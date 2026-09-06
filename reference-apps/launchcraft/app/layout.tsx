import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
export const metadata:Metadata={title:{default:"LaunchCraft",template:"%s · LaunchCraft"},description:"Organisez vos projets, objectifs, tâches et échéances de lancement."};
export default function RootLayout({children}:{children:ReactNode}){return <html lang="fr"><body><a className="skip-link" href="#main-content">Aller au contenu principal</a>{children}</body></html>}
