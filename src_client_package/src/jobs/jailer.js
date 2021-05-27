import Container from '../modules/data';
import methods from '../modules/methods';
import ui from '../modules/ui';

import user from '../user';

import jobPoint from '../manager/jobPoint';
import jail from "../manager/jail";
import achievement from "../manager/achievement";

let jailer = {};

let isProcess = false;
let pickupId = 0;
let count = 0;

let checkpointList = [];

jailer.markers = [
    {
        title: 'Уборка тюрьмы',
        desc: '~w~Вот тебе лопатка и тебе надо обработать всю зелень',
        bonusExp: 5,
        bonusMoney: 30,
        list: [ //Лопкатка
            [1740.9820556640625, 2512.308837890625, 44.56498336791992, 74.58697509765625],
            [1736.3114013671875, 2517.884765625, 44.564903259277344, 198.50770568847656],
            [1718.7774658203125, 2503.2392578125, 44.56484603881836, 209.59689331054688],
            [1722.51953125, 2497.353759765625, 44.564849853515625, 205.4022979736328],
            [1703.9014892578125, 2488.744873046875, 44.564918518066406, 109.4966812133789],
            [1684.8115234375, 2488.7841796875, 44.564918518066406, 171.2366943359375],
            [1661.4857177734375, 2502.158203125, 44.56489944458008, 25.245649337768555],
            [1657.61328125, 2508.109375, 44.56489944458008, 27.207218170166016],
            [1643.84228515625, 2502.908203125, 44.56489944458008, 209.40121459960938],
            [1658.045166015625, 2521.993408203125, 44.56489944458008, 268.529296875],
            [1665.3092041015625, 2521.6396484375, 44.56489944458008, 251.92495727539062],
            [1667.07763671875, 2529.138916015625, 44.56489944458008, 285.3544921875],
            [1668.5362548828125, 2534.286865234375, 44.56489944458008, 307.34271240234375],
            [1675.1546630859375, 2539.67822265625, 44.56489944458008, 260.42242431640625],
            [1647.334716796875, 2555.73095703125, 44.564884185791016, 87.6943359375],
            [1737.091796875, 2553.30126953125, 44.564971923828125, 171.94000244140625],
            [1753.90234375, 2550.62109375, 44.564979553222656, 203.443115234375],
            [1771.294677734375, 2546.060302734375, 44.58663558959961, 216.6238555908203],
            [1771.2469482421875, 2558.93994140625, 44.58622741699219, 293.32684326171875],
            [1754.0433349609375, 2524.672119140625, 44.565025329589844, 139.71182250976562],
            [1757.4034423828125, 2510.005126953125, 44.56502151489258, 271.515869140625],

        ],
    },
    {
        title: 'Уборка тюрьмы',
        desc: '~w~Вот тебе ветродув и дуй работать',
        bonusExp: 5,
        bonusMoney: 30,
        list: [
            [1746.73486328125, 2506.0478515625, 44.56502151489258, 356.52508544921875],
            [1745.711181640625, 2517.218017578125, 44.56502151489258, 13.480810165405273],
            [1730.6318359375, 2519.002685546875, 44.564903259277344, 111.33375549316406],
            [1715.9930419921875, 2510.9326171875, 44.564903259277344, 134.05889892578125],
            [1705.20458984375, 2494.890380859375, 44.56489562988281, 105.50067138671875],
            [1679.0386962890625, 2493.658203125, 44.56489562988281, 93.1229019165039],
            [1657.78759765625, 2499.468505859375, 44.56489562988281, 56.892494201660156],
            [1639.8140869140625, 2513.88330078125, 44.56489562988281, 48.38039016723633],
            [1626.955078125, 2527.6025390625, 44.56489562988281, 34.04240798950195],
            [1623.080078125, 2545.668701171875, 44.56489562988281, 358.6847229003906],
            [1630.285888671875, 2560.039794921875, 44.56489562988281, 272.3135986328125],
            [1657.231689453125, 2560.228271484375, 44.56488800048828, 269.0523376464844],
            [1676.810302734375, 2560.02001953125, 44.56483840942383, 269.8271789550781],
            [1696.2369384765625, 2559.86279296875, 44.564842224121094, 269.19158935546875],
            [1715.6668701171875, 2559.845947265625, 44.564849853515625, 270.0775146484375],
            [1731.1092529296875, 2559.377197265625, 44.564849853515625, 268.037353515625],
            [1750.2596435546875, 2559.470703125, 44.56500244140625, 270.8334045410156],
            [1763.697265625, 2555.564453125, 44.56500244140625, 207.53536987304688],
            [1767.6082763671875, 2541.198486328125, 44.56499099731445, 166.54122924804688],
            [1734.4520263671875, 2543.260009765625, 44.564910888671875, 116.40180206298828],
            [1736.8243408203125, 2535.818359375, 44.56496047973633, 201.75962829589844],
            [1725.9976806640625, 2529.431884765625, 44.56489944458008, 79.00819396972656],
            [1719.493896484375, 2543.1171875, 44.56489562988281, 20.7061767578125],
            [1708.780029296875, 2530.989990234375, 44.56489562988281, 165.1076202392578],
            [1685.8956298828125, 2518.817626953125, 44.56489562988281, 107.24676513671875],
            [1674.5780029296875, 2505.708740234375, 44.56489562988281, 229.3115234375],
            [1657.8321533203125, 2528.599365234375, 44.56489562988281, 350.76580810546875],
            [1654.81396484375, 2537.7236328125, 44.56489562988281, 354.6204528808594],
            [1672.7919921875, 2547.53466796875, 44.56489181518555, 306.66162109375],
        ],
    },
];

