let methods = require('../modules/methods');

let business = require('../property/business');

let user = require('../user');
let items = require('../items');
let inventory = require('../inventory');

let shop = exports;

shop.list = [
    [-3041.126, 585.5155, 6.908929, 82, 0], //shopui_title_conveniences
    [-3038.86, 586.2693, 6.908929, 82, 0],
    [-3243.896, 1001.722, 11.83071, 83, 0],
    [-3241.574, 1001.538, 11.83071, 83, 0],
    [374.5105, 327.7635, 102.5664, 84, 0],
    [373.9542, 325.4406, 102.5664, 84, 0],
    [2677.278, 3281.584, 54.24113, 85, 0],
    [2679.303, 3280.479, 54.24113, 85, 0],
    [547.6848, 2669.328, 41.15649, 86, 0],
    [547.3407, 2671.746, 41.15649, 86, 0],
    [1730.041, 6416.11, 34.03722, 87, 0],
    [1728.93, 6414.032, 34.03722, 87, 0],
    [1960.621, 3742.39, 31.34375, 88, 0],
    [1961.797, 3740.326, 31.34375, 88, 0],
    [25.96342, -1345.609, 28.49702, 89, 0],
    [26.02901, -1347.894, 28.49702, 89, 0],
    [2555.484, 382.4021, 107.6229, 90, 0],
    [2557.867, 382.3204, 107.6229, 90, 0],
    [1394.001, 3605.032, 33.98092, 91, 1], // shopui_title_liqourstore
    [-2968.287, 391.614, 14.04331, 92, 2], //shopui_title_liqourstore2
    [-1488.082, -378.9411, 39.16343, 93, 2],
    [1136.161, -982.821, 45.41585, 94, 2],
    [-1222.552, -906.4139, 11.32636, 95, 2],
    [1165.307, 2709.018, 37.15771, 96, 3], //shopui_title_liqourstore3
    [-47.49747, -1756.332, 28.42101, 104, 4], //shopui_title_gasstation
    [-48.75316, -1757.672, 28.42101, 104, 4],
    [1699.679, 4923.871, 41.06363, 105, 4],
    [1698.219, 4924.843, 41.06363, 105, 4],
    [-707.8215, -914.7576, 18.2155, 106, 4],
    [-708.0059, -912.8864, 18.215, 106, 4],
    [1163.038, -322.3109, 68.20506, 107, 4],
    [1163.371, -324.0874, 68.20506, 107, 4],
    [-1821.729, 793.7563, 137.1204, 108, 4],
    [-1820.643, 792.3428, 137.117, 108, 4],

    /*[-657.087, -857.313, 23.490, 123, 5],
    [1133.0963, -472.6430, 65.7651, 124, 5],

    [318.2640, -1076.7376, 28.4785, 125, 6],
    [92.8906, -229.4265, 53.6636, 126, 6],
    [-252.5419, 6335.4926, 31.4260, 0, 6],*/

    [-1599.7724, 5202.06640625, 3.397307, 128, 7], //FISH
    [-675.4125366210938, 5836.44140625, 16.34016227722168, 129, 8], //Охота

    [-1649.739990234375, -952.7982177734375, 6.801215648651123, 0, 0], //Тако
    [-1682.8695068359375, -769.6543579101562, 9.18997859954834, 0, 0],
    [-1704.1842041015625, -762.6709594726562, 9.189979553222656, 0, 0],
    [-1692.13232421875, -745.8652954101562, 9.189972877502441, 0, 0],
    [-1657.715576171875, -785.521728515625, 9.21198558807373, 0, 0],
    [-1637.555419921875, -794.213134765625, 9.309758186340332, 0, 0],
    [-265.735595703125, -2032.1922607421875, 29.145591735839844, 0, 0],

    [5028.7333984375, -5735.27001953125, 16.865581512451172, 154, 0], //24/7
    [4519.4638671875, -4506.63671875, 3.2414326667785645, 155, 0], //TACO
    [4973.12890625, -5154.48828125, 1.4928948879241943, 156, 0], //TACO
    [5054.7275390625, -4641.595703125, 1.4069066047668457, 157, 0], //TACO
];

shop.loadAll = function() {
    methods.debug('shop.loadAll');
    let prevId = 0;
    shop.list.forEach(function (item) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (prevId != item[3]) {
            switch (item[4]) {
                case 0:
                case 4:
                    if (item[3] > 0)
                        methods.createBlip(shopPos, 52, 0, 0.6, '24/7');
                    break;
                case 1:
                case 2:
                case 3:
                    methods.createBlip(shopPos, 52, 6, 0.6, 'Алкогольный магазин');
                    break;
                case 5:
                    methods.createBlip(shopPos, 521, 0, 0.6, 'Digital Den');
                    break;
                case 6:
                    methods.createBlip(shopPos, 153, 69, 0.8, 'Аптека');
                    break;
                case 7:
                    methods.createBlip(shopPos, 68, 0, 0.6, 'Fish Shop');
                    break;
                case 8:
                    methods.createBlip(shopPos, 141, 0, 0.6, 'Hunting Store');
                    break;
            }
        }
        methods.createCp(shopPos.x, shopPos.y, shopPos.z, "Нажмите ~g~Е~s~ чтобы открыть меню");
        prevId = item[3];
    });
};

