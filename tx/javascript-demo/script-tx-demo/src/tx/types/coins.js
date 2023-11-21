import Bytes from 'eth-lib/lib/bytes';
import BigNumber from 'bignumber.js';

export class Coins{
    constructor(SCPTWei, SPAYWei){
        this.SCPTWei = SCPTWei;
        this.SPAYWei = SPAYWei;
    }

    rlpInput(){

        let rlpInput = [
            (this.SCPTWei.isEqualTo(new BigNumber(0))) ? Bytes.fromNat("0x0") : Bytes.fromNumber(this.SCPTWei),
            (this.SPAYWei.isEqualTo(new BigNumber(0))) ? Bytes.fromNat("0x0") : Bytes.fromNumber(this.SPAYWei)
        ];

        return rlpInput;
    }
}