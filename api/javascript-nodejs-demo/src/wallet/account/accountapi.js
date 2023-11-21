import jayson from 'jayson/promise'

export default class AccountApi {
  constructor (rpcURL) {
    this.rpc_url = rpcURL
    this.client = jayson.client.http(this.rpc_url)
  }

  // --------------- Creates a new account ---------------- //
  async NewKey (password) {
    try {
      let response = await this.client.request('scriptcli.NewKey', [{ password }])
      return response.result
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // --------------- Lists the addresses of all the accounts on the local machine ---------------- //
  async ListKeys () {
    try {
      let response = await this.client.request('scriptcli.ListKeys', [])
      return response.result
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // --------------- Unlocks an account ---------------- //
  async UnlockKey (address, password) {
    try {
      let response = await this.client.request('scriptcli.UnlockKey', [{ address, password }])
      return response.result
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // --------------- Locks an account ---------------- //
  async LockKey (address) {
    try {
      let response = await this.client.request('scriptcli.LockKey', [{ address }])
      return response.result
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // --------------- Returns whether an account is currently unlocked ---------------- //
  async IsKeyUnlocked (address) {
    try {
      let response = await this.client.request('scriptcli.IsKeyUnlocked', [{ address }])
      return response.result
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
