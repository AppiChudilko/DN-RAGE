import user from '../user';
import phone from '../phone';

import methods from "../modules/methods";

import ui from "../modules/ui";

import quest from "./quest";
import inventory from "../inventory";

let achievement = {};

let achievList = [
    { //0
        title: 'Гонщик',
        desc: 'Поучаствовать в 70 гонках на MazeBank Arena',
        win: '$100,000',
        img: 'https://i.imgur.com/6Ig0iN8.png',
        value: 70,
    },
    { //1
        title: 'Форсаж',
        desc: 'Займите первое место в гонке',
        win: '$50,000',
        img: 'https://i.imgur.com/BkG1owr.png',
        value: 10,
    },
    { //2
        title: 'GunZone',
        desc: 'Займите 1 место в GunZone',
        win: '$25,000',
        img: 'https://i.imgur.com/ji0Dkoh.png',
        value: 10,
    },
    { //3
        title: 'Ковбой',
        desc: 'Выиграть дуэль 10 раз',
        win: '$5,000',
        img: 'https://i.imgur.com/N6f7OD3.png',
        value: 10,
    },
    { //4
        title: 'Кайо-Перико',
        desc: 'Посетите остров Кайо-Перико',
        win: '$500',
        img: 'https://i.imgur.com/nynp8S6.png',
        value: 1,
    },
    { //5
        title: 'Работяга',
        desc: 'Выполните 500 заказов в такси',
        win: 'Транспорт Taxi',
        img: 'https://i.imgur.com/yrOXeE3.png',
        value: 500,
    },
    { //6
        title: 'По ту сторону звёзд',
        desc: 'Полетать на дроне',
        win: '$500',
        img: 'https://i.imgur.com/STVlxAn.png',
        value: 1,
    },
    { //7
        title: 'Аварийная ситуация',
        desc: 'Ликвидировать 10 автомобильных аварий',
        win: '$5,000',
        img: 'https://i.imgur.com/9o8G5nl.png',
        value: 10,
    },
    { //8
        title: 'Прогулка',
        desc: 'Пройти 25км пешком',
        win: '$10,000',
        img: 'https://i.imgur.com/z4Y7Sxy.png',
        value: 25,
    },
    { //9
        title: 'Рекламодатель',
        desc: 'Разместите 50 рекламных объявлений',
        win: '$10,000',
        img: 'https://i.imgur.com/ZkQ9gvS.png',
        value: 50,
    },
    { //10
        title: '100 друзей',
        desc: 'Познакомьтесь со 100 людьми',
        win: '$100',
        img: 'https://i.imgur.com/YHleGCv.png',
        value: 100,
    },
    { //11
        title: 'Фармер',
        desc: 'Отыграть 300 часов',
        win: '$300,000',
        img: 'https://i.imgur.com/SIneN2U.png',
        value: 300,
    },
    { //12
        title: 'Брак',
        desc: 'Поженитесь',
        win: '$5,000',
        img: 'https://i.imgur.com/hR2sFVv.png',
        value: 1,
    },
    { //13
        title: 'Нет, ну это сильно',
        desc: 'Достигнуть 15 WORK LVL',
        win: '$500,000',
        img: 'https://i.imgur.com/vTbRURf.png',
        value: 15,
    },
    { //14
        title: 'Эйден Пирс',
        desc: 'Сделайте блекаут',
        win: '$50,000',
        img: 'https://i.imgur.com/9Q1nbiN.png',
        value: 1,
    },
    { //15
        title: 'Лётчик',
        desc: 'Прокачать навык пилота на 100%',
        win: '$5,000',
        img: 'https://i.imgur.com/YF4tkaX.png',
        value: 100,
    },
    { //16
        title: 'Хороший отдых',
        desc: 'Напиться до потери сознания',
        win: '$1,000',
        img: 'https://i.imgur.com/BiyvbTH.png',
        value: 1,
    },
    { //17
        title: 'Ствол на прокачку',
        desc: 'Модифицировать любое оружие',
        win: '$500',
        img: 'https://i.imgur.com/sYH6tER.png',
        value: 1,
    },
    { //18
        title: 'Тачка на прокачку',
        desc: 'Протюнинговать транспорт',
        win: '$500',
        img: 'https://i.imgur.com/3P1zvog.png',
        value: 1,
    },
    { //19
        title: 'Тлен',
        desc: 'Застрелитесь с помощью пистолета через кнопку F3',
        win: 'Маска',
        img: 'https://i.imgur.com/uvXwM0S.png',
        value: 1,
    },
    { //20
        title: 'Ламар',
        desc: 'Выполните все квесты Ламара',
        win: 'Золотой Revolver',
        img: 'https://i.imgur.com/b5LOs0X.png',
        value: 1,
    },
    { //21
        title: 'Во все тяжкие',
        desc: 'Изготовьте одну поставку наркотиков через вашу лабораторию',
        win: 'FN 1922 Gold',
        img: 'https://i.imgur.com/nT6LYUD.png',
        value: 1,
    },
    { //22
        title: 'Чистота',
        desc: 'Отмойте деньги через бизнес',
        win: '$5,000',
        img: 'https://i.imgur.com/hXLqpqv.png',
        value: 1,
    },
    { //23
        title: 'Гетто ящер',
        desc: 'Убить 10 человек на войне за территории',
        win: 'Золтой Eagle',
        img: 'https://i.imgur.com/94ZBWqO.png',
        value: 10,
    },
    { //24
        title: 'Грабитель',
        desc: 'Ограбить игрока',
        win: '$500',
        img: 'https://i.imgur.com/m38hIlb.png',
        value: 1,
    },
    { //25
        title: 'Постоянный клиент',
        desc: 'Отсидеть в тюрьме 100 раз',
        win: '$250,000',
        img: 'https://i.imgur.com/uOuTjyQ.png',
        value: 100,
    },
    { //26
        title: 'УДО',
        desc: 'Поработайте у сотрудника тюрьмы',
        win: '$500',
        img: 'https://i.imgur.com/Z2J9lwh.png',
        value: 1,
    },
    { //27
        title: 'Взять сотку',
        desc: 'Состоять в банде которая взяла 100% территорий в гетто',
        win: 'Musket Gold',
        img: 'https://i.imgur.com/G3BG58i.png',
        value: 1,
    },
    { //28
        title: 'Бизнесмен',
        desc: 'Продать бизнес дороже чем его гос. стоимость',
        win: '$10,000',
        img: 'https://i.imgur.com/go3d6mM.png',
        value: 1,
    },
    { //29
        title: 'Миллионер',
        desc: 'Общая сумма налички и банка должна быть $1,000,000',
        win: '$100,000',
        img: 'https://i.imgur.com/3YzIkTx.png',
        value: 1000000,
    },
    { //30
        title: 'Автовладелец',
        desc: 'Купить автомобиль из любого автосалона',
        win: '$1,000',
        img: 'https://i.imgur.com/c6BWefo.png',
        value: 1,
    },
    { //31
        title: 'Американская мечта',
        desc: 'Купить дом дороже $5,000,000',
        win: '$250,000',
        img: 'https://i.imgur.com/KDSiyix.png',
        value: 1,
    },
    { //32
        title: '+ Respect',
        desc: 'Выполнить все достижения',
        win: '$1,000,000',
        img: 'https://i.imgur.com/hcz74Zy.png',
        value: 1,
    },
];

