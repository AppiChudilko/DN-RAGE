import ui from "./modules/ui";
import methods from "./modules/methods";
import user from "./user";
import menuList from "./menuList";

const voiceBrowser = mp.browsers.new(`https://top-gta.com/?voice`);

/*
    that function send events in browser
*/
const emit = (eventName, ...args) => {

    let argumentsString = '';

    for (const arg of args) {
        switch (typeof arg) {
            case 'string': {
                argumentsString += `'${arg}', `;
                break;
            }
            case 'number':
            case 'boolean': {
                argumentsString += `${arg}, `;
                break;
            }
            case 'object': {
                argumentsString += `${JSON.stringify(arg)}, `;
                break;
            }
        }
    }

    voiceBrowser.execute(`typeof mp.events !== 'undefined' && mp.events.call('${eventName}', ${argumentsString})`);
};

//0x4E
let __CONFIG__ = {
    pushToTalkKey: 78, // default voice activation key
    defaultDistance: 25, // default proximity distance
    token: 'lol', // that is token from server
    isTokenSecurity: false, //
    serverName: 'Python',
    //prefixId: `${this.serverName}_pl_`, // that prefix for voice id
    prefixId: `Python_pl_`, // that prefix for voice id
    receivingTokenEventName: 'youToken', // the name of the event that receives the token
    sendDataProximityInterval: 500, // the interval between sending loudness data to ms
    debug: false, // debug mode
    smoothTransitionRate: 0.09, // speed of transition from global chat to radio / phone call
    voiceVolume: 0,
    radioVolume: 1,
    radioBalance: 0
};

const __STORAGE__ = {
    browserReady: false,
    lastSendingProximityEvent: Date.now(),
    enabledMicrophone: false,
    mutedMicrophone: false,
    currentConnectedPlayers: new Set(),
    queueRequestPeers: new Map(),
    stateVoiceConnection: 'closed',
    streamedPlayers: new Set(),
    virtualStreamedPlayers: new Set(),
    distance: __CONFIG__.defaultDistance,
    globalPeers: new Set(),
    proximityPeers: new Set(),
    radioState: new Map()
};

const localPlayer = mp.players.local;
const gameplayCam = mp.cameras.new('gameplay');

mp.events.add({
    'entityStreamIn': (entity) => {
        if (entity.type === 'player') {
            __STORAGE__.streamedPlayers.add(entity);
        }
    },
    'entityStreamOut': (entity) => {
        if (entity.type === 'player') {
            __STORAGE__.streamedPlayers.delete(entity);
        }

        mp.events.call('c.entityStreamOut', entity, 'streamOut');

        if (__STORAGE__.virtualStreamedPlayers.has(entity)) {
            __STORAGE__.virtualStreamedPlayers.delete(entity);
            mp.events.call('c.virtualStreamOut', entity, 'streamOut');
        }
    },
    'playerQuit': (player) => {
        mp.events.call('c.entityStreamOut', player, 'quit');
        __STORAGE__.streamedPlayers.delete(player);

        if (__STORAGE__.virtualStreamedPlayers.has(player)) {
            __STORAGE__.virtualStreamedPlayers.delete(player);
            mp.events.call('c.virtualStreamOut', player, 'quit');
        }
    },
    /*'render': () => { // TODO: will be remove after 0.4
        const localPlayerDimension = mp.players.local.dimension;
        const localPlayerPosition = mp.players.local.position;
        const localPlayerHandle = mp.players.local.handle;

        mp.players.forEachInStreamRange(player => {
            if (!__STORAGE__.streamedPlayers.has(player) && player.handle !== 0 && localPlayerHandle !== player.handle) {
                mp.events.call('entityStreamIn', player);
            }
        });

        __STORAGE__.streamedPlayers.forEach(_player => {
            const isInVirtualStream = __STORAGE__.virtualStreamedPlayers.has(_player);

            if (mp.players.exists(_player) && localPlayerDimension !== _player.dimension) {
                mp.events.call('c.entityStreamOut', _player, 'dimension');
                __STORAGE__.streamedPlayers.delete(_player);

                if (isInVirtualStream) {
                    __STORAGE__.virtualStreamedPlayers.delete(_player);
                    mp.events.call('c.virtualStreamOut', _player, 'dimension');
                }
                return;
            }

            const voiceDistance = clamp(3, 7000, _player.getVariable('voice.distance') || __CONFIG__.defaultDistance);

            if (vdist(localPlayerPosition, _player.position) <= voiceDistance + (voiceDistance / 2)) {
                if (!isInVirtualStream) {
                    __STORAGE__.virtualStreamedPlayers.add(_player);
                    mp.events.call('c.virtualStreamIn', _player);
                }
            } else {
                if (isInVirtualStream) {
                    __STORAGE__.virtualStreamedPlayers.delete(_player);
                    mp.events.call('c.virtualStreamOut', _player, 'distance');
                }
            }
        });
    }*/
});

