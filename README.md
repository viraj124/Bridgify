# Bridgify

## Introduction

- Tokenizing different real world entities on blockchain sounds really exciting, and has it’s challenges to go with as well.
- When the real world entities involve Fiat Assets it gets even more intriguing, since then you usually expect DeFi to play a part as well
- Introducing Bridgify, a Dapp which acts as a bridge between DeFi & CeFi, through which you can have your DAI Swapped with EUR, GBP or JPY based on real time prices thanks to Chainlink’s Oracle Services.
- We expect Bridgify to be another step toward bridging this gap, and provide users a minimal yet simple UI/UX to interact with so that DeFi users can use the fiat assets like they use DeFi assets currently in every possible way.

## Technical Implementation
The DAPP works on top of 3 FIAT Pools & has two main features first we have the swap functionality to exchange your DAI for FIAT Tokens(EUR, GBP, JPY) and secondly we have the redeem functionlaity for the user's to get back their locked DAI in excnhange of the acquired FIAT Tokens.
- Exchanging DAI for FIAT -> Just input the amount of DAI you wish to swap, and automatically you will see the amount of FIAT Tokens you will get fetched through chainlink reference contracts, but please note The DAI Amount that you swap, 3% of it is used as extra collateral and locked in the contract, so the amount swapped is rest of the 97% amount to account for DAI Price Fluctuations.

- Redeeming DAI -> Just input the amount of FIAT tokens you wish to to swap and based on the exchange rate you will get the DAI amount locked in the contracts back, the FIAT Tokens will get burnt.

### NOTE
- All the contracts are currently deployed on Ropsten, and the you can easily mint [DAI](https://ropsten.etherscan.io/address/0xb1f3a2ebe13cc0420f7cedd558d357a08dde11ee) and test it out.

### Running Locally

- npm install
- npm start
- navigate to localhost:3000 in browser and start swapping and redeeming.

## Screenshots

![chaihome](https://user-images.githubusercontent.com/26670962/88565961-f389a000-d052-11ea-83d2-6a8172c63136.png)

Home Page

![chaindashboard](https://user-images.githubusercontent.com/26670962/88565975-f8e6ea80-d052-11ea-8239-45a7e1a24de2.png)

Dashboard

![chainmint](https://user-images.githubusercontent.com/26670962/88565984-fd130800-d052-11ea-9fc1-a248ed13d450.png)

DAI <-> FIAT

![chainredeem](https://user-images.githubusercontent.com/26670962/88565987-fedccb80-d052-11ea-9386-5dbdccf0bd4a.png)

FIAT <-> DAI


## Video
Whole Demo [here](https://www.youtube.com/watch?v=Z3Z4zIjbC1c)


## Website
[Bridgify](https://bridgifylink.herokuapp.com/)


## Authors
- [Viraz](https://twitter.com/Viraz04)
- [snaketh4x0r](https://twitter.com/snaketh4x0r?s=09)
