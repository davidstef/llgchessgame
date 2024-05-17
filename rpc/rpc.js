const ethers = require("ethers");
const TOKEN_ABI = require("../abi/token-abi.json");

// This should be addded to your local .env file
const RPC_URI = process.env.RPC_URI || "https://bsc-mainnet.nodereal.io/v1/64a9df0874fb4a93b9d0a3849de012d3";
const rpcProvider = new ethers.JsonRpcProvider(RPC_URI);

function createContract(address) {
	try {
		let contract = new ethers.Contract(address, TOKEN_ABI, rpcProvider);
	    return contract;
  	} catch (error) {
		console.error(`Create contract error! Address: ${address}`);
  	}
}

async function getTokenInfo(address) {
	try {
		const contract = createContract(address);
		
		if (!contract) {
			throw new Error('Is contract error...');
		}
	
		const name = await contract.name();
		const balanceOf = await contract.balanceOf(address);
		const totalAmountOfTokensHeld = await contract.totalAmountOfTokensHeld();
		const calculateRewardCycleExtension = await contract.calculateRewardCycleExtension(balanceOf, totalAmountOfTokensHeld)
	
		return {
			tokenName: name,
			calculateRewardCycleExtension: calculateRewardCycleExtension.toString()
		};
	} catch (error) {
        throw new Error('Error getting token info: ' + error);
    }
}

module.exports = {
	getTokenInfo
}