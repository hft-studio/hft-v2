export const ADD_LIQUIDITY_ABI = [{
    "inputs": [
        { "name": "tokenA", "type": "address" },
        { "name": "tokenB", "type": "address" },
        { "name": "stable", "type": "bool" },
        { "name": "amountADesired", "type": "uint256" },
        { "name": "amountBDesired", "type": "uint256" },
        { "name": "amountAMin", "type": "uint256" },
        { "name": "amountBMin", "type": "uint256" },
        { "name": "to", "type": "address" },
        { "name": "deadline", "type": "uint256" }
    ],
    "name": "addLiquidity",
    "outputs": [
        { "name": "amountA", "type": "uint256" },
        { "name": "amountB", "type": "uint256" },
        { "name": "liquidity", "type": "uint256" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
}] as const;


export const REMOVE_LIQUIDITY_ABI = [{
    inputs: [
        { name: "tokenA", type: "address" },
        { name: "tokenB", type: "address" },
        { name: "stable", type: "bool" },
        { name: "liquidity", type: "uint256" },
        { name: "amountAMin", type: "uint256" },
        { name: "amountBMin", type: "uint256" },
        { name: "to", type: "address" },
        { name: "deadline", type: "uint256" }
    ],
    name: "removeLiquidity",
    outputs: [
        { name: "amountA", type: "uint256" },
        { name: "amountB", type: "uint256" }
    ],
    stateMutability: "nonpayable",
    type: "function"
}] as const;

export const GAUGE_DEPOSIT_ABI = [{
    inputs: [{ name: "amount", type: "uint256" }],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
}] as const;

export const ERC20_ABI = [
    {
        inputs: [
            { name: "spender", type: "address" },
            { name: "amount", type: "uint256" }
        ],
        name: "approve",
        outputs: [{ name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function"
    }
];

export interface TransactionReceipt {
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
	nonce?: string | bigint;
	userOpHash?: string;
	entryPoint?: string;
	sender?: string;
	actualGasCost?: string | bigint;
	actualGasUsed?: string | bigint;
	success?: boolean;
	reason?: string;
	receipt?: Record<string, unknown>;
}