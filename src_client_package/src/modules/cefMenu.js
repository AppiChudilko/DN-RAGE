"use strict";

import ui from "./ui";
import phone from "../phone";
import methods from "./methods";
import UIMenu from "./menu";
import menuList from "../menuList";
import houses from "../property/houses";
import mail from "../jobs/mail";
import user from "../user";
import chat from "../chat";

let cefMenu = {};

let isShow = false;

cefMenu.showFull = function(headerText, headerDesc = '', menuList = [], menuName = '', banner = '', header = true, opacity = 0.8, selected = 0) {

    if (user.getCache('s_hud_cursor')) {
        mp.gui.cursor.show(false, true);
        ui.DisableMouseControl = true;
    }
    isShow = true;
    ui.callCef('hudm', JSON.stringify({type: 'updateInfo', header: header, opacity: opacity, headerText: headerText, headerDesc: headerDesc, menuList: menuList, banner: banner, menuName: menuName, selected: selected}));
};

cefMenu.show = function() {
    if (user.getCache('s_hud_cursor')) {
        mp.gui.cursor.show(false, true);
        ui.DisableMouseControl = true;
    }
    isShow = true;
    ui.callCef('hudm', JSON.stringify({type: 'show'}));
};

cefMenu.focus = function() {
    ui.callCef('hudm', JSON.stringify({type: 'focus'}));
};

cefMenu.hide = function() {
    mp.events.call('client:menuList:onClose');

    if (user.getCache('s_hud_cursor')) {
        if (isShow) {
            mp.gui.cursor.show(false, false);
            ui.DisableMouseControl = false;
        }
    }

    isShow = false;
    ui.callCef('hudm', JSON.stringify({type: 'hide'}));
};

cefMenu.isShow = function() {
    return isShow;
};

cefMenu.getMenuItem = function(title, desc = '', params = {}, rightLabel = '', icon = '', iconRight = '', divider = false) {

    let menuItem = {
        type: 2,
        title: title,
        params: params,
    };
    if (divider)
        menuItem.divider = divider;
    if (iconRight)
        menuItem.iconr = iconRight;
    if (icon)
        menuItem.icon = icon;
    if (rightLabel)
        menuItem.rl = rightLabel;
    if (desc)
        menuItem.subtitle = desc;
    return menuItem;
};

cefMenu.getMenuItemList = function(title, desc, params, listItem, index = 0, rightLabel = '', icon = '', iconRight = '', divider = false) {
    return {
        type: 1,
        title: title,
        subtitle: desc,
        rl: rightLabel,
        icon: icon,
        iconr: iconRight,
        items: listItem,
        index: index,
        params: params,
        divider: divider
    };
};

cefMenu.getMenuItemCheckbox = function(title, desc, params, checked = false, rightLabel = '', icon = '', iconRight = '', divider = false) {
    return {
        type: 0,
        title: title,
        subtitle: desc,
        rl: rightLabel,
        icon: icon,
        iconr: iconRight,
        checked: checked,
        params: params,
        divider: divider
    };
};

mp.events.add("client:menuList:callBack:btn", async (menuName, id, jparams) => {

    //methods.debug(menuName, id, jparams);

    let params = {};

    if (methods.isValidJSON(jparams))
        params = JSON.parse(jparams);

    if (params.doName == 'closeMenu') {
        cefMenu.hide();
        return;
    }

    return;

    if (menuName === 'showHouseBuyMenu') {
        cefMenu.hide();

        if (params.doName == 'checkHouse') {
            houses.enter(params.hid);
        }
        else if (params.doName == 'buyHouse') {
            houses.buy(params.hid);
        }
        else if (params.mail) {
            mail.sendMail(params.mail)
        }
    }

    if (menuName === 'showHouseInMenu') {
        cefMenu.hide();

        if (params.doName == 'setPin') {
            cefMenu.hide();
            let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 5));
            if (pass < 1) {
                mp.game.ui.notifications.show('~r~Пароль должен быть больше нуля');
                return false;
            }
            mp.game.ui.notifications.show('~g~Ваш новый пароль: ~s~' + pass);
            houses.updatePin(params.hid, pass);
        }
        else if (params.doName == 'enterGarage1') {
            houses.enterGarage(params.int);
        }
        else if (params.doName == 'enterGarage2') {
            houses.enterGarage(params.int);
        }
        else if (params.doName == 'enterGarage3') {
            houses.enterGarage(params.int);
        }
        else if (params.doName == 'exitHouse') {
            houses.exit(params.x, params.y, params.z, params.rot);
        }
    }

    if (menuName === 'showMainMenu') {

        cefMenu.hide();

        if (params.doName == 'sendReport') {
            let text = await UIMenu.Menu.GetUserInput("Опишите жалобу", "", 300);
            if (text !== '' && text !== undefined)
                mp.events.callRemote('server:sendReport', text);
        }
        if (params.doName == 'sendAsk') {
            let text = await UIMenu.Menu.GetUserInput("Задайте вопрос", "", 300);
            if (text !== '' && text !== undefined)
                mp.events.callRemote('server:sendAsk', text);
        }
        if (params.doName == 'showPlayerMenu')
            menuList.showPlayerMenu();
        if (params.doName == 'showSettingsMenu')
            menuList.showSettingsMenu();
        if (params.doName == 'showQuestMenu')
            menuList.showQuestMenu();
        if (params.doName == 'showHelpMenu')
            menuList.showHelpMenu();
        if (params.eventName)
            mp.events.callRemote(params.eventName);
    }
});

mp.events.add("client:menuList:callBack:check", async (menuName, id, jparams, checked) => {
    return;
    methods.debug(menuName, id, jparams, checked);

    let params = {};
    if (methods.isValidJSON(jparams))
        params = JSON.parse(jparams);
});

mp.events.add("client:menuList:callBack:list", async (menuName, id, jparams, index) => {
    return;
    methods.debug(menuName, id, jparams, index);

    let params = {};
    if (methods.isValidJSON(jparams))
        params = JSON.parse(jparams);

    if (menuName === 'showHouseInMenu') {
        if (params.doName == 'setLock') {
            if (index == 1) {
                mp.game.ui.notifications.show('Дверь ~r~закрыта');
                houses.lockStatus(params.hid, true);
            }
            else {
                mp.game.ui.notifications.show('Дверь ~g~открыта');
                houses.lockStatus(params.hid, false);
            }
        }
    }
});

mp.events.add("client:menuList:callBack:select", async (menuName, idx) => {
    return;
    methods.debug(menuName, idx);
});

export default cefMenu;

