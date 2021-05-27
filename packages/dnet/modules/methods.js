"use strict";

const crypto = require('crypto');

let Container = require('./data');
let mysql = require('./mysql');

let enums = require('../enums');
let user = require('../user');
let coffer = require('../coffer');

let vehicles = require('../property/vehicles');
let business = require('../property/business');
let stocks = require('../property/stocks');
let fraction = require('../property/fraction');
let family = require('../property/family');

let weather = require('../managers/weather');
let pickups = require('../managers/pickups');

let checkPointStaticList = [];

let methods = exports;

methods.state = true;

methods.sha256 = function (text) {
    return crypto.createHash('sha256').update(text).digest('hex');
};

methods.md5 = function (text) {
    return crypto.createHash('md5').update(text).digest('hex');
};

methods.sleep = ms => new Promise(res => setTimeout(res, ms));

methods.saveAll = function () {
    methods.saveAllAnother();
    methods.saveAllUser();
};

methods.saveAllAnother = async function () {

    console.time('saveCoffers');
    coffer.saveAll();
    console.timeEnd('saveCoffers');

    console.time('saveFractions');
    fraction.saveAll();
    console.timeEnd('saveFractions');

    console.time('saveFamily');
    family.saveAll();
    console.timeEnd('saveFamily');

    console.time('saveStocks');
    stocks.saveAll();
    console.timeEnd('saveStocks');

    console.time('saveBusiness');
    for (let i = 1; i < 300; i++)
        business.save(i);
    console.timeEnd('saveBusiness');

    console.time('saveVehicle');
    mp.vehicles.forEach(async (v) => {
        if (vehicles.exists(v)) {
            try {
                await vehicles.save(v.getVariable('container'));
            }
            catch (e) {
                methods.debug(e);
            }
        }
    });
    console.timeEnd('saveVehicle');

    methods.debug('Save All Another');
};

methods.saveAllUser = async function () {

    console.time('saveAllUser');
    mp.players.forEach(async (p) => {
        if (user.isLogin(p)) {
            try {
                let isSave = await user.save(p);
                if (!isSave) {
                    p.notify('~r~Ошибка сохранения аккаунта, сообщите разработчикам');
                    p.notify('~r~Обязательно запомните время');
                    methods.debug(`SAVE ERROR: ${user.get(p, 'id')} | ${user.has(p, 'id')} | ${methods.getTimeStamp()}`)
                }
            }
            catch (e) {
                methods.debug(e);
            }
        }
    });
    console.timeEnd('saveAllUser');
    methods.debug('Save All User');
};

methods.checkTeleport = function(player, pos1, pos2) {
    try {
        let distanceCheck = 1.4;
        let playerPos = player.position;
        if (methods.distanceToPos(pos1, playerPos) < distanceCheck)
            user.teleport(player, pos2.x, pos2.y, pos2.z + 1);
        if (methods.distanceToPos(pos2, playerPos) < distanceCheck)
            user.teleport(player, pos1.x, pos1.y, pos1.z + 1);
    }
    catch (e) {
        methods.debug(e);
    }
};

methods.checkTeleportVeh = function(player, pos1, pos2) {
    try {
        let distanceCheck = 1.4;
        let playerPos = player.position;
        if (methods.distanceToPos(pos1, playerPos) < distanceCheck)
            user.teleportVeh(player, pos2.x, pos2.y, pos2.z);
        if (methods.distanceToPos(pos2, playerPos) < distanceCheck)
            user.teleportVeh(player, pos1.x, pos1.y, pos1.z);
    }
    catch (e) {
        methods.debug(e);
    }
};

methods.getVehicleInfo = function (model) {
    let vehInfo = enums.vehicleInfo;
    for (let item in vehInfo) {
        let vItem = vehInfo[item];
        if (vItem.hash == model || vItem.display_name == model || vItem.display_name.toLowerCase() == model.toString().toLowerCase() || mp.joaat(vItem.display_name.toString().toLowerCase()) == model)
            return vItem;
    }
    return {
        id: 0,
        hash: model,
        display_name: 'Unknown',
        class_name: 'Unknown',
        class_name_ru: 'Unknown',
        m_name: 'Unknown',
        n_name: 'Unknown',
        stock: 378000,
        stock_full: 205000,
        price: 50000,
        fuel_full: 75,
        fuel_min: 8,
        fuel_type: 0,
        type: 0,
        sb: 1,
        sm: 200,
        tm: 0,
        temp: 1,
        anchor: 0,
        lck: 0,
        sbag: 5000,
        trucker: 0,
        t_main: 0,
        t_color: 1,
        t_inside: 1,
        t_chip: 1,
        t_vis: 1,
        t_module: 1,
        t_extra: 1,
        t_wheels: 1,
        t_block: "{}",
        t_neon: 1,
        t_light: 1,
        r_speed: 0,
        a_spawn: 1,
        s_park: 0,
        ticket_z: 0,
        lc: 1,
        blt: 1,
        siren: 0,
        k_block: "[]",
    };
};

