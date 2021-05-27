let methods = require('../modules/methods');
let mysql = require('../modules/mysql');

let enums = require('../enums');
let user = require('../user');
let inventory = require('../inventory');

let business = require('../property/business');

let shopList = enums.shopList;

let cloth = exports;

cloth.maskShop = new mp.Vector3(-1337.255, -1277.948, 3.872962);
cloth.maskShop2 = new mp.Vector3(5081.2587890625, -5755.23486328125, 14.829644203186035);
cloth.printShopPos = new mp.Vector3(-1339.9146728515625, -1268.3306884765625, 3.8951973915100098);

cloth.loadAll = function(){
    methods.debug('barberShop.loadAll');

    /*methods.createBlip(cloth.printShopPos, 72, 0, 0.8, 'Print Shop');
    methods.createCpVector(cloth.printShopPos, 'Нажмите ~g~E~s~ чтобы открыть меню', 1, -1, [33, 150, 243, 100]);*/

    methods.createBlip(cloth.maskShop, 437, 0, 0.8, 'Movie Masks');
    methods.createCp(cloth.maskShop.x, cloth.maskShop.y, cloth.maskShop.z, "Нажмите ~g~E~s~ чтобы открыть меню магазина", 0.8, -1, [33, 150, 243, 100], 0.3);

    methods.createBlip(cloth.maskShop2, 437, 0, 0.8, 'Movie Masks');
    methods.createCp(cloth.maskShop2.x, cloth.maskShop2.y, cloth.maskShop2.z, "Нажмите ~g~E~s~ чтобы открыть меню магазина", 0.8, -1, [33, 150, 243, 100], 0.3);

    methods.createBlip(new mp.Vector3(-619.8532104492188, -233.54541015625, 37.0570182800293), 617, 0, 0.8, 'Vangelico');
    try {
        for (let i = 0; i < shopList.length; i++) {
            let pos = new mp.Vector3(shopList[i][3], shopList[i][4], shopList[i][5]);
            let shopType = shopList[i][0];

            if (shopList[i][6] === 0) {
                switch (shopType) {
                    case 0:
                        methods.createBlip(pos, 73, 68, 0.8);
                        break;
                    case 1:
                        methods.createBlip(pos, 73, 0, 0.8);
                        break;
                    case 2:
                        methods.createBlip(pos, 73, 21, 0.8);
                        break;
                    case 3:
                        methods.createBlip(pos, 73, 73, 0.8);
                        break;
                    /*case 4:
                        methods.createBlip(pos, 617, 0, 0.8);
                        break;*/
                    case 5:
                        methods.createBlip(pos, 73, 81, 0.8);
                        break;
                }
                methods.createCp(pos.x, pos.y, pos.z, "Нажмите ~g~E~s~ чтобы открыть меню магазина", 0.8, -1, [33, 150, 243, 100], 0.3);
            }

            if (shopType === 3 || shopType === 999)
                methods.createCp(pos.x, pos.y, pos.z, "Нажмите ~g~E~s~ чтобы открыть меню магазина", 0.8, -1, [33, 150, 243, 100], 0.3);
            if (shopType === 4) {
                methods.createCp(pos.x, pos.y, pos.z, "Нажмите ~g~E~s~ чтобы открыть меню магазина", 0.8, -1, [33, 150, 243, 100], 0.3);
            }

        }
    } catch (e) {
        console.log(e);
        throw e;
    }
};

