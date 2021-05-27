let Container = require('../modules/data');
let mysql = require('../modules/mysql');
let methods = require('../modules/methods');

let discord = require('../managers/discord');

let user = require('../user');
let coffer = require('../coffer');
let enums = require('../enums');

let chat = require('../modules/chat');

let houses = require('./houses');
let condos = exports;

let hBlips = new Map();
let count = 0;

let condoOffset = enums.offsets.condoBig - enums.offsets.condo;

condos.loadAll = function() {
    methods.debug('condos.loadAll');

    mysql.executeQuery(`SELECT * FROM condos`, function (err, rows, fields) {
        rows.forEach(function(item) {

            condos.set(item['id'], 'id', item['id']);
            condos.set(item['id'], 'number', item['number']);
            condos.set(item['id'], 'address', item['address']);
            condos.set(item['id'], 'street', item['street']);
            condos.set(item['id'], 'condo_big_id', item['condo_big_id']);
            condos.set(item['id'], 'price', item['price']);
            condos.set(item['id'], 'user_id', item['user_id']);
            condos.set(item['id'], 'user_name', item['user_name']);
            condos.set(item['id'], 'pin', item['pin']);
            condos.set(item['id'], 'is_safe', item['is_safe']);
            condos.set(item['id'], 'is_sec', item['is_sec']);
            condos.set(item['id'], 'is_lock', item['is_lock']);
            condos.set(item['id'], 'interior', item['interior']);
            condos.set(item['id'], 'x', item['x']);
            condos.set(item['id'], 'y', item['y']);
            condos.set(item['id'], 'z', item['z']);
            condos.set(item['id'], 'rot', item['rot']);
            condos.set(item['id'], 'tax_money', item['tax_money']);
            condos.set(item['id'], 'tax_score', item['tax_score']);

            let hBlip = {position: new mp.Vector3(parseFloat(item['x']), parseFloat(item['y']), parseFloat(item['z']))};
            methods.createCp(hBlip.position.x, hBlip.position.y, hBlip.position.z, "Нажмите ~g~Е~s~ чтобы открыть меню", 0.8, -1, [33, 150, 243, 100], 0.3);
            hBlip.safe = null;
            hBlip.safeDoor = null;
            hBlips.set(item['id'], hBlip);

            if (item['is_safe']) {
                condos.updateSafe(item['id'], item['is_safe'], true);
            }
        });
        count = rows.length;
        methods.debug('All Condos Loaded: ' + count);
    });
};

condos.loadBigAll = function() {
    methods.debug('condos.loadLast');

    mysql.executeQuery(`SELECT * FROM condos_big`, function (err, rows, fields) {

        rows.forEach(function(item) {

            condos.set(item['id'] + condoOffset, 'id', item['id']);
            condos.set(item['id'] + condoOffset, 'number', item['number']);
            condos.set(item['id'] + condoOffset, 'address', item['address']);
            condos.set(item['id'] + condoOffset, 'street', item['street']);
            condos.set(item['id'] + condoOffset, 'x', item['x']);
            condos.set(item['id'] + condoOffset, 'y', item['y']);
            condos.set(item['id'] + condoOffset, 'z', item['z']);

            methods.createBlip(new mp.Vector3(parseFloat(item['x']), parseFloat(item['y']), parseFloat(item['z'])), 40, 0, 0.4);
        });
        count = rows.length;
        methods.debug('All Condos Big Loaded: ' + count);
    });
};

condos.loadLast = function() {
    methods.debug('condos.loadLast');

    mysql.executeQuery(`SELECT * FROM condos ORDER BY id DESC LIMIT 1`, function (err, rows, fields) {

        rows.forEach(function(item) {

            condos.set(item['id'], 'id', item['id']);
            condos.set(item['id'], 'number', item['number']);
            condos.set(item['id'], 'address', item['address']);
            condos.set(item['id'], 'street', item['street']);
            condos.set(item['id'], 'condo_big_id', item['condo_big_id']);
            condos.set(item['id'], 'price', item['price']);
            condos.set(item['id'], 'user_id', item['user_id']);
            condos.set(item['id'], 'user_name', item['user_name']);
            condos.set(item['id'], 'pin', item['pin']);
            condos.set(item['id'], 'is_safe', item['is_safe']);
            condos.set(item['id'], 'is_sec', item['is_sec']);
            condos.set(item['id'], 'is_lock', item['is_lock']);
            condos.set(item['id'], 'interior', item['interior']);
            condos.set(item['id'], 'x', item['x']);
            condos.set(item['id'], 'y', item['y']);
            condos.set(item['id'], 'z', item['z']);
            condos.set(item['id'], 'rot', item['rot']);
            condos.set(item['id'], 'tax_money', item['tax_money']);
            condos.set(item['id'], 'tax_score', item['tax_score']);

            let hBlip = {position: new mp.Vector3(parseFloat(item['x']), parseFloat(item['y']), parseFloat(item['z']))};
            methods.createCp(hBlip.position.x, hBlip.position.y, hBlip.position.z, "Нажмите ~g~Е~s~ чтобы открыть меню", 0.8, -1, [33, 150, 243, 100], 0.3);
            hBlip.safe = null;
            hBlip.safeDoor = null;
            hBlips.set(item['id'], hBlip);

            if (item['is_safe']) {
                condos.updateSafe(item['id'], item['is_safe'], true);
            }

            let id = item['id'];
            discord.sendMarketProperty(`Квартира #${condos.get(id, 'number')}`, `Адрес: ${condos.get(id, 'address')} / ${condos.get(id, 'street')} #${condos.get(id, 'number')}\nГос. стоимость: ${methods.moneyFormat(condos.get(id, 'price'))}`);

            chat.sendToAll(`Квартира загружена. ID: ${item['id']}. HID: ${item['condo_big_id']}. Name: ${item['number']}. Int: ${item['interior']}. Price: ${methods.moneyFormat(item['price'])}`);

            mp.players.forEach(p => {
                methods.updateCheckpointList(p);
            });
        });
        count = rows.length;
        methods.debug(`Last Condo Loaded`);
    });
};

