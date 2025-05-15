import { ExploreContent } from './explore-content';
import { Social } from "@/app/components/social";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPools } from './utils';

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)
    console.log(session)
    const pools = await getPools()
    return (
        <div className="relative min-h-screen">
            <ExploreContent pools={pools} />
            <div className="py-10">
                <Social position="relative" className="mt-12 mb-6" />
            </div>
        </div>
    );
} 