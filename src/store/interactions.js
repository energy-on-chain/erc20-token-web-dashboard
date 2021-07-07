import { web3Loaded, web3AccountLoaded, tokenLoaded, exchangeLoaded, cancelledOrdersLoaded, filledOrdersLoaded, allOrdersLoaded } from './actions'
import Web3 from 'web3'
import Token from '../abis/Token.json'
import Exchange from '../abis/Exchange.json'

// Interactions extract data from the connected blockchain

export const loadWeb3 = (dispatch) => {
	const connection = new Web3(Web3.givenProvider || 'http://localhost:7545')
	dispatch(web3Loaded(connection))
	return connection
}

export const loadAccount = async (web3, dispatch) => {
	const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
	const account = accounts[0]
	dispatch(web3AccountLoaded(account))
	return account
}

export const loadToken = async (web3, networkId, dispatch) => {
	try {
		const token = new web3.eth.Contract(Token.abi, Token.networks[networkId].address)
		dispatch(tokenLoaded(token))
		return token
	} catch (error) {
		console.log('Contract not deployed to the current network.  Please select another network with Metamask.')
		return null
	}
}

export const loadExchange = async (web3, networkId, dispatch) => {
	try {
		const exchange = new web3.eth.Contract(Exchange.abi, Exchange.networks[networkId].address)
		dispatch(exchangeLoaded(exchange))
		return exchange
	} catch (error) {
		console.log('Contract not deployed to the current network.  Please select another network with Metamask.')
		return null
	}
}

export const loadAllOrders = async (exchange, dispatch) => {
	// Fetch cancelled orders with the 'cancel' event stream
	const cancelStream = await exchange.getPastEvents('Cancel', { fromBlock: 0, toBlock: 'latest'})
	// Format cancelled orders
	const cancelledOrders = cancelStream.map((event) => event.returnValues)
	// Add cancelled orders to the redux store
	dispatch(cancelledOrdersLoaded(cancelledOrders))
	
	// Fetch filled orders with the 'trade' event stream
	const tradeStream = await exchange.getPastEvents('Trade', { fromBlock: 0, toBlock: 'latest'})
	// Format filled orders
	const filledOrders = tradeStream.map((event) => event.returnValues)
	// Add filled orders to the redux store
	dispatch(filledOrdersLoaded(filledOrders))

	// Load orders stream
	const orderStream = await exchange.getPastEvents('Order', { fromBlock: 0, toBlock: 'latest'})
	// Format orders stream
	const allOrders = orderStream.map((event) => event.returnValues)
	// Add open orders to the redux store
	dispatch(allOrdersLoaded(allOrders))
}