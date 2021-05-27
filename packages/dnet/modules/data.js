"use strict";
let _data = new Map();
let Debug = false;
let methods = require('./methods');

class Container {
    static SetClient(id, key, value, isInt = false) {
        //methods.debug('Container.SetClient', id, key, value, isInt);
        try {

            if (isInt)
                value = methods.parseFloat(value);

            if (Debug) {
                methods.debug(`SRV: [SET-CLIENT-SRV] ID: ${id}, KEY: ${key}, OBJECT: ${value}`);
            }
            this.Set(id, key, value);
        } catch(e) {
            methods.debug(`SRV: [SET-CLIENT-SRV] ERR: ${e}`);
        }
    }

    static SetGroupClient(json) {
        //methods.debug('Container.SetGroupClient', json);
        try {
            let data = JSON.parse(json);
            data.forEach(item => {
                this.SetClient(item.id, item.key, item.value, item.isInt);
            })

        } catch(e) {
            methods.debug(`SRV: [SET-CLIENT-SRV] ERR: ${e}`);
        }
    }

    static Set(id, key, value) {
        //methods.debug('Container.Set');
        id = methods.parseInt(id);
        try {
            if (_data.has(id) && _data.get(id) !== undefined && _data.get(id) !== null) {
                _data.set(id, _data.get(id).set(key, value));
            } else {
                _data.set(id, new Map().set(key, value));
            }
            if (Debug) {
                methods.debug(`SRV: [SET] ID: ${id}, KEY: ${key}, OBJECT: ${value}`);
            }
        } catch (e) {
            methods.debug(`SRV: [SET] ERR: ${e}`);
        }
    }

    static Reset(id, key){
        methods.debug('Container.Reset');
        id = methods.parseInt(id);
        try {
            if (!_data.has(id)) return;
            if (!_data.get(id).has(key)) return;
            _data.get(id).delete(key);
            if (Debug) {
                methods.debug(`SRV: [RESET] ID: ${id}, KEY: ${key}`);
            }
        } catch (e) {
            methods.debug(`SRV: [RESET] ERR: ${e}`);
        }
    }

    static ResetAll(id){
        methods.debug('Container.ResetAll');
        id = methods.parseInt(id);
        try {
            if (!_data.has(id)) return;
            _data.delete(id);
            if (Debug) {
                methods.debug(`SRV: [RESETALL] ID: ${id}, KEY: ${key}`);
            }
        } catch (e) {
            methods.debug(`SRV: [RESETALL] ERR: ${e}`);
        }
    }

    static Get(id, key) {
        //methods.debug('Container.Get');
        id = methods.parseInt(id);
        try {
            if (Debug) {
                methods.debug(`SRV: [GET] ID: ${id}, KEY: ${key}`);
            }
            if (_data.has(id)) {
                if (_data.get(id).has(key)) {
                    return _data.get(id).get(key);
                }
            }
            return null;
        } catch (e) {
            methods.debug(`SRV: [GET] ERR: ${e}`);
        }
    }

    static Has(id, key) {
        //methods.debug('Container.Has');
        id = methods.parseInt(id);
        try {
            if (Debug) {
                methods.debug(`SRV: [HAS] ID: ${id}, KEY: ${key}`);
            }
            if (_data.has(id)) {
                return _data.get(id).has(key);
            } else {
                return false;
            }
        } catch (e) {
            methods.debug(`SRV: [HAS] ERR: ${e}`);
        }
    }

    static GetAll(id) {
        //methods.debug('Container.GetAll');
        id = methods.parseInt(id);
        try {
            if (Debug) {
                methods.debug(`SRV: [GETALL] ID: ${id}, KEY: ${_data.get(id)}`);
            }
            if (!_data.has(id)) {
                return null;
            }
            if(_data.get(id) == undefined) return null;
            return _data.get(id);
        } catch (e) {
            methods.debug(`SRV: [GETALL] ERR: ${e}`);
        }
    }

    static GetAllClient(player, promiseId, id) {
        //methods.debug('Container.GetAllClient');
        try {
            if (Debug) {
                methods.debug(`SRV: [GET ALL CLIENT] ID: ${id}`);
            }
            player.call('modules:client:data:GetAll', [promiseId, Array.from(this.GetAll(id))]);
        } catch (e) {
            player.call('modules:client:data:GetAll', [promiseId, null]);
            methods.debug(`SRV: [GET ALL CLIENT] ERR: ${e}`);
        }
    }

    static GetClient(player, promiseId, id, key) {
        //methods.debug('Container.GetClient');
        try {
            if (Debug) {
                methods.debug(`SRV: [GETCLIENT] ID: ${id}, KEY: ${key}`);
            }
            player.call('modules:client:data:Get', [promiseId, this.Get(id, key)]);
        } catch (e) {
            player.call('modules:client:data:Get', [promiseId, null]);
            methods.debug(`SRV: [GETCLIENT] ERR: ${e}`);
        }
    }

    static HasClient(player, promiseId, id, key) {
        //methods.debug('Container.HasClient');
        try {
            if (Debug) {
                methods.debug(`SRV: [HASCLIENT] ID: ${id}, KEY: ${key}`);
            }
            player.call('modules:client:data:Has', [promiseId, this.Has(id, key)]);
        } catch (e) {
            methods.debug(`SRV: [HASCLIENT] ERR: ${e}`);
        }
    }
}

exports.Data = Container;