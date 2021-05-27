let Container = require('../modules/data');
let mysql = require('../modules/mysql');
let methods = require('../modules/methods');

let user = require('../user');
let coffer = require('../coffer');
let enums = require('../enums');
let inventory = require('../inventory');

let weather = require('../managers/weather');
let dispatcher = require('../managers/dispatcher');
let canabisWar = require('../managers/canabisWar');

let vehicles = require('./vehicles');
let stocks = require('./stocks');

let fraction = exports;

let count = 0;
let timer = 0;
let timerMafia = 0;
let timerBig = 0;

let isCargo = false;
let isCargoMafia = false;
let isCargoBig = false;
let isCargoArmy = false;

let radius1 = 15;
let radius2 = 60;

let radiusMafia1 = 15;
let radiusMafia2 = 60;

let radiusBig1 = 25;
let radiusBig2 = 120;

fraction.shopList = [
    {
        bId: 76,
        name: "Ammu-Nation Cypress Flats",
        sumMax: 240000,
        sumMin: 220000,
        pos: [
            [808.8968, -2159.189, 28.61901, 6.53001],
        ]
    },
    {
        bId: 94,
        name: "Robs Liquor Murrieta Heights",
        sumMax: 240000,
        sumMin: 220000,
        pos: [
            [1134.14, -982.4875, 45.41582, 284.5632],
        ]
    },
    {
        bId: 30,
        name: "Herr Kutz Devis",
        sumMax: 240000,
        sumMin: 220000,
        pos: [
            [134.455, -1707.691, 28.29161, 151.1897],
        ]
    },
    {
        bId: 104,
        name: "LTD Gasoline Davis",
        sumMax: 80000,
        sumMin: 60000,
        pos: [
            [-47.89329, -1759.359, 28.42101, 87.38793],
            [-46.6761, -1758.042, 28.42101, 58.77755],
        ]
    },
    {
        bId: 64,
        name: "Discount Store Strawberry",
        sumMax: 60000,
        sumMin: 40000,
        pos: [
            [73.85292, -1392.154, 28.37614, 283.6447],
            [74.91823, -1387.565, 28.37614, 185.8019],
            [78.02972, -1387.558, 28.37614, 184.6837],
        ]
    },
    {
        bId: 89,
        name: "24/7 Strawberry",
        sumMax: 80000,
        sumMin: 60000,
        pos: [
            [24.31314, -1347.342, 28.49703, 274.6689],
            [24.29523, -1345, 28.49703, 271.7999],
        ]
    },
    {
        bId: 40,
        name: "The Pit Tattoo",
        sumMax: 240000,
        sumMin: 220000,
        pos: [
            [-1151.652, -1424.404, 3.954463, 132.5959],
        ]
    },
    {
        bId: 33,
        name: "Beachcombover",
        sumMax: 240000,
        sumMin: 220000,
        pos: [
            [-1151.652, -1424.404, 3.954463, 132.5959],
        ]
    },
    {
        bId: 67,
        name: "Binco Vespucci Canals",
        sumMax: 60000,
        sumMin: 40000,
        pos: [
            [-822.4609, -1071.843, 10.32811, 216.5726],
            [-817.9464, -1070.503, 10.32811, 120.5435],
            [-816.4236, -1073.197, 10.32811, 122.9058],
        ]
    },
    /*{
        bId: 95,
        name: "Robs Liquor Vespucci Canals",
        sumMax: 240000,
        sumMin: 220000,
        pos: [
            [-1222.079, -908.4241, 11.32635, 26.30677],
        ]
    },*/
    {
        bId: 106,
        name: "LTD Gasoline Little Seoul",
        sumMax: 80000,
        sumMin: 60000,
        pos: [
            [-706.0416, -915.4315, 18.2156, 121.0112],
            [-705.9542, -913.6546, 18.2156, 91.24891],
        ]
    },
    {
        bId: 74,
        name: "Ammu-Nation Little Seoul",
        sumMax: 240000,
        sumMin: 220000,
        pos: [
            [-660.9584, -933.4232, 20.82923, 182.273],
        ]
    },
    {
        bId: 92,
        name: "Liquor Chumash",
        sumMax: 240000,
        sumMin: 220000,
        pos: [
            [-2966.386, 390.7784, 14.04331, 73.20607],
        ]
    },
    {
        bId: 82,
        name: "24/7 Banham Canyon",
        sumMax: 80000,
        sumMin: 60000,
        pos: [
            [-3039.08, 584.3269, 6.908932, 358.8096],
            [-3041.149, 583.6489, 6.908932, 22.88623],
        ]
    },
    {
        bId: 83,
        name: "24/7 Chumash",
        sumMax: 80000,
        sumMin: 60000,
        pos: [
            [-3244.603, 1000.006, 11.83071, 355.5228],
            [-3242.168, 999.9278, 11.83075, 359.23],
        ]
    },
    {
        bId: 58,
        name: "Suburban Chumash",
        sumMax: 60000,
        sumMin: 40000,
        pos: [
            [-3170.013, 1041.548, 19.86322, 75.12622],
            [-3169.305, 1043.154, 19.86322, 74.92207],
            [-3168.563, 1044.739, 19.86322, 70.76829],
        ]
    },
    {
        bId: 42,
        name: "Ink Inc Tattoo",
        sumMax: 240000,
        sumMin: 220000,
        pos: [
            [-3171.197, 1073.201, 19.82917, 343.623],
        ]
    },
    {
        bId: 78,
        name: "Ammu-Nation Chumash",
        sumMax: 240000,
        sumMin: 220000,
        pos: [
            [-3173.123, 1089.66, 19.83874, 247.4527],
        ]
    },
    {
        bId: 108,
        name: "LTD Gasoline Richman Glen",
        sumMax: 80000,
        sumMin: 60000,
        pos: [
            [-1818.927, 792.9451, 137.0822, 169.9128],
            [-1820.002, 794.2521, 137.0863, 134.8464],
        ]
    },
    {
        bId: 79,
        name: "Ammu-Nation Great Chaparral",
        sumMax: 240000,
        sumMin: 220000,
        pos: [
            [-1118.094, 2700.753, 17.55414, 225.373],
        ]
    },
    {
        bId: 65,
        name: "Discount Store Great Chaparral",
        sumMax: 60000,
        sumMin: 40000,
        pos: [
            [-1101.912, 2712.19, 18.10786, 229.5424],
            [-1097.746, 2714.485, 18.10786, 138.8698],
            [-1095.678, 2712.181, 18.10786, 140.0079],
        ]
    },
    {
        bId: 86,
        name: "24/7 Harmony",
        sumMax: 80000,
        sumMin: 60000,
        pos: [
            [549.2157, 2671.359, 41.15651, 100.8311],
            [549.5192, 2669.066, 41.15651, 100.3135],
        ]
    },
    {
        bId: 60,
        name: "Suburban Harmony",
        sumMax: 60000,
        sumMin: 40000,
        pos: [
            [612.6832, 2764.496, 41.08812, 276.5388],
            [612.8069, 2762.66, 41.08812, 283.3486],
            [612.9492, 2760.931, 41.08812, 279.4291],
        ]
    },
    /*{
        bId: 96,
        name: "Scoops Liquor Barn",
        sumMax: 240000,
        sumMin: 220000,
        pos: [
            [1165.981, 2710.884, 37.15769, 180.4475],
        ]
    },*/
    /*{
        bId: 61,
        name: "Discount Store Grand Senora Desert",
        sumMax: 60000,
        sumMin: 40000,
        pos: [
            [1197.434, 2711.755, 37.22262, 188.5901],
            [1202.03, 2710.732, 37.22262, 101.2999],
            [1202.06, 2707.603, 37.22262, 98.07609],
        ]
    },*/
    {
        bId: 77,
        name: "Ammu-Nation Tataviam Mountains",
        sumMax: 240000,
        sumMin: 220000,
        pos: [
            [2566.637, 292.4502, 107.7349, 4.131579],
        ]
    },
    {
        bId: 90,
        name: "24/7 Tataviam Mountains",
        sumMax: 80000,
        sumMin: 60000,
        pos: [
            [2554.851, 380.7508, 107.623, 358.886],
            [2557.135, 380.7416, 107.623, 357.6542],
        ]
    },
    {
        bId: 85,
        name: "24/7 Grand Senora Desert",
        sumMax: 80000,
        sumMin: 60000,
        pos: [
            [2675.927, 3280.391, 54.24115, 332.3407],
            [2677.966, 3279.257, 54.24115, 333.0592],
        ]
    },
    {
        bId: 62,
        name: "Discount Store Grapeseed",
        sumMax: 60000,
        sumMin: 40000,
        pos: [
            [1695.544, 4822.227, 41.0631, 106.2861],
            [1695.11, 4817.554, 41.0631, 13.15722],
            [1691.959, 4817.184, 41.0631, 14.44859],
        ]
    },
    {
        bId: 105,
        name: "LTD Gasoline Grapeseed",
        sumMax: 80000,
        sumMin: 60000,
        pos: [
            [1696.593, 4923.86, 41.06366, 6.185347],
            [1697.936, 4922.814, 41.06366, 327.2919],
        ]
    },
    {
        bId: 87,
        name: "24/7 Mount Chiliad",
        sumMax: 80000,
        sumMin: 60000,
        pos: [
            [1728.755, 6417.411, 34.03724, 245.723],
            [1727.664, 6415.288, 34.03724, 245.5537],
        ]
    }
];

