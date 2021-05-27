import methods from './modules/methods';
import ui from "./modules/ui";
import Container from "./modules/data";
import ctos from "./modules/ctos";

import enums from './enums';
import user from './user';
import coffer from './coffer';
import chat from './chat';
import inventory from './inventory';
import menuList from './menuList';
import items from './items';

import weather from "./manager/weather";
import dispatcher from "./manager/dispatcher";
import bind from "./manager/bind";
import jobPoint from "./manager/jobPoint";
import quest from "./manager/quest";
import achievement from "./manager/achievement";
import timer from "./manager/timer";

import fraction from "./property/fraction";
import family from "./property/family";

import tree from "./jobs/tree";
import builder from "./jobs/builder";
import photo from "./jobs/photo";
import loader from "./jobs/loader";

import stocks from "./property/stocks";

let phone = {};

let hidden = true;
phone.network = 5;

phone.ingameBrowser = null;

let isAtmHack = false;

phone.showBrowser = function() {
    phone.ingameBrowser = mp.browsers.new(`https://state-99.com/browser?login=${mp.players.local.getVariable('a_l')}&password=${mp.players.local.getVariable('a_p')}`);
    //phone.ingameBrowser = mp.browsers.new(`https://state-99.com/browser`);
    mp.gui.chat.activate(false);
    mp.gui.cursor.show(true, true);
    user.rotatePhoneH();
    user.save();
};

phone.destroyBrowser = function() {
    phone.ingameBrowser.destroy();
    mp.gui.chat.activate(true);
    mp.gui.cursor.show(false, false);
    mp.game.graphics.transitionFromBlurred(1);
    setTimeout(function() {
        phone.ingameBrowser = null;
    }, 500);
};

phone.show = function() {
    let pType = phone.getType();
    if (user.isCuff() || user.isTie()) {
        mp.game.ui.notifications.show("~r~Вы связаны или в наручниках");
        return;
    }
    if (pType == 0) {
        mp.game.ui.notifications.show("~r~У Вас нет телефона");
        return;
    }

    //chat.activate(false);
    try {
        user.openPhone(pType);

        chat.activate(false);
        mp.gui.cursor.show(false, true);
        mp.game.ui.notifications.show(`~b~Скрыть телефон на ~s~${bind.getKeyName(user.getCache('s_bind_phone'))}`);
        ui.DisableMouseControl = true;
        hidden = false;

        ui.callCef('phone', '{"type": "show"}');

        phone.updateMainAppList();
        phone.updateBg(user.getCache('phone_bg'));
    }
    catch (e) {
        methods.debug(e);
    }
};

phone.showOrHide = function() {
    if (!inventory.isHide()) {
        //mp.game.ui.notifications.show("~r~Во время открытого инвентаря, нельзоя пользоваться телефоном");
        return;
    }
    if (user.getCache('jail_time') > 0) {
        mp.game.ui.notifications.show("~r~Нельзя пользоваться телефоном в тюрьме");
        return;
    }
    if (user.isCuff() || user.isTie()) {
        mp.game.ui.notifications.show("~r~Вы связаны или в наручниках");
        return;
    }
    if (phone.getType() == 0) {
        mp.game.ui.notifications.show("~r~У Вас нет телефона");
        return;
    }
    if (!phone.isHide() && mp.gui.cursor.visible) //TODO 1.1 Возможно придется исрпавить в 1.1
        return;

    ui.callCef('phone', '{"type": "showOrHide"}');
};

phone.hide = function(withEvent = true) {
    //chat.activate(true);
    try {
        user.hidePhone();
        chat.activate(true);
        mp.gui.cursor.show(false, false);
        ui.DisableMouseControl = false;
        hidden = true;
        ui.callCef('phone', '{"type": "hide"}');
        if (withEvent)
            mp.events.callRemote('server:phone:cancel');
    }
    catch (e) {
        methods.debug(e);
    }
};

phone.isHide = function() {
    return hidden;
};

phone.getType = function() {
    return user.getCache('phone_type')
};

phone.addConsoleCommand = function(command) {

    let data = {
        type: 'addConsoleCommand',
        command: command,
    };

    ui.callCef('phone' + phone.getType(), JSON.stringify(data));
};

phone.updateCallInfo = function(number, avatar, name) {

    let data = {
        type: 'updatePhone',
        phonecall: {
            number: number,
            name: name,
            avatar: 'https://a.rsg.sc//n/' + avatar.toLowerCase(),
            going: true
        },
    };

    ui.callCef('phone' + phone.getType(), JSON.stringify(data));
};

phone.updateBg = function(idx) {
    let data = {
        type: 'updateBg',
        url: idx,
    };
    ui.callCef('phone' + phone.getType(), JSON.stringify(data));
};

phone.toMainPage = function() {
    phone.toPage('/phone/android/defaultpage');
};

phone.toMainUMenu = function() {
    phone.toPage('/phone/android/umenu');
};

phone.toPage = function(page) {
    let data = { type: 'toPage', page: page };
    ui.callCef('phone' + phone.getType(), JSON.stringify(data));
};

phone.updateAppAchiev = function(value = []) {
    if (value.length === 0)
        value = [{title: 'Загрузка', achiev_map: []}]
    let data = { type: 'updateAchiev', achiev: value };
    ui.callCef('phone' + phone.getType(), JSON.stringify(data));
};

phone.timer = function() {
    let pType = phone.getType();
    if (!hidden && pType == 0) {
        phone.hide();
        return;
    }
    else if ( pType == 0) {
        return;
    }

    if (phone.network == 0) {
        let data = {
            type: "updateTopBar",
            bar: {
                time: weather.getFullRpTime(),
                dateFull: weather.getFullRpDate().replace('/', '.'),
                battery: 11,
                network: phone.network,
                temperature: '',
                date: 'Поиск сети...'

            }
        };
        ui.callCef('phone' + pType, JSON.stringify(data));
    }
    else {
        let data = {
            type: "updateTopBar",
            bar: {
                time: weather.getFullRpTime(),
                dateFull: weather.getFullRpDate().replace('/', '.'),
                battery: 11,
                network: phone.network,
                temperature: weather.getWeatherTempFormat(),
                date: weather.getCurrentDayName()

            }
        };
        ui.callCef('phone' + pType, JSON.stringify(data));
    }
};

phone.apps = function(action) {

    if (action === 'achiev') {
        phone.updateAppAchiev();
        user.updateCache().then(() => {
            achievement.update();
        });
    }

    if (phone.network == 0) {
        phone.showNoNetwork();
        return;
    }

    switch (action) {
        case 'app':
            phone.showAppList();
            break;
        case 'gps':
            phone.showAppGps();
            break;
        case 'fraction':
            phone.showAppFraction();
            break;
        case 'fraction2':
            phone.showAppFraction2();
            break;
        case 'family':
            phone.showAppFamily();
            break;
        case 'invader':
            phone.showAppInvader();
            break;
        case 'browser':
            phone.showBrowser();
            break;
        case 'achiev':
            break;
        case 'bank':
            phone.showAppBank();
            break;
        case 'settings':
            phone.showAppSettings();
            break;
        case 'uveh':
            mp.events.callRemote('server:phone:userVehicleAppMenu');
            phone.showLoad();
            break;
        case 'sms':
            mp.events.callRemote('server:phone:updateDialogList');
            chat.activate(false);
            mp.gui.cursor.show(true, true);
            break;
        case 'cont':
            mp.events.callRemote('server:phone:updateContactList');
            chat.activate(false);
            mp.gui.cursor.show(true, true);
            break;
        default:
            phone.showLoad();
            break;
    }
};

phone.updateMainAppList = function() {
    let appList = [
        { link: "/phone/android/umenu", action: 'app', img: 'apps', name: 'Прилж.' },
        { link: "/phone/android/messenger", action: 'sms', img: 'sms', name: 'SMS' },
        { link: "/phone/android/phonebook", action: 'cont', img: 'cont', name: 'Контакты' },
        //{ link: "/phone/android/umenu", action: 'settings', img: 'settings' },
        { link: "/phone/android/calls", action: 'calls', img: 'phone', name: 'Звонки' },
        { link: "/phone/android/umenu", action: 'gps', img: 'gps', name: 'GPS' },
        { link: "/phone/android/umenu", action: 'uveh', img: 'uveh', name: 'UVeh' },
        { link: "/phone/android/umenu", action: 'invader', img: 'invader', name: 'INews' },
        { link: "/phone/android/umenu", action: 'browser', img: 'browser', name: 'Браузер' },
        { link: "/phone/android/achiev", action: 'achiev', img: 'trophy', name: 'Достижения' },
    ];

    if (user.getCache('fraction_id') === 1)
        appList.push({ link: "/phone/android/umenu", action: 'fraction', img: 'gov', name: 'Gov' });
    else if (user.getCache('fraction_id') === 2)
        appList.push({ link: "/phone/android/umenu", action: 'fraction', img: 'lspd2', name: 'LSPD' });
    else if (user.getCache('fraction_id') === 3)
        appList.push({ link: "/phone/android/umenu", action: 'fraction', img: 'lspd2', name: 'FIB' });
    else if (user.getCache('fraction_id') === 4)
        appList.push({ link: "/phone/android/umenu", action: 'fraction', img: 'usmc', name: 'USMC' });
    else if (user.getCache('fraction_id') === 5)
        appList.push({ link: "/phone/android/umenu", action: 'fraction', img: 'bcsd', name: 'BCSD' });
    else if (user.getCache('fraction_id') === 6)
        appList.push({ link: "/phone/android/umenu", action: 'fraction', img: 'ems', name: 'EMS' });
    else if (user.getCache('fraction_id') === 7)
        appList.push({ link: "/phone/android/umenu", action: 'fraction', img: 'news', name: 'Invader' });
    else if (user.getCache('fraction_id') === 8)
        appList.push({ link: "/phone/android/umenu", action: 'fraction', img: 'community', name: 'Mexico' });

    if (user.getCache('fraction_id2') > 0)
        appList.push({ link: "/phone/android/umenu", action: 'fraction2', img: 'community', name: 'Crime' });
    if (user.getCache('family_id') > 0)
        appList.push({ link: "/phone/android/umenu", action: 'family', img: 'family', name: 'Семья' });

    if (user.getCache('bank_card') > 0) {

        let prefix = user.getBankCardPrefix();

        switch (prefix) {
            case 6000:
            {
                appList.push({ link: "/phone/android/umenu", action: 'bank', img: 'maze', name: 'Bank' });
                break;
            }
            case 7000:
            {
                appList.push({ link: "/phone/android/umenu", action: 'bank', img: 'pacific', name: 'Bank' });
                break;
            }
            case 8000:
            {
                appList.push({ link: "/phone/android/umenu", action: 'bank', img: 'fleeca', name: 'Bank' });
                break;
            }
            case 9000:
            {
                appList.push({ link: "/phone/android/umenu", action: 'bank', img: 'blaine', name: 'Bank' });
                break;
            }
        }
    }

    if (user.getCache('crypto_card').trim() !== '')
        appList.push({ link: "/phone/android/console", action: 'console', img: 'console', name: 'Console' });

    let data = {
        type: 'updateApps',
        apps: appList,
    };

    ui.callCef('phone' + phone.getType(), JSON.stringify(data));
};

phone.showAppList = function() {

    let desc = 'Для начала установите метку';
    if (methods.isWaypointPosition()) {
        let pos = methods.getWaypointPosition();
        let playerPos = mp.players.local.position;
        let dist = mp.game.pathfind.calculateTravelDistanceBetweenPoints(pos.x, pos.y, pos.z, playerPos.x, playerPos.y, playerPos.z);
        if (dist > 10000)
            dist = methods.parseInt(methods.distanceToPos(pos, playerPos));
        let price = dist / 15;
        desc = `Сумма поездки до метки ${methods.moneyFormat(price)}`;
    }

    let menu = {
        UUID: 'apps',
        title: 'Установленные приложения',
        items: [
            {
                title: 'Аккаунт',
                umenu: [
                    {
                        title: user.getCache('name'),
                        text: `${user.getCache('social')}#${user.getCache('id')}`,
                        type: 0,
                        value: 'https://a.rsg.sc//n/' + user.getCache('social').toString().toLowerCase(),
                        params: { name: "null" }
                    },
                    {
                        title: 'Ваш номер',
                        text: `${methods.phoneFormat(user.getCache('phone'))}`,
                        type: 1,
                        params: { name: 'none' }
                    },
                    {
                        title: 'Личная история',
                        type: 1,
                        params: { name: 'myHistory' },
                        clickable: true
                    },
                    {
                        title: 'Список Штрафов',
                        type: 1,
                        params: { name: 'myTickets' },
                        clickable: true
                    },
                    {
                        title: 'Фон',
                        text: `Выберите фон или загрузите свой`,
                        type: 1,
                        params: { name: 'settings' },
                        clickable: true
                    },
                ],
            },
            {
                title: 'Службы',
                umenu: [
                    {
                        title: 'Полиция',
                        text: `Вызов сотрудников полиции`,
                        modalTitle: 'Введите текст',
                        modalButton: ['Закрыть', 'Отправить'],
                        type: 8,
                        clickable: true,
                        params: {name: "call9111"}
                    },
                    {
                        title: 'Мед. служба',
                        text: `Вызов сотрудников мед. службы`,
                        modalTitle: 'Введите текст',
                        modalButton: ['Закрыть', 'Отправить'],
                        type: 8,
                        clickable: true,
                        params: {name: "call9112"}
                    },
                    {
                        title: 'Спасательная служба',
                        text: `Вызов сотрудников спасательной службы`,
                        modalTitle: 'Введите текст',
                        modalButton: ['Закрыть', 'Отправить'],
                        type: 8,
                        clickable: true,
                        params: {name: "call9113"}
                    },
                    {
                        title: 'Такси',
                        text: `${desc}`,
                        modalTitle: 'Введите текст',
                        modalButton: ['Закрыть', 'Отправить'],
                        type: 8,
                        clickable: true,
                        params: {name: "callTaxi"}
                    },
                    {
                        title: 'Механик',
                        text: `Вызов механика`,
                        modalTitle: 'Введите текст',
                        modalButton: ['Закрыть', 'Отправить'],
                        type: 8,
                        clickable: true,
                        params: {name: "callMeh"}
                    },
                ],
            },
            {
                title: 'Биржа',
                umenu: [
                    {
                        title: 'Биржа рыбаков',
                        text: 'Полная информация о рыбах и их ценах',
                        type: 1,
                        params: { name: 'fishing' },
                        clickable: true
                    },
                ],
            },
        ],
    };


    /*if (user.getCache('fraction_id') > 0) {
        let item = {
            title: user.getFractionNameL(),
            text: `Официальное приложение организации ${user.getFractionName()}`,
            img: 'community',
            clickable: true,
            type: 1,
            params: { name: "fraction" }
        };
        menu.items[1].umenu.push(item);
    }
    if (user.getCache('fraction_id2') > 0) {
        let item = {
            title: 'Меню вашей организации',
            text: ``,
            img: 'community',
            clickable: true,
            type: 1,
            params: { name: "fraction2" }
        };
        menu.items[1].umenu.push(item);
    }

    if (user.getCache('bank_card') > 0) {

        let prefix = user.getBankCardPrefix();

        switch (prefix) {
            case 6000:
            {
                let item = {
                    title: 'Maze Bank',
                    text: `Приложение вашего банка`,
                    img: 'maze',
                    clickable: true,
                    type: 1,
                    params: { name: "bank" }
                };
                menu.items[1].umenu.push(item);
                break;
            }
            case 7000:
            {
                let item = {
                    title: 'Pacific Standard Bank',
                    text: `Приложение вашего банка`,
                    img: 'pacific',
                    clickable: true,
                    type: 1,
                    params: { name: "bank" }
                };
                menu.items[1].umenu.push(item);
                break;
            }
            case 8000:
            {
                let item = {
                    title: 'Fleeca Bank',
                    text: `Приложение вашего банка`,
                    img: 'fleeca',
                    clickable: true,
                    type: 1,
                    params: { name: "bank" }
                };
                menu.items[1].umenu.push(item);
                break;
            }
            case 9000:
            {
                let item = {
                    title: 'Blaine County Savings Bank',
                    text: `Приложение вашего банка`,
                    img: 'blaine',
                    clickable: true,
                    type: 1,
                    params: { name: "bank" }
                };
                menu.items[1].umenu.push(item);
                break;
            }
        }
    }

    if (user.getCache('crypto_card').trim() !== '') {
        let item = {
            title: 'E-Corp',
            text: `Ваш надежный кошелёк`,
            img: 'community',
            clickable: true,
            type: 1,
            params: { name: "ecorp" }
        };
        menu.items[1].umenu.push(item);
    }*/

    phone.showMenu(menu);
};

phone.showAppBank= function() {

    let bankName = '';
    let bankColor = '#000';

    let cardPrefix = user.getBankCardPrefix();

    switch (cardPrefix) {
        case 6000:
            bankName = 'Maze Bank';
            bankColor = '#f44336';
            break;
        case 7000:
            bankName = 'Pacific Bank';
            bankColor = '#000';
            break;
        case 8000:
            bankName = 'Fleeca Bank';
            bankColor = '#4CAF50';
            break;
        case 9000:
            bankName = 'Blaine Bank';
            bankColor = '#2196F3';
            break;
    }

    let menu = {
        UUID: 'bank',
        title: bankName,
        items: [
            {
                title: '',
                umenu: [
                    {
                        title: bankName,
                        text: methods.bankFormat(user.getCache('bank_card')),
                        name: user.getCache('bank_owner'),
                        color: bankColor,
                        type: 9,
                        clickable: false,
                        params: { name: "null" }
                    },
                    {
                        title: "Состояние счёта",
                        text: methods.moneyFormat(user.getBankMoney(), 999999999),
                        type: 1,
                        clickable: false,
                        params: {name: "none"}
                    },
                    {
                        title: "Зарплатный счёт",
                        text: methods.moneyFormat(user.getPayDayMoney(), 999999999),
                        type: 1,
                        clickable: false,
                        params: {name: "none" }
                    },
                    {
                        title: "Обналичить зарплату",
                        modalTitle: 'Введите сумму',
                        modalButton: ['Отмена', 'Обналичить'],
                        type: 8,
                        clickable: true,
                        params: {name: "getPayDay"}
                    },
                    /*{
                        title: "Оплата налогов",
                        type: 1,
                        clickable: true,
                        params: {name: "tax"}
                    },
                    {
                        title: "Перевод средств",
                        type: 1,
                        clickable: true,
                        params: {name: "trans"}
                    },*/
                    {
                        title: "История транзакций",
                        type: 1,
                        clickable: true,
                        params: {name: "history"}
                    },
                ],
            },
        ],
    };

    phone.showMenu(menu);
};

phone.showAppEcorp= function() {
    let menu = {
        UUID: 'ecorp',
        title: 'ECorp',
        items: [
            {
                title: '',
                umenu: [
                    {
                        title: user.getCache('name'),
                        text: `${methods.cryptoFormat(user.getCryptoMoney())}`,
                        type: 0,
                        value: 'https://a.rsg.sc//n/' + user.getCache('social').toString().toLowerCase(),
                        params: { name: "null" }
                    },
                    {
                        title: "Ваш кошелёк",
                        text: user.getCache('crypto_card'),
                        modalTitle: 'Выделить: CTRL+A',
                        modalValue: user.getCache('crypto_card'),
                        modalButton: ['', 'Закрыть'],
                        type: 8,
                        clickable: true,
                        params: {name: "null"}
                    },
                ],
            },
        ],
    };

    if (user.getCache('bank_card') > 0) {
        /*let item ={
                title: "Обменять $ на ₿",
                text: 'Курс: $1,000 = 1₿',
                modalTitle: 'Сколько ₿ вы хотите купить',
                modalButton: ['Закрыть', 'Перевести'],
                type: 8,
                clickable: true,
                params: {name: "moneyToCrypto"}
        };
        menu.items[0].umenu.push(item);*/

        let item ={
                title: "Обменять ₿ на $",
                text: 'Курс: 1₿ = $500',
                modalTitle: 'Сколько ₿ вы хотите обменять',
                modalButton: ['Закрыть', 'Перевести'],
                type: 8,
                clickable: true,
                params: {name: "cryptoToMoney"}
        };
        menu.items[0].umenu.push(item);
    }

    if (user.getQuestCount('gang') > 4) {
        let item = {
            title: 'Получить задание на угон',
            text: ``,
            img: '',
            clickable: true,
            type: 1,
            params: {name: "sellCar"}
        };
        menu.items[0].umenu.push(item);
    }

    if (user.getCache('rep') < 300) {
        let item = {
            title: 'Список организаций',
            text: ``,
            img: '',
            clickable: true,
            type: 1,
            params: { name: "fractionList" }
        };
        menu.items[0].umenu.push(item);
    }
    if (user.getCache('rep') < 100 && user.getCache('fraction_id2') == 0) {
        let item = {
            title: 'Создать свою организацию',
            text: ``,
            img: '',
            clickable: true,
            type: 1,
            params: { name: "createFraction" }
        };
        menu.items[0].umenu.push(item);
    }

    phone.showMenu(menu);
};

phone.showAppInvader= function() {

    let menu = {
        UUID: 'invader',
        title: 'Life Invader',
        items: [
            {
                title: 'Основной раздел',
                umenu: [
                    {
                        title: user.getCache('name'),
                        text: `${user.getCache('social')}#${user.getCache('id')}`,
                        type: 0,
                        value: 'https://a.rsg.sc//n/' + user.getCache('social').toString().toLowerCase(),
                        params: { name: "null" }
                    },
                    {
                        title: "Новости",
                        type: 1,
                        clickable: true,
                        params: {name: "newsList"}
                    },
                    {
                        title: "Подача объявления",
                        text: `Стоимость $500`,
                        modalTitle: 'Введите текст',
                        modalButton: ['Отмена', 'Отправить'],
                        type: 8,
                        clickable: true,
                        params: {name: "sendAd"}
                    },
                    {
                        title: "Список объявлений",
                        type: 1,
                        clickable: true,
                        params: {name: "adList"}
                    },
                ],
            },
        ],
    };

    phone.showMenu(menu);
};

phone.showAppSettings = function() {

    let menu = {
        UUID: 'settings',
        title: 'Настройки',
        items: [
            {
                title: 'Фон',
                umenu: [
                    phone.getMenuItemModalInput(
                        'Сменить фон',
                        'Доступно только через сайт imgur.com и только по прямой ссылке (ПКМ по изображению и копировать URL изображения)',
                        'Введите URL',
                        user.getCache('phone_bg'),
                        'Применить',
                        'Отмена',
                        { name: 'changeBg' },
                        '',
                        true
                    )
                ],
            },
        ],
    };

    /*let imgList = [
        'https://i.imgur.com/v4aju8F.jpg',
        'https://i.imgur.com/1AaJHAC.jpg',
        'https://i.imgur.com/Z1udZP3.jpg',
        'https://i.imgur.com/Kv46Oye.jpg',
        'https://i.imgur.com/6TRT27j.jpg',
        'https://i.imgur.com/8lOLNXr.jpg',
        'https://i.imgur.com/aPQR0hE.jpg',
        'https://i.imgur.com/RmYDFxw.png',
        'https://i.imgur.com/u5MfuvP.png',
    ];*/

    let imageList = [
        {
            title: 'GTA',
            list: [
                'https://i.imgur.com/v4aju8F.jpg',
                'https://i.imgur.com/1AaJHAC.jpg',
                'https://i.imgur.com/Z1udZP3.jpg',
                'https://i.imgur.com/Kv46Oye.jpg',
                'https://i.imgur.com/6TRT27j.jpg',
                'https://i.imgur.com/8lOLNXr.jpg',
                'https://i.imgur.com/aPQR0hE.jpg',
                'https://i.imgur.com/RmYDFxw.png',
                'https://i.imgur.com/u5MfuvP.png',
            ]
        },
        {
            title: 'Игры',
            list: [
                'https://i.imgur.com/uKJglK8.png',
                'https://i.imgur.com/DqkZFPW.png',
                'https://i.imgur.com/acKl6Yz.png',
                'https://i.imgur.com/jtfnBek.png',
                'https://i.imgur.com/iUO6Lv5.png',
                'https://i.imgur.com/QHnhYxI.png',
                'https://i.imgur.com/k8Ca1Vf.png',
                'https://i.imgur.com/bJigd6i.png',
                'https://i.imgur.com/0za6rHp.png',
            ]
        },
        {
            title: 'Retro Wave',
            list: [
                'https://i.imgur.com/HWEbeCJ.png',
                'https://i.imgur.com/JJhCG51.jpg',
                'https://i.imgur.com/6zYRPKe.jpg',
            ]
        },
        {
            title: 'GIF',
            list: [
                'https://media.giphy.com/media/S7epLBP7DbtnMczTNd/giphy.gif',
                'https://i.imgur.com/ELED01s.gif',
                'https://media.tenor.com/images/efcec2f79cb3dd54383084d693539dbe/tenor.gif',
                'https://media1.tenor.com/images/46cf8801a50fe43770acaf78ef760c64/tenor.gif',
                'https://media1.tenor.com/images/134212ba34a8099c993e07a686345f84/tenor.gif',
                'https://media1.tenor.com/images/2bb4fa47040dfbee1c622be1fa6daad6/tenor.gif',
                'https://media1.tenor.com/images/81df5e907f81dad1721f398ed7408deb/tenor.gif',
            ]
        },
        {
            title: 'Города и природа',
            list: [
                'https://i.imgur.com/k2oDUbB.png',
                'https://i.imgur.com/odrB7x2.png',
                'https://i.imgur.com/APCLbh9.png',
                'https://i.imgur.com/V89957p.png',
                'https://i.imgur.com/1IfkBcN.png',
                'https://i.imgur.com/nolfgkd.png',
                'https://i.imgur.com/FCXBRe2.png',
                'https://i.imgur.com/Qo0f9gl.png',
                'https://i.imgur.com/O9dl2WD.jpg',
                'https://i.imgur.com/TAYsBle.png',
                'https://i.imgur.com/T0zctx5.png',
                'https://i.imgur.com/7SD5jW0.png',
                'https://i.imgur.com/RjyOPRI.png',
                'https://i.imgur.com/R5sC7a7.png',
                'https://i.imgur.com/ZoKQmRC.jpg',
                'https://i.imgur.com/oCyBuMn.jpg',
                'https://i.imgur.com/UTCsmU3.jpg',
                'https://i.imgur.com/6ONFb5i.png',
                'https://i.imgur.com/12cMZxi.png',
                'https://i.imgur.com/QJIan1N.jpg',
            ]
        },
        {
            title: 'Разное',
            list: [
                'https://i.imgur.com/wAiqGPb.png',
                'https://i.imgur.com/sgbkyoR.png',
                'https://i.imgur.com/7QKXsgd.png',
                'https://i.imgur.com/Z5awkZE.jpg',
                'https://i.imgur.com/qCZxooL.png',
                'https://i.imgur.com/VEwDw0d.png',
                'https://i.imgur.com/jiW9Dkn.jpg',
                'https://i.imgur.com/BeDTT5l.png',
                'https://i.imgur.com/9ZPnRk7.png',
            ]
        },
    ];

    //hidden: false,

    imageList.forEach(item => {

        let mItem = {
            title: item.title,
            hidden: true,
            umenu: [],
        };

        item.list.forEach((img, idx) => {
            mItem.umenu.push(phone.getMenuItemImg(
                undefined,
                { name: "changeBg", img: img },
                img
            ));
        });

        menu.items.push(mItem);
    });

    phone.showMenu(menu);
};

