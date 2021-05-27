let Container = require('../modules/data');
let mysql = require('../modules/mysql');
let methods = require('../modules/methods');

let user = require('../user');
let coffer = require('../coffer');
let enums = require('../enums');
let inventory = require('../inventory');

let weather = require('../managers/weather');
let dispatcher = require('../managers/dispatcher');
let canabisWar = require('../managers/canabisWar');

let vehicles = require('./vehicles');
let stocks = require('./stocks');

let family = exports;
let count = 0;

family.loadAll = function() {
    methods.debug('family.loadAll');

    mysql.executeQuery(`SELECT * FROM family_list`, function (err, rows, fields) {
        rows.forEach(function(item) {
            family.set(item['id'], 'id', item['id']);
            family.set(item['id'], 'owner_id', item['owner_id']);
            family.set(item['id'], 'name', item['name']);
            family.set(item['id'], 'money', item['money']);

            family.set(item['id'], 'rank_leader', item['rank_leader']);
            family.set(item['id'], 'rank_sub_leader', item['rank_sub_leader']);
            family.set(item['id'], 'rank_list', item['rank_list']);
            family.set(item['id'], 'rank_type_list', item['rank_type_list']);

            family.set(item['id'], 'level', item['level']);
            family.set(item['id'], 'exp', item['exp']);
        });
        count = rows.length;
        methods.debug('All Family Loaded: ' + count);
    });
};

family.loadById = function(id) {
    methods.debug('family.loadById');

    mysql.executeQuery(`SELECT * FROM family_list WHERE id = '${id}'`, function (err, rows, fields) {
        rows.forEach(function(item) {
            family.set(item['id'], 'id', item['id']);
            family.set(item['id'], 'owner_id', item['owner_id']);
            family.set(item['id'], 'name', item['name']);
            family.set(item['id'], 'money', item['money']);

            family.set(item['id'], 'rank_leader', item['rank_leader']);
            family.set(item['id'], 'rank_sub_leader', item['rank_sub_leader']);
            family.set(item['id'], 'rank_list', item['rank_list']);
            family.set(item['id'], 'rank_type_list', item['rank_type_list']);

            family.set(item['id'], 'level', item['level']);
            family.set(item['id'], 'exp', item['exp']);
        });
        count++;
    });
};

family.saveAll = function() {
    methods.debug('family.saveAll');
    mysql.executeQuery(`SELECT * FROM family_list`, function (err, rows, fields) {
        rows.forEach(function(item) {
            family.save(item['id']);
        });
    });
};

family.getCount = function() {
    methods.debug('family.getCount');
    return count;
};

family.save = function(id) {

    return new Promise((resolve) => {
        methods.debug('family.save');

        if (!family.has(id, "id")) {
            resolve();
            return;
        }

        let sql = "UPDATE family_list SET";

        sql = sql + " name = '" + methods.removeQuotes(family.get(id, "name")) + "'";
        sql = sql + ", money = '" + methods.parseInt(family.get(id, "money")) + "'";
        sql = sql + ", owner_id = '" + methods.parseInt(family.get(id, "owner_id")) + "'";
        sql = sql + ", rank_leader = '" + methods.removeQuotes(family.get(id, "rank_leader")) + "'";
        sql = sql + ", rank_sub_leader = '" + methods.removeQuotes(family.get(id, "rank_sub_leader")) + "'";
        sql = sql + ", rank_list = '" + methods.removeQuotes(family.get(id, "rank_list")) + "'";
        sql = sql + ", rank_type_list = '" + methods.removeQuotes(family.get(id, "rank_type_list")) + "'";
        sql = sql + ", level = '" + methods.parseInt(family.get(id, "level")) + "'";
        sql = sql + ", exp = '" + methods.parseInt(family.get(id, "exp")) + "'";

        sql = sql + " where id = '" + methods.parseInt(family.get(id, "id")) + "'";
        mysql.executeQuery(sql, undefined, function () {
            resolve();
        });
    });
};

