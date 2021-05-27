import user from '../user';
import phone from "../phone";
import inventory from "../inventory";

import ui from "../modules/ui";

import jobPoint from "./jobPoint";
import weather from "./weather";

import vehicles from "../property/vehicles";
import methods from "../modules/methods";
import photo from "../jobs/photo";
import npc from "./npc";

let quest = {};

let questNames = [
    'role_0',
    'standart',
    'gang',
    'fish',
    'business',
    /*'work',
    'top',*/
];

let gangTakeBoxPos = new mp.Vector3(10.247762680053711, -1902.8265380859375, 21.602693557739258);
let gangPutBoxPos = new mp.Vector3(-119.17330932617188, -1769.6900634765625, 28.85245704650879);

let _checkpointId = -1;
let _currentCheckpointId = 0;

let isLamar = false;

let questLamarShop = [
    new mp.Vector3(-182.99929809570312, -1694.6654052734375, 31.857234954833984),
    new mp.Vector3(-14.589057922363281, -1832.5186767578125, 24.252771377563477),
    new mp.Vector3(435.4407043457031, -2027.0235595703125, 22.212621688842773),
    new mp.Vector3(816.9234008789062, -2444.7568359375, 23.11887550354004),
    new mp.Vector3(1328.7283935546875, -1629.90087890625, 51.09795379638672),
];