jailer.start = function() {
    if (isProcess) {
        mp.game.ui.notifications.show('~r~Вы уже получили задание');
        return;
    }
    if (mp.players.local.dimension > 0) {
        mp.game.ui.notifications.show('~r~В интерьерах данное действие запрещено');
        return;
    }
    achievement.doneAllById(26);
    jailer.findRandomPickup();
};

jailer.take = function(type) {
    Container.Data.SetLocally(0, 'tool', type);
    if (type == 0)
        mp.game.ui.notifications.show('~r~Вы взяли набор инструментов');
    else if (type == 1)
        mp.game.ui.notifications.show('~g~Вы взяли набор инструментов');
    else
        mp.game.ui.notifications.show('~b~Вы взяли набор инструментов');
};

jailer.stop = function() {
    checkpointList.forEach(function (item, i) {
        try {
            jobPoint.deleteById(item.id);
        }
        catch (e) {
            methods.debug(e);
        }
    });
    checkpointList = [];

    if (!isProcess)
        return;

    isProcess = false;

    if (count == 0) {
        user.removeCashMoney(100, 'Штраф на работе садовника');
        mp.game.ui.notifications.show('~r~С вас сняли штраф за то, что вы завершили досрочно работу');
    }
    else {
        mp.game.ui.notifications.show('~r~Вы завершили работу досрочно');
    }
    count = 0;
};

jailer.findRandomPickup = function() {
    try {
        isProcess = true;
        count = 0;
        pickupId = methods.getRandomInt(0, jailer.markers.length);

        jailer.markers[pickupId].list.forEach((item, i) => {

            if (i == 0)
                user.setWaypoint(item[0], item[1]);

            let _checkpointId = 0;
            let pos = new mp.Vector3(item[0], item[1], item[2]);
            _checkpointId = jobPoint.createList(pos, false, 1, ui.MarkerRed);

            checkpointList.push({id: _checkpointId, type: pickupId, rot: item[3], pos: pos});
        });

        mp.game.ui.notifications.showWithPicture(`${jailer.markers[pickupId].title}`, "Начальник", `${jailer.markers[pickupId].desc}`, "CHAR_JOSEF", 1);
    }
    catch (e) {
        methods.debug(e);
    }
};

jailer.isProcess = function() {
    return isProcess;
};

jailer.workProcess = function(id) {

    let newList = [];

    checkpointList.forEach(function (item, i) {

        if (id == item.id) {

            mp.players.local.freezePosition(true);
            jobPoint.deleteById(item.id);

            count++;

            methods.blockKeys(true);

            mp.players.local.position = new mp.Vector3(item.pos.x, item.pos.y, item.pos.z + 1);
            mp.players.local.setRotation(0, 0, item.rot, 0, true);

            if (item.type == 0)
                user.playScenario("WORLD_HUMAN_GARDENER_PLANT");
            else
                user.playScenario("WORLD_HUMAN_GARDENER_LEAF_BLOWER");

            setTimeout(async function () {

                mp.players.local.freezePosition(false);
                methods.blockKeys(false);
                user.stopScenario();

                user.addWorkExp(2);
                user.giveJobMoney(methods.getRandomInt(5, 10));

                jail.setOffsetTimeThisSec(2);
            }, 7000);
        }
        else
            newList.push(item);
    });

    if (newList.length < 1) {
        count = 0;
        isProcess = false;

        user.giveJobMoney(jailer.markers[pickupId].bonusMoney + methods.getRandomFloat());
        user.addWorkExp(jailer.markers[pickupId].bonusExp);

        mp.game.ui.notifications.show('~g~Вы получили бонус за выполненое задание.');
        pickupId = 0;
    }

    checkpointList = newList;
};

mp.events.add("playerEnterCheckpoint", (checkpoint) => {
    try {
        if (mp.players.local.vehicle)
            return;
        if (!isProcess) return;
        jailer.workProcess(checkpoint.id);
    }
    catch (e) {

    }
});

export default jailer;