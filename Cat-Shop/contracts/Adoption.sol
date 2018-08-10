pragma solidity ^0.4.24;

contract Adoption {

    address[16] public adopters;    // Each cat has his own address

    // Adpoting a cat
    function adopt(uint catID) public returns (uint) {
        require(catID >= 0 && catID <= 15, "Number of a cat must be between 0-15");
        adopters[catID] = msg.sender;
        return catID;
    }

    // Retrieving adopters
    function getAdopters() public view returns (address[16]) {
        return adopters;
    }

}