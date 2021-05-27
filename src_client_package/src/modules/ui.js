"use strict";

import methods from "./methods";

import user from "../user";
import voiceRage from "../voiceRage";
import chat from "../chat";
import enums from "../enums";

import weather from "../manager/weather";
import shoot from "../manager/shoot";
import quest from "../manager/quest";
import prolog from "../manager/prolog";

import vehicles from "../property/vehicles";
import phone from "../phone";
import admin from "../admin";

let ui = {};
let uiBrowser = null;

let _zone = 'Подключение к сети GPS';
let _street = '...';

ui.ColorTransparent = [0,0,0,0];
ui.ColorRed = [244,67,54,255];
ui.ColorRed900 = [183,28,28,255];
ui.ColorWhite = [255,255,255,255];
ui.ColorBlue = [33,150,243,255];
ui.ColorGreen = [76,175,80,255];
ui.ColorAmber = [255,193,7];
ui.ColorDeepOrange = [255,87,34,255];

ui.MarkerRed = [244, 67, 54, 100];
ui.MarkerGreen = [139, 195, 74, 100];
ui.MarkerBlue = [33, 150, 243, 100];
ui.MarkerOrange = [255, 152, 0, 100];
ui.MarkerYellow = [255, 235, 59, 100];
ui.MarkerBlue100 = [187, 222, 251, 100];
ui.MarkerWhite = [255, 255, 255, 100];

ui.DisableMouseControl = false;

let showRadar = true;
let canEdit = false;
let showHud = true;
let showMenu = false;
let isGreenZone = false;
let isIslandZone = false;
let isIslandLoad = false;
let isYellowZone = false;

let maxStringLength = 50;

mp.events.add('guiReady', () => {
    mp.events.add('browserDomReady', (browser) => {
        if (browser === uiBrowser) {
            ui.hideHud();

            try {
                if (mp.storage.data.name)
                    ui.callCef('authMain:2', JSON.stringify({type:'login', login: mp.storage.data.name}));

                chat.show(false);
                chat.activate(false);
            }
            catch (e) {}
        }
    });
});

ui.create = function() {
    uiBrowser = mp.browsers.new("package://cef/index.html");
    //uiBrowser.markAsChat();
    //ui.callCef('authMain','{"type": "show"}');
};

ui.showDialog = function(text, title = '', icon = 'none', buttons = ['Ок'], position = ui.dialogTypes.center, dtype = 1, isShowClose = true, cursor = true) {
    if (!mp.gui.cursor.visible)
        mp.gui.cursor.show(cursor, cursor);
    ui.callCef('dialog', JSON.stringify({type: 'updateValues', isShow: true, isShowClose: isShowClose, position: position, text: text, buttons: buttons, icon: icon, title: title, dtype: dtype}));
};

ui.hideDialog = function() {
    mp.gui.cursor.show(false, false);
    ui.callCef('dialog', JSON.stringify({type: 'hide'}));
};

ui.dialogTypes = {
    leftTop: 'leftTop',
    left: 'left',
    leftBottom: 'leftBottom',
    centerTop: 'centerTop',
    center: 'center',
    centerBottom: 'centerBottom',
    rightTop: 'rightTop',
    right: 'right',
    rightBottom: 'rightBottom',
};

ui.fixInterface = function() {
    mp.game.ui.notifications.show('~y~Интерфейс выполняет перезагрузку');
    try {
        uiBrowser.destroy();
    }
    catch (e) {
        methods.debug(e);
    }
    uiBrowser = mp.browsers.new("package://cef/index.html");
    ui.callCef('authMain','{"type": "hide"}');
    ui.hideHud();
    mp.gui.cursor.show(false, false);
    methods.blockKeys(false);

    setTimeout(function () {
        ui.showHud();
        ui.DisableMouseControl = false;
    }, 1000);
};

ui.showSubtitle = function(message, duration = 5000) {
    try {
        mp.game.ui.setTextEntry2("STRING");
        for (let i = 0, msgLen = message.length; i < msgLen; i += maxStringLength)
            mp.game.ui.addTextComponentSubstringPlayerName(message.substr(i, Math.min(maxStringLength, message.length - i)));
        mp.game.ui.drawSubtitleTimed(duration, true);
    }
    catch (e) {
        methods.debug(e);
    }
};

