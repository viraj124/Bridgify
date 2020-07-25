  const ethertowei = async (web3, amount) => {
  let value = web3.utils.toWei(amount, 'ether');
  return value;
  }

  const weitoether = async (web3, amount) => {
  let value = web3.utils.fromWei(amount, 'ether');
  return value;
  }
  
  //another method for getBalance of each token
  //try to have one method to fetch balance of any token instead of multiple
  export const getBalance = async (web3, instance, account) => {
  let balance = await instance.balanceOf(account).call({from: this.state.account });
  return await weitoether(web3, balance)
  }