import methods from '../modules/methods';
import attachItems from "./attachItems";
import timer from "./timer";

let attach = {};

mp.attachmentMngr =
    {
        attachments: {},

        ///eval JSON.stringify(mp.players.local.__attachmentObjects["3376878207"]);

        addFor: async function(entity, id)
        {
            try {
                if(this.attachments.hasOwnProperty(id))
                {
                    if(!entity.__attachmentObjects.hasOwnProperty(id))
                    {
                        if (id === mp.game.joaat('music') && entity.remoteId !== mp.players.local.remoteId)
                            return;
                        let attInfo = this.attachments[id];

                        let spawnPos = new mp.Vector3(entity.position.x, entity.position.y, -90);

                        if (mp.game.weapon.isWeaponValid(attInfo.model)) {

                            mp.game.weapon.requestWeaponAsset(attInfo.model, 1, 1);
                            while (!mp.game.weapon.hasWeaponAssetLoaded(attInfo.model))
                                await methods.sleep(10);

                            let object = mp.game.weapon.createWeaponObject(attInfo.model, 0, spawnPos.x, spawnPos.y, spawnPos.z, false, 0, 0);
                            let boneIndex =  mp.game.invoke(methods.GET_PED_BONE_INDEX, entity.handle, attInfo.boneName);

                            try {
                                let data = JSON.parse(mp.players.local.getVariable('allWeaponComponents'));
                                data[attInfo.model.toString()].forEach(item => {
                                    mp.game.weapon.giveWeaponComponentToWeaponObject(object, item);
                                })
                            }
                            catch (e) {

                            }

                            mp.game.invoke(methods.ATTACH_ENTITY_TO_ENTITY, object, entity.handle, boneIndex
                                , attInfo.offset.x, attInfo.offset.y, attInfo.offset.z
                                , attInfo.rotation.x, attInfo.rotation.y, attInfo.rotation.z
                                , true, true, false, false, 2, true);

                            entity.__attachmentObjects[id] = object;
                        }
                        else {
                            let object = mp.objects.new(attInfo.model, spawnPos, {dimension: entity.dimension});

                            let boneIndex = (typeof attInfo.boneName === 'string') ?
                                entity.getBoneIndexByName(attInfo.boneName) :
                                entity.getBoneIndex(attInfo.boneName);

                            object.attachTo(entity.handle, boneIndex,
                                attInfo.offset.x, attInfo.offset.y, attInfo.offset.z,
                                attInfo.rotation.x, attInfo.rotation.y, attInfo.rotation.z,
                                false, false, attInfo.collision, false, 2, true);

                            if (attInfo.freeze) {
                                object.freezePosition(true);
                            }

                            if (id === mp.game.joaat('music')) {
                                object.setAlpha(0);
                                object.setVisible(false, false);

                                mp.game.invoke('0x651D3228960D08AF', "SE_Script_Placed_Prop_Emitter_Boombox", object.handle);
                                mp.game.audio.setEmitterRadioStation("SE_Script_Placed_Prop_Emitter_Boombox", mp.game.audio.getRadioStationName(0));
                                mp.game.audio.setStaticEmitterEnabled("SE_Script_Placed_Prop_Emitter_Boombox", true);
                            }

                            entity.__attachmentObjects[id] = object;
                        }
                    }
                }
                else
                {
                    methods.debug(`Static Attachments Error: Unknown Attachment Used: ~w~0x${id.toString(16)}`);
                }
            }
            catch (e) {
                methods.error('ATTACH ERROR');
                methods.error(e);
            }
        },

        removeFor: function(entity, id)
        {
            try {
                if(entity.__attachmentObjects.hasOwnProperty(id))
                {
                    let obj = entity.__attachmentObjects[id];
                    delete entity.__attachmentObjects[id];

                    if(mp.objects.exists(obj))
                    {
                        obj.destroy();
                    }
                    else {
                        methods.debug('DESTROY ' + obj);
                        mp.game.invoke(methods.DETACH_ENTITY, obj, true, true);
                        mp.game.invoke(methods.SET_ENTITY_COORDS, obj, 9999, 9999, 9999, false, false, false, true);
                        mp.game.invoke(methods.SET_ENTITY_ALPHA, obj, 0, 0);
                    }
                }
            }
            catch (e) {
                methods.debug(e);
            }
        },

        initFor: function(entity)
        {
            try {
                for(let attachment of entity.__attachments)
                {
                    mp.attachmentMngr.addFor(entity, attachment);
                }
            }
            catch (e) {
                methods.debug(e);
            }
        },

        shutdownFor: function(entity)
        {
            try {
                for(let attachment in entity.__attachmentObjects)
                {
                    mp.attachmentMngr.removeFor(entity, attachment);
                }
            }
            catch (e) {
                methods.debug(e);
            }
        },

        register: function(id, model, boneName, offset, rotation, collision = false, freeze = false)
        {
            try {
                if(typeof(id) === 'string')
                {
                    id = mp.game.joaat(id);
                }

                if(typeof(model) === 'string')
                {
                    model = mp.game.joaat(model);
                }

                if(!this.attachments.hasOwnProperty(id))
                {
                    this.attachments[id] =
                        {
                            id: id,
                            model: model,
                            offset: offset,
                            rotation: rotation,
                            boneName: boneName,
                            collision: collision,
                            freeze: freeze
                        };
                    /*if(mp.game.streaming.isModelInCdimage(model))
                    {
                        this.attachments[id] =
                            {
                                id: id,
                                model: model,
                                offset: offset,
                                rotation: rotation,
                                boneName: boneName
                            };
                    }
                    else
                    {
                        methods.debug(`Static Attachments Error: Invalid Model (0x${model.toString(16)})`);
                    }*/
                }
                else
                {
                    methods.debug("Static Attachments Error: Duplicate Entry");
                }
            }
            catch (e) {
                methods.debug(e);
            }
        },

        unregister: function(id)
        {
            try {
                if(typeof(id) === 'string')
                {
                    id = mp.game.joaat(id);
                }

                if(this.attachments.hasOwnProperty(id))
                {
                    this.attachments[id] = undefined;
                }
            }
            catch (e) {
                methods.debug(e);
            }
        },

        addLocal: function(attachmentName)
        {
            try {
                if(typeof(attachmentName) === 'string')
                {
                    attachmentName = mp.game.joaat(attachmentName);
                }

                let entity = mp.players.local;

                if(!entity.__attachments || entity.__attachments.indexOf(attachmentName) === -1)
                {
                    mp.events.callRemote("staticAttachments.Add", attachmentName.toString(36));
                }
            }
            catch (e) {
                methods.debug(e);
            }
        },

        removeLocal: function(attachmentName)
        {
            try {
                if(typeof(attachmentName) === 'string')
                {
                    attachmentName = mp.game.joaat(attachmentName);
                }

                let entity = mp.players.local;

                if(entity.__attachments && entity.__attachments.indexOf(attachmentName) !== -1)
                {
                    mp.events.callRemote("staticAttachments.Remove", attachmentName.toString(36));
                }
            }
            catch (e) {
                methods.debug(e);
            }
        },

        getAttachments: function()
        {
            return Object.assign({}, this.attachments);
        }
    };