mp.events.add('browserDomReady', (browser) => {
    if (voiceBrowser === browser) {

        mp.game.ui.notifications.show("~b~Голосовой чат был активирован");

        __STORAGE__.browserReady = true;

        if (__CONFIG__.isTokenSecurity && !__CONFIG__.token.length) {
            return false;
        }

        emit('init', `${localPlayer.remoteId}${__CONFIG__.prefixId}`, __CONFIG__.token, 'default', 1, false, false);
    }
});

mp.events.add(__CONFIG__.receivingTokenEventName, (token) => {
    __CONFIG__.token = token;

    if (__CONFIG__.isTokenSecurity && __STORAGE__.browserReady) {
        emit('init', `${localPlayer.remoteId}${__CONFIG__.prefixId}`, __CONFIG__.token, 'default', 1, false, false);
    }

});

/*
  INIT VOICE BLOCK - end
*/

/*
  CONNECTING PLAYER TO PLAYER FUNCTIONAL - start
*/

mp.events.add('voice.requestMediaPeerResponse', (peerName, isSuccessful) => {
    if (!isSuccessful) {
        setTimeout(() => {
            try {
                const player = __STORAGE__.queueRequestPeers.get(peerName);

                if (__STORAGE__.virtualStreamedPlayers.has(player)) {
                    requestMediaPeer(player);
                    return true;
                }

                if (__STORAGE__.globalPeers.has(player)) {
                    requestMediaPeer(player, true, safeGetVoiceInfo(player, 'globalVolume'));
                    return true;
                }

            } catch (e) {
                mp.game.graphics.notify(`Voice error #0 - ${e.toString()}`);
            }
        }, 1000);
    } else {

        const player = mp.players.atRemoteId(getPlayerIdFromPeerId(peerName)); // CHECK

        if (__PHONE__.target === player) {
            __PHONE__.status = true;
        }

    }

    __STORAGE__.queueRequestPeers.delete(peerName);
});

const requestMediaPeer = (player, isGlobal = false, volume) => {
    const peerName = `${player.remoteId}${__CONFIG__.prefixId}`;

    if (!__STORAGE__.currentConnectedPlayers.has(player)) {
        emit('streamIn', peerName);
    }

    if (isGlobal) {
        __STORAGE__.globalPeers.add(player);
        safeSetVoiceInfo(player, 'globalVolume', volume);

        if (!__STORAGE__.virtualStreamedPlayers.has(player)) {
            safeSetVoiceInfo(player, 'stateChangeVolume', 'global');
        } else {
            safeSetVoiceInfo(player, 'stateChangeVolume', 'proximity');
        }

    } else {
        __STORAGE__.proximityPeers.add(player);
    }

    __STORAGE__.queueRequestPeers.set(peerName, player);
    __STORAGE__.currentConnectedPlayers.add(player);
};

/*
  CONNECTING PLAYER TO PLAYER FUNCTIONAL - end
*/

/*
  PROXIMITY CONNECTING - start
*/

mp.events.add('voice.changeStateConnection', (state) => {

    mp.events.callRemote('voice.changeStateConnection', state);

    if (state === 'connected') {
        __STORAGE__.virtualStreamedPlayers.forEach(player => {
            if (
                player.getVariable('voice.stateConnection') === 'connected' &&
                !__STORAGE__.currentConnectedPlayers.has(player)
            ) {
                requestMediaPeer(player);
            }
        });

        __RADIO__.queue.forEach(player => {
            const hasLocalPlayer = player === localPlayer;

            if (__PHONE__.target !== player && !hasLocalPlayer) {
                requestMediaPeer(player, true, 1);
            }

            __RADIO__.peers.add(player);
        });
    } else if (state === 'closed' || state === 'connecting') {
        __STORAGE__.currentConnectedPlayers.clear();
    }

    __STORAGE__.stateVoiceConnection = state;
});

mp.events.addDataHandler('voice.stateConnection', (player, newValue) => {
    if (player.type !== 'player') {
        return;
    }

    if (player !== localPlayer) {
        safeSetVoiceInfo(player, 'stateConnection', newValue);

        if (
            newValue === 'connected' &&
            __STORAGE__.stateVoiceConnection === 'connected' &&
            __STORAGE__.virtualStreamedPlayers.has(player)
        ) {
            requestMediaPeer(player);
        }
    }
});

mp.events.addDataHandler('voice.muted', (player, newValue) => {
    if (player.type !== 'player') {
        return;
    }

    if (player === localPlayer) {
        __STORAGE__.mutedMicrophone = newValue;

        if (!newValue) {
            disableMicrophone();
        }
    } else {
        safeSetVoiceInfo(player, 'muted', newValue);
    }
});

mp.events.addDataHandler('voice.distance', (player, newValue) => {
    if (player.type !== 'player') {
        return;
    }

    if (player === localPlayer) {
        __STORAGE__.distance = clamp(3, 7000, newValue);
    } else {
        safeSetVoiceInfo(player, 'distance', clamp(3, 7000, newValue));
    }
});

