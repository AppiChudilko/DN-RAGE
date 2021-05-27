let methods = require('../modules/methods');
let Container = require('../modules/data');
let mysql = require('../modules/mysql');

let vehicles = require('../property/vehicles');
let fraction = require('../property/fraction');
let stocks = require('../property/stocks');

let pickups = require('../managers/pickups');

let bank = require('../business/bank');

let inventory = require('../inventory');
let user = require('../user');
let coffer = require('../coffer');

let timer = exports;

timer.loadAll = function() {
    timer.min60Timer();
    timer.min59Timer();
    timer.min2hTimer();
    timer.min30Timer();
    timer.min10Timer();
    timer.min1Timer();
    timer.sec10Timer();
    timer.sec5Timer();
};

timer.min30Timer = function() {

    inventory.deleteWorldItems();

    mp.players.forEach(function (p) {
        if (user.isLogin(p)) {
            if (user.hasById(user.getId(p), 'grabVeh'))
                user.resetById(user.getId(p), 'grabVeh');
        }
    });
    mp.players.forEach(function (p) {
        if (user.isLogin(p)) {
            if (user.hasById(user.getId(p), 'sellUser'))
                user.resetById(user.getId(p), 'sellUser');
        }
    });

    setTimeout(timer.min30Timer, 1000 * 60 * 30);
};

timer.min10Timer = function() {

    try {
        stocks.removeState();
    }
    catch (e) {}

    mp.vehicles.forEach(function (v) {
        try {
            if (vehicles.exists(v) && v.dead) {
                if (!v.getVariable('trId'))
                    vehicles.respawn(v);
            }
        }
        catch (e) {
            methods.debug(e);
        }
    });

    mp.players.forEach(function (p) {
        if (user.isLogin(p)) {
            try {
                if (user.hasById(user.getId(p), 'grabLamar'))
                    user.resetById(user.getId(p), 'grabLamar');
            }
            catch (e) {

            }
        }
    });

    setTimeout(timer.min10Timer, 1000 * 60 * 10);
};

timer.min1Timer = function() {
    for (let i = 0; i < 50; i++) {
        if (fraction.has(i, 'grabBankFleecaTimer', 60)) {

            if (!fraction.has(i, 'grabBankFleecaDone')) {
                let count = fraction.get(i, 'grabBankFleecaTimer');
                fraction.set(i, 'grabBankFleecaTimer', count - 1);

                let pt = fraction.get(i, 'grabBankFleecaPt');
                let hp = fraction.get(i, 'grabBankFleecaHp');
                let ot = fraction.get(i, 'grabBankFleecaOt');

                if (ot === 0 && hp === 0 && pt === 0) {
                    fraction.set(i, 'grabBankFleecaDone', true);
                } else if (count < 1) {
                    fraction.reset(i, 'grabBankFleeca', true);
                    fraction.reset(i, 'grabBankFleecaCar', 2);
                    fraction.reset(i, 'grabBankFleecaPt', 2);
                    fraction.reset(i, 'grabBankFleecaHp', 2);
                    fraction.reset(i, 'grabBankFleecaOt', 2);
                    fraction.reset(i, 'grabBankFleecaTimer', 60);
                }
            }
        }
    }
    setTimeout(timer.min1Timer, 1000 * 60);
};

timer.min60Timer = function() {

    /*for (let i = 1; i < 1300; i++)
    {
        try {

            for (let j = 1; j < 1300; j++)
            {
                try {
                    if (Container.Data.Has(i, "isMail" + j))
                        Container.Data.Reset(i, "isMail" + j);
                    if (Container.Data.Has(i, "isMail2" + j))
                        Container.Data.Reset(i, "isMail2" + j);
                }
                catch (e) {
                    methods.debug(e);
                }
            }
        }
        catch (e) {
            methods.debug(e);
        }
    }*/

    try {
        mysql.executeQuery(`INSERT INTO stats_online (online) VALUES ('${mp.players.length}')`)
    }
    catch (e) {

    }

    mp.players.forEach(function (p) {
        if (user.isLogin(p)) {
            try {
                if (user.hasById(user.getId(p), 'grabLamar'))
                    user.resetById(user.getId(p), 'grabLamar');
                if (user.hasById(user.getId(p), 'atmTimeout'))
                    user.resetById(user.getId(p), 'atmTimeout');
            }
            catch (e) {
                
            }

            try {
                for (let j = 1; j < 1000; j++)
                {
                    try {
                        if (user.hasById(user.getId(p), 'isMail' + j))
                            user.resetById(user.getId(p), 'isMail' + j);
                        if (user.hasById(user.getId(p), 'isMail2' + j))
                            user.resetById(user.getId(p), 'isMail2' + j);
                    }
                    catch (e) {
                        methods.debug(e);
                    }
                }
            }
            catch (e) {
                
            }
        }
    });

    let arrayRandom = [
        'Если у тебя возникли трудности, обращайтесь в М - Вопрос',
        'Напоминаем, у тебя есть возможность кастомизировать чат\n(M - Настройки - Текстовый чат)',
        'Напоминаем, у тебя есть возможность кастомизировать интерфейс\n(M - Настройки - Интерфейс)',
        'Напоминаем, у тебя есть использовать бинды клавиш\n(M - Настройки - Назначение клавиш)',
    ];
    methods.notifyWithPictureToAll('Подсказка', '', arrayRandom[methods.getRandomInt(0, arrayRandom.length)], 'CHAR_ACTING_UP');
    setTimeout(timer.min60Timer, 1000 * 60 * 60);
};

