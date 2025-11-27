import hardhat from 'hardhat';

const { ethers } = hardhat;

let validatorAddr = null;

export async function deployContract(validators, quota) {
    try {
        const validator = await ethers.deployContract('Validator', [validators, quota]);
        await validator.waitForDeployment();

        validatorAddr = await validator.getAddress();

        console.log('Validator contract deployed ✅');
    } catch (e) {
        console.error(`⚠️  ${e.message}`);
    }
}

function validatorExists(){
    return validatorAddr !== null && validatorAddr !== '';
}

export function viewValidatorAddr(){
    if(!validatorExists()){
        console.log('⚠️  Validator address not found');
        return;
    }

    console.log(`✅ Validator.address: ${validatorAddr}`);
}

export async function viewOwner() {
    try {
        if(!validatorExists()){
            console.log('⚠️  Cannot find owner. Validator address not found');
            return;
        }

        const validator = await ethers.getContractAt('Validator', validatorAddr);
        console.log(`✅ Validator.owner: ${await validator.owner()}`);
    } catch (e) {
        console.log('*** ❗ viewContractOwner ***\n', e.message);
    }
}

export async function getTrxn(trxnID) {
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

        console.log('Transaction found ✅\n', trxn);
    } catch (e) {
        console.error(`⚠️  ${e.message}`);
    }
}

export async function getTrxnCount() {
    try {
        if(!validatorExists()){
            console.log('⚠️  Cannot get transaction count. Validator address not found');
            return;
        }

        const validator = await ethers.getContractAt('Validator', validatorAddr);
        const count = Number(await validator.getTransactionsCount());

        console.log('✅ Total transactions: ', count);
    } catch (e) {
        console.error(`⚠️  ${e.message}`);
    }
}

export async function confirmTrxn(trxnID, signerID) {
    try {
        if(!validatorExists()){
            console.log('⚠️  Cannot confirm transaction. Validator address not found');
            return;
        }

        const signer = (await ethers.getSigners())[signerID];
        const validator = await ethers.getContractAt('Validator', validatorAddr, signer);
        await validator.confirmTransaction(trxnID);

        console.log('Transaction confirmed ✅');
    } catch (e) {
        console.error(`⚠️  ${e.message}`);
    }
}

export async function executeTrxn(trxnID, signerID) {
    try {
        if(!validatorExists()){
            console.log('⚠️  Cannot execute transaction. Validator address not found');
            return;
        }

        const signer = (await ethers.getSigners())[signerID];
        const validator = await ethers.getContractAt('Validator', validatorAddr, signer)
        await validator.executeTransaction(trxnID);

        console.log('Transaction executed ✅');
    } catch (e) {
        console.error(`⚠️  ${e.message}`);
    }
}