fraction.warVehPos = [
    [1870.082, 298.3746, 162.3346, -124.8814], // East BC
    [1896.424, 412.0526, 162.3378, -4.591704], // East BC
    [1993.255, 496.8024, 163.0947, 53.31678], // East BC
    [2808.715, -619.4117, 3.042876, -148.2264], // East BC
    [2830.751, -793.5372, 1.768237, 107.0505], // East BC
    [2372.163, -568.6808, 78.94184, -66.70097], // East BC
    [2546.143, 1098.502, 65.319, -87.69911], // East BC
    [2436.517, 1351.142, 48.21091, -2.759004], // East BC
    [2725.208, 1354.907, 24.2615, 0.5711061], // East BC
    [2846.512, 1524.621, 24.305, 57.1941], // East BC
    [2526.179, 2404.379, 50.79271, -60.5872], // Northeastern BC
    [2364.736, 2734.847, 44.27731, 63.13626], // Northeastern BC
    [2703.672, 2994.222, 35.31195, 81.06208], // Northeastern BC
    [2623.019, 3000.074, 39.24618, 75.34029], // Northeastern BC
    [2518.539, 3133.927, 49.26498, -158.8873], // Northeastern BC
    [2698.627, 3362.313, 56.80704, -154.5147], // Northeastern BC
    [2490.877, 3293.257, 51.63654, 163.6505], // Northeastern BC
    [2309.01, 3203.323, 48.53867, 162.0135], // Northeastern BC
    [2833.331, 3927.366, 46.33087, 76.07546], // Northeastern BC
    [2722.111, 3778.254, 43.62608, -73.46407], // Northeastern BC
    /*[2599.976, 4496.924, 36.26006, -30.36485], // Grapeseed
    [2511.435, 4838.765, 35.47731, -15.75592], // Grapeseed
    [2264.874, 4910.021, 40.68339, 15.61627], // Grapeseed
    [2358.013, 5008.499, 42.97598, 123.0206], // Grapeseed
    [2182.581, 5066.679, 44.14911, 56.53646], // Grapeseed
    [2103.671, 5133.179, 48.50955, 46.26224], // Grapeseed
    [2034.205, 4912.188, 41.25378, 50.33447], // Grapeseed
    [1945.093, 4993.532, 42.19816, -7.24361], // Grapeseed
    [1929.582, 4840.355, 45.48512, -177.6844], // Grapeseed
    [1854.518, 4914.193, 44.92831, 167.0235], // Grapeseed*/
    [1422.353, 6595.212, 12.30073, 80.47939], // Paleto Bay
    [1278.421, 6608.941, 0.9136851, 79.97983], // Paleto Bay
    [874.2178, 6583.313, 5.998014, 64.23732], // Paleto Bay
    [640.0947, 6654.481, 6.322682, 113.5851], // Paleto Bay
    [462.2226, 6747.779, 1.776442, 141.8092], // Paleto Bay
    [166.1704, 6968.729, 9.658717, 103.9271], // Paleto Bay
    [75.77062, 7076.842, 1.713074, 60.75148], // Paleto Bay
    [17.9405, 6851.714, 12.94489, 148.9224], // Paleto Bay
    [123.5249, 6717.721, 40.09267, -173.9498], // Paleto Bay
    [214.7288, 7030.315, 2.441566, 27.06781], // Paleto Bay
    [-826.2584, 5772.151, 4.241761, 59.7108], // Northwestern BC
    [-970.7736, 5532.121, 5.416851, 82.82072], // Northwestern BC
    [-1069.131, 5458.614, 3.492951, 0.2004236], // Northwestern BC
    [-472.531, 5517.609, 79.71832, 30.30912], // Northwestern BC
    [-733.5109, 5362.463, 60.48499, -2.553496], // Northwestern BC
    [-413.2389, 5162.115, 108.915, 111.2487], // Northwestern BC
    [-1632.405, 4736.869, 52.98143, 36.60846], // Northwestern BC
    [-1707.369, 5040.811, 30.42309, -56.09746], // Northwestern BC
    [-1681.224, 4599.285, 48.90196, -66.52148], // Northwestern BC
    [-2196.254, 4584.213, 1.673657, -90.72962], // Northwestern BC
    [-2502.712, 2703.665, 1.376871, -145.1805], // Logo Zancudo
    [-2576.344, 2488.536, 0.9203494, -152.1933], // Logo Zancudo
    [-2335.763, 2436.943, 5.189456, -3.544878], // Logo Zancudo
    [-2281.071, 2678.393, 1.766204, -57.08541], // Logo Zancudo
    [-2122.812, 2539.186, 2.875674, -110.2537], // Logo Zancudo
    [-2189.286, 2682.892, 2.61702, -71.71084], // Logo Zancudo
    [-1954.691, 2644.694, 2.64593, -141.9069], // Logo Zancudo
    [-1881.617, 2537.36, 2.548225, -64.28069], // Logo Zancudo
    [-1836.898, 2556.347, 3.449423, -46.74959], // Logo Zancudo
    [-1728.43, 2643.229, 1.181955, -55.04958], // Logo Zancudo
    [-2835.302, 1604.851, 40.08301, 135.3932], // West BC
    [-2667.052, 1737.443, 81.59503, 131.8065], // West BC
    [-2785.78, 1222.146, 110.8425, 53.05136], // West BC
    [-2283.421, 823.7731, 216.5667, -60.02339], // West BC
    [-1747.831, 1990.126, 117.0882, -37.98998], // West BC
    [-1344.053, 1491.82, 143.6574, 39.46989], // West BC
    [-1804.866, 1180.761, 192.1481, -115.5075], // West BC
    [-987.5235, 1861.951, 148.2501, -88.78628], // West BC
    [-1069.976, 2453.866, 45.35464, 31.14936], // West BC
    [-442.0548, 2121.462, 200.3653, -108.6176], // West BC
    [930.803, 2993.985, 39.31632, -102.5824],  // West BC
    [1329.069, 2873.024, 41.39872, -155.1515],  // West BC
    [1627.524, 2983.506, 52.19984, -165.3867],  // West BC
    [1873.676, 3413.927, 40.61953, -159.3947],  // West BC
    [1312.363, 2232.864, 84.16484, 134.2716],  // West BC
    [33.06804, 2937.186, 56.04153, 178.2496],  // West BC
    [-301.4055, 3783.338, 66.84783, -117.2053],  // West BC
    [848.2012, 2987.074, 42.51862, -109.5408],  // West BC
    [447.2396, 2795.004, 50.85566, -10.29027],  // West BC
    [564.9754, 2278.31, 60.52063, -1.453646],  // West BC
];

fraction.warVehPosGhetto = [
    [143.3848114013672, -1691.2716064453125, 29.623870849609375, 45.9788818359375],
    [158.39117431640625, -1507.834716796875, 29.376426696777344, 96.02655029296875],
    [38.62564468383789, -1743.2216796875, 29.537214279174805, 51.138397216796875],
    [484.70574951171875, -1973.9261474609375, 24.856245040893555, 56.667816162109375],
    [236.68455505371094, -1775.2017822265625, 28.902326583862305, 221.2811737060547],
];

fraction.spawnSellCar = [
    [890.7494, -887.1849, 25.84651],
    [766.4, -1260.555, 25.37186],
    [851.8011, -1831.602, 28.06896],
    [851.6774, -1158.151, 24.3023],
    [847.5076, -1069.428, 26.92109],
    [699.4786, -1128.382, 22.24945],
    [577.7948, 126.9853, 97.04148],
    [323.1581, 266.567, 103.414],
    [253.3774, 377.4038, 104.5283],
    [178.6812, 306.8284, 104.3724],
    [230.8467, 129.6978, 101.5997],
    [194.7888, -158.9859, 55.49936],
    [216.3271, -168.5611, 55.3541],
    [148.8967, -248.5904, 50.4516],
    [82.71505, -236.2534, 50.39946],
    [-27.13595, -194.1181, 51.35989],
    [3.520691, -205.3572, 51.74189],
    [-95.4155, -67.6993, 55.53669],
    [-168.475, -34.71078, 51.4754],
    [-360.5042, -76.62489, 44.66393],
    [-458.4943, -52.30092, 43.52047],
    [363.5428, -819.1024, 28.29422],
    [322.06, -1003.798, 28.29926],
    [141.5507, -1082.443, 28.19286],
    [42.70964, -1042.73, 28.59591],
    [-26.0413, -1056.122, 27.21913],
    [-206.9192, -1179.181, 22.02565],
    [-155.4755, -1302.916, 30.29429],
    [-163.9829, -1294.986, 30.18624],
    [167.7018, -1271.769, 28.11567],
    [165.4078, -1283.638, 28.29859],
    [150.1237, -1337.773, 28.2023],
    [181.1786, -1268.827, 28.19847],
    [349.2975, -1245.632, 31.50902],
    [473.5204, -1277.482, 28.53934],
    [501.6826, -1337.755, 28.31747],
    [489.5869, -1470.616, 28.14251],
    [204.1818, -1470.338, 28.14609],
    [137.0424, -1491.959, 28.14161],
    [161.3926, -1535.993, 28.14277],
    [140.9424, -1662.967, 28.34746],
    [138.9199, -1693.797, 28.29168],
    [180.7571, -1839.156, 27.10101],
    [126.1626, -2200.372, 5.033323],
    [-416.027, -2182.174, 9.318065],
    [-1109, -1633.801, 3.615957],
    [-1160.825, -1567.497, 3.402748],
    [-1200.51, -1475.458, 3.379667],
    [-1202.092, -1488.313, 3.368478],
    [-1169.796, -1390.268, 3.905849],
    [-1224.043, -1325.96, 3.280814],
    [-1321.365, -1252.643, 3.598371],
    [-1355.841, -888.1062, 12.88378],
    [-1320.76, -1050.598, 6.395164],
    [-1322.497, -1163.263, 3.778337],
    [-688.3421, -884.9573, 23.49907],
    [-606.6516, -1031.485, 20.78754],
    [-621.3337, -1130.681, 21.17824],
    [-675.5823, -1177.249, 9.612634],
    [-716.4938, -1117.794, 9.638943],
    [-1370.031, -330.7177, 38.04632],
    [-1410.545, -275.7105, 45.36698],
    [-1323.405, -238.9408, 41.6163],
    [-1288.583, -275.9117, 37.74124],
    [-1242.971, -257.9161, 37.96944],
    [-1307.487, -165.5989, 43.31689],
    [-1375.376, -640.7664, 27.67338],
    [-1318.818, -592.7297, 27.70128],
    [-1302.734, -614.6133, 26.37872],
    [-1262.802, -656.7431, 25.66081],
    [-1204.121, -714.222, 20.62428],
    [-1263.289, -821.7017, 16.09917],
    [-1286.903, -794.5048, 16.59557],
    [-1325.62, -755.705, 19.36698],
    [-993.6166, -296.0273, 36.81883],
    [-975.684, -267.8478, 37.30238],
    [-952.3403, -181.6185, 35.9865],
    [-1242.613, 381.5071, 74.34577],
    [18.9639, -2470.025, 5.006779],
    [17.50936, -2500.126, 5.006742],
    [-1.310199, -2641.652, 5.02572],
    [65.85783, -2394.83, 4.999991],
    [571.9922, -2615.65, 5.082719],
    [512.1475, -3002.872, 5.044459],
    [586.5938, -3000.016, 5.045214],
    [601.0622, -2969.064, 5.045213],
    [813.8008, -3085.608, 4.900832],
    [907.441, -3085.644, 4.900764],
    [1003.035, -3090.569, 4.901042],
    [1046.298, -2979.327, 4.901042],
    [1119.263, -3031.792, 4.901042],
    [1167.046, -2976.289, 4.902107],
    [893.0602, -3082.885, 4.900764],
    [949.7615, -3086.139, 4.900764],
    [894.3501, -3031.693, 4.902038],
    [893.3064, -2968.881, 4.900779],
    [990.4277, -2971.079, 4.900827],
    [1135.723, -3230.098, 4.898733],
    [865.5045, -3207.119, 4.900659],
    [585.8919, -2831.814, 5.054844],
];

