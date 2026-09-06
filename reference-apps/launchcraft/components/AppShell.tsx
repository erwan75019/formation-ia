import type { ReactNode } from "react";
import MobileHeader from "./MobileHeader";
import Sidebar from "./Sidebar";
export default function AppShell({children,firstName,email}:{children:ReactNode;firstName:string;email:string}){return <div className="app-shell"><Sidebar firstName={firstName} email={email}/><MobileHeader/><div className="app-content">{children}</div></div>}
