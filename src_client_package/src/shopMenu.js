import methods from './modules/methods';
import ui from "./modules/ui";

import houses from "./property/houses";
import condos from "./property/condos";
import business from "./property/business";
import vehicles from "./property/vehicles";

import quest from "./manager/quest";
import edu from "./manager/edu";
import hosp from "./manager/hosp";
import prolog from "./manager/prolog";
import npc from "./manager/npc";

import loader from "./jobs/loader";
import lamar from "./jobs/lamar";

import cloth from "./business/cloth";

import inventory from "./inventory";
import user from "./user";
import items from "./items";
import menuList from "./menuList";
import enums from "./enums";
import jailer from "./jobs/jailer";
import achievement from "./manager/achievement";

let shopMenu = {};

let lastSetting2 = {bg: '', banner: ''};

let hidden = true;

shopMenu.showShop = function() {
    shopMenu.setControl();
    hidden = false;
    ui.callCef('gunshop', '{"type": "show"}');
};

shopMenu.hideShop = function() {
    shopMenu.resetControl();
    hidden = true;
    ui.callCef('gunshop', '{"type": "hide"}');
};

shopMenu.showShop2 = function(pos = null, rot = null, zUp = 1, offsetMin = 0.4, offsetMax = 1.5, offsetZMin = -0.8, offsetZMax = 1) {
    shopMenu.setControl2(pos, rot, zUp, offsetMin, offsetMax, offsetZMin, offsetZMax);
    hidden = false;
    ui.callCef('tattooshop', '{"type": "show"}');
};

shopMenu.hideShop2 = function() {

    if (user.hasCache('seeMask')) {
        user.reset('seeMask');
        user.set('mask', -1);
        user.set('mask_color', 0);
    }

    user.updateCharacterFace();
    user.updateCharacterCloth();
    user.setVirtualWorld(0);
    user.stopAllAnimation();

    shopMenu.resetControl2();
    hidden = true;
    ui.callCef('tattooshop', '{"type": "hide"}');
};

shopMenu.showCarRent = function() {
    shopMenu.setControl();
    hidden = false;
    ui.callCef('carrent', '{"type": "show"}');
};

shopMenu.hideCarRent = function() {
    shopMenu.resetControl();
    hidden = true;
    ui.callCef('carrent', '{"type": "hide"}');
};

shopMenu.showDialog = function(pos = null, rot = null) {
    shopMenu.setControl2(pos, rot, 0.8, 0.6, 0.6, 0, 0, true);
    hidden = false;
    ui.callCef('ndialog', '{"type": "show"}');
    mp.players.local.setVisible(false, false)
};

shopMenu.hideDialog = function() {
    shopMenu.resetControl2();
    hidden = true;
    ui.callCef('ndialog', '{"type": "hide"}');
    mp.players.local.setVisible(true, true)
};

shopMenu.updateShop = function(list, banner = '', bgColor = '', selected = 0, selectedCatalog = -1) {
    let sendData = {
        type: 'updateItems',
        list: list,
        banner: banner,
        bgColor: bgColor,
        selected: selected,
        selectedCatalog: selectedCatalog
    };
    ui.callCef('gunshop', JSON.stringify(sendData));
};

shopMenu.updateShop2 = function(list, banner = '', bgColor = '', type = 0, title = 'Добро пожаловать', subTitle = '', selected = -1) {
    let sendData = {
        type: 'updateItems',
        items: list,
        title: title,
        subTitle: subTitle,
        banner: banner,
        bgColor: bgColor,
        selected: selected,
        t: type
    };
    lastSetting2.banner = banner;
    lastSetting2.bg = bgColor;
    ui.callCef('tattooshop', JSON.stringify(sendData));
};

shopMenu.updateDialog = function(buttons, name , subtitle, qustion) {
    let sendData = {
        type: 'updateItems',
        name: name,
        subtitle: subtitle,
        qustion: qustion,
        buttons: buttons,
    };
    ui.callCef('ndialog', JSON.stringify(sendData));
};

shopMenu.updateShopCarRent = function(list, title = '', bgColor = '#252525', banner = '') {
    let sendData = {
        type: 'updateItems',
        items: list,
        banner: banner,
        bgColor: bgColor,
        title: title
    };
    ui.callCef('carrent', JSON.stringify(sendData));
};

shopMenu.setControl = function() {
    mp.gui.cursor.show(true, true);
    hidden = false;
    ui.hideHud();
    mp.game.graphics.transitionToBlurred(100);
};

shopMenu.resetControl = function() {
    mp.gui.cursor.show(false, false);
    hidden = true;
    ui.showHud();
    mp.game.graphics.transitionFromBlurred(100);
};

shopMenu.setControl2 = function(pos = null, rot = null, zUp = 1, offsetMin = 1, offsetMax = 2.2, offsetZMin = -0.8, offsetZMax = 1.2, shake = false) {
    mp.gui.cursor.show(true, true);
    hidden = false;
    ui.hideHud();
    if (pos === null)
        pos = mp.players.local.position;
    if (rot === null)
        rot = mp.players.local.getRotation(0).z;

    if (!user.getCam())
        user.createCam(pos, rot, zUp, offsetMin, offsetMax, offsetZMin, offsetZMax, shake);
    user.btnCamera = 237;
    user.camOffsetLeft = 0.23;
    user.camOffsetRight = 1;
};

shopMenu.resetControl2 = function() {
    mp.gui.cursor.show(false, false);
    hidden = true;
    ui.showHud();
    user.destroyCam();
    user.camOffsetLeft = 0;
    user.camOffsetRight = 0.8;
    //user.btnCamera = 238;
};

shopMenu.hideAll = function() {
    try {
        ui.callCef('gunshop', '{"type": "hide"}');
        ui.callCef('tattooshop', '{"type": "hide"}');
        ui.callCef('carrent', '{"type": "hide"}');
        ui.callCef('ndialog', '{"type": "hide"}');
    } catch (e) {}

    mp.players.local.setVisible(true, true);

    try {shopMenu.resetControl();} catch (e) {}
    try {shopMenu.resetControl2();} catch (e) {}
    if (hidden) {
        try {
            if (user.hasCache('seeMask')) {
                user.reset('seeMask');
                user.set('mask', -1);
                user.set('mask_color', 0);
            }

            user.updateCharacterFace();
            user.updateCharacterCloth();

            user.setVirtualWorld(0);
            user.stopAllAnimation();
        }
        catch (e) {}
    }
    hidden = true;
};

shopMenu.getLastSettings = function() {
    return lastSetting2;
};

mp.events.add('client:shopMenu:hide', function() {
    hidden = false;
    shopMenu.resetControl();
});

mp.events.add('client:carRent:hide', function() {
    hidden = false;
    shopMenu.resetControl();
});

mp.events.add('client:shopMenu:hideLeft', function() {
    hidden = false;
    shopMenu.resetControl2();
    if (user.hasCache('seeMask')) {
        user.reset('seeMask');
        user.set('mask', -1);
        user.set('mask_color', 0);
    }
    user.updateCharacterFace();
    user.updateCharacterCloth();
    user.setVirtualWorld(0);
    user.stopAllAnimation();
});

