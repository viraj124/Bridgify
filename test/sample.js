const DSA = require("dsa-sdk");
const Web3 = require("web3");

async function loadBlockchainData() {
  const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  // in nodejs
  const dsa = new DSA({
    web3: web3,
    mode: "node",
    // mainnet forked dummy acct private key
    privateKey:
      "0xed32086fa58de5e202393cddb15853cf2188fbe4e46c6e18d2b384966d891ffa"
  });
 console.log(web3.utils.toWei("11", "gwei"))
  // var addr = await dsa.build({
  //   gasPrice: web3.utils.toWei("11", "gwei")
  // });
  var addr = await dsa.build();
  // mainnet forked dummy account address
  addr = await dsa.getAccounts("0x5468eDEacB1273B801cF4B2ba1D8F9f19f1739f4");
  console.log(addr)

  var BN = await web3.utils.BN;

  await dsa.setInstance(addr[0].id);

  let borrowAmount = 2; // 20 DAI
  let borrowAmtInWei = await dsa.tokens.fromDecimal(borrowAmount, "dai"); // borrow flash loan and swap via Oasis

  let slippage = 2; // 2% slippage.
  let dai_address = await dsa.tokens.info.dai.address;
  let eth_address = await dsa.tokens.info.eth.address;

  let spells = await dsa.Spell();

  await spells.add({
    connector: "instapool",
    method: "flashBorrow",
    args: [dai_address, borrowAmtInWei, 0, 0],
  });

  let buyDetail = await dsa.oasis.getBuyAmount(
    "ETH",
    "DAI",
    borrowAmount,
    slippage
  );

  await spells.add({
    connector: "oasis",
    method: "sell",
    args: [eth_address, dai_address, borrowAmtInWei, buyDetail.unitAmt, 0, 0],
  });

  await spells.add({
    connector: "compound",
    method: "deposit",
    args: [
      eth_address,
      new BN(
        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      ),
      0,
      0,
    ],
  });

  await spells.add({
    connector: "compound",
    method: "borrow",
    args: [dai_address, borrowAmtInWei, 0, 0],
  });

  await spells.add({
    connector: "instapool",
    method: "flashPayback",
    args: [dai_address, 0, 0],
  });

  // Point of execution of transaction
  try {
 await dsa
    .cast({
      spells: spells,
<<<<<<< HEAD
      gasPrice: web3.utils.toWei("110000", "gwei"),
=======
      gasPrice: web3.utils.toHex(web3.utils.toWei("110000", "gwei")),
>>>>>>> 586d00108c2367178bcaf1bbf670d3d8e1b5ee97
    })
  } catch(err) {
    console.log(err)
  }
}

<<<<<<< HEAD
loadBlockchainData();
=======
loadBlockchainData();
>>>>>>> 586d00108c2367178bcaf1bbf670d3d8e1b5ee97
