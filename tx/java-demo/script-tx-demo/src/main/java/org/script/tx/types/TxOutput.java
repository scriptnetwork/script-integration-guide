package org.script.tx.types;

import java.math.BigInteger;
import org.ethereum.util.RLP;

public final class TxOutput {

    public byte[] address;
    public Coins  coins;

    public TxOutput(byte[] address, BigInteger SCPTWei, BigInteger SPAYWei) {
        this.address = address;
        this.coins = new Coins(SCPTWei, SPAYWei);
    }

    public byte[] rlpEncode() {
        byte[] rlpEncoded = RLP.encodeList(
            RLP.encode(this.address),
            this.coins.rlpEncode());
        return rlpEncoded;
    }
}