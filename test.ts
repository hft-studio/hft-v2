import { ethers } from "ethers";

const receipt = {
	userOpHash:
		"0xadb85f261d0d89c4d0265d052804599965efaf5a483f485145680b2a0d3058ef",
	entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
	sender: "0x7fe9A7DE2466475C3389f2cCBd056D822594DE5D",
	nonce: "0x1a4",
	paymaster: "0x0000000000000000000000000000000000000000",
	actualGasCost: 882118887045n,
	actualGasUsed: 321915n,
	success: true,
	reason: "",
	logs: [
		{
			address: "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789",
			topics: [Array],
			data: "0x0000000000000000000000000000000000000000000000000000011aa4dd88c4",
			blockHash:
				"0xb1ca6296101233e318dc0ab58ee3504a5fe1bb766f07340e100265aa4d89bdd8",
			blockNumber: 30327649n,
			transactionHash:
				"0x5c268bd5ce05c1efe55206d103a8a726a1593d41cda3a1c3e06e0b8c287a32da",
			transactionIndex: 192,
			logIndex: 679,
			removed: false,
		},
		{
			address: "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789",
			topics: [Array],
			data: "0x",
			blockHash:
				"0xb1ca6296101233e318dc0ab58ee3504a5fe1bb766f07340e100265aa4d89bdd8",
			blockNumber: 30327649n,
			transactionHash:
				"0x5c268bd5ce05c1efe55206d103a8a726a1593d41cda3a1c3e06e0b8c287a32da",
			transactionIndex: 192,
			logIndex: 680,
			removed: false,
		},
		{
			address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
			topics: [Array],
			data: "0x000000000000000000000000000000000000000000000000000000000007a120",
			blockHash:
				"0xb1ca6296101233e318dc0ab58ee3504a5fe1bb766f07340e100265aa4d89bdd8",
			blockNumber: 30327649n,
			transactionHash:
				"0x5c268bd5ce05c1efe55206d103a8a726a1593d41cda3a1c3e06e0b8c287a32da",
			transactionIndex: 192,
			logIndex: 681,
			removed: false,
		},
		{
			address: "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf",
			topics: [Array],
			data: "0x00000000000000000000000000000000000000000000000000000000000001e5",
			blockHash:
				"0xb1ca6296101233e318dc0ab58ee3504a5fe1bb766f07340e100265aa4d89bdd8",
			blockNumber: 30327649n,
			transactionHash:
				"0x5c268bd5ce05c1efe55206d103a8a726a1593d41cda3a1c3e06e0b8c287a32da",
			transactionIndex: 192,
			logIndex: 682,
			removed: false,
		},
		{
			address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
			topics: [Array],
			data: "0x000000000000000000000000000000000000000000000000000000000007a120",
			blockHash:
				"0xb1ca6296101233e318dc0ab58ee3504a5fe1bb766f07340e100265aa4d89bdd8",
			blockNumber: 30327649n,
			transactionHash:
				"0x5c268bd5ce05c1efe55206d103a8a726a1593d41cda3a1c3e06e0b8c287a32da",
			transactionIndex: 192,
			logIndex: 683,
			removed: false,
		},
		{
			address: "0xfbb6eed8e7aa03b138556eedaf5d271a5e1e43ef",
			topics: [Array],
			data: "0x000000000000000000000000000000000000000000000000000000000007a120fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe1b000000000000000000000000000000000000000007fa264912489b322ba030570000000000000000000000000000000000000000000000000000032c7af88df0fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffef100",
			blockHash:
				"0xb1ca6296101233e318dc0ab58ee3504a5fe1bb766f07340e100265aa4d89bdd8",
			blockNumber: 30327649n,
			transactionHash:
				"0x5c268bd5ce05c1efe55206d103a8a726a1593d41cda3a1c3e06e0b8c287a32da",
			transactionIndex: 192,
			logIndex: 684,
			removed: false,
		},
		{
			address: "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789",
			topics: [Array],
			data: "0x00000000000000000000000000000000000000000000000000000000000001a40000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000cd62620685000000000000000000000000000000000000000000000000000000000004e97b",
			blockHash:
				"0xb1ca6296101233e318dc0ab58ee3504a5fe1bb766f07340e100265aa4d89bdd8",
			blockNumber: 30327649n,
			transactionHash:
				"0x5c268bd5ce05c1efe55206d103a8a726a1593d41cda3a1c3e06e0b8c287a32da",
			transactionIndex: 192,
			logIndex: 685,
			removed: false,
		},
	],
	receipt: {
		type: "eip1559",
		status: "success",
		cumulativeGasUsed: 50108770n,
		logs: [
			[Object],
			[Object],
			[Object],
			[Object],
			[Object],
			[Object],
			[Object],
		],
		logsBloom:
			"0x000000000000000000000000000080000000000000000000000000000080000000080000000000000002000100001004001000000000200000000204002400000000000000000008000000080000000000000000000800000000000000002200008080000a0000000000000000000800000000020000000000000010000a00000000000000000000000000000000000000000000000000000003000000100000020000000000000000400000000000000000000000000000000002000000000040000802000000000001000000000000000000000000000000000000000820000050080000000000000000000000048000000000000000000000000000000000",
		transactionHash:
			"0x5c268bd5ce05c1efe55206d103a8a726a1593d41cda3a1c3e06e0b8c287a32da",
		transactionIndex: 192,
		blockHash:
			"0xb1ca6296101233e318dc0ab58ee3504a5fe1bb766f07340e100265aa4d89bdd8",
		blockNumber: 30327649n,
		gasUsed: 215333n,
		effectiveGasPrice: 2240223n,
		from: "0xbdbebd58cc8153ce74530bb342427579315915b2",
		to: "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789",
		contractAddress: null,
	},
};

interface TransactionReceipt {
	logs: Array<{
		address: string;
		data: string;
		topics: unknown[];
		blockHash?: string;
		blockNumber?: number | bigint;
		transactionHash?: string;
		transactionIndex?: number;
		logIndex?: number;
		removed?: boolean;
	}>;
	userOpHash?: string;
	entryPoint?: string;
	sender?: string;
	nonce?: string;
	paymaster?: string;
	actualGasCost?: bigint | string;
	actualGasUsed?: bigint | string;
	success?: boolean;
	reason?: string;
	receipt?: Record<string, unknown>;
}

async function getTokenAmountFromReceipt(
	receipt: TransactionReceipt,
	tokenAddress: string,
	decimals: number
) {
	console.log("receipt", receipt);
	console.log("tokenAddress", tokenAddress);
	console.log("decimals", decimals);

	if (!ethers.utils.isAddress(tokenAddress)) {
		throw new Error("Invalid token address");
	}
	if (!Number.isInteger(decimals) || decimals < 0) {
		throw new Error("Invalid decimals: Must be a non-negative integer");
	}

	const tokenAddrLower = tokenAddress.toLowerCase();

	for (const log of receipt.logs) {
		if (log.address.toLowerCase() === tokenAddrLower) {
			if (log.data && log.data !== "0x") {
				const amount = ethers.BigNumber.from(log.data);
				const amountReadable = ethers.utils.formatUnits(amount, decimals);
				return Number.parseFloat(amountReadable);
			}
		}
	}

	return 0;
}

const amount = await getTokenAmountFromReceipt(
	receipt,
	"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
	6,
);
console.log("amount", amount);
