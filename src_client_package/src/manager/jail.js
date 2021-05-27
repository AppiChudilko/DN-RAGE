import methods from '../modules/methods';

import ui from '../modules/ui';

import timer from "./timer";

import user from '../user';

import jailer from "../jobs/jailer";
import achievement from "./achievement";

let jail = {};

jail.pos = new mp.Vector3(1707.69, 2546.69, 45.56);
jail.posAdmin = new mp.Vector3(1642.131591796875, 2570.130859375, 44.564876556396484);
jail.posFree = new mp.Vector3(1849.444, 2601.747, 45.60717);

let removeTime = 1;

let adminPos = [
    [1629.1536865234375, 2570.517822265625, 44.564876556396484],
    [1642.131591796875, 2570.130859375, 44.564876556396484],
    [1651.98876953125, 2569.863037109375, 44.564876556396484],
];

let prvTime = 0;

jail.timer = function() {

    try {
        if (user.isLogin()) {
            if (user.getCache('jail_time') > 1) {

                if (user.getCache('status_media') > 0)
                    user.set('jail_time', user.getCache('jail_time') - (removeTime + 2));
                else
                    user.set('jail_time', user.getCache('jail_time') - removeTime);

                removeTime = 1;

                if (prvTime > user.getCache('jail_time') + 20)
                {
                    user.kickAntiCheat("Cheat Engine");
                    return;
                }
                prvTime = user.getCache('jail_time') + methods.getRandomInt(1, 5);

                if (methods.distanceToPos(mp.players.local.position, jail.pos) > 200) {

                    if (user.getCache('jail_type') === 1)
                        user.teleportv(jail.posAdmin);
                    else
                        user.teleportv(jail.pos);

                    mp.game.ui.notifications.show("~r~Вас поймали ;)");
                    jail.updateCloth();
                }

                ui.showSubtitle(`Время в тюрьме~g~ ${user.getCache('jail_time')} ~s~сек.`);
            }

            if (user.getCache('jail_time') <= 1 && user.getCache('jail_time') !== 0)
                jail.freePlayer();
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

jail.freePlayer = function() {
    jailer.stop();
    user.teleportv(jail.posFree);
    user.set('jail_time', 0);
    user.set('jail_type', 0);
    prvTime = 0;
    mp.game.ui.notifications.show("~g~Вы отсидели в тюрьме, теперь вы свободны!");
    user.updateCharacterCloth();

    achievement.doneDailyById(2);
};

jail.setOffsetTimeThisSec = function(time) {
    removeTime = time;
};

jail.updateCloth = function() {
    if (user.getSex() == 1) {
        user.setComponentVariation(4, 3, 15);
        user.setComponentVariation(6, 5, 0);
        user.setComponentVariation(8, 60, 500);
        user.setComponentVariation(11, 0, 0);
        user.setComponentVariation(3, 0, 0);
    }
    else {
        if (methods.getRandomInt(0, 2) == 0) {
            user.setComponentVariation( 3, 15, 0);
            user.setComponentVariation( 11, 56, 1);
        }
        else {
            user.setComponentVariation( 3, 0, 0);
            user.setComponentVariation( 11, 56, 0);
        }
        user.setComponentVariation( 4, 7, 15);
        user.setComponentVariation( 8, 60, 500);
        user.setComponentVariation( 6, 6, 0);
    }
};

jail.toJail = function(sec, type = 0) {
    try {

        if (sec < 1) {
            jail.freePlayer();
            return;
        }

        user.showLoadDisplay();
        timer.setDeathTimer(0);

        if (type === 1)
            user.respawn(jail.posAdmin.x, jail.posAdmin.y, jail.posAdmin.z);
        else
            user.respawn(jail.pos.x, jail.pos.y, jail.pos.z);

        prvTime = sec;
        user.set('jail_time', sec);
        user.set('jail_type', type);

        user.setGrabMoney(0);
        user.unCuff();
        user.unTie();
        user.setVirtualWorld(0);

        user.set('wanted_level', 0);

        mp.game.ui.displayRadar(true);
        mp.game.ui.displayHud(true);
        mp.players.local.freezePosition(false);

        user.removeAllWeapons();

        jail.updateCloth();

        setTimeout(function () {
            user.hideLoadDisplay();
        }, 1000);
    }
    catch (e) {
        methods.debug(e);
    }
};

export default jail;