let currentWarPos = [];

fraction.loadAll = function() {
    methods.debug('fraction.loadAll');

    mysql.executeQuery(`SELECT * FROM fraction_list`, function (err, rows, fields) {
        rows.forEach(function(item) {
            fraction.set(item['id'], 'id', item['id']);
            fraction.set(item['id'], 'owner_id', item['owner_id']);
            fraction.set(item['id'], 'name', item['name']);
            fraction.set(item['id'], 'money', item['money']);
            fraction.set(item['id'], 'is_bank', item['is_bank']);
            fraction.set(item['id'], 'is_shop', item['is_shop']);
            fraction.set(item['id'], 'is_war', item['is_war']);
            fraction.set(item['id'], 'is_mafia', item['is_mafia']);
            fraction.set(item['id'], 'is_kill', item['is_kill']);
            fraction.set(item['id'], 'proc_clear', item['proc_clear']);
            fraction.set(item['id'], 'spawn_x', item['spawn_x']);
            fraction.set(item['id'], 'spawn_y', item['spawn_y']);
            fraction.set(item['id'], 'spawn_z', item['spawn_z']);
            fraction.set(item['id'], 'spawn_rot', item['spawn_rot']);
            fraction.set(item['id'], 'rank_leader', item['rank_leader']);
            fraction.set(item['id'], 'rank_sub_leader', item['rank_sub_leader']);
            fraction.set(item['id'], 'rank_list', item['rank_list']);
            fraction.set(item['id'], 'rank_type_list', item['rank_type_list']);

            fraction.set(item['id'], 'orderLamar', 0);
            fraction.set(item['id'], 'orderLamarM', 0);
            fraction.set(item['id'], 'orderAtm', 0);
            fraction.set(item['id'], 'orderFuel', 0);
            fraction.set(item['id'], 'orderDrug', 0);

            if (item['is_war']) {
                //fraction.isGang
                let color = enums.fractionColor[item['id']];
                methods.createBlip(new mp.Vector3(item['spawn_x'], item['spawn_y'], item['spawn_z']), 310, color, 0.6, 'Титульная тер.');
            }
            else if (item['is_mafia']) {
                //SKIP
            }
            else if (item['spawn_x'] !== 0) {
                methods.createBlip(new mp.Vector3(item['spawn_x'], item['spawn_y'], item['spawn_z']), 565, 37, 0.6, 'Spawn орг.');
            }
        });
        count = rows.length;
        methods.debug('All Fraction Loaded: ' + count);
    });
};

let isRemove = false;
fraction.removeTaxAndSave = function() {

    if (isRemove)
        return;

    methods.debug('fraction.removeTax');

    let dateTime = new Date();
    if (dateTime.getHours() >= 1 && dateTime.getHours() > 6)
        return;

    isRemove = true;
    mysql.executeQuery(`SELECT * FROM fraction_list`, function (err, rows, fields) {
        rows.forEach(function(item) {
            let sum = 35;
            if (item['is_shop'])
                sum += 15;
            fraction.removeMoney(item['id'], sum, 'Взнос за существование');
            if (fraction.getMoney(item['id']) < 0 && !item['is_mafia'] && !item['is_war']) {
                fraction.destroyJust(item['id']);
            }
            else {
                fraction.save(item['id']);
            }
        });
    });
};

fraction.saveAll = function() {
    methods.debug('fraction.saveAll');
    mysql.executeQuery(`SELECT * FROM fraction_list`, function (err, rows, fields) {
        rows.forEach(function(item) {
            fraction.save(item['id']);
        });
    });
};

fraction.getCount = function() {
    methods.debug('fraction.getCount');
    return count;
};

fraction.isMafia = function(fractionId) {
    return fraction.get(fractionId, 'is_mafia');
};

fraction.isGang = function(fractionId) {
    return fraction.get(fractionId, 'is_war');
};

fraction.canSpawn = function(fractionId) {
    return fraction.get(fractionId, 'spawn_x') !== 0;
};

fraction.createCargoWar = function(count = 3) {

    if (isCargo)
        return;

    methods.notifyWithPictureToFractions2('Борьба за груз', `~r~ВНИМАНИЕ!`, 'Началась война за груз, груз отмечен на карте');
    isCargo = true;

    //currentWarPos = [];
    let spawnList = [];

    if (count > 5)
        count = 5;
    if (count < 1)
        count = 1;

    for (let i = 0; i < count; i++)
        spawnList.push(methods.getRandomInt(0, fraction.warVehPos.length));

    timer = 720;

    spawnList.forEach((item, i) => {
        let posVeh = new mp.Vector3(fraction.warVehPos[item][0], fraction.warVehPos[item][1], fraction.warVehPos[item][2]);

        let b1 = methods.getRandomInt(1000, 2000);
        let b2 = methods.getRandomInt(1000, 2000);
        let b3 = methods.getRandomInt(1000, 2000);
        currentWarPos.push({ type: 0, b1: b1, b2: b2, b3: b3, pos: posVeh, isActive: true });

        mp.players.forEach(p => {
            if (!user.isLogin(p))
                return;
            if (user.get(p, 'fraction_id2') > 0 && user.has(p, 'isCargo') || user.isAdmin(p) || user.isPolice(p)) {
                user.createBlip(p, b1, posVeh.x, posVeh.y, posVeh.z, 637, i + 1);
                user.createBlipByRadius(p, b2, posVeh.x, posVeh.y, posVeh.z, radius1, 9, 1);
                user.createBlipByRadius(p, b3, posVeh.x, posVeh.y, posVeh.z, radius2, 9, 3);
            }
        });

        vehicles.spawnCarCb(veh => {

            if (!vehicles.exists(veh))
                return;

            let rare = 0;
            if (methods.getRandomInt(0, 100) < 40)
                rare = 1;
            if (methods.getRandomInt(0, 100) < 15)
                rare = 2;

            try {
                let color = methods.getRandomInt(0, 150);
                veh.locked = false;
                veh.setColor(color, color);

                veh.setMod(5, methods.getRandomInt(0, 2));

                let boxes = [];

                /*if (methods.getRandomInt(0, 100) <= 50)
                    boxes.push(methods.getRandomInt(3, 5));
                else
                    boxes.push(methods.getRandomInt(38, 40));*/
                boxes.push(methods.getRandomInt(3, 5));

                for (let i = 0; i < 3; i++) {
                    let rare = 0;
                    if (methods.getRandomInt(0, 100) < 40)
                        rare = 1;
                    if (methods.getRandomInt(0, 100) < 10)
                        rare = 2;
                    let boxRandom = stocks.boxList.filter((item) => { return item[7] === rare; });
                    boxes.push(boxRandom[methods.getRandomInt(0, boxRandom.length)][2]);
                }

                veh.setVariable('box', JSON.stringify(boxes));
                veh.setVariable('cargoId', b1);
            }
            catch (e) {
                methods.debug(e);
            }

        }, posVeh, fraction.warVehPos[item][3], 'Speedo4');
    });

    setTimeout(fraction.timerCargoWar, 1000);
};

fraction.getNearSpawn = function(pos) {
    let prevPos = new mp.Vector3(9999, 9999, 9999);
    fraction.warVehPos.forEach(function (item,) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(shopPos, pos) < methods.distanceToPos(prevPos, pos))
            prevPos = shopPos;
    });
    return prevPos;
};

