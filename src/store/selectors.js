import { get } from 'lodash'
import { createSelector } from 'reselect'

const account = state => get(state, 'web3.account')
export const accountSelector = new createSelector(account, a => a)

const tokenLoaded = state => get(state, 'token.loaded', false)
export const tokenLoadedSelector = new createSelector(tokenLoaded, tl => tl)

const exchangeLoaded = state => get(state, 'exchange.loaded', false)
export const exchangeLoadedSelector = new createSelector(exchangeLoaded, el => el)

export const contractsLoadedSelector = new createSelector(tokenLoaded, exchangeLoaded, (tl, el) => (tl && el))
