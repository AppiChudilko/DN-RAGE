// script constants
import user from "../user";
import methods from "../modules/methods";

let shoot = {};

const localPlayer = mp.players.local;

const firingModes = {
    Auto: 0,
    Burst: 1,
    Single: 2,
    Safe: 3
};

const firingModeNames = ["AUTO", "BURST", "SINGLE", "SAFE"];

const ignoredWeaponGroups = [ // weapons in these groups are completely ignored
    mp.game.joaat("GROUP_UNARMED"), mp.game.joaat("GROUP_MELEE"), mp.game.joaat("GROUP_FIREEXTINGUISHER"), mp.game.joaat("GROUP_PARACHUTE"), mp.game.joaat("GROUP_STUNGUN"),
    mp.game.joaat("GROUP_THROWN"), mp.game.joaat("GROUP_PETROLCAN"), mp.game.joaat("GROUP_DIGISCANNER"), mp.game.joaat("GROUP_HEAVY")
];

const burstFireAllowedWeapons = [ mp.game.joaat("WEAPON_APPISTOL") ]; // if a weapon's group is already in burstFireAllowedGroups, don't put it here
const burstFireAllowedGroups = [ mp.game.joaat("GROUP_SMG"), mp.game.joaat("GROUP_MG"), mp.game.joaat("GROUP_RIFLE") ];

const singleFireBlacklist = [ // weapons in here are not able to use single fire mode
    mp.game.joaat("WEAPON_STUNGUN"), mp.game.joaat("WEAPON_FLAREGUN"), mp.game.joaat("WEAPON_MARKSMANPISTOL"), mp.game.joaat("WEAPON_REVOLVER"), mp.game.joaat("WEAPON_REVOLVER_MK2"),
    mp.game.joaat("WEAPON_DOUBLEACTION"), mp.game.joaat("WEAPON_PUMPSHOTGUN"), mp.game.joaat("WEAPON_PUMPSHOTGUN_MK2"), mp.game.joaat("WEAPON_SAWNOFFSHOTGUN"), mp.game.joaat("WEAPON_BULLPUPSHOTGUN"),
    mp.game.joaat("WEAPON_MUSKET"), mp.game.joaat("WEAPON_DBSHOTGUN"), mp.game.joaat("WEAPON_SNIPERRIFLE"), mp.game.joaat("WEAPON_HEAVYSNIPER"), mp.game.joaat("WEAPON_HEAVYSNIPER_MK2")
];

// script functions
const isWeaponIgnored = (weaponHash) => {
    return ignoredWeaponGroups.indexOf(mp.game.weapon.getWeapontypeGroup(weaponHash)) > -1;
};

const canWeaponUseBurstFire = (weaponHash) => {
    return burstFireAllowedGroups.indexOf(mp.game.weapon.getWeapontypeGroup(weaponHash)) > -1 ? true : (burstFireAllowedWeapons.indexOf(weaponHash) > -1);
};

const canWeaponUseSingleFire = (weaponHash) => {
    return singleFireBlacklist.indexOf(weaponHash) == -1;
};

// script variables
let currentWeapon = localPlayer.weapon;
let ignoreCurrentWeapon = isWeaponIgnored(currentWeapon);
let weaponConfig = {};
let lastWeaponConfigUpdate = 0;

// these are for the current weapon
let curFiringMode = 0;
let curBurstShots = 0;


shoot.getCurrentModeName = function () {
    return firingModeNames[curFiringMode].toLowerCase();
};

shoot.isIgnoreWeapon = function () {
    return ignoreCurrentWeapon;
};

shoot.getWeaponRecoil = function (wpHash) {
    if (user.getCache('stats_shooting') < 20)
        return 0.6;
    else if (user.getCache('stats_shooting') < 40)
        return 0.4;
    else if (user.getCache('stats_shooting') < 70)
        return 0.2;
    return 0.1;
};

/*let isAimActive = false;
mp.events.add("render", async () => {
    try {
        if (mp.game.player.isFreeAiming() && !isAimActive) {
            isAimActive = true;
            mp.game.cam.shakeGameplayCam("ROAD_VIBRATION_SHAKE", 0.2);
        }
        else if (isAimActive && !mp.game.player.isFreeAiming()) {
            mp.game.cam.stopGameplayCamShaking(false);
            isAimActive = false;
        }
    }
    catch (e) {
    }
});*/

mp.events.add("render", () => {
    try {
        if (localPlayer.weapon != currentWeapon) {
            currentWeapon = localPlayer.weapon;
            ignoreCurrentWeapon = isWeaponIgnored(currentWeapon);

            curFiringMode = weaponConfig[currentWeapon] === undefined ? firingModes.Auto : weaponConfig[currentWeapon];
            curBurstShots = 0;
        }

        if (ignoreCurrentWeapon) return;

        if (curFiringMode != firingModes.Auto) {
            if (curFiringMode == firingModes.Burst) {
                if (localPlayer.isShooting())
                    curBurstShots++;
                if (curBurstShots > 0 && curBurstShots < 3)
                    mp.game.controls.setControlNormal(0, 24, 1.0);

                if (curBurstShots == 3) {
                    mp.game.player.disableFiring(false);
                    if (mp.game.controls.isDisabledControlJustReleased(0, 24))
                        curBurstShots = 0;
                }
                if (localPlayer.isReloading())
                    curBurstShots = 0;
            } else if (curFiringMode == firingModes.Single) {
                if (mp.game.controls.isDisabledControlPressed(0, 24))
                    mp.game.player.disableFiring(false);
            } else if (curFiringMode == firingModes.Safe) {
                mp.game.player.disableFiring(false);
                if (mp.game.controls.isDisabledControlJustPressed(0, 24))
                    mp.game.audio.playSoundFrontend(-1, "Faster_Click", "RESPAWN_ONLINE_SOUNDSET", true);
            }
        }
    }
    catch (e) {

    }
});

mp.events.add('client:changeFireMod', () => {
    if (ignoreCurrentWeapon) return;

    try {
        let newFiringMode = curFiringMode + 1;
        if (newFiringMode > firingModes.Safe) newFiringMode = firingModes.Auto;

        if (newFiringMode == firingModes.Burst) {
            if (!canWeaponUseBurstFire(currentWeapon))
                newFiringMode = canWeaponUseSingleFire(currentWeapon) ? firingModes.Single : firingModes.Safe;
        } else if (newFiringMode == firingModes.Single) {
            if (!canWeaponUseSingleFire(currentWeapon))
                newFiringMode = firingModes.Safe;
        }

        if (curFiringMode != newFiringMode) {
            curFiringMode = newFiringMode;
            curBurstShots = 0;
            lastWeaponConfigUpdate = Date.now();

            mp.game.audio.playSoundFrontend(-1, "Faster_Click", "RESPAWN_ONLINE_SOUNDSET", true);
            weaponConfig[currentWeapon] = curFiringMode;
        }
    }
    catch (e) {

    }
});

export default shoot;