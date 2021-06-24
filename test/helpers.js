export const EVM_REVERT = 'VM Exception while processing transaction: revert'

export const tokens = (n) => {
	return new web3.utils.BN(
		web3.utils.toWei(n.toString(), 'ether')
	)
}

export const eventCheck = (result, eventString) => {
	const log = result.logs[0]
	log.event.should.eq(eventString)
	const event = log.args
	return event
}
