import methods from '../modules/methods';
import Container from '../modules/data';
import jobPoint from '../manager/jobPoint';
import weather from '../manager/weather';
import user from '../user';
import photo from "./photo";
import family from "../property/family";
import ui from "../modules/ui";

let gr6 = {};

let isProcess = false;
let _checkpointId = -1;
let price = 0;

gr6.markers = [
    [253.4611, 220.7204, 106.2865],
    [148.5, -1039.971, 29.37775],
    [1175.054, 2706.404, 38.09407],
    [-1212.83, -330.3573, 37.78702],
    [314.3541, -278.5519, 54.17077],
    [-2962.951, 482.8024, 15.7031],
    [-350.6871, -49.60739, 49.04258],
    [-111.1722, 6467.846, 31.62671],
    [-113.3064, 6469.969, 31.62672],
    [138.7087, -1705.711, 28.29162],
    [1214.091, -472.9952, 65.208],
    [-276.4055, 6226.398, 30.69552],
    [-1282.688, -1117.432, 5.990113],
    [1931.844, 3730.305, 31.84443],
    [-33.34319, -154.1892, 56.07654],
    [-813.5332, -183.2378, 36.5689],
    [22.08832, -1106.986, 29.79703],
    [252.17, -50.08245, 69.94106],
    [842.2239, -1033.294, 28.19486],
    [-661.947, -935.6796, 21.82924],
    [-1305.899, -394.5485, 36.69577],
    [809.9118, -2157.209, 28.61901],
    [2567.651, 294.4759, 107.7349],
    [-3171.98, 1087.908, 19.83874],
    [-1117.679, 2698.744, 17.55415],
    [1693.555, 3759.9, 33.70533],
    [-330.36, 6083.885, 30.45477],
    [-1148.878, -2000.123, 12.18026],
    [-347.0815, -133.3432, 38.00966],
    [726.0679, -1071.613, 27.31101],
    [-207.0201, -1331.493, 33.89437],
    [1187.764, 2639.15, 37.43521],
    [101.0262, 6618.267, 31.43771],
    [472.2666, -1310.529, 28.22178],
    [26.213, -1345.442, 29.49702],
    [-1223.059, -906.7239, 12.32635],
    [-1487.533, -379.3019, 40.16339],
    [1135.979, -982.2205, 46.4158],
    [1699.741, 4924.002, 42.06367],
    [374.3559, 327.7817, 103.5664],
    [-3241.895, 1001.701, 12.83071],
    [-3039.184, 586.3903, 7.90893],
    [-2968.295, 390.9566, 15.04331],
    [547.8511, 2669.281, 42.1565],
    [1165.314, 2709.109, 38.157721],
    [1960.845, 3741.882, 32.34375],
    [1729.792, 6414.979, 35.03723],
];

gr6.grabMarkers = [
    [2544.863, 2580.673, 36.94484],
    [2552.278, 4672.925, 32.95345],
    [2307.159, 4888.141, 40.80823],
    [1711.456, 4747.02, 40.94597],
    [2413.809, 4991.302, 45.2426],
    [408.0634, 6493.51, 27.09958],
    [-24.08177, 6459.26, 30.41778],
    [47.56932, 6299.511, 30.23523],
    [723.0118, -822.5493, 23.72392],
    [906.7827, -1518.068, 29.43467],
    [845.0453, -2360.232, 29.34108],
    [69.28804, -1428.331, 28.31164],
    [388.5147, 62.68007, 96.97788],
    [-452.1371, 292.7735, 82.2362],
    [-457.0465, -51.68466, 43.51545],
    [-414.9887, -2182.779, 9.318105],
    [-195.8015, -2679.408, 5.006399],
    [254.6616, -3057.888, 4.782318],
    [1234.291, -3204.701, 4.641251],
];

gr6.start = function() {
    if (mp.players.local.vehicle.getVariable('job') != 10)
        return;
    if (mp.players.local.dimension > 0) {
        mp.game.ui.notifications.show('~r~В интерьерах данное действие запрещено');
        return;
    }
    mp.game.ui.notifications.showWithPicture('Gruppe6', "~g~Работа", 'Скинул координаты точки', "CHAR_BANK_BOL", 1);
    gr6.findRandomPickup();
};

gr6.unload = function() {
    if (methods.distanceToPos(new mp.Vector3(-5.008303642272949, -670.9888916015625, 31.338104248046875), mp.players.local.position) > 50) {
        mp.game.ui.notifications.show('~r~Деньги надо разгружать на базе');
        user.setWaypoint(-5.008303642272949, -670.9888916015625);
        return;
    }
    mp.events.callRemote('server:gr6:unload');
};

gr6.deleteVeh = function() {
    if (methods.distanceToPos(new mp.Vector3(-5.008303642272949, -670.9888916015625, 31.338104248046875), mp.players.local.position) > 50) {
        mp.game.ui.notifications.show('~r~Транспорт можно сдать только на базе');
        user.setWaypoint(-5.008303642272949, -670.9888916015625);
        return;
    }
    mp.events.callRemote('server:gr6:delete');
    jobPoint.delete();
};

