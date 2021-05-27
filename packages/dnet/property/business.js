let Container = require('../modules/data');
let mysql = require('../modules/mysql');
let methods = require('../modules/methods');

let user = require('../user');
let coffer = require('../coffer');
let enums = require('../enums');

let weather = require('../managers/weather');
let discord = require('../managers/discord');
let business = exports;

business.BusinessOfficePos = new mp.Vector3(-140.7121, -617.3683, 167.8204);
business.BusinessMotorPos = new mp.Vector3(-138.6593, -592.6267, 166.0002);
business.BusinessStreetPos = new mp.Vector3(-116.8427, -604.7336, 35.28074);
business.BusinessGaragePos = new mp.Vector3(-155.6696, -577.3766, 31.42448);
business.BusinessRoofPos = new mp.Vector3(-136.6686, -596.3055, 205.9157);
business.BusinessBotPos = new mp.Vector3(-139.2922, -631.5964, 167.8204);

business.loadAll = function() {
    methods.debug('business.loadAll');
    mysql.executeQuery(`SELECT * FROM business`, function (err, rows, fields) {
        rows.forEach(function(item) {
            business.set(item['id'], 'id', item['id']);
            business.set(item['id'], 'name', item['name']);
            business.set(item['id'], 'price', item['price']);
            business.set(item['id'], 'bank', item['bank']);
            business.set(item['id'], 'bank_tax', item['bank_tax']);
            business.set(item['id'], 'bank_max', item['bank_max']);
            business.set(item['id'], 'bank_score', item['bank_score']);
            business.set(item['id'], 'bank_id', item['bank_id']);
            business.set(item['id'], 'user_name', item['user_name']);
            business.set(item['id'], 'user_id', item['user_id']);
            business.set(item['id'], 'type', item['type']);
            business.set(item['id'], 'price_product', item['price_product']);
            business.set(item['id'], 'interior', item['interior']);
            business.set(item['id'], 'sc_font', item['sc_font']);
            business.set(item['id'], 'sc_color', item['sc_color']);
            business.set(item['id'], 'sc_alpha', item['sc_alpha']);
            business.set(item['id'], 'tax_score', item['tax_score']);
            business.set(item['id'], 'tax_money', item['tax_money']);
        });
        methods.debug('All Business Loaded: ' + rows.length);
    });
};

business.save = function(id) {
    methods.debug('business.save');

    if (!business.has(id, "id")) return;

    let bBank = methods.parseFloat(business.get(id, "bank"));
    if (bBank < 0) {
        //methods.saveLog('businessBugUse', `${bBank} | ${id}`);
        bBank = 0;
    }

    let sql = "UPDATE business SET";

    sql = sql + " name = '" + methods.removeQuotes(business.get(id, "name")) + "'";
    //sql = sql + ", price = '" + business.get(id, "price") + "'";
    sql = sql + ", user_name = '" + business.get(id, "user_name") + "'";
    sql = sql + ", user_id = '" + business.get(id, "user_id") + "'";
    sql = sql + ", bank = '" + bBank + "'";
    sql = sql + ", bank_id = '" + methods.parseInt(business.get(id, "bank_id")) + "'";
    sql = sql + ", bank_score = '" + methods.parseInt(business.get(id, "bank_score")) + "'";
    sql = sql + ", bank_tax = '" + methods.parseFloat(business.get(id, "bank_tax")) + "'";
    sql = sql + ", sc_font = '" + methods.parseInt(business.get(id, "sc_font")) + "'";
    sql = sql + ", sc_color = '" + methods.parseInt(business.get(id, "sc_color")) + "'";
    sql = sql + ", sc_alpha = '" + methods.parseInt(business.get(id, "sc_alpha")) + "'";
    //sql = sql + ", type = '" + business.get(id, "type") + "'";
    sql = sql + ", price_product = '" + methods.parseFloat(business.get(id, "price_product")) + "'";
    sql = sql + ", interior = '" + methods.parseInt(business.get(id, "interior")) + "'";

    sql = sql + " where id = '" + business.get(id, "id") + "'";

    mysql.executeQuery(sql);
};

business.set = function(id, key, val) {
    return Container.Data.Set(enums.offsets.business + methods.parseInt(id), key, val);
};

