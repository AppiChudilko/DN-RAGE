import user from '../user';
import methods from '../modules/methods';
import ui from '../modules/ui';

let dispatcher = {};

let itemList = [];
let itemTaxiList = [];
let itemMehList = [];

dispatcher.send = function (title, desc, withCoord = true, phone = 0) {
    dispatcher.sendPos(title, desc, mp.players.local.position, withCoord, phone);
};

dispatcher.sendPos = function (title, desc, pos, withCoord = true, phone = 0) {
    mp.events.callRemote("server:dispatcher:sendPos", title, desc, pos.x, pos.y, pos.z, withCoord, phone.toString());
};

dispatcher.sendTaxi = function (title, desc, wpPos, price, phone = 0) {
    dispatcher.sendTaxiPos(title, desc, mp.players.local.position, wpPos, price, phone);
};

dispatcher.sendTaxiPos = function (title, desc, pos, wpPos, price, phone = 0) {
    mp.events.callRemote("server:dispatcher:sendTaxiPos", title, desc, pos.x, pos.y, pos.z, wpPos.x, wpPos.y, wpPos.z, price, phone.toString());
};

dispatcher.sendMech = function (title, desc, phone = 0) {
    dispatcher.sendMechPos(title, desc, mp.players.local.position, phone);
};

dispatcher.sendMechPos = function (title, desc, pos, phone = 0) {
    mp.events.callRemote("server:dispatcher:sendMechPos", title, desc, pos.x, pos.y, pos.z, phone.toString());
};

dispatcher.sendLocal = function (title, desc, withCoord = true) {
    dispatcher.sendLocalPos(title, desc, mp.players.local.position, user.getCache('fraction_id'), withCoord);
};

dispatcher.sendLocalPos = function (title, desc, pos, fractionId = 0, withCoord = true) {
    if (fractionId === 0)
        return;
    mp.events.callRemote("server:dispatcher:sendLocalPos", title, desc, pos.x, pos.y, pos.z, fractionId, withCoord);
};

dispatcher.codeDep = function (code, name, withCoord = true) {
    if (code === 0 || code === 2 || code === 3)
        dispatcher.send(`Код ${code}`, `${name} - запрашивает поддержку по коду ${code}`, withCoord);
    else if (code === 1)
        dispatcher.send(`Код ${code}`, `${name} - информацию принял`, withCoord);
    else if (code === 4)
        dispatcher.send(`Код ${code}`, `${name} - помощь не требуется/все спокойно`, withCoord);
    else if (code === 5)
        dispatcher.send(`Код ${code}`, `${name} - просит держаться подальше`, withCoord);
    else if (code === 6)
        dispatcher.send(`Код ${code}`, `${name} - задерживается на месте`, withCoord);
    else if (code === 7)
        dispatcher.send(`Код ${code}`, `${name} - вышел на перерыв`, withCoord);
    else if (code === 8)
        dispatcher.send(`Код ${code}`, `${name} - необходимы сотрудники пожарного департамента`, withCoord);
    else if (code === 9)
        dispatcher.send(`Код ${code}`, `${name} - необходимы сотрудники EMS`, withCoord);
    else if (code === 77)
        dispatcher.send(`Код ${code}`, `${name} - осторожно, возможна засада`, withCoord);
    else if (code === 99)
        dispatcher.send(`Код ${code}`, `${name} - докладывает о черезвычайной ситуации`, withCoord);
    else if (code === 100)
        dispatcher.send(`Код ${code}`, `${name} - находится в состоянии перехвата`, withCoord);
    else
        dispatcher.send(`Код ${code}`, `${name} - запрашивает поддержку`, withCoord);
};

