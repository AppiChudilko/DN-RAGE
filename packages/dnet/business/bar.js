let methods = require('../modules/methods');
let business = require('../property/business');

let bar = exports;

bar.list = [
    [127.024, -1284.24, 28.28062, 43, 0],
    [-560.0792, 287.0196, 81.17641, 44, 0],
    [-1394.226, -605.4658, 29.31955, 45, 0],
    [988.5745, -96.85889, 73.84525, 46, 0],
    [1986.267, 3054.349, 46.21521, 47, 0],
    [-441.0517883300781, 268.8336181640625, 82.01594543457031, 48, 0],
    [-170.16810607910156, 294.8281555175781, 92.76211547851562, 144, 0],

    [4901.95458984375, -4940.994140625, 2.361668109893799, 158, 0],
];

bar.listFree = [
    [-2055.519, -1024.646, 10.90755],
    [-1402.890869140625, 6748.33837890625, 10.907529830932617],
    [-2092.460693359375, -1015.4134521484375, 7.9804534912109375],
    [945.2969970703125, 17.03707504272461, 115.16423034667969],
    [-1437.54736328125, 6758.40478515625, 7.9730329513549805],
    [-1772.515, 448.7928, 126.4369],
    [-657.7393, 857.7365, 224.1475],
    [-1587.188, -3012.827, -77.00496],
    [2725.659423828125, -385.1620788574219, -49.99296188354492], //GANG BAR
    [897.4898681640625, -3198.697021484375, -99.19621276855469], //BUNK BAR
];

bar.loadAll = function() {
    methods.debug('bar.loadAll');
    bar.list.forEach(function (item) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        switch (item[3]) {
            case 43:
                methods.createBlip(shopPos, 121, 0, 0.6);
                break;
            case 45:
                methods.createBlip(shopPos, 614, 0, 0.6, 'Клуб');
                break;
            case 0:
                methods.createBlip(new mp.Vector3(4891.2421875, -4925.5546875, 5.227933406829834), 614, 0, 0.6, 'Клуб');
                break;
            case 48:
                methods.createBlip(shopPos, 102, 0, 0.6, 'Сomedy Сlub');
                break;
            /*case 49:
                methods.createBlip(new mp.Vector3(4.723007, 220.3487, 106.7251), 614, 0, 0.6, 'Клуб');
                break;
            case 130:
                methods.createBlip(new mp.Vector3(355.362, 302.1856, 102.7556), 614, 0, 0.6, 'Клуб');
                break;
            case 131:
                methods.createBlip(new mp.Vector3(-1173.9403076171875, -1153.419189453125, 4.657954216003418), 614, 0, 0.6, 'Клуб');
                break;*/
            case 144:
                methods.createBlip(new mp.Vector3(-170.16810607910156, 294.8281555175781, 92.76211547851562), 93, 0, 0.6, 'Ресторан');
                break;
            default:
                if (item[3] != 0)
                    methods.createBlip(shopPos, 93, 0, 0.6);
                break;
        }
        methods.createCp(shopPos.x, shopPos.y, shopPos.z, "Нажмите ~g~Е~s~ чтобы открыть меню бара");
    });
    bar.listFree.forEach(function (item) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        methods.createCp(shopPos.x, shopPos.y, shopPos.z, "Нажмите ~g~Е~s~ чтобы открыть меню бара");
    });
};

bar.getInRadius = function(pos, radius = 2, dim = 0) {
    methods.debug('bar.getInRadius');
    let shopId = -1;
    bar.list.forEach(function (item, idx) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(pos, shopPos) < radius && dim === item[4])
            shopId = methods.parseInt(item[3]);
    });
    bar.listFree.forEach(function (item, idx) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(pos, shopPos) < radius)
            shopId = 999;
    });
    return shopId;
};

bar.checkPosForOpenMenu = function(player) {
    methods.debug('bar.checkPosForOpenMenu');
    try {
        let playerPos = player.position;
        let shopId = bar.getInRadius(playerPos, 2, player.dimension);
        if (shopId == -1)
            return;
        if (shopId == 999) {
            player.call('client:menuList:showBarFreeMenu');
            return;
        }
        /*if (!business.isOpen(shopId)) {
            player.notify('~r~К сожалению бар сейчас не работает');
            return;
        }*/
        player.call('client:menuList:showBarMenu', [shopId, business.getPrice(shopId)]);
    }
    catch (e) {
        methods.debug(e);
    }
};

bar.findNearest = function(pos) {
    methods.debug('shop.findNearest');
    let prevPos = new mp.Vector3(9999, 9999, 9999);
    bar.list.forEach(function (item) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(shopPos, pos) < methods.distanceToPos(prevPos, pos))
            prevPos = shopPos;
    });
    return prevPos;
};