fraction.getNearSpawnGarage = function(pos) {
    let prevPos = new mp.Vector3(9999, 9999, 9999);
    fraction.spawnSellCar.forEach(function (item,) {
        let shopPos = new mp.Vector3(item[0], item[1], item[2]);
        if (methods.distanceToPos(shopPos, pos) < methods.distanceToPos(prevPos, pos))
            prevPos = shopPos;
    });
    return prevPos;
};

fraction.getRandomSpawnGarage = function() {
    let item = fraction.spawnSellCar[methods.getRandomInt(0, fraction.spawnSellCar.length)];
    return new mp.Vector3(item[0], item[1], item[2]);
};

fraction.spawnNearCargo = function(player, isDrug = false, name = 'Speedo4', count = 9) {

    if (!user.isLogin(player))
        return;

    let posVeh = fraction.getNearSpawnGarage(player.position);

    user.setWaypoint(player, posVeh.x, posVeh.y);
    player.notify('~g~Метка на фургон была установлена');

    vehicles.spawnCarCb(veh => {

        if (!vehicles.exists(veh))
            return;

        let rare = 0;
        if (methods.getRandomInt(0, 100) < 40)
            rare = 1;
        if (methods.getRandomInt(0, 100) < 15)
            rare = 2;

        try {
            let color = methods.getRandomInt(0, 150);
            veh.locked = false;
            veh.setColor(color, color);

            let boxes = [];

            if (isDrug)
                count = 3;

            for (let i = 0; i < count; i++) {

                if (isDrug) {
                    boxes.push(39);
                }
                else if (name === 'Mule4') {
                    boxes.push(50);
                }
                else {
                    let rare = 0;
                    if (methods.getRandomInt(0, 100) < 40)
                        rare = 1;
                    if (methods.getRandomInt(0, 100) < 10)
                        rare = 2;
                    let boxRandom = stocks.boxList.filter((item) => { return item[7] === rare; });
                    boxes.push(boxRandom[methods.getRandomInt(0, boxRandom.length)][2]);
                }
            }

            veh.setVariable('box', JSON.stringify(boxes));

            veh.setVariable('cargoId', 999);
        }
        catch (e) {
            methods.debug(e);
        }

    }, posVeh, 0, name);
};

fraction.spawnCargo = function(name, boxes, x, y, z, heading = 0, cargoId = 999, color = -1) {
    vehicles.spawnCarCb(veh => {
        if (!vehicles.exists(veh))
            return;
        try {
            if (color < 0)
                color = methods.getRandomInt(0, 150);

            veh.locked = false;
            veh.setColor(color, color);
            veh.setVariable('box', JSON.stringify(boxes));
            veh.setVariable('cargoId', cargoId);
        }
        catch (e) {
            methods.debug(e);
        }

    }, new mp.Vector3(x, y, z), heading, name);
};

fraction.spawnNearBank = function(player, type = 0) {

    if (!user.isLogin(player))
        return;

    /*let posVeh = fraction.getNearSpawnGarage(player.position);
    if (type === 0 || type === 99)
        posVeh = fraction.getRandomSpawnGarage();*/

    let posVeh = fraction.getRandomSpawnGarage();

    user.setWaypoint(player, posVeh.x, posVeh.y);
    player.notify('~g~Метка на транспорт была установлена');

    let vehList = ['Emperor', 'Emperor2', 'Oracle', 'Bodhi2', 'Blista2', 'Stratum', 'Primo', 'Minivan', 'Intruder', 'RancherXL'];
    let veh = vehList[methods.getRandomInt(0, vehList.length)];

    if (type === 99)
        veh = 'Baller5';

    vehicles.spawnCarCb(veh => {

        if (!vehicles.exists(veh))
            return;

        try {
            let color = methods.getRandomInt(0, 160);
            if (type === 99)
                color = 0;

            veh.locked = true;
            veh.setColor(color, color);
            veh.windowTint = 1;

            if (type === 0)
                inventory.addItem(262, 1, inventory.types.Vehicle, mp.joaat(vehicles.getNumberPlate(veh)), 1, 0, "{}");
            if (type === 1) {
                inventory.addAmmoItem(280, 5, inventory.types.Vehicle, mp.joaat(vehicles.getNumberPlate(veh)), 1, 0, "{}");
                inventory.addAmmoItem(281, 5, inventory.types.Vehicle, mp.joaat(vehicles.getNumberPlate(veh)), 1, 0, "{}");
                inventory.addAmmoItem(282, 5, inventory.types.Vehicle, mp.joaat(vehicles.getNumberPlate(veh)), 1, 0, "{}");
                inventory.addAmmoItem(283, 5, inventory.types.Vehicle, mp.joaat(vehicles.getNumberPlate(veh)), 1, 0, "{}");
                inventory.addAmmoItem(284, 5, inventory.types.Vehicle, mp.joaat(vehicles.getNumberPlate(veh)), 1, 0, "{}");
            }
            if (type === 2) {
                inventory.addAmmoItem(216, 10, inventory.types.Vehicle, mp.joaat(vehicles.getNumberPlate(veh)), 1, 0, "{}");
                inventory.addAmmoItem(215, 5, inventory.types.Vehicle, mp.joaat(vehicles.getNumberPlate(veh)), 1, 0, "{}");
            }
            if (type === 3) {
                inventory.addAmmoItem(5, 20, inventory.types.Vehicle, mp.joaat(vehicles.getNumberPlate(veh)), 1, 0, "{}");
            }
        }
        catch (e) {
            methods.debug(e);
        }

    }, posVeh, 0, veh);
};

fraction.spawnNearCanabis = function(player) {

    if (!user.isLogin(player))
        return;

    /*let posVeh = fraction.getNearSpawnGarage(player.position);
    if (type === 0 || type === 99)
        posVeh = fraction.getRandomSpawnGarage();*/

    let countZones = canabisWar.getCountZones(user.get(player,'fraction_id2'));
    if (countZones === 0) {
        player.notify('~g~У вас нет захваченых территоирй');
        return;
    }

    let posVeh = fraction.getNearSpawnGarage(player.position);

    user.setWaypoint(player, posVeh.x, posVeh.y);
    player.notify('~g~Метка на транспорт была установлена');

    let vehList = ['Emperor', 'Emperor2', 'Oracle', 'Bodhi2', 'Blista2', 'Stratum', 'Primo', 'Minivan', 'Intruder', 'RancherXL'];
    let veh = vehList[methods.getRandomInt(0, vehList.length)];

    vehicles.spawnCarCb(veh => {

        if (!vehicles.exists(veh))
            return;

        try {
            let color = methods.getRandomInt(0, 160);
            veh.locked = true;
            veh.setColor(color, color);
            veh.windowTint = 1;
            inventory.addItem(3, countZones * 6, inventory.types.Vehicle, mp.joaat(vehicles.getNumberPlate(veh)), 1, 0, "{}");
        }
        catch (e) {
            methods.debug(e);
        }

    }, posVeh, 0, veh);
};

fraction.spawnNearGuns = function(player, type = 0) {

    if (!user.isLogin(player))
        return;

    let posVeh = fraction.getNearSpawnGarage(player.position);
    user.setWaypoint(player, posVeh.x, posVeh.y);
    player.notify('~g~Метка на транспорт была установлена');

    let vehList = ['Emperor', 'Emperor2', 'Oracle', 'Bodhi2', 'Blista2', 'Stratum', 'Primo', 'Minivan', 'Intruder', 'RancherXL'];
    let veh = vehList[methods.getRandomInt(0, vehList.length)];

    vehicles.spawnCarCb(veh => {

        if (!vehicles.exists(veh))
            return;

        try {
            let color = methods.getRandomInt(0, 160);
            veh.locked = true;
            veh.setColor(color, color);
            veh.windowTint = 1;
            if (type === 1) {
                inventory.addItem(280, 2, inventory.types.Vehicle, mp.joaat(vehicles.getNumberPlate(veh)), 1, 0, "{}");
                inventory.addItem(281, 2, inventory.types.Vehicle, mp.joaat(vehicles.getNumberPlate(veh)), 1, 0, "{}");
                inventory.addItem(282, 2, inventory.types.Vehicle, mp.joaat(vehicles.getNumberPlate(veh)), 1, 0, "{}");
                inventory.addItem(283, 2, inventory.types.Vehicle, mp.joaat(vehicles.getNumberPlate(veh)), 1, 0, "{}");
                inventory.addItem(284, 2, inventory.types.Vehicle, mp.joaat(vehicles.getNumberPlate(veh)), 1, 0, "{}");
                inventory.addItem(285, 2, inventory.types.Vehicle, mp.joaat(vehicles.getNumberPlate(veh)), 1, 0, "{}");
            }
            if (type === 2) {
                inventory.addItem(106, 1, inventory.types.Vehicle, mp.joaat(vehicles.getNumberPlate(veh)), 100, 0, "{}");
                inventory.addItem(108, 1, inventory.types.Vehicle, mp.joaat(vehicles.getNumberPlate(veh)), 100, 0, "{}");
                inventory.addItem(110, 1, inventory.types.Vehicle, mp.joaat(vehicles.getNumberPlate(veh)), 100, 0, "{}");
                inventory.addItem(113, 1, inventory.types.Vehicle, mp.joaat(vehicles.getNumberPlate(veh)), 100, 0, "{}");
                inventory.addItem(284, 8, inventory.types.Vehicle, mp.joaat(vehicles.getNumberPlate(veh)), 1, 0, "{}");
            }
            else {
                inventory.addItem(71, 2, inventory.types.Vehicle, mp.joaat(vehicles.getNumberPlate(veh)), 100, 0, "{}");
                inventory.addItem(280, 2, inventory.types.Vehicle, mp.joaat(vehicles.getNumberPlate(veh)), 1, 0, "{}");
            }
        }
        catch (e) {
            methods.debug(e);
        }

    }, posVeh, 0, veh);
};

