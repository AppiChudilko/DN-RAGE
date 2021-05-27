let mysql = require('./modules/mysql');
let methods = require('./modules/methods');
let Container = require('./modules/data');
let chat = require('./modules/chat');
let ctos = require('./modules/ctos');

let enums = require('./enums');
let coffer = require('./coffer');
let inventory = require('./inventory');
let admin = require('./admin');

let wpSync = require('./managers/wpSync');
let weather = require('./managers/weather');
let discord = require('./managers/discord');
let gangWar = require('./managers/gangWar');
let canabisWar = require('./managers/canabisWar');

let vehicles = require('./property/vehicles');
let houses = require('./property/houses');
let condos = require('./property/condos');
let fraction = require('./property/fraction');
let family = require('./property/family');
let stocks = require('./property/stocks');
let yachts = require('./property/yachts');

let user = exports;

user.createAccount = function(player, login, pass, email) {

    methods.debug('user.createAccount');

    if (!mp.players.exists(player))
        return;

    user.doesExistAccount(login, email, player.socialClub, function (cb) {
        if (cb == 1) {
            user.showCustomNotify(player, 'Аккаунт с такими SocialClub уже существует', 1);
            return;
        }
        else if (cb == 2) {
            user.showCustomNotify(player, 'Логин уже занят', 1);
            return;
        }
        else if (cb == 3) {
            user.showCustomNotify(player, 'Email уже занят', 1);
            return;
        }

        let social = player.socialClub;
        if (player.accSocial)
            social = player.accSocial;

        let sql = "INSERT INTO accounts (login, email, social, serial, password, reg_ip, reg_timestamp) VALUES ('" + login +
            "', '" + email + "', '" + social + "', '" + player.serial + "', '" + methods.sha256(pass) + "', '" + player.ip + "', '" + methods.getTimeStamp() + "')";
        mysql.executeQuery(sql);

        setTimeout(function () {
            user.loginAccount(player, login, pass);
        }, 1000)
    });
};

let skin = {
    SKIN_SEX: 0,
    SKIN_MOTHER_FACE: 0,
    SKIN_FATHER_FACE: 0,
    SKIN_MOTHER_SKIN: 0,
    SKIN_FATHER_SKIN: 0,
    SKIN_PARENT_FACE_MIX: 0,
    SKIN_PARENT_SKIN_MIX: 0,
    SKIN_HAIR: 0,
    SKIN_HAIR_2: 0,
    SKIN_HAIR_3: 0,
    SKIN_HAIR_COLOR: 0,
    SKIN_HAIR_COLOR_2: 0,
    SKIN_EYE_COLOR: 0,
    SKIN_EYEBROWS: 0,
    SKIN_EYEBROWS_COLOR: 0,
    SKIN_OVERLAY_1: -1,
    SKIN_OVERLAY_COLOR_1: -1,
    SKIN_OVERLAY_2: -1,
    SKIN_OVERLAY_COLOR_2: -1,
    SKIN_OVERLAY_3: -1,
    SKIN_OVERLAY_COLOR_3: -1,
    SKIN_OVERLAY_4: -1,
    SKIN_OVERLAY_COLOR_4: -1,
    SKIN_OVERLAY_5: -1,
    SKIN_OVERLAY_COLOR_5: -1,
    SKIN_OVERLAY_6: -1,
    SKIN_OVERLAY_COLOR_6: -1,
    SKIN_OVERLAY_7: -1,
    SKIN_OVERLAY_COLOR_7: -1,
    SKIN_OVERLAY_8: -1,
    SKIN_OVERLAY_COLOR_8: -1,
    SKIN_OVERLAY_9: -1,
    SKIN_OVERLAY_COLOR_9: -1,
    SKIN_OVERLAY_10: -1,
    SKIN_OVERLAY_COLOR_10: -1,
    SKIN_OVERLAY_11: -1,
    SKIN_OVERLAY_COLOR_11: 0,
    SKIN_OVERLAY_12: -1,
    SKIN_OVERLAY_COLOR_12: -1,
    SKIN_FACE_SPECIFICATIONS: [],
};

user.createUser = function(player, name, surname, age, promocode, referer, national) {
    if (!mp.players.exists(player))
        return;
    methods.debug('user.createUser');

    user.doesExistUser(name + ' ' + surname, function (cb) {

        if (cb == true) {
            user.showCustomNotify(player, 'Имя и Фамилия уже занята другим пользователем, попробуйте другое', 1);
            return;
        }

        promocode = promocode.toUpperCase();
        mysql.executeQuery(`SELECT * FROM promocode_top_list WHERE promocode = '${promocode}' AND is_use = 0 LIMIT 1`, function (err, rows, fields) {
            if (rows.length >= 1) {

                let paramsStart = JSON.parse(rows[0]["start"]);
                let money = 0;
                let vipTime = 0;
                let vipType = 0;
                if (promocode !== '') {
                    money += methods.parseInt(paramsStart.money);
                    vipType = methods.parseInt(paramsStart.vipt);
                    if (methods.parseInt(paramsStart.vip) > 0)
                        vipTime = methods.parseInt(paramsStart.vip * 86400) + methods.getTimeStamp();
                }

                try {
                    referer = referer.toString().replace('_', ' ');
                }
                catch (e) {}

                user.showCustomNotify(player, 'Пожалуйста подожите...');
                let newAge = `${methods.digitFormat(weather.getDay())}.${methods.digitFormat(weather.getMonth())}.${(weather.getFullYear() - age)}`;

                let sql = "INSERT INTO users (name, age, social, national, money, promocode, referer, skin, parachute, parachute_color, body_color, leg_color, foot_color, body, leg, foot, login_ip, login_date, reg_ip, reg_timestamp, vip_type, vip_time) VALUES ('" + name + ' ' + surname +
                    "', '" + newAge + "', '" + player.socialClub + "', '" + national + "', '" + money + "', '" + promocode + "', '" + referer + "', '" + JSON.stringify(skin) + "', '0', '44', '" + methods.getRandomInt(0, 5) + "', '" + methods.getRandomInt(0, 15) + "', '" + methods.getRandomInt(0, 15) + "', '0', '1', '1', '" + player.ip + "', '" + methods.getTimeStamp() + "', '" + player.ip + "', '" + methods.getTimeStamp() + "', '" + vipType + "', '" + vipTime + "')";
                mysql.executeQuery(sql);

                if (referer && referer !== '' && referer !== ' ') {
                    mysql.executeQuery(`UPDATE users SET money_donate = money_donate + '100' WHERE name ='${referer}'`);
                    mysql.executeQuery(`INSERT INTO log_referrer (name, referrer, money, timestamp) VALUES ('${name + ' ' + surname}', '${referer}', '100', '${methods.getTimeStamp()}')`);
                }

                setTimeout(function () {
                    user.loginUser(player, name + ' ' + surname);
                }, 1000);
            } else {
                user.showCustomNotify(player, 'Промокод не найден. Промокод можно ввести после регистрации в течении 24 часов через M - Настройки - Промокод', 1);
            }
        });
    });
};

user.loginAccount = function(player, login, pass) {

    methods.debug('user.loginAccount');
    if (!mp.players.exists(player))
        return false;
    user.validateAccount(player, login, pass, function (callback) {

        //user.showCustomNotify(player, 'Проверяем данные...', 0);

        if (callback == false) {
            user.showCustomNotify(player, 'Ошибка пароля или аккаунт еще не был создан', 1);
            return;
        }

        if (mp.players.exists(player))
        {
            user.showLoadDisplay(player);
            let players = [];

            mysql.executeQuery(`SELECT skin, tattoo,torso,torso_color,gloves,gloves_color,leg,leg_color,hand,hand_color,foot,foot_color,accessorie,accessorie_color,parachute,parachute_color,armor,armor_color,decal,decal_color,body,body_color,hat,hat_color,glasses,glasses_color,ear,ear_color,watch,watch_color,bracelet, bracelet_color,tprint_o,tprint_c, fraction_id2, fraction_id, pos_x, house_id, condo_id, apartment_id, yacht_id, stock_id, name, online_time, money, money_bank, login_date FROM users WHERE social = ? LIMIT 3`, player.accSocial, function (err, rows, fields) {
                try {
                    if (!mp.players.exists(player))
                        return;
                    if (err) {
                        player.call('client:events:loginAccount:success', [JSON.stringify(players)]);
                        methods.debug(err);
                    }
                    else {

                        try {
                            methods.saveLog('log_connect',
                                ['type', 'social', 'serial', 'address', 'game_id', 'account_id'],
                                ['LOGIN_ACC', player.socialClub, player.serial, player.ip, player.id, user.getId(player)]
                            );
                        }
                        catch (e) {

                        }

                        rows.forEach(row => {
                            try {
                                let sex = 'm';
                                try {
                                    sex = methods.parseInt(JSON.parse(row['skin'])['SKIN_SEX']) == 0 ? "m" : "w"
                                }
                                catch (e) {}

                                let spawnList = [];

                                if (row['pos_x'] !== 0)
                                    spawnList.push('Точка выхода');

                                if (row['house_id'])
                                    spawnList.push('Дом');

                                if (row['condo_id'])
                                    spawnList.push('Квартира');

                                if (row['apartment_id'])
                                    spawnList.push('Апартаменты');

                                if (row['yacht_id'])
                                    spawnList.push('Яхта');

                                if (row['stock_id']) {
                                    if (stocks.get(row['stock_id'], 'upgrade_g'))
                                        spawnList.push('Склад');
                                }

                                if (fraction.canSpawn(row['fraction_id2']) && row['fraction_id2'] > 0)
                                    spawnList.push('Спавн организации');
                                if (row['fraction_id'] === 4) {
                                    spawnList.push('Спавн в казарме');
                                    spawnList.push('Спавн на авианосце');
                                }

                                spawnList.push('Стандарт');

                                let cloth = {};

                                cloth.torso = row['torso'];
                                cloth.torso_color = row['torso_color'];
                                cloth.gloves = row['gloves'];
                                cloth.gloves_color = row['gloves_color'];
                                cloth.leg = row['leg'];
                                cloth.leg_color = row['leg_color'];
                                cloth.hand = row['hand'];
                                cloth.hand_color = row['hand_color'];
                                cloth.foot = row['foot'];
                                cloth.foot_color = row['foot_color'];
                                cloth.accessorie = row['accessorie'];
                                cloth.accessorie_color = row['accessorie_color'];
                                cloth.parachute = row['parachute'];
                                cloth.parachute_color = row['parachute_color'];
                                cloth.armor = row['armor'];
                                cloth.armor_color = row['armor_color'];
                                cloth.decal = row['decal'];
                                cloth.decal_color = row['decal_color'];
                                cloth.body = row['body'];
                                cloth.body_color = row['body_color'];
                                cloth.hat = row['hat'];
                                cloth.hat_color = row['hat_color'];
                                cloth.glasses = row['glasses'];
                                cloth.glasses_color = row['glasses_color'];
                                cloth.ear = row['ear'];
                                cloth.ear_color = row['ear_color'];
                                cloth.watch = row['watch'];
                                cloth.watch_color = row['watch_color'];
                                cloth.bracelet = row['bracelet'];
                                cloth.bracelet_color = row['bracelet_color'];
                                cloth.tprint_o = row['tprint_o'];
                                cloth.tprint_c = row['tprint_c'];

                                players.push({name: row['name'], skin: row['skin'], tattoo: row['tattoo'], cloth: JSON.stringify(cloth), age: methods.parseFloat(row['online_time'] * 8.5 / 60).toFixed(1), money: row['money'] + row['money_bank'], sex: sex, spawnList: spawnList, lastLogin: methods.unixTimeStampToDate(row['login_date'])})
                            }
                            catch (e) {
                                methods.debug(e);
                            }
                        });
                        player.call('client:events:loginAccount:success', [JSON.stringify(players)]);
                    }
                }
                catch (e) {
                    methods.debug('ERROR: ' + player.socialClub, e);
                }
            });
        }
        else
            user.showCustomNotify(player, 'Произошла неизвестная ошибка. Код ошибки #9999', 1);
        //player.notify('~b~Входим в аккаунт...');
    });
};

user.loginUser = function(player, name, spawn = 'Стандарт') {

    methods.debug('user.loginAccount');
    if (!mp.players.exists(player))
        return false;
    user.validateUser(name, function (callback) {

        if (callback == false) {
            user.showCustomNotify(player, 'Ошибка авторизации аккаунта, попробуйте еще раз', 1);
            return;
        }

        if (mp.players.exists(player))
            user.loadUser(player, name, spawn);
        else
            user.showCustomNotify(player, 'Произошла неизвестная ошибка. Код ошибки #9999', 1);
        //player.notify('~b~Входим в аккаунт...');
    });
};

user.save = function(player, withReset = false) {
    return new Promise(resolve => {
        methods.debug('user.saveAccount');

        if (!mp.players.exists(player)) {
            resolve(false);
            return;
        }

        if (!user.isLogin(player)) {
            resolve(false);
            return;
        }

        let sql = "UPDATE users SET social = '" + player.socialClub + "'";

        let skin = {};
        skin.SKIN_MOTHER_FACE = methods.parseInt(user.get(player, "SKIN_MOTHER_FACE"));
        skin.SKIN_FATHER_FACE = methods.parseInt(user.get(player, "SKIN_FATHER_FACE"));
        skin.SKIN_MOTHER_SKIN = methods.parseInt(user.get(player, "SKIN_MOTHER_SKIN"));
        skin.SKIN_FATHER_SKIN = methods.parseInt(user.get(player, "SKIN_FATHER_SKIN"));
        skin.SKIN_PARENT_FACE_MIX = user.get(player, "SKIN_PARENT_FACE_MIX");
        skin.SKIN_PARENT_SKIN_MIX = user.get(player, "SKIN_PARENT_SKIN_MIX");
        skin.SKIN_HAIR = methods.parseInt(user.get(player, "SKIN_HAIR"));
        skin.SKIN_HAIR_2 = methods.parseInt(user.get(player, "SKIN_HAIR_2"));
        skin.SKIN_HAIR_3 = methods.parseInt(user.get(player, "SKIN_HAIR_3"));
        skin.SKIN_HAIR_COLOR = methods.parseInt(user.get(player, "SKIN_HAIR_COLOR"));
        skin.SKIN_HAIR_COLOR_2 = methods.parseInt(user.get(player, "SKIN_HAIR_COLOR_2"));
        skin.SKIN_EYE_COLOR = methods.parseInt(user.get(player, "SKIN_EYE_COLOR"));
        skin.SKIN_EYEBROWS = methods.parseInt(user.get(player, "SKIN_EYEBROWS"));
        skin.SKIN_EYEBROWS_COLOR = methods.parseInt(user.get(player, "SKIN_EYEBROWS_COLOR"));
        skin.SKIN_OVERLAY_1 = methods.parseInt(user.get(player, "SKIN_OVERLAY_1"));
        skin.SKIN_OVERLAY_COLOR_1 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_1"));
        skin.SKIN_OVERLAY_2 = methods.parseInt(user.get(player, "SKIN_OVERLAY_2"));
        skin.SKIN_OVERLAY_COLOR_2 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_2"));
        skin.SKIN_OVERLAY_3 = methods.parseInt(user.get(player, "SKIN_OVERLAY_3"));
        skin.SKIN_OVERLAY_COLOR_3 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_3"));
        skin.SKIN_OVERLAY_4 = methods.parseInt(user.get(player, "SKIN_OVERLAY_4"));
        skin.SKIN_OVERLAY_COLOR_4 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_4"));
        skin.SKIN_OVERLAY_5 = methods.parseInt(user.get(player, "SKIN_OVERLAY_5"));
        skin.SKIN_OVERLAY_COLOR_5 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_5"));
        skin.SKIN_OVERLAY_6 = methods.parseInt(user.get(player, "SKIN_OVERLAY_6"));
        skin.SKIN_OVERLAY_COLOR_6 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_6"));
        skin.SKIN_OVERLAY_7 = methods.parseInt(user.get(player, "SKIN_OVERLAY_7"));
        skin.SKIN_OVERLAY_COLOR_7 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_7"));
        skin.SKIN_OVERLAY_8 = methods.parseInt(user.get(player, "SKIN_OVERLAY_8"));
        skin.SKIN_OVERLAY_COLOR_8 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_8"));
        skin.SKIN_OVERLAY_9 = methods.parseInt(user.get(player, "SKIN_OVERLAY_9"));
        skin.SKIN_OVERLAY_COLOR_9 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_9"));
        skin.SKIN_OVERLAY_10 = methods.parseInt(user.get(player, "SKIN_OVERLAY_10"));
        skin.SKIN_OVERLAY_COLOR_10 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_10"));
        skin.SKIN_OVERLAY_11 = methods.parseInt(user.get(player, "SKIN_OVERLAY_11"));
        skin.SKIN_OVERLAY_COLOR_11 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_11"));
        skin.SKIN_OVERLAY_12 = methods.parseInt(user.get(player, "SKIN_OVERLAY_12"));
        skin.SKIN_OVERLAY_COLOR_12 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_12"));
        skin.SKIN_FACE_SPECIFICATIONS = user.get(player, "SKIN_FACE_SPECIFICATIONS");
        skin.SKIN_SEX = methods.parseInt(user.get(player, "SKIN_SEX"));

        user.set(player, 'skin', JSON.stringify(skin));

        user.set(player, 'hp', player.health > 100 ? 100 : player.health);
        user.set(player, 'ap', player.armour > 100 ? 100 : player.armour);

        enums.userData.forEach(function(element) {
            if (element === 'id') return;
            else if (element === 'name') return;
            else if (element === 'is_online') return;

            if (user.has(player, element)) {
                if (typeof user.get(player, element) == 'boolean')
                    sql += `, ${element} = '${user.get(player, element) === true ? 1 : 0}'`;
                else if (typeof user.get(player, element) != 'object' && typeof user.get(player, element) != 'undefined') {
                    if (typeof(user.get(player, element)) == 'number' && isNaN(user.get(player, element))) return;
                    sql += `, ${element} = '${user.get(player, element)}'`;
                }
            }
        });

        sql = sql + " where id = '" + user.get(player, "id") + "'";
        mysql.executeQuery(sql);

        if (withReset === true) {
            user.resetAll(player);
        }
        else
            user.updateClientCache(player);
        resolve(true);
        return;
    });

};

user.saveName = function(player, newName) {
    return new Promise(resolve => {
        methods.debug('user.saveName');

        if (!mp.players.exists(player)) {
            resolve(false);
            return;
        }

        if (!user.isLogin(player)) {
            resolve(false);
            return;
        }
        
        user.set(player, 'name', methods.removeQuotes2(methods.removeQuotes(newName)));
        mysql.executeQuery("UPDATE users SET name = '" + methods.removeQuotes2(methods.removeQuotes(newName)) + "' where id = '" + user.get(player, "id") + "'");
        user.updateClientCache(player);
        resolve(true);
        return;
    });
};

user.loadUser = function(player, name, spawn = 'Стандарт') {

    methods.debug('user.loadUser');
    if (!mp.players.exists(player))
        return false;
    let selectSql = 'id';
    enums.userData.forEach(function(element) {
        selectSql += `, ${element}`;
    });

    let userId = 0;
    if (user.isLogin(player))
        userId = user.getId(player);

    mysql.executeQuery(`SELECT ${selectSql} FROM users WHERE name = ? LIMIT 1`, name, function (err, rows, fields) {

        enums.userData.forEach(function(element) {
            user.set(player, element, rows[0][element]);
        });

        setTimeout(function() {
            //user.updateCharacterFace(player);
            //user.updateCharacterCloth(player);

            if (!mp.players.exists(player))
                return false;

            try {
                JSON.parse(user.get(player, 'skin'), function(k, v) {
                    user.set(player, k, v);
                });
            }
            catch (e) {

                methods.saveFile('customError', `${player.socialClub}: ${e} | ${user.get(player, 'skin')}`);

                user.resetAll(player);
                //user.showCustomNotify(player, 'Аккаунт забанен до: ' + methods.unixTimeStampToDateTime(user.get(player, 'date_ban')), 1);
                user.showCustomNotify(player, 'Произошла ошибка ', 1);
                user.kick(player, 'У Вас произошла магическая ошибка, логи отправлены разработчикам, просто перезайдите');
                return;
            }

            if (user.get(player, 'date_ban') > methods.getTimeStamp()) {
                user.resetAll(player);
                //user.showCustomNotify(player, 'Аккаунт забанен до: ' + methods.unixTimeStampToDateTime(user.get(player, 'date_ban')), 1, 5, 60000);
                user.showCustomNotify(player, 'Вы забанены, подробности смотреть на сайте: state-99.com/banlist', 1, 5, 60000);
                user.kick(player, 'Вы забанены');
                return;
            }

            if (user.get(player, 'is_online') == 1 && !mysql.isTestServer()) {
                user.resetAll(player);
                user.showCustomNotify(player, 'Аккаунт уже авторизован', 1);
                user.kick(player, 'Вы были кикнуты');
                return;
            }

            user.set(player, 'ping', player.ping);
            user.set(player, 'is_online', 1);

            try {
                user.set(player, 'login_date', methods.getTimeStamp());
                user.set(player, 'login_ip', player.ip);
            } catch (e) {
                methods.debug(e);
            }

            setTimeout(function () {
                if (userId > 0)
                    mysql.executeQuery('UPDATE users SET is_online=\'0\' WHERE id = \'' + userId + '\'');

                if (!mp.players.exists(player))
                    return false;

                try {
                    if (user.get(player, 'SKIN_SEX') === 1)
                        player.model =  mp.joaat('mp_f_freemode_01');
                    else
                        player.model =  mp.joaat('mp_m_freemode_01');
                }
                catch (e) {

                }

                user.updateCharacterFace(player);
                setTimeout(function () {
                    user.updateCharacterCloth(player);
                }, 200);
                user.updateClientCache(player);

                player.setVariable('idLabel', user.get(player, 'id'));
                player.setVariable('name', user.get(player, 'name'));
                player.setVariable('walkie', user.get(player, 'walkie_' + (user.get(player, 'walkie_current') + 1)));
                player.setVariable('walkieBuy', user.get(player, 'walkie_buy'));
                player.setVariable('status_media', user.get(player, 'status_media'));
                player.dimension = 0;

                user.setFractionId(player, user.get(player, 'fraction_id'));
                user.setFractionId2(player, user.get(player, 'fraction_id2'));
                user.setFamilyId(player, user.get(player, 'family_id'));
                //user.setDatingName(player, user.get(player, 'name_dating'));
                player.setVariable('work_lvl', user.getWorkLvl(player));

                methods.loadDeleteObject(player);

                if (!user.hasById(user.getId(player), 'dailyAchiv')) {
                    let list = [];
                    let listAllow = [];
                    for (let i = 0; i < 18; i++)
                        list.push(0);
                    for (let i = 0; i < 5; i++)
                        listAllow.push(methods.getRandomInt(0, 18));
                    user.setById(user.getId(player), 'dailyAchiv', JSON.stringify(list));
                    user.setById(user.getId(player), 'dailyAchivAllow', JSON.stringify(listAllow));
                }

                inventory.updateItemsEquipByItemId(252, user.getId(player), 1, 0);

                //user.setArmour(player, user.get(player, 'ap'));
                user.setHealth(player, user.get(player, 'hp'));

                setTimeout(function () {
                    try {
                        //user.setArmour(player, user.get(player, 'ap'));
                        user.setHealth(player, user.get(player, 'hp'));
                        user.setClipset(player, user.get(player, 'clipset'));
                        user.setClipsetW(player, user.get(player, 'clipset_w'));
                    }
                    catch (e) {

                    }
                }, 2000);

                if (user.get(player, 'vip_time') > 0 && user.get(player, 'vip_time') < methods.getTimeStamp()) {
                    player.outputChatBox(`!{#f44336}Срок действия вашего VIP статуса подошел к концу`);
                    user.set(player, 'vip_time', 0);
                    user.set(player, 'vip_type', 0);
                }

                userId = user.getId(player);

                mysql.executeQuery(`SELECT * FROM user_dating WHERE user_owner = '${userId}'`, function (err, rowsD, fields) {

                    let list = [];

                    rowsD.forEach(rowD => {
                        list.push({ uId: rowD['user_id'], uName: rowD['user_name'] });
                    });

                    player.call('client:user:updateDating', [JSON.stringify(list)]);
                });

                mysql.executeQuery('UPDATE users SET is_online=\'1\' WHERE id = \'' + user.getId(player) + '\'');

                vehicles.loadAllUserVehicles(userId);
                if (!user.get(player, 'is_custom'))
                    player.call('client:events:loginUser:finalCreate');
                else {
                    user.spawnByName(player, spawn);
                }

                setTimeout(function () {
                    try {
                        mp.players.forEach(p => {
                            try {
                                if (user.isLogin(p)) {
                                    if (p.getVariable('idLabel') === player.getVariable('idLabel') && p.id !== player.id) {
                                        user.kickAntiCheat(p, 'Buguse');
                                        user.kickAntiCheat(player, 'Buguse');
                                    }
                                }
                            }
                            catch (e) {

                            }
                        });
                    }
                    catch (e) {
                        
                    }
                }, methods.getRandomInt(1000, 3000));

                methods.saveLog('log_connect',
                    ['type', 'social', 'serial', 'address', 'game_id', 'account_id'],
                    ['LOGIN', player.socialClub, player.serial, player.ip, player.id, userId]
                );

                player.call('client:events:loginUser:success');
                player.call('client:addGangZoneBlip', [JSON.stringify(gangWar.getZoneList())]);
                player.call('client:addCanabisZoneBlip', [JSON.stringify(canabisWar.getZoneList())]);
                //user.setOnlineStatus(player, 1);
            }, 600);

            //if (user.get(player, 'walkietalkie_num') && methods.parseInt(user.get(player, 'walkietalkie_num')) != 0)
            //    mp.events.call('voice.server.initRadio', player, user.get(player, 'walkietalkie_num'));

        }, methods.getRandomInt(1000, 3000));
    });
};

