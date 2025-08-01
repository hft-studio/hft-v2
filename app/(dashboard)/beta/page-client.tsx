"use client";
import { Button } from "@/components/ui/button";
import { useCurrentUser, useSignOut } from "@coinbase/cdp-hooks";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function PageClient() {
    const user = useCurrentUser();

    
    console.log(user);
    useEffect(() => {
        if (user === null) {
            console.log("redirecting to sign-in");
            redirect("/sign-in");
        }
    }, [user]);
    return (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-50px)]">
            <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Closed Beta</h1>
            <p className="text-gray-200 text-center mt-4 mb-8 max-w-md text-lg drop-shadow-md">
                Unleash the Power of Decentralized Finance
            </p>

            {/* Call to Action */}
            <div className="text-center">
                <p className="text-gray-300 text-sm mb-3 drop-shadow-md">
                    Follow us for product announcements and updates
                </p>
                <a
                    href="https://www.linkedin.com/company/hft-labs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 drop-shadow-lg"
                >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    Follow HFT Labs
                </a>
            </div>
        </div>
    )
}