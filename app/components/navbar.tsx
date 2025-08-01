"use client";

import NextLink from "next/link";
import { useTheme } from "next-themes";
import { NavTabs } from "@/app/components/nav-tabs";
import { Wallet } from "@/app/components/wallet";
import { useState } from "react";
import { useEffect } from "react";
import { useCurrentUser, useSignOut } from "@coinbase/cdp-hooks";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const tabs = [
	{ title: "Explore", href: "/explore" },
	{ title: "Rewards", href: "/rewards" },
];


interface NavbarProps {
	userData?: {
		usdcAvailable: string;
		smartAccountAddress: string;
		userId: string;
		name: string;
	};
	showTabs?: boolean;
	showWallet?: boolean;
	showAuth?: boolean;
}

export function Navbar({
	userData,
	showTabs = true,
	showWallet = true,
	showAuth = true
}: NavbarProps) {
	const { resolvedTheme, setTheme } = useTheme();
	const [isLightMode, setIsLightMode] = useState(false);
	useEffect(() => {
		setIsLightMode(resolvedTheme === "light");
	}, [resolvedTheme]);
	const signOut = useSignOut();
	const user = useCurrentUser();
	const userAuthenticated = user !== null;
	return (
		<header
			className="sticky top-0 z-30 flex flex-col  mx-auto bg-black dark:bg-black border-b w-full"
		>
			<div
				className="flex items-center justify-between px-4 shrink-0"
				style={{ height: "50px" }}
			>
				<div className="flex items-center justify-center">
					{isLightMode ? (
						<NextLink href="/explore">
							<div className=" text-2xl bg-black rounded-full flex items-center justify-center text-white font-bold">
								HFT Studio
							</div>
						</NextLink>
					) : (
						<NextLink href="/explore">
							<div className=" text-2xl -full flex items-center justify-center text-white font-bold">
								HFT
							</div>
						</NextLink>
					)}
				</div>
				<div className="flex items-center">
					<div className="flex gap-4 items-center">
						{showWallet && userData && (
							<Wallet
								userData={userData}
							/>
						)}

					</div>
					{userAuthenticated && showAuth && (
						<div className="px-4 pb-2 flex items-center justify-between">
							<Button variant={'secondary'} onClick={() => signOut()}>Sign Out</Button>
						</div>
					)}
					{!userAuthenticated && showAuth && (
						<Link href="/sign-in">
							<Button className="bg-white text-black">Sign In</Button>
						</Link>
					)}
				</div>
			</div>
			{showTabs && (
				<div className="px-4 pb-2 flex items-center justify-between">
					<NavTabs tabs={tabs} />
				</div>
			)}
		</header>
	);
}
