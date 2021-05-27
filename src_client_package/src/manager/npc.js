import methods from '../modules/methods';
import timer from '../manager/timer';

import checkpoint from "./checkpoint";
import quest from "./quest";

import user from "../user";
import enums from "../enums";
import shopMenu from "../shopMenu";

let npc = {};

let _npcList = [];
let _loadDist = 100;

npc.loadAll = function() {

    try {
        let npcList = Object.entries(quest.getQuestAll());
        if (npcList.length > 0) {
            for (const [key, item] of npcList) {
                npc.create(mp.game.joaat(item.skin), item.pos, item.skinRot, false, item.anim);
            }
        }
    }
    catch (e) {
        methods.debug('npc.loadAll', e);
    }
    checkpoint.addMarker(-1288.153, -561.6686, 33.21216, 2, 0.5, 0.5);

    /*//Quest BotSpawn Role0
    npc.create(mp.game.joaat("s_m_y_dockwork_01"), new mp.Vector3(-415.9264831542969, -2645.4287109375, 6.000219345092773), 316.27508544921875, false, "WORLD_HUMAN_CLIPBOARD");
    //Quest BotSpawn All
    npc.create(mp.game.joaat("a_f_y_business_02"), new mp.Vector3(-1380.45458984375, -527.6905517578125, 30.6591854095459), 277.5157775878906, false, "WORLD_HUMAN_CLIPBOARD");
//Quest Gang
    npc.create(mp.game.joaat("ig_lamardavis"), new mp.Vector3(-218.75608825683594, -1368.4576416015625, 31.25823402404785), 43.398406982421875, false, "WORLD_HUMAN_SMOKING");

*/
    // Полицейский на ресепшане Misson Row
    npc.create(mp.game.joaat("s_m_m_prisguard_01"), new mp.Vector3(1746.4307861328125, 2502.748046875, 45.56498336791992), 350.29193115234375, false, "WORLD_HUMAN_TOURIST_MOBILE");

    // Полицейский на ресепшане Misson Row
    npc.create(mp.game.joaat("s_m_y_cop_01"), new mp.Vector3(441.0511, -978.8251, 30.68959), 179.4316, false, "WORLD_HUMAN_CLIPBOARD");
// Полицейский на ресепшане Vespucci
    npc.create(mp.game.joaat("s_f_y_cop_01"), new mp.Vector3(-1097.457, -839.9836, 19.00159), 122.9423, false, "CODE_HUMAN_MEDIC_TIME_OF_DEATH");
// Помошник шерифа на ресепшане Sandy Shores
    npc.create(mp.game.joaat("s_m_y_sheriff_01"), new mp.Vector3(1853.438, 3689.164, 34.26706), -145.6209, false, "WORLD_HUMAN_CLIPBOARD");
// Помошник шерифа на ресепшане Paleto Bay
    npc.create(mp.game.joaat("s_f_y_sheriff_01"), new mp.Vector3(-448.6529, 6012.937, 31.71638), -45.47421, false, "CODE_HUMAN_MEDIC_TIME_OF_DEATH");

// Respawn Vagos
    npc.create(mp.game.joaat("ig_ortega"), new mp.Vector3(434.621, -2039.659, 23.44744), -32.99991, false, "WORLD_HUMAN_GUARD_STAND");
    npc.create(mp.game.joaat("g_f_y_vagos_01"), new mp.Vector3(431.3778, -2033.259, 23.26118), 11.99974, false, "WORLD_HUMAN_PROSTITUTE_HIGH_CLASS");
    npc.create(mp.game.joaat("a_f_y_eastsa_03"), new mp.Vector3(430.7873, -2032.742, 23.24662), -119.9994, false, "WORLD_HUMAN_DRUG_DEALER");
    npc.create(mp.game.joaat("g_m_y_mexgoon_01"), new mp.Vector3(415.6351, -2055.993, 22.12321), 142.9995, false, "WORLD_HUMAN_SMOKING");

// Respawn Bloods
    npc.create(mp.game.joaat("ig_claypain"), new mp.Vector3(814.4373, -2398.871, 23.65801), -178.9996, false, "WORLD_HUMAN_SMOKING");
    npc.create(mp.game.joaat("a_f_y_soucent_01"), new mp.Vector3(815.4818, -2413.801, 23.69544), 37.00063, false, "WORLD_HUMAN_TOURIST_MOBILE");
    npc.create(mp.game.joaat("a_m_y_soucent_03"), new mp.Vector3(815.3779, -2412.904, 23.68834), 170.9996, false, "WORLD_HUMAN_DRINKING");
    npc.create(mp.game.joaat("a_m_m_afriamer_01"), new mp.Vector3(819.4771, -2438.8, 24.5403), 159.9992, false, "WORLD_HUMAN_GUARD_STAND");

// Respawn Families
    npc.create(mp.game.joaat("g_m_y_famca_01"), new mp.Vector3(-12.11057, -1827.143, 25.47756), 151.9985, false, "WORLD_HUMAN_GUARD_STAND");
    npc.create(mp.game.joaat("g_m_y_famdnf_01"), new mp.Vector3(2.439152, -1822.602, 25.35294), -177.999, false, "WORLD_HUMAN_TOURIST_MOBILE");
    npc.create(mp.game.joaat("g_f_y_families_01"), new mp.Vector3(1.891586, -1823.411, 25.35294), -74.99979, false, "CODE_HUMAN_CROSS_ROAD_WAIT");
    npc.create(mp.game.joaat("g_m_y_famfor_01"), new mp.Vector3(7.32425, -1814.006, 25.35294), -49.99983, false, "WORLD_HUMAN_SMOKING");

    // Respawn Ballas
    npc.create(mp.game.joaat("g_m_y_ballaorig_01"), new mp.Vector3(-187.5397, -1699.698, 32.98515), -52.08002, false, "WORLD_HUMAN_SMOKING");
    npc.create(mp.game.joaat("g_f_y_ballas_01"), new mp.Vector3(-206.9577, -1730.258, 32.66415), -119.9989, false, "WORLD_HUMAN_PROSTITUTE_HIGH_CLASS");
    npc.create(mp.game.joaat("g_m_y_ballaeast_01"), new mp.Vector3(-206.268, -1731.074, 32.66415), 15.00124, false, "WORLD_HUMAN_DRINKING");
    npc.create(mp.game.joaat("g_m_y_ballasout_01"), new mp.Vector3(-210.8185, -1728.631, 32.66721), 143.9996, false, "WORLD_HUMAN_GUARD_STAND");

// Respawn Marabunta
    npc.create(mp.game.joaat("g_m_y_salvagoon_03"), new mp.Vector3(1333.642, -1643.404, 52.15042), -30.99972, false, "WORLD_HUMAN_GUARD_STAND");
    npc.create(mp.game.joaat("g_m_y_salvagoon_02"), new mp.Vector3(1325.727, -1639.303, 52.15056), -84.99963, false, "WORLD_HUMAN_TOURIST_MOBILE");
    npc.create(mp.game.joaat("g_m_y_salvaboss_01"), new mp.Vector3(1326.823, -1638.513, 52.15056), 126.9999, false, "WORLD_HUMAN_DRUG_DEALER");
    npc.create(mp.game.joaat("g_m_y_salvagoon_01"), new mp.Vector3(1321.559, -1663.887, 51.23642), 133.9994, false, "WORLD_HUMAN_SMOKING");

    // Секретарша в City Hall
    npc.create(mp.game.joaat("a_f_y_business_01"), new mp.Vector3(-1291.811, -572.3674, 30.57272), -40.99984, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Охранник слева в City Hall
    npc.create(mp.game.joaat("s_m_m_highsec_01"), new mp.Vector3(-1295.207, -573.5434, 30.57015), 137.9987, false, "WORLD_HUMAN_GUARD_STAND", '', '', 9, 0, '', '');
// Охранник справа в City Hall
    npc.create(mp.game.joaat("s_m_m_highsec_02"), new mp.Vector3(-1291.8, -565.9213, 30.57479), -132.9988, false, "WORLD_HUMAN_GUARD_STAND", '', '', 9, 0, '', '');

    //Больница PillBox
    npc.create(mp.game.joaat("s_f_y_scrubs_01"), new mp.Vector3(309.55218505859375, -593.9552612304688, 43.28400802612305), 21.91470, false, "WORLD_HUMAN_STAND_IMPATIENT");
    //Больница Sandy
    npc.create(mp.game.joaat("s_f_y_scrubs_01"), new mp.Vector3(1838.4437255859375, 3682.33544921875, 34.27005386352539), 162.76380920410156, false, "WORLD_HUMAN_STAND_IMPATIENT");
    //Больница Paleto
    npc.create(mp.game.joaat("s_f_y_scrubs_01"), new mp.Vector3(-246.97201538085938, 6320.427734375, 32.420734405517578), 312.1958923339844, false, "WORLD_HUMAN_STAND_IMPATIENT");
    //USMC
    npc.create(mp.game.joaat("s_m_y_marine_03"), new mp.Vector3(486.37030029296875, -3027.28515625, 6.014427661895752), 275.48919677734375, false, "WORLD_HUMAN_CLIPBOARD");

    //Сдача железа
    npc.create(mp.game.joaat("s_m_y_dockwork_01"), new mp.Vector3(1074.1737060546875, -2009.465576171875, 32.08498764038086), 53.97209548950195, false, "WORLD_HUMAN_CLIPBOARD");
    //Сдача одежды
    npc.create(mp.game.joaat("u_m_m_doa_01"), new mp.Vector3(706.1729125976562, -966.6583251953125, 30.412853240966797), 298.7783508300781, false, "WORLD_HUMAN_CLIPBOARD");
    //Мейз Банк Арена
    npc.create(mp.game.joaat("csb_bryony"), new mp.Vector3(-251.922, -2001.531, 30.14596), 178.7984, false, "CODE_HUMAN_MEDIC_TIME_OF_DEATH");
//Автобазар
    npc.create(mp.game.joaat("u_m_y_ushi"), new mp.Vector3(-1654.792236328125, -948.4613037109375, 7.716407775878906), 323.9862365722656, false, "WORLD_HUMAN_CLIPBOARD");
// 24/7 - Гора Чиллиад - Шоссе Сенора
    npc.create(mp.game.joaat("s_f_y_sweatshop_01"), new mp.Vector3(1728.476, 6416.668, 35.03724), -109.9557, false, "WORLD_HUMAN_STAND_IMPATIENT");
// LTD Gasoline - Грейпсид - Грейпсид-Пейн-стрит
    npc.create(mp.game.joaat("mp_m_shopkeep_01"), new mp.Vector3(1698.477, 4922.482, 42.06366), -32.02934, false, "WORLD_HUMAN_STAND_IMPATIENT");
// 24/7 - Сэнди Шорс - Нинланд-авеню
    npc.create(mp.game.joaat("s_f_y_sweatshop_01"), new mp.Vector3(1959.179, 3741.332, 32.34376), -51.81022, false, "WORLD_HUMAN_STAND_IMPATIENT");
// 24/7 - Хармони - Шоссе 68
    npc.create(mp.game.joaat("mp_m_shopkeep_01"), new mp.Vector3(549.306, 2669.898, 42.15651), 102.036, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Rob's Liquor - Пустыня Гранд-Сенора - Шоссе 68
    npc.create(mp.game.joaat("s_f_y_sweatshop_01"), new mp.Vector3(1165.198, 2710.855, 38.15769), -169.9903, false, "WORLD_HUMAN_STAND_IMPATIENT");
// 24/7 - Пустыня Гранд-Сенора - Шоссе Сенора
    npc.create(mp.game.joaat("mp_m_shopkeep_01"), new mp.Vector3(2676.561, 3280.001, 55.24115), -20.5138, false, "WORLD_HUMAN_STAND_IMPATIENT");
// 24/7 - Чумаш - Барбарено-роуд
    npc.create(mp.game.joaat("s_f_y_sweatshop_01"), new mp.Vector3(-3243.886, 999.9983, 12.83071), -0.1504957, false, "WORLD_HUMAN_STAND_IMPATIENT");
// 24/7 - Каньон Бэнхэм - Инесено-роуд
    npc.create(mp.game.joaat("mp_m_shopkeep_01"), new mp.Vector3(-3040.344, 584.0048, 7.908932), 25.86866, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Rob's Liquor - Каньон Бэнхэм - Шоссе Грейт-Оушн
    npc.create(mp.game.joaat("s_f_y_sweatshop_01"), new mp.Vector3(-2966.275, 391.6495, 15.04331), 90.95544, false, "WORLD_HUMAN_STAND_IMPATIENT");
// LTD Gasoline - Ричман-Глен - Бэнхэм-Кэньон-драйв
    npc.create(mp.game.joaat("mp_m_shopkeep_01"), new mp.Vector3(-1820.364, 794.7905, 138.0867), 136.5701, false, "WORLD_HUMAN_STAND_IMPATIENT");
// 24/7 - Центр Вайнвуда - Клинтон-авеню
    npc.create(mp.game.joaat("s_f_y_sweatshop_01"), new mp.Vector3(372.8323, 327.9543, 103.5664), -93.31544, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Rob's Liquor - Морнингвуд - Просперити-стрит
    npc.create(mp.game.joaat("mp_m_shopkeep_01"), new mp.Vector3(-1486.615, -377.3467, 40.16341), 135.9596, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Rob's Liquor - Каналы Веспуччи - Сан-Андреас-авеню
    npc.create(mp.game.joaat("s_f_y_sweatshop_01"), new mp.Vector3(-1221.311, -907.9825, 12.32635), 44.03139, false, "WORLD_HUMAN_STAND_IMPATIENT");
// LTD Gasoline - Маленький Сеул - Паломино-авеню
    npc.create(mp.game.joaat("mp_m_shopkeep_01"), new mp.Vector3(-706.0112, -912.8375, 19.2156), 93.35769, false, "WORLD_HUMAN_STAND_IMPATIENT");
// LTD Gasoline - Миррор-Парк - Вест-Миррор-драйв
    npc.create(mp.game.joaat("s_f_y_sweatshop_01"), new mp.Vector3(1164.863, -322.054, 69.2051), 109.3829, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Rob's Liquor - Мурьета-Хайтс - Бульвар Эль-Ранчо
    npc.create(mp.game.joaat("mp_m_shopkeep_01"), new mp.Vector3(1134.109, -983.1777, 46.41582), -74.49993, false, "WORLD_HUMAN_STAND_IMPATIENT");
// 24/7 - Строберри - Бульвар Инносенс
    npc.create(mp.game.joaat("s_f_y_sweatshop_01"), new mp.Vector3(24.17295, -1345.768, 29.49703), -79.8604, false, "WORLD_HUMAN_STAND_IMPATIENT");//
// LTD Gasoline - Дэвис - Дэвис-авеню
    npc.create(mp.game.joaat("mp_m_shopkeep_01"), new mp.Vector3(-46.25561, -1757.611, 29.42101), 55.09486, false, "WORLD_HUMAN_STAND_IMPATIENT");
// 24/7 - Татавиамские горы - Шоссе Паломино
    npc.create(mp.game.joaat("s_f_y_sweatshop_01"), new mp.Vector3(2555.677, 380.6046, 108.623), 1.572431, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Digital Den - Маленький Сеул - Паломино-авеню
    npc.create(mp.game.joaat("g_m_y_korean_01"), new mp.Vector3(-656.9416, -858.7859, 24.49001), 2.746706, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Digital Den - Миррор-Парк - Бульвар Миррор-Парк
    npc.create(mp.game.joaat("a_m_y_hipster_01"), new mp.Vector3(1132.687, -474.5676, 66.7187), 345.9362, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Family Pharmacy - Мишн-Роу - Фантастик-плейс
    npc.create(mp.game.joaat("a_f_m_business_02"), new mp.Vector3(317.9639, -1078.319, 29.47855), 359.3141, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Dollars Pills - Альта - Альта-стрит
    npc.create(mp.game.joaat("a_f_y_business_04"), new mp.Vector3(92.31831, -231.1054, 54.66363), 327.2379, false, "WORLD_HUMAN_STAND_IMPATIENT");
// D.P. Pharmacy - Текстайл-Сити - Строберри-авеню
    npc.create(mp.game.joaat("a_f_y_business_03"), new mp.Vector3(299.7478, -733.0994, 29.3525), 255.0316, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Больница - Аптека - Палето-Бей - Бульвар Палето
    npc.create(mp.game.joaat("a_f_y_business_02"), new mp.Vector3(-253.79364013671875, 6336.76953125, 32.426055908203125), 215.51046752929688, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Рыболовный магазин
    npc.create(mp.game.joaat("s_m_m_ammucountry"), new mp.Vector3(-1598.123046875, 5200.99609375, 4.3873372077941895), 68.22468566894531, false, "WORLD_HUMAN_GUARD_STAND");
// Магазин охоты
    npc.create(mp.game.joaat("s_m_m_ammucountry"), new mp.Vector3(-674.044677734375, 5837.830078125, 17.34016227722168), 118.35307312011719, false, "WORLD_HUMAN_GUARD_STAND");
// Ammu-Nation - Татавиамские горы - Шоссе Паломино
    npc.create(mp.game.joaat("s_m_m_ammucountry"), new mp.Vector3(2567.45, 292.3297, 108.7349), 0.9863386, false, "WORLD_HUMAN_GUARD_STAND");
// Ammu-Nation - Чумаш - Барбарено-роуд
    npc.create(mp.game.joaat("s_m_m_ammucountry"), new mp.Vector3(-3173.501, 1088.957, 20.83874), -106.5671, false, "WORLD_HUMAN_GUARD_STAND");
// Ammu-Nation - Река Занкудо - Шоссе 68
    npc.create(mp.game.joaat("s_m_m_ammucountry"), new mp.Vector3(-1118.609, 2700.271, 18.55414), -135.1759, false, "WORLD_HUMAN_GUARD_STAND");
// Ammu-Nation - Сэнди-Шорс - Бульвар Алгонквин
    npc.create(mp.game.joaat("s_m_m_ammucountry"), new mp.Vector3(1692.413, 3761.51, 34.70534), -126.9435, false, "WORLD_HUMAN_GUARD_STAND");
// Ammu-Nation - Палето-Бэй - Шоссе Грейт-Оушн
    npc.create(mp.game.joaat("s_m_m_ammucountry"), new mp.Vector3(-331.3555, 6085.712, 31.45477), -133.1493, false, "WORLD_HUMAN_GUARD_STAND");
// Ammu-Nation - Пиллбокс-Хилл - Элгин-Авеню
    npc.create(mp.game.joaat("s_m_m_ammucountry"), new mp.Vector3(23.1827, -1105.512, 29.79702), 158.1179, false, "WORLD_HUMAN_GUARD_STAND");
// Ammu-Nation - Хавик - Спэниш-авеню
    npc.create(mp.game.joaat("s_m_m_ammucountry"), new mp.Vector3(253.8001, -51.07007, 69.9411), 71.83827, false, "WORLD_HUMAN_GUARD_STAND");
// Ammu-Nation - Ла-Меса - Шоссе Олимпик
    npc.create(mp.game.joaat("s_m_m_ammucountry"), new mp.Vector3(841.848, -1035.449, 28.19485), -1.228782, false, "WORLD_HUMAN_GUARD_STAND");
// Ammu-Nation - Маленький Сеул - Паломино-авеню
    npc.create(mp.game.joaat("s_m_m_ammucountry"), new mp.Vector3(-661.7558, -933.2841, 21.82923), -178.1721, false, "WORLD_HUMAN_GUARD_STAND");
// Ammu-Nation - Морнингвуд - Бульвар Морнингвуд
    npc.create(mp.game.joaat("s_m_m_ammucountry"), new mp.Vector3(-1303.956, -395.2117, 36.69579), 75.62228, false, "WORLD_HUMAN_GUARD_STAND");
// Ammu-Nation - Сайпрес-Флэтс - Попьюлар-стрит
    npc.create(mp.game.joaat("s_m_m_ammucountry"), new mp.Vector3(809.6276, -2159.31, 29.61901), -2.014809, false, "WORLD_HUMAN_GUARD_STAND");
// Blazing Tattoo - Центр Вайнвуда - Бульвар Ванйвуд
    npc.create(mp.game.joaat("u_m_y_tattoo_01"), new mp.Vector3(319.8327, 181.0894, 103.5865), -106.512, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Alamo Tattoo Studio - Сэнди-Шорс - Занкудо-авеню
    npc.create(mp.game.joaat("u_m_y_tattoo_01"), new mp.Vector3(1862.807, 3748.279, 33.03187), 40.61253, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Paleto Tattoo - Палето-Бэй - Дулуоз-авеню
    npc.create(mp.game.joaat("u_m_y_tattoo_01"), new mp.Vector3(-292.3047, 6199.946, 31.48711), -117.6071, false, "WORLD_HUMAN_STAND_IMPATIENT");
// The Pit - Каналы Веспуччи - Агуха-стрит
    npc.create(mp.game.joaat("u_m_y_tattoo_01"), new mp.Vector3(-1151.971, -1423.695, 4.954463), 136.3183, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Los Santos Tattoos - Эль-Бурро-Хайтс - Бульвар Инносенс
    npc.create(mp.game.joaat("u_m_y_tattoo_01"), new mp.Vector3(1324.483, -1650.021, 52.27503), 144.9793, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Ink Inc - Чумаш - Барбарено-роуд
    npc.create(mp.game.joaat("u_m_y_tattoo_01"), new mp.Vector3(-3170.404, 1072.786, 20.82917), -6.981083, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Herr Kutz Barber - Дэвис - Карсон-авеню
    npc.create(mp.game.joaat("s_f_m_fembarber"), new mp.Vector3(134.8694, -1708.296, 29.29161), 151.6018, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Herr Kutz Barber - Миррор-Парк - Бульвар Миррор-Парк
    npc.create(mp.game.joaat("s_f_m_fembarber"), new mp.Vector3(1211.27, -471.0499, 66.20805), 82.84951, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Herr Kutz Barber - Палето-Бэй - Дулуоз-авеню
    npc.create(mp.game.joaat("s_f_m_fembarber"), new mp.Vector3(-278.3121, 6230.216, 31.69552), 60.1603, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Beach Combover Barber - Веспуччи - Магеллан-авеню
    npc.create(mp.game.joaat("s_f_m_fembarber"), new mp.Vector3(-1284.274, -1115.853, 6.99013), 99.18153, false, "WORLD_HUMAN_STAND_IMPATIENT");
// O'Sheas Barbers Shop - Сэнди-Шорс - Альгамбра-драйв
    npc.create(mp.game.joaat("s_f_m_fembarber"), new mp.Vector3(1931.232, 3728.298, 32.84444), -144.9153, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Hair on Hawick - Хавик - Хавик-авеню
    npc.create(mp.game.joaat("s_f_m_fembarber"), new mp.Vector3(-31.19347, -151.4883, 57.07652), -7.542643, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Bob Mulet - Рокфорд-Хиллз - Мэд-Уэйн-Тандер-драйв
    npc.create(mp.game.joaat("s_f_m_fembarber"), new mp.Vector3(-822.4669, -183.7317, 37.56892), -139.7869, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Binco - Каналы Веспуччи - Паломино-авеню
    npc.create(mp.game.joaat("a_f_y_hipster_02"), new mp.Vector3(-823.3749, -1072.378, 11.32811), -108.4307, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Binco - Текстайл-Сити - Синнерс-пэссейдж
    npc.create(mp.game.joaat("a_m_y_hipster_02"), new mp.Vector3(427.0797, -806.0226, 29.49113), 130.6033, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Discount Store - Палето-Бэй - Бульвар Палето
    npc.create(mp.game.joaat("a_f_y_hipster_02"), new mp.Vector3(6.133633, 6511.472, 31.87784), 82.75452, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Discount Store - Грейпсид - Грейпсид-Мэйн-стрит
    npc.create(mp.game.joaat("a_m_y_hipster_02"), new mp.Vector3(1695.472, 4823.236, 42.0631), 125.9657, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Discount Store - Пустыня Гранд-Сенора - Шоссе 68
    npc.create(mp.game.joaat("a_f_y_hipster_02"), new mp.Vector3(1196.317, 2711.907, 38.22262), -145.9363, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Discount Store - Река Занкудо - Шоссе 68
    npc.create(mp.game.joaat("a_m_y_hipster_02"), new mp.Vector3(-1102.664, 2711.66, 19.10786), -103.8504, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Discount Store - Строберри - Бульвар Инносентс
    npc.create(mp.game.joaat("a_f_y_hipster_02"), new mp.Vector3(73.73582, -1392.895, 29.37614), -68.70364, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Sub Urban - Хармони - Шоссе 68
    npc.create(mp.game.joaat("s_f_y_shop_mid"), new mp.Vector3(612.8171, 2761.852, 42.08812), -63.55088, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Sub Urban - Дель-Перро - Норт-Рокфорд-драйв
    npc.create(mp.game.joaat("a_m_y_hipster_01"), new mp.Vector3(-1194.562, -767.3227, 17.31602), -120.527, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Sub Urban - Чумаш - Шоссе Грейт-Оушн
    npc.create(mp.game.joaat("s_f_y_shop_mid"), new mp.Vector3(-3168.905, 1043.997, 20.86322), 80.39653, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Sub Urban - Альта - Хавик-авеню
    npc.create(mp.game.joaat("a_m_y_hipster_01"), new mp.Vector3(127.306, -223.5369, 54.55785), 101.7699, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Ponsonbys - Бертон - Бульвар Лас-Лагунас
    npc.create(mp.game.joaat("a_f_y_business_01"), new mp.Vector3(-164.6587, -302.2024, 39.7333), -90.87177, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Ponsonbys - Рокфорд-Хиллз - Портола-драйв
    npc.create(mp.game.joaat("a_m_y_business_01"), new mp.Vector3(-708.5155, -152.5676, 37.41148), 133.2013, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Ponsonbys - Морнингвуд - Кугар-авеню
    npc.create(mp.game.joaat("a_f_y_business_01"), new mp.Vector3(-1449.5, -238.6422, 49.81335), 60.38498, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Vangelico - Рокфорд-Хиллз - Рокфорд-драйв
    npc.create(mp.game.joaat("u_f_y_jewelass_01"), new mp.Vector3(-623.1789, -229.2665, 38.05703), 48.75668, false, "WORLD_HUMAN_STAND_IMPATIENT");
    npc.create(mp.game.joaat("ig_jewelass"), new mp.Vector3(-620.9707, -232.295, 38.05703), -134.2347, false, "WORLD_HUMAN_STAND_IMPATIENT");
    npc.create(mp.game.joaat("u_m_m_jewelsec_01"), new mp.Vector3(-628.8972, -238.8752, 38.05712), -49.34913, false, "WORLD_HUMAN_GUARD_STAND");
// Vespucci Movie Masks - Веспуччи-бич - Витус-стрит
    npc.create(mp.game.joaat("s_m_y_shop_mask"), new mp.Vector3(-1334.673, -1276.343, 4.963552), 142.5475, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Beekers Garage - Палето-Бэй - Бульвар Палето
    npc.create(mp.game.joaat("s_m_m_autoshop_02"), new mp.Vector3(106.3625, 6628.315, 31.78724), -108.3491, false, "WORLD_HUMAN_CLIPBOARD");
// Los Santos Customs Senora - Пустыня-Гранд-Сенора - Шоссе 68
    npc.create(mp.game.joaat("s_m_m_autoshop_01"), new mp.Vector3(1178.711, 2639.02, 37.7538), 64.71403, false, "WORLD_HUMAN_CLIPBOARD");
// Los Santos Customs Burton - Бертон - Карсер-вэй
    npc.create(mp.game.joaat("s_m_m_autoshop_02"), new mp.Vector3(-345.0504, -129.6553, 39.00965), -149.6841, false, "WORLD_HUMAN_CLIPBOARD");
// Los Santos Customs La Mesa - Ла-Меса - Шоссе-Олимпик
    npc.create(mp.game.joaat("s_m_m_autoshop_01"), new mp.Vector3(737.2117, -1083.939, 22.16883), 97.4564, false, "WORLD_HUMAN_CLIPBOARD");
// Hayes Autos - Строберри - Литл-Бигхорн-авеню
    npc.create(mp.game.joaat("s_m_m_autoshop_02"), new mp.Vector3(471.7564, -1310.021, 29.22494), -128.6412, false, "WORLD_HUMAN_CLIPBOARD");
// Bennys Original Motor Works - Строберри - Альта-стрит
    npc.create(mp.game.joaat("ig_benny"), new mp.Vector3(-216.5449, -1320.012, 30.89039), -97.54453, false, "WORLD_HUMAN_CLIPBOARD");
// Los Santos Customs LSIA - Международный аэропорт Лос-Сантос - Гринвич-Парквэй
    npc.create(mp.game.joaat("s_m_m_autoshop_01"), new mp.Vector3(-1145.874, -2003.389, 13.18026), 94.71597, false, "WORLD_HUMAN_CLIPBOARD");
// Bike rent - Елизиан Айланд - Нью-Эмпайр-вэй
    npc.create(mp.game.joaat("a_f_y_skater_01"), new mp.Vector3(-394.2759, -2670.96, 6.000217), 79.09959, false, "WORLD_HUMAN_SMOKING");
// Bike rent - Строберри - Элгин-авеню
    npc.create(mp.game.joaat("a_m_m_skater_01"), new mp.Vector3(102.7933, -1388.645, 29.29153), -7.799984, false, "WORLD_HUMAN_SMOKING");
// Bike rent - Центр Вайнвуда - Бульвар Ванйвуд
    npc.create(mp.game.joaat("a_m_y_skater_01"), new mp.Vector3(180.926, 180.4024, 105.5414), -14.19996, false, "WORLD_HUMAN_CLIPBOARD");
// Bike rent - Дель-Перро - Магеллан-авеню
    npc.create(mp.game.joaat("a_m_y_skater_01"), new mp.Vector3(-1262.949, -607.0857, 27.16493), -126.8111, false, "WORLD_HUMAN_AA_COFFEE");
// Bike rent - Чумаш - Барбарено-роуд
    npc.create(mp.game.joaat("a_m_m_skater_01"), new mp.Vector3(-3155.155, 1099.27, 20.85335), -101.9993, false, "CODE_HUMAN_MEDIC_TIME_OF_DEATH");
// Bike rent - Палето-Бэй - Бульвар Палето
    npc.create(mp.game.joaat("a_m_y_skater_01"), new mp.Vector3(-232.3245, 6320.706, 31.48291), -128.9995, false, "WORLD_HUMAN_CLIPBOARD");
// Bike rent - Грейпсид - Грейпсид-Мэйн-стрит
    npc.create(mp.game.joaat("a_f_y_skater_01"), new mp.Vector3(1679.077, 4861.357, 42.06063), 117.3989, false, "CODE_HUMAN_MEDIC_TIME_OF_DEATH");
// Bike rent - Сэнди-Шорс - Альгамбра-драйв
    npc.create(mp.game.joaat("a_m_m_skater_01"), new mp.Vector3(1806.736, 3676.029, 34.27676), -39.58422, false, "WORLD_HUMAN_SMOKING");
// Bike rent - Болингброк - Шоссе 68
    npc.create(mp.game.joaat("a_m_y_skater_01"), new mp.Vector3(1852.597, 2594.885, 45.67204), -80.29984, false, "WORLD_HUMAN_AA_COFFEE");
// Bike rent - Текстайл-Сити - Элгин-авеню
    npc.create(mp.game.joaat("a_f_y_skater_01"), new mp.Vector3(297.7727, -607.1932, 43.37174), 88.88361, false, "CODE_HUMAN_MEDIC_TIME_OF_DEATH");
// Bike rent - Миррор-Парк - Никола-авеню
    npc.create(mp.game.joaat("a_m_m_skater_01"), new mp.Vector3(1153.488, -454.4688, 66.98437), 170.2867, false, "WORLD_HUMAN_AA_COFFEE");
// Bike rent - Пиллбокс-Хилл - Бульвар Веспуччи
    npc.create(mp.game.joaat("a_m_y_skater_01"), new mp.Vector3(-71.90009, -636.4031, 36.26555), 75.59978, false, "WORLD_HUMAN_AA_COFFEE");
// Bike rent - Маленький Сеул - Декер-стрит
    npc.create(mp.game.joaat("a_f_y_skater_01"), new mp.Vector3(-673.8143, -854.3931, 24.16787), 15.29996, false, "WORLD_HUMAN_AA_COFFEE");
// Bike rent - Рокфорд-Хиллз - Южный бульвар Дель-Перро
    npc.create(mp.game.joaat("a_m_m_skater_01"), new mp.Vector3(-734.7107, -229.2012, 37.25011), -146.5325, false, "CODE_HUMAN_MEDIC_TIME_OF_DEATH");
// Bike rent - Ла-Пуэрта - Гома-стрит
    npc.create(mp.game.joaat("a_m_y_skater_01"), new mp.Vector3(-1086.856, -1345.369, 5.071685), -145.5996, false, "WORLD_HUMAN_SMOKING");
// Bike rent - Хармони - Сенора-роуд
    npc.create(mp.game.joaat("a_f_y_skater_01"), new mp.Vector3(609.6804, 2745.572, 41.98055), -155.9992, false, "WORLD_HUMAN_SMOKING");
// Bike rent - Мишн-Роу - Алти-стрит
    npc.create(mp.game.joaat("a_f_y_skater_01"), new mp.Vector3(388.1663, -981.5941, 29.42357), -75.40633, false, "CODE_HUMAN_MEDIC_TIME_OF_DEATH");
// Boat rent - Ла-Пуэрта - Шэнк-стрит
    //npc.create(mp.game.joaat("a_m_y_runner_01"), new mp.Vector3(-790.4313, -1453.044, 1.596039), -38.84312, false, "WORLD_HUMAN_AA_COFFEE ");
// Boat rent - Бухта Палето - Шоссе Грейт-Оушн
    //npc.create(mp.game.joaat("a_f_y_runner_01"), new mp.Vector3(-1603.928, 5251.08, 3.974748), 108.5822, false, "WORLD_HUMAN_SMOKING");
// Boat rent - Сан-Шаньский горный хребет - Кэтфиш-Вью
    //npc.create(mp.game.joaat("a_m_y_runner_01"), new mp.Vector3(3867.177, 4463.583, 2.727666), 73.1316, false, "WORLD_HUMAN_CLIPBOARD");
// Bike Rent - Calafia Bridge
    npc.create(mp.game.joaat("a_f_y_hippie_01"), new mp.Vector3(-206.4295, 4227.988, 44.86481), -168.9843, false, "WORLD_HUMAN_SMOKING");
// Bike Rent - East Elysian Islands
    npc.create(mp.game.joaat("mp_m_exarmy_01"), new mp.Vector3(644.5712, -3009.586, 6.22769), -2.310211, false, "WORLD_HUMAN_SMOKING");
// Bike Rent - El Burro Heists
    npc.create(mp.game.joaat("g_m_y_mexgoon_02"), new mp.Vector3(1136.107, -1484.797, 34.84342), -65.9995, false, "WORLD_HUMAN_AA_COFFEE ");
// Bike Rent - Great Chaparral
    npc.create(mp.game.joaat("a_m_m_farmer_01"), new mp.Vector3(-1088.656, 2716.905, 19.07619), -131.9994, false, "CODE_HUMAN_MEDIC_TIME_OF_DEATH");
// Bike Rent - Maze Bank Arena
    npc.create(mp.game.joaat("a_m_y_eastsa_02"), new mp.Vector3(-248.7172, -2057.083, 27.75543), -56.26459, false, "WORLD_HUMAN_AA_COFFEE");
// Bike Rent - Mount Chiliad
    npc.create(mp.game.joaat("a_m_y_dhill_01"), new mp.Vector3(462.4398, 5581.525, 781.1671), 6.832367, false, "WORLD_HUMAN_CLIPBOARD");
// Bike Rent - Mount Gordo
    npc.create(mp.game.joaat("u_m_y_hippie_01"), new mp.Vector3(1579.635, 6456.885, 25.31715), 72.05165, false, "WORLD_HUMAN_SMOKING");
// Bike Rent - North Chumash
    npc.create(mp.game.joaat("a_m_m_salton_04"), new mp.Vector3(-2508.011, 3622.828, 13.60635), -136.1273, false, "WORLD_HUMAN_CLIPBOARD");
// Bike Rent - Paleto Forest
    npc.create(mp.game.joaat("a_m_y_skater_02"), new mp.Vector3(-777.0889, 5593.67, 33.63668), -115.9992, false, "WORLD_HUMAN_AA_COFFEE");
// Bike Rent - Rancho
    npc.create(mp.game.joaat("g_f_importexport_01"), new mp.Vector3(186.2505, -2028.593, 18.27061), 163.7489, false, "CODE_HUMAN_MEDIC_TIME_OF_DEATH");
// Bike Rent - Tataviam Mountains
    npc.create(mp.game.joaat("a_m_y_vinewood_03"), new mp.Vector3(2560.841, 393.5162, 108.6209), -72.99976, false, "WORLD_HUMAN_CLIPBOARD");
// Bike Rent - Vinewood Racetrack
    npc.create(mp.game.joaat("a_f_y_skater_01"), new mp.Vector3(964.2814, 122.494, 80.99068), -20.63669, false, "CODE_HUMAN_MEDIC_TIME_OF_DEATH");
// Fleeca - Морнингвуд
    npc.create(mp.game.joaat("a_m_y_busicas_01"), new mp.Vector3(-1211.917, -332.0083, 37.78095), 32.20013, false, "WORLD_HUMAN_STAND_IMPATIENT");
    npc.create(mp.game.joaat("a_f_y_business_01"), new mp.Vector3(-1213.227, -332.6803, 37.7809), 29.04985, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Fleeca - Чумаш
    npc.create(mp.game.joaat("a_m_m_business_01"), new mp.Vector3(-2960.983, 482.9597, 15.69701), 87.49982, false, "WORLD_HUMAN_STAND_IMPATIENT");
    npc.create(mp.game.joaat("a_m_y_business_01"), new mp.Vector3(-2961.076, 481.3979, 15.69694), 94.43291, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Fleeca - Бертон
    npc.create(mp.game.joaat("a_f_m_business_02"), new mp.Vector3(-352.7554, -50.81618, 49.03643), -11.61766, false, "WORLD_HUMAN_STAND_IMPATIENT");
    npc.create(mp.game.joaat("a_f_y_business_02"), new mp.Vector3(-351.3324, -51.37263, 49.0365), 0.9843516, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Fleeca - Хевик
    npc.create(mp.game.joaat("a_m_y_business_02"), new mp.Vector3(313.8501, -280.4764, 54.16471), -13.8998, false, "WORLD_HUMAN_STAND_IMPATIENT");
    npc.create(mp.game.joaat("a_f_y_business_03"), new mp.Vector3(312.3756, -279.9246, 54.16464), -15.29996, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Fleeca - Пиллбокс-Хилл
    npc.create(mp.game.joaat("a_m_y_business_03"), new mp.Vector3(149.4378, -1042.182, 29.368), -16.53926, false, "WORLD_HUMAN_STAND_IMPATIENT");
    npc.create(mp.game.joaat("a_f_y_business_04"), new mp.Vector3(148.0451, -1041.64, 29.36793), -10.84452, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Fleeca - Гранд-Сенора
    npc.create(mp.game.joaat("a_m_y_busicas_01"), new mp.Vector3(1174.833, 2708.267, 38.08796), -176.1989, false, "WORLD_HUMAN_STAND_IMPATIENT");
    npc.create(mp.game.joaat("a_m_m_business_01"), new mp.Vector3(1176.375, 2708.216, 38.08791), -174.8994, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Blaine Bank - Палето-Бэй
    npc.create(mp.game.joaat("a_f_y_business_01"), new mp.Vector3(-112.1626, 6471.107, 31.62671), 143.5989, false, "WORLD_HUMAN_STAND_IMPATIENT");
    npc.create(mp.game.joaat("a_m_y_business_01"), new mp.Vector3(-111.1555, 6470.048, 31.62671), 134.9988, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Pacific Standart - Центральный Вайнвуда
    npc.create(mp.game.joaat("a_f_m_business_02"), new mp.Vector3(241.9019, 226.8564, 106.2871), 172.1895, false, "WORLD_HUMAN_STAND_IMPATIENT");
    npc.create(mp.game.joaat("a_m_y_business_02"), new mp.Vector3(243.6673, 226.2376, 106.2876), 170.999, false, "WORLD_HUMAN_STAND_IMPATIENT");
    npc.create(mp.game.joaat("a_f_y_business_02"), new mp.Vector3(247.008, 225.0361, 106.2875), 175.9993, false, "WORLD_HUMAN_STAND_IMPATIENT");
    npc.create(mp.game.joaat("a_f_y_business_03"), new mp.Vector3(248.8495, 224.2853, 106.2871), 173.9992, false, "WORLD_HUMAN_STAND_IMPATIENT");
    npc.create(mp.game.joaat("a_f_y_business_04"), new mp.Vector3(252.2165, 223.1031, 106.2868), 169.3982, false, "WORLD_HUMAN_STAND_IMPATIENT");
    npc.create(mp.game.joaat("a_f_y_business_01"), new mp.Vector3(254.011, 222.395, 106.2868), 172.9996, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Maze Bank
    npc.create(mp.game.joaat("a_f_y_business_04"), new mp.Vector3(-72.27431, -814.5317, 243.3859), 162.9991, false, "WORLD_HUMAN_STAND_IMPATIENT");
// Работодатель на Садовнике
    npc.create(mp.game.joaat("s_m_m_gardener_01"), new mp.Vector3(-1585.051, -234.8312, 54.33006), 43.62775, false, "WORLD_HUMAN_CLIPBOARD");
// Работодатель на Строителе
   // npc.create(mp.game.joaat("s_m_y_construct_02"), new mp.Vector3(-1159.267, -739.1121, 19.88993), -171.2985, false, "WORLD_HUMAN_CLIPBOARD");
// Работодатель на Фотографе LifeInvader
    npc.create(mp.game.joaat("a_m_m_prolhost_01"), new mp.Vector3(-1083.9874267578125, -246.1114044189453, 37.763267517089844), 198.80426025390625, false, "WORLD_HUMAN_CLIPBOARD");
// Работодатель на Почте GoPostal
    npc.create(mp.game.joaat("s_m_m_janitor"), new mp.Vector3(136.4377, 92.83617, 83.5126), 40.21272, false, "WORLD_HUMAN_CLIPBOARD");
// Работодатель на Автобусной станции
    npc.create(mp.game.joaat("ig_jimmyboston"), new mp.Vector3(454.2171, -596.1467, 28.53182), -36.12801, false, "WORLD_HUMAN_CLIPBOARD");
// Работодатель на Инкассаторе
    npc.create(mp.game.joaat("ig_casey"), new mp.Vector3(3.112391, -660.4219, 33.4508), -49.89936, false, "WORLD_HUMAN_CLIPBOARD");
// Полицейский на выдаче оружия Mission-Row
    npc.create(mp.game.joaat("s_m_y_cop_01"), new mp.Vector3(454.2837829589844, -980.0394287109375, 30.689321517944336), 89.98814392089844, false, "WORLD_HUMAN_CLIPBOARD");
// Шериф на выдаче оружия Sandy Shores
    npc.create(mp.game.joaat("s_m_y_sheriff_01"), new mp.Vector3(1844.3907470703125, 3692.18701171875, 34.26704788208008), 284.88543701171875, false, "WORLD_HUMAN_CLIPBOARD");
// Шериф на выдаче оружия Paleto Bay
    npc.create(mp.game.joaat("csb_cop"), new mp.Vector3(-436.1072998046875, 5999.68603515625, 31.716081619262695), 33.66008377075195, false, "WORLD_HUMAN_CLIPBOARD");
//Церковь
    npc.create(mp.game.joaat("ig_priest"), new mp.Vector3(-787.1298828125, -708.8898315429688, 30.32028579711914), 265.47149658203125, false, "WORLD_HUMAN_GUARD_STAND");

    // Штрафстоянки
    npc.create(mp.game.joaat("s_m_m_security_01"), new mp.Vector3(392.0566, -1637.983, 29.29352), -83.97862, false, "WORLD_HUMAN_CLIPBOARD"); // Davis
    npc.create(mp.game.joaat("s_m_m_security_01"), new mp.Vector3(846.9775, -1319.681, 26.40563), -33.86766, false, "WORLD_HUMAN_CLIPBOARD"); // La Mesa
    npc.create(mp.game.joaat("s_m_m_security_01"), new mp.Vector3(482.4717, -1093.66, 29.40167), 136.061, false, "WORLD_HUMAN_CLIPBOARD"); // Mission Row
    npc.create(mp.game.joaat("s_m_m_security_01"), new mp.Vector3(-1129.329, -772.9122, 18.24211), 5.332124, false, "WORLD_HUMAN_CLIPBOARD"); // Del Perro
    npc.create(mp.game.joaat("s_m_m_security_01"), new mp.Vector3(1943.638, 3764.589, 32.21295), 55.02224, false, "WORLD_HUMAN_CLIPBOARD"); // Sandy Shores
    npc.create(mp.game.joaat("s_m_m_security_01"), new mp.Vector3(-291.2821, 6137.66, 31.47069), -147.1063, false, "WORLD_HUMAN_CLIPBOARD"); // Paleto Bay
    npc.create(mp.game.joaat("s_m_m_security_01"), new mp.Vector3(492.1434, -58.6371, 78.11255), 64.83295, false, "WORLD_HUMAN_CLIPBOARD"); // Vinewood
    npc.create(mp.game.joaat("s_m_m_security_01"), new mp.Vector3(-180.3634, -2557.411, 6.013849), -37.53494, false, "WORLD_HUMAN_CLIPBOARD"); // Vans
    npc.create(mp.game.joaat("s_m_m_security_01"), new mp.Vector3(-457.9996, -2268.136, 8.516481), -69.62789, false, "WORLD_HUMAN_CLIPBOARD"); // Boat
    npc.create(mp.game.joaat("s_m_m_security_01"), new mp.Vector3(-1856.256, -3119.711, 13.94436), 156.0192, false, "WORLD_HUMAN_CLIPBOARD"); // Helicopters
    npc.create(mp.game.joaat("s_m_m_security_01"), new mp.Vector3(-1071.75, -3457.185, 14.14418), -150.9734, false, "WORLD_HUMAN_CLIPBOARD"); // Plane

    //Island 24/7
    npc.create(mp.game.joaat("mp_m_shopkeep_01"), new mp.Vector3(5030.078125, -5736.40625, 17.86558723449707), 56.664554595947266, 0);

    //Island Mask
    npc.create(mp.game.joaat("a_m_y_hipster_01"), new mp.Vector3(5080.4921875, -5754.88427734375, 15.829647064208984), 230.79171752929688, 0);

    //Island Cloth
    npc.create(mp.game.joaat("a_m_y_hipster_02"), new mp.Vector3(5006.0595703125, -5786.671875, 17.831689834594727), 267.9640808105469, 0);

    //Island
    npc.create(mp.game.joaat("g_m_m_cartelguards_01"), new mp.Vector3(5067.16845703125, -5779.23193359375, 16.277233123779297), 135.2989044189453, -1, '', 'amb@world_human_leaning@male@wall@back@foot_up@idle_b', 'idle_d', 9);
    npc.create(mp.game.joaat("g_m_m_cartelguards_02"), new mp.Vector3(5042.38720703125, -5791.75537109375, 17.47629165649414), 211.3693084716797, 0, '', 'anim@amb@business@bgen@bgen_no_work@', 'stand_phone_phoneputdown_idle_nowork', 9, 0);
    npc.create(mp.game.joaat("g_m_m_cartelguards_01"), new mp.Vector3(4991.701171875, -5714.61083984375, 19.88020896911621), 218.4535369873047, 0, '', 'rcmme_amanda1', 'stand_loop_cop', 9, 0);
    npc.create(mp.game.joaat("g_m_m_cartelguards_02"), new mp.Vector3(4984.28271484375, -5708.33154296875, 19.88694190979004), 47.818546295166016, 0, '', 'missfbi4mcs_2', 'loop_sec_b', 9, 0);
    npc.create(mp.game.joaat("g_m_m_cartelguards_01"), new mp.Vector3(4973.08447265625, -5762.38671875, 20.87825584411621), 251.14370727539062, 0, '', 'amb@world_human_leaning@male@wall@back@legs_crossed@idle_a', 'idle_a', 9, 0);
    npc.create(mp.game.joaat("g_m_m_cartelguards_02"), new mp.Vector3(4964.71044921875, -5785.697265625, 20.877727508544922), 244.8719940185547, 0, '', 'amb@world_human_leaning@male@wall@back@foot_up@idle_b', 'idle_d', 9, 0);
    npc.create(mp.game.joaat("g_m_m_cartelguards_01"), new mp.Vector3(4993.03271484375, -5757.26953125, 15.893156051635742), 138.25697326660156, 0, '', 'missfbi4mcs_2', 'loop_sec_b', 9, 0);
    npc.create(mp.game.joaat("g_m_m_cartelguards_02"), new mp.Vector3(5005.9658203125, -5733.02099609375, 15.840614318847656), 297.55267333984375, 0, '', 'missfbi4mcs_2', 'loop_sec_b', 9, 0);
    npc.create(mp.game.joaat("g_m_m_cartelguards_01"), new mp.Vector3(5002.04150390625, -5752.07958984375, 28.68232536315918), 61.704280853271484, 0, '', 'rcmme_amanda1', 'stand_loop_cop', 9, 0);
    npc.create(mp.game.joaat("g_m_m_cartelguards_02"), new mp.Vector3(4976.9638671875, -5607.8916015625, 23.770776748657227), 336.3785705566406, 0, '', 'missfbi4mcs_2', 'loop_sec_b', 9, 0);
    npc.create(mp.game.joaat("g_m_m_cartelguards_01"), new mp.Vector3(4971.1962890625, -5600.3017578125, 23.69247817993164), 237.45590209960938, 0, '', 'anim@amb@business@bgen@bgen_no_work@', 'stand_phone_phoneputdown_idle_nowork', 9, 0);
    npc.create(mp.game.joaat("g_m_m_cartelguards_02"), new mp.Vector3(5135.5537109375, -4948.22607421875, 14.762690544128418), 323.735107421875, 0, '', 'rcmme_amanda1', 'stand_loop_cop', 9, 0);
    npc.create(mp.game.joaat("g_m_m_cartelguards_01"), new mp.Vector3(5154.53955078125, -4946.18017578125, 14.155532836914062), 136.00308227539062, 0, '', 'anim@amb@business@bgen@bgen_no_work@', 'stand_phone_phoneputdown_idle_nowork', 9, 0);
    npc.create(mp.game.joaat("s_f_y_clubbar_02"), new mp.Vector3(5014.1689453125, -5755.82666015625, 28.900148391723633), 58.45914077758789, 0, '', 'anim@amb@business@bgen@bgen_no_work@', 'stand_phone_phoneputdown_idle_nowork', 9);

    //Island Fabric
    npc.create(mp.game.joaat("s_m_y_dockwork_01"), new mp.Vector3(5064.33837890625, -4590.23681640625, 2.856423854827881), 164.00926208496094, 0, '', 'anim@amb@business@bgen@bgen_no_work@', 'stand_phone_phoneputdown_idle_nowork', 9, 0);
    npc.create(mp.game.joaat("u_m_m_doa_01"), new mp.Vector3(5067.25048828125, -4591.36474609375, 2.856661319732666), 158.07778930664062, 0, '', 'amb@world_human_leaning@male@wall@back@legs_crossed@idle_a', 'idle_a', 9, 0);

    //Island Работа грузчика
    npc.create(mp.game.joaat("g_m_y_strpunk_02"), new mp.Vector3(5106.8076171875, -5162.783203125, 2.05600905418396), 353.6639404296875, 0, 'WORLD_HUMAN_CLIPBOARD');
    //Island Работа садовника
    npc.create(mp.game.joaat("s_m_m_gaffer_01"), new mp.Vector3(5399.09619140625, -5172.28369140625, 31.35650634765625), 160.55970764160156, 0, 'WORLD_HUMAN_CLIPBOARD');


    timer.createInterval('npc.timer', npc.timer, 2500);
    timer.createInterval('npc.timer500', npc.timer500, 500);
};

npc.timer = function() {
    //return;
    let playerPos = mp.players.local.position;

    _npcList.forEach(async function(item) {

        let dist = methods.distanceToPos(playerPos, item.pos);

        if (dist < _loadDist && !item.isCreate) {

            try {
                if (mp.game.streaming.hasModelLoaded(item.model)) {
                    item.ped = mp.peds.new(item.model, item.pos, item.heading, methods.parseInt(item.dim));
                    item.handle = item.ped.handle;
                    item.isCreate = true;

                    //if (item.dim > 0) {
                        item.ped.setRandomComponentVariation(true);
                        item.ped.setRandomProps();
                    //}

                    if (item.scenario != "")
                        mp.game.invoke(methods.TASK_START_SCENARIO_IN_PLACE, item.handle, item.scenario, 0, true);

                    if (item.animation1 != "") {

                        mp.game.streaming.requestAnimDict(item.animation1);
                        if (!mp.game.streaming.hasAnimDictLoaded(item.animation1)) {
                            mp.game.streaming.requestAnimDict(item.animation1);
                            while (!mp.game.streaming.hasAnimDictLoaded(item.animation1))
                                await methods.sleep(10);
                        }
                        item.ped.taskPlayAnim(item.animation1, item.animation2, 8, -8, -1, item.flag, 0.0, false, false, false);

                        /*mp.game.streaming.requestAnimDict(item.animation1);
                        setTimeout(function () {
                            if (mp.game.streaming.hasAnimDictLoaded(item.animation1))
                                mp.game.invoke(methods.TASK_PLAY_ANIM, item.handle, item.animation1, item.animation2, 9, -8, -1, item.flag, 0, false, false, false);
                        }, 5000);*/
                    }
                }
                else if(item.didRequest !== true) {
                    item.didRequest = true;
                    mp.game.streaming.requestModel(item.model);
                }
            }
            catch (e) {
                methods.debug('CreatePed', e);
            }
        }
        else if (dist > _loadDist + 50 && item.isCreate) {
            try {
                methods.debug('DELETE', item);
                try {
                    if (mp.peds.exists(item.ped))
                        item.ped.destroy();
                    item.ped = null;
                    item.handle = 0;
                    item.isCreate = false;
                }
                catch (e) {
                    methods.debug(e);
                }

                try {
                    if(item.didRequest === true) {
                        item.didRequest = false;
                        mp.game.streaming.setModelAsNoLongerNeeded(item.model);
                    }
                }
                catch (e) {
                    methods.debug(e);
                }
            }
            catch (e) {
                methods.debug('DeletePed', e);
            }
        }
    });
};

npc.timer500 = function() {

    try {
        let playerPos = mp.players.local.position;

        _npcList.forEach(async function(item) {

            try {
                if (item.speechRadius < 1) return;
                let dist = methods.distanceToPos(playerPos, item.pos);

                if (dist <= item.speechRadius && item.isCreate && !item.isSpeech) {
                    if (item.speech1 != "")
                        mp.game.audio.playAmbientSpeechWithVoice(item.handle, item.speech1, '', 'SPEECH_PARAMS_FORCE_SHOUTED', false);
                    //mp.game.invoke(methods.PLAY_AMBIENT_SPEECH1, item.handle, item.speech1, 'SPEECH_PARAMS_FORCE');
                    item.isSpeech = true;
                }
                else if (dist > item.speechRadius && item.isCreate && item.isSpeech) {
                    if (item.speech2 != "")
                        mp.game.audio.playAmbientSpeechWithVoice(item.handle, item.speech2, '', 'SPEECH_PARAMS_FORCE_SHOUTED', false);
                    //mp.game.invoke(methods.PLAY_AMBIENT_SPEECH1, item.handle, item.speech2, 'SPEECH_PARAMS_FORCE');
                    item.isSpeech = false;
                }
            }
            catch (e) {
                methods.debug(e);
            }
        });
    }
    catch (e) {
        methods.debug(e);
    }
};

npc.create = function(model, pos, heading, dim = 0, scenario = "", animation1 = "", animation2 = "", flag = 9, speechRadius = 5, speech1 = 'GENERIC_HI', speech2 = 'GENERIC_BYE') {

    if (typeof model == "string")
        model = mp.game.joaat(model);

    _npcList.push({model: model, pos: pos, heading: heading, ped: null, dim: dim, scenario: scenario, animation1: animation1, animation2: animation2, flag: flag, speechRadius: speechRadius, speech1: speech1, speech2: speech2, isSpeech: false, isCreate: false, handle: 0});
};

npc.createPedLocallyNative = function(model, pos, heading) {
    try {
        if (mp.game.streaming.isModelValid(model)) {
            mp.game.streaming.requestModel(model);
            if (mp.game.streaming.hasModelLoaded(model))
                return mp.game.ped.createPed(26, model, pos.x, pos.y, pos.z, heading, false, false);
        }
    }
    catch (e) {
        methods.debug(e);
    }
    return 0;
};

npc.createPedLocally = async function(model, pos, heading) {
    if (mp.game.streaming.isModelValid(model))
    {
        mp.game.streaming.requestModel(model);
        while (!mp.game.streaming.hasModelLoaded(model))
            await methods.sleep(10);
        return mp.peds.new(model, pos, heading, -1);
    }
    return null;
};


npc.getDialog = function(pos, rot, name, subtitle, question, btn = []) {
    btn.push(
        {
            text: 'Закрыть',
            bgcolor: 'rgba(244,67,54,0.7)',
            params: {doName: 'close'}
        }
    );
    shopMenu.showDialog(pos, rot);
    shopMenu.updateDialog(btn, name, subtitle, question)
};

npc.showDialogStandart = function(question, btn = []) {
    npc.getDialog(new mp.Vector3(-1288.153, -561.6686, 31.71216 + 0.6), -46.52558, 'Сюзанна', 'Сотрудник правительства', question, btn)
};

npc.showDialogStandartIsland = function(question, btn = []) {
    npc.getDialog(new mp.Vector3(5002.990234375, -5752.30419921875, 19.880247116088867 + 0.6),  147.77825927734375, 'Сюзанна', 'Сотрудник правительства', question, btn)
};

npc.showDialogLamar = function(question, btn = []) {
    npc.getDialog(new mp.Vector3(-218.75608825683594, -1368.4576416015625, 31.25823402404785 + 0.6), 43.398406982421875, 'Ламар', 'Друг', question, btn)
};

npc.showDialogJail = function(question, btn = []) {
    npc.getDialog(new mp.Vector3(1746.4307861328125, 2502.748046875, 45.56498336791992 + 0.6), 350.29193115234375, 'Джейк', 'Сотрудник тюрьмы', question, btn)
};

npc.showDialogYpd = function(question, btn = []) {
    npc.getDialog(new mp.Vector3(3198.975341796875, -4833.72998046875, 111.81517791748047 + 0.6), 263.87719726562, 'Риксон', 'Сотрудник YPD', question, btn)
};

npc.showDialogInvader = function(question, btn = []) {
    npc.getDialog(new mp.Vector3(-1083.9874267578125, -246.1114044189453, 37.763267517089844 + 0.6), 198.80426025390625, 'Секретарь', 'Сотрудник InvaderNews', question, btn)
};

npc.showDialogUsmc = function(question, btn = []) {
    npc.getDialog(new mp.Vector3(-1288.153, -561.6686, 31.71216 + 0.6), -46.52558, 'Офицер', 'Офицер USMC', question, btn)
};

npc.showDialogLoader = function(question, btn = []) {
    npc.getDialog(new mp.Vector3(5106.8076171875, -5162.783203125, 2.05600905418396 + 0.6), 353.27508544921875, 'Каспер', 'Прораб', question, btn)
};

npc.updateNpcFace = function(localNpc, data) {
    try {
        let skin = JSON.parse(data);
        localNpc.setHeadBlendData(
            skin['SKIN_MOTHER_FACE'],
            skin['SKIN_FATHER_FACE'],
            0,
            skin['SKIN_MOTHER_SKIN'],
            skin['SKIN_FATHER_SKIN'],
            0,
            skin['SKIN_PARENT_FACE_MIX'],
            skin['SKIN_PARENT_SKIN_MIX'],
            0,
            true
        );

        let specifications = skin['SKIN_FACE_SPECIFICATIONS'];
        if (specifications) {
            try {
                JSON.parse(specifications).forEach((item, i) => {
                    localNpc.setFaceFeature(i, item);
                })
            } catch(e) {
                methods.debug(e);
                methods.debug(specifications);
            }
        }

        localNpc.setComponentVariation(2, skin['SKIN_HAIR'], 0, 2);
        localNpc.setHeadOverlay(2, skin['SKIN_EYEBROWS'], 1.0, skin['SKIN_EYEBROWS_COLOR'], 0);

        localNpc.setHairColor(skin['SKIN_HAIR_COLOR'], skin['SKIN_HAIR_COLOR_2']);
        localNpc.setEyeColor(skin['SKIN_EYE_COLOR']);
        localNpc.setHeadOverlayColor(2, 1, skin['SKIN_EYEBROWS_COLOR'], 0);

        localNpc.setHeadOverlay(9, skin['SKIN_OVERLAY_9'], 1.0, skin['SKIN_OVERLAY_COLOR_9'], 0);

        try {
            if (skin['SKIN_HAIR_2']) {
                let data = JSON.parse(enums.overlays)[skin['SKIN_SEX']][skin[ "SKIN_HAIR"]];
                localNpc.setDecoration(mp.game.joaat(data[0]), mp.game.joaat(data[1]));
            }

            let data = JSON.parse(enums.overlays)[skin['SKIN_SEX']][methods.parseInt(skin[ "SKIN_HAIR_3"])];
            localNpc.setDecoration(mp.game.joaat(data[0]), mp.game.joaat(data[1]));
        }
        catch (e) {
            methods.error('setDecoration.SKIN_HAIR_2', e.toString());
        }

        try {
            if (skin['SKIN_SEX'] == 0) {
                localNpc.setHeadOverlay(10, skin['SKIN_OVERLAY_10'], 1.0, skin['SKIN_OVERLAY_COLOR_10'], 0);
                localNpc.setHeadOverlay(1, skin['SKIN_OVERLAY_1'], 1.0, skin['SKIN_OVERLAY_COLOR_1'], 0);
            }
            else if (skin['SKIN_SEX'] == 1) {
                localNpc.setHeadOverlay(4, skin['SKIN_OVERLAY_4'], 1.0, skin['SKIN_OVERLAY_COLOR_4'], 0);
                localNpc.setHeadOverlay(5, skin['SKIN_OVERLAY_5'], 1.0, skin['SKIN_OVERLAY_COLOR_5'], 0);
                localNpc.setHeadOverlay(8, skin['SKIN_OVERLAY_8'], 1.0, skin['SKIN_OVERLAY_COLOR_8'], 0);
            }
        }
        catch (e) {
            methods.error('user.updateCharacterFaceLocal', e.toString());
        }
    } catch(e) {
        methods.error('updateCharacterFace', e.toString());
    }
};

npc.updateNpcCloth = function(localNpc, data, sex) {
    try {

        let cloth_data = JSON.parse(data);

        //localNpc.setDecoration(mp.game.joaat(cloth_data['tprint_c']), mp.game.joaat(cloth_data['tprint_o']));

        localNpc.setComponentVariation(1, 0, 0, 2);
        localNpc.setComponentVariation(4, cloth_data['leg'], cloth_data['leg_color'], 2);
        localNpc.setComponentVariation(5, cloth_data['hand'], cloth_data['hand_color'], 2);
        localNpc.setComponentVariation(6, cloth_data['foot'], cloth_data['foot_color'], 2);
        localNpc.setComponentVariation(7, cloth_data['accessorie'], cloth_data['accessorie_color'], 2);
        localNpc.setComponentVariation(8, cloth_data['parachute'], cloth_data['parachute_color'], 2);
        localNpc.setComponentVariation(9, cloth_data['armor'], cloth_data['armor_color'], 2);
        localNpc.setComponentVariation(10, cloth_data['decal'], cloth_data['decal_color'], 2);
        localNpc.setComponentVariation(11, cloth_data['body'], cloth_data['body_color'], 2);

        if (cloth_data['gloves'] > 0) {
            let glovesOffset = npc.getGlovesOffset(sex, cloth_data['torso']);
            if (glovesOffset >= 0)
                localNpc.setComponentVariation(3, cloth_data['gloves'] + glovesOffset, cloth_data['gloves_color'], 2);
        }
        else
            localNpc.setComponentVariation(3, cloth_data['torso'], cloth_data['torso_color'], 2);

        if (cloth_data['watch'] >= 0) {
            localNpc.setPropIndex(6, cloth_data['watch'], cloth_data['watch_color'], true);
        }
        if (cloth_data['bracelet'] >= 0) {
            localNpc.setPropIndex(7, cloth_data['bracelet'], cloth_data['bracelet_color'], true);
        }
        if (cloth_data['hat'] >= 0) {
            localNpc.setPropIndex(0, cloth_data['hat'], cloth_data['hat_color'], true);
        }
        if (cloth_data['glasses'] >= 0) {
            localNpc.setPropIndex(1, cloth_data['glasses'], cloth_data['glasses_color'], true);
        }
        if (cloth_data['ear'] >= 0) {
            localNpc.setPropIndex(2, cloth_data['ear'], cloth_data['ear_color'], true);
        }

    } catch (e) {
        methods.debug(e);
    }
};

npc.updateNpcTattoo = function(localNpc, data) {
    try {
        let tattooList = JSON.parse(data);
        if (tattooList != null) {
            try {
                tattooList.forEach(function (item) {
                    /*if (user.getCache('tprint_c') != "" && item[2] == 'ZONE_TORSO')
                        return;*/
                    localNpc.setDecoration(mp.game.joaat(item[0]), mp.game.joaat(item[1]));
                });
            }
            catch (e) {
                methods.debug(e);
            }
        }

        /*if (updateHair) {
            if (user.getCache('SKIN_HAIR_2')) {
                let data = JSON.parse(enums.overlays)[user.getSex()][user.getCache( "SKIN_HAIR")];
                user.setDecoration(data[0], data[1], true);
            }

            let data = JSON.parse(enums.overlays)[user.getSex()][methods.parseInt(user.getCache( "SKIN_HAIR_3"))];
            user.setDecoration(data[0], data[1], true);
        }

        if (updatePrint) {
            if (user.getCache('tprint_c') != "" && user.getCache( 'tprint_o') != "")
                user.setDecoration( user.getCache( 'tprint_c'), user.getCache( 'tprint_o'), true);
        }*/
    }
    catch (e) {

    }
};


npc.getGlovesOffset = function(sex, handId) {
    if (sex === 1) {
        switch (handId) {
            case 0:
            case 2:
            case 14:
            case 6:
                return 2;
            case 1:
                return 1;
            case 3:
                return 3;
            case 5:
                return 0;
            case 7:
                return 7;
            /*case 4:
                return 10;*/
            case 15:
                return 12;
            case 11:
            case 4:
                return 4;
            case 9:
                return 8;
        }
    }
    else {
        switch (handId) {
            case 0:
                return 0;
            case 2:
                return 2;
            case 5:
                return 4;
            case 1:
            case 4:
            case 6:
            case 12:
            case 14:
                return 5;
            case 8:
                return 6;
            case 11:
                return 7;
            case 15:
                return 10;
        }
    }
    return -1;
};

export default npc;