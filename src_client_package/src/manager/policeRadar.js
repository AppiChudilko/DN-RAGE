import methods from '../modules/methods';
import ui from '../modules/ui';

import user from '../user';

import vehicles from '../property/vehicles';
import vSync from "./vSync";
import timer from "./timer";
import phone from "../phone";

let policeRadar = {};
let enableCam = false;

let frontVehicle = undefined;
let frontVehicleMax = 0;
let rearVehicle = undefined;
let rearVehicleMax = 0;

policeRadar.load = function () {
    timer.createInterval('policeRadar.timer', policeRadar.timer, 200);
};

policeRadar.enableOrDisable = function () {
    if (enableCam)
        policeRadar.disable();
    else
        policeRadar.enable();
};

policeRadar.isEnable = function () {
    return enableCam;
};

policeRadar.enable = function (speed) {
    enableCam = true;
    mp.events.callRemote('server:vehicle:radar', speed);
    mp.game.ui.notifications.show('~g~Вы включили радар. Учите, рада работает только в том случае, если вы стоите на месте и в ней сидит водитель');
    /*frontVehicle = policeRadar.getVehicle();
    rearVehicle = policeRadar.getVehicle(-105);*/
};

policeRadar.disable = function () {
    enableCam = false;
    mp.events.callRemote('server:vehicle:radar', 0);
    mp.game.ui.notifications.show('~r~Вы выключили радар');
    /*let data = {
        type: 'updateRadarValues',
        showRadar: false,
        radarRearSpeed: '',
        radarRearSpeedMax: '',
        radarFrontSpeed: '',
        radarFrontSpeedMax: '',
        radarPatrolSpeed: '',
    };
    ui.callCef('hudc', JSON.stringify(data))*/
};

policeRadar.getVehicle = function (offsetY) {
    if (mp.players.local.isInAnyVehicle(false)) {
        try {
            let currentVeh = mp.players.local.vehicle;
            let coordA = currentVeh.position;
            let coordB = currentVeh.getOffsetFromInWorldCoords( 0.0, offsetY, 0.0);
            //let entity = mp.raycasting.testCapsule(coordA, coordB, 2, currentVeh);
            let entity = mp.raycasting.testPointToPoint(coordA, coordB, currentVeh);
            if (entity && entity.entity && entity.entity.getType() === 2)
                return entity.entity;
        }
        catch (e) {
            methods.debug(e);
        }
    }
    return undefined;
};

policeRadar.timer = function () {
    try {
        let currentVeh = mp.players.local.vehicle;
        if (!currentVeh && enableCam)
            policeRadar.disable();
        if (!mp.vehicles.exists(currentVeh) && enableCam)
            policeRadar.disable();
        if (enableCam) {
            /*frontVehicle = policeRadar.getVehicle(100);
            rearVehicle = policeRadar.getVehicle(-100);

            let fSpeed = '';
            let rSpeed = '';
            if (frontVehicle && mp.vehicles.exists(frontVehicle)) {
                if (user.getCache('s_hud_speed_type'))
                    fSpeed = Math.round(frontVehicle.getSpeed() * 3.6);
                else
                    fSpeed = Math.round(frontVehicle.getSpeed() * 2.236936);
                if (fSpeed > frontVehicleMax)
                    frontVehicleMax = fSpeed;
            }
            else {
                frontVehicleMax = 0;
            }
            if (rearVehicle && mp.vehicles.exists(rearVehicle)) {
                if (user.getCache('s_hud_speed_type'))
                    rSpeed = Math.round(rearVehicle.getSpeed() * 3.6);
                else
                    rSpeed = Math.round(rearVehicle.getSpeed() * 2.236936);
                if (rSpeed > rearVehicleMax)
                    rearVehicleMax = fSpeed;
            }
            else {
                rearVehicleMax = 0;
            }

            let data = {
                type: 'updateRadarValues',
                showRadar: enableCam,
                radarRearSpeed: rSpeed,
                radarRearSpeedMax: rearVehicleMax,
                radarFrontSpeed: fSpeed,
                radarFrontSpeedMax: frontVehicleMax,
                radarPatrolSpeed: methods.getCurrentSpeed(),
            };
            ui.callCef('hudc', JSON.stringify(data))*/
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

mp.events.add("playerExitVehicle", (vehId) => {
    policeRadar.disable();
});

export default policeRadar;