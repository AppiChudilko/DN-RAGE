import Container from '../modules/data';
import methods from '../modules/methods';
import enums from '../enums';

let family = {};

family.addMoney = function(id, money, itemName = 'Операция со счетом') {
    mp.events.callRemote('server:family:addMoney', id, money, itemName);
};

family.removeMoney = function(id, money, itemName = 'Операция со счетом') {
    mp.events.callRemote('server:family:removeMoney', id, money, itemName);
};

family.setMoney = function(id, money) {
    mp.events.callRemote('server:family:setMoney', id, money);
};

family.save = function(id) {
    mp.events.callRemote('server:family:save', id);
};

family.getMoney = async function(id) {
    try {
        return methods.parseFloat(await Container.Data.Get(enums.offsets.family + id, 'money'));
    }
    catch (e) {
        methods.debug(e);
        return 0;
    }
};

family.addHistory = function(name, doName, text, fractionId = 0) {
    mp.events.callRemote('server:addFamilyLog', name, doName, text, fractionId);
};

family.set = function(id, key, value) {
    Container.Data.Set(enums.offsets.family + methods.parseInt(id), key, value);
};

family.get = async function(id, key) {
    return await Container.Data.Get(enums.offsets.family + methods.parseInt(id), key);
};

family.has = async function(id, key) {
    return await Container.Data.Has(enums.offsets.family + methods.parseInt(id), key);
};

family.getData = async function(id) {
    return await Container.Data.GetAll(enums.offsets.family + methods.parseInt(id));
};

export default family;