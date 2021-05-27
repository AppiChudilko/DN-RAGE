"use strict";

import Container from './modules/data';
import methods from './modules/methods';
import ui from "./modules/ui";

import weapons from "./weapons";
import enums from "./enums";
import items from "./items";
import phone from "./phone";
import inventory from "./inventory";
import chat from "./chat";
import menuList from "./menuList";

import quest from "./manager/quest";
import bind from "./manager/bind";
import object from "./manager/object";
import Camera from "./manager/cameraRotator";
import timer from "./manager/timer";
import UIMenu from "./modules/menu";

import houses from "./property/houses";
import business from "./property/business";
import stocks from "./property/stocks";
import condos from "./property/condos";
import vehicles from "./property/vehicles";
import yachts from "./property/yachts";
import npc from "./manager/npc";
import cutscene from "./manager/cutscene";
import admin from "./admin";


let user = {};

let _isLogin = false;

let userData = new Map();
let datingList = new Map();

user.godmode = false;
//user.isTeleport = true;
user.currentId = 0;
user.targetEntity = undefined;
user.socialClub = 'socialclub';
//user.btnCamera = 238;
user.btnCamera = 237;

user.camOffsetLeft = 0;
user.camOffsetRight = 1;
user.currentStation = -1;
user.isCustom = false;

let currentCamDist = 0.2;
let currentCamRot = -2;
let targetEntityPrev = undefined;

let isTeleport = true;
let isHeal = true;
let isArmor = false;
let isGiveAmmo = true;

let cam = null;
let cameraRotator = new Camera.Rotator();

let currentScenario = '';

/*
0 - Third Person Close
1 - Third Person Mid
2 - Third Person Far
4 - First Person
* */

let currentScale = 0;
let pulse = false;
let currentKey = 'G';
let scaleForm = mp.game.graphics.requestScaleformMovie("mp_car_stats_01");
let vehicleInfo = null;
let vehicleData = null;

mp.events.add('render', () => {
    let entity = user.getTargetEntityValidate();
    try {
        if (user.isLogin() && entity && entity.getAlpha() > 0) {
            if (user.getCache('s_hud_raycast')) {
                let pos = entity.position;
                //ui.drawText3D(`•`, pos.x, pos.y, pos.z, 1.3);
                if (currentScale >= 0.1)
                    pulse = false;
                if (currentScale <= 0)
                    pulse = true;
                if (pulse)
                    currentScale = currentScale + 0.003;
                else
                    currentScale = currentScale - 0.003;
                ui.drawText3D(currentKey, pos.x, pos.y, pos.z, 0.3 + currentScale);
            }
            else
                ui.drawText(`•`, 0.5, 0.5, 0.3, 255, 255, 255, 200, 0, 1, false, true);
        }
    }
    catch (e) {}

    try {
        if (entity && vehicleInfo && vehicleData) {
            let tRot = entity.getRotation(0);
            let offset = entity.getOffsetFromInWorldCoords(3.5, 1, 0);
            mp.game.graphics.drawScaleformMovie3d(scaleForm,offset.x, offset.y, entity.position.z + 6 + (currentScale / 6), 0, 180, tRot.z, 0.0, 1.0, 0.0, 7.0, 5, 7.0, 0);
        }
    }
    catch (e) {

    }
});

user.timerRayCast = async function() {

    try {
        if (!mp.players.local.isSittingInAnyVehicle()) {
            switch (mp.game.invoke(methods.GET_FOLLOW_PED_CAM_VIEW_MODE)) {
                case 4:
                    user.targetEntity = user.pointingAtRadius(3);
                    //if (user.getTargetEntityValidate() === undefined)
                    //    user.targetEntity = user.pointingAtRadius(2);
                    break;
                case 1:
                    user.targetEntity = user.pointingAtRadius(6.8);
                    //if (user.getTargetEntityValidate() === undefined)
                    //    user.targetEntity = user.pointingAtRadius(6.8);
                    break;
                case 2:
                    user.targetEntity = user.pointingAtRadius(9);
                    //if (user.getTargetEntityValidate() === undefined)
                    //    user.targetEntity = user.pointingAtRadius(9);
                    break;
                default:
                    user.targetEntity = user.pointingAtRadius(5);
                    //if (user.getTargetEntityValidate() === undefined)
                    //    user.targetEntity = user.pointingAtRadius(5);
                    break;
            }

            let target = user.getTargetEntityValidate();
            /*if (target && target != targetEntityPrev)
                mp.game.ui.notifications.show(`Нажмите ~g~${bind.getKeyName(user.getCache('s_bind_do'))}~s~ для взаимодействия`);*/

            try {
                if (target && target != targetEntityPrev) {

                    if (target.getVariable('useless') === true && target.getVariable('user_id') > 0) {
                        vehicleInfo = methods.getVehicleInfo(target.model);
                        vehicleData = await vehicles.getData(target.getVariable('container'));

                        let maxSpeed = 450;
                        let fuelSpeed = 20;

                        let speed = vehicles.getSpeedMax(target.model) / maxSpeed * 100;
                        if (speed > 100)
                            speed = 100;

                        let fuel = vehicleInfo.fuel_min / fuelSpeed * 100;
                        if (fuel > 100)
                            fuel = 100;

                        let priceMore = (vehicleData.get('sell_price') / (vehicleInfo.price) * 100) - 100;
                        if (priceMore > 100)
                            priceMore = 100;
                        if (priceMore < 0)
                            priceMore = 0;

                        let countSeat = target.getMaxNumberOfPassengers() * 10;
                        if (countSeat > 100)
                            countSeat = 100;

                        mp.game.graphics.pushScaleformMovieFunction(scaleForm, 'SET_VEHICLE_INFOR_AND_STATS');
                        mp.game.graphics.pushScaleformMovieFunctionParameterString(vehicleInfo.display_name);
                        mp.game.graphics.pushScaleformMovieFunctionParameterString(`${methods.moneyFormat(vehicleData.get('sell_price'))}`);
                        mp.game.graphics.pushScaleformMovieFunctionParameterString('CHAR_FRANKLIN');
                        mp.game.graphics.pushScaleformMovieFunctionParameterString('CHAR_FRANKLIN');
                        mp.game.graphics.pushScaleformMovieFunctionParameterString('Скорость');
                        mp.game.graphics.pushScaleformMovieFunctionParameterString('Расход');
                        mp.game.graphics.pushScaleformMovieFunctionParameterString('Наценка');
                        mp.game.graphics.pushScaleformMovieFunctionParameterString('Вместимость');
                        mp.game.graphics.pushScaleformMovieFunctionParameterInt(methods.parseInt(speed));
                        mp.game.graphics.pushScaleformMovieFunctionParameterInt(methods.parseInt(fuel));
                        mp.game.graphics.pushScaleformMovieFunctionParameterInt(methods.parseInt(priceMore));
                        mp.game.graphics.pushScaleformMovieFunctionParameterInt(methods.parseInt(countSeat));
                        mp.game.graphics.popScaleformMovieFunctionVoid();
                    }
                    else {
                        vehicleInfo = null;
                        vehicleData = null;
                    }
                }
                else {
                    /*vehicleInfo = null;
                    vehicleData = null;*/
                }
            }
            catch (e) {
                /*vehicleInfo = null;
                vehicleData = null;*/
            }

            targetEntityPrev = target;
        }
        else
            user.targetEntity = null;
    }
    catch (e) {

    }
};

