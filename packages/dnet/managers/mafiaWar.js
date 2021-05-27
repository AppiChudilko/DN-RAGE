let mysql = require('../modules/mysql');
let methods = require('../modules/methods');
let Container = require('../modules/data');

let user = require('../user');
let enums = require('../enums');

let fraction = require('../property/fraction');

let weather = require('./weather');

let mafiaWar = exports;

let offset = enums.offsets.fractionMafia;
let keyPrefix = 'mafiaWar';

let isStartTimer1 = false;
let timerCounter1 = 0;
let warPos1 = new mp.Vector3(34.23244857788086, -2711.05078125, 4.38362455368042);
let warPosRadius1 = 300;
let warZone1 = [[50.65871, -2747.004, 6.142794], [17.57167, -2747.085, 6.120524], [17.41192, -2700.82, 6.204258], [7.317266, -2700.756, 6.120518], [7.301622, -2654.258, 6.125514], [50.65633, -2654.248, 6.119971], [50.68102, -2667.4, 6.134311], [63.94769, -2667.4, 6.163861], [64.00624, -2687.458, 6.120011], [50.68787, -2687.467, 6.120012]];

let isStartTimer2 = false;
let timerCounter2 = 0;
let warPos2 = new mp.Vector3(-552.1932983398438, -1656.835205078125, 18.24129867553711);
let warPosRadius2 = 300;
let warZone2 = [[-629.472, -1677.232, 25.03381], [-614.1249, -1690.092, 18.77112], [-514.9667, -1760.991, 20.74444], [-495.8772, -1765.96, 20.74444], [-475.2683, -1767.967, 17.87685], [-471.5099, -1767.644, 21.82916], [-430.3533, -1756.465, 19.46294], [-427.9393, -1754.422, 19.33072], [-417.8519, -1726.155, 18.41549], [-419.264, -1725.747, 18.39461], [-410.6906, -1702.046, 18.48046], [-409.3176, -1702.564, 18.42844], [-399.1928, -1675.105, 18.33369], [-458.2449, -1650.615, 18.07708], [-478.2147, -1640.697, 17.79407], [-537.643, -1606.548, 17.84891], [-554.8606, -1638.083, 18.06932], [-557.412, -1636.516, 18.06932], [-557.5357, -1638.768, 18.06932], [-562.7377, -1647.955, 18.19615], [-568.6687, -1657.762, 18.20731], [-605.7702, -1636.039, 22.45748]];

let isStartTimer3 = false;
let timerCounter3 = 0;
let warPos3 = new mp.Vector3(2699.89794921875, 2871.16357421875, 35.810306549072266);
let warPosRadius3 = 300;
let warZone3 = [[2778.663, 2834.762, 35.19794], [2778.342, 2838.091, 35.14888], [2810.335, 2857.637, 40.07437], [2799.21, 2880.826, 38.67813], [2773.987, 2914.711, 36.13195], [2755.215, 2929.608, 35.1285], [2739.906, 2936.638, 34.87273], [2691.712, 2948.787, 35.44474], [2676.972, 2948.42, 35.41834], [2659.891, 2940.45, 35.4324], [2642.506, 2925.125, 35.13564], [2626.453, 2902.961, 35.49685], [2610.773, 2890.742, 35.48591], [2584.012, 2867.696, 36.93011], [2574.502, 2846.346, 37.00723], [2571.128, 2826.114, 37.10781], [2571.086, 2805.998, 37.02121], [2573.261, 2791.066, 37.10905], [2578.005, 2779.561, 37.1505], [2587.601, 2768.651, 37.17116], [2605.104, 2758.408, 36.91574], [2622.463, 2754.885, 36.53188], [2644.869, 2757.137, 36.24055], [2662.671, 2763.224, 36.25749]];

//ID фракций мафий
let mafiaId1 = 16;
let mafiaId2 = 18;
let mafiaId3 = 17;

let limitUser = 20;
let limitUserMax = 40;

