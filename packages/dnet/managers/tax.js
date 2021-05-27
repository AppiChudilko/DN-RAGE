let Container = require('../modules/data');
let mysql = require('../modules/mysql');
let methods = require('../modules/methods');

let user = require('../user');
let enums = require('../enums');

let condo = require('../property/condos');
let houses = require('../property/houses');
//let apartments = require('../property/apartments');
let business = require('../property/business');
let vehicles = require('../property/vehicles');
let stock = require('../property/stocks');
let yachts = require('../property/yachts');

let weather = require('./weather');

let tax = exports;

let _currentTax = 0.0007;
let _taxMin = 10;
let _taxDays = 21;

tax.loadAll = function() {
    methods.debug('tax.loadAll');
    setInterval(tax.removeTax, methods.parseInt(60000 * 60 * 3.4));
    tax.updateTax();

    mysql.executeQuery("UPDATE houses SET tax_score = (RAND(90000000) * 10000000) + 50000000");
    mysql.executeQuery("UPDATE condos SET tax_score = (RAND(90000000) * 10000000) + 40000000");
    mysql.executeQuery("UPDATE yachts SET tax_score = (RAND(90000000) * 10000000) + 80000000");
    //mysql.executeQuery("UPDATE apartment SET tax_score = (RAND(90000000) * 10000000) + 70000000");
    mysql.executeQuery("UPDATE business SET tax_score = (RAND(90000000) * 10000000) + 10000000");
    mysql.executeQuery("UPDATE stocks SET tax_score = (RAND(90000000) * 10000000) + 90000000");
    mysql.executeQuery("UPDATE cars SET tax_score = (RAND(90000000) * 10000000) + 30000000");
};

tax.adLiveInvader = function(text) {
    mysql.executeQuery(`INSERT INTO rp_inv_ad (title, name, text, phone, editor, timestamp, rp_datetime) VALUES ('Продажа', 'Государство', '${text}', 'gov.sa', 'Государство', '${methods.getTimeStamp()}', '${weather.getRpDateTime()}')`);

    mp.players.forEach(p => {
        user.sendPhoneNotify(p, 'Life Invader', '~g~Реклама | Продажа', text, 'CHAR_LIFEINVADER');
    });
};