user.loadUserSkin = function(player) {
    methods.debug('user.loadUser');
    if (!mp.players.exists(player))
        return false;
    try {
        mysql.executeQuery(`SELECT skin FROM users WHERE name = ? LIMIT 1`, user.getRpName(player), function (err, rows, fields) {

            user.set(player, 'skin', rows[0]['skin']);

            JSON.parse(user.get(player, 'skin'), function(k, v) {
                user.set(player, k, v);
            });
            user.updateCharacterFace(player);
            setTimeout(function () {
                user.updateCharacterCloth(player);
            }, 200);
            user.updateClientCache(player);
        });
    }
    catch (e) {}
};

user.spawnByName = function(player, spawn = 'Стандарт') {
    methods.debug('user.spawnByName', spawn);
    if (!user.isLogin(player))
        return false;
    user.showLoadDisplay(player);
    setTimeout(function () {
        if (!user.isLogin(player))
            return false;

        try {
            player.dimension = 0;
        }
        catch (e) {
            
        }

        user.set(player, 'spawnName', spawn);

        try {
            if (spawn == 'Точка выхода') {
                player.spawn(new mp.Vector3(user.get(player, 'pos_x'), user.get(player, 'pos_y'), user.get(player, 'pos_z')));
                player.heading = user.get(player, 'rotation');
            }
            else if (spawn == 'Спавн организации') {
                let fData = fraction.getData(user.get(player, 'fraction_id2'));
                player.spawn(new mp.Vector3(fData.get('spawn_x'), fData.get('spawn_y'), fData.get('spawn_z')));
                player.heading = fData.get('spawn_rot');
            }
            else if (spawn == 'Спавн в казарме') {
                player.spawn(new mp.Vector3(580.6460571289062, -3118.20849609375, 17.76861572265625));
                player.heading = 84.13103485107422;
            }
            else if (spawn == 'Спавн на авианосце') {
                player.spawn(new mp.Vector3(3095.786865234375, -4701.69873046875, 11.244027137756348));
                player.heading = 106.51812744140625;
            }
            else if (spawn == 'Дом') {
                let hData = houses.getHouseData(user.get(player, 'house_id'));
                player.spawn(new mp.Vector3(hData.get('x'), hData.get('y'), hData.get('z')));
                player.heading = hData.get('rot');
            }
            else if (spawn == 'Склад') {
                let hData = stocks.getData(user.get(player, 'stock_id'));
                player.spawn(new mp.Vector3(hData.get('x'), hData.get('y'), hData.get('z')));
                player.heading = hData.get('rot');
            }
            else if (spawn == 'Квартира') {
                let hData = condos.getHouseData(user.get(player, 'condo_id'));
                player.spawn(new mp.Vector3(hData.get('x'), hData.get('y'), hData.get('z')));
                player.heading = hData.get('rot');
            }
            else if (spawn == 'Яхта') {
                let hData = yachts.getHouseData(user.get(player, 'yacht_id'));
                player.spawn(new mp.Vector3(hData.get('x'), hData.get('y'), hData.get('z')));
                player.heading = hData.get('rot');
            }
            else {
                let roleId = user.get(player, 'role') - 1;
                player.spawn(new mp.Vector3(enums.spawnByRole[roleId][0], enums.spawnByRole[roleId][1], enums.spawnByRole[roleId][2]));
                player.heading = enums.spawnByRole[roleId][3];
            }
        }
        catch (e) {
            methods.debug(e);

            try {
                let roleId = user.get(player, 'role') - 1;
                player.spawn(new mp.Vector3(enums.spawnByRole[roleId][0], enums.spawnByRole[roleId][1], enums.spawnByRole[roleId][2]));
                player.heading = enums.spawnByRole[roleId][3];
            }
            catch (e) {
                
            }
        }

        setTimeout(function () {
            try {
                if (user.isLogin(player)) {
                    player.dimension = 0;
                    if (methods.distanceToPos(player.position, new mp.Vector3(405.4717712402344, -974.6879272460938, -100.00418090820312)) < 10)
                        user.spawnByName(player, spawn);
                    else
                        user.hideLoadDisplay(player);
                }
            }
            catch (e) {

            }
        }, 2000);
    }, 500);
};

user.updateClientCache = function(player) {
    if (!mp.players.exists(player))
        return;
    try {
        let skin = {};

        skin.SKIN_MOTHER_FACE = methods.parseInt(user.get(player, "SKIN_MOTHER_FACE"));
        skin.SKIN_FATHER_FACE = methods.parseInt(user.get(player, "SKIN_FATHER_FACE"));
        skin.SKIN_MOTHER_SKIN = methods.parseInt(user.get(player, "SKIN_MOTHER_SKIN"));
        skin.SKIN_FATHER_SKIN = methods.parseInt(user.get(player, "SKIN_FATHER_SKIN"));
        skin.SKIN_PARENT_FACE_MIX = user.get(player, "SKIN_PARENT_FACE_MIX");
        skin.SKIN_PARENT_SKIN_MIX = user.get(player, "SKIN_PARENT_SKIN_MIX");
        skin.SKIN_HAIR = methods.parseInt(user.get(player, "SKIN_HAIR"));
        skin.SKIN_HAIR_2 = methods.parseInt(user.get(player, "SKIN_HAIR_2"));
        skin.SKIN_HAIR_3 = methods.parseInt(user.get(player, "SKIN_HAIR_3"));
        skin.SKIN_HAIR_COLOR = methods.parseInt(user.get(player, "SKIN_HAIR_COLOR"));
        skin.SKIN_HAIR_COLOR_2 = methods.parseInt(user.get(player, "SKIN_HAIR_COLOR_2"));
        skin.SKIN_EYE_COLOR = methods.parseInt(user.get(player, "SKIN_EYE_COLOR"));
        skin.SKIN_EYEBROWS = methods.parseInt(user.get(player, "SKIN_EYEBROWS"));
        skin.SKIN_EYEBROWS_COLOR = methods.parseInt(user.get(player, "SKIN_EYEBROWS_COLOR"));
        skin.SKIN_OVERLAY_1 = methods.parseInt(user.get(player, "SKIN_OVERLAY_1"));
        skin.SKIN_OVERLAY_COLOR_1 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_1"));
        skin.SKIN_OVERLAY_2 = methods.parseInt(user.get(player, "SKIN_OVERLAY_2"));
        skin.SKIN_OVERLAY_COLOR_2 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_2"));
        skin.SKIN_OVERLAY_3 = methods.parseInt(user.get(player, "SKIN_OVERLAY_3"));
        skin.SKIN_OVERLAY_COLOR_3 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_3"));
        skin.SKIN_OVERLAY_4 = methods.parseInt(user.get(player, "SKIN_OVERLAY_4"));
        skin.SKIN_OVERLAY_COLOR_4 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_4"));
        skin.SKIN_OVERLAY_5 = methods.parseInt(user.get(player, "SKIN_OVERLAY_5"));
        skin.SKIN_OVERLAY_COLOR_5 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_5"));
        skin.SKIN_OVERLAY_6 = methods.parseInt(user.get(player, "SKIN_OVERLAY_6"));
        skin.SKIN_OVERLAY_COLOR_6 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_6"));
        skin.SKIN_OVERLAY_7 = methods.parseInt(user.get(player, "SKIN_OVERLAY_7"));
        skin.SKIN_OVERLAY_COLOR_7 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_7"));
        skin.SKIN_OVERLAY_8 = methods.parseInt(user.get(player, "SKIN_OVERLAY_8"));
        skin.SKIN_OVERLAY_COLOR_8 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_8"));
        skin.SKIN_OVERLAY_9 = methods.parseInt(user.get(player, "SKIN_OVERLAY_9"));
        skin.SKIN_OVERLAY_COLOR_9 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_9"));
        skin.SKIN_OVERLAY_10 = methods.parseInt(user.get(player, "SKIN_OVERLAY_10"));
        skin.SKIN_OVERLAY_COLOR_10 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_10"));
        skin.SKIN_OVERLAY_11 = methods.parseInt(user.get(player, "SKIN_OVERLAY_11"));
        skin.SKIN_OVERLAY_COLOR_11 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_11"));
        skin.SKIN_OVERLAY_12 = methods.parseInt(user.get(player, "SKIN_OVERLAY_12"));
        skin.SKIN_OVERLAY_COLOR_12 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_12"));
        skin.SKIN_FACE_SPECIFICATIONS = user.get(player, "SKIN_FACE_SPECIFICATIONS");
        skin.SKIN_SEX = methods.parseInt(user.get(player, "SKIN_SEX"));

        user.set(player, 'skin', JSON.stringify(skin));

        player.call('client:user:updateCache', [Array.from(Container.Data.GetAll(player.id))]);
        methods.debug('user.updateClientCache');
    }
    catch (e) {
        methods.debug(e);
    }
};

user.updateCharacterFace = function(player) {

    methods.debug('user.updateCharacterFace');
    if (!mp.players.exists(player))
        return;
    try {
        let skin = {};

        skin.SKIN_MOTHER_FACE = methods.parseInt(user.get(player, "SKIN_MOTHER_FACE"));
        skin.SKIN_FATHER_FACE = methods.parseInt(user.get(player, "SKIN_FATHER_FACE"));
        skin.SKIN_MOTHER_SKIN = methods.parseInt(user.get(player, "SKIN_MOTHER_SKIN"));
        skin.SKIN_FATHER_SKIN = methods.parseInt(user.get(player, "SKIN_FATHER_SKIN"));
        skin.SKIN_PARENT_FACE_MIX = user.get(player, "SKIN_PARENT_FACE_MIX");
        skin.SKIN_PARENT_SKIN_MIX = user.get(player, "SKIN_PARENT_SKIN_MIX");
        skin.SKIN_HAIR = methods.parseInt(user.get(player, "SKIN_HAIR"));
        skin.SKIN_HAIR_2 = methods.parseInt(user.get(player, "SKIN_HAIR_2"));
        skin.SKIN_HAIR_3 = methods.parseInt(user.get(player, "SKIN_HAIR_3"));
        skin.SKIN_HAIR_COLOR = methods.parseInt(user.get(player, "SKIN_HAIR_COLOR"));
        skin.SKIN_HAIR_COLOR_2 = methods.parseInt(user.get(player, "SKIN_HAIR_COLOR_2"));
        skin.SKIN_EYE_COLOR = methods.parseInt(user.get(player, "SKIN_EYE_COLOR"));
        skin.SKIN_EYEBROWS = methods.parseInt(user.get(player, "SKIN_EYEBROWS"));
        skin.SKIN_EYEBROWS_COLOR = methods.parseInt(user.get(player, "SKIN_EYEBROWS_COLOR"));
        skin.SKIN_OVERLAY_1 = methods.parseInt(user.get(player, "SKIN_OVERLAY_1"));
        skin.SKIN_OVERLAY_COLOR_1 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_1"));
        skin.SKIN_OVERLAY_2 = methods.parseInt(user.get(player, "SKIN_OVERLAY_2"));
        skin.SKIN_OVERLAY_COLOR_2 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_2"));
        skin.SKIN_OVERLAY_3 = methods.parseInt(user.get(player, "SKIN_OVERLAY_3"));
        skin.SKIN_OVERLAY_COLOR_3 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_3"));
        skin.SKIN_OVERLAY_4 = methods.parseInt(user.get(player, "SKIN_OVERLAY_4"));
        skin.SKIN_OVERLAY_COLOR_4 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_4"));
        skin.SKIN_OVERLAY_5 = methods.parseInt(user.get(player, "SKIN_OVERLAY_5"));
        skin.SKIN_OVERLAY_COLOR_5 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_5"));
        skin.SKIN_OVERLAY_6 = methods.parseInt(user.get(player, "SKIN_OVERLAY_6"));
        skin.SKIN_OVERLAY_COLOR_6 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_6"));
        skin.SKIN_OVERLAY_7 = methods.parseInt(user.get(player, "SKIN_OVERLAY_7"));
        skin.SKIN_OVERLAY_COLOR_7 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_7"));
        skin.SKIN_OVERLAY_8 = methods.parseInt(user.get(player, "SKIN_OVERLAY_8"));
        skin.SKIN_OVERLAY_COLOR_8 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_8"));
        skin.SKIN_OVERLAY_9 = methods.parseInt(user.get(player, "SKIN_OVERLAY_9"));
        skin.SKIN_OVERLAY_COLOR_9 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_9"));
        skin.SKIN_OVERLAY_10 = methods.parseInt(user.get(player, "SKIN_OVERLAY_10"));
        skin.SKIN_OVERLAY_COLOR_10 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_10"));
        skin.SKIN_OVERLAY_11 = methods.parseInt(user.get(player, "SKIN_OVERLAY_11"));
        skin.SKIN_OVERLAY_COLOR_11 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_11"));
        skin.SKIN_OVERLAY_12 = methods.parseInt(user.get(player, "SKIN_OVERLAY_12"));
        skin.SKIN_OVERLAY_COLOR_12 = methods.parseInt(user.get(player, "SKIN_OVERLAY_COLOR_12"));
        skin.SKIN_FACE_SPECIFICATIONS = user.get(player, "SKIN_FACE_SPECIFICATIONS");
        skin.SKIN_SEX = methods.parseInt(user.get(player, "SKIN_SEX"));

        if (user.getSex(player) !== skin.SKIN_SEX) {
            if (skin.SKIN_SEX === 1)
                player.model =  mp.joaat('mp_f_freemode_01');
            else
                player.model =  mp.joaat('mp_m_freemode_01');
        }

        if (skin.SKIN_MOTHER_FACE === 0 && skin.SKIN_FATHER_FACE === 0 && skin.SKIN_MOTHER_SKIN === 0 && skin.SKIN_FATHER_SKIN === 0 && skin.SKIN_HAIR === 0 && skin.SKIN_SEX === 0) {
            if (!user.has(player, 'hasLoaded')) {
                user.loadUserSkin(player);
                user.set(player, 'hasLoaded', true);
            }
        }

        if (user.get(player, 'mask') >= 0 && user.get(player, 'mask_color') >= 1) {
            let mask = enums.maskList[user.get(player, 'mask')];

            if (mask[10]) {
                player.setHeadBlend(
                    0,
                    0,
                    0,
                    skin.SKIN_MOTHER_SKIN,
                    skin.SKIN_FATHER_SKIN,
                    0,
                    0,
                    skin.SKIN_PARENT_SKIN_MIX,
                    0
                );

                for (let i = 0; i < 20; i++)
                    player.setFaceFeature(methods.parseInt(i), 0);
            }
            else if (mask[11]) {
                player.setHeadBlend(
                    skin.SKIN_MOTHER_FACE,
                    skin.SKIN_FATHER_FACE,
                    0,
                    skin.SKIN_MOTHER_SKIN,
                    skin.SKIN_FATHER_SKIN,
                    0,
                    skin.SKIN_PARENT_FACE_MIX,
                    skin.SKIN_PARENT_SKIN_MIX,
                    0
                );

                player.setFaceFeature(0, -1.0);
                player.setFaceFeature(1, 1.0);
                player.setFaceFeature(2, 1.0);
                player.setFaceFeature(3, 1.0);
                player.setFaceFeature(4, 1.0);
                player.setFaceFeature(9, -1.0);
                player.setFaceFeature(10, 1.0);
                player.setFaceFeature(13, -1.0);
                player.setFaceFeature(14, -1.0);
                player.setFaceFeature(15, -1.0);
                player.setFaceFeature(16, -1.0);
                player.setFaceFeature(17, -1.0);
                player.setFaceFeature(18, -1.0);
                player.setFaceFeature(19, -1.0);
            }
            else {
                player.setHeadBlend(
                    skin.SKIN_MOTHER_FACE,
                    skin.SKIN_FATHER_FACE,
                    0,
                    skin.SKIN_MOTHER_SKIN,
                    skin.SKIN_FATHER_SKIN,
                    0,
                    skin.SKIN_PARENT_FACE_MIX,
                    skin.SKIN_PARENT_SKIN_MIX,
                    0
                );

                if (skin.SKIN_FACE_SPECIFICATIONS) {
                    try {
                        JSON.parse(skin.SKIN_FACE_SPECIFICATIONS).forEach((item, i) => {
                            try {
                                player.setFaceFeature(methods.parseInt(i), methods.parseFloat(item));
                            }
                            catch (e) {
                                methods.debug(e);
                            }
                        })
                    } catch(e) {
                        methods.debug('skin.SKIN_FACE_SPECIFICATIONS', e);
                        methods.debug(skin.SKIN_FACE_SPECIFICATIONS);
                    }
                }
            }
            if (mask[6]) {
                player.setClothes(2, 0, 0, 0);
            }
            else {
                player.setClothes(2, skin.SKIN_HAIR, 0, 0);
            }
        }
        else {
            player.setHeadBlend(
                skin.SKIN_MOTHER_FACE,
                skin.SKIN_FATHER_FACE,
                0,
                skin.SKIN_MOTHER_SKIN,
                skin.SKIN_FATHER_SKIN,
                0,
                skin.SKIN_PARENT_FACE_MIX,
                skin.SKIN_PARENT_SKIN_MIX,
                0
            );
            player.setClothes(2, skin.SKIN_HAIR, 0, 0);

            if (skin.SKIN_FACE_SPECIFICATIONS) {
                try {
                    JSON.parse(skin.SKIN_FACE_SPECIFICATIONS).forEach((item, i) => {
                        try {
                            player.setFaceFeature(methods.parseInt(i), methods.parseFloat(item));
                        }
                        catch (e) {
                            methods.debug(e);
                        }
                    })
                } catch(e) {
                    methods.debug('skin.SKIN_FACE_SPECIFICATIONS', e);
                    methods.debug(skin.SKIN_FACE_SPECIFICATIONS);
                }
            }
        }

        player.setHairColor(skin.SKIN_HAIR_COLOR, skin.SKIN_HAIR_COLOR_2);
        player.setHeadOverlay(2, [skin.SKIN_EYEBROWS, 1, skin.SKIN_EYEBROWS_COLOR, 0]);
        player.eyeColor = skin.SKIN_EYE_COLOR;

        user.updateTattoo(player);

        if (user.get(player, 'age') > 72)
            player.setHeadOverlay(3, [14, 1, 1, 1]);
        else if (user.get(player, 'age') > 69)
            player.setHeadOverlay(3, [16, 1, 1, 1]);
        else if (user.get(player, 'age') > 66)
            player.setHeadOverlay(3, [12, 1, 1, 1]);
        else if (user.get(player, 'age') > 63)
            player.setHeadOverlay(3, [11, 0.9, 1, 1]);
        else if (user.get(player, 'age') > 60)
            player.setHeadOverlay(3, [10, 0.9, 1, 1]);
        else if (user.get(player, 'age') > 57)
            player.setHeadOverlay(3, [9, 0.9, 1, 1]);
        else if (user.get(player, 'age') > 54)
            player.setHeadOverlay(3, [8, 0.8, 1, 1]);
        else if (user.get(player, 'age') > 51)
            player.setHeadOverlay(3, [7, 0.7, 1, 1]);
        else if (user.get(player, 'age') > 48)
            player.setHeadOverlay(3, [6, 0.6, 1, 1]);
        else if (user.get(player, 'age') > 45)
            player.setHeadOverlay(3, [5, 0.5, 1, 1]);
        else if (user.get(player, 'age') > 42)
            player.setHeadOverlay(3, [4, 0.4, 1, 1]);
        else if (user.get(player, 'age') > 39)
            player.setHeadOverlay(3, [4, 0.4, 1, 1]);
        else if (user.get(player, 'age') > 36)
            player.setHeadOverlay(3, [3, 0.3, 1, 1]);
        else if (user.get(player, 'age') > 33)
            player.setHeadOverlay(3, [1, 0.2, 1, 1]);
        else if (user.get(player, 'age') > 30)
            player.setHeadOverlay(3, [0, 0.1, 1, 1]);

        if (skin.SKIN_OVERLAY_9 != -1 && skin.SKIN_OVERLAY_9 != undefined)
            player.setHeadOverlay(9, [skin.SKIN_OVERLAY_9, 1, skin.SKIN_OVERLAY_COLOR_9, skin.SKIN_OVERLAY_COLOR_9]);

        if (skin.SKIN_SEX == 0) {
            if (skin.SKIN_OVERLAY_10 != undefined)
                player.setHeadOverlay(10, [skin.SKIN_OVERLAY_10, 1, skin.SKIN_OVERLAY_COLOR_10, skin.SKIN_OVERLAY_COLOR_10]);
            if (skin.SKIN_OVERLAY_1 != undefined)
                player.setHeadOverlay(1, [skin.SKIN_OVERLAY_1, 1, skin.SKIN_OVERLAY_COLOR_1, 0]);
        }

        if (skin.SKIN_OVERLAY_4 != undefined)
            player.setHeadOverlay(4, [skin.SKIN_OVERLAY_4, 1, skin.SKIN_OVERLAY_COLOR_4, skin.SKIN_OVERLAY_COLOR_4]);
        if (skin.SKIN_OVERLAY_5 != undefined)
            player.setHeadOverlay(5, [skin.SKIN_OVERLAY_5, 1, skin.SKIN_OVERLAY_COLOR_5, skin.SKIN_OVERLAY_COLOR_5]);
        if (skin.SKIN_OVERLAY_8 != undefined)
            player.setHeadOverlay(8, [skin.SKIN_OVERLAY_8, 1, skin.SKIN_OVERLAY_COLOR_8, skin.SKIN_OVERLAY_COLOR_8]);


    } catch (e) {
        methods.debug('Exception: user.updateCharacterFace');
        methods.debug(e);
        setTimeout(function () {
            user.updateCharacterFace(player);
        }, 2500);
    }
};

