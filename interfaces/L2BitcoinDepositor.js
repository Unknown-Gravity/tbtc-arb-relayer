const L2BitcoinDepositorABI = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          { internalType: "bytes4", name: "version", type: "bytes4" },
          { internalType: "bytes", name: "inputVector", type: "bytes" },
          { internalType: "bytes", name: "outputVector", type: "bytes" },
          { internalType: "bytes4", name: "locktime", type: "bytes4" },
        ],
        indexed: false,
        internalType: "struct IBridgeTypes.BitcoinTxInfo",
        name: "fundingTx",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint32",
            name: "fundingOutputIndex",
            type: "uint32",
          },
          { internalType: "bytes8", name: "blindingFactor", type: "bytes8" },
          {
            internalType: "bytes20",
            name: "walletPubKeyHash",
            type: "bytes20",
          },
          {
            internalType: "bytes20",
            name: "refundPubKeyHash",
            type: "bytes20",
          },
          { internalType: "bytes4", name: "refundLocktime", type: "bytes4" },
          { internalType: "address", name: "vault", type: "address" },
        ],
        indexed: false,
        internalType: "struct IBridgeTypes.DepositRevealInfo",
        name: "reveal",
        type: "tuple",
      },
      {
        indexed: true,
        internalType: "address",
        name: "l2DepositOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "l2Sender",
        type: "address",
      },
    ],
    name: "DepositInitialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint8", name: "version", type: "uint8" },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "_l1BitcoinDepositor", type: "address" },
    ],
    name: "attachL1BitcoinDepositor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_wormholeRelayer", type: "address" },
      { internalType: "address", name: "_l2WormholeGateway", type: "address" },
      { internalType: "uint16", name: "_l1ChainId", type: "uint16" },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "bytes4", name: "version", type: "bytes4" },
          { internalType: "bytes", name: "inputVector", type: "bytes" },
          { internalType: "bytes", name: "outputVector", type: "bytes" },
          { internalType: "bytes4", name: "locktime", type: "bytes4" },
        ],
        internalType: "struct IBridgeTypes.BitcoinTxInfo",
        name: "fundingTx",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint32",
            name: "fundingOutputIndex",
            type: "uint32",
          },
          { internalType: "bytes8", name: "blindingFactor", type: "bytes8" },
          {
            internalType: "bytes20",
            name: "walletPubKeyHash",
            type: "bytes20",
          },
          {
            internalType: "bytes20",
            name: "refundPubKeyHash",
            type: "bytes20",
          },
          { internalType: "bytes4", name: "refundLocktime", type: "bytes4" },
          { internalType: "address", name: "vault", type: "address" },
        ],
        internalType: "struct IBridgeTypes.DepositRevealInfo",
        name: "reveal",
        type: "tuple",
      },
      { internalType: "address", name: "l2DepositOwner", type: "address" },
    ],
    name: "initializeDeposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "l1BitcoinDepositor",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "l1ChainId",
    outputs: [{ internalType: "uint16", name: "", type: "uint16" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "l2WormholeGateway",
    outputs: [
      {
        internalType: "contract IL2WormholeGateway",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes", name: "", type: "bytes" },
      { internalType: "bytes[]", name: "additionalVaas", type: "bytes[]" },
      { internalType: "bytes32", name: "sourceAddress", type: "bytes32" },
      { internalType: "uint16", name: "sourceChain", type: "uint16" },
      { internalType: "bytes32", name: "", type: "bytes32" },
    ],
    name: "receiveWormholeMessages",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "wormholeRelayer",
    outputs: [
      { internalType: "contract IWormholeRelayer", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
];

module.exports = { L2BitcoinDepositorABI };
