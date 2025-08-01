"use client";

import { useCurrentUser } from "@coinbase/cdp-hooks";
import { MagicLinkSignIn } from "@/app/components/sign-in-component";
import { redirect } from "next/navigation";

export default function PageClient() {
	
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-50px)]">
                <div className="w-full max-w-sm mx-auto px-6">
                    {/* Header with Title */}
                    <div className="flex flex-col items-center mb-8">
                        {/* Title */}
                        <h1 className="text-2xl font-semibold text-white mb-2 text-center">
                            Sign in to hft.studio
                        </h1>
                        
                        {/* Subtitle */}
                        <p className="text-sm text-gray-400 text-center">
                            Sign in to your account to continue
                        </p>
                    </div>

                    {/* Sign-in Form */}
                    <div className="w-full">
                        <MagicLinkSignIn />
                    </div>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        
                    </div>
                </div>
            </div>
    )
}