import methods from '../modules/methods';
import Container from '../modules/data';

import enums from '../enums';

let tradeMarket = {};

tradeMarket.getBeach = async function(id, key) {
    return await Container.Data.Get(enums.offsets.trade + methods.parseInt(id), key);
};

tradeMarket.hasBeach = async function(id, key) {
    return await Container.Data.Has(enums.offsets.trade + methods.parseInt(id), key);
};

tradeMarket.setBeach = function(id, key, val) {
    Container.Data.Set(enums.offsets.trade + methods.parseInt(id), key, val);
};

tradeMarket.getBlack = async function(id, key) {
    return await Container.Data.Get(enums.offsets.tradeb + methods.parseInt(id), key);
};

tradeMarket.hasBlack = async function(id, key) {
    return await Container.Data.Has(enums.offsets.tradeb + methods.parseInt(id), key);
};

tradeMarket.setBlack = function(id, key, val) {
    Container.Data.Set(enums.offsets.tradeb + methods.parseInt(id), key, val);
};

tradeMarket.getAllBeachData = async function(id) {
    return await Container.Data.GetAll(enums.offsets.trade + methods.parseInt(id));
};

tradeMarket.getAllBlackData = async function(id) {
    return await Container.Data.GetAll(enums.offsets.tradeb + methods.parseInt(id));
};

export default tradeMarket;