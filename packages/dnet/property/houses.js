let Container = require('../modules/data');
let mysql = require('../modules/mysql');
let methods = require('../modules/methods');
let chat = require('../modules/chat');

let discord = require('../managers/discord');

let user = require('../user');
let coffer = require('../coffer');
let enums = require('../enums');

let vehicles = require('../property/vehicles');
let houses = exports;

let hBlips = new Map();
let count = 0;

houses.interiorList = [
    [1973.087, 3816.231, 32.42871, 32.09988], //0
    [1973.087, 3816.231, 32.42871, 32.09988], //1
    [151.33824, -1007.64196, -100.00000, -0.800103], //2
    [-1908.757, -572.6663, 18.10679, -123.2994], //3
    [265.15405, -1000.99035, -100.01189, 1.40028], //4
    [-1150.627, -1520.831, 9.63272, 42.19985], //5
    [346.52127, -1002.45306, -100.19626, 1.699997], //6
    [-14.2267, -1440.357, 30.10154, 6.423715], //7
    [7.74072, 538.5586, 175.0281, 158.1992], //8
    [-815.6338, 178.5606, 71.15309, -62.49992], //9
    [-777.3342, 323.6484, 210.9974, -89.99999], //10
    [-758.5388, 619.0275, 143.159, 115.8703], //11
    [-1289.856, 449.4803, 96.90755, -180], //12
    [-781.7711, 318.185, 216.6389, 0], //13
    [-777.33831, 340.02807, 206.62086, 93.02799], //14
    [980.438720703125, 56.759857177734375, 115.1641845703125, 56.140254974365234], //15
    [373.4725646972656, 423.40234375, 144.9078826904297, 169.2933807373047], //16
    [341.7474670410156, 437.6512145996094, 148.39407348632812, 115.6588134765625], //17
    [117.16754913330078, 559.5700073242188, 183.30487060546875, 188.30841064453125], //18
    [-174.2841339111328, 497.3167419433594, 136.66693115234375, 192.0149688720703], //19
    [-571.9983520507812, 661.6953735351562, 144.83985900878906, 165.8435821533203], //20
    [-682.216796875, 592.0908813476562, 144.39306640625, 223.222900390625], //21
    [-859.8622436523438, 690.9188842773438, 151.86073303222656, 187.37477111816406], //22
];

