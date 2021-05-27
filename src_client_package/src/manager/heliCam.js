import methods from '../modules/methods';
import ui from '../modules/ui';

import user from '../user';

import vehicles from '../property/vehicles';
import vSync from "./vSync";

let heliCam = {};


let fov_max = 80.0;
let fov_min = 10.0; //max zoom level (smaller fov is more zoom)
let zoomspeed = 2.0; //camera zoom speed
let speed_lr = 3.0; //speed by which the camera pans left-right
let speed_ud = 3.0; //speed by which the camera pans up-down

let enableCam = false;
let fov = (fov_max+fov_min) * 0.5;
let vision_state = 0; //0 is normal, 1 is nightmode, 2 is thermal vision

let spotLight = false;

let camera = null;
let scale = null;
let locked_on_vehicle = null;
let vehicle_detected = null;

heliCam.keyPressToggleHeliCam = async function () {
    try {
        if (heliCam.isValideVeh() && heliCam.isHeliHighEnough()) {

            mp.game.audio.playSoundFrontend(-1, "SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET", false);
            locked_on_vehicle = null;

            if (!enableCam) {
                if ((mp.players.local.vehicle.getVariable('fraction_id') == 2 ||
                    mp.players.local.vehicle.getVariable('fraction_id') == 3 ||
                    mp.players.local.vehicle.getVariable('fraction_id') == 4 ||
                    mp.players.local.vehicle.getVariable('fraction_id') == 5
                ) &&  (
                    mp.players.local.vehicle.model === mp.game.joaat('polmav') ||
                    mp.players.local.vehicle.model === mp.game.joaat('buzzard') ||
                    mp.players.local.vehicle.model === mp.game.joaat('buzzard2')
                )) {
                    enableCam = true;
                    ui.hideHud();
                    mp.game.graphics.setTimecycleModifier("heliGunCam");
                    mp.game.graphics.setTimecycleModifierStrength(0.3);

                    scale = mp.game.graphics.requestScaleformMovie("HELI_CAM");
                    while(!mp.game.graphics.hasScaleformMovieLoaded(scale))
                        await methods.sleep(1);

                    heliCam.createCam();
                }
                else {
                    mp.game.ui.notifications.show('Доступно только для полицейских вертолетов');
                }
            }
            else {
                heliCam.destroy();
            }
        }
        else
            mp.game.ui.notifications.show('~y~Необходимо находиться в вертолете (Polmav или Buzzard), на водительском или на соседнем кресле');
    }
    catch (e) {
        methods.debug(e);
    }
};

heliCam.keyPressToggleSpotLight = function () {
    try {
        if (heliCam.isValideVeh() && heliCam.isHeliHighEnough() &&
            (
                mp.players.local.vehicle.model === mp.game.joaat('polmav') ||
                mp.players.local.vehicle.model === mp.game.joaat('buzzard') ||
                mp.players.local.vehicle.model === mp.game.joaat('buzzard2')
            )
        ) {
            spotLight = !spotLight;
            vehicles.setSpotLightState(spotLight);
            mp.game.audio.playSoundFrontend(-1, "SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET", false);
        }
    }
    catch (e) {
        
    }
};

heliCam.keyPressToggleVision = function () {
    try {
        if (heliCam.isValideVeh() && heliCam.isHeliHighEnough() && enableCam) {

            if (vision_state == 0) {
                mp.game.graphics.setNightvision(true);
                vision_state = 1;
            }
            else if (vision_state == 1) {
                mp.game.graphics.setNightvision(false);
                mp.game.graphics.setSeethrough(true);
                vision_state = 2;
            }
            else {
                mp.game.graphics.setNightvision(false);
                mp.game.graphics.setSeethrough(false);
                vision_state = 0;
            }
            mp.game.audio.playSoundFrontend(-1, "SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET", false);
        }
    }
    catch (e) {
        
    }
};

heliCam.keyPressToggleLockVehicle = function () {
    try {
        if (heliCam.isValideVeh() && heliCam.isHeliHighEnough()) {
            if (mp.vehicles.exists(locked_on_vehicle)) {
                locked_on_vehicle = null;
                mp.game.audio.playSoundFrontend(-1, "SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET", false);
                heliCam.destroyCam();
                heliCam.createCam();
            }
            else if(enableCam) {
                locked_on_vehicle = heliCam.getVehicleInView();
                if (mp.vehicles.exists(locked_on_vehicle)) {
                    mp.game.audio.playSoundFrontend(-1, "SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET", false);
                }
            }
        }
    }
    catch (e) {

    }
};

heliCam.isValideVeh = function () {
    try {
        return mp.players.local.vehicle &&
            mp.players.local.isInAnyVehicle(true) &&
            (mp.players.local.vehicle.getPedInSeat(-1) == mp.players.local.handle || mp.players.local.vehicle.getPedInSeat(0) == mp.players.local.handle);
    }
    catch (e) {

    }
    return  false;
};

