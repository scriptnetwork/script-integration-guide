import TxApi from '../../src/wallet/tx/txapi'
import AccountApi from '../../src/wallet/account/accountapi'
import QueryApi from '../../src/node/queryapi'
import SendParameters from '../../src/wallet/tx/types/sendparameters'
import BigNumber from 'bignumber.js'
import { printToConsole } from '../testhelpers'
import { coinsSchema, sendPrerequistSchema } from '../../src/wallet/schemas/accountschemas'
import delay from 'delay'

jest.setTimeout(20000)

const scriptRpcPort = 16888
const scriptCliRpcPort = 16889
const queryApi = new QueryApi(`http://localhost:${scriptRpcPort}/rpc`)
const accountApi = new AccountApi(`http://localhost:${scriptCliRpcPort}/rpc`)
const underTest = new TxApi(`http://localhost:${scriptCliRpcPort}/rpc`)

// hard-coded privateKey for testing purposes only
const password = 'qwertyuiop'
const senderAddr = '0x2E833968E5bB786Ae419c4d13189fB081Cc43bab'
const receiverAddr = '0x0d2fd67d573c8ecb4161510fc00754d64b401f86'

const ten18 = (new BigNumber(10)).pow(18) // 10^18, 1 Script = 10^18 ScriptWei, 1 Gamma = 10^ SPAYWei
const SCPTWei = (new BigNumber(2)).multipliedBy(ten18)
const SPAYWei = (new BigNumber(3)).multipliedBy(ten18)
const feeInSPAYWei = (new BigNumber(10)).pow(12) // Any fee >= 10^12 SPAYWei should work, higher fee yields higher priority

afterAll(async () => {
  // sent back the coins
  await accountApi.UnlockKey(receiverAddr, password)
  let account = await queryApi.GetAccount(receiverAddr, sendPrerequistSchema)
  let sendQuery = new SendParameters('scriptnet', receiverAddr, senderAddr, SCPTWei.multipliedBy(2), SPAYWei.multipliedBy(2), feeInSPAYWei, account.sequence.plus(1), true)
  await underTest.Send(sendQuery)
})

it('send tx', async (done) => {
  let toAccount
  try {
    toAccount = await queryApi.GetAccount(receiverAddr, coinsSchema)
  } catch (error) {
    if (error.message.search('not found')) {
      toAccount = {}
      toAccount.spaywei = 0
      toAccount.SCPTWei = 0
    }
  }

  let fromAccount = await queryApi.GetAccount(senderAddr, sendPrerequistSchema)
  let sendQuery = new SendParameters('scriptnet', senderAddr, receiverAddr, SCPTWei, SPAYWei, feeInSPAYWei, fromAccount.sequence.plus(1), false)
  await accountApi.UnlockKey(senderAddr, password)
  let actual = await underTest.Send(sendQuery)

  printToConsole('send tx', actual)

  let {
    hash,
    block: {
      ChainID,
      Epoch,
      Height,
      Parent,
      HCC: {
        Votes,
        BlockHash
      },
      TxHash,
      StateHash,
      Timestamp,
      Proposer,
      Signature

    }
  } = actual

  expect(hash).toBeDefined()
  expect(ChainID).toBe('scriptnet')
  expect(Epoch).toBeDefined()
  expect(Height).toBeDefined()
  expect(Parent).toBeDefined()
  expect(Votes).toBeDefined()
  expect(BlockHash).toBeDefined()
  expect(TxHash).toBeDefined()
  expect(StateHash).toBeDefined()
  expect(Timestamp).toBeDefined()
  expect(Proposer).toBeDefined()
  expect(Signature).toBeDefined()

  let newFromBalance = await queryApi.GetAccount(senderAddr, coinsSchema)
  let newToBalance = await queryApi.GetAccount(receiverAddr, coinsSchema)

  expect(newFromBalance.scptwei).toEqual(fromAccount.scptwei.minus(SCPTWei))
  expect(newFromBalance.spaywei).toEqual(fromAccount.spaywei.minus(SPAYWei).minus(feeInSPAYWei))

  expect(newToBalance.scptwei).toEqual(toAccount.scptwei.plus(SCPTWei))
  expect(newToBalance.spaywei).toEqual(toAccount.spaywei.plus(SPAYWei))

  done()
})

it('send async tx', async (done) => {
  let toAccount
  try {
    toAccount = await queryApi.GetAccount(receiverAddr, coinsSchema)
  } catch (error) {
    if (error.message.search('not found')) {
      toAccount = {}
      toAccount.spaywei = 0
      toAccount.SCPTWei = 0
    }
  }

  let fromAccount = await queryApi.GetAccount(senderAddr, sendPrerequistSchema)
  let sendQuery = new SendParameters('scriptnet', senderAddr, receiverAddr, SCPTWei, SPAYWei, feeInSPAYWei, fromAccount.sequence.plus(1), true)
  await accountApi.UnlockKey(senderAddr, password)
  let actual = await underTest.Send(sendQuery)

  printToConsole('send async tx', actual)

  let { hash } = actual

  expect(hash).toBeDefined()

  try {
    let result = await queryApi.GetTransaction(hash)

    do {
      result = await queryApi.GetTransaction(hash)
      await delay(1500)
      printToConsole(`transaction status ${new Date().toLocaleTimeString()}`, result.status)
    } while (result.status !== 'finalized')
  } catch (error) {
    console.error(error)
  }

  let newFromBalance = await queryApi.GetAccount(senderAddr, coinsSchema)
  let newToBalance = await queryApi.GetAccount(receiverAddr, coinsSchema)

  expect(newFromBalance.scptwei).toEqual(fromAccount.scptwei.minus(SCPTWei))
  expect(newFromBalance.spaywei).toEqual(fromAccount.spaywei.minus(SPAYWei).minus(feeInSPAYWei))

  expect(newToBalance.scptwei).toEqual(toAccount.scptwei.plus(SCPTWei))
  expect(newToBalance.spaywei).toEqual(toAccount.spaywei.plus(SPAYWei))

  done()
})
z