fraction.createCargoMafiaWar = function() {

    if (isCargoMafia)
        return;

    methods.notifyWithPictureToFractions2('Борьба за груз', `~r~ВНИМАНИЕ!`, 'Началась война за груз, груз отмечен на карте');

    isCargoMafia = true;

    //currentWarPos = [];
    let spawnList = [];
    spawnList.push(methods.getRandomInt(0, fraction.warVehPosGhetto.length));
    //spawnList.push(methods.getRandomInt(0, fraction.warVehPos.length));

    timerMafia = 600;

    spawnList.forEach((item, i) => {
        let posVeh = new mp.Vector3(fraction.warVehPosGhetto[item][0], fraction.warVehPosGhetto[item][1], fraction.warVehPosGhetto[item][2]);

        let b1 = methods.getRandomInt(1000, 20000);
        let b2 = methods.getRandomInt(1000, 20000);
        let b3 = methods.getRandomInt(1000, 20000);
        currentWarPos.push({ type: 1, b1: b1, b2: b2, b3: b3, pos: posVeh, isActive: true });

        mp.players.forEach(p => {
            if (!user.isLogin(p))
                return;
            if (user.get(p, 'fraction_id2') > 0 && user.has(p, 'isCargo') || user.isAdmin(p) || user.isPolice(p)) {
                if (i === 1)
                {
                    user.createBlip(p, b1, posVeh.x, posVeh.y, posVeh.z, 636, 25);

                    user.createBlipByRadius(p, b2, posVeh.x, posVeh.y, posVeh.z, radiusMafia1, 9, 1);
                    user.createBlipByRadius(p, b3, posVeh.x, posVeh.y, posVeh.z, radiusMafia2, 9, 3);
                }
                else if (i === 2)
                {
                    user.createBlip(p, b1, posVeh.x, posVeh.y, posVeh.z, 636, 48);

                    user.createBlipByRadius(p, b2, posVeh.x, posVeh.y, posVeh.z, radiusMafia1, 9, 1);
                    user.createBlipByRadius(p, b3, posVeh.x, posVeh.y, posVeh.z, radiusMafia2, 9, 3);
                }
                else {
                    user.createBlip(p, b1, posVeh.x, posVeh.y, posVeh.z, 636, 10);

                    user.createBlipByRadius(p, b2, posVeh.x, posVeh.y, posVeh.z, radiusMafia1, 9, 1);
                    user.createBlipByRadius(p, b3, posVeh.x, posVeh.y, posVeh.z, radiusMafia2, 9, 3);
                }
            }
        });

        vehicles.spawnCarCb(veh => {

            if (!vehicles.exists(veh))
                return;
            try {
                let color = methods.getRandomInt(0, 150);
                veh.locked = false;
                veh.setColor(color, color);
                let boxes = [50, 50, 50, 50, 50, 50, 50, 50, 51];
                veh.setVariable('box', JSON.stringify(boxes));
                veh.setVariable('cargoId', b1);
                veh.setVariable('isMafia', true);
            }
            catch (e) {
                methods.debug(e);
            }

        }, posVeh, fraction.warVehPosGhetto[item][3], 'Mule4');
    });

    setTimeout(fraction.timerCargoMafiaWar, 1000);
};


fraction.createCargoBigWar = function() {

    if (isCargoBig)
        return;

    methods.notifyWithPictureToFractions2('Борьба за груз', `~r~ВНИМАНИЕ!`, 'Началась война за груз, груз отмечен на карте');

    isCargoBig = true;
    timerBig = 580;

    let posVeh = new mp.Vector3(1040.296875, 2299.896240234375, 44.898162841796875);

    let b1 = methods.getRandomInt(1000, 20000);
    let b2 = methods.getRandomInt(1000, 20000);
    let b3 = methods.getRandomInt(1000, 20000);
    currentWarPos.push({ type: 2, b1: b1, b2: b2, b3: b3, pos: posVeh, isActive: true });

    mp.players.forEach(p => {
        if (!user.isLogin(p))
            return;
        if (user.get(p, 'fraction_id2') > 0 && user.has(p, 'isCargo') || user.isAdmin(p) || user.isPolice(p)) {
            user.createBlip(p, b1, posVeh.x, posVeh.y, posVeh.z, 635, 7);

            user.createBlipByRadius(p, b2, posVeh.x, posVeh.y, posVeh.z, radiusBig1, 9, 1);
            user.createBlipByRadius(p, b3, posVeh.x, posVeh.y, posVeh.z, radiusBig2, 9, 3);
        }
    });

    vehicles.spawnCarCb(veh => {

        if (!vehicles.exists(veh))
            return;
        try {
            veh.locked = false;
            veh.setColor(0, 0);
            let boxes = [53,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50];

            for (let i = 0; i < 30; i++) {
                let rare = 0;
                if (methods.getRandomInt(0, 100) < 40)
                    rare = 1;
                if (methods.getRandomInt(0, 100) < 10)
                    rare = 2;
                let boxRandom = stocks.boxList.filter((item) => { return item[7] === rare; });
                boxes.push(boxRandom[methods.getRandomInt(0, boxRandom.length)][2]);
            }

            if (methods.getRandomInt(0, 100) <= 50)
                boxes.push(methods.getRandomInt(3, 5));
            else
                boxes.push(methods.getRandomInt(38, 40));

            veh.setVariable('box', JSON.stringify(boxes));
            veh.setVariable('cargoId', b1);
        }
        catch (e) {
            methods.debug(e);
        }

    }, posVeh, 90, 'Pounder2');

    setTimeout(fraction.timerCargoBigWar, 1000);
};

fraction.createCargoArmyWar = function() {
    if (isCargoArmy)
        return;
    methods.notifyWithPictureToFractions2('Борьба за груз Армии', `~r~ВНИМАНИЕ!`, 'Началась война за груз армии, груз скоро будет отмечен на карте');
    isCargoArmy = true;
    fraction.spawnCargo("Brickade", [52], 477.1816101074219, -3352.23486328125, 6.417909622192383, 270.78851318359375, 99999, 154);
    fraction.spawnCargo("Brickade", [52], 477.202392578125, -3345.884765625, 6.4177117347717285, 270.76654052734375,  99998, 154);
    setTimeout(fraction.timerCargoArmyWar, 60000);
};

fraction.stopCargoWar = function() {

    isCargo = false;
    timer = 0;

    mp.players.forEach(p => {
        if (!user.isLogin(p))
            return;

        if (user.get(p, 'fraction_id2') > 0 && user.has(p, 'isCargo') || user.isAdmin(p) || user.isPolice(p)) {
            currentWarPos.forEach((item, i) => {

                if (!item.isActive)
                    return;
                if (item.type !== 0)
                    return;

                user.deleteBlip(p, item.b1);
                user.deleteBlipByRadius(p, item.b2);
                user.deleteBlipByRadius(p, item.b3);
            });
        }
    });

    currentWarPos.forEach((item, i) => {

        if (!item.isActive)
            return;
        if (item.type !== 0)
            return;

        currentWarPos[i].isActive = false;
    });
};

fraction.stopCargoMafiaWar = function() {

    isCargoMafia = false;
    timerMafia = 0;

    mp.players.forEach(p => {
        if (!user.isLogin(p))
            return;

        if (user.get(p, 'fraction_id2') > 0 && user.has(p, 'isCargo') || user.isAdmin(p) || user.isPolice(p)) {
            currentWarPos.forEach((item, i) => {

                if (!item.isActive)
                    return;
                if (item.type !== 1)
                    return;
                user.deleteBlip(p, item.b1);
                user.deleteBlipByRadius(p, item.b2);
                user.deleteBlipByRadius(p, item.b3);
            });
        }
    });

    currentWarPos.forEach((item, i) => {

        if (!item.isActive)
            return;
        if (item.type !== 1)
            return;

        currentWarPos[i].isActive = false;
    });
};

fraction.stopCargoBigWar = function() {

    isCargoBig = false;
    timerBig = 0;

    mp.players.forEach(p => {
        if (!user.isLogin(p))
            return;

        if (user.get(p, 'fraction_id2') > 0 && user.has(p, 'isCargo') || user.isAdmin(p) || user.isPolice(p)) {
            currentWarPos.forEach((item, i) => {

                if (!item.isActive)
                    return;
                if (item.type !== 2)
                    return;

                user.deleteBlip(p, item.b1);
                user.deleteBlipByRadius(p, item.b2);
                user.deleteBlipByRadius(p, item.b3);
            });
        }
    });

    currentWarPos.forEach((item, i) => {

        if (!item.isActive)
            return;
        if (item.type !== 2)
            return;

        currentWarPos[i].isActive = false;
    });
};

fraction.stopCargoArmyWar = function() {
    isCargoArmy = false;
    mp.players.forEach(p => {
        if (!user.isLogin(p))
            return;

        if (user.get(p, 'fraction_id2') > 0 && user.has(p, 'isCargo') || user.isAdmin(p) || user.isPolice(p)) {
            user.deleteBlip(p, 99999);
            user.deleteBlip(p, 99998);
        }
    });
};