gr6.grab = function() {

    if (weather.getHour() < 22 && weather.getHour() > 6) {
        mp.game.ui.notifications.show('~r~Доступно только с 22 до 6 утра игрового времени');
        return;
    }

    let isFind = false;

    gr6.grabMarkers.forEach(function (item) {
        if (methods.distanceToPos(new mp.Vector3(item[0], item[1], item[2]), mp.players.local.position) < 20) {
            mp.events.callRemote('server:gr6:grab');
            user.giveWanted(25, 'Ограбление инкассаторского ТС');
            isFind = true;
            user.removeRep(50);
            return;
        }
    });

    if (!isFind) {
        let pickupId = methods.getRandomInt(0, gr6.grabMarkers.length - 1);
        user.setWaypoint(gr6.grabMarkers[pickupId][0], gr6.grabMarkers[pickupId][1]);
        mp.game.ui.notifications.show('~y~Точка для ограбления транспорта');
    }
};

gr6.findRandomPickup = function() {
    if (!isProcess) {
        let pickupId = methods.getRandomInt(0, gr6.markers.length - 1);
        mp.events.callRemote('server:gr6:findPickup', gr6.markers[pickupId][0], gr6.markers[pickupId][1], gr6.markers[pickupId][2]);
    } else {
        mp.game.ui.notifications.show('~r~Для начала нужно завершить текущее задание');
        mp.game.ui.notifications.show('~r~Передайте это напарникам');
    }
};

gr6.stop = function() {
    isProcess = false;
    _checkpointId = -1;
    price = 0;
    jobPoint.delete();
};

gr6.workProcess = function() {
    jobPoint.delete();
    Container.Data.SetLocally(0, 'gr6Money', price + methods.getRandomInt(250, 500));
    Container.Data.SetLocally(0, 'gr6MoneyBag', true);
    if (user.getCache('hand') > 0)
        user.setComponentVariation(5, 45, 0);
    mp.game.ui.notifications.show('~y~Вы взяли сумку с деньгами, садитесь в транспорт');
    isProcess = false;
};

mp.events.add("playerEnterCheckpoint", (checkpoint) => {
    try {
        if (!isProcess)
            return;
        if (_checkpointId == -1 || _checkpointId == undefined)
            return;
        if (checkpoint.id == _checkpointId)
            gr6.workProcess();
    }
    catch (e) {
        
    }
});

mp.events.add("client:createGr6Checkpoint", (x, y, z) => {

    if (isProcess) {
        mp.game.ui.notifications.show('~r~Для начала нужно завершить текущее задание');
        return;
    }

    isProcess = true;
    let pos = new mp.Vector3(x, y, z);
    price = methods.parseFloat(methods.distanceToPos(pos, mp.players.local.position) / 4);
    if (price > 2200)
        price = 2200;
    _checkpointId = jobPoint.create(pos, true);
});

mp.events.add("playerEnterVehicle", async function (vehicle, seat) {

    try {

        if(user.isLogin()) {
            if (user.getCache("online_time") < 169) {
                mp.game.ui.notifications.show('~r~Подсказка!\n~g~Чтобы запустить двигатель, нажмите ~s~2\n\nНажмите ~g~L~s~ чтобы открыть или закрыть ТС');
            }
        }

        mp.events.call('client:setNewMaxSpeed', 0);
        mp.events.call('client:setNewMaxSpeedServer', 0);

        if (user.getCache('job') != 10)
            return;
        if (vehicle.getVariable('job') == 10) {
            if (Container.Data.HasLocally(0, 'gr6Money') && Container.Data.HasLocally(0, 'gr6MoneyBag')) {
                let money = Container.Data.GetLocally(0, 'gr6Money');
                mp.events.callRemote('server:gr6:dropCar', money * 100, vehicle.remoteId);
                if (user.getCache('hand') > 0)
                    user.setComponentVariation(5, 0, 0);

                Container.Data.ResetLocally(0, 'gr6Money');
                Container.Data.ResetLocally(0, 'gr6MoneyBag');
                mp.game.ui.notifications.show('~g~Вы загрузили деньги в транспорт');
                user.giveJobSkill();

                let fId = user.getCache('family_id');
                if (fId > 0) {
                    let fData = await family.getData(fId);
                    if (fData.get('level') === 4) {
                        if (fData.get('exp') > 2500) {
                            family.addMoney(fId, 1500000, 'Премия за достижения 5 уровня');
                            family.set(fId, 'level', 5);
                            family.set(fId, 'exp', 0);
                        }
                        else
                            family.set(fId, 'exp', fData.get('exp') + 1);
                    }
                }
            }
        }
        else if (Container.Data.HasLocally(0, 'gr6Money') && Container.Data.HasLocally(0, 'gr6MoneyBag')) {
            Container.Data.ResetLocally(0, 'gr6Money');
            Container.Data.ResetLocally(0, 'gr6MoneyBag');
            mp.game.ui.notifications.show('~r~Вы сели в не тот транспорт, деньги были удалены.');

            if (user.getCache('hand') > 0)
                user.setComponentVariation(5, 0, 0);
        }
    }
    catch (e) {
        
    }
});

export default gr6;