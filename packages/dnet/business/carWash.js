let methods = require('../modules/methods');
let vSync = require('../managers/vSync');
let user = require('../user');
let coffer = require('../coffer');

let carWash = exports;

carWash.list = [[-700.0402, -932.4921, 17.34011], [22.56987, -1391.852, 27.91351], [170.6151, -1718.647, 27.88343]];

carWash.loadAll = function() {
    methods.debug('carWash.loadAll');
    carWash.list.forEach(function (item) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        methods.createBlip(shopPos, 100, 0, 0.6);
        methods.createCp(shopPos.x, shopPos.y, shopPos.z, "Нажмите ~g~Е~s~ чтобы воспользоваться", 4, 0, [0, 0, 0, 0]);
    });
};

carWash.getInRadius = function(pos, radius = 2) {
    methods.debug('carWash.getInRadius');
    let shopId = -1;
    carWash.list.forEach(function (item, idx) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(pos, shopPos) < radius)
            shopId = methods.parseInt(item[0]);
    });
    return shopId;
};

carWash.checkPosForOpenMenu = function(player) {
    methods.debug('carWash.checkPosForOpenMenu');
    try {
        let playerPos = player.position;
        let shopId = carWash.getInRadius(playerPos, 2);
        if (shopId == -1)
            return;
        if (player.vehicle) {
            if (user.getMoney(player) < 100) {
                player.notify('~r~Необходимо иметь 100$ для того чтобы помыть транспорт');
                return;
            }
            user.showLoadDisplay(player);
            setTimeout(function () {

                user.removeMoney(player, 99.90, 'Услуги автомойки');
                coffer.addMoney(1, 99);

                vSync.setVehicleDirt(player.vehicle, 0);

                player.notify('~g~Ваш транспорт теперь чист');
                player.notify('~g~Стоимость услуги:~s~ $99.90');

                user.achiveDoneDailyById(player, 5);

                setTimeout(function () {
                    user.hideLoadDisplay(player);
                }, 500);
            }, 500);
        }
        else
            player.notify('~r~Необходимо находиться в транспорте');
    }
    catch (e) {
        methods.debug(e);
    }
};

carWash.findNearest = function(pos) {
    methods.debug('shop.findNearest');
    let prevPos = new mp.Vector3(9999, 9999, 9999);
    carWash.list.forEach(function (item) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(shopPos, pos) < methods.distanceToPos(prevPos, pos))
            prevPos = shopPos;
    });
    return prevPos;
};