let questList = {
    role_0: {
        name: "Первые шаги",
        skin: "s_f_y_beachbarstaff_01",
        skinRot: 147.77825927734375,
        anim: "WORLD_HUMAN_CLIPBOARD",
        pos: new mp.Vector3(5002.990234375, -5752.30419921875, 19.880247116088867),
        tasks: [
            ["Лицензия", "Купить лицензию категории B (Доп. информация в М - Квесты)", "$100 + Лицензия категории А", 5011, -5750],
            ["Первая работа", "Устроиться на работу садовника или строителя в здании правительства", "$200", 5011, -5750],
            ["Аренда", "Арендуйте транспорт", "$250", -1261, -608],
            ["Первые деньги", "Заработайте первые деньги", "$500", -1585, -234],
            ["Банковская карта", "Оформите банковскую карту в любом из доступных банков", "$200", 0, 99],
            ["Урчащий животик", "Купить еду и воду в палатке или магазине", "$200", 0, 98],
            ["Приодеться", "Купить любую одежду", "$500", -817, -1079],
            ["Швейный завод", "Для того, чтобы получить бинты, необходимо обменять любую одежду на ткань в швейной фабрике, после чего через инвентарь будет возможность их скрафтить", "Рецепт малой аптечки", 718, -977],
            ["Ламар", "Познакомиться с Ламаром", "Автомобиль", -218, -1368],
            ["Бричка", "Найти и припарковать свой транспорт (Найти можно через телефон в приложении UVeh)", "$500", -218, -1368],
            ["Кчау", "Примите участие в гонках на Maze Bank Arena", "$2000", -255, -2026],
            ["Сила револьвера", "Примите участие в дуэли", "$2000", -255, -2026],
            ["Время пострелять", "Примите участие в GunZone", "$2000", -255, -2026],
            ["По карьерной лестнице", "Устроиться на работу в Правительство/LSPD/BCSD/Армию/Службу новостей, на ваш выбор", "$20,000", 0, 0],
        ],
        canSee: () => { return false }
    },
    standart: {
        name: "Первые шаги",
        skin: "a_f_y_business_02",
        skinRot: -46.52558,
        anim: "WORLD_HUMAN_CLIPBOARD",
        pos: new mp.Vector3(-1288.153, -561.6686, 31.71216),
        tasks: [
            ["Лицензия", "Купить лицензию категории B (Доп. информация в М - Квесты)", "$100 + Лицензия категории А", -1290, -571],
            ["Первая работа", "Устроиться на работу садовника или строителя в здании правительства", "$200", -1290, -571],
            ["Аренда", "Арендуйте транспорт", "$250", -1261, -608],
            ["Первые деньги", "Заработайте первые деньги", "$500", -1585, -234],
            ["Банковская карта", "Оформите банковскую карту в любом из доступных банков", "$200", 0, 99],
            ["Урчащий животик", "Купить еду и воду в палатке или магазине", "$200", 0, 98],
            ["Приодеться", "Купить любую одежду", "$500", -817, -1079],
            ["Швейный завод", "Для того, чтобы получить бинты, необходимо обменять любую одежду на ткань в швейной фабрике, после чего через инвентарь будет возможность их скрафтить", "Рецепт малой аптечки", 718, -977],
            ["Ламар", "Познакомиться с Ламаром", "Автомобиль", -218, -1368],
            ["Бричка", "Найти и припарковать свой транспорт (Найти можно через телефон в приложении UVeh)", "$500", -218, -1368],
            ["Кчау", "Примите участие в гонках на Maze Bank Arena", "$2000", -255, -2026],
            ["Сила револьвера", "Примите участие в дуэли", "$2000", -255, -2026],
            ["Время пострелять", "Примите участие в GunZone", "$2000", -255, -2026],
            ["По карьерной лестнице", "Устроиться на работу в Правительство/LSPD/BCSD/Армию/Службу новостей, на ваш выбор", "$20,000", 0, 0],
        ],
        canSee: () => {
            if (user.getCache('role') === 2) {
                questList.standart.tasks = [
                    ["Лицензия", "Купить лицензию категории B (Доп. информация в М - Квесты)", "$100 + Лицензия категории А", 5011, -5750],
                    ["Первая работа", "Устроиться на работу садовника или строителя в здании правительства", "$200", 5399, -5172],
                    ["Аренда", "Арендуйте транспорт", "$250", 4974, -5716],
                    ["Первые деньги", "Заработайте первые деньги", "$500", 4974, -5716],
                    ["Банковская карта", "Оформите банковскую карту в местном банке", "$200", 5011, -5750],
                    ["Урчащий животик", "Купить еду и воду в палатке или магазине", "$200", 0, 98],
                    ["Приодеться", "Купить любую одежду", "$500", 5007, -5786],
                    ["Швейный завод", "Для того, чтобы получить бинты, необходимо обменять любую одежду на ткань в швейной фабрике, после чего через инвентарь будет возможность их скрафтить", "Рецепт малой аптечки", 5063, -4591],
                    ["Ламар", "Познакомиться с Ламаром", "Автомобиль", -218, -1368],
                    ["Бричка", "Найти и припарковать свой транспорт (Найти можно через телефон в приложении UVeh)", "$500", -218, -1368],
                    ["Кчау", "Примите участие в гонках на Maze Bank Arena", "$2000", -255, -2026],
                    ["Сила револьвера", "Примите участие в дуэли", "$2000", -255, -2026],
                    ["Время пострелять", "Примите участие в GunZone", "$2000", -255, -2026],
                    ["По карьерной лестнице", "Устроиться на работу в Правительство/LSPD/BCSD/Армию/Службу новостей, на ваш выбор", "$20,000", 0, 0],
                ]
            }

            return true
        }
    },
    gang: {
        name: "Тёмная сторона",
        skin: "ig_lamardavis",
        skinRot: 43.398406982421875,
        anim: "WORLD_HUMAN_SMOKING",
        pos: new mp.Vector3(-218.75608825683594, -1368.4576416015625, 31.25823402404785),
        tasks: [
            ["Знакомство", "Найти Ламара и поговорить с ним", "Доступ к консоли в телефоне", -218, -1368],
            ["Фургоны", "Перевезите фургон у Ламара и заработайте свои первые BitCoin", "$200", -218, -1368],
            ["Криминальный мир", "Познакомьтесь с криминальными организациями штата", "$500", -218, -1368],
            ["Купите сумку", "Купите сумку в охотничьем магазине в Paleto Bay", "$500", -680, 5832],
            ["Купите маску", "Купите маску в магазине масок на пляже Del Pierro", "$1000", -1338, -1278],
            ["Console v1", "Обновите пакеты в консоли через команду apt-get update", "1btc", -218, -1368],
            ["Угон", "Угоните транспорт любым доступным способом и продайте его через консоль введя команду ecorp -car -getpos", "1btc", -218, -1368],
            ["BitCoin", "Узнайте ваш баланс BitCoin с помощью команды ecorp -balance", "1btc", -218, -1368],
            ["Вывод", "Выведите BitCoin на вашу карту с помощью команды ecorp -coin -toBankCard [Сумма]", "1btc",-218, -1368],
            ["Организация", "Вступите в любую криминальную организацию", "10btc", -218, -1368],
            ["Стволы", "Купите любое оружие и экипируйте его", "10btc", -218, -1368],
            ["Разгрузка", "Разгрузите фургон с войны за грузы", "20btc", -218, -1368],
            ["Кассы", "Взломайте кассу и ограбьте магазин", "50btc", -218, -1368],
            ["Отмыв", "Отмойте вашу выручку любым доступным способом например через ecorp -money -clear", "50btc", -218, -1368],
            ["Ограбление банка", "Ограбьте ячейку в банке", "100btc", -218, -1368],
        ],
        canSee: () => { return true }
    },
    fish: {
        name: "Рыболов",
        skin: "",
        skinRot: 0,
        anim: "",
        pos: new mp.Vector3(0, 0, 0),
        tasks: [
            ["Лицензия", "Приобрести лицензию на рыболовство в здании правительства", "$500", -1290, -571],
            ["Удочка", "Купить удочку в рыболовном магазине", "$100", -1599, 5202],
            ["Ловля рыбы", "Поймать 10шт любой рыбы", "$200"],
            ["Сбыт", "Продать рыбу в любом 24/7", "$500", 0, 98],
            ["По-крупному", "Поймать Американская палия 25шт", "Рецепт крафта улучшенной удочки + $1000"],
            ["Крафт", "Скрафтить улучшенную удочку", "$250"],
            ["Макрель", "Поймать Калифорнийский макрель 5шт", "$1500"],
            ["Тунец", "Поймать Желтопёрый тунец 5шт", "$5000"],
        ],
        canSee: () => { return true }
    },
    business: {
        name: "Бизнесмен",
        skin: "",
        skinRot: 0,
        anim: "",
        pos: new mp.Vector3(0, 0, 0),
        tasks: [
            ["Лицензия", "Приобрести лицензию на предпренимательство в здании правительства", "$500", -1290, -571],
            ["В горы", "Купить любой бизнес", "$500", -158, -605],
            ["Налоги", "Положить на счёт продуктов $10,000 за одну операцию", "$5000", -158, -605],
        ],
        canSee: () => { return true }
    },
    /*work: {
        name: "Работяга",
        skin: "",
        skinRot: 0,
        anim: "",
        pos: new mp.Vector3(0, 0, 0),
        tasks: [
            ["Лицензия", "Приобрести лицензию на предпренимательство в здании правительства", "$500"],
            ["В горы", "Купить любой бизнес", "$500"],
            ["Выручка", "Снять выручку в размере $10,000 за одну операцию", "$1000"],
        ],
        canSee: () => { return true }
    },
    top: {
        name: "Миллионер",
        skin: "",
        skinRot: 0,
        anim: "",
        pos: new mp.Vector3(0, 0, 0),
        tasks: [
            ["Первый шаг", "Иметь на руках ", "$500"],
            ["В горы", "Купить любой бизнес", "$500"],
            ["Выручка", "Снять выручку в размере $10,000 за одну операцию", "$1000"],
        ],
        canSee: () => { return true }
    },*/
};

