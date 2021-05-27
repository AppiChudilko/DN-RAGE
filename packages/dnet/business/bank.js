let methods = require('../modules/methods');
let Container = require('../modules/data');
let mysql = require('../modules/mysql');

let business = require('../property/business');

let weather = require('../managers/weather');
let dispatcher = require('../managers/dispatcher');

let user = require('../user');
let coffer = require('../coffer');
let inventory = require('../inventory');

let bank = exports;

bank.markers = [
    [253.4611, 220.7204, 106.2865, 2],
    [251.749, 221.4658, 106.2865, 2],
    [248.3227, 222.5736, 106.2867, 2],
    [246.4875, 223.2582, 106.2867, 2],
    [243.1434, 224.4678, 106.2868, 2],
    [241.1435, 225.0419, 106.2868, 2],

    [148.5, -1039.971, 29.37775, 3],
    [1175.054, 2706.404, 38.09407, 3],
    [-1212.83, -330.3573, 37.78702, 3],
    [314.3541, -278.5519, 54.17077, 3],
    [-2962.951, 482.8024, 15.7031, 3],
    [-350.6871, -49.60739, 49.04258, 3],

    [-111.1722, 6467.846, 31.62671, 4],
    [-113.3064, 6469.969, 31.62672, 4]
];
bank.fleecaMarkers = [
    [148.5, -1039.971, 29.37775],
    [1175.054, 2706.404, 38.09407],
    [-1212.83, -330.3573, 37.78702],
    [-2962.951, 482.8024, 14.7031],
    [-350.6871, -49.60739, 48.04258],
    [314.3541, -278.5519, 54.17077]
];
bank.blainePos = new mp.Vector3(-110.9777, 6470.198, 31.62671);
bank.pacificPos = new mp.Vector3(235.5093, 216.8752, 106.2867);
bank.mazePos1 = new mp.Vector3(-66.66476, -802.0474, 44.22729);
bank.mazePos2 = new mp.Vector3(-1381.6627197265625, -477.76763916015625, 71.04210662841797);

let pos1 = new mp.Vector3(592.0863037109375, -3280.79931640625, 5.069560527801514);