timer.min59Timer = function() {

    coffer.addMoney(9, 50000);

    try {
        let player = methods.getRandomPlayer();
        if (user.isLogin(player)) {
            user.giveVip(player, methods.getRandomInt(1, 5), 2, true);
        }

        player = methods.getRandomPlayer();
        if (user.isLogin(player)) {
            user.giveRandomMask(player, 0, true);
        }

        player = methods.getRandomPlayer();
        if (user.isLogin(player)) {
            user.giveRandomMask(player, 0, true);
        }
    }
    catch (e) {
        
    }
    setTimeout(timer.min59Timer, 1000 * 60 * 59);
};

timer.min2hTimer = function() {
    /*try {
        let player = methods.getRandomPlayer();
        if (user.isLogin(player)) {
            user.giveRandomMask(player, 0, true);
        }
    }
    catch (e) {

    }*/

    /*for (let i = 1; i < 50; i++) {
        let frId = i;
        fraction.reset(frId, 'currentGrabShop');
        mp.players.forEach(p => {
            if (user.isLogin(p) && user.get(p, 'fraction_id2') === frId) {
                for (let idx = 0; idx < 5; idx++)
                    user.deleteBlip(p, idx + 1000);
            }
        });
        for (let idx = 0; idx < 5; idx++)
            fraction.set(frId, 'currentGrabShop' + idx, false);
    }*/

    setTimeout(timer.min2hTimer, 1000 * 120 * 59);
};

timer.sec10Timer = function() {

    mp.players.forEach(function (p) {
        if (user.isLogin(p)) {
            try {
                let userId = user.getId(p);

                if (p.ping > 500)
                    user.kickAntiCheat(p, `Ping: ${p.ping}ms`);

                let afkTime = 600;
                if (user.get(p, 'vip_type') === 1)
                    afkTime = 1200;
                if (user.get(p, 'vip_type') === 2)
                    afkTime = 1800;

                if (user.has(p, 'afkLastPos')) {
                    if (methods.distanceToPos(user.get(p, 'afkLastPos'), p.position) < 1) {

                        let timer = methods.parseInt(user.get(p, 'afkTimer'));
                        user.set(p, 'afkTimer', timer + 10);

                        if (timer > afkTime && p.getVariable('isAfk') !== true)
                            p.setVariable('isAfk', true);
                    }
                    else {
                        if (p.getVariable('isAfk') === true)
                            p.setVariable('isAfk', false);
                        user.set(p, 'afkTimer', 0);
                    }
                }

                user.set(p, 'afkLastPos', p.position);

                if (p.dimension > 0)
                    return;

                if (methods.distanceToPos(new mp.Vector3(9.66692, 528.34783, 171.3), p.position) < 5 || methods.distanceToPos(new mp.Vector3(0, 0, 0), p.position) < 5)
                    return;

                user.set(p, 'pos_x', p.position.x);
                user.set(p, 'pos_y', p.position.y);
                user.set(p, 'pos_z', p.position.z);
                user.set(p, 'rotation', p.heading);
            }
            catch (e) {
                
            }
        }
    });

    mp.vehicles.forEach(function (v) {
        if (vehicles.exists(v)) {

            try {
                if (v.getVariable('fraction_id') || v.getVariable('user_id') || v.getVariable('useless') || v.prolog || v.getOccupants().length > 0)
                    return;

                if (vehicles.has(v.id, 'afkLastPos')) {
                    if (methods.distanceToPos(vehicles.get(v.id, 'afkLastPos'), v.position) < 2) {

                        let timer = methods.parseInt(vehicles.get(v.id, 'afkTimer'));
                        vehicles.set(v.id, 'afkTimer', timer + 10);

                        if (v.getVariable('isAdmin')) {
                            if (timer > 3600 * 2) {
                                vehicles.reset(v.id, 'afkTimer');
                                vehicles.reset(v.id, 'afkLastPos');
                                vehicles.respawn(v);
                                return;
                            }
                        }
                        else {
                            if (timer > 1800) {
                                vehicles.reset(v.id, 'afkTimer');
                                vehicles.reset(v.id, 'afkLastPos');
                                vehicles.respawn(v);
                                return;
                            }
                        }
                    }
                    else {
                        vehicles.set(v.id, 'afkTimer', 0);
                    }
                }

                vehicles.set(v.id, 'afkLastPos', v.position);
            }
            catch (e) {
                methods.debug(e);
            }
        }
    });

    setTimeout(timer.sec10Timer, 1000 * 10);
};

