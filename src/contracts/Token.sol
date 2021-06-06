pragma solidity ^0.5.0;

contract Token {
	
	// STATE VARIABLES
	string public name = 'Energy On Chain Token';
	string public symbol = 'EOC';
	uint256 public decimals = 18;
	uint256 public totalSupply;


	// CONSTRUCTORS
	constructor() public {
		totalSupply = 1000000 * (10 ** decimals);
	}

}
