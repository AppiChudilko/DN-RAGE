let methods = require('../modules/methods');
let Container = require('../modules/data');

let user = require('../user');
let enums = require('../enums');
let inventory = require('../inventory');

let vehicles = require('../property/vehicles');
let business = require('../property/business');

let tradeMarket = exports;

tradeMarket.listBeach = [
    [-1721.842, -739.5616, 9.18998, -1720.492, -740.5867, 9.18998],
    [-1723.614, -741.6486, 9.18998, -1722.392, -742.7258, 9.18998],
    [-1720.879, -749.8786, 9.18998, -1719.8, -748.5518, 9.18998],
    [-1714.671, -731.9873, 9.197002, -1713.332, -733.059, 9.200655],
    [-1710.156, -729.1599, 9.21179, -1709.826, -730.8333, 9.218545],
    [-1704.815, -730.5187, 9.129768, -1705.879, -731.9301, 9.194157],
    [-1703.46, -744.8065, 9.198456, -1702.411, -743.1032, 9.210474],
    [-1701.506, -747.1006, 9.18998, -1700.299, -745.712, 9.195727],
    [-1699.106, -748.67, 9.18998, -1697.579, -749.5573, 9.18998],
    [-1701.227, -750.5378, 9.18998, -1699.834, -751.7559, 9.18998],
    [-1702.749, -752.8931, 9.18998, -1703.687, -754.3806, 9.18998],
    [-1704.585, -750.6962, 9.18998, -1705.714, -751.9618, 9.18998],
    [-1706.912, -749.1261, 9.18998, -1708.637, -747.995, 9.18998],
    [-1704.999, -746.9675, 9.18998, -1706.287, -745.8899, 9.18998],
    [-1684.67, -756.6274, 9.18998, -1683.421, -755.3127, 9.18998],
    [-1685.884, -759.7593, 9.18998, -1684.498, -761.0438, 9.18998],
    [-1687.863, -762.2729, 9.18998, -1686.513, -763.3688, 9.18998],
    [-1690.712, -764.0562, 9.18998, -1691.949, -765.3887, 9.18998],
    [-1689.432, -760.7052, 9.18998, -1690.841, -759.5969, 9.18998],
    [-1687.507, -758.4866, 9.18998, -1688.878, -757.4398, 9.18998],
    [-1688.088, -777.2056, 9.18998, -1686.976, -775.9273, 9.18998],
    [-1684.922, -779.8032, 9.18998, -1683.839, -778.5059, 9.18998],
    [-1682.49, -782.7415, 9.18998, -1681.472, -781.5364, 9.18998],
    [-1680.239, -784.7711, 9.18998, -1679.034, -783.3973, 9.18998],
    [-1677.161, -786.5153, 9.18998, -1676.036, -785.1582, 9.18998],
    [-1673.813, -789.2614, 9.18998, -1672.703, -787.8023, 9.18998],
    [-1668.22, -790.5775, 9.18998, -1666.444, -790.9466, 9.193842],
    [-1667.871, -794.4667, 9.190814, -1666.324, -793.8026, 9.192335],
    [-1665.666, -797.3461, 9.193249, -1664.654, -796.1478, 9.194255],
    [-1652.858, -808.545, 9.201405, -1651.775, -807.1477, 9.210663],
    [-1649.173, -810.0691, 9.196198, -1649.111, -808.3502, 9.202971],
    [-1645.124, -808.1882, 9.203752, -1646.482, -807.0542, 9.2078],
    [-1640.406, -802.5854, 9.231474, -1641.799, -801.5497, 9.243543],
    [-1638.279, -800.1454, 9.2478, -1639.515, -798.9207, 9.267777],
    [-1634.805, -788.6341, 9.319804, -1635.985, -790.0245, 9.341595],
    [-1638.283, -785.7778, 9.279316, -1639.387, -787.2171, 9.299719],
    [-1641.676, -783.0255, 9.14883, -1642.734, -784.3754, 9.208244],
    [-1645.076, -780.2481, 8.978675, -1646.235, -781.5327, 9.079474],
    [-1648.675, -777.3661, 8.903802, -1649.869, -778.7773, 8.998825],
    [-1650.3, -798.2331, 9.234528, -1651.32, -799.8677, 9.231315],
    [-1652.364, -796.0701, 9.22167, -1653.531, -797.3235, 9.217134],
    [-1654.71, -794.2486, 9.218636, -1656.192, -793.1998, 9.216673],
    [-1652.581, -792.1641, 9.226805, -1653.86, -791.101, 9.225347],
    [-1650.727, -789.9377, 9.244014, -1649.772, -788.4388, 9.249451],
    [-1648.569, -791.8278, 9.246663, -1647.456, -790.5479, 9.257609],
    [-1646.546, -793.7676, 9.261045, -1644.844, -794.8148, 9.273959],
    [-1648.615, -795.9698, 9.240429, -1647.208, -797.261, 9.249643],
    [-1670.045, -777.2503, 9.18998, -1668.443, -778.5803, 9.18998],
    [-1668.477, -774.268, 9.18998, -1666.754, -775.1899, 9.18998],
    [-1672.649, -779.5573, 9.18998, -1673.573, -781.1377, 9.18998],
    [-1675.6, -777.8159, 9.18998, -1676.694, -779.1016, 9.18998],
    [-1677.814, -775.2402, 9.18998, -1679.579, -774.2114, 9.18998],
    [-1676.287, -772.2222, 9.18998, -1677.626, -770.9873, 9.18998],
    [-1673.609, -770.1693, 9.18998, -1672.675, -768.4918, 9.18998],
    [-1670.6, -771.6608, 9.18998, -1669.558, -770.3822, 9.189825],
];