condos.loadBigLast = function() {
    methods.debug('condos.loadLast');

    mysql.executeQuery(`SELECT * FROM condos_big ORDER BY id DESC LIMIT 1`, function (err, rows, fields) {

        rows.forEach(function(item) {

            condos.set(item['id'] + condoOffset, 'id', item['id']);
            condos.set(item['id'] + condoOffset, 'number', item['number']);
            condos.set(item['id'] + condoOffset, 'address', item['address']);
            condos.set(item['id'] + condoOffset, 'street', item['street']);
            condos.set(item['id'] + condoOffset, 'x', item['x']);
            condos.set(item['id'] + condoOffset, 'y', item['y']);
            condos.set(item['id'] + condoOffset, 'z', item['z']);

            methods.createBlip(new mp.Vector3(parseFloat(item['x']), parseFloat(item['y']), parseFloat(item['z'])), 40, 0, 0.4);

            chat.sendToAll(`Квартира загружена. ID: ${item['id']}. Name: ${item['number']}`);
        });
        count = rows.length;
        methods.debug(`Last Condo Big Loaded`);
    });
};

condos.insert = function(player, number, numberBig, street, zone, x, y, z, rot, interior, price) {
    methods.debug('condos.insert');

    mysql.executeQuery(`INSERT INTO condos (number, condo_big_id, street, address, rot, x, y, z, interior, price) VALUES ('${number}', '${numberBig}', '${street}', '${zone}', '${rot}', '${x}', '${y}', '${z - 1}', '${interior}', '${price}')`);
    setTimeout(condos.loadLast, 1000);
};

condos.insertBig = function(player, number, street, zone, x, y, z) {
    methods.debug('condos.insert');

    mysql.executeQuery(`INSERT INTO condos_big (number, street, address, x, y, z) VALUES ('${number}', '${street}', '${zone}', '${x}', '${y}', '${z - 1}')`);
    setTimeout(condos.loadBigLast, 1000);
};

condos.getHouseData = function(id) {
    return Container.Data.GetAll(enums.offsets.condo + methods.parseInt(id));
};

condos.get = function(id, key) {
    return Container.Data.Get(enums.offsets.condo + methods.parseInt(id), key);
};

condos.set = function(id, key, val) {
    Container.Data.Set(enums.offsets.condo + methods.parseInt(id), key, val);
};

condos.getCountLiveUser = function(id, cb) {
    id = methods.parseInt(id);
    mysql.executeQuery(`SELECT id FROM users WHERE condo_id = ${id}`, function (err, rows, fields) {
        cb(rows.length);
    });
};

condos.getAll = function() {
    methods.debug('condos.getAll');
    return hBlips;
};

condos.updateOwnerInfo = function (id, userId, userName) {
    methods.debug('condos.updateOwnerInfo');
    id = methods.parseInt(id);
    userId = methods.parseInt(userId);

    condos.set(id, "user_name", userName);
    condos.set(id, "user_id", userId);

    if (userId == 0) {
        condos.updatePin(id, 0);
        condos.updateSafe(id, 0);
        condos.lockStatus(id, false);

        discord.sendMarketProperty(`Квартира #${condos.get(id, 'number')}`, `Адрес: ${condos.get(id, 'address')} / ${condos.get(id, 'street')} #${condos.get(id, 'number')}\nГос. стоимость: ${methods.moneyFormat(condos.get(id, 'price'))}`);
    }

    mysql.executeQuery("UPDATE condos SET user_name = '" + userName + "', user_id = '" + userId + "', tax_money = '0' where id = '" + id + "'");
};

condos.updatePin = function (id, pin) {
    methods.debug('condos.updatePin');
    id = methods.parseInt(id);
    pin = methods.parseInt(pin);
    condos.set(id, 'pin', pin);
    mysql.executeQuery("UPDATE condos SET pin = '" + pin + "' where id = '" + id + "'");
};

