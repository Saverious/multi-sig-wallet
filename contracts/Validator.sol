// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import { Transaction } from "../structs/Transaction.sol";
import { IErrors } from "../interfaces/IErrors.sol";
import { IEvents } from "../interfaces/IEvents.sol";

contract Validator is IErrors, IEvents {
    address public owner;
    Transaction[] public transactions;
    uint256 public txConfirmationQuota;
    uint256 public totalValidators;
    mapping(address => bool) public validators;
    
    modifier isValidator() {
        require(validators[msg.sender], "Insufficient privileges to complete operation");
        _;
    }

    constructor(address[] memory _validators, uint256 _txConfirmationQuota) {
        uint256 _totalValidators = _validators.length;

        require(_txConfirmationQuota >= 3, "Transaction validators must be more than 2");
        require(_txConfirmationQuota <= _totalValidators, "Validation quota limit cannot be more than total validators");

        txConfirmationQuota = _txConfirmationQuota;

        uint256 _validatorsCount = 0;
        for(uint256 i = 0; i < _totalValidators; ++i) {
            if(_validators[i] != address(0)){
                validators[_validators[i]] = true;
                ++_validatorsCount;
            }
        }

        if(_validatorsCount < 3) {
            revert InsufficientValidators();
        }

        totalValidators = _validatorsCount;
        owner = msg.sender;
    }
    

    function getTransaction(uint256 _txIndex) external view returns(bool exists, Transaction memory _tx) {
        if(_txIndex >= transactions.length){
            return (false, Transaction(address(0), address(0), 0, "", false, 0));
        }

        return (true, transactions[_txIndex]);
    }

    function getTransactionsCount() external view returns (uint _totalTransactions) {
        _totalTransactions = transactions.length;
    }

    function submitTransaction(address _recipient, uint256 _value) external returns(bool){
        Transaction memory _tx = Transaction({
            sender: msg.sender,
            recipient: _recipient,
            value: _value,
            data: new bytes(0),
            executed: false,
            numOfConfirmations: 0
        });

        transactions.push(_tx);
        emit TransactionSubmitted(msg.sender, _recipient, _value);
        return true;
    }

    function confirmTransaction(uint256 _txIndex) public isValidator returns(bool) {
        if(_txIndex >= transactions.length) return false;

        Transaction memory _tx = transactions[_txIndex];

        require(!_tx.executed, "Transaction has already been executed");

        ++_tx.numOfConfirmations;
        transactions[_txIndex] = _tx;

        emit TransactionConfirmed(_txIndex);
        return true;
    }

    function executeTransaction(uint256 _txIndex) public isValidator returns(bool) {
        if(_txIndex >= transactions.length) return false;
        
        Transaction memory _tx = transactions[_txIndex];

        require(!_tx.executed, "Transaction has already been executed");
        require(_tx.numOfConfirmations >= txConfirmationQuota, "Transaction confirmation quota not attained");

        _tx.executed = true;
        transactions[_txIndex] = _tx;

        emit TransactionExecuted(_txIndex);
        return true;
    }
}