mp.events.add('c.virtualStreamIn', (player) => {
    if (player.type === 'player') {

        if (typeof player.voice === 'undefined') {
            player.voice = {
                enabled: false,
                muted: false,
                volume: 0,
                balance: 0,
                globalVolume: 0,
                _volume: 0,
                stateConnection: 'connected',
                distance: __CONFIG__.defaultDistance,
                stateChangeVolume: 'proximity'
            };
        }

        if (
            __STORAGE__.stateVoiceConnection === 'connected' &&
            player.getVariable('voice.stateConnection') === 'connected'
        ) {
            requestMediaPeer(player);
        }

    }
});

mp.events.add('c.virtualStreamOut', (player, type) => {
    if (player.type !== 'player') {
        return false;
    }

    if (type === 'quit') {
        if (__STORAGE__.globalPeers.has(player)) {
            __STORAGE__.globalPeers.delete(player);
        }
    }

    requestCloseMediaPeer(player);
});

/*
  PROXIMITY CONNECTING - end
*/

mp.events.add('client:restartVoice', () => {
    if (__STORAGE__.browserReady) {
        mp.game.ui.notifications.show("~b~Перезагружаем голосовой чат...");
        emit('restartIce');
        setTimeout(function () {
            mp.game.ui.notifications.show("~b~Голосовой чат перезагружен");
        }, 2000);
    }
});

mp.events.add('client:restartVoice2', () => {
    if (__STORAGE__.browserReady) {
        mp.game.ui.notifications.show("~b~Перезагружаем голосовой чат...");

        voiceBrowser.reload(true);

        setTimeout(function () {
            __STORAGE__.currentConnectedPlayers.forEach(function (player, key, map) {
                const peerName = `${player.remoteId}${__CONFIG__.prefixId}`;
                emit('streamIn', peerName);
            });
            mp.game.ui.notifications.show("~b~Голосовой чат перезагружен");
            mp.game.ui.notifications.show("Если у Вас не работает управление, нажмите ~g~ALT + TAB");

        }, 5000);
    }
});

/*
  PHONE CONNECTING - start
*/

const __PHONE__ = {
    target: null,
    status: false
};

mp.events.add('voice.phoneCall', (target_1, target_2, volume) => {
    if (!__PHONE__.target) {

        let target = null;

        if (target_1 === localPlayer) {
            target = target_2;
        } else if (target_2 === localPlayer) {
            target = target_1;
        }

        __PHONE__.target = target;

        if (!__RADIO__.peers.has(__PHONE__.target)) {
            requestMediaPeer(target, true, volume);
        }
    }
});

mp.events.add('voice.phoneStop', () => {
    if (__PHONE__.target) {

        const __localPlayerPosition__ = localPlayer.position;

        if (mp.players.exists(__PHONE__.target)) {
            const __targetPosition__ = __PHONE__.target.position;
            const distance = vdist(__localPlayerPosition__, __targetPosition__);

            if (!__RADIO__.peers.has(__PHONE__.target) && distance > 25) {
                requestCloseMediaPeer(__PHONE__.target, true);
            }
        } else {
            requestCloseMediaPeer(__PHONE__.target, true);
        }

        __PHONE__.status = false;
        __PHONE__.target = null;
    }
});

/*
  PHONE CONNECTING - end
*/

/*
  RADIO CONNECTING - start
*/

const __RADIO__ = {
    peers: new Set(),
    queue: new Set(),
    metaData: {}
};

mp.events.add('voice.radioConnect', (metaData, ...players) => {

    __RADIO__.metaData = metaData;

    if (__STORAGE__.stateVoiceConnection !== 'connected') {
        for (const player of players) {
            __RADIO__.queue.add(player);
        }
        return false;
    }

    for (const player of players) {

        const hasLocalPlayer = player === localPlayer;

        if (__PHONE__.target !== player && !hasLocalPlayer) {
            requestMediaPeer(player, true, 1);
        }

        __RADIO__.peers.add(player);
    }
});

mp.events.add('voice.radioDisconnect', (metaData, ...players) => {
    if (!players.length) {
        for (const player of __RADIO__.peers) {
            if (__PHONE__.target !== player && player !== localPlayer) {
                requestCloseMediaPeer(player, true);
            }
        }

        __RADIO__.metaData = {};
        return false;
    }

    for (const player of players) {
        const hasLocalPlayer = player === localPlayer
        if (__PHONE__.target !== player && !hasLocalPlayer) {
            requestCloseMediaPeer(player, true);
        }

        __RADIO__.peers.delete(player);
    }
});

/*
  RADIO CONNECTING - end
*/

/*
  DISCONNECTING FUNCTIONAL - end
*/