business.get = function(id, key) {
    if (Container.Data.Has(enums.offsets.business + methods.parseInt(id), key))
        return Container.Data.Get(enums.offsets.business + methods.parseInt(id), key);
    return null;
};

business.has = function(id, key) {
    return (Container.Data.Has(enums.offsets.business + methods.parseInt(id), key));
};

business.getPrice = function(id) {
    if (id === 0)
        return 3;
    return methods.parseFloat(business.get(id, 'price_product'));
};

business.getName = function(id) {
    return business.get(id, 'name');
};

business.getData = function(id) {
    return Container.Data.GetAll(enums.offsets.business + methods.parseInt(id));
};

business.isOpen = function(id, minPrice = 0) {
    return business.get(id, 'user_id') === 0 || (business.get(id, 'user_id') > 0 && business.getMoneyTax(id) > minPrice);
};

business.addMoney = function(id, money, name = "Операция со счетом") {
    if (id === 0 || business.get(id, 'user_id') === 0) {
        coffer.addMoney(1, money);
        return;
    }
    business.addHistory(id, name, money);
    business.setMoney(id, business.getMoney(id) + methods.parseFloat(money));
};

business.removeMoney = function(id, money, name = "Операция со счетом") {
    if (id === 0 || business.get(id, 'user_id') === 0) {
        coffer.removeMoney(1, money);
        return;
    }
    business.addHistory(id, name, money * -1);
    business.setMoney(id, business.getMoney(id) - methods.parseFloat(money));
};

business.setMoney = function(id, money) {
    id = methods.parseInt(id);
    Container.Data.Set(enums.offsets.business + id, 'bank', methods.parseFloat(money));
};

business.getMoney = function(id) {
    id = methods.parseInt(id);
    if (Container.Data.Has(enums.offsets.business + id, 'bank'))
        return methods.parseFloat(Container.Data.Get(enums.offsets.business + id, 'bank'));
    return 0;
};

business.addMoneyTax = function(id, money) {
    if (id === 0 || business.get(id, 'user_id') === 0)
        return;
    business.addHistoryTax(id, money);
    business.setMoneyTax(id, business.getMoneyTax(id) + methods.parseFloat(money));
};

business.removeMoneyTax = function(id, money) {
    if (id === 0 || business.get(id, 'user_id') === 0)
        return;
    business.addHistoryTax(id, money * -1);
    business.setMoneyTax(id, business.getMoneyTax(id) - methods.parseFloat(money));
};

business.setMoneyTax = function(id, money) {
    id = methods.parseInt(id);
    Container.Data.Set(enums.offsets.business + id, 'bank_tax', methods.parseFloat(money));
};

business.getMoneyTax = function(id) {
    id = methods.parseInt(id);
    if (Container.Data.Has(enums.offsets.business + id, 'bank_tax'))
        return methods.parseFloat(Container.Data.Get(enums.offsets.business + id, 'bank_tax'));
    return 0;
};

business.addHistory = function(id, name, price) {

    id = methods.parseInt(id);
    name = methods.removeQuotes(name);
    price = methods.parseFloat(price);

    let rpDateTime = weather.getRpDateTime();
    let timestamp = methods.getTimeStamp();

    mysql.executeQuery(`INSERT INTO log_business (business_id, product, price, timestamp, rp_datetime) VALUES ('${id}', '${name}', '${price}', '${timestamp}', '${rpDateTime}')`);
};

business.addHistoryTax = function(id, price) {

    id = methods.parseInt(id);
    price = methods.parseFloat(price);

    let rpDateTime = weather.getRpDateTime();
    let timestamp = methods.getTimeStamp();

    mysql.executeQuery(`INSERT INTO log_business_tax (business_id, price, timestamp, rp_datetime) VALUES ('${id}', '${price}', '${timestamp}', '${rpDateTime}')`);
};

business.updateOwnerInfo = function (bId, userId, userName) {
    methods.debug('business.updateOwnerInfo');
    business.set(bId, 'user_id', userId);
    business.set(bId, 'user_name', userName);
    business.save(bId);

    if (userId === 0) {
        discord.sendMarketBusiness(`${business.get(bId, 'name')}`, `Гос. стоимость: ${methods.moneyFormat(business.get(bId, 'price'))}`);
    }
};