bank.grabPos = [
    //[265.7952, 213.5179, 100.6834, 1000],
    [149.7346954345703, -1045.0836181640625, 28.346284866333008, 340.3794250488281, 50], //1 Fleeca
    [150.78562927246094, -1046.550048828125, 28.3463134765625, 253.30227661132812, 50], //1 Fleeca
    [150.3111114501953, -1049.879150390625, 28.346399307250977, 256.7460632324219, 50], //1 Fleeca
    [148.34864807128906, -1050.489501953125, 28.34636878967285, 158.39613342285156, 50], //1 Fleeca
    [147.0778045654297, -1048.675537109375, 28.34629249572754, 69.17208099365234, 50], //1 Fleeca

    [311.414794921875, -286.997314453125, 53.14303207397461, 65.65191650390625, 50], //2 Fleeca
    [312.6293640136719, -288.9345397949219, 53.14309310913086, 160.13775634765625, 50], //2 Fleeca
    [314.7052001953125, -288.172119140625, 53.14309310913086, 246.85928344726562, 50], //2 Fleeca
    [315.2232360839844, -284.9268798828125, 53.14301681518555, 246.265380859375, 50], //2 Fleeca
    [314.11553955078125, -283.5606994628906, 53.143001556396484, 342.7865905761719, 50], //2 Fleeca

    [-353.5682678222656, -57.798828125, 48.01482009887695, 68.28033447265625, 50], //3 Fleeca
    [-352.33209228515625, -59.58372116088867, 48.01487731933594, 161.0061492919922, 50], //3 Fleeca
    [-350.3403625488281, -59.01103591918945, 48.01487731933594, 250.86105346679688, 50], //3 Fleeca
    [-349.85052490234375, -55.66060256958008, 48.014801025390625, 249.18411254882812, 50], //3 Fleeca
    [-351.1510925292969, -54.277156829833984, 48.01478958129883, 329.4079284667969, 50], //3 Fleeca

    [-2954.10498046875, 482.6646423339844, 14.675313949584961, 172.8809356689453, 50], //4 Fleeca
    [-2952.712646484375, 484.362548828125, 14.675384521484375, 264.9574890136719, 50], //4 Fleeca
    [-2953.955322265625, 486.13299560546875, 14.675411224365234, 356.767333984375, 50], //4 Fleeca
    [-2957.267333984375, 485.6308288574219, 14.675328254699707, 353.3204345703125, 50], //4 Fleeca
    [-2958.415283203125, 484.1565246582031, 14.675297737121582, 106.96119689941406, 50], //4 Fleeca

    [1174.9677734375, 2715.234619140625, 37.06627655029297, 266.14385986328125, 50], //5 Fleeca
    [1173.0654296875, 2716.480712890625, 37.06633377075195, 354.5975341796875, 50], //5 Fleeca
    [1171.5247802734375, 2715.162353515625, 37.06633377075195, 89.02828979492188, 50], //5 Fleeca
    [1172.1947021484375, 2711.862060546875, 37.066253662109375, 87.42176818847656, 50], //5 Fleeca
    [1173.611572265625, 2711.01904296875, 37.06624984741211, 175.1178436279297, 50], //5 Fleeca

    [-1209.4210205078125, -333.86944580078125, 36.759246826171875, 35.28739547729492, 50], //6 Fleeca
    [-1207.6424560546875, -333.9707336425781, 36.759254455566406, 295.8665771484375, 50], //6 Fleeca
    [-1205.712646484375, -336.59283447265625, 36.759334564208984, 296.6121826171875, 50], //6 Fleeca
    [-1206.6063232421875, -338.58599853515625, 36.759334564208984, 206.62356567382812, 50], //6 Fleeca
    [-1208.793212890625, -338.1792907714844, 36.759273529052734, 117.29550170898438, 50], //6 Fleeca

    [259.3692932128906, 217.5097198486328, 100.6834487915039, 341.1952209472656, 100],//7 Pacific
    [258.5928955078125, 214.7200164794922, 100.6834487915039, 160.33938598632812, 100],//7 Pacific
    [264.3625793457031, 215.42630004882812, 100.6834487915039, 334.478515625, 100],//7 Pacific
    [265.24407958984375, 213.91961669921875, 100.6834487915039, 244.39437866210938, 100],//7 Pacific
    [263.771484375, 212.95953369140625, 100.6834487915039, 143.15187072753906, 100],//7 Pacific
];

bank.doorPos = [
    //[961976194, 255.2283, 223.976, 102.3932],
    [2121050683, 148.0266, -1044.364, 29.506930, 1], //1 Fleeca
    [2121050683, 312.358, -282.7301, 54.30365, 1], //2 Fleeca
    [2121050683, -352.7365, -53.57248, 49.17543, 1], //3 Fleeca
    [-63539571, -2958.539, 482.2706, 15.83594, 1], //4 Fleeca
    [2121050683, 1175.542, 2710.861, 38.22689, 1], //5 Fleeca
    [2121050683, -1211.4628, -334.9701, 36.7809, 1], //6 Fleeca
    [961976194, 255.2283, 223.976, 102.3932, 2], //7 Pacific
];

bank.doorPos2 = [
    [148.70309448242188, -1045.873779296875, 28.346275329589844, 162.990478515625], //1 Fleeca
    [313.0599060058594, -284.15972900390625, 53.143001556396484, 156.33438110351562], //2 Fleeca
    [-352.0060119628906, -55.08885955810547, 48.01478958129883, 156.97299194335938], //3 Fleeca
    [-2957.24072265625, 483.4284362792969, 14.675286293029785, 267.50872802734375], //4 Fleeca
    [1174.3895263671875, 2712.03759765625, 37.06624984741211, 2.002439260482788], //5 Fleeca
    [-1209.6844482421875, -335.0898742675781, 36.75924301147461, 202.06007385253906], //6 Fleeca
    [256.7321472167969, 219.4569091796875, 105.28642272949219, 340.9010009765625], //7 Pacific
];

