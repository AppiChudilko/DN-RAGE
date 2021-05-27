let vehicles = require('../property/vehicles');
let Container = require('../modules/data');
let methods = require('../modules/methods');
let user = require('../user');

let vSync = exports;

vSync.WindowID =
{
    WindowFrontRight: 0,
    WindowFrontLeft: 1,
    WindowRearRight: 2,
    WindowRearLeft: 3
};

vSync.SirenState =
{
    Disable: 0,
    EnableWithoutSound: 1,
    EnableWithSoundSlow: 2,
    EnableWithSoundNormal: 3,
    EnableWithSoundFast: 4
};

vSync.VehicleSyncData = {
    //Basics
    Dirt: 0,
    Siren: 0,
    RadioState: 0,
    Engine: false,
    Hood: false,
    Trunk: false,

    Window: [0,0,0,0],

    SmokeR: 255,
    SmokeG: 255,
    SmokeB: 255,

    DbColor: 0,
    IntColor: 0,

    //(Not synced)
    IndicatorLeftToggle: false,
    IndicatorRightToggle: false,
    InteriorLight: false,
    TaxiLight: false,
    SpotLight: false,
    Anchor: true,
    Freeze: false,
    Collision: true,
    Extra: 1,
};

let streamDist = 250;
let offsetId = -999000;
let prefix = 'vSync';

vSync.set = function(vehicle, key, value) {
    if (vehicles.exists(vehicle))
        vehicle.setVariable(key, value);
};

vSync.get = function(vehicle, key) {
    if (vehicles.exists(vehicle))
        return vehicle.getVariable(key);
    return vSync.VehicleSyncData;
};

vSync.has = function(vehicle, key = 'vehicleSyncData') {
    if (vehicles.exists(vehicle))
        return vehicle.getVariable(key) !== undefined && vehicle.getVariable(key) !== null;
    return false;
};

vSync.getVehicleSyncData = function(vehicle) {
    if (vSync.has(vehicle, 'vehicleSyncData'))
        return vSync.get(vehicle, 'vehicleSyncData');
    return vSync.VehicleSyncData;
};

vSync.updateVehicleSyncData = function(veh, data) {
    if (vehicles.exists(veh) && data)
        vSync.set(veh, 'vehicleSyncData', data);
};

vSync.setVehicleWindowState = function(v, window, state) {
    if (!vehicles.exists(v))
        return;
    let data = vSync.getVehicleSyncData(v);
    data.Window[window] = state;
    vSync.updateVehicleSyncData(v, data);
    mp.players.callInRange(v.position, streamDist, "vSync:setVehicleWindowStatus", [v.id, window, state]);
};

vSync.getVehicleWindowState = function(v, window) {
    return methods.parseInt(vSync.getVehicleSyncData(v).Window[window]);
};

vSync.setVehicleInteriorColor = function(v, color) {
    if (!vehicles.exists(v))
        return;
    let data = vSync.getVehicleSyncData(v);
    data.IntColor = color;
    vSync.updateVehicleSyncData(v, data);
    mp.players.callInRange(v.position, streamDist, "vSync:setVehicleInteriorColor", [v.id, color]);
};

vSync.getVehicleInteriorColor = function(v) {
    return methods.parseInt(vSync.getVehicleSyncData(v).IntColor);
};

vSync.setVehicleDashboardColor = function(v, color) {
    if (!vehicles.exists(v))
        return;
    let data = vSync.getVehicleSyncData(v);
    data.DbColor = color;
    vSync.updateVehicleSyncData(v, data);
    mp.players.callInRange(v.position, streamDist, "vSync:setVehicleDashboardColor", [v.id, color]);
};

vSync.getVehicleDashboardColor = function(v) {
    return methods.parseInt(vSync.getVehicleSyncData(v).DbColor);
};

vSync.setVehicleTyreSmokeColor = function(v, r, g, b) {
    if (!vehicles.exists(v))
        return;
    let data = vSync.getVehicleSyncData(v);
    data.SmokeR = methods.parseInt(r);
    data.SmokeG = methods.parseInt(g);
    data.SmokeB = methods.parseInt(b);
    vSync.updateVehicleSyncData(v, data);
    mp.players.callInRange(v.position, streamDist, "vSync:setVehicleTyreSmokeColor", [v.id, r, g, b]);
};