business.sell = function (player) {
    methods.debug('business.sell');
    if (!user.isLogin(player))
        return;

    if (user.get(player, 'business_id') == 0) {
        player.notify('~r~У Вас нет бизнеса');
        return;
    }

    let hInfo = business.getData(user.get(player, 'business_id'));
    let nalog = methods.parseInt(hInfo.get('price') * (100 - coffer.getTaxProperty()) / 100);

    user.set(player, 'business_id', 0);

    business.set(hInfo.get('id'), 'user_id', 0);
    business.set(hInfo.get('id'), 'user_name', '');
    business.set(hInfo.get('id'), 'price_product', 2);

    coffer.removeMoney(1, nalog);
    user.addMoney(player, nalog, 'Продажа бизнеса ' + hInfo.get('name'));

    discord.sendMarketBusiness(`${business.get(hInfo.get('id'), 'name')}`, `Гос. стоимость: ${methods.moneyFormat(business.get(hInfo.get('id'), 'price'))}`);

    setTimeout(function () {

        if (!user.isLogin(player))
            return;

        user.addHistory(player, 3, 'Продал бизнес ' + hInfo.get('name') + ' №' + hInfo.get('id') + '. Цена: ' + methods.moneyFormat(nalog));
        player.notify(`~g~Вы продали бизнес\nНалог:~s~ ${coffer.getTaxProperty()}%\n~g~Получено:~s~ ${methods.moneyFormat(nalog)}`);
        user.save(player);
        user.updateClientCache(player);
        business.save(hInfo.get('id'));
    }, 1000);
};

business.buy = function (player, id) {
    methods.debug('business.buy');

    if (!user.isLogin(player))
        return;

    /*if (user.get(player, 'is_gos_blacklist')) { //TODO
        player.notify('~r~Вы состоите в чёрном списке');
        return;
    }*/

    let hInfo = business.getData(id);
    if (user.get(player, 'business_id') > 0) {
        player.notify('~r~У Вас есть недвижимость');
        return false;
    }
    if (hInfo.get('price') > user.getBankMoney(player)) {
        player.notify('~r~У Вас не хватает средств');
        return false;
    }
    if (hInfo.get('user_id') > 0) {
        player.notify('~r~Недвижимость уже куплена');
        return false;
    }
    if (user.get(player, 'reg_status') < 2) {
        player.notify('~r~Необходимо иметь гражданство');
        return false;
    }

    if (!user.get(player, 'biz_lic')) {
        player.notify('~r~У Вас нет лицензии на предпринимательство\nКупить её можно у сотрудников правительства');
        return false;
    }
    if (user.getBankMoney(player) < hInfo.get('price')) {
        player.notify('~r~У Вас недостаточно средств');
        return false;
    }

    /*if (user.get(player, 'fraction_id') == 1 && user.get(player, 'rank') > 7 && hInfo.get('type') != 10) { //TODO
        player.notify('~r~Запрещено покупать бизнесы сотрудникам правительства выше 7 ранга');
        player.notify('~r~Разрешено покупать только офис');
        return false;
    }*/

    coffer.addMoney(1, business.getMoney(hInfo.get('id')));
    business.setMoney(hInfo.get('id'), 0);

    user.set(player, 'business_id', hInfo.get('id'));

    business.set(hInfo.get('id'), 'user_id', user.getId(player));
    business.set(hInfo.get('id'), 'user_name', user.getRpName(player));

    coffer.addMoney(1, hInfo.get('price'));
    user.removeBankMoney(player, hInfo.get('price'), 'Покупка бизнеса ' + hInfo.get('name'));

    setTimeout(function () {
        if (!user.isLogin(player))
            return;
        user.addHistory(player, 3, 'Купил бизнес ' + hInfo.get('name') + ' №' + hInfo.get('id') + '. Цена: ' + methods.moneyFormat(hInfo.get('price')));
        user.save(player);
        player.notify('~g~Поздравляем с покупкой бизнеса!');
        user.updateClientCache(player);
        business.save(id);
    }, 1000);
    return true;
};