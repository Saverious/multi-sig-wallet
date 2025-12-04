import readline from 'node:readline/promises';
import { isAddress } from 'ethers';

import { ProposerService } from './proposer.ts';
import { ValidatorService } from './validator.ts';


export async function proposerOptions(rl: readline.Interface, index: string) {
    switch(index) {
        case '1': {
            let addr = await rl.question('💬 Validator address: ');

            if(!isAddress(addr)){
                console.log('🚫 Invalid address');
                return;
            }

            await ProposerService.deployContract(addr);
            break;
        }

        case '2':
            await ProposerService.viewOwner();
            break;

        case '3': {
            let trxnID: any = await rl.question('💬 Transaction ID: ');
            trxnID = Number.parseInt(trxnID);

            if(Number.isNaN(trxnID)){
                console.log('🚫 Invalid transaction ID');
                return;
            }

            await ProposerService.getTrxn(trxnID);
            break;
        }

        case '4':
            await ProposerService.getTrxnCount();
            break;

        case '5': {
            let recipient = await rl.question('💬 Recipient address: ');

            if(!isAddress(recipient)){
                console.log('🚫 Invalid address');
                return;
            }

            let amount = await rl.question('💬 Amount to send: ');
            await ProposerService.submitTrxn(recipient, amount);
            break;
        }

        case '6':
            ProposerService.viewProposerAddr();
            break;

        default:
            break;
    }
}

export async function validatorOptions(rl: readline.Interface, index: string) {
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

            let quota: any = await rl.question('💬 Validators quota: ');
            quota = Number.parseInt(quota);

            if(Number.isNaN(quota)){
                console.log('🚫 Invalid quota');
                return;
            }

            await ValidatorService.deployContract(addresses, quota);
            break;
        }

        case '2':
            await ValidatorService.viewOwner();
            break;

        case '3': {
            let trxnID: any = await rl.question('💬 Enter transaction ID: ');
            trxnID = Number.parseInt(trxnID);

            if(Number.isNaN(trxnID)){
                console.log('🚫 Invalid transaction ID');
                break;
            }

            await ValidatorService.getTrxn(trxnID);
            break;
        }

        case '4':
            await ValidatorService.getTrxnCount();
            break;

        case '5': {
            let trxnID: any = await rl.question('💬 Enter transaction ID: ');
            trxnID = Number.parseInt(trxnID);

            if(Number.isNaN(trxnID)){
                console.log('🚫 Invalid transaction ID');
                break;
            }

            let signerID: any = await rl.question('💬 Signer id: ');
            signerID = Number.parseInt(signerID);

            if(Number.isNaN(signerID)){
                console.log('🚫 Invalid signer ID');
                break;
            }

            await ValidatorService.confirmTrxn(trxnID, signerID);
            break;
        }

        case '6': {
            let trxnID: any = await rl.question('💬 Enter transaction ID: ');
            trxnID = Number.parseInt(trxnID);

            if(Number.isNaN(trxnID)){
                console.log('🚫 Invalid transaction ID');
                break;
            }

            let signerID: any = await rl.question('💬 Signer id: ');
            signerID = Number.parseInt(signerID);

            if(Number.isNaN(signerID)){
                console.log('🚫 Invalid signer ID');
                break;
            }

            await ValidatorService.executeTrxn(trxnID, signerID);
            break;
        }

        case '7':
            ValidatorService.viewValidatorAddr();
            break;
        
        default:
            break;
    }
}