fraction.timerCargoWar = function() {

    timer--;

    if (timer === 120) {
        mp.players.forEach(p => {
            if (!user.isLogin(p))
                return;

            if (user.get(p, 'fraction_id2') > 0 && user.has(p, 'isCargo') || user.isAdmin(p) || user.isPolice(p)) {
                currentWarPos.forEach((item, i) => {
                    if (!item.isActive || item.type !== 0)
                        return;
                    user.deleteBlipByRadius(p, item.b2);
                });
            }
        });
    }

    if (timer > 120) {
        currentWarPos.forEach(item => {

            if (!item.isActive)
                return;
            if (item.type !== 0)
                return;

            mp.players.forEachInRange(item.pos, radius1, p => {
                if (!user.isLogin(p))
                    return;

                if (p.health > 0) {
                    user.setHealth(p, p.health - 25);
                    if (p.vehicle)
                        user.kickAntiCheat(p, 'Cheat #666');
                }
            });
        });
    }

    currentWarPos.forEach(item => {

        if (!item.isActive)
            return;
        if (item.type !== 0)
            return;

        mp.players.forEachInRange(item.pos, radius2, p => {
            if (!user.isLogin(p))
                return;

            let v = p.vehicle;
            if (vehicles.exists(v)) {
                if (v.getVariable('box') !== null && v.getVariable('box') !== undefined) {
                    //...
                }
                else {
                    user.setMaxSpeed(p, 10)
                }
            }
            else if (user.has(p, 'maxSpeed')) {
                user.setMaxSpeed(p, 0);
                user.reset(p, 'maxSpeed');
            }
        });

        /*mp.vehicles.forEachInRange(item.pos, radius2, v => {
            if (!vehicles.exists(v))
                return;

            if (v.getVariable('box') !== null && v.getVariable('box') !== undefined) {
                //...
            }
            else {
                if (v.getOccupants().length > 0)
                    vehicles.respawn(v);
            }
        });*/
    });

    if (timer < 1) {
        fraction.stopCargoWar();
        return;
    }

    setTimeout(fraction.timerCargoWar, 1000);
};

fraction.timerCargoMafiaWar = function() {

    timerMafia--;

    if (timerMafia === 120) {
        mp.players.forEach(p => {
            if (!user.isLogin(p))
                return;

            if (user.get(p, 'fraction_id2') > 0 && user.has(p, 'isCargo') || user.isAdmin(p) || user.isPolice(p)) {
                currentWarPos.forEach((item, i) => {
                    if (!item.isActive || item.type !== 1)
                        return;
                    user.deleteBlipByRadius(p, item.b2);
                });
            }
        });
    }

    if (timerMafia > 120) {
        currentWarPos.forEach(item => {

            if (!item.isActive)
                return;
            if (item.type !== 1)
                return;

            mp.players.forEachInRange(item.pos, radiusMafia1, p => {
                if (!user.isLogin(p))
                    return;

                if (p.health > 0) {
                    user.setHealth(p, p.health - 25);
                    if (p.vehicle)
                        user.kickAntiCheat(p, 'Cheat #777');
                }
            });
        });
    }

    currentWarPos.forEach(item => {

        if (!item.isActive)
            return;
        if (item.type !== 1)
            return;

        mp.players.forEachInRange(item.pos, radiusMafia2, p => {
            if (!user.isLogin(p))
                return;

            let v = p.vehicle;
            if (vehicles.exists(v)) {
                if (v.getVariable('box') !== null && v.getVariable('box') !== undefined) {
                    //...
                }
                else {
                    user.setMaxSpeed(p, 10)
                }
            }
            else if (user.has(p, 'maxSpeed')) {
                user.setMaxSpeed(p, 0);
                user.reset(p, 'maxSpeed');
            }
        });

        /*mp.vehicles.forEachInRange(item.pos, radiusMafia2, v => {
            if (!vehicles.exists(v))
                return;

            if (v.getVariable('box') !== null && v.getVariable('box') !== undefined) {
                //...
            }
            else {
                if (v.getOccupants().length > 0)
                    vehicles.respawn(v);
            }
        });*/
    });

    if (timerMafia < 1) {
        fraction.stopCargoMafiaWar();
        return;
    }

    setTimeout(fraction.timerCargoMafiaWar, 1000);
};


fraction.timerCargoBigWar = function() {

    timerBig--;

    if (timerBig === 120) {
        mp.players.forEach(p => {
            if (!user.isLogin(p))
                return;

            if (user.get(p, 'fraction_id2') > 0 && user.has(p, 'isCargo') || user.isAdmin(p) || user.isPolice(p)) {
                currentWarPos.forEach((item, i) => {
                    if (!item.isActive || item.type !== 2)
                        return;
                    user.deleteBlipByRadius(p, item.b2);
                });
            }
        });
    }

    if (timerBig > 120) {
        currentWarPos.forEach(item => {

            if (!item.isActive)
                return;
            if (item.type !== 2)
                return;

            mp.players.forEachInRange(item.pos, radiusBig1, p => {
                if (!user.isLogin(p))
                    return;

                if (p.health > 0) {
                    user.setHealth(p, p.health - 25);
                    if (p.vehicle)
                        user.kickAntiCheat(p, 'Cheat #888');
                }
            });
        });
    }

    currentWarPos.forEach(item => {

        if (!item.isActive)
            return;
        if (item.type !== 2)
            return;

        mp.players.forEachInRange(item.pos, radiusBig2, p => {
            if (!user.isLogin(p))
                return;

            let v = p.vehicle;
            if (vehicles.exists(v)) {
                if (v.getVariable('box') !== null && v.getVariable('box') !== undefined) {
                    //...
                }
                else {
                    user.setMaxSpeed(p, 10)
                }
            }
            else if (user.has(p, 'maxSpeed')) {
                user.setMaxSpeed(p, 0);
                user.reset(p, 'maxSpeed');
            }
        });

        /*mp.vehicles.forEachInRange(item.pos, radiusBig2, v => {
            if (!vehicles.exists(v))
                return;

            if (v.getVariable('box') !== null && v.getVariable('box') !== undefined) {
                //...
            }
            else {
                if (v.getOccupants().length > 0)
                    vehicles.respawn(v);
            }
        });*/
    });

    if (timerBig < 1) {
        fraction.stopCargoBigWar();
        return;
    }

    setTimeout(fraction.timerCargoBigWar, 1000);
};

fraction.timerCargoArmyWar = function() {

    let pos1 = null;
    let pos2 = null;

    mp.vehicles.forEach(v => {
        try {
            if (v.dimension === 0 && (v.getVariable('cargoId') === 99999 || v.getVariable('cargoId') === 99998) && !v.dead) {

                if (JSON.parse(v.getVariable('box'))[0] === 52) {
                    if (v.getVariable('cargoId') === 99999)
                        pos1 = v.position;
                    else
                        pos2 = v.position;
                }
            }
        }
        catch (e) {}
    });

    mp.players.forEach(p => {
        try {
            if (!user.isLogin(p))
                return;

            if (user.get(p, 'fraction_id2') > 0 && user.has(p, 'isCargo') || user.isAdmin(p) || user.isPolice(p)) {
                if (pos1)
                    user.createBlip(p, 99999, pos1.x, pos1.y, pos1.z, 636, 52);
                if (pos2)
                    user.createBlip(p, 99998, pos2.x, pos2.y, pos2.z, 636, 52);
            }
        }
        catch (e) {}
    });

    if (!pos1 && !pos2)
        fraction.stopCargoArmyWar();

    if (isCargoArmy)
        setTimeout(fraction.timerCargoArmyWar, 5000);
};

fraction.getShopGang = function(player) {
    if (!user.isLogin(player))
        return;

    let frId = user.get(player, 'fraction_id2');
    if (frId < 1) {
        player.notify('~r~Вы не состоите в организации');
        return;
    }

    if (!fraction.get(frId, 'is_shop')) {
        player.notify('~r~У вас нет улучшения на ограбление магазина');
        return;
    }

    if (fraction.get(frId, 'cantGrab2')) {
        player.notify('~r~Вы уже сегодня совершали ограбление');
        return;
    }

    if (fraction.get(frId, 'cantGrab')) {
        fraction.set(frId, 'cantGrab2', true);
    }

    if (!user.isLeader2(player) && !user.isSubLeader2(player)) {
        player.notify('~r~Начать захват может только лидер или заместитель лидера');
        return;
    }

    if (fraction.get(frId, 'currentGrabShop')) {
        player.notify('~r~Вы брали наводку на магазин недавно');
        return;
    }

    /*if (weather.getHour() < 23 && weather.getHour() > 4) {
        player.notify('~r~Доступно только с 23 до 4 утра IC времени');
        return;
    }*/

    let dateTime = new Date();
    if (dateTime.getHours() < 17) {
        player.notify('~r~Доступно только с 17 до 24 ночи ООС времени');
        return;
    }

    fraction.set(frId, 'cantGrab', true);

    let shopItem = fraction.shopList[methods.getRandomInt(0, fraction.shopList.length)];

    fraction.set(frId, 'currentGrabShop', shopItem);

    mp.players.forEach(p => {
        if (user.isLogin(p) && user.get(p, 'fraction_id2') === frId) {
            shopItem.pos.forEach((pos, i) => {
                user.createBlip(p, i + 1000, pos[0], pos[1], pos[2], 628, 0);
            });
        }
    });

    shopItem.pos.forEach((pos, i) => {
        fraction.set(frId, 'currentGrabShop' + i, false);
    });

    player.notify('~b~Ламар скинул кооринаты на магазин');

    setTimeout(function () {
        try {
            fraction.reset(frId, 'currentGrabShop');
            mp.players.forEach(p => {
                if (user.isLogin(p) && user.get(p, 'fraction_id2') === frId) {
                    shopItem.pos.forEach((pos, i) => {
                        user.deleteBlip(p, i + 1000);
                    });
                }
            });
            shopItem.pos.forEach((pos, i) => {
                fraction.set(frId, 'currentGrabShop' + i, false);
            });
        }
        catch (e) {}

    }, 1000 * 60 * 60)
};

