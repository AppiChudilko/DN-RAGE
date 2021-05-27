let methods = require('../modules/methods');
let business = require('../property/business');

let barberShop = exports;

barberShop.list = [
    [138.7087, -1705.711, 28.29162, 30],
    [1214.091, -472.9952, 65.208, 31],
    [-276.4055, 6226.398, 30.69552, 32],
    [-1282.688, -1117.432, 5.990113, 33],
    [1931.844, 3730.305, 31.84443, 34],
    [-813.5332, -183.2378, 36.5689, 35],
    [-33.34319, -154.1892, 56.07654, 36],
    [5184.13134765625, -5147.1162109375, 2.6213278770446777, 160],
];

barberShop.loadAll = function() {
    methods.debug('barberShop.loadAll');
    barberShop.list.forEach(function (item) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        methods.createBlip(shopPos, 71, 0, 0.8, 'BarberShop');
        methods.createCp(shopPos.x, shopPos.y, shopPos.z, "Нажмите ~g~Е~s~ чтобы открыть меню");
    });
};

barberShop.getInRadius = function(pos, radius = 2) {
    methods.debug('barberShop.getInRadius');
    let shopId = -1;
    barberShop.list.forEach(function (item, idx) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(pos, shopPos) < radius)
            shopId = methods.parseInt(item[3]);
    });
    return shopId;
};

barberShop.checkPosForOpenMenu = function(player) {
    methods.debug('barberShop.checkPosForOpenMenu');
    try {
        let playerPos = player.position;
        let shopId = barberShop.getInRadius(playerPos, 2);
        if (shopId == -1)
            return;
        /*if (!business.isOpen(shopId)) {
            player.notify('~r~К сожалению магазин сейчас не работает');
            return;
        }*/
        player.call('client:menuList:showBarberShopMenu', [shopId, business.getPrice(shopId)]);
    }
    catch (e) {
        methods.debug(e);
    }
};

barberShop.findNearest = function(pos) {
    methods.debug('barberShop.findNearest');
    let prevPos = new mp.Vector3(9999, 9999, 9999);
    barberShop.list.forEach(function (item) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(shopPos, pos) < methods.distanceToPos(prevPos, pos))
            prevPos = shopPos;
    });
    return prevPos;
};