/*
884736502 - корпус сейфа
-1992154984 - дверь сейфа (Для взаимодействия с сейфом)
*/
houses.safeList = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //int 0
    [1969.53, 3814.22, 32.42871, 1.001791E-05, -5.008956E-06, -149.3734, 1969.52, 3814.22, 32.43, -6.106665E-13, -5.008956E-06, -149.37], //int 1
    [151.9885, -1000.334, -99.99998, 5.008955E-06, 2.23118E-05, -5.008957E-06, 151.99, -1000.34, -100, 0, 0, 0], //int 2
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //int 3
    [259.52, -1003.152, -100.0086, 1.384231E-12, -5.008955E-06, 89.99998, 259.52, -1003.156, -100.0042, 1.384231E-12, -5.008955E-06, 89.99998], //int 4
    [-1146.29, -1513.031, 9.632723, 1.017777E-12, 5.008956E-06, -145.0998, -1146.29, -1513.03, 9.632723, 0, 0, -145.2994], //int 5
    [349.38, -993.08, -100.1962, 1.001791E-05, -5.008956E-06, -5.008955E-06, 349.38, -993.08, -100.1944, 0, 0, 0], //int 6
    [-17.51, -1438.57, 30.10154, 0, 0, 0, -17.51, -1438.57, 30.10154, 0, 0, 0], //int 7
    [1.6, 531.8, 169.6172, 0, 0, 25.09981, 1.59, 531.8, 169.6176, 0, -5.008956E-06, 25.10001], //int 8
    [-815.36, 176.29, 75.74074, 1.00179E-05, 5.008956E-06, -158.4995, -815.36, 176.29, 75.74074, -2.035555E-13, -5.008956E-06, -158.5], //int 9
    [-789.44, 331.81, 209.7966, -4.462358E-05, 2.231181E-05, -89.99998, -789.43, 331.82, 209.7966, -1.384231E-12, -5.008955E-06, -89.99998], //int 10
    [-768.12, 608.58, 139.3306, -4.46236E-05, 2.23118E-05, -71.62499, -768.12, 608.58, 139.3306, -6.106665E-13, -5.008955E-06, -71.61999], //int 11
    [-1284.191, 436.5764, 93.09478, -4.46236E-05, -6.329293E-05, -5.009006E-06, -1284.19, 436.58, 93.09478, 0, 0, 0], //int 12
    [-800.4415, 334.7465, 219.4385, 6.329289E-05, -6.32929E-05, 89.99998, -800.44, 334.75, 219.4385, 1.384231E-12, -5.008955E-06, 89.99998], //int 13
    [-789.9998, 339.0811, 200.4136, -5.97114E-13, -5.008956E-06, -89.99999, -790, 339.08, 200.4136, -5.97114E-13, -5.008956E-06, -89.99999], //int 14
    [974.4, 81.53, 115.1642, 0, 0, -31.99964, 974.4, 81.53, 115.1664, -4.07111E-13, -5.008956E-06, -32], //int 15
    [375.91, 409.65, 141.1002, 0, 0, -13.89997, 375.91, 409.65, 141.1002, -1.017777E-13, -5.008956E-06, -13.89999], //int 16
    [333.82, 426.08, 144.5708, 0, 0, -62.89964, 333.82, 426.08, 144.5708, 5.008956E-06, -5.008956E-06, -62.89999], //int 17
    [124.2, 547.5, 179.4972, 0, 0, 5.700339, 124.2, 547.5, 179.4972, -1.526666E-13, -5.008956E-06, 5.699993], //int 18
    [-165.19, 486.65, 132.8437, 0, 0, 11.10032, -165.19, 486.65, 132.8437, 1.017777E-13, -5.008955E-06, 11.10001], //int 19
    [-569.74, 647.86, 141.0322, 1.001791E-05, -5.008956E-06, -14.52429, -569.74, 647.86, 141.0322, 0, -5.008956E-06, -14.51999], //int 20
    [-669.03, 587.44, 140.5698, 1.00179E-05, -5.008952E-06, 40.77552, -669.03, 587.44, 140.5698, 2.035555E-13, -5.008956E-06, 40.77999], //int 21
    [-853.22, 678.65, 148.053, 1.00179E-05, -5.008948E-06, 4.875454, -853.22, 678.65, 148.053, 0, -5.008956E-06, 4.880001], //int 22
];

houses.garageList = [
    [220.70960998535156, -1038.216552734375, -90.7828598022461, 89.93685913085938, 220.70960998535156, -1038.216552734375, -90.7828598022461, 89.93685913085938], //0
    [220.56533813476562, -1023.2962036132812, -90.78504943847656, 90.95828247070312, 220.56533813476562, -1023.2962036132812, -90.78504943847656, 90.95828247070312], //1
    [171.62208557128906, -1004.2356567382812, -99.34237670898438, 176.3421630859375, 174.87139892578125, -1004.3195190429688, -99.34042358398438, 175.2149658203125], //2
    [194.46551513671875, -1023.3160400390625, -99.34183502197266, 178.6278076171875, 194.46551513671875, -1023.3160400390625, -99.34183502197266, 178.6278076171875], //3
    [202.08786010742188, -1004.32177734375, -99.3424072265625, 179.615478515625, 194.57009887695312, -1003.9288330078125, -99.34040832519531, 179.01983642578125], //4
    [231.94662475585938, -1002.9686889648438, -99.34088897705078, 177.40728759765625, 224.2627716064453, -1002.6691284179688, -99.3412094116211, 179.1136474609375], //5
    [242.1449432373047, -1062.562255859375, -89.96808624267578, 181.02210998535156, 246.13970947265625, -1062.597412109375, -89.96800231933594, 181.68972778320312], //6
    [-850.1660766601562, 276.265625, 32.91801452636719, 185.994873046875, -850.1660766601562, 276.265625, 32.91801452636719, 185.994873046875], //7
    [-810.5316162109375, 306.0752868652344, 32.911216735839844, 189.51881408691406, -806.1517333984375, 307.5685729980469, 32.91827392578125, 215.94622802734375], //8
    [224.41, -1002.54, -86.87006, 0.3072979, 224.41, -1002.54, -86.87006, 0.3072979], //9
];

