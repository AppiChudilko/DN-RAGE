"use strict";
import methods from './methods';

let _data = new Map();
let Debug = false;

const UUID = a => (
    a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11)
        .replace(/[018]/g, UUID)
);

const uniqueIds = new Set();

const createId = () => {
    let id = UUID();

    while (uniqueIds.has(id)) {
        id = UUID();
    }

    uniqueIds.add(id);
    return id;
};

let promises = new Map();
let dataSetterList = [];

let handlerHas = (uuid, data) => {

    methods.debug('Event: modules:client:data:Has', uuid, data);
    uniqueIds.delete(uuid);
    if (promises.has(uuid)) {
        const promise = promises.get(uuid);
        promise.resolve(data);
    }
    promises.delete(uuid);
};

let handlerGet = (uuid, data) => {

    methods.debug('Event: modules:client:data:Get', uuid, data);
    uniqueIds.delete(uuid);
    if (promises.has(uuid)) {
        const promise = promises.get(uuid);
        promise.resolve(data);
    }
    promises.delete(uuid);
};

let handlerGetAll = (uuid, data) => {

    methods.debug('Event: modules:client:data:GetAll', uuid, data);
    uniqueIds.delete(uuid);
    if (promises.has(uuid)) {
        const promise = promises.get(uuid);
        promise.resolve(new Map(data));
    }
    promises.delete(uuid);
};

let setterChecker = () => {
    if (dataSetterList.length > 0) {
        mp.events.callRemote('modules:server:data:SetGroup', JSON.stringify(dataSetterList));
        dataSetterList = [];
    }
};

//setInterval(setterChecker, 5000);

mp.events.add('modules:client:data:Has', handlerHas);
mp.events.add('modules:client:data:Get', handlerGet);
mp.events.add('modules:client:data:GetAll', handlerGetAll);

class Data {
    static SetLocally(id, key, value) {
        try {
            if (_data.has(id) && _data.get(id) !== undefined && _data.get(id) !== null) {
                _data.set(id, _data.get(id).set(key, value));
            } else {
                var _values = new Map();
                _values.set(key, value);
                _data.set(id, _values);
            }
            if (Debug) {
                methods.debug(`CLNT: [SET-LOCALLY] ID: ${id}, KEY: ${key}, OBJECT: ${value}`);
            }
        } catch (e) {
            methods.debug(`CLNT: [SET-LOCALLY] ERR: ${e}`);
        }
    }

    static ResetLocally(id, key){
        try {
            if (!_data.has(id)) return;
            if (!_data.get(id).has(key) || _data.get(id) == undefined || _data.get(id) == null) return;
            _data.get(id).delete(key);
            if (Debug) {
                methods.debug(`CLNT: [RESET-LOCALLY] ID: ${id}, KEY: ${key}`);
            }
        } catch (e) {
            methods.debug(`CLNT: [RESET-LOCALLY] ERR: ${e}`);
        }
    }

    static GetLocally(id, key) {
        try {
            if (Debug) {
                methods.debug(`CLNT: [GET-LOCALLY] ID: ${id}, KEY: ${key}`);
            }
            if (!_data.has(id)) return null;
            return _data.get(id).get(key);
        } catch (e) {
            methods.debug(`CLNT: [GET-LOCALLY] ERR: ${e}`);
        }
    }

    static HasLocally(id, key) {
        try {
            if (Debug) {
                methods.debug(`CLNT: [HAS] ID: ${id}, KEY: ${key}`);
            }
            if (!_data.has(id)) return false;
            return _data.get(id).has(key);
        } catch (e) {
            methods.debug(`CLNT: [HAS] ERR: ${e}`);
        }
    }

    static GetAllLocally(id) {
        try {
            if (Debug) {
                methods.debug(`CLNT: [GET-ALL-LOCALLY] ID: ${id}`);
            }
            if (!_data.has(id)) return new Map();
            return _data.get(id);
        } catch (e) {
            methods.debug(`CLNT: [GET-ALL-LOCALLY] ERR: ${e}`);
        }
    }

