import methods from '../modules/methods';
import user from '../user';

import achievement from "../manager/achievement";

let taxi = {};

taxi.peds = ['a_f_m_beach_01', 'a_f_y_beach_01', 'a_m_m_beach_01', 'a_m_o_beach_01', 'a_m_y_beach_01', 'a_m_m_beach_02', 'a_m_y_beach_02', 'a_m_y_beach_03', 'a_m_y_beachvesp_01', 'a_m_y_beachvesp_02', 'a_f_m_bevhills_01', 'a_f_y_bevhills_01', 'a_m_m_bevhills_01', 'a_m_y_bevhills_01', 'a_f_m_bevhills_02', 'a_f_y_bevhills_02', 'a_m_m_bevhills_02', 'a_m_y_bevhills_02', 'a_f_y_bevhills_03', 'a_f_y_bevhills_04', 'a_m_y_busicas_01', 'a_f_y_business_01', 'a_m_m_business_01', 'a_m_y_business_01', 'a_f_m_business_02', 'a_f_y_business_02', 'a_m_y_business_02', 'a_f_y_business_03', 'a_m_y_business_03', 'a_f_y_business_04', 's_m_y_dealer_01', 'a_f_m_eastsa_01', 'a_f_y_eastsa_01', 'a_m_m_eastsa_01', 'a_m_y_eastsa_01', 'a_f_m_eastsa_02', 'a_f_y_eastsa_02', 'a_m_m_eastsa_02', 'a_m_y_eastsa_02', 'a_f_y_eastsa_03', 'a_m_m_farmer_01', 'a_f_m_fatbla_01', 'a_f_m_fatcult_01', 'a_m_m_fatlatin_01', 'a_f_m_fatwhite_01', 'a_m_y_gay_01', 'a_m_y_gay_02', 'a_m_m_genfat_01', 'a_m_m_genfat_02', 'a_f_y_genhot_01', 'a_f_o_genstreet_01', 'a_f_o_genstreet_01', 'a_m_o_genstreet_01', 'a_m_y_genstreet_01', 'a_m_y_genstreet_02', 's_m_m_gentransport', 'u_m_m_glenstank_01', 'a_f_y_golfer_01', 'a_m_m_golfer_01', 'a_m_m_hillbilly_01', 'a_m_m_hillbilly_02', 'u_m_y_hippie_01', 'a_f_y_hippie_01', 'a_m_y_hippy_01', 'a_f_y_hipster_01', 'a_m_y_hipster_01', 'a_f_y_hipster_02', 'a_m_y_hipster_02', 'a_f_y_hipster_03', 'a_m_y_hipster_03', 'a_f_y_hipster_04', 's_f_y_hooker_01', 's_f_y_hooker_02', 's_f_y_hooker_03', 'g_m_y_korean_01', 'g_m_y_korean_02', 'g_m_y_korlieut_01', 'a_m_m_ktown_01', 'a_m_y_ktown_01', 'a_f_m_ktown_02', 'a_m_y_ktown_02', 'g_f_y_lost_01', 'g_m_y_lost_01', 'g_m_y_lost_02'];

