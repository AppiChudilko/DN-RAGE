import methods from '../modules/methods';
import ui from '../modules/ui';

import jobPoint from '../manager/jobPoint';

import npc from "./npc";

import user from "../user";
import inventory from "../inventory";
import enums from "../enums";
import checkpoint from "./checkpoint";

let prolog = {};

let _checkpointId = -1;
let isStart = false;
let dimensionOffset = 20000000;
let currentCp = 0;

let housePickups = false;
let countTakeItems = 0;
let isEquipPhone = false;


let PrologHouseInt = new mp.Vector3(265.1008605957031, -1000.889892578125, -100.0086441040039);
let PrologHouseStreet = new mp.Vector3(3557.9091796875, -4683.9677734375, 113.5896987915039);
let BotYankt = new mp.Vector3(3200.11669921875, -4833.86474609375, 110.81522369384766);


let currentTask = 0;
let tasks = [
    'Войдите в дом и соберите все необходимые вещи', //0
    'Экипируйте телефон через инвентарь (I -> Экипировать телефон)', //1
    'Выйдете на улицу', //2
    'Возьмите канистру и заправьте транспорт (I - Использовать канистру)', //3
    'Садитесь в транспорт (L - Открыть/Закрыть транспорт)', //4
    'Запустите двигатель (2 -> Вкл Двигатель)', //5
    'Выйдете из транспорта и возьмите ящик с инструментами', //6
    'Почините транспорт (G -> Открыть капот) далее (I - Использовать инструменты)', //7
    'Садитесь в транспорт', //8
    'Езжайте в аэропорт', //9
    'Поговорите с полицейским', //10
    'Езжайте в аэропорт по второй дороге', //11
];

let vehicleList = [
    ["PoliceOld1", 3197.02197265625, -4830.8232421875, 111.42011260986328, 200.616943359375, true],
    ["PoliceOld2", 3196.88623046875, -4836.55126953125, 111.32765197753906, 332.8087463378906, true],
    ["Firetruk", 3147.50732421875, -4832.5615234375, 111.84664916992188, 103.23956298828125, true, 111],
    ["Ruiner3", 3133.7724609375, -4822.126953125, 111.52899169921875, 54.24737548828125],
    ["TowTruck", 3134.50244140625, -4831.7060546875, 111.73998260498047, 266.9862060546875],
    ["Firetruk", 3119.05419921875, -4830.3134765625, 111.84129333496094, 252.8970489501953, true, 111],
    ["Ambulance", 3118.175048828125, -4822.5693359375, 111.53388214111328, 87.15557861328125, true],
    ["PoliceOld1", 3100.5537109375, -4822.17822265625, 111.41871643066406, 203.12576293945312, true],
    ["PoliceOld2", 3102.23974609375, -4828.140625, 111.32986450195312, 153.23211669921875, true],
    ["Burrito5", 3207.1455078125, -4778.8916015625, 111.5469741821289, 244.49069213867188],
    ["Emperor3", 3219.855712890625, -4801.2373046875, 111.3913803100586, 357.83612060546875],
    ["Sadler2", 3214.132080078125, -4853.521484375, 111.51558685302734, 354.31622314453125],
    ["Tractor3", 4281.69970703125, -5104.5927734375, 110.77142333984375, 124.38162231445312],
    ["Tractor3", 4157.28466796875, -5129.07470703125, 110.25776672363281, 336.0196533203125],
    ["Burrito5", 4486.427734375, -5098.73291015625, 110.84072875976562, 97.4473876953125],
    ["Tractor3", 4762.8740234375, -5099.70166015625, 107.27474212646484, 274.5976867675781],
    ["Stockade3", 5343.9091796875, -5170.3271484375, 82.42269897460938, 13.833587646484375],
    ["Stockade3", 5431.61376953125, -5147.3154296875, 77.87919616699219, 168.2242431640625],
    ["RancherXL2", 5483.5908203125, -5196.94384765625, 78.38340759277344, 177.0040283203125],
];

let road1 = [
    [3544.8994140625, -4688.5478515625, 113.11293029785156, 179.34291076660156],
    [3529.3681640625, -4774.388671875, 110.9715347290039, 176.34268188476562],
    [3518.20654296875, -4856.240234375, 110.93570709228516, 146.34255981445312],
    [3473.614013671875, -4859.43701171875, 110.921875, 92.342041015625],
    [3394.0693359375, -4847.77197265625, 110.89227294921875, 89.3419189453125],
    [3308.374267578125, -4840.767578125, 110.85322570800781, 86.3418197631836],
    [3237.519287109375, -4834.35009765625, 110.84912109375, 86.34162902832031],
    [3206.15478515625, -4832.96435546875, 110.8292465209961, 116.34135437011719],
];

