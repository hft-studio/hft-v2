import { Navbar } from "@/app/components/navbar";
import PageClient from "./page-client";

export default async function BetaPage() {
    return (
        <div className="relative min-h-screen bg-black text-white">
            <Navbar showTabs={false} showWallet={false} showAuth={false} />
            <PageClient />
        </div>
    );
}