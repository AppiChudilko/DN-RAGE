"use strict";

let mysql2 = require('mysql');

let methods = require('./methods');
let chat = require('./chat');

let user = require('../user');

let business = require('../property/business');

let mysql = exports;

let host = 'localhost';
let dbuser = 'dNet_python';
let database = 'dNet_python';
let password = 'e0bc60c82713f64ef8a57c0c40d02ce24fd0141d5cc3086259c19b1e62a62bea';
//let password = 'b3282a2f2a28757b3a18ab833de16a9c54518c0b0cf493e3f0a7cf09386f326a';

const pool = mysql2.createPool({
    host: host,
    //socketPath: '/var/run/mysqld/mysqld.sock', //Если хочешь напрямую по сокету подключать, ускоряет немного всю хуйню
    user: dbuser,
    password: password,
    database: database,
    port: 3306,
    waitForConnections: true,
    connectionLimit: 500,
    queueLimit: 0,
    timeout: 600000
});

pool.on('connection', function (connection) {
    connection.query('SET SESSION sql_mode=\'\'');
    console.log('New MySQL connection id: ' + connection.threadId);
});

pool.on('enqueue', function (connection) {
    console.log('Waiting for available connection slot, waiting count: ' + pool._connectionQueue.length);
});

pool.on('release', function (connection) {
    //console.log('Connection %d released', connection.threadId);
});

pool.on('acquire', function (connection) {
    //console.log('Connection %d acquired', connection.threadId);
});

mysql.stressTest = async function() {
    let i = 0;
    while (i < 2) {
        /*mysql.executeQueryOld(`SELECT * FROM log_fraction_gun`, null, function (err, rows, fields) {
            console.log(err)
        });*/
        /*mysql.executeQuery(`SELECT * FROM log_fraction_gun`, null, function (err, rows, fields) {
            console.log(err)
        });*/
        i++;
    }
};

let eventTypes = {
    Other: 0,
    Player: 1,
    Vehicle: 2,
    Business: 3,
    House: 4,
    Apartment: 5,
    Bag: 6,
    Stock: 7,
};

setInterval(function() {
    mysql.executeQueryOld(`UPDATE monitoring SET online = ${mp.players.length}, last_update = ${Math.round(new Date().getTime()/1000)}`);

    mysql.executeQuery(`SELECT * FROM game_event`, null, function (err, rows, fields) {

        rows.forEach(function (item) {

            try {
                let id = methods.parseInt(item["id"]);
                let param = JSON.parse(methods.replaceAll(item["params"].toString(), '&quot;', '"'));
                let type = methods.parseInt(item["type"]);
                let itemId = methods.parseInt(item["item_id"]);
                let action = item["action"];

                if (type === eventTypes.Other) {
                    switch (action) {
                        case "SaveUsers":
                            methods.saveAllUser();
                            break;
                        case "SaveAll":
                            methods.saveAllAnother();
                            break;
                        case "ChatNotify":
                            chat.sendToAll('Администрация', param['text']);
                            break;
                    }
                }
                else if (type === eventTypes.Business) {
                    switch (action) {
                        case "AddMoney":
                            let bId = methods.parseInt(param["bId"]);
                            let money = methods.parseInt(param["money"]);
                            if (bId == 0 || money == 0)
                                break;
                            business.addMoney(bId, money);
                            mysql.executeQuery(`DELETE FROM game_event WHERE id = '${id}'`);
                            break;
                    }
                }
                else if (type === eventTypes.Player) {

                    let player = user.getPlayerById(itemId);

                    switch (action) {
                        case "KickAll":
                        {
                            mysql.executeQuery(`DELETE FROM game_event WHERE id = '${id}'`);
                            mp.players.forEach(function (p) {
                                user.kick(p, 'Рестарт');
                            });
                            break;
                        }
                        case "Kick":
                        {
                            mysql.executeQuery(`DELETE FROM game_event WHERE id = '${id}'`);
                            if (player == null) break;
                            user.kick(player, param["msg"]);
                            break;
                        }
                        case "AnswerReport":
                        {
                            mysql.executeQuery(`DELETE FROM game_event WHERE id = '${id}'`);
                            if (player == null) break;
                            player.outputChatBoxNew(`[${chat.getTime()}] !{#f44336}Ответ от администратора ${param['name']}:!{#FFFFFF} ${param['text']}`);
                            break;
                        }
                        case "AnswerAsk":
                        {
                            mysql.executeQuery(`DELETE FROM game_event WHERE id = '${id}'`);
                            if (player == null) break;
                            player.outputChatBoxNew(`[${chat.getTime()}] !{#FFC107}Ответ от хелпера ${param['name']}:!{#FFFFFF} ${param['text']}`);
                            break;
                        }
                        case "Notify":
                        {
                            mysql.executeQuery(`DELETE FROM game_event WHERE id = '${id}'`);
                            if (player == null) break;
                            player.notify(param['text']);
                            break;
                        }
                        case "AddMoney":
                        {
                            if (player == null) break;
                            let money = methods.parseInt(param["money"]);
                            if (money == 0) {
                                mysql.executeQuery(`DELETE FROM game_event WHERE id = '${id}'`);
                                break;
                            }
                            user.addCashMoney(player, money, param["text"]);
                            player.notify(`~g~Вам поступило на счёт ~s~${methods.moneyFormat(money)}`);
                            mysql.executeQuery(`DELETE FROM game_event WHERE id = '${id}'`);
                            break;
                        }
                        case "RemoveMoney":
                        {
                            if (player == null) break;
                            let money = methods.parseInt(param["money"]);
                            if (money == 0) {
                                mysql.executeQuery(`DELETE FROM game_event WHERE id = '${id}'`);
                                break;
                            }
                            user.removeCashMoney(player, money, param["text"]);
                            player.notify(`~g~Со счета списано ~s~${methods.moneyFormat(money)}`);
                            mysql.executeQuery(`DELETE FROM game_event WHERE id = '${id}'`);
                            break;
                        }
                    }
                }
            }
            catch (e) {
                methods.debug(e);
            }

        });
    });

}, 5000);