bank.doorPosExplode = [
    [150.2913, -1047.629, 29.6663], //1 Fleeca
    [314.6238, -285.9945, 54.46301], //2 Fleeca
    [-350.4144, -56.79705, 49.3348], //3 Fleeca
    [-2956.116, 485.4206, 15.99531], //4 Fleeca
    [1172.291, 2713.146, 38.38625], //5 Fleeca
    [-1207.328, -335.1289, 38.07925], //6 Fleeca
    [256.3116, 220.6579, 106.4296], //7 Pacific
];

bank.doorPosLockPick = [
    [237.7704, 227.87, 106.426], //1 Pacific
    [266.3624, 217.5697, 110.4328], //2 Pacific
    [256.6172, 206.1522, 110.4328], //3 Pacific
    [236.5488, 228.3147, 110.4328], //4 Pacific
];

bank.loadAll = function() {
    methods.debug('bank.loadAll');

    methods.createBlip(bank.pacificPos, 500, 65, 0.9, 'Bank Pacific');
    methods.createBlip(bank.blainePos, 500, 67, 0.9, 'Bank Blaine');
    methods.createBlip(bank.mazePos1, 500, 59, 0.9, 'Bank Maze');
    methods.createBlip(bank.mazePos2, 500, 59, 0.9, 'Bank Maze');

    bank.fleecaMarkers.forEach(function (item) {
        let bankPos = new mp.Vector3(item[0], item[1], item[2]);
        methods.createBlip(bankPos, 500, 69, 0.9, 'Bank Fleeca');
    });

    bank.markers.forEach(function (item) {
        let bankPos = new mp.Vector3(item[0], item[1], item[2] - 1);
        methods.createCpVector(bankPos, "Нажмите ~g~Е~s~ чтобы открыть меню");
    });

    bank.doorPos.forEach(function (item) {
        let bankPos = new mp.Vector3(item[1], item[2], item[3]);
        methods.createCpVector(bankPos, "~y~Место для установки взрывчатки", 1.7, -1, [0,0,0,0]);
    });

    bank.doorPos2.forEach(function (item) {
        let bankPos = new mp.Vector3(item[0], item[1], item[2]);
        methods.createCpVector(bankPos, "~y~Нажмите ~s~E~y~ чтобы воспользоваться панелью", 1, -1, [0,0,0,0]);
    });

    bank.doorPosLockPick.forEach(function (item) {
        let bankPos = new mp.Vector3(item[0], item[1], item[2]);
        methods.createCpVector(bankPos, "~y~Используйте отмычку чтобы взломать дверь", 1, -1, [0,0,0,0]);
    });

    let idx = 0;
    bank.grabPos.forEach(function (item) {
        try {
            let bankPos = new mp.Vector3(item[0], item[1], item[2]);
            methods.createCpVector(bankPos, "~y~Место для ограбления ячеек", 1.7, -1, [0,0,0,0]);
            idx++;
        }
        catch (e) {
            methods.debug(e);
        }
    });

    methods.debug('LOAD ALL BANKS');
};

bank.addBankHistory = function(userId, card, text, price) {

    userId = methods.parseInt(userId);
    card = methods.parseInt(card);
    text = methods.removeQuotes(text);
    price = methods.parseFloat(price);

    let rpDateTime = weather.getRpDateTime();
    let timestamp = methods.getTimeStamp();

    mysql.executeQuery(`INSERT INTO log_bank_user (user_id, card, text, price, timestamp, rp_datetime) VALUES ('${userId}', '${card}', '${text}', '${price}', '${timestamp}', '${rpDateTime}')`);
};