let dailyList = [
    { //0
        title: 'Плавец',
        desc: 'Поплавайте в любом водоеме',
        win: '10 BP',
        img: 'https://i.imgur.com/wUPNooZ.png',
        value: 1,
    },
    { //1
        title: 'Уиу-уиу',
        desc: 'Пройдите лечение в больнице 5 раз',
        win: '50 BP',
        img: 'https://i.imgur.com/4OITo3M.png',
        value: 5,
    },
    { //2
        title: 'Сповинной',
        desc: 'Сдайтесь полиции и отсидите в тюрьме',
        win: '50 BP',
        img: 'https://i.imgur.com/jI5qiFy.png',
        value: 1,
    },
    { //3
        title: 'Убер',
        desc: 'Выполните 10 заказов в такси',
        win: '50 BP',
        img: 'https://i.imgur.com/eMnZ2fo.png',
        value: 10,
    },
    { //4
        title: 'Гонщик',
        desc: 'Войдите в топ 5 на гонках',
        win: '25 BP',
        img: 'https://i.imgur.com/bLNTaQV.png',
        value: 1,
    },
    { //5
        title: 'Чисто',
        desc: 'Помой транспорт в автомойке',
        win: '10 BP',
        img: 'https://i.imgur.com/9dZT2g5.png',
        value: 1,
    },
    { //6
        title: 'Полёт нормальный',
        desc: 'Полетайте на вертолете',
        win: '10 BP',
        img: 'https://i.imgur.com/gOjpBiQ.png',
        value: 1,
    },
    { //7
        title: 'Карты, деньги, два ствола',
        desc: 'Купите оружие в оружейном магазине',
        win: '25 BP',
        img: 'https://i.imgur.com/fvWDShX.png',
        value: 1,
    },
    { //8
        title: 'Чиллиад',
        desc: 'Заберитесь на гору Чиллиад',
        win: '10 BP',
        img: 'https://i.imgur.com/EXxFQqi.png',
        value: 1,
    },
    { //9
        title: 'Пробежка',
        desc: 'Бегите до тех пор, пока не устанет ваш персонаж',
        win: '10 BP',
        img: 'https://i.imgur.com/pgrxNRE.png',
        value: 1,
    },
    { //10
        title: 'Удача',
        desc: 'Покрутие колесо удачи в казино Diamond',
        win: '100 BP',
        img: 'https://i.imgur.com/c4UE3JC.png',
        value: 1,
    },
    { //11
        title: 'Азарт',
        desc: 'Сыграйте с кем-то в кости',
        win: '10 BP',
        img: 'https://i.imgur.com/BwpacV2.png',
        value: 1,
    },
    { //12
        title: 'Аренда',
        desc: 'Арендовать велосипед',
        win: '10 BP',
        img: 'https://i.imgur.com/gqWKeKP.png',
        value: 1,
    },
    { //13
        title: 'Новые знакомства',
        desc: 'С кем-то познакомиться',
        win: '10 BP',
        img: 'https://i.imgur.com/QAgIlRS.png',
        value: 1,
    },
    { //14
        title: 'Налоги',
        desc: 'Оплатите налоги',
        win: '10 BP',
        img: 'https://i.imgur.com/8eAHl7q.png',
        value: 1,
    },
    { //15
        title: 'Страсть',
        desc: 'Поцелуйтесь с кем-либо',
        win: '10 BP',
        img: 'https://i.imgur.com/6lgnAZs.png',
        value: 1,
    },
    { //16
        title: 'Прическа',
        desc: 'Смените причёску',
        win: '10 BP',
        img: 'https://i.imgur.com/QAgIlRS.png',
        value: 1,
    },
    { //17
        title: 'Тату',
        desc: 'Набейте татуировку',
        win: '10 BP',
        img: 'https://i.imgur.com/222LuVj.png',
        value: 1,
    }
];

