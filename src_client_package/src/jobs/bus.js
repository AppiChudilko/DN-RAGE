import methods from '../modules/methods';

import user from '../user';

import jobPoint from '../manager/jobPoint';
import family from "../property/family";

let bus = {};

let _isBus1 = false;
let _isBus2 = false;
let _isBus3 = false;
let _checkpointId = -1;
let _currentId = 0;

bus.markers1 = [
    [-20.77613, -1355.558, 29.17333, 1],
    [-69.27248, -1364.598, 29.39273, 0],
    [-207.2123, -1411.102, 31.23419, 0],
    [-250.3917, -1419.969, 31.24708, 0],
    [-351.4041, -1419.679, 29.43443, 0],
    [-434.4893, -1412.981, 29.23767, 0],
    [-526.2911, -1114.002, 21.93598, 0],
    [-534.7128, -985.7481, 23.2819, 0],
    [-502.8471, -864.3864, 30.00174, 0],
    [-609.1118, -834.1956, 25.54251, 0],
    [-647.7816, -869.95, 24.4784, 1],
    [-646.2023, -935.5083, 22.39142, 0],
    [-751.9155, -1095.719, 10.76653, 0],
    [-885.2305, -1171.75, 4.808795, 0],
    [-930.7425, -1198.454, 5.070882, 0],
    [-1049.229, -1266.24, 6.215746, 0],
    [-1138.747, -1304.63, 5.08339, 0],
    [-1203.084, -1191.843, 7.607671, 1],
    [-1240.451, -1080.135, 8.41134, 0],
    [-1277.571, -946.8057, 11.30568, 0],
    [-1349.633, -813.9242, 18.31865, 0],
    [-1412.26, -761.7822, 22.47782, 0],
    [-1518.48, -688.4073, 28.45993, 0],
    [-1622.958, -596.4943, 33.06582, 0],
    [-1586.303, -534.6346, 35.38402, 0],
    [-1477.075, -463.451, 35.40791, 0],
    [-1429.307, -435.4835, 35.76416, 1],
    [-1401.365, -416.0498, 36.48946, 0],
    [-1320.327, -367.8933, 36.67199, 0],
    [-1090.98, -279.3097, 37.6939, 0],
    [-1014.448, -244.1829, 37.64638, 1],
    [-912.8623, -268.655, 40.57436, 0],
    [-826.0239, -316.0187, 37.73166, 0],
    [-756.6213, -346.8496, 35.85471, 1],
    [-665.9775, -374.3257, 34.63932, 0],
    [-548.4927, -376.5024, 35.062, 0],
    [-315.4498, -406.8911, 30.03227, 0],
    [-224.8235, -436.4268, 30.54648, 0],
    [-249.4325, -635.1298, 33.57001, 0],
    [-203.4997, -696.7413, 33.83302, 1],
    [-152.6661, -713.5783, 34.6908, 0],
    [1.240081, -761.6959, 32.01256, 0],
    [143.6725, -807.9731, 31.20995, 0],
    [231.8147, -691.0505, 36.4769, 1],
    [246.5911, -646.074, 39.61546, 0],
    [303.3329, -492.8282, 43.35616, 0],
    [316.535, -416.0796, 44.94266, 0],
    [347.8625, -309.5445, 52.84609, 1],
    [349.7827, -298.8471, 53.67729, 0],
    [398.3643, -156.267, 64.35838, 0],
    [517.5294, 38.56313, 93.93687, 0],
    [665.2781, 20.48015, 84.85236, 0],
    [770.9596, -44.92016, 80.91208, 0],
    [968.2475, -177.0578, 73.06339, 1],
    [991.9081, -190.6512, 71.63889, 0],
    [1211.547, -348.5237, 69.12844, 0],
    [1182.876, -442.515, 66.7378, 1],
    [1179.259, -488.382, 65.65414, 0],
    [1174.542, -612.1591, 63.73099, 0],
    [1196.08, -738.2855, 58.70032, 0],
    [1178.955, -820.3583, 55.49027, 0],
    [1150.809, -927.1675, 48.87659, 0],
    [1008.341, -985.3448, 42.27326, 0],
    [826.1581, -999.9065, 26.36019, 1],
    [808.5326, -1001.976, 25.18585, 0],
    [419.95, -1038.981, 29.68525, 0],
    [321.5047, -1036.647, 29.11785, 1],
];
bus.markers2 = [
    [-925.1628, -2320.734, 20.11593, 0],
    [-1032.885, -2729.676, 20.11244, 1],
    [-809.0793, -2466.783, 13.85843, 0],
    [-686.7441, -2128.663, 13.62766, 0],
    [-347.187, -2111.682, 24.03776, 0],
    [-168.0055, -2108.106, 24.79468, 0],
    [117.9054, -2044.946, 18.37168, 0],
    [215.6207, -1954.056, 21.51428, 0],
    [267.7746, -1891.401, 26.65105, 0],
    [365.6594, -1775.07, 29.16373, 0],
    [454.3903, -1661.197, 29.29699, 0],
    [350.7339, -1532.453, 29.30629, 0],
    [257.7349, -1453.839, 29.33812, 0],
    [182.2527, -1404.326, 29.34013, 0],
    [-22.58355, -1355.378, 29.16117, 1],
];
bus.markers3 = [
    [387.0436, -672.6332, 30.04908, 0],
    [1556.16, 881.731, 78.29194, 1],
    [2430.731, 2860.752, 49.84104, 0],
    [1959.371, 2981.862, 46.56105, 1],
    [1092.098, 2691.49, 39.61154, 1],
    [395.4369, 2671.72, 45.16005, 1],
    [302.9107, 2644.307, 45.35554, 0],
    [223.9788, 3070.557, 43.10066, 1],
    [1249.81, 3532.767, 36.02944, 0],
    [1591.604, 3662.07, 35.30909, 0],
    [1661.828, 3565.755, 36.36056, 0],
    [1934.406, 3704.664, 33.28149, 1],
    [2025.247, 3757.067, 33.12759, 0],
    [2053.286, 3731.671, 33.79866, 0],
    [2507.79, 4118.888, 39.31491, 0],
    [1678.677, 4823.556, 42.80423, 1],
    [1954.646, 5138.808, 44.20303, 0],
    [2594.617, 5100.798, 44.58412, 0],
    [2626.005, 5108.932, 45.64918, 0],
    [1655.054, 6414.708, 30.02375, 1],
    [165.1584, 6548.34, 32.7405, 0],
    [89.17739, 6596.896, 32.35389, 0],
    [-161.4769, 6383.953, 32.15224, 1],
    [-291.3061, 6247.273, 32.24008, 0],
    [-436.7479, 6056.877, 32.19872, 1],
    [-413.9703, 5980.956, 32.43074, 0],
    [-937.0167, 5426.759, 38.7452, 1],
    [-1529.167, 4995.497, 63.18305, 1],
    [-2229.287, 4323.936, 49.58266, 1],
    [-2498.996, 3608.509, 15.14034, 1],
    [-2729.138, 2298.377, 19.5265, 1],
    [-3118.411, 1186.622, 21.18515, 1],
    [-3015.445, 335.9182, 15.41847, 1],
    [-2203.097, -356.1289, 13.98739, 0],
    [-1837.839, -603.1777, 12.20072, 1],
    [245.5144, -550.312, 43.75318, 0],
    [251.5672, -573.588, 44.02026, 1],
    [182.4826, -791.8699, 32.3394, 0],
    [261.0313, -856.171, 30.23261, 0],
    [386.5411, -860.2405, 30.16551, 0],
    [408.3045, -695.44, 30.08445, 0],
    [468.184, -604.3215, 29.32677, 1],
];

