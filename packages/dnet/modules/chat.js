let user = require('../user');
let enums = require('../enums');

let methods = require('./methods');

let fraction = require('../property/fraction');

let gangWar = require('../managers/gangWar');
let mafiaWar = require('../managers/mafiaWar');
let canabisWar = require('../managers/canabisWar');
let racer = require('../managers/racer');
let graffiti = require('../managers/graffiti');

let chat = exports;

let range = 15;

chat.clRed = '#f44336';
chat.clBlue = '#03A9F4';
chat.clGreen = '#8BC34A';
chat.clOrange = '#FFC107';
chat.clWhite = '#FFFFFF';
chat.clBlack = '#000000';

chat.sendBCommand = function(player, text) {
    if (user.isLogin(player)) {

        mp.players.forEach(p => {
            if (user.isLogin(p) && p.dimension === player.dimension && methods.distanceToPos(player.position, p.position) <= range)
                p.outputChatBoxNew(`[${chat.getTime()}] !{2196F3} Игрок (${user.getSvId(player)}): !{FFFFFF}(( ${text} ))`);
        });

        methods.saveLog('log_chat', ['text'], [`/b ${user.getRpName(player)} (${user.getId(player)}): ${methods.removeQuotes(methods.removeQuotes2(text))}`]);
    }
};

chat.sendTryCommand = function(player, text) {
    if (user.isLogin(player)) {

        let label = methods.getRandomInt(0, 2) === 0 ? `!{${chat.clRed}}Не удачно` : `!{${chat.clGreen}}Удачно`;

        mp.players.forEach(p => {
            if (user.isLogin(p) && p.dimension === player.dimension && methods.distanceToPos(player.position, p.position) <= range)
                p.outputChatBoxNew(`[${chat.getTime()}] ${label} !{C2A2DA}${user.getSvId(player)} ${text}`);
        });

        methods.saveLog('log_chat', ['text'], [`/try ${user.getRpName(player)} (${user.getId(player)}): ${label} ${methods.removeQuotes(methods.removeQuotes2(text))}`]);
    }
};

chat.sendDoCommand = function(player, text) {
    if (user.isLogin(player)) {

        mp.players.forEach(p => {
            if (user.isLogin(p) && p.dimension === player.dimension && methods.distanceToPos(player.position, p.position) <= range)
                p.outputChatBoxNew(`[${chat.getTime()}] !{C2A2DA} ${text} (( Незнакомец (${user.getSvId(player)}) ))`);
        });
        methods.saveLog('log_chat', ['text'], [`/do ${user.getRpName(player)} (${user.getId(player)}): ${methods.removeQuotes(methods.removeQuotes2(text))}`]);
    }
};

chat.sendMeCommand = function(player, text) {
    if (user.isLogin(player)) {

        mp.players.forEach(p => {
            if (user.isLogin(p) && p.dimension === player.dimension && methods.distanceToPos(player.position, p.position) <= range)
                p.outputChatBoxNew(`[${chat.getTime()}] !{C2A2DA}* Незнакомец (${user.getSvId(player)}) ${text}`);
        });

        methods.saveLog('log_chat', ['text'], [`/me ${user.getRpName(player)} (${user.getId(player)}): ${methods.removeQuotes(methods.removeQuotes2(text))}`]);
    }
};

chat.sendDiceCommand = function(player) {
    if (user.isLogin(player)) {
        let dice = methods.getRandomInt(1, 7);
        chat.sendDiceCommandNumber(player, dice);
    }
};

chat.sendDiceCommandNumber = function(player, dice = 1) {
    if (user.isLogin(player)) {
        mp.players.forEach(p => {
            if (user.isLogin(p) && p.dimension === player.dimension && methods.distanceToPos(player.position, p.position) <= range)
                p.outputChatBoxNew(`[${chat.getTime()}] !{FF9800}[Игра в кости] !{C2A2DA}${user.getSvId(player)} бросил кости !{FF9800}(( Выпало ${dice} ))`);
        });

        user.achiveDoneDailyById(player, 11);

        methods.saveLog('log_chat', ['text'], [`/dice ${user.getRpName(player)} (${user.getId(player)}): Выпало ${dice}`]);
    }
};

chat.send = function(player, text) {
    if (user.isLogin(player)) {

        mp.players.forEach(p => {
            if (user.isLogin(p) && p.dimension === player.dimension && methods.distanceToPos(player.position, p.position) <= range)
                p.outputChatBoxNew(`[${chat.getTime()}] !{2196F3}Игрок (${user.getSvId(player)}) говорит:!{FFFFFF} ${text}`);
        });
        methods.saveLog('log_chat', ['text'], [`${user.getRpName(player)} (${user.getId(player)}): ${methods.removeQuotes(methods.removeQuotes2(text))}`]);
    }
};

