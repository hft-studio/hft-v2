import { getServerSession } from "next-auth";
import { LoginButton } from "./login-button";
import Image from "next/image";
import { authOptions } from "@/lib/auth";

export default async function LoginPage() {
    const session = await getServerSession(authOptions)
    console.log(session)
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1A1B23] bg-gradient-to-b from-[#1A1B23] via-[#1A1B23]/90 to-black">
      <div className="relative flex flex-col items-center">
        {/* Ambient light effect */}
        <div className="absolute -top-40 -z-10">
          <div className="h-[200px] w-[600px] bg-[#5AA1E3]/20 blur-[120px] rounded-full" />
        </div>

        {/* Content */}
        <div className="flex flex-col items-center gap-16">
          {/* Logo */}
          <div className="w-[600px] h-[250px] relative">
            <Image
              src="/logo-t.png"
              alt="HFT Studio Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Tagline */}
          <p className="text-[#5AA1E3] text-sm tracking-[0.2em] uppercase mb-4">
            Advanced DeFi Strategies for Everyday Investors
          </p>
          
          {/* Sign in button */}
          <div className="w-[280px]">
            <LoginButton />
          </div>
        </div>
      </div>
    </div>
  );
}