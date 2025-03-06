import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import metamask_icon from '../metamask-icon.png'
import error_icon from '../warning-icon.png'


// const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractAddress = "0x51E9C98c8f8ce7ee948D008FC92a94ea260b5b66";

const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "symbol",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "initialSupply",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "AccessControlBadConfirmation",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"internalType": "bytes32",
				"name": "neededRole",
				"type": "bytes32"
			}
		],
		"name": "AccessControlUnauthorizedAccount",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "allowance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientAllowance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientBalance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSpender",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "burn",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "grantMinterRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "grantRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "mint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "callerConfirmation",
				"type": "address"
			}
		],
		"name": "renounceRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "revokeMinterRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "revokeRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "previousAdminRole",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "newAdminRole",
				"type": "bytes32"
			}
		],
		"name": "RoleAdminChanged",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "RoleGranted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "RoleRevoked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "TokensBurned",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "TokensMinted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "DEFAULT_ADMIN_ROLE",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			}
		],
		"name": "getRoleAdmin",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "role",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "hasRole",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "MINTER_ROLE",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];



/// /////////
// export default function TokenDApp() {
// 	const [provider, setProvider] = useState(null);
// 	const [signer, setSigner] = useState(null);
// 	const [contract, setContract] = useState(null);
// 	const [account, setAccount] = useState(null);
// 	const [balance, setBalance] = useState("0");
// 	const [recipient, setRecipient] = useState("");
// 	const [amount, setAmount] = useState("0");
// 	const [transactions, setTransactions] = useState([]);
// 	const [error, setError] = useState("");
// 	const [connectionError, setConnectionError] = useState(false);
// 	const [isLoading, setIsLoading] = useState(false);
// 	const [isClaimLoading, setIsClaimLoading] = useState(false);
	
// 	const shortenAddress = (address) => {
// 	  if (!address) return '';
// 	  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
// 	};
  
// 	useEffect(() => {
// 	  if (window.ethereum) {
// 		const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
// 		setProvider(web3Provider);
// 	  }
// 	}, []);
  
// 	const connectWallet = async () => {
// 	  try {
// 		if (!provider) throw new Error("No provider found");
// 		await window.ethereum.request({ method: "eth_requestAccounts" });
// 		const web3Signer = provider.getSigner();
// 		const userAddress = await web3Signer.getAddress();
// 		setSigner(web3Signer);
// 		setAccount(userAddress);
// 		const tokenContract = new ethers.Contract(contractAddress, contractABI, web3Signer);
// 		setContract(tokenContract);
// 		fetchBalance(userAddress, tokenContract);
// 		setConnectionError(false);
// 	  } catch (err) {
// 		setConnectionError(true);
// 		setError("Failed to connect wallet: " + err.message);
// 	  }
// 	};
  
// 	const fetchBalance = async (userAddress, tokenContract) => {
// 	  try {
// 		const balance = await tokenContract.balanceOf(userAddress);
// 		setBalance(ethers.utils.formatEther(balance));
// 	  } catch (err) {
// 		setError("Error fetching balance: " + err.message);
// 	  }
// 	};
  
// 	const sendTokens = async () => {
// 	  if (!contract) return;
// 	  setIsLoading(true);
// 	  setError("");
	  
// 	  try {
// 		if (!ethers.utils.isAddress(recipient)) {
// 		  throw new Error("Invalid recipient address");
// 		}
  
// 		const senderBalance = await contract.balanceOf(account);
// 		const transferAmount = ethers.utils.parseEther(amount);
  
// 		if (senderBalance.lt(transferAmount)) {
// 		  throw new Error("Insufficient token balance");
// 		}
  
// 		const tx = await contract.transfer(recipient, transferAmount, { gasLimit: 100000 });
		
// 		// Add transaction to list immediately with pending status
// 		const pendingTx = {
// 		  hash: tx.hash,
// 		  from: account,
// 		  to: recipient,
// 		  value: amount,
// 		  status: 'pending'
// 		};
		
// 		setTransactions(prev => [pendingTx, ...prev]);
		
// 		// Wait for transaction to be mined
// 		const receipt = await tx.wait();
		
