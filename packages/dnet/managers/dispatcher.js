let user = require('../user');
let phone = require('../phone');

let weather = require('./weather');

let vehicles = require('../property/vehicles');

let methods = require('../modules/methods');


let dispatcher = exports;

let countTaxi = 0;
let countMeh = 0;

let taxiList = [];
let mechList = [];

dispatcher.sendPos = function (title, desc, pos, withCoord = true, phone = 0) {

    if (methods.isBlackout()) {
        return;
    }

    methods.debug('dispatcher.sendPos');
    let time = methods.digitFormat(weather.getHour()) + ':' + methods.digitFormat(weather.getMin());
    mp.players.forEach(function (player) {
        try {
            if (user.isFib(player) || user.isEms(player) || user.isSapd(player) || user.isSheriff(player) || user.isUsmc(player))
                player.call("client:dispatcher:addDispatcherList", [title, desc, time, pos.x, pos.y, pos.z, withCoord, phone.toString()]);
        }
        catch (e) {
            methods.debug(e);
        }
    });
};

dispatcher.sendLocalPos = function (title, desc, pos, fractionId, withCoord = true) {
    if (methods.isBlackout()) {
        return;
    }
    methods.debug('dispatcher.sendLocalPos');
    let time = methods.digitFormat(weather.getHour()) + ':' + methods.digitFormat(weather.getMin());
    mp.players.forEach(function (player) {
        if (user.get(player,'fraction_id') == fractionId)
            player.call("client:dispatcher:addDispatcherList", [title, desc, time, pos.x, pos.y, pos.z, withCoord]);
    });
};

dispatcher.getTaxiMenu = function (player) {
    if (methods.isBlackout())
        return;
    if (!user.isLogin(player))
        return;
    player.call("client:menuList:showDispatcherTaxiMenu", [JSON.stringify(taxiList.reverse())]);
};

dispatcher.getMechMenu = function (player) {
    if (methods.isBlackout())
        return;
    if (!user.isLogin(player))
        return;
    player.call("client:menuList:showDispatcherMechMenu", [JSON.stringify(mechList.reverse())]);
};

dispatcher.sendTaxiPos = function (title, desc, pos, wpos, price, phone = 0) {
    if (methods.isBlackout()) {
        return;
    }
    countTaxi++;

    taxiList.push({id: countTaxi, title: title, desc: desc, pos: pos, wpos: wpos, price: price, phone: phone});
    if (taxiList.length > 50)
        taxiList.pop();

    methods.debug('dispatcher.sendTaxiPos');
    let time = methods.digitFormat(weather.getHour()) + ':' + methods.digitFormat(weather.getMin());
    mp.players.forEach(function (player) {
        if (methods.distanceToPos(player.position, pos) < 1000) {
            if (user.get(player, 'taxi_lic') && user.get(player, 'isTaxi') && player.vehicle)
                player.call("client:dispatcher:addDispatcherTaxiList", [countTaxi, title, desc, time, pos.x, pos.y, pos.z, phone.toString()]);
        }
    });
};

dispatcher.sendMechPos = function (title, desc, pos, phone = 0) {
    if (methods.isBlackout()) {
        return;
    }
    countMeh++;

    mechList.push({id: countMeh, title: title, desc: desc, pos: pos, phone: phone});
    if (mechList.length > 50)
        mechList.pop();

    methods.debug('dispatcher.sendMechPos');
    let time = methods.digitFormat(weather.getHour()) + ':' + methods.digitFormat(weather.getMin());
    mp.players.forEach(function (player) {
        if (methods.distanceToPos(player.position, pos) < 1000) {
            if (player.vehicle && player.vehicle.getVariable('job') === 5)
                player.call("client:dispatcher:addDispatcherMechList", [countMeh, title, desc, time, pos.x, pos.y, pos.z, phone.toString()]);
        }
    });
};