bank.transferMoney = function(player, bankNumber, money) {
    methods.debug('bank.transferMoney');
    if (!user.isLogin(player))
        return;

    if (money < 1) {
        player.notify('~r~Сумма должна быть больше нуля');
        user.updateClientCache(player);
        return;
    }
    if (bankNumber < 1) {
        player.notify('~r~Номер карты должен быть больше нуля');
        user.updateClientCache(player);
        return;
    }

    if (user.getBankMoney(player) < money) {
        player.notify('~r~У Вас недостаточно средств');
        user.updateClientCache(player);
        return;
    }

    let sumForBiz = methods.parseInt(money * 0.005);
    let sumFinal = methods.parseInt(money * 0.99);

    let isOnline = false;
    let isEquip = false;

    methods.saveLog('log_give_money',
        ['type', 'user_from', 'user_to', 'sum'],
        ['BANK', user.get(player, 'bank_card'), bankNumber, money],
    );

    mp.players.forEach((pl) => {
        if (!user.isLogin(pl))
            return;
        if (user.get(pl, 'bank_card') == bankNumber) {
            isOnline = true;

            bank.addBusinessBankMoneyByCard(bankNumber, sumForBiz);
            bank.addBusinessBankMoneyByCard(user.getBankCardPrefix(player), sumForBiz);

            user.sendSmsBankOperation(player, 'Перевод: ~g~$' + methods.numberFormat(sumFinal));
            user.sendSmsBankOperation(pl, 'Зачисление: ~g~$' + methods.numberFormat(sumFinal));
            user.removeBankMoney(player, money, 'Перевод ' + bankNumber);
            user.addBankMoney(pl, sumFinal, 'Перевод от ' + user.get(player, 'bank_card'));

            user.save(pl);
            user.save(player);
        }
    });

    setTimeout(function () {
        if (!isOnline) {

            mysql.executeQuery(`SELECT * FROM users WHERE bank_card = ${bankNumber}`, function (err, rows, fields) {
                rows.forEach(function (item) {

                    bank.addBusinessBankMoneyByCard(bankNumber, sumForBiz);
                    bank.addBusinessBankMoneyByCard(user.getBankCardPrefix(player), sumForBiz);

                    user.sendSmsBankOperation(player, 'Перевод: ~g~' + methods.moneyFormat(sumFinal));
                    user.removeBankMoney(player, money, 'Перевод ' + bankNumber);
                    bank.addBankHistory(0, bankNumber, 'Перевод от ' + user.get(player, 'bank_card'), sumFinal);
                    bank.addBankHistory(0, user.get(player, 'bank_card'), 'Перевод ' + bankNumber, sumFinal);

                    mysql.executeQuery("UPDATE users SET money_bank = '" + (item["money_bank"] + sumFinal) + "' where id = '" + item["id"] + "'");
                    isEquip = true;
                });

                if (!isEquip) {
                    mysql.executeQuery(`SELECT * FROM items WHERE params LIKE '%"number":${bankNumber}%' OR params LIKE '%"number": ${bankNumber}%'`, function (err, rows, fields) {
                        rows.forEach(function (item) {

                            bank.addBusinessBankMoneyByCard(bankNumber, sumForBiz);
                            bank.addBusinessBankMoneyByCard(user.getBankCardPrefix(player), sumForBiz);

                            user.sendSmsBankOperation(player, 'Перевод: ~g~' + methods.moneyFormat(sumFinal));
                            user.removeBankMoney(player, money, 'Перевод ' + bankNumber);
                            bank.addBankHistory(0, bankNumber, 'Перевод от ' + user.get(player, 'bank_card'), sumFinal);
                            bank.addBankHistory(0, user.get(player, 'bank_card'), 'Перевод ' + bankNumber, sumFinal);

                            mysql.executeQuery("UPDATE items SET count = '" + (item["count"] + sumFinal) + "' where id = '" + item["id"] + "'");
                            isEquip = true;
                        });

                        if (!isOnline && !isEquip)
                            user.sendSmsBankOperation(player, 'Счёт не был найден', '~r~Ошибка перевода');
                    });
                }
            });
        }
    }, 500);

    user.updateClientCache(player);
};

