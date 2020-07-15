pragma solidity ^0.6.0;

import "https://github.com/smartcontractkit/chainlink/evm-contracts/src/v0.6/interfaces/AggregatorInterface.sol";


contract ReferenceConsumer {
  AggregatorInterface internal erc20Ref;
  AggregatorInterface internal fiatRef;

  
modifier onlyOwner () {
    require(owner == msg.sender, "Only called by owner");
    _;
}

address public owner;

constructor() public {
    owner = msg.sender;
}

function setReferenceContract(address _erc20aggregator, address _fiataggregator)
  public
  onlyOwner()
{
  erc20Ref = AggregatorInterface(_erc20aggregator);
  fiatRef = AggregatorInterface(_fiataggregator);
}
  // get exchange rate
  function getLatestAnswer() public view returns (int256, int256) {
    return (erc20Ref.latestAnswer(), fiatRef.latestAnswer()) ;
  }
}
