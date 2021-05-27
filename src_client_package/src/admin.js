import methods from './modules/methods';
import user from "./user";

let admin = {};

var getNormalizedVector = function(vector) {
    var mag = Math.sqrt(
        vector.x * vector.x + vector.y * vector.y + vector.z * vector.z
    );
    vector.x = vector.x / mag;
    vector.y = vector.y / mag;
    vector.z = vector.z / mag;
    return vector;
};
var getCrossProduct = function(v1, v2) {
    var vector = new mp.Vector3(0, 0, 0);
    vector.x = v1.y * v2.z - v1.z * v2.y;
    vector.y = v1.z * v2.x - v1.x * v2.z;
    vector.z = v1.x * v2.y - v1.y * v2.x;
    return vector;
};
var bindVirtualKeys = {
    F2: 0x71
};
var bindASCIIKeys = {
    Q: 69,
    E: 81,
    LCtrl: 17,
    Shift: 16
};

var isNoClip = false;
var noClipCamera;
var shiftModifier = false;
var controlModifier = false;
var localPlayer = mp.players.local;

let noClipEnabled = false;
let godmodeEnabled = false;
let noClipSpeed = 1;
let noClipSpeedNames = ["Die", "Slow", "Medium", "Fast", "Very Fast", "Extremely Fast", "Snail Speed!"];

admin.noClip = function(enable) {
    try {
        methods.debug('Execute: admin.noClip');
        noClipEnabled = enable;
        if (noClipEnabled)
            mp.game.ui.notifications.show(`~b~Нажмите ~s~H~b~ чтобы выключить No Clip`);

        if (!noClipEnabled) {

            let noClipEntity = mp.players.local.isSittingInAnyVehicle() ? mp.players.local.vehicle : mp.players.local;
            noClipEntity.freezePosition(false);
            noClipEntity.setInvincible(false);

            if (mp.players.local.vehicle) {
                let plPos = mp.players.local.vehicle.position;
                mp.players.local.vehicle.position = new mp.Vector3(plPos.x, plPos.y, plPos.z - mp.players.local.getHeightAboveGround() + 1);
            }
            else {
                let plPos = mp.players.local.position;
                mp.players.local.position = new mp.Vector3(plPos.x, plPos.y, plPos.z - mp.players.local.getHeightAboveGround() + 1);
            }
        }

    } catch (e) {
        methods.debug('Exception: admin.noClip');
        methods.debug(e);
    }
};

admin.godmode = function(enable, notify = true) {
    try {
        methods.debug('Execute: admin.godmode');
        godmodeEnabled = enable;

        if (notify)
        {
            if (godmodeEnabled)
                mp.game.ui.notifications.show(`~q~GodMode был активирован`);
            else
                mp.game.ui.notifications.show(`~q~GodMode был деактивирован`);
        }

        mp.players.local.setInvincible(enable);
        mp.players.local.setCanBeDamaged(!enable);
        user.setHealth(100);

    } catch (e) {
        methods.debug('Exception: admin.noClip');
        methods.debug(e);
    }
};

admin.isNoClipEnable = function() {
    return noClipEnabled;
};

admin.isGodModeEnable = function() {
    return godmodeEnabled;
};

admin.getNoClipSpeedName = function() {
    return noClipSpeedNames[noClipSpeed];
};

admin.isFreeCam = function() {
    return noClipCamera;
};

admin.startFreeCam = function() {
    mp.game.graphics.notify('FreeCam ~g~activated');
    var camPos = new mp.Vector3(
        localPlayer.position.x,
        localPlayer.position.y,
        localPlayer.position.z
    );
    var camRot = mp.game.cam.getGameplayCamRot(2);
    noClipCamera = mp.cameras.new('default', camPos, camRot, 45);
    noClipCamera.setActive(true);
    noClipCamera.setFov(45); //45 DEFAULT
    mp.game.cam.renderScriptCams(true, false, 0, true, false);
    localPlayer.freezePosition(true);
    localPlayer.setInvincible(true);
    localPlayer.setVisible(false, false);
    localPlayer.setCollision(false, false);

    user.setAlpha(0);
};

admin.setPos = function(x, y, z) {
    if (noClipCamera)
        noClipCamera.setCoord(x, y, z);
};

admin.getCameraPos = function() {
    if (noClipCamera)
        return noClipCamera.getCoord();
    return null;
};

