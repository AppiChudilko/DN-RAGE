"use strict";

let user = require('../user');
let enums = require('../enums');
let coffer = require('../coffer');
let inventory = require('../inventory');
let phone = require('../phone');
let weapons = require('../weapons');
let items = require('../items');
let admin = require('../admin');

let Container = require('./data');
let methods = require('./methods');
let mysql = require('./mysql');
let chat = require('./chat');
let ctos = require('./ctos');

let houses = require('../property/houses');
let stocks = require('../property/stocks');
let condos = require('../property/condos');
let business = require('../property/business');
let vehicles = require('../property/vehicles');
let fraction = require('../property/fraction');
let yachts = require('../property/yachts');
let family = require('../property/family');

let cloth = require('../business/cloth');
let tattoo = require('../business/tattoo');
let lsc = require('../business/lsc');
let gun = require('../business/gun');
let vShop = require('../business/vShop');
let rent = require('../business/rent');
let bank = require('../business/bank');
let shop = require('../business/shop');
let fuel = require('../business/fuel');
let bar = require('../business/bar');
let barberShop = require('../business/barberShop');
let carWash = require('../business/carWash');
let tradeMarket = require('../business/tradeMarket');

let pickups = require('../managers/pickups');
let dispatcher = require('../managers/dispatcher');
let weather = require('../managers/weather');
let gangWar = require('../managers/gangWar');
let canabisWar = require('../managers/canabisWar');
let ems = require('../managers/ems');
let tax = require('../managers/tax');
let discord = require('../managers/discord');
let racer = require('../managers/racer');
let gangZone = require('../managers/gangZone');
let copsRacer = require('../managers/copsRacer');
let trucker = require('../managers/trucker');
let vSync = require('../managers/vSync');
let fishing = require('../managers/fishing');

mp.events.__add__ = mp.events.add;

mp.events.add = (eventName, eventCallback) => {
    const proxy = new Proxy(eventCallback, {
        apply: (target, thisArg, argumentsList) => {
            const entity = argumentsList[0];
            const entityType = entity ? entity.type : null;
            const entityName = entityType !== null ? entityType === 'player' ? entity.socialClub : `${entity.type}(${entity.id})` : null;

            const callText = entityName !== null ? `${entityName} call event ${eventName}` : `Event ${eventName} called`;

            //if (eventName != 'server:clientDebug')
            //    methods.debug(callText, argumentsList.slice(1));

            target.apply(thisArg, argumentsList);
            return;
        }
    });

    mp.events.__add__(eventName, proxy);
};

mp.events.addRemoteCounted = (eventName, handler) =>
{
    mp.events.add(eventName, function()
    {
        let plr = arguments[0];

        if(++plr.countedTriggers > 80)
        {
            let dateNow = Date.now();

            if((dateNow - plr.countedTriggersSwap) < 500)
            {
                //methods.saveLog('BugWithFlood', `${plr.socialClub} | ${user.getRpName(plr)} | ${eventName}`);
                //plr.ban();
                //user.kick(plr, 'Подозрение в не хороших вещах');
                //user.kickAntiCheat(plr, 'Buguse');
                return;
            }
            else
            {
                plr.countedTriggers = 0;
                plr.countedTriggersSwap = dateNow;
            }
        }
        else if(plr.countedTriggers > 20)
        {
            let dateNow = Date.now();

            if((dateNow - plr.countedTriggersSwap) < 1000)
            {
                //methods.saveLog('BugWithFloodSlow', `${plr.socialClub} | ${user.getRpName(plr)} | ${eventName}`);
                return;
            }
            else
            {
                plr.countedTriggers = 0;
                plr.countedTriggersSwap = dateNow;
            }
        }

        handler.apply(null, arguments);
    });
};

mp.events.add("addVoiceListener", (player, target) =>
{
    if(target)
    {
        player.enableVoiceTo(target);
    }
});

mp.events.add("removeVoiceListener", (player, target) =>
{
    if(target)
    {
        player.disableVoiceTo(target);
    }
});

mp.events.add("voice.toggleMicrophone", (player, enable) =>
{
    if (user.isLogin(player)) {
        player.setVariable('voiceMic', enable);
        //mp.players.callInRange(player.position,200, 'voice.toggleMicrophone', [player.id, enable]);
        mp.players.call('voice.toggleMicrophone', [player.id, enable]);
    }
});

mp.events.add("voice.toggleMicrophoneRadio", (player, enable) =>
{
    if (user.isLogin(player)) {

        mp.players.forEach(p => {
            try {
                if (user.isLogin(p) && methods.parseInt(p.getVariable('walkie')) > 0 && player.getVariable('walkie') === p.getVariable('walkie'))
                    p.call('voice.toggleMicrophoneRadio', [player.id, enable])
            }
            catch (e) {
                
            }
        });
    }
});

mp.events.add('modules:server:data:Set', (player, id, key, value, isInt) => {
    Container.Data.SetClient(id, key, value, isInt);
});

mp.events.add('modules:server:data:SetGroup', (player, data) => {
    Container.Data.SetGroupClient(data);
});

mp.events.addRemoteCounted('modules:server:data:Reset', (player, id, key) => {
    Container.Data.Reset(id, key);
});

mp.events.addRemoteCounted('modules:server:data:ResetAll', (player, id) => {
    Container.Data.ResetAll(id);
});

