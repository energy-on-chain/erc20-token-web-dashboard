// FUNCITONAL OVERVIEW:
// Deposit and withdraw funds
// Manage orders, make or cancel
// Handle trades, charge fees

// TODO:
// [] Set the fee and fee account
// [] Deposit ether
// [] Withdraw ether
// [] Deposit tokens
// [] Withdraw tokens
// [] Check balances
// [] Make order
// [] Cancel order
// [] Fill order
// [] Charge fees

pragma solidity ^0.5.0;

contract Exchange {
	// STATE VARIABLES
	address public feeAccount;    // the account that receives exchange fees


	// CONSTRUCTORS
	constructor (address _feeAccount) public {
		feeAccount = _feeAccount;
	}
}