tradeMarket.listBlack= [
    [756.5357, -917.7897, 24.26847, 754.9102, -917.8157, 24.2386],
    [756.6884, -920.8444, 24.2383, 755.0269, -920.8732, 24.21139],
    [756.6938, -923.85, 24.20666, 755.056, -923.9004, 24.18074],
    [756.6322, -926.9384, 24.17434, 755.0134, -926.9283, 24.15193],
    [756.5274, -930.1322, 24.13803, 754.8915, -930.0272, 24.11891],
    [756.5906, -933.0952, 24.10294, 755.0034, -933.1724, 24.08203],
    [748.691, -932.8656, 24.00541, 748.6477, -931.2372, 24.0224],
    [745.5596, -932.8683, 23.96855, 745.6264, -931.1846, 23.98743],
    [742.6685, -932.847, 23.93478, 742.6826, -931.157, 23.9531],
    [739.7869, -932.9327, 23.89997, 739.7566, -931.1431, 23.91884],
    [736.8627, -932.9803, 23.86507, 736.8398, -931.2813, 23.87701],
    [733.6916, -933.0937, 23.82655, 733.7211, -931.48, 23.83097],
    [733.565, -922.8419, 23.84433, 733.5433, -924.5125, 23.84199],
    [736.5314, -922.9249, 23.89506, 736.5636, -924.5121, 23.89062],
    [739.6823, -922.9982, 23.94722, 739.6064, -924.5514, 23.93964],
    [742.5721, -923.0322, 23.99567, 742.6521, -924.6511, 23.98824],
    [745.5519, -923.0328, 24.04436, 745.5353, -924.6822, 24.03015],
    [748.7724, -923.1368, 24.09472, 748.803, -924.7767, 24.08135],
    [748.71, -920.2782, 24.11102, 748.6821, -918.5078, 24.12226],
    [745.4725, -920.2921, 24.0545, 745.4213, -918.6105, 24.06254],
    [742.4775, -920.2941, 24.00508, 742.5201, -918.4509, 24.01334],
    [739.4006, -920.2066, 23.9495, 739.4669, -918.5094, 23.9576],
    [736.4626, -920.1434, 23.89953, 736.6122, -918.4971, 23.90575],
    [733.5346, -920.1633, 23.84843, 733.6992, -918.4783, 23.85482],

    //Island Market
    [5077.58203125, -4598.94921875, 1.900068759918213, 5076.93359375, -4600.7626953125, 1.9086556434631348],
    [5075.19482421875, -4597.9638671875, 1.854698657989502, 5074.572265625, -4599.7421875, 1.863774299621582],
    [5072.51513671875, -4595.181640625, 1.8654329776763916, 5071.7998046875, -4596.7578125, 1.863541841506958],
    [5070.14111328125, -4594.1826171875, 1.8969175815582275, 5069.6162109375, -4595.94970703125, 1.88124680519104],
    [5060.5625, -4588.919921875, 1.9075438976287842, 5060.123046875, -4590.49755859375, 1.902099370956421],
    [5058.58642578125, -4588.00390625, 1.9216687679290771, 5057.84912109375, -4589.736328125, 1.913140058517456],
    [5054.88720703125, -4589.04345703125, 1.8986530303955078, 5054.27880859375, -4590.67138671875, 1.8917875289916992],
    [5051.55078125, -4590.720703125, 1.8894124031066895, 5052.8671875, -4591.30712890625, 1.890639066696167],
    [5050.50048828125, -4592.78515625, 1.898287296295166, 5052.2578125, -4593.49658203125, 1.889188289642334],
    [5055.52978515625, -4595.69775390625, 1.8930110931396484, 5055.97265625, -4594.23779296875, 1.8861303329467773],
    [5057.83642578125, -4596.4140625, 1.8754749298095703, 5058.36767578125, -4594.93603515625, 1.8784143924713135],
    [5060.44921875, -4597.45751953125, 1.8479588031768799, 5061.08203125, -4596.17041015625, 1.857274055480957],
    [5063.07666015625, -4598.50341796875, 1.8268389701843262, 5063.65966796875, -4597.18798828125, 1.8440787792205812],
    [5065.40869140625, -4599.39697265625, 1.8402471542358398, 5065.7626953125, -4598.00244140625, 1.8546674251556396],
    [5067.447265625, -4600.27197265625, 1.8499560356140137, 5068.01806640625, -4598.9462890625, 1.8601033687591553],
    [5069.28857421875, -4601.0986328125, 1.8583333492279053, 5069.8271484375, -4599.74853515625, 1.8619441986083984],
    [5071.0361328125, -4601.8974609375, 1.8662526607513428, 5071.5888671875, -4600.47607421875, 1.8603792190551758],
];

