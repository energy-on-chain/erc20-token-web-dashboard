pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Token {
	using SafeMath for uint;
	
	// STATE VARIABLES
	string public name = 'Energy On Chain Token';
	string public symbol = 'EOC';
	uint256 public decimals = 18;
	uint256 public totalSupply;
	mapping(address => uint256) public balanceOf;	// track balances


	// EVENTS
	event Transfer(address indexed from, address indexed to, uint256 value);


	// CONSTRUCTORS
	constructor() public {
		totalSupply = 1000000 * (10 ** decimals);
		balanceOf[msg.sender] = totalSupply;
	}


	// METHODS
	function transfer (address _to, uint256 _value) public returns (bool success) {
		require(_to != address(0));
		require(balanceOf[msg.sender] >= _value);
		balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);
		balanceOf[_to] = balanceOf[_to].add(_value);
		emit Transfer(msg.sender, _to, _value);
		return true;
	}
	// function transferFrom(address _from, address _to, uint256 _value) public returns (bool success);
	// function approve(address _spender, uint256 _value) public returns (bool success);
	// function allowance(address _owner, address _spender) public value returns (uint256 remaining);


	// EVENTS
	// event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}