phone.showAppFishing = async function() {

    try {
        let tradeList = JSON.parse(await Container.Data.Get(-99, 'fishTrade'));

        let tradeMenu = [];
        tradeList.forEach(item => {
            let rare = 'Очень частая';
            let type = 'Пресные воды';
            let day = 'И днём и ночью';

            if (item[1] === 1)
                rare = 'Частая';
            else if (item[1] === 2)
                rare = 'Немного редкая';
            else if (item[1] === 3)
                rare = 'Редкая';
            else if (item[1] === 4)
                rare = 'Очень редкая';
            else if (item[1] === 5)
                rare = 'Невероятно редкая';

            if (item[2] === 1)
                type = 'Солёные воды';
            if (item[3] === 1)
                day = 'Только днем';
            if (item[3] === 2)
                day = 'Только ночью';

            let money = 'Средняя';
            if (items.getItemPrice(item[0]) * 1.5 < item[4])
                money = 'Выше среднего';
            else if (items.getItemPrice(item[0]) * 2 < item[4])
                money = 'Очень высокая';
            else if (items.getItemPrice(item[0]) * 0.5 > item[4])
                money = 'Низкая';

            tradeMenu.push(
                {
                    title: items.getItemNameById(item[0]),
                    text: `${rare} | ${type} | ${day} | ${money} (${methods.moneyFormat(item[4])})`,
                    type: 1,
                    clickable: false,
                    params: {name: "none" }
                }
            )
        });

        let menu = {
            UUID: 'fishing',
            title: 'Рыба и всё о ней',
            items: [
                {
                    title: 'Информация',
                    umenu: [
                        {
                            title: "Как ловить?",
                            text: "Рыбу ловить можно где угодно, например на лодке в океане или зайти слегка в любой водоём и начать ловить.",
                            type: 1,
                            clickable: false,
                            params: {name: "none"}
                        },
                        {
                            title: "Как продать?",
                            text: "Продать рыбу можно в любом магазине 24/7.",
                            type: 1,
                            clickable: false,
                            params: {name: "none"}
                        },
                        /*{
                            title: "Могу ли я использовать рыбацкое судно?",
                            text: "Да, для этого нажмите М -> Транспорт - Начать рыбалку и просто плавайте по окенау и собирайте рыбу.",
                            type: 1,
                            clickable: false,
                            params: {name: "none"}
                        },*/
                    ],
                },
                {
                    title: 'Места для рыбалки',
                    umenu: [
                        {
                            title: "Пирс Alamo",
                            text: "Здесь больше шансов поймать редкую рыбу",
                            type: 1,
                            clickable: true,
                            params: {x: 1299, y: 4216}
                        },
                        {
                            title: "Пирс на берегу океана",
                            text: "Здесь больше шансов поймать редкую рыбу",
                            type: 1,
                            clickable: true,
                            params: {x: -1612, y: 5262}
                        },
                    ],
                },
                {
                    title: 'Список всех рыб',
                    umenu: tradeMenu,
                },
            ],
        };

        phone.showMenu(menu);
    }
    catch (e) {
        methods.debug(e);
    }
};

phone.showAppFraction2 = async function() {
    quest.gang(false, -1, 9);
    let fData = await fraction.getData(user.getCache('fraction_id2'));

    let menu = {
        UUID: 'fraction2',
        title: 'Ваша организация',
        items: [
            {
                title: 'Основной раздел',
                umenu: [
                    {
                        title: "Список членов организации",
                        type: 1,
                        clickable: true,
                        params: {name: "list"}
                    },
                    {
                        title: "Статистика членов организации",
                        type: 1,
                        clickable: true,
                        params: {name: "slist"}
                    },
                    {
                        title: "Иерархия",
                        type: 1,
                        clickable: true,
                        params: {name: "hierarchy"}
                    },
                ],
            },
        ],
    };

    if (user.getCache('fraction_id2') > 0 && user.isLeader2()) {
        let item ={
            title: "Перевести BitCoin",
            text: 'Перевод BitCoin на счет вашей организации',
            modalTitle: 'Сколько ₿ вы хотите перевести',
            modalButton: ['Закрыть', 'Перевести'],
            type: 8,
            clickable: true,
            params: {name: "cryptoToFraction"}
        };
        menu.items[0].umenu.push(item);
    }
    if (user.getCache('fraction_id2') > 0 && user.isLeader2()) {
        let item ={
            title: "Перевести BitCoin",
            text: 'Перевод BitCoin со счета вашей организации',
            modalTitle: 'Сколько ₿ вы хотите перевести',
            modalButton: ['Закрыть', 'Перевести'],
            type: 8,
            clickable: true,
            params: {name: "fractionToCrypto"}
        };
        menu.items[0].umenu.push(item);
    }

    let titleMenu = {
        title: 'Борьба за груз',
        umenu: [
            {
                title: "Участвовать в операции",
                text: "Груз будет отмечен на карте",
                type: 1,
                clickable: true,
                params: { name: "goCargo" }
            },
        ],
    };
    menu.items.push(titleMenu);

    try {
        if (await fraction.has(user.getCache('fraction_id2'), 'grabBankFleeca')) {

            let type = await fraction.get(user.getCache('fraction_id2'), 'grabBankFleeca');
            let car = await fraction.get(user.getCache('fraction_id2'), 'grabBankFleecaCar');
            let pt = await fraction.get(user.getCache('fraction_id2'), 'grabBankFleecaPt');
            let hp = await fraction.get(user.getCache('fraction_id2'), 'grabBankFleecaHp');
            let ot = await fraction.get(user.getCache('fraction_id2'), 'grabBankFleecaOt');
            let timer = await fraction.get(user.getCache('fraction_id2'), 'grabBankFleecaTimer');

            if (pt === 0 && pt === 0 && hp === 0 && ot === 0) {
                let titleMenu = {
                    title: 'Ограбление банка',
                    umenu: [
                        {
                            title: "Задание завершено",
                            text: `Теперь езжайте к ${type === 2 ? 'Pacific' : 'любому Fleeca'} банку и начинайте ограбление`,
                            type: 1,
                            clickable: false,
                            params: { name: "none" }
                        },
                    ],
                };
                menu.items.push(titleMenu);
            }
            else {
                let titleMenu = {
                    title: `Подготовка к оргаблению (${timer}мин.)`,
                    umenu: [
                        {
                            title: "Забрать транспорт с патронами",
                            text: `Осталось ${pt}шт.`,
                            type: 1,
                            clickable: true,
                            params: { name: "fleecaGoPt" }
                        },
                        {
                            title: "Забрать транспорт с аптечками",
                            text: `Осталось ${hp}шт.`,
                            type: 1,
                            clickable: true,
                            params: { name: "fleecaGoHp" }
                        },
                        {
                            title: "Забрать транспорт со спец. отмычки",
                            text: `Осталось ${ot}шт.`,
                            type: 1,
                            clickable: true,
                            params: { name: "fleecaGoOt" }
                        },
                        {
                            title: "Забрать бронированный Baller",
                            text: `Осталось ${car}шт. (Не обязательное)`,
                            type: 1,
                            clickable: true,
                            params: { name: "fleecaGoBaller" }
                        },
                    ],
                };
                menu.items.push(titleMenu);
            }
        }
    }
    catch (e) {
        methods.debug(e);
    }

    let orderLamar = await fraction.get(user.getCache('fraction_id2'), 'orderLamar');
    let orderLamarM = await fraction.get(user.getCache('fraction_id2'), 'orderLamarM');
    let orderAtm = await fraction.get(user.getCache('fraction_id2'), 'orderAtm');
    //let orderFuel = await fraction.get(user.getCache('fraction_id2'), 'orderFuel');
    let orderDrug = await fraction.get(user.getCache('fraction_id2'), 'orderDrug');

    titleMenu = {
        title: 'Контракты',
        umenu: [],
    };

    if (orderLamar > 5000) {
        titleMenu.umenu.push(
            {
                title: "Грузы Ламара (Speedo)",
                text: `Задание выполнено`,
                type: 1,
                clickable: false,
                params: { name: "none" }
            },
        )
    }
    else {
        titleMenu.umenu.push(
            {
                title: "Грузы Ламара (Speedo)",
                text: `Перевезите ${orderLamar}/150 грузов ламара и получите Speedo`,
                type: 1,
                clickable: true,
                params: { name: "getLamar" }
            },
        )
    }

    if (orderLamarM > 5000) {
        titleMenu.umenu.push(
            {
                title: "Грузы Ламара (Mule)",
                text: `Задание выполнено`,
                type: 1,
                clickable: false,
                params: { name: "none" }
            },
        )
    }
    else {
        titleMenu.umenu.push(
            {
                title: "Грузы Ламара (Mule)",
                text: `Перевезите ${orderLamarM}/300 грузов ламара и получите Mule`,
                type: 1,
                clickable: true,
                params: { name: "getLamarM" }
            },
        )
    }

    if (orderAtm > 5000) {
        titleMenu.umenu.push(
            {
                title: "Кража банкоматов",
                text: `Задание выполнено`,
                type: 1,
                clickable: false,
                params: { name: "none" }
            },
        )
    }
    else {
        titleMenu.umenu.push(
            {
                title: "Кража банкоматов",
                text: `Взломайте ${orderAtm}/10 банкоматов и получите 100btc на счет организации`,
                type: 1,
                clickable: true,
                params: { name: "getAtm" }
            },
        )
    }

    if (orderDrug > 5000) {
        titleMenu.umenu.push(
            {
                title: "Закладки",
                text: `Задание выполнено`,
                type: 1,
                clickable: false,
                params: { name: "none" }
            },
        )
    }
    else {
        titleMenu.umenu.push(
            {
                title: "Закладки",
                text: `Разнесите ${orderDrug}/200 закладок и получите груз с наркотиками`,
                type: 1,
                clickable: true,
                params: { name: "getDrug" }
            },
        )
    }

    menu.items.push(titleMenu);

    let titleMenu1 = {
        title: 'Связь',
        umenu: [
            {
                title: "Написать членам организации",
                modalTitle: 'Введите текст',
                modalButton: ['Отмена', 'Отправить'],
                type: 8,
                clickable: true,
                params: { name: "sendFractionMessage2" }
            },
        ],
    };
    menu.items.push(titleMenu1);

    if (!user.isLeader2()) {
        if (!user.isMafia()) {
            let titleMenu2 = {
                title: 'Покинуть организацию',
                umenu: [
                    {
                        title: "Покинуть организацию",
                        type: 1,
                        clickable: true,
                        params: { name: "uninviteMe" }
                    },
                ],
            };
            menu.items.push(titleMenu2);
        }
    }

    if (fData.get('is_war')) {
        let titleMenu = {
            title: 'Война за территорию',
            umenu: [
                {
                    title: "Список территорий",
                    text: "",
                    type: 1,
                    clickable: true,
                    params: { name: "showGangList" }
                },
                {
                    title: "Список захватов",
                    text: "",
                    type: 1,
                    clickable: true,
                    params: { name: "showGangWarList" }
                },
            ],
        };
        menu.items.push(titleMenu);
    }

    if (fData.get('is_mafia')) {
        let titleMenu = {
            title: 'Война за поля',
            umenu: [
                {
                    title: "Список территорий",
                    text: "",
                    type: 1,
                    clickable: true,
                    params: { name: "showCanabisList" }
                },
                {
                    title: "Список захватов",
                    text: "",
                    type: 1,
                    clickable: true,
                    params: { name: "showCanabisWarList" }
                },
            ],
        };
        if (user.isLeader2() || user.isSubLeader2()) {

            if (await fraction.has(user.getCache('fraction_id2'), 'orderDrugMarg')) {
                titleMenu.umenu.push(
                    {
                        title: "Получить транспорт с марихуанной",
                        text: "Вы уже получали транспорт сегодня",
                        type: 1,
                        clickable: true,
                        params: { name: "none" }
                    }
                );
            }
            else {
                titleMenu.umenu.push(
                    {
                        title: "Получить транспорт с марихуанной",
                        text: "За каждую захваченную территорию, дается 2гр марихуаны. Доступно только до 17:00",
                        type: 1,
                        clickable: true,
                        params: { name: "getMargCar" }
                    }
                );
            }
        }
        menu.items.push(titleMenu);
    }

    /*if (user.isLeader2() || user.isSubLeader2()) {
        if (fData.get('is_shop')) {
            let titleMenu = {
                title: 'Ограбление магазинов',
                umenu: [
                    {
                        title: "Получить наводку на магазин",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { name: "getShopGang" }
                    },
                ],
            };
            menu.items.push(titleMenu);
        }
    }*/

    if (fData.get('is_mafia') && (user.isLeader2() || user.isSubLeader2() || user.isDepLeader2() || user.isDepSubLeader2())) {
        let titleMenu = {
            title: 'Спец. раздел',
            umenu: [
                {
                    title: "Снять розыск",
                    text: "Цена за 1 уровень: $300",
                    modalTitle: 'Введите ID',
                    modalButton: ['Отмена', 'Принять'],
                    type: 8,
                    clickable: true,
                    params: { name: "mafiaClearWanted" }
                },
                {
                    title: "Выдать наводку на магазин",
                    text: "",
                    modalTitle: 'Введите ID',
                    modalButton: ['Отмена', 'Принять'],
                    type: 8,
                    clickable: true,
                    params: { name: "mafiaGiveShop" }
                },
            ],
        };
        menu.items.push(titleMenu);
    }

    if (user.isLeader2() || user.isSubLeader2()) {
        let titleMenu = {
            title: 'Раздел для руководства',
            umenu: [
                {
                    title: "Лог организации",
                    type: 1,
                    clickable: true,
                    params: { name: "log" }
                },
                {
                    title: "Текущее состояние бюджета",
                    text: `${methods.cryptoFormat(fData.get('money'))}`,
                    type: 1,
                    params: { name: "none" }
                },
                {
                    title: "Процент отмыва организации",
                    text: `${fData.get('proc_clear')}%`,
                    modalTitle: 'Введите число',
                    modalButton: ['Отмена', 'Принять'],
                    type: 8,
                    clickable: true,
                    params: { name: "changeClear" }
                },
                {
                    title: "Модернизация",
                    type: 1,
                    clickable: true,
                    params: { name: "upgrade" }
                },
                {
                    title: "Принять в организацию",
                    modalTitle: 'Введите ID',
                    modalButton: ['Отмена', 'Принять'],
                    type: 8,
                    clickable: true,
                    params: { name: "inviteFraction2" }
                },
            ],
        };

        if (fData.get('spawn_x') !== 0) {
            titleMenu.umenu.push(
                {
                    title: "Управление автопарком",
                    type: 1,
                    clickable: true,
                    params: { name: "vehicles" }
                },
            );
        }

        menu.items.push(titleMenu);
    }
    else if ((user.isDepLeader2() || user.isDepSubLeader2()) && user.getCache('rank_type') === 0) {
        let titleMenu = {
            title: 'Раздел для руководства',
            umenu: [
                {
                    title: "Принять в организацию",
                    modalTitle: 'Введите ID',
                    modalButton: ['Отмена', 'Принять'],
                    type: 8,
                    clickable: true,
                    params: { name: "inviteFraction2" }
                },
            ],
        };
        menu.items.push(titleMenu);
    }

    if ((user.isLeader2() && !fData.get('is_war') && !fData.get('is_mafia')) || user.isAdmin(3)) {
        let titleMenu = {
            title: 'Раздел для лидера',
            umenu: [
                {
                    title: "Расформировать организацию",
                    modalTitle: 'Введите слово ДА',
                    modalButton: ['Отмена', 'Расформировать'],
                    type: 8,
                    clickable: true,
                    params: { name: "destroyFraction" }
                },
            ],
        };
        menu.items.push(titleMenu);
    }

    phone.showMenu(menu);
};

phone.showAppFamily = async function() {

    let fData = await family.getData(user.getCache('family_id'));

    let menu = {
        UUID: 'family',
        title: 'Ваша семья',
        items: [
            {
                title: 'Основной раздел',
                umenu: [
                    {
                        title: "Список членов семьи",
                        type: 1,
                        clickable: true,
                        params: {name: "list"}
                    },
                    /*{
                        title: "Статистика членов семьи",
                        type: 1,
                        clickable: true,
                        params: {name: "slist"}
                    },*/
                    {
                        title: "Иерархия",
                        type: 1,
                        clickable: true,
                        params: {name: "hierarchy"}
                    },
                    {
                        title: "Достижения",
                        type: 1,
                        clickable: true,
                        params: {name: "avhive"}
                    },
                ],
            },
        ],
    };

    let item ={
        title: "Перевести на счёт",
        text: 'Перевод $ на счет вашей организации',
        modalTitle: 'Сколько $ вы хотите перевести',
        modalButton: ['Закрыть', 'Перевести'],
        type: 8,
        clickable: true,
        params: {name: "moneyToFraction"}
    };
    menu.items[0].umenu.push(item);

    if (user.isLeaderF()) {
        item ={
            title: "Перевести со счёта",
            text: 'Перевод $ со счета вашей организации',
            modalTitle: 'Сколько $ вы хотите перевести',
            modalButton: ['Закрыть', 'Перевести'],
            type: 8,
            clickable: true,
            params: {name: "fractionToMoney"}
        };
        menu.items[0].umenu.push(item);
    }

    let titleMenu1 = {
        title: 'Связь',
        umenu: [
            {
                title: "Написать членам семьи",
                modalTitle: 'Введите текст',
                modalButton: ['Отмена', 'Отправить'],
                type: 8,
                clickable: true,
                params: { name: "sendFractionMessageF" }
            },
        ],
    };
    menu.items.push(titleMenu1);

    if (!user.isLeaderF()) {
        let titleMenu2 = {
            title: 'Покинуть семью',
            umenu: [
                {
                    title: "Покинуть семью",
                    type: 1,
                    clickable: true,
                    params: { name: "uninviteMe" }
                },
            ],
        };
        menu.items.push(titleMenu2);
    }

    if (user.isLeaderF() || user.isSubLeaderF()) {
        let titleMenu = {
            title: 'Раздел для руководства',
            umenu: [
                /*{
                    title: "Лог семьи",
                    type: 1,
                    clickable: true,
                    params: { name: "log" }
                },*/
                {
                    title: "Текущее состояние бюджета",
                    text: `${methods.moneyFormat(fData.get('money'))}`,
                    type: 1,
                    params: { name: "none" }
                },
                {
                    title: "Принять в семью",
                    modalTitle: 'Введите ID',
                    modalButton: ['Отмена', 'Принять'],
                    type: 8,
                    clickable: true,
                    params: { name: "inviteFamily" }
                },
            ],
        };
        menu.items.push(titleMenu);
    }
    else if ((user.isDepLeaderF() || user.isDepSubLeaderF())) {
        let titleMenu = {
            title: 'Раздел для руководства',
            umenu: [
                {
                    title: "Принять в семью",
                    modalTitle: 'Введите ID',
                    modalButton: ['Отмена', 'Принять'],
                    type: 8,
                    clickable: true,
                    params: { name: "inviteFamily" }
                },
            ],
        };
        menu.items.push(titleMenu);
    }

    if (user.isLeaderF() || user.isAdmin(3)) {
        let titleMenu = {
            title: 'Раздел для лидера',
            umenu: [
                {
                    title: "Расформировать семью",
                    modalTitle: 'Введите слово ДА',
                    modalButton: ['Отмена', 'Расформировать'],
                    type: 8,
                    clickable: true,
                    params: { name: "destroyFamily" }
                },
            ],
        };
        menu.items.push(titleMenu);
    }

    phone.showMenu(menu);
};

