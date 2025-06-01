"use client";

import { UserButton, useUser } from "@stackframe/stack";
import { useTheme } from "next-themes";
import NextLink from "next/link";
import NextImage from "next/image";
import { NavTabs } from "@/app/components/nav-tabs";
import { Wallet } from "@/app/components/wallet";
import { useState } from "react";
import { useEffect } from "react";
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
}

export function Navbar({
	userData,
	showTabs = true,
	showWallet = true,
}: NavbarProps) {
	const { resolvedTheme, setTheme } = useTheme();
	const user = useUser();
	const [isLightMode, setIsLightMode] = useState(false);
	useEffect(() => {
		setIsLightMode(resolvedTheme === "light");
	}, [resolvedTheme]);
	console.log(isLightMode);
	return (
		<header
			className="sticky top-0 z-30 flex flex-col  mx-auto bg-white dark:bg-black border-b w-full"
		>
			<div
				className="flex items-center justify-between px-4 shrink-0"
				style={{ height: "50px" }}
			>
				<div className="flex items-center justify-center">
					{isLightMode ? (
					<NextLink href="/explore">
						<NextImage
							src="/logo-bright.png"
							alt="HF Studio Logo"
							width={36}
							height={20}
							className="drop-shadow-[0_0_8px_rgba(90,161,227,0.6)]"
							style={{ objectFit: "contain" }}
						/>
					</NextLink>
					) : (
						<NextLink href="/explore">
							<NextImage
								src="/2.png"
								alt="HF Studio Logo"
								width={36}
								height={20}
								className="drop-shadow-[0_0_8px_rgba(90,161,227,0.6)]"
								style={{ objectFit: "contain" }}
							/>
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
						<UserButton
							colorModeToggle={() =>
								setTheme(resolvedTheme === "light" ? "dark" : "light")
							}
						/>
					</div>
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
