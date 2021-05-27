import Container from './modules/data';
import methods from "./modules/methods";

let coffer = {};
let containerId = 99999;

coffer.addMoney = function(id, money) {
    mp.events.callRemote('server:coffer:addMoney', id, money);
};

coffer.removeMoney = function(id, money) {
    mp.events.callRemote('server:coffer:removeMoney', id, money);
};

coffer.setMoney = function(id, money) {
    mp.events.callRemote('server:coffer:setMoney', id, money);
};

coffer.get = async function(id, key) {
    return methods.parseFloat(await Container.Data.Get(containerId + id, key));
};

coffer.set = function(id, key, value) {
    Container.Data.Set(containerId + id, key, value);
};

coffer.getMoney = async function(id = 1) {
    return methods.parseFloat(await Container.Data.Get(containerId + id, 'cofferMoney'));
};

coffer.getAllData = async function(id = 1) {
    return await Container.Data.GetAll(containerId + id);
};

coffer.getScore = async function(id = 1) {
    return methods.parseInt(await Container.Data.Get(containerId + id, 'cofferScore'));
};

coffer.getTaxProperty = async function(id = 1) {
    return methods.parseInt(await Container.Data.Get(containerId + id, 'cofferTaxProperty'));
};

coffer.setTaxProperty = function(id = 1, num) {
    Container.Data.Set(containerId + id, 'cofferTaxProperty', methods.parseFloat(num));
};

coffer.getTaxPayDay = async function(id = 1) {
    return methods.parseInt(await Container.Data.Get(containerId + id, 'cofferTaxPayDay'));
};

coffer.setTaxPayDay = function(id = 1, num) {
    Container.Data.Set(containerId + id, 'cofferTaxPayDay', methods.parseFloat(num));
};

coffer.getTaxBusiness = async function(id = 1) {
    return methods.parseInt(await Container.Data.Get(containerId + id, 'cofferTaxBusiness'));
};

coffer.setTaxBusiness = function(id = 1, num) {
    Container.Data.Set(containerId + id, 'cofferTaxBusiness', methods.parseFloat(num));
};

coffer.getTaxIntermediate = async function(id = 1) {
    return methods.parseInt(await Container.Data.Get(containerId + id, 'cofferTaxIntermediate'));
};

coffer.setTaxIntermediate = function(id = 1, num) {
    Container.Data.Set(containerId + id, 'cofferTaxIntermediate', methods.parseFloat(num));
};

coffer.getBenefit = async function(id = 1) {
    return methods.parseFloat(await Container.Data.Get(containerId + id, 'cofferBenefit'));
};

coffer.setBenefit = function(id, money) {
    Container.Data.Set(containerId + id, 'cofferBenefit', methods.parseFloat(money));
};

coffer.getIdByFraction = function(fractionId) {
    switch (fractionId) {
        case 1:
            return 2;
        case 2:
            return 3;
        case 3:
            return 5;
        case 4:
            return 7;
        case 5:
            return 4;
        case 6:
            return 6;
        case 7:
            return 8;
        case 8:
            return 9;
    }
    return 1;
};

export default coffer;