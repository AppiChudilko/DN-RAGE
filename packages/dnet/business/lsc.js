let methods = require('../modules/methods');
let mysql = require('../modules/mysql');
let Container = require('../modules/data');

let user = require('../user');
let inventory = require('../inventory');
let enums = require('../enums');

let vSync = require('../managers/vSync');

let vehicles = require('../property/vehicles');
let business = require('../property/business');

let lsc = exports;

/*lsc.carPos = [
    [-1159.827, -2015.182, 12.16598],
    [-330.8568, -137.6985, 38.00612],
    [732.1998, -1088.71, 21.15658],
    [-222.6972, -1329.915, 29.87796],
    [1174.876, 2640.67, 36.7454],
    [110.3291, 6626.977, 30.7735],
    //[-147.4434, -599.0691, 166.0058],
    [481.2153, -1317.698, 28.09073]
];*/

lsc.carPos = [
    [-1157.624, -2022.166, 12.12825, 5],
    [-1154.145, -2006.697, 12.18026, 5],
    [-323.1132, -132.1359, 37.95763, 6],
    [-338.5115, -135.9138, 38.00964, 6],
    [731.3428, -1088.837, 21.16902, 7],
    [734.3771, -1081.58, 21.16877, 7],
    [-211.8867, -1324.084, 29.89039, 9],
    [-222.3097, -1330.034, 29.89039, 9],
    [1174.876, 2640.67, 36.7454, 8],
    [110.3291, 6626.977, 30.7735, 10],
    //[-147.4434, -599.0691, 166.0058, 11],
    [481.2153, -1317.698, 28.09073, 12],

    [544.6047, -176.6944, 53.4865, 145],
    [544.6581, -183.6752, 53.50251, 145],
    [544.7557, -188.4752, 53.93, 145],
    [548.5826, -198.1623, 53.49, 145],
    [1150.203, -781.9423, 56.60448, 146],
    [1143.042, -781.9088, 56.60373, 146],
    [1138.758, -781.9277, 56.61882, 146],
    [1128.491, -784.9147, 56.60277, 146],
    [1149.232, -792.47, 57.05, 146],

    [5188.09912109375, -5133.18603515625, 2.3411810398101807, 161],
    [5180.60791015625, -5131.7685546875, 2.3138363361358643, 161],

    [4919.8505859375, -5238.38525390625, 1.5227940082550049, 164],
    [4915.4716796875, -5232.0009765625, 1.521226167678833, 164],

    [-1145.824462890625, -2864.25048828125, 12.946029663085938, 163], //Air
    [-1152.3829345703125, -2921.070068359375, 12.945174217224121, 163], //Air

    [-767.9091796875, -1412.69482421875, -0.0646330714225769, 162], //Boat
    [-785.7466430664062, -1434.6387939453125, -0.07929760217666626, 162], //Boat
];

lsc.list = [
    [-1148.878, -2000.123, 12.18026, 5],
    [-347.0815, -133.3432, 38.00966, 6],
    [726.0679, -1071.613, 27.31101, 7],
    [-207.0201, -1331.493, 33.89437, 9],
    [1187.764, 2639.15, 37.43521, 8],
    [101.0262, 6618.267, 31.43771, 10],
    //[-146.2072, -584.2731, 166.0002, 11],
    [472.2666, -1310.529, 28.22178, 12],
    [540.9584, -182.8218, 53.4865, 145],
    [1144.398, -778.2864, 56.60521, 146],
    [-1145.824462890625, -2864.25048828125, 12.946029663085938, 0],
    [-767.9091796875, -1412.69482421875, -0.0646330714225769, 0],

    [5188.09912109375, -5133.18603515625, 2.3411810398101807, 0],
    [4919.8505859375, -5238.38525390625, 1.5227940082550049, 999],
];

lsc.loadAll = function() {
    methods.debug('lsc.loadAll');
    lsc.list.forEach(function (item) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);

        if (item[3] == 145 || item[3] == 146 || item[3] == 999)
            methods.createBlip(shopPos, 402, 0, 0.6, 'Автомастерская');
        else
            methods.createBlip(shopPos, 446, 0, 0.6);
    });

    lsc.carPos.forEach(function (item) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        let cId = methods.createCp(shopPos.x, shopPos.y, shopPos.z, "~b~Нажмите ~s~E~b~ чтобы открыть меню тюнинга", 4, -1, [33, 150, 243, 100], 0.3);

        Container.Data.Set(999999, 'resetTunning' + cId, true);
    });
};

lsc.getInRadius = function(pos, radius = 2) {
    methods.debug('lsc.getInRadius');
    let shopId = -1;
    lsc.list.forEach(function (item, idx) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(pos, shopPos) < radius)
            shopId = methods.parseInt(item[3]);
    });
    return shopId;
};

