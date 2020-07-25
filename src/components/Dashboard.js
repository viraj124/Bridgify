import React, { Component } from "react";
import Web3 from "web3";
import Authereum from "authereum";
import Web3Modal from "web3modal";
import BridgifyEUR from '../abis/BridgifyEUR.json';
//abi will be same for all three contarcts only address differ

import "./Dashboard.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "#85f7ff",
      buttonText: "Connect",
	  //add more variables to store rates here
    };
  }

  async componentWillMount() {
  }
  async loadWeb3() {
    const providerOptions = {
      /* See Provider Options Section */
      authereum: {
        package: Authereum, // required
      },
    };
    const web3Modal = new Web3Modal({
      network: "ropsten", // optional
      cacheProvider: false, // optional
      providerOptions, // required
    });
    const provider = await web3Modal.connect();
    const web3 = new Web3(provider);
    this.setState({ web3 });
  }

  login = async () => {
    try {
      await this.loadWeb3();
      await this.loadBlockchainData();
      await this.showShortner()
      this.setState({ color: "#0ff279" });
      this.setState({ buttonText: this.state.shortnerAddress});
    } catch (err) {
      this.setState({ color: "#85f7ff", buttonText: "Try Again", errMessage: "Please select Mainnet in your wallet" });
      this.showErrorModal();   
    }
  };

  async showShortner() {
    let address = this.state.account.toString()
    address = address.substring(0,6)+ '......'+ address.substring(address.length -7, address.length -1)
    this.setState({shortnerAddress : address})
  }

  async loadBlockchainData() {
    const accounts = await this.state.web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    //getcontracts instance
	/*
	const fi1 = "";
    const fi2 = "";
    const fi3 = "";
	const fiat1 = new this.state.web3.eth.Contract(BridgifyEUR.abi, fi1);
	const fiat2 = new this.state.web3.eth.Contract(BridgifyEUR.abi, fi2);
	const fiat2 = new this.state.web3.eth.Contract(BridgifyEUR.abi, fi3);
	this.setState({ fiat1,fiat2,fiat3 });
	*/
  }
   
  //web3 methods code
  //method for ether to wei
  //converts input amount to wei
  /*
  ethertowei = (amount) => {
  let value = web3.utils.toWei(amount, 'ether');
  return value;
  }
  */
  
  //another method for getBalance of each token
  //try to have one method to fetch balance of any token instead of multiple
  /*
  getBalance = async () => {
	  let result1 = await this.state.Fiat1.methods.balanceOf(this.state.account).call({from: this.state.account });
	  return result1;
  }
  */
  
  //another method to get exchange rate
  /*
  getrate = async (erc20aggregator,amount) => {
	  let result2 = await this.state.Fiat1.methods.getExchangeRate(erc20aggregator,amount).call({from: this.state.account });
	  return result2;
  }
  */
  
  //another method for calling mint
  /*
  mint = async (token,amount,erc20aggregator) => {
	  let result3 = await this.state.Fiat1.methods.depositFiat(token,amount,erc20aggregator).send({from: this.state.account });
	  return result3;
  }
  */
  
  //another method for unmint
  /*
  unmint = async (amount,token,erc20aggregator) => {
	  let result4 = await this.state.Fiat1.methods.redeem(amount,token,erc20aggregator).send({from: this.state.account });
	  return result4;
  }
  */
  
  //add same methods as above for fiat2,fiat3,integrate with ui elements

render() {
    return (
      <div>
	  
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <div className="navbar-brand col-sm-3 col-md-2 mr-0">Dashboard</div>
          <button
            onClick={this.login}
            style={{
              backgroundColor: this.state.color,
              borderRadius: "7px",
              border: "None",
            }}
          >
            {this.state.buttonText}{" "}
          </button>
        </nav>
		
        <div id="container">
          <div className="content">
            <div className="container2">
              <div className="box1">
               <div class="gridcontainer1">
                  <div class="gridbody1">
                    <div class="gridcontent1">
                      <div className="box4">
					  
					  <div>Balances</div>
					  
                        <div className="card2">
						heysfdsgsdgdsggds
						</div>
						
						<div className="card2">
						heysfdsgsdgdsggds
						</div>
						
						<div className="card2">
						heysfdsgsdgdsggds
						</div>
						
						<div className="card2">
						heysfdsgsdgdsggds
						</div>
						
                      </div>
                    </div>
                  </div>
               </div> 
              </div>
			 
              <div className="box2">
                <div class="gridcontainer2">
                  <div class="gridbody2">
                    <div class="gridcontent2">
                      <div className="box3">
                        
						<form>
						
						<div className="box4">
						<input className="input"
                        placeholder={`input`}
                                    
                        />
						
                        <div>						
				        <input className="input"
                        placeholder={`output`}
                                    
                        />
						
						<div className="custom-select">
                                <select
                                  className="select2"
                                  
                                >
                                  <option >
                                    Select Fiat
                                  </option>
                                  <option>EUR</option>
                                  <option>JPY</option>
                                  <option>GBP</option>
                                </select>
						</div>
						</div>
						
						<button
                          type="button"
                          className="new-button2 shadow animate red"
                          
                        >
						Swap
                        </button>
						</div>
						
						</form>
						
                      </div>
                    </div>
                  </div>
                </div>
              </div>
			  
			  </div>
			  
            </div>
         </div>
        
	</div>
   );
 }
}

export default App;
