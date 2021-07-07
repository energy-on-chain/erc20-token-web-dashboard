import { get } from 'lodash'
import { createSelector } from 'reselect'

// Selectors extract data that is being tracked in the redux state so it can be inserted into the React app html

const account = state => get(state, 'web3.account')
export const accountSelector = new createSelector(account, a => a)

const tokenLoaded = state => get(state, 'token.loaded', false)
export const tokenLoadedSelector = new createSelector(tokenLoaded, tl => tl)

const exchangeLoaded = state => get(state, 'exchange.loaded', false)
export const exchangeLoadedSelector = new createSelector(exchangeLoaded, el => el)

const exchange = state => get(state, 'exchange.contract')
export const exchangeSelector = createSelector(exchange, e => e)

export const contractsLoadedSelector = new createSelector(tokenLoaded, exchangeLoaded, (tl, el) => (tl && el))

const filledOrdersLoaded = state => get(state, 'exchange.filledOrders.loaded', false)
export const filledOrdersLoadedSelector = new createSelector(filledOrdersLoaded, loaded => loaded)

const filledOrders = state => get(state, 'exchange.filledOrders.data', [])
export const filledOrdersSelector = new createSelector(
	filledOrders, 
	(orders) => { 
		// Decorate the orders
		// TODO... fill me in

		// Sort orders by date descending for display
		orders = orders.sort((a, b) => b.timestamp - a.timestamp)
		console.log(orders) 
	}
)

const decorateFilledOrders = (orders) => {
	return (
		orders.map((order) => {
			order = decorateOrder(order)
		})
	)
}

const decorateOrder = (order) => {
	// TODO... fill me in
}
