import user from "../user";
import weapons from "../weapons";
import inventory from "../inventory";
import phone from "../phone";
import enums from "../enums";
import chat from "../chat";

import methods from "../modules/methods";
import Container from "../modules/data";
import ui from "../modules/ui";

import vehicles from "../property/vehicles";

import vSync from "./vSync";
import license from "./license";
import weather from './weather';
import hosp from './hosp';
import discord from "./discord";
import checkpoint from "./checkpoint";
import dispatcher from "./dispatcher";
import bind from "./bind";
import achievement from "./achievement";

import fuel from "../business/fuel";

//import dispatcher from "./dispatcher";

let EntityFleeca = 0;
let EntityOther1 = 0;
let EntityOther2 = 0;
let EntityOther3 = 0;
let EntityFuel = 0;

let isDisableControl = false;
let isDisableShift = false;
let allModelLoader = false;
let afkTimer = 0;
let afkLastPos = new mp.Vector3(0, 0, 0);

let deathTimer = 0;

let timer = {};

let intervalMap = new Map();


timer.maxSpeed = 500;
timer.newMaxSpeed = 0;
timer.newMaxSpeedServer = 0;

timer.createInterval = function(key, func, delay) {
    if (intervalMap.has(key))
        return null;
    try {
        methods.debug('CREATE_INTERVAL', key, delay);
        let value = setInterval(func, delay);
        intervalMap.set(key, value);
    }
    catch (e) {
        methods.debug('TIMER_ERROR', key, e);
    }
};

timer.deleteInterval = function(key) {
    if (!intervalMap.has(key))
        return false;
    try {
        clearInterval(intervalMap.get(key));
        intervalMap.delete(key);
        return true;
    }
    catch (e) {
        
    }
    return false;
};

timer.setDeathTimer = function(sec) {
    deathTimer = sec;
    let desc = '';
    if (!Container.Data.HasLocally(mp.players.local.remoteId, "isEmsTimeout"))
        desc = '~br~Нажмите Y чтобы вызвать медиков~br~Нажмите N чтобы отказаться от помощи и сбросить таймер';
    if (sec > 0)
        ui.showDialog(`Время до возрождения ${deathTimer} сек.${desc}`, '', 'none', [], ui.dialogTypes.centerBottom, 0, false, false);
    else {
        user.stopAllScreenEffect();
        ui.hideDialog();
    }
};

timer.getDeathTimer = function() {
    return deathTimer;
};

timer.updateTempLevel = function() {

    let clothList = user.getSex() == 1 ? JSON.parse(enums.clothF) : JSON.parse(enums.clothM);

    if (weather.getWeatherTemp() < 18 && user.getCache('torso') == 15) {
        mp.game.ui.notifications.show("~y~У Вас замерз торс");
        user.setHealth(mp.players.local.getHealth() - 2);
        return;
    }
    else {
        for (let i = 0; i < clothList.length; i++) {
            if (clothList[i][1] != 11) continue;
            if (clothList[i][2] != user.getCache('body')) continue;
            if (clothList[i][10] > weather.getWeatherTemp())
            {
                mp.game.ui.notifications.show("~y~У Вас замерз торс");
                user.setHealth(mp.players.local.getHealth() - 1);
                break;
            }
        }
    }

    for (let i = 0; i < clothList.length; i++) {
        if (clothList[i][1] != 4) continue;
        if (clothList[i][2] != user.getCache('leg')) continue;
        if (clothList[i][10] > weather.getWeatherTemp())
        {
            mp.game.ui.notifications.show("~y~У Вас замерзли ноги");
            user.setHealth(mp.players.local.getHealth() - 1);
            break;
        }
    }

    for (let i = 0; i < clothList.length; i++) {
        if (clothList[i][1] != 6) continue;
        if (clothList[i][2] != user.getCache('foot')) continue;
        if (clothList[i][10] > weather.getWeatherTemp())
        {
            mp.game.ui.notifications.show("~y~У Вас замерзли ступни");
            user.setHealth(mp.players.local.getHealth() - 1);
            break;
        }
    }
};

timer.updateEatLevel = function() {
    if (user.isLogin()) {

        if (user.getCache('jail_time') > 0)
            return;

        if (!mp.players.local.getVariable('enableAdmin')) {
            user.removeEatLevel(5);
            user.removeWaterLevel(10);

            if (user.getEatLevel() < 200 || user.getWaterLevel() < 200) {
                mp.game.cam.shakeGameplayCam("ROAD_VIBRATION_SHAKE", 1.5);
                setTimeout(function () {
                    mp.game.cam.stopGameplayCamShaking(false);
                }, 7000);
            }

            if (phone.isHide()) {
                if (user.getEatLevel() < 100 || user.getWaterLevel() < 100)
                    user.setRagdoll(2000);
            }

            if (user.getEatLevel() < 10)
                user.setHealth(mp.players.local.getHealth() - 5);
            if (user.getWaterLevel() < 10)
                user.setHealth(mp.players.local.getHealth() - 5);
        }
    }
};

