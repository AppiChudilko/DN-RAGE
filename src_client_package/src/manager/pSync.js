import methods from "../modules/methods";

import Container from "../modules/data";

import user from "../user";

let pSync = {};

pSync.animFreezer = function() {

    let plList = [mp.players.local].concat(methods.getStreamPlayerList());
    plList.forEach(p => {
        if (mp.players.exists(p) && Container.Data.HasLocally(p.remoteId, 'hasSeat')) {
            p.freezePosition(true);
        }
    });

    setTimeout(pSync.animFreezer, 100);
};

mp.events.add('entityStreamIn', (entity) => {
    if (entity.type === 'player') {
        let remotePlayer = entity;
        if (mp.players.exists(remotePlayer)) {

            /*if (remotePlayer.getVariable('blockDeath')) {
                remotePlayer.blip = mp.game.invoke(methods.ADD_BLIP_FOR_ENTITY, remotePlayer.handle);
                mp.game.invoke(methods.SET_BLIP_SPRITE, 1);
            }*/

            remotePlayer.setVisible(remotePlayer.getAlpha() > 0, false);

            for(let i = 0; i < 8; i++) {
                try {
                    let propType = remotePlayer.getVariable('propType' + i);
                    let propColor = remotePlayer.getVariable('propColor' + i);

                    if (propType >= 0)
                        remotePlayer.setPropIndex(i, propType, propColor, true);
                    else
                        remotePlayer.clearProp(i);
                }
                catch (e) {
                    methods.debug(e);
                }
            }

            try {
                let topsDraw = remotePlayer.getVariable('topsDraw');
                let topsColor = remotePlayer.getVariable('topsColor');
                remotePlayer.setComponentVariation(11, topsDraw, topsColor, 2);
            }
            catch (e) {
                methods.debug(e);
            }
        }
    }
});

/*mp.events.add('entityStreamOut', (entity) => {
    if (entity.type === 'player') {
        let remotePlayer = entity;
        if (mp.players.exists(remotePlayer)) {
            try {
                if (remotePlayer.blip)
                {
                    mp.game.ui.removeBlip(methods.parseInt(remotePlayer.blip));
                    remotePlayer.blip = null;
                }
            }
            catch (e) {}
        }
    }
});*/

mp.events.add('client:syncComponentVariation', (playerId, component, drawableId, textureId) => {
    try {
        let remotePlayer = mp.players.atRemoteId(playerId);
        if (remotePlayer && mp.players.exists(remotePlayer)) {
            remotePlayer.setComponentVariation(component, drawableId, textureId, 2);
        }
    }
    catch (e) {
        methods.debug('Exception: client:syncComponentVariation');
        methods.debug(e);
    }
});

mp.events.add('client:syncTaskEnter', (playerId, vehRemoteId, seat) => {
    setTimeout(function () {
        try {
            let remotePlayer = mp.players.atRemoteId(playerId);
            let vehicle = mp.vehicles.atRemoteId(vehRemoteId);
            if (remotePlayer && mp.players.exists(remotePlayer) && vehicle && mp.vehicles.exists(vehicle)) {
                remotePlayer.clearTasks();
                remotePlayer.taskEnterVehicle(vehicle.handle, 5000, seat, 2, 1, 0);
            }
        }
        catch (e) {
            methods.debug('Exception: client:syncTaskEnter');
            methods.debug(e);
        }
    }, 100)
});

mp.events.add('client:pSync:alpha', (playerId, alpha) => {
    try {
        let remotePlayer = mp.players.atRemoteId(playerId);
        if (remotePlayer && mp.players.exists(remotePlayer)) {
            remotePlayer.setVisible(alpha > 0, false);
        }
    }
    catch (e) {
        methods.debug('Exception: client:pSync:alpha');
        methods.debug(e);
    }
});

mp.events.add('client:pSync:shoot', (playerId) => {
    try {
        let remotePlayer = mp.players.atRemoteId(playerId);
        if (remotePlayer && mp.players.exists(remotePlayer)) {
            remotePlayer.setShootsAtCoord(0, 0, 0, true);
        }
    }
    catch (e) {
        methods.debug('Exception: client:pSync:shoot');
        methods.debug(e);
    }
});

