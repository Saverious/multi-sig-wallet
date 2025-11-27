import { isAddress } from 'ethers';

import { deployContract, viewOwner, getTrxn, getTrxnCount, submitTrxn, viewProposerAddr } from './proposer.js';
import { deployContract as deployVal, viewOwner as viewValOwner, getTrxn as getTrxnVal, getTrxnCount as getTrxnCountVal, confirmTrxn, executeTrxn, viewValidatorAddr } from './validator.js';


export async function proposerOptions(rl, index) {
    switch(index) {
        case '1': {
            let addr = await rl.question('💬 Validator address: ');

            if(!isAddress(addr)){
                console.log('🚫 Invalid address');
                return;
            }

            await deployContract(addr);
            break;
        }

        case '2':
            await viewOwner();
            break;

        case '3': {
            let trxnID = await rl.question('💬 Transaction ID: ');
            trxnID = Number.parseInt(trxnID);

            if(Number.isNaN(trxnID)){
                console.log('🚫 Invalid transaction ID');
                return;
            }

            await getTrxn(trxnID);
            break;
        }

        case '4':
            await getTrxnCount();
            break;

        case '5': {
            let recipient = await rl.question('💬 Recipient address: ');

            if(!isAddress(recipient)){
                console.log('🚫 Invalid address');
                return;
            }

            let amount = await rl.question('💬 Amount to send: ');
            await submitTrxn(recipient, amount);
            break;
        }

        case '6':
            viewProposerAddr();
            break;

        default:
            break;
    }
}

export async function validatorOptions(rl, index) {
    switch(index) {
        case '1': {
            let validators = await rl.question('💬 Validator addresses: ');
            const addresses = validators.split(',');

            for(const addr of addresses){
                if(!isAddress(addr)){
                    console.log(`🚫 Address ${addr} is invalid`);
                    return;
                }
            }

            let quota = await rl.question('💬 Validators quota: ');
            quota = Number.parseInt(quota);

            if(Number.isNaN(quota)){
                console.log('🚫 Invalid quota');
                return;
            }

            await deployVal(addresses, quota);
            break;
        }

        case '2':
            await viewValOwner();
            break;

        case '3': {
            let trxnID = await rl.question('💬 Enter transaction ID: ');
            trxnID = Number.parseInt(trxnID);

            if(Number.isNaN(trxnID)){
                console.log('🚫 Invalid transaction ID');
                break;
            }

            await getTrxnVal(trxnID);
            break;
        }

        case '4':
            await getTrxnCountVal();
            break;

        case '5': {
            let trxnID = await rl.question('💬 Enter transaction ID: ');
            trxnID = Number.parseInt(trxnID);

            if(Number.isNaN(trxnID)){
                console.log('🚫 Invalid transaction ID');
                break;
            }

            let signerID = await rl.question('💬 Signer id: ');
            signerID = Number.parseInt(signerID);

            if(Number.isNaN(signerID)){
                console.log('🚫 Invalid signer ID');
                break;
            }

            await confirmTrxn(trxnID, signerID);
            break;
        }

        case '6': {
            let trxnID = await rl.question('💬 Enter transaction ID: ');
            trxnID = Number.parseInt(trxnID);

            if(Number.isNaN(trxnID)){
                console.log('🚫 Invalid transaction ID');
                break;
            }

            let signerID = await rl.question('💬 Signer id: ');
            signerID = Number.parseInt(signerID);

            if(Number.isNaN(signerID)){
                console.log('🚫 Invalid signer ID');
                break;
            }

            await executeTrxn(trxnID, signerID);
            break;
        }

        case '7':
            viewValidatorAddr();
            break;
        
        default:
            break;
    }
}