let skin = {};
let clothLastIdx = -1;

mp.events.add('client:shopMenu:changeSelect2', async function(json) {
    try {
        skin.SKIN_HAIR = methods.parseInt(user.getCache('SKIN_HAIR'));
        skin.SKIN_HAIR_2 = methods.parseInt(user.getCache('SKIN_HAIR_2'));
        skin.SKIN_HAIR_3 = methods.parseInt(user.getCache('SKIN_HAIR_3'));
        skin.SKIN_HAIR_COLOR = methods.parseInt(user.getCache('SKIN_HAIR_COLOR'));
        skin.SKIN_HAIR_COLOR_2 = methods.parseInt(user.getCache('SKIN_HAIR_COLOR_2'));
        skin.SKIN_EYE_COLOR = methods.parseInt(user.getCache('SKIN_EYE_COLOR'));
        skin.SKIN_EYEBROWS = methods.parseInt(user.getCache('SKIN_EYEBROWS'));
        skin.SKIN_EYEBROWS_COLOR = methods.parseInt(user.getCache('SKIN_EYEBROWS_COLOR'));
        skin.SKIN_OVERLAY_9 = methods.parseInt(user.getCache('SKIN_OVERLAY_9'));
        skin.SKIN_OVERLAY_COLOR_9 = methods.parseInt(user.getCache('SKIN_OVERLAY_COLOR_9'));
        skin.SKIN_OVERLAY_1 = methods.parseInt(user.getCache('SKIN_OVERLAY_1'));
        skin.SKIN_OVERLAY_COLOR_1 = methods.parseInt(user.getCache('SKIN_OVERLAY_COLOR_1'));
        skin.SKIN_OVERLAY_4 = methods.parseInt(user.getCache('SKIN_OVERLAY_4'));
        skin.SKIN_OVERLAY_COLOR_4 = methods.parseInt(user.getCache('SKIN_OVERLAY_COLOR_4'));
        skin.SKIN_OVERLAY_5 = methods.parseInt(user.getCache('SKIN_OVERLAY_5'));
        skin.SKIN_OVERLAY_COLOR_5 = methods.parseInt(user.getCache('SKIN_OVERLAY_COLOR_5'));
        skin.SKIN_OVERLAY_8 = methods.parseInt(user.getCache('SKIN_OVERLAY_8'));
        skin.SKIN_OVERLAY_COLOR_8 = methods.parseInt(user.getCache('SKIN_OVERLAY_COLOR_8'));
        skin.SKIN_OVERLAY_10 = methods.parseInt(user.getCache('SKIN_OVERLAY_10'));
        skin.SKIN_OVERLAY_COLOR_10 = methods.parseInt(user.getCache('SKIN_OVERLAY_COLOR_10'));

        let params = JSON.parse(json);
        methods.debug(json);
        if (params.type === 'lsc:repair') {
            menuList.showLscRepairMenu(params.shop, params.price);
        }
        if (params.type === 'lsc:setNumber') {
            menuList.showLscNumberMenu(params.shop, params.price);
        }
        if (params.type === 'lsc:setTunning') {
            menuList.showLscTunningMenu(params.shop, params.price);
        }
        if (params.type === 'lsc:setTunning2') {
            menuList.showLscTunning2Menu(params.shop, params.price);
        }
        if (params.type === 'lsc:list:show') {
            menuList.showLscTunningListMenu(params.modType, params.shop, params.price);
        }
        if (params.type === 'lsc:list:remove') {
            if (params.modType === 78) {
                mp.game.ui.notifications.show(`~r~Для этого типа тюнинга не доступно`);
                return;
            }
            else {
                mp.events.callRemote('server:lsc:showTun', params.modType, -1);
            }
        }
        if (params.type === 'lsc:list:buy') {
            if (params.modType === 80) {
                try {
                    mp.events.callRemote('server:lsc:showTun', params.modType, params.id);
                }
                catch (e) {
                }
            }
            else {
                mp.events.callRemote('server:lsc:showTun', params.modType, params.id);
            }
        }
        if (params.type === 'lsc:setSTunning') {
            menuList.showLscSTunningMenu(params.shop, params.price);
        }
        if (params.type === 'lsc:setS2Tunning') {
            menuList.showLscS2TunningMenu(params.shop, params.price);
        }
        if (params.type === 'lsc:setS3Tunning') {
            menuList.showLscS3TunningMenu(params.shop, params.price);
        }
        if (params.type === 'lsc:s:mod') {
            menuList.showLscS2MoreTunningMenu(params.shop, params.idx, params.price);
        }
        if (params.type === 'lsc:setColor') {
            menuList.showLscColorMenu(params.shop, params.price);
        }
        if (params.type == 'lsc:color:1')
            menuList.showLscColorChoiseMenu(params.shop, params.price, 'Основной цвет', '1', 1000, 'color1');
        if (params.type == 'lsc:color:2')
            menuList.showLscColorChoiseMenu(params.shop, params.price, 'Дополнительный цвет', '2', 500, 'color2');
        if (params.type == 'lsc:color:3')
            menuList.showLscColorChoiseMenu(params.shop, params.price, 'Перламутровый цвет', '3', 5000, 'color3');
        if (params.type == 'lsc:color:4')
            menuList.showLscColorChoiseMenu(params.shop, params.price, 'Цвет колес', '4', 1000, 'colorwheel');
        if (params.type == 'lsc:color:5')
            menuList.showLscColorChoiseMenu(params.shop, params.price, 'Цвет приборной панели', '5', 500, 'colord');
        if (params.type == 'lsc:color:6')
            menuList.showLscColorChoiseMenu(params.shop, params.price, 'Цвет салона', '6', 5000, 'colori');
        if(params.type == 'lsc:color:buy') {
            mp.events.callRemote('server:lsc:showColor' + params.ev, params.modType);
        }
        if(params.type == 'lsc:s:setSmoke')
            menuList.showLscTyreColorChoiseMenu(params.shop)
        if(params.type == 'lsc:s:numberPlate')
            mp.events.callRemote('server:lsc:showNumberType', params.id);
        if(params.type == 'lsc:list:show')
            menuList.showLscTunningListMenu(params.modType, params.shop, await business.getPrice(params.shop));
        if (params.type == 'lsc:list:buy') {
            if (params.showWheel)
            {
                setTimeout(async function () {
                    if (params.modType === 10)
                        menuList.showLscTunningListMenu(23, params.shop, await business.getPrice(params.shop) * 3);
                    else if (params.modType === 9 || params.modType === 8)
                        menuList.showLscTunningListMenu(23, params.shop, await business.getPrice(params.shop) * 2);
                    else
                        menuList.showLscTunningListMenu(23, params.shop, await business.getPrice(params.shop) * 2);
                }, 300);
            }
        }
        if (params.type == 'mask') {
            menuList.showMaskListMenu(params.slot, params.shop);
        }
        if (params.type == 'mask:buy') {
            user.set('mask', params.idxFull);
            user.set('mask_color', 1);
            //user.updateCharacterFace();
            user.updateCharacterCloth();
        }
        if (params.type === 't') {
            menuList.showTattooShopShortMenu(lastSetting2.banner, lastSetting2.bg, params.zone, params.shop, await business.getPrice(params.shop));
        }
        if (params.type === 'b') {
            menuList.showBarberShopMoreMenu(lastSetting2.banner, lastSetting2.bg, params.shop, params.price, params.name, params.count, params.zone, params.none);
        }
        if (params.doName === 'tt:show' || params.doName === 'tt:destroy') {
            user.clearDecorations();
            user.setDecoration(params.tatto1, params.tatto2);
        }
        if (params.type === 'c:show') {
            if (clothLastIdx === (params.id2 + params.id6 + params.id7)) {
                menuList.showShopClothMoreMenu(lastSetting2.banner, lastSetting2.bg, params.shop, params.t, params.mt, await business.getPrice(params.shop), params.id1, params.id2, params.id3, params.id4, params.id5, params.id6, params.id7, params.id8, params.id10, params.itemName);
            }
            else {
                clothLastIdx = params.id2 + params.id6 + params.id7;
                if (params.id1 === 8) {
                    cloth.change(11, params.id6, params.id7, params.id4, params.id5, params.id2, 0);
                    user.updateTattoo(true, true, false, true);
                }
                else {

                    cloth.change(params.id1, params.id2, 0, params.id4, params.id5, params.id6, params.id7);
                    if (params.id1 == 11)
                        user.updateTattoo(true, true, false, true);
                }
            }
        }
        if (params.type === 'p:show') {
            if (clothLastIdx === params.id2) {
                menuList.showShopPropMoreMenu(lastSetting2.banner, lastSetting2.bg, params.shop, params.t, params.mt, await business.getPrice(params.shop), params.id1, params.id2, params.id3, params.id4, params.itemName);
            }
            else {
                clothLastIdx = params.id2;
                cloth.changeProp(params.id1, params.id2, 0);
            }
        }
        if (params.type === 'c' && params.name) {
            let price = params.p;
            let type = params.t;
            if (params.name == "openBag") {
                menuList.showShopClothBagMenu(params.shop, type, params.mt, price);
            }
            if (params.name == "openPrint") {
                if (user.getCache('torso') == 15)
                {
                    user.showCustomNotify("~r~Вам необходимо купить вверхнюю одежду в магазине одежды, прежде чем пользоваться услугой наклейки принта");
                    return;
                }
                menuList.showShopClothPrintMenu(params.shop, type, params.mt, price);
            }
            if (params.name == "glasses") {
                menuList.showShopPropMenu(params.shop, type, 1, price);
            }
            if (params.name == "earring") {
                menuList.showShopPropMenu(params.shop, type, 2, price);
            }
            if (params.name == "leftHand") {
                menuList.showShopPropMenu(params.shop, type, 6, price);
            }
            if (params.name == "rightHand") {
                menuList.showShopPropMenu(params.shop, type, 7, price);
            }
            if (params.name == "head") {
                menuList.showShopPropMenu(params.shop, type, 0, price);
            }
            if (params.name == "glasses") {
                menuList.showShopPropMenu(params.shop, type, 1, price);
            }
            if (params.name == "body") {
                menuList.showShopClothMenu(params.shop, type, 11, price);
            }
            if (params.name == "legs") {
                menuList.showShopClothMenu(params.shop, type, 4, price);
            }
            if (params.name == "shoes") {
                menuList.showShopClothMenu(params.shop, type, 6, price);
            }
            if (params.name == "acess") {
                menuList.showShopClothMenu(params.shop, type, 7, price);
            }
            if (params.name == "armor") {
                menuList.showShopClothMenu(params.shop, type, 8, price);
            }
        }
        if (params.type === 'c:buy') {

            if (params.id1 === 8) {
                cloth.change(11, params.id6, params.id7, params.id4, params.id5, params.id2, params.id);
                user.updateTattoo(true, true, false, true);
            }
            else {
                cloth.change(params.id1, params.id2, params.id, params.id4, params.id5, params.id6, params.id7);
                if (params.id1 == 11)
                    user.updateTattoo(true, true, false, true);
            }
        }
        if (params.type === 'p:buy') {
            cloth.changeProp(params.id1, params.id2, params.idx);
        }
        if (params.type === 'print:buy') {
            user.setCache('tprint_c', ' ');
            user.updateTattoo(true, true, false, true);
            user.setDecoration(params.tatto1, params.tatto2, true);
        }
        if (params.type === 'b:show') {
            let index = methods.parseInt(params.id);

            switch (params.zone) {
                case 'SKIN_HAIR':
                    skin.SKIN_HAIR = index;
                    mp.players.local.setComponentVariation(2, skin.SKIN_HAIR, 0, 2);
                    mp.players.local.setHairColor(skin.SKIN_HAIR_COLOR, skin.SKIN_HAIR_COLOR_2);

                    user.updateTattoo(true, true, true, false);

                    if (skin.SKIN_HAIR_2) {
                        let data = JSON.parse(enums.overlays)[user.getSex()][skin.SKIN_HAIR];
                        user.setDecoration(data[0], data[1], true);
                    }

                    let data2 = JSON.parse(enums.overlays)[user.getSex()][skin.SKIN_HAIR_3];
                    user.setDecoration(data2[0], data2[1], true);
                    break;
                /*case 'SKIN_HAIR_2':
                    user.removeMoney(methods.parseInt(item.price), 'Услуги барбершопа ' + item.label);
                    business.addMoney(shopId, methods.parseInt(item.price), item.label);
                    user.set(item.doName, index);
                    mp.game.ui.notifications.show("~g~Вы изменили внешность по цене: ~s~$" + methods.parseInt(item.price));
                    user.updateCharacterFace();
                    break;*/
                case 'SKIN_HAIR_3':

                    skin.SKIN_HAIR_3 = index;
                    user.updateTattoo(true, true, true, false);

                    if (skin.SKIN_HAIR_2) {
                        let data = JSON.parse(enums.overlays)[user.getSex()][skin.SKIN_HAIR];
                        user.setDecoration(data[0], data[1], true);
                    }

                    let data = JSON.parse(enums.overlays)[user.getSex()][skin.SKIN_HAIR_3];
                    user.setDecoration(data[0], data[1], true);
                    break;
                case 'SKIN_HAIR_COLOR':
                    skin.SKIN_HAIR_COLOR = index;
                    mp.players.local.setHairColor(skin.SKIN_HAIR_COLOR, skin.SKIN_HAIR_COLOR_2);
                    user.updateTattoo(true, true, true, false);

                    if (skin.SKIN_HAIR_2) {
                        let data1 = JSON.parse(enums.overlays)[user.getSex()][skin.SKIN_HAIR];
                        user.setDecoration(data1[0], data1[1], true);
                    }

                    let data1 = JSON.parse(enums.overlays)[user.getSex()][skin.SKIN_HAIR_3];
                    user.setDecoration(data1[0], data1[1], true);
                    break;
                case 'SKIN_HAIR_COLOR_2':
                    skin.SKIN_HAIR_COLOR_2 = index;
                    mp.players.local.setHairColor(skin.SKIN_HAIR_COLOR, skin.SKIN_HAIR_COLOR_2);
                    user.updateTattoo(true, true, true, false);

                    if (skin.SKIN_HAIR_2) {
                        let data2 = JSON.parse(enums.overlays)[user.getSex()][skin.SKIN_HAIR];
                        user.setDecoration(data2[0], data2[1], true);
                    }

                    let data3 = JSON.parse(enums.overlays)[user.getSex()][skin.SKIN_HAIR_3];
                    user.setDecoration(data3[0], data3[1], true);
                    break;
                case 'SKIN_EYE_COLOR':
                    skin.SKIN_EYE_COLOR = index;
                    mp.players.local.setEyeColor(skin.SKIN_EYE_COLOR);
                    break;
                case 'SKIN_EYEBROWS':
                    skin.SKIN_EYEBROWS = index;
                    mp.players.local.setHeadOverlay(2, skin.SKIN_EYEBROWS, 1.0, skin.SKIN_EYEBROWS_COLOR, 0);
                    break;
                case 'SKIN_EYEBROWS_COLOR':
                    skin.SKIN_EYEBROWS_COLOR = index;
                    mp.players.local.setHeadOverlay(2, skin.SKIN_EYEBROWS, 1.0, skin.SKIN_EYEBROWS_COLOR, 0);
                    break;
                case 'SKIN_OVERLAY_9':
                    skin.SKIN_OVERLAY_9 = index;
                    mp.players.local.setHeadOverlay(9, skin.SKIN_OVERLAY_9, 1.0, skin.SKIN_OVERLAY_COLOR_9, 0);
                    break;
                case 'SKIN_OVERLAY_COLOR_9':
                    skin.SKIN_OVERLAY_COLOR_9 = index;
                    mp.players.local.setHeadOverlay(9, skin.SKIN_OVERLAY_9, 1.0, skin.SKIN_OVERLAY_COLOR_9, 0);
                    break;
                case 'SKIN_OVERLAY_1':
                    skin.SKIN_OVERLAY_1 = index;
                    mp.players.local.setHeadOverlay(1, skin.SKIN_OVERLAY_1, 1.0, skin.SKIN_OVERLAY_COLOR_1, 0);
                    break;
                case 'SKIN_OVERLAY_COLOR_1':
                    skin.SKIN_OVERLAY_COLOR_1 = index;
                    mp.players.local.setHeadOverlay(1, skin.SKIN_OVERLAY_1, 1.0, skin.SKIN_OVERLAY_COLOR_1, 0);
                    break;
                case 'SKIN_OVERLAY_4':
                    skin.SKIN_OVERLAY_4 = index;
                    mp.players.local.setHeadOverlay(4, skin.SKIN_OVERLAY_4, 1.0, skin.SKIN_OVERLAY_COLOR_4, 0);
                    break;
                case 'SKIN_OVERLAY_COLOR_4':
                    skin.SKIN_OVERLAY_COLOR_4 = index;
                    mp.players.local.setHeadOverlay(4, skin.SKIN_OVERLAY_4, 1.0, skin.SKIN_OVERLAY_COLOR_4, 0);
                    break;
                case 'SKIN_OVERLAY_5':
                    skin.SKIN_OVERLAY_5 = index;
                    mp.players.local.setHeadOverlay(5, skin.SKIN_OVERLAY_5, 1.0, skin.SKIN_OVERLAY_COLOR_5, 0);
                    break;
                case 'SKIN_OVERLAY_COLOR_5':
                    skin.SKIN_OVERLAY_COLOR_5 = index;
                    mp.players.local.setHeadOverlay(5, skin.SKIN_OVERLAY_5, 1.0, skin.SKIN_OVERLAY_COLOR_5, 0);
                    break;
                case 'SKIN_OVERLAY_8':
                    skin.SKIN_OVERLAY_8 = index;
                    mp.players.local.setHeadOverlay(8, skin.SKIN_OVERLAY_8, 1.0, skin.SKIN_OVERLAY_COLOR_8, 0);
                    break;
                case 'SKIN_OVERLAY_COLOR_8':
                    skin.SKIN_OVERLAY_COLOR_8 = index;
                    mp.players.local.setHeadOverlay(8, skin.SKIN_OVERLAY_8, 1.0, skin.SKIN_OVERLAY_COLOR_8, 0);
                    break;
                case 'SKIN_OVERLAY_10':
                    skin.SKIN_OVERLAY_10 = index;
                    mp.players.local.setHeadOverlay(10, skin.SKIN_OVERLAY_10, 1.0, skin.SKIN_OVERLAY_COLOR_10, 0);
                    break;
                case 'SKIN_OVERLAY_COLOR_10':
                    skin.SKIN_OVERLAY_COLOR_10 = index;
                    mp.players.local.setHeadOverlay(10, skin.SKIN_OVERLAY_10, 1.0, skin.SKIN_OVERLAY_COLOR_10, 0);
                    break;
            }
        }
    }
    catch (e) {
        mp.game.ui.notifications.show(`~r~Произошла неизвестная ошибка #2`);
        methods.debug(e);
    }
});

