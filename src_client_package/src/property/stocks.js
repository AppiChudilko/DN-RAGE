import user from '../user';
import Container from '../modules/data';
import methods from '../modules/methods';
import enums from '../enums';
import vehicles from "./vehicles";

let stocks = {};

stocks.boxList = [
    ['Малая коробка', 1165008631, 400000, -0.12, true, 10000, 'Стандарт', -1], //0
    ['Средняя коробка', 1875981008, 600000, -0.12, true, 20000, 'Стандарт', -1], //1
    ['Большая коробка', -1322183878, 800000, -0.12, true, 30000, 'Стандарт', -1], //2

    ['Большой ящик с оружием', 1790162299, 3, 0, false, 80000, 'Оружие и патроны', 1], //3
    ['Малый ящик с оружием', 2055492359, 4, 0, false, 30000, 'Оружие и патроны', 0], //4
    ['Большой ящик антиквариата', 1815664890, 5, 0, false, 15000, 'Антиквариат', 1], //5
    ['Малый ящик антиквариата', 1397410834, 5, 0, false, 5000, 'Антиквариат', 0], //6
    ['Большой ящик антиквариата', 1057918179, 6, 0, false, 15000, 'Антиквариат', 1], //7
    ['Малый ящик антиквариата', -1655753417, 7, 0, false, 5000, 'Антиквариат', 0 ], //8
    ['Большой ящик химикатов', 21331302, 8, 0, false, 15000, 'Химикаты', 1 ], //9
    ['Малый ящик химикатов', 1075102988, 9, 0, false, 5000, 'Химикаты', 0 ], //10
    ['Большой ящик серебра', 2014503631, 10, 0, false, 15000, 'Контрафактные товары', 1 ], //11
    ['Малый ящик серебра', -333302011, 11, 0, false, 5000, 'Контрафактные товары', 0 ], //12
    ['Малый ящик медикаментов', 2092857693, 12, 0, false, 5000, 'Медикаменты', 0 ], //13
    ['Ящик сигарет Redwood', -1958, 14, 0, false, 5000, 'Алкоголь и табак', 0 ], //14
    ['Ящик сигарет Redwood', -1958, 14, 0, false, 5000, 'Алкоголь и табак', 0 ], //15
    ['Большой ящик кожаных сумок', 12824223, 15, 0, false, 15000, 'Трофеи браконьеров', 1 ], //16
    ['Малый ящик кожаных сумок', -270239139, 16, 0, false, 5000, 'Трофеи браконьеров', 0 ], //17
    ['Большой ящик техники', 60045683, 17, 0, false, 15000, 'Контрафактные товары', 1 ], //18
    ['Малый ящик техники', -731494164, 18, 0, false, 5000, 'Контрафактные товары', 0 ], //19
    ['Большой ящик взрывчатки', -1853019218, 19, 0, false, 15000, 'Оружие и патроны', 1 ], //20
    ['Малый ящик взрывчатки', -305076648, 20, 0, false, 5000, 'Оружие и патроны', 0 ], //21
    ['Редкая киноплёнка', 725420132, 21, 0, false, 30000, 'Уникальный груз', 2 ], //22
    ['Большой ящик меховых шуб', -1227143673, 22, -0.12, false, 15000, 'Трофеи браконьеров', 1 ], //23
    ['Малый ящик меховых шуб', 1915002422, 23, -0.12, false, 5000, 'Трофеи браконьеров', 0 ], //24
    ['Большой ящик драгоценных камней', 654562429, 24, 0, false, 15000, 'Ювелирные украшения', 1 ], //25
    ['Малый ящик драгоценных камней', 304821544, 25, 0, false, 5000, 'Ювелирные украшения', 0 ], //26
    ['Большой ящик лекарств', -1129076059, 26, 0, false, 15000, 'Медикаменты', 1 ], //27
    ['Малый ящик лекарств', 1524744766, 27, 0, false, 5000, 'Медикаменты', 0 ], //28
    ['Большой ящик украшений', -76137332, 28, 0, false, 15000, 'Ювелирные украшения', 1 ], //29
    ['Малый ящик украшений', -290560280, 29, 0, false, 5000, 'Ювелирные украшения', 0 ], //30
    ['Большой ящик с часами', -1817226762, 30, 0, false, 15000, 'Ювелирные украшения', 1 ], //31
    ['Малый ящик с часами', -2104190829, 31, 0, false, 5000, 'Ювелирные украшения', 0 ], //32
    ['Большой ящик лекарств', 797797701, 32, 0, false, 15000, 'Медикаменты', 1 ], //33
    ['Малый ящик лекарств', 1054352436, 33, 0, false, 5000, 'Медикаменты', 0 ], //34
    ['Золотой Minigun', 1557324266, 34, 0, false, 40000, 'Уникальный груз', 2 ], //35
    ['Большой ящик фальшивых купюр', -80652213, 35, 0, false, 15000, 'Контрафактные товары', 1 ], //36
    ['Малый ящик фальшивых купюр', -1155316904, 36, 0, false, 5000, 'Контрафактные товары', 0 ], //37
    ['Большой ящик наркотиков', 1016837103, 37, 0, false, 40000, 'Наркотики', 1 ], //38
    ['Малый ящик наркотиков', 1863514296, 38, 0, false, 20000, 'Наркотики', 0 ], //39
    ['Яйцо фаберже', 562429577, 39, 0, false, 35000, 'Уникальный груз', 2 ], //40
    ['Большой ящик лекарств', 1914690987, 40, -0.12, false, 15000, 'Медикаменты', 1 ], //41
    ['Малый ящик лекарств', -824154829, 41, 0, false, 5000, 'Медикаменты', 0 ], //42
    ['Костюм Етти', -495810123, 42, 0, false, 25000, 'Уникальный груз', 2 ], //43
    ['Большой ящик алкоголя и табака', -19283505, 43, -0.12, false, 15000, 'Алкоголь и табак', 1 ], //44
    ['Малый ящик алкоголя и табака', -2073232532, 44, -0.12, false, 5000, 'Алкоголь и табак', 0 ], //45
    ['Золотой компас', 577983279, 45, 0, false, 35000, 'Уникальный груз', 2 ], //46
    ['Большой ящик слоновых бивней', -2033482115, 46, -0.12, false, 15000, 'Трофеи браконьеров', 1 ], //47
    ['Малый ящик слоновых бивней', 588496643, 47, -0.12, false, 5000, 'Трофеи браконьеров', 0 ], //48
    ['Бриллиант 64 карата', 926762619, 48, 0, false, 50000, 'Уникальный груз', 2 ], //49
    ['Оружейный ящик MerryWeather', -994309865, 49, 0, false, 100000, 'Оружие и патроны', 2 ], //50
    ['Ящик с документами банков Fleeca', -994309865, 50, 0, false, 100000, 'Уникальный груз', 2 ], //51
    ['Ящик с C4', -1853019218, 51, 0, false, 200000, 'Оружие и патроны', 3 ], //52
    ['Ящик с документами банка Pacific', -994309865, 50, 0, false, 200000, 'Уникальный груз', 3 ], //53
];