mp.events.add("entityStreamIn", (entity) => {
    try {
        if (entity.type !== "player") return;
        setClipSet(entity, entity.getVariable("walkingStyle"));
        setClipSetW(entity, entity.getVariable("walkingStyleW"));
    }
    catch (e) {
        
    }
});

mp.events.addDataHandler("walkingStyle", (entity, value) => {
    try {
        if (entity.type === "player")
            setClipSet(entity, value);
    }
    catch (e) {
        
    }
});

mp.events.addDataHandler("walkingStyleW", (entity, value) => {
    try {
        if (entity.type === "player")
            setClipSetW(entity, value);
    }
    catch (e) {

    }
});

mp.events.add('client:syncAnimation', async (playerId, dict, anim, flag) => {
    //if (mp.players.local.remoteId == playerId || mp.players.local.id == playerId)
    try {
        let remotePlayer = mp.players.atRemoteId(playerId);
        if (remotePlayer && mp.players.exists(remotePlayer)) {

            if (remotePlayer.vehicle && dict != 'cellphone@female')
                return;
            if (remotePlayer === mp.players.local && dict == 'dead')
                return;

            let isScenario = false;
            if (flag >= 50) {
                isScenario = true;
                flag = flag - 100;
            }

            if (remotePlayer === mp.players.local)
                remotePlayer = mp.players.local;
            else {
                remotePlayer.setAsMission(false, true);
                /*if (flag == 8 || flag == 9)
                    flag = 32;*/
                /*if (flag == 8)
                    flag = 0;*/
                if (flag == 8)
                    flag = 32;
                if (flag == 9)
                    flag = 1;
            }

            methods.debug('Execute: client:syncAnimation:' + flag);

            remotePlayer.clearTasks();
            //remotePlayer.clearTasksImmediately();
            //remotePlayer.clearSecondaryTask();

            remotePlayer.lastFlag = flag;

            if (dict == 'amb@prop_human_seat_chair@male@generic@base' ||
                dict == 'amb@prop_human_seat_chair@male@right_foot_out@base' ||
                dict == 'amb@prop_human_seat_chair@male@left_elbow_on_knee@base' ||
                dict == 'amb@prop_human_seat_chair@male@elbows_on_knees@base' ||
                dict == 'anim@amb@yacht@jacuzzi@seated@male@variation_01@' ||
                dict == 'anim@amb@office@seating@male@var_e@base@' ||
                dict == 'anim@amb@office@seating@male@var_d@base@' ||
                dict == 'anim@amb@office@seating@female@var_d@base@' ||
                dict == 'anim@amb@office@seating@female@var_c@base@' ||
                dict == 'anim@amb@facility@briefing_room@seating@male@var_e@' ||
                dict == 'anim@amb@office@boardroom@crew@male@var_c@base_r@' ||
                dict == 'amb@world_human_seat_steps@male@hands_in_lap@base' ||
                dict == 'amb@prop_human_seat_sunlounger@male@base' ||
                dict == 'amb@world_human_seat_steps@male@elbows_on_knees@base' ||
                dict == 'anim@amb@clubhouse@seating@male@var_c@base@'
            )
            {
                remotePlayer.freezePosition(true);
                remotePlayer.setCollision(false, false);

                if (!Container.Data.HasLocally(remotePlayer.remoteId, 'hasSeat'))
                    remotePlayer.position = new mp.Vector3(remotePlayer.position.x, remotePlayer.position.y, remotePlayer.position.z - 0.95);
                Container.Data.SetLocally(remotePlayer.remoteId, 'hasSeat', true);
            }

            mp.game.streaming.requestAnimDict(dict);

            if (!mp.game.streaming.hasAnimDictLoaded(dict)) {
                mp.game.streaming.requestAnimDict(dict);
                while (!mp.game.streaming.hasAnimDictLoaded(dict))
                    await methods.sleep(10);
            }

            //remotePlayer.taskPlayAnim(dict, anim, 8, 0, -1, flag, 0.0, false, false, false);

            if (flag != 1 && flag != 9/* && flag != 49*/) {

                remotePlayer.taskPlayAnim(dict, anim, 8, -8, -1, flag, 0.0, false, false, false);
                /*if (remotePlayer.remoteId === mp.players.local.remoteId) {
                    await methods.sleep(20);
                    await methods.sleep(remotePlayer.getAnimTotalTime(dict, anim));
                    if (remotePlayer.getHealth() > 0)
                        user.stopAllAnimation();
                }*/
            }
            else {
                remotePlayer.taskPlayAnim(dict, anim, 8, 0, -1, flag, 0.0, false, false, false);
            }
        }
    }
    catch (e) {
        methods.debug('Exception: client:syncAnimation');
        methods.debug(e);
    }
});