dispatcher.codeLocal = function (code, name, withCoord = true) {
    if (code === 0 || code === 2 || code === 3)
        dispatcher.sendLocal(`Код ${code}`, `${name} - запрашивает поддержку по коду ${code}`, withCoord);
    else if (code === 1)
        dispatcher.sendLocal(`Код ${code}`, `${name} - информацию принял`, withCoord);
    else if (code === 4)
        dispatcher.sendLocal(`Код ${code}`, `${name} - помощь не требуется/все спокойно`, withCoord);
    else if (code === 5)
        dispatcher.sendLocal(`Код ${code}`, `${name} - просит держаться подальше`, withCoord);
    else if (code === 6)
        dispatcher.sendLocal(`Код ${code}`, `${name} - задерживается на месте`, withCoord);
    else if (code === 7)
        dispatcher.sendLocal(`Код ${code}`, `${name} - вышел на перерыв`, withCoord);
    else if (code === 8)
        dispatcher.sendLocal(`Код ${code}`, `${name} - необходимы сотрудники пожарного департамента`, withCoord);
    else if (code === 9)
        dispatcher.sendLocal(`Код ${code}`, `${name} - необходимы сотрудники EMS`, withCoord);
    else if (code === 77)
        dispatcher.sendLocal(`Код ${code}`, `${name} - осторожно, возможна засада`, withCoord);
    else if (code === 99)
        dispatcher.sendLocal(`Код ${code}`, `${name} - докладывает о черезвычайной ситуации`, withCoord);
    else if (code === 100)
        dispatcher.sendLocal(`Код ${code}`, `${name} - находится в состоянии перехвата`, withCoord);
    else
        dispatcher.sendLocal(`Код ${code}`, `${name} - запрашивает поддержку`, withCoord);
};

dispatcher.addDispatcherList = function (title, desc, time, x, y, z, withCoord, phone) {
    try {
        let street1 = ui.getZoneName(new mp.Vector3(x, y, z));
        let street2 = ui.getStreetName(new mp.Vector3(x, y, z));

        itemList.push({title: title, desc: desc, street1: street1, street2: street2, time: time, x: x, y: y, z: z,  withCoord: withCoord, phone: phone});

        let subLabel = `\n~y~Район:~s~ ${street1}\n~y~Улица:~s~ ${street2}`;
        user.sendPhoneNotify(`Диспетчер [${time}]`, title, desc + subLabel, "CHAR_CALL911");
    }
    catch (e) {}
};

dispatcher.addDispatcherTaxiList = function (count, title, desc, time, price, x, y, z) {
    try {
        let street1 = ui.getZoneName(new mp.Vector3(x, y, z));
        let street2 = ui.getStreetName(new mp.Vector3(x, y, z));
        user.sendPhoneNotify(`Диспетчер [#${count}]`, title, desc + `\n~y~Район:~s~ ${street1}\n~y~Улица:~s~ ${street2}`, 'CHAR_TAXI');
    }
    catch (e) {}
};

dispatcher.addDispatcherMechList = function (count, title, desc, time, price, x, y, z) {
    try {
        let street1 = ui.getZoneName(new mp.Vector3(x, y, z));
        let street2 = ui.getStreetName(new mp.Vector3(x, y, z));
        user.sendPhoneNotify(`Диспетчер [#${count}]`, title, desc + `\n~y~Район:~s~ ${street1}\n~y~Улица:~s~ ${street2}`, 'CHAR_LS_CUSTOMS');
    }
    catch (e) {}
};

dispatcher.sendNotification = function (title, desc, desc2, desc3) {
    methods.notifyWithPictureToFraction(title, "Диспетчер", `${desc}\n${desc2}\n${desc3}`, "CHAR_CALL911", 2, 1);
    methods.notifyWithPictureToFraction(title, "Диспетчер", `${desc}\n${desc2}\n${desc3}`, "CHAR_CALL911", 3, 1);
    methods.notifyWithPictureToFraction(title, "Диспетчер", `${desc}\n${desc2}\n${desc3}`, "CHAR_CALL911", 7, 1);
    methods.notifyWithPictureToFraction(title, "Диспетчер", `${desc}\n${desc2}\n${desc3}`, "CHAR_CALL911", 16, 1);
};

dispatcher.sendNotificationFraction = function (title, desc, desc2, desc3, fractionId) {
    methods.notifyWithPictureToFraction(title, "Диспетчер", `${desc}\n${desc2}\n${desc3}`, "CHAR_CALL911", fractionId, 1);
};

dispatcher.getTaxiMenu = function () {
    mp.events.callRemote("server:dispatcher:getTaxiMenu");
};

dispatcher.getMechMenu = function () {
    mp.events.callRemote("server:dispatcher:getMechMenu");
};

dispatcher.getItemList = function () {
    return itemList.reverse();
};

export default dispatcher;