"use client"
import { Header } from '@/components/layout/header';
import { ContentContainer } from '@/components/layout/content-container';
import { PoolCard } from './pool-card';
import { Navbar } from '@/app/components/navbar';
import type { getPositions } from '@/lib/positions';

export function ExploreContent(
    { positions, usdcAvailable }: { 
        positions: Awaited<ReturnType<typeof getPositions>>,
        usdcAvailable?: string 
    }
) {
    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar usdcAvailable={usdcAvailable} />
            <ContentContainer>
                <Header title="Investment Dashboard" description="Manage your DeFi strategies and positions" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {   positions
                        .map(position => (
                            <PoolCard 
                                key={position.pool.address} 
                                position={position} 
                            />
                        ))}
                </div>
            </ContentContainer>
        </div>
    );
}