chat.sendToPlayer = function(player, text) {
    if (user.isLogin(player)) {
        player.outputChatBoxNew(`[${chat.getTime()}] ${text}`);
    }
};

chat.sendPos = function(pos, range, sender, text, color = '2196F3') {

    mp.players.forEach(p => {
        if (user.isLogin(p) && methods.distanceToPos(pos, p.position) <= range)
            p.outputChatBoxNew(`[${chat.getTime()}] !{${color}} ${sender}:!{FFFFFF} ${text}`);
    });

    //mp.players.broadcastInRange(pos, range, `[${chat.getTime()}] !{${color}} ${sender}:!{FFFFFF} ${text}`);
};

chat.sendToAll = function(sender, text, color = '2196F3') {

    mp.players.forEach(p => {
        if (user.isLogin(p))
            p.outputChatBoxNew(`[${chat.getTime()}] !{${color}} ${sender}:!{FFFFFF} ${text}`);
    });

    methods.saveLog('log_chat', ['text'], [`ALL: ${methods.removeQuotes(methods.removeQuotes2(text))}`]);
    //mp.players.broadcast(`[${chat.getTime()}] !{${color}} ${sender}:!{FFFFFF} ${text}`);
};

chat.sendToAdmin = function(sender, text, color = '#f44336') {

    mp.players.forEach(p => {
        if (user.isLogin(p) && user.isAdmin(p))
            p.outputChatBoxNew(`[${chat.getTime()}] !{${color}} ${sender}:!{FFFFFF} ${text}`);
    });

    methods.saveLog('log_chat', ['text'], [`A: ${methods.removeQuotes(methods.removeQuotes2(text))}`]);
    //mp.players.broadcast(`[${chat.getTime()}] !{${color}} ${sender}:!{FFFFFF} ${text}`);
};

chat.sendToHelper = function(sender, text, color = '#8BC34A') {

    mp.players.forEach(p => {
        if (user.isLogin(p) && user.isHelper(p))
            p.outputChatBoxNew(`[${chat.getTime()}] !{${color}} ${sender}:!{FFFFFF} ${text}`);
    });

    methods.saveLog('log_chat', ['text'], [`H: ${methods.removeQuotes(methods.removeQuotes2(text))}`]);
    //mp.players.broadcast(`[${chat.getTime()}] !{${color}} ${sender}:!{FFFFFF} ${text}`);
};

chat.sendToDep = function(sender, text, color = '#D81B60') {

    mp.players.forEach(p => {
        if (user.isLogin(p) && (user.isGos(p) || user.isNews(p)))
            p.outputChatBoxNew(`[${chat.getTime()}] !{${color}} ${sender}:!{FFFFFF} ${text}`);
    });

    methods.saveLog('log_chat', ['text'], [`DEP: ${methods.removeQuotes(methods.removeQuotes2(text))}`]);
    //mp.players.broadcast(`[${chat.getTime()}] !{${color}} ${sender}:!{FFFFFF} ${text}`);
};

chat.sendToFraction = function(player, sender, text, color = '#1E88E5') {

    mp.players.forEach(p => {
        if (user.isLogin(p)) {
            if (user.get(player, 'fraction_id') > 0 && user.get(player, 'fraction_id') == user.get(p, 'fraction_id'))
                p.outputChatBoxNew(`[${chat.getTime()}] !{${color}} ${sender}:!{FFFFFF} ${text}`);
            else if (user.get(player, 'fraction_id2') > 0 && user.get(player, 'fraction_id2') == user.get(p, 'fraction_id2'))
                p.outputChatBoxNew(`[${chat.getTime()}] !{${color}} ${sender}:!{FFFFFF} ${text}`);
        }
    });

    methods.saveLog('log_chat', ['text'], [`FRACTION (${user.get(player, 'fraction_id')} | ${user.get(player, 'fraction_id2')}): ${methods.removeQuotes(methods.removeQuotes2(text))}`]);
    //mp.players.broadcast(`[${chat.getTime()}] !{${color}} ${sender}:!{FFFFFF} ${text}`);
};

chat.sendToFamily = function(player, sender, text, color = '#009688') {

    mp.players.forEach(p => {
        if (user.isLogin(p) && user.get(player, 'family_id') === user.get(p, 'family_id'))
            p.outputChatBoxNew(`[${chat.getTime()}] !{${color}} ${sender}:!{FFFFFF} ${text}`);
    });

    methods.saveLog('log_chat', ['text'], [`FAM (${user.get(player, 'family_id')}): ${methods.removeQuotes(methods.removeQuotes2(text))}`]);
    //mp.players.broadcast(`[${chat.getTime()}] !{${color}} ${sender}:!{FFFFFF} ${text}`);
};