vSync.getVehicleTyreSmokeColor = function(v) {
    return {
        r: vSync.getVehicleSyncData(v).SmokeR,
        g: vSync.getVehicleSyncData(v).SmokeG,
        b: vSync.getVehicleSyncData(v).SmokeB
    };
};

vSync.setVehicleWheelMod = function(v, state, isShowLabel) {
    if (!vehicles.exists(v))
        return;
    state = methods.parseInt(state);
    let data = vSync.getVehicleSyncData(v);
    data.ModWheel = state;
    data.ModWheelSpecial = isShowLabel;
    vSync.updateVehicleSyncData(v, data);
    mp.players.callInRange(v.position, streamDist, "vSync:setVehicleWheelMod", [v.id, state, isShowLabel]);
};

vSync.setVehicleWheelState = function(v, wheel, state) {
    if (!vehicles.exists(v))
        return;
    let data = vSync.getVehicleSyncData(v);
    data.Wheel[wheel] = state;
    vSync.updateVehicleSyncData(v, data);
    mp.players.callInRange(v.position, streamDist, "vSync:setVehicleWheelStatus", [v.id, wheel, state]);
};

vSync.getVehicleWheelState = function(v, wheel) {
    return methods.parseInt(vSync.getVehicleSyncData(v).Wheel[wheel]);
};

vSync.setSirenState = function(v, state) {
    if (!vehicles.exists(v))
        return;
    let data = vSync.getVehicleSyncData(v);
    data.SirenState = state;
    vSync.updateVehicleSyncData(v, data);
    mp.players.callInRange(v.position, streamDist, "vSync:setSirenState", [v.id, state]);
};

vSync.playSound = function(v, pref, val) {
    if (!vehicles.exists(v))
        return;
    mp.players.callInRange(v.position, streamDist, "vSync:playSound", [v.id, pref, val]);
};

vSync.stopSound = function(v, pref) {
    if (!vehicles.exists(v))
        return;
    mp.players.callInRange(v.position, streamDist, "vSync:stopSound", [v.id, pref]);
};

vSync.setVehicleDirt = function(v, dirt) {
    if (!vehicles.exists(v))
        return;
    let data = vSync.getVehicleSyncData(v);
    data.Dirt = dirt;
    vSync.updateVehicleSyncData(v, data);
    mp.players.callInRange(v.position, streamDist, "vSync:setVehicleDirt", [v.id, dirt]);
};

vSync.getVehicleDirt = function(v) {
    return vSync.getVehicleSyncData(v).Dirt;
};

vSync.setVehicleDoorState = function(v, door, state) {
    if (!vehicles.exists(v))
        return;
    let data = vSync.getVehicleSyncData(v);
    data.Door[door] = state;
    vSync.updateVehicleSyncData(v, data);
    mp.players.callInRange(v.position, streamDist, "vSync:setVehicleDoorState", [v.id, door, state]);
};

vSync.getVehicleDoorState = function(v, door) {
    return methods.parseInt(vSync.getVehicleSyncData(v).Door[door]);
};

vSync.setIndicatorLeftToggle = function(v, status) {
    if (!vehicles.exists(v))
        return;
    let data = vSync.getVehicleSyncData(v);
    data.IndicatorLeftToggle = status;
    vSync.updateVehicleSyncData(v, data);
    mp.players.callInRange(v.position, streamDist, "vSync:setIndicatorLeftToggle", [v.id, status]);
};

vSync.getIndicatorLeftToggle = function(v) {
    return vSync.getVehicleSyncData(v).IndicatorLeftToggle;
};

vSync.setIndicatorRightToggle = function(v, status) {
    if (!vehicles.exists(v))
        return;
    let data = vSync.getVehicleSyncData(v);
    data.IndicatorRightToggle = status;
    vSync.updateVehicleSyncData(v, data);
    mp.players.callInRange(v.position, streamDist, "vSync:setIndicatorRightToggle", [v.id, status]);
};

vSync.getIndicatorRightToggle = function(v) {
    return vSync.getVehicleSyncData(v).IndicatorRightToggle;
};

