import hardhat from 'hardhat';
import type { Validator } from '../typechain-types/contracts/Validator.ts';

const { ethers } = hardhat;

let validatorAddr: string = '';

function setEvents(validator: Validator){
    validator.on('TransactionSubmitted', (sender: string, recipient: string, value: bigint, ev: any) => {
        const trxnLog = {
            sender: sender,
            recipient: recipient,
            value: `${ethers.formatEther(value)} ETH`,
            trxnHash: ev.log.transactionHash,
            trxnBlock: ev.log.blockNumber
        }

        console.log('\n\n🟢🟢🟢 Transaction submitted 🟢🟢🟢\n', trxnLog);
    });

    validator.on('TransactionConfirmed', (trxnID: string, ev: any) => {
        const trxnLog = {
            trxnID: trxnID,
            trxnHash: ev.log.transactionHash,
            trxnBlock: ev.log.blockNumber
        }

        console.log(`\n🟢🟢🟢 Transaction ${trxnID} confirmed 🟢🟢🟢\n${trxnLog}`);
    });
    
    validator.on('TransactionExecuted', (trxnID: string, ev: any) => {
        const trxnLog = {
            trxnID: trxnID,
            trxnHash: ev.log.transactionHash,
            trxnBlock: ev.log.blockNumber
        }

        console.log(`\n🟢🟢🟢 Transaction ${trxnID} executed 🟢🟢🟢\n${trxnLog}`);
    });
}

async function deployContract(validators: string[], quota: string) {
    try {
        const validator: any = await ethers.deployContract('Validator', [validators, quota]);
        await validator.waitForDeployment();

        setEvents(validator);

        validatorAddr = await validator.getAddress();

        console.log('✅ Validator contract deployed');
    } catch (e) {
        if(e instanceof Error){
            console.error(`⚠️  ${e.message}`);
        }else{
            console.error(`⚠️  ${e}`);
        }
    }
}

function validatorExists(){
    return validatorAddr !== '';
}

function viewValidatorAddr(){
    if(!validatorExists()){
        console.log('⚠️  Validator address not found');
        return;
    }

    console.log(`✅ Validator.address: ${validatorAddr}`);
}

async function viewOwner() {
    try {
        if(!validatorExists()){
            console.log('⚠️  Cannot find owner. Validator address not found');
            return;
        }

        const validator = await ethers.getContractAt('Validator', validatorAddr);
        console.log(`✅ Validator.owner: ${await validator.owner()}`);
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
        if(!validatorExists()){
            console.log('⚠️  Cannot get transaction. Validator address not found');
            return;
        }

        const validator = await ethers.getContractAt('Validator', validatorAddr);
        let [txExists, tx] = await validator.getTransaction(trxnID);

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
        if(!validatorExists()){
            console.log('⚠️  Cannot get transaction count. Validator address not found');
            return;
        }

        const validator = await ethers.getContractAt('Validator', validatorAddr);
        const count = Number(await validator.getTransactionsCount());

        console.log('✅ Total transactions: ', count);
    }catch(e){
        if(e instanceof Error){
            console.error(`⚠️  ${e.message}`);
        }else{
            console.error(`⚠️  ${e}`);
        }
    }
}

async function confirmTrxn(trxnID: string, signerID: number) {
    try {
        if(!validatorExists()){
            console.log('⚠️  Cannot confirm transaction. Validator address not found');
            return;
        }

        const signer = (await ethers.getSigners())[signerID];
        const validator = await ethers.getContractAt('Validator', validatorAddr, signer);
        await validator.confirmTransaction(trxnID);

        console.log('✅ Transaction confirmed');
    } catch (e) {
        if(e instanceof Error){
            console.error(`⚠️  ${e.message}`);
        }else{
            console.error(`⚠️  ${e}`);
        }
    }
}

async function executeTrxn(trxnID: string, signerID: number) {
    try {
        if(!validatorExists()){
            console.log('⚠️  Cannot execute transaction. Validator address not found');
            return;
        }

        const signer = (await ethers.getSigners())[signerID];
        const validator = await ethers.getContractAt('Validator', validatorAddr, signer)
        await validator.executeTransaction(trxnID);

        console.log('✅ Transaction executed');
    }catch(e){
        if(e instanceof Error){
            console.error(`⚠️  ${e.message}`);
        }else{
            console.error(`⚠️  ${e}`);
        }
    }
}

export const ValidatorService = {
    deployContract,
    viewValidatorAddr,
    viewOwner,
    getTrxn,
    getTrxnCount,
    confirmTrxn,
    executeTrxn
};