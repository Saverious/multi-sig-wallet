import readline from 'node:readline/promises';

import { proposerOptions } from './utils.ts';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

try {
    let index: string = '';

    while(index != '0'){
        console.log('\n******* On-chain multisig wallet *******\n');
        console.log('Proposer contract options\n');
        console.log('1. Deploy contract');
        console.log('2. View owner');
        console.log('3. View transaction');
        console.log('4. View total transactions');
        console.log('5. Submit transaction');
        console.log('6. View proposer address');
        console.log('0. Exit\n');

        index = await rl.question('💬 Option: ');
        await proposerOptions(rl, index);
    }

    rl.close();
} catch (e) {
    if(e instanceof Error){
        console.error(`⚠️  ${e.message}`);
    }else{
        console.error(`⚠️  ${e}`);
    }
}