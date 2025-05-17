"use client"
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DepositModal } from "./deposit-modal";
import { WithdrawModal } from "./withdraw-modal";
import type { poolsTable } from "@/db/schema";
import { createPosition } from "@/app/actions/create-position";
import { withdrawPosition } from "@/app/actions/withdraw-position";

interface PoolCardProps {
    pool: typeof poolsTable.$inferSelect;
}

export function PoolCard({ pool }: PoolCardProps) {
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const formattedApr = `${Number.parseFloat(String(pool.apr)).toFixed(2)}%`;
    const tvlInMillions = `${(Number.parseFloat(String(pool.tvl)) / 1000000).toFixed(2)}M`;
    const formattedSymbol = pool.symbol.replace("vAMM-", "").replace("/", "-");
    
    const handleDepositClick = () => {
        setIsDepositModalOpen(true);
    };
    
    const handleDepositModalClose = () => {
        setIsDepositModalOpen(false);
    };
    
    const handleDeposit = async (amount: string) => {
        console.log('deposit', amount);
        await createPosition(pool.id, Number.parseFloat(amount));
        setIsDepositModalOpen(false);
    };

    const handleWithdraw = async () => {
        await withdrawPosition(pool.id);
        setIsWithdrawModalOpen(false);
    };

    const handleWithdrawClick = () => {
        setIsWithdrawModalOpen(true);
    };

    const handleWithdrawModalClose = () => {
        setIsWithdrawModalOpen(false);
    };
    
    return (
        <>
            <div className="bg-black border border-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition duration-300">
                <div className="p-4 flex justify-between items-center border-b border-gray-800/40">
                    <div className="flex items-center space-x-3">
                        <div>
                            <h3 className="text-base font-medium text-white">{formattedSymbol}</h3>
                        </div>
                    </div>
                    <Badge className={`'bg-gray-800 text-gray-300' px-2.5 py-0.5 rounded-full text-xs font-normal`}>
                        {'base'}
                    </Badge>
                </div>

                <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-400 text-xs uppercase mb-1">APR</p>
                            <p className="text-blue-400 text-lg font-medium">{formattedApr}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs uppercase mb-1">TVL</p>
                            <p className="text-white text-lg font-medium">${tvlInMillions}</p>
                        </div>
                    </div>

                    <div className="pt-1 flex justify-between items-center">
                        <div className="text-xs text-gray-400">via Aerodrome</div>
                        <div className="text-xs text-gray-400">Strategy: vAMM</div>
                    </div>
                    
                    <Button
                        className="w-full bg-white hover:bg-gray-100 text-black font-normal py-2 h-auto rounded-full text-sm transition-colors"
                        onClick={handleDepositClick}
                    >
                        Deposit
                    </Button>
                    <Button
                        className="w-full bg-white hover:bg-gray-100 text-black font-normal py-2 h-auto rounded-full text-sm transition-colors"
                        onClick={handleWithdrawClick}
                    >
                        Withdraw
                    </Button>
                </div>
            </div>
            
            <DepositModal 
                pool={pool}
                isOpen={isDepositModalOpen}
                onClose={handleDepositModalClose}
                onDeposit={handleDeposit}
            />
            <WithdrawModal
                pool={pool}
                isOpen={isWithdrawModalOpen}
                onClose={handleWithdrawModalClose}
                onWithdraw={handleWithdraw}
            />
        </>
    );
} 