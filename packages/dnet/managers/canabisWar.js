let mysql = require('../modules/mysql');
let methods = require('../modules/methods');
let Container = require('../modules/data');
let chat = require('../modules/chat');

let dispatcher = require('./dispatcher');
let weather = require('./weather');

let user = require('../user');
let enums = require('../enums');
let coffer = require('../coffer');

let fraction = require('../property/fraction');

let canabisWar = exports;

let zoneRadius = 50;
let offset = 600000;
let blipOffset = 10000;
let keyPrefix = 'canabisWar';

let currentZone = 0;
let currentAttack = 0;
let currentDef = 0;
let isStartTimer = false;
let timerCounter = 0;
let canArmor = false;
let countUsers = 5;
let warPos = new mp.Vector3(0, 0, 0);

let defC = 0;
let attC = 0;

let gangList = [];

let warPool = new Map();

canabisWar.loadAll = function() {
    methods.debug('canabisWar.loadAll');
    mysql.executeQuery(`SELECT * FROM gang_war_2`, function (err, rows, fields) {

        rows.forEach(row => {
            canabisWar.set(row['id'], 'id', row['id']);
            canabisWar.set(row['id'], 'x', row['x']);
            canabisWar.set(row['id'], 'y', row['y']);
            canabisWar.set(row['id'], 'z', row['z']);
            canabisWar.set(row['id'], 'fraction_id', row['fraction_id']);
            canabisWar.set(row['id'], 'fraction_name', row['fraction_name']);
            canabisWar.set(row['id'], 'timestamp', row['timestamp']);
            canabisWar.set(row['id'], 'canWar', true);
            gangList.push({ id: row['id'], x: row['x'], y: row['y'], z: row['z'], fid: row['fraction_id']});
        });
    });

    setTimeout(function () {
        canabisWar.timer();
        //canabisWar.timerMoney();
    }, 10000);
};

canabisWar.save = function(id, ownerId, name) {
    methods.debug('canabisWar.save');
    canabisWar.set(id, 'fraction_id', ownerId);
    canabisWar.set(id, 'fraction_name', name);
    canabisWar.set(id, 'timestamp', methods.getTimeStamp());
    mysql.executeQuery("UPDATE gang_war_2 SET fraction_id = '" + ownerId + "',  fraction_name = '" + name + "',  timestamp = '" + methods.getTimeStamp() + "' where id = '" + id + "'");
};

canabisWar.getZoneList = function() {
    let list = [];
    gangList.forEach(item => {
        let newItem = item;
        newItem.fid = canabisWar.get(item.id, 'fraction_id');
        list.push(newItem)
    });
    return list;
};

canabisWar.getNearZoneId = function(pos) {
    let zoneId = -1;
    let prevPos = new mp.Vector3(9999, 9999, 9999);
    gangList.forEach(item => {
        let zPos = new mp.Vector3(item.x, item.y, item.z);
        if (methods.distanceToPos(zPos, pos) < methods.distanceToPos(prevPos, pos)) {
            prevPos = zPos;
            zoneId = item.id;
        }
    });
    return zoneId;
};

canabisWar.getZoneWarList = function() {
    return warPool;
};

canabisWar.hasWar = function(idx) {
    return warPool.has(idx.toString());
};

canabisWar.getWar = function(idx) {
    return warPool.get(idx.toString());
};

canabisWar.startWar = function(zoneId, attack, def, isArmor, count) {
    if (isStartTimer)
        return;

    methods.debug('canabisWar.startWar');

    isStartTimer = true;
    timerCounter = 300;
    currentZone = zoneId;
    currentAttack = attack;
    currentDef = def;
    warPos = canabisWar.getPos(zoneId);

    countUsers = count;
    canArmor = isArmor;

    mp.players.forEach(p => {
        if (user.isLogin(p))
            user.flashBlipByRadius(p, blipOffset + currentZone, true);
    });

    methods.notifyWithPictureToCanabisWar('Аванпост под угрозой', `ВНИМАНИЕ!`, 'Начался захват улицы ~y~#' + zoneId, 'CHAR_DEFAULT', def);

    for (let i = 1; i <= fraction.getCount(); i++) {
        if (def == i) continue;
        if (fraction.get(i, 'is_mafia')) {
            methods.notifyWithPictureToCanabisWar('Война за улицу', `ВНИМАНИЕ!`, 'Начался захват улицы ~y~#' + zoneId, 'CHAR_DEFAULT', i);
        }
    }
};