vSync.setEngineState = function(v, status) {
    if (!vehicles.exists(v))
        return;
    let data = vSync.getVehicleSyncData(v);
    data.Engine = status;
    vSync.updateVehicleSyncData(v, data);
    v.engine = status;
    //mp.players.callInRange(v.position, streamDist, "vSync:setEngineState", [v.id, status]);
};

vSync.getEngineState = function(v) {
    if (!vehicles.exists(v))
        return false;
    return v.engine;
};

vSync.setHoodState = function(v, status) {
    if (!vehicles.exists(v))
        return;
    let data = vSync.getVehicleSyncData(v);
    data.Hood = status;
    vSync.updateVehicleSyncData(v, data);
    mp.players.callInRange(v.position, streamDist, "vSync:setHoodState", [v.id, status]);
};

vSync.getHoodState = function(v) {
    if (!vehicles.exists(v))
        return false;
    return vSync.getVehicleSyncData(v).Hood;
};

vSync.setTrunkState = function(v, status) {
    if (!vehicles.exists(v))
        return;
    let data = vSync.getVehicleSyncData(v);
    data.Trunk = status;
    vSync.updateVehicleSyncData(v, data);
    mp.players.callInRange(v.position, streamDist, "vSync:setTrunkState", [v.id, status]);
};

vSync.getTrunkState = function(v) {
    if (!vehicles.exists(v))
        return false;
    return vSync.getVehicleSyncData(v).Trunk;
};

vSync.setInteriorLightState = function(v, status) {
    if (!vehicles.exists(v))
        return;
    let data = vSync.getVehicleSyncData(v);
    data.InteriorLight = status;
    vSync.updateVehicleSyncData(v, data);
    mp.players.callInRange(v.position, streamDist, "vSync:setInteriorLightState", [v.id, status]);
};

vSync.getInteriorLightState = function(v) {
    return vSync.getVehicleSyncData(v).InteriorLight;
};

vSync.setTaxiLightState = function(v, status) {
    if (!vehicles.exists(v))
        return;
    let data = vSync.getVehicleSyncData(v);
    data.TaxiLight = status;
    vSync.updateVehicleSyncData(v, data);
    mp.players.callInRange(v.position, streamDist, "vSync:setTaxiLightState", [v.id, status]);
};

vSync.getTaxiLightState = function(v) {
    return vSync.getVehicleSyncData(v).TaxiLight;
};

vSync.setAnchorState = function(v, status) {
    if (!vehicles.exists(v))
        return;
    let data = vSync.getVehicleSyncData(v);
    data.Anchor = status;
    vSync.updateVehicleSyncData(v, data);
    mp.players.callInRange(v.position, streamDist, "vSync:setAnchorState", [v.id, status]);
};

vSync.getAnchorState = function(v) {
    return vSync.getVehicleSyncData(v).Anchor;
};

vSync.setFreezeState = function(v, status) {
    if (!vehicles.exists(v))
        return;
    let data = vSync.getVehicleSyncData(v);
    data.Freeze = status;
    vSync.updateVehicleSyncData(v, data);
    mp.players.callInRange(v.position, streamDist, "vSync:setFreezeState", [v.id, status]);
};

vSync.getFreezeState = function(v) {
    return vSync.getVehicleSyncData(v).Freeze;
};

vSync.setCollisionState = function(v, status) {
    if (!vehicles.exists(v))
        return;
    let data = vSync.getVehicleSyncData(v);
    data.Collision = status;
    vSync.updateVehicleSyncData(v, data);
    mp.players.callInRange(v.position, streamDist, "vSync:setCollisionState", [v.id, status]);
};

vSync.getCollisionState = function(v) {
    return vSync.getVehicleSyncData(v).Collision;
};

vSync.setExtraState = function(v, status) {
    if (!vehicles.exists(v))
        return;
    let data = vSync.getVehicleSyncData(v);
    data.Extra = status;
    vSync.updateVehicleSyncData(v, data);
    mp.players.callInRange(v.position, streamDist, "vSync:setExtraState", [v.id, status]);
};

vSync.getExtraState = function(v) {
    return vSync.getVehicleSyncData(v).Extra;
};