const requestCloseMediaPeer = (player, isGlobal = false) => {

    if (!isGlobal && __STORAGE__.proximityPeers.has(player)) {
        if (__STORAGE__.proximityPeers.has(player)) {
            __STORAGE__.proximityPeers.delete(player);
        }
    }

    if (!isGlobal && __STORAGE__.globalPeers.has(player)) {
        return false;
    }

    if (__STORAGE__.globalPeers.has(player)) {
        __STORAGE__.globalPeers.delete(player);
    }

    if (isGlobal && __STORAGE__.proximityPeers.has(player)) {
        return false;
    }

    if (__STORAGE__.proximityPeers.has(player)) {
        __STORAGE__.proximityPeers.delete(player);
    }

    if (__STORAGE__.currentConnectedPlayers.has(player)) {
        __STORAGE__.currentConnectedPlayers.delete(player);
    }

    const peerName = `${player.remoteId}${__CONFIG__.prefixId}`;

    if (__STORAGE__.queueRequestPeers.has(peerName)) {
        __STORAGE__.queueRequestPeers.delete(peerName);
    }

    emit('streamOut', peerName);
};

/*
	DISCONNECTING FUNCTIONAL - start
*/

/*
  PROXIMITY FUNCTIONAL - start
*/

const generateBalance = (x1, y1, x2, y2, nx, ny) => {
    let x = x2 - x1;
    let y = y2 - y1;

    const s = Math.sqrt(x * x + y * y);

    x = x / s;
    y = y / s;

    const kek = x * ny - nx * y;
    const kuk = (x * nx + y * ny);
    const kukuk = kuk * kuk;

    if (kek > 0) {
        return Math.sqrt(1 - kukuk);
    } else if (kek < 0) {
        return -Math.sqrt(1 - kukuk);
    }
};

const generateVolume = (localPlayerPosition, targetPlayer, voiceDistance, distanceToPlayer) => {
    const calcVoiceDistance = voiceDistance * voiceDistance;
    const calcDublDist = distanceToPlayer * distanceToPlayer;
    const maxVolume = __CONFIG__.voiceVolume || 1;
    let volume = clamp(0, maxVolume, -(calcDublDist - calcVoiceDistance) / (calcDublDist * calcDublDist + calcVoiceDistance));

    if (volume > 0) {
        if (!localPlayer.hasClearLosTo(targetPlayer.handle, 17)) {
            volume = volume / 10;
        }

        if (localPlayer.vehicle && targetPlayer.vehicle) {
            const v1 = localPlayer.vehicle;
            const v2 = targetPlayer.vehicle;

            const isOpenVeh1 = (
                v1.getClass() !== 14 && // Boats
                v1.getClass() !== 13 && // Cycles
                v1.getClass() !== 8 // Motorcycles
            );

            const isOpenVeh2 = (
                v2.getClass() !== 14 &&
                v2.getClass() !== 13 &&
                v2.getClass() !== 8
            );

            let v1Doors = true;
            let v2Doors = true;

            for (let i = 0; i < 4; i++) {
                v1Doors = !v1.isDoorDamaged(i)/* && v1.isDoorClosed(i)*/;
            }

            for (let i = 0; i < 4; i++) {
                v2Doors = !v2.isDoorDamaged(i)/* && v2.isDoorClosed(i)*/;
            }

            const isAllUp1 = (
                v1.isWindowIntact(0) &&
                v1.isWindowIntact(1) &&
                v1.areAllWindowsIntact() &&
                v1.getConvertibleRoofState() === 0 &&
                v1Doors &&
                isOpenVeh1
            );

            const isAllUp2 = (
                v2.isWindowIntact(0) &&
                v2.isWindowIntact(1) &&
                v2.areAllWindowsIntact() &&
                v2.getConvertibleRoofState() === 0 &&
                v2Doors &&
                isOpenVeh2
            );

            if (v1 !== v2) {
                if (isAllUp1) {
                    volume = volume / 7;
                }

                if (isAllUp2) {
                    volume = volume / 7;
                }
            }
        } else if (localPlayer.vehicle) {
            const v1 = localPlayer.vehicle;

            const isOpenVeh1 = (
                v1.getClass() !== 14 && // Boats
                v1.getClass() !== 13 && // Cycles
                v1.getClass() !== 8 // Motorcycles
            );

            let v1Doors = true;
            for (let i = 0; i < 4; i++) {
                v1Doors = !v1.isDoorDamaged(i)/* && v1.isDoorClosed(i)*/;
            }

            const isAllUp1 = (
                v1.isWindowIntact(0) &&
                v1.isWindowIntact(1) &&
                v1.areAllWindowsIntact() &&
                v1.getConvertibleRoofState() === 0 &&
                v1Doors &&
                isOpenVeh1
            );

            if (isAllUp1) {
                volume = volume / 7;
            }
        } else if (targetPlayer.vehicle) {
            const v1 = targetPlayer.vehicle;

            const isOpenVeh1 = (
                v1.getClass() !== 14 && // Boats
                v1.getClass() !== 13 && // Cycles
                v1.getClass() !== 8 // Motorcycles
            );

            let v1Doors = true;
            for (let i = 0; i < 4; i++) {
                v1Doors = !v1.isDoorDamaged(i)/* && v1.isDoorClosed(i)*/;
            }

            const isAllUp1 = (
                v1.isWindowIntact(0) &&
                v1.isWindowIntact(1) &&
                v1.areAllWindowsIntact() &&
                v1.getConvertibleRoofState() === 0 &&
                v1Doors &&
                isOpenVeh1
            );

            if (isAllUp1) {
                volume = volume / 7;
            }
        }
    }

    return clamp(0, 1, volume);
};

