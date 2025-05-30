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
import { Typography } from "@/components/ui/typography";
import { CircleUser, LogIn, LogOut, SunMoon, UserPlus } from "lucide-react";

interface WalletProps {
	userData: {
		usdcAvailable: string;
		smartAccountAddress: string;
		userId: string;
		name: string;
	};
}

function Item(props: { text: string, icon: React.ReactNode, onClick: () => void | Promise<void> }) {
	return (
	  <DropdownMenuItem onClick={() => props.onClick()}>
		<div className="flex gap-2 items-center">
		  {props.icon}
		  <Typography>{props.text}</Typography>
		</div>
	  </DropdownMenuItem>
	);
  }	

export const Wallet = ({
	userData,
}: WalletProps) => {
	const router = useRouter();
	const pathname = usePathname();

	const fetcher = (url: string) => fetch(url).then((res) => res.json());
	const { data } = useSWR(
		`/api/balance?address=${userData.smartAccountAddress}`,
		fetcher,
		{
			refreshInterval: 1000,
			dedupingInterval: 900,
			revalidateOnFocus: false,
			revalidateIfStale: false,
		},
	);
    console.log(data);

	const handleSignOut = async () => {
		await signOut();
		router.push("/login");
	};

	if (!userData.smartAccountAddress) {
		throw new Error("Smart account address is required");
	}

	const { handleOnramp } = useOnramp({
		address: userData.smartAccountAddress,
		partnerUserId: userData.userId,
	});
	const { handleOfframp } = useOfframp({
		address: userData.smartAccountAddress,
		partnerUserId: userData.userId,
	});
	const availableBalance = data?.usdcAvailable
		? Number.parseFloat(data.usdcAvailable).toFixed(2)
		: Number.parseFloat(userData.usdcAvailable).toFixed(2);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="sm"
				>   
					<WalletIcon className="h-4 w-4" />
					<span>${availableBalance}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-48">
				<Item text="Deposit" icon={<ArrowDownIcon className="h-4 w-4 " />} onClick={handleOnramp} />
				<Item text="Withdraw" icon={<ArrowUpIcon className="h-4 w-4 " />} onClick={handleOfframp} />
				<DropdownMenuSeparator />
				<DropdownMenuLabel className="font-normal">
					<span className="text-sm">{userData.name}</span>
				</DropdownMenuLabel>
				<Item text="Sign out" icon={<LogOut className="h-4 w-4 " />} onClick={handleSignOut} />	
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
