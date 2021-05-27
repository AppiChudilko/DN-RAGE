import methods from '../modules/methods';
import ui from '../modules/ui';

import user from '../user';
import coffer from '../coffer';

import business from '../property/business';
import vehicles from '../property/vehicles';

let fuel = {};

fuel.list = [
    [620.8883, 268.8139, 102.0894, 97],
    [1208.003, 2659.895, 36.89979, 98],
    [1785.619, 3330.347, 40.38722, 99],
    [263.5738, 2606.99, 43.98426, 100],
    [-319.5623, -1471.401, 29.5485, 101],
    [1701.692, 6416.563, 34.3037, 102],
    [155.5461, 6629.616, 30.82206, 103],
    [-70.49973, -1761.005, 28.53405, 104],
    [1687.305, 4929.652, 41.0781, 105],
    [-724.0153, -934.8849, 19.38483, 106],
    [1181.505, -330.3269, 68.31655, 107],
    [-1799.267, 802.7495, 137.6514, 108],
    [175.1473, -1562.23, 28.26424, 109],
    [1208.695, -1402.55, 34.22417, 110],
    [818.9325, -1027.865, 25.40433, 111],
    [-2555.188, 2334.358, 32.07804, 112],
    [-1437.095, -276.707, 45.20769, 113],
    [179.9434, 6603.239, 30.86817, 114],
    [2581.098, 361.7826, 107.4688, 115],
    [2679.767, 3264.772, 54.40939, 116],
    [49.46264, 2778.854, 57.04395, 117],
    [-525.5096, -1210.826, 17.18483, 118],
    [-2096.767, -319.2014, 12.16863, 119],
    [-94.25557, 6419.677, 30.48929, 120],
    [2005.203, 3774.279, 31.40394, 121],
    [265.0568, -1262.188, 28.29296, 122],
    [-1157.292, -2886.82, 12.94561, 147],
    [-730.5557, -1450.97, 4.000523, 148],
    [1770.153, 3239.807, 41.12265, 149],
    [-745.0678, 5811.085, 18.23408, 150],
    [-795.5038, -1501.708, -4.607107, 151],
    [-2078.772, 2603.242, 1.035311, 152],
    [3855.177, 4459.854, 0.8547667, 153],
    [5155.79931640625, -5130.1259765625, 1.3125965595245361, 159],
];

fuel.hashList = [
    1339433404,
    1694452750,
    1933174915,
    -2007231801,
    -469694731,
    -164877493,
    -462817101,
];

let isFill = false;

fuel.fillVehTimer = async function(count) {
    try {
        isFill = true;
        await methods.sleep(500);


        let time = 0;
        let allCount = methods.parseInt(count);
        let veh = mp.players.local.vehicle;
        if (!veh) {
            mp.game.ui.notifications.show(`~r~Вы должны находиться в транспорте`);
            isFill = false;
            return;
        }

        let vInfo = methods.getVehicleInfo(veh.model);

        let pref = vehicles.getFuelPostfix(vInfo.fuel_type);
        let wait = 500;
        if (vInfo.fuel_type === 3)
            wait = 500;
        if (vInfo.fuel_type === 2)
            wait = 250;
        if (vInfo.fuel_type === 4)
            wait = 50;

        while (time <= allCount && !veh.getIsEngineRunning()) {

            let veh = mp.players.local.vehicle;
            if (!veh) {
                mp.game.ui.notifications.show(`~r~Вы должны находиться в транспорте`);
                isFill = false;
                return;
            }

            if (vInfo.fuel_full <= vehicles.getFuel(veh)) {
                mp.game.ui.notifications.show(`~g~Заправка транспорта была завершена`);
                isFill = false;
                return;
            }

            ui.showSubtitle(`Заправлено ~g~${time}${pref}~s~ из ~g~${allCount}${pref}`);
            time++;
            vehicles.addFuel(veh);
            await methods.sleep(wait);
        }
        mp.game.ui.notifications.show(`~g~Заправка транспорта была завершена`);
        isFill = false;
    }
    catch (e) {
        methods.debug(e);
    }
};