family.getData = function(id) {
    return Container.Data.GetAll(enums.offsets.family + methods.parseInt(id));
};

family.get = function(id, key) {
    return Container.Data.Get(enums.offsets.family + methods.parseInt(id), key);
};

family.has = function(id, key) {
    return Container.Data.Has(enums.offsets.family + methods.parseInt(id), key);
};

family.set = function(id, key, val) {
    Container.Data.Set(enums.offsets.family + methods.parseInt(id), key, val);
};

family.reset = function(id, key, val) {
    Container.Data.Reset(enums.offsets.family + methods.parseInt(id), key, val);
};

family.getName = function(id) {
    if (id === 0)
        return 'Государство';
    return family.get(id, 'name');
};

family.addMoney = function(id, money, name = "Операция со счетом") {
    family.addHistory('Система', name, `Зачисление в бюждет: ${methods.cryptoFormat(money)}`, id);
    family.setMoney(id, family.getMoney(id) + methods.parseFloat(money));
};

family.removeMoney = function(id, money, name = "Операция со счетом") {
    family.addHistory('Система', name, `Потрачено из бюджета: ${methods.cryptoFormat(money * -1)}`, id);
    family.setMoney(id, family.getMoney(id) - methods.parseFloat(money));
};

family.setMoney = function(id, money) {
    id = methods.parseInt(id);
    Container.Data.Set(enums.offsets.family + id, 'money', methods.parseFloat(money));
};

family.getMoney = function(id) {
    id = methods.parseInt(id);
    if (Container.Data.Has(enums.offsets.family + id, 'money'))
        return methods.parseFloat(Container.Data.Get(enums.offsets.family + id, 'money'));
    return 0;
};

family.addHistory = function (name, doName, text, fractionId) {
    doName = methods.removeQuotes(doName);
    text = methods.removeQuotes(text);
    name = methods.removeQuotes(name);
    mysql.executeQuery(`INSERT INTO log_family (name, text, text2, fraction_id, timestamp, rp_datetime) VALUES ('${name}', '${doName}', '${text}', '${fractionId}', '${methods.getTimeStamp()}', '${weather.getRpDateTime()}')`);
};

family.editFractionLeader = function(player, text) {
    if (!user.isLogin(player))
        return;

    let id = user.get(player, 'family_id');
    family.set(id, "rank_leader", methods.removeQuotes2(methods.removeQuotes(text)));
    player.notify('~g~Вы обновили название ранга');

    family.save(id);
};

family.editFractionSubLeader = function(player, text) {
    if (!user.isLogin(player))
        return;

    let id = user.get(player, 'family_id');
    family.set(id, "rank_sub_leader", methods.removeQuotes2(methods.removeQuotes(text)));
    player.notify('~g~Вы обновили название ранга');

    family.save(id);
};

family.editFractionRank = function(player, text, rankId, depId) {
    if (!user.isLogin(player))
        return;

    text = methods.removeQuotes2(methods.removeQuotes(text));

    let id = user.get(player, 'family_id');
    let rankList = JSON.parse(family.get(id, 'rank_list'));
    rankList[depId][rankId] = text;
    family.set(id, "rank_list", JSON.stringify(rankList));

    player.notify('~g~Вы обновили название ранга');

    family.save(id);
};

