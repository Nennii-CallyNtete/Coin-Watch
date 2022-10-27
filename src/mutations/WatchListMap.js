import axios from 'axios';

export class WatchListMap {
    constructor(){
        this.list = {};
        this.length = 0;
        this.temp_store = null;
        this.initial_size = 10;
        this.available_size = 10;
    }

    addKey(coin_id){
        if(this.available_size > 0){
            if(Object.hasOwn(this.list, coin_id)){return false};
            if(coin_id){ 
                this.#getKeyData(coin_id).then((data)=>{
                    this.list[coin_id] = {value : data.prices}
                })
            }
            this.length++;
            this.available_size-=2
            return this;
        }
    };

    async #getKeyData(coin_id){
        try{
            const hit = await axios.get(`https://api.coingecko.com/api/v3/coins/${coin_id}/market_chart?vs_currency=usd&days=30&interval=hourly`)
            return hit.data;
        }
        catch (err) {
            console.log(err)
        }
    }

    updateKey(coin_id){
        if(Object.hasOwn(this.list, coin_id)){
            this.#getKeyData(coin_id).then((data)=>{
                this.temp_store = data.prices;
            });
            let refLastRecord = this.list.coin_id.value.shift();
            let refNewRecord = this.temp_store.shift();
            if(refLastRecord === refNewRecord){return "Already up to date"}
            if(refLastRecord !== refNewRecord){
                this.list[coin_id] = {value: this.temp_store};
                this.temp_store = null;
            }
        }
    }
}