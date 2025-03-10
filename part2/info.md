For designing a permissioned blockchain for a supply chain network with multiple companies forming a consortium that don’t fully trust each other, selective transaction sharing, and a need for efficiency in consensus and scalability, I’d personally use Hyperledger Fabric as the most suitable framework.

Hyperledger fabric is a permissioned blockchain framework designed for company/enterprise use cases. Unlike Ethereum and Substrate it is modelled towards scenarios where a consortium of people need to collaborate without full trust.

## Why not Ethereum L2?
Although Ethereum is more scalable and had reduced costs compared to Ethereum they are still built on a public blockchain. Due to this selective privacy and role based access will be harder to achieve as consensus(Pos) is still tied to the mainnet.

## Why not Substrate?
More suitable for standalone blockchains and would require a huge effort in development to adapt it to a permissioned blockchain.

## How is consensus handled?
Hyperledger Fabric uses a pluggable consensus model, typically leveraging an ordering service instead of energy-intensive mechanisms like Proof of Work or complex Proof of Stake setups. For this supply chain consortium, I’d choose Raft, a crash-fault-tolerant consensus protocol, as it’s simpler, faster, and sufficient for a permissioned network where nodes are known and trusted to a baseline degree.
Raft algorithm->
1)Execute: Smart contracts execute transactions and propose changes.
2)Order: The ordering service sequences transactions into blocks without re-executing them, ensuring efficiency.
3)Validate: Each consortium member validates transactions based on their own endorsement policies.

## How privacy and selective transaction visibility will be ensured?
Hyperledger fabric has a v secure feature for privacy is its channel architecture. Each channel will be a private net of a blockchain with its own ledger, which can be accessed by the respective consortium member. Also within a channel Fabric supports private data collection which means that for example one Company might share shipment details but keep price details private which only auditors can see.Fabric also uses a Membership Service Provider (MSP) to issue cryptographic identities to all consortium members, ensuring only authorized entities join the network or access specific data.

## What role smart contracts play in your design
In Fabric, smart contracts are implemented as chaincode, written in languages like Go or Node.js.Chaincode runs off-chain on designated nodes, not globally across the network, allowing parallel execution and improving throughput—a key advantage for a consortium with many simultaneous transactions.

## Conclusion
Hyperledger Fabric is the best fit for this supply chain blockchain consortium due to its  privacy, efficient consensus eg Raft, and smartcontract chain code.

