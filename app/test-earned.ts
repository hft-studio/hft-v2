import { calculateTotalEarnedInUSD } from "./api/workflows/claim-rewards/utils";

const test = async () => {
	const { totalEarned, earningsArray } = await calculateTotalEarnedInUSD(
		"0x0000000000000000000000000000000000000000",
	);
	console.log(totalEarned, earningsArray);
};

test();