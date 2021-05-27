import methods from '../modules/methods';

import Container from '../modules/data';
import ui from '../modules/ui';

import achievement from '../manager/achievement';

import timer from "./timer";
import jail from './jail';

import user from '../user';
import coffer from "../coffer";

let hosp = {};

hosp.pos1 = new mp.Vector3(320.7169494628906, -584.0098876953125, 42.28400802612305);
hosp.pos2 = new mp.Vector3(-259.3686218261719, 6327.6416015625, 31.420677185058594);
hosp.pos3 = new mp.Vector3(1827.4207763671875, 3676.67138671875, 33.27007293701172);
hosp.pos4 = new mp.Vector3(4961.6123046875, -5790.55078125, 25.26630401611328);

hosp.posArmy = new mp.Vector3(556.9434204101562, -3125.037841796875, 17.76858139038086);

let hospList = [
    hosp.pos1,
    hosp.pos2,
    hosp.pos3,
    hosp.pos4,
];

let prvTime = 0;

hosp.findNearest = function(pos) {
    methods.debug('shop.findNearest');
    let prevPos = new mp.Vector3(9999, 9999, 9999);
    hospList.forEach(function (item) {
        let shopPos = item;
        if (methods.distanceToPos(shopPos, pos) < methods.distanceToPos(prevPos, pos))
            prevPos = shopPos;
    });

    if (user.isUsmc())
        return hosp.posArmy;
    return prevPos;
};

hosp.timer = function() {

    try {
        if (user.isLogin()) {
            if (user.getCache('med_time') > 1) {

                if (user.getCache('jail_time') > 0) {
                    user.set('med_time', 0);
                    prvTime = 0;
                    jail.toJail(user.getCache('jail_time'), user.getCache('jail_type'));
                    return;
                }

                user.set('med_time', user.getCache('med_time') - 1);

                if (prvTime > user.getCache('med_time') + 20)
                {
                    user.kickAntiCheat("Cheat Engine");
                    return;
                }
                prvTime = user.getCache('med_time') + methods.getRandomInt(1, 5);

                if (user.getCache('med_type') === 1) {
                    if (methods.distanceToPos(mp.players.local.position, hosp.pos2) > 30) {
                        mp.game.ui.notifications.show("~r~Вам необходимо проходить лечение");
                        user.teleportv(hosp.pos2);
                    }
                }
                else if (user.getCache('med_type') === 2) {
                    if (methods.distanceToPos(mp.players.local.position, hosp.pos3) > 20) {
                        mp.game.ui.notifications.show("~r~Вам необходимо проходить лечение");
                        user.teleportv(hosp.pos3);
                    }
                }
                else if (user.getCache('med_type') === 3) {
                    if (methods.distanceToPos(mp.players.local.position, hosp.posArmy) > 20) {
                        mp.game.ui.notifications.show("~r~Вам необходимо проходить лечение");
                        user.teleportv(hosp.posArmy);
                    }
                }
                else if (user.getCache('med_type') === 4) {
                    if (methods.distanceToPos(mp.players.local.position, hosp.pos4) > 15) {
                        mp.game.ui.notifications.show("~r~Вам необходимо проходить лечение");
                        user.teleportv(hosp.pos4);
                    }
                }
                else {
                    if (methods.distanceToPos(mp.players.local.position, hosp.pos1) > 40) {
                        mp.game.ui.notifications.show("~r~Вам необходимо проходить лечение");
                        user.teleportv(hosp.pos1);
                    }
                }

                ui.showSubtitle(`Время лечения~g~ ${user.getCache('med_time')} ~s~сек.`);
            }

            if (user.getCache('med_time') == 1)
                hosp.freePlayer();
        }
    }
    catch (e) {
        methods.debug(e);
    }
};


