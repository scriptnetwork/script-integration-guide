import {Coins} from './coins';

export class TxOutput {
    constructor(address, SCPTWei, SPAYWei) {
        this.address = address;
        this.coins = new Coins(SCPTWei, SPAYWei);
    }

    rlpInput(){
        let rplInput = [
            this.address.toLowerCase(),
            this.coins.rlpInput()
        ];

        return rplInput;
    }
}