methods.getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

methods.getRandomFloat = function () {
    return methods.getRandomInt(0, 10000) / 10000;
};

methods.getRandomBankCard = function (prefix = 0) {
    if (prefix == 0)
        prefix = methods.getRandomInt(1000, 9999);

    let num1 = methods.getRandomInt(1000, 9999);
    let num2 = methods.getRandomInt(1000, 9999);
    let num3 = methods.getRandomInt(1000, 9999);

    return methods.parseInt(`${prefix}${num1}${num2}${num3}`);
};

methods.getRandomPhone = function (prefix = 0) {
    if (prefix == 0)
        prefix = methods.getRandomInt(100, 999);
    let num = methods.getRandomInt(1000000, 9999999);
    return methods.parseInt(`${prefix}${num}`);
};

methods.getRandomPlayer = function () {
    let playerList = [];
    mp.players.forEach(p => {
        if (user.isLogin(p)) {
            playerList.push(p);
        }
    });
    return playerList[methods.getRandomInt(0, playerList.length - 1)];
};

methods.unixTimeStampToDateTime = function (timestamp) {
    let dateTime = new Date(timestamp * 1000);
    return `${methods.digitFormat(dateTime.getHours())}:${methods.digitFormat(dateTime.getMinutes())} ${methods.digitFormat(dateTime.getDate())}/${methods.digitFormat(dateTime.getMonth()+1)}/${dateTime.getFullYear()}`
};

methods.unixTimeStampToDateTimeShort = function (timestamp) {
    let dateTime = new Date(timestamp * 1000);
    return `${methods.digitFormat(dateTime.getHours())}:${methods.digitFormat(dateTime.getMinutes())} ${methods.digitFormat(dateTime.getDate())}/${methods.digitFormat(dateTime.getMonth()+1)}`
};

methods.unixTimeStampToDate = function (timestamp) {
    let dateTime = new Date(timestamp * 1000);
    return `${methods.digitFormat(dateTime.getDate())}/${methods.digitFormat(dateTime.getMonth()+1)}/${dateTime.getFullYear()}`
};

methods.digitFormat = function(number) {
    return ("0" + number).slice(-2);
};

methods.numberFormat = function (currentMoney) {
    return currentMoney.toString().replace(/.+?(?=\D|$)/, function(f) {
        return f.replace(/(\d)(?=(?:\d\d\d)+$)/g, "$1,");
    });
};

methods.cryptoFormat = function (currentMoney, toFixed = 5) {
    currentMoney = methods.parseFloat(currentMoney);
    return `${methods.numberFormat(currentMoney.toFixed(toFixed))}btc`;
};

methods.bankFormat = function (currentMoney) {
    return currentMoney.toString().replace(/.+?(?=\D|$)/, function(f) {
        return f.replace(/(\d)(?=(?:\d\d\d\d)+$)/g, "$1 ");
    });
};

methods.phoneFormat = function (phoneNumber) {
    let phoneNumberString = methods.parseInt(phoneNumber);
    let cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        let intlCode = (match[1] ? '+1 ' : '');
        return [intlCode, '', match[2], ' ', match[3], '-', match[4]].join('');
    }
    return phoneNumberString;
};

methods.moneyFormat = function (currentMoney, maxCentValue = 5000) {
    currentMoney = methods.parseFloat(currentMoney);
    if (currentMoney < maxCentValue)
        return '$' + methods.numberFormat(currentMoney.toFixed(2));
    return '$' + methods.numberFormat(currentMoney.toFixed(0));
};

methods.capitalizeFirstLetter  = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

methods.boolToInt = function (boolean) {
    return boolean ? 1 : 0;
};

methods.getTimeStamp = function () {
    return Date.now() / 1000 | 0;
};

methods.getTimeStampFull = function () {
    return Date.now();
};

methods.getTimeWithoutSec = function() {
    let dateTime = new Date();
    return `${methods.digitFormat(dateTime.getHours())}:${methods.digitFormat(dateTime.getMinutes())}`;
};

