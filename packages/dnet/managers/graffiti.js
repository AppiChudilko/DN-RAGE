let Container = require('../modules/data');
let mysql = require('../modules/mysql');
let methods = require('../modules/methods');

let fraction = require('../property/fraction');

let user = require('../user');

let graffiti = exports;

let offset = 600000;
let keyPrefix = 'graffitiWar';

let types = [
    mp.joaat('graffiti_vagos2'),
    mp.joaat('graffiti_vagos'),
    mp.joaat('graffiti_vagosQR2'),
    mp.joaat('graffiti_vagosQR'),
];

graffiti.position = [
    [0, new mp.Vector3(-311.07, -1360.8, 31.91695), new mp.Vector3(0, 0, 0.0001435876)],
    [0, new mp.Vector3(-45.9481, -1322.544, 29.86204), new mp.Vector3(0, 0, -89.99982)],
    [0, new mp.Vector3(307.4397, -1248.334, 29.96163), new mp.Vector3(0, 0, -179.9999)],
    [0, new mp.Vector3(428.8654, -1510.638, 29.57412), new mp.Vector3(0, 0, 119.9997)],
    [0, new mp.Vector3(423.04, -1900.061, 25.78452), new mp.Vector3(1.00179E-05, 5.008957E-06, -39.44977)],
    [0, new mp.Vector3(238.5922, -1965.006, 22.58521), new mp.Vector3(0, 0, -39.99986)],
    [0, new mp.Vector3(299.2936, -1715.794, 29.72064), new mp.Vector3(0, 0, -39.99992)],
    [0, new mp.Vector3(104.26, -2017.635, 18.6162), new mp.Vector3(1.001791E-05, 5.008956E-06, -108.4493)],
    [0, new mp.Vector3(119.0204, -1591.91, 29.95379), new mp.Vector3(0, 0, -39.9999)],
    [0, new mp.Vector3(-46.16, -1483.535, 32.14623), new mp.Vector3(0, 0, -84.99977)],
    [0, new mp.Vector3(-360.3309, -1538.035, 28.04401), new mp.Vector3(0, 0, 89.99979)],
    [0, new mp.Vector3(862.68, -2467.091, 28.5742), new mp.Vector3(1.001791E-05, 5.008956E-06, 173.9998)],
    [0, new mp.Vector3(896.861, -2186.549, 31.15413), new mp.Vector3(0, 0, 174.9998)],
    [0, new mp.Vector3(707.414, -2165.177, 29.38435), new mp.Vector3(0, 0, 84.99988)],
    [0, new mp.Vector3(972.34, -2065.44, 31.67721), new mp.Vector3(1.001789E-05, 5.008956E-06, -0.7751803)],
    [0, new mp.Vector3(888.1992, -1819.715, 31.56158), new mp.Vector3(0, 0, 84.99979)],
    [0, new mp.Vector3(783.73, -1765.73, 29.70676), new mp.Vector3(0, 0, 175.9993)],
    [0, new mp.Vector3(976.7973, -1696.641, 29.37519), new mp.Vector3(0, 0, -94.99987)],
    [0, new mp.Vector3(1183.432, -1279.972, 35.1699), new mp.Vector3(0, 0, -5.999989)],
    [0, new mp.Vector3(481.71, -2021.329, 24.54657), new mp.Vector3(1.00179E-05, -5.008956E-06, 44.82494)],
    [1, new mp.Vector3(-121.942, -1284.484, 29.61635), new mp.Vector3(0, 0, 90.00014)],
    [1, new mp.Vector3(181.1695, -1274.403, 29.69343), new mp.Vector3(0, 0, -22.99996)],
    [1, new mp.Vector3(478.106, -1327.295, 29.33557), new mp.Vector3(0, 0, -62.99974)],
    [1, new mp.Vector3(482.3997, -1862.561, 27.39291), new mp.Vector3(0, 0, 120.9999)],
    [1, new mp.Vector3(225.4281, -1956.027, 22.17651), new mp.Vector3(0, 0, -129.9997)],
    [1, new mp.Vector3(211.0013, -1756.819, 29.25177), new mp.Vector3(0, 0, -42.99995)],
    [1, new mp.Vector3(491.7703, -1835.628, 27.65436), new mp.Vector3(0, 0, -50.99991)],
    [1, new mp.Vector3(101.2902, -1755.531, 29.48399), new mp.Vector3(0, 0, 139.9997)],
    [1, new mp.Vector3(212.921, -1696.667, 29.32887), new mp.Vector3(0, 0, -53.99978)],
    [1, new mp.Vector3(15.6233, -1418.189, 29.39432), new mp.Vector3(0, 0, 179.0003)],
    [1, new mp.Vector3(865.8638, -2326.426, 30.56493), new mp.Vector3(0, 0, -4.999997)],
    [1, new mp.Vector3(983.8918, -2338.474, 30.5789), new mp.Vector3(0, 0, 84.99979)],
    [1, new mp.Vector3(1020.988, -2100.287, 31.4201), new mp.Vector3(0, 0, -177.9994)],
    [1, new mp.Vector3(898.36, -2062.17, 30.67612), new mp.Vector3(0, 0, -4.999995)],
    [1, new mp.Vector3(984.4498, -1989.277, 31.47107), new mp.Vector3(0, 0, 130.9998)],
    [1, new mp.Vector3(898.043, -2256.115, 30.76932), new mp.Vector3(0, 0, 175.0002)],
    [1, new mp.Vector3(750.8018, -1721.464, 29.71745), new mp.Vector3(0, 0, -5.999997)],
    [1, new mp.Vector3(997.517, -1527.545, 31.1177), new mp.Vector3(0, 0, 0)],
    [1, new mp.Vector3(523.0639, -2210.221, 6.409729), new mp.Vector3(0, 0, -94.99979)],
    [1, new mp.Vector3(499.5612, -1629.611, 29.75712), new mp.Vector3(0, 0, -129.9997)],
    [2, new mp.Vector3(-302.1043, -1262.656, 30.0016), new mp.Vector3(0, 0, -179.9996)],
    [2, new mp.Vector3(-43.45146, -1351.49, 29.22), new mp.Vector3(0, 0, 0)],
    [2, new mp.Vector3(291.01, -1284.95, 29.73664), new mp.Vector3(2.06736E-14, -5.008956E-06, 0.1752576)],
    [2, new mp.Vector3(495.53, -1453.38, 29.54275), new mp.Vector3(0, 0, 179.9998)],
    [2, new mp.Vector3(404.0718, -1933.518, 24.64399), new mp.Vector3(0, 0, 47.00003)],
    [2, new mp.Vector3(276.8325, -1929.632, 25.57084), new mp.Vector3(0, 0, 48.99966)],
    [2, new mp.Vector3(243.0733, -1800.807, 27.09116), new mp.Vector3(0, 0, 52.00003)],
    [2, new mp.Vector3(115.9078, -1953.288, 20.87632), new mp.Vector3(0, 0, -139.9995)],
    [2, new mp.Vector3(108.973, -1571.403, 30.02765), new mp.Vector3(0, 0, 138.9998)],
    [2, new mp.Vector3(8.03, -1538.531, 29.49077), new mp.Vector3(1.00179E-05, 5.008957E-06, 49.64988)],
    [3, new mp.Vector3(-335.0766, -1556.496, 25.35279), new mp.Vector3(0, 0, -30.00026)],
    [3, new mp.Vector3(864.0587, -2537.418, 28.49677), new mp.Vector3(0, 0, -5.00022)],
    [3, new mp.Vector3(791.2148, -2159.789, 29.61066), new mp.Vector3(0, 0, -89.99989)],
    [3, new mp.Vector3(705.76, -2274.67, 27.97704), new mp.Vector3(0, 0, -154.9992)],
    [3, new mp.Vector3(946.82, -2032.239, 30.6), new mp.Vector3(1.001791E-05, -5.008956E-06, -94.82469)],
    [3, new mp.Vector3(935.73, -1929.296, 31.3902), new mp.Vector3(1.001791E-05, 5.008956E-06, 84.94982)],
    [3, new mp.Vector3(744.3533, -2008.435, 29.26644), new mp.Vector3(0, 0, -4.999998)],
    [3, new mp.Vector3(939.1864, -1745.317, 31.44138), new mp.Vector3(0, 0, -4.999938)],
    [3, new mp.Vector3(1230.906, -1240.805, 35.9161), new mp.Vector3(0, 0, 89.99992)],
    [3, new mp.Vector3(488.135, -1933.272, 25.13987), new mp.Vector3(0, 0, -146.9995)],
];