// 		// Update transaction status
// 		setTransactions(prev => 
// 		  prev.map(t => 
// 			t.hash === tx.hash 
// 			  ? {...t, status: 'confirmed'} 
// 			  : t
// 		  )
// 		);
		
// 		fetchBalance(account, contract);
// 		setRecipient("");
// 		setAmount("0");
// 	  } catch (err) {
// 		setError("Transaction failed: " + (err.reason || err.message));
// 	  } finally {
// 		setIsLoading(false);
// 	  }
// 	};
  
// 	const claimAirdrop = async () => {
// 	  if (!contract) return;
// 	  setIsClaimLoading(true);
// 	  setError("");
	  
// 	  try {
// 		const tx = await contract.mint(account, ethers.utils.parseEther("10"), { gasLimit: 100000 });
		
// 		// Add transaction to list immediately with pending status
// 		const pendingTx = {
// 		  hash: tx.hash,
// 		  from: contractAddress, // The contract is the sender for minting
// 		  to: account,
// 		  value: "10",
// 		  status: 'pending'
// 		};
		
// 		setTransactions(prev => [pendingTx, ...prev]);
		
// 		// Wait for transaction to be mined
// 		const receipt = await tx.wait();
		
// 		// Update transaction status
// 		setTransactions(prev => 
// 		  prev.map(t => 
// 			t.hash === tx.hash 
// 			  ? {...t, status: 'confirmed'} 
// 			  : t
// 		  )
// 		);
		
// 		fetchBalance(account, contract);
// 	  } catch (err) {
// 		setError("Airdrop claim failed: " + (err.reason || err.message));
// 	  } finally {
// 		setIsClaimLoading(false);
// 	  }
// 	};
  
// 	// Set up event listeners when contract is available
// 	useEffect(() => {
// 	  if (!contract || !account) return;
	  
// 	  // Clean up previous listeners to avoid duplicates
// 	  const cleanupListeners = () => {
// 		if (contract.listenerCount('Transfer') > 0) {
// 		  contract.removeAllListeners('Transfer');
// 		}
// 	  };
	  
// 	  // Set up new listeners
// 	  const setupListeners = () => {
// 		// Listen for transfers to the current account (receiving)
// 		contract.on('Transfer', (from, to, value, event) => {
// 		  if (to.toLowerCase() === account.toLowerCase() && from.toLowerCase() !== account.toLowerCase()) {
// 			const txData = {
// 			  hash: event.transactionHash,
// 			  from: from,
// 			  to: to,
// 			  value: ethers.utils.formatEther(value),
// 			  status: 'confirmed'
// 			};
			
// 			setTransactions(prev => {
// 			  // Check if this transaction is already in the list
// 			  const exists = prev.some(tx => tx.hash === event.transactionHash);
// 			  if (!exists) {
// 				return [txData, ...prev];
// 			  }
// 			  return prev;
// 			});
			
// 			fetchBalance(account, contract);
// 		  }
// 		});
// 	  };
	  
// 	  cleanupListeners();
// 	  setupListeners();
	  
// 	  // Fetch past events to populate transaction history
// 	  const fetchPastEvents = async () => {
// 		try {
// 		  // Get the current block number
// 		  const currentBlock = await provider.getBlockNumber();
// 		  // Look back 1000 blocks or to block 0, whichever is greater
// 		  const fromBlock = Math.max(0, currentBlock - 1000);
		  
// 		  // Create a filter for Transfer events involving the current account
// 		  const sentFilter = contract.filters.Transfer(account);
// 		  const receivedFilter = contract.filters.Transfer(null, account);
		  
// 		  // Query for past events
// 		  const sentEvents = await contract.queryFilter(sentFilter, fromBlock);
// 		  const receivedEvents = await contract.queryFilter(receivedFilter, fromBlock);
		  
// 		  // Combine and process events
// 		  const allEvents = [...sentEvents, ...receivedEvents];
		  
// 		  // Sort by block number (descending)
// 		  allEvents.sort((a, b) => b.blockNumber - a.blockNumber);
		  