user.getSex = function(player) {
    if (!mp.players.exists(player))
        return -1;
    if (player.model === mp.joaat('mp_f_freemode_01'))
        return 1;
    else if (player.model === mp.joaat('mp_m_freemode_01'))
        return 0;
    else
        return -1;
};

user.updateCharacterCloth = function(player) {

    methods.debug('user.updateCharacterCloth');
    if (!mp.players.exists(player))
        return;
    try {

        let cloth_data = {};

        cloth_data.torso = user.get(player, 'torso');
        cloth_data.torso_color = user.get(player, 'torso_color');
        cloth_data.gloves = user.get(player, 'gloves');
        cloth_data.gloves_color = user.get(player, 'gloves_color');
        cloth_data.leg = user.get(player, 'leg');
        cloth_data.leg_color = user.get(player, 'leg_color');
        cloth_data.hand = user.get(player, 'hand');
        cloth_data.hand_color = user.get(player, 'hand_color');
        cloth_data.foot = user.get(player, 'foot');
        cloth_data.foot_color = user.get(player, 'foot_color');
        cloth_data.accessorie = user.get(player, 'accessorie');
        cloth_data.accessorie_color = user.get(player, 'accessorie_color');
        cloth_data.parachute = user.get(player, 'parachute');
        cloth_data.parachute_color = user.get(player, 'parachute_color');
        cloth_data.armor = user.get(player, 'armor');
        cloth_data.armor_color = user.get(player, 'armor_color');
        cloth_data.decal = user.get(player, 'decal');
        cloth_data.decal_color = user.get(player, 'decal_color');
        cloth_data.body = user.get(player, 'body');
        cloth_data.body_color = user.get(player, 'body_color');
        cloth_data.mask = user.get(player, 'mask');
        cloth_data.mask_color = user.get(player, 'mask_color');
        cloth_data.hat = user.get(player, 'hat');
        cloth_data.hat_color = user.get(player, 'hat_color');
        cloth_data.glasses = user.get(player, 'glasses');
        cloth_data.glasses_color = user.get(player, 'glasses_color');
        cloth_data.ear = user.get(player, 'ear');
        cloth_data.ear_color = user.get(player, 'ear_color');
        cloth_data.watch = user.get(player, 'watch');
        cloth_data.watch_color = user.get(player, 'watch_color');
        cloth_data.bracelet = user.get(player, 'bracelet');
        cloth_data.bracelet_color = user.get(player, 'bracelet_color');

        /*if (Container.Data.Has(player.id, 'hasBuyMask')) {
            user.setComponentVariation(player, 1, cloth_data['mask'], cloth_data['mask_color'], 2);
        }*/

        user.setComponentVariation(player, 1, 0, 0, 2);

        if (!user.hasById(user.getId(player), 'uniform')) {
            user.setComponentVariation(player, 4, cloth_data['leg'], cloth_data['leg_color'], 2);
            user.setComponentVariation(player, 5, cloth_data['hand'], cloth_data['hand_color'], 2);
            user.setComponentVariation(player, 6, cloth_data['foot'], cloth_data['foot_color'], 2);
            user.setComponentVariation(player, 7, cloth_data['accessorie'], cloth_data['accessorie_color'], 2);
            user.setComponentVariation(player, 8, cloth_data['parachute'], cloth_data['parachute_color'], 2);
            if (cloth_data['parachute_color'] !== 170 &&
                cloth_data['parachute_color'] !== 172 &&
                cloth_data['parachute_color'] !== 207 &&
                cloth_data['parachute_color'] !== 210
            )
                user.setComponentVariation(player, 9, cloth_data['armor'], cloth_data['armor_color'], 2);
            user.setComponentVariation(player, 10, cloth_data['decal'], cloth_data['decal_color'], 2);
            user.setComponentVariation(player, 11, cloth_data['body'], cloth_data['body_color'], 2);

            if (cloth_data['gloves'] > 0) {
                let glovesOffset = user.getGlovesOffset(player, cloth_data['torso']);
                if (glovesOffset >= 0)
                    user.setComponentVariation(player, 3, cloth_data['gloves'] + glovesOffset, cloth_data['gloves_color'], 2);
            }
            else
                user.setComponentVariation(player, 3, cloth_data['torso'], cloth_data['torso_color'], 2);
        }

        setTimeout(function () {
            if (!mp.players.exists(player))
                return;

            //TODO GET CURRENT
            if (cloth_data['watch'] >= 0) {
                user.setProp(player, 6, cloth_data['watch'], cloth_data['watch_color']);
            }
            if (cloth_data['bracelet'] >= 0) {
                user.setProp(player, 7, cloth_data['bracelet'], cloth_data['bracelet_color']);
            }

            if (user.get(player, 'mask') >= 0 && user.get(player, 'mask_color') >= 1) {
                try {
                    let mask = enums.maskList[user.get(player, 'mask')];

                    user.setComponentVariation(player, 1, mask[2], mask[3]);

                    if (cloth_data['hat'] >= 0 && !mask[8]) {
                        user.setProp(player, 0, cloth_data['hat'], cloth_data['hat_color']);
                    }
                    if (cloth_data['glasses'] >= 0 && !mask[7]) {
                        user.setProp(player, 1, cloth_data['glasses'], cloth_data['glasses_color']);
                    }
                    if (cloth_data['ear'] >= 0 && !mask[9]) {
                        user.setProp(player, 2, cloth_data['ear'], cloth_data['ear_color']);
                    }
                }
                catch (e) {
                    
                }
            }
            else {
                if (cloth_data['hat'] >= 0) {
                    user.setProp(player, 0, cloth_data['hat'], cloth_data['hat_color']);
                }
                if (cloth_data['glasses'] >= 0) {
                    user.setProp(player, 1, cloth_data['glasses'], cloth_data['glasses_color']);
                }
                if (cloth_data['ear'] >= 0) {
                    user.setProp(player, 2, cloth_data['ear'], cloth_data['ear_color']);
                }
            }

            try {
                if (user.hasById(user.getId(player), 'uniform'))
                    user.giveUniform(player, user.get(player, 'uniform'));
            }
            catch (e) {}
        }, 10); //TODO

        user.updateTattoo(player);
        user.clearAllProp(player); //TODO переделать

    } catch (e) {
        methods.debug(e);
    }
};

user.updateCharacterProps = function(player) {

    methods.debug('user.updateCharacterProps');
    if (!mp.players.exists(player))
        return;
    try {

        let cloth_data = {};

        cloth_data.torso = user.get(player, 'torso');
        cloth_data.torso_color = user.get(player, 'torso_color');
        cloth_data.gloves = user.get(player, 'gloves');
        cloth_data.gloves_color = user.get(player, 'gloves_color');
        cloth_data.leg = user.get(player, 'leg');
        cloth_data.leg_color = user.get(player, 'leg_color');
        cloth_data.hand = user.get(player, 'hand');
        cloth_data.hand_color = user.get(player, 'hand_color');
        cloth_data.foot = user.get(player, 'foot');
        cloth_data.foot_color = user.get(player, 'foot_color');
        cloth_data.accessorie = user.get(player, 'accessorie');
        cloth_data.accessorie_color = user.get(player, 'accessorie_color');
        cloth_data.parachute = user.get(player, 'parachute');
        cloth_data.parachute_color = user.get(player, 'parachute_color');
        cloth_data.armor = user.get(player, 'armor');
        cloth_data.armor_color = user.get(player, 'armor_color');
        cloth_data.decal = user.get(player, 'decal');
        cloth_data.decal_color = user.get(player, 'decal_color');
        cloth_data.body = user.get(player, 'body');
        cloth_data.body_color = user.get(player, 'body_color');
        cloth_data.mask = user.get(player, 'mask');
        cloth_data.mask_color = user.get(player, 'mask_color');
        cloth_data.hat = user.get(player, 'hat');
        cloth_data.hat_color = user.get(player, 'hat_color');
        cloth_data.glasses = user.get(player, 'glasses');
        cloth_data.glasses_color = user.get(player, 'glasses_color');
        cloth_data.ear = user.get(player, 'ear');
        cloth_data.ear_color = user.get(player, 'ear_color');
        cloth_data.watch = user.get(player, 'watch');
        cloth_data.watch_color = user.get(player, 'watch_color');
        cloth_data.bracelet = user.get(player, 'bracelet');
        cloth_data.bracelet_color = user.get(player, 'bracelet_color');

        //TODO GET CURRENT
        if (cloth_data['watch'] >= 0) {
            user.setProp(player, 6, cloth_data['watch'], cloth_data['watch_color']);
        }
        if (cloth_data['bracelet'] >= 0) {
            user.setProp(player, 7, cloth_data['bracelet'], cloth_data['bracelet_color']);
        }

        if (user.get(player, 'mask') >= 0 && user.get(player, 'mask_color') >= 1) {
            try {
                let mask = enums.maskList[user.get(player, 'mask')];

                user.setComponentVariation(player, 1, mask[2], mask[3]);

                if (cloth_data['hat'] >= 0 && !mask[8]) {
                    user.setProp(player, 0, cloth_data['hat'], cloth_data['hat_color']);
                }
                if (cloth_data['glasses'] >= 0 && !mask[7]) {
                    user.setProp(player, 1, cloth_data['glasses'], cloth_data['glasses_color']);
                }
                if (cloth_data['ear'] >= 0 && !mask[9]) {
                    user.setProp(player, 2, cloth_data['ear'], cloth_data['ear_color']);
                }
            }
            catch (e) {

            }
        }
        else {
            if (cloth_data['hat'] >= 0) {
                user.setProp(player, 0, cloth_data['hat'], cloth_data['hat_color']);
            }
            if (cloth_data['glasses'] >= 0) {
                user.setProp(player, 1, cloth_data['glasses'], cloth_data['glasses_color']);
            }
            if (cloth_data['ear'] >= 0) {
                user.setProp(player, 2, cloth_data['ear'], cloth_data['ear_color']);
            }
        }
    } catch (e) {
        methods.debug(e);
    }
};

user.updateTattoo = function(player) {
    methods.debug('user.updateTattoo');
    if (!user.isLogin(player))
        return;

    try {
        user.clearDecorations(player);
        let tattooList = JSON.parse(user.get(player, 'tattoo'));

        if (tattooList != null) {
            try {
                tattooList.forEach(function (item) {
                    if (user.get(player, 'tprint_c') != "" && item[2] == 'ZONE_TORSO')
                        return;
                    user.setDecoration(player, item[0], item[1]);
                });
            }
            catch (e) {
                methods.debug(e);
            }
        }

        if (user.get(player, "SKIN_HAIR_2")) {
            let data = enums.hairOverlays[methods.parseInt(user.get(player, "SKIN_SEX"))][user.get(player, "SKIN_HAIR")];
            user.setDecoration(player, data[0], data[1]);
        }
        let data = enums.hairOverlays[methods.parseInt(user.get(player, "SKIN_SEX"))][methods.parseInt(user.get(player, "SKIN_HAIR_3"))];
        user.setDecoration(player, data[0], data[1]);

        if (user.get(player, 'body') == player.getVariable('topsDraw')) {
            if (user.hasById(user.getId(player), 'uniform'))
                return;
            if (user.get(player, 'tprint_c') != "" && user.get(player, 'tprint_o') != "")
                user.setDecoration(player, user.get(player, 'tprint_c'), user.get(player, 'tprint_o'));
        }
    }
    catch (e) {
        methods.debug('user.updateTattooServ', e);
    }
};

user.validateUser = function(name, callback) {
    methods.debug('user.validateUser', name);
    mysql.executeQuery(`SELECT * FROM users WHERE name = ? LIMIT 1`, name, function (err, rows, fields) {
        if (err) {
            methods.debug('[DATABASE | ERROR]');
            methods.debug(err);
            return callback(false);
        }

        if (rows.length === 0)
            return callback(false);
        return callback(true);
    });
};

user.doesExistUser = function(name, callback) {
    methods.debug('user.doesExistUser');
    name = methods.removeQuotes(name);
    mysql.executeQuery(`SELECT id FROM users WHERE name = '${name}' LIMIT 1`, function (err, rows, fields) {
        if (err) {
            methods.debug('[DATABASE | ERROR]');
            methods.debug(err);
            return callback(true);
        }

        if (rows.length === 0)
            return callback(false);
        return callback(true);
    });
};

user.doesLimitUser = function(serial, callback) {
    methods.debug('user.doesLimitUser');
    mysql.executeQuery(`SELECT id FROM users WHERE social = ?`, serial, function (err, rows, fields) {
        if (err) {
            methods.debug('[DATABASE | ERROR]');
            methods.debug(err);
            return callback(true);
        }

        if (rows.length < 3)
            return callback(false);
        else
            return callback(true);
    });
};

user.validateAccount = function(player, login, pass, callback) {
    methods.debug('user.validateAccount', login);
    mysql.executeQuery(`SELECT password, social, login FROM accounts WHERE login = ? LIMIT 1`, login, function (err, rows, fields) {
        if (err) {
            methods.debug('[DATABASE | ERROR]');
            methods.debug(err);
            return callback(false);
        }

        if (rows.length === 0)
            return callback(false);
        rows.forEach(function(item) {
            if (item.password !== methods.sha256(pass))
                return callback(false);
            if (mp.players.exists(player)) {
                player.accSocial = item['social'];
                player.setVariable('a_l', item['login']);
                player.setVariable('a_p', item['password']);
            }
            return callback(true);
        });
    });
};

user.doesExistAccount = function(login, email, social, callback) {
    methods.debug('user.doesExistAccount');
    login = methods.removeQuotes(login);
    email = methods.removeQuotes(email);
    social = methods.removeQuotes(social);
    mysql.executeQuery(`SELECT login, email, social FROM accounts WHERE login = '${login}' OR email = '${email}' OR social = '${social}' LIMIT 1`, function (err, rows, fields) {
        if (err) {
            methods.debug('[DATABASE | ERROR]');
            methods.debug(err);
            return callback(1);
        }

        if (rows.length === 0)
            return callback(0);
        else if (login == rows[0].login)
            return callback(2);
        else if (email == rows[0].email)
            return callback(3);
        return callback(1);
    });
};

user.setOnlineStatus = function(player, isOnline) {
    methods.debug('user.setOnlineStatus');
    if (user.isLogin(player))
        mysql.executeQuery('UPDATE users SET is_online=\'' + methods.parseInt(isOnline) + '\' WHERE id = \'' + user.getId(player) + '\'');
};

user.clearAllProp = function(player) {
    methods.debug('user.clearAllProp');
    if (!mp.players.exists(player))
        return false;

    for (let i = 0; i < 8; i++)
        user.setProp(player, i, -1, -1);

    let pos = player.position;
    mp.players.forEach((p) => {
        if (methods.distanceToPos(pos, p.position) < 300)
            p.call('client:user:clearAllProp', [player.id]);
    });
    //mp.players.call('client:user:clearAllProp', [player.id]);
};

user.getGlovesOffset = function(player, handId) {
    if (user.isLogin(player)) {
        if (user.getSex(player) === 1) {
            switch (handId) {
                case 0:
                case 2:
                case 14:
                case 6:
                    return 2;
                case 1:
                    return 1;
                case 3:
                    return 3;
                case 5:
                    return 0;
                case 7:
                    return 7;
                /*case 4:
                    return 10;*/
                case 15:
                    return 12;
                case 11:
                case 4:
                    return 4;
                case 9:
                    return 8;
            }
        }
        else {
            switch (handId) {
                case 0:
                    return 0;
                case 2:
                    return 2;
                case 5:
                    return 4;
                case 1:
                case 4:
                case 6:
                case 12:
                case 14:
                    return 5;
                case 8:
                    return 6;
                case 11:
                    return 7;
                case 15:
                    return 10;
            }
        }
    }
    return -1;
};

user.setComponentVariation = function(player, component, drawableId, textureId) {
    methods.debug('user.setComponentVariation', component, drawableId, textureId);
    if (!mp.players.exists(player))
        return false;
    component = methods.parseInt(component);
    drawableId = methods.parseInt(drawableId);
    textureId = methods.parseInt(textureId);

    if (component == 8 && drawableId == -1 && textureId == 240) {
        textureId = -1;
        drawableId = 0;
    }

    if (component == 11) {
        let pos = player.position;

        if (player.getVariable('topsDraw') !== drawableId || player.getVariable('topsColor') !== textureId) {
            mp.players.forEach((p) => {
                try {
                    if (methods.distanceToPos(pos, p.position) < 300)
                        p.call('client:syncComponentVariation', [player.id, component, drawableId, textureId])
                }
                catch (e) {
                    methods.debug(e);
                }
            });
        }

        if (player.getVariable('topsDraw') !== drawableId)
            player.setVariable('topsDraw', drawableId);

        if (player.getVariable('topsColor') !== textureId)
            player.setVariable('topsColor', textureId);
    }
    else {
        let clothes = player.getClothes(component);
        if (clothes.drawable !== drawableId || clothes.texture !== textureId)
            player.setClothes(component, drawableId, textureId, 2);
    }
    //player.call('client:user:setComponentVariation', [component, drawableId, textureId]);
};

user.setProp = function(player, slot, type, color) {
    methods.debug('user.setProp');
    if (!mp.players.exists(player))
        return false;

    slot = methods.parseInt(slot);
    type = methods.parseInt(type);
    color = methods.parseInt(color);

    if (player.getVariable('propType' + slot) !== type || player.getVariable('propColor' + slot) !== color)
        player.setProp(slot, type, color);

    if (player.getVariable('propType' + slot) !== type)
        player.setVariable('propType' + slot, type);

    if (player.getVariable('propColor' + slot) !== color)
        player.setVariable('propColor' + slot, color);
};

user.clearDecorations = function(player) {
    methods.debug('user.clearDecorations');
    if (!mp.players.exists(player))
        return false;
    player.clearDecorations();
};

user.setDecoration = function(player, slot, overlay) {
    methods.debug('user.setDecoration');
    if (!mp.players.exists(player))
        return false;
    player.setDecoration(mp.joaat(slot), mp.joaat(overlay));
};

user.hideLoadDisplay = function(player) {
    methods.debug('user.hideLoadDisplay');
    if (!mp.players.exists(player))
        return false;
    player.call('client:user:hideLoadDisplay');
};

user.showLoadDisplay = function(player) {
    methods.debug('user.showLoadDisplay');
    if (!mp.players.exists(player))
        return false;
    player.call('client:user:showLoadDisplay');
};

user.addExplode = function(player, x, y, z, explosionType, damageScale, isAudible, isInvisible, cameraShake, timeout = 1) {
    setTimeout(function () {
        if (!mp.players.exists(player))
            return false;

        player.call('client:user:addExplode', [x, y, z, explosionType, damageScale, isAudible, isInvisible, cameraShake]);
    }, timeout);
    //seval player.call('client:user:addExplode', [player.position.x, player.position.y, player.position.z, 20, 0.3, true, false, 0]);
};

user.removeWaypoint = function(player) {
    methods.debug('user.removeWaypoint');
    if (!mp.players.exists(player))
        return false;
    user.setWaypoint(player.position.x, player.position.y);
};

user.setWaypoint = function(player, x, y) {
    methods.debug('user.setWaypoint');
    if (!mp.players.exists(player))
        return false;
    player.call('client:user:setWaypoint', [x, y]);
};

user.callCef = function(player, name, params) {
    methods.debug('user.callCef', name);
    if (!mp.players.exists(player))
        return false;
    player.call('client:user:callCef', [name, params]);
};

user.cuff = function(player) {
    methods.debug('user.cuff');
    if (!mp.players.exists(player))
        return false;
    user.stopAnimation(player);
    player.setVariable("isCuff", true);
    setTimeout(function () {
        try {
            user.playAnimation(player, "mp_arresting", "idle", 49);
            player.call("client:handcuffs", [true]);
            player.setVariable("isBlockAnimation", true);
        }
        catch (e) {
            
        }
    }, 500);
};

user.unCuff = function(player) {
    if (!mp.players.exists(player))
        return false;
    methods.debug('user.unCuff');
    player.call("client:handcuffs", [false]);
    player.setVariable("isBlockAnimation", false);
    player.setVariable("isCuff", false);
};

user.isCuff = function(player) {
    if (!user.isLogin(player))
        return false;
    methods.debug('user.isCuff');
    return player.getVariable("isCuff") === true;
};

user.tie = function(player) {
    methods.debug('user.tie');
    if (!mp.players.exists(player))
        return false;
    user.playAnimation("mp_arresting", "idle", 49);
    player.call("client:handcuffs", [true]);
    player.setVariable("isBlockAnimation", true);
    player.setVariable("isTie", true);
    player.notify("~r~Вас связали");
};

user.unTie = function(player) {
    methods.debug('user.unTie');
    if (!mp.players.exists(player))
        return false;
    player.call("client:handcuffs", [false]);
    player.setVariable("isBlockAnimation", false);
    player.setVariable("isTie", false);
};

