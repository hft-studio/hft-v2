"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DepositModal } from "./deposit-modal";
import { createPosition } from "@/app/actions/create-position";
import { withdrawPosition } from "@/app/actions/withdraw-position";
import type { getPositions } from "@/lib/positions";
import { useRouter } from "next/navigation";
interface PoolCardProps {
	position: Awaited<ReturnType<typeof getPositions>>[number];
}

export function PoolCard({ position }: PoolCardProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const router = useRouter();
	const formattedApr = `${Number.parseFloat(String(position.pool.apr)).toFixed(2)}%`;
	const tvlInMillions = `${(Number.parseFloat(String(position.pool.tvl)) / 1000000).toFixed(2)}M`;
	const formattedSymbol = position.pool.symbol
		.replace("vAMM-", "")
		.replace("/", "-");
	const positionAmount = Number.parseFloat(String(position.totalAmount));
	const formattedPosition = `${positionAmount.toFixed(2)}`;
	const active = positionAmount > 0;

	const handleManageClick = () => {
		setIsModalOpen(true);
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
	};

	const handleDeposit = async (amount: string) => {
		console.log("deposit", amount);
		await createPosition(position.pool.id, Number.parseFloat(amount));
		setIsModalOpen(false);
		router.refresh();
	};

	const handleWithdraw = async () => {
		await withdrawPosition(position.pool.id);
		setIsModalOpen(false);
		router.refresh();
	};

	return (
		<>
			<div className="bg-black border border-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition duration-300">
				<div className="p-4 flex justify-between items-center border-b border-gray-800/40">
					<div className="flex items-center space-x-3">
						<div>
							<h3 className="text-base font-medium text-white">
								{formattedSymbol}
							</h3>
						</div>
					</div>
					{active && (
						<Badge
							className={`'bg-green-500/10 text-green-400 bg-black-500/20 px-2.5 py-0.5 rounded-full text-xs font-normal`}
						>
							{"active"}
						</Badge>
					)}
				</div>

				<div className="p-4 space-y-4">
					<div className="grid grid-cols-3 gap-4">
						<div>
							<p className="text-gray-400 text-xs uppercase mb-1">APR</p>
							<p className="text-blue-400 text-lg font-medium">
								{formattedApr}
							</p>
						</div>
						<div>
							<p className="text-gray-400 text-xs uppercase mb-1">TVL</p>
							<p className="text-white text-lg font-medium">${tvlInMillions}</p>
						</div>
						<div>
							<p className="text-gray-400 text-xs uppercase mb-1">Position</p>
							<p className="text-white text-lg font-medium">
								${formattedPosition}
							</p>
						</div>
					</div>

					<div className="pt-1 flex justify-between items-center">
						<div className="text-xs text-gray-400">via Aerodrome</div>
						<div className="text-xs text-gray-400">Strategy: vAMM</div>
					</div>

					<Button
						className="w-full bg-white hover:bg-gray-100 text-black font-normal py-2 h-auto rounded-full text-sm transition-colors"
						onClick={handleManageClick}
					>
						{positionAmount > 0 ? "Manage" : "Deposit"}
					</Button>
				</div>
			</div>

			<DepositModal
				pool={position.pool}
				position={positionAmount}
				isOpen={isModalOpen}
				onClose={handleModalClose}
				onDeposit={handleDeposit}
				onWithdraw={handleWithdraw}
			/>
		</>
	);
}