bus.start = function(busType) {
    try {

        if (mp.players.local.dimension > 0) {
            mp.game.ui.notifications.show('~r~В интерьерах данное действие запрещено');
            return;
        }

        methods.debug('Execute: bus.start');
        switch (busType) {
            case 1: {
                if (_isBus1) break;
                _isBus1 = true;
                _currentId = 0;
                _checkpointId = jobPoint.create(new mp.Vector3(bus.markers1[_currentId][0], bus.markers1[_currentId][1], bus.markers1[_currentId][2] - 1), true, 3);
                _currentId++;
                mp.game.ui.notifications.show('~g~Вы начали рейс, не выходите из ТС до конца поездки');
                break;
            }
            case 2: {
                if (_isBus2) break;
                _isBus2 = true;
                _currentId = 0;
                _checkpointId = jobPoint.create(new mp.Vector3(bus.markers2[_currentId][0], bus.markers2[_currentId][1], bus.markers2[_currentId][2] - 1), true, 3);
                _currentId++;
                mp.game.ui.notifications.show('~g~Вы начали рейс, не выходите из ТС до конца поездки');
                break;
            }
            case 3: {
                if (_isBus3) break;
                _isBus3 = true;
                _currentId = 0;
                _checkpointId = jobPoint.create(new mp.Vector3(bus.markers3[_currentId][0], bus.markers3[_currentId][1], bus.markers3[_currentId][2] - 1), true, 3);
                _currentId++;
                mp.game.ui.notifications.show('~g~Вы начали рейс, не выходите из ТС до конца поездки');
                break;
            }
        }

    } catch (e) {
        methods.debug('Exception: bus.start');
        methods.debug(e);
    }
};

