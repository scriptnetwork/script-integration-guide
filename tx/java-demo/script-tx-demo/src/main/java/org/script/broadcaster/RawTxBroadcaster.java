package org.script.broadcaster;

import org.apache.commons.codec.binary.Hex;
import org.json.JSONObject;
import org.script.common.RPC;

public final class RawTxBroadcaster {

    private static RPC rpc;

    public static void setRPC(RPC rpc) {
        RawTxBroadcaster.rpc = rpc;
    }

    public static void broadcast(byte[] rawTx) throws Exception {
        String rpcMethod = "script.BroadcastRawTransaction";
        JSONObject params = new JSONObject();
        params.put("tx_bytes", Hex.encodeHexString(rawTx));
        JSONObject broadcastRawTxResult = RawTxBroadcaster.rpc.call(rpcMethod, params);
        System.out.println("RPC Call \"script.BroadcastRawTransaction\" Result:");
        System.out.println("");
        System.out.println(broadcastRawTxResult.toString());
        System.out.println("");
    }
    
}