let mapBeach = new Map();
let mapBlack = new Map();

tradeMarket.loadAll = function() {
    methods.debug('tradeMarket.loadAll');
    tradeMarket.listBeach.forEach(function (item, idx) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        let tradePos = new mp.Vector3(item[3], item[4], item[5]);
        methods.createCp(shopPos.x, shopPos.y, shopPos.z, "Нажмите ~g~Е~s~ чтобы открыть меню", 0.8, -1, [33, 150, 243, 0], 0.3);

        let data = {};
        data.marker = mp.markers.new(1, tradePos, 0.8,
            {
                //direction: new mp.Vector3(0, 0, 0),
                rotation: new mp.Vector3(0, 0, 0),
                color: [33, 150, 243, 100],
                visible: false,
                dimension: 0
            });
        data.label = mp.labels.new(`#${idx + 1}`, new mp.Vector3(item[0], item[1], item[2] + 1),
            {
                los: false,
                font: 0,
                drawDistance: 7,
                dimension: 0
            });

        mapBeach.set(idx.toString(), data);
    });
    tradeMarket.listBlack.forEach(function (item, idx) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        let tradePos = new mp.Vector3(item[3], item[4], item[5]);
        methods.createCp(shopPos.x, shopPos.y, shopPos.z, "Нажмите ~g~Е~s~ чтобы открыть меню", 0.8, -1, [33, 150, 243, 0], 0.3);

        let data = {};
        data.marker = mp.markers.new(1, tradePos, 0.8,
            {
                //direction: new mp.Vector3(0, 0, 0),
                rotation: new mp.Vector3(0, 0, 0),
                color: [33, 150, 243, 100],
                visible: false,
                dimension: 0
            });
        data.label = mp.labels.new(`#${idx + 1}`, new mp.Vector3(item[0], item[1], item[2] + 1),
            {
                los: false,
                font: 0,
                drawDistance: 7,
                dimension: 0
            });

        mapBlack.set(idx.toString(), data);
    });
};

tradeMarket.getBeach = function(id, key) {
    return Container.Data.Get(enums.offsets.trade + methods.parseInt(id), key);
};

tradeMarket.hasBeach = function(id, key) {
    return Container.Data.Has(enums.offsets.trade + methods.parseInt(id), key);
};

tradeMarket.setBeach = function(id, key, val) {
    Container.Data.Set(enums.offsets.trade + methods.parseInt(id), key, val);
};

tradeMarket.getBlack = function(id, key) {
    return Container.Data.Get(enums.offsets.tradeb + methods.parseInt(id), key);
};

tradeMarket.hasBlack = function(id, key) {
    return Container.Data.Has(enums.offsets.tradeb + methods.parseInt(id), key);
};

tradeMarket.setBlack = function(id, key, val) {
    Container.Data.Set(enums.offsets.tradeb + methods.parseInt(id), key, val);
};

