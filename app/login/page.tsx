"use client"

import Image from "next/image";
import { Animations } from "@/components/animations";
import { SignInButton } from "./login-button";
import { Social } from "@/app/components/social";

export default function LoginPage() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black backdrop-blur-sm z-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,20,20,0.8)_0%,rgba(0,0,0,1)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(40,40,40,0.3)_1px,transparent_1px)] bg-[length:30px_30px] opacity-30" />
      <Animations />
      <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-[#5AA1E3] to-transparent opacity-80 animate-pulse" />
      <div className="relative bg-black/80 border border-gray-800 rounded-3xl p-12 shadow-[0_0_30px_rgba(0,0,0,0.7)] backdrop-blur-sm animate-[fadeIn_1s_ease-out_forwards] max-w-md w-full">
        <div className="relative mb-10 flex justify-center">
          <div className="w-[240px] h-[240px] rounded-2xl overflow-hidden relative flex items-center justify-center bg-black">
            <div className="absolute inset-0 shadow-[0_0_30px_rgba(90,161,227,0.4)]"/>

            <div className="relative z-10 flex items-center justify-center w-full h-full overflow-hidden">
              <div className="-m-12 w-[450px] h-[450px] flex items-center justify-center">
                <Image
                  src="/logo-t.png"
                  alt="HF Studio Logo"
                  width={450}
                  height={450}
                  className="transform scale-110"
                  priority
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tagline with better typography */}
        <div className="relative z-10 flex flex-col items-center">
          <p className="text-[#5AA1E3] text-sm font-medium tracking-[0.25em] uppercase mb-8 text-center">
            Advanced DeFi Strategies for Everyday Investors
          </p>

          {/* Button and terms section grouped together */}
          <div className="flex flex-col items-center w-full">
            {/* Using the app's Button component instead of a custom button */}
            <SignInButton />

            {/* Terms and Privacy Links - now directly under button */}
            <div className="mt-6 flex flex-col items-center text-xs text-gray-400">
              <p className="mb-2">By connecting, you agree to our:</p>
              <div className="flex space-x-4">
                <a href="/terms" className="text-[#5AA1E3] hover:text-[#7BB5E8] transition-colors">Terms of Service</a>
                <span className="text-gray-600">•</span>
                <a href="/privacy" className="text-[#5AA1E3] hover:text-[#7BB5E8] transition-colors">Privacy Policy</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Social position="absolute" />
    </div>
  );
}