fraction.startGrabShopGang = function(player, itemId = 0) {
    if (!user.isLogin(player))
        return;

    let frId = user.get(player, 'fraction_id2');
    if (frId < 1) {
        player.notify('~r~Вы не состоите в организации');
        return;
    }

    if (!fraction.has(frId, 'currentGrabShop')) {
        player.notify('~r~Необходимо начать задание');
        return;
    }

    let shopItem = fraction.get(frId, 'currentGrabShop');

    shopItem.pos.forEach((pos, i) => {
        if (methods.distanceToPos(new mp.Vector3(pos[0], pos[1], pos[2]), player.position) < 1.5) {

            if (fraction.has(frId, 'currentGrabShopActive' + i)) {
                player.notify('~r~Касса сейчас уже взламывается');
                return;
            }
            if (fraction.get(frId, 'currentGrabShop' + i)) {
                player.notify('~r~Эту кассу уже взламывали');
                return;
            }
            if (player.vehicle) {
                player.notify('~r~Вы в транспорте');
                return;
            }
            let dateTime = new Date();
            if (dateTime.getHours() >= 1 && dateTime.getHours() < 6) {
                player.notify('~r~Время вышло, сейчас невозможно ограбить магазин');

                mp.players.forEach(p => {
                    if (user.isLogin(p) && user.get(p, 'fraction_id2') === frId) {
                        user.deleteBlip(p, i + 1000);
                    }
                });
                return;
            }

            dispatcher.sendLocalPos('Код 0', `Срочно, всем патрулям, происходит ограбление магазина ${shopItem.name}`, player.position, 2);
            dispatcher.sendLocalPos('Код 0', `Срочно, всем патрулям, происходит ограбление магазина ${shopItem.name}`, player.position, 3);
            dispatcher.sendLocalPos('Код 0', `Срочно, всем патрулям, происходит ограбление магазина ${shopItem.name}`, player.position, 4);
            dispatcher.sendLocalPos('Код 0', `Срочно, всем патрулям, происходит ограбление магазина ${shopItem.name}`, player.position, 5);

            player.position = new mp.Vector3(pos[0], pos[1], pos[2]);
            player.heading = pos[3];

            user.playAnimation(player, "missheistfbisetup1", "unlock_loop_janitor", 9);
            user.blockKeys(player, true);

            fraction.set(frId, 'currentGrabShopActive' + i, true);

            setTimeout(function () {

                fraction.reset(frId, 'currentGrabShopActive' + i);
                
                if (!user.isLogin(player))
                    return;

                try {
                    user.blockKeys(player, false);
                    user.stopAnimation(player);

                    if (player.vehicle) {
                        player.notify('~r~Вы в транспорте');
                        return;
                    }
                    if (player.health < 1) {
                        player.notify('~r~Вы в коме, взлом был отменен');
                        return;
                    }
                    if (methods.distanceToPos(new mp.Vector3(pos[0], pos[1], pos[2]), player.position) > 5) {
                        player.notify('~r~Вы слишком далеко');
                        return;
                    }

                    if (methods.getRandomInt(0, 100) < 40) {
                        inventory.addItem(141, 1, inventory.types.Player, user.getId(player), methods.getRandomInt(shopItem.sumMax, shopItem.sumMin), 0, "{}", 2);
                        mp.players.forEach(p => {
                            if (user.isLogin(p) && user.get(p, 'fraction_id2') === frId) {
                                user.deleteBlip(p, i + 1000);
                            }
                        });
                        player.notify('~g~Вы успешно взломали кассу');
                        fraction.set(frId, 'currentGrabShop' + i, true);

                        player.call('client:quest:gang:12');
                    }
                    else {
                        player.notify('~r~Вы сломали отмычку');
                        inventory.deleteItem(itemId);
                    }
                }
                catch (e) {
                    methods.debug(e);
                }
            }, 180000)
        }
    });
};

fraction.save = function(id) {

    return new Promise((resolve) => {
        methods.debug('fraction.save');

        if (!fraction.has(id, "id")) {
            resolve();
            return;
        }

        let sql = "UPDATE fraction_list SET";

        sql = sql + " name = '" + methods.removeQuotes(fraction.get(id, "name")) + "'";
        sql = sql + ", money = '" + methods.parseInt(fraction.get(id, "money")) + "'";
        sql = sql + ", owner_id = '" + methods.parseInt(fraction.get(id, "owner_id")) + "'";
        sql = sql + ", is_bank = '" + methods.parseInt(fraction.get(id, "is_bank")) + "'";
        sql = sql + ", is_shop = '" + methods.parseInt(fraction.get(id, "is_shop")) + "'";
        sql = sql + ", is_war = '" + methods.parseInt(fraction.get(id, "is_war")) + "'";
        sql = sql + ", is_mafia = '" + methods.parseInt(fraction.get(id, "is_mafia")) + "'";
        sql = sql + ", is_kill = '" + methods.parseInt(fraction.get(id, "is_kill")) + "'";
        sql = sql + ", proc_clear = '" + methods.parseInt(fraction.get(id, "proc_clear")) + "'";
        sql = sql + ", spawn_x = '" + methods.parseInt(fraction.get(id, "spawn_x")) + "'";
        sql = sql + ", spawn_y = '" + methods.parseInt(fraction.get(id, "spawn_y")) + "'";
        sql = sql + ", spawn_z = '" + methods.parseInt(fraction.get(id, "spawn_z")) + "'";
        sql = sql + ", spawn_rot = '" + methods.parseInt(fraction.get(id, "spawn_rot")) + "'";
        sql = sql + ", rank_leader = '" + methods.removeQuotes(fraction.get(id, "rank_leader")) + "'";
        sql = sql + ", rank_sub_leader = '" + methods.removeQuotes(fraction.get(id, "rank_sub_leader")) + "'";
        sql = sql + ", rank_list = '" + methods.removeQuotes(fraction.get(id, "rank_list")) + "'";
        sql = sql + ", rank_type_list = '" + methods.removeQuotes(fraction.get(id, "rank_type_list")) + "'";

        sql = sql + " where id = '" + methods.parseInt(fraction.get(id, "id")) + "'";
        mysql.executeQuery(sql, undefined, function () {
            resolve();
        });
    });
};

fraction.getData = function(id) {
    return Container.Data.GetAll(enums.offsets.fraction + methods.parseInt(id));
};

fraction.get = function(id, key) {
    return Container.Data.Get(enums.offsets.fraction + methods.parseInt(id), key);
};

fraction.has = function(id, key) {
    return Container.Data.Has(enums.offsets.fraction + methods.parseInt(id), key);
};

fraction.set = function(id, key, val) {
    Container.Data.Set(enums.offsets.fraction + methods.parseInt(id), key, val);
};

fraction.reset = function(id, key, val) {
    Container.Data.Reset(enums.offsets.fraction + methods.parseInt(id), key, val);
};

fraction.getName = function(id) {
    if (id === 0)
        return 'Государство';
    return fraction.get(id, 'name');
};

fraction.addMoney = function(id, money, name = "Операция со счетом") {
    fraction.addHistory('Система', name, `Зачисление в бюждет: ${methods.cryptoFormat(money)}`, id);
    fraction.setMoney(id, fraction.getMoney(id) + methods.parseFloat(money));
};

fraction.removeMoney = function(id, money, name = "Операция со счетом") {
    fraction.addHistory('Система', name, `Потрачено из бюджета: ${methods.cryptoFormat(money * -1)}`, id);
    fraction.setMoney(id, fraction.getMoney(id) - methods.parseFloat(money));
};

fraction.setMoney = function(id, money) {
    id = methods.parseInt(id);
    Container.Data.Set(enums.offsets.fraction + id, 'money', methods.parseFloat(money));
};

fraction.getMoney = function(id) {
    id = methods.parseInt(id);
    if (Container.Data.Has(enums.offsets.fraction + id, 'money'))
        return methods.parseFloat(Container.Data.Get(enums.offsets.fraction + id, 'money'));
    return 0;
};

fraction.addHistory = function (name, doName, text, fractionId) {
    doName = methods.removeQuotes(doName);
    text = methods.removeQuotes(text);
    name = methods.removeQuotes(name);
    mysql.executeQuery(`INSERT INTO log_fraction_2 (name, text, text2, fraction_id, timestamp, rp_datetime) VALUES ('${name}', '${doName}', '${text}', '${fractionId}', '${methods.getTimeStamp()}', '${weather.getRpDateTime()}')`);
};

fraction.editFractionName = function(player, text) {
    if (!user.isLogin(player))
        return;

    let id = user.get(player, 'fraction_id2');
    fraction.set(id, "name", methods.removeQuotes2(methods.removeQuotes(text)));
    player.notify('~g~Вы сменили название организации');

    fraction.save(id);
};

fraction.editFractionLeader = function(player, text) {
    if (!user.isLogin(player))
        return;

    let id = user.get(player, 'fraction_id2');
    fraction.set(id, "rank_leader", methods.removeQuotes2(methods.removeQuotes(text)));
    player.notify('~g~Вы обновили название ранга');

    fraction.save(id);
};

fraction.editFractionSubLeader = function(player, text) {
    if (!user.isLogin(player))
        return;

    let id = user.get(player, 'fraction_id2');
    fraction.set(id, "rank_sub_leader", methods.removeQuotes2(methods.removeQuotes(text)));
    player.notify('~g~Вы обновили название ранга');

    fraction.save(id);
};