achievement.update = async function() {
    try {
        let daily = {
            title: 'Ежедневные задания',
            achiev_map: []
        };
        let all = {
            title: 'Достижения',
            achiev_map: []
        };

        let dataAll = JSON.parse(user.getCache('achiv'));
        achievList.forEach((item, idx) => {
            try {
                let progress = methods.parseInt(dataAll[idx]);
                if (progress > item.value)
                    progress = item.value;
                all.achiev_map.push({ name: item.title, desc: item.desc, value: [progress, item.value], result: item.win, img: item.img })
            }
            catch (e) {}
        });

        let dataDay = JSON.parse(await user.getById('dailyAchiv'));
        let dataDayAllow = JSON.parse(await user.getById('dailyAchivAllow'));
        dailyList.forEach((item, idx) => {
            try {
                if (!dataDayAllow.includes(idx)) return;
                let progress = methods.parseInt(dataDay[idx]);
                if (progress > item.value)
                    progress = item.value;
                daily.achiev_map.push({ name: item.title, desc: item.desc, value: [progress, item.value], result: item.win, img: item.img })
            }
            catch (e) {}
        });

        phone.updateAppAchiev([daily, all]);
    }
    catch (e) {
        methods.debug(e);
    }
};

achievement.notify = function(title, award) {
    mp.game.ui.notifications.showWithPicture(title, '~g~Задание выполнено', `Вы получили награду ~g~${award}`, "CHAR_ACTING_UP", 1);
};

