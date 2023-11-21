package org.script;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONObject;


public final class App {

    private final static String RPC_URL = "http://localhost:16888/rpc";
    private static int rpcID = 1;

    
    public static void main(String[] args) throws Exception {

        // --------------- Get the Status of the Blockchain ---------------- //
        String rpcMethod = "script.GetStatus";
        JSONObject params = new JSONObject();
        JSONObject getStatusResult = post(rpcMethod, params);
        printRPCCallResult(rpcMethod, getStatusResult);

        // ---------------- Get a block at the given height ---------------- //
        int blockHeight = 1;
        rpcMethod = "script.GetBlockByHeight";
        params = new JSONObject();
        params.put("height", Integer.toString(blockHeight));
        JSONObject getBlockByHeightResult = post(rpcMethod, params);
        printRPCCallResult(rpcMethod, getBlockByHeightResult);

        // ------------- Get a block with the given block hash ------------- //
        String blockHash = getBlockHash(getBlockByHeightResult);
        rpcMethod = "script.GetBlock";
        params = new JSONObject();
        params.put("hash", blockHash);
        JSONObject getBlockResult = post(rpcMethod, params);
        printRPCCallResult(rpcMethod, getBlockResult);

        // ------- Get a transaction with the given transaction hash ------- //
        String txHash = getTheFirstTransactionHash(getBlockByHeightResult);
        rpcMethod = "script.GetTransaction";
        params = new JSONObject();
        params.put("hash", txHash);
        JSONObject getTransactionResult = post(rpcMethod, params);
        printRPCCallResult(rpcMethod, getTransactionResult);

        // ---------------------- Retrieve an account ---------------------- //
        String address = "0x2E833968E5bB786Ae419c4d13189fB081Cc43bab";
        rpcMethod = "script.GetAccount";
        params = new JSONObject();
        params.put("address", address);
        JSONObject getAccountResult = post(rpcMethod, params);
        printRPCCallResult(rpcMethod, getAccountResult);
    }  

    private static JSONObject post(String rpcMethod, JSONObject params) throws Exception {
        HttpClient client = HttpClientBuilder.create().build();
        HttpPost post = new HttpPost(App.RPC_URL);
        JSONObject data = new JSONObject();
        data.put("jsonrpc", "2.0");
        data.put("method", rpcMethod);
        data.put("params", params);
        data.put("id", App.rpcID);

        String dataStr = data.toString();
        post.setEntity(new StringEntity(dataStr));
        post.setHeader("Content-type", "application/json");
        
        HttpResponse response = client.execute(post);
        App.rpcID ++;

        HttpEntity entity = response.getEntity();        
        if (entity != null) {
            String content = EntityUtils.toString(entity);
            JSONObject contentJson = new JSONObject(content);
            return contentJson;
        }

        return new JSONObject();
    }

    private static String getBlockHash(JSONObject blockJSONObj) throws Exception {
        String blockHash = "";
        try {
            blockHash = blockJSONObj.getJSONObject("result").getString("hash");
        } catch (Exception e) {
            throw new Exception(String.format("Malformed block JSON object: %s, error: %s", blockJSONObj, e));
        }
        return blockHash;
    }

    private static String getTheFirstTransactionHash(JSONObject blockJSONObj) throws Exception {
        String firstTxHash = "";
        try {
            JSONArray txs = blockJSONObj.getJSONObject("result").getJSONArray("transactions");
            if (txs.length() >= 1) {
                JSONObject firstTx = txs.getJSONObject(0);
                firstTxHash = firstTx.getString("hash");
            }
        } catch (Exception e) {
            throw new Exception(String.format("Malformed block JSON object: %s, error: %s", blockJSONObj, e));
        }
        return firstTxHash;
    }

    private static void printRPCCallResult(String rpcMethod, JSONObject rpcCallResult) {
        System.out.println("-------------------------------------------------------");
        System.out.printf("RPC Call \"%s\" Result:", rpcMethod);
        System.out.println("");
        System.out.println(rpcCallResult.toString());
        System.out.println("-------------------------------------------------------");
        System.out.println("");
    }
}