let road2 = [
    [3235.223876953125, -4839.62890625, 110.81504821777344, 268.1116943359375],
    [3362.435791015625, -4850.78955078125, 110.7905044555664, 268.112060546875],
    [3530.848876953125, -4879.40087890625, 110.7778091430664, 250.11224365234375],
    [3658.21435546875, -4932.85693359375, 110.7695083618164, 247.1125946044922],
    [3808.70556640625, -5001.61669921875, 110.73896789550781, 259.1129455566406],
    [3962.889404296875, -5045.4794921875, 108.6676254272461, 265.1132507324219],
    [4134.205078125, -5065.59326171875, 108.01471710205078, 262.1135559082031],
    [4335.4384765625, -5084.22509765625, 109.80316925048828, 253.11392211914062],
    [4486.61181640625, -5105.62109375, 109.97941589355469, 292.11419677734375],
    [4585.84912109375, -5062.9052734375, 109.20303344726562, 265.1143798828125],
    [4762.72412109375, -5088.05078125, 106.12261962890625, 262.1148681640625],
    [4910.88134765625, -5075.86083984375, 93.03040313720703, 262.11505126953125],
    [5121.18408203125, -5099.9130859375, 84.86231994628906, 268.11572265625],
    [5354.6337890625, -5122.5146484375, 77.39862823486328, 268.1155700683594],
    [5485.67529296875, -5140.55810546875, 77.2053451538086, 187.11526489257812],
    [5486.17138671875, -5255.6494140625, 77.5640869140625, 181.11598205566406],
];

let allowVehicles = ['emperor3', 'asea2', 'rancherxl2', 'mesa2', 'sadler2', 'burrito5'];

let vehiclesPool = [];
let pickupsPool = [];

