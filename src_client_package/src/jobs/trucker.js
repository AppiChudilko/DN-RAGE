import Container from '../modules/data';
import methods from '../modules/methods';
import user from '../user';
import coffer from '../coffer';
import jobPoint from '../manager/jobPoint';

let trucker = {};

let isProcess = false;
let isSpawn = false;
let type = 0;
let _checkpointId = -1;
let trailerName = '';

let offerId = 0;
let toPosX = 0;
let toPosY = 0;
let toPosZ = 0;
let fromPosX = 0;
let fromPosY = 0;
let fromPosZ = 0;

trucker.loadAll = function() {
    setInterval(trucker.timer, 5000);
};

trucker.acceptOffer1 = function(id, name, company, x, y, z, px, py, pz, price) {
    type = 1;
    _checkpointId = jobPoint.create(new mp.Vector3(x, y, z), true, 6);

    offerId = id;
    toPosX = px;
    toPosY = py;
    toPosZ = pz;
};

trucker.acceptOffer2 = function(id, name, company, trName, cl1, cl2, liv, x, y, z, rot, px, py, pz, price) {
    type = 2;
    _checkpointId = jobPoint.create(new mp.Vector3(x, y, z - 3), true, 6);

    offerId = id;
    fromPosX = x;
    fromPosY = y;
    fromPosZ = z;
    toPosX = px;
    toPosY = py;
    toPosZ = pz;
    trailerName = trName;
};

trucker.notify = function(text, title = 'Информация') {
    methods.debug('trucker.notify');
    mp.game.ui.notifications.showWithPicture(title, "Грузоперевозки", text, "DIA_DRIVER", 2);
};

trucker.workProcess1 = function() {
    user.showLoadDisplay();
    isProcess = true;
    jobPoint.delete();

    setTimeout(function () {
        user.hideLoadDisplay();
        trucker.notify('Вы забрали груз, отвезите его заказчику');
        _checkpointId = jobPoint.create(new mp.Vector3(toPosX, toPosY, toPosZ), true, 5);
    }, 5000);
};

trucker.doneOffer = function() {

    if (type == 2) {
        if (!mp.players.local.vehicle || !mp.players.local.vehicle.isAttachedToTrailer()) {
            trucker.notify('У Вас нет прицепа');
            return;
        }
    }

    user.showLoadDisplay();
    jobPoint.delete();
    type = 0;
    isProcess = false;
    isSpawn = false;

    setTimeout(function () {
        mp.events.callRemote('server:trucker:doneOffer', offerId);
    }, 4000);

    setTimeout(function () {
        user.hideLoadDisplay();

        offerId = 0;
        toPosX = 0;
        toPosY = 0;
        toPosZ = 0;
        fromPosX = 0;
        fromPosY = 0;
        fromPosZ = 0;
    }, 5000);
};

trucker.stop = function() {

    user.showLoadDisplay();
    jobPoint.delete();
    type = 0;
    isProcess = false;
    isSpawn = false;

    user.removeCashMoney(500);
    coffer.addMoney(500);

    setTimeout(function () {
        mp.events.callRemote('server:trucker:stop', offerId);
    }, 4000);

    setTimeout(function () {
        user.hideLoadDisplay();

        offerId = 0;
        toPosX = 0;
        toPosY = 0;
        toPosZ = 0;
        fromPosX = 0;
        fromPosY = 0;
        fromPosZ = 0;
    }, 5000);
};

trucker.isProcess = function() {
    return isProcess;
};

trucker.timer = function() {
    if (isSpawn && !isProcess) {
        if (mp.players.local.vehicle && mp.players.local.vehicle.isAttachedToTrailer()) {
            jobPoint.delete();
            isProcess = true;
            trucker.notify('Вы забрали груз, отвезите его заказчику');
            _checkpointId = jobPoint.create(new mp.Vector3(toPosX, toPosY, toPosZ), true, 5);
        }
        return;
    }
    if (type == 2 && isProcess == false && methods.distanceToPos(new mp.Vector3(fromPosX, fromPosY, fromPosZ), mp.players.local.position) < 50) {
        mp.events.callRemote('server:trucker:trySpawnTrailer', offerId);
    }
};

mp.events.add("client:jobs:trucker:isSpawn", (cbSpawn) => {
    if (!cbSpawn) {
        //trucker.notify('~r~Ваш груз готовится к погрузке, ожидайте');
        trucker.notify('~r~Перед вами стоит чужой груз, ждите когда его заберут');
        return;
    }
    trucker.notify('~g~Ваш груз был загружен и стоит на точке');
    isSpawn = true;
});

mp.events.add("playerEnterCheckpoint", (checkpoint) => {
    if (_checkpointId == -1 || _checkpointId == undefined)
        return;

    let veh = mp.players.local.vehicle;
    if (veh && mp.vehicles.exists(veh)) {
        let vInfo = methods.getVehicleInfo(veh.model);
        if (vInfo.class_name === 'Vans' || vInfo.class_name === 'Commercials' || vInfo.class_name === 'Planes' || vInfo.class_name === 'Boats')
            if (checkpoint.id === _checkpointId) {
                if (isProcess) {
                    trucker.doneOffer();
                }
                else {
                    if (type === 1)
                        trucker.workProcess1();
                }
            }
    }
});

export default trucker;