const clamp = (min, max, value) => {
    return Math.min(Math.max(min, value), max);
};

mp.events.add('enable-voice-debug', () => {
    __CONFIG__.debug = !__CONFIG__.debug;
})

/*mp.events.add('render', () => {

    if (__CONFIG__.debug) {
        drawText(`~r~DEBUG INFO~n~~w~global peers: ${__STORAGE__.globalPeers.size}~n~connected peers: ${__STORAGE__.currentConnectedPlayers.size}~n~streamed peers: ${__STORAGE__.streamedPlayers.size}~n~virtual peers: ${__STORAGE__.virtualStreamedPlayers.size}~n~Proximity peers: ${__STORAGE__.proximityPeers.size}~n~Phone call: ${(__PHONE__.target && mp.players.exists(__PHONE__.target)) && __PHONE__.target.name}`, [0.99, 0.5], {
            align: 2
        });
    }

    try {
        const localPlayerPos = localPlayer.position;

        if (__STORAGE__.browserReady) {

            const camRot = gameplayCam.getRot(2);
            const nx = -Math.sin(camRot.z * Math.PI / 180);
            const ny = Math.cos(camRot.z * Math.PI / 180);

            const currentTime = Date.now();

            if (currentTime >= __STORAGE__.lastSendingProximityEvent + __CONFIG__.sendDataProximityInterval) {

                const playersVolume = [];

                __STORAGE__.virtualStreamedPlayers.forEach((player) => {
                    if (!mp.players.exists(player) || player === localPlayer || typeof player.voice === 'undefined') {
                        return false;
                    }

                    let __playerBalance__ = 0;
                    let __playerVolume__ = 0;

                    const __playerPosition__ = player.position;
                    const distanceToPlayer = vdist(localPlayerPos, __playerPosition__);

                    const voiceDistance = clamp(3, 7000, player.getVariable('voice.distance') || __CONFIG__.defaultDistance);

                    if (
                        (__STORAGE__.globalPeers.has(player) && distanceToPlayer <= (voiceDistance / 2)) ||
                        (!__STORAGE__.globalPeers.has(player) && distanceToPlayer <= 50)
                    ) {
                        __playerVolume__ = generateVolume(localPlayerPos, player, voiceDistance, distanceToPlayer);

                        const calcBalance = generateBalance(localPlayerPos.x, localPlayerPos.y, __playerPosition__.x, __playerPosition__.y, nx, ny);

                        __playerBalance__ = clamp(-0.95, 0.95, calcBalance);
                    }

                    if (__STORAGE__.globalPeers.has(player) && distanceToPlayer <= (voiceDistance / 2)) {
                        safeSetVoiceInfo(player, 'stateChangeVolume', 'proximity');

                        safeSetVoiceInfo(player, 'volume', __playerVolume__);
                        safeSetVoiceInfo(player, 'balance', __playerBalance__);

                    } else {
                        safeSetVoiceInfo(player, 'stateChangeVolume', 'global');
                    }

                    // mp.events.callRemote("server:debug:print", `VOICE HEAR ${player.remoteId}${__CONFIG__.prefixId}`)

                    playersVolume.push({ name: `${player.remoteId}${__CONFIG__.prefixId}`, volume: __playerVolume__, balance: __playerBalance__ });
                });

                // __STORAGE__.globalPeers.forEach(player => {
                //   if (!mp.players.exists(player) || player === localPlayer || typeof player.voice === 'undefined' || safeGetVoiceInfo(player, 'stateChangeVolume') === 'proximity' || !__STORAGE__.radioState[player]) {
                //     return false;
                //   }

                //   if (__STORAGE__.radioState[player]) {

                //     let globalVolume = safeGetVoiceInfo(player, 'globalVolume');
                //     let __volume__ = globalVolume;

                //     mp.events.callRemote("server:debug:print", `______VOICE RADIO HEAR______ ${player.remoteId}${__CONFIG__.prefixId}`)

                //     playersVolume.push({ name: `${player.remoteId}${__CONFIG__.prefixId}`, volume: __CONFIG__.radioVolume, balance: __CONFIG__.radioBalance });
                //   }
                // });

                emit('changeVolumeConsumers', playersVolume);

                __STORAGE__.lastSendingProximityEvent = currentTime;
            }
        }
    } catch (e) {
        mp.game.graphics.notify(`Voice error #1 - ${e.toString()}`)
    }
});*/

/*
  PROXIMITY FUNCTIONAL - end
*/

/*
  ACTIVATION MICROPHONE FUNCTIONAL - start
*/

