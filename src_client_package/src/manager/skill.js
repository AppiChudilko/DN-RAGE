import methods from '../modules/methods';

import user from '../user';
import weapons from "../weapons";
import items from "../items";
import inventory from "../inventory";

import weather from "./weather";
import timer from "./timer";

let skill = {};

let checkStats = function()
{
    if (!user.isLogin())
        return;

    if (mp.players.local.health <= 0)
        return;

    try {
        let localPlayer = mp.players.local;

        if (mp.players.local.isSprinting() && user.getCache('stats_endurance') < 99) {
            mp.game.ui.notifications.show(`~g~Навык "Выносливость" был повышен`);

            let last = user.getCache('stats_endurance');

            user.set('stats_endurance', user.getCache('stats_endurance') + 1);
            if (user.isUsmc() || user.getCache('vip_type') > 0)
                user.set('stats_endurance', user.getCache('stats_endurance') + 1);

            //mp.game.ui.notifications.showWithStats('PSF_ENDURANCE', last + 1, user.getCache('stats_endurance'));
        }

        if (mp.players.local.isSprinting() && user.getCache('stats_strength') < 99) {
            mp.game.ui.notifications.show(`~g~Навык "Сила" был повышен`);
            let last = user.getCache('stats_strength');
            user.set('stats_strength', user.getCache('stats_strength') + 1);
            if (user.isUsmc() || user.getCache('vip_type') > 0)
                user.set('stats_strength', user.getCache('stats_strength') + 1);
            //mp.game.ui.notifications.showWithStats('PSF_STRENGTH', last + 1, user.getCache('stats_strength'));
        }

        /*if (mp.players.local.isSwimming() && user.getCache('stats_lung_capacity') < 99) {
            mp.game.ui.notifications.show(`~g~Навык "Объем легких" был повышен`);
            user.set('stats_lung_capacity', user.getCache('stats_lung_capacity') + 1);
        }*/

        if (user.getCache('stats_driving') < 99)
        {
            if (mp.players.local.isSittingInAnyVehicle())
            {
                let veh = mp.players.local.vehicle;
                if (veh.getPedInSeat(-1) == localPlayer.handle && !veh.isInAir() && methods.getCurrentSpeed() > 10) {
                    mp.game.ui.notifications.show(`~g~Навык вождения был повышен`);
                    let last = user.getCache('stats_driving');
                    user.set('stats_driving', user.getCache('stats_driving') + 1);
                    if (user.isUsmc() || user.getCache('vip_type') > 0)
                        user.set('stats_driving', user.getCache('stats_driving') + 1);
                    //mp.game.ui.notifications.showWithStats('PSF_DRIVING', last + 1, user.getCache('stats_driving'));
                }
            }
        }

        if (user.getCache('stats_flying') < 99)
        {
            if (mp.players.local.isSittingInAnyVehicle())
            {
                let veh = mp.players.local.vehicle;
                if (veh.getPedInSeat(-1) == localPlayer.handle && veh.isInAir()) {
                    mp.game.ui.notifications.show(`~g~Навык пилота был повышен`);
                    let last = user.getCache('stats_flying');
                    user.set('stats_flying', user.getCache('stats_flying') + 1);
                    if (user.isUsmc() || user.getCache('vip_type') > 0)
                        user.set('stats_flying', user.getCache('stats_flying') + 1);
                    //mp.game.ui.notifications.showWithStats('PSF_FLYING', last + 1, user.getCache('stats_flying'));
                }
            }
        }

        if (mp.players.local.isSwimmingUnderWater() && user.getCache('stats_lung_capacity') < 99)
        {
            mp.game.ui.notifications.show(`~g~Навык "Объем легких" был повышен`);
            let last = user.getCache('stats_lung_capacity');
            user.set('stats_lung_capacity', user.getCache('stats_lung_capacity') + 2);
            if(user.getCache('stats_lung_capacity') > 99)
                user.set('stats_lung_capacity', 99);
            //mp.game.ui.notifications.showWithStats('PSF_LUNG_CAPACITY', last + 1, user.getCache('stats_lung_capacity'));
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

let checkShooting = function () {
    if (!user.isLogin())
        return;

    if (mp.players.local.isInAnyVehicle(false))
        return;

    try {
        if (mp.players.local.isShooting()) {

            if (user.getCache('stats_shooting') < 99) {
                mp.game.ui.notifications.show(`~g~Навык стрельбы был повышен`);
                let last = user.getCache('stats_shooting');
                user.set('stats_shooting', user.getCache('stats_shooting') + 1);
                if (user.getCache('vip_type') > 0)
                    user.set('stats_shooting', user.getCache('stats_shooting') + 1);
                //mp.game.ui.notifications.showWithStats('PSF_SHOOTING', last + 1, user.getCache('stats_shooting'));
            }
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

let fireMod = true;
let checkShooting1 = function () {
    if (!user.isLogin())
        return;

    if (mp.players.local.isInAnyVehicle(false))
        return;

    try {
        if (mp.players.local.isShooting()) {
            user.getInvEquipWeapon().forEach(item => {
                weapons.getMapList().forEach(wpItem => {
                    try {
                        if (user.getLastWeapon() == wpItem[1] / 2) {
                            let itemId = items.getWeaponIdByName(wpItem[0]);
                            if (itemId === item.item_id) {
                                if (item.counti > 60)
                                    return;
                                let rand = methods.getRandomInt(0, methods.parseInt(item.counti / 5));
                                if (rand < 1)
                                    fireMod = false;
                            }
                        }
                    }
                    catch (e) {
                        methods.debug(e);
                    }
                });
            });
        }
    }
    catch (e) {
        methods.debug('checkShooting1', e.toString());
    }
};
let checkShooting2 = function () {
    fireMod = true;
    if (!user.isLogin())
        return;
    /*try {
        if (mp.players.local.dimension === 0) {
            user.getInvEquipWeapon().forEach(item => {
                weapons.getMapList().forEach(wpItem => {
                    try {
                        if (user.getLastWeapon() == wpItem[1] / 2) {
                            if (item.counti > 0)
                                inventory.updateItemCount(item.id, item.counti - 1);
                        }
                    } catch (e) {
                        methods.debug(e);
                    }
                });
            });
        }
    }
    catch (e) {}*/
};

let updateStats = function() {
    if (!user.isLogin())
        return;
    try {

        if (user.getCache('online_time') < 100)
            user.setCache('stats_endurance', 70);

        mp.game.gameplay.terminateAllScriptsWithThisName('stats_controller﻿');

        mp.game.stats.statSetInt(mp.game.joaat("SP0_TOTAL_CASH"), user.getCashMoney() + user.getBankMoney(), false);

        mp.players.local.setAccuracy(user.getCache('stats_shooting'));

        if (user.getCache('stats_endurance') > 99)
            user.set('stats_endurance', 99);

        if (user.getCache('stats_strength') > 99)
            user.set('stats_strength', 99);

        if (user.getCache('stats_lung_capacity') > 99)
            user.set('stats_lung_capacity', 99);

        if (user.getCache('stats_driving') > 99)
            user.set('stats_driving', 99);

        if (user.getCache('stats_flying') > 99)
            user.set('stats_flying', 99);

        if (user.getCache('stats_lucky') > 99)
            user.set('stats_lucky', 99);

        if (user.getCache('stats_shooting') > 99)
            user.set('stats_shooting', 99);

        if (mp.players.local.dimension > 0)
            user.setCache('stats_endurance', 100);

        mp.game.stats.statSetInt(mp.game.joaat("MP0_STAMINA"), user.getCache('stats_endurance'), true);
        mp.game.stats.statSetInt(mp.game.joaat("MP0_STRENGTH"), user.getCache('stats_strength'), true);
        mp.game.stats.statSetInt(mp.game.joaat("MP0_LUNG_CAPACITY"), user.getCache('stats_lung_capacity'), true);
        mp.game.stats.statSetInt(mp.game.joaat("MP0_WHEELIE_ABILITY"), user.getCache('stats_driving'), true);
        mp.game.stats.statSetInt(mp.game.joaat("MP0_STEALTH_ABILITY"), user.getCache('stats_lucky'), true);
        mp.game.stats.statSetInt(mp.game.joaat("MP0_SHOOTING_ABILITY"), user.getCache('stats_shooting'), true);

        mp.game.stats.statSetInt(mp.game.joaat("STAMINA"), user.getCache('stats_endurance'), true);
        mp.game.stats.statSetInt(mp.game.joaat("STRENGTH"), user.getCache('stats_strength'), true);
        mp.game.stats.statSetInt(mp.game.joaat("LUNG_CAPACITY"), user.getCache('stats_lung_capacity'), true);
        mp.game.stats.statSetInt(mp.game.joaat("WHEELIE_ABILITY"), user.getCache('stats_driving'), true);
        mp.game.stats.statSetInt(mp.game.joaat("STEALTH_ABILITY"), user.getCache('stats_lucky'), true);
        mp.game.stats.statSetInt(mp.game.joaat("SHOOTING_ABILITY"), user.getCache('stats_shooting'), true);

        mp.game.stats.statSetInt(mp.game.joaat("SP0_STAMINA"), user.getCache('stats_endurance'), true);
        mp.game.stats.statSetInt(mp.game.joaat("SP0_STRENGTH"), user.getCache('stats_strength'), true);
        mp.game.stats.statSetInt(mp.game.joaat("SP0_LUNG_CAPACITY"), user.getCache('stats_lung_capacity'), true);
        mp.game.stats.statSetInt(mp.game.joaat("SP0_WHEELIE_ABILITY"), user.getCache('stats_driving'), true);
        mp.game.stats.statSetInt(mp.game.joaat("SP0_STEALTH_ABILITY"), user.getCache('stats_lucky'), true);
        mp.game.stats.statSetInt(mp.game.joaat("SP0_SHOOTING_ABILITY"), user.getCache('stats_shooting'), true);

        mp.game.stats.statSetInt(mp.game.joaat("SP1_STAMINA"), user.getCache('stats_endurance'), true);
        mp.game.stats.statSetInt(mp.game.joaat("SP1_STRENGTH"), user.getCache('stats_strength'), true);
        mp.game.stats.statSetInt(mp.game.joaat("SP1_LUNG_CAPACITY"), user.getCache('stats_lung_capacity'), true);
        mp.game.stats.statSetInt(mp.game.joaat("SP1_WHEELIE_ABILITY"), user.getCache('stats_driving'), true);
        mp.game.stats.statSetInt(mp.game.joaat("SP1_STEALTH_ABILITY"), user.getCache('stats_lucky'), true);
        mp.game.stats.statSetInt(mp.game.joaat("SP1_SHOOTING_ABILITY"), user.getCache('stats_shooting'), true);

        mp.game.stats.statSetInt(mp.game.joaat("SP2_STAMINA"), user.getCache('stats_endurance'), true);
        mp.game.stats.statSetInt(mp.game.joaat("SP2_STRENGTH"), user.getCache('stats_strength'), true);
        mp.game.stats.statSetInt(mp.game.joaat("SP2_LUNG_CAPACITY"), user.getCache('stats_lung_capacity'), true);
        mp.game.stats.statSetInt(mp.game.joaat("SP2_WHEELIE_ABILITY"), user.getCache('stats_driving'), true);
        mp.game.stats.statSetInt(mp.game.joaat("SP2_STEALTH_ABILITY"), user.getCache('stats_lucky'), true);
        mp.game.stats.statSetInt(mp.game.joaat("SP2_SHOOTING_ABILITY"), user.getCache('stats_shooting'), true);

        if (weather.getWindSpeed() >= 8) {
            mp.game.stats.statSetInt(mp.game.joaat("MP0_FLYING_ABILITY"), 0, true);
            mp.game.stats.statSetInt(mp.game.joaat("FLYING_ABILITY"), 0, true);
            mp.game.stats.statSetInt(mp.game.joaat("SP0_FLYING_ABILITY"), 0, true);
            mp.game.stats.statSetInt(mp.game.joaat("SP1_FLYING_ABILITY"), 0, true);
            mp.game.stats.statSetInt(mp.game.joaat("SP2_FLYING_ABILITY"), 0, true);
        }
        else {
            mp.game.stats.statSetInt(mp.game.joaat("MP0_FLYING_ABILITY"), user.getCache('stats_flying'), true);
            mp.game.stats.statSetInt(mp.game.joaat("FLYING_ABILITY"), user.getCache('stats_flying'), true);
            mp.game.stats.statSetInt(mp.game.joaat("SP0_FLYING_ABILITY"), user.getCache('stats_flying'), true);
            mp.game.stats.statSetInt(mp.game.joaat("SP1_FLYING_ABILITY"), user.getCache('stats_flying'), true);
            mp.game.stats.statSetInt(mp.game.joaat("SP2_FLYING_ABILITY"), user.getCache('stats_flying'), true);
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

mp.events.add('render', () => {
    try {
        if (!fireMod) {
            mp.game.player.disableFiring(false);
            if (mp.game.controls.isDisabledControlJustPressed(0, 24))
                mp.game.audio.playSoundFrontend(-1, "Faster_Click", "RESPAWN_ONLINE_SOUNDSET", true);
        }
    }
    catch (e) {
        
    }
});

skill.loadAll = function() {
    timer.createInterval('checkStats', checkStats, 180000);
    timer.createInterval('checkShooting', checkShooting, 5000);
    timer.createInterval('checkShooting1', checkShooting1, 50);
    timer.createInterval('checkShooting2', checkShooting2, 1000);
    timer.createInterval('updateStats', updateStats, 10000);
};

export default skill;