houses.garageIntList = [
    [224.57962036132812, -1041.0115966796875, -91.43866729736328, 356.06982421875], //0
    [224.49180603027344, -1025.9735107421875, -91.43852996826172, 356.19805908203125], //1
    [179.0699005126953, -1000.7018432617188, -99.99992370605469, 166.12240600585938], //2
    [206.85565185546875, -1018.3351440429688, -100, 79.45574188232422], //3
    [206.68206787109375, -999.125732421875, -99.99996948242188, 85.36624145507812], //4
    [240.39942932128906, -1004.7258911132812, -99.99995422363281, 90.05451202392578], //5
    [249.5333709716797, -1058.5482177734375, -90.62726593017578, 179.1864471435547], //6
    [-853.1052856445312, 272.1293029785156, 32.258548736572266, 304.2354736328125], //7
    [-812.22607421875, 301.4500427246094, 32.258548736572266, 37.54323196411133], //8
    [238.067, -1004.869, -87.5613, 95.49491], //9
];

houses.loadAll = function() {
    methods.debug('houses.loadAll');

    mysql.executeQuery(`SELECT * FROM houses`, function (err, rows, fields) {
        rows.forEach(function(item) {

            houses.set(item['id'], 'id', item['id']);
            houses.set(item['id'], 'number', item['number']);
            houses.set(item['id'], 'address', item['address']);
            houses.set(item['id'], 'street', item['street']);
            houses.set(item['id'], 'price', item['price']);
            houses.set(item['id'], 'user_id', item['user_id']);
            houses.set(item['id'], 'user_name', item['user_name']);
            houses.set(item['id'], 'pin', item['pin']);
            houses.set(item['id'], 'is_safe', item['is_safe']);
            houses.set(item['id'], 'is_sec', item['is_sec']);
            houses.set(item['id'], 'is_lock', item['is_lock']);
            houses.set(item['id'], 'interior', item['interior']);
            houses.set(item['id'], 'x', item['x']);
            houses.set(item['id'], 'y', item['y']);
            houses.set(item['id'], 'z', item['z']);
            houses.set(item['id'], 'rot', item['rot']);

            houses.set(item['id'], 'ginterior1', item['ginterior1']);
            houses.set(item['id'], 'gx1', item['gx1']);
            houses.set(item['id'], 'gy1', item['gy1']);
            houses.set(item['id'], 'gz1', item['gz1']);
            houses.set(item['id'], 'grot1', item['grot1']);

            houses.set(item['id'], 'ginterior2', item['ginterior2']);
            houses.set(item['id'], 'gx2', item['gx2']);
            houses.set(item['id'], 'gy2', item['gy2']);
            houses.set(item['id'], 'gz2', item['gz2']);
            houses.set(item['id'], 'grot2', item['grot2']);

            houses.set(item['id'], 'ginterior3', item['ginterior3']);
            houses.set(item['id'], 'gx3', item['gx3']);
            houses.set(item['id'], 'gy3', item['gy3']);
            houses.set(item['id'], 'gz3', item['gz3']);
            houses.set(item['id'], 'grot3', item['grot3']);

            houses.set(item['id'], 'max_roommate', item['max_roommate']);

            houses.set(item['id'], 'tax_money', item['tax_money']);
            houses.set(item['id'], 'tax_score', item['tax_score']);

            let sprite = 40;
            let scale = 0.4;
            let name = undefined;
            if (item['ginterior1'] >= 0) {
                sprite = 492;
                scale = 0.55;
                name = '';
            }

            let pos = new mp.Vector3(parseFloat(item['x']), parseFloat(item['y']), parseFloat(item['z']));
            let blip = methods.createBlip(pos, sprite, item['user_id'] > 0 ? 59 : 69, scale - (item['user_id'] > 0 ? 0.15 : 0), name);

            let hBlip = {
                blip: blip,
                position: pos,
                safe: null,
                safeDoor: null,
                g1: { int: item['ginterior1'], position: new mp.Vector3(parseFloat(item['gx1']), parseFloat(item['gy1']), parseFloat(item['gz1'])), rot: item['grot1'] },
                g2: { int: item['ginterior2'], position: new mp.Vector3(parseFloat(item['gx2']), parseFloat(item['gy2']), parseFloat(item['gz2'])), rot: item['grot2'] },
                g3: { int: item['ginterior3'], position: new mp.Vector3(parseFloat(item['gx3']), parseFloat(item['gy3']), parseFloat(item['gz3'])), rot: item['grot3'] },
            };

            methods.createCp(hBlip.position.x, hBlip.position.y, hBlip.position.z, "Нажмите ~g~Е~s~ чтобы открыть меню");

            if (hBlip.g1.int >= 0)
                methods.createCpVector(hBlip.g1.position, "Нажмите ~g~Е~s~ чтобы открыть меню гаража", 3, -1, [33, 150, 243, 0]);
            if (hBlip.g2.int >= 0)
                methods.createCpVector(hBlip.g2.position, "Нажмите ~g~Е~s~ чтобы открыть меню гаража", 3, -1, [33, 150, 243, 0]);
            if (hBlip.g3.int >= 0)
                methods.createCpVector(hBlip.g3.position, "Нажмите ~g~Е~s~ чтобы открыть меню гаража", 3, -1, [33, 150, 243, 0]);
            hBlips.set(item['id'], hBlip);

            if (item['is_safe']) {
                houses.updateSafe(item['id'], item['is_safe'], true);
            }

        });
        count = rows.length;
        methods.debug('All Houses Loaded: ' + count);
    });

    houses.interiorList.forEach(function(item) {
        let x = item[0];
        let y = item[1];
        let z = item[2];
        methods.createCp(x, y, z, "Нажмите ~g~Е~s~ чтобы открыть меню");
    });

    houses.garageIntList.forEach(function(item) {
        let x = item[0];
        let y = item[1];
        let z = item[2];
        methods.createCp(x, y, z, "Нажмите ~g~Е~s~ чтобы открыть меню");
    });

    houses.garageList.forEach(function(item) {
        let x = item[0];
        let y = item[1];
        let z = item[2];
        methods.createCp(x, y, z, "Нажмите ~g~Е~s~ чтобы открыть меню гаража", 3, -1, [33, 150, 243, 0]);

        x = item[4];
        y = item[5];
        z = item[6];
        methods.createCp(x, y, z, "Нажмите ~g~Е~s~ чтобы открыть меню гаража", 3, -1, [33, 150, 243, 0]);
    });
};