quest.loadAllBlip = function() {
    quest.getQuestAllNames().forEach(item => {
        try {
            if (!quest.getQuestCanSee(item))
                return;

            if (user.getQuestCount(item) >= quest.getQuestLineMax(item))
                return;

            if (questList[item].skin === '' || item === 'standart')
                return;

            if (user.getQuestCount(item) > 0) {
                mp.blips.new(280, quest.getQuestPos(item),
                    {
                        color: 5,
                        scale: 0.6,
                        drawDistance: 100,
                        shortRange: true,
                        dimension: -1
                    });
            }
            else {
                mp.blips.new(280, quest.getQuestPos(item),
                    {
                        color: 5,
                        scale: 0.6,
                        drawDistance: 100,
                        shortRange: false,
                        dimension: -1
                    });
            }
        }
        catch (e) {
            methods.debug('LOAD_ALL_QUESTS_BLIPS', e.toString())
        }
    });
};

quest.notify = function(title, award) {
    mp.game.ui.notifications.showWithPicture(title, '~g~Задание выполнено', `Вы получили награду ~g~${award}`, "CHAR_ACTING_UP", 1);
};

quest.gang = function(isBot = false, start = -1, done = 0) {

    try {
        quest.standart(false, -1, 8);

        let qName = 'gang';

        if (start < 0)
            start = user.getQuestCount(qName);

        if (start >= quest.getQuestLineMax(qName))
            return;

        switch (start) {
            case 0: {

                if (phone.getType() == 0) {
                    mp.game.ui.notifications.show(`~r~Для того, чтобы начать квест, необходимо иметь телефон`);
                    return;
                }
                if (!isBot)
                    return;
                user.setQuest(qName, 1);
                setTimeout(function () {
                    mp.events.callRemote('server:user:generateCryptoCard');
                }, 500);

                npc.showDialogLamar('Ватсап друг, вот держи ссылку, теперь у тебя есть доступ к приложению E-Corp, мы все сейчас через него работаем, крутая штука. Если подробнее, то открой консоль в телефоне и впиши команду ecorp. В общем, вся криминальная жизнь проходит через приложение E-Corp. Люди сами выбирают как будет выглядеть их организация и чем она будет заниматься, но чтобы ты смог в неё попасть или создать свою, тебе необходимо иметь соответсвующую репутацию. Все наводки от меня, у тебя доступны в приложении E-Corp, я буду тебе всё присылать.');
                break;
            }
            case 1: {
                if (done === start) {
                    quest.notify(quest.getQuestLineName(qName, start), quest.getQuestLinePrize(qName, start));
                    user.setQuest(qName, start + 1);
                    user.addCashMoney(200);
                    quest.gang();
                    ui.showDialog('Теперь вам доступны перевозки фургона Ламара, как дополнительный доход. Для того, чтобы продолжить квестовое задание, езжайте к Ламару', 'Информация');
                    return;
                }
                if (!isBot)
                    return;
                npc.showDialogLamar(quest.getQuestLineInfo(qName, start));
                break;
            }
            case 2: {

                if (isLamar) {
                    isLamar = false;
                    jobPoint.delete();

                    user.setQuest(qName, 3);
                    user.addCashMoney(100, 'Помощь Ламару');
                    quest.notify(quest.getQuestLineName(qName, start), quest.getQuestLinePrize(qName, start));
                    return;
                }

                if (!isBot)
                    return;
                isLamar = true;
                npc.showDialogLamar('Так, я хочу рассказать что у нас есть большое количество различных группировок, с частью из них я познакомлю тебя прямо сейчас, координаты дам тебе в GPS, отправляйся туда и освойся, но будь аккуратен, ребята не очень любят когда долго чужаки тусят на их районе');
                _checkpointId = jobPoint.create(questLamarShop[_currentCheckpointId], true, 3);
                break;
            }
            case 3: {
                if (done === start) {
                    quest.notify(quest.getQuestLineName(qName, start), quest.getQuestLinePrize(qName, start));
                    user.setQuest(qName, start + 1);
                    user.addCashMoney(500);
                    quest.gang();
                    return;
                }
                if (!isBot)
                    return;
                npc.showDialogLamar(quest.getQuestLineInfo(qName, start));
                break;
            }
            case 4: {
                if (done === start) {
                    quest.notify(quest.getQuestLineName(qName, start), quest.getQuestLinePrize(qName, start));
                    user.setQuest(qName, start + 1);
                    user.addCashMoney(1000);
                    quest.gang();
                    user.save();
                    return;
                }
                if (!isBot)
                    return;
                npc.showDialogLamar(quest.getQuestLineInfo(qName, start));
                break;
            }
            case 5:
            case 6:
            case 7:
            case 8:
            {
                if (done === start) {
                    quest.notify(quest.getQuestLineName(qName, start), quest.getQuestLinePrize(qName, start));
                    user.setQuest(qName, start + 1);
                    user.addCryptoMoney(1);
                    quest.gang();
                    return;
                }
                if (!isBot)
                    return;
                npc.showDialogLamar(quest.getQuestLineInfo(qName, start));
                break;
            }
            case 9:
            case 10:
            {
                if (done === start) {
                    quest.notify(quest.getQuestLineName(qName, start), quest.getQuestLinePrize(qName, start));
                    user.setQuest(qName, start + 1);
                    user.addCryptoMoney(10);
                    quest.gang();
                    return;
                }
                if (!isBot)
                    return;
                npc.showDialogLamar(quest.getQuestLineInfo(qName, start));
                break;
            }
            case 11:
            {
                if (done === start) {
                    quest.notify(quest.getQuestLineName(qName, start), quest.getQuestLinePrize(qName, start));
                    user.setQuest(qName, start + 1);
                    user.addCryptoMoney(20);
                    quest.gang();
                    return;
                }
                if (!isBot)
                    return;
                npc.showDialogLamar(quest.getQuestLineInfo(qName, start));
                break;
            }
            case 12:
            case 13:
            {
                if (done === start) {
                    quest.notify(quest.getQuestLineName(qName, start), quest.getQuestLinePrize(qName, start));
                    user.setQuest(qName, start + 1);
                    user.addCryptoMoney(50);
                    quest.gang();
                    return;
                }
                if (!isBot)
                    return;
                npc.showDialogLamar(quest.getQuestLineInfo(qName, start));
                break;
            }
            case 14:
            {
                if (done === start) {
                    quest.notify(quest.getQuestLineName(qName, start), quest.getQuestLinePrize(qName, start));
                    user.setQuest(qName, start + 1);
                    user.addCryptoMoney(100);
                    quest.gang();
                    user.save();
                    return;
                }
                if (!isBot)
                    return;
                npc.showDialogLamar(quest.getQuestLineInfo(qName, start));
                break;
            }
        }
    }
    catch (e) {
        methods.debug('Q_GANG', e.toString())
    }
};