fraction.editFractionRank = function(player, text, rankId, depId) {
    if (!user.isLogin(player))
        return;

    text = methods.removeQuotes2(methods.removeQuotes(text));

    let id = user.get(player, 'fraction_id2');
    let rankList = JSON.parse(fraction.get(id, 'rank_list'));
    rankList[depId][rankId] = text;
    fraction.set(id, "rank_list", JSON.stringify(rankList));

    player.notify('~g~Вы обновили название ранга');

    fraction.save(id);
};

fraction.deleteFractionRank = function(player, rankId, depId) {
    if (!user.isLogin(player))
        return;

    let id = user.get(player, 'fraction_id2');

    let depList = JSON.parse(fraction.get(id, 'rank_type_list'));
    let rankList = JSON.parse(fraction.get(id, 'rank_list'));

    let rank = JSON.parse(fraction.getData(id).get('rank_list'))[depId].length - 1;

    mp.players.forEach(p => {
        if (user.isLogin(p)) {
            if (user.get(p, 'fraction_id2') === id && user.get(p, 'rank_type2') === depId) {

                if (user.get(p, 'rank2') === rankId) {
                    user.set(p, 'rank2', rank - 1);
                }
                if (user.get(p, 'rank2') > rankId) {
                    user.set(p, 'rank2', user.get(p, 'rank2') - 1);
                }
            }
        }
    });

    mysql.executeQuery(`UPDATE users SET rank_type2 = rank2 - 1 where fraction_id2 = '${id}' AND rank_type2 = '${depId}' AND rank2 > '${rank}'`);
    mysql.executeQuery(`UPDATE users SET rank2 = '${rank - 1}' where fraction_id2 = '${id}' AND rank_type2 = '${depId}' AND rank2 = '${rank}'`);

    let newRankList = [];
    let newRankListLocal = [];

    rankList[depId].forEach((item, idx) => {
        if (idx === rankId)
            return;
        newRankListLocal.push(rankList[depId][idx]);
    });

    depList.forEach((item, idx) => {
        if (idx === depId)
            newRankList.push(newRankListLocal);
        else
            newRankList.push(rankList[idx]);
    });

    fraction.set(id, "rank_list", JSON.stringify(newRankList));

    player.notify('~g~Вы удалили должность');

    fraction.save(id);
};

fraction.editFractionDep = function(player, text, depId) {
    if (!user.isLogin(player))
        return;

    text = methods.removeQuotes2(methods.removeQuotes(text));

    let id = user.get(player, 'fraction_id2');
    let depList = JSON.parse(fraction.get(id, 'rank_type_list'));
    depList[depId] = text;
    fraction.set(id, "rank_type_list", JSON.stringify(depList));

    player.notify('~g~Вы обновили название раздела');

    fraction.save(id);
};

fraction.deleteFractionDep = function(player, depId) {
    if (!user.isLogin(player))
        return;

    let id = user.get(player, 'fraction_id2');

    let depList = JSON.parse(fraction.get(id, 'rank_type_list'));
    let rankList = JSON.parse(fraction.get(id, 'rank_list'));

    let rank = JSON.parse(fraction.getData(id).get('rank_list'))[0].length - 1;

    mp.players.forEach(p => {
        if (user.isLogin(p)) {
            if (user.get(p, 'fraction_id2') === id) {

                if (user.get(p, 'rank_type2') === depId) {
                    user.set(p, 'rank2', rank);
                    user.set(p, 'rank_type2', 0);
                }
                if (user.get(p, 'rank_type2') > depId) {
                    user.set(p, 'rank_type2', user.get(p, 'rank_type2') - 1);
                }
            }
        }
    });

    mysql.executeQuery(`UPDATE users SET rank2 = '${rank}', rank_type2 = '0' where fraction_id2 = '${id}' AND rank_type2 = '${depId}'`);
    mysql.executeQuery(`UPDATE users SET rank_type2 = rank_type2 - 1 where fraction_id2 = '${id}' AND rank_type2 > '${depId}'`);

    let newDepList = [];
    let newRankList = [];
    depList.forEach((item, idx) => {
        if (idx === depId)
            return;
        newDepList.push(item);
        newRankList.push(rankList[idx]);
    });

    fraction.set(id, "rank_type_list", JSON.stringify(newDepList));
    fraction.set(id, "rank_list", JSON.stringify(newRankList));

    player.notify('~g~Вы удалили раздел');

    fraction.save(id);
};

fraction.addFractionRank = function(player, text, depId) {
    if (!user.isLogin(player))
        return;

    text = methods.removeQuotes2(methods.removeQuotes(text));

    let id = user.get(player, 'fraction_id2');
    let rankList = JSON.parse(fraction.get(id, 'rank_list'));
    rankList[depId].push(text);
    fraction.set(id, "rank_list", JSON.stringify(rankList));

    player.notify('~g~Вы добавили должность');

    fraction.save(id);
};

fraction.editFractionDep = function(player, text, depId) {
    if (!user.isLogin(player))
        return;

    text = methods.removeQuotes2(methods.removeQuotes(text));

    let id = user.get(player, 'fraction_id2');
    let depList = JSON.parse(fraction.get(id, 'rank_type_list'));
    depList[depId] = text;
    fraction.set(id, "rank_type_list", JSON.stringify(depList));

    player.notify('~g~Вы обновили название раздела');

    fraction.save(id);
};

fraction.createFractionDep = function(player, text) {
    if (!user.isLogin(player))
        return;

    let id = user.get(player, 'fraction_id2');

    text = methods.removeQuotes2(methods.removeQuotes(text));

    let depList = JSON.parse(fraction.get(id, 'rank_type_list'));
    depList.push(text);

    let rankList = JSON.parse(fraction.get(id, 'rank_list'));
    rankList.push(["Глава отдела", "Зам. главы отдела"]);

    fraction.set(id, "rank_type_list", JSON.stringify(depList));
    fraction.set(id, "rank_list", JSON.stringify(rankList));

    player.notify('~g~Вы сменили добавили новый раздел');

    fraction.save(id);
};

fraction.updateOwnerInfo = function (id, userId) {
    methods.debug('fraction.updateOwnerInfo');
    id = methods.parseInt(id);
    userId = methods.parseInt(userId);

    fraction.set(id, "owner_id", userId);

    if (userId == 0) {
        fraction.set(id, "rank_leader", 'Лидер');
        fraction.set(id, "rank_sub_leader", 'Заместитель');
        fraction.set(id, "rank_type_list", '["Основной состав"]');
        fraction.set(id, "rank_list", '[["Глава отдела", "Зам. главы отдела", "Соучастник"]]');
    }
    else
        mysql.executeQuery("UPDATE fraction_list SET owner_id = '" + userId + "' where id = '" + id + "'");

    fraction.save(id);
};

fraction.create = function (player, id) {
    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    methods.debug('fraction.create');

    if (user.get(player, 'fraction_id2') > 0) {
        player.notify('~r~Вы уже состоите в организации');
        return;
    }
    if (fraction.get(id, 'owner_id') > 0) {
        player.notify('~r~У организации уже есть владелец');
        return;
    }
    if (user.getCryptoMoney(player) < 500) {
        player.notify('~r~У Вас не достаточно валюты BitCoin для создания организации');
        return;
    }

    user.set(player, 'fraction_id2', id);
    user.set(player, 'is_leader2', true);

    fraction.setMoney(id, 500);
    fraction.addHistory(user.getRpName(player), 'Создал организацию', '', id);
    fraction.updateOwnerInfo(id, user.getId(player));
    fraction.set(id, "name", 'Группировка');
    user.removeCryptoMoney(player, 500, 'Создание организации');

    setTimeout(function () {
        if (!user.isLogin(player))
            return;
        user.save(player);
        fraction.save(id);
        player.notify('~g~Поздравляем с созданием организации');
    }, 500);
};

fraction.destroy = function (player, id) {
    if (!user.isLogin(player))
        return;

    id = methods.parseInt(id);
    methods.debug('fraction.destroy');

    if (!user.isLeader2(player)) {
        player.notify('~r~Эта организация вам не приналдежит');
        return;
    }


    user.set(player, 'fraction_id2', 0);
    user.set(player, 'is_leader2', false);

    fraction.destroyJust(id);
};

fraction.destroyJust = function (id) {
    id = methods.parseInt(id);
    methods.debug('fraction.destroy');

    fraction.set(id, "name", 'Слот свободен');
    fraction.set(id, "money", 0);
    if (!fraction.get(id, 'is_war') && !fraction.get(id, 'is_mafia'))
        fraction.set(id, "owner_id", 0);
    fraction.set(id, "is_bank", false);
    fraction.set(id, "is_shop", false);
    /*fraction.set(id, "is_war", false);
    fraction.set(id, "is_mafia", false);*/
    fraction.set(id, "is_kill", false);
    fraction.set(id, "rank_leader", 'Лидер');
    fraction.set(id, "rank_sub_leader", 'Заместитель');
    fraction.set(id, "rank_type_list", '["Основной состав"]');
    fraction.set(id, "rank_list", '[["Глава отдела", "Зам. главы отдела", "Соучастник"]]');

    fraction.updateOwnerInfo(id, 0);
    fraction.save(id);

    mysql.executeQuery("UPDATE users SET fraction_id2 = '" + 0 + "' where fraction_id2 = '" + id + "'");
    mp.players.forEach(p => {
        if (!user.isLogin(p))
            return;

        if (user.get(p, 'fraction_id2') == id) {
            user.set(p, 'fraction_id2', 0);
            user.set(p, 'is_leader2', false);
            p.notify('~y~Организация была расфомирована');
        }
    });
};

