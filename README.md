# Welcome to "blockchain_developer_bootcamp"!

## [ DESCRIPTION ]

This repo contains the Solidity and React code that implements a standard ERC20 token and allows the user to interact with it on the Ethereum blockchain via a browser-based GUI.  All code is based on the "Blockchain Developer Bootcamp" project from [DApp University](https://www.dappuniversity.com/). 

## [ BACKGROUND ]

I started this project to gain exposure to Solidity programming and the React framework.  The project is split into two parts.  The first part focuses on building an ERC20 token in Solidity.  For this I used [Truffle](https://www.trufflesuite.com/docs/truffle/overview) and [Ganache](https://www.trufflesuite.com/ganache) to implement the necessary contracts and deploy it to the Ethereum test net.  The second part focused on creating a clean UI in a web browser using React.  By connecting the React App with the blockchain via Metamask, I was able to include several useful features such as price charts, order books, and the ability to create / delete new orders.

## [ DEMO ]
![Alt Text](blockchain_developer_bootcamp_demo.gif)

## [ STACK ]
- Truffle Suite (including Ganache)
- Solidity
- Javascript (React, Redux, Mocha)
- Infura
- Heroku

## [ LESSONS LEARNED ]

This project was my first experience with both Solidity and React.  The first half of the project helped acclimate me to the Solidity language, interacting with the test blockchain supplied by Ganache, and test-driven development in the Truffle environment.  Taking the next step and connecting my ERC20 token to the React App was very benificial because it made me work through the challenges associated with making Solidity smart contracts and their functions easily available to users through an effective UI in React.  Had I only worked on learning Solidity and React on different projects, it would not have been as powerful. Moving forward I feel excited to continue growing my knowledge of Solidity and enabling others to interact with my smart contracts via responsive interfaces.