bank.transferCryptoMoney = function(player, bankNumber, money) {
    methods.debug('bank.transferMoney');
    if (!user.isLogin(player))
        return;

    if (money < 0) {
        player.notify('~r~Сумма должна быть больше нуля');
        user.updateClientCache(player);
        return;
    }
    if (bankNumber === '') {
        player.notify('~r~Номер карты должен быть больше нуля');
        user.updateClientCache(player);
        return;
    }

    if (user.getCryptoMoney(player) < money) {
        player.notify('~r~У Вас недостаточно средств');
        user.updateClientCache(player);
        return;
    }

    let isOnline = false;
    let isEquip = false;

    methods.saveLog('log_give_money',
        ['type', 'user_from', 'user_to', 'sum'],
        ['CRYPTO', user.get(player, 'crypto_card'), bankNumber, money],
    );

    mp.players.forEach((pl) => {
        if (!user.isLogin(pl))
            return;
        if (user.get(pl, 'crypto_card') == bankNumber) {
            isOnline = true;
            player.notify('Перевод: ~g~' + methods.cryptoFormat(money));
            pl.notify('Зачисление: ~g~' + methods.cryptoFormat(money));
            user.removeCryptoMoney(player, money, 'Перевод ' + bankNumber);
            user.addCryptoMoney(pl, money, 'Перевод от ' + user.get(player, 'crypto_card'));

            user.save(pl);
            user.save(player);
        }
    });

    setTimeout(function () {
        if (!isOnline) {

            mysql.executeQuery(`SELECT * FROM users WHERE crypto_card = ${bankNumber}`, function (err, rows, fields) {
                rows.forEach(function (item) {
                    player.notify('Перевод: ~g~' + methods.cryptoFormat(money));
                    user.removeCryptoMoney(player, money, 'Перевод ' + bankNumber);

                    mysql.executeQuery("UPDATE users SET money_crypto = '" + (item["money_crypto"] + money) + "' where id = '" + item["id"] + "'");
                    isEquip = true;
                });
            });

            if (!isEquip)
                player.notify('~r~Счёт не был найден');
        }
    }, 500);
    user.updateClientCache(player);
};

bank.changePin = function(player, pin) {
    methods.debug('bank.changePin');
    if (!user.isLogin(player))
        return;

    let bankNumber = user.get(player, 'bank_card');
    mysql.executeQuery(`SELECT * FROM items WHERE params LIKE '%"number":${bankNumber}%' OR params LIKE '%"number": ${bankNumber}%'`, function (err, rows, fields) {
        rows.forEach(function (item) {
            if (user.isLogin(player)) {
                user.set(player, 'bank_pin', pin);
                let params = JSON.parse(item['params']);
                params.pin = pin;
                inventory.updateItemParams(item['id'], JSON.stringify(params));

                bank.addBankHistory(user.getId(player), bankNumber, 'Смена пинкода', 0);
                user.sendSmsBankOperation(player, 'Вы успешно сменили пинкод', 'Смена пинкода');
                user.save(player);
            }
        });
    });

};

/*bank.changeCardNumber = function(player, bankNumber) {
    methods.debug('bank.changeCardNumber');
    if (!user.isLogin(player))
        return;

    let money = 100000;

    if (user.getCashMoney(player) < money) {
        player.notify('~r~У Вас недостаточно средств');
        return;
    }
    if (bankNumber < 9999) {
        player.notify('~r~Номер карты должен быть больше 4-х цифр');
        return;
    }


    let bankPrefix = user.get(player, 'bank_prefix');

    mysql.executeQuery(`SELECT * FROM users WHERE bank_number = ${bankNumber} AND bank_prefix = ${bankPrefix}`, function (err, rows, fields) {
        if (rows.length === 0) {
            mysql.executeQuery(`SELECT * FROM items WHERE number = ${bankNumber} AND prefix = ${bankPrefix}`, function (err, rows, fields) {
                if (rows.length === 0) {
                    user.set(player, 'bank_number', bankNumber);
                    user.removeCashMoney(player, money);
                    bank.addBusinessBankMoneyByCard(bankPrefix, money);
                    user.sendSmsBankOperation(player, 'Ваш номер карты был изменён');
                    user.save(player);
                }
                else
                    user.sendSmsBankOperation(player, 'Номер карты уже существует', '~r~Ошибка');
            });
        }
        else
            user.sendSmsBankOperation(player, 'Номер карты уже существует', '~r~Ошибка');
    });
};*/