canabisWar.addWar = function(player, zoneId, count, armorIndex, gunIndex, timeIndex) {
    methods.debug('canabisWar.addWar');
    if (!user.isLogin(player))
        return;

    let id = zoneId;

    if (id == 0) {
        player.notify('~r~Вы слишком далеко от какой либо территории');
        return;
    }

    if (!canabisWar.get(id, 'canWar')) {
        player.notify('~r~Захват этой территории сейчас не доступен');
        return;
    }
    if (canabisWar.get(id, 'cant_war')) {
        player.notify('~r~Захват этой территории не доступен');
        return;
    }
    if (warPool.has(timeIndex.toString())) {
        player.notify('~r~Данное время занято другими людьми, выберите другое');
        return;
    }

    let ownerId = canabisWar.get(id, 'fraction_id');

    let idxToHour = [17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 22, 22, 22, 22, 23, 23, 23, 23];
    let dateTime = new Date(); //TODO
    if (dateTime.getHours() + 1 >= idxToHour[timeIndex]) {
        player.notify('~r~Назначеное время не доступно, попробуйте выбрать на час-два позже');
        return;
    }

    if (dateTime.getHours() < 14) {
        player.notify('~r~Доступно с 14:00');
        return;
    }

    canabisWar.set(id, 'timestamp', methods.getTimeStamp());

    let gunLabel = ['Любое', 'Пистолеты', 'Дробовики', 'SMG', 'Автоматы'];
    let timeLabel = ['17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00'];

    let data = {
        zoneId: zoneId,
        attack: user.get(player, 'fraction_id2'),
        def: ownerId,
        count: count,
        armor: armorIndex,
        gun: gunIndex,
        gunLabel: gunLabel[gunIndex],
        timeLabel: timeLabel[timeIndex],
        armorLabel: armorIndex === 0 ? 'Разрешено' : 'Запрещено',
    };

    warPool.set(timeIndex.toString(), data);

    methods.notifyWithPictureToCanabisWar('Аванпост под угрозой', `ВНИМАНИЕ!`, `Захват ~y~#${zoneId}~s~ начнется в ${timeLabel[timeIndex]} (( ООС МСК ))`, 'CHAR_DEFAULT', ownerId);
    methods.notifyWithPictureToCanabisWar('Война за улицу', `ВНИМАНИЕ!`, `Захват ~y~#${zoneId}~s~ начнется в ${timeLabel[timeIndex]} (( ООС МСК ))`, 'CHAR_DEFAULT', user.get(player, 'fraction_id2'));
};

canabisWar.dropTimer = function(player) {
    methods.debug('canabisWar.dropTimer');
    if (!user.isLogin(player) && !user.isAdmin(player))
        return;

    isStartTimer = false;
    timerCounter = 300;
    currentZone = 0;
    currentAttack = 0;
    currentDef = 0;
    defC = 0;
    attC = 0;
    warPos = new mp.Vector3(0, 0, 0);

    player.notify('~b~Таймер сброшен');
};