mafiaWar.loadAll = function() {
    methods.debug('mafiaWar.loadAll');
    mysql.executeQuery(`SELECT * FROM mafia_war`, function (err, rows, fields) {

        rows.forEach(row => {
            mafiaWar.set(row['id'], 'ownerId', row['owner_id']);
            mafiaWar.set(row['id'], 'money', row['money']);
            mafiaWar.set(row['id'], 'm_1', row['m_1']);
            mafiaWar.set(row['id'], 'm_2', row['m_2']);
            mafiaWar.set(row['id'], 'm_3', row['m_3']);
            mafiaWar.set(row['id'], 'canWar',true);
        });
    });

    setTimeout(function () {
        mafiaWar.timer();
        //mafiaWar.timerMoney();
    }, 10000);
};

mafiaWar.save = function(id, ownerId) {
    methods.debug('mafiaWar.save');
    mafiaWar.set(id, 'ownerId', ownerId);
    mysql.executeQuery("UPDATE mafia_war SET owner_id = '" + ownerId + "' where id = '" + id + "'");
};

mafiaWar.getZoneId = function(position) {
    methods.debug('mafiaWar.getZoneId');
    if (methods.distanceToPos(position, warPos1) < warPosRadius1)
        return 1;
    if (methods.distanceToPos(position, warPos2) < warPosRadius2)
        return 2;
    if (methods.distanceToPos(position, warPos3) < warPosRadius3)
        return 3;
    return 0;
};

mafiaWar.startWar = function(id) {
    methods.debug('mafiaWar.startWar');
    /*if (!user.isLogin(player))
        return;

    let id = mafiaWar.getZoneId(player.position);

    if (id == 0) {
        player.notify('~r~Вы слишком далеко от какой либо территории');
        return;
    }

    if (!mafiaWar.get(id, 'canWar')) {
        player.notify('~r~Захват этой территории будет доступен завтра');
        return;
    }
    if (weather.getHour() < 20 && weather.getHour() > 8) {
        player.notify('~r~Доступно только с 20 до 8 утра IC времени');
        return;
    }

    let ownerId = mafiaWar.get(id, 'ownerId');

    let dateTime = new Date();
    if (ownerId > 0) {
        if (dateTime.getDate() % 3) {
            player.notify('~r~Доступно каждые 3 дня (ООС)');
            player.notify('~r~А именно: 3, 6, 9, 12, 15, 18, 21, 24, 27, 30 число на календаре');
            return;
        }
    }

    if (dateTime.getHours() < 20) {
        player.notify('~r~Доступно только с 20 до 24 ночи ООС времени');
        return;
    }*/

    switch (id) {
        case 1:
            if (isStartTimer1) {
                return;
            }

            lcn1 = 0;
            rm1 = 0;
            yk1 = 0;

            isStartTimer1 = true;
            timerCounter1 = 900;
            methods.notifyWithPictureToFraction('Война за территорию', `Организация`, 'Начался захват территории ~y~Порт', 'CHAR_DEFAULT', mafiaId1);
            methods.notifyWithPictureToFraction('Война за территорию', `Организация`, 'Начался захват территории ~y~Порт', 'CHAR_DEFAULT', mafiaId2);
            methods.notifyWithPictureToFraction('Война за территорию', `Организация`, 'Начался захват территории ~y~Порт', 'CHAR_DEFAULT', mafiaId3);
            break;
        case 2:
            if (isStartTimer2) {
                return;
            }

            lcn2 = 0;
            rm2 = 0;
            yk2 = 0;

            isStartTimer2 = true;
            timerCounter2 = 900;
            methods.notifyWithPictureToFraction('Война за территорию', `Организация`, 'Начался захват территории ~y~Свалка', 'CHAR_DEFAULT', mafiaId1);
            methods.notifyWithPictureToFraction('Война за территорию', `Организация`, 'Начался захват территории ~y~Свалка', 'CHAR_DEFAULT', mafiaId2);
            methods.notifyWithPictureToFraction('Война за территорию', `Организация`, 'Начался захват территории ~y~Свалка', 'CHAR_DEFAULT', mafiaId3);
            break;
        case 3:
            if (isStartTimer3) {
                return;
            }

            lcn3 = 0;
            rm3 = 0;
            yk3 = 0;

            isStartTimer3 = true;
            timerCounter3 = 900;
            methods.notifyWithPictureToFraction('Война за территорию', `Организация`, 'Начался захват территории ~y~Карьер', 'CHAR_DEFAULT', mafiaId1);
            methods.notifyWithPictureToFraction('Война за территорию', `Организация`, 'Начался захват территории ~y~Карьер', 'CHAR_DEFAULT', mafiaId2);
            methods.notifyWithPictureToFraction('Война за территорию', `Организация`, 'Начался захват территории ~y~Карьер', 'CHAR_DEFAULT', mafiaId3);
            break;
    }
    return true;
};