timer.sec5Timer = function() {

    let blips = [];

    mp.vehicles.forEach(function (v) {
        if (vehicles.exists(v)) {

            try {

                if (v.getVariable('dispatchMarked')) {
                    if (v.getVariable('fraction_id') === 2 || v.getVariable('fraction_id') === 3 || v.getVariable('fraction_id') === 4 || v.getVariable('fraction_id') === 5 || v.getVariable('fraction_id') === 6) {

                        let vInfo = methods.getVehicleInfo(v.model);

                        let blipId = 672;
                        let color = 0;

                        if (vInfo.display_name === 'Insurgent' || vInfo.display_name === 'Insurgent2' || vInfo.display_name === 'Riot' || vInfo.display_name === 'PoliceT')
                            blipId = 601;
                        if (vInfo.class_name === 'Helicopters')
                            blipId = 353;
                        if (vInfo.display_name === 'Rcbandito')
                            blipId = 741;
                        if (vInfo.class_name === 'Planes')
                            blipId = 575;
                        if (vInfo.display_name === 'Police4' ||
                            vInfo.display_name === 'Intcept2' ||
                            vInfo.display_name === 'Intcept4' ||
                            vInfo.display_name === 'Polscout2' ||
                            vInfo.display_name === 'Polscout4' ||
                            vInfo.display_name === 'FBI' ||
                            vInfo.display_name === 'FBI2')
                            blipId = 724;

                        if (v.getVariable('fraction_id') === 3)
                            color = 39;
                        if (v.getVariable('fraction_id') === 4)
                            color = 25;
                        if (v.getVariable('fraction_id') === 5)
                            color = 16;
                        if (v.getVariable('fraction_id') === 6)
                            color = 1;

                        blips.push({ cl: color, b: blipId, vid: v.id, d: v.getVariable('dispatchMarked'), px: v.position.x, py: v.position.y, pz: v.position.z, h: methods.parseInt(v.heading) })
                    }
                }
            }
            catch (e) {
                methods.debug(e);
            }
        }
    });

    mp.players.forEach(p => {
        if (user.isLogin(p) && user.isGos(p)) {

            try {
                let veh = p.vehicle;
                if (!vehicles.exists(veh)) {
                    if (
                        methods.distanceToPos(p.position, pickups.DispatcherPos1) < 2 ||
                        methods.distanceToPos(p.position, pickups.DispatcherPos2) < 2 ||
                        methods.distanceToPos(p.position, pickups.DispatcherPos3) < 2 ||
                        methods.distanceToPos(p.position, pickups.DispatcherPos4) < 2 ||
                        methods.distanceToPos(p.position, pickups.DispatcherPos5) < 2 ||
                        methods.distanceToPos(p.position, pickups.DispatcherPos6) < 2
                    ) {
                        p.call('client:updateBlips', [JSON.stringify(blips)]);
                    }
                    return;
                }
                if (p.seat > 0)
                    return;
                if (veh.getVariable('fraction_id') === 2 || veh.getVariable('fraction_id') === 3 || veh.getVariable('fraction_id') === 4 || veh.getVariable('fraction_id') === 5 || veh.getVariable('fraction_id') === 6)
                    p.call('client:updateBlips', [JSON.stringify(blips)]);
            }
            catch (e) {
                
            }
        }
    });

    setTimeout(timer.sec5Timer, 1000 * 5);
};