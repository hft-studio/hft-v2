"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { poolsTable } from "@/db/schema";
import { Slider } from "@/components/ui/slider";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DepositModalProps {
  pool: typeof poolsTable.$inferSelect;
  position?: number;
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: string) => void;
  onWithdraw: () => Promise<void>;
}

// Shortcut button data
const depositShortcuts = [
  { label: "25", value: "25" },
  { label: "50", value: "50" },
  { label: "100", value: "100" },
  { label: "MAX", value: "250" },
];

const withdrawShortcuts = [
  { label: "25%", value: 25 },
  { label: "50%", value: 50 },
  { label: "75%", value: 75 },
  { label: "MAX", value: 100 },
];

export function DepositModal({ 
  pool, 
  position = 0, 
  isOpen, 
  onClose, 
  onDeposit, 
  onWithdraw 
}: DepositModalProps) {
  const [depositAmount, setDepositAmount] = useState("0");
  const [withdrawPercent, setWithdrawPercent] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(position > 0 ? "withdraw" : "deposit");
  const inputRef = useRef<HTMLInputElement>(null);
  
  const availableUsdcBalance = 250.00;
  const positionAmount = position || 0;
  const formattedPosition = positionAmount.toFixed(2);
  
  const withdrawAmount = (positionAmount * (withdrawPercent / 100)).toFixed(2);
  
  const formattedSymbol = pool?.symbol?.replace("vAMM-", "").replace("/", "-");
  const formattedApr = `${Number.parseFloat(String(pool?.apr || "0")).toFixed(2)}%`;

  // Reset values when modal is opened
  useEffect(() => {
    if (isOpen) {
      setDepositAmount("0");
      setWithdrawPercent(100);
    }
  }, [isOpen]);
  
  // Handle deposit amount changes from the slider
  const handleDepositSliderChange = (value: number[]) => {
    setDepositAmount(value[0].toString());
  };

  // Handle deposit amount changes from the input
  const handleDepositInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      const numValue = Number.parseFloat(value || "0");
      // Clamp value to available balance
      if (numValue <= availableUsdcBalance) {
        setDepositAmount(value);
      }
    }
  };
  
  // Handle withdraw percent changes
  const handleWithdrawSliderChange = (value: number[]) => {
    setWithdrawPercent(value[0]);
  };
  
  // Handle deposit shortcuts
  const handleDepositShortcut = (value: string) => {
    setDepositAmount(value);
  };
  
  // Handle withdraw shortcuts
  const handleWithdrawShortcut = (value: number) => {
    setWithdrawPercent(value);
  };
  
  const handleDeposit = async () => {
    if (!depositAmount || Number.parseFloat(depositAmount) <= 0 || !termsAgreed) return;
    
    setIsLoading(true);
    try {
      await onDeposit(depositAmount);
      onClose();
    } catch (error) {
      console.error("Deposit failed:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleWithdraw = async () => {
    if (withdrawPercent <= 0) return;
    
    setIsLoading(true);
    try {
      await onWithdraw();
      onClose();
    } catch (error) {
      console.error("Withdraw failed:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddFunds = () => {
    window.open("https://onramp.com", "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border border-gray-800 text-white p-0 max-w-md">
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-medium text-center">
              Manage Position
            </DialogTitle>

          </DialogHeader>
          
          <Tabs 
            defaultValue={activeTab} 
            onValueChange={setActiveTab}
            className="mt-5"
          >
            <div className="relative border border-gray-800 rounded-xl overflow-hidden mb-8">
              <TabsList className="flex w-full bg-gray-900 border-b border-gray-800">
                <TabsTrigger 
                  value="deposit" 
                  className="flex-1 py-3.5 px-4 text-sm font-medium data-[state=active]:text-white data-[state=inactive]:text-gray-400 data-[state=active]:bg-black data-[state=inactive]:bg-gray-900 relative transition-all duration-200 ease-in-out"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <title>Deposit icon</title>
                      <path d="M12 19V5M5 12l7-7 7 7" />
                    </svg>
                    <span>Deposit</span>
                  </div>
                  {activeTab === 'deposit' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
                </TabsTrigger>
                <TabsTrigger 
                  value="withdraw" 
                  className="flex-1 py-3.5 px-4 text-sm font-medium data-[state=active]:text-white data-[state=inactive]:text-gray-400 data-[state=active]:bg-black data-[state=inactive]:bg-gray-900 relative transition-all duration-200 ease-in-out"
                  disabled={position <= 0}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <title>Withdraw icon</title>
                      <path d="M12 5v14M5 12l7 7 7-7" />
                    </svg>
                    <span>Withdraw</span>
                  </div>
                  {activeTab === 'withdraw' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
                </TabsTrigger>
              </TabsList>
            
              <TabsContent value="deposit" className="p-4 focus-visible:outline-none focus-visible:ring-0">
                {/* Amount display */}
                <div className="flex flex-col items-center space-y-2 pb-3">
                  <div className="text-6xl font-light flex items-baseline relative w-full justify-center">
                    <input
                      ref={inputRef}
                      type="text"
                      value={depositAmount}
                      onChange={handleDepositInputChange}
                      className="text-white bg-transparent border-none focus:outline-none text-center w-1/2"
                      style={{ 
                        fontSize: 'inherit', 
                        fontWeight: 'inherit'
                      }}
                    />
                    <span className="text-gray-500 text-3xl ml-2">USDC</span>
                  </div>
                </div>
                
                {/* Slider */}
                <div className="py-4">
                  <Slider 
                    defaultValue={[0]} 
                    value={[Number.parseFloat(depositAmount) || 0]}
                    max={availableUsdcBalance} 
                    step={1}
                    onValueChange={handleDepositSliderChange}
                    className="my-4"
                  />
                  
                  {/* Shortcuts */}
                  <div className="flex justify-between gap-2 mt-4">
                    {depositShortcuts.map((shortcut) => (
                      <button
                        key={shortcut.label}
                        type="button"
                        className="flex-1 px-2 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm font-medium transition-colors"
                        onClick={() => handleDepositShortcut(shortcut.value)}
                      >
                        {shortcut.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center pb-5 text-xs">
                  <div className="text-gray-400">
                    Available balance: <span className="text-white">{availableUsdcBalance.toFixed(2)} USDC</span>
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
              </TabsContent>
              
              <TabsContent value="withdraw" className="p-4 focus-visible:outline-none focus-visible:ring-0">
                {/* Percentage display */}
                <div className="flex flex-col items-center space-y-2 pb-3">
                  <div className="text-6xl font-light flex items-baseline relative w-full justify-center">
                    <span className="text-white">{withdrawPercent}%</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    ≈ <span className="text-white">{withdrawAmount}</span> USDC
                  </div>
                </div>
                
                {/* Slider */}
                <div className="py-4">
                  <Slider 
                    defaultValue={[100]} 
                    value={[withdrawPercent]}
                    max={100} 
                    step={1}
                    onValueChange={handleWithdrawSliderChange}
                    className="my-4"
                  />
                  
                  {/* Shortcuts */}
                  <div className="flex justify-between gap-2 mt-4">
                    {withdrawShortcuts.map((shortcut) => (
                      <button
                        key={shortcut.label}
                        type="button"
                        className="flex-1 px-2 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm font-medium transition-colors"
                        onClick={() => handleWithdrawShortcut(shortcut.value)}
                      >
                        {shortcut.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center pb-5 text-xs">
                  <div className="text-gray-400">
                    Current position: <span className="text-white">{formattedPosition} USDC</span>
                  </div>
                </div>
              </TabsContent>
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
              
              {positionAmount > 0 && (
                <div className="bg-blue-900/30 rounded-md p-3 mb-3 flex items-center justify-between">
                  <div className="text-sm text-gray-300">Your position</div>
                  <div className="text-sm font-medium text-white">~${formattedPosition}</div>
                </div>
              )}
              
              <div className="text-xs text-gray-400 border-t border-gray-800 pt-3">
                <p>This pool provides liquidity for {formattedSymbol} on Aerodrome via vAMM strategy.</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="h-[52px]">
                {activeTab === 'deposit' && (
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
                )}
              </div>
              
              {activeTab === 'deposit' ? (
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-xl text-base font-medium h-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleDeposit}
                  disabled={isLoading || Number.parseFloat(depositAmount) <= 0 || !termsAgreed}
                >
                  {isLoading ? "Processing..." : "Deposit"}
                </Button>
              ) : (
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-xl text-base font-medium h-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleWithdraw}
                  disabled={isLoading || withdrawPercent <= 0 || position <= 0}
                >
                  {isLoading ? "Processing..." : `Withdraw ${withdrawPercent}%`}
                </Button>
              )}
              
              <div className="text-xs text-gray-500 text-center mt-4 px-2">
                <p>
                  This application is in beta. Users are limited to deposits of up to 1000 USDC during this phase.
                </p>
              </div>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}