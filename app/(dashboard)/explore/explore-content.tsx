"use client"
import { ContentContainer } from '@/components/layout/content-container';
import { PoolCard } from './pool-card';
import { Navbar } from '@/app/components/navbar';
import type { getPositions } from '@/lib/positions';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

export function ExploreContent(
    { positions, usdcAvailable, smartAccountAddress, userId, name }: { 
        positions: Awaited<ReturnType<typeof getPositions>>,
        usdcAvailable?: string,
        smartAccountAddress: string,
        userId: string,
        name: string,
    }
) {
    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar usdcAvailable={usdcAvailable} smartAccountAddress={smartAccountAddress} userId={userId} name={name} />
            <ContentContainer>
                {/* <Header title="Investment Dashboard" description="Manage your DeFi strategies and positions" /> */}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {   positions
                        .map(position => (
                            <PoolCard 
                                key={position.pool.address} 
                                position={position} 
                                userAddress={smartAccountAddress}
                                usdcAvailable={Number.parseFloat(usdcAvailable as string)}
                            />
                        ))}
                </div>
            </ContentContainer>
        </div>
    );
}

