"use client";

import { Button } from "@/components/ui/button";

interface BetaSignupFormProps {
}

export function BetaSignupForm({ }: BetaSignupFormProps) {
    return (
        <Button
            variant="default"
            size="lg"
            className="bg-white text-black hover:bg-gray-200 font-semibold px-8 py-3"
        >
            Sign Up for Beta
        </Button>
    );
} 