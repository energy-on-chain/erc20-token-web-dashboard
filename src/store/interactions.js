import { 
	web3Loaded, 
	web3AccountLoaded, 
	tokenLoaded,
	exchangeLoaded, 
	cancelledOrdersLoaded, 
	filledOrdersLoaded, 
	allOrdersLoaded, 
	orderCancelling, 
	orderCancelled, 
	orderFilling, 
	orderFilled, 
	etherBalanceLoaded, 
	tokenBalanceLoaded, 
	exchangeEtherBalanceLoaded,
	exchangeTokenBalanceLoaded,
	balancesLoaded,
	balancesLoading 
} from './actions'
import Web3 from 'web3'
import Token from '../abis/Token.json'
import Exchange from '../abis/Exchange.json'
import { ETHER_ADDRESS } from '../helpers'

// Interactions handle communication between the blockchain and the redux store

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

export const subscribeToEvents = async (exchange, dispatch) => {
	exchange.events.Cancel({}, (error, event) => {
		dispatch(orderCancelled(event.returnValues))
	})
	exchange.events.Trade({}, (error, event) => {
		dispatch(orderFilled(event.returnValues))
	})
	exchange.events.Deposit({}, (error, event) => {
		dispatch(balancesLoaded())
	})	
	exchange.events.Withdraw({}, (error, event) => {
		dispatch(balancesLoaded())
	})
}

export const cancelOrder = async (dispatch, exchange, order, account) => {
	exchange.methods.cancelOrder(order.id).send({from: account})
	.on('transactionHash', (hash) => {
		dispatch(orderCancelling())
	})
	.on('error', (error) => {
		console.log(error)
		window.alert('There was an error with cancelling the order!')
	})
}

export const fillOrder = async (dispatch, exchange, order, account) => {
	console.log('here is the order:', order)
	console.log('here is the order count:', exchange.methods.orderCount().call({from: account}))
	console.log('here is the order cancelled check result:', exchange.methods.orderCancelled(order.id).call({from: account}))
	console.log('here is the order filled check result:', exchange.methods.orderFilled(order.id).call({from: account}))
	exchange.methods.fillOrder(order.id).send({from: account, gas: '6721975'})
	.on('transactionHash', (hash) => {
		dispatch(orderFilling())
	})
	.on('error', (error) => {
		console.log("Here's the error!", error)
		console.log('was the order still placed in the filled array?', exchange.methods.orderFilled(order.id).call({from: account}))
		window.alert('There was an error with filling the order!')
	})
}

export const loadBalances = async (dispatch, web3, exchange, token, account) => {
	// Ether balance in wallet
	const etherBalance = await web3.eth.getBalance(account)
	dispatch(etherBalanceLoaded(etherBalance))

	// Token balance in wallet
	const tokenBalance = await token.methods.balanceOf(account).call()
	dispatch(tokenBalanceLoaded(tokenBalance))

	// Ether balance on exchange
	const exchangeEtherBalance = await exchange.methods.balanceOf(ETHER_ADDRESS, account).call()
	dispatch(exchangeEtherBalanceLoaded(exchangeEtherBalance))

	// Token balance on exchange
	const exchangeTokenBalance = await exchange.methods.balanceOf(token.options.address, account).call()
	dispatch(exchangeTokenBalanceLoaded(exchangeTokenBalance))

	// Trigger all balances loaded
	dispatch(balancesLoaded())
}

export const depositEther = (dispatch, exchange, web3, amount, account) => {
	exchange.methods.depositEther().send({from: account, value: web3.utils.toWei(amount, 'ether') })
	.on('transactionHash', (hash) => {
		dispatch(balancesLoading())
	})
	.on('error', (error) => {
		console.error(error)
		window.alert('There was an error depositing Ether!')
	})
}

export const withdrawEther = (dispatch, exchange, web3, amount, account) => {
	exchange.methods.withdrawEther(web3.utils.toWei(amount, 'ether')).send({from: account})
	.on('transactionHash', (hash) => {
		dispatch(balancesLoading())
	})
	.on('error', (error) => {
		console.error(error)
		window.alert('There was an error withdrawing Ether!')
	})
}

export const depositToken = (dispatch, exchange, web3, token, amount, account) => {
	console.log('the amount is:', amount)
	console.log(typeof(amount))
	amount = web3.utils.toWei(amount, 'ether')

	token.methods.approve(exchange.options.address, amount).send({ from: account })
	.on('transactionHash', (hash) => {
		exchange.methods.depositToken(token.options.address, amount).send({from: account})
		.on('transactionHash', (hash) => {
			dispatch(balancesLoading())
		})
	.on('error', (error) => {
		console.error(error)
		window.alert('There was an error depositing the token!')
		})
	})
}


export const withdrawToken = (dispatch, exchange, web3, token, amount, account) => {
	exchange.methods.withdrawToken(token.options.address, web3.utils.toWei(amount, 'ether')).send({ from: account })
	.on('transactionHash', (hash) => {
		dispatch(balancesLoading())
	})
	.on('error', (error) => {
		console.error(error)
		window.alert('There was an error withdrawing Token!')
	})
}

