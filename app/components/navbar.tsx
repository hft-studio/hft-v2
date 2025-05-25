"use client";
import React from "react";
import Image from "next/image";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { ArrowUpIcon, ArrowDownIcon, WalletIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useOfframp } from "@/hooks/use-offramp";
import { useOnramp } from "@/hooks/use-onramp";
import useSWR from "swr";
import { getBaseUrl } from "@/lib/utils";

interface NavbarProps {
	usdcAvailable: string;
	smartAccountAddress?: string;
	userId: string;
	name: string;
}

export const Navbar = ({
	usdcAvailable,
	smartAccountAddress,
	userId,
	name,
}: NavbarProps) => {
	const router = useRouter();
	const pathname = usePathname();

	const fetcher = (url: string) => fetch(url).then((res) => res.json());
	const { data } = useSWR(
		`${getBaseUrl()}/api/balance?address=${smartAccountAddress}`,	
		fetcher,
		{
			refreshInterval: 1000,
			dedupingInterval: 900,
			revalidateOnFocus: false,
			revalidateIfStale: false,
		},
	);
	const handleSignOut = async () => {
		await signOut();
		router.push("/login");
	};

	if (!smartAccountAddress) {
		throw new Error("Smart account address is required");
	}

	const { handleOnramp } = useOnramp({
		address: smartAccountAddress,
		partnerUserId: userId,
	});
	const { handleOfframp } = useOfframp({
		address: smartAccountAddress,
		partnerUserId: userId,
	});
	const availableBalance = data?.usdcAvailable
		? Number.parseFloat(data.usdcAvailable).toFixed(2)
		: Number.parseFloat(usdcAvailable).toFixed(2);

	return (
		<div>
			<nav className="border-b-0 bg-black/40 h-[60px] backdrop-blur-sm">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center">
							<div className="flex-shrink-0">
								<div className="relative flex items-center justify-center">
									<Image
										src="/2.png"
										alt="HF Studio Logo"
										width={36}
										height={20}
										className="drop-shadow-[0_0_8px_rgba(90,161,227,0.6)]"
										style={{ objectFit: "contain" }}
									/>
								</div>
							</div>
						</div>
						<div className="flex items-center space-x-4">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										className="border-gray-700 bg-black/50 hover:bg-black/70 text-gray-200 flex items-center gap-2"
									>
										<WalletIcon className="h-4 w-4" />
										<span>${availableBalance}</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-48">
									<DropdownMenuLabel>{name}</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										className="flex items-center gap-2 cursor-pointer"
										onSelect={handleOnramp}
									>
										<ArrowDownIcon className="h-4 w-4 " />
										<span>Deposit</span>
									</DropdownMenuItem>
									<DropdownMenuItem
										className="flex items-center gap-2 cursor-pointer"
										onSelect={handleOfframp}
									>
										<ArrowUpIcon className="h-4 w-4 " />
										<span>Withdraw</span>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem onSelect={handleSignOut}>
										Sign out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</div>
			</nav>

			<div className="bg-black/30 backdrop-blur-sm border-b border-gray-800">
				<div className="flex justify-between mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex items-center space-x-4 h-12">
						<a
							href="/explore"
							className={`px-3 py-2 text-sm font-medium ${
								pathname === "/explore"
									? "text-[#5AA1E3] border-b-2 border-[#5AA1E3]"
									: "text-gray-300 hover:text-[#5AA1E3]"
							}`}
						>
							Explore
						</a>	
						<a
							href="/rewards"
							className={`px-3 py-2 text-sm font-medium ${
								pathname === "/rewards"
									? "text-[#5AA1E3] border-b-2 border-[#5AA1E3]"
									: "text-gray-300 hover:text-[#5AA1E3]"
							}`}
						>
							Rewards
						</a>
					</div>
					<div className="hidden md:flex items-center space-x-5 mr-2">
						<a
							href="/feedback"
							className="text-gray-300 hover:text-[#5AA1E3] transition-colors duration-200 text-sm font-medium"
						>
							Feedback
						</a>
						<a
							href="/help"
							className="text-gray-300 hover:text-[#5AA1E3] transition-colors duration-200 text-sm font-medium"
						>
							Help
						</a>
						<a
							href="/docs"
							className="text-gray-300 hover:text-[#5AA1E3] transition-colors duration-200 text-sm font-medium"
						>
							Docs
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};
