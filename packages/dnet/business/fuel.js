let methods = require('../modules/methods');

let fuel = exports;

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

//1339433404

fuel.loadAll = function() {
    methods.debug('fuel.loadAll');
    fuel.list.forEach(function (item) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (item[3] === 147 || item[3] === 148 || item[3] === 149 || item[3] === 150)
            methods.createBlip(shopPos, 415, 5, 0.6, 'Заправка');
        else if (item[3] === 151 || item[3] === 152 || item[3] === 153)
            methods.createBlip(shopPos, 415, 3, 0.6, 'Заправка');
        else
            methods.createBlip(shopPos, 415, 0, 0.6, 'Заправка');
    });
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
        if (item[2] >= 147)
            return;
        if (methods.distanceToPos(shopPos, pos) < methods.distanceToPos(prevPos, pos))
            prevPos = shopPos;
    });
    return prevPos;
};