let colorList = {
    0: 0,
    2: 3,
    5: 7,
    10: 1,
    12: 5,
    14: 2,
};

let objectList = {
    0: 'ballas',
    2: 'marabunta',
    5: 'ballas',
    10: 'bloodstreet',
    12: 'vagos',
    14: 'families',
};

let timer = 0;
let isWar = false;

let graffitiList = [];
let blipList = [];

graffiti.loadAll = function () {
    mysql.executeQuery(`SELECT * FROM graffiti_war`, function (err, rows, fields) {
        try {

            rows.forEach(row => {
                graffiti.set(row['id'], 'id', row['id']);
                graffiti.set(row['id'], 'owner_id', row['owner_id']);
            });

            graffiti.position.forEach((item, idx) => {
                let ownerId = graffiti.get(idx + 1, 'owner_id');
                let obj = mp.objects.new(graffiti.getType(item[0], ownerId), item[1],
                    {
                        rotation: item[2],
                        alpha: 255,
                        dimension: 0
                    });
                graffitiList.push(obj);
            });
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

graffiti.createWar = function() {

    if (isWar)
        return;

    methods.notifyWithPictureToFractions2('Борьба за граффити', `~r~ВНИМАНИЕ!`, 'Началась война за граффити');
    isWar = true;

    graffiti.position.forEach((item, idx) => {
        mp.players.forEach(p => {
            if (!user.isLogin(p))
                return;
            let ownerId = graffiti.get(idx + 1, 'owner_id');
            if (user.isAdmin(p) || user.isGang(p))
                user.createBlip(p, idx + 99999, item[1].x, item[1].y, item[1].z, 541, colorList[ownerId], false, false, '', 0, 0.4);
        })
    });

    timer = 1200;
    setTimeout(graffiti.timerWar, 1000);
};


graffiti.stopWar = function() {
    isWar = false;
    timer = 0;

    methods.notifyWithPictureToFractions2('Борьба за граффити', `~r~ВНИМАНИЕ!`, 'Закончилась война за граффити');

    let moneyToUser = new Map();
    graffiti.position.forEach((item, idx) => {
        let frId = graffiti.get(idx + 1, 'owner_id');
        if (frId > 0) {
            fraction.setMoney(frId, fraction.getMoney(frId) + 1);
            if (moneyToUser.has(frId.toString()))
                moneyToUser.set(frId.toString(), moneyToUser.get(frId.toString()) + 0.3);
            else
                moneyToUser.set(frId.toString(), 0.3);
        }
    });

    mp.players.forEach(p => {
        if (!user.isLogin(p))
            return;
        if (user.isAdmin(p) || user.isGang(p)) {
            graffiti.position.forEach((item, idx) => {
                try {
                    user.deleteBlip(p, idx + 99999)
                }
                catch (e) {}
            });

            if (moneyToUser.has(user.get(p, 'fraction_id2').toString())) {
                if (p.getVariable('isAfk') === true) {
                    p.notify('~r~Зарплату вы не получили, связи с тем, что вы AFK');
                }
                else {
                    let cMoney = moneyToUser.get(user.get(p, 'fraction_id2').toString());
                    p.notify(`~g~Вы получили ${methods.cryptoFormat(cMoney)} за ваши захваченные граффити`);
                    user.addCryptoMoney(p, cMoney, 'Прибыль с граффити');
                }
            }
        }
    });

    graffiti.saveAll();
};

graffiti.timerWar = function() {
    timer--;
    if (timer < 1) {
        graffiti.stopWar();
        return;
    }
    setTimeout(graffiti.timerWar, 1000);
};

graffiti.save = function(id) {

    return new Promise((resolve) => {
        methods.debug('graffiti.save');

        if (!graffiti.has(id, "id")) {
            resolve();
            return;
        }

        let sql = "UPDATE graffiti_war SET";
        sql = sql + " owner_id = '" + methods.parseInt(graffiti.get(id, "owner_id")) + "'";
        sql = sql + " where id = '" + methods.parseInt(graffiti.get(id, "id")) + "'";
        mysql.executeQuery(sql, undefined, function () {
            resolve();
        });
    });
};

graffiti.saveAll = function() {
    methods.debug('graffiti.saveAll');
    mysql.executeQuery(`SELECT * FROM graffiti_war`, function (err, rows, fields) {
        rows.forEach(function(item) {
            graffiti.save(item['id']);
        });
    });
};

graffiti.changeGraffiti = function(player) {
    if (!user.isLogin(player))
        return;
    if (!user.isGang(player)) {
        player.notify('~r~Вы не состоите в банде');
        return;
    }
    if (!isWar) {
        player.notify('~r~Сейчас не идёт война за граффити');
        return;
    }
    if (player.vehicle) {
        player.notify('~r~Вы сидите в ТС');
        return;
    }
    if (player.dimension > 0) {
        player.notify('~r~Вы в виртуальном мире');
        return;
    }

    let isFind = false;
    graffitiList.forEach((obj, idx) => {
        if (methods.distanceToPos(obj.position, player.position) < 4) {
            if (graffiti.has(idx + 1, 'resmoke')) {
                player.notify('~r~Это граффити уже перекрашивают');
                return;
            }

            user.blockKeys(player, true);
            isFind = true;
            graffiti.set(idx + 1, 'resmoke', true);
            user.heading(player, graffiti.position[idx][2].z);
            user.playAnimation(player, 'anim@amb@business@weed@weed_inspecting_lo_med_hi@', 'weed_spraybottle_stand_spraying_02_inspectorfemale', 8);

            mp.players.forEach(p => {
                if (user.isLogin(p) && methods.distanceToPos(p.position, player.position) < 100) {
                    try {
                        user.addExplode(p, obj.position.x, obj.position.y, obj.position.z, 20, 0.8, false, false, 0);
                    }
                    catch (e) {}
                }
            });

            setTimeout(function () {
                if (!user.isLogin(player))
                    return;
                try {
                    graffiti.reset(idx + 1, 'resmoke');
                    user.blockKeys(player, false);

                    if (methods.distanceToPos(obj.position, player.position) > 4) {
                        player.notify('~r~Вы слишком далеко');
                        return;
                    }

                    let newOwner = user.get(player, 'fraction_id2');
                    let objNew = mp.objects.new(graffiti.getType(graffiti.position[idx][0], newOwner), graffiti.position[idx][1],
                        {
                            rotation: graffiti.position[idx][2],
                            alpha: 255,
                            dimension: 0
                        });

                    mp.players.forEach(p => {
                        if (!user.isLogin(p))
                            return;
                        if (user.isAdmin(p) || user.isGang(p))
                            user.createBlip(p, idx + 99999, graffiti.position[idx][1].x, graffiti.position[idx][1].y, graffiti.position[idx][1].z, 541, colorList[newOwner], false, false, '', 0, 0.4);
                    });

                    try {
                        obj.destroy();
                    }
                    catch (e) {}

                    graffitiList[idx] = objNew;
                    graffiti.set(idx + 1, 'owner_id', newOwner);
                }
                catch (e) {
                    
                }
            }, 10000);
        }
    });
    if (!isFind) {
        player.notify('~r~Вы слишком далеко');
    }
};

graffiti.getType = function(type, fraction = 0) {
    let name = objectList[fraction];
    if (type === 1)
        return mp.joaat(`graffiti_${name}`);
    if (type === 2)
        return mp.joaat(`graffiti_${name}QR2`);
    if (type === 3)
        return mp.joaat(`graffiti_${name}QR`);
    return mp.joaat(`graffiti_${name}2`);
};

graffiti.set = function(id, key, val) {
    Container.Data.Set(offset + methods.parseInt(id), keyPrefix + key, val);
};

graffiti.reset = function(id, key) {
    Container.Data.Reset(offset + methods.parseInt(id), keyPrefix + key);
};

graffiti.get = function(id, key) {
    return Container.Data.Get(offset + methods.parseInt(id), keyPrefix + key);
};

graffiti.getData = function(id) {
    return Container.Data.GetAll(offset + methods.parseInt(id));
};

graffiti.has = function(id, key) {
    return Container.Data.Has(offset + methods.parseInt(id), keyPrefix + key);
};