canabisWar.timer = function() {
    if (isStartTimer) {
        timerCounter--;

        defC = 0;
        attC = 0;

        mp.players.forEachInRange(warPos, 400, p => {
            if (!user.isLogin(p))
                return;
            if (user.isAdmin(p))
                return;
            let fId = methods.parseInt(user.get(p, 'fraction_id2'));
            if (fId === 0 && !user.isAdmin(p))
                return;
            if (canabisWar.isInZone(p, currentZone)) {
                if (p.health <= 0) return;
                if (p.dimension === 0) return;
                if (currentDef === fId)
                    defC++;
                if (currentAttack === fId)
                    attC++;

                if (p.ping > 300)
                    user.kickAntiCheat(p, `Ping: ${p.ping}ms`);
            }
        });

        if (attC > countUsers) {
            timerCounter = 0;
            isStartTimer = false;
            let zoneId = currentZone;
            let ownerId = defC;
            let fractionName = fraction.getName(ownerId);
            canabisWar.save(zoneId, ownerId, fractionName);
            canabisWar.set(zoneId, 'canWar', false);

            methods.notifyWithPictureToCanabisWar('Досрочное завершение', `Аванпост #${currentZone}`, 'Территория под контролем ' + fractionName + '\nСвязи с нарушением количества людей в территории', 'CHAR_DEFAULT', currentDef);
            methods.notifyWithPictureToCanabisWar('Досрочное завершение', `Аванпост #${currentZone}`, 'Территория под контролем ' + fractionName + '\nСвязи с нарушением количества людей в территории', 'CHAR_DEFAULT', currentAttack);
            canabisWar.changeZoneColor(currentZone, ownerId);
            mp.players.forEachInRange(warPos, 400, p => {
                if (!user.isLogin(p))
                    return;
                let fId = methods.parseInt(user.get(p, 'fraction_id2'));
                if (fId === 0 && !user.isAdmin(p))
                    return;
                if (currentDef === fId || currentAttack === fId || user.isAdmin(p)) {
                    if (p.dimension > 0) {
                        user.set(p, 'st_capt_m', user.get(p, 'st_capt_m') + 1);
                        if (ownerId === fId)
                            user.set(p, 'st_capt_m_win', user.get(p, 'st_capt_m_win') + 1);
                        p.dimension = 0;
                    }
                }
            });

            currentZone = 0;
            currentAttack = 0;
            currentDef = 0;
            defC = 0;
            attC = 0;
            warPos = new mp.Vector3(0, 0, 0);
        }
        else if (defC > countUsers) {
            timerCounter = 0;
            isStartTimer = false;
            let zoneId = currentZone;
            let ownerId = attC;
            let fractionName = fraction.getName(ownerId);
            canabisWar.save(zoneId, ownerId, fractionName);
            canabisWar.set(zoneId, 'canWar', false);

            methods.notifyWithPictureToCanabisWar('Досрочное завершение', `Аванпост #${currentZone}`, 'Территория под контролем ' + fractionName + '\nСвязи с нарушением количества людей в территории', 'CHAR_DEFAULT', currentDef);
            methods.notifyWithPictureToCanabisWar('Досрочное завершение', `Аванпост #${currentZone}`, 'Территория под контролем ' + fractionName + '\nСвязи с нарушением количества людей в территории', 'CHAR_DEFAULT', currentAttack);

            canabisWar.changeZoneColor(currentZone, ownerId);
            mp.players.forEachInRange(warPos, 400, p => {
                if (!user.isLogin(p))
                    return;
                let fId = methods.parseInt(user.get(p, 'fraction_id2'));
                if (fId === 0 && !user.isAdmin(p))
                    return;
                if (currentDef === fId || currentAttack === fId || user.isAdmin(p)) {
                    if (p.dimension > 0) {
                        user.set(p, 'st_capt_m', user.get(p, 'st_capt_m') + 1);
                        if (ownerId === fId)
                            user.set(p, 'st_capt_m_win', user.get(p, 'st_capt_m_win') + 1);
                        p.dimension = 0;
                    }
                }
            });

            currentZone = 0;
            currentAttack = 0;
            currentDef = 0;
            defC = 0;
            attC = 0;
            warPos = new mp.Vector3(0, 0, 0);
        }
        else {
            mp.players.forEachInRange(warPos, 400, p => {
                if (!user.isLogin(p))
                    return;
                let fId = methods.parseInt(user.get(p, 'fraction_id2'));
                if (fId === 0 && !user.isAdmin(p))
                    return;
                try {
                    if (user.isAdmin(p) || currentDef === fId || currentAttack === fId)
                        p.call('client:gangWar:sendArray', [JSON.stringify(canabisWar.getZone(currentZone))]);
                }
                catch (e) {}
                /*if (!canabisWar.isInZone(p, currentZone))
                    return;*/
                if (currentDef === fId || currentAttack === fId || user.isAdmin(p)) {
                    if (!canArmor && p.armour > 0)
                        user.setArmour(p, 0);
                    p.call("client:gangWar:sendInfo", [attC, defC, timerCounter]);
                    if (methods.distanceToPos(warPos, p.position) < 150)
                    {
                        if (p.dimension === 0)
                            p.dimension = 9998;
                    }
                    else if (p.dimension > 0)
                        p.dimension = 0;
                }
            });

            if (timerCounter < 1) {
                timerCounter = 0;
                isStartTimer = false;

                let zoneId = currentZone;
                let ownerId = canabisWar.getMaxCounterFractionId(attC, defC);
                let fractionName = fraction.getName(ownerId);
                canabisWar.save(zoneId, ownerId, fractionName);
                canabisWar.set(zoneId, 'canWar', false);

                methods.notifyWithPictureToCanabisWar('Итоги войны', `Аванпост #${currentZone}`, 'Территория под контролем ' + fractionName, 'CHAR_DEFAULT', currentDef);
                methods.notifyWithPictureToCanabisWar('Итоги войны', `Аванпост #${currentZone}`, 'Территория под контролем ' + fractionName, 'CHAR_DEFAULT', currentAttack);

                canabisWar.changeZoneColor(currentZone, ownerId);
                mp.players.forEachInRange(warPos, 400, p => {
                    if (!user.isLogin(p))
                        return;
                    let fId = methods.parseInt(user.get(p, 'fraction_id2'));
                    if (fId === 0 && !user.isAdmin(p))
                        return;
                    if (currentDef === fId || currentAttack === fId || user.isAdmin(p)) {
                        if (p.dimension > 0) {
                            user.set(p, 'st_capt_m', user.get(p, 'st_capt_m') + 1);
                            if (ownerId === fId)
                                user.set(p, 'st_capt_m_win', user.get(p, 'st_capt_m_win') + 1);
                            p.dimension = 0;
                        }
                    }
                });

                currentZone = 0;
                currentAttack = 0;
                currentDef = 0;
                defC = 0;
                attC = 0;
                warPos = new mp.Vector3(0, 0, 0);
            }
        }
    }
    setTimeout(canabisWar.timer, 1000);
};

