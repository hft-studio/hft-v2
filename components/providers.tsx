"use client";

import { ThemeProvider } from "next-themes";
import { CDPHooksProvider } from "@coinbase/cdp-hooks";

const projectId = process.env.NEXT_PUBLIC_COINBASE_PROJECT_ID

if (!projectId) {
	throw new Error("NEXT_PUBLIC_COINBASE_PROJECT_ID is not set");
}

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider defaultTheme="dark" attribute="class">
				<CDPHooksProvider 
					config={{
						projectId: projectId as string
					}}
				>
					{children}
				</CDPHooksProvider>
		</ThemeProvider>
	);
}