bus.nextCheckpoint = function() {

    if (mp.players.local.vehicle.getPedInSeat(-1) !== mp.players.local.handle) {
        mp.game.ui.notifications.show('~r~Необходимо быть на водительском месте');
        return;
    }

    jobPoint.delete();

    let timeout = 1;
    try {
        if (_isBus1 && bus.markers1[_currentId - 1][3] == 1 || _isBus2 && bus.markers2[_currentId - 1][3] == 1 || _isBus3 && bus.markers3[_currentId - 1][3] == 1) {
            mp.game.ui.notifications.show('~g~Ожидайте 10 секунд');
            try {
                mp.players.local.vehicle.freezePosition(true);
            }
            catch (e) {
                
            }
            timeout = 10000;
        }
    }
    catch (e) {
        methods.debug(e);
    }

    setTimeout(function () {
        try {
            mp.players.local.vehicle.freezePosition(false);
        }
        catch (e) {
            
        }
        try {
            methods.debug('Execute: bus.nextCheckpoint');
            if (mp.players.local.vehicle) {
                switch (mp.players.local.vehicle.model) {
                    case mp.game.joaat('bus'): {
                        if (!_isBus1) {
                            bus.stop();
                            break;
                        }

                        if (_currentId >= bus.markers1.length) {
                            user.giveJobSkill();
                            mp.game.ui.notifications.show('~g~Вы закончили свой рейс');
                            user.addRep(10);
                            user.addWorkExp(60);

                            _isBus1 = false;
                            _currentId = 0;
                            _checkpointId = -1;
                            bus.stop(530 * 0.7, false);
                            break;
                        }

                        _checkpointId = jobPoint.create(new mp.Vector3(bus.markers1[_currentId][0], bus.markers1[_currentId][1], bus.markers1[_currentId][2] - 1), true, 3);
                        _currentId++;
                        mp.game.ui.notifications.show('~b~Двигайтесь к следующему чекпоинту');
                        break;
                    }
                    case mp.game.joaat('airbus'): {
                        if (!_isBus2) {
                            bus.stop();
                            break;
                        }

                        if (_currentId >= bus.markers2.length) {
                            user.giveJobSkill();
                            mp.game.ui.notifications.show('~g~Вы закончили свой рейс');
                            user.addRep(5);
                            user.addWorkExp(25);

                            _isBus2 = false;
                            _currentId = 0;
                            _checkpointId = -1;
                            bus.stop(216 * 0.7, false);
                            break;
                        }

                        _checkpointId = jobPoint.create(new mp.Vector3(bus.markers2[_currentId][0], bus.markers2[_currentId][1], bus.markers2[_currentId][2] - 1), true, 3);
                        _currentId++;
                        mp.game.ui.notifications.show('~b~Двигайтесь к следующему чекпоинту');
                        break;
                    }
                    case mp.game.joaat('coach'): {
                        if (!_isBus3) {
                            bus.stop();
                            break;
                        }

                        if (_currentId >= bus.markers3.length) {
                            user.giveJobSkill();
                            mp.game.ui.notifications.show('~g~Вы закончили свой рейс');
                            user.addRep(25);
                            user.addWorkExp(145);

                            _isBus3 = false;
                            _currentId = 0;
                            _checkpointId = -1;
                            bus.stop(1700 * 0.7, false);
                            break;
                        }

                        _checkpointId = jobPoint.create(new mp.Vector3(bus.markers3[_currentId][0], bus.markers3[_currentId][1], bus.markers3[_currentId][2] - 1), true, 3);
                        _currentId++;
                        mp.game.ui.notifications.show('~b~Двигайтесь к следующему чекпоинту');
                        break;
                    }
                    default:
                        bus.stop();
                        break;
                }
            }
            else
                bus.stop();

        } catch (e) {
            methods.debug('Exception: bus.nextCheckpoint');
            methods.debug(e);
        }
    }, timeout);
};

bus.stop = async function(money, isNotify = true) {
    jobPoint.delete();
    mp.players.local.freezePosition(false);

    _isBus1 = false;
    _isBus2 = false;
    _isBus3 = false;
    _checkpointId = -1;
    _currentId = 0;

    if (isNotify)
        mp.game.ui.notifications.show('~r~Ваш рейс досрочно завершен');
    else {
        let offset = 0;
        let fId = user.getCache('family_id');
        if (fId > 0) {
            let fData = await family.getData(fId);
            if (fData.get('level') === 2) {
                if (fData.get('exp') >= 299) {
                    family.addMoney(fId, 500000, 'Премия за достижения 3 уровня');
                    family.set(fId, 'level', 3);
                    family.set(fId, 'exp', 0);
                }
                else
                    family.set(fId, 'exp', fData.get('exp') + 1);
            }
            else
                offset = money * 0.3;
            if (fData.get('level') > 5) {
                family.addMoney(fId, (money + offset) * 0.3, 'Зачисление от работы автобуса');
            }
        }
        user.giveJobMoney(money + offset);
    }
};

mp.events.add("playerEnterCheckpoint", (checkpoint) => {
    try {
        if (!mp.players.local.vehicle)
            return;
        if (_checkpointId == -1 || _checkpointId == undefined)
            return;
        if (checkpoint.id == _checkpointId)
            bus.nextCheckpoint();
    }
    catch (e) {
        
    }
});

export default bus;