bank.withdraw = function(player, money, procent = 0) {
    methods.debug('bank.withdraw');

    //setTimeout(function () {

    procent = methods.parseInt(procent);
    if (!user.isLogin(player))
        return;

    if (money < 1) {
        player.notify('~r~Сумма должна быть больше нуля');
        return;
    }

    if (user.get(player, 'bank_card') < 1)
        return;

    mysql.executeQuery(`SELECT * FROM items WHERE owner_id = '${user.getId(player)}' AND owner_type = '1' AND item_id = 50 AND is_equip = 1`, function (err, rows, fields) {
        if (!user.isLogin(player))
            return;
        if (rows.length < 1) {
            player.notify('~r~Ваша банковская карта не экипирована');
            return;
        }

        if (user.getBankMoney(player) < money) {
            player.notify('~r~У Вас недостаточно средств');
            return;
        }

        if (procent == 0) {
            user.sendSmsBankOperation(player, 'Вывод: ~g~$' + methods.numberFormat(money));
            user.removeBankMoney(player, money, 'Вывод средств через отделение банка');
            user.addCashMoney(player, money, 'Вывод средств через отделение банка');

            inventory.updateItemCountByItemId(50, user.getBankMoney(player), user.getId(player));
        }
        else {
            let sum = methods.parseInt(money * ((100 - procent) / 100));
            let sumBank = methods.parseInt(money * (procent / 100));

            user.sendSmsBankOperation(player, 'Вывод: ~g~$' + methods.numberFormat(sum));
            bank.addBusinessBankMoneyByCard(user.getBankCardPrefix(player), sumBank);
            user.removeBankMoney(player, money, 'Вывод средств через банкомат');
            user.addCashMoney(player, sum, 'Вывод средств через банкомат');

            inventory.updateItemCountByItemId(50, user.getBankMoney(player), user.getId(player));
        }
        user.save(player);
    });
    //}, 1500);
};

bank.deposit = function(player, money, procent = 0) {
    methods.debug('bank.deposit');
    procent = methods.parseInt(procent);
    if (!user.isLogin(player))
        return;

    if (money < 1) {
        player.notify('~r~Сумма должна быть больше нуля');
        return;
    }

    if (user.getCashMoney(player) < money) {
        player.notify('~r~У Вас недостаточно средств');
        return;
    }

    if (user.get(player, 'bank_card') < 1)
        return;

    mysql.executeQuery(`SELECT * FROM items WHERE owner_id = '${user.getId(player)}' AND owner_type = '1' AND item_id = 50 AND is_equip = 1`, function (err, rows, fields) {
        if (!user.isLogin(player))
            return;
        if (rows.length < 1) {
            player.notify('~r~Ваша банковская карта не экипирована');
            return;
        }

        if (procent == 0) {
            user.sendSmsBankOperation(player, 'Зачисление: ~g~$' + methods.numberFormat(money));
            user.removeCashMoney(player, money, 'Зачисление в отделении банка');
            user.addBankMoney(player, money, 'Зачисление в отделении банка');

            inventory.updateItemCountByItemId(50, user.getBankMoney(player), user.getId(player));
        }
        else {
            let sum = methods.parseInt(money * ((100 - procent) / 100));
            let sumBank = methods.parseInt(money * (procent / 100));

            user.sendSmsBankOperation(player, 'Зачисление: ~g~$' + methods.numberFormat(sum));
            bank.addBusinessBankMoneyByCard(user.getBankCardPrefix(player), sumBank);
            user.removeCashMoney(player, money, 'Зачисление через банкомат');
            user.addBankMoney(player, sum, 'Зачисление через банкомат');

            inventory.updateItemCountByItemId(50, user.getBankMoney(player), user.getId(player));
        }
        user.save(player);
    });
};

bank.addBusinessBankMoneyByCard = function(prefix, money) {
    methods.debug('bank.addBusinessBankMoneyByCard');
    switch (prefix)
    {
        case 6000:
            business.addMoney(1, money);
            break;
        case 7000:
            business.addMoney(2, money);
            break;
        case 8000:
            business.addMoney(3, money);
            break;
        case 9000:
            business.addMoney(4, money);
            break;
        default:
            coffer.addMoney(money);
            break;
    }
};

