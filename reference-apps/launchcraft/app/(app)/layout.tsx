import type { ReactNode } from "react";
import AppShell from "@/components/AppShell";
import { getWorkspace } from "@/lib/data";
export const dynamic="force-dynamic";
export default async function PrivateLayout({children}:{children:ReactNode}){const{firstName,user}=await getWorkspace();return <AppShell firstName={firstName} email={user.email??""}>{children}</AppShell>}