methods.getTime = function() {
    let dateTime = new Date();
    return `${methods.digitFormat(dateTime.getHours())}:${methods.digitFormat(dateTime.getMinutes())}:${methods.digitFormat(dateTime.getSeconds())}`;
};

methods.getDate = function() {
    let dateTime = new Date();
    return `${methods.digitFormat(dateTime.getDate())}/${methods.digitFormat(dateTime.getMonth() + 1)}/${methods.digitFormat(dateTime.getFullYear())}`;
};

methods.daysInMonth = function (month, year) {
    return new Date(year, month, 0).getDate();
};

methods.distanceToPos = function (v1, v2) {
    return Math.abs(Math.sqrt(Math.pow((v2.x - v1.x),2) +
        Math.pow((v2.y - v1.y),2)+
        Math.pow((v2.z - v1.z),2)));
};

methods.distanceToPos2D = function (v1, v2) {
    return Math.abs(Math.sqrt(Math.pow((v2.x - v1.x),2) +
        Math.pow((v2.y - v1.y),2)));
};

methods.removeQuotes = function (str) {
    return methods.replaceAll(str, '\'', '');
    //return str.toString().replace('\'', '');
};

methods.removeQuotes2 = function(str) {
    return methods.replaceAll(str, '"', '');
    //return text.toString().replace('"', '');
};

methods.removeSpecialChars = function(str) {
    return str.toString().replace(/[\n\r\t]/g, '');
    //return text.toString().replace('"', '');
};

/*methods.replaceAll = function(string, search, replace){
    return string.split(search).join(replace);
};*/

methods.lerp = function(pos1, pos2, amt) {
    pos1.x += (pos2.x - pos1.x) * amt || 0;
    pos1.y += (pos2.y - pos1.y) * amt || 0;
    pos1.z += (pos2.z - pos1.z) * amt || 0;
    return pos1;
};

methods.moveObject = function(object, toPos, timeout = 0.01) {
    let internal = setInterval(function () {
        object.position = methods.lerp(object.position, toPos, timeout);
        if (methods.distanceToPos(object.position, toPos) < 0.1)
            clearInterval(internal);
    }, 10);
};

methods.escapeRegExp = function(str) {
    return str.toString().replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
};

methods.replaceAll = function(str, find, replace) {
    return str.toString().replace(new RegExp(methods.escapeRegExp(find), 'g'), replace);
};

methods.replaceAllGtaSymb = function(str) {
    let textRemove = methods.replaceAll(str, '~s~', '');
    textRemove = methods.replaceAll(textRemove, '~r~', '');
    textRemove = methods.replaceAll(textRemove, '~g~', '');
    textRemove = methods.replaceAll(textRemove, '~b~', '');
    textRemove = methods.replaceAll(textRemove, '~y~', '');
    textRemove = methods.replaceAll(textRemove, '~p~', '');
    textRemove = methods.replaceAll(textRemove, '~q~', '');
    textRemove = methods.replaceAll(textRemove, '~o~', '');
    textRemove = methods.replaceAll(textRemove, '~c~', '');
    textRemove = methods.replaceAll(textRemove, '~m~', '');
    textRemove = methods.replaceAll(textRemove, '~u~', '');
    textRemove = methods.replaceAll(textRemove, '~n~', '');
    textRemove = methods.replaceAll(textRemove, '~w~', '');
    textRemove = methods.replaceAll(textRemove, '~h~', '');
    textRemove = methods.replaceAll(textRemove, '<C>', '');
    textRemove = methods.replaceAll(textRemove, '</C>', '');
    return textRemove;
};

methods.debug = function (message, ...args) {
    try {
        console.log(`[DEBUG-SERVER] [${methods.getTime()}]: ${message}`, args);
        //methods.saveFile('log', `[DEBUG-SERVER] [${methods.getTime()}]: ${message} | ${JSON.stringify(args)}`);
    } catch (e) {
        console.log(e)
    }
};

methods.error = function (message, ...args) {
    try {
        message = 'OMG! EXCEPTION: ' + message;
        methods.debug(message, args);
    } catch (e) {
    }
};

methods.isValidJSON = function(value){
    try{
        JSON.parse(value);
        return true;
    }
    catch (error){
        methods.debug(`Invalid JSON string\n${error}`);
        return false;
    }
};

methods.parseInt = function (str) {
    return parseInt(str) || 0;
};