ui.updateGangInfo = function(top1, top2, timerCounter) {
    if (uiBrowser) {
        try {
            let data = {
                type: 'updateGangInfo',
                top1 : top1,
                top2 : top2,
                timerCounter : timerCounter,
            };
            ui.callCef('hudg', JSON.stringify(data));
        }
        catch (e) {
            methods.debug(e);
        }
    }
};

ui.showGangInfo = function() {
    if (uiBrowser) {
        try {
            ui.callCef('hudg','{"type": "showGangInfo"}');
            ui.updatePositionSettings();
        }
        catch (e) {
            methods.debug(e);
        }
    }
};

ui.hideGangInfo = function() {
    if (uiBrowser) {
        try {
            ui.callCef('hudg','{"type": "hideGangInfo"}');
        }
        catch (e) {
            methods.debug(e);
        }
    }
};

ui.updateMafiaInfo = function(top1, top2, top3, timerCounter) {
    if (uiBrowser) {
        try {
            let data = {
                type: 'updateMafiaInfo',
                top1 : top1,
                top2 : top2,
                top3 : top3,
                timerCounter : timerCounter,
            };
            ui.callCef('hudg', JSON.stringify(data));
        }
        catch (e) {
            methods.debug(e);
        }
    }
};

ui.showMafiaInfo = function() {
    if (uiBrowser) {
        try {
            ui.callCef('hudg','{"type": "showMafiaInfo"}');
            ui.updatePositionSettings();
        }
        catch (e) {
            methods.debug(e);
        }
    }
};

ui.hideMafiaInfo = function() {
    if (uiBrowser) {
        try {
            ui.callCef('hudg','{"type": "hideMafiaInfo"}');
        }
        catch (e) {
            methods.debug(e);
        }
    }
};

ui.updatePositionSettings = function() {
    if (uiBrowser) {
        try {
            JSON.parse(user.getCache('s_pos')).forEach(item => {
                let data = {
                    id: item[0],
                    x: item[1],
                    y: item[2],
                };
                ui.callCef('hud-draggable-' + item[0], JSON.stringify(data));
            });
        }
        catch (e) {
            methods.debug(e);
        }
    }
};

ui.updateMenuSettings = function() {
    let rgb = enums.rgbColorsB[user.getCache('s_menu_color')];
    ui.callCef('hudm', JSON.stringify({
        type: 'updateStyle',
        style: {
            font: user.getCache('s_menu_font'),
            fontOffset: 2,
            borderRadius: user.getCache('s_menu_border'),
            bgColor: `rgb(${rgb[0]},${rgb[1]},${rgb[2]},${user.getCache('s_menu_opacity')}`,
            width: user.getCache('s_menu_width') + 'px',
            height: '350px',
        },
    }));
};

ui.showOrHideRadar = function() {
    showRadar = !showRadar;
    mp.game.ui.displayRadar(showRadar);
    if (!showRadar)
        ui.hideHud();
    else
        ui.showHud();
};

ui.showOrHideEdit = function() {
    canEdit = !canEdit;
    if (!canEdit) {
        ui.callCef('hud','{"type": "hideEdit"}');
        mp.game.ui.notifications.show('~g~Вы закончили редактирование интерфейса');
    }
    else {
        ui.callCef('hud','{"type": "showEdit"}');
        mp.game.ui.notifications.show('~g~Вы включили редактирование интерфейса');
    }
};

ui.hideHud = function() {
    mp.game.ui.displayRadar(false);
    chat.activate(false);
    showRadar = false;
    if (uiBrowser) {
        try {
            //TODO
            ui.callCef('hud','{"type": "hide"}');
        }
        catch (e) {
            methods.debug(e);
        }
    }
};

ui.showHud = function() {
    mp.game.ui.displayRadar(true);
    chat.activate(true);
    showRadar = true;
    //return //TODO ВАЖНО
    if (uiBrowser) {
        try {
            //TODO
            ui.callCef('hud','{"type": "show"}');
            ui.updatePositionSettings();
            ui.updateMenuSettings();
            setTimeout(function () {
                chat.updateSettings();
            }, 100)
        }
        catch (e) {
            methods.debug(e);
        }
    }
};

ui.isShowHud = function() {
    return showRadar;
};

ui.isGreenZone = function() {
    return isGreenZone;
};

ui.isIslandZone = function() {
    return isIslandZone;
};

