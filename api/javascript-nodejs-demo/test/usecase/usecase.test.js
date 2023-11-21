import AccountApi from '../../src/wallet/account/accountapi'
import QueryApi from '../../src/node/queryapi'
import { printToConsole } from '../testhelpers'

jest.setTimeout(15000)

const scriptRpcPort = 16888
const scriptCliRpcPort = 16889
const queryApi = new QueryApi(`http://localhost:${scriptRpcPort}/rpc`)
const accountApi = new AccountApi(`http://localhost:${scriptCliRpcPort}/rpc`)

it('Get Balance of all accounts', async () => {
  let accounts = await accountApi.ListKeys()

  let { addresses } = accounts

  printToConsole(addresses)

  for (const address of addresses) {
    try {
      const account = await queryApi.GetAccount(address)
      console.warn(`${address} | script: ${account.coins.scptwei} | spay: ${account.coins.spaywei}`)
    } catch (error) {
      console.error(error)
    }
  }
})