quest.role0 = function(isBot = false, start = -1) {

    try {
        return;
        /*if (user.getCache('role') !== 0)
            return;*/

        let qName = 'role_0';

        if (start < 0)
            start = user.getQuestCount(qName);

        if (start >= quest.getQuestLineMax(qName))
            return;

        switch (start) {
            case 0: {
                if (!isBot)
                    return;
                user.showCustomNotify('Список ваших квестов можно посмотреть через M -> Квесты', 0, 5, 20000);
                ui.showDialog('Привет, я смотрю ты только приехал, у меня для тебя работка есть, уверен лишние деньги тебе не помешают. В общем, необходимо разгрузить 20 ящиков с корабля, как будешь готов, я выдам тебе форму', 'Каспер');
                break;
            }
            case 1: {
                if(user.getCache('work_lic') != '') {
                    quest.notify(quest.getQuestLineName(qName, start), quest.getQuestLinePrize(qName, start));
                    user.set('work_lvl', user.getCache('work_lic') + 1);
                    user.setQuest(qName, 2);
                    return;
                }
                if (!isBot)
                    return;
                ui.showDialog('Ты не плохо справился, езжай теперь к зданию правительства, там можешь поговорить с Сюзанной', 'Каспер');
                user.setWaypoint(-1379.659, -499.748);
                break;
            }
        }
    }
    catch (e) {
        methods.debug('Q_ROLE', e.toString());
    }
};