phone.showAppFraction = function() {
    quest.standart(false, -1, 13);
    let menu = {
        UUID: 'fraction',
        title: user.getFractionNameL(),
        items: [
            {
                title: 'Основной раздел',
                umenu: [
                    {
                        title: "Список членов организации",
                        type: 1,
                        clickable: true,
                        params: { name: "list" }
                    },
                    {
                        title: "Список всех отделов и должностей",
                        type: 1,
                        clickable: true,
                        params: { name: "hierarchy" }
                    },
                ],
            },
        ],
    };

    if (user.isCartel()) {
        let titleMenu1 = {
            title: 'Связь',
            umenu: [
                {
                    title: "Написать членам организации",
                    modalTitle: 'Введите текст',
                    modalButton: ['Отмена', 'Отправить'],
                    type: 8,
                    clickable: true,
                    params: { name: "sendFractionMessage" }
                }
            ],
        };
        menu.items.push(titleMenu1);
    }
    else {
        let titleMenu1 = {
            title: 'Связь',
            umenu: [
                {
                    title: "Написать членам организации",
                    modalTitle: 'Введите текст',
                    modalButton: ['Отмена', 'Отправить'],
                    type: 8,
                    clickable: true,
                    params: { name: "sendFractionMessage" }
                },
                {
                    title: "Написать департаменту",
                    modalTitle: 'Введите текст',
                    modalButton: ['Отмена', 'Отправить'],
                    type: 8,
                    clickable: true,
                    params: { name: "sendFractionMessageDep" }
                },
            ],
        };
        menu.items.push(titleMenu1);
    }

    if (user.isNews()) {
        let titleMenu = {
            title: 'Служебный раздел',
            umenu: [
                {
                    title: "Статистика объявлений",
                    text: "За 1 день",
                    type: 1,
                    clickable: true,
                    params: { name: "showInvaderStats", days: 1 }
                },
                {
                    title: "Статистика объявлений",
                    text: "За 7 дней",
                    type: 1,
                    clickable: true,
                    params: { name: "showInvaderStats", days: 7 }
                },
                {
                    title: "Статистика объявлений",
                    text: "За 30 дней",
                    type: 1,
                    clickable: true,
                    params: { name: "showInvaderStats", days: 30 }
                },
            ],
        };
        menu.items.push(titleMenu);
    }

    if (user.isCartel()) {
        let titleMenu = {
            title: 'Служебный раздел',
            umenu: [
                {
                    title: "Диспетчерская",
                    type: 1,
                    clickable: true,
                    params: { name: "dispatcherList" }
                },
                {
                    title: "Локальные коды",
                    type: 1,
                    clickable: true,
                    params: { name: "dispatcherLoc" }
                }
            ],
        };

        titleMenu.umenu.push(
            {
                title: "Эвакуировать ближайший транспорт",
                type: 1,
                clickable: true,
                params: { name: "destroyVehicle" }
            }
        );

        titleMenu.umenu.push(
            {
                title: "Информация о человеке",
                modalTitle: 'Card ID или Имя Фамилия',
                modalButton: ['Отмена', 'Поиск'],
                type: 8,
                clickable: true,
                params: { name: "getUserInfo" }
            }
        );

        titleMenu.umenu.push(
            {
                title: "Информация о транспорте",
                modalTitle: 'Номер транспорта',
                modalButton: ['Отмена', 'Поиск'],
                type: 8,
                clickable: true,
                params: { name: "getVehInfo" }
            }
        );

        titleMenu.umenu.push(
            {
                title: "Информация о оружии",
                modalTitle: 'Серийный номер',
                modalButton: ['Отмена', 'Поиск'],
                type: 8,
                clickable: true,
                params: { name: "getGunInfo" }
            }
        );
    }

    if (user.isGos()) {
        let titleMenu = {
            title: 'Служебный раздел',
            umenu: [
                {
                    title: "Диспетчерская",
                    type: 1,
                    clickable: true,
                    params: { name: "dispatcherList" }
                },
                {
                    title: "Локальные коды",
                    type: 1,
                    clickable: true,
                    params: { name: "dispatcherLoc" }
                },
                {
                    title: "Коды департамента",
                    type: 1,
                    clickable: true,
                    params: { name: "dispatcherDep" }
                },
            ],
        };

        if (user.isUsmc() || user.isGov()) {
            titleMenu.umenu.push(
                {
                    title: "Эвакуировать ближайший транспорт",
                    type: 1,
                    clickable: true,
                    params: { name: "destroyVehicle" }
                }
            );
        }

        if (user.isSapd() || user.isSheriff() || user.isFib()) {
            titleMenu.umenu.push(
                {
                    title: "Выдать розыск",
                    modalTitle: 'Card ID, Кол-во, Причина',
                    modalButton: ['Отмена', 'Выдать'],
                    type: 8,
                    clickable: true,
                    params: { name: "giveWanted" }
                },
                {
                    title: "Эвакуировать ближайший транспорт",
                    type: 1,
                    clickable: true,
                    params: { name: "destroyVehicle" }
                },
                {
                    title: "На штраф стоянку ближайший транспорт",
                    type: 1,
                    clickable: true,
                    params: { name: "destroyVehicle2" }
                }
            );

            titleMenu.umenu.push(
                {
                    title: "Информация о человеке",
                    modalTitle: 'Card ID или Имя Фамилия',
                    modalButton: ['Отмена', 'Поиск'],
                    type: 8,
                    clickable: true,
                    params: { name: "getUserInfo" }
                }
            );

            titleMenu.umenu.push(
                {
                    title: "Информация о транспорте",
                    modalTitle: 'Номер транспорта',
                    modalButton: ['Отмена', 'Поиск'],
                    type: 8,
                    clickable: true,
                    params: { name: "getVehInfo" }
                }
            );

            titleMenu.umenu.push(
                {
                    title: "Информация о оружии",
                    modalTitle: 'Серийный номер',
                    modalButton: ['Отмена', 'Поиск'],
                    type: 8,
                    clickable: true,
                    params: { name: "getGunInfo" }
                }
            );
        }
        if (user.isEms()) {
            titleMenu.umenu.push(
                {
                    title: "Эвакуировать ближайший транспорт",
                    type: 1,
                    clickable: true,
                    params: { name: "destroyVehicle" }
                },
                {
                    title: "Перевернуть ближайший транспорт",
                    type: 1,
                    clickable: true,
                    params: { name: "flipVehicle" }
                },
                /*{
                    title: "На штраф стоянку ближайший транспорт",
                    type: 1,
                    clickable: true,
                    params: { name: "destroyVehicle2" }
                }*/
            );
        }
        menu.items.push(titleMenu);
    }

    if (user.isLeader() || user.isSubLeader() || user.isDepLeader() || user.isDepSubLeader()) {
        let titleMenu = {
            title: 'Раздел для руководства',
            umenu: [
                {
                    title: "Лог организации",
                    type: 1,
                    clickable: true,
                    params: { name: "log" }
                },
                {
                    title: "Написать новость",
                    modalTitle: 'Введите текст',
                    modalButton: ['Отмена', 'Отправить'],
                    type: 8,
                    clickable: true,
                    params: { name: "sendFractionNews" }
                },
                {
                    title: "Управление автопарком",
                    type: 1,
                    clickable: true,
                    params: { name: "vehicles" }
                },
            ],
        };

        if (user.isLeader()) {
            titleMenu.umenu.push(
                {
                    title: "Управление бюджетом",
                    type: 1,
                    clickable: true,
                    params: { name: "money" }
                }
            );
        }
        menu.items.push(titleMenu);
    }

    phone.showMenu(menu);
};

phone.showAppVehicle = function() {

    let menu = {
        UUID: 'vehicle',
        title: 'Ваши автомобили',
        items: [],
    };

    for (let i = 1; i <= 10; i++) {
        if (user.getCache('car_id' + i) > 0) {
            let subItems = [];

            let item = phone.getMenuItemButton(
                'Вызвать эвакуатор',
                'Стоимость: $500',
                { name: "respawn", slot: i },
                '',
                true,
            );
            subItems.push(item);

            item = phone.getMenuItemButton(
                'Узнать местоположение',
                '',
                { name: "getPos", slot: i },
                '',
                true,
            );
            subItems.push(item);

            item = phone.getMenuItemButton(
                'Открыть / Закрыть двери',
                'Удаленное управление транспортом',
                { name: "lock", slot: i },
                '',
                true,
            );
            subItems.push(item);

            item = phone.getMenuItemButton(
                'Запустить / Заглушить двигатель',
                'Удаленное управление транспортом',
                { name: "engine", slot: i },
                '',
                true,
            );
            subItems.push(item);

            menu.items.push(phone.getMenuMainItem('Слот #' + i, subItems));
        }
    }

    phone.showMenu(menu);
};

phone.showAppGps = function() {

    let menu = {
        UUID: 'gps',
        title: 'GPS',
        items: [
            {
                title: 'Основной раздел',
                umenu: [
                    {
                        title: "Здание правительства",
                        text: "Получение регистрации, трудоустройство, лицензий и прочее",
                        type: 1,
                        clickable: true,
                        params: {x: -1379, y: -499}
                    },
                    {
                        title: "Частный банк Maze Bank №1",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: {x: -75, y: -826}
                    },
                    {
                        title: "Частный банк Maze Bank №2",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: {x: -1381, y: -477}
                    },
                    {
                        title: "Частный банк Pacific Standard",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: {x: 235, y: 216}
                    },
                    {
                        title: "Найти ближайший Flecca банк",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: {event: 'server:gps:findFleeca'}
                    },
                    {
                        title: "Частный банк Blaine County",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: {x: -111, y: 6467}
                    },
                    {
                        title: "Бизнес центр Arcadius",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: {x: -139, y: -631}
                    },
                    {
                        title: "Полицейский участок Vespucci",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: {x: -1089, y: -835}
                    },
                    {
                        title: "Полицейский участок Mission Row",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: {x: 450, y: -984}
                    },
                    {
                        title: "Шериф департамент Палето-Бей",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: {x: -448, y: 6012}
                    },
                    {
                        title: "Шериф департамент Сенди-Шорс",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: {x: 1853, y: 3686}
                    },
                    {
                        title: "Больница Лос-Сантоса",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: {x: 292, y: -591}
                    },
                    {
                        title: "Больница Палето-Бей",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: {x: -253, y: 6336}
                    },
                    {
                        title: "Федеральная тюрьма",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: {x: 1830, y: 2603}
                    },
                    {
                        title: "Life Invader",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: {x: -1041, y: -241}
                    },
                    {
                        title: "Швейная фабрика",
                        text: "Для обмена одежды на ткань",
                        type: 1,
                        clickable: true,
                        params: {x: 707, y: -966}
                    },
                    {
                        title: "Литейный завод",
                        text: "Для обмена оружия на стальные пластины",
                        type: 1,
                        clickable: true,
                        params: {x: 1073, y: -2008}
                    },
                ],
            },
            {
                title: 'Работы',
                umenu: [
                    {
                        title: "Садовник",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: {x: -1583, y: -234}
                    },
                    {
                        title: "Строитель",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: {x: -1583, y: -234}
                    },
                    {
                        title: "Фотограф",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: {x: -1041, y: -241}
                    },
                    {
                        title: "Почтальон",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: {x: 78, y: 111}
                    },
                    {
                        title: "Механик",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: {x: 548, y: -172}
                    },
                    {
                        title: "Автобусный парк",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: {x: 461, y: -573}
                    },
                    {
                        title: "Инкассаторы",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: {x: -20, y: -660}
                    },
                    {
                        title: "Таксопарк",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: {x: 903, y: -165}
                    },
                ],
            },
            {
                title: 'Авторынки',
                umenu: [
                    {
                        title: "Sandy Cars",
                        text: "Дешевый транспорт",
                        type: 1,
                        clickable: true,
                        params: {x: 1661, y: 3820}
                    },
                    {
                        title: "Mosley Auto",
                        text: "Средний стоимости транспорт",
                        type: 1,
                        clickable: true,
                        params: {x: -41, y: -1675}
                    },
                    {
                        title: "Premium Deluxe",
                        text: "Премиум транспорт",
                        type: 1,
                        clickable: true,
                        params: {x: -57, y: -1096}
                    },
                    {
                        title: "Luxury Cars",
                        text: "Люкс транспорт",
                        type: 1,
                        clickable: true,
                        params: {x: -796, y: -220}
                    },
                    {
                        title: "Vans & Trucker",
                        text: "Фургоны и тягачи",
                        type: 1,
                        clickable: true,
                        params: {x: 1010, y: -2289}
                    },
                    {
                        title: "Sandres Motorcycles",
                        text: "Мотоциклы",
                        type: 1,
                        clickable: true,
                        params: {x: 284, y: -1163}
                    },
                    {
                        title: "Heli Shop",
                        text: "Вертолеты",
                        type: 1,
                        clickable: true,
                        params: {x: -753, y: -1511}
                    },
                    {
                        title: "Plane Shop",
                        text: "Самолеты",
                        type: 1,
                        clickable: true,
                        params: {x: -1242, y: -3392}
                    },
                    {
                        title: "Boat Shop",
                        text: "Водный транспорт",
                        type: 1,
                        clickable: true,
                        params: {x: -712, y: -1298}
                    },
                    {
                        title: "Б/У Авторынок",
                        text: "Авторынок, где люди продают свой транспорт",
                        type: 1,
                        clickable: true,
                        params: {x: -1654, y: -947}
                    },
                ],
            },
            {
                title: 'Магазины и прочее',
                umenu: [
                    /*{
                        title: "Найти ближайшую аптеку",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { event: 'server:gps:findApt' }
                    },
                    {
                        title: "Найти ближайший магазин электронной техники",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { event: 'server:gps:findEl' }
                    },*/
                    {
                        title: "Найти ближайший магазин",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { event: 'server:gps:find247' }
                    },
                    /*{
                        title: "Найти ближайший магазин алкогольный магазин",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { event: 'server:gps:findAlc' }
                    },*/
                    {
                        title: "Найти ближайшую заправку",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { event: 'server:gps:findFuel' }
                    },
                    {
                        title: "Найти ближайший пункт аренды",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { event: 'server:gps:findRent' }
                    },
                    {
                        title: "Найти ближайший бар/клуб",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { event: 'server:gps:findBar' }
                    },
                    {
                        title: "Найти ближайший магазин оружия",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { event: 'server:gps:findGunShop' }
                    },
                    {
                        title: "Найти ближайший магазин одежды",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { event: 'server:gps:findClothShop' }
                    },
                    {
                        title: "Найти ближайший тату салон",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { event: 'server:gps:findTattooShop' }
                    },
                    {
                        title: "Найти ближайший барбершоп",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { event: 'server:gps:findBarberShop' }
                    },
                    {
                        title: "Найти ближайшую автомастерскую",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { event: 'server:gps:findLsc' }
                    },
                    {
                        title: "Найти ближайшую автомойку",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { event: 'server:gps:findCarWash' }
                    },
                    {
                        title: "Магазин масок",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -1337, y: -1277 }
                    },
                    {
                        title: "Магазин принтов",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -1339, y: -1268 }
                    },
                    {
                        title: "Магазин охоты",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -675, y: 5836 }
                    },
                    {
                        title: "Рыболовный магазин",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -1599, y: 5202 }
                    },
                ],
            },
            {
                title: 'Интересные места',
                umenu: [
                    {
                        title: "Международный аэропорт",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -1037, y: -2737 }
                    },
                    {
                        title: "Аэропорт Сэнди-Шорс",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 1722, y: 3255 }
                    },
                    {
                        title: "Аэропорт Грейпсид",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 2138, y: 4812 }
                    },
                    {
                        title: "Спортзал",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -1204, y: -1564 }
                    },
                    {
                        title: "Площадь Лос-Сантоса",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 161, y: -993 }
                    },
                    {
                        title: "Торговый центр Mega Moll",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 46, y: -1753 }
                    },
                    {
                        title: "Стриптиз Клуб",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 105, y: -1291 }
                    },
                    {
                        title: "Бар Tequila",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -562, y: 286 }
                    },
                    {
                        title: "Бар Yellow Jack",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 1986, y: 3054 }
                    },
                    {
                        title: "Байкерский Клуб",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 988, y: -96 }
                    },
                    {
                        title: "Comedy Club",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -450, y: 280 }
                    },
                    {
                        title: "Пляж",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -1581, y: -1162 }
                    },
                    {
                        title: "Надпись VineWood",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 716, y: 1203 }
                    },
                    {
                        title: "Сцена-1",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 226, y: 1173 }
                    },
                    {
                        title: "Сцена-2",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 689, y: 602 }
                    },
                    {
                        title: "Библиотека Рокфорд-Хиллз",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -615, y: -146 }
                    },
                    {
                        title: "Гольф-клуб",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -1375, y: 55 }
                    },
                    {
                        title: "Музей Пасифик-Блаффс",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -2291, y: 367 }
                    },
                    {
                        title: "Университет Сан-Андреас",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -1636, y: 180 }
                    },
                    {
                        title: "Миррор-Парк",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 1080, y: -693 }
                    },
                    {
                        title: "Парк Маленький Сеул",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -880, y: -809 }
                    },
                    {
                        title: "Коттеджный парк",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -940, y: 303 }
                    },
                    {
                        title: "Казино Лос-Сантос",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 928, y: 44 }
                    },
                    {
                        title: "Ипподром",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 1138, y: 106 }
                    },
                    {
                        title: "Weazel News",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -598, y: -929 }
                    },
                    {
                        title: "Обсерватория Галилео",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -429, y: 1109 }
                    },
                    {
                        title: "Восточный Театр",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 301, y: 203 }
                    },
                    {
                        title: "Десять центов Театр",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 393, y: -711 }
                    },
                    {
                        title: "Вальдез Театр",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -721, y: -684 }
                    },
                    {
                        title: "Richards  Majestic",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -1052, y: -478 }
                    },
                    {
                        title: "Здание суда",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 322, y: -1625 }
                    },
                    {
                        title: "City Hall Alta",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 236, y: -409 }
                    },
                    {
                        title: "City Hall Del Perro",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -1285, y: -567 }
                    },
                    {
                        title: "City Hall Rockford-Hills",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -545, y: -203 }
                    },
                    {
                        title: "Виноградник",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -1887, y: 2051 }
                    },
                    {
                        title: "Церковь Рокфорд-Хиллз",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -766, y: -23 }
                    },
                    {
                        title: "Церковь Маленький Сиул",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -759, y: -709 }
                    },
                    {
                        title: "Церковь Южный Лос-Сантос",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 20, y: -1505 }
                    },
                    {
                        title: "Церковь Сэнди-Шорс",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -324, y: 2817 }
                    },
                    {
                        title: "Церковь Дель-Перро",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -1681, y: -290 }
                    },
                    {
                        title: "Церковь Палето-Бэй",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -329, y: 6150 }
                    },
                    {
                        title: "Rebel Radio",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 732, y: 2523 }
                    },
                    {
                        title: "Озеро Аламо-Си",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 1578, y: 3835 }
                    },
                    {
                        title: "Заповедник Сэнди-Шорс",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -1638, y: 4725 }
                    },
                    {
                        title: "Пирс Дель-Перро",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -1604, y: -1048 }
                    },
                    {
                        title: "Пирс Веспуччи",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -3265, y: 947 }
                    },
                    {
                        title: "Пирс Палето-Бэй",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -213, y: 6572 }
                    },
                    {
                        title: "Гора Чиллиад",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 501, y: 5603 }
                    },
                    {
                        title: "Гора Гордо",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 2877, y: 5910 }
                    },
                    {
                        title: "Maze Bank Arena",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -254, y: -2026 }
                    },
                    {
                        title: "Карьер",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 2906, y: 2803 }
                    },
                    {
                        title: "Электростанция",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 2661, y: 1641 }
                    },
                    {
                        title: "Дамба",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 1662, y: -13 }
                    },
                    {
                        title: "Швейная фабрика",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 718, y: -975 }
                    },
                    {
                        title: "Скотобойня",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 961, y: -2185 }
                    },
                    {
                        title: "Лесопилка Палето-Бэй",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -565, y: 5325 }
                    },
                    {
                        title: "Литейный завод",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 1083, y: -1974 }
                    },
                    {
                        title: "Завод по переработке отходов",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: -609, y: -1609 }
                    },
                    {
                        title: "Цементный завод",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 266, y: 2849 }
                    },
                    {
                        title: "Центр переработки металлолома",
                        text: "",
                        type: 1,
                        clickable: true,
                        params: { x: 2340, y: 3136 }
                    },
                ],
            }
        ],
    };

    phone.showMenu(menu);
};

phone.showAppFractionHierarchy = function() {

    let fractionItem = enums.fractionListId[user.getCache('fraction_id')];
    let menu = {
        UUID: 'fraction_hierarchy',
        title: `Иерархия - ${user.getFractionName()}`,
        items: [
            {
                title: 'Руководство',
                umenu: [
                    {
                        title: fractionItem.leaderName,
                        type: 1,
                        params: { name: "none" }
                    },
                    {
                        title: fractionItem.subLeaderName,
                        type: 1,
                        params: { name: "none" }
                    },
                ],
            }
        ]
    };

    fractionItem.departmentList.forEach((item, i) => {
        let menuItem = {
            title: item,
            umenu: [],
        };

        fractionItem.rankList[i].forEach((rank, ri) => {
            let desc = '';
            if (ri == 0)
                desc = 'Глава отдела';
            else if(ri == 1)
                desc = 'Зам. главы отдела';
            menuItem.umenu.push(
                {
                    title: rank,
                    text: desc,
                    type: 1,
                    params: { name: "none" }
                },
            );
        });

        menu.items.push(menuItem);
    });

    phone.showMenu(menu);
};

phone.showAppFractionEditRankMenu = async function(rank, dep) {

    let fractionItem = await fraction.getData(user.getCache('fraction_id2'));
    let fractionItemRanks = JSON.parse(fractionItem.get('rank_list'));

    let menu = {
        UUID: 'fraction_hierarchy2',
        title: `Редактирование - ${fractionItemRanks[dep][rank]}`,
        items: [
            {
                title: 'Основной раздел',
                umenu: [
                    {
                        title: 'Редактировать',
                        text: '',
                        modalTitle: 'Введите название ранга',
                        modalValue: rank,
                        modalButton: ['Отмена', 'Редактировать'],
                        type: 8,
                        params: { name: "editFractionRank", depId: dep, rankId: rank },
                        clickable: true,
                    },
                    {
                        title: 'Удалить',
                        text: '',
                        modalTitle: 'Вы точно хотите удалить?',
                        modalButton: ['Отмена', 'Удалить'],
                        type: 7,
                        params: { name: "deleteFractionRank", depId: dep, rankId: rank },
                        clickable: true,
                    },
                ],
            }
        ]
    };

    phone.showMenu(menu);
};

phone.showAppFractionFEditRankMenu = async function(rank, dep) {

    let fractionItem = await family.getData(user.getCache('family_id'));
    let fractionItemRanks = JSON.parse(fractionItem.get('rank_list'));

    let menu = {
        UUID: 'fraction_hierarchyf',
        title: `Редактирование - ${fractionItemRanks[dep][rank]}`,
        items: [
            {
                title: 'Основной раздел',
                umenu: [
                    {
                        title: 'Редактировать',
                        text: '',
                        modalTitle: 'Введите название ранга',
                        modalValue: rank,
                        modalButton: ['Отмена', 'Редактировать'],
                        type: 8,
                        params: { name: "editFractionRankF", depId: dep, rankId: rank },
                        clickable: true,
                    },
                    {
                        title: 'Удалить',
                        text: '',
                        modalTitle: 'Вы точно хотите удалить?',
                        modalButton: ['Отмена', 'Удалить'],
                        type: 7,
                        params: { name: "deleteFractionRankF", depId: dep, rankId: rank },
                        clickable: true,
                    },
                ],
            }
        ]
    };

    phone.showMenu(menu);
};

phone.showAppFractionHierarchy2 = async function() {

    let fractionItem = await fraction.getData(user.getCache('fraction_id2'));
    let fractionItemRanks = JSON.parse(fractionItem.get('rank_list'));
    let fractionItemDep = JSON.parse(fractionItem.get('rank_type_list'));

    if (user.isLeader2()) {
        try {
            let menu = {
                UUID: 'fraction_hierarchy2',
                title: `Иерархия - ${fractionItem.get('name')}`,
                items: [
                    {
                        title: 'Основной раздел',
                        umenu: [
                            /*{
                                title: fractionItem.get('name'),
                                modalTitle: 'Введите название организации',
                                modalValue: fractionItem.get('name'),
                                modalButton: ['Отмена', 'Переименовать'],
                                type: 8,
                                params: { name: "editFractionName" },
                                clickable: true,
                            },*/
                            {
                                title: 'Создать новый раздел',
                                modalTitle: 'Введите название раздела',
                                modalButton: ['Отмена', 'Создать'],
                                type: 8,
                                params: { name: "createFractionDep" },
                                clickable: true,
                            },
                        ],
                    },
                    {
                        title: 'Руководство',
                        umenu: [
                            {
                                title: fractionItem.get('rank_leader'),
                                modalTitle: 'Введите название ранга',
                                modalValue: fractionItem.get('rank_leader'),
                                modalButton: ['Отмена', 'Редактировать'],
                                type: 8,
                                params: { name: "editFractionLeader" },
                                clickable: true,
                            },
                            {
                                title: fractionItem.get('rank_sub_leader'),
                                modalTitle: 'Введите название ранга',
                                modalValue: fractionItem.get('rank_sub_leader'),
                                modalButton: ['Отмена', 'Редактировать'],
                                type: 8,
                                params: { name: "editFractionSubLeader" },
                                clickable: true,
                            },
                        ],
                    }
                ]
            };

            if ((!fractionItem.get('is_war') && !fractionItem.get('is_mafia')) || user.isAdmin(3)) {
                let titleMenu = {
                    title: fractionItem.get('name'),
                    modalTitle: 'Введите название организации',
                    modalValue: fractionItem.get('name'),
                    modalButton: ['Отмена', 'Переименовать'],
                    type: 8,
                    params: { name: "editFractionName" },
                    clickable: true,
                };
                menu.items[0].umenu.push(titleMenu);
            }

            fractionItemDep.forEach((item, i) => {
                let menuItem = {
                    title: item,
                    umenu: [],
                };

                fractionItemRanks[i].forEach((rank, ri) => {
                    let desc = '';
                    if (ri == 0)
                        desc = 'Глава';
                    else if(ri == 1)
                        desc = 'Зам. главы';
                    menuItem.umenu.push(
                        {
                            title: rank,
                            text: desc,
                            type: 1,
                            params: { name: "editFractionRankMenu", rankId: ri, depId: i },
                            clickable: true,
                        },
                    );
                });

                if (i > 0) {
                    menuItem.umenu.push(
                        {
                            title: 'Добавить должность',
                            text: '',
                            modalTitle: 'Введите название ранга',
                            modalButton: ['Отмена', 'Добавить'],
                            type: 8,
                            params: { name: "addFractionRank", depId: i },
                            clickable: true,
                        },
                    );
                    menuItem.umenu.push(
                        {
                            title: 'Редактировать название раздела',
                            text: '',
                            modalTitle: 'Введите название раздела',
                            modalValue: item,
                            modalButton: ['Отмена', 'Добавить'],
                            type: 8,
                            params: { name: "editFractionDep", depId: i },
                            clickable: true,
                        },
                    );

                    menuItem.umenu.push(
                        {
                            title: 'Удалить раздел',
                            text: '',
                            modalTitle: 'Вы точно хотите удалить?',
                            modalButton: ['Отмена', 'Удалить'],
                            type: 7,
                            params: { name: "deleteFractionDep", depId: i },
                            clickable: true,
                        },
                    );
                }
                else {
                    menuItem.umenu.push(
                        {
                            title: 'Добавить должность',
                            text: '',
                            modalTitle: 'Введите название ранга',
                            modalButton: ['Отмена', 'Добавить'],
                            type: 8,
                            params: { name: "addFractionRank", depId: i },
                            clickable: true,
                        },
                    );
                    menuItem.umenu.push(
                        {
                            title: 'Редактировать название раздела',
                            text: '',
                            modalTitle: 'Введите название раздела',
                            modalValue: item,
                            modalButton: ['Отмена', 'Добавить'],
                            type: 8,
                            params: { name: "editFractionDep", depId: i },
                            clickable: true,
                        },
                    );
                }

                menu.items.push(menuItem);
            });

            phone.showMenu(menu);
        }
        catch (e) {
            methods.debug(e);
        }
    }
    else {

        let menu = {
            UUID: 'fraction_hierarchy2',
            title: `Иерархия - ${fractionItem.get('name')}`,
            items: [
                {
                    title: 'Руководство',
                    umenu: [
                        {
                            title: fractionItem.get('rank_leader'),
                            type: 1,
                            params: { name: "none" }
                        },
                        {
                            title: fractionItem.get('rank_sub_leader'),
                            type: 1,
                            params: { name: "none" }
                        },
                    ],
                }
            ]
        };

        fractionItemDep.forEach((item, i) => {
            let menuItem = {
                title: item,
                umenu: [],
            };

            fractionItemRanks[i].forEach((rank, ri) => {
                let desc = '';
                if (ri == 0)
                    desc = 'Глава';
                else if(ri == 1)
                    desc = 'Зам. главы';
                menuItem.umenu.push(
                    {
                        title: rank,
                        text: desc,
                        type: 1,
                        params: { name: "none" }
                    },
                );
            });

            menu.items.push(menuItem);
        });

        phone.showMenu(menu);
    }
};