heliCam.isHeliHighEnough = function () {
    try {
        return mp.players.local.vehicle.getHeightAboveGround() >= 1.5;
    }
    catch (e) {

    }
    return false;
};

heliCam.createCam = function () {
    camera = mp.cameras.new("DEFAULT_SCRIPTED_FLY_CAMERA");
    camera.attachTo(mp.players.local.vehicle.handle, 0.0,0.0,-1.5, true);
    camera.setActive(true);
    camera.setRot(0, 0, mp.players.local.vehicle.getRotation(0).z, 0);
    camera.setFov(fov);
    mp.game.cam.renderScriptCams(true, false, 0, false, false);
};

heliCam.destroyCam = function () {
    fov = (fov_max+fov_min)*0.5;
    try {
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

heliCam.destroy = function () {
    try {
        enableCam = false;
        ui.showHud();
        vision_state = 0;
        mp.game.graphics.setNightvision(false);
        mp.game.graphics.setSeethrough(false);
        mp.game.graphics.setTimecycleModifierStrength(0);
        heliCam.destroyCam();
        mp.game.graphics.setScaleformMovieAsNoLongerNeeded(scale);
    }
    catch (e) {

    }
};

heliCam.getVehicleInView = function () {
    let distance = 150;
    let position = camera.getCoord();
    let direction = camera.getDirection();
    let farAway = new mp.Vector3((direction.x * distance) + (position.x), (direction.y * distance) + (position.y), (direction.z * distance) + (position.z));
    let entity = mp.raycasting.testPointToPoint(position, farAway);

    try {
        if (entity.entity.getType() == 2)
            return entity.entity;
    }
    catch (e) {
        
    }
    return null;
};

heliCam.checkInputRotation = function (zoomvalue) {
    try {
        if (camera) {
            let rightAxisX = mp.game.controls.getDisabledControlNormal(0, 220);
            let rightAxisY = mp.game.controls.getDisabledControlNormal(0, 221);
            let rotation = camera.getRot(2);

            if (rightAxisX != 0.0 || rightAxisY != 0.0) {
                let new_z = rotation.z + rightAxisX*-1.0*(speed_ud)*(zoomvalue+0.1);
                let new_x = Math.max(Math.min(20.0, rotation.x + rightAxisY*-1.0*(speed_lr)*(zoomvalue+0.1)), -89.5);
                camera.setRot(new_x, 0.0, new_z, 2);
            }
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

mp.events.add("playerExitVehicle", (vehId) => {
    if (enableCam)
        heliCam.destroy();
});

mp.events.add('render', async () => {
    if (enableCam && heliCam.isHeliHighEnough() && !user.isDead()) {
        try {
            let zoomvalue = (1.0/(fov_max-fov_min))*(fov-fov_min);

            if (mp.vehicles.exists(locked_on_vehicle)) {
                camera.pointAt(locked_on_vehicle.handle, 0, 0, 0, true);
                let vehname = mp.game.ui.getLabelText(mp.game.vehicle.getDisplayNameFromVehicleModel(locked_on_vehicle.model));

                let velocity = locked_on_vehicle.getVelocity();
                let speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y + velocity.z * velocity.z);
                speed = Math.round(speed * 2.23693629);

                ui.drawText(`${vehname}\n${vehicles.getNumberPlate(locked_on_vehicle)}\n${speed}mp/h`, 0.5, 0.91, 0.4, 255, 255, 255, 180, 0, 1, false, false);

                if (methods.distanceToPos2D(locked_on_vehicle.position, mp.players.local.position) > 90) {
                    heliCam.keyPressToggleLockVehicle();
                    mp.game.ui.notifications.show('~y~Слишком далеко, фиксирование отключено.');
                }
            }
            else {
                heliCam.checkInputRotation(zoomvalue);
            }

            //mp.game.graphics.pushScaleformMovieFunction(scale, 'SET_CAM_LOGO');
            //mp.game.graphics.pushScaleformMovieFunctionParameterInt(1); //0 for nothing, 1 for LSPD logo
            //mp.game.graphics.popScaleformMovieFunctionVoid();

            mp.game.graphics.pushScaleformMovieFunction(scale, 'SET_ALT_FOV_HEADING');
            mp.game.graphics.pushScaleformMovieFunctionParameterFloat(mp.players.local.vehicle.position.z);
            mp.game.graphics.pushScaleformMovieFunctionParameterFloat(zoomvalue);
            mp.game.graphics.pushScaleformMovieFunctionParameterFloat(camera.getRot(2).z);
            mp.game.graphics.popScaleformMovieFunctionVoid();
            mp.game.graphics.drawScaleformMovieFullscreen(scale, 255, 255, 255, 255, false);
        }
        catch (e) {

        }
    }
    else if (enableCam)
        heliCam.destroy();
});

export default heliCam;