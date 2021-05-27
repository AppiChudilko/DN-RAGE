let methods = require('../modules/methods');
let mysql = require('../modules/mysql');

let vSync = require('../managers/vSync');

let business = require('../property/business');
let vehicles = require('../property/vehicles');
let houses = require('../property/houses');

let user = require('../user');
let enums = require('../enums');
let coffer = require('../coffer');

let vShop = exports;

vShop.loadAllShop = () => {
    enums.carShopList.forEach(item => {
        if (item.id == 0)
            return;
        let blip = methods.createBlip(new mp.Vector3(item.buyPos[0], item.buyPos[1], item.buyPos[2]), item.blipId, item.blipColor, 0.9, 'Shop');
        methods.createCp(blip.position.x, blip.position.y, blip.position.z - 1, "Нажмите ~g~Е~s~ чтобы открыть меню");
    });
};

vShop.loadAllShopVehicles = () => {
    enums.carShopVehicleList.forEach(item => {
        vehicles.spawnCarCb(veh => {
            if (!vehicles.exists(veh))
                return;
            let vInfo = methods.getVehicleInfo(item[0]);

            let fuelSpeed = 20;
            let fuel = vInfo.fuel_min / fuelSpeed * 100;
            if (fuel > 100)
                fuel = 100;

            let st = vInfo.stock / 7000000 * 100;
            if (st > 100)
                st = 100;

            veh.locked = true;
            veh.engine = false;
            veh.setVariable('useless', true);
            veh.setVariable('s_name', item[0]);
            veh.setVariable('s_price', vInfo.price);
            veh.setVariable('s_fuel', fuel);
            veh.setVariable('s_stock', st);
        }, new mp.Vector3(item[1], item[2], item[3]), item[4], item[0]);

        /*if (item[0] !== ' ')
            methods.createCp(item[1], item[2], item[3], `~b~Название:~s~ ${item[0]}\n~b~Цена: ~g~${methods.moneyFormat(methods.getVehicleInfo(item[0]).price)}`, 5, -1, [0, 0, 0, 0]);*/
    });

    enums.carTacoVehicleList.forEach(item => {
        vehicles.spawnCarCb(veh => {
            if (!vehicles.exists(veh))
                return;
            veh.locked = true;
            veh.engine = false;
            veh.setVariable('useless', true);
            vSync.setTrunkState(veh, true);
        }, new mp.Vector3(item[1], item[2], item[3]), item[4], item[0]);
    });
};

vShop.getInRadius = function(pos, radius = 2) {
    methods.debug('gun.getInRadius');
    let shopId = -1;
    enums.carShopList.forEach(function (item, idx) {
        if (item.id == 0)
            return -1;
        let shopPos = new mp.Vector3(item.buyPos[0], item.buyPos[1], item.buyPos[2]);
        if (methods.distanceToPos(pos, shopPos) < radius)
            shopId = idx;
    });
    return shopId;
};