phone.showAppFractionHierarchyF = async function() {

    let fractionItem = await family.getData(user.getCache('family_id'));
    let fractionItemRanks = JSON.parse(fractionItem.get('rank_list'));
    let fractionItemDep = JSON.parse(fractionItem.get('rank_type_list'));

    if (user.isLeaderF()) {
        try {
            let menu = {
                UUID: 'fraction_hierarchyf',
                title: `Иерархия - ${fractionItem.get('name')}`,
                items: [
                    {
                        title: 'Основной раздел',
                        umenu: [
                            /*{
                                title: fractionItem.get('name'),
                                modalTitle: 'Введите название организации',
                                modalValue: fractionItem.get('name'),
                                modalButton: ['Отмена', 'Переименовать'],
                                type: 8,
                                params: { name: "editFractionName" },
                                clickable: true,
                            },*/
                            {
                                title: 'Создать новый раздел',
                                modalTitle: 'Введите название раздела',
                                modalButton: ['Отмена', 'Создать'],
                                type: 8,
                                params: { name: "createFractionDepF" },
                                clickable: true,
                            },
                        ],
                    },
                    {
                        title: 'Руководство',
                        umenu: [
                            {
                                title: fractionItem.get('rank_leader'),
                                modalTitle: 'Введите название ранга',
                                modalValue: fractionItem.get('rank_leader'),
                                modalButton: ['Отмена', 'Редактировать'],
                                type: 8,
                                params: { name: "editFractionLeaderF" },
                                clickable: true,
                            },
                            {
                                title: fractionItem.get('rank_sub_leader'),
                                modalTitle: 'Введите название ранга',
                                modalValue: fractionItem.get('rank_sub_leader'),
                                modalButton: ['Отмена', 'Редактировать'],
                                type: 8,
                                params: { name: "editFractionSubLeaderF" },
                                clickable: true,
                            },
                        ],
                    }
                ]
            };

            fractionItemDep.forEach((item, i) => {
                let menuItem = {
                    title: item,
                    umenu: [],
                };

                fractionItemRanks[i].forEach((rank, ri) => {
                    let desc = '';
                    if (ri == 0)
                        desc = 'Глава';
                    else if(ri == 1)
                        desc = 'Зам. главы';
                    menuItem.umenu.push(
                        {
                            title: rank,
                            text: desc,
                            type: 1,
                            params: { name: "editFractionRankMenuF", rankId: ri, depId: i },
                            clickable: true,
                        },
                    );
                });

                if (i > 0) {
                    menuItem.umenu.push(
                        {
                            title: 'Добавить должность',
                            text: '',
                            modalTitle: 'Введите название ранга',
                            modalButton: ['Отмена', 'Добавить'],
                            type: 8,
                            params: { name: "addFractionRankF", depId: i },
                            clickable: true,
                        },
                    );
                    menuItem.umenu.push(
                        {
                            title: 'Редактировать название раздела',
                            text: '',
                            modalTitle: 'Введите название раздела',
                            modalValue: item,
                            modalButton: ['Отмена', 'Добавить'],
                            type: 8,
                            params: { name: "editFractionDepF", depId: i },
                            clickable: true,
                        },
                    );

                    menuItem.umenu.push(
                        {
                            title: 'Удалить раздел',
                            text: '',
                            modalTitle: 'Вы точно хотите удалить?',
                            modalButton: ['Отмена', 'Удалить'],
                            type: 7,
                            params: { name: "deleteFractionDepF", depId: i },
                            clickable: true,
                        },
                    );
                }
                else {
                    menuItem.umenu.push(
                        {
                            title: 'Добавить должность',
                            text: '',
                            modalTitle: 'Введите название ранга',
                            modalButton: ['Отмена', 'Добавить'],
                            type: 8,
                            params: { name: "addFractionRankF", depId: i },
                            clickable: true,
                        },
                    );
                    menuItem.umenu.push(
                        {
                            title: 'Редактировать название раздела',
                            text: '',
                            modalTitle: 'Введите название раздела',
                            modalValue: item,
                            modalButton: ['Отмена', 'Добавить'],
                            type: 8,
                            params: { name: "editFractionDepF", depId: i },
                            clickable: true,
                        },
                    );
                }

                menu.items.push(menuItem);
            });

            phone.showMenu(menu);
        }
        catch (e) {
            methods.debug(e);
        }
    }
    else {

        let menu = {
            UUID: 'fraction_hierarchyf',
            title: `Иерархия - ${fractionItem.get('name')}`,
            items: [
                {
                    title: 'Руководство',
                    umenu: [
                        {
                            title: fractionItem.get('rank_leader'),
                            type: 1,
                            params: { name: "none" }
                        },
                        {
                            title: fractionItem.get('rank_sub_leader'),
                            type: 1,
                            params: { name: "none" }
                        },
                    ],
                }
            ]
        };

        fractionItemDep.forEach((item, i) => {
            let menuItem = {
                title: item,
                umenu: [],
            };

            fractionItemRanks[i].forEach((rank, ri) => {
                let desc = '';
                if (ri == 0)
                    desc = 'Глава';
                else if(ri == 1)
                    desc = 'Зам. главы';
                menuItem.umenu.push(
                    {
                        title: rank,
                        text: desc,
                        type: 1,
                        params: { name: "none" }
                    },
                );
            });

            menu.items.push(menuItem);
        });

        phone.showMenu(menu);
    }
};


phone.showAppFractionAchiveF = async function() {

    let fractionItem = await family.getData(user.getCache('family_id'));
    let menu = {
        UUID: 'family',
        title: `Достижения - ${fractionItem.get('name')}`,
        items: [
            {
                title: 'Текущий статус',
                umenu: [
                    {
                        title: 'Ваш текущий уровень - ' + fractionItem.get('level'),
                        type: 1,
                        params: { name: "none" }
                    },
                    {
                        title: 'Ваш текущий прогресс - ' + fractionItem.get('exp'),
                        type: 1,
                        params: { name: "none" }
                    },
                    {
                        title: 'Учтите, что все полученые награды распротраняются на членов которые в данный момент состоят в семье',
                        type: 1,
                        params: { name: "none" }
                    },
                ],
            },
            {
                title: 'Уровень 2',
                umenu: [
                    {
                        title: 'Прирост к зарплатам строителя и садовника на 30%',
                        text: 'Для выполнения вам необходимо выполнить 2000 меток садовника или строителя.',
                        type: 1,
                        params: { name: "none" }
                    },
                    {
                        title: 'Доп. награда при получении уровня',
                        text: '$250.000 на счёт семьи',
                        type: 1,
                        params: { name: "none" }
                    },
                ],
            },
            {
                title: 'Уровень 3',
                umenu: [
                    {
                        title: 'Прирост к зарплатам водителя автобуса на 30%',
                        text: 'Для выполнения вам необходимо выполнить 300 рейсов на любом из автобусов.',
                        type: 1,
                        params: { name: "none" }
                    },
                    {
                        title: 'Доп. награда при получении уровня',
                        text: '$500.000 на счёт семьи',
                        type: 1,
                        params: { name: "none" }
                    },
                ],
            },
            {
                title: 'Уровень 4',
                umenu: [
                    {
                        title: 'Прирост к зарплате фотографа на 30%',
                        text: 'Для выполнения вам необходимо выполнить 2500 меток фотографов.',
                        type: 1,
                        params: { name: "none" }
                    },
                    {
                        title: 'Доп. награда при получении уровня',
                        text: '$750.000 на счёт семьи',
                        type: 1,
                        params: { name: "none" }
                    },
                ],
            },
            {
                title: 'Уровень 5',
                umenu: [
                    {
                        title: 'Прирост к зарплате инкассатора на 30%',
                        text: 'Для выполнения вам необходимо выполнить 2500 меток инкассаторов.',
                        type: 1,
                        params: { name: "none" }
                    },
                    {
                        title: 'Доп. награда при получении уровня',
                        text: '$1.500.000 на счёт семьи',
                        type: 1,
                        params: { name: "none" }
                    },
                ],
            },
            {
                title: 'Уровень 6',
                umenu: [
                    {
                        title: 'Со зарплат на работах садовник, строителя, инкассатор, водитель автобуса в общак семьи поступает 30% сверху от выручки',
                        text: 'Продать 100.000 единиц рыбы',
                        type: 1,
                        params: { name: "none" }
                    },
                    {
                        title: 'Доп. награда при получении уровня',
                        text: '$7.500.000 на счёт семьи',
                        type: 1,
                        params: { name: "none" }
                    },
                ],
            }
        ]
    };
    phone.showMenu(menu);
};

phone.showAppFractionUpgrade2 = async function() {

    let fData = await fraction.getData(user.getCache('fraction_id2'));

    let menu = {
        UUID: 'fraction2',
        title: `Список улучшений`,
        items: []
    };

    if (!fData.get('is_war') && !fData.get('is_mafia')) {
        if (fData.get('spawn_x') !== 0) {
            menu.items.push(
                {
                    title: 'Спавн организации',
                    umenu: [
                        {
                            title: 'Отказаться от улучшения',
                            type: 1,
                            clickable: true,
                            params: { name: "unsetSpawn" }
                        }
                    ],
                }
            );
        }
        else {
            if (fData.get('money') >= 50) {
                menu.items.push(
                    {
                        title: 'Спавн организации',
                        umenu: [
                            {
                                title: `Улучшить за ${methods.cryptoFormat(50, 0)}`,
                                text: `Доступно только, если есть большой склад с улучшением`,
                                type: 1,
                                clickable: true,
                                params: { name: "setSpawn" }
                            }
                        ],
                    }
                );
            }
            else {
                menu.items.push(
                    {
                        title: 'Спавн организации',
                        umenu: [
                            {
                                title: `Не хватает ${methods.cryptoFormat(50 - fData.get('money'), 0)} для улучшения`,
                                type: 1,
                                params: { name: "none" }
                            }
                        ],
                    }
                );
            }
        }
    }

    if (fData.get('is_shop')) {
        menu.items.push(
            {
                title: 'Ограбления магазинов',
                umenu: [
                    {
                        title: 'Отказаться от улучшения',
                        type: 1,
                        clickable: true,
                        params: { name: "unsetShop" }
                    }
                ],
            }
        );
    }
    else {
        if (fData.get('money') >= 50) {
            menu.items.push(
                {
                    title: 'Ограбления магазинов',
                    umenu: [
                        {
                            title: `Улучшить за ${methods.cryptoFormat(50, 0)}`,
                            text: `Обслуживание в 1 реальный день ${methods.cryptoFormat(5, 0)}`,
                            type: 1,
                            clickable: true,
                            params: { name: "setShop" }
                        }
                    ],
                }
            );
        }
        else {
            menu.items.push(
                {
                    title: 'Ограбления магазинов',
                    umenu: [
                        {
                            title: `Не хватает ${methods.cryptoFormat(50 - fData.get('money'), 0)} для улучшения`,
                            type: 1,
                            params: { name: "none" }
                        }
                    ],
                }
            );
        }
    }


    /*if (fData.get('is_war')) {
        menu.items.push(
            {
                title: 'Война за территории',
                umenu: [
                    {
                        title: 'Отказаться от улучшения',
                        type: 1,
                        clickable: true,
                        params: { name: "unsetWar" }
                    }
                ],
            }
        );
    }
    else {
        if (fData.get('money') >= 100) {
            menu.items.push(
                {
                    title: 'Война за территории',
                    umenu: [
                        {
                            title: `Улучшить за ${methods.cryptoFormat(100, 0)}`,
                            text: `Обслуживание в 1 реальный день ${methods.cryptoFormat(10, 0)}`,
                            type: 1,
                            clickable: true,
                            params: { name: "setWar" }
                        }
                    ],
                }
            );
        }
        else {
            menu.items.push(
                {
                    title: 'Война за территории',
                    umenu: [
                        {
                            title: `Не хватает ${methods.cryptoFormat(100 - fData.get('money'), 0)} для улучшения`,
                            type: 1,
                            params: { name: "none" }
                        }
                    ],
                }
            );
        }
    }*/

    phone.showMenu(menu);
};

phone.showAppFractionDispatcherList = function() {

    try {
        let menu = {
            UUID: 'fraction',
            title: `Диспетчерская`,
            items: []
        };

        let menuItem = {
            title: 'Список вызовов',
            umenu: [],
        };

        dispatcher.getItemList().forEach((item, i) => {
            if (i > 50)
                return;
            try {
                let itemSmall = phone.getMenuItem(
                    `${i}. ${methods.removeQuotesAll(item.title)} [${item.time}]`,
                    `Район: ${methods.removeQuotesAll(item.street1)}`,
                    { name: "dispatcherAccept", title: methods.removeQuotesAll(item.title), desc: methods.removeQuotesAll(item.desc), street1: methods.removeQuotesAll(item.street1), withCoord: item.withCoord, posX: item.x, posY: item.y, p: item.phone },
                    1,
                    '',
                    true,
                );
                menuItem.umenu.push(itemSmall);
            }
            catch (e) {
                methods.debug(e);
            }
        });

        menu.items.push(menuItem);
        phone.showMenu(menu);
    }
    catch (e) {
        methods.debug(e);
    }
};

