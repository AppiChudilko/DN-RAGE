import user from "../user";
import phone from "../phone";

import methods from "../modules/methods";
import inventory from "../inventory";

let ctos = {};

let isBlackout = false;
let isNetwork = false;

ctos.bashFileList = [
    'vunlocker',
    'vengine',
];

ctos.pythonFileList = [
    'atmbackdoor',
    'alone',
    'lmh',
    'deadinside',
];

ctos.enableBlackout = async function() {
    ctos.setBlackout(true);
    await methods.sleep(100);
    ctos.setBlackout(false);
    await methods.sleep(100);
    ctos.setBlackout(true);
    await methods.sleep(100);
    ctos.setBlackout(false);
    await methods.sleep(100);
    ctos.setBlackout(true);
    await methods.sleep(100);
    ctos.setBlackout(false);
    await methods.sleep(200);
    ctos.setBlackout(true);
    await methods.sleep(700);
    ctos.setBlackout(false);
    await methods.sleep(700);
    ctos.setBlackout(true);
};

ctos.disableBlackout = async function() {
    ctos.setBlackout(false);
    await methods.sleep(100);
    ctos.setBlackout(true);
    await methods.sleep(100);
    ctos.setBlackout(false);
    await methods.sleep(100);
    ctos.setBlackout(true);
    await methods.sleep(100);
    ctos.setBlackout(false);
    await methods.sleep(100);
    ctos.setBlackout(true);
    await methods.sleep(200);
    ctos.setBlackout(false);
    await methods.sleep(700);
    ctos.setBlackout(true);
    await methods.sleep(700);
    ctos.setBlackout(false);
};

ctos.setBlackout = function (enable) {
    for (let i = 0; i <= 16; i++) mp.game.graphics.setLightsState(i, enable);
    isBlackout = enable;
    isNetwork = enable;
};

ctos.isBlackout = function () {
    return isBlackout;
};

ctos.enableNetwork = function() {
    ctos.setNoNetwork(false);
};

ctos.disableNetwork = function() {
    ctos.setNoNetwork(true);
};

ctos.setNoNetwork = function (disable) {
    isNetwork = disable;
};

ctos.isDisableNetwork = function () {
    return isNetwork;
};

ctos.generateCode = function (length = 4) {
    methods.debug('ctos.generateCode');
    let text = "";
    let possible = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (let i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};

ctos.generateLoad = function (length = 100) {
    methods.debug('ctos.generateLoad');
    let text = "";
    for (let i = 0; i < length / 10; i++)
        text += '|';
    return text;
};

mp.events.add('client:ctos:setBlackout', function(state) {
    try {
        if (state)
            ctos.enableBlackout();
        else
            ctos.disableBlackout();
    }
    catch (e) {
        
    }
});

mp.events.add('client:ctos:setNoNetwork', function(state) {
    try {
        if (state)
            ctos.enableNetwork();
        else
            ctos.disableNetwork();
    }
    catch (e) {
        
    }
});

export default ctos;