houses.loadLast = function() {
    methods.debug('houses.loadLast');

    mysql.executeQuery(`SELECT * FROM houses ORDER BY id DESC LIMIT 1`, function (err, rows, fields) {

        rows.forEach(function(item) {

            houses.set(item['id'], 'id', item['id']);
            houses.set(item['id'], 'number', item['number']);
            houses.set(item['id'], 'address', item['address']);
            houses.set(item['id'], 'street', item['street']);
            houses.set(item['id'], 'price', item['price']);
            houses.set(item['id'], 'user_id', item['user_id']);
            houses.set(item['id'], 'user_name', item['user_name']);
            houses.set(item['id'], 'pin', item['pin']);
            houses.set(item['id'], 'is_safe', item['is_safe']);
            houses.set(item['id'], 'is_sec', item['is_sec']);
            houses.set(item['id'], 'is_lock', item['is_lock']);
            houses.set(item['id'], 'interior', item['interior']);
            houses.set(item['id'], 'x', item['x']);
            houses.set(item['id'], 'y', item['y']);
            houses.set(item['id'], 'z', item['z']);
            houses.set(item['id'], 'rot', item['rot']);

            houses.set(item['id'], 'ginterior1', item['ginterior1']);
            houses.set(item['id'], 'gx1', item['gx1']);
            houses.set(item['id'], 'gy1', item['gy1']);
            houses.set(item['id'], 'gz1', item['gz1']);
            houses.set(item['id'], 'grot1', item['grot1']);

            houses.set(item['id'], 'ginterior2', item['ginterior2']);
            houses.set(item['id'], 'gx2', item['gx2']);
            houses.set(item['id'], 'gy2', item['gy2']);
            houses.set(item['id'], 'gz2', item['gz2']);
            houses.set(item['id'], 'grot2', item['grot2']);

            houses.set(item['id'], 'ginterior3', item['ginterior3']);
            houses.set(item['id'], 'gx3', item['gx3']);
            houses.set(item['id'], 'gy3', item['gy3']);
            houses.set(item['id'], 'gz3', item['gz3']);
            houses.set(item['id'], 'grot3', item['grot3']);

            houses.set(item['id'], 'max_roommate', item['max_roommate']);

            houses.set(item['id'], 'tax_money', item['tax_money']);
            houses.set(item['id'], 'tax_score', item['tax_score']);

            let pos = new mp.Vector3(parseFloat(item['x']), parseFloat(item['y']), parseFloat(item['z']));
            let blip = methods.createBlip(pos, 40, item['user_id'] > 0 ? 59 : 69, 0.4);

            let hBlip = {
                blip: blip,
                position: pos,
                safe: null,
                safeDoor: null,
                g1: { int: item['ginterior1'], position: new mp.Vector3(parseFloat(item['gx1']), parseFloat(item['gy1']), parseFloat(item['gz1'])), rot: item['grot1'] },
                g2: { int: item['ginterior2'], position: new mp.Vector3(parseFloat(item['gx2']), parseFloat(item['gy2']), parseFloat(item['gz2'])), rot: item['grot2'] },
                g3: { int: item['ginterior3'], position: new mp.Vector3(parseFloat(item['gx3']), parseFloat(item['gy3']), parseFloat(item['gz3'])), rot: item['grot3'] },
            };

            methods.createCp(hBlip.position.x, hBlip.position.y, hBlip.position.z, "Нажмите ~g~Е~s~ чтобы открыть меню");

            hBlips.set(item['id'], hBlip);

            let id = item['id'];
            discord.sendMarketProperty(`Дом #${houses.get(id, 'number')}`, `Адрес: ${houses.get(id, 'address')} / ${houses.get(id, 'street')} #${houses.get(id, 'number')}\nГос. стоимость: ${methods.moneyFormat(houses.get(id, 'price'))}\nЖилых мест: ${houses.get(id, 'max_roommate')}`);

            chat.sendToAll(`Дом добавлен. ID: ${item['id']}. Name: ${item['number']}. Int: ${item['interior']}. Price: ${methods.moneyFormat(item['price'])}`);

            if (item['is_safe']) {
                houses.updateSafe(item['id'], item['is_safe'], true);
            }

            mp.players.forEach(p => {
                methods.updateCheckpointList(p);
            });
        });
        count = rows.length;
        methods.debug(`Last House Loaded`);
    });
};

