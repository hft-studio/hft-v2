import { encodeFunctionData } from "viem";

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


export function buildApproveCalls(
    params: {
        tokens: {
            address: string;
            symbol: string;
            decimals: number;
            amount: bigint;
        }[];
        spenderAddress: string;
    },
) {
    try {
        const calls = params.tokens.map((token, index) => {
            return {
                to: token.address as `0x${string}`,
                data: encodeFunctionData({
                    abi: ERC20_ABI,
                    functionName: "approve",
                    args: [params.spenderAddress, token.amount],
                }),
                value: BigInt(0),
            };
        });
        return calls;
    } catch (error) {
        console.error('Error in buildApproveCalls:', error);
        throw error;
    }
}