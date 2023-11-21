package org.script;

import java.math.BigInteger;

import org.apache.commons.codec.binary.Hex;
import org.json.JSONObject;
import org.script.broadcaster.RawTxBroadcaster;
import org.script.common.RPC;
import org.script.signer.TxSigner;
import org.script.tx.TxAssembler;
import org.script.tx.types.SendTx;

public final class App {
    
    private static RPC rpc;

    
     public static void main(String[] args) throws Exception {        
        String rpcUrl = "http://localhost:16888/rpc"; // can point to any Script node
        App.rpc = new RPC(rpcUrl);

        String chainID      = "scriptnet"; 
        String senderAddr   = "2E833968E5bB786Ae419c4d13189fB081Cc43bab";
        String receiverAddr = "9F1233798E905E173560071255140b4A8aBd3Ec6";

        System.out.println("");
        System.out.println("---------------- Account Balances before the SendTx ----------------\n");
        App.printAccountBalance(senderAddr);
        App.printAccountBalance(receiverAddr);
        System.out.println("--------------------------------------------------------------------");
        System.out.println("");

        System.out.println("----------------- Demo #1: Construct a Transaction -----------------");

        BigInteger ten18 = BigInteger.valueOf(10).pow(18); // 10^18, 1 Script = 10^18 ScriptWei, 1 SPAY = 10^ SPAYWei
        BigInteger SCPTWeiToSend = BigInteger.valueOf(10).multiply(ten18);
        BigInteger SPAYWeiToSend = BigInteger.valueOf(20).multiply(ten18);
        BigInteger feeInSPAYWei  = BigInteger.valueOf(10).pow(12); // Any fee >= 10^12 SPAYWei should work, higher fee yields higher priority
        long senderSequence = App.getAccountSequence(senderAddr) + 1; // similar to the "nonce" parameter in Ethereum transaction
        SendTx sendTx = TxAssembler.assembleSendTx(senderAddr, receiverAddr, SCPTWeiToSend, SPAYWeiToSend, feeInSPAYWei, senderSequence);
        System.out.printf("SendTx constructed: From %s to %s {ScriptWei: %d, SPAYWei: %d}\n\n",
            senderAddr, receiverAddr, SCPTWeiToSend, SPAYWeiToSend);

        System.out.println("---------- Demo #2: Sign and Serialize the Transaction -------------");
     
        // This demo illustrates how to sign and serialize the transaction (can be done on an offline machine).
        byte[] signedRawTxBytes = TxSigner.signAndSerializeTx(chainID, sendTx);
        System.out.printf("\nSigned SendTx Raw Bytes: %s\n\n", Hex.encodeHexString(signedRawTxBytes));
        
        System.out.println("--------------- Demo #3: Broadcast the Transaction -----------------");

        
        RawTxBroadcaster.setRPC(App.rpc);
        RawTxBroadcaster.broadcast(signedRawTxBytes);

        // --------------------------------------------------------------------- //

        System.out.println("");
        System.out.println("---------------- Account Balances after the SendTx -----------------\n");
        App.printAccountBalance(senderAddr);
        App.printAccountBalance(receiverAddr);
        System.out.println("--------------------------------------------------------------------");
        System.out.println("");
    }

    private static long getAccountSequence(String address) throws Exception {
        String rpcMethod = "script.GetAccount";
        JSONObject params = new JSONObject();
        params.put("address", address);
        JSONObject getAccountResult = App.rpc.call(rpcMethod, params);
        if (!getAccountResult.has("result")) {
            throw new Exception("Account does not exist: " + address);
        }
        long sequence = getAccountResult.getJSONObject("result").getLong("sequence");
        System.out.printf("Sequence of %s: %s\n\n", address, sequence);
        return sequence;
    }

    private static void printAccountBalance(String address) throws Exception {
        String rpcMethod = "script.GetAccount";
        JSONObject params = new JSONObject();
        params.put("address", address);
        JSONObject getAccountResult = App.rpc.call(rpcMethod, params);
        if (!getAccountResult.has("result")) {
            return; // Account does not exist yet
        }
        JSONObject coinsJSON = getAccountResult.getJSONObject("result").getJSONObject("coins");
        BigInteger SCPTWei = coinsJSON.getBigInteger("scptwei");
        BigInteger SPAYWei = coinsJSON.getBigInteger("spaywei");

        System.out.printf("Balance of %s:\n\tScriptWei: %s\n\tSPAYWei: %s\n\n", address, SCPTWei, SPAYWei);
    }
}
