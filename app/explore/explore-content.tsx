"use client"
import { Header } from '@/components/layout/header';
import { ContentContainer } from '@/components/layout/content-container';
import { PoolCard } from './pool-card';
import { Navbar } from '@/app/components/navbar';
import type { getPools } from './utils';

export function ExploreContent(
    { pools }: { pools: Awaited<ReturnType<typeof getPools>> }
) {
    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <ContentContainer>
                <Header title="Investment Dashboard" description="Manage your DeFi strategies and positions" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {   pools
                        .map(pool => (
                            <PoolCard 
                                key={pool.address} 
                                pool={pool} 
                            />
                        ))}
                </div>
            </ContentContainer>
        </div>
    );
}

