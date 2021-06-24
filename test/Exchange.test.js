import {eventCheck, tokens, ether, EVM_REVERT, ETHER_ADDRESS} from './helpers'

const Token = artifacts.require('./Token')
const Exchange = artifacts.require('./Exchange')

require('chai')
	.use(require('chai-as-promised'))
	.should()


contract('Exchange', ([deployer, feeAccount, user1, user2, user3]) => {
	let token
	let exchange
	const feePercent = 10

	beforeEach(async () => {
		// Deploy token to the blockchain
		token = await Token.new()

		// Transfer some tokens to user1
		token.transfer(user1, tokens(10), {from: deployer})

		// Deploy exchange to the blockchain
		exchange = await Exchange.new(feeAccount, feePercent)	// fetch exchange from blockchain
	})

	describe('deployment', () => {
		it('tracks the fee account', async () => {
			const result = await exchange.feeAccount()
			result.should.equal(feeAccount)
		})

		it('tracks the fee percent', async() => {
			const result = await exchange.feePercent()
			result.toString().should.equal(feePercent.toString())
		})
	})

	describe('fallback', () => {
		it('reverts when Ether is sent', async() => {
			await exchange.sendTransaction({value: 1, from: user1}).should.be.rejectedWith(EVM_REVERT)
		})
	})

	describe('depositing Ether', () => {
		let result
		let amount

		beforeEach(async () => {
			amount = ether(1)
			result = await exchange.depositEther({from: user1, value: amount})
		})

		it('tracks the Ether deposit', async() => {
			const balance = await exchange.tokens(ETHER_ADDRESS, user1)
			balance.toString().should.equal(amount.toString())
		}) 

		it('emits a Deposit event', async() => {
			const event = eventCheck(result, 'Deposit')
			event.token.should.equal(ETHER_ADDRESS, 'token (ether) address is correct')
			event.user.should.equal(user1, 'user address is correct')
			event.amount.toString().should.equal(amount.toString(), 'amount is correct')
			event.balance.toString().should.equal(amount.toString(), 'balance is correct')
		})
	})

	describe('withdrawing Ether', async () => {
		let result
		let amount

		beforeEach(async() => {
			amount = ether(1)
			await exchange.depositEther({from: user1, value: amount})
		})

		describe('success', async () => {
			beforeEach(async () => {
				// Withdraw ether
				result = await exchange.withdrawEther(amount, {from: user1})
			})

			it('withdraws Ether funds', async () => {
				const balance = await exchange.tokens(ETHER_ADDRESS, user1)
				balance.toString().should.equal('0')
			})

			it('emits a Withdraw event', async() => {
				const event = eventCheck(result, 'Withdraw')
				event.token.should.equal(ETHER_ADDRESS, 'token (ether) address is correct')
				event.user.should.equal(user1, 'user address is correct')
				event.amount.toString().should.equal(amount.toString(), 'amount is correct')
				event.balance.toString().should.equal('0', 'balance is correct')
			})
		})

		describe('failure', async () => {
			it('rejects withdraws with insufficient balances', async() => {
				await exchange.withdrawEther(ether(100), { from: user1 }).should.be.rejectedWith(EVM_REVERT)
			})
		})
	})

	describe('depositing tokens', () => {
		let result
		let amount

		describe('success', () => {

			beforeEach(async () => {
				amount = tokens(10)
				await token.approve(exchange.address, amount, {from: user1})
				result = await exchange.depositToken(token.address, amount, {from: user1})
			})

			it('tracks the token deposit', async() => {
				// Check exchange token balance
				let balance
				balance = await token.balanceOf(exchange.address)
				balance.toString().should.equal(amount.toString())
				// Check tokens on exchange
				balance = await exchange.tokens(token.address, user1)
				balance.toString().should.equal(amount.toString())
			})

			it('emits a Deposit event', async() => {
				const event = eventCheck(result, 'Deposit')
				event.token.should.equal(token.address, 'token address is correct')
				event.user.should.equal(user1, 'user address is correct')
				event.amount.toString().should.equal(tokens(10).toString(), 'amount is correct')
				event.balance.toString().should.equal(tokens(10).toString(), 'balance is correct')
			})
		})

		describe('failure', () => {
			it('rejects Ether deposits', async() => {
				await exchange.depositToken(ETHER_ADDRESS, tokens(10), { from: user2 }).should.be.rejectedWith(EVM_REVERT)
			})

			it('fails when no tokens are approved', async() => {
				// Don't approve any tokens before depositing
				await exchange.depositToken(token.address, tokens(10), { from: user2 }).should.be.rejectedWith(EVM_REVERT)
			})
		})
	})
})
