import user from "../user";
import methods from "../modules/methods";
import vSync from "./vSync";
import vehicles from "../property/vehicles";

let scaleform = {};

/*
mp.game.graphics.requestScaleformMovie("MP_CAR_STATS");

private Scaleform sf = new Scaleform("PLAYER_SWITCH_STATS_PANEL");

public void SetLabels() {
    PushScaleformMovieFunction(sf.Handle, "SET_STATS_LABELS");
    PushScaleformMovieFunctionParameterInt(116);
    PushScaleformMovieFunctionParameterBool(true);

    PushScaleformMovieFunctionParameterInt(Stats.RANK.value);
    BeginTextCommandScaleformString("TR_RANKNUM");
    EndTextCommandScaleformString();


    PushScaleformMovieFunctionParameterInt(Stats.STAMINA.value);
    BeginTextCommandScaleformString("PS_STAMINA");
    EndTextCommandScaleformString();

    PushScaleformMovieFunctionParameterInt(Stats.LUNG.value);
    BeginTextCommandScaleformString("PS_LUNG");
    EndTextCommandScaleformString();

    PushScaleformMovieFunctionParameterInt(Stats.STRENGTH.value);
    BeginTextCommandScaleformString("PS_STRENGTH");
    EndTextCommandScaleformString();

    PushScaleformMovieFunctionParameterInt(Stats.DRIVING.value);
    BeginTextCommandScaleformString("PS_DRIVING");
    EndTextCommandScaleformString();

    PushScaleformMovieFunctionParameterInt(Stats.FLYING.value);
    BeginTextCommandScaleformString("PS_FLYING");
    EndTextCommandScaleformString();

    PushScaleformMovieFunctionParameterInt(Stats.SHOOTING.value);
    BeginTextCommandScaleformString("PS_SHOOTING");
    EndTextCommandScaleformString();

    PushScaleformMovieFunctionParameterInt(Stats.STEALTH.value);
    BeginTextCommandScaleformString("PS_STEALTH");
    EndTextCommandScaleformString();

    PushScaleformMovieFunctionParameterInt(0);
    BeginTextCommandScaleformString("PCARD_MENTAL_STATE");
    EndTextCommandScaleformString();

    PopScaleformMovieFunctionVoid();
}

public void Render() {
    ScreenDrawPositionBegin(82, 67);
    ScreenDrawPositionRatio(0f, 0f, 0f, 0f);
    DrawScaleformMovie(sf.Handle,
        (0.042f + (((0.140625f * 1) * 1.3333f) * 0.5f)), 0.006f,
        ((0.120625f * 1) * 1.3333f), (0.3875f * 1),
        255, 255, 255, 255, 0);
    ScreenDrawPositionEnd();
}*/

let scaleList = [
    mp.game.graphics.requestScaleformMovie("mp_car_stats_01"),
    mp.game.graphics.requestScaleformMovie("mp_car_stats_02"),
    mp.game.graphics.requestScaleformMovie("mp_car_stats_03"),
    mp.game.graphics.requestScaleformMovie("mp_car_stats_04"),
    mp.game.graphics.requestScaleformMovie("mp_car_stats_05"),
    mp.game.graphics.requestScaleformMovie("mp_car_stats_06"),
    mp.game.graphics.requestScaleformMovie("mp_car_stats_07"),
    mp.game.graphics.requestScaleformMovie("mp_car_stats_08"),
    mp.game.graphics.requestScaleformMovie("mp_car_stats_09"),
];

scaleform.isPedDrivingAVehicle = function() {
    try {

    }
    catch (e) {
        methods.debug(e);
    }
    return false;
};

/*let vehicleList = new Map();
mp.events.add("entityStreamIn", (entity) => {
    try {
        if (!user.isLogin())
            return;
        if (entity.type === "vehicle") {
            if (!mp.vehicles.exists(entity))
                return;
            if (entity.getVariable('s_name')) {
                let countSeat = entity.getMaxNumberOfPassengers() * 10;
                if (countSeat > 100)
                    countSeat = 100;

                let maxSpeed = 450;
                let speed = vehicles.getSpeedMax(entity.model) / maxSpeed * 100;
                if (speed > 100)
                    speed = 100;

                entity.statMaxSpeed = speed;
                entity.statMaxPass = countSeat;
                vehicleList.set(entity.remoteId.toString(), entity);
            }
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add("entityStreamOut", (entity) =>
{
    try {
        if (entity.type === "vehicle") {
            vehicleList.reset(entity.remoteId.toString());
        }
    }
    catch (e) {
        methods.debug(e);
    }
});


mp.events.add('render', () => {

    try {
        let idx = 0;
        let pos = mp.players.local.position;
        vehicleList.forEach(v => {
            if (methods.distanceToPos(v.position, pos) > 20 || idx > 9)
                return;
            mp.game.graphics.pushScaleformMovieFunction(scaleList[idx], 'SET_VEHICLE_INFOR_AND_STATS');
            mp.game.graphics.pushScaleformMovieFunctionParameterString(v.getVariable('s_name'));
            mp.game.graphics.pushScaleformMovieFunctionParameterString(methods.moneyFormat(v.getVariable('s_price'), 0));
            mp.game.graphics.pushScaleformMovieFunctionParameterString('CHAR_ASHLEY');
            mp.game.graphics.pushScaleformMovieFunctionParameterString('CHAR_ASHLEY');
            mp.game.graphics.pushScaleformMovieFunctionParameterString('Скорость');
            mp.game.graphics.pushScaleformMovieFunctionParameterString('Расход');
            mp.game.graphics.pushScaleformMovieFunctionParameterString('Багажник');
            mp.game.graphics.pushScaleformMovieFunctionParameterString('Вместимость');
            mp.game.graphics.pushScaleformMovieFunctionParameterInt(v.statMaxSpeed);
            mp.game.graphics.pushScaleformMovieFunctionParameterInt(v.getVariable('s_fuel'));
            mp.game.graphics.pushScaleformMovieFunctionParameterInt(v.getVariable('s_stock'));
            mp.game.graphics.pushScaleformMovieFunctionParameterInt(v.statMaxPass);
            mp.game.graphics.popScaleformMovieFunctionVoid();
            let tRot = v.getRotation(0);
            let offset = v.getOffsetFromInWorldCoords(3.5, 1, 0);
            mp.game.graphics.drawScaleformMovie3d(scaleList[idx],offset.x, offset.y, v.position.z + 6, 0, 180, tRot.z, 0.0, 1.0, 0.0, 7.0, 5, 7.0, 0);
            idx++;
        });
    }
    catch (e) {}
});*/
/*
mp.events.add('render', () => {

    mp.game.graphics.pushScaleformMovieFunction(0, 'SET_PLAYER_NAME');
    mp.game.graphics.pushScaleformMovieFunctionParameterString('SET NAME TEXT');
    mp.game.graphics.popScaleformMovieFunctionVoid();
    mp.game.graphics.pushScaleformMovieFunction(0, 'SET_SPEAKER_STATE');
    mp.game.graphics.pushScaleformMovieFunctionParameterBool(false);
    mp.game.graphics.popScaleformMovieFunctionVoid();
    mp.game.graphics.drawScaleformMovie3d(0, mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z + 1, 0, 180, 41, 0.0, 1.0, 0.0, 5.0, 4.0, 5.0, 0);
});*/

export default scaleform;