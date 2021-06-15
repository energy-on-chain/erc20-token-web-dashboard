import {tokens, EVM_REVERT} from './helpers'

const Exchange = artifacts.require('./Exchange')

require('chai')
	.use(require('chai-as-promised'))
	.should()


contract('Exchange', ([deployer, feeAccount]) => {

	let exchange

	beforeEach(async () => {
		exchange = await Exchange.new(feeAccount)	// fetch token from blockchain
	})

	describe('deployment', () => {
		it('tracks the fee account', async () => {
			const result = await exchange.feeAccount()
			result.should.equal(feeAccount)
		})
	})
})
