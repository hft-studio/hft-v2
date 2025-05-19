import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAccount } from "@/lib/account";
import { getPositions } from "@/lib/positions";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  const {owner, smartAccount} = await getAccount(session.user.id);
	const positions = await getPositions(
		smartAccount?.address as `0x${string}`,
	);
	console.log(positions);
	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			{owner?.address}
			{smartAccount?.address}
		</div>
	);
}