user.isTie = function(player) {
    if (!user.isLogin(player))
        return false;
    methods.debug('user.isTie');
    return player.getVariable("isTie") === true;
};

user.isLogin = function(player) {
    if (!mp.players.exists(player))
        return false;
    return user.has(player, 'id');
};

user.getRegStatusName = function(player) {
    if (!user.isLogin(player))
        return false;
    switch (user.get(player, 'reg_status'))
    {
        case 1:
            return "Регистрация";
        case 2:
            return "Гражданство США";
        default:
            return "Нет";
    }
};

user.getRepName = function(player) {
    if (!user.isLogin(player))
        return 'Нейтральная';
    let rep = user.get(player, 'rep');
    if (rep > 900)
        return 'Идеальная';
    if (rep > 800 && rep <= 900)
        return 'Очень хорошая';
    if (rep > 700 && rep <= 800)
        return 'Хорошая';
    if (rep > 600 && rep <= 700)
        return 'Положительная';
    if (rep >= 400 && rep <= 600)
        return 'Нейтральная';
    if (rep >= 300 && rep < 400)
        return 'Отрицательная';
    if (rep >= 200 && rep < 300)
        return 'Плохая';
    if (rep >= 100 && rep < 200)
        return 'Очень плохая';
    if (rep < 100)
        return 'Наихудшая';
};

user.getRepColorName = function(player) {
    if (!user.isLogin(player))
        return 'Нейтральная';
    let rep = user.get(player, 'rep');
    if (rep > 900)
        return '~b~Идеальная';
    if (rep > 800 && rep <= 900)
        return '~g~Очень хорошая';
    if (rep > 700 && rep <= 800)
        return '~g~Хорошая';
    if (rep > 600 && rep <= 700)
        return '~g~Положительная';
    if (rep >= 400 && rep <= 600)
        return 'Нейтральная';
    if (rep >= 300 && rep < 400)
        return '~y~Отрицательная';
    if (rep >= 200 && rep < 300)
        return '~o~Плохая';
    if (rep >= 100 && rep < 200)
        return '~o~Очень плохая';
    if (rep < 100)
        return '~r~Наихудшая';
};

user.getJobName = function(player) {
    if (!user.isLogin(player))
        return 'Отсуствует';
    try {
        return enums.jobList[user.get(player, 'job')][0];
    }catch (e) {
    }
    return 'Отсуствует';
};

user.getFractionName = function(player) {
    try {
        if (!user.isLogin(player))
            return 'Отсуствует';
        return enums.fractionListId[user.get(player, 'fraction_id')].fractionNameShort;
    }
    catch (e) {
        methods.debug(e);
    }
    return 'Отсуствует';
};

user.getFractionName2 = function(player) {
    try {
        if (!user.isLogin(player))
            return 'Отсуствует';
        return fraction.getName(user.get(player, 'fraction_id2'));
    }
    catch (e) {
        methods.debug(e);
    }
    return 'Отсуствует';
};

user.getFamilyName = function(player) {
    try {
        if (!user.isLogin(player))
            return 'Отсуствует';
        return family.getName(user.get(player, 'family_id'));
    }
    catch (e) {
        methods.debug(e);
    }
    return 'Отсуствует';
};

user.getDepartmentName = function(player) {
    try {
        if (!user.isLogin(player))
            return 'Отсуствует';
        if (user.get(player, 'is_leader'))
            return 'Руководство';
        else if (user.get(player, 'is_sub_leader'))
            return 'Руководство';
        return enums.fractionListId[user.get(player, 'fraction_id')].departmentList[user.get(player, 'rank_type')];
    }
    catch (e) {
        methods.debug(e);
    }
    return 'Отсуствует';
};

user.getRankName = function(player) {
    try {
        if (!user.isLogin(player))
            return 'Отсуствует';
        if (user.get(player, 'is_leader'))
            return enums.fractionListId[user.get(player, 'fraction_id')].leaderName;
        else if (user.get(player, 'is_sub_leader'))
            return enums.fractionListId[user.get(player, 'fraction_id')].subLeaderName;
        return enums.fractionListId[user.get(player, 'fraction_id')].rankList[user.get(player, 'rank_type')][user.get(player, 'rank')];
    }
    catch (e) {
        methods.debug(e);
    }
    return 'Отсуствует';
};

user.getFractionHash = function(player) {
    try {
        if (!user.isLogin(player))
            return 'none';
        return enums.fractionListId[user.get(player, 'fraction_id')].hash;
    }
    catch (e) {
        methods.debug(e);
    }
    return 'none';
};

user.getSexName = function(player) {
    if (!user.isLogin(player))
        return false;
    return user.getSex(player) == 1 ? 'Женский' : 'Мужской';
};

user.ready = function(player) {
    if (!mp.players.exists(player))
        return false;
    try {
        weather.setPlayerCurrentWeather(player);
        user.updateVehicleInfo(player);

        if (ctos.isBlackout())
            player.call('client:ctos:setBlackout', [true]);
        if (ctos.isDisableNetwork())
            player.call('client:ctos:setNoNetwork', [true]);

        player.dimension = player.id + 1;
        try {
            user.resetAll(player);
        }
        catch (e) {
            methods.debug(e);
        }
        player.call('playerReadyDone');
    }
    catch (e) {
        methods.debug('READY_ERROR', e.toString(), player.socialClub);
    }
};

user.updateVehicleInfo = function(player) {
    if (!mp.players.exists(player))
        return false;

    try {
        for (let i = 0; i < parseInt(enums.vehicleInfo.length / 250) + 1; i++) {
            let from = i * 250 - 1;
            let to = i * 250 + 249;
            player.call('client:updateVehicleInfo', [i, enums.vehicleInfo.slice(from < 0 ? 0 : from, to)]);
        }
    } catch (e) {
        methods.debug(e);
    }

    /*try {
        for (let i = 0; i < methods.parseInt(enums.vehicleInfo.length / 250) + 1; i++)
            player.call('client:updateVehicleInfo', [i, enums.vehicleInfo.slice(i * 250, i * 250 + 249)]);
    }
    catch (e) {
        methods.debug(e);
    }*/
};

/*user.updateVehicleInfo = function(player) {
    if (!mp.players.exists(player))
        return false;

    try {
        for (let i = 0; i < parseInt(enums.vehicleInfo.length / 250); i++) {
            let from = i * 250 - 1;
            let to = i * 250 + 249;
            player.call('client:updateVehicleInfo', [i, enums.vehicleInfo.slice(from < 0 ? 0 : from, to)]);
        }
    } catch (e) {
        methods.debug(e);
    }
};*/

/*
* StyleType
* 0 = Info
* 1 = Warn
* 2 = Success
* 3 = White
*
* ['top', 'topLeft', 'topCenter', 'topRight', 'center', 'centerLeft', 'centerRight', 'bottom', 'bottomLeft', 'bottomCenter', 'bottomRight'];
*
* */
user.showCustomNotify = function(player, text, style = 0, layout = 5, time = 5000) {
    methods.debug('user.showCustomNotify', text);
    if (!mp.players.exists(player))
        return;
    player.call('client:user:showCustomNotify', [text, style, layout, time]);
    //user.callCef(player, 'notify', JSON.stringify({type: style, layout: layout, text: text, time: time}))
};

user.playSound = function(player, name, ref) {
    methods.debug('user.playSound', name, ref);
    if (!mp.players.exists(player))
        return;
    player.call('client:user:playSound', [name, ref]);
};

user.setDating = function(player, key, value) {
    if (mp.players.exists(player))
        player.call('client:user:setDating', [key, value]);
};

user.setById = function(id, key, val) {
    Container.Data.Set(id, key, val);
};

user.hasById = function(id, key) {
    return Container.Data.Has(id, key);
};

user.resetById = function(id, key) {
    return Container.Data.Reset(id, key);
};

user.getById = function(id, key) {
    try {
        return Container.Data.Get(id, key);
    } catch (e) {
        methods.debug(e);
    }
    return null;
};

user.set = function(player, key, val) {
    //methods.debug('user.set');
    if (!mp.players.exists(player))
        return false;
    Container.Data.Set(player.id, key, val);
};

user.reset = function(player, key) {
    if (!mp.players.exists(player))
        return false;
    Container.Data.Reset(player.id, key);
};

user.resetAll = function(player) {
    if (!mp.players.exists(player))
        return false;
    Container.Data.ResetAll(player.id);
};

user.get = function(player, key) {
    //methods.debug('user.get');
    if (!mp.players.exists(player))
        return null;
    try {
        return Container.Data.Get(player.id, key);
    } catch (e) {
        methods.debug(e);
    }
    return null;
};

user.has = function(player, key) {
    if (!mp.players.exists(player))
        return false;
    return Container.Data.Has(player.id, key);
};

user.getId = function(player) {
    if (!mp.players.exists(player))
        return -1;
    if (player.getVariable('idLabel'))
        return methods.parseInt(player.getVariable('idLabel'));
    return -1;
};

user.getSvId = function(player) {
    if (!mp.players.exists(player))
        return -1;
    return player.id;
};

user.getRpName = function(player) {
    methods.debug('user.getRpName');
    if (!mp.players.exists(player))
        return 'NO_NAME';
    if (user.has(player, 'name'))
        return user.get(player, 'name');
    return player.socialClub;
};

user.getPlayerById = function(id) {
    let player = null;
    mp.players.forEach(pl => {
        if (user.isLogin(pl) && user.getId(pl) == id)
            player = pl;
    });
    return player;
};

user.getVehicleDriver = function(vehicle) {
    let driver = null;
    if (!mp.vehicles.exists(vehicle))
        return driver;
    vehicle.getOccupants().forEach((p) => {
        if (p.seat == -1)
            driver = p;
    });
    return driver;
};

user.getVehiclesInLspd = function(player, type = 0) {
    if (!user.isLogin(player))
        return;
    let userId = user.getId(player);
    let vehList = [];
    mp.vehicles.forEach(v => {
        if (!vehicles.exists(v))
            return;
        let containerId = v.getVariable('container');
        if (containerId != undefined && v.getVariable('user_id') === userId) {
            if (vehicles.get(containerId, 'is_cop_park') === 100000 + type || vehicles.get(containerId, 'is_cop_park') === 1 && type === 0) {
                let vInfo = methods.getVehicleInfo(v.model);
                vehList.push({id: v.id, number: v.numberPlate, name: vInfo.display_name})
            }
        }
    });
    return vehList;
};

user.addMoney = function(player, money, text = 'Финансовая операция', payType = 0) {
    if (payType === 1)
        user.addBankMoney(player, money, text);
    else
        user.addCashMoney(player, money, text);
};

user.removeMoney = function(player, money, text = 'Финансовая операция', payType = 0) {
    if (payType === 1)
        user.removeBankMoney(player, money, text);
    else
        user.removeCashMoney(player, money, text);
};

user.setMoney = function(player, money, payType = 0) {
    if (payType === 1)
        user.setBankMoney(player, money);
    else
        user.setCashMoney(player, money);
};

user.getMoney = function(player, payType = 0) {
    if (payType === 1)
        return user.getBankMoney(player);
    return user.getCashMoney(player);
};

user.addCashMoney = function(player, money, text = 'Финансовая операция') {
    user.addCashHistory(player, text, methods.parseFloat(money), user.getCashMoney(player));
    user.setCashMoney(player, user.getCashMoney(player) + methods.parseFloat(money));
};

user.removeCashMoney = function(player, money, text = 'Финансовая операция') {
    user.addCashHistory(player, text, methods.parseFloat(money) * -1, user.getCashMoney(player));
    user.setCashMoney(player, user.getCashMoney(player) - methods.parseFloat(money));
};

user.setCashMoney = function(player, money) {
    user.set(player, 'money', methods.parseFloat(money));
    user.updateClientCache(player);
};

user.getCashMoney = function(player) {
    if (user.has(player, 'money'))
        return methods.parseFloat(user.get(player, 'money'));
    return 0;
};

user.addCryptoMoney = function(player, money, text = 'Финансовая операция') {
    user.addCryptoHistory(player, text, methods.parseFloat(money), user.getCryptoMoney(player));
    user.setCryptoMoney(player, user.getCryptoMoney(player) + methods.parseFloat(money));
};

user.removeCryptoMoney = function(player, money, text = 'Финансовая операция') {
    user.addCryptoHistory(player, text, methods.parseFloat(money) * -1, user.getCryptoMoney(player));
    user.setCryptoMoney(player, user.getCryptoMoney(player) - methods.parseFloat(money));
};

user.setCryptoMoney = function(player, money) {
    user.set(player, 'money_crypto', methods.parseFloat(money));
    user.updateClientCache(player);
};

user.getCryptoMoney = function(player) {
    if (user.has(player, 'money_crypto'))
        return methods.parseFloat(user.get(player, 'money_crypto'));
    return 0;
};

user.addBankMoney = function(player, money, text = "Операция со счетом") {
    user.addBankHistory(player, text, methods.parseFloat(money), user.getBankMoney(player));
    user.setBankMoney(player, user.getBankMoney(player) + methods.parseFloat(money));
};

user.removeBankMoney = function(player, money, text = "Операция со счетом") {
    user.addBankHistory(player, text, methods.parseFloat(money) * -1, user.getBankMoney(player));
    user.setBankMoney(player, user.getBankMoney(player) - methods.parseFloat(money));
};

user.setBankMoney = function(player, money) {
    user.set(player, 'money_bank', methods.parseFloat(money));
    user.updateClientCache(player);
};

user.getBankMoney = function(player) {
    if (user.has(player, 'money_bank'))
        return methods.parseFloat(user.get(player, 'money_bank'));
    return 0;
};

user.addPayDayMoney = function(player, money) {
    user.setPayDayMoney(player, user.getPayDayMoney(player) + methods.parseFloat(money));
};

user.removePayDayMoney = function(player, money) {
    user.setPayDayMoney(player, user.getPayDayMoney(player) - methods.parseFloat(money));
};

user.setPayDayMoney = function(player, money) {
    user.set(player, 'money_payday', methods.parseFloat(money));
    user.updateClientCache(player);
};

user.getPayDayMoney = function(player) {
    if (user.has(player, 'money_payday'))
        return methods.parseFloat(user.get(player, 'money_payday'));
    return 0;
};

user.addBonusMoney = function(player, money) {
    if (user.isLogin(player)) {
        mysql.executeQuery(`UPDATE users SET money_donate = money_donate + '${money}' WHERE id = '${user.getId(player)}'`);
    }
};

user.addRep = function(player, rep) {
    user.setRep(player, user.getRep(player) + methods.parseInt(rep));
};

user.removeRep= function(player, rep) {
    user.setRep(player, user.getRep(player) - methods.parseInt(rep));
};

user.setRep = function(player, rep) {
    if (rep > 1000)
        user.set(player, 'rep', 1000);
    else if (rep < 0)
        user.set(player, 'rep', 0);
    else
        user.set(player, 'rep', methods.parseInt(rep));
    user.updateClientCache(player);
};

user.getRep = function(player) {
    if (user.has(player, 'rep'))
        return methods.parseInt(user.get(player, 'rep'));
    return 0;
};

user.addWorkExp = function(player, rep) {
    user.setWorkExp(player, user.getWorkExp(player) + methods.parseInt(rep));
};

user.removeWorkExp = function(player, rep) {
    user.setWorkExp(player, user.getWorkExp(player) - methods.parseInt(rep));
};

user.setWorkExp = function(player, rep) {
    if (rep >= user.getWorkLvl(player) * 500) {
        user.set(player, 'work_exp', 0);
        user.set(player, 'work_lvl', user.getWorkLvl(player) + 1);
        player.setVariable('work_lvl', user.getWorkLvl(player));
        try {
            let sum = user.getWorkLvl(player) * 1000;
            user.addMoney(player, sum);
            user.sendSmsBankOperation(player, 'Зачисление премии за рабочий стаж: ~g~$' + methods.numberFormat(sum));
        }
        catch (e) {
            
        }
    }
    else if (rep < 0)
        user.set(player, 'work_exp', 0);
    else
        user.set(player, 'work_exp', methods.parseInt(rep));

    if (!player.getVariable('work_lvl'))
        player.setVariable('work_lvl', user.getWorkLvl(player));

    user.updateClientCache(player);
};

user.getWorkExp = function(player) {
    if (user.has(player, 'work_exp'))
        return methods.parseInt(user.get(player, 'work_exp'));
    return 0;
};

user.achiveDoneAllById = function(player, id) {
    if (user.isLogin(player))
        player.call('client:achive:doneAllById', [id]);
};

user.achiveDoneDailyById = function(player, id) {
    if (user.isLogin(player))
        player.call('client:achive:doneDailyById', [id]);
};

user.setFractionId = function(player, id) {
    if (!user.isLogin(player))
        return;
    id = methods.parseInt(id);
    user.set(player, 'fraction_id', id);
    player.setVariable('fraction_id', id);
};

user.setFractionId2 = function(player, id) {
    if (!user.isLogin(player))
        return;
    id = methods.parseInt(id);
    user.set(player, 'fraction_id2', id);
    player.setVariable('fraction_id2', id);
};

user.setFamilyId = function(player, id) {
    if (!user.isLogin(player))
        return;
    id = methods.parseInt(id);
    user.set(player, 'family_id', id);
    player.setVariable('family_id', id);
};

user.setDatingName = function(player, value) {
    if (!user.isLogin(player))
        return;
    value = methods.removeSpecialChars(value);

    if (value.trim() === '')
        value = user.getRpName(player);

    user.set(player, 'name_dating', value);
    player.setVariable('name_dating', value);
};

user.getWorkExp = function(player) {
    if (user.has(player, 'work_exp'))
        return methods.parseInt(user.get(player, 'work_exp'));
    return 0;
};

user.getWorkLvl = function(player) {
    if (user.has(player, 'work_lvl'))
        return methods.parseInt(user.get(player, 'work_lvl'));
    return 1;
};

user.getBankCardPrefix = function(player, bankCard = 0) {
    methods.debug('bank.getBankCardPrefix');
    if (!user.isLogin(player))
        return;

    if (bankCard == 0)
        bankCard = user.get(player, 'bank_card');

    return methods.parseInt(bankCard.toString().substring(0, 4));
};

user.addBankHistory = function(player, text, price, was = 0) {
    if (!user.isLogin(player))
        return;

    let userId = user.getId(player);
    let card = user.get(player, 'bank_card');

    if (card == 0)
        return;

    text = methods.removeQuotes(text);
    price = methods.parseFloat(price);

    let rpDateTime = weather.getRpDateTime();
    let timestamp = methods.getTimeStamp();

    mysql.executeQuery(`INSERT INTO log_bank_user (user_id, card, text, price, was, timestamp, rp_datetime) VALUES ('${userId}', '${card}', '${text}', '${price}', '${was}', '${timestamp}', '${rpDateTime}')`);
};

user.addCashHistory = function(player, text, price, was = 0) {
    if (!user.isLogin(player))
        return;

    let userId = user.getId(player);

    text = methods.removeQuotes(text);
    price = methods.parseFloat(price);

    let rpDateTime = weather.getRpDateTime();
    let timestamp = methods.getTimeStamp();

    mysql.executeQuery(`INSERT INTO log_cash_user (user_id, text, price, was, timestamp, rp_datetime) VALUES ('${userId}', '${text}', '${price}', '${was}', '${timestamp}', '${rpDateTime}')`);
};

user.addCryptoHistory = function(player, text, price, was = 0) {
    if (!user.isLogin(player))
        return;

    let userId = user.getId(player);

    text = methods.removeQuotes(text);
    price = methods.parseFloat(price);

    let rpDateTime = weather.getRpDateTime();
    let timestamp = methods.getTimeStamp();

    mysql.executeQuery(`INSERT INTO log_crypto_user (user_id, text, price, was, timestamp, rp_datetime) VALUES ('${userId}', '${text}', '${was}', '${price}', '${timestamp}', '${rpDateTime}')`);
};

user.addHistory = function(player, type, reason) {

    if (!user.isLogin(player))
        return;

    let rpDateTime = weather.getRpDateTime();
    let timestamp = methods.getTimeStamp();

    mysql.executeQuery(`INSERT INTO log_player (user_id, type, do, rp_datetime, timestamp) VALUES ('${user.getId(player)}', '${type}', '${reason}', '${rpDateTime}', '${timestamp}')`);
};

user.addHistoryById = function(id, type, reason) {

    let rpDateTime = weather.getRpDateTime();
    let timestamp = methods.getTimeStamp();

    mysql.executeQuery(`INSERT INTO log_player (user_id, type, do, rp_datetime, timestamp) VALUES ('${id}', '${type}', '${reason}', '${rpDateTime}', '${timestamp}')`);
};

user.sendSms = function(player, sender, title, text, pic) {

    if (!user.isLogin(player))
        return;

    player.notifyWithPicture(sender, title, text, pic, 2);

    let time = methods.getTimeWithoutSec();
    let date = methods.getDate();
    //let rpDateTime = weather.getRpDateTime();
    let dateTime = time + ' ' + date;
    let rpDateTime = dateTime;

    return; //TODO
    mysql.executeQuery(`INSERT INTO log_player (user_id, datetime, type, do) VALUES ('${user.getId(player)}', '${rpDateTime} (( ${dateTime} ))', '${type}', '${reason}')`);
};

user.showMenu = function(player, title, desc, menuData) {
    methods.debug('user.showMenu');
    if (!mp.players.exists(player))
        return false;
    player.call('client:menuList:showMenu', [title, desc, Array.from(menuData)]);
};

user.clearChat = function(player) {
    if (!mp.players.exists(player))
        return false;
    player.call('client:clearChat');
};

user.setHealth = function(player, level) {
    if (!mp.players.exists(player))
        return false;
    if (level > 100)
        level = 100;
    player.call('client:setHealth', [level]);
};

user.setArmour = function(player, level) {
    if (!mp.players.exists(player))
        return false;
    if (level > 0)
        user.setComponentVariation(player, 9, user.get(player, "armor"), user.get(player, "armor_color"));
    player.call('client:setArmour', [level]);
};

user.setMaxSpeed = function(player, speed) {
    if (!mp.players.exists(player))
        return false;
    user.set(player, 'maxSpeed', speed);
    player.call('client:setNewMaxSpeed', [speed]);
};

user.teleport = function(player, x, y, z, rot = 0.1) {
    methods.debug('user.teleport');
    if (!mp.players.exists(player))
        return false;
    if (rot == 0.1)
        rot = player.heading;
    player.call('client:teleport', [x, y, z, rot]);
};

user.teleportVeh = function(player, x, y, z, rot = 0.1) {
    methods.debug('user.teleportVeh');
    if (!mp.players.exists(player))
        return false;
    if (rot == 0.1 && player.vehicle)
        rot = player.vehicle.heading;
    player.call('client:teleportVeh', [x, y, z, rot]);
};

