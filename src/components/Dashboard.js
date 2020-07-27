import React, {Component} from "react";
import Web3 from "web3";
import Authereum from "authereum";
import Web3Modal from "web3modal";
import Bridgify from "../abis/Bridgify.json";
import ERC20 from "../abis/ERC20.json";
import {getBalance, ethertowei, weitoether, handleBufferAmount} from "../utils/utils";
import config from "../config/config";
import Modal from "react-bootstrap/Modal";
import "./Dashboard.css";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            color: "#FFFAFA",
            buttonText: "Connect",
            exchangeAddresses: {
                DAI: config.daiUsdFeedAddress
            },
            showError: false,
            showSuccess: false,
            showWarning: false,
            outputAmount: "output",
            eurBalance: 0,
            gbpBalance: 0,
            jpyBalance: 0,
            amount: 0
        };
    }

  async componentWillMount() {
    this.showWarningModal();
  }
  async loadWeb3() {
        const providerOptions = { /* See Provider Options Section */
            authereum: {
                package: Authereum, // required
            }
        };
        const web3Modal = new Web3Modal({
            network: "ropsten", // optional
            cacheProvider: false, // optional
            providerOptions, // required
        });
        const provider = await web3Modal.connect();
        const web3 = new Web3(provider);
        this.setState({web3});
    }

    login = async () => {
        try {
            await this.loadWeb3();
            await this.loadBlockchainData();
            await this.loadTokenBalances();
            await this.showShortner();
            this.setState({color: "#FFB6C1"});
            this.setState({buttonText: this.state.shortnerAddress});
        } catch (err) {
            this.setState({color: "#FFFAFA", buttonText: "Try Again", errMessage: "Please select Ropsten in your wallet"});
            this.showErrorModal();
        }
    };

    async showShortner() {
        let address = this.state.account.toString();
        address = address.substring(0, 6) + "......" + address.substring(address.length - 7, address.length - 1);
        this.setState({shortnerAddress: address});
    }

    async loadBlockchainData() {
        const accounts = await this.state.web3.eth.getAccounts();
        this.setState({account: accounts[0]});
        // getcontracts instance
        const eurInstance = new this.state.web3.eth.Contract(Bridgify, config.eurAddress);
        const gbpInstance = new this.state.web3.eth.Contract(Bridgify, config.gbpAddress);
        const jpyInstance = new this.state.web3.eth.Contract(Bridgify, config.jpyAddress);
        // testnet dai instance
        const daiInstance = new this.state.web3.eth.Contract(ERC20, config.dai);
        this.setState({eurInstance, gbpInstance, jpyInstance, daiInstance});
    }

    async loadTokenBalances() {
        try {
            const eurBalance = await getBalance(this.state.web3, this.state.eurInstance, this.state.account);
            const jpyBalance = await getBalance(this.state.web3, this.state.jpyInstance, this.state.account);
            const gbpBalance = await getBalance(this.state.web3, this.state.gbpInstance, this.state.account);

            this.setState({eurBalance: Number(eurBalance).toFixed(2), jpyBalance: Number(jpyBalance).toFixed(2), gbpBalance: Number(gbpBalance).toFixed(2)});
        } catch (err) {
            this.setState({errMessage: "Connect your Metamask Wallet First"});
            this.showErrorModal();
        }
    }

    async loadExchangeRate(amount) {
        try {
            if (this.state.outputAsset !== "DAI") amount = await handleBufferAmount(amount)
            let fiatInstance;
            if (this.state.outputAsset === "EUR" || this.state.inputAsset === "EUR") {
                fiatInstance = this.state.eurInstance;
            } else if (this.state.outputAsset === "GBP" || this.state.inputAsset === "GBP") {
                fiatInstance = this.state.gbpInstance;
            } else if (this.state.outputAsset === "JPY" || this.state.inputAsset === "JPY") {
                fiatInstance = this.state.jpyInstance;
            }
            let exchangeRate = await fiatInstance.methods.getExchangeRate(amount.toString()).call({from: this.state.account});
            exchangeRate = await weitoether(this.state.web3, exchangeRate.toString());
            // If you are redeeming i.e outputAsset is DAI
            if (this.state.outputAsset === "DAI") {
                amount = await weitoether(this.state.web3, amount.toString());
                // Since in contract the amount is multiplied for the dai-fiat exchange rate so multiplying by amount**2 and then dividing to get fiat-dai rate
                exchangeRate = (amount * amount) / exchangeRate;
            }
            this.setState({exchangeRate: Number(exchangeRate).toFixed(2)});
        } catch (err) {
            this.setState({errMessage: "Please reload the page once and select the inputs again."});
            this.showErrorModal();
        }
    }

    async mintFiat(amount) {
        try { // decrease amount by 3 % and then pass into it
            let fiatInstance,
                fiatAddress;
            if (this.state.outputAsset === "EUR") {
                fiatInstance = this.state.eurInstance;
                fiatAddress = config.eurAddress;
            } else if (this.state.outputAsset === "GBP") {
                fiatInstance = this.state.gbpInstance;
                fiatAddress = config.gbpAddress;
            } else if (this.state.outputAsset === "JPY") {
                fiatInstance = this.state.jpyInstance;
                fiatAddress = config.jpyAddress;
            }
            await this.state.daiInstance.methods.approve(fiatAddress, amount.toString()).send({from: this.state.account});
            let bufferAmount = await handleBufferAmount(amount);
            let tx = await fiatInstance.methods.depositFiat(config.dai, bufferAmount.toString()).send({from: this.state.account});
            this.setState({
                successMessage: "https://ropsten.etherscan.io/tx/" + tx["transactionHash"]
            });
            this.showSuccessModal();
        } catch (err) {
            this.setState({errMessage: "Transaction Failed, Please check your inputs or it is taking too much time to confirm, check etherscan"});
            this.showErrorModal();
        }
    }
    async redeem(amount) {
        try {
            let fiatInstance;
            if (this.state.inputAsset === "EUR") {
                fiatInstance = this.state.eurInstance;
            } else if (this.state.inputAsset === "GBP") {
                fiatInstance = this.state.gbpInstance;
            } else if (this.state.inputAsset === "JPY") {
                fiatInstance = this.state.jpyInstance;
            }
            let tx = await fiatInstance.methods.redeem(config.dai, amount.toString()).send({from: this.state.account});
            this.setState({
                successMessage: "https://ropsten.etherscan.io/tx/" + tx["transactionHash"]
            });
            this.showSuccessModal();
        } catch (err) {
            this.setState({errMessage: "Transaction Failed, Please check your inputs or it is taking too much time to confirm, check etherscan"});
            this.showErrorModal();
        }
    }
    handleInputAssetChange = (evt) => {
        try {
            const asset = evt.target.value;
            this.setState({
                inputAsset: asset
            }, async () => {
                if (this.state.outputAsset && this.state.amount) 
                    await this.loadExchangeRate(this.state.amount);
                

            });
        } catch (err) {
            this.setState({errMessage: "Connect your Metamask Wallet first"});
            this.showErrorModal(evt);
        }
    };
    handleOutputAssetChange = async (evt) => {
        try {
            const asset = evt.target.value;

            this.setState({
                outputAsset: asset
            }, async () => {
                if (this.state.inputAsset && this.state.amount) 
                    await this.loadExchangeRate(this.state.amount);
                

            });
        } catch (err) {
            this.setState({errMessage: "Connect your Metamask Wallet first"});
            this.showErrorModal(evt);
        }
    };
    handleAmountChange = async (evt) => {
        try {
            let amt = evt.target.value
            const amount = await ethertowei(this.state.web3, amt.toString());
            if (this.state.inputAsset && this.state.outputAsset) 
                await this.loadExchangeRate(amount);
            this.setState({amount});
        } catch (err) {
            this.setState({errMessage: "Connect your Metamask Wallet first"});
            this.showErrorModal(evt);
        }
    };
    handleSwap = (evt) => {
        evt.preventDefault();
        if (this.state.inputAsset === "DAI") {
            this.mintFiat(this.state.amount);
        } else {
            this.redeem(this.state.amount);
        }
    };
    showErrorModal = (e) => {
        this.setState({showError: true});
    };
    hideErrorModal = (e) => {
        this.setState({showError: false});
    };
    showSuccessModal = (e) => {
        this.loadTokenBalances();
        this.setState({showSuccess: true});
    };
    hideSuccessModal = (e) => {
        this.setState({showSuccess: false});
    };
    showWarningModal = (e) => {
        this.setState({showWarning: true});
    };

    hideWarningModal = (e) => {
        this.setState({showWarning: false});
    };

    render() {
        return (<div>
            <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                <div className="navbar-brand col-sm-3 col-md-2 mr-0">Dashboard</div>
                <button onClick={
                        this.login
                    }
                    style={
                        {
                            backgroundColor: this.state.color,
                            borderRadius: "7px",
                            border: "None"
                        }
                }>
                    {
                    this.state.buttonText
                }
                    {" "} </button>
            </nav>

            <div id="container">
                <div className="content">
                    <div className="container2">
                        <div className="box1">
                            <div class="gridcontainer1">
                                <div class="gridbody1">
                                    <div class="gridcontent1">
                                     <Modal
                      show={this.state.showSuccess}
                      onHide={this.hideSuccessModal}
                    >
                                        <Modal.Body>
                                            <a href={
                                                this.state.successMessage
                                            }>
                                                Check Transaction
                                            </a>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <button onClick={
                                                this.hideSuccessModal
                                            }>Cancel</button>
                                        </Modal.Footer>
                                        {" "} </Modal>
                                    <Modal show={
                                            this.state.showWarning
                                        }
                                        onHide={
                                            this.hideWarningModal
                                    }>
                                        <Modal.Header>
                                            <Modal.Title>
                                                <b>NOTE</b>
                                            </Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            The DAI Amount that you swap, 3% of it is used as extra collateral and locked in the contract, so the amount swapped is rest of the 97% amount to account for DAI Price Flucuations.
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <button onClick={
                                                this.hideWarningModal
                                            }>Cancel</button>
                                        </Modal.Footer>
                                        {" "} </Modal>
                                    <Modal show={
                                            this.state.showError
                                        }
                                        onHide={
                                            this.hideErrorModal
                                    }>
                                        <Modal.Header>
                                            <Modal.Title>
                                                <b>Error</b>
                                            </Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>{
                                            this.state.errMessage
                                        }</Modal.Body>
                                        <Modal.Footer>
                                            <button onClick={
                                                this.hideErrorModal
                                            }>Cancel</button>
                                        </Modal.Footer>
                                        {" "} </Modal>

                                    <div className="box4">
                                        <div className="box3">Balance</div>

                                        <div className="box7">
                                            <div className="card2">
                                                <div className="box6">
                                                    <div>Asset</div>
                                                    <div>Balance</div>
                                                </div>
                                            </div>

                                            <div className="card2">
                                                <div className="box6">
                                                    <div>EUR</div>
                                                    <div>{
                                                        this.state.eurBalance
                                                    }</div>
                                                </div>
                                            </div>

                                            <div className="card2">
                                                <div className="box6">
                                                    <div>JPY</div>
                                                    <div>{
                                                        this.state.jpyBalance
                                                    }</div>
                                                </div>
                                            </div>

                                            <div className="card2">
                                                <div className="box6">
                                                    <div>GBP</div>
                                                    <div>{
                                                        this.state.gbpBalance
                                                    }</div>
                                                </div>
                                            </div>
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
                                    <form>
                                        <div className="box5">
                                            <div>
                                                <input className="input" type="number"
                                                    placeholder={`Amount to Swap`}
                                                    onChange={
                                                        this.handleAmountChange
                                                    }/>
                                                }
                                                <div className="custom-select">
                                                    <select className="select2"
                                                        onChange={
                                                            this.handleInputAssetChange
                                                    }>
                                                        <option value="" selected disabled>
                                                            Select Input Asset
                                                        </option>
                                                        <option>DAI</option>
                                                        <option>EUR</option>
                                                        <option>JPY</option>
                                                        <option>GBP</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div> {" "}
                                                {/* this needs to be fixed and dependednty on the input amount see a way to update realtime */}
                                                <input className="input" placeholder="Exchange Rate"
                                                    value={
                                                        this.state.exchangeRate
                                                    }
                                                    readonly="readonly"/>
                                                <div className="custom-select">
                                                    <select className="select2"
                                                        onChange={
                                                            this.handleOutputAssetChange
                                                    }>
                                                        <option value="" selected disabled>
                                                            Select Output Asset
                                                        </option>
                                                        {
                                                        this.state.inputAsset === "DAI" && (
                                                            <option>EUR</option>
                                                        )
                                                    }
                                                        {
                                                        this.state.inputAsset === "DAI" && (
                                                            <option>JPY</option>
                                                        )
                                                    }
                                                        {
                                                        this.state.inputAsset === "DAI" && (
                                                            <option>GBP</option>
                                                        )
                                                    }
                                                        {
                                                        this.state.inputAsset !== "DAI" && (
                                                            <option>DAI</option>
                                                        )
                                                    }
                                                        {" "} </select>
                                                </div>
                                            </div>

                                            <div>
                                                <button type="button" className="swapbutton2"
                                                    onClick={
                                                        this.handleSwap
                                                }>
                                                    Swap
                                                </button>
                                            </div>
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
    );
              }
            }
            
            export default App;
