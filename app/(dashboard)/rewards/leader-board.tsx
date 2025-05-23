
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const leaderboard = [
	{ rank: 1, username: "crypto_whale", rewards: 5842.67 },
	{ rank: 2, username: "trader_pro", rewards: 4721.39 },
	{ rank: 3, username: "blockmaster", rewards: 3968.14 },
	{ rank: 4, username: "satoshi_fan", rewards: 3542.91 },
	{ rank: 5, username: "hodl_king", rewards: 3127.45 },
	{ rank: 6, username: "crypto_guru", rewards: 2845.78 },
	{ rank: 7, username: "defi_master", rewards: 2634.19 },
	{ rank: 8, username: "you", rewards: 2458.32 },
	{ rank: 9, username: "eth_lover", rewards: 2312.67 },
	{ rank: 10, username: "btc_maximalist", rewards: 2187.93 },
];


export const LeaderBoard = () => {
	return (
		<div className="rounded-xl overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead>Rank</TableHead>
                            <TableHead>Username</TableHead>
                            <TableHead>Rewards</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leaderboard.map((user, index) => (
                            
                            <TableRow
                                key={user.username}
                                className="hover:bg-muted/50"
                            >
                                <TableCell>{user.rank}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.rewards}</TableCell>
                               
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>            
        </div>
	);
};