phone.showAppFractionDispatcherLoc = function() {

    let menu = {
        UUID: 'fraction',
        title: `Диспетчерская`,
        items: []
    };

    let menuItem = {
        title: 'Локальные коды',
        umenu: [],
    };

    let item = phone.getMenuItem(
        'Код 0',
        'Необходима немедленная поддержка',
        { name: "codeLoc", code: 0},
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    item = phone.getMenuItem(
        'Код 1',
        'Информация подтверждена',
        { name: "codeLoc", code: 1},
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    item = phone.getMenuItem(
        'Код 2',
        'Приоритетный вызов (Без сирен / Со стобоскопами)',
        { name: "codeLoc", code: 2},
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    item = phone.getMenuItem(
        'Код 3',
        'Срочный вызов (Сирены, Стробоскопы)',
        { name: "codeLoc", code: 3},
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    item = phone.getMenuItem(
        'Код 4',
        'Помощь не требуется. Все спокойно.',
        { name: "codeLoc", code: 4},
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    item = phone.getMenuItem(
        'Код 5',
        'Попросить держаться подальше.',
        { name: "codeLoc", code: 5},
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    item = phone.getMenuItem(
        'Код 6',
        'Задерживаюсь на месте',
        { name: "codeLoc", code: 6},
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    item = phone.getMenuItem(
        'Код 7',
        'Перерыв на обед',
        { name: "codeLoc", code: 7},
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    /*item = phone.getMenuItem(
        'Код 8',
        'Необходим сотрудник пожарного департамента',
        { name: "codeLoc", code: 8},
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    item = phone.getMenuItem(
        'Код 9',
        'Необходим сотрудник EMS',
        { name: "codeLoc", code: 9},
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);*/

    item = phone.getMenuItem(
        'Код 77',
        'Осторожно, возможна засада',
        { name: "codeLoc", code: 77},
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    item = phone.getMenuItem(
        'Код 99',
        'Черезвычайная ситуация',
        { name: "codeLoc", code: 99},
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    item = phone.getMenuItem(
        'Код 100',
        'В состоянии перехвата',
        { name: "codeLoc", code: 100},
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    menu.items.push(menuItem);
    phone.showMenu(menu);
};

phone.showAppFractionDispatcherDep = function() {

    let menu = {
        UUID: 'fraction',
        title: `Диспетчерская`,
        items: []
    };

    let menuItem = {
        title: 'Коды департамента',
        umenu: [],
    };

    let item = phone.getMenuItem(
        'Код 0',
        'Необходима немедленная поддержка',
        { name: "codeDep", code: 0},
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    item = phone.getMenuItem(
        'Код 1',
        'Информация подтверждена',
        { name: "codeDep", code: 1},
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    item = phone.getMenuItem(
        'Код 2',
        'Приоритетный вызов (Без сирен / Со стобоскопами)',
        { name: "codeDep", code: 2},
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    item = phone.getMenuItem(
        'Код 3',
        'Срочный вызов (Сирены, Стробоскопы)',
        { name: "codeDep", code: 3},
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    item = phone.getMenuItem(
        'Код 4',
        'Помощь не требуется. Все спокойно.',
        { name: "codeDep", code: 4},
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    item = phone.getMenuItem(
        'Код 5',
        'Попросить держаться подальше.',
        { name: "codeDep", code: 5},
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    item = phone.getMenuItem(
        'Код 6',
        'Задерживаюсь на месте',
        { name: "codeDep", code: 6},
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    item = phone.getMenuItem(
        'Код 7',
        'Перерыв на обед',
        { name: "codeDep", code: 7},
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    item = phone.getMenuItem(
        'Код 8',
        'Необходим сотрудник пожарного департамента',
        { name: "codeDep", code: 8},
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    item = phone.getMenuItem(
        'Код 9',
        'Необходим сотрудник EMS',
        { name: "codeDep", code: 9},
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    item = phone.getMenuItem(
        'Код 77',
        'Осторожно, возможна засада',
        { name: "codeDep", code: 77},
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    item = phone.getMenuItem(
        'Код 99',
        'Черезвычайная ситуация',
        { name: "codeDep", code: 99},
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    item = phone.getMenuItem(
        'Код 100',
        'В состоянии перехвата',
        { name: "codeDep", code: 100},
        1,
        '',
        true,
    );
    menuItem.umenu.push(item);

    menu.items.push(menuItem);
    phone.showMenu(menu);
};

phone.showLoad = function() {
    let menu = {
        UUID: 'load',
        title: 'Идёт загрузка',
        items: [
            {
                title: '',
                umenu: [
                    {
                        title: "Ваше приложение загружается...",
                        type: 1,
                        params: { name: "loading", skip: true }
                    }
                ],
            },
        ],
    };

    chat.show(true);
    chat.activate(true);
    methods.blockKeys(false);
    mp.gui.cursor.show(false, true);

    phone.showMenu(menu);
};

phone.showNoNetwork = function() {
    let menu = {
        UUID: 'error',
        title: 'Ошибка',
        items: [
            {
                title: 'Нет сети...',
                umenu: [
                    {
                        title: "Приложение не работает без подключения к сети",
                        type: 1,
                        params: { name: "error", skip: true }
                    }
                ],
            },
        ],
    };

    phone.showMenu(menu);
};

phone.showMenu = function(menu) {
    let data = {
        type: 'updateMenu',
        menu: menu
    };

    ui.callCef('phone' + phone.getType(), JSON.stringify(data));
};

phone.getMenuItem = function(title, text, params = { name: "null" }, type = 1, img = undefined, clickable = false, value = undefined, background = undefined) {
    return {
        title: title,
        text: text,
        type: type,
        img: img,
        background: background,
        clickable: clickable,
        value: value,
        params: params
    };
};

phone.getMenuItemTitle = function(title, text, params = { name: "null" }, img = undefined, clickable = false, background = undefined) {
    return {
        title: title,
        text: text,
        type: 0,
        value: img,
        background: background,
        clickable: clickable,
        params: params
    };
};

phone.getMenuItemButton = function(title, text, params = { name: "null" }, img = undefined, clickable = false, background = undefined) {
    return {
        title: title,
        text: text,
        type: 1,
        img: img,
        background: background,
        clickable: clickable,
        params: params
    };
};

phone.getMenuItemCheckbox = function(title, text, checked = false, params = { name: "null" }, img = undefined, clickable = false, background = undefined) {
    return {
        title: title,
        text: text,
        type: 2,
        img: img,
        value: checked,
        background: background,
        clickable: clickable,
        params: params
    };
};

phone.getMenuItemUser = function(title, text, isOnline = false, params = { name: "null" }, img = undefined, clickable = false, background = undefined) {
    return {
        title: title,
        text: text,
        type: 4,
        img: img,
        online: isOnline,
        background: background,
        clickable: clickable,
        params: params
    };
};

phone.getMenuItemRadio = function(title, text, selectTitle, selectItems, params = { name: "null" }, img = undefined, clickable = false, background = undefined) {
    return {
        title: title,
        text: text,
        type: 5,
        img: img,
        background: background,
        clickable: clickable,
        scrollbarTitle: selectTitle,
        scrollbar: selectItems,
        params: params
    };
};

phone.getMenuItemImg = function(height = 150, params = { name: "null" }, img = undefined, clickable = false, background = undefined) {
    return {
        type: 6,
        value: img,
        background: background,
        clickable: clickable,
        height: height,
        params: params
    };
};

phone.getMenuItemModal = function(title, text, modalTitle, modalText, modalYes = 'Применить', modalNo = 'Отмена', params = { name: "null" }, img = undefined, clickable = false, background = undefined) {
    return {
        title: title,
        text: text,
        type: 7,
        modalTitle: modalTitle,
        modalText: modalText,
        modalButton: [modalNo, modalYes],
        img: img,
        background: background,
        clickable: clickable,
        params: params
    };
};

phone.getMenuItemModalInput = function(title, text, modalTitle, modalValue = '', modalYes = 'Применить', modalNo = 'Отмена', params = { name: "null" }, img = undefined, clickable = false, background = undefined) {
    return {
        title: title,
        text: text,
        type: 8,
        modalTitle: modalTitle,
        modalValue: modalValue,
        modalButton: [modalNo, modalYes],
        img: img,
        background: background,
        clickable: clickable,
        params: params
    };
};

phone.getMenuItemTable = function(title, columns, data, readonly = true, params = { name: "null" }, clickable = false, background = undefined) {
    return {
        type: 10,
        title: title,
        columns: columns,
        data: data,
        readonly: readonly,
        params: params,
        background: background,
        clickable: clickable,
    };
};

phone.getMenuMainItem = function(title, items, hidden = false) {
    return {
        title: title,
        hidden: hidden,
        umenu: items,
    };
};

phone.consoleAwait = async function(text, count = 100, delay = 200) {
    for (let i = 0; i < count; i++) {
        let network = 6 - phone.network;
        if (phone.network === 0) {
            phone.addConsoleCommand('Connection closed');
            return;
        }
        await methods.sleep(methods.getRandomInt(1, delay + network * 100));
        phone.addConsoleCommand(text + ctos.generateCode(methods.getRandomInt(32, 65)));
    }
    return true;
};

phone.consoleWget = async function(text, delay = 200) {
    for (let i = 0; i < 100; i++) {
        let network = 6 - phone.network;
        if (phone.network === 0) {
            phone.addConsoleCommand('Connection closed');
            return;
        }
        await methods.sleep(methods.getRandomInt(1, delay + network * 100));
        phone.addConsoleCommand(`${text} ${ctos.generateLoad(i + 1)} (${i + 1}%)`);
    }
    return true;
};

phone.consoleLoad = async function(text, delay = 200) {
    for (let i = 0; i < 100; i++) {
        let network = 6 - phone.network;
        if (phone.network === 0) {
            phone.addConsoleCommand('Connection closed');
            return;
        }
        await methods.sleep(methods.getRandomInt(1, delay + network * 100));
        phone.addConsoleCommand(`${text} ${ctos.generateLoad(i + 1)} (${i + 1}%)`);
    }
    return true;
};

phone.consoleCallback = async function(command) {

    try {
        let args = command.split(' ');
        let cmd = args[0];
        args.shift();

        if (phone.network === 0) {
            phone.addConsoleCommand('No internet connection');
            return;
        }
        if (mp.players.local.dimension > 0) {
            phone.addConsoleCommand('You cant use it in dimension (Virtual World)');
            return;
        }
        if (ui.isGreenZone()) {
            phone.addConsoleCommand('You cant use it in GreenZone');
            return;
        }

        if (cmd === 'help') {
            if (user.getCache('stats_darknet') > 0)
                phone.addConsoleCommand('GNU bash, version 5.0.0(1)-release (x86_64-pc-linux-gnu)');
            else
                phone.addConsoleCommand('GNU bash, version 4.3.48(1)-release (x86_64-pc-linux-gnu)');
            phone.addConsoleCommand(' ');
            phone.addConsoleCommand('help');
            phone.addConsoleCommand('ecorp -h');
            phone.addConsoleCommand('trust');
            phone.addConsoleCommand('apt-get update');
            phone.addConsoleCommand('apt-get install [package]');
            phone.addConsoleCommand('ls');
            phone.addConsoleCommand('bash [filename] [params]');
            phone.addConsoleCommand('wget [url]');
            if (user.getCache('stats_darknet') > 1)
                phone.addConsoleCommand('python [filename] [params]');
        }
        else if (cmd === 'apt-get') {

            /*if (user.isGos()) {
                phone.addConsoleCommand('Access Denied');
                return;
            }*/

            if (args.length === 0 || args[0] === '-h') {
                phone.addConsoleCommand('Usage: apt-get [options]');
                phone.addConsoleCommand(' ');
                phone.addConsoleCommand('apt-get update');
                phone.addConsoleCommand('apt-get install [package]');
            }
            else if (args[0] === 'update') {
                quest.gang(false, -1, 5);
                if (user.getCache('stats_darknet') > 0) {
                    phone.addConsoleCommand('Reading package lists... Done');
                    await methods.sleep(1000 + methods.getRandomInt(1, 500));
                    phone.addConsoleCommand('Building dependency tree');
                    await methods.sleep(1000 + methods.getRandomInt(1, 500));
                    phone.addConsoleCommand('Reading state information... Done');
                    await methods.sleep(1000 + methods.getRandomInt(1, 500));
                    phone.addConsoleCommand('All packages is updated');
                    return;
                }
                try {
                    phone.addConsoleCommand('Reading package lists... Done');
                    await methods.sleep(1000 + methods.getRandomInt(1, 500));
                    phone.addConsoleCommand('Building dependency tree');
                    await methods.sleep(1000 + methods.getRandomInt(1, 500));
                    phone.addConsoleCommand('Reading state information... Done');
                    await methods.sleep(1000 + methods.getRandomInt(1, 500));
                    for (let i = 0; i < 300; i++) {
                        let network = 6 - phone.network;
                        if (phone.network === 0) {
                            phone.addConsoleCommand('Connection closed');
                            return;
                        }
                        await methods.sleep(methods.getRandomInt(1, 200 + network * 100));
                        phone.addConsoleCommand('Download package from https://fsoc.sh/' + ctos.generateCode(methods.getRandomInt(32, 65)));
                    }
                    for (let i = 0; i < 300; i++) {
                        let network = 6 - phone.network;
                        if (phone.network === 0) {
                            phone.addConsoleCommand('Connection closed');
                            return;
                        }
                        await methods.sleep(methods.getRandomInt(1, 200 + network * 100));
                        phone.addConsoleCommand('Download package from https://xss-game.appspot.com/' + ctos.generateCode(methods.getRandomInt(32, 65)));
                    }
                    for (let i = 0; i < 300; i++) {
                        let network = 6 - phone.network;
                        if (phone.network === 0) {
                            phone.addConsoleCommand('Connection closed');
                            return;
                        }
                        await methods.sleep(methods.getRandomInt(1, 200 + network * 100));
                        phone.addConsoleCommand('Download package from https://i239.bxjyb2jvda.net/' + ctos.generateCode(methods.getRandomInt(32, 65)));
                    }
                    await methods.sleep(500);
                    phone.addConsoleCommand('All packages is updated');
                    user.set('stats_darknet', 1);
                    user.save()
                }
                catch (e) {
                    methods.debug(e);
                }
            }
            else if (args[0] === 'install') {
                if (user.getCache('stats_darknet') === 0) {
                    phone.addConsoleCommand('Please update packages');
                    return;
                }
                if (args.length === 1 || args[1] === '-h') {
                    phone.addConsoleCommand('Usage: apt-get install [package]');
                    phone.addConsoleCommand(' ');
                    phone.addConsoleCommand('All packages are downloaded only for the current session.');
                    phone.addConsoleCommand('Package list:');
                    phone.addConsoleCommand('python');
                    phone.addConsoleCommand('arp-scan');
                    phone.addConsoleCommand('route');
                }
                else if (args[1] === 'python') {

                    if (user.getCache('stats_darknet') > 1) {
                        phone.addConsoleCommand('Look up');
                        phone.addConsoleCommand('Package has been installed');
                        return;
                    }

                    for (let i = 0; i < 100; i++) {
                        let network = 6 - phone.network;
                        if (phone.network === 0) {
                            phone.addConsoleCommand('Connection closed');
                            return;
                        }
                        await methods.sleep(methods.getRandomInt(1, 50 + network * 100));
                        phone.addConsoleCommand(`Download ${args[1].toUpperCase()} package from https://i239.bxjyb2jvda.net/` + ctos.generateCode(methods.getRandomInt(32, 65)));
                    }
                    for (let i = 0; i < 200; i++) {
                        await methods.sleep(methods.getRandomInt(1, 100));
                        phone.addConsoleCommand(`Install ${args[1].toUpperCase()} package ` + ctos.generateCode(methods.getRandomInt(32, 65)));
                    }
                    await methods.sleep(500);
                    phone.addConsoleCommand(`Package ${args[1].toUpperCase()} has been installed`);
                    user.set('stats_darknet', 2);
                    user.save()
                }
                else if (args[1] === 'arp-scan' || args[1] === 'wget' || args[1] === 'route') {
                    for (let i = 0; i < 300; i++) {
                        let network = 6 - phone.network;
                        if (phone.network === 0) {
                            phone.addConsoleCommand('Connection closed');
                            return;
                        }
                        await methods.sleep(methods.getRandomInt(1, 50 + network * 100));
                        phone.addConsoleCommand(`Download ${args[1].toUpperCase()} package from https://i239.bxjyb2jvda.net/` + ctos.generateCode(methods.getRandomInt(32, 65)));
                    }
                    for (let i = 0; i < 200; i++) {
                        await methods.sleep(methods.getRandomInt(1, 100));
                        phone.addConsoleCommand(`Install ${args[1].toUpperCase()} package ` + ctos.generateCode(methods.getRandomInt(32, 65)));
                    }
                    phone.addConsoleCommand(`Package ${args[1].toUpperCase()} has been installed`);
                    user.set('package-' + args[1].toLowerCase(), true);
                }
                else {
                    phone.addConsoleCommand(`Package ${args[1]} not found. Please use: apt-get install -h`);
                }
            }
        }
        else if (cmd === 'wget') {
            /*if (user.isGos()) {
                phone.addConsoleCommand('Access Denied');
                return;
            }*/
            if (args.length === 0 || args[0] === '-h') {
                phone.addConsoleCommand('Usage: wget [url]');
                phone.addConsoleCommand('For example: wget https://example.com/');
                phone.addConsoleCommand('For example: wget https://example.com/path/');
            }
            else if (args[0] === 'https://state-99.com/' || args[0] === 'https://state-99.com') {
                await phone.consoleWget('Dwnld vunlocker.sh', 10);
                phone.addConsoleCommand(`File vunlocker.sh has been downloaded`);
                user.set('file-' + 'vunlocker.sh', true);
                await phone.consoleWget('Dwnld vengine.sh', 10);
                phone.addConsoleCommand(`File vengine.sh has been downloaded`);
                user.set('file-' + 'vengine.sh', true);
                await phone.consoleWget('Dwnld vslower.sh', 10);
                phone.addConsoleCommand(`File vslower.sh has been downloaded`);
                user.set('file-' + 'vslower.sh', true);
            }
            else if (args[0] === 'https://fsoc.sh/' || args[0] === 'https://fsoc.sh') {
                await phone.consoleWget('Dwnld atmbackdoor.py', 50);
                phone.addConsoleCommand(`File atmbackdoor.py has been downloaded`);
                user.set('file-' + 'atmbackdoor.py', true);
            }
            else if (args[0] === 'https://i239.bxjyb2jvda.net/' || args[0] === 'https://i239.bxjyb2jvda.net') {
                if (user.getCache('stats_darknet') < 35) {
                    phone.addConsoleCommand('Look up');
                    phone.addConsoleCommand('Access Denied');
                    return;
                }
                await phone.consoleWget('Dwnld lmh.py', 50);
                phone.addConsoleCommand(`File lmh.py has been downloaded`);
                user.set('file-' + 'lmh.py', true);
            }
            else if (args[0] === 'https://4C4F4F4B205550.com/' || args[0] === 'https://4C4F4F4B205550.com') {
                if (user.getCache('stats_darknet') < 35) {
                    phone.addConsoleCommand('Look up');
                    phone.addConsoleCommand('Access Denied');
                    return;
                }
                await phone.consoleWget('Dwnld alone.py', 50);
                phone.addConsoleCommand(`File alone.py has been downloaded`);
                user.set('file-' + 'alone.py', true);
            }
            else if (args[0] === 'https://retell.in/' || args[0] === 'https://retell.in') {
                if (user.getCache('stats_darknet') < 35) {
                    phone.addConsoleCommand('Look up');
                    phone.addConsoleCommand('Access Denied');
                    return;
                }
                await phone.consoleWget('Dwnld deadinside.py', 50);
                phone.addConsoleCommand(`File deadinside.py has been downloaded`);
                user.set('file-' + 'deadinside.py', true);
            }
            else if (args[0] === 'https://state-99.com/publicApi' || args[0] === 'https://state-99.com/publicApi') {
                if (user.getCache('stats_darknet') < 35) {
                    phone.addConsoleCommand('Look up');
                    phone.addConsoleCommand('Access Denied');
                    return;
                }
                await phone.consoleWget('Dwnld arptop.py', 50);
                phone.addConsoleCommand(`File arptop.py has been downloaded`);
                user.set('file-' + 'arptop.py', true);
            }
            else if (args[0] === 'https://shodan.io' || args[0] === 'https://shodan.io') {
                if (user.getCache('stats_darknet') < 40) {
                    phone.addConsoleCommand('Look up');
                    phone.addConsoleCommand('Access Denied');
                    return;
                }
                await phone.consoleWget('Dwnld traffic.py', 50);
                phone.addConsoleCommand(`File traffic.py has been downloaded`);
                user.set('file-' + 'traffic.py', true);
            }
            else if (args[0] === 'https://shodan.io/light' || args[0] === 'https://shodan.io/light') {
                if (user.getCache('stats_darknet') < 90) {
                    phone.addConsoleCommand('Look up');
                    phone.addConsoleCommand('Access Denied');
                    return;
                }
                await phone.consoleWget('Dwnld fsoc.py', 100);
                phone.addConsoleCommand(`File fsoc.py has been downloaded`);
                user.set('file-' + 'fsoc.py', true);
            }
            else if (args[0] === 'https://shodan.io/talk' || args[0] === 'https://shodan.io/talk') {
                if (user.getCache('stats_darknet') < 90) {
                    phone.addConsoleCommand('Look up');
                    phone.addConsoleCommand('Access Denied');
                    return;
                }
                await phone.consoleWget('Dwnld fnetwork.py', 100);
                phone.addConsoleCommand(`File fnetwork.py has been downloaded`);
                user.set('file-' + 'fnetwork.py', true);
            }
            else {
                phone.addConsoleCommand('Access denied');
            }
        }
        else if (cmd === 'ls') {
            ctos.bashFileList.forEach(file => {
                if (user.hasCache(`file-${file}.sh`))
                    phone.addConsoleCommand(`${file}.sh`);
            });
            ctos.pythonFileList.forEach(file => {
                if (user.hasCache(`file-${file}.py`))
                    phone.addConsoleCommand(`${file}.py`);
            });
        }
        else if (cmd === 'dn' || cmd === 'dednet') {
            phone.addConsoleCommand(`You are not alone`);
        }
        else if (cmd === 'trust') {
            phone.addConsoleCommand(`DARKNET trust level: ${user.getCache('stats_darknet')}%`);
            phone.addConsoleCommand(`You need update trust level, if you want hack the fucking world`);
        }
        else if (cmd === 'python') {
            /*if (user.isGos()) {
                phone.addConsoleCommand('Access Denied');
                return;
            }*/
            if (args.length === 0 || args[0] === '-h') {
                phone.addConsoleCommand('Usage: python [file] [params]');
            }
            else if (args[0] === 'alone.py' && user.hasCache('file-alone.py')) {
                if (args.length !== 3) {
                    phone.addConsoleCommand('Usage: python alone.py [key] [id]');
                    return;
                }
                if (args[1] === 'AABABBAAABABBABAAABAAAABBABBABBAABABAAABAABBB') {
                    await phone.consoleLoad('You are not alone', 500);
                    phone.toMainUMenu();
                    phone.showLoad();
                    await methods.sleep(100);
                    mp.events.callRemote('server:phone:getUserInfo', methods.parseInt(args[2]));
                }
                else {
                    phone.addConsoleCommand('Access denied');
                }
            }
            else if (args[0] === 'lmh.py' && user.hasCache('file-lmh.py')) {
                if (args.length !== 3) {
                    phone.addConsoleCommand('Usage: python lmh.py [key] [serial]');
                    return;
                }
                if (args[1] === 'WARISGONE') {
                    await phone.consoleLoad('War is over', 500);
                    phone.toMainUMenu();
                    phone.showLoad();
                    await methods.sleep(100);
                    mp.events.callRemote('server:phone:getGunInfo', methods.removeQuotes2(methods.removeQuotes(args[2])));
                }
                else {
                    phone.addConsoleCommand('Access denied');
                }
            }
            else if (args[0] === 'deadinside.py' && user.hasCache('file-deadinside.py')) {
                if (args.length !== 3) {
                    phone.addConsoleCommand('Usage: python deadinside.py [key] [numberplate]');
                    return;
                }
                if (args[1] === 'MR.DEADINSIDE') {
                    await phone.consoleLoad('You are dead', 500);
                    phone.toMainUMenu();
                    phone.showLoad();
                    await methods.sleep(100);
                    mp.events.callRemote('server:phone:getVehInfo', methods.removeQuotes2(methods.removeQuotes(args[2])));
                }
                else {
                    phone.addConsoleCommand('Access denied');
                }
            }
            else if (args[0] === 'arptop.py' && user.hasCache('file-arptop.py')) {
                if (args.length !== 3) {
                    phone.addConsoleCommand('Usage: python arptop.py [key] [bid]');
                    return;
                }
                if (args[1] === 'APPIRPTOP') {
                    await phone.consoleLoad('OMG ITS REALLY', 500);
                    phone.toMainUMenu();
                    phone.showLoad();
                    await methods.sleep(100);
                    mp.events.callRemote('server:business:log', methods.parseInt(args[2]));
                }
                else {
                    phone.addConsoleCommand('Access denied');
                }
            }
            else if (args[0] === 'atmbackdoor.py' && user.hasCache('file-atmbackdoor.py')) {
                if (args.length !== 5) {
                    phone.addConsoleCommand('Usage: python atmbackdoor.py [hash1] [hash2] [hash3] [hash4]');
                    return;
                }

                if (await user.hasById('atmTimeout')) {
                    phone.addConsoleCommand('Timeout: update system patches. Please wait.');
                    return;
                }
                if (isAtmHack) {
                    phone.addConsoleCommand('Just wait.');
                    return;
                }
                if (mp.players.local.vehicle) {
                    phone.addConsoleCommand('Access denied');
                    return;
                }

                isAtmHack = true;

                let userHash1 = args[1];
                let userHash2 = args[2];
                let userHash3 = args[3];
                let userHash4 = args[4];

                let atmHandle = timer.getAtmHandle();
                let hash1 = methods.md5(atmHandle.toString()).slice(0, 3);
                let hash2 = methods.md5(atmHandle.toString()).slice(4, 7);
                let hash3 = methods.md5(atmHandle.toString()).slice(8, 11);
                let hash4 = methods.md5(atmHandle.toString()).slice(12, 15);

                dispatcher.sendLocalPos('Код 3', `Сработала система безопасности банкомата, взлом происходил с телефона: ${methods.phoneFormat(user.getCache('phone'))}`, mp.players.local.position, 2, false);
                dispatcher.sendLocalPos('Код 3', `Сработала система безопасности банкомата, взлом происходил с телефона: ${methods.phoneFormat(user.getCache('phone'))}`, mp.players.local.position, 3, false);
                dispatcher.sendLocalPos('Код 3', `Сработала система безопасности банкомата, взлом происходил с телефона: ${methods.phoneFormat(user.getCache('phone'))}`, mp.players.local.position, 5, false);

                await phone.consoleLoad('Installing backdoor');
                await phone.consoleAwait('Scanning hashes ');
                await phone.consoleAwait('Send package ', 100, 100);

                if (userHash1 !== hash1 || userHash2 !== hash2 || userHash3 !== hash3 || userHash4 !== hash4) {
                    phone.addConsoleCommand('Hacking attempt, access denied');
                    user.setById('atmTimeout', true);
                    isAtmHack = false;
                    return;
                }

                if (!timer.isAtm()) {
                    phone.addConsoleCommand('Connection closed by timeout. Maybe you are too far');
                    isAtmHack = false;
                    return;
                }

                if (methods.getRandomInt(0, 100) < user.getCache('stats_darknet')) {

                    await phone.consoleLoad('Download keys', 50);

                    if (phone.getType() === 0)
                        return;

                    let money = methods.getRandomInt(4000, 6000) / 1000;

                    phone.addConsoleCommand('Success. The wallet was replenished in the amount of ' + methods.cryptoFormat(money));
                    user.setById('atmTimeout', true);

                    user.addCryptoMoney(money, 'Взлом банкомата');

                    if (user.getCache('fraction_id2') > 0)
                        fraction.addMoney(user.getCache('fraction_id2'), money / 10, `Взлом с банкомата (${user.getCache('name')})`);

                    if (user.getCache('fraction_id2') > 0)
                        fraction.set(user.getCache('fraction_id2'), 'orderAtm', await fraction.get(user.getCache('fraction_id2'), 'orderAtm') + 1);

                    user.set('st_order_atm_f', user.getCache('st_order_atm_f') + 1);
                    user.set('st_order_atm_d', user.getCache('st_order_atm_d') + 1);

                    if (user.getCache('stats_darknet') < 60 && user.getCache('stats_darknet') >= 20) {
                        user.set('stats_darknet', user.getCache('stats_darknet') + 1);
                    }
                }
                else {
                    phone.addConsoleCommand('Error, try again');
                }
                isAtmHack = false;
            }
            else if (args[0] === 'traffic.py' && user.hasCache('file-traffic.py')) {
                await phone.consoleAwait('Scanning hashes');
                await phone.consoleAwait('Send package ', 100, 100);

                if (methods.getRandomInt(0, 99) < user.getCache('stats_darknet')) {
                    await phone.consoleLoad('Download keys', 50);
                    if (phone.getType() === 0)
                        return;
                    let money = methods.getRandomInt(3000, 5000) / 1000;
                    phone.addConsoleCommand('Success. The wallet was replenished in the amount of ' + methods.cryptoFormat(money));
                    if (user.getCache('stats_darknet') < 50 && user.getCache('stats_darknet') >= 40) {
                        user.set('stats_darknet', user.getCache('stats_darknet') + 1);
                    }
                    mp.events.callRemote('server:trafficDestroy');
                }
                else {
                    user.giveWanted(50, 'Попытка взлома системы управления городом');
                    phone.addConsoleCommand('Error, try again');
                }
            }
            else if (args[0] === 'fsoc.py' && user.hasCache('file-fsoc.py')) {
                await phone.consoleAwait('Scanning hashes');
                await phone.consoleAwait('Send package ', 100, 100);

                if (methods.getRandomInt(0, 101) < user.getCache('stats_darknet')) {
                    await phone.consoleLoad('Download keys', 50);
                    if (phone.getType() === 0)
                        return;
                    let money = methods.getRandomInt(3000, 5000) / 1000;
                    phone.addConsoleCommand('Success. The wallet was replenished in the amount of ' + methods.cryptoFormat(money));
                    if (user.getCache('stats_darknet') < 100 && user.getCache('stats_darknet') >= 90) {
                        user.set('stats_darknet', user.getCache('stats_darknet') + 1);
                    }
                    mp.events.callRemote('server:cityDestroy')
                }
                else {
                    user.giveWanted(50, 'Попытка взлома системы управления городом');
                    phone.addConsoleCommand('Error, try again');
                }
            }
            else if (args[0] === 'fnetwork.py' && user.hasCache('file-fnetwork.py')) {
                await phone.consoleAwait('Scanning hashes');
                await phone.consoleAwait('Send package ', 100, 100);

                if (methods.getRandomInt(0, 101) < user.getCache('stats_darknet')) {
                    await phone.consoleLoad('Download keys', 50);
                    if (phone.getType() === 0)
                        return;
                    let money = methods.getRandomInt(3000, 5000) / 1000;
                    phone.addConsoleCommand('Success. The wallet was replenished in the amount of ' + methods.cryptoFormat(money));
                    if (user.getCache('stats_darknet') < 100 && user.getCache('stats_darknet') >= 90) {
                        user.set('stats_darknet', user.getCache('stats_darknet') + 1);
                    }
                    mp.events.callRemote('server:networkDestroy')
                }
                else {
                    user.giveWanted(50, 'Попытка взлома системы управления городом');
                    phone.addConsoleCommand('Error, try again');
                }
            }
        }
        else if (cmd === 'bash') {
            /*if (user.isGos()) {
                phone.addConsoleCommand('Access Denied');
                return;
            }*/
            if (args.length === 0 || args[0] === '-h') {
                phone.addConsoleCommand('Usage: bash [file] [params]');
            }
            else if (args[0] === 'vunlocker.sh' && user.hasCache('file-vunlocker.sh')) {
                if (args.length === 1) {
                    phone.addConsoleCommand('Usage: bash vunlocker.sh [hash]');
                    return;
                }
                let hash = args[1];
                let isFind = false;

                mp.vehicles.forEachInStreamRange(async (v, i) => {
                    if (phone.network === 0) {
                        phone.addConsoleCommand('Connection closed');
                        return;
                    }

                    if (v.getVariable('useless'))
                        return;

                    let dist = methods.distanceToPos(v.position, mp.players.local.position);
                    if (dist > 11)
                        return;


                    if (ui.isGreenZoneByPos(v.position))
                        return;

                    if (methods.md5(v.remoteId.toString()).slice(0, 6) === hash) {
                        isFind = true;
                        let vInfo = methods.getVehicleInfo(v.model);
                        if (vInfo.fuel_type === 3 || vInfo.class_name === "Super") {
                            //dispatcher.sendPos('Код 3', `Сработала система безопасности на транспорте ${vInfo.display_name} (${v.getNumberPlateText()})`, v.position);
                            await phone.consoleAwait('Send package ');
                            if (methods.getRandomInt(0, 100) < 30 + user.getCache('stats_darknet')) {
                                if (v.getVariable('fraction_id') > 0 || v.getVariable('isAdmin') || v.getVariable('useless')) {
                                    phone.addConsoleCommand('You cant unlock this vehicle type');
                                }
                                else {
                                    mp.events.callRemote('server:vehicle:lockStatus:hack', v.remoteId);
                                    phone.addConsoleCommand('Success');

                                    if (user.getCache('stats_darknet') < 20) {
                                        user.set('stats_darknet', user.getCache('stats_darknet') + 1);
                                    }
                                }
                            }
                            else {
                                phone.addConsoleCommand('Error, try again');
                            }
                        }
                        else {
                            phone.addConsoleCommand('You cant unlock this vehicle type');
                        }
                    }
                });

                if (!isFind)
                    phone.addConsoleCommand('Hash not found');
            }
            else if (args[0] === 'vengine.sh' && user.hasCache('file-vengine.sh')) {
                if (args.length === 1) {
                    phone.addConsoleCommand('Usage: bash vengine.sh [hash]');
                    return;
                }
                let hash = args[1];
                let isFind = false;

                mp.vehicles.forEachInStreamRange(async (v, i) => {
                    if (phone.network === 0) {
                        phone.addConsoleCommand('Connection closed');
                        return;
                    }

                    if (v.getVariable('useless'))
                        return;

                    let dist = methods.distanceToPos(v.position, mp.players.local.position);
                    if (dist > 30)
                        return;

                    if (methods.md5(v.remoteId.toString()).slice(0, 6) === hash) {
                        let vInfo = methods.getVehicleInfo(v.model);
                        isFind = true;
                        if (vInfo.fuel_type === 3 || vInfo.class_name === "Super") {
                            //dispatcher.sendPos('Код 3', `Сработала система безопасности на транспорте ${vInfo.display_name} (${v.getNumberPlateText()})`, v.position);
                            await phone.consoleAwait('Send package ', 50);
                            if (methods.getRandomInt(0, 100) < 10 + user.getCache('stats_darknet')) {
                                mp.events.callRemote('server:vehicle:engineStatus:hack', v.remoteId);
                                phone.addConsoleCommand('Success');

                                if (user.getCache('stats_darknet') < 10) {
                                    user.set('stats_darknet', user.getCache('stats_darknet') + 1);
                                }
                            }
                            else {
                                phone.addConsoleCommand('Error, try again');
                            }
                        }
                        else {
                            phone.addConsoleCommand('You cant unlock this vehicle');
                        }
                    }
                });

                if (!isFind)
                    phone.addConsoleCommand('Hash not found');
            }
            else if (args[0] === 'vslower.sh' && user.hasCache('file-vslower.sh')) {
                if (args.length === 1) {
                    phone.addConsoleCommand('Usage: bash vslower.sh [vname]');
                    return;
                }
                let hash = args[1];

                let currentVeh = null;

                mp.vehicles.forEachInStreamRange(async (v, i) => {
                    if (phone.network === 0) {
                        phone.addConsoleCommand('Connection closed');
                        return;
                    }

                    if (v.getVariable('useless'))
                        return;

                    let dist = methods.distanceToPos(v.position, mp.players.local.position);
                    if (dist > 30)
                        return;

                    let displayName = mp.game.vehicle.getDisplayNameFromVehicleModel(v.model);
                    if (displayName.toUpperCase() === hash.toUpperCase()) {
                        currentVeh = v;
                    }
                });

                if (mp.vehicles.exists(currentVeh) && (hash.toUpperCase() === 'BRICKADE' || hash.toUpperCase() === 'STOCKADE')) {

                    for (let i = 0; i < 25; i++) {
                        if (mp.vehicles.exists(currentVeh)) {
                            let dist = methods.distanceToPos(currentVeh.position, mp.players.local.position);
                            if (dist > 30) {
                                phone.addConsoleCommand('Max range 30m');
                                mp.events.callRemote('server:vehicles:speedLimit', currentVeh.remoteId, 0);
                                return;
                            }
                            let velocity = currentVeh.getVelocity();
                            let speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y + velocity.z * velocity.z);
                            if (hash.toUpperCase() === 'BRICKADE')
                                speed = Math.round(speed * 3.6) - 20;
                            else
                                speed = Math.round(speed * 3.6) - 3;
                            if (speed < 10)
                                speed = 10;
                            phone.addConsoleCommand(`Slowdown process ${(i + 1) * 4}%`);
                            mp.events.callRemote('server:vehicles:speedLimit', currentVeh.remoteId, speed);
                            await methods.sleep(1000);
                        }
                    }

                    if (mp.vehicles.exists(currentVeh))
                        mp.events.callRemote('server:vehicles:speedLimit', currentVeh.remoteId, 0);
                }
                else {
                    phone.addConsoleCommand('You can use this script for Stockade or Brickade vehicle');
                }
            }
            else {
                phone.addConsoleCommand('Access denied');
            }
        }
        else if (cmd === 'route') {
            phone.addConsoleCommand('Access denied');
        }
        else if (cmd === 'arp-scan') {
            /*if (user.isGos()) {
                phone.addConsoleCommand('Access Denied');
                return;
            }*/
            if (!user.hasCache('package-' + cmd)) {
                phone.addConsoleCommand(`${cmd}: command not found. Maybe do you want apt-get install ${cmd}? `);
                return;
            }

            if (args.length === 0 || args[0] === '-h') {
                phone.addConsoleCommand('Usage: arp-scan [options]');
                phone.addConsoleCommand(' ');
                phone.addConsoleCommand('arp-scan vehicles');
                phone.addConsoleCommand('arp-scan atm');
            }
            else if (args[0] === 'vehicles') {
                mp.vehicles.forEachInStreamRange(async (v, i) => {
                    if (phone.network === 0) {
                        phone.addConsoleCommand('Connection closed');
                        return;
                    }

                    let dist = methods.distanceToPos(v.position, mp.players.local.position);
                    if (dist > 10)
                        return;

                    await methods.sleep(methods.getRandomInt(1, 100));
                    phone.addConsoleCommand(`Scanning ${mp.game.vehicle.getDisplayNameFromVehicleModel(v.model)} | HASH: ${methods.md5(v.remoteId.toString()).slice(0, 6)} | DIST: ${dist.toFixed(2)}m`);
                });
            }
            else if (args[0] === 'atm') {
                if (phone.network === 0) {
                    phone.addConsoleCommand('Connection closed');
                    return;
                }
                await phone.consoleAwait('Search nearest atm hashes | ');
                if (!timer.isAtm()) {
                    phone.addConsoleCommand('ATM Not found');
                    return;
                }
                phone.addConsoleCommand('ATM has been found');
                let atmHandle = timer.getAtmHandle();
                phone.addConsoleCommand(`Hash1: ${methods.md5(atmHandle.toString()).slice(0, 3)}`);
                phone.addConsoleCommand(`Hash2: ${methods.md5(atmHandle.toString()).slice(4, 7)}`);
                phone.addConsoleCommand(`Hash3: ${methods.md5(atmHandle.toString()).slice(8, 11)}`);
                phone.addConsoleCommand(`Hash4: ${methods.md5(atmHandle.toString()).slice(12, 15)}`);
            }
        }
        else if (cmd === 'ecorp') {
            if (args.length === 0 || args[0] === '-h') {
                phone.addConsoleCommand('Usage: ecorp [options]');
                phone.addConsoleCommand(' ');
                phone.addConsoleCommand('Balance: ' + methods.cryptoFormat(user.getCryptoMoney()));
                phone.addConsoleCommand('Number: ' + user.getCache('crypto_card'));
                phone.addConsoleCommand(' ');
                phone.addConsoleCommand('Most used commands:');
                phone.addConsoleCommand('ecorp -h');
                phone.addConsoleCommand('ecorp -number');
                phone.addConsoleCommand('ecorp -balance');
                phone.addConsoleCommand('ecorp -coin -toBankCard [sum]');
                phone.addConsoleCommand('ecorp -send [coin number] [sum]');
                //phone.addConsoleCommand('ecorp -send -fraction [sum]');
                phone.addConsoleCommand('ecorp -fraction -create');
                phone.addConsoleCommand('ecorp -fraction -list');
                phone.addConsoleCommand('ecorp -car -getpos');
                phone.addConsoleCommand('ecorp -user -getpos');
                phone.addConsoleCommand('ecorp -drug -getpos');
                phone.addConsoleCommand('ecorp -money -clear');
            }
            else if (args[0] === '-number') {
                phone.addConsoleCommand('Number: ' + user.getCache('crypto_card'));
            }
            else if (args[0] === '-balance') {
                quest.gang(false, -1, 7);
                phone.addConsoleCommand('Balance: ' + methods.cryptoFormat(user.getCryptoMoney()));
            }
            else if (args[0] === '-coin') {
                if (args[1] === '-toBankCard') {
                    let sum = methods.parseFloat(args[2]);
                    if (sum < 0) {
                        phone.addConsoleCommand('Usage: ecorp -coin -toBankCard [sum]');
                        return;
                    }
                    if (sum > user.getCryptoMoney()) {
                        phone.addConsoleCommand('Error: You have not BitCoin');
                        return;
                    }
                    if (user.getCache('bank_card') < 1) {
                        phone.addConsoleCommand('Error: You have not bank card');
                        return;
                    }
                    quest.gang(false, -1, 8);
                    phone.addConsoleCommand('Transfer success');
                    user.removeCryptoMoney(sum, 'Обмен BitCoin');
                    user.addBankMoney(sum * 500, 'Обмен BitCoin');
                    user.sendSmsBankOperation(`Транзакция успешно прошла\nПолучено ~g~${methods.moneyFormat(sum * 500)}`, 'BitCoin');
                }
                else {
                    phone.addConsoleCommand('Usage: ecorp -coin -toBankCard [sum]');
                }
            }
            else if (args[0] === '-send') {
                /*if (args[1] === '-fraction') {
                    let sum = methods.parseFloat(args[2]);
                    if (sum < 0) {
                        phone.addConsoleCommand('Usage: ecorp -send -fraction [sum]');
                        return;
                    }
                    if (sum > user.getCryptoMoney()) {
                        phone.addConsoleCommand('Error: You have not BitCoin');
                        return;
                    }
                    phone.addConsoleCommand('Transfer to fraction success');
                    user.removeCryptoMoney(sum, 'Перевод BitCoin');
                    fraction.addMoney(user.getCache('fraction_id2'), sum, 'Перевод BitCoin от ' + user.getCache('name'));
                }
                else */if (args[1]) {
                    let sum = methods.parseFloat(args[2]);
                    if (sum < 0) {
                        phone.addConsoleCommand('Usage: ecorp -send [coin number] [sum]');
                        return;
                    }
                    if (sum > user.getCryptoMoney()) {
                        phone.addConsoleCommand('Error: You have not BitCoin');
                        return;
                    }
                    mp.events.callRemote('server:crypto:transferMoney', args[1], sum);
                }
                else {
                    phone.addConsoleCommand('Usage: ecorp -fraction -create');
                }
            }
            else if (args[0] === '-fraction') {
                if (args[1] === '-create') {
                    if (user.getCache('rep') < 100 && user.getCache('fraction_id2') == 0) {
                        mp.events.callRemote('server:phone:createFraction');
                        phone.toMainUMenu();
                        phone.showLoad();
                    }
                    else {
                        mp.game.ui.notifications.show(`~r~Необходимо иметь наихудшую репутацию и не состоять ни в каких фракциях`);
                        phone.addConsoleCommand('Access denied');
                    }
                }
                else if (args[1] === '-list') {
                    mp.events.callRemote('server:phone:fractionAll');
                    phone.toMainUMenu();
                    phone.showLoad();
                }
                else {
                    phone.addConsoleCommand('Usage: ecorp -fraction -create');
                    phone.addConsoleCommand('Usage: ecorp -fraction -list');
                }
            }
            else if (args[0] === '-car') {
                if (args[1] === '-getpos') {
                    /*if (weather.getHour() < 22 && weather.getHour() > 4) {
                        mp.game.ui.notifications.show('~r~Доступно только с 22 до 4 утра игрового времени');
                        return;
                    }*/

                    if (await user.hasById('grabVeh')) {
                        mp.game.ui.notifications.show('~r~Вы не можете сейчас сбыть транспорт');
                        return;
                    }

                    if (user.getCache('isSellLamar')) {
                        mp.game.ui.notifications.show('~r~Вы не можете сейчас сбыть транспорт, т.к. вы выполняете заказ Ламара');
                        return;
                    }

                    if (user.getCache('job') === 10) {
                        mp.game.ui.notifications.show('~r~Инкассаторам запрещено это действие');
                        return;
                    }

                    if (user.hasCache('isSellUser')) {
                        mp.game.ui.notifications.show(`~r~Вы уже получили задание на похищение`);
                        return;
                    }

                    if (user.hasCache('isSellCar')) {
                        mp.game.ui.notifications.show(`~r~Вы уже получили задание на угон`);
                        return;
                    }

                    if (user.hasCache('isSellMoney')) {
                        mp.game.ui.notifications.show(`~r~Вы уже получили задание отмыв денег`);
                        return;
                    }
                    user.set('isSellCar', true);
                    let posId = methods.getRandomInt(0, enums.spawnSellCar.length);
                    jobPoint.create(new mp.Vector3(enums.spawnSellCar[posId][0], enums.spawnSellCar[posId][1], enums.spawnSellCar[posId][2]), true, 3);
                    mp.game.ui.notifications.show(`~g~Метка была установлена`);

                    setTimeout(function () {
                        if (user.hasCache('isSellCar')) {
                            jobPoint.delete();
                            user.reset('isSellCar');
                            mp.game.ui.notifications.show(`~r~Метка на сдачу ТС была удалена`);
                        }
                    }, 900 * 1000);
                }
                else {
                    phone.addConsoleCommand('Usage: ecorp -car -getpos');
                }
            }
            else if (args[0] === '-drug') {
                if (args[1] === '-getpos') {
                    /*if (weather.getHour() < 22 && weather.getHour() > 4) {
                        mp.game.ui.notifications.show('~r~Доступно только с 22 до 4 утра игрового времени');
                        return;
                    }*/

                    if (await user.hasById('grabDrug')) {
                        mp.game.ui.notifications.show('~r~Вы не можете сейчас выполнить задание');
                        return;
                    }

                    if (user.getCache('isSellLamar')) {
                        mp.game.ui.notifications.show('~r~Вы не можете сейчас сбыть транспорт, т.к. вы выполняете заказ Ламара');
                        return;
                    }

                    if (user.getCache('job') === 10) {
                        mp.game.ui.notifications.show('~r~Инкассаторам запрещено это действие');
                        return;
                    }

                    if (user.hasCache('isSellUser')) {
                        mp.game.ui.notifications.show(`~r~Вы уже получили задание на похищение`);
                        return;
                    }

                    if (user.hasCache('isSellCar')) {
                        mp.game.ui.notifications.show(`~r~Вы уже получили задание на угон`);
                        return;
                    }

                    if (user.hasCache('isSellDrug')) {
                        mp.game.ui.notifications.show(`~r~Вы уже получили задание`);
                        return;
                    }

                    if (user.hasCache('isSellMoney')) {
                        mp.game.ui.notifications.show(`~r~Вы уже получили задание отмыв денег`);
                        return;
                    }

                    if (tree.isProcess() || builder.isProcess() || photo.isProcess() || loader.isProcess()) {
                        mp.game.ui.notifications.show(`~r~Вы не можете сейчас получить задание , т.к. вы работаете`);
                        return;
                    }

                    user.set('isSellDrug', true);
                    let posId = methods.getRandomInt(0, tree.markers.length);
                    let posId2 = methods.getRandomInt(0, tree.markers[posId].list.length);
                    let pos = new mp.Vector3(tree.markers[posId].list[posId2][0], tree.markers[posId].list[posId2][1], tree.markers[posId].list[posId2][2] - 1);

                    let price = methods.distanceToPos(pos, mp.players.local.position) / 18;
                    if (price > 550)
                        price = 550 + methods.getRandomInt(0, 50);

                    user.set('drugPrice', price);

                    jobPoint.create(pos, true, 3);
                    mp.game.ui.notifications.show(`~g~Метка была установлена`);
                }
                else {
                    phone.addConsoleCommand('Usage: ecorp -drug -getpos');
                }
            }
            else if (args[0] === '-user') {
                if (args[1] === '-getpos') {
                    /*if (weather.getHour() < 22 && weather.getHour() > 4) {
                        mp.game.ui.notifications.show('~r~Доступно только с 22 до 4 утра игрового времени');
                        return;
                    }*/

                    /*if (await user.hasById('grabLamar')) {
                        mp.game.ui.notifications.show('~r~Вы не можете сейчас сбыть транспорт, т.к. вы выполняете заказ Ламара');
                        return;
                    }*/

                    if (user.getCache('job') === 10) {
                        mp.game.ui.notifications.show('~r~Инкассаторам запрещено это действие');
                        return;
                    }
                    if (user.getCache('fraction_id2') === 0) {
                        mp.game.ui.notifications.show('~r~Доступно только для крайм организаций');
                        return;
                    }

                    if (user.hasCache('isSellUser')) {
                        mp.game.ui.notifications.show(`~r~Вы уже получили задание на похищение`);
                        return;
                    }

                    if (user.hasCache('isSellCar')) {
                        mp.game.ui.notifications.show(`~r~Вы уже получили задание на угон`);
                        return;
                    }

                    if (user.hasCache('isSellMoney')) {
                        mp.game.ui.notifications.show(`~r~Вы уже получили задание отмыв денег`);
                        return;
                    }

                    user.set('isSellUser', true);
                    let posId = methods.getRandomInt(0, enums.spawnSellCar.length);
                    jobPoint.create(new mp.Vector3(enums.spawnSellCar[posId][0], enums.spawnSellCar[posId][1], enums.spawnSellCar[posId][2]), true, 3);
                    mp.game.ui.notifications.show(`~g~Метка была установлена`);

                    setTimeout(function () {
                        if (user.hasCache('isSellUser')) {
                            jobPoint.delete();
                            user.reset('isSellUser');
                            mp.game.ui.notifications.show(`~r~Метка на сдачу игрока была удалена`);
                        }
                    }, 600 * 1000);
                }
                else {
                    phone.addConsoleCommand('Usage: ecorp -user -getpos');
                }
            }
            else if (args[0] === '-money') {
                if (args[1] === '-clear') {

                    if (user.getCache('fraction_id2') === 0) {
                        mp.game.ui.notifications.show('~r~Отмыв денег доступен только для крайм организаций');
                        return;
                    }

                    if (user.getCache('job') === 10) {
                        mp.game.ui.notifications.show('~r~Инкассаторам запрещено это действие');
                        return;
                    }

                    if (weather.getHour() < 22 && weather.getHour() > 8) {
                        mp.game.ui.notifications.show('~r~Доступно только с 22 до 8 утра игрового времени');
                        return;
                    }

                    if (user.hasCache('isSellUser')) {
                        mp.game.ui.notifications.show(`~r~Вы уже получили задание на похищение`);
                        return;
                    }

                    if (user.hasCache('isSellCar')) {
                        mp.game.ui.notifications.show(`~r~Вы уже получили задание на угон`);
                        return;
                    }

                    if (user.hasCache('isSellMoney')) {
                        mp.game.ui.notifications.show(`~r~Вы уже получили задание отмыв денег`);
                        return;
                    }

                    user.set('isSellMoney', true);
                    let posId = methods.getRandomInt(0, enums.spawnSellMoney.length);
                    jobPoint.create(new mp.Vector3(enums.spawnSellMoney[posId][0], enums.spawnSellMoney[posId][1], enums.spawnSellMoney[posId][2]), true, 2);
                    mp.game.ui.notifications.show(`~g~Метка была установлена`);

                    setTimeout(function () {
                        if (user.hasCache('isSellMoney')) {
                            jobPoint.delete();
                            user.reset('isSellMoney');
                            mp.game.ui.notifications.show(`~r~Метка на отмыв денег была удалена`);
                        }
                    }, 600 * 1000);
                }
                else {
                    phone.addConsoleCommand('Usage: ecorp -money -clear');
                }
            }
            else if (args[0] === '-vehicle') {
                if (args[1] === '-rifle') {

                    if (user.getCache('fraction_id2') === 0) {
                        mp.game.ui.notifications.show('~r~Доступно только крайм организациям');
                        return;
                    }

                    if (user.getCache('stats_darknet') < 95) {
                        mp.game.ui.notifications.show('~r~Ваш уровень доверия в даркнете слишком низок');
                        return;
                    }

                    if (user.getCryptoMoney() < 150) {
                        mp.game.ui.notifications.show('~r~Вам необходимо иметь 150btc для покупки этой услуги');
                        return;
                    }

                    if (weather.getHour() < 22 && weather.getHour() > 8) {
                        mp.game.ui.notifications.show('~r~Доступно только с 22 до 8 утра игрового времени');
                        return;
                    }
                    if (await user.hasById('cantGetCarRifle')) {
                        mp.game.ui.notifications.show('~r~Вы уже покупали товар сегодня');
                        return;
                    }

                    user.removeCryptoMoney(150, 'Покупка автоматов');
                    user.setById('cantGetCarRifle', true);
                    mp.events.callRemote('server:fraction:getLamarRifle');
                }
                else if (args[1] === '-ammo') {

                    if (user.getCache('fraction_id2') === 0) {
                        mp.game.ui.notifications.show('~r~Доступно только крайм организациям');
                        return;
                    }

                    if (user.getCache('stats_darknet') < 90) {
                        mp.game.ui.notifications.show('~r~Ваш уровень доверия в даркнете слишком низок');
                        return;
                    }

                    if (user.getCryptoMoney() < 50) {
                        mp.game.ui.notifications.show('~r~Вам необходимо иметь 50btc для покупки этой услуги');
                        return;
                    }

                    if (weather.getHour() < 22 && weather.getHour() > 8) {
                        mp.game.ui.notifications.show('~r~Доступно только с 22 до 8 утра игрового времени');
                        return;
                    }
                    if (await user.hasById('cantGetCarAmmo')) {
                        mp.game.ui.notifications.show('~r~Вы уже покупали товар сегодня');
                        return;
                    }

                    user.removeCryptoMoney(50, 'Покупка патрон');
                    user.setById('cantGetCarAmmo', true);
                    mp.events.callRemote('server:fraction:getLamarAmmo');
                }
                else if (args[1] === '-pistol') {

                    if (user.getCache('fraction_id2') === 0) {
                        mp.game.ui.notifications.show('~r~Доступно только крайм организациям');
                        return;
                    }

                    if (user.getCache('stats_darknet') < 80) {
                        mp.game.ui.notifications.show('~r~Ваш уровень доверия в даркнете слишком низок');
                        return;
                    }

                    if (user.getCryptoMoney() < 50) {
                        mp.game.ui.notifications.show('~r~Вам необходимо иметь 50btc для покупки этой услуги');
                        return;
                    }

                    if (weather.getHour() < 22 && weather.getHour() > 8) {
                        mp.game.ui.notifications.show('~r~Доступно только с 22 до 8 утра игрового времени');
                        return;
                    }

                    if (await user.hasById('cantGetCarPistol')) {
                        mp.game.ui.notifications.show('~r~Вы уже покупали товар сегодня');
                        return;
                    }
                    user.removeCryptoMoney(50, 'Покупка пистолетов');
                    user.setById('cantGetCarPistol', true);
                    mp.events.callRemote('server:fraction:getLamarPistol');
                }
                else {
                    phone.addConsoleCommand('Usage: ecorp -money -clear');
                }
            }
        }
        else {
            phone.addConsoleCommand(`${cmd}: command not found`);
        }
    }
    catch (e) {
        phone.addConsoleCommand('Command exception');
        phone.addConsoleCommand(`${e}`);
    }
};

phone.callBack = function(action, menu, id, ...args) {
    methods.debug(action, menu, id, ...args);

    if (phone.network == 0) {
        phone.showNoNetwork();
        return;
    }

    if (action == 'button')
        phone.callBackButton(menu, id, ...args);
    else if (action == 'radio')
        phone.callBackRadio(menu, id, ...args);
    else if (action == 'modal')
        phone.callBackModal(menu);
    else if (action == 'inputmodal')
        phone.callBackModalInput(menu, id);
    else
        phone.callBackCheckbox(menu, id, ...args);
};

phone.callBackRadio = function(checked, id, ...args) {
    methods.debug(checked, id, ...args);

    try {
        let params = JSON.parse(args[0]);
        if (params.name == 'memberNewRank') {
            mp.events.callRemote('server:user:newRank', params.memberId, params.rankId);
            phone.showAppFraction();
        }
        if (params.name == 'memberNewDep') {
            mp.events.callRemote('server:user:newDep', params.memberId, params.depId);
            phone.showAppFraction();
        }
        if (params.name == 'memberNewRank2') {
            mp.events.callRemote('server:user:newRank2', params.memberId, params.rankId);
            phone.showAppFraction2();
        }
        if (params.name == 'memberNewDep2') {
            mp.events.callRemote('server:user:newDep2', params.memberId, params.depId);
            phone.showAppFraction2();
        }
        if (params.name == 'memberNewRankF') {
            mp.events.callRemote('server:user:newRankF', params.memberId, params.rankId);
            phone.showAppFamily();
        }
        if (params.name == 'memberNewDepF') {
            mp.events.callRemote('server:user:newDepF', params.memberId, params.depId);
            phone.showAppFamily();
        }
        if (params.name == 'vehicleNewRank') {
            mp.events.callRemote('server:fraction:vehicleNewRank', params.memberId, params.rankId);
            phone.showAppFraction();
        }
        if (params.name == 'vehicleNewDep') {
            mp.events.callRemote('server:fraction:vehicleNewDep', params.memberId, params.depId);
            phone.showAppFraction();
        }
    }
    catch(e) {
        methods.debug(e);
    }
};

phone.callBackModal = function(paramsJson) {
    try {
        let params = JSON.parse(paramsJson);
        if (params.name == 'memberUninvite') {
            mp.events.callRemote('server:user:uninvite', params.memberId);
            phone.showAppFraction();
        }
        if (params.name == 'memberGiveSubLeader') {
            mp.events.callRemote('server:user:giveSubLeader', params.memberId);
            phone.showAppFraction();
        }
        if (params.name == 'memberTakeSubLeader') {
            mp.events.callRemote('server:user:takeSubLeader', params.memberId);
            phone.showAppFraction();
        }
        if (params.name == 'memberUninvite2') {
            mp.events.callRemote('server:user:uninvite2', params.memberId);
            phone.showAppFraction2();
        }
        if (params.name == 'memberGiveSubLeader2') {
            mp.events.callRemote('server:user:giveSubLeader2', params.memberId);
            phone.showAppFraction2();
        }
        if (params.name == 'memberGiveLeader2') {
            mp.events.callRemote('server:user:giveLeader2', params.memberId);
            phone.showAppFraction2();
        }
        if (params.name == 'memberTakeSubLeader2') {
            mp.events.callRemote('server:user:takeSubLeader2', params.memberId);
            phone.showAppFraction2();
        }
        if (params.name == 'memberUninviteF') {
            mp.events.callRemote('server:user:uninviteF', params.memberId);
            phone.showAppFamily();
        }
        if (params.name == 'memberGiveSubLeaderF') {
            mp.events.callRemote('server:user:giveSubLeaderF', params.memberId);
            phone.showAppFamily();
        }
        if (params.name == 'memberGiveLeaderF') {
            mp.events.callRemote('server:user:giveLeaderF', params.memberId);
            phone.showAppFamily();
        }
        if (params.name == 'memberTakeSubLeaderF') {
            mp.events.callRemote('server:user:takeSubLeaderF', params.memberId);
            phone.showAppFamily();
        }
        if (params.name == 'fractionVehicleBuy') {
            mp.events.callRemote('server:fraction:vehicleBuy', params.vehId, params.price);
            phone.showAppFraction();
        }
        if (params.name == 'fractionVehicleBuy2') {
            mp.events.callRemote('server:fraction:vehicleBuy2', params.vehId, params.price);
            phone.showAppFraction2();
        }
        if (params.name == 'fractionVehicleSell') {
            mp.events.callRemote('server:fraction:vehicleSell', params.vehId, params.price);
            phone.showAppFraction();
        }
        if (params.name == 'fractionVehicleSell2') {
            mp.events.callRemote('server:fraction:vehicleSell2', params.vehId, params.price);
            phone.showAppFraction2();
        }
        if (params.name == 'deleteFractionDep') {
            mp.events.callRemote('server:phone:deleteFractionDep', params.depId);
            setTimeout(phone.showAppFractionHierarchy2, 300);
        }
        if (params.name == 'deleteFractionRank') {
            if (params.rankId === 0) {
                mp.game.ui.notifications.show(`~r~Данную должность удалить невозможно`);
                setTimeout(phone.showAppFractionHierarchy2, 300);
                return;
            }
            mp.events.callRemote('server:phone:deleteFractionRank', params.rankId, params.depId);
            setTimeout(phone.showAppFractionHierarchy2, 300);
        }
    }
    catch(e) {
        methods.debug(e);
    }
};

phone.callBackModalInput = async function(paramsJson, text) {
    try {
        mp.events.call('client:phone:inputModal', false);
        methods.debug(text);
        let params = JSON.parse(paramsJson);
        if (params.name == 'giveWanted') {
            let args = text.split(',');
            let id = methods.parseInt(args[0]);
            let count = methods.parseInt(args[1]);
            let reason = methods.removeQuotes(args[2]);
            mp.events.callRemote('server:user:giveWanted', methods.parseInt(id), count, reason);
        }
        if (params.name == 'getUserInfo') {
            mp.events.callRemote('server:phone:getUserInfo', text);
        }
        if (params.name == 'getVehInfo') {
            mp.events.callRemote('server:phone:getVehInfo', text);
        }
        if (params.name == 'getGunInfo') {
            mp.events.callRemote('server:phone:getGunInfo', text);
        }
        if (params.name == 'changeBg') {

            if (text.indexOf("imgur.com") < 0) {
                mp.game.ui.notifications.show(`~r~Доступно только для сайта imgur.com`);
                return;
            }

            phone.updateBg(text);
            phone.toMainPage();
            mp.events.callRemote('server:phone:changeBg', text);
        }
        if (params.name == 'inviteFraction2') {
            mp.events.callRemote('server:phone:inviteFraction2', methods.parseInt(text));
        }
        if (params.name == 'inviteFamily') {
            mp.events.callRemote('server:phone:inviteFamily', methods.parseInt(text));
        }
        if (params.name == 'changeClear') {
            let prc = methods.parseInt(text);
            if (prc < 0) {
                mp.game.ui.notifications.show(`~r~Нелья вводить число меньше 0`);
                return;
            }
            if (prc > 100) {
                mp.game.ui.notifications.show(`~r~Нелья вводить число больше 100`);
                return;
            }
            fraction.set(user.getCache('fraction_id2'), 'proc_clear', prc);
            mp.game.ui.notifications.show(`~b~Вы изменили процент отмыва`);
            setTimeout(phone.showAppFraction2, 500);
        }
        if (params.name == 'mafiaClearWanted') {
            mp.events.callRemote('server:phone:mafiaClearWanted', methods.parseInt(text));
        }
        if (params.name == 'mafiaGiveShop') {
            mp.events.callRemote('server:phone:mafiaGiveShop', methods.parseInt(text));
        }
        if (params.name == 'destroyFraction') {
            if (text.toLowerCase() === 'да')
                mp.events.callRemote('server:phone:destroyFraction');
            else
                mp.game.ui.notifications.show(`~r~Вы не ввели слово "да"`);
        }
        if (params.name == 'destroyFamily') {
            if (text.toLowerCase() === 'да')
                mp.events.callRemote('server:phone:destroyFamily');
            else
                mp.game.ui.notifications.show(`~r~Вы не ввели слово "да"`);
        }
        if (params.name == 'editFractionName') {

            mp.events.callRemote('server:phone:editFractionName', text);
            setTimeout(phone.showAppFractionHierarchy2, 300);
        }
        if (params.name == 'createFractionDep') {
            mp.events.callRemote('server:phone:createFractionDep', text);
            setTimeout(phone.showAppFractionHierarchy2, 300);
        }
        if (params.name == 'editFractionLeader') {
            mp.events.callRemote('server:phone:editFractionLeader', text);
            setTimeout(phone.showAppFractionHierarchy2, 300);
        }
        if (params.name == 'editFractionSubLeader') {
            mp.events.callRemote('server:phone:editFractionSubLeader', text);
            setTimeout(phone.showAppFractionHierarchy2, 300);
        }
        if (params.name == 'editFractionRank') {
            mp.events.callRemote('server:phone:editFractionRank', text, params.rankId, params.depId);
            setTimeout(phone.showAppFractionHierarchy2, 300);
        }
        if (params.name == 'editFractionDep') {
            mp.events.callRemote('server:phone:editFractionDep', text, params.depId);
            setTimeout(phone.showAppFractionHierarchy2, 300);
        }
        if (params.name == 'addFractionRank') {
            mp.events.callRemote('server:phone:addFractionRank', text, params.depId);
            setTimeout(phone.showAppFractionHierarchy2, 300);
        }
        if (params.name == 'createFractionDepF') {
            mp.events.callRemote('server:phone:createFractionDepF', text);
            setTimeout(phone.showAppFractionHierarchyF, 300);
        }
        if (params.name == 'editFractionLeaderF') {
            mp.events.callRemote('server:phone:editFractionLeaderF', text);
            setTimeout(phone.showAppFractionHierarchyF, 300);
        }
        if (params.name == 'editFractionSubLeaderF') {
            mp.events.callRemote('server:phone:editFractionSubLeaderF', text);
            setTimeout(phone.showAppFractionHierarchyF, 300);
        }
        if (params.name == 'editFractionRankF') {
            mp.events.callRemote('server:phone:editFractionRankF', text, params.rankId, params.depId);
            setTimeout(phone.showAppFractionHierarchyF, 300);
        }
        if (params.name == 'editFractionDepF') {
            mp.events.callRemote('server:phone:editFractionDepF', text, params.depId);
            setTimeout(phone.showAppFractionHierarchyF, 300);
        }
        if (params.name == 'addFractionRankF') {
            mp.events.callRemote('server:phone:addFractionRankF', text, params.depId);
            setTimeout(phone.showAppFractionHierarchyF, 300);
        }
        if (params.name == 'fractionBenefit') {
            let price = methods.parseFloat(text);
О
            if (price < 0) {
                mp.game.ui.notifications.show(`~r~Значение не может быть меньше нуля`);
                return;
            }
            if (price > 300) {
                mp.game.ui.notifications.show(`~r~Значение не может быть больше 300`);
                return;
            }

            coffer.setBenefit(coffer.getIdByFraction(user.getCache('fraction_id')), text);
            mp.game.ui.notifications.show(`~g~Вы установили новое значение прибавки к зарплате`);

            mp.events.callRemote('server:phone:fractionMoney');
            phone.showLoad();
        }
        if (params.name == 'fractionTake') {
            let price = methods.parseFloat(text);

            if (price < 0) {
                mp.game.ui.notifications.show(`~r~Значение не может быть меньше нуля`);
                return;
            }
            if (price > 250000) {
                mp.game.ui.notifications.show(`~r~Значение не может быть больше 250000`);
                return;
            }

            coffer.removeMoney(coffer.getIdByFraction(user.getCache('fraction_id')), methods.parseInt(text));
            user.addBankMoney(methods.parseInt(text), 'Снял деньги с организации');
            user.sendSmsBankOperation('Зачисление средств: ~g~' + methods.moneyFormat(methods.parseInt(text)));
            phone.showAppFraction();

            methods.saveFractionLog(
                user.getCache('name'),
                `Снял средства`,
                `Сумма: ${methods.moneyFormat(methods.parseInt(text))}`,
                user.getCache('fraction_id')
            );
        }
        if (params.name == 'sendAd') {
            if (Container.Data.HasLocally(mp.players.local.remoteId, "isAdTimeout"))
            {
                mp.game.ui.notifications.show("~r~Таймаут 5 минуты");
                return;
            }

            if (text.trim() === '') {
                mp.game.ui.notifications.show("~r~Текст объявления пуст");
                return;
            }

            mp.events.callRemote('server:invader:sendAdTemp', text);

            Container.Data.SetLocally(mp.players.local.remoteId, "isAdTimeout", true);

            setTimeout(function () {
                Container.Data.ResetLocally(mp.players.local.remoteId, "isAdTimeout");
                //user.stopScenario();
            }, 300000);
        }
        if (params.name == 'call9111') {
            if (Container.Data.HasLocally(mp.players.local.remoteId, "is911Timeout"))
            {
                mp.game.ui.notifications.show("~r~Таймаут 1 минута");
                return;
            }

            if (text.trim() === '') {
                mp.game.ui.notifications.show("~r~Для начала надо ввести текст");
                return;
            }

            dispatcher.send(`~b~PD | ${methods.phoneFormat(user.getCache('phone'))}`, text, true, user.getCache('phone'));

            Container.Data.SetLocally(mp.players.local.remoteId, "is911Timeout", true);
            setTimeout(function () {
                Container.Data.ResetLocally(mp.players.local.remoteId, "is911Timeout");
                //user.stopScenario();
            }, 60000);
        }
        if (params.name == 'call9112') {
            if (Container.Data.HasLocally(mp.players.local.remoteId, "is911Timeout"))
            {
                mp.game.ui.notifications.show("~r~Таймаут 1 минута");
                return;
            }

            if (text.trim() === '') {
                mp.game.ui.notifications.show("~r~Для начала надо ввести текст");
                return;
            }

            dispatcher.send(`~r~EMS | ${methods.phoneFormat(user.getCache('phone'))}`, text, true, user.getCache('phone'));

            Container.Data.SetLocally(mp.players.local.remoteId, "is911Timeout", true);
            setTimeout(function () {
                Container.Data.ResetLocally(mp.players.local.remoteId, "is911Timeout");
                //user.stopScenario();
            }, 60000);
        }
        if (params.name == 'call9113') {

            if (Container.Data.HasLocally(mp.players.local.remoteId, "is911Timeout"))
            {
                mp.game.ui.notifications.show("~r~Таймаут 1 минута");
                return;
            }

            if (text.trim() === '') {
                mp.game.ui.notifications.show("~r~Для начала надо ввести текст");
                return;
            }

            dispatcher.send(`~y~FD | ${methods.phoneFormat(user.getCache('phone'))}`, text, true, user.getCache('phone'));

            Container.Data.SetLocally(mp.players.local.remoteId, "is911Timeout", true);
            setTimeout(function () {
                Container.Data.ResetLocally(mp.players.local.remoteId, "is911Timeout");
                //user.stopScenario();
            }, 60000);
        }
        if (params.name == 'callTaxi') {

            if (methods.isWaypointPosition()) {

                if (Container.Data.HasLocally(mp.players.local.remoteId, "isTaxiTimeout"))
                {
                    mp.game.ui.notifications.show("~r~Таймаут 1 минута");
                    return;
                }

                if (text.trim() === '') {
                    mp.game.ui.notifications.show("~r~Для начала надо ввести текст");
                    return;
                }

                let pos = methods.getWaypointPosition();
                let playerPos = mp.players.local.position;

                let dist = mp.game.pathfind.calculateTravelDistanceBetweenPoints(pos.x, pos.y, pos.z, playerPos.x, playerPos.y, playerPos.z);
                if (dist > 10000)
                    dist = methods.parseInt(methods.distanceToPos(pos, playerPos));

                let price = dist / 15;
                if (price > user.getMoney()) {
                    mp.game.ui.notifications.show("~y~У Вас нет денег на поездку");
                    return ;
                }

                user.set('waitTaxi', true);
                dispatcher.sendTaxi(`${methods.phoneFormat(user.getCache('phone'))}`, text, pos, price, user.getCache('phone'));
                mp.game.ui.notifications.show(`~y~Вы вызвали такси\nИтоговая цена поездки: ~s~${methods.moneyFormat(price)}`);

                Container.Data.SetLocally(mp.players.local.remoteId, "isTaxiTimeout", true);
                setTimeout(function () {
                    Container.Data.ResetLocally(mp.players.local.remoteId, "isTaxiTimeout");
                    //user.stopScenario();
                }, 60000);
            }
            else {
                mp.game.ui.notifications.show("~y~Прежде чем вызвать такси, вам необходимо установить на карте метку, куда вы хотите поехать");
            }
        }
        if (params.name == 'callMeh') {

            if (Container.Data.HasLocally(mp.players.local.remoteId, "isMechTimeout"))
            {
                mp.game.ui.notifications.show("~r~Таймаут 1 минута");
                return;
            }

            if (text.trim() === '') {
                mp.game.ui.notifications.show("~r~Для начала надо ввести текст");
                return;
            }

            dispatcher.sendMech(`${methods.phoneFormat(user.getCache('phone'))}`, text, user.getCache('phone'));

            Container.Data.SetLocally(mp.players.local.remoteId, "isMechTimeout", true);
            setTimeout(function () {
                Container.Data.ResetLocally(mp.players.local.remoteId, "isMechTimeout");
                //user.stopScenario();
            }, 60000);
        }
        if (params.name == 'getPayDay') {
            let tax = await coffer.getTaxPayDay();
            let sum = methods.parseFloat(text);

            if (sum < 10) {
                user.sendSmsBankOperation('Ошибка транзакции, сумма должна быть больше $10', 'Зарплата');
                return;
            }
            if (sum > user.getPayDayMoney()) {
                user.sendSmsBankOperation('У Вас недостаточно средств', 'Зарплата');
                return;
            }
            let money = methods.parseInt(sum * (100 - tax) / 100);
            user.removePayDayMoney(sum);
            user.addBankMoney(money, 'Перевод с зарплатного счёта');
            user.sendSmsBankOperation(`Вы перевели ~g~${methods.moneyFormat(money)}~s~ на ваш банковский счёт\nНалог: ~y~${tax}%`, 'Зарплата');

            setTimeout(phone.showAppBank, 500);
        }
        if (params.name == 'moneyToCrypto') {
            let sum = methods.parseFloat(text) * 1000;
            if (sum < 0) {
                user.sendSmsBankOperation('Ошибка транзакции', 'Ошибка');
                return;
            }
            if (sum > user.getBankMoney()) {
                user.sendSmsBankOperation('У Вас недостаточно средств', 'Ошибка');
                return;
            }
            user.removeBankMoney(sum, 'Обмен BitCoin');
            user.addCryptoMoney(sum / 1000, 'Обмен BitCoin');
            user.sendSmsBankOperation(`Транзакция успешно прошла.\nСписано ~g~${methods.moneyFormat(sum)}`, 'BitCoin');

            setTimeout(phone.showAppEcorp, 200);
        }
        if (params.name == 'cryptoToMoney') {
            let sum = methods.parseFloat(text);
            if (sum < 0) {
                user.sendSmsBankOperation('Ошибка транзакции', 'Ошибка');
                return;
            }
            if (sum > user.getCryptoMoney()) {
                user.sendSmsBankOperation('У Вас недостаточно средств', 'Ошибка');
                return;
            }
            user.removeCryptoMoney(sum, 'Обмен BitCoin');
            user.addBankMoney(sum * 500, 'Обмен BitCoin');
            user.sendSmsBankOperation(`Транзакция успешно прошла\nПолучено ~g~${methods.moneyFormat(sum * 500)}`, 'BitCoin');

            setTimeout(phone.showAppEcorp, 200);
        }
        if (params.name == 'cryptoToFraction') {
            let sum = methods.parseFloat(text);
            if (sum < 0) {
                user.sendSmsBankOperation('Ошибка транзакции', 'Ошибка');
                return;
            }
            if (sum > user.getCryptoMoney()) {
                user.sendSmsBankOperation('У Вас недостаточно средств', 'Ошибка');
                return;
            }
            user.removeCryptoMoney(sum, 'Перевод BitCoin');
            fraction.addMoney(user.getCache('fraction_id2'), sum, 'Перевод BitCoin от ' + user.getCache('name'));

            setTimeout(phone.showAppEcorp, 200);
        }
        if (params.name == 'fractionToCrypto') {
            let sum = methods.parseFloat(text);
            if (sum < 0) {
                user.sendSmsBankOperation('Ошибка транзакции', 'Ошибка');
                return;
            }
            if (sum > await fraction.getMoney(user.getCache('fraction_id2'))) {
                user.sendSmsBankOperation('У Вас недостаточно средств', 'Ошибка');
                return;
            }
            user.addCryptoMoney(sum, 'Перевод BitCoin');
            fraction.removeMoney(user.getCache('fraction_id2'), sum, 'Перевод из BitCoin от ' + user.getCache('name'));

            setTimeout(phone.showAppEcorp, 200);
        }
        if (params.name == 'moneyToFraction') {
            let sum = methods.parseFloat(text);
            if (sum < 0) {
                user.sendSmsBankOperation('Ошибка транзакции', 'Ошибка');
                return;
            }
            if (sum > user.getMoney()) {
                user.sendSmsBankOperation('У Вас недостаточно средств', 'Ошибка');
                return;
            }
            user.removeMoney(sum, 'Перевод $');
            family.addMoney(user.getCache('family_id'), sum, 'Перевод $ от ' + user.getCache('name'));
            user.sendSmsBankOperation('Операция успешно совершена', 'Успешно');

            setTimeout(phone.phone.showAppFamily, 200);
        }
        if (params.name == 'fractionToMoney') {
            let sum = methods.parseFloat(text);
            if (sum < 0) {
                user.sendSmsBankOperation('Ошибка транзакции', 'Ошибка');
                return;
            }
            if (sum > await family.getMoney(user.getCache('family_id'))) {
                user.sendSmsBankOperation('У Вас недостаточно средств', 'Ошибка');
                return;
            }
            user.addMoney(sum, 'Перевод $');
            family.removeMoney(user.getCache('family_id'), sum, 'Перевод из $ от ' + user.getCache('name'));
            user.sendSmsBankOperation('Операция успешно совершена', 'Успешно');

            setTimeout(phone.phone.showAppFamily, 200);
        }
        if (params.name == 'sendFractionMessage') {
            let title = user.getCache('name');
            switch (user.getCache('fraction_id')) {
                case 1:
                    methods.notifyWithPictureToFraction(title, `${user.getRankName()}`, text, 'CHAR_FLOYD', user.getCache('fraction_id'));
                    break;
                case 2:
                    methods.notifyWithPictureToFraction(title, `${user.getRankName()}`, text, 'WEB_LOSSANTOSPOLICEDEPT', user.getCache('fraction_id'));
                    break;
                case 3:
                    methods.notifyWithPictureToFraction(title, `${user.getRankName()}`, text, 'CHAR_DR_FRIEDLANDER', user.getCache('fraction_id'));
                    break;
                case 4:
                    methods.notifyWithPictureToFraction(title, `${user.getRankName()}`, text, 'DIA_ARMY', user.getCache('fraction_id'));
                    break;
                case 5:
                    methods.notifyWithPictureToFraction(title, `${user.getRankName()}`, text, 'DIA_POLICE', user.getCache('fraction_id'));
                    break;
                case 6:
                    methods.notifyWithPictureToFraction(title, `${user.getRankName()}`, text, 'CHAR_CRIS', user.getCache('fraction_id'));
                    break;
                case 7:
                    methods.notifyWithPictureToFraction(title, `${user.getRankName()}`, text, 'CHAR_LIFEINVADER', user.getCache('fraction_id'));
                    break;
                default:
                    methods.notifyWithPictureToFraction(title, `Организация`, text, 'CHAR_DEFAULT', user.getCache('fraction_id'));
                    break;
            }
            chat.sendToFraction(`[${user.getRankName()}] ${user.getCache('name')} (${mp.players.local.remoteId})`, text);
        }
        if (params.name == 'sendFractionMessageDep') {
            chat.sendToDep(`[${user.getFractionName()} | ${user.getRankName()}] ${user.getCache('name')} (${mp.players.local.remoteId})`, text);
        }
        if (params.name == 'sendFractionMessage2') {
            chat.sendToFraction(`${user.getCache('name')} (${mp.players.local.remoteId})`, text);
            let title = user.getCache('name');
            methods.notifyWithPictureToFraction2(title, `Организация`, text, 'CHAR_DEFAULT', user.getCache('fraction_id2'));
        }
        if (params.name == 'sendFractionMessageF') {
            chat.sendToFamily(`${user.getCache('name')} (${mp.players.local.remoteId})`, text);
            let title = user.getCache('name');
            methods.notifyWithPictureToFractionF(title, `СЕМЬЯ`, text, 'CHAR_DEFAULT', user.getCache('family_id'));
        }
        if (params.name == 'sendFractionNews') {
            let title = user.getCache('name');
            switch (user.getCache('fraction_id')) {
                case 1:
                    methods.sendDiscordServerNews(title, 'Новости правительства', text);
                    methods.notifyWithPictureToAll(title, 'Новости правительства', text, 'CHAR_FLOYD');
                    break;
                case 2:
                    methods.sendDiscordServerNews(title, 'Новости LSPD', text);
                    methods.notifyWithPictureToAll(title, 'Новости LSPD', text, 'WEB_LOSSANTOSPOLICEDEPT');
                    break;
                case 3:
                    methods.sendDiscordServerNews(title, 'Новости FIB', text);
                    methods.notifyWithPictureToAll(title, 'Новости FIB', text, 'CHAR_DR_FRIEDLANDER');
                    break;
                case 4:
                    methods.sendDiscordServerNews(title, 'Новости USMC', text);
                    methods.notifyWithPictureToAll(title, 'Новости USMC', text, 'DIA_ARMY');
                    break;
                case 5:
                    methods.sendDiscordServerNews(title, 'Новости BCSD', text);
                    methods.notifyWithPictureToAll(title, 'Новости BCSD', text, 'DIA_POLICE');
                    break;
                case 6:
                    methods.sendDiscordServerNews(title, 'Новости EMS', text);
                    methods.notifyWithPictureToAll(title, 'Новости EMS', text, 'CHAR_CRIS');
                    break;
                case 7:
                    methods.sendDiscordServerNews(title, 'Новости Life Invader', text);
                    methods.notifyWithPictureToAll(title, 'Новости Life Invader', text, 'CHAR_LIFEINVADER');
                    break;
                case 8:
                    methods.sendDiscordServerNews(title, 'Новости правительства Мексики', text);
                    methods.notifyWithPictureToAll(title, 'Новости правительства Мексики', text, 'CHAR_DEFAULT');
                    break;
            }
        }
    }
    catch(e) {
        methods.debug(e);
    }
};

phone.callBackButton = async function(menu, id, ...args) {
    try {
        let params = JSON.parse(args[0]);
        if (menu == 'fraction') {
            if (params.name == 'hierarchy')
                phone.showAppFractionHierarchy();
            else if (params.name == 'list') {
                mp.events.callRemote('server:phone:fractionList');
                phone.showLoad();
            }
            else if (params.name == 'respawnVeh') {
                mp.events.callRemote('server:fraction:vehicleRespawn', params.memberId);
                phone.showAppFraction();
            }
            else if (params.name == 'log') {
                mp.events.callRemote('server:phone:fractionLog');
                phone.showLoad();
            }
            else if (params.name == 'getDrugVans') {
                mp.events.callRemote('server:fraction:getDrugVans');
            }
            else if (params.name == 'money') {
                mp.events.callRemote('server:phone:fractionMoney');
                phone.showLoad();
            }
            else if (params.name == 'vehicles') {
                mp.events.callRemote('server:phone:fractionVehicles');
                phone.showLoad();
            }
            else if (params.name == 'fractionVehicleBuyInfo') {
                mp.events.callRemote('server:phone:fractionVehicleBuyInfo', params.id);
                phone.showLoad();
            }
            else if (params.name == 'vehicleBuyList') {
                mp.events.callRemote('server:phone:fractionVehiclesBuyList');
                phone.showLoad();
            }
            else if (params.name == 'destroyVehicle') {
                mp.events.callRemote('server:respawnNearstVehicle');
            }
            else if (params.name == 'flipVehicle') {
                mp.events.callRemote('server:flipNearstVehicle');
            }
            else if (params.name == 'destroyVehicle2') {
                mp.events.callRemote('server:respawnNearstVehicle2');
            }
            else if (params.name == 'dispatcherList') {
                phone.showAppFractionDispatcherList();
            }
            else if (params.name == 'dispatcherAccept') {
                dispatcher.sendNotificationFraction(
                    "10-4 - 911",
                    `${user.getRankName()} ${user.getCache('name')} принял вызов \"${params.title}\"`,
                    `~y~Детали: ~s~${params.desc}`, `~y~Район: ~s~${params.street1}`,
                    user.getCache('fraction_id')
                );

                if (params.withCoord) {
                    if (params.posX)
                        user.setWaypoint(params.posX, params.posY);
                }
                else {
                    if (params.posX)
                        user.setWaypoint(params.posX + methods.getRandomInt(-20, 20), params.posY + methods.getRandomInt(-20, 20));
                }
                if (methods.parseInt(params.p))
                    mp.events.callRemote('server:phone:sendMessageNumber', '911', params.p.toString(), `Ваш вызов был принят сотрудником ${user.getFractionName()}`);
            }
            else if (params.name == 'dispatcherLoc') {
                phone.showAppFractionDispatcherLoc();
            }
            else if (params.name == 'dispatcherDep') {
                phone.showAppFractionDispatcherDep();
            }
            else if (params.name == 'memberAction') {
                mp.events.callRemote('server:phone:memberAction', params.memberId);
                phone.showLoad();
            }
            else if (params.name == 'showInvaderStats') {
                mp.events.callRemote('server:phone:openInvaderStatsList', params.days);
                phone.showLoad();
            }
            else if (params.name == 'fractionVehicleAction') {
                mp.events.callRemote('server:phone:fractionVehicleAction', params.vehId);
                phone.showLoad();
            }
            else if (params.name == 'codeLoc') {
                dispatcher.codeLocal(params.code, user.getCache('name'));
            }
            else if (params.name == 'codeDep') {
                dispatcher.codeDep(params.code, user.getCache('name'));
            }
            else if (params.name == 'showCanabisList') {
                mp.events.callRemote('server:phone:showCanabisList');
                phone.showLoad();
            }
            else if (params.name == 'showCanabisWarList') {
                mp.events.callRemote('server:phone:showCanabisWarList');
                phone.showLoad();
            }
        }
        if (menu == 'uvehicle') {
            if (params.name == 'respawn')
                mp.events.callRemote('server:phone:userRespawnById', params.id, params.price);
            if (params.name == 'getPos')
                mp.events.callRemote('server:phone:userGetPosById', params.id);
            if (params.name == 'lock')
                mp.events.callRemote('server:phone:userLockById', params.id);
            if (params.name == 'engine')
                mp.events.callRemote('server:phone:userEngineById', params.id);
            if (params.name == 'neon')
                mp.events.callRemote('server:phone:userNeonById', params.id);
        }
        if (menu == 'apps') {
            if (params.name == 'fraction')
                phone.showAppFraction();
            if (params.name == 'fraction2')
                phone.showAppFraction2();
            if (params.name == 'family')
                phone.showAppFamily();
            if (params.name == 'bank')
                phone.showAppBank();
            if (params.name == 'ecorp')
                phone.showAppEcorp();
            if (params.name == 'invader')
                phone.showAppInvader();
            if (params.name == 'settings')
                phone.showAppSettings();
            if (params.name == 'fishing')
                phone.showAppFishing();
            if (params.name == 'car') {
                mp.events.callRemote('server:phone:userVehicleAppMenu');
                phone.showLoad();
            }
            if (params.name == 'myHistory') {
                mp.events.callRemote('server:phone:userHistory', user.getCache('id'));
                phone.showLoad();
            }
            if (params.name == 'myTickets') {
                mp.events.callRemote('server:phone:userTickets', user.getCache('id'));
                phone.showLoad();
            }
        }
        if (menu == 'gps') {
            if (params.x)
                user.setWaypoint(params.x, params.y);
            if (params.event)
                mp.events.callRemote(params.event);
        }
        if (menu == 'fishing') {
            if (params.x)
                user.setWaypoint(params.x, params.y);
            if (params.event)
                mp.events.callRemote(params.event);
        }
        if (menu == 'invader') {
            if (params.name == 'adList') {
                mp.events.callRemote('server:phone:userAdList');
                phone.showLoad();
            }
            if (params.name == 'newsList') {
                mp.events.callRemote('server:phone:userNewsList');
                phone.showLoad();
            }
        }
        if (menu == 'adList') {
            if (params.name == 'sendMessage') {
                ui.callCef('phone' + phone.getType(), JSON.stringify({type: 'selectChat', phone: params.phone}));
            }
        }
        if (menu == 'bank') {
            if (params.name == 'history') {
                mp.events.callRemote('server:phone:bankHistory');
                phone.showLoad();
            }
        }
        if (menu == 'userInfo') {
            if (params.name == 'history') {
                mp.events.callRemote('server:phone:userHistory', params.id);
                phone.showLoad();
            }
            if (params.name == 'tickets') {
                mp.events.callRemote('server:phone:userTickets', params.id);
                phone.showLoad();
            }
        }
        if (menu == 'ecorp') {
            if (params.name == 'createFraction') {
                mp.events.callRemote('server:phone:createFraction');
                phone.showLoad();
            }
            if (params.name == 'fractionList') {
                mp.events.callRemote('server:phone:fractionAll');
                phone.showLoad();
            }
            if (params.name == 'sellCar') {

                if (weather.getHour() < 22 && weather.getHour() > 4) {
                    mp.game.ui.notifications.show('~r~Доступно только с 22 до 4 утра игрового времени');
                    return;
                }

                if (await user.hasById('grabVeh')) {
                    mp.game.ui.notifications.show('~r~Вы не можете сейчас сбыть транспорт');
                    return;
                }

                if (user.hasCache('isSellCar')) {
                    mp.game.ui.notifications.show(`~r~Вы уже получили задание на угон`);
                    return;
                }

                user.set('isSellCar', true);
                let posId = methods.getRandomInt(0, enums.spawnSellCar.length);
                jobPoint.create(new mp.Vector3(enums.spawnSellCar[posId][0], enums.spawnSellCar[posId][1], enums.spawnSellCar[posId][2]), true, 3);
                mp.game.ui.notifications.show(`~g~Метка была установлена`);
            }
            if (params.name == 'buyFraction') {
                mp.events.callRemote('server:phone:buyFraction', params.id);
                phone.showAppList();
            }
        }
        if (menu == 'settings') {
            if (params.name == 'changeBg') {
                phone.updateBg(params.img);
                phone.toMainPage();
                mp.events.callRemote('server:phone:changeBg', params.img);
            }
        }
        if (menu == 'fraction2') {
            if (params.name == 'hierarchy')
                phone.showAppFractionHierarchy2();
            else if (params.name == 'upgrade')
                phone.showAppFractionUpgrade2();
            else if (params.name == 'vehicles') {
                mp.events.callRemote('server:phone:fractionVehicles2');
                phone.showLoad();
            }
            else if (params.name == 'fractionVehicleBuyInfo') {
                mp.events.callRemote('server:phone:fractionVehicleBuyInfo2', params.id);
                phone.showLoad();
            }
            else if (params.name == 'vehicleBuyList') {
                mp.events.callRemote('server:phone:fractionVehiclesBuyList2');
                phone.showLoad();
            }
            else if (params.name == 'fractionVehicleAction2') {
                mp.events.callRemote('server:phone:fractionVehicleAction2', params.vehId);
                phone.showLoad();
            }
            else if (params.name == 'fractionVehicleFind2') {
                mp.events.callRemote('server:fraction:vehicleFind2', params.vehId);
                phone.showAppFraction2();
            }
            else if (params.name == 'respawnVeh') {
                mp.events.callRemote('server:fraction:vehicleRespawn', params.memberId);
                phone.showAppFraction2();
            }
            else if (params.name == 'list') {
                mp.events.callRemote('server:phone:fractionList2');
                phone.showLoad();
            }
            else if (params.name == 'slist') {
                mp.events.callRemote('server:phone:fractionStList2');
                phone.showLoad();
            }
            else if (params.name == 'log') {
                mp.events.callRemote('server:phone:fractionLog2');
                phone.showLoad();
            }
            else if (params.name == 'memberAction') {
                mp.events.callRemote('server:phone:memberAction2', params.memberId);
                phone.showLoad();
            }
            else if (params.name == 'showGangList') {
                mp.events.callRemote('server:phone:showGangList');
                phone.showLoad();
            }
            else if (params.name == 'showGangWarList') {
                mp.events.callRemote('server:phone:showGangWarList');
                phone.showLoad();
            }
            else if (params.name == 'showCanabisList') {
                mp.events.callRemote('server:phone:showCanabisList');
                phone.showLoad();
            }
            else if (params.name == 'showCanabisWarList') {
                mp.events.callRemote('server:phone:showCanabisWarList');
                phone.showLoad();
            }
            else if (params.name == 'getShopGang') {
                mp.events.callRemote('server:phone:getShopGang');
                phone.showLoad();
            }
            else if (params.name == 'attackStreet') {
                //mp.events.callRemote('server:phone:attackStreet', params.zone);
                phone.hide();
                menuList.showGangZoneAttackMenu(await Container.Data.GetAll(600000 + methods.parseInt(params.zone)))
                //setTimeout(phone.showAppFraction2, 500);
            }
            else if (params.name == 'attackCanabis') {
                //mp.events.callRemote('server:phone:attackStreet', params.zone);
                phone.hide();
                menuList.showCanabisZoneAttackMenu(await Container.Data.GetAll(600000 + methods.parseInt(params.zone)))
                //setTimeout(phone.showAppFraction2, 500);
            }
            else if (params.name == 'getPos') {
                user.setWaypoint(params.x, params.y);
            }
            else if (params.name == 'goCargo') {
                user.set('isCargo', true);
                mp.game.ui.notifications.show(`~g~Ожидайте начало операции, в случае перезахода, необходимо нажать еще раз`);
            }
            else if (params.name == 'uninviteMe') {
                user.set('is_leader2', 0);
                user.set('is_sub_leader2', 0);
                user.set('fraction_id2', 0);
                user.set('rank2', 0);
                user.set('rank_type2', 0);
                user.setVariable('fraction_id2', 0);
                mp.game.ui.notifications.show(`~g~Вы покинули организацию`);
            }
            else if (params.name == 'unsetWar') {
                fraction.set(user.getCache('fraction_id2'), 'is_war', 0);
                mp.game.ui.notifications.show(`~g~Вы отказались от улучшения`);
                phone.showLoad();
                setTimeout(phone.showAppFraction2, 500);
            }
            else if (params.name == 'setWar') {
                fraction.set(user.getCache('fraction_id2'), 'is_war', 1);
                fraction.removeMoney(user.getCache('fraction_id2'), 100, 'Возможность битвы за территории');
                mp.game.ui.notifications.show(`~g~Вы успешно наладили связи и теперь вам доступна война за территории`);
                phone.showLoad();
                setTimeout(phone.showAppFraction2, 500);
            }
            else if (params.name == 'unsetShop') {
                fraction.set(user.getCache('fraction_id2'), 'is_shop', 0);
                mp.game.ui.notifications.show(`~g~Вы отказались от улучшения`);
                phone.showLoad();
                setTimeout(phone.showAppFraction2, 500);
            }
            else if (params.name == 'setShop') {
                fraction.set(user.getCache('fraction_id2'), 'is_shop', 1);
                fraction.removeMoney(user.getCache('fraction_id2'), 50, 'Возможность ограбления магазина');
                mp.game.ui.notifications.show(`~g~Вы успешно наладили связи и теперь вам доступны наводки на ограбления магазинов`);
                fraction.save(user.getCache('fraction_id2'));
                phone.showLoad();
                setTimeout(phone.showAppFraction2, 500);
            }

            else if (params.name == 'unsetSpawn') {
                fraction.set(user.getCache('fraction_id2'), 'spawn_x', 0);
                fraction.set(user.getCache('fraction_id2'), 'spawn_y', 0);
                fraction.set(user.getCache('fraction_id2'), 'spawn_z', 0);
                fraction.set(user.getCache('fraction_id2'), 'spawn_rot', 0);
                mp.game.ui.notifications.show(`~g~Вы отказались от улучшения`);
                phone.showLoad();
                setTimeout(phone.showAppFraction2, 500);
            }
            else if (params.name == 'setSpawn') {

                if (user.getCache('stock_id') === 0) {
                    mp.game.ui.notifications.show(`~g~У вас нет склада`);
                    return;
                }

                let stockData = await stocks.getData(user.getCache('stock_id'));
                if (!stockData.get('upgrade_g')) {
                    mp.game.ui.notifications.show(`~g~У вас нет улучшения для склада`);
                    return;
                }

                fraction.set(user.getCache('fraction_id2'), 'spawn_x', stockData.get('x'));
                fraction.set(user.getCache('fraction_id2'), 'spawn_y', stockData.get('y'));
                fraction.set(user.getCache('fraction_id2'), 'spawn_z', stockData.get('z'));
                fraction.set(user.getCache('fraction_id2'), 'spawn_rot', stockData.get('rot'));

                fraction.removeMoney(user.getCache('fraction_id2'), 50, 'Спавн организации');
                mp.game.ui.notifications.show(`~g~Теперь у вашей организации есть спавн`);

                fraction.save(user.getCache('fraction_id2'));
                phone.showLoad();
                setTimeout(phone.showAppFraction2, 500);
            }
            else if (params.name == 'fleecaGoPt') {
                let order = await fraction.get(user.getCache('fraction_id2'), 'grabBankFleecaPt');
                if (order === 0) {
                    mp.game.ui.notifications.show(`~r~Задание уже выполнено`);
                    return;
                }
                mp.events.callRemote('server:fraction:getBankVeh', 1);
                fraction.set(user.getCache('fraction_id2'), 'grabBankFleecaPt', order - 1);
                phone.showLoad();
                setTimeout(phone.showAppFraction2, 500);
            }
            else if (params.name == 'fleecaGoHp') {
                let order = await fraction.get(user.getCache('fraction_id2'), 'grabBankFleecaHp');
                if (order === 0) {
                    mp.game.ui.notifications.show(`~r~Задание уже выполнено`);
                    return;
                }
                mp.events.callRemote('server:fraction:getBankVeh', 2);
                fraction.set(user.getCache('fraction_id2'), 'grabBankFleecaHp', order - 1);
                phone.showLoad();
                setTimeout(phone.showAppFraction2, 500);
            }
            else if (params.name == 'fleecaGoOt') {
                let order = await fraction.get(user.getCache('fraction_id2'), 'grabBankFleecaOt');
                if (order === 0) {
                    mp.game.ui.notifications.show(`~r~Задание уже выполнено`);
                    return;
                }
                mp.events.callRemote('server:fraction:getBankVeh', 3);
                fraction.set(user.getCache('fraction_id2'), 'grabBankFleecaOt', order - 1);
                phone.showLoad();
                setTimeout(phone.showAppFraction2, 500);
            }
            else if (params.name == 'fleecaGoBaller') {
                let order = await fraction.get(user.getCache('fraction_id2'), 'grabBankFleecaCar');
                if (order === 0) {
                    mp.game.ui.notifications.show(`~r~Задание уже выполнено`);
                    return;
                }
                mp.events.callRemote('server:fraction:getBankVeh', 99);
                fraction.set(user.getCache('fraction_id2'), 'grabBankFleecaCar', order - 1);
                phone.showLoad();
                setTimeout(phone.showAppFraction2, 500);
            }
            else if (params.name == 'getDrug') {

                let orderDrug = await fraction.get(user.getCache('fraction_id2'), 'orderDrug');
                if (orderDrug >= 9999) {
                    mp.game.ui.notifications.show(`~r~Вы уже получали фургон сегодня`);
                    return;
                }
                if (orderDrug < 200) {
                    mp.game.ui.notifications.show(`~r~Необходимо положить ${200 - orderDrug} закладок, для выполнения контракта`);
                    return;
                }

                if (user.isLeader2() || user.isSubLeader2()) {
                    mp.events.callRemote('server:fraction:getDrugSpeedo');
                    fraction.set(user.getCache('fraction_id2'), 'orderDrug', 9999);
                    phone.showLoad();
                    setTimeout(phone.showAppFraction2, 500);
                }
                else {
                    mp.game.ui.notifications.show(`~r~Доступно только для лидера или замов`);
                }
            }
            else if (params.name == 'getMargCar') {

                let orderDrug = await fraction.has(user.getCache('fraction_id2'), 'orderDrugMarg');
                if (orderDrug) {
                    mp.game.ui.notifications.show(`~r~Вы уже получали фургон сегодня`);
                    return;
                }

                if (weather.getRealHour() >= 6 && weather.getRealHour() < 17) {
                    if (user.isLeader2() || user.isSubLeader2()) {
                        mp.events.callRemote('server:fraction:getDrugCanabisSpeedo');
                        fraction.set(user.getCache('fraction_id2'), 'orderDrugMarg', true);
                        phone.showLoad();
                        setTimeout(phone.showAppFraction2, 500);
                    }
                    else {
                        mp.game.ui.notifications.show(`~r~Доступно только для лидера или замов`);
                    }
                }
                else {

                    mp.game.ui.notifications.show(`~r~Доступно с 6:00 и до 17:00`);
                }
            }
            else if (params.name == 'getLamar') {

               let orderLamar = await fraction.get(user.getCache('fraction_id2'), 'orderLamar');
               if (orderLamar >= 9999) {
                   mp.game.ui.notifications.show(`~r~Вы уже получали фургон сегодня`);
                   return;
               }
               if (orderLamar < 150) {
                   mp.game.ui.notifications.show(`~r~Необходимо перевести ${150 - orderLamar} грузов, для выполнения контракта`);
                   return;
               }

                if (user.isLeader2() || user.isSubLeader2()) {
                    mp.events.callRemote('server:fraction:getLamarSpeedo');
                    fraction.set(user.getCache('fraction_id2'), 'orderLamar', 9999);
                    phone.showLoad();
                    setTimeout(phone.showAppFraction2, 500);
                }
                else {
                    mp.game.ui.notifications.show(`~r~Доступно только для лидера или замов`);
                }
            }
            else if (params.name == 'getLamarM') {

               let orderLamarM = await fraction.get(user.getCache('fraction_id2'), 'orderLamarM');
               if (orderLamarM >= 9999) {
                   mp.game.ui.notifications.show(`~r~Вы уже получали фургон сегодня`);
                   return;
               }
               if (orderLamarM < 300) {
                   mp.game.ui.notifications.show(`~r~Необходимо перевести ${300 - orderLamarM} грузов, для выполнения контракта`);
                   return;
               }

                if (user.isLeader2() || user.isSubLeader2()) {
                    mp.events.callRemote('server:fraction:getLamarMule');
                    fraction.set(user.getCache('fraction_id2'), 'orderLamarM', 9999);
                    phone.showLoad();
                    setTimeout(phone.showAppFraction2, 500);
                }
                else {
                    mp.game.ui.notifications.show(`~r~Доступно только для лидера или замов`);
                }
            }
            else if (params.name == 'getAtm') {

                let orderAtm = await fraction.get(user.getCache('fraction_id2'), 'orderAtm');
                if (orderAtm >= 9999) {
                    mp.game.ui.notifications.show(`~r~Вы уже получали фургон сегодня`);
                    return;
                }
                if (orderAtm < 10) {
                    mp.game.ui.notifications.show(`~r~Необходимо ограбить ${10 - orderAtm} банкоматов, для выполнения контракта`);
                    return;
                }

                if (user.isLeader2() || user.isSubLeader2()) {

                    fraction.addMoney(user.getCache('fraction_id2'), 200, 'Бонус за выполненный контракт');
                    fraction.set(user.getCache('fraction_id2'), 'orderAtm', 9999);
                    phone.showLoad();
                    setTimeout(phone.showAppFraction2, 500);
                }
                else {
                    mp.game.ui.notifications.show(`~r~Доступно только для лидера или замов`);
                }
            }
        }
        if (menu == 'family') {
            if (params.name == 'hierarchy')
                phone.showAppFractionHierarchyF();
            if (params.name == 'avhive')
                phone.showAppFractionAchiveF();
            else if (params.name == 'list') {
                mp.events.callRemote('server:phone:fractionListF');
                phone.showLoad();
            }
            else if (params.name == 'slist') {
                mp.events.callRemote('server:phone:fractionStListF');
                phone.showLoad();
            }
            else if (params.name == 'log') {
                mp.events.callRemote('server:phone:fractionLogF');
                phone.showLoad();
            }
            else if (params.name == 'memberActionF') {
                mp.events.callRemote('server:phone:memberActionF', params.memberId);
                phone.showLoad();
            }
            else if (params.name == 'uninviteMe') {
                user.set('is_leaderf', 0);
                user.set('is_sub_leaderf', 0);
                user.set('family_id', 0);
                user.set('rankf', 0);
                user.set('rank_typef', 0);
                user.setVariable('family_id', 0);
                mp.game.ui.notifications.show(`~g~Вы покинули семью`);
            }
        }
        if (menu === 'fraction_hierarchy2') {
            if (params.name == 'editFractionRankMenu') {
                phone.showAppFractionEditRankMenu(params.rankId, params.depId);
            }
        }
        if (menu === 'fraction_hierarchyf') {
            if (params.name == 'editFractionRankMenuF') {
                phone.showAppFractionFEditRankMenu(params.rankId, params.depId);
            }
        }
    }
    catch (e) {
        methods.debug(e)
    }
};

phone.callBackCheckbox = function(menu, id, ...args) {
    try {
        let checked = args[0];
        let params = JSON.parse(args[1]);
    }
    catch (e) {
        methods.debug(e);
    }
};

let notifyList = [];

phone.sendNotify = function(sender, title, message, pic = 'CHAR_BLANK_ENTRY') {
    if (phone.getType() > 0)
        notifyList.push({ title: title, sender: sender, message: message, pic: pic });
};

phone.findNearestNetwork = function(pos) {
    let prevPos = new mp.Vector3(9999, 9999, 9999);
    enums.networkList.forEach(function (item) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(shopPos, pos) < methods.distanceToPos(prevPos, pos))
            prevPos = shopPos;
    });
    return prevPos;
};

phone.findNetworkTimer = function() {
    try {
        if (!methods.isBlackout() && !ctos.isDisableNetwork() && phone.getType() > 0)
        {
            let plPos = mp.players.local.position;
            let pos = phone.findNearestNetwork(plPos);
            let distance = methods.distanceToPos(pos, plPos);

            if (plPos.z < 270 && plPos.z > 0)
            {
                if (distance <= 1000)
                    phone.network = 5;
                else if (distance > 1000 && distance < 1500)
                {
                    let distanceNetwork = (500 - (distance - 1000)) / 5.0;
                    if (distanceNetwork > 90)
                        phone.network = 5;
                    else if (distanceNetwork > 70)
                        phone.network = 4;
                    else if (distanceNetwork > 50)
                        phone.network = 3;
                    else if (distanceNetwork > 30)
                        phone.network = 2;
                    else if (distanceNetwork > 10)
                        phone.network = 1;
                    else
                        phone.network = 0;
                }
                else
                    phone.network = 0;
            }
            else if (plPos.z < 450 && plPos.z >= 270)
            {
                let distanceNetwork = (180 - (plPos.z - 270)) / 1.8;
                if (distanceNetwork > 90)
                    phone.network = 5;
                else if (distanceNetwork > 70)
                    phone.network = 4;
                else if (distanceNetwork > 50)
                    phone.network = 3;
                else if (distanceNetwork > 30)
                    phone.network = 2;
                else if (distanceNetwork > 10)
                    phone.network = 1;
                else
                    phone.network = 0;
            }
            else
                phone.network = 0;
        }
        else
            phone.network = 0;

        if (user.getCache('phoneNetwork') !== phone.network)
            user.set('phoneNetwork', phone.network);

        if (phone.network > 0 && phone.getType() > 0) {
            notifyList.forEach(item => {
                mp.game.ui.notifications.showWithPicture(item.sender, item.title, item.message, item.pic, 1);
            });
            notifyList = [];
        }
    }
    catch (e) {
        methods.debug('NETWORK', e);
    }

    //setTimeout(phone.findNetworkTimer, 5000);
};

export default phone;