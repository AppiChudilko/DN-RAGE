"use strict";

let methods = {};

import Menu from "./menu";
import ctos from "./ctos";

import enums from "../enums";
import user from "../user";
import menuList from "../menuList";

import timer from "../manager/timer";
import weather from "../manager/weather";

methods.state = true;

methods.GIVE_WEAPON_TO_PED = '0xBF0FD6E56C964FCB';
methods.REMOVE_WEAPON_FROM_PED = '0x4899CB088EDF59B8';
methods.HAS_PED_GOT_WEAPON = '0x8DECB02F88F428BC';
methods.GET_AMMO_IN_PED_WEAPON = '0x015A522136D7F951';
methods.GET_PED_AMMO_TYPE_FROM_WEAPON = '0x7FEAD38B326B9F74';
methods.GET_SELECTED_PED_WEAPON = '0x0A6DB4965674D243';
methods.ADD_AMMO_TO_PED = '0x78F0424C34306220';
methods.SET_PED_AMMO = '0x14E56BC5B5DB6A19';
methods.SET_CURRENT_PED_WEAPON = '0xADF692B254977C0C';
methods.GET_FOLLOW_PED_CAM_VIEW_MODE = '0x8D4D46230B2C353A';
methods.SET_FOLLOW_PED_CAM_VIEW_MODE = '0x5A4F9EDF1673F704';
methods.GET_GAMEPLAY_CAM_RELATIVE_PITCH = '0x3A6867B4845BEDA2';
methods.GET_FOLLOW_VEHICLE_CAM_VIEW_MODE = '0xA4FF579AC0E3AAAE';
methods.SET_FOLLOW_VEHICLE_CAM_VIEW_MODE = '0xAC253D7842768F48';
methods.GIVE_WEAPON_COMPONENT_TO_PED = '0xD966D51AA5B28BB9';
methods.REMOVE_WEAPON_COMPONENT_FROM_PED = '0x1E8BE90C74FB4C09';
methods.SET_PED_WEAPON_TINT_INDEX = '0x50969B9B89ED5738';
methods.IS_WAYPOINT_ACTIVE = '0x1DD1F58F493F1DA5';
methods.SET_ENABLE_HANDCUFFS = '0xDF1AF8B5D56542FA';
methods.TASK_GO_TO_ENTITY = '0x6A071245EB0D1882';
methods.TASK_FOLLOW_TO_OFFSET_OF_ENTITY = '0x304AE42E357B8C7E';
methods.SET_PED_KEEP_TASK = '0x971D38760FBC02EF';
methods.TASK_ENTER_VEHICLE = '0xC20E50AA46D09CA8';
methods.FREEZE_ENTITY_POSITION = '0x428CA6DBD1094446';
methods.SET_INTERIOR_PROP_COLOR = '0xC1F1920BAF281317';
methods.SET_VEHICLE_HAS_MUTED_SIRENS = '0xD8050E0EB60CF274';
methods.SET_RADIO_TO_STATION_INDEX = '0xA619B168B8A8570F';
methods.SET_FRONTEND_RADIO_ACTIVE = '0xF7F26C6E9CC9EBB8';
methods.GET_PLAYER_RADIO_STATION_INDEX = '0xE8AF77C4C06ADC93';
methods.PLAY_SOUND_FROM_ENTITY = '0xE65F427EB70AB1ED';
methods.GET_SOUND_ID = '0x430386FE9BF80B45';
methods.ANIMPOSTFX_STOP_ALL = '0xB4EDDC19532BFB85';
methods.SET_ENTITY_COORDS_NO_OFFSET = '0x239A3351AC1DA385';
methods.SET_PED_CAN_BE_TARGETTED = '0x63F58F7C80513AAD';
methods.SET_PED_CAN_BE_TARGETTED_BY_PLAYER = '0x66B57B72E0836A76';
methods.SET_BLOCKING_OF_NON_TEMPORARY_EVENTS = '0x9F8AA94D6D97DBF4';
methods.TASK_SET_BLOCKING_OF_NON_TEMPORARY_EVENTS = '0x90D2156198831D69';
methods.SET_ENTITY_INVINCIBLE = '0x3882114BDE571AD4';
methods.SET_PED_CAN_RAGDOLL = '0xB128377056A54E2A';
methods.SET_PED_CAN_EVASIVE_DIVE = '0x6B7A646C242A7059';
methods.SET_PED_GET_OUT_UPSIDE_DOWN_VEHICLE = '0xBC0ED94165A48BC2';
methods.SET_PED_AS_ENEMY = '0x02A0C9720B854BFA';
methods.SET_CAN_ATTACK_FRIENDLY = '0xB3B1CB349FF9C75D';
methods.SET_PED_DEFAULT_COMPONENT_VARIATION = '0x45EEE61580806D63';
methods.SET_PLAYER_SPRINT = '0xA01B8075D8B92DF4';
methods.TASK_START_SCENARIO_IN_PLACE = '0x142A02425FF02BD9';
methods.TASK_PLAY_ANIM = '0xEA47FE3719165B94';
methods.DELETE_ENTITY = '0xAE3CBE5BF394C9C9';
methods.DELETE_PED = '0x9614299DCB53E54B';
methods.PLAY_AMBIENT_SPEECH1 = '0x8E04FEDD28D42462';
methods.SET_ENTITY_AS_NO_LONGER_NEEDED = '0xB736A491E64A32CF';
methods.SET_PED_AS_NO_LONGER_NEEDED = '0x2595DD4236549CE3';
methods.SET_MODEL_AS_NO_LONGER_NEEDED = '0xE532F5D78798DAAB';
methods.SET_ENTITY_AS_MISSION_ENTITY = '0xAD738C3085FE7E11';
methods.SET_VEHICLE_MOD = '0x6AF0636DDEDCB6DD';
methods.SET_VEHICLE_UNDRIVEABLE = '0x8ABA6AF54B942B95';
methods.SET_BOAT_FROZEN_WHEN_ANCHORED = '0xE3EBAAE484798530';

methods.SET_VEHICLE_DASHBOARD_COLOUR = '0x6089CDF6A57F326C';
methods.SET_VEHICLE_INTERIOR_COLOUR = '0xF40DD601A65F7F19';

methods.ATTACH_ENTITY_TO_ENTITY = '0x6B9BBD38AB0796DF';
methods.DETACH_ENTITY = '0x961AC54BF0613F5D';
methods.GET_PED_BONE_INDEX = '0x3F428D08BE5AAE31';
methods.SET_ENTITY_COORDS = '0x06843DA7060A026B';
methods.SET_ENTITY_ALPHA = '0x44A0870B7E92D7C0';

methods.ADD_BLIP_FOR_ENTITY = '0x5CDE92C702A8FCE7';
methods.SET_BLIP_ALPHA = '0x45FF974EEE1C8734';
methods.SET_BLIP_COLOUR = '0x03D7FB09E75D6B7E';
methods.SET_BLIP_SPRITE = '0xDF735600A4696DAF';
methods.SET_BLIP_ROTATION = '0xF87683CDF73C3F6E';
methods.SET_BLIP_FLASH = '0xB14552383D39CE3E';
methods.GET_BLIP_SPRITE = '0x1FC877464A04FC4F';
methods.GET_BLIP_COLOUR = '0xDF729E8D20CF7327';

methods.DISABLE_FIRST_PERSON_CAM_THIS_FRAME = '0xDE2EF5DA284CC8DF';

methods.REQUEST_TASK_MOVE_NETWORK_STATE_TRANSITION = '0xD01015C7316AE176';
methods.SET_PED_CURRENT_WEAPON_VISIBLE = '0x0725A4CCFDED9A70';
methods.IS_TASK_MOVE_NETWORK_ACTIVE = '0x921CE12C489C4C41';
methods.SET_TASK_MOVE_NETWORK_SIGNAL_FLOAT = '0xD5BB4025AE449A4E';
methods.SET_TASK_MOVE_NETWORK_SIGNAL_BOOL = '0xB0A6CFD2C69C1088';

const streamedPlayers = new Set();

let _isBlockKeys = false;

mp.events.add({
    'entityStreamIn': (entity) => {
        if (entity.type === 'player') {
            streamedPlayers.add(entity);
        }
    },
    'entityStreamOut': (entity) => {
        if (entity.type === 'player') {
            streamedPlayers.delete(entity);
        }
    }
});

methods.getStreamPlayerList = function() {
    //return [mp.players.local].concat(streamedPlayers);
    return streamedPlayers;
};

methods.pressEToPayRespect = function () {
    if (timer.isFleecaAtm() || timer.isOtherAtm())
        menuList.showAtmMenu();
    if (timer.isFuel())
        menuList.showFuelMenu();
};

methods.sleep = function(ms) {
    return new Promise(res => setTimeout(res, ms));
};

methods.debug = function (message, ...args) {
    if (!user.isAdmin(5))
        return;
    let dateTime = new Date();
    let dateResult = methods.digitFormat(dateTime.getHours()) + ':' + methods.digitFormat(dateTime.getMinutes())+ ':' + methods.digitFormat(dateTime.getSeconds());
    //mp.gui.chat.push(`!{03A9F4}[DEBUG | ${dateResult}]!{FFFFFF} ${message.toString().replace('Exception: ', '!{f44336}Exception: ')}`);
    try {
        mp.events.callRemote('server:clientDebug', `${message} | ${JSON.stringify(args)} | ${args.length}`)
    } catch (e) {
    }
};

methods.error = function (message, ...args) {
    try {
        message = 'OMG! EXCEPTION: ' + message;
        methods.debug(message, args);
    } catch (e) {
    }
};

/*methods.arraySortAlphabet = function (a) {
    return a => 10 > a ? 2e4 + +a : a.charCodeAt(0);
};*/

