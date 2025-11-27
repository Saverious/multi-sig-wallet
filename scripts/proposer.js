import hardhat from 'hardhat';

const { ethers} = hardhat;
let proposerAddr = null;

export async function deployContract(validatorAddr){
    try {
        const proposer = await ethers.deployContract('Proposer', [validatorAddr]);
        await proposer.waitForDeployment();

        proposerAddr = await proposer.getAddress();

        console.log('Proposer contract deployed ✅');
    } catch (e) {
        console.error(`⚠️  ${e.message}`);
    }
}

function proposerExists(){
    return proposerAddr !== null && proposerAddr !== '';
}

export function viewProposerAddr(){
    if(!proposerExists()){
        console.log('⚠️  Proposer address not found');
        return;
    }

    console.log(`✅ Proposer.address: ${proposerAddr}`);
}

export async function viewOwner() {
    try {
        if(!proposerExists()){
            console.log('⚠️  Cannot find owner. Proposer address not found');
            return;
        }

        const proposer = await ethers.getContractAt('Proposer', proposerAddr);
        console.log(`✅ Proposer.owner: ${await proposer.owner()}`);
    } catch (e) {
        console.error(`⚠️  ${e.message}`);
    }
}

export async function getTrxn(trxnID) {
    try {
        if(!proposerExists()){
            console.log('⚠️  Cannot get transaction. Proposer address not found');
            return;
        }

        const proposer = await ethers.getContractAt('Proposer', proposerAddr);
        let [txExists, tx] = await proposer.getTransaction(trxnID);

        if(!txExists){
            console.log(`⚠️  Transaction ${trxnID} not found`);
            return;
        }

        const trxn =  {
            sender: tx.sender,
            recipient: tx.recipient,
            value: `${ethers.formatEther(tx.value)} ETH`,
            data: tx.data,
            executed: tx.executed,
            numOfConfirmations: Number(tx.numOfConfirmations)
        };

        console.log('Transaction found ✅\n', trxn);
    } catch (e) {
        console.error(`⚠️  ${e.message}`);
    }
}

export async function getTrxnCount() {
    try {
        if(!proposerExists()){
            console.log('⚠️  Cannot get transaction count. Proposer address not found');
            return;
        }

        const proposer = await ethers.getContractAt('Proposer', proposerAddr);
        const count = Number(await proposer.getTransactionCount());

        console.log('Total transactions: ', count);
    } catch (e) {
        console.error(`⚠️  ${e.message}`);
    }
}

export async function submitTrxn(recipient, value) {
    try {
        if(!proposerExists()){
            console.log('⚠️  Cannot submit transaction. Proposer address not found');
            return;
        }

        const proposer = await ethers.getContractAt('Proposer', proposerAddr);
        await proposer.submitTransaction(recipient, ethers.parseEther(value));

        console.log('Transaction submitted ✅');
    } catch (e) {
        console.error(`⚠️  ${e.message}`);
    }
}