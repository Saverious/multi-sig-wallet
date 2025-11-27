// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

struct Transaction {
    address sender;
    address recipient;
    uint256 value;
    bytes data;
    bool executed;
    uint256 numOfConfirmations;
}