lsc.checkPosForOpenMenu = function(player) {
    methods.debug('lsc.checkPosForOpenMenu');
    try {
        let playerPos = player.position;
        let shopId = -1;
        lsc.carPos.forEach(function (item, i) {
            let shopPos = new mp.Vector3(item[0], item[1], item[2]);
            if (methods.distanceToPos(playerPos, shopPos) < 3.9) {
                shopId = methods.parseInt(item[3]);

                try {
                    /*if (!business.isOpen(shopId)) {
                        player.notify('~r~К сожалению автосервис сейчас не работает');
                        return;
                    }*/
                    if (player.seat >= 0) {
                        player.notify('~r~Доступно только на водительском');
                        return;
                    }
                    if (player.vehicle.getVariable('cargoId')) {
                        player.notify('~r~Данное ТС запрещено тюнинговать');
                        return;
                    }
                    player.call('client:menuList:showLscMenu', [shopId, business.getPrice(shopId)]);
                }
                catch (e) {
                    methods.debug(e);
                }
            }
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

lsc.findNearest = function(pos) {
    methods.debug('lsc.findNearest');
    let prevPos = new mp.Vector3(9999, 9999, 9999);
    lsc.list.forEach(function (item,) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(shopPos, pos) < methods.distanceToPos(prevPos, pos))
            prevPos = shopPos;
    });
    return prevPos;
};

lsc.repair = function(player, price, shopId, payType) {
    methods.debug('lsc.repair');
    if (!user.isLogin(player))
        return;
    let veh = player.vehicle;
    if (!vehicles.exists(veh))
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

    veh.repair();
    if (payType === 1)
        user.removeBankMoney(player, price, 'Ремонт транспорта');
    else
        user.removeCashMoney(player, price, 'Ремонт транспорта');

    if (business.isOpen(shopId)) {
        business.addMoney(shopId, price, 'Ремонт транспорта');
        business.removeMoneyTax(shopId, price / business.getPrice(shopId));
    }

    user.showCustomNotify(player, 'Вы отремонтировали трансопрт', 2, 9);
};

lsc.buyNeon = function(player, price, shopId, payType) {
    methods.debug('lsc.buyNeon');
    if (!user.isLogin(player))
        return;
    let veh = player.vehicle;
    if (!vehicles.exists(veh))
        return;

    if (user.getMoney(player, payType) < price) {
        user.showCustomNotify(player, 'У вас недостаточно средств', 1, 9);
        return;
    }

    if (price < 0)
        return;

    if (veh.getVariable('user_id') < 1) {
        user.showCustomNotify(player, 'Транспорт должен быть личный', 1, 9);
        return;
    }
    if (veh.getVariable('user_id') != user.getId(player)) {
        user.showCustomNotify(player, 'Транспорт должен быть личный', 1, 9);
        return;
    }

    if (vehicles.get(veh.getVariable('container'), 'is_neon')) {
        user.showCustomNotify(player, 'На транспорте уже установлен неон', 1, 9);
        return;
    }

    vehicles.set(veh.getVariable('container'), 'is_neon', 1);
    vehicles.set(veh.getVariable('container'), 'neon_r', 255);
    vehicles.set(veh.getVariable('container'), 'neon_g', 255);
    vehicles.set(veh.getVariable('container'), 'neon_b', 255);

    vehicles.neonStatus(player, veh);
    veh.neonEnabled = true;

    user.removeMoney(player, price, 'Неоновая подсветка', payType);
    price = price - 90000;
    if (business.isOpen(shopId)) {
        business.addMoney(shopId, price, 'Неоновая подсветка');
        business.removeMoneyTax(shopId, price / business.getPrice(shopId));
    }

    user.achiveDoneAllById(player, 18);
    user.showCustomNotify(player, 'Вы установили неон, теперь можете открыть меню транспорта (2) и воспользоваться им', 2, 9);

    user.save(player);
    vehicles.save(veh.getVariable('container'));
};

lsc.buyTyreColor = function(player, price, idx, shopId, payType) {
    methods.debug('lsc.buyNeon');
    if (!user.isLogin(player))
        return;
    let veh = player.vehicle;
    if (!vehicles.exists(veh))
        return;

    if (user.getMoney(player, payType) < price) {
        user.showCustomNotify(player, 'У вас недостаточно средств', 1, 9);
        return;
    }

    if (price < 0)
        return;

    if (veh.getVariable('user_id') < 1) {
        user.showCustomNotify(player, 'Транспорт должен быть личный', 1, 9);
        return;
    }
    if (veh.getVariable('user_id') != user.getId(player)) {
        user.showCustomNotify(player, 'Транспорт должен быть личный', 1, 9);
        return;
    }

    user.achiveDoneAllById(player, 18);
    user.removeMoney(player, price, 'Установка спец. покрышек', payType);

    if (price > 475000)
        price = price - 475000;
    if (business.isOpen(shopId)) {
        business.addMoney(shopId, price, 'Установка спец. покрышек');
        business.removeMoneyTax(shopId, price / business.getPrice(shopId));
    }

    user.showCustomNotify(player, 'Вы установили напыление покрышек', 2, 9);

    let rgb = enums.rgbColors[idx];

    vehicles.set(veh.getVariable('container'), 'is_tyre', 1);
    vehicles.set(veh.getVariable('container'), 'tyre_r', rgb[0]);
    vehicles.set(veh.getVariable('container'), 'tyre_g', rgb[1]);
    vehicles.set(veh.getVariable('container'), 'tyre_b', rgb[2]);

    vSync.setVehicleTyreSmokeColor(veh, rgb[0], rgb[1], rgb[2]);

    user.save(player);
    vehicles.save(veh.getVariable('container'));
};

lsc.buyLight = function(player, price, shopId, payType) {
    methods.debug('lsc.buyLight');
    if (!user.isLogin(player))
        return;
    let veh = player.vehicle;
    if (!vehicles.exists(veh))
        return;

    if (user.getMoney(player, payType) < price) {
        user.showCustomNotify(player, 'У вас недостаточно средств', 1, 9);
        return;
    }

    if (price < 0)
        return;

    if (veh.getVariable('user_id') < 1) {
        user.showCustomNotify(player, 'Транспорт должен быть личный', 1, 9);
        return;
    }
    if (veh.getVariable('user_id') != user.getId(player)) {
        user.showCustomNotify(player, 'Транспорт должен быть личный', 1, 9);
        return;
    }

    if (vehicles.get(veh.getVariable('container'), 'colorl') >= 0) {
        user.showCustomNotify(player, 'На транспорте уже установлен модуль', 1, 9);
        return;
    }

    vehicles.set(veh.getVariable('container'), 'colorl', 0);

    veh.data.headlightColor = 0;

    user.achiveDoneAllById(player, 18);
    user.removeMoney(player, price, 'Цветные фары', payType);
    price = price - 725000;
    if (business.isOpen(shopId)) {
        business.addMoney(shopId, price, 'Цветные фары');
        business.removeMoneyTax(shopId, price / business.getPrice(shopId));
    }

    user.showCustomNotify(player, 'Вы установили модуль цветных фар, теперь можете открыть Меню Транспорт и воспользоваться им', 2, 9);

    user.save(player);
    vehicles.save(veh.getVariable('container'));
};

lsc.buySpecial = function(player, price, shopId, payType) {
    methods.debug('lsc.buyNeon');
    if (!user.isLogin(player))
        return;
    let veh = player.vehicle;
    if (!vehicles.exists(veh))
        return;

    if (user.getMoney(player, payType) < price) {
        user.showCustomNotify(player, 'У вас недостаточно средств', 1, 9);
        return;
    }

    if (price < 0)
        return;

    if (veh.getVariable('user_id') < 1) {
        user.showCustomNotify(player, 'Транспорт должен быть личный', 1, 9);
        return;
    }
    if (veh.getVariable('user_id') != user.getId(player)) {
        user.showCustomNotify(player, 'Транспорт должен быть личный', 1, 9);
        return;
    }
    if (vehicles.get(veh.getVariable('container'), 'is_special') > 0) {
        user.showCustomNotify(player, 'На транспорте уже установлена модификация', 1, 9);
        return;
    }

    user.achiveDoneAllById(player, 18);
    vehicles.set(veh.getVariable('container'), 'is_special', 1);
    user.removeMoney(player, price, 'Дистанционное управление', payType);
    if (business.isOpen(shopId)) {
        business.addMoney(shopId, price, 'Дистанционное управление');
        business.removeMoneyTax(shopId, price / business.getPrice(shopId));
    }

    user.showCustomNotify(player, 'Вы установили модификацию', 2, 9);

    user.save(player);
    vehicles.save(veh.getVariable('container'));
};

lsc.buyNumber = function(player, shopId, newNumber, payType) {
    methods.debug('lsc.buyNumber');
    if (!user.isLogin(player))
        return;
    let veh = player.vehicle;
    if (!vehicles.exists(veh))
        return;

    if (veh.getVariable('user_id') < 1) {
        user.showCustomNotify(player, 'Транспорт должен быть личный', 1, 9);
        return;
    }
    if (veh.getVariable('user_id') != user.getId(player)) {
        user.showCustomNotify(player, 'Транспорт должен быть личный', 1, 9);
        return;
    }
    if (newNumber.length < 1) {
        user.showCustomNotify(player, 'Минимум 1 символ', 1, 9);
        return;
    }

    if (!lsc.checkValidNumber(newNumber)) {
        user.showCustomNotify(player, 'Только цифры (0-9) и буквы на англ. (A-Z)', 1, 9);
        return;
    }

    if (payType === 1) {
        if (newNumber.length == 1 && user.getBankMoney(player) < 1000000) {
            user.showCustomNotify(player, 'Номер из 1 символа стоит $1.000.000', 1, 9);
            return;
        }
        else if (newNumber.length == 2 && user.getBankMoney(player) < 500000) {
            user.showCustomNotify(player, 'Номер из 1 символа стоит $500.000', 1, 9);
            return;
        }
        else if (newNumber.length == 3 && user.getBankMoney(player) < 250000) {
            user.showCustomNotify(player, 'Номер из 1 символа стоит $250.000', 1, 9);
            return;
        }
        else if (newNumber.length == 4 && user.getBankMoney(player) < 100000) {
            user.showCustomNotify(player, 'Номер из 1 символа стоит $100.000', 1, 9);
            return;
        }
        else if(user.getBankMoney(player) < 40000) {
            user.showCustomNotify(player, 'Номер из 1 символа стоит $40.000', 1, 9);
            return;
        }
    }
    else {
        if (newNumber.length == 1 && user.getCashMoney(player) < 1000000) {
            user.showCustomNotify(player, 'Номер из 1 символа стоит $1.000.000', 1, 9);
            return;
        }
        else if (newNumber.length == 2 && user.getCashMoney(player) < 500000) {
            user.showCustomNotify(player, 'Номер из 1 символа стоит $500.000', 1, 9);
            return;
        }
        else if (newNumber.length == 3 && user.getCashMoney(player) < 250000) {
            user.showCustomNotify(player, 'Номер из 1 символа стоит $250.000', 1, 9);
            return;
        }
        else if (newNumber.length == 4 && user.getCashMoney(player) < 100000) {
            user.showCustomNotify(player, 'Номер из 1 символа стоит $100.000', 1, 9);
            return;
        }
        else if(user.getCashMoney(player) < 40000) {
            user.showCustomNotify(player, 'Номер из 1 символа стоит $40.000', 1, 9);
            return;
        }
    }

    mysql.executeQuery(`SELECT id FROM cars WHERE number = ? LIMIT 1`, newNumber, function (err, rows, fields) {
        if (rows.length === 0) {

            let valid = true;
            mp.vehicles.forEach(function (v) {
                if (!vehicles.exists(v))
                    return;
                if (vehicles.getNumberPlate(v) == newNumber)
                    valid = false;
            });

            if (valid) {

                try {
                    let price = 40000;
                    if (newNumber.length == 1) {
                        price = 1000000;
                    }
                    else if (newNumber.length == 2) {
                        price = 500000;
                    }
                    else if (newNumber.length == 3) {
                        price = 250000
                    }
                    else if (newNumber.length == 4) {
                        price = 100000;
                    }

                    if (payType === 1)
                        user.removeBankMoney(player, price, 'Смена номера на транспорте');
                    else
                        user.removeCashMoney(player, price, 'Смена номера на транспорте');
                    if (business.isOpen(shopId)) {
                        business.addMoney(shopId, price, 'Смена номера');
                        business.removeMoneyTax(shopId, price / 2);
                    }

                    mysql.executeQuery(`UPDATE items SET owner_id = '${mp.joaat(newNumber.trim())}' where owner_id = '${mp.joaat(vehicles.getNumberPlate(veh).trim())}' and owner_type = '${inventory.types.Vehicle}'`);

                    vehicles.set(veh.getVariable('container'), 'number', newNumber);
                    vehicles.setNumberPlate(veh, newNumber);

                    user.achiveDoneAllById(player, 18);
                    user.save(player);
                    vehicles.save(veh.getVariable('container'));

                    user.showCustomNotify(player, 'Вы изменили номер', 2, 9);
                }
                catch (e) {
                    methods.debug(e);
                }
                return;
            }
        }
        user.showCustomNotify(player, 'Номер уже занят', 1, 9);
    });
};

lsc.showTun = function(player, modType, idx) {
    methods.debug('lsc.showTun', modType, idx);
    if (!user.isLogin(player))
        return;
    let veh = player.vehicle;
    if (!vehicles.exists(veh))
        return;
    if (modType == 69)
        veh.windowTint = idx;
    else if (modType == 76)
        veh.livery = idx;
    else if (modType == 78)
        veh.wheelType = idx;
    else if (modType == 80)
    {
        /*for(let i = 0; i < 10; i++)
            veh.setExtra(i, false);
        veh.setExtra(idx, true);*/
        vSync.setExtraState(veh, idx);
    }
    else
        veh.setMod(modType, idx);
};

lsc.buySTun = function(player, modType, idx, price, shopId, itemName, payType) {
    methods.debug('lsc.buySTun');
    if (!user.isLogin(player))
        return;

    if (user.getMoney(player, payType) < price) {
        user.showCustomNotify(player, 'У вас недостаточно средств', 1, 9);
        return;
    }

    if (price < 0)
        return;

    let veh = player.vehicle;

    if (!vehicles.exists(veh))
        return;

    if (veh.getVariable('user_id') != user.getId(player)) {
        user.showCustomNotify(player, 'Транспорт должен быть личный', 1, 9);
        return;
    }

    if (veh.getVariable('user_id') < 1) {
        user.showCustomNotify(player, 'Транспорт должен быть личный', 1, 9);
        return;
    }

    if (modType === 0) {
        switch (idx) {
            case 0:
                idx = -1;
                break;
            case 1:
                idx = 0;
                break;
            case 2:
                idx = 0.25;
                break;
            case 3:
                idx = 0.5;
                break;
            case 4:
                idx = 0.75;
                break;
            case 5:
                idx = 1;
                break;
        }

        user.removeMoney(player, price, itemName, payType);
        price = price - 275000;
    }
    else
        user.removeMoney(player, price, itemName, payType);

    modType = modType + 100;

    let car = vehicles.getData(veh.getVariable('container'));
    let upgrade = JSON.parse(car.get('upgrade'));
    upgrade[modType.toString()] = idx;
    vehicles.set(veh.getVariable('container'), 'upgrade', JSON.stringify(upgrade));
    user.achiveDoneAllById(player, 18);
    if (business.isOpen(shopId)) {
        business.addMoney(shopId, price, itemName);
        business.removeMoneyTax(shopId, price / business.getPrice(shopId));
    }

    player.call('client:vehicle:resetHandling');
    user.showCustomNotify(player, 'Вы обновили ваш транспорт по цене', 2, 9);
    vehicles.save(veh.getVariable('container'));
};


lsc.buySFix = function(player, idx, price, shopId, itemName, payType) {
    methods.debug('lsc.buySTun');
    if (!user.isLogin(player))
        return;

    if (user.getMoney(player, payType) < price) {
        user.showCustomNotify(player, 'У вас недостаточно средств', 1, 9);
        return;
    }

    if (price < 0)
        return;

    let veh = player.vehicle;

    if (!vehicles.exists(veh))
        return;

    if (veh.getVariable('user_id') != user.getId(player)) {
        user.showCustomNotify(player, 'Транспорт должен быть личный', 1, 9);
        return;
    }

    if (veh.getVariable('user_id') < 1) {
        user.showCustomNotify(player, 'Транспорт должен быть личный', 1, 9);
        return;
    }


    player.call('client:vehicle:resetHandling');
    player.call('client:setNewMaxSpeedServer', [0]);
    user.removeMoney(player, price, itemName, payType);
    vehicles.set(veh.getVariable('container'), idx, 100);
    user.achiveDoneAllById(player, 18);
    if (business.isOpen(shopId)) {
        business.addMoney(shopId, price, itemName);
        business.removeMoneyTax(shopId, price / business.getPrice(shopId));
    }
    player.call('client:vehicle:resetHandling');
    user.showCustomNotify(player, 'Вы починили ваш транспорт', 2, 9);
    vehicles.save(veh.getVariable('container'));
};

lsc.resetSTun = function(player, modType) {
    methods.debug('lsc.resetSTun');
    if (!user.isLogin(player))
        return;

    let veh = player.vehicle;

    if (!vehicles.exists(veh)) {
        user.showCustomNotify(player, 'Нужно находиьтся в транспорте', 1, 9);
        return;
    }

    if (veh.getVariable('user_id') < 1) {
        user.showCustomNotify(player, 'Транспорт должен быть личный', 1, 9);
        return;
    }
    if (veh.getVariable('user_id') != user.getId(player)) {
        user.showCustomNotify(player, 'Транспорт должен быть личный', 1, 9);
        return;
    }

    modType = modType + 100;

    let car = vehicles.getData(veh.getVariable('container'));
    let upgrade = JSON.parse(car.get('upgrade'));
    upgrade[modType.toString()] = -1;
    vehicles.set(veh.getVariable('container'), 'upgrade', JSON.stringify(upgrade));

    player.call('client:vehicle:resetHandling');
    vehicles.save(veh.getVariable('container'));

    let lscSNames = [400000, 30000, 40000, 10000, 2000, 2000];
    let money = lscSNames[modType - 100];
    user.addCashMoney(player, money, 'Компенсация за ЧИП тюнинг VID: ' + veh.getVariable('container'));
    user.showCustomNotify(player, 'Вы сняли деталь, вам было компенсировано ' + methods.moneyFormat(money), 0, 9);
};

lsc.buyTun = function(player, modType, idx, price, shopId, itemName, payType) {
    methods.debug('lsc.buyTun');
    if (!user.isLogin(player))
        return;

    if (user.getMoney(player, payType) < price) {
        user.showCustomNotify(player, 'У вас недостаточно средств', 1, 9);
        return;
    }

    if (price < 0)
        return;

    let veh = player.vehicle;

    if (!vehicles.exists(veh))
        return;

    if (veh.getVariable('user_id') < 1) {
        user.showCustomNotify(player, 'Транспорт должен быть личный', 1, 9);
        return;
    }
    if (veh.getVariable('user_id') != user.getId(player)) {
        user.showCustomNotify(player, 'Транспорт должен быть личный', 1, 9);
        return;
    }

    if (modType == 76) {
        vehicles.set(veh.getVariable('container'), 'livery', idx);
    }
    else if (modType == 80) {
        vehicles.set(veh.getVariable('container'), 'extra', idx);
    }
    else {
        let car = vehicles.getData(veh.getVariable('container'));
        let upgrade = JSON.parse(car.get('upgrade'));
        upgrade[modType.toString()] = idx;
        if (modType === 23)
            upgrade["78"] = veh.wheelType;
        vehicles.set(veh.getVariable('container'), 'upgrade', JSON.stringify(upgrade));
    }

    if (price > 5) {
        user.removeMoney(player, price, 'Тюнинг транспорта. Деталь: ' + itemName, payType);
        if (business.isOpen(shopId)) {
            business.addMoney(shopId, price, itemName);
            business.removeMoneyTax(shopId, price / business.getPrice(shopId));
        }
        user.showCustomNotify(player, 'Вы установили деталь, цена: ' + methods.moneyFormat(price), 2, 9);
        //veh.setMod(modType, -1);
    }

    user.achiveDoneAllById(player, 18);
    //vehicles.setTunning(veh);
    vehicles.save(veh.getVariable('container'));
};

lsc.showNumberType = function(player, idx) {
    if (!user.isLogin(player))
        return;
    let veh = player.vehicle;
    if (!vehicles.exists(veh))
        return;
    if (veh.getVariable('user_id') < 1) {
        user.showCustomNotify(player, 'Транспорт должен быть личный', 1, 9);
        return;
    }
    veh.numberPlateType = idx;
};

lsc.buyNumberType = function(player, idx, price, shopId, payType) {
    methods.debug('lsc.buyColor1');
    if (!user.isLogin(player))
        return;

    if (user.getMoney(player, payType) < price) {
        user.showCustomNotify(player, 'У вас недостаточно средств', 1, 9);
        return;
    }

    if (price < 0)
        return;

    let veh = player.vehicle;

    if (!vehicles.exists(veh))
        return;

    if (veh.getVariable('user_id') < 1) {
        user.showCustomNotify(player, 'Транспорт должен быть личный', 1, 9);
        return;
    }

    veh.numberPlateType = idx;
    vehicles.set(veh.getVariable('container'), 'number_type', idx);

    user.removeMoney(player, price, 'Дизайн таблички номера', payType);
    if (business.isOpen(shopId)) {
        business.addMoney(shopId, price, 'Дизайн таблички номера');
        business.removeMoneyTax(shopId, price / business.getPrice(shopId));
    }

    user.showCustomNotify(player, 'Вы установили деталь', 2, 9);

    vehicles.setTunning(veh);
    vehicles.save(veh.getVariable('container'));
};

lsc.showColor1 = function(player, idx) {
    if (!user.isLogin(player))
        return;
    let veh = player.vehicle;
    if (!vehicles.exists(veh))
        return;

    if (veh.getVariable('fraction_id') < 0) {
        veh.setColor(idx, idx);
        return;
    }

    if (veh.getVariable('user_id') < 1) {
        user.showCustomNotify(player, 'Транспорт должен быть личный или фракционный', 1, 9);
        return;
    }
    veh.setColor(idx, veh.getColor(1));
};

lsc.showColor2 = function(player, idx) {
    if (!user.isLogin(player))
        return;
    let veh = player.vehicle;
    if (!vehicles.exists(veh))
        return;
    if (veh.getVariable('user_id') < 1) {
        user.showCustomNotify(player, 'Транспорт должен быть личный', 1, 9);
        return;
    }
    veh.setColor(veh.getColor(0), idx);
};

lsc.showColor3 = function(player, idx) {
    if (!user.isLogin(player))
        return;
    let veh = player.vehicle;
    if (!vehicles.exists(veh))
        return;
    if (veh.getVariable('user_id') < 1) {
        user.showCustomNotify(player, 'Транспорт должен быть личный', 1, 9);
        return;
    }
    veh.pearlescentColor = idx;
};

lsc.showColor4 = function(player, idx) {
    if (!user.isLogin(player))
        return;
    let veh = player.vehicle;
    if (!vehicles.exists(veh))
        return;
    if (veh.getVariable('user_id') < 1) {
        user.showCustomNotify(player, 'Транспорт должен быть личный', 1, 9);
        return;
    }
    veh.wheelColor = idx;
};

lsc.showColor5 = function(player, idx) {
    if (!user.isLogin(player))
        return;
    let veh = player.vehicle;
    if (!vehicles.exists(veh))
        return;
    if (veh.getVariable('user_id') < 1) {
        user.showCustomNotify(player, 'Транспорт должен быть личный', 1, 9);
        return;
    }
    vSync.setVehicleDashboardColor(veh, idx);
};

lsc.showColor6 = function(player, idx) {
    if (!user.isLogin(player))
        return;
    let veh = player.vehicle;
    if (!vehicles.exists(veh))
        return;
    if (veh.getVariable('user_id') < 1) {
        user.showCustomNotify(player, 'Транспорт должен быть личный', 1, 9);
        return;
    }
    vSync.setVehicleInteriorColor(veh, idx);
};

lsc.buyColor1 = function(player, idx, price, shopId, itemName, payType) {
    methods.debug('lsc.buyColor1');
    if (!user.isLogin(player))
        return;

    if (user.getMoney(player, payType) < price) {
        user.showCustomNotify(player, 'У вас недостаточно средств', 1, 9);
        return;
    }

    if (price < 0)
        return;

    let veh = player.vehicle;

    if (!vehicles.exists(veh))
        return;

    if (veh.getVariable('fraction_id') < 0) {
        try {
            veh.setColor(idx, idx);

            user.removeMoney(player, price, 'Цвет транспорта ' + itemName, payType);
            if (business.isOpen(shopId)) {
                business.addMoney(shopId, price, itemName);
                business.removeMoneyTax(shopId, price / business.getPrice(shopId));
            }

            user.showCustomNotify(player, 'Вы изменили цвет транспорта', 2, 9);

            vehicles.setColorFraction(veh.getVariable('veh_id'), idx);
        }
        catch (e) {
            
        }
        return;
    }

    if (veh.getVariable('user_id') < 1) {
        user.showCustomNotify(player, 'Транспорт должен быть личный', 1, 9);
        return;
    }

    veh.setColor(veh.getColor(0), idx);
    vehicles.set(veh.getVariable('container'), 'color1', idx);

    user.removeMoney(player, price, 'Цвет транспорта ' + itemName, payType);
    if (business.isOpen(shopId)) {
        business.addMoney(shopId, price, itemName);
        business.removeMoneyTax(shopId, price / business.getPrice(shopId));
    }

    user.showCustomNotify(player, 'Вы изменили цвет транспорта', 2, 9);

    vehicles.setTunning(veh);
    vehicles.save(veh.getVariable('container'));
};

lsc.buyColor2 = function(player, idx, price, shopId, itemName, payType) {
    methods.debug('lsc.buyColor2');
    if (!user.isLogin(player))
        return;
    if (user.getMoney(player, payType) < price) {
        user.showCustomNotify(player, 'У вас недостаточно средств', 1, 9);
        return;
    }

    if (price < 0)
        return;

    let veh = player.vehicle;

    if (!vehicles.exists(veh))
        return;

    if (veh.getVariable('user_id') < 1) {
        user.showCustomNotify(player, 'Транспорт должен быть личный', 1, 9);
        return;
    }

    veh.setColor(veh.getColor(0), idx);
    vehicles.set(veh.getVariable('container'), 'color2', idx);

    user.removeMoney(player, price, 'Цвет транспорта ' + itemName, payType);
    if (business.isOpen(shopId)) {
        business.addMoney(shopId, price, itemName);
        business.removeMoneyTax(shopId, price / business.getPrice(shopId));
    }

    user.showCustomNotify(player, 'Вы изменили цвет транспорта', 2, 9);

    vehicles.setTunning(veh);
    vehicles.save(veh.getVariable('container'));
};

lsc.buyColor3 = function(player, idx, price, shopId, itemName, payType) {
    methods.debug('lsc.buyColor3');
    if (!user.isLogin(player))
        return;
    if (user.getMoney(player, payType) < price) {
        user.showCustomNotify(player, 'У вас недостаточно средств', 1, 9);
        return;
    }

    if (price < 0)
        return;

    let veh = player.vehicle;

    if (!vehicles.exists(veh))
        return;

    if (veh.getVariable('user_id') < 1) {
        user.showCustomNotify(player, 'Транспорт должен быть личный', 1, 9);
        return;
    }

    veh.pearlescentColor = idx;
    vehicles.set(veh.getVariable('container'), 'color3', idx);

    user.removeMoney(player, price, 'Цвет транспорта ' + itemName, payType);
    if (business.isOpen(shopId)) {
        business.addMoney(shopId, price, itemName);
        business.removeMoneyTax(shopId, price / business.getPrice(shopId));
    }

    user.showCustomNotify(player, 'Вы изменили цвет транспорта', 2, 9);

    vehicles.setTunning(veh);
    vehicles.save(veh.getVariable('container'));
};

lsc.buyColor4 = function(player, idx, price, shopId, itemName, payType) {
    methods.debug('lsc.buyColor4');
    if (!user.isLogin(player))
        return;
    if (user.getMoney(player, payType) < price) {
        user.showCustomNotify(player, 'У вас недостаточно средств', 1, 9);
        return;
    }

    if (price < 0)
        return;

    let veh = player.vehicle;

    if (!vehicles.exists(veh))
        return;

    if (veh.getVariable('user_id') < 1) {
        user.showCustomNotify(player, 'Транспорт должен быть личный', 1, 9);
        return;
    }

    veh.wheelColor = idx;
    vehicles.set(veh.getVariable('container'), 'colorwheel', idx);

    user.removeMoney(player, price, 'Цвет колёс ' + itemName, payType);
    if (business.isOpen(shopId)) {
        business.addMoney(shopId, price, itemName);
        business.removeMoneyTax(shopId, price / business.getPrice(shopId));
    }

    user.showCustomNotify(player, 'Вы изменили цвет колёс транспорта', 2, 9);

    vehicles.setTunning(veh);
    vehicles.save(veh.getVariable('container'));
};

lsc.buyColor5 = function(player, idx, price, shopId, itemName, payType) {
    methods.debug('lsc.buyColor5');
    if (!user.isLogin(player))
        return;
    if (user.getMoney(player, payType) < price) {
        user.showCustomNotify(player, 'У вас недостаточно средств', 1, 9);
        return;
    }

    if (price < 0)
        return;

    let veh = player.vehicle;

    if (!vehicles.exists(veh))
        return;

    if (veh.getVariable('user_id') < 1) {
        user.showCustomNotify(player, 'Транспорт должен быть личный', 1, 9);
        return;
    }

    vSync.setVehicleDashboardColor(veh, idx);
    vehicles.set(veh.getVariable('container'), 'colord', idx);

    user.removeMoney(player, price, 'Цвет приборной панели ' + itemName, payType);
    if (business.isOpen(shopId)) {
        business.addMoney(shopId, price, itemName);
        business.removeMoneyTax(shopId, price / business.getPrice(shopId));
    }

    user.showCustomNotify(player, 'Вы изменили цвет приборной панели транспорта', 2, 9);

    vehicles.setTunning(veh);
    vehicles.save(veh.getVariable('container'));
};

lsc.buyColor6 = function(player, idx, price, shopId, itemName, payType) {
    methods.debug('lsc.buyColor6');
    if (!user.isLogin(player))
        return;
    if (user.getMoney(player, payType) < price) {
        user.showCustomNotify(player, 'У вас недостаточно средств', 1, 9);
        return;
    }

    if (price < 0)
        return;

    let veh = player.vehicle;

    if (!vehicles.exists(veh))
        return;

    if (veh.getVariable('user_id') < 1) {
        user.showCustomNotify(player, 'Транспорт должен быть личный', 1, 9);
        return;
    }

    vSync.setVehicleInteriorColor(veh, idx);
    vehicles.set(veh.getVariable('container'), 'colori', idx);

    user.removeMoney(player, price, 'Цвет салона ' + itemName, payType);
    if (business.isOpen(shopId)) {
        business.addMoney(shopId, price, itemName);
        business.removeMoneyTax(shopId, price / business.getPrice(shopId));
    }

    user.showCustomNotify(player, 'Вы изменили цвет салона транспорта', 2, 9);

    vehicles.setTunning(veh);
    vehicles.save(veh.getVariable('container'));
};

lsc.checkValidNumber = function(number) {
    methods.debug('lsc.checkValidNumber');
    number = number.toUpperCase();
    let chars = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let i = 0; i < number.length; i++) {

        let isValid = false;
        for (let j = 0; j < chars.length; j++)
        {
            if (number.charAt(i) == chars.charAt(j))
                isValid = true;
        }

        if (!isValid)
            return false;
    }
    return true;
};