quest.standart = function(isBot = false, start = -1, done = 0) {

    try {
        let qName = 'standart';

        if (start < 0)
            start = user.getQuestCount(qName);

        if (start >= quest.getQuestLineMax(qName))
            return;

        switch (start) {
            case 0: {

                if(user.getCache('b_lic')) {
                    quest.notify(quest.getQuestLineName(qName, start), quest.getQuestLinePrize(qName, start));
                    user.setQuest(qName, start + 1);
                    user.addCashMoney(100);
                    user.buyLicense('a_lic', 0.10);
                    quest.standart();
                    return;
                }

                if (!isBot)
                    return;
                user.showCustomNotify('Список ваших квестов можно посмотреть через M -> Квесты', 0, 5, 20000);
                if (ui.isIslandZone())
                    npc.showDialogStandartIsland('Привет, тебе необходимо сейчас в здании правительства, которое находиться позади меня, оформить лицензию категории B. И да, не забудь экипировать телефон, он у тебя в инвентаре.');
                else
                    npc.showDialogStandart('Привет, тебе необходимо сейчас в здании правительства, которое находиться позади меня, оформить лицензию категории B. И да, не забудь экипировать телефон, он у тебя в инвентаре.');
                break;
            }
            case 1: {
                if(user.getCache('job') > 0) {
                    quest.notify(quest.getQuestLineName(qName, start), quest.getQuestLinePrize(qName, start));
                    user.setQuest(qName, start + 1);
                    user.addCashMoney(200);
                    quest.standart();
                    return;
                }
                if (!isBot)
                    return;
                if (ui.isIslandZone())
                    npc.showDialogStandartIsland('Устройся на работу садовника или строителя, чтобы заработать свои первые деньги');
                else
                    npc.showDialogStandart('Устройся на работу садовника или строителя, чтобы заработать свои первые деньги');
                break;
            }
            case 2: {
                if (done === start) {
                    quest.notify(quest.getQuestLineName(qName, start), quest.getQuestLinePrize(qName, start));
                    user.setQuest(qName, start + 1);
                    user.addCashMoney(250);
                    quest.standart();
                    user.save();
                    return;
                }
                if (!isBot)
                    return;
                if (ui.isIslandZone())
                    npc.showDialogStandartIsland(quest.getQuestLineInfo(qName, start));
                else
                    npc.showDialogStandart(quest.getQuestLineInfo(qName, start));
                break;
            }
            case 3: {
                if (done === start) {
                    quest.notify(quest.getQuestLineName(qName, start), quest.getQuestLinePrize(qName, start));
                    user.setQuest(qName, start + 1);
                    user.addCashMoney(500);
                    quest.standart();
                    return;
                }
                if (!isBot)
                    return;
                if (ui.isIslandZone())
                    npc.showDialogStandartIsland(quest.getQuestLineInfo(qName, start));
                else
                    npc.showDialogStandart(quest.getQuestLineInfo(qName, start));
                break;
            }
            case 4:
            case 5:
            case 6:
            {
                if (done === start) {
                    quest.notify(quest.getQuestLineName(qName, start), quest.getQuestLinePrize(qName, start));
                    user.setQuest(qName, start + 1);
                    user.addCashMoney(200);
                    quest.standart();
                    return;
                }
                if (!isBot)
                    return;
                if (ui.isIslandZone())
                    npc.showDialogStandartIsland(quest.getQuestLineInfo(qName, start));
                else
                    npc.showDialogStandart(quest.getQuestLineInfo(qName, start));
                break;
            }
            case 7: {
                if (done === start) {
                    quest.notify(quest.getQuestLineName(qName, start), quest.getQuestLinePrize(qName, start));
                    user.setQuest(qName, start + 1);
                    inventory.addItem(474, 1, 1, user.getCache('id'), 1, 0, JSON.stringify({id:1}));
                    quest.standart();
                    user.save();
                    inventory.hide();
                    ui.showDialog('На проекте есть рецепты для крафта различных компонентов, некоторые вы получаете игровым путем, рецепт на большую аптечку можно купить у сотрудников EMS, также некоторые предметы имеют свойство ломаться, например оружие и бронежилеты, их необходимо чинить на специальных зонах для крафта, которые находятся в складах или в подвалах у банд', 'Информация');
                    return;
                }
                if (!isBot)
                    return;
                if (ui.isIslandZone())
                    npc.showDialogStandartIsland(quest.getQuestLineInfo(qName, start));
                else
                    npc.showDialogStandart(quest.getQuestLineInfo(qName, start));
                break;
            }
            case 8: {
                if (done === start) {
                    quest.notify(quest.getQuestLineName(qName, start), quest.getQuestLinePrize(qName, start));
                    user.setQuest(qName, start + 1);
                    quest.standart();
                    let vehList = ['Emperor2', 'Tornado3', 'Tornado4', 'Rebel', 'Voodoo2'];
                    user.giveVehicle(vehList[methods.getRandomInt(0, vehList.length)], 1, false, '', true);
                    return;
                }
                if (!isBot)
                    return;
                if (ui.isIslandZone())
                    npc.showDialogStandartIsland(quest.getQuestLineInfo(qName, start));
                else
                    npc.showDialogStandart(quest.getQuestLineInfo(qName, start));
                break;
            }
            case 9: {
                if (done === start) {
                    quest.notify(quest.getQuestLineName(qName, start), quest.getQuestLinePrize(qName, start));
                    user.setQuest(qName, start + 1);
                    quest.standart();
                    user.addCashMoney(500);
                    user.save();
                    ui.showDialog('У каждого транспорта есть свои уникальные характеристики, их можно посмотреть через панель транспорта нажав кнопку 2, открыв вкладку характеристики. Учтите, транспорт при авариях может повреждаться и из-за этого его ходовые качества будут изменяться', 'Информация');
                    return;
                }
                if (!isBot)
                    return;
                if (ui.isIslandZone())
                    npc.showDialogStandartIsland(quest.getQuestLineInfo(qName, start));
                else
                    npc.showDialogStandart(quest.getQuestLineInfo(qName, start));
                break;
            }
            case 10:
            case 11:
            case 12:
            {
                if (done === start) {
                    quest.notify(quest.getQuestLineName(qName, start), quest.getQuestLinePrize(qName, start));
                    user.setQuest(qName, start + 1);
                    quest.standart();
                    user.addCashMoney(2000);
                    return;
                }
                if (!isBot)
                    return;
                if (ui.isIslandZone())
                    npc.showDialogStandartIsland(quest.getQuestLineInfo(qName, start));
                else
                    npc.showDialogStandart(quest.getQuestLineInfo(qName, start));
                break;
            }
            case 13:
            {
                if (done === start) {
                    quest.notify(quest.getQuestLineName(qName, start), quest.getQuestLinePrize(qName, start));
                    user.setQuest(qName, start + 1);
                    quest.standart();
                    user.addCashMoney(20000);
                    user.save();
                    return;
                }
                if (!isBot)
                    return;
                if (ui.isIslandZone())
                    npc.showDialogStandartIsland(quest.getQuestLineInfo(qName, start));
                else
                    npc.showDialogStandart(quest.getQuestLineInfo(qName, start));
                break;
            }
        }
    }
    catch (e) {
        methods.debug('Q_ST', e.toString());
    }
};

