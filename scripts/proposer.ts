import hardhat from 'hardhat';
import type { Proposer } from '../typechain-types/contracts/Proposer.ts';

const { ethers} = hardhat;
let proposerAddr: string = '';

function setEvents(proposer: Proposer){
    proposer.on('TransactionSubmitted', (sender: string, recipient: string, value: string, ev: any) => {
        const trxnLog = {
            sender: sender,
            recipient: recipient,
            value: `${ethers.formatEther(value)} ETH`,
            trxnHash: ev.log.transactionHash,
            trxnBlock: ev.log.blockNumber
        }

        console.log('\n\n🟢🟢🟢 Transaction submitted 🟢🟢🟢\n', trxnLog);
    });
}

async function deployContract(validatorAddr: string){
    try {
        const proposer: any = await ethers.deployContract('Proposer', [validatorAddr]);
        await proposer.waitForDeployment();
        
        proposerAddr = await proposer.getAddress();
        setEvents(proposer);

        console.log('✅ Proposer contract deployed');
    } catch (e) {
        if(e instanceof Error){
            console.error(`⚠️  ${e.message}`);
        }else{
            console.error(`⚠️  ${e}`);
        }
    }
}

function proposerExists(){
    return proposerAddr !== '';
}

function viewProposerAddr(){
    if(!proposerExists()){
        console.log('⚠️  Proposer address not found');
        return;
    }

    console.log(`✅ Proposer.address: ${proposerAddr}`);
}

async function viewOwner() {
    try {
        if(!proposerExists()){
            console.log('⚠️  Cannot find owner. Proposer address not found');
            return;
        }

        const proposer = await ethers.getContractAt('Proposer', proposerAddr);
        console.log(`✅ Proposer.owner: ${await proposer.owner()}`);
    } catch (e) {
        if(e instanceof Error){
            console.error(`⚠️  ${e.message}`);
        }else{
            console.error(`⚠️  ${e}`);
        }
    }
}

async function getTrxn(trxnID: string) {
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

        console.log('✅ Transaction found\n', trxn);
    } catch (e) {
        if(e instanceof Error){
            console.error(`⚠️  ${e.message}`);
        }else{
            console.error(`⚠️  ${e}`);
        }
    }
}

async function getTrxnCount() {
    try {
        if(!proposerExists()){
            console.log('⚠️  Cannot get transaction count. Proposer address not found');
            return;
        }

        const proposer = await ethers.getContractAt('Proposer', proposerAddr);
        const count = Number(await proposer.getTransactionCount());

        console.log('Total transactions: ', count);
    } catch (e) {
        if(e instanceof Error){
            console.error(`⚠️  ${e.message}`);
        }else{
            console.error(`⚠️  ${e}`);
        }
    }
}

async function submitTrxn(recipient: string, value: string) {
    try {
        if(!proposerExists()){
            console.log('⚠️  Cannot submit transaction. Proposer address not found');
            return;
        }

        const proposer = await ethers.getContractAt('Proposer', proposerAddr);
        await proposer.submitTransaction(recipient, ethers.parseEther(value));

        console.log('✅ Request received. Please wait for confirmation');
    } catch (e) {
        if(e instanceof Error){
            console.error(`⚠️  ${e.message}`);
        }else{
            console.error(`⚠️  ${e}`);
        }
    }
}

export const ProposerService = {
    deployContract,
    viewProposerAddr,
    viewOwner,
    getTrxn,
    getTrxnCount,
    submitTrxn
};