admin.getCameraRot = function() {
    if (noClipCamera)
        return noClipCamera.getRot(2);
    return null;
};

admin.stopFreeCam = function() {
    mp.game.graphics.notify('FreeCam ~r~disabled');
    if (noClipCamera) {
        localPlayer.position = noClipCamera.getCoord();
        localPlayer.setHeading(noClipCamera.getRot(2).z);
        noClipCamera.destroy(true);
        noClipCamera = null;
    }
    mp.game.cam.renderScriptCams(false, false, 0, true, false);
    localPlayer.freezePosition(false);
    localPlayer.setInvincible(false);
    localPlayer.setVisible(true, false);
    localPlayer.setCollision(true, false);

    user.setAlpha(255);
};

admin.teleportCamera = function(newPos) {
    if (noClipCamera) {
        noClipCamera.setCoord(newPos.x, newPos.y, newPos.z);
    }
};

mp.events.add('render', function() {
    if (!noClipCamera || mp.gui.cursor.visible) {
        return;
    }
    controlModifier = mp.keys.isDown(bindASCIIKeys.LCtrl);
    shiftModifier = mp.keys.isDown(bindASCIIKeys.Shift);
    var rot = noClipCamera.getRot(2);
    var fastMult = 1;
    var slowMult = 1;
    if (shiftModifier) {
        fastMult = 3;
    } else if (controlModifier) {
        slowMult = 0.2;
    }
    var rightAxisX = mp.game.controls.getDisabledControlNormal(0, 220);
    var rightAxisY = mp.game.controls.getDisabledControlNormal(0, 221);
    var leftAxisX = mp.game.controls.getDisabledControlNormal(0, 218);
    var leftAxisY = mp.game.controls.getDisabledControlNormal(0, 219);
    var pos = noClipCamera.getCoord();
    var rr = noClipCamera.getDirection();
    var vector = new mp.Vector3(0, 0, 0);
    vector.x = rr.x * leftAxisY * fastMult * slowMult;
    vector.y = rr.y * leftAxisY * fastMult * slowMult;
    vector.z = rr.z * leftAxisY * fastMult * slowMult;
    var upVector = new mp.Vector3(0, 0, 1);
    var rightVector = getCrossProduct(
        getNormalizedVector(rr),
        getNormalizedVector(upVector)
    );
    rightVector.x *= leftAxisX * 0.5;
    rightVector.y *= leftAxisX * 0.5;
    rightVector.z *= leftAxisX * 0.5;
    var upMovement = 0.0;
    if (mp.keys.isDown(bindASCIIKeys.Q)) {
        upMovement = 0.5;
    }
    var downMovement = 0.0;
    if (mp.keys.isDown(bindASCIIKeys.E)) {
        downMovement = 0.5;
    }
    mp.players.local.position = new mp.Vector3(
        pos.x + vector.x + 1,
        pos.y + vector.y + 1,
        pos.z + vector.z - 50
    );
    mp.players.local.heading = rr.z;
    noClipCamera.setCoord(
        pos.x - vector.x + rightVector.x,
        pos.y - vector.y + rightVector.y,
        pos.z - vector.z + rightVector.z + upMovement - downMovement
    );
    noClipCamera.setRot(
        rot.x + rightAxisY * -5.0,
        0.0,
        rot.z + rightAxisX * -5.0,
        2
    );

    user.setTeleport(true);
});

