export const IdleGameABI = [
    {
        "inputs": [{ "internalType": "uint256", "name": "_score", "type": "uint256" }],
        "name": "submitScore",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getLeaderboard",
        "outputs": [
            { "internalType": "address[]", "name": "", "type": "address[]" },
            { "internalType": "uint256[]", "name": "", "type": "uint256[]" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "submissionFee",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "player", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "newScore", "type": "uint256" },
            { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
        ],
        "name": "ScoreSubmitted",
        "type": "event"
    }
] as const;
