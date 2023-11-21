import jayson from 'jayson/promise'
import { responseExtractor } from '../helpers/responseExtractor'

export default class QueryApi {
  constructor (rpcURL) {
    this.rpc_url = rpcURL
    this.client = jayson.client.http(this.rpc_url)
  }

  // --------------- Get version of the Blockchain ---------------- //
  async GetVersion (schema) {
    try {
      let response = await this.client.request('script.GetVersion', [])
      return responseExtractor(response, schema)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // --------------- Get the Status of the Blockchain ---------------- //
  async GetStatus (schema) {
    try {
      let response = await this.client.request('script.GetStatus', [])
      return responseExtractor(response, schema)
    } catch (error) {
      console.error(error)
    }
  }

  // ---------------------- Retrieve an account ---------------------- //
  async GetAccount (address, schema) {
    try {
      let response = await this.client.request('script.GetAccount', [{ address: address }])
      return responseExtractor(response, schema)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // ------------- Get a block with the given block hash ------------- //
  async GetBlock (hash, schema) {
    try {
      let response = await this.client.request('script.GetBlock', [{ hash: hash }])
      return responseExtractor(response, schema)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // ---------------- Get a block at the given height ---------------- //
  async GetBlockByHeight (height, schema) {
    try {
      let response = await this.client.request('script.GetBlockByHeight', [{ height: height.toString() }])
      return responseExtractor(response, schema)
    } catch (error) {
      console.error(error)
    }
  }

  // ------- Get a transaction with the given transaction hash ------- //
  async GetTransaction (hash, schema) {
    try {
      let response = await this.client.request('script.GetTransaction', [{ hash: hash }])
      return responseExtractor(response, schema)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // ------- Get pending transactions ------- //
  async GetPendingTransactions (schema) {
    try {
      let response = await this.client.request('script.GetPendingTransactions', [])
      return responseExtractor(response, schema)
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