prolog.start = function() {

    ui.showDialog('Добро пожаловать. Вы зашли на RolePay сервер, поэтому просим вас ознакомиться с правилами проекта и соблюдать RP процесс. Мы просим вас быть вежливыми и сдержанными с другими игроками. Мы хотим чтобы каждый игрок поддерживал и уважал атмосферу на сервере. Те, кто хотят портить игру другим игрокам, будут забанены администрацией. Желаем приятной игры!', 'Информация');

    methods.iplYanktonLoad();

    currentTask = 0;
    _checkpointId = jobPoint.create(PrologHouseStreet, true);
    isStart = true;

    housePickups = false;
    countTakeItems = 0;
    isEquipPhone = false;
    currentCp = 0;

    user.teleport(3554.4892578125, -4670.62646484375, 113.16798400878906, 140.56333923339844);
    user.setVirtualWorld(mp.players.local.remoteId + dimensionOffset);

    user.set('startProlog', true);

    mp.events.callRemote('server:prolog:spawnVehicle', allowVehicles[methods.getRandomInt(0, allowVehicles.length)]);

    vehicleList.forEach(item => {
        let vCurrent = mp.vehicles.new(mp.game.joaat(item[0]), new mp.Vector3(item[1], item[2], item[3]), { heading: item[4], engine: false, locked: true, numberPlate: "OMG", dimension: mp.players.local.remoteId + dimensionOffset });
        vCurrent.setRotation(0, 0, item[4], 0, true);

        if (item[5]) {
            vCurrent.setSirenSound(true);
            vCurrent.setSiren(true);
        }

        vCurrent.setCanBeDamaged(false);
        vCurrent.setNumberPlateTextIndex(5);
        vCurrent.setInvincible(true);
        if (item[6])
            vCurrent.setColours(item[6], item[6]);

        vehiclesPool.push(vCurrent);

        setTimeout(function () {try {vCurrent.freezePosition(true);} catch (e) {}}, 5000);
    });

    let dim = mp.players.local.remoteId + dimensionOffset;
    npc.create(mp.game.joaat("s_m_m_prisguard_01"), new mp.Vector3(3195.615478515625, -4843.75048828125, 111.86639404296875), 357.7933044433594, dim, "WORLD_HUMAN_SMOKING");
    npc.create(mp.game.joaat("s_m_m_snowcop_01"), new mp.Vector3(3195.656005859375, -4842.25537109375, 111.86990356445312), 174.50775146484375, dim, "WORLD_HUMAN_DRUG_DEALER");
    npc.create(mp.game.joaat("cs_prolsec_02"), new mp.Vector3(3198.975341796875, -4833.72998046875, 111.81517791748047), 263.877197265625, dim, "WORLD_HUMAN_CLIPBOARD");
    npc.create(mp.game.joaat("s_m_y_ranger_01"), new mp.Vector3(3197.803955078125, -4821.73779296875, 112.10292053222656), 186.72738647460938, dim, "WORLD_HUMAN_GUARD_STAND");
    npc.create(mp.game.joaat("s_m_m_snowcop_01"), new mp.Vector3(3198.833984375, -4811.748046875, 111.97410583496094), 10.083436012268066, dim, "CODE_HUMAN_MEDIC_TIME_OF_DEATH");
    npc.create(mp.game.joaat("csb_prologuedriver"), new mp.Vector3(3198.473876953125, -4809.9091796875, 112.10059356689453), 185.67567443847656, dim, "WORLD_HUMAN_DRINKING");
    npc.create(mp.game.joaat("ig_brad"), new mp.Vector3(3203.83447265625, -4822.96484375, 111.93563842773438), 100.02397918701172, dim, "WORLD_HUMAN_SMOKING");
    npc.create(mp.game.joaat("u_m_m_promourn_01"), new mp.Vector3(3203.02880859375, -4819.8037109375, 111.87794494628906), 119.79261779785156, dim, "WORLD_HUMAN_STAND_IMPATIENT");
    npc.create(mp.game.joaat("u_f_m_promourn_01"), new mp.Vector3(3200.32177734375, -4843.861328125, 112.0701904296875), 77.06122589111328, dim, "WORLD_HUMAN_TOURIST_MOBILE");
    npc.create(mp.game.joaat("g_m_m_chigoon_01"), new mp.Vector3(3214.7138671875, -4849.59423828125, 111.74788665771484), 355.5313415527344, dim, "WORLD_HUMAN_DRINKING");
    npc.create(mp.game.joaat("s_m_m_armoured_01"), new mp.Vector3(5432.6328125, -5142.80419921875, 78.19537353515625), 335.6464538574219, dim, "WORLD_HUMAN_CLIPBOARD");
};

prolog.stop = function() {

    user.showLoadDisplay();

    user.reset('startProlog');
    isStart = false;

    user.setComponentVariation(5, 0, 0);
    setTimeout(function () {


        user.setVirtualWorld(0);
        mp.events.callRemote('server:prolog:deleteVehicle');

        let roleIdx = user.getCache('role') - 1;
        user.teleport(enums.spawnByRole[roleIdx][0], enums.spawnByRole[roleIdx][1], enums.spawnByRole[roleIdx][2], enums.spawnByRole[roleIdx][3]);

        methods.iplYanktonUnload();

        setTimeout(function () {
            let roleIdx = user.getCache('role') - 1;
            if (roleIdx === 2) {
                ui.showDialog('По прилёту в штат Сан-Андреас, вас ограбили, украв сумку и документы, первым делом езжайте в здание правительства', 'Информация');
            }
            else if (roleIdx === 0) {
                ui.showDialog('По прилёту в штат Сан-Андреас, вас ограбили, украв сумку, но вы не отчаились и на метро вы приехали к зданию правительства, чтобы начать свой путь', 'Информация');
            }
            else {
                ui.showDialog('По прилёту на остров Кайо-Перико, вас ограбили, украв сумку, но вы не отчаились и добрались к зданию правительства, чтобы начать свой путь', 'Информация');
            }

        }, 500);

    }, 500);

    try {
        vehiclesPool.forEach(v => {
            try {
                v.destroy();
            }
            catch (e) {}
        })
    }
    catch (e) {

    }
};