vSync.setSpotLightState = function(v, status) {
    if (!vehicles.exists(v))
        return;
    let data = vSync.getVehicleSyncData(v);
    data.SpotLight = status;
    vSync.updateVehicleSyncData(v, data);
    mp.players.callInRange(v.position, streamDist, "vSync:setSpotLightState", [v.id, status]);
};

vSync.getSpotLightState = function(v) {
    return vSync.getVehicleSyncData(v).SpotLight;
};

vSync.setLockStatus = function(v, status) {
    if (!vehicles.exists(v))
        return;
    mp.players.callInRange(v.position, streamDist, "vSync:setLockStatus", [v.id, status]);
};

vSync.setBodyHealth = function(v, health) {
    if (!vehicles.exists(v))
        return;
    let data = vSync.getVehicleSyncData(v);
    data.BodyHealth = health;
    v.bodyHealth = health;
    vSync.updateVehicleSyncData(v, data);
};

mp.events.add("playerEnterVehicle", function (player, vehicle) {
    if (vehicles.exists(vehicle)) {

        if (!vSync.has(vehicle))
            vSync.updateVehicleSyncData(vehicle, vSync.VehicleSyncData);

        try {
            if (vehicle.getVariable('fraction_id') || vehicle.getVariable('user_id') || vehicle.getVariable('useless'))
                return;
            vehicles.set(vehicle.id, 'afkTimer', 0);
        }
        catch (e) {
            
        }
    }
});

mp.events.add("playerExitVehicle", function (player, vehicle) {
    setTimeout(function () {
    if (vehicles.exists(vehicle))
        vSync.setEngineState(vehicle, vSync.getEngineState(vehicle));
    }, 1500);

    try {
        for (let i = -1; i < 20; i++)
            vehicle.setOccupant(i, null);
    }
    catch (e) {}
});

mp.events.add('s:vSync:setDirtLevel', (player, vId, level) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh))
        vSync.setVehicleDirt(veh, level);
});

mp.events.add('s:vSync:setEngineStatus', (player, vId, status) => {
    methods.debug('setEngineStatus', status);
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh))
        vSync.setEngineState(veh, status);
});

/*mp.events.add('s:vSync:updateValues', (player, vId, status) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh))
        vSync.setEngineState(player.vehicle, status);
});*/

mp.events.add('s:vSync:setInteriorLightState', (player, vId, status) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh))
        vSync.setInteriorLightState(veh, status);
});

mp.events.add('s:vSync:setTaxiLightState', (player, vId, status) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh))
        vSync.setTaxiLightState(veh, status);
});

mp.events.add('s:vSync:setAnchorState', (player, vId, status) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh))
        vSync.setAnchorState(veh, status);
});

mp.events.add('s:vSync:setFreezeState', (player, vId, status) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh))
        vSync.setFreezeState(veh, status);
});

mp.events.add('s:vSync:setCollisionState', (player, vId, status) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh))
        vSync.setCollisionState(veh, status);
});

mp.events.add('s:vSync:setExtraState', (player, vId, status) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh))
        vSync.setExtraState(veh, status);
});

mp.events.add('s:vSync:setVehicleInteriorColor', (player, vId, color) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh))
        vSync.setVehicleInteriorColor(veh, color);
});

mp.events.add('s:vSync:setVehicleDashboardColor', (player, vId, color) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh))
        vSync.setVehicleDashboardColor(veh, color);
});

mp.events.add('s:vSync:setVehicleTyreSmokeColor', (player, vId, r, g, b) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh))
        vSync.setVehicleTyreSmokeColor(veh, r, g, b);
});

mp.events.add('s:vSync:setSpotLightState', (player, vId, status) => {
    methods.debug('server:vehicles:addFuel', vId, status);
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh))
        vSync.setSpotLightState(veh, status);
});

mp.events.add('s:vSync:setIndicatorLeftState', (player, vId, status) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh))
        vSync.setIndicatorLeftToggle(veh, status);
});

mp.events.add('s:vSync:setIndicatorRightState', (player, vId, status) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh))
        vSync.setIndicatorRightToggle(veh, status);
});

mp.events.add('s:vSync:setTrunkState', (player, vId, status) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh))
        vSync.setTrunkState(veh, status);
});