// 		  // Convert to transaction objects
// 		  const pastTransactions = await Promise.all(
// 			allEvents.map(async (event) => {
// 			  const { from, to, value } = event.args;
// 			  return {
// 				hash: event.transactionHash,
// 				from,
// 				to,
// 				value: ethers.utils.formatEther(value),
// 				status: 'confirmed'
// 			  };
// 			})
// 		  );
		  
// 		  // Update transactions state
// 		  setTransactions(pastTransactions);
// 		} catch (error) {
// 		  console.error("Error fetching past events:", error);
// 		}
// 	  };
	  
// 	  fetchPastEvents();
	  
// 	  // Cleanup function
// 	  return () => {
// 		cleanupListeners();
// 	  };
// 	}, [contract, account, provider]);
  
// 	// Update UI for transaction status
// 	const getTransactionStatusUI = (status) => {
// 	  if (status === 'pending') {
// 		return <span className="transaction-status pending">Pending</span>;
// 	  } else if (status === 'confirmed') {
// 		return <span className="transaction-status confirmed">Confirmed</span>;
// 	  }
// 	  return null;
// 	};
  
// 	return (
// 	  <div className="overallContainer">
// 		<div className="overallContainer_box">
// 		  {/* Header Section */}
// 		  <header className="overallContainer_box_header-section">
// 			<h2 className="overallContainer_box_header">ERC-20 Token dApp</h2>
			
// 			{/* Connection Status Display */}
// 			{connectionError ? (
// 			  <div className="overallContainer_box_error-banner">
// 				<img
// 				  className="overallContainer_box_error-icon"
// 				  src={error_icon}
// 				  alt="Error"
// 				/>
// 				<p className="overallContainer_box_error-text">{error}</p>
// 				<img
// 				  className="overallContainer_box_metamask-icon"
// 				  src={metamask_icon}
// 				  alt="MetaMask"
// 				/>
// 			  </div>
// 			) : account ? (
// 			  <div className="overallContainer_box_connection-status">
// 				<p className="overallContainer_box_connected-text">
// 				  Connected as: <span className="address-text">{shortenAddress(account)}</span>
// 				</p>
// 				<div className="overallContainer_box_balance-display">
// 				  Balance: <span className="font-bold">{balance} Tokens</span>
// 				</div>
// 			  </div>
// 			) : (
// 			  <button
// 				onClick={connectWallet}
// 				className="overallContainer_box_connect-button"
// 			  >
// 				<img src={metamask_icon} alt="MetaMask" className="button-icon" />
// 				Connect to MetaMask
// 			  </button>
// 			)}
// 		  </header>
  
// 		  {/* Transaction Error Display (non-connection errors) */}
// 		  {error && !connectionError && (
// 			<div className="overallContainer_box_transaction-error">
// 			  <img src={error_icon} alt="Error" className="small-icon" />
// 			  <p>{error}</p>
// 			</div>
// 		  )}
  
// 		  {/* Main Content */}
// 		  {!connectionError && account && (
// 			<div className="overallContainer_box_content">
// 			  {/* Transaction Form */}
// 			  <form 
// 				className="overallContainer_box_transaction-form"
// 				onSubmit={(e) => {
// 				  e.preventDefault();
// 				  sendTokens();
// 				}}
// 			  >
// 				<div className="overallContainer_box_content_inputs">
// 				  <div className="input-group">
// 					<label htmlFor="recipient-address">Recipient Address</label>
// 					<input
// 					  id="recipient-address"
// 					  type="text"
// 					  placeholder="0x..."
// 					  value={recipient}
// 					  onChange={(e) => setRecipient(e.target.value)}
// 					  className="overallContainer_box_content_input_address"
// 					/>
// 				  </div>
				  
// 				  <div className="input-group">
// 					<label htmlFor="token-amount">Amount</label>
// 					<input
// 					  id="token-amount"
// 					  type="number"
// 					  min="0"
// 					  step="0.01"
// 					  placeholder="0.00"
// 					  value={amount}
// 					  onChange={(e) => setAmount(e.target.value)}
// 					  className="overallContainer_box_content_input_amount"
// 					/>
// 				  </div>
// 				</div>
  
