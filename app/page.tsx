import { Lightning } from "@/components/lightning";
import { redirect } from "next/navigation";
import { Navbar } from "./components/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {

  return (
    <div>
      <Navbar userData={undefined} showTabs={false} showWallet={false} showSignOut={false} showSignIn={true} />
      <div className="absolute inset-0 z-0">
        <Lightning
          hue={220}
          xOffset={0}
          speed={1}
          intensity={1}
          size={1}
        />
        
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-50px)]">
            <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">HFT Studio</h1>
            <p className="text-gray-200 text-center mt-4 mb-8 max-w-md text-lg drop-shadow-md">
                Unleash the Power of Decentralized Finance
            </p>
            <div className="flex justify-center">
                <Link href="/sign-in">
                    <Button className="bg-white text-black">Get Started</Button>
                </Link>
            </div>
        </div>
    </div>
  )
}