tax.sell = function() {
    methods.debug('tax.sell');

    //=============================
    //============Склады=============
    //=============================
    mysql.executeQuery("SELECT * FROM stocks WHERE tax_money <= (round(price * '" + _currentTax + "' + '" + _taxMin + "', 0) * '" + _taxDays + "') * '-1' AND user_id > '0' LIMIT 20", function (err, rows, fields) {
        rows.forEach(row => {

            let price = methods.parseInt(row['price']);

            if (methods.parseInt(row["tax_money"]) < -100000)
                price = methods.parseInt(price * 1.3);

            mp.players.forEach(function (p) {
                if (user.isLogin(p) && user.getId(p) === methods.parseInt(row["user_id"])) {
                    user.set(p, 'stock_id', 0);
                    user.addBankMoney(p, price);
                    user.sendSmsBankOperation(p, `Зачисление: $${methods.numberFormat(price)}`);
                    p.notify('~r~Ваш склад был изъят государством за неуплату');
                    user.save(p);
                }
            });

            stock.updateOwnerInfo(methods.parseInt(row['id']), 0, '');
            mysql.executeQuery("UPDATE users SET money = money + '" + price + "', stock_id = '0' WHERE id = '" + methods.parseInt(row["user_id"]) + "'");

            mysql.executeQuery("UPDATE stocks SET tax_money = '0' WHERE id = '" + row['id'] + "'");

            methods.saveLog('log_sell_inactive',
                ['text'],
                [`USER: ${row["user_id"]} STOCK ${row["id"]}`],
            );
        });

        if (rows.length > 0)
            tax.adLiveInvader(`Склады поступили в продажу`);
    });

    //=============================
    //============Дома=============
    //=============================
    mysql.executeQuery("SELECT * FROM houses WHERE tax_money <= (round(price * '" + _currentTax + "' + '" + _taxMin + "', 0) * '" + _taxDays + "') * '-1' AND user_id > '0' LIMIT 20", function (err, rows, fields) {
        rows.forEach(row => {

            let price = methods.parseInt(row['price']);

            if (methods.parseInt(row["tax_money"]) < -100000)
                price = methods.parseInt(price * 1.3);

            mp.players.forEach(function (p) {
                if (user.isLogin(p) && user.getId(p) == methods.parseInt(row["user_id"])) {
                    user.set(p, 'house_id', 0);
                    user.addBankMoney(p, price);
                    user.sendSmsBankOperation(p, `Зачисление: $${methods.numberFormat(price)}`);
                    p.notify('~r~Ваш дом был изъят государством за неуплату');
                    user.save(p);
                }
            });

            houses.updateOwnerInfo(methods.parseInt(row['id']), 0, '');
            mysql.executeQuery("UPDATE users SET money = money + '" + price + "', house_id = '0' WHERE id = '" + methods.parseInt(row["user_id"]) + "'");

            mysql.executeQuery("UPDATE houses SET tax_money = '0' WHERE id = '" + row['id'] + "'");

            methods.saveLog('log_sell_inactive',
                ['text'],
                [`USER: ${row["user_id"]} HOUSE ${row["id"]}`],
            );
        });

        if (rows.length > 0)
            tax.adLiveInvader(`Дома поступили в продажу`);
    });

    //=============================
    //============Квартира=============
    //=============================
    mysql.executeQuery("SELECT * FROM condos WHERE tax_money <= (round(price * '" + _currentTax + "' + '" + _taxMin + "', 0) * '" + _taxDays + "') * '-1' AND user_id > '0' LIMIT 20", function (err, rows, fields) {
        rows.forEach(row => {

            let price = methods.parseInt(row['price']);

            if (methods.parseInt(row["tax_money"]) < -100000)
                price = methods.parseInt(price * 1.3);

            mp.players.forEach(function (p) {
                if (user.isLogin(p) && user.getId(p) == methods.parseInt(row["user_id"])) {
                    user.set(p, 'condo_id', 0);
                    user.addBankMoney(p, price);
                    user.sendSmsBankOperation(p, `Зачисление: $${methods.numberFormat(price)}`);
                    p.notify('~r~Ваша квартира была изъята государством за неуплату');
                    user.save(p);
                }
            });

            condo.updateOwnerInfo(methods.parseInt(row['id']), 0, '');
            mysql.executeQuery("UPDATE users SET money = money + '" + price + "', condo_id = '0' WHERE id = '" + methods.parseInt(row["user_id"]) + "'");

            mysql.executeQuery("UPDATE condos SET tax_money = '0' WHERE id = '" + row['id'] + "'");

            methods.saveLog('log_sell_inactive',
                ['text'],
                [`USER: ${row["user_id"]} CONDO ${row["id"]}`],
            );
        });

        if (rows.length > 0)
            tax.adLiveInvader(`Квартиры поступили в продажу`);
    });

    //=============================
    //============Яхта=============
    //=============================
    mysql.executeQuery("SELECT * FROM yachts WHERE tax_money <= (round(price * '" + _currentTax + "' + '" + _taxMin + "', 0) * '" + _taxDays + "') * '-1' AND user_id > '0' LIMIT 20", function (err, rows, fields) {
        rows.forEach(row => {

            let price = methods.parseInt(row['price']);

            if (methods.parseInt(row["tax_money"]) < -100000)
                price = methods.parseInt(price * 1.3);

            mp.players.forEach(function (p) {
                if (user.isLogin(p) && user.getId(p) == methods.parseInt(row["user_id"])) {
                    user.set(p, 'yacht_id', 0);
                    user.addBankMoney(p, price);
                    user.sendSmsBankOperation(p, `Зачисление: $${methods.numberFormat(price)}`);
                    p.notify('~r~Ваша квартира была изъята государством за неуплату');
                    user.save(p);
                }
            });

            yachts.updateOwnerInfo(methods.parseInt(row['id']), 0, '');
            mysql.executeQuery("UPDATE users SET money = money + '" + price + "', yacht_id = '0' WHERE id = '" + methods.parseInt(row["user_id"]) + "'");

            mysql.executeQuery("UPDATE yachts SET tax_money = '0' WHERE id = '" + row['id'] + "'");

            methods.saveLog('log_sell_inactive',
                ['text'],
                [`USER: ${row["user_id"]} YACHT ${row["id"]}`],
            );
        });

        if (rows.length > 0)
            tax.adLiveInvader(`Яхта поступила в продажу`);
    });

    //=============================
    //============Бизнес=============
    //=============================
    mysql.executeQuery("SELECT * FROM business WHERE tax_money <= (round(price * '" + _currentTax + "' + '" + _taxMin + "', 0) * '7') * '-1' AND user_id > '0' LIMIT 20", function (err, rows, fields) {
        rows.forEach(row => {

            let price = methods.parseInt(row['price']);

            if (methods.parseInt(row["tax_money"]) < -100000)
                price = methods.parseInt(price * 1.3);

            mp.players.forEach(function (p) {
                if (user.isLogin(p) && user.getId(p) == methods.parseInt(row["user_id"])) {
                    user.set(p, 'business_id', 0);
                    user.addBankMoney(p, price);
                    user.sendSmsBankOperation(p, `Зачисление: $${methods.numberFormat(price)}`);
                    p.notify('~r~Ваш бизнес был изъят государством за неуплату');
                    user.save(p);
                }
            });

            business.updateOwnerInfo(methods.parseInt(row['id']), 0, '');
            mysql.executeQuery("UPDATE users SET money = money + '" + price + "', business_id = '0' WHERE id = '" + methods.parseInt(row["user_id"]) + "'");

            tax.adLiveInvader(`Бизнес ${row["name"]} поступил в продажу`);
            mysql.executeQuery("UPDATE business SET tax_money = '0' WHERE id = '" + row['id'] + "'");

            methods.saveLog('log_sell_inactive',
                ['text'],
                [`USER: ${row["user_id"]} BUSINESS ${row["id"]}`],
            );
        });

        //if (rows.length > 0)
        //    tax.adLiveInvader(`Бизнесы поступили в продажу`);
    });

    //=============================
    //============Апарты=============
    //=============================
    /*mysql.executeQuery("SELECT * FROM apartment WHERE tax_money <= (round(price * '" + _currentTax + "' + '" + _taxMin + "', 0) * '" + _taxDays + "') * '-1' AND user_id > '0' LIMIT 20", function (err, rows, fields) {
        rows.forEach(row => {

            let price = methods.parseInt(row['price']);

            if (methods.parseInt(row["tax_money"]) < -100000)
                price = methods.parseInt(price * 1.3);

            mp.players.forEach(function (p) {
                if (user.isLogin(p) && user.getId(p) == methods.parseInt(row["user_id"])) {
                    user.set(p, 'apartment_id', 0);
                    user.addBankMoney(p, price);
                    user.sendSmsBankOperation(p, `Зачисление: $${methods.numberFormat(price)}`);
                    p.notify('~r~Ваши апартаменты были изъяты государством за неуплату');
                    user.save(p);
                }
            });

            apartments.updateOwnerInfo(methods.parseInt(row['id']), 0, '');
            mysql.executeQuery("UPDATE users SET money = money + '" + price + "', apartment_id = '0' WHERE id = '" + methods.parseInt(row["user_id"]) + "'");

            //methods.saveLog('SellInactive', `"USER: ${row["user_id"]} APART ${row["id"]}"`)
        });

        if (rows.length > 0)
            tax.adLiveInvader(`Апартаменты поступили в продажу`);
    });*/

    //=============================
    //============Авто=============
    //=============================
    mysql.executeQuery("SELECT * FROM cars WHERE tax_money <= (round(price * '" + _currentTax + "' + '" + _taxMin + "', 0) * '" + _taxDays + "') * '-1' AND user_id > '0' AND with_delete = '0' LIMIT 20", function (err, rows, fields) {
        rows.forEach(row => {

            let price = methods.parseInt(row['price']);
            if (methods.parseInt(row["tax_money"]) < -100000)
                price = methods.parseInt(price * 1.3);

            mysql.executeQuery("SELECT * FROM users WHERE car_id1 = '" + row["id"] + "' OR car_id2 = '" + row["id"] + "' OR car_id3 = '" + row["id"] + "' OR car_id4 = '" + row["id"] + "' OR car_id5 = '" + row["id"] + "' OR car_id6 = '" + row["id"] + "' OR car_id7 = '" + row["id"] + "' OR car_id8 = '" + row["id"] + "' OR car_id9 = '" + row["id"] + "' OR car_id10 = '" + row["id"] + "'", function (err, rows1, fields) {
                let carId = "1";
                rows1.forEach(item => {
                    if (item["car_id2"] == row["id"])
                        carId = "2";
                    if (item["car_id3"] == row["id"])
                        carId = "3";
                    if (item["car_id4"] == row["id"])
                        carId = "4";
                    if (item["car_id5"] == row["id"])
                        carId = "5";
                    if (item["car_id6"] == row["id"])
                        carId = "6";
                    if (item["car_id7"] == row["id"])
                        carId = "7";
                    if (item["car_id8"] == row["id"])
                        carId = "8";
                    if (item["car_id9"] == row["id"])
                        carId = "9";
                    if (item["car_id10"] == row["id"])
                        carId = "10";
                });

                mp.players.forEach(function (p) {
                    if (user.isLogin(p) && user.getId(p) == methods.parseInt(row["user_id"])) {
                        user.set(p, 'car_id' + carId, 0);
                        user.addBankMoney(p, price, `Изъятие ${row["name"]} по налогу`);
                        user.sendSmsBankOperation(p, `Зачисление: ${methods.moneyFormat(price)}`);
                        p.notify('~r~Ваш транспорт были изъяты государством за неуплату');
                        user.save(p);
                    }
                });

                mysql.executeQuery("UPDATE users SET money = money + '" + price + "', car_id" + carId + " = '0' WHERE id = '" + methods.parseInt(row["user_id"]) + "'");

                try {
                    vehicles.updateOwnerInfo(methods.parseInt(row['id']), 0, '');
                }
                catch (e) {}

                methods.saveLog('log_sell_inactive',
                    ['text'],
                    [`USER: ${row["user_id"]} VEHICLE ${row["id"]}`],
                );
            });

            if (rows.length > 0)
                tax.adLiveInvader(`Новый транспорт поступили в продажу`);
        });
    });
};