methods.getVehicleInfo = function (model) {
    try {
        let vehInfo = enums.vehicleInfo;
        for (let item in vehInfo) {
            let vItem = vehInfo[item];
            if (vItem.hash == model || vItem.display_name == model || vItem.display_name.toLowerCase() == model.toString().toLowerCase() || mp.game.joaat(vItem.display_name.toString().toLowerCase()) == model)
                return vItem;
        }

        if (vehInfo.length < 500) {
            enums.resetVehicleInfo();
            mp.events.callRemote('server:updateVehicleInfo');
        }
    }
    catch (e) {
        
    }
    return {
        id: 0,
        hash: model,
        display_name: 'Unknown',
        class_name: 'Unknown',
        class_name_ru: 'Unknown',
        m_name: 'Unknown',
        n_name: 'Unknown',
        stock: 378000,
        stock_full: 205000,
        price: 50000,
        fuel_full: 75,
        fuel_min: 8,
        fuel_type: 0,
        type: 0,
        sb: 1,
        sm: 200,
        tm: 0,
        temp: 1,
        anchor: 0,
        lck: 0,
        sbag: 5000,
        trucker: 0,
        t_main: 0,
        t_color: 1,
        t_inside: 1,
        t_chip: 1,
        t_vis: 1,
        t_module: 1,
        t_extra: 1,
        t_wheels: 1,
        t_block: "{}",
        t_neon: 1,
        t_light: 1,
        r_speed: 0,
        a_spawn: 1,
        s_park: 0,
        ticket_z: 0,
        lc: 1,
        blt: 1,
        siren: 0,
        k_block: "[]",
    };
};

methods.setVehicleInfo = function (model, value) {
    try {
        let vehInfo = enums.vehicleInfo;
        for (let item in vehInfo) {
            let vItem = vehInfo[item];
            if (vItem.hash == model || vItem.display_name == model || mp.game.joaat(vItem.display_name.toString().toLowerCase()) == model)
                vehInfo[item] = value;
        }
    }
    catch (e) {

    }
};

methods.getFrameTime = function () {
    return methods.parseFloatHex(mp.game.invoke('0x15C40837039FFAF7').toString(16));
};

methods.getCountMask = function (slot, shopId) {
    let count = 0;
    for (let i = 0; i < enums.maskList.length; i++) {
        let maskItem = enums.maskList[i];
        if (maskItem[0] !== slot)
            continue;
        if (maskItem[13] !== shopId)
            continue;
        count++;
    }
    return count;
};

methods.parseInt = function (str) {
    return parseInt(str) || 0;
};

methods.parseFloat = function (str) {
    return parseFloat(str) || 0;
};

methods.parseFloatHex = function (str) {
    str = '0x' + str;
    var float = 0, sign, order, mantiss,exp,
        int = 0, multi = 1;
    if (/^0x/.exec(str)) {
        int = parseInt(str,16);
    }else{
        for (var i = str.length -1; i >=0; i -= 1) {
            if (str.charCodeAt(i)>255) {
                return 0;
            }
            int += str.charCodeAt(i) * multi;
            multi *= 256;
        }
    }
    sign = (int>>>31)?-1:1;
    exp = (int >>> 23 & 0xff) - 127;
    mantiss = ((int & 0x7fffff) + 0x800000).toString(2);
    for (i=0; i<mantiss.length; i+=1){
        float += parseInt(mantiss[i])? Math.pow(2,exp):0;
        exp--;
    }
    return float*sign;
};

methods.getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

methods.getRandomFloat = function () {
    return methods.getRandomInt(0, 10000) / 10000;
};

methods.getRandomBankCard = function (prefix = 0) {
    if (prefix == 0)
        prefix = methods.getRandomInt(1000, 9999);

    let num1 = methods.getRandomInt(1000, 9999);
    let num2 = methods.getRandomInt(1000, 9999);
    let num3 = methods.getRandomInt(1000, 9999);

    return methods.parseInt(`${prefix}${num1}${num2}${num3}`);
};

methods.getRandomPhone = function (prefix = 0) {
    if (prefix == 0)
        prefix = methods.getRandomInt(100, 999);
    let num = methods.getRandomInt(1000000, 9999999);
    return methods.parseInt(`${prefix}${num}`);
};

methods.getRandomWorkID = function() {
    let prefix = 'WID' + weather.getYear();
    let number = Date.now().toString().substr(2);
    return `${prefix}-${number}`;
};

methods.unixTimeStampToDateTime = function (timestamp) {
    let dateTime = new Date(timestamp * 1000);
    return `${methods.digitFormat(dateTime.getHours())}:${methods.digitFormat(dateTime.getMinutes())} ${methods.digitFormat(dateTime.getDate())}/${methods.digitFormat(dateTime.getMonth()+1)}/${dateTime.getFullYear()}`
};

methods.unixTimeStampToDateTimeShort = function (timestamp) {
    let dateTime = new Date(timestamp * 1000);
    return `${methods.digitFormat(dateTime.getHours())}:${methods.digitFormat(dateTime.getMinutes())} ${methods.digitFormat(dateTime.getDate())}/${methods.digitFormat(dateTime.getMonth()+1)}`
};

methods.unixTimeStampToDate = function (timestamp) {
    let dateTime = new Date(timestamp * 1000);
    return `${methods.digitFormat(dateTime.getDate())}/${methods.digitFormat(dateTime.getMonth()+1)}/${dateTime.getFullYear()}`
};

methods.disableAllControls = function(disable) {
    mp.events.call('client:events:disableAllControls', disable);
};

methods.disableDefaultControls = function(disable) {
    mp.events.call("client:events:disableDefaultControls", disable);
};

methods.blockKeys = function(enable) {
    _isBlockKeys = enable;
};

methods.isValidJSON = function(value){
    try{
        JSON.parse(value);
        return true;
    }
    catch (error){
        methods.debug(`Invalid JSON string\n${error}`);
        return false;
    }
};

methods.isBlockKeys = function() { //TODO
    return Menu.Menu.IsShowInput() || user.isCuff() || user.isTie() || user.isDead() || user.isKnockout() || _isBlockKeys/* || mp.gui.cursor.visible*/;
};

methods.isBlockJustKeys = function() { //TODO
    return _isBlockKeys/* || mp.gui.cursor.visible*/;
};

methods.isBlockInputKeys = function() { //TODO
    return Menu.Menu.IsShowInput() || _isBlockKeys/* || mp.gui.cursor.visible*/;
};

methods.isShowInput = function() {
    return Menu.Menu.IsShowInput();
};

methods.distanceToPos = function (v1, v2) {
    return Math.abs(Math.sqrt(Math.pow((v2.x - v1.x),2) +
        Math.pow((v2.y - v1.y),2)+
        Math.pow((v2.z - v1.z),2)));
};

methods.distanceToPos2D = function (v1, v2) {
    return Math.abs(Math.sqrt(Math.pow((v2.x - v1.x),2) +
        Math.pow((v2.y - v1.y),2)));
};

methods.getNearestHousePos = function(pos, r) {
    let nearest, dist;
    let min = r;
    mp.blips.forEach(b => {
        if (b.getSprite() !== 40 && b.getSprite() !== 492)
            return;

        dist = methods.distanceToPos(pos, b.getCoords());
        if (dist < min) {
            nearest = b.getCoords();
            min = dist;
        }
    });
    return nearest || new mp.Vector3(0, 0, 70);
};

methods.getNearestPlayerWithCoords = function(pos, r) {
    let nearest, dist;
    let min = r;
    methods.getListOfPlayersInStream().forEach(player => {
        dist = methods.distanceToPos(pos, player.position);
        if (dist < min) {
            nearest = player;
            min = dist;
        }
    });
    return nearest;
};

methods.getListOfPlayersInStream = function() {
    let returnPlayers = [];
    mp.players.forEachInStreamRange(player => {
            if (mp.players.local !== player) {
                returnPlayers.push(player);
            }
        }
    );
    return returnPlayers;
};

methods.getNearestVehicleWithCoords = function(pos, r) {
    let nearest = undefined, dist;
    let min = r;
    methods.getListOfVehicleInStream().forEach(vehicle => {
        dist = methods.distanceToPos(pos, vehicle.position);
        if (dist < min) {
            nearest = vehicle;
            min = dist;
        }
    });
    return nearest;
};

methods.getListOfVehicleInStream = function() {
    let returnVehicles = [];
    mp.vehicles.forEachInStreamRange(vehicle => {
        returnVehicles.push(vehicle);
    });
    return returnVehicles;
};

methods.getListOfPlayerInRadius = function(pos, r) {
    let returnPlayers = [];
    methods.getListOfPlayersInStream().forEach(player => {
        if (methods.distanceToPos(pos, player.position) < r)
            returnPlayers.push(player);
    });
    return returnPlayers;
};

methods.removeQuotes = function (str) {
    //TODO RemoveSlash
    return methods.replaceAll(str, '\'', '');
    //return str.toString().replace('\'', '');
};

methods.removeQuotes2 = function(str) {
    return methods.replaceAll(str, '"', '');
    //return text.toString().replace('"', '');
};

methods.removeQuotesAll = function(str) {
    return methods.replaceQuotes(str);
    //return text.toString().replace('"', '');
};

methods.removeSpecialChars = function(str) {
    return str.toString().replace(/[\n\r\t]/g, '');
    //return text.toString().replace('"', '');
};

methods.replaceQuotes = function(str) {
    try {
        str = methods.replaceAll(str, '"', '`');
        str = methods.replaceAll(str, '\'', '`');
    }
    catch (e) {}
    return str;
};

methods.escapeRegExp = function(str) {
    return str.toString().replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
};

methods.replaceAll = function(str, find, replace){
    return str.toString().replace(new RegExp(methods.escapeRegExp(find), 'g'), replace);
    //return string.toString().split(search).join(replace);
};

methods.saveLog = function (table, cols, values) {
    let colStr = '';
    let valStr = '';

    if (typeof cols === 'object')
        colStr = methods.removeQuotes(methods.removeQuotes2(cols.toString()));

    if (typeof values === 'object') {
        values.forEach(item => {
            valStr += `'${methods.removeQuotes(methods.removeQuotes2(item))}',`
        });
        valStr = valStr.slice(0, -1);
    }

    mp.events.callRemote('server:saveLog', table, colStr, valStr);
};

methods.saveFile = function(file, log){
    mp.events.callRemote('server:saveFile', file, log);
};

methods.saveFractionLog = function(name, doName, text, fractionId = 0) {
    mp.events.callRemote('server:addFractionLog', name, doName, text, fractionId);
};

methods.getLicName = function (lic) {
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
            licName = 'Разрешение на рыболовство';
            break;
        case 'med_lic':
            licName = 'Мед. страховка';
            break;
    }
    return licName;
};