stocks.enter = function (id) {
    mp.events.callRemote('server:stocks:enter', id);
};

stocks.enterv = function (id) {
    mp.events.callRemote('server:stocks:enterv', id);
};

stocks.enter1 = function (id) {
    mp.events.callRemote('server:stocks:enter1', id);
    setTimeout(function () {
        methods.iplArenaModDefault();
    }, 1500);
};

stocks.enterl = function (id, state = 0) {
    if (state > 5)
        state = 5;
    mp.events.callRemote('server:stocks:enterl', id);
    setTimeout(function () {
        methods.iplLabCocaDefault(state);
    }, 1500);
};

stocks.enterb = function (id) {
    mp.events.callRemote('server:stocks:enterb', id);
    setTimeout(function () {
        methods.iplBunkerDefault();
    }, 1500);
};

stocks.enterv1 = function (id) {
    mp.events.callRemote('server:stocks:enterv1', id);
    setTimeout(function () {
        methods.iplArenaModDefault();
    }, 1500);
};

stocks.entervb = function (id) {
    mp.events.callRemote('server:stocks:entervb', id);
    setTimeout(function () {
        methods.iplBunkerDefault();
    }, 1500);
};

stocks.exit = function (x, y, z, rot) {
    user.setVirtualWorld(0);
    user.teleport(x, y, z + 1, rot);
};

stocks.exitv = async function (x, y, z, rot) {
    user.setVirtualWorld(0);
    user.setVirtualWorldVeh(0);
    /*if (mp.vehicles.exists(mp.players.local.vehicle) && await vehicles.hasSync(mp.players.local.vehicle.remoteId, 'lastStockPos')) {
        try {
            let pos = JSON.parse(await vehicles.getSync(mp.players.local.vehicle.remoteId, 'lastStockPos'));
            let rot = await vehicles.getSync(mp.players.local.vehicle.remoteId, 'lastStockRot');
            user.teleportVehV(pos, rot);
        }
        catch (e) {
            user.teleportVeh(x, y, z, rot);
        }
    }
    else*/
    user.teleportVeh(x, y, z, rot);
};

stocks.getData = async function(id) {
    return await Container.Data.GetAll(enums.offsets.stock + methods.parseInt(id));
};

stocks.get = async function(id, key) {
    return await Container.Data.Get(enums.offsets.stock + methods.parseInt(id), key);
};

stocks.buy = function (id) {
    if (user.getCacheData().get('stock_id') > 0) {
        mp.game.ui.notifications.show('~r~У Вас уже есть склад');
        return false;
    }
    mp.events.callRemote('server:stocks:buy', id);
    return true;
};

stocks.upgradeGarage = function (id) {
    mp.events.callRemote('server:stocks:updateGarage', id, 1);
};

stocks.upgradeNumber = function (id) {
    mp.events.callRemote('server:stocks:upgradeNumber', id, 1);
};

stocks.upgradeBunker = function (id) {
    mp.events.callRemote('server:stocks:upgradeBunker', id, 1);
};

stocks.upgradeLab = function (id) {
    mp.events.callRemote('server:stocks:upgradeLab', id, 1);
};

stocks.updatePin = function (id, pin) {
    mp.events.callRemote('server:stocks:updatePin', id, pin);
};

stocks.updatePin1 = function (id, pin) {
    mp.events.callRemote('server:stocks:updatePin1', id, pin);
};

stocks.updatePin2 = function (id, pin) {
    mp.events.callRemote('server:stocks:updatePin2', id, pin);
};

stocks.updatePin3 = function (id, pin) {
    mp.events.callRemote('server:stocks:updatePin3', id, pin);
};

stocks.updatePinO = function (id, pin) {
    mp.events.callRemote('server:stocks:updatePinO', id, pin);
};

stocks.updatePinB = function (id, pin) {
    mp.events.callRemote('server:stocks:updatePinB', id, pin);
};

stocks.updatePinL = function (id, pin) {
    mp.events.callRemote('server:stocks:updatePinL', id, pin);
};

stocks.upgradeAdd = function (id, slot, box) {
    mp.events.callRemote('server:stocks:upgradeAdd', id, slot, box);
};

export default stocks;