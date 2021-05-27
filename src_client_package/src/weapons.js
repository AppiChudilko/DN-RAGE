import items from "./items";
import UIMenu from "./modules/menu";
import methods from "./modules/methods";

let weapons = {};

weapons.hashesMap = [];
weapons.components = [];

let hashesMap = [];
let components = [];

weapons.getMapList = function() {
    return hashesMap;
};

weapons.setMapList = function(data) {
    hashesMap = data;
};

weapons.getComponentList = function() {
    return components;
};

weapons.setComponentList = function(data) {
    components = data;
};

weapons.getWeaponComponentList = function(weaponName) {
    let list = [];
    weapons.getComponentList().forEach(item => {
        if (item[0] == weaponName) {
            list.push(item);
        }
    });
    return list;
};

weapons.getWeaponComponentName = function(weaponName, hash) {
    let component = '';
    weapons.getComponentList().forEach(item => {
        if (item[0] == weaponName && item[2] == hash) {
            component = item[1];
        }
    });
    return component;
};

weapons.getHashByName = function(name) {
    let hash = 0;
    weapons.getMapList().forEach(item => {
        if (item[0] == name)
            hash = item[1] / 2;
    });
    return hash;
};

weapons.getNameByHash = function(hash) {
    let name = '';
    weapons.getMapList().forEach(item => {
        if (item[1] / 2 == hash)
            name = item[0];
    });
    return name;
};

weapons.getDamageByHash = function(hash) {
    let damage = 1;
    weapons.getMapList().forEach(item => {
        if (item[1] / 2 == hash)
            damage = item[2];
    });
    return damage;
};

weapons.getTintName = function(wpName, tint) {
    tint = methods.parseInt(tint);
    let tintList = ['','Green','Gold','Pink','Desert','Tactical','Orange','Platinum'];
    let tintList2 = ['','Classic Gray','Classic Two-Tone','Classic White','Classic Beige','Classic Green','Classic Blue','Classic Earth','Classic Brown & Black','Red Contrast','Blue Contrast','Yellow Contrast','Orange Contrast','Bold Pink','Bord Purple & Yellow','Bold Orange','Bold Green & Purple','Bold Red Features','Bold Green Features','Bold Cyan Features','Bold Yellow Features','Bold Red & White','Bold Blue & White','Metallic Gold','Metallic Platinum','Metallic Gray & Lilac','Metallic Purple & Lime','Metallic Red','Metallic Green','Metallic Blue','Metallic White & Aqua','Metallic Red & Yellow'];
    if (wpName.indexOf('_mk2') >= 0)
        return tintList2[tint];
    return tintList[tint];
};

weapons.getTintList = function(wpName) {
    let tintList = ['','Green','Gold','Pink','Desert','Tactical','Orange','Platinum'];
    let tintList2 = ['','Classic Gray','Classic Two-Tone','Classic White','Classic Beige','Classic Green','Classic Blue','Classic Earth','Classic Brown & Black','Red Contrast','Blue Contrast','Yellow Contrast','Orange Contrast','Bold Pink','Bord Purple & Yellow','Bold Orange','Bold Green & Purple','Bold Red Features','Bold Green Features','Bold Cyan Features','Bold Yellow Features','Bold Red & White','Bold Blue & White','Metallic Gold','Metallic Platinum','Metallic Gray & Lilac','Metallic Purple & Lime','Metallic Red','Metallic Green','Metallic Blue','Metallic White & Aqua','Metallic Red & Yellow'];
    if (wpName.indexOf('_mk2') >= 0)
        return tintList2;
    return tintList;
};

/*
1 - Надульник (Глушитель, Компенсатор и тд) - Suppressor / Compensator
2 - Фонарик, Лазерный прицел (Если есть) - Flashlight
3 - Прицел - Scope
5 - Рукоятка - Grip
* */

weapons.getUpgradeSlot = function(weaponName, hash) {

    let result = -1;
    weapons.getComponentList().forEach(item => {
        if (item[0] == weaponName && hash == item[2])
            result = item[3];
    });

    switch (result) {
        case 1:
            return 1;
        case 2:
            return 2;
        case 5:
            return 3;
        case 3:
            return 4;
    }
    return -1;
};

