import user from "../user";
import methods from "../modules/methods";

let vBreakLight = {};

let pedInSameVehicleLast = false;
let vehicle = null;
let vehicleClass = 0;
let fBrakeForce = 1.0;
let isBrakingForward = false;
let isBrakingReverse = false;

let smoothDriving = true;
let stopWithoutReversing = true;
let smoothAcceleratorCurve = 7.5;
let smoothBrakeCurve = 5.0;

vBreakLight.isPedDrivingAVehicle = function() {
    try {
        if (mp.players.local.isInAnyVehicle(false)) {
            let veh = mp.players.local.vehicle;
            if (veh.getPedInSeat(-1) == mp.players.local.handle) {
                let classType = mp.game.vehicle.getVehicleClassFromName(veh.model);
                if (classType != 15 && classType != 16 && classType !=21 && classType !=13 && classType !=14)
                    return true;
            }
        }
    }
    catch (e) {
        methods.debug(e);
    }
    return false;
};

vBreakLight.fscale = function (inputValue, originalMin, originalMax, newBegin, newEnd, curve) {
    try {
        let OriginalRange = 0.0;
        let NewRange = 0.0;
        let zeroRefCurVal = 0.0;
        let normalizedCurVal = 0.0;
        let rangedValue = 0.0;
        let invFlag = 0;

        if (curve > 10.0) curve = 10.0;
        if (curve < -10.0) curve = -10.0;

        curve = (curve * -.1);
        curve = 10.0 ^ curve;

        if (inputValue < originalMin)
            inputValue = originalMin;
        if (inputValue > originalMax)
            inputValue = originalMax;

        OriginalRange = originalMax - originalMin;

        if (newEnd > newBegin)
            NewRange = newEnd - newBegin;
        else {
            NewRange = newBegin - newEnd;
            invFlag = 1;
        }

        zeroRefCurVal = inputValue - originalMin;
        normalizedCurVal  =  zeroRefCurVal / OriginalRange;

        if (originalMin > originalMax)
            return 0;

        if (invFlag == 0)
            rangedValue =  ((normalizedCurVal ^ curve) * NewRange) + newBegin;
        else
            rangedValue =  newBegin - ((normalizedCurVal ^ curve) * NewRange);
        return rangedValue;
    }
    catch (e) {
        methods.debug(e);
    }
    return 0;
};

vBreakLight.smoothDriving = function () {
    if (vehicle && mp.vehicles.exists(vehicle)) {
        try {
            let torqueFactor = 1.0;
            let accelerator = mp.game.controls.getControlValue(2,71);
            let brake = mp.game.controls.getControlValue(2,72);
            let speedVector = vehicle.getSpeedVector(true).y;
            let brk = fBrakeForce;

            if (speedVector >= 1.0) {
                if (accelerator > 127) {
                    let acc = vBreakLight.fscale(accelerator, 127.0, 254.0, 0.1, 1.0, 10.0-(smoothAcceleratorCurve*2.0));
                    torqueFactor = torqueFactor * acc;
                }
                if (brake > 127) {
                    isBrakingForward = true;
                    brk = vBreakLight.fscale(brake, 127.0, 254.0, 0.01, fBrakeForce, 10.0-(smoothBrakeCurve*2.0));
                }
            }
            else if (speedVector <= -1.0) {
                if (accelerator > 127) {
                    let rev = vBreakLight.fscale(brake, 127.0, 254.0, 0.1, 1.0, 10.0-(smoothAcceleratorCurve*2.0));
                    torqueFactor = torqueFactor * rev;
                }
                if (brake > 127) {
                    isBrakingReverse = true;
                    brk = vBreakLight.fscale(brake, 127.0, 254.0, 0.01, fBrakeForce, 10.0-(smoothBrakeCurve*2.0));
                }
            }
            else {
                let entitySpeed = vehicle.getSpeed();

                if (stopWithoutReversing && entitySpeed < 1) {
                    if (isBrakingForward == true) {
                        mp.game.controls.disableControlAction(2,72,true);
                        vehicle.setForwardSpeed(speedVector*0.98);
                        vehicle.setBrakeLights(true);
                    }
                    if (isBrakingReverse == true) {
                        mp.game.controls.disableControlAction(2,71,true);
                        vehicle.setForwardSpeed(speedVector*0.98);
                        vehicle.setBrakeLights(true);
                    }

                    if (isBrakingForward == true && mp.game.controls.getDisabledControlNormal(2,72) == 0) {
                        isBrakingForward = false;
                    }
                    if (isBrakingReverse == true && mp.game.controls.getDisabledControlNormal(2,71) == 0) {
                        isBrakingReverse = false;
                    }
                }
            }
            if (brk > fBrakeForce - 0.02) brk = fBrakeForce;
        }
        catch (e) {
            methods.debug(e);
        }
        //vehicle.setHandling('fBrakeForce', brk.toString());
        //vehicle.setEngineTorqueMultiplier(torqueFactor);
    }
};

vBreakLight.timer = function () {
    if (mp.players.local.isInAnyVehicle(false)) {
        try {
            if (mp.vehicles.exists(mp.players.local.vehicle)) {
                vehicle = mp.players.local.vehicle;
                vehicleClass = mp.game.vehicle.getVehicleClassFromName(vehicle.model);
            }
        }
        catch (e) {
            methods.debug(e);
        }
    }
    else {
        vehicle = null;
    }
    setTimeout(vBreakLight.timer, 50);
};

mp.events.add('render', () => {
    if (user.isLogin() && smoothDriving)
        vBreakLight.smoothDriving();
});

export default vBreakLight;