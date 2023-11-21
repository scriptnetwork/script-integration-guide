import { IsBoolean, validateSync } from 'class-validator'
import { IsWalletAddress } from '../../validators/walletaddressvalidator'

export default class SendParameters {
  @IsBoolean()
  async

  @IsWalletAddress('from', { message: 'Is not a valid wallet address' })
  from

  @IsWalletAddress('to', { message: 'Is not a valid wallet address' })
  to

  constructor (chainID, senderAddr, receiverAddr, SCPTWei, SPAYWei, feeInSPAYWei, senderSequence, async = true) {
    this.chain_id = chainID
    this.from = senderAddr
    this.to = receiverAddr
    this.SCPTWei = SCPTWei.toString()
    this.SPAYWei = SPAYWei.toString()
    this.sequence = senderSequence.toString()
    this.fee = feeInSPAYWei.toString()
    this.async = async

    this.validate()
  }

  validate () {
    let errors = validateSync(this)
    if (errors.length > 0) {
      console.error(errors)
      throw errors
    }
  }
}