methods.parseFloat = function (str) {
    return parseFloat(str) || 0;
};

methods.saveLog = function (table, cols, values) {

    let colStr = '';
    let valStr = '';

    if (typeof cols === 'object')
        colStr = methods.removeQuotes(methods.removeQuotes2(cols.toString()));
    else if (typeof cols === 'string')
        colStr = cols;

    if (typeof values === 'object') {
        values.forEach(item => {
            valStr += `'${methods.removeQuotes(methods.removeQuotes2(item))}',`
        });
        valStr = valStr.slice(0, -1);
    }
    else if (typeof values === 'string')
        valStr = values;

    if (colStr === '' || colStr === undefined)
        return;
    if (valStr === '' || valStr === undefined)
        return;

    mysql.executeQuery(`INSERT INTO ${table} (${colStr}) VALUES (${valStr})`);
};

methods.saveFractionLog = function (name, doName, text, fractionId) {
    doName = methods.removeQuotes(doName);
    text = methods.removeQuotes(text);
    name = methods.removeQuotes(name);
    mysql.executeQuery(`INSERT INTO log_fraction (name, text, text2, fraction_id, timestamp, rp_datetime) VALUES ('${name}', '${doName}', '${text}', '${fractionId}', '${methods.getTimeStamp()}', '${weather.getRpDateTime()}')`);
};

methods.getLicName = function (lic) {
    let licName = '';
    switch (lic) {
        case 'a_lic':
            licName = 'Лицензия категории А';
            break;
        case 'b_lic':
            licName = 'Лицензия категории B';
            break;
        case 'c_lic':
            licName = 'Лицензия категории C';
            break;
        case 'air_lic':
            licName = 'Лицензия на воздушный транспорт';
            break;
        case 'ship_lic':
            licName = 'Лицензия на водный транспорт';
            break;
        case 'taxi_lic':
            licName = 'Лицензия на перевозку пассажиров';
            break;
        case 'law_lic':
            licName = 'Лицензия юриста';
            break;
        case 'gun_lic':
            licName = 'Лицензия на оружие';
            break;
        case 'biz_lic':
            licName = 'Лицензия на предпринимательство';
            break;
        case 'fish_lic':
            licName = 'Разрешение на рыболовство';
            break;
        case 'marg_lic':
            licName = 'Разрешенип на марихуану';
            break;
        case 'med_lic':
            licName = 'Мед. страховка';
            break;
    }
    return licName;
};

methods.getRareName = function (proc) {
    if (proc === 0)
        return 'Обычная';
    if (proc <= 10)
        return 'Легендарная';
    if (proc <= 20)
        return 'Засекреченная';
    if (proc <= 30)
        return 'Мистическая';
    if (proc <= 40)
        return 'Элитная';
    if (proc <= 50)
        return 'Невероятно редкая';
    if (proc <= 60)
        return 'Очень редкая';
    if (proc <= 70)
        return 'Редкая';
    if (proc <= 80)
        return 'Необычная';
    if (proc <= 90)
        return 'Ширпотреб';
    return 'Обычная';
};

let delList = [];
let openList = [];

methods.deleteObject = function(x, y, z, hash) {
    delList.push([x, y, z, hash]);
    mp.players.forEach(p => {
        if (!mp.players.exists(p))
            return false;
        p.call('client:user:deleteObject', [x, y, z, hash]);
    });
};

methods.loadDeleteObject = function(player) {
    if (mp.players.exists(player))
        player.call('client:user:deleteObjectArray', [JSON.stringify(delList)]);
};

