// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import { IEvents } from "../interfaces/IEvents.sol";
import { Validator } from "../contracts/Validator.sol";
import { Transaction } from "../structs/Transaction.sol";

contract Proposer is IEvents {
    address public owner;
    Validator public validator;

    constructor(address _validator) {
        owner = msg.sender;
        validator = Validator(_validator);
    }

    function submitTransaction(address payable _recipient, uint256 _value) public returns(bool) {
        validator.submitTransaction(_recipient, _value);
        emit TransactionSubmitted(msg.sender, _recipient, _value);

        return true;
    }

    function getTransactionCount() public view returns (uint) {
        return validator.getTransactionsCount();
    }

    function getTransaction(uint256 _txIndex) public view returns (bool, Transaction memory) {
        return validator.getTransaction(_txIndex);
    }
}