ui.unloadIslandMinimap = function() {
    isIslandLoad = false;
    mp.game.invoke("0x5E1460624D194A38", isIslandLoad);
};

ui.isGreenZoneByPos = function(pos) {
    let isZone = false;
    enums.zoneGreenList.forEach(item => {
        try {
            if (methods.isInPoint(pos, item[2]))
            {
                if (pos.z > item[0] && pos.z < item[1])
                    isZone = true;
            }
        }
        catch (e) {}
    });
    return isZone;
};

ui.isYellowZone = function() {
    return isYellowZone;
};

let speed = false;
let questPrev = '';

ui.updateValues = function() {
    //return; //TODO ВАЖНО
    if (user.isLogin()) {
        try {

            isGreenZone = false;
            enums.zoneGreenList.forEach(item => {
                try {
                    if (methods.isInPoint(mp.players.local.position, item[2]) && mp.players.local.dimension === 0)
                    {
                        if (mp.players.local.position.z > item[0] && mp.players.local.position.z < item[1])
                            isGreenZone = true;
                    }
                }
                catch (e) {}
            });

            if (isIslandZone !== isIslandLoad) {
                isIslandLoad = isIslandZone;
                mp.game.invoke("0x5E1460624D194A38", isIslandLoad); //LOAD_ISLAND_MINIMAP
                mp.game.invoke("0xF74B1FFA4A15FBEA", isIslandLoad); //LOAD_ISLAND_PATHNODE (MINIMAP GPS)
            }

            if (mp.players.local.dimension === 0) {
                if (isGreenZone) {
                    speed = true;
                    if (user.isGos())
                        mp.events.call('client:setNewMaxSpeedServer', 100);
                    else
                        mp.events.call('client:setNewMaxSpeedServer', 60);
                }
                else if (speed) {
                    speed = false;
                    mp.events.call('client:setNewMaxSpeedServer', 0);
                }
            }
            else if (speed) {
                speed = false;
                mp.events.call('client:setNewMaxSpeedServer', 0);
            }

            isYellowZone = weather.getHour() >= 6 && weather.getHour() < 22 && enums.zoneYellowList.indexOf(mp.game.zone.getNameOfZone(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z)) >= 0;

            let data = {
                type: 'updateValues',
                isShow: true,
                temp: weather.getWeatherTempFormat(),
                date: weather.getFullRpDate(),
                time: weather.getFullRpTime(),
                showGreen: isGreenZone,
                showYellow: false,
                background: user.getCache('s_hud_bg'),
            };
            ui.callCef('hudw', JSON.stringify(data));

            data = {
                type: 'updateValues',
                isShow: true,
                district: ui.getCurrentZone(),
                street: ui.getCurrentStreet(),
                background: user.getCache('s_hud_bg'),
            };
            ui.callCef('hudg', JSON.stringify(data));

            data = {
                type: 'updateValues',
                microphone : voiceRage.isEnable(),
                drink: user.getWaterLevel() / 10,
                eat: user.getEatLevel() / 10,
                wallet: methods.moneyFormat(user.getCashMoney(), 999999999999),
                card: user.getCache('bank_card') > 0 ? methods.moneyFormat(user.getBankMoney(), 9999999999999) : 'Нет карты',
                background: user.getCache('s_hud_bg'),
            };
            ui.callCef('hudp', JSON.stringify(data));

            let dateLabel = '';
            if (mp.players.local.getVariable('enableAdmin'))
                dateLabel = 'ADMIN MOD | ';
            if (mp.players.local.getVariable('isAfk'))
                dateLabel = 'AFK | ';

            if (user.getCache('med_time') > 1)
                dateLabel = `Время лечения ${user.getCache('med_time')} сек. | `;
            if (user.getCache('jail_time') > 1)
                dateLabel = `Время в тюрьме ${user.getCache('jail_time')} сек. | `;

            data = {
                type: 'updateValues',
                date: dateLabel + ` LVL: ${user.getCache('work_lvl')}, EXP: ${user.getCache('work_exp')}/${user.getCache('work_lvl') * 500} | ` + weather.getRealDate(),
                time: weather.getRealTime(),
                online: mp.players.length,
                max_player: "1000",
                id: mp.players.local.remoteId,
                showAmmo: !shoot.isIgnoreWeapon() && !mp.players.local.isInAnyVehicle(true),
                ammoMode: shoot.getCurrentModeName(),
                ammoCount: `${user.getCurrentAmmo()}`,
                background: user.getCache('s_hud_bg'),
            };
            ui.callCef('hudl', JSON.stringify(data));

            let questDesc = '';
            if (user.getCache( 'online_time') < 70)
                questDesc = `На сервере действует акция, отыграй 10 часов и получи на выбор Mercedes 600, BMW I760 или Audi A6!`;
            else if (user.getCache( 'online_contall') < 494)
                questDesc = `На сервере действует акция, отыграй 70 часов и получи на выбор Cadilac, BMW X6M или Mercedes GLE! Вам осталось: ${((494 - user.getCache( 'online_contall')) * 8.5).toFixed(1)} мин.`;

            if (user.getCache('quests') && user.getCache('s_hud_quest')) {

                if (user.getCache('startProlog') < 10)
                {
                    let currentTask = prolog.getCurrentTask();
                    data = {
                        type: 'updateQuest',
                        showQuest: true,
                        questTitle: 'Пролог',
                        questText: currentTask,
                    };
                    ui.callCef('hudl', JSON.stringify(data));
                    if (currentTask !== questPrev) {
                        mp.game.audio.playSound(-1, "Mission_Pass_Notify", "DLC_HEISTS_GENERAL_FRONTEND_SOUNDS", false, 0, true);
                        data = {
                            type: 'updateQuestAnim',
                            questAnim: ui.getQuestAnim(),
                        };
                        ui.callCef('hudl', JSON.stringify(data));
                    }
                    questPrev = currentTask;
                }
                else if (user.getQuestCount('standart') < 10)
                {
                    let currentTask = quest.getQuestLineInfo('standart', user.getQuestCount('standart'));
                    data = {
                        type: 'updateQuest',
                        showQuest: true,
                        questTitle: 'Квестовое задание',
                        questText: currentTask,
                        questDesc: questDesc,
                    };

                    if (currentTask !== questPrev) {
                        mp.game.audio.playSound(-1, "Mission_Pass_Notify", "DLC_HEISTS_GENERAL_FRONTEND_SOUNDS", false, 0, true);
                        data = {
                            type: 'updateQuestAnim',
                            questAnim: ui.getQuestAnim(),
                        };
                        ui.callCef('hudl', JSON.stringify(data));
                    }
                    questPrev = currentTask;

                    ui.callCef('hudl', JSON.stringify(data));
                }
                else if (user.getCache('online_wheel') < 999) {

                    if (user.getCache( 'online_wheel') >= 21) {
                        data = {
                            type: 'updateQuest',
                            showQuest: true,
                            questTitle: 'Колесо удачи',
                            questText: `Теперь вам доступно прокрутить колесо удачи в казино Diamond!`,
                            questDesc: questDesc,
                        };
                        ui.callCef('hudl', JSON.stringify(data));
                    }
                    else {
                        data = {
                            type: 'updateQuest',
                            showQuest: true,
                            questTitle: 'Колесо удачи',
                            questText: `Отыграв 3 часа на сервере, у вас есть возможность прокрутить колесо удачи и один из главных призов это дорогой автомобиль, маска или VIP HARD. Вам осталось: ${((21 - user.getCache( 'online_wheel')) * 8.5).toFixed(1)} мин.`,
                            questDesc: questDesc,
                        };
                        ui.callCef('hudl', JSON.stringify(data));
                    }
                }
            }
        }
        catch (e) {
            methods.debug(e);
        }
    }
};