tax.payTax = function(player, type, sum, score) {
    methods.debug('tax.payTax');
    if (!user.isLogin(player))
        return;

    if (sum < 1) {
        player.notify('~r~Сумма должна быть больше нуля');
        return;
    }

    let table = 'cars';

    if (score.toString()[0] == "1")
        table = 'business';
    else if (score.toString()[0] == "3")
        table = 'cars';
    else if (score.toString()[0] == "4")
        table = 'condos';
    else if (score.toString()[0] == "5")
        table = 'houses';
    /*else if (score.toString()[0] == "7")
        table = 'apartment';*/
    else if (score.toString()[0] == "9")
        table = 'stocks';
    else if (score.toString()[0] == "8")
        table = 'yachts';

    mysql.executeQuery("SELECT * FROM " + table + " WHERE tax_score = '" + score + "'", function (err, rows, fields) {
        rows.forEach(row => {
            if (sum > methods.parseInt(row["tax_money"]) * -1) {
                player.notify(`~r~Сумма оплаты не должна превышать суммы долга (#1)\nВаш долг равен: $${row["tax_money"]}`);
                return;
            }

            if (type == 0) {
                if (user.getCashMoney(player) < sum) {
                    player.notify(`~r~У вас недостаточно средств`);
                    return;
                }
            }
            else {
                if (user.getBankMoney(player) < sum) {
                    player.notify(`~r~У вас недостаточно средств`);
                    return;
                }
            }

            if (type == 0)
                user.removeCashMoney(player, sum, 'Оплата налогов');
            else
                user.removeBankMoney(player, sum, 'Оплата налогов');
            user.achiveDoneDailyById(player, 14);

            mysql.executeQuery("UPDATE " + table + " SET tax_money = '" + (methods.parseInt(row["tax_money"]) + sum) + "' WHERE tax_score = '" + score + "'");

            player.notify(`~g~Счёт ${score} был оплачен на сумму $${sum}`);
        });

        if (rows.length == 0)
            player.notify('~r~Номер счёта не найден');
        else
            setTimeout(tax.updateTax, 1000);
    });
};

