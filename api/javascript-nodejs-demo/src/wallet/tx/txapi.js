import jayson from 'jayson/promise'
import { responseExtractor } from '../../helpers/responseExtractor'


export default class TxApi {
  constructor (rpcURL) {
    this.rpc_url = rpcURL
    this.client = jayson.client.http(this.rpc_url)
  }

  // --------------- Sends the SCPT/SPAY tokens ---------------- //
  async Send (sendQuery, schema) {
    try {
      let response = await this.client.request('scriptcli.Send', [sendQuery])
      return responseExtractor(response, schema)
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
