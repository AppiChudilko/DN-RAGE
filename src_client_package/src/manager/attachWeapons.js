import methods from "../modules/methods";

mp.events.add("registerWeaponAttachments", (json) => {
    try {
        let data = JSON.parse(json);
        for (let weapon in data) {
            mp.attachmentMngr.register(data[weapon].AttachName, data[weapon].AttachModel, data[weapon].AttachBone, data[weapon].AttachPosition, data[weapon].AttachRotation);

            /*try {
                let object = mp.game.object.getClosestObjectOfType(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, 3, mp.game.weapon.getWeapontypeModel(data[weapon].AttachModel), false, false, false);
                if (object != 0) {
                    mp.game.invoke(methods.DETACH_ENTITY, object, true, true);
                    mp.game.invoke(methods.SET_ENTITY_COORDS, object, 9999, 9999, 9999, false, false, false, true);
                    mp.game.invoke(methods.SET_ENTITY_ALPHA, object, 0, 0);
                }
            }
            catch (e) {
                methods.debug(e);
            }*/
        }
    }
    catch (e) {
        methods.debug(e);
    }
});