mp.events.add('client:syncStopAnimation', (playerId) => {
    //if (mp.players.local.remoteId == playerId || mp.players.local.id == playerId)
    try {
        methods.debug('client:syncStopAnimation', playerId);
        let remotePlayer = mp.players.atRemoteId(playerId);
        if (remotePlayer && mp.players.exists(remotePlayer)) {
            remotePlayer.clearTasks();

            if (Container.Data.HasLocally(remotePlayer.remoteId, 'hasSeat')) {
                remotePlayer.freezePosition(false);
                remotePlayer.setCollision(true, true);
                remotePlayer.position = new mp.Vector3(remotePlayer.position.x, remotePlayer.position.y, remotePlayer.position.z + 0.95);
                Container.Data.ResetLocally(remotePlayer.remoteId, 'hasSeat');
            }

            if (remotePlayer.isInAir() ||
                remotePlayer.isReloading() ||
                remotePlayer.isRagdoll() ||
                remotePlayer.isFalling() ||
                remotePlayer.isShooting() ||
                //remotePlayer.isSprinting() ||
                remotePlayer.isGettingUp() ||
                remotePlayer.vehicle ||
                remotePlayer.getHealth() <= 0
            )
                return;

            if (!remotePlayer.isInAir() && !remotePlayer.vehicle && remotePlayer.getHealth() > 0) {
                if (remotePlayer.lastFlag === 1 || remotePlayer.lastFlag === 9)
                    remotePlayer.clearTasksImmediately();
            }
        }
    }
    catch (e) {
        methods.debug('Exception: client:syncAnimation');
        methods.debug(e);
    }
});

mp.events.add('client:syncStopAnimationNow', (playerId) => {
    //if (mp.players.local.remoteId == playerId || mp.players.local.id == playerId)
    try {
        methods.debug('client:syncStopAnimationNow', playerId);
        let remotePlayer = mp.players.atRemoteId(playerId);
        if (remotePlayer && mp.players.exists(remotePlayer)) {

            if (Container.Data.HasLocally(remotePlayer.remoteId, 'hasSeat')) {
                remotePlayer.freezePosition(false);
                remotePlayer.setCollision(true, true);
                remotePlayer.position = new mp.Vector3(remotePlayer.position.x, remotePlayer.position.y, remotePlayer.position.z + 0.95);
                Container.Data.ResetLocally(remotePlayer.remoteId, 'hasSeat');
            }

            remotePlayer.clearTasks();
            remotePlayer.clearTasksImmediately();
        }
    }
    catch (e) {
        methods.debug('Exception: client:syncStopAnimationNow');
        methods.debug(e);
    }
});

mp.events.add('client:syncRagdoll', (playerId, timeout) => {
    //if (mp.players.local.remoteId == playerId || mp.players.local.id == playerId)
    try {
        methods.debug('client:syncStopAnimation', playerId);
        let remotePlayer = mp.players.atRemoteId(playerId);
        if (remotePlayer && mp.players.exists(remotePlayer)) {
            remotePlayer.setCanRagdoll(true);
            remotePlayer.setToRagdoll(timeout, timeout, 0, false, false, false);
        }
    }
    catch (e) {
        methods.debug('Exception: client:syncRagdoll');
        methods.debug(e);
    }
});

