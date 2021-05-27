let Container = require('../modules/data');

let methods = require('./methods');

let enums = require('../enums');

let ctos = exports;

let isBlackout = false;
let isNetwork = false;

let timeoutBlackout = 0;
let timeoutNetwork = 0;

let blackoutPos = [
    [2829.07275390625, 1487.8507080078125, 23.72873878479004],
    [2813.837890625, 1502.2786865234375, 23.72876739501953],
    [2833.147216796875, 1504.5712890625, 23.728740692138672],
    [2817.96728515625, 1517.8797607421875, 23.728622436523438],
    [2851.437255859375, 1537.2254638671875, 23.728620529174805],
    [2836.33203125, 1551.622802734375, 23.72871208190918],
    [2855.510986328125, 1553.8272705078125, 23.728710174560547],
    [2840.375, 1567.247802734375, 23.728708267211914],
];

let networkPos = [
    [2136.927001953125, 2900.933349609375, 56.26344680786133],
    [2106.990478515625, 2923.556396484375, 56.42711257934573],
    [2078.701904296875, 2945.448486328125, 55.41669845581055],
    [2049.659423828125, 2946.07568359375, 56.517364501953125],
    [2001.2813720703125, 2930.39599609375, 55.97068405151367],
    [2136.927001953125, 2900.933349609375, 56.26344680786133],
    [1965.5626220703125, 2917.434814453125, 55.1684455871582],
];

ctos.loadAll = function () {

    networkPos.forEach(function (item) {
        let bankPos = new mp.Vector3(item[0], item[1], item[2]);
        methods.createCpVector(bankPos, "~y~Место для установки модуля", 2, -1, [0,0,0,0]);
    });

    blackoutPos.forEach(function (item) {
        let bankPos = new mp.Vector3(item[0], item[1], item[2]);
        methods.createCpVector(bankPos, "~y~Место для установки модуля", 2, -1, [0,0,0,0]);
    });

    setInterval(ctos.secTimer, 1000);
};

ctos.setRadioBlackout = function(player) {
    let nearIdx = -1;
    let pos = player.position;

    blackoutPos.forEach(function (item, idx) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(shopPos, pos) < 3)
            nearIdx = idx;
    });

    if (nearIdx >= 0) {
        ctos.set( 'blackout' + nearIdx, true);
        player.notify('~y~Вы установили модуль удаленного доступа');
        return true;
    }
    return false;
};

ctos.setRadioNetwork = function(player) {
    let nearIdx = -1;
    let pos = player.position;

    networkPos.forEach(function (item, idx) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(shopPos, pos) < 3)
            nearIdx = idx;
    });

    if (nearIdx >= 0) {
        ctos.set( 'network' + nearIdx, true);
        player.notify('~y~Вы установили модуль удаленного доступа');
        return true;
    }
    return false;
};

ctos.canBlackout = function() {
    if (ctos.has('cantBlackout'))
        return false;
    let countBlackout = 0;
    for (let i = 0; i < 10; i++)
    {
        if (ctos.has('blackout' + i))
            countBlackout++;
    }
    return countBlackout >= 7;
};

ctos.canNetwork = function() {
    if (ctos.has('cantNetwork'))
        return false;
    let countBlackout = 0;
    for (let i = 0; i < 10; i++)
    {
        if (ctos.has('network' + i))
            countBlackout++;
    }
    return countBlackout >= 6;
};

ctos.getData = function() {
    return Container.Data.GetAll(enums.offsets.ctos);
};

ctos.get = function(key) {
    return Container.Data.Get(enums.offsets.ctos, key);
};

ctos.has = function(key) {
    return Container.Data.Has(enums.offsets.ctos, key);
};

ctos.set = function(key, val) {
    Container.Data.Set(enums.offsets.ctos, key, val);
};

ctos.reset = function(key, val) {
    Container.Data.Reset(enums.offsets.ctos, key, val);
};

ctos.secTimer = function () {
    if (timeoutBlackout > 0) {
        timeoutBlackout--;
        if (timeoutBlackout === 0)
            ctos.setBlackout(false);
    }
    if (timeoutNetwork > 0) {
        timeoutNetwork--;
        if (timeoutNetwork === 0)
            ctos.setNoNetwork(false);
    }
};

ctos.setBlackout = function (enable) {
    isBlackout = enable;
    ctos.setNoNetwork(enable);
    mp.players.call('client:ctos:setBlackout', [enable]);
    if (enable)
        timeoutBlackout = 300;
};

ctos.isBlackout = function () {
    return isBlackout;
};

ctos.setNoNetwork = function (enable) {
    isNetwork = enable;
    mp.players.call('client:ctos:setNoNetwork', [enable]);
    if (enable)
        timeoutBlackout = 300;
};

ctos.isDisableNetwork = function () {
    return isNetwork;
};