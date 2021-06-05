pragma solidity ^0.5.0;

contract Token {
	
	// STATE VARIABLES
	uint storedData;
	string public name = "My Name";


	// FUNCTIONS
	function get() public view returns (uint) {
		return storedData;
	}
}