chat.getTime = function() {
    let dateTime = new Date();
    return `${methods.digitFormat(dateTime.getHours())}:${methods.digitFormat(dateTime.getMinutes())}:${methods.digitFormat(dateTime.getSeconds())}`;
};

mp.events.add("server:chat:sendBCommand", function (player, text) {
    chat.sendBCommand(player, text);
});

mp.events.add("server:chat:sendTryCommand", function (player, text) {
    chat.sendTryCommand(player, text);
});

mp.events.add("server:chat:sendDoCommand", function (player, text) {
    chat.sendDoCommand(player, text);
});

mp.events.add("server:chat:sendMeCommand", function (player, text) {
    chat.sendMeCommand(player, text);
});

mp.events.add("server:chat:sendDiceCommand", function (player) {
    chat.sendDiceCommand(player);
});

mp.events.add("server:chat:send", function (player, text) {
    chat.send(player, text);
});

mp.events.add("server:chat:sendToAll", function (player, sender, text, color) {
    chat.sendToAll(sender, text, color);
});

mp.events.add("server:chat:sendToDep", function (player, sender, text, color) {
    chat.sendToDep(sender, text, color);
});

mp.events.add("server:chat:sendToFraction", function (player, sender, text, color) {
    chat.sendToFraction(player, sender, text, color);
});

mp.events.add("server:chat:sendToFamily", function (player, sender, text, color) {
    chat.sendToFamily(player, sender, text, color);
});

mp.events.add("playerChat", function (player, text) {
    chat.send(player, text);
});