mp.events.add('client:syncScenario', (playerId, name) => {
    //if (mp.players.local.remoteId == playerId || mp.players.local.id == playerId)
    try {
        methods.debug('Execute: events:client:syncScenario');
        let remotePlayer = mp.players.atRemoteId(playerId);
        if (remotePlayer && mp.players.exists(remotePlayer)) {

            if (remotePlayer === mp.players.local)
                remotePlayer = mp.players.local;
            else
                remotePlayer.setAsMission(false, true);

            remotePlayer.clearTasks();
            remotePlayer.clearTasksImmediately();

            if (name == 'PROP_HUMAN_SEAT_BENCH') {
                let pos = remotePlayer.getOffsetFromInWorldCoords(0, -0.5, -0.5);
                let heading = remotePlayer.getRotation(0).z;
                remotePlayer.taskStartScenarioAtPosition(name, pos.x, pos.y, pos.z, heading, -1, true, false);
            }
            else {
                remotePlayer.taskStartScenarioInPlace(name, 0, true);
            }
        }
    }
    catch (e) {
        methods.debug('Exception: events:client:syncScenario');
        methods.debug(e);
    }
});

mp.events.add('client:syncStopScenario', (playerId) => {
    //if (mp.players.local.remoteId == playerId || mp.players.local.id == playerId)
    try {
        methods.debug('Execute: events:client:syncScenario');
        let remotePlayer = mp.players.atRemoteId(playerId);
        if (remotePlayer && mp.players.exists(remotePlayer)) {
            remotePlayer.clearTasks();
        }
    }
    catch (e) {
        methods.debug('Exception: events:client:syncScenario');
        methods.debug(e);
    }
});

mp.events.add('client:syncHeadingToCoord', (playerId, x, y, z) => {
    //if (mp.players.local.remoteId == playerId || mp.players.local.id == playerId)
    try {
        let remotePlayer = mp.players.atRemoteId(playerId);
        if (remotePlayer && mp.players.exists(remotePlayer)) {

            if (remotePlayer.vehicle)
                return;

            if (remotePlayer === mp.players.local)
                remotePlayer = mp.players.local;

            methods.debug('Execute: events:client:syncHeadingToCoord');

            remotePlayer.clearTasks();
            remotePlayer.taskTurnToFaceCoord(x, y, z, -1);

            setTimeout(function () {
                try {
                    remotePlayer.clearTasks();
                }
                catch (e) {
                    methods.debug(e);
                }
            }, 2000);
        }
    }
    catch (e) {
        methods.debug('Exception: events:client:syncHeadingToCoord');
        methods.debug(e);
    }
});

mp.events.add('client:syncHeading', (playerId, rot) => {
    //if (mp.players.local.remoteId == playerId || mp.players.local.id == playerId)
    try {
        let remotePlayer = mp.players.atRemoteId(playerId);
        if (remotePlayer && mp.players.exists(remotePlayer)) {

            if (remotePlayer.vehicle)
                return;

            if (remotePlayer === mp.players.local)
                remotePlayer = mp.players.local;

            methods.debug('Execute: events:client:syncHeading');
            remotePlayer.setRotation(0, 0, rot, 0, true);
        }
    }
    catch (e) {
        methods.debug('Exception: events:client:syncHeadingToCoord');
        methods.debug(e);
    }
});

mp.events.add('client:syncHeadingToTarget', (playerId, targetId) => {
    //if (mp.players.local.remoteId == playerId || mp.players.local.id == playerId)
    try {
        let remotePlayer = mp.players.atRemoteId(playerId);
        let targetPlayer = mp.players.atRemoteId(targetId);
        if (remotePlayer && mp.players.exists(remotePlayer) && targetPlayer && mp.players.exists(targetPlayer)) {

            if (remotePlayer.vehicle)
                return;

            if (remotePlayer === mp.players.local)
                remotePlayer = mp.players.local;

            methods.debug('Execute: events:client:syncHeadingToTarget');

            remotePlayer.clearTasks();
            remotePlayer.taskTurnToFace(targetPlayer.handle, -1);

            setTimeout(function () {
                try {
                    remotePlayer.clearTasks();
                }
                catch (e) {
                    methods.debug(e);
                }
            }, 2000);
        }
    }
    catch (e) {
        methods.debug('Exception: events:client:syncHeadingToTarget');
        methods.debug(e);
    }
});