methods.getWaypointPosition = function () {
    let pos = new mp.Vector3(0, 0, 0);
    if (methods.isWaypointPosition()) {
        let blipInfoIdIterator = mp.game.invoke('0x186E5D252FA50E7D');
        for (let index = mp.game.invoke('0x1BEDE233E6CD2A1F', blipInfoIdIterator); mp.game.invoke('0xA6DB27D19ECBB7DA', index); index = mp.game.invoke('0x14F96AA50D6FBEA7', blipInfoIdIterator))
            if (mp.game.invoke('0xBE9B0959FFD0779B', index) == 4)
                pos = mp.game.ui.getBlipInfoIdCoord(index);
    }
    return pos;
};

methods.removeAllBlipById = function (blipId = 5) {
    try {
        for (let index = mp.game.invoke('0x1BEDE233E6CD2A1F', blipId); mp.game.invoke('0xA6DB27D19ECBB7DA', index); index = mp.game.invoke('0x14F96AA50D6FBEA7', blipId))
                mp.game.ui.removeBlip(index);
    }
    catch (e) {
        methods.debug(e);
    }
};

methods.displayTypeAllBlipById = function (blipId, type, color = -1) {
    try {
        for (let index = mp.game.invoke('0x1BEDE233E6CD2A1F', blipId); mp.game.invoke('0xA6DB27D19ECBB7DA', index); index = mp.game.invoke('0x14F96AA50D6FBEA7', blipId)) {
            if (color >= 0) {
                if (color === mp.game.invoke(methods.GET_BLIP_COLOUR, index))
                    mp.game.invoke('0x9029B2F3DA924928', index, type);
            }
            else {
                mp.game.invoke('0x9029B2F3DA924928', index, type);
            }
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

methods.isWaypointPosition = function () {
    return mp.game.invoke(methods.IS_WAYPOINT_ACTIVE);
};

methods.numerToK = function (num) {
    return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
};

methods.digitFormat = function(number) {
    return ("0" + number).slice(-2);
};

methods.numberFormat = function (currentMoney) {
    return currentMoney.toString().replace(/.+?(?=\D|$)/, function(f) {
        return f.replace(/(\d)(?=(?:\d\d\d)+$)/g, "$1,");
    });
};

methods.cryptoFormat = function (currentMoney, toFixed = 5) {
    currentMoney = methods.parseFloat(currentMoney);
    return `${methods.numberFormat(currentMoney.toFixed(toFixed))}btc`;
};

methods.moneyFormat = function (currentMoney, maxCentValue = 5000) {
    currentMoney = methods.parseFloat(currentMoney);
    if (currentMoney < maxCentValue)
        return '$' + methods.numberFormat(currentMoney.toFixed(2));
    return '$' + methods.numberFormat(currentMoney.toFixed(0));
};

methods.bankFormat = function (currentMoney) {
    return currentMoney.toString().replace(/.+?(?=\D|$)/, function(f) {
        return f.replace(/(\d)(?=(?:\d\d\d\d)+$)/g, "$1 ");
    });
};

methods.phoneFormat = function (phoneNumber) {
    let phoneNumberString = methods.parseInt(phoneNumber);
    let cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        let intlCode = (match[1] ? '+1 ' : '');
        return [intlCode, '', match[2], ' ', match[3], '-', match[4]].join('');
    }
    return phoneNumberString;
};

methods.procColorFormat = function (currentMoney) {
    if (currentMoney < 20)
        return '~r~' + currentMoney;
    if (currentMoney < 40)
        return '~o~' + currentMoney;
    if (currentMoney < 60)
        return '~y~' + currentMoney;
    return '~g~' + currentMoney;
};

methods.capitalizeFirstLetter  = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

methods.getCurrentSpeed = function () {
    if (user.getCache('s_hud_speed_type'))
        return methods.getCurrentSpeedKmh();
    else
        return methods.getCurrentSpeedMph();
};

methods.getCurrentSpeedKmh = function () {
    const player = mp.players.local;
    let speed = 0;
    if (player.isSittingInAnyVehicle()) {
        let velocity = player.vehicle.getVelocity();
        speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y + velocity.z * velocity.z);
        speed = Math.round(speed * 3.6);
    }
    return speed;
};

methods.getCurrentSpeedMph = function () {
    const player = mp.players.local;
    let speed = 0;
    if (player.isSittingInAnyVehicle()) {
        let velocity = player.vehicle.getVelocity();
        speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y + velocity.z * velocity.z);
        speed = Math.round(speed * 2.23693629);
    }
    return speed;
};

methods.getEntitySpeedMph = function (entity) {
    let speed = 0;
    try {
        if (entity && mp.vehicles.exists(entity)) {
            let velocity = entity.getVelocity();
            speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y + velocity.z * velocity.z);
            speed = Math.round(speed * 2.23693629);
        }
    }
    catch (e) {}
    return speed;
};

methods.sliceArray = function (array, size = 8) {
    let subarray = []; //массив в который будет выведен результат.
    for (let i = 0; i <Math.ceil(array.length/size); i++){
        subarray[i] = array.slice((i*size), (i*size) + size);
    }
    return subarray;
};

methods.setIplPropState = function (interiorId, prop, state = true) {
    if (state)
        mp.game.interior.enableInteriorProp(interiorId, prop);
    else
        mp.game.interior.disableInteriorProp(interiorId, prop);
};

methods.iplMichaelDefault = function () {
    let interiorId = 166657;
    let garageId = 166401;

    methods.setIplPropState(interiorId, "V_Michael_bed_tidy");
    methods.setIplPropState(interiorId, "V_Michael_bed_Messy");
    methods.setIplPropState(interiorId, "V_Michael_M_items");
    methods.setIplPropState(interiorId, "V_Michael_D_items");
    methods.setIplPropState(interiorId, "V_Michael_S_items");
    methods.setIplPropState(interiorId, "V_Michael_L_Items");
    methods.setIplPropState(interiorId, "V_Michael_bed_tidy");
    methods.setIplPropState(interiorId, "Michael_premier", false);
    methods.setIplPropState(interiorId, "V_Michael_FameShame", false);
    methods.setIplPropState(interiorId, "V_Michael_plane_ticket", false);
    methods.setIplPropState(interiorId, "V_Michael_JewelHeist", false);
    methods.setIplPropState(interiorId, "burgershot_yoga", false);
    mp.game.interior.refreshInterior(interiorId);

    methods.setIplPropState(garageId, "V_Michael_Scuba", false);
    mp.game.interior.refreshInterior(garageId);
};

methods.iplArenaModDefault = function () {
    let interiorId = mp.game.interior.getInteriorAtCoords(205.000, 5180.000, -90.000);

    mp.game.streaming.requestIpl('xs_arena_interior_mod');
    mp.game.streaming.requestIpl('xs_arena_interior_mod_2');

    methods.setIplPropState(interiorId, "Set_Int_MOD_SHELL_DEF");
    methods.setIplPropState(interiorId, "Set_Int_MOD2_B1");
    methods.setIplPropState(interiorId, "Set_Int_MOD_BOOTH_BEN");
    methods.setIplPropState(interiorId, "Set_Int_MOD_BEDROOM_BLOCKER");
    methods.setIplPropState(interiorId, "Set_Int_MOD_CONSTRUCTION_01");
    methods.setIplPropState(interiorId, "SET_OFFICE_STANDARD");
    methods.setIplPropState(interiorId, "Set_Mod1_Style_02");
    methods.setIplPropState(interiorId, "SET_BANDITO_RC");
    methods.setIplPropState(interiorId, "set_arena_no peds"); //???
    mp.game.interior.refreshInterior(interiorId);
};

methods.iplYanktonLoad = function () {
    mp.game.streaming.requestIpl('prologue01');
    mp.game.streaming.requestIpl('prologue01c');
    mp.game.streaming.requestIpl('prologue01d');
    mp.game.streaming.requestIpl('prologue01e');
    mp.game.streaming.requestIpl('prologue01f');
    mp.game.streaming.requestIpl('prologue01g');
    mp.game.streaming.requestIpl('prologue01h');
    mp.game.streaming.requestIpl('prologue01i');
    mp.game.streaming.requestIpl('prologue01j');
    mp.game.streaming.requestIpl('prologue01k');
    mp.game.streaming.requestIpl('prologue01z');
    mp.game.streaming.requestIpl('prologue02');
    mp.game.streaming.requestIpl('prologue03');
    mp.game.streaming.requestIpl('prologue03b');
    mp.game.streaming.requestIpl('prologue03_grv_dug');
    mp.game.streaming.requestIpl('prologue_grv_torch');
    mp.game.streaming.requestIpl('prologue04');
    mp.game.streaming.requestIpl('prologue04b');
    mp.game.streaming.requestIpl('prologue04_cover');
    mp.game.streaming.requestIpl('des_protree_end');
    mp.game.streaming.requestIpl('des_protree_start');
    mp.game.streaming.requestIpl('prologue05');
    mp.game.streaming.requestIpl('prologue05b');
    mp.game.streaming.requestIpl('prologue06');
    mp.game.streaming.requestIpl('prologue06b');
    mp.game.streaming.requestIpl('prologue06_int');
    mp.game.streaming.requestIpl('prologue06_pannel');
    mp.game.streaming.requestIpl('plg_occl_00');
    mp.game.streaming.requestIpl('prologue_occl');
    mp.game.streaming.requestIpl('prologuerd');
    mp.game.streaming.requestIpl('prologuerdb');
};

