import { Navbar } from "@/app/components/navbar";
import PageClient from "./page-client";

export default async function BetaPage() {
    return (
        <div className="relative min-h-screen bg-black text-white">
            <Navbar userData={undefined} showTabs={false} showWallet={false} />
            <PageClient />  
        </div>
    );
}