houses.insert = function(player, number, street, zone, x, y, z, rot, interior, price) {
    methods.debug('houses.insert');

    mysql.executeQuery(`INSERT INTO houses (number, street, address, rot, x, y, z, interior, price) VALUES ('${number}', '${street}', '${zone}', '${rot}', '${x}', '${y}', '${z - 1}', '${interior}', '${price}')`);
    setTimeout(houses.loadLast, 1000);
};

houses.insert1 = function(player, id, int, gx, gy, gz, grot) {
    methods.debug('houses.insert1');

    houses.set(id, 'gx1', gx);
    houses.set(id, 'gy1', gy);
    houses.set(id, 'gz1', gz);
    houses.set(id, 'grot1', grot);

    mysql.executeQuery(`UPDATE houses SET grot1 = '${grot}', gx1 = '${gx}', gy1 = '${gy}', gz1 = '${gz}', ginterior1 = '${int}' where id = '${id}'`);

    player.outputChatBox(`Дом успешно обновлен (G1 | ID ${id} | INT ${int})`);
};

houses.insert2 = function(player, id, int, gx, gy, gz, grot) {
    methods.debug('houses.insert2');

    houses.set(id, 'gx2', gx);
    houses.set(id, 'gy2', gy);
    houses.set(id, 'gz2', gz);
    houses.set(id, 'grot2', grot);

    mysql.executeQuery(`UPDATE houses SET grot2 = '${grot}', gx2 = '${gx}', gy2 = '${gy}', gz2 = '${gz}', ginterior2 = '${int}' where id = '${id}'`);

    player.outputChatBox(`Дом успешно обновлен (G2 | ID ${id} | INT ${int})`);
};

houses.insert3 = function(player, id, int, gx, gy, gz, grot) {
    methods.debug('houses.insert3');

    houses.set(id, 'gx3', gx);
    houses.set(id, 'gy3', gy);
    houses.set(id, 'gz3', gz);
    houses.set(id, 'grot3', grot);

    mysql.executeQuery(`UPDATE houses SET grot3 = '${grot}', gx3 = '${gx}', gy3 = '${gy}', gz3 = '${gz}', ginterior3 = '${int}' where id = '${id}'`);

    player.outputChatBox(`Дом успешно обновлен (G3 | ID ${id} | INT ${int})`);
};

houses.getHouseData = function(id) {
    return Container.Data.GetAll(enums.offsets.house + methods.parseInt(id));
};

houses.get = function(id, key) {
    return Container.Data.Get(enums.offsets.house + methods.parseInt(id), key);
};

houses.set = function(id, key, val) {
    Container.Data.Set(enums.offsets.house + methods.parseInt(id), key, val);
};

houses.getCountLiveUser = function(id, cb) {
    id = methods.parseInt(id);
    mysql.executeQuery(`SELECT id FROM users WHERE house_id = ${id}`, function (err, rows, fields) {
        cb(rows.length);
    });
};

