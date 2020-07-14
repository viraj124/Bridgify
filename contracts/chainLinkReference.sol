pragma solidity ^0.6.0;

import "https://github.com/smartcontractkit/chainlink/evm-contracts/src/v0.6/interfaces/AggregatorInterface.sol";


contract ReferenceConsumer {
  AggregatorInterface internal ref;
  
modifier onlyOwner () {
    require(owner == msg.sender, "Only called by owner");
    _;
}

address public owner;

constructor() public {
    owner = msg.sender;
}

function setReferenceContract(address _aggregator)
  public
  onlyOwner()
{
  ref = AggregatorInterface(_aggregator);
}
  // get exchange rate
  function getLatestAnswer() public view returns (int256) {
    return ref.latestAnswer();
  }
}