methods.iplYanktonUnload = function () {
    mp.game.streaming.removeIpl('prologue01');
    mp.game.streaming.removeIpl('prologue01c');
    mp.game.streaming.removeIpl('prologue01d');
    mp.game.streaming.removeIpl('prologue01e');
    mp.game.streaming.removeIpl('prologue01f');
    mp.game.streaming.removeIpl('prologue01g');
    mp.game.streaming.removeIpl('prologue01h');
    mp.game.streaming.removeIpl('prologue01i');
    mp.game.streaming.removeIpl('prologue01j');
    mp.game.streaming.removeIpl('prologue01k');
    mp.game.streaming.removeIpl('prologue01z');
    mp.game.streaming.removeIpl('prologue02');
    mp.game.streaming.removeIpl('prologue03');
    mp.game.streaming.removeIpl('prologue03b');
    mp.game.streaming.removeIpl('prologue03_grv_dug');
    mp.game.streaming.removeIpl('prologue_grv_torch');
    mp.game.streaming.removeIpl('prologue04');
    mp.game.streaming.removeIpl('prologue04b');
    mp.game.streaming.removeIpl('prologue04_cover');
    mp.game.streaming.removeIpl('des_protree_end');
    mp.game.streaming.removeIpl('des_protree_start');
    mp.game.streaming.removeIpl('prologue05');
    mp.game.streaming.removeIpl('prologue05b');
    mp.game.streaming.removeIpl('prologue06');
    mp.game.streaming.removeIpl('prologue06b');
    mp.game.streaming.removeIpl('prologue06_int');
    mp.game.streaming.removeIpl('prologue06_pannel');
    mp.game.streaming.removeIpl('plg_occl_00');
    mp.game.streaming.removeIpl('prologue_occl');
    mp.game.streaming.removeIpl('prologuerd');
    mp.game.streaming.removeIpl('prologuerdb');
};

methods.iplIsland = function () {
    let islandList = [
        // mph4_terrain_instance_placement
        'h4_mph4_terrain_01_grass_0',
        'h4_mph4_terrain_01_grass_1',
        'h4_mph4_terrain_02_grass_0',
        'h4_mph4_terrain_02_grass_1',
        'h4_mph4_terrain_02_grass_2',
        'h4_mph4_terrain_02_grass_3',
        'h4_mph4_terrain_04_grass_0',
        'h4_mph4_terrain_04_grass_1',
        'h4_mph4_terrain_05_grass_0',
        'h4_mph4_terrain_06_grass_0',

// mph4_terrain_metadata
        'h4_islandx_terrain_01',
        'h4_islandx_terrain_01_lod',
        'h4_islandx_terrain_01_slod',
        'h4_islandx_terrain_02',
        'h4_islandx_terrain_02_lod',
        'h4_islandx_terrain_02_slod',
        'h4_islandx_terrain_03',
        'h4_islandx_terrain_03_lod',
        'h4_islandx_terrain_04',
        'h4_islandx_terrain_04_lod',
        'h4_islandx_terrain_04_slod',
        'h4_islandx_terrain_05',
        'h4_islandx_terrain_05_lod',
        'h4_islandx_terrain_05_slod',
        'h4_islandx_terrain_06',
        'h4_islandx_terrain_06_lod',
        'h4_islandx_terrain_06_slod',
        'h4_islandx_terrain_props_05_a',
        'h4_islandx_terrain_props_05_a_lod',
        'h4_islandx_terrain_props_05_b',
        'h4_islandx_terrain_props_05_b_lod',
        'h4_islandx_terrain_props_05_c',
        'h4_islandx_terrain_props_05_c_lod',
        'h4_islandx_terrain_props_05_d',
        'h4_islandx_terrain_props_05_d_lod',
        'h4_islandx_terrain_props_05_d_slod',
        'h4_islandx_terrain_props_05_e',
        'h4_islandx_terrain_props_05_e_lod',
        'h4_islandx_terrain_props_05_e_slod',
        'h4_islandx_terrain_props_05_f',
        'h4_islandx_terrain_props_05_f_lod',
        'h4_islandx_terrain_props_05_f_slod',
        'h4_islandx_terrain_props_06_a',
        'h4_islandx_terrain_props_06_a_lod',
        'h4_islandx_terrain_props_06_a_slod',
        'h4_islandx_terrain_props_06_b',
        'h4_islandx_terrain_props_06_b_lod',
        'h4_islandx_terrain_props_06_b_slod',
        'h4_islandx_terrain_props_06_c',
        'h4_islandx_terrain_props_06_c_lod',
        'h4_islandx_terrain_props_06_c_slod',
        'h4_mph4_terrain_01',
        'h4_mph4_terrain_01_long_0',
        'h4_mph4_terrain_02',
        'h4_mph4_terrain_03',
        'h4_mph4_terrain_04',
        'h4_mph4_terrain_05',
        'h4_mph4_terrain_06',
        'h4_mph4_terrain_06_strm_0',
        'h4_mph4_terrain_lod',

// mph4_terrain_occ
        'h4_mph4_terrain_occ_00',
        'h4_mph4_terrain_occ_01',
        'h4_mph4_terrain_occ_02',
        'h4_mph4_terrain_occ_03',
        'h4_mph4_terrain_occ_04',
        'h4_mph4_terrain_occ_05',
        'h4_mph4_terrain_occ_06',
        'h4_mph4_terrain_occ_07',
        'h4_mph4_terrain_occ_08',
        'h4_mph4_terrain_occ_09',

// mp'h4_island
        //'h4_boatblockers',
        'h4_islandx',
        'h4_islandx_disc_strandedshark',
        'h4_islandx_disc_strandedshark_lod',
        'h4_islandx_disc_strandedwhale',
        'h4_islandx_disc_strandedwhale_lod',
        'h4_islandx_props',
        'h4_islandx_props_lod',
        //'h4_islandx_sea_mines',
        'h4_mph4_island',
        'h4_mph4_island_long_0',
        'h4_mph4_island_strm_0',

// mp'h4_island_combine_metadata
        'h4_aa_guns',
        'h4_aa_guns_lod',
        'h4_beach',
        'h4_beach_bar_props',
        'h4_beach_lod',
        'h4_beach_party',
        'h4_beach_party_lod',
        'h4_beach_props',
        'h4_beach_props_lod',
        'h4_beach_props_party',
        'h4_beach_props_slod',
        'h4_beach_slod',
        'h4_islandairstrip',
        'h4_islandairstrip_doorsclosed',
        'h4_islandairstrip_doorsclosed_lod',
        'h4_islandairstrip_doorsopen',
        'h4_islandairstrip_doorsopen_lod',
        'h4_islandairstrip_hangar_props',
        'h4_islandairstrip_hangar_props_lod',
        'h4_islandairstrip_hangar_props_slod',
        'h4_islandairstrip_lod',
        'h4_islandairstrip_props',
        'h4_islandairstrip_propsb',
        'h4_islandairstrip_propsb_lod',
        'h4_islandairstrip_propsb_slod',
        'h4_islandairstrip_props_lod',
        'h4_islandairstrip_props_slod',
        'h4_islandairstrip_slod',
        'h4_islandxcanal_props',
        'h4_islandxcanal_props_lod',
        'h4_islandxcanal_props_slod',
        'h4_islandxdock',
        'h4_islandxdock_lod',
        'h4_islandxdock_props',
        'h4_islandxdock_props_2',
        'h4_islandxdock_props_2_lod',
        'h4_islandxdock_props_2_slod',
        'h4_islandxdock_props_lod',
        'h4_islandxdock_props_slod',
        'h4_islandxdock_slod',
        'h4_islandxdock_water_hatch',
        'h4_islandxtower',
        'h4_islandxtower_lod',
        'h4_islandxtower_slod',
        'h4_islandxtower_veg',
        'h4_islandxtower_veg_lod',
        'h4_islandxtower_veg_slod',
        'h4_islandx_barrack_hatch',
        'h4_islandx_barrack_props',
        'h4_islandx_barrack_props_lod',
        'h4_islandx_barrack_props_slod',
        'h4_islandx_checkpoint',
        'h4_islandx_checkpoint_lod',
        'h4_islandx_checkpoint_props',
        'h4_islandx_checkpoint_props_lod',
        'h4_islandx_checkpoint_props_slod',
        'h4_islandx_maindock',
        'h4_islandx_maindock_lod',
        'h4_islandx_maindock_props',
        'h4_islandx_maindock_props_2',
        'h4_islandx_maindock_props_2_lod',
        'h4_islandx_maindock_props_2_slod',
        'h4_islandx_maindock_props_lod',
        'h4_islandx_maindock_props_slod',
        'h4_islandx_maindock_slod',
        'h4_islandx_mansion',
        'h4_islandx_mansion_b',
        'h4_islandx_mansion_b_lod',
        'h4_islandx_mansion_b_side_fence',
        'h4_islandx_mansion_b_slod',
        'h4_islandx_mansion_entrance_fence',
        'h4_islandx_mansion_guardfence',
        'h4_islandx_mansion_lights',
        'h4_islandx_mansion_lockup_01',
        'h4_islandx_mansion_lockup_01_lod',
        'h4_islandx_mansion_lockup_02',
        'h4_islandx_mansion_lockup_02_lod',
        'h4_islandx_mansion_lockup_03',
        'h4_islandx_mansion_lockup_03_lod',
        'h4_islandx_mansion_lod',
        'h4_islandx_mansion_office',
        'h4_islandx_mansion_office_lod',
        'h4_islandx_mansion_props',
        'h4_islandx_mansion_props_lod',
        'h4_islandx_mansion_props_slod',
        'h4_islandx_mansion_slod',
        'h4_islandx_mansion_vault',
        'h4_islandx_mansion_vault_lod',
        'h4_island_padlock_props',
        //'h4_mansion_gate_broken',
        //'h4_mansion_gate_closed',
        'h4_mansion_remains_cage',
        'h4_mph4_airstrip',
        'h4_mph4_airstrip_interior_0_airstrip_hanger',
        'h4_mph4_beach',
        'h4_mph4_dock',
        'h4_mph4_island_lod',
        'h4_mph4_island_ne_placement',
        'h4_mph4_island_nw_placement',
        'h4_mph4_island_se_placement',
        'h4_mph4_island_sw_placement',
        'h4_mph4_mansion',
        'h4_mph4_mansion_b',
        'h4_mph4_mansion_b_strm_0',
        'h4_mph4_mansion_strm_0',
        'h4_mph4_wtowers',
        'h4_ne_ipl_00',
        'h4_ne_ipl_00_lod',
        'h4_ne_ipl_00_slod',
        'h4_ne_ipl_01',
        'h4_ne_ipl_01_lod',
        'h4_ne_ipl_01_slod',
        'h4_ne_ipl_02',
        'h4_ne_ipl_02_lod',
        'h4_ne_ipl_02_slod',
        'h4_ne_ipl_03',
        'h4_ne_ipl_03_lod',
        'h4_ne_ipl_03_slod',
        'h4_ne_ipl_04',
        'h4_ne_ipl_04_lod',
        'h4_ne_ipl_04_slod',
        'h4_ne_ipl_05',
        'h4_ne_ipl_05_lod',
        'h4_ne_ipl_05_slod',
        'h4_ne_ipl_06',
        'h4_ne_ipl_06_lod',
        'h4_ne_ipl_06_slod',
        'h4_ne_ipl_07',
        'h4_ne_ipl_07_lod',
        'h4_ne_ipl_07_slod',
        'h4_ne_ipl_08',
        'h4_ne_ipl_08_lod',
        'h4_ne_ipl_08_slod',
        'h4_ne_ipl_09',
        'h4_ne_ipl_09_lod',
        'h4_ne_ipl_09_slod',
        'h4_nw_ipl_00',
        'h4_nw_ipl_00_lod',
        'h4_nw_ipl_00_slod',
        'h4_nw_ipl_01',
        'h4_nw_ipl_01_lod',
        'h4_nw_ipl_01_slod',
        'h4_nw_ipl_02',
        'h4_nw_ipl_02_lod',
        'h4_nw_ipl_02_slod',
        'h4_nw_ipl_03',
        'h4_nw_ipl_03_lod',
        'h4_nw_ipl_03_slod',
        'h4_nw_ipl_04',
        'h4_nw_ipl_04_lod',
        'h4_nw_ipl_04_slod',
        'h4_nw_ipl_05',
        'h4_nw_ipl_05_lod',
        'h4_nw_ipl_05_slod',
        'h4_nw_ipl_06',
        'h4_nw_ipl_06_lod',
        'h4_nw_ipl_06_slod',
        'h4_nw_ipl_07',
        'h4_nw_ipl_07_lod',
        'h4_nw_ipl_07_slod',
        'h4_nw_ipl_08',
        'h4_nw_ipl_08_lod',
        'h4_nw_ipl_08_slod',
        'h4_nw_ipl_09',
        'h4_nw_ipl_09_lod',
        'h4_nw_ipl_09_slod',
        'h4_se_ipl_00',
        'h4_se_ipl_00_lod',
        'h4_se_ipl_00_slod',
        'h4_se_ipl_01',
        'h4_se_ipl_01_lod',
        'h4_se_ipl_01_slod',
        'h4_se_ipl_02',
        'h4_se_ipl_02_lod',
        'h4_se_ipl_02_slod',
        'h4_se_ipl_03',
        'h4_se_ipl_03_lod',
        'h4_se_ipl_03_slod',
        'h4_se_ipl_04',
        'h4_se_ipl_04_lod',
        'h4_se_ipl_04_slod',
        'h4_se_ipl_05',
        'h4_se_ipl_05_lod',
        'h4_se_ipl_05_slod',
        'h4_se_ipl_06',
        'h4_se_ipl_06_lod',
        'h4_se_ipl_06_slod',
        'h4_se_ipl_07',
        'h4_se_ipl_07_lod',
        'h4_se_ipl_07_slod',
        'h4_se_ipl_08',
        'h4_se_ipl_08_lod',
        'h4_se_ipl_08_slod',
        'h4_se_ipl_09',
        'h4_se_ipl_09_lod',
        'h4_se_ipl_09_slod',
        'h4_sw_ipl_00',
        'h4_sw_ipl_00_lod',
        'h4_sw_ipl_00_slod',
        'h4_sw_ipl_01',
        'h4_sw_ipl_01_lod',
        'h4_sw_ipl_01_slod',
        'h4_sw_ipl_02',
        'h4_sw_ipl_02_lod',
        'h4_sw_ipl_02_slod',
        'h4_sw_ipl_03',
        'h4_sw_ipl_03_lod',
        'h4_sw_ipl_03_slod',
        'h4_sw_ipl_04',
        'h4_sw_ipl_04_lod',
        'h4_sw_ipl_04_slod',
        'h4_sw_ipl_05',
        'h4_sw_ipl_05_lod',
        'h4_sw_ipl_05_slod',
        'h4_sw_ipl_06',
        'h4_sw_ipl_06_lod',
        'h4_sw_ipl_06_slod',
        'h4_sw_ipl_07',
        'h4_sw_ipl_07_lod',
        'h4_sw_ipl_07_slod',
        'h4_sw_ipl_08',
        'h4_sw_ipl_08_lod',
        'h4_sw_ipl_08_slod',
        'h4_sw_ipl_09',
        'h4_sw_ipl_09_lod',
        'h4_sw_ipl_09_slod',
        //'h4_underwater_gate_closed',

// mp'h4_island_placement
        'h4_islandx_placement_01',
        'h4_islandx_placement_02',
        'h4_islandx_placement_03',
        'h4_islandx_placement_04',
        'h4_islandx_placement_05',
        'h4_islandx_placement_06',
        'h4_islandx_placement_07',
        'h4_islandx_placement_08',
        'h4_islandx_placement_09',
        'h4_islandx_placement_10',
        'h4_mph4_island_placement',
    ];

    islandList.forEach(item =>{
        mp.game.streaming.requestIpl(item);

    })
};