prolog.createHousePickups = function() {
    housePickups = true;
    let pickup = {};
    pickup.handle = mp.game.object.createPickup(mp.game.joaat('PICKUP_MONEY_MED_BAG'), 262.0733947753906, -1004.022705078125, -99.29389190673828, 250, 1, true, 2406513688);
    pickup.bag = true;
    pickupsPool.push(pickup);

    pickup = {};
    pickup.handle = mp.game.object.createPickup(mp.game.joaat('PICKUP_MONEY_PAPER_BAG'), 266.4610290527344, -996.7720947265625, -99.04467010498047, 250, 1, false, 2406513688);
    pickup.eat = true;
    pickupsPool.push(pickup);

    pickup = {};
    pickup.handle = mp.game.object.createPickup(mp.game.joaat('PICKUP_MONEY_WALLET'), 261.88909912109375, -1000.6259155273438, -99.30319213867188, 250, 1, false, 2406513688); //MONEY
    pickup.money = true;
    pickupsPool.push(pickup);

    pickup = {};
    pickup.handle = mp.game.object.createPickup(mp.game.joaat('PICKUP_MONEY_CASE'), 261.02227783203125, -996.609619140625, -99.57059478759766, 250, 1, false, 2406513688); //PHONE + DOCS
    pickup.phone = true;
    pickupsPool.push(pickup);
};

prolog.createStreetPickups = function() {
    let pickup = {};
    pickup.handle = mp.game.object.createPickup(mp.game.joaat('PICKUP_WEAPON_PETROLCAN'), 3524.96630859375, -4677.54931640625, 113.1638412475586, 250, 1, true, 2406513688);
    pickup.fuel = true;
    pickupsPool.push(pickup);
};

prolog.getCurrentTask = function() {
    return tasks[currentTask];
};

prolog.getCurrentTaskId = function() {
    return currentTask;
};

prolog.next = function() {
    if(isStart && currentTask === 3) {
        currentTask++;
    }
    if(isStart && currentTask === 5) {
        currentTask++;
        let pickup = {};
        pickup.handle = mp.game.object.createPickup(mp.game.joaat('PICKUP_MONEY_SECURITY_CASE'),  3557.611572265625, -4686.1669921875, 114.06720733642578, 250, 1, true, 2406513688);
        pickup.toolkit = true;
        pickupsPool.push(pickup);
        ui.showDialog('Вам необходимо взять набор инструментов и произвести небольшой ремонт, связи с тем, что двигатель не запускается.', 'Информация');
    }
    if(isStart && currentTask === 7) {
        currentTask++;
    }
    if(isStart && currentTask === 10) {
        currentTask++;
        currentCp = 0;
        _checkpointId = jobPoint.create(new mp.Vector3(road2[currentCp][0], road2[currentCp][1], road2[currentCp][2]), true, 5);
    }
};

prolog.isActive = function() {
    return isStart;
};

prolog.timer = function() {
    if (!isStart)
        return;

    if (!isEquipPhone && user.getCache('phone')) {
        isEquipPhone = true;
        currentTask++;
        _checkpointId = jobPoint.create(PrologHouseInt, true);
    }

    try {
        if(isStart && mp.players.local.isInWater()) {
            prolog.stop();
        }
    }
    catch (e) {}

    pickupsPool.forEach(p => {

        try {
            if (p.handle && mp.game.object.hasPickupBeenCollected(p.handle)) //Проверить сущестоввание
            {
                if (p.fuel) {

                    inventory.takeNewItemJust(9, "{}", 1); //Канистра
                    ui.showDialog('Канистра лежит у вас в инвентаре, подойдите к транспорту и заправьте его через инвентарь. Нажмите I чтобы открыть инвентарь.', 'Информация');
                }
                if (p.toolkit) {
                    currentTask++;
                    inventory.takeNewItemJust(6, "{}", 1); //Канистра
                    ui.showDialog('Набор инструментов лежит у вас в инвентаре, подойдите к транспорту и почините его через инвентарь. Нажмите I чтобы открыть инвентарь.', 'Информация');
                }
                if (p.bag) {
                    user.setComponentVariation(5, 22, methods.getRandomInt(0, 25));
                    countTakeItems++;
                }
                if (p.eat) {
                    inventory.takeNewItemJust(242, "{}", 1); //Вода
                    inventory.takeNewItemJust(15, "{}", 1); //Еда

                    ui.showDialog('Персонажу необходимо потреблять пищу и жидкость, для того, чтобы он чувствовал себя комфортно. Еда лежит у вас в инвентаре и вы ей можете в любой момент воспользоваться. Нажмите I чтобы открыть инвентарь.', 'Информация');
                    countTakeItems++;
                }
                if (p.money) {
                    let money = methods.getRandomInt(10, 500);
                    user.addCashMoney(money, 'Взял кошелёк');
                    ui.showDialog('Вы взяли кошелёк, в нем лежит ' + methods.moneyFormat(money), 'Информация');
                    countTakeItems++;
                }
                if (p.phone) {
                    if (user.getCache('role')) {
                        mp.events.callRemote('server:shop:buy', 29, 0, 0);
                    }
                    countTakeItems++;
                }
                p.handle = 0;
                mp.game.object.removePickup(p.handle);

                if (countTakeItems === 4) {
                    currentTask++;
                    countTakeItems++;
                    ui.showDialog('Экипируйте телефон через инвентарь (I -> Телефон -> Перетащить на панель экипировки).', 'Информация');
                }
            }
        }
        catch (e) {}

        //inventory.takeNewItemJust(242, "{}", 1); //Вода
        //inventory.takeNewItemJust(15, "{}", 1); //Еда

        //mp.events.callRemote('server:shop:buy', 29, 0, 0);
    });

    //methods.getRandomInt(500, 999)
};