let prevCarState = false;
let vPrevInfo = {};
let vPrevModel = 0;

ui.updateVehValues = function() {
    //return; //TODO ВАЖНО
    if (uiBrowser && user.isLogin()) {
        try {

            let fuelLevel = 0;
            let fuelPostfix = '';
            let fuelMax = 0;
            let isShowSpeed = false;
            let isShowLight = false;
            let isShowEngine = false;
            let isShowLock = false;
            let vName = '';

            let veh = mp.players.local.vehicle;

            if (veh && mp.vehicles.exists(veh)) {
                isShowSpeed = true;
                try {
                    let lightState = veh.getLightsState(1, 1);
                    isShowLight = lightState.lightsOn || lightState.highbeamsOn;
                }
                catch (e) {
                    //methods.debug(e);
                }

                isShowEngine = veh.getIsEngineRunning();
                isShowLock = veh.getDoorLockStatus() !== 1;
                if (veh.model !== vPrevModel)
                    vPrevInfo = methods.getVehicleInfo(veh.model);
                vPrevModel = veh.model;
                if (vPrevInfo.fuel_type > 0) {
                    fuelLevel = methods.parseInt(veh.getVariable('fuel'));
                    fuelPostfix = vehicles.getFuelPostfix(vPrevInfo.fuel_type);
                    fuelMax = vPrevInfo.fuel_full;
                }
                vName = vPrevInfo.display_name;
            }

            let vSpeed = methods.getCurrentSpeed();

            let data = {
                type: 'updateValues',
                isShow: isShowSpeed && phone.isHide(),
                isShowSmall: user.getCache('s_hud_speed'),
                light: isShowLight,
                door: isShowLock,
                engine: isShowEngine,
                fuel: fuelLevel,
                fuelType: fuelPostfix,
                max_fuel: fuelMax,
                speed: vSpeed,
                speedLabel: user.getCache('s_hud_speed_type') ? 'KM/H' : 'MP/H',
                background: user.getCache('s_hud_bg'),
                carname: vName,
            };
            ui.callCef('hudc', JSON.stringify(data));

            if (prevCarState !== isShowSpeed && phone.isHide() && showRadar)
                ui.updatePositionSettings();
            prevCarState = isShowSpeed && phone.isHide() && showRadar;
        }
        catch (e) {
            methods.debug(e);
        }
    }
};