methods.iplArenaModDefaultRefresh = function () {
    let interiorId = mp.game.interior.getInteriorAtCoords(205.000, 5180.000, -90.000);
    mp.game.interior.refreshInterior(interiorId);
};

methods.iplGangDefault = function () {
    let interiorId = mp.game.interior.getInteriorAtCoords(2730.000, -380.000, -49.000);
    let garageId = mp.game.interior.getInteriorAtCoords(2701.593505859375, -360.7911376953125, -56.186683654785156);

    methods.setIplPropState(interiorId, "Entity_set_arcade_set_ceiling_beams");
    methods.setIplPropState(interiorId, "Entity_set_big_screen");
    methods.setIplPropState(interiorId, "Entity_set_constant_geometry");
    methods.setIplPropState(interiorId, "Entity_set_mural_neon_option_05");
    mp.game.interior.refreshInterior(interiorId);

    methods.setIplPropState(garageId, "Set_Plan_Electric_Drill");
    methods.setIplPropState(garageId, "set_plan_bed");
    methods.setIplPropState(garageId, "set_plan_garage");
    methods.setIplPropState(garageId, "set_plan_mechanic");
    methods.setIplPropState(garageId, "set_plan_setup");
    mp.game.interior.refreshInterior(garageId);
};

methods.iplSimonDefault = function () {
    let interiorId = mp.game.interior.getInteriorAtCoords(-46.84232, -1096.113, 26.06662);
    mp.game.streaming.requestIpl("shr_int");
    methods.setIplPropState(interiorId, "csr_beforeMission");
    methods.setIplPropState(interiorId, "shutter_open");
    mp.game.interior.refreshInterior(interiorId);
};

methods.iplFranklinAuntDefault = function () {
    let interiorId = mp.game.interior.getInteriorAtCoords(-12.29968, -1436.287, 30.46845);
    methods.setIplPropState(interiorId, "");
    methods.setIplPropState(interiorId, "V_57_FranklinStuff", true);
    methods.setIplPropState(interiorId, "V_57_GangBandana", false);
    methods.setIplPropState(interiorId, "V_57_Safari", false);
    mp.game.interior.refreshInterior(interiorId);
};

methods.iplFranklinDefault = function () {
    let interiorId = mp.game.interior.getInteriorAtCoords(-5.178349, 527.028, 174.0297);
    methods.setIplPropState(interiorId, "");
    methods.setIplPropState(interiorId, "locked");
    methods.setIplPropState(interiorId, "bong_and_wine");
    methods.setIplPropState(interiorId, "franklin_unpacking");
    methods.setIplPropState(interiorId, "franklin_settled");
    methods.setIplPropState(interiorId, "progress_flyer", false);
    methods.setIplPropState(interiorId, "progress_tux", false);
    methods.setIplPropState(interiorId, "progress_tshirt", false);
    methods.setIplPropState(interiorId, "bong_and_wine", true);
    mp.game.interior.refreshInterior(interiorId);
};

methods.iplFloydDefault = function () {
    let interiorId = mp.game.interior.getInteriorAtCoords(-1152.682, -1519.319, 11.03756);
    methods.setIplPropState(interiorId, "swap_clean_apt");
    methods.setIplPropState(interiorId, "swap_mrJam_A");
    methods.setIplPropState(interiorId, "swap_sofa_A");
    mp.game.interior.refreshInterior(interiorId);
};

methods.iplLabMethDefault = function () {
    let interiorId = 247041;
    //methods.setIplPropState(interiorId, "meth_lab_basic");
    //methods.setIplPropState(interiorId, "meth_lab_upgrade");
    methods.setIplPropState(interiorId, "meth_lab_production");
    methods.setIplPropState(interiorId, "meth_lab_security_high");
    methods.setIplPropState(interiorId, "meth_lab_setup");
    mp.game.interior.refreshInterior(interiorId);
};

methods.iplLabCocaDefault = function (state) {
    let interiorId = 247553;
    methods.setIplPropState(interiorId, "set_up");
    methods.setIplPropState(interiorId, "security_high");
    //methods.setIplPropState(interiorId, "equipment_basic");
    methods.setIplPropState(interiorId, "equipment_upgrade");
    methods.setIplPropState(interiorId, "production_basic");
    methods.setIplPropState(interiorId, "coke_press_basic");

    for (let i = 1; i <= state; i++)
        methods.setIplPropState(interiorId, "coke_cut_0" + i);

    /*methods.setIplPropState(interiorId, "coke_cut_01");
    methods.setIplPropState(interiorId, "coke_cut_02");*/
    mp.game.interior.refreshInterior(interiorId);
};

methods.iplBunkerDefault = function () {
    let interiorId = 258561;
    methods.setIplPropState(interiorId, "bunker_style_a");
    methods.setIplPropState(interiorId, "upgrade_bunker_set");
    methods.setIplPropState(interiorId, "security_upgrade");
    methods.setIplPropState(interiorId, "office_upgrade_set");
    methods.setIplPropState(interiorId, "gun_locker_upgrade");
    methods.setIplPropState(interiorId, "gun_range_lights");
    methods.setIplPropState(interiorId, "Gun_schematic_set");
    mp.game.interior.refreshInterior(interiorId);
};