mp.events.add('client:shopMenu:buyCash2', async function(json) {
    try {
        let params = JSON.parse(json);
        methods.debug(json);
        if(params.doName == 'tt:show')
            mp.events.callRemote('server:tattoo:buy', params.tatto1, params.tatto2, '', params.price, params.tatto0, params.shop, 0);
        if(params.doName == 'tt:destroy')
            mp.events.callRemote('server:tattoo:destroy', params.tatto1, params.tatto2, '', params.price,'Лазерная коррекция', params.shop, 0);
        if(params.type == 'lsc:number:buy') {
            shopMenu.hideShop2();
            let number = await menuList.getUserInput("Номер", "", 8);
            mp.events.callRemote('server:lsc:buyNumber', params.shop, number.toUpperCase(), 0);
        }
        if(params.type == 'lsc:repair:buy')
            mp.events.callRemote('server:lsc:repair', params.shop, params.price, 0);
        if(params.type == 'lsc:color:buy')
            mp.events.callRemote('server:lsc:buyColor' + params.ev, params.modType, params.price, params.shop, `Цвет: ${params.itemName}`, 0);
        if(params.type == 'lsc:s:setNeon')
            mp.events.callRemote('server:lsc:buyNeon', params.shop, params.price, 0);
        if(params.type == 'lsc:s:setLight')
            mp.events.callRemote('server:lsc:buyLight', params.shop, params.price, 0);
        if(params.type == 'lsc:s:setSpecial')
            mp.events.callRemote('server:lsc:buySpecial', params.shop, params.price, 0);
        if(params.type == 'lsc:s:setSmoke')
            menuList.showLscTyreColorChoiseMenu(params.shop)
        if(params.type == 'lsc:s:buySmoke')
            mp.events.callRemote('server:lsc:buyTyreColor', params.id, params.price, params.shop, 0);
        if(params.type == 'lsc:s:numberPlate')
            mp.events.callRemote('server:lsc:buyNumberType', params.id, params.price, params.shop, 0);
        if(params.type == 'lsc:s:mod:reset')
            mp.events.callRemote('server:lsc:resetSTun', params.idx);
        if (params.type === 'lsc:list:remove')
            mp.events.callRemote('server:lsc:buyTun',  params.modType, -1, params.price, params.shop, 'Стандартная деталь', 0);
        if (params.type === 'lsc:list:buy')
            mp.events.callRemote('server:lsc:buyTun',  params.modType, params.id, params.price, params.shop, params.itemName, 0);
        if(params.type == 'lsc:s:mod:buy') {
            if (params.mod === 0)
                mp.events.callRemote('server:lsc:buySTun', params.mod, params.idx, params.price, params.shop, enums.lscSNames[params.mod][0], 0);
            else
                mp.events.callRemote('server:lsc:buySTun', params.mod, params.idx / 10, params.price, params.shop, enums.lscSNames[params.mod][0], 0);
        }
        if(params.type == 'lsc:s:fix') {
            mp.events.callRemote('server:lsc:buySFix', params.idx, params.price, params.shop, params.fixName, 0);
        }
        if (params.type === 'mask:buy') {
            quest.gang(false, -1, 4);
            cloth.buyMask(params.maskPrice, params.idxFull, params.shop, 0);
        }
        if(params.type == 'b:show') {

            if (user.getCashMoney() < params.price) {
                user.showCustomNotify('У Вас недостаточно денег', 1, 9);
                return;
            }
            achievement.doneDailyById(16);
            user.removeCashMoney(methods.parseInt(params.price), 'Услуги барбершопа ' + params.name);

            if (await business.isOpen(params.shop))
                business.addMoney(params.shop, methods.parseInt(params.price), params.name);
            user.set(params.zone, params.id);
            user.showCustomNotify("Вы изменили внешность по цене: $" + methods.parseInt(params.price), 0, 9);
            user.updateCharacterFace();
            user.save();
        }
        if(params.type == 'c:buy') {
            quest.standart(false, -1, 6);
            quest.gang(false, -1, 3);

            if (params.id1 === 8)
                cloth.buy(params.id8, 11, params.id6, params.id7, params.id4, params.id5, params.id2, params.id, params.itemName + ' #' + (params.id + 1), params.shop, false, 0);
            else
                cloth.buy(params.id8, params.id1, params.id2, params.id, params.id4, params.id5, params.id6, params.id7, params.itemName + ' #' + (params.id + 1), params.shop, false, 0);
        }
        if(params.type == 'p:buy') {
            quest.standart(false, -1, 6);
            cloth.buyProp(params.id4, params.id1, params.id2, params.idx, params.itemName, params.shop, false, 0);
        }
        if (params.type === 'print:buy') {
            mp.events.callRemote('server:print:buy', params.tatto1, params.tatto2, params.price, params.shop, 0);
        }
    }
    catch (e) {
        mp.game.ui.notifications.show(`~r~Произошла неизвестная ошибка #1`);
        methods.debug(e);
    }
});

