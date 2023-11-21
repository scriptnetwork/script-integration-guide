import BigNumber from 'bignumber.js'

export const coinsSchema = {
  scptwei: { path: 'coins.scptwei', fn: x => { return new BigNumber(x) } },
  spaywei: { path: 'coins.spaywei', fn: x => { return new BigNumber(x) } }
}

export const sendPrerequistSchema = {
  sequence: { path: 'sequence', fn: x => { return new BigNumber(x) } },
  scptwei: { path: 'coins.scptwei', fn: x => { return new BigNumber(x) } },
  spaywei: { path: 'coins.spaywei', fn: x => { return new BigNumber(x) } }
}