hosp.freePlayer = function(isBuy = false) {

    user.set('med_time', 0);
    prvTime = 0;
    mp.game.ui.notifications.show("~g~Вы успешно прошли лечение");

    user.setWaterLevel(500);
    user.setEatLevel(500);
    user.set('med_time', 0);

    achievement.doneDailyById(1);

    if (isBuy) {
        setTimeout(function () {
            user.set('med_time', 0);
            prvTime = 0;
        }, 500);
        setTimeout(function () {
            user.set('med_time', 0);
            prvTime = 0;
        }, 1000);
        return;
    }

    setTimeout(function () {

        if (user.getCache('med_lic'))
        {
            user.removeMoney(100, 'Лечение в больнице');
            coffer.addMoney(6, 100);
            mp.game.ui.notifications.show("~g~Стоимость лечения со страховкой ~s~$100");
        }
        else
        {
            if (user.getCache('online_time') < 300) {
                user.removeMoney(50);
                coffer.addMoney(6, 50, 'Лечение в больнице');
                mp.game.ui.notifications.show("~g~Стоимость лечения ~s~$50");
            }
            else {
                user.removeMoney(300, 'Лечение в больнице');
                coffer.addMoney(6,300);
                mp.game.ui.notifications.show("~g~Стоимость лечения ~s~$300");
            }
        }
    }, 500);
};

hosp.reset = function() {
    user.set('med_time', 0);
    prvTime = 0;
};

hosp.toHospCache = function() {
    try {
        if (user.getCache('med_type') === 1) {
            user.respawn(hosp.pos2.x, hosp.pos2.y, hosp.pos2.z);
        }
        else if (user.getCache('med_type') === 2) {
            user.respawn(hosp.pos3.x, hosp.pos3.y, hosp.pos3.z);
        }
        else if (user.getCache('med_type') === 3) {
            user.respawn(hosp.posArmy.x, hosp.posArmy.y, hosp.posArmy.z);
        }
        else if (user.getCache('med_type') === 4) {
            user.respawn(hosp.pos4.x, hosp.pos4.y, hosp.pos4.z);
        }
        else {
            user.set('med_type', 0);
            user.respawn(hosp.pos1.x, hosp.pos1.y, hosp.pos1.z);
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

hosp.toHosp = function() {
    try {
        user.showLoadDisplay();
        timer.setDeathTimer(0);

        if (user.getCache('jail_time') == 0) {

            let pos = hosp.findNearest(mp.players.local.position);

            if (methods.distanceToPos(pos, hosp.pos2) < 50) {
                user.set('med_type', 1);
                user.respawn(hosp.pos2.x, hosp.pos2.y, hosp.pos2.z);
            }
            else if (methods.distanceToPos(pos, hosp.pos3) < 50) {
                user.set('med_type', 2);
                user.respawn(hosp.pos3.x, hosp.pos3.y, hosp.pos3.z);
            }
            else if (methods.distanceToPos(pos, hosp.posArmy) < 50) {
                user.set('med_type', 3);
                user.respawn(hosp.posArmy.x, hosp.posArmy.y, hosp.posArmy.z);
            }
            else if (methods.distanceToPos(pos, hosp.pos4) < 50) {
                user.set('med_type', 4);
                user.respawn(hosp.pos4.x, hosp.pos4.y, hosp.pos4.z);
            }
            else {
                user.set('med_type', 0);
                user.respawn(hosp.pos1.x, hosp.pos1.y, hosp.pos1.z);
            }
        }

        mp.events.callRemote('playerDeathDone');

        user.setGrabMoney(0);
        user.unCuff();
        user.unTie();
        user.setVirtualWorld(0);

        if (!user.isPolice())
            user.updateCharacterCloth();

        mp.game.ui.displayRadar(true);
        mp.game.ui.displayHud(true);
        mp.players.local.freezePosition(false);

        if (user.getCache('jail_time') > 0) {
            user.set('med_time', 0);
            prvTime = 0;
            jail.toJail(user.getCache('jail_time'), user.getCache('jail_type'));
            return;
        }

        if (user.getCache('med_lic') || user.getCache('online_time') < 169) {
            prvTime = 120;
            user.set('med_time', 120);
        }
        else {
            prvTime = 500;
            user.set('med_time', 500);
        }

        setTimeout(function () {
            user.hideLoadDisplay();
        }, 1000);
    }
    catch (e) {
        methods.debug(e);
    }
};

export default hosp;