user.putInVehicle = function(player, veh, seat) {
    methods.debug('user.putInVehicle');
    if (!mp.players.exists(player))
        return false;
    player.putIntoVehicle(veh, seat);
    player.call('client:putInVehicle');
};

user.setWaypoint = function(player, x, y) {
    methods.debug('user.setWaypoint');
    if (!mp.players.exists(player))
        return false;
    player.call('client:user:setWaypoint', [x, y]);
};

user.setClipset = function(player, style) {
    try {
        methods.debug('user.setClipset');
        if (!mp.players.exists(player))
            return false;
        player.data.walkingStyle = style;
    }
    catch (e) {

    }
};

user.setClipsetW = function(player, style) {
    try {
        methods.debug('user.setClipsetW');
        if (!mp.players.exists(player))
            return false;
        player.data.walkingStyleW = style;
    }
    catch (e) {

    }
};

user.sendPhoneNotify = function(player, sender, title, message, pic = 'CHAR_BLANK_ENTRY') {
    if (!user.isLogin(player))
        return;
    player.call('client:user:sendPhoneNotify', [sender, title, message, pic]);
};

user.sendPhoneSms = function(player, sender, title, message, pic = 'CHAR_BLANK_ENTRY') {
    if (!user.isLogin(player))
        return;
    user.sendPhoneNotify(player, sender, title, message, pic);
    //TODO
};