mp.events.add("entityStreamIn", (entity) =>
{
    try {
        mp.attachmentMngr.shutdownFor(entity);

        if(entity.__attachments)
        {
            mp.attachmentMngr.initFor(entity);
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add("entityStreamOut", (entity) =>
{
    try {
        if(entity.__attachmentObjects)
        {
            mp.attachmentMngr.shutdownFor(entity);
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add("playerQuit", (entity, exitType, reason) =>
{
    try {
        if(entity.__attachmentObjects)
        {
            mp.attachmentMngr.shutdownFor(entity);
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addDataHandler("attachmentsData", (entity, data) =>
{
    try {
        let newAttachments = (data.length > 0) ? data.split('|').map(att => parseInt(att, 36)) : [];

        if(entity.handle !== 0)
        {
            let oldAttachments = entity.__attachments;

            if(!oldAttachments)
            {
                oldAttachments = [];
                entity.__attachmentObjects = {};
            }

            // process outdated first
            for(let attachment of oldAttachments)
            {
                if(newAttachments.indexOf(attachment) === -1)
                {
                    mp.attachmentMngr.removeFor(entity, attachment);
                }
            }

            // then new attachments
            for(let attachment of newAttachments)
            {
                if(oldAttachments.indexOf(attachment) === -1)
                {
                    mp.attachmentMngr.addFor(entity, attachment);
                }
            }
        }
        else
        {
            entity.__attachmentObjects = {};
        }

        entity.__attachments = newAttachments;
    }
    catch (e) {
        methods.debug(e);
    }
});

attach.init = function () {
    try {
        mp.players.forEach(_player =>
        {
            try {
                let data = _player.getVariable("attachmentsData");

                if(data && data.length > 0)
                {
                    let atts = data.split('|').map(att => parseInt(att, 36));
                    _player.__attachments = atts;
                    _player.__attachmentObjects = {};
                }
            }
            catch (e) {
                methods.debug(e);
            }
        });

        timer.createInterval('attach.timer', attach.timer, 5000);
    }
    catch (e) {
        methods.debug(e);
    }
};

attach.timer = function () {
    try {
        mp.vehicles.forEach(_vehicle =>
        {
            try {
                if(_vehicle.__attachmentObjects)
                {
                    for(let attachment in _vehicle.__attachmentObjects)
                    {
                        _vehicle.__attachmentObjects[attachment].position = new mp.Vector3(_vehicle.position.x, _vehicle.position.y, -90);
                    }
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

export default attach;