tax.payTaxAll = function(player, type, sum) {
    methods.debug('tax.payTax');
    if (!user.isLogin(player))
        return;

    if (type == 0) {
        if (user.getCashMoney(player) < sum) {
            player.notify(`~r~У вас недостаточно средств`);
            return;
        }
    }
    else {
        if (user.getBankMoney(player) < sum) {
            player.notify(`~r~У вас недостаточно средств`);
            return;
        }
    }

    if (type == 0)
        user.removeCashMoney(player, sum, 'Оплата налогов');
    else
        user.removeBankMoney(player, sum, 'Оплата налогов');

    user.achiveDoneDailyById(player, 14);

    let uId = user.getId(player);
    mysql.executeQuery("UPDATE houses SET tax_money = 0 WHERE user_id = " + uId);
    mysql.executeQuery("UPDATE condos SET tax_money = 0 WHERE user_id = " + uId);
    mysql.executeQuery("UPDATE yachts SET tax_money = 0 WHERE user_id = " + uId);
    //mysql.executeQuery("UPDATE apartment SET tax_money = 0 WHERE user_id = " + uId);
    mysql.executeQuery("UPDATE business SET tax_money = 0 WHERE user_id = " + uId);
    mysql.executeQuery("UPDATE stocks SET tax_money = 0 WHERE user_id = " + uId);
    mysql.executeQuery("UPDATE cars SET tax_money = 0 WHERE user_id = " + uId);
    setTimeout(tax.updateTax, 1000);
    player.notify(`~g~Вы оплатили все налоги`);
};