methods.iplTrevorDefault = function () {
    let interiorId = 2562;
    mp.game.streaming.requestIpl("trevorstrailertidy");
    methods.setIplPropState(interiorId, "V_26_Trevor_Helmet3", false);
    methods.setIplPropState(interiorId, "V_24_Trevor_Briefcase3", false);
    methods.setIplPropState(interiorId, "V_26_Michael_Stay3", false);
    mp.game.interior.refreshInterior(interiorId);
};

methods.iplTrevorDefault = function () {
    let interiorId = 2562;
    mp.game.streaming.requestIpl("trevorstrailertidy");
    methods.setIplPropState(interiorId, "V_26_Trevor_Helmet3", false);
    methods.setIplPropState(interiorId, "V_24_Trevor_Briefcase3", false);
    methods.setIplPropState(interiorId, "V_26_Michael_Stay3", false);
    mp.game.interior.refreshInterior(interiorId);
};

methods.iplVecpPdDefault = function () {
    /*DEFAULT*/
    //mp.game.invoke('0x0888C3502DBBEEF5');
    //mp.game.gameplay.enableMpDlcMaps(true);

    /*mp.game.streaming.removeIpl("int_vesp_01_1_milo_");
    mp.game.streaming.requestIpl("vesp_ipl_01_1");
    mp.game.streaming.requestIpl("vesp_lod_01_1");

    mp.game.streaming.removeIpl("int_vesp_01_2_milo_");
    mp.game.streaming.requestIpl("vesp_ipl_01_2");

    mp.game.streaming.removeIpl("int_vesp_02_1_milo_");
    mp.game.streaming.requestIpl("vesp_ipl_02_1");

    mp.game.streaming.removeIpl("int_vesp_02_2_milo_");
    mp.game.streaming.requestIpl("vesp_ipl_02_2");

    mp.game.streaming.removeIpl("int_vesp_03_1_milo_");
    mp.game.streaming.requestIpl("vesp_ipl_03_1");
    mp.game.streaming.requestIpl("vesp_lod_03_1");

    mp.game.streaming.removeIpl("int_vesp_2_1_milo_");
    mp.game.streaming.requestIpl("vesp_ipl_2_1");
    mp.game.streaming.requestIpl("vesp_lod_2_1");

    mp.game.streaming.removeIpl("int_vesp_3_1_milo_");
    mp.game.streaming.requestIpl("vesp_ipl_3_1");
    mp.game.streaming.requestIpl("vesp_lod_3_1");

    mp.game.streaming.removeIpl("int_vesp_3_2_milo_");
    mp.game.streaming.requestIpl("vesp_ipl_3_2");
    mp.game.streaming.requestIpl("vesp_lod_3_2");

    mp.game.streaming.removeIpl("int_vesp_4_2_milo_");
    mp.game.streaming.requestIpl("vesp_ipl_4_2");
    mp.game.streaming.requestIpl("vesp_lod_4_2");

    mp.game.streaming.removeIpl("int_vesp_5_2_milo_");
    mp.game.streaming.requestIpl("vesp_ipl_5_2");
    mp.game.streaming.requestIpl("vesp_lod_5_2");*/

    mp.game.streaming.requestIpl("int_vesp_1_1_milo_");
    mp.game.streaming.requestIpl("int_vesp_1_2_milo_");
    mp.game.streaming.requestIpl("int_vesp_big_lift_milo_");
    mp.game.streaming.requestIpl("int_vesp_big_stair_milo_");
    mp.game.streaming.requestIpl("int_vesp_slift_milo_");
    mp.game.streaming.requestIpl("int_vesp_smole_stair_milo_");

    /*vesp01_1*/
    mp.game.streaming.requestIpl("int_vesp_01_1_milo_");
    mp.game.streaming.removeIpl("vesp_ipl_01_1");
    mp.game.streaming.removeIpl("vesp_lod_01_1");

    /*vesp01_2*/
    mp.game.streaming.removeIpl("int_vesp_01_2_milo_");
    mp.game.streaming.requestIpl("vesp_ipl_01_2");
    mp.game.streaming.requestIpl("vesp_lod_01_2");

    /*vesp02_1*/
    mp.game.streaming.requestIpl("int_vesp_02_1_milo_");
    mp.game.streaming.removeIpl("vesp_ipl_02_1");
    mp.game.streaming.removeIpl("vesp_lod_02_1");

    /*vesp02_2*/
    mp.game.streaming.removeIpl("int_vesp_02_2_milo_");
    mp.game.streaming.requestIpl("vesp_ipl_02_2");
    mp.game.streaming.requestIpl("vesp_lod_02_2");

    /*vesp03_1*/
    mp.game.streaming.requestIpl("int_vesp_03_1_milo_");
    mp.game.streaming.removeIpl("vesp_ipl_03_1");
    mp.game.streaming.removeIpl("vesp_lod_03_1");

    /*vesp2_1*/
    mp.game.streaming.removeIpl("int_vesp_2_1_milo_");
    mp.game.streaming.requestIpl("vesp_ipl_2_1");
    mp.game.streaming.requestIpl("vesp_lod_2_1");

    /*vesp3_1*/
    mp.game.streaming.removeIpl("int_vesp_3_1_milo_");
    mp.game.streaming.requestIpl("vesp_ipl_3_1");
    mp.game.streaming.requestIpl("vesp_lod_3_1");

    /*vesp3_2*/
    mp.game.streaming.removeIpl("int_vesp_3_2_milo_");
    mp.game.streaming.requestIpl("vesp_ipl_3_2");
    mp.game.streaming.requestIpl("vesp_lod_3_2");

    /*vesp4_2*/
    mp.game.streaming.removeIpl("int_vesp_4_2_milo_");
    mp.game.streaming.requestIpl("vesp_ipl_4_2");
    mp.game.streaming.requestIpl("vesp_lod_4_2");

    /*vesp5_2*/
    mp.game.streaming.removeIpl("int_vesp_5_2_milo_");
    mp.game.streaming.requestIpl("vesp_ipl_5_2");
    mp.game.streaming.requestIpl("vesp_lod_5_2");

    //let vesp2_1ipl = mp.game.interior.getInteriorAtCoordsWithType(-1096.445, -831.962, 23.033,"int_vesp_1_2");
    //let vesp3_1ipl = mp.game.interior.getInteriorAtCoordsWithType(-1091.963, -831.206, 26.827,"int_vesp_3_2");
    let vesp02_2ipl = mp.game.interior.getInteriorAtCoordsWithType(-1095.002, -838.586, 10.276,"int_vesp_02_1");
    //let vesp02_1ipl = mp.game.interior.getInteriorAtCoordsWithType(-1095.002, -838.586, 10.276,"int_vesp_02_2");
    let vesp01_2ipl = mp.game.interior.getInteriorAtCoordsWithType(-1088.377, -832.352, 5.479,"int_vesp_01_1");
    //let vesp01_1ipl = mp.game.interior.getInteriorAtCoordsWithType(-1097.205, -839.141, 4.878,"int_vesp_01_2");
    /*methods.setIplPropState(vesp2_1ipl, "vesp1_2");
    mp.game.interior.refreshInterior(vesp2_1ipl);*/
   /* methods.setIplPropState(vesp3_1ipl, "vesp3_2");
    mp.game.interior.refreshInterior(vesp3_1ipl);*/
    methods.setIplPropState(vesp02_2ipl, "vesp02_1");
    mp.game.interior.refreshInterior(vesp02_2ipl);
    /*methods.setIplPropState(vesp02_1ipl, "vesp02_2");
    mp.game.interior.refreshInterior(vesp02_1ipl);*/
    methods.setIplPropState(vesp01_2ipl, "vesp01_1");
    mp.game.interior.refreshInterior(vesp01_2ipl);
    /*methods.setIplPropState(vesp01_1ipl, "vesp01_2");
    mp.game.interior.refreshInterior(vesp01_1ipl);*/
};

methods.iplAmmoDefault = function () {

    let ammunationsId = [
        140289,			//249.8, -47.1, 70.0
        153857,			//844.0, -1031.5, 28.2
        168193, 		//-664.0, -939.2, 21.8
        164609,			//-1308.7, -391.5, 36.7
        176385,			//-3170.0, 1085.0, 20.8
        175617,			//-1116.0, 2694.1, 18.6
        200961,			//1695.2, 3756.0, 34.7
        180481,			//-328.7, 6079.0, 31.5
        178689			//2569.8, 297.8, 108.7
    ];
    let gunclubsId = [
        137729,			//19.1, -1110.0, 29.8
        248065			//811.0, -2152.0, 29.6
    ];

    ammunationsId.forEach( interiorId => {
        methods.setIplPropState(interiorId, "GunStoreHooks");
        methods.setIplPropState(interiorId, "GunClubWallHooks");
        mp.game.interior.refreshInterior(interiorId);
    });

    gunclubsId.forEach( interiorId => {
        methods.setIplPropState(interiorId, "GunStoreHooks");
        methods.setIplPropState(interiorId, "GunClubWallHooks");
        mp.game.interior.refreshInterior(interiorId);
    });
};

methods.iplLesterFactoryDefault = function () {
    let interiorId = 92674;
    methods.setIplPropState(interiorId, "V_53_Agency_Blueprint", false);
    methods.setIplPropState(interiorId, "V_35_KitBag", false);
    methods.setIplPropState(interiorId, "V_35_Fireman", false);
    methods.setIplPropState(interiorId, "V_35_Body_Armour", false);
    methods.setIplPropState(interiorId, "Jewel_Gasmasks", false);
    methods.setIplPropState(interiorId, "v_53_agency_overalls", false);
    mp.game.interior.refreshInterior(interiorId);
};

methods.iplStripClubDefault = function () {
    let interiorId = 197121;
    methods.setIplPropState(interiorId, "V_19_Trevor_Mess", false);
    mp.game.interior.refreshInterior(interiorId);
};