user.timer1sec = function() {

    try {
        if (user.isLogin())
            currentKey = bind.getKeyName(user.getCache('s_bind_do'));
    }
    catch (e) {}

    try {
        ui.updateZoneAndStreet();
        ui.updateDirectionText();
    }
    catch (e) {
        
    }

    try {
        for (let n = 54; n < 138; n++)
        {
            weapons.getMapList().forEach(item => {
                if (item[0] !== items.getItemNameHashById(n)) return;
                let hash = item[1] / 2;
                if (!mp.game.invoke(methods.HAS_PED_GOT_WEAPON, mp.players.local.handle, hash, false)) return;

                let ammoCount = user.getAmmoByHash(hash);
                let slot = weapons.getGunSlotIdByItem(n);

                //if (user.getCache('weapon_' + slot + '_ammo') == -1)
                //    return;

                if (methods.parseInt(user.getCache('weapon_' + slot + '_ammo')) != methods.parseInt(ammoCount)) {
                    user.set('weapon_' + slot + '_ammo', ammoCount);
                }
            });
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

user.getTargetEntity = function() {
    return user.targetEntity.entity;
};

user.getTargetEntityValidate = function() {
    try {
        if (
            user.targetEntity &&
            user.targetEntity.entity &&
            user.targetEntity.entity.getType() != 3 &&
            !user.targetEntity.entity.getVariable('useless')
        )
            return user.targetEntity.entity;
        else if (
            user.targetEntity &&
            user.targetEntity.entity &&
            user.targetEntity.entity.getType() != 3 &&
            user.targetEntity.entity.getVariable('useless') &&
            user.targetEntity.entity.getVariable('user_id')
        )
            return user.targetEntity.entity;
        else if (
            user.targetEntity &&
            user.targetEntity.entity &&
            user.targetEntity.entity.getVariable('isDrop')
        )
            return user.targetEntity.entity;
        else if (
            user.targetEntity &&
            user.targetEntity.entity &&
            user.targetEntity.entity.getVariable('emsType') !== undefined &&
            user.targetEntity.entity.getVariable('emsType') !== null
        )
            return user.targetEntity.entity;
        else if (
            user.targetEntity &&
            user.targetEntity.entity &&
            user.targetEntity.entity.invType !== undefined &&
            user.targetEntity.entity.invType !== null
        )
            return user.targetEntity.entity;
        else if (
            user.targetEntity &&
            user.targetEntity.entity &&
            user.targetEntity.entity.getVariable('stockId')
        )
            return user.targetEntity.entity;
        else if (
            user.targetEntity &&
            user.targetEntity.entity &&
            user.targetEntity.entity.getVariable('houseSafe')
        )
            return user.targetEntity.entity;
        else if (
            user.targetEntity &&
            user.targetEntity.entity &&
            user.targetEntity.entity.getVariable('condoSafe')
        )
            return user.targetEntity.entity;
    }
    catch (e) {

    }
    return undefined;
};

user.pointingAt = function(distance) {
    try {
        const camera = mp.cameras.new("gameplay");
        let position = camera.getCoord();
        let direction = camera.getDirection();
        let farAway = new mp.Vector3((direction.x * distance) + (position.x), (direction.y * distance) + (position.y), (direction.z * distance) + (position.z));
        return mp.raycasting.testPointToPoint(position, farAway, mp.players.local, (2 | 4 | 8 | 16));
    }
    catch (e) {

    }
    return undefined;
};

user.pointingAtRadius = function(distance, radius = 0.2) {
    try {
        const camera = mp.cameras.new("gameplay");
        let position = camera.getCoord();
        let direction = camera.getDirection();
        let farAway = new mp.Vector3((direction.x * distance) + (position.x), (direction.y * distance) + (position.y), (direction.z * distance) + (position.z));
        return mp.raycasting.testCapsule(position, farAway, radius, mp.players.local);
    }
    catch (e) {
    }
    return undefined;
};

user.setTeleport = function(state) {
    isTeleport = state;
};

user.isTeleport = function() {
    return isTeleport;
};

user.removeAllWeapons = function() {
    mp.players.local.removeAllWeapons();
    /*mp.players.local.removeAllWeapons();

    weapons.getMapList().forEach(item => {
        try {
            let hash = item[1] / 2;
            if (Container.Data.HasLocally(0, hash.toString())) {
                Container.Data.ResetLocally(0, hash.toString());
                Container.Data.Reset(mp.players.local.remoteId, hash.toString());
            }
        }
        catch (e) {
            methods.debug(e);
        }
    });*/

    user.setCurrentWeapon('weapon_unarmed');
    /*inventory.deleteItemsRange(54, 136);
    inventory.deleteItemsRange(146, 147);*/
};

user.sudoRemoveAllWeapons = function() {
    mp.players.local.removeAllWeapons();

    weapons.getMapList().forEach(item => {
        try {
            if (mp.game.invoke(methods.HAS_PED_GOT_WEAPON, mp.players.local.handle, (item[1] / 2), false)) {
                let wpName = item[0];
                let wpHash = weapons.getHashByName(wpName);
                user.setAmmo(wpName, 0);
                mp.game.invoke(methods.REMOVE_WEAPON_FROM_PED, mp.players.local.handle, wpHash);
            }
        }
        catch (e) {
            methods.debug(e);
        }
    });

    user.setCurrentWeapon('weapon_unarmed');
};

user.unequipAllWeapons = function() {
    weapons.getMapList().forEach(item => {
        try {
            if (mp.game.invoke(methods.HAS_PED_GOT_WEAPON, mp.players.local.handle, (item[1] / 2), false)) {
                let wpName = item[0];
                let wpHash = weapons.getHashByName(wpName);
                let slot = weapons.getGunSlotId(wpName);

                let ammoId = weapons.getGunAmmoId(wpName);

                if (ammoId >= 0) {
                    inventory.addItemSql(ammoId, 1, inventory.types.Player, user.getCache('id'), user.getAmmoByHash(wpHash));
                }

                user.setAmmo(wpName, 0);
                mp.game.invoke(methods.REMOVE_WEAPON_FROM_PED, mp.players.local.handle, wpHash);

                user.set('weapon_' + slot, '');
                user.set('weapon_' + slot + '_ammo', -1);

                inventory.updateItemsEquipByItemId(items.getWeaponIdByName(wpName), inventory.types.Player, user.getCache('id'), 0);

                mp.attachmentMngr.removeLocal('WDSP_' + wpName.toUpperCase());
            }
        }
        catch (e) {
            methods.debug(e);
        }
    });

    user.save();
    user.setCurrentWeapon('weapon_unarmed');
};

user.hasGotAnyWeapon = function() {
    let hasWeapon = false;
    weapons.getMapList().forEach(item => {
        let hash = item[1] / 2;
        if (!mp.game.invoke(methods.HAS_PED_GOT_WEAPON, mp.players.local.handle, hash, false))
            hasWeapon = true;
    });
    return hasWeapon;
};

user.giveWeaponByHash = function(model, pt) {
    try {
        if (pt < 0)
            pt = 0;
        isGiveAmmo = true;
        mp.game.invoke(methods.GIVE_WEAPON_TO_PED, mp.players.local.handle, model, methods.parseInt(pt), false, true);
        Container.Data.SetLocally(0, model.toString(), true);
        Container.Data.Set(mp.players.local.remoteId, model.toString(), methods.parseInt(pt));
    }
    catch (e) {
        methods.debug(e);
    }
};

user.giveWeaponComponentByHash = function(model, component) {
    //mp.game.invoke(methods.GIVE_WEAPON_COMPONENT_TO_PED, mp.players.local.handle, model, component);
    mp.events.callRemote('server:user:giveWeaponComponent', model.toString(), component.toString());
};

user.giveWeaponComponent = function(model, component) {
    user.giveWeaponComponentByHash(weapons.getHashByName(model), component);
};

user.removeWeaponComponentByHash = function(model, component) {
    //mp.game.invoke(methods.GIVE_WEAPON_COMPONENT_TO_PED, mp.players.local.handle, model, component);
    mp.events.callRemote('server:user:removeWeaponComponent', model.toString(), component.toString());
};

user.removeWeaponComponent = function(model, component) {
    user.removeWeaponComponentByHash(weapons.getHashByName(model), component);
};

user.removeAllWeaponComponents = function(model) {
    user.removeAllWeaponComponentsByHash(weapons.getHashByName(model));
};

user.removeAllWeaponComponentsByHash = function(model) {
    mp.events.callRemote('server:user:removeAllWeaponComponents', model.toString());
};

user.setCurrentWeapon = function(model) {
    user.setCurrentWeaponByHash(weapons.getHashByName(model));
};

user.setCurrentWeaponByHash = function(model) {
    try {
        isGiveAmmo = true;
        mp.game.invoke(methods.SET_CURRENT_PED_WEAPON, mp.players.local.handle, model, true);
    }
    catch (e) {
        methods.debug(e);
    }
};

user.setWeaponTintByHash = function(model, tint) {
    mp.events.callRemote('server:user:setWeaponTint', model.toString(), methods.parseInt(tint));
};

user.setWeaponTint = function(model, tint) {
    user.setWeaponTintByHash(weapons.getHashByName(model), tint);
};

user.giveWeapon = function(model, pt) {
    user.giveWeaponByHash(weapons.getHashByName(model), pt);
};

user.addAmmo = function(name, count) {
    user.addAmmoByHash(weapons.getHashByName(name), count);
};

user.addAmmoByHash = function(name, count) {
    try {
        isGiveAmmo = true;
        mp.game.invoke(methods.ADD_AMMO_TO_PED, mp.players.local.handle, name, methods.parseInt(count));
    }
    catch (e) {
        methods.debug(e)
    }
};

user.setAmmo = function(name, count) {
    user.setAmmoByHash(weapons.getHashByName(name), count);
};

user.setAmmoByHash = function(name, count) {
    try {
        isGiveAmmo = true;
        mp.game.invoke(methods.SET_PED_AMMO, mp.players.local.handle, name, methods.parseInt(count));
    }
    catch (e) {
        methods.debug(e);
    }
};

user.getAmmo = function(name) {
    return user.getAmmoByHash(weapons.getHashByName(name));
};

user.isSetAmmo = function() {
    return isGiveAmmo;
};

user.isSetAmmoFalse = function() {
    isGiveAmmo = false;
};

user.isSetAmmoTrue = function() {
    isGiveAmmo = true;
};

user.getAmmoByHash = function(name) {
    return mp.game.invoke(methods.GET_AMMO_IN_PED_WEAPON, mp.players.local.handle, name);
};

user.getCurrentAmmoInClip = function() {
    return mp.players.local.getAmmoInClip(user.getCurrentWeapon());
};

user.getCurrentAmmo = function() {
    return user.getAmmoByHash(user.getCurrentWeapon());
};

user.getCurrentWeapon = function() {
    return mp.game.invoke(methods.GET_SELECTED_PED_WEAPON, mp.players.local.handle);
};

let lastWeapon = 0;
user.getLastWeapon = function() {
    return lastWeapon;
};

user.setLastWeapon = function(hash) {
    lastWeapon = hash;
};

let invWeapons = [];
user.getInvEquipWeapon = function() {
    return invWeapons;
};

user.setInvEquipWeapon = function(list) {
    invWeapons = list;
};

user.revive = function(hp = 20) {
    isTeleport = true;
    let hospPos = mp.players.local.position;
    //mp.players.local.resurrect();
    //mp.players.local.position = hospPos;
    mp.events.callRemote('server:user:respawn', hospPos.x, hospPos.y, hospPos.z);
    setTimeout(function () {
        mp.players.local.freezePosition(false);
        ui.showHud();
    }, 2000)
};

user.respawn = function(x, y, z) {
    isTeleport = true;
    mp.events.callRemote('server:user:respawn', x, y, z);
};

user.teleportv = function(pos, rot, isHud = true) {
    menuList.hide();
    isTeleport = true;
    mp.game.streaming.requestCollisionAtCoord(pos.x, pos.y, pos.z);
    user.showLoadDisplay(500, isHud);
    //methods.wait(500);
    setTimeout(function () {
        isTeleport = true;
        mp.attachmentMngr.shutdownFor(mp.players.local);
        mp.players.local.position = pos;
        admin.teleportCamera(pos);
        if (rot != undefined)
            mp.players.local.setRotation(0, 0, methods.parseInt(rot), 0, true);
        //methods.wait(500);
        setTimeout(function () {
            object.process();
            mp.attachmentMngr.initFor(mp.players.local);
            if (user.currentStation >= 0)
                mp.game.audio.setEmitterRadioStation("SE_Script_Placed_Prop_Emitter_Boombox", mp.game.audio.getRadioStationName(user.currentStation));
            user.hideLoadDisplay(500, isHud);
        }, 1000);
    }, 500);
};

user.teleportVehV = function(pos, rot) {
    menuList.hide();
    isTeleport = true;
    mp.game.streaming.requestAdditionalCollisionAtCoord(pos.x, pos.y, pos.z);
    mp.game.streaming.requestCollisionAtCoord(pos.x, pos.y, pos.z);
    user.showLoadDisplay(500);
    let camMode = mp.game.invoke(methods.GET_FOLLOW_VEHICLE_CAM_VIEW_MODE);
    //methods.wait(500);
    setTimeout(function () {
        try {
            isTeleport = true;
            mp.attachmentMngr.shutdownFor(mp.players.local);
            mp.game.streaming.requestAdditionalCollisionAtCoord(pos.x, pos.y, pos.z);
            mp.game.streaming.requestCollisionAtCoord(pos.x, pos.y, pos.z);
            mp.game.invoke(methods.SET_FOLLOW_VEHICLE_CAM_VIEW_MODE, 4);
            if (mp.players.local.vehicle) {
                mp.players.local.vehicle.freezePosition(true);
                mp.players.local.vehicle.position = pos;
                if (rot != undefined)
                    mp.players.local.vehicle.setRotation(0, 0, methods.parseInt(rot), 0, true);
            }
            else {
                if (rot != undefined)
                    mp.players.local.setRotation(0, 0, methods.parseInt(rot), 0, true);
                mp.players.local.position = pos;
                admin.teleportCamera(pos);
            }
        }
        catch (e) {
            methods.debug(e);
        }
        //methods.wait(500);
        setTimeout(function () {

            try {
                //if (mp.players.local.dimension === 0)
                if (mp.players.local.vehicle) {
                    mp.players.local.vehicle.freezePosition(false);
                    mp.players.local.vehicle.setOnGroundProperly();
                }

                object.process();
                mp.attachmentMngr.initFor(mp.players.local);
                if (user.currentStation >= 0)
                    mp.game.audio.setEmitterRadioStation("SE_Script_Placed_Prop_Emitter_Boombox", mp.game.audio.getRadioStationName(user.currentStation));
                mp.game.invoke(methods.SET_FOLLOW_VEHICLE_CAM_VIEW_MODE, camMode);
                user.hideLoadDisplay(500);
            }
            catch (e) {
                methods.debug(e);
            }
        }, 1000);
    }, 500);
};

user.teleport = function(x, y, z, rot, isHud = true) {
    user.teleportv(new mp.Vector3(x, y, z), rot, isHud);
};

user.teleportVeh = function(x, y, z, rot) {
    user.teleportVehV(new mp.Vector3(x, y, z), rot);
};

user.putInVehicle = function() {
    isTeleport = true;
};

user.tpToWaypoint = function() { //TODO машина
    try {
        let pos = methods.getWaypointPosition();

        isTeleport = true;
        let entity = mp.players.local.vehicle ? mp.players.local.vehicle : mp.players.local;
        entity.position = new mp.Vector3(pos.x, pos.y, pos.z + 20);
        let interval = setInterval(function () {
            try {
                mp.game.streaming.requestCollisionAtCoord(pos.x, pos.y, pos.z);
                entity.position = new mp.Vector3(pos.x, pos.y, entity.position.z + 20);

                admin.teleportCamera(pos);

                let zPos = mp.game.gameplay.getGroundZFor3dCoord(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, 0, false);
                if (entity.position.z > 1000 || zPos != 0) {
                    entity.position = new mp.Vector3(pos.x, pos.y, zPos + 2);

                    if (mp.players.local.vehicle)
                        mp.players.local.vehicle.setOnGroundProperly();

                    clearInterval(interval);
                }
            }
            catch (e) {
                methods.debug(e);
            }
        }, 1);
    } catch(e) {
        methods.debug(e);
    }
};

user.setWaypoint = function(x, y) {
    mp.game.ui.setNewWaypoint(methods.parseInt(x), methods.parseInt(y));
    ui.showSubtitle('Метка в ~g~GPS~s~ была установлена');
    mp.game.audio.playSoundFrontend(-1, "WAYPOINT_SET", "HUD_FRONTEND_DEFAULT_SOUNDSET", false);
};

user.removeWaypoint = function() {
    user.setWaypoint(mp.players.local.position.x, mp.players.local.position.y);
};

user.hideLoadDisplay = function(dur = 500, isHud = true) {
    mp.game.cam.doScreenFadeIn(dur);
    setTimeout(function () {
        if (isHud && user.isLogin())
            ui.showHud();
    }, dur);
};

user.showLoadDisplay = function(dur = 500, isHud = true) {
    mp.game.cam.doScreenFadeOut(dur);
    if (isHud)
        ui.hideHud();
};

user.clearChat = function() {
    chat.clear();
};

user.sendPhoneNotify = function(sender, title, message, pic = 'CHAR_BLANK_ENTRY') {
    if (phone.getType() > 0)
        phone.sendNotify(sender, title, message, pic);
};

user.init = function() {

    try {
        mp.nametags.enabled = false;
        mp.game.graphics.transitionFromBlurred(0);

        timer.createInterval('user.timerRayCast', user.timerRayCast, 200);
        timer.createInterval('user.timer1sec', user.timer1sec, 1000);

        user.stopAllScreenEffect();
        //user.hideLoadDisplay();
        user.clearChat();
        user.setAlpha(255);

        setTimeout(user.initFlyCam, 500);
    }
    catch (e) {
        methods.debug(e);
    }
};

user.init2 = function() {

    try {

        let idx = methods.getRandomInt(0, enums.initCams.length);

        /*cam.pointAtCoord(9.66692, 528.34783, 171.2);
        cam.setActive(true);*/

        /*cameraRotator.start(cam, vPos, vPos, new mp.Vector3(0, 3, 0), 120);
        cameraRotator.setXBound(-360, 360);
        cameraRotator.setOffsetBound(0.4, 1.5);
        cameraRotator.setZUpMultipler(1);*/

        mp.game.graphics.transitionToBlurred(100);

        user.setVirtualWorld(mp.players.local.remoteId + 1);
        mp.players.local.position = new mp.Vector3(enums.initCams[idx][0], enums.initCams[idx][1], enums.initCams[idx][2] + 20);
        mp.players.local.setRotation(0, 0, 123.53768, 0, true);
        mp.players.local.freezePosition(true);
        mp.players.local.setVisible(true, false);
        mp.players.local.setCollision(false, false);

        mp.game.ui.displayRadar(false);
        mp.gui.chat.activate(false);

        cam = mp.cameras.new('customization');
        cam.shake("HAND_SHAKE", 0.3);
        cam.setCoord(enums.initCams[idx][0], enums.initCams[idx][1], enums.initCams[idx][2]);
        cam.pointAtCoord(enums.initCams[idx][3], enums.initCams[idx][4], enums.initCams[idx][5]);
        mp.game.cam.renderScriptCams(true, false, 0, false, false);
    }
    catch (e) {
        methods.debug(e);
    }
};

user.initFlyCam = function() {

    try {

        cutscene.loadAuthRandom();

        //let idx = methods.getRandomInt(0, enums.initCams.length);

        /*cam.pointAtCoord(9.66692, 528.34783, 171.2);
        cam.setActive(true);*/

        /*cameraRotator.start(cam, vPos, vPos, new mp.Vector3(0, 3, 0), 120);
        cameraRotator.setXBound(-360, 360);
        cameraRotator.setOffsetBound(0.4, 1.5);
        cameraRotator.setZUpMultipler(1);*/

        //mp.game.graphics.transitionToBlurred(100);

        /*user.setVirtualWorld(mp.players.local.remoteId + 1);
        //mp.players.local.position = new mp.Vector3(enums.initCams[idx][0], enums.initCams[idx][1], enums.initCams[idx][2] + 20);
        mp.players.local.position = new mp.Vector3(4859.0341796875, -4926.43212890625, 5.304588317871094 + 20);
        mp.players.local.setRotation(0, 0, 123.53768, 0, true);
        mp.players.local.freezePosition(true);
        mp.players.local.setVisible(true, false);
        mp.players.local.setCollision(false, false);

        mp.game.ui.displayRadar(false);
        mp.gui.chat.activate(false);

        cam = mp.cameras.new('customization');
        cam.shake("HAND_SHAKE", 0.3);
        //cam.setCoord(enums.initCams[idx][0], enums.initCams[idx][1], enums.initCams[idx][2]);
        //cam.pointAtCoord(enums.initCams[idx][3], enums.initCams[idx][4], enums.initCams[idx][5]);
        cam.setCoord(4859.0341796875, -4926.43212890625, 5.304588317871094);
        cam.setRot(-1.8375024795532227, 5.338830533219152e-8, -114.02210998535156, 2);
        mp.game.cam.renderScriptCams(true, false, 0, false, false);*/


    }
    catch (e) {
        methods.debug(e);
    }
};

user.initCharCam = function(playerList) {

    try {
        user.setVirtualWorld(mp.players.local.remoteId + 1);
        mp.players.local.position = new mp.Vector3(425.4717712402344, -970.6879272460938, -100.00418090820312 + 10);
        //mp.players.local.position = new mp.Vector3(-460.69805908203125, -688.9095458984375, 71.20377349853516 + 10);
        mp.players.local.freezePosition(true);
        mp.players.local.setVisible(true, false);
        mp.players.local.setCollision(false, false);

        let posNpcList = [
            [new mp.Vector3(405.368408203125, -970.7139282226562, -99.00418090820312), 178.55345153808594],
            [new mp.Vector3(402.9247131347656, -969.4664306640625, -99.00418090820312), 179.53414916992188],
            [new mp.Vector3(407.9364318847656, -969.3421020507812, -99.00418090820312), 181.44131469726562],
        ];
        playerList.forEach(async (p, idx) => {
            try {

                await methods.sleep(500);

                let scenarios = [
                    'WORLD_HUMAN_SMOKING',
                    'WORLD_HUMAN_BUM_FREEWAY',
                    'WORLD_HUMAN_AA_COFFEE',
                    'CODE_HUMAN_MEDIC_TIME_OF_DEATH',
                    'WORLD_HUMAN_DRINKING',
                ];

                let model = 'mp_m_freemode_01';
                if (p.sex === 'w')
                    model = 'mp_f_freemode_01';

                let localNpc = await npc.createPedLocally(mp.game.joaat(model), posNpcList[idx][0], posNpcList[idx][1]);
                setTimeout(function () {
                    try {
                        npc.updateNpcFace(localNpc, p.skin);
                        npc.updateNpcTattoo(localNpc, p.tattoo);
                        npc.updateNpcCloth(localNpc, p.cloth, p.sex === 'w' ? 1 : 0);
                        mp.game.invoke(methods.TASK_START_SCENARIO_IN_PLACE, localNpc.handle, scenarios[methods.getRandomInt(0, scenarios.length)], 0, true);
                    }
                    catch (e) {
                        methods.error(e);
                    }
                }, 500);
            }
            catch (e) {
                methods.error(e);
            }
        });
        mp.game.ui.displayRadar(false);
        mp.gui.chat.activate(false);

        cam = mp.cameras.new('customization');
        cam.shake("HAND_SHAKE", 0.3);
        /*cam.setCoord(-460.69805908203125, -688.9095458984375, 71.20377349853516);
        cam.setRot(-1.9855390787124634, 0, -88.49031066894531, 2);*/
        cam.setCoord(405.368408203125, -972.6879272460938, -99.00418090820312);
        cam.pointAtCoord(405.368408203125, -970.7139282226562, -99.00418090820312);
        mp.game.cam.renderScriptCams(true, false, 0, false, false);
    }
    catch (e) {
        methods.debug(e);
    }
};

user.initCustom = function() {

    try {
        user.setVirtualWorld(mp.players.local.remoteId + 1);

        mp.players.local.position = new mp.Vector3(9.66692, 528.34783, 170.63504);
        mp.players.local.setRotation(0, 0, 123.53768, 0, true);

        mp.players.local.freezePosition(true);
        mp.players.local.setVisible(true, false);
        mp.players.local.setCollision(false, false);

        mp.game.ui.displayRadar(false);
        mp.gui.chat.activate(false);

        user.createCam(new mp.Vector3(9.66692, 528.34783, 171.3), 120);
        user.camOffsetRight = 0.65;

        user.isCustom = true;
    }
    catch (e) {
        methods.error(e);
    }
};

user.destroyCam = function() {
    try {
        user.camOffsetLeft = 0;
        user.camOffsetRight = 1;

        user.isCustom = false;

        if (cameraRotator.isCamera()) {
            cameraRotator.stop();
            cameraRotator.reset();
        }
        if (cam) {
            cam.destroy();
            cam = null;
        }
    }
    catch (e) {
        methods.error(e);
    }

    mp.game.cam.renderScriptCams(false, true, 500, true, true);
};

user.createCam = function(vPos, vRot, zUp = 1, offsetMin = 0.4, offsetMax = 1.5, offsetZMin = -0.8, offsetZMax = 1, shake = false) {
    try {
        if (cam)
            user.destroyCam();
        cam = mp.cameras.new('customization');
        cameraRotator.start(cam, vPos, vPos, new mp.Vector3(0, 3, 0), vRot);
        cameraRotator.setXBound(-360, 360);
        cameraRotator.setZBound(offsetZMin, offsetZMax);
        cameraRotator.setOffsetBound(offsetMin, offsetMax);
        cameraRotator.setZUpMultipler(zUp);
        //if (shake)
            cam.shake("HAND_SHAKE", 0.3);
        mp.game.cam.renderScriptCams(true, false, 500, false, false);
    }
    catch (e) {
        methods.error(e);
    }
};

user.getCam = function() {
    return cam;
};

user.setCam = function(camera) {
    cam = camera;
};

user.cameraBlockRotator = function(enable) {
    cameraRotator.pause(enable)
};

user.camSetRot = function(idx) {
    try {
        let coords = new mp.Vector3(9.66692, 528.34783, 171.3);
        currentCamRot = (idx / 180) * -2;
        let newCoords = new mp.Vector3((1 + currentCamDist) * Math.sin(currentCamRot) + coords.x, (1 + currentCamDist) * Math.cos(currentCamRot) + coords.y, coords.z);
        cam.setCoord(newCoords.x, newCoords.y, newCoords.z);
    }
    catch (e) {
        methods.debug(e);
    }
};

user.camSetDist = function(idx) {
    try {
        currentCamDist = idx;
        let coords = new mp.Vector3(9.66692, 528.34783, 171.3);
        let newCoords = new mp.Vector3((1 + currentCamDist) * Math.sin(currentCamRot) + coords.x, (1 + currentCamDist) * Math.cos(currentCamRot) + coords.y, coords.z);
        cam.setCoord(newCoords.x, newCoords.y, newCoords.z);
    }
    catch (e) {
        methods.debug(e);
    }
};

user.setVariable = function(key, value) {
    mp.events.callRemote('server:user:serVariable', key, value);
};

user.setVirtualWorld = function(worldId) {
    mp.events.callRemote('server:user:setVirtualWorld', worldId);
};

user.setVirtualWorldVeh = function(worldId) {
    mp.events.callRemote('server:user:setVirtualWorldVeh', worldId);
};

user.setAlpha = function(alpha) {
    mp.events.callRemote('server:user:setAlpha', alpha);
};

user.setPlayerModel = function(model) {
    mp.events.callRemote('server:user:setPlayerModel', model);
};

user.setClipset = function(style) {
    mp.events.callRemote('server:user:setClipset', style);
};

user.setClipsetW = function(style) {
    mp.events.callRemote('server:user:setClipsetW', style);
};

user.getClipset = function() {
    return mp.players.local.getVariable("walkingStyle");
};

user.shoot = function() {
    mp.events.callRemote('server:user:shoot');
};

user.setHealth = function(level) {
    isHeal = true;
    if (level === 0)
        level = -1;
    mp.players.local.setHealth(level + 100);
};

user.removeHealth = function(level) {
    isHeal = true;
    mp.players.local.setHealth(100 + (mp.players.local.getHealth() - level));
};

user.setArmour = function(level) {
    isArmor = true;
    mp.players.local.setArmour(level);

    /*if (!user.hasCache('uniform')) {
        if (level > 0)
            user.setComponentVariation( 9, 12, 1, 2);
        else
            user.setComponentVariation( 9, 0, 0, 2);
    }*/
};

user.setHealthFalse = function() {
    isHeal = false;
};

user.setArmorFalse = function() {
    isArmor = false;
};

user.isHealth = function() {
    return isHeal;
};

user.isArmor = function() {
    return isArmor;
};

user.setDecoration = function(slot, type, isLocal = false) {
    try {
        if (!isLocal)
            mp.events.callRemote('server:user:setDecoration', slot, type);
        else
            mp.players.local.setDecoration(mp.game.joaat(slot), mp.game.joaat(type));
    }
    catch (e) {
        methods.debug(e);
    }
};

user.clearDecorations = function(isLocal = false) {
    try {
        if (!isLocal)
            mp.events.callRemote('server:user:clearDecorations');
        else
            mp.players.local.clearDecorations();
    }
    catch (e) {
        methods.debug(e);
    }
};

user.save = function() {
    mp.events.callRemote('server:user:save');
};

user.login = function(name, spawnName) {
    user.showLoadDisplay();

    setTimeout(function () {
        try {
            ui.callCef('authMain','{"type": "hide"}');
            ui.callCef('customization','{"type": "hide"}');
            user.destroyCam();
            user.setLogin(true);

            methods.blockKeys(false);
            methods.disableAllControls(false);
            methods.disableDefaultControls(false);

            mp.events.callRemote('server:user:loginUser', name, spawnName);
        }
        catch (e) {
            methods.debug(e);
        }
    }, 500);
};

user.getCache = function(item) {
    try {
        if (userData.has(item))
            return userData.get(item);
        return undefined;
    }
    catch (e) {
        methods.debug('Exception: user.get');
        methods.debug(e);
        userData = new Map();
        return undefined;
    }
};

user.hasCache = function(item) {
    return userData.has(item);
};

user.setCache = function(key, value) {
    userData.set(key, value);
};

user.resetCache = function(key) {
    try {
        userData.delete(key);
    }
    catch (e) {
        
    }
};

user.updateCache = async function() {
    userData = await Container.Data.GetAll(mp.players.local.remoteId);
};

user.getDating = function(item) {
    try {
        if (datingList.has(item))
            return datingList.get(item);
        return item;
    }
    catch (e) {
        methods.debug('Exception: user.getDating');
        methods.debug(e);
        datingList = new Map();
        return item;
    }
};

user.hasDating = function(item) {
    return datingList.has(item);
};

user.setDating = function(key, value) {
    datingList.set(key, value);
};

user.set = function(key, val) {
    user.setCache(key, val);
    Container.Data.Set(mp.players.local.remoteId, key, val);
};

user.reset = function(key) {
    user.resetCache(key);
    Container.Data.Reset(mp.players.local.remoteId, key);
};

user.get = async function(key) {
    try {
        return await Container.Data.Get(mp.players.local.remoteId, key);
    } catch (e) {
        methods.debug(e);
    }
    return null;
};

user.has = async function(key) {
    return await Container.Data.Has(mp.players.local.remoteId, key);
};

user.getById = async function(key) {
    return await Container.Data.Get(user.getCache('id'), key);
};

user.hasById = async function(key) {
    return await Container.Data.Has(user.getCache('id'), key);
};

user.setById = function(key, value) {
    Container.Data.Set(user.getCache('id'), key, value);
};

user.setCacheData = function(data) {
    userData = data;
    user.currentId = data.get('id') + 1000000;
};

user.getCacheData = function() {
    return userData;
};

user.getSex = function() {
    try {
        if (mp.players.local.model === mp.game.joaat('mp_f_freemode_01'))
            return 1;
        else if (mp.players.local.model === mp.game.joaat('mp_m_freemode_01'))
            return 0;
        else if (user.isLogin()) {
            let skin = JSON.parse(user.getCache('skin'));
            return skin['SKIN_SEX'];
        }
    }
    catch (e) {
        methods.debug(e);
    }

    return 0;
};

user.getSexName = function() {
    if (!user.isLogin())
        return 'Мужской';
    return user.getSex() === 1 ? 'Женский' : 'Мужской';
};

user.updateCharacterFace = function(isLocal = false) {
    try {
        if (!isLocal)
            mp.events.callRemote('server:user:updateCharacterFace');
        else {

            mp.players.local.setHeadBlendData(
                user.getCache('SKIN_MOTHER_FACE'),
                user.getCache('SKIN_FATHER_FACE'),
                0,
                user.getCache('SKIN_MOTHER_SKIN'),
                user.getCache('SKIN_FATHER_SKIN'),
                0,
                user.getCache('SKIN_PARENT_FACE_MIX'),
                user.getCache('SKIN_PARENT_SKIN_MIX'),
                0,
                true
            );

            let specifications = user.getCache('SKIN_FACE_SPECIFICATIONS');
            if (specifications) {
                try {
                    JSON.parse(specifications).forEach((item, i) => {
                        mp.players.local.setFaceFeature(i, item);
                    })
                } catch(e) {
                    methods.debug(e);
                    methods.debug(specifications);
                }
            }

            mp.players.local.setComponentVariation(2, user.getCache('SKIN_HAIR'), 0, 2);
            mp.players.local.setHeadOverlay(2, user.getCache('SKIN_EYEBROWS'), 1.0, user.getCache('SKIN_EYEBROWS_COLOR'), 0);

            mp.players.local.setHairColor(user.getCache('SKIN_HAIR_COLOR'), user.getCache('SKIN_HAIR_COLOR_2'));
            mp.players.local.setEyeColor(user.getCache('SKIN_EYE_COLOR'));
            mp.players.local.setHeadOverlayColor(2, 1, user.getCache('SKIN_EYEBROWS_COLOR'), 0);

            mp.players.local.setHeadOverlay(9, user.getCache('SKIN_OVERLAY_9'), 1.0, user.getCache('SKIN_OVERLAY_COLOR_9'), 0);

            try {
                if (user.getSex() == 0) {
                    mp.players.local.setHeadOverlay(10, user.getCache('SKIN_OVERLAY_10'), 1.0, user.getCache('SKIN_OVERLAY_COLOR_10'), 0);
                    mp.players.local.setHeadOverlay(1, user.getCache('SKIN_OVERLAY_1'), 1.0, user.getCache('SKIN_OVERLAY_COLOR_1'), 0);
                }
                else if (user.getSex() == 1) {
                    mp.players.local.setHeadOverlay(4, user.getCache('SKIN_OVERLAY_4'), 1.0, user.getCache('SKIN_OVERLAY_COLOR_4'), 0);
                    mp.players.local.setHeadOverlay(5, user.getCache('SKIN_OVERLAY_5'), 1.0, user.getCache('SKIN_OVERLAY_COLOR_5'), 0);
                    mp.players.local.setHeadOverlay(8, user.getCache('SKIN_OVERLAY_8'), 1.0, user.getCache('SKIN_OVERLAY_COLOR_8'), 0);
                }
            }
            catch (e) {
                methods.debug('user.updateCharacterFaceLocal');
                methods.debug(e);
            }

            user.updateTattoo(true);
        }
    } catch(e) {
        console.log('updateCharacterFace', e);
    }
};

user.updateCharacterCloth = function() {
    mp.events.callRemote('server:user:updateCharacterCloth');
};

user.updateTattoo = function(isLocal = false, updateTattoo = true, updatePrint = true, updateHair = true) {
    if (!isLocal)
        mp.events.callRemote('server:user:updateTattoo');
    else {
        try {
            user.clearDecorations(true);

            if (updateTattoo) {
                let tattooList = JSON.parse(user.getCache( 'tattoo'));
                if (tattooList != null) {
                    try {
                        tattooList.forEach(function (item) {
                            if (user.getCache('tprint_c') != "" && item[2] == 'ZONE_TORSO')
                                return;
                            user.setDecoration(item[0], item[1], true);
                        });
                    }
                    catch (e) {
                        methods.debug(e);
                    }
                }
            }

            if (updateHair) {
                if (user.getCache('SKIN_HAIR_2')) {
                    let data = JSON.parse(enums.overlays)[user.getSex()][user.getCache( "SKIN_HAIR")];
                    user.setDecoration(data[0], data[1], true);
                }

                let data = JSON.parse(enums.overlays)[user.getSex()][methods.parseInt(user.getCache( "SKIN_HAIR_3"))];
                user.setDecoration(data[0], data[1], true);
            }

            if (updatePrint) {
                if (user.getCache('tprint_c') != "" && user.getCache( 'tprint_o') != "")
                    user.setDecoration( user.getCache( 'tprint_c'), user.getCache( 'tprint_o'), true);
            }
        }
        catch (e) {
            methods.debug('user.updateTattoo', e);
        }
    }
};

user.setComponentVariation = function(component, drawableId, textureId) {
    component = methods.parseInt(component);
    drawableId = methods.parseInt(drawableId);
    textureId = methods.parseInt(textureId);
    mp.events.callRemote('server:user:setComponentVariation', component, drawableId, textureId);
};

user.setProp = function(slot, type, color) {
    methods.debug('user.setProp');

    slot = methods.parseInt(slot);
    type = methods.parseInt(type);
    color = methods.parseInt(color);

    mp.events.callRemote('server:user:setProp', slot, type, color);
};

user.clearAllProp = function() {
    mp.events.callRemote('server:user:clearAllProp');
};

user.giveUniform = function(id) {
    mp.events.callRemote('server:user:giveUniform', id);
};

user.kick = function(reason) {
    mp.events.callRemote('server:user:kick', reason);
};

user.kickAntiCheat = function(reason) {
    mp.events.callRemote('server:user:kickAntiCheat', reason);
};

user.warnAntiCheat = function(reason) {
    mp.events.callRemote('server:user:warnAntiCheat', reason);
};

user.banAntiCheat = function(type, reason) {
    mp.events.callRemote('server:user:banAntiCheat', type, reason);
};

user.stopAllScreenEffect = function() {
    mp.game.invoke(methods.ANIMPOSTFX_STOP_ALL);

    mp.game.graphics.setNightvision(false);
    mp.game.graphics.setSeethrough(false);
    mp.game.graphics.setTimecycleModifierStrength(0);

    mp.game.graphics.setNoiseoveride(false);
    mp.game.graphics.setNoisinessoveride(0);

    mp.game.graphics.transitionFromBlurred(0);

    user.setDrugLevel(0, 0);
    user.setDrugLevel(1, 0);
    user.setDrugLevel(2, 0);
    user.setDrugLevel(3, 0);
    user.setDrugLevel(4, 0);
    user.setDrugLevel(5, 0);
    user.setDrugLevel(99, 0);
};

user.buyLicense = function(type, price, month = 12, typePay = 0)
{
    if (type === "b_lic") {
        setTimeout(function () {
            quest.standart();
        }, 5000);
    }
    if (type === "fish_lic") {
        setTimeout(function () {
            quest.fish(false, -1, 0);
        }, 5000);
    }
    mp.events.callRemote('server:user:buyLicense', type, price, month, typePay);
};

user.addHistory = function(type, reason) {
    mp.events.callRemote('server:user:addHistory', type, reason);
};

user.sendSms = function(sender, title, text, pic) {
    mp.events.callRemote('server:user:sendSms', sender, title, text, pic);
};

user.addMoney = function(money, text = 'Финансовая операция') {
    user.addCashMoney(money, text);
    //mp.events.callRemote('server:user:addMoney', money, text);
};

user.removeMoney = function(money, text = 'Финансовая операция') {
    user.removeCashMoney(money, text);
    //mp.events.callRemote('server:user:removeMoney', money, text);
};

user.setMoney = function(money) {
    user.setCashMoney(money);
    //mp.events.callRemote('server:user:setMoney', money);
};

user.getMoney = function() {
    return user.getCashMoney();
};

user.addBankMoney = function(money, text = "Операция со счетом") {
    user.setCache('money_bank', user.getBankMoney() + methods.parseFloat(money));
    mp.events.callRemote('server:user:addBankMoney', money, text);
};

user.removeBankMoney = function(money, text = "Операция со счетом") {
    user.setCache('money_bank', user.getBankMoney() - methods.parseFloat(money));
    mp.events.callRemote('server:user:removeBankMoney', money, text);
};

user.setBankMoney = function(money) {
    user.setCache('money_bank', methods.parseFloat(money));
    mp.events.callRemote('server:user:setBankMoney', money);
};

user.getBankMoney = function() {
    return methods.parseFloat(user.getCache('money_bank'));
};

user.addCashMoney = function(money, text = 'Финансовая операция') {
    user.setCache('money', user.getCashMoney() + methods.parseFloat(money));
    mp.events.callRemote('server:user:addCashMoney', money, text);
};

user.removeCashMoney = function(money, text = 'Финансовая операция') {
    user.setCache('money', user.getCashMoney() - methods.parseFloat(money));
    mp.events.callRemote('server:user:removeCashMoney', money, text);
};

user.setCashMoney = function(money) {
    user.setCache('money', methods.parseFloat(money));
    mp.events.callRemote('server:user:setCashMoney', money);
};

user.getCashMoney = function() {
    return methods.parseFloat(user.getCache('money'));
};

user.addCryptoMoney = function(money, text = "Операция со счетом") {
    user.setCache('money_crypto', user.getCryptoMoney() + methods.parseFloat(money));
    mp.events.callRemote('server:user:addCryptoMoney', money, text);
};

user.removeCryptoMoney = function(money, text = "Операция со счетом") {
    user.setCache('money_crypto', user.getCryptoMoney() - methods.parseFloat(money));
    mp.events.callRemote('server:user:removeCryptoMoney', money, text);
};

user.setCryptoMoney = function(money) {
    user.setCache('money_crypto', methods.parseFloat(money));
    mp.events.callRemote('server:user:setCryptoMoney', money);
};

user.getCryptoMoney = function() {
    return methods.parseFloat(user.getCache('money_crypto'));
};

user.addPayDayMoney = function(money, text = 'Финансовая операция') {
    user.setCache('money_payday', user.getPayDayMoney() + methods.parseFloat(money));
    mp.events.callRemote('server:user:addPayDayMoney', money, text);
};

user.removePayDayMoney = function(money, text = 'Финансовая операция') {
    user.setCache('money_payday', user.getPayDayMoney() - methods.parseFloat(money));
    mp.events.callRemote('server:user:removePayDayMoney', money, text);
};

user.setPayDayMoney = function(money) {
    user.setCache('money_payday', methods.parseFloat(money));
    mp.events.callRemote('server:user:setPayDayMoney', money);
};

user.getPayDayMoney = function() {
    return methods.parseFloat(user.getCache('money_payday'));
};

user.addBonusMoney = function(money) {
    mp.events.callRemote('server:user:addBonusMoney', money);
};

user.addRep = function(rep) {
    mp.events.callRemote('server:user:addRep', rep);
};

user.removeRep= function(rep) {
    mp.events.callRemote('server:user:removeRep', rep);
};

user.setRep = function(rep) {
    mp.events.callRemote('server:user:setRep', rep);
};

user.getRep= function() {
    return methods.parseInt(user.getCache('rep'));
};

user.addWorkExp = function(rep) {
    mp.events.callRemote('server:user:addWorkExp', rep);
};

user.removeWorkExp= function(rep) {
    mp.events.callRemote('server:user:removeWorkExp', rep);
};

user.setWorkExp = function(rep) {
    mp.events.callRemote('server:user:setWorkExp', rep);
};

user.getWorkLvl = function() {
    return methods.parseInt(user.getCache('work_lvl'));
};

user.getWorkExp= function() {
    return methods.parseInt(user.getCache('work_lvl'));
};

user.addGrabMoney = function(money) {
    user.setGrabMoney(user.getGrabMoney() + money);
};

user.removeGrabMoney = function(money) {
    user.setGrabMoney(user.getGrabMoney() - money);
};

user.setGrabMoney = function(money) {
    if (money > 0)
        user.setComponentVariation(5, 45, 0);
    else
        user.setComponentVariation(5, 0, 0);

    Container.Data.SetLocally(0, 'GrabMoney', money);
};

user.getGrabMoney = function() {
    return methods.parseFloat(Container.Data.GetLocally(0, 'GrabMoney'));
};

user.addDrugLevel = function(type, level) {
    user.setDrugLevel(type, user.getDrugLevel(type) + level);
};

user.removeDrugLevel = function(type, level) {
    user.setDrugLevel(type, user.getDrugLevel(type) - level);
};

user.setDrugLevel = function(type, level) {
    Container.Data.SetLocally(0, 'DrugLevel' + type, level);
};

user.getDrugLevel = function(type) {
    return methods.parseInt(Container.Data.GetLocally(0, 'DrugLevel' + type));
};

// Water Level
user.addWaterLevel = function(level) {
    if (user.getWaterLevel() + level > 1000) {
        user.setWaterLevel(1000);
        return true;
    }
    user.setWaterLevel(user.getWaterLevel() + level);
    return true
};

user.removeWaterLevel = function(level) {
    if (user.getWaterLevel() - level < 0) {
        user.setWaterLevel(0);
        return true;
    }
    user.setWaterLevel(user.getWaterLevel() - level);
    return true;
};

user.setWaterLevel = function(level) {
    user.set("water_level", level);
    return true;
};

user.getWaterLevel = function() {
    return user.getCache("water_level");
};

// Eat Level
user.addEatLevel = function(level) {
    if (user.getEatLevel() + level > 1000) {
        user.setEatLevel(1000);
        return true;
    }
    user.setEatLevel(user.getEatLevel() + level);
    return true
};

user.removeEatLevel = function(level) {
    if (user.getEatLevel() - level < 0) {
        user.setEatLevel(0);
        return true;
    }
    user.setEatLevel(user.getEatLevel() - level);
    return true;
};

user.setEatLevel = function(level) {
    user.set("eat_level", level);
    return true;
};

user.getEatLevel = function() {
    return user.getCache("eat_level");
};

user.isLogin = function(){
    return _isLogin;
};

user.setLogin = function(value){
    _isLogin = value;
};

user.isInOcean = function() {
    let pos = mp.players.local.position;
    return (mp.game.zone.getNameOfZone(pos.x, pos.y, pos.z) === "OCEANA");
};

user.isCanFishingPearceOcean = function() {
    let pos = mp.players.local.position;
    if (methods.distanceToPos(pos, new mp.Vector3(-1612.2333984375, 5262.416015625, 2.9741017818450928)) < 10)
        return true;
    return false;
};

user.isCanFishingPearceAlamo = function() {
    let pos = mp.players.local.position;
    if (
        methods.distanceToPos(pos, new mp.Vector3(1299.1312255859375, 4216.794921875, 32.90868377685547)) < 10 ||
        methods.distanceToPos(pos, new mp.Vector3(1315.7747802734375, 4229.9892578125, 32.915531158447266)) < 7 ||
        methods.distanceToPos(pos, new mp.Vector3(1337.7982177734375, 4225.47119140625, 32.915531158447266)) < 7 ||
        methods.distanceToPos(pos, new mp.Vector3(1326.87109375, 4227.64599609375, 32.915531158447266)) < 7
    )
        return true;
    return false;
};

user.isCanFishing = function() {
    return user.isInOcean() || mp.players.local.isInWater() || user.isCanFishingPearceOcean() || user.isCanFishingPearceAlamo();
};

user.isJobMail = function() {
    return user.isLogin() && user.getCache('job') == 4;
};

user.isJobGr6 = function() {
    return user.isLogin() && user.getCache('job') == 10;
};

user.giveWanted = function(level, reason) {
    mp.events.callRemote('server:user:giveMeWanted', level, reason);
};

user.giveTicket = function(price, reason) {
    mp.events.callRemote('server:user:giveTicket', user.getCache('id'), price, reason);
};

user.getRegStatusName = function() {
    switch (user.getCache('reg_status'))
    {
        case 1:
            return "Регистрация";
        case 2:
            return "Гражданство США";
        default:
            return "Нет";
    }
};

user.getRepName = function() {
    let rep = user.getCache('rep');
    if (rep > 900)
        return 'Идеальная';
    if (rep > 800 && rep <= 900)
        return 'Очень хорошая';
    if (rep > 700 && rep <= 800)
        return 'Хорошая';
    if (rep > 600 && rep <= 700)
        return 'Положительная';
    if (rep >= 400 && rep <= 600)
        return 'Нейтральная';
    if (rep >= 300 && rep < 400)
        return 'Отрицательная';
    if (rep >= 200 && rep < 300)
        return 'Плохая';
    if (rep >= 100 && rep < 200)
        return 'Очень плохая';
    if (rep < 100)
        return 'Наихудшая';
};

user.getRepColorName = function() {
    let rep = user.getCache('rep');
    if (rep > 900)
        return '~b~Идеальная';
    if (rep > 800 && rep <= 900)
        return '~g~Очень хорошая';
    if (rep > 700 && rep <= 800)
        return '~g~Хорошая';
    if (rep > 600 && rep <= 700)
        return '~g~Положительная';
    if (rep >= 400 && rep <= 600)
        return 'Нейтральная';
    if (rep >= 300 && rep < 400)
        return '~y~Отрицательная';
    if (rep >= 200 && rep < 300)
        return '~o~Плохая';
    if (rep >= 100 && rep < 200)
        return '~o~Очень плохая';
    if (rep < 100)
        return '~r~Наихудшая';
};

user.giveVehicle = function(vName, withDelete = 1, withChat = false, desc = '', isBroke = false) {
    mp.events.callRemote('server:user:giveVehicle', vName, withDelete, withChat, desc, isBroke);
};

user.giveRandomMask = function() {
    mp.events.callRemote('server:user:giveRandomMask');
};

user.giveJobSkill = function(name = '') {
    mp.events.callRemote('server:user:giveJobSkill', name);
};

user.giveJobMoney = async function(money, jobId = 0) {

    if (await user.hasById('uniform')) {
        mp.game.ui.notifications.show('~r~Нельзя работать в форме');
        return;
    }

    let desc = '';
    try {
        let jobItem = enums.jobList[user.getCache('job')];
        if (jobId > 0)
            jobItem = enums.jobList[jobId];
        if (jobItem[5] > 0 && user.getCache('job_' + jobItem[4]) > 0) {
            money = money * (1 + user.getCache('job_' + jobItem[4]) / jobItem[5]);
            desc = `'\n~y~Прибавка ${methods.parseFloat((user.getCache('job_' + jobItem[4]) / jobItem[5]) * 100).toFixed(2)}% от зарплаты за прокаченный навык';`
        }
    }
    catch (e) {}

    if (user.getCache('vip_type') === 1) {
        desc = '\n~y~Прибавка VIP LIGHT 5% от зарплаты';
        money = money * 1.05;
    }
    if (user.getCache('vip_type') === 2) {
        desc = '\n~y~Прибавка VIP HARD 10% от зарплаты';
        money = money * 1.1;
    }

    quest.standart(false, -1, 3);

    if (user.getCache('bank_card') == 0) {
        user.addCashMoney(money, 'Зарплата');
        mp.game.ui.notifications.show('~y~Оформите банковскую карту' + desc);
    }
    else {
        user.addBankMoney(money, 'Зарплата');
        user.sendSmsBankOperation(`Зачисление средств: ~g~${methods.moneyFormat(money)}${desc}`);
    }
};

user.getFractionName = function() {
    if (!user.isLogin())
        return false;
    return enums.fractionListId[user.getCache( 'fraction_id')].fractionNameShort;
};

user.getFractionNameL = function() {
    if (!user.isLogin())
        return false;
    return enums.fractionListId[user.getCache( 'fraction_id')].fractionName;
};

user.getDepartmentName = function() {
    try {
        if (!user.isLogin())
            return 'Отсуствует';
        if (user.getCache('is_leader'))
            return 'Руководство';
        else if (user.getCache('is_sub_leader'))
            return 'Руководство';
        return enums.fractionListId[user.getCache('fraction_id')].departmentList[user.getCache('rank_type')];
    }
    catch (e) {
        methods.debug(e);
    }
    return 'Отсуствует';
};

user.getRankName = function() {
    try {
        if (!user.isLogin())
            return 'Отсуствует';
        if (user.getCache('is_leader'))
            return enums.fractionListId[user.getCache('fraction_id')].leaderName;
        else if (user.getCache('is_sub_leader'))
            return enums.fractionListId[user.getCache('fraction_id')].subLeaderName;
        return enums.fractionListId[user.getCache('fraction_id')].rankList[user.getCache('rank_type')][user.getCache('rank')];
    }
    catch (e) {
        methods.debug(e);
    }
    return 'Отсуствует';
};


user.sendSmsBankOperation = function(text, title = 'Операция со счётом') {
    methods.debug('bank.sendSmsBankOperation');
    if (!user.isLogin())
        return;

    let prefix = user.getBankCardPrefix();

    try {
        switch (prefix) {
            case 6000:
                user.sendPhoneNotify('~r~Maze Bank', '~g~' + title, text, 'CHAR_BANK_MAZE', 2);
                break;
            case 7000:
                user.sendPhoneNotify('~o~Pacific Bank', '~g~' + title, text, 'CHAR_STEVE_MIKE_CONF', 2);
                break;
            case 8000:
                user.sendPhoneNotify('~g~Fleeca Bank', '~g~' + title, text, 'CHAR_BANK_FLEECA', 2);
                break;
            case 9000:
                user.sendPhoneNotify('~b~Blaine Bank', '~g~' + title, text, 'CHAR_STEVE_TREV_CONF', 2);
                break;
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

user.getBankCardPrefix = function(bankCard = 0) {
    methods.debug('bank.getBankCardPrefix');
    if (!user.isLogin())
        return;

    if (bankCard == 0)
        bankCard = user.getCache('bank_card');

    return methods.parseInt(bankCard.toString().substring(0, 4));
};

user.playAnimationWithUser = function(toId, animType) {
    if (mp.players.local.getVariable("isBlockAnimation") || mp.players.local.isInAnyVehicle(false) || user.isDead()) return;
    mp.events.callRemote('server:playAnimationWithUser', toId, animType);
};

user.lastAnim = {
    a: '',
    d: '',
    f: 0,
};
let lastFlag = 0;
user.playAnimation = function(dict, anim, flag = 49, sendEventToServer = true) {
    if (mp.players.local.getVariable("isBlockAnimation") || mp.players.local.isInAnyVehicle(false) || user.isDead()) return;
    lastFlag = flag;

    mp.events.callRemote('server:playAnimation', dict, anim, methods.parseInt(flag));
    user.lastAnim.d = dict;
    user.lastAnim.a = anim;
    user.lastAnim.f = flag;
    /*
        8 = нормально играть
        9 = цикл
        48 = нормально играть только верхнюю часть тела
        49 = цикл только верхняя часть тела
    */
};


user.getLastFlag = function() {
    return lastFlag;
};

user.setRagdoll = function(timeout = 1000) {
    if (mp.players.local.getVariable("isBlockAnimation") || mp.players.local.isInAnyVehicle(false) || user.isDead()) return;
    mp.events.callRemote('server:setRagdoll', timeout);
};

user.stopAllAnimation = function() {

    if (methods.isBlockKeys())
        return;

    if (mp.game.player.isFreeAiming()) {
        return;
    }

    if (currentScenario !== '') {
        enums.scenariosAll.forEach(function (item, i, arr) {
            mp.attachmentMngr.removeLocal(item[1]);
        });
        currentScenario = '';
    }

    if (!mp.players.local.getVariable("isBlockAnimation")) {
        //mp.players.local.clearTasks();
        //mp.players.local.clearSecondaryTask();
        mp.events.callRemote('server:stopAllAnimation');
    }
};

user.playScenario = async function(name) {
    //mp.events.callRemote('server:playScenario', name);

    if (mp.players.local.getVariable("isBlockAnimation") || mp.players.local.isInAnyVehicle(false) || user.isDead()) return;

    if (currentScenario !== '') {
        mp.attachmentMngr.removeLocal(currentScenario);
        currentScenario = '';
    }

    try {
        let scenario = enums.scenarioList[name];
        if (scenario) {
            currentScenario = name;

            if (scenario.attachObject)
                mp.attachmentMngr.addLocal(currentScenario);

            let isLoop = false;

            for (let i = 0; i < scenario.animationList.length; i++) {

                if (currentScenario !== name)
                    return;

                let item = scenario.animationList[i];
                user.playAnimation(item[0], item[1], item[2] + 100);

                if (item[2] !== 9 && item[2] !== 49)
                {
                    await methods.sleep(200);
                    await methods.sleep(mp.players.local.getAnimTotalTime(item[0], item[1]) - 200);
                }
                else
                    isLoop = true;
            }

            if (!isLoop) {
                currentScenario = '';
                mp.attachmentMngr.removeLocal(currentScenario);
            }

        }
    }
    catch (e) {
        
    }
};

user.stopScenario = function() {
    //mp.events.callRemote('server:stopScenario');
    //mp.players.local.clearTasks();

    //str.substr(1, 2)
    user.stopAllAnimation();
};

let isOpenPhone = false;

user.openPhone = function(type) {
    user.playAnimation("cellphone@female", "cellphone_text_read_base", 49);
    mp.attachmentMngr.addLocal('phone' + type);
    isOpenPhone = true;
    user.setCurrentWeapon('weapon_unarmed');
};

user.rotatePhoneV = function() {
    user.playAnimation("cellphone@female", "cellphone_text_read_base", 49);
};

user.rotatePhoneH = function() {
    user.playAnimation("cellphone@in_car@ds@first_person", "cellphone_horizontal_base", 49);
};

user.callPhone = function() {
    user.playAnimation("cellphone@female", "cellphone_call_listen_base", 49);
};

user.isOpenPhone = function() {
    return isOpenPhone;
};

user.hidePhone = function() {
    mp.attachmentMngr.removeLocal('phone1');
    mp.attachmentMngr.removeLocal('phone2');
    mp.attachmentMngr.removeLocal('phone3');
    //user.playAnimation("cellphone@female", "cellphone_text_out", 48);
    user.stopAllAnimation();
    isOpenPhone = false;
};

/*
* StyleType
* 0 = Info
* 1 = Warn
* 2 = Success
* 3 = White
*
* ['top', 'topLeft', 'topCenter', 'topRight', 'center', 'centerLeft', 'centerRight', 'bottom', 'bottomLeft', 'bottomCenter', 'bottomRight'];
*
* */
user.showCustomNotify = function(text, style = 0, layout = 5, time = 5000) {
    mp.game.audio.playSoundFrontend(-1, "Boss_Blipped", "GTAO_Magnate_Hunt_Boss_SoundSet", false);
    ui.callCef('notify', JSON.stringify({type: style, layout: layout, text: text, time: time}));
};

user.playSound = function(name, ref) {
    mp.game.audio.playSoundFrontend(-1, name, ref, false);
};

user.isDead = function() {
    return mp.players.local.getHealth() <= 0;
};

user.isAdmin = function(level = 1) {
    return user.getCache('admin_level') >= level;
};

user.isAdminRp = function() {
    return user.getCache('status_rp') > 0;
};

user.isHelper = function(level = 1) {
    return user.getCache('helper_level') >= level;
};

user.isGos = function() {
    return user.isLogin() && (user.isSapd() || user.isFib() || user.isUsmc() || user.isGov() || user.isEms() || user.isSheriff());
};

user.isPolice = function() {
    return user.isLogin() && (user.isSapd() || user.isFib() || user.isUsmc() || user.isSheriff());
};

user.isCosaNostra = function() {
    return user.isLogin() && user.getCache('fraction_id2') === 17; //TODO
};

user.isRussianMafia = function() {
    return user.isLogin() && user.getCache('fraction_id2') === 16;
};

user.isYakuza = function() {
    return user.isLogin() && user.getCache('fraction_id2') === 18;
};

user.isMafia = function() {
    return user.isLogin() && (user.isCosaNostra() || user.isRussianMafia() || user.isYakuza());
};

user.isGov = function() {
    return user.isLogin() && user.getCache('fraction_id') == 1;
};

user.isSapd = function() {
    return user.isLogin() && user.getCache('fraction_id') == 2;
};

user.isFib = function() {
    return user.isLogin() && user.getCache('fraction_id') == 3;
};

user.isUsmc = function() {
    return user.isLogin() && user.getCache('fraction_id') == 4;
};

user.isSheriff = function() {
    return user.isLogin() && user.getCache('fraction_id') == 5;
};

user.isEms = function() {
    return user.isLogin() && user.getCache('fraction_id') == 6;
};

user.isNews = function() {
    return user.isLogin() && user.getCache('fraction_id') == 7;
};

user.isCartel = function() {
    return user.isLogin() && user.getCache('fraction_id') == 8;
};

user.isLeader = function() {
    return user.isLogin() && user.getCache('is_leader');
};

user.isSubLeader = function() {
    return user.isLogin() && user.getCache('is_sub_leader');
};

user.isDepLeader = function() {
    return user.isLogin() && user.getCache('fraction_id') > 0 && user.getCache('rank') === 0;
};

user.isDepSubLeader = function() {
    return user.isLogin() && user.getCache('fraction_id') > 0 && user.getCache('rank') === 1;
};

user.isLeader2 = function() {
    return user.isLogin() && user.getCache('is_leader2');
};

user.isSubLeader2 = function() {
    return user.isLogin() && user.getCache('is_sub_leader2');
};

user.isDepLeader2 = function() {
    return user.isLogin() && user.getCache('fraction_id2') > 0 && user.getCache('rank2') === 0;
};

user.isDepSubLeader2 = function() {
    return user.isLogin() && user.getCache('fraction_id2') > 0 && user.getCache('rank2') === 1;
};

user.isLeaderF = function() {
    return user.isLogin() && user.getCache('is_leaderf');
};

user.isSubLeaderF = function() {
    return user.isLogin() && user.getCache('is_sub_leaderf');
};

user.isDepLeaderF = function() {
    return user.isLogin() && user.getCache('family_id') > 0 && user.getCache('rankf') === 0;
};

user.isDepSubLeaderF = function() {
    return user.isLogin() && user.getCache('family_id') > 0 && user.getCache('rankf') === 1;
};

user.cuff = function() {
    mp.events.callRemote('server:user:cuff');
};

user.unCuff = function() {
    mp.events.callRemote('server:user:unCuff');
};

user.isCuff = function() {
    return mp.players.local.getVariable('isCuff') === true;
};

user.tie = function() {
    mp.events.callRemote('server:user:tie');
};

user.unTie = function() {
    mp.events.callRemote('server:user:unTie');
};

user.isTie = function() {
    return mp.players.local.getVariable('isTie') === true;
};

user.isKnockout = function() {
    return mp.players.local.getVariable('isKnockout') === true;
};

user.getHouseData = function() {
    if (user.getCache('house_id') > 0)
        return houses.getData(user.getCache('house_id'));
    return null;
};

user.getCondoData = async function() {
    if (user.getCache('condo_id') > 0)
        return await condos.getData(user.getCache('condo_id'));
    return null;
};

user.getYachtData = async function() {
    if (user.getCache('yacht_id') > 0)
        return await yachts.getData(user.getCache('yacht_id'));
    return null;
};

user.getBusinessData = async function() {
    if (user.getCache('business_id') > 0)
        return await business.getData(user.getCache('business_id'));
    return null;
};

user.getStockData = async function() {
    if (user.getCache('stock_id') > 0)
        return await stocks.getData(user.getCache('stock_id'));
    return null;
};

user.getCarsData = async function() {
    let cars = [];
    for (let i = 1; i < 11; i++) {
        if (user.getCache('car_id' + i) > 0)
            cars.push(await vehicles.getData(user.getCache('car_id' + i)));
    }
    return cars;
};

user.getQuest = function(name) {
    try {
        let questList = user.getQuestAll();
        let qItem = questList[name];
        if (qItem == null || qItem == undefined || Object.keys(qItem).length === 0) {
            user.setQuest(name, 0, []);
            return {c: 0, p: []};
        }
        return qItem;
    }
    catch (e) {
        methods.debug('user.getQuest', name, e.toString())
    }
    return {c: 0, p: []};
};

user.getQuestAll = function() {
    try {
        let questsJson = user.getCache('quests');
        if (!methods.isValidJSON(questsJson) || questsJson === null || questsJson === undefined || questsJson === "{}")
            return user.resetQuestAll();
        return JSON.parse(questsJson);
    }
    catch (e) {
        methods.debug('user.getQuestAll', e);
    }
    return user.resetQuestAll();
};

user.resetQuestAll = function() {
    let quests = {};
    quest.getQuestAllNames().forEach(name => {
        try {
            quests[name] = {c: 0, p: []};
        }
        catch (e) {
            methods.debug('user.getQuestAll', e.toString())
        }
    });
    user.set('quests', JSON.stringify(quests));
    return quests;
};

user.getQuestCount = function(name) {
    try {
        return methods.parseInt(user.getQuest(name).c);
    }
    catch (e) {
        methods.debug('user.getQuestCount', name, e.toString())
    }
    return 0;
};

user.getQuestParams = function(name) {
    try {
        return user.getQuest(name).p;
    }
    catch (e) {
        methods.debug('user.getQuestParams', name, e.toString())
    }
    return [];
};

user.setQuest = function(name, num, params = null) {
    try {
        let qAll = user.getQuestAll();
        let qItem = qAll[name];
        if (qItem == null || qItem == undefined || Object.keys(qItem).length === 0)
            qItem = {c: 0, p: []};
        qItem.c = num;
        if (params)
            qItem.p = params;
        qAll[name] = qItem;
        user.set('quests', JSON.stringify(qAll));
    } catch (e) {
        methods.debug('user.setQuest', e.toString());
    }
};

mp.events.add("render", () => {
    try {
        if (!mp.gui.cursor.visible || !cameraRotator.isActive || cameraRotator.isPause) {
            return;
        }

        const x = mp.game.controls.getDisabledControlNormal(2, 239);
        const y = mp.game.controls.getDisabledControlNormal(2, 240);

        const su = mp.game.controls.getDisabledControlNormal(2, 241);
        const sd = mp.game.controls.getDisabledControlNormal(2, 242);

        if (cameraRotator.isPointEmpty()) {
            cameraRotator.setPoint(x, y);
        }

        const currentPoint = cameraRotator.getPoint();
        const dX = currentPoint.x - x;
        const dY = currentPoint.y - y;

        //ui.drawText(`${currentPoint.x.toFixed(2)} | ${currentPoint.y.toFixed(2)} | ${x.toFixed(2)} | ${y.toFixed(2)} | ${cameraRotator.isPointEmpty()}`, 0, 0, 1, 255,255,255, 255,1);

        if (x > user.camOffsetLeft && x < user.camOffsetRight) {
            cameraRotator.setPoint(x, y);

            if (mp.game.controls.isDisabledControlPressed(2, user.btnCamera)) {
                cameraRotator.onMouseMove(dX, dY);
            }

            cameraRotator.onMouseScroll(su, sd);
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

export default user;