quest.fish = function(isBot = false, start = -1, done = 0) {

    try {
        let qName = 'fish';

        if (start < 0)
            start = user.getQuestCount(qName);

        if (start >= quest.getQuestLineMax(qName))
            return;

        switch (start) {
            case 0: {
                if(user.getCache('fish_lic')) {
                    quest.notify(quest.getQuestLineName(qName, start), quest.getQuestLinePrize(qName, start));
                    user.setQuest(qName, start + 1);
                    user.addCashMoney(500);
                    return;
                }
                break;
            }
            case 1: {
                if(done === start) {
                    quest.notify(quest.getQuestLineName(qName, start), quest.getQuestLinePrize(qName, start));
                    user.setQuest(qName, start + 1);
                    user.addCashMoney(100);
                    return;
                }
                break;
            }
            case 2: {
                if(done === start) {
                    let qParams = user.getQuestParams(qName);
                    if (methods.parseInt(qParams[0]) === 10) {
                        quest.notify(quest.getQuestLineName(qName, start), quest.getQuestLinePrize(qName, start));
                        user.setQuest(qName, start + 1);
                        user.addCashMoney(200);
                    }
                    else {
                        qParams[0] = methods.parseInt(qParams[0]) + 1;
                        user.setQuest(qName, start, qParams);
                        mp.game.ui.notifications.show(`Квест\n~b~Вы поймали: ${qParams[0]}шт рыбы`);
                    }
                    return;
                }
                break;
            }
            case 3: {
                if(done === start) {
                    quest.notify(quest.getQuestLineName(qName, start), quest.getQuestLinePrize(qName, start));
                    user.setQuest(qName, start + 1);
                    user.addCashMoney(200);
                    return;
                }
                break;
            }
            case 4: {
                if(done === start) {
                    let qParams = user.getQuestParams(qName);
                    if (methods.parseInt(qParams[1]) === 25) {
                        quest.notify(quest.getQuestLineName(qName, start), quest.getQuestLinePrize(qName, start));
                        user.setQuest(qName, start + 1);
                        user.addCashMoney(1000);
                        inventory.addItem(474, 1, 1, user.getCache('id'), 1, 0, JSON.stringify({id:3}));
                    }
                    else {
                        qParams[1] = methods.parseInt(qParams[1]) + 1;
                        user.setQuest(qName, start, qParams);
                        mp.game.ui.notifications.show(`Квест\n~b~Вы поймали: ${qParams[1]}шт американская палии`);
                    }
                    return;
                }
                break;
            }
            case 5: {
                if(done === start) {
                    quest.notify(quest.getQuestLineName(qName, start), quest.getQuestLinePrize(qName, start));
                    user.setQuest(qName, start + 1);
                    user.addCashMoney(250);
                    return;
                }
                break;
            }
            case 6: {
                let qParams = user.getQuestParams(qName);
                if (methods.parseInt(qParams[2]) === 5) {
                    quest.notify(quest.getQuestLineName(qName, start), quest.getQuestLinePrize(qName, start));
                    user.setQuest(qName, start + 1);
                    user.addCashMoney(1500);
                }
                else {
                    qParams[2] = methods.parseInt(qParams[2]) + 1;
                    user.setQuest(qName, start, qParams);
                    mp.game.ui.notifications.show(`Квест\n~b~Вы поймали: ${qParams[2]}шт рыбы`);
                }
                break;
            }
            case 7: {
                let qParams = user.getQuestParams(qName);
                if (methods.parseInt(qParams[3]) === 5) {
                    quest.notify(quest.getQuestLineName(qName, start), quest.getQuestLinePrize(qName, start));
                    user.setQuest(qName, start + 1);
                    user.addCashMoney(5000);
                }
                else {
                    qParams[3] = methods.parseInt(qParams[3]) + 1;
                    user.setQuest(qName, start, qParams);
                    mp.game.ui.notifications.show(`Квест\n~b~Вы поймали: ${qParams[3]}шт рыбы`);
                }
                break;
            }
        }
    }
    catch (e) {
        methods.debug('Q_FISH', e.toString());
    }
};