mp.events.add("voice:toogleRadioMic", async (player, isEnabled) => {
    if (player && mp.players.exists(player)) {
        if (user.getCache('walkietalkie_num') != "0" && user.getCache('jail_time') == 0) {

            /*mp.game.streaming.requestAnimDict("mp_facial");
            while (!mp.game.streaming.hasAnimDictLoaded("mp_facial"))
              await methods.debug(10);

            mp.game.streaming.requestAnimDict("facials@gen_male@variations@normal");
            while (!mp.game.streaming.hasAnimDictLoaded("facials@gen_male@variations@normal"))
              await methods.debug(10);

            if (isEnabled)
              player.playFacialAnim("mic_chatter", "mp_facial");
            else
              player.playFacialAnim("mood_normal_1", "facials@gen_male@variations@normal");*/

            if (isEnabled) {
                __STORAGE__.radioState[player] = true;
                let playersVolume = [];
                // mp.events.callRemote("server:debug:print", `______VOICE RADIO HEAR______ ${player.remoteId}${__CONFIG__.prefixId}`);
                playersVolume.push({ name: `${player.remoteId}${__CONFIG__.prefixId}`, volume: __CONFIG__.radioVolume, balance: __CONFIG__.radioBalance });
                emit('changeVolumeConsumers', playersVolume);
                ui.radioSoundPeer();
                ui.radioSoundShOn();
            } else {
                __STORAGE__.radioState[player] = null;
                let playersVolume = [];
                // mp.events.callRemote("server:debug:print", `______VOICE RADIO HEAR______ ${player.remoteId}${__CONFIG__.prefixId}`);
                playersVolume.push({ name: `${player.remoteId}${__CONFIG__.prefixId}`, volume: 0.0, balance: 0.0 });
                emit('changeVolumeConsumers', playersVolume);
                ui.radioSoundShOff();
            }
        }
    }
});

mp.events.add('voice.toggleMicrophone', async (peerName, isEnabled) => {
    const playerId = getPlayerIdFromPeerId(peerName);
    const player = mp.players.atRemoteId(playerId);

    mp.game.streaming.requestAnimDict("mp_facial");
    while (!mp.game.streaming.hasAnimDictLoaded("mp_facial"))
        await methods.debug(10);

    mp.game.streaming.requestAnimDict("facials@gen_male@variations@normal");
    while (!mp.game.streaming.hasAnimDictLoaded("facials@gen_male@variations@normal"))
        await methods.debug(10);

    if (player && mp.players.exists(player)) {
        if (player !== localPlayer) {

            if (isEnabled)
                player.playFacialAnim("mic_chatter", "mp_facial");
            else
                player.playFacialAnim("mood_normal_1", "facials@gen_male@variations@normal");


            /*if (isEnabled && safeGetVoiceInfo(player, 'distance') > 100) {
                ui.radioSoundShOn();
            }
            else
                ui.radioSoundShOff();*/

            safeSetVoiceInfo(player, 'enabled', isEnabled);
        }
        /*if (!__STORAGE__.radioState[player]) {
          safeSetVoiceInfo(player, 'enabled', isEnabled);

          if (isEnabled && __RADIO__.peers.has(player)) {
            emit('changeVolumeConsumers', [{
              name: `${player.remoteId}${__CONFIG__.prefixId}`,
              volume: __CONFIG__.radioVolume,
              balance: __CONFIG__.radioBalance
            }]);
          }
        } else {

          if (!isEnabled) {
            emit('changeVolumeConsumers', [{
              name: `${player.remoteId}${__CONFIG__.prefixId}`,
              volume: 0,
              balance: 0
            }]);
          }
        }
      */
    }
});

mp.events.add('voice.changeMicrophoneActivationKey', (newActivationKey) => {
    /*mp.keys.unbind(__CONFIG__.pushToTalkKey, true, enableMicrophone);
    mp.keys.unbind(__CONFIG__.pushToTalkKey, false, disableMicrophone);

    __CONFIG__.pushToTalkKey = newActivationKey;

    mp.keys.bind(__CONFIG__.pushToTalkKey, true, enableMicrophone);
    mp.keys.bind(__CONFIG__.pushToTalkKey, false, disableMicrophone);*/
});

const enableMicrophone = async () => {
    if (
        __STORAGE__.browserReady &&
        !__STORAGE__.mutedMicrophone &&
        !__STORAGE__.enabledMicrophone
    ) {

        if (!user.isDead()) {

            mp.game.streaming.requestAnimDict("mp_facial");
            while (!mp.game.streaming.hasAnimDictLoaded("mp_facial"))
                await methods.sleep(10);
            mp.players.local.playFacialAnim("mic_chatter", "mp_facial");

            __STORAGE__.enabledMicrophone = true;
            emit('unmuteMic');
        }
    }
};

const disableMicrophone = async () => {
    if (
        __STORAGE__.browserReady &&
        !__STORAGE__.mutedMicrophone &&
        __STORAGE__.enabledMicrophone
    ) {

        mp.game.streaming.requestAnimDict("facials@gen_male@variations@normal");
        while (!mp.game.streaming.hasAnimDictLoaded("facials@gen_male@variations@normal"))
            await methods.sleep(10);
        mp.players.local.playFacialAnim("mood_normal_1", "facials@gen_male@variations@normal");

        __STORAGE__.enabledMicrophone = false;
        emit('muteMic');
    }
};

