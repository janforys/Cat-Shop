pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";

contract TestAdoption {
    Adoption adoption = Adoption(DeployedAddresses.Adoption());

    // Testing the adopt() function
    function testUserCanAdopt() public {

        uint returnedID = adoption.adopt(8);

        uint expected = 8;

        Assert.equal(returnedID, expected, "Adoption of cat ID 8 should be recorded.");
    }

    // Testing retrieval of a single pet's owner
    function testGetAdopterAddressByCatID() public {
        // expected owner is this contract
        address expected = this;

        address adopter = adoption.adopters(8);

        Assert.equal(adopter, expected, "Owner of cat ID 8 should be recorded.");
    }

    // Testing retrieval of all cat owners
    function testGetAdopterAddressByCatIDInArray() public {
        // expected owner is this contract
        address expected = this;

        // store adopters in memory rather than contract's storage
        address[16] memory adopters = adoption.getAdopters();

        Assert.equal(adopters[8], expected, "Owner of cat ID 8 should be recorded.");
    }

}