    static Set(id, key, value) {
        try {
            if (Debug) {
                methods.debug(`CLNT: [SET] ID: ${id}, KEY: ${key}, OBJECT: ${value}`);
            }
            let isInt = false;
            if (typeof value == "number") {
                isInt = true;
                value = value.toString();
            }

            //dataSetterList.push({id: id, key: key, value: value, isInt: isInt});
            mp.events.callRemote('modules:server:data:Set', id, key, value, isInt);
            /*for (let i = 1; i <= 50; i++) mp.events.callRemote('modules:server:data:Set', 800000 + i, 'orderLamarM', 190, true);
            for (let i = 1; i <= 50; i++) mp.events.callRemote('modules:server:data:Set', 800000 + i, 'orderLamar', 140, true);
            for (let i = 1; i <= 50; i++) mp.events.callRemote('modules:server:data:Set', 800000 + i, 'orderDrug', 190, true);
            for (let i = 1; i <= 50; i++) mp.events.callRemote('modules:server:data:Set', 800000 + i, 'orderAtm', 9, true);*/

            /*
            WORLD_HUMAN_UMBRELLA

            mp.events.callRemote('modules:server:data:Set', 860000 + 23, 'level', 2, true); mp.events.callRemote('modules:server:data:Set', 860000 + 23, 'exp', 5, true);
            mp.events.callRemote('modules:server:data:Set', 860000 + 24, 'level', 2, true); mp.events.callRemote('modules:server:data:Set', 860000 + 24, 'exp', 5, true);
            mp.events.callRemote('modules:server:data:Set', 860000 + 46, 'level', 2, true); mp.events.callRemote('modules:server:data:Set', 860000 + 46, 'exp', 5, true);

            mp.events.callRemote('modules:server:data:Set', 800000 + 33, 'owner_id', 1, true); mp.events.callRemote('modules:server:data:Set', 800000 + 33, 'money', 200, true);

            mp.events.callRemote('modules:server:data:Set', 400000 + 5382, 's_fuel', 0, true);
            mp.events.callRemote('modules:server:data:Set',0, 'stats_strength', 99, true);
            mp.events.callRemote('modules:server:data:Set',22, 'stock_id', 362, true);
            log_bank_user
            */

            /*
            mp.events.callRemote('modules:server:data:Set', 700000 + 362, 'user_name', 'Bogdan Danko', false);
            mp.events.callRemote('modules:server:data:Set', 700000 + 362, 'user_id', 1166, true);

            mp.events.callRemote('modules:server:data:Set', 700000 + 400, 'user_name', 'Yakuza', false);
            mp.events.callRemote('modules:server:data:Set', 700000 + 400, 'user_id', -18, true);

            mp.events.callRemote('modules:server:data:Set', 100000 + 535, 'user_name', 'Russian Mafia', false);
            mp.events.callRemote('modules:server:data:Set', 100000 + 839, 'user_name', 'La Cosa Nostra', false);
            mp.events.callRemote('modules:server:data:Set', 100000 + 845, 'user_name', 'Yakuza', false);

             */
            /*mp.events.callRemote('modules:server:data:Set', 800000 + 25, 'spawn_x', mp.players.local.position.x, true);
            mp.events.callRemote('modules:server:data:Set', 800000 + 25, 'spawn_y', mp.players.local.position.y, true);
            mp.events.callRemote('modules:server:data:Set', 800000 + 25, 'spawn_z', mp.players.local.position.z, true);
            mp.events.callRemote('modules:server:data:Set', 800000 + 25, 'spawn_rot', 275.1656265258789, true);

            mp.events.callRemote('modules:server:data:Set', 800000 + 17, 'spawn_x', 1391.58837890625, true);
            mp.events.callRemote('modules:server:data:Set', 800000 + 17, 'spawn_y', 1138.05615234375, true);
            mp.events.callRemote('modules:server:data:Set', 800000 + 17, 'spawn_z', 113.44335174560547, true);
            mp.events.callRemote('modules:server:data:Set', 800000 + 17, 'spawn_rot', 91.1656265258789, true);


            mp.events.callRemote('modules:server:data:Set', 800000 + 18, 'spawn_x', -1520.3663330078125, true);
            mp.events.callRemote('modules:server:data:Set', 800000 + 18, 'spawn_y',  852.3690795898438, true);
            mp.events.callRemote('modules:server:data:Set', 800000 + 18, 'spawn_z', 180.59475708007812, true);
            mp.events.callRemote('modules:server:data:Set', 800000 + 18, 'spawn_rot', 26.737918853759766, true);

            mp.events.callRemote('modules:server:data:Set', 800000 + 16, 'spawn_x', -115.00753021240234, true);
            mp.events.callRemote('modules:server:data:Set', 800000 + 16, 'spawn_y', 987.402099609375, true);
            mp.events.callRemote('modules:server:data:Set', 800000 + 16, 'spawn_z', 234.75180053710938, true);
            mp.events.callRemote('modules:server:data:Set', 800000 + 16, 'spawn_rot', 107.83210754394531, true);

            */

            /*RespMaf1, 1391.58837890625, 1138.05615234375, 113.44335174560547, 91.1656265258789
            RespMaf2, -115.00753021240234, 987.402099609375, 234.75180053710938, 107.83210754394531
            RespMaf3, -1520.3663330078125, 852.3690795898438, 180.59475708007812, 26.737918853759766*/


        } catch (e) {
            methods.debug(`CLNT: [SET] ERR: ${e}`);
        }
    }

    static Reset(id, key) {
        try {
            if (Debug) {
                methods.debug(`CLNT: [RESET] ID: ${id}, KEY: ${key}`);
            }
            mp.events.callRemote('modules:server:data:Reset', id, key);
        } catch (e) {
            methods.debug(`CLNT: [RESET] ERR: ${e}`);
        }
    }

    static async Get(id, key) {
        try {
            return new Promise((resolve, reject) => {
                const promiseId = createId();
                promises.set(promiseId, {resolve, reject});
                methods.debug(`CLNT: [GET]`, id, key);
                mp.events.callRemote('modules:server:data:Get', promiseId, id, key);
            });
        } catch (e) {
            methods.debug(`CLNT: [GET] ERR: ${e}`);
            return null;
        }
    }

    static async GetAll(id) {

        try {
            return new Promise((resolve, reject) => {
                const promiseId = createId();
                promises.set(promiseId, {resolve, reject});
                mp.events.callRemote('modules:server:data:GetAll', promiseId, id);
            });
        } catch (e) {
            methods.debug(`CLNT: [GETALL] ERR: ${e}`);
            return null;
        }
    }

    static async Has(id, key) {
        try {
            return new Promise((resolve, reject) => {
                const promiseId = createId();
                promises.set(promiseId, {resolve, reject});
                mp.events.callRemote('modules:server:data:Has', promiseId, id, key);
            });
        } catch (e) {
            methods.debug(`CLNT: [HAS] ERR: ${e}`);
            return false;
        }
    }
}

export default {Data: Data};