condos.updateSafe = function (id, pin, isLoad = false) {
    methods.debug('condos.updateSafe');

    pin = methods.parseInt(pin);

    if (pin > 0) {
        let intId = condos.get(id, "interior");

        let safeItem = houses.safeList[intId];
        if (!mp.objects.exists(hBlips.get(id).safe)) {
            hBlips.get(id).safe = mp.objects.new(884736502, new mp.Vector3(safeItem[0], safeItem[1], safeItem[2]),
                {
                    rotation: new mp.Vector3(safeItem[3], safeItem[4], safeItem[5]),
                    alpha: 255,
                    dimension: id + enums.offsets.condo
                });
        }
        if (!mp.objects.exists(hBlips.get(id).safeDoor))
        {
            hBlips.get(id).safeDoor = mp.objects.new(-1992154984, new mp.Vector3(safeItem[6], safeItem[7], safeItem[8]),
                {
                    rotation: new mp.Vector3(safeItem[9], safeItem[10], safeItem[11]),
                    alpha: 255,
                    dimension: id + enums.offsets.condo
                });
            hBlips.get(id).safeDoor.setVariable('condoSafe', id);
        }
        if (!isLoad) {
            condos.set(id, "is_safe", pin);
            mysql.executeQuery("UPDATE condos SET is_safe = '" + pin + "' where id = '" + id + "'");
        }
    }
    else {
        try {
            hBlips.get(id).safe.destroy();
            hBlips.get(id).safeDoor.destroy();
        }
        catch (e) {

        }
        if (!isLoad) {
            mysql.executeQuery("UPDATE condos SET is_safe = '0' where id = '" + id + "'");
            condos.set(id, "is_safe", 0);
        }
    }
};

condos.lockStatus = function (id, lockStatus) {
    methods.debug('condos.lockStatus');
    id = methods.parseInt(id);
    condos.set(id, 'is_lock', lockStatus);
    mysql.executeQuery("UPDATE condos SET is_lock = '" + methods.boolToInt(lockStatus) + "' where id = '" + id + "'");
};

condos.sell = function (player) {
    methods.debug('condos.sell');
    if (!user.isLogin(player))
        return;

    if (user.get(player, 'condo_id') == 0) {
        player.notify('~r~У Вас нет квартиры');
        return;
    }

    let hInfo = condos.getHouseData(user.get(player, 'condo_id'));

    if (hInfo.get('user_id') != user.get(player, 'id')) {
        player.notify('~r~Эта квартира вам не пренадлежит');
        return;
    }

    let nalog = methods.parseInt(hInfo.get('price') * (100 - coffer.getTaxProperty()) / 100);
    user.set(player, 'condo_id', 0);
    condos.updateOwnerInfo(hInfo.get('id'), 0, '');
    coffer.removeMoney(1, nalog);
    user.addMoney(player, nalog, 'Продажа квартиры ' + hInfo.get('address') + ' №' + hInfo.get('number'));

    setTimeout(function () {
        if (!user.isLogin(player))
            return;
        user.addHistory(player, 3, 'Продал квартиру ' + hInfo.get('address') + ' №' + hInfo.get('number') + '. Цена: ' + methods.moneyFormat(nalog));
        player.notify(`~g~Вы продали квартиру\nНалог:~s~ ${coffer.getTaxProperty()}%\n~g~Получено:~s~ ${methods.moneyFormat(nalog)}`);
        user.save(player);
    }, 1000);
};

condos.buy = function (player, id) {
    methods.debug('condos.buy');

    if (!user.isLogin(player))
        return;

    let hInfo = condos.getHouseData(id);
    if (user.get(player, 'condo_id') > 0) {
        player.notify('~r~У Вас есть недвижимость');
        return false;
    }
    if (hInfo.get('price') > user.getMoney(player)) {
        player.notify('~r~У Вас не хватает средств');
        return false;
    }
    if (hInfo.get('user_id') > 0) {
        player.notify('~r~Недвижимость уже куплена');
        return false;
    }

    user.set(player, 'condo_id', id);

    condos.updateOwnerInfo(id, user.get(player, 'id'), user.get(player, 'name'));

    coffer.addMoney(1, hInfo.get('price'));
    user.removeMoney(player, hInfo.get('price'), 'Покупка квартиры ' + hInfo.get('address') + ' №' + hInfo.get('number'));
    setTimeout(function () {
        if (!user.isLogin(player))
            return;
        user.addHistory(player, 3, 'Купил квартиру ' + hInfo.get('address') + ' №' + hInfo.get('number') + '. Цена: ' + methods.moneyFormat(hInfo.get('price')));
        user.save(player);
        player.notify('~g~Поздравляем с покупкой недвижимости!');
    }, 500);
    return true;
};

condos.enter = function (player, id) {
    methods.debug('condos.enter', id);

    if (!user.isLogin(player))
        return;
    id = methods.parseInt(id);

    let hInfo = condos.getHouseData(id);
    player.dimension = id + enums.offsets.condo; //TODO
    let intId = hInfo.get('interior');
    user.teleport(player, houses.interiorList[intId][0], houses.interiorList[intId][1], houses.interiorList[intId][2] + 1, houses.interiorList[intId][3]);
};