mp.events.add('client:shopMenu:buyCard2', async function(json) {
    if (user.getCache('bank_card') < 1) {
        user.showCustomNotify(`У Вас нет банковской карты`, 1, 9);
        return;
    }
    try {
        let params = JSON.parse(json);
        methods.debug(json);
        if(params.doName == 'tt:show')
            mp.events.callRemote('server:tattoo:buy', params.tatto1, params.tatto2, '', params.price, params.tatto0, params.shop, 1);
        if(params.doName == 'tt:destroy')
            mp.events.callRemote('server:tattoo:destroy', params.tatto1, params.tatto2, '', params.price,'Лазерная коррекция', params.shop, 1);
        if(params.type == 'lsc:number:buy') {
            shopMenu.hideShop2();
            let number = await menuList.getUserInput("Номер", "", 8);
            mp.events.callRemote('server:lsc:buyNumber', params.shop, number.toUpperCase(), 1);
        }
        if(params.type == 'lsc:repair:buy')
            mp.events.callRemote('server:lsc:repair', params.shop, params.price, 1);
        if(params.type == 'lsc:color:buy')
            mp.events.callRemote('server:lsc:buyColor' + params.ev, params.modType, params.price, params.shop, `Цвет: ${params.itemName}`, 1);
        if(params.type == 'lsc:s:setNeon')
            mp.events.callRemote('server:lsc:buyNeon', params.shop, params.price, 1);
        if(params.type == 'lsc:s:setLight')
            mp.events.callRemote('server:lsc:buyLight', params.shop, params.price, 1);
        if(params.type == 'lsc:s:setSpecial')
            mp.events.callRemote('server:lsc:buySpecial', params.shop, params.price, 1);
        if(params.type == 'lsc:s:setSmoke')
            menuList.showLscTyreColorChoiseMenu(params.shop);
        if(params.type == 'lsc:s:buySmoke')
            mp.events.callRemote('server:lsc:buyTyreColor', params.id, params.price, params.shop, 1);
        if(params.type == 'lsc:s:numberPlate')
            mp.events.callRemote('server:lsc:buyNumberType', params.id, params.price, params.shop, 1);
        if(params.type == 'lsc:s:mod:reset')
            mp.events.callRemote('server:lsc:resetSTun', params.idx);
        if (params.type === 'lsc:list:remove')
            mp.events.callRemote('server:lsc:buyTun',  params.modType, -1, params.price, params.shop, 'Стандартная деталь', 1);
        if (params.type === 'lsc:list:buy')
            mp.events.callRemote('server:lsc:buyTun',  params.modType, params.id, params.price, params.shop, params.itemName, 1);
        if(params.type == 'lsc:s:mod:buy') {
            if (params.mod === 0)
                mp.events.callRemote('server:lsc:buySTun', params.mod, params.idx, params.price, params.shop, enums.lscSNames[params.mod][0], 1);
            else
                mp.events.callRemote('server:lsc:buySTun', params.mod, params.idx / 10, params.price, params.shop, enums.lscSNames[params.mod][0], 1);
        }
        if(params.type == 'lsc:s:fix') {
            mp.events.callRemote('server:lsc:buySFix', params.idx, params.price, params.shop, params.fixName, 1);
        }
        if (params.type === 'mask:buy') {
            quest.gang(false, -1, 4);
            cloth.buyMask(params.maskPrice, params.idxFull, params.shop, 1);
        }
        if(params.type == 'b:show') {

            if (user.getBankMoney() < params.price) {
                user.showCustomNotify('У Вас недостаточно денег', 1, 9);
                return;
            }

            achievement.doneDailyById(16);
            user.removeBankMoney(methods.parseInt(params.price), 'Услуги барбершопа ' + params.name);
            if (await business.isOpen(params.shop))
                business.addMoney(params.shop, methods.parseInt(params.price), params.name);
            user.set(params.zone, params.id);
            user.showCustomNotify("Вы изменили внешность по цене: $" + methods.parseInt(params.price), 0, 9);
            user.updateCharacterFace();
            user.save();
        }

        if(params.type == 'c:buy') {
            quest.standart(false, -1, 6);
            quest.gang(false, -1, 3);
            if (params.id1 === 8)
                cloth.buy(params.id8, 11, params.id6, params.id7, params.id4, params.id5, params.id2, params.id, params.itemName + ' #' + (params.id + 1), params.shop, false, 1);
            else
                cloth.buy(params.id8, params.id1, params.id2, params.id, params.id4, params.id5, params.id6, params.id7, params.itemName + ' #' + (params.id + 1), params.shop, false, 1);
        }
        if(params.type == 'p:buy') {
            quest.standart(false, -1, 6);
            cloth.buyProp(params.id4, params.id1, params.id2, params.idx, params.itemName, params.shop, false, 1);
        }
        if (params.type === 'print:buy') {
            mp.events.callRemote('server:print:buy', params.tatto1, params.tatto2, params.price, params.shop, 1);
        }
    }
    catch (e) {
        mp.game.ui.notifications.show(`~r~Произошла неизвестная ошибка #0`);
        methods.debug(e);
    }
});