methods.openObject = function(x, y, z, isClose, radius = 10) {

    try {
        let id = -1;
        openList.forEach((item, idx) => {
            let dist = methods.distanceToPos(new mp.Vector3(x, y, z), new mp.Vector3(item.x, item.y, item.z));
            if (dist < radius) {
                id = idx;
            }
        });

        if (id >= 0)
            openList[id] = [x, y, z, isClose, radius];
        else
            openList.push([x, y, z, isClose, radius]);

        mp.players.forEach(p => {
            if (!mp.players.exists(p))
                return false;
            p.call('client:user:changeDoor', [x, y, z, isClose, radius]);
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

methods.loadOpenObject = function(player) {
    player.call('client:user:changeDoorArray', [JSON.stringify(openList)]);
};

methods.explodeObject = function(x, y, z, rangeLoad = 200, type = 34, damage = 30, audio = true, cameraShake = 2) {
    mp.players.forEachInRange(new mp.Vector3(x, y, z), rangeLoad, p => {
        try {
            user.addExplode(p, x, y, z, type, damage, audio, false, cameraShake, 1);
        }
        catch (e) {}
    });
};

methods.saveFile = function (name, log) {
    fs.appendFile("" + name + ".log", `${log}\n`, function (err) {
        if(err) {
            methods.createFile(name);
            return methods.debug(err);
        }
    });
};

methods.createFile = function (filename) {
    fs.open(filename, 'r', function(err, fd) {
        if (err) {
            fs.writeFile(filename, '', function(err) {
                if(err)
                    methods.debug(err);
                else
                    methods.debug("The file was saved!");
            });
        } else {
            methods.debug("The file exists!");
        }
    });
};

methods.createBlip = function (pos, sprite, color, scale, name, dimension) {
    if (scale == undefined)
        scale = 0.8;
    if (dimension == undefined)
        dimension = -1;
    if (name == undefined)
        return mp.blips.new(sprite, pos,
            {
                color: color,
                scale: scale,
                shortRange: true,
                dimension: dimension
            });
    return mp.blips.new(sprite, pos,
        {
            name: name,
            color: color,
            scale: scale,
            shortRange: true,
            dimension: dimension
        });
};

methods.createCpVector = function (pos, message, scale, dimension, color, height) {
    return methods.createCp(pos.x, pos.y, pos.z, message, scale, dimension, color, height);
};

methods.createCp = function (x, y, z, message, scale = 1, dimension = -1, color = [33, 150, 243, 100], height = undefined) {

    if (height == undefined)
        height = scale / 2;

    let checkpointID = checkPointStaticList.length;
    checkPointStaticList.push({id: checkpointID, x: parseFloat(x), y: parseFloat(y), z: parseFloat(z), color: color, scale: scale, height: height});
    if (message)
        Container.Data.Set(999999, 'checkpointStaticLabel' + checkpointID, message);
    return checkpointID;
};

methods.getCheckPointStaticList = function () {
    return checkPointStaticList;
};

methods.updateCheckpointList = function (player) {
    if(!mp.players.exists(player))
        return;
    try {
        for (let i = 0; i < methods.parseInt(methods.getCheckPointStaticList().length / 500) + 1; i++)
            player.call('client:updateCheckpointList', [methods.getCheckPointStaticList().slice(i * 500, i * 500 + 499)]);
    }
    catch (e) {
        methods.debug(e);
    }
};

methods.fixCheckpointList = function (player) {
    if(!mp.players.exists(player))
        return;
    player.call('client:fixCheckpointList');
};

methods.notifyWithPictureToAll = function(title, sender, message, notifPic, icon = 0, flashing = false, textColor = -1, bgColor = -1, flashColor = [77, 77, 77, 200]) {
    mp.players.call("BN_ShowWithPicture", [title, sender, message, notifPic, icon, flashing, textColor, bgColor, flashColor]);
};

methods.notifyWithPictureToFraction = function(title, sender, message, notifPic, fractionId = 0, icon = 0, flashing = false, textColor = -1, bgColor = -1, flashColor = [77, 77, 77, 200]) {
    mp.players.forEach(function (p) {
        if (user.isLogin(p) && user.get(p, 'fraction_id') == fractionId) {
            try {
                p.notifyWithPicture(title, sender, message, notifPic, icon, flashing, textColor, bgColor, flashColor);
            }
            catch (e) {

            }
        }
    });
};

methods.notifyWithPictureToFraction2 = function(title, sender, message, notifPic = 'CHAR_DEFAULT', fractionId = 0, icon = 0, flashing = false, textColor = -1, bgColor = -1, flashColor = [77, 77, 77, 200]) {
    if (fractionId === 0)
        return;
    mp.players.forEach(function (p) {
        if (user.isLogin(p) && user.get(p, 'fraction_id2') == fractionId) {
            try {
                p.notifyWithPicture(title, sender, message, notifPic, icon, flashing, textColor, bgColor, flashColor);
            }
            catch (e) {

            }
        }
    });
};

methods.notifyWithPictureToFractionF = function(title, sender, message, notifPic = 'CHAR_DEFAULT', fractionId = 0, icon = 0, flashing = false, textColor = -1, bgColor = -1, flashColor = [77, 77, 77, 200]) {
    if (fractionId === 0)
        return;
    mp.players.forEach(function (p) {
        if (user.isLogin(p) && user.get(p, 'family_id') == fractionId) {
            try {
                p.notifyWithPicture(title, sender, message, notifPic, icon, flashing, textColor, bgColor, flashColor);
            }
            catch (e) {

            }
        }
    });
};

methods.notifyWithPictureToCanabisWar = function(title, sender, message, notifPic = 'CHAR_DEFAULT', fractionId = 0, icon = 0, flashing = false, textColor = -1, bgColor = -1, flashColor = [77, 77, 77, 200]) {
    if (fractionId === 0)
        methods.notifyWithPictureToFraction(title, sender, message, notifPic, 4);
    else
        methods.notifyWithPictureToFraction2(title, sender, message, notifPic, fractionId);
};

methods.notifyWithPictureToFractions2 = function(title, sender, message, notifPic = 'CHAR_DEFAULT', icon = 0, flashing = false, textColor = -1, bgColor = -1, flashColor = [77, 77, 77, 200]) {
    mp.players.forEach(function (p) {
        if (user.isLogin(p) && user.get(p, 'fraction_id2') > 0) {
            try {
                p.notifyWithPicture(title, sender, message, notifPic, icon, flashing, textColor, bgColor, flashColor);
            }
            catch (e) {

            }
        }
    });
};

methods.notifyWithPictureToJob = function(title, sender, message, notifPic, job, icon = 0, flashing = false, textColor = -1, bgColor = -1, flashColor = [77, 77, 77, 200]) {
    mp.players.forEach(function (p) {
        if (user.isLogin(p) && user.get(p, 'job') == job) {
            try {
                p.notifyWithPicture(title, sender, message, notifPic, icon, flashing, textColor, bgColor, flashColor);
            }
            catch (e) {

            }
        }
    });
};

methods.notifyWithPictureToPlayer = function(p, title, sender, message, notifPic, icon = 0, flashing = false, textColor = -1, bgColor = -1, flashColor = [77, 77, 77, 200]) {
    if (mp.players.exists(p))
        p.notifyWithPicture(title, sender, message, notifPic, icon, flashing, textColor, bgColor, flashColor);
};

methods.notifyToFraction = function(message, fractionId = 0) {
    mp.players.forEach(function (p) {
        if (user.isLogin(p) && user.get(p, 'fraction_id') == fractionId)
            p.notify(message);
    });
};

methods.notifyToAll = function(message) {
    mp.players.forEach(function (p) {
        if (user.isLogin(p))
            p.notify(message);
    });
};

methods.getCurrentOnlineFraction = function(frId) {
    let count = 0;
    mp.players.forEach(p => {
        if (user.isLogin(p) && user.get(p, 'fraction_id') === frId) {
            count++;
        }
    });
    return count;
};

methods.getCurrentOnlineFraction2 = function(frId) {
    let count = 0;
    mp.players.forEach(p => {
        if (user.isLogin(p) && user.get(p, 'fraction_id2') === frId) {
            count++;
        }
    });
    return count;
};

methods.isInPoint = function (p, polygon) {

    let isInside = false;
    let minX = polygon[0].x, maxX = polygon[0].x;
    let minY = polygon[0].y, maxY = polygon[0].y;
    for (let n = 1; n < polygon.length; n++) {
        let q = polygon[n];
        minX = Math.min(q.x, minX);
        maxX = Math.max(q.x, maxX);
        minY = Math.min(q.y, minY);
        maxY = Math.max(q.y, maxY);
    }

    if (p.x < minX || p.x > maxX || p.y < minY || p.y > maxY) {
        return false;
    }

    let i = 0, j = polygon.length - 1;
    for (i, j; i < polygon.length; j = i++) {
        if ( (polygon[i].y > p.y) != (polygon[j].y > p.y) &&
            p.x < (polygon[j].x - polygon[i].x) * (p.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x ) {
            isInside = !isInside;
        }
    }

    return isInside;
};

methods.isBlackout = function () {
    return false; //TODO заглушка
};

methods.sortBy = function (arr, p) {
    return arr.slice(0).sort(function(a,b) {
        return (a[p] > b[p]) ? 1 : (a[p] < b[p]) ? -1 : 0;
    });
};

methods.getFractionName = function(fractionId) {
    try {
        return enums.fractionListId[fractionId].fractionNameShort;
    }
    catch (e) {
        methods.debug(e);
    }
    return 'Отсуствует';
};

methods.getFractionNameL = function(fractionId) {
    try {
        return enums.fractionListId[fractionId].fractionName;
    }
    catch (e) {
        methods.debug(e);
    }
    return 'Отсуствует';
};

methods.getDepartmentName = function(fractionId, depId) {
    try {
        return enums.fractionListId[fractionId].departmentList[depId];
    }
    catch (e) {
        methods.debug(e);
    }
    return 'Отсуствует';
};

methods.getRankName = function(fractionId, depId, rankId) {
    try {
        return enums.fractionListId[fractionId].rankList[depId][rankId];
    }
    catch (e) {
        methods.debug(e);
    }
    return 'Отсуствует';
};

methods.getFractionHash = function(fractionId) {
    try {
        return enums.fractionListId[fractionId].hash;
    }
    catch (e) {
        methods.debug(e);
    }
    return 'none';
};

methods.getFractionById = function (fractionId) {
    return enums.fractionListId[fractionId];
};

methods.getFractionCountRank = function (fractionId, rankType = 0) {
    return methods.getFractionById(fractionId).rankList[rankType].length;
};

methods.getFractionPayDay = function (fractionId, rank, rankType) {
    let frItem = methods.getFractionById(fractionId);
    return methods.parseInt(frItem.rankPayDay[rankType][rank]) + coffer.getBenefit(coffer.getIdByFraction(fractionId));
};

methods.getNearestVehicleWithCoords = function(pos, r, dimension = 0) {
    let nearest = undefined, dist;
    let min = r;
    methods.getListOfVehicleInRadius(pos, r).forEach(vehicle => {
        dist = methods.distanceToPos(pos, vehicle.position);
        if (dist < min) {
            if (dimension == vehicle.dimension) {
                nearest = vehicle;
                min = dist;
            }
        }
    });
    return nearest;
};

methods.getListOfVehicleInRadius = function(pos, r) {
    let returnVehicles = [];
    mp.vehicles.forEachInRange(pos, r,
        (vehicle) => {
            if (!vehicles.exists(vehicle))
                return;
            returnVehicles.push(vehicle);
        }
    );
    return returnVehicles;
};

methods.getListOfVehicleNumberInRadius = function(pos, r) {
    let returnVehicles = [];
    mp.vehicles.forEachInRange(pos, r,
        (vehicle) => {
            if (!vehicles.exists(vehicle))
                return;
            returnVehicles.push(vehicles.getNumberPlate(vehicle));
        }
    );
    return returnVehicles;
};

methods.getNearestPlayerWithCoords = function(pos, r) {
    let nearest = undefined, dist;
    let min = r;
    methods.getListOfPlayerInRadius(pos, r).forEach(player => {
        if (!user.isLogin(player)) return;
        dist = methods.distanceToPos(pos, player.position);
        if (dist < min) {
            nearest = player;
            min = dist;
        }
    });
    return nearest;
};

methods.getNearestPlayerWithPlayer = function(pl, r) {
    let nearest = undefined, dist;
    let min = r;
    let pos = pl.position;
    methods.getListOfPlayerInRadius(pos, r).forEach(player => {
        if (!user.isLogin(player)) return;
        if (pl == player) return;
        if (pl.dimension != player.dimension) return;
        dist = methods.distanceToPos(pos, player.position);
        if (dist < min) {
            nearest = player;
            min = dist;
        }
    });
    return nearest;
};

methods.getListOfPlayerInRadius = function(pos, r) {
    let returnPlayers = [];
    mp.players.forEachInRange(pos, r,
        (player) => {
            if (!user.isLogin(player)) return;
            returnPlayers.push(player);
        }
    );
    return returnPlayers;
};

methods.loadAllBlips = function () {

    methods.createBlip(new mp.Vector3(536.4715576171875, -3126.484375, 5.073556900024414), 598, 0, 0.8, 'Army');
    methods.createBlip(new mp.Vector3(450.0621337890625, -984.3471069335938, 43.69164276123047), 60, 0, 0.8);
    //methods.createBlip(new mp.Vector3(-1625.726318359375, -1020.4765625, 12.158555030822754), 60, 0, 0.8, 'Police Department');
    methods.createBlip(new mp.Vector3(-1089.6976318359375, -835.5410766601562, 21.003822326660156), 60, 0, 0.8);
    methods.createBlip(new mp.Vector3(-448.6859, 6012.703, 30.71638), 60, 16, 0.8);
    methods.createBlip(new mp.Vector3(1853.22, 3686.6796875, 33.2670), 60, 16, 0.8);
    //methods.createBlip(new mp.Vector3(366.2178955078125, -1593.1396484375, 28.29206085205078), 60, 16, 0.8, 'Sheriff Department');
    methods.createBlip(new mp.Vector3(-158.44952392578125, -605.221923828125, 48.23460388183594), 535, 67, 0.8, 'Бизнес Центр');
    //methods.createBlip(new mp.Vector3(111.5687, -749.9395, 30.69), 498, 0, 0.8, 'Здание FIB');
    methods.createBlip(new mp.Vector3(1830.489, 2603.093, 45.8891), 238, 0, 0.8, 'Тюрьма');
    methods.createBlip(new mp.Vector3(-1290.544, -571.1852, 29.57288), 419, 0, 1, 'Правительство');
    methods.createBlip(new mp.Vector3(5011.5771484375, -5750.75830078125, 31.852725982666016), 304, 5, 1, 'Правительство');

    methods.createBlip(new mp.Vector3(311.9224853515625, -583.9681396484375, 44.299190521240234), 489, 59, 0.8, 'Больница');
    methods.createBlip(new mp.Vector3(-253.9735565185547, 6320.83935546875, 37.61736297607422), 489, 59, 0.8, 'Больница');
    methods.createBlip(new mp.Vector3(1836.8359375, 3676.784912109375, 33.27006912231445), 489, 59, 0.8, 'Больница');
    methods.createBlip(new mp.Vector3(4962.66845703125, -5791.33447265625, 25.266326904296875), 489, 59, 0.8, 'Больница');

    methods.createBlip(new mp.Vector3(-759.5448608398438, -709.0863037109375, 29.0616512298584), 305, 60, 0.6, 'Церковь');
    //methods.createBlip(new mp.Vector3(-1682.297607421875, -279.4432678222656, 50.8623161315918), 305, 60, 0.6, 'Церковь');

    methods.createBlip(new mp.Vector3(-1081.0628662109375, -251.57298278808594, 37.763275146484375), 744, 0, 0.8, 'Life Invader');

    methods.createBlip(new mp.Vector3(-255.0441, -2026.709, 29.14638), 546, 71, 0.8, 'Maze Bank Arena');

    methods.createBlip(new mp.Vector3(956.8535766601562, 34.93609619140625, 122.11998748779297), 679, 0, 0.8);
    methods.createBlip(new mp.Vector3(1200.6854248046875, -1474.0303955078125, 33.85951614379883), 436, 60, 0.8, 'Fire Department');
    methods.createBlip(new mp.Vector3(-369.2587890625, 6114.552734375, 30.446975708007812), 436, 60, 0.8, 'Fire Department');

    methods.createBlip(new mp.Vector3(-1654.792236328125, -948.4613037109375, 7.716407775878906), 225, 2, 0.8, 'Б/У Авторынок');
    methods.createBlip(new mp.Vector3(903.91162109375, -165.71511840820312, 73.09003448486328), 198, 5, 0.8, 'Таксопарк');

    methods.createBlip(pickups.BotSellGun, 728, 5, 0.6, 'Литейный Завод');
    methods.createBlip(pickups.BotSellCloth, 728, 3, 0.6, 'Швейная Фабрика');

    methods.createBlip(pickups.BotSellGun1, 728, 5, 0.6, 'Литейный Завод');
    methods.createBlip(pickups.BotSellCloth1, 728, 3, 0.6, 'Швейная Фабрика');

    methods.createBlip(pickups.IslandPos1, 404, 0, 0.8, 'Переправа');
    methods.createBlip(pickups.IslandPos2, 404, 0, 0.8, 'Переправа');

    methods.createBlip(new mp.Vector3(742.2985229492188, -925.4149780273438, 23.978235244750977), 728, 39, 0.6, 'Black Market');
    methods.createBlip(new mp.Vector3(-1685.0235595703125, -763.0075073242188, 9.18997859954834), 728, 0, 0.6, 'Market');

    //methods.createBlip(new mp.Vector3(46.947, -1753.859, 46.508), 78, 68, 0.4, 'Торговый центр MegaMoll');

    //methods.createBlip(new mp.Vector3(-3544, 6135, 0), 68, 59, 0.8, 'Рыбалка запрещена');
    //methods.createBlip(new mp.Vector3(4989, 1712, 0), 68, 59, 0.8, 'Рыбалка запрещена');
    //methods.createBlip(new mp.Vector3(-1337.255, -1277.948, 3.872962), 362, 0, 0.8, 'Магазин масок');
};