mp.events.add('s:vSync:setHoodState', (player, vId, status) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh))
        vSync.setHoodState(veh, status);
});

mp.events.add('s:vSync:setDoorData', (player, vId, doorState1, doorState2, doorState3, doorState4, doorState5, doorState6, doorState7, doorState8) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh)) {
        vSync.setVehicleDoorState(veh, 0, doorState1);
        vSync.setVehicleDoorState(veh, 1, doorState2);
        vSync.setVehicleDoorState(veh, 2, doorState3);
        vSync.setVehicleDoorState(veh, 3, doorState4);
        vSync.setVehicleDoorState(veh, 4, doorState5);
        vSync.setVehicleDoorState(veh, 5, doorState6);
        vSync.setVehicleDoorState(veh, 6, doorState7);
        vSync.setVehicleDoorState(veh, 7, doorState8);
    }
});

mp.events.add('s:vSync:setWindowData', (player, vId, w1, w2, w3, w4) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh)) {
        vSync.setVehicleWindowState(veh, 0, w1);
        vSync.setVehicleWindowState(veh, 1, w2);
        vSync.setVehicleWindowState(veh, 2, w3);
        vSync.setVehicleWindowState(veh, 3, w4);
    }
});

mp.events.add('s:vSync:setWindowDataIdx', (player, vId, idx, w) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh)) {
        vSync.setVehicleWindowState(veh, idx, w);
    }
});

mp.events.add('s:vSync:setWheelData', (player, vId, w1, w2, w3, w4, w5, w6, w7, w8, w9, w10) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh)){
        vSync.setVehicleWheelState(player.vehicle, 0, w1);
        vSync.setVehicleWheelState(player.vehicle, 1, w2);
        vSync.setVehicleWheelState(player.vehicle, 2, w3);
        vSync.setVehicleWheelState(player.vehicle, 3, w4);
        vSync.setVehicleWheelState(player.vehicle, 5, w5);
        vSync.setVehicleWheelState(player.vehicle, 6, w6);
        vSync.setVehicleWheelState(player.vehicle, 7, w7);
        vSync.setVehicleWheelState(player.vehicle, 8, w8);
        vSync.setVehicleWheelState(player.vehicle, 9, w9);
        vSync.setVehicleWheelState(player.vehicle, 10, w10);
    }
});

mp.events.add('s:vSync:setBodyHealth', (player, vId, health) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh)) {
        veh.bodyHealth = health;
    }
});

mp.events.add('s:vSync:setEngineHealth', (player, vId, health) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh)) {
        veh.engineHealth = health;
    }
});

mp.events.add('s:vSync:playSound', (player, vId, pref, value) => {
    if (mp.players.exists(player)) {
        vSync.playSound(vId, pref, value);
    }
});

mp.events.add('s:vSync:stopSound', (player, vId, pref) => {
    if (mp.players.exists(player)) {
        vSync.stopSound(vId, pref);
    }
});

mp.events.add('s:vSync:setSirenState', (player, vId, state) => {
    if (mp.players.exists(player)) {
        vSync.setSirenState(vId, state);
    }
});

mp.events.add('s:vSync:radioChange', (player, vId, state) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh)) {
        let data = vSync.getVehicleSyncData(veh);
        data.RadioState = state;
        vSync.updateVehicleSyncData(veh, data);
        //mp.players.callInRange(veh.position, streamDist, "vSync:radioChange", [veh.id, state]);
    }
});

mp.events.add('server:vehicles:addFuel', (player, vId, fuel) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh)) {
        vehicles.addFuel(veh, fuel)
    }
});

mp.events.add('server:vehicles:setNumberPlate', (player, vId, number) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh)) {
        vehicles.setNumberPlate(veh, number)
    }
});

mp.events.add('server:vehicles:speedLimit', (player, vId, speed) => {
    let veh = mp.vehicles.at(vId);
    if (mp.players.exists(player) && vehicles.exists(veh)) {
        vehicles.getOccupants(veh).forEach(p => {
            if (user.isLogin(p) && p.seat === -1)
                p.call('client:setNewMaxSpeedServer', [speed]);
        });
    }
});