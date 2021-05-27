let Container = require('../modules/data');
let mysql = require('../modules/mysql');
let methods = require('../modules/methods');
let user = require('../user');
let coffer = require('../coffer');
let enums = require('../enums');
let chat = require('../modules/chat');

let houses = require('./houses');
let yachts = exports;

let hBlips = new Map();
let count = 0;

yachts.loadAll = function() {
    methods.debug('yachts.loadAll');

    mysql.executeQuery(`SELECT * FROM yachts`, function (err, rows, fields) {
        rows.forEach(function(item) {

            yachts.set(item['id'], 'id', item['id']);
            yachts.set(item['id'], 'name', item['name']);
            yachts.set(item['id'], 'price', item['price']);
            yachts.set(item['id'], 'user_id', item['user_id']);
            yachts.set(item['id'], 'user_name', item['user_name']);
            yachts.set(item['id'], 'x', item['x']);
            yachts.set(item['id'], 'y', item['y']);
            yachts.set(item['id'], 'z', item['z']);
            yachts.set(item['id'], 'rot', item['rot']);
            yachts.set(item['id'], 'tax_money', item['tax_money']);
            yachts.set(item['id'], 'tax_score', item['tax_score']);

            let pos = new mp.Vector3(parseFloat(item['x']), parseFloat(item['y']), parseFloat(item['z']));
            let hBlip = methods.createBlip(pos, 455, item['user_id'] > 0 ? 59 : 69, 0.8);
            methods.createCp(hBlip.position.x, hBlip.position.y, hBlip.position.z, "Нажмите ~g~Е~s~ чтобы открыть меню", 0.8, -1, [33, 150, 243, 100], 0.3);
            hBlips.set(item['id'], hBlip);
        });
        count = rows.length;
        methods.debug('All Yachts Loaded: ' + count);
    });
};

yachts.getHouseData = function(id) {
    return Container.Data.GetAll(enums.offsets.yacht + methods.parseInt(id));
};

yachts.get = function(id, key) {
    return Container.Data.Get(enums.offsets.yacht + methods.parseInt(id), key);
};

yachts.set = function(id, key, val) {
    Container.Data.Set(enums.offsets.yacht + methods.parseInt(id), key, val);
};

yachts.getAll = function() {
    methods.debug('yachts.getAll');
    return hBlips;
};

yachts.updateOwnerInfo = function (id, userId, userName) {
    methods.debug('yachts.updateOwnerInfo');
    id = methods.parseInt(id);
    userId = methods.parseInt(userId);

    yachts.set(id, "user_name", userName);
    yachts.set(id, "user_id", userId);

    if (userId == 0) {
        yachts.updatePin(id, 'NoName');
    }

    mysql.executeQuery("UPDATE yachts SET user_name = '" + userName + "', user_id = '" + userId + "', tax_money = '0' where id = '" + id + "'");

    hBlips.get(id).color = userId > 0 ? 59 : 69;
};

yachts.updateName = function (id, name) {
    methods.debug('yachts.updateName');
    id = methods.parseInt(id);
    name = methods.removeQuotes2(methods.removeQuotes(name));
    yachts.set(id, 'name', name);
    mysql.executeQuery("UPDATE yachts SET name = '" + name + "' where id = '" + id + "'");
};

yachts.sell = function (player) {
    methods.debug('yachts.sell');
    if (!user.isLogin(player))
        return;

    if (user.get(player, 'yacht_id') == 0) {
        player.notify('~r~У Вас нет яхты');
        return;
    }

    let hInfo = yachts.getHouseData(user.get(player, 'yacht_id'));

    if (hInfo.get('user_id') != user.get(player, 'id')) {
        player.notify('~r~Эта квартира вам не пренадлежит');
        return;
    }

    let nalog = methods.parseInt(hInfo.get('price') * (100 - coffer.getTaxProperty()) / 100);

    user.set(player, 'yacht_id', 0);

    yachts.updateOwnerInfo(hInfo.get('id'), 0, '');

    coffer.removeMoney(1, nalog);
    user.addMoney(player, nalog, 'Продажа яхты ' + hInfo.get('name') + ' №' + hInfo.get('id'));

    setTimeout(function () {
        if (!user.isLogin(player))
            return;
        user.addHistory(player, 3, 'Продал яхту ' + hInfo.get('name') + ' №' + hInfo.get('id') + '. Цена: ' + methods.moneyFormat(nalog));
        player.notify(`~g~Вы продали яхту\nНалог:~s~ ${coffer.getTaxProperty()}%\n~g~Получено:~s~ ${methods.moneyFormat(nalog)}`);
        user.save(player);
    }, 1000);
};

yachts.buy = function (player, id) {
    methods.debug('yachts.buy');

    if (!user.isLogin(player))
        return;

    let hInfo = yachts.getHouseData(id);
    if (user.get(player, 'yacht_id') > 0) {
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

    user.set(player, 'yacht_id', id);

    yachts.updateOwnerInfo(id, user.get(player, 'id'), user.get(player, 'name'));

    coffer.addMoney(1, hInfo.get('price'));
    user.removeMoney(player, hInfo.get('price'), 'Покупка яхту ' + hInfo.get('name') + ' №' + hInfo.get('id'));
    setTimeout(function () {
        if (!user.isLogin(player))
            return;
        user.addHistory(player, 3, 'Купил яхту ' + hInfo.get('name') + ' №' + hInfo.get('id') + '. Цена: ' + methods.moneyFormat(hInfo.get('price')));
        user.save(player);
        player.notify('~g~Поздравляем с покупкой недвижимости!');
    }, 500);
    return true;
};