mp.events.add('client:carRent:buyCash', async function(name, json) {
    try {
        let params = JSON.parse(json);
        quest.standart(false, -1, 2);
        mp.events.callRemote('server:rent:buy', params.hash, params.price, params.shop, 0);
        shopMenu.hideCarRent();
    }
    catch (e) {
        mp.game.ui.notifications.show(`~r~Произошла неизвестная ошибка`);
        methods.debug(e);
    }
});

mp.events.add('client:carRent:buyCard', async function(name, json) {
    if (user.getCache('bank_card') < 1) {
        mp.game.ui.notifications.show(`~r~У Вас нет банковской карты`);
        return;
    }
    try {
        let params = JSON.parse(json);
        quest.standart(false, -1, 2);
        mp.events.callRemote('server:rent:buy', params.hash, params.price, params.shop, 1);
        shopMenu.hideCarRent();
    }
    catch (e) {
        mp.game.ui.notifications.show(`~r~Произошла неизвестная ошибка`);
        methods.debug(e);
    }
});

mp.events.add('client:shopMenu:buyCash', async function(json) {
    try {
        let params = JSON.parse(json);
        methods.debug(json);
        if (params.doName == 'radio') {
            if (user.getCashMoney() < params.price) {
                mp.game.ui.notifications.show(`~r~У вас недостаточно средств`);
                return;
            }
            if (user.getCache('walkie_buy')) {
                mp.game.ui.notifications.show(`~r~У вас уже есть рация`);
                return;
            }
            try {
                user.setVariable('walkieBuy', true);
                user.set('walkie_buy', true);
                setTimeout(function () {
                    user.removeCashMoney(params.price, 'Покупка Рации');
                    business.addMoney(params.shop, params.price, 'Покупка рации');
                    business.removeMoneyTax(params.shop, params.price / 2);
                    mp.game.ui.notifications.show(`~g~Поздравляем с покупкой рации`);
                }, 300);
            }
            catch (e) {

            }
        }
        else if (params.doName == 'hPin') {
            if (user.getCashMoney() < params.price) {
                mp.game.ui.notifications.show(`~g~У вас недостаточно средств`);
                return;
            }
            if (user.hasCache('house_id') === 0) {
                mp.game.ui.notifications.show(`~r~У вас нет дома`);
                return;
            }
            try {
                user.removeCashMoney(params.price, 'Покупка двери с пинкодом');
                business.addMoney(params.shop, params.price, 'Покупка двери с пинкодом');
                business.removeMoneyTax(params.shop, params.price / 2);
                mp.game.ui.notifications.show(`~g~Поздравляем с покупкой`);
                houses.updatePin(user.getCache('house_id'), 1234);
            }
            catch (e) {

            }
        }
        else if (params.doName == 'hSafe') {
            if (user.getCashMoney() < params.price) {
                mp.game.ui.notifications.show(`~g~У вас недостаточно средств`);
                return;
            }
            if (user.hasCache('house_id') === 0) {
                mp.game.ui.notifications.show(`~r~У вас нет дома`);
                return;
            }
            try {
                user.removeCashMoney(params.price, 'Покупка двери с пинкодом');
                business.addMoney(params.shop, params.price, 'Покупка двери с пинкодом');
                business.removeMoneyTax(params.shop, params.price / 2);
                mp.game.ui.notifications.show(`~g~Поздравляем с покупкой`);
                houses.updateSafe(user.getCache('house_id'), 1234);
            }
            catch (e) {

            }
        }
        else if (params.doName == 'cPin') {
            if (user.getCashMoney() < params.price) {
                mp.game.ui.notifications.show(`~g~У вас недостаточно средств`);
                return;
            }
            if (user.hasCache('condo_id') === 0) {
                mp.game.ui.notifications.show(`~r~У вас нет квартиры`);
                return;
            }
            try {
                user.removeCashMoney(params.price, 'Покупка двери с пинкодом');
                business.addMoney(params.shop, params.price, 'Покупка двери с пинкодом');
                business.removeMoneyTax(params.shop, params.price / 2);
                mp.game.ui.notifications.show(`~g~Поздравляем с покупкой`);
                condos.updatePin(user.getCache('condo_id'), 1234);
            }
            catch (e) {

            }
        }
        else if (params.doName == 'cSafe') {
            if (user.getCashMoney() < params.price) {
                mp.game.ui.notifications.show(`~g~У вас недостаточно средств`);
                return;
            }
            if (user.hasCache('condo_id') === 0) {
                mp.game.ui.notifications.show(`~r~У вас нет квартиры`);
                return;
            }
            try {
                user.removeCashMoney(params.price, 'Покупка двери с пинкодом');
                business.addMoney(params.shop, params.price, 'Покупка двери с пинкодом');
                business.removeMoneyTax(params.shop, params.price / 2);
                mp.game.ui.notifications.show(`~g~Поздравляем с покупкой`);
                condos.updateSafe(user.getCache('condo_id'), 1234);
            }
            catch (e) {

            }
        }
        else if (params.doName == 'med_lic') {
            if (!user.getCache('med_lic'))
                business.addMoney(params.shop, params.price / 5, 'Мед. страховка (20% от стоимости)');
            user.buyLicense('med_lic', params.price, 6, 0);
        }
        else if (params.doName == 'armour') {
            let amount = await inventory.getInvAmount(user.getCache('id'), 1);
            if (amount + items.getItemAmountById(252) > await inventory.getInvAmountMax(user.getCache('id'), 1)) {
                mp.game.ui.notifications.show('~r~В инвентаре нет места');
                return;
            }
            if (params.price > user.getCashMoney()) {
                mp.game.ui.notifications.show("~r~У вас недостаточно средств");
                return;
            }
            inventory.addItem(252, 1, inventory.types.Player, user.getCache('id'), params.count);
            mp.game.ui.notifications.show("~b~Вы купили бронежилет");
            user.removeCashMoney(params.price, 'Покупка бронежилета');
            business.addMoney(params.shop, params.price, 'Бронежилет');
            inventory.updateAmount(user.getCache('id'), 1);
        }

        else if (params.t === 'tm') {
            mp.events.callRemote('server:tradeMarket:buy', params.id, params.price, params.name, params.ownerId, 1);
        }
        else {
            if (items.isWeapon(params.id)) {
                if (!user.getCache('gun_lic')) {
                    mp.game.ui.notifications.show("~r~У Вас нет лицензии на оружие");
                    return;
                }
                mp.events.callRemote('server:gun:buy', params.id, params.price, 1, methods.parseInt(params.superTint), methods.parseInt(params.tint), params.shop, 0);
            }
            else {
                if (params.id === 251)
                    quest.fish(false, -1, 1);
                else
                    quest.standart(false, -1, 5);

                mp.events.callRemote('server:shop:buy', params.id, params.price, params.shop);
            }
        }
    }
    catch (e) {
        mp.game.ui.notifications.show(`~r~Произошла неизвестная ошибка`);
        methods.debug(e);
    }
});