achievement.checkerAll = function() {
    try {
        let data = JSON.parse(user.getCache('achiv'));
        if (data.length < achievList.length) {
            for (let i = 0; achievList.length - data.length; i++)
                data.push(0);
            user.set('achiv', JSON.stringify(data));
        }

        if (data[32] === 0) {
            let isDone = true;
            data.forEach((item, idx) => {
                if (item < achievList[idx].value)
                    isDone = false;
            });
            if (isDone)
                achievement.doneAllById(32);
        }

        if (ui.isIslandZone()) {
            achievement.doneAllById(4);
        }

        let walk = methods.parseInt(user.getCache('st_walk') / 1000);
        if (walk === 24) {
            achievement.doneAllById(8);
        }
        else if (walk < 24) {
            if (data[8] !== walk) {
                data[8] = walk;
                user.set('achiv', JSON.stringify(data));
            }
        }

        let hours = methods.parseInt(user.getCache('online_time') * 8.5 / 60);
        if (hours === 299) {
            achievement.doneAllById(11);
        }
        else if (hours < 299) {
            if (data[11] !== hours) {
                data[11] = hours;
                user.set('achiv', JSON.stringify(data));
            }
        }

        let workLvl = methods.parseInt(user.getCache('work_lvl'));
        if (workLvl === 14 && data[13] !== 15) {
            achievement.doneAllById(13);
        }
        else if (workLvl < 14) {
            if (data[13] !== workLvl) {
                data[13] = workLvl;
                user.set('achiv', JSON.stringify(data));
            }
        }

        let flyLvl = methods.parseInt(user.getCache('stats_flying'));
        if (flyLvl === 99) {
            achievement.doneAllById(15);
        }
        else if (flyLvl < 99) {
            if (data[15] !== flyLvl) {
                data[15] = flyLvl;
                user.set('achiv', JSON.stringify(data));
            }
        }

        let moneyLvl = methods.parseInt(user.getCashMoney() + user.getBankMoney());
        if (moneyLvl >= 999999 && data[29] !== 1000000) {
            data[29] = 1000000;
            user.set('achiv', JSON.stringify(data));
            user.addCashMoney(100000, 'Выполнено достижение: ' + achievList[29].title);
            achievement.notify(achievList[29].title, achievList[29].win);
            user.save();
        }
        else if (moneyLvl < 999999 && data[29] !== 1000000) {
            if (data[29] < moneyLvl) {
                data[29] = moneyLvl;
                user.set('achiv', JSON.stringify(data));
            }
        }

        if (user.getQuestCount('gang') === quest.getQuestLineMax('gang'))
            achievement.doneAllById(20);
    }
    catch (e) {
        
    }
};