mp.events.addRemoteCounted('modules:server:data:Get', (player, promiseId, id, key) => {
    try {
        Container.Data.GetClient(player, promiseId, id, key);
    }
    catch (e) {
        methods.debug('modules:server:data:Get');
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('modules:server:data:GetAll', (player, promiseId, id) => {
    try {
        Container.Data.GetAllClient(player, promiseId, id);
    }
    catch (e) {
        methods.debug('modules:server:data:GetAll');
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('modules:server:data:Has', (player, promiseId, id, key) => {
    try {
        Container.Data.HasClient(player, promiseId, id, key);
    }
    catch (e) {
        methods.debug('modules:server:data:Has');
        methods.debug(e);
    }
});


mp.events.add('server:clientDebug', (player, message) => {
    try {
        console.log(`[DEBUG-CLIENT][${player.socialClub}]: ${message}`);
        //methods.saveFile('log', `[DEBUG-CLIENT][${player.socialClub}]: ${message}`);
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:user:respawn', (player, x, y, z) => {
    if (!user.isLogin(player))
        return;
    user.setHealth(player, 100);
    player.spawn(new mp.Vector3(x, y, z));
    setTimeout(function () {
        user.stopAnimation(player);
    }, 500);
});

mp.events.addRemoteCounted('server:user:createAccount', (player, login, password, email) => {
    try {
        user.createAccount(player, login, password, email);
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:user:createUser', (player, name, surname, age, promocode, referer, national) => {
    try {
        user.createUser(player, name, surname, age, promocode, referer, national);
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:user:loginAccount', (player, login, password) => {
    try {
        user.loginAccount(player, login, password);
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:user:loginUser', (player, login, spawnName) => {
    try {
        user.loginUser(player, login, spawnName);
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:race:finish', (player) => {
    try {
        racer.finish(player);
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:race:exit', (player) => {
    try {
        racer.exit(player);
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:race:toLobby', (player) => {
    try {
        racer.enterLobby(player);
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:gangZone:toLobby', (player) => {
    try {
        gangZone.playerToLobby(player);
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:gangZone:exitLobby', (player) => {
    try {
        gangZone.playerExitLobby(player);
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:copsRacer:toLobby', (player) => {
    try {
        copsRacer.playerToLobby(player);
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:copsRacer:exitLobby', (player) => {
    try {
        copsRacer.playerExitLobby(player);
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:duel:toLobby', (player, targetId, bet, death) => {
    try {
        if (!user.isLogin(player))
            return;
        let target = mp.players.at(targetId);
        if (mp.players.exists(target)) {
            if (methods.distanceToPos(target.position, player.position) > 3) {
                player.notify('~r~Вы слишком далеко');
                return;
            }
            if (bet > 25000) {
                player.notify('~r~Ставка не должна быть более $25000');
                return;
            }
            if (bet + 250 > user.getCashMoney(player)) {
                player.notify('~r~У вас нет такой суммы');
                return;
            }
            if (bet > user.getCashMoney(target)) {
                player.notify('~r~У игрока нет такой суммы');
                return;
            }
            if (user.get(player, 'rating_duel_mmr') > user.get(target, 'rating_duel_mmr') + 900 || user.get(target, 'rating_duel_mmr') > user.get(player, 'rating_duel_mmr') + 900) {
                player.notify('~r~Ваш рейтинг слишком сильно отличается');
                return;
            }
            target.call('client:duel:askLobby', [player.id, bet, death, user.getRpName(player), user.get(player, 'rating_duel_mmr'), user.get(player, 'rating_duel_count'), user.get(player, 'rating_duel_win')])
        }
        else
            player.notify('~r~Рядом с вами никого нет');
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:duel:accept', (player, targetId, bet, death) => {
    try {
        if (!user.isLogin(player))
            return;
        let target = mp.players.at(targetId);
        if (mp.players.exists(target)) {
            try {
                if (bet + 250 > user.getCashMoney(player)) {
                    player.notify('~r~У вас нет такой суммы');
                    return;
                }
                if (bet > user.getCashMoney(target)) {
                    player.notify('~r~У игрока нет такой суммы');
                    return;
                }

                user.removeCashMoney(target, 250, 'Дуэль с игроком ' + user.getRpName(player));
                user.removeCashMoney(player, 250, 'Дуэль с игроком ' + user.getRpName(target));

                user.set(player, 'duelBet', bet);
                user.set(player, 'duelTarget', target.id);
                user.set(player, 'duelCount', death);

                user.set(target, 'duelBet', bet);
                user.set(target, 'duelTarget', player.id);
                user.set(target, 'duelCount', death);

                player.dimension = player.id + 1;
                target.dimension = player.id + 1;

                player.setVariable('duel', true);
                target.setVariable('duel', true);

                user.unequipAllWeapons(player);
                user.unequipAllWeapons(target);

                user.setHealth(player, 100);
                user.setHealth(target, 100);

                user.setArmour(player, 0);
                user.setArmour(target, 0);

                user.blockKeys(player, true);
                user.blockKeys(target, true);

                if (bet > 0) {
                    user.removeCashMoney(player, bet, 'Ставка дуэли');
                    user.removeCashMoney(target, bet, 'Ставка дуэли');
                }

                user.duelTimer(player);
                user.duelTimer(target);

                user.teleport(player, -27.21993637084961, -701.0771484375, 250.4136505126953, 291.64434814453125);
                user.teleport(target, 21.959980010986328, -678.0928955078125, 250.41363525390625, 112.96465301513672);
            }
            catch (e) {
                
            }
        }
        else
            player.notify('~r~Рядом с вами никого нет');
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:race:rating', (player) => {
    try {
        if (!user.isLogin(player))
            return;

        mysql.executeQuery(`SELECT name, rating_racer_mmr, rating_racer_count, rating_racer_win FROM users ORDER BY rating_racer_mmr DESC LIMIT 10`, function (err, rows, fields) {
            try {

                if (!user.isLogin(player))
                    return;

                let menuData = new Map();
                let idx = 1;
                rows.forEach(function(item) {
                    menuData.set(`#${idx++}. ~s~${item['name']}`, `~g~${item['rating_racer_mmr']}~s~ | ~q~${item['rating_racer_count']}~s~ | ~y~${item['rating_racer_win']}`);
                });

                menuData.set('~s~...', ``);
                menuData.set('~s~Ваша статистика', `~g~${user.get(player, 'rating_racer_mmr')}~s~ | ~q~${user.get(player, 'rating_racer_count')}~s~ | ~y~${user.get(player, 'rating_racer_win')}`);
                user.showMenu(player, 'Рейтинг', '~g~MMR~s~ | ~q~Заезды~s~ | ~y~Победы', menuData);
            }
            catch (e) {
                methods.debug(e);
            }
        });
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:duel:rating', (player) => {
    try {
        if (!user.isLogin(player))
            return;

        mysql.executeQuery(`SELECT name, rating_duel_mmr, rating_duel_count, rating_duel_win FROM users ORDER BY rating_duel_mmr DESC LIMIT 10`, function (err, rows, fields) {
            try {

                if (!user.isLogin(player))
                    return;

                let menuData = new Map();
                let idx = 1;
                rows.forEach(function(item) {
                    menuData.set(`#${idx++}. ~s~${item['name']}`, `~g~${item['rating_duel_mmr']}~s~ | ~q~${item['rating_duel_count']}~s~ | ~y~${item['rating_duel_win']}`);
                });

                menuData.set('~s~...', ``);
                menuData.set('~s~Ваша статистика', `~g~${user.get(player, 'rating_duel_mmr')}~s~ | ~q~${user.get(player, 'rating_duel_count')}~s~ | ~y~${user.get(player, 'rating_duel_win')}`);
                user.showMenu(player, 'Рейтинг', '~g~MMR~s~ | ~q~Дуэлей~s~ | ~y~Победы', menuData);
            }
            catch (e) {
                methods.debug(e);
            }
        });
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:user:setPlayerModel', (player, model) => {
    try {
        if (mp.players.exists(player))
            player.model = mp.joaat(model);
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:user:setClipset', (player, style) => {
    user.setClipset(player, style);
});

mp.events.addRemoteCounted('server:user:setClipsetW', (player, style) => {
    user.setClipsetW(player, style);
});

mp.events.addRemoteCounted('server:user:shoot', (player) => {
    try {
        if (mp.players.exists(player)) {
            mp.players.callInRange(player.position, 100, 'client:pSync:shoot', [player.id])
        }
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:syncTaskEnter', (player, vehId, seat) => {
    try {
        if (mp.players.exists(player)) {
            mp.players.callInRange(player.position, 100, 'client:syncTaskEnter', [player.id, vehId, seat])
        }
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:user:setHeal', (player, level) => {
    try {
        if (mp.players.exists(player))
            player.health = level;
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:user:setVirtualWorld', (player, vwId) => {
    try {
        if (mp.players.exists(player))
            player.dimension = vwId;
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:user:setVirtualWorldVeh', (player, vwId) => {
    try {
        if (mp.players.exists(player.vehicle))
            player.vehicle.dimension = vwId;
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:user:setAlpha', (player, alpha) => {
    try {
        player.alpha = alpha;
        mp.players.call('client:pSync:alpha', [player.id, alpha]);
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:user:toLspdSafe', (player) => {
    try {
        if (!user.isLogin(player))
            return;

        if (user.get(player, 'online_lspd') > 1) {
            user.showCustomNotify(player, `Вам осталось отыграть ${methods.parseFloat(user.get(player, 'online_lspd') * 8.5 / 60).toFixed(2)}ч для доступа к конфискату`);
            return;
        }
        inventory.getItemList(player, inventory.types.StockTakeWeap, user.getId(player));
        //user.toLspdSafe(player)
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:user:arrest', (player) => {
    try {
        let currentLvl = user.get(player, 'wanted_level');
        user.set(player, 'wanted_level', currentLvl - methods.parseInt(currentLvl / 5));
        user.arrest(player)
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:user:serVariable', (player, key, val) => {
    try {
        //methods.debug('server:user:serVariable', key, val);
        if (mp.players.exists(player))
            player.setVariable(key, val);
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:vehicle:serVariable', (player, key, val) => {
    try {
        //methods.debug('server:vehicle:serVariable', key, val);
        if (mp.players.exists(player) && mp.vehicles.exists(player.vehicle))
            player.vehicle.setVariable(key, val);
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:vehicle:attach', (player, key, isRemove) => {
    try {
        //methods.debug('server:vehicle:serVariable', key, val);
        if (mp.players.exists(player) && mp.vehicles.exists(player.vehicle))
            player.vehicle.addAttachment(key, isRemove);
    } catch (e) {
        console.log(e);
    }
});

mp.events.addRemoteCounted('server:user:generateCryptoCard', (player) => {
    try {
        user.set(player, 'crypto_card', methods.md5(`${methods.getTimeStamp()}${player.socialClub}`));
        user.save(player);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:user:setDecoration', (player, slot, type) => {
    user.setDecoration(player, slot, type);
});

mp.events.addRemoteCounted('server:user:clearDecorations', (player) => {
    user.clearDecorations(player);
});

mp.events.addRemoteCounted('server:user:updateCharacterCloth', (player) => {
    user.updateCharacterCloth(player);
});

mp.events.addRemoteCounted('server:user:updateCharacterFace', (player) => {
    user.updateCharacterFace(player);
});

mp.events.addRemoteCounted('server:user:updateTattoo', (player) => {
    user.updateTattoo(player);
});

mp.events.addRemoteCounted('server:user:setComponentVariation', (player, component, drawableId, textureId) => {
    user.setComponentVariation(player, component, drawableId, textureId);
});

mp.events.addRemoteCounted('server:user:setProp', (player, slot, type, color) => {
    user.setProp(player, slot, type, color);
});

mp.events.addRemoteCounted('server:user:clearAllProp', (player) => {
    user.clearAllProp(player);
});

mp.events.addRemoteCounted('server:user:giveUniform', (player, id) => {
    user.giveUniform(player, id);
});

mp.events.addRemoteCounted('server:cont:vehicle', (player, veh) => {
    if (!user.isLogin(player))
        return;
    try {
        if (user.get(player, 'online_time') < 70) {
            player.notify(`~r~Вам осталось отыграть ${methods.parseFloat((70 - user.get(player, 'online_time')) * 8.5 / 60).toFixed(1)}`);
            return;
        }
        if (user.get(player, 'is_take_vehicle')) {
            player.notify('~r~Вы уже получили транспорт');
            return;
        }

        let slot = 10;
        for (let i = 2; i <= 10; i++) {
            if (user.get(player, 'car_id' + i) === 0) {
                slot = i;
                break;
            }
        }

        user.set(player, 'is_take_vehicle', true);
        if (veh === 'bmw')
            user.giveVehicle(player, 'Bmwe65', 1, false, '', false, true, slot);
        else if (veh === 'audi')
            user.giveVehicle(player, 'A8Audi', 1, false, '', false, true, slot);
        else
            user.giveVehicle(player, '600sel', 1, false, '', false, true, slot);
        player.notify('~g~Вы получили транспорт');
    }
    catch (e) {}
});

mp.events.addRemoteCounted('server:cont:vehicle2', (player, veh) => {
    if (!user.isLogin(player))
        return;
    try {
        if (user.get(player, 'online_contall') < 494) {
            player.notify(`~r~Вам осталось отыграть ${methods.parseFloat((494 - user.get(player, 'online_contall')) * 8.5 / 60).toFixed(1)}`);
            return;
        }
        if (user.get(player, 'is_take_vehicle_2')) {
            player.notify('~r~Вы уже получили транспорт');
            return;
        }

        let slot = 10;
        for (let i = 2; i <= 10; i++) {
            if (user.get(player, 'car_id' + i) === 0) {
                slot = i;
                break;
            }
        }

        user.set(player, 'is_take_vehicle_2', true);
        if (veh === 'bmw')
            user.giveVehicle(player, 'Bmwx6m', 1, false, '', false, true, slot);
        else if (veh === 'cad')
            user.giveVehicle(player, 'Gmt900escalade', 1, false, '', false, true, slot);
        else
            user.giveVehicle(player, 'mercgle', 1, false, '', false, true, slot);
        player.notify('~g~Вы получили транспорт');
    }
    catch (e) {}
});

mp.events.addRemoteCounted('server:trucker:showMenu', (player, id) => {
    if (!user.isLogin(player))
        return;
    trucker.showMenu(player, id);
});

mp.events.addRemoteCounted('server:tucker:acceptOffer', (player, offerId) => {
    if (!user.isLogin(player))
        return;
    trucker.acceptOffer(player, offerId);
});

mp.events.addRemoteCounted('server:trucker:doneOffer', (player, offerId) => {
    if (!user.isLogin(player))
        return;
    trucker.doneOffer(player, offerId);
});

mp.events.addRemoteCounted('server:trucker:addOffer', (player, type, price, name, x, y, z) => {
    if (!user.isLogin(player))
        return;
    trucker.addOffer(type, price, name, x, y, z);
});

mp.events.addRemoteCounted('server:trucker:stop', (player, offerId) => {
    if (!user.isLogin(player))
        return;
    trucker.stop(player, offerId);
});

mp.events.addRemoteCounted('server:trucker:trySpawnTrailer', (player, offerId) => {
    if (!user.isLogin(player))
        return;
    trucker.trySpawnTrailer(player, offerId);
});

mp.events.addRemoteCounted('server:user:kick', (player, reason) => {
    user.kick(player, reason);
});

mp.events.addRemoteCounted('server:user:kickAntiCheat', (player, reason) => {
    user.kickAntiCheat(player, reason);
});

mp.events.addRemoteCounted('server:user:warnAntiCheat', (player, reason) => {
    chat.sendToAdmin(`Подозрение в читерстве ${user.getRpName(player)} (${player.id})`, reason);
});

mp.events.addRemoteCounted('server:user:banAntiCheat', (player, type, reason) => {
    admin.banByAnticheat(0, player.id, type, reason);
});

mp.events.addRemoteCounted('server:enums:getCloth', (player, requestID) => {
    try {
        player.call('client:enums:updateCloth', [requestID, JSON.stringify(enums.hairOverlays), JSON.stringify(enums.clothM), JSON.stringify(enums.clothF), JSON.stringify(enums.propM), JSON.stringify(enums.propF)]);
    } catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:enums:getCloth1', (player, requestID) => {
    try {
        player.call('client:enums:updateCloth1', [requestID, JSON.stringify(enums.printList), JSON.stringify(enums.fractionListId)]);
    } catch (e) {
        methods.debug(e);
    }

    setTimeout(function () {
        try {
            player.call('client:updateItemList', [JSON.stringify(weapons.hashesMap), JSON.stringify(weapons.components), JSON.stringify(items.itemList), JSON.stringify(items.recipes)]);
        }
        catch (e) {

        }
    }, 1000);

    setTimeout(function () {
        try {
            for (let i = 0; i < methods.parseInt(enums.maskList.length / 500) + 1; i++)
                player.call('client:enums:updateMask', [enums.maskList.slice(i * 500, i * 500 + 500)]);

            for (let i = 0; i < methods.parseInt(enums.tattooList.length / 250) + 1; i++)
                player.call('client:enums:updateTattoo', [enums.tattooList.slice(i * 250, i * 250 + 250)]);
        }
        catch (e) {
            methods.debug(e);
        }
    }, 2000);
});

mp.events.addRemoteCounted('server:playScenario', (player, name) => {
    if (!user.isLogin(player))
        return;
    //player.playScenario(name);
    user.playScenario(player, name);
});

mp.events.addRemoteCounted('server:stopScenario', (player) => {
    if (!user.isLogin(player))
        return;
    //player.playScenario(name);
    user.stopScenario(player);
});

mp.events.addRemoteCounted('server:playAnimation', (player, name1, name2, flag) => {
    if (!user.isLogin(player))
        return;
    user.playAnimation(player, name1, name2, flag);
    //mp.players.call('client:syncAnimation', [player.id, name1, name2, flag]);
});

mp.events.addRemoteCounted('server:setRagdoll', (player, timeout) => {
    if (!user.isLogin(player))
        return;
    user.setRagdoll(player, timeout);
});

mp.events.addRemoteCounted('server:stopAllAnimation', (player) => {
    try {
        user.stopAnimation(player);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:playAnimationWithUser', (player, userId, animId) => {
    if (!user.isLogin(player))
        return;
    user.playAnimationWithUser(player, mp.players.at(userId), animId);
});

mp.events.addRemoteCounted('playAnimationWithUserAsk', (player, userId, animId) => {
    if (!user.isLogin(player))
        return;
    let target = user.getPlayerById(userId);
    if (user.isLogin(target)) {
        if (methods.distanceToPos(target.position, player.position) < 3) {
            player.notify('~r~Вы слишком далеко');
            return;
        }
    }
    else
        player.notify('~r~Вы слишком далеко');
});

mp.events.addRemoteCounted('server:playAnimationByPlayerId', (player, playerId, name1, name2, flag) => {
    if (!user.isLogin(player))
        return;
    user.playAnimation(user.getPlayerById(playerId), name1, name2, flag);
    //mp.players.call('client:syncAnimation', [player.id, name1, name2, flag]);
});

mp.events.addRemoteCounted('server:discord:sendDiscordServerNews', (player, title, sender, message) => {
    if (user.get(player, 'fraction_id') === 1)
        discord.sendFractionList(title, sender, message, discord.socialClub + player.socialClub.toLowerCase(), discord.imgGov, discord.colorGov);
    if (user.get(player, 'fraction_id') === 2)
        discord.sendFractionList(title, sender, message, discord.socialClub + player.socialClub.toLowerCase(), discord.imgLspd, discord.colorLspd);
    if (user.get(player, 'fraction_id') === 3)
        discord.sendFractionList(title, sender, message, discord.socialClub + player.socialClub.toLowerCase(), discord.imgFib, discord.colorFib);
    if (user.get(player, 'fraction_id') === 4)
        discord.sendFractionList(title, sender, message, discord.socialClub + player.socialClub.toLowerCase(), discord.imgUsmc, discord.colorUsmc);
    if (user.get(player, 'fraction_id') === 5)
        discord.sendFractionList(title, sender, message, discord.socialClub + player.socialClub.toLowerCase(), discord.imgSheriff, discord.colorSheriff);
    if (user.get(player, 'fraction_id') === 6)
        discord.sendFractionList(title, sender, message, discord.socialClub + player.socialClub.toLowerCase(), discord.imgEms, discord.colorEms);
    if (user.get(player, 'fraction_id') === 7)
        discord.sendFractionList(title, sender, message, discord.socialClub + player.socialClub.toLowerCase(), discord.imgInvader, discord.colorInvader);
});

mp.events.addRemoteCounted('server:players:notifyWithPictureToAll', (player, title, sender, message, notifPic, icon, flashing, textColor, bgColor, flashColor) => {
    methods.notifyWithPictureToAll(title, sender, message, notifPic, icon, flashing, textColor, bgColor, flashColor);
});

mp.events.addRemoteCounted('server:players:notifyWithPictureToFraction', (player, title, sender, message, notifPic, fractionId, icon, flashing, textColor, bgColor, flashColor) => {
    methods.notifyWithPictureToFraction(title, sender, message, notifPic, fractionId, icon, flashing, textColor, bgColor, flashColor);
});

mp.events.addRemoteCounted('server:players:notifyWithPictureToFraction2', (player, title, sender, message, notifPic, fractionId, icon, flashing, textColor, bgColor, flashColor) => {
    methods.notifyWithPictureToFraction2(title, sender, message, notifPic, fractionId, icon, flashing, textColor, bgColor, flashColor);
});

mp.events.addRemoteCounted('server:players:notifyWithPictureToFractionF', (player, title, sender, message, notifPic, fractionId, icon, flashing, textColor, bgColor, flashColor) => {
    methods.notifyWithPictureToFractionF(title, sender, message, notifPic, fractionId, icon, flashing, textColor, bgColor, flashColor);
});

mp.events.addRemoteCounted('server:players:notifyToFraction', (player, message, fractionId) => {
    methods.notifyToFraction(message, fractionId);
});

mp.events.addRemoteCounted('server:players:notifyToAll', (player, message) => {
    methods.notifyToAll(message);
});

mp.events.addRemoteCounted('server:business:cloth:change', (player, body, clothId, color, torso, torsoColor, parachute, parachuteColor) => {
    if (!user.isLogin(player))
        return;
    cloth.change(player, body, clothId, color, torso, torsoColor, parachute, parachuteColor);
});

mp.events.addRemoteCounted('server:business:cloth:buy', (player, price, body, clothId, color, torso, torsoColor, parachute, parachuteColor, itemName, shopId, isFree, payType) => {
    if (!user.isLogin(player))
        return;
    cloth.buy(player, price, body, clothId, color, torso, torsoColor, parachute, parachuteColor, itemName, shopId, isFree, payType);
});

mp.events.addRemoteCounted('server:business:cloth:changeMask', (player, clothId, color) => {
    if (!user.isLogin(player))
        return;
    cloth.changeMask(player, clothId, color);
});

mp.events.addRemoteCounted('server:business:cloth:buyMask', (player, price, maskId, shopId, payType) => {
    if (!user.isLogin(player))
        return;
    cloth.buyMask(player, price, maskId, shopId, payType);
});

mp.events.addRemoteCounted('server:business:cloth:changeProp', (player, body, clothId, color) => {
    if (!user.isLogin(player))
        return;
    cloth.changeProp(player, body, clothId, color);
});

mp.events.addRemoteCounted('server:business:cloth:buyProp', (player, price, body, clothId, color, itemName, shopId, isFree, payType) => {
    if (!user.isLogin(player))
        return;
    cloth.buyProp(player, price, body, clothId, color, itemName, shopId, isFree, payType);
});

mp.events.addRemoteCounted('server:print:buy', (player, slot, type, price, shopId, payType) => {
    if (!user.isLogin(player))
        return;
    cloth.buyPrint(player, slot, type, price, shopId, payType);
});

mp.events.addRemoteCounted('server:tattoo:buy', (player, slot, type, zone, price, itemName, shopId, payType) => {
    if (!user.isLogin(player))
        return;
    tattoo.buy(player, slot, type, zone, price, itemName, shopId, payType);
});

mp.events.addRemoteCounted('server:tattoo:destroy', (player, slot, type, zone, price, itemName, shopId, payType) => {
    if (!user.isLogin(player))
        return;
    tattoo.destroy(player, slot, type, zone, price, itemName, shopId, payType);
});

mp.events.addRemoteCounted('server:user:buyLicense', (player, type, price, month, typePay) => {
    user.buyLicense(player, type, price, month, typePay);
});

mp.events.addRemoteCounted('server:user:sendSms', (player, sender, title, text, pic) => {
    if (!user.isLogin(player))
        return;
    user.sendSms(player, sender, title, text, pic);
});

mp.events.addRemoteCounted('server:user:addHistory', (player, type, reason) => {
    if (!user.isLogin(player))
        return;
    user.addHistory(player, type, reason);
});

mp.events.addRemoteCounted('server:user:giveJobSkill', (player, name) => {
    if (!user.isLogin(player))
        return;
    user.giveJobSkill(player, name);
});

mp.events.addRemoteCounted('server:user:giveTicket', (player, id, price, reason) => {
    if (!user.isLogin(player))
        return;

    reason = methods.removeSpecialChars(methods.removeQuotes2(methods.removeQuotes(reason)));
    let rpDateTime = weather.getRpDateTime();
    let timestamp = methods.getTimeStamp();
    let desc = `${user.getRpName(player)} (${user.getFractionName(player)} | ${user.getDepartmentName(player)}) | Причина: ${reason}`;
    let target = user.getPlayerById(id);
    if (user.isLogin(target)) {
        player.notify(`~r~Вам был выписан штраф на сумму ${price}\n${reason}`);
        if (target.id === player.id)
            desc = 'Система | Причина: ' + reason;
        mysql.executeQuery(`INSERT INTO tickets (user_id, price, do, rp_datetime, timestamp) VALUES ('${id}', '${price}', '${desc}', '${rpDateTime}', '${timestamp}')`);
    }
    else {
        mysql.executeQuery(`INSERT INTO tickets (user_id, price, do, rp_datetime, timestamp) VALUES ('${id}', '${price}', '${desc}', '${rpDateTime}', '${timestamp}')`);
    }
});

mp.events.addRemoteCounted('server:user:takeTicket', (player, id, reason) => {
    if (!user.isLogin(player))
        return;
    reason = methods.removeSpecialChars(methods.removeQuotes2(methods.removeQuotes(reason)));
    let rpDateTime = weather.getRpDateTime();
    let timestamp = methods.getTimeStamp();
    let desc = `${user.getRpName(player)} (${user.getFractionName(player)} | ${user.getDepartmentName(player)}) | Причина: ${reason}`;
    mysql.executeQuery(`UPDATE tickets SET do2='${desc}' is_pay='1' WHERE id='${id}'`);
});

mp.events.addRemoteCounted('server:user:payTicket', (player, id, price) => {
    if (!user.isLogin(player))
        return;
    if (user.getBankMoney(player) < price) {
        player.notify('~r~У вас нет на карте средств для оплаты штрафа');
        return;
    }
    user.removeBankMoney(player, player, 'Оплата штрафа #' + id);
    mysql.executeQuery(`UPDATE tickets SET is_pay='1' WHERE id='${id}'`);
    player.notify('~g~Вы оплатили штраф!');
});

mp.events.addRemoteCounted('server:bank:withdraw', (player, money, procent) => {
    if (!user.isLogin(player))
        return;
    bank.withdraw(player, money, procent);
});

mp.events.addRemoteCounted('server:bank:deposit', (player, money, procent) => {
    if (!user.isLogin(player))
        return;
    bank.deposit(player, money, procent);
});

mp.events.addRemoteCounted('server:bank:transferMoney', (player, bankNumber, money) => {
    if (!user.isLogin(player))
        return;
    bank.transferMoney(player, methods.parseInt(bankNumber), money);
});

mp.events.addRemoteCounted('server:crypto:transferMoney', (player, bankNumber, money) => {
    if (!user.isLogin(player))
        return;
    bank.transferCryptoMoney(player, bankNumber, money);
});

mp.events.addRemoteCounted('server:bank:changePin', (player, pin) => {
    if (!user.isLogin(player))
        return;
    bank.changePin(player, pin);
});

mp.events.addRemoteCounted('server:showMeriaTicketMenu', (player,) => {
    if (!user.isLogin(player))
        return;

    mysql.executeQuery(`SELECT * FROM tickets WHERE is_pay = '0' AND user_id='${user.getId(player)}' LIMIT 100`, function (err, rows, fields) {
        try {
            let list = [];
            rows.forEach(function(item) {
                list.push({id: item['id'], do: item['do'], price: item['price'], rp_datetime: item['rp_datetime']});
            });
            player.call('client:showMeriaTicketMenu', [JSON.stringify(list)]);
        }
        catch (e) {
            methods.debug(e);
        }
    });
});

mp.events.addRemoteCounted('server:bank:changeCardNumber', (player, bankNumber) => {
    if (!user.isLogin(player))
        return;
    //bank.changeCardNumber(player, bankNumber);
});

mp.events.addRemoteCounted('server:bank:closeCard', (player) => {
    if (!user.isLogin(player))
        return;
    bank.closeCard(player);
});

mp.events.addRemoteCounted('server:bank:openCard', (player, bankId, priceCard) => {
    if (!user.isLogin(player))
        return;
    bank.openCard(player, bankId, priceCard);
});

mp.events.addRemoteCounted('server:rent:buy', (player, hash, price, shopId, payType) => {
    if (!user.isLogin(player))
        return;
    rent.buy(player, hash, price, shopId, payType);
});

mp.events.addRemoteCounted('server:user:showPlayerHistory', (player,) => {
    if (!user.isLogin(player))
        return;

    mysql.executeQuery(`SELECT * FROM log_player WHERE user_id = ${user.getId(player)} ORDER BY id DESC LIMIT 200`, function (err, rows, fields) {
        try {
            let list = [];
            rows.forEach(function(item) {
                list.push({id: item['id'], text: item['do'], timestamp: item['timestamp'], rp_datetime: item['rp_datetime']});
            });
            player.call('client:showPlayerHistoryMenu', [JSON.stringify(list)]);
        }
        catch (e) {
            methods.debug(e);
        }
    });
});

mp.events.addRemoteCounted('server:user:save', (player) => {
    user.save(player);
});

mp.events.addRemoteCounted('server:gps:findFleeca', (player) => {
    if (!user.isLogin(player))
        return;
    let pos = bank.findNearestFleeca(player.position);
    user.setWaypoint(player, pos.x, pos.y);
});

mp.events.addRemoteCounted('server:gps:findBank', (player) => {
    if (!user.isLogin(player))
        return;
    let pos = bank.findNearest(player.position);
    user.setWaypoint(player, pos.x, pos.y);
});

mp.events.addRemoteCounted('server:gps:find247', (player) => {
    if (!user.isLogin(player))
        return;
    let pos = shop.findNearestById(player.position, 0);
    user.setWaypoint(player, pos.x, pos.y);
});

mp.events.addRemoteCounted('server:gps:findApt', (player) => {
    if (!user.isLogin(player))
        return;
    let pos = shop.findNearestById(player.position, 6);
    user.setWaypoint(player, pos.x, pos.y);
});

mp.events.addRemoteCounted('server:gps:findEl', (player) => {
    if (!user.isLogin(player))
        return;
    let pos = shop.findNearestById(player.position, 5);
    user.setWaypoint(player, pos.x, pos.y);
});

mp.events.addRemoteCounted('server:gps:findFuel', (player) => {
    if (!user.isLogin(player))
        return;
    let pos = fuel.findNearest(player.position);
    user.setWaypoint(player, pos.x, pos.y);
});

mp.events.addRemoteCounted('server:gps:findRent', (player) => {
    if (!user.isLogin(player))
        return;
    let pos = rent.findNearest(player.position);
    user.setWaypoint(player, pos.x, pos.y);
});

mp.events.addRemoteCounted('server:gps:findGunShop', (player) => {
    if (!user.isLogin(player))
        return;
    let pos = gun.findNearest(player.position);
    user.setWaypoint(player, pos.x, pos.y);
});

mp.events.addRemoteCounted('server:gps:findClothShop', (player) => {
    if (!user.isLogin(player))
        return;
    let pos = cloth.findNearest(player.position);
    user.setWaypoint(player, pos.x, pos.y);
});

mp.events.addRemoteCounted('server:gps:findBar', (player) => {
    if (!user.isLogin(player))
        return;
    let pos = bar.findNearest(player.position);
    user.setWaypoint(player, pos.x, pos.y);
});

mp.events.addRemoteCounted('server:gps:findBarberShop', (player) => {
    if (!user.isLogin(player))
        return;
    let pos = barberShop.findNearest(player.position);
    user.setWaypoint(player, pos.x, pos.y);
});

mp.events.addRemoteCounted('server:gps:findTattooShop', (player) => {
    if (!user.isLogin(player))
        return;
    let pos = tattoo.findNearest(player.position);
    user.setWaypoint(player, pos.x, pos.y);
});

mp.events.addRemoteCounted('server:gps:findLsc', (player) => {
    if (!user.isLogin(player))
        return;
    let pos = lsc.findNearest(player.position);
    user.setWaypoint(player, pos.x, pos.y);
});

mp.events.addRemoteCounted('server:gps:findCarWash', (player) => {
    if (!user.isLogin(player))
        return;
    let pos = carWash.findNearest(player.position);
    user.setWaypoint(player, pos.x, pos.y);
});

mp.events.addRemoteCounted('server:user:showLic', (player, lic, playerId) => {
    if (!user.isLogin(player))
        return;

    let remotePlayer = mp.players.at(playerId);
    if (remotePlayer && user.isLogin(remotePlayer)) {
        try {
            if (user.isCuff(remotePlayer) || user.isTie(remotePlayer)) {
                player.notify('~r~Игрок в наручниках');
                return;
            }

            if (methods.distanceToPos(remotePlayer.position, player.position) > 4) {
                player.notify('~r~Вы слишком далеко');
                return;
            }

            if (remotePlayer.id != player.id) {
                user.playAnimation(remotePlayer, "mp_common","givetake2_a", 8);
                user.playAnimation(player, "mp_common","givetake1_a", 8);
                chat.sendMeCommand(remotePlayer, 'посмотрел документы');
                chat.sendMeCommand(player, 'показал документы');
            }
            else
                chat.sendMeCommand(player, 'посмотрел документы');

            remotePlayer.notify('~b~Скрыть документы можно по кнопке ~s~BACKSPACE ~b~или ~s~ESC');

            if (lic == 'card_id') {

                let dataSend = {
                    type: 'updateValues',
                    isShow: true,
                    info: {
                        firstname: user.getRpName(player).split(' ')[0],
                        lastname: user.getRpName(player).split(' ')[1],
                        sex: user.getSexName(player),
                        age: user.get(player, 'age'),
                        nation: user.get(player, 'national'),
                        regist: user.getRegStatusName(player),
                        idcard: user.getId(player).toString(),
                        subscribe: user.getRpName(player).split(' ')[0][0] + '.' + user.getRpName(player).split(' ')[1],
                        img: 'https://a.rsg.sc//n/' + player.socialClub.toLowerCase(),
                    },
                };
                user.callCef(remotePlayer, 'cardid', JSON.stringify(dataSend));

                /*menuData.set('ID', (user.getId(remotePlayer) + 10000000).toString());
                menuData.set('Имя', user.getRpName(remotePlayer));
                menuData.set('Тип регистрации', user.getRegStatusName(remotePlayer));
                menuData.set('Дата рождения', user.get(remotePlayer, 'age'));
                menuData.set('Пол', user.getSexName(player));
                menuData.set('Национальность', user.get(remotePlayer, 'national'));

                user.showMenu(remotePlayer, 'Card ID', user.getRpName(player), menuData);*/
            }
            else if (lic == 'work_lic') {

                if (user.get(player, 'work_lic') != '') {

                    let dataSend = {
                        type: 'updateValues',
                        isShow: true,
                        info: {
                            firstname: user.getRpName(player).split(' ')[0],
                            lastname: user.getRpName(player).split(' ')[1],
                            sex: user.getSexName(player),
                            age: user.get(player, 'age'),
                            first_work: user.getFractionName(player),
                            second_work: user.getJobName(player),
                            lvl_work: user.get(player, 'work_lvl').toString(),
                            experience: user.get(player, 'work_exp').toString(),
                            data: user.get(player, 'work_date'),
                            idwork: user.get(player, 'work_lic'),
                            subscribe: user.getRpName(player).split(' ')[0][0] + '.' + user.getRpName(player).split(' ')[1],
                            img: 'https://a.rsg.sc//n/' + player.socialClub.toLowerCase(),
                        },
                    };
                    user.callCef(remotePlayer, 'workid', JSON.stringify(dataSend));

                    /*menuData.set('ID', user.get(remotePlayer, 'work_lic'));
                    menuData.set('Владелец', user.getRpName(remotePlayer));
                    menuData.set('Дата получения', user.get(remotePlayer, 'work_date'));

                    if (user.get(remotePlayer, 'job') > 0 && user.get(remotePlayer, 'fraction_id') > 0) {
                        menuData.set('Основная работа', user.getFractionName(remotePlayer));
                        menuData.set('Вторая работа', user.getJobName(remotePlayer));
                    }
                    else if (user.get(remotePlayer, 'fraction_id') > 0)
                        menuData.set('Работа', user.getFractionName(remotePlayer));
                    else
                        menuData.set('Работа', user.getJobName(remotePlayer));

                    menuData.set('Уровень рабочего', user.get(remotePlayer, 'work_lvl'));
                    menuData.set('Опыт рабочего', user.get(remotePlayer, 'work_exp'));
                    user.showMenu(remotePlayer, 'Work ID', user.getRpName(player), menuData);*/
                }
                else {
                    player.notify('~r~У Вас отсутствует Work ID');
                    if (remotePlayer.id != player.id)
                        remotePlayer.notify('~r~У игрока отсуствует Work ID');
                }
            }
            else {
                let licName = '';
                let licPref = 'L';

                switch (lic) {
                    case 'a_lic':
                        licName = 'Категория А';
                        licPref = 'A';
                        break;
                    case 'b_lic':
                        licName = 'Категория B';
                        licPref = 'B';
                        break;
                    case 'c_lic':
                        licName = 'Категория C';
                        licPref = 'C';
                        break;
                    case 'air_lic':
                        licName = 'Воздушный транспорт';
                        licPref = 'P';
                        break;
                    case 'ship_lic':
                        licName = 'Водный транспорт';
                        licPref = 'S';
                        break;
                    case 'taxi_lic':
                        licName = 'Перевозка пассажиров';
                        licPref = 'T';
                        break;
                    case 'law_lic':
                        licName = 'Юриста';
                        licPref = 'L';
                        break;
                    case 'gun_lic':
                        licName = 'На оружие';
                        licPref = 'G';
                        break;
                    case 'biz_lic':
                        licName = 'На предпринимательство';
                        licPref = 'Z';
                        break;
                    case 'fish_lic':
                        licName = 'На рыбаловство';
                        licPref = 'F';
                        break;
                    case 'med_lic':
                        licName = 'Мед. страховка';
                        licPref = 'M';
                        break;
                    case 'marg_lic':
                        licName = 'На употребление марихуаны';
                        licPref = 'M';
                        break;
                }

                if (user.get(player, lic)) {

                    let dataSend = {
                        type: 'updateValues',
                        isShow: true,
                        info: {
                            name: user.getRpName(player).split(' ')[0],
                            surname: user.getRpName(player).split(' ')[1],
                            sex: user.getSexName(player),
                            license: licName,
                            birthday: user.get(player, 'age'),
                            date_start: user.get(player, lic + '_create'),
                            date_stop: user.get(player, lic + '_end'),
                            prefix: licPref,
                            sign: user.getRpName(player).split(' ')[0][0] + '.' + user.getRpName(player).split(' ')[1],
                            img: 'https://a.rsg.sc//n/' + player.socialClub.toLowerCase(),
                            number: licPref + (user.getId(player) + 100000)
                        },
                    };
                    user.callCef(remotePlayer, 'license', JSON.stringify(dataSend));
                }
                else {
                    player.notify('~r~У Вас отсутствует тип лицензии: ~s~' + licName);
                    if (remotePlayer.id != player.id)
                        remotePlayer.notify('~r~У игрока отсуствует тип лицензии: ~s~' + licName);
                }
            }
        }
        catch (e) {
            methods.error(e);
        }
    }
});

mp.events.addRemoteCounted('server:user:showLicGos', (player, playerId) => {
    if (!user.isLogin(player))
        return;

    let remotePlayer = mp.players.at(playerId);
    if (remotePlayer && user.isLogin(remotePlayer)) {
        try {
            if (methods.distanceToPos(remotePlayer.position, player.position) > 4) {
                player.notify('~r~Вы слишком далеко');
                return;
            }

            if (remotePlayer.id != player.id) {
                user.playAnimation(remotePlayer, "mp_common","givetake2_a", 8);
                user.playAnimation(player, "mp_common","givetake1_a", 8);
                chat.sendMeCommand(remotePlayer, 'посмотрел удостоверение');
                chat.sendMeCommand(player, 'показал удостоверение');
            }
            else
                chat.sendMeCommand(player, 'посмотрел удостоверение');

            remotePlayer.notify('~b~Скрыть документы можно по кнопке ~s~BACKSPACE ~b~или ~s~ESC');

            let dataSend = {
                type: 'updateValues',
                isShow: true,
                typef: user.getFractionHash(player),
                info: {
                    name: user.getRpName(player),
                    sex: user.getSexName(player),
                    dep: user.getDepartmentName(player),
                    position: user.getRankName(player),
                    dob: user.get(player, 'age'),
                    id: user.getId(player),
                    subscribe: user.getRpName(player).split(' ')[0][0] + '.' + user.getRpName(player).split(' ')[1],
                    img: 'https://a.rsg.sc//n/' + player.socialClub.toLowerCase(),
                },
            };
            user.callCef(remotePlayer, 'certificate', JSON.stringify(dataSend));

        }
        catch (e) {
            methods.error(e);
        }
    }
});

mp.events.addRemoteCounted('server:user:cuff', (player) => {
    if (!user.isLogin(player))
        return;
    user.cuff(player);
});

mp.events.addRemoteCounted('server:user:unCuff', (player) => {
    if (!user.isLogin(player))
        return;
    user.unCuff(player);
});

mp.events.addRemoteCounted('server:user:tie', (player) => {
    if (!user.isLogin(player))
        return;
    user.tie(player);
});

mp.events.addRemoteCounted('server:user:unTie', (player) => {
    if (!user.isLogin(player))
        return;
    user.unTie(player);
});

mp.events.addRemoteCounted("server:user:targetNotify", (player, nplayer, text) => {
    if (!user.isLogin(nplayer))
        return;
    try {
        nplayer.notify(text);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:user:cuffById', (player, targetId) => {
    if (!user.isLogin(player))
        return;

    let target = mp.players.at(targetId);

    if (mp.players.exists(target)) {
        if (methods.distanceToPos(target.position, player.position) > 3) {
            player.notify('~r~Вы слишком далеко');
            return;
        }

        //user.playAnimation(player, "mp_arresting", "a_uncuff", 8);
        user.cuff(target);
    }
    else
        player.notify('~r~Рядом с вами никого нет');
});

mp.events.addRemoteCounted('server:user:unCuffById', (player, targetId) => {
    if (!user.isLogin(player))
        return;

    let target = mp.players.at(targetId);

    if (mp.players.exists(target)) {
        if (methods.distanceToPos(target.position, player.position) > 3) {
            player.notify('~r~Вы слишком далеко');
            return;
        }
        if (!user.isPolice(player) && !user.isGov(player) && !user.isCartel(player)) {
            player.notify('~r~Вам данное действие запрещено');
            return;
        }

        if (user.isCuff(target)) {
            user.playAnimation(player, "mp_arresting", "a_uncuff", 8);
            user.playAnimation(target, 'mp_arresting', 'b_uncuff', 8);
            inventory.addItem(40, 1, inventory.types.Player, user.getId(player), 1, 0, "{}", 10);
            chat.sendMeCommand(player, 'снял наручники');
        }

        setTimeout(function () {
            user.unCuff(target);
        }, 3000);
    }
    else
        player.notify('~r~Рядом с вами никого нет');
});

mp.events.addRemoteCounted('server:user:cuffItemById', (player, targetId) => {
    if (!user.isLogin(player))
        return;

    let target = mp.players.at(targetId);

    if (mp.players.exists(target)) {
        if (methods.distanceToPos(target.position, player.position) > 3) {
            player.notify('~r~Вы слишком далеко');
            return;
        }
        if (!user.isPolice(player) && !user.isGov(player) && !user.isCartel(player)) {
            player.notify('~r~Вам данное действие запрещено');
            return;
        }

        mysql.executeQuery('SELECT id FROM items WHERE item_id = 40 AND owner_type = 1 AND owner_id = ' + user.getId(player), function (err, rows, fields) {
            if (rows.length === 0) {
                player.notify('~r~У вас нет наручников');
                return;
            }

            user.heading(target, player.heading);

            setTimeout(function () {
                user.playAnimation(target, 'mp_arrest_paired', 'crook_p2_back_right', 8);
                user.playAnimation(player, 'mp_arrest_paired', 'cop_p2_back_right', 8);

                setTimeout(function () {
                    user.cuff(target);
                    try {
                        inventory.deleteItem(rows[0]['id']);
                    }
                    catch (e) {
                        methods.debug(e);
                    }
                }, 3800); //3760
            }, 200);
        });
    }
    else
        player.notify('~r~Рядом с вами никого нет');
});

mp.events.addRemoteCounted('server:user:tieById', (player, targetId) => {
    if (!user.isLogin(player))
        return;

    let target = mp.players.at(targetId);

    if (mp.players.exists(target)) {
        if (methods.distanceToPos(target.position, player.position) > 3) {
            player.notify('~r~Вы слишком далеко');
            return;
        }
        user.playAnimation(player, "mp_arresting", "a_uncuff", 8);
        user.tie(target);
    }
    else
        player.notify('~r~Рядом с вами никого нет');
});

mp.events.addRemoteCounted('server:user:unTieById', (player, targetId) => {
    if (!user.isLogin(player))
        return;

    let target = mp.players.at(targetId);
    if (mp.players.exists(target)) {
        if (methods.distanceToPos(target.position, player.position) > 3) {
            player.notify('~r~Вы слишком далеко');
            return;
        }

        if (user.isTie(target)) {
            user.stopAnimation(target);
            user.playAnimation(player, "mp_arresting", "a_uncuff", 8);
            inventory.addItem(0, 1, inventory.types.Player, user.getId(player), 1, 0, "{}", 10);
            chat.sendMeCommand(player, 'снял стяжки');
        }

        user.unTie(target);
    }
    else
        player.notify('~r~Рядом с вами никого нет');
});

mp.events.addRemoteCounted('server:user:knockById', (player, targetId) => { //TODO
    if (!user.isLogin(player))
        return;

    if (user.has(player, 'isKnockoutTimeout'))
    {
        player.notify("~r~Таймаут 2 минуты на данное действие");
        return;
    }

    let target = mp.players.at(targetId);
    if (mp.players.exists(target)) {
        if (methods.distanceToPos(target.position, player.position) > 3) {
            player.notify('~r~Вы слишком далеко');
            return;
        }

        if (user.get(player, 'jail_time') > 0 || user.get(target, 'jail_time') > 0)
        {
            player.notify("~r~В тюрьме это действие не доступно");
            return;
        }
        if (user.get(player, 'med_time') > 0 || user.get(target, 'med_time') > 0)
        {
            player.notify("~r~В больнице это действие не доступно");
            return;
        }

        if (user.get(player, 'stats_strength') < 96) {
            player.notify("~r~Необходимо иметь навык силы больше 95%");
            return;
        }

        if (user.get(target, 'online_time') < 170) {
            player.notify("~r~Данный игрок новичок, по отношению к нему запрещены такие действия");
            return;
        }

        let random = methods.getRandomInt(0, methods.parseInt(user.get(target, 'stats_strength') / 2));
        //let random2 = methods.getRandomInt(0, user.get(target, 'stats_strength') - 200);

        user.set(player, 'isKnockoutTimeout', true);
        setTimeout(function () {
            try {
                if (!user.isLogin(player))
                    return;
                user.reset(player, 'isKnockoutTimeout');
            }
            catch (e) {
                methods.debug(e);
            }
        }, 120000);

        if (random < 50) {
            user.set(target, 'isKnockout', true);
            target.setVariable('isKnockout', true);
            user.playAnimation(target, "amb@world_human_bum_slumped@male@laying_on_right_side@base", "base", 9);
            chat.sendMeCommand(player, "замахнулся кулаком и ударил человека напротив и точным ударом в челюсть, вырубил");

            setTimeout(function () {
                try {
                    user.set(target, 'isKnockout', false);
                    target.setVariable('isKnockout', undefined);
                    user.stopAnimation(target)
                }
                catch (e) {
                    methods.debug(e);
                }
            }, 10000)
        }
        else {
            chat.sendMeCommand(player, "замахнулся кулаком и ударил человека напротив");
        }
    }
    else
        player.notify('~r~Рядом с вами никого нет');
});

mp.events.addRemoteCounted('server:user:grabById', (player, targetId) => {
    if (!user.isLogin(player))
        return;

    let target = mp.players.at(targetId);
    if (mp.players.exists(target)) {
        if (methods.distanceToPos(target.position, player.position) > 3) {
            player.notify('~r~Вы слишком далеко');
            return;
        }

        if (target.health == 0) {
            player.notify("~r~Нельзя грабить человека в коме");
            return;
        }

        if (!user.get(target, 'isKnockout'))
        {
            player.notify("~r~Игрок должен быть в нокауте");
            return;
        }

        if (user.hasById(user.getId(target), 'sellUser')) {
            player.notify('~r~Игрок недавно был ограблен');
            return;
        }

        let money = user.getCashMoney(target) / 20;
        if (money > 25000)
            money = 25000;
        user.removeCashMoney(target, money);
        user.addCashMoney(player, money);

        user.achiveDoneAllById(player, 24);

        target.notify('~r~Вас ограбили на сумму ~s~' + methods.moneyFormat(money));
        player.notify('~r~Вы ограбили на сумму ~s~' + methods.moneyFormat(money));

        user.setById(user.getId(target), 'sellUser', true);
    }
    else
        player.notify('~r~Рядом с вами никого нет');
});

mp.events.addRemoteCounted('server:user:getInvById', (player, targetId) => {
    if (!user.isLogin(player))
        return;
    let pl = mp.players.at(targetId);
    if (pl && mp.players.exists(pl)) {
        if (pl.health <= 0) {
            player.notify('~r~Нельзя обыскивать мертвых');
            return;
        }
        if (!user.isTie(pl) && !user.isCuff(pl)) {
            player.notify('~r~Игрок должен быть связан или в наручниках');
            return;
        }
        if (methods.distanceToPos(pl.position, player.position) > 3) {
            player.notify('~r~Вы слишком далеко');
            return;
        }
        if (!user.isFib(player)) {
            if (user.isPolice(pl) && !user.isTie(pl)) {
                player.notify("~r~Нельзя обыскивать сотрудников полиции в наручниках, только через стяжки");
                return;
            }
        }

        if (user.isTie(pl)) {
            if (!user.hasById(user.getId(pl), 'sellUser')) {
                player.notify('~r~Для того, чтобы обыскивать в стяжках, необходимо для начала сдать игрока через ecorp -user -getpos, после связать его в стяжки (если не связан) и обыскать');
                return;
            }
        }

        if (user.isCuff(pl)) {
            let canFrisk = false;
            enums.canFrisk.forEach(item => {
                if (methods.distanceToPos(player.position, new mp.Vector3(item[0], item[1], item[2])) < 50)
                    canFrisk = true;
            });

            if (!canFrisk) {
                player.notify('~r~Обыск можно проводить только в участках LSPD / BCSD / FIB');
                return;
            }
        }

        user.toLspdSafe(pl, 42, player);
        //inventory.getItemList(player, inventory.types.Player, user.getId(pl), true, user.isTie(pl));
    }
    else
        player.notify('~r~Рядом с вами никого нет');
});

mp.events.addRemoteCounted('server:user:getInvById2', (player, targetId) => {
    if (!user.isLogin(player))
        return;
    let pl = mp.players.at(targetId);
    if (pl && mp.players.exists(pl)) {
        if (pl.health <= 0) {
            player.notify('~r~Нельзя обыскивать мертвых');
            return;
        }
        if (!user.isTie(pl) && !user.isCuff(pl)) {
            player.notify('~r~Игрок должен быть связан или в наручниках');
            return;
        }
        if (methods.distanceToPos(pl.position, player.position) > 3) {
            player.notify('~r~Вы слишком далеко');
            return;
        }
        if (!user.isFib(player)) {
            if (user.isPolice(pl) && !user.isTie(pl)) {
                player.notify("~r~Нельзя обыскивать сотрудников полиции в наручниках, только через стяжки");
                return;
            }
        }

        inventory.getItemList(player, inventory.types.Player, user.getId(pl), true, user.isTie(pl));
    }
    else
        player.notify('~r~Рядом с вами никого нет');
});

mp.events.addRemoteCounted('server:user:getPassById', (player, targetId) => {
    if (!user.isLogin(player))
        return;
    let pl = mp.players.at(targetId);
    if (pl && mp.players.exists(pl)) {
        if (!user.isTie(pl) && !user.isCuff(pl)) {
            player.notify('~r~Игрок должен быть связан или в наручниках');
            return;
        }
        if (methods.distanceToPos(pl.position, player.position) > 3) {
            player.notify('~r~Вы слишком далеко');
            return;
        }

        let dataSend = {
            type: 'updateValues',
            isShow: true,
            info: {
                firstname: user.getRpName(pl).split(' ')[0],
                lastname: user.getRpName(pl).split(' ')[1],
                sex: user.getSexName(pl),
                age: user.get(pl, 'age'),
                nation: user.get(pl, 'national'),
                regist: user.getRegStatusName(pl),
                idcard: user.getId(pl).toString(),
                img: 'https://a.rsg.sc//n/' + pl.socialClub.toLowerCase(),
            },
        };
        user.callCef(player, 'cardid', JSON.stringify(dataSend));
    }
    else
        player.notify('~r~Рядом с вами никого нет');
});

mp.events.addRemoteCounted('server:user:taskFollowById', (player, targetId) => {
    if (!user.isLogin(player))
        return;
    let nplayer = mp.players.at(targetId);
    if (!user.isLogin(nplayer))
        return;
    if (!user.isTie(nplayer) && !user.isCuff(nplayer)) {
        player.notify('~r~Игрок должен быть связан или в наручниках');
        return;
    }
    if (methods.distanceToPos(nplayer.position, player.position) > 3) {
        player.notify('~r~Вы слишком далеко');
        return;
    }
    nplayer.call("client:taskFollow", [player]);
});

mp.events.addRemoteCounted('server:user:taskRemoveMaskById', (player, targetId) => {
    if (!user.isLogin(player))
        return;
    let nplayer = mp.players.at(targetId);
    if (!user.isLogin(nplayer))
        return;
    if (!user.isTie(nplayer) && !user.isCuff(nplayer)) {
        player.notify('~r~Игрок должен быть связан или в наручниках');
        return;
    }
    if (methods.distanceToPos(nplayer.position, player.position) > 3) {
        player.notify('~r~Вы слишком далеко');
        return;
    }
    if (nplayer.health <= 1) {
        player.notify('~r~Игрок в коме');
        return;
    }
    mysql.executeQuery(`UPDATE items SET is_equip='0' WHERE item_id = '274' AND owner_id='${user.getId(nplayer)}' AND owner_type='1' AND is_equip='1'`);
    user.set(nplayer, 'mask', -1);
    user.set(nplayer, 'mask_color', -1);
    player.notify('~b~Вы сняли маску с игрока');

    user.updateCharacterFace(nplayer);
    user.updateCharacterCloth(nplayer);
});

mp.events.addRemoteCounted('server:user:inCarById', (player, targetId) => {
    if (!user.isLogin(player))
        return;
    try {
        let pl = mp.players.at(targetId);
        if (pl && mp.players.exists(pl)) {
            if (!user.isTie(pl) && !user.isCuff(pl)) {
                player.notify('~r~Игрок должен быть связан или в наручниках');
                return;
            }
            if (methods.distanceToPos(pl.position, player.position) > 3) {
                player.notify('~r~Вы слишком далеко');
                return;
            }
            let v = methods.getNearestVehicleWithCoords(player.position, 7);
            if (v && mp.vehicles.exists(v)) {
                user.putInVehicle(pl, v, 0);
                player.notify('~g~Вы затащили человека в транспорт');
                pl.notify('~r~Вас затащили в транспорт');
            } else {
                player.notify('~r~Рядом с вами нет транспорта');
            }

        }
        else
            player.notify('~r~Рядом с вами никого нет');
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:user:removeCarById', (player, targetId) => {
    if (!user.isLogin(player))
        return;
    try {
        let pl = mp.players.at(targetId);
        if (pl && mp.players.exists(pl)) {
            if (!user.isTie(pl) && !user.isCuff(pl)) {
                player.notify('~r~Игрок должен быть связан или в наручниках');
                return;
            }
            if (pl.vehicle && mp.vehicles.exists(pl.vehicle)) {
                pl.removeFromVehicle();
                player.notify('~g~Вы вытащили человека из транспорта');
                pl.notify('~r~Вас вытащили из транспорта');
            } else {
                player.notify('~r~Игрок не в транспорте');
            }
        }
        else
            player.notify('~r~Рядом с вами никого нет');
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:user:giveMoneyToPlayerId', (player, playerRemoteId, money) => {
    if (!user.isLogin(player))
        return;

    if (user.getCashMoney(player) < money) {
        player.notify("~r~У Вас нет столько денег");
        return;
    }

    let remotePlayer = mp.players.at(playerRemoteId);
    if (remotePlayer && user.isLogin(remotePlayer)) {

        if (methods.distanceToPos(remotePlayer.position, player.position) > 3) {
            player.notify('~r~Вы слишком далеко');
            return;
        }

        user.removeCashMoney(player, money);
        user.addCashMoney(remotePlayer, money);

        user.playAnimationWithUser(player, remotePlayer, 6);

        remotePlayer.notify('Вам передали ~g~' + methods.moneyFormat(money));
        player.notify('Вы передали ~g~' + methods.moneyFormat(money));

        methods.saveLog('log_give_money',
            ['type', 'user_from', 'user_to', 'sum'],
            ['CASH', `${user.getRpName(player)} (${user.getId(player)})`, `${user.getRpName(remotePlayer)} (${user.getId(remotePlayer)})`, money],
        );
    }
});

mp.events.addRemoteCounted('server:user:askDatingToPlayerId', (player, playerRemoteId, name) => {
    if (!user.isLogin(player))
        return;

    let remotePlayer = mp.players.at(playerRemoteId);
    if (user.isLogin(remotePlayer)) {
        if (methods.distanceToPos(remotePlayer.position, player.position) > 3) {
            player.notify('~r~Вы слишком далеко');
            return;
        }
        remotePlayer.call('client:user:askDatingToPlayerId', [player.id, name]);
    }
});

mp.events.addRemoteCounted('server:dice:askById', (player, playerRemoteId, sum) => {
    if (!user.isLogin(player))
        return;

    let remotePlayer = mp.players.at(playerRemoteId);
    if (user.isLogin(remotePlayer)) {
        if (methods.distanceToPos(remotePlayer.position, player.position) > 3) {
            player.notify('~r~Вы слишком далеко');
            return;
        }
        remotePlayer.call('client:user:askDiceToPlayerId', [player.id, sum]);
    }
});

mp.events.addRemoteCounted('server:user:askDatingToPlayerIdYes', (player, playerRemoteId, name, nameAnswer) => {
    if (!user.isLogin(player))
        return;
    let remotePlayer = mp.players.at(playerRemoteId);
    if (user.isLogin(remotePlayer)) {

        if (methods.distanceToPos(remotePlayer.position, player.position) > 3) {
            player.notify('~r~Вы слишком далеко');
            return;
        }

        mysql.executeQuery(`DELETE FROM user_dating WHERE user_id = '${user.getId(player)}' AND user_owner = '${user.getId(remotePlayer)}'`);
        mysql.executeQuery(`DELETE FROM user_dating WHERE user_id = '${user.getId(remotePlayer)}' AND user_owner = '${user.getId(player)}'`);

        user.achiveDoneAllById(player, 10);
        user.achiveDoneAllById(remotePlayer, 10);

        user.achiveDoneDailyById(player, 13);
        user.achiveDoneDailyById(remotePlayer, 13);

        setTimeout(function () {
            if (!user.isLogin(remotePlayer) || !user.isLogin(player))
                return;
            mysql.executeQuery(`INSERT INTO user_dating (user_owner, user_id, user_name) VALUES ('${user.getId(remotePlayer)}', '${user.getId(player)}', '${nameAnswer}')`);
            mysql.executeQuery(`INSERT INTO user_dating (user_owner, user_id, user_name) VALUES ('${user.getId(player)}', '${user.getId(remotePlayer)}', '${name}')`);
        }, 5000);

        user.setDating(player, user.getId(remotePlayer), name);
        user.setDating(remotePlayer, user.getId(player), nameAnswer);
    }
});

mp.events.addRemoteCounted('server:user:askDiceToPlayerIdYes', (player, playerRemoteId, sum) => {
    if (!user.isLogin(player))
        return;
    let remotePlayer = mp.players.at(playerRemoteId);
    if (user.isLogin(remotePlayer)) {

        if (methods.distanceToPos(remotePlayer.position, player.position) > 3) {
            player.notify('~r~Вы слишком далеко');
            return;
        }

        if (user.getCashMoney(remotePlayer) < sum) {
            remotePlayer.notify('~y~У вас нет при себе денег на ставку');
            return;
        }
        if (user.getCashMoney(player) < sum) {
            player.notify('~y~У вас нет при себе денег на ставку');
            return;
        }

        let generateTarget = methods.getRandomInt(1, 7);
        let generatePlayer = methods.getRandomInt(1, 7);

        chat.sendDiceCommandNumber(player, generatePlayer);
        chat.sendDiceCommandNumber(remotePlayer, generateTarget);

        if (generateTarget > generatePlayer) {
            user.addCashMoney(remotePlayer, sum, 'Победа в кости');
            user.removeCashMoney(player, sum, 'Проигрыш в кости');
            remotePlayer.notify('~g~Вы выиграли ' + methods.moneyFormat(sum));
            player.notify('~y~Вы проиграли ' + methods.moneyFormat(sum));
        }
        else if (generateTarget < generatePlayer) {
            user.addCashMoney(player, sum, 'Победа в кости');
            user.removeCashMoney(remotePlayer, sum, 'Проигрыш в кости');
            player.notify('~g~Вы выиграли ' + methods.moneyFormat(sum));
            remotePlayer.notify('~y~Вы проиграли ' + methods.moneyFormat(sum));
        }
        else {
            player.notify('~y~Вы сыграли в ничью');
            remotePlayer.notify('~y~Вы сыграли в ничью');
        }
    }
});

mp.events.addRemoteCounted('server:houses:teleport', (player, id) => {
    user.teleport(player, houses.get(id, 'x'), houses.get(id, 'y'), houses.get(id, 'z'), houses.get(id, 'rot'));
});

mp.events.addRemoteCounted('server:houses:insert', (player, interior, number, price, zone, street) => {
    houses.insert(player, number, street, zone, player.position.x, player.position.y, player.position.z, player.heading, interior, price);
});

mp.events.addRemoteCounted('server:houses:insert1', (player, id, int) => {
    if (player.vehicle)
        houses.insert1(player, id, int, player.vehicle.position.x, player.vehicle.position.y, player.vehicle.position.z, player.vehicle.heading);
    else
        houses.insert1(player, id, int, player.position.x, player.position.y, player.position.z, player.heading);
});

mp.events.addRemoteCounted('server:houses:insert2', (player, id, int) => {
    if (player.vehicle)
        houses.insert2(player, id, int, player.vehicle.position.x, player.vehicle.position.y, player.vehicle.position.z, player.vehicle.heading);
    else
        houses.insert2(player, id, int, player.position.x, player.position.y, player.position.z, player.heading);
});

mp.events.addRemoteCounted('server:houses:insert3', (player, id, int) => {
    if (player.vehicle)
        houses.insert3(player, id, int, player.vehicle.position.x, player.vehicle.position.y, player.vehicle.position.z, player.vehicle.heading);
    else
        houses.insert3(player, id, int, player.position.x, player.position.y, player.position.z, player.heading);
});

mp.events.addRemoteCounted('server:stocks:insert', (player, interior, number, price, zone, street) => {
    stocks.insert(player, number, street, zone, player.position.x, player.position.y, player.position.z, player.heading, interior, price);
});

mp.events.addRemoteCounted('server:stocks:insert2', (player, id) => {
    if (player.vehicle)
        stocks.insert2(player, id, player.vehicle.position.x, player.vehicle.position.y, player.vehicle.position.z, player.vehicle.heading);
    else
        stocks.insert2(player, id, player.position.x, player.position.y, player.position.z, player.heading);
});

mp.events.addRemoteCounted('server:condo:insert', (player, numberBig, number, price, interior, zone, street) => {
    condos.insert(player, number, numberBig, street, zone, player.position.x, player.position.y, player.position.z, player.heading, interior, price);
});

mp.events.addRemoteCounted('server:condo:insertBig', (player, number, zone, street) => {
    condos.insertBig(player, number, street, zone, player.position.x, player.position.y, player.position.z);
});

mp.events.addRemoteCounted('server:user:getPlayerPos', (player) => {
    console.log(`PlayerPos: ${player.position.x}, ${player.position.y}, ${player.position.z - 1}, ${player.heading}`);
    methods.saveFile('plPos', `[${player.position.x}, ${player.position.y}, ${player.position.z - 1}, ${player.heading}],`);
});

mp.events.addRemoteCounted('server:saveAllAcc', (player) => {
    if (user.isAdmin(player)) {
        methods.saveAllUser();
    }
});

mp.events.addRemoteCounted('server:saveAll', (player) => {
    if (user.isAdmin(player)) {
        methods.saveAllAnother();
    }
});

mp.events.addRemoteCounted('server:user:getPlayerPos2', (player, pos) => {
    console.log(`PlayerPos: ${player.position.x}, ${player.position.y}, ${player.position.z - 1}, ${player.heading}`);
    methods.saveFile('plPos', `${pos}, ${player.position.x}, ${player.position.y}, ${player.position.z - 1}, ${player.heading}`);
});

mp.events.addRemoteCounted('server:user:getPlayerPosNpc', (player, d, a, f) => {
    console.log(`PlayerPos: ${player.position.x}, ${player.position.y}, ${player.position.z}, ${player.heading}`);
    methods.saveFile('npcPos', `npc.create(mp.game.joaat("s_m_m_security_01"), new mp.Vector3(${player.position.x}, ${player.position.y}, ${player.position.z}), ${player.heading}, 0, '', '${d}', '${a}', ${f}, 0);`);
});

mp.events.addRemoteCounted('server:user:getVehPos', (player) => {
    if (player.vehicle)
        methods.saveFile('vehPos', `["${methods.getVehicleInfo(player.vehicle.model).display_name}", ${player.vehicle.position.x}, ${player.vehicle.position.y}, ${player.vehicle.position.z}, ${player.vehicle.heading}],`)
});

mp.events.addRemoteCounted('server:sendAsk', (player, message) => {
    if (!user.isLogin(player))
        return;
    if (message === undefined || message === 'undefined')
        return;
    player.outputChatBoxNew(`[${chat.getTime()}] !{#FFC107}Вопрос ${user.getRpName(player)} (${player.id}):!{#FFFFFF} ${message}`);
    mp.players.forEach(function (p) {
        if (!user.isLogin(p))
            return;
        if (user.isHelper(p))
            p.outputChatBoxNew(`[${chat.getTime()}] !{#FFC107}Вопрос от ${user.getRpName(player)} (${player.id}):!{#FFFFFF} ${message}`);
    });
    methods.saveLog('log_chat', ['text'], [`HELPER: ${user.getRpName(player)} (${user.getId(player)}): ${methods.removeQuotes(methods.removeQuotes2(message))}`]);
});

mp.events.addRemoteCounted('server:sendReport', (player, message) => {
    if (!user.isLogin(player))
        return;

    if (message === undefined || message === 'undefined')
        return;

    player.outputChatBoxNew(`[${chat.getTime()}] !{#f44336}Жалоба ${user.getRpName(player)} (${player.id}):!{#FFFFFF} ${message}`);
    mp.players.forEach(function (p) {
        if (!user.isLogin(p))
            return;
        if (user.isAdmin(p) && !user.get(p, 'status_rp')) {
            if (user.get(player, 'status_media') > 0)
                p.outputChatBoxNew(`[${chat.getTime()}] !{#3F51B5}[MEDIA] Жалоба от ${user.getRpName(player)} (${player.id}):!{#FFFFFF} ${message}`);
            else
                p.outputChatBoxNew(`[${chat.getTime()}] !{#f44336}Жалоба от ${user.getRpName(player)} (${player.id}):!{#FFFFFF} ${message}`);
        }
    });
    methods.saveLog('log_chat', ['text'], [`REPORT: ${user.getRpName(player)} (${user.getId(player)}): ${methods.removeQuotes(methods.removeQuotes2(message))}`]);
});

mp.events.addRemoteCounted('server:sendAnswerAsk', (player, id, msg) => {
    if (!user.isLogin(player))
        return;
    if (msg === undefined || msg === 'undefined')
        return;
    mp.players.forEach(function (p) {
        if (!user.isLogin(p))
            return;
        if (user.isHelper(p))
            p.outputChatBoxNew(`[${chat.getTime()}] !{#FBC02D}Ответ от хелпера ${user.getRpName(player)} игроку ${id}:!{#FFFFFF} ${msg}`);
        if (p.id != id)
            return;
        p.outputChatBoxNew(`[${chat.getTime()}] !{#FFC107}Ответ от хелпера ${user.getRpName(player)}:!{#FFFFFF} ${msg}`);
        //methods.saveLog('AnswerAsk', `${user.getRpName(player)} (${user.getId(player)}) to ${id}: ${msg}`);
        user.set(player, 'count_hask', user.get(player, 'count_hask') + 1);

        p.call('client:mainMenu:addAsk', [msg, `${user.getRpName(player)} (${player.id})`]);

        let money = (msg.length / 2) * user.get(player, 'helper_level');
        player.notify(`~g~Вы получили премию за ответ на вопрос ~s~${methods.moneyFormat(money)}`);
        user.addCashMoney(player, money, `Ответ на вопрос (${methods.removeQuotes(methods.removeQuotes2(msg)).substring(0, 230)})`)
        methods.saveLog('log_chat', ['text'], [`HELPER ASK: ${user.getRpName(player)} (${user.getId(player)}) to ${user.getRpName(p)} (${user.getId(p)}): ${methods.removeQuotes(methods.removeQuotes2(msg))}`]);
    });
});

mp.events.addRemoteCounted('server:sendAnswerReport', (player, id, msg) => {
    if (!user.isLogin(player))
        return;
    if (msg === undefined || msg === 'undefined')
        return;
    mp.players.forEach(function (p) {
        if (!user.isLogin(p))
            return;
        if (user.isAdmin(p))
            p.outputChatBoxNew(`[${chat.getTime()}] !{#d32f2f}Ответ от администратора ${user.getRpName(player)} игроку ${id}:!{#FFFFFF} ${msg}`);
        if (p.id != id)
            return;
        p.call('client:mainMenu:addReport', [msg, `${user.getRpName(player)} (${player.id})`]);
        p.outputChatBoxNew(`[${chat.getTime()}] !{#f44336}Ответ от администратора ${user.getRpName(player)}:!{#FFFFFF} ${msg}`);
        //methods.saveLog('AnswerReport', `${user.getRpName(player)} (${user.getId(player)}) to ${id}: ${msg}`);
        user.set(player, 'count_aask', user.get(player, 'count_aask') + 1);
        methods.saveLog('log_chat', ['text'], [`REPORT ASK: ${user.getRpName(player)} (${user.getId(player)}) to ${user.getRpName(p)} (${user.getId(p)}): ${methods.removeQuotes(methods.removeQuotes2(msg))}`]);
    });
});

mp.events.addRemoteCounted('server:admin:spawnVeh', (player, vName) => {
    try {
        if (user.isAdmin(player)) {
            let v = vehicles.spawnCar(player.position, player.heading, vName, undefined, player.dimension);
            user.putInVehicle(player, v, -1);
            v.setVariable('isAdmin', true);
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:admin:changeWeather', (player, w) => {
    try {
        if (user.isAdmin(player)) {
            weather.changeWeather(w);
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:startSpecMission', (player) => {
    try {
        if (user.isAdmin(player)) {
            let v = vehicles.spawnCar(player.position, player.heading, 'rcbandito');
            user.putInVehicle(player, v, -1);
            v.alpha = 0;
            v.locked = true;
            v.addAttachment('spec1');

            setTimeout(function () { try { v.alpha = 0;} catch (e) {} }, 100);
            setTimeout(function () { try { v.alpha = 0;} catch (e) {} }, 500);
            setTimeout(function () {
                try {
                    mp.players.callInRange(v.position, 200, "vSync:Sound", [v.id]);
                    v.setVariable('markAsDrone', true);
                    v.setVariable('fraction_id', user.get(player, 'fraction_id'));
                    v.setVariable('dispatchMarked', 'X-' + player.remoteId);
                }
                catch (e) {

                }
            }, 1000)
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:startSpecMissionLspd', (player, vId) => {
    try {
        if (user.isLogin(player)) {

            let canUse = 0;
            mp.vehicles.forEach(v => {
                if (v.getVariable('riotId'))
                    canUse++;
            });

            if (canUse >= 3) {
                player.notify('~r~Доступно только 3 дрона одновременно');
                return;
            }
            
            player.call('client:drone:status', [true]);

            let v = vehicles.spawnCar(player.position, player.heading, 'rcbandito');
            user.putInVehicle(player, v, -1);
            v.alpha = 0;
            v.locked = true;
            v.addAttachment('spec1');

            let riot = mp.vehicles.at(vId);

            setTimeout(function () { try { v.alpha = 0;} catch (e) {} }, 100);
            setTimeout(function () { try { v.alpha = 0;} catch (e) {} }, 500);
            setTimeout(function () {
                try {
                    mp.players.callInRange(v.position, 200, "vSync:Sound", [v.id]);
                    v.setVariable('markAsDrone', true);
                    if (mp.vehicles.exists(riot))
                        v.setVariable('riotId', vehicles.getNumberPlate(riot));
                }
                catch (e) {

                }
            }, 1000)
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:startSpecMissionSmall', (player, vId) => {
    try {
        if (user.isLogin(player)) {

            let canUse = 0;
            mp.vehicles.forEach(v => {
                if (v.getVariable('riotId2'))
                    canUse++;
            });

            if (canUse >= 2) {
                player.notify('~r~Доступно только 2 дрона одновременно');
                return;
            }

            player.call('client:drone:status', [true]);

            let v = vehicles.spawnCar(player.position, player.heading, 'rcbandito');
            user.putInVehicle(player, v, -1);
            v.alpha = 0;
            v.locked = true;
            v.addAttachment('spec2');

            let riot = mp.vehicles.at(vId);

            setTimeout(function () { try { v.alpha = 0;} catch (e) {} }, 100);
            setTimeout(function () { try { v.alpha = 0;} catch (e) {} }, 500);
            setTimeout(function () {
                try {
                    mp.players.callInRange(v.position, 200, "vSync:Sound", [v.id]);
                    v.setVariable('markAsDrone', true);
                    if (mp.vehicles.exists(riot))
                        v.setVariable('riotId2', vehicles.getNumberPlate(riot));
                }
                catch (e) {

                }
            }, 1000)
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:stopSpecMission', (player) => {
    try {
        if (user.isLogin(player))
            vehicles.respawn(player.vehicle);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:stopSpecMissionLspd', (player) => {
    try {
        if (user.isLogin(player)) {
            mp.vehicles.forEach(v => {
                if (player.vehicle.getVariable('riotId') === v.numberPlate)
                {
                    let pos = v.position;
                    user.teleport(player, pos.x + 2, pos.y + 2, pos.z)
                }
                if (player.vehicle.getVariable('riotId2') === v.numberPlate)
                {
                    let pos = v.position;
                    user.teleport(player, pos.x + 2, pos.y + 2, pos.z)
                }
            });
            vehicles.respawn(player.vehicle);
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:admin:gangZone:editPos', (player, id) => {
    if (!user.isAdmin(player))
        return;
    try {
        let pos = player.position;
        gangWar.set(id, 'x', pos.x);
        gangWar.set(id, 'y', pos.y);
        gangWar.set(id, 'z', pos.z);
        mysql.executeQuery("UPDATE gang_war SET x = '" + pos.x + "', y = '" + pos.y + "', z = '" + pos.z + "' where id = '" + id + "'");
        player.notify('~b~Координаты были обновлены');
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:admin:gangZone:edit', (player, id, key, val) => {
    if (!user.isAdmin(player))
        return;
    try {
        let pos = player.position;
        gangWar.set(id, key, val);
        if (key === 'timestamp' && val === 0)
            gangWar.set(id, 'canWar', false);
        if (key === 'fraction_id')
            gangWar.changeZoneColor(id, val);
        mysql.executeQuery("UPDATE gang_war SET " + key + " = '" + val + "' where id = '" + id + "'");
        player.notify(`~b~Значение ${key} было обновлено на ${val}`);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:admin:canabisZone:editPos', (player, id) => {
    if (!user.isAdmin(player))
        return;
    try {
        let pos = player.position;
        canabisWar.set(id, 'x', pos.x);
        canabisWar.set(id, 'y', pos.y);
        canabisWar.set(id, 'z', pos.z);
        mysql.executeQuery("UPDATE gang_war_2 SET x = '" + pos.x + "', y = '" + pos.y + "', z = '" + pos.z + "' where id = '" + id + "'");
        player.notify('~b~Координаты были обновлены');
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:admin:canabisZone:edit', (player, id, key, val) => {
    if (!user.isAdmin(player))
        return;
    try {
        let pos = player.position;
        canabisWar.set(id, key, val);
        if (key === 'timestamp' && val === 0)
            canabisWar.set(id, 'canWar', false);
        if (key === 'fraction_id')
            canabisWar.changeZoneColor(id, val);
        mysql.executeQuery("UPDATE gang_war_2 SET " + key + " = '" + val + "' where id = '" + id + "'");
        player.notify(`~b~Значение ${key} было обновлено на ${val}`);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:admin:vehicleSpeedBoost', (player, vName, num) => {
    if (!user.isAdmin(player))
        return;
    try {

        mysql.executeQuery(`UPDATE veh_info SET sb = '${num}' WHERE display_name = '${vName}'`);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:admin:vehicleSpeedMax', (player, vName, num) => {
    if (!user.isAdmin(player))
        return;
    try {

        mysql.executeQuery(`UPDATE veh_info SET sm = '${num}' WHERE display_name = '${vName}'`);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:admin:giveLeader', (player, type, id, listIndex) => {
    admin.giveLeader(player, type, id, listIndex);
});

mp.events.addRemoteCounted('server:admin:blacklist', (player, type, id, reason) => {
    admin.blacklist(player, type, id, reason);
});

mp.events.addRemoteCounted('server:admin:kick', (player, type, id, reason) => {
    admin.kick(player, type, id, reason);
});

mp.events.addRemoteCounted('server:admin:unban', (player, type, id, reason) => {
    admin.unban(player, type, id, reason);
});

mp.events.addRemoteCounted('server:admin:warn', (player, type, id, reason) => {
    admin.warn(player, type, id, reason);
});

mp.events.addRemoteCounted('server:admin:unwarn', (player, type, id, reason) => {
    admin.unwarn(player, type, id, reason);
});

mp.events.addRemoteCounted('server:admin:untimer', (player, type, id, reason) => {
    admin.untimer(player, type, id, reason);
});

mp.events.addRemoteCounted('server:admin:ban', (player, type, id, idx, reason) => {
    admin.ban(player, type, id, idx, reason);
});

mp.events.addRemoteCounted('server:admin:jail', (player, type, id, idx, reason) => {
    admin.jail(player, type, id, idx, reason);
});

mp.events.addRemoteCounted('server:admin:setHpById', (player, type, id, num) => {
    admin.setHpById(player, type, id, num);
});

mp.events.addRemoteCounted('server:admin:setArmorById', (player, type, id, num) => {
    admin.setArmorById(player, type, id, num);
});

mp.events.addRemoteCounted('server:admin:setSkinById', (player, type, id, skin) => {
    admin.setSkinById(player, type, id, skin);
});

mp.events.addRemoteCounted('server:admin:resetSkinById', (player, type, id) => {
    admin.resetSkinById(player, type, id);
});

mp.events.addRemoteCounted('server:admin:adrenalineById', (player, type, id) => {
    admin.adrenalineById(player, type, id);
});

mp.events.addRemoteCounted('server:admin:freeHospById', (player, type, id) => {
    admin.freeHospById(player, type, id);
});

mp.events.addRemoteCounted('server:admin:changeDimension', (player, type, id, dim) => {
    admin.changeDimension(player, type, id, dim);
});

mp.events.addRemoteCounted('server:admin:getDimension', (player, type, id) => {
    admin.getDimension(player, type, id);
});

mp.events.addRemoteCounted('server:admin:tptoid', (player, type, id) => {
    admin.tpToUser(player, type, id);
});

mp.events.addRemoteCounted('server:admin:tptome', (player, type, id) => {
    admin.tpToAdmin(player, type, id);
});

mp.events.addRemoteCounted('server:admin:tptov', (player, id) => {
    try {
        if (!user.isAdmin(player))
            return;
        let v = mp.vehicles.at(id);
        if (vehicles.exists(v)) {
            let pos = player.position;
            v.position = pos;

            let vehInfo = methods.getVehicleInfo(v.model);
            methods.saveLog('log_admin', ['name', 'type', 'do'], [`${user.getRpName(player)}`, 'VEH_TP_TO_ADMIN', `${v.numberPlate} | ${vehInfo.display_name} | ${v.id} | ${methods.parseInt(pos.x)} | ${methods.parseInt(pos.y)} | ${methods.parseInt(pos.z)}`]);
        }
    }
    catch (e) {

    }
});

mp.events.addRemoteCounted('server:admin:inviteMp', (player) => {
    admin.inviteMp(player);
});

mp.events.addRemoteCounted('server:ems:removeObject', (player, id) => {
    try {

        try {
            user.addMoney(player, 200);
            user.sendSmsBankOperation(player, `Зачисление премии ${methods.moneyFormat(200)}`);
        }
        catch (e) {
            
        }
        
        ems.removeObject(id);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:ems:attachObject', (player, id) => {
    try {
        ems.attachObject(player, id);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:ems:vehicleUnload', (player) => {
    try {
        ems.vehicleUnload(player);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:usmc:vehicleUnload', (player) => {
    try {
        if (!user.isLogin(player))
            return;

        if (methods.distanceToPos(player.position, new mp.Vector3(-1802.54638671875, 3097.65625, 33.18984603881836)) > 30) {
            player.notify('~g~Разгрузить можно только в специальном месте, маркер был поставлен в GPS');
            user.setWaypoint(player, -1802.54638671875, 3097.65625);
            return;
        }

        let v = player.vehicle;
        if (vehicles.exists(v)) {
            v.setVariable('cargoId', undefined);
            v.setVariable('box', undefined);
            player.notify('~g~Вы разгрузили транспорт. Вам была выдана премия в $1000');
            user.addRep(player, 10);
            user.addMoney(player, 1000, 'Премия USMC');
            coffer.addMoney(coffer.getIdByFraction(4), 500000);

            mp.players.forEach(p => {
                if (user.isUsmc(p)) {
                    user.addMoney(player, 5000, 'Премия USMC');
                    player.notify('~g~Вам была выдана премия в размере $5000, за доставленный грузовик');
                }
            })
        }
        else {
            player.notify('~r~Рядом с вами нет транспорта')
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:business:buy', (player, id) => {
    if (!user.isLogin(player))
        return;
    business.buy(player, id);
});

mp.events.addRemoteCounted('server:business:sell', (player) => {
    if (!user.isLogin(player))
        return;
    business.sell(player);
});

mp.events.addRemoteCounted('server:business:log', (player, id) => {
    if (!user.isLogin(player))
        return;
    mysql.executeQuery(`SELECT * FROM log_business WHERE business_id = ${methods.parseInt(id)} ORDER BY id DESC LIMIT 70`, function (err, rows, fields) {
        try {
            let list = [];
            rows.forEach(function(item) {

                let price = item['price'];
                if (item['price'] < 0)
                    price = '~r~' + methods.moneyFormat(item['price']);
                else
                    price = '~g~' + methods.moneyFormat(item['price']);

                list.push({id: item['id'], product: item['product'], price: price, timestamp: item['timestamp'], rp_datetime: item['rp_datetime']});
            });
            player.call('client:showBusinessLogMenu', [JSON.stringify(list)]);
        }
        catch (e) {
            methods.debug(e);
        }
    });
});

mp.events.addRemoteCounted('server:discord:sendWorkGov', (player, dscrd, text) => {
    if (!user.isLogin(player))
        return;
    discord.sendWork(discord.workGov, player, dscrd, text);
});

mp.events.addRemoteCounted('server:discord:sendWorkEms', (player, dscrd, text) => {
    if (!user.isLogin(player))
        return;
    discord.sendWork(discord.workEms, player, dscrd, text);
});

mp.events.addRemoteCounted('server:discord:sendWorkNews', (player, dscrd, text) => {
    if (!user.isLogin(player))
        return;
    discord.sendWork(discord.workNews, player, dscrd, text);
});

mp.events.addRemoteCounted('server:discord:sendWorkBcsd', (player, dscrd, text) => {
    if (!user.isLogin(player))
        return;
    discord.sendWork(discord.workBcsd, player, dscrd, text);
});

mp.events.addRemoteCounted('server:discord:sendWorkLspd', (player, dscrd, text) => {
    if (!user.isLogin(player))
        return;
    discord.sendWork(discord.workLspd, player, dscrd, text);
});

mp.events.addRemoteCounted('server:discord:sendWorkUsmc', (player, dscrd, text) => {
    if (!user.isLogin(player))
        return;
    discord.sendWork(discord.workUsmc, player, dscrd, text);
});

mp.events.addRemoteCounted('server:invader:sendNews', (player, title, text) => {
    if (!user.isLogin(player))
        return;

    title = methods.removeQuotes(title);
    text = methods.removeQuotes(methods.replaceAll(text, '"', '`'));
    let name = methods.removeQuotes(user.getRpName(player));

    let rpDateTime = weather.getRpDateTime();
    let timestamp = methods.getTimeStamp();

    let textRemove = methods.replaceAllGtaSymb(text);

    mysql.executeQuery(`INSERT INTO rp_inv_news (title, name, text, timestamp, rp_datetime) VALUES ('${title}', '${name}', '${textRemove}', '${timestamp}', '${rpDateTime}')`);

    discord.sendNews(title, textRemove, name, player.socialClub);

    mp.players.forEach(p => {
        user.sendPhoneNotify(p, 'Life Invader', title, text, 'CHAR_LIFEINVADER');
    });
});

mp.events.addRemoteCounted('server:invader:delNews', (player, id) => {
    if (!user.isLogin(player))
        return;

    mysql.executeQuery(`DELETE FROM rp_inv_news WHERE id = ${methods.parseInt(id)}`);
    player.notify('~b~Вы удалили новость #' + id);
});

mp.events.addRemoteCounted('server:invader:getNewsList', (player) => {
    if (!user.isLogin(player))
        return;
    mysql.executeQuery(`SELECT * FROM rp_inv_news ORDER BY id DESC LIMIT 30`, function (err, rows, fields) {
        try {
            let list = [];
            rows.forEach(function(item) {
                list.push({id: item['id'], title: item['title'], name: item['name'], text: item['text']});
            });
            player.call('client:showInvaderNewsMenu', [JSON.stringify(list)]);
        }
        catch (e) {
            methods.debug(e);
        }
    });
});

mp.events.addRemoteCounted('server:invader:sendAd', (player, id, title, name, text, phone) => {
    if (!user.isLogin(player))
        return;

    title = methods.removeQuotes(methods.replaceAll(title, '"', '`'));
    text = methods.removeQuotes(methods.replaceAll(text, '"', '`'));
    name = methods.removeQuotes(name);
    phone = methods.removeQuotes(phone);
    let editor = methods.removeQuotes(user.getRpName(player));

    let rpDateTime = weather.getRpDateTime();
    let timestamp = methods.getTimeStamp();

    let textRemove = methods.replaceAllGtaSymb(text);

    mysql.executeQuery(`DELETE FROM rp_inv_ad_temp WHERE id = ${methods.parseInt(id)}`);
    mysql.executeQuery(`INSERT INTO rp_inv_ad (title, name, text, phone, editor, timestamp, rp_datetime) VALUES ('${title}', '${name}', '${textRemove}', '${phone}', '${editor}', '${timestamp}', '${rpDateTime}')`);

    user.addPayDayMoney(player, 300, 'Отредактировал объявление');
    player.notify('~g~Вы получили премию в $300 за отредактированное объявление');

    discord.sendAd(title, name, textRemove, methods.phoneFormat(phone), editor, player.socialClub);

    mp.players.forEach(p => {
        user.sendPhoneNotify(p, 'Life Invader', '~g~Реклама | ' + title, text, 'CHAR_LIFEINVADER');
    });
});

mp.events.addRemoteCounted('server:invader:delAd', (player, id) => {
    if (!user.isLogin(player))
        return;

    user.addPayDayMoney(player, 100, 'Отредактировал объявление');

    mysql.executeQuery(`DELETE FROM rp_inv_ad WHERE id = ${methods.parseInt(id)}`);
    player.notify('~b~Вы удалили объявление #' + id);
    player.notify('~g~Вы получили премию в $100 за отредактированное объявление');
});

mp.events.addRemoteCounted('server:invader:delAdT', (player, id) => {
    if (!user.isLogin(player))
        return;

    user.addPayDayMoney(player, 100, 'Отредактировал объявление');

    mysql.executeQuery(`DELETE FROM rp_inv_ad_temp WHERE id = ${methods.parseInt(id)}`);
    player.notify('~b~Вы удалили объявление #' + id);
    player.notify('~g~Вы получили премию в $100 за отредактированное объявление');
});

mp.events.addRemoteCounted('server:invader:getAdList', (player) => {
    if (!user.isLogin(player))
        return;
    mysql.executeQuery(`SELECT * FROM rp_inv_ad ORDER BY id DESC LIMIT 30`, function (err, rows, fields) {
        try {
            let list = [];
            rows.forEach(function(item) {
                list.push({id: item['id'], title: item['title'], name: item['name'], phone: item['phone'], editor: item['editor']});
            })

            player.call('client:showInvaderAdMenu', [JSON.stringify(list)]);
        }
        catch (e) {
            methods.debug(e);
        }
    });
});

mp.events.addRemoteCounted('server:invader:sendAdTemp', (player, text) => {
    if (!user.isLogin(player))
        return;

    if (user.getBankMoney(player) < 500) {
        user.sendSmsBankOperation(player, 'Не достаточно средств', 'Отказ операции');
        return;
    }

    text = methods.removeQuotes(methods.replaceAll(text, '"', '`'));
    let phone = methods.removeQuotes(user.get(player, 'phone'));
    let name = methods.removeQuotes(user.getRpName(player).split(' ')[0]);

    text = methods.replaceAllGtaSymb(text);
    text = methods.removeSpecialChars(text);

    user.achiveDoneAllById(player, 9);

    user.removeBankMoney(player, 500, 'Подача объявления');
    coffer.addMoney(8, 200);
    methods.saveFractionLog(
        'Система',
        `Рекламное объявление`,
        `Пополнение бюджета: ${methods.moneyFormat(200)}`,
        7
    );

    mysql.executeQuery(`INSERT INTO rp_inv_ad_temp (name, text, phone) VALUES ('${name}', '${text}', '${phone}')`);

    user.sendPhoneNotify(player, 'Life Invader', '~g~Реклама', 'Ваше объявление на рассмотрении', 'CHAR_LIFEINVADER');
});

mp.events.addRemoteCounted('server:invader:getAdTempList', (player) => {
    if (!user.isLogin(player))
        return;
    mysql.executeQuery(`SELECT * FROM rp_inv_ad_temp ORDER BY id DESC LIMIT 20`, function (err, rows, fields) {
        try {
            let list = [];
            rows.forEach(function(item) {

                list.push({id: item['id'], name: item['name'], phone: item['phone'], text: methods.removeSpecialChars(item['text'])});
            });
            player.call('client:showInvaderAdTempMenu', [JSON.stringify(list)]);
        }
        catch (e) {
            methods.debug(e);
        }
    });
});

mp.events.addRemoteCounted('server:invader:deleteAdTemp', (player, id) => {
    if (!user.isLogin(player))
        return;

    user.addPayDayMoney(player, 100, 'Удалил объявление #' + id);
    mysql.executeQuery(`DELETE FROM rp_inv_ad_temp WHERE id = ${methods.parseInt(id)}`);
});

mp.events.addRemoteCounted('server:events:showTypeListMenu', (player, type) => {
    if (!user.isLogin(player))
        return;
    mysql.executeQuery(`SELECT name, user_name, id, sc_alpha, sc_color, sc_font, interior FROM business WHERE type = ${type}`, function (err, rows, fields) {
        try {
            let resultData1 = new Map();
            let resultData2 = new Map();
            let resultData3 = new Map();
            rows.forEach(function(item) {
                if (item['price'] < 1) return;
                resultData1.set(methods.parseInt(item['id']), item['user_name']);
                resultData2.set(methods.parseInt(item['id']), item['name']);
                resultData3.set(methods.parseInt(item['id']), [item['interior'], item['sc_font'], item['sc_color'], item['sc_alpha']]);
            });
            player.call('client:showBusinessTypeListMenu', [Array.from(resultData1), Array.from(resultData2), Array.from(resultData3)]);
        }
        catch (e) {
            methods.debug(e);
        }
    });
});

mp.events.addRemoteCounted('server:coffer:addMoney', (player, id, money) => {
    coffer.addMoney(id, money);
});

mp.events.addRemoteCounted('server:coffer:removeMoney', (player, id, money) => {
    coffer.removeMoney(id, money);
});

mp.events.addRemoteCounted('server:coffer:setMoney', (player, id, money) => {
    coffer.setMoney(id, money);
});

mp.events.addRemoteCounted('server:business:addMoney', (player, id, money, itemName) => {
    business.addMoney(id, money, itemName);
});

mp.events.addRemoteCounted('server:business:removeMoney', (player, id, money, itemName) => {
    business.removeMoney(id, money, itemName);
});

mp.events.addRemoteCounted('server:business:setMoney', (player, id, money) => {
    business.setMoney(id, money);
});

mp.events.addRemoteCounted('server:business:addMoneyTax', (player, id, money) => {
    business.addMoneyTax(id, money);
});

mp.events.addRemoteCounted('server:business:removeMoneyTax', (player, id, money) => {
    business.removeMoneyTax(id, money);
});

mp.events.addRemoteCounted('server:business:setMoneyTax', (player, id, money) => {
    business.setMoneyTax(id, money);
});

mp.events.addRemoteCounted('server:fraction:addMoney', (player, id, money, itemName) => {
    fraction.addMoney(id, money, itemName);
});

mp.events.addRemoteCounted('server:fraction:removeMoney', (player, id, money, itemName) => {
    fraction.removeMoney(id, money, itemName);
});

mp.events.addRemoteCounted('server:fraction:setMoney', (player, id, money, itemName) => {
    fraction.setMoney(id, money, itemName);
});

mp.events.addRemoteCounted('server:fraction:save', (player, id) => {
    fraction.save(id);
});

mp.events.addRemoteCounted('server:family:addMoney', (player, id, money, itemName) => {
    family.addMoney(id, money, itemName);
});

mp.events.addRemoteCounted('server:family:removeMoney', (player, id, money, itemName) => {
    family.removeMoney(id, money, itemName);
});

mp.events.addRemoteCounted('server:family:setMoney', (player, id, money, itemName) => {
    family.setMoney(id, money, itemName);
});

mp.events.addRemoteCounted('server:family:save', (player, id) => {
    family.save(id);
});

mp.events.addRemoteCounted('server:family:create', (player, name) => {
    family.create(player, name);
});

mp.events.addRemoteCounted('server:user:addMoney', (player, money, text) => {
    user.addMoney(player, money, text);
});

mp.events.addRemoteCounted('server:user:removeMoney', (player, money, text) => {
    user.removeMoney(player, money, text);
});

mp.events.addRemoteCounted('server:user:setMoney', (player, money) => {
    user.setMoney(player, money);
});

mp.events.addRemoteCounted('server:user:addBankMoney', (player, money, text) => {
    user.addBankMoney(player, money, text);
});

mp.events.addRemoteCounted('server:user:removeBankMoney', (player, money, text) => {
    user.removeBankMoney(player, money, text);
});

mp.events.addRemoteCounted('server:user:setBankMoney', (player, money) => {
    user.setBankMoney(player, money);
});

mp.events.addRemoteCounted('server:user:addCashMoney', (player, money, text) => {
    user.addCashMoney(player, money, text);
});

mp.events.addRemoteCounted('server:user:removeCashMoney', (player, money, text) => {
    user.removeCashMoney(player, money, text);
});

mp.events.addRemoteCounted('server:user:setCashMoney', (player, money) => {
    user.setCashMoney(player, money);
});

mp.events.addRemoteCounted('server:user:addCryptoMoney', (player, money, text) => {
    user.addCryptoMoney(player, money, text);
});

mp.events.addRemoteCounted('server:user:removeCryptoMoney', (player, money, text) => {
    user.removeCryptoMoney(player, money, text);
});

mp.events.addRemoteCounted('server:user:setCryptoMoney', (player, money) => {
    user.setCryptoMoney(player, money);
});

mp.events.addRemoteCounted('server:user:addPayDayMoney', (player, money, text) => {
    user.addPayDayMoney(player, money, text);
});

mp.events.addRemoteCounted('server:user:removePayDayMoney', (player, money, text) => {
    user.removePayDayMoney(player, money, text);
});

mp.events.addRemoteCounted('server:user:setPayDayMoney', (player, money) => {
    user.setPayDayMoney(player, money);
});

mp.events.addRemoteCounted('server:user:addBonusMoney', (player, money) => {
    user.addBonusMoney(player, money);
});

mp.events.addRemoteCounted('server:user:addRep', (player, rep) => {
    user.addRep(player, rep);
});

mp.events.addRemoteCounted('server:user:removeRep', (player, rep) => {
    user.removeRep(player, rep);
});

mp.events.addRemoteCounted('server:user:setRep', (player, rep) => {
    user.setRep(player, rep);
});

mp.events.addRemoteCounted('server:user:addWorkExp', (player, rep) => {
    user.addWorkExp(player, rep);
});

mp.events.addRemoteCounted('server:user:removeWorkExp', (player, rep) => {
    user.removeWorkExp(player, rep);
});

mp.events.addRemoteCounted('server:user:setWorkExp', (player, rep) => {
    user.setWorkExp(player, rep);
});

mp.events.addRemoteCounted('server:business:save', (player, id) => {
    business.save(id);
});

mp.events.addRemoteCounted('server:changeWaypointPos', (player, x, y) => {
    if (!user.isLogin(player))
        return;
    if (!vehicles.exists(player.vehicle))
        return;

    player.vehicle.getOccupants().forEach((p) => {
        if (!user.isLogin(p))
            return;
        user.setWaypoint(p, x, y);
    });
});

mp.events.addRemoteCounted('server:uniform:gr6', (player) => {
    user.giveUniform(player, 99);
});

mp.events.addRemoteCounted('server:gr6:findPickup', (player, x, y, z) => {
    if (!user.isLogin(player))
        return;
    try {

        if (player.vehicle && player.seat == -1) {

            if (player.vehicle.getVariable('isStartDuty')) {
                player.notify('~r~Вы уже получили задание');
                return;
            }

            if (player.vehicle.getOccupants().length == 1) {
                player.notify('~b~Работать можно только с напарниками!');
            }
            else {
                let isStart = false;
                player.vehicle.getOccupants().forEach(function (p) {
                    try {
                        if (!user.isLogin(p))
                            return;
                        if (user.get(p, 'job') == 10) {
                            user.setWaypoint(p, x, y);

                            user.set(p, 'gr6', player.vehicle.id);

                            if (user.getRpName(p) == user.getRpName(player))
                                return;
                            p.notify('~b~Вы получили задание');
                            player.notify('~b~Напарник: ~s~ID: ' + p.id);
                            player.vehicle.setVariable('isStartDuty', true);

                            if (isStart)
                                return;
                            p.call('client:createGr6Checkpoint', [x, y, z]);
                            isStart = true;
                        }
                    }
                    catch (e) {
                        methods.debug(e);
                    }
                })
            }
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:gr6:dropCar', (player, money, vId) => {
    if (!user.isLogin(player))
        return;
    mp.vehicles.forEach(function (v) {
        try {
            if (vehicles.exists(v) && v.id == vId) {
                v.setVariable('isStartDuty', undefined);
                v.getOccupants().forEach(function (p) {
                    try {
                        if (!user.isLogin(p) || user.get(p, 'job') != 10)
                            return;

                        if (user.get(p, 'gr6') === v.id)
                            user.addWorkExp(p, 2);
                    }
                    catch (e) {
                        methods.debug(e);
                    }
                });
                v.setVariable('gr6Money', methods.parseFloat(v.getVariable('gr6Money') + money));
            }
        }
        catch (e) {
            methods.debug(e);
        }
    });
});

mp.events.addRemoteCounted('server:gr6:unload', (player) => {
    if (!user.isLogin(player))
        return;

    if (player.vehicle && player.seat == -1) {
        try {
            let v = player.vehicle;
            if (vehicles.exists(v)) {

                if (methods.parseInt(v.getVariable('gr6Money')) <= 1) {
                    player.notify('~r~В машине нет средств');
                    return;
                }

                let money = methods.parseFloat(v.getVariable('gr6Money') / 100);
                let countOcc = v.getOccupants().length;

                v.getOccupants().forEach(function (p) {
                    try {
                        if (!user.isLogin(p) || user.get(p, 'job') != 10)
                            return;

                        if (user.has(p, 'gr6') && user.get(p, 'gr6') === v.id) {
                            let currentMoney = methods.parseFloat(money / countOcc);

                            let desc = '';
                            if (user.get(p, 'vip_type') === 1) {
                                desc = '\n~y~Прибавка VIP LIGHT 5% от зарплаты';
                                money = money * 1.05;
                            }
                            if (user.get(p, 'vip_type') === 2) {
                                desc = '\n~y~Прибавка VIP HARD 10% от зарплаты';
                                money = money * 1.1;
                            }

                            let fId = user.get(p, 'family_id');
                            if (fId > 0) {
                                let fData = family.getData(fId);
                                if (fData.get('level') > 4) {
                                    currentMoney = currentMoney * 1.3;
                                    desc = '\n~y~Прибавка семьи 30% от зарплаты';
                                }
                                if (fData.get('level') > 5) {
                                    family.addMoney(fId, currentMoney * 0.3, 'Зачисление от работы инкассаторов');
                                }
                            }

                            user.addMoney(p, currentMoney, 'Зарплата инкассатора');
                            coffer.removeMoney(currentMoney + methods.parseFloat(currentMoney / 10));
                            p.notify('~g~Вы заработали: ~s~' + methods.moneyFormat(currentMoney) + desc);
                            user.reset(p, 'gr6');
                            user.giveJobSkill(p);

                            p.call('client:gr6:stop');

                            user.addRep(p, 50);
                            user.addWorkExp(p, 2);
                        }
                        else {
                            p.notify('~r~Вы не являетесь напарником ID: ' + player.id);
                            p.notify('~r~Зарплату вы не получили');
                        }
                    }
                    catch (e) {
                        methods.debug(e);
                    }
                });
                v.setVariable('gr6Money', 0);
            }
        }
        catch (e) {
            methods.debug(e);
        }
    }
});

mp.events.addRemoteCounted('server:gr6:delete', (player) => {
    if (!user.isLogin(player))
        return;
    try {
        let veh = player.vehicle;
        if (veh && player.seat == -1) {
            if (veh.getVariable('owner_id') == user.getId(player)) {
                user.showLoadDisplay(player);
                setTimeout(function () {
                    vehicles.respawn(veh);
                    setTimeout(function () {
                        try {
                            if (user.isLogin(player)) {
                                user.hideLoadDisplay(player);
                                user.addMoney(player, 4500, 'Возврат ТС инкассатора');
                                player.notify('~b~Вы вернули транспорт в гараж');
                            }
                        }
                        catch (e) {
                            methods.debug(e);
                        }
                    }, 500);
                }, 700);
            }
            else {
                player.notify('~r~Не вы арендовали, не вам сдавать.');
            }
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:gr6:grab', (player) => {
    if (!user.isLogin(player))
        return;
    try {
        if (player.vehicle && player.seat == -1) {
            if (player.vehicle.getVariable('job') == 10) {
                user.showLoadDisplay(player);
                let money = methods.parseFloat(player.vehicle.getVariable('gr6Money') / 90);
                setTimeout(function () {
                    vehicles.respawn(player.vehicle);
                    setTimeout(function () {
                        user.hideLoadDisplay(player);
                        user.addCryptoMoney(player, money / 1000, 'Ограбление');
                        player.notify('~b~Вы ограбили транспорт на сумму: ~s~' + methods.cryptoFormat(money / 1000));
                    }, 500);
                }, 700);
            }
            else {
                player.notify('~r~Это не инкассаторская машина');
            }
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:vehicles:spawnJobCar', (player, x, y, z, heading, name, job) => {

    user.showLoadDisplay(player);
    setTimeout(function () {

        try {
            vehicles.spawnJobCar(veh => {
                if (!vehicles.exists(veh))
                    return;
                user.putInVehicle(player, veh, -1);
                vehicles.set(veh.getVariable('container'), 'owner_id', user.getId(player));
                veh.setVariable('owner_id', user.getId(player));

                if (job === 99) {

                    veh.setVariable('taxi', true);
                    if (name === 'Dynasty') {
                        veh.setMod(10, 3);
                        veh.setColor(88, 0);
                    }
                    if (name === 'Issi3') {
                        veh.setMod(48, 2);
                        veh.setColor(88, 0);
                    }
                    if (name === 'Taxi') {
                        vSync.setExtraState(veh, methods.getRandomInt(3, 7));
                        veh.setColor(0, 88);
                    }
                }
                else {
                    veh.setVariable('job', job);
                }

            }, new mp.Vector3(x, y, z), heading, name, job);
        }
        catch (e) {
            methods.debug(e);
        }

        setTimeout(function () {
            user.hideLoadDisplay(player);
        }, 500);

    }, 500);
});

mp.events.addRemoteCounted('server:prolog:spawnVehicle', (player, name) => {
    try {

        mp.vehicles.forEachInDimension(player.id + 20000000, v => {
            try {
                v.destroy();
            }
            catch (e) {}
        });

        setTimeout(function () {
            try {
                vehicles.spawnJobCar(veh => {
                    if (!vehicles.exists(veh))
                        return;
                    try {
                        vehicles.set(veh.getVariable('container'), 'owner_id', user.getId(player));
                        veh.setVariable('owner_id', user.getId(player));
                        veh.prolog = true;
                        veh.broke = true;
                        veh.numberPlateType = 5;
                        vehicles.setFuel(veh, 0);
                        veh.dimension = player.id + 20000000;
                    }
                    catch (e) {}
                }, new mp.Vector3(3531.277587890625, -4672.951171875, 113.76799774169922), 251.60354614257812, name, 0);
            }
            catch (e) {}
        }, 100);
    }
    catch (e) {}
});

mp.events.addRemoteCounted('server:prolog:deleteVehicle', (player) => {
    try {
        player.vehicle.destroy();
    }
    catch (e) {}
});

mp.events.addRemoteCounted('server:vehicles:spawnLamarCar', (player, x, y, z, heading, name) => {

    user.showLoadDisplay(player);
    setTimeout(function () {

        try {
            vehicles.spawnCarCb(veh => {
                if (!vehicles.exists(veh))
                    return;
                user.putInVehicle(player, veh, -1);
                vehicles.set(veh.getVariable('container'), 'owner_id', user.getId(player));
                veh.setVariable('owner_id', user.getId(player));
                veh.setVariable('lamar', true);
                veh.locked = true;
                if (methods.getRandomInt(0, 100) < 5) {
                    try {
                        let rare = 0;
                        let boxRandom = stocks.boxList.filter((item) => { return item[7] === rare; });
                        veh.setVariable('box', JSON.stringify([boxRandom[methods.getRandomInt(0, boxRandom.length)][2]]));
                        veh.setVariable('cargoId', 999);
                    }
                    catch (e) {
                        methods.debug(e);
                    }
                }
            }, new mp.Vector3(x, y, z), heading, name);
        }
        catch (e) {
            methods.debug(e);
        }

        setTimeout(function () {
            user.hideLoadDisplay(player);
        }, 500);

    }, 500);
});

mp.events.addRemoteCounted('server:vehicles:destroy', (player) => {

    user.showLoadDisplay(player);
    setTimeout(function () {

        vehicles.respawn(player.vehicle);

        setTimeout(function () {
            user.hideLoadDisplay(player);
        }, 500);

    }, 500);
});

mp.events.addRemoteCounted('server:vehicles:addNew', (player, model, count) => {
    if (user.isAdmin(player)) {
        vehicles.addNew(model, count);
        player.notify('~g~Транспорт на авторынок был добавлен. Кол-во: ~s~' + count)
    }
});

mp.events.addRemoteCounted('server:vehicles:addNewFraction', (player, model, count, fractionId) => {
    if (user.isAdmin(player)) {
        let pos = player.vehicle.position;
        if (fractionId === 0)
            vehicles.addNewFraction(model, count, fractionId, 0, 0, 0, 0);
        else
            vehicles.addNewFraction(model, count, fractionId, pos.x, pos.y, pos.z, player.vehicle.heading);
        player.notify('~g~Транспорт на авторынок был добавлен. Кол-во: ~s~' + count)
    }
});

mp.events.addRemoteCounted('server:dispatcher:sendPos', (player, title, desc, x, y, z, withCoord, phone) => {
    dispatcher.sendPos(title, desc, new mp.Vector3(x, y, z), withCoord, phone);
});

mp.events.addRemoteCounted('server:dispatcher:sendTaxiPos', (player, title, desc, x, y, z, wx, wy, wz, price, phone) => {
    dispatcher.sendTaxiPos(title, desc, new mp.Vector3(x, y, z), new mp.Vector3(wx, wy, wz), price, phone);
});

mp.events.addRemoteCounted('server:dispatcher:sendMechPos', (player, title, desc, x, y, z, phone) => {
    dispatcher.sendMechPos(title, desc, new mp.Vector3(x, y, z), phone);
});

mp.events.addRemoteCounted('server:dispatcher:getTaxiMenu', (player) => {
    dispatcher.getTaxiMenu(player);
});

mp.events.addRemoteCounted('server:dispatcher:getMechMenu', (player) => {
    dispatcher.getMechMenu(player);
});

mp.events.addRemoteCounted('server:taxi:accept', (player, id) => {
    dispatcher.acceptTaxi(player, id);
});

mp.events.addRemoteCounted('server:mech:accept', (player, id) => {
    dispatcher.acceptMech(player, id);
});

mp.events.addRemoteCounted('server:dispatcher:sendLocalPos', (player, title, desc, x, y, z, fractionId, withCoord) => {
    dispatcher.sendLocalPos(title, desc, new mp.Vector3(x, y, z), fractionId, withCoord);
});

mp.events.addRemoteCounted('server:phone:call', (player, phone) => {
    if (!user.isLogin(player))
        return;

    try {
        
        if (player.getVariable('callId')) {
            player.notify('~r~Вы уже разговариваете');
            return;
        }
        
        let isFind = false;
        phone = methods.parseInt(phone);
        let text = '~r~Абонент не найден';
        mp.players.forEach(p => {
            if (user.isLogin(p) && methods.parseInt(user.get(p, 'phone')) === phone) {

                if (p.callWait || p.getVariable('callId')) {
                    text = '~r~Абонент уже разговаривает, перезвоните позже';
                    return;
                }

                isFind = true;
                player.notify('~b~Ожидайте когда абонент примет звонок');
                p.notify('~b~Вам поступил входящий вызов');
                p.call('client:phone:call:setCallByServer', [user.get(player, 'phone'), player.socialClub]);
                p.callWait = player.id;
            }
        });
        if (!isFind) {
            player.notify(text);
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:phone:accept', (player) => {
    if (!user.isLogin(player))
        return;

    try {
        if (player.callWait >= 0) {
            let target = mp.players.at(player.callWait);

            if (user.isLogin(target)) {
                target.setVariable('callId', player.id);
                player.setVariable('callId', target.id);
                target.call('client:phone:toCallPos');
                player.call('client:phone:toCallPos');
            }
            else {
                player.callWait = undefined;
                player.call('client:phone:hide');
                player.setVariable('callId', undefined);
                player.notify('~r~Вызов был отменен, абонент не в сети')
            }
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:phone:cancel', (player) => {
    if (!user.isLogin(player))
        return;

    try {
        if (player.callWait) {
            let target = mp.players.at(player.callWait);
            if (user.isLogin(target)) {
                target.setVariable('callId', undefined);
                target.call('client:phone:hide');
            }

            player.callWait = undefined;
            player.call('client:phone:hide');
            player.setVariable('callId', undefined);
        }
        else {
            mp.players.forEach(p => {
                if (user.isLogin(p) && p.callWait === player.id) {
                    p.callWait = undefined;

                    p.setVariable('callId', undefined);
                    player.setVariable('callId', undefined);

                    p.call('client:phone:hide');
                    player.call('client:phone:hide');
                }
            });
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:phone:editContact', (player, json) => {
    if (!user.isLogin(player))
        return;

    try {
        let contact = JSON.parse(json);
        methods.debug(json);
        mysql.executeQuery(`UPDATE phone_contact SET name = '${methods.removeQuotes(methods.removeQuotes2(contact.name))}', numbers = '${JSON.stringify(contact.numbers)}' WHERE id = '${contact.id}'`);
        player.notify('~y~Контакт отредактирован');
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:phone:favoriteContact', (player, json) => {
    if (!user.isLogin(player))
        return;

    try {
        let contact = JSON.parse(json);
        mysql.executeQuery(`UPDATE phone_contact SET is_fav = '${contact.isFavorite ? 0 : 1}' WHERE id = '${contact.id}'`);
        player.notify('~y~Контакт добавлен в избранное');
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:phone:deleteContact', (player, json) => {
    if (!user.isLogin(player))
        return;

    try {
        let contact = JSON.parse(json);
        mysql.executeQuery(`DELETE FROM phone_contact WHERE id = '${contact.id}'`);
        player.notify('~y~Контакт удалён');
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:phone:addContact', (player, json) => {
    if (!user.isLogin(player))
        return;

    try {
        let contact = JSON.parse(json);

        if (contact.name === '') {
            player.notify('~y~Поле "Имя" не заполнено');
            return;
        }

        mysql.executeQuery(`INSERT INTO phone_contact (phone, name, numbers) VALUES ('${user.get(player, 'phone')}', '${methods.removeQuotes(methods.removeQuotes2(contact.name))}', '${JSON.stringify(contact.numbers)}')`);
        player.notify('~g~Контакт был добавлен');
        setTimeout(function () {
            phone.updateContactList(player);
        }, 1000);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:phone:sendMessage', (player, phoneNumber, message) => {
    if (!user.isLogin(player))
        return;

    try {

        message = methods.removeQuotes(methods.removeQuotes2(message));

        let date = weather.getFullRpDate().replace('/', '.').replace('/', '.');

        mysql.executeQuery(`INSERT INTO phone_sms (number_from, number_to, text, date, time) VALUES ('${user.get(player, 'phone').toString()}', '${phoneNumber}', '${message}', '${date}', '${weather.getFullRpTime()}')`);

        mp.players.forEach(p => {
            if (user.isLogin(p) && user.get(p, 'phone_type') > 0 && user.get(p, 'phone') === methods.parseInt(phoneNumber)) {
                user.sendPhoneNotify(p, methods.phoneFormat(user.get(player, 'phone')), '~b~Новое сообщение', message);

                let msg = {
                    type: 'addMessengerMessage',
                    phone: user.get(player, 'phone').toString(),
                    text: message,
                    date: date,
                    time: weather.getFullRpTime() + ':00',
                };

                user.callCef(p, 'phone' + user.get(p, 'phone_type'), JSON.stringify(msg));
            }
        });

        /*mp.players.forEach(p => {
            if (user.isLogin(p) && user.get(player, 'phone').toString() === phoneNumber) {
                user.sendPhoneNotify(p, player, phoneNumber, message);
                //phone.selectChat(player, user.get(player, 'phone').toString(), chat);
            }
        });*/

    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:phone:sendMessageNumber', (player, numberFrom, phoneNumber, message) => {
    phone.sendMessageByNumber(numberFrom, phoneNumber, message);
});

mp.events.addRemoteCounted('server:phone:updateContactList', (player) => {
    phone.updateContactList(player);
});

mp.events.addRemoteCounted('server:phone:updateDialogList', (player) => {
    phone.updateDialogList(player);
});

mp.events.addRemoteCounted('server:phone:selectChat', (player, phoneNumber, chat) => {
    phone.selectChat(player, phoneNumber, chat);
});

mp.events.addRemoteCounted('server:phone:deleteChat', (player, phoneNumber) => {
    phone.deleteChat(player, phoneNumber);
});

mp.events.addRemoteCounted('server:phone:fractionList', (player) => {
    if (!user.isLogin(player))
        return;
    phone.fractionList(player);
});

mp.events.addRemoteCounted('server:phone:fractionLog', (player) => {
    if (!user.isLogin(player))
        return;
    phone.fractionLog(player);
});

mp.events.addRemoteCounted('server:phone:fractionLog2', (player) => {
    if (!user.isLogin(player))
        return;
    phone.fractionLog2(player);
});

mp.events.addRemoteCounted('server:phone:showGangList', (player) => {
    if (!user.isLogin(player))
        return;
    phone.showGangList(player);
});

mp.events.addRemoteCounted('server:phone:showGangWarList', (player) => {
    if (!user.isLogin(player))
        return;
    phone.showGangWarList(player);
});

mp.events.addRemoteCounted('server:phone:showCanabisList', (player) => {
    if (!user.isLogin(player))
        return;
    phone.showCanabisList(player);
});

mp.events.addRemoteCounted('server:phone:showCanabisWarList', (player) => {
    if (!user.isLogin(player))
        return;
    phone.showCanabisWarList(player);
});

mp.events.addRemoteCounted('server:phone:getShopGang', (player) => {
    if (!user.isLogin(player))
        return;
    fraction.getShopGang(player);
});

mp.events.addRemoteCounted('server:phone:attackStreet', (player, id) => {
    if (!user.isLogin(player))
        return;
    gangWar.startWar(player, id);
});

mp.events.addRemoteCounted('server:gangWar:addWar', (player, id, count, armorIndex, gunIndex, timeIndex) => {
    if (!user.isLogin(player))
        return;
    gangWar.addWar(player, id, count, armorIndex, gunIndex, timeIndex);
});

mp.events.addRemoteCounted('server:phone:attackCanabis', (player, id) => {
    if (!user.isLogin(player))
        return;
    canabisWar.startWar(player, id);
});

mp.events.addRemoteCounted('server:canabisWar:addWar', (player, id, count, armorIndex, gunIndex, timeIndex) => {
    if (!user.isLogin(player))
        return;
    canabisWar.addWar(player, id, count, armorIndex, gunIndex, timeIndex);
});

mp.events.addRemoteCounted('server:phone:fractionList2', (player) => {
    if (!user.isLogin(player))
        return;
    phone.fractionList2(player);
});

mp.events.addRemoteCounted('server:phone:fractionStList2', (player) => {
    if (!user.isLogin(player))
        return;
    phone.fractionList2(player, true);
});

mp.events.addRemoteCounted('server:phone:fractionListF', (player) => {
    if (!user.isLogin(player))
        return;
    phone.fractionListF(player);
});

mp.events.addRemoteCounted('server:phone:fractionStListF', (player) => {
    if (!user.isLogin(player))
        return;
    phone.fractionListF(player, true);
});

mp.events.addRemoteCounted('server:phone:fractionAll', (player) => {
    if (!user.isLogin(player))
        return;
    phone.fractionAll(player);
});

mp.events.addRemoteCounted('server:phone:fractionMoney', (player) => {
    if (!user.isLogin(player))
        return;
    phone.fractionMoney(player);
});

mp.events.addRemoteCounted('server:phone:fractionVehicles', (player) => {
    if (!user.isLogin(player))
        return;
    phone.fractionVehicles(player);
});

mp.events.addRemoteCounted('server:phone:fractionVehiclesBuyList', (player) => {
    if (!user.isLogin(player))
        return;
    phone.fractionVehiclesBuyList(player);
});

mp.events.addRemoteCounted('server:phone:fractionVehicles2', (player) => {
    if (!user.isLogin(player))
        return;
    phone.fractionVehicles2(player);
});

mp.events.addRemoteCounted('server:phone:fractionVehiclesBuyList2', (player) => {
    if (!user.isLogin(player))
        return;
    phone.fractionVehiclesBuyList2(player);
});

mp.events.addRemoteCounted('server:phone:fractionVehicleBuyInfo2', (player, id) => {
    if (!user.isLogin(player))
        return;
    phone.fractionVehicleBuyInfo2(player, id);
});

mp.events.addRemoteCounted('server:phone:userVehicleAppMenu', (player) => {
    if (!user.isLogin(player))
        return;
    phone.userVehicleAppMenu(player);
});

mp.events.addRemoteCounted('server:phone:userAdList', (player) => {
    if (!user.isLogin(player))
        return;
    phone.userAdList(player);
});

mp.events.addRemoteCounted('server:phone:userNewsList', (player) => {
    if (!user.isLogin(player))
        return;
    phone.userNewsList(player);
});

mp.events.addRemoteCounted('server:phone:bankHistory', (player) => {
    if (!user.isLogin(player))
        return;
    phone.bankHistory(player);
});

mp.events.addRemoteCounted('server:phone:userHistory', (player, id) => {
    if (!user.isLogin(player))
        return;
    phone.userHistory(player, id);
});

mp.events.addRemoteCounted('server:phone:userTickets', (player, id) => {
    if (!user.isLogin(player))
        return;
    phone.userTickets(player, id);
});

mp.events.addRemoteCounted('server:phone:openInvaderStatsList', (player, days) => {
    if (!user.isLogin(player))
        return;
    phone.openInvaderStatsList(player, days);
});

mp.events.addRemoteCounted('server:phone:changeBg', (player, id) => {
    if (!user.isLogin(player))
        return;
    phone.changeBg(player, id);
});

mp.events.addRemoteCounted('server:phone:createFraction', (player) => {
    if (!user.isLogin(player))
        return;
    phone.createFraction(player);
});

mp.events.addRemoteCounted('server:phone:buyFraction', (player, id) => {
    fraction.create(player, id);
});

mp.events.addRemoteCounted('server:phone:fractionVehicleBuyInfo', (player, id) => {
    if (!user.isLogin(player))
        return;
    phone.fractionVehicleBuyInfo(player, id);
});

mp.events.addRemoteCounted('server:phone:memberAction', (player, id) => {
    if (!user.isLogin(player))
        return;
    phone.memberAction(player, id);
});

mp.events.addRemoteCounted('server:phone:memberAction2', (player, id) => {
    if (!user.isLogin(player))
        return;
    phone.memberAction2(player, id);
});

mp.events.addRemoteCounted('server:phone:memberActionF', (player, id) => {
    if (!user.isLogin(player))
        return;
    phone.memberActionF(player, id);
});

mp.events.addRemoteCounted('server:phone:getUserInfo', (player, text) => {
    if (!user.isLogin(player))
        return;
    phone.getUserInfo(player, text);
});

mp.events.addRemoteCounted('server:phone:getVehInfo', (player, text) => {
    if (!user.isLogin(player))
        return;
    phone.getVehInfo(player, text);
});

mp.events.addRemoteCounted('server:phone:getGunInfo', (player, text) => {
    if (!user.isLogin(player))
        return;
    phone.getGunInfo(player, text);
});

mp.events.addRemoteCounted('server:user:askAnim', (player, id, animId) => {

    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    let target = mp.players.at(id);
    if (user.isLogin(target)) {
        if (target.id == player.id) {
            player.notify('~r~Ошибка');
            return;
        }

        if (methods.distanceToPos(target.position, player.position) > 5) {
            player.notify('~r~Вы слишком далеко друг от друга');
            return;
        }
        let desc = [
            'Игрок хочет поздороваться',
            'Игрок хочет поздороваться',
            'Игрок хочет дать пять',
            'Игрок хочет поцеловвать',
            'Игрок хочет минет',
            'Игрок хочет секс',
        ];
        target.call('client:menuList:showAskAnimMenu', [player.id, desc[animId], animId])
    }
    else {
        player.notify('~r~Игрок не найден');
    }
});

mp.events.addRemoteCounted('server:user:anim:accept', (player, id, animId) => {

    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    let target = mp.players.at(id);
    if (user.isLogin(target)) {

        if (methods.distanceToPos(target.position, player.position) > 5) {
            player.notify('~r~Вы слишком далеко друг от друга');
            return;
        }
        user.playAnimationWithUser(target, player, animId);
    }
    else {
        player.notify('~r~Игрок не найден');
    }
});


mp.events.addRemoteCounted('server:user:invite', (player, id) => {

    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    let target = mp.players.at(id);
    if (user.isLogin(target)) {
        if (target.id == player.id) {
            player.notify('~r~Здравствуйте, я хотел вставить сюда шутку, но я ее не придумал, в общем, как ты собрался самого себя принять в организацию в которой ты уже состоишь?');
            return;
        }

        if (methods.distanceToPos(target.position, player.position) > 5) {
            player.notify('~r~Вы слишком далеко друг от друга');
            return;
        }

        if (user.get(target, 'fraction_id') > 0 || user.get(target, 'fraction_id2') > 0) {
            player.notify('~r~Игрок уже состоит в организации');
            return;
        }

        target.call('client:menuList:showAskInviteMenu', [player.id, user.getFractionName(player)])
    }
    else {
        player.notify('~r~Игрок не найден');
    }
});

mp.events.addRemoteCounted('server:user:invite:accept', (player, id) => {

    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    let inviter = mp.players.at(id);
    if (user.isLogin(inviter)) {
        if (methods.distanceToPos(player.position, inviter.position) > 5) {
            inviter.notify('~r~Вы слишком далеко друг от друга');
            return;
        }

        user.addHistory(player, 0, 'Был принят в организацию ' + user.getFractionName(inviter) + '. Принял: ' + user.getRpName(inviter));

        let rank = enums.fractionListId[user.get(inviter, 'fraction_id')].rankList[0].length - 1;
        let fractionId = user.get(inviter, 'fraction_id');

        user.set(player, 'rank', rank);
        user.set(player, 'rank_type', 0);
        user.set(player, 'fraction_id', fractionId);
        user.set(player, 'is_leader', false);
        user.set(player, 'is_sub_leader', false);
        user.set(player, 'job', 0);

        user.setFractionId(player, fractionId);

        player.notify('~g~Вас приняли в организацию ' + user.getFractionName(inviter));
        inviter.notify('~b~Вы приняли сотрудника: ~s~' + user.getRpName(player));

        user.save(player);
    }
    else {
        player.notify('~r~Игрок не найден');
    }
});

mp.events.addRemoteCounted('server:phone:inviteFraction2', (player, id) => {
    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    let target = mp.players.at(id);
    if (user.isLogin(target)) {

        if (target.id == player.id) {
            player.notify('~r~Здравствуйте, я хотел вставить сюда шутку, но я ее не придумал, в общем, как ты собрался самого себя принять в организацию в которой ты уже состоишь?');
            return;
        }

        if (methods.distanceToPos(target.position, player.position) > 5) {
            player.notify('~r~Вы слишком далеко друг от друга');
            return;
        }

        if (user.get(target, 'fraction_id') > 0 || user.get(target, 'fraction_id2') > 0) {
            player.notify('~r~Игрок уже состоит в организации');
            return;
        }

        target.call('client:menuList:showAskInvite2Menu', [player.id, user.getFractionName2(player)])
    }
    else {
        player.notify('~r~Игрок не найден');
    }
});

mp.events.addRemoteCounted('server:user:invite2:accept', (player, id) => {
    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    let inviter = mp.players.at(id);
    if (user.isLogin(inviter)) {

        if (methods.distanceToPos(player.position, inviter.position) > 5) {
            inviter.notify('~r~Вы слишком далеко друг от друга');
            return;
        }
        let fractionId = user.get(inviter, 'fraction_id2');

        let rank = JSON.parse(fraction.getData(fractionId).get('rank_list'))[0].length - 1;

        user.set(player, 'rank2', rank);
        user.set(player, 'rank_type2', 0);
        user.set(player, 'fraction_id2', fractionId);
        user.set(player, 'is_leader2', false);
        user.set(player, 'is_sub_leader2', false);

        user.setFractionId2(player, fractionId);

        player.notify('~g~Вас приняли в организацию');
        inviter.notify('~b~Вы приняли: ~s~' + user.getRpName(player));

        user.save(target);
    }
    else {
        player.notify('~r~Игрок не найден');
    }
});

mp.events.addRemoteCounted('server:phone:inviteFamily', (player, id) => {
    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    let target = mp.players.at(id);
    if (user.isLogin(target)) {

        if (target.id == player.id) {
            player.notify('~r~Здравствуйте, я хотел вставить сюда шутку, но я ее не придумал, в общем, как ты собрался самого себя принять в организацию в которой ты уже состоишь?');
            return;
        }

        if (methods.distanceToPos(target.position, player.position) > 5) {
            player.notify('~r~Вы слишком далеко друг от друга');
            return;
        }

        if (user.get(target, 'family_id') > 0) {
            player.notify('~r~Игрок уже состоит в семье');
            return;
        }

        target.call('client:menuList:showAskInvitefMenu', [player.id, user.getFamilyName(player)])
    }
    else {
        player.notify('~r~Игрок не найден');
    }
});

mp.events.addRemoteCounted('server:user:invitef:accept', (player, id) => {
    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    let inviter = mp.players.at(id);
    if (user.isLogin(inviter)) {

        if (methods.distanceToPos(player.position, inviter.position) > 5) {
            inviter.notify('~r~Вы слишком далеко друг от друга');
            return;
        }
        let fractionId = user.get(inviter, 'family_id');

        let rank = JSON.parse(family.getData(fractionId).get('rank_list'))[0].length - 1;

        user.set(player, 'rankf', rank);
        user.set(player, 'rank_typef', 0);
        user.set(player, 'family_id', fractionId);
        user.set(player, 'is_leaderf', false);
        user.set(player, 'is_sub_leaderf', false);

        user.setFamilyId(player, fractionId);

        player.notify('~g~Вас приняли в семью');
        inviter.notify('~b~Вы приняли: ~s~' + user.getRpName(player));

        user.save(target);
    }
    else {
        player.notify('~r~Игрок не найден');
    }
});

mp.events.addRemoteCounted('server:phone:mafiaClearWanted', (player, id) => {
    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    let target = mp.players.at(id);
    if (user.isLogin(target)) {

        if (methods.distanceToPos(target.position, player.position) > 5) {
            player.notify('~r~Вы слишком далеко друг от друга');
            return;
        }

        if (user.get(target, 'wanted_level') === 0) {
            player.notify('~r~У игрока нет розыска');
            return;
        }

        let price = user.get(target, 'wanted_level') * 300;

        if (user.getCashMoney(target) < price) {
            player.notify('~r~У игрока недостаточно средств');
            return;
        }

        target.call('client:menuList:showAcceptClearWantedMenu', [player.id, price])
    }
    else {
        player.notify('~r~Игрок не найден');
    }
});

mp.events.addRemoteCounted('server:phone:mafiaGiveShop', (player, id) => {
    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    let target = mp.players.at(id);
    if (user.isLogin(target)) {

        if (methods.distanceToPos(target.position, player.position) > 5) {
            player.notify('~r~Вы слишком далеко друг от друга');
            return;
        }

        fraction.getShopGang(target);
        player.notify('~g~Вы выдали наводку');
    }
    else {
        player.notify('~r~Игрок не найден');
    }
});

mp.events.addRemoteCounted('server:user:clearByMafia', (player, id, price) => {
    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    let target = mp.players.at(id);
    if (user.isLogin(target)) {

        if (methods.distanceToPos(target.position, player.position) > 5) {
            player.notify('~r~Вы слишком далеко друг от друга');
            return;
        }

        if (user.get(player, 'wanted_level') === 0) {
            player.notify('~r~У вас нет розыска');
            return;
        }

        let price = user.get(player, 'wanted_level') * 300;

        if (user.getCashMoney(player) < price) {
            player.notify('~r~У вас недостаточно средств');
            return;
        }

        target.notify(`~g~Вы очистили розыск и заработали ${methods.moneyFormat(price / 2)}`);

        fraction.addMoney(user.get(target, 'fraction_id2'), (price / 2 / 1000), `Прибыль со снятия розыска (${user.getRpName(target)})`);
        user.addMoney(target, price / 2, 'Заработок с очистки розыска');
        user.removeMoney(player, price, 'Очистка розыска');

        user.set(player, 'wanted_level', 0);
        user.set(player, 'wanted_reason', '');
        player.notifyWithPicture('Уведомление', 'Police Department', 'Вы больше не находитесь в розыске', 'WEB_LOSSANTOSPOLICEDEPT', 2);
        user.addHistory(player, 1, 'Был очищен розыск');
    }
    else {
        player.notify('~r~Игрок не найден');
    }
});

mp.events.addRemoteCounted('server:phone:destroyFraction', (player) => {
    if (!user.isLogin(player))
        return;
    fraction.destroy(player, user.get(player, 'fraction_id2'));
});

mp.events.addRemoteCounted('server:phone:destroyFamily', (player) => {
    if (!user.isLogin(player))
        return;
    family.destroy(player, user.get(player, 'family_id'));
});

mp.events.addRemoteCounted('server:phone:editFractionName', (player, text) => {
    if (!user.isLogin(player))
        return;
    fraction.editFractionName(player, text);
});

mp.events.addRemoteCounted('server:phone:editFractionLeader', (player, text) => {
    if (!user.isLogin(player))
        return;
    fraction.editFractionLeader(player, text);
});

mp.events.addRemoteCounted('server:phone:editFractionSubLeader', (player, text) => {
    if (!user.isLogin(player))
        return;
    fraction.editFractionSubLeader(player, text);
});

mp.events.addRemoteCounted('server:phone:createFractionDep', (player, text) => {
    if (!user.isLogin(player))
        return;
    fraction.createFractionDep(player, text);
});

mp.events.addRemoteCounted('server:phone:editFractionRank', (player, text, rankId, depId) => {
    if (!user.isLogin(player))
        return;
    fraction.editFractionRank(player, text, rankId, depId);
});

mp.events.addRemoteCounted('server:phone:deleteFractionRank', (player, rankId, depId) => {
    if (!user.isLogin(player))
        return;
    fraction.deleteFractionRank(player, rankId, depId);
});

mp.events.addRemoteCounted('server:phone:editFractionDep', (player, text, depId) => {
    if (!user.isLogin(player))
        return;
    fraction.editFractionDep(player, text, depId);
});

mp.events.addRemoteCounted('server:phone:deleteFractionDep', (player, depId) => {
    if (!user.isLogin(player))
        return;
    fraction.deleteFractionDep(player, depId);
});

mp.events.addRemoteCounted('server:phone:addFractionRank', (player, text, depId) => {
    if (!user.isLogin(player))
        return;
    fraction.addFractionRank(player, text, depId);
});

mp.events.addRemoteCounted('server:phone:editFractionLeaderF', (player, text) => {
    if (!user.isLogin(player))
        return;
    family.editFractionLeader(player, text);
});

mp.events.addRemoteCounted('server:phone:editFractionSubLeaderF', (player, text) => {
    if (!user.isLogin(player))
        return;
    family.editFractionSubLeader(player, text);
});

mp.events.addRemoteCounted('server:phone:createFractionDepF', (player, text) => {
    if (!user.isLogin(player))
        return;
    family.createFractionDep(player, text);
});

mp.events.addRemoteCounted('server:phone:editFractionRankF', (player, text, rankId, depId) => {
    if (!user.isLogin(player))
        return;
    family.editFractionRank(player, text, rankId, depId);
});

mp.events.addRemoteCounted('server:phone:deleteFractionRankF', (player, rankId, depId) => {
    if (!user.isLogin(player))
        return;
    family.deleteFractionRank(player, rankId, depId);
});

mp.events.addRemoteCounted('server:phone:editFractionDepF', (player, text, depId) => {
    if (!user.isLogin(player))
        return;
    family.editFractionDep(player, text, depId);
});

mp.events.addRemoteCounted('server:phone:deleteFractionDepF', (player, depId) => {
    if (!user.isLogin(player))
        return;
    family.deleteFractionDep(player, depId);
});

mp.events.addRemoteCounted('server:phone:addFractionRankF', (player, text, depId) => {
    if (!user.isLogin(player))
        return;
    family.addFractionRank(player, text, depId);
});

mp.events.addRemoteCounted('server:phone:fractionVehicleAction', (player, id) => {
    if (!user.isLogin(player))
        return;
    phone.fractionVehicleAction(player, id);
});

mp.events.addRemoteCounted('server:phone:fractionVehicleAction2', (player, id) => {
    if (!user.isLogin(player))
        return;
    phone.fractionVehicleAction2(player, id);
});

mp.events.addRemoteCounted('server:phone:userRespawnById', (player, id, price) => {
    if (!user.isLogin(player))
        return;
    mp.vehicles.forEach(v => {
        if (v.getVariable('vid') == id) {
            if (v.getOccupants().length > 0) {
                player.notify('~r~Транспорт в угоне');
                return;
            }

            if (user.getBankMoney(player) < price) {
                player.notify(`~r~Необходимо иметь ${methods.moneyFormat(price)} на банковской карте для использования эвакуатора`);
                return;
            }

            user.removeBankMoney(player, price, 'Услуги эвакуатора');
            coffer.addMoney(1, price);

            vehicles.respawn(v);
            player.notify('~g~Ваш транспорт скоро будет на парковочном месте');
        }
    });
});

mp.events.addRemoteCounted('server:phone:userGetPosById', (player, id) => {
    if (!user.isLogin(player))
        return;
    mp.vehicles.forEach(v => {
        if (v.getVariable('vid') == id) {
            if (v.dimension === 0)
                user.setWaypoint(player, v.position.x, v.position.y);
            else if (v.dimension >= 100000)
            {
                let list = [
                    [847.5055, -1318.934, 25.41834], //La Mesa
                    [-179.8415, -2556.748, 5.01313], //Vans
                    [-457.1022, -2267.843, 7.520823], //Boat
                    [-1856.601, -3120.497, 12.94436], //Heli
                    [ -1071.382, -3457.909, 13.14841], //Plane
                ];
                user.setWaypoint(player, list[v.dimension - 100000][0], list[v.dimension - 100000][1]);
                player.notify('~y~Ваш транспорт стоит на штраф-стоянке');
            }
            else
                player.notify('~y~Ваш транспорт стоит в гараже');
        }
    });
});

mp.events.addRemoteCounted('server:phone:userLockById', (player, id) => {
    if (!user.isLogin(player))
        return;
    mp.vehicles.forEach(v => {
        if (v.getVariable('vid') == id) {
            if (v.getVariable('useless'))
                return;
            vehicles.lockStatus(player, v);
        }
    });
});

mp.events.addRemoteCounted('server:phone:userEngineById', (player, id) => {
    if (!user.isLogin(player))
        return;
    mp.vehicles.forEach(v => {
        if (v.getVariable('vid') == id) {
            if (v.getVariable('useless'))
                return;
            vehicles.engineStatus(player, v);
        }
    });
});

mp.events.addRemoteCounted('server:phone:userNeonById', (player, id) => {
    if (!user.isLogin(player))
        return;
    mp.vehicles.forEach(v => {
        if (v.getVariable('vid') == id) {
            vehicles.neonStatus(player, v);
        }
    });
});

mp.events.addRemoteCounted('server:lspd:takeVehicle', (player, x, y, z, rot, vid) => {
    if (!user.isLogin(player))
        return;
    try {
        let veh = mp.vehicles.at(vid);
        veh.position = new mp.Vector3(x, y, z);
        veh.dimension = 0;
        user.showLoadDisplay(player);
        setTimeout(function () {
            try {
                vehicles.setHeading(vid, rot);
                user.putInVehicle(player, veh, -1);
                player.notify('~y~Не забудьте оплатить штраф через 2 - Транспорт');
                user.teleportVeh(player, x, y, z, rot);
            }
            catch (e) {}
        }, 1000)
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:inventory:getItemList', (player, ownerType, ownerId) => {
    if (!user.isLogin(player))
        return;
    inventory.getItemList(player, ownerType, ownerId);
});

mp.events.addRemoteCounted('server:inventory:updateSubInvRadius', (player, ownerId, ownerType, withMe = false) => {
    if (!user.isLogin(player))
        return;
    methods.getListOfPlayerInRadius(player.position, 10).forEach(p => {
        try {
            if (!user.isLogin(p))
                return;
            /*if (p.id === player.id) {
                if (withMe)
                    inventory.getItemList(p, ownerType, methods.parseInt(ownerId), false, true);
            }
            else*/
            inventory.getItemList(p, ownerType, methods.parseInt(ownerId), false, true);
            inventory.getItemList(p, inventory.types.Player, user.getId(p), false, true);
        }
        catch (e) {}
    })
});

mp.events.addRemoteCounted('server:inventory:getItemListSell', (player) => {
    if (!user.isLogin(player))
        return;
    inventory.getItemListSell(player);
});

mp.events.addRemoteCounted('server:inventory:getItemListSellFish', (player, shopId) => {
    if (!user.isLogin(player))
        return;
    inventory.getItemListSellFish(player, shopId);
});

mp.events.addRemoteCounted('server:user:sellFish', (player, shopId) => {
    if (!user.isLogin(player))
        return;
    let sql = `SELECT * FROM items WHERE owner_id = '${user.getId(player)}' AND owner_type = '1' AND is_equip = 0 AND (item_id > 486 AND item_id < 537) ORDER BY item_id DESC LIMIT 400`;

    mysql.executeQuery(sql, function (err, rows, fields) {
        if (!user.isLogin(player))
            return;

        let price = 0;
        let countFish = rows.length;
        rows.forEach(row => {
            let localPrice = items.getItemPrice(row['item_id']);

            fishing.getPrices().forEach(fishItem => {
                if (fishItem[0] === row['item_id'])
                    localPrice = fishItem[4];
            });

            price = price + localPrice;
        });

        business.addMoney(shopId, price / 10, 'Доля с продажи рыбы');
        user.addMoney(player, price, 'Продажа всей рыбы');
        inventory.deleteItemsRange(player, 487, 536);
        player.notify(`~b~Вы продали рыбу по цене: ~s~${methods.moneyFormat(price)}`);

        let fId = user.get(player, 'family_id');
        if (fId > 0) {
            let fData = family.getData(fId);
            if (fData.get('level') === 5) {
                if (fData.get('exp') > 100000) {
                    family.addMoney(fId, 7500000, 'Премия за достижения 6 уровня');
                    family.set(fId, 'level', 6);
                    family.set(fId, 'exp', 0);
                }
                else
                    family.set(fId, 'exp', fData.get('exp') + countFish);
            }
        }
    });
});

mp.events.addRemoteCounted('server:inventory:equip', (player, id, itemId, count, aparams) => {
    if (!user.isLogin(player))
        return;
    inventory.equip(player, id, itemId, count, aparams);
});

mp.events.addRemoteCounted('server:inventory:craft', (player, id, itemId, countItems, count, params) => {
    if (!user.isLogin(player))
        return;
    inventory.craft(player, id, itemId, countItems, count, params);
});

mp.events.addRemoteCounted('server:inventory:fixItem', (player, id) => {
    if (!user.isLogin(player))
        return;
    inventory.fixItem(player, id);
});

mp.events.addRemoteCounted('server:inventory:colorGunItem', (player, id, tint, sTint) => {
    if (!user.isLogin(player))
        return;
    inventory.colorItem(player, id, tint, sTint);
});

mp.events.addRemoteCounted('server:inventory:fixItemFree', (player, id) => {
    if (!user.isLogin(player))
        return;
    inventory.fixItemFree(player, id);
});

mp.events.addRemoteCounted('server:inventory:fixItemFreeMenu', (player) => {
    if (!user.isLogin(player))
        return;
    inventory.getItemListGunFixFree(player);
});

mp.events.addRemoteCounted('server:inventory:upgradeWeapon', (player, id, itemId, weaponStr) => {
    if (!user.isLogin(player))
        return;
    inventory.upgradeWeapon(player, id, itemId, weaponStr);
});

mp.events.addRemoteCounted('server:inventory:unEquip', (player, id, itemId) => {
    if (!user.isLogin(player))
        return;
    inventory.unEquip(player, id, itemId);
});

mp.events.addRemoteCounted('server:inventory:updateEquipStatus', (player, id, status) => {
    inventory.updateEquipStatus(id, status);
});

mp.events.addRemoteCounted('server:inventory:updateItemsEquipByItemId', (player, itemId, ownerId, ownerType, equip, count) => {
    inventory.updateItemsEquipByItemId(itemId, ownerId, ownerType, equip, count);
});

mp.events.addRemoteCounted('server:inventory:updateOwnerId', (player, id, ownerId, ownerType) => {
    inventory.updateOwnerId(id, ownerId, ownerType);
});

mp.events.addRemoteCounted('server:inventory:updateOwnerIdWithPrice', (player, id, ownerId, ownerType, price) => {
    inventory.updateOwnerIdWithPrice(id, ownerId, ownerType, price);
});

mp.events.addRemoteCounted('server:inventory:updateOwnerAll', (player, oldOwnerId, oldOwnerType, ownerId, ownerType) => {
    inventory.updateOwnerAll(oldOwnerId, oldOwnerType, ownerId, ownerType);
});

mp.events.addRemoteCounted('server:inventory:updateItemParams', (player, id, params) => {
    inventory.updateItemParams(id, params);
});

mp.events.addRemoteCounted('server:inventory:updateItemCount', (player, id, count) => {
    inventory.updateItemCount(id, count);
});

mp.events.addRemoteCounted('server:inventory:addItem', (player, itemId, count, ownerType, ownerId, countItems, isEquip, params, timeout) => {
    if (!user.isLogin(player))
        return;
    inventory.addItem(itemId, count, ownerType, ownerId, countItems, isEquip, params, timeout);
});

mp.events.addRemoteCounted('server:inventory:updateAmount', (player, id, type) => {
    inventory.updateAmount(player, id, type);
});

mp.events.addRemoteCounted('server:inventory:addItemSql', (player, itemId, count, ownerType, ownerId, countItems, isEquip, params, timeout) => {
    if (!user.isLogin(player))
        return;
    inventory.addItemSql(itemId, count, ownerType, ownerId, countItems, isEquip, params, timeout);
});

mp.events.addRemoteCounted('server:inventory:addWorldItem', (player, itemId, count, countItems, posx, posy, posz, rotx, roty, rotz, params, timeout) => {
    if (!user.isLogin(player))
        return;
    inventory.addWorldItem(itemId, count, countItems, posx, posy, posz, rotx, roty, rotz, params, timeout);
});

mp.events.addRemoteCounted('server:inventory:dropWeaponItem', (player, itemId, posx, posy, posz, rotx, roty, rotz) => {
    if (!user.isLogin(player))
        return;
    inventory.dropWeaponItem(player, itemId, posx, posy, posz, rotx, roty, rotz);
});

mp.events.addRemoteCounted('server:inventory:addPlayerWeaponItem', (player, itemId, count, ownerType, ownerId, countItems, isEquip, params, text, timeout) => {
    if (!user.isLogin(player))
        return;
    inventory.addPlayerWeaponItem(player, itemId, count, ownerType, ownerId, countItems, isEquip, params, text, timeout);
});

mp.events.addRemoteCounted('server:inventory:dropItem', (player, id, itemId, posX, posY, posZ, rotX, rotY, rotZ) => {
    inventory.dropItem(player, id, itemId, posX, posY, posZ, rotX, rotY, rotZ);
});

mp.events.addRemoteCounted('server:inventory:deleteDropItem', (player, id) => {
    inventory.deleteDropItem(id);
});

mp.events.addRemoteCounted('server:inventory:deleteItem', (player, id) => {
    inventory.deleteItem(id);
});

mp.events.addRemoteCounted('server:inventory:deleteItemByItemId', (player, id, isEquip) => {
    inventory.deleteItemByItemId(id, isEquip);
});

mp.events.addRemoteCounted('server:inventory:deleteItemsRange', (player, itemIdFrom, itemIdTo) => {
    inventory.deleteItemsRange(player, itemIdFrom, itemIdTo);
});

mp.events.addRemoteCounted('server:inventory:useItem', (player, id, itemId) => {
    inventory.useItem(player, id, itemId);
});

mp.events.addRemoteCounted('server:inventory:usePlayerItem', (player, id, itemId) => {
    inventory.usePlayerItem(player, id, itemId);
});

mp.events.addRemoteCounted('server:tradeMarket:rentBeach', (player, idx) => {
    if (!user.isLogin(player))
        return;
    if (user.getCashMoney(player) < 1000) {
        player.notify('~r~У вас нет при себе $1000');
        return;
    }
    if (tradeMarket.getBeach(idx, 'rent')) {
        player.notify('~r~Палатка уже арендована');
        return;
    }
    if (user.has(player, 'rentTrade')) {
        player.notify('~r~Вы уже арендовали палатку');
        return;
    }
    user.set(player, 'rentTrade', idx);
    user.set(player, 'rentTradeC', idx);
    user.removeCashMoney(player, 1000, 'Аренда палатки');
    tradeMarket.setBeach(idx, 'rent', user.getId(player));
    tradeMarket.getAllBeach().get(idx.toString()).marker.visible = true;
    user.updateClientCache(player);
    player.notify('~g~Вы арендовали палатку');
});

mp.events.addRemoteCounted('server:tradeMarket:unrentBeach', (player, idx) => {
    if (!user.isLogin(player))
        return;
    user.reset(player, 'rentTrade');
    user.reset(player, 'rentTradeC');
    tradeMarket.setBeach(idx, 'rent', 0);
    tradeMarket.getAllBeach().get(idx.toString()).marker.visible = false;
    user.updateClientCache(player);
    player.notify('~y~Вы завершили аренду');
    inventory.updateOwnerAll(user.getId(player), inventory.types.TradeBeach, user.getId(player), inventory.types.Player);
});

mp.events.addRemoteCounted('server:tradeMarket:rentBlack', (player, idx) => {
    if (!user.isLogin(player))
        return;
    if (user.getCashMoney(player) < 2000) {
        player.notify('~r~У вас нет при себе $2000');
        return;
    }
    if (tradeMarket.getBeach(idx, 'rent')) {
        player.notify('~r~Палатка уже арендована');
        return;
    }
    if (user.has(player, 'rentTrade')) {
        player.notify('~r~Вы уже арендовали палатку');
        return;
    }
    user.set(player, 'rentTrade', idx);
    user.set(player, 'rentTradeB', idx);
    user.removeCashMoney(player, 2000, 'Аренда палатки');
    tradeMarket.setBlack(idx, 'rent', user.getId(player));
    tradeMarket.getAllBlack().get(idx.toString()).marker.visible = true;
    user.updateClientCache(player);
    player.notify('~g~Вы арендовали палатку');
});

mp.events.addRemoteCounted('server:tradeMarket:unrentBlack', (player, idx) => {
    if (!user.isLogin(player))
        return;
    user.reset(player, 'rentTrade');
    user.reset(player, 'rentTradeB');
    tradeMarket.setBlack(idx, 'rent', 0);
    tradeMarket.getAllBlack().get(idx.toString()).marker.visible = false;
    user.updateClientCache(player);
    player.notify('~y~Вы завершили аренду');
    inventory.updateOwnerAll(user.getId(player), inventory.types.TradeBlack, user.getId(player), inventory.types.Player);
});

mp.events.addRemoteCounted('server:tradeMarket:buy', (player, id, price, name, ownerId, payType) => {
    if (!user.isLogin(player))
        return;
    if (user.getMoney(player, payType) < price) {
        player.notify('~r~У вас нет при себе ' + methods.moneyFormat(price));
        return;
    }
    let seller = user.getPlayerById(ownerId);
    if (!user.isLogin(seller))
    {
        player.notify('~r~Продавец не в сети');
        return;
    }

    let priceWithTax = price * ((100 - coffer.getTaxIntermediate()) / 100);
    inventory.updateOwnerId(id, user.getId(player), inventory.types.Player);
    user.removeCashMoney(player, price, 'Покупка на рынке: ' + name, payType);
    user.addCashMoney(seller, priceWithTax, 'Продажа на рынке: ' + name);

    seller.notify(`~g~Вы продали ~s~"${name}" ~g~по цене ~s~${methods.moneyFormat(priceWithTax)}~g~ с учетом налога ~s~${coffer.getTaxIntermediate()}%`);
    player.notify(`~g~Вы купили ~s~"${name}"~g~ по цене ~s~${methods.moneyFormat(price)}`);
});

mp.events.addRemoteCounted("server:showVehMenu", (player) => {
    if (!user.isLogin(player))
        return;
    if (player.vehicle && player.seat == -1)
        player.call('client:menuList:showVehicleMenu', [Array.from(vehicles.getData(player.vehicle.getVariable('container')))]);
    else
        player.notify('~r~Вы должны находиться в транспорте');
});

mp.events.addRemoteCounted("server:vehicle:lockStatus:hack", (player, vId) => {
    let veh = mp.vehicles.at(vId);
    if (!user.isLogin(player))
        return;
    if (!vehicles.exists(veh))
        return;

    veh.locked = false;
    vSync.setLockStatus(veh, veh.locked);
});

mp.events.addRemoteCounted("server:vehicle:engineStatus:hack", (player, vId) => {
    let veh = mp.vehicles.at(vId);
    if (!user.isLogin(player))
        return;
    if (!vehicles.exists(veh))
        return;

    vSync.setEngineState(veh, true);
});

mp.events.addRemoteCounted("server:vehicle:lockStatus", (player) => {
    if (!user.isLogin(player))
        return;

    try {
        if (player.vehicle && player.seat == -1) {
            vehicles.lockStatus(player, player.vehicle);
            return;
        }

        let vehicle = methods.getNearestVehicleWithCoords(player.position, 5, player.dimension);
        if (vehicles.exists(vehicle)) {

            if (vehicle.getVariable('useless'))
                return;

            if (user.isAdmin(player)) {
                vehicles.lockStatus(player, vehicle);
                return;
            }

            let data = vehicles.getData(vehicle.getVariable('container'));
            if (vehicle.getVariable('fraction_id')) {
                if (
                    vehicle.getVariable('fraction_id') == user.get(player, 'fraction_id') &&
                    vehicle.getVariable('rank_type') == user.get(player, 'rank_type')
                )
                    vehicles.lockStatus(player, vehicle);
                else if (vehicle.getVariable('fraction_id') == user.get(player, 'fraction_id') && (user.isLeader(player) || user.isSubLeader(player)))
                    vehicles.lockStatus(player, vehicle);
                else if ((vehicle.getVariable('fraction_id') * -1) == user.get(player, 'fraction_id2'))
                    vehicles.lockStatus(player, vehicle);
                else
                    player.notify('~r~У Вас нет ключей от транспорта');
            }
            else if (vehicle.getVariable('owner_id')) {
                if (vehicle.getVariable('owner_id') == user.getId(player))
                    vehicles.lockStatus(player, vehicle);
                else
                    player.notify('~r~У Вас нет ключей от транспорта');
            }
            else if (vehicle.getVariable('isAdmin')) {
                player.notify('~r~У Вас нет ключей от транспорта');
            }
            else if (vehicle.getVariable('cargoId')) {
                if (vehicle.getVariable('fraction_id2') > 0)
                    vehicles.lockStatus(player, vehicle);
                else
                    player.notify('~r~У Вас нет ключей от транспорта');
            }
            else if (data.has('user_id')) {
                if (data.get('user_id') == user.getId(player))
                    vehicles.lockStatus(player, vehicle);
                else
                    player.notify('~r~У Вас нет ключей от транспорта');
            }
            else
                vehicles.lockStatus(player, vehicle);
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted("onKeyPress:LAlt", (player) => {
    if (!user.isLogin(player))
        return;
    pickups.checkPressLAlt(player);
});

mp.events.addRemoteCounted("onKeyPress:E", (player) => {

    if (!user.isLogin(player))
        return;

    pickups.checkPressE(player);
    pickups.checkPressLAlt(player);

    houses.getAllHouses().forEach((val, key, object) => {
        if (methods.distanceToPos(player.position, val.position) < 1.5) {
            let houseData = houses.getHouseData(key);
            if (houseData.get('user_id') == 0)
                player.call('client:showHouseBuyMenu', [Array.from(houseData)]);
            else if (houseData.get('id') == user.get(player, 'house_id'))
                player.call('client:showHouseOutMenu', [Array.from(houseData)]);
        }
        if (methods.distanceToPos(player.position, val.g1.position) < 4 || methods.distanceToPos(player.position, val.g2.position) < 4 || methods.distanceToPos(player.position, val.g3.position) < 4) {
            let houseData = houses.getHouseData(key);
            if (houseData.get('user_id') != 0)
                player.call('client:showHouseOutVMenu', [Array.from(houseData)]);
        }
    });

    condos.getAll().forEach((val, key, object) => {
        if (methods.distanceToPos(player.position, val.position) < 1.5) {
            let houseData = condos.getHouseData(key);
            if (houseData.get('user_id') == 0)
                player.call('client:showCondoBuyMenu', [Array.from(houseData)]);
            else {
                player.call('client:showCondoOutMenu', [Array.from(houseData)]);
            }
        }
    });

    yachts.getAll().forEach((val, key, object) => {
        if (methods.distanceToPos(player.position, val.position) < 1.5) {
            let houseData = yachts.getHouseData(key);
            if (houseData.get('user_id') == 0)
                player.call('client:showYachtBuyMenu', [Array.from(houseData)]);
            else {
                player.call('client:showYachtOutMenu', [Array.from(houseData)]);
            }
        }
    });

    stocks.getAll().forEach((val, key, object) => {
        if (methods.distanceToPos(player.position, val.pos) < 1.5) {
            let houseData = stocks.getData(key);
            if (houseData.get('user_id') == 0)
                player.call('client:showStockBuyMenu', [Array.from(houseData)]);
            else
                player.call('client:showStockOutMenu', [Array.from(houseData)]);
        }
        if (methods.distanceToPos(player.position, val.vPos) < 4) {
            let stockKey = stocks.getNearestVehWithCoords(player.position, 4);
            if (stockKey) {
                let houseData = stocks.getData(stockKey);
                if (houseData.get('user_id') != 0)
                    player.call('client:showStockOutVMenu', [Array.from(houseData)]);
            }
        }
    });

    if (player.dimension >= enums.offsets.condo && player.dimension < enums.offsets.condoBig) {

        houses.interiorList.forEach(function(item) {
            let x = item[0];
            let y = item[1];
            let z = item[2];

            if (methods.distanceToPos(player.position, new mp.Vector3(x, y, z)) < 1.5) {
                let houseData = condos.getHouseData(player.dimension - enums.offsets.condo);
                player.call('client:showCondoInMenu', [Array.from(houseData)]);
            }
        });
    }
    else if (player.dimension >= enums.offsets.stock && player.dimension < enums.offsets.stock + 100000) {

        stocks.interiorList.forEach(function(item) {
            let x = item[0];
            let y = item[1];
            let z = item[2];

            if (methods.distanceToPos(player.position, new mp.Vector3(x, y, z)) < 1.5) {
                let houseData = stocks.getData(player.dimension - enums.offsets.stock);
                player.call('client:showStockInMenu', [Array.from(houseData)]);
            }

            x = item[4];
            y = item[5];
            z = item[6];

            if (methods.distanceToPos(player.position, new mp.Vector3(x, y, z)) < 4) {
                let houseData = stocks.getData(player.dimension - enums.offsets.stock);
                player.call('client:showStockInVMenu', [Array.from(houseData)]);
            }
        });

        if (methods.distanceToPos(player.position, new mp.Vector3(169.47637939453125, 5206.49951171875, -89.1696548461914)) < 4) {
            let houseData = stocks.getData(player.dimension - enums.offsets.stock);
            player.call('client:showStockInVMenu', [Array.from(houseData)]);
        }
        if (methods.distanceToPos(player.position, new mp.Vector3(890.7874755859375, -3245.426025390625, -98.6081771850586)) < 4) {
            let houseData = stocks.getData(player.dimension - enums.offsets.stock);
            player.call('client:showStockInVMenu', [Array.from(houseData)]);
        }
        if (methods.distanceToPos(player.position, new mp.Vector3(1088.6865234375, -3188.01025390625, -39.99346923828125)) < 2) {
            let houseData = stocks.getData(player.dimension - enums.offsets.stock);
            player.call('client:showStockInMenu', [Array.from(houseData)]);
        }

        stocks.pcList.forEach(function(item) {
            let x = item[0];
            let y = item[1];
            let z = item[2];

            if (methods.distanceToPos(player.position, new mp.Vector3(x, y, z)) < 1.5) {
                let houseData = stocks.getData(player.dimension - enums.offsets.stock);
                if (houseData.get('user_id') == user.getId(player))
                    player.call('client:showStockPanelMenu', [Array.from(houseData)]);
                else if (houseData.get('user_id') < 0 && (houseData.get('user_id') * -1 === user.get(player, 'fraction_id2')) && user.isLeader2(player))
                    player.call('client:showStockPanelMenu', [Array.from(houseData)]);
                else
                    player.notify('~r~Вы не владелец склада');
            }
        });
    }
    else if (player.dimension > 0) {

        houses.interiorList.forEach(function(item) {
            let x = item[0];
            let y = item[1];
            let z = item[2];

            if (methods.distanceToPos(player.position, new mp.Vector3(x, y, z)) < 1.5) {
                let houseData = houses.getHouseData(player.dimension);
                player.call('client:showHouseInMenu', [Array.from(houseData)]);
            }
        });

        houses.garageIntList.forEach(function(item) {
            let x = item[0];
            let y = item[1];
            let z = item[2];

            if (methods.distanceToPos(player.position, new mp.Vector3(x, y, z)) < 1.5) {
                let houseData = houses.getHouseData(player.dimension);
                player.call('client:showHouseInGMenu', [Array.from(houseData)]);
            }
        });

        houses.garageList.forEach(function(item) {
            let x = item[0];
            let y = item[1];
            let z = item[2];

            let x1 = item[4];
            let y1 = item[5];
            let z1 = item[6];

            if (methods.distanceToPos(player.position, new mp.Vector3(x, y, z)) < 4 || methods.distanceToPos(player.position, new mp.Vector3(x1, y1, z1)) < 4) {
                let houseData = houses.getHouseData(player.dimension);
                player.call('client:showHouseInVMenu', [Array.from(houseData)]);
            }
        });
    }
});

mp.events.addRemoteCounted('server:user:askAve', (player, id) => {
    if (!user.isLogin(player))
        return;
    try {
        let target = mp.players.at(id);
        if (!user.isLogin(target)) {
            player.notify('~r~Игрок не найден');
            return;
        }
        if (methods.distanceToPos(player.position, target.position) > 5) {
            player.notify('~r~Вы слишком далеко');
            return;
        }
        if (user.getCashMoney(player) < 10000) {
            player.notify('~r~У вас нет при себе $10000');
            return;
        }
        if (user.get(player, 'partner') !== '') {
            player.notify('~r~Вы уже состоите в браке');
            return;
        }
        if (user.get(target, 'partner') !== '') {
            player.notify('~r~Игрок уже состоит в браке');
            return;
        }
        if (player.id === target.id) {
            player.notify('~r~Нельзя предложить самому себе');
            return;
        }
        target.call('client:menuList:showAveAcceptMenu', [player.id, user.getRpName(player)]);

    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:user:askNoAve', (player, id) => {
    if (!user.isLogin(player))
        return;
    try {
        let target = mp.players.at(id);
        if (!user.isLogin(target)) {
            player.notify('~r~Игрок не найден');
            return;
        }
        if (methods.distanceToPos(player.position, target.position) > 5) {
            player.notify('~r~Вы слишком далеко');
            return;
        }
        if (user.getCashMoney(player) < 1000) {
            player.notify('~r~У вас нет при себе $1000');
            return;
        }
        if (user.getRpName(player) !== user.get(target, 'partner')) {
            player.notify('~r~Вы не состите в браке с этим человеком');
            return;
        }
        target.call('client:menuList:showNoAveAcceptMenu', [player.id, user.getRpName(player)]);

    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:ave:accept', (player, id) => {
    if (!user.isLogin(player))
        return;
    try {
        let target = mp.players.at(id);
        if (!user.isLogin(target)) {
            player.notify('~r~Игрок не найден');
            return;
        }
        if (methods.distanceToPos(player.position, target.position) > 5) {
            player.notify('~r~Вы слишком далеко');
            return;
        }
        if (user.get(player, 'partner') !== '') {
            player.notify('~r~Вы уже состоите в браке');
            return;
        }
        if (user.get(target, 'partner') !== '') {
            player.notify('~r~Игрок уже состоит в браке');
            return;
        }
        user.removeMoney(target, 10000);
        user.set(player, 'partner', user.getRpName(target));
        user.set(target, 'partner', user.getRpName(player));
        user.save(player);
        user.save(target);
        chat.sendToAll('Священник', `Поздравляем! Новую ячейку общества образовала пара ${user.getRpName(target)} и ${user.getRpName(player)}`,  chat.clGreen);

        user.achiveDoneAllById(player, 12);
        user.achiveDoneAllById(target, 12);

        let surname = methods.removeQuotes(user.getRpName(target).split(' ')[1]);
        let name = methods.removeQuotes(user.getRpName(player).split(' ')[0]);

        mysql.executeQuery(`SELECT * FROM users WHERE name = '${name} ${surname}'`, function (err, rows, fields) {
            if (rows.length === 0) {
                try {
                    user.saveName(player, `${name} ${surname}`);
                    player.notify(`~r~Фамилия была изменена на ${surname}`);
                    user.set(player, 'partner', user.getRpName(target));
                }
                catch (e) {}
            }
            else {
                target.notify('~r~Сочетание имени и фамилии уже занята, поэтому вам её не сменили')
            }
        });
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:noave:accept', (player, id) => {
    if (!user.isLogin(player))
        return;
    try {
        let target = mp.players.at(id);
        if (!user.isLogin(target)) {
            player.notify('~r~Игрок не найден');
            return;
        }
        if (methods.distanceToPos(player.position, target.position) > 5) {
            player.notify('~r~Вы слишком далеко');
            return;
        }

        user.removeMoney(target, 1000);
        user.set(player, 'partner', '');
        user.set(target, 'partner', '');

        player.notify('~r~Вы разорвали брак');
        target.notify('~r~Вы разорвали брак');

        user.save(player);
        user.save(target);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:mechanic:fuel', (player, id, count, price) => {
    if (!user.isLogin(player))
        return;
    let target = mp.players.at(id);
    if (!user.isLogin(target)) {
        player.notify('~r~Игрок не найден');
        return;
    }
    if (!target.vehicle) {
        player.notify('~r~Игрок должен находится в транспорте');
        return;
    }
    if (methods.distanceToPos(player.position, target.position) > 10) {
        player.notify('~r~Вы слишком далеко');
        return;
    }
    target.call('client:menuList:showMechanicAcceptFuelMenu', [player.id, count, price]);
});

mp.events.addRemoteCounted('server:mechanic:fuel:accept', (player, id, count, price) => {
    try {
        if (!user.isLogin(player))
            return;
        let target = mp.players.at(id);
        if (!user.isLogin(target)) {
            player.notify('~r~Игрок не найден');
            return;
        }
        if (methods.distanceToPos(player.position, target.position) > 10) {
            player.notify('~r~Вы слишком далеко');
            return;
        }
        if (!player.vehicle) {
            player.notify('~r~Вы не в транспорте');
            return;
        }
        if (!target.vehicle) {
            player.notify('~r~Механик не в транспорте');
            return;
        }
        user.removeMoney(player, price, 'Услуги механика');
        user.addMoney(target, price, 'Услуги механика');

        let vInfo = methods.getVehicleInfo(player.vehicle.model);
        if (vInfo.fuel_type === 0) {
            player.notify(`~r~Данный вид транспорта не использует топливо`);
            return;
        }

        if (vInfo.fuel_full <= vehicles.getFuel(player.vehicle) + count) {
            player.notify('~r~Транспорт уже заправлен');
            return;
        }

        let fuel = vehicles.get(target.vehicle.getVariable('container'), 'mechFuel');
        vehicles.set(target.vehicle.getVariable('container'), 'mechFuel', fuel - count);

        player.notify(`~g~Вам заправили транспорт на ~s~${count} ед.~g~ топлива по цене ~s~${methods.moneyFormat(price)}`);
        target.notify(`~g~Вы заправили транспорт на ~s~${count} ед.~g~ топлива по цене ~s~${methods.moneyFormat(price)}`);

        vehicles.addFuel(player.vehicle, count);
    }
    catch (e) {
        
    }
});

mp.events.addRemoteCounted('server:mechanic:fix', (player, id, price) => {
    if (!user.isLogin(player))
        return;
    let target = mp.players.at(id);
    if (!user.isLogin(target)) {
        player.notify('~r~Игрок не найден');
        return;
    }
    if (!target.vehicle) {
        player.notify('~r~Игрок должен находится в транспорте');
        return;
    }
    if (methods.distanceToPos(player.position, target.position) > 10) {
        player.notify('~r~Вы слишком далеко');
        return;
    }
    target.call('client:menuList:showMechanicAcceptFixMenu', [player.id, price]);
});

mp.events.addRemoteCounted('server:mechanic:fix:accept', (player, id, price) => {
    try {
        if (!user.isLogin(player))
            return;
        let target = mp.players.at(id);
        if (!user.isLogin(target)) {
            player.notify('~r~Игрок не найден');
            return;
        }
        if (methods.distanceToPos(player.position, target.position) > 10) {
            player.notify('~r~Вы слишком далеко');
            return;
        }
        if (!player.vehicle) {
            player.notify('~r~Вы не в транспорте');
            return;
        }
        if (!target.vehicle) {
            player.notify('~r~Механик не в транспорте');
            return;
        }
        if (player.vehicle.dead) {
            player.notify('~r~Транспорт взорван');
            return;
        }
        user.removeMoney(player, price, 'Услуги механика');
        user.addMoney(target, price, 'Услуги механика');

        player.notify(`~g~Вам починили транспорт по цене ~s~${methods.moneyFormat(price)}`);
        target.notify(`~g~Вы починили транспорт по цене ~s~${methods.moneyFormat(price)}`);

        player.vehicle.repair();
    }
    catch (e) {

    }
});

mp.events.addRemoteCounted('server:mechanic:flip', (player, id, price) => {
    if (!user.isLogin(player))
        return;
    let target = mp.players.at(id);
    if (!user.isLogin(target)) {
        player.notify('~r~Игрок не найден');
        return;
    }
    if (methods.distanceToPos(player.position, target.position) > 10) {
        player.notify('~r~Вы слишком далеко');
        return;
    }
    target.call('client:menuList:showMechanicAcceptFlipMenu', [player.id, price]);
});

mp.events.addRemoteCounted('server:mechanic:flip:accept', (player, id, price) => {
    try {
        if (!user.isLogin(player))
            return;
        let target = mp.players.at(id);
        if (!user.isLogin(target)) {
            player.notify('~r~Игрок не найден');
            return;
        }
        if (methods.distanceToPos(player.position, target.position) > 10) {
            player.notify('~r~Вы слишком далеко');
            return;
        }

        let veh = methods.getNearestVehicleWithCoords(player.position, 5);
        if (!mp.vehicles.exists(veh)) {
            player.notify('~r~Рядом с вами нет транспорта');
            return;
        }
        if (!target.vehicle) {
            player.notify('~r~Механик не в транспорте');
            return;
        }
        user.removeMoney(player, price, 'Услуги механика');
        user.addMoney(target, price, 'Услуги механика');

        player.notify(`~g~Вам перевернули транспорт по цене ~s~${methods.moneyFormat(price)}`);
        target.notify(`~g~Вы перевернули транспорт по цене ~s~${methods.moneyFormat(price)}`);

        veh.rotation = new mp.Vector3(0, 0, veh.heading);
    }
    catch (e) {

    }
});

mp.events.addRemoteCounted('server:tax:payTax', (player, type, score, sum) => {
    tax.payTax(player, type, sum, score);
});

mp.events.addRemoteCounted('server:tax:payTaxAll', (player, type, sum) => {
    tax.payTaxAll(player, type, sum);
});

//Houses
mp.events.addRemoteCounted("server:houses:enter", (player, id) => {
    if (!user.isLogin(player))
        return;
    houses.enter(player, id);
});

mp.events.addRemoteCounted("server:houses:enterv", (player, id) => {
    if (!user.isLogin(player))
        return;
    houses.enterv(player, id);
});

mp.events.addRemoteCounted("server:houses:enterGarage", (player, id) => {
    if (!user.isLogin(player))
        return;
    houses.enterGarage(player, id);
});

mp.events.addRemoteCounted("server:houses:exitv", (player, id) => {
    if (!user.isLogin(player))
        return;
    houses.exitv(player, id);
});

mp.events.addRemoteCounted("server:houses:buy", (player, id) => {
    if (!user.isLogin(player))
        return;
    houses.buy(player, id);
});

mp.events.addRemoteCounted("server:houses:updatePin", (player, id, pin) => {
    if (!user.isLogin(player))
        return;
    houses.updatePin(id, pin);
});

mp.events.addRemoteCounted("server:houses:updateSafe", (player, id, pin) => {
    if (!user.isLogin(player))
        return;
    houses.updateSafe(id, pin);
});

mp.events.addRemoteCounted("server:houses:lockStatus", (player, id, lockStatus) => {
    if (!user.isLogin(player))
        return;
    houses.lockStatus(id, lockStatus);
});

//Stocks
mp.events.addRemoteCounted("server:stocks:enter", (player, id) => {
    if (!user.isLogin(player))
        return;
    stocks.enter(player, id);
});

mp.events.addRemoteCounted("server:stocks:enterv", (player, id) => {
    if (!user.isLogin(player))
        return;
    stocks.enterv(player, id);
});

mp.events.addRemoteCounted("server:stocks:enter1", (player, id) => {
    if (!user.isLogin(player))
        return;
    stocks.enter1(player, id);
});

mp.events.addRemoteCounted("server:stocks:enterl", (player, id) => {
    if (!user.isLogin(player))
        return;
    stocks.enterl(player, id);
});

mp.events.addRemoteCounted("server:stocks:enterb", (player, id) => {
    if (!user.isLogin(player))
        return;
    stocks.enterb(player, id);
});

mp.events.addRemoteCounted("server:stocks:enterv1", (player, id) => {
    if (!user.isLogin(player))
        return;
    stocks.enterv1(player, id);
});

mp.events.addRemoteCounted("server:stocks:entervb", (player, id) => {
    if (!user.isLogin(player))
        return;
    stocks.entervb(player, id);
});

mp.events.addRemoteCounted("server:stocks:buy", (player, id) => {
    if (!user.isLogin(player))
        return;
    stocks.buy(player, id);
});

mp.events.addRemoteCounted("server:stocks:updateGarage", (player, id, status) => {
    if (!user.isLogin(player))
        return;
    stocks.updateUpgradeG(id, status);
});

mp.events.addRemoteCounted("server:stocks:upgradeNumber", (player, id, status) => {
    if (!user.isLogin(player))
        return;
    stocks.updateUpgradeN(id, status);
});

mp.events.addRemoteCounted("server:stocks:upgradeLab", (player, id, status) => {
    if (!user.isLogin(player))
        return;
    stocks.updateUpgradeL(id, status);
});

mp.events.addRemoteCounted("server:stocks:upgradeBunker", (player, id, status) => {
    if (!user.isLogin(player))
        return;
    stocks.updateUpgradeB(id, status);
});

mp.events.addRemoteCounted("server:stocks:updatePin", (player, id, pin) => {
    if (!user.isLogin(player))
        return;
    stocks.updatePin(id, pin);
});

mp.events.addRemoteCounted("server:stocks:updatePin1", (player, id, pin) => {
    if (!user.isLogin(player))
        return;
    stocks.updatePin1(id, pin);
});

mp.events.addRemoteCounted("server:stocks:updatePin2", (player, id, pin) => {
    if (!user.isLogin(player))
        return;
    stocks.updatePin2(id, pin);
});

mp.events.addRemoteCounted("server:stocks:updatePin3", (player, id, pin) => {
    if (!user.isLogin(player))
        return;
    stocks.updatePin3(id, pin);
});

mp.events.addRemoteCounted("server:stocks:updatePinO", (player, id, pin) => {
    if (!user.isLogin(player))
        return;
    stocks.updatePinO(id, pin);
});

mp.events.addRemoteCounted("server:stocks:updatePinB", (player, id, pin) => {
    if (!user.isLogin(player))
        return;
    stocks.updatePinB(id, pin);
});

mp.events.addRemoteCounted("server:stocks:updatePinL", (player, id, pin) => {
    if (!user.isLogin(player))
        return;
    stocks.updatePinL(id, pin);
});

mp.events.addRemoteCounted("server:stocks:upgradeAdd", (player, id, slot, box) => {
    if (!user.isLogin(player))
        return;
    stocks.upgradeAdd(player, id, slot, box);
});

mp.events.addRemoteCounted("server:stocks:labStart", (player, id, type, count) => {
    if (!user.isLogin(player))
        return;
    stocks.labStart(id, type, count);
});

mp.events.addRemoteCounted("server:stocks:bunkStart", (player, id, type, count) => {
    if (!user.isLogin(player))
        return;
    stocks.bunkStart(id, type, count);
});

//Condos
mp.events.addRemoteCounted("server:condos:enter", (player, id) => {
    if (!user.isLogin(player))
        return;
    condos.enter(player, id);
});

mp.events.addRemoteCounted("server:condos:buy", (player, id) => {
    if (!user.isLogin(player))
        return;
    condos.buy(player, id);
});

mp.events.addRemoteCounted("server:condos:updatePin", (player, id, pin) => {
    if (!user.isLogin(player))
        return;
    condos.updatePin(id, pin);
});

mp.events.addRemoteCounted("server:condos:updateSafe", (player, id, pin) => {
    if (!user.isLogin(player))
        return;
    condos.updateSafe(id, pin);
});

mp.events.addRemoteCounted("server:condos:lockStatus", (player, id, lockStatus) => {
    if (!user.isLogin(player))
        return;
    condos.lockStatus(id, lockStatus);
});

//Yachts

mp.events.addRemoteCounted("server:yachts:buy", (player, id) => {
    if (!user.isLogin(player))
        return;
    yachts.buy(player, id);
});

mp.events.addRemoteCounted("server:yachts:updateName", (player, id, name) => {
    if (!user.isLogin(player))
        return;
    yachts.updateName(id, name);
});
//Sell
mp.events.addRemoteCounted('server:houses:sell', (player) => {
    if (!user.isLogin(player))
        return;
    houses.sell(player);
});

mp.events.addRemoteCounted('server:condo:sell', (player) => {
    if (!user.isLogin(player))
        return;
    condos.sell(player);
});

mp.events.addRemoteCounted('server:yachts:sell', (player) => {
    if (!user.isLogin(player))
        return;
    yachts.sell(player);
});

mp.events.addRemoteCounted('server:stock:sell', (player) => {
    if (!user.isLogin(player))
        return;
    stocks.sell(player);
});

mp.events.addRemoteCounted('server:stock:sellAllByClass', (player, className, price) => {
    if (!user.isLogin(player))
        return;
    stocks.sellAllByClass(player, className, price);
});

mp.events.addRemoteCounted('server:stock:sellBySlot', (player, slot) => {
    if (!user.isLogin(player))
        return;
    stocks.sellBySlot(player, slot);
});

mp.events.addRemoteCounted('server:stock:openBySlot', (player, slot, boxId) => {
    if (!user.isLogin(player))
        return;
    stocks.openBySlot(player, slot, boxId);
});

mp.events.addRemoteCounted('server:apartments:sell', (player) => {
    if (!user.isLogin(player))
        return;
    //apartments.sell(player); //TODO
});

mp.events.addRemoteCounted('server:yacht:sell', (player) => {
    if (!user.isLogin(player))
        return;
    //apartments.sell(player); //TODO
});

mp.events.addRemoteCounted('server:business:sell', (player) => {
    if (!user.isLogin(player))
        return;
    business.sell(player);
});

mp.events.addRemoteCounted('server:car1:sell', (player) => {
    if (!user.isLogin(player))
        return;
    vehicles.sell(player, 1);
});

mp.events.addRemoteCounted('server:car2:sell', (player) => {
    if (!user.isLogin(player))
        return;
    vehicles.sell(player, 2);
});

mp.events.addRemoteCounted('server:car3:sell', (player) => {
    if (!user.isLogin(player))
        return;
    vehicles.sell(player, 3);
});

mp.events.addRemoteCounted('server:car4:sell', (player) => {
    if (!user.isLogin(player))
        return;
    vehicles.sell(player, 4);
});

mp.events.addRemoteCounted('server:car5:sell', (player) => {
    if (!user.isLogin(player))
        return;
    vehicles.sell(player, 5);
});

mp.events.addRemoteCounted('server:car6:sell', (player) => {
    if (!user.isLogin(player))
        return;
    vehicles.sell(player, 6);
});

mp.events.addRemoteCounted('server:car7:sell', (player) => {
    if (!user.isLogin(player))
        return;
    vehicles.sell(player, 7);
});

mp.events.addRemoteCounted('server:car8:sell', (player) => {
    if (!user.isLogin(player))
        return;
    vehicles.sell(player, 8);
});

mp.events.addRemoteCounted('server:car9:sell', (player) => {
    if (!user.isLogin(player))
        return;
    vehicles.sell(player, 9);
});

mp.events.addRemoteCounted('server:car10:sell', (player) => {
    if (!user.isLogin(player))
        return;
    vehicles.sell(player, 10);
});

mp.events.addRemoteCounted('server:houses:addUser', (player, buyerId) => {
    if (!user.isLogin(player))
        return;
    if (user.get(player, 'house_id') === 0) {
        player.notify('~r~У Вас нет дома');
        return;
    }

    if (user.getCashMoney(player) < 10000) {
        player.notify('~r~У Вас недостаточно средств на руках');
        return;
    }

    let hInfo = houses.getHouseData(user.get(player, 'house_id'));
    if (hInfo.get('user_id') != user.get(player, 'id')) {
        player.notify('~r~Этот дом вам не пренадлежит');
        return;
    }

    let buyer = user.getPlayerById(buyerId);
    if (user.isLogin(buyer)) {

        if (methods.distanceToPos(buyer.position, player.position) > 2) {
            player.notify('~r~Вы слишком далеко');
            return;
        }

        if (user.get(buyer, 'house_id') > 0) {
            player.notify('~r~У игрока уже есть дом');
            buyer.notify('~r~У Вас уже есть дом');
            return;
        }

        houses.getCountLiveUser(user.get(player, 'house_id'), function (count) {
            if (!user.isLogin(player))
                return;
            if (!user.isLogin(buyer))
                return;

            --count;
            if (count == hInfo.get('max_roommate')) {
                player.notify('~r~В вашем доме не осталось места\nЧтобы посделить больше друзей, нужен дом побольше');
                return;
            }

            user.removeCashMoney(player, 10000);
            coffer.addMoney(10000);
            user.set(buyer, 'house_id', user.get(player, 'house_id'));
            player.notify('~b~Вы подселили игрока');
            buyer.notify('~b~Вас подселили в дом');

            user.save(player);
            user.save(buyer);
        });
    }
});

mp.events.addRemoteCounted('server:houses:lawyer:tryaddUser', (player, ownerId, buyerId) => {

    let owner = user.getPlayerById(ownerId);
    if (user.isLogin(owner) && user.isLogin(player)) {
        if (user.get(owner, 'house_id') === 0) {
            owner.notify('~r~У Вас нет дома');
            player.notify('~r~У игрока нет дома');
            return;
        }

        if (user.getCashMoney(owner) < 10000) {
            owner.notify('~r~У Вас недостаточно средств на руках');
            player.notify('~r~У игрока недостаточно средств на руках');
            return;
        }

        if (methods.distanceToPos(owner.position, player.position) > 2) {
            player.notify('~r~Вы слишком далеко');
            return;
        }

        owner.call('client:lawyer:house:accept', [buyerId, user.getId(player)])
    }
});

mp.events.addRemoteCounted('server:houses:userList', (player) => {
    if (!user.isLogin(player))
        return;

    if (user.get(player, 'house_id') === 0) {
        player.notify('~r~У Вас нет дома');
        return;
    }

    let hInfo = houses.getHouseData(user.get(player, 'house_id'));
    if (hInfo.get('user_id') != user.get(player, 'id')) {
        player.notify('~r~Этот дом вам не пренадлежит');
        return;
    }

    let houseId = user.get(player, 'house_id');

    mysql.executeQuery(`SELECT name, is_online, id FROM users WHERE house_id = ${houseId} ORDER BY is_online DESC, name ASC`, function (err, rows, fields) {
        let resultData = new Map();
        rows.forEach(function(item) {
            if (item['is_online'])
                resultData.set(item["id"].toString(), "~g~*~s~ " + item["name"]);
            else
                resultData.set(item["id"].toString(), "~r~*~s~ " + item["name"]);
        });
        player.call('client:showMazeBankHousePeopleListMenu', [Array.from(resultData)]);
    });
});

mp.events.addRemoteCounted('server:houses:lawyer:addUser', (player, lawyerId, buyerId) => {

    let buyer = user.getPlayerById(buyerId);
    let lawyer = user.getPlayerById(lawyerId);
    let owner = player;
    if (user.isLogin(buyer) && user.isLogin(owner) && user.isLogin(lawyer)) {

        if (user.get(owner, 'house_id') === 0) {
            owner.notify('~r~У Вас нет дома');
            return;
        }

        if (user.getCashMoney(owner) < 10000) {
            owner.notify('~r~У Вас недостаточно средств на руках');
            return;
        }

        let hInfo = houses.getHouseData(user.get(owner, 'house_id'));
        if (hInfo.get('user_id') != user.get(owner, 'id')) {
            owner.notify('~r~Этот дом вам не пренадлежит');
            return;
        }

        if (methods.distanceToPos(buyer.position, owner.position) > 2) {
            owner.notify('~r~Вы слишком далеко');
            return;
        }

        if (user.get(buyer, 'house_id') > 0) {
            owner.notify('~r~У игрока уже есть дом');
            buyer.notify('~r~У Вас уже есть дом');
            return;
        }

        houses.getCountLiveUser(user.get(owner, 'house_id'), function (count) {
            if (!user.isLogin(owner))
                return;
            if (!user.isLogin(buyer))
                return;

            --count;
            if (count == hInfo.get('max_roommate')) {
                owner.notify('~r~В вашем доме не осталось места\nЧтобы посделить больше друзей, нужен дом побольше');
                return;
            }

            user.removeCashMoney(owner, 10000);
            user.addCashMoney(lawyer, 8000);
            coffer.addMoney(1, 2000);

            user.set(buyer, 'house_id', user.get(owner, 'house_id'));
            owner.notify('~b~Вы подселили игрока');
            buyer.notify('~b~Вас подселили в дом');
            lawyer.notify('~b~Вы совершили сделку, заработав ~g~$8.000');

            user.save(player);
            user.save(buyer);
        });
    }
});

mp.events.addRemoteCounted('server:houses:removeMe', (player) => {
    if (!user.isLogin(player))
        return;
    if (user.get(player, 'house_id') === 0) {
        player.notify('~r~Вы нигде не живете');
        return;
    }

    if (user.getCashMoney(player) < 1000) {
        player.notify('~r~У Вас недостаточно средств на руках');
        return;
    }

    let hInfo = houses.getHouseData(user.get(player, 'house_id'));
    if (hInfo.get('user_id') == user.get(player, 'id')) {
        player.notify('~r~Это ваш дом, его можно только продать');
        return;
    }

    user.removeCashMoney(player, 1000);
    coffer.addMoney(1000);
    user.set(player, 'house_id', 0);
    player.notify('~r~Вы выселились из дома');
    user.save(player);
});

mp.events.addRemoteCounted('server:house:removeId', (player, userId) => {
    if (!user.isLogin(player))
        return;
    if (user.get(player, 'house_id') === 0) {
        player.notify('~r~Вы нигде не живете');
        return;
    }

    if (user.getCashMoney(player) < 1000) {
        player.notify('~r~У Вас недостаточно средств на руках');
        return;
    }

    let hInfo = houses.getHouseData(user.get(player, 'house_id'));
    if (hInfo.get('user_id') != user.get(player, 'id')) {
        player.notify('~r~Этот дом вам не пренадлежит');
        return;
    }

    user.removeCashMoney(player, 1000);
    coffer.addMoney(1000);

    player.notify('~r~Вы выселили из дома ' + userId);

    let seller = user.getPlayerById(userId);
    if (user.isLogin(seller)) {
        user.set(seller, 'house_id', 0);
        seller.notify('~r~Вас выселил из дома владелец');
        user.save(seller);
    }
    else {
        mysql.executeQuery(`UPDATE users SET house_id = '0' where id = '${userId}'`);
    }
});

mp.events.addRemoteCounted('server:houses:sellToPlayer', (player, buyerId, sum) => {
    if (!user.isLogin(player))
        return;
    if (user.get(player, 'house_id') === 0) {
        player.notify('~r~У Вас нет дома');
        return;
    }

    let hInfo = houses.getHouseData(user.get(player, 'house_id'));
    if (hInfo.get('user_id') != user.get(player, 'id')) {
        player.notify('~r~Этот дом вам не пренадлежит');
        return;
    }

    let buyer = mp.players.at(buyerId);
    if (user.isLogin(buyer)) {

        if (methods.distanceToPos(buyer.position, player.position) > 2) {
            player.notify('~r~Вы слишком далеко');
            return;
        }

        if (user.get(buyer, 'house_id') > 0) {
            player.notify('~r~У игрока уже есть дом');
            buyer.notify('~r~У Вас уже есть дом');
            return;
        }

        let hInfo = houses.getHouseData(user.get(player, 'house_id'));
        buyer.call('client:houses:sellToPlayer', [user.get(player, 'house_id'), `${hInfo.get('address')} #${hInfo.get('number')}`, sum, player.id]);
        buyer.notify('~b~Вам предложили купить дом за ~s~' + methods.moneyFormat(sum));
        player.notify('~b~Вы предложили купить дом игроку');
    }
});

mp.events.addRemoteCounted('server:houses:sellToPlayer:accept', (player, houseId, sum, sellerId) => {
    if (!user.isLogin(player))
        return;
    if (user.get(player, 'house_id') > 0) {
        player.notify('~r~У Вас есть дом');
        return;
    }

    if (user.getCashMoney(player) < sum) {
        player.notify('~r~У Вас нет столько денег');
        return;
    }

    let seller = mp.players.at(sellerId);
    if (user.isLogin(seller)) {

        let hId = user.get(seller, 'house_id');
        if (hId === 0) {
            player.notify('~r~У игрока уже нет дома');
            seller.notify('~r~У Вас нет дома');
            return;
        }

        let hInfo = houses.getHouseData(hId);

        houses.updateOwnerInfo(hId, user.getId(player), user.getRpName(player));
        user.set(player, 'house_id', hId);
        user.set(seller, 'house_id', 0);

        user.addCashMoney(seller, sum);
        user.removeCashMoney(player, sum);

        seller.notify('~b~Вы продали дом за ~s~' + methods.moneyFormat(sum));
        player.notify('~b~Вы купили дом за ~s~' + methods.moneyFormat(sum));

        if (methods.parseInt(sum) < 1000) {
            try {
                methods.saveLog('log_warning',
                    ['name', 'do'],
                    [`${user.getRpName(player)} (${user.getId(player)})`, `BUY HOUSE: ${hId} | PRICE: $${sum} | SELLER: ${user.getRpName(seller)} (${user.getId(seller)})`],
                );
            }
            catch (e) {}
        }

        user.save(player);
        user.save(seller);

        user.addHistory(seller, 3, 'Продал дом ' + hInfo.get('address') + ' №' + hInfo.get('number') + '. Цена: ' + methods.moneyFormat(sum));
        user.addHistory(player, 3, 'Купил дом ' + hInfo.get('address') + ' №' + hInfo.get('number') + '. Цена: ' + methods.moneyFormat(sum));
    }
});

mp.events.addRemoteCounted('server:condo:sellToPlayer', (player, buyerId, sum) => {
    if (!user.isLogin(player))
        return;
    if (user.get(player, 'condo_id') === 0) {
        player.notify('~r~У Вас нет квартиры');
        return;
    }

    let buyer = mp.players.at(buyerId);
    if (user.isLogin(buyer)) {

        if (methods.distanceToPos(buyer.position, player.position) > 2) {
            player.notify('~r~Вы слишком далеко');
            return;
        }

        if (user.get(buyer, 'condo_id') > 0) {
            player.notify('~r~У игрока уже есть квартира');
            buyer.notify('~r~У Вас уже есть квартира');
            return;
        }

        let hInfo = condos.getHouseData(user.get(player, 'condo_id'));
        buyer.call('client:condo:sellToPlayer', [user.get(player, 'condo_id'), `${hInfo.get('address')} #${hInfo.get('number')}`, sum, player.id]);
        buyer.notify('~b~Вам предложили купить квартиру за ~s~' + methods.moneyFormat(sum));
        player.notify('~b~Вы предложили купить квартиру игроку');
    }
});

mp.events.addRemoteCounted('server:condo:sellToPlayer:accept', (player, houseId, sum, sellerId) => {
    if (!user.isLogin(player))
        return;
    if (user.get(player, 'condo_id') > 0) {
        player.notify('~r~У Вас есть квартира');
        return;
    }

    if (user.getCashMoney(player) < sum) {
        player.notify('~r~У Вас нет столько денег');
        return;
    }

    let seller = mp.players.at(sellerId);
    if (user.isLogin(seller)) {

        let hId = user.get(seller, 'condo_id');
        if (hId === 0) {
            player.notify('~r~У игрока уже нет квартиры');
            seller.notify('~r~У Вас нет квартиры');
            return;
        }

        let hInfo = condos.getHouseData(hId);

        condos.updateOwnerInfo(hId, user.getId(player), user.getRpName(player));
        user.set(player, 'condo_id', hId);
        user.set(seller, 'condo_id', 0);

        user.addCashMoney(seller, sum);
        user.removeCashMoney(player, sum);

        seller.notify('~b~Вы продали квартиру за ~s~' + methods.moneyFormat(sum));
        player.notify('~b~Вы купили квартиру за ~s~' + methods.moneyFormat(sum));

        if (methods.parseInt(sum) < 1000) {
            try {
                methods.saveLog('log_warning',
                    ['name', 'do'],
                    [`${user.getRpName(player)} (${user.getId(player)})`, `BUY CONDO: ${hId} | PRICE: $${sum} | SELLER: ${user.getRpName(seller)} (${user.getId(seller)})`],
                );
            }
            catch (e) {}
        }

        user.save(player);
        user.save(seller);

        user.addHistory(seller, 3, 'Продал квартиру ' + hInfo.get('address') + ' №' + hInfo.get('number') + '. Цена: ' + methods.moneyFormat(sum));
        user.addHistory(player, 3, 'Купил квартиру ' + hInfo.get('address') + ' №' + hInfo.get('number') + '. Цена: ' + methods.moneyFormat(sum));
    }
});

mp.events.addRemoteCounted('server:yacht:sellToPlayer', (player, buyerId, sum) => {
    if (!user.isLogin(player))
        return;
    if (user.get(player, 'yacht_id') === 0) {
        player.notify('~r~У Вас нет яхты');
        return;
    }

    let buyer = mp.players.at(buyerId);
    if (user.isLogin(buyer)) {

        if (methods.distanceToPos(buyer.position, player.position) > 2) {
            player.notify('~r~Вы слишком далеко');
            return;
        }

        if (user.get(buyer, 'yacht_id') > 0) {
            player.notify('~r~У игрока уже есть яхта');
            buyer.notify('~r~У Вас уже есть яхта');
            return;
        }

        let hInfo = yachts.getHouseData(user.get(player, 'yacht_id'));
        buyer.call('client:yacht:sellToPlayer', [user.get(player, 'yacht_id'), `${hInfo.get('name')} #${hInfo.get('id')}`, sum, player.id]);
        buyer.notify('~b~Вам предложили купить квартиру за ~s~' + methods.moneyFormat(sum));
        player.notify('~b~Вы предложили купить квартиру игроку');
    }
});

mp.events.addRemoteCounted('server:yacht:sellToPlayer:accept', (player, houseId, sum, sellerId) => {
    if (!user.isLogin(player))
        return;
    if (user.get(player, 'yacht_id') > 0) {
        player.notify('~r~У Вас есть яхта');
        return;
    }

    if (user.getCashMoney(player) < sum) {
        player.notify('~r~У Вас нет столько денег');
        return;
    }

    let seller = mp.players.at(sellerId);
    if (user.isLogin(seller)) {

        let hId = user.get(seller, 'yacht_id');
        if (hId === 0) {
            player.notify('~r~У игрока уже нет яхты');
            seller.notify('~r~У Вас нет яхты');
            return;
        }

        let hInfo = yachts.getHouseData(hId);

        yachts.updateOwnerInfo(hId, user.getId(player), user.getRpName(player));
        user.set(player, 'yacht_id', hId);
        user.set(seller, 'yacht_id', 0);

        user.addCashMoney(seller, sum);
        user.removeCashMoney(player, sum);

        seller.notify('~b~Вы продали яхту за ~s~' + methods.moneyFormat(sum));
        player.notify('~b~Вы купили яхту за ~s~' + methods.moneyFormat(sum));

        if (methods.parseInt(sum) < 1000) {
            try {
                methods.saveLog('log_warning',
                    ['name', 'do'],
                    [`${user.getRpName(player)} (${user.getId(player)})`, `BUY YACHT: ${hId} | PRICE: $${sum} | SELLER: ${user.getRpName(seller)} (${user.getId(seller)})`],
                );
            }
            catch (e) {}
        }

        user.save(player);
        user.save(seller);

        user.addHistory(seller, 3, 'Продал яхту ' + hInfo.get('name') + ' №' + hInfo.get('id') + '. Цена: ' + methods.moneyFormat(sum));
        user.addHistory(player, 3, 'Купил яхту ' + hInfo.get('name') + ' №' + hInfo.get('id') + '. Цена: ' + methods.moneyFormat(sum));
    }
});

mp.events.addRemoteCounted('server:business:sellToPlayer', (player, buyerId, sum) => {
    if (!user.isLogin(player))
        return;
    if (user.get(player, 'business_id') === 0) {
        player.notify('~r~У Вас нет бизнеса');
        return;
    }

    let buyer = mp.players.at(buyerId);
    if (user.isLogin(buyer)) {

        if (methods.distanceToPos(buyer.position, player.position) > 2) {
            player.notify('~r~Вы слишком далеко');
            return;
        }

        if (user.get(buyer, 'business_id') > 0) {
            player.notify('~r~У игрока уже есть бизнес');
            buyer.notify('~r~У Вас уже есть бизнес');
            return;
        }

        if (user.get(buyer, 'age') < 21) {
            player.notify('~r~Игроку должно быть 21 год');
            return false;
        }

        let hInfo = business.getData(user.get(player, 'business_id'));
        buyer.call('client:business:sellToPlayer', [user.get(player, 'business_id'), `${hInfo.get('name')}`, sum, player.id]);
        buyer.notify('~b~Вам предложили купить бизнес за ~s~' + methods.moneyFormat(sum));
        player.notify('~b~Вы предложили купить бизнес игроку');
    }
});

mp.events.addRemoteCounted('server:business:sellToPlayer:accept', (player, houseId, sum, sellerId) => {
    if (!user.isLogin(player))
        return;
    /*if (user.get(player, 'is_gos_blacklist')) { //TODO
        player.notify('~r~Вы состоите в чёрном списке');
        return;
    }*/

    if (user.get(player, 'business_id') > 0) {
        player.notify('~r~У Вас есть бизнес');
        return;
    }

    if (user.getCashMoney(player) < sum) {
        player.notify('~r~У Вас нет столько денег');
        return;
    }

    if (user.get(player, 'reg_status') < 2) {
        player.notify('~r~Необходимо иметь гражданство');
        return false;
    }

    if (!user.get(player, 'biz_lic')) {
        player.notify('~r~У Вас нет лицензии на предпринимательство\nКупить её можно у сотрудников правительства');
        return false;
    }

    if (user.get(player, 'fraction_id') == 1) {
        player.notify('~r~Сотрудникам правительства запрещено покупать бизнес');
        return false;
    }

    let seller = mp.players.at(sellerId);
    if (user.isLogin(seller)) {

        let hId = user.get(seller, 'business_id');
        if (hId === 0) {
            player.notify('~r~У игрока уже нет бизнеса');
            seller.notify('~r~У Вас нет бизнеса');
            return;
        }

        user.achiveDoneAllById(seller, 28);

        let hInfo = business.getData(hId);

        business.updateOwnerInfo(hId, user.getId(player), user.getRpName(player));
        user.set(player, 'business_id', hId);
        user.set(seller, 'business_id', 0);

        user.addCashMoney(seller, sum);
        user.removeCashMoney(player, sum);

        seller.notify('~b~Вы продали бизнес за ~s~' + methods.moneyFormat(sum));
        player.notify('~b~Вы купили бизнес за ~s~' + methods.moneyFormat(sum));

        if (methods.parseInt(sum) < 1000) {
            try {
                methods.saveLog('log_warning',
                    ['name', 'do'],
                    [`${user.getRpName(player)} (${user.getId(player)})`, `BUY BUSINESS: ${hId} | PRICE: $${sum} | SELLER: ${user.getRpName(seller)} (${user.getId(seller)})`],
                );
            }
            catch (e) {}
        }

        user.save(player);
        user.save(seller);

        user.addHistory(seller, 3, 'Продал бизнес ' + hInfo.get('name') + '. Цена: ' + methods.moneyFormat(sum));
        user.addHistory(player, 3, 'Купил бизнес ' + hInfo.get('name') + '. Цена: ' + methods.moneyFormat(sum));
    }
});

mp.events.addRemoteCounted('server:apartments:sellToPlayer', (player, buyerId, sum) => {
    /*if (!user.isLogin(player))
        return;
    if (user.get(player, 'apartment_id') === 0) {
        player.notify('~r~У Вас нет апартаментов');
        return;
    }

    let buyer = mp.players.at(buyerId);
    if (user.isLogin(buyer)) {

        if (methods.distanceToPos(buyer.position, player.position) > 2) {
            player.notify('~r~Вы слишком далеко');
            return;
        }

        if (user.get(buyer, 'apartment_id') > 0) {
            player.notify('~r~У игрока уже есть апартаменты');
            buyer.notify('~r~У Вас уже есть апартаменты');
            return;
        }

        buyer.call('client:apartments:sellToPlayer', [user.get(player, 'apartment_id'), `${hInfo.get('address')} #${hInfo.get('number')}`, sum, player.id]);
        buyer.notify('~b~Вам предложили купить апартаменты за ~s~' + methods.moneyFormat(sum));
        player.notify('~b~Вы предложили купить апартаменты игроку');
    }*/
});

mp.events.addRemoteCounted('server:apartments:sellToPlayer:accept', (player, houseId, sum, sellerId) => {
    /*if (!user.isLogin(player))
        return;
    if (user.get(player, 'apartment_id') > 0) {
        player.notify('~r~У Вас есть апартаменты');
        return;
    }

    if (user.getCashMoney(player) < sum) {
        player.notify('~r~У Вас нет столько денег');
        return;
    }

    let seller = mp.players.at(sellerId);
    if (user.isLogin(seller)) {

        let hId = user.get(seller, 'apartment_id');
        if (hId === 0) {
            player.notify('~r~У игрока уже нет апартаментов');
            seller.notify('~r~У Вас нет апартаментов');
            return;
        }

        apartments.updateOwnerInfo(hId, user.getId(player), user.getRpName(player));
        user.set(player, 'apartment_id', hId);
        user.set(seller, 'apartment_id', 0);

        user.addCashMoney(seller, sum);
        user.removeCashMoney(player, sum);

        seller.notify('~b~Вы продали апартаменты за ~s~' + methods.moneyFormat(sum));
        player.notify('~b~Вы купили апартаменты за ~s~' + methods.moneyFormat(sum));

        user.save(player);
        user.save(seller);

        user.addHistory(seller, 3, 'Продал апартаменты ' + hInfo.get('name') + '. Цена: ' + methods.moneyFormat(sum));
        user.addHistory(player, 3, 'Купил апартаменты ' + hInfo.get('name') + '. Цена: ' + methods.moneyFormat(sum));
    }*/
});

mp.events.addRemoteCounted('server:stock:sellToPlayer', (player, buyerId, sum) => {
    if (!user.isLogin(player))
        return;
    if (user.get(player, 'stock_id') === 0) {
        player.notify('~r~У Вас нет склада');
        return;
    }

    let buyer = mp.players.at(buyerId);
    if (user.isLogin(buyer)) {

        if (methods.distanceToPos(buyer.position, player.position) > 2) {
            player.notify('~r~Вы слишком далеко');
            return;
        }

        if (user.get(buyer, 'stock_id') > 0) {
            player.notify('~r~У игрока уже есть склад');
            buyer.notify('~r~У Вас уже есть склад');
            return;
        }

        let hInfo = stocks.getData(user.get(player, 'stock_id'));
        buyer.call('client:stock:sellToPlayer', [user.get(player, 'stock_id'), `${hInfo.get('address')} #${hInfo.get('number')}`, sum, player.id]);
        buyer.notify('~b~Вам предложили купить склад за ~s~' + methods.moneyFormat(sum));
        player.notify('~b~Вы предложили купить склад игроку');
    }
});

mp.events.addRemoteCounted('server:stock:sellToPlayer:accept', (player, houseId, sum, sellerId) => {
    if (!user.isLogin(player))
        return;
    if (user.get(player, 'stock_id') > 0) {
        player.notify('~r~У Вас есть склад');
        return;
    }

    if (user.getCashMoney(player) < sum) {
        player.notify('~r~У Вас нет столько денег');
        return;
    }

    let seller = mp.players.at(sellerId);
    if (user.isLogin(seller)) {

        let hId = user.get(seller, 'stock_id');
        if (hId === 0) {
            player.notify('~r~У игрока уже нет склада');
            seller.notify('~r~У Вас нет склада');
            return;
        }

        let hInfo = stocks.getData(hId);

        stocks.updateOwnerInfo(hId, user.getId(player), user.getRpName(player));
        user.set(player, 'stock_id', hId);
        user.set(seller, 'stock_id', 0);

        user.addCashMoney(seller, sum);
        user.removeCashMoney(player, sum);

        seller.notify('~b~Вы продали склад за ~s~' + methods.moneyFormat(sum));
        player.notify('~b~Вы купили склад за ~s~' + methods.moneyFormat(sum));

        if (methods.parseInt(sum) < 1000) {
            try {
                methods.saveLog('log_warning',
                    ['name', 'do'],
                    [`${user.getRpName(player)} (${user.getId(player)})`, `BUY STOCK: ${hId} | PRICE: $${sum} | SELLER: ${user.getRpName(seller)} (${user.getId(seller)})`],
                );
            }
            catch (e) {}
        }

        user.save(player);
        user.save(seller);

        user.addHistory(seller, 3, 'Продал склад ' + hInfo.get('address') + ' №' + hInfo.get('number') + '. Цена: ' + methods.moneyFormat(sum));
        user.addHistory(player, 3, 'Купил склад ' + hInfo.get('address') + ' №' + hInfo.get('number') + '. Цена: ' + methods.moneyFormat(sum));
    }
});

mp.events.addRemoteCounted('server:car:takeOffsetMoney', (player, slot) => {
    if (!user.isLogin(player))
        return;

    if (user.get(player, 'car_id' + slot) == 0) {
        player.notify('~r~У Вас нет транспорта');
        return;
    }

    let vData = vehicles.getData(user.get(player, 'car_id' + slot));
    let vInfo = methods.getVehicleInfo(vData.get('name'));
    let offset = vData.get('price') - vInfo.price;
    user.addMoney(player, offset, 'Возмещение ущерба за транспорт');
    vehicles.updatePrice(vData.get('id'), vInfo.price);
    player.notify('~y~Вам возместили ущерб за измененную цену на транспорт в размере ' + methods.moneyFormat(offset));
});

mp.events.addRemoteCounted('server:car:giveOffsetMoney', (player, slot) => {
    if (!user.isLogin(player))
        return;

    if (user.get(player, 'car_id' + slot) == 0) {
        player.notify('~r~У Вас нет транспорта');
        return;
    }

    let vData = vehicles.getData(user.get(player, 'car_id' + slot));
    let vInfo = methods.getVehicleInfo(vData.get('name'));
    let offset = vInfo.price - vData.get('price');
    if (user.getMoney(player) < offset) {
        player.notify(`~r~У Вас при себе ${methods.moneyFormat(offset)}`);
        return;
    }
    user.removeMoney(player, offset, 'Возмещение ущерба за транспорт');
    vehicles.updatePrice(vData.get('id'), vInfo.price);
    player.notify('~y~Вы возсместили сумму, за измененную цену на транспорт в размере ' + methods.moneyFormat(offset) + '.\nТеперь вы можете продавать транспорт с рук');
});

mp.events.addRemoteCounted('server:car:sellToBu', (player, price, slot) => {
    if (!user.isLogin(player))
        return;

    if (user.get(player, 'car_id' + slot) == 0) {
        player.notify('~r~У Вас нет транспорта');
        return;
    }

    let freePos = vehicles.getFreeSellAutoPos();
    if (freePos[0] === 0) {
        player.notify('~y~Нет свободных мест на авторынке');
        user.addCashMoney(player, 1000, 'Возврат средств БУ авторынка');
        return;
    }

    let vId = user.get(player, 'car_id' + slot);
    vehicles.set(vId, 'sell_price', price);
    vehicles.respawnById(vId);
    vehicles.save(vId);
    player.notify('~y~Вы выставили транспорт на продажу');
});

mp.events.addRemoteCounted('server:car:sellFromBu', (player, slot) => {
    if (!user.isLogin(player))
        return;

    if (user.get(player, 'car_id' + slot) == 0) {
        player.notify('~r~У Вас нет транспорта');
        return;
    }

    let vId = user.get(player, 'car_id' + slot);
    vehicles.set(vId, 'sell_price', 0);
    mp.vehicles.forEach(v => {
        if (v.getVariable('vid') == vId) {
            v.setVariable('useless', undefined);
            vehicles.save(vId);
            vehicles.respawn(v);
            player.notify('~y~Вы убрали транспорт с продажи\n~g~Ваш транспорт скоро будет на парковочном месте');
        }
    });
});

mp.events.addRemoteCounted('server:car:sellToPlayer', (player, buyerId, sum, slot) => {
    if (!user.isLogin(player))
        return;

    if (user.get(player, 'car_id' + slot) == 0) {
        player.notify('~r~У Вас нет транспорта');
        return;
    }

    let buyer = mp.players.at(buyerId);
    if (user.isLogin(buyer)) {

        if (methods.distanceToPos(buyer.position, player.position) > 2) {
            player.notify('~r~Вы слишком далеко');
            return;
        }

        let isValid = user.getVehicleFreeSlot(buyer) > 0;
        if (isValid) {
            let vInfo = vehicles.getData(user.get(player, 'car_id' + slot));
            buyer.call('client:car:sellToPlayer', [user.get(player, 'car_id' + slot), vInfo.get('name'), sum, player.id, slot]);
            buyer.notify('~b~Вам предложили купить ' + vInfo.get('name') + ' за ~s~' + methods.moneyFormat(sum));
            player.notify('~b~Вы предложили купить ' + vInfo.get('name') + ' игроку');
        }
        else {
            buyer.notify('~r~У Вас нет доступных свободных слотов');
            player.notify('~r~У игрока нет доступных слотов под ТС');
        }
    }
});

mp.events.addRemoteCounted('server:car:sellToPlayer:accept', (player, houseId, sum, sellerId, slot) => {
    if (!user.isLogin(player))
        return;

    let slotBuy = user.getVehicleFreeSlot(player);

    /*let slotBuy = 0;
    for (let i = 1; i <= 10; i++) {
        if (user.get(player, 'car_id' + i) == 0 && freeSlot == 0) {
            slotBuy = 1;
            break;
        }
    }*/

    if (slotBuy === 0) {
        player.notify('~r~У Вас нет доступных слотов');
        return;
    }

    if (user.getCashMoney(player) < sum) {
        player.notify('~r~У Вас нет столько денег');
        return;
    }

    let seller = mp.players.at(sellerId);
    if (user.isLogin(seller)) {

        let hId = user.get(seller, 'car_id' + slot);
        if (hId === 0) {
            player.notify('~r~У игрока уже нет транспорта');
            seller.notify('~r~У Вас нет транспорта');
            return;
        }

        let vInfo = vehicles.getData(hId);

        vehicles.updateOwnerInfo(hId, user.getId(player), user.getRpName(player));
        user.set(player, 'car_id' + slotBuy, hId);
        user.set(seller, 'car_id' + slot, 0);

        user.addCashMoney(seller, sum);
        user.removeCashMoney(player, sum);

        seller.notify('~b~Вы продали ТС за ~s~' + methods.moneyFormat(sum));
        player.notify('~b~Вы купили ТС за ~s~' + methods.moneyFormat(sum));

        if (methods.parseInt(sum) < 1000) {
            try {
                methods.saveLog('log_warning',
                    ['name', 'do'],
                    [`${user.getRpName(player)} (${user.getId(player)})`, `BUY CAR: ${hId} | PRICE: $${sum} | SELLER: ${user.getRpName(seller)} (${user.getId(seller)})`],
                );
            }
            catch (e) {}
        }

        user.save(player);
        user.save(seller);

        user.addHistory(seller, 3, 'Продал транспорт ' + vInfo.get('name') + ' | ' + vInfo.get('number') + '. Цена: ' + methods.moneyFormat(sum));
        user.addHistory(player, 3, 'Купил транспорт ' + vInfo.get('name') + ' | ' + vInfo.get('number') + '. Цена: ' + methods.moneyFormat(sum));
    }
});

mp.events.addRemoteCounted('server:car:buyBot', (player, remoteId, vid, payType) => {
    if (!user.isLogin(player))
        return;

    let slotBuy = user.getVehicleFreeSlot(player);

    if (slotBuy === 0) {
        player.notify('~r~У Вас нет доступных слотов');
        return;
    }

    let vData = vehicles.getData(vid);
    let sum = vData.get('sell_price');

    if (sum === 0) {
        player.notify('~r~Транспорт был убран с продажи');
        return;
    }

    if (user.getMoney(player, payType) < sum) {
        player.notify('~r~У Вас нет столько денег');
        return;
    }

    let seller = user.getPlayerById(vData.get('user_id'));
    if (user.isLogin(seller)) {

        let slot = 0;
        for (let i = 1; i <= 10; i++) {
            if (user.get(seller, 'car_id' + i) === vid) {
                slot = i;
                break;
            }
        }
        
        if (slot === 0) {
            player.notify('~r~Ошибка покупки транспорта');
            return;
        }

        vehicles.updateOwnerInfo(vid, user.getId(player), user.getRpName(player));
        user.set(player, 'car_id' + slotBuy, vid);
        user.set(seller, 'car_id' + slot, 0);

        user.addCashMoney(seller, sum * 0.99);
        user.removeMoney(player, sum, `Покупка транспорта ${vData.get('name')}`, payType);

        seller.notify(`~b~Вы продали ${vData.get('name')} за ~s~` + methods.moneyFormat(sum * 0.99));
        player.notify('~b~Вы купили ТС за ~s~' + methods.moneyFormat(sum));

        if (methods.parseInt(sum) < 1000) {
            try {
                methods.saveLog('log_warning',
                    ['name', 'do'],
                    [`${user.getRpName(player)} (${user.getId(player)})`, `BUY CAR: ${vid} | PRICE: $${sum} | SELLER: ${user.getRpName(seller)} (${user.getId(seller)})`],
                );
            }
            catch (e) {}
        }

        user.save(player);
        user.save(seller);

        user.addHistory(seller, 3, 'Продал транспорт ' + vData.get('name') + ' | ' + vData.get('number') + '. Цена: ' + methods.moneyFormat(sum));
        user.addHistory(player, 3, 'Купил транспорт ' + vData.get('name') + ' | ' + vData.get('number') + '. Цена: ' + methods.moneyFormat(sum));
    }
    else {
        player.notify('~r~Игрок не в сети');
    }
});

mp.events.addRemoteCounted("server:vShop:buy", (player, name, color1, color2, shopId, payType) => {
    if (!user.isLogin(player))
        return;
    vShop.buy(player, name, color1, color2, shopId, payType);
});

mp.events.addRemoteCounted("server:vShop:rent", (player, name, color1, color2, shopId) => {
    if (!user.isLogin(player))
        return;
    vShop.rent(player, name, color1, color2, shopId);
});

mp.events.addRemoteCounted("playerEnterCheckpoint", (player, checkpoint) => {
    if (!user.isLogin(player))
        return;
    if (Container.Data.Has(999999, 'checkpointLabel' + checkpoint.id))
        player.notify(Container.Data.Get(999999, 'checkpointLabel' + checkpoint.id).toString());
});

mp.events.add("client:enterStaticCheckpoint", (player, checkpointId) => {
    methods.debug('CP', checkpointId);
    if (!user.isLogin(player))
        return;
    if (Container.Data.Has(999999, 'checkpointStaticLabel' + checkpointId))
        player.notify(Container.Data.Get(999999, 'checkpointStaticLabel' + checkpointId).toString());
});

mp.events.add("client:exitStaticCheckpoint", (player, checkpointId) => {
    if (!user.isLogin(player))
        return;
    if (Container.Data.Has(999999, 'resetTunning' + checkpointId)) {
        if (player.vehicle && player.vehicle.getVariable('user_id') > 0)
            vehicles.setTunning(player.vehicle);
    }
});

mp.events.addRemoteCounted('server:fixCheckpointList', (player) => {
    methods.updateCheckpointList(player);
});

mp.events.addRemoteCounted('server:updateVehicleInfo', player => {
    user.updateVehicleInfo(player);
});

mp.events.add("server:pSync:fpUpdate", (player, camPitch, camHeading) => {
    try {
        mp.players.call(player.streamedPlayers, "client:pSync:fpUpdate", [player.id, camPitch, camHeading]);
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:fraction:getDrugSpeedo', (player) => {
    if (!user.isLogin(player))
        return;
    fraction.spawnNearCargo(player, true);
});

mp.events.addRemoteCounted('server:fraction:getLamarSpeedo', (player) => {
    if (!user.isLogin(player))
        return;
    fraction.spawnNearCargo(player);
});

mp.events.addRemoteCounted('server:fraction:getLamarMule', (player) => {
    if (!user.isLogin(player))
        return;
    fraction.spawnNearCargo(player, false, 'Mule4', 5);
});

mp.events.addRemoteCounted('server:fraction:getBankVeh', (player, type) => {
    if (!user.isLogin(player))
        return;
    fraction.spawnNearBank(player, type);
});

mp.events.addRemoteCounted('server:fraction:getDrugCanabisSpeedo', (player) => {
    if (!user.isLogin(player))
        return;
    fraction.spawnNearCanabis(player);
});

mp.events.addRemoteCounted('server:fraction:getLamarPistol', (player) => {
    if (!user.isLogin(player))
        return;
    fraction.spawnNearGuns(player, 0);
});

mp.events.addRemoteCounted('server:fraction:getLamarAmmo', (player) => {
    if (!user.isLogin(player))
        return;
    fraction.spawnNearGuns(player, 1);
});


mp.events.addRemoteCounted('server:fraction:getLamarRifle', (player) => {
    if (!user.isLogin(player))
        return;
    fraction.spawnNearGuns(player, 2);
});

mp.events.addRemoteCounted('server:fraction:vehicleNewRank', (player, id, rank) => {

    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    rank = methods.parseInt(rank);

    mp.vehicles.forEach(veh => {
        if (veh.getVariable('veh_id') == id)
            veh.setVariable('rank', rank);
    });

    vehicles.fractionList.forEach((item, i) => {
        if (item.id == id)
            vehicles.fractionList[i].rank = rank;
    });

    mysql.executeQuery(`UPDATE cars_fraction SET rank = '${rank}' where id = '${id}'`);
    player.notify('~b~Вы изменили доступ к транспорту');
});

mp.events.addRemoteCounted('server:fraction:vehicleNewDep', (player, id, dep) => {

    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    dep = methods.parseInt(dep);
    let rank = enums.fractionListId[user.get(player, 'fraction_id')].rankList[dep].length - 1;

    mp.vehicles.forEach(veh => {
        if (veh.getVariable('veh_id') == id)
        {
            veh.setVariable('rank_type', dep);
            veh.setVariable('rank', rank);
        }
    });

    vehicles.fractionList.forEach((item, i) => {
        if (item.id == id) {
            vehicles.fractionList[i].rank_type = dep;
            vehicles.fractionList[i].rank = rank;
        }
    });

    mysql.executeQuery(`UPDATE cars_fraction SET rank = '${rank}', rank_type = '${dep}' where id = '${id}'`);
    player.notify('~b~Вы перевели транспорт в другой отдел');
});

mp.events.addRemoteCounted('server:fraction:vehicleRespawn', (player, id) => {
    if (!user.isLogin(player))
        return;
    mp.vehicles.forEach(veh => {
        try {
            if (veh.getVariable('veh_id') == id)
                vehicles.respawn(veh)
        }
        catch (e) {}
    });
    player.notify('~b~Транспорт был зареспавнен');
});

mp.events.addRemoteCounted('server:fraction:getDrugVans', (player) => {
    if (!user.isLogin(player))
        return;
    let fractionId = 9;
    let currentMed = coffer.get(fractionId, 'stock_med');
    if (currentMed < 500) {
        player.notify('~r~На складе недостаточно медикаментов');
        return;
    }
    coffer.set(fractionId, 'stock_med', coffer.get(fractionId, 'stock_med') - 500);
    user.setWaypoint(player, 4981.1748046875, -5750.0791015625);
    fraction.spawnCargo('Youga3', [39], 4981.1748046875, -5750.0791015625, 20.05645751953125, 318.7510070800781);
    player.notify('~g~Метка на транспорт установлена');
});

mp.events.addRemoteCounted('server:fraction:vehicleBuy', (player, id, price) => {

    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    price = methods.parseInt(price);
    let fractionId = user.get(player, 'fraction_id');

    let cofferId = coffer.getIdByFraction(fractionId);
    if (coffer.getMoney(cofferId) < price) {
        player.notify('~r~В бюджете организации не достаточно средств');
        return;
    }

    mysql.executeQuery(`SELECT * FROM cars_fraction WHERE id = '${id}'`, function (err, rows, fields) {
        rows.forEach(function (item) {

            let v = {
                id: item['id'],
                x: item['x'], y: item['y'], z: item['z'], rot: item['rot'],
                name: item['name'], hash: item['hash'], price: item['price'],
                number: item['number'], is_default: item['is_default'], color: item['color'],
                rank_type: item['rank_type'], rank: item['rank'], fraction_id: item['fraction_id']
            };
            vehicles.fractionList.push(v);

            methods.saveFractionLog(
                user.getRpName(player),
                `Купил транспорт ${item['name']}`,
                `Потрачено из бюджета: ${methods.moneyFormat(price)}`,
                fractionId
            );

            player.notify(`~b~Вы купили ${item['name']} для организации по цене ${methods.moneyFormat(item['price'])}`);
        });
    });

    coffer.removeMoney(cofferId, price);
    coffer.addMoney(1, price);

    coffer.saveAll();

    mysql.executeQuery(`UPDATE cars_fraction SET is_buy = '1' where id = '${id}'`);
});

mp.events.addRemoteCounted('server:fraction:vehicleSell', (player, id, price) => {

    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    price = methods.parseInt(price);
    let fractionId = user.get(player, 'fraction_id');

    let cofferId = coffer.getIdByFraction(fractionId);

    coffer.addMoney(cofferId, price);
    coffer.removeMoney(1, price);

    vehicles.fractionList.forEach((item, i) => {
        if (item.id == id) {
            vehicles.fractionList[i].fraction_id = 0;
        }
    });

    coffer.saveAll();

    mysql.executeQuery(`SELECT * FROM cars_fraction WHERE id = '${id}'`, function (err, rows, fields) {
        rows.forEach(function (item) {
            methods.saveFractionLog(
                user.getRpName(player),
                `Продал транспорт ${item['name']}`,
                `Получено в бюджет: ${methods.moneyFormat(price)}`,
                fractionId
            );
        });
    });

    mysql.executeQuery(`UPDATE cars_fraction SET is_buy = '0' where id = '${id}'`);
    player.notify(`~b~Вы продали транспорт организации по цене ${methods.moneyFormat(price)}`);
});

mp.events.addRemoteCounted('server:fraction:vehicleBuy2', (player, id, price) => {

    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    price = methods.parseInt(price);
    let fractionId = user.get(player, 'fraction_id2');

    if (user.getBankMoney(player) < price) {
        player.notify('~r~У вас недостаточно средств на банковском счету');
        return;
    }

    mysql.executeQuery(`SELECT * FROM cars_fraction WHERE fraction_id = '${fractionId * -1}'`, function (err, rows2, fields) {
        if (rows2.length > 11) {
            player.notify('~r~Доступно только 10 транспортных средств');
            return;
        }

        mysql.executeQuery(`SELECT * FROM cars_fraction WHERE id = '${id}'`, function (err, rows, fields) {
            rows.forEach(function (item) {

                let v = {
                    id: item['id'],
                    x: item['x'], y: item['y'], z: item['z'], rot: item['rot'],
                    name: item['name'], hash: item['hash'], price: item['price'],
                    number: item['number'], is_default: item['is_default'], color: item['color'],
                    rank_type: item['rank_type'], rank: item['rank'], fraction_id: fractionId * -1
                };
                vehicles.fractionList.push(v);
                player.notify(`~b~Вы купили ${item['name']} для организации по цене ${methods.moneyFormat(item['price'])}`);

                vehicles.spawnFractionCar(item['id']);

                user.removeBankMoney(player, price, 'Купил транспорт для организации');
                coffer.addMoney(1, price);

                mysql.executeQuery(`UPDATE cars_fraction SET is_buy = '1', fraction_id = '${fractionId * -1}' where id = '${id}'`);
            });
        });
    });
});

mp.events.addRemoteCounted('server:fraction:vehicleSell2', (player, id, price) => {

    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    price = methods.parseInt(price);
    let fractionId = user.get(player, 'fraction_id');

    user.addMoney(fractionId, price, 'Продал транспорт организации');
    coffer.removeMoney(1, price);

    vehicles.fractionList = vehicles.fractionList.filter(item => item.id !== id);

    mp.vehicles.forEach(veh => {
        try {
            if (veh.getVariable('veh_id') == id)
                veh.destroy();
        }
        catch (e) {}
    });

    mysql.executeQuery(`UPDATE cars_fraction SET is_buy = '0', fraction_id = '0', x = '0', y = '0', z = '0', rot = '0', color = '0' where id = '${id}'`);
    player.notify(`~b~Вы продали транспорт организации по цене ${methods.moneyFormat(price)}`);
});

mp.events.addRemoteCounted('server:fraction:vehicleFind2', (player, id) => {
    if (!user.isLogin(player))
        return;
    id = methods.parseInt(id);
    mp.vehicles.forEach(veh => {
        try {
            if (veh.getVariable('veh_id') == id)
                user.setWaypoint(player, veh.position.x, veh.position.y)
        }
        catch (e) {}
    });
});

mp.events.addRemoteCounted('server:vehicle:spawnFractionCar', (player, id) => {
    if (!user.isLogin(player))
        return;
    vehicles.spawnFractionCar(id);
    player.notify('~b~Транспорт стоит на парковке, возьмите его');
});

mp.events.addRemoteCounted('server:user:uninvite', (player, id) => {

    if (!user.isLogin(player))
        return;

    if (!user.isLeader(player) && !user.isSubLeader(player)) {
        player.notify('~r~Вы не лидер чтобы уволнять или зам лидера');
        return;
    }

    id = methods.parseInt(id);
    let target = user.getPlayerById(id);
    if (user.isLogin(target)) {

        user.addHistory(target, 0, 'Был уволен из организации ' + methods.getFractionName(user.get(player, 'fraction_id')) + '. Уволил: ' + user.getRpName(player));

        user.set(target, 'rank', 0);
        user.set(target, 'rank_type', 0);
        user.set(target, 'fraction_id', 0);
        user.set(target, 'is_leader', false);
        user.set(target, 'is_sub_leader', false);

        user.setFractionId(target, 0);

        target.notify('~r~Вас уволили из организации');
        player.notify('~b~Вы уволили сотрудника: ~s~' + user.getRpName(target));

        user.save(target);
    }
    else {
        mysql.executeQuery(`UPDATE users SET rank = '0', rank_type = '0', fraction_id = '0', is_sub_leader = '0' where id = '${id}' AND is_leader <> 1`);
        player.notify('~b~Вы уволили сотрудника');
        user.addHistoryById(id, 0, 'Был уволен из организации ' + methods.getFractionName(user.get(player, 'fraction_id')) + '. Уволил: ' + user.getRpName(player));
    }
});

mp.events.addRemoteCounted('server:user:uninvite2', (player, id) => {

    if (!user.isLogin(player))
        return;

    if (!user.isLeader2(player) && !user.isSubLeader2(player)) {
        player.notify('~r~Вы не лидер чтобы уволнять или зам лидера');
        return;
    }

    id = methods.parseInt(id);
    let target = user.getPlayerById(id);
    if (user.isLogin(target)) {

        user.set(target, 'rank2', 0);
        user.set(target, 'rank_type2', 0);
        user.set(target, 'fraction_id2', 0);
        user.set(target, 'is_leader2', false);
        user.set(target, 'is_sub_leader2', false);

        user.setFractionId2(target, 0);

        target.notify('~r~Вас уволили из организации');
        player.notify('~b~Вы уволили сотрудника: ~s~' + user.getRpName(target));

        user.save(target);
    }
    else {
        mysql.executeQuery(`UPDATE users SET rank2 = '0', rank_type2 = '0', fraction_id2 = '0', is_sub_leader2 = '0' where id = '${id}' AND is_leader2 <> 1`);
        player.notify('~b~Вы уволили сотрудника');
    }
});

mp.events.addRemoteCounted('server:user:uninviteF', (player, id) => {

    if (!user.isLogin(player))
        return;

    if (!user.isLeaderF(player) && !user.isSubLeaderF(player)) {
        player.notify('~r~Вы не лидер чтобы уволнять или зам лидера');
        return;
    }

    id = methods.parseInt(id);
    let target = user.getPlayerById(id);
    if (user.isLogin(target)) {

        user.set(target, 'rankf', 0);
        user.set(target, 'rank_typef', 0);
        user.set(target, 'family_id', 0);
        user.set(target, 'is_leaderf', false);
        user.set(target, 'is_sub_leaderf', false);

        user.setFamilyId(target, 0);

        target.notify('~r~Вас выгнали из семьи');
        player.notify('~b~Вы уволили: ~s~' + user.getRpName(target));

        user.save(target);
    }
    else {
        mysql.executeQuery(`UPDATE users SET rankа = '0', rank_typeа = '0', family_id = '0', is_sub_leaderа = '0' where id = '${id}' AND is_leaderа <> 1`);
        player.notify('~b~Вы уволили члена семьи');
    }
});

mp.events.addRemoteCounted('server:user:askSellLic', (player, id, lic, price) => {

    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    price = methods.parseFloat(price);
    let target = mp.players.at(id);
    if (user.isLogin(target)) {

        if (methods.distanceToPos(target.position, player.position) > 5) {
            player.notify('~r~Вы слишком далеко друг от друга');
            return;
        }

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
                licName = 'Разрешение на рыбаловство';
                break;
            case 'marg_lic':
                licName = 'Разрешение на употребление марихуаны';
                break;
            case 'med_lic':
                licName = 'Мед. страховка';
                break;
        }

        target.call('client:menuList:showAskBuyLicMenu', [player.id, lic, licName, price])
    }
    else {
        player.notify('~r~Игрок не найден');
    }
});

mp.events.addRemoteCounted('server:user:askSellRLic', (player, id, lic) => {

    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);

    let target = user.getPlayerById(id);
    if (user.isLogin(target)) {
        user.set(target, lic, false);

        methods.saveFractionLog(
            user.getRpName(target),
            `Изъял "${methods.getLicName(lic)}" гражданина ${user.getRpName(player)}`,
            ``,
            user.get(target, 'fraction_id')
        );
        user.addHistory(player, 4, `Изъяли ${methods.getLicName(lic)} (${user.getRpName(player)})`);

        player.notify('~g~Вы изъяли лицензию');
    }
    else {
        mysql.executeQuery(`UPDATE users SET ${lic} = '0' WHERE id ='${methods.parseInt(id)}'`);
        user.addHistoryById(id, 4, `Изъяли ${methods.getLicName(lic)} (${user.getRpName(player)})`);
        player.notify('~g~Вы изъяли лицензию');
    }
});

mp.events.addRemoteCounted('server:user:buyLicensePlayer', (player, id, lic, price) => {

    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    price = methods.parseFloat(price);
    let target = mp.players.at(id);
    if (user.isLogin(target)) {

        if (methods.distanceToPos(target.position, player.position) > 5) {
            player.notify('~r~Вы слишком далеко друг от друга');
            return;
        }

        if (user.getMoney(player) < price) {
            player.notify('~r~У Вас не достаточно средств');
            return;
        }

        user.removeMoney(player, price, 'Покупка лицензии');
        user.addMoney(target, price * 0.2, 'Продажа лицензии лицензии');
        coffer.addMoney(coffer.getIdByFraction(user.get(target, 'fraction_id')), price * 0.8);

        methods.saveFractionLog(
            user.getRpName(target),
            `Выдал "${methods.getLicName(lic)}" гражданину ${user.getRpName(player)}`,
            `Пополнение бюджета: ${methods.moneyFormat(price * 0.8)}`,
            user.get(target, 'fraction_id')
        );

        user.giveLic(player, lic, 24, `Выдал: ${user.getRpName(target)}`);
        player.notify('~g~Поздравляем с покупкой ~s~' + methods.getLicName(lic));
        target.notify(`~g~Вы заработали ${methods.moneyFormat(price * 0.2)}\n~g~В бюджет организации поступило ${methods.moneyFormat(price * 0.8)}`);
    }
    else {
        player.notify('~r~Игрок не найден');
    }
});

mp.events.addRemoteCounted('server:user:giveMeWanted', (player, level, reason) => {
    if (!user.isLogin(player))
        return;
    user.giveWanted(player, level, reason);
});

mp.events.addRemoteCounted('server:user:giveVehicle', (player, vName, withDelete, withChat, desc, isBroke) => {
    if (!user.isLogin(player))
        return;
    user.giveVehicle(player, vName, withDelete, withChat, desc, isBroke);
});

mp.events.addRemoteCounted('server:user:giveRandomMask', (player) => {
    if (!user.isLogin(player))
        return;
    user.giveRandomMask(player);
});

mp.events.addRemoteCounted('server:user:spawnToFraction', (player) => {
    if (!user.isLogin(player))
        return;
    try {
        user.setHealth(player, 100);
        let fData = fraction.getData(user.get(player, 'fraction_id2'));
        player.spawn(new mp.Vector3(fData.get('spawn_x'), fData.get('spawn_y'), fData.get('spawn_z')));
        player.heading = fData.get('spawn_rot');
    }
    catch (e) {
        user.setHealth(player, 100);
        player.spawn(320.7169494628906, -584.0098876953125, 42.28400802612305);
    }
});

mp.events.addRemoteCounted('server:user:giveWanted', (player, id, level, reason) => {
    if (!user.isLogin(player))
        return;
    try {
        let p = user.getPlayerById(id);
        if (user.isLogin(p)) {
            if (reason == 'clear') {

                methods.saveFractionLog(
                    user.getRpName(player),
                    `Очистил розыск гражданину ${user.getRpName(p)}`,
                    ``,
                    user.get(player, 'fraction_id')
                );

                player.notify('~g~Вы очистили розыск');
            }
            else {
                player.notify('~g~Вы выдали розыск');

                methods.saveFractionLog(
                    user.getRpName(player),
                    `Выдал розыск гражданину ${user.getRpName(p)}`,
                    ``,
                    user.get(player, 'fraction_id')
                );
            }

            methods.saveLog('log_give_wanted',
                ['user_from', 'user_to', 'lvl', 'reason'],
                [`${user.getRpName(player)} (${user.getId(player)})`, `${user.getRpName(p)} (${user.getId(p)})`, level, methods.removeQuotes(methods.removeQuotes2(reason))],
            );
            user.giveWanted(p, level, reason, user.getRpName(player));
        }
        else
            player.notify('~r~Игрок не найден');
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:user:arrest', (player, id) => {
    if (!user.isLogin(player))
        return;
    try {
        let p = mp.players.at(id);
        if (user.isLogin(p)) {

            if (methods.distanceToPos(p.position, player.position) > 10) {
                player.notify('~r~Вы слишком далеко друг от друга');
                return;
            }

            if (!user.isLogin(p) || user.get(p, 'wanted_level') <= 0) {
                player.notify('~r~У игрока нет розыска');
                return;
            }
            if (user.get(p, 'jail_time') > 0) {
                player.notify('~r~Игрок уже в тюрьме');
                return;
            }
            coffer.addMoney(coffer.getIdByFraction(user.get(player, 'fraction_id'), 1500));
            user.addMoney(player, 1500, 'Премия');
            player.notify('~g~Вы произвели арест. Премия: ~s~$1,500');

            methods.saveFractionLog(
                user.getRpName(player),
                `Произвел арест ${user.getRpName(p)}`,
                `Пополнение бюджета: ${methods.moneyFormat(1500)}`,
                user.get(player, 'fraction_id')
            );

            user.arrest(p);
        }
        else
            player.notify('~r~Игрок не найден');
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:med:free', (player, id) => {
    if (!user.isLogin(player))
        return;
    try {
        let p = mp.players.at(id);
        if (user.isLogin(p)) {

            if (methods.distanceToPos(p.position, player.position) > 10) {
                player.notify('~r~Вы слишком далеко друг от друга');
                return;
            }

            if (!user.isLogin(p) || user.get(p, 'med_time') <= 0) {
                player.notify('~r~У игрок не проходит лечение');
                return;
            }

            coffer.addMoney(coffer.getIdByFraction(user.get(player, 'fraction_id'), 400));
            user.addMoney(player, 400, 'Премия');
            player.notify('~g~Вы выписали игрока. Премия: ~s~$400');

            p.call('client:hosp:free');
        }
        else
            player.notify('~r~Игрок не найден');
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:med:heal', (player, id) => {
    if (!user.isLogin(player))
        return;
    try {
        let p = mp.players.at(id);
        if (user.isLogin(p)) {

            if (methods.distanceToPos(p.position, player.position) > 10) {
                player.notify('~r~Вы слишком далеко друг от друга');
                return;
            }

            player.notify('~g~Вы вылечили игрока.');
            user.setHealth(p, 100);
        }
        else
            player.notify('~r~Игрок не найден');
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:user:giveSubLeader', (player, id) => {

    if (!user.isLogin(player))
        return;

    if (!user.isLeader(player)) {
        player.notify('~r~Вы не лидер чтобы выдавать такие полномочия');
        return;
    }

    id = methods.parseInt(id);
    let target = user.getPlayerById(id);
    if (user.isLogin(target)) {

        user.addHistory(target, 0, 'Были выданы полномочия заместителя в организации ' + methods.getFractionName(user.get(player, 'fraction_id')) + '. Выдал: ' + user.getRpName(player));

        user.set(target, 'is_sub_leader', true);

        target.notify('~g~Вам выдали полномочия заместителя');
        player.notify('~b~Вы выдали полномочия заместителя: ~s~' + user.getRpName(target));

        user.save(target);
    }
    else {
        mysql.executeQuery(`UPDATE users SET is_sub_leader = '1' where id = '${id}' AND is_leader <> 1`);
        player.notify('~b~Вы выдали полномочия заместителя');
        user.addHistoryById(id, 0, 'Были выданы полномочия заместителя в организации ' + methods.getFractionName(user.get(player, 'fraction_id')) + '. Выдал: ' + user.getRpName(player));
    }
});

mp.events.addRemoteCounted('server:user:giveSubLeader2', (player, id) => {

    if (!user.isLogin(player))
        return;

    if (!user.isLeader2(player)) {
        player.notify('~r~Вы не лидер чтобы выдавать такие полномочия');
        return;
    }

    id = methods.parseInt(id);
    let target = user.getPlayerById(id);
    if (user.isLogin(target)) {

        user.set(target, 'is_sub_leader2', true);

        target.notify('~g~Вам выдали полномочия заместителя');
        player.notify('~b~Вы выдали полномочия заместителя: ~s~' + user.getRpName(target));

        user.save(target);
    }
    else {
        mysql.executeQuery(`UPDATE users SET is_sub_leader2 = '1' where id = '${id}' AND is_leader2 <> 1`);
        player.notify('~b~Вы выдали полномочия заместителя');
    }
});

mp.events.addRemoteCounted('server:user:giveSubLeaderF', (player, id) => {

    if (!user.isLogin(player))
        return;

    if (!user.isLeaderF(player)) {
        player.notify('~r~Вы не лидер чтобы выдавать такие полномочия');
        return;
    }

    id = methods.parseInt(id);
    let target = user.getPlayerById(id);
    if (user.isLogin(target)) {

        user.set(target, 'is_sub_leaderf', true);

        target.notify('~g~Вам выдали полномочия заместителя');
        player.notify('~b~Вы выдали полномочия заместителя: ~s~' + user.getRpName(target));

        user.save(target);
    }
    else {
        mysql.executeQuery(`UPDATE users SET is_sub_leaderf = '1' where id = '${id}' AND is_leaderf <> 1`);
        player.notify('~b~Вы выдали полномочия заместителя');
    }
});

mp.events.addRemoteCounted('server:user:giveLeader2', (player, id) => {

    if (!user.isLogin(player))
        return;

    if (!user.isLeader2(player)) {
        player.notify('~r~Вы не лидер чтобы выдавать такие полномочия');
        return;
    }

    id = methods.parseInt(id);
    let target = user.getPlayerById(id);
    if (user.isLogin(target)) {

        user.set(player, 'is_sub_leader2', true);
        user.set(target, 'is_sub_leader2', false);

        user.set(player, 'is_leader2', false);
        user.set(target, 'is_leader2', true);

        target.notify('~g~Вам выдали полномочия лидера');
        player.notify('~b~Вы выдали полномочия лидера: ~s~' + user.getRpName(target));

        user.save(target);
        user.save(player);
    }
    else {
        mysql.executeQuery(`UPDATE users SET is_sub_leader2 = '0', is_leader2 = '1' where id = '${id}' AND is_leader2 <> 1`);
        player.notify('~b~Вы выдали полномочия лидера');
        user.set(player, 'is_sub_leader2', true);
        user.set(player, 'is_leader2', false);
        user.save(player);
    }
});

mp.events.addRemoteCounted('server:user:giveLeaderF', (player, id) => {

    if (!user.isLogin(player))
        return;

    if (!user.isLeaderF(player)) {
        player.notify('~r~Вы не лидер чтобы выдавать такие полномочия');
        return;
    }

    id = methods.parseInt(id);
    let target = user.getPlayerById(id);
    if (user.isLogin(target)) {

        user.set(player, 'is_sub_leaderf', true);
        user.set(target, 'is_sub_leaderf', false);

        user.set(player, 'is_leaderf', false);
        user.set(target, 'is_leaderf', true);

        target.notify('~g~Вам выдали полномочия лидера');
        player.notify('~b~Вы выдали полномочия лидера: ~s~' + user.getRpName(target));

        user.save(target);
        user.save(player);
    }
    else {
        mysql.executeQuery(`UPDATE users SET is_sub_leaderf = '0', is_leaderf = '1' where id = '${id}' AND is_leaderf <> 1`);
        player.notify('~b~Вы выдали полномочия лидера');
        user.set(player, 'is_sub_leaderf', true);
        user.set(player, 'is_leaderf', false);
        user.save(player);
    }
});

mp.events.addRemoteCounted('server:user:takeSubLeader', (player, id) => {

    if (!user.isLogin(player))
        return;

    if (!user.isLeader(player)) {
        player.notify('~r~Вы не лидер чтобы выдавать такие полномочия');
        return;
    }

    id = methods.parseInt(id);
    let target = user.getPlayerById(id);

    let rank = enums.fractionListId[user.get(player, 'fraction_id')].rankList[0].length - 1;

    if (user.isLogin(target)) {

        user.addHistory(target, 0, 'Были изъяты полномочия заместителя в организации ' + methods.getFractionName(user.get(player, 'fraction_id')) + '. Выдал: ' + user.getRpName(player));

        user.set(target, 'rank', rank);
        user.set(target, 'rank_type', 0);
        user.set(target, 'is_sub_leader', false);

        target.notify('~r~У Вас изъяли полномочия заместителя');
        player.notify('~b~Вы изъяли полномочия заместителя: ~s~' + user.getRpName(target));

        user.save(target);
    }
    else {
        mysql.executeQuery(`UPDATE users SET is_sub_leader = '0', rank = '${rank}', rank_type = '0' where id = '${id}' AND is_leader <> 1`);
        player.notify('~b~Вы изъяли полномочия заместителя: ~s~' + id);
        user.addHistoryById(id, 0, 'Были изъяты полномочия заместителя в организации ' + methods.getFractionName(user.get(player, 'fraction_id')) + '. Выдал: ' + user.getRpName(player));
    }
});

mp.events.addRemoteCounted('server:user:takeSubLeader2', (player, id) => {

    if (!user.isLogin(player))
        return;

    if (!user.isLeader2(player)) {
        player.notify('~r~Вы не лидер чтобы выдавать такие полномочия');
        return;
    }

    id = methods.parseInt(id);
    let target = user.getPlayerById(id);

    let rank = JSON.parse(fraction.getData(user.get(player, 'fraction_id2')).get('rank_list'))[0].length - 1;

    if (user.isLogin(target)) {

        user.set(target, 'rank2', rank);
        user.set(target, 'rank_type2', 0);
        user.set(target, 'is_sub_leader2', false);

        target.notify('~r~У Вас изъяли полномочия заместителя');
        player.notify('~b~Вы изъяли полномочия заместителя: ~s~' + user.getRpName(target));

        user.save(target);
    }
    else {
        mysql.executeQuery(`UPDATE users SET is_sub_leader2 = '0', rank2 = '${rank}', rank_type2 = '0' where id = '${id}' AND is_leader2 <> 1`);
        player.notify('~b~Вы изъяли полномочия заместителя: ~s~' + id);
    }
});

mp.events.addRemoteCounted('server:user:takeSubLeaderF', (player, id) => {

    if (!user.isLogin(player))
        return;

    if (!user.isLeaderF(player)) {
        player.notify('~r~Вы не лидер чтобы выдавать такие полномочия');
        return;
    }

    id = methods.parseInt(id);
    let target = user.getPlayerById(id);

    let rank = JSON.parse(family.getData(user.get(player, 'family_id')).get('rank_list'))[0].length - 1;

    if (user.isLogin(target)) {

        user.set(target, 'rankf', rank);
        user.set(target, 'rank_typef', 0);
        user.set(target, 'is_sub_leaderf', false);

        target.notify('~r~У Вас изъяли полномочия заместителя');
        player.notify('~b~Вы изъяли полномочия заместителя: ~s~' + user.getRpName(target));

        user.save(target);
    }
    else {
        mysql.executeQuery(`UPDATE users SET is_sub_leaderf = '0', rankf = '${rank}', rank_typef = '0' where id = '${id}' AND is_leaderf <> 1`);
        player.notify('~b~Вы изъяли полномочия заместителя: ~s~' + id);
    }
});

mp.events.addRemoteCounted('server:user:newRank', (player, id, rank) => {

    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    rank = methods.parseInt(rank);

    if (!user.isLeader(player) && !user.isSubLeader(player)) {
        if (user.get(player, 'rank') >= rank) {
            player.notify('~r~У Вас нет полномочий чтобы выдавать данную должность');
            return;
        }
    }

    let target = user.getPlayerById(id);
    if (user.isLogin(target)) {

        user.addHistory(target, 0, 'Была выдана новая должность. Выдал: ' + user.getRpName(player));

        user.set(target, 'rank', rank);

        target.notify('~g~Вам была выдана новая должность');
        player.notify('~b~Вы выдали новую должность: ~s~' + user.getRpName(target));

        user.save(target);
    }
    else {
        mysql.executeQuery(`UPDATE users SET rank = '${rank}' where id = '${id}' AND is_leader <> 1`);
        player.notify('~b~Вы выдали новую должность');
        user.addHistoryById(id, 0, 'Была выдана новая должность. Выдал: ' + user.getRpName(player));
    }
});


mp.events.addRemoteCounted('server:user:newRank2', (player, id, rank) => {

    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    rank = methods.parseInt(rank);

    if (!user.isLeader2(player) && !user.isSubLeader2(player)) {
        if (user.get(player, 'rank2') >= rank) {
            player.notify('~r~У Вас нет полномочий чтобы выдавать данную должность');
            return;
        }
    }

    let target = user.getPlayerById(id);
    if (user.isLogin(target)) {

        user.set(target, 'rank2', rank);

        target.notify('~g~Вам была выдана новая должность');
        player.notify('~b~Вы выдали новую должность: ~s~' + user.getRpName(target));

        user.save(target);
    }
    else {
        mysql.executeQuery(`UPDATE users SET rank2 = '${rank}' where id = '${id}' AND is_leader2 <> 1`);
        player.notify('~b~Вы выдали новую должность');
    }
});

mp.events.addRemoteCounted('server:user:newRankF', (player, id, rank) => {

    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    rank = methods.parseInt(rank);

    if (!user.isLeaderF(player) && !user.isSubLeaderF(player)) {
        if (user.get(player, 'rankf') >= rank) {
            player.notify('~r~У Вас нет полномочий чтобы выдавать данную должность');
            return;
        }
    }

    let target = user.getPlayerById(id);
    if (user.isLogin(target)) {

        user.set(target, 'rankf', rank);

        target.notify('~g~Вам была выдана новая должность');
        player.notify('~b~Вы выдали новую должность: ~s~' + user.getRpName(target));

        user.save(target);
    }
    else {
        mysql.executeQuery(`UPDATE users SET rankf = '${rank}' where id = '${id}' AND is_leaderf <> 1`);
        player.notify('~b~Вы выдали новую должность');
    }
});

mp.events.addRemoteCounted('server:user:newDep', (player, id, dep) => {

    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    dep = methods.parseInt(dep);

    let depName = methods.getDepartmentName(user.get(player, 'fraction_id'), dep);
    let rank = enums.fractionListId[user.get(player, 'fraction_id')].rankList[dep].length - 1;

    let target = user.getPlayerById(id);
    if (user.isLogin(target)) {

        user.addHistory(target, 0, 'Был переведен в отдел ' + depName + '. Выдал: ' + user.getRpName(player));

        user.set(target, 'rank', rank);
        user.set(target, 'rank_type', dep);

        target.notify('~g~Вас перевели в другой отдел~s~ ' + depName);
        player.notify('~b~Вы перевели в другой отдел: ~s~' + user.getRpName(target));

        user.save(target);
    }
    else {
        mysql.executeQuery(`UPDATE users SET rank = '${rank}', rank_type = '${dep}' where id = '${id}' AND is_leader <> 1`);
        player.notify('~b~Вы перевели в другой отдел');
        user.addHistoryById(id, 0, 'Был переведен в отдел ' + depName + '. Выдал: ' + user.getRpName(player));
    }
});

mp.events.addRemoteCounted('server:user:newDep2', (player, id, dep) => {

    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    dep = methods.parseInt(dep);

    let rank = JSON.parse(fraction.getData(user.get(player, 'fraction_id2')).get('rank_list'))[dep].length - 1;

    let target = user.getPlayerById(id);
    if (user.isLogin(target)) {

        user.set(target, 'rank2', rank);
        user.set(target, 'rank_type2', dep);

        target.notify('~g~Вас перевели в другой отдел');
        player.notify('~b~Вы перевели в другой отдел: ~s~' + user.getRpName(target));

        user.save(target);
    }
    else {
        mysql.executeQuery(`UPDATE users SET rank2 = '${rank}', rank_type2 = '${dep}' where id = '${id}' AND is_leader2 <> 1`);
        player.notify('~b~Вы перевели в другой отдел');
    }
});

mp.events.addRemoteCounted('server:user:newDepF', (player, id, dep) => {

    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    dep = methods.parseInt(dep);

    let rank = JSON.parse(family.getData(user.get(player, 'family_id')).get('rank_list'))[dep].length - 1;

    let target = user.getPlayerById(id);
    if (user.isLogin(target)) {

        user.set(target, 'rankf', rank);
        user.set(target, 'rank_typef', dep);

        target.notify('~g~Вас перевели в другой отдел');
        player.notify('~b~Вы перевели в другой отдел: ~s~' + user.getRpName(target));

        user.save(target);
    }
    else {
        mysql.executeQuery(`UPDATE users SET rankf = '${rank}', rank_typef = '${dep}' where id = '${id}' AND is_leaderf <> 1`);
        player.notify('~b~Вы перевели в другой отдел');
    }
});

mp.events.addRemoteCounted('server:user:fixNearestVehicle', (player) => {
    if (!user.isLogin(player))
        return;
    let veh = methods.getNearestVehicleWithCoords(player.position, 10.0, player.dimension);
    if (vehicles.exists(veh))
        veh.repair();
});

mp.events.addRemoteCounted('server:user:giveWeaponComponent', (player, weapon, component) => {
    if (!user.isLogin(player))
        return;
    user.giveWeaponComponent(player, methods.parseInt(weapon), methods.parseInt(component));
});

mp.events.addRemoteCounted('server:user:removeWeaponComponent', (player, weapon, component) => {
    if (!user.isLogin(player))
        return;
    user.removeWeaponComponent(player, methods.parseInt(weapon), methods.parseInt(component));
});

mp.events.addRemoteCounted('server:user:removeAllWeaponComponents', (player, weapon) => {
    if (!user.isLogin(player))
        return;
    user.removeAllWeaponComponents(player, methods.parseInt(weapon));
});

mp.events.addRemoteCounted('server:user:setWeaponTint', (player, weapon, tint) => {
    if (!user.isLogin(player))
        return;
    user.setWeaponTint(player, methods.parseInt(weapon), methods.parseInt(tint));
});

mp.events.addRemoteCounted('server:respawnNearstVehicle', (player) => {
    if (!user.isLogin(player))
        return;
    let vehicle = methods.getNearestVehicleWithCoords(player.position, 5);
    vehicles.respawn(vehicle);

    try {
        if (user.isAdmin(player) && vehicles.exists(vehicle))
        {
            let pos = vehicle.position;
            let vehInfo = methods.getVehicleInfo(vehicle.model);
            methods.saveLog('log_admin', ['name', 'type', 'do'], [`${user.getRpName(player)}`, 'VEH_RESPAWN', `${vehicle.numberPlate} | ${vehInfo.display_name} | ${methods.parseInt(pos.x)} | ${methods.parseInt(pos.y)} | ${methods.parseInt(pos.z)}`]);
        }
    }
    catch (e) {
        
    }
});

mp.events.addRemoteCounted('server:respawnNearstVehicle2', (player) => {
    if (!user.isLogin(player))
        return;
    let vehicle = methods.getNearestVehicleWithCoords(player.position, 5);
    vehicles.respawn2(vehicle, player);
});

mp.events.addRemoteCounted('server:flipNearstVehicle', (player) => {
    if (!user.isLogin(player))
        return;
    let vehicle = methods.getNearestVehicleWithCoords(player.position, 5);
    if (vehicles.exists(vehicle))
        vehicle.rotation = new mp.Vector3(0, 0, vehicle.heading);
});

mp.events.addRemoteCounted('server:vehicle:engineStatus', (player, status) => {
    if (!user.isLogin(player))
        return;
    try {
        if (player.vehicle && player.seat == -1) {
            vehicles.engineStatus(player, player.vehicle, status);
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:vehicle:neonStatus', (player) => {
    if (!user.isLogin(player))
        return;
    try {
        if (player.vehicle && player.seat == -1) {
            vehicles.neonStatus(player, player.vehicle);
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:vehicle:setColor', (player, color1, color2) => {
    if (!user.isLogin(player))
        return;
    try {
        if (player.vehicle && player.seat == -1) {
            player.vehicle.setColor(color1, color2);
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:vehicle:setColorP', (player, color) => {
    if (!user.isLogin(player))
        return;
    try {
        if (player.vehicle && player.seat == -1) {
            player.vehicle.pearlescentColor = color;
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:vehicle:setColorW', (player, color) => {
    if (!user.isLogin(player))
        return;
    try {
        if (player.vehicle && player.seat == -1) {
            player.vehicle.wheelColor = color;
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:vehicle:setColorI', (player, color) => {
    if (!user.isLogin(player))
        return;
    try {
        if (player.vehicle && player.seat == -1) {
            vSync.setVehicleInteriorColor(player.vehicle, color);
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:vehicle:setColorD', (player, color) => {
    if (!user.isLogin(player))
        return;
    try {
        if (player.vehicle && player.seat == -1) {
            vSync.setVehicleDashboardColor(player.vehicle, color);
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:vehicle:setLivery', (player, liv) => {
    if (!user.isLogin(player))
        return;
    try {
        if (player.vehicle && player.seat == -1) {
            player.vehicle.livery = liv;
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:trafficDestroy', (player) => {
    if (!user.isLogin(player))
        return;
    weather.setBrokeLight();
});

mp.events.addRemoteCounted('server:cityDestroy', (player) => {
    if (!user.isLogin(player))
        return;
    if (ctos.canBlackout()) {
        ctos.setBlackout(true);
        ctos.setNoNetwork(true);
        ctos.set('cantBlackout', true);

        user.achiveDoneAllById(player, 14);
    }
    else
        player.notify('~r~Hacking attempt');
});

mp.events.addRemoteCounted('server:networkDestroy', (player) => {
    if (!user.isLogin(player))
        return;
    if (ctos.canNetwork()) {
        ctos.setNoNetwork(true);
        ctos.set('cantNetwork', true);
    }
    else
        player.notify('~r~Hacking attempt');
});

mp.events.addRemoteCounted('server:sellVeh', (player) => {
    if (!user.isLogin(player))
        return;
    let veh = player.vehicle;
    if (!vehicles.exists(veh))
        return;

    /*if (weather.getHour() < 22 && weather.getHour() > 4) {
        player.notify('~r~Доступно только с 22 до 4 утра игрового времени');
        return;
    }*/

    if (user.hasById(user.getId(player), 'grabVeh')) {
        player.notify('~r~Вы не можете сейчас сбыть транспорт');
        return;
    }

    let price = methods.getVehicleInfo(veh.model).price * 0.01;
    if (price > 2000)
        price = 2000;
    let money = 200 + price;

    let containerId = veh.getVariable('container');
    if (containerId != undefined && veh.getVariable('user_id') > 0) {
        let vInfo = methods.getVehicleInfo(veh.model);
        let idx = 0;
        if (vInfo.class_name === 'Armored' ||
            vInfo.class_name === 'Commercials' ||
            vInfo.class_name === 'Industrial' ||
            vInfo.class_name === 'Off-Road' ||
            vInfo.class_name === 'Utility' ||
            vInfo.class_name === 'Military' ||
            vInfo.class_name === 'Vans')
            idx = 1;
        if (vInfo.class_name === 'Boats')
            idx = 2;
        if (vInfo.class_name === 'Helicopters')
            idx = 3;
        if (vInfo.class_name === 'Planes')
            idx = 4;

        vehicles.set(containerId, 'is_cop_park', 100000 + idx);
        vehicles.set(containerId, 'cop_park_name', 'В угоне');
        vehicles.save(containerId);
    }

    user.showLoadDisplay(player);

    if (user.get(player, 'fraction_id2') > 0)
        fraction.addMoney(user.get(player, 'fraction_id2'), money / 2000, `Угон транспорта (${user.get(player, 'name')})`);

    user.addCryptoMoney(player, money / 1000);
    user.removeRep(player, 50);
    user.setById(user.getId(player), 'grabVeh', true);

    setTimeout(function () {
        if (!user.isLogin(player))
            return;
        user.hideLoadDisplay(player);
        player.notify('~g~Вы заработали: ~s~' + methods.numberFormat(money / 1000) + 'ec');
        if (!vehicles.exists(veh))
            return;
        vehicles.respawn(veh);
    }, 1000);
});

mp.events.addRemoteCounted('server:sellUser', (player) => {
    if (!user.isLogin(player))
        return;
    let veh = player.vehicle;
    if (!vehicles.exists(veh))
        return;

    vehicles.getOccupants(veh).forEach(p => {
        if (user.isLogin(p) && (user.isTie(p) || user.isCuff(p))) {
            try {

                if (user.hasById(user.getId(p), 'sellUser')) {
                    player.notify('~r~Игрок недавно был ограблен');
                    return;
                }

                if (p.health <= 0) {
                    player.notify('~r~Игрок мертв');
                    return;
                }

                let money = user.getCashMoney(p) / 2;
                if (money > 50000)
                    money = 50000;
                user.removeCashMoney(p, money);
                p.removeFromVehicle();

                user.setHealth(p, 15);

                user.addCashMoney(player, money);
                p.notify('~r~Вас ограбили на сумму ~s~' + methods.moneyFormat(money));
                player.notify('~r~Вы ограбили на сумму ~s~' + methods.moneyFormat(money));

                user.setById(user.getId(p), 'sellUser', true);
            }
            catch (e) {
                methods.debug(e);
            }
        }
    })
});

mp.events.addRemoteCounted('server:sellMoney', (player) => {
    if (!user.isLogin(player))
        return;

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

            let frId = user.get(player, 'fraction_id2');
            let procent = fraction.get(frId, 'proc_clear');
            let moneyHalf = money / 1600; //800 * 2
            let currentOnline = methods.getCurrentOnlineFraction2(frId);

            fraction.addMoney(frId, moneyHalf * (procent / 100), 'Отмыв средств');

            if (procent < 100) {
                mp.players.forEach(p => {
                    if (user.isLogin(p) && user.get(p, 'fraction_id2') === frId) {
                        user.addCryptoMoney(p, moneyHalf * ((100 - procent) / 100) / currentOnline, 'Отмыв средств');
                        p.notify(`~g~К вам на счет поступило: ~s~${methods.cryptoFormat(moneyHalf * ((100 - procent) / 100) / currentOnline)}`);
                    }
                });
            }
            player.notify(`~b~Деньги с отмыва были разделены следующим образом. ${procent}% идёт на счет организации, ${100 - procent}% разделяется над всеми, кто в сети`);
        }
        else {
            player.notify('~r~У Вас нет денег для отмыва');
        }
    });
});

mp.events.addRemoteCounted('server:sellMoneyBusiness', (player, bid, text) => {
    if (!user.isLogin(player))
        return;

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
            business.addMoney(bid, money, methods.removeQuotes(methods.removeQuotes2(methods.removeSpecialChars(text))));
            player.notify(`~b~Деньги были отмыты на счет бизнеса`);

            if (methods.getRandomInt(0, user.get(player, 'stats_darknet')) < 5)
                user.giveWanted(player, 50, 'Несанкционированная транзакция');
            else if (user.get(player, 'stats_darknet') < 100) {
                user.set(player, 'stats_darknet', user.get(player, 'stats_darknet') + 1);
            }
        }
        else {
            player.notify('~r~У Вас нет денег для отмыва');
        }
    });
});

mp.events.addRemoteCounted('server:sellMoneyPolice', (player) => {
    if (!user.isLogin(player))
        return;

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
            let frId = user.get(player, 'fraction_id');
            let currentOnline = methods.getCurrentOnlineFraction(frId);

            coffer.addMoney(coffer.getIdByFraction(frId), moneyHalf, 'Премия за грязные деньги');

            mp.players.forEach(p => {
                if (user.isLogin(p) && user.get(p, 'fraction_id') === frId) {
                    user.addPayDayMoney(p, moneyHalf / currentOnline, 'Премия');
                    p.notify(`~g~К вам на счет поступило: ~s~${methods.moneyFormat(moneyHalf / currentOnline)}`);
                }
            });
            player.notify('~b~Деньги были разделены следующим образом. 50% идёт на счет организации, 50% разделяется над всеми, кто в сети');
        }
        else {
            player.notify('~r~У Вас нет награбленных денег');
        }
    });
});

mp.events.addRemoteCounted('server:lsc:showTun', (player, modType, idx) => {
    if (!user.isLogin(player))
        return;
    lsc.showTun(player, modType, idx);
});

mp.events.addRemoteCounted('server:lsc:buyTun', (player, modType, idx, price, shopId, itemName, payType) => {
    if (!user.isLogin(player))
        return;
    lsc.buyTun(player, modType, idx, price, shopId, itemName, payType);
});

mp.events.addRemoteCounted('server:lsc:buySTun', (player, modType, idx, price, shopId, itemName, payType) => {
    if (!user.isLogin(player))
        return;
    lsc.buySTun(player, modType, idx, price, shopId, itemName, payType);
});

mp.events.addRemoteCounted('server:lsc:buySFix', (player, idx, price, shopId, itemName, payType) => {
    if (!user.isLogin(player))
        return;
    lsc.buySFix(player, idx, price, shopId, itemName, payType);
});

mp.events.addRemoteCounted('server:lsc:resetSTun', (player, modType) => {
    if (!user.isLogin(player))
        return;
    lsc.resetSTun(player, modType);
});

mp.events.addRemoteCounted('server:lsc:showNumberType', (player, idx) => {
    if (!user.isLogin(player))
        return;
    lsc.showNumberType(player, idx);
});

mp.events.addRemoteCounted('server:lsc:buyNumberType', (player, idx, price, shopId, payType) => {
    if (!user.isLogin(player))
        return;
    lsc.buyNumberType(player, idx, methods.parseInt(price), shopId, payType);
});

mp.events.addRemoteCounted('server:lsc:showColor1', (player, idx) => {
    if (!user.isLogin(player))
        return;
    lsc.showColor1(player, idx);
});

mp.events.addRemoteCounted('server:lsc:showColor2', (player, idx) => {
    if (!user.isLogin(player))
        return;
    lsc.showColor2(player, idx);
});

mp.events.addRemoteCounted('server:lsc:showColor3', (player, idx) => {
    if (!user.isLogin(player))
        return;
    lsc.showColor3(player, idx);
});

mp.events.addRemoteCounted('server:lsc:showColor4', (player, idx) => {
    if (!user.isLogin(player))
        return;
    lsc.showColor4(player, idx);
});

mp.events.addRemoteCounted('server:lsc:showColor5', (player, idx) => {
    if (!user.isLogin(player))
        return;
    lsc.showColor5(player, idx);
});

mp.events.addRemoteCounted('server:lsc:showColor6', (player, idx) => {
    if (!user.isLogin(player))
        return;
    lsc.showColor6(player, idx);
});

mp.events.addRemoteCounted('server:lsc:buyColor1', (player, idx, price, shopId, itemName, payType) => {
    if (!user.isLogin(player))
        return;
    lsc.buyColor1(player, idx, methods.parseInt(price), shopId, itemName, payType);
});

mp.events.addRemoteCounted('server:lsc:buyColor2', (player, idx, price, shopId, itemName, payType) => {
    if (!user.isLogin(player))
        return;
    lsc.buyColor2(player, idx, methods.parseInt(price), shopId, itemName, payType);
});

mp.events.addRemoteCounted('server:lsc:buyColor3', (player, idx, price, shopId, itemName, payType) => {
    if (!user.isLogin(player))
        return;
    lsc.buyColor3(player, idx, methods.parseInt(price), shopId, itemName, payType);
});

mp.events.addRemoteCounted('server:lsc:buyColor4', (player, idx, price, shopId, itemName, payType) => {
    if (!user.isLogin(player))
        return;
    lsc.buyColor4(player, idx, methods.parseInt(price), shopId, itemName, payType);
});

mp.events.addRemoteCounted('server:lsc:buyColor5', (player, idx, price, shopId, itemName, payType) => {
    if (!user.isLogin(player))
        return;
    lsc.buyColor5(player, idx, methods.parseInt(price), shopId, itemName, payType);
});

mp.events.addRemoteCounted('server:lsc:buyColor6', (player, idx, price, shopId, itemName, payType) => {
    if (!user.isLogin(player))
        return;
    lsc.buyColor6(player, idx, methods.parseInt(price), shopId, itemName, payType);
});

mp.events.addRemoteCounted('server:lsc:buyNumber', (player, shopId, newNumber, payType) => {
    if (!user.isLogin(player))
        return;
    lsc.buyNumber(player, shopId, newNumber, payType);
});

mp.events.addRemoteCounted('server:lsc:repair', (player, shopId, price, payType) => {
    if (!user.isLogin(player))
        return;
    lsc.repair(player, price, shopId, payType);
});

mp.events.addRemoteCounted('server:lsc:buyNeon', (player, shopId, price, payType) => {
    if (!user.isLogin(player))
        return;
    lsc.buyNeon(player, price, shopId, payType);
});

mp.events.addRemoteCounted('server:lsc:buyTyreColor', (player, idx, price, shopId, payType) => {
    if (!user.isLogin(player))
        return;
    lsc.buyTyreColor(player, price, idx, shopId, payType);
});

mp.events.addRemoteCounted('server:lsc:buyLight', (player, shopId, price, payType) => {
    if (!user.isLogin(player))
        return;
    lsc.buyLight(player, price, shopId, payType);
});

mp.events.addRemoteCounted('server:lsc:buySpecial', (player, shopId, price, payType) => {
    if (!user.isLogin(player))
        return;
    lsc.buySpecial(player, price, shopId, payType);
});

mp.events.addRemoteCounted('server:vehicle:park', (player) => {
    if (!user.isLogin(player))
        return;
    try {
        let veh = player.vehicle;
        if (veh) {
            let pos = veh.position;
            vehicles.park(veh.getVariable('container'), pos.x, pos.y, pos.z, veh.heading, veh.dimension);
            player.notify('~b~Вы припарковали свой транспорт');
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:vehicle:parkFraction', (player) => {
    if (!user.isLogin(player))
        return;
    try {
        let veh = player.vehicle;
        if (veh) {

            if (veh.dimension > 0) {
                player.notify('~r~Запрещено припарковывать транспорт в интерьере');
                return;
            }
            
            let fData = fraction.getData(user.get(player, 'fraction_id2'));
            let spawnPos = new mp.Vector3(fData.get('spawn_x'), fData.get('spawn_y'), fData.get('spawn_z'));
            
            if (methods.distanceToPos(spawnPos, player.position) > 100) {
                player.notify('~r~Вы слишком далеко от вашего спавна');
                return;
            }

            let pos = veh.position;
            vehicles.parkFraction(veh.getVariable('veh_id'), pos.x, pos.y, pos.z, veh.heading);
            player.notify('~b~Вы припарковали транспорт');
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:vehicle:park2', (player) => {
    if (!user.isLogin(player))
        return;
    try {
        let veh = player.vehicle;
        if (veh) {
            vehicles.set(veh.getVariable('container'), 'is_cop_park', 0);
            vehicles.set(veh.getVariable('container'), 'cop_park_name', '');
            player.notify('~b~Вы оплатили штраф, теперь ваш транспорт будет спавнится на месте парковки');
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:vehicle:cargoUnload', (player, id) => {
    if (!user.isLogin(player))
        return;
    stocks.cargoUnload(player, id);
});

mp.events.addRemoteCounted('server:vehicle:setDispatchMarked', (player, id, name) => {
    if (!user.isLogin(player))
        return;
    try {
        if (player.vehicle) {
            player.vehicle.setVariable('dispatchMarked', `${name.substring(0, 1).toUpperCase()}-${id}`);
        }
    }
    catch (e) {
        
    }
});

mp.events.addRemoteCounted('server:vehicle:ejectById', (player, id) => {
    if (!user.isLogin(player))
        return;
    vehicles.getOccupants(player.vehicle).forEach(p => {
        if (user.isLogin(p) && p.id === id) {
            p.notify('~r~Вас выкинули из транспорта');
            p.removeFromVehicle();
        }
    })
});

mp.events.addRemoteCounted('server:vehicle:ejectByIdOut', (player, vid, id) => {
    if (!user.isLogin(player))
        return;
    
    try {
        let veh = mp.vehicles.at(vid);
        if (vehicles.exists(veh)) {
            vehicles.getOccupants(veh).forEach(p => {
                try {
                    if (user.isLogin(p) && p.id == id) {

                        if (p.health > 1 && !user.isCuff(p) && !user.isTie(p)) {
                            player.notify('~r~Игрок должен быть в наручниках, связан или мертв');
                            return;
                        }

                        p.notify('~r~Вас выкинули из транспорта');
                        p.position = player.position;
                    }
                }
                catch (e) {
                    methods.debug(e);
                }
            })
        }
    }
    catch (e) {
        
    }
});

mp.events.addRemoteCounted('server:vehicle:radar', (player, enable) => {
    if (!user.isLogin(player))
        return;
    player.vehicle.setVariable('radar', enable);
});

mp.events.addRemoteCounted('server:vehicle:radarCheck', (player, ticketSpeed, ticketPrice, number, vid) => {
    if (!user.isLogin(player))
        return;
    try {
        let driver = user.getVehicleDriver(mp.vehicles.at(vid));
        if (user.isLogin(driver)) {
            user.addMoney(driver, ticketPrice / 2, 'Установка радара');
            driver.notify("~y~Транспорт ~s~" + number + "~y~ заметила камера за превышением скорости на ~s~" + ticketSpeed + "км/ч~y~, транспорту был выписан штраф в размере ~s~" + methods.moneyFormat(ticketPrice));
            driver.notify("~y~Вам зачислена премия в размере ~s~" + methods.moneyFormat(ticketPrice / 2));
        }
    }
    catch (e) {
        
    }
});

mp.events.addRemoteCounted('server:vehicle:removeNumber', (player, vid) => {
    if (!user.isLogin(player))
        return;

    try {
        let veh = mp.vehicles.at(vid);
        if (vehicles.exists(veh)) {
            if (user.getCashMoney(player) < 10000) {
                player.notify('~r~У вас нет $10000 на руках');
                return;
            }
            if (veh.getVariable('user_id') > 0) {
                let frId = user.get(player, 'fraction_id2');
                user.removeCashMoney(player, 10000, 'Снятие номера с ТС');
                if (frId > 0) {
                    fraction.addMoney(frId, 5, 'Прибыль со снятия номеров');
                }
                veh.numberPlate = '';
                player.notify('~y~Теперь штрафы на этот транспорт приходить не будут');
                vehicles.set(veh.getVariable('container'), 'removeNumber', true);
            }
            else {
                player.notify('~y~Транспорт должен быть личный');
            }
        }
    }
    catch (e) {

    }
});

mp.events.addRemoteCounted('server:vehicle:setNeonColor', (player, r, g, b) => {
    if (!user.isLogin(player))
        return;
    try {
        if (player.vehicle && player.seat == -1) {
            player.vehicle.setNeonColor(r, g, b);
            vehicles.set(player.vehicle.getVariable('container'), 'neon_r', r);
            vehicles.set(player.vehicle.getVariable('container'), 'neon_g', g);
            vehicles.set(player.vehicle.getVariable('container'), 'neon_b', b);
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:vehicle:setLight', (player, cl) => {
    if (!user.isLogin(player))
        return;
    try {
        if (player.vehicle && player.seat == -1) {
            player.vehicle.data.headlightColor = cl;
            vehicles.set(player.vehicle.getVariable('container'), 'colorl', cl);
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addRemoteCounted('server:gun:buy', (player, itemId, price, count, superTint, tint, shopId, payType) => {
    if (!user.isLogin(player))
        return;
    gun.buy(player, itemId, price, count, superTint, tint, shopId, payType);
});

mp.events.addRemoteCounted('server:shop:buy', (player, itemId, price, shopId) => {
    if (!user.isLogin(player))
        return;
    shop.buy(player, itemId, price, shopId, 0);
});

mp.events.addRemoteCounted('server:shop:buyCard', (player, itemId, price, shopId) => {
    if (!user.isLogin(player))
        return;
    shop.buy(player, itemId, price, shopId, 1);
});

mp.events.addRemoteCounted('server:addFractionLog', (player, name, doName, text, fractionId) => {
    methods.saveFractionLog(name, doName, text, fractionId);
});

mp.events.addRemoteCounted('server:addFractionLog2', (player, name, doName, text, fractionId) => {
    fraction.addHistory(name, doName, text, fractionId);
});

mp.events.add('server:saveFile', (player, file, log) => {
    methods.saveFile(file, log);
});

mp.events.addRemoteCounted('server:saveLog', (player, table, cols, values) => {
    methods.saveLog(table, cols, values);
});

mp.events.addRemoteCounted("server:activatePromocode", (player, promocode) => {
    if (!user.isLogin(player))
        return;
    promocode = promocode.toUpperCase();
    promocode = methods.removeQuotes(methods.removeQuotes2(promocode));
    mysql.executeQuery(`SELECT id FROM promocode_using WHERE user_id = '${user.getId(player)}' AND promocode_name = '${promocode}' LIMIT 1`, function (err, rows, fields) {
        if (rows.length == 0) {
            mysql.executeQuery(`SELECT bonus, bonus2, is_one, is_use FROM promocode_list WHERE code = '${promocode}' LIMIT 1`, function (err, rows, fields) {
                if (rows.length >= 1) {
                    rows.forEach(row => {

                        if (row['is_use']) {
                            player.notify(`~g~Промокод уже был активирован`);
                            return;
                        }

                        if (methods.parseInt(row['bonus']) > 0) {
                            user.addMoney(player, methods.parseInt(row['bonus']));
                            player.notify(`~g~Промокод: ${promocode} активирован, вы получили $${methods.numberFormat(row['bonus'])}`);
                        }
                        mysql.executeQuery(`INSERT INTO promocode_using (user_id, promocode_name) VALUES ('${user.getId(player)}', '${promocode}')`);


                        if (row['is_one'])
                            mysql.executeQuery(`UPDATE promocode_list SET is_use='1' WHERE code = '${promocode}'`);

                        try {
                            let json = JSON.parse(row['bonus2']);
                            if (json.mask) {
                                user.giveMask(player, json.mask);
                            }
                            if (json.vip) {
                                user.giveVip(player, json.vip);
                            }
                        }
                        catch (e) {

                        }
                    });
                } else {
                    mysql.executeQuery(`SELECT * FROM promocode_top_list WHERE promocode = '${promocode}' AND is_use = 0 LIMIT 1`, function (err, rows, fields) {
                        if (rows.length >= 1) {
                            if (user.get(player, 'promocode') === '') {
                                if (user.get(player, 'online_time') < 169) {

                                    let paramsStart = JSON.parse(rows[0]["start"]);

                                    user.set(player, 'promocode', promocode);
                                    user.addCashMoney(player, paramsStart.money);
                                    user.save(player);

                                    let string = `~b~Вы ввели промокод: ~s~${promocode}\n`;
                                    if (paramsStart.money > 0)
                                        string += `~b~Вы получили~s~ ${methods.moneyFormat(paramsStart.money)}\n`;
                                    if (paramsStart.vipt === 1)
                                        string += `~b~Вы получили ~s~VIP LIGHT~b~ на ~s~${paramsStart.vip}д.\n`;
                                    if (paramsStart.vipt === 2)
                                        string += `~b~Вы получили ~s~VIP HARD~b~ на ~s~${paramsStart.vip}д.\n`;

                                    let vipTime = 0;
                                    let vipType = methods.parseInt(paramsStart.vipt);
                                    if (methods.parseInt(paramsStart.vip) > 0 && user.get(player, 'vip_type') > 0 && user.get(player, 'vip_time') > 0)
                                        vipTime = methods.parseInt(paramsStart.vip * 86400) + user.get(player, 'vip_time');
                                    else if (methods.parseInt(paramsStart.vip) > 0)
                                        vipTime = methods.parseInt(paramsStart.vip * 86400) + methods.getTimeStamp();

                                    user.set(player, 'vip_time', vipTime);
                                    user.set(player, 'vip_type', vipType);

                                    player.notify(string);

                                    mysql.executeQuery(`UPDATE users SET money_donate = money_donate + '2' WHERE parthner_promocode = '${user.get(player, 'promocode')}'`);
                                    return;
                                }
                                player.notify("~r~Вы отыграли более 24 часа, промокод не доступен");
                                return;
                            }
                            player.notify("~r~Данный промокод можно активировать только при регистрации персонажа");
                        } else {
                            player.notify("~r~Такого промокода не существует");
                        }
                    });
                }
            });
        } else {
            player.notify("~r~Вы уже активировали промокод");
        }
    });
});

mp.events.add('playerJoin', player => {


    /*if (!enums.whiteList.includes(player.socialClub)) { //TODO Убрать на открытии
        player.outputChatBox("Сервер будет доступен в 17:00 По МСК");
        player.kick();
        return;
    }*/

    player.dimension = player.id + 1;

    player.countedTriggers = 0;
    player.countedTriggersSwap = 0;

    methods.saveLog('log_connect',
        ['type', 'social', 'serial', 'address', 'game_id', 'account_id'],
        ['JOIN', player.socialClub, player.serial, player.ip, player.id, 0]
    );

    player.outputChatBox("RAGE_Multiplayer HAS BEEN STARTED.");
});

mp.events.add('server:playerWeaponShot', (player, targetId) => {
    try {
        let target = mp.players.at(targetId);
        if (user.isLogin(target))
            target.call('playerMaybeTakeShot', [player.id]);
    }
    catch (e) {
        methods.debug(e);
    }
});

/*mp.events.add("playerDamage", (player, healthLoss, armorLoss) => {
    //methods.saveFile('damage', `${player.socialClub} | ${healthLoss} ${armorLoss}`)
    player.call('client:anticheat:damage', [healthLoss, armorLoss]);
    console.log(`${player.socialClub} | ${healthLoss} ${armorLoss}`);
});*/

mp.events.add('playerQuit', player => {
    user.setOnlineStatus(player, 0);

    methods.saveLog('log_connect',
        ['type', 'social', 'serial', 'address', 'game_id', 'account_id'],
        ['QUIT', player.socialClub, player.serial, player.ip, player.id, user.getId(player)]
    );

    if (user.isLogin(player)) {
        vehicles.removePlayerVehicle(user.getId(player));
        inventory.deleteItemsRange(player, 138, 141);

        try {
            if (user.isCuff(player)) {
                user.addHistory(player, 1, 'Был посажен в тюрьму');
                user.warn(player, 1, 'Выход из игры во время ареста');
                user.toLspdSafe(player, 169);

                /*user.set(player, 'jail_time', 120 * 60);
                user.set(player, 'wanted_level', 0);
                chat.sendToAll('Anti-Cheat System', `${user.getRpName(player)} (${player.id})!{${chat.clRed}} был посажен в тюрьму с причиной:!{${chat.clWhite}} выход из игры во время ареста`, chat.clRed);*/
            }
        }
        catch (e) {
            methods.debug(e);
        }
        try {
            if (user.isTie(player)) {
                user.addHistory(player, 1, 'Был посажен в тюрьму');
                user.warn(player, 1, 'Выход из игры во время похищения');
                user.toLspdSafe(player);
                /*user.set(player, 'jail_time', 120 * 60);
                user.set(player, 'wanted_level', 0);
                chat.sendToAll('Anti-Cheat System', `${user.getRpName(player)} (${player.id})!{${chat.clRed}} был посажен в тюрьму с причиной:!{${chat.clWhite}} выход из игры во время похищения`, chat.clRed);*/
            }
        }
        catch (e) {
            methods.debug(e);
        }

        try {
            if (user.has(player, 'rentTrade') && user.has(player, 'rentTradeC')) {
                let idx = user.get(player, 'rentTrade');
                tradeMarket.setBeach(idx, 'rent', 0);
                tradeMarket.getAllBeach().get(idx.toString()).marker.visible = false;
                inventory.updateOwnerAll(user.getId(player), inventory.types.TradeBeach, user.getId(player), inventory.types.Player);
            }
            if (user.has(player, 'rentTrade') && user.has(player, 'rentTradeB')) {
                let idx = user.get(player, 'rentTrade');
                tradeMarket.setBlack(idx, 'rent', 0);
                tradeMarket.getAllBlack().get(idx.toString()).marker.visible = false;
                inventory.updateOwnerAll(user.getId(player), inventory.types.TradeBlack, user.getId(player), inventory.types.Player);
            }
        }
        catch (e) {

        }
        user.save(player, true);
    }
});

mp.events.add("playerDeath", (player, reason, killer) => {

    if (user.isLogin(killer) && user.isLogin(player)) {
        try {
            user.set(killer, 'st_kill', user.get(killer, 'st_kill') + 1);
            user.set(player, 'st_death', user.get(player, 'st_death') + 1);
            if (player.dimension === 9999)
                return;
            if (player.dimension === 99999)
                return;
            let killerPos = killer.position;
            methods.saveLog('log_user_death',
                ['user', 'reason'],
                [`${user.getRpName(player)} (${user.getId(player)}) kill by ${user.getRpName(killer)} (${user.getId(killer)})`, methods.removeQuotes(methods.removeQuotes2(reason)) + ` [${killerPos.x.toFixed(2)}, ${killerPos.y.toFixed(2)}, ${killerPos.z.toFixed(2)}]`],
            );
        }
        catch (e) {
            methods.debug(e);
        }
    }
    else if (user.isLogin(player)) {
        try {
            user.set(player, 'st_death', user.get(player, 'st_death') + 1);

            if (player.dimension === 9999)
                return;
            if (player.dimension === 99999)
                return;
            methods.saveLog('log_user_death',
                ['user', 'reason'],
                [`${user.getRpName(player)} (${user.getId(player)})`, methods.removeQuotes(methods.removeQuotes2(reason))],
            );
        }
        catch (e) {
            methods.debug(e);
        }
    }

    setTimeout(function () {
        try {
            if (player.vehicle)
                player.removeFromVehicle();
        }
        catch (e) {

        }
    }, 10000);

    if (user.isLogin(player)) {

        if (player.getVariable('blockDeath'))
            return;

        if (user.has(player, 'duelTarget'))
        {
            let targetId = user.get(player, 'duelTarget');
            let bet = user.get(player, 'duelBet');
            let target = mp.players.at(targetId);

            let countDeath = user.get(player, 'duelCount') - 1;

            user.set(player, 'duelCount', countDeath);

            if (countDeath === 0) {

                user.setHealth(player, 100);
                player.spawn(new mp.Vector3(21.959980010986328, -678.0928955078125, 249.41363525390625), 112.96465301513672);
                setTimeout(function () {
                    try {
                        player.outputChatBoxNew(`!{#FF9800}ВЫ ПРОИГРАЛИ ДУЭЛЬ`);

                        user.reset(player, 'duelBet');
                        user.reset(player, 'duelTarget');
                        user.reset(player, 'duelCount');
                        player.dimension = 0;
                        player.removeAllWeapons();
                        user.setHealth(player, 100);

                        user.blockKeys(player, false);

                        player.setVariable('duel', false);

                        user.teleport(player, -253.9224, -1993.057, 30.14611);
                        if (user.isLogin(target)) {
                            user.teleport(target, -253.9224, -1993.057, 30.14611);
                            target.dimension = 0;
                            target.removeAllWeapons();
                            target.setVariable('duel', false);

                            user.blockKeys(target, false);
                            target.outputChatBoxNew(`!{#4CAF50}ВЫ ВЫИГРАЛИ ДУЭЛЬ`);

                            user.achiveDoneAllById(target, 3);

                            let rating = methods.parseInt((100 - ((user.get(target, 'rating_duel_mmr') - user.get(player, 'rating_duel_mmr')) * 0.1)) / 10);
                            if (rating > 0)
                                user.set(player, 'rating_duel_mmr', user.get(player, 'rating_duel_mmr') - rating);
                            user.set(target, 'rating_duel_mmr', user.get(target, 'rating_duel_mmr') + rating);

                            user.set(target, 'rating_duel_win', user.get(target, 'rating_duel_win') + 1);
                            user.set(target, 'rating_duel_count', user.get(target, 'rating_duel_count') + 1);
                            user.set(player, 'rating_duel_count', user.get(player, 'rating_duel_count') + 1);

                            if (bet > 0 && user.has(target, 'duelBet')) {
                                user.addCashMoney(target, bet * 2, 'Победа в дуэли');
                            }

                            user.reset(target, 'duelBet');
                            user.reset(target, 'duelTarget');
                            user.reset(target, 'duelCount');
                            user.setHealth(target, 100);

                            user.save(player);
                            user.save(target);
                        }
                    }
                    catch (e) {
                        
                    }
                }, methods.getRandomInt(1000, 2000));
                return;
            }

            user.setHealth(player, 100);
            player.spawn(new mp.Vector3(21.959980010986328, -678.0928955078125, 249.41363525390625), 112.96465301513672);
            if (user.isLogin(target)) {
                user.setHealth(target, 100);
                target.spawn(new mp.Vector3(-27.21993637084961, -701.0771484375, 249.4136505126953), 291.64434814453125);

                player.outputChatBoxNew(`!{#03A9F4}НАЧАЛО РАУНДА`);
                target.outputChatBoxNew(`!{#03A9F4}НАЧАЛО РАУНДА`);

                user.duelTimer(player);
                user.duelTimer(target);

                player.outputChatBoxNew(`!{#f44336}Осталось смертей у Вас:!{#FFFFFF} ${user.get(player, 'duelCount')}`);
                player.outputChatBoxNew(`!{#f44336}Осталось смертей у противника:!{#FFFFFF} ${user.get(target, 'duelCount')}`);
                target.outputChatBoxNew(`!{#f44336}Осталось смертей у Вас:!{#FFFFFF} ${user.get(target, 'duelCount')}`);
                target.outputChatBoxNew(`!{#f44336}Осталось смертей у противника:!{#FFFFFF} ${user.get(player, 'duelCount')}`);
            }
            else {
                if (bet > 0)
                    user.addCashMoney(player, bet * 2, 'Победа в дуэли');
                user.reset(player, 'duelBet');
                user.reset(player, 'duelTarget');
                user.reset(player, 'duelCount');
                player.dimension = 0;
                player.removeAllWeapons();
                user.blockKeys(player, false);
                user.teleport(player, -253.9224, -1993.057, 30.14611);

                player.setVariable('duel', false);
            }
            return;
        }

        inventory.deleteItemsRange(player, 138, 141);
        user.set(player, 'killerInJail', false);

        setTimeout(function () {
            let rand = 'a';
            switch (methods.getRandomInt(0, 10)) {
                case 0:
                    rand = 'b';
                    break;
                case 1:
                    rand = 'c';
                    break;
                case 2:
                    rand = 'd';
                    break;
                case 3:
                    rand = 'e';
                    break;
                case 4:
                    rand = 'f';
                    break;
                case 5:
                    rand = 'g';
                    break;
                case 6:
                    rand = 'h';
                    break;
            }
            user.playAnimation(player, 'dead', 'dead_' + rand, 9);
        }, 4000);
    }

    if (user.isLogin(killer)) {
        if (user.get(player, 'wanted_level') > 0 && user.isPolice(killer)) {
            user.set(player, 'killerInJail', true);
        }
    }
});

mp.events.addRemoteCounted("playerDeathDone", (player) => {
    if (user.isLogin(player)) {
        try {
            player.dimension = 0;
        }
        catch (e) {}
        /*if (user.has(player, 'killerInJail') && user.get(player, 'killerInJail')) {
            user.jail(player, user.get(player, 'wanted_level') * 120);
            player.outputChatBoxNew('!{#FFC107}Вас привезли в больницу с огнестрельным ранением и у врачей возникли подозрения, поэтому они сделали запрос в SAPD и сотрудники SAPD выяснили, что у вас есть розыск. После лечения вы отправились в тюрьму.');
            user.toLspdSafe(player);
        }*/
    }
});

mp.events.add('playerReady', player => {

    user.ready(player);

    methods.saveLog('log_connect',
        ['type', 'social', 'serial', 'address', 'game_id', 'account_id'],
        ['READY', player.socialClub, player.serial, player.ip, player.id, 0]
    );

    player.spawn(new mp.Vector3(8.243752, 527.4373, 171.6173));
    player.outputChatBoxNew = function(message) {
        try {
            this.call("client:chat:sendMessage", [message]);
        }
        catch (e) {
            methods.debug(e);
        }
    };

    player.notify = function(message, flashing = false, textColor = -1, bgColor = -1, flashColor = [77, 77, 77, 200]) {
        try {
            this.call("BN_Show", [message, flashing, textColor, bgColor, flashColor]);
        }
        catch (e) {
            methods.debug(e);
        }
    };

    player.notifyWithPicture = function(title, sender, message, notifPic, icon = 0, flashing = false, textColor = -1, bgColor = -1, flashColor = [77, 77, 77, 200]) {
        try {
            this.call("BN_ShowWithPicture", [title, sender, message, notifPic, icon, flashing, textColor, bgColor, flashColor]);
        }
        catch (e) {
            methods.debug(e);
        }
    };
});

/*process.on('exit', (code) => {
    methods.debug(code);
});*/

/*process.on('SIGINT', shutdownProcess);  // Runs when you Ctrl + C in console
process.on('SIGHUP', shutdownProcess);  // Runs when you press the 'Close' button on your server.exe window
//process.on('SIGKILL', shutdownProcess);
function shutdownProcess(){
    process.exit(0);
}*/

/*process
    .on('unhandledRejection', (reason, p) => {
        console.error(reason, 'Unhandled Rejection at Promise', p);
    })
    .on('uncaughtException', err => {
        console.error(err, 'Uncaught Exception thrown');
    });*/