let lcn1 = 0;
let rm1 = 0;
let yk1 = 0;

let lcn2 = 0;
let rm2 = 0;
let yk2 = 0;

let lcn3 = 0;
let rm3 = 0;
let yk3 = 0;

let lcn1l = 0;
let rm1l = 0;
let yk1l = 0;

let lcn2l = 0;
let rm2l = 0;
let yk2l = 0;

let lcn3l = 0;
let rm3l = 0;
let yk3l = 0;

mafiaWar.timer = function() {
    if (isStartTimer1) {
        timerCounter1--;

        lcn1l = 0;
        rm1l = 0;
        yk1l = 0;

        mp.players.forEachInRange(warPos1, warPosRadius1, p => {
            if (!user.isLogin(p))
                return;
            if (p.health == 0) return;

            if (!mafiaWar.isInZone(p, warZone1))
                return;

            if (user.isRussianMafia(p))
            {
                rm1++;
                rm1l++;
                if (rm1l > limitUser)
                    user.setHealth(p, -1);
            }
            if (user.isYakuza(p))
            {
                yk1++;
                yk1l++;
                if (yk1l > limitUser)
                    user.setHealth(p, -1);
            }
            if (user.isCosaNostra(p))
            {
                lcn1++;
                lcn1l++;
                if (lcn1l > limitUser)
                    user.setHealth(p, -1);
            }
        });

        if (timerCounter1 < 1) {
            timerCounter1 = 0;
            isStartTimer1 = false;
            let zoneId = mafiaWar.getZoneId(warPos1);
            let ownerId = mafiaWar.getMaxCounterFractionId(rm1, yk1, lcn1);
            let fractionName = fraction.getName(ownerId);
            mafiaWar.save(zoneId, ownerId);
            mafiaWar.set(zoneId, 'ownerId', ownerId);
            mafiaWar.set(zoneId, 'canWar', false);

            methods.notifyWithPictureToFraction('Итоги войны', `Порт`, 'Территория под контролем ' + fractionName, 'CHAR_DEFAULT', mafiaId1);
            methods.notifyWithPictureToFraction('Итоги войны', `Порт`, 'Территория под контролем ' + fractionName, 'CHAR_DEFAULT', mafiaId2);
            methods.notifyWithPictureToFraction('Итоги войны', `Порт`, 'Территория под контролем ' + fractionName, 'CHAR_DEFAULT', mafiaId3);
        }
        mp.players.forEachInRange(warPos1, warPosRadius1, p => {
            if (!user.isLogin(p))
                return;
            try {
                if (user.isAdmin(p) || user.isMafia(p))
                    p.call('client:gangWar:sendArray', [JSON.stringify(warZone1)]);
            }
            catch (e) {}
            if (user.isMafia(p) || user.isAdmin(p))
                p.call("client:mafiaWar:sendInfo", [`${lcn1} (${lcn1l})`, `${rm1} (${rm1l})`, `${yk1} (${yk1l})`, timerCounter1]);
        });
    }
    if (isStartTimer2) {
        timerCounter2--;

        lcn2l = 0;
        rm2l = 0;
        yk2l = 0;

        mp.players.forEachInRange(warPos2, warPosRadius2, p => {
            if (!user.isLogin(p))
                return;
            if (p.health == 0) return;

            if (!mafiaWar.isInZone(p, warZone2))
                return;

            if (user.isRussianMafia(p))
            {
                rm2++;
                rm2l++;
                if (rm2l > limitUser)
                    user.setHealth(p, -1);
            }
            if (user.isYakuza(p))
            {
                yk2++;
                yk2l++;
                if (yk2l > limitUser)
                    user.setHealth(p, -1);
            }
            if (user.isCosaNostra(p))
            {
                lcn2++;
                lcn2l++;
                if (lcn2l > limitUser)
                    user.setHealth(p, -1);
            }
        });

        if (timerCounter2 < 1) {
            timerCounter2 = 0;
            isStartTimer2 = false;
            let zoneId = mafiaWar.getZoneId(warPos2);
            let ownerId = mafiaWar.getMaxCounterFractionId(rm2, yk2, lcn2);
            let fractionName = fraction.getName(ownerId);
            mafiaWar.save(zoneId, ownerId);
            mafiaWar.set(zoneId, 'ownerId', ownerId);
            mafiaWar.set(zoneId, 'canWar', false);

            methods.notifyWithPictureToFraction('Итоги войны', `Свалка`, 'Территория под контролем ' + fractionName, 'CHAR_DEFAULT', mafiaId1);
            methods.notifyWithPictureToFraction('Итоги войны', `Свалка`, 'Территория под контролем ' + fractionName, 'CHAR_DEFAULT', mafiaId2);
            methods.notifyWithPictureToFraction('Итоги войны', `Свалка`, 'Территория под контролем ' + fractionName, 'CHAR_DEFAULT', mafiaId3);
        }
        mp.players.forEachInRange(warPos2, warPosRadius2, p => {
            if (!user.isLogin(p))
                return;
            try {
                if (user.isAdmin(p) || user.isMafia(p))
                    p.call('client:gangWar:sendArray', [JSON.stringify(warZone2)]);
            }
            catch (e) {}
            if (user.isMafia(p) || user.isAdmin(p))
                p.call("client:mafiaWar:sendInfo", [`${lcn2} (${lcn2l})`, `${rm2} (${rm2l})`, `${yk2} (${yk2l})`, timerCounter2]);
                //p.call("client:mafiaWar:sendInfo", [lcn2, rm2, yk2, timerCounter2]);
        });
    }
    if (isStartTimer3) {
        timerCounter3--;

        lcn3l = 0;
        rm3l = 0;
        yk3l = 0;

        mp.players.forEachInRange(warPos3, warPosRadius3, p => {
            if (!user.isLogin(p))
                return;
            if (p.health == 0) return;

            if (!mafiaWar.isInZone(p, warZone3))
                return;

            if (user.isRussianMafia(p))
            {
                rm3++;
                rm3l++;
                if (rm3l > limitUser)
                    user.setHealth(p, -1);
            }
            if (user.isYakuza(p))
            {
                yk3++;
                yk3l++;
                if (yk3l > limitUser)
                    user.setHealth(p, -1);
            }
            if (user.isCosaNostra(p))
            {
                lcn3++;
                lcn3l++;
                if (lcn3l > limitUser)
                    user.setHealth(p, -1);
            }
        });

        if (timerCounter3 < 1) {
            timerCounter3 = 0;
            isStartTimer3 = false;
            let zoneId = mafiaWar.getZoneId(warPos3);
            let ownerId = mafiaWar.getMaxCounterFractionId(rm3, yk3, lcn3);
            let fractionName = fraction.getName(ownerId);
            mafiaWar.save(zoneId, ownerId);
            mafiaWar.set(zoneId, 'ownerId', ownerId);
            mafiaWar.set(zoneId, 'canWar', false);

            methods.notifyWithPictureToFraction('Итоги войны', `Карьер`, 'Территория под контролем ' + fractionName, 'CHAR_DEFAULT', mafiaId1);
            methods.notifyWithPictureToFraction('Итоги войны', `Карьер`, 'Территория под контролем ' + fractionName, 'CHAR_DEFAULT', mafiaId2);
            methods.notifyWithPictureToFraction('Итоги войны', `Карьер`, 'Территория под контролем ' + fractionName, 'CHAR_DEFAULT', mafiaId3);
        }

        mp.players.forEachInRange(warPos3, warPosRadius3, p => {
            if (!user.isLogin(p))
                return;
            try {
                if (user.isAdmin(p) || user.isMafia(p))
                    p.call('client:gangWar:sendArray', [JSON.stringify(warZone3)]);
            }
            catch (e) {}
            if (user.isMafia(p) || user.isAdmin(p))
                p.call("client:mafiaWar:sendInfo", [`${lcn3} (${lcn3l})`, `${rm3} (${rm3l})`, `${yk3} (${yk3l})`, timerCounter3]);
                //p.call("client:mafiaWar:sendInfo", [lcn3, rm3, yk3, timerCounter3]);
        });
    }
    setTimeout(mafiaWar.timer, 1000);
};