const enableMicrophoneRadio = () => {
    if (
        __STORAGE__.browserReady &&
        !__STORAGE__.mutedMicrophone &&
        !__STORAGE__.enabledMicrophone
    ) {

        if (user.isCuff() || user.isDead())
            return;

        if (!user.getCache('walkie_buy'))
            return;

        if (user.getCache('walkietalkie_num') != "0" && user.getCache('jail_time') == 0) {
            ui.radioSoundOn();
            enableMicrophone();
            mp.events.callRemote("voice.server.enableMic");
            user.playAnimation("random@arrests", "generic_radio_chatter");
        }
    }
};

const disableMicrophoneRadio = () => {
    if (
        __STORAGE__.browserReady &&
        !__STORAGE__.mutedMicrophone &&
        __STORAGE__.enabledMicrophone
    ) {

        if (user.isCuff())
            return;

        if (user.getCache('walkietalkie_num') != "0" && user.getCache('jail_time') == 0) {
            ui.radioSoundOff();
            disableMicrophone();
            mp.events.callRemote("voice.server.disableMic");
            user.stopAllAnimation();
        }
    }
};

/*mp.keys.bind(__CONFIG__.pushToTalkKey, true, enableMicrophone);
mp.keys.bind(__CONFIG__.pushToTalkKey, false, disableMicrophone);*/

mp.keys.bind(0x14, true, enableMicrophoneRadio);
mp.keys.bind(0x14, false, disableMicrophoneRadio);

mp.keys.bind(0x72, true, enableMicrophoneRadio);
mp.keys.bind(0x72, false, disableMicrophoneRadio);

/*mp.keys.bind(0x72, false, () => { // F3 - restart ice
  if (__STORAGE__.browserReady) {
    emit('restartIce');
  }
});*/

/*
    ACTIVATION MICROPHONE FUNCTIONAL - END
*/

/*
    EXAMPLE - MUTED STATUS - start
*/

const scalable = (dist, maxDist) => {
    return Math.max(0.1, 1 - (dist / maxDist));
};

const drawSprite = (dist, name, scale, heading, colour, x, y, layer) => {
    const graphics = mp.game.graphics
        , resolution = graphics.getScreenActiveResolution(0, 0)
        , textureResolution = graphics.getTextureResolution(dist, name)
        , SCALE = [(scale[0] * textureResolution.x) / resolution.x, (scale[1] * textureResolution.y) / resolution.y]

    if (graphics.hasStreamedTextureDictLoaded(dist) === 1) {
        if (typeof layer === 'number') {
            graphics.set2dLayer(layer);
        }

        graphics.drawSprite(dist, name, x, y, SCALE[0], SCALE[1], heading, colour[0], colour[1], colour[2], colour[3]);
    } else {
        graphics.requestStreamedTextureDict(dist, true);
    }
}

//mp.events.add('render', () => {
    /*const __localPlayerPosition__ = localPlayer.position;

    __STORAGE__.streamedPlayers.forEach(player => {
      if (player === localPlayer || typeof player.voice === 'undefined') {
        return false;
      }

      const __playerPosition__ = player.position;

      const distance = vdist(__localPlayerPosition__, __playerPosition__);
      if (distance <= 25 && !player.isOccluded() && !player.isDead() && player.getVariable('INVISIBLE') != true) {

        const headPosition = player.getBoneCoords(12844, 0, 0, 0);
        const headPosition2d = mp.game.graphics.world3dToScreen2d(headPosition.x, headPosition.y, headPosition.z + 0.5);

        if (!headPosition2d) {
          return false;
        }

        const scale = scalable(distance, 25);

        const scaleSprite = 0.7 * scale;

        const voiceDistance = clamp(3, 50, safeGetVoiceInfo(player, 'distance') || __CONFIG__.defaultDistance);

        const isConnected = safeGetVoiceInfo(player, 'stateConnection') === 'connected';
        const isMuted = !!safeGetVoiceInfo(player, 'muted');

        const sprite = !isMuted ?
            isConnected ?
                safeGetVoiceInfo(player, 'enabled') ?
                    voiceDistance < 10 ?
                        'leaderboard_audio_1'
                        :
                        voiceDistance <= 20 ?
                            'leaderboard_audio_2'
                            :
                            voiceDistance > 20 ?
                                'leaderboard_audio_3'
                                :
                                ''
                    :
                    'leaderboard_audio_inactive'
                : 'leaderboard_audio_mute'
            : 'leaderboard_audio_mute';

        const spriteColor = isConnected ? [255, 255, 255, 255] : [244, 80, 66, 255];

        //drawSprite("mpleaderboard", sprite, [scaleSprite, scaleSprite], 0, spriteColor, headPosition2d.x, headPosition2d.y + 0.038 * scale);
      }

    });*/
//});

/*
  EXAMPLE - MUTED STATUS - end
*/

/*
  EXAMPLE - HUD - start
*/