// 				{/* Action Buttons */}
// 				<div className="overallContainer_box_content_buttons">
// 				  <button
// 					type="submit"
// 					disabled={!recipient || !amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0 || isLoading}
// 					className="overallContainer_box_content_button_send"
// 				  >
// 					{isLoading ? 'Sending...' : 'Send Tokens'}
// 				  </button>
				  
// 				  <button
// 					type="button"
// 					onClick={claimAirdrop}
// 					disabled={isClaimLoading}
// 					className="overallContainer_box_content_button_airdrop"
// 				  >
// 					{isClaimLoading ? 'Claiming...' : 'Claim Airdrop'}
// 				  </button>
// 				</div>
// 			  </form>
  
// 			  {/* Recent Transactions Section */}
// 			  <section className="overallContainer_box_transactions-section">
// 				<h3 className="overallContainer_box_content_transactions_title">
// 				  Recent Transactions
// 				</h3>
				
// 				<div className="overallContainer_box_content_transactions_list">
// 				  {transactions.length > 0 ? (
// 					transactions.map((tx, index) => (
// 					  <div key={tx.hash || `tx-${index}`} className="overallContainer_box_content_transaction_item">
// 						<div className="transaction-details">
// 						  <span className="transaction-from">{shortenAddress(tx.from)}</span>
// 						  <span className="transaction-arrow">➝</span>
// 						  <span className="transaction-to">{shortenAddress(tx.to)}</span>
// 						  {getTransactionStatusUI(tx.status)}
// 						</div>
// 						<div className="transaction-value">{tx.value} Tokens</div>
// 						{tx.hash && (
// 						  <a 
// 							href={`https://etherscan.io/tx/${tx.hash}`} 
// 							target="_blank" 
// 							rel="noopener noreferrer"
// 							className="transaction-link"
// 						  >
// 							View
// 						  </a>
// 						)}
// 					  </div>
// 					))
// 				  ) : (
// 					<p className="overallContainer_box_content_transaction_empty">
// 					  No transactions yet.
// 					</p>
// 				  )}
// 				</div>
// 			  </section>
// 			</div>
// 		  )}
// 		</div>
// 	  </div>
// 	);

