import methods from "../modules/methods";

const Natives = {
    GIVE_WEAPON_COMPONENT_TO_PED: methods.GIVE_WEAPON_COMPONENT_TO_PED,
    REMOVE_WEAPON_COMPONENT_FROM_PED: methods.REMOVE_WEAPON_COMPONENT_FROM_PED,
    SET_CURRENT_PED_WEAPON: methods.SET_CURRENT_PED_WEAPON,
    SET_PED_WEAPON_TINT_INDEX: methods.SET_PED_WEAPON_TINT_INDEX
};

let wpSync = {};

function addComponentToPlayer(player, weaponHash, componentHash) {
    try {
        if (!player.hasOwnProperty("__weaponComponentData")) player.__weaponComponentData = {};
        if (!player.__weaponComponentData.hasOwnProperty(weaponHash)) player.__weaponComponentData[weaponHash] = new Set();
        player.__weaponComponentData[weaponHash].add(componentHash);
        mp.game.invoke(Natives.GIVE_WEAPON_COMPONENT_TO_PED, player.handle, weaponHash, componentHash);
    }
    catch (e) {
        methods.debug(e);
    }
}

function removeComponentFromPlayer(player, weaponHash, componentHash) {
    try {
        if (!player.hasOwnProperty("__weaponComponentData")) player.__weaponComponentData = {};
        if (!player.__weaponComponentData.hasOwnProperty(weaponHash)) player.__weaponComponentData[weaponHash] = new Set();

        player.__weaponComponentData[weaponHash].delete(componentHash);
        mp.game.invoke(Natives.REMOVE_WEAPON_COMPONENT_FROM_PED, player.handle, weaponHash, componentHash);
    }
    catch (e) {
        methods.debug(e);
    }
}

mp.events.add("updatePlayerWeaponComponent", (player, weaponHash, componentHash, removeComponent) => {
    try {
        weaponHash = parseInt(weaponHash, 36);
        componentHash = parseInt(componentHash, 36);

        if (removeComponent) {
            removeComponentFromPlayer(player, weaponHash, componentHash);
        } else {
            addComponentToPlayer(player, weaponHash, componentHash);
        }
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add("resetPlayerWeaponComponents", (player, weaponHash) => {
    try {
        if (!player.hasOwnProperty("__weaponComponentData")) return;
        if (!player.__weaponComponentData.hasOwnProperty(weaponHash)) return;

        weaponHash = parseInt(weaponHash, 36);

        for (let component of player.__weaponComponentData[weaponHash]) mp.game.invoke(Natives.REMOVE_WEAPON_COMPONENT_FROM_PED, player.handle, weaponHash, componentHash);
        player.__weaponComponentData[weaponHash].clear();
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add("nukePlayerWeaponComponents", (player) => {
    try {
        if (!player.hasOwnProperty("__weaponComponentData")) return;

        for (let weapon in player.__weaponComponentData) {
            for (let component of player.__weaponComponentData[weapon]) mp.game.invoke(Natives.REMOVE_WEAPON_COMPONENT_FROM_PED, player.handle, weapon, component);
        }

        player.__weaponComponentData = {};
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.add("updatePlayerWeaponTint", (entity, value) => {
    try {
        if (entity.type === "player" && entity.handle !== 0) {
            let [weaponHash, tintIndex] = value.split("|");
            weaponHash = parseInt(weaponHash, 36);
            tintIndex = parseInt(tintIndex);
            mp.game.invoke(Natives.SET_PED_WEAPON_TINT_INDEX, entity.handle, weaponHash, tintIndex);
        }
    }
    catch (e) {
    }
});

mp.events.add("entityStreamIn", (entity) => {
    if (entity.type === "player") {
        try {
            let data = entity.getVariable("currentWeaponComponents");

            methods.debug('entityStreamIn:currentWeaponComponents', data);

            if (data) {
                let [weaponHash, components] = data.split(".");
                weaponHash = parseInt(weaponHash, 36);
                let componentsArray = (components && components.length > 0) ? components.split('|').map(hash => parseInt(hash, 36)) : [];

                // don't touch this or you will have a bad time
                entity.giveWeapon(weaponHash, -1, true);
                for (let component of componentsArray)
                    addComponentToPlayer(entity, weaponHash, component);
                mp.game.invoke(Natives.SET_CURRENT_PED_WEAPON, entity.handle, weaponHash, true);
            }

            let data2 = entity.getVariable("currentWeaponTint");

            if (data2) {
                let [weaponHash, tintIndex] = data2.split("|");
                weaponHash = parseInt(weaponHash, 36);
                tintIndex = parseInt(tintIndex);

                entity.giveWeapon(weaponHash, -1, true);
                mp.game.invoke(Natives.SET_PED_WEAPON_TINT_INDEX, entity.handle, weaponHash, tintIndex);
                mp.game.invoke(Natives.SET_CURRENT_PED_WEAPON, entity.handle, weaponHash, tintIndex);
            }
        }
        catch (e) {
            methods.debug(e);
        }
    }
});

mp.events.add("entityStreamOut", (entity) => {
    try {
        if (entity.type === "player" && entity.hasOwnProperty("__weaponComponentData"))
            entity.__weaponComponentData = {};
    }
    catch (e) {
        methods.debug(e);
    }
});

mp.events.addDataHandler("currentWeaponComponents", (entity, value) => {
    try {
        if (entity.type === "player" && entity.handle !== 0) {

            methods.debug('currentWeaponComponents', value);

            if (!entity.hasOwnProperty("__weaponComponentData"))
                entity.__weaponComponentData = {};

            let [weaponHash, components] = value.split(".");
            weaponHash = parseInt(weaponHash, 36);

            if (!entity.__weaponComponentData.hasOwnProperty(weaponHash))
                entity.__weaponComponentData[weaponHash] = new Set();

            let currentComponents = entity.__weaponComponentData[weaponHash];
            let newComponents = (components && components.length > 0) ? components.split('|').map(hash => parseInt(hash, 36)) : [];

            for (let component of currentComponents) {
                if (!newComponents.includes(component))
                    removeComponentFromPlayer(entity, weaponHash, component);
            }

            for (let component of newComponents) addComponentToPlayer(entity, weaponHash, component);
            mp.game.invoke(Natives.SET_CURRENT_PED_WEAPON, entity.handle, weaponHash, true);

            entity.__weaponComponentData[weaponHash] = new Set(newComponents);
        }
    }
    catch (e) {
        
    }
});

mp.events.addDataHandler("currentWeaponTint", (entity, value) => {
    try {
        if (entity.type === "player" && entity.handle !== 0) {
            let [weaponHash, tintIndex] = value.split("|");
            weaponHash = parseInt(weaponHash, 36);
            tintIndex = parseInt(tintIndex);
            mp.game.invoke(Natives.SET_PED_WEAPON_TINT_INDEX, entity.handle, weaponHash, tintIndex);
        }
    }
    catch (e) {
        
    }
});

export default wpSync;