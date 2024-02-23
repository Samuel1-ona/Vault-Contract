// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.20;

contract Vault {
    address public owner;

    uint id;
    mapping(address => mapping(uint => Beneficiary)) private receiver; // Corrected syntax

    struct Beneficiary {
        uint claimerTime;
        uint256 grant;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "You are not the owner");
        _;
    }

    constructor() payable {
        owner = msg.sender;
    }

    function donorDeposit(address _beneficiary, uint256 _grantTime) external payable {
        require(msg.sender != address(0), "Invalid address");
        require(msg.value > 0, "Can't deposit zero amount");
        uint _id = id + 1;
        // Update donor's donation amount
        receiver[_beneficiary][_id].grant = receiver[_beneficiary][_id].grant + msg.value;
        // Update beneficiary grant
        receiver[_beneficiary][_id].claimerTime = block.timestamp + _grantTime;
    }

    function claimGrant(uint _id) external {
        require(msg.sender != address(0), "Invalid address");
        require(receiver[msg.sender][_id].grant >= 0 ,"");
        require( block.timestamp >= receiver[msg.sender][_id].claimerTime, "");

        uint grant = receiver[msg.sender][_id].grant;

        receiver[msg.sender][_id].grant =0 ;

        payable(msg.sender).transfer(grant);


      
    }

}
