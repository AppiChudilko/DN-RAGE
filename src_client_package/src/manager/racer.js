
import methods from "../modules/methods";

import vehicles from "../property/vehicles";

import inventory from "../inventory";
import phone from "../phone";
import menuList from "../menuList";
import user from "../user";

import quest from "./quest";

let racer = {};

let currentRace = null;
let currentCpId = 0;
let currentCp = null;
let currentBlip = null;
let currentBlipSmall = null;
let nextCp = null;
let inRace = false;
let racerSize = 12;
let repeat = 0;

racer.createCurrentCp = function(type, pos, dir) {
    try {
        racer.currentCpDestroy();
        currentCp = mp.checkpoints.new(type, pos, racerSize,{direction: dir, color: [ 255, 235, 59, 150 ], visible: true, dimension: 9999});
        currentBlip = mp.blips.new(1, new mp.Vector3(pos.x, pos.y, pos.z - currentRace.offsetZ), { color: 5, scale: 0.9, ame: 'Гонка', drawDistance: 100, shortRange: false, dimension: -1 });
    }
    catch (e) {
        console.log(e);
    }
};

racer.createNextCp = function(type, pos, dir) {
    try {
        racer.nextCpDestroy();
        nextCp = mp.checkpoints.new(type, pos, racerSize / 2 + 1,{direction: dir, color: [ 255, 235, 59, 70 ], visible: true, dimension: 9999});
        currentBlipSmall = mp.blips.new(1, new mp.Vector3(pos.x, pos.y, pos.z - currentRace.offsetZ), { color: 5, scale: 0.4, ame: 'Гонка', drawDistance: 100, shortRange: true, dimension: -1 });
    }
    catch (e) {
        console.log(e);
    }
};

racer.currentCpDestroy = function() {
    try {
        if (typeof currentCp == 'object' && mp.checkpoints.exists(currentCp))
            currentCp.destroy();
        if (typeof currentBlip == 'object' && mp.blips.exists(currentBlip))
            currentBlip.destroy();
    }
    catch (e) {
        console.log(e);
    }
};

racer.nextCpDestroy = function() {
    try {
        if (typeof nextCp == 'object' && mp.checkpoints.exists(nextCp))
            nextCp.destroy();
        if (typeof currentBlipSmall == 'object' && mp.blips.exists(currentBlipSmall))
            currentBlipSmall.destroy();
    }
    catch (e) {
        console.log(e);
    }
};

racer.isInRace = function() {
    return inRace;
};

mp.events.add("client:raceUpdate", (json) => {
    try {
        racer.currentCpDestroy();
        racer.nextCpDestroy();
    }
    catch (e) {

    }
    try {

        currentCpId = 0;
        currentCp = null;
        currentBlip = null;
        nextCp = null;
        inRace = true;
        currentRace = JSON.parse(json);

        try {
            racerSize = currentRace.size;
        }
        catch (e) {
            racerSize = 12;
        }
        try {
            repeat = currentRace.repeat;
        }
        catch (e) {
            repeat = 0;
        }

        inventory.hide();
        phone.hide();
        menuList.hide();

        methods.blockKeys(true);
        mp.players.local.setConfigFlag(32, false);

        let posCurrent = currentRace.posList[currentCpId];
        let posNext = currentRace.posList[currentCpId + 1];

        racer.createCurrentCp(0, new mp.Vector3(posCurrent[0], posCurrent[1], posCurrent[2] + currentRace.offsetZ), new mp.Vector3(posNext[0], posNext[1], posNext[2]));

        setTimeout(function () {
            vehicles.setRandomTunning();
        }, methods.getRandomInt(500, 5000))
    } catch (e) {

        inRace = false;
        mp.events.callRemote('server:race:exit');
        user.addCashMoney(1000, 'Возврат средств');
        mp.game.ui.notifications.show(`~r~Произошла ошибка, взнос был возвращен`);

        methods.debug(e);
    }
});

