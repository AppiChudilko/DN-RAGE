
import methods from "../modules/methods";

import vehicles from "../property/vehicles";

import inventory from "../inventory";
import phone from "../phone";
import menuList from "../menuList";
import user from "../user";

import quest from "./quest";
import ui from "../modules/ui";
import racer from "./racer";

let copsRacer = {};

copsRacer.isInLobby = function() {
    return timeoutUpdate;
};

let timeoutUpdate = null;

mp.events.add("client:copsRacer:update", (timer, countLobby, timerTake) => {
    if (timeoutUpdate) {
        clearTimeout(timeoutUpdate);
        timeoutUpdate = null;
    }
    try {
        if (timer === 0)
            ui.showDialog(`Ожидание игроков, осталось ${4 - countLobby} чел.`, '', 'none', [], ui.dialogTypes.centerBottom, 0, false, false);
        else
            ui.showDialog(`Осталось времени ${timer} сек.~br~В лобби ${countLobby} чел.`, '', 'none', [], ui.dialogTypes.centerBottom, 0, false, false);
        timeoutUpdate = setTimeout(function () {
            ui.hideDialog();
        }, 5000);
    }
    catch (e) {
        ui.hideDialog();
    }
});

mp.events.add("client:copsRacer:tunning", () => {
    vehicles.setRandomTunning();
});

mp.keys.bind(0x42, true, function() {
    if (!user.isLogin() || !timeoutUpdate)
        return;
    try {
        vehicles.engineVehicle();
    }
    catch (e) {

    }
});

export default copsRacer;