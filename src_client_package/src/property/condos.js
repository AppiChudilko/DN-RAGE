import user from '../user';
import Container from '../modules/data';
import methods from '../modules/methods';
import enums from '../enums';
import houses from "./houses";

let condos = {};

condos.enter = function (id) {
    mp.events.callRemote('server:condos:enter', id);
};

condos.exit = function (x, y, z, rot) {
    user.setVirtualWorld(0);
    user.teleport(x, y, z + 1, rot);
};

condos.getData = async function(id) {
    return await Container.Data.GetAll(enums.offsets.condo + methods.parseInt(id));
};

condos.get = async function(id, key) {
    return await Container.Data.Get(enums.offsets.condo + methods.parseInt(id), key);
};

condos.buy = function (id) {
    if (user.getCacheData().get('condos_id') > 0) {
        mp.game.ui.notifications.show('~r~У Вас уже есть квартира');
        return false;
    }
    mp.events.callRemote('server:condos:buy', id);
    return true;
};

condos.updatePin = function (id, pin) {
    mp.events.callRemote('server:condos:updatePin', id, pin);
};

condos.updateSafe = function (id, pin) {
    mp.events.callRemote('server:condos:updateSafe', id, pin);
};

condos.lockStatus = function (id, lockStatus) {
    mp.events.callRemote('server:condos:lockStatus', id, lockStatus);
};

export default condos;