dispatcher.acceptTaxi = function (player, id) {
    if (!user.isLogin(player))
        return;

    let order = null;
    let newList = [];
    taxiList.forEach(item => {
        if (item.id === id)
            order = item;
        else
            newList.push(item);
    });
    taxiList = newList;
    if (!order) {
        player.notify('~r~Заказ не был найден');
        return;
    }

    if (user.get(player, 'phone') == order.phone) {
        player.notify('~r~Собственные заказы принимать нельзя');
        return;
    }

    user.setWaypoint(player, order.pos.x, order.pos.y);
    user.set(player, 'taxiPrice', order.price);
    user.set(player, 'taxiPoint', JSON.stringify(order.wpos));
    player.vehicle.setVariable('taxiOrderId', order.phone);

    let vInfo = methods.getVehicleInfo(player.vehicle.model);
    phone.sendMessageByNumber(user.get(player, 'phone'), order.phone, `Здравствуйте. Таксист принял ваш заказ. Транспорт: ${vInfo.display_name} | ${player.vehicle.numberPlate}`);

    player.notify('~y~Вы приняли заказ');
};

dispatcher.acceptMech = function (player, id) {
    if (!user.isLogin(player))
        return;

    let order = null;
    let newList = [];
    mechList.forEach(item => {
        if (item.id === id)
            order = item;
        else
            newList.push(item);
    });
    mechList = newList;
    if (!order) {
        player.notify('~r~Заказ не был найден');
        return;
    }

    if (user.get(player, 'phone') == order.phone) {
        player.notify('~r~Собственные заказы принимать нельзя');
        return;
    }

    user.setWaypoint(player, order.pos.x, order.pos.y);
    phone.sendMessageByNumber(user.get(player, 'phone'), order.phone, `Здравствуйте. Механик принял ваш заказ, ожидайте.`);
    player.notify('~y~Вы приняли заказ');
};

mp.events.add("playerEnterVehicle", (player, vehicle, seat) => {
    try {

        let driver = user.getVehicleDriver(vehicle);
        if (vehicle.getVariable('taxiOrderId') && user.has(player, 'waitTaxi') && vehicle.getVariable('taxiOrderId') == user.get(player, 'phone') && user.isLogin(player) && user.isLogin(driver)) {
            let pos = JSON.parse(user.get(driver, 'taxiPoint'));
            user.set(player, 'taxiPointFrom', JSON.stringify(player.position));
            user.setWaypoint(driver, pos.x, pos.y);
            driver.notify('~y~Клиент сел к вам в автомобиль, метка установлена');
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add("playerExitVehicle", (player, vehicle) => {

    try {
        let driver = user.getVehicleDriver(vehicle);
        if (vehicle.getVariable('taxiOrderId') && user.has(player, 'waitTaxi') && vehicle.getVariable('taxiOrderId') == user.get(player, 'phone') && user.isLogin(player) && user.isLogin(driver)) {

            let pos = JSON.parse(user.get(driver, 'taxiPoint'));
            let price = user.get(driver, 'taxiPrice');
            try {
                if (methods.distanceToPos(pos, driver.position) > 50)
                    price = methods.distanceToPos(JSON.parse(user.get(driver, 'taxiPointFrom')), driver.position) / 15;
            }
            catch (e) {
                
            }

            user.reset(player, 'waitTaxi');
            user.removeMoney(player, price, 'Услуги такси');
            user.addMoney(driver, price, 'Услуги такси');

            user.reset(driver, 'taxiPrice');
            user.reset(driver, 'taxiPoint');
            user.reset(driver, 'taxiPointFrom');
            vehicle.setVariable('taxiOrderId', undefined);

            player.notify(`~y~С вас списало ${methods.moneyFormat(price)}`);
            driver.notify(`~y~Вы заработали ${methods.moneyFormat(price)}`);
        }
    }
    catch (e) {
        methods.debug(e);
    }
});