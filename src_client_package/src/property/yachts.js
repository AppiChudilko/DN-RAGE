import user from '../user';
import Container from '../modules/data';
import methods from '../modules/methods';
import enums from '../enums';
import stocks from "./stocks";

let yachts = {};

yachts.getData = async function(id) {
    return await Container.Data.GetAll(enums.offsets.yacht + methods.parseInt(id));
};

yachts.get = async function(id, key) {
    return await Container.Data.Get(enums.offsets.yacht + methods.parseInt(id), key);
};

yachts.buy = function (id) {
    if (user.getCacheData().get('yacht_id') > 0) {
        mp.game.ui.notifications.show('~r~У Вас уже есть яхта');
        return false;
    }
    mp.events.callRemote('server:yachts:buy', id);
    return true;
};

yachts.updateName = function (id, name) {
    mp.events.callRemote('server:yachts:updateName', id, name);
};

export default yachts;