tradeMarket.getAllBeachData = function(id) {
    return Container.Data.GetAll(enums.offsets.trade + methods.parseInt(id));
};

tradeMarket.getAllBlackData = function(id) {
    return Container.Data.GetAll(enums.offsets.tradeb + methods.parseInt(id));
};

tradeMarket.getAllBlack = function() {
    methods.debug('tradeMarket.getAllBlack');
    return mapBlack;
};

tradeMarket.getAllBeach = function() {
    methods.debug('tradeMarket.getAllBeach');
    return mapBeach;
};

tradeMarket.getBeachInRadius = function(pos, radius = 2) {
    methods.debug('tradeMarket.getBeachInRadius');
    let shopId = -1;
    tradeMarket.listBeach.forEach(function (item, idx) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(pos, shopPos) < radius)
            shopId = idx;
    });
    return shopId;
};

tradeMarket.getBeachBuyInRadius = function(pos, radius = 2) {
    methods.debug('tradeMarket.getBeachBuyInRadius');
    let shopId = -1;
    tradeMarket.listBeach.forEach(function (item, idx) {
        let shopPos = new mp.Vector3(item[3], item[4], item[5]);
        if (methods.distanceToPos(pos, shopPos) < radius)
            shopId = idx;
    });
    return shopId;
};

tradeMarket.getBlackInRadius = function(pos, radius = 2) {
    methods.debug('tradeMarket.getBlackInRadius');
    let shopId = -1;
    tradeMarket.listBlack.forEach(function (item, idx) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(pos, shopPos) < radius)
            shopId = idx;
    });
    return shopId;
};

tradeMarket.getBlackBuyInRadius = function(pos, radius = 2) {
    methods.debug('tradeMarket.getBlackBuyInRadius');
    let shopId = -1;
    tradeMarket.listBlack.forEach(function (item, idx) {
        let shopPos = new mp.Vector3(item[3], item[4], item[5]);
        if (methods.distanceToPos(pos, shopPos) < radius)
            shopId = idx;
    });
    return shopId;
};

tradeMarket.checkPosForOpenMenu = function(player) {
    tradeMarket.checkPosForOpenBeachCreateMenu(player);
    tradeMarket.checkPosForOpenBeachBuyMenu(player);

    tradeMarket.checkPosForOpenBlackCreateMenu(player);
    tradeMarket.checkPosForOpenBlackBuyMenu(player);
};

tradeMarket.checkPosForOpenBeachCreateMenu = function(player) {
    methods.debug('tradeMarket.checkPosForOpenBeachCreateMenu');
    try {
        let shopId = tradeMarket.getBeachInRadius(player.position, 2);
        if (shopId == -1)
            return;
        player.call('client:menuList:showTradeBeachCreateMenu', [shopId]);
    }
    catch (e) {
        methods.debug(e);
    }
};

tradeMarket.checkPosForOpenBeachBuyMenu = function(player) {
    methods.debug('tradeMarket.checkPosForOpenBeachBuyMenu');
    try {
        let shopId = tradeMarket.getBeachBuyInRadius(player.position, 2);
        if (shopId == -1)
            return;
        let rentId = methods.parseInt(tradeMarket.getBeach(shopId, 'rent'));
        if (rentId > 0)
            inventory.getItemListTrade(player, rentId, inventory.types.TradeBeach);
    }
    catch (e) {
        methods.debug(e);
    }
};

tradeMarket.checkPosForOpenBlackCreateMenu = function(player) {
    methods.debug('tradeMarket.checkPosForOpenBlackCreateMenu');
    try {
        let shopId = tradeMarket.getBlackInRadius(player.position, 2);
        if (shopId == -1)
            return;
        player.call('client:menuList:showTradeBlackCreateMenu', [shopId]);
    }
    catch (e) {
        methods.debug(e);
    }
};

tradeMarket.checkPosForOpenBlackBuyMenu = function(player) {
    methods.debug('tradeMarket.checkPosForOpenBlackBuyMenu');
    try {
        let shopId = tradeMarket.getBlackBuyInRadius(player.position, 2);
        if (shopId == -1)
            return;
        let rentId = methods.parseInt(tradeMarket.getBlack(shopId, 'rent'));
        if (rentId > 0)
            inventory.getItemListTrade(player, rentId, inventory.types.TradeBlack);
    }
    catch (e) {
        methods.debug(e);
    }
};