family.deleteFractionRank = function(player, rankId, depId) {
    if (!user.isLogin(player))
        return;

    let id = user.get(player, 'family_id');

    let depList = JSON.parse(family.get(id, 'rank_type_list'));
    let rankList = JSON.parse(family.get(id, 'rank_list'));

    let rank = JSON.parse(family.getData(id).get('rank_list'))[depId].length - 1;

    mp.players.forEach(p => {
        if (user.isLogin(p)) {
            if (user.get(p, 'family_id') === id && user.get(p, 'rank_typef') === depId) {

                if (user.get(p, 'rankf') === rankId) {
                    user.set(p, 'rankf', rank - 1);
                }
                if (user.get(p, 'rankf') > rankId) {
                    user.set(p, 'rankf', user.get(p, 'rankf') - 1);
                }
            }
        }
    });

    mysql.executeQuery(`UPDATE users SET rank_typef = rankf - 1 where family_id = '${id}' AND rank_typef = '${depId}' AND rankf > '${rank}'`);
    mysql.executeQuery(`UPDATE users SET rankf = '${rank - 1}' where family_id = '${id}' AND rank_typef = '${depId}' AND rankf = '${rank}'`);

    let newRankList = [];
    let newRankListLocal = [];

    rankList[depId].forEach((item, idx) => {
        if (idx === rankId)
            return;
        newRankListLocal.push(rankList[depId][idx]);
    });

    depList.forEach((item, idx) => {
        if (idx === depId)
            newRankList.push(newRankListLocal);
        else
            newRankList.push(rankList[idx]);
    });

    family.set(id, "rank_list", JSON.stringify(newRankList));

    player.notify('~g~Вы удалили должность');

    family.save(id);
};

family.editFractionDep = function(player, text, depId) {
    if (!user.isLogin(player))
        return;

    text = methods.removeQuotes2(methods.removeQuotes(text));

    let id = user.get(player, 'family_id');
    let depList = JSON.parse(family.get(id, 'rank_type_list'));
    depList[depId] = text;
    family.set(id, "rank_type_list", JSON.stringify(depList));

    player.notify('~g~Вы обновили название раздела');

    family.save(id);
};

family.deleteFractionDep = function(player, depId) {
    if (!user.isLogin(player))
        return;

    let id = user.get(player, 'family_id');

    let depList = JSON.parse(family.get(id, 'rank_type_list'));
    let rankList = JSON.parse(family.get(id, 'rank_list'));

    let rank = JSON.parse(family.getData(id).get('rank_list'))[0].length - 1;

    mp.players.forEach(p => {
        if (user.isLogin(p)) {
            if (user.get(p, 'family_id') === id) {

                if (user.get(p, 'rank_typef') === depId) {
                    user.set(p, 'rankf', rank);
                    user.set(p, 'rank_typef', 0);
                }
                if (user.get(p, 'rank_typef') > depId) {
                    user.set(p, 'rank_typef', user.get(p, 'rank_typef') - 1);
                }
            }
        }
    });

    mysql.executeQuery(`UPDATE users SET rankf = '${rank}', rank_typef = '0' where family_id = '${id}' AND rank_typef = '${depId}'`);
    mysql.executeQuery(`UPDATE users SET rank_typef = rank_typef - 1 where family_id = '${id}' AND rank_typef > '${depId}'`);

    let newDepList = [];
    let newRankList = [];
    depList.forEach((item, idx) => {
        if (idx === depId)
            return;
        newDepList.push(item);
        newRankList.push(rankList[idx]);
    });

    family.set(id, "rank_type_list", JSON.stringify(newDepList));
    family.set(id, "rank_list", JSON.stringify(newRankList));

    player.notify('~g~Вы удалили раздел');

    family.save(id);
};

family.addFractionRank = function(player, text, depId) {
    if (!user.isLogin(player))
        return;

    text = methods.removeQuotes2(methods.removeQuotes(text));

    let id = user.get(player, 'family_id');
    let rankList = JSON.parse(family.get(id, 'rank_list'));
    rankList[depId].push(text);
    family.set(id, "rank_list", JSON.stringify(rankList));

    player.notify('~g~Вы добавили должность');

    family.save(id);
};

family.editFractionDep = function(player, text, depId) {
    if (!user.isLogin(player))
        return;

    text = methods.removeQuotes2(methods.removeQuotes(text));

    let id = user.get(player, 'family_id');
    let depList = JSON.parse(family.get(id, 'rank_type_list'));
    depList[depId] = text;
    family.set(id, "rank_type_list", JSON.stringify(depList));

    player.notify('~g~Вы обновили название раздела');

    family.save(id);
};