taxi.points = [
    [253.4611, 220.7204, 106.2865, 2],
    [251.749, 221.4658, 106.2865, 2],
    [248.3227, 222.5736, 106.2867, 2],
    [246.4875, 223.2582, 106.2867, 2],
    [243.1434, 224.4678, 106.2868, 2],
    [241.1435, 225.0419, 106.2868, 2],

    [148.5, -1039.971, 29.37775, 3],
    [1175.054, 2706.404, 38.09407, 3],
    [-1212.83, -330.3573, 37.78702, 3],
    [314.3541, -278.5519, 54.17077, 3],
    [-2962.951, 482.8024, 15.7031, 3],
    [-350.6871, -49.60739, 49.04258, 3],

    [-111.1722, 6467.846, 31.62671, 4],
    [-113.3064, 6469.969, 31.62672, 4],

    [127.024, -1284.24, 28.28062, 43, 0],
    [-560.0792, 287.0196, 81.17641, 44, 0],
    [-1394.226, -605.4658, 29.31955, 45, 0],
    [988.5745, -96.85889, 73.84525, 46, 0],
    [1986.267, 3054.349, 46.21521, 47, 0],
    [-441.0517883300781, 268.8336181640625, 82.01594543457031, 48, 0],
    [-1587.188, -3012.827, -77.00496, 49, 49],
    [-1587.188, -3012.827, -77.00496, 130, 130],
    [-1587.188, -3012.827, -77.00496, 131, 131],

    [138.7087, -1705.711, 28.29162, 30],
    [1214.091, -472.9952, 65.208, 31],
    [-276.4055, 6226.398, 30.69552, 32],
    [-1282.688, -1117.432, 5.990113, 33],
    [1931.844, 3730.305, 31.84443, 34],
    [-813.5332, -183.2378, 36.5689, 35],
    [-33.34319, -154.1892, 56.07654, 36],

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

    [22.08832, -1106.986, 29.79703, 71],
    [252.17,-50.08245,69.94106,72],
    [842.2239,-1033.294,28.19486,73],
    [-661.947,-935.6796,21.82924,74],
    [-1305.899,-394.5485,36.69577,75],
    [809.9118,-2157.209,28.61901,76],
    [2567.651,294.4759,107.7349,77],
    [-3171.98,1087.908,19.83874,78],
    [-1117.679,2698.744,17.55415,79],
    [1693.555,3759.9,33.70533,80],
    [-330.36,6083.885,30.45477,81],

    [-1159.827,-2015.182,12.16598,338.3167],
    [-330.8568,-137.6985,38.00612,95.85743],
    [732.1998,-1088.71,21.15658,89.10553],
    [-222.6972,-1329.915,29.87796,269.8108],
    [1174.876,2640.67,36.7454,0.5306945],
    [110.3291,6626.977,30.7735,223.695],
    //[-147.4434,-599.0691,166.0058,315.3235],
    [481.2153,-1317.698,28.09073,296.715],

    [-3041.126, 585.5155, 6.908929, 82, 0], //shopui_title_conveniences
    [-3038.86, 586.2693, 6.908929, 82, 0],
    [-3243.896, 1001.722, 11.83071, 83, 0],
    [-3241.574, 1001.538, 11.83071, 83, 0],
    [374.5105, 327.7635, 102.5664, 84, 0],
    [373.9542, 325.4406, 102.5664, 84, 0],
    [2677.278, 3281.584, 54.24113, 85, 0],
    [2679.303, 3280.479, 54.24113, 85, 0],
    [547.6848, 2669.328, 41.15649, 86, 0],
    [547.3407, 2671.746, 41.15649, 86, 0],
    [1730.041, 6416.11, 34.03722, 87, 0],
    [1728.93, 6414.032, 34.03722, 87, 0],
    [1960.621, 3742.39, 31.34375, 88, 0],
    [1961.797, 3740.326, 31.34375, 88, 0],
    [25.96342, -1345.609, 28.49702, 89, 0],
    [26.02901, -1347.894, 28.49702, 89, 0],
    [2555.484, 382.4021, 107.6229, 90, 0],
    [2557.867, 382.3204, 107.6229, 90, 0],
    [1394.001, 3605.032, 33.98092, 91, 1], // shopui_title_liqourstore
    [-2968.287, 391.614, 14.04331, 92, 2], //shopui_title_liqourstore2
    [-1488.082, -378.9411, 39.16343, 93, 2],
    [1136.161, -982.821, 45.41585, 94, 2],
    [-1222.552, -906.4139, 11.32636, 95, 2],
    [1165.307, 2709.018, 37.15771, 96, 3], //shopui_title_liqourstore3
    [-47.49747, -1756.332, 28.42101, 104, 4], //shopui_title_gasstation
    [-48.75316, -1757.672, 28.42101, 104, 4],
    [1699.679, 4923.871, 41.06363, 105, 4],
    [1698.219, 4924.843, 41.06363, 105, 4],
    [-707.8215, -914.7576, 18.2155, 106, 4],
    [-708.0059, -912.8864, 18.215, 106, 4],
    [1163.038, -322.3109, 68.20506, 107, 4],
    [1163.371, -324.0874, 68.20506, 107, 4],
    [-1821.729, 793.7563, 137.1204, 108, 4],
    [-1820.643, 792.3428, 137.117, 108, 4],

    [-657.087, -857.313, 23.490, 123, 5],
    [1133.0963, -472.6430, 65.7651, 124, 5],

    [318.2640, -1076.7376, 28.4785, 125, 6],
    [92.8906, -229.4265, 53.6636, 126, 6],
    [301.4576, -733.25683, 28.37248, 127, 6],
    [-252.5419, 6335.4926, 31.4260, 0, 6],

    [-1599.7724, 5202.06640625, 3.397307, 128, 7], //FISH
    [-675.4125366210938, 5836.44140625, 16.34016227722168, 129, 8], //Охота

    [324.2816, 180.2105, 102.5865, 37],
    [1864.066, 3746.909, 32.03188, 38],
    [-294.0927, 6200.76, 30.48712, 39],
    [-1155.336, -1427.223, 3.954459, 40],
    [1321.756, -1653.431, 51.27526, 41],
    [-3169.667, 1077.457, 19.82918, 42],
];