fuel.fillVeh = function(price, shopId, type, idx) {
    methods.debug('fuel.fillVeh');
    try {
        let veh = mp.players.local.vehicle;
        if (!veh) {
            mp.game.ui.notifications.show(`~r~Вы должны находиться в транспорте`);
            return;
        }
        if (isFill) {
            mp.game.ui.notifications.show(`~r~Вы уже заправляете транспорт`);
            return;
        }

        let vInfo = methods.getVehicleInfo(veh.model);
        if (vInfo.fuel_type == 0) {
            mp.game.ui.notifications.show(`~r~Данный вид транспорта не использует топливо`);
            return;
        }
        if (vInfo.fuel_type != type) {
            mp.game.ui.notifications.show(`~r~Тип топлива не подходит данному транспорту`);
            return;
        }
        if (veh.getIsEngineRunning())
            vehicles.engineVehicle();

        let currentFuel = vehicles.getFuel(veh);
        if (vInfo.fuel_full <= vehicles.getFuel(veh) + 1) {
            mp.game.ui.notifications.show.notify('~r~Транспорт уже заправлен');
            return;
        }

        switch (idx) {
            case 0:
            {
                let money = methods.parseFloat(price);
                if (user.getMoney() < money) {
                    mp.game.ui.notifications.show(`~r~У Вас недостаточно средств`);
                    return;
                }
                business.addMoney(shopId, money, 'Заправка транспорта: ' + vehicles.getFuelLabel(vInfo.fuel_type));
                /*if (veh.getVariable('fraction_id')) {
                    coffer.removeMoney(coffer.getIdByFraction(veh.getVariable('fraction_id')), money, 'Заправка транспорта');
                    mp.game.ui.notifications.show('~y~Транспорт будет заправлен за счет бюджета организации.');
                    fuel.fillVehTimer(1);
                    return;
                }*/
                mp.game.ui.notifications.show('~y~Вы заправили свой транспорт по цене: ' + methods.moneyFormat(money));
                user.removeMoney(money, 'Заправка транспорта');
                fuel.fillVehTimer(1);
                break;
            }
            case 1:
            {
                let money = methods.parseFloat(price * 5);
                if (user.getMoney() < money) {
                    mp.game.ui.notifications.show('~r~У Вас недостаточно средств');
                    return;
                }
                business.addMoney(shopId, money, 'Заправка транспорта: ' + vehicles.getFuelLabel(vInfo.fuel_type));
                /*if (veh.getVariable('fraction_id')) {
                    coffer.removeMoney(coffer.getIdByFraction(veh.getVariable('fraction_id')), money, 'Заправка транспорта');
                    mp.game.ui.notifications.show('~y~Транспорт будет заправлен за счет бюджета организации.');
                    fuel.fillVehTimer(5);
                    return;
                }*/
                mp.game.ui.notifications.show('~y~Вы заправили свой транспорт по цене: ' + methods.moneyFormat(money));
                user.removeMoney(money, 'Заправка транспорта');
                fuel.fillVehTimer(5);
                break;
            }
            case 2:
            {
                let money = methods.parseFloat(price * 10);
                if (user.getMoney() < money) {
                    mp.game.ui.notifications.show('~r~У Вас недостаточно средств');
                    return;
                }
                business.addMoney(shopId, money, 'Заправка транспорта: ' + vehicles.getFuelLabel(vInfo.fuel_type));
                /*if (veh.getVariable('fraction_id')) {
                    coffer.removeMoney(coffer.getIdByFraction(veh.getVariable('fraction_id')), money, 'Заправка транспорта');
                    mp.game.ui.notifications.show('~y~Транспорт будет заправлен за счет бюджета организации.');
                    fuel.fillVehTimer(10);
                    return;
                }*/
                mp.game.ui.notifications.show('~y~Вы заправили свой транспорт по цене: ' + methods.moneyFormat(money));
                user.removeMoney(money, 'Заправка транспорта');
                fuel.fillVehTimer(10);
                break;
            }
            case 3:
            {
                let money = vInfo.fuel_full - currentFuel;
                money = methods.parseFloat(money * price);

                if (user.getMoney() < money) {
                    mp.game.ui.notifications.show('~r~У Вас недостаточно средств');
                    return;
                }
                business.addMoney(shopId, money, 'Заправка транспорта: ' + vehicles.getFuelLabel(vInfo.fuel_type));
                /*if (veh.getVariable('fraction_id')) {
                    coffer.removeMoney(coffer.getIdByFraction(veh.getVariable('fraction_id')), money, 'Заправка транспорта');
                    mp.game.ui.notifications.show('~y~Транспорт будет заправлен за счет бюджета организации.');
                    fuel.fillVehTimer(vInfo.fuel_full - currentFuel);
                    return;
                }*/
                mp.game.ui.notifications.show('~y~Вы заправили свой транспорт по цене: ' + methods.moneyFormat(money));
                user.removeMoney(money, 'Заправка транспорта');
                fuel.fillVehTimer(vInfo.fuel_full - currentFuel);
                break;
            }
        }
    }
    catch (e) {
        methods.debug(e);
    }
};

fuel.fillMech = async function(price, shopId, count) {
    methods.debug('fuel.fillMech');
    try {
        let veh = mp.players.local.vehicle;
        if (!veh) {
            mp.game.ui.notifications.show(`~r~Вы должны находиться в транспорте`);
            return;
        }

        let container = veh.getVariable('container');
        let currentFuel = methods.parseInt(await vehicles.get(container, 'mechFuel'));
        let offsetFuel = 500 - currentFuel;
        if (offsetFuel < count)
            count = offsetFuel;

        if (count === 0) {
            mp.game.ui.notifications.show(`~r~Транспорт уже заправлен`);
            return;
        }

        let money = methods.parseFloat(count * price) / 2;
        if (user.getMoney() < money) {
            mp.game.ui.notifications.show(`~r~У Вас недостаточно средств (Необходимо: ${methods.moneyFormat(money)})`);
            return;
        }
        business.addMoney(shopId, money, 'Заправка транспорта механика');
        user.removeMoney(money, 'Заправка транспорта');
        vehicles.set(container, 'mechFuel', currentFuel + count);
        mp.game.ui.notifications.show(`Вы заправили транспорт по цене: ~g~${methods.moneyFormat(money)}`);
    }
    catch (e) {
        methods.debug(e);
    }
};

fuel.getInRadius = function(pos, radius = 2) {
    methods.debug('fuel.fuel');
    let shopId = -1;
    fuel.list.forEach(function (item, idx) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(pos, shopPos) < radius)
            shopId = methods.parseInt(item[3]);
    });
    return shopId;
};

fuel.findNearest = function(pos) {
    methods.debug('fuel.findNearest');
    let prevPos = new mp.Vector3(9999, 9999, 9999);
    fuel.list.forEach(function (item) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(shopPos, pos) < methods.distanceToPos(prevPos, pos))
            prevPos = shopPos;
    });
    return prevPos;
};

fuel.findNearestId = function(pos) {
    methods.debug('fuel.findNearest');
    let prevPos = new mp.Vector3(9999, 9999, 9999);
    let shopId = 0;
    fuel.list.forEach(function (item) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(shopPos, pos) < methods.distanceToPos(prevPos, pos)) {
            prevPos = shopPos;
            shopId = item[3];
        }
    });
    return shopId;
};

export default fuel;