mp.events.add('client:shopMenu:buyCard', async function(json) {
    if (user.getCache('bank_card') < 1) {
        mp.game.ui.notifications.show(`~r~У Вас нет банковской карты`);
        return;
    }
    try {
        let params = JSON.parse(json);
        if (params.doName === 'radio') {
            if (user.getBankMoney() < params.price) {
                mp.game.ui.notifications.show(`~r~У вас недостаточно средств`);
                return;
            }
            try {
                user.setVariable('walkieBuy', true);
                user.set('walkie_buy', true);
                setTimeout(function () {
                    user.removeBankMoney(params.price, 'Покупка Рации');
                    business.addMoney(params.shop, params.price, 'Покупка рации');
                    business.removeMoneyTax(params.shop, params.price / 2);
                    mp.game.ui.notifications.show(`~g~Поздравляем с покупкой рации`);
                }, 300);
            }
            catch (e) {

            }
        }
        else if (params.doName === 'hPin') {
            if (user.getBankMoney() < params.price) {
                mp.game.ui.notifications.show(`~g~У вас недостаточно средств`);
                return;
            }
            if (user.hasCache('house_id') === 0) {
                mp.game.ui.notifications.show(`~r~У вас нет дома`);
                return;
            }
            try {
                user.removeBankMoney(params.price, 'Покупка двери с пинкодом');
                business.addMoney(params.shop, params.price, 'Покупка двери с пинкодом');
                business.removeMoneyTax(params.shop, params.price / 2);
                mp.game.ui.notifications.show(`~g~Поздравляем с покупкой`);
                houses.updatePin(user.getCache('house_id'), 1234);
            }
            catch (e) {

            }
        }
        else if (params.doName === 'hSafe') {
            if (user.getBankMoney() < params.price) {
                mp.game.ui.notifications.show(`~g~У вас недостаточно средств`);
                return;
            }
            if (user.hasCache('house_id') === 0) {
                mp.game.ui.notifications.show(`~r~У вас нет дома`);
                return;
            }
            try {
                user.removeBankMoney(params.price, 'Покупка двери с пинкодом');
                business.addMoney(params.shop, params.price, 'Покупка двери с пинкодом');
                business.removeMoneyTax(params.shop, params.price / 2);
                mp.game.ui.notifications.show(`~g~Поздравляем с покупкой`);
                houses.updateSafe(user.getCache('house_id'), 1234);
            }
            catch (e) {

            }
        }
        else if (params.doName === 'cPin') {
            if (user.getBankMoney() < params.price) {
                mp.game.ui.notifications.show(`~g~У вас недостаточно средств`);
                return;
            }
            if (user.hasCache('condo_id') === 0) {
                mp.game.ui.notifications.show(`~r~У вас нет квартиры`);
                return;
            }
            try {
                user.removeBankMoney(params.price, 'Покупка двери с пинкодом');
                business.addMoney(params.shop, params.price, 'Покупка двери с пинкодом');
                business.removeMoneyTax(params.shop, params.price / 2);
                mp.game.ui.notifications.show(`~g~Поздравляем с покупкой`);
                condos.updatePin(user.getCache('condo_id'), 1234);
            }
            catch (e) {

            }
        }
        else if (params.doName === 'cSafe') {
            if (user.getBankMoney() < params.price) {
                mp.game.ui.notifications.show(`~g~У вас недостаточно средств`);
                return;
            }
            if (user.hasCache('condo_id') === 0) {
                mp.game.ui.notifications.show(`~r~У вас нет квартиры`);
                return;
            }
            try {
                user.removeBankMoney(params.price, 'Покупка двери с пинкодом');
                business.addMoney(params.shop, params.price, 'Покупка двери с пинкодом');
                business.removeMoneyTax(params.shop, params.price / 2);
                mp.game.ui.notifications.show(`~g~Поздравляем с покупкой`);
                condos.updateSafe(user.getCache('condo_id'), 1234);
            }
            catch (e) {

            }
        }
        else if (params.doName === 'med_lic') {
            if (!user.getCache('med_lic'))
                business.addMoney(params.shop, params.price / 5, 'Мед. страховка (20% от стоимости)');
            user.buyLicense('med_lic', params.price, 6, 1);
        }
        else if (params.doName == 'armour') {
            let amount = await inventory.getInvAmount(user.getCache('id'), 1);
            if (amount + items.getItemAmountById(252) > await inventory.getInvAmountMax(user.getCache('id'), 1)) {
                mp.game.ui.notifications.show('~r~В инвентаре нет места');
                return;
            }
            if (params.price > user.getBankMoney()) {
                mp.game.ui.notifications.show("~r~У вас недостаточно средств");
                return;
            }
            inventory.addItem(252, 1, inventory.types.Player, user.getCache('id'), params.count);
            mp.game.ui.notifications.show("~b~Вы купили бронежилет");
            user.removeBankMoney(params.price, 'Покупка бронежилета');
            business.addMoney(params.shop, params.price, 'Бронежилет');
            inventory.updateAmount(user.getCache('id'), 1);
        }
        else if (params.t === 'tm') {
            mp.events.callRemote('server:tradeMarket:buy', params.id, params.price, params.name, params.ownerId, 1);
        }
        else {
            if (items.isWeapon(params.id)) {
                if (!user.getCache('gun_lic')) {
                    mp.game.ui.notifications.show("~r~У Вас нет лицензии на оружие");
                    return;
                }
                mp.events.callRemote('server:gun:buy', params.id, params.price, 1,  methods.parseInt(params.superTint), methods.parseInt(params.tint), params.shop, 1);
            }
            else {
                if (params.id === 251)
                    quest.fish(false, -1, 1);
                else
                    quest.standart(false, -1, 5);
                mp.events.callRemote('server:shop:buyCard', params.id, params.price, params.shop);
            }
        }
    }
    catch (e) {
        mp.game.ui.notifications.show(`~r~Произошла неизвестная ошибка`);
        methods.debug(e);
    }
});

