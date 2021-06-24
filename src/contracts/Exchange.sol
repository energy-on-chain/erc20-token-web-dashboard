// FUNCITONAL OVERVIEW:
// Deposit and withdraw funds
// Manage orders, make or cancel
// Handle trades, charge fees

// TODO:
// [X] Set the fee percent and fee account
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

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import './Token.sol';

contract Exchange {
	using SafeMath for uint;

	// STATE VARIABLES
	address public feeAccount;    // the account that receives exchange fees
	uint256 public feePercent;    // the fee percentage
	mapping(address => mapping(address => uint256)) public tokens;    // maps all deposited tokens to all users who have deposited them


	// CONSTRUCTORS
	constructor (address _feeAccount, uint256 _feePercent) public {
		feeAccount = _feeAccount;
		feePercent = _feePercent;
	}


	// EVENTS
	event Deposit(address token, address user, uint256 amount, uint256 balance);


	// FUNCTIONS
	function depositToken(address _token, uint _amount) public {
		// Send tokens to this contract
		require(Token(_token).transferFrom(msg.sender, address(this), _amount));
		// Manage deposit
		tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
		// Emit event
		emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
	}
}