mp.events.add("playerEnterCheckpoint", (checkpoint) => {
    if (!inRace)
        return;

    if (!mp.players.local.vehicle)
        return;

    currentCpId++;

    mp.game.audio.playSound(-1, "CHECKPOINT_PERFECT", "HUD_MINI_GAME_SOUNDSET", false, 0, true);

    try {
        user.setHealth(100);
    }
    catch (e) {

    }
    try {
        let posCurrent = currentRace.posList[currentCpId];

        if (currentCpId === currentRace.posList.length) {
            racer.nextCpDestroy();

            if (repeat > 0) {
                currentCpId = 0;
                repeat--;

                let posNext = currentRace.posList[currentCpId + 1];
                racer.createCurrentCp(0, new mp.Vector3(posCurrent[0], posCurrent[1], posCurrent[2] + currentRace.offsetZ), new mp.Vector3(posNext[0], posNext[1], posNext[2]));
                racer.createNextCp(0, new mp.Vector3(posNext[0], posNext[1], posNext[2] + currentRace.offsetZ - 5), new mp.Vector3(posNext[0], posNext[1], posNext[2]));
            }
            else {
                racer.createCurrentCp(4, new mp.Vector3(posCurrent[0], posCurrent[1], posCurrent[2] + currentRace.offsetZ), new mp.Vector3(0, 0, 0));
            }
        }
        else if (currentCpId > currentRace.posList.length) {
            racer.currentCpDestroy();
            mp.events.callRemote('server:race:finish');
            inRace = false;
            methods.blockKeys(false);
            quest.standart(false, -1, 10);
        }
        else {
            racer.nextCpDestroy();

            if (currentCpId < currentRace.posList.length - 1) {
                let posNext = currentRace.posList[currentCpId + 1];
                racer.createCurrentCp(0, new mp.Vector3(posCurrent[0], posCurrent[1], posCurrent[2] + currentRace.offsetZ), new mp.Vector3(posNext[0], posNext[1], posNext[2]));
                racer.createNextCp(0, new mp.Vector3(posNext[0], posNext[1], posNext[2] + currentRace.offsetZ - 5), new mp.Vector3(posNext[0], posNext[1], posNext[2]));
            }
            else {
                if (repeat > 0) {
                    currentCpId = 0;
                    repeat--;

                    let posNext = currentRace.posList[currentCpId];
                    racer.createCurrentCp(0, new mp.Vector3(posCurrent[0], posCurrent[1], posCurrent[2] + currentRace.offsetZ), new mp.Vector3(posNext[0], posNext[1], posNext[2]));
                    racer.createNextCp(0, new mp.Vector3(posNext[0], posNext[1], posNext[2] + currentRace.offsetZ - 5), new mp.Vector3(posNext[0], posNext[1], posNext[2]));
                }
                else {
                    racer.createCurrentCp(4, new mp.Vector3(posCurrent[0], posCurrent[1], posCurrent[2] + currentRace.offsetZ), new mp.Vector3(0, 0, 0));
                }
            }
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add("playerDeath", function (player, reason, killer) {
    if (!user.isLogin() || !inRace)
        return;
    try {
        inRace = false;
        mp.events.callRemote('server:race:exit');
        methods.blockKeys(false);
    }
    catch (e) {

    }
});

mp.events.add('render', () => {
    try {
        if (inRace) {
            mp.game.controls.disableControlAction(0,75,true);
        }
    }
    catch (e) {

    }
});

mp.keys.bind(0x46, true, async function() {
    if (!user.isLogin() || !inRace)
        return;
    try {
        let posCurrent = currentRace.posList[currentCpId - 1];
        mp.game.ui.notifications.show('~b~Спавн через ~s~3 сек');
        await methods.sleep(1000);
        mp.game.ui.notifications.show('~b~Спавн через ~s~2 сек');
        await methods.sleep(1000);
        mp.game.ui.notifications.show('~b~Спавн через ~s~1 сек');
        await methods.sleep(1000);
        if (!inRace)
            return;
        mp.events.callRemote('server:user:fixNearestVehicle');
        user.teleportVeh(posCurrent[0], posCurrent[1], posCurrent[2], posCurrent[3]);
    }
    catch (e) {
        
    }
});

mp.keys.bind(0x42, true, function() {
    if (!user.isLogin() || !inRace)
        return;
    try {
        vehicles.engineVehicle();
    }
    catch (e) {

    }
});

mp.keys.bind(0x1B, true, function() {
    if (!user.isLogin() || !inRace)
        return;
    try {
        racer.currentCpDestroy();
        racer.nextCpDestroy();
        inRace = false;
        mp.events.callRemote('server:race:exit');
        methods.blockKeys(false);
    }
    catch (e) {

    }
});

export default racer;