mafiaWar.timerMoney = function() {
    let moneyToUser = new Map();
    for (let i = 1; i <= 3; i++) {
        if (mafiaWar.get(i, 'ownerId') > 0) {

            let money = methods.getRandomInt(300, 500) / 1000;
            let id = methods.parseInt(mafiaWar.get(i, 'ownerId'));
            fraction.setMoney(id, fraction.getMoney(id) + methods.parseFloat(money));

            if (moneyToUser.has(mafiaWar.get(i, 'ownerId').toString())) {
                let cMoney = moneyToUser.get(mafiaWar.get(i, 'ownerId').toString());
                cMoney += methods.getRandomInt(30, 50) / 1000;
                moneyToUser.set(mafiaWar.get(i, 'ownerId').toString(), cMoney);
            }
            else {
                moneyToUser.set(mafiaWar.get(i, 'ownerId').toString(), methods.getRandomInt(30, 50) / 1000);
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
                    p.notify(`~g~Вы получили ${methods.cryptoFormat(cMoney)} за ваши захваченные бизнесы`);
                    user.addCryptoMoney(p, cMoney, 'Прибыль с бизнесов');
                }
            }
        }
    });
};

mafiaWar.getMaxCounterFractionId = function(rm, trd, lcn) {
    let maxValue = Math.max(rm, trd, lcn);
    if (rm == maxValue)
        return mafiaId1;
    if (trd == maxValue)
        return mafiaId2;
    if (lcn == maxValue)
        return mafiaId3;
    return 0;
};

mafiaWar.isInZone = function(player, zone) {
    try {
        let list = [];
        zone.forEach(item => {
            list.push(new mp.Vector3(item[0], item[1], 0))
        });
        return methods.isInPoint(player.position, list);
    }
    catch (e) {
    }
    return false;
};

mafiaWar.set = function(id, key, val) {
    Container.Data.Set(offset + methods.parseInt(id), keyPrefix + key, val);
};

mafiaWar.reset = function(id, key, val) {
    Container.Data.Reset(offset + methods.parseInt(id), keyPrefix + key, val);
};

mafiaWar.get = function(id, key) {
    return Container.Data.Get(offset + methods.parseInt(id), keyPrefix + key);
};

mafiaWar.getAll = function(id) {
    return Container.Data.GetAll(offset + methods.parseInt(id));
};

mafiaWar.has = function(id, key) {
    return Container.Data.Has(offset + methods.parseInt(id), keyPrefix + key);
};