export const APP_ID = "app-001";
export const APP_NAME = "BaseQuest";
export const CONTRACT_ADDRESS = "0x3035E8B39a5bBd98AE71E29672C6e0D47E121e59";
export const CHAIN_ID = 8453;

export const baseQuestAbi = [
  {
    inputs: [],
    name: "questCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "quests",
    outputs: [
      { internalType: "bytes32", name: "content", type: "bytes32" },
      { internalType: "address", name: "creator", type: "address" },
      { internalType: "uint96", name: "reward", type: "uint96" },
      { internalType: "bool", name: "active", type: "bool" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_id", type: "uint256" }],
    name: "getSubmissions",
    outputs: [
      {
        components: [
          { internalType: "address", name: "user", type: "address" },
          { internalType: "bytes32", name: "proof", type: "bytes32" },
          { internalType: "bool", name: "accepted", type: "bool" }
        ],
        internalType: "struct BaseQuest.Submission[]",
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "bytes32", name: "_content", type: "bytes32" },
      { internalType: "uint96", name: "_reward", type: "uint96" }
    ],
    name: "createQuest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "_id", type: "uint256" },
      { internalType: "bytes32", name: "_proof", type: "bytes32" }
    ],
    name: "submit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "_id", type: "uint256" },
      { internalType: "uint256", name: "_submissionIndex", type: "uint256" }
    ],
    name: "accept",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_id", type: "uint256" }],
    name: "closeQuest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];