let isProcess = false;
let isStart = false;
let currentPedId = -1;
let posStart = new mp.Vector3(0, 0, 0);
let posEnd = new mp.Vector3(0, 0, 0);
let countPeds = 0;
let health = 1000;

let pedList = [];

taxi.isProcess = function() {
    return isProcess;
};

taxi.take = async function() {
    if (isProcess) {
        mp.game.ui.notifications.show('~r~Вы уже получили задание');
        user.setWaypoint(posStart.x, posStart.y);
        return;
    }

    if (await user.hasById('uniform')) {
        mp.game.ui.notifications.show('~r~Нельзя работать в форме');
        return;
    }

    isProcess = true;
    mp.game.ui.notifications.showWithPicture('Заказ', "Диспетчер", 'Клиент вызвал такси', 'CHAR_TAXI', 1);
    posStart = methods.getNearestHousePos(mp.players.local.position, 5000);
    user.setWaypoint(posStart.x, posStart.y);
};

taxi.findRandomPickup = function() {
    let pickupId = methods.getRandomInt(0, taxi.points.length - 1);
    posEnd = new mp.Vector3(taxi.points[pickupId][0], taxi.points[pickupId][1], taxi.points[pickupId][2]);
    user.setWaypoint(taxi.points[pickupId][0], taxi.points[pickupId][1]);
};