mysql.getTime = function() {
    let dateTime = new Date();
    return `${methods.digitFormat(dateTime.getHours())}:${methods.digitFormat(dateTime.getMinutes())}:${methods.digitFormat(dateTime.getSeconds())}`;
};

mysql.isTestServer = function() {
    return host === '54.37.128.202';
};

mysql.isConnected = function () {
    return isConnected;
};

mysql.executeQuery = async function (query, values, callback) {

    try {
        if (query.indexOf('DELETE') === 0 /*|| query.indexOf('UPDATE') === 0*/ || query.indexOf('INSERT') === 0 || query.indexOf('SELECT') === 0) {
            mysql.executeQueryOld(query, values, function (err, rows, fields) {
                try {
                    if (callback)
                        callback(err, rows, fields);
                }
                catch (e) {}
            });
            return;
        }
    }
    catch (e) {}

    //console.log('SQL Query: ' + query);
    const preQuery = new Date().getTime();
    try {
        pool.getConnection(function (err, connection) {
            try {
                if(!err) {
                    connection.query({
                        sql: query,
                        timeout: 60000
                    }, values, function (err, rows, fields) {

                        try {
                            const postQuery = new Date().getTime();
                            methods.debug(query, `Async time: ${postQuery - preQuery}ms`);
                        }
                        catch (e) {}

                        try {
                            if (!err) {
                                if (callback)
                                    callback(null, rows, fields);
                            } else {
                                console.log("[DATABASE ASYNC | ERROR | " + mysql.getTime() + "]", query, err);
                                if (callback)
                                    callback(err);
                            }
                        }
                        catch (e) {}
                    });
                } else { console.log(err)}
                connection.release();
            }
            catch (e) {
                console.log(e);
            }
        });
    } catch (e) {
        /*setTimeout(function () {
            mysql.executeQuery(query, values, callback);
        }, 2000);*/
        console.log('DBERROR', e);
    }
};

mysql.executeQueryOld = function(query, values, callback) {
    try {
        const start = new Date().getTime();
        pool.query(query, values, function(err, rows, fields) {
            try {
                if (!err) {
                    if (callback)
                        callback(null, rows, fields);
                } else {
                    console.log("[DATABASE | ERROR | " + mysql.getTime() + "]", query, err);
                    if (callback)
                        callback(err);
                }
                const end = new Date().getTime();
                methods.debug(`${query}`, `Time: ${end - start}ms`);
            }
            catch (e) {
                methods.debug('ERROR SQL DONE', e);
            }
        });
    }
    catch (e) {
        methods.debug('ERROR SQL', e);
    }
};

/*setInterval(function () {
    mysql.executeQuery('SELECT * FROM accounts', function (err, rows, fields) {
        rows.forEach(function (item) {
            console.log(item.username);
        })
    });
}, 1000);
*/