quest.business = function(isBot = false, start = -1, done = 0) {

    try {
        let qName = 'business';

        if (start < 0)
            start = user.getQuestCount(qName);

        if (start >= quest.getQuestLineMax(qName))
            return;

        switch (start) {
            case 0: {
                if(user.getCache('biz_lic')) {
                    quest.notify(quest.getQuestLineName(qName, start), quest.getQuestLinePrize(qName, start));
                    user.setQuest(qName, start + 1);
                    user.addCashMoney(500);
                    return;
                }
                break;
            }
            case 1: {
                if(user.getCache('business_id') > 0) {
                    quest.notify(quest.getQuestLineName(qName, start), quest.getQuestLinePrize(qName, start));
                    user.setQuest(qName, start + 1);
                    user.addCashMoney(500);
                    return;
                }
                break;
            }
            case 2: {
                if(done === start) {
                    quest.notify(quest.getQuestLineName(qName, start), quest.getQuestLinePrize(qName, start));
                    user.setQuest(qName, start + 1);
                    user.addCashMoney(5000);
                    return;
                }
                break;
            }
        }
    }
    catch (e) {
        methods.debug('Q_BIZ', e.toString());
    }
};

quest.getQuestAllNames = function() {
    return questNames;
};

quest.getQuestAll = function() {
    return questList;
};

