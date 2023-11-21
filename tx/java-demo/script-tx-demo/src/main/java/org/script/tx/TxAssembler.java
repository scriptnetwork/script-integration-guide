package org.script.tx;

import java.math.BigInteger;

import org.spongycastle.util.encoders.Hex;
import org.script.tx.types.SendTx;

public final class TxAssembler {

    public static SendTx assembleSendTx(String senderAddr, String receiverAddr, 
        BigInteger SCPTWei, BigInteger SPAYWei, BigInteger feeInSPAYWei, long senderSequence) {
        SendTx sendTx = new SendTx(Hex.decode(senderAddr), Hex.decode(receiverAddr), SCPTWei, SPAYWei, feeInSPAYWei, senderSequence);
        return sendTx;
    }

}