import { Card } from "@/components/ui/card";
import { LeaderBoard } from "./leader-board";

export const RewardsContent = () => {
	const rewardsData = [
		{
			name: "Total HFT Rewards",
			value: "1,458.32 HFT",
			percentage: "84.22%",
			total: "/ 2,000 HFT",
		},
		{
			name: "Leaderboard Position",
			value: "8",
			percentage: "Top 24%",
			total: "/ 1M",
		},
		{
			name: "Daily Average",
			value: "7.22 HFT",
			percentage: "0 s",
			total: "/ 1h",
		},
	];

	const dailyRewards = [
		{ date: "Apr 25", incoming: 1.2, outgoing: 4.8 },
		{ date: "Apr 26", incoming: 1.5, outgoing: 7.1 },
		{ date: "Apr 27", incoming: 1.3, outgoing: 3.7 },
		{ date: "Apr 28", incoming: 0.9, outgoing: 1.8 },
		{ date: "Apr 29", incoming: 1.4, outgoing: 3.0 },
		{ date: "Apr 30", incoming: 1.2, outgoing: 5.2 },
		{ date: "May 1", incoming: 1.1, outgoing: 4.3 },
		{ date: "May 2", incoming: 0.8, outgoing: 3.5 },
		{ date: "May 3", incoming: 1.0, outgoing: 2.3 },
		{ date: "May 4", incoming: 1.3, outgoing: 5.4 },
		{ date: "May 5", incoming: 0.9, outgoing: 2.1 },
		{ date: "May 6", incoming: 1.2, outgoing: 4.7 },
		{ date: "May 7", incoming: 0.7, outgoing: 1.2 },
		{ date: "May 8", incoming: 0.8, outgoing: 1.3 },
		{ date: "May 9", incoming: 0.9, outgoing: 1.5 },
		{ date: "May 10", incoming: 1.0, outgoing: 1.8 },
		{ date: "May 11", incoming: 1.1, outgoing: 2.3 },
		{ date: "May 12", incoming: 1.0, outgoing: 2.1 },
		{ date: "May 13", incoming: 0.8, outgoing: 1.7 },
		{ date: "May 14", incoming: 0.7, outgoing: 1.2 },
		{ date: "May 15", incoming: 1.2, outgoing: 2.0 },
		{ date: "May 16", incoming: 0.9, outgoing: 1.5 },
		{ date: "May 17", incoming: 0.8, outgoing: 1.3 },
		{ date: "May 18", incoming: 1.0, outgoing: 2.1 },
		{ date: "May 19", incoming: 1.1, outgoing: 3.2 },
		{ date: "May 20", incoming: 0.9, outgoing: 1.8 },
	];

	const totalIncoming = dailyRewards
		.reduce((sum, day) => sum + day.incoming, 0)
		.toFixed(2);
	const totalOutgoing = dailyRewards
		.reduce((sum, day) => sum + day.outgoing, 0)
		.toFixed(2);
	const incomingPercentage = (
		(Number.parseFloat(totalIncoming) /
			(Number.parseFloat(totalIncoming) + Number.parseFloat(totalOutgoing))) *
		100
	).toFixed(1);
	const outgoingPercentage = (
		(Number.parseFloat(totalOutgoing) /
			(Number.parseFloat(totalIncoming) + Number.parseFloat(totalOutgoing))) *
		100
	).toFixed(1);

	return (
		<div className="flex flex-col min-h-screen bg-black text-white">
			<div className="p-6 space-y-6">
				<h1 className="text-2xl font-medium">Rewards Overview</h1>
				<p className="text-sm text-gray-400">
					Your rewards are distributed based on your platform usage. Beta
					testers will have the opportunity to earn up to 1/3 of the total HFT
					supply.
				</p>

				{/* Overview Section */}
				<Card className="bg-black border-[#222222] rounded-lg overflow-hidden">
					<div className="divide-y divide-[#222222]">
						{rewardsData.map((item, index) => (
							<div
								key={item.name}
								className="grid grid-cols-2 divide-x divide-[#222222]"
							>
								<div className="p-4 flex items-center gap-3">
									<div className="w-5 h-5 rounded-full border-2 border-[#5AA1E3] flex-shrink-0" />
									<span>{item.name}</span>
								</div>
								<div className="p-4 text-right">
									<span className="mr-2">{item.value}</span>
									<span className="text-gray-500">{item.total}</span>
								</div>
							</div>
						))}
					</div>
				</Card>

				<h1 className="text-2xl font-medium">Leaderboard</h1>
				<LeaderBoard />
			</div>
		</div>
	);
};