bank.openCard = function(player, bankId, price) {
    methods.debug('bank.openCard');
    if (!user.isLogin(player))
        return;

    if (user.getMoney(player) < price) {
        player.notify('~r~У Вас недостаточно средств');
        return;
    }

    /*if (!business.isOpen(bankId)) {
        player.notify('~r~К сожалению у банка сейчас нет возможности выдать Вам карту.');
        return;
    }*/

    if (price < 0)
        return;

    let bankPrefix = 6000;

    switch (bankId)
    {
        case 1:
            bankPrefix = 6000;
            break;
        case 2:
            bankPrefix = 7000;
            break;
        case 3:
            bankPrefix = 8000;
            break;
        case 4:
            bankPrefix = 9000;
            break;
    }

    let number = methods.getRandomBankCard(bankPrefix);

    //methods.saveLog('BuyCardNumber', `${user.getRpName(player)} (${user.getId(player)}): ${number}`);

    user.removeCashMoney(player, price, 'Смена номера карты');

    if (business.isOpen(bankId)) {
        business.addMoney(bankId, price);
        business.removeMoneyTax(bankId, price / business.getPrice(bankId));
    }

    bank.sendSmsBankOpenOperation(player, bankPrefix);
    bank.addBankHistory(user.getId(player), number, 'Открытие счёта на имя ' + user.getRpName(player), price * -1);

    inventory.addItem(50, 1, 1, user.getId(player), 0, 0, `{"number":${number}, "pin":1234, "owner":"${user.getRpName(player)}"}`);

    player.notify('~g~Вы оформили карту, она лежит в инвентаре, экипируйте её\nВаш пинкод: ~s~1234');
};

bank.closeCard = function(player) {
    methods.debug('bank.closeCard');
    if (!user.isLogin(player))
        return;
    bank.sendSmsBankCloseOperation(player);

    let number = user.get(player, 'bank_card');
    user.set(player, 'bank_card', 0);
    let currentBankMoney = user.getBankMoney(player);
    user.removeBankMoney(player, currentBankMoney);
    bank.addBankHistory(user.getId(player), number, 'Закрытие счёта', 0);
    user.addCashMoney(player, currentBankMoney);

    mysql.executeQuery(`DELETE FROM items WHERE params LIKE '%"number":${number}%' OR params LIKE '%"number": ${number}%'`);
    //inventory.updateItemsEquipByItemId(50, user.getId(player), 1, 0);
};

bank.sendSmsBankCloseOperation = function(player, pref = 0) {
    user.sendSmsBankOperation(player, 'Ваш счёт в банке был закрыт. СМС оповещения были отключены, всего Вам хорошего!');
};

bank.sendSmsBankOpenOperation = function(player, pref = 0) {
    player.notify('Поздравляем с открытием счёта! Надеемся на долгое сотрудничество!\nВаш пинкод от карты:~g~ 1234');
    //user.sendSmsBankOperation(player, 'Поздравляем с открытием счёта! Надеемся на долгое сотрудничество!\nВаш пинкод от карты:~g~ 1234', pref);
};

bank.getInRadius = function(pos, radius = 2) {
    let stationId = -1;
    bank.markers.forEach(function (item) {
        let fuelStationShopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(pos, fuelStationShopPos) < radius)
            stationId = methods.parseInt(item[3]);
    });
    return stationId;
};

bank.getGrabInRadius = function(pos, radius = 1.7) {
    let idx = 0;
    let result = -1;
    bank.grabPos.forEach(function (item) {
        let fuelStationShopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(pos, fuelStationShopPos) < radius)
            result = idx;
        idx++;
    });
    return result;
};

bank.getBombInRadius = function(pos, radius = 1.7) {
    let idx = 0;
    let result = {
        idx: -1,
        type: -1,
    };
    bank.doorPos.forEach(function (item) {
        let fuelStationShopPos = new mp.Vector3(item[1], item[2], item[3]);
        if (methods.distanceToPos(pos, fuelStationShopPos) < radius)
        {
            result.idx = idx;
            result.type = item[4];
        }
        idx++;
    });
    return result;
};

