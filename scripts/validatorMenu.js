import readline from 'node:readline/promises';

import { validatorOptions } from './utils.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

try {
    let index = '';

    while(index != '0'){
        console.log('\n******* On-chain multisig wallet *******\n');
        console.log('Validator contract options\n');
        console.log('1. Deploy contract');
        console.log('2. View owner');
        console.log('3. View transaction');
        console.log('4. View total transactions');
        console.log('5. Confirm transaction');
        console.log('6. Execute transaction');
        console.log('7. View validator address');
        console.log('0. Exit\n');

        index = await rl.question('💬 Option: ');
        await validatorOptions(rl, index);
    }

    rl.close();
} catch (e) {
    console.error(`⚠️  ${e.message}`);
}