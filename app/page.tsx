import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAccount } from "@/lib/account";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const {owner, smartAccount} = await getAccount(session?.user!.id!);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {owner?.address}
      {smartAccount?.address}
    </div>
  );
}
