// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

interface IEvents {
    event Deposit(address indexed sender, uint256 amount, uint256 balance);
    event TransactionSubmitted(address indexed sender, address indexed recipient, uint256 value);
    event TransactionConfirmed(uint256 indexed txIndex);
    event TransactionExecuted(uint256 indexed txIndex);
}