houses.getAllHouses = function() {
    methods.debug('houses.getAllHouses');
    return hBlips;
};

houses.updateOwnerInfo = function (id, userId, userName) {
    methods.debug('houses.updateOwnerInfo');
    id = methods.parseInt(id);
    userId = methods.parseInt(userId);

    houses.set(id, "user_name", userName);
    houses.set(id, "user_id", userId);

    hBlips.get(id).blip.color = userId > 0 ? 59 : 69;

    if (userId == 0) {
        houses.updatePin(id, 0);
        houses.lockStatus(id, false);
        houses.updateSafe(id, 0);

        discord.sendMarketProperty(`Дом #${houses.get(id, 'number')}`, `Адрес: ${houses.get(id, 'address')} / ${houses.get(id, 'street')} #${houses.get(id, 'number')}\nГос. стоимость: ${methods.moneyFormat(houses.get(id, 'price'))}\nЖилых мест: ${houses.get(id, 'max_roommate')}`);
    }

    mysql.executeQuery("UPDATE houses SET user_name = '" + userName + "', user_id = '" + userId + "', tax_money = '0' where id = '" + id + "'");
};

houses.updateSafe = function (id, pin, isLoad = false) {
    try {
        methods.debug('houses.updateSafe');

        pin = methods.parseInt(pin);

        if (pin > 0) {
            let intId = houses.get(id, "interior");

            let safeItem = houses.safeList[intId];
            if (!mp.objects.exists(hBlips.get(id).safe)) {
                hBlips.get(id).safe = mp.objects.new(884736502, new mp.Vector3(safeItem[0], safeItem[1], safeItem[2]),
                    {
                        rotation: new mp.Vector3(safeItem[3], safeItem[4], safeItem[5]),
                        alpha: 255,
                        dimension: id
                    });
                hBlips.get(id).safe.setVariable('houseSafe', id);
            }
            if (!mp.objects.exists(hBlips.get(id).safeDoor))
            {
                hBlips.get(id).safeDoor = mp.objects.new(-1992154984, new mp.Vector3(safeItem[6], safeItem[7], safeItem[8]),
                    {
                        rotation: new mp.Vector3(safeItem[9], safeItem[10], safeItem[11]),
                        alpha: 255,
                        dimension: id
                    });
                hBlips.get(id).safeDoor.setVariable('houseSafe', id);
            }
            if (!isLoad) {
                houses.set(id, "is_safe", pin);
                mysql.executeQuery("UPDATE houses SET is_safe = '" + pin + "' where id = '" + id + "'");
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
                mysql.executeQuery("UPDATE houses SET is_safe = '0' where id = '" + id + "'");
                houses.set(id, "is_safe", 0);
            }
        }
    }
    catch (e) {
        methods.debug(e);
        methods.debug(e);
        methods.debug(e);
    }
};

houses.updatePin = function (id, pin) {
    methods.debug('houses.updatePin');
    id = methods.parseInt(id);
    pin = methods.parseInt(pin);
    houses.set(id, 'pin', pin);
    mysql.executeQuery("UPDATE houses SET pin = '" + pin + "' where id = '" + id + "'");
};

houses.lockStatus = function (id, lockStatus) {
    methods.debug('houses.lockStatus');
    id = methods.parseInt(id);
    houses.set(id, 'is_lock', lockStatus);
    mysql.executeQuery("UPDATE houses SET is_lock = '" + methods.boolToInt(lockStatus) + "' where id = '" + id + "'");
};

houses.sell = function (player) {
    methods.debug('houses.sell');
    if (!user.isLogin(player))
        return;

    if (user.get(player, 'house_id') == 0) {
        player.notify('~r~У Вас нет дома');
        return;
    }

    let hInfo = houses.getHouseData(user.get(player, 'house_id'));

    if (hInfo.get('user_id') != user.get(player, 'id')) {
        player.notify('~r~Этот дом вам не пренадлежит');
        return;
    }

    let nalog = methods.parseInt(hInfo.get('price') * (100 - coffer.getTaxProperty()) / 100);

    user.set(player, 'house_id', 0);

    houses.updateOwnerInfo(hInfo.get('id'), 0, '');

    coffer.removeMoney(1, nalog);
    user.addMoney(player, nalog, 'Продажа дома ' + hInfo.get('address') + ' №' + hInfo.get('number'));

    setTimeout(function () {
        if (!user.isLogin(player))
            return;
        user.addHistory(player, 3, 'Продал дом ' + hInfo.get('address') + ' №' + hInfo.get('number') + '. Цена: ' + methods.moneyFormat(nalog));
        player.notify(`~g~Вы продали недвижимость\nНалог:~s~ ${coffer.getTaxProperty()}%\n~g~Получено:~s~ ${methods.moneyFormat(nalog)}`);
        user.save(player);
    }, 1000);
};