family.createFractionDep = function(player, text) {
    if (!user.isLogin(player))
        return;

    let id = user.get(player, 'family_id');

    text = methods.removeQuotes2(methods.removeQuotes(text));

    let depList = JSON.parse(family.get(id, 'rank_type_list'));
    depList.push(text);

    let rankList = JSON.parse(family.get(id, 'rank_list'));
    rankList.push(["Глава отдела", "Зам. главы отдела"]);

    family.set(id, "rank_type_list", JSON.stringify(depList));
    family.set(id, "rank_list", JSON.stringify(rankList));

    player.notify('~g~Вы сменили добавили новый раздел');

    family.save(id);
};

family.updateOwnerInfo = function (id, userId) {
    methods.debug('family.updateOwnerInfo');
    id = methods.parseInt(id);
    userId = methods.parseInt(userId);

    if (userId == 0) {
        mysql.executeQuery("DELETE FROM family_list where id = '" + id + "'");
    }
    else {
        family.set(id, "owner_id", userId);
        mysql.executeQuery("UPDATE fraction_list SET owner_id = '" + userId + "' where id = '" + id + "'");
        family.save(id);
    }
};

family.create = function (player, name) {
    if (!user.isLogin(player))
        return;

    methods.debug('family.create');

    if (user.get(player, 'family_id') > 0) {
        player.notify('~r~Вы уже состоите в семье');
        return;
    }
    if (user.getMoney(player) < 500000) {
        player.notify('~r~У Вас не достаточно валюты для создания семьи');
        return;
    }

    name = methods.removeQuotes2(methods.removeSpecialChars(methods.removeQuotes(name)));
    if (name === '') {
        player.notify('~r~Не должно быть кавычек в названии семьи');
        return;
    }

    mysql.executeQuery(`SELECT * FROM family_list WHERE name = '${name}'`, function (err, rows, fields) {
        if (rows.length === 0) {
            mysql.executeQuery(`INSERT INTO family_list (name, owner_id) VALUES ('${name}', '${user.getId(player)}')`);
            setTimeout(function () {
                mysql.executeQuery(`SELECT * FROM family_list WHERE owner_id = '${user.getId(player)}' ORDER BY id DESC`, function (err, rows, fields) {
                    if (rows.length === 0) {
                        player.notify('~r~Ошибка создании семьи');
                    }
                    else {
                        let id = rows[0]['id'];
                        family.loadById(id);

                        user.set(player, 'family_id', id);
                        user.set(player, 'is_leaderf', true);

                        user.removeMoney(player, 500000, 'Создание семьи ' + name);

                        setTimeout(function () {
                            if (!user.isLogin(player))
                                return;
                            user.save(player);
                            player.notify('~g~Поздравляем с созданием семьи');
                        }, 500);
                    }
                });
            }, 500)
        }
        else {

            player.notify('~r~Такая семья уже существует');
        }
    });

};

family.destroy = function (player, id) {
    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    methods.debug('family.destroy');

    if (!user.isLeaderF(player)) {
        player.notify('~r~Эта семья вам не приналдежит');
        return;
    }

    player.notify('~y~Семья была расфомирована');

    user.set(player, 'family_id', 0);
    user.set(player, 'is_leaderf', false);

    user.updateClientCache(player);

    family.destroyJust(id);
};

family.destroyJust = function (id) {
    id = methods.parseInt(id);
    methods.debug('family.destroy');
    mysql.executeQuery("UPDATE users SET family_id = '" + 0 + "' where family_id = '" + id + "'");
    mp.players.forEach(p => {
        if (!user.isLogin(p))
            return;

        if (user.get(p, 'family_id') == id) {
            user.set(p, 'family_id', 0);
            user.set(p, 'is_leaderf', false);
            p.notify('~y~Семья была расфомирована');
        }
    });
    family.updateOwnerInfo(id, 0);
};