ui.updateZoneAndStreet = function() {
    try {
        const local = mp.players.local;

        if (local.position.z < -30) {
            let dot = ['.', '...'];
            _street = 'Поиск сети GPS' + dot[methods.getRandomInt(0, dot.length)];
            _zone = 'Нет сети';
        }
        else {
            let zone = mp.game.zone.getNameOfZone(local.position.x, local.position.y, local.position.z);
            let getStreet = mp.game.pathfind.getStreetNameAtCoord(local.position.x, local.position.y, local.position.z, 0, 0);
            _street = mp.game.ui.getStreetNameFromHashKey(getStreet.streetName); // Return string, if exist
            _zone = mp.game.ui.getLabelText(zone);
            if (getStreet.crossingRoad != 0)
                _street += ' / ' + mp.game.ui.getStreetNameFromHashKey(getStreet.crossingRoad);

            if (!prolog.isActive()) {
                if (zone === 'PROL' || methods.isInPoint(local.position, enums.zoneIslandList)) {
                    _zone = 'Мексика';
                    _street = 'Кайо-Перико';
                    isIslandZone = true;
                }
                else
                    isIslandZone = false;
            }
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

ui.getZoneName = function(pos) {
    try {
        let zone = mp.game.zone.getNameOfZone(pos.x, pos.y, pos.z);
        if (zone === 'PROL' || methods.isInPoint(pos, enums.zoneIslandList))
            return 'Мексика';
        return mp.game.ui.getLabelText(zone);
    }
    catch (e) {
        methods.debug(e);
    }
    return 'Сан Андреас';
};

ui.getStreetName = function(pos) {
    try {
        let zone = mp.game.zone.getNameOfZone(pos.x, pos.y, pos.z);
        if (zone === 'PROL' || methods.isInPoint(pos, enums.zoneIslandList))
            return 'Мексика';
        let getStreet = mp.game.pathfind.getStreetNameAtCoord(pos.x, pos.y, pos.z, 0, 0);
        let street = mp.game.ui.getStreetNameFromHashKey(getStreet.streetName); // Return string, if exist
        if (getStreet.crossingRoad != 0)
             street += ' / ' + mp.game.ui.getStreetNameFromHashKey(getStreet.crossingRoad);
        return street;
    }
    catch (e) {
        methods.debug(e);
    }
    return '';
};

ui.updateDirectionText = function() {
    try {
        let dgr = mp.players.local.getRotation(0).z + 180;
        if (dgr >= 22.5 && dgr < 67.5)
            return "SE";
        if (dgr >= 67.5 && dgr < 112.5)
            return "E";
        if (dgr >= 112.5 && dgr < 157.5)
            return "NE";
        if (dgr >= 157.5 && dgr < 202.5)
            return "N";
        if (dgr >= 202.53 && dgr < 247.5)
            return "NW";
        if (dgr >= 247.5 && dgr < 292.5)
            return "W";
        if (dgr >= 292.5 && dgr < 337.5)
            return "SW";
    }
    catch (e) {
        methods.debug(e);
    }
    return "S";
};

ui.getCurrentZone = function() {

    return _zone;
};

ui.getCurrentStreet = function() {
    return _street;
};

ui.drawText = function(caption, xPos, yPos, scale, r, g, b, a, font, justify, shadow, outline) {

    if (!mp.game.ui.isHudComponentActive(0))
        return false;

    try {
        mp.game.ui.setTextFont(font);
        mp.game.ui.setTextScale(1, scale);
        mp.game.ui.setTextColour(r, g, b, a);

        if (shadow)
            mp.game.invoke('0x1CA3E9EAC9D93E5E');
        if (outline)
            mp.game.invoke('0x2513DFB0FB8400FE');

        switch (justify)
        {
            case 1:
                mp.game.ui.setTextCentre(true);
                break;
            case 2:
                mp.game.ui.setTextRightJustify(true);
                mp.game.ui.setTextWrap(0, xPos);
                break;
        }

        mp.game.ui.setTextEntry('STRING');
        mp.game.ui.addTextComponentSubstringPlayerName(caption);
        mp.game.ui.drawText(xPos, yPos);
    }
    catch (e) {
        
    }
};

ui.drawRect = function(xPos, yPos, wSize, hSize, r, g, b, a) {
    if (!mp.game.ui.isHudComponentActive(0))
        return false;
    try {
        let x = xPos + wSize * 0.5;
        let y = yPos + hSize * 0.5;
        mp.game.invoke('0x3A618A217E5154F0', x, y, wSize, hSize, r, g, b, a);
    }
    catch (e) {
        
    }
};

ui.drawText3D = function(caption, x, y, z, scale = 0.3) {
    if (!mp.game.ui.isHudComponentActive(0))
        return false;
    try {

        /*let scale = (4.00001 / methods.distanceToPos(new mp.Vector3(x, y, z), mp.players.local.position)) * 0.3;
        if (scale > 0.3) scale = 0.3;
        else if (scale < 0.15) scale = 0.15;
        scale = scale * (1 / game.getFinalRenderedCamFov()) * 100;*/

        mp.game.graphics.setDrawOrigin(x, y, z + 0.5, 0);
        mp.game.ui.setTextFont(0);
        mp.game.ui.setTextScale(scale, scale);
        mp.game.ui.setTextColour(255, 255, 255, 255);
        mp.game.ui.setTextProportional(true);
        mp.game.ui.setTextDropshadow(0, 0, 0, 0, 255);
        mp.game.ui.setTextEdge(2, 0, 0, 0, 150);
        mp.game.invoke('0x2513DFB0FB8400FE');
        mp.game.ui.setTextEntry('STRING');
        mp.game.ui.setTextCentre(true);
        mp.game.ui.addTextComponentSubstringPlayerName(caption);
        mp.game.ui.drawText(0, 0);
        mp.game.invoke('0xFF0B610F6BE0D7AF');
    }
    catch (e) {

    }
};

ui.drawText3DRage = function(caption, x, y, z) {
    if (!mp.game.ui.isHudComponentActive(0))
        return false;
    mp.game.graphics.drawText(caption, [x, y, z + 0.5], { font: 0, color: [255, 255, 255, 255], scale: [0.3, 0.3], outline: true, centre: true });
};

// Эвенты на cef только через эту функцию
ui.getQuestAnim = function() {
    let animList = ['swing', 'tada', 'pulse', 'rubberBand', 'headShake', 'wobble', 'jello'];
    return animList[methods.getRandomInt(0, animList.length)];
};

// Передача на cef с сервера
mp.events.add('client:ui:callCef', (event, value) => {
    ui.callCef(event, value);
});

// Эвенты на cef только через эту функцию
ui.callCef = function(event, value) {
    try {
        if (event === 'authMain:2')
            methods.debug(event, JSON.parse(value));
        if(uiBrowser && methods.isValidJSON(value))
            uiBrowser.execute(`trigger('${event}', '${value}')`);
    }
    catch (e) {
        methods.debug(e);
    }
};

export default ui;