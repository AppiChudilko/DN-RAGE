import Container from './modules/data';
import UIMenu from './modules/menu';
import methods from './modules/methods';
import ui from './modules/ui';
import cefMenu from './modules/cefMenu';

import weather from './manager/weather';
import bind from './manager/bind';
import heliCam from './manager/heliCam';
import edu from './manager/edu';
import quest from "./manager/quest";
import jobPoint from "./manager/jobPoint";
import vSync from "./manager/vSync";
import dispatcher from "./manager/dispatcher";
import drone from "./manager/drone";
import timer from "./manager/timer";
import policeRadar from "./manager/policeRadar";
import prolog from "./manager/prolog";
import achievement from "./manager/achievement";

import user from './user';
import admin from './admin';
import enums from './enums';
import coffer from './coffer';
import items from './items';
import inventory from './inventory';
import weapons from './weapons';
import chat from './chat';
import shopMenu from './shopMenu';
//import voice from './voice';

import houses from './property/houses';
import condos from './property/condos';
import stocks from './property/stocks';
import business from './property/business';
import vehicles from "./property/vehicles";
import yachts from "./property/yachts";
import fraction from "./property/fraction";
import family from "./property/family";

import cloth from './business/cloth';
import vShop from "./business/vShop";
import fuel from "./business/fuel";
import tradeMarket from "./business/tradeMarket";

import bus from "./jobs/bus";
import gr6 from "./jobs/gr6";
import mail from "./jobs/mail";
import photo from "./jobs/photo";
import tree from "./jobs/tree";
import builder from "./jobs/builder";
import loader from "./jobs/loader";
import lamar from "./jobs/lamar";
import trucker from "./jobs/trucker";
import taxi from "./jobs/taxi";
import npc from "./manager/npc";

let menuList = {};

menuList.isShowPlayerMenu = false;

menuList.showHouseBuyMenu = async function(h) {

    UIMenu.Menu.Create(` `, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`, 'hm', false, false, 'h1');

    UIMenu.Menu.AddMenuItem(`Купить дом за ~g~${methods.moneyFormat(h.get('price'))}`, "", {doName: 'buyHouse'});

    let garage = 0;
    if (h.get('ginterior1') >= 0)
        garage++;
    if (h.get('ginterior2') >= 0)
        garage++;
    if (h.get('ginterior3') >= 0)
        garage++;

    UIMenu.Menu.AddMenuItem("~b~Кол-во жилых мест: ~s~" + h.get('max_roommate'));

    if (garage > 0)
        UIMenu.Menu.AddMenuItem("~b~Кол-во гаражей: ~s~" + garage);

    if (h.get('ginterior1') >= 0)
        UIMenu.Menu.AddMenuItem("~b~Гараж: ~s~" + enums.garageNames[h.get('ginterior1')]);
    if (h.get('ginterior2') >= 0)
        UIMenu.Menu.AddMenuItem("~b~Гараж: ~s~" + enums.garageNames[h.get('ginterior2')]);
    if (h.get('ginterior3') >= 0)
        UIMenu.Menu.AddMenuItem("~b~Гараж: ~s~" + enums.garageNames[h.get('ginterior3')]);

    UIMenu.Menu.AddMenuItem(`~g~Осмотреть дом`, "", {doName: 'enterHouse'});

    if (user.getCache('job') == 4) {
        if (!await user.hasById('isMail' + h.get('id')))
            UIMenu.Menu.AddMenuItem(`~g~Положить почту`, "", {doName: 'sendMail'});
        else
            UIMenu.Menu.AddMenuItem("~o~Дом уже обслуживался");
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'enterHouse') {
            houses.enter(h.get('id'));
        }
        else if (item.doName === 'buyHouse') {
            houses.buy(h.get('id'));
        }
        else if (item.doName === 'sendMail') {
            mail.sendMail(h.get('id'))
        }
    });
};

menuList.showHouseInMenu = function(h) {

    UIMenu.Menu.Create(` `, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`, 'hm', false, false, 'h1');

    if (h.get('user_id') == user.getCache('id') ||
        (h.get('id') === 845 && user.isYakuza() && (user.isSubLeader() || user.isLeader())) ||
        (h.get('id') === 535 && user.isRussianMafia() && (user.isSubLeader() || user.isLeader())) ||
        (h.get('id') === 839 && user.isCosaNostra() && (user.isSubLeader() || user.isLeader()))
    ) {
        if (h.get('pin') > 0)
            UIMenu.Menu.AddMenuItem("~y~Сменить пинкод", "", {doName: 'setPin'});
        else {
            UIMenu.Menu.AddMenuItemList("Дверь", ['~g~Открыто', '~r~Закрыто'], "", {doName: 'setLock'}, h.get('is_lock') ? 1 : 0);
        }
        if (h.get('is_safe') > 0)
            UIMenu.Menu.AddMenuItem("~y~Сменить пинкод от сейфа", "", {doName: 'setSafe'});
    }

    if (h.get('ginterior1') >= 0)
        UIMenu.Menu.AddMenuItem(`~g~Войти в ${enums.garageNames[h.get('ginterior1')].toLowerCase()} гараж`, "", {doName: 'enterGarage1'});
    if (h.get('ginterior2') >= 0)
        UIMenu.Menu.AddMenuItem(`~g~Войти в ${enums.garageNames[h.get('ginterior2')].toLowerCase()} гараж`, "", {doName: 'enterGarage2'});
    if (h.get('ginterior3') >= 0)
        UIMenu.Menu.AddMenuItem(`~g~Войти в ${enums.garageNames[h.get('ginterior3')].toLowerCase()} гараж`, "", {doName: 'enterGarage3'});

    UIMenu.Menu.AddMenuItem("~g~Выйти из дома", "", {doName: 'exitHouse'});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnList.Add((item, index) => {
        if (item.doName == 'setLock') {
            if (index == 1) {
                mp.game.ui.notifications.show('Дверь ~r~закрыта');
                houses.lockStatus(h.get('id'), true);
            }
            else {
                mp.game.ui.notifications.show('Дверь ~g~открыта');
                houses.lockStatus(h.get('id'), false);
            }
        }
    });

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName == 'exitHouse') {
            houses.exit(h.get('x'), h.get('y'), h.get('z'), h.get('rot'));
        }
        if (item.doName == 'enterGarage1') {
            houses.enterGarage(h.get('ginterior1'));
        }
        if (item.doName == 'enterGarage2') {
            houses.enterGarage(h.get('ginterior2'));
        }
        if (item.doName == 'enterGarage3') {
            houses.enterGarage(h.get('ginterior3'));
        }
        if (item.doName == 'setPin') {
            let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 5));
            if (pass < 1) {
                mp.game.ui.notifications.show('~r~Пароль должен быть больше нуля');
                return false;
            }
            mp.game.ui.notifications.show('~g~Ваш новый пароль: ~s~' + pass);
            houses.updatePin(h.get('id'), pass);
        }
        if (item.doName == 'setSafe') {
            let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 8));
            if (pass < 1) {
                mp.game.ui.notifications.show('~r~Пароль должен быть больше нуля');
                return false;
            }
            mp.game.ui.notifications.show('~g~Ваш новый пароль: ~s~' + pass);
            houses.updateSafe(h.get('id'), pass);
        }
    });
};

menuList.showHouseInGMenu = function(h) {

    UIMenu.Menu.Create(` `, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`, 'hm', false, false, 'h1');

    UIMenu.Menu.AddMenuItem("~g~Войти в дом", "", {doName: 'enterHouse'});
    UIMenu.Menu.AddMenuItem("~g~Выйти из гаража", "", {doName: 'exitGarage'});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'enterHouse') {
            houses.enter(h.get('id'));
        }
        if (item.doName === 'exitGarage') {
            houses.exit(h.get('x'), h.get('y'), h.get('z'), h.get('rot'));
        }
    });
};

menuList.showHouseInVMenu = function(h) {

    UIMenu.Menu.Create(` `, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`, 'hm', false, false, 'h1');

    UIMenu.Menu.AddMenuItem("~g~Выйти из гаража", "", {doName: 'exitGarage'});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'exitGarage') {
            houses.exitv(h.get('id'));
        }
    });
};

menuList.showHouseOutMenu = async function(h) {

    UIMenu.Menu.Create(` `, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`, 'hm', false, false, 'h1');
    UIMenu.Menu.AddMenuItem(`~b~Владелец:~s~ ${h.get('user_name')}`);

    UIMenu.Menu.AddMenuItem("~b~Кол-во жилых мест: ~s~" + h.get('max_roommate'));

    let garage = 0;
    if (h.get('ginterior1') >= 0)
        garage++;
    if (h.get('ginterior2') >= 0)
        garage++;
    if (h.get('ginterior3') >= 0)
        garage++;
    if (garage > 0)
        UIMenu.Menu.AddMenuItem("~b~Кол-во гаражей: ~s~" + garage);

    UIMenu.Menu.AddMenuItem("~g~Войти", "", {doName: 'enterHouse'});

    if (user.getCache('job') == 4) {
        if (!await user.hasById('isMail' + h.get('id')))
            UIMenu.Menu.AddMenuItem("~g~Положить почту", "", {doName: 'sendMail'});
        else
            UIMenu.Menu.AddMenuItem("~o~Дом уже обслуживался");
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'enterHouse') {
            try {
                if (h.get('pin') > 0 && user.getCache('id') != h.get('user_id')) {
                    mp.game.ui.notifications.show('~r~Введите пинкод');
                    let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 5));
                    if (pass == h.get('pin'))
                        houses.enter(h.get('id'));
                    else
                        mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');
                }
                else if (h.get('is_lock') && h.get('user_id') != user.getCache('id'))
                    mp.game.ui.notifications.show('~r~Дверь закрыта, ее можно взломать отмычкой');
                else
                    houses.enter(h.get('id'));
            }
            catch (e) {
                methods.debug(e);
            }
        }
        else if (item.doName === 'sendMail') {
            mail.sendMail(h.get('id'))
        }
    });
};

menuList.showHouseOutVMenu = async function(h) {

    UIMenu.Menu.Create(` `, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`, 'hm', false, false, 'h1');
    UIMenu.Menu.AddMenuItem(`~b~Владелец:~s~ ${h.get('user_name')}`);
    UIMenu.Menu.AddMenuItem("~g~Войти в гараж", "", {doName: 'enterGarage'});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'enterGarage') {
            try {
                if (h.get('pin') > 0 && user.getCache('id') != h.get('user_id')) {
                    mp.game.ui.notifications.show('~r~Введите пинкод');
                    let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 5));
                    if (pass == h.get('pin'))
                        houses.enterv(h.get('id'));
                    else
                        mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');
                }
                else if (h.get('is_lock') && h.get('user_id') != user.getCache('id'))
                    mp.game.ui.notifications.show('~r~Дверь закрыта, ее можно взломать отмычкой');
                else
                    houses.enterv(h.get('id'));
            }
            catch (e) {
                methods.debug(e);
            }
        }
    });
};

menuList.showCondoBuyMenu = async function(h) {

    UIMenu.Menu.Create(` `, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`, 'hm', false, false, 'h1');

    UIMenu.Menu.AddMenuItem(`Купить квартиру за ~g~${methods.moneyFormat(h.get('price'))}`, "", {doName: 'buyHouse'});
    UIMenu.Menu.AddMenuItem("~g~Осмотреть квартиру", "", {doName: 'enterHouse'});

    if (user.getCache('job') == 4) {
        if (!await user.hasById('isMail2' + h.get('id')))
            UIMenu.Menu.AddMenuItem("~g~Положить почту", "", {doName: 'sendMail'});
        else
            UIMenu.Menu.AddMenuItem("~o~Дом уже обслуживался");
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'enterHouse') {
            condos.enter(h.get('id'));
        }
        else if (item.doName === 'buyHouse') {
            condos.buy(h.get('id'));
        }
        else if (item.doName === 'sendMail') {
            mail.sendMail2(h.get('id'))
        }
    });
};

menuList.showCondoInMenu = function(h) {

    UIMenu.Menu.Create(` `, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`, 'hm', false, false, 'h1');

    if (h.get('user_id') == user.getCache('id')) {
        if (h.get('pin') > 0)
            UIMenu.Menu.AddMenuItem("~y~Сменить пинкод", "", {doName: 'setPin'});
        else {
            UIMenu.Menu.AddMenuItemList("Дверь", ['~g~Открыто', '~r~Закрыто'], "", {doName: 'setLock'}, h.get('is_lock') ? 1 : 0);
        }
        if (h.get('is_safe') > 0)
            UIMenu.Menu.AddMenuItem("~y~Сменить пинкод от сейфа", "", {doName: 'setSafe'});
        //if (h.get('is_sec'))
        //    UIMenu.Menu.AddMenuItem("~y~Подключиться к камере").doName = 'sec';
    }

    UIMenu.Menu.AddMenuItem("~g~Выйти из квартиры", "", {doName: 'exitHouse'});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnList.Add((item, index) => {
        if (item.doName === 'setLock') {
            if (index == 1) {
                mp.game.ui.notifications.show('Дверь ~r~закрыта');
                condos.lockStatus(h.get('id'), true);
            }
            else {
                mp.game.ui.notifications.show('Дверь ~g~открыта');
                condos.lockStatus(h.get('id'), false);
            }
        }
    });

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'exitHouse') {
            condos.exit(h.get('x'), h.get('y'), h.get('z'), h.get('rot'));
        }
        if (item.doName == 'setSafe') {
            let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 8));
            if (pass < 1) {
                mp.game.ui.notifications.show('~r~Пароль должен быть больше нуля');
                return false;
            }
            mp.game.ui.notifications.show('~g~Ваш новый пароль: ~s~' + pass);
            condos.updateSafe(h.get('id'), pass);
        }
        if (item.doName === 'setPin') {
            let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 5));
            if (pass < 1) {
                mp.game.ui.notifications.show('~r~Пароль должен быть больше нуля');
                return false;
            }
            mp.game.ui.notifications.show('~g~Ваш новый пароль: ~s~' + pass);
            condos.updatePin(h.get('id'), pass);
        }
    });
};

menuList.showCondoOutMenu = async function(h) {

    UIMenu.Menu.Create(` `, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`, 'hm', false, false, 'h1');
    UIMenu.Menu.AddMenuItem(`~b~Владелец:~s~ ${h.get('user_name')}`);

    UIMenu.Menu.AddMenuItem("~g~Войти", "", {doName: 'enterHouse'});

    if (user.getCache('job') === 4) {
        if (!await user.hasById('isMail2' + h.get('id')))
            UIMenu.Menu.AddMenuItem("~g~Положить почту", "", {doName: 'sendMail'});
        else
            UIMenu.Menu.AddMenuItem("~o~Дом уже обслуживался");
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'enterHouse') {
            try {
                if (h.get('pin') > 0 && user.getCache('id') != h.get('user_id')) {
                    mp.game.ui.notifications.show('~r~Введите пинкод');
                    let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 5));
                    if (pass == h.get('pin'))
                        condos.enter(h.get('id'));
                    else
                        mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');
                }
                else if (h.get('is_lock') && h.get('user_id') != user.getCache('id'))
                    mp.game.ui.notifications.show('~r~Дверь закрыта, ее можно взломать отмычкой');
                else
                    condos.enter(h.get('id'));
            }
            catch (e) {
                methods.debug(e);
            }
        }
        else if (item.doName === 'sendMail') {
            mail.sendMail2(h.get('id'))
        }
    });
};

menuList.showYachtBuyMenu = async function(h) {

    UIMenu.Menu.Create(` `, `~b~Яхта: ~s~${h.get('name')}`, 'hm', false, false, 'h1');

    UIMenu.Menu.AddMenuItem(`Купить яхту за ~g~${methods.moneyFormat(h.get('price'))}`, "", {doName: 'buyHouse'});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'buyHouse') {
            yachts.buy(h.get('id'));
        }
    });
};

menuList.showYachtOutMenu = async function(h) {

    UIMenu.Menu.Create(` `, `~b~Яхта: ~s~${h.get('name')}`, 'hm', false, false, 'h1');
    UIMenu.Menu.AddMenuItem(`~b~Владелец:~s~ ${h.get('user_name')}`);

    if (h.get('user_id') === user.getCache('id'))
        UIMenu.Menu.AddMenuItem("~y~Сменить имя яхты", "", {doName: 'setName'});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'setName') {
            let pass = methods.removeQuotesAll(await UIMenu.Menu.GetUserInput("Имя", "", 30));
            if (pass === '')
                return false;
            yachts.updateName(h.get('id'), pass);
        }
    });
};

menuList.showStockBuyMenu = async function(h) {

    UIMenu.Menu.Create(` `, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`, 'hm', false, false, 'h1');

    if (h.get('interior') == 0)
        UIMenu.Menu.AddMenuItem(`~b~Тип склада:~s~ Маленький`);
    if (h.get('interior') == 1)
        UIMenu.Menu.AddMenuItem(`~b~Тип склада:~s~ Средний`);
    if (h.get('interior') == 2)
        UIMenu.Menu.AddMenuItem(`~b~Тип склада:~s~ Большой`);

    UIMenu.Menu.AddMenuItem(`Купить склад за ~g~${methods.moneyFormat(h.get('price'))}`, "", {doName: 'buyStock'});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'buyStock') {
            stocks.buy(h.get('id'));
        }
    });
};

menuList.showStockInMenu = function(h) {

    UIMenu.Menu.Create(` `, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`, 'hm', false, false, 'h1');
    UIMenu.Menu.AddMenuItem("~g~Выйти", "", {doName: 'exitStock'});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'exitStock') {
            stocks.exit(h.get('x'), h.get('y'), h.get('z'), h.get('rot'));
        }
    });
};

menuList.showStockPanelMenu = function(h) {

    UIMenu.Menu.Create(` `, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`, 'hm', false, false, 'h1');

    UIMenu.Menu.AddMenuItem("Модернизировать", "", {doName: 'showStockPanelUpgradeMenu'});
    UIMenu.Menu.AddMenuItem("Список ваших ящиков", "", {doName: 'showStockPanelBoxListMenu'});

    UIMenu.Menu.AddMenuItem("Сменить пинкод", "", {doName: 'setPin'});
    if (h.get('interior') == 0) {
        UIMenu.Menu.AddMenuItem("Сменить пинкод от сейфа", "", {doName: 'setPin1'});
    }
    if (h.get('interior') == 1) {
        UIMenu.Menu.AddMenuItem("Сменить пинкод от сейфа #1", "", {doName: 'setPin1'});
        UIMenu.Menu.AddMenuItem("Сменить пинкод от сейфа #2", "", {doName: 'setPin2'});
    }
    if (h.get('interior') == 2) {
        UIMenu.Menu.AddMenuItem("Сменить пинкод от сейфа #1", "", {doName: 'setPin1'});
        UIMenu.Menu.AddMenuItem("Сменить пинкод от сейфа #2", "", {doName: 'setPin2'});
        UIMenu.Menu.AddMenuItem("Сменить пинкод от сейфа #3", "", {doName: 'setPin3'});
    }
    if (h.get('upgrade_g')) {
        UIMenu.Menu.AddMenuItem("Сменить пинкод от офиса", "", {doName: 'setPinO'});
    }
    if (h.get('upgrade_l')) {
        UIMenu.Menu.AddMenuItem("Сменить пинкод от лаборатории", "", {doName: 'setPinL'});
    }
    if (h.get('upgrade_b')) {
        UIMenu.Menu.AddMenuItem("Сменить пинкод от бункера", "", {doName: 'setPinB'});
    }

    //UIMenu.Menu.AddMenuItem("~y~Лог"); //TODO
    UIMenu.Menu.AddMenuItem("Руководство", "", {doName: 'about'});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();

        if (item.doName == 'setPin') {
            let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 10));
            if (pass < 1) {
                mp.game.ui.notifications.show('~r~Пароль должен быть больше нуля');
                return false;
            }
            mp.game.ui.notifications.show('~g~Ваш новый пароль: ~s~' + pass);
            stocks.updatePin(h.get('id'), pass);
        }
        if (item.doName == 'setPin1') {
            let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 5));
            if (pass < 1) {
                mp.game.ui.notifications.show('~r~Пароль должен быть больше нуля');
                return false;
            }
            mp.game.ui.notifications.show('~g~Ваш новый пароль: ~s~' + pass);
            stocks.updatePin1(h.get('id'), pass);
        }
        if (item.doName == 'setPin2') {
            let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 5));
            if (pass < 1) {
                mp.game.ui.notifications.show('~r~Пароль должен быть больше нуля');
                return false;
            }
            mp.game.ui.notifications.show('~g~Ваш новый пароль: ~s~' + pass);
            stocks.updatePin2(h.get('id'), pass);
        }
        if (item.doName == 'setPin3') {
            let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 5));
            if (pass < 1) {
                mp.game.ui.notifications.show('~r~Пароль должен быть больше нуля');
                return false;
            }
            mp.game.ui.notifications.show('~g~Ваш новый пароль: ~s~' + pass);
            stocks.updatePin3(h.get('id'), pass);
        }
        if (item.doName == 'setPinO') {
            let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 5));
            if (pass < 1) {
                mp.game.ui.notifications.show('~r~Пароль должен быть больше нуля');
                return false;
            }
            mp.game.ui.notifications.show('~g~Ваш новый пароль: ~s~' + pass);
            stocks.updatePinO(h.get('id'), pass);
        }
        if (item.doName == 'setPinL') {
            let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 5));
            if (pass < 1) {
                mp.game.ui.notifications.show('~r~Пароль должен быть больше нуля');
                return false;
            }
            mp.game.ui.notifications.show('~g~Ваш новый пароль: ~s~' + pass);
            stocks.updatePinL(h.get('id'), pass);
        }
        if (item.doName == 'setPinB') {
            let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 5));
            if (pass < 1) {
                mp.game.ui.notifications.show('~r~Пароль должен быть больше нуля');
                return false;
            }
            mp.game.ui.notifications.show('~g~Ваш новый пароль: ~s~' + pass);
            stocks.updatePinB(h.get('id'), pass);
        }
        if (item.doName == 'showStockPanelUpgradeMenu') {
            menuList.showStockPanelUpgradeMenu(h);
        }
        if (item.doName == 'about') {
            chat.sendLocal(`!{${chat.clBlue}}Справка`);
            chat.sendLocal(`Вы можете модернизировать склад.`);
            chat.sendLocal(`Если продавать груз коллекциями, то множитель будет увеличиваться, например вы собрали 3 груза одинаково класса, то вы получите множитель x1.1, и так не больше x2.`);
        }
        if (item.doName == 'showStockPanelBoxListMenu') {
            menuList.showStockPanelBoxListMenu(h);
        }
    });
};

menuList.showStockLabMenu = function(h) {

    UIMenu.Menu.Create(` `, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`, 'hm', false, false, 'h1');

    UIMenu.Menu.AddMenuItem(`~b~Химикаты:~s~ ${h.get('lab_1_count')}`, 'Нажмите ~g~Enter~s~ чтобы сделать заказ', {doName: 'showStockLabOfferMenu1'});
    UIMenu.Menu.AddMenuItem(`~b~Стеклянные колбы:~s~ ${h.get('lab_2_count')}`, 'Нажмите ~g~Enter~s~ чтобы сделать заказ', {doName: 'showStockLabOfferMenu2'});
    UIMenu.Menu.AddMenuItem(`~b~Респираторы:~s~ ${h.get('lab_3_count')}`, 'Нажмите ~g~Enter~s~ чтобы сделать заказ', {doName: 'showStockLabOfferMenu3'});
    UIMenu.Menu.AddMenuItem(`~b~Упаковки:~s~ ${h.get('lab_4_count')}`, 'Нажмите ~g~Enter~s~ чтобы сделать заказ', {doName: 'showStockLabOfferMenu4'});
    UIMenu.Menu.AddMenuItem("Произвести партию", "", {doName: 'showStockLabGetMenu'});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName == 'showStockLabOfferMenu1') {
            menuList.showStockLabOfferMenu(h, 1);
        }
        if (item.doName == 'showStockLabOfferMenu2') {
            menuList.showStockLabOfferMenu(h, 2);
        }
        if (item.doName == 'showStockLabOfferMenu3') {
            menuList.showStockLabOfferMenu(h, 3);
        }
        if (item.doName == 'showStockLabOfferMenu4') {
            menuList.showStockLabOfferMenu(h, 4);
        }
        if (item.doName == 'showStockLabGetMenu') {
            menuList.showStockLabGetMenu(h);
        }
    });
};

menuList.showStockLabGetMenu = function(h) {

    UIMenu.Menu.Create(` `, `~b~Изготовление партии`, 'hm', false, false, 'h1');

    if (h.get('lab_state') > 0) {
        UIMenu.Menu.AddMenuItem(`Партия изготавливается... Осталось: ${(h.get('lab_state') / 6).toFixed(2)}ч.`); //10к малая
    }
    else {
        UIMenu.Menu.AddMenuItem("Малая партия (1 час / 5ящ)", "Необходимо 2500 едениц каждого компонента~br~Учтите, если у вас не будет места для ящиков, они просто пропадут", {doName: 'createParty1'});
        UIMenu.Menu.AddMenuItem("Средняя партия (2 часа / 10ящ)", "Необходимо 6250 едениц каждого компонента~br~Учтите, если у вас не будет места для ящиков, они просто пропадут", {doName: 'createParty2'});
        UIMenu.Menu.AddMenuItem("Большая партия (3 часа / 20ящ)", "Необходимо 12500 едениц каждого компонента~br~Учтите, если у вас не будет места для ящиков, они просто пропадут", {doName: 'createParty3'});
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName == 'createParty1') {
            let minCount = 2500;
            if (h.get('lab_1_count') < minCount) {
                mp.game.ui.notifications.show("~r~У вас недостаточно химикатов");
                return;
            }
            if (h.get('lab_2_count') < minCount) {
                mp.game.ui.notifications.show("~r~У вас недостаточно cтеклянных колб");
                return;
            }
            if (h.get('lab_3_count') < minCount) {
                mp.game.ui.notifications.show("~r~У вас недостаточно респираторов");
                return;
            }
            if (h.get('lab_4_count') < minCount) {
                mp.game.ui.notifications.show("~r~У вас недостаточно упаковок");
                return;
            }
            mp.events.callRemote('server:stocks:labStart', h.get('id'), 1, minCount);
            mp.game.ui.notifications.show("~g~Партия начала свое произвосдство");
            achievement.doneAllById(21);
        }
        if (item.doName == 'createParty2') {
            let minCount = 6250;
            if (h.get('lab_1_count') < minCount) {
                mp.game.ui.notifications.show("~r~У вас недостаточно химикатов");
                return;
            }
            if (h.get('lab_2_count') < minCount) {
                mp.game.ui.notifications.show("~r~У вас недостаточно cтеклянных колб");
                return;
            }
            if (h.get('lab_3_count') < minCount) {
                mp.game.ui.notifications.show("~r~У вас недостаточно респираторов");
                return;
            }
            if (h.get('lab_4_count') < minCount) {
                mp.game.ui.notifications.show("~r~У вас недостаточно упаковок");
                return;
            }
            mp.events.callRemote('server:stocks:labStart', h.get('id'), 2, minCount);
            mp.game.ui.notifications.show("~g~Партия начала свое произвосдство");
            achievement.doneAllById(21);
        }
        if (item.doName == 'createParty3') {
            let minCount = 12500;
            if (h.get('lab_1_count') < minCount) {
                mp.game.ui.notifications.show("~r~У вас недостаточно химикатов");
                return;
            }
            if (h.get('lab_2_count') < minCount) {
                mp.game.ui.notifications.show("~r~У вас недостаточно cтеклянных колб");
                return;
            }
            if (h.get('lab_3_count') < minCount) {
                mp.game.ui.notifications.show("~r~У вас недостаточно респираторов");
                return;
            }
            if (h.get('lab_4_count') < minCount) {
                mp.game.ui.notifications.show("~r~У вас недостаточно упаковок");
                return;
            }
            mp.events.callRemote('server:stocks:labStart', h.get('id'), 3, minCount);
            mp.game.ui.notifications.show("~g~Партия начала свое произвосдство");
            achievement.doneAllById(21);
        }
    });
};

menuList.showStockLabOfferMenu = function(h, type) {

    let name = 'Химикаты';
    if (type === 2)
        name = 'Стеклянные колбы';
    if (type === 3)
        name = 'Респираторы';
    if (type === 4)
        name = 'Упаковки';

    UIMenu.Menu.Create(` `, `~b~${name}`, 'hm', false, false, 'h1');

    UIMenu.Menu.AddMenuItem("Малый заказ на 100 едениц", "Стоимость партии ~g~$500", {doName: 'giveOffer1'}); //10к малая
    UIMenu.Menu.AddMenuItem("Средний заказ на 250 едениц", "Стоимость партии ~g~$900", {doName: 'giveOffer2'}); //25к средняя
    UIMenu.Menu.AddMenuItem("Большой заказ на 500 едениц", "Стоимость партии ~g~$1800", {doName: 'giveOffer3'}); //50к большая партия

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName == 'giveOffer1') {
            let money = methods.parseFloat(await UIMenu.Menu.GetUserInput("Сумма", "", 9));
            if (money < 100) {
                mp.game.ui.notifications.show("~r~Сумма не может быть меньше 100$");
                return;
            }
            if (money > 1000) {
                mp.game.ui.notifications.show("~r~Сумма не может быть больше 1000$");
                return;
            }
            if (user.getBankMoney() < money + 500) {
                mp.game.ui.notifications.show("~r~У вас нет столько денег на банковском счету");
                return;
            }
            user.removeBankMoney(money + 500, 'Формирование заказа');
            mp.events.callRemote('server:trucker:addOffer', 1, money, name, h.get('vx'), h.get('vy'), h.get('vz'));
            mp.game.ui.notifications.show("~g~Ваш заказ был обработан");
        }
        if (item.doName == 'giveOffer2') {
            let money = methods.parseFloat(await UIMenu.Menu.GetUserInput("Сумма", "", 9));
            if (money < 200) {
                mp.game.ui.notifications.show("~r~Сумма не может быть меньше 200$");
                return;
            }
            if (money > 2500) {
                mp.game.ui.notifications.show("~r~Сумма не может быть больше 2500$");
                return;
            }
            if (user.getBankMoney() < money + 900) {
                mp.game.ui.notifications.show("~r~У вас нет столько денег на банковском счету");
                return;
            }
            user.removeBankMoney(money + 900, 'Формирование заказа');
            mp.events.callRemote('server:trucker:addOffer', 2, money, name, h.get('vx'), h.get('vy'), h.get('vz'));
            mp.game.ui.notifications.show("~g~Ваш заказ был обработан");
        }
        if (item.doName == 'giveOffer3') {
            let money = methods.parseFloat(await UIMenu.Menu.GetUserInput("Сумма", "", 9));
            if (money < 300) {
                mp.game.ui.notifications.show("~r~Сумма не может быть меньше 300$");
                return;
            }
            if (money > 5000) {
                mp.game.ui.notifications.show("~r~Сумма не может быть больше 5000$");
                return;
            }
            if (user.getBankMoney() < money + 1800) {
                mp.game.ui.notifications.show("~r~У вас нет столько денег на банковском счету");
                return;
            }
            user.removeBankMoney(money + 1800, 'Формирование заказа');
            mp.events.callRemote('server:trucker:addOffer', 3, money, name, h.get('vx'), h.get('vy'), h.get('vz'));
            mp.game.ui.notifications.show("~g~Ваш заказ был обработан");
        }
    });
};

menuList.showStockBunkMenu = function(h) {

    UIMenu.Menu.Create(` `, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`, 'hm', false, false, 'h1');

    UIMenu.Menu.AddMenuItem(`~b~Сплавы:~s~ ${h.get('bunk_1_count')}`, 'Нажмите ~g~Enter~s~ чтобы сделать заказ', {doName: 'showStockBunkOfferMenu1'});
    UIMenu.Menu.AddMenuItem(`~b~Порох:~s~ ${h.get('bunk_2_count')}`, 'Нажмите ~g~Enter~s~ чтобы сделать заказ', {doName: 'showStockBunkOfferMenu2'});
    UIMenu.Menu.AddMenuItem(`~b~Униформа:~s~ ${h.get('bunk_3_count')}`, 'Нажмите ~g~Enter~s~ чтобы сделать заказ', {doName: 'showStockBunkOfferMenu3'});
    UIMenu.Menu.AddMenuItem(`~b~Коробки:~s~ ${h.get('bunk_4_count')}`, 'Нажмите ~g~Enter~s~ чтобы сделать заказ', {doName: 'showStockBunkOfferMenu4'});
    UIMenu.Menu.AddMenuItem("Произвести партию", "", {doName: 'showStockBunkGetMenu'});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName == 'showStockBunkOfferMenu1') {
            menuList.showStockBunkOfferMenu(h, 1);
        }
        if (item.doName == 'showStockBunkOfferMenu2') {
            menuList.showStockBunkOfferMenu(h, 2);
        }
        if (item.doName == 'showStockBunkOfferMenu3') {
            menuList.showStockBunkOfferMenu(h, 3);
        }
        if (item.doName == 'showStockBunkOfferMenu4') {
            menuList.showStockBunkOfferMenu(h, 4);
        }
        if (item.doName == 'showStockBunkGetMenu') {
            menuList.showStockBunkGetMenu(h);
        }
    });
};

menuList.showStockBunkGetMenu = function(h) {

    UIMenu.Menu.Create(` `, `~b~Изготовление партии`, 'hm', false, false, 'h1');

    if (h.get('bunk_state') > 0) {
        UIMenu.Menu.AddMenuItem(`Партия изготавливается... Осталось: ${(h.get('bunk_state') / 6).toFixed(2)}ч.`); //10к малая
    }
    else {
        UIMenu.Menu.AddMenuItem("Малая партия (1 час / 5ящ)", "Необходимо 2500 едениц каждого компонента~br~Учтите, если у вас не будет места для ящиков, они просто пропадут", {doName: 'createParty1'});
        UIMenu.Menu.AddMenuItem("Средняя партия (2 часа / 10ящ)", "Необходимо 6250 едениц каждого компонента~br~Учтите, если у вас не будет места для ящиков, они просто пропадут", {doName: 'createParty2'});
        UIMenu.Menu.AddMenuItem("Большая партия (3 часа / 20ящ)", "Необходимо 12500 едениц каждого компонента~br~Учтите, если у вас не будет места для ящиков, они просто пропадут", {doName: 'createParty3'});
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName == 'createParty1') {
            let minCount = 2500;
            if (h.get('bunk_1_count') < minCount) {
                mp.game.ui.notifications.show("~r~У вас недостаточно сплавов");
                return;
            }
            if (h.get('bunk_2_count') < minCount) {
                mp.game.ui.notifications.show("~r~У вас недостаточно пороха");
                return;
            }
            if (h.get('bunk_3_count') < minCount) {
                mp.game.ui.notifications.show("~r~У вас недостаточно униформы");
                return;
            }
            if (h.get('bunk_4_count') < minCount) {
                mp.game.ui.notifications.show("~r~У вас недостаточно коробок");
                return;
            }
            mp.events.callRemote('server:stocks:bunkStart', h.get('id'), 1, minCount);
            mp.game.ui.notifications.show("~g~Партия начала свое произвосдство");
        }
        if (item.doName == 'createParty2') {
            let minCount = 6250;
            if (h.get('bunk_1_count') < minCount) {
                mp.game.ui.notifications.show("~r~У вас недостаточно сплавов");
                return;
            }
            if (h.get('bunk_2_count') < minCount) {
                mp.game.ui.notifications.show("~r~У вас недостаточно пороха");
                return;
            }
            if (h.get('bunk_3_count') < minCount) {
                mp.game.ui.notifications.show("~r~У вас недостаточно униформы");
                return;
            }
            if (h.get('bunk_4_count') < minCount) {
                mp.game.ui.notifications.show("~r~У вас недостаточно коробок");
                return;
            }
            mp.events.callRemote('server:stocks:bunkStart', h.get('id'), 2, minCount);
            mp.game.ui.notifications.show("~g~Партия начала свое произвосдство");
        }
        if (item.doName == 'createParty3') {
            let minCount = 12500;
            if (h.get('bunk_1_count') < minCount) {
                mp.game.ui.notifications.show("~r~У вас недостаточно сплавов");
                return;
            }
            if (h.get('bunk_2_count') < minCount) {
                mp.game.ui.notifications.show("~r~У вас недостаточно пороха");
                return;
            }
            if (h.get('bunk_3_count') < minCount) {
                mp.game.ui.notifications.show("~r~У вас недостаточно униформы");
                return;
            }
            if (h.get('bunk_4_count') < minCount) {
                mp.game.ui.notifications.show("~r~У вас недостаточно коробок");
                return;
            }
            mp.events.callRemote('server:stocks:bunkStart', h.get('id'), 3, minCount);
            mp.game.ui.notifications.show("~g~Партия начала свое произвосдство");
        }
    });
};

menuList.showStockBunkOfferMenu = function(h, type) {

    let name = 'Сплавы';
    if (type === 2)
        name = 'Порох';
    if (type === 3)
        name = 'Униформа';
    if (type === 4)
        name = 'Корбки';

    UIMenu.Menu.Create(` `, `~b~${name}`, 'hm', false, false, 'h1');

    UIMenu.Menu.AddMenuItem("Малый заказ на 100 едениц", "Стоимость партии ~g~$500", {doName: 'giveOffer1'}); //10к малая
    UIMenu.Menu.AddMenuItem("Средний заказ на 250 едениц", "Стоимость партии ~g~$900", {doName: 'giveOffer2'}); //25к средняя
    UIMenu.Menu.AddMenuItem("Большой заказ на 500 едениц", "Стоимость партии ~g~$1800", {doName: 'giveOffer3'}); //50к большая партия

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName == 'giveOffer1') {
            let money = methods.parseFloat(await UIMenu.Menu.GetUserInput("Сумма", "", 9));
            if (money < 100) {
                mp.game.ui.notifications.show("~r~Сумма не может быть меньше 100$");
                return;
            }
            if (money > 2500) {
                mp.game.ui.notifications.show("~r~Сумма не может быть больше 2500$");
                return;
            }
            if (user.getBankMoney() < money + 500) {
                mp.game.ui.notifications.show("~r~У вас нет столько денег на банковском счету");
                return;
            }
            user.removeBankMoney(money + 500, 'Формирование заказа');
            mp.events.callRemote('server:trucker:addOffer', 1, money, name, h.get('vx'), h.get('vy'), h.get('vz'));
            mp.game.ui.notifications.show("~g~Ваш заказ был обработан");
        }
        if (item.doName == 'giveOffer2') {
            let money = methods.parseFloat(await UIMenu.Menu.GetUserInput("Сумма", "", 9));
            if (money < 200) {
                mp.game.ui.notifications.show("~r~Сумма не может быть меньше 200$");
                return;
            }
            if (money > 5000) {
                mp.game.ui.notifications.show("~r~Сумма не может быть больше 5000$");
                return;
            }
            if (user.getBankMoney() < money + 900) {
                mp.game.ui.notifications.show("~r~У вас нет столько денег на банковском счету");
                return;
            }
            user.removeBankMoney(money + 900, 'Формирование заказа');
            mp.events.callRemote('server:trucker:addOffer', 2, money, name, h.get('vx'), h.get('vy'), h.get('vz'));
            mp.game.ui.notifications.show("~g~Ваш заказ был обработан");
        }
        if (item.doName == 'giveOffer3') {
            let money = methods.parseFloat(await UIMenu.Menu.GetUserInput("Сумма", "", 9));
            if (money < 300) {
                mp.game.ui.notifications.show("~r~Сумма не может быть меньше 300$");
                return;
            }
            if (money > 5000) {
                mp.game.ui.notifications.show("~r~Сумма не может быть больше 5000$");
                return;
            }
            if (user.getBankMoney() < money + 1800) {
                mp.game.ui.notifications.show("~r~У вас нет столько денег на банковском счету");
                return;
            }
            user.removeBankMoney(money + 1800, 'Формирование заказа');
            mp.events.callRemote('server:trucker:addOffer', 3, money, name, h.get('vx'), h.get('vy'), h.get('vz'));
            mp.game.ui.notifications.show("~g~Ваш заказ был обработан");
        }
    });
};

menuList.showStockPanelUpgradeMenu = function(h) {

    UIMenu.Menu.Create(` `, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`, 'hm', false, false, 'h1');

    if (h.get('interior') > 1 && !h.get('upgrade_g'))
        UIMenu.Menu.AddMenuItem(`~y~Расширенный гараж и жилой офис`, "Стоимость: ~g~$2.500.000~s~~br~Благодаря этому лучшению, вы можете сделать ваш склад спавном для вашей организации~br~Бонусом выступает, что в гараже можно хранить грузовики и больой транспорт", {buyGarage: true});


    if (user.getCache('fraction_id2') > 0) {
        if (h.get('interior') > 1 && !h.get('upgrade_b'))
            UIMenu.Menu.AddMenuItem(`~y~Бункер`, "Стоимость: ~g~$30.000.000~s~~br~Благодаря этому лучшению, вы можете заниматся изготовкой оружия~br~Бонусом выступает, что в гараже можно хранить грузовики и больой транспорт", {buyBunker: true});

        if (h.get('interior') > 0 && !h.get('upgrade_l'))
            UIMenu.Menu.AddMenuItem(`~y~Лаборатория`, "Стоимость: ~g~$5.000.000~s~~br~Благодаря этому лучшению, вы можете заниматся изготовкой наркотиков", {buyLab: true});
    }
    else {
        if (h.get('interior') > 1 && !h.get('upgrade_b'))
            UIMenu.Menu.AddMenuItem(`~y~Бункер`, "~r~Доступно в улучшении и использовании только для крайм организаций", {none: 'none'});

        if (h.get('interior') > 0 && !h.get('upgrade_l'))
            UIMenu.Menu.AddMenuItem(`~y~Лаборатория`, "~r~Доступно в улучшении и использовании только для крайм организаций", {none: 'none'});
    }

    if (h.get('interior') > 1 && !h.get('upgrade_n'))
        UIMenu.Menu.AddMenuItem(`~y~Снятие номеров`, "Стоимость: ~g~$1.000.000~s~~br~Благодаря этому лучшению, вы можете снимать номера с автомобилей", {buyNumber: true});

    h.get('upgrade').split('_').forEach((uItem, idx) => {
        uItem = methods.parseInt(uItem);
        if (uItem === -1) {
            UIMenu.Menu.AddMenuItem(`${(idx + 1)}. ~g~Слот свободен`, "", {buySlot: idx});
        }
        else {
            let rare = 'Стандарт';
            if (stocks.boxList[uItem][7] === 1)
                rare = '~b~Редкий';
            if (stocks.boxList[uItem][7] === 2)
                rare = '~p~Очень редкий';

            UIMenu.Menu.AddMenuItem(`${(idx + 1)}. ${stocks.boxList[uItem][0]}`, `Редкость: ${rare}~br~~s~Класс: ~b~${stocks.boxList[uItem][6]}`, {sellSlot: idx});
        }
    });

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.buySlot >= 0)
            menuList.showStockPanelUpgradeBuySlotMenu(h, item.buySlot);
        if (item.buyGarage)
            menuList.showStockPanelUpgradeBuyGarageMenu(h);
        if (item.buyNumber)
            menuList.showStockPanelUpgradeBuyNumberMenu(h);
        if (item.buyLab)
            menuList.showStockPanelUpgradeBuyLabMenu(h);
        if (item.buyBunker)
            menuList.showStockPanelUpgradeBuyBunkerMenu(h);
    });
};

menuList.showStockPanelUpgradeBuySlotMenu = function(h, slot) {

    try {
        UIMenu.Menu.Create(` `, `~b~Выберите ящик для покупки`, 'hm', false, false, 'h1');

        stocks.boxList.forEach((item, idx) => {
            if (!item[4])
                return;
            UIMenu.Menu.AddMenuItem(`${item[0]}`, `Цена: ~g~${methods.moneyFormat(item[5])}~br~~s~Объем: ~g~${methods.numberFormat(item[2])}см³`, {buyBox: idx});
        });

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async item => {
            UIMenu.Menu.HideMenu();
            if (item.buyBox >= 0)
                stocks.upgradeAdd(h.get('id'), slot, item.buyBox);
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showStockPanelUpgradeBuyGarageMenu = function(h) {

    try {
        UIMenu.Menu.Create(` `, `~b~Улучшение офиса`, 'hm', false, false, 'h1');

        UIMenu.Menu.AddMenuItem("Купить за ~g~$2.500.000", "", {doName: 'yes'});

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async item => {
            UIMenu.Menu.HideMenu();
            if (item.doName === 'yes') {
                if (user.getBankMoney() < 2500000) {
                    mp.game.ui.notifications.show('~r~На вашем банковском счету не хватает средств');
                    return;
                }
                user.removeBankMoney(2500000, 'Улучшение для склада #' + h.get('id'));
                stocks.upgradeGarage(h.get('id'));
                mp.game.ui.notifications.show('~g~Поздравляем с покупкой улучшения, теперь при входе на склад, вам будет предложение войти во второе помещение');
            }
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showStockPanelUpgradeBuyNumberMenu = function(h) {

    try {
        UIMenu.Menu.Create(` `, `~b~Улучшение снятия номеров`, 'hm', false, false, 'h1');

        UIMenu.Menu.AddMenuItem("Купить за ~g~$1.000.000", "", {doName: 'yes'});

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async item => {
            UIMenu.Menu.HideMenu();
            if (item.doName === 'yes') {
                if (!h.get('upgrade_g')) {
                    mp.game.ui.notifications.show('~r~У вас нет офиса для того, чтобы вы могли поставить это улучшение');
                    return;
                }
                if (user.getBankMoney() < 1000000) {
                    mp.game.ui.notifications.show('~r~На вашем банковском счету не хватает средств');
                    return;
                }
                user.removeBankMoney(1000000, 'Улучшение для склада #' + h.get('id'));
                stocks.upgradeNumber(h.get('id'));
                mp.game.ui.notifications.show('~g~Поздравляем с покупкой улучшения, теперь заезжая в офис, нажимая на меню взаимодействия с ТС, можно снимать номера');
            }
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showStockPanelUpgradeBuyBunkerMenu = function(h) {

    try {
        UIMenu.Menu.Create(` `, `~b~Улучшение бункера`, 'hm', false, false, 'h1');

        UIMenu.Menu.AddMenuItem("Купить за ~g~$30.000.000", "", {doName: 'yes'});

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async item => {
            UIMenu.Menu.HideMenu();
            if (item.doName === 'yes') {
                if (!h.get('upgrade_g')) {
                    mp.game.ui.notifications.show('~r~У вас нет офиса для того, чтобы вы могли поставить это улучшение');
                    return;
                }
                if (user.getBankMoney() < 30000000) {
                    mp.game.ui.notifications.show('~r~На вашем банковском счету не хватает средств');
                    return;
                }
                user.removeBankMoney(30000000, 'Улучшение для склада #' + h.get('id'));
                stocks.upgradeBunker(h.get('id'));
                mp.game.ui.notifications.show('~g~Поздравляем с покупкой улучшения, теперь вы можете крафить оружие');
            }
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showStockPanelUpgradeBuyLabMenu = function(h) {

    try {
        UIMenu.Menu.Create(` `, `~b~Улучшение нарко лаборатории`, 'hm', false, false, 'h1');

        UIMenu.Menu.AddMenuItem("Купить за ~g~$5.000.000", "", {doName: 'yes'});

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async item => {
            UIMenu.Menu.HideMenu();
            if (item.doName === 'yes') {
                if (user.getBankMoney() < 5000000) {
                    mp.game.ui.notifications.show('~r~На вашем банковском счету не хватает средств');
                    return;
                }
                user.removeBankMoney(5000000, 'Улучшение для склада #' + h.get('id'));
                stocks.upgradeLab(h.get('id'));
                mp.game.ui.notifications.show('~g~Поздравляем с покупкой улучшения, теперь вы можете крафтить наркотики');
            }
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showStockPanelBoxListMenu = function(h) {

    UIMenu.Menu.Create(` `, `~b~Категории ящиков`, 'hm', false, false, 'h1');

    let incList = [];

    stocks.boxList.forEach((item, idx) => {
        if (incList.includes(item[6]))
            return;
        incList.push(item[6]);
        UIMenu.Menu.AddMenuItem(`${item[6]}`, "", {className: item[6]});
    });

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.className)
            menuList.showStockPanelBoxInfoMenu(h, item.className);
    });
};

menuList.showStockPanelBoxInfoMenu = function(h, className) {

    UIMenu.Menu.Create(` `, `~b~${className}`, 'hm', false, false, 'h1');

    let price = 0;
    let classIdx = 0;

    h.get('upgrade').split('_').forEach((uItem, idx) => {

        uItem = methods.parseInt(uItem);
        if (uItem == -1)
            return;

        let item = stocks.boxList[uItem];

        if (item[6] != className)
            return;

        if (className == 'Стандарт') {
            let priceBox = item[5] / 4;
            UIMenu.Menu.AddMenuItem(`${item[0]}`, 'Нажмите ~g~Enter~s~ чтобы посмотреть', {slot: idx, price: priceBox, item: item, boxId: uItem}, `~g~${methods.moneyFormat(priceBox)}`);

            classIdx++;
            price += priceBox;
        }
        else {
            let priceBox = item[5] / 1000;
            UIMenu.Menu.AddMenuItem(`${item[0]}`, 'Нажмите ~g~Enter~s~ чтобы посмотреть', {slot: idx, price: priceBox, item: item, boxId: uItem}, `~g~${methods.numberFormat(priceBox)}ec`);
            classIdx++;

            if (classIdx >= 9)
                price += priceBox * 2;
            else if (classIdx >= 6)
                price += priceBox * 1.5;
            else if (classIdx >= 3)
                price += priceBox * 1.1;
            else
                price += priceBox;
        }
    });

    if (price > 0) {
        if (className != 'Стандарт')
            UIMenu.Menu.AddMenuItem(`~y~Продать всё за ~s~${methods.numberFormat(price)}ec`, "", {sellAll: price + 0.00001});
    }
    else {
        UIMenu.Menu.AddMenuItem("Список пуст");
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.sellAll)
            mp.events.callRemote('server:stock:sellAllByClass', className, item.sellAll);
        if (item.price)
            menuList.showStockPanelBoxInfoMoreMenu(h, item.item, item.slot, item.price, item.boxId);
    });
};

menuList.showStockPanelBoxInfoMoreMenu = function(h, item, slot, price, boxId) {

    UIMenu.Menu.Create(` `, `~b~${item[0]}`, 'hm', false, false, 'h1');

    if (boxId === 3 || boxId === 4 || boxId === 38 || boxId === 39 || boxId === 50 || boxId === 51 || boxId === 52 || boxId === 53)
        UIMenu.Menu.AddMenuItem(`~g~Открыть ящик`, "", {isOpen: true});

    if (item[7] < 0)
        UIMenu.Menu.AddMenuItem(`~y~Продать за ~s~${methods.moneyFormat(price)}`, "", {isSell: true});
    else
        UIMenu.Menu.AddMenuItem(`~y~Продать за ~s~${methods.numberFormat(price)}ec`, "", {isSell: true});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.isSell)
            mp.events.callRemote('server:stock:sellBySlot', slot);
        if (item.isOpen)
            mp.events.callRemote('server:stock:openBySlot', slot, boxId);
    });
};

menuList.showStockOutMenu = async function(h) {

    UIMenu.Menu.Create(` `, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`, 'hm', false, false, 'h1');
    UIMenu.Menu.AddMenuItem(`~b~Владелец:~s~ ${h.get('user_name')}`);
    UIMenu.Menu.AddMenuItem("~g~Войти на склад", "", {doName: 'enterStock'});
    if (h.get('upgrade_g'))
        UIMenu.Menu.AddMenuItem("~g~Войти в офис", "", {doName: 'enterStock1'});
    if (h.get('upgrade_l'))
        UIMenu.Menu.AddMenuItem("~g~Войти в лабораторию", "", {doName: 'enterStockL'});
    if (h.get('upgrade_b'))
        UIMenu.Menu.AddMenuItem("~g~Войти в бункер", "", {doName: 'enterStockB'});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'enterStock') {
            try {
                if (user.getCache('fraction_id2') === (h.get('user_id') * -1) && user.isLeader2())
                    stocks.enter(h.get('id'));
                else if (user.getCache('id') != h.get('user_id')) {

                    if (Container.Data.HasLocally(mp.players.local.remoteId, "isPassTimeout"))
                    {
                        mp.game.ui.notifications.show("~r~Таймаут 10 сек");
                        return;
                    }

                    let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 10));

                    if (pass === 0) {
                        mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');
                        return;
                    }

                    Container.Data.SetLocally(mp.players.local.remoteId, "isPassTimeout", true);

                    if (pass === h.get('pin')) {
                        stocks.enter(h.get('id'));
                        Container.Data.ResetLocally(mp.players.local.remoteId, "isPassTimeout");
                    }
                    else {

                        mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');
                        setTimeout(function () {
                            Container.Data.ResetLocally(mp.players.local.remoteId, "isPassTimeout");
                        }, 10000);
                    }

                    /*mp.game.ui.notifications.show('~r~Введите пинкод');
                    let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите пинкод", "", 5));
                    if (pass == h.get('pin'))
                        stocks.enter(h.get('id'));
                    else
                        mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');*/
                }
                else
                    stocks.enter(h.get('id'));
            }
            catch (e) {
                methods.debug(e);
            }
        }
        if (item.doName === 'enterStock1') {
            try {
                if (user.getCache('id') != h.get('user_id')) {

                    if (Container.Data.HasLocally(mp.players.local.remoteId, "isPassTimeout"))
                    {
                        mp.game.ui.notifications.show("~r~Таймаут 10 сек");
                        return;
                    }

                    let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 10));

                    if (pass === 0) {
                        mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');
                        return;
                    }

                    Container.Data.SetLocally(mp.players.local.remoteId, "isPassTimeout", true);

                    if (pass === h.get('pin_o')) {
                        stocks.enter1(h.get('id'));
                        Container.Data.ResetLocally(mp.players.local.remoteId, "isPassTimeout");
                    }
                    else {

                        mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');
                        setTimeout(function () {
                            Container.Data.ResetLocally(mp.players.local.remoteId, "isPassTimeout");
                        }, 10000);
                    }

                    /*mp.game.ui.notifications.show('~r~Введите пинкод');
                    let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите пинкод", "", 5));
                    if (pass == h.get('pin'))
                        stocks.enter(h.get('id'));
                    else
                        mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');*/
                }
                else
                    stocks.enter1(h.get('id'));
            }
            catch (e) {
                methods.debug(e);
            }
        }
        if (item.doName === 'enterStockL') {
            try {
                if (user.getCache('id') != h.get('user_id')) {

                    if (Container.Data.HasLocally(mp.players.local.remoteId, "isPassTimeout"))
                    {
                        mp.game.ui.notifications.show("~r~Таймаут 10 сек");
                        return;
                    }

                    let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 10));

                    if (pass === 0) {
                        mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');
                        return;
                    }

                    Container.Data.SetLocally(mp.players.local.remoteId, "isPassTimeout", true);

                    if (pass === h.get('pin_l')) {
                        stocks.enterl(h.get('id'), h.get('lab_state'));
                        Container.Data.ResetLocally(mp.players.local.remoteId, "isPassTimeout");
                    }
                    else {

                        mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');
                        setTimeout(function () {
                            Container.Data.ResetLocally(mp.players.local.remoteId, "isPassTimeout");
                        }, 10000);
                    }

                    /*mp.game.ui.notifications.show('~r~Введите пинкод');
                    let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите пинкод", "", 5));
                    if (pass == h.get('pin'))
                        stocks.enter(h.get('id'));
                    else
                        mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');*/
                }
                else
                    stocks.enterl(h.get('id'), h.get('lab_state'));
            }
            catch (e) {
                methods.debug(e);
            }
        }
        if (item.doName === 'enterStockB') {
            try {
                if (user.getCache('id') != h.get('user_id')) {

                    if (Container.Data.HasLocally(mp.players.local.remoteId, "isPassTimeout"))
                    {
                        mp.game.ui.notifications.show("~r~Таймаут 10 сек");
                        return;
                    }

                    let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 10));

                    if (pass === 0) {
                        mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');
                        return;
                    }

                    Container.Data.SetLocally(mp.players.local.remoteId, "isPassTimeout", true);

                    if (pass === h.get('pin_b')) {
                        stocks.enterb(h.get('id'));
                        Container.Data.ResetLocally(mp.players.local.remoteId, "isPassTimeout");
                    }
                    else {

                        mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');
                        setTimeout(function () {
                            Container.Data.ResetLocally(mp.players.local.remoteId, "isPassTimeout");
                        }, 10000);
                    }

                    /*mp.game.ui.notifications.show('~r~Введите пинкод');
                    let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите пинкод", "", 5));
                    if (pass == h.get('pin'))
                        stocks.enter(h.get('id'));
                    else
                        mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');*/
                }
                else
                    stocks.enterb(h.get('id'));
            }
            catch (e) {
                methods.debug(e);
            }
        }
    });
};

menuList.showStockInVMenu = function(h) {

    UIMenu.Menu.Create(` `, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`, 'hm', false, false, 'h1');
    UIMenu.Menu.AddMenuItem("~g~Выйти", "", {doName: 'exit'});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'exit') {
            stocks.exitv(h.get('vx'), h.get('vy'), h.get('vz'), h.get('vrot'));
        }
    });
};

menuList.showStockOutVMenu = async function(h) {

    UIMenu.Menu.Create(` `, `~b~Адрес: ~s~${h.get('address')} ${h.get('number')}`, 'hm', false, false, 'h1');
    UIMenu.Menu.AddMenuItem(`~b~Владелец:~s~ ${h.get('user_name')}`);
    UIMenu.Menu.AddMenuItem("~g~Войти на склад", "", {doName: 'enter'});
    if (h.get('upgrade_g'))
        UIMenu.Menu.AddMenuItem("~g~Войти в офис", "", {doName: 'enter1'});
    if (h.get('upgrade_l'))
        UIMenu.Menu.AddMenuItem("~g~Войти в лабораторию", "Доступно только пешком", {doName: 'enterl'});
    if (h.get('upgrade_b'))
        UIMenu.Menu.AddMenuItem("~g~Войти в бункер", "", {doName: 'enterb'});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'enter') {
            try {
                if (user.getCache('fraction_id2') === (h.get('user_id') * -1) && user.isLeader2())
                    stocks.enter(h.get('id'));
                else if (user.getCache('id') != h.get('user_id')) {

                    if (Container.Data.HasLocally(mp.players.local.remoteId, "isPassTimeout"))
                    {
                        mp.game.ui.notifications.show("~r~Таймаут 10 сек");
                        return;
                    }

                    let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 10));
                    if (pass === 0) {
                        mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');
                        return;
                    }

                    Container.Data.SetLocally(mp.players.local.remoteId, "isPassTimeout", true);

                    if (pass === h.get('pin')) {
                        stocks.enterv(h.get('id'));
                        Container.Data.ResetLocally(mp.players.local.remoteId, "isPassTimeout");
                    }
                    else {

                        mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');
                        setTimeout(function () {
                            Container.Data.ResetLocally(mp.players.local.remoteId, "isPassTimeout");
                        }, 10000);
                    }
                }
                else
                    stocks.enterv(h.get('id'));
            }
            catch (e) {
                methods.debug(e);
            }
        }
        if (item.doName === 'enter1') {
            try {
                if (user.getCache('id') != h.get('user_id')) {

                    if (Container.Data.HasLocally(mp.players.local.remoteId, "isPassTimeout"))
                    {
                        mp.game.ui.notifications.show("~r~Таймаут 10 сек");
                        return;
                    }

                    let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 10));
                    if (pass === 0) {
                        mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');
                        return;
                    }

                    Container.Data.SetLocally(mp.players.local.remoteId, "isPassTimeout", true);

                    if (pass === h.get('pin_o')) {
                        stocks.enterv1(h.get('id'));
                        Container.Data.ResetLocally(mp.players.local.remoteId, "isPassTimeout");
                    }
                    else {

                        mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');
                        setTimeout(function () {
                            Container.Data.ResetLocally(mp.players.local.remoteId, "isPassTimeout");
                        }, 10000);
                    }
                }
                else
                    stocks.enterv1(h.get('id'));
            }
            catch (e) {
                methods.debug(e);
            }
        }
        if (item.doName === 'enterl') {
            try {
                if (user.getCache('id') != h.get('user_id')) {

                    if (Container.Data.HasLocally(mp.players.local.remoteId, "isPassTimeout"))
                    {
                        mp.game.ui.notifications.show("~r~Таймаут 10 сек");
                        return;
                    }

                    let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 10));
                    if (pass === 0) {
                        mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');
                        return;
                    }

                    Container.Data.SetLocally(mp.players.local.remoteId, "isPassTimeout", true);

                    if (pass === h.get('pin_l')) {
                        stocks.enterl(h.get('id'), h.get('lab_state'));
                        Container.Data.ResetLocally(mp.players.local.remoteId, "isPassTimeout");
                    }
                    else {

                        mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');
                        setTimeout(function () {
                            Container.Data.ResetLocally(mp.players.local.remoteId, "isPassTimeout");
                        }, 10000);
                    }
                }
                else
                    stocks.enterl(h.get('id'), h.get('lab_state'));
            }
            catch (e) {
                methods.debug(e);
            }
        }
        if (item.doName === 'enterb') {
            try {
                if (user.getCache('id') != h.get('user_id')) {

                    if (Container.Data.HasLocally(mp.players.local.remoteId, "isPassTimeout"))
                    {
                        mp.game.ui.notifications.show("~r~Таймаут 10 сек");
                        return;
                    }

                    let pass = methods.parseInt(await UIMenu.Menu.GetUserInput("Пароль", "", 10));
                    if (pass === 0) {
                        mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');
                        return;
                    }

                    Container.Data.SetLocally(mp.players.local.remoteId, "isPassTimeout", true);

                    if (pass === h.get('pin_b')) {
                        stocks.entervb(h.get('id'));
                        Container.Data.ResetLocally(mp.players.local.remoteId, "isPassTimeout");
                    }
                    else {

                        mp.game.ui.notifications.show('~r~Вы ввели не правильный пинкод');
                        setTimeout(function () {
                            Container.Data.ResetLocally(mp.players.local.remoteId, "isPassTimeout");
                        }, 10000);
                    }
                }
                else
                    stocks.entervb(h.get('id'));
            }
            catch (e) {
                methods.debug(e);
            }
        }
    });
};

menuList.showBusinessTeleportMenu = function() {

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    UIMenu.Menu.Create(` `, `~b~Бизнес центр`, 'showBusinessTeleportMenu', false, false, 'arcadius');

    business.typeList.forEach(function (item, i, arr) {
        if (i === 7 || i === 8) return;
        UIMenu.Menu.AddMenuItem(`${item}`, "", {typeId: i});
    });

    UIMenu.Menu.AddMenuItem("~g~Улица", "", {teleportPos: business.BusinessStreetPos});
    UIMenu.Menu.AddMenuItem("~g~Крыша", "", {teleportPos: business.BusinessRoofPos});
    UIMenu.Menu.AddMenuItem("~g~Гараж", "", {teleportPos: business.BusinessGaragePos});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();

        if (item.typeId >= 0) {
            mp.events.callRemote('server:events:showTypeListMenu', methods.parseInt(item.typeId));
        }
        else if (item.teleportPos) {
            user.setVirtualWorld(0);
            user.teleportv(item.teleportPos);
        }
    });
};

menuList.showMazeOfficeTeleportMenu = function() {

    /*if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }*/

    UIMenu.Menu.Create(`Maze`, `~b~Maze Bank Лифт`);

    UIMenu.Menu.AddMenuItem("Гараж", "", {teleportPos: new mp.Vector3(-84.9765, -818.7122, 35.02804)});
    UIMenu.Menu.AddMenuItem("Офис", "", {teleportPos: new mp.Vector3(-77.77799, -829.6542, 242.3859)});
    UIMenu.Menu.AddMenuItem("Улица", "", {teleportPos: new mp.Vector3(-66.66476, -802.0474, 43.22729)});
    UIMenu.Menu.AddMenuItem("Крыша", "", {teleportPos: new mp.Vector3(-67.13605, -821.9, 320.2874)});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.teleportPos)
            user.teleportv(item.teleportPos);
    });
};

menuList.showGovLift1OfficeTeleportMenu = function() {

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    UIMenu.Menu.Create(` `, `~b~Лифт`, 'gov', false, false, 'gov');

    UIMenu.Menu.AddMenuItem("Парковка", "", {teleportPos: new mp.Vector3(-1307.21, -557.8224, 19.80232)});
    UIMenu.Menu.AddMenuItem("Первый этаж", "", {teleportPos: new mp.Vector3(-1307.158, -562.1249, 29.57268)});
    UIMenu.Menu.AddMenuItem("Второй этаж", "", {teleportPos: new mp.Vector3(-1307.158, -562.1249, 33.37)});
    UIMenu.Menu.AddMenuItem("Третий этаж", "", {teleportPos: new mp.Vector3(-1307.158, -562.1249, 36.37)});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.teleportPos)
            user.teleportv(item.teleportPos);
    });
};

menuList.showGovLift2OfficeTeleportMenu = function() {

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    UIMenu.Menu.Create(` `, `~b~Лифт`, 'gov', false, false, 'gov');

    UIMenu.Menu.AddMenuItem("Парковка", "", {teleportPos: new mp.Vector3(-1309.314, -559.36, 19.80251)});
    UIMenu.Menu.AddMenuItem("Первый этаж", "", {teleportPos: new mp.Vector3(-1309.117, -563.9031, 29.57294)});
    UIMenu.Menu.AddMenuItem("Второй этаж", "", {teleportPos: new mp.Vector3(-1309.117, -563.9031, 33.37)});
    UIMenu.Menu.AddMenuItem("Третий этаж", "", {teleportPos: new mp.Vector3(-1309.117, -563.9031, 36.37)});

    if (user.isLeader())
        UIMenu.Menu.AddMenuItem("Комната губернатора", "", {teleportPos: new mp.Vector3(-1309.117, -563.9031, 40.19)});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.teleportPos)
            user.teleportv(item.teleportPos);
    });
};

menuList.showBuilder3TeleportMenu = function() {

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    UIMenu.Menu.Create(`Лифт`, `~b~Лифт`);

    UIMenu.Menu.AddMenuItem("1 уровень", "", {teleportPos: new mp.Vector3(-158.3161, -940.3564, 29.07765)});
    UIMenu.Menu.AddMenuItem("2 уровень", "", {teleportPos: new mp.Vector3(-154.6761, -941.7026, 113.1366)});
    UIMenu.Menu.AddMenuItem("3 уровень", "", {teleportPos: new mp.Vector3(-154.7566, -941.5623, 268.1352)});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.teleportPos)
            user.teleportv(item.teleportPos);
    });
};

menuList.showBuilder4TeleportMenu = function() {

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    UIMenu.Menu.Create(`Лифт`, `~b~Лифт`);

    UIMenu.Menu.AddMenuItem("1 уровень", "", {doName: new mp.Vector3(-159.6244, -944.085, 29.07765)});
    UIMenu.Menu.AddMenuItem("2 уровень", "", {doName: new mp.Vector3(-155.9965, -945.4241, 113.1366)});
    UIMenu.Menu.AddMenuItem("3 уровень", "", {doName: new mp.Vector3(-156.1506, -945.3331, 268.1352)});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.teleportPos)
            user.teleportv(item.teleportPos);
    });
};

menuList.showCasinoLiftTeleportMenu = function() {

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    UIMenu.Menu.Create(`Casino`, `~b~Лифт`);

    UIMenu.Menu.AddMenuItem("Улица", "", {teleportPos: new mp.Vector3(935.5374755859375, 46.44008255004883, 80.09577178955078)});
    UIMenu.Menu.AddMenuItem("Казино", "", {teleportPos: new mp.Vector3(1089.85009765625, 206.42514038085938, -49.99974822998047)});
    UIMenu.Menu.AddMenuItem("Квартиры", "", {teleportPos: new mp.Vector3(2518.663330078125, -259.46478271484375, -40.122894287109375)});
    UIMenu.Menu.AddMenuItem("Балкон", "", {teleportPos: new mp.Vector3(964.3539428710938, 58.81953048706055, 111.5530014038086)});
    UIMenu.Menu.AddMenuItem("Крыша", "", {teleportPos: new mp.Vector3(972.0299072265625, 52.14411163330078, 119.24087524414062)});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.teleportPos)
            user.teleportv(item.teleportPos);
    });
};

menuList.showFibOfficeTeleportMenu = function() {

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    UIMenu.Menu.Create(`Fib`, `~b~Лифт`);

    UIMenu.Menu.AddMenuItem("Гараж", "", {teleportPos: new mp.Vector3(122.9873, -741.1865, 32.13323)});
    UIMenu.Menu.AddMenuItem("1 этаж", "", {teleportPos: new mp.Vector3(136.2213, -761.6816, 44.75201)});
    UIMenu.Menu.AddMenuItem("49 этаж", "", {teleportPos: new mp.Vector3(136.2213, -761.6816, 241.152)});
    UIMenu.Menu.AddMenuItem("52 этаж", "", {teleportPos: new mp.Vector3(114.9807, -741.8279, 257.1521)});
    UIMenu.Menu.AddMenuItem("Крыша", "", {teleportPos: new mp.Vector3(141.4099, -735.3376, 261.8516)});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.teleportPos)
            user.teleportv(item.teleportPos);
    });
};

menuList.showGarage1TeleportMenu = function() {

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    UIMenu.Menu.Create(`Гараж`, `~b~Лифт`);

    UIMenu.Menu.AddMenuItem("Уровень A", "", {teleportPos: new mp.Vector3(-852.534912109375, 284.400146484375, 32.934879302978516)});
    UIMenu.Menu.AddMenuItem("Уровень B", "", {teleportPos: new mp.Vector3(-852.5341186523438, 284.3998718261719, 27.59111976623535)});
    UIMenu.Menu.AddMenuItem("Уровень C", "", {teleportPos: new mp.Vector3(-852.533935546875, 284.3995056152344, 22.23737335205078)});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.teleportPos)
            user.teleportVehV(item.teleportPos);
    });
};

menuList.showGarage2TeleportMenu = function() {

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    UIMenu.Menu.Create(`Гараж`, `~b~Лифт`);

    UIMenu.Menu.AddMenuItem("Уровень A", "", {teleportPos: new mp.Vector3(-812.2706909179688, 313.9342346191406, 32.92332458496094)});
    UIMenu.Menu.AddMenuItem("Уровень B", "", {teleportPos: new mp.Vector3(-812.27001953125, 313.9339294433594, 27.591726303100586)});
    UIMenu.Menu.AddMenuItem("Уровень C", "", {teleportPos: new mp.Vector3(-812.2694091796875, 313.9336242675781, 22.237457275390625)});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.teleportPos)
            user.teleportVehV(item.teleportPos);
    });
};

menuList.showGovOfficeTeleportMenu = function() {

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    UIMenu.Menu.Create(` `, `~b~Лифт`, 'gov', false, false, 'gov');

    UIMenu.Menu.AddMenuItem("Гараж", "", {teleportPos: new mp.Vector3(-1360.679, -471.8841, 30.59572)});
    UIMenu.Menu.AddMenuItem("Офис", "", {teleportPos: new mp.Vector3(-1395.997, -479.8439, 72.04215)});
    UIMenu.Menu.AddMenuItem("Улица", "", {teleportPos: new mp.Vector3(-1379.659, -499.748, 32.15739)});
    UIMenu.Menu.AddMenuItem("Крыша", "", {teleportPos: new mp.Vector3(-1369, -471.5994, 83.44699)});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.teleportPos)
            user.teleportv(item.teleportPos);
    });
};

menuList.showBusinessTypeListMenu = function(data1, data2, data3) {
    UIMenu.Menu.Create(` `, `~b~Бизнес центр`, '', false, false, 'arcadius');

    data1.forEach(function (item, i, arr) {
        let ownerName = item[1] == '' ? 'Государство' : item[1];

        let menuItem = {};
        menuItem.bId = item[0];
        menuItem.interiorId = data3[i][1][0];
        menuItem.scFont = data3[i][1][1];
        menuItem.scColor = data3[i][1][2];
        menuItem.scAlpha = data3[i][1][3];
        menuItem.bName = data2[i][1];

        UIMenu.Menu.AddMenuItem(`${data2[i][1]}`, `~b~Владелец: ~s~${ownerName}`, menuItem);
    });

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.bName)
        {
            business.setScaleformName(item.bName);
            business.setScaleformParams(item.scFont, item.scColor, item.scAlpha);
            business.loadInterior(item.interiorId, 500);
            user.setVirtualWorld(methods.parseInt(item.bId));
            user.teleport(business.BusinessOfficePos.x, business.BusinessOfficePos.y, business.BusinessOfficePos.z + 1);
        }
    });
};

menuList.showBusinessLogMenu = function(data) {
    try {

        UIMenu.Menu.Create(` `, `~b~Нажмите ~s~Enter~b~ чтобы прочитать`, '', false, false, 'arcadius');

        JSON.parse(data).forEach(function (item) {

            let dateTime = methods.unixTimeStampToDateTimeShort(item.timestamp);
            let mItem = {};

            mItem.desc = methods.replaceQuotes(item.product);
            mItem.id = item.id;
            mItem.datetime = dateTime;
            mItem.rp_datetime = item.rp_datetime;

            UIMenu.Menu.AddMenuItem(`~b~#${item.id}. ~s~${item.product.substring(0, 30)}...`, `~b~Дата:~s~ ${item.rp_datetime} / ~b~OOC: ~s~${dateTime}`, mItem, `${item.price}`);
        });

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add((item, index) => {
            if (item.desc)
                mp.game.ui.notifications.show(`~b~#${item.id}\n~c~ООС: ${item.datetime}\n~c~IC: ${item.rp_datetime}\n~s~${item.desc}`);
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showInvaderNewsMenu = function(data) {
    UIMenu.Menu.Create(`Invader`, `~b~Нажмите ~s~Enter~b~ чтобы выбрать`);

    JSON.parse(data).forEach(function (item) {

        let mItem = {};
        mItem.id = item.id;
        mItem.title = item.title;
        mItem.name = item.name;

        UIMenu.Menu.AddMenuItem(`~b~#${item.id}. ~s~${item.title}`, `~b~Автор:~s~ ${item.name}`, mItem);
    });

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.id && (user.isLeader() || user.isSubLeader() || user.isDepLeader()))
            menuList.showInvaderNewsDelMenu(item.id, item.title, item.name)
    });
};

menuList.showInvaderNewsDelMenu = function(id, title, name) {
    UIMenu.Menu.Create(`Invader`, `~b~Номер новости: ${id}`);

    UIMenu.Menu.AddMenuItem(`${title}`);
    UIMenu.Menu.AddMenuItem(`${name}`);
    UIMenu.Menu.AddMenuItem(`~r~Удалить новость`, "", {delete: true});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.delete)
            mp.events.callRemote('server:invader:delNews', id);
    });
};

menuList.showInvaderAdMenu = function(data) {
    UIMenu.Menu.Create(`Invader`, `~b~Нажмите ~s~Enter~b~ чтобы выбрать`);

    JSON.parse(data).forEach(function (item) {

        let mItem = {};
        mItem.id = item.id;
        mItem.title = item.title;
        mItem.name = item.name;
        mItem.phone = item.phone;

        UIMenu.Menu.AddMenuItem(`~b~#${item.id}. ~s~${item.title} [${item.phone}]`, `~b~Автор:~s~ ${item.name}`, mItem);
    });

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        if (item.id)
            menuList.showInvaderAdDelMenu(item.id, item.title, item.name, item.phone)
    });
};

menuList.showInvaderAdDelMenu = function(id, title, name, phone) {
    UIMenu.Menu.Create(`Invader`, `~b~Номер новости: ${id}`);

    UIMenu.Menu.AddMenuItem(`${title}`);
    UIMenu.Menu.AddMenuItem(`${name}`);
    UIMenu.Menu.AddMenuItem(`${phone}`);
    if (user.isLeader() || user.isSubLeader())
        UIMenu.Menu.AddMenuItem(`~r~Удалить объявление`, "", {delete: true});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.delete)
            mp.events.callRemote('server:invader:delAd', id);
    });
};

menuList.showInvaderAdTempMenu = function(data) {
    UIMenu.Menu.Create(`Invader`, `~b~Нажмите ~s~Enter~b~ чтобы выбрать`);

    JSON.parse(data).forEach(function (item) {

        let mItem = {};
        mItem.id = item.id;
        mItem.text = item.text;
        mItem.name = item.name;
        mItem.phone = item.phone;

        UIMenu.Menu.AddMenuItem(`~b~#${item.id}. ~s~${item.text.substring(0, 25)}`, `~b~Автор:~s~ ${item.name}`, mItem);
    });

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        if (item.id)
            menuList.showInvaderAdTempEditMenu(item.id, item.text, item.name, item.phone)
    });
};

menuList.showInvaderAdTempEditMenu = function(id, text, name, phone) {
    UIMenu.Menu.Create(`Invader`, `~b~Номер новости: ${id}`);

    let titleList = ['Разное', 'Покупка', 'Продажа', 'Услуга'];
    UIMenu.Menu.AddMenuItemList("Заголовок", titleList, "", {doName: 'title'});

    let title = 'Разное';

    let textTemp = text;

    UIMenu.Menu.AddMenuItem(`Редактировать текст`, "", {textEdit: true});
    UIMenu.Menu.AddMenuItem(`${name}`);
    UIMenu.Menu.AddMenuItem(`${phone}`);
    UIMenu.Menu.AddMenuItem(`~g~Опубликовать`, "", {save: true});
    if (user.isLeader() || user.isSubLeader())
        UIMenu.Menu.AddMenuItem(`~r~Удалить объявление`, "", {delete: true});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnList.Add((item, index) => {
        if (item.doName == 'title') {
            title = titleList[index];
        }
    });

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        if (item.textEdit)
        {
            textTemp = await UIMenu.Menu.GetUserInput("Введите текст", methods.replaceAll(methods.replaceAll(textTemp, '\'', '`'), '"', '`'), 200);
            mp.game.ui.notifications.show("~b~Вы отредактировали текст\n~s~" + textTemp);
        }
        if (item.save) {
            UIMenu.Menu.HideMenu();
            mp.events.callRemote('server:invader:sendAd', id, title, name, textTemp, phone);
        }
        if (item.delete) {
            UIMenu.Menu.HideMenu();
            mp.events.callRemote('server:invader:delAdT', id);
        }
    });
};

menuList.showBusinessMenu = async function(data) {

    let bankTarif = 0;
    if (data.get('bank_id') > 0)
        bankTarif = await business.getPrice(data.get('bank_id'));

    let nalog = await coffer.getTaxBusiness();

    UIMenu.Menu.Create(` `, `~b~Владелец: ~s~${(data.get('user_id') < 1 ? "Государство" : data.get('user_name'))}`, '', false, false, 'arcadius');

    let nalogOffset = bankTarif;
    /*if (data.get('type') === 1) //TODO
        nalogOffset += 25;*/

    nalog = nalog + nalogOffset;

    UIMenu.Menu.AddMenuItem("~b~Название: ~s~", "", {}, `${data.get('name')}`);
    UIMenu.Menu.AddMenuItem("~b~Налог на прибыль: ~s~", 'Гос. налог + налог банка', {}, `${nalog}%`);

    if (user.getCache('stats_darknet') >= 30)
        UIMenu.Menu.AddMenuItem("~y~Отмыть деньги", '', {doName: 'moneyClear'});
    if (user.isFib() || user.isSapd() || user.isSheriff())
        UIMenu.Menu.AddMenuItem("Список транзакций", "", {doName: 'log'});

    if (user.getCache('id') == data.get('user_id')) {

        UIMenu.Menu.AddMenuItem("~b~Банк: ", "", {}, `~g~${methods.moneyFormat(data.get('bank'))}`);
        if (data.get('bank_tax') > 0)
            UIMenu.Menu.AddMenuItem("~b~Продукты: ", "", {}, `~g~${methods.moneyFormat(data.get('bank_tax'))}`);
        else
            UIMenu.Menu.AddMenuItem("~b~Продукты: ", "", {}, `~r~${methods.moneyFormat(data.get('bank_tax'))}`);
        UIMenu.Menu.AddMenuItem("Настройка бизнеса", "", {doName: 'settings'});
        UIMenu.Menu.AddMenuItem("Список транзакций", "", {doName: 'log'});
        UIMenu.Menu.AddMenuItem("Положить средства", "", {doName: 'addMoney'});
        UIMenu.Menu.AddMenuItem("Снять средства", "", {doName: 'removeMoney'});
        UIMenu.Menu.AddMenuItem("Пополнить бюджет продуктов", 'Бюджет для продуктов бизнеса', {doName: 'addMoneyTax'});
        UIMenu.Menu.AddMenuItem("~y~Что такое продукты?", "", {doName: 'ask'});
    }
    else if (data.get('user_id') == 0) {
        if (data.get('price') < 1)
            UIMenu.Menu.AddMenuItem("~y~На реконструкции, скоро будет доступен");
        else
            UIMenu.Menu.AddMenuItem("~g~Купить", `Цена: ~g~${methods.moneyFormat(data.get('price'))}`, {doName: 'buy'});
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();

        if (item.doName == 'buy') {
            setTimeout(quest.business, 10000);
            mp.events.callRemote('server:business:buy', data.get('id'));
        }
        if (item.doName == 'ask') {
            ui.showDialog('У продуктов есть свой отдельный счет, если он равен меньше 1$, то бизнес перестает функционировать и нести прибыль. Достаточно пополнять счет продуктов, чтобы бизнес функционировал. Цена каждого продукта уникальна, она равна минимальной стоимости наценки на товар. Поэтому если вы ставите цену на товар в 100%, то ваш бизнес будет работать в ноль. Если у бизнеса нет возможности ставить наценку, то текущая цена на продукт делённая на два.')
        }
        if (item.doName == 'settings') {
            menuList.showBusinessSettingsMenu(data);
        }
        if (item.doName == 'moneyClear') {
            let text = await UIMenu.Menu.GetUserInput("Введите название транзакции", "", 30);
            if (text === '')
                return ;
            quest.gang(false, -1, 13);
            mp.events.callRemote('server:sellMoneyBusiness', data.get('id'), text);
            achievement.doneAllById(22);
        }
        if (item.doName == 'log') {
            mp.events.callRemote('server:business:log', data.get('id'));
        }
        if (item.doName == 'addMoneyTax') {
            try {
                if (data.get('bank_id') == 0) {
                    mp.game.ui.notifications.show(`~r~Ваш бизнес не привязан ни к какому банку`);
                    return;
                }

                let money = await UIMenu.Menu.GetUserInput("Сумма", "", 8);
                money = methods.parseFloat(money);
                if (money > data.get('bank')) {
                    mp.game.ui.notifications.show(`~r~На счету бизнеса нет столько денег`);
                    return;
                }
                if (money + data.get('bank_tax') > data.get('bank_max')) {
                    mp.game.ui.notifications.show(`~r~Максимальный счет продуктов не может превышать ${data.get('bank_max')}`);
                    return;
                }
                if (money < 1) {
                    mp.game.ui.notifications.show(`~r~Нельзя взять меньше 1$`);
                    return;
                }

                if (money >= 10000)
                    quest.business(false, -1, 2);

                business.removeMoney(data.get('id'), money, 'Внутренний перевод на счёт продуктов');
                setTimeout(function () {
                    business.addMoneyTax(data.get('id'), money);
                    business.save(data.get('id'));
                    mp.game.ui.notifications.show(`~b~Вы положили деньги на счет продуктов`);
                }, 500);
            }
            catch (e) {
                methods.debug(e);
            }
        }
        if (item.doName == 'addMoney') {
            try {

                if (user.getCache('bank_card') < 1) {
                    mp.game.ui.notifications.show(`~r~У Вас нет банковской карты`);
                    return;
                }
                let money = await UIMenu.Menu.GetUserInput("Сумма", "", 8);
                money = methods.parseFloat(money);
                if (money > user.getBankMoney()) {
                    mp.game.ui.notifications.show(`~r~У Вас нет столько денег на вашей карте`);
                    return;
                }
                if (money < 1) {
                    mp.game.ui.notifications.show(`~r~Нельзя положить меньше 1$`);
                    return;
                }
                business.addMoney(data.get('id'), money, 'Зачиление со счета ' + methods.bankFormat(user.getCache('bank_card')));
                user.removeBankMoney(money, 'Зачиление на счет бизнеса ' + data.get('name'));
                business.save(data.get('id'));
                mp.game.ui.notifications.show(`~b~Вы положили деньги на счет бизнеса`);
            }
            catch (e) {
                methods.debug(e);
            }
        }
        if (item.doName == 'removeMoney') {

            if (user.getCache('bank_card') < 1) {
                mp.game.ui.notifications.show(`~r~У Вас нет банковской карты`);
                return;
            }
            if (data.get('bank_id') == 0) {
                mp.game.ui.notifications.show(`~r~Ваш бизнес не привязан ни к какому банку`);
                return;
            }

            let money = await UIMenu.Menu.GetUserInput("Сумма", "", 8);
            money = methods.parseFloat(money);
            if (money > data.get('bank')) {
                mp.game.ui.notifications.show(`~r~На счету бизнеса нет столько денег`);
                return;
            }
            if (money < 1) {
                mp.game.ui.notifications.show(`~r~Нельзя взять меньше 1$`);
                return;
            }

            business.addMoney(data.get('bank_id'), money * (bankTarif / 100), 'Прибыль с ' + data.get('name'));
            business.removeMoney(data.get('id'), money, 'Вывод средств на карту ' + methods.bankFormat(user.getCache('bank_card')));
            business.save(data.get('id'));
            user.addBankMoney(money * (100 - nalog) / 100, 'Вывод со счета бизнеса ' + data.get('name'));
            coffer.addMoney(1, money * nalog / 100);
            mp.game.ui.notifications.show(`~b~Вы сняли ~s~${methods.moneyFormat(money * (100 - nalog) / 100)} ~b~со счёта с учётом налога`);
            mp.game.ui.notifications.show(`~b~${bankTarif}% от суммы отправлен банку который вас обслуживает`);
        }
    });
};

menuList.showBusinessSettingsMenu = async function(data) {

    let tarif1 = await business.getPrice(1);
    let tarif2 = await business.getPrice(2);
    let tarif3 = await business.getPrice(3);
    let tarif4 = await business.getPrice(4);

    let priceBankList = ["1%", "2%", "3%", "4%", "5%"];

    let bankList = ["~r~Нет банка", `Maze Bank (${tarif1}%)`, `Pacific Bank (${tarif2}%)`, `Fleeca Bank (${tarif3}%)`, `Blaine Bank (${tarif4}%)`];

    if (data.get('bank_score') > 0)
        bankList = [`Maze Bank (${tarif1}%)`, `Pacific Bank (${tarif2}%)`, `Fleeca Bank (${tarif3}%)`, `Blaine Bank (${tarif4}%)`];

    let fontList = ["ChaletLondon", "HouseScript", "Monospace", "CharletComprime", "Pricedown"];
    let colorList = ["Black", "Red", "Pink", "Purple", "Deep Purple", "Indigo", "Blue", "Light Blue", "Cyan", "Teal", "Green", "Light Green", "Amber", "Orange", "Deep Orange", "Brown", "Blue Grey", "Grey"];
    let interiorList = ["Executive Rich", "Executive Cool", "Executive Contrast", "Old Spice Classical", "Old Spice Vintage", "Old Spice Warms", "Power Broker Conservative", "Power Broker Polished", "Power Broker Ice"];

    let nalog = await coffer.getTaxBusiness();

    UIMenu.Menu.Create(` `, `~b~Панель вашего бизнеса`, '', false, false, 'arcadius');

    let nalogOffset = 0;
    /*if (data.get('type') === 1) //TODO
        nalogOffset += 25;*/
    /*if (data.get('type') == 11)
        nalogOffset += 20;*/

    nalog = nalog + nalogOffset;

    let bankNumberStr = (data.get('bank_score') == 0 ? '~r~Отсуствует' : methods.bankFormat(data.get('bank_score')));

    UIMenu.Menu.AddMenuItem("~b~Название ~s~", "", {}, data.get('name'));
    UIMenu.Menu.AddMenuItem("~b~Налог на прибыль ~s~", 'Гос. налог + банк', {}, `${nalog}%`);
    UIMenu.Menu.AddMenuItem("~b~Ваш счёт ~s~", "", {}, `${bankNumberStr}`);

    let idxBank = data.get('bank_id');
    if (data.get('bank_id') > 0)
        idxBank = data.get('bank_id') - 1;
    UIMenu.Menu.AddMenuItemList("~b~Ваш банк", bankList, 'Стоимость перехода: ~g~$4,990', {doName: 'setBank'}, idxBank);

    UIMenu.Menu.AddMenuItemList("~b~Шрифт на табличке", fontList, 'Стоимость: ~g~$9,990~br~~s~Нажмите ~g~Enter~s~ чтобы купить', {doName: 'setFont'}, data.get('sc_font'));
    UIMenu.Menu.AddMenuItemList("~b~Цвет на табличке", colorList, 'Стоимость: ~g~$1,990~br~~s~Нажмите ~g~Enter~s~ чтобы купить', {doName: 'setColor'}, data.get('sc_color'));
    UIMenu.Menu.AddMenuItemList("~b~Прозрачность", ['Нет', 'Да'], 'Стоимость: ~g~$990~br~~s~Нажмите ~g~Enter~s~ чтобы купить', {doName: 'setAlpha'}, data.get('sc_alpha'));
    UIMenu.Menu.AddMenuItemList("~b~Интерьер", interiorList, 'Стоимость: ~g~$100,000~br~~s~Нажмите ~g~Enter~s~ чтобы купить', {doName: 'setInterior'}, data.get('interior'));

    try {
        if (data.get('type') === 0) { //TODO
            UIMenu.Menu.AddMenuItemList("~b~Процент обслуживания", priceBankList, "", {doName: 'setPriceBank'}, data.get('price_product') - 1);
        }
        else {
            if (data.get('id') !== 70) {
                UIMenu.Menu.AddMenuItem("~b~Цена на весь товар","", {doName: 'setPrice'}, `${data.get('price_product') * 100}%`);
            }
        }
    }
    catch (e) {
        methods.debug(e);
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    let bankIndex = data.get('bank_id');
    if (data.get('bank_id') > 0)
        bankIndex--;
    let colorIndex = data.get('sc_color');
    let fontIndex = data.get('sc_font');
    let alphaIndex = data.get('sc_alpha');
    let intIndex = data.get('interior');

    UIMenu.Menu.OnList.Add((item, index) => {
        if (item.doName == 'setPriceBank') {
            let price = index + 1;
            business.setPrice(data.get('id'), price);
            mp.game.ui.notifications.show(`~b~Процент обслуживания равен: ~s~${priceBankList[index]}`);
            return;
        }
        else if (item.doName == 'setBank') {
            bankIndex = index;
        }
        else if (item.doName == 'setFont') {
            fontIndex = index;
            business.setScaleformParams(index, colorIndex, alphaIndex);
        }
        else if (item.doName == 'setColor') {
            colorIndex = index;
            business.setScaleformParams(fontIndex, index, alphaIndex);
        }
        else if (item.doName == 'setAlpha') {
            alphaIndex = index;
            business.setScaleformParams(fontIndex, colorIndex, index);
        }
        else if (item.doName == 'setInterior') {
            intIndex = index;
            business.loadInterior(index);
        }
    });

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();

        if (item.doName == 'setPrice') {
            let price = methods.parseInt(await UIMenu.Menu.GetUserInput("Цена на весь товар", "", 3));

            if (price < 100) {
                mp.game.ui.notifications.show(`~b~Процент не может быть меньше 100`);
                return;
            }
            if (price > 300) {
                mp.game.ui.notifications.show(`~b~Процент не может быть больше 300`);
                return;
            }

            business.setPrice(data.get('id'), price / 100);
            mp.game.ui.notifications.show(`~b~Наценка на весь товар: ~s~${price}%`);
            return;
        }
        if (item.doName == 'setBank') {

            let price = 4990;
            if (price > data.get('bank')) {
                mp.game.ui.notifications.show(`~r~На счету бизнеса нет столько денег`);
                return;
            }

            mp.game.ui.notifications.show(`~b~Ваш новый банк: ~s~${bankList[bankIndex]}`);

            business.set(data.get('id'), 'bank_score', methods.getRandomBankCard(2222));
            if (data.get('bank_id') == 0) {
                business.addMoney(bankIndex, price, 'Новый клиент: ' + data.get('name'));
                business.set(data.get('id'), 'bank_id', bankIndex);
            }
            else {
                business.addMoney(bankIndex, price, 'Новый клиент: ' + data.get('name'));
                business.set(data.get('id'), 'bank_id', ++bankIndex);
            }
            business.removeMoney(data.get('id'), price, 'Открытие счёта');
            business.save(data.get('id'));
        }
        else if (item.doName == 'setFont') {

            let price = 9990;
            if (price > data.get('bank')) {
                business.setScaleformParams(data.get('sc_font'), data.get('sc_color'), data.get('sc_alpha'));
                mp.game.ui.notifications.show(`~r~На счету бизнеса нет столько денег`);
                return;
            }

            business.set(data.get('id'), 'sc_font', fontIndex);
            coffer.addMoney(1, price);
            business.removeMoney(data.get('id'), price, 'Установка таблички');
            business.save(data.get('id'));

            business.setScaleformParams(fontIndex, colorIndex, alphaIndex);
            mp.game.ui.notifications.show(`~b~Ваш новый шрифт: ~s~${fontList[fontIndex]}`);
        }
        else if (item.doName == 'setColor') {

            let price = 1990;
            if (price > data.get('bank')) {
                business.setScaleformParams(data.get('sc_font'), data.get('sc_color'), data.get('sc_alpha'));
                mp.game.ui.notifications.show(`~r~На счету бизнеса нет столько денег`);
                return;
            }

            business.set(data.get('id'), 'sc_color', colorIndex);
            coffer.addMoney(1, price);
            business.removeMoney(data.get('id'), price, 'Установка цвета таблички');
            business.save(data.get('id'));

            business.setScaleformParams(fontIndex, colorIndex, alphaIndex);
            mp.game.ui.notifications.show(`~b~Ваш новый цвет: ~s~${colorList[colorIndex]}`);
        }
        else if (item.doName == 'setAlpha') {

            let price = 990;
            if (price > data.get('bank')) {
                business.setScaleformParams(data.get('sc_font'), data.get('sc_color'), data.get('sc_alpha'));
                mp.game.ui.notifications.show(`~r~На счету бизнеса нет столько денег`);
                return;
            }

            business.set(data.get('id'), 'sc_alpha', alphaIndex);
            coffer.addMoney(1, price);
            business.removeMoney(data.get('id'), price, 'Прозрачность таблички');
            business.save(data.get('id'));

            business.setScaleformParams(fontIndex, colorIndex, alphaIndex);
            mp.game.ui.notifications.show(`~b~Шрифт обновлён`);
        }
        else if (item.doName == 'setInterior') {

            let price = 100000;
            if (price > data.get('bank')) {
                business.loadInterior(data.get('interior'));
                mp.game.ui.notifications.show(`~r~На счету бизнеса нет столько денег`);
                return;
            }

            business.set(data.get('id'), 'interior', intIndex);
            coffer.addMoney(1, price);
            business.removeMoney(data.get('id'), price, 'Обновление интерьера');
            business.save(data.get('id'));

            business.loadInterior(intIndex);
            mp.game.ui.notifications.show(`~b~Ваш новый интерьер: ~s~${interiorList[intIndex]}`);
        }
    });
};

menuList.showMeriaMainMenu = function() {

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    UIMenu.Menu.Create(` `, `~b~Секретарь правительства`, 'gov', false, false, 'gov');

    if (user.getCache('work_lic') == '')
        UIMenu.Menu.AddMenuItem("Оформить WorkID", "", {doName: 'getWorkId'});

    if (user.getCache('reg_status') === 0) {
        if (user.getCache('online_time') < 169)
            UIMenu.Menu.AddMenuItem("Оформить регистрацию", 'Стоимость: ~g~Бесплатно', {doName: 'getRegisterFree'});
        else
            UIMenu.Menu.AddMenuItem("Оформить регистрацию", 'Стоимость: ~g~$1,000', {doName: 'getRegister'});
    }

    if (user.getCache('reg_status') === 1)
        UIMenu.Menu.AddMenuItem("Оформить гражданство", 'Стоимость: ~g~$10,000', {doName: 'getFullRegister'});

    UIMenu.Menu.AddMenuItem("Работа", "", {doName: 'showMeriaJobListMenu'});
    UIMenu.Menu.AddMenuItem("Лицензионный центр", "", {doName: 'showLicBuyMenu'});

    UIMenu.Menu.AddMenuItem("Имущество", "Операции с вашим имуществом", {doName: 'showMeriaSellHvbMenu'});
    UIMenu.Menu.AddMenuItem("Налоговый кабинет", "", {doName: 'showMeriaTaxMenu'});

    if (user.getCache('house_id') > 0)
        UIMenu.Menu.AddMenuItem("Подселение", "", {doName: 'showMeriaHousePeopleMenu'});

    UIMenu.Menu.AddMenuItem("Экономика штата", "", {doName: 'showMeriaInfoMenu'});
    UIMenu.Menu.AddMenuItem("Подать заявление на стажировку", "", {doName: 'govWork'});
    
    UIMenu.Menu.AddMenuItem("~y~Создать семью по цене $500,000", "", {doName: 'createFamily'});
    
    UIMenu.Menu.AddMenuItem("~y~Оплата штрафов", "", {doName: 'showMeriaTicketMenu'});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();

        if (item.doName == 'govWork')
        {
            let discord = await menuList.getUserInput('Введите ваш DISCORD', '', 30);
            let text = await menuList.getUserInput('Почему вы хотите тут работать?', '', 100);
            mp.game.ui.notifications.show(`~g~Заявление было отправлено, скоро с вами свяжутся в дискорде`);
            mp.events.callRemote('server:discord:sendWorkGov', discord, text);
        }
        if (item.doName == 'createFamily')
        {
            let text = await menuList.getUserInput('Введите название семьи', '', 30);
            if (text === '') 
                return;
            mp.events.callRemote('server:family:create', text);
        }
        if (item.doName == 'showMeriaSellHvbMenu')
            menuList.showMeriaSellHvbMenu(await coffer.getAllData());
        if (item.doName == 'showMeriaTaxMenu')
            menuList.showMeriaTaxMenu();
        if (item.doName == 'showMeriaInfoMenu')
            menuList.showMeriaInfoMenu(await coffer.getAllData());
        if (item.doName == 'showMeriaJobListMenu')
            menuList.showMeriaJobListMenu();
        if (item.doName == 'showMeriaHousePeopleMenu')
            menuList.showMazeBankHousePeopleMenu();
        if (item.doName == 'showMeriaTicketMenu')
            mp.events.callRemote('server:showMeriaTicketMenu');
        if (item.doName == 'showLicBuyMenu')
            menuList.showLicBuyMenu();
        if (item.doName == 'getRegister') {
            if (user.getBankMoney() < 1000) {
                mp.game.ui.notifications.show("~r~У Вас недостаточно средств на банковском счету");
                return;
            }
            if (user.getCache('reg_status') > 0) {
                mp.game.ui.notifications.show("~r~Вам не нужна регистрация");
                return;
            }
            user.removeCashMoney(1000, 'Получение регистрации');
            user.set('reg_status', 1);
            mp.game.ui.notifications.show("~g~Поздравялем, вы получили регистрацию!");
            user.addHistory(0, 'Получил регистрацию');
            user.save();
        }
        if (item.doName == 'getRegisterFree') {
            if (user.getCache('reg_status') > 0) {
                mp.game.ui.notifications.show("~r~Вам не нужна регистрация");
                return;
            }
            user.set('reg_status', 1);
            mp.game.ui.notifications.show("~g~Поздравялем, вы получили регистрацию!");
            user.addHistory(0, 'Получил регистрацию');
            user.save();
        }
        if (item.doName == 'getFullRegister') {
            if (user.getCache('reg_status') > 1) {
                mp.game.ui.notifications.show("~r~У Вас уже есть гражданство");
                return;
            }
            if (user.getBankMoney() < 10000) {
                mp.game.ui.notifications.show("~r~У Вас недостаточно средств на банковском счету");
                return;
            }
            if (user.getCache('work_lvl') < 4) {
                mp.game.ui.notifications.show("~r~Рабочий стаж должен быть 4 уровня");
                return;
            }
            if (user.getCache('reg_status') < 1) {
                mp.game.ui.notifications.show("~r~Вам необходима регистрация");
                return;
            }
            user.removeCashMoney(10000, 'Получение гражданства');
            user.set('reg_status', 2);
            mp.game.ui.notifications.show("~g~Поздравялем, вы получили регистрацию!");
            user.addHistory(0, 'Получил гражданство');
            user.save();
        }
        if (item.doName == 'getWorkId') {

            if (user.getCache('work_lic') != '') {
                mp.game.ui.notifications.show("~r~У Вас уже есть WorkID");
                return;
            }
            if (user.getCache('reg_status') == 0) {
                mp.game.ui.notifications.show("~r~У Вас нет регистрации или гражданства");
                return;
            }
            try {
                user.set('work_lic', methods.getRandomWorkID());
                user.set('work_date', weather.getFullRpDate());
                mp.game.ui.notifications.show("~g~Поздравялем, вы получили WorkID!");
                user.addHistory(0, 'Получил WorkID');
                user.save();

                quest.role0();
                quest.standart();
            }
            catch (e) {
                methods.error(e);
            }
        }
    });
};

menuList.showMeriaIslandMainMenu = function() {

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    UIMenu.Menu.Create(` `, `~b~Секретарь правительства`, 'gov', false, false, 'gov');

    if (user.getCache('work_lic') == '')
        UIMenu.Menu.AddMenuItem("Оформить WorkID", "", {doName: 'getWorkId'});

    if (user.getCache('reg_status') === 0) {
        if (user.getCache('online_time') < 169)
            UIMenu.Menu.AddMenuItem("Оформить регистрацию", 'Стоимость: ~g~Бесплатно', {doName: 'getRegisterFree'});
        else
            UIMenu.Menu.AddMenuItem("Оформить регистрацию", 'Стоимость: ~g~$1,000', {doName: 'getRegister'});
    }

    if (user.getCache('reg_status') === 1)
        UIMenu.Menu.AddMenuItem("Оформить гражданство", 'Стоимость: ~g~$10,000', {doName: 'getFullRegister'});

    UIMenu.Menu.AddMenuItem("Работа", "", {doName: 'showMeriaJobListMenu'});
    UIMenu.Menu.AddMenuItem("Лицензионный центр", "", {doName: 'showLicBuyMenu'});

    UIMenu.Menu.AddMenuItem("Имущество", "Операции с вашим имуществом", {doName: 'showMeriaSellHvbMenu'});
    UIMenu.Menu.AddMenuItem("Налоговый кабинет", "", {doName: 'showMeriaTaxMenu'});

    if (user.getCache('house_id') > 0)
        UIMenu.Menu.AddMenuItem("Подселение", "", {doName: 'showMeriaHousePeopleMenu'});

    UIMenu.Menu.AddMenuItem("Экономика штата", "", {doName: 'showMeriaInfoMenu'});
    //UIMenu.Menu.AddMenuItem("Подать заявление на стажировку", "", {doName: 'govWork'});
    UIMenu.Menu.AddMenuItem("Банк", "", {doName: 'bank'});

    UIMenu.Menu.AddMenuItem("~y~Создать семью по цене $500,000", "", {doName: 'createFamily'});

    UIMenu.Menu.AddMenuItem("~y~Оплата штрафов", "", {doName: 'showMeriaTicketMenu'});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();

        if (item.doName == 'govWork')
        {
            let discord = await menuList.getUserInput('Введите ваш DISCORD', '', 30);
            let text = await menuList.getUserInput('Почему вы хотите тут работать?', '', 100);
            mp.game.ui.notifications.show(`~g~Заявление было отправлено, скоро с вами свяжутся в дискорде`);
            mp.events.callRemote('server:discord:sendWorkGov', discord, text);
        }
        if (item.doName == 'bank')
        {
            menuList.showBankMenu(2, 2)
        }
        if (item.doName == 'createFamily')
        {
            let text = await menuList.getUserInput('Введите название семьи', '', 30);
            if (text === '')
                return;
            mp.events.callRemote('server:family:create', text);
        }
        if (item.doName == 'showMeriaSellHvbMenu')
            menuList.showMeriaSellHvbMenu(await coffer.getAllData());
        if (item.doName == 'showMeriaTaxMenu')
            menuList.showMeriaTaxMenu();
        if (item.doName == 'showMeriaInfoMenu')
            menuList.showMeriaInfoMenu(await coffer.getAllData());
        if (item.doName == 'showMeriaJobListMenu')
            menuList.showMeriaJobListMenu(true);
        if (item.doName == 'showMeriaHousePeopleMenu')
            menuList.showMazeBankHousePeopleMenu();
        if (item.doName == 'showMeriaTicketMenu')
            mp.events.callRemote('server:showMeriaTicketMenu');
        if (item.doName == 'showLicBuyMenu')
            menuList.showLicBuyMenu();
        if (item.doName == 'getRegister') {
            if (user.getBankMoney() < 1000) {
                mp.game.ui.notifications.show("~r~У Вас недостаточно средств на банковском счету");
                return;
            }
            if (user.getCache('reg_status') > 0) {
                mp.game.ui.notifications.show("~r~Вам не нужна регистрация");
                return;
            }
            user.removeCashMoney(1000, 'Получение регистрации');
            user.set('reg_status', 1);
            mp.game.ui.notifications.show("~g~Поздравялем, вы получили регистрацию!");
            user.addHistory(0, 'Получил регистрацию');
            user.save();
        }
        if (item.doName == 'getRegisterFree') {
            if (user.getCache('reg_status') > 0) {
                mp.game.ui.notifications.show("~r~Вам не нужна регистрация");
                return;
            }
            user.set('reg_status', 1);
            mp.game.ui.notifications.show("~g~Поздравялем, вы получили регистрацию!");
            user.addHistory(0, 'Получил регистрацию');
            user.save();
        }
        if (item.doName == 'getFullRegister') {
            if (user.getCache('reg_status') > 1) {
                mp.game.ui.notifications.show("~r~У Вас уже есть гражданство");
                return;
            }
            if (user.getBankMoney() < 10000) {
                mp.game.ui.notifications.show("~r~У Вас недостаточно средств на банковском счету");
                return;
            }
            if (user.getCache('work_lvl') < 4) {
                mp.game.ui.notifications.show("~r~Рабочий стаж должен быть 4 уровня");
                return;
            }
            if (user.getCache('reg_status') < 1) {
                mp.game.ui.notifications.show("~r~Вам необходима регистрация");
                return;
            }
            user.removeCashMoney(10000, 'Получение гражданства');
            user.set('reg_status', 2);
            mp.game.ui.notifications.show("~g~Поздравялем, вы получили регистрацию!");
            user.addHistory(0, 'Получил гражданство');
            user.save();
        }
        if (item.doName == 'getWorkId') {

            if (user.getCache('work_lic') != '') {
                mp.game.ui.notifications.show("~r~У Вас уже есть WorkID");
                return;
            }
            if (user.getCache('reg_status') == 0) {
                mp.game.ui.notifications.show("~r~У Вас нет регистрации или гражданства");
                return;
            }
            try {
                user.set('work_lic', methods.getRandomWorkID());
                user.set('work_date', weather.getFullRpDate());
                mp.game.ui.notifications.show("~g~Поздравялем, вы получили WorkID!");
                user.addHistory(0, 'Получил WorkID');
                user.save();

                quest.role0();
                quest.standart();
            }
            catch (e) {
                methods.error(e);
            }
        }
    });
};

menuList.showMeriaTicketMenu = function(data) {
    UIMenu.Menu.Create(` `, `~b~Нажмите ~s~Enter~b~ чтобы оплатить`, 'gov', false, false, 'gov');

    JSON.parse(data).forEach(function (item) {
        let mItem = {};
        mItem.id = item.id;
        mItem.price = item.price;
        UIMenu.Menu.AddMenuItem(`~b~#${item.id}. ~s~${methods.moneyFormat(item.price)}`, `${item.do}~br~${item.rp_datetime}`, mItem);
    });

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        if (item.id)
            menuList.showMeriaTicketPayMenu(item.id, item.price);
    });
};

menuList.showMeriaTicketPayMenu = function(id, price) {
    UIMenu.Menu.Create(` `, `~b~Номер штрафа: ${id}`, 'gov', false, false, 'gov');

    UIMenu.Menu.AddMenuItem(`~g~Оплатить по карте ${methods.moneyFormat(price)}`, "", {pay: true});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {

        if (item.pay) {
            UIMenu.Menu.HideMenu();
            mp.events.callRemote('server:user:payTicket', id, price);
        }
    });
};

menuList.showMeriaTaxMenu = function() {

    user.updateCache().then(function () {
        UIMenu.Menu.Create(` `, `~b~Налоговый кабинет`, 'gov', false, false, 'gov');

        //UIMenu.Menu.AddMenuItem("Оплатить налог по номеру счёта", "", {eventName: 'server:tax:payTax'});

        if (user.getCache('house_id') > 0) {
            UIMenu.Menu.AddMenuItem("Налог за дом", "", {itemId: user.getCache('house_id'), type: 0});
        }
        if (user.getCache('condo_id') > 0) {
            UIMenu.Menu.AddMenuItem("Налог за квартиру", "", {itemId: user.getCache('condo_id'), type: 5});
        }
        if (user.getCache('apartment_id') > 0) {
            UIMenu.Menu.AddMenuItem("Налог за апартаменты", "", {itemId: user.getCache('apartment_id'), type: 3});
        }
        if (user.getCache('business_id') > 0) {
            UIMenu.Menu.AddMenuItem("Налог за бизнес", "", {itemId: user.getCache('business_id'), type: 2});
        }
        if (user.getCache('stock_id') > 0) {
            UIMenu.Menu.AddMenuItem("Налог за склад", "", {itemId: user.getCache('stock_id'), type: 4});
        }
        if (user.getCache('yacht_id') > 0) {
            UIMenu.Menu.AddMenuItem("Налог за яхту", "", {itemId: user.getCache('yacht_id'), type: 6});
        }

        for (let i = 1; i < 11; i++) {
            if (user.getCache('car_id' + i) > 0) {
                UIMenu.Menu.AddMenuItem("Налог за ТС #" + i, "", {itemId: user.getCache('car_id' + i), type: 1});
            }
        }

        if (user.getCache('vip_type') || user.getCache('status_media')) {
            UIMenu.Menu.AddMenuItem("~b~Оплатить все налоги", "", {allTax: true});
        }

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            UIMenu.Menu.HideMenu();

            if (item.eventName) {
                let number = methods.parseInt(await UIMenu.Menu.GetUserInput("Счёт", "", 10));
                if (number == 0)
                    return;
                let sum = methods.parseInt(await UIMenu.Menu.GetUserInput("Сумма", "", 9));
                if (sum == 0)
                    return;
                mp.events.callRemote(item.eventName, 1, number, sum);
            }
            if (item.itemId) {
                menuList.showMeriaTaxInfoMenu(item.type, item.itemId);
            }
            if (item.allTax) {
                menuList.showMeriaTaxInfoAllMenu();
            }
        });
    });
};

menuList.showMeriaTaxInfoAllMenu = async function() {
    let tax = 0;

    try {
        if (user.getCache('house_id') > 0)
            tax = tax + methods.parseInt(await houses.get(user.getCache('house_id'), 'tax_money'));

        if (user.getCache('condo_id') > 0)
            tax = tax + methods.parseInt(await condos.get(user.getCache('condo_id'), 'tax_money'));

        /*if (user.getCache('apartment_id') > 0)
            tax = tax + await condos.get(id, 'tax_money');*/

        if (user.getCache('business_id') > 0)
            tax = tax + methods.parseInt(await business.get(user.getCache('business_id'), 'tax_money'));

        if (user.getCache('stock_id') > 0)
            tax = tax + methods.parseInt(await stocks.get(user.getCache('stock_id'), 'tax_money'));

        if (user.getCache('yacht_id') > 0)
            tax = tax + methods.parseInt(await yachts.get(user.getCache('yacht_id'), 'tax_money'));

        for (let i = 1; i < 11; i++) {
            if (user.getCache('car_id' + i) > 0) {
                tax = tax + methods.parseInt(await vehicles.get(user.getCache('car_id' + i), 'tax_money'));
            }
        }

        UIMenu.Menu.Create(` `, `~b~Оплата всех налогов`, 'gov', false, false, 'gov');

        UIMenu.Menu.AddMenuItem(`~b~Ваша задолженность:~s~ ~r~${(tax == 0 ? "~g~Отсутствует" : `${methods.moneyFormat(tax)}`)}`);

        UIMenu.Menu.AddMenuItem("Оплатить наличкой", "", {payTaxType: 0});
        UIMenu.Menu.AddMenuItem("Оплатить картой", "", {payTaxType: 1});

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            UIMenu.Menu.HideMenu();

            if (item.payTaxType >= 0) {
                let sum = tax * -1;
                if (sum === 0) {
                    mp.game.ui.notifications.show("~r~Задолжность должна быть больше нуля");
                    return;
                }

                if (item.payTaxType === 0 && user.getCashMoney() < sum) {
                    mp.game.ui.notifications.show("~r~У Вас нет такой суммы на руках");
                    return;
                }
                if (item.payTaxType === 1 && user.getBankMoney() < sum) {
                    mp.game.ui.notifications.show("~r~У Вас нет такой суммы в банке");
                    return;
                }

                mp.events.callRemote('server:tax:payTaxAll', item.payTaxType, sum);
            }
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showMeriaTaxInfoMenu = async function(type, id) {

    let tax = 0;
    let taxLimit = 0;
    let taxDay = 0;
    let score = 0;
    let name = "";

    let taxPrice = 0.0007;

    if (type == 0)
    {
        let item = await houses.getData(id);
        taxDay = methods.parseInt((item.get('price') * taxPrice + 10)/*/ 7*/);
        tax = item.get("tax_money");
        taxLimit = methods.parseInt(item.get('price') * taxPrice + 10) * 21;
        score = item.get("tax_score");

        name = item.get("address") + " №" + item.get("number");
    }
    else if (type == 1)
    {
        let item = await vehicles.getData(id);
        taxDay = methods.parseInt((item.get('price') * taxPrice + 10)/*/ 7*/);
        tax = item.get("tax_money");
        taxLimit = methods.parseInt(item.get('price') * taxPrice + 10) * 21;
        score = item.get("tax_score");

        name = methods.getVehicleInfo(item.get('name')).display_name + " (" + item.get("number") + ")";
    }
    else if (type == 2)
    {
        let item = await business.getData(id);
        taxDay = methods.parseInt((item.get('price') * taxPrice + 10)/*/ 7*/);
        tax = item.get("tax_money");
        taxLimit = methods.parseInt(item.get('price') * taxPrice + 10) * 7;
        score = item.get("tax_score");

        name = item.get('name');
    }
    /*else if (type == 3)
    {
        let item = await Container.Data.GetAll(-100000 + methods.parseInt(id));
        taxDay = methods.parseInt((item.get('price') * taxPrice + 10)/ 7);
        tax = item.get("tax_money");
        taxLimit = methods.parseInt(item.get('price') * taxPrice + 10) * 21;
        score = item.get("tax_score");

        name = "Апартаменты №" + item.get('number');
    }
    else */if (type == 4)
    {
        let item = await stocks.getData(id);
        taxDay = methods.parseInt((item.get('price') * taxPrice + 10)/*/ 7*/);
        tax = item.get("tax_money");
        taxLimit = methods.parseInt(item.get('price') * taxPrice + 10) * 21;
        score = item.get("tax_score");

        name = "Склад №" + item.get('number');
    }
    else if (type == 5)
    {
        let item = await condos.getData(id);
        taxDay = methods.parseInt((item.get('price') * taxPrice + 10)/*/ 7*/);
        tax = item.get("tax_money");
        taxLimit = methods.parseInt(item.get('price') * taxPrice + 10) * 21;
        score = item.get("tax_score");

        name = item.get("address") + " №" + item.get("number");
    }
    else if (type == 6)
    {
        let item = await yachts.getData(id);
        taxDay = methods.parseInt((item.get('price') * taxPrice + 10)/*/ 7*/);
        tax = item.get("tax_money");
        taxLimit = methods.parseInt(item.get('price') * taxPrice + 10) * 21;
        score = item.get("tax_score");

        name = item.get("name") + " №" + item.get("id");
    }

    UIMenu.Menu.Create(` `, `~b~` + name, 'gov', false, false, 'gov');

    UIMenu.Menu.AddMenuItem(`~b~Счёт:~s~ ${score}`, "Уникальный счёт вашего имущества");
    UIMenu.Menu.AddMenuItem(`~b~Ваша задолженность:~s~ ~r~${(tax == 0 ? "~g~Отсутствует" : `${methods.moneyFormat(tax)}`)}`, `Ваш текущий долг, при достижении ~r~$${taxLimit}~s~ ваше имущество будет изъято`);
    //UIMenu.Menu.AddMenuItem(`~b~Ваша задолженность:~s~ ~r~${(tax == 0 ? "~g~Отсутствует" : `${methods.moneyFormat(tax)}`)}`);
    UIMenu.Menu.AddMenuItem(`~b~Налог в день (( ООС )):~s~ $${taxDay}`, "Индивидуальная налоговая ставка");
    UIMenu.Menu.AddMenuItem(`~b~Допустимый лимит:~s~ $${taxLimit}`, "Допустимый лимит до обнуления имущества");

    UIMenu.Menu.AddMenuItem("Оплатить наличкой", "", {payTaxType: 0});
    UIMenu.Menu.AddMenuItem("Оплатить картой", "", {payTaxType: 1});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();

        if (item.payTaxType >= 0) {
            let sum = methods.parseInt(await UIMenu.Menu.GetUserInput("Сумма", "", 9));
            if (sum == 0)
                return;

            if (item.payTaxType === 0 && user.getCashMoney() < sum) {
                mp.game.ui.notifications.show("~r~У Вас нет такой суммы на руках");
                return;
            }
            if (item.payTaxType === 1 && user.getBankMoney() < sum) {
                mp.game.ui.notifications.show("~r~У Вас нет такой суммы в банке");
                return;
            }

            mp.events.callRemote('server:tax:payTax', item.payTaxType , score, sum);
        }
    });
};

menuList.showLawyerOffersMenu = function(price, id, rpName) {

    UIMenu.Menu.Create('Юрист', `~b~${rpName}`);

    UIMenu.Menu.AddMenuItem("~g~Согласиться", `Цена: ~g~${methods.moneyFormat(price)}`, {eventName: 'server:user:lawyer:accept'});
    UIMenu.Menu.AddMenuItem("~r~Отказаться");

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.eventName)
            mp.events.callRemote(item.eventName, id);
    });
};

menuList.showLawyerHouseOffersMenu = function(buyerId, id) {

    UIMenu.Menu.Create('Юрист', `~b~Подселение`);

    UIMenu.Menu.AddMenuItem("~g~Согласиться", `Цена: ~g~$10,000`, {eventName: 'server:houses:lawyer:addUser'});
    UIMenu.Menu.AddMenuItem("~r~Отказаться");

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.eventName)
            mp.events.callRemote(item.eventName, id, buyerId);
    });
};

menuList.showAcceptClearWantedMenu = function(id, price) {

    UIMenu.Menu.Create('Мафия', `~b~Снять розыск`);

    UIMenu.Menu.AddMenuItem("~g~Согласиться", `Цена: ~g~${methods.moneyFormat(price)}`, {eventName: 'server:user:clearByMafia'});
    UIMenu.Menu.AddMenuItem("~r~Отказаться");

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.eventName)
            mp.events.callRemote(item.eventName, id, price);
    });
};

menuList.showMechanicAcceptFuelMenu = function(id, count, price) {

    UIMenu.Menu.Create('Механик', `~b~Заправка транспорта`);

    UIMenu.Menu.AddMenuItem("~g~Согласиться", `Количество:~g~${count}ед.~br~Цена: ~g~${methods.moneyFormat(price)}`, {eventName: 'server:mechanic:fuel:accept'});
    UIMenu.Menu.AddMenuItem("~r~Отказаться");

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.eventName)
            mp.events.callRemote(item.eventName, id, count, price);
    });
};

menuList.showAveAcceptMenu = function(id, name) {

    UIMenu.Menu.Create('Брак', `~b~${name} предложил вступить в брак`);

    UIMenu.Menu.AddMenuItem("~g~Согласиться", ``, {eventName: 'server:ave:accept'});
    UIMenu.Menu.AddMenuItem("~r~Отказаться");

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.eventName)
            mp.events.callRemote(item.eventName, id);
    });
};

menuList.showNoAveAcceptMenu = function(id, name) {

    UIMenu.Menu.Create('Брак', `~b~${name} предложил разорвать брак`);

    UIMenu.Menu.AddMenuItem("~g~Согласиться", ``, {eventName: 'server:noave:accept'});
    UIMenu.Menu.AddMenuItem("~r~Отказаться");

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.eventName)
            mp.events.callRemote(item.eventName, id);
    });
};

menuList.showMechanicAcceptFixMenu = function(id, price) {

    UIMenu.Menu.Create('Механик', `~b~Починка транспорта`);

    UIMenu.Menu.AddMenuItem("~g~Согласиться", `Цена: ~g~${methods.moneyFormat(price)}`, {eventName: 'server:mechanic:fix:accept'});
    UIMenu.Menu.AddMenuItem("~r~Отказаться");

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.eventName)
            mp.events.callRemote(item.eventName, id, price);
    });
};

menuList.showMechanicAcceptFlipMenu = function(id, price) {

    UIMenu.Menu.Create('Механик', `~b~Перевернуть транспорт`);

    UIMenu.Menu.AddMenuItem("~g~Согласиться", `Цена: ~g~${methods.moneyFormat(price)}~br~~s~Учтите, что надо находится рядом с транспортом или в нем`, {eventName: 'server:mechanic:flip:accept'});
    UIMenu.Menu.AddMenuItem("~r~Отказаться");

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.eventName)
            mp.events.callRemote(item.eventName, id, price);
    });
};

menuList.showMazeBankHousePeopleMenu = function() {
    //TODO BLACKOUT

    user.updateCache().then(function () {
        UIMenu.Menu.Create(` `, `~b~Жилищный вопрос`, 'gov', false, false, 'gov');

        if (user.getCache('house_id') > 0) {
            UIMenu.Menu.AddMenuItem("Подселить игрока в дом", 'Стоимость ~g~$10.000~s~~br~Необходимо ввести CARD ID игрока (Тот который в документах)', {eventName: 'server:houses:addUser'});
            UIMenu.Menu.AddMenuItem("Список жильцов", "", {eventName: 'server:houses:userList'});
            UIMenu.Menu.AddMenuItem("~y~Выселиться", "Стоимость ~g~$1.000", {eventName: 'server:houses:removeMe'});
        }

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            UIMenu.Menu.HideMenu();

            if (item.eventName == 'server:houses:addUser') {
                let playerId = methods.parseInt(await UIMenu.Menu.GetUserInput("ID Игрока", "", 9));
                if (playerId < 0) {
                    mp.game.ui.notifications.show("~r~ID Игркоа не может быть меньше нуля");
                    return;
                }
                mp.events.callRemote(item.eventName, playerId);
            }
            else if (item.eventName) {
                mp.events.callRemote(item.eventName);
            }
        });
    });
};

menuList.showMazeBankHousePeopleListMenu = function(data) {
    //TODO BLACKOUT
    UIMenu.Menu.Create(` `, `~b~Список жильцов`, 'gov', false, false, 'gov');

    data.forEach(function (item) {
        let userId = methods.parseInt(item[0]);
        if (userId === user.getCache('id'))
            UIMenu.Menu.AddMenuItem(`${item[1]}`);
        else
            UIMenu.Menu.AddMenuItem(`${item[1]}`, "", {eventParam: userId});
    });

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(item => {
        UIMenu.Menu.HideMenu();
        if (item.eventParam)
            menuList.showMazeBankHousePeopleListDoMenu(item.eventParam);
    });

};

menuList.showMazeBankHousePeopleListDoMenu = function(id) {

    UIMenu.Menu.Create(` `, `~b~` + id, 'gov', false, false, 'gov');

    UIMenu.Menu.AddMenuItem(`~r~Выселить по цене $1.000`, "", {eventName: 'server:house:removeId'});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(item => {
        UIMenu.Menu.HideMenu();
        if (item.eventName == 'server:house:removeId') {
            mp.events.callRemote(item.eventName, id);
        }
    });
};

menuList.showLicBuyMenu = function()
{
    UIMenu.Menu.Create(" ", "~b~Покупка лицензий", 'gov', false, false, 'gov');

    if (user.getCache('online_time') < 169) {

        UIMenu.Menu.AddMenuItem("Категория A", "Цена: ~g~$0.10", {doName: 'a_lic'});
        UIMenu.Menu.AddMenuItem("Категория B", "Цена: ~g~$0.10", {doName: 'b_lic'});
    }
    else {
        UIMenu.Menu.AddMenuItem("Категория A", "Цена: ~g~$99.90", {doName: 'a_lic'});
        UIMenu.Menu.AddMenuItem("Категория B", "Цена: ~g~$300", {doName: 'b_lic'});
    }
    UIMenu.Menu.AddMenuItem("Категория C", "Цена: ~g~$500", {doName: 'c_lic'});
    UIMenu.Menu.AddMenuItem("Водный транспорт", "Цена: ~g~$990", {doName: 'ship_lic'});
    UIMenu.Menu.AddMenuItem("Авиатранспорт", "Цена: ~g~$5000", {doName: 'air_lic'});
    UIMenu.Menu.AddMenuItem("Перевозка пассажиров", "Цена: ~g~$10,000", {doName: 'taxi_lic'});

    UIMenu.Menu.AddMenuItem(`Лицензия на предпринимательство`, "Стоимость: ~g~$60,000", {doName: "biz_lic"});
    UIMenu.Menu.AddMenuItem(`Разрешение на рыбаловство`, "Стоимость: ~g~$30,000", {doName: "fish_lic"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if (user.getCache('online_time') < 169) {
            if (item.doName == "a_lic")
                user.buyLicense('a_lic', 0.10);
            else if (item.doName == "b_lic")
                user.buyLicense('b_lic', 0.10);
        }
        else {
            if (item.doName == "a_lic")
                user.buyLicense('a_lic', 99.90);
            else if (item.doName == "b_lic")
                user.buyLicense('b_lic', 300);
        }
        if (item.doName == "c_lic")
            user.buyLicense('c_lic', 500);
        else if (item.doName == "air_lic")
            user.buyLicense('air_lic', 5000);
        else if (item.doName == "ship_lic")
            user.buyLicense('ship_lic', 990);
        else if (item.doName == "biz_lic")
            user.buyLicense('biz_lic', 60000);
        else if (item.doName == "fish_lic")
            user.buyLicense('fish_lic', 30000);
        else if (item.doName == "taxi_lic") {
            if (user.getCache('work_lvl') < 2) {
                mp.game.ui.notifications.show("~r~Вам необходим 2 уровень рабочего стажа");
                return;
            }
            user.buyLicense('taxi_lic', 10000);
        }

        setTimeout(quest.fish, 5000);
        setTimeout(quest.business, 5000);
    });
};

menuList.showMeriaJobListMenu = function(isIsland = false) {

    UIMenu.Menu.Create(` `, `~b~Трудовая биржа`, 'gov', false, false, 'gov');

    if (isIsland) {
        UIMenu.Menu.AddMenuItem("Грузчик", "", {doName: 'gr'});
        UIMenu.Menu.AddMenuItem("Садовник", "", {jobName: 1});
    }
    else {
        UIMenu.Menu.AddMenuItem("Садовник", "", {jobName: 1});
        UIMenu.Menu.AddMenuItem("Строитель", "", {jobName: 2});

        UIMenu.Menu.AddMenuItem("Водитель автобуса-1", "Городской автобус", {jobName: 6});
        UIMenu.Menu.AddMenuItem("Водитель автобуса-2", "Трансферный автобус", {jobName: 7});
        UIMenu.Menu.AddMenuItem("Водитель автобуса-3", "Рейсовый автобус", {jobName: 8});

        UIMenu.Menu.AddMenuItem("Механик", "", {jobName: 5});
        //UIMenu.Menu.AddMenuItem("Священник", "", {jobName: 12});

        UIMenu.Menu.AddMenuItem("Фотограф", "", {jobName: 3});
        UIMenu.Menu.AddMenuItem("Почтальон", "", {jobName: 4});

        UIMenu.Menu.AddMenuItem("Инкассатор", "", {jobName: 10});
    }

    /*UIMenu.Menu.AddMenuItem("Таксист", "Компания: ~y~DownTown Cab Co.").jobName = 9;

    UIMenu.Menu.AddMenuItem("Инкассатор", "Компания: ~y~Gruppe6").jobName = 10;
    UIMenu.Menu.AddMenuItem("Грузоперевозки").jobName = 11;*/

    UIMenu.Menu.AddMenuItem("~y~Уволиться с работы", "", {doName: 'uninvite'});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();

        if (item.doName == 'uninvite') {
            jobPoint.delete();
            builder.stop();
            tree.stop();
            bus.stop(0,false);
            photo.stop();
            gr6.stop();
            user.set('job', 0);
            mp.game.ui.notifications.show("~y~Вы уволились с работы");
        }
        if (item.doName == 'gr') {
            jobPoint.delete();
            builder.stop();
            tree.stop();
            bus.stop(0,false);
            photo.stop();
            gr6.stop();
            user.set('job', 0);
            user.setWaypoint(5106.7861328125, -5161.85791015625);
            quest.standart();
            mp.game.ui.notifications.show("~g~Вы устроились на новую работу, местоположение рабочего транспорта указано на карте");
        }
        if (item.jobName) {

            if (user.getCache('work_lic').trim() === '') {
                mp.game.ui.notifications.show("~r~Для начала оформите Work ID");
                return;
            }

            if ((item.jobName === 6 || item.jobName === 7 || item.jobName === 8 || item.jobName === 12) && user.getCache('work_lvl') < 2) {
                mp.game.ui.notifications.show("~r~Вам необходим 2 уровень рабочего стажа");
                return;
            }

            if ((item.jobName === 6 || item.jobName === 7 || item.jobName === 8) && !user.getCache('taxi_lic')) {
                mp.game.ui.notifications.show("~r~Вам необходима лицензия на перевозку пассажиров");
                return;
            }

            if ((item.jobName === 3 || item.jobName === 4 || item.jobName === 5) && user.getCache('work_lvl') < 3) {
                mp.game.ui.notifications.show("~r~Вам необходим 3 уровень рабочего стажа");
                return;
            }

            if (item.jobName === 10 && (user.getCache('work_lvl') < 4 || !user.getCache('gun_lic'))) {
                mp.game.ui.notifications.show("~r~Вам необходим 4 уровень рабочего стажа и лицензия на ношение оружия");
                return;
            }

            if (item.jobName === 1) {
                chat.sendLocal(`!{${chat.clBlue}}Справка по работе Садовник`);
                chat.sendLocal(`Для начала Вам необходимо арендовать транспорт. Затем откройте меню транспорта и нажмите Получить задание, а далее думаю и так понятно.`);
                chat.sendLocal(`Чтобы найти работу садовника, откройте телефон (По стандарту кнопка O, далее откройте GPS и найдите там работу садовника).`);
            }
            if (item.jobName === 2) {
                chat.sendLocal(`!{${chat.clBlue}}Справка по работе Строитель`);
                chat.sendLocal(`Для начала Вам необходимо арендовать транспорт. Затем откройте меню транспорта и нажмите Получить задание, а далее думаю и так понятно.`);
                chat.sendLocal(`Чтобы найти работу строителя, откройте телефон (По стандарту кнопка O, далее откройте GPS и найдите там работу строителя).`);
            }
            if (item.jobName === 3) {
                chat.sendLocal(`!{${chat.clBlue}}Справка по работе Фотограф`);
                chat.sendLocal(`Для начала Вам необходимо арендовать транспорт. Затем откройте меню транспорта и нажмите Получить задание, а далее думаю и так понятно.`);
                chat.sendLocal(`Чтобы найти работу фотографа, откройте телефон (По стандарту кнопка O, далее откройте GPS и найдите там работу фотографа).`);
            }
            if (item.jobName === 4) {
                chat.sendLocal(`!{${chat.clBlue}}Справка по работе Почтальон`);
                chat.sendLocal(`Для начала Вам необходимо арендовать транспорт. Затем откройте меню транспорта и нажмите Взять почту, а далее езжайте к !{${chat.clBlue}}любому !{${chat.clWhite}} дому или квартире и просто раскладывайте почту в тех местах, где нравится вам.`);
                chat.sendLocal(`Чтобы найти работу почтальона, откройте телефон (По стандарту кнопка O, далее откройте GPS и найдите там работу почтальона).`);
            }
            if (item.jobName === 6 || item.jobName === 7 || item.jobName === 8) {
                chat.sendLocal(`!{${chat.clBlue}}Справка по работе Водитель автобуса`);
                chat.sendLocal(`Для начала Вам необходимо арендовать транспорт. Затем откройте меню транспорта и нажмите Начать рейс.`);
            }
            if (item.jobName === 10) {
                chat.sendLocal(`!{${chat.clBlue}}Справка по работе Инкассатор`);
                chat.sendLocal(`Для начала Вам необходимо арендовать транспорт, далее найти напарника и работать, всё работает через меню транспорта.`);
            }
            if (item.jobName === 5) {
                chat.sendLocal(`!{${chat.clBlue}}Справка по работе Механик`);
                chat.sendLocal(`Для начала Вам необходимо арендовать транспорт, арендуйте транспорт и через меню транспорта и выполняйте заказы.`);
            }
            if (item.jobName === 12) {
                chat.sendLocal(`!{${chat.clBlue}}Справка по работе Священика`);
                chat.sendLocal(`Ваша возможности практически безграничны, а на некоторых можно и заработать. Например у вас в церкве доступно функционально женить и разводить людей. А еще вы можете делать РП смерть.`);
            }

            if (ui.isIslandZone())
                user.setWaypoint(5398.75634765625, -5173.14111328125);
            else
                user.setWaypoint(enums.jobList[item.jobName][1], enums.jobList[item.jobName][2]);
            user.set('job', item.jobName);
            mp.game.ui.notifications.show("~g~Вы устроились на новую работу, местоположение рабочего транспорта указано на карте");
            quest.standart();
        }
    });
};

menuList.showMeriaInfoMenu = function(cofferData) {
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    try {
        UIMenu.Menu.Create(` `, `~b~Экономика штата`, 'gov', false, false, 'gov');

        UIMenu.Menu.AddMenuItem(`~b~Бюджет`, "", {}, `~g~${methods.moneyFormat(cofferData.get('cofferMoney'))}`);
        UIMenu.Menu.AddMenuItem(`~b~Пособие`, "", {}, `~g~${methods.moneyFormat(cofferData.get('cofferBenefit'))}`);
        UIMenu.Menu.AddMenuItem(`~b~Налог на зарплату`, "", {}, `${cofferData.get('cofferTaxPayDay')}%`);
        UIMenu.Menu.AddMenuItem(`~b~Налог на бизнес`, "", {}, `${cofferData.get('cofferTaxBusiness')}%`);
        UIMenu.Menu.AddMenuItem(`~b~Налог на имущество`, "", {}, `${cofferData.get('cofferTaxProperty')}%`);
        UIMenu.Menu.AddMenuItem(`~b~Промежуточный налог`, "", {}, `${cofferData.get('cofferTaxIntermediate')}%`);

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
        UIMenu.Menu.Draw();
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showMeriaSellHvbMenu = function(cofferData) {
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    user.updateCache().then(function () {
        UIMenu.Menu.Create(` `, `~b~Текущая налоговая ставка: ~s~${cofferData.get('cofferTaxProperty')}%`, 'gov', false, false, 'gov');

        if (user.getCache('house_id') > 0) {
            UIMenu.Menu.AddMenuItem("Продать дом", "Продать дом государству.~br~С учетом налога", {eventName: 'server:houses:sell'});
            UIMenu.Menu.AddMenuItem("~y~Продать дом игроку", "", {eventNameSell: 'server:houses:sellToPlayer'});
        }
        if (user.getCache('condo_id') > 0) {
            UIMenu.Menu.AddMenuItem("Продать квартиру", "Продать квартиру государству.~br~С учетом налога", {eventName: 'server:condo:sell'});
            UIMenu.Menu.AddMenuItem("~y~Продать квартиру игроку", "", {eventNameSell: 'server:condo:sellToPlayer'});
        }
        if (user.getCache('apartment_id') > 0) {
            UIMenu.Menu.AddMenuItem("Продать апартаменты", "Продать апартаменты государству.~br~С учетом налога", {eventName: 'server:apartments:sell'});
            UIMenu.Menu.AddMenuItem("~y~Продать апартаменты игроку", "", {eventNameSell: 'server:apartments:sellToPlayer'});
        }
        if (user.getCache('business_id') > 0) {
            UIMenu.Menu.AddMenuItem("Продать бизнес", "Продать бизнес государству.~br~С учетом налога", {eventName: 'server:business:sell'});
            UIMenu.Menu.AddMenuItem("~y~Продать бизнес игроку", "", {eventNameSell: 'server:business:sellToPlayer'});
        }
        if (user.getCache('stock_id') > 0) {
            UIMenu.Menu.AddMenuItem("Продать склад", "Продать склад государству.~br~С учетом налога", {eventName: 'server:stock:sell'});
            UIMenu.Menu.AddMenuItem("~y~Продать склад игроку", "", {eventNameSell: 'server:stock:sellToPlayer'});
        }
        if (user.getCache('yacht_id') > 0) {
            UIMenu.Menu.AddMenuItem("Продать яхту", "Продать яхту государству.~br~С учетом налога", {eventName: 'server:yachts:sell'});
            UIMenu.Menu.AddMenuItem("~y~Продать яхту игроку", "", {eventNameSell: 'server:yacht:sellToPlayer'});
        }

        UIMenu.Menu.AddMenuItem(`~b~Продать транспорт`, 'Открыть список ТС', {doName: 'veh'});

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            UIMenu.Menu.HideMenu();

            if (item.doName == 'veh') {
                menuList.showMeriaSellVehHvbMenu(cofferData);
            }
            if (item.eventName) {
                menuList.showMeriaAcceptSellMenu(item.eventName);
            }
            if (item.eventNameSellV) {
                if (Container.Data.HasLocally(mp.players.local.remoteId, "isSellTimeout"))
                {
                    mp.game.ui.notifications.show("~r~Таймаут 1 минута");
                    return;
                }

                let playerId = methods.parseInt(await UIMenu.Menu.GetUserInput("ID Игрока", "", 5));
                if (playerId < 0) {
                    mp.game.ui.notifications.show("~r~ID Игркоа не может быть меньше нуля");
                    return;
                }
                let sum = methods.parseFloat(await UIMenu.Menu.GetUserInput("Сумма", "", 12));
                if (sum < 0) {
                    mp.game.ui.notifications.show("~r~Сумма не может быть меньше нуля");
                    return;
                }

                mp.events.callRemote('server:car:sellToPlayer', playerId, sum, item.eventNameSellV);

                Container.Data.SetLocally(mp.players.local.remoteId, "isSellTimeout", true);

                setTimeout(function () {
                    Container.Data.ResetLocally(mp.players.local.remoteId, "isSellTimeout");
                }, 1000 * 60);
            }
            if (item.eventNameSell) {

                if (Container.Data.HasLocally(mp.players.local.remoteId, "isSellTimeout"))
                {
                    mp.game.ui.notifications.show("~r~Таймаут 1 минута");
                    return;
                }

                let playerId = methods.parseInt(await UIMenu.Menu.GetUserInput("ID Игрока", "", 5));
                if (playerId < 0) {
                    mp.game.ui.notifications.show("~r~ID Игркоа не может быть меньше нуля");
                    return;
                }
                let sum = methods.parseFloat(await UIMenu.Menu.GetUserInput("Сумма", "", 12));
                if (sum < 0) {
                    mp.game.ui.notifications.show("~r~Сумма не может быть меньше нуля");
                    return;
                }

                mp.events.callRemote(item.eventNameSell, playerId, sum);

                Container.Data.SetLocally(mp.players.local.remoteId, "isSellTimeout", true);

                setTimeout(function () {
                    Container.Data.ResetLocally(mp.players.local.remoteId, "isSellTimeout");
                }, 1000 * 60);
            }
        });
    });
};

menuList.showMeriaSellVehHvbMenu = async function(cofferData, isNpc = false) {
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    let vehList = [];

    for (let i = 1; i < 11; i++) {
        try {
            if (user.getCache(`car_id${i}`) > 0) {
                let vehData = await vehicles.getData(user.getCache(`car_id${i}`));
                vehList.push(vehData);
            }
            else {
                vehList.push(null);
            }
        }
        catch (e) {

        }
    }

    let taxOffset = 10;

    user.updateCache().then(async function () {
        UIMenu.Menu.Create(` `, `~b~Текущая налоговая ставка: ~s~${cofferData.get('cofferTaxProperty')}%`, 'gov', false, false, 'gov');

        for (let i = 1; i < 11; i++) {
            try {
                if (user.getCache(`car_id${i}`) > 0) {
                    let vehData = vehList[i - 1];
                    let vehInfo = methods.getVehicleInfo(vehData.get('name'));

                    if (vehData.get('s_km') < 300) {
                        UIMenu.Menu.AddMenuItem(`Продать ТС ${vehData.get('name')} (${vehData.get('number')})`, "Продать транспорт государству.~br~Налог: ~g~Отсутствует связи с тем, что пробег у транспорта менее 300км", {eventName: `server:car${i}:sell`});
                    }
                    else {
                        UIMenu.Menu.AddMenuItem(`Продать ТС ${vehData.get('name')} (${vehData.get('number')})`, "Продать транспорт государству.~br~Налог: ~g~" + (cofferData.get('cofferTaxProperty') + taxOffset) + "%", {eventName: `server:car${i}:sell`});
                    }

                    if (vehInfo.price === vehData.get('price')) {
                        if (vehData.get('with_delete') < 2) {
                            if (vehData.get('is_cop_park') > 0) {
                                UIMenu.Menu.AddMenuItem(`~r~${vehData.get('name')} (${vehData.get('number')}) стоит на штрафстоянке, оплатите штраф`, "", {});
                            }
                            else {
                                UIMenu.Menu.AddMenuItem(`~y~Продать ТС ${vehData.get('name')} (${vehData.get('number')}) игроку`, "", {eventNameSellV: i});
                                if (isNpc && (vehData.get('class') === 'Planes' || vehData.get('class') === 'Boats' || vehData.get('class') === 'Helicopters'))
                                {
                                    UIMenu.Menu.AddMenuItem(`~y~Самолеты, лодки и вертолеты нельзя тут продавать`, "", {});
                                }
                                else if (isNpc)
                                {
                                    if(vehData.get('sell_price') < 1)
                                        UIMenu.Menu.AddMenuItem(`~y~Выставить ТС ${vehData.get('name')} (${vehData.get('number')}) на БУ авторынок`, "Комиссия авторынка с продажи ТС 1%.~br~Взнос ~g~$1000", {eventNameSellVBu: i});
                                    else
                                        UIMenu.Menu.AddMenuItem(`~y~Снять ТС ${vehData.get('name')} (${vehData.get('number')}) с БУ авторынка`, "", {eventNameRemoveVBu: i});
                                }
                            }
                        }
                    }
                    else {
                        if (vehInfo.price > vehData.get('price'))
                            UIMenu.Menu.AddMenuItem(`~y~Вы должны государству ${methods.moneyFormat(vehInfo.price - vehData.get('price'))} за ${vehData.get('name')} (${vehData.get('number')})`, `Вы не можете продавать ТС игроку, связи с тем что цена на автомобиль поменялась и вам неоходимо оплатить разницу.~br~~r~ВНИМАНИЕ!~s~ ~y~У вас спишется с рук ${methods.moneyFormat(vehInfo.price - vehData.get('price'))} либо продайте государству`, {eventNameVGiveMoney: i});
                        else 
                            UIMenu.Menu.AddMenuItem(`~y~Вам должно государство ${methods.moneyFormat(vehData.get('price') - vehInfo.price)} за ${vehData.get('name')} (${vehData.get('number')})`, "Вы не можете продавать ТС игроку, связи с тем что цена на автомобиль поменялась и вам необходимо получить разницу.", {eventNameVTakeMoney: i});
                    }
                }
            }
            catch (e) {

            }
        }

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: 'closeMenu'});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            UIMenu.Menu.HideMenu();
            if (item.eventName) {
                menuList.showMeriaAcceptSellMenu(item.eventName);
            }

            if (item.eventNameVTakeMoney) {
                mp.events.callRemote('server:car:takeOffsetMoney', item.eventNameVTakeMoney);
            }
            if (item.eventNameVGiveMoney) {
                mp.events.callRemote('server:car:giveOffsetMoney', item.eventNameVGiveMoney);
            }

            if (item.eventNameSellV) {
                if (Container.Data.HasLocally(mp.players.local.remoteId, "isSellTimeout"))
                {
                    mp.game.ui.notifications.show("~r~Таймаут 1 минута");
                    return;
                }

                let playerId = methods.parseInt(await UIMenu.Menu.GetUserInput("ID Игрока", "", 5));
                if (playerId < 0) {
                    mp.game.ui.notifications.show("~r~ID Игркоа не может быть меньше нуля");
                    return;
                }
                let sum = methods.parseFloat(await UIMenu.Menu.GetUserInput("Сумма", "", 12));
                if (sum < 0) {
                    mp.game.ui.notifications.show("~r~Сумма не может быть меньше нуля");
                    return;
                }

                mp.events.callRemote('server:car:sellToPlayer', playerId, sum, item.eventNameSellV);

                Container.Data.SetLocally(mp.players.local.remoteId, "isSellTimeout", true);

                setTimeout(function () {
                    Container.Data.ResetLocally(mp.players.local.remoteId, "isSellTimeout");
                }, 1000 * 60);
            }
            if (item.eventNameSellVBu) {
                if (user.getCacheData() < 1000) {
                    mp.game.ui.notifications.show("~r~У вас нет при себе $1000");
                    return ;
                }
                let sum = methods.parseFloat(await UIMenu.Menu.GetUserInput("Сумма", "", 12));
                if (sum < 1) {
                    mp.game.ui.notifications.show("~r~Сумма не может быть меньше $1");
                    return;
                }
                user.removeCashMoney(1000, 'Взнос за выставление ТС на БУ рынке');
                mp.events.callRemote('server:car:sellToBu', sum, item.eventNameSellVBu);
            }
            if (item.eventNameRemoveVBu) {
                mp.events.callRemote('server:car:sellFromBu', item.eventNameRemoveVBu);
            }
            if (item.eventNameSell) {

                if (Container.Data.HasLocally(mp.players.local.remoteId, "isSellTimeout"))
                {
                    mp.game.ui.notifications.show("~r~Таймаут 1 минута");
                    return;
                }

                let playerId = methods.parseInt(await UIMenu.Menu.GetUserInput("ID Игрока", "", 5));
                if (playerId < 0) {
                    mp.game.ui.notifications.show("~r~ID Игркоа не может быть меньше нуля");
                    return;
                }
                let sum = methods.parseFloat(await UIMenu.Menu.GetUserInput("Сумма", "", 12));
                if (sum < 0) {
                    mp.game.ui.notifications.show("~r~Сумма не может быть меньше нуля");
                    return;
                }

                mp.events.callRemote(item.eventNameSell, playerId, sum);

                Container.Data.SetLocally(mp.players.local.remoteId, "isSellTimeout", true);

                setTimeout(function () {
                    Container.Data.ResetLocally(mp.players.local.remoteId, "isSellTimeout");
                }, 1000 * 60);
            }
        });
    });
};

menuList.showMeriaAcceptSellMenu = function(eventName) {
    UIMenu.Menu.Create(` `, `~b~Вы точно хотите продать?`, 'gov', false, false, 'gov');

    UIMenu.Menu.AddMenuItem("~y~Продать", "", {eventName: eventName});
    UIMenu.Menu.AddMenuItem("~r~Отменить", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.eventName)
            mp.events.callRemote(item.eventName);
    });
};

menuList.showHouseSellToPlayerMenu = function(houseId, name, sum, userId) {

    UIMenu.Menu.Create("Дом", "~b~" + name);

    UIMenu.Menu.AddMenuItem("Купить за ~g~" + methods.moneyFormat(sum), "", {doName: 'accept'});
    UIMenu.Menu.AddMenuItem("~r~Отменить", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName == "accept")
            mp.events.callRemote('server:houses:sellToPlayer:accept', houseId, sum, userId);
    });
};

menuList.showCarSellToPlayerMenu = function(houseId, name, sum, userId, slot) {
    UIMenu.Menu.Create("Транспорт", "~b~Купить " + name);

    UIMenu.Menu.AddMenuItem("Транспорт за ~g~" + methods.moneyFormat(sum), "", {doName: 'accept'});
    UIMenu.Menu.AddMenuItem("~r~Отменить", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName == "accept")
            mp.events.callRemote('server:car:sellToPlayer:accept', houseId, sum, userId, slot);
    });
};

menuList.showCondoSellToPlayerMenu = function(houseId, name, sum, userId) {
    UIMenu.Menu.Create("Квартира", "~b~" + name);

    UIMenu.Menu.AddMenuItem("Купить за ~g~" + methods.moneyFormat(sum), "", {doName: 'accept'});
    UIMenu.Menu.AddMenuItem("~r~Отменить", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName == "accept")
            mp.events.callRemote('server:condo:sellToPlayer:accept', houseId, sum, userId);
    });
};


menuList.showYachtSellToPlayerMenu = function(houseId, name, sum, userId) {
    UIMenu.Menu.Create("Яхта", "~b~" + name);

    UIMenu.Menu.AddMenuItem("Купить за ~g~" + methods.moneyFormat(sum), "", {doName: 'accept'});
    UIMenu.Menu.AddMenuItem("~r~Отменить", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName == "accept")
            mp.events.callRemote('server:yacht:sellToPlayer:accept', houseId, sum, userId);
    });
};

menuList.showApartSellToPlayerMenu = function(houseId, name, sum, userId) {

    UIMenu.Menu.Create("Апартаменты", "~b~" + name);

    UIMenu.Menu.AddMenuItem("Купить за ~g~" + methods.moneyFormat(sum), "", {doName: 'accept'});
    UIMenu.Menu.AddMenuItem("~r~Отменить", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName == "accept")
            mp.events.callRemote('server:apartments:sellToPlayer:accept', houseId, sum, userId);
    });
};

menuList.showYachtSellToPlayerMenu = function(houseId, name, sum, userId) {
    UIMenu.Menu.Create("Яхта", "~b~" + name);

    UIMenu.Menu.AddMenuItem("Купить за ~g~" + methods.moneyFormat(sum), "", {doName: 'accept'});
    UIMenu.Menu.AddMenuItem("~r~Отменить", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName == "accept")
            mp.events.callRemote('server:yacht:sellToPlayer:accept', houseId, sum, userId);
    });
};

menuList.showStockSellToPlayerMenu = function(houseId, name, sum, userId) {
    UIMenu.Menu.Create("Склад", "~b~" + name);

    UIMenu.Menu.AddMenuItem("Купить за ~g~" + methods.moneyFormat(sum), "", {doName: 'accept'});
    UIMenu.Menu.AddMenuItem("~r~Отменить", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName == "accept")
            mp.events.callRemote('server:stock:sellToPlayer:accept', houseId, sum, userId);
    });
};

menuList.showBusinessSellToPlayerMenu = function(houseId, name, sum, userId) {
    UIMenu.Menu.Create("Бизнес", "~b~" + name);

    UIMenu.Menu.AddMenuItem("Купить за ~g~" + methods.moneyFormat(sum), "", {doName: 'accept'});
    UIMenu.Menu.AddMenuItem("~r~Отменить", "", {doName: 'closeMenu'});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName == "accept")
            mp.events.callRemote('server:business:sellToPlayer:accept', houseId, sum, userId);
    });
};

menuList.showMainMenu = function() {

    UIMenu.Menu.Create('Меню', 'Главное меню', 'showMainMenu');
    if (methods.isBlockKeys()) {
        UIMenu.Menu.AddMenuItem("~y~Задать вопрос", "", {doName: "sendAsk"});
        UIMenu.Menu.AddMenuItem("~r~Жалоба", "", {doName: "sendReport"});
    }
    else {
        UIMenu.Menu.AddMenuItem("Персонаж", "", {doName: "showPlayerMenu"});
        UIMenu.Menu.AddMenuItem("Транспорт", "", {eventName: "server:showVehMenu"});
        UIMenu.Menu.AddMenuItem("Помощь", "", {doName: "showHelpMenu"});
        UIMenu.Menu.AddMenuItem("Настройки", "", {doName: "showSettingsMenu"});
        UIMenu.Menu.AddMenuItem("Список квестов", "", {doName: "showQuestMenu"});
        UIMenu.Menu.AddMenuItem("~b~Чит-код", "", {doName: "enterPromocode"});
        UIMenu.Menu.AddMenuItem("~y~Задать вопрос", "", {doName: "sendAsk"});
        UIMenu.Menu.AddMenuItem("~r~Жалоба", "", {doName: "sendReport"});
    }
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item) => {
        UIMenu.Menu.HideMenu();

        if (item.doName == 'enterPromocode') {
            let promocode = await UIMenu.Menu.GetUserInput("Введите промокод", "", 128);
            if (promocode == '') return;
            mp.events.callRemote("server:activatePromocode", promocode);
        }
        if (item.doName == 'sendReport') {
            let text = await UIMenu.Menu.GetUserInput("Опишите жалобу", "", 300);
            if (text !== '' && text !== undefined)
                mp.events.callRemote('server:sendReport', text);
        }
        if (item.doName == 'sendAsk') {
            let text = await UIMenu.Menu.GetUserInput("Задайте вопрос", "", 300);
            if (text !== '' && text !== undefined)
                mp.events.callRemote('server:sendAsk', text);
        }
        if (item.doName == 'showPlayerMenu')
            menuList.showPlayerMenu();
        if (item.doName == 'showSettingsMenu')
            menuList.showSettingsMenu();
        if (item.doName == 'showQuestMenu')
            menuList.showQuestMenu();
        if (item.doName == 'showHelpMenu')
            menuList.showHelpMenu();
        if (item.eventName)
            mp.events.callRemote(item.eventName);
    });
};

menuList.showPlayerMenu = function() {
    try {
        UIMenu.Menu.Create(`Персонаж`, `~b~Меню вашего персонажа`);

        UIMenu.Menu.AddMenuItem("Статистика", "", {doName: 'showPlayerStatsMenu'});

        if (!user.getCache('is_take_vehicle')) {
            UIMenu.Menu.AddMenuItem("~y~Получить BMW 760i", "", {doName: 'takeBMW'});
            UIMenu.Menu.AddMenuItem("~y~Получить Audi A8", "", {doName: 'takeAUDI'});
            UIMenu.Menu.AddMenuItem("~y~Получить Mercedes 600", "", {doName: 'takeMERC'});
        }

        if (!user.getCache('is_take_vehicle_2')) {
            UIMenu.Menu.AddMenuItem("~b~Получить Cadilac Escalade", "", {doName: 'takeCAD2'});
            UIMenu.Menu.AddMenuItem("~b~Получить BMW X6M", "", {doName: 'takeBMW2'});
            UIMenu.Menu.AddMenuItem("~b~Получить Mercedes GLE", "", {doName: 'takeMERC2'});
        }

        UIMenu.Menu.AddMenuItem("Взаимодействовать с причёской", "", {doName: 'changeHair'});
        UIMenu.Menu.AddMenuItemList("Наушники", ['~r~Выкл', '~g~Вкл'], "", {doName: 'changeMusic'}, user.currentStation >= 0 ? 1 : 0);
        UIMenu.Menu.AddMenuItem("Предыдущая радиостанция", "", {doName: 'changeMusicPrev'});
        UIMenu.Menu.AddMenuItem("Следующая радиостанция", "", {doName: 'changeMusicNext'});

        //UIMenu.Menu.AddMenuItem("~b~Сменить имя", "Имя будет отображаться в организациях, в которой вы состоите", {doName: 'changeMusicNext'}, user.getCache('name_dating'));

        let list = [];
        let list2 = [];
        let clipsetIdx = 0;
        let clipsetWIdx = 0;

        if (user.getSex() === 1) {
            enums.clopsetFemale.forEach((item, idx) => {
                list.push(item[0]);
                if (user.getCache('clipset') === item[1])
                    clipsetIdx = idx;
            })
        }
        else {
            enums.clopsetMale.forEach((item, idx) => {
                list.push(item[0]);
                if (user.getCache('clipset') === item[1])
                    clipsetIdx = idx;
            })
        }

        enums.clipsetW.forEach((item, idx) => {
            list2.push(item[0]);
            if (user.getCache('clipsetw') === item[1])
                clipsetWIdx = idx;
        });

        UIMenu.Menu.AddMenuItemList("Походка", list, "", {doName: 'clipset'}, clipsetIdx);
        UIMenu.Menu.AddMenuItemList("Стиль стрельбы", list2, "", {doName: 'clipsetw'}, clipsetWIdx);

        UIMenu.Menu.AddMenuItem("Посмотреть документы", "", {doName: 'showPlayerDoсMenu'});
        UIMenu.Menu.AddMenuItem("Анимации", "", {doName: 'showAnimationTypeListMenu'});
        //UIMenu.Menu.AddMenuItem("~b~История персонажа").doName = 'showPlayerHistoryMenu';

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnList.Add((item, index) => {
            if (item.doName === 'clipset') {

                if (user.getSex() === 1) {
                    user.set('clipset', enums.clopsetFemale[index][1]);
                    user.setClipset(enums.clopsetFemale[index][1]);
                }
                else {
                    user.set('clipset', enums.clopsetMale[index][1]);
                    user.setClipset(enums.clopsetMale[index][1]);
                }
                mp.game.ui.notifications.show('~b~Настройки были сохранены');
            }
            if (item.doName === 'clipsetw') {
                user.set('clipsetw', enums.clipsetW[index][1]);
                user.setClipsetW(enums.clipsetW[index][1]);
                mp.game.ui.notifications.show('~b~Настройки были сохранены');
            }
            if (item.doName === 'changeMusic') {
                if (mp.players.local.getPropIndex(0) !== 15) {
                    mp.game.ui.notifications.show('~r~Для начала необходимо купить и надеть наушники');
                    return ;
                }
                user.playAnimation("clothingtie", "check_out_a", 48);
                setTimeout(function () {
                    if (index === 0) {
                        user.currentStation = -1;
                        mp.attachmentMngr.removeLocal('music');
                        mp.game.audio.setEmitterRadioStation("SE_Script_Placed_Prop_Emitter_Boombox", mp.game.audio.getRadioStationName(18));
                    }
                    {
                        user.currentStation = 0;
                        mp.attachmentMngr.addLocal('music');
                    }
                }, 2000);
            }
        });

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            if (item.doName == 'showPlayerStatsMenu')
                menuList.showPlayerStatsMenu();
            else if (item.doName == 'showAnimationTypeListMenu')
                menuList.showAnimationTypeListMenu();
            else if (item.doName == 'showPlayerHistoryMenu')
                mp.events.callRemote('server:user:showPlayerHistory');
            else if (item.doName == 'showPlayerDoсMenu')
                menuList.showPlayerDocMenu(mp.players.local.remoteId);
            else if (item.doName == 'takeBMW')
                mp.events.callRemote('server:cont:vehicle', 'bmw');
            else if (item.doName == 'takeAUDI')
                mp.events.callRemote('server:cont:vehicle', 'audi');
            else if (item.doName == 'takeMERC')
                mp.events.callRemote('server:cont:vehicle', 'merc');
            else if (item.doName == 'takeBMW2')
                mp.events.callRemote('server:cont:vehicle2', 'bmw');
            else if (item.doName == 'takeCAD2')
                mp.events.callRemote('server:cont:vehicle2', 'cad');
            else if (item.doName == 'takeMERC2')
                mp.events.callRemote('server:cont:vehicle2', 'merc');
            else if (item.doName == 'changeMusicPrev')
            {
                if (user.currentStation === -1)
                    return ;
                user.currentStation--;
                if (user.currentStation < 0)
                    user.currentStation = 18;
                user.playAnimation("clothingtie", "check_out_a", 48);
                setTimeout(function () {
                    mp.game.audio.setEmitterRadioStation("SE_Script_Placed_Prop_Emitter_Boombox", mp.game.audio.getRadioStationName(user.currentStation));
                }, 2000)
            }
            else if (item.doName == 'changeMusicNext')
            {
                if (user.currentStation === -1)
                    return ;
                user.currentStation++;
                if (user.currentStation > 18)
                    user.currentStation = 0;
                user.playAnimation("clothingtie", "check_out_a", 48);
                setTimeout(function () {
                    mp.game.audio.setEmitterRadioStation("SE_Script_Placed_Prop_Emitter_Boombox", mp.game.audio.getRadioStationName(user.currentStation));
                }, 2000)
            }
            else if (item.doName == 'changeHair')
            {
                if (mp.game.player.isFreeAiming()) {
                    return;
                }

                let allowIdx = -1;
                let drawId = mp.players.local.getDrawableVariation(2);
                let colorId = mp.players.local.getTextureVariation(2);

                if (user.getSex() == 1) {
                    enums.swtichFemaleHair.forEach((item, idx) => {
                        if (item[0] === drawId || item[1] === drawId)
                            allowIdx = idx;
                    });
                    if (allowIdx >= 0) {
                        let item = enums.swtichFemaleHair[allowIdx];
                        let newDraw = item[1];
                        if (item[1] === drawId) {
                            newDraw = item[0];
                        }
                        user.playAnimation("clothingtie", "check_out_a", 48);

                        setTimeout(function () {
                            user.setComponentVariation(2, newDraw, colorId);
                        }, 2000);
                    }
                    else {
                        mp.game.ui.notifications.show("~r~С этой прической нельзя взаимодействовать");
                    }
                }
                else {
                    enums.swtichMaleHair.forEach((item, idx) => {
                        if (item[0] === drawId || item[1] === drawId)
                            allowIdx = idx;
                    });
                    if (allowIdx >= 0) {
                        let item = enums.swtichMaleHair[allowIdx];
                        let newDraw = item[1];
                        if (item[1] === drawId) {
                            newDraw = item[0];
                        }
                        user.playAnimation("clothingtie", "check_out_a", 48);

                        setTimeout(function () {
                            user.setComponentVariation(2, newDraw, colorId);
                        }, 2000);
                    }
                    else {
                        mp.game.ui.notifications.show("~r~С этой прической нельзя взаимодействовать");
                    }
                }
            }
        });
        menuList.isShowPlayerMenu = true;
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showHelpMenu = function() {

    UIMenu.Menu.Create(`Справка`, `~b~Ответы на ваши вопросы`);

    let mItem = {};
    mItem.textTitle = 'С чего начать?';
    mItem.text = 'Рекомендуем выполнить вам начальный квест, который можно взять у npc на спавне, в нем вы получите минимальные знания и ресурсы.';

    UIMenu.Menu.AddMenuItem("С чего начать?", "", mItem);

    mItem = {};
    mItem.textTitle = 'Лицензии';
    mItem.text = 'Лицензии на вождение какого либо транспорта получаются в здании правительства. Лицензии на рыболовство/бизнес получаются исключительно у сотрудников правительства. Лицензию на оружие вы можете приобрести у сотрудников полицейского и шериф департамента.';
    UIMenu.Menu.AddMenuItem("Где получить все лицензии?", "", mItem);

    mItem = {};
    mItem.textTitle = 'Зарплатный счет';
    mItem.text = 'Зарплата приходит на ваш зарплатный счет, для этого необходимо открыть приложение вашего банка на телефоне и перевести нужную сумму денег на вашу карту.';
    UIMenu.Menu.AddMenuItem("Где моя зарплата?", "", mItem);

    mItem = {};
    mItem.textTitle = 'Система рабочего стажа.';
    mItem.text = 'Данная система предназначена для того, чтобы вы могли устраиваться в перспективе на работу получше. Она растет, если вы работаете.';
    UIMenu.Menu.AddMenuItem("Система рабочего стажа.", "", mItem);

    mItem = {};
    mItem.textTitle = 'Система репутации.';
    mItem.text = 'Не нарушайте закон, работайте на обычных работах и ваша репутация будет повышаться. Если будете нарушать закон, то соответственно понижаться. Благодаря репутации у вас есть выбор, идти в гос. организации или криминал.';
    UIMenu.Menu.AddMenuItem("Система репутации.", "", mItem);

    mItem = {};
    mItem.textTitle = 'Организация';
    mItem.text = 'Для вступления в организацию следите за новостями, лидеры и их замы частенько объявляют наборы с соответствующими критериями.';
    UIMenu.Menu.AddMenuItem("Как вступить в организацию?", "", mItem);

    mItem = {};
    mItem.textTitle = 'Криминальный путь';
    mItem.text = 'Для начала вам необходимо пройти квествовую линию у Ламара. Он стоит в гетто и отмечен на миникарте';
    UIMenu.Menu.AddMenuItem("С чего начать криминальный путь?", "", mItem);

    mItem = {};
    mItem.textTitle = 'Криминал';
    mItem.text = 'Весь криминал игроки создают сами, мы создали интересный конструктор, с минимальными ограничениями. И добавив к этому еще различные роды деятельности, от каптов до ограблений';
    UIMenu.Menu.AddMenuItem("Как работает криминал?", "", mItem);

    mItem = {};
    mItem.textTitle = 'Своя организация';
    mItem.text = 'Для начала вам необходимо иметь низкую репутацию, далее необходимо иметь достаточную сумму в BitCoins вы сможете создать свою организацию в консоли телефона через команду ecorp. Учтите, что слоты фракций на сервере ограничены';
    UIMenu.Menu.AddMenuItem("Как создать свою организацию?", "", mItem);
    
    /*mItem = UIMenu.Menu.AddMenuItem("Где мой прицел?");
    mItem.textTitle = 'Навык оружия';
    mItem.text = 'Для того, чтобы появился прицел, необходимо владеть 100% навыком оружия';*/

    mItem = {};
    mItem.textTitle = 'Навык оружия';
    mItem.text = 'Чтобы стрелять из транспорта, необходимо прокачать навык владения оружием на 100% или работать в полиции';
    UIMenu.Menu.AddMenuItem("Как стрелять из машины?", "", mItem);

    mItem = {};
    mItem.textTitle = 'Штрафстоянка';
    mItem.text = 'Ваш транспорт может попасть на штрафстоянку, поэтому паркуйтесь по правилам дорожного кодекса';
    UIMenu.Menu.AddMenuItem("Штрафстоянка", "", mItem);

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        if (item.textTitle) {
            UIMenu.Menu.HideMenu();
            ui.showDialog(item.text, item.textTitle);
        }
    });
};

menuList.showQuestMenu = function() {

    UIMenu.Menu.Create(`Задания`, `~b~Ваши квестовые линии`);

    quest.getQuestAllNames().forEach(item => {
        if (!quest.getQuestCanSee(item))
            return;
        UIMenu.Menu.AddMenuItem(quest.getQuestName(item), "", {qName: item}, '', '', user.getQuestCount(item) === quest.getQuestLineMax(item) ? 'star' : '');
    });

    UIMenu.Menu.AddMenuItem(`~b~Справка`, "", {ask: true});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.qName)
            menuList.showQuestListMenu(item.qName);
        if (item.ask)
            ui.showDialog('В случае, если квест не выполнился автоматически, приезжайте к боту, который выдает вам этот квест и завершите его там через кнопку получить задание');
    });
};

menuList.showQuestListMenu = function(name) {

    UIMenu.Menu.Create(`Задания`, `~b~${quest.getQuestName(name)}`);

    /*let mItem = UIMenu.Menu.AddMenuItem(`~g~Получить местоположение бота`);
    mItem.posX = quest.getQuestPos(name).x;
    mItem.posY = quest.getQuestPos(name).y;*/

    for (let i = 0; i < quest.getQuestLineMax(name); i++) {

        let idx = -1;
        if(user.getQuestCount(name) >= i)
            idx = i;
        UIMenu.Menu.AddMenuItem(`${user.getQuestCount(name) >= i ? '' : '~c~'}${quest.getQuestLineName(name, i)}`, '', {idx: idx}, '', '', user.getQuestCount(name) > i ? 'star' : '');
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {

        if (item.idx >= 0) {
            mp.game.ui.notifications.show(`~b~${quest.getQuestLineName(name, item.idx)}\n~s~${quest.getQuestLineInfo(name, item.idx)}\n~b~Награда: ~s~${quest.getQuestLinePrize(name, item.idx)}`);
        }
        if (item.posX) {
            user.setWaypoint(item.posX, item.posY);
        }
    });
};

menuList.showSettingsMenu = function() {

    UIMenu.Menu.Create(`Настройки`, `~b~Персональные настройки`);

    UIMenu.Menu.AddMenuItem("~y~Пофиксить кастомизацию", "", {doName: "fixCustom"});
    UIMenu.Menu.AddMenuItem("~y~Вкл. / Выкл. доп. прогрузку моделей", "~r~Возможно слегка повлияет на FPS", {doName: "loadAllModels"});

    UIMenu.Menu.AddMenuItem("Интерфейс", "", {doName: "showSettingsHudMenu"});
    UIMenu.Menu.AddMenuItem("Текстовый чат", "Настройка дизайна текстового чата", {doName: "showSettingsTextMenu"});
    UIMenu.Menu.AddMenuItem("Голосовой чат", "", {doName: "showSettingsVoiceMenu"});
    UIMenu.Menu.AddMenuItem("Дизайн меню", "Настройка дизайна меню", {doName: "showSettingsMenuMenu"});
    UIMenu.Menu.AddMenuItem("Назначение клавиш", "", {doName: "showSettingsKeyMenu"});

    //UIMenu.Menu.AddMenuItem("~r~Выйти с сервера", "Нажмите ~g~Enter~s~ чтобы применить").doName = 'exit';

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {

        if (item.doName == 'loadAllModels') {
            timer.allModelLoader();
        }
        if (item.doName == 'exit') {
            user.kick('Выход с сервера');
        }
        if (item.doName == 'fixCustom') {
            UIMenu.Menu.HideMenu();
            user.reset('hasMask');
            user.updateCharacterFace();
            if (user.getCache('jail_time')  < 1)
                user.updateCharacterCloth();
        }
        if (item.eventName) {
            UIMenu.Menu.HideMenu();
            mp.events.callRemote(item.eventName);
        }
        if (item.doName == 'showSettingsKeyMenu') {
            menuList.showSettingsKeyMenu();
        }
        if (item.doName == 'showSettingsVoiceMenu') {
            menuList.showSettingsVoiceMenu();
        }
        if (item.doName == 'showSettingsTextMenu') {
            menuList.showSettingsTextMenu();
        }
        if (item.doName == 'showSettingsMenuMenu') {
            menuList.showSettingsMenuMenu();
        }
        if (item.doName == 'showSettingsHudMenu') {
            menuList.showSettingsHudMenu();
        }
    });
};

menuList.showSettingsKeyMenu = function() {

    UIMenu.Menu.Create(`Настройки`, `~b~Настройки управления`);

    let menuItem = {doName: "s_bind_veh_menu"};
    UIMenu.Menu.AddMenuItem("Меню транспорта", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_player_menu"};
    UIMenu.Menu.AddMenuItem("Меню персонажа", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_inv"};
    UIMenu.Menu.AddMenuItem("Инвентарь", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_inv_world"};
    UIMenu.Menu.AddMenuItem("Предметы рядом", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_do"};
    UIMenu.Menu.AddMenuItem("Взаимодействие", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_phone"};
    UIMenu.Menu.AddMenuItem("Телефон", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_seat"};
    UIMenu.Menu.AddMenuItem("Сидеть", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_voice"};
    UIMenu.Menu.AddMenuItem("Голосовой чат", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_voice_reload"};
    UIMenu.Menu.AddMenuItem("Перезагрузить голосовой чат", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_voice_walkie"};
    UIMenu.Menu.AddMenuItem("Рация", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_voice_radio"};
    UIMenu.Menu.AddMenuItem("Говорить в рацию", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_stopanim"};
    UIMenu.Menu.AddMenuItem("Остановить анимацию", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_engine"};
    UIMenu.Menu.AddMenuItem("Запуск двигателя", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_lock"};
    UIMenu.Menu.AddMenuItem("Закрыть/открыть ТС", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_belt"};
    UIMenu.Menu.AddMenuItem("Пристегнуть ремень", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_firemod"};
    UIMenu.Menu.AddMenuItem("Режим стрельбы", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_fingerpoint"};
    UIMenu.Menu.AddMenuItem("Показывать пальцем", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_pnv"};
    UIMenu.Menu.AddMenuItem("Прибор ночного видения", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_cloth"};
    UIMenu.Menu.AddMenuItem("Надесть/Снять капюшон", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_cloth2"};
    UIMenu.Menu.AddMenuItem("Застегнуть/Расстегнуть куртку", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_megaphone"};
    UIMenu.Menu.AddMenuItem("Полицейский мегафон", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_helicam"};
    UIMenu.Menu.AddMenuItem("Режим камеры на вертолете", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_helicam_vision"};
    UIMenu.Menu.AddMenuItem("Эффект камеры на вертолете", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_helicam_lock"};
    UIMenu.Menu.AddMenuItem("Преследование ТС на вертолете", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_helilight"};
    UIMenu.Menu.AddMenuItem("Фонарь на вертолете", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_weapon_slot0"};
    UIMenu.Menu.AddMenuItem("Убрать оружие", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_weapon_slot1"};
    UIMenu.Menu.AddMenuItem("Взять основное оружие", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_weapon_slot2"};
    UIMenu.Menu.AddMenuItem("Взять дробовик", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_weapon_slot3"};
    UIMenu.Menu.AddMenuItem("Взять метательное оружие", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_weapon_slot4"};
    UIMenu.Menu.AddMenuItem("Взять пистолет", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_weapon_slot5"};
    UIMenu.Menu.AddMenuItem("Взять ручное оружие", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_animations_all"};
    UIMenu.Menu.AddMenuItem("Список всех анимаций", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_animations_0"};
    UIMenu.Menu.AddMenuItem("Анимации действий", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_animations_1"};
    UIMenu.Menu.AddMenuItem("Позирующие анимации", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_animations_2"};
    UIMenu.Menu.AddMenuItem("Анимации положительных эмоций", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_animations_3"};
    UIMenu.Menu.AddMenuItem("Анимации негативных эмоций", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_animations_4"};
    UIMenu.Menu.AddMenuItem("Анимации танцев", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_animations_5"};
    UIMenu.Menu.AddMenuItem("Анимации взаимодействия", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    menuItem = {doName: "s_bind_animations_6"};
    UIMenu.Menu.AddMenuItem("Остальные анимации", "Нажмите ~g~Enter~s~ чтобы изменить", menuItem, `~m~[${bind.getKeyName(user.getCache(menuItem.doName))}]`);

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnClose.Add((sender) =>
    {
        if (bind.isChange)
            bind.bindNewKey(0);
    });

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        if (item.doName === 'closeMenu') {
            if (bind.isChange)
                bind.bindNewKey(0);
        }
        else {
            mp.game.ui.notifications.show("~g~Нажмите на клавишу, которую хотите назначить");
            let keyCode = await bind.getChangeKey(item.doName);
            let keyLabel = bind.getKeyName(keyCode);
            //item.SetRightLabel(`~m~[${keyLabel}]`);
            mp.game.ui.notifications.show(`~g~Вы назначили клавишу ~s~${keyLabel}`);
            menuList.showSettingsKeyMenu();
        }
    });
};

menuList.showSettingsHudMenu = function() {

    UIMenu.Menu.Create(`Настройки`, `~b~Настройки интерфейса`);

    UIMenu.Menu.AddMenuItem("Позиция элементов интерфейса", "Нажмите ~g~ПКМ~s~ чтобы вернуть в исходное положение", {doName: "canEdit"});

    UIMenu.Menu.AddMenuItem("Показывать HUD (~g~Вкл~s~/~r~Выкл~s~)", "Чтобы включить худ, нажмите F2", {doName: "showRadar"});
    UIMenu.Menu.AddMenuItem("Показывать ID игроков (~g~Вкл~s~/~r~Выкл~s~)", "Нажмите ~g~Enter~s~ чтобы применить", {doName: "showId"});

    if (user.isAdmin())
        UIMenu.Menu.AddMenuItem("Показывать ID транспорта (~g~Вкл~s~/~r~Выкл~s~)", "Нажмите ~g~Enter~s~ чтобы применить", {doName: "showvId"});

    UIMenu.Menu.AddMenuItemList("Спидометр", ['Стандартный', 'Цифровой'], "", {doName: "speed"}, user.getCache('s_hud_speed') ? 1 : 0);

    UIMenu.Menu.AddMenuItemList("Скорость", ['MP/H', 'KM/H'], "", {doName: "speed_type"}, user.getCache('s_hud_speed_type') ? 1 : 0);

    UIMenu.Menu.AddMenuItemList("Температура", ['°C', '°F'], "", {doName: "temp"}, user.getCache('s_hud_temp') ? 1 : 0);

    UIMenu.Menu.AddMenuItemList("Взаимодействие", ['Стандартное', 'Над объектом'], "", {doName: "raycast"}, user.getCache('s_hud_raycast') ? 1 : 0);

    UIMenu.Menu.AddMenuItemList("Курсор в меню", ['Выкл', 'Вкл'], "", {doName: "crus"}, user.getCache('s_hud_cursor') ? 1 : 0);
    UIMenu.Menu.AddMenuItemList("Уведомления над картой", ['Выкл', 'Вкл'], "", {doName: "notify"}, user.getCache('s_hud_notify') ? 1 : 0);
    UIMenu.Menu.AddMenuItemList("Подсказка с квестами", ['Выкл', 'Вкл'], "", {doName: "quests"}, user.getCache('s_hud_quest') ? 1 : 0);

    UIMenu.Menu.AddMenuItemList("Авто. перезагрузка интерфейса", ['Выкл', 'Вкл'], "В случае если у вас он завис~br~или не работает", {doName: "restart"}, user.getCache('s_hud_restart') ? 1 : 0);

    let listVoiceVol = ["0%", "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"];
    UIMenu.Menu.AddMenuItemList("Прозрачность интерфейса", listVoiceVol, "", {doName: "bg"}, methods.parseInt(user.getCache('s_hud_bg') * 10));

    UIMenu.Menu.AddMenuItem("~y~Перезапустить интерфейс", 'В случае если у вас он завис~br~или не работает', {doName: "fixInterface"});
    UIMenu.Menu.AddMenuItem("~y~Установить настройки по умолчанию", "", {doName: "resetEdit"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnList.Add((item, index) => {
        if (item.doName === 'speed') {
            user.set('s_hud_speed', index === 1);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName === 'speed_type') {
            user.set('s_hud_speed_type', index === 1);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName === 'temp') {
            user.set('s_hud_temp', index === 1);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName === 'raycast') {
            user.set('s_hud_raycast', index === 1);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName === 'restart') {
            user.set('s_hud_restart', index === 1);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName === 'crus') {
            user.set('s_hud_cursor', index === 1);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');

            if (user.getCache('s_hud_cursor')) {
                mp.gui.cursor.show(false, true);
                ui.DisableMouseControl = true;
            }
            else {
                mp.gui.cursor.show(false, false);
                ui.DisableMouseControl = false;
            }
        }
        if (item.doName === 'notify') {
            user.set('s_hud_notify', index === 1);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName === 'quests') {
            user.set('s_hud_quest', index === 1);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName == 'bg') {
            let voiceVol = index / 10;
            user.set('s_hud_bg', voiceVol);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
    });
    UIMenu.Menu.OnSelect.Add((item, index) => {
        if (item.doName == 'showId') {
            mp.events.call('client:showId');
        }
        if (item.doName == 'showvId') {
            mp.events.call('client:showvId');
        }
        if (item.doName == 'showRadar') {
            ui.showOrHideRadar();
        }
        if (item.doName == 'canEdit') {
            ui.showOrHideEdit();
        }
        if (item.doName == 'resetEdit') {
            user.set('s_pos', '[]');
            ui.hideHud();
            setTimeout(function () {
                ui.showHud();
            }, 100);
        }
        if (item.doName == 'fixInterface') {
            ui.fixInterface();
        }
    });
};

menuList.showSettingsTextMenu = function() {

    UIMenu.Menu.Create(`Настройки`, `~b~Настройки чата`);

    let fontSizeList = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'];
    let lineSizeList = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'];
    let bgStateList = ['Выкл', 'Вкл', 'Всегда вкл'];
    let bgOpacity = ["0%", "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"];
    let timeoutList = ['1s', '3s', '5s', '10s', '15s', '20s', '30s', 'Никогда'];

    UIMenu.Menu.AddMenuItem("~y~Очистить чат", "", {doName: "clearChat"});

    UIMenu.Menu.AddMenuItemList("Шрифт", enums.fontList, "", {doName: "font"}, enums.fontList.indexOf(user.getCache('s_chat_font')));

    UIMenu.Menu.AddMenuItemList("Размер шрифта", fontSizeList, "", {doName: "fontSize"},fontSizeList.indexOf(user.getCache('s_chat_font_s').toString()));

    UIMenu.Menu.AddMenuItemList("Отступ текста", lineSizeList, "", {doName: "lineSize"}, lineSizeList.indexOf(user.getCache('s_chat_font_l').toString()));

    UIMenu.Menu.AddMenuItemList("Тип фона", bgStateList, "", {doName: "bgStyle"}, user.getCache('s_chat_bg_s'));

    UIMenu.Menu.AddMenuItemList("Прозрачность фона", bgOpacity, "", {doName: "bgOpacity"}, methods.parseInt(user.getCache('s_chat_bg_o') * 10));

    UIMenu.Menu.AddMenuItemList("Прозрачность чата", bgOpacity, "", {doName: "chatOpacity"}, methods.parseInt(user.getCache('s_chat_opacity') * 10));

    UIMenu.Menu.AddMenuItemList("Ширина", bgOpacity, "", {doName: "width"}, methods.parseInt(user.getCache('s_chat_width') / 10));

    UIMenu.Menu.AddMenuItemList("Высота", bgOpacity, "", {doName: "height"}, methods.parseInt(user.getCache('s_chat_height') / 10));

    UIMenu.Menu.AddMenuItemList("Закрыть по таймауту", timeoutList, "", {doName: "timeout"}, user.getCache('s_chat_timeout'));

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnList.Add(async (item, index) => {
        if (item.doName == 'font') {
            user.set('s_chat_font', enums.fontList[index]);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName == 'fontSize') {
            user.set('s_chat_font_s', fontSizeList[index]);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName == 'lineSize') {
            user.set('s_chat_font_l', lineSizeList[index]);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName == 'bgStyle') {
            user.set('s_chat_bg_s', index);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName == 'timeout') {
            user.set('s_chat_timeout', index);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName == 'width') {
            let num = index * 10;
            user.set('s_chat_width', num);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName == 'height') {
            let num = index * 10;
            user.set('s_chat_height', num);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName == 'bgOpacity') {
            let num = index / 10;
            user.set('s_chat_bg_o', num);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName == 'chatOpacity') {
            let num = index / 10;
            user.set('s_chat_opacity', num);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        chat.show(false);
        chat.updateSettings();
        setTimeout(function () {
            chat.show(true);
        }, 200);
    });

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        if (item.doName == 'clearChat')
            user.clearChat();
    });
};

menuList.showSettingsMenuMenu = function() {

    UIMenu.Menu.Create(`Настройки`, `~b~Настройки меню`);

    let bgOpacity = ["0%", "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"];
    let width = [];
    let border = [];
    for (let i = 0; i <= 30; i++)
        border.push(`${i}px`);
    for (let i = 0; i <= 20; i++)
        width.push(`${350 + (i * 10)}px`);

    UIMenu.Menu.AddMenuItemList("Шрифт", enums.fontList, "", {doName: "font"}, enums.fontList.indexOf(user.getCache('s_menu_font')));
    //UIMenu.Menu.AddMenuItemList("Прозрачность фона", bgOpacity, "", {doName: "bgOpacity"}, methods.parseInt(user.getCache('s_menu_opacity') * 10));
    //UIMenu.Menu.AddMenuItemList("Цвет фона", enums.rgbNamesB, "", {doName: "bgColor"}, methods.parseInt(user.getCache('s_menu_color')));
    UIMenu.Menu.AddMenuItemList("Ширина", width, "", {doName: "width"}, methods.parseInt((user.getCache('s_menu_width') - 350) / 10));
    //UIMenu.Menu.AddMenuItemList("Максимальная высота", bgOpacity, "", {doName: "height"}, methods.parseInt(user.getCache('s_chat_height') / 10));
    //UIMenu.Menu.AddMenuItemList("Закругление краёв", border, "", {doName: "border"}, methods.parseInt(user.getCache('s_menu_border')));
    UIMenu.Menu.AddMenuItemList("Звук", ['Выкл', 'Вкл'], "", {doName: "sound"}, user.getCache('s_menu_sound'));

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnList.Add(async (item, index) => {
        if (item.doName == 'sound') {
            user.set('s_menu_sound', index);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName == 'font') {
            user.set('s_menu_font', enums.fontList[index]);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName == 'bgOpacity') {
            let num = index / 10;
            user.set('s_menu_opacity', num);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName == 'bgColor') {
            user.set('s_menu_color', index);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName == 'width') {
            user.set('s_menu_width', 350 + index * 10);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        if (item.doName == 'border') {
            user.set('s_menu_border', index);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
        ui.updateMenuSettings();

        if (item.doName == 'font')
            menuList.showSettingsMenuMenu();
    });
};

menuList.showSettingsVoiceMenu = function() {

    UIMenu.Menu.Create(`Настройки`, `~b~Настройки голосового чата`);

    //let listVoiceType = ["Шепот", "Нормально", "Крик"];
    //let listVoice3d = ["Вкл", "Выкл"];
    let listVoiceVol = ["0%", "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"];

    //UIMenu.Menu.AddMenuItemList("Тип голосового чата", listVoiceType, "Нажмите ~g~Enter~s~ чтобы применить").doName = '';
    //UIMenu.Menu.AddMenuItemList("Объем голосового чата", listVoice3d, "Нажмите ~g~Enter~s~ чтобы применить").doName = '';

    UIMenu.Menu.AddMenuItemList("Громкость голосового чата", listVoiceVol, "", {doName: "vol"}, methods.parseInt(user.getCache('s_voice_vol') * 10));
    
    UIMenu.Menu.AddMenuItem("~y~Перезагрузить голосовой чат (#1)", "Нажмите ~g~Enter~s~ чтобы применить", {doName: "restartVoice1"});
    UIMenu.Menu.AddMenuItem("~y~Перезагрузить голосовой чат (#2)", "Нажмите ~g~Enter~s~ чтобы применить", {doName: "restartVoice2"});
    UIMenu.Menu.AddMenuItem("~y~Перезагрузить голосовой чат (#3)", "Нажмите ~g~Enter~s~ чтобы применить", {doName: "restartVoice3"});
    UIMenu.Menu.AddMenuItem("~y~Перезагрузить голосовой чат (Полная)", "Нажмите ~g~Enter~s~ чтобы применить", {doName: "restartVoice4"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    let voiceVol = 1;
    UIMenu.Menu.OnList.Add(async (item, index) => {
        if (item.doName == 'vol') {
            voiceVol = index / 10;

            user.set('s_voice_vol', voiceVol);
            mp.game.ui.notifications.show('~b~Настройки были сохранены');
        }
    });

    UIMenu.Menu.OnSelect.Add(async (item, index) => {

        if (item.doName == 'restartVoice1') {
            mp.voiceChat.cleanupAndReload(true, false, false);
            mp.game.ui.notifications.show('~b~Голосовой чат был перезагружен');
        }
        if (item.doName == 'restartVoice2') {
            mp.voiceChat.cleanupAndReload(false, true, false);
            mp.game.ui.notifications.show('~b~Голосовой чат был перезагружен');
        }
        if (item.doName == 'restartVoice3') {
            mp.voiceChat.cleanupAndReload(false, false, true);
            mp.game.ui.notifications.show('~b~Голосовой чат был перезагружен');
        }
        if (item.doName == 'restartVoice4') {
            mp.voiceChat.cleanupAndReload(true, true, true);
            mp.game.ui.notifications.show('~b~Голосовой чат был перезагружен');
        }
        if (item.eventName) {
            UIMenu.Menu.HideMenu();
            mp.events.callRemote(item.eventName);
        }
    });
};

menuList.showPlayerDoMenu = function(playerId) {

    let target = mp.players.atRemoteId(playerId);

    if (!mp.players.exists(target)) {
        mp.game.ui.notifications.show("~g~Ошибка взаимодействия с игроком");
        return;
    }

    UIMenu.Menu.Create(`ID: ${playerId}`, `~b~Взаимодействие с ID: ${playerId}`);

    UIMenu.Menu.AddMenuItem("Передать деньги", "", {doName: "giveMoney"});
    UIMenu.Menu.AddMenuItem("Познакомиться", "", {doName: "dating"});
    if (user.isPolice() || user.isGov() || user.isCartel()) {
        UIMenu.Menu.AddMenuItem("Надеть наручники", "", {eventName: "server:user:cuffItemById"});
        UIMenu.Menu.AddMenuItem("Снять наручники", "", {eventName: "server:user:unCuffById"});
    }
    UIMenu.Menu.AddMenuItem("Снять стяжки", "", {eventName: "server:user:unTieById"});

    UIMenu.Menu.AddMenuItem("Вырубить", "После того, как вы выруите человека, вы сможете его похитить и продать через команду ~b~ecorp -user -getpos~s~, получив выручку в ~g~50%~s~ от его наличного счета, но не более ~g~$50.000~s~ или ограбить на месте через кнопку ~y~Ограбить~s~, но при этом вы получите всего ~g~5%~s~ от наличного счета, но не более ~g~$25.000", {eventName: "server:user:knockById"});

    UIMenu.Menu.AddMenuItem("~y~Ограбить", "Вы получите ~g~5%~s~ от наличного счета, но не более ~g~$25.000", {eventName: "server:user:grabById"});

    UIMenu.Menu.AddMenuItem("Затащить в ближайшее авто", "", {eventName: "server:user:inCarById"});
    //UIMenu.Menu.AddMenuItem("Вытащить из тс").eventName = 'server:user:removeCarById';
    UIMenu.Menu.AddMenuItem("Вести за собой", "", {eventName: "server:user:taskFollowById"});
    UIMenu.Menu.AddMenuItem("Снять маску с игрока", '', {eventName: 'server:user:taskRemoveMaskById'});

    //UIMenu.Menu.AddMenuItem("Обыск игрока", "", {eventName: "server:user:getInvById"});

    if (user.isPolice()) {
        UIMenu.Menu.AddMenuItem("Изъять конфискат", "", {eventName: "server:user:getInvById"});
        UIMenu.Menu.AddMenuItem("Обыскать", "", {eventName: "server:user:getInvById2"});
        UIMenu.Menu.AddMenuItem("Установить личность", "", {eventName: "server:user:getPassById"});
    }

    UIMenu.Menu.AddMenuItem("~b~Документы", "", {doName: "showPlayerDoсMenu"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();

        if (ui.isGreenZone()) {
            if (item.eventName === 'server:user:knockById') {
                mp.game.ui.notifications.show("~r~В Зелёной зоне данное действие запрещено");
                return;
            }
        }
        /*if (ui.isYellowZone()) {
            if (item.eventName === 'server:user:knockById') {
                mp.game.ui.notifications.show("~r~Днём, в городах данное действие запрещено (Только в гетто и за городом)");
                return;
            }
        }*/

        if (item.doName == 'giveMoney') {
            let money = methods.parseFloat(await UIMenu.Menu.GetUserInput("Сумма", "", 9));
            if (money <= 0) {
                mp.game.ui.notifications.show("~r~Нельзя передавать меньше 0$");
                return;
            }
            mp.events.callRemote('server:user:giveMoneyToPlayerId', playerId, money);
        }
        else if (item.doName == 'dating') {
            let rpName = user.getCache('name').split(' ');
            let name = await UIMenu.Menu.GetUserInput("Как вы себя представите?", rpName[0], 30);
            if (name == '') return;
            name = name.replace(/[^a-zA-Z\s]/ig, '');
            if (name.trim() == '') {
                mp.game.ui.notifications.show("~r~Доступны только английские буквы");
                return;
            }
            mp.events.callRemote('server:user:askDatingToPlayerId', playerId, name);
        }
        else if (item.doName == 'showPlayerDoсMenu')
            menuList.showPlayerDocMenu(playerId);
        else if (item.eventName)
            mp.events.callRemote(item.eventName, playerId);
    });
};

menuList.showVehicleDoInvMenu = async function(vehId, onlyLock = false) {

    let vehicle = mp.vehicles.atRemoteId(vehId);

    if (!mp.vehicles.exists(vehicle)) {
        mp.game.ui.notifications.show("~g~Ошибка взаимодействия с транспортом");
        return;
    }
    
    let vInfo = methods.getVehicleInfo(vehicle.model);

    UIMenu.Menu.Create(`Транспорт`, `~b~Взаимодействие с транспортом`);

    UIMenu.Menu.AddMenuItem("~g~Открыть~s~/~r~Закрыть~s~ транспорт", "", {doName: "openVeh"});

    if (!onlyLock) {
        if (vInfo.stock > 0) {
            UIMenu.Menu.AddMenuItem("Открыть багажник", "", {doName: "openInv"});
            UIMenu.Menu.AddMenuItem("Закрыть багажник", "", {doName: "close"});

            UIMenu.Menu.AddMenuItem("Открыть капот", "", {doName: "openC"});
            UIMenu.Menu.AddMenuItem("Закрыть капот", "", {doName: "closeC"});
        }

        UIMenu.Menu.AddMenuItem("~y~Выкинуть человека", "", {doName: "eject"});

        if (vehicle.getVariable('fraction_id') === 7 && user.isNews()) {
            UIMenu.Menu.AddMenuItem("~g~Взять камеру", "", {doName: "takeCam"});
            UIMenu.Menu.AddMenuItem("~y~Положить камеру", "", {doName: "putCam"});

            UIMenu.Menu.AddMenuItem("~g~Взять микрофон", "", {doName: "takeMic"});
            UIMenu.Menu.AddMenuItem("~y~Положить микрофон", "", {doName: "putMic"});
        }
        if (vehicle.getVariable('fraction_id') === 2 && user.isSapd() && vInfo.display_name === 'Riot') {
            UIMenu.Menu.AddMenuItem("~g~Войти в режим дрона", "", {doName: "drone"});
        }
        if (vehicle.getVariable('fraction_id') === 5 && user.isSheriff() && vInfo.display_name === 'Insurgent2') {
            UIMenu.Menu.AddMenuItem("~g~Войти в режим дрона", "", {doName: "drone"});
        }
        if (vehicle.getVariable('fraction_id') === 3 && user.isFib() && vInfo.display_name === 'FBI2') {
            UIMenu.Menu.AddMenuItem("~g~Войти в режим дрона", "", {doName: "drone"});
        }
        if (vehicle.getVariable('fraction_id') === 7 && user.isNews() && (vInfo.display_name === 'Rumpo' || vInfo.display_name === 'Nspeedo')) {
            UIMenu.Menu.AddMenuItem("~g~Войти в режим дрона", "", {doName: "drone2"});
        }

        if (user.getCache('job') == vehicle.getVariable('jobId')) {
            switch (vehicle.getVariable('jobId')) {
                case 1:
                    UIMenu.Menu.AddMenuItem("~b~Инструменты (Красный маркер)", "", {doName: "tree:take0"});
                    UIMenu.Menu.AddMenuItem("~b~Инструменты (Зеленый маркер)", "", {doName: "tree:take1"});
                    UIMenu.Menu.AddMenuItem("~b~Инструменты (Синий маркер)", "", {doName: "tree:take2"});
                    break;
                case 2:
                    UIMenu.Menu.AddMenuItem("~b~Инструменты (Красный маркер)", "", {doName: "builder:take0"});
                    UIMenu.Menu.AddMenuItem("~b~Инструменты (Зеленый маркер)", "", {doName: "builder:take1"});
                    UIMenu.Menu.AddMenuItem("~b~Инструменты (Синий маркер)", "", {doName: "builder:take2"});
                    break;
                case 3:
                    UIMenu.Menu.AddMenuItem("~g~Напомнить задание", "", {doName: "photo:ask"});
                    break;
                case 4:
                    UIMenu.Menu.AddMenuItem("~g~Взять почту из транспорта", "", {doName: "mail:take"});
                    break;
            }
        }


        try {
            if (mp.players.local.dimension > enums.offsets.stock) {
                let stockId = mp.players.local.dimension - enums.offsets.stock;
                let stockData = await stocks.getData(stockId);
                if (stockData.get('upgrade_n')) {
                    UIMenu.Menu.AddMenuItem("~y~Снять номера с транспорта", "Стоимость ~g~$10.000~s~~br~~y~Номера снимаются до респавна транспорта", {doName: "removeNumber"});
                }
            }
        }
        catch (e) {
            methods.debug(e);
        }
    }
    UIMenu.Menu.AddMenuItem("Перевернуть транспорт", "", {doName: "flip"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName == 'openVeh') {
            mp.events.callRemote('server:vehicle:lockStatus');
        }
        if (item.doName == 'takeCam') {
            mp.attachmentMngr.addLocal('cam');
            user.playAnimation('missfinale_c2mcs_1', 'fin_c2_mcs_1_camman', 49);
        }
        if (item.doName == 'putCam') {
            mp.attachmentMngr.removeLocal('cam');
            user.stopAllAnimation();
        }
        if (item.doName == 'takeMic') {
            mp.attachmentMngr.addLocal('mic');
        }
        if (item.doName == 'putMic') {
            mp.attachmentMngr.removeLocal('mic');
            user.stopAllAnimation();
        }
        if (item.doName == 'drone') {
            drone.enterLspd(vehicle.remoteId);
        }
        if (item.doName == 'drone2') {
            drone.enterSmall(vehicle.remoteId);
        }
        if (item.doName == 'photo:ask')
            photo.ask();
        else if (item.doName == 'mail:take')
            mail.takeMail();
        else if (item.doName == 'tree:take0')
            tree.take(0);
        else if (item.doName == 'tree:take1')
            tree.take(1);
        else if (item.doName == 'tree:take2')
            tree.take(2);
        else if (item.doName == 'builder:take0')
            builder.take(0);
        else if (item.doName == 'builder:take1')
            builder.take(1);
        else if (item.doName == 'builder:take2')
            builder.take(2);
        else if (item.doName == 'flip') {
            if (!mp.players.local.isInAnyVehicle(true))
                mp.events.callRemote('server:flipNearstVehicle');
        }
        if (item.doName == 'openInv') {

            if (ui.isGreenZone() && !user.isPolice()) {
                mp.game.ui.notifications.show("~r~В зелёной зоне это действие запрещено");
                return;
            }

            if (mp.players.local.vehicle) {
                mp.game.ui.notifications.show("~r~Это действие не доступно");
                return;
            }

            if (methods.distanceToPos(vehicle.position, mp.players.local.position) > 5) {
                mp.game.ui.notifications.show("~r~Вы слишком далеко");
                return;
            }

            inventory.getItemList(inventory.types.Vehicle, mp.game.joaat(vehicles.getNumberPlate(vehicle).trim()));
            vehicles.setTrunkStateById(vehicle.remoteId, true);
        }
        if (item.doName == 'openC') {
            vehicles.setHoodStateById(vehicle.remoteId, true);
        }
        if (item.doName == 'closeC') {
            vehicles.setHoodStateById(vehicle.remoteId, false);
        }
        if (item.doName == 'eject') {

            if (methods.distanceToPos(vehicle.position, mp.players.local.position) > 5) {
                mp.game.ui.notifications.show("~r~Вы слишком далеко");
                return;
            }

            let id = methods.parseInt(await UIMenu.Menu.GetUserInput("ID Игрока", "", 3));
            if (id < 0) {
                mp.game.ui.notifications.show('~r~ID не может быть меньше 0');
                return;
            }
            if (methods.parseInt(id) === mp.players.local.remoteId) {
                mp.game.ui.notifications.show('~r~Дядь, себя нельзя никак выкинуть из ТС');
                return;
            }
            mp.events.callRemote('server:vehicle:ejectByIdOut', methods.parseInt(vehicle.remoteId), methods.parseInt(id));
        }
        else if (item.doName == 'close') {
            vehicles.setTrunkStateById(vehicle.remoteId, false);
        }
        else if (item.doName == 'removeNumber') {
            mp.events.callRemote('server:vehicle:removeNumber', methods.parseInt(vehicle.remoteId));
        }
    });
};

menuList.showVehicleDoSellMenu = async function(vehId) {

    let vehicle = mp.vehicles.atRemoteId(vehId);

    if (!mp.vehicles.exists(vehicle)) {
        mp.game.ui.notifications.show("~g~Ошибка взаимодействия с транспортом");
        return;
    }

    let vInfo = methods.getVehicleInfo(vehicle.model);
    let vData = await vehicles.getData(vehicle.getVariable('container'));

    UIMenu.Menu.Create(`Транспорт`, `~b~Информация о транспорте`);
    UIMenu.Menu.AddMenuItem(`~g~Купить по цене ${methods.moneyFormat(vData.get('sell_price'))}`, "", {doName: 'buy'});
    UIMenu.Menu.AddMenuItem(`Владелец ${vData.get('user_name')}`, "", {});
    UIMenu.Menu.AddMenuItem(`Пробег ${methods.parseFloat(vData.get('s_km')).toFixed(2)}км`, "", {});
    UIMenu.Menu.AddMenuItem("Характеристики", "", {doName: "stats"});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'stats')
            menuList.showVehicleStatsMenu(vehicle);
        if (item.doName === 'buy')
            menuList.showVehicleDoSellAcceptMenu(vehicle);
    });
};

menuList.showVehicleDoSellAcceptMenu = async function(vehicle) {
    if (!mp.vehicles.exists(vehicle)) {
        mp.game.ui.notifications.show("~g~Ошибка взаимодействия с транспортом");
        return;
    }

    let vInfo = methods.getVehicleInfo(vehicle.model);
    let vData = await vehicles.getData(vehicle.getVariable('container'));

    UIMenu.Menu.Create(`Транспорт`, `~b~Покупка`);
    UIMenu.Menu.AddMenuItem(`~g~Купить по цене ${methods.moneyFormat(vData.get('sell_price'))} (Наличка)`, "", {doName: 'buyc'});
    UIMenu.Menu.AddMenuItem(`~g~Купить по цене ${methods.moneyFormat(vData.get('sell_price'))} (Карта)`, "", {doName: 'buyb'});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'buyc')
            mp.events.callRemote('server:car:buyBot', vehicle.remoteId, vehicle.getVariable('container'), 0);
        if (item.doName === 'buyb')
            mp.events.callRemote('server:car:buyBot', vehicle.remoteId, vehicle.getVariable('container'), 1);
    });
};

menuList.showPlayerDocMenu = function(playerId) {

    let target = mp.players.atRemoteId(playerId);

    if (!mp.players.exists(target)) {
        mp.game.ui.notifications.show("~g~Ошибка взаимодействия с игроком");
        return;
    }

    UIMenu.Menu.Create(`Персонаж`, `~b~Документы`);

    UIMenu.Menu.AddMenuItem("Card ID", "~c~Это что-то типо паспорта~br~только в Америке", {doName: "card_id"});

    UIMenu.Menu.AddMenuItem("Work ID", "~c~Это ваше разрешение на работу", {doName: "work_lic"});

    if (user.isGov() || user.isSheriff() || user.isEms() || user.isSapd() || user.isFib() || user.isUsmc() || user.isNews())
        UIMenu.Menu.AddMenuItem("Удостоверение", "", {doName: "gos_lic"});

    UIMenu.Menu.AddMenuItem("Мед. страховка", "~c~Эта штука нужна для того~br~чтобы лечение было дешевле", {doName: "med_lic"});

    UIMenu.Menu.AddMenuItem("Лицензия категории `А`", "~c~Лицензия на мотоциклы", {doName: "a_lic"});

    UIMenu.Menu.AddMenuItem("Лицензия категории `B`", "~c~Лицензия на обычный ТС", {doName: "b_lic"});

    UIMenu.Menu.AddMenuItem("Лицензия категории `C`", "~c~Лицензия на большие машинки", {doName: "c_lic"});

    UIMenu.Menu.AddMenuItem("Лицензия на авиатранспорт", "", {doName: "air_lic"});

    UIMenu.Menu.AddMenuItem("Лицензия на водный транспорт", "", {doName: "ship_lic"});

    UIMenu.Menu.AddMenuItem("Лицензия на оружие", "", {doName: "gun_lic"});

    UIMenu.Menu.AddMenuItem("Лицензия на перевозку пассажиров", "~c~Нужно для таксистов и~br~водителей автобуса", {doName: "taxi_lic"});

    UIMenu.Menu.AddMenuItem("Лицензия юриста", "", {doName: "law_lic"});

    UIMenu.Menu.AddMenuItem("Лицензия на предпринимательство", "~c~Чтобы можно было иметь бизнес", {doName: "biz_lic"});

    UIMenu.Menu.AddMenuItem("Разрешение на рыболовство", "~c~Можно рыбачить, как-бы", {doName: "fish_lic"});

    UIMenu.Menu.AddMenuItem("Разрешение на употребление марихуаны", "~c~Можно употреблять, как-бы", {doName: "marg_lic"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName == "gos_lic")
            mp.events.callRemote('server:user:showLicGos', playerId);
        else if (item.doName)
            mp.events.callRemote('server:user:showLic', item.doName, playerId);
    });
};

menuList.showPlayerStatsMenu = function() {

    UIMenu.Menu.Create(`Персонаж`, `~b~${user.getCache('name')}`);

    UIMenu.Menu.AddMenuItem("~b~Имя:", "", {}, `${user.getCache('name')}`);
    UIMenu.Menu.AddMenuItem("~b~Дата рождения:", "", {}, `${user.getCache('age')}`);
    //UIMenu.Menu.AddMenuItem("~b~Работа:", "", {}, `${user.get('fraction_id') > 0 ? methods.getFractionName(user.get('fraction_id')) : methods.getJobName(user.get('job'))}`);
    UIMenu.Menu.AddMenuItem("~b~Вид на жительство:", "", {}, `${user.getRegStatusName()}`);
    UIMenu.Menu.AddMenuItem("~b~Репутация:", "", {}, `${user.getRepColorName()}`);
    if (user.getCache('bank_card') > 0)
        UIMenu.Menu.AddMenuItem("~b~Банковская карта:", "", {}, `${methods.bankFormat(user.getCache('bank_card'))}`);
    if (user.getCache('phone') > 0)
        UIMenu.Menu.AddMenuItem("~b~Мобильный телефон:", "", {}, `${methods.phoneFormat(user.getCache('phone'))}`);

    UIMenu.Menu.AddMenuItem("~b~Вы играли:~r~", "", {}, `${methods.parseFloat(user.getCache('online_time') * 8.5 / 60).toFixed(1)}ч.`);
    UIMenu.Menu.AddMenuItem("~b~Вы играли сегодня:~r~", "", {}, `${methods.parseFloat(user.getCache('online_cont') * 8.5 / 60).toFixed(1)}ч.`);
    UIMenu.Menu.AddMenuItem("~b~Вы играли (Конкурс):~r~", "", {}, `${methods.parseFloat(user.getCache('online_contall') * 8.5 / 60).toFixed(1)}ч.`);

    if (user.getCache('vip_type') === 1)
        UIMenu.Menu.AddMenuItem("~b~VIP:", "", {}, `LIGHT`);
    else if (user.getCache('vip_type') === 2)
        UIMenu.Menu.AddMenuItem("~b~VIP:", "", {}, `HARD`);
    else
        UIMenu.Menu.AddMenuItem("~b~VIP:~r~", "", {}, `Отсутствует`);

    UIMenu.Menu.AddMenuItem("~b~Розыск:", "", {}, `${user.getCache('wanted_level') > 0 ? '~r~В розыске' : '~g~Нет'}`);
    UIMenu.Menu.AddMenuItem("~b~Предупреждений:", "", {}, `${user.getCache('warns')}`);
    //UIMenu.Menu.AddMenuItem("~b~Рецепт марихуаны:", "", {}, `${user.get('allow_marg') ? 'Есть' : '~r~Нет'}`);

    let label = '';
    if (user.getCache('a_lic'))
        label = `Действует с ~b~${user.getCache('a_lic_create')}~s~ по ~b~${user.getCache('a_lic_end')}`;
    UIMenu.Menu.AddMenuItem("~b~Лицензия категории `А`:", label, {}, `${user.getCache('a_lic') ? 'Есть' : '~r~Нет'}`);

    label = '';
    if (user.getCache('b_lic'))
        label = `Действует с ~b~${user.getCache('b_lic_create')}~s~ по ~b~${user.getCache('b_lic_end')}`;
    UIMenu.Menu.AddMenuItem("~b~Лицензия категории `B`:", label, {}, `${user.getCache('b_lic') ? 'Есть' : '~r~Нет'}`);

    label = '';
    if (user.getCache('c_lic'))
        label = `Действует с ~b~${user.getCache('c_lic_create')}~s~ по ~b~${user.getCache('c_lic_end')}`;
    UIMenu.Menu.AddMenuItem("~b~Лицензия категории `C`:", label, {}, `${user.getCache('c_lic') ? 'Есть' : '~r~Нет'}`);

    label = '';
    if (user.getCache('air_lic'))
        label = `Действует с ~b~${user.getCache('air_lic_create')}~s~ по ~b~${user.getCache('air_lic_end')}`;
    UIMenu.Menu.AddMenuItem("~b~Лицензия на авиатранспорт:", label, {}, `${user.getCache('air_lic') ? 'Есть' : '~r~Нет'}`);

    label = '';
    if (user.getCache('ship_lic'))
        label = `Действует с ~b~${user.getCache('ship_lic_create')}~s~ по ~b~${user.getCache('ship_lic_end')}`;
    UIMenu.Menu.AddMenuItem("~b~Лицензия на водный транспорт:", label, {}, `${user.getCache('ship_lic') ? 'Есть' : '~r~Нет'}`);

    label = '';
    if (user.getCache('gun_lic'))
        label = `Действует с ~b~${user.getCache('gun_lic_create')}~s~ по ~b~${user.getCache('gun_lic_end')}`;
    UIMenu.Menu.AddMenuItem("~b~Лицензия на оружие:", label, {}, `${user.getCache('gun_lic') ? 'Есть' : '~r~Нет'}`);

    label = '';
    if (user.getCache('taxi_lic'))
        label = `Действует с ~b~${user.getCache('taxi_lic_create')}~s~ по ~b~${user.getCache('taxi_lic_end')}`;
    UIMenu.Menu.AddMenuItem("~b~Лицензия на перевозку пассажиров:", label, {}, `${user.getCache('taxi_lic') ? 'Есть' : '~r~Нет'}`);

    label = '';
    if (user.getCache('law_lic'))
        label = `Действует с ~b~${user.getCache('law_lic_create')}~s~ по ~b~${user.getCache('law_lic_end')}`;
    UIMenu.Menu.AddMenuItem("~b~Лицензия юриста:", label, {}, `${user.getCache('law_lic') ? 'Есть' : '~r~Нет'}`);

    label = '';
    if (user.getCache('biz_lic'))
        label = `Действует с ~b~${user.getCache('biz_lic_create')}~s~ по ~b~${user.getCache('biz_lic_end')}`;
    UIMenu.Menu.AddMenuItem("~b~Лицензия на предпринимательство:", label, {}, `${user.getCache('biz_lic') ? 'Есть' : '~r~Нет'}`);

    label = '';
    if (user.getCache('fish_lic'))
        label = `Действует с ~b~${user.getCache('fish_lic_create')}~s~ по ~b~${user.getCache('fish_lic_end')}`;
    UIMenu.Menu.AddMenuItem("~b~Разрешение на рыболовство:", label, {}, `${user.getCache('fish_lic') ? 'Есть' : '~r~Нет'}`);

    label = '';
    if (user.getCache('med_lic'))
        label = `Действует с ~b~${user.getCache('med_lic_create')}~s~ по ~b~${user.getCache('med_lic_end')}`;
    UIMenu.Menu.AddMenuItem("~b~Мед. страховка:", label, {}, `${user.getCache('med_lic') ? 'Есть' : '~r~Нет'}`);

    UIMenu.Menu.AddMenuItem("~b~Выносливость:", "", {}, `${user.getCache('stats_endurance') + 1}%`);
    UIMenu.Menu.AddMenuItem("~b~Сила:", "", {}, `${user.getCache('stats_strength') + 1}%`);
    UIMenu.Menu.AddMenuItem("~b~Объем легких:", "", {}, `${user.getCache('stats_lung_capacity') + 1}%`);
    UIMenu.Menu.AddMenuItem("~b~Навык водителя:", "", {}, `${user.getCache('stats_driving') + 1}%`);
    UIMenu.Menu.AddMenuItem("~b~Навык пилота:", "", {}, `${user.getCache('stats_flying') + 1}%`);
    UIMenu.Menu.AddMenuItem("~b~Навык стрельбы:", "", {}, `${user.getCache('stats_shooting') + 1}%`);
    UIMenu.Menu.AddMenuItem("~b~Удача:", "", {}, `${user.getCache('stats_lucky') + 1}%`);
    //UIMenu.Menu.AddMenuItem("~b~Психика:", "", {}, `${user.getCache('stats_psychics') + 1}%`);

    UIMenu.Menu.AddMenuItem("~b~Work ID:", "", {}, `${user.getCache('work_lic') != '' ? user.getCache('work_lic') : '~r~Нет'}`);
    UIMenu.Menu.AddMenuItem("~b~Уровень рабочего:", "", {}, `${user.getCache('work_lvl')}`);
    UIMenu.Menu.AddMenuItem("~b~Опыт рабочего:", "", {}, `${user.getCache('work_exp')}/${user.getCache('work_lvl') * 500}`);


    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();
};

menuList.showPlayerDatingAskMenu = function(playerId, name) {

    let player = mp.players.atRemoteId(playerId);

    if (mp.players.exists(player)) {
        UIMenu.Menu.Create(`Знакомства`, `~b~${player.remoteId} хочет познакомиться`);

        UIMenu.Menu.AddMenuItem('~g~Принять знакомство', "", {doName: "yes"});
        UIMenu.Menu.AddMenuItem("~r~Отказать", "", {doName: "closeMenu"});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            UIMenu.Menu.HideMenu();
            if (item.doName === 'yes') {
                let rpName = user.getCache('name').split(' ');
                let nameAnswer = await UIMenu.Menu.GetUserInput("Как вы себя представите?", rpName[0], 30);
                if (nameAnswer == '') return;
                nameAnswer = nameAnswer.replace(/[^a-zA-Z\s]/ig, '');
                if (nameAnswer == '' || nameAnswer == ' ') {
                    mp.game.ui.notifications.show("~r~Доступны только английские буквы");
                    return;
                }
                mp.events.callRemote('server:user:askDatingToPlayerIdYes', playerId, name, nameAnswer);
                user.playAnimationWithUser(player.remoteId, 0);
            }
        });
    }
};

menuList.showPlayerDiceAskMenu = function(playerId, sum) {

    let player = mp.players.atRemoteId(playerId);

    if (mp.players.exists(player)) {
        UIMenu.Menu.Create(`Кости`, `~b~${player.remoteId} хочет поиграть в кости`);

        UIMenu.Menu.AddMenuItem('Ставка: ~g~' + methods.moneyFormat(sum));
        UIMenu.Menu.AddMenuItem('~g~Принять ставку ', "", {doName: "yes"});
        UIMenu.Menu.AddMenuItem("~r~Отказать", "", {doName: "closeMenu"});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            UIMenu.Menu.HideMenu();
            if (item.doName === 'yes') {
                if (user.getCashMoney() < sum) {
                    return;
                }
                mp.game.ui.notifications.show('~b~У вас нет такой суммы на руках');
                mp.events.callRemote('server:user:askDiceToPlayerIdYes', playerId, sum);
            }
        });
    }
};

menuList.showInviteMpMenu = function(x, y, z, dim) {

    UIMenu.Menu.Create(`Мероприятие`, `~b~Приглашение от админстратора`);

    UIMenu.Menu.AddMenuItem('Приглашение на мероприятие');
    UIMenu.Menu.AddMenuItem('~g~Принять приглашение', "", {doName: "yes"});
    UIMenu.Menu.AddMenuItem("~r~Отказать", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'yes') {
            user.setVirtualWorld(dim);
            user.teleport(x, y, z);
        }
    });
};

menuList.showMenu = function(title, desc, menuData) {

    UIMenu.Menu.Create(title.toString(), `~b~${desc}`);

    menuData.forEach(function (val, key, map) {
        try {
            UIMenu.Menu.AddMenuItem(`~b~${key} ~s~`, "", {}, val.toString());
        }
        catch (e) {
            methods.error(e);
        }
    });

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();
};

let lastOffers = null;

menuList.showTruckerOffersMenu = function(menuData) {

    try {
        UIMenu.Menu.Create('Грузоперевозки', `~b~Список заказов`);

        lastOffers = menuData;

        let playerPos = mp.players.local.position;

        menuData.forEach((item, idx) => {
            try {
                let x = 0;
                let y = 0;
                let z = 0;
                let tx = 0;
                let ty = 0;
                let tz = 0;
                if (item.length == 10) {
                    x = item[3];
                    y = item[4];
                    z = item[5];
                    tx = item[6];
                    ty = item[7];
                    tz = item[8];
                }
                else {
                    x = item[7];
                    y = item[8];
                    z = item[9];
                    tx = item[11];
                    ty = item[12];
                    tz = item[13];
                }
                let dist = mp.game.pathfind.calculateTravelDistanceBetweenPoints(x, y, z, tx, ty, tz);
                let dist2 = mp.game.pathfind.calculateTravelDistanceBetweenPoints(playerPos.x, playerPos.y, playerPos.z, x, y, z);

                if (dist > 10000)
                    dist = methods.parseInt(methods.distanceToPos(new mp.Vector3(x, y, z), new mp.Vector3(tx, ty, tz)));
                if (dist2 > 10000)
                    dist2 = methods.parseInt(methods.distanceToPos(new mp.Vector3(x, y, z), playerPos));

                UIMenu.Menu.AddMenuItem(`~b~#${item[0]}.~s~ ${item[1]}`, `~y~До загрузки: ~s~${dist2}m~br~~y~Расстояние маршрута: ~s~${dist}m~br~~y~Место загрузки: ~s~${ui.getZoneName(new mp.Vector3(x, y, z))}`, {offerId: idx}, `~g~${methods.moneyFormat(item[item.length - 1])}`);
            }
            catch (e) {
                methods.debug(e);
            }
        });

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            UIMenu.Menu.HideMenu();
            if (item.offerId >= 0)
                menuList.showTruckerOfferInfoMenu(item.offerId);
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showDispatcherTaxiMenu = function(menuData) {

    try {
        UIMenu.Menu.Create('Такси', `~b~Список заказов`);

        let playerPos = mp.players.local.position;
        JSON.parse(menuData).forEach((item, idx) => {
            try {
                let dist = mp.game.pathfind.calculateTravelDistanceBetweenPoints(item.pos.x, item.pos.y, item.pos.z, playerPos.x, playerPos.y, playerPos.z);
                if (dist > 10000)
                    dist = methods.parseInt(methods.distanceToPos(item.pos, playerPos));
                let dist2 = mp.game.pathfind.calculateTravelDistanceBetweenPoints(item.pos.x, item.pos.y, item.pos.z, item.wpos.x, item.wpos.y, item.wpos.z);
                if (dist2 > 10000)
                    dist2 = methods.parseInt(methods.distanceToPos(item.pos, item.wpos));
                UIMenu.Menu.AddMenuItem(`Заказ ~y~#${item.id}`, `~y~До клиента: ~s~${dist}m~br~~y~Расстояние маршрута: ~s~${dist2}m~br~~y~Цена: ~g~${methods.moneyFormat(item.price)}`, {id: item.id});
            }
            catch (e) {
                methods.debug(e);
            }
        });

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            UIMenu.Menu.HideMenu();
            if (item.id > 0) {
                mp.events.callRemote('server:taxi:accept', item.id);
            }
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showDispatcherMechMenu = function(menuData) {

    try {
        UIMenu.Menu.Create('Механик', `~b~Список заказов`);

        let playerPos = mp.players.local.position;
        JSON.parse(menuData).forEach((item, idx) => {
            try {
                let dist = mp.game.pathfind.calculateTravelDistanceBetweenPoints(item.pos.x, item.pos.y, item.pos.z, playerPos.x, playerPos.y, playerPos.z);
                if (dist > 10000)
                    dist = methods.parseInt(methods.distanceToPos(item.pos, playerPos));
                UIMenu.Menu.AddMenuItem(`Заказ ~y~#${item.id}`, `~y~До клиента: ~s~${dist}m`, {id: item.id});
            }
            catch (e) {
                methods.debug(e);
            }
        });

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            UIMenu.Menu.HideMenu();
            if (item.id > 0) {
                mp.events.callRemote('server:mech:accept', item.id);
            }
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showTruckerOfferInfoMenu = function(idx) {

    //id, name, company, x, y, z, px, py, pz, price
    //id, name, company, trName, cl1, cl2, liv, x, y, z, rot, px, py, pz, price

    let item = lastOffers[idx];

    let x = 0;
    let y = 0;
    let z = 0;
    let tx = 0;
    let ty = 0;
    let tz = 0;
    if (item.length == 10) {
        x = item[3];
        y = item[4];
        z = item[5];
        tx = item[6];
        ty = item[7];
        tz = item[8];
    }
    else {
        x = item[7];
        y = item[8];
        z = item[9];
        tx = item[11];
        ty = item[12];
        tz = item[13];
    }

    UIMenu.Menu.Create(`Грузоперевозки`, `~b~Информация о заказе`);

    let dist = mp.game.pathfind.calculateTravelDistanceBetweenPoints(x, y, z, tx, ty, tz);

    if (dist > 10000)
        dist = methods.parseInt(methods.distanceToPos(new mp.Vector3(x, y, z), new mp.Vector3(tx, ty, tz)));

    UIMenu.Menu.AddMenuItem("~y~Номер заказа:~s~", '', {}, `${item[0]}`);
    UIMenu.Menu.AddMenuItem("~y~Груз:~s~", '', {}, `${item[1]}`);
    UIMenu.Menu.AddMenuItem("~y~Компания:~s~", '', {}, `${item[2]}`);
    UIMenu.Menu.AddMenuItem("~y~Стоимость:~s~", '', {}, `${methods.moneyFormat(item[item.length - 1])}`);
    UIMenu.Menu.AddMenuItem("~y~Место загрузки:~s~", '', {}, `${ui.getZoneName(new mp.Vector3(x, y, z))}`);
    UIMenu.Menu.AddMenuItem("~y~Место разгрузки:~s~", '', {}, `${ui.getZoneName(new mp.Vector3(tx, ty, tz))}`);
    UIMenu.Menu.AddMenuItem("~y~Расстояние:~s~", '', {}, `${dist}m`);
    UIMenu.Menu.AddMenuItem("~g~Принять заказ", '', {accept: item[0]});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.accept) {
            if (await user.getById('uniform')) {
                mp.game.ui.notifications.show('~r~Прежде чем принимать заказы, надо снять форму');
                return;
            }
            mp.events.callRemote('server:tucker:acceptOffer', item.accept);
        }
    });
};

menuList.showVehicleMenu = async function(data) {

    let vInfo = methods.getVehicleInfo(mp.players.local.vehicle.model);
    let veh = mp.players.local.vehicle;

    let ownerName = veh.getNumberPlateText();

    UIMenu.Menu.Create(`Транспорт`, `~b~Номер ТС: ~s~${ownerName}`);

    if (vInfo.class_name != 'Cycles') {
        UIMenu.Menu.AddMenuItem("~g~Вкл~s~ / ~r~выкл~s~ двигатель", "", {eventName: "server:vehicle:engineStatus"});
    }
    if (vInfo.class_name == 'Boats' || vInfo.display_name == 'Dodo' || vInfo.display_name == 'Seasparrow' || vInfo.display_name == 'Seabreeze')
        UIMenu.Menu.AddMenuItem("~g~Вкл~s~ / ~r~выкл~s~ якорь", "", {eventName: "server:vehicleFreeze"});

    if (vInfo.class_name != 'Cycles' || vInfo.class_name != 'Planes' || vInfo.class_name != 'Helicopters' || vInfo.class_name != 'Boats')
        UIMenu.Menu.AddMenuItem("Управление транспортом", "", {doName: "showVehicleDoMenu"});

    if (data.get('user_id') > 0 && user.getCache('id') == data.get('user_id')) {
        if (data.get('cop_park_name') !== '') {

            let price = methods.getVehicleInfo(mp.players.local.vehicle.model).price * 0.01 + 100;
            if (price > 500)
                price = 500;

            UIMenu.Menu.AddMenuItem("~y~Оплатить штраф", "Штраф: ~r~" + methods.moneyFormat(price) + "~br~~s~Припарковал: ~r~" + data.get('cop_park_name'), {eventName: "server:vehicle:park2"});
        }
        else {
            UIMenu.Menu.AddMenuItem("Припарковать", "Транспорт будет спавниться на этом месте, если вы ее припаркуете", {eventName: "server:vehicle:park"});
        }
    }

    if (user.getCache('fraction_id2') > 0 || user.isGos() || user.isCartel()) {
        if (veh.getVariable('cargoId') !== null && veh.getVariable('cargoId') !== undefined) {
            if (veh.getVariable('isMafia')) {
                if (user.isMafia()) {
                    let boxes = JSON.parse(veh.getVariable('box'));
                    boxes.forEach((item, i) => {
                        if (item >= 0)
                            UIMenu.Menu.AddMenuItem(`~y~${stocks.boxList[item][0]}`, 'Нажмите ~g~Enter~s~ чтобы разгрузить', {cargoUnloadId: i, cargoId: item});
                    });
                }
            }
            else {
                let boxes = JSON.parse(veh.getVariable('box'));
                boxes.forEach((item, i) => {
                    if (item >= 0)
                        UIMenu.Menu.AddMenuItem(`~y~${stocks.boxList[item][0]}`, 'Нажмите ~g~Enter~s~ чтобы разгрузить', {cargoUnloadId: i, cargoId: item});
                });
            }
            //UIMenu.Menu.AddMenuItem(`~y~Разгрузить весь груз`, 'Доступно только внутри склада').cargoUnloadAll = true;
        }
        if ((user.isUsmc() || user.isAdmin()) && (vInfo.display_name === 'Cargobob' || vInfo.display_name === 'Cargobob3' || vInfo.display_name === 'Cargobob4')) {
            UIMenu.Menu.AddMenuItem(`~b~Загрузить вертолёт (всем ниже перечилсенным)`, 'Одна партия обходиться в $400,000 из бюджета Армии', {cargoLoadAll: true});
            UIMenu.Menu.AddMenuItem(`~b~Загрузить вертолёт оружием и бронежилетами`, 'Одна партия обходиться в $200,000 из бюджета Армии', {cargoLoadGun: true});
            UIMenu.Menu.AddMenuItem(`~b~Загрузить вертолёт сухпайками`, 'Одна партия обходиться в $100,000 из бюджета Армии', {cargoLoadEat: true});
            UIMenu.Menu.AddMenuItem(`~b~Загрузить вертолёт конусами и огорождениями`, 'Одна партия обходиться в $100,000 из бюджета Армии', {cargoLoadOth: true});
        }
        if ((user.isUsmc() || user.isAdmin()) && (vInfo.display_name === 'Kamacho')) {
            //UIMenu.Menu.AddMenuItem(`~y~Загрузить транспорт медикаментами`, 'Загрузиться сразу 2 ящика', {cargoLoadMed1: true});
            UIMenu.Menu.AddMenuItem(`~b~Загрузить транспорт оружием и бронежилетами`, 'Загрузиться сразу 2 ящика', {cargoLoadGun1: true});
            UIMenu.Menu.AddMenuItem(`~b~Загрузить транспорт сухпайками`, 'Загрузиться сразу 2 ящика', {cargoLoadEat1: true});
            UIMenu.Menu.AddMenuItem(`~b~Загрузить транспорт конусами и огорождениями`, 'Загрузиться сразу 2 ящика', {cargoLoadOth1: true});
        }
        if ((user.isEms() || user.isAdmin()) && (vInfo.display_name === 'Nspeedo')) {
            UIMenu.Menu.AddMenuItem(`~b~Загрузить транспорт медикаментами`, 'Одна партия обходиться в $100,000 из бюджета EMS', {cargoLoadMed: true});
        }

        if ((user.isCartel() || user.isAdmin()) && (vInfo.display_name === 'Youga3' || vInfo.display_name === 'Rumpo3')) {
            UIMenu.Menu.AddMenuItem(`~b~Загрузить транспорт оружием и бронежилетами`, 'Одна партия обходиться в $200,000 из бюджета', {cargoLoadGun2: true});
            UIMenu.Menu.AddMenuItem(`~b~Загрузить транспорт сухпайками`, 'Одна партия обходиться в $100,000 из бюджета', {cargoLoadEat2: true});
            UIMenu.Menu.AddMenuItem(`~b~Загрузить транспорт медикаментами`, 'Одна партия обходиться в $100,000 из бюджета', {cargoLoadMed2: true});
        }
    }
    else {
        if (veh.getVariable('cargoId') !== null && veh.getVariable('cargoId') !== undefined) {
            let boxes = JSON.parse(veh.getVariable('box'));
            boxes.forEach((item, i) => {
                if (item >= 0)
                    UIMenu.Menu.AddMenuItem(`~y~${stocks.boxList[item][0]}`, '~r~Разгрузка запрещена', {});
            });
        }
    }

    if (user.isUsmc() && (veh.getVariable('cargoId') === 99999 || veh.getVariable('cargoId') === 99998)) {
        try {
            let boxes = JSON.parse(veh.getVariable('box'));
            if (boxes[0] === 52)
                UIMenu.Menu.AddMenuItem(`~y~Разгрузить транспорт`, "", {usmcUnloadAll: true});
        }
        catch (e) {}
    }

    if (veh.getVariable('lamar')) {
        UIMenu.Menu.AddMenuItem(`~y~Контрабанда`, 'Этот фургон везёт контрабанду');
    }

    if (veh.getVariable('emsTruck') !== null && veh.getVariable('emsTruck') !== undefined) {
        UIMenu.Menu.AddMenuItem(`~y~Разгрузить транспорт`, "", {emsUnloadAll: true});
    }

    if (veh.getVariable('fraction_id') === 2 || veh.getVariable('fraction_id') === 3 || veh.getVariable('fraction_id') === 4 || veh.getVariable('fraction_id') === 5 || veh.getVariable('fraction_id') === 6) {
        UIMenu.Menu.AddMenuItemList(`Маркировка`, enums.dispatchMarkedList, '~y~Номер необходимо указать тот,~br~который на крыше LSPD/BCSD', {dispatchMark: true});
        if (veh.getVariable('dispatchMarked'))
            UIMenu.Menu.AddMenuItem(`Маркировка: ~b~`, '', {}, `${veh.getVariable('dispatchMarked')}`);
        else
            UIMenu.Menu.AddMenuItem(`Маркировка отсуствует`);

        UIMenu.Menu.AddMenuItem(`Локальные коды`, '', {localCode: true});
        UIMenu.Menu.AddMenuItem(`Локальные департамента`, '', {depCode: true});
    }

    if (user.isSapd() || user.isFib() || user.isGov() || user.isSheriff()) {
        if (veh.getVariable('fraction_id') === 2 || veh.getVariable('fraction_id') === 3 || veh.getVariable('fraction_id') === 1 || veh.getVariable('fraction_id') === 5) {
            UIMenu.Menu.AddMenuItem(`~y~Выписка штрафа`, '', {giveTicket: true});
            UIMenu.Menu.AddMenuItem(`~y~Отменить штраф`, '', {takeTicket: true});
        }
    }

    if (veh.getVariable('fraction_id') === (user.getCache('fraction_id2') * -1) && user.isLeader2()) {
        UIMenu.Menu.AddMenuItem("Припарковать", "Транспорт будет спавниться на этом месте, если вы ее припаркуете", {eventName: "server:vehicle:parkFraction"});
    }

    if (vInfo.class_name !== 'Boats' && vInfo.class_name !== 'Helicopters' && vInfo.class_name !== 'Planes' && (veh.getVariable('fraction_id') === 2 || veh.getVariable('fraction_id') === 3 || veh.getVariable('fraction_id') === 5)) {
        UIMenu.Menu.AddMenuItem("Радар", "Вкл/Выкл радар", {doName: "police:radar"});
    }

    UIMenu.Menu.AddMenuItem("~y~Выкинуть из транспорта", "", {doName: "eject"});
    UIMenu.Menu.AddMenuItem("Характеристики", "", {doName: "showVehicleStatsMenu"});
    //UIMenu.Menu.AddMenuItem("Управление транспортом").eventName = 'server:vehicle:engineStatus';

    if (vInfo.class_name === 'Vans') {
        if (user.getCache('work_lvl') >= 4) {
            UIMenu.Menu.AddMenuItem("~g~Список заказов", "", {doName: "trucker:getList0"});
            UIMenu.Menu.AddMenuItem("~b~Частота рации:~s~ ", '', {}, '300.001');
            if (trucker.isProcess())
                UIMenu.Menu.AddMenuItem("~r~Завершить досрочно рейс", 'Штраф ~r~$500', {doName: "trucker:stop"});
        }
        else {
            UIMenu.Menu.AddMenuItem("~r~Чтобы работать на этом автомобиле дальнобойщиком, необходимо иметь навык рабочего от 4 уровня");
        }
    }
    if (vInfo.display_name === 'Benson' || vInfo.display_name === 'Mule' || vInfo.display_name === 'Mule2' || vInfo.display_name === 'Mule3' || vInfo.display_name === 'Pounder') {
        if (user.getCache('work_lvl') >= 8) {
            UIMenu.Menu.AddMenuItem("~g~Список заказов", "", {doName: "trucker:getList1"});
            UIMenu.Menu.AddMenuItem("~b~Частота рации:~s~ ", '', {}, '300.002');
            if (trucker.isProcess())
                UIMenu.Menu.AddMenuItem("~r~Завершить досрочно рейс", 'Штраф ~r~$500', {doName: "trucker:stop"});
        }
        else {
            UIMenu.Menu.AddMenuItem("~r~Чтобы работать на этом автомобиле дальнобойщиком, необходимо иметь навык рабочего от 8 уровня");
        }
    }
    if (vInfo.display_name === 'Hauler' || vInfo.display_name === 'Packer' || vInfo.display_name === 'Phantom') {
        if (user.getCache('work_lvl') >= 12) {
            UIMenu.Menu.AddMenuItem("~g~Список заказов", "", {doName: "trucker:getList2"});
            UIMenu.Menu.AddMenuItem("~b~Частота рации:~s~ ", '', {}, '300.003');
            if (trucker.isProcess())
                UIMenu.Menu.AddMenuItem("~r~Завершить досрочно рейс", 'Штраф ~r~$500', {doName: "trucker:stop"});
        }
        else {
            UIMenu.Menu.AddMenuItem("~r~Чтобы работать на этом автомобиле дальнобойщиком, необходимо иметь навык рабочего от 12 уровня");
        }
    }
    if (vInfo.class_name === 'Planes') {
        if (vInfo.display_name === 'Mammatus' ||
            vInfo.display_name === 'Cuban800' ||
            vInfo.display_name === 'Dodo' ||
            vInfo.display_name === 'Duster' ||
            vInfo.display_name === 'Miljet' ||
            vInfo.display_name === 'Nimbus' ||
            vInfo.display_name === 'Seabreeze' ||
            vInfo.display_name === 'Shamal' ||
            vInfo.display_name === 'Velum' ||
            vInfo.display_name === 'Velum2' ||
            vInfo.display_name === 'Vestra' ||
            vInfo.display_name === 'Luxor' ||
            vInfo.display_name === 'Luxor2') {
            if (user.getCache('work_lvl') >= 8) {
                UIMenu.Menu.AddMenuItem("~g~Список заказов", "", {doName: "trucker:getList4"});
                UIMenu.Menu.AddMenuItem("~b~Частота рации:~s~ ", '', {}, '300.004');
                if (trucker.isProcess())
                    UIMenu.Menu.AddMenuItem("~r~Завершить досрочно рейс", 'Штраф ~r~$500', {doName: "trucker:stop"});
            }
            else {
                UIMenu.Menu.AddMenuItem("~r~Чтобы работать на этом транспорте пилотом, необходимо иметь навык рабочего от 8 уровня");
            }
        }
        else {
            UIMenu.Menu.AddMenuItem("~r~Чтобы работать на пилотом, необходимо иметь самолеты: Cuban800, Dodo, Duster, Miljet, Mammatus, Nimbus, Luxor, Luxor2, Shamal, Velum, Velum2, Vestra");
        }
    }

    if (user.getCache('job') == veh.getVariable('jobId')) {
        switch (veh.getVariable('jobId')) {
            case 1:
                UIMenu.Menu.AddMenuItem("~g~Получить задание", "", {doName: "tree:find"});
                UIMenu.Menu.AddMenuItem("~b~Инструменты (Красный маркер)", "", {doName: "tree:take0"});
                UIMenu.Menu.AddMenuItem("~b~Инструменты (Зеленый маркер)", "", {doName: "tree:take1"});
                UIMenu.Menu.AddMenuItem("~b~Инструменты (Синий маркер)", "", {doName: "tree:take2"});
                UIMenu.Menu.AddMenuItem("~y~Завершить досрочно", "~r~Штраф $100 в случае если~br~вы не взяли хотя-бы 1 маркер", {doName: "tree:stop"});
                UIMenu.Menu.AddMenuItem("~y~Завершить аренду", "", {doName: "stopRent"});
                break;
            case 2:
                UIMenu.Menu.AddMenuItem("~g~Получить задание", "", {doName: "builder:find"});
                UIMenu.Menu.AddMenuItem("~b~Инструменты (Красный маркер)", "", {doName: "builder:take0"});
                UIMenu.Menu.AddMenuItem("~b~Инструменты (Зеленый маркер)", "", {doName: "builder:take1"});
                UIMenu.Menu.AddMenuItem("~b~Инструменты (Синий маркер)", "", {doName: "builder:take2"});
                UIMenu.Menu.AddMenuItem("~y~Завершить досрочно", "~r~Штраф $100 в случае если~br~вы не взяли хотя-бы 1 маркер", {doName: "builder:stop"});
                UIMenu.Menu.AddMenuItem("~y~Завершить аренду", "", {doName: "stopRent"});
                break;
            case 3:
                UIMenu.Menu.AddMenuItem("~g~Получить задание", "", {doName: "photo:find"});
                UIMenu.Menu.AddMenuItem("~g~Напомнить задание", "", {doName: "photo:ask"});
                UIMenu.Menu.AddMenuItem("~b~Справка", 'Внимательно смотрите на задание вашего начальника и выставите позицию персонажа так, чтобы он смотрел в ту точку, которую необходимо сфотографировать, тогда вы получите премию');
                UIMenu.Menu.AddMenuItem("~y~Завершить аренду", "", {doName: "stopRent"});
                break;
            case 5:
                let currentFuel = methods.parseInt(await vehicles.get(veh.getVariable('container'), 'mechFuel'));
                UIMenu.Menu.AddMenuItem("~g~Заправить транспорт", "Игрок, которому вы предлагаете, должен сидеть в ТС", {doName: "mech:fuel"});
                UIMenu.Menu.AddMenuItem("~g~Починить транспорт", "Игрок, которому вы предлагаете, должен сидеть в ТС", {doName: "mech:fix"});
                UIMenu.Menu.AddMenuItem("~g~Перевернуть транспорт", "Игрок, которому вы предлагаете, должен сидеть в ТС или находится рядом с ним", {doName: "mech:flip"});
                UIMenu.Menu.AddMenuItem("~g~Диспетчерская", "", {doName: "mech:dispatch"});
                UIMenu.Menu.AddMenuItem(`~b~Топливо: ~s~${methods.parseInt(currentFuel)}/500ед.`, "Нажмите Enter чтобы заправить топиво~br~~c~Доступно только на заправке", {doName: "mech:fuel:1"});
                break;
            case 6:
                UIMenu.Menu.AddMenuItem("~g~Начать рейс", "", {doName: "bus:start1"});
                UIMenu.Menu.AddMenuItem("~y~Завершить рейс", "Завершение рейса досрочно", {doName: "bus:stop"});
                UIMenu.Menu.AddMenuItem("~y~Завершить аренду", "", {doName: "stopRent"});
                break;
            case 7:
                UIMenu.Menu.AddMenuItem("~g~Начать рейс", "", {doName: "bus:start2"});
                UIMenu.Menu.AddMenuItem("~y~Завершить рейс", "Завершение рейса досрочно", {doName: "bus:stop"});
                UIMenu.Menu.AddMenuItem("~y~Завершить аренду", "", {doName: "stopRent"});
                break;
            case 8:
                UIMenu.Menu.AddMenuItem("~g~Начать рейс", "", {doName: "bus:start3"});
                UIMenu.Menu.AddMenuItem("~y~Завершить рейс", "Завершение рейса досрочно", {doName: "bus:stop"});
                UIMenu.Menu.AddMenuItem("~y~Завершить аренду", "", {doName: "stopRent"});
                break;
            case 10:
                UIMenu.Menu.AddMenuItem("~g~Получить задание", "", {doName: "gr6:start"});
                UIMenu.Menu.AddMenuItem("Разгрузить транспорт", "", {doName: "gr6:unload"});
                UIMenu.Menu.AddMenuItem("Вернуть транспорт в гараж", 'Залог в $4500 вернется вам на руки', {doName: "gr6:delete"});
                UIMenu.Menu.AddMenuItem("~y~Вызвать подмогу", 'Вызывает сотрудников LSPD и BCSD', {doName: "gr6:getHelp"});
                UIMenu.Menu.AddMenuItem("~b~Справка", 'Катайтесь по заданиям, собирайте деньги с магазинов и везите их в хранилище. Есть возможность работать с напарником, до 4 человек.');
                break;
            case 4:
                UIMenu.Menu.AddMenuItem("~g~Взять почту из транспорта", "", {doName: "mail:take"});
                UIMenu.Menu.AddMenuItem("~b~Справка", 'Возьмите почту из транспорта, далее езжай к любым жилым домам, подходи к дому нажимай E и кладите туда почту.');
                UIMenu.Menu.AddMenuItem("~y~Завершить аренду", "", {doName: "stopRent"});
                break;
        }
    }

    if (veh.getVariable('jobId') == 10) {
        UIMenu.Menu.AddMenuItem("Денег в транспорте: ~g~" + methods.moneyFormat(mp.players.local.vehicle.getVariable('gr6Money')), "", {doName: "close"});
        UIMenu.Menu.AddMenuItem("~y~Ограбить транспорт", "", {doName: "gr6:grab"});
    }

    if (veh.getMaxNumberOfPassengers() > 0) {
        if (veh.getVariable('taxi')) {
            UIMenu.Menu.AddMenuItem("~g~Получить заказ", "На перевозку NPC", {doName: "taxi:take"});
            UIMenu.Menu.AddMenuItem("~g~Диспетчерская", "", {doName: "taxi:dispatch"});
            UIMenu.Menu.AddMenuItem("~b~Справка", 'Вы можете перевозить NPC или игроков.');
        }
        else if (user.getCache('taxi_lic') && !veh.getVariable('jobId') && !veh.getVariable('fraction_id') && !veh.getVariable('cargoId')) {
            if (user.getCache('isTaxi')) {
                UIMenu.Menu.AddMenuItem("~g~Получить заказ", "На перевозку NPC", {doName: "taxi:take"});
                UIMenu.Menu.AddMenuItem("~g~Диспетчерская", "", {doName: "taxi:dispatch"});
                UIMenu.Menu.AddMenuItem("~y~Закончить принимать заказы", "", {doName: "taxi:stop"});
            }
            else {
                UIMenu.Menu.AddMenuItem("~g~Начать принимать заказы", "", {doName: "taxi:start"});
            }
        }
    }

    if (veh.getVariable('rentOwner') == user.getCache('id')) {
        UIMenu.Menu.AddMenuItem("~y~Завершить аренду", "", {doName: "stopRent"});
    }

    if (data.get('is_neon')) {
        UIMenu.Menu.AddMenuItem("~g~Вкл~s~ / ~r~выкл~s~ неон", "", {eventName: "server:vehicle:neonStatus"});
        UIMenu.Menu.AddMenuItemList("~b~Цвет неона", enums.rgbNames, "", {eventName: "server:vehicle:setNeonColor"});
        UIMenu.Menu.AddMenuItem("~b~Цвет неона RGB", "", {eventName: "server:vehicle:setNeonColor"});
    }

    if (data.get('colorl') >= 0) {
        let colorList = [
            'White',
            'Blue',
            'Light Blue',
            'Green',
            'Light Green',
            'Light Yellow',
            'Yellow',
            'Orange',
            'Red',
            'Light Pink',
            'Pink',
            'Purple',
            'Light Purple',
        ];
        UIMenu.Menu.AddMenuItemList("Сменить цвет фар", colorList, "", {doName: "setLight"}, data.get('colorl'));
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    let listIndex = 0;
    UIMenu.Menu.OnList.Add(async (item, index) => {
        listIndex = index;
        if (item.doName == 'setLight') {
            mp.events.callRemote('server:vehicle:setLight', index);
        }
        else if (item.eventName == 'server:vehicle:setNeonColor') {
            let rgb = enums.rgbColors[index];
            mp.events.callRemote(item.eventName, methods.parseInt(rgb[0]), methods.parseInt(rgb[1]), methods.parseInt(rgb[2]));
        }
    });

    UIMenu.Menu.OnSelect.Add(async (item, index) => {

        UIMenu.Menu.HideMenu();

        if (item.dispatchMark)
        {
            try {
                let id = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите номер", "", 5));
                if (id < 0) {
                    mp.game.ui.notifications.show('~r~ID не может быть меньше 0');
                    return;
                }
                dispatcher.sendLocal('Выдача маркировки', `~y~${user.getCache('name')}~s~ вышел в патруль с маркировкой ~y~${enums.dispatchMarkedList[listIndex]}-${id}`);
                mp.events.callRemote('server:vehicle:setDispatchMarked', methods.parseInt(id), enums.dispatchMarkedList[listIndex]);
            }
            catch (e) {
                methods.debug(e);
            }
        }
        else if (item.localCode)
        {
            menuList.showLocalCodeMenu();
        }
        else if (item.depCode)
        {
            menuList.showDepCodeMenu();
        }
        else if (item.giveTicket)
        {
            let id = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите Card ID", "", 10));
            if (id < 0) {
                mp.game.ui.notifications.show('~r~ID не может быть меньше 0');
                return;
            }
            let price = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите сумму штрафа", "", 10));
            if (price < 0) {
                mp.game.ui.notifications.show('~r~Не может быть меньше 0');
                return;
            }
            if (price > 50000) {
                mp.game.ui.notifications.show('~r~Не может быть больше 50000');
                return;
            }
            let desc = await UIMenu.Menu.GetUserInput("Введите причину", "", 50);
            if (desc === '') {
                mp.game.ui.notifications.show('~r~Не может быть пустым');
                return;
            }
            mp.events.callRemote('server:user:giveTicket', id, price, desc);
        }
        else if (item.takeTicket)
        {
            let id = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите номер штрафа", "", 10));
            if (id < 0) {
                mp.game.ui.notifications.show('~r~ID не может быть меньше 0');
                return;
            }
            let desc = await UIMenu.Menu.GetUserInput("Введите причину", "", 50);
            if (desc === '') {
                mp.game.ui.notifications.show('~r~Не может быть пустым');
                return;
            }
            mp.events.callRemote('server:user:takeTicket', id, desc);
        }
        else if (item.sendChatMessage)
            chat.push(`${item.sendChatMessage}`);
        else if (item.doName == 'mail:take')
            mail.takeMail();
        else if (item.doName == 'taxi:take')
            taxi.take();
        else if (item.doName == 'taxi:dispatch')
            dispatcher.getTaxiMenu();
        else if (item.doName == 'taxi:start')
            user.set('isTaxi', true);
        else if (item.doName == 'taxi:stop')
            user.reset('isTaxi');
        else if (item.doName == 'bus:start1')
            bus.start(1);
        else if (item.doName == 'bus:start2')
            bus.start(2);
        else if (item.doName == 'bus:start3')
            bus.start(3);
        else if (item.doName == 'bus:stop')
            bus.stop();
        else if (item.doName == 'gr6:start')
            gr6.start();
        else if (item.doName == 'gr6:unload') {
            UIMenu.Menu.HideMenu();
            gr6.unload();
        }
        else if (item.doName == 'mech:dispatch')
            dispatcher.getMechMenu();
        else if (item.doName == 'mech:fuel') {
            UIMenu.Menu.HideMenu();
            let currentFuel = methods.parseInt(await vehicles.get(veh.getVariable('container'), 'mechFuel'));
            let id = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите ID", "", 3));
            if (id < 0) {
                mp.game.ui.notifications.show('~r~Значение не может быть меньше 0');
                return;
            }
            let count = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите количество", "", 3));
            if (count < 0) {
                mp.game.ui.notifications.show('~r~Значение не может быть меньше 0');
                return;
            }
            if (currentFuel === 0) {
                mp.game.ui.notifications.show(`~r~В транспорте нет топлива`);
                return;
            }
            if (count > currentFuel) {
                mp.game.ui.notifications.show(`~r~Значение не может быть больше ${currentFuel}`);
                return;
            }

            let price = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите цену", "", 3));
            if (price < 1) {
                mp.game.ui.notifications.show('~r~Значение не может быть меньше 1');
                return;
            }
            if (price > 5000) {
                mp.game.ui.notifications.show('~r~Значение не может быть больше 5000');
                return;
            }
            mp.events.callRemote('server:mechanic:fuel', id, count, price);
        }
        else if (item.doName == 'mech:fix') {
            UIMenu.Menu.HideMenu();
            let id = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите ID", "", 3));
            if (id < 0) {
                mp.game.ui.notifications.show('~r~Значение не может быть меньше 0');
                return;
            }
            let price = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите цену", "", 3));
            if (price < 1) {
                mp.game.ui.notifications.show('~r~Значение не может быть меньше 1');
                return;
            }
            if (price > 2000) {
                mp.game.ui.notifications.show('~r~Значение не может быть больше 2000');
                return;
            }
            mp.events.callRemote('server:mechanic:fix', id, price);
        }
        else if (item.doName == 'mech:flip') {
            UIMenu.Menu.HideMenu();
            let id = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите ID", "", 3));
            if (id < 0) {
                mp.game.ui.notifications.show('~r~Значение не может быть меньше 0');
                return;
            }
            let price = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите цену", "", 3));
            if (price < 1) {
                mp.game.ui.notifications.show('~r~Значение не может быть меньше 1');
                return;
            }
            if (price > 2000) {
                mp.game.ui.notifications.show('~r~Значение не может быть больше 2000');
                return;
            }
            mp.events.callRemote('server:mechanic:flip', id, price);
        }
        else if (item.doName == 'mech:fuel:1') {
            UIMenu.Menu.HideMenu();
            if (!timer.isFuel()) {
                mp.game.ui.notifications.show('~b~Вы должны находится на заправке');
                return;
            }
            let count = methods.parseInt(await UIMenu.Menu.GetUserInput("Количество", "", 3));
            if (count < 0) {
                mp.game.ui.notifications.show('~r~Значение не может быть меньше 0');
                return;
            }
            if (count > 500) {
                mp.game.ui.notifications.show('~r~Значение не может быть больше 500');
                return;
            }
            let shopId = fuel.findNearestId(mp.players.local.position);
            let price = await business.getPrice(shopId);
            fuel.fillMech(price, shopId, count);
        }
        else if (item.doName == 'gr6:delete') {
            UIMenu.Menu.HideMenu();
            gr6.deleteVeh();
        }
        else if (item.doName == 'gr6:grab')
            gr6.grab();
        else if (item.doName == 'gr6:getHelp') {
            dispatcher.sendLocalPos('Код 0', `${user.getCache('name')} - инкассация требует поддержки`, mp.players.local.position, 2);
            dispatcher.sendLocalPos('Код 0', `${user.getCache('name')} - инкассация требует поддержки`, mp.players.local.position, 5);
            mp.game.ui.notifications.show('~b~Вызов был отправлен');
        }
        else if (item.doName == 'trucker:getList0')
            mp.events.callRemote('server:trucker:showMenu', 0);
        else if (item.doName == 'trucker:getList1')
            mp.events.callRemote('server:trucker:showMenu', 1);
        else if (item.doName == 'trucker:getList2')
            mp.events.callRemote('server:trucker:showMenu', 2);
        else if (item.doName == 'trucker:getList4')
            mp.events.callRemote('server:trucker:showMenu', 4);
        else if (item.doName == 'trucker:stop')
            trucker.stop();
        else if (item.doName == 'stopRent') {
            vehicles.destroy();
        }
        else if (item.doName == 'tree:find')
            tree.start();
        else if (item.doName == 'tree:take0')
            tree.take(0);
        else if (item.doName == 'tree:take1')
            tree.take(1);
        else if (item.doName == 'tree:take2')
            tree.take(2);
        else if (item.doName == 'tree:stop')
            tree.stop();
        else if (item.doName == 'builder:find')
            builder.start();
        else if (item.doName == 'builder:take0')
            builder.take(0);
        else if (item.doName == 'builder:take1')
            builder.take(1);
        else if (item.doName == 'builder:take2')
            builder.take(2);
        else if (item.doName == 'builder:stop')
            builder.stop();
        else if (item.doName == 'photo:find')
            photo.start();
        else if (item.doName == 'photo:ask')
            photo.ask();
        else if (item.doName == 'police:radar')
        {
            if (!policeRadar.isEnable())
            {
                let speed = methods.parseInt(await UIMenu.Menu.GetUserInput("Допустимая скорость", "", 3));
                if (speed > 220 || speed < 120) {
                    mp.game.ui.notifications.show('~r~Скорость должна быть больше 120 и меньше 220');
                    return ;
                }
                policeRadar.enable(speed);
            }
            else
                policeRadar.disable();
        }
        /*else if (item.doName == 'showVehicleAutopilotMenu')
            menuList.showVehicleAutopilotMenu();*/
        else if (item.doName == 'showVehicleStatsMenu')
            menuList.showVehicleStatsMenu(mp.players.local.vehicle);
        else if (item.eventName == 'server:vehicle:neonStatus')
            mp.events.callRemote(item.eventName);
        else if (item.eventName == 'server:vehicle:lockStatus') {
            if (data.get('fraction_id') > 0) {
                if (data.get('fraction_id') == user.getCache('fraction_id'))
                    mp.events.callRemote(item.eventName);
                else
                    mp.game.ui.notifications.show('~r~У Вас нет ключей от транспорта');
            }
            else
                mp.events.callRemote(item.eventName);
        }
        else if (item.eventName == 'server:vehicle:engineStatus') {

            try {
                if (data.get('user_id') > 0 && user.getCache('id') == data.get('user_id')) {
                    if (data.get('cop_park_name') !== '') {
                        mp.game.ui.notifications.show('~r~Для начала необходимо оплатить штраф');
                        return;
                    }
                }
            }
            catch (e) {
                methods.debug(e);
            }

            vehicles.engineVehicle();
        }
        else if (item.doName == 'showVehicleDoMenu') {
            menuList.showVehicleDoMenu();
        }
        else if (item.doName == 'eject') {
            let id = methods.parseInt(await UIMenu.Menu.GetUserInput("ID Игрока", "", 3));
            if (id < 0) {
                mp.game.ui.notifications.show('~r~ID не может быть меньше 0');
                return;
            }
            if (methods.parseInt(id) === mp.players.local.remoteId) {
                mp.game.ui.notifications.show('~r~Дядь, себя нельзя никак выкинуть из ТС');
                return;
            }
            mp.events.callRemote('server:vehicle:ejectById', methods.parseInt(id));
        }
        else if (item.eventName == 'server:vehicleFreeze') {
            if (methods.getCurrentSpeed() > 10) {
                mp.game.ui.notifications.show('~r~Скорость должна быть меньше 10 ед. в час');
                return;
            }

            let actualData = mp.players.local.vehicle.getVariable('vehicleSyncData');
            let isFreeze = !actualData.Anchor;
            vehicles.setAnchorState(isFreeze);

            if (isFreeze === true)
                mp.game.ui.notifications.show('~g~Вы поставили якорь');
            else
                mp.game.ui.notifications.show('~y~Вы сняли якорь');
        }
        else if (item.eventName == 'server:vehicle:park2') {

            UIMenu.Menu.HideMenu();

            let price = methods.getVehicleInfo(mp.players.local.vehicle.model).price * 0.01 + 100;
            if (price > 500)
                price = 500;

            if (user.getMoney() < price) {
                mp.game.ui.notifications.show('~y~У Вас недостаточно средств');
                return;
            }

            user.removeMoney(price, 'Оплата штрафа');
            mp.events.callRemote(item.eventName);
        }
        else if (item.eventName == 'server:vehicle:park') {
            UIMenu.Menu.HideMenu();
            if (ui.isGreenZone()) {
                mp.game.ui.notifications.show("~r~В Зелёной зоне парковка транспорта запрещена");
                return;
            }

            if (vehicles.checkerControl()) {
                mp.game.ui.notifications.show('~y~В таком положении транспорт не паркуется');
                return;
            }

            if (methods.getCurrentSpeed() > 10) {
                mp.game.ui.notifications.show('~y~Нельзя это делать на скорости');
                return;
            }
            let vInfo = methods.getVehicleInfo(mp.players.local.vehicle.model);
            if (mp.players.local.vehicle.isInWater() && vInfo.class_name !== 'Boats') {
                mp.game.ui.notifications.show('~y~Ты точно понимаешь адекватность этого поступка?');
                return;
            }
            quest.standart(false, -1, 9);
            mp.events.callRemote(item.eventName);
        }
        else if (item.eventName == 'server:vehicle:parkFraction') {
            UIMenu.Menu.HideMenu();

            if (vehicles.checkerControl()) {
                mp.game.ui.notifications.show('~y~В таком положении транспорт не паркуется');
                return;
            }

            if (methods.getCurrentSpeed() > 10) {
                mp.game.ui.notifications.show('~y~Нельзя это делать на скорости');
                return;
            }
            let vInfo = methods.getVehicleInfo(mp.players.local.vehicle.model);
            if (mp.players.local.vehicle.isInWater() && vInfo.class_name !== 'Boats') {
                mp.game.ui.notifications.show('~y~Ты точно понимаешь адекватность этого поступка?');
                return;
            }

            mp.events.callRemote(item.eventName);
        }
        else if (item.cargoUnloadId >= 0) {
            UIMenu.Menu.HideMenu();
            fraction.unloadCargoVehTimer(item.cargoUnloadId, item.cargoId);
        }
        else if (item.cargoLoadAll) {
            UIMenu.Menu.HideMenu();

            if (methods.distanceToPos(new mp.Vector3(3042.36767578125, -4740.39013671875, 14.26130485534668), mp.players.local.position) > 10) {
                mp.game.ui.notifications.show('~y~Вы слишком далеко от места загрузки');
                user.setWaypoint(3042.36767578125, -4740.39013671875);
                return;
            }

            let money = await coffer.getMoney(7);
            if (money < 400000) {
                mp.game.ui.notifications.show('~y~В бюджете организации недостаточно средств');
                return;
            }

            coffer.removeMoney(7, 400000);
            vehicles.setVariable('cargoId', 999);
            vehicles.setVariable('box', JSON.stringify([50,2,1]));

            mp.game.ui.notifications.show('~y~Вы совершили погрузку, теперь разгрузитесь на базе');
            user.setWaypoint(477.9193420410156, -3300.276123046875);

            methods.saveFractionLog(
                user.getCache('name'),
                `Выполнил загрузку (Cargobob)`,
                `Потрачено из бюджета ${methods.moneyFormat(400000)}.`,
                user.getCache('fraction_id')
            );
        }
        else if (item.cargoLoadMed) {
            UIMenu.Menu.HideMenu();

            if (methods.distanceToPos(new mp.Vector3(3579.362548828125, 3667.729736328125, 32.88863754272461), mp.players.local.position) > 10) {
                mp.game.ui.notifications.show('~y~Вы слишком далеко от места загрузки');
                user.setWaypoint(3579.362548828125, 3667.729736328125);
                return;
            }

            let money = await coffer.getMoney(6);
            if (money < 100000) {
                mp.game.ui.notifications.show('~y~В бюджете организации недостаточно средств');
                return;
            }

            coffer.removeMoney(6, 100000);
            vehicles.setVariable('cargoId', 999);
            vehicles.setVariable('box', JSON.stringify([13, 13]));
            vehicles.attach('stock_13');

            mp.game.ui.notifications.show('~y~Вы совершили погрузку, теперь разгрузитесь на любой из гос. фракции');

            methods.saveFractionLog(
                user.getCache('name'),
                `Медикаменты (Nspeedo)`,
                `Потрачено из бюджета ${methods.moneyFormat(100000)}.`,
                user.getCache('fraction_id')
            );
        }
        else if (item.cargoLoadGun) {
            UIMenu.Menu.HideMenu();

            if (methods.distanceToPos(new mp.Vector3(3042.36767578125, -4740.39013671875, 14.26130485534668), mp.players.local.position) > 10) {
                mp.game.ui.notifications.show('~y~Вы слишком далеко от места загрузки');
                user.setWaypoint(3042.36767578125, -4740.39013671875);
                return;
            }

            let money = await coffer.getMoney(7);
            if (money < 100000) {
                mp.game.ui.notifications.show('~y~В бюджете организации недостаточно средств');
                return;
            }

            coffer.removeMoney(7, 100000);
            vehicles.setVariable('cargoId', 999);
            vehicles.setVariable('box', JSON.stringify([50]));

            mp.game.ui.notifications.show('~y~Вы совершили погрузку, теперь разгрузитесь на базе');
            user.setWaypoint(477.9193420410156, -3300.276123046875);

            methods.saveFractionLog(
                user.getCache('name'),
                `Оружие (Cargobob)`,
                `Потрачено из бюджета ${methods.moneyFormat(100000)}.`,
                user.getCache('fraction_id')
            );
        }
        else if (item.cargoLoadEat) {
            UIMenu.Menu.HideMenu();

            if (methods.distanceToPos(new mp.Vector3(3042.36767578125, -4740.39013671875, 14.26130485534668), mp.players.local.position) > 10) {
                mp.game.ui.notifications.show('~y~Вы слишком далеко от места загрузки');
                user.setWaypoint(3042.36767578125, -4740.39013671875);
                return;
            }

            let money = await coffer.getMoney(7);
            if (money < 100000) {
                mp.game.ui.notifications.show('~y~В бюджете организации недостаточно средств');
                return;
            }

            coffer.removeMoney(7, 100000);
            vehicles.setVariable('cargoId', 999);
            vehicles.setVariable('box', JSON.stringify([1]));

            mp.game.ui.notifications.show('~y~Вы совершили погрузку, теперь разгрузитесь на базе');
            user.setWaypoint(477.9193420410156, -3300.276123046875);

            methods.saveFractionLog(
                user.getCache('name'),
                `Еда (Cargobob)`,
                `Потрачено из бюджета ${methods.moneyFormat(100000)}.`,
                user.getCache('fraction_id')
            );
        }
        else if (item.cargoLoadOth) {
            UIMenu.Menu.HideMenu();

            if (methods.distanceToPos(new mp.Vector3(3042.36767578125, -4740.39013671875, 14.26130485534668), mp.players.local.position) > 10) {
                mp.game.ui.notifications.show('~y~Вы слишком далеко от места загрузки');
                user.setWaypoint(3042.36767578125, -4740.39013671875);
                return;
            }

            let money = await coffer.getMoney(7);
            if (money < 100000) {
                mp.game.ui.notifications.show('~y~В бюджете организации недостаточно средств');
                return;
            }

            coffer.removeMoney(7, 100000);
            vehicles.setVariable('cargoId', 999);
            vehicles.setVariable('box', JSON.stringify([2]));

            mp.game.ui.notifications.show('~y~Вы совершили погрузку, теперь разгрузитесь на базе');
            user.setWaypoint(477.9193420410156, -3300.276123046875);

            methods.saveFractionLog(
                user.getCache('name'),
                `Огорожденя (Cargobob)`,
                `Потрачено из бюджета ${methods.moneyFormat(100000)}.`,
                user.getCache('fraction_id')
            );
        }
        else if (item.cargoLoadMed1) {
            UIMenu.Menu.HideMenu();

            if (methods.distanceToPos(new mp.Vector3(504.80950927734375, -3127.914306640625, 5.069790840148926), mp.players.local.position) > 10) {
                mp.game.ui.notifications.show('~y~Вы слишком далеко от места загрузки');
                user.setWaypoint(504.80950927734375, -3127.914306640625);
                return;
            }

            let stockData = await coffer.getAllData(7);
            if (stockData.get('stock_med') < 200) {
                mp.game.ui.notifications.show('~y~На складе недостаточно лекарств');
                return;
            }
            if (stockData.get('stock_eat') < 200) {
                mp.game.ui.notifications.show('~y~На складе недостаточно еды');
                return;
            }
            vehicles.setVariable('cargoId', 999);
            vehicles.setVariable('box', JSON.stringify([13, 13]));
            vehicles.attach('stock_13');
            coffer.set(7, 'stock_med', stockData.get('stock_med') - 200);
            coffer.set(7, 'stock_eat', stockData.get('stock_eat') - 200);
            mp.game.ui.notifications.show('~y~Вы совершили погрузку, теперь разгрузите у любой из доступных гос. организаций');


            methods.saveFractionLog(
                user.getCache('name'),
                `Медикаменты (Kamacho)`,
                `Медикаменты ${stockData.get('stock_med') - 200}ед. / Еда ${stockData.get('stock_eat') - 200}`,
                user.getCache('fraction_id')
            );
        }
        else if (item.cargoLoadGun1) {
            UIMenu.Menu.HideMenu();

            if (methods.distanceToPos(new mp.Vector3(504.80950927734375, -3127.914306640625, 5.069790840148926), mp.players.local.position) > 10) {
                mp.game.ui.notifications.show('~y~Вы слишком далеко от места загрузки');
                user.setWaypoint(504.80950927734375, -3127.914306640625);
                return;
            }

            let stockData = await coffer.getAllData(7);
            if (stockData.get('stock_gun') < 40) {
                mp.game.ui.notifications.show('~y~На складе недостаточно оружия');
                return;
            }
            if (stockData.get('stock_gunm') < 160) {
                mp.game.ui.notifications.show('~y~На складе недостаточно модулей');
                return;
            }
            if (stockData.get('stock_ammo') < 500) {
                mp.game.ui.notifications.show('~y~На складе недостаточно патрон');
                return;
            }
            if (stockData.get('stock_armour') < 500) {
                mp.game.ui.notifications.show('~y~На складе недостаточно бронежилетов');
                return;
            }
            vehicles.setVariable('cargoId', 999);
            vehicles.setVariable('box', JSON.stringify([50, 50]));
            vehicles.attach('stock_50');
            coffer.set(7, 'stock_gun', stockData.get('stock_gun') - 40);
            coffer.set(7, 'stock_gunm', stockData.get('stock_gunm') - 160);
            coffer.set(7, 'stock_ammo', stockData.get('stock_ammo') - 500);
            coffer.set(7, 'stock_armour', stockData.get('stock_armour') - 500);
            mp.game.ui.notifications.show('~y~Вы совершили погрузку, теперь разгрузите у любой из доступных гос. организаций');

            methods.saveFractionLog(
                user.getCache('name'),
                `Оружие (Kamacho)`,
                `G ${stockData.get('stock_gun') - 40}ед. / M ${stockData.get('stock_gunm') - 160} / A ${stockData.get('stock_ammo') - 500} / Arm ${stockData.get('stock_armour') - 500}`,
                user.getCache('fraction_id')
            );
        }
        else if (item.cargoLoadEat1) {
            UIMenu.Menu.HideMenu();

            if (methods.distanceToPos(new mp.Vector3(504.80950927734375, -3127.914306640625, 5.069790840148926), mp.players.local.position) > 10) {
                mp.game.ui.notifications.show('~y~Вы слишком далеко от места загрузки');
                user.setWaypoint(504.80950927734375, -3127.914306640625);
                return;
            }

            let stockData = await coffer.getAllData(7);
            if (stockData.get('stock_eat') < 200) {
                mp.game.ui.notifications.show('~y~На складе недостаточно еды');
                return;
            }
            vehicles.setVariable('cargoId', 999);
            vehicles.setVariable('box', JSON.stringify([1, 1]));
            vehicles.attach('stock_1');
            coffer.set(7, 'stock_eat', stockData.get('stock_eat') - 200);
            mp.game.ui.notifications.show('~y~Вы совершили погрузку, теперь разгрузите у любой из доступных гос. организаций');

            methods.saveFractionLog(
                user.getCache('name'),
                `Еда (Kamacho)`,
                `Осталось ${stockData.get('stock_eat') - 40}ед.`,
                user.getCache('fraction_id')
            );
        }
        else if (item.cargoLoadOth1) {
            UIMenu.Menu.HideMenu();

            if (methods.distanceToPos(new mp.Vector3(504.80950927734375, -3127.914306640625, 5.069790840148926), mp.players.local.position) > 10) {
                mp.game.ui.notifications.show('~y~Вы слишком далеко от места загрузки');
                user.setWaypoint(504.80950927734375, -3127.914306640625);
                return;
            }

            let stockData = await coffer.getAllData(7);
            if (stockData.get('stock_other') < 10) {
                mp.game.ui.notifications.show('~y~На складе недостаточно конусов и огорождений');
                return;
            }
            vehicles.setVariable('cargoId', 999);
            vehicles.setVariable('box', JSON.stringify([2, 2]));
            vehicles.attach('stock_2');
            coffer.set(7, 'stock_other', stockData.get('stock_other') - 10);
            mp.game.ui.notifications.show('~y~Вы совершили погрузку, теперь разгрузите у любой из доступных гос. организаций');

            methods.saveFractionLog(
                user.getCache('name'),
                `Огорождения (Kamacho)`,
                `Осталось ${stockData.get('stock_other') - 40}ед.`,
                user.getCache('fraction_id')
            );
        }
        else if (item.cargoLoadMed2) {
            UIMenu.Menu.HideMenu();

            if (methods.distanceToPos(new mp.Vector3(5077.5576171875, -4633.783203125, 1.2534267902374268), mp.players.local.position) > 10) {
                mp.game.ui.notifications.show('~y~Вы слишком далеко от места загрузки');
                user.setWaypoint(5077.5576171875, -4633.783203125);
                return;
            }

            let money = await coffer.getMoney(9);
            if (money < 100000) {
                mp.game.ui.notifications.show('~y~В бюджете организации недостаточно средств');
                return;
            }

            coffer.removeMoney(9, 100000);
            vehicles.setVariable('cargoId', 999);
            vehicles.setVariable('box', JSON.stringify([13, 13]));
            vehicles.attach('stock_13');

            mp.game.ui.notifications.show('~y~Вы совершили погрузку, теперь разгрузитесь на складе');
            user.setWaypoint(4990.25537109375, -5738.73486328125);

            methods.saveFractionLog(
                user.getCache('name'),
                `Медикаменты`,
                `Потрачено из бюджета ${methods.moneyFormat(100000)}.`,
                user.getCache('fraction_id')
            );
        }
        else if (item.cargoLoadGun2) {
            UIMenu.Menu.HideMenu();

            if (methods.distanceToPos(new mp.Vector3(5077.5576171875, -4633.783203125, 1.2534267902374268), mp.players.local.position) > 10) {
                mp.game.ui.notifications.show('~y~Вы слишком далеко от места загрузки');
                user.setWaypoint(5077.5576171875, -4633.783203125);
                return;
            }

            let money = await coffer.getMoney(9);
            if (money < 100000) {
                mp.game.ui.notifications.show('~y~В бюджете организации недостаточно средств');
                return;
            }

            coffer.removeMoney(9, 100000);
            vehicles.setVariable('cargoId', 999);
            vehicles.setVariable('box', JSON.stringify([50, 50]));

            mp.game.ui.notifications.show('~y~Вы совершили погрузку, теперь разгрузитесь на складе');
            user.setWaypoint(4990.25537109375, -5738.73486328125);

            methods.saveFractionLog(
                user.getCache('name'),
                `Оружие (Cargobob)`,
                `Потрачено из бюджета ${methods.moneyFormat(100000)}.`,
                user.getCache('fraction_id')
            );
        }
        else if (item.cargoLoadEat2) {
            UIMenu.Menu.HideMenu();

            if (methods.distanceToPos(new mp.Vector3(5077.5576171875, -4633.783203125, 1.2534267902374268), mp.players.local.position) > 10) {
                mp.game.ui.notifications.show('~y~Вы слишком далеко от места загрузки');
                user.setWaypoint(5077.5576171875, -4633.783203125);
                return;
            }

            let money = await coffer.getMoney(9);
            if (money < 100000) {
                mp.game.ui.notifications.show('~y~В бюджете организации недостаточно средств');
                return;
            }

            coffer.removeMoney(9, 100000);
            vehicles.setVariable('cargoId', 999);
            vehicles.setVariable('box', JSON.stringify([1, 1]));

            mp.game.ui.notifications.show('~y~Вы совершили погрузку, теперь разгрузитесь на складе');
            user.setWaypoint(4990.25537109375, -5738.73486328125);

            methods.saveFractionLog(
                user.getCache('name'),
                `Еда`,
                `Потрачено из бюджета ${methods.moneyFormat(100000)}.`,
                user.getCache('fraction_id')
            );
        }
        else if (item.cargoLoadOth2) {
            UIMenu.Menu.HideMenu();

            if (methods.distanceToPos(new mp.Vector3(5077.5576171875, -4633.783203125, 1.2534267902374268), mp.players.local.position) > 10) {
                mp.game.ui.notifications.show('~y~Вы слишком далеко от места загрузки');
                user.setWaypoint(5077.5576171875, -4633.783203125);
                return;
            }

            let money = await coffer.getMoney(9);
            if (money < 100000) {
                mp.game.ui.notifications.show('~y~В бюджете организации недостаточно средств');
                return;
            }

            coffer.removeMoney(9, 100000);
            vehicles.setVariable('cargoId', 999);
            vehicles.setVariable('box', JSON.stringify([2, 2]));

            mp.game.ui.notifications.show('~y~Вы совершили погрузку, теперь разгрузитесь на складе');
            user.setWaypoint(4990.25537109375, -5738.73486328125);

            methods.saveFractionLog(
                user.getCache('name'),
                `Огорожденя`,
                `Потрачено из бюджета ${methods.moneyFormat(100000)}.`,
                user.getCache('fraction_id')
            );
        }

        /*
        else if (item.cargoUnloadAll) {
            UIMenu.Menu.HideMenu();
            try {
                if (user.getCache('fraction_id2') > 0) {
                    if (veh.getVariable('cargoId') !== null && veh.getVariable('cargoId') !== undefined) {
                        let boxes = JSON.parse(veh.getVariable('box'));
                        boxes.forEach((item, i) => {
                            if (item >= 0)
                            {
                                setTimeout(function () {
                                    mp.events.callRemote('server:vehicle:cargoUnload', i);
                                }, methods.getRandomInt(0, 2000));
                            }
                        });
                    }
                }
            }
            catch (e) {
                
            }
        }*/
        else if (item.emsUnloadAll) {
            UIMenu.Menu.HideMenu();
            mp.events.callRemote('server:ems:vehicleUnload');
        }
        else if (item.usmcUnloadAll) {
            UIMenu.Menu.HideMenu();
            mp.events.callRemote('server:usmc:vehicleUnload');
        }
        else if (item.eventName == 'server:vehicle:setNeonColor') {
            UIMenu.Menu.HideMenu();
            mp.game.ui.notifications.show('Введите цвет ~r~R~g~G~b~B');
            let r = await UIMenu.Menu.GetUserInput("R", "", 3);
            let g = await UIMenu.Menu.GetUserInput("G", "", 3);
            let b = await UIMenu.Menu.GetUserInput("B", "", 3);
            if (r > 255)
                r = 255;
            if (g > 255)
                g = 255;
            if (b > 255)
                b = 255;

            if (r < 0 || g < 0 || b < 0) {
                mp.game.ui.notifications.show('~r~Цвет не должен быть меньше 0');
                return;
            }
            mp.events.callRemote(item.eventName, methods.parseInt(r), methods.parseInt(g), methods.parseInt(b));
        }
    });
};


menuList.showLocalCodeMenu = function() {

    UIMenu.Menu.Create("Коды", "~b~Локальные коды");

    UIMenu.Menu.AddMenuItem("Код 0", "Необходима немедленная поддержка", {code: 0});
    UIMenu.Menu.AddMenuItem("Код 1", "Информация подтверждена", {code: 1});
    UIMenu.Menu.AddMenuItem("Код 2", "Приоритетный вызов~br~(без сирен/со стобоскопами)", {code: 2});
    UIMenu.Menu.AddMenuItem("Код 3", "Срочный вызов~br~(сирены, стробоскопы)", {code: 3});
    UIMenu.Menu.AddMenuItem("Код 4", "Помощь не требуется.~br~Все спокойно", {code: 4});
    UIMenu.Menu.AddMenuItem("Код 5", "Держаться подальше", {code: 5});
    UIMenu.Menu.AddMenuItem("Код 6", "Задерживаюсь на месте", {code: 6});
    UIMenu.Menu.AddMenuItem("Код 7", "Перерыв на обед", {code: 7});
    //UIMenu.Menu.AddMenuItem("Код 8", "Необходим сотрудник пожарного департамента", {code: 87});
    //UIMenu.Menu.AddMenuItem("Код 9", "Необходим сотрудник EMS", {code: 9});
    UIMenu.Menu.AddMenuItem("Код 77", "Осторожно, возможна засада", {code: 77});
    UIMenu.Menu.AddMenuItem("Код 99", "Черезвычайная ситуация", {code: 99});
    UIMenu.Menu.AddMenuItem("Код 100", "В состоянии перехвата", {code: 100});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();
    
    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        dispatcher.codeLocal(item.code, user.getCache('name'));
    });
};

menuList.showDepCodeMenu = function() {

    UIMenu.Menu.Create("Коды", "~b~Коды департамента");

    UIMenu.Menu.AddMenuItem("Код 0", "Необходима немедленная поддержка", {code: 0});
    UIMenu.Menu.AddMenuItem("Код 1", "Информация подтверждена", {code: 1});
    UIMenu.Menu.AddMenuItem("Код 2", "Приоритетный вызов~br~(без сирен/со стобоскопами)", {code: 2});
    UIMenu.Menu.AddMenuItem("Код 3", "Срочный вызов~br~(сирены, стробоскопы)", {code: 3});
    UIMenu.Menu.AddMenuItem("Код 4", "Помощь не требуется.~br~Все спокойно", {code: 4});
    UIMenu.Menu.AddMenuItem("Код 5", "Держаться подальше", {code: 5});
    UIMenu.Menu.AddMenuItem("Код 6", "Задерживаюсь на месте", {code: 6});
    UIMenu.Menu.AddMenuItem("Код 7", "Перерыв на обед", {code: 7});
    UIMenu.Menu.AddMenuItem("Код 8", "Необходим сотрудник пожарного департамента", {code: 87});
    UIMenu.Menu.AddMenuItem("Код 9", "Необходим сотрудник EMS", {code: 9});
    UIMenu.Menu.AddMenuItem("Код 77", "Осторожно, возможна засада", {code: 77});
    UIMenu.Menu.AddMenuItem("Код 99", "Черезвычайная ситуация", {code: 99});
    UIMenu.Menu.AddMenuItem("Код 100", "В состоянии перехвата", {code: 100});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        dispatcher.codeDep(item.code, user.getCache('name'));
    });
};

/*menuList.showVehicleAutopilotMenu = function() {

    UIMenu.Menu.Create(`Транспорт`, `~b~Меню автопилота`);

    UIMenu.Menu.AddMenuItem("~g~Включить", "", {doName: "enable"});
    UIMenu.Menu.AddMenuItem("~y~Выключить", "", {doName: "disable"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {

        if (item.doName == 'enable') {
            vehicles.enableAutopilot();
        }
        else if (item.doName == 'disable') {
            vehicles.disableAutopilot();
        }
    });
};*/

menuList.showVehicleDoMenu = function() {

    try {
        UIMenu.Menu.Create(`Транспорт`, `~b~Нажмите Enter чтобы применить`);

        let listEn = ["~r~Выкл", "~g~Вкл"];
        let listOp = ["~r~Закрыт", "~g~Открыт"];
        let listWin = ["~r~Закрыто", "~g~Открыто"];

        let actualData = mp.players.local.vehicle.getVariable('vehicleSyncData');

        UIMenu.Menu.AddMenuItemList("Аварийка", listEn, "Поворотники включаются на ~b~[~s~ и ~b~]", {doName: "twoIndicator"}, actualData.IndicatorRightToggle === true && actualData.IndicatorLeftToggle === true ? 1 : 0);


        UIMenu.Menu.AddMenuItemList("Свет в салоне", listEn, "Днём очень плохо видно", {doName: "light"}, actualData.InteriorLight === true ? 1 : 0);
        UIMenu.Menu.AddMenuItemList("Капот", listOp, "", {doName: "hood"}, actualData.Hood === true ? 1 : 0);
        UIMenu.Menu.AddMenuItemList("Багажник", listOp, "", {doName: "trunk"}, actualData.Trunk === true ? 1 : 0);

        let vInfo = methods.getVehicleInfo(mp.players.local.vehicle.model);

        if (
            vInfo.class_name == 'Helicopters' ||
            vInfo.class_name == 'Planes' ||
            vInfo.class_name == 'Cycles' ||
            vInfo.class_name == 'Motorcycles' ||
            vInfo.class_name == 'Boats'
        ) {
        }
        else {

            try {
                UIMenu.Menu.AddMenuItemList("Левое окно", listWin, "", {doName: "windowLeft"}, actualData.Window[0] ? 1 : 0);
                UIMenu.Menu.AddMenuItemList("Правое окно", listWin, "", {doName: "windowRight"}, actualData.Window[1] ? 1 : 0);
            }
            catch (e) {}

            UIMenu.Menu.AddMenuItem("Лимит контроль", "Введите значение", {doName: "cruise"});
        }

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
        UIMenu.Menu.Draw();

        let listIndex = 0;
        UIMenu.Menu.OnList.Add((item, index) => {
            listIndex = index;

            if (item.doName == 'light') {
                if (vehicles.currentData && vehicles.currentData.get('s_elec') < 20) {
                    mp.game.ui.notifications.show('~r~Свет в салоне не работает из-за повреждений в электроннике');
                    return;
                }
                vehicles.setInteriorLightState(listIndex == 1);
            }
            if (item.doName == 'hood') {
                vehicles.setHoodState(listIndex == 1);
            }
            if (item.doName == 'trunk') {
                vehicles.setTrunkState(listIndex == 1);
            }
            if (item.doName == 'windowLeft') {
                vehicles.setWindowState(0, listIndex);
            }
            if (item.doName == 'windowRight') {
                vehicles.setWindowState(1, listIndex);
            }
            if (item.doName == 'twoIndicator') {
                if (vehicles.currentData && vehicles.currentData.get('s_elec') < 20) {
                    mp.game.ui.notifications.show('~r~Аварийка не работает из-за повреждений в электроннике');
                    return;
                }
                vehicles.setIndicatorLeftState(listIndex == 1);
                vehicles.setIndicatorRightState(listIndex == 1);
            }
        });

        UIMenu.Menu.OnSelect.Add(async (item, index) => {

            if (item.doName == 'cruise') {
                UIMenu.Menu.HideMenu();
                let speed = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите скорость", "", 4));
                if (user.getCache('s_hud_speed_type')) {
                    let vSpeed = methods.parseInt(vehicles.getSpeedMax(mp.players.local.vehicle.model));
                    if (speed > vSpeed || speed < 0)
                        speed = 0;
                }
                else
                {
                    let vSpeed = methods.parseInt(vehicles.getSpeedMax(mp.players.local.vehicle.model) / 1.609);
                    if (speed > vSpeed || speed < 0)
                        speed = 0;
                }
                mp.events.call('client:setNewMaxSpeed', speed);
            }
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showVehicleStatsMenu = async function(veh) {

    let vInfo = methods.getVehicleInfo(veh.model);
    UIMenu.Menu.Create(`Транспорт`, `~b~Характеристики транспорта`);

    UIMenu.Menu.AddMenuItem("~b~Номер: ", "", {}, `${veh.getNumberPlateText()}`);
    UIMenu.Menu.AddMenuItem("~b~Класс: ", "", {}, `${vInfo.class_name_ru}`);
    UIMenu.Menu.AddMenuItem("~b~Модель: ", "", {}, `${vInfo.display_name}`);
    if (vInfo.price > 0)
        UIMenu.Menu.AddMenuItem("~b~Гос. стоимость: ", "", {}, `~g~${methods.moneyFormat(vInfo.price)}`);
    if (vInfo.fuel_type > 0) {
        UIMenu.Menu.AddMenuItem("~b~Тип топлива: ", "", {}, `${vehicles.getFuelLabel(vInfo.fuel_type)}`);
        UIMenu.Menu.AddMenuItem("~b~Вместимость бака: ", "", {}, `${vInfo.fuel_full}${vehicles.getFuelPostfix(vInfo.fuel_type)}`);
        UIMenu.Menu.AddMenuItem("~b~Расход топлива: ", "", {}, `${vInfo.fuel_min}${vehicles.getFuelPostfix(vInfo.fuel_type)}`);
    }
    else
        UIMenu.Menu.AddMenuItem("~b~Расход топлива: ", "", {}, `~r~Отсутствует`);

    if (vInfo.stock > 0) {
        UIMenu.Menu.AddMenuItem("~b~Объем багажника: ", "", {}, `${vInfo.stock}см³`);
        let stockFull = vInfo.stock_full;
        if (vInfo.stock_full > 0)
            stockFull = stockFull / 1000;
        UIMenu.Menu.AddMenuItem("~b~Допустимый вес: ", "", {}, `${stockFull}кг.`);
    }
    else {
        UIMenu.Menu.AddMenuItem("~b~Багажник: ", "", {}, `~r~Отсутствует`);
    }

    if (veh.getVariable('user_id') > 0) {
        let car = await vehicles.getData(veh.getVariable('container'));
        let vClass = veh.getClass();

        UIMenu.Menu.AddMenuItem("~y~Состояние: ", "", {}, ``);
        UIMenu.Menu.AddMenuItem("~b~Пробег: ", "", {}, `${methods.parseFloat(car.get('s_km') + (timer.distInVehicle / 1000)).toFixed(2)}км`);

        if (vClass < 13 || vClass > 16) {
            UIMenu.Menu.AddMenuItem("~b~Двигатель: ", "При поломке может глохнуть и уменьшается максимальная скорость", {}, `${methods.procColorFormat(car.get('s_eng'))}%`);
            UIMenu.Menu.AddMenuItem("~b~Трансмиссия: ", "Уменьшается максимальная скорость", {}, `${methods.procColorFormat(car.get('s_trans'))}%`);
            UIMenu.Menu.AddMenuItem("~b~Шины: ", "Может лопнуть колесо", {}, `${methods.procColorFormat(car.get('s_whel'))}%`);
            UIMenu.Menu.AddMenuItem("~b~Электроника: ", "При поломке, не работает  электроника", {}, `${methods.procColorFormat(car.get('s_elec'))}%`);
            UIMenu.Menu.AddMenuItem("~b~Топливная система: ", "При поломке больший расход топлива", {}, `${methods.procColorFormat(car.get('s_fuel'))}%`);
            UIMenu.Menu.AddMenuItem("~b~Тормозная система: ", "При поломке могут не сработать тормоза", {}, `${methods.procColorFormat(car.get('s_break'))}%`);
        }

        UIMenu.Menu.AddMenuItem("~y~Разное: ", "", {}, ``);
        UIMenu.Menu.AddMenuItem("~b~Спец. покрышки: ", "", {}, `${car.get('is_tyre') ? '~y~Установлено' : '~r~Отсутствует'}`);
        UIMenu.Menu.AddMenuItem("~b~Цветные фары: ", "", {}, `${car.get('colorl') >= 0 ? '~y~Установлено' : '~r~Отсутствует'}`);
        UIMenu.Menu.AddMenuItem("~b~Неон: ", "", {}, `${car.get('is_neon') ? '~y~Установлено' : '~r~Отсутствует'}`);
        UIMenu.Menu.AddMenuItem("~b~Удаленное управление: ", "", {}, `${car.get('is_special') ? '~y~Установлено' : '~r~Отсутствует'}`);

        UIMenu.Menu.AddMenuItem("~y~Тюнинг: ", "", {}, ``);

        let upgradeList = {};
        try {
            upgradeList = JSON.parse(car.get('upgrade'))
        }
        catch (e) {}

        try {
            for (const [key, value] of Object.entries(upgradeList)) {
                let mod = methods.parseInt(key);
                let val = methods.parseInt(value);
                if (mod >= 100) {
                    if (value >= 0)
                        UIMenu.Menu.AddMenuItem(`~b~${enums.lscSNames[mod - 100][0]}: `, "Нажмите Enter чтобы сбросить настройки", {resetIdx: mod - 100}, `${value}`);
                }
                else if (val >= 0) {
                    let label = mp.game.ui.getLabelText(veh.getModTextLabel(mod, val));
                    if (label == "NULL" || label == "")
                        label = `${enums.lscNames[mod][0]} #${(val + 1)}`;
                    UIMenu.Menu.AddMenuItem(`~b~${enums.lscNames[mod][0]}: `, "", {}, `${label}`);
                }
            }
        }
        catch (e) {
            
        }
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.resetIdx >= 0) {
            mp.events.callRemote('server:lsc:resetSTun', item.resetIdx);
        }
    });
};

menuList.showSpawnJobCarMenu = function(price, x, y, z, heading, name, job) {

    UIMenu.Menu.Create(`Работа`, `~b~Меню рабочего ТС`);

    UIMenu.Menu.AddMenuItem("Арендовать рабочий транспорт", "Стоимость: ~g~" + methods.moneyFormat(price), {doName: "spawnCar"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName == 'spawnCar') {

            if (user.getMoney() < price) {
                mp.game.ui.notifications.show(`~r~У Вас недостаточно средств`);
                return;
            }

            user.removeMoney(methods.parseFloat(price), 'Аренда рабочего ТС');
            vehicles.spawnJobCar(x, y, z, heading, name, job);
        }
    });
};

menuList.showSpawnJobGr6Menu = function() {

    UIMenu.Menu.Create(`Gruppe6`, `~b~Меню Gruppe6`);

    UIMenu.Menu.AddMenuItem("~g~Начать рабочий день", "", {doName: "startDuty"});
    UIMenu.Menu.AddMenuItem("Арендовать транспорт", 'Цена за аренду: ~g~$500~s~~br~Залог: ~g~$4,500', {doName: "spawnCar"});
    UIMenu.Menu.AddMenuItem("~b~Стандартное вооружение (Taurus PT92)", 'Цена: ~g~$3,000', {doName: "getMore0"});
    //UIMenu.Menu.AddMenuItem("~b~Доп. вооружение (MP5A3 + Бронежилет)", 'Цена: ~g~$10,000').doName = 'getMore1';
    UIMenu.Menu.AddMenuItem("~r~Закончить рабочий день", "", {doName: "stopDuty"});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName == 'startDuty') {
            if (!user.getCache('gun_lic')) {
                mp.game.ui.notifications.show("~r~У Вас нет лицензии на оружие");
                return;
            }

            mp.events.callRemote('server:uniform:gr6');
            Container.Data.SetLocally(0, 'is6Duty', true);

            user.setArmour(20);

            mp.game.ui.notifications.show("~g~Вы вышли на дежурство");
        }
        if (item.doName == 'getMore0') {

            if (!user.getCache('gun_lic')) {
                mp.game.ui.notifications.show("~r~У Вас нет лицензии на оружие");
                return;
            }

            if (user.getCashMoney() < 3000) {
                mp.game.ui.notifications.show("~r~У Вас нет на руках $3000");
                return;
            }

            mp.events.callRemote('server:gun:buy', 77, 2250, 1, 0, 5, 0);
            mp.events.callRemote('server:gun:buy', 280, 850, 1, 0, 5, 0);
            user.setArmour(40);

            mp.game.ui.notifications.show("~g~Вы взяли стандартное вооружение");
        }
        /*if (item.doName == 'getMore1') {
            if (!Container.Data.HasLocally(0, 'is6Duty')) {
                mp.game.ui.notifications.show("~r~Вы не вышли на дежурство");
                return;
            }
            if (user.getCashMoney() < 10000) {
                mp.game.ui.notifications.show("~r~У Вас нет на руках $10,000");
                return;
            }

            mp.events.callRemote('server:gun:buy', 103, 9250, 1, 0, 5, 0);
            mp.events.callRemote('server:gun:buy', 280, 850, 1, 0, 5, 0);

            user.setArmour(100);
            mp.game.ui.notifications.show("~g~Вы купили MP5 и взяли в аренду бронежилет.");
        }*/
        if (item.doName == 'stopDuty') {
            user.giveUniform(0);
            user.setArmour(0);
            mp.game.ui.notifications.show("~y~Вы закончили дежурство и сдали бронежилет.");
            Container.Data.ResetLocally(0, 'is6Duty');
        }
        if (item.doName == 'spawnCar') {

            if (!Container.Data.HasLocally(0, 'is6Duty')) {
                mp.game.ui.notifications.show(`~r~Для начала необходимо выйти на дежурство`);
                return;
            }

            if (user.getMoney() < 5000) {
                mp.game.ui.notifications.show(`~r~У Вас недостаточно средств`);
                return;
            }

            user.removeMoney(5000.0001, 'Аренда рабочего ТС: Stockade');
            vehicles.spawnJobCar(-19.704904556274414, -671.88427734375, 31.945446014404297, 186.04244995117188, 'Stockade', 10);
        }
    });
};

menuList.showSpawnJobCarMailMenu = function() {

    UIMenu.Menu.Create(`Работа`, `~b~Меню рабочего ТС`);

    UIMenu.Menu.AddMenuItem("Boxville", "Стоимость: ~g~" + methods.moneyFormat(100), {doName: "spawnCar1"});
    UIMenu.Menu.AddMenuItem("Pony", "Стоимость: ~g~" + methods.moneyFormat(500), {doName: "spawnCar2"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName == 'spawnCar1') {

            if (user.getMoney() < 100) {
                mp.game.ui.notifications.show(`~r~У Вас недостаточно средств`);
                return;
            }
            user.removeMoney(100, 'Аренда рабочего ТС');
            vehicles.spawnJobCar(70.36360168457031, 121.7760009765625, 79.07405090332031, 159.3450927734375, "Boxville2", 4);
        }
        if (item.doName == 'spawnCar2') {

            if (user.getMoney() < 500) {
                mp.game.ui.notifications.show(`~r~У Вас недостаточно средств`);
                return;
            }
            user.removeMoney(500, 'Аренда рабочего ТС');
            vehicles.spawnJobCar(61.768699645996094, 125.43084716796875, 78.99858856201172, 158.8726806640625, "Pony", 4);
        }
    });
};

menuList.showSpawnJobCarTaxiMenu = function() {

    UIMenu.Menu.Create(`Работа`, `~b~Меню рабочего ТС`);

    UIMenu.Menu.AddMenuItem("Dynasty", "Стоимость: ~g~" + methods.moneyFormat(100), {doName: "spawnCar1"});
    UIMenu.Menu.AddMenuItem("Issi", "Стоимость: ~g~" + methods.moneyFormat(200), {doName: "spawnCar2"});
    UIMenu.Menu.AddMenuItem("Stanier", "Стоимость: ~g~" + methods.moneyFormat(500), {doName: "spawnCar3"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName == 'spawnCar1') {
            if (!user.getCache('taxi_lic')) {
                mp.game.ui.notifications.show(`~r~У Вас нет лицензии на перевозку пассажиров`);
                return;
            }
            if (user.getMoney() < 100) {
                mp.game.ui.notifications.show(`~r~У Вас недостаточно средств`);
                return;
            }
            user.removeMoney(100, 'Аренда рабочего ТС');
            vehicles.spawnJobCar(897.9505615234375, -183.98391723632812, 73.38378143310547, 241.78759765625, "Dynasty", 99);
        }
        if (item.doName == 'spawnCar2') {
            if (!user.getCache('taxi_lic')) {
                mp.game.ui.notifications.show(`~r~У Вас нет лицензии на перевозку пассажиров`);
                return;
            }
            if (user.getMoney() < 200) {
                mp.game.ui.notifications.show(`~r~У Вас недостаточно средств`);
                return;
            }
            user.removeMoney(200, 'Аренда рабочего ТС');
            vehicles.spawnJobCar(897.9505615234375, -183.98391723632812, 73.38378143310547, 241.78759765625, "Issi3", 99);
        }
        if (item.doName == 'spawnCar3') {
            if (!user.getCache('taxi_lic')) {
                mp.game.ui.notifications.show(`~r~У Вас нет лицензии на перевозку пассажиров`);
                return;
            }
            if (user.getMoney() < 500) {
                mp.game.ui.notifications.show(`~r~У Вас недостаточно средств`);
                return;
            }
            user.removeMoney(500, 'Аренда рабочего ТС');
            vehicles.spawnJobCar(897.9505615234375, -183.98391723632812, 73.38378143310547, 241.78759765625, "Taxi", 99);
        }
    });
};

menuList.showSellItemsMenu = function(data) {

    try {
        UIMenu.Menu.Create('Конфискат', `~b~Сдача конфиската`);

        data.forEach((item, idx) => {
            let formatItem = items.getItemFormat(item);
            let desc = formatItem.desc;
            let itemName = formatItem.name;
            let price = items.getItemPrice(item.item_id);
            if (price === 111111)
                price = 100;
            UIMenu.Menu.AddMenuItem(`${itemName}`, `${desc}~br~Цена: ~g~${methods.moneyFormat(price)}`, {itemId: item.item_id, id: item.id, desc: desc, price: price});
        });

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            UIMenu.Menu.HideMenu();
            if (item.itemId >= 0) {
                try {
                    coffer.addMoney(coffer.getIdByFraction(user.getCache('fraction_id')), item.price);
                    inventory.deleteItem(item.id);

                    methods.saveFractionLog(
                        user.getCache('name'),
                        `Сдал ${items.getItemNameById(item.itemId)}`,
                        `Пополнено: ${methods.moneyFormat(item.price)}`,
                        user.getCache('fraction_id')
                    );

                    user.addHistory(5, `Сдал ${items.getItemNameById(item.itemId)} ${item.desc}`);

                    mp.game.ui.notifications.show("~b~Вы сдали конфискат, бюджет организации был пополнен");
                }
                catch (e) {
                    methods.debug(e);
                }
            }
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showTradeMenu = function(data, ownerId, ownerType) {

    try {

        let list = [];

        ['Оружие', 'Модули на оружие', 'Патроны', 'Наркотики', 'Медикаменты', 'Еда и напитки', 'Маски', 'Одежда', 'Рыба', 'Остальное'].forEach((cat, i) => {
            let fullItem = {
                title: cat,
                items: []
            };
            data.forEach(item => {

                try { //Скидка от обычной цены

                    if (!items.isWeapon(item.item_id) && i === 0) return;
                    else if (!items.isWeaponComponent(item.item_id) && i === 1) return;
                    else if (!items.isAmmo(item.item_id) && i === 2) return;
                    else if (!items.isDrug(item.item_id) && i === 3) return;
                    else if (!items.isMed(item.item_id) && i === 4) return;
                    else if (!items.isEat(item.item_id) && i === 5) return;
                    else if (!items.isMask(item.item_id) && i === 6) return;
                    else if (!items.isCloth(item.item_id) && i === 7) return;
                    else if (!items.isFish(item.item_id) && i === 8) return;
                    else if (
                        (items.isWeapon(item.item_id) ||
                        items.isWeaponComponent(item.item_id) ||
                        items.isAmmo(item.item_id) ||
                        items.isDrug(item.item_id) ||
                        items.isMed(item.item_id) ||
                        items.isEat(item.item_id) ||
                        items.isMask(item.item_id) ||
                        items.isCloth(item.item_id) ||
                        items.isFish(item.item_id)) &&
                        i === 9) return;

                    let formatItem = items.getItemFormat(item);
                    let itemPrice = items.getItemPrice(item.item_id) * 2;
                    let sale = item.price / itemPrice * 100;
                    sale = methods.parseInt(100 - sale);
                    if (itemPrice === 222222)
                        sale = 0;
                    if (sale < 0)
                        sale = 0;
                    if (sale > 100)
                        sale = 100;
                    let itemName = formatItem.name;
                    let price = item.price;
                    fullItem.items.push({ //Если кликаем сюда, то открывается меню справа (Там где покупка)
                        title: methods.removeQuotesAll(itemName),
                        desc: formatItem.desc,
                        desc2: '',
                        desc2t: '',
                        sale: sale,
                        img: `Item_${item.item_id}.png`,
                        price: methods.moneyFormat(price),
                        params: {t: 'tm', id: item.id, price: price, name: itemName, ownerId: ownerId}
                    })

                    methods.debug(cat, itemName)
                }
                catch (e) {

                    methods.debug(e)
                }

            });
            if (fullItem.items.length > 0)
                list.push(fullItem);
        });

        shopMenu.showShop();
        shopMenu.updateShop(list, 'h1', '#071300');

        /*UIMenu.Menu.Create(' ', `~b~Торговая площадка`, 'hm', false, false, 'h1');

        data.forEach((item, idx) => {
            let formatItem = items.getItemFormat(item);
            let desc = formatItem.desc + '~br~' + items.getItemNameById(item.item_id);
            let itemName = formatItem.name;
            let price = item.price;
            UIMenu.Menu.AddMenuItem(`${itemName}`, `${desc}~br~Цена: ~g~${methods.moneyFormat(price)}`, {itemId: item.item_id, id: item.id, desc: desc, price: price, name: itemName});
        });

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            UIMenu.Menu.HideMenu();
            if (item.itemId >= 0) {
                mp.events.callRemote('server:tradeMarket:buy', item.id, item.price, item.name, ownerId);
            }
        });*/
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showSellGunMenu = function(data) {

    try {
        UIMenu.Menu.Create('Переплав', `~b~Обмен оружия на стальные пластины`);

        data.forEach((item, idx) => {
            let formatItem = items.getItemFormat(item);
            let desc = formatItem.desc;
            let itemName = formatItem.name;
            let count = 1;
            if (item.item_id >= 85 && item.item_id <= 126)
                count = 2;
            UIMenu.Menu.AddMenuItem(`${itemName}`, `${desc}~br~Взнос: ~g~$100~s~~br~Кол-во: ~g~${count}шт.`, {count: count, id: item.id});
        });

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            UIMenu.Menu.HideMenu();
            if (item.id >= 0) {
                try {
                    if (user.getMoney() < 100) {
                        mp.game.ui.notifications.show("~r~У вас нет $100 на руках");
                        return;
                    }
                    user.removeMoney(100, 'Обмен стали');
                    inventory.deleteItem(item.id);
                    inventory.addItem(476, item.count, 1, user.getCache('id'), 1);
                    mp.game.ui.notifications.show("~b~Вы обменяли оружие на стальную пластину");
                }
                catch (e) {
                    methods.debug(e);
                }
            }
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showFixGunMenu = function(data) {

    try {
        UIMenu.Menu.Create('Починка', `~b~Починка оружия и бронежилетов`);

        data.forEach((item, idx) => {
            let formatItem = items.getItemFormat(item);
            let desc = formatItem.desc;
            let itemName = formatItem.name;
            UIMenu.Menu.AddMenuItem(`${itemName}`, `${desc}~br~~c~Необходима 1 стальная пластина.`, {id: item.id});
        });

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            UIMenu.Menu.HideMenu();
            if (item.id >= 0) {
                try {
                    mp.events.callRemote('server:inventory:fixItem', item.id)
                }
                catch (e) {
                    methods.debug(e);
                }
            }
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showColorGunMenu = function(data) {

    try {
        UIMenu.Menu.Create('Покраска', `~b~Покраска оружия`);

        data.forEach((item, idx) => {
            let formatItem = items.getItemFormat(item);
            let desc = formatItem.desc;
            let itemName = formatItem.name;
            UIMenu.Menu.AddMenuItem(`${itemName}`, `${desc}~br~~c~Необходим балончик - 5шт.`, {id: item.id, itemName: itemName, itemId: item.item_id});
        });

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            UIMenu.Menu.HideMenu();
            if (item.id >= 0) {
                menuList.showColorGunAcceptMenu(item.id, item.itemName, item.itemId)
            }
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showColorGunAcceptMenu = function(id, name, itemId) {

    try {
        UIMenu.Menu.Create('Покраска', `~b~Покраска оружия`);

        let wpName = items.getItemNameHashById(itemId);
        let componentList = weapons.getWeaponComponentList(wpName);

        UIMenu.Menu.AddMenuItemList(`${name}`, weapons.getTintList(wpName), `Необходим балончик - 5шт.`, {id: id, superTint: 0 });

        componentList.forEach((item, idx) => {
            if (item[3] == 0) {
                UIMenu.Menu.AddMenuItemList(`${name} ${item[1]}`, weapons.getTintList(wpName), `Необходим балончик - 10шт.`, {id: id, superTint: item[2].toString() });
            }
        });

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
        UIMenu.Menu.Draw();

        let listIndex = 0;
        UIMenu.Menu.OnList.Add((item, index) => {
            listIndex = index;
        });

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            UIMenu.Menu.HideMenu();
            if (item.id >= 0) {
                try {
                    mp.events.callRemote('server:inventory:colorGunItem', item.id, listIndex, item.superTint)
                }
                catch (e) {
                    methods.debug(e);
                }
            }
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showFixGunFreeMenu = function(data) {

    try {
        UIMenu.Menu.Create('Починка', `~b~Починка оружия и бронежилетов`);

        data.forEach((item, idx) => {
            let formatItem = items.getItemFormat(item);
            let desc = formatItem.desc;
            let itemName = formatItem.name;
            UIMenu.Menu.AddMenuItem(`${itemName}`, `${desc}.`, {id: item.id});
        });

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            UIMenu.Menu.HideMenu();
            if (item.id >= 0) {
                try {
                    mp.events.callRemote('server:inventory:fixItemFree', item.id)
                }
                catch (e) {
                    methods.debug(e);
                }
            }
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showSellClothMenu = function(data) {

    try {
        UIMenu.Menu.Create('Фабрика', `~b~Обмен одежды на ткань`);

        data.forEach((item, idx) => {
            let formatItem = items.getItemFormat(item);
            let desc = formatItem.desc;
            let itemName = formatItem.name;
            let count = 1;
            if (item.item_id === 265 || item.item_id === 266 || item.item_id === 274)
                count = 2;
            UIMenu.Menu.AddMenuItem(`${itemName}`, `${desc}~br~Взнос: ~g~$50~s~~br~Кол-во: ~g~${count}шт.`, {count: count, id: item.id});
        });

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            UIMenu.Menu.HideMenu();
            if (item.id >= 0) {
                try {
                    if (user.getMoney() < 50) {
                        mp.game.ui.notifications.show("~r~У вас нет $50 на руках");
                        return;
                    }
                    user.removeMoney(50, 'Обмен ткани');
                    inventory.deleteItem(item.id);
                    inventory.addItem(475, item.count, 1, user.getCache('id'), 1);
                    mp.game.ui.notifications.show("~b~Вы обменяли одежду на ткань");
                }
                catch (e) {
                    methods.debug(e);
                }
            }
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showSellFishMenu = async function(data, shopId) {

    try {
        let tradeList = JSON.parse(await Container.Data.Get(-99, 'fishTrade'));

        let procent = methods.parseInt(await business.getPrice(shopId) * 10);
        UIMenu.Menu.Create('Скупка', `~b~Доля владельца: ${procent}%`);

        let priceAll = 0;
        let countFish = 0;

        data.forEach((item, idx) => {

            let price = items.getItemPrice(item.item_id);
            tradeList.forEach(fishItem => {
                if (fishItem[0] === item.item_id)
                    price = fishItem[4];
            });

            priceAll = priceAll + price;
            countFish++;

            let formatItem = items.getItemFormat(item);
            let desc = formatItem.desc;
            let itemName = formatItem.name;
            UIMenu.Menu.AddMenuItem(`${itemName}`, `${desc}~br~Цена: ~g~${methods.moneyFormat(price)}~br~~c~Без учёта процента`, {price: price, id: item.id});
        });

        UIMenu.Menu.AddMenuItem(`~y~Продать всю рыбу`, `Цена: ~g~${methods.moneyFormat(priceAll)}~br~~c~Без учёта процента`, {price: priceAll, countFish: countFish, sellAll: true});

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            UIMenu.Menu.HideMenu();
            if (item.id >= 0) {

                if (!user.getCache('fish_lic')) {
                    mp.game.ui.notifications.show(`~r~У вас нет лицензии рыболова`);
                    return;
                }

                try {
                    quest.fish(false, -1, 3);
                    business.addMoney(shopId, item.price / procent, 'Доля с продажи рыбы');
                    user.addMoney(item.price - (item.price / procent), 'Продажа рыбы');
                    inventory.deleteItem(item.id);
                    mp.game.ui.notifications.show(`~b~Вы продали рыбу по цене: ~s~${methods.moneyFormat(item.price - (item.price / procent))}`);

                    let fId = user.getCache('family_id');
                    if (fId > 0) {
                        let fData = await family.getData(fId);
                        if (fData.get('level') === 5) {
                            if (fData.get('exp') > 100000) {
                                family.addMoney(fId, 7500000, 'Премия за достижения 6 уровня');
                                family.set(fId, 'level', 6);
                                family.set(fId, 'exp', 0);
                            }
                            else
                                family.set(fId, 'exp', fData.get('exp') + 1);
                        }
                    }
                }
                catch (e) {
                    methods.debug(e);
                }
            }
            if (item.sellAll) {
                if (!user.getCache('fish_lic')) {
                    mp.game.ui.notifications.show(`~r~У вас нет лицензии рыболова`);
                    return;
                }
                try {

                    mp.events.callRemote('server:user:sellFish', shopId);
                    quest.fish(false, -1, 3);
                    /*business.addMoney(shopId, item.price / 10, 'Доля с продажи рыбы');
                    user.addMoney(item.price, 'Продажа всей рыбы');
                    inventory.deleteItemsRange(487, 536);
                    mp.game.ui.notifications.show(`~b~Вы продали рыбу по цене: ~s~${methods.moneyFormat(item.price)}`);

                    let fId = user.getCache('family_id');
                    if (fId > 0) {
                        let fData = await family.getData(fId);
                        if (fData.get('level') === 5) {
                            if (fData.get('exp') > 100000) {
                                family.addMoney(fId, 7500000, 'Премия за достижения 6 уровня');
                                family.set(fId, 'level', 6);
                                family.set(fId, 'exp', 0);
                            }
                            else
                                family.set(fId, 'exp', fData.get('exp') + item.countFish);
                        }
                    }*/
                }
                catch (e) {
                    methods.debug(e);
                }
            }
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showToPlayerItemListMenu = async function(data, ownerType, ownerId, isFrisk, justUpdate = false) {

    if (user.isDead()) {
        mp.game.ui.notifications.show("~r~Нельзя использовать инвентарь будучи мёртвым");
        return;
    }

    /*if (user.getCache('jail_time') > 0) { //TODO
        mp.game.ui.notifications.show("~r~В тюрьме нельзя этим пользоваться");
        return;
    }*/

    ownerId = methods.parseInt(ownerId);

    if (justUpdate) {
        if (inventory.ownerId !== ownerId && inventory.ownerType !== ownerType)
            return;
        /*if (ownerId !== user.getCache('id') && inventory.ownerType !== inventory.types.Player) {
            if (inventory.ownerId !== ownerId && inventory.ownerType !== ownerType)
                return;
        }*/
    }

    try {
        //let invAmountMax = await inventory.getInvAmountMax(ownerId, ownerType);
        let sum = 0;
        let currentItems = [];
        let equipItems = [];
        let equipWeapons = [];

        data.forEach((item, idx) => {
            try {
                let params = {};

                try {
                    params = JSON.parse(item.params);
                }
                catch (e) {
                    methods.debug(e);
                }

                if (item.is_equip == 0)
                    sum = sum + items.getItemAmountById(item.item_id);

                let formatItem = items.getItemFormat(item);
                let desc = formatItem.desc;
                if (desc === '')
                    desc = items.getItemAmountById(item.item_id) + 'см3';
                else 
                    desc = desc + ' | ' + items.getItemAmountById(item.item_id) + 'см3';
                let itemName = formatItem.name;

                if (item.is_equip == 1 && ownerType == 1 && ownerId == user.getCache('id')) {

                    let success = true;

                    if (item.item_id == 50) {
                        if (params.number != user.getCache('bank_card')) {
                            inventory.updateEquipStatus(item.id, false);
                            success = false;
                        }
                    }
                    /*if (item.item_id == 252) {
                        user.setArmour(item.count)
                    }*/
                    if (item.item_id <= 30 && item.item_id >= 27) {
                        if (params.number != user.getCache('phone')) {
                            inventory.updateEquipStatus(item.id, false);
                            success = false;
                        }
                    }

                    if (items.isWeapon(item.item_id)) {

                        let slot = weapons.getGunSlotIdByItem(item.item_id);

                        if (params.serial != user.getCache('weapon_' + slot)) {
                            inventory.updateEquipStatus(item.id, false);

                            currentItems.push({
                                id: item.id,
                                item_id: item.item_id,
                                name: itemName,
                                counti: item.count,
                                volume: items.getItemAmountById(item.item_id),
                                desc: desc,
                                params: params
                            });
                            return;
                        }

                        let wpName = items.getItemNameHashById(item.item_id);
                        let wpHash = weapons.getHashByName(wpName);
                        if (!mp.game.invoke(methods.HAS_PED_GOT_WEAPON, mp.players.local.handle, wpHash, false)) {
                            user.giveWeapon(wpName, user.getCache('weapon_' + slot + '_ammo'));

                            user.removeAllWeaponComponentsByHash(wpHash);
                            user.setWeaponTintByHash(wpHash, 0);

                            if (params.slot1)
                                user.giveWeaponComponentByHash(wpHash, params.slot1hash);
                            if (params.slot2)
                                user.giveWeaponComponentByHash(wpHash, params.slot2hash);
                            if (params.slot3)
                                user.giveWeaponComponentByHash(wpHash, params.slot3hash);
                            if (params.slot4)
                                user.giveWeaponComponentByHash(wpHash, params.slot4hash);
                            if (params.superTint)
                                user.giveWeaponComponentByHash(wpHash, params.superTint);
                            if (params.tint)
                                user.setWeaponTintByHash(wpHash, params.tint);

                            ui.callCef('inventory', JSON.stringify({type: "updateSelectWeapon", selectId: item.id}));

                            mp.attachmentMngr.addLocal('WDSP_' + wpName.toUpperCase());
                        }

                        equipWeapons.push({
                            id: item.id,
                            item_id: item.item_id,
                            name: itemName,
                            counti: item.count < 0 ? 100 : item.count,
                            volume: items.getItemAmountById(item.item_id),
                            desc: desc,
                            params: params
                        });
                        return;
                    }

                    if (success) {
                        equipItems.push({
                            id: item.id,
                            item_id: item.item_id,
                            name: itemName,
                            counti: item.count,
                            volume: items.getItemAmountById(item.item_id),
                            desc: desc,
                            params: params
                        });
                    }
                    else {
                        currentItems.push({
                            id: item.id,
                            item_id: item.item_id,
                            name: itemName,
                            counti: item.count,
                            volume: items.getItemAmountById(item.item_id),
                            desc: desc,
                            params: params
                        });
                    }
                }
                else {
                    currentItems.push({
                        id: item.id,
                        item_id: item.item_id,
                        name: itemName,
                        counti: item.count,
                        volume: items.getItemAmountById(item.item_id),
                        desc: desc,
                        params: params
                    });
                }
            } catch (e) {
                methods.debug('menuList.showToPlayerItemListMenu2', e.toString());
            }
        });

        let recepts = [];
        let userRecepts = JSON.parse(user.getCache('recepts'));
        items.recipes.forEach(item => {
            if (userRecepts.includes(item.id) || item.id === 2) {
                recepts.push(item);
            }
            else if (user.getCache('fraction_id2') > 0 && item.id >= 5 && item.id <= 17)
                recepts.push(item);
            else if (user.getCache('fraction_id2') > 0 && item.id === 19)
                recepts.push(item);
        });
        let dataSend4 = {
            type: 'updateCraft',
            recipes: recepts,
        };
        ui.callCef('inventory', JSON.stringify(dataSend4));

        if (ownerType == inventory.types.Player && user.getCache('id') == ownerId) {
            let dataSend = {
                type: 'updateItems',
                items: currentItems,
                ownerId: ownerId,
                ownerType: ownerType,
                sum: sum,
            };

            let dataSend2 = {
                type: 'updateEquipItems',
                items: equipItems
            };

            let dataSend3 = {
                type: 'updateWeaponItems',
                items: equipWeapons
            };

            let slotUse = [];
            let bankEquip = false;
            equipWeapons.forEach(item => {
                let slot = weapons.getGunSlotIdByItem(item.item_id);
                if (item.params.serial == user.getCache('weapon_' + slot))
                    slotUse.push(slot);
            });
            for (let i = 1; i < 6; i++) {
                if (!slotUse.includes(i)) {
                    user.set('weapon_' + i, '');
                    user.set('weapon_' + i + '_ammo', -1);
                }
            }

            methods.debug(JSON.stringify(equipItems));

            user.setInvEquipWeapon(equipWeapons);

            equipItems.forEach(item => {
                if (methods.parseInt(item.item_id) == 50) {
                    if (methods.parseInt(item.params.number) == methods.parseInt(user.getCache('bank_card'))) {
                        bankEquip = true;
                    }
                }
            });
            if (bankEquip === false) {
                inventory.updateItemsEquipByItemId(50, user.getCache('id'), inventory.types.Player, 0);
                user.set('bank_card', 0);
                user.set('bank_owner', '');
                user.set('bank_pin', 0);
                user.setBankMoney(0);
                user.save();
            }

            ui.callCef('inventory', JSON.stringify(dataSend));
            ui.callCef('inventory', JSON.stringify(dataSend2));
            ui.callCef('inventory', JSON.stringify(dataSend3));
        }
        else {

            if (isFrisk) {
                UIMenu.Menu.Create(`Обыск`, `~b~Обыск игрока`);
                currentItems.forEach(item => {
                    UIMenu.Menu.AddMenuItem(`${item.name}`, `${item.desc}`, {});
                });
                UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
                UIMenu.Menu.Draw();
            }
            else {
                let dataSend = {
                    type: 'updateSubItems',
                    items: currentItems,
                    ownerId: ownerId,
                    ownerType: ownerType,
                    sum: sum,
                };
                ui.callCef('inventory', JSON.stringify(dataSend));
                if (!justUpdate)
                {
                    inventory.show();
                    mp.gui.cursor.show(true, true);
                    inventory.ownerId = ownerId;
                    inventory.ownerType = ownerType;
                }
                ui.callCef('inventory', JSON.stringify({type: "updateSubMax", maxSum: await inventory.getInvAmountMax(ownerId, ownerType)}));
            }
        }

        inventory.setInvAmount(ownerId, ownerType, sum);
    }
    catch (e) {
       methods.debug('menuList.showToPlayerItemListMenu', e);
    }
};


menuList.showToPlayerItemListAddMenu = async function(data, ownerType, ownerId, isFrisk) {

    if (user.isDead()) {
        return;
    }

    ownerId = methods.parseInt(ownerId);

    try {
        //let invAmountMax = await inventory.getInvAmountMax(ownerId, ownerType);
        let sum = 0;
        let currentItems = [];
        let equipItems = [];
        let equipWeapons = [];

        data.forEach((item, idx) => {
            try {
                let params = {};

                try {
                    params = JSON.parse(item.params);
                }
                catch (e) {
                    methods.debug(e);
                }

                if (item.is_equip == 0)
                    sum = sum + items.getItemAmountById(item.item_id);

                let formatItem = items.getItemFormat(item);
                let desc = formatItem.desc;
                let itemName = formatItem.name;

                if (item.is_equip == 1 && ownerType == 1 && ownerId == user.getCache('id')) {

                    let success = true;

                    if (item.item_id == 50) {
                        if (params.number != user.getCache('bank_card')) {
                            inventory.updateEquipStatus(item.id, false);
                            success = false;
                        }
                    }
                    /*if (item.item_id == 252) {
                        user.setArmour(item.count)
                    }*/
                    if (item.item_id <= 30 && item.item_id >= 27) {
                        if (params.number != user.getCache('phone')) {
                            inventory.updateEquipStatus(item.id, false);
                            success = false;
                        }
                    }

                    if (items.isWeapon(item.item_id)) {

                        let slot = weapons.getGunSlotIdByItem(item.item_id);

                        if (params.serial != user.getCache('weapon_' + slot)) {
                            inventory.updateEquipStatus(item.id, false);

                            currentItems.push({
                                id: item.id,
                                item_id: item.item_id,
                                name: itemName,
                                counti: item.count,
                                volume: items.getItemAmountById(item.item_id),
                                desc: desc,
                                params: params
                            });
                            return;
                        }

                        let wpName = items.getItemNameHashById(item.item_id);
                        let wpHash = weapons.getHashByName(wpName);
                        if (!mp.game.invoke(methods.HAS_PED_GOT_WEAPON, mp.players.local.handle, wpHash, false)) {
                            user.giveWeapon(wpName, user.getCache('weapon_' + slot + '_ammo'));

                            user.removeAllWeaponComponentsByHash(wpHash);
                            user.setWeaponTintByHash(wpHash, 0);

                            if (params.slot1)
                                user.giveWeaponComponentByHash(wpHash, params.slot1hash);
                            if (params.slot2)
                                user.giveWeaponComponentByHash(wpHash, params.slot2hash);
                            if (params.slot3)
                                user.giveWeaponComponentByHash(wpHash, params.slot3hash);
                            if (params.slot4)
                                user.giveWeaponComponentByHash(wpHash, params.slot4hash);
                            if (params.superTint)
                                user.giveWeaponComponentByHash(wpHash, params.superTint);
                            if (params.tint)
                                user.setWeaponTintByHash(wpHash, params.tint);

                            ui.callCef('inventory', JSON.stringify({type: "updateSelectWeapon", selectId: item.id}));

                            mp.attachmentMngr.addLocal('WDSP_' + wpName.toUpperCase());
                        }

                        equipWeapons.push({
                            id: item.id,
                            item_id: item.item_id,
                            name: itemName,
                            counti: item.count < 0 ? 100 : item.count,
                            volume: items.getItemAmountById(item.item_id),
                            desc: desc,
                            params: params
                        });
                        return;
                    }

                    if (success) {
                        equipItems.push({
                            id: item.id,
                            item_id: item.item_id,
                            name: itemName,
                            counti: item.count,
                            volume: items.getItemAmountById(item.item_id),
                            desc: desc,
                            params: params
                        });
                    }
                    else {
                        currentItems.push({
                            id: item.id,
                            item_id: item.item_id,
                            name: itemName,
                            counti: item.count,
                            volume: items.getItemAmountById(item.item_id),
                            desc: desc,
                            params: params
                        });
                    }
                }
                else {
                    currentItems.push({
                        id: item.id,
                        item_id: item.item_id,
                        name: itemName,
                        counti: item.count,
                        volume: items.getItemAmountById(item.item_id),
                        desc: desc,
                        params: params
                    });
                }
            } catch (e) {
                methods.debug('menuList.showToPlayerItemListMenu2', e.toString());
            }
        });

        if (ownerType == inventory.types.Player && user.getCache('id') == ownerId) {

        }
        else {
            if (isFrisk) {
            }
            else {
                let dataSend = {
                    type: 'addSubItems',
                    items: currentItems,
                    ownerId: ownerId,
                    ownerType: ownerType,
                    sum: sum,
                };
                ui.callCef('inventory', JSON.stringify(dataSend));
            }
        }
    }
    catch (e) {
       methods.debug('menuList.showToPlayerItemListMenu', e);
    }
};

menuList.showBankMenu = async function(bankId, price) {

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    let getBankPrefix = user.getBankCardPrefix();

    let title = '';
    if (bankId === 1)
        title = 'b_mb';
    if (bankId === 2)
        title = 'b_pacific';
    if (bankId === 3)
        title = 'b_fleeca';
    if (bankId === 4)
        title = 'b_blaine';

    if (
        bankId == 1 && getBankPrefix == 6000 ||
        bankId == 2 && getBankPrefix == 7000 ||
        bankId == 3 && getBankPrefix == 8000 ||
        bankId == 4 && getBankPrefix == 9000
    ) {

        let pin = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите пинкод", "", 4));

        if (pin == user.getCache('bank_pin')) {
            UIMenu.Menu.Create(` `, `~b~Нажмите ~g~Enter~b~, чтобы выбрать пункт`, 'bank', false, false, title);
            UIMenu.Menu.AddMenuItem("~b~Баланс", "", {}, '~g~' + methods.moneyFormat(user.getBankMoney(), 99999999999));
            UIMenu.Menu.AddMenuItem("~b~Номер карты", "", {}, methods.bankFormat(user.getCache('bank_card')));
            UIMenu.Menu.AddMenuItem("~b~Владелец карты", "", {}, methods.bankFormat(user.getCache('bank_owner')));

            UIMenu.Menu.AddMenuItem("Снять средства", "", {eventName: "server:bank:withdraw"});
            UIMenu.Menu.AddMenuItem("Положить средства", "", {eventName: "server:bank:deposit"});
            UIMenu.Menu.AddMenuItem("Перевести на другой счет", '1% от суммы, при переводе', {eventName: "server:bank:transferMoney"});

            //UIMenu.Menu.AddMenuItem("~b~История по счёту").eventName = 'server:bank:history';

            UIMenu.Menu.AddMenuItem("~y~Сменить пинкод", "", {eventName: "server:bank:changePin"});
            UIMenu.Menu.AddMenuItem("~r~Закрыть счёт", "", {eventName: "server:bank:closeCard"});
            UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
            UIMenu.Menu.Draw();

            UIMenu.Menu.OnSelect.Add(async (item, index) => {
                UIMenu.Menu.HideMenu();
                if (item.eventName == 'server:bank:withdraw') {
                    let mStr = await UIMenu.Menu.GetUserInput("Сумма снятия", "", 9);
                    if (mStr == '')
                        return;
                    let money = methods.parseFloat(mStr);
                    if (money < 1)
                        return;
                    if (user.getBankMoney() > money)
                        user.setCache('money_bank', user.getBankMoney() - methods.parseFloat(money));
                    mp.events.callRemote(item.eventName, money, 0);
                }
                else if (item.eventName == 'server:bank:deposit') {
                    let mStr = await UIMenu.Menu.GetUserInput("Сумма внесения", "", 9);
                    if (mStr == '')
                        return;
                    let money = methods.parseFloat(mStr);
                    if (money < 1)
                        return;
                    mp.events.callRemote(item.eventName, money, 0);
                }
                else if (item.eventName == 'server:bank:transferMoney') {
                    let bankNumber = methods.parseInt(await UIMenu.Menu.GetUserInput("Номер карты", "", 16));
                    if (bankNumber < 9999)
                        return;
                    let money = methods.parseFloat(await UIMenu.Menu.GetUserInput("Сумма перевода", "", 9));
                    if (money < 0)
                        return;
                    mp.events.callRemote(item.eventName, bankNumber.toString(), money);
                }
                else if (item.eventName == 'server:bank:changePin') {
                    let pin1 = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите пинкод", "", 4));
                    let pin2 = methods.parseInt(await UIMenu.Menu.GetUserInput("Повторите пинкод", "", 4));
                    if (pin1 == pin2)
                        mp.events.callRemote(item.eventName, pin1);
                    else
                        mp.game.ui.notifications.show(`~r~Пинкоды не совпадают`);
                }
                else if (item.eventName == 'server:bank:history') {
                    mp.events.callRemote(item.eventName);
                }
                else if (item.eventName == 'server:bank:changeCardNumber') {
                    let bankNumber = methods.parseInt(await UIMenu.Menu.GetUserInput("Желаемый номер карты", "", 9));
                    mp.events.callRemote(item.eventName, bankNumber);
                }
                else if (item.eventName == 'server:bank:closeCard') {
                    mp.events.callRemote(item.eventName);
                }
            });
        }
        else {
            mp.game.ui.notifications.show(`~r~Вы ввели не верный пинкод`);
        }
    }
    else {
        UIMenu.Menu.Create(` `, `~b~Нажмите ~g~Enter~b~, чтобы выбрать пункт`, 'bank', false, false, title);
        UIMenu.Menu.AddMenuItem("Оформить карту банка", "Цена: ~g~$" + (price * 100), {eventName: "server:bank:openCard"});
        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnSelect.Add(async (item, index) => {
            UIMenu.Menu.HideMenu();
            if (item.eventName == 'server:bank:openCard') {
                mp.events.callRemote(item.eventName, bankId, price * 100);
            }
        });
    }
};

menuList.showAtmMenu = async function() {
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    if (user.getCache('bank_card') < 1) {
        mp.game.ui.notifications.show("~r~У Вас нет банковской карты");
        return;
    }

    let pin = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите пинкод", "", 4));
    if (pin != user.getCache('bank_pin')) {
        mp.game.ui.notifications.show(`~r~Вы ввели не верный пинкод`);
        return;
    }
    let getBankPrefix = user.getBankCardPrefix();
    let title = '';
    if (getBankPrefix === 6000)
        title = 'b_mb';
    if (getBankPrefix === 7000)
        title = 'b_pacific';
    if (getBankPrefix === 8000)
        title = 'b_fleeca';
    if (getBankPrefix === 9000)
        title = 'b_blaine';

    UIMenu.Menu.Create(` `, `~b~Нажмите ~g~Enter~b~, чтобы выбрать пункт`, 'bank', false, false, title);

    UIMenu.Menu.AddMenuItem("~b~Баланс", "", {}, '~g~' + methods.moneyFormat(user.getBankMoney(), 99999999999));
    UIMenu.Menu.AddMenuItem("~b~Номер карты", "", {}, methods.bankFormat(user.getCache('bank_card')));
    UIMenu.Menu.AddMenuItem("~b~Владелец карты", "", {}, methods.bankFormat(user.getCache('bank_owner')));

    UIMenu.Menu.AddMenuItem("Снять средства", '~r~Комиссия~s~ 1%', {eventName: "server:bank:withdraw"});
    UIMenu.Menu.AddMenuItem("Положить средства", '~r~Комиссия~s~ 1%', {eventName: "server:bank:deposit"});
    UIMenu.Menu.AddMenuItem("Перевести на другой счет", '1% от суммы, при переводе', {eventName: "server:bank:transferMoney"});

    //UIMenu.Menu.AddMenuItem("~b~История по счёту").eventName = 'server:bank:history';

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.eventName == 'server:bank:withdraw') {
            let money = methods.parseFloat(await UIMenu.Menu.GetUserInput("Сумма снятия", "", 11));
            if (money < 1)
                return;
            if (user.getBankMoney() > money)
                user.setCache('money_bank', user.getBankMoney() - methods.parseFloat(money));
            mp.events.callRemote(item.eventName, money, 1);
        }
        else if (item.eventName == 'server:bank:deposit') {
            let money = methods.parseFloat(await UIMenu.Menu.GetUserInput("Сумма внесения", "", 11));
            if (money < 1)
                return;
            mp.events.callRemote(item.eventName, money, 1);
        }
        else if (item.eventName == 'server:bank:transferMoney') {
            let bankNumber = methods.parseInt(await UIMenu.Menu.GetUserInput("Номер карты", "", 16));
            if (bankNumber < 9999)
                return;
            let money = methods.parseFloat(await UIMenu.Menu.GetUserInput("Сумма перевода", "", 9));
            if (money < 0)
                return;
            mp.events.callRemote(item.eventName, bankNumber.toString(), money);
        }
        else if (item.eventName == 'server:bank:history') {
            mp.events.callRemote(item.eventName);
        }
    });
};

menuList.showFuelMenu = async function() {
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    let shopId = fuel.findNearestId(mp.players.local.position);
    let price = await business.getPrice(shopId);

    UIMenu.Menu.Create(`Заправка`, `~b~Нажмите ~g~Enter~b~, чтобы заправить`);

    let saleLabel = '';
    let sale = business.getSale(price);
    if (sale > 0)
        saleLabel = `~br~~s~Скидка: ~r~${sale}%`;

    let list = ["1L", "5L", "10L", "FULL"];
    let list2 = ["1%", "5%", "10%", "FULL"];

    let itemPrice = 1.5 * price;
    let listItem = {};

    if (mp.players.local.isInAnyVehicle(true)) {
        if (shopId === 147 || shopId === 148 || shopId === 149 || shopId === 150) {
            itemPrice = 3 * price;
            listItem = {};
            listItem.type = 4;
            listItem.price = itemPrice;
            UIMenu.Menu.AddMenuItemList("Авиатопливо", list, `Цена: ~g~${methods.moneyFormat(itemPrice)}~s~ за 1л.${saleLabel}`, listItem, 0, '', (sale > 0) ? 'sale' : '');
        }
        else {
            listItem = {};
            listItem.type = 1;
            listItem.price = itemPrice;
            UIMenu.Menu.AddMenuItemList("Бензин", list, `Цена: ~g~${methods.moneyFormat(itemPrice)}~s~ за 1л.${saleLabel}`, listItem, 0, '', (sale > 0) ? 'sale' : '');

            itemPrice = 1.1 * price;
            listItem = {};
            listItem.type = 2;
            listItem.price = itemPrice;
            UIMenu.Menu.AddMenuItemList("Дизель", list, `Цена: ~g~${methods.moneyFormat(itemPrice)}~s~ за 1л.${saleLabel}`, listItem, 0, '', (sale > 0) ? 'sale' : '');

            itemPrice = 0.5 * price;
            listItem = {};
            listItem.type = 3;
            listItem.price = itemPrice;
            UIMenu.Menu.AddMenuItemList("Электричество", list2, `Цена: ~g~${methods.moneyFormat(itemPrice)}~s~ за 1%${saleLabel}`, listItem, 0, '', (sale > 0) ? 'sale' : '');
        }
    }

    if (shopId === 147 || shopId === 148 || shopId === 149 || shopId === 150) {
        itemPrice = items.getItemPrice(8) * price;
        let menuItem = {};
        menuItem.price = itemPrice;
        menuItem.itemId = 8;
        UIMenu.Menu.AddMenuItem("Канистра (Авиатопливо)", `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '');
    }
    else {
        itemPrice = items.getItemPrice(9) * price;
        let menuItem = {};
        menuItem.price = itemPrice;
        menuItem.itemId = 9;
        UIMenu.Menu.AddMenuItem("Канистра (Бензин)", `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '');

        itemPrice = items.getItemPrice(10) * price;
        menuItem = {};
        menuItem.price = itemPrice;
        menuItem.itemId = 10;
        UIMenu.Menu.AddMenuItem("Канистра (Дизель)", `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '');
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    let listIndex = 0;
    UIMenu.Menu.OnList.Add((item, index) => {
        listIndex = index;
    });
    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.type)
        {
            if (mp.players.local.vehicle.getPedInSeat(-1) === mp.players.local.handle) {
                fuel.fillVeh(item.price, shopId, item.type, listIndex);
            }
            else {
                mp.game.ui.notifications.show(`~r~Вы не можете совершать покупку на пассажирском сиденье`);
            }
        }
        if (item.itemId) {
            mp.events.callRemote('server:shop:buy', item.itemId, item.price, shopId);
        }
    });
};

menuList.showBarberShopMoreMenu = async function (title, color, shop, price, name, count, zone, isNone = false) {

    let sale = business.getSale(await business.getPrice(shop));
    let list = [];
    if (isNone)
        list.push({name: `Убрать`, price: methods.moneyFormat(price / 2), sale: sale, params: {type: 'b:show', id: -1, none: false, name: `${name}`, price: price / 2, zone: zone, shop: shop}});

    if (zone == 'SKIN_HAIR') {
        if (user.getSex() === 1) {
            enums.hairFemale.forEach((item, i) => {
                let desc = '';
                enums.swtichFemaleHair.forEach(interactive => {
                    if (item[1] === interactive[0] || item[1] === interactive[1])
                        desc = 'Интерактивная';
                });
                list.push({name: `${name} #${i + 1}`, price: methods.moneyFormat(price), sale: sale, desc: desc, params: {type: 'b:show', id: item[1], none: isNone, name: `${name} #${i + 1}`, price: price, zone: zone, shop: shop}});
            });
        }
        else {
            enums.hairMale.forEach((item, i) => {
                let desc = '';
                enums.swtichMaleHair.forEach(interactive => {
                    if (item[1] === interactive[0] || item[1] === interactive[1])
                        desc = 'Интерактивная';
                });
                list.push({name: `${name} #${i + 1}`, price: methods.moneyFormat(price), sale: sale, desc: desc, params: {type: 'b:show', id: item[1], none: isNone, name: `${name} #${i + 1}`, price: price, zone: zone, shop: shop}});
            });
        }
    }
    else {
        for (let i = 0; i < count; i++)
            list.push({name: `${name} #${i + 1}`, price: methods.moneyFormat(price), sale: sale, params: {type: 'b:show', id: i, none: isNone, name: `${name} #${i + 1}`, price: price, zone: zone, shop: shop}});
    }

    //let pos = new mp.Vector3(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z + 0.75);
    //shopMenu.showShop2(pos, mp.players.local.getRotation(0).z, 0.8, 0.4, 1.2);
    shopMenu.updateShop2(list, title, color, 1, methods.removeQuotesAll(name));
};

menuList.showBarberShopMenu = function (shopId, price) {

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    let title1 = "";
    let color = '#000000';
    switch (shopId) {
        case 30:
        case 31:
        case 32:
            title1 = "bs_herr";
            color = '#000000';
            break;
        case 33:
            title1 = "bs_beach";
            color = '#d4dee7';
            break;
        case 34:
            title1 = "bs_sheas";
            color = '#923931';
            break;
        case 36:
            title1 = "bs_hair";
            color = '#171717';
            break;
        case 35:
            title1 = "bs_bob";
            color = '#111111';
            break;
    }

    let sale = business.getSale(price);
    let list = [];
    list.push({name: 'Причёска', price: '', sale: sale, params: {type: 'b', name: 'Причёска', price: 1000 * price, count: 77, zone: "SKIN_HAIR", shop: shopId}});
    list.push({name: 'Стиль причёски', price: '', sale: sale, params: {type: 'b', name: 'Стиль причёски', price: 100 * price, count: 77, zone: "SKIN_HAIR_3", shop: shopId}});
    //list.push({name: 'Тип причёски', price: '', sale: sale, params: {type: 'b', name: 'Тип причёски', price: 100 * price, count: 2, zone: "SKIN_HAIR_2", shop: shopId}});
    list.push({name: 'Цвет волос', price: '', sale: sale, params: {type: 'b', name: 'Цвет волос', price: 250 * price, count: 64, zone: "SKIN_HAIR_COLOR", shop: shopId}});
    list.push({name: 'Мелирование волос', price: '', sale: sale, params: {type: 'b', name: 'Цвет', price: 200 * price, count: 64, zone: "SKIN_HAIR_COLOR_2", shop: shopId}});
    list.push({name: 'Цвет глаз', price: '', sale: sale, params: {type: 'b', name: 'Цвет глаз', price: 120 * price, count: 32, zone: "SKIN_EYE_COLOR", shop: shopId}});
    list.push({name: 'Брови', price: '', sale: sale, params: {type: 'b', name: 'Брови', price: 70 * price, count: 30, zone: "SKIN_EYEBROWS", shop: shopId}});
    list.push({name: 'Цвет бровей', price: '', sale: sale, params: {type: 'b', name: 'Цвет бровей', price: 50 * price, count: 64, zone: "SKIN_EYEBROWS_COLOR", shop: shopId}});

    list.push({name: 'Веснушки', price: '', sale: sale, params: {type: 'b', name: 'Веснушки', price: 250 * price, none: true, count: 10, zone: "SKIN_OVERLAY_9", shop: shopId}});

    if (user.getSex() === 0) {
        list.push({name: 'Борода', price: '', sale: sale, params: {type: 'b', name: 'Борода', price: 500 * price, none: true, count: 29, zone: "SKIN_OVERLAY_1", shop: shopId}});
        list.push({name: 'Цвет бороды', price: '', sale: sale, params: {type: 'b', name: 'Цвет бороды', price: 100 * price, count: 64, zone: "SKIN_OVERLAY_COLOR_1", shop: shopId}});

        list.push({name: 'Волосы на груди', price: '', sale: sale, params: {type: 'b', name: 'Волосы на груди', price: 250 * price, none: true, count: mp.game.ped.getNumHeadOverlayValues(10) + 1, zone: "SKIN_OVERLAY_10", shop: shopId}});
        list.push({name: 'Цвет волос на груди', price: '', sale: sale, params: {type: 'b', name: 'Цвет волос на груди', price: 100 * price, count: 64, zone: "SKIN_OVERLAY_COLOR_10", shop: shopId}});
    }

    list.push({name: 'Помада', price: '', sale: sale, params: {type: 'b', name: 'Помада', price: 190 * price, none: true, count: mp.game.ped.getNumHeadOverlayValues(8) + 1, zone: "SKIN_OVERLAY_8", shop: shopId}});
    list.push({name: 'Цвет помады', price: '', sale: sale, params: {type: 'b', name: 'Цвет помады', price: 70 * price, count: 60, zone: "SKIN_OVERLAY_COLOR_8", shop: shopId}});

    list.push({name: 'Румянец', price: '', sale: sale, params: {type: 'b', name: 'Румянец', price: 250 * price, none: true, count: 7, zone: "SKIN_OVERLAY_5", shop: shopId}});
    list.push({name: 'Цвет румянца', price: '', sale: sale, params: {type: 'b', name: 'Цвет румянца', price: 110 * price, count: 60, zone: "SKIN_OVERLAY_COLOR_5", shop: shopId}});

    list.push({name: 'Макияж', price: '', sale: sale, params: {type: 'b', name: 'Макияж', price: 1500 * price, none: true, count: mp.game.ped.getNumHeadOverlayValues(4), zone: "SKIN_OVERLAY_4", shop: shopId}});

    let pos = new mp.Vector3(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z + 0.75);
    shopMenu.showShop2(pos, mp.players.local.getRotation(0).z, 0.8, 0.4, 1.2);
    shopMenu.updateShop2(list, title1, color);
};

menuList.showShopMenu = function(shopId, price = 2, type = 0)
{
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    let color = '#006b55';
    let title = "s_247";
    if (type == 4) {
        color = '#19245a';
        title = "s_ltd";
    }
    let sale = business.getSale(price);

    let list = [];
    enums.shopItems.shop.forEach(item => {

        let fullItem = {
            title: item.title,
            items: []
        };

        item.list.forEach(itemId => {
            let itemPrice = items.getItemPrice(itemId) * price;

            fullItem.items.push({ //Если кликаем сюда, то открывается меню справа (Там где покупка)
                title: methods.removeQuotesAll(items.getItemNameById(itemId)),
                desc: '',
                desc2: '',
                desc2t: '',
                sale: sale,
                img: `Item_${itemId}.png`,
                price: methods.moneyFormat(itemPrice),
                params: {id: itemId, price: itemPrice, shop: shopId}
            })
        });

        fullItem.items.push(
            { //Если кликаем сюда, то открывается меню справа (Там где покупка)
                title: 'Рация',
                desc: ``,
                desc2: '',
                desc2t: '',
                sale: 0,
                img: `walkie.png`,
                price: methods.moneyFormat(5000),
                params: {doName: 'radio', price: 5000, shop: shopId}
            }
        );

        list.push(fullItem);
        //UIMenu.Menu.AddMenuItemList(items.getItemNameById(itemId), list, `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '')
    });

    list.push({
        title: 'Торговля',
        items: [{ //Если кликаем сюда, то открывается меню справа (Там где покупка)
            title: 'Продать всю рыбу',
            desc: `Владелец магазина получает ${methods.parseInt(price * 10)}% с продаж`,
            desc2: '',
            desc2t: '',
            sale: 0,
            img: `fish.png`,
            price: '',
            params: {doName: 'sellFish', shop: shopId}
        }]
    });

    list.push({
        title: 'Для дома',
        items: [{ //Если кликаем сюда, то открывается меню справа (Там где покупка)
            title: 'Дверь с пинкодом',
            desc: `Пинкод можно установить в виде цифр и поменять в любой момент абсолютно бесплатно`,
            desc2: '',
            desc2t: '',
            sale: 0,
            img: `pincode.png`,
            price: methods.moneyFormat(7500),
            params: {doName: 'hPin', price: 7500, shop: shopId}
        }, { //Если кликаем сюда, то открывается меню справа (Там где покупка)
            title: 'Сейф',
            desc: `Позволяет хранить в защищеном месте всё что ваша душа пожелает ;)`,
            desc2: '',
            desc2t: '',
            sale: 0,
            img: `safe.png`,
            price: methods.moneyFormat(25000),
            params: {doName: 'hSafe', price: 25000, shop: shopId}
        }]
    });

    list.push({
        title: 'Для квартиры',
        items: [{ //Если кликаем сюда, то открывается меню справа (Там где покупка)
            title: 'Дверь с пинкодом',
            desc: `Пинкод можно установить в виде цифр и поменять в любой момент абсолютно бесплатно`,
            desc2: '',
            desc2t: '',
            sale: 0,
            img: `pincode.png`,
            price: methods.moneyFormat(7500),
            params: {doName: 'cPin', price: 7500, shop: shopId}
        }, { //Если кликаем сюда, то открывается меню справа (Там где покупка)
            title: 'Сейф',
            desc: `Позволяет хранить в защищеном месте всё что ваша душа пожелает ;)`,
            desc2: '',
            desc2t: '',
            sale: 0,
            img: `safe.png`,
            price: methods.moneyFormat(25000),
            params: {doName: 'cSafe', price: 25000, shop: shopId}
        }]
    });

    shopMenu.showShop();
    shopMenu.updateShop(list, title, color);
};

menuList.showShopTacoMenu = function(shopId, price = 2)
{
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    let color = '#efb542';
    let title = "s_taco";

    let sale = business.getSale(price);

    let list = [];
    enums.shopItems.shop.forEach(item => {

        let fullItem = {
            title: item.title,
            items: []
        };

        item.list.forEach(itemId => {
            let itemPrice = items.getItemPrice(itemId) * price;

            fullItem.items.push({ //Если кликаем сюда, то открывается меню справа (Там где покупка)
                title: methods.removeQuotesAll(items.getItemNameById(itemId)),
                desc: '',
                desc2: '',
                desc2t: '',
                sale: sale,
                img: `Item_${itemId}.png`,
                price: methods.moneyFormat(itemPrice),
                params: {id: itemId, price: itemPrice, shop: shopId}
            })
        });

        list.push(fullItem);
        //UIMenu.Menu.AddMenuItemList(items.getItemNameById(itemId), list, `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '')
    });

    shopMenu.showShop();
    shopMenu.updateShop(list, title, color);
};

menuList.showShopAlcMenu = function(shopId, price = 2, type = 0)
{
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    let color = '#5b8fa9';
    let title = "al_liqace";
    if (type == 2) {
        color = '#814646';
        title = "a_robs";
    }
    if (type == 3) {
        color = '#4b8c83';
        title = "a_scoops";
    }

    let sale = business.getSale(price);

    let list = [];
    enums.shopItems.alc.forEach(item => {

        let fullItem = {
            title: item.title,
            items: []
        };

        item.list.forEach(itemId => {
            let itemPrice = items.getItemPrice(itemId) * price;

            fullItem.items.push({ //Если кликаем сюда, то открывается меню справа (Там где покупка)
                title: methods.removeQuotesAll(items.getItemNameById(itemId)),
                desc: '',
                desc2: '',
                desc2t: '',
                sale: sale,
                img: `Item_${itemId}.png`,
                price: methods.moneyFormat(itemPrice),
                params: {id: itemId, price: itemPrice, shop: shopId}
            })
        });

        list.push(fullItem);
        //UIMenu.Menu.AddMenuItemList(items.getItemNameById(itemId), list, `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '')
    });

    shopMenu.showShop();
    shopMenu.updateShop(list, title, color);
};

menuList.showShopElMenu = function(shopId, price = 2)
{
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    let sale = business.getSale(price);

    let list = [];
    enums.shopItems.el.forEach(item => {

        let fullItem = {
            title: item.title,
            items: []
        };

        item.list.forEach(itemId => {
            let itemPrice = items.getItemPrice(itemId) * price;

            fullItem.items.push({ //Если кликаем сюда, то открывается меню справа (Там где покупка)
                title: methods.removeQuotesAll(items.getItemNameById(itemId)),
                desc: '',
                desc2: '',
                desc2t: '',
                sale: sale,
                img: `Item_${itemId}.png`,
                price: methods.moneyFormat(itemPrice),
                params: {id: itemId, price: itemPrice, shop: shopId}
            })
        });

        fullItem.items.push(
            { //Если кликаем сюда, то открывается меню справа (Там где покупка)
                title: 'Рация',
                desc: ``,
                desc2: '',
                desc2t: '',
                sale: 0,
                img: `walkie.png`,
                price: methods.moneyFormat(3000),
                params: {doName: 'radio', price: 3000, shop: shopId}
            }
        );

        list.push(fullItem);
        //UIMenu.Menu.AddMenuItemList(items.getItemNameById(itemId), list, `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '')
    });

    list.push({
        title: 'Для дома',
        items: [{ //Если кликаем сюда, то открывается меню справа (Там где покупка)
            title: 'Дверь с пинкодом',
            desc: `Пинкод можно установить в виде цифр и поменять в любой момент абсолютно бесплатно`,
            desc2: '',
            desc2t: '',
            sale: 0,
            img: `pincode.png`,
            price: methods.moneyFormat(7500),
            params: {doName: 'hPin', price: 7500, shop: shopId}
        }, { //Если кликаем сюда, то открывается меню справа (Там где покупка)
            title: 'Сейф',
            desc: `Позволяет хранить в защищеном месте всё что ваша душа пожелает ;)`,
            desc2: '',
            desc2t: '',
            sale: 0,
            img: `safe.png`,
            price: methods.moneyFormat(25000),
            params: {doName: 'hSafe', price: 25000, shop: shopId}
        }]
    });

    list.push({
        title: 'Для квартиры',
        items: [{ //Если кликаем сюда, то открывается меню справа (Там где покупка)
            title: 'Дверь с пинкодом',
            desc: `Пинкод можно установить в виде цифр и поменять в любой момент абсолютно бесплатно`,
            desc2: '',
            desc2t: '',
            sale: 0,
            img: `pincode.png`,
            price: methods.moneyFormat(7500),
            params: {doName: 'cPin', price: 7500, shop: shopId}
        }, { //Если кликаем сюда, то открывается меню справа (Там где покупка)
            title: 'Сейф',
            desc: `Позволяет хранить в защищеном месте всё что ваша душа пожелает ;)`,
            desc2: '',
            desc2t: '',
            sale: 0,
            img: `safe.png`,
            price: methods.moneyFormat(25000),
            params: {doName: 'cSafe', price: 25000, shop: shopId}
        }]
    });

    shopMenu.showShop();
    shopMenu.updateShop(list, 'digital', '#6a268a');
};

menuList.showShopMedMenu = function(shopId, price = 2)
{
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    let sale = business.getSale(price);

    let list = [];
    enums.shopItems.med.forEach(item => {

        let fullItem = {
            title: item.title,
            items: []
        };

        item.list.forEach(itemId => {
            let itemPrice = items.getItemPrice(itemId) * price;

            fullItem.items.push({ //Если кликаем сюда, то открывается меню справа (Там где покупка)
                title: methods.removeQuotesAll(items.getItemNameById(itemId)),
                desc: '',
                desc2: '',
                desc2t: '',
                sale: sale,
                img: `Item_${itemId}.png`,
                price: methods.moneyFormat(itemPrice),
                params: {id: itemId, price: itemPrice, shop: shopId}
            })
        });

        fullItem.items.push(
            { //Если кликаем сюда, то открывается меню справа (Там где покупка)
                title: 'Мед. страховка',
                desc: `Мед. страховка действует 6 месяцев`,
                desc2: '6 мес.',
                desc2t: '',
                sale: 0,
                img: `med_lic.png`,
                price: methods.moneyFormat(5000),
                params: {doName: 'med_lic', price: 5000, shop: shopId}
            }
        );

        list.push(fullItem);
        //UIMenu.Menu.AddMenuItemList(items.getItemNameById(itemId), list, `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '')
    });

    shopMenu.showShop();
    shopMenu.updateShop(list, 'ph2', '#005540');
};

menuList.showShopFishMenu = function(shopId, price = 2)
{
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    let sale = business.getSale(price);

    let list = [];
    enums.shopItems.fish.forEach(item => {

        let fullItem = {
            title: item.title,
            items: []
        };

        item.list.forEach(itemId => {
            let itemPrice = items.getItemPrice(itemId) * price;

            fullItem.items.push({ //Если кликаем сюда, то открывается меню справа (Там где покупка)
                title: methods.removeQuotesAll(items.getItemNameById(itemId)),
                desc: '',
                desc2: '',
                desc2t: '',
                sale: sale,
                img: `Item_${itemId}.png`,
                price: methods.moneyFormat(itemPrice),
                params: {id: itemId, price: itemPrice, shop: shopId}
            })
        });
        list.push(fullItem);
    });

    shopMenu.showShop();
    shopMenu.updateShop(list, 's_fish', '#12292b');
};

menuList.showShopHuntMenu = function(shopId, price = 2)
{
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    let sale = business.getSale(price);

    let list = [];
    enums.shopItems.hunt.forEach(item => {

        let fullItem = {
            title: item.title,
            items: []
        };

        item.list.forEach(itemId => {
            let itemPrice = items.getItemPrice(itemId) * price;

            fullItem.items.push({ //Если кликаем сюда, то открывается меню справа (Там где покупка)
                title: methods.removeQuotesAll(items.getItemNameById(itemId)),
                desc: '',
                desc2: '',
                desc2t: '',
                sale: sale,
                img: `Item_${itemId}.png`,
                price: methods.moneyFormat(itemPrice),
                params: {id: itemId, price: itemPrice, shop: shopId}
            })
        });
        list.push(fullItem);
    });

    shopMenu.showShop();
    shopMenu.updateShop(list, 's_hunt', '#071300');
};

menuList.showBarMenu = function(shopId, price = 2)
{
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    UIMenu.Menu.Create("Бар", "~b~Меню бара");

    let saleLabel = '';
    let sale = business.getSale(price);
    if (sale > 0)
        saleLabel = `~br~~s~Скидка: ~r~${sale}%`;

    let itemPrice = 0.50 * price;
    let menuItem = {};
    menuItem.price = itemPrice;
    menuItem.label = "воду";
    menuItem.label2 = "Вода Rainé";
    UIMenu.Menu.AddMenuItem("Вода Rainé", `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '');

    itemPrice = 0.90 * price;
    menuItem = {};
    menuItem.price = itemPrice;
    menuItem.label = "E-Cola";
    menuItem.label2 = "Баночка E-Cola";
    UIMenu.Menu.AddMenuItem("Баночка E-Cola", `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '');

    itemPrice = 0.99 * price;
    menuItem = {};
    menuItem.price = itemPrice;
    menuItem.label = "E-Cola";
    menuItem.label2 = "Бутылка E-Cola";
    UIMenu.Menu.AddMenuItem("Бутылка E-Cola", `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '');

    itemPrice = 6.70 * price;
    menuItem = {};
    menuItem.price = itemPrice;
    menuItem.label = "пиво";
    menuItem.label2 = "Пиво Pißwasser";
    menuItem.drunkLevel = 100;
    UIMenu.Menu.AddMenuItem("Пиво Pißwasser", `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '');

    itemPrice = 9.99 * price;
    menuItem = {};
    menuItem.price = itemPrice;
    menuItem.label = "водку";
    menuItem.label2 = "Водка Nogo";
    menuItem.drunkLevel = 200;
    UIMenu.Menu.AddMenuItem("Водка Nogo", `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '');

    itemPrice = 12 * price;
    menuItem = {};
    menuItem.price = itemPrice;
    menuItem.label = "рома";
    menuItem.label2 = "Ром Ragga";
    menuItem.drunkLevel = 200;
    UIMenu.Menu.AddMenuItem("Ром Ragga", `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '');

    itemPrice = 14 * price;
    menuItem = {};
    menuItem.price = itemPrice;
    menuItem.label = "коньяк";
    menuItem.label2 = "Коньяк Bourgeoix";
    menuItem.drunkLevel = 200;
    UIMenu.Menu.AddMenuItem("Коньяк Bourgeoix", `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '');

    itemPrice = 25 * price;
    menuItem = {};
    menuItem.price = itemPrice;
    menuItem.label = "вина";
    menuItem.label2 = "Вино Rockford Hill Reserve";
    menuItem.drunkLevel = 200;
    UIMenu.Menu.AddMenuItem("Вино Rockford Hill Reserve", `Цена: ~g~${methods.moneyFormat(itemPrice)}${saleLabel}`, menuItem, '', (sale > 0) ? 'sale' : '');

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        try {
            if (item.price > 0) {
                if (user.getMoney() < item.price) {
                    mp.game.ui.notifications.show("~r~У Вас недостаточно средств");
                    return;
                }

                if (await business.isOpen(shopId))
                    business.addMoney(shopId, item.price, item.label2);
                user.removeMoney(item.price, 'Выпил ' + item.label + ' в баре');

                if (mp.players.local.getHealth() < 90)
                    user.setHealth(mp.players.local.getHealth() + 2);

                if (item.drunkLevel)
                    user.addDrugLevel(99, item.drunkLevel);

                user.addWaterLevel(200);
                chat.sendMeCommand(`выпил ${item.label}`);
                user.playAnimation("mp_player_intdrink", "loop_bottle", 48);
            }
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

menuList.showBarFreeMenu = function()
{
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    UIMenu.Menu.Create("Бар", "~b~Меню бара");

    let menuItem = {};
    menuItem.label = "воду";
    UIMenu.Menu.AddMenuItem("Вода Rainé", "", menuItem);

    menuItem = {};
    menuItem.label = "E-Cola";
    UIMenu.Menu.AddMenuItem("Баночка E-Cola", "", menuItem);

    menuItem = {};
    menuItem.label = "E-Cola";
    UIMenu.Menu.AddMenuItem("Бутылка E-Cola", "", menuItem);

    menuItem = {};
    menuItem.label = "пиво";
    menuItem.drunkLevel = 100;
    UIMenu.Menu.AddMenuItem("Пиво Pißwasser", "", menuItem);

    menuItem = {};
    menuItem.label = "водку";
    menuItem.drunkLevel = 200;
    UIMenu.Menu.AddMenuItem("Водка Nogo", "", menuItem);

    menuItem = {};
    menuItem.label = "рома";
    menuItem.drunkLevel = 200;
    UIMenu.Menu.AddMenuItem("Ром Ragga", "", menuItem);

    menuItem = {};
    menuItem.label = "коньяк";
    menuItem.drunkLevel = 200;
    UIMenu.Menu.AddMenuItem("Коньяк Bourgeoix", "", menuItem);

    menuItem = {};
    menuItem.label = "вина";
    menuItem.drunkLevel = 200;
    UIMenu.Menu.AddMenuItem("Вино Rockford Hill Reserve", "", menuItem);

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        try {
            if (item.label) {

                if (mp.players.local.getHealth() < 90)
                    user.setHealth(mp.players.local.getHealth() + 2);

                if (item.drunkLevel)
                    user.addDrugLevel(99, item.drunkLevel);

                user.addWaterLevel(200);
                chat.sendMeCommand(`выпил ${item.label}`);
                user.playAnimation("mp_player_intdrink", "loop_bottle", 48);
            }
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

menuList.showTradeBeachCreateMenu = async function(idx)
{
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    UIMenu.Menu.Create("Палатка", "~b~Меню палатки");

    let rentId = await tradeMarket.getBeach(idx, 'rent');
    if (rentId) {
        if (rentId === user.getCache('id')) {
            UIMenu.Menu.AddMenuItem("Инвентарь палатки", "", {doName: "drop"});
            UIMenu.Menu.AddMenuItem("~r~Отменить аренду", "", {doName: "unrent"});
        }
        else
            UIMenu.Menu.AddMenuItem("~y~Палатка уже арендована");
    }
    else {
        UIMenu.Menu.AddMenuItem("Арендовать палатку за $1000", "Учтите, если вы выйдете за пределы рынка, то аренда будет анулирована", {doName: "rent"});
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        try {
            if (item.doName === 'rent') {
                mp.events.callRemote('server:tradeMarket:rentBeach', idx);
            }
            if (item.doName === 'unrent') {
                mp.events.callRemote('server:tradeMarket:unrentBeach', idx);
            }
            if (item.doName === 'drop') {
                inventory.getItemList(inventory.types.TradeBeach, user.getCache('id'));
            }
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

menuList.showTradeBlackCreateMenu = async function(idx)
{
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    UIMenu.Menu.Create("Палатка", "~b~Меню палатки");

    let rentId = await tradeMarket.getBlack(idx, 'rent');
    if (rentId) {
        if (rentId === user.getCache('id')) {
            UIMenu.Menu.AddMenuItem("Инвентарь палатки", "", {doName: "drop"});
            UIMenu.Menu.AddMenuItem("~r~Отменить аренду", "", {doName: "unrent"});
        }
        else
            UIMenu.Menu.AddMenuItem("~y~Палатка уже арендована");
    }
    else {
        UIMenu.Menu.AddMenuItem("Арендовать палатку за $2000", "Учтите, если вы выйдете за пределы рынка, то аренда будет анулирована", {doName: "rent"});
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        try {
            if (item.doName === 'rent') {
                mp.events.callRemote('server:tradeMarket:rentBlack', idx);
            }
            if (item.doName === 'unrent') {
                mp.events.callRemote('server:tradeMarket:unrentBlack', idx);
            }
            if (item.doName === 'drop') {
                inventory.getItemList(inventory.types.TradeBlack, user.getCache('id'));
            }
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

menuList.showRentBikeMenu = function(shopId, price = 2)
{
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    if (user.getCache('online_time') <= 169)
        price = 2;

    let sale = business.getSale(price);
    let list = [];
    [
        ["Cruiser", 3 * price, 448402357],
        ["Bmx", 5 * price, 1131912276],
        ["Fixter", 10 * price, -836512833],
        ["Scorcher", 10 * price, -186537451],
        ["TriBike", 30 * price, 1127861609],
        ["TriBike2", 30 * price, -1233807380],
        ["TriBike3", 30 * price, -400295096],
        ["Faggio", 60 * price, -1842748181],
        ["Faggio2", 55 * price, 55628203],
        ["Faggio3", 50 * price, -1289178744],
        ["Blazer", 150 * price, mp.game.joaat('blazer')],
        ["Verus", 150 * price, mp.game.joaat('verus')],
    ].forEach(item => {
        list.push({
            price: methods.moneyFormat(item[1]),
            name: item[0],
            sale: sale,
            params: {shop: shopId, hash: item[0], price: item[1]}
        });
    });

    shopMenu.showCarRent();
    shopMenu.updateShopCarRent(list, 'Аренда транспорта');
};

menuList.showShopClothMenu = function (shopId, type, menuType, price = 1) {
    try {
        methods.debug('Execute: menuList.showShopClothMenu');

        //if (menuType == 11)
        //    inventory.unEquipItem(265, 0, 1, 0, false);

        if (methods.isBlackout()) {
            mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
            return;
        }


        let title1 = "s_uv";
        let color = '#090909';

        if (shopId == 129) {
            title1 = "s_hunt";
            color = "#071300";
        }

        switch (type) {
            case 0:
                title1 = "c_disc";
                color = '#0073a6';
                break;
            case 1:
                title1 = "c_sub";
                color = '#141414';
                break;
            case 2:
                title1 = "c_ponsb";
                break;
            case 3:
                title1 = "ammu";
                color = '#922026';
                break;
            case 5:
                title1 = "c_binco";
                color = '#ffb300';
                break;
        }

        let sale = business.getSale(price);

        let list = [];
        if (menuType == 0) {
            list.push({name: 'Головные уборы', price: '', sale: sale, params: {type: 'c', t: type, p: price, mt: menuType, name: 'head', shop: shopId}});
            list.push({name: 'Очки', price: '', sale: sale, params: {type: 'c', t: type, p: price, mt: menuType, name: 'glasses', shop: shopId}});
            list.push({name: 'Серьги', price: '', sale: sale, params: {type: 'c', t: type, p: price, mt: menuType, name: 'earring', shop: shopId}});
            list.push({name: 'Левая рука', price: '', sale: sale, params: {type: 'c', t: type, p: price, mt: menuType, name: 'leftHand', shop: shopId}});
            list.push({name: 'Правая рука', price: '', sale: sale, params: {type: 'c', t: type, p: price, mt: menuType, name: 'rightHand', shop: shopId}});
        } else if (menuType == -1) {
            list.push({name: 'Торс', price: '', sale: sale, params: {type: 'c', t: type, p: price, mt: menuType, name: 'body', shop: shopId}});
            list.push({name: 'Ноги', price: '', sale: sale, params: {type: 'c', t: type, p: price, mt: menuType, name: 'legs', shop: shopId}});
            list.push({name: 'Обувь', price: '', sale: sale, params: {type: 'c', t: type, p: price, mt: menuType, name: 'shoes', shop: shopId}});
            if (type === 1)
                list.push({name: 'Бронежилеты', price: '', sale: sale, params: {type: 'c', t: type, p: price, mt: menuType, name: 'armor', shop: shopId}});
            list.push({name: 'Аксессуары и перчатки', price: '', sale: sale, params: {type: 'c', t: type, p: price, mt: menuType, name: 'acess', shop: shopId}});
            //=======================================
            list.push({name: 'Головные уборы', price: '', sale: sale, params: {type: 'c', t: type, p: price, mt: menuType, name: 'head', shop: shopId}});
            list.push({name: 'Очки', price: '', sale: sale, params: {type: 'c', t: type, p: price, mt: menuType, name: 'glasses', shop: shopId}});
            list.push({name: 'Серьги', price: '', sale: sale, params: {type: 'c', t: type, p: price, mt: menuType, name: 'earring', shop: shopId}});
            list.push({name: 'Левая рука', price: '', sale: sale, params: {type: 'c', t: type, p: price, mt: menuType, name: 'leftHand', shop: shopId}});
            list.push({name: 'Правая рука', price: '', sale: sale, params: {type: 'c', t: type, p: price, mt: menuType, name: 'rightHand', shop: shopId}});
            //=======================================
            list.push({name: 'Принты', price: '', sale: sale, params: {type: 'c', t: type, p: price, mt: menuType, name: 'openPrint', shop: shopId}});
            //=======================================
            list.push({name: 'Сумки и рюкзаки', price: '', sale: sale, params: {type: 'c', t: type, p: price, mt: menuType, name: 'openBag', shop: shopId}});
        } else if (menuType == -2) {
            list.push({name: 'Головные уборы', price: '', sale: sale, params: {type: 'c', t: type, p: price, mt: menuType, name: 'head', shop: shopId}});
            list.push({name: 'Очки', price: '', sale: sale, params: {type: 'c', t: type, p: price, mt: menuType, name: 'glasses', shop: shopId}});
            list.push({name: 'Серьги', price: '', sale: sale, params: {type: 'c', t: type, p: price, mt: menuType, name: 'earring', shop: shopId}});
            list.push({name: 'Левая рука', price: '', sale: sale, params: {type: 'c', t: type, p: price, mt: menuType, name: 'leftHand', shop: shopId}});
            list.push({name: 'Правая рука', price: '', sale: sale, params: {type: 'c', t: type, p: price, mt: menuType, name: 'rightHand', shop: shopId}});
            //=======================================
            list.push({name: 'Торс', price: '', sale: sale, params: {type: 'c', t: type, p: price, mt: menuType, name: 'body', shop: shopId}});
            list.push({name: 'Ноги', price: '', sale: sale, params: {type: 'c', t: type, p: price, mt: menuType, name: 'legs', shop: shopId}});
            list.push({name: 'Обувь', price: '', sale: sale, params: {type: 'c', t: type, p: price, mt: menuType, name: 'shoes', shop: shopId}});
            //=======================================
            list.push({name: 'Сумки и рюкзаки', price: '', sale: sale, params: {type: 'c', t: type, p: price, mt: menuType, name: 'openBag', shop: shopId}});
        } else if (menuType == 1) {
            list.push({name: 'Головные уборы', price: '', sale: sale, params: {type: 'c', t: type, p: price, mt: menuType, name: 'head', shop: shopId}});
            list.push({name: 'Очки', price: '', sale: sale, params: {type: 'c', t: type, p: price, mt: menuType, name: 'glasses', shop: shopId}});
            list.push({name: 'Торс', price: '', sale: sale, params: {type: 'c', t: type, p: price, mt: menuType, name: 'body', shop: shopId}});
            list.push({name: 'Ноги', price: '', sale: sale, params: {type: 'c', t: type, p: price, mt: menuType, name: 'legs', shop: shopId}});
            list.push({name: 'Обувь', price: '', sale: sale, params: {type: 'c', t: type, p: price, mt: menuType, name: 'shoes', shop: shopId}});
            list.push({name: 'Сумки и рюкзаки', price: '', sale: sale, params: {type: 'c', t: type, p: price, mt: menuType, name: 'openBag', shop: shopId}});
        } else {

            if (type == 11)
                user.updateTattoo(true, true, false, true);

            let cloth = user.getSex() == 1 ? JSON.parse(enums.clothF) : JSON.parse(enums.clothM);

            for (let i = 0; i < cloth.length; i++) {
                let id = i;

                if (menuType === 7) {
                    if (cloth[id][1] != 7 && cloth[id][1] != 3) continue;
                }
                else if (cloth[id][1] != menuType) continue;
                if (cloth[id][0] != type) continue;

                let pr = cloth[i][8] * price;
                let menuListItem = {};
                let desc = '';

                if (menuType === 11) {
                    if (user.getSex() === 1) {
                        enums.swtichFemaleCloth.forEach(interactive => {
                            if (interactive[0] == cloth[id][2] || interactive[1] == cloth[id][2])
                                desc = ' | Интерактивная';
                        });
                        enums.swtichFemaleCloth2.forEach(interactive => {
                            if (interactive[0] == cloth[id][2] || interactive[1] == cloth[id][2])
                                desc = ' | Интерактивная';
                        });
                    }
                    else {
                        enums.swtichMaleCloth.forEach(interactive => {
                            if (interactive[0] == cloth[id][2] || interactive[1] == cloth[id][2])
                                desc = ' | Интерактивная';
                        });
                        enums.swtichMaleCloth2.forEach(interactive => {
                            if (interactive[0] == cloth[id][2] || interactive[1] == cloth[id][2])
                                desc = ' | Интерактивная';
                        });
                    }
                }

                menuListItem.id1 = cloth[id][1];
                menuListItem.id2 = cloth[id][2];
                menuListItem.id3 = cloth[id][3];
                menuListItem.id4 = cloth[id][4];
                menuListItem.id5 = cloth[id][5];
                menuListItem.id6 = cloth[id][6];
                menuListItem.id7 = cloth[id][7];
                menuListItem.id8 = pr;
                menuListItem.id10 = cloth[id][10];
                menuListItem.shop = shopId;
                menuListItem.t = type;
                menuListItem.mt = menuType;
                menuListItem.type = 'c:show';
                menuListItem.itemName = cloth[id][9].toString();
                list.push({name: methods.removeQuotesAll(cloth[i][9].toString()), desc: `Цена: ${methods.moneyFormat(pr)}${desc}`, price: '', sale: sale, params: menuListItem});
            }
        }

        shopMenu.showShop2();
        shopMenu.updateShop2(list, title1, color);
    } catch (e) {
        methods.debug('Exception: menuList.showShopClothMenu');
        methods.debug(e);
    }
};

menuList.showShopClothMoreMenu = function (title, color, shopId, type, menuType, price, id1, id2, id3, id4, id5, id6, id7, id8, id10, itemName) {
    try {
        methods.debug('Execute: menuList.showShopClothMenu');

        if (methods.isBlackout()) {
            mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
            return;
        }

        let sale = business.getSale(price);
        let list = [];

        for (let i = 0; i <= id3 + 1; i++) {
            let menuListItem = {};

            menuListItem.id1 = id1;
            menuListItem.id2 = id2;
            menuListItem.id3 = id3;
            menuListItem.id4 = id4;
            menuListItem.id5 = id5;
            menuListItem.id6 = id6;
            menuListItem.id7 = id7;
            menuListItem.id8 = id8;
            menuListItem.type = 'c:buy';
            menuListItem.id = i;
            menuListItem.shop = shopId;
            menuListItem.itemName = itemName;
            let desc = `Термостойкость до ${id10}°`;
            if (id10 < -90)
                desc = '';
            list.push({name: methods.removeQuotesAll(`${itemName} #${(i + 1)}`), desc: desc, price: methods.moneyFormat(id8), sale: sale, params: menuListItem});
        }

        //shopMenu.showShop2();
        shopMenu.updateShop2(list, title, color, 1, methods.removeQuotesAll(itemName));
    } catch (e) {
        methods.debug('Exception: menuList.showShopClothMenu');
        methods.debug(e);
    }
};

menuList.showShopClothPrintMenu = function (shopId, type, menuType, priceSale) {
    try {
        methods.debug('Execute: menuList.showShopClothMenu');

        if (methods.isBlackout()) {
            mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
            return;
        }

        let sale = business.getSale(priceSale);
        let list = [];

        let printList = JSON.parse(enums.tprint);
        let idx = 0;
        for (let i = 0; i < printList.length; i++) {

            let price = 1999 * priceSale;

            if (type === 0) {
                if (printList[i][0] !== 'mpsum_overlays' &&
                    printList[i][0] !== 'mpgunrunning_overlays' &&
                    printList[i][0] !== 'multiplayer_overlays' &&
                    printList[i][0] !== 'mpbattle_overlays' &&
                    printList[i][0] !== 'mpheist4_overlays'
                )
                    continue;
                price = 99 * priceSale;
            }
            else if (type === 1) {
                if (printList[i][0] !== 'mphalloween_overlays' &&
                    printList[i][0] !== 'mpvinewood_overlays' &&
                    printList[i][0] !== 'mpgunrunning_overlays' &&
                    printList[i][0] !== 'mplowrider_overlays' &&
                    printList[i][0] !== 'mplowrider2_overlays' &&
                    printList[i][0] !== 'mpluxe_overlays' &&
                    printList[i][0] !== 'mpluxe2_overlays' &&
                    printList[i][0] !== 'mpsmuggler_overlays' &&
                    printList[i][0] !== 'mpheist3_overlays'
                )
                    continue;
                price = 599 * priceSale;
            }
            else if (type === 5) {
                if (printList[i][0] !== 'mpsum_overlays' &&
                    printList[i][0] !== 'mpgunrunning_overlays' &&
                    printList[i][0] !== 'multiplayer_overlays' &&
                    printList[i][0] !== 'mpchristmas2018_overlays' &&
                    printList[i][0] !== 'mpexecutive_overlays'
                )
                    continue;
                price = 99 * priceSale;
            }
            else if (printList[i][0] !== 'mpgunrunning_overlays')
                continue;

            if (i < 25)
                price = 499 * priceSale;

            idx++;

            if (user.getSex() == 1 && printList[i][2] != "") {
                let menuListItem = {};
                menuListItem.price = price;
                menuListItem.type = 'print:buy';
                menuListItem.tatto1 = printList[i][0];
                menuListItem.tatto2 = printList[i][2];
                menuListItem.shop = shopId;
                menuListItem.itemName = `Принт #${idx}`;

                list.push({name: methods.removeQuotesAll(menuListItem.itemName), price: methods.moneyFormat(price), sale: sale, params: menuListItem});
            }
            else if (user.getSex() == 0 && printList[i][1] != "") {
                let menuListItem = {};
                menuListItem.price = price;
                menuListItem.type = 'print:buy';
                menuListItem.tatto1 = printList[i][0];
                menuListItem.tatto2 = printList[i][1];
                menuListItem.shop = shopId;
                menuListItem.itemName = `Принт #${idx}`;
                list.push({name: methods.removeQuotesAll(menuListItem.itemName), price: methods.moneyFormat(price), sale: sale, params: menuListItem});
            }
        }

        //shopMenu.showShop2();
        shopMenu.updateShop2(list, shopMenu.getLastSettings().banner, shopMenu.getLastSettings().bg, 1, 'Принты');
    } catch (e) {
        methods.debug('Exception: menuList.showShopClothMenu');
        methods.debug(e);
    }
};

menuList.showShopClothBagMenu = function (shopId, type, menuType) {
    try {
        methods.debug('Execute: menuList.showShopClothBagMenu');

        if (methods.isBlackout()) {
            mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
            return;
        }

        let list = [];

        ['Чёрная', 'Синяя', 'Желтая', 'Розовая', 'Зелёная', 'Оранжевая', 'Фиолетовая', 'Светло-розовая', 'Красно-синяя', 'Голубая', 'Цифра', 'Флора', 'Синяя флора', 'Узор', 'Пустынная', 'Камо', 'Белая'].forEach((item, idx) => {
            let menuListItem = {};
            menuListItem.id1 = 5;
            menuListItem.id2 = 82;
            menuListItem.id4 = 0;
            menuListItem.id5 = 0;
            menuListItem.id6 = 0;
            menuListItem.id7 = 0;
            menuListItem.id8 = 5000;
            menuListItem.type = 'c:buy';
            menuListItem.id = idx;
            menuListItem.shop = shopId;
            menuListItem.itemName = `Спортивная сумка (${item})`;
            list.push({name: methods.removeQuotesAll(menuListItem.itemName), price: methods.moneyFormat(5000), sale: 0, params: menuListItem});
        });
        ['Белая Bigness', 'Красная Bigness', 'Фиолетовая Bigness', 'Бежевая Guffy', 'Розовая Guffy', 'Узор Guffy', 'Серый узор Guffy', 'Розовая JK', 'Голубая JK', 'Черная ProLaps', 'Голубая ProLaps', 'Фиолетовая ProLaps', 'Красная ProLaps', 'Розовая ProLaps', 'Бирюзовая ProLaps', 'Бирюзовая ProLaps', 'Серая ProLaps', 'Розовая ProLaps', 'Серая SC', 'Голубая SC', 'Камо SC', 'Люкс SC', 'Золотая Broker', 'Sessanta Nove', 'Белая Sessanta Nove'].forEach((item, idx) => {
            let menuListItem = {};
            menuListItem.id1 = 5;
            menuListItem.id2 = 86;
            menuListItem.id4 = 0;
            menuListItem.id5 = 0;
            menuListItem.id6 = 0;
            menuListItem.id7 = 0;
            menuListItem.id8 = 10000;
            menuListItem.type = 'c:buy';
            menuListItem.id = idx;
            menuListItem.shop = shopId;
            menuListItem.itemName = `Спортивная сумка (${item})`;
            list.push({name: methods.removeQuotesAll(menuListItem.itemName), price: methods.moneyFormat(10000), sale: 0, params: menuListItem});
        });
        ['Белая Adidas', 'Черная Adidas', 'Синяя Adidas', 'Черная Converse', 'Синяя Converse', 'Белая Kappa', 'Черная Kappa', 'Розовая Kappa', 'Белая Nike', 'Черная Nike', 'Голубая Nike', 'Черная PlayBoy', 'Рзовая PlayBoy', 'Красная Puma', 'Черная Puma', 'Белая Puma', 'Желтая Reebok', 'Черная Reebok', 'Синяя Reebok', 'Белая Reebok'].forEach((item, idx) => {
            let menuListItem = {};
            menuListItem.id1 = 5;
            menuListItem.id2 = 23;
            menuListItem.id4 = 0;
            menuListItem.id5 = 0;
            menuListItem.id6 = 0;
            menuListItem.id7 = 0;
            menuListItem.id8 = 20000;
            menuListItem.type = 'c:buy';
            menuListItem.id = idx;
            menuListItem.shop = shopId;
            menuListItem.itemName = `Спортивная сумка (${item})`;
            list.push({name: methods.removeQuotesAll(menuListItem.itemName), price: methods.moneyFormat(20000), sale: 0, params: menuListItem});
        });
        ['Классическая #1'].forEach((item, idx) => {
            let menuListItem = {};
            menuListItem.id1 = 5;
            menuListItem.id2 = 41;
            menuListItem.id4 = 0;
            menuListItem.id5 = 0;
            menuListItem.id6 = 0;
            menuListItem.id7 = 0;
            menuListItem.id8 = 1500;
            menuListItem.type = 'c:buy';
            menuListItem.id = idx;
            menuListItem.shop = shopId;
            menuListItem.itemName = `Спортивная сумка (${item})`;
            list.push({name: methods.removeQuotesAll(menuListItem.itemName), price: methods.moneyFormat(1500), sale: 0, params: menuListItem});
        });
        ['Классическая #2'].forEach((item, idx) => {
            let menuListItem = {};
            menuListItem.id1 = 5;
            menuListItem.id2 = 45;
            menuListItem.id4 = 0;
            menuListItem.id5 = 0;
            menuListItem.id6 = 0;
            menuListItem.id7 = 0;
            menuListItem.id8 = 1500;
            menuListItem.type = 'c:buy';
            menuListItem.id = idx;
            menuListItem.shop = shopId;
            menuListItem.itemName = `Спортивная сумка (${item})`;
            list.push({name: methods.removeQuotesAll(menuListItem.itemName), price: methods.moneyFormat(1500), sale: 0, params: menuListItem});
        });

        let alist = [];
        for (let j = 0; j <= 25; j++) {
            alist.push('Узор #' + (j + 1));
        }
        alist.forEach((item, idx) => {
            let menuListItem = {};
            menuListItem.id1 = 5;
            menuListItem.id2 = 22;
            menuListItem.id4 = 0;
            menuListItem.id5 = 0;
            menuListItem.id6 = 0;
            menuListItem.id7 = 0;
            menuListItem.id8 = 5000;
            menuListItem.type = 'c:buy';
            menuListItem.id = idx;
            menuListItem.shop = shopId;
            menuListItem.itemName = `Спортивная сумка (${item})`;
            list.push({name: methods.removeQuotesAll(menuListItem.itemName), price: methods.moneyFormat(5000), sale: 0, params: menuListItem});
        });

        [''].forEach((item, idx) => {
            let menuListItem = {};
            menuListItem.id1 = 5;
            menuListItem.id2 = 2;
            menuListItem.id4 = 0;
            menuListItem.id5 = 0;
            menuListItem.id6 = 0;
            menuListItem.id7 = 0;
            menuListItem.id8 = 500;
            menuListItem.type = 'c:buy';
            menuListItem.id = idx;
            menuListItem.shop = shopId;
            menuListItem.itemName = `Рюкзак c узором`;
            list.push({name: methods.removeQuotesAll(menuListItem.itemName), price: methods.moneyFormat(500), sale: 0, params: menuListItem});
        });

        alist = [];
        for (let j = 0; j <= 25; j++) {
            alist.push('Флаг #' + (j + 1));
        }
        alist.forEach((item, idx) => {
            let menuListItem = {};
            menuListItem.id1 = 5;
            menuListItem.id2 = 11;
            menuListItem.id4 = 0;
            menuListItem.id5 = 0;
            menuListItem.id6 = 0;
            menuListItem.id7 = 0;
            menuListItem.id8 = 500;
            menuListItem.type = 'c:buy';
            menuListItem.id = idx;
            menuListItem.shop = shopId;
            menuListItem.itemName = `Рюкзак (${item})`;
            list.push({name: methods.removeQuotesAll(menuListItem.itemName), price: methods.moneyFormat(500), sale: 0, params: menuListItem});
        });

        alist = [];
        for (let j = 0; j <= 4; j++) {
            alist.push('#' + (j + 1));
        }
        alist.forEach((item, idx) => {
            let menuListItem = {};
            menuListItem.id1 = 5;
            menuListItem.id2 = 32;
            menuListItem.id4 = 0;
            menuListItem.id5 = 0;
            menuListItem.id6 = 0;
            menuListItem.id7 = 0;
            menuListItem.id8 = 500;
            menuListItem.type = 'c:buy';
            menuListItem.id = idx;
            menuListItem.shop = shopId;
            menuListItem.itemName = `Рюкзак тактический ${item}`;
            list.push({name: methods.removeQuotesAll(menuListItem.itemName), price: methods.moneyFormat(500), sale: 0, params: menuListItem});
        });

        alist = [];
        for (let j = 0; j <= 9; j++) {
            alist.push('#' + (j + 1));
        }
        alist.forEach((item, idx) => {
            let menuListItem = {};
            menuListItem.id1 = 5;
            menuListItem.id2 = 53;
            menuListItem.id4 = 0;
            menuListItem.id5 = 0;
            menuListItem.id6 = 0;
            menuListItem.id7 = 0;
            menuListItem.id8 = 500;
            menuListItem.type = 'c:buy';
            menuListItem.id = idx;
            menuListItem.shop = shopId;
            menuListItem.itemName = `Рюкзак классический ${item}`;
            list.push({name: methods.removeQuotesAll(menuListItem.itemName), price: methods.moneyFormat(500), sale: 0, params: menuListItem});
        });

        //shopMenu.showShop2();
        shopMenu.updateShop2(list, shopMenu.getLastSettings().banner, shopMenu.getLastSettings().bg, 1, 'Сумки и рюкзаки');
    } catch (e) {
        methods.debug('Exception: menuList.showShopClothMenu');
        methods.debug(e);
    }
};

menuList.showShopPropMenu = function (shopId, type, menuType, price) {
    let title1 = "s_uv";
    let color = '#090909';

    if (shopId == 129) {
        title1 = "s_hunt";
        color = "#071300";
    }

    switch (type) {
        case 0:
            title1 = "c_disc";
            color = '#0073a6';
            break;
        case 1:
            title1 = "c_sub";
            color = '#141414';
            break;
        case 2:
            title1 = "c_ponsb";
            break;
        case 3:
            title1 = "ammu";
            color = '#922026';
            break;
        case 5:
            title1 = "c_binco";
            color = '#ffb300';
            break;
    }

    let sale = business.getSale(price);
    let list = [];

    let skin = JSON.parse(user.getCache('skin'));
    let clothList = skin.SKIN_SEX == 1 ? JSON.parse(enums.propF) : JSON.parse(enums.propM);

    for (let i = 0; i < clothList.length; i++)
    {
        let id = i;

        if (clothList[id][1] != menuType) continue;
        if (clothList[id][0] != type) continue;

        let pr = clothList[i][4] * price;
        let menuListItem = {};

        menuListItem.id1 = clothList[id][1];
        menuListItem.id2 = clothList[id][2];
        menuListItem.id3 = clothList[id][3];
        menuListItem.id4 = pr;
        menuListItem.itemName = clothList[id][5].toString();
        menuListItem.shop = shopId;
        menuListItem.t = type;
        menuListItem.mt = menuType;
        menuListItem.type = 'p:show';

        list.push({name: methods.removeQuotesAll(clothList[i][5].toString()), desc: `Цена: ${methods.moneyFormat(pr)}`, price: '', sale: sale, params: menuListItem});
    }

    if (list.length === 0)
        list.push({name: 'Нет товара', price: '', sale: 0, params: {}});

    let pos = new mp.Vector3(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z + 0.70);
    shopMenu.showShop2(pos);
    shopMenu.updateShop2(list, title1, color);
};

menuList.showShopPropMoreMenu = function (title, color, shopId, type, menuType, price, id1, id2, id3, id4, itemName) {
    let sale = business.getSale(price);
    let list = [];

    for (let i = 0; i <= id3 + 1; i++) {
        let menuItem = {};
        menuItem.idx = i;
        menuItem.itemName = methods.removeQuotesAll(`${itemName} #${(i + 1)}`);
        menuItem.shop = shopId;
        menuItem.t = type;
        menuItem.mt = menuType;
        menuItem.id1 = id1;
        menuItem.id2 = id2;
        menuItem.id3 = id3;
        menuItem.id4 = id4;
        menuItem.type = 'p:buy';

        list.push({name: menuItem.itemName, price: methods.moneyFormat(id4), sale: sale, params: menuItem});
    }

    if (list.length === 0)
        list.push({name: 'Нет товара', price: '', sale: 0, params: {}});

    //let pos = new mp.Vector3(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z + 0.70);
    //shopMenu.showShop2(pos);
    shopMenu.updateShop2(list, title, color, 1, methods.removeQuotesAll(itemName));
};

menuList.showShopMaskMenu = function (shopId) {

    let list = [];

    if (user.getCache('mask') > 0) {
        user.set("mask", -1);
        user.set("mask_color", 0);
        user.updateCharacterCloth();
        user.updateCharacterFace();
        inventory.updateItemsEquipByItemId(274, user.getCache('id'), inventory.types.Player, 0);
    }

    user.set('seeMask', true);

    for (let i = 0; i < enums.maskClasses.length; i++) {
        if (methods.getCountMask(i, 69) > 0) { //TODO Если захотим разбить маски по разным магазам
            let name = methods.removeQuotesAll(enums.maskClasses[i]);
            if (i === 4) {
                if (weather.getMonth() === 2)
                    list.push({name: name, price: '', sale: 0, params: {type: 'mask', slot: i, shop: shopId}});
                else
                    list.push({name: name, price: '', desc: 'Доступно для покупки, только в Феврале', sale: 0, params: {}});
            }
            else if (i === 19) {
                if (weather.getMonth() === 12)
                    list.push({name: name, price: '', sale: 0, params: {type: 'mask', slot: i, shop: shopId}});
                else
                    list.push({name: name, price: '', desc: 'Доступно для покупки, только в Декабре', sale: 0, params: {}});
            }
            else if (i === 20) {
                if (weather.getMonth() === 10)
                    list.push({name: name, price: '', sale: 0, params: {type: 'mask', slot: i, shop: shopId}});
                else
                    list.push({name: name, price: '', desc: 'Доступно для покупки, только в Октябре', sale: 0, params: {}});
            }
            else
                list.push({name: name, price: '', sale: 0, params: {type: 'mask', slot: i, shop: shopId}});
        }
    }

    let pos = new mp.Vector3(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z + 0.75);
    shopMenu.showShop2(pos, mp.players.local.getRotation(0).z, 0.8, 0.4, 1.2);
    shopMenu.updateShop2(list, 's_mask', '#000000');
};

menuList.showMaskListMenu = function (slot, shopId) {
    try {

        let maskPrev = user.getCache('mask');

        if (maskPrev > 0) {
            user.showCustomNotify("Для начала снимите старую маску", 0, 9);
            return;
        }

        if (enums.maskList.length < 1)
            return;

        user.set('seeMask', true);

        let list = [];

        for (let i = 0; i < enums.maskList.length; i++) {
            let maskItem = enums.maskList[i];
            if (maskItem[0] !== slot)
                continue;
            if (maskItem[13] !== 69)
                continue;

            let mItem = {};
            mItem.maskId = maskItem[2];
            /*mItem.maskColor = maskItem[3];
            mItem.maskHair = maskItem[6];
            mItem.maskGlass = maskItem[7];
            mItem.maskHat = maskItem[8];
            mItem.maskAcc = maskItem[9];
            mItem.maskFaceDef = maskItem[10];
            mItem.maskFace = maskItem[11];*/
            mItem.maskPrice = maskItem[4] + 0.01;
            mItem.idxFull = i;
            mItem.shop = shopId;
            mItem.type = 'mask:buy';

            list.push({name: methods.removeQuotesAll(maskItem[1]), price: methods.moneyFormat(maskItem[4]), sale: 0, params: mItem});
        }

        shopMenu.updateShop2(list, 's_mask', '#000000', 1, 'Список масок');
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.showPrintShopMenu = function()
{
    if (user.getCache('torso') == 15)
    {
        mp.game.ui.notifications.show("~r~Вам необходимо купить вверхнюю одежду в магазине одежды, прежде чем пользоваться услугой наклейки принта");
        return;
    }

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }
    UIMenu.Menu.Create(" ", "~b~Магазин принтов", 'print', false, false, 's_print'); //TODO BANNER

    let list = [];

    let printList = JSON.parse(enums.tprint);

    for (let i = 0; i < printList.length; i++) {

        let price = 3999;
        if (i < 25)
            price = 39999;
        if (user.getSex() == 1 && printList[i][2] != "") {
            let menuListItem = {};
            menuListItem.doName = 'show';
            menuListItem.price = price;
            menuListItem.tatto1 = printList[i][0];
            menuListItem.tatto2 = printList[i][2];
            UIMenu.Menu.AddMenuItem('Принт #' + i + ' ' + printList[i][0], `Цена: ~g~${methods.moneyFormat(price, 0)}`, menuListItem);

            list.push(menuListItem);
        }
        else if (user.getSex() == 0 && printList[i][1] != "") {
            let menuListItem = {};
            menuListItem.doName = 'show';
            menuListItem.price = price;
            menuListItem.tatto1 = printList[i][0];
            menuListItem.tatto2 = printList[i][1];
            UIMenu.Menu.AddMenuItem('Принт #' + i + ' ' + printList[i][0], `Цена: ~g~${methods.moneyFormat(price, 0)}`, menuListItem);

            list.push(menuListItem);
        }
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnIndexSelect.Add((index) => {
        if (index >= list.length)
            return;
        user.setCache('tprint_c', ' ');
        user.updateTattoo(true, true, false, true);
        user.setDecoration(list[index].tatto1, list[index].tatto2, true);
    });

    UIMenu.Menu.OnClose.Add(() => {
        user.updateTattoo();
        user.updateCache();
    });

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if(item.doName == 'show')
            mp.events.callRemote('server:print:buy', item.tatto1, item.tatto2, item.price);
    });
};

menuList.showMazeBankLobbyMenu = function(inGame, weapon, raceCount, raceName, raceVeh)
{
    weapon = items.getWeaponNameByName(weapon);

    UIMenu.Menu.Create(" ", "~b~MazeBank Arena", 'arena', false, false, 'mba');

    UIMenu.Menu.AddMenuItem('~g~Принять участие в гонке', `Взнос: ~g~$1,000~s~~br~Игроков в лобби: ~g~${raceCount}~s~~br~Транспорт: ~g~${raceVeh}~s~~br~Название: ~g~${raceName}`, {doName: "start"});
    UIMenu.Menu.AddMenuItem('~g~Принять участие в GunZone', `Игроков в игре: ~g~${inGame}~s~~br~Оружие: ~g~${weapon}`, {doName: "startGangZone"});
    //UIMenu.Menu.AddMenuItem('~g~Принять участие в Cops & Racer', `Игроков в игре: ~g~${inGame}`, {doName: "startCopsAndRacer"});

    UIMenu.Menu.AddMenuItem('~g~Пригласить на дуэль', 'Взнос: ~g~$250', {doName: "duel"});

    UIMenu.Menu.AddMenuItem('Таблица рейтинга гонок', "", {doName: "rating"});
    UIMenu.Menu.AddMenuItem('Таблица рейтинга дуэлей', "", {doName: "drating"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if(item.doName == 'start') {
            mp.events.callRemote('server:race:toLobby');
        }
        if(item.doName == 'startGangZone') {
            quest.standart(false, -1, 12);
            mp.events.callRemote('server:gangZone:toLobby');
        }
        if(item.doName == 'startCopsAndRacer') {
            mp.events.callRemote('server:copsRacer:toLobby');
        }
        if(item.doName == 'rating')
            mp.events.callRemote('server:race:rating');
        if(item.doName == 'drating')
            mp.events.callRemote('server:duel:rating');
        if(item.doName == 'duel')
            menuList.showMazeBankLobbyCreateDuoMenu();
    });
};

menuList.showMazeBankLobbyCreateDuoMenu = function(bet = 0, death = 3)
{
    UIMenu.Menu.Create(" ", "~b~MazeBank Arena", 'arena', false, false, 'mba');

    UIMenu.Menu.AddMenuItem(`Ставка ~g~${methods.moneyFormat(bet)}`, 'Нажмите ~g~Enter~s~ чтобы изменить', {doName: "setBet"});
    UIMenu.Menu.AddMenuItem(`До ~b~${death}~s~ смертей`, 'Нажмите ~g~Enter~s~ чтобы изменить', {doName: "setDeath"});
    UIMenu.Menu.AddMenuItem('~g~Пригласить', 'Взнос: ~g~$250', {doName: "duel"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        if(item.doName == 'setBet')
        {
            let name = methods.parseInt(await UIMenu.Menu.GetUserInput("Сумма ставки", "", 9));
            if (name > 25000) {
                mp.game.ui.notifications.show(`~r~Значение не должно быть больше 25000`);
                menuList.showMazeBankLobbyCreateDuoMenu(name, death);
                return;
            }
            if (name < 0) {
                mp.game.ui.notifications.show(`~r~Значение не должно быть меньше 0`);
                menuList.showMazeBankLobbyCreateDuoMenu(name, death);
                return;
            }
            menuList.showMazeBankLobbyCreateDuoMenu(name, death)
        }
        if(item.doName == 'setDeath')
        {
            let name = methods.parseInt(await UIMenu.Menu.GetUserInput("Кол-во смертей", "", 9));
            if (name > 5) {
                mp.game.ui.notifications.show(`~r~Значение не должно быть больше 5`);
                menuList.showMazeBankLobbyCreateDuoMenu(name, death);
                return;
            }
            if (name < 2) {
                mp.game.ui.notifications.show(`~r~Значение не должно быть меньше 2`);
                menuList.showMazeBankLobbyCreateDuoMenu(name, death);
                return;
            }
            menuList.showMazeBankLobbyCreateDuoMenu(bet, name)
        }
        if(item.doName == 'duel') {
            UIMenu.Menu.HideMenu();
            let name = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите ID игрока", "", 9));
            if (name === mp.players.local.remoteId) {
                mp.game.ui.notifications.show(`~r~Нельзя самого себя позвать на дуэль`);
                return;
            }
            mp.events.callRemote('server:duel:toLobby', name, bet, death);
        }
    });
};

menuList.showMazeBankLobbyAskDuoMenu = function(playerId, bet, death, name, mmr, count, win)
{
    UIMenu.Menu.Create(" ", "~b~MazeBank Arena", 'arena', false, false, 'mba');

    UIMenu.Menu.AddMenuItem(`${name} (${playerId}): ~g~${mmr}~s~ | ~q~${count}~s~ | ~y~${win}`);
    UIMenu.Menu.AddMenuItem(`Ставка ~g~${methods.moneyFormat(bet)}`);
    UIMenu.Menu.AddMenuItem(`До ~b~${death}~s~ смертей`);
    UIMenu.Menu.AddMenuItem('~g~Принять', 'Взнос: ~g~$250', {doName: "duel"});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {

        if(item.doName == 'duel') {
            UIMenu.Menu.HideMenu();
            mp.events.callRemote('server:duel:accept', playerId, bet, death);
        }
    });
};

menuList.showTattooShopMenu = function(title1, title2, shopId, price)
{
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    let list = [];
    list.push({name: 'Голова', price: '', params: {type: 't', zone: "ZONE_HEAD", shop: shopId}});
    list.push({name: 'Торс', price: '', params: {type: 't', zone: "ZONE_TORSO", shop: shopId}});
    list.push({name: 'Левая рука', price: '', params: {type: 't', zone: "ZONE_LEFT_ARM", shop: shopId}});
    list.push({name: 'Правая рука', price: '', params: {type: 't', zone: "ZONE_RIGHT_ARM", shop: shopId}});
    list.push({name: 'Левая нога', price: '', params: {type: 't', zone: "ZONE_LEFT_LEG", shop: shopId}});
    list.push({name: 'Правая нога', price: '', params: {type: 't', zone: "ZONE_RIGHT_LEG", shop: shopId}});

    shopMenu.showShop2();
    shopMenu.updateShop2(list, title1, title2);
};

menuList.showTattooShopShortMenu = function(title1, title2, zone, shopId, price)
{
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    let list = [];
    let tattooList = enums.tattooList;

    for (let i = 0; i < tattooList.length; i++) {

        if (tattooList[i][4] != zone)
            continue;

        if ((
            tattooList[i][1] == "mpbeach_overlays" ||
            tattooList[i][1] == "mpbiker_overlays" ||
            tattooList[i][1] == "mpchristmas2_overlays" ||
            tattooList[i][1] == "mpgunrunning_overlays" ||
            tattooList[i][1] == "mphipster_overlays" ||
            tattooList[i][1] == "mplowrider_overlays" ||
            tattooList[i][1] == "mplowrider2_overlays" ||
            tattooList[i][1] == "mpluxe_overlays" ||
            tattooList[i][1] == "mpluxe2_overlays" ||
            tattooList[i][1] == "mpsmuggler_overlays" ||
            tattooList[i][1] == "mpchristmas2017_overlays" ||
            tattooList[i][1] == "mpstunt_overlays"
        ) && title1 == "tt_inkinc")
            continue;

        if ((
            tattooList[i][1] == "mpairraces_overlays" ||
            tattooList[i][1] == "mpbeach_overlays" ||
            tattooList[i][1] == "mpbusiness_overlays" ||
            tattooList[i][1] == "mpchristmas2_overlays" ||
            tattooList[i][1] == "mpgunrunning_overlays" ||
            tattooList[i][1] == "mphipster_overlays" ||
            tattooList[i][1] == "mpimportexport_overlays" ||
            tattooList[i][1] == "mpluxe_overlays" ||
            tattooList[i][1] == "mpluxe2_overlays" ||
            tattooList[i][1] == "mpsmuggler_overlays" ||
            tattooList[i][1] == "mpchristmas2017_overlays" ||
            tattooList[i][1] == "mpstunt_overlays" ||
            tattooList[i][1] == "multiplayer_overlays"
        ) && title1 == "tt_lstatoo")
            continue;

        if ((
            tattooList[i][1] == "mpairraces_overlays" ||
            tattooList[i][1] == "mpbeach_overlays" ||
            tattooList[i][1] == "mpbiker_overlays" ||
            tattooList[i][1] == "mpbusiness_overlays" ||
            tattooList[i][1] == "mpchristmas2_overlays" ||
            tattooList[i][1] == "mpgunrunning_overlays" ||
            tattooList[i][1] == "mpimportexport_overlays" ||
            tattooList[i][1] == "mplowrider_overlays" ||
            tattooList[i][1] == "mplowrider2_overlays" ||
            tattooList[i][1] == "mpsmuggler_overlays" ||
            tattooList[i][1] == "mpchristmas2017_overlays" ||
            tattooList[i][1] == "mpstunt_overlays" ||
            tattooList[i][1] == "multiplayer_overlays"
        ) && title1 == "tt_pit")
            continue;

        if ((
            tattooList[i][1] == "mpairraces_overlays" ||
            tattooList[i][1] == "mpbeach_overlays" ||
            tattooList[i][1] == "mpbiker_overlays" ||
            tattooList[i][1] == "mpbusiness_overlays" ||
            tattooList[i][1] == "mpchristmas2_overlays" ||
            tattooList[i][1] == "mpgunrunning_overlays" ||
            tattooList[i][1] == "mphipster_overlays" ||
            tattooList[i][1] == "mpimportexport_overlays" ||
            tattooList[i][1] == "mplowrider_overlays" ||
            tattooList[i][1] == "mplowrider2_overlays" ||
            tattooList[i][1] == "mpluxe_overlays" ||
            tattooList[i][1] == "mpluxe2_overlays" ||
            tattooList[i][1] == "multiplayer_overlays"
        ) && title1 == "tt_tattobp")
            continue;

        if ((
            tattooList[i][1] == "mpairraces_overlays" ||
            tattooList[i][1] == "mpbiker_overlays" ||
            tattooList[i][1] == "mpbusiness_overlays" ||
            tattooList[i][1] == "mphipster_overlays" ||
            tattooList[i][1] == "mpimportexport_overlays" ||
            tattooList[i][1] == "mplowrider_overlays" ||
            tattooList[i][1] == "mplowrider2_overlays" ||
            tattooList[i][1] == "mpluxe_overlays" ||
            tattooList[i][1] == "mpluxe2_overlays" ||
            tattooList[i][1] == "mpsmuggler_overlays" ||
            tattooList[i][1] == "mpchristmas2017_overlays" ||
            tattooList[i][1] == "mpstunt_overlays" ||
            tattooList[i][1] == "multiplayer_overlays"
        ) && title1 == "tt_blazing")
            continue;

        let price = methods.parseFloat(methods.parseFloat(tattooList[i][5]) / 5);

        let saleLabel = '';
        let sale = business.getSale(price);
        if (sale > 0)
            saleLabel = `~br~~s~Скидка: ~r~${sale}%`;

        if (user.getSex() == 1 && tattooList[i][3] != "") {

            let array = [tattooList[i][1], tattooList[i][3]];
            let prizes = [];

            try {
                prizes = JSON.parse(user.getCache('tattoo'))
            }
            catch (e) {
                methods.debug(e);
            }
            if (prizes.some(a => array.every((v, i) => v === a[i]))) {
                let menuListItem = {};
                let menuItem = {};
                menuListItem.doName = 'tt:destroy';
                menuListItem.price = price / 2;
                menuListItem.tatto0 = methods.replaceQuotes(tattooList[i][0]);
                menuListItem.tatto1 = tattooList[i][1];
                menuListItem.tatto2 = tattooList[i][3];
                menuListItem.shop = shopId;

                menuItem.params = menuListItem;
                menuItem.name = methods.replaceQuotes(tattooList[i][0]) + ' (Свести тату)';
                menuItem.price = methods.moneyFormat(price / 2);
                menuItem.sale = sale;
                list.push(menuItem);
            }
            else {
                let menuListItem = {};
                let menuItem = {};
                menuListItem.doName = 'tt:show';
                menuListItem.price = price;
                menuListItem.tatto0 = methods.replaceQuotes(tattooList[i][0]);
                menuListItem.tatto1 = tattooList[i][1];
                menuListItem.tatto2 = tattooList[i][3];
                menuListItem.shop = shopId;

                menuItem.params = menuListItem;
                menuItem.name = methods.replaceQuotes(tattooList[i][0]);
                menuItem.price = methods.moneyFormat(price);
                menuItem.sale = sale;
                list.push(menuItem);
            }
        }
        else if (user.getSex() == 0 && tattooList[i][2] != "") {

            let array = [tattooList[i][1], tattooList[i][2]];
            let prizes = [];

            try {
                prizes = JSON.parse(user.getCache('tattoo'))
            }
            catch (e) {
                methods.debug(e);
            }

            if (prizes.some(a => array.every((v, i) => v === a[i]))) {
                let menuListItem = {};
                let menuItem = {};
                menuListItem.doName = 'tt:destroy';
                menuListItem.price = price / 2;
                menuListItem.tatto0 = methods.replaceQuotes(tattooList[i][0]);
                menuListItem.tatto1 = tattooList[i][1];
                menuListItem.tatto2 = tattooList[i][2];
                menuListItem.shop = shopId;

                menuItem.params = menuListItem;
                menuItem.name = methods.replaceQuotes(tattooList[i][0]) + ' (Свести тату)';
                menuItem.price = methods.moneyFormat(price / 2);
                menuItem.sale = sale;
                list.push(menuItem);
            }
            else {
                let menuListItem = {};
                let menuItem = {};
                menuListItem.doName = 'tt:show';
                menuListItem.price = price;
                menuListItem.tatto0 = methods.replaceQuotes(tattooList[i][0]);
                menuListItem.tatto1 = tattooList[i][1];
                menuListItem.tatto2 = tattooList[i][2];
                menuListItem.shop = shopId;

                menuItem.params = menuListItem;
                menuItem.name = methods.replaceQuotes(tattooList[i][0]);
                menuItem.price = methods.moneyFormat(price);
                menuItem.sale = sale;
                list.push(menuItem);
            }
        }
    }

    //shopMenu.showShop2();
    shopMenu.updateShop2(list, title1, title2, 1, 'Список татуировок');
};

menuList.showVehShopMenu = function(shopId, autoId, carPos, buyPos, carList)
{
    methods.getVehicleInfo(shopId);

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    UIMenu.Menu.Create("Салон", "~b~Посмотреть список транспорта");
    UIMenu.Menu.AddMenuItem("~g~Войти в салон", "", {enter: true});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.enter)
        {
            vShop.goToInside(shopId, carPos[0], carPos[1], carPos[2], carPos[3], buyPos[0], buyPos[1], buyPos[2], carList);
            setTimeout(function () {
                menuList.showVehShopListMenu(shopId, autoId, carList);
            }, 2000);
        }
    });
};

menuList.showVehShopListMenu = function(shopId, autoId, carList)
{
    UIMenu.Menu.HideMenu();

    methods.getVehicleInfo(shopId);
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    let list = [];

    let vehicleInfo = enums.vehicleInfo;

    vehicleInfo.forEach(item => {
        if (autoId != item.type)
            return;

        /*let label = `~c~${item.display_name} (0 шт.)`;
        let subLabel = `\n~r~Доступно только для аренды`;

        if (carList.has(item.display_name)) {
            label = `${item.display_name} (${carList.get(item.display_name)} шт.)`;
            subLabel = ``;
        }*/

        try {
            let label = methods.removeQuotes(methods.removeQuotes2(mp.game.ui.getLabelText(item.display_name)));
            label = methods.removeQuotes(methods.removeQuotes2(label));
            if (label === 'NULL')
                label = item.display_name;

            let count = 0;
            if (carList.has(item.display_name))
                count = methods.parseInt(carList.get(item.display_name));

            let carInfo = [];
            carInfo.push({title: 'Класс', info: item.class_name});
            if (user.getCache('s_hud_speed_type'))
                carInfo.push({title: 'Макс. скорость', info: `~${vehicles.getSpeedMax(mp.game.joaat(item.display_name))} KM/H`});
            else
                carInfo.push({title: 'Макс. скорость', info: `~${methods.parseInt(vehicles.getSpeedMax(mp.game.joaat(item.display_name)) / 1.609)} MP/H`});

            if (item.fuel_type > 0) {
                carInfo.push({title: 'Тип топлива', info: `${vehicles.getFuelLabel(item.fuel_type)}`});
                carInfo.push({title: 'Вместимость бака', info: `${item.fuel_full}${vehicles.getFuelPostfix(item.fuel_type)}`});
                carInfo.push({title: 'Расход топлива', info: `${item.fuel_min}${vehicles.getFuelPostfix(item.fuel_type)}`});
            }
            else
                carInfo.push({title: 'Расход топлива', info: `Отсутствует`});

            if (item.stock > 0) {

                let stockFull = item.stock_full;
                if (item.stock_full > 0)
                    stockFull = stockFull / 1000;

                carInfo.push({title: 'Объем багажника', info: `${item.stock}см³`});
                carInfo.push({title: 'Допустимый вес', info: `${stockFull}кг.`});
            }
            else
                carInfo.push({title: 'Багажник', info: `Отсутствует`});

            list.push(
                {
                    make: label,
                    model: item.class_name,
                    name: item.display_name,
                    count: count,
                    price: methods.moneyFormat(item.price, 1),
                    rent: methods.moneyFormat(item.price / 100 + 100.01, 999),
                    img: enums.getVehicleImg(item.display_name),
                    character_car: carInfo,
                    color_car_main: ['111', '0', '4', '28', '38', '42', '70', '81', '135', '107'],
                    color_car_secondary: ['111', '0', '4', '28', '38', '42', '70', '81', '135', '107'],
                    current_main_color: '111',
                    current_secondary_color: '111',
                }
            );
        }
        catch (e) {
            methods.debug(e);
        }
    });

    let listNew = methods.sortBy(list, 'make');

    vShop.createVehicle(listNew[0].name);

    ui.callCef('carShop', JSON.stringify({ type: 'updateValues', list: listNew, isShow: true }));
};

menuList.showLscMenu = function(shopId, price = 1)
{
    let veh = mp.players.local.vehicle;
    if (!veh) {
        mp.game.ui.notifications.show(`~r~Необходимо находиться в транспорте`);
        return;
    }

    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    let lscBanner1 = 'lsc'; //DEFAULT
    let color = '#091217';

    switch (shopId) {
        case 10:
            lscBanner1 = 'lsc_beekers';
            color = '#1f3b0d';
            break;
        case 9:
            lscBanner1 = 'lsc_bennys';
            color = '#000000';
            break;
    }

    let sale = business.getSale(price);
    let vInfo = methods.getVehicleInfo(veh.model);

    let list = [];

    list.push({name: `Ремонт`, price: '', sale: sale, params: {type: 'lsc:repair', price: price, shop: shopId}});
    if (shopId === 145 || shopId === 146) {
        list.push({name: `Внутренний тюнинг`, price: '', sale: sale, params: {type: 'lsc:setTunning2', price: price, shop: shopId}});
        list.push({name: `Детальный ремонт`, price: '', sale: sale, params: {type: 'lsc:setS3Tunning', price: price, shop: shopId}});
        //list.push({name: `Ходовые настройки`, price: '', sale: sale, params: {type: 'lsc:setS2Tunning', price: price, shop: shopId}});
    }
    else {
        if (vInfo.class_name !== 'Helicopters')
            list.push({name: `Визуальный тюнинг`, price: '', sale: sale, params: {type: 'lsc:setTunning', price: price, shop: shopId}});
        if (vInfo.display_name === 'Havok')
            list.push({name: `Визуальный тюнинг`, price: '', sale: sale, params: {type: 'lsc:setTunning', price: price, shop: shopId}});
        list.push({name: `Покраска транспорта`, price: '', sale: sale, params: {type: 'lsc:setColor', price: price, shop: shopId}});
        list.push({name: `Установка модулей`, price: '', sale: sale, params: {type: 'lsc:setSTunning', price: price, shop: shopId}});

        if (vInfo.class_name !== 'Boats' && vInfo.class_name !== 'Planes' && vInfo.class_name !== 'Helicopters')
            list.push({name: `Сменить номер`, price: '', sale: sale, params: {type: 'lsc:setNumber', price: price, shop: shopId}});
    }

    shopMenu.showShop2(veh.position, veh.getRotation(0).z, 3.5, 3, 8, 0, 2);
    shopMenu.updateShop2(list, lscBanner1, color);
};

menuList.showLscRepairMenu = function(shopId, price = 1)
{
    let veh = mp.players.local.vehicle;
    if (!veh) {
        mp.game.ui.notifications.show(`~r~Необходимо находиться в транспорте`);
        return;
    }

    let sale = business.getSale(price);
    let list = [];
    list.push({name: `Ремонт`, price: methods.moneyFormat(price * 500), sale: sale, params: {type: 'lsc:repair:buy', price: price * 500, shop: shopId}});
    //shopMenu.showShop2(veh.position, veh.getRotation(0).z, 3.5, 3, 8);
    shopMenu.updateShop2(list, shopMenu.getLastSettings().banner, shopMenu.getLastSettings().bg, 1, 'Ремонт');
};

menuList.showLscNumberMenu = function(shopId, price = 1)
{
    let veh = mp.players.local.vehicle;
    if (!veh) {
        mp.game.ui.notifications.show(`~r~Необходимо находиться в транспорте`);
        return;
    }

    let sale = business.getSale(price);
    let list = [];
    list.push({name: `Номер`, price: methods.moneyFormat(40000), desc: 'Номер из 4 и более символов', sale: sale, params: {type: 'lsc:number:buy', shop: shopId}});
    list.push({name: `Номер`, price: methods.moneyFormat(100000), desc: 'Номер из 4 символов', sale: sale, params: {type: 'lsc:number:buy', shop: shopId}});
    list.push({name: `Номер`, price: methods.moneyFormat(250000), desc: 'Номер из 3 символов', sale: sale, params: {type: 'lsc:number:buy', shop: shopId}});
    list.push({name: `Номер`, price: methods.moneyFormat(500000), desc: 'Номер из 2 символов', sale: sale, params: {type: 'lsc:number:buy', shop: shopId}});
    list.push({name: `Номер`, price: methods.moneyFormat(1000000), desc: 'Номер из 1 символа', sale: sale, params: {type: 'lsc:number:buy', shop: shopId}});
    //shopMenu.showShop2(veh.position, veh.getRotation(0).z, 3.5, 3, 8);
    shopMenu.updateShop2(list, shopMenu.getLastSettings().banner, shopMenu.getLastSettings().bg, 1, 'Покупка номера');
};

menuList.showLscColorMenu = function(shopId, price) {

    let veh = mp.players.local.vehicle;

    if (!veh) {
        mp.game.ui.notifications.show(`~r~Необходимо находиться в личном транспорте`);
        return;
    }

    let sale = business.getSale(price);
    let list = [];

    let vInfo = methods.getVehicleInfo(veh.model);

    if (vInfo.class_name === 'Boats') {
        list.push({name: `Цвет №1`, price: '', sale: sale, params: {type: 'lsc:color:1', price: price, shop: shopId}});
        list.push({name: `Цвет №2`, price: '', sale: sale, params: {type: 'lsc:color:2', price: price, shop: shopId}});
        list.push({name: `Цвет №2`, price: '', sale: sale, params: {type: 'lsc:color:3', price: price, shop: shopId}});
        list.push({name: `Цвет №4`, price: '', sale: sale, params: {type: 'lsc:color:4', price: price, shop: shopId}});
        list.push({name: `Цвет №5`, price: '', sale: sale, params: {type: 'lsc:color:5', price: price, shop: shopId}});
        list.push({name: `Цвет №6`, price: '', sale: sale, params: {type: 'lsc:color:6', price: price, shop: shopId}});
    }
    else {
        list.push({name: `Основной цвет`, price: '', sale: sale, params: {type: 'lsc:color:1', price: price, shop: shopId}});
        list.push({name: `Дополнительный цвет`, price: '', sale: sale, params: {type: 'lsc:color:2', price: price, shop: shopId}});
        list.push({name: `Перламутровый цвет`, price: '', sale: sale, params: {type: 'lsc:color:3', price: price, shop: shopId}});
        if (vInfo.class_name !== 'Planes' && vInfo.class_name !== 'Helicopters') {
            list.push({name: `Цвет колёс`, price: '', sale: sale, params: {type: 'lsc:color:4', price: price, shop: shopId}});
            list.push({name: `Цвет приборной панели`, price: '', desc: 'Не на всех ТС доступна смена цвета салона', sale: sale, params: {type: 'lsc:color:5', price: price, shop: shopId}});
            list.push({name: `Цвет салона`, price: '', desc: 'Не на всех ТС доступна смена цвета салона', sale: sale, params: {type: 'lsc:color:6', price: price, shop: shopId}});
        }
    }
    shopMenu.updateShop2(list, shopMenu.getLastSettings().banner, shopMenu.getLastSettings().bg, 0, 'Выбор цвета');
};

menuList.showLscColorChoiseMenu = async function(shopId, price, labelDesc = '', eventId = '', price2 = 500, carData = 'color1') {

    let veh = mp.players.local.vehicle;

    if (!veh) {
        mp.game.ui.notifications.show(`~r~Необходимо находиться в личном транспорте`);
        return;
    }

    let car = await vehicles.getData(veh.getVariable('container'));


    let sale = business.getSale(price);
    let list = [];

    for (let i = 0; i < 161; i++) {
        try {
            let label = enums.lscColorsEn[i];
            if (i === 0)
                label = "По умолчанию";
            let listItem = {};
            listItem.modType = i;
            listItem.price = price2 * price;
            listItem.itemName = label;
            listItem.shop = shopId;
            listItem.type = 'lsc:color:buy';
            listItem.ev = eventId;
            list.push({name: `${i}. ${label}`, price: methods.moneyFormat(price2 * price), desc: (car.get(carData) === i) ? 'Куплено' : '', sale: sale, params: listItem});
        }
        catch (e) {
            methods.debug(e);
        }
    }
    shopMenu.updateShop2(list, shopMenu.getLastSettings().banner, shopMenu.getLastSettings().bg, 1, labelDesc);
};

menuList.showLscS2TunningMenu = async function(shopId, price) {

    let veh = mp.players.local.vehicle;

    if (!veh) {
        mp.game.ui.notifications.show(`~r~Необходимо находиться в личном транспорте`);
        return;
    }
    let list = [];
    list.push({name: `Привод`, price: methods.moneyFormat(enums.lscSNames[0][1]), desc: 'Смена привода автомобиля', sale: 0, params: {type: 'lsc:s:mod', idx: 0, price: price, shop: shopId}});
    for (let i = 1; i < enums.lscSNames.length; i++) {
        list.push({name: enums.lscSNames[i][0], price: methods.moneyFormat(enums.lscSNames[i][1]), desc: enums.lscSNames[i][3], sale: 0, params: {type: 'lsc:s:mod', idx: i, price: price, shop: shopId}});
    }
    shopMenu.updateShop2(list, shopMenu.getLastSettings().banner, shopMenu.getLastSettings().bg, 0, 'Специальный тюнинг');
};

menuList.showLscS3TunningMenu = async function(shopId, price) {

    let veh = mp.players.local.vehicle;

    if (!veh || !veh.getVariable('user_id')) {
        mp.game.ui.notifications.show(`~r~Необходимо находиться в личном транспорте`);
        return;
    }

    let vehInfo = methods.getVehicleInfo(veh.model);
    let car = await vehicles.getData(veh.getVariable('container'));

    let defaultPrice = price;
    price = price - 1;

    if (vehInfo.price >= 8000 && vehInfo.price < 15000)
        price += 1;
    else if (vehInfo.price >= 15000 && vehInfo.price < 30000)
        price += 1.2;
    else if (vehInfo.price >= 30000 && vehInfo.price < 45000)
        price += 1.5;
    else if (vehInfo.price >= 45000 && vehInfo.price < 60000)
        price += 1.8;
    else if (vehInfo.price >= 60000 && vehInfo.price < 75000)
        price += 2;
    else if (vehInfo.price >= 90000 && vehInfo.price < 105000)
        price += 2.2;
    else if (vehInfo.price >= 105000 && vehInfo.price < 120000)
        price += 2.4;
    else if (vehInfo.price >= 120000 && vehInfo.price < 135000)
        price += 2.6;
    else if (vehInfo.price >= 135000 && vehInfo.price < 150000)
        price += 2.8;
    else if (vehInfo.price >= 150000 && vehInfo.price < 200000)
        price += 3;
    else if (vehInfo.price >= 200000 && vehInfo.price < 240000)
        price += 3.3;
    else if (vehInfo.price >= 240000 && vehInfo.price < 280000)
        price += 3.6;
    else if (vehInfo.price >= 280000 && vehInfo.price < 320000)
        price += 4;
    else if (vehInfo.price >= 320000 && vehInfo.price < 380000)
        price += 4.4;
    else if (vehInfo.price >= 380000 && vehInfo.price < 500000)
        price += 5;
    else if (vehInfo.price >= 500000 && vehInfo.price < 600000)
        price += 5.5;
    else if (vehInfo.price >= 600000 && vehInfo.price < 700000)
        price += 6;
    else if (vehInfo.price >= 700000 && vehInfo.price < 800000)
        price += 6.5;
    else if (vehInfo.price >= 800000)
        price += 7;
    else
        price += 0.5;

    let sale = business.getSale(defaultPrice);
    let list = [];
    list.push({name: `Двигатель - ${car.get('s_eng')}%`, price: methods.moneyFormat(25 * price * (101 - car.get('s_eng'))), desc: '', sale: sale, params: {type: 'lsc:s:fix', idx: 's_eng', fixName: 'Двигатель', price: 25 * price * (101 - car.get('s_eng')), shop: shopId}});

    list.push({name: `Трансмиссия - ${car.get('s_trans')}%`, price: methods.moneyFormat(25 * price * (101 - car.get('s_trans'))), desc: '', sale: sale, params: {type: 'lsc:s:fix', idx: 's_trans', fixName: 'Трансмиссия', price: 25 * price * (101 - car.get('s_trans')), shop: shopId}});

    list.push({name: `Колёса - ${car.get('s_whel')}%`, price: methods.moneyFormat(5 * price * (101 - car.get('s_whel'))), desc: '', sale: sale, params: {type: 'lsc:s:fix', idx: 's_whel', fixName: 'Колёса', price: 5 * price * (101 - car.get('s_whel')), shop: shopId}});

    list.push({name: `Электроника - ${car.get('s_elec')}%`, price: methods.moneyFormat(5 * price * (101 - car.get('s_elec'))), desc: '', sale: sale, params: {type: 'lsc:s:fix', idx: 's_elec', fixName: 'Электроника', price: 5 * price * (101 - car.get('s_elec')), shop: shopId}});

    list.push({name: `Тормозная система - ${car.get('s_break')}%`, price: methods.moneyFormat(10 * price * (101 - car.get('s_break'))), desc: '', sale: sale, params: {type: 'lsc:s:fix', idx: 's_break', fixName: 'Тормозная система', price: 10 * price * (101 - car.get('s_break')), shop: shopId}});

    list.push({name: `Топливная система - ${car.get('s_fuel')}%`, price: methods.moneyFormat(15 * price * (101 - car.get('s_fuel'))), desc: '', sale: sale, params: {type: 'lsc:s:fix', idx: 's_fuel', fixName: 'Топливная система', price: 15 * price * (101 - car.get('s_fuel')), shop: shopId}});

    shopMenu.updateShop2(list, shopMenu.getLastSettings().banner, shopMenu.getLastSettings().bg, 1, 'Детальный ремонт');
};

menuList.showLscS2MoreTunningMenu = async function(shopId, idx, price) {

    let veh = mp.players.local.vehicle;

    if (!veh) {
        mp.game.ui.notifications.show(`~r~Необходимо находиться в личном транспорте`);
        return;
    }

    let vehInfo = methods.getVehicleInfo(veh.model);

    let car = await vehicles.getData(veh.getVariable('container'));
    let upgrade = null;
    if (car.has('upgrade'))
        upgrade = JSON.parse(car.get('upgrade'));

    let sale = business.getSale(price);
    let list = [];

    list.push({name: `Стандарт`, price: methods.moneyFormat(0), sale: 0, params: {type: 'lsc:s:mod:reset', idx: idx, price: 0, shop: shopId}});

    if (idx === 0) {
        let currentId = -1;
        if (upgrade != null && upgrade[idx + 100]) {
            switch (upgrade[idx + 100].toString()) {
                case '0':
                    currentId = 0;
                    break;
                case '0.25':
                    currentId = 1;
                    break;
                case '0.5':
                    currentId = 2;
                    break;
                case '0.75':
                    currentId = 3;
                    break;
                case '1':
                    currentId = 4;
                    break;
            }
        }
        ['Задний', 'З.75% / П.25%', 'Полный', 'З.25% / П.75%', 'Передний'].forEach((item, i) => {
            if (currentId === i)
                list.push({name: item, price: methods.moneyFormat(275000 + 25000 * price), desc: 'Установлено', sale: sale, params: {type: 'lsc:s:mod:buy', mod: idx, idx: i + 1, price: 275000 + 25000 * price, shop: shopId}});
            else
                list.push({name: item, price: methods.moneyFormat(275000 + 25000 * price), sale: sale, params: {type: 'lsc:s:mod:buy', idx: i + 1, mod: idx, price: 275000 + 25000 * price, shop: shopId}});
        })
    }
    else {

        for (let i = 1; i < enums.lscSNames[idx][2]; i++) {
            let isSet = false;
            try {
                if (upgrade[idx + 100].toString() === (i / 10).toString())
                    isSet = true;
            }
            catch (e) {}
            if (isSet)
                list.push({name: (i / 10).toString(), price: methods.moneyFormat(enums.lscSNames[idx][1] * price), desc: 'Установлено', sale: sale, params: {type: 'lsc:s:mod:buy', mod: idx, idx: i, price: enums.lscSNames[idx][1] * price, shop: shopId}});
            else
                list.push({name: (i / 10).toString(), price: methods.moneyFormat(enums.lscSNames[idx][1] * price), sale: sale, params: {type: 'lsc:s:mod:buy', mod: idx, idx: i, price: enums.lscSNames[idx][1] * price, shop: shopId}});
        }
    }

    shopMenu.updateShop2(list, shopMenu.getLastSettings().banner, shopMenu.getLastSettings().bg, 1, enums.lscSNames[idx][0]);
};

menuList.showLscSTunningMenu = async function(shopId, price) {

    let veh = mp.players.local.vehicle;

    if (!veh) {
        mp.game.ui.notifications.show(`~r~Необходимо находиться в личном транспорте`);
        return;
    }

    let vehInfo = methods.getVehicleInfo(veh.model);

    let sale = business.getSale(price);
    let list = [];

    if (
        vehInfo.class_name !== 'Helicopters' &&
        vehInfo.class_name !== 'Planes' &&
        vehInfo.class_name !== 'Cycles' &&
        vehInfo.class_name !== 'Utility' &&
        vehInfo.class_name !== 'Boats'
    ) {
        if (vehInfo.class_name !== 'Commercials' && vehInfo.class_name !== 'Motorcycles') {
            list.push({name: `Неоновая подсветка`, price: methods.moneyFormat(90000 + 10000 * price), sale: sale, params: {type: 'lsc:s:setNeon', price: 90000 + 10000 * price, shop: shopId}});
        }

        list.push({name: `Цветные фары`, price: methods.moneyFormat(725000 + 25000 * price), sale: sale, params: {type: 'lsc:s:setLight', price: 725000 + 25000 * price, shop: shopId}});
        list.push({name: `Специальные покрышки с напылением`, price: methods.moneyFormat(475000 + 25000 * price), sale: sale, params: {type: 'lsc:s:setSmoke', price: 475000 + 25000 * price, shop: shopId}});
    }

    if (vehInfo.class_name !== 'Cycles')
        list.push({name: `Дистанционное управление`, price: methods.moneyFormat(10000 * price), sale: sale, params: {type: 'lsc:s:setSpecial', price: 10000 * price, shop: shopId}});

    list.push({name: `Стандартный номер`, price: methods.moneyFormat(5000 * price), sale: sale, params: {type: 'lsc:s:numberPlate', id: 0, price: 5000 * price, shop: shopId}});
    list.push({name: `Белый номер`, price: methods.moneyFormat(5000 * price), sale: sale, params: {type: 'lsc:s:numberPlate', id: 3, price: 5000 * price, shop: shopId}});
    list.push({name: `Чёрный номер`, price: methods.moneyFormat(5000 * price), sale: sale, params: {type: 'lsc:s:numberPlate', id: 1, price: 5000 * price, shop: shopId}});
    list.push({name: `Синий номер`, price: methods.moneyFormat(5000 * price), sale: sale, params: {type: 'lsc:s:numberPlate', id: 2, price: 5000 * price, shop: shopId}});

    shopMenu.updateShop2(list, shopMenu.getLastSettings().banner, shopMenu.getLastSettings().bg, 1, 'Установка модулей');
};

menuList.showLscTyreColorChoiseMenu = async function(shopId, price2 = 500000.01) {

    let veh = mp.players.local.vehicle;

    if (!veh) {
        mp.game.ui.notifications.show(`~r~Необходимо находиться в личном транспорте`);
        return;
    }

    let car = await vehicles.getData(veh.getVariable('container'));

    let list = [];

    for (let i = 0; i < enums.rgbNames.length; i++) {
        try {
            let label = enums.rgbNames[i];
            if (car.get('is_tyre'))
                list.push({name: label, price: methods.moneyFormat(1000), desc: 'Сменить цвет', sale: 0, params: {type: 'lsc:s:buySmoke', id: i, price: 1000, shop: shopId}});
            else
                list.push({name: label, price: methods.moneyFormat(price2), sale: 0, params: {type: 'lsc:s:buySmoke', id: i, price: price2, shop: shopId}});
        }
        catch (e) {
            methods.debug(e);
        }
    }
    shopMenu.updateShop2(list, shopMenu.getLastSettings().banner, shopMenu.getLastSettings().bg, 1, 'Установка покрышек');
};

menuList.showLscTunningMenu = function(shopId, price) {

    let veh = mp.players.local.vehicle;

    if (!veh) {
        mp.game.ui.notifications.show(`~r~Необходимо находиться в личном транспорте`);
        return;
    }

    let vehInfo = methods.getVehicleInfo(veh.model);

    let sale = business.getSale(price);
    let list = [];

    for (let i = 0; i < 100; i++) {
        if (i == 69 || i == 76 || i == 78 || i == 40)
            continue;
        if (i == 11 || i == 12 || i == 13 || i == 15 || i == 18)
            continue;
        try {
            if (veh.getNumMods(i) == 0) continue;
            if (i == 23) continue;

            if (
                vehInfo.display_name == '600sel' ||
                vehInfo.display_name == 'w210' ||
                vehInfo.display_name == 'SV' ||
                vehInfo.display_name == 'Lc100'
            )
                continue;

            if (i == 1 || i == 10) {
                if (vehInfo.display_name == 'Havok' ||
                    vehInfo.display_name == 'Microlight' ||
                    vehInfo.display_name == 'Seasparrow' ||
                    vehInfo.display_name == 'Revolter' ||
                    vehInfo.display_name == 'Viseris' ||
                    vehInfo.display_name == 'Savestra' ||
                    vehInfo.display_name == 'Deluxo' ||
                    vehInfo.display_name == 'Comet4')
                    continue;
            }
            if (i == 9 || i == 10) {
                if (vehInfo.display_name == 'JB7002')
                    continue;
            }
            if (i == 40) {
                if (vehInfo.display_name == 'Nexus')
                    continue;
            }
            if (vehInfo.display_name == 'Vincent3' && (i === 10 || i === 40)) continue;
            if (vehInfo.display_name == 'Thruster' && (i === 1 || i === 10 || i === 11 || i === 12 || i === 23)) continue;
            if (vehInfo.display_name == 'Deathbike' && (i === 40 || i === 43 || i === 44)) continue;
            if (vehInfo.display_name == 'Deathbike2' && (i === 40 || i === 43 || i === 44)) continue;
            if (vehInfo.display_name == 'Deathbike3' && (i === 40 || i === 43 || i === 44)) continue;
            if (vehInfo.display_name == 'Zr380s' && (i === 40)) continue;
            if (vehInfo.display_name == 'Nexus' && (i === 40)) continue;
            if (vehInfo.display_name == 'Mf1c' && (i === 40)) continue;
            if (vehInfo.display_name == 'Sigma3' && (i === 40)) continue;
            if (vehInfo.display_name == 'Stratumc' && (i === 40)) continue;
            if (vehInfo.display_name == 'Sultan2c' && (i === 40)) continue;
            if (vehInfo.display_name == 'Imperator' && (i === 9 || i === 10 || i === 40 || i === 43 || i === 44)) continue;
            if (vehInfo.display_name == 'Imperator2' && (i === 9 || i === 10 || i === 40 || i === 43 || i === 44)) continue;
            if (vehInfo.display_name == 'Imperator3' && (i === 9 || i === 10 || i === 40 || i === 43 || i === 44)) continue;
            if (vehInfo.display_name == 'Issi4' && (i === 9 || i === 10 || i === 40 || i === 43)) continue;
            if (vehInfo.display_name == 'Issi5' && (i === 9 || i === 10 || i === 40 || i === 43)) continue;
            if (vehInfo.display_name == 'Issi6' && (i === 9 || i === 10 || i === 40 || i === 43)) continue;
            if (vehInfo.display_name == 'Zr380' && (i === 9 || i === 40 || i === 43 || i === 44)) continue;
            if (vehInfo.display_name == 'Zr3802' && (i === 9 || i === 40 || i === 43 || i === 44)) continue;
            if (vehInfo.display_name == 'Zr3803' && (i === 9 || i === 40 || i === 43 || i === 44)) continue;
            if (vehInfo.display_name == 'Slamvan4' && (i === 9 || i === 40 || i === 43 || i === 44)) continue;
            if (vehInfo.display_name == 'Slamvan5' && (i === 9 || i === 40 || i === 43 || i === 44)) continue;
            if (vehInfo.display_name == 'Slamvan6' && (i === 9 || i === 40 || i === 43 || i === 44)) continue;
            if (vehInfo.display_name == 'Bruiser' && (i === 9 || i === 40 || i === 43)) continue;
            if (vehInfo.display_name == 'Bruiser2' && (i === 9 || i === 40 || i === 43)) continue;
            if (vehInfo.display_name == 'Bruiser3' && (i === 9 || i === 40 || i === 43)) continue;
            if (vehInfo.display_name == 'Dominator4' && (i === 9 || i === 40 || i === 43)) continue;
            if (vehInfo.display_name == 'Dominator5' && (i === 9 || i === 40 || i === 43)) continue;
            if (vehInfo.display_name == 'Dominator6' && (i === 9 || i === 40 || i === 43)) continue;
            if (vehInfo.display_name == 'Impaler2' && (i === 9 || i === 40 || i === 43)) continue;
            if (vehInfo.display_name == 'Impaler3' && (i === 9 || i === 40 || i === 43)) continue;
            if (vehInfo.display_name == 'Impaler4' && (i === 9 || i === 40 || i === 43)) continue;
            if (vehInfo.display_name == 'Scarab' && (i === 9 || i === 40 || i === 43)) continue;
            if (vehInfo.display_name == 'Scarab2' && (i === 9 || i === 40 || i === 43)) continue;
            if (vehInfo.display_name == 'Scarab3' && (i === 9 || i === 40 || i === 43)) continue;
            if (vehInfo.display_name == 'Brutus' && (i === 9 || i === 40 || i === 43)) continue;
            if (vehInfo.display_name == 'Brutus2' && (i === 9 || i === 40 || i === 43)) continue;
            if (vehInfo.display_name == 'Brutus3' && (i === 9 || i === 40 || i === 43)) continue;
            if (vehInfo.display_name == 'Monster3' && (i === 9 || i === 40)) continue;
            if (vehInfo.display_name == 'Monster4' && (i === 9 || i === 40)) continue;
            if (vehInfo.display_name == 'Monster5' && (i === 9 || i === 40)) continue;

            if (veh.getNumMods(i) > 0 && enums.lscNames[i][1] > 0) {
                let label = mp.game.ui.getLabelText(veh.getModSlotName(i));
                if (label == "NULL" || label == "")
                    label = `${enums.lscNames[i][0]}`;
                list.push({name: enums.lscNames[i][0], price: '', sale: sale, params: {type: 'lsc:list:show', modType: i, shop: shopId}});
            }
        }
        catch (e) {
            methods.debug(e);
        }
    }

    list.push({name: `Тонировка`, price: '', sale: sale, params: {type: 'lsc:list:show', modType: 69, shop: shopId}});
    if (vehInfo.class_name !== 'Boats' && vehInfo.class_name !== 'Planes' && vehInfo.class_name !== 'Helicopters')
     list.push({name: `Высота подвески`, price: '', sale: sale, params: {type: 'lsc:list:show', modType: 15, shop: shopId}});
    //list.push({name: `Турбо`, price: '', sale: sale, params: {type: 'lsc:list:show', modType: 18, shop: shopId}});
    if (veh.getLiveryCount() > 1)
        list.push({name: `Специальная покраска`, price: '', sale: sale, params: {type: 'lsc:list:show', modType: 76, shop: shopId}});

    let isExtra = false;
    for (let i = 0; i < 10; i++) {
        if (veh.doesExtraExist(i))
            isExtra = true;
    }

    if (isExtra && vehInfo.class_name !== 'Planes' && vehInfo.class_name !== 'Helicopters')
        list.push({name: `Экстра тюнинг`, price: '', sale: sale, params: {type: 'lsc:list:show', modType: 80, shop: shopId}});

    if (vehInfo.class_name !== 'Motorcycles' && vehInfo.class_name !== 'Boats' && vehInfo.class_name !== 'Planes' && vehInfo.class_name !== 'Helicopters')
        list.push({name: `Колёса`, price: '', sale: sale, params: {type: 'lsc:list:show', modType: 78, shop: shopId}});

    shopMenu.updateShop2(list, shopMenu.getLastSettings().banner, shopMenu.getLastSettings().bg, 0, 'Тюнинг');
};

menuList.showLscTunning2Menu = function(shopId, price) {

    let veh = mp.players.local.vehicle;

    if (!veh) {
        mp.game.ui.notifications.show(`~r~Необходимо находиться в личном транспорте`);
        return;
    }

    let sale = business.getSale(price);
    let list = [];

    for (let i = 0; i < 100; i++) {
        if (i == 69 || i == 76 || i == 78 || i == 40)
            continue;
        if (i !== 11 && i !== 12 && i !== 13 && i !== 15 && i !== 18)
            continue;
        try {
            if (veh.getNumMods(i) == 0) continue;
            if (i == 23) continue;
            if (veh.getNumMods(i) > 0 && enums.lscNames[i][1] > 0) {
                let label = mp.game.ui.getLabelText(veh.getModSlotName(i));
                if (label == "NULL" || label == "")
                    label = `${enums.lscNames[i][0]}`;
                list.push({name: enums.lscNames[i][0], price: '', sale: sale, params: {type: 'lsc:list:show', modType: i, shop: shopId}});
            }
        }
        catch (e) {
            methods.debug(e);
        }
    }

    list.push({name: `Турбо`, price: '', sale: sale, params: {type: 'lsc:list:show', modType: 18, shop: shopId}});
    shopMenu.updateShop2(list, shopMenu.getLastSettings().banner, shopMenu.getLastSettings().bg, 0, 'Тюнинг');
};

menuList.showLscTunningListMenu = async function(modType, shopId, price) {

    modType = methods.parseInt(modType);

    try {

        let veh = mp.players.local.vehicle;

        if (!veh) {
            mp.game.ui.notifications.show(`~r~Необходимо находиться в личном транспорте`);
            return;
        }

        let car = await vehicles.getData(veh.getVariable('container'));
        let upgradeList = {};
        try {
            upgradeList = JSON.parse(car.get('upgrade'))
        }
        catch (e) {
        }

        let vehInfo = methods.getVehicleInfo(veh.model);

        if (!user.isAdmin()) {
            if (
                vehInfo.class_name == 'Helicopters' ||
                vehInfo.class_name == 'Planes' ||
                vehInfo.class_name == 'Cycles' ||
                //vehInfo.class_name == 'Vans' ||
                vehInfo.class_name == 'Commercials' ||
                vehInfo.class_name == 'Utility' ||
                vehInfo.class_name == 'Boats'
            ) {
                mp.game.ui.notifications.show(`~r~Данный класс транспорта нельзя тюнинговать`);
                return;
            }
        }

        let defaultPrice = price;
        price = price - 1;

        if (vehInfo.price >= 8000 && vehInfo.price < 15000)
            price += 1.2;
        else if (vehInfo.price >= 15000 && vehInfo.price < 30000)
            price += 1.4;
        else if (vehInfo.price >= 30000 && vehInfo.price < 45000)
            price += 1.6;
        else if (vehInfo.price >= 45000 && vehInfo.price < 60000)
            price += 1.8;
        else if (vehInfo.price >= 60000 && vehInfo.price < 75000)
            price += 2;
        else if (vehInfo.price >= 90000 && vehInfo.price < 105000)
            price += 2.2;
        else if (vehInfo.price >= 105000 && vehInfo.price < 120000)
            price += 2.4;
        else if (vehInfo.price >= 120000 && vehInfo.price < 135000)
            price += 2.6;
        else if (vehInfo.price >= 135000 && vehInfo.price < 150000)
            price += 2.8;
        else if (vehInfo.price >= 150000 && vehInfo.price < 200000)
            price += 3;
        else if (vehInfo.price >= 200000 && vehInfo.price < 240000)
            price += 3.3;
        else if (vehInfo.price >= 240000 && vehInfo.price < 280000)
            price += 3.6;
        else if (vehInfo.price >= 280000 && vehInfo.price < 320000)
            price += 4;
        else if (vehInfo.price >= 320000 && vehInfo.price < 380000)
            price += 4.4;
        else if (vehInfo.price >= 380000 && vehInfo.price < 500000)
            price += 5;
        else if (vehInfo.price >= 500000 && vehInfo.price < 600000)
            price += 5.5;
        else if (vehInfo.price >= 600000 && vehInfo.price < 700000)
            price += 6;
        else if (vehInfo.price >= 700000 && vehInfo.price < 800000)
            price += 6.5;
        else if (vehInfo.price >= 800000)
            price += 7;
        else
            price += 1;

        let sale = business.getSale(defaultPrice);
        let list = [];

        if (modType === 14)
            list.push({name: `Стандартная деталь`, price: methods.moneyFormat(enums.lscNames[modType][1] / 2), sale: sale, params: {type: 'lsc:list:remove', modType: modType, price: enums.lscNames[modType][1] / 2, shop: shopId}});
        else
            list.push({name: `Стандартная деталь`, price: methods.moneyFormat((enums.lscNames[modType][1] * price) / 2), sale: sale, params: {type: 'lsc:list:remove', modType: modType, price: (enums.lscNames[modType][1] * price) / 2, shop: shopId}});

        if (modType == 69) {

            let tonerNames = ['Незаметный оттенок', 'Зелёный оттенок', 'Слабое затенение', 'Среднее затенение', 'Сильное затенение'];
            [4, 5, 3, 2, 1].forEach((item, i) => {
                let itemPrice = enums.lscNames[modType][1] * (i + price);
                let label = `${tonerNames[i]}`;
                label = methods.replaceQuotes(label);
                let listItem = {};
                let isBuy = false;

                try {
                    if (upgradeList[modType.toString()] == item)
                        isBuy = true;
                }
                catch (e) {}

                listItem.modType = modType;
                listItem.id = item;
                listItem.type = 'lsc:list:buy';
                listItem.price = itemPrice + 0.001;
                listItem.itemName = label;
                listItem.shop = shopId;

                if (isBuy)
                    list.push({name: label, price: methods.moneyFormat(listItem.price), desc: 'Установлено', sale: sale, params: listItem});
                else
                    list.push({name: label, price: methods.moneyFormat(listItem.price), sale: sale, params: listItem});
            });
        }
        else if (modType == 18) {
            try {
                let itemPrice = enums.lscNames[modType][1] * (1 / 20 + price);
                let label = `${enums.lscNames[modType][0]} SpeedBoost`;
                label = methods.replaceQuotes(label);
                let listItem = {};
                let isBuy = false;

                try {
                    if (upgradeList[modType.toString()] == 0)
                        isBuy = true;
                }
                catch (e) {}
                listItem.modType = modType;
                listItem.id = 0;
                listItem.price = itemPrice + 0.001;
                listItem.itemName = label;
                listItem.type = 'lsc:list:buy';
                listItem.shop = shopId;

                if (isBuy)
                    list.push({name: label, price: methods.moneyFormat(listItem.price), desc: 'Установлено', sale: sale, params: listItem});
                else
                    list.push({name: label, price: methods.moneyFormat(listItem.price), sale: sale, params: listItem});
            }
            catch (e) {
                methods.debug(e);
            }
        }
        else if (modType == 76) {
            for (let i = 0; i < veh.getLiveryCount(); i++) {
                try {
                    let itemPrice = enums.lscNames[modType][1] * (i / 20 + price);
                    let label = `${enums.lscNames[modType][0]} #${(i + 1)}`;
                    label = methods.replaceQuotes(label);
                    let listItem = {};
                    let isBuy = false;

                    try {
                        if (car.get('livery') == i)
                            isBuy = true;
                    }
                    catch (e) {}

                    listItem.modType = modType;
                    listItem.id = i;
                    listItem.price = itemPrice + 0.001;
                    listItem.itemName = label;
                    listItem.type = 'lsc:list:buy';
                    listItem.shop = shopId;

                    if (isBuy)
                        list.push({name: label, price: methods.moneyFormat(listItem.price), desc: 'Установлено', sale: sale, params: listItem});
                    else
                        list.push({name: label, price: methods.moneyFormat(listItem.price), sale: sale, params: listItem});
                }
                catch (e) {
                    methods.debug(e);
                }
            }
        }
        else if (modType == 80) {

            let isExtra = false;

            for (let i = 0; i < 10; i++) {
                if (veh.doesExtraExist(i))
                    isExtra = true;
            }

            for (let i = 0; i < 10; i++) {
                try {
                    if (veh.doesExtraExist(i)) {
                        let itemPrice = enums.lscNames[modType][1] * (i / 20 + price);
                        let label = `${enums.lscNames[modType][0]}`;
                        label = methods.replaceQuotes(label);
                        let listItem = {};
                        let isBuy = false;

                        try {
                            if (car.get('extra') == i)
                                isBuy = true;
                        }
                        catch (e) {}

                        listItem.modType = modType;
                        listItem.id = i;
                        listItem.price = itemPrice + 0.001;
                        listItem.itemName = label;
                        listItem.type = 'lsc:list:buy';
                        listItem.shop = shopId;

                        if (isBuy)
                            list.push({name: label, price: methods.moneyFormat(listItem.price), desc: 'Установлено', sale: sale, params: listItem});
                        else
                            list.push({name: label, price: methods.moneyFormat(listItem.price), sale: sale, params: listItem});
                    }
                }
                catch (e) {
                    methods.debug(e);
                }
            }
        }
        else if (modType == 78) {
            let wheelList = ['Спорт', 'Массл', 'Лоурайдер', 'Кроссовер', 'Внедорожник', 'Специальные', 'Мото', 'Уникальные', 'Benny\'s Original', 'Benny\'s Bespoke', 'Open Wheel', 'Уличные'];
            for (let i = 0; i < wheelList.length; i++) {
                try {
                    let label = `${wheelList[i]}`;
                    label = methods.replaceQuotes(label);
                    let listItem = {};
                    let isBuy = '';

                    try {
                        if ((upgradeList[modType.toString()]) === i)
                            isBuy = true;
                    }
                    catch (e) {}

                    listItem.modType = modType;
                    listItem.id = i;
                    listItem.price = 1;
                    listItem.itemName = label;
                    listItem.showWheel = true;
                    listItem.type = 'lsc:list:buy';
                    listItem.shop = shopId;

                    if (isBuy)
                        list.push({name: label, price: '', desc: 'Установлено', sale: sale, params: listItem});
                    else
                        list.push({name: label, price: '', sale: sale, params: listItem});
                }
                catch (e) {
                    methods.debug(e);
                }
            }
        }
        else {
            for (let i = 0; i < veh.getNumMods(modType); i++) {
                try {

                    if (i == 1 || i == 10) {
                        if (vehInfo.display_name == 'Havok' ||
                            vehInfo.display_name == 'Microlight' ||
                            vehInfo.display_name == 'Seasparrow' ||
                            vehInfo.display_name == 'Revolter' ||
                            vehInfo.display_name == 'Viseris' ||
                            vehInfo.display_name == 'Savestra' ||
                            vehInfo.display_name == 'Deluxo' ||
                            vehInfo.display_name == 'Comet4')
                            continue;
                    }

                    let itemPrice = enums.lscNames[modType][1] * (i / 20 + price);
                    if (modType === 14)
                        itemPrice = enums.lscNames[modType][1];
                    let label = mp.game.ui.getLabelText(veh.getModTextLabel(modType, i));
                    if (label == "NULL" || label == "")
                        label = `${enums.lscNames[modType][0]} #${(i + 1)}`;
                    label = methods.replaceQuotes(label);
                    let listItem = {};
                    let isBuy = false;

                    try {
                        if (upgradeList[modType.toString()] == i)
                            isBuy = true;
                    }
                    catch (e) {}

                    listItem.modType = modType;
                    listItem.id = i;
                    listItem.price = itemPrice + 0.001;
                    listItem.itemName = label;
                    listItem.type = 'lsc:list:buy';
                    listItem.shop = shopId;

                    if (isBuy)
                        list.push({name: label, price: methods.moneyFormat(listItem.price), desc: 'Установлено', sale: sale, params: listItem});
                    else
                        list.push({name: label, price: methods.moneyFormat(listItem.price), sale: sale, params: listItem});
                }
                catch (e) {
                    methods.debug(e);
                }
            }
        }
        shopMenu.updateShop2(list, shopMenu.getLastSettings().banner, shopMenu.getLastSettings().bg, 1, 'Тюнинг');
    }
    catch (e) {
        methods.debug(e);
    }
};


menuList.showGunShopMenu = function(shopId, price = 1)
{
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }

    let sale = business.getSale(price);

    let list = [];
    let gunList = [54, 55, 63, 64, 65, 69, 77, 80, 81, 71, 87, 90, 91, 94, 99, 103, 104, 112, 108];

    if (user.isAdmin(5) && mp.players.local.getVariable('enableAdmin') === true) {
        gunList = [];
        for (let i = 54; i <= 126; i++)
            gunList.push(i);
    }

    gunList.forEach(itemId => {
        let itemPrice = items.getItemPrice(itemId) * price;
        let ammoId = weapons.getGunAmmoNameByItemId(itemId);
        let desc = `Оружие ${methods.removeQuotesAll(items.getItemNameById(itemId))}`;
        if (ammoId > 0)
            desc = `Оружие ${methods.removeQuotesAll(items.getItemNameById(itemId))} использует патроны ${methods.removeQuotesAll(items.getItemNameById(ammoId))}`;
        let shopItem = {
            title: methods.removeQuotesAll(items.getItemNameById(itemId)),
            items: [
                { //Если кликаем сюда, то открывается меню справа (Там где покупка)
                    title: methods.removeQuotesAll(items.getItemNameById(itemId)),
                    desc: desc,
                    desc2: '',
                    desc2t: '',
                    sale: sale,
                    img: `Item_${itemId}.png`,
                    price: methods.moneyFormat(itemPrice),
                    params: {id: itemId, price: itemPrice, shop: shopId}
                }
            ]
        };

        if (ammoId > 0) {
            itemPrice = items.getItemPrice(ammoId) * price;
            shopItem.items.push(
                { //Если кликаем сюда, то открывается меню справа (Там где покупка)
                    title: methods.removeQuotesAll(items.getItemNameById(ammoId)),
                    desc: '',
                    desc2: '',
                    desc2t: '',
                    sale: sale,
                    img: `Item_${ammoId}.png`,
                    price: methods.moneyFormat(itemPrice),
                    params: {id: ammoId, price: itemPrice, shop: shopId}
                }
            );

            let wpName = items.getItemNameHashById(itemId);
            let componentList = weapons.getWeaponComponentList(wpName);

            if (user.isAdmin(5) && mp.players.local.getVariable('enableAdmin') === true) {
                weapons.getTintList(wpName).forEach((item, idx) => {
                    if (idx > 0) {
                        let itemPrice = items.getItemPrice(itemId) * price * 2;
                        shopItem.items.push(
                            { //Если кликаем сюда, то открывается меню справа (Там где покупка)
                                title: methods.removeQuotesAll(`${items.getItemNameById(itemId)}`),
                                desc: '',
                                desc2: item,
                                desc2t: '',
                                sale: sale,
                                img: `Item_${itemId}.png`,
                                price: methods.moneyFormat(itemPrice),
                                params: {id: itemId, price: itemPrice, tint: idx, shop: shopId}
                            }
                        )
                    }
                });

                componentList.forEach(item => {
                    if (item[3] == 0) {
                        let itemPrice = items.getItemPrice(itemId) * price * 2;
                        /*let menuItem = {};
                        menuItem.price = itemPrice;
                        menuItem.itemId = itemId;
                        menuItem.superTint = item[2].toString();
                        UIMenu.Menu.AddMenuItemList(`${items.getItemNameById(itemId)} ${item[1]}`, tintList, `Цена: ~g~${methods.moneyFormat(itemPrice)}`, menuItem);*/

                        shopItem.items.push(
                            { //Если кликаем сюда, то открывается меню справа (Там где покупка)
                                title: methods.removeQuotesAll(`${items.getItemNameById(itemId)}`),
                                desc: '',
                                desc2: item[1],
                                desc2t: '',
                                sale: sale,
                                img: `Item_${itemId}.png`,
                                price: methods.moneyFormat(itemPrice),
                                params: {id: itemId, price: itemPrice, superTint: item[2].toString(), shop: shopId}
                            }
                        )
                    }
                });
            }

            componentList.forEach(item => {
                if (item[3] == 0) return;
                if (item[3] == 4) return;
                if (item[0] == wpName) {
                    let wpcId = items.getWeaponComponentIdByHash(item[2], wpName);
                    itemPrice = items.getItemPrice(wpcId) * price;
                    let itemName = items.getItemNameById(wpcId);
                    if (itemName == 'UNKNOWN') return;

                    /*let img = 'grip'; //Рукоятка
                    if (item[3] === 1) //Надульник
                        img = 'supressor';
                    if (item[3] === 2) //Фонарик
                        img = 'flashlight';
                    if (item[3] === 3) //Прицел
                        img = 'scope';*/

                    shopItem.items.push(
                        { //Если кликаем сюда, то открывается меню справа (Там где покупка)
                            title: methods.removeQuotesAll(items.getItemNameById(wpcId)),
                            desc: '',
                            desc2: '',
                            desc2t: '',
                            sale: sale,
                            img: `Item_${wpcId}.png`,
                            price: methods.moneyFormat(itemPrice),
                            params: {id: wpcId, price: itemPrice, shop: shopId}
                        }
                    )
                }
            });
        }

        list.push(shopItem);
    });

    enums.shopItems.gun.forEach(item => {

        let fullItem = {
            title: item.title,
            items: []
        };

        item.list.forEach(itemId => {
            let itemPrice = items.getItemPrice(itemId) * price;
            fullItem.items.push({ //Если кликаем сюда, то открывается меню справа (Там где покупка)
                title: methods.removeQuotesAll(items.getItemNameById(itemId)),
                desc: '',
                desc2: '',
                desc2t: '',
                sale: sale,
                img: `Item_${itemId}.png`,
                price: methods.moneyFormat(itemPrice),
                params: {id: itemId, price: itemPrice, shop: shopId}
            })
        });
        list.push(fullItem);
    });

    list.push({
        title: 'Бронежилеты',
        items: [{ //Если кликаем сюда, то открывается меню справа (Там где покупка)
            title: 'Лёгкий бронежилет',
            desc: 'Помимо защиты от пуль, в нем можно хранить вещи',
            desc2: '',
            desc2t: '',
            sale: 0,
            img: `Item_252.png`,
            price: methods.moneyFormat(400 * price),
            params: {doName: 'armour', price: 400 * price, count: 30, shop: shopId}
        }, { //Если кликаем сюда, то открывается меню справа (Там где покупка)
            title: 'Средний бронежилет',
            desc: 'Помимо защиты от пуль, в нем можно хранить вещи',
            desc2: '',
            desc2t: '',
            sale: 0,
            img: `Item_252.png`,
            price: methods.moneyFormat(800 * price),
            params: {doName: 'armour', price: 800 * price, count: 60, shop: shopId}
        }]
    });

    shopMenu.showShop();
    shopMenu.updateShop(list, 'ammu', '#922026');
};

menuList.showGunShopWeaponMenu = function(shopId, itemId, price = 1)
{
    if (methods.isBlackout()) {
        mp.game.ui.notifications.show(`~r~В городе отсутствует свет`);
        return;
    }
    let wpName = items.getItemNameHashById(itemId);
    let componentList = weapons.getWeaponComponentList(wpName);
    let countColorsComponent = 0;

    componentList.forEach(item => {
        if (item[3] == 0)
            countColorsComponent++;
    });

    let tintList = ['Black', 'Green', 'Orange'];
    let tintListId = [0, 1, 6];
    if (wpName.indexOf('_mk2') >= 0) {
        tintList = ['Black', 'Gray', 'Two-Tone', 'White', 'Earth', 'Brown & Black', 'Red', 'Blue', 'Orange'];
        tintListId = [0, 1, 2, 3, 7, 8, 9, 10, 12];
    }

    UIMenu.Menu.Create(" ", "~b~Магазин оружия", 'false', false, false, 'ammu');

    let isLic = weapons.getGunSlotIdByItem(itemId) != 5;

    if (isLic && !user.getCache('gun_lic'))
        UIMenu.Menu.AddMenuItem('~r~Требуется лицензия на оружие');

    let itemPrice = items.getItemPrice(itemId) * price;
    let menuItem = {};
    menuItem.price = itemPrice;
    menuItem.itemId = itemId;
    menuItem.superTint = 0;
    UIMenu.Menu.AddMenuItemList(items.getItemNameById(itemId), tintList, `Цена: ~g~${methods.moneyFormat(itemPrice)}`, menuItem);

    componentList.forEach(item => {
        if (item[3] == 0) {
            let itemPrice = items.getItemPrice(itemId) * price * 2;
            let menuItem = {};
            menuItem.price = itemPrice;
            menuItem.itemId = itemId;
            menuItem.superTint = item[2].toString();
            UIMenu.Menu.AddMenuItemList(`${items.getItemNameById(itemId)} ${item[1]}`, tintList, `Цена: ~g~${methods.moneyFormat(itemPrice)}`, menuItem);
        }
    });

    let ammoId = weapons.getGunAmmoNameByItemId(itemId);
    if (ammoId > 0) {
        let itemPrice = items.getItemPrice(ammoId) * price;
        let menuItem = {};
        menuItem.price = itemPrice;
        menuItem.itemId = ammoId;
        UIMenu.Menu.AddMenuItem(items.getItemNameById(ammoId), `Цена: ~g~${methods.moneyFormat(itemPrice)}`, menuItem);

        let isFind = false;
        componentList.forEach(item => {
            if (item[3] == 0) return;
            if (item[3] == 4) return;
            if (item[0] == wpName) {

                if (!isFind)
                    UIMenu.Menu.AddMenuItem('~b~Модификации к оружию:');

                isFind = true;

                let wpcId = items.getWeaponComponentIdByHash(item[2], wpName);
                itemPrice = items.getItemPrice(wpcId) * price;
                let itemName = items.getItemNameById(wpcId);
                if (itemName == 'UNKNOWN') return;
                menuItem = {};
                menuItem.price = itemPrice;
                menuItem.itemId = wpcId;
                UIMenu.Menu.AddMenuItem(items.getItemNameById(wpcId), `Цена: ~g~${methods.moneyFormat(itemPrice)}`, menuItem);
            }
        });
    }

    UIMenu.Menu.AddMenuItem("~g~Назад", "", {doName: "backButton"});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    let listIndex = 0;
    UIMenu.Menu.OnList.Add((item, index) => {
        listIndex = index;
    });

    UIMenu.Menu.OnSelect.Add((item, index) => {
        try {

            if (item.armor) {
                if (item.price > user.getCashMoney()) {
                    mp.game.ui.notifications.show("~r~У вас недостаточно средств");
                    return;
                }
                user.setArmour(item.armor);
                mp.game.ui.notifications.show("~b~Вы купили бронежилет");
                user.removeCashMoney(item.price, 'Покупка бронежилета');
                business.addMoney(shopId, item.price, 'Бронежилет');
            }
            else if (item.price > 0) {
                if (isLic && !user.getCache('gun_lic')) {
                    mp.game.ui.notifications.show("~r~У Вас нет лицензии на оружие\nКупить ее можно у сотрудников LSPD или BCSD");
                    return;
                }
                if (item.superTint)
                    mp.events.callRemote('server:gun:buy', item.itemId, item.price, 1, item.superTint, tintListId[listIndex], shopId);
                else
                    mp.events.callRemote('server:gun:buy', item.itemId, item.price, 1, 0, 0, shopId);
            }
            else if (item.doName == 'backButton') {
                menuList.showGunShopMenu(shopId, price);
            }
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

menuList.showAnimationTypeListMenu = function() {

    UIMenu.Menu.Create(`Анимации`, `~b~Меню анимаций`);

    UIMenu.Menu.AddMenuItem("Анимации действий", "", {doName: "animActionItem"});
    UIMenu.Menu.AddMenuItem("Позирующие анимации", "", {doName: "animPoseItem"});
    UIMenu.Menu.AddMenuItem("Положительные эмоции", "", {doName: "animPositiveItem"});
    UIMenu.Menu.AddMenuItem("Негативные эмоции", "", {doName: "animNegativeItem"});
    UIMenu.Menu.AddMenuItem("Танцы", "", {doName: "animDanceItem"});
    UIMenu.Menu.AddMenuItem("Остальные анимации", "", {doName: "animOtherItem"});
    UIMenu.Menu.AddMenuItem("Взаимодействие", "", {doName: "animSyncItem"});
    UIMenu.Menu.AddMenuItem("~y~Остановить анимацию", "", {doName: "animStopItem"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'animStopItem')
            user.stopAllAnimation();
        else if (item.doName === 'animOtherItem')
            menuList.showAnimationOtherListMenu();
        else if (item.doName === 'animSyncItem')
            menuList.showAnimationSyncListMenu();
        else if (item.doName === 'animActionItem')
            menuList.showAnimationListMenu('Анимации действий', enums.animActions);
        else if (item.doName === 'animDanceItem')
            menuList.showAnimationListMenu('Танцы', enums.animDance);
        else if (item.doName === 'animNegativeItem')
            menuList.showAnimationListMenu('Негативные эмоции', enums.animNegative);
        else if (item.doName === 'animPositiveItem')
            menuList.showAnimationListMenu('Положительные эмоции', enums.animPositive);
        else if (item.doName === 'animPoseItem')
            menuList.showAnimationListMenu('Позирующие анимации', enums.animPose);

    });
};

menuList.showAnimationListMenu = function(subtitle, array) {

    UIMenu.Menu.Create(`Анимации`, `~b~${subtitle}`);

    array.forEach(function (item, i, arr) {
        let menuItem = {};
        menuItem.anim1 = item[1];
        menuItem.anim2 = item[2];
        menuItem.animFlag = item[3];
        if (subtitle === 'Танцы')
            UIMenu.Menu.AddMenuItem(`${item[0]}`, '', menuItem);
        else
            UIMenu.Menu.AddMenuItem(`${item[0]}`, '', menuItem, '', item[1] + '_' + item[2]);
    });

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        if (item.doName === 'closeMenu') {
            UIMenu.Menu.HideMenu();
            return;
        }

        if (mp.players.local.isInAir() ||
            mp.players.local.isReloading() ||
            mp.players.local.isRagdoll() ||
            mp.players.local.isFalling() ||
            mp.players.local.isShooting() ||
            //remotePlayer.isSprinting() ||
            mp.players.local.isGettingUp() ||
            mp.players.local.vehicle ||
            mp.players.local.getHealth() <= 0
        ) {
            mp.game.ui.notifications.show(`~b~Данное действие сейчас не доступно`);
            return;
        }

        mp.game.ui.notifications.show(`~b~Нажмите ~s~${bind.getKeyName(user.getCache('s_bind_stopanim'))}~b~ чтобы отменить анимацию`);
        user.playAnimation(item.anim1, item.anim2, item.animFlag);
    });
};

menuList.showAnimationOtherListMenu = function() {

    UIMenu.Menu.Create(`Анимации`, `~b~Остальные анимации`);

    enums.scenarios.forEach(function (item, i, arr) {
        UIMenu.Menu.AddMenuItem(`${item[0]}`, '', {scenario: item[1]}, '', item[1]);
    });

    enums.animRemain.forEach(function (item, i, arr) {
        let menuItem = {};
        menuItem.anim1 = item[1];
        menuItem.anim2 = item[2];
        menuItem.animFlag = item[3];
        UIMenu.Menu.AddMenuItem(`${item[0]}`, '', menuItem, '', item[1] + '_' + item[2]);
    });

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        if (item.doName === 'closeMenu') {
            UIMenu.Menu.HideMenu();
            return;
        }
        mp.game.ui.notifications.show(`~b~Нажмите ~s~${bind.getKeyName(user.getCache('s_bind_stopanim'))}~b~ чтобы отменить анимацию`);
        if (item.scenario)
            user.playScenario(item.scenario);
        else
            user.playAnimation(item.anim1, item.anim2, item.animFlag);
    });
};

menuList.showAnimationSyncListMenu = function() {

    UIMenu.Menu.Create(`Анимации`, `~b~Взаимодействие`);

    UIMenu.Menu.AddMenuItem(`Поздороваться 1`, "", {animId: 0});
    UIMenu.Menu.AddMenuItem(`Поздороваться 2`, "", {animId: 2});
    UIMenu.Menu.AddMenuItem(`Дать пять`, "", {animId: 1});
    UIMenu.Menu.AddMenuItem(`Поцелуй`, "", {animId: 3});
    UIMenu.Menu.AddMenuItem(`Минет`, "", {animId: 4});
    UIMenu.Menu.AddMenuItem(`Секс`, "", {animId: 5});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        if (item.doName === 'closeMenu') {
            UIMenu.Menu.HideMenu();
            return;
        }

        let playerId = methods.parseInt(await UIMenu.Menu.GetUserInput("ID Игрока", "", 9));
        if (playerId < 0) {
            mp.game.ui.notifications.show("~r~ID Игркоа не может быть меньше нуля");
            return;
        }
        mp.events.callRemote('server:user:askAnim', playerId, item.animId)
        //user.playAnimationWithUser(playerId, item.animId);
    });
};

menuList.showFractionKeyMenu = function(data) {

    UIMenu.Menu.Create(`Транспорт`, `~b~Транспорт организации`);

    data.forEach(function (item) {

        if (item.rank < 0) {
            UIMenu.Menu.AddMenuItem(`~c~${item.name}: ~s~`, `Транспорт не доступен`, {}, `${item.number + item.id}`);
            return;
        }

        if (item.rank >= user.getCache('rank') || user.isLeader() || user.isSubLeader()) {
            let menuItem = {};
            menuItem.vehicleId = item.id;
            menuItem.vName = item.name;
            UIMenu.Menu.AddMenuItem(`~b~${item.name}: ~s~`, "Нажмите \"~g~Enter~s~\" чтобы взять транспорт", menuItem, `${item.number}`);
        }
        else {
            UIMenu.Menu.AddMenuItem(`~c~${item.name}: ~s~`, `Транспорт не доступен`, {}, `${item.number + item.id}`);
        }
    });

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add((item, index) => {
        UIMenu.Menu.HideMenu();

        if (item.vehicleId != undefined) {
            mp.events.callRemote('server:vehicle:spawnFractionCar', item.vehicleId);
        }
    });
};

menuList.showFractionInfoMenu = function() {

    UIMenu.Menu.Create(`Организация`, `~b~Ваша органзация`);

    if (user.isLeader() || user.isSubLeader() || ((user.isDepLeader() || user.isDepSubLeader()) && user.getCache('rank_type') === 0))
        UIMenu.Menu.AddMenuItem(`Принять в организацию`, '', {invite: true});

    if (user.isSapd() || user.isSheriff() || user.isFib()) {
        UIMenu.Menu.AddMenuItem(`Выдать лицензию на оружие`, "Стоимость: ~g~$30,000", {licName: "gun_lic"});

        UIMenu.Menu.AddMenuItem(`Забрать лицензию категории А`, "", {licRName: "a_lic"});
        UIMenu.Menu.AddMenuItem(`Забрать лицензию категории B`, "", {licRName: "b_lic"});
        UIMenu.Menu.AddMenuItem(`Забрать лицензию категории C`, "", {licRName: "c_lic"});
        UIMenu.Menu.AddMenuItem(`Забрать лицензию пилота`, "", {licRName: "air_lic"});
        UIMenu.Menu.AddMenuItem(`Забрать лицензию на водный ТС`, "", {licRName: "ship_lic"});
        UIMenu.Menu.AddMenuItem(`Забрать лицензию на перевозку пассажиров`, {licRName: "taxi_lic"});
        UIMenu.Menu.AddMenuItem(`Забрать лицензию на оружие`, "", {licRName: "gun_lic"});
    }
    if (user.isGov()) {

        if (user.isLeader())
            UIMenu.Menu.AddMenuItem(`Кабинет штата`, '', {coffer: true});

        UIMenu.Menu.AddMenuItem(`Выдать лицензию юриста`, "Стоимость: ~g~$20,000", {licName: "law_lic"});
        UIMenu.Menu.AddMenuItem(`Выдать лицензию на предпринимательство`, "Стоимость: ~g~$20,000", {licName: "biz_lic"});
        UIMenu.Menu.AddMenuItem(`Выдать разрешение на рыбаловство`, "Стоимость: ~g~$10,000", {licName: "fish_lic"});

        UIMenu.Menu.AddMenuItem(`Забрать лицензию юриста`, "", {licRName: "law_lic"});
        UIMenu.Menu.AddMenuItem(`Забрать лицензию на предпринимательство`, "", {licRName: "biz_lic"});
        UIMenu.Menu.AddMenuItem(`Забрать лицензию на рыбаловство`, "", {licRName: "fish_lic"});
    }
    if (user.isEms()) {
        UIMenu.Menu.AddMenuItem(`Выдать мед. страховку`, "Стоимость: ~g~$20,000", {licName: "med_lic"});
        UIMenu.Menu.AddMenuItem(`Выдать разрешение на марихуану`, "Стоимость: ~g~$5,000", {licName: "marg_lic"});
    }
    if (user.isCartel()) {
        UIMenu.Menu.AddMenuItem(`Выдать разрешение на рыбаловство`, "Стоимость: ~g~$10,000", {licName: "fish_lic"});
        UIMenu.Menu.AddMenuItem(`Забрать лицензию на рыбаловство`, "", {licRName: "fish_lic"});

        UIMenu.Menu.AddMenuItem(`Выдать мед. страховку`, "Стоимость: ~g~$20,000", {licName: "med_lic"});
        UIMenu.Menu.AddMenuItem(`Выдать разрешение на марихуану`, "Стоимость: ~g~$5,000", {licName: "marg_lic"});
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();

        if (item.licName) {

            let id = methods.parseInt(await UIMenu.Menu.GetUserInput("ID Игрока", "", 9));
            if (id < 0) {
                mp.game.ui.notifications.show("~r~ID Игркоа не может быть меньше нуля");
                return;
            }

            if (item.licName == 'gun_lic')
                mp.events.callRemote('server:user:askSellLic', id, item.licName, 30000);
            if (item.licName == 'law_lic')
                mp.events.callRemote('server:user:askSellLic', id, item.licName, 20000);
            if (item.licName == 'biz_lic')
                mp.events.callRemote('server:user:askSellLic', id, item.licName, 20000);
            if (item.licName == 'med_lic')
                mp.events.callRemote('server:user:askSellLic', id, item.licName, 20000);
            if (item.licName == 'marg_lic')
                mp.events.callRemote('server:user:askSellLic', id, item.licName, 5000);
            if (item.licName == 'fish_lic')
                mp.events.callRemote('server:user:askSellLic', id, item.licName, 10000);
        }
        if (item.licRName) {

            let id = methods.parseInt(await UIMenu.Menu.GetUserInput("Card ID Игрока", "", 9));
            if (id < 0) {
                mp.game.ui.notifications.show("~r~ID Игркоа не может быть меньше нуля");
                return;
            }
            mp.events.callRemote('server:user:askSellRLic', id, item.licRName);
        }

        if (item.invite) {

            let id = methods.parseInt(await UIMenu.Menu.GetUserInput("ID Игрока", "", 9));
            if (id < 0) {
                mp.game.ui.notifications.show("~r~ID Игркоа не может быть меньше нуля");
                return;
            }
            mp.events.callRemote('server:user:invite', id);
        }

        if (item.coffer) {
            menuList.showCofferInfoMenu(await coffer.getAllData());
        }
    });
};

menuList.showFractionInvaderMenu = function() {

    UIMenu.Menu.Create(`Организация`, `~b~Ваша органзация`);

    if (!user.isLeader() && !user.isSubLeader() && !user.isDepLeader() && !user.isDepSubLeader() && user.getCache('rank_type') === 0) {
        UIMenu.Menu.AddMenuItem(`~y~Не доступно для стажеров`);
    }
    if (user.isLeader() || user.isSubLeader() || user.getCache('rank_type') > 0) {
        UIMenu.Menu.AddMenuItem(`Список объявлений`, "", {adList: true});
        UIMenu.Menu.AddMenuItem(`Список всех объявлений`, "", {adListAll: true});
    }
    if (user.isLeader() || user.isSubLeader() || user.getCache('rank_type') === 2) {
        UIMenu.Menu.AddMenuItem(`Написать новость`, "", {writeNews: true});
        UIMenu.Menu.AddMenuItem(`Список новостей`, "", {newsList: true});
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();

        if (item.writeNews) {
            menuList.showFractionInvaderNewsWriteMenu();
        }
        if (item.newsList) {
            mp.events.callRemote('server:invader:getNewsList');
        }
        if (item.adList) {
            mp.events.callRemote('server:invader:getAdTempList');
        }
        if (item.adListAll) {
            mp.events.callRemote('server:invader:getAdList');
        }
    });
};


menuList.showFractionInvaderNewsWriteMenu = function() {

    let title = '';
    let text = '';

    UIMenu.Menu.Create(`Организация`, `~b~Написать новость`);

    UIMenu.Menu.AddMenuItem(`~b~Заголовок~s~`, "", {title: true});
    UIMenu.Menu.AddMenuItem(`~b~Введите текст`, "", {text: true});
    UIMenu.Menu.AddMenuItem(`Прочитать текст`, "", {textRead: true});

    UIMenu.Menu.AddMenuItem(`~g~Отправить`, "", {save: true}).save = true;

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {

        if (item.title) {
            title = await UIMenu.Menu.GetUserInput("Введите заголовок", methods.replaceAll(methods.replaceAll(title, '\'', '`'), '"', '`'), 20);
            item.SetRightLabel(title);
            mp.game.ui.notifications.show("~b~Вы написали заголовок\n" + title);
        }
        if (item.text) {
            text = await UIMenu.Menu.GetUserInput("Введите текст", methods.replaceAll(methods.replaceAll(text, '\'', '`'), '"', '`'), 200);
            mp.game.ui.notifications.show("~b~Вы написали текст\n~s~" + text);
        }
        if (item.textRead) {
            chat.sendLocal(text);
        }
        if (item.save) {
            UIMenu.Menu.HideMenu();
            mp.events.callRemote('server:invader:sendNews', title, text);
        }
    });
};

menuList.showCofferInfoMenu = function(data) {

    UIMenu.Menu.Create(` `, `~b~Кабинет штата`, 'gov', false, false, 'gov');

    UIMenu.Menu.AddMenuItem("В казне средств: ", "", {}, '~g~' + methods.moneyFormat(data.get('cofferMoney')));

    UIMenu.Menu.AddMenuItem("Пособие", `Текущая ставка: ~g~${methods.moneyFormat(data.get('cofferBenefit'))}`, {doName: "cofferBenefit"});
    UIMenu.Menu.AddMenuItem("Налог на имущество", `Текущая ставка: ~g~${data.get('cofferTaxProperty')}%`, {doName: "cofferTaxProperty"});
    UIMenu.Menu.AddMenuItem("Налог на зарплату", `Текущая ставка: ~g~${data.get('cofferTaxPayDay')}%`, {doName: "cofferTaxPayDay"});
    UIMenu.Menu.AddMenuItem("Налог на бизнес", `Текущая ставка: ~g~${data.get('cofferTaxBusiness')}%`, {doName: "cofferTaxBusiness"});
    UIMenu.Menu.AddMenuItem("Промежуточный налог", `Текущая ставка: ~g~${data.get('cofferTaxIntermediate')}%`, {doName: "cofferTaxIntermediate"});

    UIMenu.Menu.AddMenuItem("Финансировать бюджет правительства", "", {doName: "cofferGiveGov"});
    UIMenu.Menu.AddMenuItem("Финансировать бюджет LSPD", "", {doName: "cofferGiveLspd"});
    UIMenu.Menu.AddMenuItem("Финансировать бюджет BCSD", "", {doName: "cofferGiveSheriff"});
    UIMenu.Menu.AddMenuItem("Финансировать бюджет USMC", "", {doName: "cofferGiveUsmc"});
    UIMenu.Menu.AddMenuItem("Финансировать бюджет FIB", "", {doName: "cofferGiveFib"});
    UIMenu.Menu.AddMenuItem("Финансировать бюджет EMS", "", {doName: "cofferGiveEms"});
    UIMenu.Menu.AddMenuItem("Финансировать бюджет Invader News", "", {doName: "cofferGiveInvader"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {

        if (item.doName == 'cofferGiveGov') {
            let price = methods.parseFloat(await UIMenu.Menu.GetUserInput("Введите сумму", '', 10));

            if (price < 0) {
                mp.game.ui.notifications.show(`~r~Значение не может быть меньше нуля`);
                return;
            }
            if (price > await coffer.getMoney()) {
                mp.game.ui.notifications.show(`~r~В Бюджете недостаточно средств`);
                return;
            }
            if (price > 1000000) {
                mp.game.ui.notifications.show(`~r~Значение не может быть больше 1,000,000`);
                return;
            }
            coffer.removeMoney(1, price);
            coffer.addMoney(2, price);

            methods.saveLog('log_coffer',
                ['name', 'text'],
                [user.getCache('name'), `Перевёл ${methods.moneyFormat(price)} из казны на счёт Правительства.`],
            );
            mp.game.ui.notifications.show(`~g~Вы перевели денежные средства`);
        }
        if (item.doName == 'cofferGiveLspd') {
            let price = methods.parseFloat(await UIMenu.Menu.GetUserInput("Введите сумму", '', 10));

            if (price < 0) {
                mp.game.ui.notifications.show(`~r~Значение не может быть меньше нуля`);
                return;
            }
            if (price > await coffer.getMoney()) {
                mp.game.ui.notifications.show(`~r~В Бюджете недостаточно средств`);
                return;
            }
            if (price > 1000000) {
                mp.game.ui.notifications.show(`~r~Значение не может быть больше 1,000,000`);
                return;
            }
            coffer.removeMoney(1, price);
            coffer.addMoney(3, price);

            methods.saveLog('log_coffer',
                ['name', 'text'],
                [user.getCache('name'), `Перевёл ${methods.moneyFormat(price)} из казны на счёт LSPD.`],
            );
            mp.game.ui.notifications.show(`~g~Вы перевели денежные средства`);
        }
        if (item.doName == 'cofferGiveSheriff') {
            let price = methods.parseFloat(await UIMenu.Menu.GetUserInput("Введите сумму", '', 10));

            if (price < 0) {
                mp.game.ui.notifications.show(`~r~Значение не может быть меньше нуля`);
                return;
            }
            if (price > await coffer.getMoney()) {
                mp.game.ui.notifications.show(`~r~В Бюджете недостаточно средств`);
                return;
            }
            if (price > 1000000) {
                mp.game.ui.notifications.show(`~r~Значение не может быть больше 1,000,000`);
                return;
            }
            coffer.removeMoney(1, price);
            coffer.addMoney(4, price);

            methods.saveLog('log_coffer',
                ['name', 'text'],
                [user.getCache('name'), `Перевёл ${methods.moneyFormat(price)} из казны на счёт BCSD.`],
            );
            mp.game.ui.notifications.show(`~g~Вы перевели денежные средства`);
        }
        if (item.doName == 'cofferGiveFib') {
            let price = methods.parseFloat(await UIMenu.Menu.GetUserInput("Введите сумму", '', 10));

            if (price < 0) {
                mp.game.ui.notifications.show(`~r~Значение не может быть меньше нуля`);
                return;
            }
            if (price > await coffer.getMoney()) {
                mp.game.ui.notifications.show(`~r~В Бюджете недостаточно средств`);
                return;
            }
            if (price > 1000000) {
                mp.game.ui.notifications.show(`~r~Значение не может быть больше 1,000,000`);
                return;
            }
            coffer.removeMoney(1, price);
            coffer.addMoney(5, price);

            methods.saveLog('log_coffer',
                ['name', 'text'],
                [user.getCache('name'), `Перевёл ${methods.moneyFormat(price)} из казны на счёт FIB.`],
            );
            mp.game.ui.notifications.show(`~g~Вы перевели денежные средства`);
        }
        if (item.doName == 'cofferGiveUsmc') {
            let price = methods.parseFloat(await UIMenu.Menu.GetUserInput("Введите сумму", '', 10));

            if (price < 0) {
                mp.game.ui.notifications.show(`~r~Значение не может быть меньше нуля`);
                return;
            }
            if (price > await coffer.getMoney()) {
                mp.game.ui.notifications.show(`~r~В Бюджете недостаточно средств`);
                return;
            }
            if (price > 1000000) {
                mp.game.ui.notifications.show(`~r~Значение не может быть больше 1,000,000`);
                return;
            }
            coffer.removeMoney(1, price);
            coffer.addMoney(7, price);

            methods.saveLog('log_coffer',
                ['name', 'text'],
                [user.getCache('name'), `Перевёл ${methods.moneyFormat(price)} из казны на счёт USMC.`],
            );
            mp.game.ui.notifications.show(`~g~Вы перевели денежные средства`);
        }
        if (item.doName == 'cofferGiveEms') {
            let price = methods.parseFloat(await UIMenu.Menu.GetUserInput("Введите сумму", '', 10));

            if (price < 0) {
                mp.game.ui.notifications.show(`~r~Значение не может быть меньше нуля`);
                return;
            }
            if (price > await coffer.getMoney()) {
                mp.game.ui.notifications.show(`~r~В Бюджете недостаточно средств`);
                return;
            }
            if (price > 1000000) {
                mp.game.ui.notifications.show(`~r~Значение не может быть больше 1,000,000`);
                return;
            }
            coffer.removeMoney(1, price);
            coffer.addMoney(6, price);

            methods.saveLog('log_coffer',
                ['name', 'text'],
                [user.getCache('name'), `Перевёл ${methods.moneyFormat(price)} из казны на счёт EMS.`],
            );
            mp.game.ui.notifications.show(`~g~Вы перевели денежные средства`);
        }
        if (item.doName == 'cofferGiveInvader') {
            let price = methods.parseFloat(await UIMenu.Menu.GetUserInput("Введите сумму", '', 10));

            if (price < 0) {
                mp.game.ui.notifications.show(`~r~Значение не может быть меньше нуля`);
                return;
            }
            if (price > await coffer.getMoney()) {
                mp.game.ui.notifications.show(`~r~В Бюджете недостаточно средств`);
                return;
            }
            if (price > 1000000) {
                mp.game.ui.notifications.show(`~r~Значение не может быть больше 1,000,000`);
                return;
            }
            coffer.removeMoney(1, price);
            coffer.addMoney(8, price);

            methods.saveLog('log_coffer',
                ['name', 'text'],
                [user.getCache('name'), `Перевёл ${methods.moneyFormat(price)} из казны на счёт Life Invader.`],
            );
            mp.game.ui.notifications.show(`~g~Вы перевели денежные средства`);
        }
        if (item.doName == 'cofferTaxIntermediate') {
            let price = methods.parseFloat(await UIMenu.Menu.GetUserInput("Введите число", '', 10));

            if (price < 1) {
                mp.game.ui.notifications.show(`~r~Значение не может быть меньше 1`);
                return;
            }
            if (price > 10) {
                mp.game.ui.notifications.show(`~r~Значение не может быть больше 10`);
                return;
            }

            coffer.setTaxIntermediate(1, price);
            methods.notifyWithPictureToAll(
                `Губернатор`,
                'Новости правительства',
                `Изменён промежуточный налог.\nСтарое значение: ~g~${data.get('cofferTaxIntermediate')}%~s~\nНовое значение: ~g~${price}%`,
                'CHAR_FLOYD'
            );
        }
        if (item.doName == 'cofferTaxBusiness') {
            let price = methods.parseFloat(await UIMenu.Menu.GetUserInput("Введите число", '', 10));

            if (price < 10) {
                mp.game.ui.notifications.show(`~r~Значение не может быть меньше 10`);
                return;
            }
            if (price > 20) {
                mp.game.ui.notifications.show(`~r~Значение не может быть больше 20`);
                return;
            }

            coffer.setTaxBusiness(1, price);
            methods.notifyWithPictureToAll(
                `Губернатор`,
                'Новости правительства',
                `Изменён налог на бизнес.\nСтарое значение: ~g~${data.get('cofferTaxBusiness')}%~s~\nНовое значение: ~g~${price}%`,
                'CHAR_FLOYD'
            );
        }
        if (item.doName == 'cofferTaxPayDay') {
            let price = methods.parseFloat(await UIMenu.Menu.GetUserInput("Введите число", '', 10));

            if (price < 1) {
                mp.game.ui.notifications.show(`~r~Значение не может быть меньше 1`);
                return;
            }
            if (price > 10) {
                mp.game.ui.notifications.show(`~r~Значение не может быть больше 10`);
                return;
            }

            coffer.setTaxPayDay(1, price);
            methods.notifyWithPictureToAll(
                `Губернатор`,
                'Новости правительства',
                `Изменён налог на зарплату.\nСтарое значение: ~g~${data.get('cofferTaxPayDay')}%~s~\nНовое значение: ~g~${price}%`,
                'CHAR_FLOYD'
            );
        }
        if (item.doName == 'cofferTaxProperty') {
            let price = methods.parseFloat(await UIMenu.Menu.GetUserInput("Введите число", '', 10));

            if (price < 1) {
                mp.game.ui.notifications.show(`~r~Значение не может быть меньше 1`);
                return;
            }
            if (price > 10) {
                mp.game.ui.notifications.show(`~r~Значение не может быть больше 10`);
                return;
            }

            coffer.setTaxIntermediate(1, price);
            methods.notifyWithPictureToAll(
                `Губернатор`,
                'Новости правительства',
                `Изменён налог на имущество.\nСтарое значение: ~g~${data.get('cofferTaxProperty')}%~s~\nНовое значение: ~g~${price}%`,
                'CHAR_FLOYD'
            );
        }
        if (item.doName == 'cofferBenefit') {
            let price = methods.parseFloat(await UIMenu.Menu.GetUserInput("Введите число", '', 10));

            if (price < 0) {
                mp.game.ui.notifications.show(`~r~Значение не может быть меньше нуля`);
                return;
            }
            if (price > 100) {
                mp.game.ui.notifications.show(`~r~Значение не может быть больше 100`);
                return;
            }

            coffer.setBenefit(1, price);
            methods.notifyWithPictureToAll(
                `Губернатор`,
                'Новости правительства',
                `Изменена ставка на пособие.\nСтарое значение: ~g~${methods.moneyFormat(data.get('cofferBenefit'))}~s~\nНовое значение: ~g~${methods.moneyFormat(price)}`,
                'CHAR_FLOYD'
            );
        }
    });
};

menuList.showAskBuyLicMenu = function(playerId, lic, licName, price) {

    UIMenu.Menu.Create(`Лицензия`, `~b~${licName}`);
    UIMenu.Menu.AddMenuItem(`~g~Купить лицензию за ${methods.moneyFormat(price)}`, "", {isAccept: true});
    UIMenu.Menu.AddMenuItem("~r~Отказаться", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.isAccept) {
            setTimeout(quest.fish, 5000);
            setTimeout(quest.business, 5000);
            mp.events.callRemote('server:user:buyLicensePlayer', playerId, lic, price);
        }
    });
};

menuList.showAskInviteMenu = function(playerId, desc) {

    UIMenu.Menu.Create(`Инвайт`, `~b~${desc}`);
    UIMenu.Menu.AddMenuItem(`~g~Согласиться`, "", {isAccept: true});
    UIMenu.Menu.AddMenuItem("~r~Отказаться", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.isAccept) {
            mp.events.callRemote('server:user:invite:accept', playerId);
        }
    });
};

menuList.showAskInvite2Menu = function(playerId, desc) {

    UIMenu.Menu.Create(`Инвайт`, `~b~${desc}`);
    UIMenu.Menu.AddMenuItem(`~g~Согласиться`, "", {isAccept: true});
    UIMenu.Menu.AddMenuItem("~r~Отказаться", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.isAccept) {
            mp.events.callRemote('server:user:invite2:accept', playerId);
        }
    });
};

menuList.showAskInvitefMenu = function(playerId, desc) {

    UIMenu.Menu.Create(`Инвайт`, `~b~${desc}`);
    UIMenu.Menu.AddMenuItem(`~g~Согласиться`, "", {isAccept: true});
    UIMenu.Menu.AddMenuItem("~r~Отказаться", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.isAccept) {
            mp.events.callRemote('server:user:invitef:accept', playerId);
        }
    });
};

menuList.showAskAnimMenu = function(playerId, desc, animId) {

    UIMenu.Menu.Create(`Анимация`, `~b~${desc}`);
    UIMenu.Menu.AddMenuItem(`~g~Согласиться`, "", {isAccept: true});
    UIMenu.Menu.AddMenuItem("~r~Отказаться", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.isAccept) {
            mp.events.callRemote('server:user:anim:accept', playerId, animId);
        }
    });
};

menuList.showGovGarderobMenu = function() {
    UIMenu.Menu.Create(`Гардероб`, `~b~Гардероб`);

    UIMenu.Menu.AddMenuItem("Сухпаёк", "", {itemId: 32});

    if (user.getCache('rank_type') === 5) {
        UIMenu.Menu.AddMenuItem("Наручники", "", {itemId: 40});
        UIMenu.Menu.AddMenuItem("Фонарик", "", {itemId: 59});
        UIMenu.Menu.AddMenuItem("Полицейская дубинка", "", {itemId: 66});
        UIMenu.Menu.AddMenuItem("Электрошокер", "", {itemId: 82});
        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Beretta 90Two", "", {itemId: 78});
        UIMenu.Menu.AddMenuItem("Фонарик Beretta 90Two", "", {itemId: 311});
        UIMenu.Menu.AddMenuItem("Оптический прицел Beretta 90Two", "", {itemId: 312});
        UIMenu.Menu.AddMenuItem("Глушитель Beretta 90Two", "", {itemId: 313});
        UIMenu.Menu.AddMenuItem("Компенсатор Beretta 90Two", "", {itemId: 314});
        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("SIG MPX-SD", "", {itemId: 97});
        UIMenu.Menu.AddMenuItem("Фонарик SIG MPX-SD", "", {itemId: 338});
        UIMenu.Menu.AddMenuItem("Рукоятка SIG MPX-SD", "", {itemId: 339});
        UIMenu.Menu.AddMenuItem("Прицел SIG MPX-SD", "", {itemId: 340});
        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm", "", {itemId: 280});
    }

    UIMenu.Menu.AddMenuItem("Бронежилет", "", {itemId: 252});

    let list = ["Default", "Галстук #1", "Галстук #2", "Рабочая", "Рабочая SASS (Летняя)", "Рабочая SASS (Зимняя)"];
    UIMenu.Menu.AddMenuItemList("Форма", list);

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnList.Add((item, index) => {
        if (index == 0) {
            user.giveUniform(0);
        }
        else if (index == 1) {
            user.giveUniform(36);
        }
        else if (index == 2) {
            user.giveUniform(37);
        }
        else if (index == 3) {
            user.giveUniform(60);
        }
        else if (index == 4) {
            user.giveUniform(61);
        }
        else if (index == 5) {
            user.giveUniform(62);
        }
    });

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.itemId) {
            if (items.isWeapon(item.itemId))
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "Правительство", "userName": "${user.getCache('name')}"}`, 'Выдано оружие').then();
            else
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "Правительство", "userName": "${user.getCache('name')}"}`, 'Выдан предмет').then();
        }
    });
};

menuList.showEmsGarderobMenu = function() {

    UIMenu.Menu.Create(`Гардероб`, `~b~Гардероб EMS`);

    let listGarderob = [
        "Повседневная одежда",
        "Форма парамедика #1",
        "Форма парамедика #2",
        "Зимняя форма парамедика #1",
        "Зимняя форма парамедика #2",
        "Форма спасателя #1",
        "Форма спасателя #2",
        "Форма врача #1",
        "Форма врача #2",
        "Форма врача #3",
        "Форма врача #4",
        "Форма врача #5",
        "Форма врача #6"
    ];

    for (let i = 0; i < listGarderob.length; i++) {
        try {
            UIMenu.Menu.AddMenuItem(`${listGarderob[i]}`);
        }
        catch (e) {
            methods.debug(e);
        }
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnIndexSelect.Add((index) => {
        if (index >= listGarderob.length)
            return;
        if (index === 0)
            user.giveUniform(index);
        else
            user.giveUniform(index + 23);
    });
};

menuList.showEmsArsenalMenu = function() {
    UIMenu.Menu.Create(`Арсенал`, `~b~Арсенал`);

    UIMenu.Menu.AddMenuItem("Сухпаёк", "", {itemId: 32});
    UIMenu.Menu.AddMenuItem("Антипохмелин", "", {itemId: 221});

    if (user.isLeader() || user.isSubLeader()) {
        UIMenu.Menu.AddMenuItem("Рецепт на большую аптечку", "Рецепт для крафта", {recHealB: true});
        UIMenu.Menu.AddMenuItem("Рецепт на малую аптечку", "Рецепт для крафта", {recHeal: true});
    }
    
    if (user.getCache('rank_type') !== 0 || user.isLeader() || user.isSubLeader() || user.isDepLeader() || user.isDepSubLeader()) {
        UIMenu.Menu.AddMenuItem("Большая Аптечка", "", {itemId: 278});
        UIMenu.Menu.AddMenuItem("Дефибриллятор", "", {itemId: 277});
        UIMenu.Menu.AddMenuItem("Полицейское огорождение", "", {itemId: 199});
        UIMenu.Menu.AddMenuItem("Полосатый конус", "", {itemId: 201});
        UIMenu.Menu.AddMenuItem("Красный конус", "", {itemId: 202});
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.itemId) {
            inventory.takeNewWeaponItem(item.itemId, `{"owner": "EMS", "userName": "${user.getCache('name')}"}`, 'Выдано оружие').then();
        }
        if (item.recHealB) {
            inventory.takeNewWeaponItem(474, `{"owner": "EMS", "userName": "${user.getCache('name')}", "id":0}`, 'Выдан рецепт').then();
        }
        if (item.recHeal) {
            inventory.takeNewWeaponItem(474, `{"owner": "EMS", "userName": "${user.getCache('name')}", "id":1}`, 'Выдан рецепт').then();
        }
    });
};

menuList.showEmsFreeMenu = function() {
    UIMenu.Menu.Create(`EMS`, `~b~Мед. панель`);
    UIMenu.Menu.AddMenuItem("Выписать человека", "", {doName: 'free'});
    UIMenu.Menu.AddMenuItem("Вылечить человека", "", {doName: 'heal'});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName === 'free') {
            let id = await UIMenu.Menu.GetUserInput("ID Игрока", "", 10);
            mp.events.callRemote('server:med:free', methods.parseInt(id));
        }
        if (item.doName === 'heal') {
            let id = await UIMenu.Menu.GetUserInput("ID Игрока", "", 10);
            mp.events.callRemote('server:med:heal', methods.parseInt(id));
        }
    });
};

menuList.showSheriffGarderobMenu = function() {

    UIMenu.Menu.Create(`Гардероб`, `~b~Гардероб SHERIFF`);

    let listGarderob = ["Повседневная одежда", "Кадетская форма", "Офицерская форма #1", "Офицерская форма #2", "Офицерская форма #3", "Офицерская форма #4", "Офицерская форма #5", "Офицерская форма #6", "Укрепленная форма", "Air Support Division", "Tactical Division", "Представительская форма"];

    for (let i = 0; i < listGarderob.length; i++) {
        try {
            UIMenu.Menu.AddMenuItem(`${listGarderob[i]}`);
        }
        catch (e) {
            methods.debug(e);
        }
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnIndexSelect.Add((index) => {
        if (index >= listGarderob.length)
            return;
        if (index === 0)
            user.giveUniform(index);
        else
            user.giveUniform(index + 12);
    });
};

menuList.showSheriffArsenalMenu = function() {
    UIMenu.Menu.Create(`Арсенал`, `~b~Арсенал`);

    UIMenu.Menu.AddMenuItem("Сухпаёк", "", {itemId: 32});

    if (user.getCache('rank_type') !== 0 || user.isLeader() || user.isSubLeader() || user.isDepLeader() || user.isSubLeader()) {
        UIMenu.Menu.AddMenuItem("Большая Аптечка", "", {itemId: 278});
        UIMenu.Menu.AddMenuItem("Полицейское огорождение", "", {itemId: 199});
        UIMenu.Menu.AddMenuItem("Полосатый конус", "", {itemId: 201});
        UIMenu.Menu.AddMenuItem("Красный конус", "", {itemId: 202});

        UIMenu.Menu.AddMenuItem("~b~Починка оружия", "", {gunFix: true});
    }

    UIMenu.Menu.AddMenuItem("~b~Сдача конфиската", "", {sellItems: true});
    UIMenu.Menu.AddMenuItem("~b~Сдать грязные деньги", "", {getMoneyPolice: true});
    UIMenu.Menu.AddMenuItem("~b~Оружие", "", {showGun: true});
    UIMenu.Menu.AddMenuItem("~b~Модули на оружие", "", {showGunMod: true});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();

        if (item.showGun) {
            menuList.showSheriffArsenalGunMenu();
        }
        if (item.showGunMod) {
            menuList.showSheriffArsenalGunModMenu();
        }
        if (item.sellItems) {
            inventory.getItemListSell();
        }
        if (item.getMoneyPolice) {
            mp.events.callRemote('server:sellMoneyPolice');
        }
        if (item.gunFix) {
            mp.events.callRemote('server:inventory:fixItemFreeMenu');
        }
        if (item.itemId) {
            if (items.isWeapon(item.itemId))
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "BCSD", "userName": "${user.getCache('name')}", "tint": 4}`, 'Выдано оружие').then();
            else
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "BCSD", "userName": "${user.getCache('name')}"}`, 'Выдан предмет').then();
        }
    });
};

menuList.showSheriffArsenalGunMenu = function() {
    UIMenu.Menu.Create(`Арсенал`, `~b~Оружие`);

    UIMenu.Menu.AddMenuItem("Наручники", "", {itemId: 40});
    UIMenu.Menu.AddMenuItem("Фонарик", "", {itemId: 59});
    UIMenu.Menu.AddMenuItem("Полицейская дубинка", "", {itemId: 66});
    UIMenu.Menu.AddMenuItem("Электрошокер", "", {itemId: 82});

    if (user.getCache('rank_type') === 0) {
        UIMenu.Menu.AddMenuItem("Beretta 90Two", "", {itemId: 78});
        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm", "", {itemId: 280});
    }
    if (user.getCache('rank_type') === 1 || user.getCache('rank_type') === 2 || user.getCache('rank_type') === 3 || user.getCache('rank_type') === 4) {
        UIMenu.Menu.AddMenuItem("Beretta 90Two", "", {itemId: 78});
        UIMenu.Menu.AddMenuItem("Glock 17", "", {itemId: 146});
        UIMenu.Menu.AddMenuItem("Benelli M3", "", {itemId: 90});
        UIMenu.Menu.AddMenuItem("Benelli M4", "", {itemId: 91});
        UIMenu.Menu.AddMenuItem("HK-416", "", {itemId: 110});

        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm", "", {itemId: 280});
        UIMenu.Menu.AddMenuItem("Коробка патронов 12 калибра", "", {itemId: 281});
        UIMenu.Menu.AddMenuItem("Коробка патронов 5.56mm", "", {itemId: 284});
    }
    if (user.getCache('rank_type') === 5) {
        UIMenu.Menu.AddMenuItem("Beretta 90Two", "", {itemId: 78});
        UIMenu.Menu.AddMenuItem("Glock 17", "", {itemId: 146});
        UIMenu.Menu.AddMenuItem("MP5A3", "", {itemId: 103});

        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm", "", {itemId: 280});
    }
    if (user.getCache('rank_type') === 6 || user.isLeader() || user.isSubLeader() || user.isDepLeader() || user.isDepSubLeader()) {
        UIMenu.Menu.AddMenuItem("Beretta 90Two", "", {itemId: 78});
        UIMenu.Menu.AddMenuItem("Glock 17", "", {itemId: 146});
        UIMenu.Menu.AddMenuItem("Benelli M3", "", {itemId: 90});
        UIMenu.Menu.AddMenuItem("Benelli M4", "", {itemId: 91});
        UIMenu.Menu.AddMenuItem("HK-416", "", {itemId: 110});
        UIMenu.Menu.AddMenuItem("HK-416A5", "", {itemId: 111});

        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm", "", {itemId: 280});
        UIMenu.Menu.AddMenuItem("Коробка патронов 12 калибра", "", {itemId: 281});
        UIMenu.Menu.AddMenuItem("Коробка патронов 5.56mm", "", {itemId: 284});
    }

    if (user.isLeader()) {
        UIMenu.Menu.AddMenuItem("L115", "", {itemId: 119});
        UIMenu.Menu.AddMenuItem("Коробка патронов 7.62mm", "", {itemId: 282});
    }

    UIMenu.Menu.AddMenuItem("Бронежилет", "", {itemId: 252});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.itemId) {
            if (items.isWeapon(item.itemId))
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "BCSD", "userName": "${user.getCache('name')}", "tint": 4}`, 'Выдано оружие').then();
            else
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "BCSD", "userName": "${user.getCache('name')}"}`, 'Выдан предмет').then();
        }
    });
};

menuList.showSheriffArsenalGunModMenu = function() {
    UIMenu.Menu.Create(`Арсенал`, `~b~Модули на оружие`);

    if (user.getCache('rank_type') === 1 || user.getCache('rank_type') === 2 || user.getCache('rank_type') === 3 || user.getCache('rank_type') === 4) {
        UIMenu.Menu.AddMenuItem("Фонарик Beretta 90Two", "", {itemId: 311});
        UIMenu.Menu.AddMenuItem("Оптический прицел Beretta 90Two", "", {itemId: 312});
        UIMenu.Menu.AddMenuItem("Глушитель Beretta 90Two", "", {itemId: 313});
        UIMenu.Menu.AddMenuItem("Компенсатор Beretta 90Two", "", {itemId: 314});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Глушитель Glock 17", "", {itemId: 316});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M3", "", {itemId: 341});
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M3", "", {itemId: 342});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Голографический прицел Benelli M4", "", {itemId: 349});
        UIMenu.Menu.AddMenuItem("Прицел малой кратности Benelli M4", "", {itemId: 350});
        UIMenu.Menu.AddMenuItem("Прицел средней кратности Benelli M4", "", {itemId: 351});
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M4", "", {itemId: 352});
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M4", "", {itemId: 353});
        UIMenu.Menu.AddMenuItem("Дульный тормоз Benelli M4", "", {itemId: 354});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик HK-416", "", {itemId: 362});
        UIMenu.Menu.AddMenuItem("Рукоятка HK-416", "", {itemId: 363});
        UIMenu.Menu.AddMenuItem("Глушитель HK-416", "", {itemId: 364});
        UIMenu.Menu.AddMenuItem("Прицел HK-416", "", {itemId: 365});
    }
    else if (user.getCache('rank_type') === 5) {
        UIMenu.Menu.AddMenuItem("Фонарик Beretta 90Two", "", {itemId: 311});
        UIMenu.Menu.AddMenuItem("Оптический прицел Beretta 90Two", "", {itemId: 312});
        UIMenu.Menu.AddMenuItem("Глушитель Beretta 90Two", "", {itemId: 313});
        UIMenu.Menu.AddMenuItem("Компенсатор Beretta 90Two", "", {itemId: 314});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Глушитель Glock 17", "", {itemId: 316});
    }
    else if (user.getCache('rank_type') === 6 || user.isLeader() || user.isSubLeader() || user.isDepLeader() || user.isDepSubLeader()) {
        UIMenu.Menu.AddMenuItem("Фонарик Beretta 90Two", "", {itemId: 311});
        UIMenu.Menu.AddMenuItem("Оптический прицел Beretta 90Two", "", {itemId: 312});
        UIMenu.Menu.AddMenuItem("Глушитель Beretta 90Two", "", {itemId: 313});
        UIMenu.Menu.AddMenuItem("Компенсатор Beretta 90Two", "", {itemId: 314});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Глушитель Glock 17", "", {itemId: 316});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M3", "", {itemId: 341});
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M3", "", {itemId: 342});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Голографический прицел Benelli M4", "", {itemId: 349});
        UIMenu.Menu.AddMenuItem("Прицел малой кратности Benelli M4", "", {itemId: 350});
        UIMenu.Menu.AddMenuItem("Прицел средней кратности Benelli M4", "", {itemId: 351});
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M4", "", {itemId: 352});
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M4", "", {itemId: 353});
        UIMenu.Menu.AddMenuItem("Дульный тормоз Benelli M4", "", {itemId: 354});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик HK-416", "", {itemId: 362});
        UIMenu.Menu.AddMenuItem("Рукоятка HK-416", "", {itemId: 363});
        UIMenu.Menu.AddMenuItem("Глушитель HK-416", "", {itemId: 364});
        UIMenu.Menu.AddMenuItem("Прицел HK-416", "", {itemId: 365});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик HK-416A5", "", {itemId: 416});
        UIMenu.Menu.AddMenuItem("Голографический прицел HK-416A5", "", {itemId: 417});
        UIMenu.Menu.AddMenuItem("Прицел малой кратности HK-416A5", "", {itemId: 418});
        UIMenu.Menu.AddMenuItem("Прицел большой кратности HK-416A5", "", {itemId: 419});
        UIMenu.Menu.AddMenuItem("Глушитель HK-416A5", "", {itemId: 420});
        UIMenu.Menu.AddMenuItem("Тактический дульный тормоз HK-416A5", "", {itemId: 422});
        UIMenu.Menu.AddMenuItem("Рукоятка HK-416A5", "", {itemId: 428});
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.itemId) {
            if (items.isWeapon(item.itemId))
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "BCSD", "userName": "${user.getCache('name')}", "tint": 4}`, 'Выдано оружие').then();
            else
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "BCSD", "userName": "${user.getCache('name')}"}`, 'Выдан предмет').then();
        }
    });
};

menuList.showSapdGarderobMenu = function() {

    UIMenu.Menu.Create(`Гардероб`, `~b~Гардероб LSPD`);

    let listGarderob = [
        "Повседневная одежда",
        "Кадетская форма",
        "Офицерская форма",
        "Офицерская укрепленная форма",
        "Tactical Division Black",
        "Tactical Division Red",
        "Tactical Division Classic",
        "Tactical Division Classic Night",
        "Tactical Division Standard",
        "Альтернативная форма",
        "Детективная форма",
        "Air Support Division",
        "Представительская форма"
    ];

    for (let i = 0; i < listGarderob.length; i++) {
        try {
            UIMenu.Menu.AddMenuItem(`${listGarderob[i]}`);
        }
        catch (e) {
            methods.debug(e);
        }
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnIndexSelect.Add((index) => {
        if (index >= listGarderob.length)
            return;
        user.giveUniform(index);
    });
};

menuList.showUsmcGarderobMenu = function() {

    UIMenu.Menu.Create(`Гардероб`, `~b~Гардероб USMC`);

    let listGarderob = [
        "Повседневная одежда",
        "Регулярная форма #1",
        "Регулярная форма #2",
        "Регулярная форма #3",
        "Special Forces #1",
        "Special Forces #2",
        "Air Support Division #1",
        "Air Support Division #2",
        "Представительская форма"
    ];

    for (let i = 0; i < listGarderob.length; i++) {
        try {
            UIMenu.Menu.AddMenuItem(`${listGarderob[i]}`);
        }
        catch (e) {
            methods.debug(e);
        }
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnIndexSelect.Add((index) => {
        if (index >= listGarderob.length)
            return;
        if (index === 0)
            user.giveUniform(index);
        else
            user.giveUniform(index + 37);
    });
};

menuList.showSapdArrestMenu = function() {

    UIMenu.Menu.Create(`PC`, `~b~Арест`);
    UIMenu.Menu.AddMenuItem("Арест", "", {eventName: "server:user:arrest"});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.eventName) {
            let id = await UIMenu.Menu.GetUserInput("ID Игрока", "", 10);
            mp.events.callRemote(item.eventName, methods.parseInt(id));
        }
    });
};

menuList.showSapdClearMenu = function() {
    if (!user.isLeader() && !user.isSubLeader()) {
        if (user.getCache('rank') > 1 && user.getCache('rank_type') === 0) {
            mp.game.ui.notifications.show("~r~Не доступно для кадетов");
            return;
        }
    }

    UIMenu.Menu.Create(`PC`, `~b~Меню`);
    if (!user.isGov())
    {
        UIMenu.Menu.AddMenuItem("Выдать розыск", "", {eventName: "server:user:giveWanted"});
        UIMenu.Menu.AddMenuItem("Очистить розыск", "", {eventName: "server:user:giveWantedClear"});
        UIMenu.Menu.AddMenuItem(`~y~Выписка штрафа`, '', {giveTicket: true});
        UIMenu.Menu.AddMenuItem(`~y~Отменить штраф`, '', {takeTicket: true});
    }
    else if (user.isGov() && (user.isLeader() || user.isSubLeader() || user.isDepLeader() || user.isDepSubLeader())) {
        UIMenu.Menu.AddMenuItem(`~y~Выписка штрафа`, '', {giveTicket: true});
        UIMenu.Menu.AddMenuItem(`~y~Отменить штраф`, '', {takeTicket: true});
    }
    else {
        UIMenu.Menu.AddMenuItem(`~y~Нет доступа`, '', {});
    }
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.eventName == 'server:user:giveWantedClear') {
            let id = await UIMenu.Menu.GetUserInput("Card ID", "", 10);
            mp.events.callRemote('server:user:giveWanted', methods.parseInt(id), 0, 'clear');
        }
        else if (item.eventName == 'server:user:giveWanted') {
            let id = await UIMenu.Menu.GetUserInput("Card ID", "", 10);
            let count = await UIMenu.Menu.GetUserInput("Уровень", "", 10);
            let reason = await UIMenu.Menu.GetUserInput("Причина", "", 10);
            mp.events.callRemote('server:user:giveWanted', methods.parseInt(id), count, reason);
        }
        else if (item.giveTicket)
        {
            let id = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите Card ID", "", 10));
            if (id < 0) {
                mp.game.ui.notifications.show('~r~ID не может быть меньше 0');
                return;
            }
            let price = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите сумму штрафа", "", 10));
            if (price < 0) {
                mp.game.ui.notifications.show('~r~Не может быть меньше 0');
                return;
            }
            if (price > 50000) {
                mp.game.ui.notifications.show('~r~Не может быть больше 50000');
                return;
            }
            let desc = await UIMenu.Menu.GetUserInput("Введите причину", "", 50);
            if (desc === '') {
                mp.game.ui.notifications.show('~r~Не может быть пустым');
                return;
            }
            mp.events.callRemote('server:user:giveTicket', id, price, desc);
        }
        else if (item.takeTicket)
        {
            let id = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите номер штрафа", "", 10));
            if (id < 0) {
                mp.game.ui.notifications.show('~r~ID не может быть меньше 0');
                return;
            }
            let desc = await UIMenu.Menu.GetUserInput("Введите причину", "", 50);
            if (desc === '') {
                mp.game.ui.notifications.show('~r~Не может быть пустым');
                return;
            }
            mp.events.callRemote('server:user:takeTicket', id, desc);
        }
    });
};

menuList.showSapdArsenalMenu = function() {
    UIMenu.Menu.Create(`Арсенал`, `~b~Арсенал`);

    UIMenu.Menu.AddMenuItem("Сухпаёк", "", {itemId: 32});
    if (user.getCache('rank_type') !== 0 || user.isLeader() || user.isSubLeader() || user.isDepLeader() || user.isSubLeader()) {
        UIMenu.Menu.AddMenuItem("Большая Аптечка", "", {itemId: 278});
        UIMenu.Menu.AddMenuItem("Полицейское огорождение", "", {itemId: 199});
        UIMenu.Menu.AddMenuItem("Полосатый конус", "", {itemId: 201});
        UIMenu.Menu.AddMenuItem("Красный конус", "", {itemId: 202});
        UIMenu.Menu.AddMenuItem("~b~Починка оружия", "", {gunFix: true});
    }

    UIMenu.Menu.AddMenuItem("~b~Сдача конфиската", "", {sellItems: true});
    UIMenu.Menu.AddMenuItem("~b~Сдать грязные деньги", "", {getMoneyPolice: true});
    UIMenu.Menu.AddMenuItem("~b~Оружие", "", {showGun: true});
    UIMenu.Menu.AddMenuItem("~b~Модули на оружие", "", {showGunMod: true});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.showGun) {
            menuList.showSapdArsenalGunMenu();
        }
        if (item.showGunMod) {
            menuList.showSapdArsenalGunModMenu();
        }
        if (item.gunFix) {
            mp.events.callRemote('server:inventory:fixItemFreeMenu');
        }
        if (item.sellItems) {
            inventory.getItemListSell();
        }
        if (item.getMoneyPolice) {
            mp.events.callRemote('server:sellMoneyPolice');
        }
        if (item.itemId) {
            if (items.isWeapon(item.itemId))
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "LSPD", "userName": "${user.getCache('name')}", "tint": 5}`, 'Выдано оружие').then();
            else
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "LSPD", "userName": "${user.getCache('name')}"}`, 'Выдан предмет').then();
        }
    });
};

menuList.showSapdArsenalGunMenu = function() {
    UIMenu.Menu.Create(`Арсенал`, `~b~Оружие`);

    UIMenu.Menu.AddMenuItem("Наручники", "", {itemId: 40});
    UIMenu.Menu.AddMenuItem("Фонарик", "", {itemId: 59});
    UIMenu.Menu.AddMenuItem("Полицейская дубинка", "", {itemId: 66});
    UIMenu.Menu.AddMenuItem("Электрошокер", "", {itemId: 82});

    if (user.getCache('rank_type') === 0) {
        UIMenu.Menu.AddMenuItem("Beretta 90Two", "", {itemId: 78});
        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm", "", {itemId: 280});
    }

    if (user.getCache('rank_type') === 1 || user.getCache('rank_type') === 6 || user.getCache('rank_type') === 10 || user.getCache('rank_type') === 7 || user.getCache('rank_type') === 2) {
        UIMenu.Menu.AddMenuItem("Beretta 90Two", "", {itemId: 78});
        UIMenu.Menu.AddMenuItem("Glock 17", "", {itemId: 146});
        UIMenu.Menu.AddMenuItem("Benelli M3", "", {itemId: 90});
        UIMenu.Menu.AddMenuItem("Benelli M4", "", {itemId: 91});
        UIMenu.Menu.AddMenuItem("HK-416", "", {itemId: 110});

        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm", "", {itemId: 280});
        UIMenu.Menu.AddMenuItem("Коробка патронов 12 калибра", "", {itemId: 281});
        UIMenu.Menu.AddMenuItem("Коробка патронов 5.56mm", "", {itemId: 284});
    }
    if (user.getCache('rank_type') === 3 || user.getCache('rank_type') === 5 || user.getCache('rank_type') === 8) {
        UIMenu.Menu.AddMenuItem("Beretta 90Two", "", {itemId: 78});
        UIMenu.Menu.AddMenuItem("Glock 17", "", {itemId: 146});
        UIMenu.Menu.AddMenuItem("MP5A3", "", {itemId: 103});

        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm", "", {itemId: 280});
    }
    if (user.getCache('rank_type') === 4 || user.getCache('rank_type') === 9 || user.isLeader() || user.isSubLeader() || user.isDepLeader() || user.isDepSubLeader()) {
        UIMenu.Menu.AddMenuItem("Beretta 90Two", "", {itemId: 78});
        UIMenu.Menu.AddMenuItem("Glock 17", "", {itemId: 146});
        UIMenu.Menu.AddMenuItem("Benelli M3", "", {itemId: 90});
        UIMenu.Menu.AddMenuItem("Benelli M4", "", {itemId: 91});
        UIMenu.Menu.AddMenuItem("HK-416", "", {itemId: 110});
        UIMenu.Menu.AddMenuItem("HK-416A5", "", {itemId: 111});

        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm", "", {itemId: 280});
        UIMenu.Menu.AddMenuItem("Коробка патронов 12 калибра", "", {itemId: 281});
        UIMenu.Menu.AddMenuItem("Коробка патронов 5.56mm", "", {itemId: 284});
    }

    if (user.isLeader()) {
        UIMenu.Menu.AddMenuItem("L115", "", {itemId: 119});
        UIMenu.Menu.AddMenuItem("Коробка патронов 7.62mm", "", {itemId: 282});
    }

    UIMenu.Menu.AddMenuItem("Бронежилет", "", {itemId: 252});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.itemId) {
            if (items.isWeapon(item.itemId))
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "LSPD", "userName": "${user.getCache('name')}", "tint": 5}`, 'Выдано оружие').then();
            else
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "LSPD", "userName": "${user.getCache('name')}"}`, 'Выдан предмет').then();
        }
    });
};

menuList.showSapdArsenalGunModMenu = function() {
    UIMenu.Menu.Create(`Арсенал`, `~b~Модули на оружие`);

    if (user.getCache('rank_type') === 1 || user.getCache('rank_type') === 6 || user.getCache('rank_type') === 10 || user.getCache('rank_type') === 7 || user.getCache('rank_type') === 2) {
        UIMenu.Menu.AddMenuItem("Фонарик Beretta 90Two", "", {itemId: 311});
        UIMenu.Menu.AddMenuItem("Оптический прицел Beretta 90Two", "", {itemId: 312});
        UIMenu.Menu.AddMenuItem("Глушитель Beretta 90Two", "", {itemId: 313});
        UIMenu.Menu.AddMenuItem("Компенсатор Beretta 90Two", "", {itemId: 314});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Глушитель Glock 17", "", {itemId: 316});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M3", "", {itemId: 341});
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M3", "", {itemId: 342});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Голографический прицел Benelli M4", "", {itemId: 349});
        UIMenu.Menu.AddMenuItem("Прицел малой кратности Benelli M4", "", {itemId: 350});
        UIMenu.Menu.AddMenuItem("Прицел средней кратности Benelli M4", "", {itemId: 351});
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M4", "", {itemId: 352});
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M4", "", {itemId: 353});
        UIMenu.Menu.AddMenuItem("Дульный тормоз Benelli M4", "", {itemId: 354});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик HK-416", "", {itemId: 362});
        UIMenu.Menu.AddMenuItem("Рукоятка HK-416", "", {itemId: 363});
        UIMenu.Menu.AddMenuItem("Глушитель HK-416", "", {itemId: 364});
        UIMenu.Menu.AddMenuItem("Прицел HK-416", "", {itemId: 365});
    }
    else if (user.getCache('rank_type') === 3 || user.getCache('rank_type') === 5 || user.getCache('rank_type') === 8) {
        UIMenu.Menu.AddMenuItem("Фонарик Beretta 90Two", "", {itemId: 311});
        UIMenu.Menu.AddMenuItem("Оптический прицел Beretta 90Two", "", {itemId: 312});
        UIMenu.Menu.AddMenuItem("Глушитель Beretta 90Two", "", {itemId: 313});
        UIMenu.Menu.AddMenuItem("Компенсатор Beretta 90Two", "", {itemId: 314});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Глушитель Glock 17", "", {itemId: 316});
    }
    else if (user.getCache('rank_type') === 4 || user.getCache('rank_type') === 9 || user.isLeader() || user.isSubLeader() || user.isDepLeader() || user.isDepSubLeader()) {
        UIMenu.Menu.AddMenuItem("Фонарик Beretta 90Two", "", {itemId: 311});
        UIMenu.Menu.AddMenuItem("Оптический прицел Beretta 90Two", "", {itemId: 312});
        UIMenu.Menu.AddMenuItem("Глушитель Beretta 90Two", "", {itemId: 313});
        UIMenu.Menu.AddMenuItem("Компенсатор Beretta 90Two", "", {itemId: 314});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Глушитель Glock 17", "", {itemId: 316});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M3", "", {itemId: 341});
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M3", "", {itemId: 342});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Голографический прицел Benelli M4", "", {itemId: 349});
        UIMenu.Menu.AddMenuItem("Прицел малой кратности Benelli M4", "", {itemId: 350});
        UIMenu.Menu.AddMenuItem("Прицел средней кратности Benelli M4", "", {itemId: 351});
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M4", "", {itemId: 352});
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M4", "", {itemId: 353});
        UIMenu.Menu.AddMenuItem("Дульный тормоз Benelli M4", "", {itemId: 354});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик HK-416", "", {itemId: 362});
        UIMenu.Menu.AddMenuItem("Рукоятка HK-416", "", {itemId: 363});
        UIMenu.Menu.AddMenuItem("Глушитель HK-416", "", {itemId: 364});
        UIMenu.Menu.AddMenuItem("Прицел HK-416", "", {itemId: 365});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик HK-416A5", "", {itemId: 416});
        UIMenu.Menu.AddMenuItem("Голографический прицел HK-416A5", "", {itemId: 417});
        UIMenu.Menu.AddMenuItem("Прицел малой кратности HK-416A5", "", {itemId: 418});
        UIMenu.Menu.AddMenuItem("Прицел большой кратности HK-416A5", "", {itemId: 419});
        UIMenu.Menu.AddMenuItem("Глушитель HK-416A5", "", {itemId: 420});
        UIMenu.Menu.AddMenuItem("Тактический дульный тормоз HK-416A5", "", {itemId: 422});
        UIMenu.Menu.AddMenuItem("Рукоятка HK-416A5", "", {itemId: 428});
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.itemId) {
            if (items.isWeapon(item.itemId))
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "LSPD", "userName": "${user.getCache('name')}", "tint": 5}`, 'Выдано оружие').then();
            else
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "LSPD", "userName": "${user.getCache('name')}"}`, 'Выдан предмет').then();
        }
    });
};

menuList.showUsmcArsenalMenu = function() {
    UIMenu.Menu.Create(`Арсенал`, `~b~Арсенал`);

    UIMenu.Menu.AddMenuItem("Сухпаёк", "", {itemId: 32});
    if (user.getCache('rank_type') !== 0 || user.isLeader() || user.isSubLeader() || user.isDepLeader() || user.isSubLeader()) {
        UIMenu.Menu.AddMenuItem("Большая Аптечка", "", {itemId: 278});
        UIMenu.Menu.AddMenuItem("Полицейское огорождение", "", {itemId: 199});
        UIMenu.Menu.AddMenuItem("Полосатый конус", "", {itemId: 201});
        UIMenu.Menu.AddMenuItem("Красный конус", "", {itemId: 202});
        UIMenu.Menu.AddMenuItem("~b~Починка оружия", "", {gunFix: true});
    }

    UIMenu.Menu.AddMenuItem("~b~Сдача конфиската", "", {sellItems: true});
    UIMenu.Menu.AddMenuItem("~b~Оружие", "", {showGun: true});
    UIMenu.Menu.AddMenuItem("~b~Модули на оружие", "", {showGunMod: true});
    UIMenu.Menu.AddMenuItem("~b~Гардероб", "", {showGarderob: true});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.showGarderob) {
            menuList.showUsmcGarderobMenu();
        }
        if (item.showGun) {
            menuList.showUsmcArsenalGunMenu();
        }
        if (item.gunFix) {
            mp.events.callRemote('server:inventory:fixItemFreeMenu');
        }
        if (item.sellItems) {
            inventory.getItemListSell();
        }
        if (item.showGunMod) {
            menuList.showUsmcArsenalGunModMenu();
        }
        if (item.itemId) {
            if (items.isWeapon(item.itemId))
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "USMC", "userName": "${user.getCache('name')}", "tint": 4}`, 'Выдано оружие').then();
            else
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "USMC", "userName": "${user.getCache('name')}"}`, 'Выдан предмет').then();
        }
    });
};

menuList.showUsmcArsenalGunMenu = function() {
    UIMenu.Menu.Create(`Арсенал`, `~b~Оружие`);

    UIMenu.Menu.AddMenuItem("Наручники", "", {itemId: 40});
    UIMenu.Menu.AddMenuItem("Фонарик", "", {itemId: 59});
    UIMenu.Menu.AddMenuItem("Полицейская дубинка", "", {itemId: 66});
    UIMenu.Menu.AddMenuItem("Электрошокер", "", {itemId: 82});

    if (user.getCache('rank_type') === 0) {
        UIMenu.Menu.AddMenuItem("Beretta 90Two", "", {itemId: 78});
        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm", "", {itemId: 280});
    }

    if (user.getCache('rank_type') === 1 || user.getCache('rank_type') === 2) {
        UIMenu.Menu.AddMenuItem("Beretta 90Two", "", {itemId: 78});
        UIMenu.Menu.AddMenuItem("Glock 17", "", {itemId: 146});
        UIMenu.Menu.AddMenuItem("Benelli M3", "", {itemId: 90});
        UIMenu.Menu.AddMenuItem("Benelli M4", "", {itemId: 91});
        UIMenu.Menu.AddMenuItem("HK-416", "", {itemId: 110});

        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm", "", {itemId: 280});
        UIMenu.Menu.AddMenuItem("Коробка патронов 12 калибра", "", {itemId: 281});
        UIMenu.Menu.AddMenuItem("Коробка патронов 5.56mm", "", {itemId: 284});
    }
    if (user.getCache('rank_type') === 3) {
        UIMenu.Menu.AddMenuItem("Beretta 90Two", "", {itemId: 78});
        UIMenu.Menu.AddMenuItem("Glock 17", "", {itemId: 146});
        UIMenu.Menu.AddMenuItem("MP5A3", "", {itemId: 103});

        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm", "", {itemId: 280});
    }
    if (user.getCache('rank_type') === 4 || user.isLeader() || user.isSubLeader() || user.isDepLeader() || user.isDepSubLeader()) {
        UIMenu.Menu.AddMenuItem("Beretta 90Two", "", {itemId: 78});
        UIMenu.Menu.AddMenuItem("Glock 17", "", {itemId: 146});
        //UIMenu.Menu.AddMenuItem("Raging Bull", "", {itemId: 74});
        UIMenu.Menu.AddMenuItem("Benelli M3", "", {itemId: 90});
        UIMenu.Menu.AddMenuItem("Benelli M4", "", {itemId: 91});
        UIMenu.Menu.AddMenuItem("HK-416", "", {itemId: 110});
        UIMenu.Menu.AddMenuItem("HK-416A5", "", {itemId: 111});

        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm", "", {itemId: 280});
        UIMenu.Menu.AddMenuItem("Коробка патронов 12 калибра", "", {itemId: 281});
        UIMenu.Menu.AddMenuItem("Коробка патронов 5.56mm", "", {itemId: 284});
        //UIMenu.Menu.AddMenuItem("Коробка патронов .44 Magnum", "", {itemId: 287});
    }

    UIMenu.Menu.AddMenuItem("Бронежилет", "", {itemId: 252});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.itemId) {
            if (items.isWeapon(item.itemId))
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "USMC", "userName": "${user.getCache('name')}", "tint": 4}`, 'Выдано оружие').then();
            else
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "USMC", "userName": "${user.getCache('name')}"}`, 'Выдан предмет').then();
        }
    });
};

menuList.showUsmcArsenalGunModMenu = function() {
    UIMenu.Menu.Create(`Арсенал`, `~b~Модули на оружие`);

    if (user.getCache('rank_type') === 1 || user.getCache('rank_type') === 2) {
        UIMenu.Menu.AddMenuItem("Фонарик Beretta 90Two", "", {itemId: 311});
        UIMenu.Menu.AddMenuItem("Оптический прицел Beretta 90Two", "", {itemId: 312});
        UIMenu.Menu.AddMenuItem("Глушитель Beretta 90Two", "", {itemId: 313});
        UIMenu.Menu.AddMenuItem("Компенсатор Beretta 90Two", "", {itemId: 314});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Глушитель Glock 17", "", {itemId: 316});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M3", "", {itemId: 341});
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M3", "", {itemId: 342});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Голографический прицел Benelli M4", "", {itemId: 349});
        UIMenu.Menu.AddMenuItem("Прицел малой кратности Benelli M4", "", {itemId: 350});
        UIMenu.Menu.AddMenuItem("Прицел средней кратности Benelli M4", "", {itemId: 351});
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M4", "", {itemId: 352});
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M4", "", {itemId: 353});
        UIMenu.Menu.AddMenuItem("Дульный тормоз Benelli M4", "", {itemId: 354});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик HK-416", "", {itemId: 362});
        UIMenu.Menu.AddMenuItem("Рукоятка HK-416", "", {itemId: 363});
        UIMenu.Menu.AddMenuItem("Глушитель HK-416", "", {itemId: 364});
        UIMenu.Menu.AddMenuItem("Прицел HK-416", "", {itemId: 365});
    }
    else if (user.getCache('rank_type') === 3) {
        UIMenu.Menu.AddMenuItem("Фонарик Beretta 90Two", "", {itemId: 311});
        UIMenu.Menu.AddMenuItem("Оптический прицел Beretta 90Two", "", {itemId: 312});
        UIMenu.Menu.AddMenuItem("Глушитель Beretta 90Two", "", {itemId: 313});
        UIMenu.Menu.AddMenuItem("Компенсатор Beretta 90Two", "", {itemId: 314});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Глушитель Glock 17", "", {itemId: 316});
    }
    else if (user.getCache('rank_type') === 4 || user.isLeader() || user.isSubLeader() || user.isDepLeader() || user.isDepSubLeader()) {
        UIMenu.Menu.AddMenuItem("Фонарик Beretta 90Two", "", {itemId: 311});
        UIMenu.Menu.AddMenuItem("Оптический прицел Beretta 90Two", "", {itemId: 312});
        UIMenu.Menu.AddMenuItem("Глушитель Beretta 90Two", "", {itemId: 313});
        UIMenu.Menu.AddMenuItem("Компенсатор Beretta 90Two", "", {itemId: 314});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Глушитель Glock 17", "", {itemId: 316});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M3", "", {itemId: 341});
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M3", "", {itemId: 342});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Голографический прицел Benelli M4", "", {itemId: 349});
        UIMenu.Menu.AddMenuItem("Прицел малой кратности Benelli M4", "", {itemId: 350});
        UIMenu.Menu.AddMenuItem("Прицел средней кратности Benelli M4", "", {itemId: 351});
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M4", "", {itemId: 352});
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M4", "", {itemId: 353});
        UIMenu.Menu.AddMenuItem("Дульный тормоз Benelli M4", "", {itemId: 354});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик HK-416", "", {itemId: 362});
        UIMenu.Menu.AddMenuItem("Рукоятка HK-416", "", {itemId: 363});
        UIMenu.Menu.AddMenuItem("Глушитель HK-416", "", {itemId: 364});
        UIMenu.Menu.AddMenuItem("Прицел HK-416", "", {itemId: 365});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик HK-416A5", "", {itemId: 416});
        UIMenu.Menu.AddMenuItem("Голографический прицел HK-416A5", "", {itemId: 417});
        UIMenu.Menu.AddMenuItem("Прицел малой кратности HK-416A5", "", {itemId: 418});
        UIMenu.Menu.AddMenuItem("Прицел большой кратности HK-416A5", "", {itemId: 419});
        UIMenu.Menu.AddMenuItem("Глушитель HK-416A5", "", {itemId: 420});
        UIMenu.Menu.AddMenuItem("Тактический дульный тормоз HK-416A5", "", {itemId: 422});
        UIMenu.Menu.AddMenuItem("Рукоятка HK-416A5", "", {itemId: 428});
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.itemId) {
            if (items.isWeapon(item.itemId))
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "USMC", "userName": "${user.getCache('name')}", "tint": 4}`, 'Выдано оружие').then();
            else
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "USMC", "userName": "${user.getCache('name')}"}`, 'Выдан предмет').then();
        }
    });
};

menuList.showFibArsenalMenu = function() {
    UIMenu.Menu.Create(`Арсенал`, `~b~Арсенал`);

    UIMenu.Menu.AddMenuItem("Сухпаёк", "", {itemId: 32});
    if (user.getCache('rank_type') !== 0 || user.isLeader() || user.isSubLeader() || user.isDepLeader() || user.isSubLeader()) {
        UIMenu.Menu.AddMenuItem("Большая Аптечка", "", {itemId: 278});
        UIMenu.Menu.AddMenuItem("Полицейское огорождение", "", {itemId: 199});
        UIMenu.Menu.AddMenuItem("Полосатый конус", "", {itemId: 201});
        UIMenu.Menu.AddMenuItem("Красный конус", "", {itemId: 202});
        UIMenu.Menu.AddMenuItem("~b~Починка оружия", "", {gunFix: true});
    }

    UIMenu.Menu.AddMenuItem("~b~Сдача конфиската", "", {sellItems: true});
    UIMenu.Menu.AddMenuItem("~b~Оружие", "", {showGun: true});
    UIMenu.Menu.AddMenuItem("~b~Модули на оружие", "", {showGunMod: true});

    let list = ["Стандарт", "Бейджик", "Оперативная", "Тактическая"];
    UIMenu.Menu.AddMenuItemList("Форма", list);

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnList.Add((item, index) => {
        if (index == 0) {
            user.giveUniform(0);
        }
        else if (index == 1) {
            user.giveUniform(47);
        }
        else if (index == 2) {
            user.giveUniform(48);
        }
        else if (index == 3) {
            user.giveUniform(49);
        }
    });

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.gunFix) {
            mp.events.callRemote('server:inventory:fixItemFreeMenu');
        }
        if (item.showGun) {
            menuList.showFibArsenalGunMenu();
        }
        if (item.sellItems) {
            inventory.getItemListSell();
        }
        if (item.showGunMod) {
            menuList.showFibArsenalGunModMenu();
        }
        if (item.itemId) {
            if (items.isWeapon(item.itemId))
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "FIB", "userName": "${user.getCache('name')}"}`, 'Выдано оружие').then();
            else
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "FIB", "userName": "${user.getCache('name')}"}`, 'Выдан предмет').then();
        }
    });
};

menuList.showFibArsenalGunMenu = function() {
    UIMenu.Menu.Create(`Арсенал`, `~b~Оружие`);

    UIMenu.Menu.AddMenuItem("Наручники", "", {itemId: 40});
    UIMenu.Menu.AddMenuItem("Фонарик", "", {itemId: 59});
    UIMenu.Menu.AddMenuItem("Полицейская дубинка", "", {itemId: 66});
    UIMenu.Menu.AddMenuItem("Электрошокер", "", {itemId: 82});

    if (user.getCache('rank_type') === 0) {
        UIMenu.Menu.AddMenuItem("Beretta 90Two", "", {itemId: 78});
        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm", "", {itemId: 280});
    }
    if (user.getCache('rank_type') === 2 || user.getCache('rank_type') === 1 || user.isLeader() || user.isSubLeader() || user.isDepLeader() || user.isDepSubLeader()) {
        UIMenu.Menu.AddMenuItem("Beretta 90Two", "", {itemId: 78});
        UIMenu.Menu.AddMenuItem("Glock 17", "", {itemId: 146});
        UIMenu.Menu.AddMenuItem("Benelli M3", "", {itemId: 90});
        UIMenu.Menu.AddMenuItem("Benelli M4", "", {itemId: 91});
        UIMenu.Menu.AddMenuItem("HK-416", "", {itemId: 110});
        UIMenu.Menu.AddMenuItem("HK-416A5", "", {itemId: 111});

        UIMenu.Menu.AddMenuItem("SIG MPX-SD", "", {itemId: 97});

        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm", "", {itemId: 280});
        UIMenu.Menu.AddMenuItem("Коробка патронов 12 калибра", "", {itemId: 281});
        UIMenu.Menu.AddMenuItem("Коробка патронов 5.56mm", "", {itemId: 284});
    }

    UIMenu.Menu.AddMenuItem("Бронежилет", "", {itemId: 252});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.itemId) {
            if (items.isWeapon(item.itemId))
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "FIB", "userName": "${user.getCache('name')}"}`, 'Выдано оружие').then();
            else
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "FIB", "userName": "${user.getCache('name')}"}`, 'Выдан предмет').then();
        }
    });
};

menuList.showFibArsenalGunModMenu = function() {
    UIMenu.Menu.Create(`Арсенал`, `~b~Модули на оружие`);
    if (user.getCache('rank_type') === 1 || user.getCache('rank_type') === 2 || user.isLeader() || user.isSubLeader() || user.isDepLeader() || user.isDepSubLeader()) {
        UIMenu.Menu.AddMenuItem("Фонарик Beretta 90Two", "", {itemId: 311});
        UIMenu.Menu.AddMenuItem("Оптический прицел Beretta 90Two", "", {itemId: 312});
        UIMenu.Menu.AddMenuItem("Глушитель Beretta 90Two", "", {itemId: 313});
        UIMenu.Menu.AddMenuItem("Компенсатор Beretta 90Two", "", {itemId: 314});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Глушитель Glock 17", "", {itemId: 316});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M3", "", {itemId: 341});
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M3", "", {itemId: 342});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Голографический прицел Benelli M4", "", {itemId: 349});
        UIMenu.Menu.AddMenuItem("Прицел малой кратности Benelli M4", "", {itemId: 350});
        UIMenu.Menu.AddMenuItem("Прицел средней кратности Benelli M4", "", {itemId: 351});
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M4", "", {itemId: 352});
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M4", "", {itemId: 353});
        UIMenu.Menu.AddMenuItem("Дульный тормоз Benelli M4", "", {itemId: 354});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик HK-416", "", {itemId: 362});
        UIMenu.Menu.AddMenuItem("Рукоятка HK-416", "", {itemId: 363});
        UIMenu.Menu.AddMenuItem("Глушитель HK-416", "", {itemId: 364});
        UIMenu.Menu.AddMenuItem("Прицел HK-416", "", {itemId: 365});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик HK-416A5", "", {itemId: 416});
        UIMenu.Menu.AddMenuItem("Голографический прицел HK-416A5", "", {itemId: 417});
        UIMenu.Menu.AddMenuItem("Прицел малой кратности HK-416A5", "", {itemId: 418});
        UIMenu.Menu.AddMenuItem("Прицел большой кратности HK-416A5", "", {itemId: 419});
        UIMenu.Menu.AddMenuItem("Глушитель HK-416A5", "", {itemId: 420});
        UIMenu.Menu.AddMenuItem("Тактический дульный тормоз HK-416A5", "", {itemId: 422});
        UIMenu.Menu.AddMenuItem("Рукоятка HK-416A5", "", {itemId: 428});
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.itemId) {
            if (items.isWeapon(item.itemId))
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "FIB", "userName": "${user.getCache('name')}"}`, 'Выдано оружие').then();
            else
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "FIB", "userName": "${user.getCache('name')}"}`, 'Выдан предмет').then();
        }
    });
};

menuList.showCartelArsenalMenu = function() {
    UIMenu.Menu.Create(`Арсенал`, `~b~Арсенал`);

    UIMenu.Menu.AddMenuItem("Сухпаёк", "", {itemId: 32});
    if (user.getCache('rank_type') !== 0 || user.isLeader() || user.isSubLeader() || user.isDepLeader() || user.isSubLeader()) {
        UIMenu.Menu.AddMenuItem("Большая Аптечка", "", {itemId: 278});
        UIMenu.Menu.AddMenuItem("Полицейское огорождение", "", {itemId: 199});
        UIMenu.Menu.AddMenuItem("Полосатый конус", "", {itemId: 201});
        UIMenu.Menu.AddMenuItem("Красный конус", "", {itemId: 202});
        UIMenu.Menu.AddMenuItem("~b~Починка оружия", "", {gunFix: true});
    }

    //UIMenu.Menu.AddMenuItem("~b~Сдача конфиската", "", {sellItems: true});
    UIMenu.Menu.AddMenuItem("~b~Оружие", "", {showGun: true});
    UIMenu.Menu.AddMenuItem("~b~Модули на оружие", "", {showGunMod: true});

    UIMenu.Menu.AddMenuItemList("Форма", ["Стандарт", "Форма #1", "Форма #2", "Форма #3", "Форма #4", "Форма #5"]);

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnList.Add((item, index) => {
        if (index == 0) {
            user.giveUniform(0);
        }
        else if (index == 1) {
            user.giveUniform(50);
        }
        else if (index == 2) {
            user.giveUniform(51);
        }
        else if (index == 3) {
            user.giveUniform(52);
        }
        else if (index == 4) {
            user.giveUniform(53);
        }
        else if (index == 5) {
            user.giveUniform(54);
        }
    });

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.gunFix) {
            mp.events.callRemote('server:inventory:fixItemFreeMenu');
        }
        if (item.showGun) {
            menuList.showCartelArsenalGunMenu();
        }
        if (item.sellItems) {
            inventory.getItemListSell();
        }
        if (item.showGunMod) {
            menuList.showCartelArsenalGunModMenu();
        }
        if (item.itemId) {
            if (items.isWeapon(item.itemId))
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "Mexico", "userName": "${user.getCache('name')}"}`, 'Выдано оружие').then();
            else
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "Mexico", "userName": "${user.getCache('name')}"}`, 'Выдан предмет').then();
        }
    });
};

menuList.showCartelArsenalGunMenu = function() {
    UIMenu.Menu.Create(`Арсенал`, `~b~Оружие`);

    UIMenu.Menu.AddMenuItem("Наручники", "", {itemId: 40});
    UIMenu.Menu.AddMenuItem("Фонарик", "", {itemId: 59});
    UIMenu.Menu.AddMenuItem("Полицейская дубинка", "", {itemId: 66});
    UIMenu.Menu.AddMenuItem("Электрошокер", "", {itemId: 82});

    if (user.getCache('rank_type') === 0) {
        UIMenu.Menu.AddMenuItem("Beretta 90Two", "", {itemId: 78});
        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm", "", {itemId: 280});
    }
    if (user.getCache('rank_type') > 0 || user.isLeader() || user.isSubLeader() || user.isDepLeader() || user.isDepSubLeader()) {
        UIMenu.Menu.AddMenuItem("Taurus PT92", "", {itemId: 77});
        UIMenu.Menu.AddMenuItem("Desert Eagle", "", {itemId: 79});
        UIMenu.Menu.AddMenuItem("Benelli M3", "", {itemId: 90});
        UIMenu.Menu.AddMenuItem("Benelli M4", "", {itemId: 91});
        UIMenu.Menu.AddMenuItem("AK-102", "", {itemId: 106});
        UIMenu.Menu.AddMenuItem("AK-103", "", {itemId: 107});

        UIMenu.Menu.AddMenuItem("P-90", "", {itemId: 94});

        UIMenu.Menu.AddMenuItem("Коробка патронов 9mm", "", {itemId: 280});
        UIMenu.Menu.AddMenuItem("Коробка патронов 12 калибра", "", {itemId: 281});
        UIMenu.Menu.AddMenuItem("Коробка патронов 5.56mm", "", {itemId: 284});
        UIMenu.Menu.AddMenuItem("Коробка патронов .45 ACP", "", {itemId: 286});
    }

    UIMenu.Menu.AddMenuItem("Бронежилет", "", {itemId: 252});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.itemId) {
            if (items.isWeapon(item.itemId))
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "Mexico", "userName": "${user.getCache('name')}"}`, 'Выдано оружие').then();
            else
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "Mexico", "userName": "${user.getCache('name')}"}`, 'Выдан предмет').then();
        }
    });
};

menuList.showCartelArsenalGunModMenu = function() {
    UIMenu.Menu.Create(`Арсенал`, `~b~Модули на оружие`);
    if (user.getCache('rank_type') > 0 || user.isLeader() || user.isSubLeader() || user.isDepLeader() || user.isDepSubLeader()) {
        UIMenu.Menu.AddMenuItem("Фонарик Taurus PT92", "", {itemId: 293});
        UIMenu.Menu.AddMenuItem("Глушитель Taurus PT92", "", {itemId: 294});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик Taurus PT92", "", {itemId: 299});
        UIMenu.Menu.AddMenuItem("Глушитель Taurus PT92", "", {itemId: 300});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M3", "", {itemId: 341});
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M3", "", {itemId: 342});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Голографический прицел Benelli M4", "", {itemId: 349});
        UIMenu.Menu.AddMenuItem("Прицел малой кратности Benelli M4", "", {itemId: 350});
        UIMenu.Menu.AddMenuItem("Прицел средней кратности Benelli M4", "", {itemId: 351});
        UIMenu.Menu.AddMenuItem("Фонарик Benelli M4", "", {itemId: 352});
        UIMenu.Menu.AddMenuItem("Глушитель Benelli M4", "", {itemId: 353});
        UIMenu.Menu.AddMenuItem("Дульный тормоз Benelli M4", "", {itemId: 354});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик AK-102", "", {itemId: 358});
        UIMenu.Menu.AddMenuItem("Рукоятка AK-102", "", {itemId: 359});
        UIMenu.Menu.AddMenuItem("Глушитель AK-102", "", {itemId: 360});
        UIMenu.Menu.AddMenuItem("Прицел AK-102", "", {itemId: 361});

        UIMenu.Menu.AddMenuItem(" ");
        UIMenu.Menu.AddMenuItem("Фонарик AK-103", "", {itemId: 403});
        UIMenu.Menu.AddMenuItem("Голографический прицел AK-103", "", {itemId: 404});
        UIMenu.Menu.AddMenuItem("Прицел малой кратности AK-103", "", {itemId: 405});
        UIMenu.Menu.AddMenuItem("Прицел большой кратности AK-103", "", {itemId: 406});
        UIMenu.Menu.AddMenuItem("Глушитель AK-103", "", {itemId: 407});
        UIMenu.Menu.AddMenuItem("Тактический дульный тормоз AK-103", "", {itemId: 409});
        UIMenu.Menu.AddMenuItem("Рукоятка AK-103", "", {itemId: 415});
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.itemId) {
            if (items.isWeapon(item.itemId))
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "Mexico", "userName": "${user.getCache('name')}"}`, 'Выдано оружие').then();
            else
                inventory.takeNewWeaponItem(item.itemId, `{"owner": "Mexico", "userName": "${user.getCache('name')}"}`, 'Выдан предмет').then();
        }
    });
};

menuList.showEduAskMenu = function() {

    UIMenu.Menu.Create("Обучение", "~b~Вы хотите посмотреть обучение?");

    UIMenu.Menu.AddMenuItem("Посмотреть обучение", "Займёт ~g~5~s~ минут твоего времени", {full: true});
    UIMenu.Menu.AddMenuItem("Посмотреть все фишки проекта", "Займёт ~g~2~s~ минуты твоего времени", {short: true});

    UIMenu.Menu.AddMenuItem("~b~Вы всегда можете задать вопрос через М - Задать вопрос");

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
        if (item.full)
            edu.startLong();
        if (item.short)
            edu.startShort();
    });
};

menuList.showAveMenu = function() {

    let btn = [];
    btn.push(
        {
            text: 'Заключить брак ($10,000)',
            bgcolor: '',
            params: {doName: 'ave:brak'}
        }
    );
    btn.push(
        {
            text: 'Разорвать брак ($1,000)',
            bgcolor: '',
            params: {doName: 'ave:nobrak'}
        }
    );
    btn.push(
        {
            text: 'Закрыть',
            bgcolor: 'rgba(244,67,54,0.7)',
            params: {doName: 'close'}
        }
    );

    shopMenu.showDialog(new mp.Vector3(-787.1298828125, -708.8898315429688, 30.32028579711914 + 0.6), 265.47149658203125);
    shopMenu.updateDialog(btn, 'Джесси', 'Священник', 'Приветсвую сын божий, чем я могу тебе помочь?')

    /*UIMenu.Menu.Create(`Работа`, `~b~Меню священника`);

    UIMenu.Menu.AddMenuItem("Заключить брак", "Стоимость: ~g~10,000", {doName: "aveBrak"});
    UIMenu.Menu.AddMenuItem("Разорвать брак", "Стоимость: ~g~1,000", {doName: "noAveBrak"});
    //UIMenu.Menu.AddMenuItem("РП смерть", "Стоимость: ~g~$500", {doName: "rpDeath"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        UIMenu.Menu.HideMenu();
    });*/
};

menuList.showInvaderShopMenu = function() {

    let btn = [];
    btn.push(
        {
            text: 'Арендовать рабочий ТС ($200)',
            bgcolor: '',
            params: {doName: 'inv:rentWorkCar'}
        }
    );

    btn.push(
        {
            text: 'Подать заявление на стажировку',
            bgcolor: '',
            params: {doName: 'inv:wantWork'}
        }
    );
    npc.showDialogInvader('Здравствуйте, чем я могу вам помочь?', btn);
};

menuList.showBotUsmcMenu = function() {

    let btn = [];
    btn.push(
        {
            text: 'Подать заявление в академию',
            bgcolor: '',
            params: {doName: 'usmc:wantWork'}
        }
    );

    npc.showDialogUsmc('Здравствуйте, чем я могу вам помочь?', btn);
};

menuList.showBotEmsMenu = function(idx, canFree) {

    let btn = [];
    btn.push(
        {
            text: 'Подать заявление на стажировку',
            bgcolor: '',
            params: {doName: 'ems:wantWork'}
        }
    );

    if (canFree) {
        if (user.getCache('med_lic')) {
            btn.push(
                {
                    text: 'Купить выписку за $800',
                    bgcolor: '',
                    params: {doName: 'ems:free'}
                }
            );
        }
        else {
            btn.push(
                {
                    text: 'Купить выписку за $2000',
                    bgcolor: '',
                    params: {doName: 'ems:free'}
                }
            );
        }
    }
    else {
        btn.push(
            {
                text: 'Выписка сейчас не доступна',
                bgcolor: '',
                params: {}
            }
        );
    }

    let listPos = [
        [309.55218505859375, -593.9552612304688, 43.28400802612305, 21.91470718383789],
        [1838.4437255859375, 3682.33544921875, 34.27005386352539, 162.76380920410156],
        [-246.97201538085938, 6320.427734375, 32.420734405517578, 312.1958923339844],
    ];

    npc.getDialog(new mp.Vector3(listPos[idx][0], listPos[idx][1], listPos[idx][2] + 0.6), listPos[idx][3], 'Врач', 'Сотрудник EMS', 'Здравствуйте, чем помочь? Хочу вам напомнить что, при наличии мед. страховки стоимость услуг намного ниже', btn);
};

menuList.showBotLspdMenu = function(idx = 0)
{
    let btn = [];
    btn.push(
        {
            text: 'Забрать конфискат',
            bgcolor: '',
            params: {doName: 'lspd:takeWeap'}
        }
    );
    if (user.getCache('wanted_level') > 0) {
        btn.push(
            {
                text: 'Сдаться',
                bgcolor: '',
                params: {doName: 'lspd:toJail'}
            }
        );
    }

    if (idx > 1) {
        btn.push(
            {
                text: 'Подать заявление на стажировку',
                bgcolor: '',
                params: {doName: 'bcsd:wantWork'}
            }
        );
    }
    else {
        btn.push(
            {
                text: 'Подать заявление в академию',
                bgcolor: '',
                params: {doName: 'lspd:wantWork'}
            }
        );
    }

    let listPos = [
        [441.0511, -978.8251, 30.68959, 179.4316],
        [-1097.457, -839.9836, 19.00159, 122.9423],
        [1853.438, 3689.164, 34.26706, -145.6209],
        [-448.6529, 6012.937, 31.71638, -45.47421],
    ];
    npc.getDialog(new mp.Vector3(listPos[idx][0], listPos[idx][1], listPos[idx][2] + 0.6), listPos[idx][3], 'Офицер', 'Сотрудник департамента', 'Здравствуйте, чем помочь?', btn);
};

menuList.showBotLspdCarMen = function(array, idx, x, y, z, rot)
{
    let btn = [];
    if (array.length > 0) {
        array.forEach(item => {
            btn.push(
                {
                    text: `${item.name} (${item.number})`,
                    bgcolor: '',
                    params: {doName: 'user:lspd:takeVehicle', x: x, y: y, z: z, rot: rot, vid: item.id}
                }
            );
        });
    }
    else {
        btn.push(
            {
                text: 'На штрафстоянке не найдено ваших авто',
                bgcolor: '',
                params: {doName: 'close'}
            }
        );
    }

    let listPos = [
        [392.0566, -1637.983, 29.29352, -83.97862], // Davis
        [846.9775, -1319.681, 26.40563, -33.86766], // La Mesa
        [482.4717, -1093.66, 29.40167, 136.061], // Mission Row
        [-1129.329, -772.9122, 18.24211, 5.332124], // Del Perro
        [1943.638, 3764.589, 32.21295, 55.02224], // Sandy Shores
        [-291.2821, 6137.66, 31.47069, -147.1063], // Paleto Bay
        [492.1434, -58.6371, 78.11255, 64.83295], // Vinewood
        [-180.3634, -2557.411, 6.013849, -37.53494], // Vans
        [-457.9996, -2268.136, 8.516481, -69.62789], // Boat
        [-1856.256, -3119.711, 13.94436, 156.0192], // Helicopters
        [-1071.75, -3457.185, 14.14418, -150.9734], // Plane
    ];
    npc.getDialog(new mp.Vector3(listPos[idx][0], listPos[idx][1], listPos[idx][2] + 0.6), listPos[idx][3], 'Офицер', 'Сотрудник департамента транспорта', 'Здравствуйте, чем помочь?', btn);
};

menuList.showBotQuestRole0Menu = function()
{
    let btn = [];
    btn.push(
        {
            text: 'Начать или закончить рабочий день',
            bgcolor: '',
            params: {doName: 'noob:startStop'}
        }
    );
    npc.showDialogLoader('Привет дружище, чем я могу тебе помочь?', btn);
};

menuList.showBotQuestRoleAllMenu = function()
{
    let btn = [];
    if (user.getQuestCount('standart') < quest.getQuestLineMax('standart'))
    {
        btn.push(
            {
                text: 'Квестовое задание',
                bgcolor: '',
                params: {doName: 'quest:all'}
            }
        );
    }
    btn.push(
        {
            text: 'Как устроиться на работу?',
            bgcolor: '',
            params: {doName: 'work'}
        }
    );
    btn.push(
        {
            text: 'Посмотреть обучение',
            bgcolor: '',
            params: {doName: 'edu:all'}
        }
    );
    btn.push(
        {
            text: 'Посмотреть все фишки проекта',
            bgcolor: '',
            params: {doName: 'edu:sml'}
        }
    );
    npc.showDialogStandart('Здравствуйте, чем я могу вам помочь?', btn);
};

menuList.showBotQuestRoleAll1Menu = function()
{
    let btn = [];
    if (user.getQuestCount('standart') < quest.getQuestLineMax('standart'))
    {
        btn.push(
            {
                text: 'Квестовое задание',
                bgcolor: '',
                params: {doName: 'quest:all'}
            }
        );
    }
    btn.push(
        {
            text: 'Как устроиться на работу?',
            bgcolor: '',
            params: {doName: 'work'}
        }
    );
    btn.push(
        {
            text: 'Посмотреть обучение',
            bgcolor: '',
            params: {doName: 'edu:all'}
        }
    );
    btn.push(
        {
            text: 'Посмотреть все фишки проекта',
            bgcolor: '',
            params: {doName: 'edu:sml'}
        }
    );
    npc.showDialogStandartIsland('Здравствуйте, чем я могу вам помочь?', btn);
};

menuList.showBotQuestGangMenu = function()
{
    let btn = [];
    if (user.getQuestCount('gang') < quest.getQuestLineMax('gang'))
    {
        btn.push(
            {
                text: 'Квестовое задание',
                bgcolor: '',
                params: {doName: 'quest:lamar'}
            }
        );
    }
    if (user.getQuestCount('gang') > 0)
    {
        btn.push(
            {
                text: 'Задание на перевозку',
                bgcolor: '',
                params: {doName: 'lamar:car'}
            }
        );
        /*btn.push(
            {
                text: 'Купить спец. отмычку (Цена: 0.2ec)',
                bgcolor: '',
                params: {doName: 'lamar:buy'}
            }
        );*/
    }
    npc.showDialogLamar('Васт ап, хоуми, чем я могу помочь?', btn);
};

menuList.showBotJailMenu = function()
{
    let btn = [];

    btn.push(
        {
            text: 'Получить работу',
            bgcolor: '',
            params: {doName: 'jail:work'}
        }
    );
    npc.showDialogJail('Привет, чем я могу помочь?', btn);
};

menuList.showBotYankMenu = function()
{
    let btn = [];

    btn.push(
        {
            text: 'Что произошло?',
            bgcolor: '',
            params: {doName: 'yank:ask'}
        }
    );
    npc.showDialogYpd('Здравствуйте, чем я могу вам помочь?', btn);
};

menuList.showGangZoneAttackMenu = function(zone, count = 5) {
    UIMenu.Menu.Create(`Захват`, `~b~ID: ${zone.get('gangWarid')}`);

    /*UIMenu.Menu.AddMenuItem(`~b~${zone.get('gangWarzone').toString()}`);
    UIMenu.Menu.AddMenuItem(`~b~${zone.get('gangWarstreet').toString()}`);*/
    UIMenu.Menu.AddMenuItem(`~b~${zone.get('gangWarfraction_name').toString()}`);

    UIMenu.Menu.AddMenuItem(`~b~Кол-во:~s~ ${count}vs${count}`, "", {doName: "count"});
    UIMenu.Menu.AddMenuItemList("~b~Броня~s~", ['~g~Да', '~r~Нет'], "", {doName: "armor"});
    UIMenu.Menu.AddMenuItemList("~b~Оружие~s~", ['Любое', 'Пистолеты', 'Дробовики', 'SMG', 'Автоматы'], "", {doName: "gun"});
    UIMenu.Menu.AddMenuItemList("~b~Время~s~", ['14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00'], "", {doName: "time"});
    UIMenu.Menu.AddMenuItem(`~g~Объявить захват`, "", {doName: "start"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    let armorIndex = 0;
    let gunIndex = 0;
    let timeIndex = 0;

    UIMenu.Menu.OnList.Add((item, index) => {
        if (item.doName === 'armor')
            armorIndex = index;
        if (item.doName === 'gun')
            gunIndex = index;
        if (item.doName === 'time')
            timeIndex = index;
    });

    UIMenu.Menu.OnSelect.Add(async item => {
        try {
            if (item.doName === 'count') {
                let name = methods.parseInt(await UIMenu.Menu.GetUserInput("Число", "", 9));
                if (name > 20) {
                    mp.game.ui.notifications.show(`~r~Значение не должно быть больше 20`);
                    return;
                }
                if (name < 1) {
                    mp.game.ui.notifications.show(`~r~Значение не должно быть меньше 1`);
                    return;
                }
                menuList.showGangZoneAttackMenu(zone, name);
            }
            if (item.doName == 'start')
                mp.events.callRemote('server:gangWar:addWar', zone.get('gangWarid'), count, armorIndex, gunIndex, timeIndex);
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

menuList.showCanabisZoneAttackMenu = function(zone, count = 5) {
    UIMenu.Menu.Create(`Захват`, `~b~ID: ${zone.get('canabisWarid')}`);

    /*UIMenu.Menu.AddMenuItem(`~b~${zone.get('canabisWarzone').toString()}`);
    UIMenu.Menu.AddMenuItem(`~b~${zone.get('canabisWarstreet').toString()}`);*/
    UIMenu.Menu.AddMenuItem(`~b~${zone.get('canabisWarfraction_name').toString()}`);

    UIMenu.Menu.AddMenuItem(`~b~Кол-во:~s~ ${count}vs${count}`, "", {doName: "count"});
    UIMenu.Menu.AddMenuItemList("~b~Броня~s~", ['~g~Да', '~r~Нет'], "", {doName: "armor"});
    UIMenu.Menu.AddMenuItemList("~b~Оружие~s~", ['Любое', 'Пистолеты', 'Дробовики', 'SMG', 'Автоматы'], "", {doName: "gun"});
    UIMenu.Menu.AddMenuItemList("~b~Время~s~", ['17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30'], "", {doName: "time"});
    UIMenu.Menu.AddMenuItem(`~g~Объявить захват`, "", {doName: "start"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    let armorIndex = 0;
    let gunIndex = 0;
    let timeIndex = 0;

    UIMenu.Menu.OnList.Add((item, index) => {
        if (item.doName === 'armor')
            armorIndex = index;
        if (item.doName === 'gun')
            gunIndex = index;
        if (item.doName === 'time')
            timeIndex = index;
    });

    UIMenu.Menu.OnSelect.Add(async item => {
        try {
            if (item.doName === 'count') {
                let name = methods.parseInt(await UIMenu.Menu.GetUserInput("Число", "", 9));
                if (name > 20) {
                    mp.game.ui.notifications.show(`~r~Значение не должно быть больше 20`);
                    return;
                }
                if (name < 1) {
                    mp.game.ui.notifications.show(`~r~Значение не должно быть меньше 1`);
                    return;
                }
                menuList.showCanabisZoneAttackMenu(zone, name);
            }
            if (item.doName == 'start')
                mp.events.callRemote('server:canabisWar:addWar', zone.get('canabisWarid'), count, armorIndex, gunIndex, timeIndex);
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

menuList.showAdminMenu = function() {
    UIMenu.Menu.Create(`ADMIN`, `~b~Админ меню`);

    if (user.isAdmin()) {

        if (mp.players.local.getVariable('enableAdmin') === true) {
            UIMenu.Menu.AddMenuItem("Действие над игроком", "", {doName: "playerMenu"});
            UIMenu.Menu.AddMenuItem("Транспорт", "", {doName: "vehicleMenu"});
            UIMenu.Menu.AddMenuItem("Телепорт", "", {doName: "teleportMenu"});
            if (user.isAdmin(2)) {
                UIMenu.Menu.AddMenuItem("Режим No Clip", "", {doName: "noClip"});
                UIMenu.Menu.AddMenuItem("Режим Free Cam", "", {doName: "freeCam"});
                UIMenu.Menu.AddMenuItem("Режим Drone", "", {doName: "drone"});
            }
            //if (user.isAdmin(2))

            UIMenu.Menu.AddMenuItem("Режим GodMode", "", {doName: "godMode"});

            if (!user.isAdminRp()) {

                UIMenu.Menu.AddMenuItem("Лидер крайма", "Значение 0 убирает оргу", {doName: "giveLeader"});
                UIMenu.Menu.AddMenuItem("Лидер семьи", "Значение 0 убирает оргу", {doName: "giveLeaderFam"});
            }

            UIMenu.Menu.AddMenuItem("Режим невидимки", "", {doName: "invise"});
            UIMenu.Menu.AddMenuItem("Прогрузка ID", "", {doName: "idDist"});
            UIMenu.Menu.AddMenuItem("Список игроков", "", {doName: "playerList"});

            if (user.isAdmin(3))
                UIMenu.Menu.AddMenuItem("Выбор одежды", "", {doName: "clothMenu"});
            if (user.isAdmin(5))
                UIMenu.Menu.AddMenuItem("Выбор масок", "", {doName: "maskMenu"});
            if (user.isAdmin(4))
                UIMenu.Menu.AddMenuItem("Выдача предмета", "", {doName: "giveItem"});
            if (user.isAdmin(2) && !user.isAdminRp())
                UIMenu.Menu.AddMenuItem("Уведомление", "", {doName: "notify"});
            if (user.isAdmin(2) && !user.isAdminRp())
                UIMenu.Menu.AddMenuItem("Уведомление для крайма", "", {doName: "notifyCrime"});
            if (user.isAdmin(2) || user.isAdminRp())
                UIMenu.Menu.AddMenuItem("Меропритие", "", {doName: "eventMenu"});

            if (user.isAdmin(3) && !user.isAdminRp()) {
                UIMenu.Menu.AddMenuItem("Управление ганг. зонами", "", {doName: "gangZone"});
                UIMenu.Menu.AddMenuItem("Управление канабис зонами", "", {doName: "canabisZone"});
                UIMenu.Menu.AddMenuItemList("Погода", ["EXTRASUNNY", "CLEAR", "CLOUDS", "SMOG", "FOGGY", "OVERCAST", "RAIN", "THUNDER", "CLEARING", "XMAS"], "", {doName: "changeWeather"});
            }

            UIMenu.Menu.AddMenuItem("~y~Выключить админку", "", {doName: "disableAdmin"});
            UIMenu.Menu.AddMenuItem("~y~Ответить на жалобу", "", {doName: "askReport"});

            if (user.isAdmin(4)) {
                UIMenu.Menu.AddMenuItem("Выдача оружия", "", {doName: "gunMenu"});
            }
            if (user.isAdmin(5)) {
                UIMenu.Menu.AddMenuItem("Для разработчика", "", {doName: "developerMenu"});
            }
        }
        else {
            UIMenu.Menu.AddMenuItem("~y~Включить админку", "", {doName: "enableAdmin"});
            UIMenu.Menu.AddMenuItem("~y~Ответить на жалобу", "", {doName: "askReport"});
        }
    }
    if (user.isHelper()) {
        UIMenu.Menu.AddMenuItem("~y~Ответить на вопрос", "", {doName: "askHelp"});
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    let wIdx = 0;
    UIMenu.Menu.OnList.Add((item, index) => {
        wIdx = index;
    });

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.doName == 'enableAdmin') {
            user.setVariable('enableAdmin', true);
            if (user.isAdminRp())
                user.setVariable('adminRole', 'RP Maker');
            else if (user.getCache('admin_level') < 4)
                user.setVariable('adminRole', 'Game Admin');
            else if (user.getCache('admin_level') === 4)
                user.setVariable('adminRole', 'Admin');
            else if (user.getCache('admin_level') === 5)
                user.setVariable('adminRole', 'Main Admin');
            else if (user.getCache('admin_level') === 6)
                user.setVariable('adminRole', 'Admin');
            admin.godmode(true);
            mp.events.call('client:idDist', 100);
        }
        if (item.doName == 'disableAdmin') {
            user.setAlpha(255);
            admin.godmode(false);
            mp.events.call('client:idDist', 15);
            user.setVariable('enableAdmin', false);
        }
        if (item.doName == 'changeWeather') {
            let wList = ["EXTRASUNNY", "CLEAR", "CLOUDS", "SMOG", "FOGGY", "OVERCAST", "RAIN", "THUNDER", "CLEARING", "XMAS"];
            mp.events.callRemote('server:admin:changeWeather', wList[wIdx]);
        }
        if (item.doName == 'askReport') {
            let id = await UIMenu.Menu.GetUserInput("ID", "", 5);
            let text = await UIMenu.Menu.GetUserInput("Ответ", "", 300);
            if (text != '')
                mp.events.callRemote('server:sendAnswerReport', methods.parseInt(id), text);
        }
        if (item.doName == 'askHelp') {
            let id = await UIMenu.Menu.GetUserInput("ID", "", 5);
            let text = await UIMenu.Menu.GetUserInput("Ответ", "", 300);
            if (text != '')
                mp.events.callRemote('server:sendAnswerAsk', methods.parseInt(id), text);
        }
        if (item.doName == 'gangZone') {
            let id = await UIMenu.Menu.GetUserInput("Введите ID территори", "", 5);
            menuList.showAdminGangZoneMenu(await Container.Data.GetAll(600000 + methods.parseInt(id)));
        }
        if (item.doName == 'canabisZone') {
            let id = await UIMenu.Menu.GetUserInput("Введите ID территори", "", 5);
            menuList.showAdminCanabisZoneMenu(await Container.Data.GetAll(600000 + methods.parseInt(id)));
        }
        if (item.doName == 'noClip')
            admin.noClip(true);
        if (item.doName == 'freeCam')
        {
            if (!admin.isFreeCam())
                admin.startFreeCam();
            else
                admin.stopFreeCam();
        }
        if (item.doName == 'drone')
        {
            drone.startOrEnd();
        }
        if (item.doName == 'invise') {
            let val = methods.parseInt(await UIMenu.Menu.GetUserInput("От 0 до 255", "", 3));
            user.setAlpha(val);
        }
        if (item.doName == 'giveLeader') {
            let val = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите ID", "", 3));
            user.set('fraction_id2', val);
            user.set('is_leader2', val > 0);
            user.set('is_sub_leader2', false);
            user.set('rank2', 0);
            user.set('rank_type2', 0);
        }
        if (item.doName == 'giveLeaderFam') {
            let val = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите ID", "", 3));
            user.set('family_id', val);
            user.set('is_leaderf', val > 0);
            user.set('is_sub_leaderf', false);
            user.set('rankf', 0);
            user.set('rank_typef', 0);
        }
        if (item.doName == 'idDist') {
            let val = methods.parseInt(await UIMenu.Menu.GetUserInput("От 10 до 200", "", 3));
            mp.events.call('client:idDist', val);
        }
        if (item.doName == 'godMode')
            admin.godmode(!admin.isGodModeEnable());
        if (item.doName == 'clothMenu')
            menuList.showAdminClothMenu();
        if (item.doName == 'maskMenu')
            menuList.showAdminMaskMenu();
        if (item.doName == 'giveItem')
            menuList.showAdminGiveItemMenu();
        if (item.doName == 'playerMenu')
        {
            try {
                menuList.showAdminPlayerMenu(mp.players.local.remoteId);
            }
            catch (e) {
                methods.debug(e);
            }
        }
        if (item.doName == 'playerList')
        {
            try {
                menuList.showAdminPlayerListMenu();
            }
            catch (e) {
                methods.debug(e);
            }
        }
        if (item.doName == 'eventMenu')
            menuList.showAdminEventMenu();
        if (item.doName == 'developerMenu')
            menuList.showAdminDevMenu();
        if (item.doName == 'gunMenu')
            menuList.showGunShopMenu(0, 2);
        if (item.doName == 'vehicleMenu')
            menuList.showAdminVehicleMenu();
        if (item.doName == 'teleportMenu')
            menuList.showAdminTeleportMenu();
        if (item.doName == 'notify') {
            let title = await UIMenu.Menu.GetUserInput("Заголовок", "", 20);
            if (title == '')
                return;
            let text = await UIMenu.Menu.GetUserInput("Текст новости", "", 150);
            if (text == '')
                return;
            methods.notifyWithPictureToAll(title, 'Администрация', text, 'CHAR_ACTING_UP');
        }
        if (item.doName == 'notifyCrime') {
            let text = await UIMenu.Menu.GetUserInput("Текст новости", "", 150);
            if (text == '')
                return;
            for (let i = 1; i <= 20; i++) {
                methods.notifyWithPictureToFraction2('E CORP', 'Администрация', text, 'CHAR_ACTING_UP', i);
            }
        }
    });
};

menuList.showAdminPlayerMenu = function(id) {
    UIMenu.Menu.Create(`ADMIN`, `~b~Админ меню`);

    UIMenu.Menu.AddMenuItem("~b~Введите ID", "", {doName: 'changeId'}, id.toString());
    UIMenu.Menu.AddMenuItemList("Тип ID", ['Dynamic', 'Static'], "", {doName: "type"});

    UIMenu.Menu.AddMenuItem("Изменить виртуальный мир", "", {doName: "changeDimension"});
    UIMenu.Menu.AddMenuItem("Узнать виртуальный мир", "", {doName: "getDimension"});
    UIMenu.Menu.AddMenuItem("Телепортироваться к игроку", "", {doName: "tptoid"});
    UIMenu.Menu.AddMenuItem("Телепортировать игрока к себе", "", {doName: "tptome"});

    if (user.isAdmin(2)) {
        UIMenu.Menu.AddMenuItem("Выдать HP", "", {doName: "setHpById"});
        UIMenu.Menu.AddMenuItem("Выдать Armor", "", {doName: "setArmorById"});
        UIMenu.Menu.AddMenuItem("Выдать скин", "", {doName: "setSkinById"});
    }
    UIMenu.Menu.AddMenuItem("Восстановить скин", "", {doName: "resetSkinById"});
    UIMenu.Menu.AddMenuItem("Воскресить", "", {doName: "adrenalineById"});
    UIMenu.Menu.AddMenuItem("Выписать из больницы", "", {doName: "freeHospById"});

    if (user.isAdmin(4) && !user.isAdminRp())
        UIMenu.Menu.AddMenuItemList("Лидер организации", ["None", "Gov", "LSPD", "FIB", "USMC", "BCSD", "EMS", "News", "Cartel"], "", {doName: "giveLeader"});

    if (!user.isAdminRp()) {
        UIMenu.Menu.AddMenuItem("Посадить в тюрьму", "", {doName: "jail"});

        if (user.isAdmin(2))
        {
            UIMenu.Menu.AddMenuItem("Кикнуть", "", {doName: "kick"});
            UIMenu.Menu.AddMenuItemList("~y~Забанить", ['1h', '6h', '12h', '1d', '3d', '7d', '14d', '30d', '60d', '90d', 'Permanent'], "", {doName: "ban"});
            UIMenu.Menu.AddMenuItem("~y~Разбанить", "", {doName: "unban"});
            UIMenu.Menu.AddMenuItem("~y~Выдать предуп.", "", {doName: "warn"});
            UIMenu.Menu.AddMenuItem("~y~Снять предуп.", "", {doName: "unwarn"});
            UIMenu.Menu.AddMenuItem("~y~Сбросить таймер оружия", "", {doName: "untimer"});
        }

        if (user.isAdmin(5))
            UIMenu.Menu.AddMenuItem("~r~Занести в черный список", "", {doName: "blacklist"});
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    let listIndex = 0;
    let typeIndex = 0;
    UIMenu.Menu.OnList.Add((item, index) => {
        listIndex = index;
        if (item.doName === 'type')
            typeIndex = index;
    });

    UIMenu.Menu.OnSelect.Add(async item => {

        try {
            if (item.doName === 'giveLeader') {
                mp.events.callRemote('server:admin:giveLeader', typeIndex, id, listIndex);
            }
            if (item.doName == 'changeDimension') {
                let num = methods.parseInt(await UIMenu.Menu.GetUserInput("ID", "", 32));
                mp.events.callRemote('server:admin:changeDimension', typeIndex, methods.parseInt(id), num);
            }
            if (item.doName == 'getDimension') {
                mp.events.callRemote('server:admin:getDimension', typeIndex, methods.parseInt(id));
            }
            if (item.doName == 'tptoid') {
                mp.events.callRemote('server:admin:tptoid', typeIndex, methods.parseInt(id));
            }
            if (item.doName == 'tptome') {
                mp.events.callRemote('server:admin:tptome', typeIndex, methods.parseInt(id));
            }
            if (item.doName == 'blacklist') {
                let reason = await UIMenu.Menu.GetUserInput("Причина", "", 64);
                mp.events.callRemote('server:admin:blacklist', typeIndex, id, methods.removeQuotes(reason));
            }
            if (item.doName == 'unban') {
                let reason = await UIMenu.Menu.GetUserInput("Причина", "", 64);
                mp.events.callRemote('server:admin:unban', typeIndex, id, methods.removeQuotes(reason))
            }
            if (item.doName == 'warn') {
                let reason = await UIMenu.Menu.GetUserInput("Причина", "", 64);
                mp.events.callRemote('server:admin:warn', typeIndex, id, methods.removeQuotes(reason))
            }
            if (item.doName == 'unwarn') {
                let reason = await UIMenu.Menu.GetUserInput("Причина", "", 64);
                mp.events.callRemote('server:admin:unwarn', typeIndex, id, methods.removeQuotes(reason))
            }
            if (item.doName == 'untimer') {
                let reason = await UIMenu.Menu.GetUserInput("Причина", "", 64);
                mp.events.callRemote('server:admin:untimer', typeIndex, id, methods.removeQuotes(reason))
            }
            if (item.doName == 'ban') {
                let reason = await UIMenu.Menu.GetUserInput("Причина", "", 64);
                mp.events.callRemote('server:admin:ban', typeIndex, id, listIndex, methods.removeQuotes(reason));
            }
            if (item.doName == 'kick') {
                let reason = await UIMenu.Menu.GetUserInput("Причина", "", 64);
                mp.events.callRemote('server:admin:kick', typeIndex, id, methods.removeQuotes(reason));
            }
            if (item.doName == 'jail') {
                let num = methods.parseInt(await UIMenu.Menu.GetUserInput("Время в минутах", "", 5));
                let reason = await UIMenu.Menu.GetUserInput("Причина", "", 64);
                if (reason === '')
                    return;
                mp.events.callRemote('server:admin:jail', typeIndex, id, num, methods.removeQuotes(reason));
            }
            if (item.doName == 'resetSkinById') {
                mp.events.callRemote('server:admin:resetSkinById', typeIndex, id)
            }
            if (item.doName == 'adrenalineById') {
                mp.events.callRemote('server:admin:adrenalineById', typeIndex, id)
            }
            if (item.doName == 'freeHospById') {
                mp.events.callRemote('server:admin:freeHospById', typeIndex, id)
            }
            if (item.doName == 'setSkinById') {
                let num = await UIMenu.Menu.GetUserInput("Имя скина", "", 32);
                mp.events.callRemote('server:admin:setSkinById', typeIndex, id, num)
            }
            if (item.doName == 'setArmorById') {
                let num = methods.parseInt(await UIMenu.Menu.GetUserInput("Значение брони", "", 3));
                mp.events.callRemote('server:admin:setArmorById', typeIndex, id, num)
            }
            if (item.doName == 'setHpById') {
                let num = methods.parseInt(await UIMenu.Menu.GetUserInput("Значение HP", "", 3));
                mp.events.callRemote('server:admin:setHpById', typeIndex, id, num)
            }
            if (item.doName == 'changeId') {
                id = methods.parseInt(await UIMenu.Menu.GetUserInput("Введите ID", "", 9));
                if (id < 0)
                    id = mp.players.local.remoteId;
                menuList.showAdminPlayerMenu(id);
            }
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

menuList.showAdminPlayerListMenu = function() {
    UIMenu.Menu.Create(`ADMIN`, `~b~Список игроков`);

    mp.players.forEach(p => {
        let label = '';
        let name = '~b~' + p.remoteId + '~s~. ' + p.getVariable('name') + ' (' + p.getVariable('idLabel') + ')';
        if (p.getVariable('enableAdmin') && p.getVariable('adminRole'))
            label = '(' + p.getVariable('adminRole') + ')';
        UIMenu.Menu.AddMenuItem(name, "", {doName: 'info', pid:  p.remoteId }, p.getVariable('isAfk') ? '~r~AFK ' + label : '~r~' + label);
    });

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {

        try {
            if (item.doName === 'info') {
                menuList.showAdminPlayerMenu(item.pid);
            }
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

menuList.showAdminGangZoneMenu = function(zone) {
    UIMenu.Menu.Create(`ADMIN`, `~b~ID: ${zone.get('gangWarid')}`);

    UIMenu.Menu.AddMenuItem("FractionId", zone.get('gangWarfraction_id').toString(), {doName: "fraction_id"});
    UIMenu.Menu.AddMenuItem("FractionName", zone.get('gangWarfraction_name').toString(), {doName: "fraction_name"});
    UIMenu.Menu.AddMenuItem("Timestamp", zone.get('gangWartimestamp').toString(), {doName: "timestamp"});
    UIMenu.Menu.AddMenuItem("Телепорт на центр", "", {doName: "tppos"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {

        try {
            if (item.doName === 'tppos') {
                user.teleport(zone.get('gangWarx'), zone.get('gangWary'), zone.get('gangWarz'))
            }
            if (item.doName === 'pos') {
                mp.events.callRemote('server:admin:gangZone:editPos', zone.get('gangWarid'));
            }
            if (item.doName === 'timestamp' || item.doName === 'fraction_id' || item.doName === 'cant_war') {
                let name = await UIMenu.Menu.GetUserInput("Число", "", 9);
                mp.events.callRemote('server:admin:gangZone:edit', zone.get('gangWarid'), item.doName, methods.parseInt(name));
            }
            if (item.doName == 'zone' || item.doName == 'street' || item.doName == 'fraction_name') {
                let name = await UIMenu.Menu.GetUserInput("Название", "", 120);
                mp.events.callRemote('server:admin:gangZone:edit', zone.get('gangWarid'), item.doName, name);
            }
        }
        catch (e) {
            methods.debug(e);
        }
    });
};


menuList.showAdminCanabisZoneMenu = function(zone) {
    UIMenu.Menu.Create(`ADMIN`, `~b~ID: ${zone.get('canabisWarid')}`);

    UIMenu.Menu.AddMenuItem("FractionId", zone.get('canabisWarfraction_id').toString(), {doName: "fraction_id"});
    UIMenu.Menu.AddMenuItem("FractionName", zone.get('canabisWarfraction_name').toString(), {doName: "fraction_name"});
    UIMenu.Menu.AddMenuItem("Timestamp", zone.get('canabisWartimestamp').toString(), {doName: "timestamp"});
    UIMenu.Menu.AddMenuItem("Телепорт на центр", "", {doName: "tppos"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {

        try {
            if (item.doName === 'tppos') {
                user.teleport(zone.get('canabisWarx'), zone.get('canabisWary'), zone.get('canabisWarz'))
            }
            if (item.doName === 'pos') {
                mp.events.callRemote('server:admin:canabisZone:editPos', zone.get('canabisWarid'));
            }
            if (item.doName === 'timestamp' || item.doName === 'fraction_id' || item.doName === 'cant_war') {
                let name = await UIMenu.Menu.GetUserInput("Число", "", 9);
                mp.events.callRemote('server:admin:canabisZone:edit', zone.get('canabisWarid'), item.doName, methods.parseInt(name));
            }
            if (item.doName == 'zone' || item.doName == 'street' || item.doName == 'fraction_name') {
                let name = await UIMenu.Menu.GetUserInput("Название", "", 120);
                mp.events.callRemote('server:admin:canabisZone:edit', zone.get('canabisWarid'), item.doName, name);
            }
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

menuList.showAdminVehicleMenu = function() {
    UIMenu.Menu.Create(`ADMIN`, `~b~Админ меню`);

    UIMenu.Menu.AddMenuItem("Заспавнить транспорт", "", {doName: "spawn"});
    UIMenu.Menu.AddMenuItem("Цвет транспорта", "", {doName: "colorVeh"});
    UIMenu.Menu.AddMenuItem("Тюнинг", "", {doName: "tunning"});
    UIMenu.Menu.AddMenuItem("Ремонт транспорта", "", {doName: "fixvehicle"});
    UIMenu.Menu.AddMenuItem("Зареспавнить ближайший транспорт", "", {doName: "respvehicle"});
    UIMenu.Menu.AddMenuItem("Перевернуть ближайший транспорт", "", {doName: "flipVehicle"});

    if (user.isAdmin(5)) {
        if (mp.players.local.vehicle) {
            let vInfo = methods.getVehicleInfo(mp.players.local.vehicle.model);
            UIMenu.Menu.AddMenuItem(`Макс. скорость ~g~${vehicles.getSpeedMax(mp.players.local.vehicle.model)}km/h`, "", {doName: "vehicleSpeedMax"});
            UIMenu.Menu.AddMenuItem(`Состояние буста ~g~${vInfo.sb}ед.`, "", {doName: "vehicleSpeedBoost"});
            UIMenu.Menu.AddMenuItem(`Стоимость ~g~${methods.moneyFormat(vInfo.price)}`);
            UIMenu.Menu.AddMenuItem(`~b~Добавить на авторынок`, "", {doName: "vehicleAdd"});
            UIMenu.Menu.AddMenuItem(`~b~Добавить на авторынок орг.`, "", {doName: "vehicleAddFraction"});
        }
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        if (item.doName == 'colorVeh') {
            menuList.showAdminColorVehMenu();
        }
        if (item.doName == 'tunning') {
            menuList.showAdminTunningMenu();
        }
        if (item.doName === 'spawn') {
            let vName = await UIMenu.Menu.GetUserInput("Название ТС", "", 20);
            if (vName == '')
                return;
            //methods.saveLog('AdminSpawnVehicle', `${user.getCache('rp_name')} - ${vName}`);
            mp.events.callRemote('server:admin:spawnVeh', vName);

            let pos = mp.players.local.position;
            methods.saveLog('log_admin', ['name', 'type', 'do'], [`${user.getCache('name')}`, 'VEH_SPAWN', `${vName} | ${methods.parseInt(pos.x)} | ${methods.parseInt(pos.y)} | ${methods.parseInt(pos.z)}`]);
        }
        if (item.doName == 'vehicleAdd') {
            let vInfo = methods.getVehicleInfo(mp.players.local.vehicle.model);
            let count = methods.parseInt(await UIMenu.Menu.GetUserInput("Кол-во", "", 8));
            mp.events.callRemote('server:vehicles:addNew', vInfo.display_name, count);

            methods.saveLog('log_admin', ['name', 'type', 'do'], [`${user.getCache('name')}`, 'VEH_ADD', `${vInfo.display_name} | ${count}`]);
        }
        if (item.doName == 'vehicleAddFraction') {
            let vInfo = methods.getVehicleInfo(mp.players.local.vehicle.model);
            let count = methods.parseInt(await UIMenu.Menu.GetUserInput("Кол-во", "", 8));
            let fractionId = methods.parseInt(await UIMenu.Menu.GetUserInput("Fraction ID", "", 8));
            mp.events.callRemote('server:vehicles:addNewFraction', vInfo.display_name, count, fractionId);

            methods.saveLog('log_admin', ['name', 'type', 'do'], [`${user.getCache('name')}`, 'VEH_ADD_FRACTION', `${vInfo.display_name} | COUNT: ${count} | FID: ${fractionId}`]);
        }
        if (item.doName === 'vehicleSpeedMax') {
            let vInfo = methods.getVehicleInfo(mp.players.local.vehicle.model);

            let num = methods.parseInt(await UIMenu.Menu.GetUserInput("Значение", "", 5));
            mp.events.callRemote('server:admin:vehicleSpeedMax', vInfo.display_name, num);

            vInfo.sm = num;
            methods.setVehicleInfo(mp.players.local.vehicle.model, vInfo);

            menuList.showAdminVehicleMenu();

            methods.saveLog('log_admin', ['name', 'type', 'do'], [`${user.getCache('name')}`, 'VEH_SPEED', `${vInfo.display_name} | ${num}`]);
        }
        if (item.doName === 'vehicleSpeedBoost') {
            let vInfo = methods.getVehicleInfo(mp.players.local.vehicle.model);

            let num = methods.parseInt(await UIMenu.Menu.GetUserInput("Значение", "", 5));
            mp.events.callRemote('server:admin:vehicleSpeedBoost', vInfo.display_name, num);

            vInfo.sb = num;
            methods.setVehicleInfo(mp.players.local.vehicle.model, vInfo);

            menuList.showAdminVehicleMenu();
            methods.saveLog('log_admin', ['name', 'type', 'do'], [`${user.getCache('name')}`, 'VEH_BOOST', `${vInfo.display_name} | ${num}`]);
        }
        if (item.doName == 'fixvehicle') {
            mp.events.callRemote('server:user:fixNearestVehicle');
        }
        if (item.doName == 'respvehicle') {
            mp.events.callRemote('server:respawnNearstVehicle');
        }
        if (item.doName == 'flipVehicle') {
            mp.events.callRemote('server:flipNearstVehicle');
        }
    });
};

menuList.showAdminTeleportMenu = function() {
    UIMenu.Menu.Create(`ADMIN`, `~b~Админ меню`);

    UIMenu.Menu.AddMenuItem("Телепорт на метку", "", {doName: "teleportToWaypoint"});
    UIMenu.Menu.AddMenuItem("Телепортироваться к игроку", "", {doName: "tptoid"});
    UIMenu.Menu.AddMenuItem("Телепортировать игрока к себе", "", {doName: "tptome"});
    UIMenu.Menu.AddMenuItem("Телепорт по ID дома", "", {doName: "tptoh"});

    UIMenu.Menu.AddMenuItem("Телепортировать транспорт к себе", "", {doName: "tptov"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        if (item.doName == 'teleportToWaypoint')
            user.tpToWaypoint();
        if (item.doName == 'tptoid') {
            let id = await UIMenu.Menu.GetUserInput("ID Игрока", "", 10);
            mp.events.callRemote('server:admin:tptoid', 0, methods.parseInt(id));
        }
        if (item.doName == 'tptome') {
            let id = await UIMenu.Menu.GetUserInput("ID Игрока", "", 10);
            mp.events.callRemote('server:admin:tptome', 0, methods.parseInt(id));
        }
        if (item.doName == 'tptov') {
            let id = await UIMenu.Menu.GetUserInput("ID Транспорта", "", 10);
            mp.events.callRemote('server:admin:tptov', methods.parseInt(id));
        }
        if (item.doName == 'tptoh') {
            let id = await UIMenu.Menu.GetUserInput("ID Дома", "", 10);
            mp.events.callRemote('server:houses:teleport', methods.parseInt(id));
        }
    });
};

menuList.showAdminEventMenu = function() {
    UIMenu.Menu.Create(`ADMIN`, `~b~Админ меню`);

    /*UIMenu.Menu.AddMenuItem("Выдать HP в радиусе").doName = 'tptoid';
    UIMenu.Menu.AddMenuItem("Выдать Armor в радиусе").doName = 'tptoid';
    UIMenu.Menu.AddMenuItem("Выдать оружие в радиусе").doName = 'tptoid';*/
    UIMenu.Menu.AddMenuItem("~y~Пригласить на мероприятие", "", {doName: "inviteMp"});
    //UIMenu.Menu.AddMenuItem("~y~Активировать событие").doName = 'eventActivateMenu';

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        if (item.doName == 'eventActivateMenu')
            menuList.showAdminEventActivateMenu();
        if (item.doName == 'inviteMp')
            mp.events.callRemote('server:admin:inviteMp');
    });
};

menuList.showAdminEventActivateMenu = function() {
    UIMenu.Menu.Create(`ADMIN`, `~b~Админ меню`);

    UIMenu.Menu.AddMenuItem("Крушение вертолёта", "", {eventSmall: 0});
    UIMenu.Menu.AddMenuItem("~y~Деактивировать событие", "", {doName: "deleteEvent"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();
};

menuList.showAdminDevMenu = function() {
    UIMenu.Menu.Create(`ADMIN`, `~b~Админ меню`);

    UIMenu.Menu.AddMenuItem("Сохранить все аккаунты", "", {doName: "saveAllAcc"});
    UIMenu.Menu.AddMenuItem("Сохранить всё", "", {doName: "saveAll"});

    UIMenu.Menu.AddMenuItem("Interior Manager", "", {doName: "interior"});
    UIMenu.Menu.AddMenuItem("Attach Manager", "", {doName: "attach"});

    UIMenu.Menu.AddMenuItem("Debug", "", {doName: "debug"});
    UIMenu.Menu.AddMenuItem("Debug2", "", {doName: "debug2"});
    UIMenu.Menu.AddMenuItem("КоордыCam", "", {doName: "server:user:getCamera"});
    UIMenu.Menu.AddMenuItem("КоордыVeh", "", {doName: "server:user:getVehPos"});
    UIMenu.Menu.AddMenuItem("КоордыNpc", "", {doName: "server:user:getPlayerPosNpc"});
    UIMenu.Menu.AddMenuItem("Коорды", "", {doName: "server:user:getPlayerPos"});
    UIMenu.Menu.AddMenuItem("Коорды2", "", {doName: "server:user:getPlayerPos2"});

    UIMenu.Menu.AddMenuItem("Добавить на счета орг.", "", {doName: "addFraction2"});
    UIMenu.Menu.AddMenuItem("Списать со счета орг.", "", {doName: "removeFraction2"});

    UIMenu.Menu.AddMenuItem("prolog.start", "", {doName: "prolog.start"});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        if (item.doName == 'addFraction2') {
            let fr = methods.parseInt(await UIMenu.Menu.GetUserInput("ID Фракции", "", 15));
            let sum = methods.parseFloat(await UIMenu.Menu.GetUserInput("Сумма", "", 15));
            fraction.addMoney(fr, sum, 'Администратор ' + user.getCache('name'));
        }
        if (item.doName == 'removeFraction2') {
            let fr = methods.parseInt(await UIMenu.Menu.GetUserInput("ID Фракции", "", 15));
            let sum = methods.parseFloat(await UIMenu.Menu.GetUserInput("Сумма", "", 15));
            fraction.removeMoney(fr, sum, 'Администратор ' + user.getCache('name'));
        }
        if (item.doName == 'interior') {
            menuList.showAdminInteriorMenu();
        }
        if (item.doName == 'attach') {
            menuList.showAdminAttachMenu();
        }
        if (item.doName == 'prolog.start') {
            try {
                prolog.start();
            }
            catch (e) {
                methods.debug('Error', e.toString());
                methods.debug(e);
                methods.debug(JSON.stringify(e));
            }
        }
        if (item.doName == 'debug') {
            menuList.showAdminDebugMenu();
        }
        if (item.doName == 'server:user:getPlayerPos') {
            mp.events.callRemote('server:user:getPlayerPos');
        }
        if (item.doName == 'server:user:getPlayerPosNpc') {
            mp.events.callRemote('server:user:getPlayerPosNpc', user.lastAnim.d, user.lastAnim.a, user.lastAnim.f);
        }
        if (item.doName == 'server:user:getCamera') {
            let pos = admin.getCameraPos();
            let rot = admin.getCameraRot();
            if (pos && rot)
                methods.saveFile('camera', `new mp.Vector3(${pos.x}, ${pos.y}, ${pos.z}), new mp.Vector3(${rot.x}, ${rot.y}, ${rot.z})`)
        }
        if (item.doName == 'saveAllAcc') {
            mp.events.callRemote('server:saveAllAcc');
        }
        if (item.doName == 'saveAll') {
            mp.events.callRemote('server:saveAll');
        }
        if (item.doName == 'server:user:getPlayerPos2') {
            let str = await UIMenu.Menu.GetUserInput("Коорды", "", 200);
            mp.events.callRemote('server:user:getPlayerPos2', str);
        }
        if (item.doName == 'server:user:getVehPos') {
            mp.events.callRemote('server:user:getVehPos');
        }
    });
};

menuList.showAdminColorVehMenu = function() {
    UIMenu.Menu.Create(`Admin`, `~b~Цвет ТС`);

    let color1 = 0;
    let color2 = 0;

    let list = [];
    for (let j = 0; j <= 160; j++)
        list.push(j + '');

    UIMenu.Menu.AddMenuItemList("Цвет 1", list, "", {doName: "list1Item"});
    UIMenu.Menu.AddMenuItemList("Цвет 2", list, "", {doName: "list2Item"});
    UIMenu.Menu.AddMenuItemList("Цвет перламутра", list, "", {doName: "list5Item"});
    UIMenu.Menu.AddMenuItemList("Цвет колес", list, "", {doName: "list6Item"});
    UIMenu.Menu.AddMenuItemList("Цвет салона", list, "", {doName: "list7Item"});
    UIMenu.Menu.AddMenuItemList("Цвет приб. панели", list, "", {doName: "list8Item"});

    try {
        if (mp.players.local.vehicle.getLiveryCount() > 1) {
            let list2 = [];
            for (let j = 0; j < mp.players.local.vehicle.getLiveryCount(); j++)
                list2.push(j + '');
            UIMenu.Menu.AddMenuItemList("Livery", list2, "", {doName: "list3Item"});
        }

        let isExtra = false;
        let list3 = [];

        for (let i = 0; i < 10; i++) {
            if (mp.players.local.vehicle.doesExtraExist(i))
                isExtra = true;
        }
        for (let j = 0; j < 10; j++) {
            list3.push(j + '');
        }

        if (isExtra)
            UIMenu.Menu.AddMenuItemList("Extra", list3, "", {doName: "list4Item"});
    }
    catch (e) {

    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnList.Add((item, index) => {
        if ('list3Item' == item.doName) {
            mp.events.callRemote('server:vehicle:setLivery', index);
            return;
        }
        if ('list4Item' == item.doName) {
            vehicles.setExtraState(index);
            return;
        }
        if ('list5Item' == item.doName) {
            mp.events.callRemote('server:vehicle:setColorP', index);
            return;
        }
        if ('list6Item' == item.doName) {
            mp.events.callRemote('server:vehicle:setColorW', index);
            return;
        }
        if ('list7Item' == item.doName) {
            mp.events.callRemote('server:vehicle:setColorI', index);
            return;
        }
        if ('list8Item' == item.doName) {
            mp.events.callRemote('server:vehicle:setColorD', index);
            return;
        }
        if ('list1Item' == item.doName)
            color1 = index;
        if ('list2Item' == item.doName)
            color2 = index;
        mp.events.callRemote('server:vehicle:setColor', color1, color2);
    });
};

menuList.showAdminDebugMenu = function() {
    UIMenu.Menu.Create(`Admin`, `~b~Debug`);

    UIMenu.Menu.AddMenuItemList("Effect", enums.screenEffectList);
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnList.Add((item, index) => {
        user.stopAllScreenEffect();
        mp.game.graphics.startScreenEffect(enums.screenEffectList[index], 0, false);
    });
};

menuList.showAdminTunningMenu = function() {
    UIMenu.Menu.Create(`Admin`, `~b~Tunning`);

    let veh = mp.players.local.vehicle;

    for (let i = 0; i < 100; i++) {
        try {
            if (veh.getNumMods(i) === 0) continue;

            if (veh.getNumMods(i) > 0 && enums.lscNames[i][1] > 0) {
                let label = mp.game.ui.getLabelText(veh.getModSlotName(i));
                if (label == "NULL" || label == "")
                    label = `${enums.lscNames[i][0]}`;

                let list = ['Стандарт'];
                for (let j = 0; j < veh.getNumMods(i); j++)
                    list.push(j + '');

                UIMenu.Menu.AddMenuItemList(`${i}. ${label}`, list,``, {modType: i});
            }
        }
        catch (e) {
            methods.debug(e);
        }
    }

    if (user.isAdmin(5))
        UIMenu.Menu.AddMenuItem("~y~Random", "", {doName: "rand"});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnList.Add((item, idx) => {
        if (item.modType >= 0)
            mp.events.callRemote('server:lsc:showTun', item.modType, idx - 1);
    });
    UIMenu.Menu.OnSelect.Add(item => {
        if (item.doName === 'rand')
            vehicles.setRandomTunning();
        else
            UIMenu.Menu.HideMenu();
    });
};

menuList.showAdminAttachMenu = function() {
    UIMenu.Menu.Create(`Admin`, `~b~Attach`);

    for (const [key, value] of Object.entries(mp.players.local.__attachmentObjects)) {
        UIMenu.Menu.AddMenuItem(key, '', {key: key});
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(item => {
        UIMenu.Menu.HideMenu();
        if (item.key)
            menuList.showAdminAttachInfoMenu(item.key);
    });
};

menuList.showAdminAttachInfoMenu = function(id) {
    UIMenu.Menu.Create(`Admin`, `~b~Attach`);

    let attInfo = mp.attachmentMngr.attachments[id];

    let list = ['-0.01', '0', '0.01'];

    UIMenu.Menu.AddMenuItem('BONE ' + attInfo.boneName, '', {edit: 'bone'});
    UIMenu.Menu.AddMenuItem('MODEL ' + attInfo.model, '', {edit: 'model'});
    UIMenu.Menu.AddMenuItemList('X ' + attInfo.offset.x, list, '', {edit: 'x'});
    UIMenu.Menu.AddMenuItemList('Y ' + attInfo.offset.y, list, '', {edit: 'y'});
    UIMenu.Menu.AddMenuItemList('Z ' + attInfo.offset.z, list, '', {edit: 'z'});
    UIMenu.Menu.AddMenuItemList('RotX ' + attInfo.rotation.x, list, '', {edit: 'rotx'});
    UIMenu.Menu.AddMenuItemList('RotY ' + attInfo.rotation.y, list, '', {edit: 'roty'});
    UIMenu.Menu.AddMenuItemList('RotZ ' + attInfo.rotation.z, list, '', {edit: 'rotz'});

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnList.Add((item, idx) => {
        let offset = 0;
        if (idx === 0)
            offset = -0.01;
        if (idx === 2)
            offset = 0.01;
        if (item.edit === 'x') {
            mp.attachmentMngr.attachments[id].offset.x += offset;
        }
        if (item.edit === 'y') {
            mp.attachmentMngr.attachments[id].offset.y += offset;
        }
        if (item.edit === 'z') {
            mp.attachmentMngr.attachments[id].offset.z += offset;
        }
        if (item.edit === 'rotx') {
            mp.attachmentMngr.attachments[id].rotation.x += offset * 100;
        }
        if (item.edit === 'roty') {
            mp.attachmentMngr.attachments[id].rotation.y += offset * 100;
        }
        if (item.edit === 'rotz') {
            mp.attachmentMngr.attachments[id].rotation.z += offset * 100;
        }
        mp.attachmentMngr.removeLocal(methods.parseInt(id));
        setTimeout(function () {
            mp.attachmentMngr.addLocal(methods.parseInt(id));
        }, 100)
    });

    UIMenu.Menu.OnSelect.Add(async item => {
        UIMenu.Menu.HideMenu();
        if (item.edit === 'bone') {
            let name = await UIMenu.Menu.GetUserInput("bone", "", 50);
            if (name === '')
                return ;
            mp.attachmentMngr.attachments[id].boneName = name;
            menuList.showAdminAttachInfoMenu(id);
        }
        if (item.edit === 'model') {
            let name = await UIMenu.Menu.GetUserInput("model", "", 20);
            if (name === '')
                return ;
            mp.attachmentMngr.attachments[id].model = methods.parseInt(name);
            menuList.showAdminAttachInfoMenu(id);
        }
        if (item.edit === 'x') {
            let name = await UIMenu.Menu.GetUserInput("x", "", 20);
            if (name === '')
                return ;
            mp.attachmentMngr.attachments[id].offset.x = methods.parseFloat(name);
            menuList.showAdminAttachInfoMenu(id);
        }
        if (item.edit === 'y') {
            let name = await UIMenu.Menu.GetUserInput("y", "", 20);
            if (name === '')
                return ;
            mp.attachmentMngr.attachments[id].offset.y = methods.parseFloat(name);
            menuList.showAdminAttachInfoMenu(id);
        }
        if (item.edit === 'z') {
            let name = await UIMenu.Menu.GetUserInput("z", "", 20);
            if (name === '')
                return ;
            mp.attachmentMngr.attachments[id].offset.z = methods.parseFloat(name);
            menuList.showAdminAttachInfoMenu(id);
        }
        if (item.edit === 'rotx') {
            let name = await UIMenu.Menu.GetUserInput("x", "", 20);
            if (name === '')
                return ;
            mp.attachmentMngr.attachments[id].rotation.x = methods.parseFloat(name);
            menuList.showAdminAttachInfoMenu(id);
        }
        if (item.edit === 'roty') {
            let name = await UIMenu.Menu.GetUserInput("y", "", 20);
            if (name === '')
                return ;
            mp.attachmentMngr.attachments[id].rotation.y = methods.parseFloat(name);
            menuList.showAdminAttachInfoMenu(id);
        }
        if (item.edit === 'rotz') {
            let name = await UIMenu.Menu.GetUserInput("z", "", 20);
            if (name === '')
                return ;
            mp.attachmentMngr.attachments[id].rotation.z = methods.parseFloat(name);
            menuList.showAdminAttachInfoMenu(id);
        }
        mp.attachmentMngr.removeLocal(methods.parseInt(id));
        setTimeout(function () {
            mp.attachmentMngr.addLocal(methods.parseInt(id));
        }, 100)
    });
};

menuList.showAdminInteriorMenu = function() {
    UIMenu.Menu.Create(`Admin`, `~b~Interior`);

    enums.interiorProps.forEach(item => {
        UIMenu.Menu.AddMenuItem(item.name, item.ipl, {name: item.name});
    });

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(item => {
        UIMenu.Menu.HideMenu();
        if (item.name)
            menuList.showAdminInteriorInfoMenu(item.name);
    });
};

menuList.showAdminInteriorInfoMenu = function(ipl) {
    UIMenu.Menu.Create(`Admin`, `~b~Interior`);

    enums.interiorProps.forEach(item => {

        if (item.name === ipl) {
            let intId = mp.game.interior.getInteriorAtCoords(item.pos.x, item.pos.y, item.pos.z); //269313
            UIMenu.Menu.AddMenuItem('Телепорт во внутрь', item.ipl, {pos: item.pos});

            if (item.ipl) {
                UIMenu.Menu.AddMenuItemList('Подгрузить IPL', ['Выкл', 'Вкл'], "", {ipl: item.ipl}, mp.game.streaming.isIplActive(item.ipl) ? 1 : 0);
            }

            item.props.forEach(prop => {
                let pItem = {};
                pItem.propName = prop;
                pItem.int = intId;
                UIMenu.Menu.AddMenuItemList(prop, ['Выкл', 'Вкл'], "", pItem, mp.game.interior.isInteriorPropEnabled(intId, prop) ? 1 : 0)

                /*pItem = UIMenu.Menu.AddMenuItemList('Цвет', [0,1,2,3,4,5,6,7,8,9,10], "");
                pItem.propName = prop;
                pItem.int = intId;*/
            });
        }
    });

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnList.Add((item, idx) => {
        if (item.ipl)
        {
            if (idx === 1)
                mp.game.streaming.requestIpl(item.ipl);
            else
                mp.game.streaming.removeIpl(item.ipl);
        }
        else {
            methods.setIplPropState(item.int, item.propName, idx === 1); //269313
            mp.game.invoke(methods.SET_INTERIOR_PROP_COLOR, item.int, item.propName, 1);
            mp.game.invoke('0xC1F1920BAF281317', 269313, 'set_int_02_shell', 1); mp.game.interior.refreshInterior(269313);
            mp.game.interior.refreshInterior(item.int);
        }
    });

    UIMenu.Menu.OnSelect.Add(item => {
        if (item.pos)
            user.teleportv(item.pos);
        else
            UIMenu.Menu.HideMenu();
    });
};

menuList.showAdminClothMenu = function() {
    UIMenu.Menu.Create(`Admin`, `~b~Одежда`);

    let id = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
    let idColor = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];

    let id1 = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
    let idColor1 = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];

    for (let i = 3; i < 12; i++) {
        let list = [];
        for (let j = 0; j <= mp.players.local.getNumberOfDrawableVariations(i); j++)
            list.push(j + '');

        let listColor = [];
        for (let j = 0; j <= 50; j++)
            listColor.push(j + '');

        let list1Item = {};
        list1Item.slotId = i;
        list1Item.type = 0;
        UIMenu.Menu.AddMenuItemList("Слот " + i, list, "", list1Item, mp.players.local.getDrawableVariation(i));

        let list2Item = {};
        list2Item.slotId = i;
        list2Item.type = 1;
        UIMenu.Menu.AddMenuItemList("Цвет " + i, listColor, "", list2Item, mp.players.local.getTextureVariation(i));

        UIMenu.Menu.AddMenuItem(" ");
    }

    for (let i = 0; i < 8; i++) {
        if (i === 3) continue;
        if (i === 4) continue;
        if (i === 5) continue;

        let list = [];
        for (let j = -1; j <= mp.players.local.getNumberOfPropDrawableVariations(i); j++)
            list.push(j + '');

        let listColor = [];
        for (let j = -1; j <= mp.players.local.getNumberOfPropTextureVariations(i, mp.players.local.getPropIndex(i)); j++)
            listColor.push(j + '');

        let list1Item = {};
        list1Item.slotId = i;
        list1Item.type = 2;
        UIMenu.Menu.AddMenuItemList("ПСлот " + i, list, "", list1Item, mp.players.local.getPropIndex(i) + 1);

        let list2Item = {};
        list2Item.slotId = i;
        list2Item.type = 3;
        UIMenu.Menu.AddMenuItemList("ПЦвет " + i, listColor, "", list2Item, mp.players.local.getPropTextureIndex(i) + 1);

        UIMenu.Menu.AddMenuItem(" ");
    }
    UIMenu.Menu.AddMenuItem("~y~Сохранить", "", {doName: "save"});
    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnList.Add(async (item, index) => {
        switch (item.type) {
            case 0:
                id[item.slotId] = index;
                user.setComponentVariation(item.slotId, id[item.slotId], idColor[item.slotId]);
                break;
            case 1:
                idColor[item.slotId] = index;
                user.setComponentVariation(item.slotId, id[item.slotId], idColor[item.slotId]);
                break;
            case 2:
                id1[item.slotId] = index;
                user.setProp(item.slotId, id1[item.slotId], idColor1[item.slotId]);
                break;
            case 3:
                idColor1[item.slotId] = index;
                user.setProp(item.slotId, id1[item.slotId], idColor1[item.slotId]);
                break;
        }
    });
    UIMenu.Menu.OnSelect.Add(async (item, index) => {
        if(item.doName === 'save') {
            let name = await UIMenu.Menu.GetUserInput("Имя", "", 200);
            if (name === '')
                return ;

            UIMenu.Menu.HideMenu();
            methods.saveFile('cloth', '//' + name);

            for (let i = 3; i < 12; i++) {
                await methods.sleep(50);
                methods.saveFile('cloth', `user.setComponentVariation(player, ${i}, ${mp.players.local.getDrawableVariation(i)}, ${mp.players.local.getTextureVariation(i)});`);
            }
            for (let i = 0; i < 8; i++) {
                if (i === 3) continue;
                if (i === 4) continue;
                if (i === 5) continue;
                await methods.sleep(50);
                if (mp.players.local.getPropIndex(i) >= 0)
                    methods.saveFile('cloth', `user.setProp(player, ${i}, ${mp.players.local.getPropIndex(i)}, ${mp.players.local.getPropTextureIndex(i)});`);
            }
            mp.game.ui.notifications.show('Одежда была сохранена');
        }
    });
};

menuList.showAdminGiveItemMenu = function() {
    UIMenu.Menu.Create(`Admin`, `~b~Список предметов`);

    UIMenu.Menu.AddMenuItem("~b~Выдать предмет по ID", "", {doName: "all"});
    let itemList = items.getItemList();
    for (let i = 0; i < itemList.length; i++) {
        if (!items.isCloth(i) && !items.isMask(i))
            UIMenu.Menu.AddMenuItem(`~b~${i}.~s~ ${itemList[i][0]}`, '', {slotId: i});
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(async item => {
        if (item.slotId >= 0) {
            inventory.takeNewItemJust(item.slotId, JSON.stringify({admin: user.getCache('id')}));
            methods.saveLog('log_admin', ['name', 'type', 'do'], [`${user.getCache('name')}`, 'TAKE_ITEM', `${itemList[item.slotId][0]} | ${item.slotId}`]);
        }
        if (item.doName === 'all') {
            UIMenu.Menu.HideMenu();
            let id = await UIMenu.Menu.GetUserInput("ID предмета", "", 5);
            if (id === '')
                return;
            id = methods.parseInt(id);
            inventory.takeNewItemJust(id, JSON.stringify({admin: user.getCache('id')}));
            methods.saveLog('log_admin', ['name', 'type', 'do'], [`${user.getCache('name')}`, 'TAKE_ITEM', `${itemList[id][0]} | ${id}`]);
        }
    });
};

menuList.showAdminMaskMenu = function() {
    UIMenu.Menu.Create(`Admin`, `~b~Маски`);

    UIMenu.Menu.AddMenuItem("~b~Все категории", "", {doName: "all"});
    for (let i = 0; i < enums.maskClasses.length; i++) {
        UIMenu.Menu.AddMenuItem(`${enums.maskClasses[i]}`, '', {slotId: i});
    }

    UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
    UIMenu.Menu.Draw();

    UIMenu.Menu.OnSelect.Add(item => {
        UIMenu.Menu.HideMenu();
        if (item.slotId >= 0) {
            menuList.showAdminMaskListMenu(item.slotId);
        }
        if (item.doName === 'all') {
            menuList.showAdminMaskListMenu(-1);
        }
    });
};

menuList.showAdminMaskListMenu = function(slot) {
    try {

        if (enums.maskList.length < 1)
            return;

        UIMenu.Menu.Create(`Admin`, `~b~Маски`);

        let list = [];
        for (let i = 0; i < enums.maskList.length; i++) {
            let maskItem = enums.maskList[i];

            if (slot >= 0) {
                if (maskItem[0] !== slot)
                    continue;
            }

            //[ClassID, "Name", MaskID, MaxColor, Price, NetCoin, УбратьПричёску, УбратьОчки, УбратьШляпу, УбратьСерьги, СтандартноеЛицо, УбратьСкулы, Скрытность, МагазинID, ШансВыпасть],

            let mItem = {};
            mItem.maskn = methods.removeQuotesAll(maskItem[1]);
            mItem.maskId = maskItem[2];
            mItem.maskColor = maskItem[3];
            mItem.maskHair = maskItem[6];
            mItem.maskGlass = maskItem[7];
            mItem.maskHat = maskItem[8];
            mItem.maskAcc = maskItem[9];
            mItem.maskFaceDef = maskItem[10];
            mItem.maskFace = maskItem[11];
            mItem.maskr = maskItem[14];
            mItem.idxFull = i;
            list.push(mItem);
            UIMenu.Menu.AddMenuItem(`${maskItem[1]}`, `Цена: ~g~${methods.moneyFormat(maskItem[4])}~br~~s~Цена: ~y~${methods.numberFormat(maskItem[5])}nc~br~~s~ID: ${i}`, mItem)
        }

        UIMenu.Menu.AddMenuItem("~r~Закрыть", "", {doName: "closeMenu"});
        UIMenu.Menu.Draw();

        UIMenu.Menu.OnIndexSelect.Add((index) => {
            if (index >= list.length)
                return;
            //user.setComponentVariation(1, list[index].maskId, list[index].maskColor);
            user.set('mask', list[index].idxFull);
            user.set('mask_color', 1);
            user.updateCharacterFace();
            user.updateCharacterCloth();
        });

        UIMenu.Menu.OnSelect.Add(async item => {
            UIMenu.Menu.HideMenu();
            if (item.idxFull >= 0) {
                let str = await UIMenu.Menu.GetUserInput("Имя", "", 200);
                let name = item.maskn;
                if (str !== '')
                    name = str;
                let params = `{"name": "${methods.removeQuotes(methods.removeQuotes2(name))}", "mask": ${item.idxFull}, "desc": "${methods.getRareName(item.maskr)}"}`;
                inventory.addItem(274, 1, inventory.types.Player, user.getCache('id'), 1, 0, params, 100);
            }
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

menuList.hide = function() {
    UIMenu.Menu.HideMenu();
};

menuList.getUserInput = async function(title, value = "", count = 20) {
    return await UIMenu.Menu.GetUserInput(title, value, count);
};

mp.events.add("vSync:playerExitVehicle", (vehId) => {
    UIMenu.Menu.HideMenu();
});

export default menuList;