houses.buy = function (player, id) {
    methods.debug('houses.buy');

    if (!user.isLogin(player))
        return;

    let hInfo = houses.getHouseData(id);
    if (user.get(player, 'house_id') > 0) {
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

    if (hInfo.get('price') >= 5000000)
        user.achiveDoneAllById(player, 31);

    user.set(player, 'house_id', id);

    houses.updateOwnerInfo(id, user.get(player, 'id'), user.get(player, 'name'));

    coffer.addMoney(1, hInfo.get('price'));
    user.removeMoney(player, hInfo.get('price'), 'Покупка дома ' + hInfo.get('address') + ' №' + hInfo.get('number'));
    setTimeout(function () {
        if (!user.isLogin(player))
            return;
        user.addHistory(player, 3, 'Купил дом ' + hInfo.get('address') + ' №' + hInfo.get('number') + '. Цена: ' + methods.moneyFormat(hInfo.get('price')));
        user.save(player);
        player.notify('~g~Поздравляем с покупкой недвижимости!');
    }, 500);
    return true;
};

houses.enter = function (player, id) {
    methods.debug('houses.enter', id);

    if (!user.isLogin(player))
        return;
    id = methods.parseInt(id);

    let hInfo = houses.getHouseData(id);
    player.dimension = id;
    let intId = hInfo.get('interior');
    user.teleport(player, houses.interiorList[intId][0], houses.interiorList[intId][1], houses.interiorList[intId][2] + 1, houses.interiorList[intId][3]);
};

houses.enterGarage = function (player, id) {
    if (!user.isLogin(player))
        return;
    user.teleport(player, houses.garageList[id][0], houses.garageList[id][1], houses.garageList[id][2], houses.garageList[id][3])
};

houses.enterv = function (player, id) {
    methods.debug('houses.enter', id);

    if (!user.isLogin(player))
        return;

    if (vehicles.exists(player.vehicle)) {
        let vInfo = methods.getVehicleInfo(player.vehicle.model);
        if (vInfo.class_name == 'Planes' ||
            vInfo.class_name == 'Boats' ||
            vInfo.class_name == 'Helicopters' ||
            vInfo.class_name == 'Emergency' ||
            vInfo.class_name == 'Commercials' ||
            vInfo.class_name == 'Service' ||
            vInfo.class_name == 'Industrial' ||
            vInfo.class_name == 'Military')
        {
            player.notify('~r~Данному классу авто запрещено заезжать в гараж');
            return;
        }
    }

    id = methods.parseInt(id);

    let hInfo = houses.getHouseData(id);

    /*if (hInfo.get('is_lock') && hInfo.get('user_id') !== user.getId(player)) {
        player.notify('~r~Гараж закрыт');
        return;
    }*/

    let garageId = -1;

    let pos1 = new mp.Vector3(hInfo.get('gx1'), hInfo.get('gy1'), hInfo.get('gz1'));
    let pos2 = new mp.Vector3(hInfo.get('gx2'), hInfo.get('gy2'), hInfo.get('gz2'));
    let pos3 = new mp.Vector3(hInfo.get('gx3'), hInfo.get('gy3'), hInfo.get('gz3'));

    if (methods.distanceToPos(player.position, pos1) < 4)
        garageId = hInfo.get('ginterior1');
    else if (methods.distanceToPos(player.position, pos2) < 4)
        garageId = hInfo.get('ginterior2');
    else if (methods.distanceToPos(player.position, pos3) < 4)
        garageId = hInfo.get('ginterior3');

    if (garageId == -1) {
        player.notify('~r~Вы отошли слишком далеко');
        return;
    }

    let pos = new mp.Vector3(houses.garageList[garageId][0], houses.garageList[garageId][1], houses.garageList[garageId][2]);
    let v = methods.getNearestVehicleWithCoords(pos, 4, id);

    if (vehicles.exists(v) && player.vehicle) {
        let pos = new mp.Vector3(houses.garageList[garageId][4], houses.garageList[garageId][5], houses.garageList[garageId][6]);
        let v2 = methods.getNearestVehicleWithCoords(pos, 4, id);

        if (vehicles.exists(v2) && player.vehicle) {
            player.notify('~r~К сожалению, сейчас у ворот уже стоит транспорт, необходимо чтобы он отъехал');
            return;
        }

        if (vehicles.exists(player.vehicle))
            player.vehicle.dimension = id;
        else
            player.dimension = id;
        user.teleportVeh(player, houses.garageList[garageId][4], houses.garageList[garageId][5], houses.garageList[garageId][6], houses.garageList[garageId][7]);
        return;
    }

    if (vehicles.exists(player.vehicle))
        player.vehicle.dimension = id;
    else
        player.dimension = id;
    user.teleportVeh(player, houses.garageList[garageId][0], houses.garageList[garageId][1], houses.garageList[garageId][2], houses.garageList[garageId][3]);
};

houses.exitv = function (player, id) {
    methods.debug('houses.enter', id);

    if (!user.isLogin(player))
        return;

    if (vehicles.exists(player.vehicle)) {
        let vInfo = methods.getVehicleInfo(player.vehicle.model);
        if (vInfo.class_name == 'Planes' ||
            vInfo.class_name == 'Boats' ||
            vInfo.class_name == 'Helicopters' ||
            vInfo.class_name == 'Emergency' ||
            vInfo.class_name == 'Commercials' ||
            vInfo.class_name == 'Service' ||
            vInfo.class_name == 'Industrial' ||
            vInfo.class_name == 'Military')
        {
            player.notify('~r~Данному классу авто запрещено заезжать в гараж');
            return;
        }
    }

    id = methods.parseInt(id);

    let hInfo = houses.getHouseData(id);
    let garageId = -1;

    /*if (hInfo.get('is_lock') && hInfo.get('user_id') !== user.getId(player)) {
        player.notify('~r~Гараж закрыт');
        return;
    }*/

    let pos1 = new mp.Vector3(0, 0, 0);
    let pos11 = new mp.Vector3(0, 0, 0);
    let pos2 = new mp.Vector3(0, 0, 0);
    let pos22 = new mp.Vector3(0, 0, 0);
    let pos3 = new mp.Vector3(0, 0, 0);
    let pos33 = new mp.Vector3(0, 0, 0);


    if (hInfo.get('ginterior1') >= 0) {
        pos1 = new mp.Vector3(houses.garageList[hInfo.get('ginterior1')][0], houses.garageList[hInfo.get('ginterior1')][1], houses.garageList[hInfo.get('ginterior1')][2]);
        pos11 = new mp.Vector3(houses.garageList[hInfo.get('ginterior1')][4], houses.garageList[hInfo.get('ginterior1')][5], houses.garageList[hInfo.get('ginterior1')][6]);
    }
    if (hInfo.get('ginterior2') >= 0) {
        pos2 = new mp.Vector3(houses.garageList[hInfo.get('ginterior2')][0], houses.garageList[hInfo.get('ginterior2')][1], houses.garageList[hInfo.get('ginterior2')][2]);
        pos22 = new mp.Vector3(houses.garageList[hInfo.get('ginterior2')][4], houses.garageList[hInfo.get('ginterior2')][5], houses.garageList[hInfo.get('ginterior2')][6]);
    }
    if (hInfo.get('ginterior3') >= 0) {
        pos3 = new mp.Vector3(houses.garageList[hInfo.get('ginterior3')][0], houses.garageList[hInfo.get('ginterior3')][1], houses.garageList[hInfo.get('ginterior3')][2]);
        pos33 = new mp.Vector3(houses.garageList[hInfo.get('ginterior3')][4], houses.garageList[hInfo.get('ginterior3')][5], houses.garageList[hInfo.get('ginterior3')][6]);
    }

    if (methods.distanceToPos(player.position, pos1) < 4 || methods.distanceToPos(player.position, pos11) < 4)
        garageId = 1;
    else if (methods.distanceToPos(player.position, pos2) < 4 || methods.distanceToPos(player.position, pos22) < 4)
        garageId = 2;
    else if (methods.distanceToPos(player.position, pos3) < 4 || methods.distanceToPos(player.position, pos33) < 4)
        garageId = 3;

    if (garageId == -1) {
        player.notify('~r~Вы отошли слишком далеко');
        return;
    }

    if (vehicles.exists(player.vehicle))
        player.vehicle.dimension = 0;
    else
        player.dimension = 0;
    user.teleportVeh(player, hInfo.get('gx' + garageId), hInfo.get('gy' + garageId), hInfo.get('gz' + garageId), hInfo.get('grot' + garageId));
};