// }
export default function TokenDApp() {
	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [contract, setContract] = useState(null);
	const [account, setAccount] = useState(null);
	const [balance, setBalance] = useState("0");
	const [recipient, setRecipient] = useState("");
	const [amount, setAmount] = useState("0");
	const [transactions, setTransactions] = useState([]);
	const [error, setError] = useState("");
	const [connectionError, setConnectionError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isClaimLoading, setIsClaimLoading] = useState(false);
	const [airdropAvailable, setAirdropAvailable] = useState(false);
	const [airdropAmount, setAirdropAmount] = useState("0");
	const [lastClaimTime, setLastClaimTime] = useState(0);
	const [timeRemaining, setTimeRemaining] = useState(0);
	
	const shortenAddress = (address) => {
	  if (!address) return '';
	  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
	};
  
	useEffect(() => {
	  if (window.ethereum) {
		const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
		setProvider(web3Provider);
	  }
	}, []);
  
	// Airdrop timer functionality
	useEffect(() => {
	  if (!account) return;
	  
	  // Generate random airdrop amount between 1 and 20 tokens
	  const generateAirdrop = () => {
		const randomAmount = (1 + Math.random() * 19).toFixed(2);
		setAirdropAmount(randomAmount);
		setAirdropAvailable(true);
		
		// Auto-hide airdrop after 10 seconds if not claimed
		const hideTimeout = setTimeout(() => {
		  if (airdropAvailable) {
			setAirdropAvailable(false);
		  }
		}, 10000);
		
		return () => clearTimeout(hideTimeout);
	  };
	  
	  // Set up interval for airdrop availability
	  const airdropInterval = setInterval(() => {
		const now = Date.now();
		const timeSinceLastClaim = now - lastClaimTime;
		
		// Only show new airdrop if it's been at least 5 seconds since last claim
		if (timeSinceLastClaim >= 5000) {
		  generateAirdrop();
		} else {
		  // Update time remaining
		  setTimeRemaining(Math.ceil((5000 - timeSinceLastClaim) / 1000));
		}
	  }, 5000);
	  
	  // Countdown timer for next airdrop
	  const countdownInterval = setInterval(() => {
		const now = Date.now();
		const timeSinceLastClaim = now - lastClaimTime;
		
		if (timeSinceLastClaim < 5000) {
		  setTimeRemaining(Math.ceil((5000 - timeSinceLastClaim) / 1000));
		}
	  }, 1000);
	  
	  return () => {
		clearInterval(airdropInterval);
		clearInterval(countdownInterval);
	  };
	}, [account, lastClaimTime, airdropAvailable]);
  
	const connectWallet = async () => {
	  try {
		if (!provider) throw new Error("No provider found");
		await window.ethereum.request({ method: "eth_requestAccounts" });
		const web3Signer = provider.getSigner();
		const userAddress = await web3Signer.getAddress();
		setSigner(web3Signer);
		setAccount(userAddress);
		const tokenContract = new ethers.Contract(contractAddress, contractABI, web3Signer);
		setContract(tokenContract);
		fetchBalance(userAddress, tokenContract);
		setConnectionError(false);
	  } catch (err) {
		setConnectionError(true);
		setError("Failed to connect wallet: " + err.message);
	  }
	};
  
	const fetchBalance = async (userAddress, tokenContract) => {
	  try {
		const balance = await tokenContract.balanceOf(userAddress);
		setBalance(ethers.utils.formatEther(balance));
	  } catch (err) {
		setError("Error fetching balance: " + err.message);
	  }
	};
  
	const sendTokens = async () => {
	  if (!contract) return;
	  setIsLoading(true);
	  setError("");
	  
	  try {
		if (!ethers.utils.isAddress(recipient)) {
		  throw new Error("Invalid recipient address");
		}
  
		const senderBalance = await contract.balanceOf(account);
		const transferAmount = ethers.utils.parseEther(amount);
  
		if (senderBalance.lt(transferAmount)) {
		  throw new Error("Insufficient token balance");
		}
  
		const tx = await contract.transfer(recipient, transferAmount, { gasLimit: 100000 });
		
		// Add transaction to list immediately with pending status
		const pendingTx = {
		  hash: tx.hash,
		  from: account,
		  to: recipient,
		  value: amount,
		  status: 'pending'
		};
		
		setTransactions(prev => [pendingTx, ...prev]);
		
		// Wait for transaction to be mined
		const receipt = await tx.wait();
		
		// Update transaction status
		setTransactions(prev => 
		  prev.map(t => 
			t.hash === tx.hash 
			  ? {...t, status: 'confirmed'} 
			  : t
		  )
		);
		
		fetchBalance(account, contract);
		setRecipient("");
		setAmount("0");
	  } catch (err) {
		setError("Transaction failed: " + (err.reason || err.message));
	  } finally {
		setIsLoading(false);
	  }
	};
  
	const claimAirdrop = async () => {
	  if (!contract || !airdropAvailable) return;
	  setIsClaimLoading(true);
	  setError("");
	  
	  try {
		// Convert airdropAmount to wei
		const airdropAmountWei = ethers.utils.parseEther(airdropAmount);
		
		const tx = await contract.mint(account, airdropAmountWei, { gasLimit: 100000 });
		
		// Add transaction to list immediately with pending status
		const pendingTx = {
		  hash: tx.hash,
		  from: contractAddress, // The contract is the sender for minting
		  to: account,
		  value: airdropAmount,
		  status: 'pending'
		};
		
		setTransactions(prev => [pendingTx, ...prev]);
		
		// Wait for transaction to be mined
		const receipt = await tx.wait();
		
		// Update transaction status
		setTransactions(prev => 
		  prev.map(t => 
			t.hash === tx.hash 
			  ? {...t, status: 'confirmed'} 
			  : t
		  )
		);
		
		// Update state after successful claim
		setAirdropAvailable(false);
		setLastClaimTime(Date.now());
		setTimeRemaining(5);
		fetchBalance(account, contract);
	  } catch (err) {
		setError("Airdrop claim failed: " + (err.reason || err.message));
	  } finally {
		setIsClaimLoading(false);
	  }
	};
  
	// Set up event listeners when contract is available
	useEffect(() => {
	  if (!contract || !account) return;
	  
	  // Clean up previous listeners to avoid duplicates
	  const cleanupListeners = () => {
		if (contract.listenerCount('Transfer') > 0) {
		  contract.removeAllListeners('Transfer');
		}
	  };
	  
	  // Set up new listeners
	  const setupListeners = () => {
		// Listen for transfers to the current account (receiving)
		contract.on('Transfer', (from, to, value, event) => {
		  if (to.toLowerCase() === account.toLowerCase() && from.toLowerCase() !== account.toLowerCase()) {
			const txData = {
			  hash: event.transactionHash,
			  from: from,
			  to: to,
			  value: ethers.utils.formatEther(value),
			  status: 'confirmed'
			};
			
			setTransactions(prev => {
			  // Check if this transaction is already in the list
			  const exists = prev.some(tx => tx.hash === event.transactionHash);
			  if (!exists) {
				return [txData, ...prev];
			  }
			  return prev;
			});
			
			fetchBalance(account, contract);
		  }
		});
	  };
	  
	  cleanupListeners();
	  setupListeners();
	  
	  // Fetch past events to populate transaction history
	  const fetchPastEvents = async () => {
		try {
		  // Get the current block number
		  const currentBlock = await provider.getBlockNumber();
		  // Look back 1000 blocks or to block 0, whichever is greater
		  const fromBlock = Math.max(0, currentBlock - 1000);
		  
		  // Create a filter for Transfer events involving the current account
		  const sentFilter = contract.filters.Transfer(account);
		  const receivedFilter = contract.filters.Transfer(null, account);
		  
		  // Query for past events
		  const sentEvents = await contract.queryFilter(sentFilter, fromBlock);
		  const receivedEvents = await contract.queryFilter(receivedFilter, fromBlock);
		  
		  // Combine and process events
		  const allEvents = [...sentEvents, ...receivedEvents];
		  
		  // Sort by block number (descending)
		  allEvents.sort((a, b) => b.blockNumber - a.blockNumber);
		  
		  // Convert to transaction objects
		  const pastTransactions = await Promise.all(
			allEvents.map(async (event) => {
			  const { from, to, value } = event.args;
			  return {
				hash: event.transactionHash,
				from,
				to,
				value: ethers.utils.formatEther(value),
				status: 'confirmed'
			  };
			})
		  );
		  
		  // Update transactions state
		  setTransactions(pastTransactions);
		} catch (error) {
		  console.error("Error fetching past events:", error);
		}
	  };
	  
	  fetchPastEvents();
	  
	  // Cleanup function
	  return () => {
		cleanupListeners();
	  };
	}, [contract, account, provider]);
  
	// Update UI for transaction status
	const getTransactionStatusUI = (status) => {
	  if (status === 'pending') {
		return <span className="transaction-status pending">Pending</span>;
	  } else if (status === 'confirmed') {
		return <span className="transaction-status confirmed">Confirmed</span>;
	  }
	  return null;
	};
  
	return (
	  <div className="overallContainer">
		<div className="overallContainer_box">
		  {/* Header Section */}
		  <header className="overallContainer_box_header-section">
			<h2 className="overallContainer_box_header">ERC-20 Token dApp</h2>
			
			{/* Connection Status Display */}
			{connectionError ? (
			  <div className="overallContainer_box_error-banner">
				<img
				  className="overallContainer_box_error-icon"
				  src={error_icon}
				  alt="Error"
				/>
				<p className="overallContainer_box_error-text">{error}</p>
				<img
				  className="overallContainer_box_metamask-icon"
				  src={metamask_icon}
				  alt="MetaMask"
				/>
			  </div>
			) : account ? (
			  <div className="overallContainer_box_connection-status">
				<p className="overallContainer_box_connected-text">
				  Connected as: <span className="address-text">{shortenAddress(account)}</span>
				</p>
				<div className="overallContainer_box_balance-display">
				  Balance: <span className="font-bold">{balance} Tokens</span>
				</div>
			  </div>
			) : (
			  <button
				onClick={connectWallet}
				className="overallContainer_box_connect-button"
			  >
				<img src={metamask_icon} alt="MetaMask" className="button-icon" />
				Connect to MetaMask
			  </button>
			)}
		  </header>
  
		  {/* Transaction Error Display (non-connection errors) */}
		  {error && !connectionError && (
			<div className="overallContainer_box_transaction-error">
			  <img src={error_icon} alt="Error" className="small-icon" />
			  <p>{error}</p>
			</div>
		  )}
  
		  {/* Main Content */}
		  {!connectionError && account && (
			<div className="overallContainer_box_content">
			  {/* Airdrop Section */}
			  <div className="airdrop-section">
				{airdropAvailable ? (
				  <div className="airdrop-available">
					<div className="airdrop-notification">
					  <span className="airdrop-icon">🎁</span>
					  <span className="airdrop-text">
						Random airdrop of <strong>{airdropAmount} Tokens</strong> available!
					  </span>
					</div>
					<button
					  onClick={claimAirdrop}
					  disabled={isClaimLoading}
					  className="overallContainer_box_content_button_airdrop airdrop-claim-button"
					>
					  {isClaimLoading ? 'Claiming...' : 'Claim Now!'}
					</button>
				  </div>
				) : (
				  <div className="airdrop-countdown">
					<span className="airdrop-icon">⏱️</span>
					<span className="airdrop-text">
					  Next random airdrop in: <strong>{timeRemaining}</strong> seconds
					</span>
				  </div>
				)}
			  </div>
  
			  {/* Transaction Form */}
			  <form 
				className="overallContainer_box_transaction-form"
				onSubmit={(e) => {
				  e.preventDefault();
				  sendTokens();
				}}
			  >
				<div className="overallContainer_box_content_inputs">
				  <div className="input-group">
					<label htmlFor="recipient-address">Recipient Address</label>
					<input
					  id="recipient-address"
					  type="text"
					  placeholder="0x..."
					  value={recipient}
					  onChange={(e) => setRecipient(e.target.value)}
					  className="overallContainer_box_content_input_address"
					/>
				  </div>
				  
				  <div className="input-group">
					<label htmlFor="token-amount">Amount</label>
					<input
					  id="token-amount"
					  type="number"
					  min="0"
					  step="0.01"
					  placeholder="0.00"
					  value={amount}
					  onChange={(e) => setAmount(e.target.value)}
					  className="overallContainer_box_content_input_amount"
					/>
				  </div>
				</div>
  
				{/* Send Button */}
				<div className="overallContainer_box_content_buttons send-button-container">
				  <button
					type="submit"
					disabled={!recipient || !amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0 || isLoading}
					className="overallContainer_box_content_button_send"
				  >
					{isLoading ? 'Sending...' : 'Send Tokens'}
				  </button>
				</div>
			  </form>
  
			  {/* Recent Transactions Section */}
			  <section className="overallContainer_box_transactions-section">
				<h3 className="overallContainer_box_content_transactions_title">
				  Recent Transactions
				</h3>
				
				<div className="overallContainer_box_content_transactions_list">
				  {transactions.length > 0 ? (
					transactions.map((tx, index) => (
					  <div key={tx.hash || `tx-${index}`} className="overallContainer_box_content_transaction_item">
						<div className="transaction-details">
						  <span className="transaction-from">{shortenAddress(tx.from)}</span>
						  <span className="transaction-arrow">➝</span>
						  <span className="transaction-to">{shortenAddress(tx.to)}</span>
						  {getTransactionStatusUI(tx.status)}
						</div>
						<div className="transaction-value">{tx.value} Tokens</div>
						{tx.hash && (
						  <a 
							href={`https://etherscan.io/tx/${tx.hash}`} 
							target="_blank" 
							rel="noopener noreferrer"
							className="transaction-link"
						  >
							View
						  </a>
						)}
					  </div>
					))
				  ) : (
					<p className="overallContainer_box_content_transaction_empty">
					  No transactions yet.
					</p>
				  )}
				</div>
			  </section>
			</div>
		  )}
		</div>
	  </div>
	);
  }
  