bank.getHackDoorInRadius = function(pos, radius = 1.2) {
    let idx = 0;
    let result = -1;
    bank.doorPos2.forEach(function (item) {
        let fuelStationShopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(pos, fuelStationShopPos) < radius)
            result = idx;
        idx++;
    });
    return result;
};

bank.getLockPickDoorInRadius = function(pos, radius = 1.2) {
    let idx = 0;
    let result = -1;
    bank.doorPosLockPick.forEach(function (item) {
        let fuelStationShopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(pos, fuelStationShopPos) < radius)
            result = idx;
        idx++;
    });
    return result;
};

bank.hackFleecaDoor = function(player) {
    if (!user.isLogin(player))
        return;

    let doorId = bank.getHackDoorInRadius(player.position);
    if (doorId >= 0) {

        let pos = bank.doorPos2[doorId];
        let pos2 = bank.doorPosExplode[doorId];

        player.position = new mp.Vector3(pos[0], pos[1], pos[2] + 1);
        user.heading(player, pos[3]);
        user.blockKeys(player, true);
        user.playAnimation(player, 'anim@heists@ornate_bank@hack','hack_enter', 8);
        setTimeout(function () {
            if (!user.isLogin(player))
                return;
            user.playAnimation(player, 'anim@heists@ornate_bank@hack','hack_loop', 9);
            player.addAttachment('laptop');

            setTimeout(function () {
                if (!user.isLogin(player))
                    return;
                try {
                    user.stopAnimation(player);
                    user.blockKeys(player, false);
                    player.addAttachment('laptop', true);

                    dispatcher.sendPos("Код 0", "В банке сработала сигнализация", player.position);
                    methods.explodeObject(pos2[0], pos2[1], pos2[2] - 0.5, 200, 18, 0.1, false, 0);
                    methods.explodeObject(pos2[0], pos2[1], pos2[2] + 0.5, 200, 18, 0.1, false, 0);
                    methods.explodeObject(pos2[0], pos2[1], pos2[2], 200, 18, 0.1, false, 0);

                    methods.openObject(pos2[0], pos2[1], pos2[2], false, 5);
                }
                catch (e) {}
            }, 30000);
        }, 7500);
    }
};

bank.lockPickDoor = function(player, radius = 3) {
    if (!user.isLogin(player))
        return;

    let doorId = bank.getLockPickDoorInRadius(player.position, radius);
    if (doorId >= 0) {

        let pos = bank.doorPosLockPick[doorId];

        user.blockKeys(player, true);
        user.playAnimation(player, "mp_arresting", "a_uncuff", 8);
        setTimeout(function () {
            try {
                if (!user.isLogin(player))
                    return;
                user.stopAnimation(player);
                user.blockKeys(player, false);
                methods.openObject(pos[0], pos[1], pos[2], false, 5);
                player.notify('~g~Вы взломали дверь');
                dispatcher.sendPos("Код 0", "В банке сработала сигнализация", player.position);
            }
            catch (e) {}
        }, 5000);
    }
};

bank.checkPosForOpenMenu = function(player) {
    methods.debug('bank.checkPosForOpenMenu');
    try {
        let playerPos = player.position;
        let shopId = bank.getInRadius(playerPos, 2);
        if (shopId == -1) {
            return;
        }
        player.call('client:menuList:showBankMenu', [shopId, business.getPrice(shopId)]);
    }
    catch (e) {
        methods.debug(e);
    }
};

bank.findNearest = function(pos) {
    methods.debug('bank.findNearest');
    let prevPos = new mp.Vector3(9999, 9999, 9999);
    bank.markers.forEach(function (item,) {
        let fuelPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(fuelPos, pos) < methods.distanceToPos(prevPos, pos))
            prevPos = fuelPos;
    });
    return prevPos;
};

bank.findNearestFleeca = function(pos) {
    methods.debug('bank.findNearestFleeca');
    let prevPos = new mp.Vector3(9999, 9999, 9999);
    bank.fleecaMarkers.forEach(function (item,) {
        let fuelPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(fuelPos, pos) < methods.distanceToPos(prevPos, pos))
            prevPos = fuelPos;
    });
    return prevPos;
};