mp.events.add('client:shopMenu:doName', function(json) {
    try {
        let params = JSON.parse(json);
        if (params.doName === 'sellFish') {
            shopMenu.hideAll();
            inventory.getItemListSellFish(params.shop);
        }
    }
    catch (e) {
        mp.game.ui.notifications.show(`~r~Произошла неизвестная ошибка`);
    }
});

mp.events.add('client:dialog:btn', async function(json) {
    try {
        let params = JSON.parse(json);
        if (params.doName === 'close') {
            shopMenu.hideDialog();
        }
        if (params.doName === 'quest:all') {
            shopMenu.hideDialog();
            quest.standart(true);
        }
        if (params.doName === 'quest:lamar') {
            shopMenu.hideDialog();
            quest.gang(true);
        }
        if (params.doName === 'quest:noob') {
            shopMenu.hideDialog();
            quest.role0(true);
        }
        if (params.doName === 'noob:startStop') {
            loader.startOrEnd();
        }
        if (params.doName === 'lspd:takeWeap') {
            shopMenu.hideDialog();
            mp.events.callRemote('server:user:toLspdSafe');
        }
        if (params.doName === 'inv:rentWorkCar') {
            shopMenu.hideDialog();
            if (user.getCache('job') != 3) {
                mp.game.ui.notifications.show(`~r~Необходимо работать фотографом`);
                return;
            }

            if (user.getMoney() < 200) {
                mp.game.ui.notifications.show(`~r~У Вас недостаточно средств`);
                return;
            }

            user.removeMoney(200, 'Аренда рабочего ТС');
            vehicles.spawnJobCar(-1051.93359375, -249.95065307617188, 37.56923294067383, 203.91482543945312, 'Rebel2', 3);
        }
        if (params.doName === 'inv:wantWork') {
            shopMenu.hideDialog();
            let discord = await menuList.getUserInput('Введите ваш DISCORD', '', 30);
            let text = await menuList.getUserInput('Почему вы хотите тут работать?', '', 100);
            mp.game.ui.notifications.show(`~g~Заявление было отправлено, скоро с вами свяжутся в дискорде`);
            mp.events.callRemote('server:discord:sendWorkNews', discord, text);
        }
        if (params.doName === 'lspd:wantWork') {
            shopMenu.hideDialog();
            let discord = await menuList.getUserInput('Введите ваш DISCORD', '', 30);
            let text = await menuList.getUserInput('Почему вы хотите тут работать?', '', 100);
            mp.game.ui.notifications.show(`~g~Заявление было отправлено, скоро с вами свяжутся в дискорде`);
            mp.events.callRemote('server:discord:sendWorkLspd', discord, text);
        }
        if (params.doName === 'bcsd:wantWork') {
            shopMenu.hideDialog();
            let discord = await menuList.getUserInput('Введите ваш DISCORD', '', 30);
            let text = await menuList.getUserInput('Почему вы хотите тут работать?', '', 100);
            mp.game.ui.notifications.show(`~g~Заявление было отправлено, скоро с вами свяжутся в дискорде`);
            mp.events.callRemote('server:discord:sendWorkBcsd', discord, text);
        }
        if (params.doName === 'usmc:wantWork') {
            shopMenu.hideDialog();
            let discord = await menuList.getUserInput('Введите ваш DISCORD', '', 30);
            let text = await menuList.getUserInput('Почему вы хотите тут служить?', '', 100);
            mp.game.ui.notifications.show(`~g~Заявление было отправлено, скоро с вами свяжутся в дискорде`);
            mp.events.callRemote('server:discord:sendWorkUsmc', discord, text);
        }
        if (params.doName === 'ems:wantWork') {
            shopMenu.hideDialog();
            let discord = await menuList.getUserInput('Введите ваш DISCORD', '', 30);
            let text = await menuList.getUserInput('Почему вы хотите тут работать?', '', 100);
            mp.game.ui.notifications.show(`~g~Заявление было отправлено, скоро с вами свяжутся в дискорде`);
            mp.events.callRemote('server:discord:sendWorkEms', discord, text);
        }
        if (params.doName === 'ems:free') {
            shopMenu.hideDialog();
            let price = 2000;
            if (user.getCache('med_lic'))
                price = 800;
            if (user.getCashMoney() < price) {
                mp.game.ui.notifications.show(`~r~У вас нет при себе денег на выписку`);
                return ;
            }
            user.removeCashMoney(price, 'Выписка из больницы');
            hosp.freePlayer(true);
        }
        if (params.doName === 'lspd:toJail') {
            shopMenu.hideDialog();
            mp.events.callRemote('server:user:arrest');
        }
        if (params.doName === 'lamar:car') {
            shopMenu.hideDialog();
            lamar.start();
        }
        if (params.doName === 'jail:work') {
            shopMenu.hideDialog();
            if (user.getCache('jail_time') > 0)
                jailer.start();
            else
                ui.showDialog('Тебе необходимо отбывать наказание, чтобы была доступна подработка', 'Джейк');
        }
        if (params.doName === 'yank:ask') {
            npc.showDialogYpd('В общем, тут машина попала в ДТП и сгорела, поэтому дорога перекрыта будет еще минимум на часа 3, езжай в объезд. Приятной дороги!');
            prolog.next();
        }
        if (params.doName === 'lamar:buy') {
            if (user.getCryptoMoney() < 0.2) {
                mp.game.ui.notifications.show(`~r~На счету BitCoin нет столько денег`);
                return;
            }

            user.removeCryptoMoney(0.2, 'Покупка спец. отмычек');
            inventory.takeNewItemJust(5);
            mp.game.ui.notifications.show(`~g~Вы купили отмычку`);
        }
        if (params.doName === 'edu:sml') {
            shopMenu.hideDialog();
            edu.startShort();
        }
        if (params.doName === 'edu:all') {
            shopMenu.hideDialog();
            edu.startLong();
        }
        if (params.doName === 'user:lspd:takeVehicle') {
            shopMenu.hideDialog();
            mp.events.callRemote('server:lspd:takeVehicle', params.x, params.y, params.z, params.rot, params.vid)
        }
        if (params.doName === 'ave:brak') {
            shopMenu.hideDialog();
            let id = methods.parseInt(await menuList.getUserInput('Введите ID игрока'));
            mp.events.callRemote('server:user:askAve', id);
        }
        if (params.doName === 'ave:nobrak') {
            shopMenu.hideDialog();
            let id = methods.parseInt(await menuList.getUserInput('Введите ID игрока'));
            mp.events.callRemote('server:user:askNoAve', id);
        }
        if (params.doName === 'work') {
            npc.showDialogStandart('Тебе необходимо сходить в здание правительства, получить лицензию категории B, а далее устроиться на работу садовника или строителя');
        }
    }
    catch (e) {
        mp.game.ui.notifications.show(`~r~Произошла неизвестная ошибка`);
        methods.debug(e);
    }
});

shopMenu.isHide = function() {
    return hidden;
};

export default shopMenu;