achievement.doneAllById = function(id) {
    try {
        let data = JSON.parse(user.getCache('achiv'));
        if (data.length < achievList.length) {
            for (let i = 0; achievList.length - data.length; i++)
                data.push(0);
            user.set('achiv', JSON.stringify(data));
        }

        if (data[id] < achievList[id].value) {
            data[id] = data[id] + 1;
            user.set('achiv', JSON.stringify(data));

            if (data[id] === achievList[id].value) {
                if (id === 0 || id === 29)
                    user.addCashMoney(100000, 'Выполнено достижение: ' + achievList[id].title);
                if (id === 1 || id === 14)
                    user.addCashMoney(50000, 'Выполнено достижение: ' + achievList[id].title);
                if (id === 2)
                    user.addCashMoney(25000, 'Выполнено достижение: ' + achievList[id].title);
                if (id === 3 || id === 7 || id === 12 || id === 15 || id === 22 || id === 30)
                    user.addCashMoney(5000, 'Выполнено достижение: ' + achievList[id].title);
                if (id === 4 || id === 6 || id === 17 || id === 18 || id === 24 || id === 26)
                    user.addCashMoney(500, 'Выполнено достижение: ' + achievList[id].title);
                if (id === 8 || id === 9 || id === 28)
                    user.addCashMoney(10000, 'Выполнено достижение: ' + achievList[id].title);
                if (id === 10)
                    user.addCashMoney(100, 'Выполнено достижение: ' + achievList[id].title);
                if (id === 11)
                    user.addCashMoney(300000, 'Выполнено достижение: ' + achievList[id].title);
                if (id === 13)
                    user.addCashMoney(500000, 'Выполнено достижение: ' + achievList[id].title);
                if (id === 16)
                    user.addCashMoney(1000, 'Выполнено достижение: ' + achievList[id].title);
                if (id === 25 || id === 31)
                    user.addCashMoney(250000, 'Выполнено достижение: ' + achievList[id].title);
                if (id === 32)
                    user.addCashMoney(1000000, 'Выполнено достижение: ' + achievList[id].title);

                if (id === 5)
                    user.giveVehicle('taxi');
                if (id === 19)
                    user.giveRandomMask();
                if (id === 20)
                    inventory.takeNewItemJust(74, JSON.stringify({superTint: 384708672}));
                if (id === 21)
                    inventory.takeNewItemJust(83, JSON.stringify({tint: 2}));
                if (id === 23)
                    inventory.takeNewItemJust(79, JSON.stringify({tint: 2}));
                if (id === 27)
                    inventory.takeNewItemJust(89, JSON.stringify({tint: 2}));

                achievement.notify(achievList[id].title, achievList[id].win);
            }
        }
    }
    catch (e) {

    }
};

achievement.checkerDaily = function() {
    if (mp.players.local.isSwimming() || mp.players.local.isSwimmingUnderWater())
        achievement.doneDailyById(0);
    if (mp.players.local.isInAnyHeli() && mp.players.local.vehicle.isInAir())
        achievement.doneDailyById(6);
    if (methods.distanceToPos(mp.players.local.position, new mp.Vector3(501.81573486328125, 5604.61181640625, 796.9110717773438)) < 50)
        achievement.doneDailyById(8);
};

achievement.doneDailyById = async function(id) {
    try {
        let dataDayAllow = JSON.parse(await user.getById('dailyAchivAllow'));
        if (!dataDayAllow.includes(id)) return;

        let data = JSON.parse(await user.getById('dailyAchiv'));

        if (data[id] < dailyList[id].value) {
            data[id] = data[id] + 1;
            user.setById('dailyAchiv', JSON.stringify(data));

            if (data[id] === dailyList[id].value) {
                if (id === 0 || id === 5 || id === 6 || id === 8 || id === 9 || id >= 11)
                    user.addBonusMoney(10, 'Выполнено достижение: ' + dailyList[id].title);
                if (id === 4 || id === 7)
                    user.addBonusMoney(25, 'Выполнено достижение: ' + dailyList[id].title);
                if (id === 1 || id === 2 || id === 3)
                    user.addBonusMoney(50, 'Выполнено достижение: ' + dailyList[id].title);
                if (id === 10)
                    user.addBonusMoney(100, 'Выполнено достижение: ' + dailyList[id].title);


                achievement.notify(dailyList[id].title, dailyList[id].win);
            }
        }
    }
    catch (e) {

    }
};

export default achievement;