cloth.checkPosForOpenMenu = function (player) {
    methods.debug('barberShop.checkPosForOpenMenu');
    try {
        let playerPos = player.position;

        if (methods.distanceToPos(cloth.maskShop, playerPos) < 2) {
            /*if (!business.isOpen(69)) {
                player.notify('~r~К сожалению магазин сейчас не работает');
                return;
            }*/
            player.call('client:menuList:showShopMaskMenu', [69]);
            return;
        }
        if (methods.distanceToPos(cloth.maskShop2, playerPos) < 2) {
            /*if (!business.isOpen(69)) {
                player.notify('~r~К сожалению магазин сейчас не работает');
                return;
            }*/
            player.call('client:menuList:showShopMaskMenu', [166]);
            return;
        }

        /*if (methods.distanceToPos(cloth.printShopPos, playerPos) < 2) {
            if (!business.isOpen(70)) {
                player.notify('~r~К сожалению магазин сейчас не работает');
                return;
            }
            player.call('client:menuList:showPrintShopMenu');
            return;
        }*/

        for (let i = 0; i < shopList.length; i++){
            if(methods.distanceToPos(playerPos, new mp.Vector3(shopList[i][3], shopList[i][4], shopList[i][5])) < 1.2){
                /*if (!business.isOpen(shopList[i][1])) {
                    player.notify('~r~К сожалению магазин сейчас не работает');
                    return;
                }*/

                let shopType = shopList[i][0];
                let animList = [
                    ["Сесть 1","amb@prop_human_seat_chair@male@generic@base", "base",9],
                    ["Сесть 2","amb@prop_human_seat_chair@male@elbows_on_knees@base", "base",9],
                    ["Сесть 3","amb@prop_human_seat_chair@male@left_elbow_on_knee@base", "base",9],
                    ["Сесть 4","amb@prop_human_seat_chair@male@right_foot_out@base", "base",9],
                    ["Сидеть расслаблено - 2", "anim@amb@office@seating@male@var_e@base@", "base",9],
                    ["Сидеть расслаблено - 3", "anim@amb@office@seating@male@var_d@base@", "base",9],
                    ["Сидеть расслаблено - 4", "anim@amb@office@seating@female@var_d@base@", "base",9],
                    ["Сидеть расслаблено - 5", "anim@amb@office@seating@female@var_c@base@", "base",9],
                    ["Сидеть сложа руки - 3", "amb@world_human_seat_steps@male@hands_in_lap@base", "base",9],
                ];
                let animId = methods.getRandomInt(0, animList.length);

                if (player.dimension === 0)
                    user.stopAnimationNow(player);

                if (shopType === 3 || shopType === 4 || shopType === 999) {

                    player.position = new mp.Vector3(shopList[i][3], shopList[i][4], shopList[i][5] + 1.05);
                    user.heading(player, shopList[i][6]);
                }
                else {
                    let offset = 0;
                    if (shopList[i][6] === 0)
                        offset = 1;

                    if (player.dimension === 0 && offset === 0)
                        player.position = new mp.Vector3(shopList[i + offset][3], shopList[i + offset][4], shopList[i + offset][5] + 1.05);
                    else if (offset === 0)
                        player.position = new mp.Vector3(shopList[i + offset][3], shopList[i + offset][4], shopList[i + offset][5]);
                    else
                        player.position = new mp.Vector3(shopList[i + offset][3], shopList[i + offset][4], shopList[i + offset][5] + 1.05);
                    user.heading(player, shopList[i + offset][6]);
                }

                player.dimension = player.id + 1;
                setTimeout(function () {
                    try {
                        if (shopType !== 3 && shopType !== 4 && shopType !== 999)
                            user.playAnimation(player, animList[animId][1], animList[animId][2], animList[animId][3]);
                        player.call('client:menuList:showShopClothMenu', [shopList[i][1], shopList[i][0], shopList[i][2], business.getPrice(shopList[i][1])]);
                    }
                    catch (e) {}
                }, 200);
                return;
            }
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

cloth.findNearest = function(pos) {
    methods.debug('cloth.findNearest');
    let prevPos = new mp.Vector3(9999, 9999, 9999);
    shopList.forEach(function (item,) {
        if (item[0] === 3 || item[0] === 4 || item[0] === 999)
            return;
        let shopPos = new mp.Vector3(item[3], item[4], item[5]);
        if (methods.distanceToPos(shopPos, pos) < methods.distanceToPos(prevPos, pos))
            prevPos = shopPos;
    });
    return prevPos;
};

cloth.changeProp = function (player, body, clothId, color) {
    methods.debug('barberShop.changeProp');
    try {
        user.setProp(player, body, clothId, color);
    }
    catch (e) {
        methods.debug(e);
    }
};

cloth.buyProp = function (player, price, body, clothId, color, itemName, shopId, isFree, payType = 0) {
    methods.debug('barberShop.buyProp');

    if (price < 0)
        return;

    if (!user.isLogin(player))
        return;

    if (payType === 1) {
        if (user.getBankMoney(player) < price && !isFree) {
            user.showCustomNotify(player, 'У вас недостаточно средств', 1, 9);
            user.updateCharacterCloth(player);
            return;
        }
    }
    else {
        if (user.getCashMoney(player) < price && !isFree) {
            user.showCustomNotify(player, 'У вас недостаточно средств', 1, 9);
            user.updateCharacterCloth(player);
            return;
        }
    }

    let params = `{"name": "${itemName}", "sex": ${user.getSex(player)}}`;

    switch (body) {
        case 0:
            inventory.updateItemsEquipByItemId(269, user.getId(player), inventory.types.Player, 0);

            user.set(player, 'hat', clothId);
            user.set(player, 'hat_color', color);

            params = `{"name": "${itemName}", "sex": ${user.getSex(player)}, "hat": ${clothId}, "hat_color": ${color}}`;
            inventory.addItem(269, 1, inventory.types.Player, user.getId(player), 1, 1, params, 100);
            break;
        case 1:
            inventory.updateItemsEquipByItemId(270, user.getId(player), inventory.types.Player, 0);

            user.set(player, 'glasses', clothId);
            user.set(player, 'glasses_color', color);

            params = `{"name": "${itemName}", "sex": ${user.getSex(player)}, "glasses": ${clothId}, "glasses_color": ${color}}`;
            inventory.addItem(270, 1, inventory.types.Player, user.getId(player), 1, 1, params, 100);
            break;
        case 2:
            inventory.updateItemsEquipByItemId(271, user.getId(player), inventory.types.Player, 0);

            user.set(player, 'ear', clothId);
            user.set(player, 'ear_color', color);

            params = `{"name": "${itemName}", "sex": ${user.getSex(player)}, "ear": ${clothId}, "ear_color": ${color}}`;
            inventory.addItem(271, 1, inventory.types.Player, user.getId(player), 1, 1, params, 100);
            break;
        case 6:
            inventory.updateItemsEquipByItemId(272, user.getId(player), inventory.types.Player, 0);

            user.set(player, 'watch', clothId);
            user.set(player, 'watch_color', color);

            params = `{"name": "${itemName}", "sex": ${user.getSex(player)}, "watch": ${clothId}, "watch_color": ${color}}`;
            inventory.addItem(272, 1, inventory.types.Player, user.getId(player), 1, 1, params, 100);
            break;
        case 7:
            inventory.updateItemsEquipByItemId(273, user.getId(player), inventory.types.Player, 0);

            user.set(player, 'bracelet', clothId);
            user.set(player, 'bracelet_color', color);

            params = `{"name": "${itemName}", "sex": ${user.getSex(player)}, "bracelet": ${clothId}, "bracelet_color": ${color}}`;
            inventory.addItem(273, 1, inventory.types.Player, user.getId(player), 1, 1, params, 100);
            break;
    }

    if (!isFree) {
        if (payType === 1)
            user.removeBankMoney(player, price, 'Покупка аксессуара ' + itemName);
        else
            user.removeCashMoney(player, price, 'Покупка аксессуара ' + itemName);

        if (business.isOpen(shopId)) {
            business.addMoney(shopId, price, itemName);
            business.removeMoneyTax(shopId, price / business.getPrice(shopId));
        }

        user.showCustomNotify(player, 'Вы купили аксессуар', 2, 9);
    }

    user.updateCharacterCloth(player);
    user.setProp(player, body, clothId, color);
    user.save(player);
};

cloth.change = function (player, body, cloth, color, torso, torsoColor, parachute, parachuteColor) {
    methods.debug('barberShop.change');
    if (body == 11)
    {
        if (torso == -1) torso = 0;
        if (torsoColor == -1) torsoColor = 0;
        if (parachuteColor == -1) parachuteColor = 240;
        if (parachuteColor != 240) parachuteColor++;

        user.setComponentVariation(player, 3, torso, torsoColor);
        user.setComponentVariation(player, 8, parachute, parachuteColor);
    }
    user.setComponentVariation(player, body, cloth, color);
};

cloth.getClothBagName = function (idx) {
    methods.debug('cloth.getClothBagName');
    let names = ['Черная', 'Синяя', 'Желтая', 'Розовая', 'Зелёная', 'Оранжевая', 'Фиолетовая', 'Светло-розовая', 'Красно-синяя', 'Голубая', 'Цифра', 'Флора', 'Синяя флора', 'Узор', 'Пустынная', 'Камо', 'Белая'];
    return names[idx];
};

cloth.buy = function (player, price, body, cloth, color, torso, torsoColor, parachute, parachuteColor, itemName = "Одежда", shopId = 0, isFree = false, payType = 0) {
    methods.debug('cloth.buy');
    if (!user.isLogin(player))
        return;

    if (payType === 1) {
        if (user.getBankMoney(player) < price && !isFree) {
            user.showCustomNotify(player, 'У вас недостаточно средств', 1, 9);
            user.updateCharacterCloth(player);
            return;
        }
    }
    else {
        if (user.getCashMoney(player) < price && !isFree) {
            user.showCustomNotify(player, 'У вас недостаточно средств', 1, 9);
            user.updateCharacterCloth(player);
            return;
        }
    }

    if (price < 0)
        return;

    let params = `{"name": "${itemName}"}`;

    switch (body) {
        /*case 1:
            inventory.updateItemsEquipByItemId(274, user.getId(player), inventory.types.Player, 0);

            user.set(player, 'mask', cloth);
            user.set(player, 'mask_color', color);

            params = `{"name": "${itemName}", "sex": ${user.getSex(player)}, "mask": ${cloth}, "mask_color": ${color}}`;
            inventory.addItem(274, 1, inventory.types.Player, user.getId(player), 1, 1, params, 100);
            break;*/
        case 4:
            inventory.updateItemsEquipByItemId(266, user.getId(player), inventory.types.Player, 0);

            user.set(player, 'leg', cloth);
            user.set(player, 'leg_color', color);

            params = `{"name": "${itemName}", "sex": ${user.getSex(player)}, "leg": ${cloth}, "leg_color": ${color}}`;
            inventory.addItem(266, 1, inventory.types.Player, user.getId(player), 1, 1, params, 100);
            break;
        case 3:
            inventory.updateItemsEquipByItemId(275, user.getId(player), inventory.types.Player, 0);

            user.set(player, 'gloves', cloth);
            user.set(player, 'gloves_color', color);

            params = `{"name": "${itemName}", "sex": ${user.getSex(player)}, "gloves": ${cloth}, "gloves_color": ${color}}`;
            inventory.addItem(275, 1, inventory.types.Player, user.getId(player), 1, 1, params, 100);
            break;
        case 5:
            inventory.updateItemsEquipByItemId(264, user.getId(player), inventory.types.Player, 0);

            user.set(player, 'hand', cloth);
            user.set(player, 'hand_color', color);

            params = `{"name": "${itemName}", "sex": ${user.getSex(player)}, "hand": ${cloth}, "hand_color": ${color}}`;
            /*if (cloth == 82)
            {
                let names = ['Черная', 'Синяя', 'Желтая', 'Розовая', 'Зелёная', 'Оранжевая', 'Фиолетовая', 'Светло-розовая', 'Красно-синяя', 'Голубая', 'Цифра', 'Флора', 'Синяя флора', 'Узор', 'Пустынная', 'Камо', 'Белая'];
                params = `{"name": "${itemName} (${names[color]})", "sex": ${user.getSex(player)}, "hand": ${cloth}, "hand_color": ${color}}`;
            }*/

            if (cloth == 41 || cloth == 45 || cloth == 82 || cloth == 86 || cloth == 22 || cloth == 23)
                inventory.addItem(264, 1, inventory.types.Player, user.getId(player), 1, 1, params, 100);
            else
                inventory.addItem(263, 1, inventory.types.Player, user.getId(player), 1, 1, params, 100);
            break;
        case 6:
            inventory.updateItemsEquipByItemId(267, user.getId(player), inventory.types.Player, 0);

            user.set(player, 'foot', cloth);
            user.set(player, 'foot_color', color);

            params = `{"name": "${itemName}", "sex": ${user.getSex(player)}, "foot": ${cloth}, "foot_color": ${color}}`;
            inventory.addItem(267, 1, inventory.types.Player, user.getId(player), 1, 1, params, 100);
            break;
        case 7:
            inventory.updateItemsEquipByItemId(268, user.getId(player), inventory.types.Player, 0);

            user.set(player, 'accessorie', cloth);
            user.set(player, 'accessorie_color', color);

            params = `{"name": "${itemName}", "sex": ${user.getSex(player)}, "accessorie": ${cloth}, "accessorie_color": ${color}}`;
            inventory.addItem(268, 1, inventory.types.Player, user.getId(player), 1, 1, params, 100);
            break;
        case 10:
            user.set(player, 'decal', cloth);
            user.set(player, 'decal_color', color);
            break;
        case 11:

            inventory.updateItemsEquipByItemId(265, user.getId(player), inventory.types.Player, 0);

            if (torso == -1) torso = 0;
            if (torsoColor == -1) torsoColor = 0;
            if (parachuteColor == -1) parachuteColor = 240;
            if (parachuteColor != 240) parachuteColor++;

            user.set(player, 'body', cloth);
            user.set(player, 'body_color', color);

            user.set(player, 'torso', torso);
            user.set(player, 'torso_color', torsoColor);
            user.setComponentVariation(player, 3, torso, torsoColor);

            user.set(player, 'parachute', parachute);
            user.set(player, 'parachute_color', parachuteColor);

            user.set(player, 'tprint_c', '');
            user.set(player, 'tprint_o', '');
            user.setComponentVariation(player, 8, parachute, parachuteColor);

            params = `{"name": "${itemName}", "body": ${cloth}, "body_color": ${color}, "torso": ${torso}, "torso_color": ${torsoColor}, "parachute": ${parachute}, "parachute_color": ${parachuteColor}, "sex": ${user.getSex(player)}, "tprint_c": "", "tprint_o": ""}`;
            inventory.addItem(265, 1, inventory.types.Player, user.getId(player), 1, 1, params, 100);
            break;
    }

    if (!isFree) {
        if (payType === 1)
            user.removeBankMoney(player, price, 'Покупка одежды ' + itemName);
        else
            user.removeCashMoney(player, price, 'Покупка одежды ' + itemName);

        if (business.isOpen(shopId)) {
            business.addMoney(shopId, price, itemName);
            business.removeMoneyTax(shopId, price / business.getPrice(shopId));
        }
        user.showCustomNotify(player, 'Вы купили одежду, старая одежда находится в инвентаре', 2, 9);
    }

    user.updateCharacterCloth(player);
    user.setComponentVariation(player, body, cloth, color);
    user.updateClientCache(player);
    user.save(player);
};

cloth.changeMask = function (player, clothId, color) {
    methods.debug('barberShop.buy');
    if (!user.isLogin(player))
        return;
    user.setComponentVariation(player, 1, clothId, color);
};

cloth.buyMask = function (player, price, maskId, shopId, payType = 0) {
    methods.debug('barberShop.buy', price, maskId, shopId);
    if (!user.isLogin(player))
        return;

    if (price > 10) {
        if (user.getMoney(player, payType) < price) {
            user.showCustomNotify(player, 'У вас недостаточно средств', 1, 9);
            user.updateCharacterCloth(player);
            return;
        }
    }

    if (price < 0)
        return;
    inventory.updateItemsEquipByItemId(274, user.getId(player), inventory.types.Player, 0);

    let itemName = enums.maskList[maskId][1];

    user.set(player, 'mask', -1);
    user.set(player, 'mask_color', 0);

    let params = `{"name": "${methods.removeQuotes(methods.removeQuotes2(itemName))}", "mask": ${maskId}, "desc": "${methods.getRareName(enums.maskList[maskId][14])}"}`;
    inventory.addItem(274, 1, inventory.types.Player, user.getId(player), 1, 0, params, 100);

    user.updateCharacterFace(player);
    user.updateCharacterCloth(player);

    if (shopId == 0)
        return;
    user.removeMoney(player, price, 'Покупка маски ' + itemName, payType);

    if (business.isOpen(shopId)) {
        business.addMoney(shopId, price, itemName);
        business.removeMoneyTax(shopId, price / business.getPrice(shopId));
    }
    user.showCustomNotify(player, 'Вы купили маску', 2, 9);
    user.save(player);
};

cloth.buyPrint = function(player, collection, overlay, price, shopId, payType) {
    if (!user.isLogin(player))
        return;

    if (user.getMoney(player, payType) < price) {
        user.showCustomNotify(player, 'У вас недостаточно средств', 1, 9);
        return;
    }

    if (price < 0)
        return;

    user.set(player, "tprint_c", collection);
    user.set(player, "tprint_o", overlay);

    user.removeMoney(player, price, 'Принт на одежду', payType);
    if (business.isOpen(shopId)) {
        business.addMoney(shopId, price, 'Покупка принта');
        business.removeMoneyTax(shopId, price / business.getPrice(shopId));
    }
    user.showCustomNotify(player, 'Вы купили принт', 2, 9);
    user.updateTattoo(player);

    mysql.executeQuery(`SELECT * FROM items WHERE owner_id = '${user.getId(player)}' AND owner_type = '1' AND item_id = '265' AND is_equip = '1' ORDER BY id DESC`, function (err, rows, fields) {
        rows.forEach(row => {
            try {
                let params = JSON.parse(row['params']);
                params.tprint_c = collection;
                params.tprint_o = overlay;
                inventory.updateItemParams(row['id'], JSON.stringify(params));
            }
            catch (e) {
                methods.debug(e);
            }
        });
    });
};