import items from "./items";

import methods from "./modules/methods";
import weapons from "./weapons";
import user from "./user";
import chat from "./chat";
import bind from "./manager/bind";
import ui from "./modules/ui";
import inventory from "./inventory";
import phone from "./phone";
import weather from "./manager/weather";
import enums from "./enums";

let walkie = {};

let hidden = true;

walkie.show = function() {

    if (user.isCuff() || user.isTie()) {
        mp.game.ui.notifications.show("~r~Вы связаны или в наручниках");
        return;
    }
    if (!user.getCache('walkie_buy')) {
        mp.game.ui.notifications.show("~r~У Вас нет рации, купите её в магазине электронной техники");
        return;
    }

    try {
        mp.gui.cursor.show(false, true);
        mp.game.ui.notifications.show(`~b~Скрыть рацию на ~s~${bind.getKeyName(user.getCache('s_bind_voice_walkie'))}`);
        ui.DisableMouseControl = true;
        hidden = false;

        let fr1 = user.getCache("walkie_1").split('.');
        let fr2 = user.getCache("walkie_2").split('.');

        let data = {
            type: 'updateValues',
            frq1: [fr1[0].toString(), fr1[1].toString()],
            frq2: [fr2[0].toString(), fr2[1].toString()],
            frqEdit: user.getCache('walkie_current'),
            volume: user.getCache('walkie_vol'),
            color: user.getCache('walkie_color'),
        };
        ui.callCef('walkietalkie', JSON.stringify(data));

        ui.callCef('walkietalkie', '{"type": "show"}');
    }
    catch (e) {
        methods.debug(e);
    }
};

walkie.showOrHide = function() {
    if (!inventory.isHide() || !phone.isHide()) {
        //mp.game.ui.notifications.show("~r~Во время открытого инвентаря, нельзоя пользоваться телефоном");
        return;
    }
    if (user.getCache('jail_time') > 0) {
        mp.game.ui.notifications.show("~r~Нельзя пользоваться рацией в тюрьме");
        return;
    }
    if (user.isCuff() || user.isTie()) {
        mp.game.ui.notifications.show("~r~Вы связаны или в наручниках");
        return;
    }
    if (!user.getCache('walkie_buy')) {
        mp.game.ui.notifications.show("~r~У Вас нет рации, купите её в магазине электронной техники");
        return;
    }

    ui.callCef('walkietalkie', '{"type": "showOrHide"}');
};

walkie.hide = function() {
    try {
        mp.gui.cursor.show(false, false);
        ui.DisableMouseControl = false;
        hidden = true;
        ui.callCef('walkietalkie', '{"type": "hide"}');
    }
    catch (e) {
        methods.debug(e);
    }
};

walkie.isHide = function() {
    return hidden;
};

walkie.setFrq1 = function(value) {
    if (value[0] >= 900 && !user.isGos()) {
        mp.game.ui.notifications.show('~r~Только гос. организациям разрешено ставить каналы в диапазоне от 900 до 999');
        walkie.show();
        return;
    }
    user.set('walkie_1', `${value[0]}.${value[1]}`);
    user.setVariable('walkie', `${value[0]}.${value[1]}`);
};

walkie.setFrq2 = function(value) {

    if (value[0] >= 900 && !user.isGos()) {
        mp.game.ui.notifications.show('~r~Только гос. организациям разрешено ставить каналы в диапазоне от 900 до 999');
        walkie.show();
        return;
    }
    user.set('walkie_2', `${value[0]}.${value[1]}`);
    user.setVariable('walkie', `${value[0]}.${value[1]}`);
};

walkie.setFrqStats = function(value) {
    methods.debug('walkie.setFrqStats', value);
    user.set('walkie_current', value);
    user.setVariable('walkie', user.getCache('walkie_' + (value + 1)))
};

walkie.setColor = function(value) {
    methods.debug('walkie.setColor', value);
    user.set('walkie_color', value);
};

walkie.setVol = function(value) {
    methods.debug('walkie.setVol', value);
    user.set('walkie_vol', value);
};

export default walkie;