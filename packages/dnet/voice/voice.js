const RadioRoomsContorller = require('./RadioRoomsContorller');

mp.events.add('playerJoin', (player) => {
  player.voice = {
    isEnabledMicrophone: false
  };

  player.radioRoom = '';
});

mp.events.add('playerQuit', (player) => {
  RadioRoomsContorller.onQuit(player.radioRoom, player);
});

//Инит
mp.events.add('voice.server.initRadio', (player, frequency) => {
  if (!RadioRoomsContorller.hasRoom(frequency)) {
    RadioRoomsContorller.createRoom(frequency);
  }

  RadioRoomsContorller.onJoin(frequency, player);
});

//Изменить частоту рации
mp.events.add('voice.server.changeRadioFrequency', (player, frequency) => {
  RadioRoomsContorller.onQuit(player.radioRoom, player);

  if (!RadioRoomsContorller.hasRoom(frequency)) {
    RadioRoomsContorller.createRoom(frequency);
  }

  RadioRoomsContorller.onJoin(frequency, player);
});

// Выключение рации
mp.events.add('voice.server.quitRadio', (player) => {
  RadioRoomsContorller.onQuit(player.radioRoom, player);
});

mp.events.add('voice.server.enableMic', (player) => {
  console.log("enableMic: "+player.radioRoom)
  RadioRoomsContorller.enableMic(player.radioRoom, player);
});

mp.events.add('voice.server.disableMic', (player) => {
  console.log("disableMic: "+player.radioRoom)
  RadioRoomsContorller.disableMic(player.radioRoom, player);
});

/*
	MAIN VOICE EVENTS - start
*/
mp.events.add('voice.changeStateConnection', (player, state) => {
  player.data['voice.stateConnection'] = state;
});

mp.events.add('voice.toggleMicrophone', (player, isEnabled) => {
  mp.players.call(player.streamedPlayers, 'voice.toggleMicrophone', [player, isEnabled]);
  player.voice.isEnabledMicrophone = isEnabled;
});

/*
	MAIN VOICE EVENTS - end
*/

/*
    UTILITY FUNCTIONS - start
*/

const setVoiceDistance = (player, distance) => {
  player.data['voice.distance'] = distance;
};

const getVoiceDistance = (player) => player.data['voice.distance'];

const isEnabledMicrophone = (player) => player.voice.isEnabledMicrophone;

const setVoiceMuted = (player, muted) => {
  player.data['voice.muted'] = muted;
};

const getVoiceMuted = (player) => player.data['voice.muted'];

const setMicrophoneKey = (player, key) => {
  player.voice.microphoneKey = key;
  player.call('voice.changeMicrophoneActivationKey', [key]);
};

const getMicrophoneKey = (player) => player.voice.microphoneKey;

const vmethods = {
  getMicrophoneKey,
  setMicrophoneKey,
  getVoiceMuted,
  setVoiceMuted,
  getVoiceDistance,
  setVoiceDistance,
  isEnabledMicrophone
};

mp.events.add('voice.server.callMethod', (method, ...args) => {
  if (typeof vmethods[method] === 'function') {
    return vmethods[method](...args);
  }
});

module.exports = vmethods;