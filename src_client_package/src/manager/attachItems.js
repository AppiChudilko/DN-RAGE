import methods from '../modules/methods';
import stocks from '../property/stocks';

let attachItems = {};

let itemAttach = [
    [254, -422877666, 0.07, -0.01, -0.02, -70, 0, 0], //254
    [255, -463441113, 0.07, -0.01, -0.02, -70, 0, 0], //255
    [256, -731262150, 0.07, -0.01, -0.02, -70, 0, 0], //256
    [257, -1980613044, 0.07, -0.01, -0.02, -70, 0, 0], //257
    [258, 2009373169, 0.07, -0.01, -0.02, -70, 0, 0], //258
    [259, -1921596075, 0.07, -0.01, -0.02, -70, 0, 0], //259
    [260, 1333481871, 0.07, -0.02, -0.08, -70, 0, 0], //260
];

attachItems.canTakeHand = function (itemId) {
    let result = false;
    itemAttach.forEach(item => {
        if (itemId === item[0])
            result = true;
    });
    return result;
};

attachItems.registerAttaches = function () {
    try {

        /*
        ['Маленький розовый член', '', 0, -422877666, 250, 195, 850], //254
        ['Красный вибратор ', '', 0, -463441113, 450, 440, 1000], //255
        ['Фиолетовый член', '', 0, -731262150, 330, 290, 1000], //256
        ['Кожаный член', '', 0, -1980613044, 320, 285, 1500], //257
        ['Позолоченный член', '', 0, 2009373169, 390, 180, 3000], //258
        ['Металлический член', '', 0, -1921596075, 390, 180, 2000], //259
        ['Большой резиновый член', '', 0, 1333481871, 950, 2100, 2000], //260
        ['Анальная смазка', '', 0, 1553232197, 250, 540, 800], //261
        * */

        itemAttach.forEach(item => {
            mp.attachmentMngr.register("item_" + item[0], item[1], 28422, new mp.Vector3(item[2], item[3], item[4]), new mp.Vector3(item[5], item[6], item[7]));
        });

        mp.attachmentMngr.register("phone3", -1038739674, 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0)); //Android
        mp.attachmentMngr.register("phone2", 1907022252, 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0)); //WinPhone
        mp.attachmentMngr.register("phone1", -2017357667, 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0)); //IPhone

        mp.attachmentMngr.register("music", -2017357667, 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0)); //IPhone

        mp.attachmentMngr.register("mic", mp.game.joaat("p_ing_microphonel_01"), 60309, new mp.Vector3(0.055, 0.05, 0.0), new mp.Vector3(240.0, 0.0, 0.0));
        mp.attachmentMngr.register("cam", mp.game.joaat("prop_v_cam_01"), 28422, new mp.Vector3(0.0, 0.0, 0.0), new mp.Vector3(0.0, 0.0, 0.0));

        mp.attachmentMngr.register("bagGrab", mp.game.joaat("p_ld_heist_bag_s_pro_o"), 57005, new mp.Vector3(0.1, 0, 0.15), new mp.Vector3(300.0, 200.0, 250));
        mp.attachmentMngr.register("cash", mp.game.joaat("hei_prop_heist_cash_pile"), 18905, new mp.Vector3(0.1, 0, 0.05), new mp.Vector3(160, 0, 0));

        //mp.attachmentMngr.register("laptop", mp.game.joaat("prop_laptop_lester"), 0x49D9, new mp.Vector3(0.20, 0.00, 0.05), new mp.Vector3(0.0, 180.0, 240), false, true);
        mp.attachmentMngr.register("laptop", mp.game.joaat("xm_prop_x17_laptop_lester_01"), 0x49D9, new mp.Vector3(0.20, 0.00, 0.05), new mp.Vector3(0.0, 180.0, 240), false, true);

        mp.attachmentMngr.register("ems_-1903396261", -1903396261, 'bodyshell', new mp.Vector3(0, -2.5, 0), new mp.Vector3(0, 0, 0)); // Разбитый вертолёт
        mp.attachmentMngr.register("ems_1898296526", 1898296526, 'bodyshell', new mp.Vector3(0, -2.0, 0.3), new mp.Vector3(0, 0, 0)); // Разбитое авто 1
        mp.attachmentMngr.register("ems_1069797899", 1069797899, 'bodyshell', new mp.Vector3(0, -2.5, 0.4), new mp.Vector3(0, 0, 0)); // Разбитое авто 2
        mp.attachmentMngr.register("ems_1434516869", 1434516869, 'bodyshell', new mp.Vector3(0, -2.5, 0.4), new mp.Vector3(0, 0, 0)); // Разбитое авто 3
        mp.attachmentMngr.register("ems_-896997473", -896997473, 'bodyshell', new mp.Vector3(0, -2.5, 0.4), new mp.Vector3(0, 0, 0)); // Разбитое авто 4
        mp.attachmentMngr.register("ems_-1748303324", -1748303324, 'bodyshell', new mp.Vector3(0, -2.5, 0.4), new mp.Vector3(0, 0, 0)); // Разбитое авто 5
        mp.attachmentMngr.register("ems_-1366478936", -1366478936, 'bodyshell', new mp.Vector3(0, -2.5, 0.4), new mp.Vector3(0, 0, 0)); // Разбитое авто 6
        mp.attachmentMngr.register("ems_2090224559", 2090224559, 'bodyshell', new mp.Vector3(0, -2.5, 0.4), new mp.Vector3(0, 0, 0)); // Разбитое авто 7
        mp.attachmentMngr.register("ems_-52638650", -52638650, 'bodyshell', new mp.Vector3(0, -2.5, 0.4), new mp.Vector3(0, 0, 0)); // Разбитое авто 8
        mp.attachmentMngr.register("ems_591265130", 591265130, 'bodyshell', new mp.Vector3(0, -2.5, 0.4), new mp.Vector3(0, 0, 0)); // Разбитое авто 9
        mp.attachmentMngr.register("ems_-915224107", -915224107, 'bodyshell', new mp.Vector3(0, -2.5, 0.4), new mp.Vector3(0, 0, 0)); // Разбитое авто 10
        mp.attachmentMngr.register("ems_-273279397", -273279397, 'bodyshell', new mp.Vector3(0, -2.5, 0.4), new mp.Vector3(0, 0, 0)); // Разбитое авто 11
        mp.attachmentMngr.register("ems_322493792", 322493792, 'bodyshell', new mp.Vector3(0, -2.5, 0.4), new mp.Vector3(0, 0, 0)); // Разбитое авто 12
        mp.attachmentMngr.register("ems_10106915", 10106915, 'bodyshell', new mp.Vector3(0, -2.5, 0.4), new mp.Vector3(0, 0, 0)); // Разбитое авто 13
        mp.attachmentMngr.register("ems_1120812170", 1120812170, 'bodyshell', new mp.Vector3(0, -2.5, 0.4), new mp.Vector3(0, 0, 0)); // Разбитое авто 14


        stocks.boxList.forEach((item, idx) => {
            if (idx === 2)
                mp.attachmentMngr.register("stock_" + idx, item[1], 'bodyshell', new mp.Vector3(0, -1.8, 0.2), new mp.Vector3(0, 0, 90));
            else
                mp.attachmentMngr.register("stock_" + idx, item[1], 'bodyshell', new mp.Vector3(0, -1.9, 0.2), new mp.Vector3(0, 0, 0));
        });

        mp.attachmentMngr.register(`loader`, mp.game.joaat("prop_cardbordbox_02a"), 28422, new mp.Vector3(0, -0.18, -0.18), new mp.Vector3(0, 0, 0));

        mp.attachmentMngr.register(`pickPick`, mp.game.joaat("lr_prop_carkey_fob"), 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));

        mp.attachmentMngr.register(`spec1`, 1657647215, 'bodyshell', new mp.Vector3(0, 0, 0.0), new mp.Vector3(0, 0, 180));
        mp.attachmentMngr.register(`spec2`, 442185650, 'bodyshell', new mp.Vector3(0, 0, 0.0), new mp.Vector3(0, 0, 180));
        mp.attachmentMngr.register(`spec3`, -388213579, 'bodyshell', new mp.Vector3(0, 0, 0.0), new mp.Vector3(0, 0, 180));

        mp.attachmentMngr.register("CODE_HUMAN_MEDIC_TIME_OF_DEATH", -334989242, 60309, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
        mp.attachmentMngr.register("WORLD_HUMAN_AA_COFFEE", -598185919, 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
        mp.attachmentMngr.register("WORLD_HUMAN_AA_SMOKE", 175300549, 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
        mp.attachmentMngr.register("WORLD_HUMAN_PROSTITUTE_HIGH_CLASS", 175300549, 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
        mp.attachmentMngr.register("WORLD_HUMAN_SMOKING", 175300549, 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
        mp.attachmentMngr.register("WORLD_HUMAN_SMOKING_POT", 175300549, 60309, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
        mp.attachmentMngr.register("WORLD_HUMAN_DRUG_DEALER", -1199910959, 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
        mp.attachmentMngr.register("WORLD_HUMAN_BINOCULARS", 985101275, 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
        mp.attachmentMngr.register("WORLD_HUMAN_BUM_FREEWAY", -801803927, 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
        mp.attachmentMngr.register("WORLD_HUMAN_CAR_PARK_ATTENDANT", -839348691, 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
        mp.attachmentMngr.register("WORLD_HUMAN_CLIPBOARD", -969349845, 60309, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
        mp.attachmentMngr.register("WORLD_HUMAN_DRINKING", 426102607, 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
        mp.attachmentMngr.register("WORLD_HUMAN_PARTYING", 426102607, 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
        mp.attachmentMngr.register("WORLD_HUMAN_TOURIST_MAP", -645296272, 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0));
        mp.attachmentMngr.register("WORLD_HUMAN_MUSICIAN_1", 591916419, 60309, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0)); //Играть музыку на бонге
        mp.attachmentMngr.register("WORLD_HUMAN_MUSICIAN_2", -708789241, 60309, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0)); //Играть музыку на гитаре

        mp.attachmentMngr.register("WORLD_HUMAN_PROTEST_1", mp.game.joaat("prop_cs_protest_sign_01"), 28422, new mp.Vector3(0.0, 0.0, 0.0), new mp.Vector3(0.0, 0.0, 180));
        mp.attachmentMngr.register("WORLD_HUMAN_PROTEST_2", mp.game.joaat("prop_cs_protest_sign_02"), 28422, new mp.Vector3(0.0, 0.0, 0.0), new mp.Vector3(0.0, 0.0, 180));
        mp.attachmentMngr.register("WORLD_HUMAN_PROTEST_3", mp.game.joaat("prop_cs_protest_sign_03"), 28422, new mp.Vector3(0.0, 0.0, 0.0), new mp.Vector3(0.0, 0.0, 180));

        mp.attachmentMngr.register("WORLD_HUMAN_UMBRELLA", mp.game.joaat("p_amb_brolly_01"), 28422, new mp.Vector3(0.0, 0.0, 0.0), new mp.Vector3(0.0, 0.0, 180));
        //mp.attachmentMngr.register("WORLD_HUMAN_BONG", mp.game.joaat("hei_heist_sh_bong_01"), 18905, new mp.Vector3(0,0,0.0), new mp.Vector3(95.0,190.0,180.0));
        mp.attachmentMngr.register("WORLD_HUMAN_BONG", mp.game.joaat("hei_heist_sh_bong_01"), 18905, new mp.Vector3(0.2,-0.2,0.02), new mp.Vector3(85.0,210.0,-10));


        mp.attachmentMngr.register("WORLD_HUMAN_STAND_FISHING", -1910604593, 60309, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0)); //Рыбачить удочкой
        mp.attachmentMngr.register("WORLD_HUMAN_STAND_FISHING_0", -1910604593, 60309, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0)); //Рыбачить удочкой
        mp.attachmentMngr.register("WORLD_HUMAN_STAND_FISHING_1", -1910604593, 60309, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0)); //Рыбачить удочкой
        mp.attachmentMngr.register("WORLD_HUMAN_STAND_FISHING_2", -1910604593, 60309, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0)); //Рыбачить удочкой
        mp.attachmentMngr.register("WORLD_HUMAN_STAND_FISHING_3", -1910604593, 60309, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0)); //Рыбачить удочкой
        mp.attachmentMngr.register("WORLD_HUMAN_PAPARAZZI", 434102459, 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0)); //Фотографировать на фотоаппарат
        mp.attachmentMngr.register("WORLD_HUMAN_GARDENER_LEAF_BLOWER", 1603835013, 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0)); //Работать ветродувом
        mp.attachmentMngr.register("WORLD_HUMAN_GARDENER_PLANT", -1934174148, 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0)); //Копать садовой лопаткой
        //mp.attachmentMngr.register("WORLD_HUMAN_WORK_DIRT", 2144550976, 60309, new mp.Vector3(0, -0.08, -0.7), new mp.Vector3(0, 0, 0)); //Копать лопатой
        mp.attachmentMngr.register("WORLD_HUMAN_WORK_DIRT", 1594770590, 28422, new mp.Vector3(0, -0.08, -1.14), new mp.Vector3(0, 0, 0)); //Копать лопатой
        mp.attachmentMngr.register("WORLD_HUMAN_HAMMERING", -127739306, 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0)); //Бить молотком по стене
        mp.attachmentMngr.register("WORLD_HUMAN_WELDING", -1010290664, 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0)); //Варить сварочным аппаратом
        mp.attachmentMngr.register("WORLD_HUMAN_CONST_DRILL", 1360563376, 28422, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0)); //Разбивать отбойным молотком

    }
    catch (e) {
        methods.debug(e);
    }
};

export default attachItems;