canabisWar.timerMoney = function() {

    let moneyToUser = new Map();
    gangList.forEach(item => {
        let i = item.id;
        if (canabisWar.get(i, 'fraction_id') > 0) {

            let money = methods.getRandomInt(100, 150) / 1000;
            let id = methods.parseInt(canabisWar.get(i, 'fraction_id'));
            fraction.setMoney(id, fraction.getMoney(id) + methods.parseFloat(money));

            if (moneyToUser.has(canabisWar.get(i, 'fraction_id').toString())) {
                let cMoney = moneyToUser.get(canabisWar.get(i, 'fraction_id').toString());
                cMoney += methods.getRandomInt(6, 13) / 1000;
                moneyToUser.set(canabisWar.get(i, 'fraction_id').toString(), cMoney);
            }
            else {
                moneyToUser.set(canabisWar.get(i, 'fraction_id').toString(), methods.getRandomInt(300, 600) / 1000);
            }
        }
        else {
            let money = methods.getRandomInt(100, 150);
            let id = coffer.getIdByFraction(4);
            coffer.setMoney(id, coffer.getMoney(id) + methods.parseFloat(money));
        }
    });

    mp.players.forEach(p => {
        if (user.isLogin(p) && user.get(p, 'fraction_id2') > 0) {
            if (moneyToUser.has(user.get(p, 'fraction_id2').toString())) {
                if (p.getVariable('isAfk') === true) {
                    p.notify('~r~Зарплату вы не получили, связи с тем, что вы AFK');
                }
                else {
                    let cMoney = moneyToUser.get(user.get(p, 'fraction_id2').toString());
                    p.notify(`~g~Вы получили ${methods.cryptoFormat(cMoney)} за ваши захваченные территории`);
                    user.addCryptoMoney(p, cMoney, 'Прибыль с территорий');
                }
            }
        }
    });
};