mp.keys.bind(0x45, true, function() {
    try {
        if (isStart) {
            if (!housePickups)
                prolog.createHousePickups();
            if (currentTask === 2) {
                currentTask++;
                prolog.createStreetPickups();

                setTimeout(function () {
                    mp.events.callRemote('server:phone:sendMessageNumber', 'Друг', user.getCache('phone'), `Привет, так по поводу работы все готово, по прилёту дуй в здание правительства и устроишься на садовника или строителя, зарабатывать первые деньги и добиваться успеха. Я в тебя верю!`);
                }, 3000)
            }
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add("playerEnterCheckpoint", (checkpoint) => {
    if (!isStart)
        return;
    try {
        if (_checkpointId == -1 || _checkpointId == undefined)
            return;
        if (checkpoint.id == _checkpointId)
        {
            if (currentTask === 0) {
                mp.game.ui.notifications.show('Нажмите ~g~E~s~ для взаимодействия с дверью');
                jobPoint.delete();
                _checkpointId = -1;
            }
            if (currentTask === 2) {
                mp.game.ui.notifications.show('Нажмите ~g~E~s~ для взаимодействия с дверью');
                jobPoint.delete();
                _checkpointId = -1;
            }
            if (currentTask === 9) {
                jobPoint.delete();

                currentCp++;
                if (road1.length <= currentCp)
                {
                    currentCp = 0;
                    currentTask++;
                    _checkpointId = jobPoint.create(new mp.Vector3(3199.9794921875, -4833.8125, 110.8152084350586), true);
                }
                else
                    _checkpointId = jobPoint.create(new mp.Vector3(road1[currentCp][0], road1[currentCp][1], road1[currentCp][2]), true, 5);
            }
            if (currentTask === 10) {
                mp.game.ui.notifications.show('Нажмите ~g~E~s~ для взаимодействия с полицейским');
                jobPoint.delete();
            }
            if (currentTask === 11) {
                jobPoint.delete();

                currentCp++;
                if (road2.length <= currentCp)
                {
                    currentCp = 0;
                    prolog.stop();
                }
                else
                    _checkpointId = jobPoint.create(new mp.Vector3(road2[currentCp][0], road2[currentCp][1], road2[currentCp][2]), true, 5);
            }
        }
    }
    catch (e) {

    }
});

mp.events.add("playerEnterVehicle", function (vehicle, seat) {
    if(isStart && currentTask === 4) {
        currentTask++;
        ui.showDialog('Используйте клавишу L для того чтобы открыть/закрыть транспорт. А клавишу 2 чтобы открыть панель транспорта.', 'Информация');
    }
    if(isStart && currentTask === 8) {
        currentTask++;
        ui.showDialog('Двигайтесь в аэропорт по маршуту, соблюдая скоростной режим, потому что у полиции есть скоростные радары. И да, не забудьте пристегнуть ремень на клавишу X.', 'Информация');
        _checkpointId = jobPoint.create(new mp.Vector3(road1[0][0], road1[0][1], road1[0][2]), true, 5);
    }
});

mp.events.add("playerDeath", function () {
    if(isStart) {
        user.setVirtualWorld(0);
        user.reset('startProlog');
        isStart = false;
        user.setComponentVariation(5, 0, 0);
        jobPoint.delete();
        methods.iplYanktonUnload();
    }
});

export default prolog;