taxi.checkPos = function() {

    if (!isProcess)
        return;

    if (mp.players.local.vehicle) {

        if (isStart) {
            if (posEnd.x != 0 && methods.distanceToPos(posEnd, mp.players.local.position) < 50) {
                if (methods.getCurrentSpeed() > 1) {
                    mp.game.ui.notifications.show('~b~Вы достигли точки, остановитесь');
                    return;
                }

                isStart = false;
                isProcess = false;

                user.showLoadDisplay();
                setTimeout(function () {

                    //methods.deleteGlobalPed(currentPedId);
                    mp.events.call('client:deleteGlobalPed', currentPedId);
                    currentPedId = -1;

                    let price = taxi.getTaxiDistPrice(posStart, posEnd);

                    posStart = new mp.Vector3(0, 0, 0);
                    posEnd = new mp.Vector3(0, 0, 0);

                    let rating = 5;
                    if (mp.players.local.vehicle.getBodyHealth() < health - 30) {
                        price = price * 0.7;
                        rating = methods.getRandomInt(1, 5);
                        mp.game.ui.notifications.showWithPicture('Заказ завершен', "Диспетчер", `Клиент оценил поездку в ~y~${rating}зв.\n~c~Из-за ДТП у вас был списан штраф в размере 30% от стоимости заказа`, 'CHAR_TAXI', 1);
                    }
                    else {
                        mp.game.ui.notifications.showWithPicture('Заказ завершен', "Диспетчер", `Клиент оценил поездку в ~y~${rating}зв.`, 'CHAR_TAXI', 1);
                    }
                    achievement.doneAllById(5);
                    achievement.doneDailyById(3);

                    user.giveJobMoney(price, 9);
                    user.giveJobSkill('taxi');
                    user.addWorkExp(15);

                    setTimeout(function () {
                        user.hideLoadDisplay();
                    }, 1000);
                }, 500);
            }
        }
        else {
            if (posStart.x != 0 && methods.distanceToPos(posStart, mp.players.local.position) < 50) {
                if (methods.getCurrentSpeed() > 1) {
                    mp.game.ui.notifications.show('~b~Вы достигли точки, остановитесь');
                    return;
                }

                isStart = true;

                user.showLoadDisplay();
                setTimeout(function () {
                    let modelId = methods.getRandomInt(0, taxi.peds.length - 1);
                    //methods.createGlobalPedInVehicle(taxi.peds[modelId], mp.players.local.vehicle.remoteId);
                    mp.events.call('client:createGlobalPedInVehicle', countPeds, taxi.peds[modelId], mp.players.local.vehicle.remoteId);

                    setTimeout(function () {
                        user.hideLoadDisplay();

                        let ped = taxi.getNearestPed(mp.players.local.position, 20);
                        if (ped)
                            currentPedId = ped.pedId;

                        mp.game.ui.notifications.show('~b~Пассажир сел к Вам в авто');
                        taxi.findRandomPickup();
                        health = mp.players.local.vehicle.getBodyHealth();

                    }, 1000);
                }, 500);
            }
        }
    }
};

taxi.getTaxiDistPrice = function(pos1, pos2) {
    let typePrice = 17;
    let distance = methods.distanceToPos(pos1, pos2);
    let price = methods.parseInt(distance / typePrice) + 40;
    if (price > 800)
        price = 800;

    return methods.parseInt(price);
};

taxi.loadAll = function() {
    setInterval(taxi.checkPos, 3000);
};

taxi.getNearestPed = function(pos, r) {
    let nearest, dist;
    let min = r;
    pedList.forEach(item => {
        if (!mp.peds.exists(item.ped))
            return;
        dist = methods.distanceToPos(pos, item.ped.getCoords(true));
        if (dist < min) {
            nearest = item;
            min = dist;
        }
    });
    return nearest;
};

mp.events.add('client:createGlobalPedInVehicle', (id, model, vehicleId) => {

    let veh = mp.vehicles.atRemoteId(vehicleId);
    if (mp.vehicles.exists(veh) && methods.distanceToPos(veh.position, mp.players.local.position) < 300) {
        /*let spawnPos = veh.position;
        if (methods.distanceToPos(veh.position, mp.players.local.position) > 300)
            spawnPos = new mp.Vector3(0, 0, 0);*/

        let ped = mp.peds.new(mp.game.joaat(model), veh.position, 270.0);
        try {
            ped.setCollision(false, false);
        }
        catch (e) {
            methods.debug(e);
        }
        mp.game.invoke(methods.TASK_ENTER_VEHICLE, ped.handle, veh.handle, 3, 0, 0, 0);
        pedList.push({ped: ped, pedId: id});
    }
});

mp.events.add('client:deleteGlobalPed', (id) => {
    pedList.forEach((item) => {
        if (item.pedId == id) {
            if (mp.peds.exists(item.ped))
                item.ped.destroy();
        }
    });
});

export default taxi;