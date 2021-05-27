let mysql = require('../modules/mysql');
let methods = require('../modules/methods');
let Container = require('../modules/data');
let chat = require('../modules/chat');

let dispatcher = require('./dispatcher');

let user = require('../user');
let enums = require('../enums');
let weather = require('./weather');

let fraction = require('../property/fraction');

let gangWar = exports;

let zoneRadius = 75;
let offset = 600000;
let keyPrefix = 'gangWar';

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

gangWar.loadAll = function() {
    methods.debug('gangWar.loadAll');
    mysql.executeQuery(`SELECT * FROM gang_war`, function (err, rows, fields) {

        rows.forEach(row => {
            gangWar.set(row['id'], 'id', row['id']);
            gangWar.set(row['id'], 'x', row['x']);
            gangWar.set(row['id'], 'y', row['y']);
            gangWar.set(row['id'], 'z', row['z']);
            gangWar.set(row['id'], 'zone', row['zone']);
            gangWar.set(row['id'], 'street', row['street']);
            gangWar.set(row['id'], 'fraction_id', row['fraction_id']);
            gangWar.set(row['id'], 'fraction_name', row['fraction_name']);
            gangWar.set(row['id'], 'timestamp', row['timestamp']);
            gangWar.set(row['id'], 'cant_war', row['cant_war']);
            gangWar.set(row['id'], 'canWar', true);
            gangList.push({ id: row['id'], x: row['x'], y: row['y'], z: row['z'], fid: row['fraction_id']});
        });
    });


    /*let pos = new mp.Vector3(1667.783203125, 5159.28125, 151.642578125);
    for (let i = 0; i < 12; i++) {
        for (let j = 0; j < 10; j++) {
            let x = pos.x + i * 150;
            let y = pos.y - j * 150;
            mysql.executeQuery(`INSERT INTO gang_war_2 (x, y, z) VALUES ('${x}', '${y}', '${0}')`);
        }
    }*/

    setTimeout(function () {
        gangWar.timer();
        //gangWar.timerMoney();
    }, 10000);
};

gangWar.save = function(id, ownerId, name) {
    methods.debug('gangWar.save');
    gangWar.set(id, 'fraction_id', ownerId);
    gangWar.set(id, 'fraction_name', name);
    gangWar.set(id, 'timestamp', methods.getTimeStamp());
    mysql.executeQuery("UPDATE gang_war SET fraction_id = '" + ownerId + "',  fraction_name = '" + name + "',  timestamp = '" + methods.getTimeStamp() + "' where id = '" + id + "'");
};

gangWar.getZoneList = function() {
    let list = [];
    gangList.forEach(item => {
        let newItem = item;
        newItem.fid = gangWar.get(item.id, 'fraction_id');
        list.push(newItem)
    });
    return list;
};