methods.requestIpls = function () {
    //mp.game.streaming.requestIpl("RC12B_HospitalInterior");

    methods.iplGangDefault();
    methods.iplArenaModDefault();

    //Michael: -802.311, 175.056, 72.8446
    methods.iplMichaelDefault();
    //Simeon: -47.16170 -1115.3327 26.5
    methods.iplSimonDefault();
    //Franklin's aunt: -9.96562, -1438.54, 31.1015
    methods.iplFranklinAuntDefault();
    //Franklin
    methods.iplFranklinDefault();
    //Floyd: -1150.703, -1520.713, 10.633
    methods.iplFloydDefault();
    //Trevor: 1985.48132, 3828.76757, 32.5
    methods.iplTrevorDefault();
    methods.iplAmmoDefault();
    methods.iplLesterFactoryDefault();
    methods.iplStripClubDefault();

    methods.iplLabCocaDefault();
    methods.iplBunkerDefault();

    try {
        methods.iplVecpPdDefault();
    }
    catch (e) {}
    try {
        methods.iplIsland();
    }
    catch (e) {}
    //CASINO
    mp.game.streaming.requestIpl("vw_casino_main");

    let cIntID = mp.game.interior.getInteriorAtCoords(1100.000, 220.000, -50.0);
    mp.game.interior.enableInteriorProp(cIntID, 'casino_manager_﻿default﻿﻿﻿');
    mp.game.invoke(methods.SET_INTERIOR_PROP_COLOR, cIntID, 'casino_manager_﻿default﻿﻿﻿', 1);
    mp.game.interior.refreshInterior(cIntID);

    mp.game.streaming.requestIpl("hei_dlc_windows_casino");
    mp.game.streaming.requestIpl("hei_dlc_casino_aircon");
    mp.game.streaming.requestIpl("vw_dlc_casino_door");
    mp.game.streaming.requestIpl("hei_dlc_casino_door");
    mp.game.streaming.requestIpl("hei_dlc_windows_casino﻿");
    mp.game.streaming.requestIpl("vw_casino_penthouse");
    mp.game.streaming.requestIpl("vw_casino_garage");
    mp.game.streaming.requestIpl("vw_casino_carpark");

    let phIntID = mp.game.interior.getInteriorAtCoords(976.636, 70.295, 115.164);
    let phPropList = [
        "Set_Pent_Tint_Shell",
        "Set_Pent_Pattern_01",
        "Set_Pent_Spa_Bar_Open",
        "Set_Pent_Media_Bar_Open",
        "Set_Pent_Dealer",
        "Set_Pent_Arcade_Retro",
        "Set_Pent_Bar_Clutter",
        "Set_Pent_Clutter_01",
        "set_pent_bar_light_01",
        "set_pent_bar_party_0"
    ];

    for (const propName of phPropList) {
        mp.game.interior.enableInteriorProp(phIntID, propName);
        mp.game.invoke(methods.SET_INTERIOR_PROP_COLOR, phIntID, propName, 1);
    }
    mp.game.interior.refreshInterior(phIntID);

    mp.game.streaming.requestIpl("imp_dt1_02_modgarage");

    //Heist Jewel: -637.20159 -239.16250 38.1
    mp.game.streaming.requestIpl("post_hiest_unload");

    //Max Renda: -585.8247, -282.72, 35.45475  Работу можно намутить
    mp.game.streaming.requestIpl("refit_unload");

    //Heist Union Depository: 2.69689322, -667.0166, 16.1306286
    mp.game.streaming.requestIpl("FINBANK");

    //Morgue: 239.75195, -1360.64965, 39.53437
    mp.game.streaming.requestIpl("Coroner_Int_on");

    //1861.28, 2402.11, 58.53
    mp.game.streaming.requestIpl("ch3_rd2_bishopschickengraffiti");
    //2697.32, 3162.18, 58.1
    mp.game.streaming.requestIpl("cs5_04_mazebillboardgraffiti");
    //2119.12, 3058.21, 53.25
    mp.game.streaming.requestIpl("cs5_roads_ronoilgraffiti");

    //Cluckin Bell: -146.3837, 6161.5, 30.2062
    mp.game.streaming.requestIpl("CS1_02_cf_onmission1");
    mp.game.streaming.requestIpl("CS1_02_cf_onmission2");
    mp.game.streaming.requestIpl("CS1_02_cf_onmission3");
    mp.game.streaming.requestIpl("CS1_02_cf_onmission4");

    //Grapeseed's farm: 2447.9, 4973.4, 47.7
    mp.game.streaming.requestIpl("farm");
    mp.game.streaming.requestIpl("farmint");
    mp.game.streaming.requestIpl("farm_lod");
    mp.game.streaming.requestIpl("farm_props");
    mp.game.streaming.requestIpl("des_farmhouse");

    //FIB lobby: 105.4557, -745.4835, 44.7548
    mp.game.streaming.requestIpl("FIBlobby");
    mp.game.streaming.requestIpl("dt1_05_fib2_normal");

    mp.game.streaming.removeIpl("hei_bi_hw1_13_door");
    mp.game.streaming.requestIpl("hei_hw1_blimp_interior_v_comedy_milo_");
    mp.game.streaming.requestIpl("apa_ss1_11_interior_v_rockclub_milo_");
    mp.game.streaming.requestIpl("ferris_finale_Anim");
    mp.game.streaming.requestIpl("gr_case6_bunkerclosed");

    //Billboard: iFruit
    mp.game.streaming.requestIpl("FruitBB");
    mp.game.streaming.requestIpl("sc1_01_newbill");
    mp.game.streaming.requestIpl("hw1_02_newbill");
    mp.game.streaming.requestIpl("hw1_emissive_newbill");
    mp.game.streaming.requestIpl("sc1_14_newbill");
    mp.game.streaming.requestIpl("dt1_17_newbill");

    //Lester's factory: 716.84, -962.05, 31.59
    mp.game.streaming.requestIpl("id2_14_during_door");
    mp.game.streaming.requestIpl("id2_14_during1");

    //Life Invader lobby: -1047.9, -233.0, 39.0
    mp.game.streaming.requestIpl("facelobby");

    //Авианосец
    mp.game.streaming.requestIpl("hei_carrier");
    mp.game.streaming.requestIpl("hei_carrier_distantlights");
    mp.game.streaming.requestIpl("hei_carrier_int1");
    mp.game.streaming.requestIpl("hei_carrier_int1_lod");
    mp.game.streaming.requestIpl("hei_carrier_int2");
    mp.game.streaming.requestIpl("hei_carrier_int2_lod");
    mp.game.streaming.requestIpl("hei_carrier_int3");
    mp.game.streaming.requestIpl("hei_carrier_int3_lod");
    mp.game.streaming.requestIpl("hei_carrier_int4");
    mp.game.streaming.requestIpl("hei_carrier_int4_lod");
    mp.game.streaming.requestIpl("hei_carrier_int5");
    mp.game.streaming.requestIpl("hei_carrier_int5_lod");
    mp.game.streaming.requestIpl("hei_carrier_int6");
    mp.game.streaming.requestIpl("hei_carrier_lod");
    mp.game.streaming.requestIpl("hei_carrier_lodlights");
    mp.game.streaming.requestIpl("hei_carrier_slod");

    //Яхта
    mp.game.streaming.requestIpl("hei_yacht_heist");
    mp.game.streaming.requestIpl("hei_yacht_heist_enginrm");
    mp.game.streaming.requestIpl("hei_yacht_heist_Lounge");
    mp.game.streaming.requestIpl("hei_yacht_heist_Bridge");
    mp.game.streaming.requestIpl("hei_yacht_heist_Bar");
    mp.game.streaming.requestIpl("hei_yacht_heist_Bedrm");
    mp.game.streaming.requestIpl("hei_yacht_heist_DistantLights");
    mp.game.streaming.requestIpl("hei_yacht_heist_LODLights");

    //Яхта2
    mp.game.streaming.requestIpl("gr_heist_yacht2");
    mp.game.streaming.requestIpl("gr_heist_yacht2_bar");
    mp.game.streaming.requestIpl("gr_heist_yacht2_bedrm");
    mp.game.streaming.requestIpl("gr_heist_yacht2_bridge");
    mp.game.streaming.requestIpl("gr_heist_yacht2_enginrm");
    mp.game.streaming.requestIpl("gr_heist_yacht2_lounge");
    mp.game.streaming.requestIpl("gr_grdlc_interior_placement_interior_0_grdlc_int_01_milo_");

    /*//Яхта3
    mp.game.streaming.requestIpl("sum_lost_yacht");
    mp.game.streaming.requestIpl("sum_lost_yacht_lod");
    mp.game.streaming.requestIpl("sum_lost_yacht_int");

    phIntID = mp.game.interior.getInteriorAtCoords(3638.799, -4780.567, 5.500);
    phPropList = [
        "apart_hi_booze_a",
    ];

    for (const propName of phPropList) {
        mp.game.interior.enableInteriorProp(phIntID, propName);
        mp.game.invoke(methods.SET_INTERIOR_PROP_COLOR, phIntID, propName, 1);
    }
    mp.game.interior.refreshInterior(phIntID);

    mp.game.interior.enableInteriorProp(279041, 'sum_mp_apa_yacht');
    mp.game.invoke('0xC1F1920BAF281317', 279041, 'sum_mp_apa_yacht', 1);
    mp.game.interior.refreshInterior(279041);*/

    //0xC1F1920BAF281317

    //Tunnels
    mp.game.streaming.requestIpl("v_tunnel_hole");

    //Carwash: 55.7, -1391.3, 30.5
    mp.game.streaming.requestIpl("Carwash_with_spinners");

    //Stadium "Fame or Shame": -248.49159240722656, -2010.509033203125, 34.57429885864258
    mp.game.streaming.requestIpl("sp1_10_real_interior");
    mp.game.streaming.requestIpl("sp1_10_real_interior_lod");

    //House in Banham Canyon: -3086.428, 339.2523, 6.3717
    mp.game.streaming.requestIpl("ch1_02_open");

    //Garage in La Mesa (autoshop): 970.27453, -1826.56982, 31.11477
    mp.game.streaming.requestIpl("bkr_bi_id1_23_door");

    //Hill Valley church - Grave: -282.46380000, 2835.84500000, 55.91446000
    mp.game.streaming.requestIpl("lr_cs6_08_grave_closed");

    //Lost's trailer park: 49.49379000, 3744.47200000, 46.38629000
    mp.game.streaming.requestIpl("methtrailer_grp1");

    //Lost safehouse: 984.1552, -95.3662, 74.50
    mp.game.streaming.requestIpl("bkr_bi_hw1_13_int");

    //Raton Canyon river: -1652.83, 4445.28, 2.52
    mp.game.streaming.requestIpl("CanyonRvrShallow");

    //Zancudo Gates (GTAO like): -1600.30100000, 2806.73100000, 18.79683000
    mp.game.streaming.removeIpl("CS3_07_MPGates");

    //Pillbox hospital:
    try {
        mp.game.streaming.removeIpl("rc12b_default");
        mp.game.streaming.requestIpl("gabz_pillbox_milo_");
        let hospIntId = mp.game.interior.getInteriorAtCoords(311.2546, -592.4204, 42.32737);
        let hospPropList = [
            "rc12b_fixed",
            "rc12b_destroyed",
            "rc12b_default",
            "rc12b_hospitalinterior_lod",
            "rc12b_hospitalinterior"
        ];

        for (const propName of hospPropList) {
            mp.game.interior.enableInteriorProp(hospIntId, propName);
            mp.game.invoke(methods.SET_INTERIOR_PROP_COLOR, hospIntId, propName, 1);
        }
        mp.game.interior.refreshInterior(hospIntId);
    }
    catch (e) {
        methods.debug(e);
    }

    //mp.game.streaming.removeIpl("rc12b_default");
    //mp.game.streaming.requestIpl("rc12b_hospitalinterior");


    //Josh's house: -1117.1632080078, 303.090698, 66.52217
    mp.game.streaming.requestIpl("bh1_47_joshhse_unburnt");
    mp.game.streaming.requestIpl("bh1_47_joshhse_unburnt_lod");

    mp.game.streaming.removeIpl("sunkcargoship");
    mp.game.streaming.requestIpl("cargoship");

    mp.game.streaming.requestIpl("ex_sm_13_office_02c"); //Лом Банк
    mp.game.streaming.requestIpl("ex_dt1_02_office_02b"); // Бизнес Центр
    mp.game.streaming.requestIpl("ex_dt1_11_office_03a"); //Maze Bank Office
    mp.game.streaming.requestIpl("ex_sm_15_office_03b"); //Meria

    //Bahama Mamas: -1388.0013, -618.41967, 30.819599
    mp.game.streaming.requestIpl("hei_sm_16_interior_v_bahama_milo_");

    mp.game.streaming.requestIpl("apa_v_mp_h_01_a");
    mp.game.streaming.requestIpl("apa_v_mp_h_02_b");
    mp.game.streaming.requestIpl("apa_v_mp_h_08_c");

    mp.game.streaming.requestIpl("hei_hw1_blimp_interior_v_studio_lo_milo_");
    mp.game.streaming.requestIpl("hei_hw1_blimp_interior_v_apart_midspaz_milo_");
    mp.game.streaming.requestIpl("hei_hw1_blimp_interior_32_dlc_apart_high2_new_milo_");
    mp.game.streaming.requestIpl("hei_hw1_blimp_interior_10_dlc_apart_high_new_milo_");
    mp.game.streaming.requestIpl("hei_hw1_blimp_interior_28_dlc_apart_high2_new_milo_");
    mp.game.streaming.requestIpl("hei_hw1_blimp_interior_27_dlc_apart_high_new_milo_");
    mp.game.streaming.requestIpl("hei_hw1_blimp_interior_29_dlc_apart_high2_new_milo_");
    mp.game.streaming.requestIpl("hei_hw1_blimp_interior_30_dlc_apart_high2_new_milo_");
    mp.game.streaming.requestIpl("hei_hw1_blimp_interior_31_dlc_apart_high2_new_milo_");
    mp.game.streaming.requestIpl("apa_ch2_05e_interior_0_v_mp_stilts_b_milo_");
    mp.game.streaming.requestIpl("apa_ch2_04_interior_0_v_mp_stilts_b_milo_");
    mp.game.streaming.requestIpl("apa_ch2_04_interior_1_v_mp_stilts_a_milo_");
    mp.game.streaming.requestIpl("apa_ch2_09c_interior_2_v_mp_stilts_b_milo_");
    mp.game.streaming.requestIpl("apa_ch2_09b_interior_1_v_mp_stilts_b_milo_");
    mp.game.streaming.requestIpl("apa_ch2_09b_interior_0_v_mp_stilts_a_milo_");
    mp.game.streaming.requestIpl("apa_ch2_05c_interior_1_v_mp_stilts_a_milo_");
    mp.game.streaming.requestIpl("apa_ch2_12b_interior_0_v_mp_stilts_a_milo_");

    //Galaxy
    //mp.game.interior.enableInteriorProp(271617, "Int01_ba_clubname_01");
    mp.game.interior.enableInteriorProp(271617, "Int01_ba_Style02");
    mp.game.interior.enableInteriorProp(271617, "Int01_ba_style02_podium");
    mp.game.interior.enableInteriorProp(271617, "Int01_ba_equipment_setup");
    mp.game.interior.enableInteriorProp(271617, "Int01_ba_equipment_upgrade");
    mp.game.interior.enableInteriorProp(271617, "Int01_ba_security_upgrade");
    mp.game.interior.enableInteriorProp(271617, "Int01_ba_dj01");
    mp.game.interior.enableInteriorProp(271617, "DJ_03_Lights_02");
    mp.game.interior.enableInteriorProp(271617, "DJ_04_Lights_01");
    mp.game.interior.enableInteriorProp(271617, "DJ_03_Lights_03");
    mp.game.interior.enableInteriorProp(271617, "DJ_04_Lights_04");
    mp.game.interior.enableInteriorProp(271617, "Int01_ba_bar_content");
    mp.game.interior.enableInteriorProp(271617, "Int01_ba_booze_01");
    mp.game.interior.enableInteriorProp(271617, "Int01_ba_dry_ice");
    mp.game.interior.refreshInterior(271617);

    for (let i = 0; i < 10; i++) { mp.game.streaming.requestIpl(`ba_case${i}_dixon`); }
    for (let i = 0; i < 10; i++) { mp.game.streaming.requestIpl(`ba_case${i}_solomun`); }
    for (let i = 0; i < 10; i++) { mp.game.streaming.requestIpl(`ba_case${i}_taleofus`); }
    for (let i = 0; i < 10; i++) { mp.game.streaming.requestIpl(`ba_case${i}_madonna`); }

    mp.game.streaming.requestIpl("ba_barriers_case1");
    mp.game.streaming.requestIpl("ba_barriers_case3");
    mp.game.streaming.requestIpl("ba_barriers_case9");
};