mp.events.add('render', () => {

    if (godmodeEnabled) {
        mp.players.local.setInvincible(true);
        mp.players.local.setCanBeDamaged(false);

        if (mp.players.local.getHealth() < 999)
            user.setHealth(1000);
    }

    if (noClipEnabled) {
        try {
            let noClipEntity = mp.players.local.isSittingInAnyVehicle() ? mp.players.local.vehicle : mp.players.local;

            noClipEntity.freezePosition(true);
            noClipEntity.setInvincible(true);

            user.setTeleport(true);

            mp.game.controls.disableControlAction(0, 8, true);
            mp.game.controls.disableControlAction(0, 9, true);
            mp.game.controls.disableControlAction(0, 30, true);
            mp.game.controls.disableControlAction(0, 31, true);
            mp.game.controls.disableControlAction(0, 32, true);
            mp.game.controls.disableControlAction(0, 33, true);
            mp.game.controls.disableControlAction(0, 34, true);
            mp.game.controls.disableControlAction(0, 35, true);
            mp.game.controls.disableControlAction(0, 36, true);
            mp.game.controls.disableControlAction(0, 63, true);
            mp.game.controls.disableControlAction(0, 64, true);
            mp.game.controls.disableControlAction(0, 71, true);
            mp.game.controls.disableControlAction(0, 72, true);
            mp.game.controls.disableControlAction(0, 77, true);
            mp.game.controls.disableControlAction(0, 78, true);
            mp.game.controls.disableControlAction(0, 78, true);
            mp.game.controls.disableControlAction(0, 87, true);
            mp.game.controls.disableControlAction(0, 88, true);
            mp.game.controls.disableControlAction(0, 89, true);
            mp.game.controls.disableControlAction(0, 90, true);
            mp.game.controls.disableControlAction(0, 129, true);
            mp.game.controls.disableControlAction(0, 130, true);
            mp.game.controls.disableControlAction(0, 133, true);
            mp.game.controls.disableControlAction(0, 134, true);
            mp.game.controls.disableControlAction(0, 136, true);
            mp.game.controls.disableControlAction(0, 139, true);
            mp.game.controls.disableControlAction(0, 146, true);
            mp.game.controls.disableControlAction(0, 147, true);
            mp.game.controls.disableControlAction(0, 148, true);
            mp.game.controls.disableControlAction(0, 149, true);
            mp.game.controls.disableControlAction(0, 150, true);
            mp.game.controls.disableControlAction(0, 151, true);
            mp.game.controls.disableControlAction(0, 232, true);
            mp.game.controls.disableControlAction(0, 266, true);
            mp.game.controls.disableControlAction(0, 267, true);
            mp.game.controls.disableControlAction(0, 268, true);
            mp.game.controls.disableControlAction(0, 269, true);
            mp.game.controls.disableControlAction(0, 278, true);
            mp.game.controls.disableControlAction(0, 279, true);
            mp.game.controls.disableControlAction(0, 338, true);
            mp.game.controls.disableControlAction(0, 339, true);
            mp.game.controls.disableControlAction(0, 44, true);
            mp.game.controls.disableControlAction(0, 20, true);
            mp.game.controls.disableControlAction(0, 47, true);

            let yoff = 0.0;
            let zoff = 0.0;

            if (mp.game.controls.isDisabledControlJustPressed(0, 22)) {
                noClipSpeed++;
                if (noClipSpeed >= noClipSpeedNames.length)
                    noClipSpeed = 0;
            }

            if (mp.game.controls.isDisabledControlPressed(0, 32)) {
                yoff = 0.5;
            }

            if (mp.game.controls.isDisabledControlPressed(0, 33)) {
                yoff = -0.5;
            }

            if (mp.game.controls.isDisabledControlPressed(0, 34)) {
                noClipEntity.setRotation(0, 0, noClipEntity.getRotation(0).z + 3, 0, true);
            }

            if (mp.game.controls.isDisabledControlPressed(0, 35)) {
                noClipEntity.setRotation(0, 0, noClipEntity.getRotation(0).z - 3, 0, true);
            }

            if (mp.game.controls.isDisabledControlPressed(0, 44)) {
                zoff = 0.21;
            }

            if (mp.game.controls.isDisabledControlPressed(0, 20)) {
                zoff = -0.21;
            }

            if (mp.game.controls.isDisabledControlPressed(0, 74)) {
                if(!noClipEntity.getVariable('isTyping')) {
                    admin.noClip(false);
                }
            }

            let newPos = noClipEntity.getOffsetFromInWorldCoords(0, yoff * (noClipSpeed * 0.7), zoff * (noClipSpeed * 0.7));
            let heading = noClipEntity.getRotation(0).z;

            noClipEntity.setVelocity(0, 0, 0);
            noClipEntity.setRotation(0, 0, heading, 0, false);
            noClipEntity.setCollision(false, false);
            noClipEntity.setCoordsNoOffset(newPos.x, newPos.y, newPos.z, true, true, true);

            noClipEntity.freezePosition(false);
            noClipEntity.setInvincible(false);
            noClipEntity.setCollision(true, true);
        }
        catch (e) {

        }
    }
});

export default admin;