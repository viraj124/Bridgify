  export const ethertowei = async (web3, amount) => {
  let value = web3.utils.toWei(amount, 'ether');
  return value;
  }

  export const weitoether = async (web3, amount) => {
  let value = web3.utils.fromWei(amount, 'ether');
  return value;
  }
  
  //another method for getBalance of each token
  //try to have one method to fetch balance of any token instead of multiple
  export const getBalance = async (web3, instance, account) => {
  let balance = await instance.methods.balanceOf(account).call({from: account });
  return await web3.utils.fromWei(balance, 'ether')
  }

  export const handleBufferAmount = async (amount) => {
    try {
  // reducing 3% of the provided amount to handle buffer on the contract end
  return amount - ((amount*3)/100)
    } catch(err) {
      console.log(err)
      throw err
    }
  }