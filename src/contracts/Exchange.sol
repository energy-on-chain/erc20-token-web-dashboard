// FUNCITONAL OVERVIEW:
// Deposit and withdraw funds
// Manage orders, make or cancel
// Handle trades, charge fees

// TODO:
// [x] Set the fee percent and fee account
// [x] Deposit ether
// [] Withdraw ether
// [x] Deposit tokens
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
	address constant ETHER = address(0);    // store Ether in tokens mapping with blank address
	mapping(address => mapping(address => uint256)) public tokens;    // maps all deposited tokens to all users who have deposited them


	// CONSTRUCTORS
	constructor (address _feeAccount, uint256 _feePercent) public {
		feeAccount = _feeAccount;
		feePercent = _feePercent;
	}


	// EVENTS
	event Deposit(address token, address user, uint256 amount, uint256 balance);
	event Withdraw(address token, address user, uint256 amount, uint256 balance);


	// FUNCTIONS
	// fallback: reverts if Ether is sent to this smart contract by mistake
	function() external {
		revert();
	}

	function depositEther() payable public {
		tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
		emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
	}

	function withdrawEther(uint256 _amount) public {
		require(tokens[ETHER][msg.sender] >= _amount);
		tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
		msg.sender.transfer(_amount);
		emit Withdraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
	}

	function depositToken(address _token, uint _amount) public {
		require(_token != ETHER);
		require(Token(_token).transferFrom(msg.sender, address(this), _amount));
		tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
		emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
	}
}