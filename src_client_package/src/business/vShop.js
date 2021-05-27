import methods from '../modules/methods';

import user from '../user';
import chat from "../chat";
import ui from "../modules/ui";
import Camera from "../manager/cameraRotator";

let vShop = {};

let vPos = new mp.Vector3(198.04959106445312, -1000.5430297851562, -99.67317199707031);
let vRot = 180;

let vCurrent = null;
let isInside = false;

let insidePos = new mp.Vector3(-1507.416259765625, -3005.405029296875, -82.55733489990234);
let exitPos = new mp.Vector3(-1507.416259765625, -3005.405029296875, -82.55733489990234);
let camPos = new mp.Vector3(-1500.3770751953125, -2998.169677734375, -81.15196990966797);
let currentShop = 0;

let camera = null;

let carList = new Map();

let color1 = 111;
let color2 = 111;
let openAllDoor = false;

const cameraRotator = new Camera.Rotator();

vShop.createCamera = function() {

    user.showCustomNotify('Зажмите ЛКМ для смены положения камеры', 0, 1);

    let pos = vPos;

    if (currentShop === 9)
        pos = new mp.Vector3(vPos.x, vPos.y, vPos.z + 1.6);

    camera = mp.cameras.new("vshop_camera");
    /*camera.setActive(true);
    camera.setCoord(-1500.3770751953125, -2998.169677734375, -81.15196990966797);
    camera.pointAtCoord(vPos.x, vPos.y, vPos.z);*/
    cameraRotator.start(camera, pos, pos, new mp.Vector3(0, 10, 0), 360);
    cameraRotator.setXBound(-360, 360);

    mp.game.cam.renderScriptCams(true, false, 0, false, false);
};

vShop.destroyCamera = function() {
    try {
        cameraRotator.stop();
        cameraRotator.reset();
        if (camera) {
            camera.destroy();
            camera = null;
        }
    }
    catch (e) {
        methods.debug(e);
    }

    mp.game.cam.renderScriptCams(false, true, 0, true, true);
};

vShop.goToInside = function(shopId, x, y, z, rot, bx, by, bz, cars) {
    try {
        carList = cars;

        isInside = true;

        user.setVirtualWorld(mp.players.local.remoteId + 1);
        vPos = new mp.Vector3(x, y, z);
        exitPos = new mp.Vector3(bx, by, bz);
        vRot = rot;

        currentShop = shopId;
        ui.hideHud();
        user.teleportv(insidePos, 0, false);
        mp.gui.cursor.show(true, true);
        methods.blockKeys(true);

        setTimeout(function () {
            vShop.createCamera();
        }, 500);

        /*chat.sendLocal(`!{${chat.clBlue}}Подсказка`);
        chat.sendLocal(`Если вы вдруг закрыли меню, то не переживайте, подойдите к транспорту, наведитесь и нажмите E`);
        chat.sendLocal(`Чтобы выйти из автосалона, в самом низу есть пункт меню выхода`);*/
    }
    catch (e) {
        methods.debug(e);
    }
};

vShop.exit = function() {
    try {
        isInside = false;
        methods.blockKeys(false);
        ui.callCef('carShop','{"type": "hide"}');
        mp.gui.cursor.show(false, false);
        vShop.destroyVehicle();
        user.setVirtualWorld(0);
        currentShop = 0;
        user.teleportv(exitPos);
        vShop.destroyCamera();
    }
    catch (e) {
        methods.debug(e);
    }
};

vShop.isInside = function() {
    return isInside;
};

vShop.createVehicle = function(model, c1 = 111, c2 = 111) {
    vShop.destroyVehicle();

    color1 = c1;
    color2 = c2;

    try {
        vCurrent = mp.vehicles.new(mp.game.joaat(model), vPos, { heading: vRot, engine: false, locked: true, numberPlate: "CAR SHOP", dimension: mp.players.local.remoteId + 1 });
        vCurrent.setRotation(0, 0, vRot, 0, true);
        vCurrent.setCanBeDamaged(false);
        vCurrent.setInvincible(true);
        vCurrent.freezePosition(true);
        vCurrent.setColours(color1, color2);
    }
    catch (e) {
        methods.debug(e);
    }
};

vShop.setColor1 = function(color) {
    try {
        if (vCurrent && mp.vehicles.exists(vCurrent)) {
            color1 = color;
            vCurrent.setColours(color1, color2);
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

vShop.getColor1 = function() {
    return color1;
};

vShop.setColor2 = function(color) {
    try {
        if (vCurrent && mp.vehicles.exists(vCurrent)) {
            color2 = color;
            vCurrent.setColours(color1, color2);
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

vShop.getColor2 = function() {
    return color2;
};

vShop.openAllDoor = function() {
    try {
        if (vCurrent && mp.vehicles.exists(vCurrent)) {
            openAllDoor = true;
            for (let i = 0; i < 8; i++)
                vCurrent.setDoorOpen(i, false, true);
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

vShop.closeAllDoor = function() {
    try {
        if (vCurrent && mp.vehicles.exists(vCurrent)) {
            openAllDoor = false;
            for (let i = 0; i < 8; i++)
                vCurrent.setDoorShut(i, true);
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

vShop.isOpenAllDoor = function() {
    return openAllDoor;
};

vShop.destroyVehicle = function() {
    try {
        if (vCurrent && mp.vehicles.exists(vCurrent))
            vCurrent.destroy();
        vCurrent = null;
    }
    catch (e) {
        methods.debug(e);
    }
};

vShop.getShopId = function() {
    return currentShop;
};

vShop.getCarList = function() {
    return carList;
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

        if (x > 0.2) {
            cameraRotator.setPoint(x, y);

            if (mp.game.controls.isDisabledControlPressed(2, 237)) {
                cameraRotator.onMouseMove(dX, dY);
            }

            cameraRotator.onMouseScroll(su, sd);
        }

    }
    catch (e) {
    }
});

export default vShop;