quest.getQuestName = function(type) {
    try {
        return questList[type].name;
    }
    catch (e) {}
    return '';
};

quest.getQuestPos = function(type) {
    try {
        return questList[type].pos;
    }
    catch (e) {}
    return new mp.Vector3(0,0,0);
};

quest.getQuestCanSee = function(type) {
    try {
        return questList[type].canSee();
    }
    catch (e) {}
    return false;
};

quest.getQuestLineMax = function(type) {
    try {
        return questList[type].tasks.length;
    }
    catch (e) {}
    return 0;
};

quest.getQuestLineName = function(type, lineId) {
    try {
        return questList[type].tasks[lineId][0];
    }
    catch (e) {}
    return 'Квест завершён';
};

quest.getQuestLinePos = function(type, lineId) {
    try {
        return {x: methods.parseInt(questList[type].tasks[lineId][3]), y: methods.parseInt(questList[type].tasks[lineId][4])};
    }
    catch (e) {}
    return {x: 0, y: 0};
};

quest.getQuestLineInfo = function(type, lineId) {
    try {
        return questList[type].tasks[lineId][1];
    }
    catch (e) {}
    return 'Квест завершён';
};

quest.getQuestLinePrize = function(type, lineId) {
    try {
        return questList[type].tasks[lineId][2];
    }
    catch (e) {}
    return 'Квест завершён';
};

mp.events.add("playerEnterCheckpoint", (checkpoint) => {
    try {
        if (_checkpointId == -1 || _checkpointId == undefined)
            return;
        if (checkpoint.id == _checkpointId) {

            if (isLamar) {

                if (_currentCheckpointId === 0)
                    ui.showDialog('Это банда The Ballas Gang, этническая состовляющая - Афроамериканцы. Баллас одеты в цвета баскетбольной команды Los Santos Panic и бейсбольной команды Los Santos Boars. Фиолетовые в общем.', 'Информация');
                if (_currentCheckpointId === 1)
                    ui.showDialog('Это банда The Families, этническая состовляющая - Афроамериканцы. Банда не едина, и поэтому по контролируемой территории кенты делятся на отдельные группировки, называемые сэтами.', 'Информация');
                if (_currentCheckpointId === 2)
                    ui.showDialog('Это банда Los Santos Vagos, этническая состовляющая - Латиноамериканцы. По слухам — самая многочисленная мексиканская уличная банда в Лос-Сантосе.', 'Информация');
                if (_currentCheckpointId === 3)
                    ui.showDialog('Это банда The Bloods, этническая состовляющая - Афроамериканцы. Предводитель этой банды Mathew Fox, заняли себе самое сочное место в промозоне, потому что именно здесь хранятся огромное количество нелегала', 'Информация');
                if (_currentCheckpointId === 4)
                    ui.showDialog('Это банда Marabunta Grande, этническая состовляющая - Латиноамериканцы. Членов банды легко идентифицировать по многочисленным татуировкам, в том числе и на лицах.', 'Информация');

                _currentCheckpointId++;
                if (_currentCheckpointId >= questLamarShop.length) {
                    quest.gang();
                    return;
                }
                _checkpointId = jobPoint.create(questLamarShop[_currentCheckpointId], true, 3);
            }
        }
    }
    catch (e) {
        
    }
});

export default quest;