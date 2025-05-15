"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import type { poolsTable } from "@/db/schema";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DepositModalProps {
  pool: typeof poolsTable.$inferSelect;
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: string) => void;
}

export function DepositModal({ pool, isOpen, onClose, onDeposit }: DepositModalProps) {
  const [amount, setAmount] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const availableUsdcBalance = "250.00";
  
  const formattedSymbol = pool?.symbol?.replace("vAMM-", "").replace("/", "-");
  
  const formattedApr = `${Number.parseFloat(String(pool?.apr || "0")).toFixed(2)}%`;
  
  const preventSelection = (e: React.MouseEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    const input = e.currentTarget;
    
    setTimeout(() => {
      input.setSelectionRange(input.value.length, input.value.length);
    }, 0);
    
    return false;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and decimals
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };
  
  const handleDeposit = async () => {
    if (!amount || Number.parseFloat(amount) <= 0 || !termsAgreed) return;
    
    setIsLoading(true);
    try {
      await onDeposit(amount);
      onClose();
    } catch (error) {
      console.error("Deposit failed:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddFunds = () => {
    // This would open an onramp service in the future
    window.open("https://onramp.com", "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border border-gray-800 text-white p-0 max-w-md">
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-medium text-center pb-6">
              Deposit to Pool
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center space-y-2 pb-3">
            <div className="text-6xl font-light flex items-baseline relative w-full justify-center">
              <input
                ref={inputRef}
                type="text"
                value={amount}
                onChange={handleInputChange}
                onMouseDown={preventSelection}
                onFocus={preventSelection}
                className="text-white bg-transparent border-none focus:outline-none text-center w-1/2"
                style={{ 
                  fontSize: 'inherit', 
                  fontWeight: 'inherit',
                  userSelect: 'text' 
                }}
              />
              <span className="text-gray-500 text-3xl ml-2">USDC</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center pb-5 text-xs">
            <div className="text-gray-400">
              Available balance: <span className="text-white">{availableUsdcBalance} USDC</span>
            </div>
            <button 
              type="button"
              onClick={handleAddFunds}
              className="text-blue-400 hover:text-blue-300 flex items-center space-x-1"
            >
              <span>Add funds</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <title>External link</title>
                <path d="M7 17l9.2-9.2M17 17V8m0 0H8" />
              </svg>
            </button>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-medium">LP</span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-white">{formattedSymbol}</div>
                <div className="flex justify-between mt-1">
                  <div className="text-xs text-gray-400">APR: {formattedApr}</div>
                  <div className="text-xs text-gray-400">Strategy: vAMM</div>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-400 border-t border-gray-800 pt-3">
              <p>This pool provides liquidity for {formattedSymbol} on Aerodrome via vAMM strategy.</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2 mb-3 bg-gray-900/50 p-3 rounded-lg">
              <input
                type="checkbox"
                id="terms-checkbox"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-600 focus:ring-offset-gray-900"
              />
              <label htmlFor="terms-checkbox" className="text-xs text-gray-300">
                I agree to the <a href="/terms" className="text-blue-400 hover:text-blue-300">Beta User Terms</a> and understand the risks involved.
              </label>
            </div>
            
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-xl text-base font-normal h-auto disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleDeposit}
              disabled={isLoading || !amount || Number.parseFloat(amount) <= 0 || !termsAgreed}
            >
              {isLoading ? "Processing..." : "Deposit"}
            </Button>
            
            <div className="text-xs text-gray-500 text-center mt-4 px-2">
              <p>
                This application is in beta. Users are limited to deposits of up to 1000 USDC during this phase.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}