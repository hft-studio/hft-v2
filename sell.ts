import { sellAsset } from "@/lib/swap";
import { getAccount } from "@/lib/account";
const { smartAccount } = await getAccount('c064667a-bb9f-4e10-afd6-0c2efd1fbfe2');
if (!smartAccount) {
	throw new Error("Smart account not found");
}
const sell = async () => {
    const sellAssetReceipt = await sellAsset({
        smartAccount: smartAccount,
        asset: {
            address: '0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf',
            amount: BigInt(0.00022616 * 10 ** 8).toString(),
        },
    });
}

sell();