canabisWar.getCountZones = function(fractionId = -1) {
    let count = 0;
    gangList.forEach(item => {
        if (canabisWar.get(item.id, 'fraction_id') === fractionId)
            count++;
    });
    return count;
};

canabisWar.getMaxCounterFractionId = function(at, def) {
    let maxValue = Math.max(at, def);
    if (def == maxValue)
        return currentDef;
    if (at == maxValue)
        return currentAttack;
    return 0;
};

canabisWar.set = function(id, key, val) {
    Container.Data.Set(offset + methods.parseInt(id), keyPrefix + key, val);
};

canabisWar.reset = function(id, key) {
    Container.Data.Reset(offset + methods.parseInt(id), keyPrefix + key);
};

canabisWar.get = function(id, key) {
    return Container.Data.Get(offset + methods.parseInt(id), keyPrefix + key);
};

canabisWar.getData = function(id) {
    return Container.Data.GetAll(offset + methods.parseInt(id));
};

canabisWar.has = function(id, key) {
    return Container.Data.Has(offset + methods.parseInt(id), keyPrefix + key);
};

canabisWar.getPos = function(id) {
    let pos = new mp.Vector3(canabisWar.get(id, 'x'), canabisWar.get(id, 'y'), canabisWar.get(id, 'z'));
    return pos;
};

mp.events.add("playerDeath", (player, reason, killer) => {
    if (!isStartTimer)
        return;
    if (user.isLogin(killer) && (user.isMafia(player))) {
        mp.players.forEachInRange(warPos, 400, p => {
            if (!user.isMafia(p) && !user.isAdmin(p))
                return;
            if (canabisWar.isInZone(p, currentZone)) {
                p.outputChatBoxNew(`[${chat.getTime()}] !{${chat.clBlue}}${user.getRpName(killer)} (${killer.id}) !{${chat.clWhite}}убил игрока !{${chat.clBlue}}${user.getRpName(player)} (${player.id})`);
            }
        });
    }
});

canabisWar.isInZone = function(player, id) {
    try {
        let list = [];
        canabisWar.getZone(id).forEach(item => {
            list.push(new mp.Vector3(item[0], item[1], 0))
        });
        return methods.isInPoint(player.position, list);
    }
    catch (e) {
    }
    return false;
};

canabisWar.getZone = function(id) {
    try {
        let list = [];
        list.push([canabisWar.get(id, 'x') - zoneRadius, canabisWar.get(id, 'y') - zoneRadius]);
        list.push([canabisWar.get(id, 'x') + zoneRadius, canabisWar.get(id, 'y') - zoneRadius]);
        list.push([canabisWar.get(id, 'x') + zoneRadius, canabisWar.get(id, 'y') + zoneRadius]);
        list.push([canabisWar.get(id, 'x') - zoneRadius, canabisWar.get(id, 'y') + zoneRadius]);
        return list;
    }
    catch (e) {
    }
    return [];
};

canabisWar.changeZoneColor = function(id, fractionId) {
    let _warPos = canabisWar.getPos(id);
    mp.players.forEach(p => {
        try {
            if (!user.isLogin(p))
                return;
            user.createBlip(p, blipOffset + id, _warPos.x, _warPos.y, _warPos.z, 767, enums.fractionColor[fractionId], false, false, '', 0, 0.6);
        }
        catch (e) {}
    });
};