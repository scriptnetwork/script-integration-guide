package org.script.tx.types;

import java.math.BigInteger;
import org.ethereum.util.RLP;

public final class Coins {
    
    public BigInteger SCPTWei;
    public BigInteger SPAYWei;

    public Coins(BigInteger SCPTWei, BigInteger SPAYWei) {
        this.SCPTWei = SCPTWei;
        this.SPAYWei = SPAYWei;
    }

    public byte[] rlpEncode() {
        byte[] rlpEncoded = RLP.encodeList(
            RLP.encode(this.SCPTWei),
            RLP.encode(this.SPAYWei));
        return rlpEncoded;
    }
}
