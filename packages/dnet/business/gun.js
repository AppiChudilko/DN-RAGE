let methods = require('../modules/methods');

let business = require('../property/business');

let user = require('../user');
let items = require('../items');
let inventory = require('../inventory');
let weapons = require('../weapons');

let gun = exports;

gun.list = [
    [22.08832, -1106.986, 29.79703, 71],
    [252.17,-50.08245,69.94106,72],
    [842.2239,-1033.294,28.19486,73],
    [-661.947,-935.6796,21.82924,74],
    [-1305.899,-394.5485,36.69577,75],
    [809.9118,-2157.209,28.61901,76],
    [2567.651,294.4759,107.7349,77],
    [-3171.98,1087.908,19.83874,78],
    [-1117.679,2698.744,17.55415,79],
    [1693.555,3759.9,33.70533,80],
    [-330.36,6083.885,30.45477,81],
    [4962.1513671875, -5107.576171875, 1.982065200805664,167],
];

gun.loadAll = function() {
    methods.debug('gun.loadAll');
    gun.list.forEach(function (item) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2] - 1);
        methods.createBlip(shopPos, 110, 0, 0.8);
        methods.createCp(shopPos.x, shopPos.y, shopPos.z, "Нажмите ~g~Е~s~ чтобы открыть меню магазина");
    });
};

gun.getInRadius = function(pos, radius = 2) {
    methods.debug('gun.getInRadius');
    let shopId = -1;
    gun.list.forEach(function (item, idx) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(pos, shopPos) < radius)
            shopId = methods.parseInt(item[3]);
    });
    return shopId;
};

gun.checkPosForOpenMenu = function(player) {
    methods.debug('gun.checkPosForOpenMenu');
    try {
        let playerPos = player.position;
        let shopId = gun.getInRadius(playerPos, 2);
        if (shopId == -1)
            return;
        /*if (!business.isOpen(shopId)) {
            player.notify('~r~К сожалению магазин сейчас не работает');
            return;
        }*/
        player.call('client:menuList:showGunShopMenu', [shopId, business.getPrice(shopId)]);
    }
    catch (e) {
        methods.debug(e);
    }
};

gun.findNearest = function(pos) {
    methods.debug('gun.findNearest');
    let prevPos = new mp.Vector3(9999, 9999, 9999);
    gun.list.forEach(function (item,) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(shopPos, pos) < methods.distanceToPos(prevPos, pos))
            prevPos = shopPos;
    });
    return prevPos;
};

gun.buy = function(player, itemId, price, count, superTint, tint, shopId, payType) {
    methods.debug('gun.buy');

    if (!user.isLogin(player))
        return;

    if (payType === 1) {
        if (user.getBankMoney(player) < price) {
            user.showCustomNotify(player, 'У вас недостаточно средств', 1, 9);
            return;
        }
    }
    else {
        if (user.getCashMoney(player) < price) {
            user.showCustomNotify(player, 'У вас недостаточно средств', 1, 9);
            return;
        }
    }

    if (price < 0)
        return;

    let amount = inventory.getInvAmount(player, user.getId(player), 1);
    if (amount + items.getItemAmountById(itemId) > inventory.getPlayerInvAmountMax(player)) {
        user.showCustomNotify(player, 'В инвентаре нет места', 1, 9);
        return;
    }

    let serial = weapons.getWeaponSerial(itemId);
    let paramsObject = {
        userName: user.getRpName(player),
        serial: serial,
        superTint: methods.parseInt(superTint),
        tint: tint,
    };

    user.achiveDoneDailyById(player, 7);

    if (items.isWeapon(itemId))
        inventory.addItemSql(itemId, 1, 1, user.getId(player), 100, 0, JSON.stringify(paramsObject), 1);
    else
        inventory.addItem(itemId, 1, 1, user.getId(player), -1, 0, `{"userName": "${user.getRpName(player)}"}`, 1);

    user.showCustomNotify(player, 'Вы купили ' + items.getItemNameById(itemId) +  ' по цене: ' + methods.moneyFormat(price), 2, 9);

    user.addHistory(player, 5, `Покупка оружия ${items.getItemNameById(itemId)} (${serial})`);
    if (payType === 1) {
        user.removeBankMoney(player, price, `Покупка оружия ${items.getItemNameById(itemId)} (${serial})`);
    }
    else {
        user.removeCashMoney(player, price, `Покупка оружия ${items.getItemNameById(itemId)} (${serial})`);
    }
    if (business.isOpen(shopId)) {
        business.addMoney(shopId, price, items.getItemNameById(itemId));
        business.removeMoneyTax(shopId, price / business.getPrice(shopId));
    }
    inventory.updateAmount(player, user.getId(player), 1);
};