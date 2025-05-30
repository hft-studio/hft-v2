"use client";

import { UserButton, useUser } from "@stackframe/stack";
import { useTheme } from "next-themes";
import NextLink from "next/link";
import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { NavTabs } from "@/app/components/nav-tabs";
import { Wallet } from "@/app/components/wallet";
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
}

export function Navbar(props: NavbarProps) {
	const { resolvedTheme, setTheme } = useTheme();
	const user = useUser();
	return (
		<header
			className="sticky top-0 z-30 flex flex-col  mx-auto bg-white dark:bg-black border-b w-full"
		>
			<div
				className="flex items-center justify-between px-4 shrink-0"
				style={{ height: "50px" }}
			>
				<div className="flex items-center justify-center">
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
				</div>

				<div className="flex items-center">
					<div className="flex gap-4 items-center">
						<NextLink href="https://docs.stack-auth.com/">
							<Typography type="label">Docs</Typography>
						</NextLink>
						<NextLink href="https://docs.stack-auth.com/">
							<Button variant="outline" size="sm">
								Feedback
							</Button>
						</NextLink>

					</div>

					{/* <UserButton
						colorModeToggle={() =>
							setTheme(resolvedTheme === "light" ? "dark" : "light")
						}
					/> */}
				</div>
			</div>
			{props.userData && (
				<div className="px-4 pb-2 flex items-center justify-between">
					<NavTabs tabs={tabs} />
					{props.userData && (
						<Wallet
							userData={props.userData}
						/>
					)}
				</div>
			)}
		</header>
	);
}