//Fingerpointing
pSync.pointing =
{
    active: false,
    interval: null,
    lastSent: 0,
    start: async function () {
        if (!this.active) {
            try {
                this.active = true;

                mp.game.streaming.requestAnimDict("anim@mp_point");
                while (!mp.game.streaming.hasAnimDictLoaded("anim@mp_point"))
                    await methods.sleep(1);

                mp.game.invoke("0x0725a4ccfded9a70", mp.players.local.handle, 0, 1, 1, 1);
                mp.players.local.setConfigFlag(36, true);
                mp.players.local.taskMoveNetwork("task_mp_pointing", 0.5, false, "anim@mp_point", 24);
                mp.game.streaming.removeAnimDict("anim@mp_point");

                this.interval = setInterval(this.process.bind(this), 0);
            }
            catch (e) {
                methods.debug(e);
            }
        }
    },

    stop: function () {
        if (this.active) {
            clearInterval(this.interval);
            this.interval = null;
            this.active = false;

            try {
                mp.game.invoke(methods.REQUEST_TASK_MOVE_NETWORK_STATE_TRANSITION, mp.players.local.handle, "Stop");

                if (!mp.players.local.isInAnyVehicle(true)) {
                    mp.game.invoke(methods.SET_PED_CURRENT_WEAPON_VISIBLE, mp.players.local.handle, 1, 1, 1, 1);
                }
                mp.players.local.setConfigFlag(36, false);
            }
            catch (e) {
                methods.debug(e);
            }
            user.stopAllAnimation();
        }
    },

    gameplayCam: mp.cameras.new("gameplay"),
    lastSync: 0,

    getRelativePitch: function () {
        let camRot = this.gameplayCam.getRot(2);
        return camRot.x - mp.players.local.getPitch();
    },

    process: function () {
        if (this.active) {
            try {
                mp.game.invoke(methods.IS_TASK_MOVE_NETWORK_ACTIVE, mp.players.local.handle);

                let camPitch = this.getRelativePitch();

                if (camPitch < -70.0) {
                    camPitch = -70.0;
                }
                else if (camPitch > 42.0) {
                    camPitch = 42.0;
                }
                camPitch = (camPitch + 70.0) / 112.0;

                let camHeading = mp.game.cam.getGameplayCamRelativeHeading();

                if (camHeading < -180.0) {
                    camHeading = -180.0;
                }
                else if (camHeading > 180.0) {
                    camHeading = 180.0;
                }
                camHeading = (camHeading + 180.0) / 360.0;

                mp.game.invoke(methods.SET_TASK_MOVE_NETWORK_SIGNAL_FLOAT, mp.players.local.handle, "Pitch", camPitch);
                mp.game.invoke(methods.SET_TASK_MOVE_NETWORK_SIGNAL_FLOAT, mp.players.local.handle, "Heading", camHeading * -1.0 + 1.0);
                mp.game.invoke(methods.SET_TASK_MOVE_NETWORK_SIGNAL_BOOL, mp.players.local.handle, "isBlocked", 0);
                mp.game.invoke(methods.SET_TASK_MOVE_NETWORK_SIGNAL_BOOL, mp.players.local.handle, "isFirstPerson", mp.game.invoke(methods.GET_FOLLOW_PED_CAM_VIEW_MODE) == 4);

                if ((Date.now() - this.lastSent) > 10) {
                    this.lastSent = Date.now();
                    mp.events.callRemote("server:pSync:fpUpdate", camPitch, camHeading);
                }
            }
            catch (e) {
                methods.debug(e);
            }
        }
    }
};