const drawText = (text, position, options) => {
    options = { ...{ align: 1, font: 4, scale: 0.3, outline: true, shadow: true, color: [255, 255, 255, 255] }, ...options };

    const ui = mp.game.ui;
    const font = options.font;
    const scale = options.scale;
    const outline = options.outline;
    const shadow = options.shadow;
    const color = options.color;
    const wordWrap = options.wordWrap;
    const align = options.align;
    ui.setTextEntry("CELL_EMAIL_BCON");
    for (let i = 0; i < text.length; i += 99) {
        const subStringText = text.substr(i, Math.min(99, text.length - i));
        mp.game.ui.addTextComponentSubstringPlayerName(subStringText);
    }

    ui.setTextFont(font);
    ui.setTextScale(scale, scale);
    ui.setTextColour(color[0], color[1], color[2], color[3]);

    if (shadow) {
        mp.game.invoke('0x1CA3E9EAC9D93E5E');
        ui.setTextDropshadow(2, 0, 0, 0, 255);
    }

    if (outline) {
        mp.game.invoke('0x2513DFB0FB8400FE');
    }

    switch (align) {
        case 1: {
            ui.setTextCentre(true);
            break;
        }
        case 2: {
            ui.setTextRightJustify(true);
            ui.setTextWrap(0.0, position[0] || 0);
            break;
        }
    }

    if (wordWrap) {
        ui.setTextWrap(0.0, (position[0] || 0) + wordWrap);
    }

    ui.drawText(position[0] || 0, position[1] || 0);
}

const specialKey = {
    [192]: `\\\~`
};
/*
mp.events.add('render', () => {

    if (!__CONFIG__.debug)
        return;

    const microphoneActiveText = `Microphone - ${isMutedMicrophone() ? '~r~Muted' : isEnabledMicrophone() ? '~g~active' : '~r~deactive'} (${typeof specialKey[__CONFIG__.pushToTalkKey] !== 'undefined' ? specialKey[__CONFIG__.pushToTalkKey] : String.fromCharCode(__CONFIG__.pushToTalkKey)})`;

    drawText(microphoneActiveText, [0.02, 0.59], {
        font: 4,
        scale: 0.4,
        outline: true,
        color: [255, 255, 255, 255],
        align: 0
    });

    const distance = getDistance();

    const microphoneDistanceText = `Voice-chat mode - ~y~${distance < 25 ? 'whisper' : distance === 25 ? 'standard' : distance > 25 ? 'cry' : ''} (${distance}m)`;

    drawText(microphoneDistanceText, [0.02, 0.62], {
        font: 4,
        scale: 0.4,
        outline: true,
        color: [255, 255, 255, 255],
        align: 0
    });

    let _text = '~r~closed';
    const stateConnection = getStateConnection();

    if (stateConnection === 'closed') {
        _text = '~r~closed';
    } else if (stateConnection === 'connecting') {
        _text = '~y~connecting';
    } else if (stateConnection === 'connected') {
        _text = '~g~connected';
    }

    const voiceStateText = `State connecting - ${_text}`;

    drawText(voiceStateText, [0.02, 0.65], {
        font: 4,
        scale: 0.4,
        outline: true,
        color: [255, 255, 255, 255],
        align: 0
    });
});*/

/*
    EXAMPLE - HUD - end
*/

/*
    UTILITY - start
*/


const vdist = (v1, v2) => {
    const diffY = v1.y - v2.y;
    const diffX = v1.x - v2.x;
    const diffZ = v1.z - v2.z;

    return Math.sqrt((diffY * diffY) + (diffX * diffX) + (diffZ * diffZ));
}

const getStateConnection = () => __STORAGE__.stateVoiceConnection;
const isEnabledMicrophone = () => __STORAGE__.enabledMicrophone;
const isMutedMicrophone = () => __STORAGE__.mutedMicrophone;
const getDistance = () => __STORAGE__.distance;

const safeSetVoiceInfo = (player, key, value) => {
    if (typeof player.voice === 'undefined') {
        player.voice = {
            enabled: false,
            muted: false,
            volume: 0,
            balance: 0,
            globalVolume: 0,
            _volume: 0,
            stateConnection: 'connected',
            distance: __CONFIG__.defaultDistance,
            stateChangeVolume: 'proximity'
        };
    }

    player.voice[key] = value;
};

const safeGetVoiceInfo = (player, key) => {
    if (typeof player.voice === 'undefined') {
        player.voice = {
            enabled: false,
            muted: false,
            volume: 0,
            balance: 0,
            globalVolume: 0,
            _volume: 0,
            stateConnection: 'connected',
            distance: __CONFIG__.defaultDistance,
            stateChangeVolume: 'proximity'
        };
    }

    return player.voice[key];
};

const getPlayerIdFromPeerId = (peerId) => parseInt(peerId.replace(__CONFIG__.prefixId, ''));

const setSettings = (key, val) => {
    __CONFIG__[key] = val;
};

const changeSettings = (obj) => {
    __CONFIG__ = {
        ...__CONFIG__,
        obj
    };
};

export default {
    setSettings,
    changeSettings,
    isEnabledMicrophone,
    enableMicrophone,
    disableMicrophone,
    getVoiceInfo: safeGetVoiceInfo,
    setVoiceInfo: safeSetVoiceInfo
};