vShop.checkPosForOpenMenu = function(player) {
    methods.debug('gun.checkPosForOpenMenu');
    try {
        let playerPos = player.position;
        let shopId = vShop.getInRadius(playerPos, 2);
        if (shopId == -1)
            return;

        let vList = [];
        let where = '';
        enums.vehicleInfo.forEach(item => {
            if (enums.carShopList[shopId].auto != item.type)
                return;
            where += ` OR name = '${item.display_name}'`
        });

        let mapList = new Map();

        mysql.executeQuery(`SELECT name, count(name) as n FROM cars WHERE user_id = '0' AND (name = ''${where}) GROUP BY name HAVING n <> 0 ORDER BY name ASC`, function (err, rows, fields) {

            rows.forEach(row => {
                mapList.set(row['name'], row['n']);
            });

            player.call('client:menuList:showVehShopMenu', [
                enums.carShopList[shopId].id,
                enums.carShopList[shopId].auto,
                JSON.stringify(enums.carShopList[shopId].carPos),
                JSON.stringify(enums.carShopList[shopId].buyPos),
                Array.from(mapList),
            ]);
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

vShop.findNearest = function(pos) {
    methods.debug('gun.findNearest');
    let prevPos = new mp.Vector3(9999, 9999, 9999);
    gun.list.forEach(function (item,) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(shopPos, pos) < methods.distanceToPos(prevPos, pos))
            prevPos = shopPos;
    });
    return prevPos;
};

vShop.buy = function(player, model, color1, color2, shopId, payType) {
    if (!user.isLogin(player))
        return;

    let vInfo = methods.getVehicleInfo(model);
    let price = vInfo.price;

    if (user.getMoney(player, payType) < price)
    {
        player.notify('~r~У Вас недостаточно средств');
        return;
    }

    switch (vInfo.class_name) {
        case 'Planes':
        case 'Helicopters':
            if (!user.get(player, 'air_lic')) {
                player.notify('~r~У Вас нет лицензии на воздушный транспорт');
                return;
            }
            break;
        case 'Boats':
            if (!user.get(player, 'ship_lic')) {
                player.notify('~r~У Вас нет лицензии на водный транспорт');
                return;
            }
            break;
        case 'Commercials':
        case 'Industrial':
            if (!user.get(player, 'c_lic')) {
                player.notify('~r~У Вас нет лицензии категории C');
                return;
            }
            break;
        case 'Compacts':
        case 'Coupes':
        case 'Muscle':
        case 'Off-Road':
        case 'Sedans':
        case 'Sports':
        case 'Sports Classics':
        case 'Super':
        case 'SUVs':
        case 'Utility':
        case 'Vans':
            if (!user.get(player, 'b_lic')) {
                player.notify('~r~У Вас нет лицензии категории B');
                return;
            }
            break;
        case 'Motorcycles':
            if (!user.get(player, 'a_lic')) {
                player.notify('~r~У Вас нет лицензии категории А');
                return;
            }
            break;
    }

    let freeSlot = user.getVehicleFreeSlot(player);
    /*else if (user.get(player, 'car_id6') == 0) {
        freeSlot = 6;
    }*/

    /*let freeSlot = 0;
    for (let i = 1; i <= 10; i++) {
        if (user.get(player, 'car_id' + i) == 0 && freeSlot == 0) {
            freeSlot = 1;
            break;
        }
    }*/

    if (freeSlot === 0) {
        player.notify('~r~У Вас нет свободных слотов под транспорт');
        return;
    }

    if (user.has(player, 'buyCar')) {
        player.notify('~r~Таймаут на покупку транспорта 2 минуты');
        return;
    }

    user.set(player, 'buyCar', true);
    setTimeout(function () {
        if (user.isLogin(player))
            user.reset(player, 'buyCar');
    }, 120000);

    let shopItem = enums.carShopList[shopId];

    mysql.executeQuery(`SELECT * FROM cars WHERE user_id = '0' AND name = '${vInfo.display_name}' ORDER BY rand() LIMIT 1`, function (err, rows, fields) {

        rows.forEach(row => {
            try {
                let id = row['id'];

                row['user_id'] = user.getId(player);
                row['user_name'] = user.getRpName(player);
                row['color1'] = color1;
                row['color2'] = color2;
                row['price'] = price;

                vehicles.updatePrice(id, price);
                vehicles.updateOwnerInfo(id, user.getId(player), user.getRpName(player));
                vehicles.loadUserVehicleByRow(row);
                user.set(player, 'car_id' + freeSlot, id);
                user.save(player);
                vehicles.save(id);

                user.addHistory(player, 3, 'Покупка транспорта ' + model);
                user.removeMoney(player, price, 'Покупка транспорта ' + model, payType);
                coffer.addMoney(1, price);

                user.achiveDoneAllById(player, 30);

                setTimeout(function () {
                    if (user.isLogin(player)) {
                        if (vInfo.fuel_type == 3)
                            vShop.sendNotify(player, shopId, 'Поздравляем', `Поздравляем с покупкой электрокара ~g~${vInfo.display_name}~s~.\n\nСпасибо за то, что сохраняете экологию ;)`);
                        else
                            vShop.sendNotify(player, shopId, 'Поздравляем', `Поздравляем с покупкой транспорта ~b~${vInfo.display_name}~s~.`);

                        vShop.sendNotify(player, shopId, '~r~Налог', `Учтите, что за ваш транспорт необходимо платить налог в здании правительства.`);

                        let serverId = vehicles.get(id, 'serverId');
                        let veh = mp.vehicles.at(serverId);
                        if (vehicles.exists(veh)) {
                            veh.position = new mp.Vector3(shopItem.spawnPos[0], shopItem.spawnPos[1], shopItem.spawnPos[2]);
                            veh.heading = shopItem.spawnPos[3] - 180;
                            user.putInVehicle(player, veh, -1);
                            vehicles.setFuel(veh, methods.getVehicleInfo(veh.model).fuel_full);
                        }
                    }
                }, 2000);
            }
            catch (e) {
                methods.debug(e);
            }
        });
    });
};

vShop.sendNotify = function(player, shopId, title, text) {
    if (user.isLogin(player)) {
        let shopItem = enums.carShopList[shopId];
        player.notifyWithPicture(`${shopItem.name}`, '~g~' + title, text, shopItem.notifyPic, 2);
    }
};

vShop.rent = function(player, model, color1, color2, shopId) {

    if (!user.isLogin(player))
        return;

    let vInfo = methods.getVehicleInfo(model);
    let className =  vInfo.class_name;
    let price = vInfo.price / 100 + 100;

    if (user.getMoney(player) < price)
    {
        player.notify('~r~У вас недостаточно средств');
        return;
    }

    let shopItem = enums.carShopList[shopId];

    switch (className) {
        case 'Planes':
        case 'Helicopters':
            if (!user.get(player, 'air_lic')) {
                player.notify('~r~У Вас нет лицензии на воздушный транспорт');
                return;
            }
            break;
        case 'Boats':
            if (!user.get(player, 'ship_lic')) {
                player.notify('~r~У Вас нет лицензии на водный транспорт');
                return;
            }
            break;
        case 'Commercials':
        case 'Industrial':
            if (!user.get(player, 'c_lic')) {
                player.notify('~r~У Вас нет лицензии категории C');
                return;
            }
            break;
        case 'Compacts':
        case 'Coupes':
        case 'Muscle':
        case 'Off-Road':
        case 'Sedans':
        case 'Sports':
        case 'Sports Classics':
        case 'Super':
        case 'SUVs':
        case 'Utility':
        case 'Vans':
            if (!user.get(player, 'b_lic')) {
                player.notify('~r~У Вас нет лицензии категории B');
                return;
            }
            break;
        case 'Motorcycles':
            if (model != 'Faggio' && !user.get(player, 'a_lic')) {
                player.notify('~r~У Вас нет лицензии категории А');
                return;
            }
            break;
    }

    let countOwnerCars = 0;

    mp.vehicles.forEach(function (v) {
        if (!vehicles.exists(v))
            return;
        if (v.getVariable('rentOwner') == user.getId(player))
            countOwnerCars++;
    });

    if (countOwnerCars > 10) {
        player.notify('~r~Нельзя арендовывать более 10 ТС');
        return;
    }

    user.removeMoney(player, price, 'Аренда транспорта ' + model);
    coffer.addMoney(1, price);
    vehicles.spawnCarCb(veh => {

        if (!vehicles.exists(veh))
            return;

        vehicles.setNumberPlate(veh, ('RENT' + veh.getVariable('vid')).toString().trim());
        veh.setColor(color1, color2);
        vSync.setEngineState(veh, false);
        veh.locked = true;
        veh.setVariable('owner_id', user.getId(player));
        veh.setVariable('rentOwner', user.getId(player));

        if (!user.isLogin(player))
            return;
        user.putInVehicle(player, veh, -1);
        vShop.sendNotify(player, shopId, 'Аренда', `Вы арендовали транспорт ~b~${vInfo.display_name}~s~.`);

    }, new mp.Vector3(shopItem.spawnPos[0], shopItem.spawnPos[1], shopItem.spawnPos[2]), shopItem.spawnPos[3], model);
};