gangWar.getNearZoneId = function(pos) {
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

gangWar.getZoneWarList = function() {
    return warPool;
};

gangWar.hasWar = function(idx) {
    return warPool.has(idx.toString());
};

gangWar.getWar = function(idx) {
    return warPool.get(idx.toString());
};

gangWar.startWar = function(zoneId, attack, def, isArmor, count) {
    if (isStartTimer)
        return;

    methods.debug('gangWar.startWar');

    isStartTimer = true;
    timerCounter = 300;
    currentZone = zoneId;
    currentAttack = attack;
    currentDef = def;
    warPos = gangWar.getPos(zoneId);

    countUsers = count;
    canArmor = isArmor;

    mp.players.forEach(p => {
        if (user.isLogin(p))
            user.flashBlipByRadius(p, 1000 + currentZone, true);
    });

    methods.notifyWithPictureToFraction2('Улица под угрозой', `ВНИМАНИЕ!`, 'Начался захват улицы ~y~#' + zoneId, 'CHAR_DEFAULT', def);

    for (let i = 1; i <= fraction.getCount(); i++) {
        if (def == i) continue;
        if (fraction.get(i, 'is_war')) {
            methods.notifyWithPictureToFraction2('Война за улицу', `ВНИМАНИЕ!`, 'Начался захват улицы ~y~#' + zoneId, 'CHAR_DEFAULT', i);
        }
    }
    dispatcher.sendPos('Война банд', `(( Начался захват улицы ~y~#${zoneId}~s~ ))`, warPos);
};

gangWar.addWar = function(player, zoneId, count, armorIndex, gunIndex, timeIndex) {
    methods.debug('gangWar.addWar');
    if (!user.isLogin(player))
        return;

    let id = zoneId;

    if (id == 0) {
        player.notify('~r~Вы слишком далеко от какой либо территории');
        return;
    }

    if (!gangWar.get(id, 'canWar')) {
        player.notify('~r~Захват этой территории сейчас не доступен');
        return;
    }
    if (gangWar.get(id, 'cant_war')) {
        player.notify('~r~Захват этой территории не доступен');
        return;
    }
    if (user.get(player, 'fraction_id2') < 1) {
        player.notify('~r~Вы не состоите в организации');
        return;
    }
    if (!user.isLeader2(player) && !user.isSubLeader2(player)) {
        player.notify('~r~Начать захват может только лидер или заместитель лидера');
        return;
    }

    if (warPool.has(timeIndex.toString())) {
        player.notify('~r~Данное время занято другими людьми, выберите другое');
        return;
    }

    let ownerId = gangWar.get(id, 'fraction_id');
    if (ownerId > 0) {
        /*if (methods.getTimeStamp() < (gangWar.get(id, 'timestamp') + 244800)) {
            let date = new Date(methods.parseInt(gangWar.get(id, 'timestamp') + 244800) * 1000);
            player.notify('~r~Доступно каждые 3 дня (ООС)');
            player.notify(`~r~А именно:~s~ ${date.getDate()}/${(date.getMonth() + 1)}/${date.getFullYear()}`);
            return;
        }*/
    }
    else {
        let newOwnerId = user.get(player, 'fraction_id2');
        let fractionName = fraction.getName(newOwnerId);
        gangWar.save(zoneId, newOwnerId, fractionName);
        gangWar.set(zoneId, 'canWar', false);
        player.notify('~g~Вы захватили территорию, т.к. ей никто не владел');

        gangWar.changeZoneColor(currentZone, newOwnerId);
        return;
    }

    let idxToHour = [14, 14, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 22, 22, 22, 22, 23, 23, 23, 23];
    let dateTime = new Date(); //TODO
    if (dateTime.getHours() + 1 >= idxToHour[timeIndex]) {
        player.notify('~r~Назначеное время не доступно, попробуйте выбрать на час-два позже');
        return;
    }

    if (dateTime.getHours() < 10) {
        player.notify('~r~Доступно с 10:00');
        return;
    }

    gangWar.set(id, 'timestamp', methods.getTimeStamp());

    let gunLabel = ['Любое', 'Пистолеты', 'Дробовики', 'SMG', 'Автоматы'];
    let timeLabel = ['14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00'];

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

    methods.notifyWithPictureToFraction2('Улица под угрозой', `ВНИМАНИЕ!`, `Захват ~y~#${zoneId}~s~ начнется в ${timeLabel[timeIndex]} (( ООС МСК ))`, 'CHAR_DEFAULT', ownerId);
    methods.notifyWithPictureToFraction2('Война за улицу', `ВНИМАНИЕ!`, `Захват ~y~#${zoneId}~s~ начнется в ${timeLabel[timeIndex]} (( ООС МСК ))`, 'CHAR_DEFAULT', user.get(player, 'fraction_id2'));
};

gangWar.dropTimer = function(player) {
    methods.debug('gangWar.dropTimer');
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

gangWar.timer = function() {
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
            if (fId === 0)
                return;
            if (gangWar.isInZone(p, currentZone)) {
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
            gangWar.save(zoneId, ownerId, fractionName);
            gangWar.set(zoneId, 'canWar', false);

            methods.notifyWithPictureToFraction2('Досрочное завершение', `Улица #${currentZone}`, 'Территория под контролем ' + fractionName + '\nСвязи с нарушением количества людей в территории', 'CHAR_DEFAULT', currentDef);
            methods.notifyWithPictureToFraction2('Досрочное завершение', `Улица #${currentZone}`, 'Территория под контролем ' + fractionName + '\nСвязи с нарушением количества людей в территории', 'CHAR_DEFAULT', currentAttack);
            gangWar.changeZoneColor(currentZone, ownerId);
            mp.players.forEachInRange(warPos, 400, p => {
                if (!user.isLogin(p))
                    return;
                let fId = methods.parseInt(user.get(p, 'fraction_id2'));
                if (currentDef === fId || currentAttack === fId || user.isAdmin(p)) {
                    if (p.dimension > 0) {
                        user.set(p, 'st_capt', user.get(p, 'st_capt') + 1);
                        if (ownerId === fId)
                            user.set(p, 'st_capt_win', user.get(p, 'st_capt_win') + 1);
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
            gangWar.save(zoneId, ownerId, fractionName);
            gangWar.set(zoneId, 'canWar', false);

            methods.notifyWithPictureToFraction2('Досрочное завершение', `Улица #${currentZone}`, 'Территория под контролем ' + fractionName + '\nСвязи с нарушением количества людей в территории', 'CHAR_DEFAULT', currentDef);
            methods.notifyWithPictureToFraction2('Досрочное завершение', `Улица #${currentZone}`, 'Территория под контролем ' + fractionName + '\nСвязи с нарушением количества людей в территории', 'CHAR_DEFAULT', currentAttack);

            gangWar.changeZoneColor(currentZone, ownerId);
            mp.players.forEachInRange(warPos, 400, p => {
                if (!user.isLogin(p))
                    return;
                let fId = methods.parseInt(user.get(p, 'fraction_id2'));
                if (currentDef === fId || currentAttack === fId || user.isAdmin(p)) {
                    if (p.dimension > 0) {
                        user.set(p, 'st_capt', user.get(p, 'st_capt') + 1);
                        if (ownerId === fId)
                            user.set(p, 'st_capt_win', user.get(p, 'st_capt_win') + 1);
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
                try {
                    if (user.isAdmin(p) || currentDef === fId || currentAttack === fId)
                        p.call('client:gangWar:sendArray', [JSON.stringify(gangWar.getZone(currentZone))]);
                }
                catch (e) {}
                /*if (!gangWar.isInZone(p, currentZone))
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
                let ownerId = gangWar.getMaxCounterFractionId(attC, defC);
                let fractionName = fraction.getName(ownerId);
                gangWar.save(zoneId, ownerId, fractionName);
                gangWar.set(zoneId, 'canWar', false);

                methods.notifyWithPictureToFraction2('Итоги войны', `Улица #${currentZone}`, 'Территория под контролем ' + fractionName, 'CHAR_DEFAULT', currentDef);
                methods.notifyWithPictureToFraction2('Итоги войны', `Улица #${currentZone}`, 'Территория под контролем ' + fractionName, 'CHAR_DEFAULT', currentAttack);

                gangWar.changeZoneColor(currentZone, ownerId);
                mp.players.forEachInRange(warPos, 400, p => {
                    if (!user.isLogin(p))
                        return;
                    let fId = methods.parseInt(user.get(p, 'fraction_id2'));
                    if (currentDef === fId || currentAttack === fId || user.isAdmin(p)) {
                        if (p.dimension > 0) {
                            user.set(p, 'st_capt', user.get(p, 'st_capt') + 1);
                            if (ownerId === fId)
                                user.set(p, 'st_capt_win', user.get(p, 'st_capt_win') + 1);
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
    setTimeout(gangWar.timer, 1000);
};

gangWar.timerMoney = function() {

    let moneyToUser = new Map();
    let countToUser = new Map();

    for (let i = 1; i <= gangList.length; i++) {
        if (gangWar.get(i, 'fraction_id') > 0) {

            let money = methods.getRandomInt(100, 150) / 1000;
            let id = methods.parseInt(gangWar.get(i, 'fraction_id'));
            fraction.setMoney(id, fraction.getMoney(id) + methods.parseFloat(money));

            if (moneyToUser.has(gangWar.get(i, 'fraction_id').toString())) {
                let cMoney = moneyToUser.get(gangWar.get(i, 'fraction_id').toString());
                cMoney += methods.getRandomInt(6, 12) / 1000;
                moneyToUser.set(gangWar.get(i, 'fraction_id').toString(), cMoney);
            }
            else {
                moneyToUser.set(gangWar.get(i, 'fraction_id').toString(), methods.getRandomInt(150, 300) / 1000);
            }

            if (countToUser.has(gangWar.get(i, 'fraction_id').toString())) {
                let cMoney = countToUser.get(gangWar.get(i, 'fraction_id').toString());
                cMoney++;
                countToUser.set(gangWar.get(i, 'fraction_id').toString(), cMoney);
            }
            else {
                countToUser.set(gangWar.get(i, 'fraction_id').toString(), 1);
            }
        }
    }

    mp.players.forEach(p => {
        if (user.isLogin(p) && user.get(p, 'fraction_id2') > 0) {
            if (moneyToUser.has(user.get(p, 'fraction_id2').toString())) {
                if (p.getVariable('isAfk') === true) {
                    p.notify('~r~Зарплату вы не получили, связи с тем, что вы AFK');
                }
                else {
                    let cMoney = moneyToUser.get(user.get(p, 'fraction_id2').toString());
                    let cCount = countToUser.get(user.get(p, 'fraction_id2').toString());
                    p.notify(`~g~Вы получили ${methods.cryptoFormat(cMoney)} за ваши захваченные территории`);
                    user.addCryptoMoney(p, cMoney, 'Прибыль с территорий');

                    if (cCount > 58)
                        user.achiveDoneAllById(p, 27);
                }
            }
        }
    });
};

gangWar.getMaxCounterFractionId = function(at, def) {
    let maxValue = Math.max(at, def);
    if (def == maxValue)
        return currentDef;
    if (at == maxValue)
        return currentAttack;
    return 0;
};

gangWar.set = function(id, key, val) {
    Container.Data.Set(offset + methods.parseInt(id), keyPrefix + key, val);
};

gangWar.reset = function(id, key) {
    Container.Data.Reset(offset + methods.parseInt(id), keyPrefix + key);
};

gangWar.get = function(id, key) {
    return Container.Data.Get(offset + methods.parseInt(id), keyPrefix + key);
};

gangWar.getData = function(id) {
    return Container.Data.GetAll(offset + methods.parseInt(id));
};

gangWar.has = function(id, key) {
    return Container.Data.Has(offset + methods.parseInt(id), keyPrefix + key);
};

gangWar.getPos = function(id) {
    let pos = new mp.Vector3(gangWar.get(id, 'x'), gangWar.get(id, 'y'), gangWar.get(id, 'z'));
    return pos;
};

mp.events.add("playerDeath", (player, reason, killer) => {
    if (!isStartTimer)
        return;
    if (user.isLogin(killer) && user.isGang(player)) {

        user.achiveDoneAllById(killer, 23);

        mp.players.forEachInRange(warPos, 400, p => {
            if (!user.isGang(p) && !user.isAdmin(p))
                return;
            if (gangWar.isInZone(p, currentZone)) {
                p.outputChatBoxNew(`[${chat.getTime()}] !{${chat.clBlue}}${user.getRpName(killer)} (${killer.id}) !{${chat.clWhite}}убил игрока !{${chat.clBlue}}${user.getRpName(player)} (${player.id})`);
            }
        });
    }
});

gangWar.isInZone = function(player, id) {
    try {
        /*let list = [];
        let json = JSON.parse(gangWar.get(id, 'on_map'));
        json.forEach(item => {
            list.push(new mp.Vector3(item[0], item[1], 0))
        });*/
        let list = [];
        gangWar.getZone(id).forEach(item => {
            list.push(new mp.Vector3(item[0], item[1], 0))
        });
        return methods.isInPoint(player.position, list);
    }
    catch (e) {
    }
    return false;
};

gangWar.getZone = function(id) {
    try {
        let list = [];
        list.push([gangWar.get(id, 'x') - zoneRadius, gangWar.get(id, 'y') - zoneRadius]);
        list.push([gangWar.get(id, 'x') + zoneRadius, gangWar.get(id, 'y') - zoneRadius]);
        list.push([gangWar.get(id, 'x') + zoneRadius, gangWar.get(id, 'y') + zoneRadius]);
        list.push([gangWar.get(id, 'x') - zoneRadius, gangWar.get(id, 'y') + zoneRadius]);
        return list;
    }
    catch (e) {
    }
    return [];
};

gangWar.changeZoneColor = function(id, fractionId) {
    let _warPos = gangWar.getPos(id);
    mp.players.forEach(p => {
        try {
            if (!user.isLogin(p))
                return;
            user.createBlipByRadius(p, 1000 + id, _warPos.x, _warPos.y, _warPos.z, 75, 5, enums.fractionColor[fractionId]);
        }
        catch (e) {}
    });
};