tax.removeTax = function() {
    methods.debug('tax.removeTax');

    mysql.executeQuery("UPDATE houses SET tax_money = tax_money - (round((price * '" + _currentTax + "' + '" + _taxMin +  "') / '7', 0)) WHERE user_id > 0");
    mysql.executeQuery("UPDATE condos SET tax_money = tax_money - (round((price * '" + _currentTax + "' + '" + _taxMin +  "') / '7', 0)) WHERE user_id > 0");
    mysql.executeQuery("UPDATE yachts SET tax_money = tax_money - (round((price * '" + _currentTax + "' + '" + _taxMin +  "') / '7', 0)) WHERE user_id > 0");
    //mysql.executeQuery("UPDATE apartment SET tax_money = tax_money - (round((price * '" + _currentTax + "' + '" + _taxMin +  "') / '7', 0)) WHERE user_id > 0");
    mysql.executeQuery("UPDATE business SET tax_money = tax_money - (round((price * '" + _currentTax + "' + '" + _taxMin +  "') / '7', 0)) WHERE user_id > 0");
    mysql.executeQuery("UPDATE stocks SET tax_money = tax_money - (round((price * '" + _currentTax + "' + '" + _taxMin +  "') / '7', 0)) WHERE user_id > 0");
    mysql.executeQuery("UPDATE cars SET tax_money = tax_money - (round((price * '" + _currentTax + "' + '" + _taxMin +  "') / '7', 0)) WHERE user_id > 0 AND tax_sale = 0");

    methods.notifyWithPictureToAll('~y~Оплата налогов', 'Новости правительства', 'Не забудьте оплатить налог за ваше имущество и транспорт в здании правительства', 'CHAR_FLOYD');

    setTimeout(tax.sell, 5000);
    setTimeout(tax.updateTax, 10000);
};

tax.updateTax = function() {
    methods.debug('tax.updateTax');

    mysql.executeQuery(`SELECT * FROM condos WHERE user_id > '0'`, function (err, rows, fields) {
        rows.forEach(item => {
            condo.set(item['id'], 'tax_money', item['tax_money']);
            condo.set(item['id'], 'tax_score', item['tax_score']);
        });
    });

    mysql.executeQuery(`SELECT * FROM yachts WHERE user_id > '0'`, function (err, rows, fields) {
        rows.forEach(item => {
            yachts.set(item['id'], 'tax_money', item['tax_money']);
            yachts.set(item['id'], 'tax_score', item['tax_score']);
        });
    });

    mysql.executeQuery(`SELECT * FROM houses WHERE user_id > '0'`, function (err, rows, fields) {
        rows.forEach(item => {
            houses.set(item['id'], 'tax_money', item['tax_money']);
            houses.set(item['id'], 'tax_score', item['tax_score']);
        });
    });

    mysql.executeQuery(`SELECT * FROM cars WHERE user_id > '0'`, function (err, rows, fields) {
        rows.forEach(item => {
            vehicles.set(item['id'], 'tax_money', item['tax_money']);
            vehicles.set(item['id'], 'tax_score', item['tax_score']);
        });
    });

    mysql.executeQuery(`SELECT * FROM stocks WHERE user_id > '0'`, function (err, rows, fields) {
        rows.forEach(item => {
            stock.set(item['id'], 'tax_money', item['tax_money']);
            stock.set(item['id'], 'tax_score', item['tax_score']);
        });
    });

    /*mysql.executeQuery(`SELECT * FROM apartment WHERE user_id > '0'`, function (err, rows, fields) {
        rows.forEach(item => {
            Container.Data.Set(-100000 + methods.parseInt(item['id']), 'tax_money', item['tax_money']);
            Container.Data.Set(-100000 + methods.parseInt(item['id']), 'tax_score', item['tax_score']);
        });
    });*/

    mysql.executeQuery(`SELECT * FROM business WHERE user_id > '0'`, function (err, rows, fields) {
        rows.forEach(item => {
            business.set(item['id'], 'tax_money', item['tax_money']);
            business.set(item['id'], 'tax_score', item['tax_score']);
        });
    });
};