methods.sendDiscordServerNews = function (title, sender, message) {
    mp.events.callRemote('server:discord:sendDiscordServerNews', title, sender, message);
};

methods.notifyWithPictureToAll = function (title, sender, message, notifPic, icon = 0, flashing = false, textColor = -1, bgColor = -1, flashColor = [77, 77, 77, 200]) {
    mp.events.callRemote('server:players:notifyWithPictureToAll', title, sender, message, notifPic, icon, flashing, textColor, bgColor, flashColor);
};

methods.notifyWithPictureToFraction = function (title, sender, message, notifPic, fractionId = 0, icon = 0, flashing = false, textColor = -1, bgColor = -1, flashColor = [77, 77, 77, 200]) {
    mp.events.callRemote('server:players:notifyWithPictureToFraction', title, sender, message, notifPic, fractionId, icon, flashing, textColor, bgColor, flashColor);
};

methods.notifyWithPictureToFraction2 = function (title, sender, message, notifPic, fractionId = 0, icon = 0, flashing = false, textColor = -1, bgColor = -1, flashColor = [77, 77, 77, 200]) {
    mp.events.callRemote('server:players:notifyWithPictureToFraction2', title, sender, message, notifPic, fractionId, icon, flashing, textColor, bgColor, flashColor);
};

methods.notifyWithPictureToFractionF = function (title, sender, message, notifPic, fractionId = 0, icon = 0, flashing = false, textColor = -1, bgColor = -1, flashColor = [77, 77, 77, 200]) {
    mp.events.callRemote('server:players:notifyWithPictureToFractionF', title, sender, message, notifPic, fractionId, icon, flashing, textColor, bgColor, flashColor);
};

methods.notifyToFraction = function (message, fractionId = 0) {
    mp.events.callRemote('server:players:notifyToFraction', message, fractionId);
};

methods.notifyToAll = function (message) {
    mp.events.callRemote('server:players:notifyToAll', message);
};

methods.getRareName = function (proc) {
    if (proc === 0)
        return 'Обычная';
    if (proc <= 10)
        return 'Легендарная';
    if (proc <= 20)
        return 'Засекреченная';
    if (proc <= 30)
        return 'Мистическая';
    if (proc <= 40)
        return 'Элитная';
    if (proc <= 50)
        return 'Невероятно редкая';
    if (proc <= 60)
        return 'Очень редкая';
    if (proc <= 70)
        return 'Редкая';
    if (proc <= 80)
        return 'Необычная';
    if (proc <= 90)
        return 'Ширпотреб';
    return 'Обычная';
};

methods.sortBy = function (arr, p) {
    return arr.slice(0).sort(function(a,b) {
        return (a[p] > b[p]) ? 1 : (a[p] < b[p]) ? -1 : 0;
    });
};

/*methods.isInPoint = function (p1, p2, p3, p4, point) {
    return Math.min(p1.x, p2.x) < point.x && Math.max(p3.x, p4.x) > point.x && Math.min(p1.y, p4.y) < point.y && Math.max(p2.y, p3.y) > point.y;
};*/

methods.isInPoint = function (p, polygon) {
    let isInside = false;
    let minX = polygon[0].x, maxX = polygon[0].x;
    let minY = polygon[0].y, maxY = polygon[0].y;
    for (let n = 1; n < polygon.length; n++) {
        let q = polygon[n];
        minX = Math.min(q.x, minX);
        maxX = Math.max(q.x, maxX);
        minY = Math.min(q.y, minY);
        maxY = Math.max(q.y, maxY);
    }

    if (p.x < minX || p.x > maxX || p.y < minY || p.y > maxY) {
        return false;
    }

    let i = 0, j = polygon.length - 1;
    for (i, j; i < polygon.length; j = i++) {
        if ( (polygon[i].y > p.y) != (polygon[j].y > p.y) &&
            p.x < (polygon[j].x - polygon[i].x) * (p.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x ) {
            isInside = !isInside;
        }
    }

    return isInside;
};

methods.isBlackout = function () {
    return ctos.isBlackout();
};

methods.md5 = function(d) {var r = M(V(Y(X(d),8*d.length)));return r.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}

export default methods;