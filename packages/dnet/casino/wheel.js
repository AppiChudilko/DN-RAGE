let user = require('../user');
let enums = require('../enums');
let methods = require('../modules/methods');

let wheel = exports;

wheel.isBlock = false;

wheel.start = function (player) {
    if (user.isLogin(player)) {
        if (wheel.isBlock) {
            player.notify('~r~Таймаут 30 секунд, подождите');
            return;
        }
        if (user.get(player, 'online_wheel') < 21) {
            player.notify(`~r~Вы еще не отыграли 3 часа на сервере\nВам осталось: ${((21 - user.get(player, 'online_wheel')) * 8.5).toFixed(1)} мин.`);
            return;
        }
        if (user.get(player, 'online_wheel') > 999) {
            player.notify(`~r~Вы уже крутили колесо сегодня.`);
            return;
        }
        wheel.isBlock = true;

        try {
            player.call('client:casino:wheel:start');
        }
        catch (e) { }

        setTimeout(function () {
            wheel.isBlock = false;
        }, 30000)
    }
};

mp.events.add('server:casino:wheel:doRoll', (player) => {
    if (!user.isLogin(player))
        return;
    try {
        let userWin = 1;

        if (methods.getRandomInt(0, 1000) < 1) //x2
            userWin = 19;
        else if (methods.getRandomInt(0, 250) < 1) //x2
            userWin = 0;
        else if (methods.getRandomInt(0, 100) < 1) //x2
            userWin = 15;
        else if (methods.getRandomInt(0, 50) < 1) //x2
            userWin = 7;
        else if (methods.getRandomInt(0, 25) < 1) //x2
            userWin = 5;
        else if (methods.getRandomInt(0, 25) < 1) //x2
            userWin = 9;
        else if (methods.getRandomInt(0, 3) < 1)
            userWin = 4;
        else if (methods.getRandomInt(0, 2) < 1)
            userWin = 3;

        user.set(player, 'wheelWin', userWin);
        mp.players.callInRange(player.position, 100, 'client:casino:wheel:doRoll', [userWin, player.id]);
    }
    catch (e) {
        
    }
    //player.call('client:casino:wheel:doRoll', [userWin]);
});

mp.events.add('server:casino:wheel:block', (player) => {
    wheel.isBlock = true;
});

mp.events.add('server:casino:wheel:unblock', (player) => {
    wheel.isBlock = false;
});

mp.events.add('server:casino:wheel:finalRoll', (player) => {
    if (!user.isLogin(player) || !user.has(player, 'wheelWin'))
        return;

    try {

        if (user.get(player, 'online_wheel') > 999) {
            player.notify(`~r~Вы уже крутили колесо сегодня.`);
            return;
        }

        user.set(player, 'online_wheel', 1000);
        let win = user.get(player, 'wheelWin');

        if (win === 19) {
            user.giveVehicle(player, enums.vehLuckyList[methods.getRandomInt(0, enums.vehLuckyList.length)], 1, true, ' в колесе удачи');
        }
        /*else if (win === 1) {
            user.addCashMoney(player, 2500, 'Колесо удачи');
            player.notifyWithPicture('Diamond Casino', '~g~Колесо Удачи', `Вы выиграли ~g~$2,500`, 'CHAR_CASINO');
        }*/
        else if (win === 3) {
            user.addCashMoney(player, 20000, 'Колесо удачи');
            player.notifyWithPicture('Diamond Casino', '~g~Колесо Удачи', `Вы выиграли ~g~$20,000`, 'CHAR_CASINO');
        }
        else if (win === 4) {
            user.addCashMoney(player, 25000, 'Колесо удачи');
            player.notifyWithPicture('Diamond Casino', '~g~Колесо Удачи', `Вы выиграли ~g~$25,000`, 'CHAR_CASINO');
        }
        else if (win === 7) {
            user.addCashMoney(player, 30000, 'Колесо удачи');
            player.notifyWithPicture('Diamond Casino', '~g~Колесо Удачи', `Вы выиграли ~g~$30,000`, 'CHAR_CASINO');
        }
        else if (win === 15) {
            user.addCashMoney(player, 40000, 'Колесо удачи');
            player.notifyWithPicture('Diamond Casino', '~g~Колесо Удачи', `Вы выиграли ~g~$40,000`, 'CHAR_CASINO');
        }
        else if (win === 0) {
            user.addCashMoney(player, 50000, 'Колесо удачи');
            player.notifyWithPicture('Diamond Casino', '~g~Колесо Удачи', `Вы выиграли ~g~$50,000`, 'CHAR_CASINO');
        }
        else if (win === 5) {
            user.giveVip(player, methods.getRandomInt(1, 5), 2, true, ' с колеса удачи');
            player.notifyWithPicture('Diamond Casino', '~g~Колесо Удачи', `Вы выиграли VIP HARD`, 'CHAR_CASINO');
        }
        else if (win === 9) {
            user.giveRandomMask(player, 0, true, ' в колесе удачи');
            player.notifyWithPicture('Diamond Casino', '~g~Колесо Удачи', `Вы выиграли маску`, 'CHAR_CASINO');
        }
        else if (win === 11) {
            user.addCashMoney(player, 20000, 'Колесо удачи');
            player.notifyWithPicture('Diamond Casino', '~g~Колесо Удачи', `Вы выиграли ~g~$20,000`, 'CHAR_CASINO');
        }
        else {
            user.addCashMoney(player, 2500, 'Колесо удачи');
            player.notifyWithPicture('Diamond Casino', '~g~Колесо Удачи', `Вы выиграли ~g~$2,500`, 'CHAR_CASINO');
        }

        /*if (win < 1) {
            if (methods.getRandomInt(0, 500) < 1) {
                user.giveVehicle(player, 'elegy');
                player.notifyWithPicture('Diamond Casino', '~g~Колесо Удачи', `Вы выиграли транспорт`, 'CHAR_CASINO');
            }
            else {
                user.addCashMoney(player, 30000, 'Колесо удачи');
                player.notifyWithPicture('Diamond Casino', '~g~Колесо Удачи', `Вы выиграли ~g~$40,000`, 'CHAR_CASINO');
            }
        }
        else if (win < 3) {

            if (methods.getRandomInt(0, 100) < 30) {
                user.giveRandomMask(player, 50, false);
                player.notifyWithPicture('Diamond Casino', '~g~Колесо Удачи', `Вы выиграли маску`, 'CHAR_CASINO');
            }
            else if (methods.getRandomInt(0, 100) < 5) {
                user.giveVip(player, methods.getRandomInt(3, 7), 2);
                player.notifyWithPicture('Diamond Casino', '~g~Колесо Удачи', `Вы выиграли VIP HARD`, 'CHAR_CASINO');
            }
            else {
                user.addCashMoney(player, 15000, 'Колесо удачи');
                player.notifyWithPicture('Diamond Casino', '~g~Колесо Удачи', `Вы выиграли ~g~$20,000`, 'CHAR_CASINO');
            }
        }
        else if (win < 10) {
            user.addCashMoney(player, 5000, 'Колесо удачи');
            player.notifyWithPicture('Diamond Casino', '~g~Колесо Удачи', `Вы выиграли ~g~$5,000`, 'CHAR_CASINO');
        }
        else {
            user.addCashMoney(player, 2000, 'Колесо удачи');
            player.notifyWithPicture('Diamond Casino', '~g~Колесо Удачи', `Вы выиграли ~g~$2,000`, 'CHAR_CASINO');
        }*/

        user.achiveDoneDailyById(player, 10);
    }
    catch (e) {
        methods.debug(e);
    }
});