import React, { Component } from "react";
import Web3 from "web3";
import Authereum from "authereum";
import Web3Modal from "web3modal";
import "./Dashboard.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "#85f7ff",
      buttonText: "Connect",
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
  }

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
                      <div className="box3">
                        
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