user.sendSmsBankOperation = function(player, text, title = 'Операция со счётом', pref = 0) {
    methods.debug('bank.sendSmsBankOperation');
    if (!user.isLogin(player))
        return;

    let prefix = methods.parseInt(user.get(player, 'bank_card').toString().substring(0, 4));
    if (pref > 0)
        prefix = pref;

    try {
        switch (prefix) {
            case 6000:
                user.sendPhoneNotify(player,'~r~Maze Bank', '~g~' + title, text, 'CHAR_BANK_MAZE', 2);
                break;
            case 7000:
                user.sendPhoneNotify(player,'~o~Pacific Bank', '~g~' + title, text, 'CHAR_STEVE_MIKE_CONF', 2);
                break;
            case 8000:
                user.sendPhoneNotify(player,'~g~Fleeca Bank', '~g~' + title, text, 'CHAR_BANK_FLEECA', 2);
                break;
            case 9000:
                user.sendPhoneNotify(player,'~b~Blaine Bank', '~g~' + title, text, 'CHAR_STEVE_TREV_CONF', 2);
                break;
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

user.kick = function(player, reason, title = 'Вы были кикнуты.') {
    if (!mp.players.exists(player))
        return;
    methods.debug('user.kick ' + player.socialClub + ' ' + reason);
    player.outputChatBox('!{f44336}' + title);
    player.outputChatBox('!{f44336}Причина: !{FFFFFF}' + reason);

    user.callCef(player, 'dialog', JSON.stringify({type: 'updateValues', isShow: true, isShowClose: false, position: 'center', text: reason, buttons: [], icon: '', title: title, dtype: 1}));
    player.kick(reason);
};

user.kickAntiCheat = function(player, reason, title = 'Вы были кикнуты.') {
    methods.debug('user.kickAntiCheat');
    if (user.isLogin(player)) {
        chat.sendToAll('Anti-Cheat Protection', `${user.getRpName(player)} (${player.id})!{${chat.clRed}} был кикнут с причиной!{${chat.clWhite}} ${reason}`, chat.clRed);
        discord.sendDeadList(user.getRpName(player), 'Был кикнут', reason, 'Anti-Cheat Protection');
    }
    user.kick(player, reason, title);
};

user.getPlayerById = function(id) {
    let player = null;
    mp.players.forEach(pl => {
        if (user.isLogin(pl) && user.getId(pl) == id)
            player = pl;
    });
    return player;
};

user.blockKeys = function(player, enable) {
    methods.debug('user.blockKeys');
    if (!mp.players.exists(player))
        return false;
    player.call('client:user:blockKeys', [enable])
};

user.unequipAllWeapons = function(player) {
    methods.debug('user.unequipAllWeapons');
    if (!mp.players.exists(player))
        return false;
    player.call('client:user:unequipAllWeapons')
};

user.freeze = function(player, enable) {
    methods.debug('user.blockKeys');
    if (!mp.players.exists(player))
        return false;
    player.call('client:user:freeze', [enable])
};

user.duelTimer = function(player) {
    methods.debug('user.blockKeys');
    if (!mp.players.exists(player))
        return false;

    player.call('client:duel:start');
    user.freeze(player, true);
    player.notify('~g~Старт через 5сек');

    setTimeout(function () {
        try {
            player.notify('~g~Старт через 5сек');
        }
        catch (e) {

        }
    }, 1000);
    setTimeout(function () {
        try {
            player.notify('~g~Старт через 4сек');
        }
        catch (e) {

        }
    }, 2000);
    setTimeout(function () {
        try {
            player.notify('~g~Старт через 3сек');
        }
        catch (e) {

        }
    }, 3000);
    setTimeout(function () {
        try {
            player.notify('~g~Старт через 2сек');
        }
        catch (e) {

        }
    }, 4000);
    setTimeout(function () {
        try {
            player.notify('~g~Старт через 1сек');
        }
        catch (e) {

        }
    }, 5000);
    setTimeout(function () {
        try {
            player.call('client:duel:giveWeapon');
        }
        catch (e) {

        }
    }, 5500);
    setTimeout(function () {
        try {
            player.notify('~g~Старт через GO');
            user.freeze(player, false);
        }
        catch (e) {

        }
    }, 6000);
};

user.heading = function(player, rot) {
    methods.debug('user.headingToCoord');
    if (!mp.players.exists(player))
        return false;
    let pos = player.position;
    mp.players.forEach((p) => {
        try {
            if (methods.distanceToPos(pos, p.position) < 100)
                p.call('client:syncHeading', [player.id, rot])
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

user.headingToCoord = function(player, x, y, z) {
    methods.debug('user.headingToCoord');
    if (!mp.players.exists(player))
        return false;
    let pos = player.position;
    mp.players.forEach((p) => {
        try {
            if (methods.distanceToPos(pos, p.position) < 300)
                p.call('client:syncHeadingToCoord', [player.id, x, y, z])
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

user.headingToTarget = function(player, targetId) {
    methods.debug('user.headingToCoord');
    if (!mp.players.exists(player))
        return false;
    let pos = player.position;
    mp.players.forEach((p) => {
        try {
            if (methods.distanceToPos(pos, p.position) < 300)
                p.call('client:syncHeadingToTarget', [player.id, targetId])
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

user.playScenario = function(player, name) {
    methods.debug('user.playScenario');
    if (!mp.players.exists(player))
        return false;
    let pos = player.position;
    mp.players.forEach((p) => {
        try {
            if (methods.distanceToPos(pos, p.position) < 300)
                p.call('client:syncScenario', [player.id, name])
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

user.stopScenario = function(player) {
    methods.debug('user.playScenario');
    if (!mp.players.exists(player))
        return false;
    let pos = player.position;
    mp.players.forEach((p) => {
        try {
            if (methods.distanceToPos(pos, p.position) < 300)
                p.call('client:syncStopScenario', [player.id])
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

user.playAnimationWithUser = function(player, target, animId) {
    if (!mp.players.exists(player))
        return false;
    if (!mp.players.exists(target))
        return false;

    try {
        if (target.id == player.id)
            return;

        if (methods.distanceToPos(target.position, player.position) > 3) {
            player.notify('~r~Вы слишком далеко');
            return;
        }

        user.headingToTarget(target, player.id);
        user.headingToTarget(player, target.id);

        if (animId === 3)
            user.achiveDoneDailyById(player, 15);

        setTimeout(function () {
            try {
                user.playAnimation(player, enums.animTarget[animId][1], enums.animTarget[animId][2], 8);
                user.playAnimation(target, enums.animTarget[animId][4], enums.animTarget[animId][5], 8);
            }
            catch (e) {
                methods.debug(e);
            }
        }, 2100);
    }
    catch (e) {
        methods.debug(e);
    }
};

user.playAnimation = function(player, dict, anim, flag = 49) {
    methods.debug('user.playAnimation');
    if (!mp.players.exists(player))
        return false;
    let pos = player.position;
    mp.players.forEach((p) => {
        try {
            if (methods.distanceToPos(pos, p.position) < 300)
                p.call('client:syncAnimation', [player.id, dict, anim, flag])
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

user.stopAnimation = function(player) {
    methods.debug('user.stopSyncAnimation');
    if (!mp.players.exists(player))
        return false;
    let pos = player.position;
    mp.players.forEach((p) => {
        try {
            if (methods.distanceToPos(pos, p.position) < 300)
                p.call('client:syncStopAnimation', [player.id])
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

user.stopAnimationNow = function(player) {
    methods.debug('user.stopSyncAnimation');
    if (!mp.players.exists(player))
        return false;
    let pos = player.position;
    mp.players.forEach((p) => {
        try {
            if (methods.distanceToPos(pos, p.position) < 300)
                p.call('client:syncStopAnimationNow', [player.id])
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

user.setRagdoll = function(player, timeout) {
    methods.debug('user.stopSyncAnimation');
    if (!mp.players.exists(player))
        return false;
    let pos = player.position;
    mp.players.forEach((p) => {
        try {
            if (methods.distanceToPos(pos, p.position) < 300)
                p.call('client:syncRagdoll', [player.id, timeout])
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

user.playDrinkAnimation = function(player) {
    methods.debug('user.playDrinkAnimation');
    user.playAnimation(player, "mp_player_intdrink", "loop_bottle", 48);
};

user.playEatAnimation = function(player) {
    user.playAnimation(player, "mp_player_inteat@burger", "mp_player_int_eat_burger", 48);
};

user.playDrugAnimation = function(player) {
    methods.debug('user.playDrugAnimation');
    user.playAnimation(player, "move_m@drunk@transitions", "slightly_to_idle", 8);
};

/*
    Drug Types
    - Amf 0
    - Coca 1
    - Dmt 2
    - Ket 3
    - Lsd 4
    - Mef 5
    - Marg 6
*/
user.addDrugLevel = function(player, drugType, level) {
    if (user.isLogin(player))
        player.call('client:user:addDrugLevel', [drugType, level]);
};

user.removeDrugLevel = function(player, drugType, level) {
    if (user.isLogin(player))
        player.call('client:user:removeDrugLevel', [drugType, level]);
};

user.setDrugLevel = function(player, drugType, level) {
    if (user.isLogin(player))
        player.call('client:user:setDrugLevel', [drugType, level]);
};

user.stopAllScreenEffects = function(player) {
    if (user.isLogin(player))
        player.call('client:user:stopAllScreenEffects');
};

// Water Level

user.addWaterLevel = function(player, level) {
    if (!user.isLogin(player))
        return;
    methods.debug('user.addWaterLevel');
    if (user.getWaterLevel(player) + level > 1000) {
        user.setWaterLevel(player, 1000);
        return true;
    }
    user.setWaterLevel(player, user.getWaterLevel(player) + level);
    return true
};

user.removeWaterLevel = function(player, level) {
    if (!user.isLogin(player))
        return;
    if (user.getWaterLevel(player) - level < 0) {
        user.setWaterLevel(player, 0);
        return true;
    }
    user.setWaterLevel(player, user.getWaterLevel(player) - level);
    return true;
};

user.setWaterLevel = function(player, level) {
    if (!user.isLogin(player))
        return;
    user.set(player, "water_level", level);
    user.updateClientCache(player);
    return true;
};

user.getWaterLevel = function(player) {
    return user.get(player, "water_level");
};

// Eat Level

user.addEatLevel = function(player, level) {
    if (!user.isLogin(player))
        return;
    if (user.getEatLevel(player) + level > 1000) {
        user.setEatLevel(player, 1000);
        return true;
    }
    user.setEatLevel(player, user.getEatLevel(player) + level);
    return true
};

user.removeEatLevel = function(player, level) {
    if (!user.isLogin(player))
        return;
    if (user.getEatLevel(player) - level < 0) {
        user.setEatLevel(player, 0);
        return true;
    }
    user.setEatLevel(player, user.getEatLevel(player) - level);
    return true;
};

user.setEatLevel = function(player, level) {
    if (!user.isLogin(player))
        return;
    user.set(player, "eat_level", level);
    user.updateClientCache(player);
    return true;
};

user.getEatLevel = function(player) {
    return user.get(player, "eat_level");
};

user.giveWeapon = function(player, weapon, pt) {
    if (!mp.players.exists(player))
        return false;
    player.call('client:user:giveWeapon', [weapon, pt])
};

user.giveWeaponComponent = function(player, weapon, component) {
    if (!mp.players.exists(player))
        return false;
    methods.debug('user.giveWeaponComponent', weapon, component);
    player.giveWeaponComponent(weapon, component);
};

user.removeWeaponComponent = function(player, weapon, component) {
    if (!mp.players.exists(player))
        return false;
    methods.debug('user.removeWeaponComponent', weapon, component);
    player.removeWeaponComponent(weapon, component);
};

user.removeAllWeaponComponents = function(player, weapon) {
    if (!mp.players.exists(player))
        return false;
    methods.debug('user.removeAllWeaponComponents', weapon);
    player.removeAllWeaponComponents(weapon);
};

user.setWeaponTint = function(player, weapon, tint) {
    if (!mp.players.exists(player))
        return false;
    methods.debug('user.setWeaponTint', weapon, tint);
    player.setWeaponTint(weapon, tint);
};

user.removeAllWeapons = function(player) {
    if (!mp.players.exists(player))
        return false;
    methods.debug('user.removeAllWeapons');
    player.call('client:user:removeAllWeapons');
};

user.giveJobSkill = function(player, jobNew = 0) {
    if (user.isLogin(player)) {
        try {
            let job = user.get(player, 'job');
            if (job > 0)
                job = jobNew;

            let skillCount = enums.jobList[job][5];
            let skillWin = enums.jobList[job][6];
            let skillPostfix = enums.jobList[job][4];

            if (user.has(player, 'job_' + skillPostfix)) {
                let currentSkill = user.get(player, 'job_' + skillPostfix);
                if (currentSkill >= skillCount)
                    return;

                if (currentSkill == skillCount - 1) {
                    user.set(player, 'job_' + skillPostfix, skillCount);
                    chat.sendToAll('Новости штата', `${user.getRpName(player)} !{${chat.clBlue}} стал одним из лучших работников штата San Andreas, получив вознаграждение ${methods.moneyFormat(skillWin)}`, chat.clBlue);
                    user.addMoney(player, skillWin);
                    user.save(player);
                }
                else {
                    user.set(player, 'job_' + skillPostfix, currentSkill + 1);
                    player.notify('~g~Навык вашей профессии был повышен');
                }
            }
        }
        catch (e) {}
    }
};

user.giveJobMoney = function(player, money, jobId = 0) {
    if (!user.isLogin(player))
        return;

    if (user.hasById(user.getId(player), 'uniform')) {
        player.notify('~r~Нельзя работать в форме');
        return;
    }

    let desc = '';
    try {
        let jobItem = enums.jobList[user.get(player, 'job')];
        if (jobId > 0)
            jobItem = enums.jobList[jobId];
        if (jobItem[5] > 0 && user.get(player, 'job_' + jobItem[4]) > 0) {
            money = money * (1 + user.get(player, 'job_' + jobItem[4]) / jobItem[5]);
            desc = `\n~y~Прибавка ${methods.parseFloat((user.get(player, 'job_' + jobItem[4]) / jobItem[5]) * 100).toFixed(2)}% от зарплаты за прокаченный навык`
        }
    }
    catch (e) {}

    money = methods.parseFloat(money);
    if (user.get(player, 'bank_card') < 1) {
        user.addCashMoney(player, money);
        player.notify('Вы заработали: ~g~' + methods.moneyFormat(money) + desc);
    }
    else {
        user.addBankMoney(player, money);
        user.sendSmsBankOperation(player, `Зачисление средств: ~g~${methods.moneyFormat(money)}` + desc);
    }
    coffer.removeMoney(1, money);
};


user.jail = function(player, sec, withIzol = 0) {
    methods.debug('user.jail');
    if (!user.isLogin(player))
        return false;
    user.set(player, 'jail_time', sec);
    user.achiveDoneAllById(player, 25);
    player.call('client:jail:jailPlayer', [sec, withIzol]);
};

user.arrest = function(player) {
    methods.debug('user.arrest');
    if (!user.isLogin(player))
        return false;
    if (methods.parseInt(user.get(player, 'wanted_level')) <= 0)
        return false;
    user.toLspdSafe(player);
    user.addHistory(player, 1, 'Был посажен в тюрьму на ' + user.get(player, 'wanted_level') + ' лет');
    user.jail(player, methods.parseInt(user.get(player, 'wanted_level')) * 120);

    user.set(player, 'st_jail', user.get(player, 'st_jail') + 1);
};

user.giveWanted = function(player, level, reason, officer = 'Система') {
    methods.debug('user.giveWanted');
    if (!user.isLogin(player))
        return false;

    if (user.get(player, 'jail_time') > 0) {
        return;
    }

    if (reason == 'clear') {
        user.set(player, 'wanted_level', 0);
        user.set(player, 'wanted_reason', '');
        player.notifyWithPicture('Уведомление', 'Police Department', 'Вы больше не находитесь в розыске', 'WEB_LOSSANTOSPOLICEDEPT', 2);
        user.addHistory(player, 1, `Был очищен розыск (${officer})`);
    }
    else {

        if (level < 0)
            return;

        let currentLvl = user.get(player, 'wanted_level');
        if (currentLvl + level >= 50) {
            //methods.notifyWithPictureToAll('Федеральный розыск', 'Police Department', `${user.getRpName(player)} был объявлен в розыск`, 'WEB_LOSSANTOSPOLICEDEPT', 2);
            user.set(player, 'wanted_level', 50);
        }
        else
            user.set(player, 'wanted_level', currentLvl + level);
        user.set(player, 'wanted_reason', reason);
        player.notifyWithPicture('Уведомление', 'Police Department', 'Просим Вас явиться в участок Los Santos Police Department', 'WEB_LOSSANTOSPOLICEDEPT', 2);

        user.addHistory(player, 1, `Был выдан розыск ${level}. Причина: ${reason}. (${officer})`);
        user.set(player, 'st_crime', user.get(player, 'st_crime') + 1);
    }
    user.updateClientCache(player);
};

user.giveLic = function (player, lic, monthEnd = 12, desc = '') {
    if (!user.isLogin(player))
        return;

    let licName = '';

    let timestamp = weather.strDateToTime(weather.getFullRpDate());
    let addTimestamp = monthEnd * 2592000000; //1 month
    let dateTimeStart = new Date(timestamp);
    let dateTimeEnd = new Date(timestamp + addTimestamp);
    let dateTimeStartFormat = weather.getFullRpDateFormat(dateTimeStart.getDate(), dateTimeStart.getMonth(), dateTimeStart.getFullYear());
    let dateTimeEndFormat = weather.getFullRpDateFormat(dateTimeEnd.getDate(), dateTimeEnd.getMonth(), dateTimeEnd.getFullYear());

    user.set(player, lic, true);
    user.set(player, lic + '_create', dateTimeStartFormat);
    user.set(player, lic + '_end', dateTimeEndFormat);

    user.save(player);

    switch (lic) {
        case 'a_lic':
            licName = 'категории А';
            break;
        case 'b_lic':
            licName = 'категории B';
            break;
        case 'c_lic':
            licName = 'категории C';
            break;
        case 'air_lic':
            licName = 'на воздушный транспорт';
            break;
        case 'ship_lic':
            licName = 'на водный транспорт';
            break;
        case 'taxi_lic':
            licName = 'на перевозку пассажиров';
            break;
        case 'law_lic':
            licName = 'юриста';
            break;
        case 'gun_lic':
            licName = 'на оружие';
            break;
        case 'biz_lic':
            licName = 'на предпринимательство';
            break;
        case 'fish_lic':
            licName = 'на рыбаловство';
            break;
        case 'marg_lic':
            licName = 'на употребление марихуаны';
            break;
    }

    if (lic == 'med_lic') {
        player.notify(`~g~Вы получили ~s~медстраховку~g~ на ~s~${monthEnd} ~g~мес.`);
        user.addHistory(player, 4, `Получил медстраховку на ${monthEnd} мес. ` + desc);
        return;
    }
    player.notify(`~g~Вы получили лицензию ~s~${licName}~g~ на ~s~${monthEnd} ~g~мес.`);
    user.addHistory(player, 4, `Получил лицензию ${licName} на ${monthEnd} мес. ` + desc);
};

user.buyLicense = function (player, type, price, month, typePay = 0) {
    if (!user.isLogin(player))
        return;
    methods.debug('licenseCenter.buy');

    if (price < 0)
        return;

    try {
        if (user.get(player, 'reg_status') == 0)
        {
            player.notify('~r~У Вас нет регистрации');
            return;
        }

        if (!user.get(player, type))
        {
            if (typePay === 1) {
                if (user.getBankMoney(player) < price)
                {
                    player.notify("~r~У Вас недостаточно средств");
                    return;
                }
                user.removeBankMoney(player, price, 'Покупка лицензии');
            }
            else {
                if (user.getMoney(player) < price)
                {
                    player.notify("~r~У Вас недостаточно средств");
                    return;
                }
                user.removeMoney(player, price, 'Покупка лицензии');
            }
            coffer.addMoney(price);

            user.giveLic(player, type, month);
            return;
        }
        player.notify("~r~У вас уже есть данная лицензия");
    }
    catch (e) {
        methods.debug('Exception: licenseCenter.buy');
        methods.debug(e);
    }
};

user.revive = function(player, hp = 20) {
    if (!mp.players.exists(player))
        return false;
    methods.debug('user.revive');
    player.call('client:user:revive', [hp]);
};

//28 - 4 Часа
//169 - 24 Часа
user.toLspdSafe = function(player, time = 28, target = null) {
    if (!mp.players.exists(player))
        return false;
    user.showCustomNotify(player, 'Ваше оружие лежит в сейфе LSPD/BCSD');
    mysql.executeQuery(`UPDATE items SET owner_type = '${inventory.types.StockTakeWeap}', owner_id = '${user.getId(player)}' where owner_id = '${user.getId(player)}' AND owner_type = '1' AND (item_id > '53' AND item_id < '139' OR item_id = '146' OR item_id = '147' OR item_id = '263' OR item_id = '264' OR item_id = '252')`);

    inventory.deleteItemsRange(player, 2, 3);
    inventory.deleteItemsRange(player, 158, 180);

    if (user.get(player, 'online_lspd') < time)
        user.set(player, 'online_lspd', time);

    if (user.isLogin(target)) {
        mysql.executeQuery(`SELECT * FROM items WHERE owner_id = ${user.getId(player)} AND owner_type = 1`, function (err, rows, fields) {

            let money = 0;
            let count = 0;

            rows.forEach((item) => {

                if (item['item_id'] == 140 || item['item_id'] == 141) {
                    money += item['count'];
                    count++;
                    inventory.deleteItem(item['id']);
                }
            });

            if (count > 0) {

                let moneyHalf = money / 2;
                let frId = user.get(target, 'fraction_id');
                let currentOnline = methods.getCurrentOnlineFraction(frId);

                coffer.addMoney(coffer.getIdByFraction(frId), moneyHalf, 'Премия за грязные деньги');

                mp.players.forEach(p => {
                    if (user.isLogin(p) && user.get(p, 'fraction_id') === frId) {
                        user.addPayDayMoney(p, moneyHalf / currentOnline, 'Премия');
                        p.notify(`~g~К вам на счет поступило: ~s~${methods.moneyFormat(moneyHalf / currentOnline)}`);
                    }
                });
                target.notify('~b~Деньги были разделены следующим образом. 50% идёт на счет организации, 50% разделяется над всеми, кто в сети');
            }
        });
    }
    else
        inventory.deleteItemsRange(player, 140, 141);
};

user.createBlip = function(player, id, x, y, z, blipId = 1, blipColor = 0, route = false, shortRange = false, name = 'Цель', rot = 0, scale = 0.8) {
    if (!mp.players.exists(player))
        return false;
    player.call('client:user:createBlip', [id, x, y, z, blipId, blipColor, route, shortRange, name, rot, scale]);
};

user.deleteBlip= function(player, id) {
    if (!mp.players.exists(player))
        return false;
    player.call('client:user:deleteBlip', [id]);
};

user.createBlipByRadius = function(player, id, x, y, z, radius, blipId = 1, blipColor = 0, route = false) {
    if (!mp.players.exists(player))
        return false;
    player.call('client:user:createBlipByRadius', [id, x, y, z, radius, blipId, blipColor, route]);
};

user.deleteBlipByRadius = function(player, id) {
    if (!mp.players.exists(player))
        return false;
    player.call('client:user:deleteBlipByRadius', [id]);
};

user.flashBlipByRadius = function(player, id, flash = false) {
    if (!mp.players.exists(player))
        return false;
    player.call('client:user:flashBlipByRadius', [id, flash]);
};

user.createBlip1 = function(player, x, y, z, blipId = 1, blipColor = 0, route = false) {
    if (!mp.players.exists(player))
        return false;
    player.call('client:user:createBlip1', [x, y, z, blipId, blipColor, route]);
};

user.deleteBlip1= function(player) {
    if (!mp.players.exists(player))
        return false;
    player.call('client:user:deleteBlip1');
};

user.createBlip2 = function(player, x, y, z, blipId = 1, blipColor = 0, route = false) {
    if (!mp.players.exists(player))
        return false;
    player.call('client:user:createBlip2', [x, y, z, blipId, blipColor, route]);
};

user.deleteBlip2= function(player) {
    if (!mp.players.exists(player))
        return false;
    player.call('client:user:deleteBlip2');
};

user.createBlip3 = function(player, x, y, z, blipId = 1, blipColor = 0, route = false) {
    if (!mp.players.exists(player))
        return false;
    player.call('client:user:createBlip3', [x, y, z, blipId, blipColor, route]);
};

user.deleteBlip3= function(player) {
    if (!mp.players.exists(player))
        return false;
    player.call('client:user:deleteBlip3');
};

user.useAdrenaline = function(player) {
    if (!mp.players.exists(player))
        return false;
    methods.debug('user.useAdrenaline');
    user.revive(player);
};

user.payDay = async function (player) {
    if (!user.isLogin(player))
        return false;
    methods.debug('user.payDay', user.getRpName(player));

    user.set(player, 'online_time', user.get(player, 'online_time') + 1);
    user.set(player, 'online_wheel', user.get(player, 'online_wheel') + 1);
    user.set(player, 'online_cont', user.get(player, 'online_cont') + 1);
    user.set(player, 'online_contall', user.get(player, 'online_contall') + 1);

    if (user.get(player, 'online_lspd') >= 0)
        user.set(player, 'online_lspd', user.get(player, 'online_lspd') - 1);

    if (user.get(player, 'warns') > 0) {
        user.set(player, 'online_warn', user.get(player, 'online_warn') + 1);
        if (user.get(player, 'online_warn') >= 508) {
            user.set(player, 'warns', user.get(player, 'warns') - 1);
            user.set(player, 'online_warn', 0);
            player.notify(`~g~Сервер вам снял 1 предупреждение`);
        }
    }

    /*if (user.getVipStatus() != "YouTube" && user.getVipStatus() != "Turbo" && user.getVipStatus() != "none" && user.get(player, 'exp_age') % 4 == 0)
        user.set(player, 'exp_age', user.get(player, 'exp_age') + 1);

    if (user.getVipStatus() == "Turbo" && user.get(player, 'exp_age') % 2 == 0)
        user.set(player, 'exp_age', user.get(player, 'exp_age') + 1);

    if (user.getVipStatus() == "YouTube")
        user.set(player, 'exp_age', user.get(player, 'exp_age') + 1);*/

    if (user.get(player, 'online_cont') === 56) {
        /*user.giveRandomMask(player, 30, true);
        user.addCashMoney(player, 30000, 'Бонус от государства');
        player.notify(`~g~Вы получили $30,000 отыграв 8 часов на сервере`);
        user.set(player, 'online_cont', user.get(player, 'online_cont') + 1);*/

        //user.set(player, 'online_cont', 999);*/

        /*let caseId = 1;
        if (methods.getRandomInt(0, 10) < 5)
            caseId = 4;
        if (methods.getRandomInt(0, 20) < 5)
            caseId = 2;
        if (methods.getRandomInt(0, 30) < 5)
            caseId = 3;
        if (methods.getRandomInt(0, 50) < 5)
            caseId = 5;

        let caseNames = ['Невероятный', 'Секретный', 'Легенадрный', 'Масочный', 'Транспортный'];
        mysql.executeQuery(`UPDATE accounts SET case${caseId}_count = case${caseId}_count + '1' WHERE social ='${player.socialClub}'`);
        user.set(player, 'online_cont', user.get(player, 'online_cont') + 1);
        chat.sendToPlayer(player, '!{8BC34A} Вы получили бесплатный ' + caseNames[caseId - 1] + 'кейс за то, что отыграли 8 часов на сервере');*/
    }

    if (user.get(player, 'online_time') === 169) {
        if (user.get(player, 'referer') !== "") {

            user.addCashMoney(player, 20000, 'Бонус от государства');
            player.notify(`~g~Вы получили $20,000 по реферальной системе`);
            player.notify(`~g~Пригласивший ${user.get(player, 'referer')} получил 500bp на личный счёт`);
            mysql.executeQuery(`UPDATE users SET money_donate = money_donate + '500' WHERE name ='${user.get(player, 'referer')}'`);
            mysql.executeQuery(`INSERT INTO log_referrer (name, referrer, money, timestamp) VALUES ('${user.getRpName(player)}', '${user.get(player, 'referer')}', '500', '${methods.getTimeStamp()}')`);
        }

        if (user.get(player, 'promocode') !== "") {

            let promocode = user.get(player, 'promocode');

            mysql.executeQuery(`SELECT * FROM promocode_top_list WHERE promocode = '${promocode}' LIMIT 1`, function (err, rows, fields) {
                if (rows.length >= 1) {
                    let paramsStart = JSON.parse(rows[0]["end"]);

                    let string = `~b~Вы отыграли на проекте 24ч, вы получили бонус по промокоду ${promocode}\n`;
                    if (paramsStart.money > 0)
                        string += `~b~Вы получили~s~ ${methods.moneyFormat(paramsStart.money)}\n`;
                    /*if (paramsStart.vipt === 1)
                        string += `~b~Вы получили ~s~VIP LIGHT~b~ на ~s~${paramsStart.vip}д.\n`;
                    if (paramsStart.vipt === 2)
                        string += `~b~Вы получили ~s~VIP HARD~b~ на ~s~${paramsStart.vip}д.\n`;*/

                    /*let vipTime = 0;
                    let vipType = methods.parseInt(paramsStart.vipt);
                    if (methods.parseInt(paramsStart.vip) > 0 && user.get(player, 'vip_type') > 0 && user.get(player, 'vip_time') > 0)
                        vipTime = methods.parseInt(paramsStart.vip * 86400) + user.set(player, 'vip_time');
                    else if (methods.parseInt(paramsStart.vip) > 0)
                        vipTime = methods.parseInt(paramsStart.vip * 86400) + methods.getTimeStamp();

                    user.set(player, 'vip_time', vipTime);
                    user.set(player, 'vip_type', vipType);*/

                    player.notify(string);
                    user.addCashMoney(player, paramsStart.money, 'Бонус от государства');
                } else {
                    player.notify(`~g~Вы получили ~s~$24000 ~g~по промокоду ~s~${user.get(player, 'promocode')}`);
                    user.addCashMoney(player, 24000, 'Бонус от государства');
                }
                mysql.executeQuery(`UPDATE users SET money_donate = money_donate + '50' WHERE parthner_promocode = '${user.get(player, 'promocode')}'`);
            });
        }
    }

    /*if (user.get(player, 'vip_type') === 1) {
        user.addWorkExp(player, 10);
        player.notify('~g~Вы получили 10 опыта рабочего стажа, связи с тем, что у вас VIP LIGHT');
    }
    if (user.get(player, 'vip_type') === 2) {
        user.addWorkExp(player, 20);
        player.notify('~g~Вы получили 20 опыта рабочего стажа, связи с тем, что у вас VIP HARD');
    }*/

    if (user.get(player, 'bank_card') > 0) {

        if (player.getVariable('isAfk') === true) {
            player.notify('~r~Зарплату вы не получили, связи с тем, что вы AFK');
        }
        else if (user.get(player, 'fraction_id') > 0) {

            if (!user.hasById(user.getId(player), 'uniform') && !user.isNews(player) && !user.isFib(player))
            {
                //player.notify('~r~Для того, чтобы получать зарплату, вам необходимо выйти на дежурство (Надеть форму)');
            }
            else {
                user.addWorkExp(player, 10);
                user.addRep(player, 5);

                let money = methods.getFractionPayDay(user.get(player, 'fraction_id'), user.get(player, 'rank'), user.get(player, 'rank_type'));

                if (user.isLeader(player))
                {
                    let frItem = methods.getFractionById(user.get(player, 'fraction_id'));
                    money = frItem.leaderPayDay;
                }
                if (user.isSubLeader(player))
                {
                    let frItem = methods.getFractionById(user.get(player, 'fraction_id'));
                    money = frItem.subLeaderPayDay;
                }

                let nalog = money * (100 - coffer.getTaxPayDay()) / 100;

                let frId = coffer.getIdByFraction(user.get(player, 'fraction_id'));
                let currentCofferMoney = coffer.getMoney(frId);

                if (currentCofferMoney < nalog) {
                    user.sendSmsBankOperation(player, `~r~В бюджете организации не достаточно средств для выплаты зарплаты`, 'Зарплата');
                }
                else {

                    let desc = '';
                    if (user.get(player, 'vip_type') === 1) {
                        desc = '\n~y~Прибавка VIP LIGHT 5% от зарплаты';
                        nalog = nalog * 1.05;
                    }
                    if (user.get(player, 'vip_type') === 2) {
                        desc = '\n~y~Прибавка VIP HARD 10% от зарплаты';
                        nalog = nalog * 1.1;
                    }

                    let ben = coffer.getBenefit(coffer.getIdByFraction(user.get(player, 'fraction_id')));
                    if (ben > 0)
                        user.sendSmsBankOperation(player, `Зачисление: ~g~${methods.moneyFormat(nalog)}\n~s~Прибавка к зарплате: ~g~${methods.moneyFormat(ben)}${desc}`, 'Зарплата');
                    else
                        user.sendSmsBankOperation(player, `Зачисление: ~g~${methods.moneyFormat(nalog)}${desc}`, 'Зарплата');
                    user.addPayDayMoney(player, nalog);
                    coffer.removeMoney(frId, nalog)
                }
            }
        }
        else if (user.get(player, 'job') == 0) {

            let currentCofferMoney = coffer.getMoney(1);
            let sum = coffer.getBenefit();

            if (currentCofferMoney < sum) {
                player.notify('~r~В бюджете штата не достаточно средств для выплаты пособия');
                user.sendSmsBankOperation(player, `~r~В бюджете штата не достаточно средств для выплаты пособия`, 'Пособие');
            }
            else {
                user.sendSmsBankOperation(player, `Зачисление: ~g~${methods.moneyFormat(sum)}`, 'Пособие');
                user.addBankMoney(player, sum, 'Пособие по безработицы');
                coffer.removeMoney(1, sum);
            }
        }

        if (player.getVariable('enableAdmin')) {
            if (player.getVariable('isAfk') === true) {
                player.notify('~r~Зарплату вы не получили, связи с тем, что вы AFK');
            }
            else {
                let sum = user.get(player, 'admin_level') * 500;
                user.sendSmsBankOperation(player, `Зачисление: ~g~${methods.moneyFormat(sum)}`, '~r~Админ Зарплата');
                user.addBankMoney(player, sum, 'Пособие по безработицы');
            }
        }
    }
    else {
        player.notify(`~y~Оформите банковскую карту`);
    }
    return true;
};

user.isJobMail = function(player) {
    return user.isLogin(player) && user.get(player, 'job') === 4;
};

user.isJobGr6 = function(player) {
    return user.isLogin(player) && user.get(player, 'job') === 10;
};

user.isJobMech = function(player) {
    return user.isLogin(player) && user.get(player, 'job') === 5;
};

user.isJobBus1 = function(player) {
    return user.isLogin(player) && user.get(player, 'job') === 6;
};

user.isJobBus2 = function(player) {
    return user.isLogin(player) && user.get(player, 'job') === 7;
};

user.isJobBus3 = function(player) {
    return user.isLogin(player) && user.get(player, 'job') === 8;
};

user.isJobTree = function(player) {
    return user.isLogin(player) && user.get(player, 'job') === 1;
};

user.isJobAve = function(player) {
    return user.isLogin(player) && user.get(player, 'job') === 12;
};

user.isJobBuilder = function(player) {
    return user.isLogin(player) && user.get(player, 'job') === 2;
};

user.isGos = function(player) {
    //methods.debug('user.isGos');
    return user.isLogin(player) && (user.isSapd(player) || user.isFib(player) || user.isUsmc(player) || user.isGov(player) || user.isEms(player) || user.isSheriff(player));
};

user.isPolice = function(player) {
    return user.isLogin(player) && (user.isSapd(player) || user.isFib(player) || user.isUsmc(player) || user.isSheriff(player));
};

user.isGov = function(player) {
    //methods.debug('user.isGov');
    return user.isLogin(player) && user.get(player, 'fraction_id') == 1;
};

user.isSapd = function(player) {
    //methods.debug('user.isSapd');
    return user.isLogin(player) && user.get(player, 'fraction_id') == 2;
};

user.isFib = function(player) {
    //methods.debug('user.isFib');
    return user.isLogin(player) && user.get(player, 'fraction_id') == 3;
};

user.isUsmc = function(player) {
    //methods.debug('user.isUsmc');
    return user.isLogin(player) && user.get(player, 'fraction_id') == 4;
};

user.isSheriff = function(player) {
    //methods.debug('user.isSheriff');
    return user.isLogin(player) && user.get(player, 'fraction_id') == 5;
};

user.isEms = function(player) {
    //methods.debug('user.isEms');
    return user.isLogin(player) && user.get(player, 'fraction_id') == 6;
};

user.isNews = function(player) {
    //methods.debug('user.isNews');
    return user.isLogin(player) && user.get(player, 'fraction_id') == 7;
};

user.isCartel = function(player) {
    //methods.debug('user.isNews');
    return user.isLogin(player) && user.get(player, 'fraction_id') == 8;
};

user.isCosaNostra = function(player) {
    return user.isLogin(player) && user.get(player, 'fraction_id2') == 17;
};

user.isRussianMafia = function(player) {
    return user.isLogin(player) && user.get(player, 'fraction_id2') == 16;
};

user.isYakuza = function(player) {
    return user.isLogin(player) && user.get(player, 'fraction_id2') == 18;
};

user.isMafia = function(player) {
    return user.isLogin(player) && (user.isCosaNostra(player) || user.isRussianMafia(player) || user.isYakuza(player));
};

user.isGang = function(player) {
    return user.isLogin(player) && (fraction.isGang(user.get(player, 'fraction_id2')));
};

user.isLeader = function(player) {
    //methods.debug('user.isLeader');
    return user.isLogin(player) && user.get(player, 'is_leader');
};

user.isSubLeader = function(player) {
    //methods.debug('user.isSubLeader');
    return user.isLogin(player) && user.get(player, 'is_sub_leader');
};

user.isDepLeader = function(player) {
    //methods.debug('user.isDepLeader');
    return user.isLogin(player) && user.get(player, 'fraction_id') > 0 && user.get(player, 'rank') === 0;
};

user.isDepSubLeader = function(player) {
    //methods.debug('user.isDepSubLeader');
    return user.isLogin(player) && user.get(player, 'fraction_id') > 0 && user.get(player, 'rank') === 1;
};

user.isLeader2 = function(player) {
    //methods.debug('user.isLeader2');
    return user.isLogin(player) && user.get(player, 'is_leader2');
};

user.isSubLeader2 = function(player) {
    //methods.debug('user.isSubLeader2');
    return user.isLogin(player) && user.get(player, 'is_sub_leader2');
};

user.isDepLeader2 = function(player) {
    //methods.debug('user.isDepLeader2');
    return user.isLogin(player) && user.get(player, 'fraction_id2') > 0 && user.get(player, 'rank2') === 0;
};

user.isDepSubLeader2 = function(player) {
    //methods.debug('user.isDepSubLeader2');
    return user.isLogin(player) && user.get(player, 'fraction_id2') > 0 && user.get(player, 'rank2') === 1;
};

user.isLeaderF = function(player) {
    //methods.debug('user.isLeader2');
    return user.isLogin(player) && user.get(player, 'is_leaderf');
};

user.isSubLeaderF = function(player) {
    //methods.debug('user.isSubLeader2');
    return user.isLogin(player) && user.get(player, 'is_sub_leaderf');
};

user.isDepLeaderF = function(player) {
    //methods.debug('user.isDepLeader2');
    return user.isLogin(player) && user.get(player, 'family_id') > 0 && user.get(player, 'rankf') === 0;
};

user.isDepSubLeaderF = function(player) {
    //methods.debug('user.isDepSubLeader2');
    return user.isLogin(player) && user.get(player, 'family_id') > 0 && user.get(player, 'rankf') === 1;
};

user.isAdmin = function(player, level = 1) {
    return user.isLogin(player) && user.get(player, 'admin_level') >= level;
};

user.isHelper = function(player, level = 1) {
    return user.isLogin(player) && user.get(player, 'helper_level') >= level;
};

user.getVehicleFreeSlot = function(player) {
    if (!user.isLogin(player))
        return 0;
    let freeSlot = 0;
    try {
        let hData = null;
        if (user.get(player, 'house_id') > 0)
            hData = houses.getHouseData(user.get(player, 'house_id'));

        let cData = null;
        if (user.get(player, 'condo_id') > 0)
            cData = condos.getHouseData(user.get(player, 'condo_id'));


        if (user.get(player, 'car_id1') === 0)
            freeSlot = 1;
        else if (user.get(player, 'car_id2') === 0 && (user.get(player, 'house_id') > 0 || user.get(player, 'condo_id') > 0 || user.get(player, 'yacht_id') > 0)) {
            freeSlot = 2;
        }
        else if (user.get(player, 'car_id3') === 0 && user.get(player, 'house_id') > 0 && hData.get('price') >= 100000) {
            freeSlot = 3;
        }
        else if (user.get(player, 'car_id4') === 0 && user.get(player, 'house_id') > 0 && hData.get('price') >= 500000) {
            freeSlot = 4;
        }
        else if (user.get(player, 'car_id5') === 0 && user.get(player, 'house_id') > 0 && hData.get('price') >= 1000000) {
            freeSlot = 5;
        }
        else if (user.get(player, 'car_id3') === 0 && user.get(player, 'condo_id') > 0 && cData.get('price') >= 100000) {
            freeSlot = 3;
        }
        else if (user.get(player, 'car_id4') === 0 && user.get(player, 'condo_id') > 0 && cData.get('price') >= 500000) {
            freeSlot = 4;
        }
        else if (user.get(player, 'car_id5') === 0 && user.get(player, 'condo_id') > 0 && cData.get('price') >= 1000000) {
            freeSlot = 5;
        }
        else if (user.get(player, 'car_id3') === 0 && user.get(player, 'yacht_id') > 0) {
            freeSlot = 3;
        }
        else if (user.get(player, 'car_id4') === 0 && user.get(player, 'yacht_id') > 0) {
            freeSlot = 4;
        }
        else if (user.get(player, 'car_id5') === 0 && user.get(player, 'yacht_id') > 0) {
            freeSlot = 5;
        }
        else if (user.get(player, 'car_id6') === 0 && user.get(player, 'car_id6_free')) {
            freeSlot = 6;
        }
        else if (user.get(player, 'car_id7') === 0 && user.get(player, 'car_id7_free')) {
            freeSlot = 7;
        }
        else if (user.get(player, 'car_id8') === 0 && user.get(player, 'car_id8_free')) {
            freeSlot = 8;
        }
        else if (user.get(player, 'car_id9') === 0 && user.get(player, 'car_id9_free')) {
            freeSlot = 9;
        }
        else if (user.get(player, 'car_id10') === 0 && user.get(player, 'car_id10_free')) {
            freeSlot = 10;
        }
    }
    catch (e) {}
    return freeSlot;
};

user.warn = function(player, count, reason, notify = true) {
    if (!user.isLogin(player))
        return;

    if (notify) {
        discord.sendDeadList(user.getRpName(player), 'Было выдано предупреждение', reason, 'Anti-Cheat Protection');
        chat.sendToAll(`Anti-Cheat Protection`, `${user.getRpName(player)}!{${chat.clRed}} было выдано предупреждение с причиной!{${chat.clWhite}} ${reason}`, chat.clRed);
    }

    if (count < 0) {
        mysql.executeQuery(`INSERT INTO ban_list (ban_from, ban_to, count, datetime, reason) VALUES ('Server', '${user.getRpName(player)}', 'Снято предупреждение', '${methods.getTimeStamp()}', '${reason}')`);

        if (user.get(player, 'warns') > 0) {
            user.set(player, 'warns', user.get(player, 'warns') - 1);
        }
        else {
            user.set(player, 'warns', 0);
        }
    }
    else {
        mysql.executeQuery(`INSERT INTO ban_list (ban_from, ban_to, count, datetime, reason) VALUES ('Server', '${user.getRpName(player)}', 'Предупреждение', '${methods.getTimeStamp()}', '${reason}')`);

        if (user.get(player, 'warns') < 2) {
            user.set(player, 'warns', user.get(player, 'warns') + 1);
        }
        else {
            user.set(player, 'warns', 0);
            user.ban(player, 6, 'Был забанен (3 предупреждения)')
        }
    }
};

//['1h', '6h', '12h', '1d', '3d', '7d', '14d', '30d', '60d', '90d', 'Permanent'];
user.ban = function(player, count, reason) {
    if (!user.isLogin(player))
        return;
    admin.banByAnticheat(0, player.id, count, reason);
};

user.giveVip = function(player, days = 7, type = 2, withChat = false, desc = '') {
    if (!user.isLogin(player))
        return;

    let vipTime = 0;
    let vipType = methods.parseInt(type);
    if (methods.parseInt(days) > 0 && user.get(player, 'vip_type') > 0 && user.get(player, 'vip_time') > 0)
        vipTime = methods.parseInt(days * 86400) + user.get(player, 'vip_time');
    else if (methods.parseInt(days) > 0)
        vipTime = methods.parseInt(days * 86400) + methods.getTimeStamp();

    user.set(player, 'vip_time', vipTime);
    user.set(player, 'vip_type', vipType);

    player.notify(`~g~Вам была выдана VIP HARD на ~s~${days}д.`);
    if (withChat)
        chat.sendToAll(`Server`, `${user.getRpName(player)} (${player.id})!{${chat.clBlue}} получил${desc}!{${chat.clWhite}} VIP HARD на ${days}д.`, chat.clBlue);
};

//Процент выпадения, Это типа, от какого процента начнет падать маска
user.giveRandomMask = function(player, proc = 50, withChat = false, desc = '') {
    if (!user.isLogin(player))
        return;

    let maskList = [];
    enums.maskList.forEach((item, i) => {
        if (item[14] > proc)
            maskList.push(i);
    });

    let maskId = maskList[methods.getRandomInt(0, maskList.length)];
    user.giveMask(player, maskId, withChat, desc);
};

//Процент выпадения, Это типа, от какого процента начнет падать маска
user.giveMask = function(player, maskId, withChat = false, desc = '') {
    if (!user.isLogin(player))
        return;

    let mask = enums.maskList[maskId];
    let itemName = mask[1];

    let params = `{"name": "${methods.removeQuotes(methods.removeQuotes2(itemName))}", "mask": ${maskId}, "desc": "${methods.getRareName(mask[14])}"}`;
    inventory.addItem(274, 1, inventory.types.Player, user.getId(player), 1, 0, params, 100);

    player.notify(`~g~Вы получили маску "${itemName}", она у вас в инвентаре.`);

    if (withChat)
        chat.sendToAll(`Server`, `${user.getRpName(player)} (${player.id})!{${chat.clBlue}} выиграл маску${desc}!{${chat.clWhite}} ${itemName}!{${chat.clBlue}} редкость!{${chat.clWhite}} ${methods.getRareName(mask[14])}`, chat.clBlue);
};

user.giveVehicle = function(player, vName, withDelete = 1, withChat = false, desc = '', isBroke = false, isFree = false, slot = 10) {
    if (!user.isLogin(player))
        return;

    let vInfo = methods.getVehicleInfo(vName);

    if (user.get(player, 'car_id' + slot) === 0 && vInfo.display_name !== 'Unknown') {

        let price = vInfo.price;
        if (isFree)
            price = 0;

        if (isBroke)
            mysql.executeQuery(`INSERT INTO cars (user_id, user_name, name, class, price, fuel, number, with_delete, s_km, s_eng, s_trans, s_fuel, s_whel, s_elec, s_break) VALUES ('${user.getId(player)}', '${user.getRpName(player)}', '${vInfo.display_name}', '${vInfo.class_name}', '${price}', '${vInfo.fuel_full}', '${vehicles.generateNumber()}', '${withDelete}', '${methods.getRandomInt(140000, 200000)}', '${methods.getRandomInt(0, 90)}', '${methods.getRandomInt(0, 90)}', '${methods.getRandomInt(0, 90)}', '${methods.getRandomInt(0, 90)}', '${methods.getRandomInt(0, 90)}', '${methods.getRandomInt(0, 90)}')`);
        else
            mysql.executeQuery(`INSERT INTO cars (user_id, user_name, name, class, price, fuel, number, with_delete) VALUES ('${user.getId(player)}', '${user.getRpName(player)}', '${vInfo.display_name}', '${vInfo.class_name}', '${price}', '${vInfo.fuel_full}', '${vehicles.generateNumber()}', '${withDelete}')`);

        setTimeout(function () {
            try {
                mysql.executeQuery(`SELECT * FROM cars WHERE user_id = '${user.getId(player)}' ORDER BY id DESC LIMIT 1`, function (err, rows) {
                    try {
                        vehicles.loadUserVehicleByRow(rows[0]);
                        user.set(player, 'car_id' + slot, rows[0]['id']);
                        user.save(player);
                    }
                    catch (e) {
                        methods.debug(e);
                    }
                });
            }
            catch (e) {
                methods.debug(e);
            }
        }, 100);

        player.notify(`~g~Вы получили автомобиль ${vInfo.display_name}.`);
        if (withChat)
            chat.sendToAll(`Server`, `${user.getRpName(player)} (${player.id})!{${chat.clBlue}} выиграл транспорт${desc}!{${chat.clWhite}} ${vInfo.display_name}`, chat.clBlue);
    }
    else {
        user.addMoney(player, vInfo.price, 'Выигрыш приза');
        player.notify(`~g~Связи с тем, что у вас был занят ${slot} слот под автомобиль, мы выдали вам денежный приз в размере ~s~${methods.moneyFormat(vInfo.price)}.`);
        user.save(player);
    }
};

user.giveUniform = function(player, id = 0) {
    if (!user.isLogin(player))
        return;

    if (id > 0) {
        user.setById(user.getId(player), 'uniform', id);
        user.updateTattoo(player);
    }

    if (user.get(player, 'mask') >= 0 && user.get(player, 'mask_color') >= 1) {
        try {
            let mask = enums.maskList[user.get(player, 'mask')];
            user.setComponentVariation(player, 1, mask[2], mask[3]);
        }
        catch (e) {

        }
    }

    if (id === 0) { //default
        user.resetById(user.getId(player), 'uniform');
        user.updateCharacterCloth(player);
        user.updateCharacterFace(player);
    }
    else if (id === 1) { //SAPD 1 (Cadet)
        user.clearAllProp(player);

        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 3, 0, 0);
            user.setComponentVariation(player, 4, 37, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 29, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 35, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 86, 0);
        }
        else {
            user.setComponentVariation(player, 0, 1, 0);
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 11, 0);
            user.setComponentVariation(player, 4, 25, 2);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 54, 0);
            user.setComponentVariation(player, 7, 38, 0);
            user.setComponentVariation(player, 8, 58, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 13, 3);
        }
    }
    else if (id === 2) { //SAPD 2 (Officer)
        user.clearAllProp(player);

        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 0, 1, 0);
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 14, 0);
            user.setComponentVariation(player, 4, 34, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 52, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 35, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 48, 0);

            if (user.get(player, 'rank') === 2 && user.get(player, 'rank_type') > 0)
                user.setComponentVariation(player, 10, 7, 1);
            else if (user.get(player, 'rank') === 1)
                user.setComponentVariation(player, 10, 7, 2);
            else if (user.get(player, 'rank') === 0)
                user.setComponentVariation(player, 10, 7, 3);
        }
        else {
            user.setComponentVariation(player, 0, 1, 0);
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 0, 0);
            user.setComponentVariation(player, 4, 25, 2);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 54, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 58, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 55, 0);

            if (user.get(player, 'rank') === 2 && user.get(player, 'rank_type') > 0)
                user.setComponentVariation(player, 10, 8, 1);
            else if (user.get(player, 'rank') === 1)
                user.setComponentVariation(player, 10, 8, 2);
            else if (user.get(player, 'rank') === 0)
                user.setComponentVariation(player, 10, 8, 3);
        }

        user.setComponentVariation(player, 9, 0, 0);
    }
    else if (id === 3) { //SAPD 3 (Officer Armour)
        user.clearAllProp(player);

        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 0, 1, 0);
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 14, 0);
            user.setComponentVariation(player, 4, 34, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 52, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 35, 0);
            user.setComponentVariation(player, 9, 6, 1);
            user.setComponentVariation(player, 10, 70, 1);
            user.setComponentVariation(player, 11, 48, 0);

            if (user.get(player, 'rank') === 2 && user.get(player, 'rank_type') > 0)
                user.setComponentVariation(player, 10, 7, 1);
            else if (user.get(player, 'rank') === 1)
                user.setComponentVariation(player, 10, 7, 2);
            else if (user.get(player, 'rank') === 0)
                user.setComponentVariation(player, 10, 7, 3);
        }
        else {
            user.setComponentVariation(player, 0, 1, 0);
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 0, 0);
            user.setComponentVariation(player, 4, 25, 2);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 54, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 58, 0);
            user.setComponentVariation(player, 9, 4, 1);
            user.setComponentVariation(player, 10, 70, 1);
            user.setComponentVariation(player, 11, 55, 0);

            if (user.get(player, 'rank') === 2 && user.get(player, 'rank_type') > 0)
                user.setComponentVariation(player, 10, 8, 1);
            else if (user.get(player, 'rank') === 1)
                user.setComponentVariation(player, 10, 8, 2);
            else if (user.get(player, 'rank') === 0)
                user.setComponentVariation(player, 10, 8, 3);
        }
    }
    else if (id === 4) { //SAPD 4 (Tactical)
        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 3, 18, 0);
            user.setComponentVariation(player, 4, 32, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 25, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 152, 0);
            user.setComponentVariation(player, 9, 6, 1);
            user.setComponentVariation(player, 10, 70, 1);
            user.setComponentVariation(player, 11, 46, 0);

            user.setProp(player, 0, 116, 0);
        }
        else {
            user.setComponentVariation(player, 3, 17, 0);
            user.setComponentVariation(player, 4, 33, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 25, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 122, 0);
            user.setComponentVariation(player, 9, 1, 1);
            user.setComponentVariation(player, 10, 70, 1);
            user.setComponentVariation(player, 11, 53, 0);

            user.setProp(player, 0, 117, 0);
        }
    }
    else if (id === 5) { //SAPD 5 (Tactical)
        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 3, 18, 0);
            user.setComponentVariation(player, 4, 32, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 25, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 152, 0);
            user.setComponentVariation(player, 9, 6, 1);
            user.setComponentVariation(player, 10, 70, 1);
            user.setComponentVariation(player, 11, 46, 0);

            user.setProp(player, 0, 116, 24);
        }
        else {
            user.setComponentVariation(player, 3, 17, 0);
            user.setComponentVariation(player, 4, 33, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 25, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 122, 0);
            user.setComponentVariation(player, 9, 1, 1);
            user.setComponentVariation(player, 10, 70, 1);
            user.setComponentVariation(player, 11, 53, 0);

            user.setProp(player, 0, 117, 24);
        }
    }
    else if (id === 6) { //SAPD 6 (Tactical)
        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 3, 18, 0);
            user.setComponentVariation(player, 4, 32, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 25, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 152, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 79, 1);
            user.setComponentVariation(player, 11, 331, 0);

            user.setProp(player, 0, 140, 0);
        }
        else {
            user.setComponentVariation(player, 3, 17, 0);
            user.setComponentVariation(player, 4, 33, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 25, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 122, 0);
            user.setComponentVariation(player, 9, 1, 1);
            user.setComponentVariation(player, 10, 70, 1);
            user.setComponentVariation(player, 11, 320, 0);

            user.setProp(player, 0, 141, 0);
        }
    }
    else if (id === 7) { //SAPD 7 (Tactical)
        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 3, 18, 0);
            user.setComponentVariation(player, 4, 32, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 25, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 152, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 79, 1);
            user.setComponentVariation(player, 11, 331, 0);

            user.setProp(player, 0, 116, 0);
        }
        else {
            user.setComponentVariation(player, 3, 17, 0);
            user.setComponentVariation(player, 4, 33, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 25, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 122, 0);
            user.setComponentVariation(player, 9, 1, 1);
            user.setComponentVariation(player, 10, 70, 1);
            user.setComponentVariation(player, 11, 320, 0);

            user.setProp(player, 0, 117, 0);
        }
    }
    else if (id === 8) { //SAPD 8 (Tactical)
        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 3, 18, 0);
            user.setComponentVariation(player, 4, 30, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 25, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 152, 0);
            user.setComponentVariation(player, 9, 6, 1);
            user.setComponentVariation(player, 10, 70, 1);
            user.setComponentVariation(player, 11, 103, 4);

            user.setProp(player, 0, 58, 2);
        }
        else {
            user.setComponentVariation(player, 3, 17, 0);
            user.setComponentVariation(player, 4, 31, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 25, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 122, 0);
            user.setComponentVariation(player, 9, 1, 1);
            user.setComponentVariation(player, 10, 70, 1);
            user.setComponentVariation(player, 11, 111, 4);

            user.setProp(player, 0, 58, 2);
        }
    }
    else if (id === 9) { //SAPD 9 (Tactical)
        user.setComponentVariation(player, 7, 0, 0);
        user.setComponentVariation(player, 9, 0, 0);

        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 3, 0, 0);
            user.setComponentVariation(player, 4, 6, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 29, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 160, 0);
            user.setComponentVariation(player, 9, 6, 1);
            user.setComponentVariation(player, 10, 70, 1);
            user.setComponentVariation(player, 11, 27, 5);

            user.setProp(player, 0, 120, 0);
        }
        else {
            user.setComponentVariation(player, 3, 11, 0);
            user.setComponentVariation(player, 4, 10, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 54, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 130, 0);
            user.setComponentVariation(player, 9, 1, 1);
            user.setComponentVariation(player, 10, 70, 1);
            user.setComponentVariation(player, 11, 95, 0);

            user.setProp(player, 0, 121, 0);
        }
    }
    else if (id === 10) { //SAPD 10 (Tactical)
        user.setComponentVariation(player, 1, 0, 0);
        user.setComponentVariation(player, 7, 0, 0);
        user.setComponentVariation(player, 9, 0, 0);

        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 0, 0);
            user.setComponentVariation(player, 4, 6, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 29, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 160, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 27, 5);

            user.setProp(player, 0, 120, 0);
        }
        else {
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 11, 0);
            user.setComponentVariation(player, 4, 10, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 40, 9);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 130, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 95, 0);

            user.setProp(player, 0, 121, 0);
        }
    }
    else if (id === 11) { //SAPD 11 (Tactical)
        user.setProp(player, 0, 19, 0);

        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 0, 1, 0);
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 19, 0);
            user.setComponentVariation(player, 4, 38, 2);
            user.setComponentVariation(player, 5, 57, 9);
            user.setComponentVariation(player, 6, 52, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 35, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 59, 2);
        }
        else {
            user.setComponentVariation(player, 0, 1, 0);
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 18, 4);
            user.setComponentVariation(player, 4, 9, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 24, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 57, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 48, 0);
        }
    }
    else if (id === 12) { //SAPD 12 (Tactical)
        user.clearAllProp(player);

        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 0, 0, 0);
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 5, 0);
            user.setComponentVariation(player, 4, 6, 2);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 29, 0);
            user.setComponentVariation(player, 7, 86, 0);
            user.setComponentVariation(player, 8, 38, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 6, 2);
        }
        else {
            user.setComponentVariation(player, 0, 0, 0);
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 4, 0);
            user.setComponentVariation(player, 4, 10, 2);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 10, 0);
            user.setComponentVariation(player, 7, 115, 0);
            user.setComponentVariation(player, 8, 10, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 28, 2);
        }
    }
    else if (id === 13) { //BCSD 1 (Cadet)
        user.clearAllProp(player);
        if (user.getSex(player) == 1)
        {
            user.setComponentVariation(player, 8, 35, 0);
            user.setComponentVariation(player, 3, 0, 0);
            user.setComponentVariation(player, 11, 27, 1);
            user.setComponentVariation(player, 4, 64, 2);
            user.setComponentVariation(player, 6, 55, 0);
        }
        else
        {
            user.setProp(player, 0, 13, 4);
            user.setComponentVariation(player, 8, 58, 0);
            user.setComponentVariation(player, 3, 11, 0);
            user.setComponentVariation(player, 11, 26, 1);
            user.setComponentVariation(player, 7, 10, 2);
            user.setComponentVariation(player, 4, 23, 1);
            user.setComponentVariation(player, 6, 54, 0);
        }
    }
    else if (id === 14) { //BCSD 2 (Cadet)
        user.clearAllProp(player);
        if (user.getSex(player) == 1)
        {
            user.setComponentVariation(player, 8, 35, 0);
            user.setComponentVariation(player, 3, 0, 0);
            user.setComponentVariation(player, 11, 27, 2);
            user.setComponentVariation(player, 4, 64, 2);
            user.setComponentVariation(player, 6, 55, 0);
        }
        else
        {
            user.setProp(player, 0, 13, 7);
            user.setComponentVariation(player, 8, 58, 0);
            user.setComponentVariation(player, 3, 11, 0);
            user.setComponentVariation(player, 11, 13, 1);
            user.setComponentVariation(player, 7, 10, 2);
            user.setComponentVariation(player, 4, 23, 1);
            user.setComponentVariation(player, 6, 54, 0);
        }
    }
    else if (id === 15) { //BCSD 3 (Cadet)
        user.clearAllProp(player);
        if (user.getSex(player) == 1)
        {
            user.setComponentVariation(player, 8, 35, 0);
            user.setComponentVariation(player, 3, 0, 0);
            user.setComponentVariation(player, 11, 27, 5);
            user.setComponentVariation(player, 4, 64, 2);
            user.setComponentVariation(player, 6, 55, 0);
        }
        else
        {
            user.setProp(player, 0, 13, 3);
            user.setComponentVariation(player, 8, 58, 0);
            user.setComponentVariation(player, 3, 11, 0);
            user.setComponentVariation(player, 11, 13, 0);
            user.setComponentVariation(player, 7, 10, 2);
            user.setComponentVariation(player, 4, 23, 1);
            user.setComponentVariation(player, 6, 54, 0);
        }
    }
    else if (id === 16) { //BCSD 4 (Cadet)
        user.clearAllProp(player);
        if (user.getSex(player) == 1)
        {
            user.setComponentVariation(player, 0, 1, 0);
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 14, 0);
            user.setComponentVariation(player, 4, 64, 1);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 55, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 159, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 329, 0);
        }
        else
        {
            user.setProp(player, 0, 13, 2);
            user.setComponentVariation(player, 8, 58, 0);
            user.setComponentVariation(player, 3, 11, 0);
            user.setComponentVariation(player, 11, 13, 2);
            user.setComponentVariation(player, 7, 10, 2);
            user.setComponentVariation(player, 4, 23, 1);
            user.setComponentVariation(player, 6, 54, 0);
        }
    }
    else if (id === 17) { //BCSD 5 (Cadet)
        user.clearAllProp(player);
        if (user.getSex(player) == 1)
        {
            user.setComponentVariation(player, 0, 1, 0);
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 14, 0);
            user.setComponentVariation(player, 4, 64, 1);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 55, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 159, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 329, 4);
        }
        else
        {
            user.setComponentVariation(player, 0, 1, 0);
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 11, 0);
            user.setComponentVariation(player, 4, 25, 6);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 54, 0);
            user.setComponentVariation(player, 7, 38, 7);
            user.setComponentVariation(player, 8, 58, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 26, 4);
        }
    }
    else if (id === 18) { //BCSD 6 (Cadet)
        user.clearAllProp(player);
        if (user.getSex(player) == 1)
        {
            user.setComponentVariation(player, 0, 1, 0);
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 14, 0);
            user.setComponentVariation(player, 4, 64, 1);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 55, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 159, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 329, 2);
        }
        else
        {
            user.setComponentVariation(player, 0, 1, 0);
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 11, 0);
            user.setComponentVariation(player, 4, 25, 6);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 54, 0);
            user.setComponentVariation(player, 7, 38, 7);
            user.setComponentVariation(player, 8, 58, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 26, 1);
        }
    }
    else if (id === 19) { //BCSD 7 (Cadet)
        user.clearAllProp(player);
        if (user.getSex(player) == 1)
        {
            user.setComponentVariation(player, 0, 1, 0);
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 14, 0);
            user.setComponentVariation(player, 4, 64, 1);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 55, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 159, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 329, 1);
        }
        else
        {
            user.setComponentVariation(player, 0, 1, 0);
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 11, 0);
            user.setComponentVariation(player, 4, 25, 6);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 54, 0);
            user.setComponentVariation(player, 7, 38, 7);
            user.setComponentVariation(player, 8, 58, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 26, 2);
        }
    }
    else if (id === 20) { //BCSD 8 (Cadet)
        user.clearAllProp(player);
        if (user.getSex(player) == 1)
        {
            user.setComponentVariation(player, 0, 1, 0);
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 14, 0);
            user.setComponentVariation(player, 4, 64, 1);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 55, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 159, 0);
            user.setComponentVariation(player, 9, 6, 1);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 329, 4);
        }
        else
        {
            user.setComponentVariation(player, 0, 1, 0);
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 11, 0);
            user.setComponentVariation(player, 4, 25, 6);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 54, 0);
            user.setComponentVariation(player, 7, 38, 7);
            user.setComponentVariation(player, 8, 58, 0);
            user.setComponentVariation(player, 9, 4, 1);
            user.setComponentVariation(player, 10, 70, 1);
            user.setComponentVariation(player, 11, 26, 2);
        }
    }
    else if (id === 21) { //BCSD 9 (Cadet)
        user.clearAllProp(player);
        user.setProp(player, 0, 19, 0);

        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 0, 1, 0);
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 19, 0);
            user.setComponentVariation(player, 4, 38, 2);
            user.setComponentVariation(player, 5, 57, 9);
            user.setComponentVariation(player, 6, 52, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 152, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 59, 2);
        }
        else {
            user.setComponentVariation(player, 0, 1, 0);
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 18, 4);
            user.setComponentVariation(player, 4, 9, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 24, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 122, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 48, 0);
        }
    }
    else if (id === 22) { //BCSD 10 (Tactical)
        //user.clearAllProp(player);
        user.setComponentVariation(player, 7, 0, 0);
        if (user.getSex(player) == 1)
        {
            user.setProp(player, 0, 116, 1);
            user.setComponentVariation(player, 6, 52, 0);
            user.setComponentVariation(player, 0, 21, 0);
            user.setComponentVariation(player, 8, 160, 0);
            user.setComponentVariation(player, 3, 18, 0);
            user.setComponentVariation(player, 11, 46, 2);
            user.setComponentVariation(player, 9, 6, 2);
            user.setComponentVariation(player, 10, 70, 1);
            user.setComponentVariation(player, 4, 61, 7);
            user.setComponentVariation(player, 6, 24, 0);
        }
        else
        {
            user.setProp(player, 0, 117, 1);
            user.setComponentVariation(player, 6, 52, 0);
            user.setComponentVariation(player, 8, 130, 0);
            user.setComponentVariation(player, 3, 17, 0);
            user.setComponentVariation(player, 11, 53, 2);
            user.setComponentVariation(player, 10, 70, 1);
            user.setComponentVariation(player, 9, 1, 2);
            user.setComponentVariation(player, 4, 59, 7);
            user.setComponentVariation(player, 6, 24, 0);
        }
    }
    else if (id === 23) { //BCSD 11 (Cadet)
        user.clearAllProp(player);

        if (user.getSex(player) == 1)
        {
            user.setComponentVariation(player, 0, 0, 0);
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 5, 0);
            user.setComponentVariation(player, 4, 6, 1);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 29, 0);
            user.setComponentVariation(player, 7, 86, 0);
            user.setComponentVariation(player, 8, 38, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 6, 1);
        }
        else
        {
            user.setComponentVariation(player, 0, 0, 0);
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 4, 0);
            user.setComponentVariation(player, 4, 10, 1);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 10, 0);
            user.setComponentVariation(player, 7, 115, 0);
            user.setComponentVariation(player, 8, 10, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 28, 1);
        }
    }
    else if (id === 24) { //EMS 1
        user.clearAllProp(player);

        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 109, 0);
            user.setComponentVariation(player, 4, 99, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 72, 0);
            user.setComponentVariation(player, 7, 96, 0);
            user.setComponentVariation(player, 8, 159, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 258, 0);
        }
        else {
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 85, 0);
            user.setComponentVariation(player, 4, 96, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 51, 0);
            user.setComponentVariation(player, 7, 127, 0);
            user.setComponentVariation(player, 8, 129, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 58, 0);
            user.setComponentVariation(player, 11, 250, 0);
        }
    }
    else if (id === 25) { //EMS 2
        user.clearAllProp(player);

        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 109, 0);
            user.setComponentVariation(player, 4, 99, 1);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 72, 0);
            user.setComponentVariation(player, 7, 97, 0);
            user.setComponentVariation(player, 8, 159, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 258, 1);
        }
        else {
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 85, 0);
            user.setComponentVariation(player, 4, 96,  1);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 51, 0);
            user.setComponentVariation(player, 7, 126, 0);
            user.setComponentVariation(player, 8, 129, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 58, 0);
            user.setComponentVariation(player, 11, 250,  1);
        }
    }
    else if (id === 26) { //EMS 3
        user.clearAllProp(player);

        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 104, 0);
            user.setComponentVariation(player, 4, 99, 1);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 72, 0);
            user.setComponentVariation(player, 7, 96, 0);
            user.setComponentVariation(player, 8, 15, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 257, 0);
        }
        else {
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 85, 0);
            user.setComponentVariation(player, 4, 96,  0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 51, 0);
            user.setComponentVariation(player, 7, 127, 0);
            user.setComponentVariation(player, 8, 15, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 57, 0);
            user.setComponentVariation(player, 11, 249,  0);
        }
    }
    else if (id === 27) { //EMS 4
        user.clearAllProp(player);

        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 104, 0);
            user.setComponentVariation(player, 4, 99, 1);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 72, 0);
            user.setComponentVariation(player, 7, 97, 0);
            user.setComponentVariation(player, 8, 15, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 257, 1);
        }
        else {
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 85, 0);
            user.setComponentVariation(player, 4, 96,  1);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 51, 0);
            user.setComponentVariation(player, 7, 126, 0);
            user.setComponentVariation(player, 8, 15, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 57, 0);
            user.setComponentVariation(player, 11, 249,  1);
        }
    }
    else if (id === 28) { //EMS 5
        user.clearAllProp(player);

        if (user.getSex(player) == 1) {
            user.setProp(player, 0, 136, 0);
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 127, 3);
            user.setComponentVariation(player, 4, 126, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 72, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 0, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 73, 0);
            user.setComponentVariation(player, 11, 325, 0);
        }
        else {
            user.setProp(player, 0, 137, 0);
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 110, 3);
            user.setComponentVariation(player, 4, 120,  0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 51, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 0, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 314,  0);
        }
    }
    else if (id === 29) { //EMS 6
        user.clearAllProp(player);

        if (user.getSex(player) == 1) {
            user.setProp(player, 0, 137, 0);
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 127, 3);
            user.setComponentVariation(player, 4, 126, 1);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 72, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 187, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 73, 0);
            user.setComponentVariation(player, 11, 325, 1);
        }
        else {
            user.setProp(player, 0, 138, 0);
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 110, 3);
            user.setComponentVariation(player, 4, 120,  1);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 51, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 151, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 314,  1);
        }
    }
    else if (id === 30) { //EMS 7
        user.clearAllProp(player);

        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 109, 0);
            user.setComponentVariation(player, 4, 23, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 72, 0);
            user.setComponentVariation(player, 7, 97, 0);
            user.setComponentVariation(player, 8, 15, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 333, 0);
        }
        else {
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 85, 0);
            user.setComponentVariation(player, 4, 28,  8);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 42, 0);
            user.setComponentVariation(player, 7, 126, 0);
            user.setComponentVariation(player, 8, 15, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 321,  0);
        }
    }
    else if (id === 31) { //EMS 8
        user.clearAllProp(player);

        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 7, 97, 0);
            user.setComponentVariation(player, 8, 15, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);

            user.setComponentVariation(player, 3, 47, 0);
            user.setComponentVariation(player, 4, 97, 19);
            user.setComponentVariation(player, 11, 75, 2);
            user.setComponentVariation(player, 10, 329, 0);
            user.setComponentVariation(player, 6, 79, 25);
            user.setProp(player, 2, 257, 0);
        }
        else {

            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 7, 126, 0);
            user.setComponentVariation(player, 8, 15, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);

            user.setComponentVariation(player, 3, 36, 0);
            user.setComponentVariation(player, 4, 33, 0);
            user.setComponentVariation(player, 11, 38, 3);
            user.setComponentVariation(player, 10, 64, 0);
            user.setComponentVariation(player, 6, 24, 0);
            user.setProp(player, 2, 1, 0);
        }
    }
    else if (id === 32) { //EMS 8
        user.clearAllProp(player);

        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 7, 97, 0);
            user.setComponentVariation(player, 8, 15, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);

            user.setComponentVariation(player, 6, 79, 25);
            user.setComponentVariation(player, 4, 49, 1);
            user.setComponentVariation(player, 11, 136, 4);
            user.setComponentVariation(player, 10, 65, 0);
            user.setComponentVariation(player, 3, 3, 0);
        }
        else {

            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 7, 126, 0);
            user.setComponentVariation(player, 8, 15, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);

            user.setComponentVariation(player, 3, 88, 0);
            user.setComponentVariation(player, 6, 75, 25);
            user.setComponentVariation(player, 4, 47, 1);
            user.setComponentVariation(player, 11, 139, 4);
            user.setComponentVariation(player, 10, 57, 0);
        }
    }
    else if (id === 33) { //EMS 8
        user.clearAllProp(player);

        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 7, 97, 0);
            user.setComponentVariation(player, 8, 15, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);

            user.setComponentVariation(player, 3, 97, 0);
            user.setComponentVariation(player, 4, 36, 4);
            user.setComponentVariation(player, 11, 330, 6);
            user.setComponentVariation(player, 7, 96, 0);
            user.setComponentVariation(player, 6, 13, 5);
            user.setComponentVariation(player, 10, 57, 0);
        }
        else {

            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 7, 126, 0);
            user.setComponentVariation(player, 8, 15, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);

            user.setComponentVariation(player, 3, 74, 0);
            user.setComponentVariation(player, 11, 43, 0);
            user.setComponentVariation(player, 4, 48, 1);
            user.setComponentVariation(player, 6, 15, 7);
            user.setComponentVariation(player, 7, 127, 0);
        }
    }
    else if (id === 34) { //EMS 8
        user.clearAllProp(player);

        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 7, 97, 0);
            user.setComponentVariation(player, 8, 15, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);

            user.setComponentVariation(player, 3, 109, 0);
            user.setComponentVariation(player, 11, 14, 0);
            user.setComponentVariation(player, 4, 23, 0);
            user.setComponentVariation(player, 6, 1, 3);
            user.setComponentVariation(player, 10, 65, 0);
            user.setComponentVariation(player, 7, 96, 0);
        }
        else {

            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 7, 126, 0);
            user.setComponentVariation(player, 8, 15, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);

            user.setComponentVariation(player, 3, 85, 0);
            user.setComponentVariation(player, 11, 241, 1);
            user.setComponentVariation(player, 4, 48, 2);
            user.setComponentVariation(player, 6, 42, 0);
            user.setComponentVariation(player, 10, 57, 0);
            user.setComponentVariation(player, 7, 126, 0);
        }
    }
    else if (id === 35) { //EMS 8
        user.clearAllProp(player);

        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 7, 97, 0);
            user.setComponentVariation(player, 8, 15, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);

            user.setComponentVariation(player, 11, 57, 7);
            user.setComponentVariation(player, 4, 51, 2);
            user.setComponentVariation(player, 8, 64, 0);
            user.setComponentVariation(player, 3, 0, 0);
            user.setComponentVariation(player, 6, 0, 2);
        }
        else {

            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 7, 126, 0);
            user.setComponentVariation(player, 8, 15, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);

            user.setComponentVariation(player, 3, 1, 0);
            user.setComponentVariation(player, 11, 31, 7);
            user.setComponentVariation(player, 4, 28, 8);
            user.setComponentVariation(player, 6, 42, 2);
            user.setComponentVariation(player, 8, 31, 0);
        }
    }
    else if (id === 36) { //Gov1 1
        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 7, 86, 1);
        }
        else {
            user.setComponentVariation(player, 7, 115, 1);
        }
    }
    else if (id === 37) { //Gov1 1
        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 7, 86, 0);
        }
        else {
            user.setComponentVariation(player, 7, 115, 0);
        }
    }
    else if (id === 38) { //USMC
        user.clearAllProp(player);

        if (user.getSex(player) == 1)
        {
            user.setComponentVariation(player, 0, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 3, 14, 0);
            user.setComponentVariation(player, 4, 90, 3);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 36, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 0, 240);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 232, 3);

            user.setProp(player, 0, 106, 3);
        }
        else
        {
            user.setComponentVariation(player, 0, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 3, 11, 0);
            user.setComponentVariation(player, 4, 87, 3);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 35, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 0, 240);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 222, 3);

            user.setProp(player, 0, 107, 3);
        }
    }
    else if (id === 39) { //USMC
        user.clearAllProp(player);

        if (user.getSex(player) == 1)
        {
            user.setComponentVariation(player, 0, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 3, 3, 0);
            user.setComponentVariation(player, 4, 90, 3);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 36, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 0, 240);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 231, 3);

            user.setProp(player, 0, 106, 3);
        }
        else
        {
            user.setComponentVariation(player, 0, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 3, 11, 0);
            user.setComponentVariation(player, 4, 87, 3);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 35, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 0, 240);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 221, 3);

            user.setProp(player, 0, 107, 3);
        }
    }
    else if (id === 40) { //USMC
        user.clearAllProp(player);

        if (user.getSex(player) == 1)
        {
            user.setComponentVariation(player, 0, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 3, 3, 0);
            user.setComponentVariation(player, 4, 90, 3);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 36, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 0, 240);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 231, 3);

            user.setProp(player, 0, 112, 12);
        }
        else
        {
            user.setComponentVariation(player, 0, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 3, 11, 0);
            user.setComponentVariation(player, 4, 87, 3);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 35, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 0, 240);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 221, 3);

            user.setProp(player, 0, 113, 12);
        }
    }
    else if (id === 41) { //USMC
        user.clearAllProp(player);

        if (user.getSex(player) == 1)
        {
            user.setComponentVariation(player, 0, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 3, 3, 0);
            user.setComponentVariation(player, 4, 90, 3);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 36, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 18, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 230, 3);

            user.setProp(player, 0, 116, 3);
        }
        else
        {
            user.setComponentVariation(player, 0, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 3, 17, 1);
            user.setComponentVariation(player, 4, 87, 3);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 35, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 0, 240);
            user.setComponentVariation(player, 9, 16, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 220, 3);

            user.setProp(player, 0, 117, 3);
        }
    }
    else if (id === 42) { //USMC
        user.clearAllProp(player);

        if (user.getSex(player) == 1)
        {
            user.setComponentVariation(player, 0, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 3, 14, 0);
            user.setComponentVariation(player, 4, 90, 3);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 36, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 18, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 232, 3);

            user.setProp(player, 0, 116, 3);
        }
        else
        {
            user.setComponentVariation(player, 0, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 3, 11, 0);
            user.setComponentVariation(player, 4, 87, 3);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 35, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 0, 240);
            user.setComponentVariation(player, 9, 16, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 222, 3);

            user.setProp(player, 0, 117, 3);
        }
    }
    else if (id === 43) { //USMC
        user.clearAllProp(player);

        user.setProp(player, 0, 19, 0);

        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 0, 1, 0);
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 19, 0);
            user.setComponentVariation(player, 4, 38, 2);
            user.setComponentVariation(player, 5, 57, 9);
            user.setComponentVariation(player, 6, 52, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 152, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 59, 2);
        }
        else {
            user.setComponentVariation(player, 0, 1, 0);
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 18, 4);
            user.setComponentVariation(player, 4, 92, 5);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 24, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 122, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 228, 5);
        }
    }
    else if (id === 44) { //USMC
        user.clearAllProp(player);

        if (user.getSex(player) == 1) {
            user.setProp(player, 0, 19, 0);
            user.setComponentVariation(player, 0, 1, 0);
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 19, 0);
            user.setComponentVariation(player, 4, 38, 2);
            user.setComponentVariation(player, 5, 57, 9);
            user.setComponentVariation(player, 6, 52, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 152, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 59, 2);
        }
        else {
            user.setProp(player, 0, 38, 0);
            user.setComponentVariation(player, 0, 1, 0);
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 18, 4);
            user.setComponentVariation(player, 4, 9, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 24, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 122, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 48, 0);
        }
    }
    else if (id === 45) { //USMC
        user.clearAllProp(player);

        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 0, 0, 0);
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 3, 0);
            user.setComponentVariation(player, 4, 37, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 29, 0);
            user.setComponentVariation(player, 7, 86, 1);
            user.setComponentVariation(player, 8, 38, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 58, 0);

            user.setProp(player, 0, 112, 6);
        }
        else {
            user.setComponentVariation(player, 0, 0, 0);
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 4, 0);
            user.setComponentVariation(player, 4, 10, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 10, 0);
            user.setComponentVariation(player, 7, 115, 1);
            user.setComponentVariation(player, 8, 10, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 28, 0);

            user.setProp(player, 0, 113, 6);
        }
    }
    else if (id === 46) { //USMC
        user.clearAllProp(player);

        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 0, 0, 0);
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 18, 0);
            user.setComponentVariation(player, 4, 90, 3);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 25, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 0, -1);
            user.setComponentVariation(player, 9, 18, 2);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 230, 3);

            user.setProp(player, 0, 116, 0);
        }
        else {
            user.setComponentVariation(player, 0, 0, 0);
            user.setComponentVariation(player, 1, 0, 0);
            user.setComponentVariation(player, 3, 17, 0);
            user.setComponentVariation(player, 4, 87, 3);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 25, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 0, -1);
            user.setComponentVariation(player, 9, 16, 2);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 220, 3);

            user.setProp(player, 0, 107, 0);
        }
    }
    else if (id === 47) { //FIB

        user.clearAllProp(player);
        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 9, 55, 0);
        }
        else {
            user.setComponentVariation(player, 9, 55, 0);
        }
    }
    else if (id === 48) { //FIB
        user.clearAllProp(player);

        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 3, 97, 1);
            user.setComponentVariation(player, 8, 38, 0);
            user.setComponentVariation(player, 9, 54, 0);
            user.setComponentVariation(player, 11, 240, 6);

        }
        else {
            user.setComponentVariation(player, 3, 94, 1);
            user.setComponentVariation(player, 8, 10, 0);
            user.setComponentVariation(player, 9, 54, 0);
            user.setComponentVariation(player, 11, 3, 4);
        }
    }
    else if (id === 49) { //FIB
        user.clearAllProp(player);

        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 3, 18, 0);
            user.setComponentVariation(player, 4, 32, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 25, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 152, 0);
            user.setComponentVariation(player, 9, 6, 1);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 46, 0);

            user.setProp(player, 0, 116, 0);
        }
        else {
            user.setComponentVariation(player, 3, 17, 0);
            user.setComponentVariation(player, 4, 33, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 25, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 122, 0);
            user.setComponentVariation(player, 9, 1, 1);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 53, 0);

            user.setProp(player, 0, 117, 0);
        }
    }
    else if (id === 50) { //Cartel
        user.clearAllProp(player);

        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 3, 11, 0);
            user.setComponentVariation(player, 4, 109, 14);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 36, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 0, 240);
            user.setComponentVariation(player, 9, 1, 4);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 226, 20);
        }
        else {
            user.setComponentVariation(player, 4, 102, 14);
            user.setComponentVariation(player, 3, 15, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 35, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 9, 6, 4);
            user.setComponentVariation(player, 8, 0, 240);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 239, 20);
        }
    }
    else if (id === 51) { //Cartel
        user.clearAllProp(player);

        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 3, 11, 0);
            user.setComponentVariation(player, 4, 110, 14);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 62, 13);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 0, 240);
            user.setComponentVariation(player, 9, 1, 4);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 226, 20);
        }
        else {
            user.setComponentVariation(player, 3, 15, 0);
            user.setComponentVariation(player, 4, 103, 14);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 73, 15);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 0, 240);
            user.setComponentVariation(player, 9, 6, 4);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 239, 20);
        }
    }
    else if (id === 52) { //Cartel
        user.clearAllProp(player);

        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 3, 14, 0);
            user.setComponentVariation(player, 4, 109, 14);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 36, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 0, 240);
            user.setComponentVariation(player, 9, 1, 4);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 224, 20);
        }
        else {
            user.setComponentVariation(player, 3, 0, 0);
            user.setComponentVariation(player, 4, 103, 14);
            user.setComponentVariation(player, 6, 73, 15);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 8, 0, 240);
            user.setComponentVariation(player, 9, 6, 4);
            user.setComponentVariation(player, 11, 208, 20);
        }
    }
    else if (id === 53) { //Cartel
        user.clearAllProp(player);

        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 3, 14, 0);
            user.setComponentVariation(player, 4, 110, 14);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 62, 13);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 0, 240);
            user.setComponentVariation(player, 9, 1, 4);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 224, 20);
        }
        else {
            user.setComponentVariation(player, 3, 0, 0);
            user.setComponentVariation(player, 4, 102, 14);
            user.setComponentVariation(player, 6, 73, 15);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 9, 6, 4);
            user.setComponentVariation(player, 8, 0, 240);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 208, 20);
        }
    }
    else if (id === 54) { //Cartel
        user.clearAllProp(player);

        if (user.getSex(player) == 1) {

        }
        else {
            user.setComponentVariation(player, 3, 2, 0);
            user.setComponentVariation(player, 4, 103, 14);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 73, 15);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 0, 240);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 213, 20);
        }
    }
    else if (id === 60) { //Gov
        user.clearAllProp(player);

        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 3, 7, 0);
            user.setComponentVariation(player, 4, 6, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 6, 0);
            user.setComponentVariation(player, 7, 86, 1);
            user.setComponentVariation(player, 8, 38, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 25, 7);
        }
        else {
            user.setComponentVariation(player, 3, 11, 0);
            user.setComponentVariation(player, 4, 13, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 10, 0);
            user.setComponentVariation(player, 7, 115, 1);
            user.setComponentVariation(player, 8, 0, 240);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 13, 0);
        }
    }
    else if (id === 61) { //Gov
        user.clearAllProp(player);

        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 3, 7, 0);
            user.setComponentVariation(player, 4, 6, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 29, 0);
            user.setComponentVariation(player, 7, 28, 13);
            user.setComponentVariation(player, 8, 196, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 7, 0);
            user.setProp(player, 2, 2, 0);
        }
        else {
            user.setComponentVariation(player, 3, 12, 0);
            user.setComponentVariation(player, 4, 25, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 10, 0);
            user.setComponentVariation(player, 7, 20, 0);
            user.setComponentVariation(player, 8, 162, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 10, 0);
            user.setProp(player, 0, 121, 0);
            user.setProp(player, 1, 0, 0);
            user.setProp(player, 2, 0, 0);
        }
    }
    else if (id === 62) { //Gov
        user.clearAllProp(player);

        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 3, 9, 0);
            user.setComponentVariation(player, 4, 6, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 29, 0);
            user.setComponentVariation(player, 7, 28, 13);
            user.setComponentVariation(player, 8, 196, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 64, 1);
            user.setProp(player, 2, 2, 0);
        }
        else {
            user.setComponentVariation(player, 3, 12, 0);
            user.setComponentVariation(player, 4, 25, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 25, 0);
            user.setComponentVariation(player, 7, 20, 0);
            user.setComponentVariation(player, 8, 160, 0);
            user.setComponentVariation(player, 9, 0, 0);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 142, 0);
            user.setProp(player, 0, 121, 0);
            user.setProp(player, 1, 0, 0);
            user.setProp(player, 2, 0, 0);
        }
    }
    else if (id === 99) { //GR6 1
        user.clearAllProp(player);

        if (user.getSex(player) == 1) {
            user.setComponentVariation(player, 3, 14, 0);
            user.setComponentVariation(player, 4, 34, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 25, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 152, 0);
            user.setComponentVariation(player, 9, 6, 1);
            user.setComponentVariation(player, 10, 0, 0);
            user.setComponentVariation(player, 11, 85, 0);
        }
        else {
            user.setComponentVariation(player, 3, 11, 0);
            user.setComponentVariation(player, 4, 13, 0);
            user.setComponentVariation(player, 5, 0, 0);
            user.setComponentVariation(player, 6, 25, 0);
            user.setComponentVariation(player, 7, 0, 0);
            user.setComponentVariation(player, 8, 122, 0);
            user.setComponentVariation(player, 9, 7, 1);
            user.setComponentVariation(player, 10, 71, 0);
            user.setComponentVariation(player, 11, 318, 1);
        }
    }

    user.updateClientCache(player);
    setTimeout(function () {
        user.updateCharacterProps(player);
    }, 10);
};