timer.twoMinTimer = function() {
    //methods.showHelpNotify();

    let veh = mp.players.local.vehicle; //TODO
    if (veh && mp.vehicles.exists(veh) && veh.getClass() == 18 && !user.isGos()) {
        if (veh.getPedInSeat(-1) == mp.players.local.handle) {
            user.giveWanted(50, 'Угон служебного ТС');
            dispatcher.sendLocalPos('Код 0', `Неизвестный угнал служебный транспорт`, mp.players.local.position, 2);
            dispatcher.sendLocalPos('Код 0', `Неизвестный угнал служебный транспорт`, mp.players.local.position, 5);
        }
    }

    timer.updateEatLevel();

    try {
        if (user.isLogin() && user.getCache('jail_time') < 1) {
            if (mp.players.local.vehicle)
            {
                if (methods.getVehicleInfo(mp.players.local.vehicle.model).class_name == "Cycles" ||
                    methods.getVehicleInfo(mp.players.local.vehicle.model).class_name == "Boats" ||
                    methods.getVehicleInfo(mp.players.local.vehicle.model).class_name == "Motorcycles"
                )
                    timer.updateTempLevel();
            }
            else if (
                mp.players.local.dimension == 0 &&
                mp.game.interior.getInteriorAtCoords(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z) == 0
            )
                timer.updateTempLevel();
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

timer.min15Timer = function() {

    license.checker();

    user.save();
};

timer.ms50Timer = function() {
    try {

        if (Container.Data.HasLocally(mp.players.local.remoteId, 'hasSeat')) {
            mp.players.local.freezePosition(true);
            mp.players.local.setCollision(false, false);
        }
    }
    catch (e) {
    }
};

timer.ms100Timer = function() {

    try {
        isDisableControl = vehicles.checkerControl();
    }
    catch (e) {
    }

    try {
        ui.updateVehValues();
        ui.updateValues();
    }
    catch (e) {
    }
};

let warning = 0;
let isSetSpeed = false;

timer.fourSecTimer = function() {
    mp.events.call('client:vehicle:checker2');
};

timer.twoSecTimer = function() {
    
    try {

        if (user.getCache('s_hud_keys')) {
            ui.callCef('hudk', JSON.stringify({type: 'show'}));
            let data = {
                type: 'updateValues',
                hints: [
                    {key: 'M', text: 'Главное меню'},
                    {key: 'F2', text: 'Курсор'},
                    {key: bind.getKeyName(user.getCache('s_bind_phone')), text: 'Телефон'},
                    {key: bind.getKeyName(user.getCache('s_bind_inv')), text: 'Инвентарь'},
                    {key: bind.getKeyName(user.getCache('s_bind_inv_world')), text: 'Предметы рядом'},
                    {key: bind.getKeyName(user.getCache('s_bind_voice')), text: 'Голосовой чат'},
                ]
            };
            ui.callCef('hudk', JSON.stringify(data));
        }
        else {
            ui.callCef('hudk', JSON.stringify({type: 'hide'}));
        }

        user.setLastWeapon(user.getCurrentWeapon());
    }
    catch (e) {}

    try {

        if (user.isLogin()) {

            if (giveTicketTimeout > 0)
                giveTicketTimeout--;
            if (mp.players.local.isInAnyVehicle(true) && mp.players.local.dimension === 0 && giveTicketTimeout === 0) {
                /*//0xDB89591E290D9182 | GET_TIME_SINCE_PLAYER_DROVE_AGAINST_TRAFFIC
                //0xD559D2BE9E37853B | GET_TIME_SINCE_PLAYER_DROVE_ON_PAVEMENT
                //0x4F5070AA58F69279 | GET_VEHICLE_NODE_IS_SWITCHED_OFF | _GET_IS_SLOW_ROAD_FLAG
                let drove = mp.game.invoke('0xDB89591E290D9182'); //Если 0, то ты едешь по встерчке как мудак

                /eval JSON.stringify(mp.game.pathfind.getVehicleNodeProperties(mp.players.local.vehicle.position.x, mp.players.local.vehicle.position.y, mp.players.local.vehicle.position.z, 1, 1));
                */

                let veh = mp.players.local.vehicle;

                try {
                    if (veh.getVariable('user_id') === user.getCache('id') || veh.getVariable('rentOwner') === user.getCache('id')) {
                        if (
                            veh.getClass() === 0 ||
                            veh.getClass() === 1 ||
                            veh.getClass() === 2 ||
                            veh.getClass() === 3 ||
                            veh.getClass() === 4 ||
                            veh.getClass() === 5 ||
                            veh.getClass() === 6 ||
                            veh.getClass() === 7 ||
                            veh.getClass() === 11 ||
                            veh.getClass() === 12 ||
                            veh.getClass() === 17 ||
                            veh.getClass() === 20
                        ) {
                            mp.vehicles.forEach(v => {
                                try {
                                    let maxSpeed = v.getVariable('radar');
                                    if (!maxSpeed || maxSpeed < 120)
                                        return;
                                    let velocity = v.getVelocity();
                                    let speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y + velocity.z * velocity.z);
                                    speed = Math.round(speed * 2.23693629);
                                    if (speed > 5)
                                        return;

                                    let rPos = v.position;

                                    if (veh.getNumberPlateText().trim() === vehicles.getNumberPlate(veh).trim() && methods.distanceToPos(rPos, veh.position) < 30) {
                                        let ticketPrice = 0;
                                        let ticketSpeed = methods.getCurrentSpeedKmh() - (maxSpeed - 10);
                                        if (methods.getCurrentSpeedKmh() > maxSpeed + 120)
                                            ticketPrice = 1000;
                                        else if (methods.getCurrentSpeedKmh() > maxSpeed + 80)
                                            ticketPrice = 500;
                                        else if (methods.getCurrentSpeedKmh() > maxSpeed + 40)
                                            ticketPrice = 250;
                                        else if (methods.getCurrentSpeedKmh() > maxSpeed)
                                            ticketPrice = 100;

                                        if (ticketPrice > 0) {
                                            if (user.getBankMoney() > ticketPrice) {
                                                mp.events.callRemote('server:vehicle:radarCheck', ticketSpeed, ticketPrice, vehicles.getNumberPlate(veh), v.remoteId);
                                                user.removeBankMoney(ticketPrice, `Штраф за превышение скорости на ${ticketSpeed}км/ч`);
                                            }
                                            else if (user.getCashMoney() > ticketPrice) {
                                                mp.events.callRemote('server:vehicle:radarCheck', ticketSpeed, ticketPrice, vehicles.getNumberPlate(veh), v.remoteId);
                                                user.removeCashMoney(ticketPrice, `Штраф за превышение скорости на ${ticketSpeed}км/ч`);
                                            }
                                            else
                                                user.giveTicket(ticketPrice, `Штраф за превышение скорости на ${ticketSpeed}км/ч`);
                                            mp.game.ui.notifications.show("~y~Вас заметила камера за превышением скорости на ~s~" + ticketSpeed + "км/ч~y~, вам был выписан штраф в размере ~s~" + methods.moneyFormat(ticketPrice));
                                            giveTicketTimeout = 15;
                                        }
                                    }
                                }
                                catch (e) {

                                }
                            });
                            /*if (getStreet.crossingRoad != 0) {

                            }*/
                            /*else {
                                if (veh.getNumberPlateText().trim() === vehicles.getNumberPlate(veh).trim() && methods.getCurrentSpeedKmh() > 30) {
                                    let drove = mp.game.invoke('0xDB89591E290D9182'); //Если 0, то ты едешь по встерчке как мудак | GET_TIME_SINCE_PLAYER_DROVE_AGAINST_TRAFFIC
                                    if (drove === 0) {
                                        if (warnDrove >= 3) {
                                            if (user.getBankMoney() > 500)
                                                user.removeBankMoney(500, 'Штраф за выезд на встречную полосу');
                                            else if (user.getCashMoney() > 500)
                                                user.removeCashMoney(500, 'Штраф за выезд на встречную полосу');
                                            else
                                                user.giveTicket(500, 'Штраф за выезд на встречную полосу');
                                            mp.game.ui.notifications.show("~y~Вас заметила камера за выезд на встречную полосу, вам был выписан штраф в размере $500");
                                            giveTicketTimeout = 30;
                                            warnDrove = 0;
                                        }
                                        else
                                            warnDrove++;
                                    }
                                    else
                                        warnDrove = 0;
                                }
                            }*/
                        }
                    }
                }
                catch (e) {}
            }

            if (user.hasCache('id')) {
                let isVisualArmour = false;

                if (user.getSex() === 0)
                    isVisualArmour = (mp.players.local.getDrawableVariation(8) === 170 || mp.players.local.getDrawableVariation(8) === 172);
                if (user.getSex() === 1)
                    isVisualArmour = (mp.players.local.getDrawableVariation(8) === 207 || mp.players.local.getDrawableVariation(8) === 209);

                if (mp.players.local.getArmour() > 0 && mp.players.local.getDrawableVariation(9) === 0 && !isVisualArmour) {
                    user.set('armor', 12);
                    user.set('armor_color', 1);
                    user.setComponentVariation( 9, 12, 1);
                }
                if (mp.players.local.getArmour() < 1 && mp.players.local.getDrawableVariation(9) > 0) {
                    user.set('armor', 0);
                    user.set('armor_color', 0);
                    inventory.updateItemsEquipByItemId(252, user.getCache('id'), 1, 0, 0);
                    user.setComponentVariation( 9, 0, 0);
                }
            }
        }

        discord.checker();

        let plPos = mp.players.local.position;

        EntityFleeca = mp.game.object.getClosestObjectOfType(plPos.x, plPos.y, plPos.z, 0.68, 506770882, false, false, false);
        EntityOther1 = mp.game.object.getClosestObjectOfType(plPos.x, plPos.y, plPos.z, 0.68, -1126237515, false, false, false);
        EntityOther2 = mp.game.object.getClosestObjectOfType(plPos.x, plPos.y, plPos.z, 0.68, -1364697528, false, false, false);
        EntityOther3 = mp.game.object.getClosestObjectOfType(plPos.x, plPos.y, plPos.z, 0.68, -870868698, false, false, false);

        //mp.game.object.getClosestObjectOfType(538.3007, 2671.711, 44.749, 1, mp.game.joaat('prop_cctv_cam_01a'), false, false, false);
        //'prop_cctv_cam_01a', -191.7636, 618.1489, 201.4

        EntityFuel = 0;

        fuel.hashList.forEach(hash => {
            if (EntityFuel === 0)
                EntityFuel = mp.game.object.getClosestObjectOfType(plPos.x, plPos.y, plPos.z, 4, hash, false, false, false);
        });

        if (EntityFleeca != 0 || EntityOther1 != 0 || EntityOther2 != 0 || EntityOther3 != 0)
            mp.game.ui.notifications.show("Нажмите ~g~E~s~ чтобы открыть меню банкомата");
        if (EntityFuel != 0) {
            checkpoint.emitEnter(99999);
            mp.game.ui.notifications.show("Нажмите ~g~E~s~ чтобы открыть меню заправки");
        }
        else
            checkpoint.emitExit(99999);

        if (!mp.players.local.isInAnyVehicle(true)) {
            let drawId = mp.players.local.getPropIndex(0);
            if (user.getSex() == 0 && drawId != 116 && drawId != 118)
                mp.game.graphics.setNightvision(false);
            if (user.getSex() == 1 && drawId != 115 && drawId != 117)
                mp.game.graphics.setNightvision(false);
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

timer.allModelLoader = function() {
    allModelLoader = user.getCache('s_load_model');
};

timer.tenSecTimer = function() {

    try {
        if (mp.players.local.isInAnyVehicle(true) && mp.players.local.dimension === 0) { //TODO ПЕРЕПИСАТь
            /*//0xDB89591E290D9182 | GET_TIME_SINCE_PLAYER_DROVE_AGAINST_TRAFFIC
            //0xD559D2BE9E37853B | GET_TIME_SINCE_PLAYER_DROVE_ON_PAVEMENT
            //0x4F5070AA58F69279 | GET_VEHICLE_NODE_IS_SWITCHED_OFF | _GET_IS_SLOW_ROAD_FLAG
            let drove = mp.game.invoke('0xDB89591E290D9182'); //Если 0, то ты едешь по встерчке как мудак

            /eval JSON.stringify(mp.game.pathfind.getVehicleNodeProperties(mp.players.local.vehicle.position.x, mp.players.local.vehicle.position.y, mp.players.local.vehicle.position.z, 1, 1));
            */

            let veh = mp.players.local.vehicle;

            if (
                veh.model !== mp.game.joaat('issi3') &&
                veh.model !== mp.game.joaat('issi4') &&
                veh.model !== mp.game.joaat('issi5') &&
                veh.model !== mp.game.joaat('issi6') &&
                veh.model !== mp.game.joaat('patriot') &&
                veh.model !== mp.game.joaat('patriotc') &&
                veh.model !== mp.game.joaat('comet4') &&
                veh.model !== mp.game.joaat('rumpo3')
            ) {
                if (
                    veh.getClass() === 0 ||
                    veh.getClass() === 1 ||
                    veh.getClass() === 3 ||
                    veh.getClass() === 4 ||
                    veh.getClass() === 5 ||
                    veh.getClass() === 6 ||
                    veh.getClass() === 7 ||
                    veh.getClass() === 11 ||
                    veh.getClass() === 12 ||
                    veh.getClass() === 17 ||
                    veh.getClass() === 20
                ) {
                    /*let value = mp.game.pathfind.getVehicleNodeProperties(mp.players.local.vehicle.position.x, mp.players.local.vehicle.position.y, mp.players.local.vehicle.position.z, 1, 1);
                    //let desc = 'Едешь как поц';
                    if (value.flags >= 8 && value.flags <= 12 || value.flags === 0 || value.flags === 3 || value.flags >= 40 && value.flags <= 47) {
                        let vSpeed = vehicles.getSpeedMax(mp.players.local.vehicle.model) / 2.5;
                        let currentSpeed = methods.getCurrentSpeedKmh();
                        isSetSpeed = true;
                        if (vSpeed < currentSpeed)
                            mp.events.call('client:setNewMaxSpeedServer', currentSpeed - (4 * 5));
                    }
                    else if (isSetSpeed) {
                        isSetSpeed = false;
                        mp.events.call('client:setNewMaxSpeedServer', 0);
                    }*/
                    /*if (mp.game.invoke('0xDB89591E290D9182', mp.players.local) === 0)
                        desc = 'Едешь по встречке';
                    chat.sendLocal(`${isSetSpeed} | ${value.flags} | ${desc}`);*/
                }
            }
        } else if (isSetSpeed) {
            isSetSpeed = false;
            mp.events.call('client:setNewMaxSpeedServer', 0);
        }
    }
    catch (e) {

    }

    if (user.isLogin()) {
        weapons.getMapList().forEach(item => {
            let hash = item[1] / 2;
            if (!mp.game.invoke(methods.HAS_PED_GOT_WEAPON, mp.players.local.handle, hash, false)) {
                if (Container.Data.HasLocally(0, hash.toString())) {
                    Container.Data.ResetLocally(0, hash.toString());
                    Container.Data.Reset(mp.players.local.remoteId, hash.toString());
                }
            }
        });
        vSync.syncToServer();
        mp.events.call('client:vehicle:checker');
    }

    try {
        if (!mp.game.streaming.isIplActive("ex_sm_15_office_03b"))
            methods.requestIpls();

        if (allModelLoader) {
            try {
                mp.game.invoke("0xBD6E84632DD4CB3F");
            }
            catch (e) {
                methods.debug(e);
            }
        }
    }
    catch (e) {
        
    }

    Container.Data.ResetLocally(mp.players.local.remoteId, "isGunTimeout");

    /*let plPos = mp.players.local.position;
    let isGive = false;

    if (mp.players.local.dimension === 0 && !mp.players.local.isInAnyVehicle(true)) { //TODO Возможно вырезать это говно
        if (mp.players.local.weapon !== 2725352035 && !user.isGos()) {

            enums.cctvProps.forEach(prop => {

                try {
                    let entity = mp.game.object.getClosestObjectOfType(plPos.x, plPos.y, plPos.z, 10, mp.game.joaat(prop), false, false, false);
                    if (
                        entity !== 0 &&
                        mp.game.invoke('0xEEF059FAD016D209', entity) > 950 && //GET_ENTITY_HEALTH
                        mp.game.invoke('0xFCDFF7B72D23A1AC', entity, mp.players.local.handle, 17)// HAS_ENTITY_CLEAR_LOS_TO_ENTITY
                    ) {
                        if (!isGive) {
                            isGive = true;
                            warning++;
                        }

                        if (warning >= 4) {
                            user.giveWanted(1, 'Оружие в публичном месте');
                            warning = 0;
                        }
                        else {
                            mp.game.ui.notifications.show("~y~Вас заметила камера\nУберите оружие или вы будете получать розыск");
                        }
                    }
                }
                catch (e) {
                    methods.debug(e);
                }
            });
        }
        else {
            warning = 0;
        }
    }*/
};

let prevWpPos = new mp.Vector3(0, 0, 0);
let isLoaded = false;
let playerPrevPos = new mp.Vector3(0, 0, 0);
let giveTicketTimeout = 0;
let warnDrove = 0;
timer.distInVehicle = 0;

timer.secTimer = function() {

    try {
        if (user.isLogin()) {

            if (mp.game.player.getSprintStaminaRemaining() > 90) {
                achievement.doneDailyById(9);
                isDisableShift = true;
            }
            if (mp.game.player.getSprintStaminaRemaining() < 10)
                isDisableShift = false;
            mp.game.invoke(methods.SET_PLAYER_SPRINT, mp.players.local, !isDisableShift);

            let dist = methods.distanceToPos(mp.players.local.position, playerPrevPos);
            if (!mp.players.local.isInAnyVehicle(true) && dist < 100) {
                if (mp.players.local.isWalking())
                    user.set('st_walk', user.getCache('st_walk') + dist);
                else if (mp.players.local.isDiving() || mp.players.local.isSwimming() || mp.players.local.isSwimmingUnderWater())
                    user.set('st_swim', user.getCache('st_swim') + dist);
                else
                    user.set('st_run', user.getCache('st_run') + dist);
            }
            else if (mp.players.local.isInAnyVehicle(true)) {
                if (mp.players.local.vehicle.isInAir())
                    user.set('st_fly', user.getCache('st_fly') + dist);
                else
                    user.set('st_drive', user.getCache('st_drive') + dist);

                timer.distInVehicle = timer.distInVehicle + dist;
            }
            playerPrevPos = mp.players.local.position;

            /*if (user.hasCache('rentTradeB') && !ui.isGreenZone())
                mp.events.callRemote('server:tradeMarket:unrentBlack', user.getCache('rentTradeB'));
            else if (user.hasCache('rentTrade') && !ui.isGreenZone())
                mp.events.callRemote('server:tradeMarket:unrentBeach', user.getCache('rentTrade'));*/
        }
    }
    catch (e) {}

    /*if (!isLoaded && methods.distanceToPos(mp.players.local.position, new mp.Vector3(-1096.445,-831.962,23.033)) < 100) {
        try {
            let vesp2_1ipl = mp.game.interior.getInteriorAtCoordsWithType(-1096.445,-831.962,23.033,"int_vesp_1_2");
            //let vesp3_1ipl = mp.game.interior.getInteriorAtCoordsWithType(-1091.963,-831.206,26.827,"int_vesp_3_2");
            let vesp02_2ipl = mp.game.interior.getInteriorAtCoordsWithType(-1095.002,-838.586,10.276,"int_vesp_02_1");
            //let vesp02_1ipl = mp.game.interior.getInteriorAtCoordsWithType(-1095.002,-838.586,10.276,"int_vesp_02_2");
            let vesp01_2ipl = mp.game.interior.getInteriorAtCoordsWithType(-1088.377,-832.352,5.479,"int_vesp_01_1");
            let vesp01_1ipl = mp.game.interior.getInteriorAtCoordsWithType(-1097.205,-839.141,4.878,"int_vesp_01_2");
            methods.setIplPropState(vesp2_1ipl, "vesp1_2");
            mp.game.interior.refreshInterior(vesp2_1ipl);
            //methods.setIplPropState(vesp3_1ipl, "vesp3_2");
            //mp.game.interior.refreshInterior(vesp3_1ipl);
            methods.setIplPropState(vesp02_2ipl, "vesp02_1");
            mp.game.interior.refreshInterior(vesp02_2ipl);
            //methods.setIplPropState(vesp02_1ipl, "vesp02_2");
            //mp.game.interior.refreshInterior(vesp02_1ipl);
            methods.setIplPropState(vesp01_2ipl, "vesp01_1");
            mp.game.interior.refreshInterior(vesp01_2ipl);
            methods.setIplPropState(vesp01_1ipl, "vesp01_2");
            mp.game.interior.refreshInterior(vesp01_1ipl);

        }
        catch(e) { methods.debug(e) }
        isLoaded = true;
    }
    else if(isLoaded && methods.distanceToPos(mp.players.local.position) > 110) {
        isLoaded = false;
    }*/

    try {
        methods.getStreamPlayerList().forEach((player, i) => {
            if (/*player === localPlayer || */!mp.players.exists(player) || i > 50)
                return false;
            try {
                if (mp.players.local.getVariable('enableAdmin'))
                    player.iSeeYou = true;
                else
                    player.iSeeYou = mp.players.local.hasClearLosTo(player.handle, 17);
                try {
                    player.hasMask = player.getDrawableVariation(1) > 0;
                }
                catch (e) {}
            }
            catch (e) {

            }
        });
    }
    catch (e) {

    }

    try {
        if (!user.isLogin() && !mp.gui.cursor.visible)
            mp.gui.cursor.show(true, true);

        phone.timer();

        /*if (methods.distanceToPos(afkLastPos, mp.players.local.position) < 1) {
            afkTimer++;
            if (afkTimer > 600 && mp.players.local.getVariable('isAfk') !== true)
                user.setVariable('isAfk', true);
        }
        else {
            if (mp.players.local.getVariable('isAfk') === true)
                user.setVariable('isAfk', false);
            afkTimer = 0;
        }
        afkLastPos = mp.players.local.position;*/

        if (user.isOpenPhone()) {
            if (mp.players.local.isPlayingAnim("cellphone@in_car@ds@first_person", "cellphone_horizontal_base", 3) === 0 &&
                mp.players.local.isPlayingAnim("cellphone@female", "cellphone_call_listen_base", 3) === 0 &&
                mp.players.local.isPlayingAnim("cellphone@female", "cellphone_text_read_base", 3) === 0)
                user.hidePhone();
        }

        if (timer.getDeathTimer() > 0) {
            timer.setDeathTimer(timer.getDeathTimer() - 1);

            if (timer.getDeathTimer() == 0)
                hosp.toHosp();
            if (!user.isDead())
                timer.setDeathTimer(0);
        }

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

        let drugId = 0;

        if (user.getDrugLevel(drugId) > 0) {
            user.removeDrugLevel(drugId, 1);

            if (user.getDrugLevel(drugId) > 1000) {
                chat.sendLocal(`!{03A9F4}Вы в коме от передозировки`);
                user.setHealth(-1);
                achievement.doneAllById(16);
            }

            if (!mp.game.graphics.getScreenEffectIsActive("DrugsMichaelAliensFightIn"))
                mp.game.graphics.startScreenEffect("DrugsMichaelAliensFightIn", 0, true);

            if (user.getDrugLevel(drugId) < 1) {
                mp.game.graphics.stopScreenEffect("DrugsMichaelAliensFightIn");
                mp.game.graphics.startScreenEffect("DrugsMichaelAliensFightOut", 0, false);
                setTimeout(function () {
                    mp.game.graphics.stopScreenEffect("DrugsMichaelAliensFightOut");
                }, 10000);
            }
        }

        drugId = 1;
        if (user.getDrugLevel(drugId) > 0) {
            user.removeDrugLevel(drugId, 1);

            if (user.getDrugLevel(drugId) > 1000) {
                chat.sendLocal(`!{03A9F4}Вы в коме от передозировки`);
                user.setHealth(-1);
                achievement.doneAllById(16);
            }

            if (!mp.game.graphics.getScreenEffectIsActive("DrugsTrevorClownsFightIn"))
                mp.game.graphics.startScreenEffect("DrugsTrevorClownsFightIn", 0, true);

            if (user.getDrugLevel(drugId) < 1) {
                mp.game.graphics.stopScreenEffect("DrugsTrevorClownsFightIn");
                mp.game.graphics.startScreenEffect("DrugsTrevorClownsFightOut", 0, false);
                setTimeout(function () {
                    mp.game.graphics.stopScreenEffect("DrugsTrevorClownsFightOut");
                }, 10000);
            }
        }

        drugId = 2;
        if (user.getDrugLevel(drugId) > 0) {
            user.removeDrugLevel(drugId, 1);

            if (user.getDrugLevel(drugId) > 1000) {
                chat.sendLocal(`!{03A9F4}Вы в коме от передозировки`);
                user.setHealth(-1);
                achievement.doneAllById(16);
            }

            if (!mp.game.graphics.getScreenEffectIsActive("DMT_flight"))
                mp.game.graphics.startScreenEffect("DMT_flight", 0, true);

            if (user.getDrugLevel(drugId) < 1) {
                mp.game.graphics.stopScreenEffect("DMT_flight");
            }
        }

        drugId = 3;
        if (user.getDrugLevel(drugId) > 0) {
            user.removeDrugLevel(drugId, 1);

            if (user.getDrugLevel(drugId) > 1000) {
                chat.sendLocal(`!{03A9F4}Вы в коме от передозировки`);
                user.setHealth(-1);
                achievement.doneAllById(16);
            }

            if (!mp.game.graphics.getScreenEffectIsActive("Rampage"))
                mp.game.graphics.startScreenEffect("Rampage", 0, true);

            if (user.getDrugLevel(drugId) < 1) {
                mp.game.graphics.stopScreenEffect("Rampage");
            }
        }

        drugId = 4;
        if (user.getDrugLevel(drugId) > 0) {
            user.removeDrugLevel(drugId, 1);

            if (user.getDrugLevel(drugId) > 1000) {
                chat.sendLocal(`!{03A9F4}Вы в коме от передозировки`);
                user.setHealth(-1);
                achievement.doneAllById(16);
            }

            if (!mp.game.graphics.getScreenEffectIsActive("DrugsDrivingIn"))
                mp.game.graphics.startScreenEffect("DrugsDrivingIn", 0, true);

            if (user.getDrugLevel(drugId) < 1) {
                mp.game.graphics.stopScreenEffect("DrugsDrivingIn");
                mp.game.graphics.startScreenEffect("DrugsDrivingOut", 0, false);
                setTimeout(function () {
                    mp.game.graphics.stopScreenEffect("DrugsDrivingOut");
                }, 10000);
            }
        }

        drugId = 5;
        if (user.getDrugLevel(drugId) > 0) {
            user.removeDrugLevel(drugId, 1);

            if (user.getDrugLevel(drugId) > 1000) {
                chat.sendLocal(`!{03A9F4}Вы в коме от передозировки`);
                user.setHealth(-1);
                achievement.doneAllById(16);
            }

            if (!mp.game.graphics.getScreenEffectIsActive("PeyoteEndIn"))
                mp.game.graphics.startScreenEffect("PeyoteEndIn", 0, true);

            if (user.getDrugLevel(drugId) < 1) {
                mp.game.graphics.stopScreenEffect("PeyoteEndIn");
                mp.game.graphics.startScreenEffect("PeyoteEndOut", 0, false);
                setTimeout(function () {
                    mp.game.graphics.stopScreenEffect("PeyoteEndOut");
                }, 10000);
            }
        }

        drugId = 99;
        if (user.getDrugLevel(drugId) > 0) {
            user.removeDrugLevel(drugId, 1);

            if (user.getDrugLevel(drugId) > 1500) {
                chat.sendLocal(`!{03A9F4}Вы в коме от передозировки`);
                user.setHealth(-1);
                achievement.doneAllById(16);
            }

            if (!mp.game.graphics.getScreenEffectIsActive("ChopVision"))
                mp.game.graphics.startScreenEffect("ChopVision", 0, true);

            if (user.getDrugLevel(drugId) < 1) {
                mp.game.graphics.stopScreenEffect("ChopVision");
            }
        }

        if (user.getCashMoney() < -15000 || user.getBankMoney() < -15000) {
            user.kick(`Anti-Cheat Protection: Пожалуйста, свяжитесь с администрацией`);
            return;
        }

        let wpPos = methods.getWaypointPosition();
        if (mp.players.local.vehicle && wpPos.x != 0 && wpPos.y != 0) {
            if (prevWpPos.x != wpPos.x && prevWpPos.y != wpPos.y)
                mp.events.callRemote('server:changeWaypointPos', wpPos.x, wpPos.y);
        }
        prevWpPos = wpPos;
    }
    catch (e) {
        methods.debug(e);
    }
};

timer.loadAll = function () {
    try {
        timer.createInterval('timer.min15Timer', timer.min15Timer, 1000 * 60 * 15);
    }
    catch (e) {
        
    }
    try {
        timer.createInterval('timer.twoMinTimer', timer.twoMinTimer, 1000 * 60 * 2);
    }
    catch (e) {
        
    }
    try {
        timer.createInterval('timer.twoSecTimer', timer.twoSecTimer, 2000);
    }
    catch (e) {
        
    }
    try {
        timer.createInterval('timer.fourSecTimer', timer.fourSecTimer, 4000);
    }
    catch (e) {

    }
    try {
        timer.createInterval('timer.tenSecTimer', timer.tenSecTimer, 10000);
    }
    catch (e) {
        
    }
    try {
        timer.createInterval('timer.ms50Timer', timer.ms50Timer, 50);
    }
    catch (e) {
        
    }
    try {
        timer.createInterval('timer.ms100Timer', timer.ms100Timer, 100);
    }
    catch (e) {

    }
    try {
        timer.createInterval('timer.secTimer', timer.secTimer, 1000);
    }
    catch (e) {
        
    }

    timer.createInterval('event.renderControl', function () {
        try {
            mp.game.controls.disableControlAction(0,36,true); //LEFT CONTROL

            mp.game.controls.disableControlAction(0,68,true); //ATTACK VEHICLE
            mp.game.controls.disableControlAction(0,114,true); //ATTACK FLY
            mp.game.controls.disableControlAction(0,331,true); //ATTACK FLY
            mp.game.controls.disableControlAction(0,350,true); //E JUMP

            mp.game.controls.disableControlAction(0,243,true);

            mp.game.controls.disableControlAction(0,44,true); //Q укрытие

            mp.game.controls.disableControlAction(0,53,true); //Фонарик на оружие
            mp.game.controls.disableControlAction(0,54,true);

            //DELUXO FIX
            mp.game.controls.disableControlAction(0,357,true);

            //Колесо оружия
            mp.game.controls.disableControlAction(0, 12, true);
            mp.game.controls.disableControlAction(0, 14, true);
            mp.game.controls.disableControlAction(0, 15, true);
            mp.game.controls.disableControlAction(0, 16, true);
            mp.game.controls.disableControlAction(0, 17, true);
            mp.game.controls.disableControlAction(0, 37, true);
            mp.game.controls.disableControlAction(0, 53, true);
            mp.game.controls.disableControlAction(0, 54, true);
            mp.game.controls.disableControlAction(0, 56, true);
            mp.game.controls.disableControlAction(0, 99, true);
            mp.game.controls.disableControlAction(0, 115, true); //FLY WEAP
            mp.game.controls.disableControlAction(0, 116, true); //FLY WEAP
            mp.game.controls.disableControlAction(0, 157, true);
            mp.game.controls.disableControlAction(0, 158, true);
            mp.game.controls.disableControlAction(0, 159, true);
            mp.game.controls.disableControlAction(0, 160, true);
            mp.game.controls.disableControlAction(0, 161, true);
            mp.game.controls.disableControlAction(0, 162, true);
            mp.game.controls.disableControlAction(0, 163, true);
            mp.game.controls.disableControlAction(0, 164, true);
            mp.game.controls.disableControlAction(0, 165, true);
            mp.game.controls.disableControlAction(0, 261, true);
            mp.game.controls.disableControlAction(0, 262, true);
            mp.game.controls.disableControlAction(0, 99, true);
            mp.game.controls.disableControlAction(0, 100, true);

            if (isDisableControl) {
                mp.game.controls.disableControlAction(0, 21, true); //disable sprint
                mp.game.controls.disableControlAction(0, 24, true); //disable attack
                mp.game.controls.disableControlAction(0, 25, true); //disable aim
                mp.game.controls.disableControlAction(0, 47, true); //disable weapon
                mp.game.controls.disableControlAction(0, 58, true); //disable weapon
                mp.game.controls.disableControlAction(0, 263, true); //disable melee
                mp.game.controls.disableControlAction(0, 264, true); //disable melee
                mp.game.controls.disableControlAction(0, 257, true); //disable melee
                mp.game.controls.disableControlAction(0, 140, true); //disable melee
                mp.game.controls.disableControlAction(0, 141, true); //disable melee
                mp.game.controls.disableControlAction(0, 142, true); //disable melee
                mp.game.controls.disableControlAction(0, 143, true); //disable melee
                //mp.game.controls.disableControlAction(0, 75, true); //disable exit vehicle
                //mp.game.controls.disableControlAction(27, 75, true); //disable exit vehicle
                mp.game.controls.disableControlAction(0, 32, true); //move (w)
                mp.game.controls.disableControlAction(0, 34, true); //move (a)
                mp.game.controls.disableControlAction(0, 33, true); //move (s)
                mp.game.controls.disableControlAction(0, 35, true); //move (d)
                mp.game.controls.disableControlAction(0, 59, true);
                mp.game.controls.disableControlAction(0, 60, true);
            }

            if(ui.isGreenZone() && !user.isPolice() && !user.isGov() && !user.isCartel()) {
                mp.game.controls.disableControlAction(2, 24, true);
                mp.game.controls.disableControlAction(2, 25, true);
                mp.game.controls.disableControlAction(2, 66, true);
                mp.game.controls.disableControlAction(2, 67, true);
                mp.game.controls.disableControlAction(2, 69, true);
                mp.game.controls.disableControlAction(2, 70, true);
                mp.game.controls.disableControlAction(2, 140, true);
                mp.game.controls.disableControlAction(2, 141, true);
                mp.game.controls.disableControlAction(2, 142, true);
                mp.game.controls.disableControlAction(2, 143, true);
                mp.game.controls.disableControlAction(2, 257, true);
                mp.game.controls.disableControlAction(2, 263, true);
            }
        }
        catch (e) {}
    }, 5);

    timer.createInterval('event.renderSpeed', function () {
        try {
            let vehicle = mp.players.local.vehicle;
            if (mp.vehicles.exists(vehicle) && mp.players.local.isInAnyVehicle(false)) {
                // And fix max speed
                vehicle.setMaxSpeed(timer.maxSpeed / 3.6); // fix max speed
                if (vehicle.getVariable('boost') > 0) {
                    vehicle.setEngineTorqueMultiplier(vehicle.getVariable('boost'));
                }
                else
                    vehicle.setEngineTorqueMultiplier(1.3);
            }
        }
        catch (e) {

        }
    }, 5);
};

timer.isFleecaAtm = function () {
    return user.getCache('bank_card') > 0 && EntityFleeca != 0;
    //return user.getCache('bank_card') == 2222 && EntityFleeca != 0;
};

timer.isOtherAtm = function () {
    return user.getCache('bank_card') > 0 && (EntityOther1 != 0 || EntityOther2 != 0 || EntityOther3 != 0);
};

timer.isAtm = function () {
    return timer.isOtherAtm() || timer.isFleecaAtm();
};

timer.getAtmHandle = function () {
    if (EntityFleeca)
        return EntityFleeca;
    if (EntityOther1)
        return EntityOther1;
    if (EntityOther2)
        return EntityOther2;
    if (EntityOther3)
        return EntityOther3;
    return 0;
};

timer.isFuel = function () {
    return EntityFuel !== 0;
};

mp.events.add('render', () => {

});

export default timer;