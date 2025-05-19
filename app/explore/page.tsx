import { ExploreContent } from './explore-content';
import { Social } from "@/app/components/social";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPositions } from '@/lib/positions';
import { getAccount } from '@/lib/account';
import { getUsdcAvailable } from './utils';

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)
    const {owner, smartAccount} = await getAccount(session?.user?.id as string);
	const positions = await getPositions(
		smartAccount?.address as `0x${string}`,
	);
    const usdcAvailable = await getUsdcAvailable(smartAccount?.address as `0x${string}`);
    console.log('usdcAvailable', usdcAvailable);
    return (
        <div className="relative min-h-screen">
            <ExploreContent positions={positions} usdcAvailable={usdcAvailable} />
            <div className="py-10">
                <Social position="relative" className="mt-12 mb-6" />
            </div>
        </div>
    );
} 