weapons.getGunSlotId = function(name) {
    switch (name) {
        case 'weapon_microsmg':
        case 'weapon_smg':
        case 'weapon_smg_mk2':
        case 'weapon_assaultsmg':
        case 'weapon_combatpdw':
        case 'weapon_machinepistol':
        case 'weapon_minismg':
        case 'weapon_raycarbine':

        case 'weapon_assaultrifle':
        case 'weapon_assaultrifle_mk2':
        case 'weapon_carbinerifle':
        case 'weapon_carbinerifle_mk2':
        case 'weapon_advancedrifle':
        case 'weapon_specialcarbine':
        case 'weapon_specialcarbine_mk2':
        case 'weapon_bullpuprifle':
        case 'weapon_bullpuprifle_mk2':
        case 'weapon_compactrifle':

        case 'weapon_mg':
        case 'weapon_combatmg':
        case 'weapon_combatmg_mk2':
        case 'weapon_gusenberg':

        case 'weapon_rpg':
        case 'weapon_grenadelauncher':
        case 'weapon_grenadelauncher_smoke':
        case 'weapon_minigun':
        case 'weapon_firework':
        case 'weapon_railgun':
        case 'weapon_hominglauncher':
        case 'weapon_compactlauncher':
        case 'weapon_rayminigun':

        case 'weapon_sniperrifle':
        case 'weapon_heavysniper':
        case 'weapon_heavysniper_mk2':
        case 'weapon_marksmanrifle':
        case 'weapon_marksmanrifle_mk2':
            return 1;
        case 'weapon_pumpshotgun':
        case 'weapon_pumpshotgun_mk2':
        case 'weapon_sawnoffshotgun':
        case 'weapon_assaultshotgun':
        case 'weapon_bullpupshotgun':
        case 'weapon_musket':
        case 'weapon_heavyshotgun':
        case 'weapon_dbshotgun':
        case 'weapon_autoshotgun':
            return 2;
        case 'weapon_grenade':
        case 'weapon_bzgas':
        case 'weapon_molotov':
        case 'weapon_stickybomb':
        case 'weapon_proxmine':
        case 'weapon_snowball':
        case 'weapon_pipebomb':
        case 'weapon_ball':
        case 'weapon_smokegrenade':
        case 'weapon_flare':
            return 3;
        case 'weapon_pistol':
        case 'weapon_pistol_mk2':
        case 'weapon_combatpistol':
        case 'weapon_appistol':
        case 'weapon_pistol50':
        case 'weapon_snspistol':
        case 'weapon_snspistol_mk2':
        case 'weapon_heavypistol':
        case 'weapon_vintagepistol':
        case 'weapon_flaregun':
        case 'weapon_marksmanpistol':
        case 'weapon_revolver':
        case 'weapon_revolver_mk2':
        case 'weapon_doubleaction':
        case 'weapon_raypistol':
        case 'weapon_ceramicpistol':
        case 'weapon_navyrevolver':
            return 4;
        case 'weapon_stungun':
        case 'weapon_dagger':
        case 'weapon_bat':
        case 'weapon_bottle':
        case 'weapon_crowbar':
        case 'weapon_flashlight':
        case 'weapon_golfclub':
        case 'weapon_hammer':
        case 'weapon_hatchet':
        case 'weapon_knuckle':
        case 'weapon_knife':
        case 'weapon_machete':
        case 'weapon_switchblade':
        case 'weapon_nightstick':
        case 'weapon_wrench':
        case 'weapon_battleaxe':
        case 'weapon_poolcue':
        case 'weapon_stone_hatchet':
        case 'weapon_petrolcan':
        case 'weapon_hazardcan':
        case 'weapon_fireextinguisher':
            return 5;
    }
    return 1;
};

weapons.getGunSlotIdByItem = function(itemId) {
    return weapons.getGunSlotId(items.getItemNameHashById(itemId));
};

weapons.getGunAmmoNameByItemId = function(itemId) {
    return weapons.getGunAmmoId(items.getItemNameHashById(itemId));
};

weapons.getGunAmmoId = function(name) {
    switch (name) {
        case 'weapon_appistol':
        case 'weapon_assaultsmg':
        case 'weapon_advancedrifle':
        case 'weapon_assaultrifle':
        case 'weapon_specialcarbine':
        case 'weapon_specialcarbine_mk2':
        case 'weapon_carbinerifle':
        case 'weapon_carbinerifle_mk2':
        case 'weapon_bullpuprifle':
        case 'weapon_bullpuprifle_mk2':
            return 284; //5.56mm

        case 'weapon_compactrifle':
            return 283; //5.45mm

        case 'weapon_heavysniper_mk2':
        case 'weapon_heavysniper':
            return 285; //12.7mm

        case 'weapon_compactlauncher':
        case 'weapon_grenadelauncher':
        case 'weapon_railgun':
            return 290; //Грантамет подствольный

        case 'weapon_firework':
            return 289; //Феерверк

        case 'weapon_hominglauncher':
            return 292; //Stringer

        case 'weapon_rpg':
            return 291; //RPG

        case 'weapon_combatmg':
        case 'weapon_combatmg_mk2':
        case 'weapon_mg':
        case 'weapon_gusenberg':
        case 'weapon_assaultrifle_mk2':
        case 'weapon_marksmanrifle':
        case 'weapon_marksmanrifle_mk2':
        case 'weapon_sniperrifle':
        case 'weapon_minigun':
            return 282; //7.62mm

        case 'weapon_assaultshotgun':
        case 'weapon_bullpupshotgun':
        case 'weapon_dbshotgun':
        case 'weapon_heavyshotgun':
        case 'weapon_musket':
        case 'weapon_pumpshotgun':
        case 'weapon_pumpshotgun_mk2':
        case 'weapon_sawnoffshotgun':
        case 'weapon_autoshotgun':
            return 281; //12 калибр

        case 'weapon_combatpistol':
        case 'weapon_pistol':
        case 'weapon_pistol_mk2':
        case 'weapon_ceramicpistol':
        case 'weapon_snspistol':
        case 'weapon_snspistol_mk2':
        case 'weapon_combatpdw':
        case 'weapon_machinepistol':
        case 'weapon_microsmg':
        case 'weapon_minismg':
        case 'weapon_smg':
        case 'weapon_smg_mk2':
            return 280; //9mm

        case 'weapon_heavypistol':
        case 'weapon_vintagepistol':
        case 'weapon_doubleaction':
            return 286; //.45 ACP

        case 'weapon_revolver':
        case 'weapon_revolver_mk2':
        case 'weapon_marksmanpistol':
        case 'weapon_pistol50':
            return 287; //.44 Magnum

        case 'weapon_flaregun':
            return 288; //Патроны сигнального пистолета

        default:
            return -1;
    }
};

export default weapons;