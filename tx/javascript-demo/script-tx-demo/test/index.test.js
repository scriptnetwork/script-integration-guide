const BigNumber = require('bignumber.js');
const scriptjs = require('..');
const SendTx = scriptjs.SendTx;
const TxSigner = scriptjs.TxSigner;
const Utils = scriptjs.Utils;

const chainID = "testnet";

function createSendTx(){
    const ten18 = (new BigNumber(10)).pow(18); // 10^18, 1 Script = 10^18 ScriptWei, 1 Gamma = 10^ SPAYWei
    const SCPTWeiToSend = (new BigNumber(2)).multipliedBy(ten18);
    const SPAYWeiToSend = (new BigNumber(3)).multipliedBy(ten18);
    const feeInSPAYWei  = (new BigNumber(10)).pow(12); // Any fee >= 10^12 SPAYWei should work, higher fee yields higher priority
    const senderAddr =  "0x59c32D1F9fF59FE524aaA34B703C0aC8Fad4d4d0";
    const receiverAddr = "0xB91f6163E6f1A60b6d932dcD1C190BD364e0df05";
    const senderSequence = 1; //TODO: this should be dynamic, similar to the "nonce" parameter for Ethereum

    let tx = new SendTx(senderAddr, receiverAddr, SCPTWeiToSend, SPAYWeiToSend, feeInSPAYWei, senderSequence);

    console.log("Assembled a SendTx transaction\n\tfrom   : " + senderAddr + "\n\tto     : " + receiverAddr 
        + "\n\tamount : " + SCPTWeiToSend + " ScriptWei, " + SPAYWeiToSend + " SPAYWei"
        + "\n\tfee    : " + feeInSPAYWei + " SPAYWei"
        + "\n\tseq    : " + senderSequence)

    return tx;
}

test('should sign and serialize a SendTx', () => {
    // hard-coded privateKey for testing purposes only :)
    let privateKey = "0xc88b2d8a81ceea76b41e005556c1c77c0062a5ba0566a1fe214770f485adde4f";
    let sendTx = createSendTx();

    const signedRawTxBytes = TxSigner.signAndSerializeTx(chainID, sendTx, privateKey);

    console.log("SignedRawTxBytes: " + signedRawTxBytes.toString('hex'));

    expect(signedRawTxBytes).not.toBe(null);
});