let gate = null;
mp.events.add('playerCommand', (player, command) => {

    try {
        if (command.toLowerCase().slice(0, 3) === "me ") {
            chat.sendMeCommand(player, command.substring(3));
        }
        else if (command.toLowerCase().slice(0, 3) === "do ") {
            chat.sendDoCommand(player, command.substring(3));
        }
        else if (command.toLowerCase().slice(0, 4) === "try ") {
            chat.sendTryCommand(player, command.substring(4));
        }
        else if (command.toLowerCase().slice(0, 2) === "b ") {
            chat.sendBCommand(player, command.substring(2));
        }
        else if (command.toLowerCase().slice(0, 2) === "f ") {
            if (user.get(player, 'family_id') > 0)
                chat.sendToFamily(player, `${user.getRpName(player)} (${player.id})`, command.substring(2));
            else if(user.get(player, 'fraction_id') > 0 || user.get(player, 'fraction_id2') > 0)
                player.notify('~r~Необходимо состоять в семье, используйте /r чтобы писать во фракционный чат');
            else
                player.notify('~r~Необходимо состоять в семье');
        }
        else if (command.toLowerCase().slice(0, 2) === "r ") {
            if (user.get(player, 'fraction_id') > 0)
                chat.sendToFraction(player, `[${user.getRankName(player)}] ${user.getRpName(player)} (${player.id})`, command.substring(2));
            else if (user.get(player, 'fraction_id2') > 0)
                chat.sendToFraction(player, `${user.getRpName(player)} (${player.id})`, command.substring(2));
            else
                player.notify('~r~Необходимо состоять в организации')
        }
        else if (command.toLowerCase().slice(0, 2) === "d ") {
            if (user.isGos(player) || user.isNews(player))
                chat.sendToDep(`[${user.getFractionName(player)} | ${user.getRankName(player)}] ${user.getRpName(player)} (${player.id})`, command.substring(2));
            else
                player.notify('~r~Необходимо состоять в гос. организации')
        }
        else if (command.toLowerCase().slice(0, 2) === "a ") {
            if (user.isAdmin(player))
                chat.sendToAdmin(`[Admin LVL: ${user.get(player, 'admin_level')}] ${user.getRpName(player)} (${player.id})`, command.substring(2), '#4CAF50');
        }
        else if (command.toLowerCase().slice(0, 2) === "h ") {
            if (user.isHelper(player))
                chat.sendToHelper(`[Helper LVL: ${user.get(player, 'helper_level')}] ${user.getRpName(player)} (${player.id})`, command.substring(2));
        }
        /*else if (command.toLowerCase().slice(0, 2) === "z ") {
            console.log(gangWar.isInZone(player, methods.parseInt(command.substring(2))));
        }*/
        else if (command.toLowerCase() === "ping" || command.toLowerCase() === "netstat") {
            player.notify("~g~Ping: " + player.ping + "ms\n~g~PacketLoss: " + player.packetLoss + "ms");
        }
        else if (command.toLowerCase() === "crimewar" || command.toLowerCase().slice(0, 9) === "crimewar ") {
            if (!user.isAdmin(player))
                return;
            fraction.createCargoWar(methods.parseInt(command.substring(9)));
        }
        else if (command.toLowerCase() === "graffwar") {
            if (!user.isAdmin(player))
                return;
            graffiti.createWar();
        }
        else if (command.toLowerCase() === "capture") {
            try {
                if (user.isGang(player))
                    player.call('client:menuList:showGangZoneAttackMenu', [gangWar.getNearZoneId(player.position)]);
                if (user.isMafia(player))
                    player.call('client:menuList:showMafiaZoneAttackMenu', [canabisWar.getNearZoneId(player.position)]);
            }
            catch (e) {}
        }
        else if (command.toLowerCase() === "crimemwar") {
            if (!user.isAdmin(player))
                return;
            fraction.createCargoMafiaWar();
        }
        else if (command.toLowerCase() === "crimebwar") {
            if (!user.isAdmin(player))
                return;
            fraction.createCargoBigWar();
        }
        else if (command.toLowerCase() === "crimeawar") {
            if (!user.isAdmin(player))
                return;
            fraction.createCargoArmyWar();
        }
        else if (command.toLowerCase() === "bwar") {
            if (!user.isAdmin(player))
                return;
            mafiaWar.startWar(1);
            mafiaWar.startWar(2);
            mafiaWar.startWar(3);
        }
        else if (command.toLowerCase() === "randmask") {
            if (!user.isAdmin(player, 5))
                return;
            let winner = methods.getRandomPlayer();
            if (user.isLogin(winner)) {
                user.giveRandomMask(winner, 0, true);
            }
        }
        else if (command.toLowerCase() === "randvip") {
            if (!user.isAdmin(player, 5))
                return;
            let winner = methods.getRandomPlayer();
            if (user.isLogin(winner)) {
                user.giveVip(winner, methods.getRandomInt(1, 8), 2, true);
            }
        }
        else if (command.toLowerCase() === "randveh") {
            if (!user.isAdmin(player, 5))
                return;
            let winner = methods.getRandomPlayer();
            if (user.isLogin(winner)) {
                user.giveVehicle(winner, enums.vehWinList[methods.getRandomInt(0, enums.vehWinList.length)], 1, true);
            }
        }
        else if (command.slice(0, 7) === "racerc ") {
            if (!user.isAdmin(player))
                return;

            let args = command.toLowerCase().split(' ');
            racer.createRace(methods.parseInt(args[1]), args[2]);
        }
        else if (command.toLowerCase() === "racers") {
            if (!user.isAdmin(player))
                return;
            racer.startRace();
        }
        else if (command.toLowerCase() === "racern") {
            if (!user.isAdmin(player))
                return;
            racer.notifyRace();
        }
        else if (command.slice(0, 6) === "seval ") {
            if (!user.isLogin(player))
                return;
            if (!user.isAdmin(player))
                return;
            let evalCmd = command.substring(6);
            player.outputChatBoxNew(`SEval ${evalCmd}`);
            let result;
            try {
                result = eval(evalCmd);
                player.outputChatBoxNew(`SResult ${result}`);
            } catch (e) {
                result = e;
                player.outputChatBoxNew(`SResult ${result}`);
            }
        }
        else if (command.slice(0, 6) === "report ") {}
        else if (command.slice(0, 6) === "help ") {}
        else if (command.toLowerCase() === "help") {
            player.outputChatBoxNew(`!{FFC107}Список доступных команд`);
            player.outputChatBoxNew(`!{FFC107}Чаты:!{FFFFFF} /d - Департамент, /r - Фракционный, /f - Семейный`);
            player.outputChatBoxNew(`!{FFC107}РП процесс:!{FFFFFF} /me - Действия от 1 лица, /do - Действие от 3 лица, /try - Рандомайзер, /b ООС чат`);
            player.outputChatBoxNew(`!{FFC107}Разное:!{FFFFFF} /help [текст] - Вопрос у хелперов, /report [текст] - жалоба, /ping - Узнать свой пинг`);
        }
        else {
           // player.outputChatBoxNew(`!{FFC107}На сервере нет команд, кроме: /me, /do, /try, /b, /f, /r, /d, /report, /help. Используйте меню на кнопку M`);
        }
    }
    catch (e) {
        methods.debug(e);
    }
});