mp.events.add("client:pSync:fpUpdate", async (id, camPitch, camHeading) => {
    let netPlayer = getPlayerByRemoteId(parseInt(id));
    if (netPlayer != null) {
        if (netPlayer != mp.players.local) {
            try {
                netPlayer.lastReceivedPointing = Date.now();

                if (!netPlayer.pointingInterval) {
                    netPlayer.pointingInterval = setInterval((function () {
                        if ((Date.now() - netPlayer.lastReceivedPointing) > 1000) {
                            clearInterval(netPlayer.pointingInterval);

                            netPlayer.lastReceivedPointing = undefined;
                            netPlayer.pointingInterval = undefined;

                            mp.game.invoke(methods.REQUEST_TASK_MOVE_NETWORK_STATE_TRANSITION, netPlayer.handle, "Stop");

                            if (!netPlayer.isInAnyVehicle(true)) {
                                mp.game.invoke(methods.SET_PED_CURRENT_WEAPON_VISIBLE, netPlayer.handle, 1, 1, 1, 1);
                            }
                            netPlayer.setConfigFlag(36, false);

                        }
                    }).bind(netPlayer), 500);

                    mp.game.streaming.requestAnimDict("anim@mp_point");

                    while (!mp.game.streaming.hasAnimDictLoaded("anim@mp_point")) {
                        await methods.sleep(1);
                    }

                    mp.game.invoke(methods.SET_PED_CURRENT_WEAPON_VISIBLE, netPlayer.handle, 0, 1, 1, 1);
                    netPlayer.setConfigFlag(36, true);
                    netPlayer.taskMoveNetwork("task_mp_pointing", 0.5, false, "anim@mp_point", 24);
                    mp.game.streaming.removeAnimDict("anim@mp_point");
                }

                mp.game.invoke(methods.SET_TASK_MOVE_NETWORK_SIGNAL_FLOAT, netPlayer.handle, "Pitch", camPitch);
                mp.game.invoke(methods.SET_TASK_MOVE_NETWORK_SIGNAL_FLOAT, netPlayer.handle, "Heading", camHeading * -1.0 + 1.0);
                mp.game.invoke(methods.SET_TASK_MOVE_NETWORK_SIGNAL_BOOL, netPlayer.handle, "isBlocked", 0);
                mp.game.invoke(methods.SET_TASK_MOVE_NETWORK_SIGNAL_BOOL, netPlayer.handle, "isFirstPerson", 0);
            }
            catch (e) {
                methods.debug(e);
            }
        }
    }
});

function getPlayerByRemoteId(remoteId) {
    let pla = mp.players.atRemoteId(remoteId);
    if (pla == undefined || pla == null || !mp.players.exists(pla))
        return null;
    return pla;
}

async function setClipSet(player, style) {
    try {
        if (!style) {
            player.resetMovementClipset(0.0);
        } else {
            if (!mp.game.streaming.hasClipSetLoaded(style)) {
                mp.game.streaming.requestClipSet(style);
                while(!mp.game.streaming.hasClipSetLoaded(style))
                    await methods.sleep(1);
            }

            player.setMovementClipset(style, 0.0);
        }
    }
    catch (e) {
        methods.debug('Exception: client:setClipSet');
        methods.debug(e);
    }
}

async function setClipSetW(player, style) {
    try {
        if (!style) {
            mp.game.invoke('0x1055AC3A667F09D9', player.handle, mp.game.gameplay.getHashKey('default'));
        } else {
            mp.game.invoke('0x1055AC3A667F09D9', player.handle, mp.game.gameplay.getHashKey(style));
        }
    }
    catch (e) {
        methods.debug('Exception: client:setClipSetW');
        methods.debug(e);
    }
}

export default pSync;

/*
cellphone@	f_cellphone_text_in
cellphone@female	cellphone_call_to_text
cellphone@first_person	cellphone_text_read_base
cellphone@first_person@parachute	cellphone_text_in
cellphone@first_person	cellphone_call_listen_base
cellphone@in_car@ds	cellphone_text_read_base
cellphone@in_car@ds@first_person	cellphone_horizontal_base
cellphone@in_car@ds@first_person	cellphone_swipe_screen
cellphone@in_car@low@ds	cellphone_text_out
cellphone@in_car@ps	cellphone_horizontal_intro
cellphone@self	selfie
cellphone@self	selfie_in
cellphone@self@franklin@	chest_bump
cellphone@self@franklin@	peace
cellphone@self@michael@	finger_point
cellphone@self@trevor@	aggressive_finger
cellphone@stealth	cellphone_text_read_base
cellphone@str_female	cellphone_call_listen_yes_b
cellphone@str	f_cellphone_call_listen_maybe_a


cellphone@female cellphone_call_listen_base

local inAnim = "cellphone_text_in"
local outAnim = "cellphone_text_out"
local callAnim = "cellphone_call_listen_base"
local textAnim = "cellphone_text_read_base"
local toTextAnim = "cellphone_call_to_text"
local horizontalAnim = "cellphone_horizontal_base"

mp.events.callRemote('server:playAnimation', "cellphone@female", "cellphone_call_listen_base", 49);
* */