shop.getInRadius = function(pos, radius = 2) {
    methods.debug('shop.fuel');
    let shopId = -1;
    shop.list.forEach(function (item, idx) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(pos, shopPos) < radius)
            shopId = methods.parseInt(item[3]);
    });
    return shopId;
};

shop.getInRadiusItem = function(pos, radius = 2) {
    methods.debug('shop.fuel');
    let shopId = null;
    shop.list.forEach(function (item, idx) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(pos, shopPos) < radius)
            shopId = item;
    });
    return shopId;
};

shop.findNearest = function(pos) {
    methods.debug('shop.findNearest');
    let prevPos = new mp.Vector3(9999, 9999, 9999);
    shop.list.forEach(function (item) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(shopPos, pos) < methods.distanceToPos(prevPos, pos))
            prevPos = shopPos;
    });
    return prevPos;
};

shop.findNearestById = function(pos, id) {
    methods.debug('shop.findNearest');
    let prevPos = new mp.Vector3(9999, 9999, 9999);
    shop.list.forEach(function (item) {
        if (item[4] !== id)
            return;
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(shopPos, pos) < methods.distanceToPos(prevPos, pos))
            prevPos = shopPos;
    });
    return prevPos;
};

shop.checkPosForOpenMenu = function(player) {
    methods.debug('shop.checkPosForOpenMenu');
    try {
        let playerPos = player.position;
        let shopItem = shop.getInRadiusItem(playerPos, 2);
        if (shopItem == null)
            return;
        let shopId = shopItem[3];

        switch (shopItem[4]) {
            case 0:
            case 4:
                if (shopId === 0)
                    player.call('client:menuList:showShopTacoMenu', [shopId, business.getPrice(shopId)]);
                else
                    player.call('client:menuList:showShopMenu', [shopId, business.getPrice(shopId), shopItem[4]]);
                break;
            case 1:
            case 2:
            case 3:
                player.call('client:menuList:showShopAlcMenu', [shopId, business.getPrice(shopId), shopItem[4]]);
                break;
            case 5:
                player.call('client:menuList:showShopElMenu', [shopId, business.getPrice(shopId)]);
                break;
            case 6:
                player.call('client:menuList:showShopMedMenu', [shopId, business.getPrice(shopId)]);
                break;
            case 7:
                player.call('client:menuList:showShopFishMenu', [shopId, business.getPrice(shopId)]);
                break;
            case 8:
                player.call('client:menuList:showShopHuntMenu', [shopId, business.getPrice(shopId)]);
                break;
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

shop.buy = function(player, itemId, price, shopId, payType = 0) {
    methods.debug('shop.buy');

    if (!user.isLogin(player))
        return;

    if (user.getMoney(player, payType) < price) {
        user.showCustomNotify(player, 'У вас недостаточно средств', 1, 9);
        return;
    }

    if (price < 0)
        return;

    let amount = inventory.getInvAmount(player, user.getId(player), 1);
    if (amount + items.getItemAmountById(itemId) > inventory.getPlayerInvAmountMax(player)) {
        player.notify('~r~В инвентаре нет места');
        return;
    }

    let params = { userName: user.getRpName(player) };
    if (itemId >= 27 && itemId <= 30)
        params = { userName: user.getRpName(player), type: itemId - 26, number: methods.getRandomPhone(), bg: 'https://i.imgur.com/v4aju8F.jpg' };

    inventory.addItem(itemId, 1, 1, user.getId(player), 1, 0, JSON.stringify(params), 1);

    if (shopId > 0) {
        user.showCustomNotify(player, 'Вы купили ' + items.getItemNameById(itemId) +  ' по цене: ' + methods.moneyFormat(price), 2, 9);
        user.removeMoney(player, price, 'Покупка ' + items.getItemNameById(itemId), payType);
        if (business.isOpen(shopId)) {
            business.addMoney(shopId, price, items.getItemNameById(itemId));
            business.removeMoneyTax(shopId, price / business.getPrice(shopId));
        }
    }
    else if (price > 0) {
        user.showCustomNotify(player, 'Вы купили ' + items.getItemNameById(itemId) +  ' по цене: ' + methods.moneyFormat(price), 2, 9);
        user.removeMoney(player, price, 'Покупка ' + items.getItemNameById(itemId), payType);
    }
    inventory.updateAmount(player, user.getId(player), 1);
};